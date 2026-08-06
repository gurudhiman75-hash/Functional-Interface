import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runMalCp003DiscoveryPipeline } from "./foundation/cp003-discovery-pipeline";
import { MAL_CP003_EXECUTABLE_PROTOTYPE_IDS } from "./foundation/cp003-discovery-registry";
import {
  MAL_CP003_SOURCE_RUNTIME_ID,
  MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS,
  type MalCp003SourceRuntimeQuestion,
} from "./foundation/cp003-source-runtime-wave07";
import {
  generateMalCp003VariedSourceRuntimeQuestion,
  malCp003VariedSourceRuntimeStable,
} from "./foundation/cp003-source-runtime-wave07-varied";
import { MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS } from "./foundation/cp003-source-contract-wave04";

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

assert(MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS.length === 11, "Unified frontier must contain eleven candidates.");
assert(new Set(MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS).size === 11, "Unified candidate IDs are not unique.");
assert(MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length === 2, "Expected two source runtime candidates.");
assert(MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length === 8, "Existing executable frontier changed.");

const seedsPerCandidate = 400;
let generatedCount = 0;
let deterministicCount = 0;
let validationPassCount = 0;
let sourceAttachmentCount = 0;
let exactRatioCount = 0;
let vesselCapacityCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const stems = new Set<string>();
const fingerprints = new Set<string>();
const answers = new Set<string>();
const reviewRows: MalCp003SourceRuntimeQuestion[] = [];
const diversityByCandidate = new Map<string, Set<string>>();
const stemsByCandidate = new Map<string, Set<string>>();

for (const candidateId of MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS) {
  const candidateFingerprints = new Set<string>();
  const candidateStems = new Set<string>();
  diversityByCandidate.set(candidateId, candidateFingerprints);
  stemsByCandidate.set(candidateId, candidateStems);
  for (let index = 0; index < seedsPerCandidate; index += 1) {
    const seed = `cp003-source-wave07-v2:${candidateId}:${index}`;
    const first = generateMalCp003VariedSourceRuntimeQuestion(candidateId, seed);
    const second = generateMalCp003VariedSourceRuntimeQuestion(candidateId, seed);
    assert(
      malCp003VariedSourceRuntimeStable(first) === malCp003VariedSourceRuntimeStable(second),
      `${candidateId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;
    assert(first.validation.ok, `${candidateId}/${seed}: ${first.validation.errors.join("; ")}`);
    validationPassCount += 1;
    assert(first.runtimeId === MAL_CP003_SOURCE_RUNTIME_ID, "Wrong runtime authority.");
    assert(first.archetypeId === "MAL-001" && first.canonicalProblemId === "MAL-CP-003", "Wrong identity.");
    assert(first.permanentQlId === null, "Permanent QL leaked into discovery.");
    assert(first.language === "en", "Non-English output escaped.");
    assert(first.maturity === "DISCOVERY_PROTOTYPE", "Maturity changed.");
    assert(first.allocationStatus === "UNALLOCATED_OPEN_DISCOVERY", "Allocation changed.");
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A delivery flag became enabled.",
    );
    assert(first.sourceEvidenceIds.length > 0, "Source evidence is missing.");
    sourceAttachmentCount += 1;
    assert(first.stem.endsWith("?"), "Stem is not interrogative.");
    assert(first.options.length === 4 && new Set(first.options).size === 4, "Options are invalid.");
    assert(first.options[first.correctIndex] === first.answer, "Correct option is wrong.");
    assert(first.optionAudit.filter((option) => option.isCorrect).length === 1, "Option audit has wrong correct count.");
    assert(new Set(first.optionAudit.map((option) => option.misconceptionId)).size === 4, "Misconception IDs are not distinct.");
    assert(first.explanation.steps.length >= 5, "Explanation is too shallow.");
    assert(first.diagram.stages.length >= 2, "Diagram is incomplete.");
    assert(!/alligation/iu.test(JSON.stringify(first)), "Source runtime contains alligation.");

    if (candidateId === "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS") {
      assert(/^\d+:\d+$/u.test(first.answer), `Invalid ratio ${first.answer}.`);
      const [left, right] = first.answer.split(":").map(Number);
      assert(gcd(left!, right!) === 1, `Ratio is not reduced: ${first.answer}.`);
      assert(first.stem.includes("ratio"), "Ratio question does not ask for a ratio.");
      exactRatioCount += 1;
    } else {
      assert(/^\d+(?: \d+\/\d+)? litres$/u.test(first.answer), `Invalid capacity ${first.answer}.`);
      assert(first.stem.includes("capacity"), "Capacity question does not ask for capacity.");
      vesselCapacityCount += 1;
    }

    answerPositionCounts[first.correctIndex] += 1;
    stems.add(first.stem);
    candidateStems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    candidateFingerprints.add(first.mathematicalFingerprint);
    answers.add(first.answer);
    generatedCount += 1;
    if (index < 8) reviewRows.push(first);
  }
}

assert(generatedCount === 800, `Expected 800 packages, received ${generatedCount}.`);
assert(deterministicCount === 800 && validationPassCount === 800, "Corpus validation counts do not match.");
assert(sourceAttachmentCount === 800, "Source attachment count does not match.");
assert(exactRatioCount === 400 && vesselCapacityCount === 400, "Candidate corpus split is wrong.");
assert(reviewRows.length === 16, "Expected 16 review rows.");
assert(answerPositionCounts.every((count) => count >= 150), `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`);
assert(stems.size >= 100, `Stem diversity is too low: ${stems.size}.`);
assert(fingerprints.size >= 30, `Fingerprint diversity is too low: ${fingerprints.size}.`);
assert(answers.size >= 20, `Answer diversity is too low: ${answers.size}.`);
assert(
  [...stemsByCandidate.values()].every((set) => set.size >= 45),
  `Candidate stem diversity is too low: ${JSON.stringify(Object.fromEntries([...stemsByCandidate].map(([id, set]) => [id, set.size])))}`,
);
assert(
  [...diversityByCandidate.values()].every((set) => set.size >= 16),
  `Candidate mathematical diversity is too low: ${JSON.stringify(Object.fromEntries([...diversityByCandidate].map(([id, set]) => [id, set.size])))}`,
);

let existingPrototypeRegressionCount = 0;
for (const prototypeId of MAL_CP003_EXECUTABLE_PROTOTYPE_IDS) {
  for (let index = 0; index < 10; index += 1) {
    const question = runMalCp003DiscoveryPipeline(
      prototypeId,
      `cp003-discovery-${prototypeId}-${index}`,
    );
    assert(
      question.validation.ok,
      `${prototypeId}: existing prototype regression failed: ${question.validation.errors.join("; ")}`,
    );
    assert(!question.active && !question.publiclyPublishable, `${prototypeId}: delivery flag regressed.`);
    existingPrototypeRegressionCount += 1;
  }
}
assert(existingPrototypeRegressionCount === 80, "Existing prototype regression count mismatch.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-source-runtime-wave07-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-source-runtime-wave07-review.md");
const summary = {
  status: "PASS_MAL_CP003_SOURCE_RUNTIME_WAVE07",
  canonicalProblemId: "MAL-CP-003",
  runtimeId: MAL_CP003_SOURCE_RUNTIME_ID,
  unifiedDiscoveryCandidateCount: MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS.length,
  sourceRuntimeCandidateCount: MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length,
  generatedCount,
  deterministicCount,
  validationPassCount,
  sourceAttachmentCount,
  exactRatioCount,
  vesselCapacityCount,
  distinctStemCount: stems.size,
  distinctFingerprintCount: fingerprints.size,
  distinctAnswerCount: answers.size,
  answerPositionCounts,
  stemsByCandidate: Object.fromEntries([...stemsByCandidate].map(([id, set]) => [id, set.size])),
  diversityByCandidate: Object.fromEntries([...diversityByCandidate].map(([id, set]) => [id, set.size])),
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
};
writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, reviewRows }, (_key, value) => (typeof value === "bigint" ? value.toString() : value), 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-003 Wave 07 — Source-Backed Runtime Review V2",
  "",
  "> Inactive executable discovery only. No permanent QL or delivery exposure.",
  "",
  `Generated corpus: **${generatedCount}**`,
  `Distinct stems: **${stems.size}**`,
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
console.log(JSON.stringify({ ...summary, reviewJson: jsonPath, reviewMarkdown: markdownPath }, null, 2));
