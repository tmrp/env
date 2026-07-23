import { z, type ZodType } from "zod";

/**
 * Serializable description of a Zod schema. The playground keeps schemas in
 * this form so they can be edited in the UI, stringified into the generated
 * code sample, and posted to the server function (real Zod schemas are not
 * serializable).
 */
export type SchemaSpec =
  | { kind: "boolean" }
  | { kind: "enum"; values: string }
  | { kind: "number"; int: boolean; positive: boolean }
  | { kind: "string"; min: string }
  | { kind: "url" };

export type EnvKeyRow = {
  id: string;
  key: string;
  spec: SchemaSpec;
};

export type IsServerMode = "auto" | "client" | "server";

export type PlaygroundOptions = {
  clientPrefix: string;
  isServer: IsServerMode;
  skipValidation: boolean;
};

/** Mirrors the `Options` type from @tmrp/env (not exported publicly). */
export type Options = {
  clientPrefix?: string;
  isServer?: boolean;
  skipValidation?: boolean;
};

export const defaultSpecForKind = (kind: SchemaSpec["kind"]): SchemaSpec => {
  switch (kind) {
    case "boolean":
      return { kind: "boolean" };
    case "enum":
      return { kind: "enum", values: "" };
    case "number":
      return { kind: "number", int: false, positive: false };
    case "string":
      return { kind: "string", min: "" };
    case "url":
      return { kind: "url" };
  }
};

export const parseEnumValues = (values: string): Array<string> =>
  values
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

export const parseMin = (min: string): number | undefined => {
  const trimmed = min.trim();
  if (trimmed === "") {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
};

export const buildZodSchema = (spec: SchemaSpec): ZodType => {
  switch (spec.kind) {
    case "boolean":
      return z.coerce.boolean();
    case "enum": {
      const values = parseEnumValues(spec.values);
      return values.length > 0
        ? z.enum(values as [string, ...Array<string>])
        : z.never();
    }
    case "number": {
      const base = z.coerce.number();
      const withInt = spec.int ? base.int() : base;
      return spec.positive ? withInt.positive() : withInt;
    }
    case "string": {
      const base = z.string();
      const min = parseMin(spec.min);
      return min === undefined ? base : base.min(min);
    }
    case "url":
      return z.url();
  }
};

export const buildEnvKeys = (
  rows: Array<EnvKeyRow>
): Record<string, ZodType> => {
  const envKeys: Record<string, ZodType> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (key === "") {
      continue;
    }
    envKeys[key] = buildZodSchema(row.spec);
  }
  return envKeys;
};

export const buildOptions = (
  options: PlaygroundOptions
): Options | undefined => {
  const built: Options = {};
  if (options.skipValidation) {
    built.skipValidation = true;
  }
  if (options.clientPrefix.trim() !== "") {
    built.clientPrefix = options.clientPrefix.trim();
  }
  if (options.isServer !== "auto") {
    built.isServer = options.isServer === "server";
  }
  return Object.keys(built).length > 0 ? built : undefined;
};
