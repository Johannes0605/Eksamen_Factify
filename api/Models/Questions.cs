using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizApp.Models
{
    public class Question
    {
        [Key]
        public int QuestionId { get; set; }

        [Required, StringLength(300)]
        public string QuestionText { get; set; } = string.Empty;

        public int QuizId { get; set; }

        [JsonIgnore]
        public Quiz? Quiz { get; set; }

        public List<Options> Options { get; set; } = new();
    }
}
