using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    // Represents a quiz with a title, description, and associated questions
    public class Quiz
    {
        [Key]
        public int QuizId { get; set; }

        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Foreign key to User who created this quiz
        public int UserId { get; set; }

        public List<Question> Questions { get; set; } = new();
    }
}