import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import { COA_CP008_EITHER_AUTHORITIES, COA_CP008_THREE_ACTION_AUTHORITIES } from "./cp008-profile-authorities.ts";
import {
  COA_CP009_FULL_LOCALIZATION_COUNTS,
  COA_CP009_FULL_LOCALIZED_EITHER,
  COA_CP009_FULL_LOCALIZED_ORDINARY,
  COA_CP009_FULL_LOCALIZED_THREE_ACTION,
  getCoaCp009LocalizedEither,
  getCoaCp009LocalizedOrdinary,
  getCoaCp009LocalizedThreeAction,
} from "./cp009-full-localization-registry.ts";
import { COA_CP009_CALIBRATION } from "./cp009-localization-calibration.ts";
import { generateCoaCp009LocalizedQuestion } from "./cp009-full-localization-generator.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const;

assert(COA_CURRENT_ENGLISH_AUTHORITIES.length === 120, `English ordinary authority count drifted: ${COA_CURRENT_ENGLISH_AUTHORITIES.length}`);
assert(COA_CP008_EITHER_AUTHORITIES.length === 4, "Either authority count drifted");
assert(COA_CP008_THREE_ACTION_AUTHORITIES.length === 6, "three-action authority count drifted");
assert(COA_CP009_FULL_LOCALIZED_ORDINARY.length === 240, "expected 240 ordinary localized surfaces");
assert(COA_CP009_FULL_LOCALIZED_EITHER.length === 8, "expected eight Either localized surfaces");
assert(COA_CP009_FULL_LOCALIZED_THREE_ACTION.length === 12, "expected twelve three-action localized surfaces");
assert(COA_CP009_FULL_LOCALIZATION_COUNTS.totalSemanticAuthorities === 130, "total semantic authority count must remain 130");
assert(COA_CP009_FULL_LOCALIZATION_COUNTS.totalLocalizedSurfaces === 260, "total localized surface count must remain 260");

function scriptCount(value: string, locale: "hi-IN" | "pa-IN"): number {
  if (locale === "hi-IN") return (value.match(/[\u0900-\u097F]/g) ?? []).length;
  return (value.match(/[\u0A00-\u0A7F]/g) ?? []).length;
}

function assertNativeText(locale: "hi-IN" | "pa-IN", text: string, id: string): void {
  assert(scriptCount(text, locale) >= 20, `${id}/${locale}: insufficient native-script learner text`);
  if (locale === "hi-IN") {
    assert(!/[\u0A00-\u0A7F]/u.test(text), `${id}: Hindi learner text leaked Gurmukhi`);
  } else {
    // U+0964/U+0965 danda punctuation is shared across Indic scripts, so exclude it.
    assert(!/[\u0900-\u0963\u0966-\u097F]/u.test(text), `${id}: Punjabi learner text leaked Devanagari letters`);
  }
  const noLabels = text.replace(/\b(?:I|II|III)\b/g, " ");
  assert(!/\b(the|and|or|only|both|neither|either|course|action|statement|follows|should|because|correct|wrong|question|answer|student|candidate|bank|school|office|service|record|payment|exam|portal|online|bus|brake|water|repair|customer|system|route|file|check|review|staff)\b/i.test(noLabels),
    `${id}/${locale}: core English wording leaked into learner text`);
}

function surfaceText(question: ReturnType<typeof generateCoaCp009LocalizedQuestion>): string {
  return [
    question.statement,
    question.instruction,
    ...question.courses.map((entry) => entry.text),
    ...question.answerOptions,
    question.explanation,
  ].join(" ");
}

const ordinaryIds = new Set(COA_CURRENT_ENGLISH_AUTHORITIES.map((entry) => entry.id));
const localizedOrdinaryIds = new Set(COA_CP009_FULL_LOCALIZED_ORDINARY.map((entry) => entry.semanticAuthorityId));
assert(localizedOrdinaryIds.size === ordinaryIds.size, "ordinary localization contains missing or extra semantic IDs");
for (const id of ordinaryIds) assert(localizedOrdinaryIds.has(id), `${id}: missing from full ordinary localization`);
for (const id of localizedOrdinaryIds) assert(ordinaryIds.has(id), `${id}: unknown ordinary localization ID`);

for (const english of COA_CURRENT_ENGLISH_AUTHORITIES) {
  for (const locale of LOCALES) {
    const local = getCoaCp009LocalizedOrdinary(english.id, locale);
    assert(local.actions[0].semanticActionId === english.actions[0].id, `${english.id}/${locale}: Course I ID drift`);
    assert(local.actions[1].semanticActionId === english.actions[1].id, `${english.id}/${locale}: Course II ID drift`);
    const question = generateCoaCp009LocalizedQuestion({ semanticAuthorityId: english.id, locale });
    const replay = generateCoaCp009LocalizedQuestion({ semanticAuthorityId: english.id, locale });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${english.id}/${locale}: generation is not deterministic`);
    assert(question.presentationProfile === "TWO_ACTION_FOUR_WAY", `${english.id}/${locale}: wrong ordinary presentation`);
    assert(question.qlId === english.qlId, `${english.id}/${locale}: QL drift`);
    assert(question.difficulty === english.difficulty, `${english.id}/${locale}: difficulty drift`);
    assert(question.domain === english.domain, `${english.id}/${locale}: domain drift`);
    assert(question.answerClass === english.expectedAnswerClass, `${english.id}/${locale}: answer-class drift`);
    const expectedIndex = english.expectedAnswerClass === "ONLY_I" ? 0
      : english.expectedAnswerClass === "ONLY_II" ? 1
      : english.expectedAnswerClass === "BOTH" ? 2 : 3;
    assert(question.correctIndex === expectedIndex, `${english.id}/${locale}: correct-index drift`);
    assert(question.legacySemanticQl === (english.qlId === "COA-QL-007"), `${english.id}/${locale}: legacy QL007 marker drift`);
    assert(question.reviewOnly === true && question.questionStudioRegistered === false, `${english.id}/${locale}: integration gate opened`);
    assert(question.questionBankWritable === false && question.testEligible === false && question.mockEligible === false && question.publicEligible === false,
      `${english.id}/${locale}: learner lifecycle gate opened`);
    assertNativeText(locale, surfaceText(question), english.id);
  }
}

assert(COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === "COA-QL-007").length === 2,
  "legacy QL007 calibration authority count must remain two");

for (const english of COA_CP008_EITHER_AUTHORITIES) {
  for (const locale of LOCALES) {
    const local = getCoaCp009LocalizedEither(english.id, locale);
    assert(local.actions[0].semanticActionId === english.actions[0].id && local.actions[1].semanticActionId === english.actions[1].id,
      `${english.id}/${locale}: Either action identity/order drift`);
    const question = generateCoaCp009LocalizedQuestion({ semanticAuthorityId: english.id, locale });
    assert(question.presentationProfile === "TWO_ACTION_FIVE_CODE", `${english.id}/${locale}: wrong Either presentation`);
    assert(question.answerClass === "EITHER" && question.correctIndex === 2, `${english.id}/${locale}: Either answer drift`);
    assert(question.pairRelation === "MUTUALLY_EXCLUSIVE_ALTERNATIVES", `${english.id}/${locale}: Either relation lost`);
    assert(question.difficulty === english.difficulty && question.domain === english.domain, `${english.id}/${locale}: Either metadata drift`);
    assert(question.reviewOnly === true && question.questionStudioRegistered === false && question.publicEligible === false,
      `${english.id}/${locale}: Either lifecycle gate opened`);
    assertNativeText(locale, surfaceText(question), english.id);
  }
}

for (const english of COA_CP008_THREE_ACTION_AUTHORITIES) {
  for (const locale of LOCALES) {
    const local = getCoaCp009LocalizedThreeAction(english.id, locale);
    assert(local.actions.length === 3, `${english.id}/${locale}: three-action count drift`);
    for (let index = 0; index < 3; index += 1) {
      assert(local.actions[index]!.semanticActionId === english.actions[index]!.id,
        `${english.id}/${locale}: three-action identity/order drift at ${index}`);
    }
    const question = generateCoaCp009LocalizedQuestion({ semanticAuthorityId: english.id, locale });
    assert(question.presentationProfile === "THREE_ACTION_COMBINATION", `${english.id}/${locale}: wrong three-action presentation`);
    assert(question.answerMask === english.correctMask, `${english.id}/${locale}: three-action truth mask drift`);
    assert(question.correctIndex === english.optionMasks.indexOf(english.correctMask), `${english.id}/${locale}: three-action option-index drift`);
    assert(question.difficulty === english.difficulty && question.domain === english.domain, `${english.id}/${locale}: three-action metadata drift`);
    assert(question.reviewOnly === true && question.questionStudioRegistered === false && question.publicEligible === false,
      `${english.id}/${locale}: three-action lifecycle gate opened`);
    assertNativeText(locale, surfaceText(question), english.id);
  }
}

// Approved CP009 calibration must be reused exactly, not silently retranslated.
for (const approved of COA_CP009_CALIBRATION) {
  if (approved.kind === "TWO_ACTION") {
    const full = getCoaCp009LocalizedOrdinary(approved.semanticAuthorityId, approved.locale);
    assert(full.statement === approved.statement, `${approved.semanticAuthorityId}/${approved.locale}: approved calibration statement drift`);
    assert(JSON.stringify(full.actions) === JSON.stringify(approved.actions), `${approved.semanticAuthorityId}/${approved.locale}: approved calibration actions drift`);
  } else if (approved.kind === "EITHER") {
    const full = getCoaCp009LocalizedEither(approved.semanticAuthorityId, approved.locale);
    assert(full.statement === approved.statement && full.pairReason === approved.pairReason,
      `${approved.semanticAuthorityId}/${approved.locale}: approved Either calibration drift`);
    assert(JSON.stringify(full.actions) === JSON.stringify(approved.actions), `${approved.semanticAuthorityId}/${approved.locale}: approved Either actions drift`);
  } else {
    const full = getCoaCp009LocalizedThreeAction(approved.semanticAuthorityId, approved.locale);
    assert(full.statement === approved.statement, `${approved.semanticAuthorityId}/${approved.locale}: approved three-action calibration drift`);
    assert(JSON.stringify(full.actions) === JSON.stringify(approved.actions), `${approved.semanticAuthorityId}/${approved.locale}: approved three-action actions drift`);
  }
}

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-009",
  phase: "FULL_HI_PA_LOCALIZATION",
  englishOrdinaryAuthorities: COA_CURRENT_ENGLISH_AUTHORITIES.length,
  eitherAuthorities: COA_CP008_EITHER_AUTHORITIES.length,
  threeActionAuthorities: COA_CP008_THREE_ACTION_AUTHORITIES.length,
  totalSemanticAuthorities: 130,
  locales: LOCALES,
  localizedLearnerSurfaces: 260,
  ordinarySemanticIdentityParity: true,
  qlDifficultyDomainParity: true,
  answerClassAndIndexParity: true,
  eitherRelationParity: true,
  threeActionTruthMaskParity: true,
  approvedCalibrationByteReuse: true,
  nativeScriptGate: true,
  crossScriptGate: true,
  coreEnglishLeakageGate: true,
  legacyQl007PreservedButNotExpanded: true,
  questionStudio: "CLOSED",
  questionBank: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
