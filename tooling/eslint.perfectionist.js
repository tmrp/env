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
          customGroups: [
            {
              elementNamePattern: "^next$",
              groupName: "next",
              modifiers: ["value"],
              selector: "external",
            },
            {
              elementNamePattern: "^react$",
              groupName: "react",
              modifiers: ["value"],
              selector: "external",
            },
            {
              elementNamePattern: "^react-.+",
              groupName: "react-",
              modifiers: ["value"],
              selector: "external",
            },
            {
              elementNamePattern: "^@workspace/.+",
              groupName: "workspace",
              modifiers: ["value"],
              selector: "external",
            },
          ],
          environment: "node",
          // groups: [
          //   "next",
          //   "react",
          //   "react-",
          //   "workspace",
          //   "type",
          //   ["builtin", "external"],
          //   "type-internal",
          //   "internal",
          //   ["type-parent", "type-sibling", "type-index"],
          //   ["parent", "sibling", "index"],
          //   "unknown",
          // ],
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
