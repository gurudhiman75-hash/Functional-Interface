import assert from "node:assert/strict";

import { generateQuestion } from "../generation-engine";
import {
  PROBABILITY_PUNJAB_PROFILE_GATE,
  PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY,
  ProbabilityPunjabProfileEvidenceError,
  generateProbabilityQuestionStudioBatch,
  listProbabilityStandardQuestionStudioPackages,
} from "../topics/Probability/question-studio-integration";

assert.equal(PROBABILITY_PUNJAB_PROFILE_GATE.examProfile, "PUNJAB_STATE");
assert.equal(PROBABILITY_PUNJAB_PROFILE_GATE.status, "EVIDENCE_GATED");
assert.equal(PROBABILITY_PUNJAB_PROFILE_GATE.centralOptionCount, 4);
assert.equal(PROBABILITY_PUNJAB_PROFILE_GATE.generationAllowed, false);
assert.equal(PROBABILITY_PUNJAB_PROFILE_GATE.fallbackAllowed, false);
assert.equal(PROBABILITY_PUNJAB_PROFILE_GATE.authority, PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY);
assert.ok(PROBABILITY_PUNJAB_PROFILE_GATE.requiredEvidence.length >= 3);

for (const pkg of listProbabilityStandardQuestionStudioPackages()) {
  assert.ok((pkg as any).evidenceGatedExamProfiles.includes("PUNJAB_STATE"));
  assert.equal((pkg as any).punjabProfileGate.status, "EVIDENCE_GATED");
  assert.equal((pkg as any).punjabProfileGate.fallbackAllowed, false);
}

function assertEvidenceGate(error: unknown) {
  assert.ok(error instanceof ProbabilityPunjabProfileEvidenceError);
  assert.equal((error as ProbabilityPunjabProfileEvidenceError).statusCode, 409);
  assert.equal((error as ProbabilityPunjabProfileEvidenceError).code, "PRB_PUNJAB_PROFILE_EVIDENCE_REQUIRED");
  assert.equal((error as ProbabilityPunjabProfileEvidenceError).examProfile, "PUNJAB_STATE");
  assert.equal((error as ProbabilityPunjabProfileEvidenceError).authority, PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY);
  assert.match(String((error as Error).message), /SSC\/generic fallback is forbidden/u);
}

let directError: unknown;
try {
  generateProbabilityQuestionStudioBatch({
    packageId: "PRB-001",
    canonicalProblemId: "PRB-CP-001",
    examProfile: "PUNJAB_STATE" as any,
    count: 1,
    seed: "prb-punjab-gate:direct",
  });
} catch (error) {
  directError = error;
}
assertEvidenceGate(directError);

let publicError: unknown;
try {
  await generateQuestion({
    packageId: "PRB-001" as any,
    canonicalProblemId: "PRB-CP-001",
    examProfile: "PUNJAB_STATE",
    count: 1,
    seed: "prb-punjab-gate:public",
  });
} catch (error) {
  publicError = error;
}
assertEvidenceGate(publicError);

let runtimeModeError: unknown;
try {
  generateProbabilityQuestionStudioBatch({
    packageId: "PRB-002",
    canonicalProblemId: "PRB-CP-008",
    runtimeMode: "PUNJAB_STATE" as any,
    count: 1,
    seed: "prb-punjab-gate:runtime-mode",
  } as any);
} catch (error) {
  runtimeModeError = error;
}
assertEvidenceGate(runtimeModeError);

let legacySimulatorFallbackError: unknown;
try {
  generateProbabilityQuestionStudioBatch({
    packageId: "PRB-001",
    canonicalProblemId: "PRB-CP-001",
    examProfile: "SSC_CGL_CHSL",
    count: 1,
    seed: "QUANT-V4-REAL-EXAM-SIMULATION-CI:PSSSB:1:PROBABILITY:19",
  });
} catch (error) {
  legacySimulatorFallbackError = error;
}
assertEvidenceGate(legacySimulatorFallbackError);

const ssc = await generateQuestion({
  packageId: "PRB-001" as any,
  canonicalProblemId: "PRB-CP-001",
  examProfile: "SSC_CGL_CHSL",
  count: 2,
  seed: "prb-punjab-gate:ssc-control",
});
assert.equal(ssc.generationContext.profileTransportStatus, "APPLIED_DOWNSTREAM");
assert.ok(ssc.questions.every((question: any) => question.examProfile === "SSC_CGL_CHSL"));
assert.ok(ssc.questions.every((question: any) => question.options.length === 4));

const banking = await generateQuestion({
  packageId: "PRB-001" as any,
  canonicalProblemId: "PRB-CP-001",
  examProfile: "BANKING_PRELIMS",
  count: 2,
  seed: "prb-punjab-gate:bank-control",
});
assert.equal(banking.generationContext.profileTransportStatus, "APPLIED_DOWNSTREAM");
assert.ok(banking.questions.every((question: any) => question.examProfile === "BANKING_PRELIMS"));
assert.ok(banking.questions.every((question: any) => question.options.length === 5));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PROBABILITY_PUNJAB_EVIDENCE_GATE_P2",
  authority: PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY,
  punjabProfileStatus: PROBABILITY_PUNJAB_PROFILE_GATE.status,
  fallbackAllowed: PROBABILITY_PUNJAB_PROFILE_GATE.fallbackAllowed,
  legacySimulatorFallbackBlocked: true,
  controls: {
    ssc: ssc.generationContext.profileTransportStatus,
    banking: banking.generationContext.profileTransportStatus,
  },
}));
