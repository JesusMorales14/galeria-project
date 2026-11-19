// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkHealth } from "./health";

const getUser = vi.hoisted(() => vi.fn());
vi.mock("./container", () => ({ authService: async () => ({ getUser }) }));

describe("checkHealth", () => {
  beforeEach(() => {
    getUser.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("ok si el almacén responde", async () => {
    getUser.mockResolvedValue(null);
    expect(await checkHealth()).toEqual({ status: "ok", storage: "ok" });
  });

  it("degradado si la base de datos no responde", async () => {
    getUser.mockImplementation(async () => {
      throw new Error("ECONNREFUSED");
    });
    expect(await checkHealth()).toEqual({ status: "degraded", storage: "unavailable" });
  });
});
