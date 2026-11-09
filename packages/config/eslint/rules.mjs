/**
 * Reglas de mantenibilidad compartidas.
 * Objetivo: archivos pequeños con una sola responsabilidad.
 * Si una regla salta, la respuesta es extraer un componente, hook o función,
 * no desactivar la regla.
 */
export const maintainabilityRules = {
  "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["error", { max: 60, skipBlankLines: true, skipComments: true }],
  complexity: ["error", 10],
  "max-depth": ["error", 3],
  "max-params": ["error", 3],
};

/** Los tests pueden ser más largos: describen muchos casos de un mismo módulo. */
export const testFileOverrides = {
  files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
  rules: {
    "max-lines": "off",
    "max-lines-per-function": "off",
  },
};

/** Convenciones de TypeScript compartidas. */
export const typescriptRules = {
  "@typescript-eslint/consistent-type-imports": "error",
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
  ],
};
