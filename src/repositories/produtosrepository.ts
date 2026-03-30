import db from "../database/database";
import { Produto } from "../models/produtos";

export class ProdutoRepository {

  salvar(produto: Produto): Produto {
    const resultado = db
      .prepare(`
        INSERT INTO produtos 
        (nome, descricao, categoria_id, fornecedor_id, preco, custo, ativo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        produto.nome,
        produto.descricao ?? null,
        produto.categoria_id ?? null,
        produto.fornecedor_id ?? null,
        produto.preco,
        produto.custo ?? null,
        produto.ativo ?? 1
      );

    return {
      id: Number(resultado.lastInsertRowid),
      ...produto
    };
  }

  listar(): Produto[] {
    return db.prepare("SELECT * FROM produtos").all() as Produto[];
  }

  buscarPorId(id: number): Produto | null {
    const produto = db
      .prepare("SELECT * FROM produtos WHERE id = ?")
      .get(id) as Produto;

    return produto ?? null;
  }

  buscarPorNome(nome: string): Produto[] {
    return db
      .prepare("SELECT * FROM produtos WHERE nome LIKE ?")
      .all(`%${nome}%`) as Produto[];
  }

  atualizar(id: number, dados: Produto): Produto {
    db.prepare(`
      UPDATE produtos
      SET 
        nome = ?, 
        descricao = ?, 
        categoria_id = ?, 
        fornecedor_id = ?, 
        preco = ?, 
        custo = ?, 
        ativo = ?
      WHERE id = ?
    `).run(
      dados.nome,
      dados.descricao ?? null,
      dados.categoria_id ?? null,
      dados.fornecedor_id ?? null,
      dados.preco,
      dados.custo ?? null,
      dados.ativo ?? 1,
      id
    );

    return { id, ...dados };
  }

  deletar(id: number): void {
    db.prepare("DELETE FROM produtos WHERE id = ?").run(id);
  }
}