using System;
using System.Collections.Generic;

namespace Sarve.Backend.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? GoogleEmail { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        // OAuth provider (null for password-based, "google" for Google OAuth)
        public string? OAuthProvider { get; set; }
        public string? OAuthId { get; set; }
    }
}
