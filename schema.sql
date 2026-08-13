-- Script de Criação de Tabelas para NeonDB (PostgreSQL)

CREATE TABLE IF NOT EXISTS items (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(500) NOT NULL,
  quantity VARCHAR(50) NOT NULL DEFAULT '1',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);

-- Tabela de Histórico de Compras Inteligente (Preços, Locais e Semântica)
CREATE TABLE IF NOT EXISTS purchase_history (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  item_name VARCHAR(500) NOT NULL,
  normalized_name VARCHAR(500) NOT NULL,
  price NUMERIC(10, 2),
  location VARCHAR(255),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchase_user_norm ON purchase_history(user_id, normalized_name);
CREATE INDEX IF NOT EXISTS idx_purchase_date ON purchase_history(purchased_at DESC);
