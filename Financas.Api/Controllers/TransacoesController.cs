using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Financas.Api.Data;
using Financas.Api.Models;

namespace Financas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        // Listagem básica conforme solicitado
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            // Usamos Include para que o JSON de resposta traga os nomes da pessoa e categoria
            return await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
        {
            // 1. Validar se os IDs enviados existem no banco
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);

            if (pessoa == null || categoria == null)
                return BadRequest("Pessoa ou Categoria não encontrada.");

            // 2. REGRA DE NEGÓCIO: Menores de 18 anos só podem ter Despesas
            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Regra de Negócio: Usuários menores de 18 anos não podem registrar receitas.");
            }

            // 3. REGRA DE NEGÓCIO: Compatibilidade entre Tipo e Finalidade da Categoria
            // Se a categoria for específica (não for 'Ambas'), ela deve bater com o tipo da transação
            if (categoria.Finalidade != FinalidadeCategoria.Ambas)
            {
                bool isIncompativel = (int)categoria.Finalidade != (int)transacao.Tipo;

                if (isIncompativel)
                {
                    return BadRequest($"Conflito: A categoria '{categoria.Descricao}' é exclusiva para {categoria.Finalidade}.");
                }
            }

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransacoes), new { id = transacao.Id }, transacao);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransacao(Guid id, [FromBody] Transacao transacao)
        {
            if (id != transacao.Id)
            {
                return BadRequest("ID da URL não coincide com o ID do objeto.");
            }

            // 1. Validar se a transação existe e carregar Pessoas/Categorias para validação
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);

            if (pessoa == null || categoria == null)
                return BadRequest("Pessoa ou Categoria não encontrada.");

            // 2. REPLICAR REGRA DE NEGÓCIO: Menores de 18 anos só podem ter Despesas
            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Regra de Negócio: Usuários menores de 18 anos não podem registrar receitas.");
            }

            // 3. REPLICAR REGRA DE NEGÓCIO: Compatibilidade de Categoria
            if (categoria.Finalidade != FinalidadeCategoria.Ambas)
            {
                bool isIncompativel = (int)categoria.Finalidade != (int)transacao.Tipo;
                if (isIncompativel)
                {
                    return BadRequest($"Conflito: A categoria '{categoria.Descricao}' é exclusiva para {categoria.Finalidade}.");
                }
            }

            _context.Entry(transacao).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Transacoes.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(Guid id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null) return NotFound();

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}