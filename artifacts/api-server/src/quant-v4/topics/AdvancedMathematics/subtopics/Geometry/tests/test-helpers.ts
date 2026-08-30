export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function pass(name: string): void {
  console.log(JSON.stringify({ suite: "GEO_PHASE_0", test: name, status: "PASS" }));
}
