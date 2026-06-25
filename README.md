# @tmrp/env

Type-safe environment variable parsing for TypeScript projects, powered by
[Zod](https://zod.dev/).

`@tmrp/env` reads environment variables from the current runtime or an explicit
env-like object, validates them with Zod schemas, and returns a strongly typed
object for application code. It supports Node.js, Deno, Bun, Cloudflare Workers,
Vercel Edge, Netlify, browser-injected config, and `import.meta.env`-based
toolchains.

## Features

- Validate environment variables with any Zod schema.
- Infer TypeScript types from your schema definitions.
- Fail fast when required environment variables are missing.
- Skip validation for build or CI steps where runtime env vars are unavailable.
- Trim string values before validation.
- Support Node.js `process.env`, Deno `Deno.env.get`, Bun `Bun.env`, and known
  global env records.
- Validate explicit env records for edge runtimes, serverless bindings, browser
  config, and `import.meta.env`.
- Use runtime-specific entry points when you know the target runtime.

## Installation

```sh
pnpm add @tmrp/env zod
```

`zod` is used directly when defining schemas. This package also depends on
`effect` internally.

## Quick Start

```ts
import { createEnv } from "@tmrp/env";
import z from "zod";

export const env = createEnv({
  API_URL: z.url(),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive(),
});

// Fully typed:
env.API_URL; // string
env.PORT; // number
```

If a variable is missing or does not match its schema, `createEnv` throws during
initialization. This makes configuration problems visible at startup instead of
later in application code.

## Runtime Entry Points

| Entry point             | Export                | Runtime behavior                                                                  |
| ----------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `@tmrp/env`             | `createEnv`           | Detects supported runtime globals and reads from the available runtime.           |
| `@tmrp/env/bun`         | `createBunEnv`        | Reads from Bun `Bun.env`.                                                         |
| `@tmrp/env/node`        | `createNodeEnv`       | Reads from Node.js `process.env`.                                                 |
| `@tmrp/env/deno`        | `createDenoEnv`       | Reads from Deno `Deno.env.get`.                                                   |
| `@tmrp/env/record`      | `createRecordEnv`     | Reads from an explicit object.                                                    |
| `@tmrp/env/cloudflare`  | `createCloudflareEnv` | Reads from Cloudflare Worker bindings passed to a handler.                        |
| `@tmrp/env/vercel-edge` | `createVercelEdgeEnv` | Reads from an explicit env object in Vercel Edge code.                            |
| `@tmrp/env/netlify`     | `createNetlifyEnv`    | Reads from an explicit Netlify env object.                                        |
| `@tmrp/env/browser`     | `createBrowserEnv`    | Reads from an explicit browser config object.                                     |
| `@tmrp/env/import-meta` | `createImportMetaEnv` | Reads from `import.meta.env` for Vite, Astro, SvelteKit, Nuxt, and similar tools. |

## Runtime Usage

### Default Runtime Detection

Use `createEnv` when you want to read from whichever supported runtime globals
are available. It checks Bun, Vercel Edge, Netlify, Node, Deno, Cloudflare
global bindings, `import.meta.env` global shims, and browser config globals.

```ts
import { createEnv } from "@tmrp/env";
import z from "zod";

const env = createEnv({
  SERVICE_NAME: z.string().min(1),
});
```

For runtimes that do not expose env values through standard globals, prefer the
explicit record entry points. The default reader also supports these optional
global records when your application intentionally exposes them:

| Global                           | Used by                                            |
| -------------------------------- | -------------------------------------------------- |
| `globalThis.__CLOUDFLARE_ENV__`  | Cloudflare-style bindings                          |
| `globalThis.__IMPORT_META_ENV__` | `import.meta.env` values copied to a global record |
| `globalThis.__APP_CONFIG__`      | Browser application config                         |
| `globalThis.__ENV__`             | Browser application config fallback                |

### Bun

Use `createBunEnv` when your application runs in Bun.

```ts
import { createBunEnv } from "@tmrp/env/bun";
import z from "zod";

const env = createBunEnv({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive(),
});
```

Values are read from `Bun.env`.

### Node.js

Use `createNodeEnv` when your application runs in Node and you want the runtime
expectation to be explicit.

```ts
import { createNodeEnv } from "@tmrp/env/node";
import z from "zod";

const env = createNodeEnv({
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
});
```

Node values are read from `process.env`. If you use a local `.env` file, load it
before creating the environment object:

```ts
import "dotenv/config";

import { createNodeEnv } from "@tmrp/env/node";
import z from "zod";

const env = createNodeEnv({
  TEST_ENV: z.string(),
});
```

### Deno

Use `createDenoEnv` when your application runs in Deno.

```ts
import { createDenoEnv } from "@tmrp/env/deno";
import z from "zod";

const env = createDenoEnv({
  API_TOKEN: z.string().min(1),
});
```

Deno environment access requires the appropriate permission, such as
`--allow-env`:

```sh
deno run --allow-env src/main.ts
```

### Records And Passed Bindings

Use `createRecordEnv` for env-like objects that are passed to your code instead
of exposed globally.

```ts
import { createRecordEnv } from "@tmrp/env/record";
import z from "zod";

const env = createRecordEnv(
  {
    API_URL: z.url(),
    FEATURE_ENABLED: z.coerce.boolean(),
  },
  runtimeEnv
);
```

String values are trimmed before validation. Non-string values are passed
directly to Zod, which is useful for framework-provided booleans or platform
bindings.

### Cloudflare Workers

Cloudflare Workers pass bindings into handlers instead of exposing them on
`globalThis`.

```ts
import { createCloudflareEnv } from "@tmrp/env/cloudflare";
import z from "zod";

export default {
  fetch(request: Request, bindings: Record<string, unknown>) {
    const env = createCloudflareEnv(
      {
        API_URL: z.url(),
        API_TOKEN: z.string().min(1),
      },
      bindings
    );

    return fetch(env.API_URL, {
      headers: { Authorization: `Bearer ${env.API_TOKEN}` },
    });
  },
};
```

### Vercel Edge

Use `createVercelEdgeEnv` with the env object available to your edge code.

```ts
import { createVercelEdgeEnv } from "@tmrp/env/vercel-edge";
import z from "zod";

const env = createVercelEdgeEnv(
  {
    API_URL: z.url(),
  },
  process.env
);
```

### Netlify

Use `createNetlifyEnv` with the env object available to your Netlify function or
edge function.

```ts
import { createNetlifyEnv } from "@tmrp/env/netlify";
import z from "zod";

const env = createNetlifyEnv(
  {
    API_URL: z.url(),
  },
  process.env
);
```

### Browser Config

Use `createBrowserEnv` for explicit browser configuration objects. This avoids
reading secrets from a client bundle by accident; only pass values that are safe
to expose publicly.

```ts
import { createBrowserEnv } from "@tmrp/env/browser";
import z from "zod";

const env = createBrowserEnv(
  {
    PUBLIC_API_URL: z.url(),
  },
  globalThis.__APP_CONFIG__ as Record<string, unknown>
);
```

### `import.meta.env`

Use `createImportMetaEnv` for Vite, Astro, SvelteKit, Nuxt, and other tools that
expose environment values through `import.meta.env`.

```ts
import { createImportMetaEnv } from "@tmrp/env/import-meta";
import z from "zod";

const env = createImportMetaEnv(
  {
    VITE_API_URL: z.url(),
    DEV: z.boolean(),
  },
  import.meta.env
);
```

### Client-exposed Variables (`clientPrefix`)

When building applications that run code on both the server and client-side
(e.g. Next.js, Vite, Nuxt), the bundler statically injects environment variables
that are prefixed with a specific keyword (like `NEXT_PUBLIC_` or `VITE_`).

On the client-side, trying to validate server-only environment variables will
normally throw errors because those variables are not exposed. To prevent this,
you can pass the `clientPrefix` option:

```ts
import { createEnv } from "@tmrp/env";
import z from "zod";

const env = createEnv(
  {
    DATABASE_URL: z.string(), // Server-only
    NEXT_PUBLIC_API_URL: z.url(), // Client-exposed
  },
  {
    clientPrefix: "NEXT_PUBLIC_",
  }
);
```

When running in a client environment (determined automatically by checking if
`"window" in globalThis` is false, or overridden by passing `isServer: false`),
only keys that start with the `clientPrefix` will be read and validated. All
other keys will bypass validation and return `undefined` on the client.

## Defining Schemas

Pass an object whose keys are environment variable names and whose values are
Zod schemas.

```ts
const env = createEnv({
  FEATURE_ENABLED: z.coerce.boolean(),
  MAX_RETRIES: z.coerce.number().int().nonnegative(),
  PUBLIC_URL: z.url(),
  SECRET_KEY: z.string().min(32),
});
```

The returned object is inferred from the schema object:

```ts
env.FEATURE_ENABLED; // boolean
env.MAX_RETRIES; // number
env.PUBLIC_URL; // string
env.SECRET_KEY; // string
```

Runtime global values are usually strings. Use Zod coercion or transforms when
you need booleans, numbers, dates, JSON parsing, or custom formats. Explicit
record-based entry points can also pass non-string values directly to Zod.

## Required Values

All configured variables must exist in the runtime environment. Missing
variables fail before Zod validation runs, so Zod `.optional()` and `.default()`
schemas do not currently make an absent variable valid.

```ts
const env = createEnv({
  REQUIRED_TOKEN: z.string().min(1),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
});
```

If you need defaults, define them in the runtime environment before calling
`createEnv`:

```ts
process.env.LOG_LEVEL ??= "info";

const env = createEnv({
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
});
```

## Skipping Validation

Use `skipValidation` when code needs to import or initialize an env module in a
context where runtime environment variables are not available, such as CI,
documentation builds, static analysis, or framework build steps.

```ts
import { createEnv } from "@tmrp/env";
import z from "zod";

export const env = createEnv(
  {
    API_URL: z.url(),
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().int().positive(),
  },
  { skipValidation: process.env.CI === "true" }
);
```

When `skipValidation` is enabled, missing variables are returned as `undefined`
instead of throwing, and existing values are returned raw. Zod parsing,
validation, coercion, transforms, and defaults are not applied.

```ts
const env = createEnv(
  {
    PORT: z.coerce.number(),
    SECRET_KEY: z.string().min(32),
  },
  { skipValidation: true }
);

env.PORT; // raw string value, or undefined when unavailable
env.SECRET_KEY; // raw string value, or undefined when unavailable
```

This option is intended for non-runtime code paths. Do not use it for
application startup if the returned values will be used as validated
configuration.

## Error Behavior

All creators run synchronously and throw on failure.

Missing variable error:

```txt
Environment variable "DATABASE_URL" is not defined
```

Validation error:

```txt
Environment variable "PORT" failed validation: ...
```

This behavior is intentional: configuration errors should fail application
startup immediately. When `skipValidation` is enabled, missing and invalid
values do not throw.

## Example `.env`

```dotenv
TEST_ENV="this-is-a-test-value"
DATABASE_URL="https://example.com/database"
PORT="3000"
NODE_ENV="development"
```

An example file is included at `.env.example`.

## API Reference

### `createEnv(envKeys, options?)`

Reads variables from the detected Bun, Node, or Deno runtime and validates them.

```ts
type Options = {
  clientPrefix?: string;
  isServer?: boolean;
  skipValidation?: boolean;
};

function createEnv<const TEnvKeys extends Record<string, ZodType>>(
  envKeys: TEnvKeys,
  options?: Options
): { [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]> };
```

Use this from `@tmrp/env`.

### `createBunEnv(envKeys, options?)`

Reads variables from Bun `Bun.env` and validates them.

```ts
function createBunEnv<const TEnvKeys extends Record<string, ZodType>>(
  envKeys: TEnvKeys,
  options?: Options
): { [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]> };
```

Use this from `@tmrp/env/bun`.

### `createNodeEnv(envKeys, options?)`

Reads variables from Node.js `process.env` and validates them.

```ts
function createNodeEnv<const TEnvKeys extends Record<string, ZodType>>(
  envKeys: TEnvKeys,
  options?: Options
): { [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]> };
```

Use this from `@tmrp/env/node`.

### `createDenoEnv(envKeys, options?)`

Reads variables from Deno `Deno.env.get` and validates them.

```ts
function createDenoEnv<const TEnvKeys extends Record<string, ZodType>>(
  envKeys: TEnvKeys,
  options?: Options
): { [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]> };
```

Use this from `@tmrp/env/deno`.

### `createRecordEnv(envKeys, record, options?)`

Reads variables from an explicit object and validates them.

```ts
function createRecordEnv<const TEnvKeys extends Record<string, ZodType>>(
  envKeys: TEnvKeys,
  record: Record<string, unknown>,
  options?: Options
): { [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]> };
```

Use this from `@tmrp/env/record`.

### Platform Record Creators

These entry points all use the same explicit-record validation model, but expose
runtime-specific names for clearer application code:

| Entry point             | Function                                                |
| ----------------------- | ------------------------------------------------------- |
| `@tmrp/env/cloudflare`  | `createCloudflareEnv(envKeys, bindings, options?)`      |
| `@tmrp/env/vercel-edge` | `createVercelEdgeEnv(envKeys, env, options?)`           |
| `@tmrp/env/netlify`     | `createNetlifyEnv(envKeys, env, options?)`              |
| `@tmrp/env/browser`     | `createBrowserEnv(envKeys, env, options?)`              |
| `@tmrp/env/import-meta` | `createImportMetaEnv(envKeys, importMetaEnv, options?)` |

All creators accept the same `Options` object. Set `skipValidation: true` to
return raw values and `undefined` for unavailable variables instead of throwing.

## Development

This repository uses pnpm and TypeScript.

### Requirements

- Node.js 24.x
- pnpm

The repository includes `.nvmrc` and `.npmrc` files for local Node version
alignment.

### Install Dependencies

```sh
pnpm install
```

### Typecheck

```sh
pnpm typecheck
```

### Lint

```sh
pnpm lint
```

### Test

```sh
pnpm test
pnpm test:coverage
```

Coverage thresholds are 100% for statements, branches, functions, and lines.

### Build

```sh
pnpm build
```

### Releasing

This package uses [Changesets](https://github.com/changesets/changesets).
Versioning and npm publishing are automated — include a changeset with your PR
(`pnpm changeset`) and the release flow handles the rest. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## Project Structure

```txt
src/
  create-env.ts                         Default runtime-aware environment creator
  index.ts                              Default public export
  effects/                              Internal Effect-based read and parse pipeline
  lib/                                  Shared schemas and types
  runtime/
    browser/                            Browser config entry point
    bun/                                Bun-specific entry point and reader
    cloudflare/                         Cloudflare bindings entry point
    deno/                               Deno-specific entry point and reader
    import-meta/                        import.meta.env entry point
    netlify/                            Netlify env object entry point
    node/                               Node-specific entry point and reader
    record/                             Generic record/object entry point
    vercel/                             Vercel Edge env object entry point
```

## Notes And Limitations

- Values from strings are trimmed before validation.
- Reads are synchronous.
- The package validates configuration at creation time, not lazily.
- Runtime global values are usually strings; explicit records can also pass
  non-string values to Zod.
- Missing environment variables currently fail before Zod defaults can be
  applied.
- Browser and build-tool entry points validate values you explicitly pass to
  them. The default reader can also use the documented global records when your
  application intentionally exposes them.

## License

MIT
