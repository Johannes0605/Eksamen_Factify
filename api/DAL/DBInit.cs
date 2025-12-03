using QuizApp.Models;
using api.Services;

namespace QuizApp.DAL
{
    public static class DBInit
    {
        public static void Seed(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
            var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();

            // Sørg for at databasen og tabellene finnes
            db.Database.EnsureCreated();

            // Create test user if it doesn't exist
            if (!db.Users.Any(u => u.Email == "test@bruker.com"))
            {
                var testUser = new User
                {
                    Username = "Testbruker",
                    Email = "test@bruker.com",
                    PasswordHash = authService.HashPassword("Test123!"),
                    CreatedAt = DateTime.UtcNow
                };
                db.Users.Add(testUser);
                db.SaveChanges();
            }

            if (!db.Quizzes.Any())
            {
                var sampleQuiz = new Quiz
                {
                    Title = "Demo Quiz",
                    Description = "A sample quiz to test functionality.",
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            QuestionText = "What is 2 + 2?",
                            Options = new List<Options>
                            {
                                new Options { Text = "3", IsCorrect = false },
                                new Options { Text = "4", IsCorrect = true },
                                new Options { Text = "5", IsCorrect = false }
                            }
                        }
                    }
                };

                db.Quizzes.Add(sampleQuiz);
                db.SaveChanges();
            }
        }
    }
}