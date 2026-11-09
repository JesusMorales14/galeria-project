import { describe, expect, it } from "vitest";
import { visiblePages } from "./pages";

const numbers = (items: ReturnType<typeof visiblePages>) =>
  items.map((item) => (item.type === "page" ? item.page : "…"));

describe("visiblePages", () => {
  it("muestra primera, última y vecinas con huecos", () => {
    expect(numbers(visiblePages(10, 52))).toEqual([1, "…", 9, 10, 11, "…", 52]);
  });

  it("no repite páginas en los extremos", () => {
    expect(numbers(visiblePages(1, 3))).toEqual([1, 2, 3]);
    expect(numbers(visiblePages(1, 1))).toEqual([1]);
  });
});
