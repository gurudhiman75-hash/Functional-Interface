import { COM004_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com004-english-freeze-v1";
import {
  COM004_ENGLISH_CHAPTER_CANDIDATE_V1,
  auditCom004EnglishChapterCandidateV1,
} from "./com004-english-chapter-candidate-v1";

const audit = auditCom004EnglishChapterCandidateV1();
if (!audit.valid) {
  throw new Error(`COM-004 English Freeze V1 source audit failed: ${audit.issues.join(", ")}`);
}

const freeze = COM004_ENGLISH_FREEZE_AUTHORITY_V1;
if (freeze.authorityId !== "COM-004-ENGLISH-FREEZE-V1") throw new Error("COM-004 English freeze authority ID drifted");
if (freeze.frozenQuestionCount !== 204 || COM004_ENGLISH_CHAPTER_CANDIDATE_V1.length !== 204) throw new Error("COM-004 English freeze question count drifted");
if (freeze.permanentQlIds.length !== 17) throw new Error("COM-004 English freeze QL count drifted");
if (freeze.frozenQuestionsPerQl !== 12) throw new Error("COM-004 English freeze questions-per-QL drifted");

for (const row of freeze.perQl) {
  if (row.questionCount !== 12) throw new Error(`COM-004 English freeze ${row.qlId} count drifted: ${row.questionCount}`);
  if (row.uniqueStemCount !== 12) throw new Error(`COM-004 English freeze ${row.qlId} stem diversity drifted: ${row.uniqueStemCount}`);
  if (row.uniqueExplanationCount < 10) throw new Error(`COM-004 English freeze ${row.qlId} explanation diversity drifted: ${row.uniqueExplanationCount}`);
  if (row.surfaceFamilyCount < 3) throw new Error(`COM-004 English freeze ${row.qlId} surface-family diversity drifted: ${row.surfaceFamilyCount}`);
}

if (!freeze.governance.englishFrozen) throw new Error("COM-004 English corpus is not frozen");
if (freeze.governance.englishContentMutationAllowed) throw new Error("COM-004 frozen English mutation was incorrectly authorized");
if (!freeze.governance.correctionRequiresNewVersion) throw new Error("COM-004 corrections must require a new freeze version");
if (!freeze.governance.hindiPunjabiLocalizationV1Authorized) throw new Error("COM-004 localization next gate was not authorized");
if (!freeze.governance.difficultyAuthorityMayBindToThisCorpus) throw new Error("COM-004 difficulty authority binding was unexpectedly blocked");

const forbidden = [
  freeze.governance.questionStudioEnglishPromotionAuthorized,
  freeze.governance.questionBankWritesAuthorized,
  freeze.governance.testEligibilityAuthorized,
  freeze.governance.mockTestEligibilityAuthorized,
  freeze.governance.automaticPublicationAuthorized,
  freeze.governance.publicPublicationAuthorized,
  freeze.governance.productionReleased,
];
if (forbidden.some(Boolean)) throw new Error("COM-004 English freeze prematurely opened a downstream lifecycle gate");
if (freeze.nextGate !== "COM004_HINDI_PUNJABI_LOCALIZATION_V1") throw new Error(`COM-004 English freeze next gate drifted: ${freeze.nextGate}`);

console.log(JSON.stringify({
  checkpoint: freeze.authorityId,
  questionCount: freeze.frozenQuestionCount,
  qlCount: freeze.permanentQlIds.length,
  questionsPerQl: freeze.frozenQuestionsPerQl,
  sourceAuditValid: audit.valid,
  englishFrozen: freeze.governance.englishFrozen,
  localizationAuthorized: freeze.governance.hindiPunjabiLocalizationV1Authorized,
  downstreamLocked: true,
  nextGate: freeze.nextGate,
}, null, 2));
