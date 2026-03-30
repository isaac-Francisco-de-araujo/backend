import db from "../database/database";
import { cliente } from "../models/clientes";

export class ClienteRepository {
  salvar(cliente: cliente): cliente {
  const resultado = db
    .prepare(`
      INSERT INTO clientes (nome, email, telefone, senha, data_nascimento, data_cadastro)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      cliente.nome,
      cliente.email,
      cliente.telefone,
      cliente.senha,
      cliente.data_nascimento,
      cliente.data_cadastro
    );

  return {
    id: Number(resultado.lastInsertRowid),
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    senha: cliente.senha,
    data_nascimento: cliente.data_nascimento,
    data_cadastro: cliente.data_cadastro
  };
}

  listar(): cliente[] {
    return db.prepare("SELECT * FROM clientes").all() as cliente[];
  }

  buscarPorId(id: number): cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE id = ?").get(id) as cliente) ?? null;
  }

  buscarPorNome(nome: string): cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE nome LIKE ?").get(`%${nome}%`) as cliente) ?? null;
  }
}
