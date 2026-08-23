import { generateNumCp011Wave01 } from "./runtime.ts";
import type { NumCp011Wave01Package, NumCp011Wave01PrototypeId } from "./types.ts";

export function generateNumCp011Wave01Human(
  prototypeId: NumCp011Wave01PrototypeId,
  seed: number,
): NumCp011Wave01Package {
  const q = generateNumCp011Wave01(prototypeId, seed);
  if (prototypeId !== "NUM-CP011-PROT-005") return q;

  const n = Number(q.hiddenState.n);
  return Object.freeze({
    ...q,
    explanation: Object.freeze({
      ...q.explanation,
      finalAnswer: `${n}! has ${q.canonicalAnswer} trailing zeroes.`,
    }),
  });
}
