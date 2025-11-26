using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using api.Services;

namespace api.Tests
{
    public class AuthServiceTests
    {
        private readonly IAuthService _authService;
        private readonly Mock<IConfiguration> _mockConfig;

        public AuthServiceTests()
        {
            _mockConfig = new Mock<IConfiguration>();
            _mockConfig.Setup(c => c["Jwt:Key"]).Returns("your-secret-key-here-at-least-32-characters-long");
            _mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("test-issuer");
            _mockConfig.Setup(c => c["Jwt:Audience"]).Returns("test-audience");
            _authService = new AuthService(_mockConfig.Object);
        }

        [Fact]
        public void HashPassword_ShouldReturnHashedString()
        {
            // Arrange
            var password = "password123";

            // Act
            var hashedPassword = _authService.HashPassword(password);

            // Assert
            Assert.NotNull(hashedPassword);
            Assert.NotEqual(password, hashedPassword);
            Assert.True(hashedPassword.Length > 0);
        }

        [Fact]
        public void HashPassword_SamePlainTextPassword_ShouldProduceSameHash()
        {
            // Arrange
            var password = "password123";

            // Act
            var hash1 = _authService.HashPassword(password);
            var hash2 = _authService.HashPassword(password);

            // Assert
            Assert.Equal(hash1, hash2);
        }

        [Fact]
        public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
        {
            // Arrange
            var password = "password123";
            var hashedPassword = _authService.HashPassword(password);

            // Act
            var result = _authService.VerifyPassword(password, hashedPassword);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void VerifyPassword_WithIncorrectPassword_ShouldReturnFalse()
        {
            // Arrange
            var correctPassword = "password123";
            var incorrectPassword = "wrongpassword";
            var hashedPassword = _authService.HashPassword(correctPassword);

            // Act
            var result = _authService.VerifyPassword(incorrectPassword, hashedPassword);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GenerateJwtToken_ShouldReturnToken()
        {
            // Arrange
            var user = new QuizApp.Models.User
            {
                UserId = 1,
                Username = "testuser",
                Email = "test@example.com"
            };

            // Act
            var token = _authService.GenerateJwtToken(user);

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
            // JWT tokens have 3 parts separated by dots
            Assert.Equal(3, token.Split('.').Length);
        }
    }
}
