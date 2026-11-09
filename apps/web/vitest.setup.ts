import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Desmonta lo renderizado entre tests para que no se contaminen entre sí.
afterEach(() => {
  cleanup();
});
