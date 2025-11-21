using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Represents a user in the quiz application
namespace QuizApp.Models
{
    public class User
    {
        // Primary key for the User entity
        [Key]

        // Auto-incremented user ID
        public int UserId { get; set; }

        // Username of the user (display name)
        public string Username { get; set; } = string.Empty;

        // Email of the user (used for login)
        public string Email { get; set; } = string.Empty;

        // Password hash of the user (never store plain passwords!)
        public string PasswordHash { get; set; } = string.Empty;

        // Track when the user was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
