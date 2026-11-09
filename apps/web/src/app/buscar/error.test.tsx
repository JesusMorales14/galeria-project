import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchError from "./error";

describe("error de /buscar", () => {
  it("explica el problema y permite reintentar", async () => {
    const retry = vi.fn();
    render(<SearchError error={new Error("x")} retry={retry} />);

    expect(screen.getByRole("alert")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
