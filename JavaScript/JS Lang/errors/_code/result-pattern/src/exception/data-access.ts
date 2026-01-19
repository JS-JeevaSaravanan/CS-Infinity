import { db } from "../db";
import type { Product, Customer, CategoryDiscount } from "../db-types";

export const getProduct = (productId: number): Product => {
  const row = db
    .query<Product, [number]>("SELECT * FROM products WHERE id = ?")
    .get(productId);
  if (!row) {
    throw new Error(`Prodcut ${productId} not found`);
  }

  return row;
};

export const getCustomer = (customerId: number): Customer => {
  const row = db
    .query<Customer, [number]>("SELECT * FROM customers WHERE id = ?")
    .get(customerId);
  if (!row) {
    throw new Error(`Customer ${customerId} not found`);
  }
  return row;
};

export const getCategoryDiscount = (category: string): CategoryDiscount => {
  const row = db
    .query<
      CategoryDiscount,
      [string]
    >("SELECT discount FROM category_discounts WHERE category = ?")
    .get(category);

  if (!row) {
    throw new Error(`Categoy ${category} not found`);
  }

  return row;
};
