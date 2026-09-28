import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import z from "zod";

import { createEnv, EnvValidationError } from "../index.js";
import { createBrowserEnv } from "../runtime/browser/create-browser-env.js";
import { createBunEnv } from "../runtime/bun/create-bun-env.js";
import { createCloudflareEnv } from "../runtime/cloudflare/create-cloudflare-env.js";
import { createDenoEnv } from "../runtime/deno/create-deno-env.js";
import { createImportMetaEnv } from "../runtime/import-meta/create-import-meta-env.js";
import { createNetlifyEnv } from "../runtime/netlify/create-netlify-env.js";
import { createNodeEnv } from "../runtime/node/create-node-env.js";
import { createRecordEnv } from "../runtime/record/create-record-env.js";
import { createVercelEdgeEnv } from "../runtime/vercel/create-vercel-edge-env.js";
import {
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "./runtime-globals.js";

beforeAll(saveRuntimeGlobals);
afterEach(restoreRuntimeGlobals);

const schemas = {
  DATABASE_URL: z.url({ error: "Expected a URL" }),
  PORT: z.coerce.number().positive({ error: "Expected a positive number" }),
};
const values = { DATABASE_URL: "invalid", PORT: "-1" };
const expectedIssues = [
  {
    key: "DATABASE_URL",
    code: "invalid_format",
    path: [],
    message: "Expected a URL",
  },
  {
    key: "PORT",
    code: "too_small",
    path: [],
    message: "Expected a positive number",
  },
];

function validationError(run: () => unknown): EnvValidationError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(EnvValidationError);

    if (error instanceof EnvValidationError) {
      return error;
    }
  }

  throw new Error("Expected an EnvValidationError");
}

describe('errorMode: "all"', () => {
  it.each(
    [
      createBrowserEnv,
      createCloudflareEnv,
      createImportMetaEnv,
      createNetlifyEnv,
      createRecordEnv,
      createVercelEdgeEnv,
    ].map((create) => ({ create, name: create.name }))
  )("collects validation issues through $name", ({ create }) => {
    const error = validationError(() =>
      create(schemas, values, { errorMode: "all" })
    );

    expect(error.issues).toEqual(expectedIssues);
    expect(error.name).toBe("EnvValidationError");
    expect(error.message).toBe(
      "Invalid environment configuration:\n" +
        "  DATABASE_URL — Expected a URL\n" +
        "  PORT — Expected a positive number"
    );
  });

  it.each(
    [createEnv, createNodeEnv, createBunEnv, createDenoEnv].map((create) => ({
      create,
      name: create.name,
    }))
  )("collects validation issues through $name", ({ create }) => {
    useRuntimeGlobals({
      Bun: { env: values },
      Deno: {
        env: { get: (key: string) => Reflect.get(values, key) },
      },
      process: { env: values },
    });

    const error = validationError(() => create(schemas, { errorMode: "all" }));

    expect(error.issues).toEqual(expectedIssues);
  });

  it("collects every issue per variable, with nested paths and custom messages", () => {
    const error = validationError(() =>
      createRecordEnv(
        {
          MISSING: z.string({ error: "Required" }),
          SETTINGS: z.object({
            ports: z.array(z.number({ error: "Expected a number" })),
            name: z.string().min(3, { error: "Too short" }).regex(/^a/, {
              error: "Must start with a",
            }),
          }),
          OPTIONAL: z.string().optional(),
          DEFAULT: z.string().default("fallback"),
        },
        { SETTINGS: { ports: ["invalid"], name: "b" } },
        { errorMode: "all" }
      )
    );

    expect(error.issues).toEqual([
      { key: "MISSING", code: "invalid_type", path: [], message: "Required" },
      {
        key: "SETTINGS",
        code: "invalid_type",
        path: ["ports", 0],
        message: "Expected a number",
      },
      {
        key: "SETTINGS",
        code: "too_small",
        path: ["name"],
        message: "Too short",
      },
      {
        key: "SETTINGS",
        code: "invalid_format",
        path: ["name"],
        message: "Must start with a",
      },
    ]);
    expect(error.message).toContain("SETTINGS.ports.0 — Expected a number");
  });

  it("returns parsed values, defaults, optional values, and nulls on success", () => {
    expect(
      createRecordEnv(
        {
          PORT: z.coerce.number().positive(),
          NAME: z.string().transform((value) => value.toUpperCase()),
          DEFAULT: z.string().default("fallback"),
          OPTIONAL: z.string().optional(),
          NULLABLE: z.string().nullable(),
        },
        { PORT: "3000", NAME: "service", NULLABLE: null },
        { errorMode: "all" }
      )
    ).toEqual({
      PORT: 3000,
      NAME: "SERVICE",
      DEFAULT: "fallback",
      OPTIONAL: undefined,
      NULLABLE: null,
    });
    expect(createRecordEnv({}, {}, { errorMode: "all" })).toEqual({});
  });

  it("does not attach raw input, issue metadata, or the original Zod error", () => {
    const secret = "secret-token-value";
    const error = validationError(() =>
      createRecordEnv(
        {
          TOKEN: z.string().superRefine((input, ctx) => {
            ctx.addIssue({
              code: "custom",
              input,
              params: { token: input },
              message: "Invalid token",
            });
          }),
        },
        { TOKEN: secret },
        { errorMode: "all" }
      )
    );

    expect(error.issues).toEqual([
      { key: "TOKEN", code: "custom", path: [], message: "Invalid token" },
    ]);
    expect(error.cause).toBeUndefined();
    expect(error.message).not.toContain(secret);
    expect(JSON.stringify(error)).not.toContain(secret);
  });

  it("does not read or validate filtered server variables", () => {
    const readSecret = vi.fn(() => "secret");
    const record = Object.defineProperty({}, "SECRET", { get: readSecret });
    const error = validationError(() =>
      createRecordEnv(
        {
          SECRET: z.never(),
          PUBLIC_URL: z.url(),
          PUBLIC_NAME: z.string(),
        },
        record,
        { clientPrefix: "PUBLIC_", errorMode: "all", isServer: false }
      )
    );

    expect(error.issues.map((issue) => issue.key)).toEqual([
      "PUBLIC_URL",
      "PUBLIC_NAME",
    ]);
    expect(readSecret).not.toHaveBeenCalled();
    expect(
      createRecordEnv(
        { SECRET: z.never(), PUBLIC_NAME: z.string().default("public") },
        record,
        { clientPrefix: "PUBLIC_", errorMode: "all", isServer: false }
      )
    ).toEqual({ SECRET: undefined, PUBLIC_NAME: "public" });
    expect(readSecret).not.toHaveBeenCalled();
  });

  it("bypasses parsing, aggregation, and defaults when validation is skipped", () => {
    const parse = vi.fn(() => "parsed");

    expect(
      createRecordEnv(
        {
          PORT: z.coerce.number(),
          DEFAULT: z.string().default("fallback"),
          NAME: z.string().transform(parse),
        },
        { PORT: "invalid", NAME: "raw" },
        { errorMode: "all", skipValidation: true }
      )
    ).toEqual({ PORT: "invalid", DEFAULT: undefined, NAME: "raw" });
    expect(parse).not.toHaveBeenCalled();
  });

  it("stops on read failures, even after collecting validation issues", () => {
    const readLater = vi.fn();
    const record = Object.defineProperties(
      {},
      {
        DENIED: {
          get() {
            throw new Error("Permission denied");
          },
        },
        LATER: { get: readLater },
      }
    );

    expect(() =>
      createRecordEnv(
        { MISSING: z.string(), DENIED: z.string(), LATER: z.string() },
        record,
        { errorMode: "all" }
      )
    ).toThrow(
      'Environment variable "DENIED" failed to read: Error: Permission denied'
    );
    expect(readLater).not.toHaveBeenCalled();
  });

  it.each([
    {
      name: "Error",
      throwError: () => {
        throw new Error("Broken transform");
      },
    },
    { name: "ZodError", throwError: () => z.number().parse("invalid") },
  ])(
    "stops on $name exceptions thrown by schema callbacks",
    ({ throwError }) => {
      const parseLater = vi.fn();

      expect(() =>
        createRecordEnv(
          {
            MISSING: z.string(),
            BROKEN: z.string().transform(throwError),
            LATER: z.string().transform(parseLater),
          },
          { BROKEN: "value", LATER: "value" },
          { errorMode: "all" }
        )
      ).toThrow('Environment variable "BROKEN" failed validation:');
      expect(parseLater).not.toHaveBeenCalled();
    }
  );
});

describe("first-error behavior", () => {
  it.each([undefined, "first"] as const)(
    "preserves existing errors and stops reading with errorMode %s",
    (errorMode) => {
      const readLater = vi.fn();
      const record = Object.defineProperty({}, "LATER", { get: readLater });

      expect(() =>
        createRecordEnv({ MISSING: z.string(), LATER: z.string() }, record, {
          errorMode,
        })
      ).toThrow('Environment variable "MISSING" is not defined');
      expect(readLater).not.toHaveBeenCalled();
    }
  );
});
