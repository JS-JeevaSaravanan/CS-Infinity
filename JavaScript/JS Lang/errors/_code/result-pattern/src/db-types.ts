// PRODUCTS
export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

// CUSTOMERS
export type Customer = {
  id: number;
  name: string;
  haveElitePass: boolean;
};

// CATEGORY DISCOUNTS
export type CategoryDiscount = {
  category: string;
  discount: number;
};
