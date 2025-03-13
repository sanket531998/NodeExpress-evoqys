import { z } from "zod";

export const productsSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Invalid decimal"),
  tags: z.array(z.string()),
});
