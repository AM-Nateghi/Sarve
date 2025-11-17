using System;
using System.Collections.Generic;

namespace Sarve.Backend.Models
{
    public class AudioSession
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public List<string> ExtractedTasks { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsProcessed { get; set; } = false;
    }
}
