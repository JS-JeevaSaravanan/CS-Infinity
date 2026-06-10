import type { GetPriceSchema, PriceDetails } from "../types";
import {
  getCategoryResult,
  getCustomerResult,
  getProductResult,
} from "./data-access";
import { type Result, ok, err } from "./result";

const validateDiscountResult = (discount: number): Result<void> => {
  if (discount < 0 || discount > 0.5) {
    return err(`Invalid total discount: ${discount}`);
  }
  return ok(undefined);
};

export const getProductPriceDetailsWithResult = (
  purchase: GetPriceSchema,
): Result<PriceDetails> => {
  const customerResult = getCustomerResult(purchase.customerId);
  if (!customerResult.ok) return err(customerResult.error);

  const productResult = getProductResult(purchase.productId);
  if (!productResult.ok) return err(productResult.error);

  const categoryResult = getCategoryResult(productResult.value.category);
  const categoryDiscount = categoryResult.ok
    ? categoryResult.value.discount
    : 0;

  const basePrice = productResult.value.price;
  const eliteDiscount = customerResult.value.haveElitePass ? 0.05 : 0;
  const totalDiscount = eliteDiscount + categoryDiscount;

  const discountValidation = validateDiscountResult(totalDiscount);
  if (!discountValidation.ok) {
    return err(discountValidation.error);
  }

  const discountedPrice = basePrice * totalDiscount;
  const finalPrice = basePrice - discountedPrice;

  return ok({
    product: productResult.value.name,
    basePrice,
    discountedPrice,
    finalPrice,
  });
};
