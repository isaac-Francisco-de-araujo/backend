import db from "../database/database";
import { estoque } from "../models/Estoque";

export class EstoqueRepository {

  salvar(estoque: estoque): estoque {
    const resultado = db
      .prepare(`
        INSERT INTO estoque (id_produto, quantidade, cor, tamanho)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        estoque.id_produto,
        estoque.quantidade,
        estoque.cor,
        estoque.tamanho
      );

    return {
      id: Number(resultado.lastInsertRowid),
      id_produto: estoque.id_produto,
      quantidade: estoque.quantidade,
      cor: estoque.cor,
      tamanho: estoque.tamanho
    };
  }

  listar(): estoque[] {
    return db.prepare("SELECT * FROM estoque").all() as estoque[];
  }

  buscarPorId(id: number): estoque | null {
    return (db
      .prepare("SELECT * FROM estoque WHERE id = ?")
      .get(id) as estoque) ?? null;
  }

  buscarPorProduto(id_produto: number): estoque[] {
    return db
      .prepare("SELECT * FROM estoque WHERE id_produto = ?")
      .all(id_produto) as estoque[];
  }
  atualizar(id: number, dados: estoque): estoque {
  db.prepare(`
    UPDATE estoque
    SET quantidade = ?, cor = ?, tamanho = ?
    WHERE id = ?
  `).run(dados.quantidade, dados.cor, dados.tamanho, id);

  return { id, ...dados };
}

atualizarQuantidade(id: number, quantidade: number): void {
  db.prepare(`
    UPDATE estoque
    SET quantidade = ?
    WHERE id = ?
  `).run(quantidade, id);
}

deletar(id: number): void {
  db.prepare("DELETE FROM estoque WHERE id = ?").run(id);
}
}