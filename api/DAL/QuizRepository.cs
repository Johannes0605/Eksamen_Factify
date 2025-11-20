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
                .Include(q => q.Questions)
                    .ThenInclude(qs => qs.Options)
                .ToListAsync();
        }

        public async Task<Quiz?> GetQuizByIdAsync(int id)
        {
            return await _context.Quizzes
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
            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qs => qs.Options)
                .FirstOrDefaultAsync(q => q.QuizId == quiz.QuizId);

            if (existingQuiz != null)
            {
                // Update quiz properties
                existingQuiz.Title = quiz.Title;
                existingQuiz.Description = quiz.Description;

                // Remove questions that are no longer in the list
                var questionsToRemove = existingQuiz.Questions
                    .Where(eq => !quiz.Questions.Any(nq => nq.QuestionId == eq.QuestionId))
                    .ToList();
                
                foreach (var question in questionsToRemove)
                {
                    _context.Questions.Remove(question);
                }

                // Update or add questions
                foreach (var question in quiz.Questions)
                {
                    if (question.QuestionId == 0)
                    {
                        // New question
                        question.QuizId = quiz.QuizId;
                        existingQuiz.Questions.Add(question);
                    }
                    else
                    {
                        // Update existing question
                        var existingQuestion = existingQuiz.Questions
                            .FirstOrDefault(q => q.QuestionId == question.QuestionId);
                        
                        if (existingQuestion != null)
                        {
                            existingQuestion.QuestionText = question.QuestionText;

                            // Remove options that are no longer in the list
                            var optionsToRemove = existingQuestion.Options
                                .Where(eo => !question.Options.Any(no => no.OptionsId == eo.OptionsId))
                                .ToList();
                            
                            foreach (var option in optionsToRemove)
                            {
                                _context.Options.Remove(option);
                            }

                            // Update or add options
                            foreach (var option in question.Options)
                            {
                                if (option.OptionsId == 0)
                                {
                                    // New option
                                    option.QuestionId = question.QuestionId;
                                    existingQuestion.Options.Add(option);
                                }
                                else
                                {
                                    // Update existing option
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


