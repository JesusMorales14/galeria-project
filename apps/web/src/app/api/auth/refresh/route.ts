import type { NextRequest } from "next/server";
import { refreshSession } from "@/features/auth";

export function GET(request: NextRequest) {
  return refreshSession(request);
}
