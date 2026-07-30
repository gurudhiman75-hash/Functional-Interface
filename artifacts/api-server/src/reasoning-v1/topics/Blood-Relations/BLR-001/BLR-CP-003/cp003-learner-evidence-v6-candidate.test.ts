import assert from "node:assert/strict";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION,
  blrCp003V6CandidateAuthorityCounts,
  generateBlrCp003LearnerEvidenceV6Candidates,
} from "./cp003-learner-evidence-v6-candidate";

const records = generateBlrCp003LearnerEvidenceV6Candidates();
const counts = blrCp003V6CandidateAuthorityCounts(records);
const fingerprints = new Set<string>();
const itemIds = new Set<string>();
const answerPositions = [0, 0, 0, 0];

assert.equal(
  BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION,
  "BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_V1",
);
assert.equal(records.length, 20);
assert.deepEqual(counts, {
  DETERMINE_MEMBER_GENDER: 4,
  SELECT_UNORDERED_FAMILY_PAIR: 4,
  IDENTIFY_ALL_MEMBERS_BY_RELATION: 4,
  DETERMINE_MEMBER_MARITAL_STATUS: 4,
  IDENTIFY_MEMBER_BY_MARITAL_STATUS: 4,
});

for (const record of records) {
  assert.equal(record.packageId, "BLR-001");
  assert.equal(record.checkpointId, "BLR-CP-003");
  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.locale, "en-IN");
  assert.ok(!itemIds.has(record.itemId));
  itemIds.add(record.itemId);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.text)).size, 4);
  assert.equal(
    new Set(record.options.map((option) => option.semanticKey)).size,
    4,
  );
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);
  answerPositions[record.correctIndex] += 1;
  assert.ok(record.evidencePaths.length >= 1);
  assert.ok(record.evidencePaths.every((path) => path.distance >= 2));
  assert.ok(
    record.evidencePaths.every(
      (path) => path.personIds.length === path.distance + 1,
    ),
  );
  assert.equal(
    record.metadata.runtimeVersion,
    "blr-cp003-learner-evidence-v6-candidate-v1",
  );
  assert.equal(record.metadata.competitiveCandidate, true);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.compositeAnswerPremiseRepeated, false);
  assert.ok(record.metadata.minimumEvidenceDistance >= 2);
  assert.equal(record.metadata.uniqueAnswer, true);
  assert.equal(record.metadata.optionSemanticsUnique, true);
  assert.equal(record.metadata.nativeSvgFamilyTree, true);
  assert.equal(record.metadata.asciiFallbackRetained, true);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  assert.equal(record.editorial.optionAnalysis.length, 4);
  assert.ok(record.editorial.coreConcept.length >= 2);
  assert.ok(record.editorial.stepByStepSolution.length >= 4);
  assert.ok(record.editorial.conclusion.length > 20);
  assert.ok(record.editorial.examShortcut.length > 30);
  assert.ok(record.editorial.commonTraps.length >= 2);
  assert.equal(record.proceduralLogic.kind, "blood-relation-family-tree");
  assert.equal(record.proceduralLogic.version, 1);
  assert.ok(record.proceduralLogic.nodes.length >= 7);
  assert.ok(record.proceduralLogic.edges.length >= 6);
  assert.ok(record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"));
  assert.ok(record.proceduralLogic.query?.subjectId);
  assert.ok(record.proceduralLogic.query?.referenceId);
  assert.ok(record.proceduralLogic.query?.answerLabel);
  assert.ok(record.proceduralLogic.query?.pathPersonIds?.length >= 3);
  const markup = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
  assert.ok(markup.includes("<svg"));
  assert.ok(markup.includes("Answer:"));
  assert.ok(!markup.includes("undefined"));
  assert.ok(!markup.includes("[object Object]"));
  assert.ok(!record.stem.includes("PAIR:"));
  assert.ok(!record.stem.includes("PERSON_SET:"));
  assert.ok(!record.sharedPrompt.includes("undefined"));
}

assert.deepEqual(answerPositions, [5, 5, 5, 5]);

for (const record of records.filter(
  (entry) => entry.provisionalAuthority === "DETERMINE_MEMBER_GENDER",
)) {
  assert.equal(record.answerType, "GENDER_LABEL");
  assert.equal(record.answerSemanticKey, "GENDER:MALE");
  assert.deepEqual(record.evidencePaths.map((path) => path.relationId), ["UNCLE"]);
}

for (const record of records.filter(
  (entry) => entry.provisionalAuthority === "SELECT_UNORDERED_FAMILY_PAIR",
)) {
  assert.equal(record.answerType, "UNORDERED_PERSON_PAIR");
  assert.equal(record.answerSemanticKey, "PAIR:F:H");
  assert.deepEqual(record.evidencePaths.map((path) => path.relationId), ["COUSIN"]);
}

for (const record of records.filter(
  (entry) => entry.provisionalAuthority === "IDENTIFY_ALL_MEMBERS_BY_RELATION",
)) {
  assert.equal(record.answerType, "PERSON_NAME_SET");
  assert.equal(record.answerSemanticKey, "PERSON_SET:D:E");
  assert.deepEqual(
    record.evidencePaths.map((path) => path.relationId).sort(),
    ["AUNT", "UNCLE"],
  );
}

for (const record of records.filter(
  (entry) => entry.provisionalAuthority === "DETERMINE_MEMBER_MARITAL_STATUS",
)) {
  assert.equal(record.answerType, "MARITAL_STATUS_LABEL");
  assert.equal(record.answerSemanticKey, "STATUS:UNMARRIED");
  assert.deepEqual(record.evidencePaths.map((path) => path.relationId), ["UNCLE"]);
}

for (const record of records.filter(
  (entry) => entry.provisionalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
)) {
  assert.equal(record.answerType, "PERSON_NAME");
  assert.equal(record.answerSemanticKey, "PERSON:E");
  assert.deepEqual(record.evidencePaths.map((path) => path.relationId), ["UNCLE"]);
}

console.log(
  JSON.stringify(
    {
      candidateVersion: BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION,
      candidateRecords: records.length,
      authorityCounts: counts,
      answerPositions,
      uniqueFingerprints: fingerprints.size,
      permanentQlCount: 0,
      humanReviewApproved: false,
      verdict:
        "BLR-CP-003 V6 CANDIDATE PACK GENERATED FOR ALL FIVE BLOCKED AUTHORITIES; HUMAN REVIEW STILL REQUIRED",
    },
    null,
    2,
  ),
);
