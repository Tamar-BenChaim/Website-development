using Microsoft.AspNetCore.Mvc;
using project.Models;
using project.Data;          
using Microsoft.EntityFrameworkCore;

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductController(ProductContext context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<List<Product>>> Get()
        {
            return await _context.Products.ToListAsync();
        }

        // GET api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        // POST api/Product
        [HttpPost]
        public async Task<ActionResult<Product>> Post([FromBody] Product newProduct)
        {
            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, newProduct);
        }

        // POST api/createDataSave
        [HttpPost("createDataSave/{path}")]
        public async Task<IActionResult> Post(string path)
        {
            try
            {
                using (StreamWriter writer = new StreamWriter(path)) {

                    foreach (var item in _context.Products)
                    {
                        writer.WriteLine(item.Id);
                        writer.WriteLine(item.Name);
                        writer.WriteLine(item.Category);
                        writer.WriteLine(item.Price);
                    }
                    await writer.FlushAsync();
                    return Ok("success");
                }    
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // PUT api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Product updatedProduct)
        {
            if (id != updatedProduct.Id) return BadRequest();

            _context.Entry(updatedProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(p => p.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
