import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// "server-only" lanza un error fuera de un Server Component; en tests no aplica.
vi.mock("server-only", () => ({}));

// Desmonta lo renderizado entre tests para que no se contaminen entre sí.
afterEach(() => {
  cleanup();
});
