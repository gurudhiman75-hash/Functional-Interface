import { generateCaseletBatch } from "./index.ts";
import { generateLp002Batch } from "./lp-002.ts";
import { generateLp003Batch } from "./lp-003.ts";
import { generateLp004Batch } from "./lp-004.ts";
import { generateLp005Batch } from "./lp-005.ts";
import { generateLp006Batch } from "./lp-006.ts";
import { generateLp007Batch } from "./lp-007.ts";
import { generateLp008Batch } from "./lp-008.ts";
import { generateLp009Batch } from "./lp-009.ts";
import { generateLp010Batch } from "./lp-010.ts";
import { generateLp011Batch } from "./lp-011.ts";
import { generateLpCp04BatchV3 } from "./lp-cp04-counterfactual-v3.ts";

type CaseletLike = {
  difficultyBand: string;
  clues: readonly Record<string, unknown>[];
};

function structuralSignature(caselet: CaseletLike): string {
  const tokenMap = new Map<string, string>();
  let next = 1;

  const token = (value: string): string => {
    if (!tokenMap.has(value)) tokenMap.set(value, "X" + next++);
    return tokenMap.get(value)!;
  };

  const normalizeValue = (key: string, value: unknown): unknown => {
    if (key === "text") return undefined;
    if (key === "kind") return value;
    if (typeof value === "string") return token(value);
    if (typeof value === "number" || typeof value === "boolean" || value == null) return value;
    if (Array.isArray(value)) return value.map((item) =>
      typeof item === "string" ? token(item) : item,
    );
    if (typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .filter(([nestedKey]) => nestedKey !== "text")
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([nestedKey, nestedValue]) => [nestedKey, normalizeValue(nestedKey, nestedValue)]),
      );
    }
    return typeof value;
  };

  const clues = caselet.clues.map((clue) =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(clue)
          .filter(([key]) => key !== "text")
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => [key, normalizeValue(key, value)]),
      ),
    ),
  ).sort();

  return JSON.stringify({
    difficulty: caselet.difficultyBand,
    clues,
  });
}

function report(packageId: string, caselets: readonly CaseletLike[]) {
  const byDifficulty = new Map<string, { total: number; signatures: Set<string> }>();
  for (const caselet of caselets) {
    const row = byDifficulty.get(caselet.difficultyBand) ?? { total: 0, signatures: new Set<string>() };
    row.total += 1;
    row.signatures.add(structuralSignature(caselet));
    byDifficulty.set(caselet.difficultyBand, row);
  }

  const rows = [...byDifficulty.entries()].map(([difficulty, row]) => ({
    difficulty,
    total: row.total,
    uniqueStructuralSignatures: row.signatures.size,
    repeatRate: Number((1 - row.signatures.size / row.total).toFixed(3)),
  }));

  console.log(JSON.stringify({ packageId, rows }));
}

const COUNT = 36;
report("LP-001", generateCaseletBatch("LP-STRUCTURE-LP001", COUNT) as any);
report("LP-002", generateLp002Batch("LP-STRUCTURE-LP002", COUNT) as any);
report("LP-003", generateLp003Batch("LP-STRUCTURE-LP003", COUNT) as any);
report("LP-004", generateLp004Batch("LP-STRUCTURE-LP004", COUNT) as any);
report("LP-005", generateLp005Batch("LP-STRUCTURE-LP005", COUNT) as any);
report("LP-006", generateLp006Batch("LP-STRUCTURE-LP006", COUNT) as any);
report("LP-007", generateLp007Batch("LP-STRUCTURE-LP007", COUNT) as any);
report("LP-008", generateLp008Batch("LP-STRUCTURE-LP008", COUNT) as any);
report("LP-009", generateLp009Batch("LP-STRUCTURE-LP009", COUNT) as any);
report("LP-010", generateLp010Batch("LP-STRUCTURE-LP010", COUNT) as any);
report("LP-011", generateLp011Batch("LP-STRUCTURE-LP011", COUNT) as any);

const cp04 = generateLpCp04BatchV3("LP-STRUCTURE-QL047", COUNT);
report("LP-QL-047", cp04.map((caselet) => ({
  difficultyBand: caselet.difficultyBand,
  clues: caselet.clues as any,
})) as any);

console.log("PASS_LP_STRUCTURAL_REPETITION_DIAGNOSTIC");
