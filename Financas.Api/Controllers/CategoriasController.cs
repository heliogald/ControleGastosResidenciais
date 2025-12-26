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

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(Guid id, [FromBody] Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest("O ID enviado na URL não coincide com o ID do objeto.");
            }

            // Marca como modificado para o EF gerar o comando UPDATE
            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Categorias.Any(e => e.Id == id)) return NotFound();
                throw;
            }
            catch (DbUpdateException ex)
            {
                // Útil para identificar se há transações impedindo a mudança (ex: restrição de FK)
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(Guid id)
        {
            // Buscamos a categoria incluindo a contagem de transações
            var categoria = await _context.Categorias
                .Include(c => c.Transacoes)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null) return NotFound("Categoria não encontrada.");

            // Validação explícita: Se houver qualquer transação, impedimos a exclusão
            if (categoria.Transacoes != null && categoria.Transacoes.Any())
            {
                return BadRequest("Não é possível excluir: esta categoria possui lançamentos vinculados.");
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
     
    }
}