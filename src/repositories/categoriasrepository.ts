import db from "../database/database";
import { categoria } from "../models/categorias";

export class CategoriasRepository {

  salvar(Categorias: categoria): categoria {
    const resultado = db
      .prepare(`
        INSERT INTO categorias (nome, descricao)
        VALUES (?, ?)
      `)
      .run(
        Categorias.nome,
        Categorias.descricao
      );

    return {
      id: Number(resultado.lastInsertRowid),
      nome: Categorias.nome,
      descricao: Categorias.descricao
    };
  }

  listar(): categoria[] {
    return db.prepare("SELECT * FROM categorias").all() as categoria[];
  }

  buscarPorId(id: number): categoria | null {
    return (db
      .prepare("SELECT * FROM categorias WHERE id = ?")
      .get(id) as categoria) ?? null;
  }

  buscarPorNome(nome: string): categoria[] {
    return db
      .prepare("SELECT * FROM categorias WHERE nome LIKE ?")
      .all(`%${nome}%`) as categoria[];
  }
  atualizar(id: number, dados: categoria): categoria {
  db.prepare(`
    UPDATE categorias
    SET nome = ?, descricao = ?
    WHERE id = ?
  `).run(dados.nome, dados.descricao, id);

  return { id, ...dados };
}

deletar(id: number): void {
  db.prepare("DELETE FROM categorias WHERE id = ?").run(id);
}
}