# oak_json_error

The oak version of [koa-json-error](https://github.com/koajs/json-error).

## Usage

```ts
import { jsonErrorMiddleware } from "https://deno.land/x/oak_json_error/mod.ts";

const errorHandler = jsonErrorMiddleware();
app.use(errorHandler);
// ... Your code here ...
// app.use(route.routes())
```

## Customize

### Options

`format`: `<T extends Error>(err: T) => any;`

```ts
const errorHandler = jsonErrorMiddleware({ // If the error is thrown by ctx.throw, it will have status
  format: (err: Error & { status: number }) => {
    return {
      code: err.status,
      message: err.message,
      error: err.message,
    };
  },
});
```

