using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Financas.Api.Data;
using Financas.Api.Models;

namespace Financas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        // Listagem de pessoas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            return await _context.Pessoas.ToListAsync();
        }

        // Criação de pessoa
        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            // O ID é gerado automaticamente no Model, mas garantimos que seja um novo Guid
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPessoas), new { id = pessoa.Id }, pessoa);
        }

        // Deleção de pessoa (com regra de apagar transações vinculadas)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(Guid id)
        {
            var pessoa = await _context.Pessoas
                .Include(p => p.Transacoes) // Carrega as transações para garantir a remoção
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pessoa == null) return NotFound();

            // O Entity Framework já cuidará do Cascade Delete baseado na 
            // configuração que fizemos no AppDbContext
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}