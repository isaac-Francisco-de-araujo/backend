import { app } from "../server";
import { CategoriasRepository } from "../repositories/categoriasrepository";

export function CategoriasController() {
  const repository = new CategoriasRepository();

  // LISTAR ou BUSCAR POR NOME
  app.get("/categorias", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const categorias = repository.buscarPorNome(nome as string);
      return res.json(categorias);
    }

    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/categorias/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const categoria = repository.buscarPorId(id);
    if (!categoria)
      return res.status(404).json({ erro: "Categoria não encontrada" });

    res.json(categoria);
  });

  // CRIAR
  app.post("/categorias", (req, res) => {
    try {
      const { nome, descricao } = req.body;

      if (!nome || nome.trim().length === 0)
        throw new Error("Nome é obrigatório");

      if (!descricao || descricao.trim().length === 0)
        throw new Error("Descrição é obrigatória");

      const categoria = repository.salvar({
        nome: nome.trim(),
        descricao: descricao.trim(),
      });

      res.status(201).json(categoria);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/categorias/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Categoria não encontrada" });

      const { nome, descricao } = req.body;

      if (nome !== undefined && nome.trim().length === 0)
        throw new Error("Nome não pode ser vazio");

      if (descricao !== undefined && descricao.trim().length === 0)
        throw new Error("Descrição não pode ser vazia");

      const atualizado = repository.salvar({
        id,
        nome: nome?.trim() ?? existente.nome,
        descricao: descricao?.trim() ?? existente.descricao,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/categorias/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Categoria não encontrada" });

    db.prepare("DELETE FROM categorias WHERE id = ?").run(id);

    res.status(204).send();
  });
}