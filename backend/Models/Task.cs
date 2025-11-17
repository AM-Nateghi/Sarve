using System;
using System.Collections.Generic;

namespace Sarve.Backend.Models
{
    public class TaskItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Priority { get; set; } = 1; // 1: Low, 2: Medium, 3: High, 4: Urgent
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? Deadline { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsCompleted { get; set; } = false;

        // Section
        public string SectionId { get; set; } = "default";

        // Labels (list of label IDs)
        public List<string> LabelIds { get; set; } = new();

        // Goal (optional)
        public string? GoalId { get; set; }

        // Time tracking (in seconds)
        public int TimeSpent { get; set; } = 0;

        // Audio file path (if attached)
        public string? AudioFilePath { get; set; }

        // Order in list
        public int Order { get; set; } = 0;
    }
}
