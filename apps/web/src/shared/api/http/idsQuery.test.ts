import { describe, expect, it } from "vitest";
import { MAX_IDS, parseIdsQuery } from "./idsQuery";

describe("parseIdsQuery", () => {
  it("acepta una lista de ids separada por comas y quita duplicados", () => {
    expect(parseIdsQuery(new URLSearchParams("ids=3,1,3"))).toEqual({ success: true, ids: [3, 1] });
  });

  it("rechaza ids no numéricos", () => {
    expect(parseIdsQuery(new URLSearchParams("ids=1,abc")).success).toBe(false);
  });

  it("rechaza listas vacías o demasiado largas", () => {
    expect(parseIdsQuery(new URLSearchParams("")).success).toBe(false);
    const many = Array.from({ length: MAX_IDS + 1 }, (_, i) => i + 1).join(",");
    expect(parseIdsQuery(new URLSearchParams(`ids=${many}`)).success).toBe(false);
  });
});
