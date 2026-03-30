import { app } from "../server";
import { FornecedorRepository } from "../repositories/fornecedorrepository";

export function FornecedorController() {
  const repository = new FornecedorRepository();

  // LISTAR ou BUSCAR POR NOME
  app.get("/fornecedores", (req, res) => {
    const { nome_empresa } = req.query;

    if (nome_empresa) {
      const fornecedores = repository.buscarPorNome(nome_empresa as string);
      return res.json(fornecedores);
    }

    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/fornecedores/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const fornecedor = repository.buscarPorId(id);
    if (!fornecedor)
      return res.status(404).json({ erro: "Fornecedor não encontrado" });

    res.json(fornecedor);
  });

  // CRIAR
  app.post("/fornecedores", (req, res) => {
    try {
      const { nome_empresa, email, telefone, cnpj } = req.body;

      if (!nome_empresa || nome_empresa.trim().length === 0)
        throw new Error("Nome da empresa é obrigatório");

      if (!email || email.trim().length === 0)
        throw new Error("Email é obrigatório");

      if (!telefone || telefone.trim().length === 0)
        throw new Error("Telefone é obrigatório");

      if (!cnpj || cnpj.trim().length === 0)
        throw new Error("CNPJ é obrigatório");

      const fornecedor = repository.salvar({
        nome_empresa: nome_empresa.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        cnpj: cnpj.trim(),
      });

      res.status(201).json(fornecedor);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/fornecedores/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Fornecedor não encontrado" });

      const { nome_empresa, email, telefone, cnpj } = req.body;

      if (nome_empresa !== undefined && nome_empresa.trim().length === 0)
        throw new Error("Nome da empresa não pode ser vazio");

      if (email !== undefined && email.trim().length === 0)
        throw new Error("Email não pode ser vazio");

      if (telefone !== undefined && telefone.trim().length === 0)
        throw new Error("Telefone não pode ser vazio");

      if (cnpj !== undefined && cnpj.trim().length === 0)
        throw new Error("CNPJ não pode ser vazio");

      const atualizado = repository.atualizar(id, {
        nome_empresa: nome_empresa?.trim() ?? existente.nome_empresa,
        email: email?.trim() ?? existente.email,
        telefone: telefone?.trim() ?? existente.telefone,
        cnpj: cnpj?.trim() ?? existente.cnpj,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/fornecedores/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Fornecedor não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}