import assert from "node:assert/strict";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
  blrCp003V7CandidateAuthorityCounts,
  blrCp003V7VisualPairs,
  generateBlrCp003LearnerEvidenceV7Candidates,
} from "./cp003-learner-evidence-v7-candidate";

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function learnerText(record: ReturnType<typeof generateBlrCp003LearnerEvidenceV7Candidates>[number]): string {
  return [
    record.stem,
    ...record.editorial.coreConcept,
    ...record.editorial.stepByStepSolution,
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ].join(" ");
}

const records = generateBlrCp003LearnerEvidenceV7Candidates();
const counts = blrCp003V7CandidateAuthorityCounts(records);
const answerPositions = [0, 0, 0, 0];
const itemIds = new Set<string>();
const fingerprints = new Set<string>();

assert.equal(
  BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
  "BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_V1",
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
  assert.match(record.itemId, /-V7-/);
  assert.ok(!itemIds.has(record.itemId));
  itemIds.add(record.itemId);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.text)).size, 4);
  assert.equal(new Set(record.options.map((option) => option.semanticKey)).size, 4);
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
    "blr-cp003-learner-evidence-v7-candidate-v1",
  );
  assert.equal(
    record.metadata.remediationVersion,
    BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
  );
  assert.equal(record.metadata.editorialRemediationApplied, true);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.compositeAnswerPremiseRepeated, false);
  assert.equal(record.metadata.uniqueAnswer, true);
  assert.equal(record.metadata.optionSemanticsUnique, true);
  assert.equal(record.metadata.nativeSvgFamilyTree, true);
  assert.equal(record.metadata.asciiFallbackRetained, true);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);

  const pathPersonIds = record.proceduralLogic.query?.pathPersonIds ?? [];
  const highlightedNodes = new Set(pathPersonIds);
  const highlightedPairs = blrCp003V7VisualPairs(record);
  assert.ok(pathPersonIds.length >= 3);
  for (const evidencePath of record.evidencePaths) {
    for (const personId of evidencePath.personIds) {
      assert.ok(
        highlightedNodes.has(personId),
        `${record.itemId} visual evidence omits node ${personId}`,
      );
    }
    for (let index = 0; index < evidencePath.personIds.length - 1; index += 1) {
      const key = pairKey(
        evidencePath.personIds[index]!,
        evidencePath.personIds[index + 1]!,
      );
      assert.ok(
        highlightedPairs.has(key),
        `${record.itemId} visual evidence omits edge ${key}`,
      );
    }
  }

  const markup = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
  assert.ok(markup.includes("<svg"));
  assert.ok(markup.includes("Answer:"));
  assert.ok(!markup.includes("undefined"));
  assert.ok(!markup.includes("[object Object]"));
  assert.ok(record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"));
}

assert.deepEqual(answerPositions, [5, 5, 5, 5]);

const genderRecords = records.filter(
  (record) => record.provisionalAuthority === "DETERMINE_MEMBER_GENDER",
);
assert.equal(genderRecords.length, 4);
for (const record of genderRecords) {
  assert.equal(record.answerType, "GENDER_LABEL");
  assert.equal(record.answerSemanticKey, "GENDER:MALE");
  assert.match(
    record.stem,
    /father's sibling who is explicitly stated to be unmarried\?$/,
  );
  assert.doesNotMatch(
    record.stem,
    /\b(?:uncle|aunt|brother|sister|son|daughter|husband|wife|father|mother)\s*\?$/i,
  );
  assert.doesNotMatch(learnerText(record), /paternal uncle/i);
  assert.match(learnerText(record), /separate(?:ly)? (?:states|son-or-daughter|son clue)/i);
}

const pairRecords = records.filter(
  (record) => record.provisionalAuthority === "SELECT_UNORDERED_FAMILY_PAIR",
);
assert.equal(pairRecords.length, 4);
for (const record of pairRecords) {
  assert.equal(record.answerType, "UNORDERED_PERSON_PAIR");
  assert.equal(record.answerSemanticKey, "PAIR:F:H");
  assert.equal(record.stem, "Which of the following pairs consists of cousins?");
  assert.doesNotMatch(learnerText(record), /\bunordered\b/i);
}

const setRecords = records.filter(
  (record) => record.provisionalAuthority === "IDENTIFY_ALL_MEMBERS_BY_RELATION",
);
assert.equal(setRecords.length, 4);
for (const record of setRecords) {
  assert.equal(record.answerType, "PERSON_NAME_SET");
  assert.equal(record.answerSemanticKey, "PERSON_SET:D:E");
  assert.equal(record.evidencePaths.length, 2);
  assert.match(record.proceduralLogic.accessibleSummary, /highlighted answer paths are/i);
  const highlightedNodes = new Set(record.proceduralLogic.query?.pathPersonIds ?? []);
  assert.ok(highlightedNodes.has("D"));
  assert.ok(highlightedNodes.has("E"));
  assert.deepEqual(
    record.evidencePaths.map((path) => path.relationId).sort(),
    ["AUNT", "UNCLE"],
  );
}

assert.equal(
  records.filter(
    (record) => record.provisionalAuthority === "DETERMINE_MEMBER_MARITAL_STATUS",
  ).length,
  4,
);
assert.equal(
  records.filter(
    (record) => record.provisionalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
  ).length,
  4,
);

console.log(
  JSON.stringify(
    {
      candidateVersion: BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
      candidateRecords: records.length,
      authorityCounts: counts,
      answerPositions,
      genderTautologies: 0,
      learnerFacingUnorderedTerms: 0,
      incompleteSetVisuals: 0,
      permanentQlCount: 0,
      humanReviewApproved: false,
      verdict:
        "BLR-CP-003 V7 REMEDIATION PASSES ALL 12 EDITORIAL AND VISUAL CORRECTION CONTRACTS; EXPLICIT HUMAN APPROVAL STILL REQUIRED",
    },
    null,
    2,
  ),
);
