-- =========================
-- CLIENTES
-- =========================
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  senha TEXT NOT NULL,
  data_nascimento DATE,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORIAS
-- =========================
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT
);

-- =========================
-- FORNECEDORES
-- =========================
CREATE TABLE IF NOT EXISTS fornecedores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_empresa TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  email TEXT
);

-- =========================
-- PRODUTOS
-- =========================
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria_id INTEGER,
  fornecedor_id INTEGER,
  preco REAL NOT NULL,
  custo REAL,
  ativo INTEGER DEFAULT 1,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

-- =========================
-- ESTOQUE
-- =========================
CREATE TABLE IF NOT EXISTS estoque (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  tamanho TEXT NOT NULL,
  cor TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- =========================
-- PEDIDOS (VENDAS)
-- =========================
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  total REAL NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- =========================
-- ITENS DO PEDIDO
-- =========================
CREATE TABLE IF NOT EXISTS pedido_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  tamanho TEXT NOT NULL,
  cor TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario REAL NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- =========================
-- PAGAMENTOS
-- =========================
CREATE TABLE IF NOT EXISTS pagamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  metodo TEXT NOT NULL,
  status TEXT NOT NULL,
  valor REAL NOT NULL,
  data_pagamento DATETIME,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- =========================
-- USUÁRIOS ADMIN
-- =========================
CREATE TABLE IF NOT EXISTS usuarios_admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  nivel_acesso TEXT NOT NULL
);