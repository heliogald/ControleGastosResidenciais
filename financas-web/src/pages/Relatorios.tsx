import { useEffect, useState } from "react";
import api from "../services/api";

interface RelatorioPessoa {
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

interface ResumoGeral {
  dados: RelatorioPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquidoGeral: number;
}

export function Relatorios() {
  const [relatorio, setRelatorio] = useState<ResumoGeral | null>(null);

  useEffect(() => {
    api
      .get("/relatorios/pessoas")
      .then((res) => setRelatorio(res.data))
      .catch((err) => console.error("Erro ao buscar relatório", err));
  }, []);

  if (!relatorio) return <p>Carregando relatórios...</p>;

  return (
    <div>
      <h2>Relatório de Gastos por Pessoa</h2>

      <table
        border={1}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th>Pessoa</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {relatorio.dados.map((d, i) => (
            <tr key={i}>
              <td>{d.nome}</td>
              <td style={{ color: "green" }}>
                R$ {d.totalReceitas.toFixed(2)}
              </td>
              <td style={{ color: "red" }}>R$ {d.totalDespesas.toFixed(2)}</td>
              <td style={{ fontWeight: "bold" }}>R$ {d.saldo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          padding: "20px",
          border: "2px solid #333",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        <div className="mt-10 p-6 border-2 border-slate-700 rounded-xl bg-slate-800 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-slate-100">
            Resumo Consolidado
          </h3>

          <p className="text-slate-300">
            Total de Receitas Gerais:
            <span className="ml-2 font-bold text-emerald-400">
              R$ {relatorio.totalGeralReceitas.toFixed(2)}
            </span>
          </p>

          <p className="text-slate-300 mt-2">
            Total de Despesas Gerais:
            <span className="ml-2 font-bold text-rose-500">
              R$ {relatorio.totalGeralDespesas.toFixed(2)}
            </span>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <h4 className="text-lg text-slate-100">
              Saldo Líquido Geral:
              <span
                className={`ml-2 font-black ${
                  relatorio.saldoLiquidoGeral >= 0
                    ? "text-indigo-400"
                    : "text-amber-500"
                }`}
              >
                R$ {relatorio.saldoLiquidoGeral.toFixed(2)}
              </span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
