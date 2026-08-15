import {
  MEN_CP_012_CANONICAL_CLUSTERS,
  auditMenCp012MergeSplitV4,
} from "../../cp012-foundation/merge-split-v4";
import {
  MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY,
  generateMenCp012CorrectedConeRatioV4,
} from "../../cp012-foundation/source-corrections-v4";
import {
  MEN_CP_012_PERMANENT_ALLOCATION,
  auditMenCp012PermanentAllocation,
} from "./allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const mergeAudit = auditMenCp012MergeSplitV4();
assert(mergeAudit.canonicalClusterCount === 13, `Expected 13 canonical clusters, got ${mergeAudit.canonicalClusterCount}.`);
assert(mergeAudit.discoverySourceCount === 42, `Expected 42 discovery/source forms, got ${mergeAudit.discoverySourceCount}.`);
assert(mergeAudit.uniqueDiscoverySourceCount === 42, "Discovery/source IDs must be unique.");
assert(mergeAudit.mappedSourceCount === 42 && mergeAudit.uniqueMappedSourceCount === 42, "Every source form must map exactly once.");
assert(mergeAudit.missingSourceIds.length === 0, `Missing source IDs: ${mergeAudit.missingSourceIds.join(", ")}`);
assert(mergeAudit.unknownMappedSourceIds.length === 0, `Unknown mapped source IDs: ${mergeAudit.unknownMappedSourceIds.join(", ")}`);
assert(mergeAudit.duplicateMappedSourceIds.length === 0, `Duplicate mapped source IDs: ${mergeAudit.duplicateMappedSourceIds.join(", ")}`);
assert(mergeAudit.hollowOwnershipClusterCount === 3, `Expected three CP011/CP012 hollow-boundary clusters, got ${mergeAudit.hollowOwnershipClusterCount}.`);
assert(mergeAudit.coverageClosed, "MEN-CP-012 merge/split source coverage must be closed.");

const allocationAudit = auditMenCp012PermanentAllocation();
assert(allocationAudit.permanentQlCount === 13, `Expected 13 permanent QLs, got ${allocationAudit.permanentQlCount}.`);
assert(allocationAudit.firstQlId === "MEN-002-QL-150", `Unexpected first QL: ${allocationAudit.firstQlId}`);
assert(allocationAudit.lastQlId === "MEN-002-QL-162", `Unexpected last QL: ${allocationAudit.lastQlId}`);
assert(allocationAudit.uniqueQlCount === 13, "Permanent QL IDs must be unique.");
assert(allocationAudit.uniqueClusterCount === 13, "Permanent cluster IDs must be unique.");
assert(allocationAudit.uniqueTemplateCount === 13, "Permanent template IDs must be unique.");
assert(allocationAudit.uniqueSolveModeCount === 13, "Permanent solve mode IDs must be unique.");
assert(allocationAudit.contiguousQlRange, "Permanent QL allocation must be contiguous MEN-002-QL-150..162.");
assert(allocationAudit.englishImplementationFrozen === false, "English implementation must remain unfrozen at allocation gate.");
assert(allocationAudit.hollowOwnershipCount === 3, "Three permanent families must carry the explicit CP011/CP012 hollow ownership boundary.");
assert(allocationAudit.lifecycleLocked, "Permanent allocation must remain product locked.");

assert(MEN_CP_012_PERMANENT_ALLOCATION.every((row) => row.permanentIdentityFrozen && row.solveModeFrozen), "Permanent identity/solve-mode freeze must be true for every row.");
assert(MEN_CP_012_PERMANENT_ALLOCATION.every((row) => !row.englishImplementationFrozen), "Allocation must not pretend English is implemented/frozen.");
assert(MEN_CP_012_PERMANENT_ALLOCATION.every((row) => !row.active && !row.questionStudioDiscoverable && !row.publiclyPublishable), "Product activation must remain closed.");
assert(MEN_CP_012_PERMANENT_ALLOCATION.every((row) => row.questionBankStatus === "NOT_STORED" && row.testEligibility === "INELIGIBLE"), "Question Bank/test gates must remain closed.");

const clusterById = new Map(MEN_CP_012_CANONICAL_CLUSTERS.map((row) => [row.clusterId, row]));
const squareRoot = clusterById.get("RECAST_SQUARE_ROOT_DIMENSION_INVERSE");
assert(!!squareRoot, "Square-root dimension family missing.");
assert(squareRoot!.coreEvidenceIds.includes("V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO"), "Corrected cone-ratio source must belong to square-root recovery family.");
assert(!clusterById.get("RECAST_LINEAR_DIMENSION_DIRECT")!.coreEvidenceIds.includes("V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO"), "Cone-ratio source must not remain in the simple height family.");
assert(clusterById.get("HOLLOW_SOURCE_MATERIAL_RECAST")!.coreEvidenceIds.includes("MEN-CP012-PROT-HOLLOW-CYLINDER-TO-SOLID-CYLINDER"), "Hollow-cylinder recast must remain CP012-owned when transformation is decisive.");
assert(clusterById.get("HOLLOW_SOURCE_MATERIAL_RECAST")!.coreEvidenceIds.includes("V3-HOLLOW-SPHERE-TO-SOLID-CYLINDER-HEIGHT"), "Hollow-sphere recast must remain CP012-owned when transformation is decisive.");
assert(clusterById.get("HOLLOW_TARGET_LENGTH_DIRECT")!.coreEvidenceIds.includes("V3-SPHERE-TO-HOLLOW-TUBE-LENGTH"), "Hollow-target length family missing source evidence.");
assert(clusterById.get("HOLLOW_TARGET_THICKNESS_INVERSE")!.coreEvidenceIds.includes("V3-SPHERE-TO-HOLLOW-TUBE-THICKNESS"), "Hollow-target thickness family missing source evidence.");
assert(!MEN_CP_012_CANONICAL_CLUSTERS.some((row) => row.clusterId.includes("UNIT")), "Unit conversion must remain a representation, not a permanent QL identity.");

const correctedPositions = new Set<number>();
const correctedStems = new Set<string>();
for (let index = 0; index < 64; index += 1) {
  const seed = `permanent-correction-proof-${String(index).padStart(3, "0")}`;
  const question = generateMenCp012CorrectedConeRatioV4(seed);
  assert(question.authority === MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY, `${seed}: correction authority mismatch.`);
  assert(question.verification.valid, `${seed}: corrected cone-ratio identity failed verification.`);
  assert(question.stem.includes("cone of height"), `${seed}: corrected source must give cone height.`);
  assert(!question.stem.includes("whose base radius"), `${seed}: corrected source must not give away the cone radius.`);
  assert(question.explanation.steps.some((step) => step.body.includes("r² =") && step.body.includes("so r =")), `${seed}: corrected source must visibly recover radius by square root.`);
  assert(question.options.length === 4 && new Set(question.options.map((option) => option.display)).size === 4, `${seed}: corrected source options invalid.`);
  assert(question.options.filter((option) => option.isCorrect).length === 1, `${seed}: corrected source needs one correct option.`);
  assert(question.options[question.correctIndex]?.display === question.answer, `${seed}: corrected source answer-position parity failed.`);
  correctedPositions.add(question.correctIndex);
  correctedStems.add(question.stem);
}
assert(correctedPositions.size === 4, "Corrected cone-ratio source must reach A/B/C/D.");
assert(correctedStems.size >= 4, `Corrected cone-ratio source needs at least four distinct stems; got ${correctedStems.size}.`);

console.log(JSON.stringify({
  authority: "MEN-CP012-PERMANENT-ALLOCATION-V4-PROOF",
  canonicalClusterCount: mergeAudit.canonicalClusterCount,
  discoverySourceCount: mergeAudit.discoverySourceCount,
  mappedSourceCount: mergeAudit.mappedSourceCount,
  permanentQlCount: allocationAudit.permanentQlCount,
  qlRange: `${allocationAudit.firstQlId}..${allocationAudit.lastQlId}`,
  hollowOwnershipClusterCount: mergeAudit.hollowOwnershipClusterCount,
  correctedConeRatioStates: 64,
  correctedConeRatioDistinctStems: correctedStems.size,
  englishImplementationFrozen: allocationAudit.englishImplementationFrozen,
  lifecycleLocked: allocationAudit.lifecycleLocked,
}, null, 2));
