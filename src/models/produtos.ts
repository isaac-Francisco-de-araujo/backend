export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  categoria_id?: number;
  fornecedor_id?: number;
  preco: number;
  custo?: number;
  ativo?: number;
}