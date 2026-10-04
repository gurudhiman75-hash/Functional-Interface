import { divide, multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP009_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import type { TsdCp009EnglishFamily } from "./english-authoring-registry";
import type { TsdCp009ExecutableInput, TsdCp009ExecutableSolution } from "./executable-types";
import {
  TSD_CP009_FROZEN_HINDI_LOCALIZATION,
  TSD_CP009_FROZEN_PUNJABI_LOCALIZATION,
  TSD_CP009_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP009_LOCALIZED_REVIEW_CASES, type TsdCp009EnglishReviewCase } from "./localized-review-cases";
import { TSD_CP009_PERMANENT_QL_IDS } from "./ql-allocation";
import { verifyTsdCp009 } from "./executable-verifier";

export const TSD_CP009_QUESTION_STUDIO_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP009_QUESTION_STUDIO_CHECKPOINT_ID = "TSD-CP-009" as const;
export const TSD_CP009_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP009_QUESTION_STUDIO_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP009_QUESTION_STUDIO_RUNTIME_MODE = "TSD-CP-009-MULTILINGUAL-FROZEN-REVIEW-v1" as const;
export const TSD_CP009_QUESTION_STUDIO_INTEGRATION_AUTHORITY = `TSD-CP-009:${TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead}` as const;

export type TsdCp009QuestionStudioLanguage = (typeof TSD_CP009_QUESTION_STUDIO_LANGUAGES)[number];
export type TsdCp009QuestionStudioDifficulty = (typeof TSD_CP009_QUESTION_STUDIO_DIFFICULTIES)[number];
export type TsdCp009QuestionStudioQlId = (typeof TSD_CP009_PERMANENT_QL_IDS)[number];

export type TsdCp009QuestionStudioReviewRequest = Readonly<{
  language?: TsdCp009QuestionStudioLanguage;
  qlId?: TsdCp009QuestionStudioQlId;
  familyId?: string;
  difficulty?: TsdCp009QuestionStudioDifficulty;
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
  qlId: TsdCp009QuestionStudioQlId;
  authorityKey: TsdCp009ExecutableInput["authorityKey"];
  learnerContract: string;
  families: readonly StudioFamily[];
}>;

type CompatibleQuestion = Readonly<{
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
  difficultyBand: "EASY" | "MEDIUM";
  qlId: TsdCp009QuestionStudioQlId;
  familyId: string;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: TsdCp009QuestionStudioLanguage;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  representation: string;
  scene: string;
  runtimeMode: typeof TSD_CP009_QUESTION_STUDIO_RUNTIME_MODE;
  reviewStatus: "FROZEN_REVIEW_ONLY";
  integrationAuthority: typeof TSD_CP009_QUESTION_STUDIO_INTEGRATION_AUTHORITY;
  parameters: Readonly<Record<string, unknown>>;
  validation: Readonly<Record<string, unknown>>;
}>;

const SOURCE_CASE_BY_FAMILY = new Map(TSD_CP009_LOCALIZED_REVIEW_CASES.map((entry) => [entry.familyId, entry] as const));
const AIRCRAFT_FAMILIES = new Set(["104-E", "105-E", "105-F", "108-F", "110-E"]);

function raw(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function integer(value: Rational, label: string): bigint {
  if (value.denominator !== 1n) throw new Error(`${label}: non-integer learner presentation`);
  return value.numerator;
}

function kmhValue(value: Rational): bigint {
  return integer(multiply(value, rational(18, 5)), "km/h");
}

function kmValue(value: Rational): bigint {
  return integer(divide(value, rational(1000)), "km");
}

function minuteValue(value: Rational): bigint {
  return integer(divide(value, rational(60)), "minutes");
}

function kmh(value: Rational, language: TsdCp009QuestionStudioLanguage): string {
  const n = kmhValue(value);
  if (language === "hi") return `${n} किमी/घंटा`;
  if (language === "pa") return `${n} ਕਿਮੀ/ਘੰਟਾ`;
  return `${n} km/h`;
}

function km(value: Rational, language: TsdCp009QuestionStudioLanguage): string {
  const n = kmValue(value);
  if (language === "hi") return `${n} किमी`;
  if (language === "pa") return `${n} ਕਿਮੀ`;
  return `${n} km`;
}

function duration(value: Rational, language: TsdCp009QuestionStudioLanguage): string {
  const minutes = minuteValue(value);
  if (minutes <= 0n) throw new Error("duration must be positive");
  const hours = minutes / 60n;
  const rem = minutes % 60n;
  if (language === "hi") {
    if (hours === 0n) return `${rem} मिनट`;
    if (rem === 0n) return `${hours} ${hours === 1n ? "घंटा" : "घंटे"}`;
    return `${hours} ${hours === 1n ? "घंटा" : "घंटे"} ${rem} मिनट`;
  }
  if (language === "pa") {
    if (hours === 0n) return `${rem} ਮਿੰਟ`;
    if (rem === 0n) return `${hours} ${hours === 1n ? "ਘੰਟਾ" : "ਘੰਟੇ"}`;
    return `${hours} ${hours === 1n ? "ਘੰਟਾ" : "ਘੰਟੇ"} ${rem} ਮਿੰਟ`;
  }
  if (hours === 0n) return `${rem} min`;
  if (rem === 0n) return `${hours} ${hours === 1n ? "hour" : "hours"}`;
  return `${hours} ${hours === 1n ? "hour" : "hours"} ${rem} min`;
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function directionPhrase(familyId: string, direction: "ASSISTED" | "OPPOSED", language: TsdCp009QuestionStudioLanguage): string {
  if (familyId === "104-E") {
    if (language === "hi") return direction === "ASSISTED" ? "हवा के साथ" : "हवा के विरुद्ध";
    if (language === "pa") return direction === "ASSISTED" ? "ਹਵਾ ਨਾਲ" : "ਹਵਾ ਦੇ ਵਿਰੁੱਧ";
    return direction === "ASSISTED" ? "with the wind" : "against the wind";
  }
  if (language === "hi") return direction === "ASSISTED" ? "अनुप्रवाह" : "ऊर्ध्वप्रवाह";
  if (language === "pa") return direction === "ASSISTED" ? "ਧਾਰਾ ਨਾਲ" : "ਧਾਰਾ ਦੇ ਵਿਰੁੱਧ";
  return direction === "ASSISTED" ? "downstream" : "upstream";
}

function bindingsFor(familyId: string, input: TsdCp009ExecutableInput, language: TsdCp009QuestionStudioLanguage): Readonly<Record<string, string>> {
  const b: Record<string, string> = {};
  switch (input.authorityKey) {
    case "mediumAdjustedGroundSpeed":
      Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), mediumSpeed: kmh(input.mediumSpeed, language), directionPhrase: directionPhrase(familyId, input.direction, language) });
      break;
    case "mediumComponentsFromAssistedOpposedSpeeds":
      Object.assign(b, { assistedSpeed: kmh(input.assistedGroundSpeed, language), opposedSpeed: kmh(input.opposedGroundSpeed, language) });
      break;
    case "mediumLegTravelState":
      Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), mediumSpeed: kmh(input.mediumSpeed, language), directionPhrase: directionPhrase(familyId, input.direction, language) });
      if (input.target === "TIME") b.distance = km(input.distance, language);
      else b.time = duration(input.time, language);
      break;
    case "pairedEqualDistanceMediumState":
      if (input.mode === "COMPONENT_FROM_DISTANCE_AND_TIMES") Object.assign(b, { equalDistance: km(input.equalDistance, language), assistedTime: duration(input.assistedTime, language), opposedTime: duration(input.opposedTime, language) });
      else if (input.mode === "DISTANCE_FROM_TIME_DIFFERENCE") Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), mediumSpeed: kmh(input.mediumSpeed, language), timeDifference: duration(input.opposedMinusAssistedTime, language) });
      else if (input.mode === "BODY_SPEED_FROM_TIME_RATIO") Object.assign(b, { mediumSpeed: kmh(input.mediumSpeed, language), timeRatio: ratio(input.opposedToAssistedTimeRatio) });
      else Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), timeRatio: ratio(input.opposedToAssistedTimeRatio) });
      break;
    case "roundTripMediumState":
      Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), mediumSpeed: kmh(input.mediumSpeed, language), distance: km(input.oneWayDistance, language) });
      break;
    case "mixedUnequalLegMediumState":
      Object.assign(b, { mediumSpeed: kmh(input.mediumSpeed, language), totalTime: duration(input.totalTime, language) });
      if (input.target === "ASSISTED_DISTANCE") Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), opposedDistance: km(input.opposedDistance, language) });
      else if (input.target === "OPPOSED_DISTANCE") Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), assistedDistance: km(input.assistedDistance, language) });
      else Object.assign(b, { assistedDistance: km(input.assistedDistance, language), opposedDistance: km(input.opposedDistance, language) });
      break;
    case "equalTimeMediumDistanceSpread":
      Object.assign(b, { mediumSpeed: kmh(input.mediumSpeed, language), time: duration(input.equalTime, language) });
      break;
    case "mediumShiftedMeetingPoint":
      Object.assign(b, { routeDistance: km(input.routeDistance, language), upstreamBodySpeed: kmh(input.fromUpstreamBodySpeed, language), downstreamBodySpeed: kmh(input.fromDownstreamBodySpeed, language), mediumSpeed: kmh(input.mediumSpeed, language) });
      break;
    case "passiveFloatingObjectState":
      b.mediumSpeed = kmh(input.mediumSpeed, language);
      if (input.target === "TRAVEL_TIME") b.distance = km(input.distance, language);
      break;
    case "floatingObjectRecoveryState":
      Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), mediumSpeed: kmh(input.mediumSpeed, language), separationTime: duration(input.separationTimeBeforeTurn, language) });
      break;
    case "changingMediumState":
      Object.assign(b, { bodySpeed: kmh(input.bodyRelativeSpeed, language), distance: km(input.distance, language), directionPhrase: directionPhrase(familyId, input.direction, language), firstTime: duration(input.firstTripTime, language), secondTime: duration(input.secondTripTime, language) });
      break;
  }
  return Object.freeze(b);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP009 Question Studio binding missing`);
    return value;
  });
}

function shape(input: TsdCp009ExecutableInput): string {
  switch (input.authorityKey) {
    case "mediumComponentsFromAssistedOpposedSpeeds": return `${input.authorityKey}:${input.target}`;
    case "mediumLegTravelState": return `${input.authorityKey}:${input.target}`;
    case "pairedEqualDistanceMediumState": return `${input.authorityKey}:${input.mode}:${input.target}`;
    case "roundTripMediumState": return `${input.authorityKey}:${input.target}`;
    case "mixedUnequalLegMediumState": return `${input.authorityKey}:${input.target}`;
    case "passiveFloatingObjectState": return `${input.authorityKey}:${input.target}`;
    case "floatingObjectRecoveryState": return `${input.authorityKey}:${input.target}`;
    case "changingMediumState": return `${input.authorityKey}:${input.target}`;
    default: return input.authorityKey;
  }
}

function compatibleFamilyCase(familyId: string, candidate: TsdCp009EnglishReviewCase): boolean {
  const source = SOURCE_CASE_BY_FAMILY.get(familyId);
  if (!source || source.qlId !== candidate.qlId || source.input.authorityKey !== candidate.input.authorityKey) return false;
  if (shape(source.input) !== shape(candidate.input)) return false;
  const sourceAircraft = AIRCRAFT_FAMILIES.has(familyId);
  const candidateAircraft = AIRCRAFT_FAMILIES.has(candidate.familyId);
  return sourceAircraft === candidateAircraft;
}

function localizedQls(language: "hi" | "pa"): readonly StudioQl[] {
  const registry = language === "hi" ? TSD_CP009_FROZEN_HINDI_LOCALIZATION : TSD_CP009_FROZEN_PUNJABI_LOCALIZATION;
  const english = new Map(TSD_CP009_FROZEN_ENGLISH_REGISTRY.map((ql) => [ql.qlId, ql] as const));
  return Object.freeze(registry.qls.map((ql) => {
    const source = english.get(ql.qlId);
    if (!source) throw new Error(`${language}/${ql.qlId}: frozen English metadata missing`);
    const meta = new Map(source.stemFamilies.map((family) => [family.familyId, family] as const));
    return Object.freeze({
      qlId: ql.qlId as TsdCp009QuestionStudioQlId,
      authorityKey: ql.authorityKey as TsdCp009ExecutableInput["authorityKey"],
      learnerContract: ql.learnerContract,
      families: Object.freeze(ql.families.map((family) => {
        const m = meta.get(family.familyId);
        if (!m) throw new Error(`${language}/${family.familyId}: frozen English family metadata missing`);
        return Object.freeze({ ...family, representation: m.representation, scene: m.scene }) as StudioFamily;
      })),
    });
  }));
}

function qls(language: TsdCp009QuestionStudioLanguage): readonly StudioQl[] {
  if (language === "hi" || language === "pa") return localizedQls(language);
  return Object.freeze(TSD_CP009_FROZEN_ENGLISH_REGISTRY.map((ql) => Object.freeze({
    qlId: ql.qlId as TsdCp009QuestionStudioQlId,
    authorityKey: ql.authorityKey as TsdCp009ExecutableInput["authorityKey"],
    learnerContract: ql.learnerContract,
    families: Object.freeze(ql.stemFamilies.map((family: TsdCp009EnglishFamily) => Object.freeze({ ...family }))) as readonly StudioFamily[],
  })));
}

function answerText(solution: TsdCp009ExecutableSolution, language: TsdCp009QuestionStudioLanguage): string {
  if (solution.unit === "METRE_PER_SECOND") return kmh(solution.value, language);
  if (solution.unit === "METRE") return km(solution.value, language);
  return duration(solution.value, language);
}

function optionTexts(solution: TsdCp009ExecutableSolution, language: TsdCp009QuestionStudioLanguage): readonly string[] {
  if (solution.unit === "METRE_PER_SECOND") {
    const n = kmhValue(solution.value);
    const candidates = [n, n - 2n, n + 2n, n + 4n].filter((value) => value > 0n);
    if (new Set(candidates.map(String)).size < 4) throw new Error("speed distractors not unique");
    return Object.freeze(candidates.slice(0, 4).map((value) => language === "hi" ? `${value} किमी/घंटा` : language === "pa" ? `${value} ਕਿਮੀ/ਘੰਟਾ` : `${value} km/h`));
  }
  if (solution.unit === "METRE") {
    const n = kmValue(solution.value);
    const candidates = [n, n - 1n, n + 1n, n + 2n].filter((value) => value > 0n);
    if (new Set(candidates.map(String)).size < 4) throw new Error("distance distractors not unique");
    return Object.freeze(candidates.slice(0, 4).map((value) => language === "hi" ? `${value} किमी` : language === "pa" ? `${value} ਕਿਮੀ` : `${value} km`));
  }
  const minutes = minuteValue(solution.value);
  const candidates: bigint[] = [minutes];
  for (const delta of [-30n, -15n, 15n, 30n, 45n]) {
    const value = minutes + delta;
    if (value > 0n && !candidates.includes(value)) candidates.push(value);
    if (candidates.length === 4) break;
  }
  if (candidates.length !== 4) throw new Error("time distractors not unique");
  return Object.freeze(candidates.map((value) => duration(rational(value * 60n), language)));
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return h >>> 0;
}

function shuffle<T>(items: readonly T[], seed: string): readonly T[] {
  return Object.freeze([...items].map((item, index) => ({ item, key: hash(`${seed}:${index}:${String(item)}`) })).sort((a, b) => a.key - b.key).map((entry) => entry.item));
}

function locale(language: TsdCp009QuestionStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function serializableInput(input: TsdCp009ExecutableInput): Readonly<Record<string, unknown>> {
  return Object.freeze(JSON.parse(JSON.stringify(input, (_key, value) => typeof value === "bigint" ? value.toString() : value)) as Record<string, unknown>);
}

function allCompatible(language: TsdCp009QuestionStudioLanguage, seed: string): readonly CompatibleQuestion[] {
  const out: CompatibleQuestion[] = [];
  for (const ql of qls(language)) {
    const cases = TSD_CP009_LOCALIZED_REVIEW_CASES.filter((entry) => entry.qlId === ql.qlId && entry.input.authorityKey === ql.authorityKey);
    for (const family of ql.families) {
      for (const reviewCase of cases) {
        if (!compatibleFamilyCase(family.familyId, reviewCase)) continue;
        try {
          const verification = verifyTsdCp009(reviewCase.input, reviewCase.solution);
          if (!verification.valid) continue;
          const bindings = bindingsFor(family.familyId, reviewCase.input, language);
          const stem = render(family.stem, bindings);
          const guide = render(family.explanationGuide, bindings);
          const answer = answerText(reviewCase.solution, language);
          const baseOptions = optionTexts(reviewCase.solution, language);
          const options = shuffle(baseOptions, `${seed}:${language}:${family.familyId}:${reviewCase.familyId}`);
          const correctIndex = options.indexOf(answer);
          if (correctIndex < 0 || new Set(options).size !== 4) continue;
          const caseId = reviewCase.familyId.replace("-", "");
          const questionId = `TSD-CP009-${family.familyId}-${caseId}-${language}`;
          out.push(Object.freeze({
            stem,
            options,
            correctIndex,
            answer,
            explanation: Object.freeze({
              steps: Object.freeze([guide]),
              conclusion: language === "hi" ? `अतः उत्तर ${answer} है।` : language === "pa" ? `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।` : `Therefore, the answer is ${answer}.`,
            }),
            difficultyBand: family.difficulty,
            qlId: ql.qlId,
            familyId: family.familyId,
            questionId,
            canonicalItemId: `TSD-CP009-${family.familyId}-${caseId}`,
            questionLanguageId: `${questionId}:${locale(language)}`,
            language,
            locale: locale(language),
            representation: family.representation,
            scene: family.scene,
            runtimeMode: TSD_CP009_QUESTION_STUDIO_RUNTIME_MODE,
            reviewStatus: "FROZEN_REVIEW_ONLY",
            integrationAuthority: TSD_CP009_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
            parameters: Object.freeze({ sourceCaseFamilyId: reviewCase.familyId, input: serializableInput(reviewCase.input) }),
            validation: Object.freeze({ solverVerified: true, independentVerifierAccepted: true, invariant: verification.invariant, fourUniqueOptions: true, naturalLearnerPresentation: true }),
          }));
        } catch {
          // Incompatible placeholder or non-natural learner presentation: intentionally excluded.
        }
      }
    }
  }
  return shuffle(out, `${seed}:${language}:all`) as readonly CompatibleQuestion[];
}

const CAPACITY_BY_LANGUAGE = Object.freeze(Object.fromEntries(TSD_CP009_QUESTION_STUDIO_LANGUAGES.map((language) => [language, allCompatible(language, "cp009-capacity").length])) as Record<TsdCp009QuestionStudioLanguage, number>);
if (CAPACITY_BY_LANGUAGE.en < 150) throw new Error(`TSD-CP-009 Studio capacity unexpectedly thin: ${CAPACITY_BY_LANGUAGE.en}`);
if (CAPACITY_BY_LANGUAGE.en !== CAPACITY_BY_LANGUAGE.hi || CAPACITY_BY_LANGUAGE.en !== CAPACITY_BY_LANGUAGE.pa) throw new Error(`TSD-CP-009 locale capacity mismatch: ${JSON.stringify(CAPACITY_BY_LANGUAGE)}`);

export const TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE = CAPACITY_BY_LANGUAGE.en;
export const TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS = CAPACITY_BY_LANGUAGE.en * 3;

export const TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: TSD_CP009_QUESTION_STUDIO_PACKAGE_ID,
  checkpointId: TSD_CP009_QUESTION_STUDIO_CHECKPOINT_ID,
  runtimeMode: TSD_CP009_QUESTION_STUDIO_RUNTIME_MODE,
  integrationAuthority: TSD_CP009_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  permanentQlIds: TSD_CP009_PERMANENT_QL_IDS,
  supportedLanguages: TSD_CP009_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: TSD_CP009_QUESTION_STUDIO_DIFFICULTIES,
  compatibleReviewCombinationsPerLocale: TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicReviewCombinations: TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  sourceLocalizationStatus: "FROZEN" as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  mockTestEligible: false as const,
  manualApprovalRequired: true as const,
  automaticStudentPublication: false as const,
  naturalnessPolicy: "INTEGER_KMH_KM_AND_WHOLE_MINUTE_PRESENTATION" as const,
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS" as const,
  verificationPolicy: "EXACT_SOLVER_PLUS_INDEPENDENT_VERIFIER" as const,
});

export function previewTsdCp009QuestionStudioReview(request: TsdCp009QuestionStudioReviewRequest = {}) {
  const language = request.language ?? "en";
  const count = Math.max(1, Math.floor(request.count ?? 5));
  const seed = request.seed ?? "cp009-question-studio-review";
  const compatible = allCompatible(language, seed).filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.familyId || question.familyId === request.familyId) &&
    (!request.difficulty || question.difficultyBand === request.difficulty));
  if (!compatible.length) throw new Error("No TSD-CP-009 frozen Question Studio combinations match the requested filters after semantic and exam-naturalness gates.");
  if (count > compatible.length) throw new Error(`Requested ${count} questions but only ${compatible.length} unique CP009 review combinations exist under these filters.`);
  return Object.freeze({
    package: TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE,
    request: Object.freeze({ ...request, language, count, seed }),
    availableCombinationsUnderFilters: compatible.length,
    questions: Object.freeze(compatible.slice(0, count)),
  });
}
