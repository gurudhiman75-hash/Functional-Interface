import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import { COA_CP008_EITHER_AUTHORITIES, COA_CP008_THREE_ACTION_AUTHORITIES } from "./cp008-profile-authorities.ts";
import { COA_CP009_CALIBRATION, COA_CP009_CALIBRATION_IDS } from "./cp009-localization-calibration.ts";
import { generateCoaCp009CalibrationQuestion } from "./cp009-localization-generator.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const ACTIVE_QLS = Object.freeze([
  "COA-QL-001", "COA-QL-002", "COA-QL-003", "COA-QL-004",
  "COA-QL-005", "COA-QL-006", "COA-QL-008", "COA-QL-009",
] as const);

assert(COA_CP009_CALIBRATION_IDS.length === 10, "CP009 calibration must contain ten semantic authorities");
assert(COA_CP009_CALIBRATION.length === 20, "CP009 calibration must contain Hindi and Punjabi for each authority");

const ids = new Set(COA_CP009_CALIBRATION_IDS);
assert(ids.size === 10, "CP009 calibration authority IDs must be unique");
assert(!ids.has("COA-SC-019" as never) && !ids.has("COA-SC-020" as never), "Legacy QL007 authority must not enter CP009 calibration");

const ordinary = COA_CP009_CALIBRATION.filter((entry) => entry.kind === "TWO_ACTION");
const qls = new Set(ordinary.map((entry) => entry.kind === "TWO_ACTION" ? entry.qlId : ""));
for (const qlId of ACTIVE_QLS) assert(qls.has(qlId), `${qlId}: CP009 calibration missing active semantic QL`);

function learnerText(question: ReturnType<typeof generateCoaCp009CalibrationQuestion>): string {
  return [
    question.statement,
    question.instruction,
    ...question.courses.map((course) => course.text),
    ...question.answerOptions,
    question.explanation,
  ].join(" ");
}

function assertLocaleText(locale: "hi-IN" | "pa-IN", text: string, id: string): void {
  if (locale === "hi-IN") {
    assert(/[\u0900-\u097F]/u.test(text), `${id}: Hindi learner text has no Devanagari`);
    assert(!/[\u0A00-\u0A7F]/u.test(text), `${id}: Hindi learner text leaked Gurmukhi`);
  } else {
    assert(/[\u0A00-\u0A7F]/u.test(text), `${id}: Punjabi learner text has no Gurmukhi`);
    assert(!/[\u0900-\u0963\u0966-\u097F]/u.test(text), `${id}: Punjabi learner text leaked Devanagari letters`);
  }
  const withoutRomanLabels = text.replace(/\b(?:I|II|III)\b/g, " ");
  assert(!/\b(the|and|or|only|both|neither|either|course|action|statement|follows|should|because|correct|wrong|question|answer|student|candidate|bank|school|office|service|record|payment|exam|portal|online|bus|brake|water|repair)\b/i.test(withoutRomanLabels),
    `${id}: core English learner wording leaked into ${locale}`);
}

for (const id of COA_CP009_CALIBRATION_IDS) {
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const question = generateCoaCp009CalibrationQuestion({ semanticAuthorityId: id, locale });
    const replay = generateCoaCp009CalibrationQuestion({ semanticAuthorityId: id, locale });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${id}/${locale}: localization generation is not deterministic`);
    assert(question.checkpointId === "COA-CP-009", `${id}/${locale}: wrong checkpoint`);
    assert(question.localizationStatus === "CALIBRATION_HUMAN_REVIEW_PENDING", `${id}/${locale}: wrong localization status`);
    assert(question.semanticAuthorityId === id, `${id}/${locale}: semantic authority ID drift`);
    assert(question.correctIndex >= 0 && question.correctIndex < question.answerOptions.length, `${id}/${locale}: invalid correct index`);
    assert(question.reviewOnly === true, `${id}/${locale}: review-only gate opened`);
    assert(question.questionStudioRegistered === false, `${id}/${locale}: Question Studio opened before localization approval`);
    assert(question.questionBankWritable === false, `${id}/${locale}: Question Bank gate opened`);
    assert(question.testEligible === false && question.mockEligible === false && question.publicEligible === false,
      `${id}/${locale}: learner delivery gate opened`);

    const text = learnerText(question);
    assertLocaleText(locale, text, id);
    assert(question.statement.length >= 55, `${id}/${locale}: localized statement too thin`);
    assert(question.explanation.length >= 100, `${id}/${locale}: localized explanation too thin`);

    if (question.presentationProfile === "TWO_ACTION_FOUR_WAY") {
      const english = COA_CURRENT_ENGLISH_AUTHORITIES.find((entry) => entry.id === id);
      assert(english, `${id}: English authority missing`);
      assert(question.qlId === english.qlId, `${id}/${locale}: QL drift`);
      assert(question.difficulty === english.difficulty && question.domain === english.domain, `${id}/${locale}: metadata drift`);
      assert(question.answerClass === english.expectedAnswerClass, `${id}/${locale}: answer-class drift`);
      const expectedIndex = english.expectedAnswerClass === "ONLY_I" ? 0
        : english.expectedAnswerClass === "ONLY_II" ? 1
        : english.expectedAnswerClass === "BOTH" ? 2 : 3;
      assert(question.correctIndex === expectedIndex, `${id}/${locale}: correct-index drift`);
      assert(question.courses[0]!.semanticActionId === english.actions[0]!.id, `${id}/${locale}: Course I semantic ID drift`);
      assert(question.courses[1]!.semanticActionId === english.actions[1]!.id, `${id}/${locale}: Course II semantic ID drift`);
    } else if (question.presentationProfile === "TWO_ACTION_FIVE_CODE") {
      const english = COA_CP008_EITHER_AUTHORITIES.find((entry) => entry.id === id);
      assert(english, `${id}: English Either authority missing`);
      assert(question.answerClass === "EITHER" && question.correctIndex === 2, `${id}/${locale}: Either answer drift`);
      assert(question.pairRelation === "MUTUALLY_EXCLUSIVE_ALTERNATIVES", `${id}/${locale}: Either pair relation lost`);
      assert(question.courses[0]!.semanticActionId === english.actions[0]!.id && question.courses[1]!.semanticActionId === english.actions[1]!.id,
        `${id}/${locale}: Either action identity drift`);
    } else {
      const english = COA_CP008_THREE_ACTION_AUTHORITIES.find((entry) => entry.id === id);
      assert(english, `${id}: English three-action authority missing`);
      assert(question.answerMask === english.correctMask, `${id}/${locale}: three-action mask drift`);
      assert(question.correctIndex === english.optionMasks.indexOf(english.correctMask), `${id}/${locale}: three-action correct-index drift`);
      assert(question.courses.length === 3, `${id}/${locale}: three-action course count drift`);
      for (let i = 0; i < 3; i += 1) {
        assert(question.courses[i]!.semanticActionId === english.actions[i]!.id, `${id}/${locale}: three-action identity drift at ${i}`);
      }
    }
  }
}

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-009",
  phase: "LANGUAGE_CALIBRATION",
  locales: ["hi-IN", "pa-IN"],
  semanticCalibrationAuthorities: COA_CP009_CALIBRATION_IDS.length,
  localizedCalibrationSurfaces: COA_CP009_CALIBRATION.length,
  activeSemanticQlCoverage: ACTIVE_QLS,
  fiveWayEitherCalibration: 1,
  threeActionCalibration: 1,
  semanticIdentityParity: true,
  answerParity: true,
  actionOrderParity: true,
  nativeScriptGate: true,
  coreEnglishLeakageGate: true,
  fullCorpusLocalization: "BLOCKED_UNTIL_HUMAN_LANGUAGE_APPROVAL",
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
