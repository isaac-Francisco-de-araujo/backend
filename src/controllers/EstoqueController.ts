import { app } from "../server";
import { EstoqueRepository } from "../repositories/estoquerepository";

export function EstoqueController() {
  const repository = new EstoqueRepository();

  // LISTAR ou BUSCAR POR PRODUTO
  app.get("/estoque", (req, res) => {
    const { id_produto } = req.query;

    if (id_produto) {
      const id = parseInt(id_produto as string);
      if (isNaN(id))
        return res.status(400).json({ erro: "ID do produto inválido" });

      const itens = repository.buscarPorProduto(id);
      return res.json(itens);
    }

    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/estoque/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const item = repository.buscarPorId(id);
    if (!item)
      return res.status(404).json({ erro: "Item de estoque não encontrado" });

    res.json(item);
  });

  // CRIAR
  app.post("/estoque", (req, res) => {
    try {
      const { id_produto, quantidade, cor, tamanho } = req.body;

      if (!id_produto)
        throw new Error("ID do produto é obrigatório");

      if (quantidade === undefined || quantidade === null)
        throw new Error("Quantidade é obrigatória");

      if (typeof quantidade !== "number" || quantidade < 0)
        throw new Error("Quantidade não pode ser negativa");

      if (!cor || cor.trim().length === 0)
        throw new Error("Cor é obrigatória");

      if (!tamanho || tamanho.trim().length === 0)
        throw new Error("Tamanho é obrigatório");

      const item = repository.salvar({
        id_produto,
        quantidade,
        cor: cor.trim(),
        tamanho: tamanho.trim(),
      });

      res.status(201).json(item);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/estoque/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Item não encontrado" });

      const { quantidade, cor, tamanho } = req.body;

      if (quantidade !== undefined && (typeof quantidade !== "number" || quantidade < 0))
        throw new Error("Quantidade não pode ser negativa");

      if (cor !== undefined && cor.trim().length === 0)
        throw new Error("Cor não pode ser vazia");

      if (tamanho !== undefined && tamanho.trim().length === 0)
        throw new Error("Tamanho não pode ser vazio");

      const atualizado = repository.atualizar(id, {
        id_produto: existente.id_produto,
        quantidade: quantidade ?? existente.quantidade,
        cor: cor?.trim() ?? existente.cor,
        tamanho: tamanho?.trim() ?? existente.tamanho,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR APENAS QUANTIDADE (PATCH)
  app.patch("/estoque/:id/quantidade", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Item não encontrado" });

      const { quantidade } = req.body;

      if (quantidade === undefined || quantidade === null)
        throw new Error("Quantidade é obrigatória");

      if (typeof quantidade !== "number" || quantidade < 0)
        throw new Error("Quantidade não pode ser negativa");

      repository.atualizarQuantidade(id, quantidade);

      res.json({ id, quantidade });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/estoque/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Item não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}