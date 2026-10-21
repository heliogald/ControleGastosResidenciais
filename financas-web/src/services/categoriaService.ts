import type { Categoria, CategoriaDados } from "../types/categoria";
import api from "./api";

export const categoriaService = {
  listar: () => api.get<Categoria[]>("/categoria"),
  criar: (c: CategoriaDados) => api.post<Categoria>("/categoria", c),
  atualizar: (id: string, c: Categoria) => api.put<void>(`/categoria/${id}`, c),
  deletar: (id: string) => api.delete<void>(`/categoria/${id}`),
};
