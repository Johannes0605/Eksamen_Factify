using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using QuizApp.DAL;
using QuizApp.Models;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/quiz/public")]
    public class PublicQuizController : ControllerBase
    {
        private readonly IQuizRepository _quizRepository;

        public PublicQuizController(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository;
        }

        // GET: api/quiz/public
        // Returns demo/public quizzes. This endpoint is intentionally anonymous.
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<Quiz>>> GetPublicQuizzes()
        {
            var quizzes = await _quizRepository.GetAllQuizzesAsync();
            var demos = quizzes.Where(q => !string.IsNullOrWhiteSpace(q.Title) && q.Title.ToLower().Contains("demo")).ToList();
            if (!demos.Any()) return NotFound();
            return Ok(demos);
        }

        // GET: api/quiz/public/{id}
        // Returns a single demo quiz by id if it is a demo quiz.
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Quiz>> GetPublicQuizById(int id)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();
            if (string.IsNullOrWhiteSpace(quiz.Title) || !quiz.Title.ToLower().Contains("demo"))
            {
                return Forbid(); // it's not a public/demo quiz
            }
            return Ok(quiz);
        }
    }
}
