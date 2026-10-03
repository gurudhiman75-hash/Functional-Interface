import assert from "node:assert/strict";

import { generateQuestion } from "../../../../../question-studio-review-engine";
import {
  TMW_001_QUESTION_STUDIO_CP_IDS,
  TMW_001_QUESTION_STUDIO_QLS,
} from "./question-studio-adapter";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SEEDS_PER_QL = 12;
const EXPECTED_QL_COUNT = 228;
const EXPECTED_CP_COUNT = 14;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function leafText(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(leafText);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(leafText);
  }
  return [];
}

function learnerPrompt(question: any): string {
  return [
    question?.text,
    question?.caseletStimulus,
    ...leafText(question?.presentationBlocks),
  ].filter((item) => typeof item === "string" && item.trim().length > 0).join("\n");
}

function learnerText(question: any): string {
  return [
    learnerPrompt(question),
    ...(question?.options ?? []),
    question?.explanation,
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
  return [
    ...new Set(
      [...stripMath(value).matchAll(/\{([a-z][A-Za-z0-9_]*)\}/gu)].map(
        (match) => match[1]!,
      ),
    ),
  ];
}

function assertMathJaxIntegrity(value: string, scope: string): void {
  assert.equal(
    (value.match(/\\\[/gu) ?? []).length,
    (value.match(/\\\]/gu) ?? []).length,
    scope + ": unmatched display MathJax.",
  );
  assert.equal(
    (value.match(/\\\(/gu) ?? []).length,
    (value.match(/\\\)/gu) ?? []).length,
    scope + ": unmatched inline MathJax.",
  );
  assert.equal(
    (value.match(/\$\$/gu) ?? []).length % 2,
    0,
    scope + ": unbalanced display-dollar MathJax.",
  );
  assert.doesNotMatch(
    value,
    /\\(?:frac|times|div|cdot|sqrt|left|right)$/u,
    scope + ": dangling LaTeX command.",
  );
}

function normalizedPrompt(value: string): string {
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
  const normalized = value
    .replace(
      /\\frac\{(\d+)\}\{(\d+)\}/gu,
      " $1/$2 ",
    )
    .replace(/\\%/gu, "%");
  const tokens =
    normalized.match(
      /₹\s*[\d,]+(?:\.\d+)?|\b\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?/gu,
    ) ?? [];
  return tokens
    .map((token) => token.replace(/\s+/gu, "").replace(/,/gu, ""))
    .join("|");
}

function hasPercentMarker(value: string): boolean {
  return /%|\\%/u.test(value);
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
  /\bperform the following\b/iu,
  /\bstart by (?:calculating|finding|determining)\b/iu,
  /\bto solve (?:this|the problem)\b/iu,
] as const;

const GENERIC_EXPLANATION_PATTERNS = [
  /Continue the calculation with the remaining quantity/iu,
  /After simplification, the required value is/iu,
  /Use the given values in the formula and simplify/iu,
] as const;

type Metrics = {
  cpId: string;
  difficulty: string;
  scenarioFamily: string;
  prompts: Set<string>;
  promptStructures: Set<string>;
  answers: Set<string>;
  explanationStructures: Set<string>;
  numericSignatures: Set<string>;
  parameterStates: Set<string>;
  machineStemHits: Set<string>;
  genericExplanationHits: Set<string>;
  minExplanationLength: number;
  maxExplanationLength: number;
};

assert.equal(
  TMW_001_QUESTION_STUDIO_QLS.length,
  EXPECTED_QL_COUNT,
  `Expected ${EXPECTED_QL_COUNT} active TMW-001 QLs.`,
);
assert.equal(
  TMW_001_QUESTION_STUDIO_CP_IDS.length,
  EXPECTED_CP_COUNT,
  `Expected ${EXPECTED_CP_COUNT} TMW-001 canonical problems.`,
);

const metricsByQl = new Map<string, Metrics>();
const crossQlStructures = new Map<string, Set<string>>();
const samplesByQl = new Map<string, string[]>();

let generatedPackages = 0;
let deterministicReplayChecks = 0;
let nativeScriptChecks = 0;
let parityChecks = 0;
let publicationBoundaryChecks = 0;
let validationChecks = 0;
let mathJaxChecks = 0;
let structuredPromptChecks = 0;

for (const descriptor of TMW_001_QUESTION_STUDIO_QLS) {
  const ql = descriptor.qlId;
  const metrics: Metrics = {
    cpId: descriptor.checkpointId,
    difficulty: descriptor.difficulty,
    scenarioFamily: "UNKNOWN",
    prompts: new Set(),
    promptStructures: new Set(),
    answers: new Set(),
    explanationStructures: new Set(),
    numericSignatures: new Set(),
    parameterStates: new Set(),
    machineStemHits: new Set(),
    genericExplanationHits: new Set(),
    minExplanationLength: Number.POSITIVE_INFINITY,
    maxExplanationLength: 0,
  };
  metricsByQl.set(ql, metrics);

  for (let sample = 0; sample < SEEDS_PER_QL; sample += 1) {
    const seed = `TMW-001-SYSTEMATIC-AUDIT-V1:${ql}:${sample}`;
    let englishPackage: any = null;
    let englishQuestion: any = null;

    for (const language of LANGUAGES) {
      const result = await generateQuestion({
        packageId: "TMW-001",
        canonicalProblemId: descriptor.checkpointId,
        questionLanguageId: ql,
        difficulty: descriptor.difficulty,
        count: 1,
        seed,
        language,
      } as any);

      const pkg = result?.questionPackages?.[0];
      const question = result?.questions?.[0];
      const scope = `${ql}/${language}/seed-${sample}`;

      assert(pkg, `${scope}: Question Studio package missing.`);
      assert(question, `${scope}: Question Studio preview missing.`);
      assert.equal(result.questionPackages.length, 1, `${scope}: expected one package.`);
      assert.equal(result.questions.length, 1, `${scope}: expected one preview.`);
      assert.equal(pkg.packageId, "TMW-001", `${scope}: package routing drift.`);
      assert.equal(pkg.questionLanguageId, ql, `${scope}: QL routing drift.`);
      assert.equal(pkg.canonicalProblemId, descriptor.checkpointId, `${scope}: CP routing drift.`);
      assert.equal(pkg.language, language, `${scope}: package language drift.`);
      assert.equal(question.language, language, `${scope}: preview language drift.`);
      assert.equal(question.questionLanguageId, ql, `${scope}: preview QL drift.`);
      assert.equal(question.canonicalProblemId, descriptor.checkpointId, `${scope}: preview CP drift.`);
      assert.equal(pkg.difficultyBand, descriptor.difficulty, `${scope}: difficulty drift.`);

      const expectedOptions = Number(ql.slice(-3)) >= 216 && Number(ql.slice(-3)) <= 223 ? 5 : 4;
      assert.equal(pkg.options.length, expectedOptions, `${scope}: expected ${expectedOptions} options.`);
      assert.equal(new Set(pkg.options).size, expectedOptions, `${scope}: duplicate options.`);
      assert(Number.isInteger(pkg.correctIndex), `${scope}: correctIndex is not integer.`);
      assert(pkg.correctIndex >= 0 && pkg.correctIndex < expectedOptions, `${scope}: correctIndex out of range.`);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer, `${scope}: correct option does not match answer.`);
      assert.equal(question.correctIndex, pkg.correctIndex, `${scope}: preview/package correctIndex mismatch.`);

      const prompt = learnerPrompt(question);
      const explanation = String(question.explanation ?? "");
      const visible = learnerText(question);
      assert(prompt.trim().length >= 20, `${scope}: learner prompt is missing or too short.`);
      assert(explanation.trim().length >= 20, `${scope}: explanation missing or too short.`);
      assert.deepEqual(unresolvedPlaceholders(visible), [], `${scope}: unresolved learner placeholders.`);
      assert.doesNotMatch(visible, /(?:undefined|NaN|Infinity|\[object Object\])/u, `${scope}: invalid learner token.`);
      assertMathJaxIntegrity(visible, scope);
      mathJaxChecks += 1;

      assert.equal(pkg.publiclyPublishable, false, `${scope}: publication lock opened.`);
      assert.equal(question.publiclyPublishable, false, `${scope}: preview publication lock opened.`);
      publicationBoundaryChecks += 1;
      assert.equal(pkg.validation?.valid, true, `${scope}: package validation failed: ${stable(pkg.validation?.errors ?? [])}`);
      assert.equal(question.validation?.valid, true, `${scope}: preview validation failed.`);
      validationChecks += 1;

      if (language === "hi") {
        assert(/[\u0900-\u097F]/u.test(visible), `${scope}: Hindi learner text lacks Devanagari.`);
        nativeScriptChecks += 1;
      } else if (language === "pa") {
        assert(/[\u0A00-\u0A7F]/u.test(visible), `${scope}: Punjabi learner text lacks Gurmukhi.`);
        nativeScriptChecks += 1;
      }
      if (language !== "en") {
        assert.doesNotMatch(
          visible,
          /\b(?:sorters?|operators?|gardeners?|surveyors?|technicians?|loaders?|labeling machines?|looms?|CNC machines?|sealing lines?|parcels|records|sections|forms|consignments|labels|cartons|metres of fabric|sorter-days?|operator-days?|gardener-days?|surveyor-days?|technician-days?|loader-days?)\b/iu,
          `${scope}: expanded CP006 object-pool term leaked in English.`,
        );
      }

      const fingerprint = String(pkg.traceability?.mathematicalFingerprint ?? "");
      assert(fingerprint.length > 0, `${scope}: mathematical fingerprint missing.`);
      metrics.scenarioFamily = String(pkg.solveMode ?? question.taskKind ?? metrics.scenarioFamily);

      if (language === "en") {
        englishPackage = pkg;
        englishQuestion = question;
        metrics.prompts.add(prompt);
        metrics.promptStructures.add(normalizedPrompt(prompt));
        metrics.answers.add(String(pkg.answer));
        metrics.explanationStructures.add(normalizedExplanation(explanation));
        metrics.numericSignatures.add(numericSignature(prompt));
        metrics.parameterStates.add(fingerprint);
        metrics.minExplanationLength = Math.min(metrics.minExplanationLength, explanation.trim().length);
        metrics.maxExplanationLength = Math.max(metrics.maxExplanationLength, explanation.trim().length);

        for (const pattern of MACHINE_STEM_PATTERNS) {
          if (pattern.test(prompt)) metrics.machineStemHits.add(pattern.source);
        }
        for (const pattern of GENERIC_EXPLANATION_PATTERNS) {
          if (pattern.test(explanation)) metrics.genericExplanationHits.add(pattern.source);
        }
        const samples = samplesByQl.get(ql) ?? [];
        if (samples.length < 3) samples.push(prompt.replace(/\s+/gu, " ").trim());
        samplesByQl.set(ql, samples);

        const structure = normalizedPrompt(prompt);
        const qls = crossQlStructures.get(structure) ?? new Set<string>();
        qls.add(ql);
        crossQlStructures.set(structure, qls);

        if (question.representation === "TABLE" || question.representation === "CASELET") {
          assert(
            (Array.isArray(question.presentationBlocks) && question.presentationBlocks.length > 0)
              || String(question.caseletStimulus ?? "").trim().length > 0,
            `${scope}: structured representation lacks learner-visible stimulus.`,
          );
          structuredPromptChecks += 1;
        }
      } else {
        assert(englishPackage && englishQuestion, `${scope}: English parity anchor missing.`);
        assert.equal(pkg.correctIndex, englishPackage.correctIndex, `${scope}: answer-position parity drift.`);
        assert.equal(pkg.difficultyBand, englishPackage.difficultyBand, `${scope}: difficulty parity drift.`);
        assert.equal(pkg.canonicalProblemId, englishPackage.canonicalProblemId, `${scope}: CP parity drift.`);
        assert.equal(
          fingerprint,
          String(englishPackage.traceability?.mathematicalFingerprint ?? ""),
          `${scope}: mathematical-state parity drift.`,
        );
        const englishAnswer = String(englishPackage.answer);
        const localizedAnswer = String(pkg.answer);
        const englishAnswerNumbers = numericSignature(englishAnswer);
        const localizedAnswerNumbers = numericSignature(localizedAnswer);
        if (englishAnswerNumbers || localizedAnswerNumbers) {
          assert.equal(localizedAnswerNumbers, englishAnswerNumbers, `${scope}: numeric-answer parity drift.`);
        }
        if (hasPercentMarker(englishAnswer)) {
          assert.equal(
            hasPercentMarker(localizedAnswer),
            true,
            `${scope}: percentage answer lost its percent marker during localization.`,
          );
        }
        parityChecks += 5;
      }

      generatedPackages += 1;

      if (sample === 0) {
        const replay = await generateQuestion({
          packageId: "TMW-001",
          canonicalProblemId: descriptor.checkpointId,
          questionLanguageId: ql,
          difficulty: descriptor.difficulty,
          count: 1,
          seed,
          language,
        } as any);
        assert.equal(
          stable(replay?.questionPackages?.[0]),
          stable(pkg),
          `${scope}: same-seed Question Studio package is nondeterministic.`,
        );
        assert.equal(
          stable(replay?.questions?.[0]),
          stable(question),
          `${scope}: same-seed Question Studio preview is nondeterministic.`,
        );
        deterministicReplayChecks += 1;
      }
    }
  }
}

const perQl = [...metricsByQl.entries()].map(([qlId, metrics]) => ({
  qlId,
  cpId: metrics.cpId,
  difficulty: metrics.difficulty,
  scenarioFamily: metrics.scenarioFamily,
  rawPromptCount: metrics.prompts.size,
  normalizedPromptStructureCount: metrics.promptStructures.size,
  answerCount: metrics.answers.size,
  explanationStructureCount: metrics.explanationStructures.size,
  numericSignatureCount: metrics.numericSignatures.size,
  parameterStateCount: metrics.parameterStates.size,
  minExplanationLength: Number.isFinite(metrics.minExplanationLength) ? metrics.minExplanationLength : 0,
  maxExplanationLength: metrics.maxExplanationLength,
  machineStemPatterns: [...metrics.machineStemHits],
  genericExplanationPatterns: [...metrics.genericExplanationHits],
  samplePrompts: samplesByQl.get(qlId) ?? [],
}));

const lowRawPromptQls = perQl.filter((item) => item.rawPromptCount < 6);
const lowStructureQls = perQl.filter((item) => item.normalizedPromptStructureCount < 3);
const lowAnswerDiversityQls = perQl.filter((item) => item.answerCount < 6).map((item) => item.qlId);
const lowNumericSignatureQls = perQl.filter((item) => item.numericSignatureCount < 6);
const lowParameterStateQls = perQl.filter((item) => item.parameterStateCount < 6);
const thinExplanationQls = perQl.filter((item) => item.minExplanationLength < 120);
const machineStemQls = perQl.filter((item) => item.machineStemPatterns.length > 0);
const genericExplanationQls = perQl.filter((item) => item.genericExplanationPatterns.length > 0);

const crossQlStemCollisions = [...crossQlStructures.entries()]
  .filter(([, qls]) => qls.size > 1)
  .map(([structure, qls]) => ({ structure, qls: [...qls].sort() }))
  .sort((left, right) => right.qls.length - left.qls.length || left.structure.localeCompare(right.structure));

const perCp = TMW_001_QUESTION_STUDIO_CP_IDS.map((cpId) => {
  const rows = perQl.filter((item) => item.cpId === cpId);
  return {
    cpId,
    qlCount: rows.length,
    lowRawPromptQlCount: rows.filter((item) => item.rawPromptCount < 6).length,
    lowStructureQlCount: rows.filter((item) => item.normalizedPromptStructureCount < 3).length,
    lowAnswerDiversityQlCount: rows.filter((item) => item.answerCount < 6).length,
    lowNumericSignatureQlCount: rows.filter((item) => item.numericSignatureCount < 6).length,
    lowParameterStateQlCount: rows.filter((item) => item.parameterStateCount < 6).length,
    thinExplanationQlCount: rows.filter((item) => item.minExplanationLength < 120).length,
    machineStemQlCount: rows.filter((item) => item.machineStemPatterns.length > 0).length,
    genericExplanationQlCount: rows.filter((item) => item.genericExplanationPatterns.length > 0).length,
  };
});

const report = {
  version: "TMW-001-SYSTEMATIC-AUDIT-V1",
  packageId: "TMW-001",
  activeQlCount: TMW_001_QUESTION_STUDIO_QLS.length,
  checkpointCount: TMW_001_QUESTION_STUDIO_CP_IDS.length,
  languages: LANGUAGES,
  seedsPerQl: SEEDS_PER_QL,
  generatedPackages,
  deterministicReplayChecks,
  nativeScriptChecks,
  parityChecks,
  publicationBoundaryChecks,
  validationChecks,
  mathJaxChecks,
  structuredPromptChecks,
  perCp,
  lowRawPromptQls,
  lowStructureQls,
  lowAnswerDiversityQls,
  lowNumericSignatureQls,
  lowParameterStateQls,
  thinExplanationQls,
  machineStemQls,
  genericExplanationQls,
  crossQlStemCollisions,
  perQl,
};

console.log(JSON.stringify(report, null, 2));
console.log("PASS_TMW_001_SYSTEMATIC_AUDIT_V1_CORE_INTEGRITY");
