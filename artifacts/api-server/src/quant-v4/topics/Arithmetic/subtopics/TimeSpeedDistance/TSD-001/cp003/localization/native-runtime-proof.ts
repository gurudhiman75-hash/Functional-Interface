import { toCanonicalString } from "../../foundation/rational";
import { generateCp003EnglishFrozenRecords } from "../english-frozen";
import { stableCp003Stringify } from "../runtime";
import {
  generateCp003AllNativePreviews,
  generateCp003NativePreview,
  TSD_CP003_NATIVE_EDITORIAL_STATUS,
} from "./native-runtime";
import {
  assertTsdCp003NativeText,
  TSD_CP003_NATIVE_NUMBER_POLICY,
} from "./native-language-primitives";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const englishBefore = generateCp003EnglishFrozenRecords();
const englishIdentityBefore = stableCp003Stringify(englishBefore);
const hindi = generateCp003NativePreview("hi");
const punjabi = generateCp003NativePreview("pa");
const all = generateCp003AllNativePreviews();
const englishAfter = generateCp003EnglishFrozenRecords();

assert(englishBefore.length === 63, `Expected 63 frozen English CP-003 rows, received ${englishBefore.length}`);
assert(hindi.length === 63, `Expected 63 Hindi previews, received ${hindi.length}`);
assert(punjabi.length === 63, `Expected 63 Punjabi previews, received ${punjabi.length}`);
assert(all.length === 126, `Expected 126 native previews, received ${all.length}`);
assert(stableCp003Stringify(englishAfter) === englishIdentityBefore, "Frozen English corpus changed during native preview generation");
assert(new Set(all.map((entry) => entry.presentation.questionLanguageId)).size === 126, "Native question-language IDs are not unique");
assert(all.every((entry) => entry.presentation.solveMode !== "scheduleBuffer"), "Rejected scheduleBuffer leaked into native review");

const sourceById = new Map(englishBefore.map((row) => [row.questionLanguageId, row] as const));
for (const { source, presentation } of all) {
  const canonical = sourceById.get(presentation.sourceQuestionLanguageId);
  assert(canonical, `${presentation.questionLanguageId}: source English record is missing`);
  assert(source.questionLanguageId === canonical.questionLanguageId, `${presentation.questionLanguageId}: source identity changed`);
  assert(source.lifecycle.englishFreezeStatus === "FROZEN", `${presentation.questionLanguageId}: source English is not frozen`);
  assert(source.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: source Question Bank lifecycle changed`);
  assert(source.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: source test lifecycle changed`);
  assert(source.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: source public lifecycle changed`);

  assert(presentation.permanentQlId === source.permanentQlId, `${presentation.questionLanguageId}: permanent QL drift`);
  assert(presentation.authorityKey === source.authorityKey, `${presentation.questionLanguageId}: authority drift`);
  assert(presentation.authorityOwnerCheckpointId === source.authorityOwnerCheckpointId, `${presentation.questionLanguageId}: authority owner drift`);
  assert(presentation.seed === source.seed, `${presentation.questionLanguageId}: seed drift`);
  assert(presentation.solveMode === source.solveMode, `${presentation.questionLanguageId}: solve-mode drift`);
  assert(presentation.representation === source.representation, `${presentation.questionLanguageId}: representation drift`);
  assert(presentation.mathematicalFingerprint === source.mathematicalFingerprint, `${presentation.questionLanguageId}: mathematical fingerprint drift`);
  assert(presentation.correctIndex === source.correctIndex, `${presentation.questionLanguageId}: correct-index drift`);
  assert(presentation.parity.sourcePermanentQlId === source.permanentQlId, `${presentation.questionLanguageId}: parity QL mismatch`);
  assert(presentation.parity.sourceSeed === source.seed, `${presentation.questionLanguageId}: parity seed mismatch`);
  assert(presentation.parity.inputIdentity === stableCp003Stringify(source.input), `${presentation.questionLanguageId}: input identity drift`);
  assert(presentation.parity.solutionIdentity === stableCp003Stringify(source.solution), `${presentation.questionLanguageId}: solution identity drift`);
  assert(presentation.parity.mathematicalFingerprintPreserved === true, `${presentation.questionLanguageId}: mathematical parity flag changed`);
  assert(presentation.parity.answerValuePreserved === true, `${presentation.questionLanguageId}: answer parity flag changed`);
  assert(presentation.parity.correctIndexPreserved === true, `${presentation.questionLanguageId}: correct-index parity flag changed`);
  assert(presentation.parity.optionOrderPreserved === true, `${presentation.questionLanguageId}: option-order parity flag changed`);

  const sourceValues = source.optionAudit.map((option) => {
    if (option.isCorrect) return toCanonicalString(source.solution.answer);
    assert(option.wrongWorking, `${source.questionLanguageId}: wrong option lost wrong-working value`);
    return toCanonicalString(option.wrongWorking.value);
  });
  assert(sourceValues.join("|") === presentation.parity.optionValueFingerprints.join("|"), `${presentation.questionLanguageId}: option-value order drift`);
  assert(presentation.options.length === 4, `${presentation.questionLanguageId}: localized option count changed`);
  assert(new Set(presentation.options).size === 4, `${presentation.questionLanguageId}: localized options are not unique`);
  assert(presentation.options[presentation.correctIndex] === presentation.answerText, `${presentation.questionLanguageId}: localized answer text does not match correct option`);

  assertTsdCp003NativeText(presentation.stem, presentation.language, `${presentation.questionLanguageId}/stem`);
  assertTsdCp003NativeText(presentation.explanation.method, presentation.language, `${presentation.questionLanguageId}/method`);
  assert(presentation.explanation.steps.length >= 1 && presentation.explanation.steps.length <= 4, `${presentation.questionLanguageId}: native explanation should contain 1-4 connected calculation steps`);
  for (const [index, step] of presentation.explanation.steps.entries()) {
    assertTsdCp003NativeText(step, presentation.language, `${presentation.questionLanguageId}/step-${index + 1}`);
  }
  assertTsdCp003NativeText(presentation.explanation.answer, presentation.language, `${presentation.questionLanguageId}/answer`);
  assert(presentation.stem !== source.stem, `${presentation.questionLanguageId}: native stem fell back to English source text`);

  assert(presentation.lifecycle.nativeEditorialStatus === TSD_CP003_NATIVE_EDITORIAL_STATUS, `${presentation.questionLanguageId}: native editorial status drift`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: native content was frozen without human review`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio was unlocked`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank was unlocked`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests were unlocked`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery was unlocked`);
}

for (let index = 0; index < 63; index += 1) {
  const hi = hindi[index].presentation;
  const pa = punjabi[index].presentation;
  assert(hi.sourceQuestionLanguageId === pa.sourceQuestionLanguageId, `Native language source order diverged at row ${index}`);
  assert(hi.permanentQlId === pa.permanentQlId, `${hi.sourceQuestionLanguageId}: Hindi/Punjabi QL mismatch`);
  assert(hi.correctIndex === pa.correctIndex, `${hi.sourceQuestionLanguageId}: Hindi/Punjabi correct-index mismatch`);
  assert(hi.mathematicalFingerprint === pa.mathematicalFingerprint, `${hi.sourceQuestionLanguageId}: Hindi/Punjabi mathematical fingerprint mismatch`);
  assert(hi.parity.optionValueFingerprints.join("|") === pa.parity.optionValueFingerprints.join("|"), `${hi.sourceQuestionLanguageId}: Hindi/Punjabi option-value mismatch`);
}

const correctPositions = [0, 1, 2, 3].map((position) => hindi.filter((row) => row.presentation.correctIndex === position).length);
const newQlRows = hindi.filter((row) => Number(row.presentation.permanentQlId.slice(-3)) >= 38).length;
const priorQlRows = hindi.length - newQlRows;
const qls = new Set(hindi.map((row) => row.presentation.permanentQlId));
const solveModes = new Set(hindi.map((row) => row.presentation.solveMode));

assert(newQlRows === 36, `Expected 36 native rows on new CP-003 QLs, received ${newQlRows}`);
assert(priorQlRows === 27, `Expected 27 native rows extending prior QLs, received ${priorQlRows}`);
assert(qls.size === 18, `Expected 18 represented authority QLs, received ${qls.size}`);
assert(solveModes.size === 21, `Expected 21 accepted solve modes, received ${solveModes.size}`);
assert(TSD_CP003_NATIVE_NUMBER_POLICY.digits === "ASCII_0_9", "Native digit policy changed");
assert(TSD_CP003_NATIVE_NUMBER_POLICY.speedUnit === "km/h", "Native speed-unit policy changed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_NATIVE_PARITY_PREVIEW",
  frozenEnglishRows: englishBefore.length,
  hindiRows: hindi.length,
  punjabiRows: punjabi.length,
  nativeRows: all.length,
  acceptedSolveModes: solveModes.size,
  representedAuthorityQls: qls.size,
  newCp003QlRowsPerLanguage: newQlRows,
  priorRepresentationRowsPerLanguage: priorQlRows,
  correctPositionsPerLanguage: correctPositions,
  optionValueParityChecks: all.length * 4,
  inputSolutionParityChecks: all.length * 2,
  frozenEnglishCorpusChanged: false,
  nativeEditorialStatus: TSD_CP003_NATIVE_EDITORIAL_STATUS,
  multilingualFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
