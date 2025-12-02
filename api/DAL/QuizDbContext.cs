using Microsoft.EntityFrameworkCore;
using QuizApp.Models;

namespace QuizApp.DAL
{
    public class QuizDbContext : DbContext
    {
        // The DbContext is configured via DI. The options object (connection string, provider)
        // is provided from Program.cs when the context is registered with services.
        public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options)
        {
        }

        // DbSets represent tables in the database and allow querying and saving instances
        // of the corresponding entity types through EF Core.
        public DbSet<Quiz> Quizzes { get; set; }

        // Questions are related to a Quiz (one-to-many). Include navigation properties
        // on entities to load related data when needed.
        public DbSet<Question> Questions { get; set; }

        // Options (answers) belong to a Question. Note: the class is named "Options"
        // in the models; consider renaming to singular "Option" for clarity later.
        public DbSet<Options> Options { get; set; }

        // Users table for storing simple user records (for demo purposes). In a
        // production app prefer ASP.NET Identity or a secure user store.
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                // Make email unique (no duplicate emails allowed)
                entity.HasIndex(u => u.Email).IsUnique();
                
                // Make username unique
                entity.HasIndex(u => u.Username).IsUnique();
                
                // Set max lengths to prevent excessively long data
                entity.Property(u => u.Email).HasMaxLength(255).IsRequired();
                entity.Property(u => u.Username).HasMaxLength(50).IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
            });

            // Configure Quiz entity for better query performance
            modelBuilder.Entity<Quiz>(entity =>
            {
                // Composite index for filtering by user and sorting by created date
                entity.HasIndex(q => new { q.UserId, q.CreatedDate });
                
                // Composite index for filtering by user and sorting by last used date
                entity.HasIndex(q => new { q.UserId, q.LastUsedDate });
            });
        }
    }
}