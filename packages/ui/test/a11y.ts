import axe from "axe-core";
import { expect } from "vitest";

/** Falla el test si axe encuentra violaciones de accesibilidad en el contenedor. */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } }, // jsdom no calcula estilos; se revisa en Storybook
  });
  const summary = results.violations.map((v) => `${v.id}: ${v.help}`);
  expect(summary).toEqual([]);
}
