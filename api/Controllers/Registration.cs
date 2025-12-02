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
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Modelvalidering (FluentValidation) skjer automatisk før denne koden,
                // og returnerer 400 hvis noe er feil i request.

                // Check if email is already registered
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return BadRequest(new { message = "Email already registered" });
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
                
                _logger.LogInformation("Password reset token for {Email}: {Token}", user.Email, resetToken);

                return Ok(new { message = "If the email exists, password reset instructions have been sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset request");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }
    }
}
