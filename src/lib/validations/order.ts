import { z } from "zod";

export const orderSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  address: z.string()
    .trim()
    .min(10, { message: "Please provide a complete delivery address" })
    .max(500, { message: "Address must be less than 500 characters" }),
  phone: z.string()
    .trim()
    .regex(/^(\+91)?[6-9]\d{9}$/, { message: "Please enter a valid Indian phone number" }),
  products: z.array(z.string()).min(1, { message: "Please select at least one item" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }).max(50),
  type: z.string().min(1, { message: "Please select a preparation type" })
});

export type OrderFormData = z.infer<typeof orderSchema>;
