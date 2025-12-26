import { useEffect, useState } from "react";
import api from "../services/api";

interface RelatorioPessoa {
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export function Relatorios() {
  const [dadosPessoas, setDadosPessoas] = useState<RelatorioPessoa[]>([]);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);

  useEffect(() => {
    carregarRelatorios();
  }, []);

  async function carregarRelatorios() {
    try {
      // Buscamos as transações e as pessoas
      const [resT, resP] = await Promise.all([
        api.get("/transacoes"),
        api.get("/pessoas"),
      ]);

      const transacoes = resT.data;
      const pessoas = resP.data;

      // Cálculo por pessoa
      const relatorio = pessoas.map((pessoa: any) => {
        const transacoesPessoa = transacoes.filter(
          (t: any) => t.pessoaId === pessoa.id
        );
        const receitas = transacoesPessoa
          .filter((t: any) => t.tipo === 2)
          .reduce((acc: number, t: any) => acc + t.valor, 0);
        const despesas = transacoesPessoa
          .filter((t: any) => t.tipo === 1)
          .reduce((acc: number, t: any) => acc + t.valor, 0);

        return {
          nome: pessoa.nome,
          receitas,
          despesas,
          saldo: receitas - despesas,
        };
      });

      setDadosPessoas(relatorio);
      setTotalReceitas(relatorio.reduce((acc, p) => acc + p.receitas, 0));
      setTotalDespesas(relatorio.reduce((acc, p) => acc + p.despesas, 0));
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    }
  }

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-indigo-400">
          Dashboard Financeiro
        </h2>
        <button
          onClick={carregarRelatorios}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
        >
          🔄 Atualizar Dados
        </button>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border-l-4 border-emerald-500 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">
            Total de Receitas
          </p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">
            {formatarMoeda(totalReceitas)}
          </h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border-l-4 border-rose-500 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">
            Total de Despesas
          </p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">
            {formatarMoeda(totalDespesas)}
          </h3>
        </div>
        <div
          className={`bg-slate-800 p-6 rounded-2xl border-l-4 shadow-lg ${
            totalReceitas - totalDespesas >= 0
              ? "border-indigo-500"
              : "border-amber-500"
          }`}
        >
          <p className="text-slate-400 text-sm font-medium">
            Saldo Líquido Geral
          </p>
          <h3 className="text-2xl font-bold text-white mt-1">
            {formatarMoeda(totalReceitas - totalDespesas)}
          </h3>
        </div>
      </div>

      {/* Tabela de Detalhamento por Pessoa */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-700 bg-slate-700/30">
          <h4 className="font-bold text-slate-200">Resumo por Membro</h4>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-4">Pessoa</th>
              <th className="p-4 text-center">Receitas</th>
              <th className="p-4 text-center">Despesas</th>
              <th className="p-4 text-right">Saldo Individual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {dadosPessoas.map((p, index) => (
              <tr
                key={index}
                className="hover:bg-slate-700/40 transition-colors"
              >
                <td className="p-4 font-semibold text-slate-200">{p.nome}</td>
                <td className="p-4 text-center text-emerald-400">
                  {formatarMoeda(p.receitas)}
                </td>
                <td className="p-4 text-center text-rose-400">
                  {formatarMoeda(p.despesas)}
                </td>
                <td
                  className={`p-4 text-right font-bold ${
                    p.saldo >= 0 ? "text-indigo-400" : "text-amber-500"
                  }`}
                >
                  {formatarMoeda(p.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dica de Saúde Financeira */}
      <footer className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl text-center">
        <p className="text-indigo-300 text-sm italic">
          💡 Dica: O saldo líquido geral representa a economia total da
          residência após todas as despesas serem subtraídas das receitas.
        </p>
      </footer>
    </div>
  );
}
