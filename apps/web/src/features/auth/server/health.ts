import "server-only";
import { authService } from "./container";

export type HealthReport = { status: "ok" | "degraded"; storage: "ok" | "unavailable" };

/**
 * Estado de salud para el healthcheck del despliegue. Hace una consulta real al almacén de
 * cuentas: si la base de datos no responde, el nuevo despliegue no recibe tráfico.
 */
export async function checkHealth(): Promise<HealthReport> {
  try {
    await (await authService()).getUser("__healthcheck__");
    return { status: "ok", storage: "ok" };
  } catch (error) {
    console.error("[health] el almacén de cuentas no responde", error);
    return { status: "degraded", storage: "unavailable" };
  }
}
