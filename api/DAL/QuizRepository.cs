using QuizApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace QuizApp.DAL
{
    public class QuizRepository : IQuizRepository
    {
        private readonly QuizDbContext _context;

        public QuizRepository(QuizDbContext context)
        {
            _context = context;
        }

        public async Task<List<Quiz>> GetAllQuizzesAsync()
        {
            return await _context.Quizzes
                .AsNoTracking()  // Read-only query optimization
                .Include(q => q.Questions)
                    .ThenInclude(qs => qs.Options)
                .ToListAsync();
        }

        public async Task<List<Quiz>> GetQuizzesByUserIdAsync(int userId)
        {
            return await _context.Quizzes
                .AsNoTracking()  // Read-only query optimization
                .Include(q => q.Questions)
                    .ThenInclude(qs => qs.Options)
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.CreatedDate)
                .ToListAsync();
        }

        public async Task<Quiz?> GetQuizByIdAsync(int id)
        {
            return await _context.Quizzes
                .AsNoTracking()  // Read-only query optimization
                .Include(q => q.Questions)
                    .ThenInclude(qs => qs.Options)
                .FirstOrDefaultAsync(q => q.QuizId == id);
        }

        public async Task AddQuizAsync(Quiz quiz)
        {
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateQuizAsync(Quiz quiz)
        {
            // Load existing quiz with all nested data
            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qs => qs.Options)
                .FirstOrDefaultAsync(q => q.QuizId == quiz.QuizId);

            if (existingQuiz != null)
            {
                // Update quiz properties
                existingQuiz.Title = quiz.Title;
                existingQuiz.Description = quiz.Description;

                // Remove deleted questions (not in new list)
                var questionsToRemove = existingQuiz.Questions
                    .Where(eq => !quiz.Questions.Any(nq => nq.QuestionId == eq.QuestionId))
                    .ToList();
                
                foreach (var question in questionsToRemove)
                {
                    _context.Questions.Remove(question);
                }

                // Process each question in the updated quiz
                foreach (var question in quiz.Questions)
                {
                    if (question.QuestionId == 0)
                    {
                        // New question - add to quiz
                        question.QuizId = quiz.QuizId;
                        existingQuiz.Questions.Add(question);
                    }
                    else
                    {
                        // Existing question - update properties
                        var existingQuestion = existingQuiz.Questions
                            .FirstOrDefault(q => q.QuestionId == question.QuestionId);
                        
                        if (existingQuestion != null)
                        {
                            existingQuestion.QuestionText = question.QuestionText;

                            // Remove deleted options (not in new list)
                            var optionsToRemove = existingQuestion.Options
                                .Where(eo => !question.Options.Any(no => no.OptionsId == eo.OptionsId))
                                .ToList();
                            
                            foreach (var option in optionsToRemove)
                            {
                                _context.Options.Remove(option);
                            }

                            // Process each option
                            foreach (var option in question.Options)
                            {
                                if (option.OptionsId == 0)
                                {
                                    // New option - add to question
                                    option.QuestionId = question.QuestionId;
                                    existingQuestion.Options.Add(option);
                                }
                                else
                                {
                                    // Existing option - update properties
                                    var existingOption = existingQuestion.Options
                                        .FirstOrDefault(o => o.OptionsId == option.OptionsId);
                                    
                                    if (existingOption != null)
                                    {
                                        existingOption.Text = option.Text;
                                        existingOption.IsCorrect = option.IsCorrect;
                                    }
                                }
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteQuizAsync(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz != null)
            {
                _context.Quizzes.Remove(quiz);
                await _context.SaveChangesAsync();
            }
        }
    }
}


