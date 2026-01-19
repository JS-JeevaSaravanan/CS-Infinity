import { Database } from "bun:sqlite";

export const db = new Database("shop.db");

// PRODUCTS
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    category TEXT
  )
`);

// CUSTOMERS
db.run(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    haveElitePass BOOLEAN
  )
`);

// CATEGORY DISCOUNTS
db.run(`
  CREATE TABLE IF NOT EXISTS category_discounts (
    category TEXT PRIMARY KEY,
    discount REAL
  )
`);
