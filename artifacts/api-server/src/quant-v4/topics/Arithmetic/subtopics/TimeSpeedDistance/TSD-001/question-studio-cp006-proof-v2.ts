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
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

const CPS = ["TSD-CP-005", "TSD-CP-006"] as const;
const LANGS = ["en", "hi", "pa"] as const;
const qls = (cp: typeof CPS[number]) => Array.from({ length: 13 }, (_, i) =>
  `TSD-QL-${String((cp === "TSD-CP-005" ? 58 : 71) + i).padStart(3, "0")}`,
);
const rowsFor = (cp: typeof CPS[number], lang: typeof LANGS[number]): readonly any[] => {
  if (cp === "TSD-CP-005") {
    return lang === "en" ? TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q : TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.filter((r) => r.presentation.language === lang);
  }
  return lang === "en" ? TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q : TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q.filter((r) => r.presentation.language === lang);
};
const signature = (row: any, lang: typeof LANGS[number]) => {
  const source = lang === "en" ? row : row.source;
  const p = lang === "en" ? row : row.presentation;
  return stable([source.permanentQlId, p.stem, p.options, p.correctIndex, p.answerText]);
};

assert(TSD_001_QUESTION_STUDIO_CP_IDS.join("|") === CPS.join("|"), "checkpoint list drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.cpIds.join("|") === CPS.join("|"), "package checkpoint metadata drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.frozenQlRange === "TSD-QL-058..TSD-QL-083", "combined QL range drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.uniqueFrozenQuestionsPerLanguage === 156, "combined surface count drifted");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.questionStudioReviewOnly === true, "review-only marker lost");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.questionBankStatus === "NOT_STORED", "Bank unlocked");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.testEligibility === "INELIGIBLE", "tests unlocked");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false, "publication unlocked");

assert(TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.length === 78 && TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.length === 156, "CP005 freeze counts drifted");
assert(TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q.length === 78 && TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q.length === 156, "CP006 freeze counts drifted");
for (const row of TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q) assert(row.lifecycle.questionStudioEnabled === false, `${row.seed}: CP006 English freeze mutated`);
for (const row of TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q) assert(row.presentation.lifecycle.questionStudioEnabled === false, `${row.source.seed}: CP006 native freeze mutated`);

let adapterChecks = 0;
for (const cp of CPS) {
  for (const lang of LANGS) {
    const sourceRows = rowsFor(cp, lang);
    assert(sourceRows.length === 78, `${cp}/${lang}: frozen row count changed`);
    const allowed = new Set(sourceRows.map((r) => signature(r, lang)));
    for (const ql of qls(cp)) {
      const qlRows = sourceRows.filter((r) => (lang === "en" ? r.permanentQlId : r.source.permanentQlId) === ql);
      assert(qlRows.length === 6, `${cp}/${lang}/${ql}: expected six frozen variants`);
      for (let sample = 0; sample < 6; sample += 1) {
        const batch: any = generateTsd001QuestionStudioBatch({ packageId: "TSD-001", canonicalProblemId: cp, questionLanguageId: ql, language: lang, seed: `proof:${cp}:${lang}:${ql}:${sample}`, count: 1 });
        const pkg = batch.questionPackages[0];
        const question = batch.questions[0];
        assert(pkg && question, `${cp}/${lang}/${ql}: missing routed question`);
        assert(pkg.canonicalProblemId === cp && question.canonicalProblemId === cp, `${cp}/${lang}/${ql}: CP drift`);
        assert(pkg.questionLanguageId === ql && question.questionLanguageId === ql, `${cp}/${lang}/${ql}: QL drift`);
        assert(pkg.language === lang && question.language === lang, `${cp}/${lang}/${ql}: language drift`);
        assert(pkg.runtimeMode === TSD_001_QUESTION_STUDIO_RUNTIME_MODE && pkg.questionStudioReviewOnly === true, `${cp}/${lang}/${ql}: Studio mode drift`);
        assert(pkg.questionBankStatus === "NOT_STORED" && pkg.testEligibility === "INELIGIBLE" && pkg.publiclyPublishable === false, `${cp}/${lang}/${ql}: downstream unlock`);
        assert(pkg.traceability.sourceQuestionStudioEnabled === false && pkg.traceability.adapterQuestionStudioAccess === true, `${cp}/${lang}/${ql}: source/adapter lifecycle drift`);
        assert(pkg.traceability.englishFreezeId === (cp === "TSD-CP-005" ? TSD_CP005_ENGLISH_FREEZE_ID : TSD_CP006_ENGLISH_FREEZE_ID), `${cp}/${lang}/${ql}: English freeze trace drift`);
        assert(pkg.traceability.nativeFreezeId === (cp === "TSD-CP-005" ? TSD_CP005_HI_PA_FREEZE_ID : TSD_CP006_HI_PA_FREEZE_ID), `${cp}/${lang}/${ql}: native freeze trace drift`);
        assert(pkg.options[pkg.correctIndex] === pkg.answer, `${cp}/${lang}/${ql}: answer identity broken`);
        assert(allowed.has(stable([pkg.questionLanguageId, pkg.stem, pkg.options, pkg.correctIndex, pkg.answer])), `${cp}/${lang}/${ql}: output not on frozen learner surface`);
        JSON.stringify(batch);
        adapterChecks += 1;
      }
    }
  }
}
assert(adapterChecks === 468, `adapter check count ${adapterChecks}`);

const listed: any[] = listQuantV4Packages() as any[];
const tsd = listed.find((p) => p.packageId === "TSD-001");
assert(tsd && tsd.cpIds.join("|") === CPS.join("|"), "actual engine package list lost CP006");
assert(tsd.questionStudioReviewOnly === true, "actual engine package list lost review-only guard");

let engineChecks = 0;
for (const cp of CPS) {
  for (const lang of LANGS) {
    const ql = qls(cp)[engineChecks % 13]!;
    const routed: any = await generateQuestion({ packageId: "TSD-001", canonicalProblemId: cp, questionLanguageId: ql, language: lang, seed: `engine:${cp}:${lang}`, count: 1 } as any);
    const pkg = routed.questionPackages?.[0];
    assert(pkg?.canonicalProblemId === cp && pkg?.language === lang, `${cp}/${lang}: actual engine route drift`);
    assert(pkg.questionBankStatus === "NOT_STORED" && pkg.testEligibility === "INELIGIBLE" && pkg.publiclyPublishable === false, `${cp}/${lang}: actual engine downstream unlock`);
    JSON.stringify(routed);
    engineChecks += 1;
  }
}
assert(engineChecks === 6, "actual engine route check count drifted");

let crossRejected = false;
try { generateTsd001QuestionStudioBatch({ canonicalProblemId: "TSD-CP-005", questionLanguageId: "TSD-QL-071", language: "en", seed: "cross" }); } catch { crossRejected = true; }
assert(crossRejected, "cross-checkpoint QL was accepted");
let unknownRejected = false;
try { generateTsd001QuestionStudioBatch({ canonicalProblemId: "TSD-CP-007", language: "en", seed: "unknown" }); } catch { unknownRejected = true; }
assert(unknownRejected, "unknown checkpoint was accepted");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_FROZEN_MULTILINGUAL_QUESTION_STUDIO_REVIEW_ADAPTER_V2",
  packageId: "TSD-001",
  checkpointIds: CPS,
  permanentQlRange: "TSD-QL-058..TSD-QL-083",
  cp005QlRange: "TSD-QL-058..TSD-QL-070",
  cp006QlRange: "TSD-QL-071..TSD-QL-083",
  languages: LANGS,
  uniqueFrozenQuestionsPerLanguage: 156,
  routedFrozenAdapterChecks: adapterChecks,
  actualGenerationEngineRouteChecks: engineChecks,
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
