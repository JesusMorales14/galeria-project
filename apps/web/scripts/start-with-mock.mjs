// Arranca la API simulada del museo y la app compilada (next start) apuntando a ella.
// Lo usan Lighthouse CI y Playwright para medir y probar sin depender de la red.
import { spawn } from "node:child_process";

const MOCK_PORT = process.env.MOCK_AIC_PORT ?? "4010";
const env = {
  ...process.env,
  AIC_API_BASE_URL: `http://localhost:${MOCK_PORT}/api/v1`,
  AIC_IIIF_BASE_URL: `http://localhost:${MOCK_PORT}/iiif/2`,
  MOCK_AIC_PORT: MOCK_PORT,
};

// En Windows, pnpm es un script (pnpm.cmd): hay que lanzarlo a través de la shell.
const shell = process.platform === "win32";

const children = [
  spawn(process.execPath, ["e2e/mock-aic/server.mjs"], { env, stdio: "inherit" }),
  spawn("pnpm", ["exec", "next", "start", "-p", process.env.PORT ?? "3000"], {
    env,
    stdio: "inherit",
    shell,
  }),
];

const stop = () => children.forEach((child) => child.kill());
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
children.forEach((child) => child.on("exit", (code) => code && process.exit(code)));
