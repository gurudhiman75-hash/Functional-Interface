Object.defineProperty(BigInt.prototype, "toJSON", {
  value(this: bigint): string {
    return this.toString();
  },
  configurable: true,
});

await import("./pace-option-integrity-proof-core");
