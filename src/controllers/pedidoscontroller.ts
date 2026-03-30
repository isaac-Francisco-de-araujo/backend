import { app } from "../server";
import { PedidoRepository } from "../repositories/pedidorepository";

export function PedidoController() {
  const repository = new PedidoRepository();

  // LISTAR / FILTRAR POR CLIENTE
  app.get("/pedidos", (req, res) => {
    const { id_cliente } = req.query;

    if (id_cliente) {
      const id = parseInt(id_cliente as string);
      if (isNaN(id))
        return res.status(400).json({ erro: "ID do cliente inválido" });

      return res.json(repository.buscarPorCliente(id));
    }

    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/pedidos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const pedido = repository.buscarPorId(id);
    if (!pedido)
      return res.status(404).json({ erro: "Pedido não encontrado" });

    res.json(pedido);
  });

  // CRIAR
  app.post("/pedidos", (req, res) => {
    try {
      const { id_cliente, valor_total, data_pedido, status } = req.body;

      if (!id_cliente)
        throw new Error("ID do cliente é obrigatório");

      if (valor_total === undefined || valor_total === null)
        throw new Error("Valor total é obrigatório");

      if (typeof valor_total !== "number" || valor_total < 0)
        throw new Error("Valor total não pode ser negativo");

      if (!data_pedido || data_pedido.trim().length === 0)
        throw new Error("Data do pedido é obrigatória");

      if (!status || status.trim().length === 0)
        throw new Error("Status é obrigatório");

      const pedido = repository.salvar({
        id_cliente,
        valor_total,
        data_pedido: data_pedido.trim(),
        status: status.trim(),
      });

      res.status(201).json(pedido);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/pedidos/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Pedido não encontrado" });

      const { valor_total, data_pedido, status } = req.body;

      if (valor_total !== undefined && (typeof valor_total !== "number" || valor_total < 0))
        throw new Error("Valor total não pode ser negativo");

      if (data_pedido !== undefined && data_pedido.trim().length === 0)
        throw new Error("Data do pedido não pode ser vazia");

      if (status !== undefined && status.trim().length === 0)
        throw new Error("Status não pode ser vazio");

      const atualizado = repository.atualizar(id, {
        id_cliente: existente.id_cliente,
        valor_total: valor_total ?? existente.valor_total,
        data_pedido: data_pedido?.trim() ?? existente.data_pedido,
        status: status?.trim() ?? existente.status,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR STATUS (PATCH)
  app.patch("/pedidos/:id/status", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Pedido não encontrado" });

      const { status } = req.body;

      if (!status || status.trim().length === 0)
        throw new Error("Status é obrigatório");

      repository.atualizarStatus(id, status.trim());

      res.json({ id, status });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/pedidos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Pedido não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}