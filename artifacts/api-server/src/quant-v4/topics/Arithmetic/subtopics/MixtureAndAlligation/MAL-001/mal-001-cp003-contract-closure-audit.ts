import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAL_CP003_DISCOVERY_REGISTRY } from "./foundation/cp003-discovery-registry";
import {
  MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS,
  MAL_CP003_WAVE04_SOURCE_REFERENCES,
} from "./foundation/cp003-source-contract-wave04";
import {
  MAL_CP003_WAVE05_ALL_CANDIDATE_IDS,
  MAL_CP003_WAVE05_CONTRACT_DECISIONS,
  MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS,
} from "./foundation/cp003-contract-closure-wave05";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const candidateIds = [...MAL_CP003_WAVE05_ALL_CANDIDATE_IDS];
const decisionIds = MAL_CP003_WAVE05_CONTRACT_DECISIONS.map(
  (decision) => decision.candidateId,
);
assert(candidateIds.length === 11, `Expected 11 candidates, received ${candidateIds.length}.`);
assert(new Set(candidateIds).size === candidateIds.length, "Candidate IDs are not unique.");
assert(
  MAL_CP003_WAVE05_CONTRACT_DECISIONS.length === candidateIds.length,
  "Every candidate must have exactly one Wave 05 decision.",
);
assert(new Set(decisionIds).size === decisionIds.length, "Decision IDs are not unique.");
for (const candidateId of candidateIds) {
  assert(decisionIds.includes(candidateId), `Missing decision for ${candidateId}.`);
}

const sourceBacked = MAL_CP003_WAVE05_CONTRACT_DECISIONS.filter(
  (decision) => decision.decision === "RETAIN_DISTINCT_SOURCE_BACKED",
);
const provisional = MAL_CP003_WAVE05_CONTRACT_DECISIONS.filter(
  (decision) => decision.decision === "RETAIN_PROVISIONAL_PENDING_SOURCE",
);
const mergeCandidates = MAL_CP003_WAVE05_CONTRACT_DECISIONS.filter(
  (decision) => decision.decision === "MERGE_CANDIDATE_PENDING_SOURCE",
);
const excluded = MAL_CP003_WAVE05_CONTRACT_DECISIONS.filter(
  (decision) => decision.decision === "EXCLUDE_TO_MAL_CP004",
);

assert(sourceBacked.length === 3, `Expected 3 source-backed contracts, received ${sourceBacked.length}.`);
assert(provisional.length === 5, `Expected 5 provisional contracts, received ${provisional.length}.`);
assert(mergeCandidates.length === 2, `Expected 2 merge candidates, received ${mergeCandidates.length}.`);
assert(excluded.length === 1, `Expected 1 excluded boundary, received ${excluded.length}.`);
assert(MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS.length === 2, "Expected two locked ownership exclusions.");

for (const candidate of mergeCandidates) {
  assert(candidate.mergeTarget !== null, `${candidate.candidateId} has no merge target.`);
  const target = MAL_CP003_WAVE05_CONTRACT_DECISIONS.find(
    (decision) => decision.candidateId === candidate.mergeTarget,
  );
  assert(target, `${candidate.candidateId} merge target is missing.`);
  assert(
    target.kernel === candidate.kernel,
    `${candidate.candidateId} cannot merge across mathematical kernels.`,
  );
  assert(
    candidate.remainingFreezeBlockers.some((blocker) => /source/iu.test(blocker)),
    `${candidate.candidateId} merge decision must remain source-gated.`,
  );
}

const finalQuantity = sourceBacked.find(
  (decision) =>
    decision.candidateId ===
    "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
);
assert(finalQuantity, "Source-backed final quantity decision is missing.");
const finalQuantityRegistry = MAL_CP003_DISCOVERY_REGISTRY.find(
  (entry) => entry.prototypeId === finalQuantity.candidateId,
);
assert(
  finalQuantityRegistry?.sourceClasses.includes(
    "LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY",
  ),
  "Final quantity lost direct legacy runtime evidence.",
);
assert(
  MAL_CP003_WAVE04_SOURCE_REFERENCES.some(
    (source) => source.sourceId === "RSA-QA-ALLIGATION-Q17",
  ),
  "Final quantity lost uploaded textbook evidence.",
);
assert(
  MAL_CP003_WAVE04_SOURCE_REFERENCES.some(
    (source) => source.sourceId === "RAP-CP017-QL1102",
  ),
  "Final quantity lost internal reviewed-runtime evidence.",
);

const finalRatioId =
  "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS" as const;
assert(
  MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.includes(finalRatioId),
  "Final-ratio source candidate is missing from Wave 04 authority.",
);
assert(
  MAL_CP003_WAVE04_SOURCE_REFERENCES.filter(
    (source) => source.candidateId === finalRatioId,
  ).length >= 2,
  "Final ratio requires at least two direct source observations.",
);

const vesselVolumeId = "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO" as const;
assert(
  MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.includes(vesselVolumeId),
  "Vessel-volume source candidate is missing from Wave 04 authority.",
);
assert(
  MAL_CP003_WAVE04_SOURCE_REFERENCES.some(
    (source) => source.candidateId === vesselVolumeId,
  ),
  "Vessel-volume inverse contract has no direct source reference.",
);

const concentrationBoundary = excluded[0]!;
const boundaryRegistry = MAL_CP003_DISCOVERY_REGISTRY.find(
  (entry) => entry.prototypeId === concentrationBoundary.candidateId,
);
assert(
  boundaryRegistry?.currentOwnerVerdict === "MAL-CP-003_CP004_BOUNDARY",
  "The CP-004 concentration boundary was weakened.",
);
assert(
  MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS.some(
    (entry) => entry.owner === "MAL-CP-002",
  ),
  "CP-002 single-stage replacement exclusion is missing.",
);
assert(
  MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS.some(
    (entry) => entry.owner === "MAL-CP-004",
  ),
  "CP-004 concentration replacement exclusion is missing.",
);

const kernelCounts = Object.fromEntries(
  [
    "SCALAR_EQUAL_STAGE_FORWARD_STATE",
    "SCALAR_EQUAL_STAGE_INVERSE_STATE",
    "SCALAR_UNEQUAL_STAGE_PRODUCT",
    "VECTOR_COMPONENT_STAGE_LEDGER",
    "CONCENTRATION_TRANSFORMATION_BOUNDARY",
  ].map((kernel) => [
    kernel,
    MAL_CP003_WAVE05_CONTRACT_DECISIONS.filter(
      (decision) => decision.kernel === kernel,
    ).length,
  ]),
);

const openBlockers = new Set(
  MAL_CP003_WAVE05_CONTRACT_DECISIONS.flatMap(
    (decision) => decision.remainingFreezeBlockers,
  ),
);
assert(openBlockers.size >= 10, "Wave 05 must preserve the unresolved freeze gates.");

const payload = {
  status: "PASS_MAL_CP003_CONTRACT_CLOSURE_WAVE05",
  canonicalProblemId: "MAL-CP-003",
  totalCandidateCount: candidateIds.length,
  sourceBackedDistinctCount: sourceBacked.length,
  provisionalDistinctCount: provisional.length,
  mergeCandidateCount: mergeCandidates.length,
  excludedBoundaryCount: excluded.length,
  ownershipExclusionCount: MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS.length,
  kernelCounts,
  openFreezeBlockerCount: openBlockers.size,
  sourceBackedCandidateIds: sourceBacked.map((decision) => decision.candidateId),
  provisionalCandidateIds: provisional.map((decision) => decision.candidateId),
  mergeCandidates: mergeCandidates.map((decision) => ({
    candidateId: decision.candidateId,
    mergeTarget: decision.mergeTarget,
  })),
  excludedCandidateIds: excluded.map((decision) => decision.candidateId),
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-contract-closure-wave05.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-contract-closure-wave05.md");
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const markdown = [
  "# MAL-CP-003 Wave 05 — Evidence-Weighted Contract Closure",
  "",
  "> This is a merge/split decision ledger, not a permanent QL allocation.",
  "",
  "## Decision totals",
  "",
  `- Total candidates: ${candidateIds.length}`,
  `- Source-backed distinct contracts: ${sourceBacked.length}`,
  `- Provisional distinct contracts: ${provisional.length}`,
  `- Representation merge candidates: ${mergeCandidates.length}`,
  `- Cross-checkpoint exclusion: ${excluded.length}`,
  "",
  "## Source-backed distinct contracts",
  "",
  ...sourceBacked.map((decision) => `- \`${decision.candidateId}\``),
  "",
  "## Merge candidates",
  "",
  ...mergeCandidates.map(
    (decision) => `- \`${decision.candidateId}\` → \`${decision.mergeTarget}\``,
  ),
  "",
  "## Provisional contracts still requiring source recovery",
  "",
  ...provisional.map((decision) => `- \`${decision.candidateId}\``),
  "",
  "## Ownership exclusions",
  "",
  ...MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS.map(
    (entry) => `- \`${entry.pattern}\` → **${entry.owner}**`,
  ),
  "",
  "## Freeze status",
  "",
  "Permanent QLs: **0**",
  "",
  "Frozen solve modes: **0**",
  "",
  "Freeze readiness: **false**",
  "",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...payload, auditJson: jsonPath, auditMarkdown: markdownPath }, null, 2));
