using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sarve.Backend.Data.Repositories;
using Sarve.Backend.Models;
using System.Security.Claims;

namespace Sarve.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LabelsController : ControllerBase
    {
        private readonly LabelRepository _labelRepository;

        public LabelsController(LabelRepository labelRepository)
        {
            _labelRepository = labelRepository;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = GetUserId();
            var labels = _labelRepository.GetByUserId(userId);
            return Ok(labels);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var userId = GetUserId();
            var label = _labelRepository.GetById(id);

            if (label == null || label.UserId != userId)
            {
                return NotFound(new { message = "برچسب یافت نشد." });
            }

            return Ok(label);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateLabelRequest request)
        {
            var userId = GetUserId();

            var label = new Label
            {
                UserId = userId,
                Name = request.Name.Trim(),
                Color = request.Color,
                CreatedAt = DateTime.UtcNow
            };

            _labelRepository.Insert(label);

            return CreatedAtAction(nameof(GetById), new { id = label.Id }, label);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] UpdateLabelRequest request)
        {
            var userId = GetUserId();
            var label = _labelRepository.GetById(id);

            if (label == null || label.UserId != userId)
            {
                return NotFound(new { message = "برچسب یافت نشد." });
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                label.Name = request.Name.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.Color))
            {
                label.Color = request.Color;
            }

            _labelRepository.Update(label);

            return Ok(label);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var userId = GetUserId();
            var label = _labelRepository.GetById(id);

            if (label == null || label.UserId != userId)
            {
                return NotFound(new { message = "برچسب یافت نشد." });
            }

            _labelRepository.Delete(id);

            return Ok(new { message = "برچسب با موفقیت حذف شد." });
        }
    }

    public class CreateLabelRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = "#6B7280";
    }

    public class UpdateLabelRequest
    {
        public string? Name { get; set; }
        public string? Color { get; set; }
    }
}
