import db from "../database/database";
import { fornecedor } from "../models/fornecedores";

export class FornecedorRepository {

  salvar(fornecedor: fornecedor): fornecedor {
    const resultado = db
      .prepare(`
        INSERT INTO fornecedores (nome_empresa, email, telefone, cnpj)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        fornecedor.nome_empresa,
        fornecedor.email,
        fornecedor.telefone,
        fornecedor.cnpj
      );

    return {
      id: Number(resultado.lastInsertRowid),
      nome_empresa: fornecedor.nome_empresa,
      email: fornecedor.email,
      telefone: fornecedor.telefone,
      cnpj: fornecedor.cnpj
    };
  }

  listar(): fornecedor[] {
    return db.prepare("SELECT * FROM fornecedores").all() as fornecedor[];
  }

  buscarPorId(id: number): fornecedor | null {
    return (db
      .prepare("SELECT * FROM fornecedores WHERE id = ?")
      .get(id) as fornecedor) ?? null;
  }

  buscarPorNome(nome_empresa: string): fornecedor[] {
    return db
      .prepare("SELECT * FROM fornecedores WHERE nome_empresa LIKE ?")
      .all(`%${nome_empresa}%`) as fornecedor[];
  }
  atualizar(id: number, dados: fornecedor): fornecedor {
  db.prepare(`
    UPDATE fornecedores
    SET nome_empresa = ?, email = ?, telefone = ?, cnpj = ?
    WHERE id = ?
  `).run(dados.nome_empresa, dados.email, dados.telefone, dados.cnpj, id);

  return { id, ...dados };
}

deletar(id: number): void {
  db.prepare("DELETE FROM fornecedores WHERE id = ?").run(id);
}
}