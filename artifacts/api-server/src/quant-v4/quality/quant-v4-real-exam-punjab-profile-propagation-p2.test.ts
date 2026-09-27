import assert from "node:assert/strict";

import { getQuantV4ExamProfileContract } from "../common/exam-profile";
import type { QuantV4GenerationRequest as CoreQuantV4GenerationRequest } from "../generation-engine-core";
import { runAvg001QuestionStudioPipeline } from "../topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";
import { runMal001QuestionStudioPipeline } from "../topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-adapter";
import type { ProbabilityExamProfile } from "../topics/Probability/shared/types";
import type { MenCp009StandardQuestionStudioRequest } from "../topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/MEN-CP-009/question-studio-runtime";
import {
  QUANT_V4_REAL_EXAM_PROFILES,
  resolveProbabilitySimulationProfile,
} from "./quant-v4-real-exam-simulation-p2";
import {
  QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS,
  QUANT_V4_PUNJAB_SIMULATION_EXAMS,
  QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  runQuantV4PunjabProfilePropagationAudit,
} from "./quant-v4-real-exam-punjab-profile-propagation-p2";

// Native Probability selection is intentionally still evidence-gated.
// The public Quant delivery layer may carry PUNJAB_STATE even though the raw
// Probability selection profile does not yet own a Punjab contract.
// @ts-expect-error Probability has no native PUNJAB_STATE profile contract yet.
const probabilityPunjabProfile: ProbabilityExamProfile = "PUNJAB_STATE";
void probabilityPunjabProfile;

const central = getQuantV4ExamProfileContract("PUNJAB_STATE");
assert.equal(central.family, "PUNJAB_STATE");
assert.equal(central.deliveryStyle, "PUNJAB_STATE_OBJECTIVE");
assert.equal(central.optionCount, 4);
assert.equal(
  QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  "QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2",
);

const audit = runQuantV4PunjabProfilePropagationAudit();
assert.equal(audit.profilesAudited, 3);
assert.equal(audit.simulatorPropagationReady, true);
assert.equal(audit.probabilityHasPunjabProfile, false);
assert.equal(audit.blockingFindingCount, 1);
assert.ok(audit.selectionPendingFindingCount >= 4);
assert.deepEqual(
  audit.summaries.map((summary) => summary.examId),
  [...QUANT_V4_PUNJAB_SIMULATION_EXAMS],
);
for (const summary of audit.summaries) {
  assert.equal(summary.historicalCentralDeliveryProfile, "PUNJAB_STATE", `${summary.examId} must carry the Punjab central profile.`);
  assert.equal(summary.historicalCentralProfileGap, false, `${summary.examId} must no longer expose the old central-profile metadata gap.`);
  assert.equal(summary.centralAuthority, "PUNJAB_STATE");
  assert.equal(summary.centralOptionCount, 4);
  assert.equal(summary.centralDeliveryStyle, "PUNJAB_STATE_OBJECTIVE");
  assert.equal(summary.simulatorPropagationReady, true);
  const simulatorProfile = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === summary.examId);
  assert.ok(simulatorProfile, `Missing simulator profile ${summary.examId}.`);
  assert.equal(
    resolveProbabilitySimulationProfile(simulatorProfile),
    "PUNJAB_STATE",
    `${summary.examId} Probability must route to the explicit Punjab evidence gate.`,
  );
}

const findingBySurface = new Map(
  QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS.map((finding) => [finding.surface, finding]),
);
assert.equal(findingBySurface.get("CENTRAL_EXAM_PROFILE_AUTHORITY")?.status, "SUPPORTED");
assert.equal(findingBySurface.get("HISTORICAL_REAL_EXAM_SIMULATOR")?.status, "SUPPORTED");
assert.equal(findingBySurface.get("REAL_EXAM_PROBABILITY_RESOLVER")?.status, "SUPPORTED");
assert.equal(findingBySurface.get("CORE_GENERATION_ENGINE")?.status, "DELIVERY_SUPPORTED_SELECTION_PENDING");
assert.equal(findingBySurface.get("QUESTION_STUDIO_AVERAGE_ROUTE")?.status, "DELIVERY_SUPPORTED_SELECTION_PENDING");
assert.equal(findingBySurface.get("QUESTION_STUDIO_MIXTURE_ROUTE")?.status, "DELIVERY_SUPPORTED_SELECTION_PENDING");
assert.equal(findingBySurface.get("LEGACY_ARITHMETIC_RUNTIME_ROUTES")?.status, "DELIVERY_SUPPORTED_SELECTION_PENDING");
assert.equal(findingBySurface.get("MEN_002_STANDARD_QUESTION_STUDIO_ROUTE")?.status, "SUPPORTED");
assert.equal(findingBySurface.get("PROBABILITY_PROFILE_CONTRACT")?.status, "EVIDENCE_GATED");

const coreFinding = findingBySurface.get("CORE_GENERATION_ENGINE");
assert.ok(coreFinding?.affectedPackages.includes("PCT-001"));
assert.ok(coreFinding?.affectedPackages.includes("RAP-001"));
assert.ok(coreFinding?.affectedPackages.includes("PRT-001"));
assert.ok(findingBySurface.get("REAL_EXAM_PROBABILITY_RESOLVER")?.affectedPackages.includes("PSSSB"));
assert.ok(findingBySurface.get("REAL_EXAM_PROBABILITY_RESOLVER")?.affectedPackages.includes("PPSC"));
assert.ok(findingBySurface.get("REAL_EXAM_PROBABILITY_RESOLVER")?.affectedPackages.includes("PUNJAB_POLICE"));
assert.ok(findingBySurface.get("PROBABILITY_PROFILE_CONTRACT")?.affectedPackages.includes("PRB-001"));
assert.ok(findingBySurface.get("PROBABILITY_PROFILE_CONTRACT")?.affectedPackages.includes("PRB-002"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_BOUNDARY_AUDIT_P2",
  authority: audit.authority,
  profilesAudited: audit.profilesAudited,
  simulatorPropagationReady: audit.simulatorPropagationReady,
  probabilityHasPunjabProfile: audit.probabilityHasPunjabProfile,
  selectionPendingFindingCount: audit.selectionPendingFindingCount,
  probabilitySimulatorResolver: "PUNJAB_STATE_DIRECT_EVIDENCE_GATE",
  blockingFindingCount: audit.blockingFindingCount,
  findings: audit.findings,
  summaries: audit.summaries,
}));
