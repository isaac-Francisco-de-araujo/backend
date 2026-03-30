import db from "../database/database";
import { usuario_admin } from "../models/usuarios_admin";

export class UsuarioAdminRepository {

  salvar(usuario: usuario_admin): usuario_admin {
    const resultado = db
      .prepare(`
        INSERT INTO usuarios_admin (nome, email, senha, nivel_acesso)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.nivel_acesso
      );

    return {
      id: Number(resultado.lastInsertRowid),
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      nivel_acesso: usuario.nivel_acesso
    };
  }

  listar(): usuario_admin[] {
    return db.prepare("SELECT * FROM usuarios_admin").all() as usuario_admin[];
  }

  buscarPorId(id: number): usuario_admin | null {
    return (db
      .prepare("SELECT * FROM usuarios_admin WHERE id = ?")
      .get(id) as usuario_admin) ?? null;
  }

  buscarPorEmail(email: string): usuario_admin | null {
    return (db
      .prepare("SELECT * FROM usuarios_admin WHERE email = ?")
      .get(email) as usuario_admin) ?? null;
  }
  
atualizar(id: number, dados: pedidos): pedidos {
  db.prepare(`
    UPDATE pedidos
    SET valor_total = ?, data_pedido = ?, status = ?
    WHERE id = ?
  `).run(dados.valor_total, dados.data_pedido, dados.status, id);

  return { id, ...dados };
}

atualizarStatus(id: number, status: string): void {
  db.prepare(`
    UPDATE pedidos
    SET status = ?
    WHERE id = ?
  `).run(status, id);
}

deletar(id: number): void {
  db.prepare("DELETE FROM pedidos WHERE id = ?").run(id);
}
}