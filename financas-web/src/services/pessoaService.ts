import type { Pessoa, PessoaDados } from "../types/pessoa";
import api from "./api";

export const pessoaService = {
  listar: () => api.get<Pessoa[]>("/pessoas"),
  criar: (pessoa: PessoaDados) => api.post<Pessoa>("/pessoas", pessoa),
  atualizar: (id: string, pessoa: Pessoa) => api.put(`/pessoas/${id}`, pessoa),
  deletar: (id: string) => api.delete(`/pessoas/${id}`),
};
