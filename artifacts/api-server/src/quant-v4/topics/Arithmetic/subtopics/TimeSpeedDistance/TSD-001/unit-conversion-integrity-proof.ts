Object.defineProperty(BigInt.prototype, "toJSON", {
  value(this: bigint): string {
    return this.toString();
  },
  configurable: true,
});

await import("./unit-conversion-integrity-proof-core");
