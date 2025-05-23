import { log } from "@repo/logger";
import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express, { json, urlencoded } from "express";
import { z } from "zod";
import cors from "cors";
const app = express();
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 }));
// app.use(cookieparser());
app.set("trust proxy", 1);
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>> & {
  user?: {
    id: string;
    name: string;
  };
};
const t = initTRPC.context<Context>().create({});

const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
// ^ Default Meta: { authRequired: false }
// const authProcedure = publicProcedure.use(async (opts) => {
//   const { ctx } = opts;
//   if (!ctx.user?.isAdmin) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return opts.next({
//     ctx: {
//       user: ctx.user,
//     },
//   });
// });

export const appRouter = t.router({
  greeting: t.procedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z
        .object({
          name: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      // This is what you're returning to your client
      return {
        text: `hello ${input?.name ?? "world"}`,
        // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
      };
    }),
  getUser: t.procedure
    .input(z.object({ id: z.string().min(5) }))
    .query((opts) => {
      log("getUser::", opts.input);
      return { text: `Hey ${opts.input.id}` };
    }),
  createUser: t.procedure
    .input(z.object({ name: z.string().min(5) }))
    .mutation(async (opts) => {
      // use your ORM of choice
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return { messageL: `User ${opts.input.name} created!` };
    }),
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    middleware: cors(),
  })
);
// export type definition of API
export type AppRouter = typeof appRouter;
export { app };
