// Arranca la API simulada del museo y la app en modo desarrollo (next dev) apuntando a ella.
// Sirve para desarrollar sin red y con datos deterministas.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// Se puede lanzar desde cualquier carpeta: los procesos hijos corren en apps/web.
const cwd = fileURLToPath(new URL("..", import.meta.url));

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
  spawn(process.execPath, ["e2e/mock-aic/server.mjs"], { cwd, env, stdio: "inherit" }),
  spawn("pnpm", ["exec", "next", "dev", "-p", process.env.PORT ?? "3000"], {
    cwd,
    env,
    stdio: "inherit",
    shell,
  }),
];

const stop = () => children.forEach((child) => child.kill());
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
children.forEach((child) => child.on("exit", (code) => code && process.exit(code)));
