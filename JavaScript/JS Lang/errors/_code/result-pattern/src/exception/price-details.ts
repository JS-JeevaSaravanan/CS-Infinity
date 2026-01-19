import type { GetPriceSchema, PriceDetails } from "../types";
import { getCategoryDiscount, getCustomer, getProduct } from "./data-access";

const safeGetCategoryDiscount = (category: string): number => {
  try {
    return getCategoryDiscount(category).discount;
  } catch (error) {
    // Soft fallback
    return 0;
  }
};

const validateDiscount = (discount: number) => {
  // Hard fails
  if (discount < 0 || discount > 0.5) {
    throw new Error(`Invalid total discount: ${discount}`);
  }
};

export const getProductPriceDetailsWithExceptions = ({
  productId,
  customerId,
}: GetPriceSchema): PriceDetails => {
  console.log("hello");
  // Hard fails
  const customer = getCustomer(customerId);
  const product = getProduct(productId);

  const basePrice = product.price;
  const eliteDiscount = customer.haveElitePass ? 0.05 : 0;
  const categoryDiscount = safeGetCategoryDiscount(product.category);
  const totalDiscount = eliteDiscount + categoryDiscount;
  validateDiscount(totalDiscount);

  const discountedPrice = basePrice * totalDiscount;
  const finalPrice = basePrice - discountedPrice;

  return {
    product: product.name,
    basePrice,
    discountedPrice,
    finalPrice,
  };
};
