using System.ComponentModel.DataAnnotations;

namespace project.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public DateTime OrderDate { get; set; }

        public string Address { get; set; }

        public string DateAndHour { get; set; }

        public decimal Price { get; set; }


        public List<OrderItem> Items { get; set; } 

        public Order()
        {
            OrderDate = DateTime.Now;
            Items = new List<OrderItem>();
        }

        public Order(User user)
        {
            UserId = user.Id;
            User = user;
            OrderDate = DateTime.Now;
            Items = new List<OrderItem>();
        }
    }
}
