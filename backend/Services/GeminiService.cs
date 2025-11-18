using Google.GenerativeAI;
using Google.GenerativeAI.Models;
using System.Text.Json;

namespace Sarve.Backend.Services
{
    public class GeminiService
    {
        private readonly GenerativeModel _model;
        private readonly ILogger<GeminiService> _logger;
        private readonly Dictionary<string, Queue<DateTime>> _rateLimitTracker;
        private const int MaxRequestsPerMinute = 10;

        public GeminiService(IConfiguration configuration, ILogger<GeminiService> logger)
        {
            var apiKey = configuration["GoogleAI:ApiKey"]
                ?? Environment.GetEnvironmentVariable("GOOGLE_AI_API_KEY")
                ?? throw new InvalidOperationException("Google AI API Key is not configured");

            var model = configuration["GoogleAI:Model"] ?? "gemini-2.0-flash-exp";

            _model = new GenerativeModel(apiKey, model);
            _logger = logger;
            _rateLimitTracker = new Dictionary<string, Queue<DateTime>>();
        }

        // بررسی rate limit
        private bool CheckRateLimit(string userId)
        {
            lock (_rateLimitTracker)
            {
                if (!_rateLimitTracker.ContainsKey(userId))
                {
                    _rateLimitTracker[userId] = new Queue<DateTime>();
                }

                var userQueue = _rateLimitTracker[userId];
                var now = DateTime.UtcNow;

                // پاک کردن درخواست‌های قدیمی‌تر از 1 دقیقه
                while (userQueue.Count > 0 && (now - userQueue.Peek()).TotalMinutes > 1)
                {
                    userQueue.Dequeue();
                }

                // بررسی محدودیت
                if (userQueue.Count >= MaxRequestsPerMinute)
                {
                    return false;
                }

                userQueue.Enqueue(now);
                return true;
            }
        }

        // استخراج وظایف از متن یا صوت
        public async Task<List<ExtractedTask>> ExtractTasksAsync(string input, string userId, int retryCount = 0)
        {
            if (!CheckRateLimit(userId))
            {
                throw new InvalidOperationException("Rate limit exceeded. Maximum 10 requests per minute.");
            }

            try
            {
                var prompt = $@"شما یک دستیار هوشمند برای مدیریت وظایف هستید. از متن زیر، وظایف را استخراج کنید و به صورت JSON بازگردانید.

متن: {input}

خروجی باید به این فرمت باشد:
{{
    ""tasks"": [
        {{
            ""title"": ""عنوان وظیفه"",
            ""description"": ""توضیحات اختیاری"",
            ""priority"": 2,
            ""deadline"": ""2025-01-20T00:00:00Z""
        }}
    ]
}}

نکات:
- priority: 1 (کم), 2 (متوسط), 3 (زیاد), 4 (فوری)
- deadline فقط اگر در متن ذکر شده باشد
- اگر وظیفه‌ای نبود، آرایه خالی برگردان
- فقط JSON بازگردان، بدون توضیح اضافی";

                var response = await _model.GenerateContentAsync(prompt);
                var jsonResponse = response.Text.Trim();

                // پاک کردن markdown code blocks اگر وجود داشت
                if (jsonResponse.StartsWith("```json"))
                {
                    jsonResponse = jsonResponse.Substring(7);
                }
                if (jsonResponse.StartsWith("```"))
                {
                    jsonResponse = jsonResponse.Substring(3);
                }
                if (jsonResponse.EndsWith("```"))
                {
                    jsonResponse = jsonResponse.Substring(0, jsonResponse.Length - 3);
                }
                jsonResponse = jsonResponse.Trim();

                var result = JsonSerializer.Deserialize<TaskExtractionResponse>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result?.Tasks ?? new List<ExtractedTask>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting tasks from AI");

                // Retry logic - حداکثر 2 بار
                if (retryCount < 2)
                {
                    _logger.LogInformation($"Retrying... Attempt {retryCount + 1}");
                    await Task.Delay(1000 * (retryCount + 1)); // Exponential backoff
                    return await ExtractTasksAsync(input, userId, retryCount + 1);
                }

                throw;
            }
        }

        // تولید گزارش هوشمند
        public async Task<SmartReport> GenerateReportAsync(ReportRequest request, string userId, int retryCount = 0)
        {
            if (!CheckRateLimit(userId))
            {
                throw new InvalidOperationException("Rate limit exceeded. Maximum 10 requests per minute.");
            }

            try
            {
                var tasksJson = JsonSerializer.Serialize(request.Tasks, new JsonSerializerOptions { WriteIndented = true });

                var prompt = $@"شما یک دستیار تحلیلگر برای مدیریت وظایف هستید. بر اساس داده‌های زیر، یک گزارش هوشمند و تحلیلی تولید کنید.

وظایف:
{tasksJson}

بازه زمانی: {request.StartDate:yyyy-MM-dd} تا {request.EndDate:yyyy-MM-dd}

گزارش باید شامل:
1. خلاصه کلی (summary): یک پاراگراف کوتاه درباره عملکرد
2. آمار کلی (statistics): تعداد کل، تکمیل شده، در انتظار، میانگین زمان
3. نکات قوت (strengths): 3-5 مورد از نکات مثبت
4. پیشنهادات بهبود (improvements): 3-5 پیشنهاد عملی
5. وظایف پرتکرار (patterns): الگوهای تکراری در وظایف

خروجی را به صورت JSON با این فرمت برگردان:
{{
    ""summary"": ""خلاصه..."",
    ""statistics"": {{
        ""total"": 0,
        ""completed"": 0,
        ""pending"": 0,
        ""averageCompletionTime"": ""2.5 روز""
    }},
    ""strengths"": [""...""],
    ""improvements"": [""...""],
    ""patterns"": [""...""]
}}";

                var response = await _model.GenerateContentAsync(prompt);
                var jsonResponse = response.Text.Trim();

                // پاک کردن markdown code blocks
                if (jsonResponse.StartsWith("```json"))
                {
                    jsonResponse = jsonResponse.Substring(7);
                }
                if (jsonResponse.StartsWith("```"))
                {
                    jsonResponse = jsonResponse.Substring(3);
                }
                if (jsonResponse.EndsWith("```"))
                {
                    jsonResponse = jsonResponse.Substring(0, jsonResponse.Length - 3);
                }
                jsonResponse = jsonResponse.Trim();

                var result = JsonSerializer.Deserialize<SmartReport>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new SmartReport();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating smart report");

                // Retry logic
                if (retryCount < 2)
                {
                    _logger.LogInformation($"Retrying... Attempt {retryCount + 1}");
                    await Task.Delay(1000 * (retryCount + 1));
                    return await GenerateReportAsync(request, userId, retryCount + 1);
                }

                throw;
            }
        }
    }

    // DTOs
    public class TaskExtractionResponse
    {
        public List<ExtractedTask> Tasks { get; set; } = new();
    }

    public class ExtractedTask
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Priority { get; set; } = 2;
        public DateTime? Deadline { get; set; }
    }

    public class ReportRequest
    {
        public List<TaskSummary> Tasks { get; set; } = new();
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class TaskSummary
    {
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int Priority { get; set; }
        public int TimeSpentSeconds { get; set; }
    }

    public class SmartReport
    {
        public string Summary { get; set; } = string.Empty;
        public ReportStatistics Statistics { get; set; } = new();
        public List<string> Strengths { get; set; } = new();
        public List<string> Improvements { get; set; } = new();
        public List<string> Patterns { get; set; } = new();
    }

    public class ReportStatistics
    {
        public int Total { get; set; }
        public int Completed { get; set; }
        public int Pending { get; set; }
        public string AverageCompletionTime { get; set; } = string.Empty;
    }
}
