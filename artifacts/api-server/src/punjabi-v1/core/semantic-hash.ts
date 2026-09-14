export function semanticHash(parts: readonly string[]): string {
  const normalized = parts.map((part) => part.normalize("NFC").trim()).join("|");
  let h = 2166136261 >>> 0;
  for (const ch of normalized) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
