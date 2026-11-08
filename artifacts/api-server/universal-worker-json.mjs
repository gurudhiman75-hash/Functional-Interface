// HTTP JSON has no BigInt primitive. Preserve exact integral values as
// decimal strings, rather than throwing, rounding or leaking engine internals.
// Review persistence already expects JSON-safe payloads.
export function serializeUniversalWorkerResponse(value) {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? entry.toString(10) : entry);
}
