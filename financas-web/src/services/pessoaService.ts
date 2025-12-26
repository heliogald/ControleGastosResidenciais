import api from "./api";

export interface Pessoa {
  id?: string;
  nome: string;
  idade: number;
}

export const pessoaService = {
  listar: () => api.get<Pessoa[]>("/pessoas"),
  criar: (pessoa: Pessoa) => api.post<Pessoa>("/pessoas", pessoa),
  atualizar: (id: string, pessoa: Pessoa) => api.put(`/pessoas/${id}`, pessoa),
  deletar: (id: string) => api.delete(`/pessoas/${id}`),
};
