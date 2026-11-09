import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/**/{page,layout,not-found,loading,robots,sitemap}.tsx",
        "src/app/**/*.ts",
        "src/**/index.ts",
        "src/shared/ui/fonts.ts",
        "src/**/*.test.{ts,tsx}",
      ],
      reporter: ["text-summary", "html", "lcov"],
      // Umbral mínimo: el CI falla si la cobertura baja de aquí.
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
