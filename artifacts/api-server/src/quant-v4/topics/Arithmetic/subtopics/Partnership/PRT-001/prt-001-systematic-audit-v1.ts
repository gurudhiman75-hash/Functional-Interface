import assert from "node:assert/strict";

import { generateQuestion } from "../../../../../generation-engine";
import { getPrt001TaskEntries } from "./foundation/library";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SEEDS_PER_QL = 12;
const EXPECTED_QL_COUNT = 112;
const EXPECTED_CP_COUNT = 7;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function learnerText(question: any): string {
  return [question.text, ...(question.options ?? []), question.explanation]
    .map(String)
    .join("\n");
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
  const tokens =
    value.match(
      /₹\s*[\d,]+(?:\.\d+)?|\\frac\{\d+\}\{\d+\}|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\b/gu,
    ) ?? [];
  return tokens
    .map((token) => token.replace(/\s+/gu, "").replace(/,/gu, ""))
    .join("|");
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
] as const;

type Metrics = {
  cpId: string;
  difficulty: string;
  scenarioFamily: string;
  stems: Set<string>;
  stemStructures: Set<string>;
  answers: Set<string>;
  explanationStructures: Set<string>;
  numericSignatures: Set<string>;
  parameterStates: Set<string>;
  machineStemHits: Set<string>;
  minExplanationLength: number;
  maxExplanationLength: number;
};

const taskEntries = getPrt001TaskEntries();
assert.equal(
  taskEntries.length,
  EXPECTED_QL_COUNT,
  `Expected ${EXPECTED_QL_COUNT} active PRT-001 QLs, received ${taskEntries.length}.`,
);
assert.equal(
  new Set(taskEntries.map(({ entry }) => entry.cpId)).size,
  EXPECTED_CP_COUNT,
  `Expected ${EXPECTED_CP_COUNT} PRT-001 canonical problems.`,
);

const metricsByQl = new Map<string, Metrics>();
const crossQlStructures = new Map<string, Set<string>>();
const samplesByQl = new Map<string, string[]>();

let generatedPackages = 0;
let deterministicReplayChecks = 0;
let nativeScriptChecks = 0;
let parityChecks = 0;
let publicationBoundaryChecks = 0;
let mathJaxChecks = 0;
let validationChecks = 0;

for (const { questionLanguageId: ql, entry } of taskEntries) {
  const metrics: Metrics = {
    cpId: entry.cpId,
    difficulty: entry.difficulty,
    scenarioFamily: entry.scenarioFamily,
    stems: new Set(),
    stemStructures: new Set(),
    answers: new Set(),
    explanationStructures: new Set(),
    numericSignatures: new Set(),
    parameterStates: new Set(),
    machineStemHits: new Set(),
    minExplanationLength: Number.POSITIVE_INFINITY,
    maxExplanationLength: 0,
  };
  metricsByQl.set(ql, metrics);

  for (let sample = 0; sample < SEEDS_PER_QL; sample += 1) {
    const seed = `PRT-001-SYSTEMATIC-AUDIT-V1:${ql}:${sample}`;
    let english: any = null;

    for (const language of LANGUAGES) {
      const result = await generateQuestion({
        packageId: "PRT-001",
        canonicalProblemId: entry.cpId,
        questionLanguageId: ql,
        count: 1,
        seed,
        language,
      } as any);

      assert.equal(
        result.questions?.length,
        1,
        `${ql}/${language}: expected one Question Studio question.`,
      );
      assert.equal(
        result.questionPackages?.length,
        1,
        `${ql}/${language}: expected one runtime package.`,
      );

      const question = result.questions[0] as any;
      const pkg = result.questionPackages[0] as any;
      generatedPackages += 1;

      assert.equal(question.packageId, "PRT-001", `${ql}/${language}: package drift.`);
      assert.equal(question.questionLanguageId, ql, `${ql}/${language}: QL drift.`);
      assert.equal(
        question.canonicalProblemId,
        entry.cpId,
        `${ql}/${language}: CP routing drift.`,
      );
      assert.equal(question.language, language, `${ql}/${language}: language drift.`);
      assert.ok(
        Array.isArray(question.options) && question.options.length === 4,
        `${ql}/${language}: expected four options.`,
      );
      assert.equal(
        new Set(question.options).size,
        4,
        `${ql}/${language}: duplicate options.`,
      );
      assert.ok(
        Number.isInteger(question.correctIndex) &&
          question.correctIndex >= 0 &&
          question.correctIndex < 4,
        `${ql}/${language}: invalid correct index.`,
      );
      assert.equal(
        question.options[question.correctIndex],
        question.answer,
        `${ql}/${language}: answer/index mismatch.`,
      );
      assert.ok(
        String(question.text ?? "").trim().length >= 18,
        `${ql}/${language}: thin stem.`,
      );
      assert.ok(
        String(question.explanation ?? "").trim().length >= 30,
        `${ql}/${language}: thin explanation.`,
      );

      assert.equal(pkg.publiclyPublishable, false, `${ql}/${language}: publication boundary opened.`);
      publicationBoundaryChecks += 1;
      assert.equal(pkg.validation?.valid, true, `${ql}/${language}: runtime validation failed.`);
      validationChecks += 1;

      const surface = learnerText(question);
      const placeholders = unresolvedPlaceholders(surface);
      assert.equal(
        placeholders.length,
        0,
        `${ql}/${language}: unresolved placeholders: ${placeholders.join(", ")}`,
      );
      assert.doesNotMatch(
        surface,
        /\b(?:undefined|NaN|Infinity|\[object Object\])\b/u,
        `${ql}/${language}: invalid learner token.`,
      );
      assertMathJaxIntegrity(surface, `${ql}/${language}`);
      mathJaxChecks += 1;

      if (language === "hi") {
        assert.match(
          String(question.text) + "\n" + String(question.explanation),
          /[\u0900-\u097F]/u,
          `${ql}/hi: Hindi script missing.`,
        );
        nativeScriptChecks += 1;
      }
      if (language === "pa") {
        assert.match(
          String(question.text) + "\n" + String(question.explanation),
          /[\u0A00-\u0A7F]/u,
          `${ql}/pa: Punjabi script missing.`,
        );
        nativeScriptChecks += 1;
      }

      if (language === "en") {
        english = question;
        metrics.stems.add(String(question.text));
        const structure = normalizedStem(String(question.text));
        metrics.stemStructures.add(structure);
        metrics.answers.add(String(question.answer));
        metrics.explanationStructures.add(
          normalizedExplanation(String(question.explanation)),
        );
        metrics.numericSignatures.add(numericSignature(String(question.text)));
        metrics.parameterStates.add(stable(pkg.parameters ?? {}));
        metrics.minExplanationLength = Math.min(
          metrics.minExplanationLength,
          String(question.explanation).length,
        );
        metrics.maxExplanationLength = Math.max(
          metrics.maxExplanationLength,
          String(question.explanation).length,
        );
        for (const pattern of MACHINE_STEM_PATTERNS) {
          if (pattern.test(String(question.text))) metrics.machineStemHits.add(pattern.source);
        }

        const owners = crossQlStructures.get(structure) ?? new Set<string>();
        owners.add(ql);
        crossQlStructures.set(structure, owners);

        const samples = samplesByQl.get(ql) ?? [];
        if (!samples.includes(String(question.text)) && samples.length < 3) {
          samples.push(String(question.text));
        }
        samplesByQl.set(ql, samples);
      } else {
        assert.ok(english, `${ql}/${language}: English parity surface missing.`);
        assert.equal(
          question.correctIndex,
          english.correctIndex,
          `${ql}/${language}: answer-position parity drift.`,
        );
        assert.equal(
          question.difficulty,
          english.difficulty,
          `${ql}/${language}: difficulty parity drift.`,
        );
        assert.equal(
          numericSignature(String(question.answer)),
          numericSignature(String(english.answer)),
          `${ql}/${language}: answer numeric parity drift.`,
        );
        parityChecks += 3;
      }

      if (sample === 0) {
        const replay = await generateQuestion({
          packageId: "PRT-001",
          canonicalProblemId: entry.cpId,
          questionLanguageId: ql,
          count: 1,
          seed,
          language,
        } as any);
        assert.equal(
          stable(replay.questions?.[0]),
          stable(question),
          `${ql}/${language}: same-seed Question Studio output is nondeterministic.`,
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
  rawStemCount: metrics.stems.size,
  normalizedStemStructureCount: metrics.stemStructures.size,
  answerCount: metrics.answers.size,
  explanationStructureCount: metrics.explanationStructures.size,
  numericSignatureCount: metrics.numericSignatures.size,
  parameterStateCount: metrics.parameterStates.size,
  minExplanationLength: Number.isFinite(metrics.minExplanationLength)
    ? metrics.minExplanationLength
    : 0,
  maxExplanationLength: metrics.maxExplanationLength,
  machineStemPatterns: [...metrics.machineStemHits],
  sampleStems: samplesByQl.get(qlId) ?? [],
}));

const lowRawStemQls = perQl.filter((item) => item.rawStemCount < 6);
const lowStructureQls = perQl.filter(
  (item) => item.normalizedStemStructureCount < 3,
);
const lowAnswerDiversityQls = perQl.filter((item) => item.answerCount < 6);
const lowNumericSignatureQls = perQl.filter(
  (item) => item.numericSignatureCount < 6,
);
const lowParameterStateQls = perQl.filter((item) => item.parameterStateCount < 6);
const thinExplanationQls = perQl.filter(
  (item) => item.minExplanationLength < 120,
);
const machineStemQls = perQl.filter(
  (item) => item.machineStemPatterns.length > 0,
);
const crossQlStemCollisions = [...crossQlStructures.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([structure, owners]) => ({
    structure,
    qlIds: [...owners].sort(),
  }));

const cpIds = [...new Set(taskEntries.map(({ entry }) => entry.cpId))].sort();
const perCp = cpIds.map((cpId) => {
  const rows = perQl.filter((item) => item.cpId === cpId);
  return {
    cpId,
    qlCount: rows.length,
    lowRawStemQlCount: rows.filter((item) => item.rawStemCount < 6).length,
    lowStructureQlCount: rows.filter(
      (item) => item.normalizedStemStructureCount < 3,
    ).length,
    lowAnswerDiversityQlCount: rows.filter((item) => item.answerCount < 6).length,
    lowNumericSignatureQlCount: rows.filter(
      (item) => item.numericSignatureCount < 6,
    ).length,
    lowParameterStateQlCount: rows.filter(
      (item) => item.parameterStateCount < 6,
    ).length,
    thinExplanationQlCount: rows.filter(
      (item) => item.minExplanationLength < 120,
    ).length,
    machineStemQlCount: rows.filter(
      (item) => item.machineStemPatterns.length > 0,
    ).length,
  };
});

const cp001LowAnswerDiversityQls = lowAnswerDiversityQls.filter(
  (item) => item.cpId === "PRT-CP-001",
);
assert.equal(
  cp001LowAnswerDiversityQls.length,
  0,
  `PRT-CP-001 answer diversity remains below 6 distinct answers for: ${cp001LowAnswerDiversityQls
    .map((item) => item.qlId)
    .join(", ")}`,
);

const cp002LowAnswerDiversityQls = lowAnswerDiversityQls.filter(
  (item) => item.cpId === "PRT-CP-002",
);
assert.equal(
  cp002LowAnswerDiversityQls.length,
  0,
  `PRT-CP-002 answer diversity remains below 6 distinct answers for: ${cp002LowAnswerDiversityQls
    .map((item) => item.qlId)
    .join(", ")}`,
);

const cp003LowAnswerDiversityQls = lowAnswerDiversityQls.filter(
  (item) => item.cpId === "PRT-CP-003",
);
assert.equal(
  cp003LowAnswerDiversityQls.length,
  0,
  `PRT-CP-003 answer diversity remains below 6 distinct answers for: ${cp003LowAnswerDiversityQls
    .map((item) => item.qlId)
    .join(", ")}`,
);

const cp004LowAnswerDiversityQls = lowAnswerDiversityQls.filter(
  (item) => item.cpId === "PRT-CP-004",
);
assert.equal(
  cp004LowAnswerDiversityQls.length,
  0,
  `PRT-CP-004 answer diversity remains below 6 distinct answers for: ${cp004LowAnswerDiversityQls
    .map((item) => item.qlId)
    .join(", ")}`,
);

const cp005LowAnswerDiversityQls = lowAnswerDiversityQls.filter(
  (item) => item.cpId === "PRT-CP-005",
);
assert.equal(
  cp005LowAnswerDiversityQls.length,
  0,
  `PRT-CP-005 answer diversity remains below 6 distinct answers for: ${cp005LowAnswerDiversityQls
    .map((item) => item.qlId)
    .join(", ")}`,
);

console.log(
  JSON.stringify(
    {
      version: "PRT-001-SYSTEMATIC-AUDIT-V1",
      packageId: "PRT-001",
      activeQlCount: taskEntries.length,
      checkpointCount: cpIds.length,
      languages: LANGUAGES,
      seedsPerQl: SEEDS_PER_QL,
      generatedPackages,
      deterministicReplayChecks,
      nativeScriptChecks,
      parityChecks,
      publicationBoundaryChecks,
      validationChecks,
      mathJaxChecks,
      perCp,
      lowRawStemQls,
      lowStructureQls,
      lowAnswerDiversityQls: lowAnswerDiversityQls.map((item) => item.qlId),
      lowNumericSignatureQls,
      lowParameterStateQls,
      thinExplanationQls: thinExplanationQls.map((item) => item.qlId),
      machineStemQls: machineStemQls.map((item) => item.qlId),
      crossQlStemCollisions,
      perQl,
    },
    null,
    2,
  ),
);

console.log("PASS_PRT_001_SYSTEMATIC_AUDIT_V1_CORE_INTEGRITY");
