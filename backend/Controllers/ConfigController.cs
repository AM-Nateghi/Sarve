using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Sarve.Backend.Controllers
{
    [ApiController]
    [Route("api/config")]
    [Authorize]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // دریافت Google AI API Key
        [HttpGet("gemini-key")]
        public IActionResult GetGeminiApiKey()
        {
            var apiKey = _configuration["GoogleAI:ApiKey"]
                ?? Environment.GetEnvironmentVariable("GOOGLE_AI_API_KEY");

            if (string.IsNullOrEmpty(apiKey))
            {
                return NotFound(new { message = "Google AI API Key is not configured" });
            }

            return Ok(new { apiKey });
        }
    }
}
