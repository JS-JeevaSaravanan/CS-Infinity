import { z } from "zod";

export const GetPriceSchema = z.object({
  productId: z.number(),
  customerId: z.number(),
});

export type GetPriceSchema = Readonly<z.infer<typeof GetPriceSchema>>;

export interface PriceDetails {
  product: string;
  basePrice: number;
  discountedPrice: number;
  finalPrice: number;
}
