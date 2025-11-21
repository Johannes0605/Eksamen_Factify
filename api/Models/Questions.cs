using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    // Represents a quiz question
    public class Question
    {
        [Key]
        public int QuestionId { get; set; }

        [Required, StringLength(300)]
        public string QuestionText { get; set; } = string.Empty;

        public int QuizId { get; set; }
        public Quiz? Quiz { get; set; }

        public List<Options> Options { get; set; } = new();
    }
}