namespace Factify.Models;

// ViewModel for error handling
public class ErrorViewModel
{
    public string? RequestId { get; set; }
    
    // Indicates if the RequestId should be shown
    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}
