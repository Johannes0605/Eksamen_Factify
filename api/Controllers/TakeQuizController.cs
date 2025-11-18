using Microsoft.AspNetCore.Mvc;
using QuizApp.DAL;

namespace QuizApp.Controllers
{
    public class TakeQuizController : Controller
    {
        private readonly IQuizRepository _repository;
        private readonly ILogger<TakeQuizController> _logger;

        public TakeQuizController(IQuizRepository repository, ILogger<TakeQuizController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IActionResult> Take(int id)
        {
            // Load the selected quiz (with questions/options) for the user to take
            var quiz = await _repository.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();

            // Render the Take view passing the quiz model
            return View(quiz);
        }

        [HttpPost]
        public async Task<IActionResult> Submit(int quizId, List<int> selectedAnswers)
        {
            // Load quiz and compute score based on selected answer ids
            var quiz = await _repository.GetQuizByIdAsync(quizId);
            if (quiz == null) return NotFound();

            int score = 0;
            int total = 0;

            // For each question, compare chosen option ids with the correct ones
            foreach (var question in quiz.Questions)
            {
                total++;
                var correctAnswers = question.Options
                    .Where(a => a.IsCorrect)
                    .Select(a => a.OptionsId)
                    .ToList();

                var chosen = selectedAnswers
                    .Where(id => question.Options.Any(a => a.OptionsId == id))
                    .ToList();

                // Award a point only if the selected set exactly matches the correct set
                if (chosen.SequenceEqual(correctAnswers))
                    score++;
            }

            // Pass score information to the Result view
            ViewBag.Score = score;
            ViewBag.Total = total;
            return View("Result");
        }
    }
}
