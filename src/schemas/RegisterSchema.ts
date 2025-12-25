import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .nonempty({ message: "Name is required." })
      .min(3, { message: "Name must be at least 3 characters." })
      .max(50, { message: "Name must be at most 50 characters." }),

    email: zod
      .string()
      .nonempty({ message: "Email is required." })
      .regex(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/, {
        message: "Invalid email address.",
      }),

    password: zod
      .string()
      .nonempty({ message: "Password is required." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must be at least 8 characters, include uppercase, lowercase, number and special character.",
        }
      ),

    rePassword: zod.string().nonempty({ message: "re-password is required." }),

    phone: zod
    .string()
    .nonempty({ message: "Phone number is required." })
    .regex(/^(?:010|011|012|015)\d{8}$/, { message: "Invalid Egyptian phone number." }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });
