import { db } from "../db";
import type { Product, Customer, CategoryDiscount } from "../db-types";
import { type Result, ok, err } from "./result";

export const getProductResult = (productId: number): Result<Product> => {
  const row = db
    .query<Product, [number]>("SELECT * FROM products WHERE id = ?")
    .get(productId);

  return row ? ok(row) : err("PRODUCT_NOT_FOUND");
};

export const getCustomerResult = (customerId: number): Result<Customer> => {
  const row = db
    .query<Customer, [number]>("SELECT * FROM customers WHERE id = ?")
    .get(customerId);

  return row ? ok(row) : err("CUSTOMER_NOT_FOUND");
};

export const getCategoryResult = (
  category: string,
): Result<CategoryDiscount> => {
  const row = db
    .query<
      CategoryDiscount,
      [string]
    >("SELECT discount FROM category_discounts WHERE category = ?")
    .get(category);

  return row ? ok(row) : err("CATEGORY_DISCOUNT_NOT_FOUND");
};
