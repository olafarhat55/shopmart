import z from "zod";
export const addressSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters"),
  phone: z
    .string()
    .nonempty({ message: "Phone number is required." })
    .regex(/^(?:010|011|012|015)\d{8}$/, {
      message: "Invalid Egyptian phone number.",
    }),
  city: z
    .string()
    .nonempty("City is required")
    .min(2, "City must be at least 2 characters")
    .max(20, "City must be at most 20 characters"),
  details: z
    .string()
    .nonempty("Detail is required")
    .max(100, "Detail must be at most 100 characters"),
});
