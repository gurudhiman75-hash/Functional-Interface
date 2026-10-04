import assert from "node:assert/strict";

import { generateQuestion } from "../../../../../generation-engine";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SEEDS_PER_QL = 12;
const QL_COUNT = 67;

function qlId(number: number): string {
  return `MAL-QL-${String(number).padStart(3, "0")}`;
}

function expectedCp(number: number): string {
  if (number <= 11) return "MAL-CP-001";
  if (number <= 28) return "MAL-CP-002";
  if (number <= 37) return "MAL-CP-003";
  if (number <= 47) return "MAL-CP-004";
  if (number <= 60) return "MAL-CP-005";
  return "MAL-CP-006";
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: any): string {
  return [
    question.text,
    ...(question.options ?? []),
    question.explanation,
  ].map(String).join("\n");
}

function stripMath(value: string): string {
  return value
    .replace(/\\\[[\s\S]*?\\\]/gu, "")
    .replace(/\\\([\s\S]*?\\\)/gu, "")
    .replace(/\$\$[\s\S]*?\$\$/gu, "")
    .replace(/\$(?!\$)[^$\n]*\$(?!\$)/gu, "")
    .replace(/\^\{[^}]*\}/gu, "")
    .replace(/\\[A-Za-z]+\{[^}]*\}/gu, "");
}

function unresolvedPlaceholders(value: string): readonly string[] {
  return [...new Set(
    [...stripMath(value).matchAll(/\{([a-z][A-Za-z0-9_]*)\}/gu)].map((match) => match[1]!),
  )];
}

function assertMathJaxIntegrity(value: string, scope: string): void {
  assert.equal((value.match(/\\\[/gu) ?? []).length, (value.match(/\\\]/gu) ?? []).length, scope + ": unmatched display MathJax.");
  assert.equal((value.match(/\\\(/gu) ?? []).length, (value.match(/\\\)/gu) ?? []).length, scope + ": unmatched inline MathJax.");
  assert.equal((value.match(/\$\$/gu) ?? []).length % 2, 0, scope + ": unbalanced display-dollar MathJax.");
  assert.doesNotMatch(value, /\\(?:frac|times|div|cdot|sqrt|left|right)$/u, scope + ": dangling LaTeX command.");
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

function normalizedExplanation(value: string): string {
  return value
    .toLowerCase()
    .replace(/₹\s*[\d,.]+/gu, "₹#")
    .replace(/\b\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?%?/gu, "#")
    .replace(/[०-९੦-੯]+/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(value: string): string {
  const tokens = value.match(/₹\s*[\d,]+(?:\.\d+)?|\\frac\{\d+\}\{\d+\}|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\b/gu) ?? [];
  return tokens.map((token) => token.replace(/\s+/gu, "").replace(/,/gu, "")).join("|");
}

const MACHINE_STEM_PATTERNS = [
  /\bcalculate the answer\b/iu,
  /\bfind the answer\b/iu,
  /\bdetermine the answer\b/iu,
  /\bsolve the following\b/iu,
  /\busing the information (?:above|given)\b/iu,
  /\bfirst calculate\b/iu,
  /\bthen find\b/iu,
  /\bafter calculating\b/iu,
] as const;

type Metrics = {
  cpId: string;
  stems: Set<string>;
  stemStructures: Set<string>;
  answers: Set<string>;
  explanationStructures: Set<string>;
  numericSignatures: Set<string>;
  machineStemHits: Set<string>;
  minExplanationLength: number;
  maxExplanationLength: number;
  difficultyBands: Set<string>;
};

const metricsByQl = new Map<string, Metrics>();
const crossQlStructures = new Map<string, Set<string>>();
const samplesByQl = new Map<string, string[]>();

let generatedPackages = 0;
let deterministicReplayChecks = 0;
let nativeScriptChecks = 0;
let parityChecks = 0;
let lifecycleChecks = 0;
let mathJaxChecks = 0;

for (let number = 1; number <= QL_COUNT; number += 1) {
  const ql = qlId(number);
  const cpId = expectedCp(number);
  const metrics: Metrics = {
    cpId,
    stems: new Set(),
    stemStructures: new Set(),
    answers: new Set(),
    explanationStructures: new Set(),
    numericSignatures: new Set(),
    machineStemHits: new Set(),
    minExplanationLength: Number.POSITIVE_INFINITY,
    maxExplanationLength: 0,
    difficultyBands: new Set(),
  };
  metricsByQl.set(ql, metrics);

  for (let sample = 0; sample < SEEDS_PER_QL; sample += 1) {
    const seed = `MAL-001-SYSTEMATIC-AUDIT-V1:${ql}:${sample}`;
    let english: any = null;

    for (const language of LANGUAGES) {
      const result = await generateQuestion({
        packageId: "MAL-001",
        questionLanguageId: ql,
        count: 1,
        seed,
        language,
      } as any);

      assert.equal(result.questions?.length, 1, `${ql}/${language}: expected one question.`);
      const question = result.questions[0] as any;
      generatedPackages += 1;

      assert.equal(question.packageId, "MAL-001", `${ql}/${language}: package drift.`);
      assert.equal(question.questionLanguageId, ql, `${ql}/${language}: QL drift.`);
      assert.equal(question.canonicalProblemId, cpId, `${ql}/${language}: CP routing drift.`);
      assert.equal(question.language, language, `${ql}/${language}: language drift.`);
      assert.ok(Array.isArray(question.options) && question.options.length === 4, `${ql}/${language}: expected four options.`);
      assert.equal(new Set(question.options).size, 4, `${ql}/${language}: duplicate options.`);
      assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${ql}/${language}: invalid correct index.`);
      assert.equal(question.options[question.correctIndex], question.answer, `${ql}/${language}: answer/index mismatch.`);
      assert.ok(String(question.text ?? "").trim().length >= 18, `${ql}/${language}: thin stem.`);
      assert.ok(String(question.explanation ?? "").trim().length >= 30, `${ql}/${language}: thin explanation.`);

      assert.equal(result.generationContext?.questionBankStatus, "NOT_STORED", `${ql}/${language}: Question Bank boundary drift.`);
      assert.equal(result.generationContext?.questionBankWritable, false, `${ql}/${language}: Question Bank write opened.`);
      assert.equal(result.generationContext?.testEligibility, "INELIGIBLE", `${ql}/${language}: test eligibility opened.`);
      assert.equal(result.generationContext?.publiclyPublishable, false, `${ql}/${language}: publication opened.`);
      lifecycleChecks += 4;

      const surface = learnerText(question);
      assert.equal(unresolvedPlaceholders(surface).length, 0, `${ql}/${language}: unresolved placeholders: ${unresolvedPlaceholders(surface).join(", ")}`);
      assert.doesNotMatch(surface, /\b(?:undefined|NaN|Infinity|\[object Object\])\b/u, `${ql}/${language}: invalid learner token.`);
      assertMathJaxIntegrity(surface, `${ql}/${language}`);
      mathJaxChecks += 1;

      if (language === "hi") {
        assert.match(String(question.text) + "\n" + String(question.explanation), /[\u0900-\u097F]/u, `${ql}/hi: Hindi script missing.`);
        nativeScriptChecks += 1;
      }
      if (language === "pa") {
        assert.match(String(question.text) + "\n" + String(question.explanation), /[\u0A00-\u0A7F]/u, `${ql}/pa: Punjabi script missing.`);
        nativeScriptChecks += 1;
      }

      if (language === "en") {
        english = question;
        metrics.stems.add(String(question.text));
        const structure = normalizedStem(String(question.text));
        metrics.stemStructures.add(structure);
        metrics.answers.add(String(question.answer));
        metrics.explanationStructures.add(normalizedExplanation(String(question.explanation)));
        metrics.numericSignatures.add(numericSignature(String(question.text)));
        metrics.minExplanationLength = Math.min(metrics.minExplanationLength, String(question.explanation).length);
        metrics.maxExplanationLength = Math.max(metrics.maxExplanationLength, String(question.explanation).length);
        metrics.difficultyBands.add(String(question.difficulty));
        for (const pattern of MACHINE_STEM_PATTERNS) if (pattern.test(String(question.text))) metrics.machineStemHits.add(pattern.source);

        const owners = crossQlStructures.get(structure) ?? new Set<string>();
        owners.add(ql);
        crossQlStructures.set(structure, owners);

        const samples = samplesByQl.get(ql) ?? [];
        if (!samples.includes(String(question.text)) && samples.length < 3) samples.push(String(question.text));
        samplesByQl.set(ql, samples);
      } else {
        assert.ok(english, `${ql}/${language}: English parity surface missing.`);
        assert.equal(question.correctIndex, english.correctIndex, `${ql}/${language}: answer-position parity drift.`);
        assert.equal(question.difficulty, english.difficulty, `${ql}/${language}: difficulty parity drift.`);
        assert.equal(numericSignature(String(question.answer)), numericSignature(String(english.answer)), `${ql}/${language}: answer numeric parity drift.`);
        parityChecks += 3;
      }

      if (sample === 0) {
        const replay = await generateQuestion({
          packageId: "MAL-001",
          questionLanguageId: ql,
          count: 1,
          seed,
          language,
        } as any);
        assert.equal(stable(replay.questions?.[0]), stable(question), `${ql}/${language}: same-seed generation is nondeterministic.`);
        deterministicReplayChecks += 1;
      }
    }
  }
}

const perQl = [...metricsByQl.entries()].map(([qlIdValue, metrics]) => ({
  qlId: qlIdValue,
  cpId: metrics.cpId,
  rawStemCount: metrics.stems.size,
  normalizedStemStructureCount: metrics.stemStructures.size,
  answerCount: metrics.answers.size,
  explanationStructureCount: metrics.explanationStructures.size,
  numericSignatureCount: metrics.numericSignatures.size,
  difficultyBands: [...metrics.difficultyBands].sort(),
  minExplanationLength: Number.isFinite(metrics.minExplanationLength) ? metrics.minExplanationLength : 0,
  maxExplanationLength: metrics.maxExplanationLength,
  machineStemPatterns: [...metrics.machineStemHits],
  sampleStems: samplesByQl.get(qlIdValue) ?? [],
}));

const lowRawStemQls = perQl.filter((item) => item.rawStemCount < 6);
const lowStructureQls = perQl.filter((item) => item.normalizedStemStructureCount < 3);
const lowAnswerDiversityQls = perQl.filter((item) => item.answerCount < 6);
const lowNumericSignatureQls = perQl.filter((item) => item.numericSignatureCount < 6);
const thinExplanationQls = perQl.filter((item) => item.minExplanationLength < 120);
const machineStemQls = perQl.filter((item) => item.machineStemPatterns.length > 0);
const crossQlStemCollisions = [...crossQlStructures.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([structure, owners]) => ({ structure, qlIds: [...owners].sort() }));

const perCp = ["MAL-CP-001", "MAL-CP-002", "MAL-CP-003", "MAL-CP-004", "MAL-CP-005", "MAL-CP-006"].map((cpId) => {
  const rows = perQl.filter((item) => item.cpId === cpId);
  return {
    cpId,
    qlCount: rows.length,
    lowRawStemQlCount: rows.filter((item) => item.rawStemCount < 6).length,
    lowStructureQlCount: rows.filter((item) => item.normalizedStemStructureCount < 3).length,
    lowAnswerDiversityQlCount: rows.filter((item) => item.answerCount < 6).length,
    lowNumericSignatureQlCount: rows.filter((item) => item.numericSignatureCount < 6).length,
    thinExplanationQlCount: rows.filter((item) => item.minExplanationLength < 120).length,
    machineStemQlCount: rows.filter((item) => item.machineStemPatterns.length > 0).length,
  };
});

console.log(JSON.stringify({
  version: "MAL-001-SYSTEMATIC-AUDIT-V1",
  packageId: "MAL-001",
  permanentQlCount: QL_COUNT,
  checkpointCount: 6,
  languages: LANGUAGES,
  seedsPerQl: SEEDS_PER_QL,
  generatedPackages,
  deterministicReplayChecks,
  nativeScriptChecks,
  parityChecks,
  lifecycleChecks,
  mathJaxChecks,
  perCp,
  lowRawStemQls,
  lowStructureQls,
  lowAnswerDiversityQls: lowAnswerDiversityQls.map((item) => item.qlId),
  lowNumericSignatureQls,
  thinExplanationQls: thinExplanationQls.map((item) => item.qlId),
  machineStemQls: machineStemQls.map((item) => item.qlId),
  crossQlStemCollisions,
  perQl,
}, null, 2));

assert.equal(lowRawStemQls.length, 0, `Low raw-stem diversity remains: ${lowRawStemQls.map((item) => item.qlId).join(", ")}`);
assert.equal(lowStructureQls.length, 0, `Low structural diversity remains: ${lowStructureQls.map((item) => item.qlId).join(", ")}`);
assert.equal(lowAnswerDiversityQls.length, 0, `Low answer diversity remains: ${lowAnswerDiversityQls.map((item) => item.qlId).join(", ")}`);
assert.equal(lowNumericSignatureQls.length, 0, `Low numeric-state diversity remains: ${lowNumericSignatureQls.map((item) => item.qlId).join(", ")}`);
assert.equal(thinExplanationQls.length, 0, `Thin explanations remain: ${thinExplanationQls.map((item) => item.qlId).join(", ")}`);
assert.equal(machineStemQls.length, 0, `Machine-like stems remain: ${machineStemQls.map((item) => item.qlId).join(", ")}`);
assert.equal(crossQlStemCollisions.length, 0, `Cross-QL stem collisions remain: ${crossQlStemCollisions.map((item) => item.qlIds.join("/")).join(", ")}`);

console.log("PASS_MAL_001_SYSTEMATIC_AUDIT_V1_CORE_INTEGRITY");
console.log("PASS_MAL_001_SYSTEMATIC_AUDIT_V1_FULL_DIVERSITY_CLOSURE");
