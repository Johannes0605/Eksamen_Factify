using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    // Represents a quiz with a title, description, and associated questions
    public class Quiz
    {
        public int QuizId { get; set; }

        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public List<Question> Questions { get; set; } = new();
    }
}