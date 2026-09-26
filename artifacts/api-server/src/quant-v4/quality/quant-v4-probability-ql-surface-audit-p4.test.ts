import assert from "node:assert/strict";
import { listPrb001QuestionEntries, runPrb001Pipeline } from "../topics/Probability/PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "../topics/Probability/PRB-002";

function structuralSignature(stem: string) {
  return stem
    .normalize("NFKC")
    .toLowerCase()
    .replace(/-?\d+(?:\.\d+)?/gu, "<n>")
    .replace(/\b(red|blue|green|black|white)\b/gu, "<colour>")
    .replace(/\b(bag|box|jar|pouch|ball|balls|marble|marbles|pen|pens|stone|stones)\b/gu, "<object>")
    .replace(/[^a-z<>%+*/=\-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function auditPackage(
  packageId: "PRB-001" | "PRB-002",
  entries: ReturnType<typeof listPrb001QuestionEntries>,
  run: (cpId: any, input: any) => any,
) {
  const rows = entries.map((entry) => {
    const question = run(entry.cpId as any, {
      questionLanguageId: entry.qlId,
      seed: `QUANT-V4-PRB-QL-SURFACE-P4:${packageId}:${entry.qlId}`,
    });
    return {
      qlId: entry.qlId,
      cpId: entry.cpId,
      solveMode: entry.solveMode,
      stem: question.stem,
      signature: structuralSignature(question.stem),
    };
  });

  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const bucket = groups.get(row.signature) ?? [];
    bucket.push(row);
    groups.set(row.signature, bucket);
  }

  const duplicateQlGroups = [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([signature, group]) => ({
      signature,
      count: group.length,
      qlIds: group.map((row) => row.qlId),
      cpIds: [...new Set(group.map((row) => row.cpId))],
      solveModes: [...new Set(group.map((row) => row.solveMode))],
      exampleStem: group[0]!.stem,
    }))
    .sort((a, b) => b.count - a.count || a.signature.localeCompare(b.signature));

  const uniqueStructures = groups.size;
  const repeatedQlItems = rows.length - uniqueStructures;
  const repeatedQlRate = rows.length ? repeatedQlItems / rows.length : 0;

  assert.equal(rows.length, entries.length, `${packageId}: every registry QL must be audited exactly once.`);

  return {
    packageId,
    qlCount: rows.length,
    uniqueStructures,
    repeatedQlItems,
    repeatedQlRate,
    duplicateQlGroups,
  };
}

const prb001 = auditPackage("PRB-001", listPrb001QuestionEntries(), runPrb001Pipeline);
const prb002 = auditPackage("PRB-002", listPrb002QuestionEntries() as any, runPrb002Pipeline as any);

console.log("QUANT_V4_PROBABILITY_QL_SURFACE_AUDIT_P4", JSON.stringify({
  authority: "QUANT-V4-PROBABILITY-QL-SURFACE-AUDIT-P4",
  prb001,
  prb002,
  productionPromotionAuthorized: false,
}));
