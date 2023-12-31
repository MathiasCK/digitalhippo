import express, { Request, Response } from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "../next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "../trpc";
import { inferAsyncReturnType } from "@trpc/server";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const main = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async cms => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  app.use((req: Request, res: Response) => {
    nextHandler(req, res);
  });

  nextApp.prepare().then(() => {
    payload.logger.info("NextJS ready");
  });

  app.listen(PORT, async () => {
    payload.logger.info(
      `Next.js App URL: ${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}`,
    );
  });
};

main();
