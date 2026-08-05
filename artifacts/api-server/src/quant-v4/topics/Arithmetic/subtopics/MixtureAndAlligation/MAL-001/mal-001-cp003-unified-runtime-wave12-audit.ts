import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp003Wave12EditorialQuestion,
  malCp003Wave12EditorialStable,
  MAL_CP003_WAVE12_CONTRACT_IDS,
  MAL_CP003_WAVE12_READINESS,
  MAL_CP003_WAVE12_RUNTIME_ID,
  type MalCp003Wave12ContractId,
  type MalCp003Wave12UnifiedQuestion,
} from "./foundation/cp003-unified-runtime-wave12-editorial";
import { MAL_CP003_WAVE11_READINESS } from "./foundation/cp003-source-policy-closure-wave11";

function fail(message: string): never {
  throw new Error(message);
}
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(MAL_CP003_WAVE11_READINESS.sourcePolicyReadiness, "Wave 11 readiness regressed.");
assert(MAL_CP003_WAVE11_READINESS.remainingSourcePolicyBlockerCount === 0, "Wave 11 blockers returned.");
assert(MAL_CP003_WAVE12_CONTRACT_IDS.length === 9, "Wave 12 must expose nine contracts.");
assert(new Set(MAL_CP003_WAVE12_CONTRACT_IDS).size === 9, "Wave 12 contract IDs repeat.");
assert(MAL_CP003_WAVE12_READINESS.runtimeEditorialReadiness, "Wave 12 readiness is false.");
assert(!MAL_CP003_WAVE12_READINESS.freezeReadiness, "Wave 12 cannot freeze permanent QLs.");
assert(MAL_CP003_WAVE12_READINESS.permanentQlCount === 0, "Permanent QLs leaked into Wave 12.");

const seedsPerContract = 200;
const answerPositionCounts = [0, 0, 0, 0];
const stemsByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const fingerprintsByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const answersByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const stemOwners = new Map<string, Set<MalCp003Wave12ContractId>>();
const allStems = new Set<string>();
const allFingerprints = new Set<string>();
const allAnswers = new Set<string>();
const reviewRows: MalCp003Wave12UnifiedQuestion[] = [];
let generatedCount = 0;
let representationQuantityCount = 0;
let representationFractionCount = 0;
let representationRefillCount = 0;

for (const contractId of MAL_CP003_WAVE12_CONTRACT_IDS) {
  const contractStems = new Set<string>();
  const contractFingerprints = new Set<string>();
  const contractAnswers = new Set<string>();
  stemsByContract.set(contractId, contractStems);
  fingerprintsByContract.set(contractId, contractFingerprints);
  answersByContract.set(contractId, contractAnswers);

  for (let index = 0; index < seedsPerContract; index += 1) {
    const seed = `mal-cp003-wave12:${contractId}:${index}`;
    const first = generateMalCp003Wave12EditorialQuestion(contractId, seed);
    const second = generateMalCp003Wave12EditorialQuestion(contractId, seed);
    assert(
      malCp003Wave12EditorialStable(first) === malCp003Wave12EditorialStable(second),
      `${contractId}/${seed}: generation is not deterministic.`,
    );
    assert(first.validation.ok, `${contractId}/${seed}: ${first.validation.errors.join("; ")}`);
    assert(first.runtimeId === MAL_CP003_WAVE12_RUNTIME_ID, "Wrong runtime authority.");
    assert(first.packageId === "MAL-001" && first.canonicalProblemId === "MAL-CP-003", "Wrong identity.");
    assert(first.contractId === contractId, "Contract identity changed.");
    assert(first.permanentQlId === null, "Permanent QL leaked into Wave 12.");
    assert(first.language === "en" && first.locale === "en-IN", "Wrong language or locale.");
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A Wave 12 delivery flag became enabled.",
    );
    assert(first.sourceEvidenceIds.length > 0, "Source evidence is missing.");
    assert(first.stem.endsWith("?") && first.stem.length >= 55, "Stem is incomplete.");
    assert(!/[{}]/u.test(first.stem), "Stem contains an unresolved placeholder.");
    const visible = JSON.stringify({
      stem: first.stem,
      answer: first.answer,
      options: first.options,
      explanation: first.explanation,
      diagram: first.diagram,
    });
    assert(!/\b(?:undefined|NaN)\b/u.test(visible), "Invalid token escaped into learner content.");
    assert(first.options.length === 4 && new Set(first.options).size === 4, "Options are invalid.");
    assert(first.options[first.correctIndex] === first.answer, "Correct option is wrong.");
    assert(first.optionAudit.filter((option) => option.isCorrect).length === 1, "Correct-option audit failed.");
    assert(first.explanation.coreConcept.length >= 55, "Core concept is too shallow.");
    assert(first.explanation.steps.length >= 4, "Explanation has too few worked steps.");
    assert(first.explanation.verification.length >= 25, "Verification is too shallow.");
    assert(first.explanation.conclusion.length >= 20, "Conclusion is too shallow.");
    assert(first.explanation.examShortcut.length >= 25, "Shortcut is too shallow.");
    assert(first.explanation.commonTrap.length >= 25, "Trap warning is too shallow.");
    assert(first.diagram !== null && first.diagram !== undefined, "Diagram or stage ledger is missing.");
    assert(!/\balligation\b/iu.test(JSON.stringify(first.explanation)), "Alligation leaked into replacement reasoning.");

    if (contractId === "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE") {
      if (first.representationVariant === "FINAL_ORIGINAL_QUANTITY") representationQuantityCount += 1;
      else if (first.representationVariant === "FINAL_ORIGINAL_FRACTION") representationFractionCount += 1;
      else if (first.representationVariant === "FINAL_REFILL_QUANTITY") representationRefillCount += 1;
      else fail("Final-state contract emitted an invalid representation.");
    } else {
      assert(first.representationVariant === "PRIMARY_CONTRACT_OUTPUT", "Unexpected representation variant.");
    }

    answerPositionCounts[first.correctIndex] += 1;
    contractStems.add(first.stem);
    contractFingerprints.add(first.mathematicalFingerprint);
    contractAnswers.add(first.answer);
    allStems.add(first.stem);
    allFingerprints.add(first.mathematicalFingerprint);
    allAnswers.add(first.answer);
    const owners = stemOwners.get(first.stem) ?? new Set<MalCp003Wave12ContractId>();
    owners.add(contractId);
    stemOwners.set(first.stem, owners);
    generatedCount += 1;
    if (index < 3) reviewRows.push(first);
  }
}

const crossContractDuplicateStemCount = [...stemOwners.values()].filter(
  (owners) => owners.size > 1,
).length;
const stemsSummary = Object.fromEntries(
  [...stemsByContract].map(([id, values]) => [id, values.size]),
);
const fingerprintsSummary = Object.fromEntries(
  [...fingerprintsByContract].map(([id, values]) => [id, values.size]),
);
const answersSummary = Object.fromEntries(
  [...answersByContract].map(([id, values]) => [id, values.size]),
);

assert(generatedCount === 1800, `Expected 1800 questions, received ${generatedCount}.`);
assert(reviewRows.length === 27, "Expected 27 review rows.");
assert(answerPositionCounts.every((count) => count >= 300), `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`);
assert(crossContractDuplicateStemCount === 0, "An exact stem is shared across contracts.");
assert(allStems.size >= 300, `Overall stem diversity is too low: ${allStems.size}.`);
assert(allFingerprints.size >= 150, `Overall mathematical diversity is too low: ${allFingerprints.size}.`);
assert(allAnswers.size >= 45, `Overall answer diversity is too low: ${allAnswers.size}.`);
assert(
  [...stemsByContract.values()].every((values) => values.size >= 18),
  `Per-contract stem diversity is too low: ${JSON.stringify(stemsSummary)}.`,
);
assert(
  [...fingerprintsByContract.values()].every((values) => values.size >= 12),
  `Per-contract fingerprint diversity is too low: ${JSON.stringify(fingerprintsSummary)}.`,
);
assert(
  [...answersByContract.values()].every((values) => values.size >= 4),
  `Per-contract answer diversity is too low: ${JSON.stringify(answersSummary)}.`,
);
assert(representationQuantityCount >= 45, "Original-quantity representation is under-sampled.");
assert(representationFractionCount >= 45, "Fraction representation is under-sampled.");
assert(representationRefillCount >= 45, "Refill representation is under-sampled.");
assert(
  representationQuantityCount + representationFractionCount + representationRefillCount === 200,
  "Final-state representation count mismatch.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-unified-runtime-wave12-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-unified-runtime-wave12-review.md");
const summary = {
  status: "PASS_MAL_CP003_UNIFIED_RUNTIME_EDITORIAL_WAVE12",
  canonicalProblemId: "MAL-CP-003",
  runtimeId: MAL_CP003_WAVE12_RUNTIME_ID,
  contractCount: MAL_CP003_WAVE12_CONTRACT_IDS.length,
  seedsPerContract,
  generatedCount,
  distinctStemCount: allStems.size,
  distinctFingerprintCount: allFingerprints.size,
  distinctAnswerCount: allAnswers.size,
  crossContractDuplicateStemCount,
  answerPositionCounts,
  representationCounts: {
    finalOriginalQuantity: representationQuantityCount,
    finalOriginalFraction: representationFractionCount,
    finalRefillQuantity: representationRefillCount,
  },
  stemsByContract: stemsSummary,
  fingerprintsByContract: fingerprintsSummary,
  answersByContract: answersSummary,
  reviewQuestionCount: reviewRows.length,
  sourcePolicyReadiness: true,
  runtimeEditorialReadiness: true,
  permanentQlCount: 0,
  freezeReadiness: false,
  nextPermanentQlId: "MAL-QL-029",
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};
writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, reviewRows }, (_key, value) => (typeof value === "bigint" ? value.toString() : value), 2)}\n`,
  "utf8",
);
const markdown: string[] = [
  "# MAL-CP-003 Wave 12 — Unified Runtime Editorial Review",
  "",
  `Generated corpus: **${generatedCount}**`,
  `Contracts: **${MAL_CP003_WAVE12_CONTRACT_IDS.length}**`,
  `Distinct stems: **${allStems.size}**`,
  `Review rows: **${reviewRows.length}**`,
  "",
];
for (const question of reviewRows) {
  markdown.push(
    `## ${question.contractId} — ${question.seed}`,
    "",
    `**Representation:** ${question.representationVariant}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    ...question.explanation.steps,
    "",
    `**Verification:** ${question.explanation.verification}`,
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ...summary, jsonPath, markdownPath }, null, 2));
