import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import { maintainabilityRules, testFileOverrides } from "./rules.mjs";
import { layerBoundaryRules } from "./boundaries.mjs";

/**
 * Config para apps Next.js.
 * eslint-config-next ya registra el plugin jsx-a11y; aquí solo se activan
 * las reglas de su preset "recommended" (registrarlo otra vez da error).
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: jsxA11y.flatConfigs.recommended.rules },
  {
    rules: {
      ...maintainabilityRules,
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  ...layerBoundaryRules,
  testFileOverrides,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);
