import z from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d+$/, "Code must be numeric")
    .length(6, "Enter 6-digit code"),
});
export type OtpForm = z.infer<typeof otpSchema>;
