import { app } from "../server";
import { UsuarioAdminRepository } from "../repositories/usuarioadminrepository";

export function UsuarioAdminController() {
  const repository = new UsuarioAdminRepository();

  // LISTAR
  app.get("/usuarios-admin", (req, res) => {
    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/usuarios-admin/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const usuario = repository.buscarPorId(id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json(usuario);
  });

  // CRIAR
  app.post("/usuarios-admin", (req, res) => {
    try {
      const { nome, email, senha, nivel_acesso } = req.body;

      if (!nome || nome.trim().length === 0)
        throw new Error("Nome é obrigatório");

      if (!email || email.trim().length === 0)
        throw new Error("Email é obrigatório");

      if (!senha || senha.trim().length === 0)
        throw new Error("Senha é obrigatória");

      if (!nivel_acesso || nivel_acesso.trim().length === 0)
        throw new Error("Nível de acesso é obrigatório");

      const existente = repository.buscarPorEmail(email);
      if (existente)
        throw new Error("Email já cadastrado");

      const usuario = repository.salvar({
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim(),
        nivel_acesso: nivel_acesso.trim(),
      });

      res.status(201).json(usuario);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/usuarios-admin/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Usuário não encontrado" });

      const { nome, email, senha, nivel_acesso } = req.body;

      if (nome !== undefined && nome.trim().length === 0)
        throw new Error("Nome não pode ser vazio");

      if (email !== undefined && email.trim().length === 0)
        throw new Error("Email não pode ser vazio");

      if (senha !== undefined && senha.trim().length === 0)
        throw new Error("Senha não pode ser vazia");

      if (nivel_acesso !== undefined && nivel_acesso.trim().length === 0)
        throw new Error("Nível de acesso não pode ser vazio");

      // valida email duplicado
      if (email && email !== existente.email) {
        const outro = repository.buscarPorEmail(email);
        if (outro)
          throw new Error("Email já está em uso");
      }

      const atualizado = repository.atualizar(id, {
        nome: nome?.trim() ?? existente.nome,
        email: email?.trim() ?? existente.email,
        senha: senha?.trim() ?? existente.senha,
        nivel_acesso: nivel_acesso?.trim() ?? existente.nivel_acesso,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/usuarios-admin/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}