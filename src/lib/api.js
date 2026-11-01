import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok(data = {}, init = 200) {
  return NextResponse.json({ ok: true, ...data }, { status: init });
}

export function fail(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function handleError(err) {
  if (err instanceof ZodError) {
    return fail("Validation failed", 422, { issues: err.issues });
  }
  if (err?.status) return fail(err.message, err.status);
  console.error("API error:", err);
  return fail("Internal server error", 500);
}
