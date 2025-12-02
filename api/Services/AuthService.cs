using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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

        // Converts a plain-text password into a hashed string
        // Uses SHA-256 algorithm (one-way encryption)
        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            // Convert password string to bytes
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            // Hash the bytes
            var hashedBytes = sha256.ComputeHash(passwordBytes);
            // Convert hashed bytes to Base64 string for storage
            return Convert.ToBase64String(hashedBytes);
        }

        // Checks if a plain-text password matches a stored hash
        public bool VerifyPassword(string password, string storedHash)
        {
            // Hash the input password
            var hashOfInput = HashPassword(password);
            // Compare hashes (not plain passwords!)
            return hashOfInput == storedHash;
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