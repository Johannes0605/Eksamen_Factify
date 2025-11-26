using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using QuizApp.DAL;
using QuizApp.Models;

namespace QuizApp.Controllers
{
    [Authorize]  // Require authentication for all endpoints in this controller
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizRepository _quizRepository;

        public QuizController(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository;
        }

        // GET: api/quiz - Get quizzes for the authenticated user
        [HttpGet]
        public async Task<ActionResult<List<Quiz>>> GetAllQuizzes()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var allQuizzes = await _quizRepository.GetAllQuizzesAsync();
            var userQuizzes = allQuizzes.Where(q => q.UserId == userId).ToList();
            return Ok(userQuizzes);
        }

        // GET: api/quiz/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuizById(int id)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            if (quiz == null)
                return NotFound();
            return Ok(quiz);
        }

        // POST: api/quiz
        [HttpPost]
        public async Task<ActionResult> CreateQuiz([FromBody] Quiz quiz)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            // Set the UserId for the quiz
            quiz.UserId = userId;
            
            await _quizRepository.AddQuizAsync(quiz);
            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizId }, quiz);
        }

        // PUT: api/quiz/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateQuiz(int id, [FromBody] Quiz quiz)
        {
            if (id != quiz.QuizId)
                return BadRequest("Quiz ID mismatch.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            // Verify the quiz belongs to the user
            var existingQuiz = await _quizRepository.GetQuizByIdAsync(id);
            if (existingQuiz == null)
                return NotFound();
            if (existingQuiz.UserId != userId)
                return Forbid();

            await _quizRepository.UpdateQuizAsync(quiz);
            return NoContent();
        }

        // DELETE: api/quiz/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            if (quiz == null)
                return NotFound();

            // Verify the quiz belongs to the user
            if (quiz.UserId != userId)
                return Forbid();

            await _quizRepository.DeleteQuizAsync(id);
            return NoContent();
        }

        // POST: api/quiz/{id}/duplicate
        [HttpPost("{id}/duplicate")]
        public async Task<ActionResult> DuplicateQuiz(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var originalQuiz = await _quizRepository.GetQuizByIdAsync(id);
            if (originalQuiz == null)
                return NotFound();

            // Create a copy of the quiz
            var duplicatedQuiz = new Quiz
            {
                Title = $"{originalQuiz.Title} (Copy)",
                Description = originalQuiz.Description,
                UserId = userId,
                Questions = originalQuiz.Questions.Select(q => new Question
                {
                    QuestionText = q.QuestionText,
                    Options = q.Options.Select(o => new Options
                    {
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            await _quizRepository.AddQuizAsync(duplicatedQuiz);
            return CreatedAtAction(nameof(GetQuizById), new { id = duplicatedQuiz.QuizId }, duplicatedQuiz);
        }
    }
}
