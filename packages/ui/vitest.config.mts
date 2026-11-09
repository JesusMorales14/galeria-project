import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/stories/**",
        "src/**/index.ts",
        "src/**/*.test.{ts,tsx}",
      ],
      reporter: ["text-summary", "html", "lcov"],
      // Umbral mínimo: el CI falla si la cobertura baja de aquí.
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
  },
});
