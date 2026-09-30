import assert from "node:assert/strict";

import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  generateInt001ChapterAdminQuestionStudioBatch,
  ownerOfInt001PermanentQl,
} from "./int-001-chapter-question-studio-admin-adapter-v1";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SEEDS_PER_QL = 12;
const qlIds = [...INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlIds].sort();

assert.equal(qlIds.length, 133, "INT-001 permanent QL count drifted.");
assert.equal(new Set(qlIds).size, 133, "INT-001 permanent QL ownership contains duplicates.");

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function learnerText(question: any): string {
  return [
    question.stem,
    ...(question.options ?? []),
    ...(question.explanationLines ?? []),
  ].map(String).join("\n");
}

function unresolvedPlaceholders(value: string): readonly string[] {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/gu, "")
    .replace(/\\\([\s\S]*?\\\)/gu, "");
  return [
    ...new Set(
      [...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/gu)]
        .map((match) => match[1]!),
    ),
  ];
}

function assertMathJaxIntegrity(value: string, scope: string) {
  assert.equal(
    (value.match(/\\\[/gu) ?? []).length,
    (value.match(/\\\]/gu) ?? []).length,
    scope + ": unmatched display-math brackets",
  );
  assert.equal(
    (value.match(/\\\(/gu) ?? []).length,
    (value.match(/\\\)/gu) ?? []).length,
    scope + ": unmatched inline-math delimiters",
  );
  assert.equal(
    (value.match(/\$\$/gu) ?? []).length % 2,
    0,
    scope + ": unbalanced display-math dollar delimiters",
  );
  assert.doesNotMatch(
    value,
    /\\(?:frac|times|div|cdot|sqrt|left|right)$/u,
    scope + ": dangling LaTeX command",
  );
  assert.doesNotMatch(
    value,
    /\\text\{[^}]*\$[^}]*\}/u,
    scope + ": nested unescaped dollar delimiter inside MathJax text",
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

function answerShape(value: string): string {
  return value
    .replace(/₹\s*[\d,.]+/gu, "₹#")
    .replace(/\b\d+(?:\.\d+)?%?/gu, "#")
    .replace(/[०-९੦-੯]+/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

const MACHINE_STEM_PATTERNS = [
  /\bcalculate the answer\b/iu,
  /\bfind the answer\b/iu,
  /\bdetermine the answer\b/iu,
  /\bsolve the following\b/iu,
  /\busing the information (?:above|given)\b/iu,
  /\bwhat was the result of the transaction\b/iu,
  /\bfirst calculate\b/iu,
  /\bthen find\b/iu,
  /\bafter calculating\b/iu,
] as const;

const cpQlCounts = new Map<string, number>();
const qlMetrics = new Map<string, {
  cpId: string;
  englishStems: Set<string>;
  englishStemStructures: Set<string>;
  englishAnswers: Set<string>;
  englishAnswerShapes: Set<string>;
  explanationStructures: Set<string>;
  machineStemHits: Set<string>;
  minExplanationLines: number;
  maxExplanationLines: number;
  difficultyBands: Set<string>;
}>();

const crossQlStemStructures = new Map<string, Set<string>>();
const englishStemSamples = new Map<string, string[]>();
const deterministicReplayChecks: string[] = [];
let generatedPackages = 0;
let nativeScriptChecks = 0;
let mathJaxChecks = 0;
let optionAlignmentChecks = 0;
let lifecycleChecks = 0;

for (const qlId of qlIds) {
  const cpId = ownerOfInt001PermanentQl(qlId);
  assert.ok(cpId, qlId + ": missing checkpoint owner.");
  cpQlCounts.set(cpId, (cpQlCounts.get(cpId) ?? 0) + 1);

  const metrics = {
    cpId,
    englishStems: new Set<string>(),
    englishStemStructures: new Set<string>(),
    englishAnswers: new Set<string>(),
    englishAnswerShapes: new Set<string>(),
    explanationStructures: new Set<string>(),
    machineStemHits: new Set<string>(),
    minExplanationLines: Number.POSITIVE_INFINITY,
    maxExplanationLines: 0,
    difficultyBands: new Set<string>(),
  };
  qlMetrics.set(qlId, metrics);

  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = "INT-001-SYSTEMATIC-AUDIT-V1:" + qlId + ":" + index;
    let english: any = null;

    for (const language of LANGUAGES) {
      const first = await generateInt001ChapterAdminQuestionStudioBatch({
        qlId,
        language,
        seed,
        count: 1,
      });
      assert.equal(first.questions.length, 1, qlId + "/" + language + ": expected one question.");
      const question: any = first.questions[0];
      generatedPackages += 1;

      assert.equal(question.packageId, "INT-001", qlId + "/" + language + ": package drift.");
      assert.equal(question.qlId, qlId, qlId + "/" + language + ": qlId drift.");
      assert.equal(question.permanentQlId, qlId, qlId + "/" + language + ": permanent QL drift.");
      assert.equal(question.checkpointId, cpId, qlId + "/" + language + ": checkpoint ownership drift.");
      assert.equal(question.language, language, qlId + "/" + language + ": language drift.");
      assert.equal(question.questionLanguageId, qlId + ":" + language, qlId + "/" + language + ": question-language identity drift.");
      assert.equal(question.options.length, 4, qlId + "/" + language + ": expected four options.");
      assert.equal(new Set(question.options).size, 4, qlId + "/" + language + ": duplicate options.");
      assert.ok(Number.isInteger(question.correctIndex), qlId + "/" + language + ": invalid correct index.");
      assert.equal(question.options[question.correctIndex], question.answer, qlId + "/" + language + ": answer/index mismatch.");
      optionAlignmentChecks += 1;

      assert.equal(question.questionBankWritable, false, qlId + "/" + language + ": question-bank write opened.");
      assert.equal(question.testEligible, false, qlId + "/" + language + ": test eligibility opened.");
      assert.equal(question.mockTestEligible, false, qlId + "/" + language + ": mock eligibility opened.");
      assert.equal(question.publiclyPublishable, false, qlId + "/" + language + ": publication opened.");
      lifecycleChecks += 4;

      const text = learnerText(question);
      assert.equal(
        unresolvedPlaceholders(text).length,
        0,
        qlId + "/" + language + ": unresolved learner placeholders: " + unresolvedPlaceholders(text).join(", "),
      );
      assert.doesNotMatch(text, /\b(?:undefined|NaN|Infinity|\[object Object\])\b/u, qlId + "/" + language + ": invalid learner token.");
      assertMathJaxIntegrity(text, qlId + "/" + language);
      mathJaxChecks += 1;

      assert.ok(String(question.stem).trim().length >= 18, qlId + "/" + language + ": stem is too thin.");
      assert.ok((question.explanationLines ?? []).length > 0, qlId + "/" + language + ": explanation missing.");

      if (language === "hi") {
        assert.match(
          String(question.stem) + "\n" + question.explanationLines.join("\n"),
          /[\u0900-\u097F]/u,
          qlId + "/hi: Hindi script missing from learner surface.",
        );
        nativeScriptChecks += 1;
      } else if (language === "pa") {
        assert.match(
          String(question.stem) + "\n" + question.explanationLines.join("\n"),
          /[\u0A00-\u0A7F]/u,
          qlId + "/pa: Punjabi script missing from learner surface.",
        );
        nativeScriptChecks += 1;
      }

      if (language === "en") {
        english = question;
        metrics.englishStems.add(question.stem);
        const structure = normalizedStem(question.stem);
        metrics.englishStemStructures.add(structure);
        metrics.englishAnswers.add(String(question.answer));
        metrics.englishAnswerShapes.add(answerShape(String(question.answer)));
        metrics.explanationStructures.add(normalizedExplanation(question.explanationLines.join(" ")));
        metrics.minExplanationLines = Math.min(metrics.minExplanationLines, question.explanationLines.length);
        metrics.maxExplanationLines = Math.max(metrics.maxExplanationLines, question.explanationLines.length);
        metrics.difficultyBands.add(String(question.difficultyBand));

        for (const pattern of MACHINE_STEM_PATTERNS) {
          if (pattern.test(question.stem)) metrics.machineStemHits.add(pattern.source);
        }

        const owners = crossQlStemStructures.get(structure) ?? new Set<string>();
        owners.add(qlId);
        crossQlStemStructures.set(structure, owners);

        const samples = englishStemSamples.get(qlId) ?? [];
        if (!samples.includes(question.stem) && samples.length < 3) samples.push(question.stem);
        englishStemSamples.set(qlId, samples);
      } else {
        assert.ok(english, qlId + "/" + language + ": English comparison surface missing.");
        assert.equal(question.correctIndex, english.correctIndex, qlId + "/" + language + ": localized correct index drift.");
        assert.equal(question.difficultyBand, english.difficultyBand, qlId + "/" + language + ": localized difficulty drift.");
      }

      if (index === 0) {
        const replay = await generateInt001ChapterAdminQuestionStudioBatch({
          qlId,
          language,
          seed,
          count: 1,
        });
        assert.equal(
          stable(replay.questions[0]),
          stable(question),
          qlId + "/" + language + ": same-seed generation is nondeterministic.",
        );
        deterministicReplayChecks.push(qlId + ":" + language);
      }
    }
  }
}

const perQl = [...qlMetrics.entries()].map(([qlId, metrics]) => ({
  qlId,
  cpId: metrics.cpId,
  rawStemCount: metrics.englishStems.size,
  normalizedStemStructureCount: metrics.englishStemStructures.size,
  answerCount: metrics.englishAnswers.size,
  answerShapeCount: metrics.englishAnswerShapes.size,
  explanationStructureCount: metrics.explanationStructures.size,
  difficultyBands: [...metrics.difficultyBands].sort(),
  minExplanationLines: Number.isFinite(metrics.minExplanationLines) ? metrics.minExplanationLines : 0,
  maxExplanationLines: metrics.maxExplanationLines,
  machineStemPatterns: [...metrics.machineStemHits].sort(),
  sampleStems: englishStemSamples.get(qlId) ?? [],
}));

const singleStructureQls = perQl.filter((item) => item.normalizedStemStructureCount <= 1);
const lowStructureQls = perQl.filter((item) => item.normalizedStemStructureCount < 3);
const lowRawStemQls = perQl.filter((item) => item.rawStemCount < Math.min(6, SEEDS_PER_QL));
const lowAnswerDiversityQls = perQl.filter((item) => item.answerCount < 4);
const thinExplanationQls = perQl.filter((item) => item.minExplanationLines < 3);
const machineStemQls = perQl.filter((item) => item.machineStemPatterns.length > 0);

const crossQlCollisions = [...crossQlStemStructures.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([structure, owners]) => ({
    structure,
    qlIds: [...owners].sort(),
  }))
  .sort((left, right) => right.qlIds.length - left.qlIds.length || left.structure.localeCompare(right.structure));

const perCp = [...cpQlCounts.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([cpId, qlCount]) => {
    const rows = perQl.filter((item) => item.cpId === cpId);
    return {
      cpId,
      qlCount,
      singleStructureQlCount: rows.filter((item) => item.normalizedStemStructureCount <= 1).length,
      lowStructureQlCount: rows.filter((item) => item.normalizedStemStructureCount < 3).length,
      lowRawStemQlCount: rows.filter((item) => item.rawStemCount < Math.min(6, SEEDS_PER_QL)).length,
      lowAnswerDiversityQlCount: rows.filter((item) => item.answerCount < 4).length,
      thinExplanationQlCount: rows.filter((item) => item.minExplanationLines < 3).length,
      machineStemQlCount: rows.filter((item) => item.machineStemPatterns.length > 0).length,
    };
  });

const summary = {
  version: "INT-001-SYSTEMATIC-AUDIT-V1",
  packageId: "INT-001",
  permanentQlCount: qlIds.length,
  checkpointCount: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.checkpointCount,
  languages: LANGUAGES,
  seedsPerQl: SEEDS_PER_QL,
  generatedPackages,
  deterministicReplayChecks: deterministicReplayChecks.length,
  nativeScriptChecks,
  mathJaxChecks,
  optionAlignmentChecks,
  lifecycleChecks,
  cpQlCounts: Object.fromEntries([...cpQlCounts.entries()].sort(([a], [b]) => a.localeCompare(b))),
  perCp,
  diagnostics: {
    singleStructureQlCount: singleStructureQls.length,
    lowStructureQlCount: lowStructureQls.length,
    lowRawStemQlCount: lowRawStemQls.length,
    lowAnswerDiversityQlCount: lowAnswerDiversityQls.length,
    thinExplanationQlCount: thinExplanationQls.length,
    machineStemQlCount: machineStemQls.length,
    crossQlStemCollisionCount: crossQlCollisions.length,
  },
  singleStructureQls: singleStructureQls.map((item) => item.qlId),
  lowStructureQls: lowStructureQls.map((item) => item.qlId),
  lowRawStemQls: lowRawStemQls.map((item) => item.qlId),
  lowAnswerDiversityQls: lowAnswerDiversityQls.map((item) => item.qlId),
  thinExplanationQls: thinExplanationQls.map((item) => item.qlId),
  machineStemQls: machineStemQls.map((item) => ({
    qlId: item.qlId,
    patterns: item.machineStemPatterns,
    samples: item.sampleStems,
  })),
  crossQlStemCollisions: crossQlCollisions.slice(0, 100),
  perQl,
};

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_001_SYSTEMATIC_AUDIT_V1_CORE_INTEGRITY");
