using Microsoft.AspNetCore.Mvc;
using QuizApp.DAL;
using QuizApp.Models;

namespace QuizApp.Controllers
{
    public class QuizController : Controller
    {
        private readonly IQuizRepository _repository;
        private readonly ILogger<QuizController> _logger;

        public QuizController(IQuizRepository repository, ILogger<QuizController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                // Retrieve all quizzes (including related questions/options) asynchronously
                var quizzes = await _repository.GetAllQuizzesAsync();

                // Pass the list to the Index view for rendering
                return View(quizzes);
            }
            catch (Exception ex)
            {
                // Log unexpected errors and return a generic 500 response
                _logger.LogError(ex, "Error while loading quizzes.");
                return StatusCode(500, "An error occurred while fetching quizzes.");
            }
        }

        public async Task<IActionResult> Details(int id)
        {
            try
            {
                // Look up a single quiz by id, including its related data
                var quiz = await _repository.GetQuizByIdAsync(id);
                if (quiz == null)
                {
                    // If not found, warn and return 404
                    _logger.LogWarning("Quiz with ID {Id} not found.", id);
                    return NotFound();
                }

                return View(quiz);
            }
            catch (Exception ex)
            {
                // Log and return a 500 for unexpected exceptions
                _logger.LogError(ex, "Error fetching quiz details for ID {Id}", id);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Quiz quiz)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Persist new quiz via repository and redirect back to list on success
                    await _repository.AddQuizAsync(quiz);
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    // Log creation errors and return 500
                    _logger.LogError(ex, "Error creating quiz.");
                    return StatusCode(500, "Error saving quiz.");
                }
            }
            return View(quiz);
        }

        public async Task<IActionResult> Edit(int id)
        {
            // Load existing quiz to populate the edit form
            var quiz = await _repository.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();
            return View(quiz);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Quiz quiz)
        {
            if (id != quiz.QuizId) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    // Save changes via repository and return to the list on success
                    await _repository.UpdateQuizAsync(quiz);
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    // Log update errors and surface a 500
                    _logger.LogError(ex, "Error updating quiz with ID {Id}", id);
                    return StatusCode(500, "Error updating quiz.");
                }
            }
            return View(quiz);
        }

        public async Task<IActionResult> Delete(int id)
        {
            // Present a confirmation page for deletion
            var quiz = await _repository.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();
            return View(quiz);
        }

    [HttpPost, ActionName("Delete")]
    public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                // Perform deletion and redirect to the Home page
                await _repository.DeleteQuizAsync(id);
                return RedirectToAction("Index", "Quiz");
            }
            catch (Exception ex)
            {
                // Log deletion failure and return generic error
                _logger.LogError(ex, "Error deleting quiz with ID {Id}", id);
                return StatusCode(500, "Error deleting quiz.");
            }
        }
    }
}