import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra la app compilada y la API simulada del museo (deterministas y sin red).
 * Con PLAYWRIGHT_BASE_URL se prueba otro despliegue (p. ej. la vista previa de Vercel)
 * y no se arranca ningún servidor local.
 */
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const port = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: externalBaseUrl ?? `http://localhost:${port}`,
    trace: "on-first-retry",
    locale: "es-ES",
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "node scripts/start-with-mock.mjs",
        url: `http://localhost:${port}`,
        env: { PORT: String(port) },
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
