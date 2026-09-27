import assert from "node:assert/strict";

import {
  getQuantV4SpecializedProfileSelectionContract,
} from "../common/specialized-profile-selection";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  assertFrequencyShares,
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
} from "./quant-v4-pyq-frequency-evidence-p2";

const profile = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CHSL",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 8,
    minCountableQuestions: 20,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});

assert.equal(profile.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.equal(profile.countableQuestionCount, 26);
assert.equal(profile.distinctPaperCount, 7);
assert.equal(profile.topicCoverageCount, 6);
assert.deepEqual([...profile.blockers].sort(), [
  "DATED_PAPER_IDENTITY_INCOMPLETE",
  "DISTINCT_PAPER_SAMPLE_BELOW_POLICY",
]);
assert.equal(canReplaceProvisionalSimulationWeights(profile), false);
assertFrequencyShares(profile);

const avg = getQuantV4SpecializedProfileSelectionContract("AVG-001", "SSC_CGL_CHSL");
const tmw = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_CHSL");

assert.equal(avg.normalizedCountableObservationCount, 6);
assert.equal(avg.empiricalEvidenceStatus, "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING");
assert.equal(avg.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.equal(avg.profileSelectionCalibrated, false);
assert.equal(avg.deliveryAllowed, true);

assert.equal(tmw.normalizedCountableObservationCount, 5);
assert.equal(tmw.empiricalEvidenceStatus, "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING");
assert.equal(tmw.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.equal(tmw.profileSelectionCalibrated, false);
assert.equal(tmw.deliveryAllowed, true);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CHSL_SPECIALIZED_SELECTION_EVIDENCE_P2",
  profile: {
    countableQuestionCount: profile.countableQuestionCount,
    distinctPaperCount: profile.distinctPaperCount,
    topicCoverageCount: profile.topicCoverageCount,
    blockers: profile.blockers,
    empiricalWeightCandidate: canReplaceProvisionalSimulationWeights(profile),
  },
  specialized: {
    "AVG-001": {
      observations: avg.normalizedCountableObservationCount,
      selectionStatus: avg.selectionStatus,
      profileSelectionCalibrated: avg.profileSelectionCalibrated,
    },
    "TMW-001": {
      observations: tmw.normalizedCountableObservationCount,
      selectionStatus: tmw.selectionStatus,
      profileSelectionCalibrated: tmw.profileSelectionCalibrated,
    },
  },
}));
