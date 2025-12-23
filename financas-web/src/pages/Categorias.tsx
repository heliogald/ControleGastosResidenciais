import { useEffect, useState } from "react";
import api from "../services/api";

interface Categoria {
  id: string;
  descricao: string;
  finalidade: number;
}

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState(1); // 1: Despesa, 2: Receita, 3: Ambas

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    const res = await api.get("/categoria");
    setCategorias(res.data);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/categoria", {
        descricao,
        finalidade: Number(finalidade),
      });
      setDescricao("");
      carregarCategorias();
    } catch {
      alert("Erro ao salvar categoria");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400">Categorias</h2>

      <form
        onSubmit={handleSalvar}
        className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 flex flex-col md:flex-row gap-4"
      >
        <input
          className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Descrição da Categoria (Ex: Aluguel, Salário...)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <select
          className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none"
          value={finalidade}
          onChange={(e) => setFinalidade(Number(e.target.value))}
        >
          <option value={1}>Despesa</option>
          <option value={2}>Receita</option>
          <option value={3}>Ambas</option>
        </select>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-bold transition-transform active:scale-95">
          Adicionar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categorias.map((c) => (
          <div
            key={c.id}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
          >
            <span className="text-slate-200 font-medium">{c.descricao}</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold ${
                c.finalidade === 1
                  ? "bg-rose-500/20 text-rose-400"
                  : c.finalidade === 2
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-indigo-500/20 text-indigo-400"
              }`}
            >
              {c.finalidade === 1
                ? "Despesa"
                : c.finalidade === 2
                ? "Receita"
                : "Ambas"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
