import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

export const eslintPerfectionistConfig = defineConfig([
  {
    plugins: {
      perfectionist,
      "unused-imports": unusedImports,
    },
    rules: {
      ...perfectionist.configs["recommended-natural"].rules,

      "perfectionist/sort-objects": ["off"],
      "perfectionist/sort-named-exports": ["off"],
      "perfectionist/sort-modules": ["off"],
      "perfectionist/sort-imports": [
        "error",
        {
          environment: "node",
          groups: [
            "external",
            "type",
            "builtin",
            "type-internal",
            "internal",
            ["type-parent", "type-sibling", "type-index"],
            ["parent", "sibling", "index"],
            "unknown",
          ],
          ignoreCase: true,
          newlinesBetween: 1,
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "warn",
    },
  },
]);
