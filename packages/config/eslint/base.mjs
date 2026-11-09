import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";
import { maintainabilityRules, testFileOverrides } from "./rules.mjs";

/** Config para paquetes TypeScript sin Next.js (ui, api-client). */
export default defineConfig([
  globalIgnores(["dist/**", "coverage/**", ".turbo/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      ...maintainabilityRules,
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["scripts/**/*.{js,mjs}", "*.config.{js,mjs,mts}"],
    languageOptions: { globals: globals.node },
  },
  testFileOverrides,
  prettier,
]);
