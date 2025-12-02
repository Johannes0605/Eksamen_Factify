using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.DAL;
using api.DTOs;
using QuizApp.Models;
using api.Services;

namespace api.Controllers
{
    // Handles user registration and login
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly QuizDbContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(
            QuizDbContext context, 
            IAuthService authService,
            ILogger<AccountController> logger)
        {
            _context = context;
            _authService = authService;
            _logger = logger;
        }

        // Creates a new user account
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            try
            {
                // Validate username and get detailed error messages
                var usernameErrors = GetUsernameErrors(request.Username);
                if (usernameErrors.Count > 0)
                {
                    return BadRequest(new { message = string.Join(", ", usernameErrors) });
                }

                // Validate password strength and get detailed error messages
                var passwordErrors = GetPasswordErrors(request.Password);
                if (passwordErrors.Count > 0)
                {
                    return BadRequest(new { message = string.Join(", ", passwordErrors) });
                }

                // Validate email format
                var emailErrors = GetEmailErrors(request.Email);
                if (emailErrors.Count > 0)
                {
                    return BadRequest(new { message = string.Join(", ", emailErrors) });
                }

                // Check if email is already registered
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return BadRequest(new { message = "This email address is already registered. Please use a different email or log in if you already have an account" });
                }

                // Check if username is already taken
                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                {
                    return BadRequest(new { message = "Username already taken" });
                }

                // Create new user
                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = _authService.HashPassword(request.Password),
                    CreatedAt = DateTime.UtcNow
                };

                // Save to database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("New user registered: {Email}", user.Email);

                // Generate JWT token for immediate login
                var token = _authService.GenerateJwtToken(user);

                // Return user info and token
                return Ok(new AuthResponse(user.UserId, user.Username, token));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        // Authenticates a user and returns a token
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            try
            {
                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                // Check if user exists and password matches
                if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
                {
                    // Return same error for both cases (security: don't reveal if email exists)
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                _logger.LogInformation("User logged in: {Email}", user.Email);

                // Generate JWT token
                var token = _authService.GenerateJwtToken(user);

                // Return user info and token
                return Ok(new AuthResponse(user.UserId, user.Username, token));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

<<<<<<< HEAD
        // Validates password strength and returns detailed error messages
        private List<string> GetPasswordErrors(string password)
        {
            var errors = new List<string>();

            // Check minimum length of 8 characters
            if (password.Length < 8)
                errors.Add("Password must be at least 8 characters long");

            // Check for at least one uppercase letter
            if (!password.Any(char.IsUpper))
                errors.Add("Password must contain at least one uppercase letter");

            // Check for at least one digit
            if (!password.Any(char.IsDigit))
                errors.Add("Password must contain at least one number");

            return errors;
        }

        // Validates email format and returns detailed error messages
        private List<string> GetEmailErrors(string email)
        {
            var errors = new List<string>();

            // Check if email is empty
            if (string.IsNullOrWhiteSpace(email))
            {
                errors.Add("Email is required");
                return errors;
            }

            // Check if email contains @ symbol
            if (!email.Contains("@"))
                errors.Add("Email must contain an @ symbol (example: user@example.com)");

            return errors;
=======
        // Handles password reset request
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                // Always return success even if user doesn't exist (security: don't reveal if email exists)
                if (user == null)
                {
                    _logger.LogInformation("Password reset requested for non-existent email: {Email}", request.Email);
                    return Ok(new { message = "If the email exists, password reset instructions have been sent" });
                }

                // Generate a simple reset token (for demo purposes - in production use secure tokens)
                var resetToken = Guid.NewGuid().ToString();
                
                // In a real application, you would:
                // 1. Save the reset token and expiration time to the database
                // 2. Send an email with a link containing the token
                // For now, we'll just log it
                _logger.LogInformation("Password reset token for {Email}: {Token}", user.Email, resetToken);

                // TODO: Implement email sending service
                // await _emailService.SendPasswordResetEmail(user.Email, resetToken);

                return Ok(new { message = "If the email exists, password reset instructions have been sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
>>>>>>> e2f0c38f9b18ab002c8686dd4af8eee1a6f1a6f0
        }
    }
}