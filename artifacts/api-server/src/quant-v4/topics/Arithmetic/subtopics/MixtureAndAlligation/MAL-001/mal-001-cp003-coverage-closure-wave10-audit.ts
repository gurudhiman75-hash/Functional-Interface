import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
} from "./foundation/rational";
import { runMalCp003DiscoveryPipeline } from "./foundation/cp003-discovery-pipeline";
import { MAL_CP003_EXECUTABLE_PROTOTYPE_IDS } from "./foundation/cp003-discovery-registry";
import {
  MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS,
} from "./foundation/cp003-external-source-wave08";
import { solveMalCp003Request } from "./foundation/cp003-solver";
import { MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS } from "./foundation/cp003-source-contract-wave04";
import {
  generateMalCp003VariedSourceRuntimeQuestion,
  malCp003VariedSourceRuntimeStable,
} from "./foundation/cp003-source-runtime-wave07-varied";
import {
  generateMalCp003Wave09SourceRuntimeQuestion,
  MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS,
  malCp003Wave09SourceRuntimeStable,
} from "./foundation/cp003-source-runtime-wave09";
import {
  MAL_CP003_WAVE10_COVERAGE_AUTHORITY_ID,
  MAL_CP003_WAVE10_COVERAGE_MATRIX,
  MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS,
  MAL_CP003_WAVE10_EXCLUDED_IDS,
  MAL_CP003_WAVE10_FREEZE_VERDICT,
  MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS,
  MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS,
  MAL_CP003_WAVE10_SOURCE_BACKED_CONTRACT_IDS,
} from "./foundation/cp003-coverage-closure-wave10";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP003_WAVE10_COVERAGE_MATRIX.length === 12,
  "Wave 10 matrix must classify all twelve discovery candidates.",
);
assert(
  new Set(MAL_CP003_WAVE10_COVERAGE_MATRIX.map((entry) => entry.candidateId)).size === 12,
  "Wave 10 candidate IDs are not unique.",
);
assert(
  MAL_CP003_WAVE10_SOURCE_BACKED_CONTRACT_IDS.length === 5,
  "Expected five source-backed distinct contracts.",
);
assert(
  MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS.length === 2,
  "Expected two merged representation variants.",
);
assert(
  MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS.length === 4,
  "Expected four source-blocked provisional contracts.",
);
assert(
  MAL_CP003_WAVE10_EXCLUDED_IDS.length === 1,
  "Expected one CP-004 exclusion.",
);
assert(
  MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS.length === 9,
  "Expected nine effective owned learner contracts after representation merge.",
);
assert(
  MAL_CP003_WAVE10_FREEZE_VERDICT.freezeReadiness === false,
  "Wave 10 must not declare freeze readiness.",
);
assert(
  MAL_CP003_WAVE10_FREEZE_VERDICT.permanentQlCount === 0 &&
    MAL_CP003_WAVE10_FREEZE_VERDICT.frozenSolveModeCount === 0,
  "Wave 10 must preserve zero permanent QLs and frozen solve modes.",
);

const expectedIds = new Set(MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS);
for (const entry of MAL_CP003_WAVE10_COVERAGE_MATRIX) {
  assert(expectedIds.has(entry.candidateId), `${entry.candidateId}: unknown Wave 10 candidate.`);
  assert(entry.permanentQlId === null, `${entry.candidateId}: permanent QL leaked.`);
  assert(
    !entry.active &&
      !entry.publiclyPublishable &&
      !entry.questionStudioDiscoverable &&
      !entry.questionBankWritable &&
      !entry.testEligible,
    `${entry.candidateId}: a delivery flag became enabled.`,
  );

  switch (entry.disposition) {
    case "SOURCE_BACKED_DISTINCT_RUNTIME_READY":
      assert(entry.effectiveContractId === entry.candidateId, `${entry.candidateId}: source-backed contract must retain itself.`);
      assert(entry.directSourceStatus === "DIRECT_SOURCE_BACKED", `${entry.candidateId}: direct source status is wrong.`);
      assert(entry.remainingFreezeBlockers.length === 0, `${entry.candidateId}: source-backed contract retained candidate blockers.`);
      break;
    case "MERGED_REPRESENTATION_VARIANT":
      assert(
        entry.effectiveContractId ===
          "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
        `${entry.candidateId}: representation variant has the wrong merge target.`,
      );
      assert(entry.remainingFreezeBlockers.length === 0, `${entry.candidateId}: merged variant retained blockers.`);
      break;
    case "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY":
      assert(entry.effectiveContractId === entry.candidateId, `${entry.candidateId}: provisional contract must retain itself.`);
      assert(entry.remainingFreezeBlockers.length > 0, `${entry.candidateId}: provisional contract has no blocker.`);
      break;
    case "EXCLUDED_TO_MAL_CP004":
      assert(entry.effectiveContractId === null, `${entry.candidateId}: excluded contract retained an effective ID.`);
      assert(entry.runtimeAuthority === "NONE_CP004_EXCLUSION", `${entry.candidateId}: excluded contract retained runtime authority.`);
      assert(entry.remainingFreezeBlockers.length === 0, `${entry.candidateId}: CP-004 exclusion retained CP-003 blockers.`);
      break;
  }
}
assert(
  [...expectedIds].every((candidateId) =>
    MAL_CP003_WAVE10_COVERAGE_MATRIX.some((entry) => entry.candidateId === candidateId),
  ),
  "Wave 10 matrix omitted a Wave 08 candidate.",
);

let discoveryRuntimeRegressionCount = 0;
const discoveryRuntimeCandidateIds = new Set<string>();
for (const prototypeId of MAL_CP003_EXECUTABLE_PROTOTYPE_IDS) {
  discoveryRuntimeCandidateIds.add(prototypeId);
  for (let index = 0; index < 20; index += 1) {
    const question = runMalCp003DiscoveryPipeline(
      prototypeId,
      `cp003-wave10-discovery:${prototypeId}:${index}`,
    );
    assert(
      question.validation.ok,
      `${prototypeId}: discovery runtime failed: ${question.validation.errors.join("; ")}`,
    );
    assert(question.permanentQlId === null, `${prototypeId}: permanent QL leaked from discovery runtime.`);
    assert(
      !question.active &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable &&
        !question.questionBankWritable &&
        !question.testEligible,
      `${prototypeId}: discovery runtime delivery flag changed.`,
    );
    discoveryRuntimeRegressionCount += 1;
  }
}
assert(discoveryRuntimeRegressionCount === 160, "Discovery runtime regression count mismatch.");

let wave07RuntimeRegressionCount = 0;
for (const candidateId of MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS) {
  discoveryRuntimeCandidateIds.add(candidateId);
  for (let index = 0; index < 50; index += 1) {
    const seed = `cp003-wave10-wave07:${candidateId}:${index}`;
    const first = generateMalCp003VariedSourceRuntimeQuestion(candidateId, seed);
    const second = generateMalCp003VariedSourceRuntimeQuestion(candidateId, seed);
    assert(
      malCp003VariedSourceRuntimeStable(first) ===
        malCp003VariedSourceRuntimeStable(second),
      `${candidateId}: Wave 07 runtime is not deterministic.`,
    );
    assert(first.validation.ok, `${candidateId}: Wave 07 runtime validation failed.`);
    assert(first.sourceEvidenceIds.length > 0, `${candidateId}: Wave 07 source evidence is missing.`);
    wave07RuntimeRegressionCount += 1;
  }
}
assert(wave07RuntimeRegressionCount === 100, "Wave 07 runtime regression count mismatch.");

let wave09RuntimeRegressionCount = 0;
for (const candidateId of MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS) {
  discoveryRuntimeCandidateIds.add(candidateId);
  for (let index = 0; index < 50; index += 1) {
    const seed = `cp003-wave10-wave09:${candidateId}:${index}`;
    const first = generateMalCp003Wave09SourceRuntimeQuestion(candidateId, seed);
    const second = generateMalCp003Wave09SourceRuntimeQuestion(candidateId, seed);
    assert(
      malCp003Wave09SourceRuntimeStable(first) ===
        malCp003Wave09SourceRuntimeStable(second),
      `${candidateId}: Wave 09 runtime is not deterministic.`,
    );
    assert(first.validation.ok, `${candidateId}: Wave 09 runtime validation failed.`);
    assert(first.sourceEvidenceIds.length > 0, `${candidateId}: Wave 09 source evidence is missing.`);
    wave09RuntimeRegressionCount += 1;
  }
}
assert(wave09RuntimeRegressionCount === 100, "Wave 09 runtime regression count mismatch.");
assert(
  discoveryRuntimeCandidateIds.size === 11,
  `Expected runtime coverage for eleven non-excluded candidates, received ${discoveryRuntimeCandidateIds.size}.`,
);
assert(
  MAL_CP003_WAVE10_COVERAGE_MATRIX
    .filter((entry) => entry.disposition !== "EXCLUDED_TO_MAL_CP004")
    .every((entry) => discoveryRuntimeCandidateIds.has(entry.candidateId)),
  "At least one owned or merged candidate lacks executable runtime coverage.",
);

const equivalenceCases = [
  [24, 6, 2],
  [30, 5, 3],
  [36, 6, 2],
  [40, 4, 4],
  [48, 8, 3],
  [50, 10, 2],
  [60, 12, 3],
  [64, 16, 2],
  [72, 12, 3],
  [80, 8, 4],
  [90, 15, 3],
  [96, 24, 2],
  [100, 20, 3],
  [120, 30, 2],
  [125, 25, 3],
  [144, 24, 3],
  [160, 40, 2],
  [180, 30, 3],
  [200, 40, 4],
  [240, 48, 3],
] as const;

let fractionMergeProofCount = 0;
let refillMergeProofCount = 0;
for (let repetition = 0; repetition < 20; repetition += 1) {
  for (const [volume, removed, operations] of equivalenceCases) {
    const vesselVolume = rational(volume);
    const removedQuantity = rational(removed);
    const removedFraction = divideRational(removedQuantity, vesselVolume);
    const quantity = solveMalCp003Request({
      mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
      vesselVolume,
      initialOriginalQuantity: vesselVolume,
      removedQuantity,
      operations,
    });
    const fraction = solveMalCp003Request({
      mode: "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES",
      removedFraction,
      operations,
    });
    const refill = solveMalCp003Request({
      mode: "FINAL_REFILL_QUANTITY_EQUAL_STAGES",
      vesselVolume,
      removedQuantity,
      operations,
    });
    assert(quantity.kind === "FINAL_ORIGINAL_QUANTITY", "Unexpected quantity result.");
    assert(fraction.kind === "FINAL_ORIGINAL_FRACTION", "Unexpected fraction result.");
    assert(refill.kind === "FINAL_REFILL_QUANTITY", "Unexpected refill result.");
    assert(
      equalsRational(
        multiplyRational(fraction.fraction, vesselVolume),
        quantity.quantity,
      ),
      "Final fraction is not the scaled final original quantity.",
    );
    fractionMergeProofCount += 1;
    assert(
      equalsRational(
        addRational(quantity.quantity, refill.quantity),
        vesselVolume,
      ),
      "Final refill quantity is not the vessel-volume complement.",
    );
    refillMergeProofCount += 1;
  }
}
assert(fractionMergeProofCount === 400, "Fraction merge proof count mismatch.");
assert(refillMergeProofCount === 400, "Refill merge proof count mismatch.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-coverage-closure-wave10.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-coverage-closure-wave10.md");
const summary = {
  status: "PASS_MAL_CP003_COVERAGE_CLOSURE_WAVE10_BLOCKED_NOT_FROZEN",
  canonicalProblemId: "MAL-CP-003",
  authorityId: MAL_CP003_WAVE10_COVERAGE_AUTHORITY_ID,
  discoveryCandidateCount: MAL_CP003_WAVE10_COVERAGE_MATRIX.length,
  sourceBackedRuntimeReadyCount: MAL_CP003_WAVE10_SOURCE_BACKED_CONTRACT_IDS.length,
  mergedRepresentationVariantCount: MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS.length,
  provisionalBlockerContractCount: MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS.length,
  excludedToCp004Count: MAL_CP003_WAVE10_EXCLUDED_IDS.length,
  effectiveOwnedContractCount: MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS.length,
  runtimeCoveredCandidateCount: discoveryRuntimeCandidateIds.size,
  discoveryRuntimeRegressionCount,
  wave07RuntimeRegressionCount,
  wave09RuntimeRegressionCount,
  fractionMergeProofCount,
  refillMergeProofCount,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  nextPermanentQlIdReserved: false,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      ...summary,
      freezeVerdict: MAL_CP003_WAVE10_FREEZE_VERDICT,
      coverageMatrix: MAL_CP003_WAVE10_COVERAGE_MATRIX,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-003 Wave 10 — Coverage Closure and Freeze Blockers",
  "",
  "> Coverage is closed for the current frontier. Freeze remains blocked; no permanent QL is allocated.",
  "",
  `Discovery candidates: **${summary.discoveryCandidateCount}**`,
  `Source-backed runtime-ready contracts: **${summary.sourceBackedRuntimeReadyCount}**`,
  `Merged representation variants: **${summary.mergedRepresentationVariantCount}**`,
  `Provisional blocker contracts: **${summary.provisionalBlockerContractCount}**`,
  `CP-004 exclusions: **${summary.excludedToCp004Count}**`,
  `Effective owned contracts: **${summary.effectiveOwnedContractCount}**`,
  `Runtime-covered non-excluded candidates: **${summary.runtimeCoveredCandidateCount}**`,
  "Permanent QLs: **0**",
  "Frozen solve modes: **0**",
  "",
  "## Candidate matrix",
  "",
];

for (const entry of MAL_CP003_WAVE10_COVERAGE_MATRIX) {
  markdown.push(
    `### ${entry.candidateId}`,
    "",
    `- Disposition: \`${entry.disposition}\``,
    `- Effective contract: ${entry.effectiveContractId ? `\`${entry.effectiveContractId}\`` : "none — MAL-CP-004"}`,
    `- Runtime: \`${entry.runtimeAuthority}\``,
    `- Source status: \`${entry.directSourceStatus}\``,
    `- Answer contract: ${entry.answerContract}`,
    `- Decision: ${entry.closureReason}`,
    `- Remaining blockers: ${entry.remainingFreezeBlockers.length > 0 ? entry.remainingFreezeBlockers.map((blocker) => `\`${blocker}\``).join(", ") : "none"}`,
    "",
  );
}

markdown.push(
  "## Freeze verdict",
  "",
  "```text",
  `status: ${summary.status}`,
  `effective owned contracts: ${summary.effectiveOwnedContractCount}`,
  `provisional blockers: ${summary.provisionalBlockerContractCount}`,
  "permanent QLs: 0",
  "frozen solve modes: 0",
  "freeze readiness: false",
  "next permanent QL reserved: false",
  "```",
  "",
);

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(
  JSON.stringify(
    { ...summary, evidenceJson: jsonPath, evidenceMarkdown: markdownPath },
    null,
    2,
  ),
);
