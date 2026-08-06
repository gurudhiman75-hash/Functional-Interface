import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMalCp003DiscoveryPrototype } from "./foundation/cp003-prototype-runtime";
import { MAL_CP003_EXECUTABLE_PROTOTYPE_IDS } from "./foundation/cp003-discovery-registry";
import {
  MAL_CP003_SOURCE_RUNTIME_ID,
  MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS,
  generateMalCp003SourceRuntimeQuestion,
  malCp003SourceRuntimeStable,
} from "./foundation/cp003-source-runtime-wave07";
import { MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS } from "./foundation/cp003-source-contract-wave04";
import type { MalCp003SourceRuntimeQuestion } from "./foundation/cp003-source-runtime-wave07";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x || 1;
}

assert(
  MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS.length === 11,
  "Unified discovery frontier must contain eleven candidates.",
);
assert(
  new Set(MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS).size === 11,
  "Unified discovery candidate IDs are not unique.",
);
assert(
  MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length === 2,
  "Expected two source-backed runtime candidates.",
);
assert(
  MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length === 8,
  "Existing executable prototype frontier changed unexpectedly.",
);

const seedsPerCandidate = 400;
let generatedCount = 0;
let deterministicCount = 0;
let validationPassCount = 0;
let sourceEvidenceAttachmentCount = 0;
let exactRatioCount = 0;
let vesselCapacityCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const stems = new Set<string>();
const fingerprints = new Set<string>();
const answers = new Set<string>();
const reviewRows: MalCp003SourceRuntimeQuestion[] = [];
const diversityByCandidate = new Map<string, Set<string>>();

for (const candidateId of MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS) {
  const candidateFingerprints = new Set<string>();
  diversityByCandidate.set(candidateId, candidateFingerprints);
  for (let index = 0; index < seedsPerCandidate; index += 1) {
    const seed = `cp003-source-wave07:${candidateId}:${index}`;
    const first = generateMalCp003SourceRuntimeQuestion(candidateId, seed);
    const second = generateMalCp003SourceRuntimeQuestion(candidateId, seed);
    assert(
      malCp003SourceRuntimeStable(first) === malCp003SourceRuntimeStable(second),
      `${candidateId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;
    assert(first.validation.ok, `${candidateId}/${seed}: ${first.validation.errors.join("; ")}`);
    validationPassCount += 1;
    assert(first.runtimeId === MAL_CP003_SOURCE_RUNTIME_ID, "Wrong runtime authority.");
    assert(first.archetypeId === "MAL-001", "Wrong archetype identity.");
    assert(first.canonicalProblemId === "MAL-CP-003", "Wrong checkpoint identity.");
    assert(first.permanentQlId === null, "Permanent QL leaked into source runtime.");
    assert(first.language === "en", "Non-English output escaped source runtime.");
    assert(first.maturity === "DISCOVERY_PROTOTYPE", "Source runtime maturity changed.");
    assert(first.allocationStatus === "UNALLOCATED_OPEN_DISCOVERY", "Source runtime allocation changed.");
    assert(!first.active, "Source runtime became active.");
    assert(!first.publiclyPublishable, "Source runtime became publishable.");
    assert(!first.questionStudioDiscoverable, "Source runtime leaked into Question Studio.");
    assert(!first.questionBankWritable, "Source runtime became writable.");
    assert(!first.testEligible, "Source runtime became test eligible.");
    assert(first.sourceEvidenceIds.length > 0, "Source evidence was not attached.");
    sourceEvidenceAttachmentCount += 1;
    assert(first.options.length === 4, "Question does not have four options.");
    assert(new Set(first.options).size === 4, "Question options are not unique.");
    assert(first.options[first.correctIndex] === first.answer, "Correct answer index is wrong.");
    assert(
      first.optionAudit.filter((option) => option.isCorrect).length === 1,
      "Option audit does not have exactly one correct option.",
    );
    assert(
      new Set(first.optionAudit.map((option) => option.misconceptionId)).size === 4,
      "Option audit does not preserve distinct misconception authorities.",
    );
    assert(first.explanation.steps.length >= 5, "Explanation is too shallow.");
    assert(first.diagram.stages.length >= 2, "Stage-flow diagram is incomplete.");
    assert(!/alligation/iu.test(JSON.stringify(first)), "Source runtime contains alligation.");

    if (
      candidateId ===
      "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS"
    ) {
      assert(/^\d+:\d+$/u.test(first.answer), `Invalid exact ratio: ${first.answer}.`);
      const [left, right] = first.answer.split(":").map(Number);
      assert(Number.isInteger(left) && Number.isInteger(right), "Ratio parts are not integers.");
      assert(gcd(left!, right!) === 1, `Ratio is not reduced: ${first.answer}.`);
      assert(first.stem.includes("final ratio"), "Ratio stem does not ask for a ratio.");
      exactRatioCount += 1;
    } else {
      assert(/^\d+(?: \d+\/\d+)? litres$/u.test(first.answer), `Invalid capacity answer: ${first.answer}.`);
      assert(first.stem.includes("capacity"), "Vessel stem does not ask for capacity.");
      vesselCapacityCount += 1;
    }

    answerPositionCounts[first.correctIndex] += 1;
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    candidateFingerprints.add(first.mathematicalFingerprint);
    answers.add(first.answer);
    generatedCount += 1;
    if (index < 8) reviewRows.push(first);
  }
}

assert(generatedCount === 800, `Expected 800 packages, received ${generatedCount}.`);
assert(deterministicCount === 800, "Deterministic replay count mismatch.");
assert(validationPassCount === 800, "Validation pass count mismatch.");
assert(sourceEvidenceAttachmentCount === 800, "Source evidence attachment count mismatch.");
assert(exactRatioCount === 400, "Expected 400 exact-ratio questions.");
assert(vesselCapacityCount === 400, "Expected 400 vessel-capacity questions.");
assert(reviewRows.length === 16, "Expected 16 manual-review rows.");
assert(
  answerPositionCounts.every((count) => count >= 150),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);
assert(stems.size >= 45, `Stem diversity is too low: ${stems.size}.`);
assert(fingerprints.size >= 45, `Fingerprint diversity is too low: ${fingerprints.size}.`);
assert(answers.size >= 25, `Answer diversity is too low: ${answers.size}.`);
assert(
  [...diversityByCandidate.values()].every((set) => set.size >= 16),
  `Candidate diversity is too low: ${JSON.stringify(
    Object.fromEntries([...diversityByCandidate].map(([id, set]) => [id, set.size])),
  )}`,
);

let existingPrototypeRegressionCount = 0;
for (const prototypeId of MAL_CP003_EXECUTABLE_PROTOTYPE_IDS) {
  for (let index = 0; index < 10; index += 1) {
    const question = generateMalCp003DiscoveryPrototype(
      prototypeId,
      `cp003-source-wave07-regression:${prototypeId}:${index}`,
    );
    assert(question.validation.ok, `${prototypeId}: existing discovery regression failed.`);
    assert(!question.active && !question.publiclyPublishable, `${prototypeId}: delivery flag regressed.`);
    existingPrototypeRegressionCount += 1;
  }
}
assert(existingPrototypeRegressionCount === 80, "Existing prototype regression count mismatch.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-source-runtime-wave07-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-source-runtime-wave07-review.md");
const payload = {
  status: "PASS_MAL_CP003_SOURCE_RUNTIME_WAVE07",
  canonicalProblemId: "MAL-CP-003",
  runtimeId: MAL_CP003_SOURCE_RUNTIME_ID,
  unifiedDiscoveryCandidateCount: MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS.length,
  sourceRuntimeCandidateCount: MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length,
  generatedCount,
  deterministicCount,
  validationPassCount,
  sourceEvidenceAttachmentCount,
  exactRatioCount,
  vesselCapacityCount,
  distinctStemCount: stems.size,
  distinctFingerprintCount: fingerprints.size,
  distinctAnswerCount: answers.size,
  answerPositionCounts,
  diversityByCandidate: Object.fromEntries(
    [...diversityByCandidate].map(([id, set]) => [id, set.size]),
  ),
  reviewQuestionCount: reviewRows.length,
  existingPrototypeRegressionCount,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  reviewRows,
};
writeFileSync(
  jsonPath,
  `${JSON.stringify(payload, (_key, value) => (typeof value === "bigint" ? value.toString() : value), 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-003 Wave 07 — Source-Backed Runtime Review",
  "",
  "> These are inactive executable discovery questions. They are not permanent QLs and are not available in Question Studio.",
  "",
  `Generated corpus: **${generatedCount}**`,
  `Review rows: **${reviewRows.length}**`,
  "Permanent QLs: **0**",
  "Frozen solve modes: **0**",
  "",
];
for (const question of reviewRows) {
  markdown.push(
    `## ${question.candidateId} — ${question.seed}`,
    "",
    `**Source evidence:** ${question.sourceEvidenceIds.join(", ")}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) =>
        `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`,
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

console.log(
  JSON.stringify(
    {
      ...payload,
      reviewRows: undefined,
      reviewJson: jsonPath,
      reviewMarkdown: markdownPath,
    },
    null,
    2,
  ),
);
