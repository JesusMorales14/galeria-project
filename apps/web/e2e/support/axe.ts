import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Falla el test si axe encuentra violaciones WCAG 2.2 A/AA en la página. */
export async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const violations = results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );
  expect(violations, "violaciones de accesibilidad").toEqual([]);
}
