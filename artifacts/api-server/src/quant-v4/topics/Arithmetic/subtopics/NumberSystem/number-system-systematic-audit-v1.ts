// @ts-nocheck
import assert from "node:assert/strict";

import {
  NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS,
  NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS,
  NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE,
} from "./design/number-system-final-allocation-authority";

import { NUM_CP001_PERMANENT_QL_IDS } from "./NUM-001/NUM-CP-001/permanent/allocation";
import { runNumCp001PermanentPipeline } from "./NUM-001/NUM-CP-001/permanent/runtime";
import { NUM_CP002_PERMANENT_QL_IDS } from "./NUM-001/NUM-CP-002/permanent/allocation";
import { runNumCp002PermanentPipeline } from "./NUM-001/NUM-CP-002/permanent/runtime";
import { NUM_CP003_PERMANENT_QL_IDS } from "./NUM-001/NUM-CP-003/permanent/allocation";
import { runNumCp003PermanentPipeline } from "./NUM-001/NUM-CP-003/permanent/runtime";
import { NUM_CP004_PERMANENT_QL_IDS } from "./NUM-001/NUM-CP-004/permanent/allocation";
import { runNumCp004PermanentPipeline } from "./NUM-001/NUM-CP-004/permanent/runtime";
import { NUM_CP005_PERMANENT_QL_IDS } from "./NUM-001/NUM-CP-005/permanent/allocation";
import { runNumCp005PermanentPipeline } from "./NUM-001/NUM-CP-005/permanent/runtime";
import { NUM_CP006_PERMANENT_QL_IDS } from "./NUM-001/NUM-CP-006/permanent/allocation";
import { runNumCp006PermanentPipeline } from "./NUM-001/NUM-CP-006/permanent/runtime";

import { NUM_CP007_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-007/permanent/allocation";
import { runNumCp007PermanentPipeline } from "./NUM-002/NUM-CP-007/permanent/runtime";
import { NUM_CP008_PERMANENT_ALLOCATION } from "./NUM-002/NUM-CP-008/permanent-allocation";
import { generateNumCp008Permanent } from "./NUM-002/NUM-CP-008/permanent-runtime";
import { NUM_CP009_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-009/permanent-allocation";
import { generateNumCp009Permanent } from "./NUM-002/NUM-CP-009/permanent-runtime";
import { NUM_CP010_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-010/permanent-allocation";
import { generateNumCp010Permanent } from "./NUM-002/NUM-CP-010/permanent-runtime";
import { NUM_CP011_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-011/permanent-allocation";
import { generateNumCp011Permanent } from "./NUM-002/NUM-CP-011/permanent-runtime";
import { NUM_CP012_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-012/permanent-allocation";
import { generateNumCp012Permanent } from "./NUM-002/NUM-CP-012/permanent-runtime";
import { NUM_CP013_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-013/permanent-allocation";
import { generateNumCp013Permanent } from "./NUM-002/NUM-CP-013/permanent-runtime";
import { NUM_CP014_PERMANENT_QL_IDS } from "./NUM-002/NUM-CP-014/permanent-allocation";
import { generateNumCp014Permanent } from "./NUM-002/NUM-CP-014/permanent-runtime";

const SEEDS_PER_QL = 8;
const MACHINE_STEM_PATTERNS = [
  /\bcalculate the answer\b/iu,
  /\bfind the answer\b/iu,
  /\bdetermine the answer\b/iu,
  /\bsolve the following\b/iu,
  /\busing the information (?:above|given)\b/iu,
  /\bfirst calculate\b/iu,
  /\bthen find\b/iu,
  /\bafter calculating\b/iu,
  /\bperform the following\b/iu,
] as const;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function optionValue(option: any): string {
  if (option === null || option === undefined) return "";
  if (typeof option === "string" || typeof option === "number" || typeof option === "bigint") {
    return String(option);
  }
  return String(option.value ?? option.text ?? option.label ?? option.display ?? "");
}

function flattenText(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(flattenText).filter(Boolean).join("\n");
  if (typeof value === "object") {
    const preferred = [
      value.lines,
      value.steps,
      value.fullDerivation,
      value.examShortcut,
      value.stepByStepSolution,
      value.mainRule,
      value.strategy,
      value.coreConcept,
      value.concept,
      value.finalAnswer,
    ].filter((item) => item !== undefined);
    if (preferred.length > 0) return preferred.map(flattenText).filter(Boolean).join("\n");
    return Object.values(value).map(flattenText).filter(Boolean).join("\n");
  }
  return String(value);
}

function stemOf(pkg: any): string {
  return String(pkg.stem ?? pkg.text ?? pkg.question ?? "").trim();
}

function optionsOf(pkg: any): string[] {
  return Array.isArray(pkg.options) ? pkg.options.map(optionValue) : [];
}

function correctIndexOf(pkg: any, options: readonly string[], answer: string): number {
  const explicit = Number(pkg.correctIndex ?? pkg.correct ?? pkg.answerIndex);
  if (Number.isInteger(explicit)) return explicit;
  return options.indexOf(answer);
}

function answerOf(pkg: any, options: readonly string[]): string {
  const value = pkg.canonicalAnswer ?? pkg.answer ?? pkg.verifierAnswer;
  if (value !== undefined && value !== null && typeof value !== "object") return String(value);
  if (value && typeof value === "object") {
    const rendered = value.value ?? value.display ?? value.rendered;
    if (rendered !== undefined) return String(rendered);
  }
  const index = Number(pkg.correctIndex ?? pkg.correct ?? pkg.answerIndex);
  return Number.isInteger(index) && options[index] !== undefined ? options[index]! : "";
}

function verifierOf(pkg: any): string | null {
  const value = pkg.verifierAnswer;
  if (value === undefined || value === null) return null;
  if (typeof value === "object") {
    const rendered = value.value ?? value.display ?? value.rendered;
    return rendered === undefined ? null : String(rendered);
  }
  return String(value);
}

function explanationOf(pkg: any): string {
  return flattenText(pkg.explanation ?? pkg.packageExplanation ?? pkg.solution ?? "").trim();
}

function normalizedStem(value: string): string {
  return value
    .toLowerCase()
    .replace(/₹\s*[\d,.]+/gu, "₹#")
    .replace(/\b\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?%?/gu, "#")
    .replace(/[०-९੦-੯]+/gu, "#")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.;:?])/gu, "$1")
    .trim();
}

function numericSignature(value: string): string {
  const tokens = value.match(
    /₹\s*[\d,]+(?:\.\d+)?|\\frac\{\d+\}\{\d+\}|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\b/gu,
  ) ?? [];
  return tokens.map((token) => token.replace(/\s+/gu, "").replace(/,/gu, "")).join("|");
}

function unresolvedPlaceholders(value: string): readonly string[] {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/gu, "")
    .replace(/\\\([\s\S]*?\\\)/gu, "")
    .replace(/\$\$[\s\S]*?\$\$/gu, "")
    .replace(/\$(?!\$)[^$\n]*\$(?!\$)/gu, "");
  return [
    ...new Set(
      [...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/gu)].map((match) => match[1]!),
    ),
  ];
}

function assertMathIntegrity(value: string, scope: string): void {
  assert.equal(
    (value.match(/\\\[/gu) ?? []).length,
    (value.match(/\\\]/gu) ?? []).length,
    scope + ": unmatched display MathJax brackets",
  );
  assert.equal(
    (value.match(/\\\(/gu) ?? []).length,
    (value.match(/\\\)/gu) ?? []).length,
    scope + ": unmatched inline MathJax delimiters",
  );
  assert.equal(
    (value.match(/\$\$/gu) ?? []).length % 2,
    0,
    scope + ": unbalanced display-dollar MathJax",
  );
  assert.doesNotMatch(
    value,
    /\\(?:frac|times|div|cdot|sqrt|left|right)$/u,
    scope + ": dangling LaTeX command",
  );
}

type GeneratorSpec = {
  cpId: string;
  packageId: "NUM-001" | "NUM-002";
  qlIds: readonly string[];
  generate: (qlId: string, seed: number) => any;
};

const SPECS: readonly GeneratorSpec[] = [
  { cpId: "NUM-CP-001", packageId: "NUM-001", qlIds: NUM_CP001_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp001PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" }) },
  { cpId: "NUM-CP-002", packageId: "NUM-001", qlIds: NUM_CP002_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp002PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" }) },
  { cpId: "NUM-CP-003", packageId: "NUM-001", qlIds: NUM_CP003_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp003PermanentPipeline({ questionLanguageId: qlId, seed: `NUM-SYSTEMATIC-V1:${qlId}:${seed}`, language: "en" }) },
  { cpId: "NUM-CP-004", packageId: "NUM-001", qlIds: NUM_CP004_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp004PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" }) },
  { cpId: "NUM-CP-005", packageId: "NUM-001", qlIds: NUM_CP005_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp005PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" }) },
  { cpId: "NUM-CP-006", packageId: "NUM-001", qlIds: NUM_CP006_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp006PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" }) },
  { cpId: "NUM-CP-007", packageId: "NUM-002", qlIds: NUM_CP007_PERMANENT_QL_IDS, generate: (qlId, seed) => runNumCp007PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" }) },
  { cpId: "NUM-CP-008", packageId: "NUM-002", qlIds: NUM_CP008_PERMANENT_ALLOCATION.map((item) => item.qlId), generate: (qlId, seed) => generateNumCp008Permanent(qlId, seed) },
  { cpId: "NUM-CP-009", packageId: "NUM-002", qlIds: NUM_CP009_PERMANENT_QL_IDS, generate: (qlId, seed) => generateNumCp009Permanent(qlId, seed) },
  { cpId: "NUM-CP-010", packageId: "NUM-002", qlIds: NUM_CP010_PERMANENT_QL_IDS, generate: (qlId, seed) => generateNumCp010Permanent(qlId, seed) },
  { cpId: "NUM-CP-011", packageId: "NUM-002", qlIds: NUM_CP011_PERMANENT_QL_IDS, generate: (qlId, seed) => generateNumCp011Permanent(qlId, seed) },
  { cpId: "NUM-CP-012", packageId: "NUM-002", qlIds: NUM_CP012_PERMANENT_QL_IDS, generate: (qlId, seed) => generateNumCp012Permanent(qlId, seed) },
  { cpId: "NUM-CP-013", packageId: "NUM-002", qlIds: NUM_CP013_PERMANENT_QL_IDS, generate: (qlId, seed) => generateNumCp013Permanent(qlId, seed) },
  { cpId: "NUM-CP-014", packageId: "NUM-002", qlIds: NUM_CP014_PERMANENT_QL_IDS, generate: (qlId, seed) => generateNumCp014Permanent(qlId, seed) },
];

assert.equal(SPECS.length, 14, "Number System checkpoint generator count drifted.");
assert.equal(NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS.length, 14, "Final checkpoint authority must contain 14 checkpoints.");
assert.equal(NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE.count, 253, "Final permanent QL count must remain 253.");

const runtimeQlIds = SPECS.flatMap((spec) => spec.qlIds.map(String));
assert.equal(runtimeQlIds.length, 253, "Runtime allocation does not cover 253 permanent QLs.");
assert.equal(new Set(runtimeQlIds).size, 253, "Runtime allocation contains duplicate QL identities.");
assert.deepEqual(
  [...runtimeQlIds].sort(),
  [...NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS].map(String).sort(),
  "Runtime allocation differs from final permanent authority.",
);

const authorityByCp = new Map(
  NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS.map((item) => [item.cpId, item]),
);
for (const spec of SPECS) {
  const authority = authorityByCp.get(spec.cpId);
  assert.ok(authority, spec.cpId + ": missing final checkpoint authority.");
  assert.equal(authority.packageId, spec.packageId, spec.cpId + ": package ownership drift.");
  assert.equal(authority.permanentQlCount, spec.qlIds.length, spec.cpId + ": permanent QL count drift.");
}

const metrics = new Map<string, {
  cpId: string;
  packageId: string;
  stems: Set<string>;
  structures: Set<string>;
  answers: Set<string>;
  numericSignatures: Set<string>;
  explanations: Set<string>;
  minExplanationLength: number;
  machinePatterns: Set<string>;
  sampleStems: string[];
}>();

let generatedQuestions = 0;
let lifecycleChecks = 0;
let verifierChecks = 0;
let mathChecks = 0;
let replayChecks = 0;

for (const spec of SPECS) {
  for (const qlId of spec.qlIds.map(String)) {
    const row = {
      cpId: spec.cpId,
      packageId: spec.packageId,
      stems: new Set<string>(),
      structures: new Set<string>(),
      answers: new Set<string>(),
      numericSignatures: new Set<string>(),
      explanations: new Set<string>(),
      minExplanationLength: Number.POSITIVE_INFINITY,
      machinePatterns: new Set<string>(),
      sampleStems: [] as string[],
    };
    metrics.set(qlId, row);

    for (let sample = 1; sample <= SEEDS_PER_QL; sample += 1) {
      const pkg = spec.generate(qlId, sample);
      generatedQuestions += 1;

      assert.equal(String(pkg.permanentQlId ?? pkg.questionLanguageId), qlId, qlId + ": permanent identity drift.");
      const actualPackage = String(pkg.packageId ?? spec.packageId);
      assert.equal(actualPackage, spec.packageId, qlId + ": package drift.");

      const lifecycle = pkg.lifecycle ?? pkg;
      assert.equal(Boolean(lifecycle.active), false, qlId + ": permanent runtime unexpectedly active.");
      assert.equal(Boolean(lifecycle.questionStudioDiscoverable), false, qlId + ": permanent runtime directly exposes Question Studio.");
      assert.equal(Boolean(lifecycle.questionBankWritable), false, qlId + ": Question Bank write boundary opened.");
      assert.equal(Boolean(lifecycle.testEligible), false, qlId + ": test eligibility opened.");
      assert.equal(Boolean(lifecycle.publiclyPublishable), false, qlId + ": public publication opened.");
      lifecycleChecks += 5;

      const stem = stemOf(pkg);
      const options = optionsOf(pkg);
      const answer = answerOf(pkg, options);
      const correctIndex = correctIndexOf(pkg, options, answer);
      const explanation = explanationOf(pkg);
      const verifier = verifierOf(pkg);

      assert.ok(stem.length > 0, qlId + ": learner stem is missing.");
      assert.equal(options.length, 4, qlId + ": expected four learner options.");
      assert.equal(new Set(options).size, 4, qlId + ": duplicate learner options.");
      assert.ok(correctIndex >= 0 && correctIndex < options.length, qlId + ": invalid correct index.");
      assert.equal(options[correctIndex], answer, qlId + ": correct option does not match canonical answer.");
      assert.ok(explanation.length > 0, qlId + ": explanation is missing.");

      if (verifier !== null) {
        assert.equal(String(answer), verifier, qlId + ": canonical/verifier answer drift.");
        verifierChecks += 1;
      }

      const learnerSurface = [stem, ...options, explanation].join("\n");
      const placeholders = unresolvedPlaceholders(learnerSurface);
      assert.equal(placeholders.length, 0, qlId + ": unresolved placeholders: " + placeholders.join(", "));
      assert.doesNotMatch(learnerSurface, /\b(?:undefined|NaN|Infinity|\[object Object\])\b/u, qlId + ": invalid learner token.");
      assertMathIntegrity(learnerSurface, qlId);
      mathChecks += 1;

      row.stems.add(stem);
      row.structures.add(normalizedStem(stem));
      row.answers.add(answer);
      row.numericSignatures.add(numericSignature(stem));
      row.explanations.add(normalizedStem(explanation));
      row.minExplanationLength = Math.min(row.minExplanationLength, explanation.length);
      for (const pattern of MACHINE_STEM_PATTERNS) {
        if (pattern.test(stem)) row.machinePatterns.add(pattern.source);
      }
      if (!row.sampleStems.includes(stem) && row.sampleStems.length < 3) row.sampleStems.push(stem);

      if (sample === 1) {
        const replay = spec.generate(qlId, sample);
        assert.equal(stable(replay), stable(pkg), qlId + ": same-seed permanent generation is nondeterministic.");
        replayChecks += 1;
      }
    }
  }
}

const perQl = [...metrics.entries()].map(([qlId, row]) => ({
  qlId,
  cpId: row.cpId,
  packageId: row.packageId,
  rawStemCount: row.stems.size,
  normalizedStemStructureCount: row.structures.size,
  answerCount: row.answers.size,
  numericSignatureCount: row.numericSignatures.size,
  explanationStructureCount: row.explanations.size,
  minExplanationLength: Number.isFinite(row.minExplanationLength) ? row.minExplanationLength : 0,
  machineStemPatterns: [...row.machinePatterns],
  sampleStems: row.sampleStems,
}));

const lowRawStemQls = perQl.filter((item) => item.rawStemCount < 4);
const lowStructureQls = perQl.filter((item) => item.normalizedStemStructureCount < 3);
const lowAnswerDiversityQls = perQl.filter((item) => item.answerCount < 4);
const lowNumericSignatureQls = perQl.filter((item) => item.numericSignatureCount < 4);
const thinExplanationQls = perQl.filter((item) => item.minExplanationLength < 120);
const machineStemQls = perQl.filter((item) => item.machineStemPatterns.length > 0);

const perCp = SPECS.map((spec) => {
  const rows = perQl.filter((item) => item.cpId === spec.cpId);
  return {
    cpId: spec.cpId,
    packageId: spec.packageId,
    qlCount: rows.length,
    lowRawStemQlCount: rows.filter((item) => item.rawStemCount < 4).length,
    lowStructureQlCount: rows.filter((item) => item.normalizedStemStructureCount < 3).length,
    lowAnswerDiversityQlCount: rows.filter((item) => item.answerCount < 4).length,
    lowNumericSignatureQlCount: rows.filter((item) => item.numericSignatureCount < 4).length,
    thinExplanationQlCount: rows.filter((item) => item.minExplanationLength < 120).length,
    machineStemQlCount: rows.filter((item) => item.machineStemPatterns.length > 0).length,
  };
});

console.log(JSON.stringify({
  version: "NUMBER-SYSTEM-SYSTEMATIC-AUDIT-V1",
  checkpointCount: SPECS.length,
  permanentQlCount: runtimeQlIds.length,
  seedsPerQl: SEEDS_PER_QL,
  generatedQuestions,
  lifecycleChecks,
  verifierChecks,
  mathChecks,
  replayChecks,
  perCp,
  lowRawStemQls: lowRawStemQls.map((item) => item.qlId),
  lowStructureQls: lowStructureQls.map((item) => item.qlId),
  lowAnswerDiversityQls: lowAnswerDiversityQls.map((item) => item.qlId),
  lowNumericSignatureQls: lowNumericSignatureQls.map((item) => ({
    qlId: item.qlId,
    cpId: item.cpId,
    count: item.numericSignatureCount,
    samples: item.sampleStems,
  })),
  thinExplanationQls: thinExplanationQls.map((item) => item.qlId),
  machineStemQls: machineStemQls.map((item) => ({
    qlId: item.qlId,
    cpId: item.cpId,
    patterns: item.machineStemPatterns,
    samples: item.sampleStems,
  })),
  perQl,
}, null, 2));

console.log("PASS_NUMBER_SYSTEM_SYSTEMATIC_AUDIT_V1_CORE_INTEGRITY");
