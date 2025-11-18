using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sarve.Backend.Services;
using System.Security.Claims;

namespace Sarve.Backend.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly GeminiService _geminiService;
        private readonly ILogger<AIController> _logger;

        public AIController(GeminiService geminiService, ILogger<AIController> logger)
        {
            _geminiService = geminiService;
            _logger = logger;
        }

        // استخراج وظایف از متن
        [HttpPost("extract-tasks")]
        public async Task<IActionResult> ExtractTasks([FromBody] ExtractTasksRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("User not authenticated");

                if (string.IsNullOrWhiteSpace(request.Input))
                {
                    return BadRequest(new { message = "متن ورودی نمی‌تواند خالی باشد" });
                }

                var tasks = await _geminiService.ExtractTasksAsync(request.Input, userId);

                return Ok(new
                {
                    success = true,
                    tasks = tasks,
                    count = tasks.Count
                });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Rate limit"))
            {
                return StatusCode(429, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ExtractTasks");
                return StatusCode(500, new { message = "خطا در استخراج وظایف" });
            }
        }

        // تولید گزارش هوشمند
        [HttpPost("generate-report")]
        public async Task<IActionResult> GenerateReport([FromBody] ReportRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("User not authenticated");

                if (request.Tasks == null || !request.Tasks.Any())
                {
                    return BadRequest(new { message = "لیست وظایف نمی‌تواند خالی باشد" });
                }

                var report = await _geminiService.GenerateReportAsync(request, userId);

                return Ok(new
                {
                    success = true,
                    report = report
                });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Rate limit"))
            {
                return StatusCode(429, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GenerateReport");
                return StatusCode(500, new { message = "خطا در تولید گزارش" });
            }
        }

        // بررسی وضعیت سلامت AI service
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                status = "healthy",
                service = "Gemini AI",
                timestamp = DateTime.UtcNow
            });
        }
    }

    // DTOs
    public class ExtractTasksRequest
    {
        public string Input { get; set; } = string.Empty;
    }
}
