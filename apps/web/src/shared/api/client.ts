import "server-only";
import { createAicClient } from "@galeria/api-client";
import { readServerEnv } from "./env";

const env = readServerEnv();

/** Único cliente de la API del museo. Solo existe en el servidor. */
export const aicClient = createAicClient({
  baseUrl: env.AIC_API_BASE_URL,
  userAgent: env.AIC_USER_AGENT,
});
