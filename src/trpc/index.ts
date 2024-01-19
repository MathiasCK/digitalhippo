import { authRouter } from "./auth-router";
import { router } from "./trpc";
import { productRouter } from "./product-router";
import { paymentRouter } from "./payment-router";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
