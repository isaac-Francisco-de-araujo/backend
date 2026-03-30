import db from "../database/database";
import { intens_pedido } from "../models/itens_pedido";

export class ItemPedidoRepository {

  salvar(item: intens_pedido): intens_pedido {
    const resultado = db
      .prepare(`
        INSERT INTO itens_pedidos (id_pedido, id_produto, tamanho, cor, quantidade, preco_unitario)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        item.id_pedido,
        item.id_produto,
        item.tamanho,
        item.cor,
        item.quantidade,
        item.preco_unitario
      );

    return {
      id: Number(resultado.lastInsertRowid),
      id_pedido: item.id_pedido,
      id_produto: item.id_produto,
      tamanho: item.tamanho,
      cor: item.cor,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario
    };
  }

  listar(): intens_pedido[] {
    return db.prepare("SELECT * FROM itens_pedidos").all() as intens_pedido[];
  }

  buscarPorId(id: number): intens_pedido | null {
    return (db
      .prepare("SELECT * FROM itens_pedidos WHERE id = ?")
      .get(id) as intens_pedido) ?? null;
  }

  buscarPorPedido(id_pedido: number): intens_pedido[] {
    return db
      .prepare("SELECT * FROM itens_pedidos WHERE id_pedido = ?")
      .all(id_pedido) as intens_pedido[];
  }

  buscarPorProduto(id_produto: number): intens_pedido[] {
    return db
      .prepare("SELECT * FROM itens_pedidos WHERE id_produto = ?")
      .all(id_produto) as intens_pedido[];
  }
  atualizar(id: number, dados: intens_pedido): intens_pedido {
  db.prepare(`
    UPDATE itens_pedidos
    SET tamanho = ?, cor = ?, quantidade = ?, preco_unitario = ?
    WHERE id = ?
  `).run(dados.tamanho, dados.cor, dados.quantidade, dados.preco_unitario, id);

  return { id, ...dados };
}

deletar(id: number): void {
  db.prepare("DELETE FROM itens_pedidos WHERE id = ?").run(id);
}
}