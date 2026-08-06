import type { ExprNode } from "./exact";
import { parseRat } from "./exact";

function valueNode(raw: string): ExprNode | null {
  const value = parseRat(raw);
  if (!value) return null;
  return Object.freeze({ kind: "VALUE", raw, value, mixed: false });
}

export function recoverProductAstFromFingerprint(fingerprint: string): ExprNode | null {
  if (!/MULTIPLY/i.test(fingerprint)) return null;
  const fractions = [...fingerprint.matchAll(/(-?\d+)\/(\d+)/g)];
  if (fractions.length < 2) return null;
  const leftRaw = `${fractions[0]![1]}/${fractions[0]![2]}`;
  const rightRaw = `${fractions[1]![1]}/${fractions[1]![2]}`;
  const left = valueNode(leftRaw);
  const right = valueNode(rightRaw);
  if (!left || !right) return null;
  return Object.freeze({ kind: "BINARY", op: "*", left, right });
}
