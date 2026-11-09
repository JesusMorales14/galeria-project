import { describe, expect, it } from "vitest";
import { htmlToText } from "./htmlToText";

describe("htmlToText", () => {
  it("quita etiquetas y decodifica entidades", () => {
    expect(htmlToText("<p>Uno <em>dos</em> &amp; tres&nbsp;&quot;4&quot;</p>")).toBe(
      'Uno dos & tres "4"',
    );
  });

  it("separa párrafos con un salto de línea doble", () => {
    expect(htmlToText("<p>Uno</p>\n<p>Dos</p>")).toBe("Uno\n\nDos");
  });

  it("devuelve null para texto vacío o nulo", () => {
    expect(htmlToText(null)).toBeNull();
    expect(htmlToText("  <p> </p> ")).toBeNull();
  });
});
