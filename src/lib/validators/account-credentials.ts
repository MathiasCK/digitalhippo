import { z } from "zod";

export const AuthCredentialsValidator = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    passwordConfirmation: z.string().min(8, {
      message: "Password confirmation must be at least 8 characters long",
    }),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    path: ["passwordConfirmation"],
  });

//export type AuthCredentials = z.infer<typeof AuthCredentialsValidator>;
export type AuthCredentials = {
  email: string;
  password: string;
  passwordConfirmation?: string;
};
