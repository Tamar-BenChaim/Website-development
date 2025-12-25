using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project.Data;
using project.Models;
using project.Dtos;

namespace project.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly ProductContext _context;

        public OrderController(ProductContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateOrder(CreateOrderDto dto)
        {
            if (dto == null)
                return BadRequest("Order data is missing.");

            var user = _context.Users.FirstOrDefault(u => u.Id == dto.UserId);
            if (user == null)
                return NotFound($"User with id '{dto.UserId}' not found.");

            var order = new Order(user);
            decimal price = 0;

            if (dto.Items != null && dto.Items.Any())
            {
                foreach (var item in dto.Items)
                {
                    if (item.Product == null)
                        return BadRequest("Product data is missing.");

                    var product = _context.Products.FirstOrDefault(p => p.Id == item.Product.Id);
                    if (product == null)
                        return BadRequest($"Product with id '{item.Product.Id}' not found.");

                    order.Items.Add(new OrderItem(product, item.Quantity));
                    price += item.Product.Price * item.Quantity;
                }
            }
            order.Price = price;
            order.Address = dto.Address;
            order.DateAndHour = dto.DateAndHour;
            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok(order.Id);
        }

        [HttpGet]
        public IActionResult GetAllOrders()
        {
            var orders = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    // Remove: User = o.User,
                    UserName = o.User != null ? o.User.Name : null,
                    UserEmail = o.User != null ? o.User.Email : null,      // Add this
                    UserPhone = o.User != null ? o.User.PhoneNumber : null, // Add this
                    OrderDate = o.OrderDate,
                    Items = o.Items.Select(i => new OrderItemResponseDto
                    {
                        ProductName = i.Product.Name,
                        Category = i.Product.Category,
                        Price = i.Product.Price,
                        Quantity = i.Quantity,
                        PriceAtPurchase = (int)i.PriceAtPurchase,
                    }).ToList()
                })
                .ToList();

            return Ok(orders);
        }
        [HttpGet("by-user/{userId}")]
        public IActionResult GetOrdersByUser(string userId)
        {
            var orders = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .Where(o => o.UserId == userId)
                .ToList();

            return Ok(orders);
        }

        [HttpGet("{orderId}")]
        public IActionResult GetOrderById(int orderId)
        {
            var order = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefault(o => o.Id == orderId);

            if (order == null)
                return NotFound();

            return Ok(order);
        }
    }

    public class CreateOrderDto
    {
        public string UserId { get; set; }
        public string Address { get; set; }
        public string DateAndHour { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public Product Product { get; set; }
        public int Quantity { get; set; }
    }
}
