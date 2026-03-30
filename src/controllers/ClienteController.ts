import { app } from "../server";
import { ClienteRepository } from "../repositories/clientesrepository";

export function ClienteController() {
  const repository = new ClienteRepository();

  const toDateString = (date: string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error("Data inválida, use o formato YYYY-MM-DD");
    return d.toISOString().split("T")[0];
  };

  app.get("/clientes", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const cliente = repository.buscarPorNome(nome as string);
      if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
      return res.json(cliente);
    }

    res.json(repository.listar());
  });

  app.get("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const cliente = repository.buscarPorId(id);
    if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(cliente);
  });

  app.post("/clientes", (req, res) => {
    try {
      const { nome, email, telefone, senha, data_nascimento } = req.body;

      if (!nome || nome.trim().length === 0) throw new Error("Nome é obrigatório");
      if (!email || !email.includes("@")) throw new Error("Email inválido");
      if (!telefone || telefone.trim().length === 0) throw new Error("Telefone é obrigatório");
      if (!senha || senha.trim().length < 6) throw new Error("Senha deve ter no mínimo 6 caracteres");
      if (!data_nascimento) throw new Error("Data de nascimento é obrigatória");

      const cliente = repository.salvar({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        senha,
        data_nascimento: toDateString(data_nascimento),
        data_cadastro: new Date().toISOString().split("T")[0],
      } as any);

      res.status(201).json(cliente);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  app.put("/clientes/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const existente = repository.buscarPorId(id);
      if (!existente) return res.status(404).json({ erro: "Cliente não encontrado" });

      const { nome, email, telefone, senha, data_nascimento } = req.body;

      if (nome !== undefined && nome.trim().length === 0) throw new Error("Nome não pode ser vazio");
      if (email !== undefined && !email.includes("@")) throw new Error("Email inválido");
      if (telefone !== undefined && telefone.trim().length === 0) throw new Error("Telefone não pode ser vazio");
      if (senha !== undefined && senha.trim().length < 6) throw new Error("Senha deve ter no mínimo 6 caracteres");

      const atualizado = repository.atualizar (id, {
        nome: nome?.trim() ?? existente.nome,
        email: email?.trim() ?? existente.email,
        telefone: telefone?.trim() ?? existente.telefone,
        senha: senha ?? existente.senha,
        data_nascimento: data_nascimento ? toDateString(data_nascimento) : existente.data_nascimento,
        data_cadastro: existente.data_cadastro,
      } as any);

      res.json(atualizado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });

  app.delete("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    const existente = repository.buscarPorId(id);
    if (!existente) return res.status(404).json({ erro: "Cliente não encontrado" });

    repository.deletar(id);
    res.status(204).send();
  });
}