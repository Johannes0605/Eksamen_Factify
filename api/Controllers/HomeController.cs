using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Factify.Models;

namespace Factify.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        // Render the home page
        return View();
    }

    public IActionResult Privacy()
    {
        // Render the privacy page
        return View();
    }

    // Error handling
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        // Return the Error view with a RequestId for troubleshooting
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
