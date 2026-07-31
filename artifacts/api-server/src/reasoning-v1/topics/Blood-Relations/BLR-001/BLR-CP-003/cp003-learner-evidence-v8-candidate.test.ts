import assert from "node:assert/strict";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
  BLR_CP003_V8_FULL_BANK_SEEDS,
  blrCp003V8CandidateAuthorityCounts,
  blrCp003V8VisualPairs,
  generateBlrCp003LearnerEvidenceV8Candidates,
} from "./cp003-learner-evidence-v8-candidate";
import {
  BLR_CP003_V8_AUTHORITY_DISPOSITIONS,
  BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
  blrCp003V8DispositionFor,
  blrCp003V8RetainedAuthorities,
} from "./cp003-v8-authenticity-authority-audit";

const pairKey = (left: string, right: string): string =>
  [left, right].sort().join("::");

const records = generateBlrCp003LearnerEvidenceV8Candidates();
const counts = blrCp003V8CandidateAuthorityCounts(records);
const answerPositions = [0, 0, 0, 0];
const itemIds = new Set<string>();
const fingerprints = new Set<string>();
const promptsByGroup = new Map<string, string>();

assert.equal(
  BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
  "BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_V1",
);
assert.equal(
  BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
  "BLR_CP003_V8_AUTHORITY_AUDIT_V1",
);
assert.equal(BLR_CP003_V8_FULL_BANK_SEEDS.length, 26);
assert.equal(records.length, 130);
assert.deepEqual(counts, {
  SELECT_UNORDERED_FAMILY_PAIR: 52,
  IDENTIFY_ALL_MEMBERS_BY_RELATION: 52,
  IDENTIFY_MEMBER_BY_MARITAL_STATUS: 26,
});
assert.deepEqual([...blrCp003V8RetainedAuthorities()].sort(), [
  "IDENTIFY_ALL_MEMBERS_BY_RELATION",
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
  "SELECT_UNORDERED_FAMILY_PAIR",
]);
assert.equal(BLR_CP003_V8_AUTHORITY_DISPOSITIONS.length, 6);

const genderDisposition = blrCp003V8DispositionFor("DETERMINE_MEMBER_GENDER");
assert.equal(genderDisposition.decision, "MERGE_EXISTING");
assert.equal(genderDisposition.targetQlId, "BLR-QL-003");
assert.match(genderDisposition.rationale, /four-option gender-label question/i);
const maritalDisposition = blrCp003V8DispositionFor(
  "DETERMINE_MEMBER_MARITAL_STATUS",
);
assert.equal(maritalDisposition.decision, "MERGE_PROVISIONAL");
assert.equal(
  maritalDisposition.targetAuthority,
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
);

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
  assert.match(record.itemId, /-V8-/);
  assert.ok(!itemIds.has(record.itemId));
  itemIds.add(record.itemId);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);

  const retainedAuthority = String(record.provisionalAuthority);
  assert.notEqual(retainedAuthority, "DETERMINE_MEMBER_GENDER");
  assert.notEqual(retainedAuthority, "DETERMINE_MEMBER_MARITAL_STATUS");
  assert.ok(
    record.answerType === "UNORDERED_PERSON_PAIR" ||
      record.answerType === "PERSON_NAME_SET" ||
      record.answerType === "PERSON_NAME",
  );
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.text)).size, 4);
  assert.equal(
    new Set(record.options.map((option) => option.semanticKey)).size,
    4,
  );
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);
  answerPositions[record.correctIndex] += 1;

  const groupKey = `${record.scenarioId}::${record.seed}`;
  const priorPrompt = promptsByGroup.get(groupKey);
  if (priorPrompt) assert.equal(record.sharedPrompt, priorPrompt);
  else promptsByGroup.set(groupKey, record.sharedPrompt);

  assert.equal(
    record.metadata.runtimeVersion,
    "blr-cp003-learner-evidence-v8-candidate-v1",
  );
  assert.equal(record.metadata.authenticExamStem, true);
  assert.equal(record.metadata.nameBasedOptions, true);
  assert.equal(record.metadata.phaseStructuredExplanation, true);
  assert.equal(record.metadata.sourceAuthorityDispositionApplied, true);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.passageAudit.stackedLinearChain, false);
  assert.equal(
    record.metadata.passageAudit.clueOrderStrategy,
    "DISJOINT_NON_TOPOLOGICAL",
  );
  assert.ok(record.metadata.passageAudit.indirectAnchorCount >= 2);
  assert.ok(record.metadata.passageAudit.generationTransitionCount >= 2);
  assert.ok(
    record.metadata.passageAudit.directEdgeSentenceCount <
      record.metadata.passageAudit.sentenceCount,
  );

  assert.deepEqual(
    record.editorial.solutionPhases.map((phase) => phase.title),
    [
      "Phase 1 — Map generation levels",
      "Phase 2 — Connect family branches",
      "Phase 3 — Trace the required relation",
      "Phase 4 — Verify the options",
    ],
  );
  assert.ok(
    record.editorial.solutionPhases.every((phase) => phase.points.length >= 2),
  );
  assert.equal(record.editorial.optionAnalysis.length, 4);

  const learnerText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
  assert.doesNotMatch(
    learnerText,
    /(?:The passage is contradictory|Divorced|Cannot be determined)/i,
  );
  assert.doesNotMatch(learnerText, /Don't fall for Option/i);
  assert.doesNotMatch(
    record.sharedPrompt,
    /Read the following family information carefully/i,
  );

  const pathIds = record.proceduralLogic.query?.pathPersonIds ?? [];
  const highlightedNodes = new Set(pathIds);
  const highlightedPairs = blrCp003V8VisualPairs(record);
  assert.ok(pathIds.length >= 2);
  for (const path of record.evidencePaths) {
    for (const personId of path.personIds) {
      assert.ok(highlightedNodes.has(personId));
    }
    for (let index = 0; index < path.personIds.length - 1; index += 1) {
      assert.ok(
        highlightedPairs.has(
          pairKey(path.personIds[index]!, path.personIds[index + 1]!),
        ),
      );
    }
  }

  const markup = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
  assert.ok(markup.includes("<svg"));
  assert.ok(markup.includes("Answer:"));
  assert.ok(!markup.includes("undefined"));
  assert.ok(!markup.includes("[object Object]"));
  assert.ok(
    record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"),
  );
}

assert.equal(promptsByGroup.size, 52);
assert.equal(itemIds.size, 130);
assert.equal(fingerprints.size, 130);
assert.deepEqual(answerPositions, [32, 33, 33, 32]);

const groupSizes = new Map<string, number>();
for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  groupSizes.set(key, (groupSizes.get(key) ?? 0) + 1);
}
for (const [key, size] of groupSizes) {
  assert.equal(
    size,
    key.startsWith("BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH") ? 3 : 2,
  );
}

console.log(
  JSON.stringify(
    {
      candidateVersion: BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
      authorityAuditVersion: BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
      candidateRecords: records.length,
      passageGroups: promptsByGroup.size,
      retainedAuthorityCounts: counts,
      answerPositions,
      syntheticLabelAuthorityRecords: 0,
      phaseStructuredExplanations: records.length,
      permanentQlCount: 0,
      humanReviewApproved: false,
      verdict:
        "BLR-CP-003 V8 FULL-BANK AUTHENTICITY CANDIDATE PASSES; HUMAN REVIEW REMAINS REQUIRED",
    },
    null,
    2,
  ),
);
