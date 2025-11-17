namespace Sarve.Backend.DTOs
{
    // پاسخ موفقیت‌آمیز
    public class SuccessResponse
    {
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
    }

    // پاسخ خطا
    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }
        public int StatusCode { get; set; }
    }

    // پاسخ لیست صفحه‌بندی شده
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
