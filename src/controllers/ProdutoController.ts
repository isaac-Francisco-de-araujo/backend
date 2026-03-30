import { app } from "../server";
import { ProdutoRepository } from "../repositories/produtosrepository";

export function ProdutoController() {
  const repository = new ProdutoRepository();

  app.get("/produtos", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const produto = repository.buscarPorNome(nome as string);
      if (!produto)
        return res.status(404).json({ erro: "Produto não encontrado" });
      return res.json(produto);
    }

    res.json(repository.listar());
  });

  app.get("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const produto = repository.buscarPorId(id);
    if (!produto)
      return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
  });

  app.post("/produtos", (req, res) => {
    try {
      const { nome, preco, descricao, categoria, estoque } = req.body;

      if (!nome || nome.trim().length === 0)
        throw new Error("Nome é obrigatório");
      if (preco === undefined || preco === null)
        throw new Error("Preço é obrigatório");
      if (typeof preco !== "number" || preco <= 0)
        throw new Error("Preço deve ser maior que zero");
      if (!descricao || descricao.trim().length === 0)
        throw new Error("Descrição é obrigatória");
      if (!categoria || categoria.trim().length === 0)
        throw new Error("Categoria é obrigatória");
      if (estoque === undefined || estoque === null)
        throw new Error("Estoque é obrigatório");
      if (typeof estoque !== "number" || estoque < 0)
        throw new Error("Estoque não pode ser negativo");

      const produto = repository.salvar({
        nome: nome.trim(),
        preco,
        descricao: descricao.trim(),
        categoria: categoria.trim(),
        estoque,
      });

      res.status(201).json(produto);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  app.put("/produtos/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Produto não encontrado" });

      const { nome, preco, descricao, categoria, estoque } = req.body;

      if (nome !== undefined && nome.trim().length === 0)
        throw new Error("Nome não pode ser vazio");
      if (preco !== undefined && (typeof preco !== "number" || preco <= 0))
        throw new Error("Preço deve ser maior que zero");
      if (descricao !== undefined && descricao.trim().length === 0)
        throw new Error("Descrição não pode ser vazia");
      if (categoria !== undefined && categoria.trim().length === 0)
        throw new Error("Categoria não pode ser vazia");
      if (estoque !== undefined && (typeof estoque !== "number" || estoque < 0))
        throw new Error("Estoque não pode ser negativo");

      const atualizado = repository.atualizar(id, {
        nome: nome?.trim() ?? existente.nome,
        preco: preco ?? existente.preco,
        descricao: descricao?.trim() ?? existente.descricao,
        categoria: categoria?.trim() ?? existente.categoria,
        estoque: estoque ?? existente.estoque,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  app.patch("/produtos/:id/estoque", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Produto não encontrado" });

      const { estoque } = req.body;
      if (estoque === undefined || estoque === null)
        throw new Error("Estoque é obrigatório");
      if (typeof estoque !== "number" || estoque < 0)
        throw new Error("Estoque não pode ser negativo");

      repository.atualizarEstoque(id, estoque);
      res.json({ id, estoque });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  app.delete("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Produto não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}
