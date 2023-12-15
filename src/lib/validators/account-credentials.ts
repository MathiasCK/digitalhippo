import { z } from "zod";

export const SignUpValidator = z
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

export type SignUpCredentials = z.infer<typeof SignUpValidator>;

export const SignInValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignInCredentials = z.infer<typeof SignInValidator>;
