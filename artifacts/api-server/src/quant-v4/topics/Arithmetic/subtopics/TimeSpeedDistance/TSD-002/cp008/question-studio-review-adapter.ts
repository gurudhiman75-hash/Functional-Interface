import { add, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP008_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP008_ENGLISH_REVIEW_CASES, type TsdCp008EnglishReviewCase } from "./english-review-cases";
import type { TsdCp008ExecutableInput, TsdCp008ValueUnit } from "./executable-types";
import {
  TSD_CP008_FROZEN_HINDI_LOCALIZATION,
  TSD_CP008_FROZEN_PUNJABI_LOCALIZATION,
  TSD_CP008_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";
import { verifyTsdCp008 } from "./executable-verifier";

export const TSD_CP008_QUESTION_STUDIO_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP008_QUESTION_STUDIO_CHECKPOINT_ID = "TSD-CP-008" as const;
export const TSD_CP008_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP008_QUESTION_STUDIO_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP008_QUESTION_STUDIO_RUNTIME_MODE = "TSD-CP-008-MULTILINGUAL-FROZEN-REVIEW-v1" as const;
export const TSD_CP008_QUESTION_STUDIO_INTEGRATION_AUTHORITY = `TSD-CP-008:${TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead}` as const;

export type TsdCp008QuestionStudioLanguage = (typeof TSD_CP008_QUESTION_STUDIO_LANGUAGES)[number];
export type TsdCp008QuestionStudioDifficulty = (typeof TSD_CP008_QUESTION_STUDIO_DIFFICULTIES)[number];
export type TsdCp008QuestionStudioQlId = (typeof TSD_CP008_PERMANENT_QL_IDS)[number];

export type TsdCp008QuestionStudioReviewRequest = Readonly<{
  language?: TsdCp008QuestionStudioLanguage;
  qlId?: TsdCp008QuestionStudioQlId;
  familyId?: string;
  difficulty?: TsdCp008QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

type StudioFamily = Readonly<{
  familyId: string;
  difficulty: "EASY" | "MEDIUM";
  representation: string;
  scene: string;
  stem: string;
  explanationGuide: string;
}>;

type StudioQl = Readonly<{
  qlId: TsdCp008QuestionStudioQlId;
  authorityKey: TsdCp008ExecutableInput["authorityKey"];
  learnerContract: string;
  families: readonly StudioFamily[];
}>;

const KMH_INPUT_FAMILIES = new Set([
  "95-A", "95-B", "95-C", "95-D", "95-F",
  "96-A", "96-C",
  "98-A", "98-C", "98-E",
  "99-A", "99-D", "99-F",
  "100-B", "100-E",
  "102-A", "102-B", "102-C", "102-D",
  "103-A", "103-C", "103-F",
]);
const KMH_ANSWER_FAMILIES = new Set(["99-A", "99-D", "99-F"]);
const LOCALE_COUNT = 3;
const NATURAL_CASES_PER_QL = 6;

function text(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function kmh(value: Rational): Rational {
  return multiply(value, rational(18, 5));
}

function speed(value: Rational, familyId: string, language: TsdCp008QuestionStudioLanguage): string {
  if (KMH_INPUT_FAMILIES.has(familyId)) {
    const converted = kmh(value);
    if (converted.denominator !== 1n) throw new Error(`${familyId}: exam-natural km/h rendering requires an integer value`);
    if (language === "hi") return `${text(converted)} किमी/घंटा`;
    if (language === "pa") return `${text(converted)} ਕਿਮੀ/ਘੰਟਾ`;
    return `${text(converted)} km/h`;
  }
  if (language === "hi") return `${text(value)} मी/से`;
  if (language === "pa") return `${text(value)} ਮੀ/ਸਕਿੰਟ`;
  return `${text(value)} m/s`;
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function objectName(familyId: string, language: TsdCp008QuestionStudioLanguage): string {
  const letter = familyId.split("-")[1] ?? "A";
  const bridge = ["B", "D", "F"].includes(letter);
  if (language === "hi") return bridge ? "रेलवे पुल" : "स्टेशन प्लेटफॉर्म";
  if (language === "pa") return bridge ? "ਰੇਲਵੇ ਪੁਲ" : "ਸਟੇਸ਼ਨ ਪਲੇਟਫਾਰਮ";
  return bridge ? "railway bridge" : "station platform";
}

function observerName(familyId: string, language: TsdCp008QuestionStudioLanguage): string {
  const letter = familyId.split("-")[1] ?? "A";
  if (language === "hi") {
    return ({ A: "पैदल निरीक्षक", B: "रेलवे गार्ड", C: "साइकिल सवार", D: "चलते कर्मचारी", E: "धावक", F: "चलते व्यक्ति" } as const)[letter as "A" | "B" | "C" | "D" | "E" | "F"] ?? "चलते व्यक्ति";
  }
  if (language === "pa") {
    return ({ A: "ਪੈਦਲ ਇੰਸਪੈਕਟਰ", B: "ਰੇਲਵੇ ਗਾਰਡ", C: "ਸਾਈਕਲ ਸਵਾਰ", D: "ਚੱਲਦੇ ਕਰਮਚਾਰੀ", E: "ਦੌੜਾਕ", F: "ਚੱਲਦੇ ਵਿਅਕਤੀ" } as const)[letter as "A" | "B" | "C" | "D" | "E" | "F"] ?? "ਚੱਲਦੇ ਵਿਅਕਤੀ";
  }
  return ({ A: "walking inspector", B: "guard", C: "cyclist", D: "worker", E: "runner", F: "moving person" } as const)[letter as "A" | "B" | "C" | "D" | "E" | "F"] ?? "moving observer";
}

function directionPhrase(direction: "OPPOSITE" | "SAME", language: TsdCp008QuestionStudioLanguage, requireFirstFaster = false): string {
  if (language === "hi") return direction === "OPPOSITE" ? "विपरीत दिशाओं में" : "एक ही दिशा में";
  if (language === "pa") return direction === "OPPOSITE" ? "ਉਲਟੀ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ" : "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ";
  if (direction === "OPPOSITE") return "in opposite directions";
  return requireFirstFaster ? "in the same direction, with the first train faster" : "in the same direction";
}

function observerDirectionPhrase(direction: "OPPOSITE" | "SAME", language: TsdCp008QuestionStudioLanguage): string {
  if (language === "hi") return direction === "OPPOSITE" ? "विपरीत दिशा में" : "एक ही दिशा में";
  if (language === "pa") return direction === "OPPOSITE" ? "ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ";
  return direction === "OPPOSITE" ? "in opposite directions" : "in the same direction";
}

function targetQuestion(target: string, authorityKey: TsdCp008ExecutableInput["authorityKey"], familyId: string, language: TsdCp008QuestionStudioLanguage): string {
  if (authorityKey === "trainObserverStateFromCrossingTimes") {
    if (target === "TRAIN_SPEED") {
      if (language === "hi") return "ट्रेन की गति निकालें।";
      if (language === "pa") return "ਰੇਲਗੱਡੀ ਦੀ ਗਤੀ ਕੱਢੋ।";
      return "Find the train's speed.";
    }
    const observer = observerName(familyId, language);
    if (language === "hi") return `${observer} की गति निकालें।`;
    if (language === "pa") return `${observer} ਦੀ ਗਤੀ ਕੱਢੋ।`;
    return `Find the ${observer}'s speed.`;
  }
  const object = objectName(familyId, language);
  if (target === "FIXED_OBJECT_LENGTH") {
    if (language === "hi") return `${object} की लंबाई निकालें।`;
    if (language === "pa") return `${object} ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`;
    return `Find the length of the ${object}.`;
  }
  if (language === "hi") return "पहली ट्रेन की लंबाई निकालें।";
  if (language === "pa") return "ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।";
  return "Find the length of the first train.";
}

function bindingsFor(familyId: string, input: TsdCp008ExecutableInput, language: TsdCp008QuestionStudioLanguage): Readonly<Record<string, string>> {
  const bindings: Record<string, string> = {};
  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), speedA: speed(input.speedA, familyId, language), speedB: speed(input.speedB, familyId, language) });
      break;
    case "sameDirectionTrainCrossingTime":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), fasterSpeed: speed(input.fasterSpeed, familyId, language), slowerSpeed: speed(input.slowerSpeed, familyId, language) });
      break;
    case "relativeSpeedFromTrainCrossing":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), crossingTime: text(input.crossingTime) });
      break;
    case "trainLengthFromTrainCrossingEvidence":
      Object.assign(bindings, { knownLength: text(input.knownLength), speedA: speed(input.speedA, familyId, language), speedB: speed(input.speedB, familyId, language), crossingTime: text(input.crossingTime), directionPhrase: directionPhrase(input.direction, language) });
      break;
    case "trainSpeedFromTrainCrossingEvidence":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), otherSpeed: speed(input.otherSpeed, familyId, language), crossingTime: text(input.crossingTime), directionPhrase: directionPhrase(input.direction, language, true) });
      break;
    case "movingObserverTrainCrossingTime":
      Object.assign(bindings, { trainLength: text(input.trainLength), trainSpeed: speed(input.trainSpeed, familyId, language), observerSpeed: speed(input.observerSpeed, familyId, language), directionPhrase: observerDirectionPhrase(input.direction, language) });
      break;
    case "trainObserverStateFromCrossingTimes":
      Object.assign(bindings, { trainLength: text(input.trainLength), sameTime: text(input.sameDirectionTime), oppositeTime: text(input.oppositeDirectionTime), targetQuestion: targetQuestion(input.target, input.authorityKey, familyId, language) });
      break;
    case "sharedFixedObjectTwoTrainEvidence":
      Object.assign(bindings, {
        ratio: ratio(input.lengthRatioAtoB), speedA: speed(input.speedA, familyId, language), speedB: speed(input.speedB, familyId, language),
        timeA: text(input.crossingTimeA), timeB: text(input.crossingTimeB), objectName: objectName(familyId, language),
        targetQuestion: targetQuestion(input.target, input.authorityKey, familyId, language),
      });
      break;
    case "fullContainmentOverlapDuration":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), speedA: speed(input.speedA, familyId, language), speedB: speed(input.speedB, familyId, language), directionPhrase: directionPhrase(input.direction, language) });
      break;
  }
  return Object.freeze(bindings);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP008 Question Studio binding missing`);
    return value;
  });
}

function englishQls(): readonly StudioQl[] {
  return Object.freeze(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => Object.freeze({
    qlId: ql.qlId as TsdCp008QuestionStudioQlId,
    authorityKey: ql.authorityKey as TsdCp008ExecutableInput["authorityKey"],
    learnerContract: ql.learnerContract,
    families: Object.freeze(ql.stemFamilies.map((family) => Object.freeze({ ...family }))),
  })));
}

function localizedQls(language: "hi" | "pa"): readonly StudioQl[] {
  const registry = language === "hi" ? TSD_CP008_FROZEN_HINDI_LOCALIZATION : TSD_CP008_FROZEN_PUNJABI_LOCALIZATION;
  const english = new Map(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => [ql.qlId, ql] as const));
  return Object.freeze(registry.qls.map((ql) => {
    const source = english.get(ql.qlId);
    if (!source) throw new Error(`${language}/${ql.qlId}: frozen English metadata missing`);
    const sourceFamilies = new Map(source.stemFamilies.map((family) => [family.familyId, family] as const));
    return Object.freeze({
      qlId: ql.qlId as TsdCp008QuestionStudioQlId,
      authorityKey: ql.authorityKey as TsdCp008ExecutableInput["authorityKey"],
      learnerContract: ql.learnerContract,
      families: Object.freeze(ql.families.map((family) => {
        const sourceFamily = sourceFamilies.get(family.familyId);
        if (!sourceFamily) throw new Error(`${language}/${family.familyId}: frozen English family metadata missing`);
        return Object.freeze({
          familyId: family.familyId,
          difficulty: family.difficulty,
          representation: sourceFamily.representation,
          scene: sourceFamily.scene,
          stem: family.stem,
          explanationGuide: family.explanationGuide,
        });
      })),
    });
  }));
}

function qlsFor(language: TsdCp008QuestionStudioLanguage): readonly StudioQl[] {
  return language === "en" ? englishQls() : localizedQls(language);
}

function caseSpeeds(input: TsdCp008ExecutableInput): readonly Rational[] {
  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime": return [input.speedA, input.speedB];
    case "sameDirectionTrainCrossingTime": return [input.fasterSpeed, input.slowerSpeed];
    case "trainLengthFromTrainCrossingEvidence": return [input.speedA, input.speedB];
    case "trainSpeedFromTrainCrossingEvidence": return [input.otherSpeed];
    case "movingObserverTrainCrossingTime": return [input.trainSpeed, input.observerSpeed];
    case "sharedFixedObjectTwoTrainEvidence": return [input.speedA, input.speedB];
    case "fullContainmentOverlapDuration": return [input.speedA, input.speedB];
    default: return [];
  }
}

function examNaturalForFamily(familyId: string, reviewCase: TsdCp008EnglishReviewCase): boolean {
  if (!KMH_INPUT_FAMILIES.has(familyId)) return true;
  return caseSpeeds(reviewCase.input).every((value) => kmh(value).denominator === 1n);
}

const casesByQl = new Map<TsdCp008QuestionStudioQlId, readonly TsdCp008EnglishReviewCase[]>(
  TSD_CP008_PERMANENT_QL_IDS.map((qlId) => [qlId, Object.freeze(TSD_CP008_ENGLISH_REVIEW_CASES.filter((entry) => entry.qlId === qlId))] as const),
);

export const TSD_CP008_QUESTION_STUDIO_COMPATIBLE_CASES = Object.freeze(Object.fromEntries(
  englishQls().flatMap((ql) => ql.families.map((family) => {
    const cases = casesByQl.get(ql.qlId) ?? [];
    const compatible = cases.map((entry, index) => ({ entry, index: index + 1 })).filter(({ entry }) => examNaturalForFamily(family.familyId, entry)).map(({ index }) => index);
    if (!compatible.length) throw new Error(`${family.familyId}: no exam-natural Question Studio cases available`);
    return [family.familyId, Object.freeze(compatible)] as const;
  })),
) as Readonly<Record<string, readonly number[]>>);

export const TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE = Object.values(TSD_CP008_QUESTION_STUDIO_COMPATIBLE_CASES).reduce((sum, indices) => sum + indices.length, 0);
const compatibleCounts = Object.values(TSD_CP008_QUESTION_STUDIO_COMPATIBLE_CASES).map((indices) => indices.length);

export const TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: TSD_CP008_QUESTION_STUDIO_PACKAGE_ID,
  packageId: TSD_CP008_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Time, Speed & Distance",
  chapterId: "TSD-002",
  checkpointId: TSD_CP008_QUESTION_STUDIO_CHECKPOINT_ID,
  name: "TSD-002 Time, Speed & Distance — CP-008 Multilingual Frozen Review",
  label: "Time, Speed & Distance · CP-008 · 9 Frozen QLs",
  generationDomain: "quant-v4",
  qlIds: [...TSD_CP008_PERMANENT_QL_IDS],
  supportedDifficulties: [...TSD_CP008_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...TSD_CP008_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: TSD_CP008_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
  mockTestEligible: false,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  questionBankEligible: false,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  integrationAuthority: TSD_CP008_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  frozenQlCount: TSD_CP008_PERMANENT_QL_IDS.length,
  frozenFamiliesPerLocale: 54,
  naturalNumericCasesPerQl: NATURAL_CASES_PER_QL,
  minimumCompatibleCasesPerFamily: Math.min(...compatibleCounts),
  maximumCompatibleCasesPerFamily: Math.max(...compatibleCounts),
  compatibleReviewCombinationsPerLocale: TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicReviewCombinations: TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE * LOCALE_COUNT,
  bulkSyncSupported: false,
} as const);

function displayValue(value: Rational, unit: TsdCp008ValueUnit, familyId: string, language: TsdCp008QuestionStudioLanguage): { value: Rational; suffix: string } {
  const useKmh = unit === "METRE_PER_SECOND" && KMH_ANSWER_FAMILIES.has(familyId);
  const renderedValue = useKmh ? kmh(value) : value;
  if (language === "hi") return { value: renderedValue, suffix: unit === "SECOND" ? " सेकंड" : unit === "METRE" ? " मीटर" : useKmh ? " किमी/घंटा" : " मी/से" };
  if (language === "pa") return { value: renderedValue, suffix: unit === "SECOND" ? " ਸਕਿੰਟ" : unit === "METRE" ? " ਮੀਟਰ" : useKmh ? " ਕਿਮੀ/ਘੰਟਾ" : " ਮੀ/ਸਕਿੰਟ" };
  return { value: renderedValue, suffix: unit === "SECOND" ? " seconds" : unit === "METRE" ? " m" : useKmh ? " km/h" : " m/s" };
}

function answerText(value: Rational, unit: TsdCp008ValueUnit, familyId: string, language: TsdCp008QuestionStudioLanguage): string {
  const display = displayValue(value, unit, familyId, language);
  return `${text(display.value)}${display.suffix}`;
}

function optionSet(value: Rational, unit: TsdCp008ValueUnit, familyId: string, language: TsdCp008QuestionStudioLanguage, salt: number): Readonly<{ options: readonly string[]; correctIndex: number }> {
  const display = displayValue(value, unit, familyId, language);
  const one = rational(1);
  const two = rational(2);
  const minusOne = subtract(display.value, one);
  const distractors = [add(display.value, one), add(display.value, two), minusOne.numerator > 0n ? minusOne : add(display.value, rational(3))];
  const raw = [display.value, ...distractors].map((entry) => `${text(entry)}${display.suffix}`);
  if (new Set(raw).size !== 4) throw new Error(`${familyId}: option construction produced duplicates`);
  const shift = Math.abs(salt) % 4;
  const options = Object.freeze(raw.map((_entry, index) => raw[(index + shift) % 4]!));
  const correct = `${text(display.value)}${display.suffix}`;
  return Object.freeze({ options, correctIndex: options.indexOf(correct) });
}

function hash(value: string): number {
  let output = 2166136261;
  for (let index = 0; index < value.length; index += 1) output = Math.imul(output ^ value.charCodeAt(index), 16777619);
  return output | 0;
}

function conclusion(language: TsdCp008QuestionStudioLanguage, answer: string): string {
  if (language === "hi") return `अतः उत्तर ${answer} है।`;
  if (language === "pa") return `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`;
  return `Therefore, the answer is ${answer}.`;
}

function localeFor(language: TsdCp008QuestionStudioLanguage): string {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function allCombinations(language: TsdCp008QuestionStudioLanguage) {
  const qls = qlsFor(language);
  return qls.flatMap((ql) => ql.families.flatMap((family) => {
    const cases = casesByQl.get(ql.qlId) ?? [];
    return (TSD_CP008_QUESTION_STUDIO_COMPATIBLE_CASES[family.familyId] ?? []).map((caseNumber) => ({
      ql,
      family,
      reviewCase: cases[caseNumber - 1]!,
      caseNumber,
    }));
  }));
}

export function previewTsdCp008QuestionStudioReview(request: TsdCp008QuestionStudioReviewRequest = {}) {
  const language = request.language ?? "en";
  const requestedCount = Math.max(1, Math.floor(request.count ?? 5));
  let combinations = allCombinations(language).filter(({ ql, family }) =>
    (!request.qlId || ql.qlId === request.qlId)
    && (!request.familyId || family.familyId === request.familyId)
    && (!request.difficulty || family.difficulty === request.difficulty));

  if (!combinations.length) throw new Error("No TSD-CP-008 frozen Question Studio combinations match the requested filters.");
  if (requestedCount > combinations.length) throw new Error(`Requested ${requestedCount} questions but only ${combinations.length} unique compatible CP008 combinations exist for these filters.`);

  const seed = request.seed ?? "cp008-question-studio-review";
  const offset = Math.abs(hash(seed)) % combinations.length;
  combinations = [...combinations.slice(offset), ...combinations.slice(0, offset)];

  const questions = combinations.slice(0, requestedCount).map(({ ql, family, reviewCase, caseNumber }, index) => {
    const verification = verifyTsdCp008(reviewCase.input, reviewCase.solution);
    if (!verification.valid) throw new Error(`${family.familyId}/case-${caseNumber}: executable verification failed`);
    const bindings = bindingsFor(family.familyId, reviewCase.input, language);
    const stem = render(family.stem, bindings);
    const explanationGuide = render(family.explanationGuide, bindings);
    if (/[{}]/.test(stem) || /[{}]/.test(explanationGuide)) throw new Error(`${family.familyId}/case-${caseNumber}: unresolved placeholder`);
    if (language === "hi" && /चाल/.test(`${stem} ${explanationGuide}`)) throw new Error(`${family.familyId}/case-${caseNumber}: deprecated Hindi चाल leaked`);
    const answer = answerText(reviewCase.solution.value, reviewCase.solution.unit, family.familyId, language);
    const options = optionSet(reviewCase.solution.value, reviewCase.solution.unit, family.familyId, language, hash(`${seed}:${family.familyId}:${caseNumber}:${index}`));
    if (options.correctIndex < 0) throw new Error(`${family.familyId}/case-${caseNumber}: correct option missing`);
    const canonicalItemId = `TSD-CP008:${ql.qlId}:${family.familyId}:N${caseNumber}`;
    const questionLanguageId = `${canonicalItemId}:${language}`;
    return Object.freeze({
      stem,
      options: options.options,
      correctIndex: options.correctIndex,
      answer,
      explanation: Object.freeze({ steps: Object.freeze([explanationGuide]), conclusion: conclusion(language, answer) }),
      difficultyBand: family.difficulty,
      qlId: ql.qlId,
      familyId: family.familyId,
      questionId: questionLanguageId,
      canonicalItemId,
      questionLanguageId,
      language,
      locale: localeFor(language),
      representation: family.representation,
      scene: family.scene,
      runtimeMode: TSD_CP008_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
      integrationAuthority: TSD_CP008_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      parameters: Object.freeze({ naturalCaseFamilyId: reviewCase.familyId, naturalCaseNumber: caseNumber, authorityKey: ql.authorityKey }),
      validation: Object.freeze({
        exactSolverVerified: true,
        independentVerifierValid: verification.valid,
        frozenEnglish: true,
        frozenHindi: true,
        frozenPunjabi: true,
        examNaturalCase: true,
        compatibleCase: true,
        fourUniqueOptions: new Set(options.options).size === 4,
        correctAnswerOwnedByOption: options.options[options.correctIndex] === answer,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      }),
    });
  });

  return Object.freeze({
    package: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE,
    request: Object.freeze({ ...request, language, count: requestedCount, seed }),
    availableCombinationsUnderFilters: combinations.length,
    questions: Object.freeze(questions),
  });
}
