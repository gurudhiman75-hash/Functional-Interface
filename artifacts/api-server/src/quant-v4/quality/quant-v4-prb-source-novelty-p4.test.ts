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
  const rows:any[] = [];
  for (const entry of entries) {
    for (let seedIndex = 0; seedIndex < 4; seedIndex += 1) {
      const question = run(entry.cpId as any, {
        questionLanguageId: entry.qlId,
        seed: `QUANT-V4-PRB-SOURCE-NOVELTY-P4:${packageId}:${entry.qlId}:${seedIndex}`,
      });
      rows.push({
        qlId: entry.qlId,
        cpId: entry.cpId,
        solveMode: entry.solveMode,
        stem: question.stem,
        structural: structuralSignature(question.stem),
        mathematicalFingerprint: question.mathematicalFingerprint,
        parameterFingerprint: question.parameterFingerprint,
      });
    }
  }

  const uniqueQl = new Set(rows.map((row)=>row.qlId)).size;
  const uniqueMath = new Set(rows.map((row)=>row.mathematicalFingerprint)).size;
  const uniqueParams = new Set(rows.map((row)=>row.parameterFingerprint)).size;
  const uniqueStructural = new Set(rows.map((row)=>row.structural)).size;
  const exact = new Set(rows.map((row)=>row.stem)).size;
  const cosmeticReskins = rows.length - uniqueStructural;
  const bySolveMode = Object.fromEntries(
    [...new Set(rows.map((row)=>row.solveMode))].sort().map((mode)=> {
      const modeRows=rows.filter((row)=>row.solveMode===mode);
      return [mode,{
        records:modeRows.length,
        qls:new Set(modeRows.map((row)=>row.qlId)).size,
        structures:new Set(modeRows.map((row)=>row.structural)).size,
        mathematicalStates:new Set(modeRows.map((row)=>row.mathematicalFingerprint)).size,
      }];
    })
  );

  assert.equal(uniqueQl, entries.length, `${packageId}: QL coverage drift`);
  assert.ok(
    rows.length ? uniqueMath / rows.length >= 0.70 : false,
    `${packageId}: mathematical-state novelty must be at least 70%; got ${rows.length ? uniqueMath / rows.length : 0}`,
  );
  assert.ok(
    rows.length ? uniqueParams / rows.length >= 0.90 : false,
    `${packageId}: parameter-state novelty must be at least 90%; got ${rows.length ? uniqueParams / rows.length : 0}`,
  );

  return {
    packageId,
    registryQlCount: entries.length,
    records: rows.length,
    uniqueExactStems: exact,
    uniqueStructuralStems: uniqueStructural,
    structuralReuseRate: rows.length ? (rows.length-uniqueStructural)/rows.length : 0,
    cosmeticReskinRate: rows.length ? cosmeticReskins/rows.length : 0,
    mathematicalStateNoveltyRate: rows.length ? uniqueMath/rows.length : 0,
    parameterStateNoveltyRate: rows.length ? uniqueParams/rows.length : 0,
    solveModeBreadth: Object.keys(bySolveMode).length,
    bySolveMode,
  };
}

const prb001 = auditPackage("PRB-001", listPrb001QuestionEntries(), runPrb001Pipeline);
const prb002 = auditPackage("PRB-002", listPrb002QuestionEntries() as any, runPrb002Pipeline as any);

console.log("QUANT_V4_PRB_SOURCE_NOVELTY_P4", JSON.stringify({
  prb001,
  prb002,
  productionPromotionAuthorized:false,
}));
