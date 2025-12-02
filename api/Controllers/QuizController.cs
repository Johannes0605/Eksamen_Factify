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
            // Extract user ID from JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            // Retrieve only quizzes belonging to this user (filtered in SQL)
            var userQuizzes = await _quizRepository.GetQuizzesByUserIdAsync(userId);
            return Ok(userQuizzes);
        }

        // GET: api/quiz/5
        [AllowAnonymous]  // Allow anyone to view a quiz via link
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuizById(int id)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            if (quiz == null)
                return NotFound();
            return Ok(quiz);
        }

        // POST: api/quiz - Create new quiz
        [HttpPost]
        public async Task<ActionResult> CreateQuiz([FromBody] Quiz quiz)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            // Associate quiz with authenticated user
            quiz.UserId = userId;
            
            await _quizRepository.AddQuizAsync(quiz);
            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizId }, quiz);
        }

        // PUT: api/quiz/5 - Update existing quiz
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

            // Verify ownership before allowing update
            var existingQuiz = await _quizRepository.GetQuizByIdAsync(id);
            if (existingQuiz == null)
                return NotFound();
            if (existingQuiz.UserId != userId)
                return Forbid();  // User doesn't own this quiz

            await _quizRepository.UpdateQuizAsync(quiz);
            return NoContent();
        }

        // DELETE: api/quiz/5 - Delete quiz
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

            // Verify ownership before allowing deletion
            if (quiz.UserId != userId)
                return Forbid();  // User doesn't own this quiz

            await _quizRepository.DeleteQuizAsync(id);
            return NoContent();
        }

        // POST: api/quiz/{id}/duplicate - Create a copy of an existing quiz
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

            // Deep copy quiz with all questions and options
            var duplicatedQuiz = new Quiz
            {
                Title = originalQuiz.Title + " Copy",
                Description = originalQuiz.Description,
                UserId = userId,  // Assign to current user
                CreatedDate = DateTime.UtcNow,
                LastUsedDate = DateTime.UtcNow,
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
