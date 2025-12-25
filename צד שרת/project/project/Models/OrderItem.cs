using System.ComponentModel.DataAnnotations;

namespace project.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public Product Product { get; set; }  

        public int Quantity { get; set; }
        public decimal PriceAtPurchase { get; set; }
        

        public OrderItem() { }

        public OrderItem(Product product, int quantity)
        {
            Product = product;
            Quantity = quantity;
            PriceAtPurchase = Quantity * Product.Price;
        }
    }
}
