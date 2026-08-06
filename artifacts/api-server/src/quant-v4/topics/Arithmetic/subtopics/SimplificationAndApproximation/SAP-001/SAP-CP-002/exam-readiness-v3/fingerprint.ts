import type { ExprNode } from "./exact";
import { parseRat } from "./exact";

function valueNode(raw: string): ExprNode | null {
  const value = parseRat(raw);
  if (!value) return null;
  return Object.freeze({ kind: "VALUE", raw, value, mixed: false });
}

export function recoverProductAstFromFingerprint(fingerprint: string): ExprNode | null {
  const match = fingerprint.match(
    /^MULTIPLY\(V:(?:FRACTION|INTEGER)\((-?\d+)\/(\d+)\),V:(?:FRACTION|INTEGER)\((-?\d+)\/(\d+)\)\)$/,
  );
  if (!match) return null;
  const leftRaw = `${match[1]}/${match[2]}`;
  const rightRaw = `${match[3]}/${match[4]}`;
  const left = valueNode(leftRaw);
  const right = valueNode(rightRaw);
  if (!left || !right) return null;
  return Object.freeze({ kind: "BINARY", op: "*", left, right });
}
