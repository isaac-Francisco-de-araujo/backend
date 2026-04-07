import express from "express";

import { CategoriasController } from "./controllers/categoriascontroller";
import { ClienteController } from "./controllers/ClienteController";
import { EstoqueController } from "./controllers/EstoqueController";
import { FornecedorController } from "./controllers/Fornecedorescontroller";
import { ItemPedidoController } from "./controllers/itenspedidoscontroller";
import { PagamentoController } from "./controllers/pagamentosconroller";
import { PedidoController } from "./controllers/pedidoscontroller";
import { ProdutoController } from "./controllers/ProdutoController";
import { UsuarioAdminController } from "./controllers/usuarioadminController";

export const app = express();

app.use(express.json());

ClienteController();
ProdutoController();
CategoriasController();
EstoqueController();
FornecedorController();
ItemPedidoController();
PagamentoController();
PedidoController();
UsuarioAdminController();

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
