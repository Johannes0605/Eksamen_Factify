using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace QuizApp.DAL
{
    public class QuizDbContextFactory : IDesignTimeDbContextFactory<QuizDbContext>
    {
        public QuizDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<QuizDbContext>();
            
            // Use SQLite for cross-platform support
            optionsBuilder.UseSqlite("Data Source=quiz.db");

            return new QuizDbContext(optionsBuilder.Options);
        }
    }
}

