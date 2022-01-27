import { Middleware } from "https://deno.land/x/oak@v10.1.1/mod.ts";

type Formatter = <T extends Error>(err: T) => any;
interface JsonErrorMiddlewareOptions {
  format?: Formatter | null;
}

export default function createJsonErrorMiddleware(
  options: JsonErrorMiddlewareOptions,
) {
  /**
   * Apply all ordered formatting functions to original error.
   * @param  {Error} err The thrown error.
   * @return {Object}    The JSON serializable formatted object.
   */
  const formatError = (err: any) => {
    return options.format ? options.format(err) : err;
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
  return jsonError;
}
