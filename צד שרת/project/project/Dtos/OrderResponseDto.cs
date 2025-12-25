using project.Models;

namespace project.Dtos
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        //public User User { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }      
        public string UserPhone { get; set; }
        public string Address { get; set; }
        public string DateAndHour { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemResponseDto> Items { get; set; }
    }
}
