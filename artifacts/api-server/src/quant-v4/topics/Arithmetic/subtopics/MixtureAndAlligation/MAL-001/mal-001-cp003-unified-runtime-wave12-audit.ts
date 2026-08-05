import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp003Wave12UnifiedQuestion,
  malCp003Wave12UnifiedStable,
  MAL_CP003_WAVE12_CONTRACT_IDS,
  MAL_CP003_WAVE12_READINESS,
  MAL_CP003_WAVE12_RUNTIME_ID,
  type MalCp003Wave12ContractId,
  type MalCp003Wave12UnifiedQuestion,
} from "./foundation/cp003-unified-runtime-wave12";
import { MAL_CP003_WAVE11_READINESS } from "./foundation/cp003-source-policy-closure-wave11";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(MAL_CP003_WAVE11_READINESS.sourcePolicyReadiness, "Wave 11 source-policy readiness regressed.");
assert(MAL_CP003_WAVE11_READINESS.remainingSourcePolicyBlockerCount === 0, "Wave 11 blockers returned.");
assert(MAL_CP003_WAVE12_CONTRACT_IDS.length === 9, "Wave 12 must expose nine effective contracts.");
assert(new Set(MAL_CP003_WAVE12_CONTRACT_IDS).size === 9, "Wave 12 contract IDs are not unique.");
assert(MAL_CP003_WAVE12_READINESS.runtimeEditorialReadiness, "Wave 12 readiness is false.");
assert(!MAL_CP003_WAVE12_READINESS.freezeReadiness, "Wave 12 must not freeze permanent QLs.");
assert(MAL_CP003_WAVE12_READINESS.permanentQlCount === 0, "Permanent QLs leaked into Wave 12.");
assert(MAL_CP003_WAVE12_READINESS.nextPermanentQlId === "MAL-QL-029", "Wrong next QL ID.");

const seedsPerContract = 200;
let generatedCount = 0;
let deterministicCount = 0;
let validationPassCount = 0;
let sourceAttachmentCount = 0;
let editorialPassCount = 0;
let representationQuantityCount = 0;
let representationFractionCount = 0;
let representationRefillCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const allStems = new Set<string>();
const allFingerprints = new Set<string>();
const allAnswers = new Set<string>();
const stemOwners = new Map<string, Set<MalCp003Wave12ContractId>>();
const stemsByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const fingerprintsByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const answersByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const runtimeKindsByContract = new Map<MalCp003Wave12ContractId, Set<string>>();
const reviewRows: MalCp003Wave12UnifiedQuestion[] = [];

for (const contractId of MAL_CP003_WAVE12_CONTRACT_IDS) {
  const contractStems = new Set<string>();
  const contractFingerprints = new Set<string>();
  const contractAnswers = new Set<string>();
  const contractRuntimeKinds = new Set<string>();
  stemsByContract.set(contractId, contractStems);
  fingerprintsByContract.set(contractId, contractFingerprints);
  answersByContract.set(contractId, contractAnswers);
  runtimeKindsByContract.set(contractId, contractRuntimeKinds);

  for (let index = 0; index < seedsPerContract; index += 1) {
    const seed = `mal-cp003-wave12:${contractId}:${index}`;
    const first = generateMalCp003Wave12UnifiedQuestion(contractId, seed);
    const second = generateMalCp003Wave12UnifiedQuestion(contractId, seed);
    assert(
      malCp003Wave12UnifiedStable(first) === malCp003Wave12UnifiedStable(second),
      `${contractId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;
    assert(first.validation.ok, `${contractId}/${seed}: ${first.validation.errors.join("; ")}`);
    validationPassCount += 1;
    assert(first.runtimeId === MAL_CP003_WAVE12_RUNTIME_ID, "Wrong Wave 12 runtime ID.");
    assert(first.packageId === "MAL-001" && first.canonicalProblemId === "MAL-CP-003", "Wrong identity.");
    assert(first.contractId === contractId, "Generated contract ID changed.");
    assert(first.permanentQlId === null, "Permanent QL leaked into Wave 12.");
    assert(first.language === "en" && first.locale === "en-IN", "Wrong language or locale.");
    assert(first.maturity === "EDITORIAL_RUNTIME_CANDIDATE", "Wrong maturity.");
    assert(first.allocationStatus === "UNALLOCATED_READY_FOR_FREEZE_REVIEW", "Wrong allocation status.");
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A Wave 12 delivery flag became enabled.",
    );
    assert(first.sourceEvidenceIds.length > 0, "Source evidence is missing.");
    sourceAttachmentCount += 1;
    assert(first.stem.endsWith("?"), "Stem is not interrogative.");
    assert(first.stem.length >= 55, "Stem is too short to preserve the evidence state.");
    assert(!/[{}]/u.test(first.stem), "Stem contains an unresolved placeholder.");
    const learnerVisible = JSON.stringify({
      stem: first.stem,
      answer: first.answer,
      options: first.options,
      explanation: first.explanation,
      diagram: first.diagram,
    });
    assert(
      !/\b(?:undefined|NaN)\b/u.test(learnerVisible),
      "Invalid runtime token escaped into learner-visible content.",
    );
    assert(first.options.length === 4 && new Set(first.options).size === 4, "Options are invalid.");
    assert(first.options[first.correctIndex] === first.answer, "Correct option does not match answer.");
    assert(first.optionAudit.filter((option) => option.isCorrect).length === 1, "Wrong correct-option count.");
    assert(first.explanation.coreConcept.length >= 55, "Core concept is too shallow.");
    assert(first.explanation.steps.length >= 4, "Explanation has too few worked steps.");
    assert(first.explanation.verification.length >= 25, "Verification is too shallow.");
    assert(first.explanation.conclusion.length >= 20, "Conclusion is too shallow.");
    assert(first.explanation.examShortcut.length >= 25, "Exam shortcut is too shallow.");
    assert(first.explanation.commonTrap.length >= 25, "Common-trap warning is too shallow.");
    assert(first.diagram !== null && first.diagram !== undefined, "Diagram or stage ledger is missing.");
    assert(!/\balligation\b/iu.test(JSON.stringify(first.explanation)), "Alligation leaked into replacement reasoning.");
    editorialPassCount += 1;

    if (contractId === "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE") {
      if (first.representationVariant === "FINAL_ORIGINAL_QUANTITY") representationQuantityCount += 1;
      else if (first.representationVariant === "FINAL_ORIGINAL_FRACTION") representationFractionCount += 1;
      else if (first.representationVariant === "FINAL_REFILL_QUANTITY") representationRefillCount += 1;
      else fail("Final-state contract emitted an invalid representation variant.");
    } else {
      assert(first.representationVariant === "PRIMARY_CONTRACT_OUTPUT", "Non-final-state representation changed.");
    }

    answerPositionCounts[first.correctIndex] += 1;
    allStems.add(first.stem);
    allFingerprints.add(first.mathematicalFingerprint);
    allAnswers.add(first.answer);
    contractStems.add(first.stem);
    contractFingerprints.add(first.mathematicalFingerprint);
    contractAnswers.add(first.answer);
    contractRuntimeKinds.add(first.sourceRuntimeKind);
    const owners = stemOwners.get(first.stem) ?? new Set<MalCp003Wave12ContractId>();
    owners.add(contractId);
    stemOwners.set(first.stem, owners);
    generatedCount += 1;
    if (index < 3) reviewRows.push(first);
  }
}

const crossContractDuplicateStems = [...stemOwners.entries()].filter(
  ([_stem, owners]) => owners.size > 1,
);
const stemsByContractSummary = Object.fromEntries(
  [...stemsByContract].map(([contractId, values]) => [contractId, values.size]),
);
const fingerprintsByContractSummary = Object.fromEntries(
  [...fingerprintsByContract].map(([contractId, values]) => [contractId, values.size]),
);
const answersByContractSummary = Object.fromEntries(
  [...answersByContract].map(([contractId, values]) => [contractId, values.size]),
);
const runtimeKindsByContractSummary = Object.fromEntries(
  [...runtimeKindsByContract].map(([contractId, values]) => [contractId, [...values]]),
);

assert(generatedCount === 1800, `Expected 1800 questions, received ${generatedCount}.`);
assert(deterministicCount === 1800, "Determinism count mismatch.");
assert(validationPassCount === 1800, "Validation count mismatch.");
assert(sourceAttachmentCount === 1800, "Source attachment count mismatch.");
assert(editorialPassCount === 1800, "Editorial pass count mismatch.");
assert(reviewRows.length === 27, "Expected 27 review rows.");
assert(answerPositionCounts.every((count) => count >= 300), `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`);
assert(crossContractDuplicateStems.length === 0, "An exact stem is shared by different contracts.");
assert(allStems.size >= 300, `Overall stem diversity is too low: ${allStems.size}.`);
assert(allFingerprints.size >= 150, `Overall mathematical diversity is too low: ${allFingerprints.size}.`);
assert(allAnswers.size >= 45, `Overall answer diversity is too low: ${allAnswers.size}.`);
assert(
  [...stemsByContract.values()].every((values) => values.size >= 18),
  `Per-contract stem diversity is too low: ${JSON.stringify(stemsByContractSummary)}.`,
);
assert(
  [...fingerprintsByContract.values()].every((values) => values.size >= 12),
  `Per-contract mathematical diversity is too low: ${JSON.stringify(fingerprintsByContractSummary)}.`,
);
assert(
  [...answersByContract.values()].every((values) => values.size >= 4),
  `Per-contract answer diversity is too low: ${JSON.stringify(answersByContractSummary)}.`,
);
assert(representationQuantityCount >= 45, "Final original-quantity representation is under-sampled.");
assert(representationFractionCount >= 45, "Final fraction representation is under-sampled.");
assert(representationRefillCount >= 45, "Final refill representation is under-sampled.");
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
  deterministicCount,
  validationPassCount,
  sourceAttachmentCount,
  editorialPassCount,
  distinctStemCount: allStems.size,
  distinctFingerprintCount: allFingerprints.size,
  distinctAnswerCount: allAnswers.size,
  crossContractDuplicateStemCount: crossContractDuplicateStems.length,
  answerPositionCounts,
  representationCounts: {
    finalOriginalQuantity: representationQuantityCount,
    finalOriginalFraction: representationFractionCount,
    finalRefillQuantity: representationRefillCount,
  },
  stemsByContract: stemsByContractSummary,
  fingerprintsByContract: fingerprintsByContractSummary,
  answersByContract: answersByContractSummary,
  runtimeKindsByContract: runtimeKindsByContractSummary,
  reviewQuestionCount: reviewRows.length,
  sourcePolicyReadiness: true,
  runtimeEditorialReadiness: true,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
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
  "> Inactive English runtime candidate. Permanent QLs remain unallocated.",
  "",
  `Generated corpus: **${generatedCount}**`,
  `Contracts: **${MAL_CP003_WAVE12_CONTRACT_IDS.length}**`,
  `Distinct stems: **${allStems.size}**`,
  `Distinct mathematical fingerprints: **${allFingerprints.size}**`,
  `Cross-contract exact duplicate stems: **${crossContractDuplicateStems.length}**`,
  `Review rows: **${reviewRows.length}**`,
  "",
];
for (const question of reviewRows) {
  markdown.push(
    `## ${question.contractId} — ${question.seed}`,
    "",
    `**Representation:** ${question.representationVariant}`,
    "",
    `**Source evidence:** ${question.sourceEvidenceIds.join(", ")}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Concept:** ${question.explanation.coreConcept}`,
    "",
    `**Formula:** ${question.explanation.formula}`,
    "",
    ...question.explanation.steps,
    "",
    `**Verification:** ${question.explanation.verification}`,
    "",
    `**Shortcut:** ${question.explanation.examShortcut}`,
    "",
    `**Trap:** ${question.explanation.commonTrap}`,
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ...summary, jsonPath, markdownPath }, null, 2));
