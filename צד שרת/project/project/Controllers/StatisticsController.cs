using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project.Data;
using project.Models;
using System.Linq;

namespace project.Controllers
{
    [ApiController]
    [Route("api/statistics")]
    public class StatisticsController : ControllerBase
    {
        private readonly ProductContext _context;

        public StatisticsController(ProductContext context)
        {
            _context = context;
        }

        // GET api/statistics/popular-products
        [HttpGet("popular-products")]
        public IActionResult GetPopularProducts()
        {
            // Aggregate by product and sum quantities sold, return up to 5 most sold products.
            var popular = _context.OrderItems
                .Include(oi => oi.Product)
                .Where(oi => oi.Product != null) // defend against missing FK
                .GroupBy(oi => new { oi.Product.Id, oi.Product.Name, oi.Product.Price })
                .Select(g => new PopularProductDto
                {
                    ProductId = g.Key.Id,
                    Name = g.Key.Name,
                    Price = g.Key.Price,
                    QuantitySold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(p => p.QuantitySold)
                .Take(5)
                .ToList();

            return Ok(popular);
        }

        // GET api/statistics/active-users
        [HttpGet("active-users")]
        public IActionResult GetActiveUsers()
        {
            // Count orders per user, join to Users to get name and filter out admin-equivalent users.
            var userOrderCounts = _context.Orders
                .GroupBy(o => o.UserId)
                .Select(g => new { UserId = g.Key, OrdersCount = g.Count() });

            var active = userOrderCounts
                .Join(_context.Users,
                      uc => uc.UserId,
                      u => u.Id,
                      (uc, u) => new { User = u, uc.OrdersCount })
                // Exclude admin-like users: Id == "admin" or Name == "מנהל" (case-sensitive match for the Hebrew word).
                .Where(x => x.User != null &&
                            x.User.Id != "admin" &&
                            x.User.Name != "מנהל")
                .OrderByDescending(x => x.OrdersCount)
                .Take(5)
                .Select(x => new ActiveUserDto
                {
                    UserId = x.User.Id,
                    Name = x.User.Name,
                    OrdersCount = x.OrdersCount
                })
                .ToList();

            return Ok(active);
        }

        // Response DTOs kept local to controller for simplicity
        public class PopularProductDto
        {
            public int ProductId { get; set; }
            public string Name { get; set; }
            public decimal Price { get; set; }
            public int QuantitySold { get; set; }
        }

        public class ActiveUserDto
        {
            public string UserId { get; set; }
            public string Name { get; set; }
            public int OrdersCount { get; set; }
        }
    }
}