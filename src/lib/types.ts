import type { z, ZodType } from "zod";

export type Env<TEnvKeys extends EnvKeys> = {
  [K in keyof TEnvKeys]: z.infer<TEnvKeys[K]>;
};

type ClientEnvForPrefix<
  TEnvKeys extends EnvKeys,
  TClientPrefix extends string,
> = {
  [K in keyof TEnvKeys]: string extends TClientPrefix
    ? undefined | z.infer<TEnvKeys[K]>
    : K extends `${TClientPrefix}${string}`
      ? z.infer<TEnvKeys[K]>
      : undefined | z.infer<TEnvKeys[K]>;
};

type ClientEnv<
  TEnvKeys extends EnvKeys,
  TClientPrefix extends string,
> = TClientPrefix extends string
  ? ClientEnvForPrefix<TEnvKeys, TClientPrefix>
  : never;

export type EnvKeys = Record<string, ZodType>;

export type EnvRecord = object;

export type Options = {
  clientPrefix?: string;
  isServer?: boolean;
  skipValidation?: boolean;
};

type OptionValue<
  TOptions extends Options | undefined,
  TKey extends keyof Options,
> = TOptions extends undefined
  ? undefined
  : TKey extends keyof TOptions
    ? TOptions[TKey]
    : undefined;

type UnvalidatedEnv<TEnvKeys extends EnvKeys> = {
  [K in keyof TEnvKeys]: unknown;
};

type UnvalidatedClientEnvForPrefix<
  TEnvKeys extends EnvKeys,
  TClientPrefix extends string,
> = {
  [K in keyof TEnvKeys]: string extends TClientPrefix
    ? unknown
    : K extends `${TClientPrefix}${string}`
      ? unknown
      : undefined;
};

type UnvalidatedClientEnv<
  TEnvKeys extends EnvKeys,
  TClientPrefix extends string,
> = TClientPrefix extends string
  ? UnvalidatedClientEnvForPrefix<TEnvKeys, TClientPrefix>
  : never;

type EnvForOneOptions<
  TEnvKeys extends EnvKeys,
  TOptions extends Options | undefined,
> =
  true extends OptionValue<TOptions, "skipValidation">
    ? OptionValue<TOptions, "isServer"> extends false
      ? Extract<
          OptionValue<TOptions, "clientPrefix">,
          string
        > extends infer TPrefix extends string
        ? [TPrefix] extends [never]
          ? UnvalidatedEnv<TEnvKeys>
          : UnvalidatedClientEnv<TEnvKeys, TPrefix>
        : never
      : UnvalidatedEnv<TEnvKeys>
    : OptionValue<TOptions, "isServer"> extends true
      ? Env<TEnvKeys>
      : Extract<
            OptionValue<TOptions, "clientPrefix">,
            string
          > extends infer TPrefix extends string
        ? [TPrefix] extends [never]
          ? Env<TEnvKeys>
          : ClientEnv<TEnvKeys, TPrefix>
        : never;

export type EnvForOptions<
  TEnvKeys extends EnvKeys,
  TOptions extends Options | undefined,
> = TOptions extends Options | undefined
  ? EnvForOneOptions<TEnvKeys, TOptions>
  : never;
