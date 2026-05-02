export const runtimeGlobalKeys = [
  "Bun",
  "Deno",
  "EdgeRuntime",
  "__APP_CONFIG__",
  "__CLOUDFLARE_ENV__",
  "__ENV__",
  "__IMPORT_META_ENV__",
  "process",
] as const;

const originalDescriptors = new Map<string, PropertyDescriptor | undefined>();

export function saveRuntimeGlobals() {
  for (const key of runtimeGlobalKeys) {
    originalDescriptors.set(
      key,
      Object.getOwnPropertyDescriptor(globalThis, key)
    );
  }
}

export function clearRuntimeGlobals() {
  for (const key of runtimeGlobalKeys) {
    Reflect.deleteProperty(globalThis, key);
  }
}

export function restoreRuntimeGlobals() {
  for (const key of runtimeGlobalKeys) {
    const descriptor = originalDescriptors.get(key);

    Reflect.deleteProperty(globalThis, key);

    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    }
  }
}

export function setRuntimeGlobal(
  key: (typeof runtimeGlobalKeys)[number],
  value: unknown
) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value,
    writable: true,
  });
}

export function useRuntimeGlobals(
  globals: Partial<Record<(typeof runtimeGlobalKeys)[number], unknown>>
) {
  clearRuntimeGlobals();

  for (const [key, value] of Object.entries(globals)) {
    setRuntimeGlobal(key as (typeof runtimeGlobalKeys)[number], value);
  }
}
