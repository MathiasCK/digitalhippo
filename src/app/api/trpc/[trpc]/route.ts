import { appRouter } from "@/trpc/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request, _: Response) => {
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };
