using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using Financas.Api.Data;
using Financas.Api.Models;

namespace Financas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("pessoas")]
        public async Task<IActionResult> GetTotaisPorPessoa()
        {
            // O .Include exige o using acima para funcionar
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            var relatorio = pessoas.Select(p => new {
                p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) - 
                        p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();

            return Ok(new {
                Dados = relatorio,
                TotalGeralReceitas = relatorio.Sum(r => r.TotalReceitas),
                TotalGeralDespesas = relatorio.Sum(r => r.TotalDespesas),
                SaldoLiquidoGeral = relatorio.Sum(r => r.Saldo)
            });
        }
    }
}