import { db } from "./db";

// products
db.run("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?)", [
  1,
  "Voltas AC",
  100,
  "Home Appliances",
]);

// customers
db.run("INSERT OR IGNORE INTO customers VALUES (?, ?, ?)", [
  1,
  "Selva Vinayaga",
  false,
]);

// category discount
db.run(
  "INSERT OR IGNORE INTO category_discounts VALUES (?, ?)",
  ["Home Appliances", 0.1], // 10% today
);

console.log("✅ Seeded data");
