import assert from "node:assert/strict";
import { ANA_CP001_QLS } from "./ANA-CP-001/task-registry";
import { generateSemanticAnalogy } from "./ANA-CP-001/generator";
import { ANA_CP003_QLS } from "./ANA-CP-003/question-language.en";
import { generateNumericAnalogy } from "./ANA-CP-003/generator";
import { ANA_CP004_QLS } from "./ANA-CP-004/question-language.en";
import { generateSetAnalogy } from "./ANA-CP-004/generator";
import {
  ANA_CP010_NUMERIC_QLS,
  ANA_CP010_SEMANTIC_QLS,
  ANA_CP010_SET_QLS,
} from "./ANA-CP-010/question-language.en";
import { generateAnaCp010 } from "./ANA-CP-010/runtime";
import { generateAnaCp010Semantic } from "./ANA-CP-010/semantic-runtime";

type DiversityRow = {
  qlId: string;
  samples: number;
  uniqueStructural: number;
  structuralRatio: number;
  uniqueFull: number;
  fullRatio: number;
};

function ratio(unique: number, samples: number): number {
  return Number((unique / samples).toFixed(3));
}

function auditQl(
  qlId: string,
  samples: number,
  generate: (seed: number) => unknown,
  structural: (generated: any) => unknown,
): DiversityRow {
  const full = new Set<string>();
  const structures = new Set<string>();
  for (let seed = 0; seed < samples; seed += 1) {
    const generated = generate(seed);
    full.add(JSON.stringify(generated));
    structures.add(JSON.stringify(structural(generated)));
  }
  assert.ok(full.size > 1, `${qlId} collapsed to one full output across ${samples} seeds.`);
  assert.ok(structures.size > 1, `${qlId} collapsed to one structural state across ${samples} seeds.`);
  return {
    qlId,
    samples,
    uniqueStructural: structures.size,
    structuralRatio: ratio(structures.size, samples),
    uniqueFull: full.size,
    fullRatio: ratio(full.size, samples),
  };
}

function summarize(name: string, rows: readonly DiversityRow[]) {
  const byStructural = [...rows].sort((a, b) => a.structuralRatio - b.structuralRatio);
  const byFull = [...rows].sort((a, b) => a.fullRatio - b.fullRatio);
  const averageStructural = rows.reduce((sum, row) => sum + row.structuralRatio, 0) / rows.length;
  const averageFull = rows.reduce((sum, row) => sum + row.fullRatio, 0) / rows.length;
  return {
    name,
    qlCount: rows.length,
    averageStructuralRatio: Number(averageStructural.toFixed(3)),
    averageFullRatio: Number(averageFull.toFixed(3)),
    lowestStructural: byStructural.slice(0, 8),
    lowestFull: byFull.slice(0, 8),
  };
}

const cp001Rows = ANA_CP001_QLS.map((ql) => auditQl(
  ql.qlId,
  120,
  (seed) => generateSemanticAnalogy(ql.qlId, seed),
  (g) => ({
    relation: g.relation.ruleId,
    mode: g.presentationMode,
    source: [g.sourceA, g.sourceB],
    target: [g.targetA, g.targetB],
  }),
));

const cp003Rows = ANA_CP003_QLS.map((ql) => auditQl(
  ql.qlId,
  120,
  (seed) => generateNumericAnalogy(ql.qlId, seed),
  (g) => ({
    rule: g.ruleId,
    mode: g.presentationMode,
    context: g.context,
    source: [g.sourceA, g.sourceB],
    target: [g.targetA, g.targetB],
    additional: g.additionalReference,
  }),
));

const cp004Rows = ANA_CP004_QLS.map((ql) => auditQl(
  ql.qlId,
  120,
  (seed) => generateSetAnalogy(ql.qlId, seed),
  (g) => ({
    rule: g.ruleId,
    mode: g.presentationMode,
    context: g.context,
    source: g.source,
    target: g.target,
    layout: g.layout,
    permutation: g.displayPermutation,
  }),
));

const cp010NumericSetRows = [...ANA_CP010_NUMERIC_QLS, ...ANA_CP010_SET_QLS].map((ql) => auditQl(
  ql.qlId,
  120,
  (seed) => generateAnaCp010(ql.qlId, seed),
  (g) => g.kind === "NUMERIC"
    ? {
      rule: g.ruleId,
      mode: g.presentationMode,
      context: g.context,
      source: g.source,
      target: g.target,
    }
    : {
      rule: g.ruleId,
      source: g.source,
      correct: g.options[g.correctIndex].value,
    },
));

const cp010SemanticRows = ANA_CP010_SEMANTIC_QLS.map((ql) => auditQl(
  ql.qlId,
  180,
  (seed) => generateAnaCp010Semantic(ql.qlId, seed, "en-IN"),
  (g) => ({
    relation: g.relationId,
    mode: g.presentationMode,
    sourceFactId: g.sourceFactId,
    targetFactId: g.targetFactId,
  }),
));

const summaries = [
  summarize("CP001 semantic", cp001Rows),
  summarize("CP003 numeric", cp003Rows),
  summarize("CP004 number sets", cp004Rows),
  summarize("CP010 numeric/set source gaps", cp010NumericSetRows),
  summarize("CP010 semantic source gaps", cp010SemanticRows),
];

console.log("ANA-001 final diversity audit report", JSON.stringify(summaries, null, 2));
