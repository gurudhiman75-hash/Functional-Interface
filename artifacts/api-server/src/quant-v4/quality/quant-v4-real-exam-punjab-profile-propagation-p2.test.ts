import assert from "node:assert/strict";

import { getQuantV4ExamProfileContract } from "../common/exam-profile";
import type { QuantV4GenerationRequest as CoreQuantV4GenerationRequest } from "../generation-engine-core";
import { runAvg001QuestionStudioPipeline } from "../topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";
import { runMal001QuestionStudioPipeline } from "../topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-adapter";
import type { ProbabilityExamProfile } from "../topics/Probability/shared/types";
import type { MenCp009StandardQuestionStudioRequest } from "../topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/MEN-CP-009/question-studio-runtime";
import {
  QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS,
  QUANT_V4_PUNJAB_SIMULATION_EXAMS,
  QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  runQuantV4PunjabProfilePropagationAudit,
} from "./quant-v4-real-exam-punjab-profile-propagation-p2";

// Compile-time boundary proofs. These @ts-expect-error assertions are intentional:
// if a runtime later gains Punjab profile support, this test must be updated together
// with the audit finding rather than silently continuing to call it profile-blind.
const coreRequestBoundary: CoreQuantV4GenerationRequest = {
  packageId: "PCT-001",
  // @ts-expect-error Quant V4 core request does not yet expose examProfile.
  examProfile: "PUNJAB_STATE",
};
void coreRequestBoundary;

// @ts-expect-error Probability has no PUNJAB_STATE profile contract yet.
const probabilityPunjabProfile: ProbabilityExamProfile = "PUNJAB_STATE";
void probabilityPunjabProfile;

type AvgQuestionStudioInput = Parameters<typeof runAvg001QuestionStudioPipeline>[1];
const avgBoundary: AvgQuestionStudioInput = {
  // @ts-expect-error AVG-001 Question Studio adapter does not yet expose examProfile.
  examProfile: "PUNJAB_STATE",
};
void avgBoundary;

type MalQuestionStudioInput = Parameters<typeof runMal001QuestionStudioPipeline>[1];
const malBoundary: MalQuestionStudioInput = {
  // @ts-expect-error MAL-001 Question Studio adapter does not yet expose examProfile.
  examProfile: "PUNJAB_STATE",
};
void malBoundary;

const menBoundary: MenCp009StandardQuestionStudioRequest = {
  packageId: "MEN-002",
  // @ts-expect-error MEN-002 standard Question Studio route does not yet expose examProfile.
  examProfile: "PUNJAB_STATE",
};
void menBoundary;

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
assert.equal(audit.simulatorPropagationReady, false);
assert.equal(audit.probabilityHasPunjabProfile, false);
assert.ok(audit.blockingFindingCount >= 6);
assert.deepEqual(
  audit.summaries.map((summary) => summary.examId),
  [...QUANT_V4_PUNJAB_SIMULATION_EXAMS],
);
for (const summary of audit.summaries) {
  assert.equal(summary.historicalCentralDeliveryProfile, null, `${summary.examId} historical profile metadata unexpectedly changed.`);
  assert.equal(summary.historicalCentralProfileGap, true, `${summary.examId} historical central-profile gap must remain explicit until downstream routes support Punjab.`);
  assert.equal(summary.centralAuthority, "PUNJAB_STATE");
  assert.equal(summary.centralOptionCount, 4);
  assert.equal(summary.centralDeliveryStyle, "PUNJAB_STATE_OBJECTIVE");
  assert.equal(summary.simulatorPropagationReady, false);
}

const findingBySurface = new Map(
  QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS.map((finding) => [finding.surface, finding]),
);
assert.equal(findingBySurface.get("CENTRAL_EXAM_PROFILE_AUTHORITY")?.status, "SUPPORTED");
assert.equal(findingBySurface.get("HISTORICAL_REAL_EXAM_SIMULATOR")?.status, "STALE_SIMULATOR_METADATA");
assert.equal(findingBySurface.get("CORE_GENERATION_ENGINE")?.status, "PROFILE_BLIND");
assert.equal(findingBySurface.get("QUESTION_STUDIO_AVERAGE_ROUTE")?.status, "PROFILE_BLIND");
assert.equal(findingBySurface.get("QUESTION_STUDIO_MIXTURE_ROUTE")?.status, "PROFILE_BLIND");
assert.equal(findingBySurface.get("LEGACY_ARITHMETIC_RUNTIME_ROUTES")?.status, "PROFILE_BLIND");
assert.equal(findingBySurface.get("MEN_002_STANDARD_QUESTION_STUDIO_ROUTE")?.status, "PROFILE_BLIND");
assert.equal(findingBySurface.get("PROBABILITY_PROFILE_CONTRACT")?.status, "PUNJAB_PROFILE_UNSUPPORTED");

const coreFinding = findingBySurface.get("CORE_GENERATION_ENGINE");
assert.ok(coreFinding?.affectedPackages.includes("PCT-001"));
assert.ok(coreFinding?.affectedPackages.includes("RAP-001"));
assert.ok(coreFinding?.affectedPackages.includes("PRT-001"));
assert.ok(findingBySurface.get("PROBABILITY_PROFILE_CONTRACT")?.affectedPackages.includes("PRB-001"));
assert.ok(findingBySurface.get("PROBABILITY_PROFILE_CONTRACT")?.affectedPackages.includes("PRB-002"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_BOUNDARY_AUDIT_P2",
  authority: audit.authority,
  profilesAudited: audit.profilesAudited,
  simulatorPropagationReady: audit.simulatorPropagationReady,
  probabilityHasPunjabProfile: audit.probabilityHasPunjabProfile,
  blockingFindingCount: audit.blockingFindingCount,
  findings: audit.findings,
  summaries: audit.summaries,
}));
