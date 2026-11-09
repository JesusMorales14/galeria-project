import { connection } from "next/server";

/**
 * Error provocado para comprobar la observabilidad (incidente 001).
 * Solo existe si ENABLE_DEBUG_ROUTES=1 (actívalo en las vistas previas de Vercel, nunca en producción).
 */
export async function GET() {
  await connection();
  if (process.env.ENABLE_DEBUG_ROUTES !== "1")
    return Response.json({ error: "not_found" }, { status: 404 });
  throw new Error("Error simulado para comprobar Sentry (incidente 001)");
}
