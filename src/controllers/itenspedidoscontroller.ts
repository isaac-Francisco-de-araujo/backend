import { app } from "../server";
import { ItemPedidoRepository } from "../repositories/itempedidorepository";

export function ItemPedidoController() {
  const repository = new ItemPedidoRepository();

  // LISTAR / FILTROS
  app.get("/itens-pedidos", (req, res) => {
    const { id_pedido, id_produto } = req.query;

    if (id_pedido) {
      const id = parseInt(id_pedido as string);
      if (isNaN(id))
        return res.status(400).json({ erro: "ID do pedido inválido" });

      return res.json(repository.buscarPorPedido(id));
    }

    if (id_produto) {
      const id = parseInt(id_produto as string);
      if (isNaN(id))
        return res.status(400).json({ erro: "ID do produto inválido" });

      return res.json(repository.buscarPorProduto(id));
    }

    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/itens-pedidos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const item = repository.buscarPorId(id);
    if (!item)
      return res.status(404).json({ erro: "Item não encontrado" });

    res.json(item);
  });

  // CRIAR
  app.post("/itens-pedidos", (req, res) => {
    try {
      const {
        id_pedido,
        id_produto,
        tamanho,
        cor,
        quantidade,
        preco_unitario,
      } = req.body;

      if (!id_pedido)
        throw new Error("ID do pedido é obrigatório");

      if (!id_produto)
        throw new Error("ID do produto é obrigatório");

      if (!tamanho || tamanho.trim().length === 0)
        throw new Error("Tamanho é obrigatório");

      if (!cor || cor.trim().length === 0)
        throw new Error("Cor é obrigatória");

      if (quantidade === undefined || quantidade === null)
        throw new Error("Quantidade é obrigatória");

      if (typeof quantidade !== "number" || quantidade <= 0)
        throw new Error("Quantidade deve ser maior que zero");

      if (preco_unitario === undefined || preco_unitario === null)
        throw new Error("Preço unitário é obrigatório");

      if (typeof preco_unitario !== "number" || preco_unitario <= 0)
        throw new Error("Preço unitário deve ser maior que zero");

      const item = repository.salvar({
        id_pedido,
        id_produto,
        tamanho: tamanho.trim(),
        cor: cor.trim(),
        quantidade,
        preco_unitario,
      });

      res.status(201).json(item);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/itens-pedidos/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Item não encontrado" });

      const { tamanho, cor, quantidade, preco_unitario } = req.body;

      if (tamanho !== undefined && tamanho.trim().length === 0)
        throw new Error("Tamanho não pode ser vazio");

      if (cor !== undefined && cor.trim().length === 0)
        throw new Error("Cor não pode ser vazia");

      if (quantidade !== undefined && (typeof quantidade !== "number" || quantidade <= 0))
        throw new Error("Quantidade deve ser maior que zero");

      if (
        preco_unitario !== undefined &&
        (typeof preco_unitario !== "number" || preco_unitario <= 0)
      )
        throw new Error("Preço unitário deve ser maior que zero");

      const atualizado = repository.atualizar(id, {
        id_pedido: existente.id_pedido,
        id_produto: existente.id_produto,
        tamanho: tamanho?.trim() ?? existente.tamanho,
        cor: cor?.trim() ?? existente.cor,
        quantidade: quantidade ?? existente.quantidade,
        preco_unitario: preco_unitario ?? existente.preco_unitario,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/itens-pedidos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Item não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}