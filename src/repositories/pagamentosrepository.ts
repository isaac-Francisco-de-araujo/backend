import db from "../database/database";
import { pagamento } from "../models/pagamentos";

export class PagamentoRepository {

  salvar(pagamento: pagamento): pagamento {
    const resultado = db
      .prepare(`
        INSERT INTO pagamentos (id_pedido, valor, data_pagamento, metodo_pagamento, status)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        pagamento.id_pedido,
        pagamento.valor,
        pagamento.data_pagamento,
        pagamento.metodo_pagamento,
        pagamento.status
      );

    return {
      id: Number(resultado.lastInsertRowid),
      id_pedido: pagamento.id_pedido,
      valor: pagamento.valor,
      data_pagamento: pagamento.data_pagamento,
      metodo_pagamento: pagamento.metodo_pagamento,
      status: pagamento.status
    };
  }

  listar(): pagamento[] {
    return db.prepare("SELECT * FROM pagamentos").all() as pagamento[];
  }

  buscarPorId(id: number): pagamento | null {
    return (db
      .prepare("SELECT * FROM pagamentos WHERE id = ?")
      .get(id) as pagamento) ?? null;
  }

  buscarPorPedido(id_pedido: number): pagamento[] {
    return db
      .prepare("SELECT * FROM pagamentos WHERE id_pedido = ?")
      .all(id_pedido) as pagamento[];
  }
  atualizar(id: number, dados: pagamento): pagamento {
  db.prepare(`
    UPDATE pagamentos
    SET valor = ?, data_pagamento = ?, metodo_pagamento = ?, status = ?
    WHERE id = ?
  `).run(
    dados.valor,
    dados.data_pagamento,
    dados.metodo_pagamento,
    dados.status,
    id
  );

  return { id, ...dados };
}

deletar(id: number): void {
  db.prepare("DELETE FROM pagamentos WHERE id = ?").run(id);
}
}
