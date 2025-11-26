using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using api.Controllers;
using api.Services;
using api.DTOs;
using QuizApp.DAL;
using QuizApp.Models;
using System.Threading.Tasks;
using System.Linq;

namespace api.Tests
{
    public class AccountControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<ILogger<AccountController>> _mockLogger;
        private QuizDbContext _context;
        private AccountController _controller;

        public AccountControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _mockLogger = new Mock<ILogger<AccountController>>();
            
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<QuizDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_" + System.Guid.NewGuid().ToString())
                .Options;
            _context = new QuizDbContext(options);
            
            _controller = new AccountController(_context, _mockAuthService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task Register_WithValidData_ShouldReturnAuthResponse()
        {
            // Arrange
            var request = new RegisterRequest
            {
                Username = "newuser",
                Email = "newuser@example.com",
                Password = "password123"
            };
            
            _mockAuthService.Setup(x => x.HashPassword(It.IsAny<string>()))
                .Returns("hashed_password");
            _mockAuthService.Setup(x => x.GenerateJwtToken(It.IsAny<User>()))
                .Returns("test_token");

            // Act
            var result = await _controller.Register(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AuthResponse>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var response = Assert.IsType<AuthResponse>(okResult.Value);
            Assert.Equal("newuser", response.Username);
            Assert.Equal("test_token", response.Token);
        }

        [Fact]
        public async Task Register_WithExistingEmail_ShouldReturnBadRequest()
        {
            // Arrange
            var existingUser = new User
            {
                Username = "existinguser",
                Email = "existing@example.com",
                PasswordHash = "hash"
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            var request = new RegisterRequest
            {
                Username = "newuser",
                Email = "existing@example.com",
                Password = "password123"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AuthResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task Register_WithExistingUsername_ShouldReturnBadRequest()
        {
            // Arrange
            var existingUser = new User
            {
                Username = "existinguser",
                Email = "existing@example.com",
                PasswordHash = "hash"
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            var request = new RegisterRequest
            {
                Username = "existinguser",
                Email = "newemail@example.com",
                Password = "password123"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AuthResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ShouldReturnAuthResponse()
        {
            // Arrange
            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hashed_password"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new LoginRequest
            {
                Email = "test@example.com",
                Password = "password123"
            };

            _mockAuthService.Setup(x => x.VerifyPassword(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(true);
            _mockAuthService.Setup(x => x.GenerateJwtToken(It.IsAny<User>()))
                .Returns("test_token");

            // Act
            var result = await _controller.Login(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AuthResponse>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var response = Assert.IsType<AuthResponse>(okResult.Value);
            Assert.Equal("testuser", response.Username);
        }

        [Fact]
        public async Task Login_WithInvalidEmail_ShouldReturnUnauthorized()
        {
            // Arrange
            var request = new LoginRequest
            {
                Email = "nonexistent@example.com",
                Password = "password123"
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AuthResponse>>(result);
            Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task Login_WithInvalidPassword_ShouldReturnUnauthorized()
        {
            // Arrange
            var user = new User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hashed_password"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new LoginRequest
            {
                Email = "test@example.com",
                Password = "wrongpassword"
            };

            _mockAuthService.Setup(x => x.VerifyPassword(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            // Act
            var result = await _controller.Login(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AuthResponse>>(result);
            Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
