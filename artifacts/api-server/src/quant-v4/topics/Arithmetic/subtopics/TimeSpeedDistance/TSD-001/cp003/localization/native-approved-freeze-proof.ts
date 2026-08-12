import { generateCp003EnglishFrozenRecords } from "../english-frozen";
import { stableCp003Stringify } from "../runtime";
import {
  generateCp003AllFinalNativeReviewCandidates,
} from "./native-final-polished-candidate";
import {
  generateCp003AllApprovedNativeFrozenRows,
  TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD,
  TSD_CP003_HI_PA_FREEZE_ID,
  TSD_CP003_HI_PA_FREEZE_STATUS,
} from "./native-approved-freeze";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const englishBefore = generateCp003EnglishFrozenRecords();
const englishIdentity = stableCp003Stringify(englishBefore);
const approved = generateCp003AllFinalNativeReviewCandidates();
const frozen = generateCp003AllApprovedNativeFrozenRows();

assert(approved.length === 126, `Expected 126 approved native rows, received ${approved.length}`);
assert(frozen.length === 126, `Expected 126 frozen native rows, received ${frozen.length}`);

let contentIdentityChecks = 0;
let mathIdentityChecks = 0;
let lifecycleChecks = 0;
let downstreamLockChecks = 0;
let sentenceParityPreservationChecks = 0;
let contextParityPreservationChecks = 0;

for (let index = 0; index < frozen.length; index += 1) {
  const sourceRow = approved[index];
  const frozenRow = frozen[index];
  assert(sourceRow !== undefined && frozenRow !== undefined, `Missing row at index ${index}`);

  assert(
    stableCp003Stringify(frozenRow.source) === stableCp003Stringify(sourceRow.source),
    `${frozenRow.presentation.questionLanguageId}: frozen English source identity changed`,
  );

  const { lifecycle: approvedLifecycle, ...approvedContent } = sourceRow.presentation;
  const { lifecycle: frozenLifecycle, ...frozenContent } = frozenRow.presentation;
  void approvedLifecycle;

  assert(
    stableCp003Stringify(frozenContent) === stableCp003Stringify(approvedContent),
    `${frozenRow.presentation.questionLanguageId}: learner-facing native content changed during freeze`,
  );
  contentIdentityChecks += 1;

  assert(
    frozenRow.presentation.mathematicalFingerprint === sourceRow.presentation.mathematicalFingerprint,
    `${frozenRow.presentation.questionLanguageId}: mathematical fingerprint changed during freeze`,
  );
  assert(
    frozenRow.presentation.parity.inputIdentity === sourceRow.presentation.parity.inputIdentity &&
      frozenRow.presentation.parity.solutionIdentity === sourceRow.presentation.parity.solutionIdentity,
    `${frozenRow.presentation.questionLanguageId}: input/solution identity changed during freeze`,
  );
  assert(
    frozenRow.presentation.correctIndex === sourceRow.presentation.correctIndex &&
      frozenRow.presentation.answerText === sourceRow.presentation.answerText,
    `${frozenRow.presentation.questionLanguageId}: keyed answer changed during freeze`,
  );
  mathIdentityChecks += 1;

  assert(frozenLifecycle.nativeEditorialStatus === TSD_CP003_HI_PA_FREEZE_STATUS, `${frozenRow.presentation.questionLanguageId}: native freeze status missing`);
  assert(frozenLifecycle.multilingualFreezeStatus === "FROZEN", `${frozenRow.presentation.questionLanguageId}: multilingual freeze not recorded`);
  assert(frozenRow.approvedNativeFreeze.freezeId === TSD_CP003_HI_PA_FREEZE_ID, `${frozenRow.presentation.questionLanguageId}: freeze ID drift`);
  assert(frozenRow.approvedNativeFreeze.approvedSourceHead === TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD, `${frozenRow.presentation.questionLanguageId}: approved source head drift`);
  assert(frozenRow.approvedNativeFreeze.productOwnerApprovalRecorded === true, `${frozenRow.presentation.questionLanguageId}: product-owner approval not recorded`);
  assert(frozenRow.approvedNativeFreeze.multilingualFreezeAuthorized === true, `${frozenRow.presentation.questionLanguageId}: multilingual freeze not authorized`);
  assert(frozenRow.approvedNativeFreeze.sourceMathChanged === false, `${frozenRow.presentation.questionLanguageId}: source math marked changed`);
  lifecycleChecks += 1;

  assert(frozenLifecycle.questionStudioEnabled === false, `${frozenRow.presentation.questionLanguageId}: Question Studio enabled by freeze`);
  assert(frozenLifecycle.questionBankStatus === "NOT_STORED", `${frozenRow.presentation.questionLanguageId}: Question Bank storage enabled by freeze`);
  assert(frozenLifecycle.testEligibility === "INELIGIBLE", `${frozenRow.presentation.questionLanguageId}: test eligibility enabled by freeze`);
  assert(frozenLifecycle.publiclyPublishable === false, `${frozenRow.presentation.questionLanguageId}: publication enabled by freeze`);
  assert(frozenRow.approvedNativeFreeze.questionStudioActivationAuthorized === false, `${frozenRow.presentation.questionLanguageId}: Studio activation authorized by approval`);
  assert(frozenRow.approvedNativeFreeze.questionBankStorageAuthorized === false, `${frozenRow.presentation.questionLanguageId}: storage authorized by approval`);
  assert(frozenRow.approvedNativeFreeze.testEligibilityAuthorized === false, `${frozenRow.presentation.questionLanguageId}: tests authorized by approval`);
  assert(frozenRow.approvedNativeFreeze.publicPublicationAuthorized === false, `${frozenRow.presentation.questionLanguageId}: publication authorized by approval`);
  assert(frozenRow.approvedNativeFreeze.mergeAuthorized === false, `${frozenRow.presentation.questionLanguageId}: merge authorized by approval`);
  downstreamLockChecks += 1;

  assert(frozenRow.approvedNativeFreeze.semanticSentenceParityPreserved === true, `${frozenRow.presentation.questionLanguageId}: sentence parity not preserved`);
  assert(frozenRow.presentation.stem === sourceRow.presentation.stem, `${frozenRow.presentation.questionLanguageId}: approved native sentence changed`);
  sentenceParityPreservationChecks += 1;

  assert(frozenRow.approvedNativeFreeze.sourceContextParityPreserved === true, `${frozenRow.presentation.questionLanguageId}: source-context parity not preserved`);
  contextParityPreservationChecks += 1;
}

const hindiRows = frozen.filter((row) => row.presentation.language === "hi").length;
const punjabiRows = frozen.filter((row) => row.presentation.language === "pa").length;
const solveModes = new Set(frozen.map((row) => row.presentation.solveMode));
const representedQls = new Set(frozen.map((row) => row.presentation.permanentQlId));

assert(hindiRows === 63, `Expected 63 Hindi frozen rows, received ${hindiRows}`);
assert(punjabiRows === 63, `Expected 63 Punjabi frozen rows, received ${punjabiRows}`);
assert(solveModes.size === 21, `Expected 21 solve modes, received ${solveModes.size}`);
assert(representedQls.size === 18, `Expected 18 represented QLs, received ${representedQls.size}`);
assert(stableCp003Stringify(generateCp003EnglishFrozenRecords()) === englishIdentity, "Frozen English corpus changed during native freeze generation");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_PRODUCT_OWNER_APPROVED_FREEZE",
  freezeId: TSD_CP003_HI_PA_FREEZE_ID,
  approvedSourceHead: TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD,
  nativeFreezeStatus: TSD_CP003_HI_PA_FREEZE_STATUS,
  nativeRows: frozen.length,
  hindiRows,
  punjabiRows,
  solveModes: solveModes.size,
  representedAuthorityQls: representedQls.size,
  contentIdentityChecks,
  mathIdentityChecks,
  lifecycleChecks,
  downstreamLockChecks,
  sentenceParityPreservationChecks,
  contextParityPreservationChecks,
  productOwnerApprovalRecorded: true,
  multilingualFreezeAuthorized: true,
  multilingualFreezeStatus: "FROZEN",
  frozenEnglishCorpusChanged: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  mergeAuthorized: false,
}, null, 2));
