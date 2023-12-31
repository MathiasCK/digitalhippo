import {
  SignInValidator,
  SignUpValidator,
} from "../lib/validators/account-credentials";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../server/get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(SignUpValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });
      return { success: true, sentToEmail: email };
    }),
  signIn: publicProcedure
    .input(SignInValidator)
    .mutation(async ({ input, ctx }) => {
      const { res } = ctx;
      const { email, password } = input;

      const payload = await getPayloadClient();
      try {
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          // To set cookie
          res,
        });

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });

      if (!isVerified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return { success: true };
    }),
});
