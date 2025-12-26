import api from "./api";

export interface Categoria {
  id?: string;
  descricao: string;
  finalidade: number;
}

export const categoriaService = {
  listar: () => api.get<Categoria[]>("/categoria"),
  criar: (c: Categoria) => api.post<Categoria>("/categoria", c),
  atualizar: (id: string, c: Categoria) => api.put(`/categoria/${id}`, c), // Habilita a correção de nomes
  deletar: (id: string) => api.delete(`/categorias/${id}`),
};
