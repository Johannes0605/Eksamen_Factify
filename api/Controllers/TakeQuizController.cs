using Microsoft.AspNetCore.Mvc;
using QuizApp.DAL;

namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TakeQuizController : ControllerBase
    {
        private readonly IQuizRepository _repository;
        private readonly ILogger<TakeQuizController> _logger;

        public TakeQuizController(IQuizRepository repository, ILogger<TakeQuizController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET api/takequiz/5 - Fetch quiz for taking (public endpoint)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizForTaking(int id)
        {
            var quiz = await _repository.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();

            return Ok(quiz);
        }

        // POST api/takequiz/submit - Grade quiz attempt
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitAnswers([FromBody] QuizSubmissionDto submission)
        {
            var quiz = await _repository.GetQuizByIdAsync(submission.QuizId);
            if (quiz == null) return NotFound();

            int score = 0;
            int total = quiz.Questions.Count;

            // Check each question for correct answers
            foreach (var question in quiz.Questions)
            {
                // Get all correct option IDs for this question
                var correctAnswers = question.Options
                    .Where(o => o.IsCorrect)
                    .Select(o => o.OptionsId)
                    .OrderBy(id => id)
                    .ToList();

                // Get user's selected options for this question
                var chosen = submission.SelectedAnswers
                    .Where(id => question.Options.Any(o => o.OptionsId == id))
                    .OrderBy(id => id)
                    .ToList();

                // Award point only if all correct answers selected
                if (chosen.SequenceEqual(correctAnswers))
                    score++;
            }

            return Ok(new 
            { 
                score, 
                total 
            });
        }
    }

    public class QuizSubmissionDto
    {
        public int QuizId { get; set; }
        public List<int> SelectedAnswers { get; set; } = new();
    }
}
