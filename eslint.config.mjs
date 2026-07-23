import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import { eslintPerfectionistConfig } from "./tooling/eslint.perfectionist.js";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "out/**",
      "build/**",
      "/coverage/**",
      "playground/**",
    ],
  },
  ...eslintPerfectionistConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
]);
