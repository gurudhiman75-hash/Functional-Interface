import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  PFC_001_CONTENT_INNOVATION_ENVELOPE_V1,
  validatePfcInnovationCandidateV1,
} from "../foundation/spatial/paper-folding-content-innovation-envelope-v1";
import { PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-hexagon-product-owner-approval-v1";
import {
  PFC_001_INNOVATION_DISCOVERY_AUTHORITY_V1,
  pfcInnovationDiscoveryScenariosV1,
  solveAllPfcInnovationScenariosV1,
} from "../foundation/spatial/paper-folding-innovation-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1.approved, "Hexagon approval must be recorded before innovation expansion.");
assert(PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.policy === "PYQ_COVERAGE_IS_THE_FLOOR_NOT_THE_CEILING", "Innovation policy must preserve PYQ-as-floor rule.");
const shareTotal = Object.values(PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.lanes).reduce((sum, lane) => sum + lane.recommendedShare, 0);
assert(Math.abs(shareTotal - 1) < 1e-9, "Recommended core/novel/stretch shares must total 1.0.");
assert(PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.generationRules.pyqExactCloneAllowed === false, "Exact PYQ cloning must stay disabled.");
assert(PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.generationRules.newQlRequiredOnlyForNewLearnerSkill === true, "Novel representation must not manufacture QLs.");

const scenarios = pfcInnovationDiscoveryScenariosV1();
assert(scenarios.length === PFC_001_INNOVATION_DISCOVERY_AUTHORITY_V1.candidateCount, "Innovation discovery candidate count drifted.");
for (const scenario of scenarios) {
  validatePfcInnovationCandidateV1(scenario.candidate);
  assert(scenario.candidate.provenance === "CONTROLLED_NOVEL", `${scenario.candidate.candidateId} must be tagged controlled novel.`);
  assert(scenario.candidate.novelAxes.length >= 1, `${scenario.candidate.candidateId} must declare novelty.`);
}

const profiles = new Set(scenarios.map((scenario) => scenario.substrateProfile));
for (const required of ["REGULAR_PENTAGON", "REGULAR_OCTAGON", "SKEWED_CONVEX_POLYGON"]) {
  assert(profiles.has(required as never), `Missing controlled-novel substrate ${required}.`);
}
assert(scenarios.some((scenario) => scenario.folds.length >= 2), "Innovation wave must include at least one multi-fold construction.");
assert(scenarios.some((scenario) => scenario.candidate.novelAxes.includes("SYMMETRY_BREAK")), "Innovation wave must include a symmetry-breaking construction.");

const solved = solveAllPfcInnovationScenariosV1();
assert(solved.length === scenarios.length, "Every innovation scenario must solve.");
assert(new Set(solved.map((solution) => solution.fingerprint)).size === solved.length, "Innovation answers must have unique semantic fingerprints.");
for (const solution of solved) {
  assert(solution.affectedLayerCount >= 2, `${solution.candidateId} must cut at least two folded layers.`);
  assert(solution.unfoldedPositions.length === solution.affectedLayerCount, `${solution.candidateId} must map one unique imprint per affected layer.`);
  assert(solution.unfoldedPositions.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)), `${solution.candidateId} produced invalid unfolded coordinates.`);
}

const evidence = {
  status: "PASS_PFC_CONTROLLED_NOVEL_DISCOVERY_V1",
  authorityId: PFC_001_INNOVATION_DISCOVERY_AUTHORITY_V1.authorityId,
  policyAuthority: PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.authorityId,
  hexagonApprovalAuthority: PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  candidateCount: solved.length,
  substrateProfiles: [...profiles].sort(),
  multiFoldCandidateCount: scenarios.filter((scenario) => scenario.folds.length >= 2).length,
  recommendedRuntimeMix: Object.fromEntries(Object.entries(PFC_001_CONTENT_INNOVATION_ENVELOPE_V1.lanes).map(([key, lane]) => [key, lane.recommendedShare])),
  candidates: scenarios.map((scenario, index) => ({
    candidateId: scenario.candidate.candidateId,
    proposalId: scenario.candidate.proposalId,
    substrateProfile: scenario.substrateProfile,
    novelAxes: scenario.candidate.novelAxes,
    intendedDifficulty: scenario.candidate.intendedDifficulty,
    foldCount: scenario.folds.length,
    affectedLayerCount: solved[index].affectedLayerCount,
    cutCenter: solved[index].cutCenter,
    unfoldedPositions: solved[index].unfoldedPositions,
    fingerprint: solved[index].fingerprint,
  })),
};

const output = resolve(process.cwd(), "dist/reasoning-v1/spatial/spa-pfc-controlled-novel-discovery-v1-evidence.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
