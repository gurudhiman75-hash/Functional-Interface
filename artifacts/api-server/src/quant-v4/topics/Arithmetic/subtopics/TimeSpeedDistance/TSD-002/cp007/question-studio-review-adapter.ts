import { add, divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { buildCp007ExecutableInput, generateCp007ExecutableCase } from "./executable-generator";
import type { TsdCp007AuthorityKey, TsdCp007ExecutableGeneratedCase } from "./executable-types";
import {
  TSD_CP007_FROZEN_HINDI_LOCALIZATION,
  TSD_CP007_FROZEN_PUNJABI_LOCALIZATION,
  TSD_CP007_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP007_QUESTION_STUDIO_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP007_QUESTION_STUDIO_CHECKPOINT_ID = "TSD-CP-007" as const;
export const TSD_CP007_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP007_QUESTION_STUDIO_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP007_QUESTION_STUDIO_RUNTIME_MODE = "TSD-CP-007-MULTILINGUAL-FROZEN-REVIEW-v1" as const;
export const TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY = `TSD-CP-007:${TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead}` as const;

export type TsdCp007QuestionStudioLanguage = (typeof TSD_CP007_QUESTION_STUDIO_LANGUAGES)[number];
export type TsdCp007QuestionStudioDifficulty = (typeof TSD_CP007_QUESTION_STUDIO_DIFFICULTIES)[number];
export type TsdCp007QuestionStudioQlId = (typeof TSD_CP007_PERMANENT_QL_IDS)[number];

export type TsdCp007QuestionStudioReviewRequest = Readonly<{
  language?: TsdCp007QuestionStudioLanguage;
  qlId?: TsdCp007QuestionStudioQlId;
  familyId?: string;
  difficulty?: TsdCp007QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

interface StudioFamily {
  readonly familyId: string;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly representation: string;
  readonly scene: string;
  readonly stem: string;
  readonly explanationGuide: string;
}

interface StudioQl {
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: TsdCp007AuthorityKey;
  readonly learnerContract: string;
  readonly stemFamilies: readonly StudioFamily[];
}

const FAMILY_COUNT = 66;
const LATENT_NUMERIC_CASES = 12;
const LOCALE_COUNT = 3;
const KMH_INPUT_FAMILIES = new Set(["84-D", "84-F", "85-D", "85-F", "86-D", "86-F", "88-E"]);
const KMH_ANSWER_FAMILIES = new Set(["87-D", "87-F", "90-E"]);

function placeholderKeys(value: string): readonly string[] {
  return Object.freeze([...new Set([...value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!))]);
}

function availableBindingKeys(familyId: string, authorityKey: TsdCp007AuthorityKey, caseIndex: number): ReadonlySet<string> {
  const input = buildCp007ExecutableInput(authorityKey, `cp007:${authorityKey}:${caseIndex}`);
  const keys = new Set<string>();
  if (input.trainLength) keys.add("trainLength");
  if (input.speed) keys.add("speed");
  if (input.fixedObjectLength) keys.add("objectLength");
  if (input.pointCrossingTime) keys.add("pointTime");
  if (input.fixedObjectCrossingTime) {
    keys.add("crossingTime");
    keys.add("timeA");
  }
  if (input.secondFixedObjectCrossingTime) keys.add("timeB");
  if (input.occupancyDuration) keys.add("occupancyTime");
  if (input.knownClockSecond) keys.add("clockTime");
  if (input.distanceWindow) keys.add("distance");
  if (input.spacing) keys.add("spacing");
  if (input.timeWindow) keys.add("timeWindow");
  if (input.observedPointCount !== undefined) keys.add("pointCount");
  if (input.includeStartingPoint !== undefined) keys.add("endpointConvention");
  if (familyId === "85-E" && input.fixedObjectLength) {
    keys.add("objectPartA");
    keys.add("objectPartB");
  }
  if (familyId === "93-F") {
    keys.add("knownEvent");
    keys.add("targetEvent");
    keys.add("objectName");
  }
  return keys;
}

function compatibleCasesForFamily(ql: StudioQl, family: StudioFamily): readonly number[] {
  const required = placeholderKeys(`${family.stem} ${family.explanationGuide}`);
  const compatible = Array.from({ length: LATENT_NUMERIC_CASES }, (_, index) => index + 1)
    .filter((caseIndex) => {
      const available = availableBindingKeys(family.familyId, ql.authorityKey, caseIndex);
      return required.every((key) => available.has(key));
    });
  if (!compatible.length) throw new Error(`${family.familyId}: no executable CP007 case satisfies the frozen placeholder contract`);
  return Object.freeze(compatible);
}

function buildCompatibleCaseMap(): Readonly<Record<string, readonly number[]>> {
  const entries: [string, readonly number[]][] = [];
  for (const ql of TSD_CP007_FROZEN_ENGLISH_REGISTRY as readonly StudioQl[]) {
    for (const family of ql.stemFamilies) entries.push([family.familyId, compatibleCasesForFamily(ql, family)]);
  }
  return Object.freeze(Object.fromEntries(entries) as Record<string, readonly number[]>);
}

export const TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES = buildCompatibleCaseMap();
export const TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE = Object.freeze(
  Object.values(TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES).reduce((sum, cases) => sum + cases.length, 0),
);
const compatibleCaseCounts = Object.values(TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES).map((cases) => cases.length);

export const TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: TSD_CP007_QUESTION_STUDIO_PACKAGE_ID,
  packageId: TSD_CP007_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Time, Speed & Distance",
  chapterId: "TSD-002",
  checkpointId: TSD_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
  name: "TSD-002 Time, Speed & Distance — CP-007 Multilingual Frozen Review",
  label: "Time, Speed & Distance · CP-007 · 11 Frozen QLs",
  generationDomain: "quant-v4",
  qlIds: [...TSD_CP007_PERMANENT_QL_IDS],
  supportedDifficulties: [...TSD_CP007_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...TSD_CP007_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: TSD_CP007_QUESTION_STUDIO_RUNTIME_MODE,
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
  integrationAuthority: TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  frozenQlCount: TSD_CP007_PERMANENT_QL_IDS.length,
  frozenFamiliesPerLocale: FAMILY_COUNT,
  latentNumericCasePool: LATENT_NUMERIC_CASES,
  minimumCompatibleCasesPerFamily: Math.min(...compatibleCaseCounts),
  maximumCompatibleCasesPerFamily: Math.max(...compatibleCaseCounts),
  compatibleReviewCombinationsPerLocale: TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicReviewCombinations: TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE * LOCALE_COUNT,
  bulkSyncSupported: false,
} as const);

function rationalText(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function clockText(value: Rational): string {
  const seconds = Number(value.numerator) / Number(value.denominator);
  const normalized = ((seconds % 86400) + 86400) % 86400;
  const hours = Math.floor(normalized / 3600);
  const minutes = Math.floor((normalized % 3600) / 60);
  const secondValue = normalized % 60;
  const secondText = Number.isInteger(secondValue) ? String(secondValue).padStart(2, "0") : secondValue.toFixed(2).padStart(5, "0");
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${secondText}`;
}

function answerText(familyId: string, generated: TsdCp007ExecutableGeneratedCase): string {
  const solution = generated.solution;
  if (solution.answerKind === "COUNT") return `${solution.count ?? 0n}`;
  if (!solution.value) throw new Error(`${generated.seed}: value solution missing`);
  if (solution.unit === "CLOCK_SECOND") return clockText(solution.value);
  if (solution.unit === "METRE_PER_SECOND" && KMH_ANSWER_FAMILIES.has(familyId)) {
    return `${rationalText(multiply(solution.value, rational(18, 5)))} km/h`;
  }
  const unit = { SECOND: "s", METRE: "m", METRE_PER_SECOND: "m/s", CLOCK_SECOND: "", COUNT: "" }[solution.unit];
  return `${rationalText(solution.value)} ${unit}`.trim();
}

function timelineObjectName(generated: TsdCp007ExecutableGeneratedCase): string {
  switch (generated.input.objectKind) {
    case "PLATFORM": return "platform";
    case "BRIDGE": return "bridge";
    case "TUNNEL": return "tunnel";
    default: return "fixed section";
  }
}

function timelineEvents(generated: TsdCp007ExecutableGeneratedCase) {
  const kind = generated.input.timelineIntervalKind;
  const direction = generated.input.timelineTarget;
  const objectName = timelineObjectName(generated);
  const pair = kind === "POINT_CROSSING"
    ? ["the engine passes the fixed marker", "the rear passes the same fixed marker"] as const
    : kind === "FULL_CROSSING"
      ? [`the front enters the ${objectName}`, `the rear leaves the far end of the ${objectName}`] as const
      : [`the rear enters the ${objectName}`, `the front reaches the far end of the ${objectName}`] as const;
  return direction === "FORWARD_CLOCK"
    ? { knownEvent: pair[0], targetEvent: pair[1], objectName }
    : { knownEvent: pair[1], targetEvent: pair[0], objectName };
}

function endpointConvention(familyId: string, includeStart: boolean): string {
  if (familyId === "94-C") return includeStart ? "included in the count" : "excluded from the count";
  if (familyId === "94-D") return includeStart ? "the post at the starting position included in the count" : "the post at the starting position excluded from the count";
  if (familyId === "94-E") return includeStart ? "the pole at the starting position is included in the count" : "the pole at the starting position is not included in the count";
  if (familyId === "94-F") return includeStart ? "the pillar at the starting position included in the count" : "the pillar at the starting position excluded from the count";
  return includeStart ? "including the starting point" : "excluding the starting point";
}

function bindingsFor(familyId: string, generated: TsdCp007ExecutableGeneratedCase): Readonly<Record<string, string>> {
  const input = generated.input;
  const bindings: Record<string, string> = {};
  if (input.trainLength) bindings.trainLength = rationalText(input.trainLength);
  if (input.speed) bindings.speed = KMH_INPUT_FAMILIES.has(familyId)
    ? `${rationalText(multiply(input.speed, rational(18, 5)))} km/h`
    : `${rationalText(input.speed)} m/s`;
  if (input.fixedObjectLength) bindings.objectLength = rationalText(input.fixedObjectLength);
  if (input.pointCrossingTime) bindings.pointTime = rationalText(input.pointCrossingTime);
  if (input.fixedObjectCrossingTime) {
    bindings.crossingTime = rationalText(input.fixedObjectCrossingTime);
    bindings.timeA = rationalText(input.fixedObjectCrossingTime);
  }
  if (input.secondFixedObjectCrossingTime) bindings.timeB = rationalText(input.secondFixedObjectCrossingTime);
  if (input.occupancyDuration) bindings.occupancyTime = rationalText(input.occupancyDuration);
  if (input.knownClockSecond) bindings.clockTime = clockText(input.knownClockSecond);
  if (input.distanceWindow) bindings.distance = rationalText(input.distanceWindow);
  if (input.spacing) bindings.spacing = rationalText(input.spacing);
  if (input.timeWindow) bindings.timeWindow = rationalText(input.timeWindow);
  if (input.observedPointCount !== undefined) bindings.pointCount = input.observedPointCount.toString();
  if (input.includeStartingPoint !== undefined) bindings.endpointConvention = endpointConvention(familyId, input.includeStartingPoint);
  if (familyId === "85-E" && input.fixedObjectLength) {
    const first = divide(input.fixedObjectLength, rational(3));
    const second = subtract(input.fixedObjectLength, first);
    bindings.objectPartA = rationalText(first);
    bindings.objectPartB = rationalText(second);
  }
  if (familyId === "93-F") Object.assign(bindings, timelineEvents(generated));
  return Object.freeze(bindings);
}

function localizeDynamic(language: TsdCp007QuestionStudioLanguage, familyId: string, bindings: Readonly<Record<string, string>>) {
  if (language === "en") return bindings;
  const result = { ...bindings };
  const objectMap = language === "hi"
    ? { platform: "प्लेटफॉर्म", bridge: "पुल", tunnel: "सुरंग", "fixed section": "निश्चित खंड" }
    : { platform: "ਪਲੇਟਫਾਰਮ", bridge: "ਪੁਲ", tunnel: "ਸੁਰੰਗ", "fixed section": "ਨਿਰਧਾਰਤ ਹਿੱਸਾ" };
  if (result.objectName) result.objectName = objectMap[result.objectName as keyof typeof objectMap] ?? result.objectName;

  const localizeEvent = (value: string) => {
    const object = ["platform", "bridge", "tunnel", "fixed section"].find((candidate) => value.includes(candidate));
    const localizedObject = objectMap[(object ?? "fixed section") as keyof typeof objectMap];
    if (value === "the engine passes the fixed marker") return language === "hi" ? "इंजन स्थिर चिन्ह को पार करता है" : "ਇੰਜਣ ਨਿਰਧਾਰਤ ਨਿਸ਼ਾਨ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ";
    if (value === "the rear passes the same fixed marker") return language === "hi" ? "ट्रेन का पिछला सिरा उसी स्थिर चिन्ह को पार करता है" : "ਟ੍ਰੇਨ ਦਾ ਪਿਛਲਾ ਸਿਰਾ ਉਸੇ ਨਿਰਧਾਰਤ ਨਿਸ਼ਾਨ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ";
    if (value.startsWith("the front enters the ")) return language === "hi" ? `ट्रेन का अगला सिरा ${localizedObject} में प्रवेश करता है` : `ਟ੍ਰੇਨ ਦਾ ਅਗਲਾ ਸਿਰਾ ${localizedObject} ਵਿੱਚ ਦਾਖਲ ਹੁੰਦਾ ਹੈ`;
    if (value.startsWith("the rear leaves the far end of the ")) return language === "hi" ? `ट्रेन का पिछला सिरा ${localizedObject} के दूसरे छोर से बाहर निकलता है` : `ਟ੍ਰੇਨ ਦਾ ਪਿਛਲਾ ਸਿਰਾ ${localizedObject} ਦੇ ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਬਾਹਰ ਨਿਕਲਦਾ ਹੈ`;
    if (value.startsWith("the rear enters the ")) return language === "hi" ? `ट्रेन का पिछला सिरा ${localizedObject} में प्रवेश करता है` : `ਟ੍ਰੇਨ ਦਾ ਪਿਛਲਾ ਸਿਰਾ ${localizedObject} ਵਿੱਚ ਦਾਖਲ ਹੁੰਦਾ ਹੈ`;
    if (value.startsWith("the front reaches the far end of the ")) return language === "hi" ? `ट्रेन का अगला सिरा ${localizedObject} के दूसरे छोर तक पहुंचता है` : `ਟ੍ਰੇਨ ਦਾ ਅਗਲਾ ਸਿਰਾ ${localizedObject} ਦੇ ਦੂਜੇ ਸਿਰੇ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ`;
    return value;
  };
  if (result.knownEvent) result.knownEvent = localizeEvent(result.knownEvent);
  if (result.targetEvent) result.targetEvent = localizeEvent(result.targetEvent);

  if (result.endpointConvention) {
    const include = !/excluded|not included/.test(result.endpointConvention);
    const subject = familyId === "94-E" ? "pole" : familyId === "94-F" ? "pillar" : "post";
    if (language === "hi") {
      const noun = subject === "pole" ? "खंभा" : subject === "pillar" ? "स्तंभ" : "पोस्ट";
      result.endpointConvention = include ? `शुरुआती ${noun} गिनती में शामिल है` : `शुरुआती ${noun} गिनती में शामिल नहीं है`;
    } else {
      const noun = subject === "pole" ? "ਖੰਭਾ" : subject === "pillar" ? "ਸਤੰਭ" : "ਪੋਸਟ";
      result.endpointConvention = include ? `ਸ਼ੁਰੂਆਤੀ ${noun} ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹੈ` : `ਸ਼ੁਰੂਆਤੀ ${noun} ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ`;
    }
  }
  return Object.freeze(result);
}

function render(template: string, bindings: Readonly<Record<string, string>>) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP007 Studio binding missing`);
    return value;
  });
}

function registryFor(language: TsdCp007QuestionStudioLanguage): readonly StudioQl[] {
  if (language === "en") return TSD_CP007_FROZEN_ENGLISH_REGISTRY as readonly StudioQl[];
  return language === "hi"
    ? TSD_CP007_FROZEN_HINDI_LOCALIZATION as readonly StudioQl[]
    : TSD_CP007_FROZEN_PUNJABI_LOCALIZATION as readonly StudioQl[];
}

function localeFor(language: TsdCp007QuestionStudioLanguage) {
  return language === "en" ? "en-IN" as const : language === "hi" ? "hi-IN" as const : "pa-IN" as const;
}

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function parseAnswer(answer: string): { value: Rational; unit: string } | null {
  const match = answer.match(/^(-?\d+)(?:\/(\d+))?(?:\s+(.*))?$/);
  if (!match) return null;
  return { value: rational(Number(match[1]), Number(match[2] ?? 1)), unit: match[3] ?? "" };
}

function optionSet(answer: string, seed: string): { options: readonly string[]; correctIndex: number } {
  const clock = answer.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  let candidates: string[];
  if (clock) {
    const seconds = Number(clock[1]) * 3600 + Number(clock[2]) * 60 + Number(clock[3]);
    candidates = [0, -10, 10, 20].map((offset) => clockText(rational(seconds + offset)));
  } else {
    const parsed = parseAnswer(answer);
    if (!parsed) throw new Error(`Unable to construct CP007 Studio options for answer '${answer}'`);
    const values = [parsed.value, add(parsed.value, rational(1)), subtract(parsed.value, rational(1)), add(parsed.value, rational(2))]
      .filter((value, index, array) => value.numerator > 0n && array.findIndex((candidate) => candidate.numerator * value.denominator === value.numerator * candidate.denominator) === index);
    while (values.length < 4) values.push(add(parsed.value, rational(values.length + 1)));
    candidates = values.slice(0, 4).map((value) => `${rationalText(value)}${parsed.unit ? ` ${parsed.unit}` : ""}`);
  }
  const scored = candidates.map((text) => ({ text, score: hash(`${seed}:${text}`) })).sort((a, b) => a.score - b.score || a.text.localeCompare(b.text));
  const options = scored.map((entry) => entry.text);
  return { options: Object.freeze(options), correctIndex: options.indexOf(answer) };
}

function explanation(language: TsdCp007QuestionStudioLanguage, guide: string, bindings: Readonly<Record<string, string>>, answer: string) {
  const rendered = render(guide, bindings);
  if (language === "hi") return `${rendered} अतः उत्तर ${answer} है।`;
  if (language === "pa") return `${rendered} ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`;
  return `${rendered} Therefore, the answer is ${answer}.`;
}

function allFamilies(language: TsdCp007QuestionStudioLanguage) {
  return registryFor(language).flatMap((ql) => ql.stemFamilies.map((family) => ({ ql, family })));
}

export function previewTsdCp007QuestionStudioReview(request: TsdCp007QuestionStudioReviewRequest = {}) {
  const language = request.language ?? "en";
  const locale = localeFor(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || `${TSD_CP007_QUESTION_STUDIO_CHECKPOINT_ID}:${language}:${request.qlId ?? "all"}:${request.familyId ?? "all-families"}:${request.difficulty ?? "all"}`;
  const eligible = allFamilies(language).filter(({ ql, family }) =>
    (!request.qlId || ql.qlId === request.qlId)
    && (!request.familyId || family.familyId === request.familyId)
    && (!request.difficulty || family.difficulty === request.difficulty)
  );
  if (!eligible.length) throw new Error("No frozen TSD-CP-007 families match the requested filters.");

  const candidates = eligible.flatMap((entry) => {
    const cases = TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES[entry.family.familyId];
    if (!cases?.length) throw new Error(`${entry.family.familyId}: compatible Studio case map missing`);
    return cases.map((caseIndex) => ({ ...entry, caseIndex }));
  }).map((candidate) => ({
    ...candidate,
    score: hash(`${seed}:${candidate.family.familyId}:${candidate.caseIndex}`),
  })).sort((left, right) => left.score - right.score
    || left.family.familyId.localeCompare(right.family.familyId)
    || left.caseIndex - right.caseIndex);

  if (count > candidates.length) {
    throw new Error(`Requested ${count} unique review questions, but the selected frozen filters support ${candidates.length}.`);
  }

  const questions = candidates.slice(0, count).map(({ ql, family, caseIndex }) => {
    const generated = generateCp007ExecutableCase(ql.authorityKey, `cp007:${ql.authorityKey}:${caseIndex}`);
    const bindings = localizeDynamic(language, family.familyId, bindingsFor(family.familyId, generated));
    const stem = render(family.stem, bindings);
    const answer = answerText(family.familyId, generated);
    const optionData = optionSet(answer, `${seed}:${family.familyId}:${caseIndex}`);
    if (optionData.correctIndex < 0) throw new Error(`${family.familyId}: correct answer missing from generated options`);
    const questionId = `${TSD_CP007_QUESTION_STUDIO_CHECKPOINT_ID}:${family.familyId}:${locale}:${caseIndex}:${hash(seed)}`;

    return Object.freeze({
      archetypeId: TSD_CP007_QUESTION_STUDIO_PACKAGE_ID,
      packageId: TSD_CP007_QUESTION_STUDIO_PACKAGE_ID,
      canonicalProblemId: TSD_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
      qlId: ql.qlId,
      familyId: family.familyId,
      questionId,
      canonicalItemId: `${family.familyId}:${caseIndex}`,
      questionLanguageId: questionId,
      language,
      locale,
      difficultyBand: family.difficulty,
      representation: family.representation,
      scene: family.scene,
      stem,
      options: optionData.options,
      correctIndex: optionData.correctIndex,
      answer,
      explanation: Object.freeze({
        whatAsked: ql.learnerContract,
        steps: Object.freeze([explanation(language, family.explanationGuide, bindings, answer)]),
        conclusion: answer,
        commonTrap: "",
      }),
      renderer: Object.freeze({ kind: "text-math", renderingContract: "plain-unicode-math-v1", textFallbackAvailable: true }),
      runtimeMode: TSD_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      mockTestEligible: false,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
      integrationAuthority: TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      parameters: Object.freeze({ seed, caseIndex, familyId: family.familyId, qlId: ql.qlId }),
      validation: Object.freeze({
        valid: generated.verification.valid,
        frozenAuthority: true,
        compatibleCase: true,
        exactlyFourOptions: optionData.options.length === 4,
        uniqueOptions: new Set(optionData.options).size === 4,
        sourceLifecycleLocked: true,
      }),
    });
  });

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4",
      packageId: TSD_CP007_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: TSD_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
      seed,
      language,
      locale,
      runtimeMode: TSD_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
      integrationAuthority: TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
      reviewOnly: true,
      availableUniqueQuestionsForSelectedFilters: candidates.length,
    }),
    questions: Object.freeze(questions),
  });
}
