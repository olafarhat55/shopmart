import * as zod from "zod";

export const loginSchema = zod.object({
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
});