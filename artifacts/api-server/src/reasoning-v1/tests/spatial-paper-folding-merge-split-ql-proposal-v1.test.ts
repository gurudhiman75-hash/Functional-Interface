import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_QL_PROPOSAL_V1,
  PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1,
} from "../foundation/spatial/paper-folding-merge-split-ql-proposal-v1";
import { PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1 } from "../foundation/spatial/paper-folding-post-wave2-saturation-audit-v1";

assert.equal(PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1.unimplementedSourceBackedSscCoreGapCount, 0);
assert.equal(
  PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1.status,
  "SSC_CORE_SOURCE_SATURATION_CANDIDATE_PENDING_EXECUTABLE_CI_AND_MERGE_SPLIT_REVIEW",
);

const authority = PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_QL_PROPOSAL_V1;
assert.equal(authority.status, "SOURCE_SATURATED_SKILL_BOUNDARIES_PROPOSED_IDS_UNALLOCATED");
assert.equal(authority.exactGreenWave2Head, "14a90bd0d85c90efe1dd5e26fa37e1400506b666");
assert.equal(authority.exactGreenWave2Run, 32207606025);
assert.equal(authority.exactGreenWave2Artifact, 9349644988);
assert.equal(authority.proposalCounts.pfc, 5);
assert.equal(authority.proposalCounts.tpf, 1);
assert.equal(authority.proposalCounts.total, 6);

assert.equal(authority.decisions.sourceSheetShapeCreatesQl, false);
assert.equal(authority.decisions.cutShapeCreatesQl, false);
assert.equal(authority.decisions.foldDirectionCreatesQl, false);
assert.equal(authority.decisions.foldDepthCreatesQl, false);
assert.equal(authority.decisions.forwardVsReverseCreatesQlBoundary, true);
assert.equal(authority.decisions.opaqueVsTransparentCreatesChapterBoundary, true);
assert.equal(authority.decisions.oldForwardQlConceptsRetained, 4);

assert.equal(authority.allocationGovernance.permanentIdsAssigned, false);
assert.equal(authority.allocationGovernance.permanentQlAllocationAllowed, false);
assert.equal(authority.allocationGovernance.englishDiscoveryRuntimeAllowed, true);
assert.equal(authority.allocationGovernance.englishFreezeAllowed, false);
assert.equal(authority.allocationGovernance.localizationAllowed, false);
assert.equal(authority.allocationGovernance.questionStudioAllowed, false);
assert.equal(authority.allocationGovernance.questionBankWritable, false);
assert.equal(authority.allocationGovernance.testEligible, false);
assert.equal(authority.allocationGovernance.automaticPublication, false);
assert.equal(authority.nextGate, "PFC_TPF_SOURCE_SATURATED_ENGLISH_RUNTIME_DISCOVERY_AND_REVIEW");

assert.equal(PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.length, 6);
assert.equal(new Set(PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.map((item) => item.proposalId)).size, 6);
assert.equal(PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.every((item) => item.permanentQlId === null), true);
assert.equal(
  PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.every((item) => item.allocationStatus === "PROPOSAL_ONLY_NO_PERMANENT_ID"),
  true,
);

const pfc = PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.filter((item) => item.chapterCode === "PFC-001");
const tpf = PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.filter((item) => item.chapterCode === "TPF-001");
assert.equal(pfc.length, 5);
assert.equal(tpf.length, 1);

const retained = pfc.filter((item) => item.historicalQlRelationship === "RETAIN_AND_EXPAND");
assert.equal(retained.length, 4);
assert.deepEqual(
  retained.map((item) => item.historicalQlId).sort(),
  ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"],
);

const reverse = PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.find((item) => item.proposalId === "PFC-PROP-05")!;
assert.equal(reverse.taskContract, "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE");
assert.equal(reverse.historicalQlRelationship, "NEW_DISTINCT_SKILL");
assert.equal(reverse.historicalQlId, null);
assert.deepEqual(reverse.sourceShapes, ["SQUARE", "RECTANGLE"]);
assert.deepEqual(reverse.foldFamilies, ["ONE_FOLD_REVERSE", "TWO_FOLD_REVERSE", "THREE_FOLD_REVERSE"]);

const transparent = PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.find((item) => item.proposalId === "TPF-PROP-01")!;
assert.equal(transparent.taskContract, "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION");
assert.equal(transparent.historicalQlRelationship, "SEPARATE_CHAPTER_SKILL");
assert.deepEqual(transparent.sourceShapes, ["SQUARE"]);
assert.deepEqual(transparent.foldFamilies, ["SINGLE_VERTICAL", "SINGLE_HORIZONTAL"]);

const topology = PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.find((item) => item.proposalId === "PFC-PROP-04")!;
assert.ok(topology.cutFamilies.includes("CREASE_COALESCENCE"));
assert.ok(topology.cutFamilies.includes("V_NOTCH"));
assert.ok(topology.cutFamilies.includes("SLIT"));

const evidence = {
  authority,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_QL_PROPOSAL_V1",
  proposalCount: PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.length,
  proposals: PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1,
  conclusions: {
    sourceSheetShapeIsRepresentationAxis: true,
    cutShapeIsRepresentationAxis: true,
    foldDepthIsDifficultyAxis: true,
    fourForwardPfcSkillsRetainedConceptually: true,
    reverseInferenceIsSeparatePfcSkill: true,
    transparentSuperpositionIsSeparateChapterSkill: true,
    permanentIdsAllocated: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-merge-split-ql-proposal-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
