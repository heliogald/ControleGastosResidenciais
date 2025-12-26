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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            return await _context.Pessoas.AsNoTracking().ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa([FromBody] Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPessoas), new { id = pessoa.Id }, pessoa);
        }

        [HttpPut("{id}")]
    public async Task<IActionResult> PutPessoa(Guid id, [FromBody] Pessoa pessoa)
    {
        if (id != pessoa.Id)
        {
            return BadRequest("ID não coincide.");
        }

        // Verifica se a pessoa existe no banco SEM rastreá-la (AsNoTracking)
        var pessoaExiste = await _context.Pessoas.AsNoTracking().AnyAsync(p => p.Id == id);
        if (!pessoaExiste)
        {
            return NotFound("Pessoa não encontrada.");
        }

        // Informa ao contexto para "anexar" e marcar como modificado
        _context.Entry(pessoa).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Se houver erro de banco (ex: campo obrigatório vazio), ele aparecerá aqui
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }

        return NoContent();
    }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null) return NotFound();

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}