import { Middleware } from "https://deno.land/x/oak@v10.2.0/mod.ts";

type Formatter = <T extends Error>(err: T) => any;
interface JsonErrorMiddlewareOptions {
  format?: Formatter | null;
}

export const jsonErrorMiddleware = <
  T = Middleware,
>({ format }: JsonErrorMiddlewareOptions): T => {
  const formatError = (err: any) => {
    return format ? format(err) : err;
  };

  const shouldThrow404 = (status?: number, body?: unknown) => {
    return !status || (status === 404 && body == null);
  };

  const core: Middleware = async (ctx, next) => {
    try {
      await next();
      // future proof status
      shouldThrow404(ctx.response.status, ctx.response.body) &&
        ctx.throw(404);
    } catch (err) {
      ctx.response.body = formatError(err) || {};
      // Set status
      ctx.response.status = err.status || err.statusCode || 500;
    }
  };
  return core as unknown as T;
};
