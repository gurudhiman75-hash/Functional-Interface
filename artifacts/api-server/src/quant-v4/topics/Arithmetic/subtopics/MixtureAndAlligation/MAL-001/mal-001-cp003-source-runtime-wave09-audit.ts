import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runMalCp003DiscoveryPipeline } from "./foundation/cp003-discovery-pipeline";
import { MAL_CP003_EXECUTABLE_PROTOTYPE_IDS } from "./foundation/cp003-discovery-registry";
import {
  MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION,
  MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS,
} from "./foundation/cp003-external-source-wave08";
import { MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS } from "./foundation/cp003-source-contract-wave04";
import {
  generateMalCp003VariedSourceRuntimeQuestion,
  malCp003VariedSourceRuntimeStable,
} from "./foundation/cp003-source-runtime-wave07-varied";
import {
  generateMalCp003Wave09SourceRuntimeQuestion,
  MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS,
  MAL_CP003_WAVE09_SOURCE_RUNTIME_ID,
  malCp003Wave09SourceRuntimeStable,
  type MalCp003Wave09SourceRuntimeQuestion,
} from "./foundation/cp003-source-runtime-wave09";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS.length === 12,
  "Wave 08 unified frontier must contain twelve candidates.",
);
assert(
  new Set(MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS).size === 12,
  "Wave 08 candidate IDs are not unique.",
);
assert(
  MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS.length === 2,
  "Wave 09 must cover exactly the two newly source-backed runtime candidates.",
);
assert(
  MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION.sourceBackedDistinctCandidateIds.length === 5,
  "Source-backed frontier count changed unexpectedly.",
);
assert(
  MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION.provisionalCandidateIds.length === 4,
  "Provisional frontier count changed unexpectedly.",
);
assert(
  MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length === 8,
  "Existing executable discovery frontier changed.",
);

const seedsPerCandidate = 400;
let generatedCount = 0;
let deterministicCount = 0;
let validationPassCount = 0;
let sourceAttachmentCount = 0;
let removalInverseCount = 0;
let thresholdMinimumCount = 0;
let strictPreviousStageProofCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const stems = new Set<string>();
const fingerprints = new Set<string>();
const answers = new Set<string>();
const stemsByCandidate = new Map<string, Set<string>>();
const fingerprintsByCandidate = new Map<string, Set<string>>();
const reviewRows: MalCp003Wave09SourceRuntimeQuestion[] = [];

for (const candidateId of MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS) {
  const candidateStems = new Set<string>();
  const candidateFingerprints = new Set<string>();
  stemsByCandidate.set(candidateId, candidateStems);
  fingerprintsByCandidate.set(candidateId, candidateFingerprints);

  for (let index = 0; index < seedsPerCandidate; index += 1) {
    const seed = `cp003-wave09:${candidateId}:${index}`;
    const first = generateMalCp003Wave09SourceRuntimeQuestion(candidateId, seed);
    const second = generateMalCp003Wave09SourceRuntimeQuestion(candidateId, seed);
    assert(
      malCp003Wave09SourceRuntimeStable(first) ===
        malCp003Wave09SourceRuntimeStable(second),
      `${candidateId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(
      first.validation.ok,
      `${candidateId}/${seed}: ${first.validation.errors.join("; ")}`,
    );
    validationPassCount += 1;
    assert(first.runtimeId === MAL_CP003_WAVE09_SOURCE_RUNTIME_ID, "Wrong runtime ID.");
    assert(
      first.archetypeId === "MAL-001" &&
        first.canonicalProblemId === "MAL-CP-003",
      "Wrong chapter identity.",
    );
    assert(first.permanentQlId === null, "Permanent QL leaked into Wave 09.");
    assert(first.language === "en", "Unsupported language escaped.");
    assert(first.maturity === "DISCOVERY_PROTOTYPE", "Maturity changed.");
    assert(
      first.allocationStatus === "UNALLOCATED_OPEN_DISCOVERY",
      "Allocation status changed.",
    );
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A Wave 09 delivery flag became enabled.",
    );
    assert(first.sourceEvidenceIds.length > 0, "Source evidence is missing.");
    sourceAttachmentCount += 1;
    assert(first.stem.endsWith("?"), "Stem is not interrogative.");
    assert(
      first.options.length === 4 && new Set(first.options).size === 4,
      "Options are invalid.",
    );
    assert(first.options[first.correctIndex] === first.answer, "Correct option is wrong.");
    assert(
      first.optionAudit.filter((option) => option.isCorrect).length === 1,
      "Option audit has the wrong correct count.",
    );
    assert(
      new Set(first.optionAudit.map((option) => option.misconceptionId)).size === 4,
      "Misconception IDs are not unique.",
    );
    assert(first.explanation.steps.length >= 5, "Explanation is too shallow.");
    assert(first.diagram.stages.length >= 2, "Stage diagram is incomplete.");
    assert(!/alligation/iu.test(JSON.stringify(first)), "Wave 09 contains alligation.");
    assert(
      !/Math\.log|logarithm|floating log/iu.test(JSON.stringify(first)),
      "Wave 09 contains a logarithmic threshold shortcut.",
    );

    if (candidateId === "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL") {
      assert(
        /^\d+(?: \d+\/\d+)? litres$/u.test(first.answer),
        `Invalid removal answer ${first.answer}.`,
      );
      assert(/drawn out in each operation/iu.test(first.stem), "Removal stem has wrong task.");
      assert(first.sourceEvidenceIds.length === 2, "Removal contract should retain two direct sources.");
      assert(
        first.diagram.thresholdOriginalQuantity === null,
        "Removal inverse should not expose a threshold.",
      );
      removalInverseCount += 1;
    } else {
      assert(/^\d+ operations$/u.test(first.answer), `Invalid threshold answer ${first.answer}.`);
      assert(
        /minimum|at least|smallest/iu.test(first.stem),
        "Threshold stem does not ask for a minimum.",
      );
      assert(first.sourceEvidenceIds.length === 1, "Threshold contract should retain one direct source.");
      assert(
        first.diagram.thresholdOriginalQuantity !== null,
        "Threshold diagram is missing its boundary.",
      );
      const last = first.diagram.stages.at(-1);
      const previous = first.diagram.stages.at(-2);
      assert(last?.comparisonToThreshold === "BELOW", "Final stage did not cross the threshold.");
      assert(
        previous?.comparisonToThreshold === "ABOVE_OR_EQUAL",
        "Previous stage does not prove minimum operation count.",
      );
      thresholdMinimumCount += 1;
      strictPreviousStageProofCount += 1;
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

assert(generatedCount === 800, `Expected 800 Wave 09 packages, received ${generatedCount}.`);
assert(
  deterministicCount === 800 && validationPassCount === 800,
  "Wave 09 validation counts do not match.",
);
assert(sourceAttachmentCount === 800, "Source attachment count does not match.");
assert(
  removalInverseCount === 400 && thresholdMinimumCount === 400,
  "Wave 09 candidate corpus split is wrong.",
);
assert(strictPreviousStageProofCount === 400, "Strict minimum proof count is wrong.");
assert(reviewRows.length === 16, "Expected 16 Wave 09 review rows.");
assert(
  answerPositionCounts.every((count) => count >= 150),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);
assert(stems.size >= 30, `Stem diversity is too low: ${stems.size}.`);
assert(fingerprints.size >= 20, `Fingerprint diversity is too low: ${fingerprints.size}.`);
assert(answers.size >= 10, `Answer diversity is too low: ${answers.size}.`);
assert(
  [...stemsByCandidate.values()].every((set) => set.size >= 14),
  `Candidate stem diversity is too low: ${JSON.stringify(
    Object.fromEntries([...stemsByCandidate].map(([id, set]) => [id, set.size])),
  )}`,
);
assert(
  [...fingerprintsByCandidate.values()].every((set) => set.size >= 10),
  `Candidate mathematical diversity is too low: ${JSON.stringify(
    Object.fromEntries(
      [...fingerprintsByCandidate].map(([id, set]) => [id, set.size]),
    ),
  )}`,
);

let wave07RegressionCount = 0;
for (const candidateId of MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `cp003-wave09-wave07-regression:${candidateId}:${index}`;
    const first = generateMalCp003VariedSourceRuntimeQuestion(candidateId, seed);
    const second = generateMalCp003VariedSourceRuntimeQuestion(candidateId, seed);
    assert(
      malCp003VariedSourceRuntimeStable(first) ===
        malCp003VariedSourceRuntimeStable(second),
      `${candidateId}: Wave 07 determinism regressed.`,
    );
    assert(first.validation.ok, `${candidateId}: Wave 07 runtime regressed.`);
    assert(!first.active && !first.publiclyPublishable, "Wave 07 delivery flags regressed.");
    wave07RegressionCount += 1;
  }
}
assert(wave07RegressionCount === 40, "Wave 07 regression count mismatch.");

let existingPrototypeRegressionCount = 0;
for (const prototypeId of MAL_CP003_EXECUTABLE_PROTOTYPE_IDS) {
  for (let index = 0; index < 10; index += 1) {
    const question = runMalCp003DiscoveryPipeline(
      prototypeId,
      `cp003-wave09-prototype-regression:${prototypeId}:${index}`,
    );
    assert(
      question.validation.ok,
      `${prototypeId}: existing prototype regression failed: ${question.validation.errors.join("; ")}`,
    );
    assert(!question.active && !question.publiclyPublishable, "Prototype delivery flags regressed.");
    existingPrototypeRegressionCount += 1;
  }
}
assert(existingPrototypeRegressionCount === 80, "Prototype regression count mismatch.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-source-runtime-wave09-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-source-runtime-wave09-review.md");
const summary = {
  status: "PASS_MAL_CP003_SOURCE_RUNTIME_WAVE09",
  canonicalProblemId: "MAL-CP-003",
  runtimeId: MAL_CP003_WAVE09_SOURCE_RUNTIME_ID,
  unifiedDiscoveryCandidateCount: MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS.length,
  sourceBackedDistinctCandidateCount:
    MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION.sourceBackedDistinctCandidateIds.length,
  wave09SourceRuntimeCandidateCount:
    MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS.length,
  generatedCount,
  deterministicCount,
  validationPassCount,
  sourceAttachmentCount,
  removalInverseCount,
  thresholdMinimumCount,
  strictPreviousStageProofCount,
  distinctStemCount: stems.size,
  distinctFingerprintCount: fingerprints.size,
  distinctAnswerCount: answers.size,
  answerPositionCounts,
  stemsByCandidate: Object.fromEntries(
    [...stemsByCandidate].map(([id, set]) => [id, set.size]),
  ),
  fingerprintsByCandidate: Object.fromEntries(
    [...fingerprintsByCandidate].map(([id, set]) => [id, set.size]),
  ),
  reviewQuestionCount: reviewRows.length,
  wave07RegressionCount,
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
  `${JSON.stringify(
    { ...summary, reviewRows },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-003 Wave 09 — Source-Backed Runtime Review",
  "",
  "> Inactive executable discovery only. No permanent QL, freeze or delivery exposure.",
  "",
  `Generated corpus: **${generatedCount}**`,
  `New source-backed runtime candidates: **${MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS.length}**`,
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
      (option, index) =>
        `${String.fromCharCode(65 + index)}. ${option}${
          index === question.correctIndex ? " **✓**" : ""
        }`,
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
    { ...summary, reviewJson: jsonPath, reviewMarkdown: markdownPath },
    null,
    2,
  ),
);
