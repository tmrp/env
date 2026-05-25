import type { z, ZodType } from "zod";

export type Env<TEnvKeys extends EnvKeys> = {
  [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]>;
};

export type EnvKeys = Record<string, ZodType>;

export type EnvRecord = object;

export type Options = {
  clientPrefix?: string;
  isServer?: boolean;
  skipValidation?: boolean;
};
