// API pública de @galeria/api-client. Lo que no se exporta aquí es interno.
export type * from "./domain";
export { createAicClient, DEFAULT_BASE_URL } from "./client/createAicClient";
export type { AicClient, AicClientOptions } from "./client/createAicClient";
export { AicApiError, AicContractError, AicRateLimitError } from "./errors";
export { buildImageSrcSet, buildImageUrl, IIIF_WIDTHS } from "./images/buildImageUrl";
export { MAX_RESULT_WINDOW } from "./search/buildSearchRequest";
