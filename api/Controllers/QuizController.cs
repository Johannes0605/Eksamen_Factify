using Microsoft.AspNetCore.Mvc;
using QuizApp.DAL;
using QuizApp.Models;

namespace QuizApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizRepository _quizRepository;

        public QuizController(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository;
        }

        // GET: api/quiz
        [HttpGet]
        public async Task<ActionResult<List<Quiz>>> GetAllQuizzes()
        {
            var quizzes = await _quizRepository.GetAllQuizzesAsync();
            return Ok(quizzes);
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
            await _quizRepository.AddQuizAsync(quiz);
            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizId }, quiz);
        }

        // PUT: api/quiz/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateQuiz(int id, [FromBody] Quiz quiz)
        {
            if (id != quiz.QuizId)
                return BadRequest("Quiz ID mismatch.");

            await _quizRepository.UpdateQuizAsync(quiz);
            return NoContent();
        }

        // DELETE: api/quiz/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            await _quizRepository.DeleteQuizAsync(id);
            return NoContent();
        }
    }
}
