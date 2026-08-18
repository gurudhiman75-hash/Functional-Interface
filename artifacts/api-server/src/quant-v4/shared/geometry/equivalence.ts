import { toCanonicalString, type Rational } from "./exact";

export function rationalFingerprint(value: Rational): string {
  return toCanonicalString(value);
}

export function unorderedPairFingerprint(left: string, right: string): string {
  return [left, right].sort().join("::");
}
