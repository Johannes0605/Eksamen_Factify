namespace api.DTOs
{
    /// Create an account
    public record RegisterRequest(
        string Username, 
        string Email, 
        string Password   // Plain password (will be hashed)
    );

    /// Log in to an existing account
    public record LoginRequest(
        string Email,    
        string Password   // Plain password (compared against hash)
    );

    /// Data sent back to frontend after successful login/register
    public record AuthResponse(
        int UserId,     
        string Username,  
        string Token     // JWT for authenticated requests
    );
}