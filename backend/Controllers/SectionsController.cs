using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sarve.Backend.Data.Repositories;
using Sarve.Backend.DTOs;
using Sarve.Backend.Models;
using System.Security.Claims;

namespace Sarve.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SectionsController : ControllerBase
    {
        private readonly SectionRepository _sectionRepository;

        public SectionsController(SectionRepository sectionRepository)
        {
            _sectionRepository = sectionRepository;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        private SectionDTO MapToDTO(Section section)
        {
            return new SectionDTO
            {
                Id = section.Id,
                Name = section.Name,
                IsDeletable = section.IsDeletable,
                Order = section.Order,
                CreatedAt = section.CreatedAt
            };
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = GetUserId();
            var sections = _sectionRepository.GetByUserId(userId);
            var sectionDtos = sections.Select(MapToDTO).ToList();
            return Ok(sectionDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var userId = GetUserId();
            var section = _sectionRepository.GetById(id);

            if (section == null || section.UserId != userId)
            {
                return NotFound(new { message = "سکشن یافت نشد." });
            }

            return Ok(MapToDTO(section));
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateSectionRequest request)
        {
            var userId = GetUserId();

            var section = new Section
            {
                UserId = userId,
                Name = request.Name.Trim(),
                Order = request.Order,
                IsDeletable = true,
                CreatedAt = DateTime.UtcNow
            };

            _sectionRepository.Insert(section);

            return CreatedAtAction(nameof(GetById), new { id = section.Id }, MapToDTO(section));
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] CreateSectionRequest request)
        {
            var userId = GetUserId();
            var section = _sectionRepository.GetById(id);

            if (section == null || section.UserId != userId)
            {
                return NotFound(new { message = "سکشن یافت نشد." });
            }

            section.Name = request.Name.Trim();
            section.Order = request.Order;

            _sectionRepository.Update(section);

            return Ok(MapToDTO(section));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var userId = GetUserId();
            var section = _sectionRepository.GetById(id);

            if (section == null || section.UserId != userId)
            {
                return NotFound(new { message = "سکشن یافت نشد." });
            }

            if (!section.IsDeletable)
            {
                return BadRequest(new { message = "این سکشن قابل حذف نیست." });
            }

            var deleted = _sectionRepository.Delete(id);

            if (!deleted)
            {
                return BadRequest(new { message = "حذف سکشن با مشکل مواجه شد." });
            }

            return Ok(new { message = "سکشن با موفقیت حذف شد." });
        }
    }
}
