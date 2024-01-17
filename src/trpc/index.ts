import { authRouter } from "./auth-router";
import { router } from "./trpc";
import { productRouter } from "./product-router";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
