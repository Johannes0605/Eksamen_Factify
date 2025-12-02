using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using QuizApp.Models;

namespace api.Services
{
    // Interface defining authentication operations
    public interface IAuthService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
        string GenerateJwtToken(QuizApp.Models.User user);
    }

    // Handles password hashing and JWT token generation
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        // Converts a plain-text password into a secure hash
        // Uses BCrypt with automatic salt generation (industry standard)
        public string HashPassword(string password)
        {
            // BCrypt automatically generates a salt and uses adaptive hashing
            // Work factor of 12 provides strong security while maintaining reasonable performance
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        }

        // Checks if a plain-text password matches a stored BCrypt hash
        public bool VerifyPassword(string password, string storedHash)
        {
            // BCrypt.Verify handles salt extraction and comparison automatically
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }

        // Creates a JWT token containing user information
        // This token proves the user is authenticated
        public string GenerateJwtToken(User user)
        {
            // Get the secret key from configuration
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured")
            ));

            // Create signing credentials
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create claims
            var claims = new[]
            {
                // User's database ID
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                // User's display name
                new Claim(ClaimTypes.Name, user.Username),
                // User's email
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Create the token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "factify-api",       // Who created the token
                audience: _config["Jwt:Audience"] ?? "factify-client", // Who can use the token
                claims: claims,                                        // User data in token
                expires: DateTime.UtcNow.AddHours(1),                 // Token valid for 1 hour
                signingCredentials: creds                              // How to verify token
            );

            // Convert token to string and return
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}