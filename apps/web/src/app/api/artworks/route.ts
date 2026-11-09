import {
  badRequest,
  errorToResponse,
  getArtworksByIds,
  jsonResponse,
  parseIdsQuery,
} from "@/shared/api";

/** GET /api/artworks?ids=1,2,3 → obras normalizadas, en el orden pedido. */
export async function GET(request: Request) {
  const query = parseIdsQuery(new URL(request.url).searchParams);
  if (!query.success) return badRequest("invalid_ids");

  try {
    return jsonResponse({ items: await getArtworksByIds(query.ids) });
  } catch (error) {
    return errorToResponse(error);
  }
}
