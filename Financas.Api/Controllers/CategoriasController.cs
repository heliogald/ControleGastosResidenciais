using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Financas.Api.Data;
using Financas.Api.Models;

namespace Financas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriaController(AppDbContext context)
        {
            _context = context;
        }

        // Listagem de categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        // Criação de categoria
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            // O ID é gerado automaticamente no Model, mas garantimos que seja um novo Guid
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategorias), new { id = categoria.Id }, categoria);
        }
     
    }
}