namespace api.DTOs
{
    /// Request password reset
    public record ForgotPasswordRequest(
        string Email
    );
}
