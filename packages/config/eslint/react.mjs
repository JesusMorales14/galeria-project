import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import base from "./base.mjs";

/** Para librerías de componentes React sin Next.js (packages/ui). */
export default defineConfig([
  ...base,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat["recommended-latest"] ?? reactHooks.configs["recommended-latest"],
  { ignores: ["storybook-static/**"] },
]);
