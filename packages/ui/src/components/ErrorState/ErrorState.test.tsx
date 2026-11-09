import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("se anuncia como alerta y permite reintentar", async () => {
    const onRetry = vi.fn();
    render(
      <ErrorState
        title="No pudimos cargar las obras"
        description="El museo no respondió."
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("alert")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("no muestra el botón si no hay acción de reintento", () => {
    render(<ErrorState title="Error" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
