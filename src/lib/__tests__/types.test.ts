import { describe, expectTypeOf, it } from "vitest";
import z from "zod";

import type { Options } from "../types.js";

import { createEnv } from "../../create-env.js";
import { createRecordEnv } from "../../runtime/record/create-record-env.js";

describe("creator return types", () => {
  const schemas = {
    PORT: z.coerce.number(),
    PUBLIC_URL: z.url(),
    SECRET: z.string(),
  };

  it("returns parsed schema outputs when validation is guaranteed", () => {
    const create = () => createRecordEnv(schemas, {});
    const createOnServer = () =>
      createEnv(schemas, {
        clientPrefix: "PUBLIC_",
        isServer: true,
      });

    expectTypeOf(create).returns.toEqualTypeOf<{
      PORT: number;
      PUBLIC_URL: string;
      SECRET: string;
    }>();
    expectTypeOf(createOnServer).returns.toEqualTypeOf<{
      PORT: number;
      PUBLIC_URL: string;
      SECRET: string;
    }>();
  });

  it("returns unknown values when validation can be skipped", () => {
    const createSkipped = () =>
      createRecordEnv(schemas, {}, { skipValidation: true });
    const options: Options = {};
    const createWithDynamicOptions = () => createEnv(schemas, options);

    expectTypeOf(createSkipped).returns.toEqualTypeOf<{
      PORT: unknown;
      PUBLIC_URL: unknown;
      SECRET: unknown;
    }>();
    expectTypeOf(createWithDynamicOptions).returns.toEqualTypeOf<{
      PORT: unknown;
      PUBLIC_URL: unknown;
      SECRET: unknown;
    }>();
  });

  it("includes undefined for values filtered on the client", () => {
    const create = () =>
      createEnv(schemas, {
        clientPrefix: "PUBLIC_",
        isServer: false,
      });

    expectTypeOf(create).returns.toEqualTypeOf<{
      PORT: number | undefined;
      PUBLIC_URL: string;
      SECRET: string | undefined;
    }>();
  });

  it("includes undefined for every possible client prefix", () => {
    const clientPrefix = "PUBLIC_" as "OTHER_" | "PUBLIC_";
    const create = () =>
      createEnv(schemas, {
        clientPrefix,
        isServer: false,
      });
    const readPublicUrl = () => create().PUBLIC_URL;

    expectTypeOf(readPublicUrl).returns.toEqualTypeOf<string | undefined>();
  });

  it("models client filtering when validation is skipped", () => {
    const create = () =>
      createEnv(schemas, {
        clientPrefix: "PUBLIC_",
        isServer: false,
        skipValidation: true,
      });

    expectTypeOf(create).returns.toEqualTypeOf<{
      PORT: undefined;
      PUBLIC_URL: unknown;
      SECRET: undefined;
    }>();
  });

  it("allows server values when skipped validation uses inferred runtime", () => {
    const create = () =>
      createEnv(schemas, {
        clientPrefix: "PUBLIC_",
        skipValidation: true,
      });

    expectTypeOf(create).returns.toEqualTypeOf<{
      PORT: unknown;
      PUBLIC_URL: unknown;
      SECRET: unknown;
    }>();
  });
});
