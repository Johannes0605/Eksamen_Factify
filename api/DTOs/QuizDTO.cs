using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    
    public class QuizDto
    {
        public int QuizId {get; set;}

        [Required]
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The name must be numbers or letters and between 2 to 20 characters.")]
        [Display(Name = "Quiz title")]
        public string Title { get; set;} = string.Empty; 

        [StringLength(200)]
        public string? Description {get; set; }
    }
}