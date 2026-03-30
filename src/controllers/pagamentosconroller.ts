import { app } from "../server";
import { PagamentoRepository } from "../repositories/pagamentosrepository";

export function PagamentoController() {
  const repository = new PagamentoRepository();

  // LISTAR / FILTRAR POR PEDIDO
  app.get("/pagamentos", (req, res) => {
    const { id_pedido } = req.query;

    if (id_pedido) {
      const id = parseInt(id_pedido as string);
      if (isNaN(id))
        return res.status(400).json({ erro: "ID do pedido inválido" });

      return res.json(repository.buscarPorPedido(id));
    }

    res.json(repository.listar());
  });

  // BUSCAR POR ID
  app.get("/pagamentos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const pagamento = repository.buscarPorId(id);
    if (!pagamento)
      return res.status(404).json({ erro: "Pagamento não encontrado" });

    res.json(pagamento);
  });

  // CRIAR
  app.post("/pagamentos", (req, res) => {
    try {
      const {
        id_pedido,
        valor,
        data_pagamento,
        metodo_pagamento,
        status,
      } = req.body;

      if (!id_pedido)
        throw new Error("ID do pedido é obrigatório");

      if (valor === undefined || valor === null)
        throw new Error("Valor é obrigatório");

      if (typeof valor !== "number" || valor <= 0)
        throw new Error("Valor deve ser maior que zero");

      if (!data_pagamento || data_pagamento.trim().length === 0)
        throw new Error("Data do pagamento é obrigatória");

      if (!metodo_pagamento || metodo_pagamento.trim().length === 0)
        throw new Error("Método de pagamento é obrigatório");

      if (!status || status.trim().length === 0)
        throw new Error("Status é obrigatório");

      const pagamento = repository.salvar({
        id_pedido,
        valor,
        data_pagamento: data_pagamento.trim(),
        metodo_pagamento: metodo_pagamento.trim(),
        status: status.trim(),
      });

      res.status(201).json(pagamento);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // ATUALIZAR (PUT)
  app.put("/pagamentos/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente)
        return res.status(404).json({ erro: "Pagamento não encontrado" });

      const {
        valor,
        data_pagamento,
        metodo_pagamento,
        status,
      } = req.body;

      if (valor !== undefined && (typeof valor !== "number" || valor <= 0))
        throw new Error("Valor deve ser maior que zero");

      if (data_pagamento !== undefined && data_pagamento.trim().length === 0)
        throw new Error("Data do pagamento não pode ser vazia");

      if (metodo_pagamento !== undefined && metodo_pagamento.trim().length === 0)
        throw new Error("Método de pagamento não pode ser vazio");

      if (status !== undefined && status.trim().length === 0)
        throw new Error("Status não pode ser vazio");

      const atualizado = repository.atualizar(id, {
        id_pedido: existente.id_pedido,
        valor: valor ?? existente.valor,
        data_pagamento: data_pagamento?.trim() ?? existente.data_pagamento,
        metodo_pagamento: metodo_pagamento?.trim() ?? existente.metodo_pagamento,
        status: status?.trim() ?? existente.status,
      });

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  // DELETAR
  app.delete("/pagamentos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente)
      return res.status(404).json({ erro: "Pagamento não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}