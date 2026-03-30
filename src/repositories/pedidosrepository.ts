import db from "../database/database";
import { pedidos } from "../models/pedidos";

export class PedidoRepository {

  salvar(pedido: pedidos): pedidos {
    const resultado = db
      .prepare(`
        INSERT INTO pedidos (id_cliente, valor_total, data_pedido, status)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        pedido.id_cliente,
        pedido.valor_total,
        pedido.data_pedido,
        pedido.status
      );

    return {
      id: Number(resultado.lastInsertRowid),
      id_cliente: pedido.id_cliente,
      valor_total: pedido.valor_total,
      data_pedido: pedido.data_pedido,
      status: pedido.status
    };
  }

  listar(): pedidos[] {
    return db.prepare("SELECT * FROM pedidos").all() as pedidos[];
  }

  buscarPorId(id: number): pedidos | null {
    return (db
      .prepare("SELECT * FROM pedidos WHERE id = ?")
      .get(id) as pedidos) ?? null;
  }

  buscarPorCliente(id_cliente: number): pedidos[] {
    return db
      .prepare("SELECT * FROM pedidos WHERE id_cliente = ?")
      .all(id_cliente) as pedidos[];
  }
   atualizar(id: number, dados: pedidos): pedidos {
  db.prepare(`
    UPDATE pedidos
    SET id_cliente = ?, valor_total = ?, data_pedido = ?, status = ?,
    WHERE id = ?
  `).run(dados.id_cliente, dados.valor_total, dados.data_pedido, dados.status, id);

  return { id, ...dados };
}

deletar(id: number): void {
  db.prepare("DELETE FROM pedidos WHERE id = ?").run(id);
}
atualizarstatus(id: number, dados: pedidos): pedidos {
 db.prepare(`
    UPDATE pedidos
    SET status,
    WHERE id = ?
  `).run(dados.status)
}
}