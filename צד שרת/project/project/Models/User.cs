using System.ComponentModel.DataAnnotations;

namespace project.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public List<Order> Orders { get; set; }

        public User() { }

        public User(string id, string name, string email, string phone)
        {
            Id = id;
            Name = name;
            Email = email;
            PhoneNumber = phone;
            Orders = new List<Order>();
        }
    }
}
