using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sarve.Backend.Data.Repositories;
using Sarve.Backend.DTOs;
using Sarve.Backend.Models;
using Sarve.Backend.Services;
using System.Security.Claims;

namespace Sarve.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly SectionRepository _sectionRepository;
        private readonly JwtService _jwtService;
        private readonly PasswordService _passwordService;

        public AuthController(
            UserRepository userRepository,
            SectionRepository sectionRepository,
            JwtService jwtService,
            PasswordService passwordService)
        {
            _userRepository = userRepository;
            _sectionRepository = sectionRepository;
            _jwtService = jwtService;
            _passwordService = passwordService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // بررسی وجود ایمیل
            if (_userRepository.EmailExists(request.Email))
            {
                return BadRequest(new { message = "این ایمیل قبلاً ثبت شده است." });
            }

            // بررسی وجود شماره تلفن
            if (_userRepository.PhoneExists(request.PhoneNumber))
            {
                return BadRequest(new { message = "این شماره تلفن قبلاً ثبت شده است." });
            }

            // ایجاد کاربر جدید
            var user = new User
            {
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = request.Email.Trim().ToLower(),
                PhoneNumber = request.PhoneNumber.Trim(),
                PasswordHash = _passwordService.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            _userRepository.Insert(user);

            // ایجاد سکشن پیش‌فرض برای کاربر
            _sectionRepository.EnsureDefaultSection(user.Id);

            // تولید توکن
            var token = _jwtService.GenerateToken(user);

            var userDto = new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt
            };

            return Ok(new AuthResponse { Token = token, User = userDto });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // یافتن کاربر با ایمیل
            var user = _userRepository.GetByEmail(request.Email.Trim().ToLower());

            if (user == null)
            {
                return Unauthorized(new { message = "ایمیل یا رمز عبور اشتباه است." });
            }

            // بررسی رمز عبور
            if (user.PasswordHash == null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "ایمیل یا رمز عبور اشتباه است." });
            }

            // بررسی فعال بودن کاربر
            if (!user.IsActive)
            {
                return Unauthorized(new { message = "حساب کاربری شما غیرفعال است." });
            }

            // تولید توکن
            var token = _jwtService.GenerateToken(user);

            var userDto = new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                GoogleEmail = user.GoogleEmail,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt
            };

            return Ok(new AuthResponse { Token = token, User = userDto });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "کاربر احراز هویت نشده است." });
            }

            var user = _userRepository.GetById(userId);

            if (user == null)
            {
                return NotFound(new { message = "کاربر یافت نشد." });
            }

            var userDto = new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                GoogleEmail = user.GoogleEmail,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDto);
        }

        [Authorize]
        [HttpPut("profile")]
        public IActionResult UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = _userRepository.GetById(userId);

            if (user == null)
            {
                return NotFound(new { message = "کاربر یافت نشد." });
            }

            // بروزرسانی فیلدها
            if (!string.IsNullOrWhiteSpace(request.FirstName))
            {
                user.FirstName = request.FirstName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.LastName))
            {
                user.LastName = request.LastName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                // بررسی عدم تکراری بودن شماره تلفن
                if (_userRepository.Exists(x => x.PhoneNumber == request.PhoneNumber && x.Id != userId))
                {
                    return BadRequest(new { message = "این شماره تلفن قبلاً ثبت شده است." });
                }
                user.PhoneNumber = request.PhoneNumber.Trim();
            }

            user.UpdatedAt = DateTime.UtcNow;
            _userRepository.Update(user);

            var userDto = new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                GoogleEmail = user.GoogleEmail,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDto);
        }

        [Authorize]
        [HttpPut("password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = _userRepository.GetById(userId);

            if (user == null || user.PasswordHash == null)
            {
                return NotFound(new { message = "کاربر یافت نشد." });
            }

            // بررسی رمز عبور فعلی
            if (!_passwordService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "رمز عبور فعلی اشتباه است." });
            }

            // بروزرسانی رمز عبور
            user.PasswordHash = _passwordService.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            _userRepository.Update(user);

            return Ok(new { message = "رمز عبور با موفقیت تغییر یافت." });
        }

        [Authorize]
        [HttpGet("verify")]
        public IActionResult VerifyToken()
        {
            return Ok(new { valid = true });
        }
    }
}
