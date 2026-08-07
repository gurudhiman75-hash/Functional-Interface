import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS,
  MAL_CP004_WAVE03_EQUIVALENCE_MATRIX,
} from "./foundation/cp004-equivalence-authority-wave03";
import {
  generateMalCp004Wave04Question,
  malCp004Wave04Stable,
  verifyMalCp004Wave04Question,
} from "./foundation/cp004-unified-runtime-wave04";
import {
  MAL_CP004_WAVE04_RUNTIME_ID,
  type MalCp004Wave04Question,
  type MalCp004Wave04RepresentationVariant,
} from "./foundation/cp004-unified-runtime-wave04-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length === 10,
  "Wave 04 must expose all ten equivalence-closed contracts.",
);
assert(
  MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.length === 20,
  "Wave 03 authority matrix changed before Wave 04.",
);

const seedsPerContract = 200;
let generatedCount = 0;
let deterministicCount = 0;
let independentlyVerifiedCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const fingerprints = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const sourceEvidenceIds = new Set<string>();
const misconceptionIds = new Set<string>();
const sourceMatchCounts = new Map<string, number>();
const contractFingerprints = new Map<string, Set<string>>();
const contractStems = new Map<string, Set<string>>();
const contractAnswers = new Map<string, Set<string>>();
const variantsByContract = new Map<string, Map<string, number>>();
const reviewRows: MalCp004Wave04Question[] = [];

for (const effectiveContractId of MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS) {
  const localFingerprints = new Set<string>();
  const localStems = new Set<string>();
  const localAnswers = new Set<string>();
  const localVariants = new Map<string, number>();
  contractFingerprints.set(effectiveContractId, localFingerprints);
  contractStems.set(effectiveContractId, localStems);
  contractAnswers.set(effectiveContractId, localAnswers);
  variantsByContract.set(effectiveContractId, localVariants);

  for (let index = 0; index < seedsPerContract; index += 1) {
    const seed = `cp004-wave04:${effectiveContractId}:${index}`;
    const first = generateMalCp004Wave04Question(effectiveContractId, seed);
    const second = generateMalCp004Wave04Question(effectiveContractId, seed);

    assert(
      malCp004Wave04Stable(first) === malCp004Wave04Stable(second),
      `${effectiveContractId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;
    assert(
      first.validation.ok,
      `${effectiveContractId}/${seed}: ${first.validation.errors.join("; ")}`,
    );
    const independent = verifyMalCp004Wave04Question(first);
    assert(
      independent.ok,
      `${effectiveContractId}/${seed}: ${independent.errors.join("; ")}`,
    );
    independentlyVerifiedCount += 1;

    assert(first.archetypeId === "MAL-001", "Wrong archetype identity.");
    assert(first.canonicalProblemId === "MAL-CP-004", "Wrong CP identity.");
    assert(first.runtimeId === MAL_CP004_WAVE04_RUNTIME_ID, "Wrong runtime identity.");
    assert(
      first.effectiveContractId === effectiveContractId,
      "Runtime returned a different effective contract.",
    );
    assert(first.permanentQlId === null, "Permanent QL leaked into Wave 04.");
    assert(first.language === "en", "Non-English output escaped.");
    assert(
      first.maturity === "SOURCE_BACKED_UNIFIED_DISCOVERY",
      "Wave 04 maturity changed.",
    );
    assert(
      first.allocationStatus === "UNALLOCATED_OPEN_DISCOVERY",
      "Wave 04 allocation status changed.",
    );
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A Wave 04 product flag became enabled.",
    );
    assert(first.sourceEvidenceIds.length >= 1, "Source evidence is missing.");
    assert(first.stem.endsWith("?"), "Stem is not interrogative.");
    assert(first.options.length === 4, "Question does not have four options.");
    assert(new Set(first.options).size === 4, "Options are not unique.");
    assert(
      first.options[first.correctIndex] === first.answer,
      "Correct option does not match the answer.",
    );
    assert(
      first.optionAudit.filter((option) => option.isCorrect).length === 1,
      "Option audit does not contain exactly one correct option.",
    );
    assert(
      new Set(first.optionAudit.map((option) => option.misconceptionId)).size === 4,
      "Option misconception authorities are not distinct.",
    );
    assert(first.ledger.rows.length >= 1, "Conservation table is empty.");
    assert(
      first.explanation.calculation.length >= 2,
      "Explanation calculation is too shallow.",
    );
    assert(
      first.explanation.conclusion.includes(first.answer),
      "Conclusion omits the canonical answer.",
    );
    assert(
      first.answerValue.denominator <= 125n,
      `Answer denominator is not exam-friendly: ${first.answer}.`,
    );
    assert(
      !/competitive-exam|homogeneous sample|stage strip|alligation|unique integer exponent/iu.test(
        JSON.stringify({
          stem: first.stem,
          explanation: first.explanation,
          ledger: first.ledger,
        }),
      ),
      "Learner output contains artificial or unrelated language.",
    );
    assert(
      !first.optionAudit.some((option) =>
        /ARITHMETIC_SLIP|PLAUSIBLE|PLUS_MINUS_ONE/iu.test(
          option.misconceptionId,
        ),
      ),
      "A generic distractor authority entered Wave 04.",
    );

    first.sourceEvidenceIds.forEach((sourceId) => sourceEvidenceIds.add(sourceId));
    first.optionAudit.forEach((option) =>
      misconceptionIds.add(option.misconceptionId),
    );
    sourceMatchCounts.set(
      first.sourceMatchKind,
      (sourceMatchCounts.get(first.sourceMatchKind) ?? 0) + 1,
    );
    localVariants.set(
      first.representationVariant,
      (localVariants.get(first.representationVariant) ?? 0) + 1,
    );
    localFingerprints.add(first.mathematicalFingerprint);
    localStems.add(first.stem);
    localAnswers.add(first.answer);
    fingerprints.add(first.mathematicalFingerprint);
    stems.add(first.stem);
    answers.add(first.answer);
    answerPositionCounts[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 5) reviewRows.push(first);
  }
}

assert(generatedCount === 2000, `Expected 2,000 packages, received ${generatedCount}.`);
assert(deterministicCount === 2000, "Determinism count does not match.");
assert(
  independentlyVerifiedCount === 2000,
  "Independent verification count does not match.",
);
assert(reviewRows.length === 50, "Expected fifty review rows.");
assert(
  [...contractFingerprints.values()].every((set) => set.size >= 8),
  `A contract has insufficient exact-state diversity: ${JSON.stringify(
    Object.fromEntries(
      [...contractFingerprints].map(([key, value]) => [key, value.size]),
    ),
  )}`,
);
assert(
  [...contractStems.values()].every((set) => set.size >= 40),
  `A contract has insufficient stem diversity: ${JSON.stringify(
    Object.fromEntries(
      [...contractStems].map(([key, value]) => [key, value.size]),
    ),
  )}`,
);
assert(
  [...contractAnswers.values()].every((set) => set.size >= 5),
  `A contract has insufficient answer diversity: ${JSON.stringify(
    Object.fromEntries(
      [...contractAnswers].map(([key, value]) => [key, value.size]),
    ),
  )}`,
);
assert(
  fingerprints.size >= 110,
  `Chapter-wide mathematical diversity is too low: ${fingerprints.size}.`,
);
assert(stems.size >= 700, `Chapter-wide stem diversity is too low: ${stems.size}.`);
assert(answers.size >= 45, `Chapter-wide answer diversity is too low: ${answers.size}.`);
assert(
  answerPositionCounts.every((count) => count >= 400),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);
assert(sourceEvidenceIds.size >= 15, "Source-evidence diversity is too low.");
assert(misconceptionIds.size >= 30, "Misconception authority pool is too small.");
assert(
  (sourceMatchCounts.get("DIRECT_TASK_MATCH") ?? 0) > 0 &&
    (sourceMatchCounts.get("FORMULA_EQUIVALENT_DIRECTION") ?? 0) > 0 &&
    (sourceMatchCounts.get("INTERNAL_COLLISION_AUTHORITY") ?? 0) > 0,
  "Wave 04 does not represent all source-match classes.",
);

const expectedVariantCounts: Readonly<
  Partial<Record<(typeof MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS)[number], number>>
> = {
  "MAL-CP004-EFF-COMPONENT-AMOUNT": 2,
  "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE": 2,
  "MAL-CP004-EFF-EVAPORATION-TARGET": 2,
  "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE": 2,
  "MAL-CP004-EFF-MOISTURE-FORWARD": 2,
};
for (const [contractId, expectedCount] of Object.entries(expectedVariantCounts)) {
  const variants = variantsByContract.get(contractId)!;
  assert(
    variants.size === expectedCount,
    `${contractId}: expected ${expectedCount} variants, received ${variants.size}.`,
  );
  assert(
    [...variants.values()].every((count) => count >= 70),
    `${contractId}: representation variants are imbalanced: ${JSON.stringify(
      Object.fromEntries(variants),
    )}`,
  );
}

const expectedVariants = new Set<MalCp004Wave04RepresentationVariant>([
  "TRACKED_COMPONENT_AMOUNT",
  "OTHER_COMPONENT_AMOUNT",
  "TRACKED_COMPONENT_PERCENT",
  "TOTAL_FROM_TRACKED_COMPONENT",
  "TOTAL_FROM_OTHER_COMPONENT",
  "SOLVENT_ADDED",
  "PURE_SOLUTE_ADDED",
  "EVAPORATED_AMOUNT",
  "FINAL_TOTAL_AFTER_EVAPORATION",
  "FINAL_CONCENTRATION_AFTER_SOLVENT_ADDITION",
  "FINAL_CONCENTRATION_AFTER_SOLVENT_EVAPORATION",
  "INITIAL_TOTAL_BEFORE_EVAPORATION",
  "FINAL_MASS",
  "MOISTURE_LOST",
  "INITIAL_MASS",
]);
const observedVariants = new Set(
  reviewRows.length > 0
    ? [...variantsByContract.values()].flatMap((variants) => [
        ...variants.keys(),
      ])
    : [],
);
assert(
  expectedVariants.size === observedVariants.size &&
    [...expectedVariants].every((variant) => observedVariants.has(variant)),
  `Representation coverage is incomplete: ${JSON.stringify([
    ...observedVariants,
  ])}.`,
);

const mixedQuestions = Array.from({ length: 100 }, (_value, index) => {
  const contractId =
    MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS[
      index % MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length
    ]!;
  return generateMalCp004Wave04Question(
    contractId,
    `cp004-wave04-mixed:${index}`,
  );
});
const openingCounts = new Map<string, number>();
const distractorPatternCounts = new Map<string, number>();
for (const question of mixedQuestions) {
  const opening = question.stem
    .split(/[.,?]/u)[0]!
    .toLowerCase()
    .replace(/\d+(?:\s+\d+\/\d+)?/gu, "#")
    .replace(/\b(?:acid|water|sugar|salt|alcohol|chemical a|fruit concentrate|syrup concentrate|liquid a|liquid b)\b/gu, "liquid");
  openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);
  const pattern = question.optionAudit
    .map((option) => option.misconceptionId)
    .join("|");
  distractorPatternCounts.set(
    pattern,
    (distractorPatternCounts.get(pattern) ?? 0) + 1,
  );
}
assert(
  Math.max(...openingCounts.values()) <= 12,
  `One opening pattern exceeds 12% in the mixed set: ${JSON.stringify(
    Object.fromEntries(openingCounts),
  )}`,
);
assert(
  Math.max(...distractorPatternCounts.values()) <= 10,
  `One distractor pattern exceeds 10% in the mixed set: ${JSON.stringify(
    Object.fromEntries(distractorPatternCounts),
  )}`,
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp004-wave04-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp004-wave04-review.md");

const contractSummary = Object.fromEntries(
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.map((contractId) => [
    contractId,
    {
      exactStateCount: contractFingerprints.get(contractId)!.size,
      stemCount: contractStems.get(contractId)!.size,
      answerCount: contractAnswers.get(contractId)!.size,
      variants: Object.fromEntries(variantsByContract.get(contractId)!),
      authorities: MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
        (entry) => entry.effectiveContractId === contractId,
      ).map((entry) => entry.authorityId),
    },
  ]),
);

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE04_SOURCE_BACKED_UNIFIED_RUNTIME",
      runtimeId: MAL_CP004_WAVE04_RUNTIME_ID,
      effectiveContractCount:
        MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length,
      generatedCount,
      deterministicCount,
      independentlyVerifiedCount,
      distinctFingerprintCount: fingerprints.size,
      distinctStemCount: stems.size,
      distinctAnswerCount: answers.size,
      sourceEvidenceIdCount: sourceEvidenceIds.size,
      misconceptionIdCount: misconceptionIds.size,
      answerPositionCounts,
      sourceMatchCounts: Object.fromEntries(sourceMatchCounts),
      mixedOpeningPatternCount: openingCounts.size,
      mixedDistractorPatternCount: distractorPatternCounts.size,
      permanentQlCount: 0,
      productFlagsEnabled: false,
      contractSummary,
      reviewRows,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-004 Wave 04 — Source-Backed Unified Runtime Review",
  "",
  `Effective contracts: **${MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length}**`,
  `Generated questions: **${generatedCount}**`,
  `Independent exact verifications: **${independentlyVerifiedCount}**`,
  `Review rows: **${reviewRows.length}**`,
  `Representation variants: **${observedVariants.size}**`,
  "Permanent QLs: **0**",
  "",
];
for (const question of reviewRows) {
  markdown.push(
    `## ${question.effectiveContractId} — ${question.representationVariant}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) =>
        `${String.fromCharCode(65 + index)}. ${option}${
          index === question.correctIndex ? " **✓**" : ""
        }`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Concept:** ${question.explanation.concept}`,
    "",
    ...question.explanation.calculation.map((step) => `- ${step}`),
    "",
    `**Check:** ${question.explanation.verification}`,
    "",
    `**Common mistake:** ${question.explanation.commonMistake}`,
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE04_SOURCE_BACKED_UNIFIED_RUNTIME",
      runtimeId: MAL_CP004_WAVE04_RUNTIME_ID,
      effectiveContractCount:
        MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length,
      generatedCount,
      deterministicCount,
      independentlyVerifiedCount,
      distinctFingerprintCount: fingerprints.size,
      distinctStemCount: stems.size,
      distinctAnswerCount: answers.size,
      sourceEvidenceIdCount: sourceEvidenceIds.size,
      misconceptionIdCount: misconceptionIds.size,
      answerPositionCounts,
      reviewRowCount: reviewRows.length,
      representationVariantCount: observedVariants.size,
      permanentQlCount: 0,
      productFlagsEnabled: false,
    },
    null,
    2,
  ),
);
