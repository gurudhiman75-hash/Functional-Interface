import {
  TSD_CP003_ENGLISH_FREEZE_APPROVED_AT,
  TSD_CP003_ENGLISH_FREEZE_APPROVED_BY,
  TSD_CP003_ENGLISH_FREEZE_AUTHORITY,
  cp003FrozenLearnerCorpusIsUnchanged,
  generateCp003EnglishFrozenRecords,
} from "./english-frozen";
import {
  TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY,
  generateCp003EnglishFreezeCandidateRecords,
  priorFrozenEnglishCorpusRemainsIntact,
} from "./english-freeze-candidate";
import {
  TSD_CP003_PERMANENT_QL_IDS,
  TSD_CP003_NEXT_PERMANENT_QL_ID,
} from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const candidate = generateCp003EnglishFreezeCandidateRecords();
const frozen = generateCp003EnglishFrozenRecords();

assert(candidate.length === 63, `Expected 63 CP-003 candidate records, received ${candidate.length}`);
assert(frozen.length === candidate.length, `Frozen CP-003 record count changed: ${frozen.length}`);
assert(priorFrozenEnglishCorpusRemainsIntact(), "Previously frozen CP-001/002 English corpus changed during CP-003 freeze");
assert(cp003FrozenLearnerCorpusIsUnchanged(), "Learner-facing CP-003 corpus changed during English freeze");
assert(new Set(frozen.map((row) => row.questionLanguageId)).size === frozen.length, "Frozen CP-003 question-language IDs are not unique");
assert(!frozen.some((row) => row.solveMode === "scheduleBuffer"), "Rejected scheduleBuffer entered frozen CP-003 English");
assert(frozen.every((row) => row.validation.valid), "Invalid CP-003 learner row entered frozen English");

candidate.forEach((sourceRow, index) => {
  const frozenRow = frozen[index];
  assert(frozenRow.questionLanguageId === sourceRow.questionLanguageId, `${sourceRow.questionLanguageId}: identity changed during CP-003 freeze`);
  assert(frozenRow.authorityKey === sourceRow.authorityKey, `${sourceRow.questionLanguageId}: authority changed during CP-003 freeze`);
  assert(frozenRow.solveMode === sourceRow.solveMode, `${sourceRow.questionLanguageId}: solve mode changed during CP-003 freeze`);
  assert(frozenRow.representation === sourceRow.representation, `${sourceRow.questionLanguageId}: representation changed during CP-003 freeze`);
  assert(frozenRow.stem === sourceRow.stem, `${sourceRow.questionLanguageId}: English stem changed during CP-003 freeze`);
  assert(frozenRow.answerText === sourceRow.answerText, `${sourceRow.questionLanguageId}: answer changed during CP-003 freeze`);
  assert(frozenRow.correctIndex === sourceRow.correctIndex, `${sourceRow.questionLanguageId}: answer position changed during CP-003 freeze`);
  assert(frozenRow.options.join("|") === sourceRow.options.join("|"), `${sourceRow.questionLanguageId}: options changed during CP-003 freeze`);
  assert(frozenRow.permanentQlId === sourceRow.authorityPermanentQlId, `${sourceRow.questionLanguageId}: frozen permanent QL does not match authority allocation`);

  assert(sourceRow.permanentQlId === null, `${sourceRow.questionLanguageId}: source runtime permanent QL was mutated`);
  assert(sourceRow.lifecycle.englishFreezeStatus === "UNFROZEN", `${sourceRow.questionLanguageId}: source runtime was frozen in place instead of wrapped`);
  assert(sourceRow.freezeCandidate.authority === TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY, `${sourceRow.questionLanguageId}: freeze-candidate source authority mismatch`);
  assert(sourceRow.freezeCandidate.candidateStatus === "READY_FOR_PRODUCT_OWNER_FREEZE_APPROVAL", `${sourceRow.questionLanguageId}: source row was not freeze-ready`);

  assert(frozenRow.lifecycle.reviewStatus === "EDITORIAL_APPROVED", `${sourceRow.questionLanguageId}: frozen review status is not approved`);
  assert(frozenRow.lifecycle.englishDecision === "APPROVED", `${sourceRow.questionLanguageId}: frozen English decision is not approved`);
  assert(frozenRow.lifecycle.englishFreezeStatus === "FROZEN", `${sourceRow.questionLanguageId}: CP-003 English is not frozen`);
  assert(frozenRow.lifecycle.questionBankStatus === "NOT_STORED", `${sourceRow.questionLanguageId}: Question Bank storage unlocked during freeze`);
  assert(frozenRow.lifecycle.testEligibility === "INELIGIBLE", `${sourceRow.questionLanguageId}: test delivery unlocked during freeze`);
  assert(frozenRow.lifecycle.publiclyPublishable === false, `${sourceRow.questionLanguageId}: public delivery unlocked during freeze`);

  assert(frozenRow.englishFreezeProof.authority === TSD_CP003_ENGLISH_FREEZE_AUTHORITY, `${sourceRow.questionLanguageId}: CP-003 freeze authority mismatch`);
  assert(frozenRow.englishFreezeProof.approvedBy === TSD_CP003_ENGLISH_FREEZE_APPROVED_BY, `${sourceRow.questionLanguageId}: CP-003 freeze approver mismatch`);
  assert(frozenRow.englishFreezeProof.approvedAt === TSD_CP003_ENGLISH_FREEZE_APPROVED_AT, `${sourceRow.questionLanguageId}: CP-003 freeze approval date mismatch`);
  assert(frozenRow.englishFreezeProof.sourceAuthority === TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY, `${sourceRow.questionLanguageId}: freeze source authority mismatch`);
  assert(frozenRow.englishFreezeProof.learnerCorpusChanged === false, `${sourceRow.questionLanguageId}: learner mutation flag changed`);
  assert(frozenRow.englishFreezeProof.priorFrozenCorpusChanged === false, `${sourceRow.questionLanguageId}: prior-corpus mutation flag changed`);
  assert(frozenRow.englishFreezeProof.localisationUnlocked === true, `${sourceRow.questionLanguageId}: localization not unlocked after English freeze`);
  assert(frozenRow.englishFreezeProof.questionStudioUnlocked === false, `${sourceRow.questionLanguageId}: Question Studio unlocked during English freeze`);
  assert(frozenRow.englishFreezeProof.questionBankUnlocked === false, `${sourceRow.questionLanguageId}: Question Bank unlocked during English freeze`);
  assert(frozenRow.englishFreezeProof.testDeliveryUnlocked === false, `${sourceRow.questionLanguageId}: test delivery unlocked during English freeze`);
  assert(frozenRow.englishFreezeProof.publicDeliveryUnlocked === false, `${sourceRow.questionLanguageId}: public delivery unlocked during English freeze`);
});

const newQlRows = frozen.filter((row) => row.authorityQlKind === "NEW_CP003_PERMANENT_QL");
const priorQlRows = frozen.filter((row) => row.authorityQlKind === "EXISTING_PRIOR_AUTHORITY_QL");
assert(newQlRows.length === 36, `Expected 36 frozen rows owned by new CP-003 QLs, received ${newQlRows.length}`);
assert(priorQlRows.length === 27, `Expected 27 frozen prior-authority representation rows, received ${priorQlRows.length}`);
assert(new Set(newQlRows.map((row) => row.permanentQlId)).size === 10, "Frozen new-authority rows do not cover all 10 CP-003 QLs");
assert(newQlRows.every((row) => TSD_CP003_PERMANENT_QL_IDS.includes(row.permanentQlId)), "Frozen new-authority row mapped outside TSD-QL-038..047");
assert(priorQlRows.every((row) => !TSD_CP003_PERMANENT_QL_IDS.includes(row.permanentQlId)), "Prior-authority representation consumed a new CP-003 QL after freeze");
assert(new Set(priorQlRows.map((row) => row.permanentQlId)).size === 8, "Frozen prior representations no longer map to eight existing QLs");
assert(new Set(frozen.map((row) => row.permanentQlId)).size === 18, "Frozen CP-003 content should represent 18 distinct authority QLs");
assert(TSD_CP003_PERMANENT_QL_IDS[0] === "TSD-QL-038" && TSD_CP003_PERMANENT_QL_IDS.at(-1) === "TSD-QL-047", "Frozen CP-003 QL range changed");
assert(TSD_CP003_NEXT_PERMANENT_QL_ID === "TSD-QL-048", "Next permanent QL changed after CP-003 freeze");

const difficultyCounts = {
  Easy: frozen.filter((row) => row.difficulty.label === "Easy").length,
  Medium: frozen.filter((row) => row.difficulty.label === "Medium").length,
  Hard: frozen.filter((row) => row.difficulty.label === "Hard").length,
};
assert(difficultyCounts.Easy === 18 && difficultyCounts.Medium === 33 && difficultyCounts.Hard === 12, `Frozen CP-003 difficulty mix changed: ${JSON.stringify(difficultyCounts)}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_ENGLISH_FREEZE_APPROVED",
  authority: TSD_CP003_ENGLISH_FREEZE_AUTHORITY,
  approvedBy: TSD_CP003_ENGLISH_FREEZE_APPROVED_BY,
  approvedAt: TSD_CP003_ENGLISH_FREEZE_APPROVED_AT,
  records: frozen.length,
  newPermanentQlRange: [TSD_CP003_PERMANENT_QL_IDS[0], TSD_CP003_PERMANENT_QL_IDS.at(-1)],
  nextPermanentQlId: TSD_CP003_NEXT_PERMANENT_QL_ID,
  newAuthorityRows: newQlRows.length,
  priorRepresentationRows: priorQlRows.length,
  representedAuthorityQls: new Set(frozen.map((row) => row.permanentQlId)).size,
  difficultyCounts,
  learnerCorpusChanged: false,
  priorFrozenCorpusChanged: false,
  englishFreezeStatus: "FROZEN",
  localisationUnlocked: true,
  questionStudioUnlocked: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
