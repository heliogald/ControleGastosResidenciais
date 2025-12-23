import { useEffect, useState } from "react";
import api from "../services/api";

export function Transacoes() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    tipo: 1,
    pessoaId: "",
    categoriaId: "",
  });

  useEffect(() => {
    api.get("/pessoas").then((res) => setPessoas(res.data));
    api.get("/categoria").then((res) => setCategorias(res.data));
  }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/transacoes", {
        ...formData,
        valor: Number(formData.valor),
      });
      alert("Lançamento efetuado com sucesso!");
      setFormData({ ...formData, descricao: "", valor: "" });
    } catch (err: any) {
      // Aqui o alert vai mostrar a mensagem do Backend (ex: "Menor de idade não pode ter receita")
      alert(
        err.response?.data || "Erro ao salvar transação. Verifique as regras."
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-200">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400">
        Novo Lançamento
      </h2>

      <form
        onSubmit={handleSalvar}
        className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Descrição</label>
            <input
              className="bg-slate-900 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              className="bg-slate-900 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Tipo de Lançamento</label>
            <select
              className="bg-slate-900 border border-slate-700 p-3 rounded-lg outline-none"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: Number(e.target.value) })
              }
            >
              <option value={1}>Despesa</option>
              <option value={2}>Receita</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Responsável</label>
            <select
              className="bg-slate-900 border border-slate-700 p-3 rounded-lg outline-none"
              value={formData.pessoaId}
              onChange={(e) =>
                setFormData({ ...formData, pessoaId: e.target.value })
              }
              required
            >
              <option value="">Selecione a pessoa...</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos)
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-slate-400">Categoria</label>
            <select
              className="bg-slate-900 border border-slate-700 p-3 rounded-lg outline-none"
              value={formData.categoriaId}
              onChange={(e) =>
                setFormData({ ...formData, categoriaId: e.target.value })
              }
              required
            >
              <option value="">Selecione a categoria...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95">
          Finalizar Lançamento
        </button>
      </form>
    </div>
  );
}
