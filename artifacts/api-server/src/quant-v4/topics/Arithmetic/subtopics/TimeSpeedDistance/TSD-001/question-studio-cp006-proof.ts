import {
  TSD_001_QUESTION_STUDIO_CP_IDS,
  TSD_001_QUESTION_STUDIO_PACKAGE,
  TSD_001_QUESTION_STUDIO_RUNTIME_MODE,
  generateTsd001QuestionStudioBatch,
} from "./question-studio-adapter";
import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q, TSD_CP005_ENGLISH_FREEZE_ID } from "./cp005/english-approved-freeze-v13";
import { TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q, TSD_CP005_HI_PA_FREEZE_ID } from "./cp005/localization/native-approved-freeze-v5";
import { TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q, TSD_CP006_ENGLISH_FREEZE_ID } from "./cp006/english-approved-freeze-v5";
import { TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q, TSD_CP006_HI_PA_FREEZE_ID } from "./cp006/localization/native-approved-freeze-v7";
import { generateQuestion, listQuantV4Packages } from "../../../../generation-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

const CP_IDS = ["TSD-CP-005", "TSD-CP-006"] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;
const QLS = Object.freeze({
  "TSD-CP-005": Array.from({ length: 13 }, (_, index) => `TSD-QL-${String(58 + index).padStart(3, "0")}`),
  "TSD-CP-006": Array.from({ length: 13 }, (_, index) => `TSD-QL-${String(71 + index).padStart(3, "0")}`),
});

function sourceRows(cpId: typeof CP_IDS[number], language: typeof LANGUAGES[number]) {
  if (cpId === "TSD-CP-005") {
    if (language === "en") return TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q;
    return TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.filter((row) => row.presentation.language === language);
  }
  if (language === "en") return TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q;
  return TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q.filter((row) => row.presentation.language === language);
}

function surfaceSignature(row: any, language: typeof LANGUAGES[number]) {
  const source = language === "en" ? row : row.source;
  const presentation = language === "en" ? row : row.presentation;
  return stable({
    cpQl: source.permanentQlId,
    stem: presentation.stem,
    options: presentation.options,
    correctIndex: presentation.correctIndex,
    answerText: presentation.answerText,
  });
}

assert(TSD_001_QUESTION_STUDIO_CP_IDS.join("|") === CP_IDS.join("|"), "Question Studio checkpoint list drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.cpIds.join("|") === CP_IDS.join("|"), "package checkpoint metadata drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.frozenQlRange === "TSD-QL-058..TSD-QL-083", "combined frozen QL range drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.uniqueFrozenQuestionsPerLanguage === 156, "combined frozen surface count drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.questionStudioReviewOnly === true, "TSD package is not review-only");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.questionBankStatus === "NOT_STORED", "TSD package unlocked Question Bank");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.testEligibility === "INELIGIBLE", "TSD package unlocked tests");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false, "TSD package unlocked publication");

assert(TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.length === 78, "CP005 English freeze row count changed");
assert(TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.length === 156, "CP005 native freeze row count changed");
assert(TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q.length === 78, "CP006 English freeze row count changed");
assert(TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q.length === 156, "CP006 native freeze row count changed");

for (const row of TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q) {
  assert(row.lifecycle.englishFreezeStatus === "FROZEN", `${row.seed}: CP006 English source not frozen`);
  assert(row.lifecycle.questionStudioEnabled === false, `${row.seed}: frozen CP006 English source was mutated for Studio`);
}
for (const row of TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q) {
  assert(row.presentation.lifecycle.multilingualFreezeStatus === "FROZEN", `${row.source.seed}/${row.presentation.language}: CP006 native source not frozen`);
  assert(row.presentation.lifecycle.questionStudioEnabled === false, `${row.source.seed}/${row.presentation.language}: frozen CP006 native source was mutated for Studio`);
}

let adapterChecks = 0;
for (const cpId of CP_IDS) {
  for (const language of LANGUAGES) {
    const expectedRows = sourceRows(cpId, language);
    assert(expectedRows.length === 78, `${cpId}/${language}: expected 78 frozen source rows`);
    const allowed = new Set(expectedRows.map((row: any) => surfaceSignature(row, language)));
    for (const qlId of QLS[cpId]) {
      const qlRows = expectedRows.filter((row: any) => (language === "en" ? row.permanentQlId : row.source.permanentQlId) === qlId);
      assert(qlRows.length === 6, `${cpId}/${language}/${qlId}: source must contain six frozen variants`);
      for (let sample = 0; sample < 6; sample += 1) {
        const result = generateTsd001QuestionStudioBatch({
          packageId: "TSD-001",
          canonicalProblemId: cpId,
          questionLanguageId: qlId,
          language,
          seed: `studio-proof:${cpId}:${language}:${qlId}:${sample}`,
          count: 1,
        });
        assert(result.questionPackages.length === 1 && result.questions.length === 1, `${cpId}/${language}/${qlId}: expected one routed question`);
        const pkg: any = result.questionPackages[0];
        const question: any = result.questions[0];
        assert(pkg.canonicalProblemId === cpId && question.canonicalProblemId === cpId, `${cpId}/${language}/${qlId}: checkpoint identity drifted`);
        assert(pkg.questionLanguageId === qlId && question.questionLanguageId === qlId, `${cpId}/${language}/${qlId}: QL identity drifted`);
        assert(pkg.language === language && question.language === language, `${cpId}/${language}/${qlId}: language identity drifted`);
        assert(pkg.runtimeMode === TSD_001_QUESTION_STUDIO_RUNTIME_MODE, `${cpId}/${language}/${qlId}: runtime mode drifted`);
        assert(pkg.questionStudioReviewOnly === true, `${cpId}/${language}/${qlId}: review-only guard lost`);
        assert(pkg.questionBankStatus === "NOT_STORED" && question.questionBankStatus === "NOT_STORED", `${cpId}/${language}/${qlId}: Bank unlocked`);
        assert(pkg.testEligibility === "INELIGIBLE" && question.testEligibility === "INELIGIBLE", `${cpId}/${language}/${qlId}: tests unlocked`);
        assert(pkg.publiclyPublishable === false && question.publiclyPublishable === false, `${cpId}/${language}/${qlId}: publication unlocked`);
        assert(pkg.traceability.sourceQuestionStudioEnabled === false, `${cpId}/${language}/${qlId}: frozen source Studio flag changed`);
        assert(pkg.traceability.adapterQuestionStudioAccess === true, `${cpId}/${language}/${qlId}: adapter access missing`);
        assert(pkg.traceability.englishFreezeId === (cpId === "TSD-CP-005" ? TSD_CP005_ENGLISH_FREEZE_ID : TSD_CP006_ENGLISH_FREEZE_ID), `${cpId}/${language}/${qlId}: English freeze trace drifted`);
        assert(pkg.traceability.nativeFreezeId === (cpId === "TSD-CP-005" ? TSD_CP005_HI_PA_FREEZE_ID : TSD_CP006_HI_PA_FREEZE_ID), `${cpId}/${language}/${qlId}: native freeze trace drifted`);
        assert(pkg.options[pkg.correctIndex] === pkg.answer, `${cpId}/${language}/${qlId}: answer identity broken`);
        assert(allowed.has(stable({ cpQl: pkg.questionLanguageId, stem: pkg.stem, options: pkg.options, correctIndex: pkg.correctIndex, answerText: pkg.answer })), `${cpId}/${language}/${qlId}: emitted learner surface is not frozen authority`);
        JSON.stringify(result);
        adapterChecks += 1;
      }
    }
  }
}
assert(adapterChecks === 468, `expected 468 routed frozen adapter checks, got ${adapterChecks}`);

const listed: any[] = listQuantV4Packages() as any[];
const listedTsd = listed.find((pkg) => pkg.packageId === "TSD-001");
assert(listedTsd, "actual generation engine package list lost TSD-001");
assert(listedTsd.cpIds.join("|") === CP_IDS.join("|"), "actual engine package list did not expose CP006");
assert(listedTsd.questionStudioReviewOnly === true, "actual engine package list lost review-only marker");

let engineRouteChecks = 0;
for (const cpId of CP_IDS) {
  for (const language of LANGUAGES) {
    const qlId = QLS[cpId][engineRouteChecks % 13]!;
    const routed: any = await generateQuestion({
      packageId: "TSD-001",
      canonicalProblemId: cpId,
      questionLanguageId: qlId,
      language,
      seed: `engine-route:${cpId}:${language}`,
      count: 1,
    } as any);
    assert(routed.questionPackages?.length === 1, `${cpId}/${language}: actual engine did not route TSD package`);
    assert(routed.questionPackages[0].canonicalProblemId === cpId, `${cpId}/${language}: actual engine checkpoint drifted`);
    assert(routed.questionPackages[0].language === language, `${cpId}/${language}: actual engine language drifted`);
    assert(routed.questionPackages[0].questionBankStatus === "NOT_STORED", `${cpId}/${language}: actual engine unlocked Bank`);
    JSON.stringify(routed);
    engineRouteChecks += 1;
  }
}
assert(engineRouteChecks === 6, "actual engine route check count drifted");

let crossCheckpointRejected = false;
try {
  generateTsd001QuestionStudioBatch({ canonicalProblemId: "TSD-CP-005", questionLanguageId: "TSD-QL-071", language: "en", seed: "bad-cross-checkpoint" });
} catch {
  crossCheckpointRejected = true;
}
assert(crossCheckpointRejected, "cross-checkpoint QL mismatch was not rejected");

let unknownCheckpointRejected = false;
try {
  generateTsd001QuestionStudioBatch({ canonicalProblemId: "TSD-CP-007", language: "en", seed: "bad-checkpoint" });
} catch {
  unknownCheckpointRejected = true;
}
assert(unknownCheckpointRejected, "unknown checkpoint was not rejected");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_FROZEN_MULTILINGUAL_QUESTION_STUDIO_REVIEW_ADAPTER",
  packageId: "TSD-001",
  checkpointIds: CP_IDS,
  permanentQlRange: "TSD-QL-058..TSD-QL-083",
  cp005QlRange: "TSD-QL-058..TSD-QL-070",
  cp006QlRange: "TSD-QL-071..TSD-QL-083",
  languages: LANGUAGES,
  uniqueFrozenQuestionsPerLanguage: 156,
  uniqueFrozenQuestionsPerCheckpointPerLanguage: 78,
  routedFrozenAdapterChecks: adapterChecks,
  actualGenerationEngineRouteChecks: engineRouteChecks,
  cp005EnglishFreezeId: TSD_CP005_ENGLISH_FREEZE_ID,
  cp005NativeFreezeId: TSD_CP005_HI_PA_FREEZE_ID,
  cp006EnglishFreezeId: TSD_CP006_ENGLISH_FREEZE_ID,
  cp006NativeFreezeId: TSD_CP006_HI_PA_FREEZE_ID,
  frozenSourceMutation: false,
  questionStudioRuntimeMode: TSD_001_QUESTION_STUDIO_RUNTIME_MODE,
  questionStudioReviewOnly: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  mergeAuthorized: false,
}, null, 2));
