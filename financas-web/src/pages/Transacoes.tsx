import { useEffect, useState } from "react";
import api from "../services/api";

interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}
interface Categoria {
  id: string;
  descricao: string;
  finalidade: number;
}

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Estados do formulário
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState(1); // 1: Despesa, 2: Receita
  const [pessoaId, setPessoaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  async function carregarDadosIniciais() {
    try {
      // Busca lançamentos, pessoas e categorias simultaneamente
      const [resT, resP, resC] = await Promise.all([
        api.get("/transacoes"),
        api.get("/pessoas"),
        api.get("/categoria"),
      ]);
      setTransacoes(resT.data);
      setPessoas(resP.data);
      setCategorias(resC.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  function prepararEdicao(t: any) {
    setEditandoId(t.id);
    setDescricao(t.descricao);
    setValor(t.valor.toString());
    setTipo(t.tipo);
    setPessoaId(t.pessoaId);
    setCategoriaId(t.categoriaId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      id: editandoId || undefined,
      descricao,
      valor: Number(valor),
      tipo,
      pessoaId,
      categoriaId,
    };

    try {
      if (editandoId) {
        await api.put(`/transacoes/${editandoId}`, payload);
      } else {
        await api.post("/transacoes", payload);
      }

      limparCampos();
      carregarDadosIniciais();
      alert("Lançamento salvo com sucesso!");
    } catch (error: any) {
      const msg = error.response?.data || "Erro ao salvar lançamento.";
      alert(msg);
    }
  }

  function limparCampos() {
    setEditandoId(null);
    setDescricao("");
    setValor("");
    setTipo(1);
    setPessoaId("");
    setCategoriaId("");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400">
        {editandoId ? "🔧 Editar Lançamento" : "💸 Novo Lançamento"}
      </h2>

      <form
        onSubmit={handleSalvar}
        className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-lg"
      >
        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm">Descrição</label>
          <input
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            placeholder="Ex: Mercado, Aluguel..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
            placeholder="0,00"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm">Tipo de Lançamento</label>
          <select
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
            value={tipo}
            onChange={(e) => setTipo(Number(e.target.value))}
          >
            <option value={1}>Despesa</option>
            <option value={2}>Receita</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400 text-sm">Responsável</label>
          <select
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
            value={pessoaId}
            onChange={(e) => setPessoaId(e.target.value)}
            required
          >
            <option value="">Selecione uma pessoa...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-slate-400 text-sm">Categoria</label>
          <select
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            className={`flex-1 py-3 rounded-lg font-bold transition-all active:scale-95 ${
              editandoId
                ? "bg-amber-500 text-slate-900"
                : "bg-indigo-600 text-white"
            }`}
          >
            {editandoId ? "Atualizar" : "Finalizar Lançamento"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={limparCampos}
              className="px-6 py-3 bg-slate-700 rounded-lg font-bold"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-700 text-slate-200 text-sm">
            <tr>
              <th className="p-4">Descrição</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Responsável</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transacoes.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-slate-200">
                    {t.descricao}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t.categoria?.descricao || "Sem categoria"}
                  </div>
                </td>
                <td
                  className={`p-4 font-bold ${
                    t.tipo === 2 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {t.tipo === 2 ? "+" : "-"} R${" "}
                  {t.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="p-4 text-slate-400 text-sm">
                  {t.pessoa?.nome || "Não informado"}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => prepararEdicao(t)}
                    className="text-indigo-400 hover:text-indigo-300 mr-4 font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("Excluir?")) {
                        await api.delete(`/transacoes/${t.id}`);
                        carregarDadosIniciais();
                      }
                    }}
                    className="text-rose-500 font-semibold"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
