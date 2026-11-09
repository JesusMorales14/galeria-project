import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/index.ts", "src/**/*.test.ts", "src/domain/**"],
      reporter: ["text-summary", "html", "lcov"],
      // Umbral mínimo: el CI falla si la cobertura baja de aquí.
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
