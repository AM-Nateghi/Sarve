using System;

namespace Sarve.Backend.Models
{
    public class Label
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = "#6B7280"; // Default gray
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
