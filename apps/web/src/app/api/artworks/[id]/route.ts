import { z } from "zod";
import { badRequest, errorToResponse, getArtwork, jsonResponse } from "@/shared/api";

const idSchema = z.coerce.number().int().positive();

/** GET /api/artworks/:id → una obra normalizada, o 404. */
export async function GET(_request: Request, context: RouteContext<"/api/artworks/[id]">) {
  const id = idSchema.safeParse((await context.params).id);
  if (!id.success) return badRequest("invalid_id");

  try {
    const artwork = await getArtwork(id.data);
    return artwork ? jsonResponse(artwork) : Response.json({ error: "not_found" }, { status: 404 });
  } catch (error) {
    return errorToResponse(error);
  }
}
