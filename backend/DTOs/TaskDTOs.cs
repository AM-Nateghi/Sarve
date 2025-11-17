using System.ComponentModel.DataAnnotations;

namespace Sarve.Backend.DTOs
{
    // درخواست ایجاد وظیفه
    public class CreateTaskRequest
    {
        [Required(ErrorMessage = "عنوان وظیفه الزامی است")]
        [MaxLength(200, ErrorMessage = "عنوان نباید بیشتر از 200 کاراکتر باشد")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Range(1, 4, ErrorMessage = "اولویت باید بین 1 تا 4 باشد")]
        public int Priority { get; set; } = 1;

        public DateTime? Deadline { get; set; }

        public string SectionId { get; set; } = "default";

        public List<string> LabelIds { get; set; } = new();

        public string? GoalId { get; set; }
    }

    // درخواست بروزرسانی وظیفه
    public class UpdateTaskRequest
    {
        [MaxLength(200, ErrorMessage = "عنوان نباید بیشتر از 200 کاراکتر باشد")]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [Range(1, 4, ErrorMessage = "اولویت باید بین 1 تا 4 باشد")]
        public int? Priority { get; set; }

        public DateTime? Deadline { get; set; }

        public string? SectionId { get; set; }

        public List<string>? LabelIds { get; set; }

        public string? GoalId { get; set; }

        public int? Order { get; set; }
    }

    // پاسخ وظیفه
    public class TaskDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? Deadline { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsCompleted { get; set; }
        public string SectionId { get; set; } = string.Empty;
        public List<string> LabelIds { get; set; } = new();
        public string? GoalId { get; set; }
        public int TimeSpent { get; set; }
        public string? AudioFilePath { get; set; }
        public int Order { get; set; }
    }

    // درخواست ذخیره زمان
    public class SaveTimeRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "زمان باید مثبت باشد")]
        public int Seconds { get; set; }
    }

    // درخواست ایجاد سکشن
    public class CreateSectionRequest
    {
        [Required(ErrorMessage = "نام سکشن الزامی است")]
        [MaxLength(100, ErrorMessage = "نام سکشن نباید بیشتر از 100 کاراکتر باشد")]
        public string Name { get; set; } = string.Empty;

        public int Order { get; set; } = 0;
    }

    // پاسخ سکشن
    public class SectionDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsDeletable { get; set; }
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
