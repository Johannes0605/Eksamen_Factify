using QuizApp.Models;

namespace QuizApp.DAL
{
    public static class DBInit
    {
        public static void Seed(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<QuizDbContext>();

            // Ensure database is created
            if (!db.Quizzes.Any())
            {
                var sampleQuiz = new Quiz
                {
                    Title = "Demo Quiz",
                    Description = "A sample quiz to test functionality.",
                    Questions = new List<Question>
                    {
                        // Hard coded sample question 1 
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

                // Add more sample questions as needed
                db.Quizzes.Add(sampleQuiz);
                db.SaveChanges();
            }
        }
    }
}