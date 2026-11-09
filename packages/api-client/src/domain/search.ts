import type { ArtworkSummary } from "./artwork";

export type SortOrder = "relevance" | "oldest" | "newest";

export type DateRange = { from: number; to: number };

export type SearchQuery = {
  q?: string;
  artworkType?: string;
  artist?: string;
  dateRange?: DateRange;
  sort?: SortOrder;
  page: number;
  pageSize: number;
};

export type SearchResult = {
  items: ArtworkSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
