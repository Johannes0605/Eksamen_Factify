using QuizApp.Models;

namespace QuizApp.DAL
{
    // Repository interface for Quiz operations
    public interface IQuizRepository
    {
        Task<List<Quiz>> GetAllQuizzesAsync();
        Task<List<Quiz>> GetQuizzesByUserIdAsync(int userId);
        Task<Quiz?> GetQuizByIdAsync(int id);
        Task AddQuizAsync(Quiz quiz);
        Task UpdateQuizAsync(Quiz quiz);
        Task DeleteQuizAsync(int id);
    }
}