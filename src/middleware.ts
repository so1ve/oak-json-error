import { Middleware } from "https://deno.land/x/oak@v8.0.0/mod.ts";

type Formatter = <T extends Error>(err: T) => any;
interface JsonErrorMiddlewareOptions {
  format?: Formatter | null;
}

export const jsonErrorMiddleware = <
  T extends Middleware = Middleware,
>({ format }: JsonErrorMiddlewareOptions): T => {
  const formatError = (err: any) => {
    return format ? format(err) : err;
  };

  const shouldThrow404 = (status?: number, body?: unknown) => {
    return !status || (status === 404 && body == null);
  };

  const jsonError: Middleware = (ctx, next) => {
    return next()
      .then(() => {
        // future proof status
        shouldThrow404(ctx.response.status, ctx.response.body) &&
          ctx.throw(404);
      })
      .catch((err) => {
        // Format and set body
        ctx.response.body = formatError(err) || {};
        // Set status
        ctx.response.status = err.status || err.statusCode || 500;
      });
  };
  return jsonError as T;
};
