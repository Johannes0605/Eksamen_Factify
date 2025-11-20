using Microsoft.AspNetCore.Mvc;

namespace Factify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "API is running!" });
        }
    }
}

