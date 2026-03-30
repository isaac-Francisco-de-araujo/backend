import { app } from "../server";
import { ProdutoRepository } from "../repositories/produtosrepository";

export function ProdutoController() {
  const repository = new ProdutoRepository();

  app.get("/produtos", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const produtos = repository.buscarPorNome(nome as string);
      return res.json(produtos);
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
      const {
        nome,
        preco,
        descricao,
        categoria_id,
        fornecedor_id,
        custo,
        ativo,
      } = req.body;

      // validações
      if (!nome || nome.trim().length === 0)
        throw new Error("Nome é obrigatório");

      if (preco === undefined || preco === null)
        throw new Error("Preço é obrigatório");

      if (typeof preco !== "number" || preco <= 0)
        throw new Error("Preço deve ser maior que zero");

      const produto = repository.salvar({
        nome: nome.trim(),
        preco,
        descricao: descricao?.trim(),
        categoria_id,
        fornecedor_id,
        custo,
        ativo,
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

      const {
        nome,
        preco,
        descricao,
        categoria_id,
        fornecedor_id,
        custo,
        ativo,
      } = req.body;

      // validações
      if (nome !== undefined && nome.trim().length === 0)
        throw new Error("Nome não pode ser vazio");

      if (preco !== undefined && (typeof preco !== "number" || preco <= 0))
        throw new Error("Preço deve ser maior que zero");

      const atualizado = repository.atualizar(id, {
        nome: nome?.trim() ?? existente.nome,
        preco: preco ?? existente.preco,
        descricao: descricao?.trim() ?? existente.descricao,
        categoria_id: categoria_id ?? existente.categoria_id,
        fornecedor_id: fornecedor_id ?? existente.fornecedor_id,
        custo: custo ?? existente.custo,
        ativo: ativo ?? existente.ativo,
      });

      res.json(atualizado);
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