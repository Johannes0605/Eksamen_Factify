using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using QuizApp.Controllers;
using QuizApp.DAL;
using QuizApp.Models;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Tests
{
    public class QuizControllerTests
    {
        private readonly Mock<IQuizRepository> _mockRepository;
        private readonly QuizController _controller;
        private readonly int _testUserId = 1;
        private readonly int _otherUserId = 2;

        public QuizControllerTests()
        {
            _mockRepository = new Mock<IQuizRepository>();
            _controller = new QuizController(_mockRepository.Object);
            
            // Setup authenticated user context
            SetupUserContext(_testUserId);
        }

        private void SetupUserContext(int userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };
        }

        #region GetAllQuizzes Tests

        [Fact]
        public async Task GetAllQuizzes_WithAuthenticatedUser_ShouldReturnUserQuizzes()
        {
            // Arrange
            var userQuizzes = new List<Quiz>
            {
                new Quiz { QuizId = 2, Title = "User1 Quiz2", UserId = _testUserId, CreatedDate = DateTime.UtcNow.AddDays(-1) },
                new Quiz { QuizId = 1, Title = "User1 Quiz1", UserId = _testUserId, CreatedDate = DateTime.UtcNow.AddDays(-2) }
            };
            _mockRepository.Setup(x => x.GetQuizzesByUserIdAsync(_testUserId)).ReturnsAsync(userQuizzes);

            // Act
            var result = await _controller.GetAllQuizzes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<Quiz>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedQuizzes = Assert.IsType<List<Quiz>>(okResult.Value);
            
            // Should only return quizzes belonging to the authenticated user
            Assert.Equal(2, returnedQuizzes.Count);
            Assert.All(returnedQuizzes, q => Assert.Equal(_testUserId, q.UserId));
            
            // Should be ordered by CreatedDate descending (most recent first)
            Assert.Equal("User1 Quiz2", returnedQuizzes[0].Title);
            Assert.Equal("User1 Quiz1", returnedQuizzes[1].Title);
        }

        [Fact]
        public async Task GetAllQuizzes_WithNoQuizzes_ShouldReturnEmptyList()
        {
            // Arrange
            _mockRepository.Setup(x => x.GetQuizzesByUserIdAsync(_testUserId)).ReturnsAsync(new List<Quiz>());

            // Act
            var result = await _controller.GetAllQuizzes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<Quiz>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedQuizzes = Assert.IsType<List<Quiz>>(okResult.Value);
            Assert.Empty(returnedQuizzes);
        }

        [Fact]
        public async Task GetAllQuizzes_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Arrange - Setup controller without authenticated user
            var controller = new QuizController(_mockRepository.Object);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetAllQuizzes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<Quiz>>>(result);
            Assert.IsType<UnauthorizedResult>(actionResult.Result);
        }

        #endregion

        #region GetQuizById Tests

        [Fact]
        public async Task GetQuizById_WithValidId_ShouldReturnQuiz()
        {
            // Arrange
            var quiz = new Quiz 
            { 
                QuizId = 1, 
                Title = "Test Quiz", 
                Description = "Test Description",
                UserId = _testUserId 
            };
            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(quiz);

            // Act
            var result = await _controller.GetQuizById(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Quiz>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedQuiz = Assert.IsType<Quiz>(okResult.Value);
            Assert.Equal("Test Quiz", returnedQuiz.Title);
            Assert.Equal(1, returnedQuiz.QuizId);
        }

        [Fact]
        public async Task GetQuizById_WithNonExistentId_ShouldReturnNotFound()
        {
            // Arrange
            _mockRepository.Setup(x => x.GetQuizByIdAsync(999)).ReturnsAsync((Quiz?)null);

            // Act
            var result = await _controller.GetQuizById(999);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Quiz>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetQuizById_WithoutAuthentication_ShouldStillWork()
        {
            // Arrange - GetQuizById has [AllowAnonymous] attribute
            var controller = new QuizController(_mockRepository.Object);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            
            var quiz = new Quiz { QuizId = 1, Title = "Public Quiz", UserId = _testUserId };
            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(quiz);

            // Act
            var result = await controller.GetQuizById(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Quiz>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult.Value);
        }

        #endregion

        #region CreateQuiz Tests

        [Fact]
        public async Task CreateQuiz_WithValidData_ShouldCreateAndReturnQuiz()
        {
            // Arrange
            var newQuiz = new Quiz
            {
                Title = "New Quiz",
                Description = "Test Description",
                Questions = new List<Question>
                {
                    new Question
                    {
                        QuestionText = "Question 1",
                        Options = new List<Options>
                        {
                            new Options { Text = "Option 1", IsCorrect = true },
                            new Options { Text = "Option 2", IsCorrect = false }
                        }
                    }
                }
            };

            _mockRepository.Setup(x => x.AddQuizAsync(It.IsAny<Quiz>()))
                .Callback<Quiz>(q => q.QuizId = 1)
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateQuiz(newQuiz);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_controller.GetQuizById), createdResult.ActionName);
            
            var returnedQuiz = Assert.IsType<Quiz>(createdResult.Value);
            Assert.Equal("New Quiz", returnedQuiz.Title);
            Assert.Equal(_testUserId, returnedQuiz.UserId); // Should set UserId from auth context
            
            _mockRepository.Verify(x => x.AddQuizAsync(It.Is<Quiz>(q => q.UserId == _testUserId)), Times.Once);
        }

        [Fact]
        public async Task CreateQuiz_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Arrange
            var controller = new QuizController(_mockRepository.Object);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            
            var newQuiz = new Quiz { Title = "Test Quiz" };

            // Act
            var result = await controller.CreateQuiz(newQuiz);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
            _mockRepository.Verify(x => x.AddQuizAsync(It.IsAny<Quiz>()), Times.Never);
        }

        #endregion

        #region UpdateQuiz Tests

        [Fact]
        public async Task UpdateQuiz_WithValidDataAndOwnership_ShouldUpdateQuiz()
        {
            // Arrange
            var existingQuiz = new Quiz 
            { 
                QuizId = 1, 
                Title = "Original Title", 
                UserId = _testUserId 
            };
            var updatedQuiz = new Quiz 
            { 
                QuizId = 1, 
                Title = "Updated Title", 
                UserId = _testUserId 
            };

            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(existingQuiz);
            _mockRepository.Setup(x => x.UpdateQuizAsync(It.IsAny<Quiz>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateQuiz(1, updatedQuiz);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockRepository.Verify(x => x.UpdateQuizAsync(updatedQuiz), Times.Once);
        }

        [Fact]
        public async Task UpdateQuiz_WithMismatchedIds_ShouldReturnBadRequest()
        {
            // Arrange
            var quiz = new Quiz { QuizId = 1, Title = "Test Quiz" };

            // Act - URL id is 2 but quiz.QuizId is 1
            var result = await _controller.UpdateQuiz(2, quiz);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Quiz ID mismatch.", badRequestResult.Value);
            _mockRepository.Verify(x => x.UpdateQuizAsync(It.IsAny<Quiz>()), Times.Never);
        }

        [Fact]
        public async Task UpdateQuiz_WithNonExistentQuiz_ShouldReturnNotFound()
        {
            // Arrange
            var quiz = new Quiz { QuizId = 999, Title = "Test Quiz" };
            _mockRepository.Setup(x => x.GetQuizByIdAsync(999)).ReturnsAsync((Quiz?)null);

            // Act
            var result = await _controller.UpdateQuiz(999, quiz);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _mockRepository.Verify(x => x.UpdateQuizAsync(It.IsAny<Quiz>()), Times.Never);
        }

        [Fact]
        public async Task UpdateQuiz_WithDifferentOwner_ShouldReturnForbid()
        {
            // Arrange
            var existingQuiz = new Quiz 
            { 
                QuizId = 1, 
                Title = "Other User's Quiz", 
                UserId = _otherUserId  // Belongs to different user
            };
            var updatedQuiz = new Quiz { QuizId = 1, Title = "Updated Title" };

            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(existingQuiz);

            // Act
            var result = await _controller.UpdateQuiz(1, updatedQuiz);

            // Assert
            Assert.IsType<ForbidResult>(result);
            _mockRepository.Verify(x => x.UpdateQuizAsync(It.IsAny<Quiz>()), Times.Never);
        }

        #endregion

        #region DeleteQuiz Tests

        [Fact]
        public async Task DeleteQuiz_WithValidIdAndOwnership_ShouldDeleteQuiz()
        {
            // Arrange
            var quiz = new Quiz { QuizId = 1, Title = "Test Quiz", UserId = _testUserId };
            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(quiz);
            _mockRepository.Setup(x => x.DeleteQuizAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteQuiz(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockRepository.Verify(x => x.DeleteQuizAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteQuiz_WithNonExistentQuiz_ShouldReturnNotFound()
        {
            // Arrange
            _mockRepository.Setup(x => x.GetQuizByIdAsync(999)).ReturnsAsync((Quiz?)null);

            // Act
            var result = await _controller.DeleteQuiz(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _mockRepository.Verify(x => x.DeleteQuizAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task DeleteQuiz_WithDifferentOwner_ShouldReturnForbid()
        {
            // Arrange
            var quiz = new Quiz 
            { 
                QuizId = 1, 
                Title = "Other User's Quiz", 
                UserId = _otherUserId 
            };
            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(quiz);

            // Act
            var result = await _controller.DeleteQuiz(1);

            // Assert
            Assert.IsType<ForbidResult>(result);
            _mockRepository.Verify(x => x.DeleteQuizAsync(It.IsAny<int>()), Times.Never);
        }

        #endregion

        #region DuplicateQuiz Tests

        [Fact]
        public async Task DuplicateQuiz_WithValidId_ShouldCreateCopyWithSameContent()
        {
            // Arrange
            var originalQuiz = new Quiz
            {
                QuizId = 1,
                Title = "Original Quiz",
                Description = "Original Description",
                UserId = _otherUserId,  // Can duplicate other users' quizzes
                Questions = new List<Question>
                {
                    new Question
                    {
                        QuestionId = 1,
                        QuestionText = "Question 1",
                        Options = new List<Options>
                        {
                            new Options { OptionsId = 1, Text = "Option 1", IsCorrect = true },
                            new Options { OptionsId = 2, Text = "Option 2", IsCorrect = false }
                        }
                    }
                }
            };

            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(originalQuiz);
            _mockRepository.Setup(x => x.AddQuizAsync(It.IsAny<Quiz>()))
                .Callback<Quiz>(q => q.QuizId = 2)
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DuplicateQuiz(1);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var duplicatedQuiz = Assert.IsType<Quiz>(createdResult.Value);
            
            // Should have " Copy" appended to title
            Assert.Equal("Original Quiz Copy", duplicatedQuiz.Title);
            
            // Should preserve description
            Assert.Equal("Original Description", duplicatedQuiz.Description);
            
            // Should be owned by current user
            Assert.Equal(_testUserId, duplicatedQuiz.UserId);
            
            // Should copy questions and options
            Assert.Single(duplicatedQuiz.Questions);
            Assert.Equal("Question 1", duplicatedQuiz.Questions[0].QuestionText);
            Assert.Equal(2, duplicatedQuiz.Questions[0].Options.Count);
            Assert.Equal("Option 1", duplicatedQuiz.Questions[0].Options.ElementAt(0).Text);
            Assert.True(duplicatedQuiz.Questions[0].Options.ElementAt(0).IsCorrect);
            
            _mockRepository.Verify(x => x.AddQuizAsync(It.Is<Quiz>(
                q => q.Title == "Original Quiz Copy" && q.UserId == _testUserId
            )), Times.Once);
        }

        [Fact]
        public async Task DuplicateQuiz_WithNonExistentQuiz_ShouldReturnNotFound()
        {
            // Arrange
            _mockRepository.Setup(x => x.GetQuizByIdAsync(999)).ReturnsAsync((Quiz?)null);

            // Act
            var result = await _controller.DuplicateQuiz(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _mockRepository.Verify(x => x.AddQuizAsync(It.IsAny<Quiz>()), Times.Never);
        }

        [Fact]
        public async Task DuplicateQuiz_WithMultipleQuestions_ShouldCopyAllQuestions()
        {
            // Arrange
            var originalQuiz = new Quiz
            {
                QuizId = 1,
                Title = "Complex Quiz",
                UserId = _testUserId,
                Questions = new List<Question>
                {
                    new Question
                    {
                        QuestionText = "Question 1",
                        Options = new List<Options>
                        {
                            new Options { Text = "Q1 Option 1", IsCorrect = true },
                            new Options { Text = "Q1 Option 2", IsCorrect = false }
                        }
                    },
                    new Question
                    {
                        QuestionText = "Question 2",
                        Options = new List<Options>
                        {
                            new Options { Text = "Q2 Option 1", IsCorrect = false },
                            new Options { Text = "Q2 Option 2", IsCorrect = true }
                        }
                    }
                }
            };

            _mockRepository.Setup(x => x.GetQuizByIdAsync(1)).ReturnsAsync(originalQuiz);
            _mockRepository.Setup(x => x.AddQuizAsync(It.IsAny<Quiz>()))
                .Callback<Quiz>(q => q.QuizId = 2)
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DuplicateQuiz(1);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var duplicatedQuiz = Assert.IsType<Quiz>(createdResult.Value);
            
            Assert.Equal(2, duplicatedQuiz.Questions.Count);
            Assert.Equal("Question 1", duplicatedQuiz.Questions[0].QuestionText);
            Assert.Equal("Question 2", duplicatedQuiz.Questions[1].QuestionText);
            
            // Verify options are copied correctly
            Assert.Equal(2, duplicatedQuiz.Questions[0].Options.Count);
            Assert.Equal(2, duplicatedQuiz.Questions[1].Options.Count);
            Assert.Equal("Q1 Option 1", duplicatedQuiz.Questions[0].Options.ElementAt(0).Text);
            Assert.Equal("Q2 Option 2", duplicatedQuiz.Questions[1].Options.ElementAt(1).Text);
        }

        [Fact]
        public async Task DuplicateQuiz_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Arrange
            var controller = new QuizController(_mockRepository.Object);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.DuplicateQuiz(1);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
            _mockRepository.Verify(x => x.AddQuizAsync(It.IsAny<Quiz>()), Times.Never);
        }

        #endregion
    }
}
