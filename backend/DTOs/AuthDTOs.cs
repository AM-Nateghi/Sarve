using System.ComponentModel.DataAnnotations;

namespace Sarve.Backend.DTOs
{
    // درخواست ثبت‌نام
    public class RegisterRequest
    {
        [Required(ErrorMessage = "نام الزامی است")]
        [MinLength(2, ErrorMessage = "نام باید حداقل 2 کاراکتر باشد")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "نام خانوادگی الزامی است")]
        [MinLength(2, ErrorMessage = "نام خانوادگی باید حداقل 2 کاراکتر باشد")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل صحیح نیست")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^(09\d{9}|(\+98|0098)9\d{9})$", ErrorMessage = "فرمت شماره تلفن صحیح نیست")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        [MinLength(8, ErrorMessage = "رمز عبور باید حداقل 8 کاراکتر باشد")]
        public string Password { get; set; } = string.Empty;
    }

    // درخواست ورود
    public class LoginRequest
    {
        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل صحیح نیست")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        public string Password { get; set; } = string.Empty;
    }

    // پاسخ احراز هویت
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDTO User { get; set; } = null!;
    }

    // اطلاعات کاربر (برای response)
    public class UserDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? GoogleEmail { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // بروزرسانی پروفایل
    public class UpdateProfileRequest
    {
        [MinLength(2, ErrorMessage = "نام باید حداقل 2 کاراکتر باشد")]
        public string? FirstName { get; set; }

        [MinLength(2, ErrorMessage = "نام خانوادگی باید حداقل 2 کاراکتر باشد")]
        public string? LastName { get; set; }

        [RegularExpression(@"^(09\d{9}|(\+98|0098)9\d{9})$", ErrorMessage = "فرمت شماره تلفن صحیح نیست")]
        public string? PhoneNumber { get; set; }
    }

    // تغییر رمز عبور
    public class ChangePasswordRequest
    {
        [Required(ErrorMessage = "رمز عبور فعلی الزامی است")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "رمز عبور جدید الزامی است")]
        [MinLength(8, ErrorMessage = "رمز عبور باید حداقل 8 کاراکتر باشد")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
