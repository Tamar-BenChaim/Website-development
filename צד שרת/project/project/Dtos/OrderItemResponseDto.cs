namespace project.Dtos
{
    public class OrderItemResponseDto
    {
        public string ProductName { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int PriceAtPurchase { get; set; }
    }
}
