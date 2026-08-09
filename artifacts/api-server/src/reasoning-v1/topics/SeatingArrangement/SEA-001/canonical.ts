import { createHash } from "node:crypto";

function normalise(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalise);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, normalise(nested)]));
  }
  return value;
}

export function canonicalDigest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(normalise(value))).digest("hex");
}
