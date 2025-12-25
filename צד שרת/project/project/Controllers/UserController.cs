using Microsoft.AspNetCore.Mvc;
using project.Data;
using project.Models;

namespace project.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly ProductContext _context;

        public UserController(ProductContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register( string id, string name, string email, string phoneNumber)
        {
            var user = new User(id, name, email, phoneNumber);
            if (_context.Users.Any(u => u.Id == user.Id))
                return BadRequest("User already exists");

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromQuery] string id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return Unauthorized("user not found");
            return Ok(user);
        }
    }
}
