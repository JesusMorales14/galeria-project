import { connection } from "next/server";
import { checkHealth } from "@/features/auth";

/** GET /api/health → 200 si la app y su base de datos responden; 503 si no. Lo usa Railway. */
export async function GET() {
  await connection(); // siempre en tiempo de petición: nunca se cachea un estado de salud
  const report = await checkHealth();
  return Response.json(report, {
    status: report.status === "ok" ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
