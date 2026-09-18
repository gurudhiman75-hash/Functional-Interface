import { createHash } from "node:crypto";

import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  COA_CP008_EITHER_AUTHORITIES,
  COA_CP008_THREE_ACTION_AUTHORITIES,
} from "./cp008-profile-authorities.ts";
import {
  getCoaCp009LocalizedEither,
  getCoaCp009LocalizedOrdinary,
  getCoaCp009LocalizedThreeAction,
} from "./cp009-full-localization-registry.ts";
import type {
  CoaActionAuthority,
  CoaAnswerClass,
  CoaDifficulty,
  CoaQlId,
  CoaScenarioAuthority,
} from "./types.ts";

export const COA_CP010_CHECKPOINT_ID = "COA-CP-010" as const;
export const COA_CP010_QUESTION_STUDIO_AUTHORITY =
  "COA_CP010_QUESTION_STUDIO_REVIEW_ONLY_V1" as const;
export const COA_CP010_RUNTIME_MODE = "review-only" as const;
export const COA_CP010_REVIEW_STATUS =
  "QUESTION_STUDIO_CONNECTED_REVIEW_ONLY" as const;

export const COA_CP010_ACTIVE_QL_IDS = Object.freeze([
  "COA-QL-001",
  "COA-QL-002",
  "COA-QL-003",
  "COA-QL-004",
  "COA-QL-005",
  "COA-QL-006",
  "COA-QL-008",
  "COA-QL-009",
] as const);

export type CoaCp010ActiveQlId = (typeof COA_CP010_ACTIVE_QL_IDS)[number];

export const COA_CP010_PRESENTATION_PROFILES = Object.freeze([
  "TWO_ACTION_FOUR_WAY",
  "TWO_ACTION_FIVE_CODE",
  "THREE_ACTION_COMBINATION",
] as const);

export type CoaCp010PresentationProfile =
  (typeof COA_CP010_PRESENTATION_PROFILES)[number];

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

const FOUR_WAY_OPTIONS = Object.freeze({
  en: Object.freeze([
    "Only Course of Action I follows",
    "Only Course of Action II follows",
    "Both Courses of Action I and II follow",
    "Neither Course of Action I nor II follows",
  ] as const),
  hi: Object.freeze([
    "केवल कार्रवाई I सही है",
    "केवल कार्रवाई II सही है",
    "दोनों कार्रवाइयाँ I और II सही हैं",
    "न तो कार्रवाई I और न ही कार्रवाई II सही है",
  ] as const),
  pa: Object.freeze([
    "ਕੇਵਲ ਕਾਰਵਾਈ I ਸਹੀ ਹੈ",
    "ਕੇਵਲ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
    "ਦੋਵੇਂ ਕਾਰਵਾਈਆਂ I ਅਤੇ II ਸਹੀ ਹਨ",
    "ਨਾ ਤਾਂ ਕਾਰਵਾਈ I ਅਤੇ ਨਾ ਹੀ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
  ] as const),
});

const FIVE_WAY_OPTIONS = Object.freeze({
  en: Object.freeze([
    "Only Course of Action I follows",
    "Only Course of Action II follows",
    "Either Course of Action I or II follows",
    "Neither Course of Action I nor II follows",
    "Both Courses of Action I and II follow",
  ] as const),
  hi: Object.freeze([
    "केवल कार्रवाई I सही है",
    "केवल कार्रवाई II सही है",
    "कार्रवाई I या II में से कोई एक सही है",
    "न तो कार्रवाई I और न ही कार्रवाई II सही है",
    "दोनों कार्रवाइयाँ I और II सही हैं",
  ] as const),
  pa: Object.freeze([
    "ਕੇਵਲ ਕਾਰਵਾਈ I ਸਹੀ ਹੈ",
    "ਕੇਵਲ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
    "ਕਾਰਵਾਈ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸਹੀ ਹੈ",
    "ਨਾ ਤਾਂ ਕਾਰਵਾਈ I ਅਤੇ ਨਾ ਹੀ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
    "ਦੋਵੇਂ ਕਾਰਵਾਈਆਂ I ਅਤੇ II ਸਹੀ ਹਨ",
  ] as const),
});

const TWO_ACTION_INSTRUCTIONS = Object.freeze({
  en: Object.freeze([
    "Which of the above courses of action logically follow?",
    "Which course or courses of action should be taken?",
    "Decide which of the suggested courses of action follow from the statement.",
  ] as const),
  hi: Object.freeze([
    "दिए गए कथन के आधार पर तय कीजिए कि कौन-सी कार्रवाई उचित है।",
    "नीचे दी गई कार्रवाइयों में से कौन-सी कथन के अनुसार उचित है?",
    "तय कीजिए कि कार्रवाई I और II में से कौन-सी की जानी चाहिए।",
  ] as const),
  pa: Object.freeze([
    "ਦਿੱਤੇ ਬਿਆਨ ਦੇ ਆਧਾਰ ਤੇ ਤੈਅ ਕਰੋ ਕਿ ਕਿਹੜੀ ਕਾਰਵਾਈ ਠੀਕ ਹੈ।",
    "ਹੇਠ ਦਿੱਤੀਆਂ ਕਾਰਵਾਈਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਬਿਆਨ ਅਨੁਸਾਰ ਠੀਕ ਹੈ?",
    "ਤੈਅ ਕਰੋ ਕਿ ਕਾਰਵਾਈ I ਅਤੇ II ਵਿੱਚੋਂ ਕਿਹੜੀ ਕੀਤੀ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ।",
  ] as const),
});

const THREE_ACTION_INSTRUCTIONS = Object.freeze({
  en: Object.freeze([
    "Which of the above courses of action logically follow?",
    "Which combination of the suggested courses of action should be taken?",
    "Decide which of Courses I, II and III follow from the statement.",
  ] as const),
  hi: Object.freeze([
    "तय कीजिए कि कार्रवाई I, II और III में से कौन-सी उचित हैं।",
    "नीचे दी गई तीन कार्रवाइयों में से कौन-सी की जानी चाहिए?",
    "कथन के आधार पर सही कार्रवाइयों का समूह चुनिए।",
  ] as const),
  pa: Object.freeze([
    "ਤੈਅ ਕਰੋ ਕਿ ਕਾਰਵਾਈ I, II ਅਤੇ III ਵਿੱਚੋਂ ਕਿਹੜੀਆਂ ਠੀਕ ਹਨ।",
    "ਹੇਠ ਦਿੱਤੀਆਂ ਤਿੰਨ ਕਾਰਵਾਈਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀਆਂ ਕੀਤੀਆਂ ਜਾਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?",
    "ਬਿਆਨ ਦੇ ਆਧਾਰ ਤੇ ਸਹੀ ਕਾਰਵਾਈਆਂ ਦਾ ਸਮੂਹ ਚੁਣੋ।",
  ] as const),
});

type ExtendedRequest = QuestionStudioGenerationRequest & Readonly<{
  cpId?: string;
  examProfile?: string;
  presentationProfile?: string;
}>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stableHash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("COA-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(
  value: QuestionStudioGenerationRequest["language"],
): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`COA-001 does not support language ${String(value)}`);
}

function localeForLanguage(language: QuestionStudioLanguage) {
  if (language === "hi") return "hi-IN" as const;
  if (language === "pa") return "pa-IN" as const;
  return "en-IN" as const;
}

function normalizeDifficulty(value: unknown): CoaDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error(`COA-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function difficultyLabel(value: CoaDifficulty): "Easy" | "Medium" | "Hard" {
  if (value === "EASY") return "Easy";
  if (value === "MEDIUM") return "Medium";
  return "Hard";
}

function isActiveQl(value: string): value is CoaCp010ActiveQlId {
  return (COA_CP010_ACTIVE_QL_IDS as readonly string[]).includes(value);
}

function resolveQl(request: ExtendedRequest): CoaCp010ActiveQlId | undefined {
  const selectors = [
    request.canonicalProblemId,
    request.questionLanguageId,
    text(request.patternId).toUpperCase().startsWith("COA-QL-") ? request.patternId : undefined,
  ]
    .map((value) => text(value).toUpperCase())
    .filter((value) => value.startsWith("COA-QL-"));

  const unique = [...new Set(selectors)];
  if (unique.length > 1) throw new Error(`Conflicting COA QL selectors: ${unique.join(", ")}`);
  const selected = unique[0];
  if (!selected) return undefined;
  if (selected === "COA-QL-007") {
    throw new Error("COA-QL-007 is retired from semantic generation and cannot be selected in Question Studio");
  }
  if (!isActiveQl(selected)) throw new Error(`Unsupported COA Question Studio QL ${selected}`);
  return selected;
}

function qlsForCheckpoint(value: unknown): readonly CoaCp010ActiveQlId[] | undefined {
  const checkpoint = text(value).toUpperCase();
  if (!checkpoint || checkpoint === COA_CP010_CHECKPOINT_ID || checkpoint === "COA-CP-001") {
    return undefined;
  }
  if (checkpoint === "COA-CP-002") return ["COA-QL-001", "COA-QL-002"];
  if (checkpoint === "COA-CP-003") return ["COA-QL-003", "COA-QL-004"];
  if (checkpoint === "COA-CP-004") return ["COA-QL-005", "COA-QL-006"];
  if (checkpoint === "COA-CP-005" || checkpoint === "COA-CP-008") return undefined;
  if (checkpoint === "COA-CP-006") return ["COA-QL-008"];
  if (checkpoint === "COA-CP-007") return ["COA-QL-009"];
  if (checkpoint === "COA-CP-009") return undefined;
  if (checkpoint.startsWith("COA-CP-")) throw new Error(`Unsupported COA checkpoint selector ${checkpoint}`);
  return undefined;
}

function resolveProfile(request: ExtendedRequest): CoaCp010PresentationProfile {
  const explicit = text(request.presentationProfile || request.patternId).toUpperCase();
  if (!explicit || explicit.startsWith("COA-QL-")) return "TWO_ACTION_FOUR_WAY";
  if ((COA_CP010_PRESENTATION_PROFILES as readonly string[]).includes(explicit)) {
    return explicit as CoaCp010PresentationProfile;
  }
  if (explicit.startsWith("COA-")) throw new Error(`Unsupported COA presentation profile ${explicit}`);
  return "TWO_ACTION_FOUR_WAY";
}

function answerClassAfterSwap(answerClass: CoaAnswerClass, swapped: boolean): CoaAnswerClass {
  if (!swapped) return answerClass;
  if (answerClass === "ONLY_I") return "ONLY_II";
  if (answerClass === "ONLY_II") return "ONLY_I";
  return answerClass;
}

function fourWayIndex(answerClass: CoaAnswerClass): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "BOTH") return 2;
  return 3;
}

function fiveWayIndex(answerClass: CoaAnswerClass | "EITHER"): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "EITHER") return 2;
  if (answerClass === "NEITHER") return 3;
  return 4;
}

function sourceCheckpointForScenario(id: string): string {
  const number = Number(id.match(/(\d+)$/u)?.[1] ?? 0);
  if (number <= 24) return "COA-CP-001";
  if (number <= 48) return "COA-CP-002";
  if (number <= 72) return "COA-CP-003";
  if (number <= 96) return "COA-CP-004";
  if (number <= 108) return "COA-CP-006";
  return "COA-CP-007";
}

function verdictLead(language: QuestionStudioLanguage, label: string, follows: boolean): string {
  if (language === "hi") return `कार्रवाई ${label} ${follows ? "सही है" : "सही नहीं है"}:`;
  if (language === "pa") return `ਕਾਰਵਾਈ ${label} ${follows ? "ਸਹੀ ਹੈ" : "ਸਹੀ ਨਹੀਂ ਹੈ"}:`;
  return `Course ${label} ${follows ? "follows" : "does not follow"}:`;
}

function ordinarySurface(
  scenario: CoaScenarioAuthority,
  language: QuestionStudioLanguage,
  swapped: boolean,
) {
  if (language === "en") {
    const actions = swapped
      ? [scenario.actions[1], scenario.actions[0]] as const
      : scenario.actions;
    return {
      statement: scenario.statement,
      actions: actions.map((action) => ({
        semanticActionId: action.id,
        text: action.text,
        explanation: action.explanation,
        expectedVerdict: action.expectedVerdict,
      })),
    };
  }

  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const localized = getCoaCp009LocalizedOrdinary(scenario.id, locale);
  const indexes = swapped ? [1, 0] as const : [0, 1] as const;
  return {
    statement: localized.statement,
    actions: indexes.map((sourceIndex) => ({
      semanticActionId: localized.actions[sourceIndex].semanticActionId,
      text: localized.actions[sourceIndex].text,
      explanation: localized.actions[sourceIndex].explanation,
      expectedVerdict: scenario.actions[sourceIndex].expectedVerdict,
    })),
  };
}

function eitherSurface(
  scenario: (typeof COA_CP008_EITHER_AUTHORITIES)[number],
  language: QuestionStudioLanguage,
  swapped: boolean,
) {
  if (language === "en") {
    const indexes = swapped ? [1, 0] as const : [0, 1] as const;
    return {
      statement: scenario.statement,
      actions: indexes.map((sourceIndex) => ({
        semanticActionId: scenario.actions[sourceIndex].id,
        text: scenario.actions[sourceIndex].text,
        explanation: scenario.actions[sourceIndex].explanation,
      })),
      pairReason: scenario.exclusiveRelationReason,
    };
  }
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const localized = getCoaCp009LocalizedEither(scenario.id, locale);
  const indexes = swapped ? [1, 0] as const : [0, 1] as const;
  return {
    statement: localized.statement,
    actions: indexes.map((sourceIndex) => ({
      semanticActionId: localized.actions[sourceIndex].semanticActionId,
      text: localized.actions[sourceIndex].text,
      explanation: localized.actions[sourceIndex].explanation,
    })),
    pairReason: localized.pairReason,
  };
}

function threeActionSurface(
  scenario: (typeof COA_CP008_THREE_ACTION_AUTHORITIES)[number],
  language: QuestionStudioLanguage,
) {
  if (language === "en") {
    return {
      statement: scenario.statement,
      actions: scenario.actions.map((action) => ({
        semanticActionId: action.id,
        text: action.text,
        explanation: action.explanation,
        expectedVerdict: action.expectedVerdict,
      })),
    };
  }
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const localized = getCoaCp009LocalizedThreeAction(scenario.id, locale);
  return {
    statement: localized.statement,
    actions: localized.actions.map((action, index) => ({
      semanticActionId: action.semanticActionId,
      text: action.text,
      explanation: action.explanation,
      expectedVerdict: scenario.actions[index]!.expectedVerdict,
    })),
  };
}

function maskLabel(language: QuestionStudioLanguage, mask: number): string {
  const labels = ["I", "II", "III"].filter((_, index) => Boolean(mask & (1 << index)));
  if (language === "hi") {
    if (labels.length === 0) return "I, II और III में से कोई भी सही नहीं है";
    if (labels.length === 3) return "I, II और III सभी सही हैं";
    if (labels.length === 1) return `केवल कार्रवाई ${labels[0]} सही है`;
    return `केवल कार्रवाइयाँ ${labels.join(" और ")} सही हैं`;
  }
  if (language === "pa") {
    if (labels.length === 0) return "I, II ਅਤੇ III ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਸਹੀ ਨਹੀਂ ਹੈ";
    if (labels.length === 3) return "I, II ਅਤੇ III ਤਿੰਨੇ ਸਹੀ ਹਨ";
    if (labels.length === 1) return `ਕੇਵਲ ਕਾਰਵਾਈ ${labels[0]} ਸਹੀ ਹੈ`;
    return `ਕੇਵਲ ਕਾਰਵਾਈਆਂ ${labels.join(" ਅਤੇ ")} ਸਹੀ ਹਨ`;
  }
  if (labels.length === 0) return "None of Courses I, II and III follows";
  if (labels.length === 3) return "Courses I, II and III follow";
  if (labels.length === 1) return `Only Course ${labels[0]} follows`;
  return `Only Courses ${labels.join(" and ")} follow`;
}

function displayStem(statement: string, courses: readonly { label: string; text: string }[]): string {
  return `${statement}\n\n${courses.map((course) => `${course.label}. ${course.text}`).join("\n")}`;
}

function normalizeQuestion(input: {
  language: QuestionStudioLanguage;
  seed: string;
  itemIndex: number;
  profile: CoaCp010PresentationProfile;
  semanticAuthorityId: string;
  sourceCheckpointId: string;
  difficulty: CoaDifficulty;
  domain: string;
  qlId?: CoaQlId;
  statement: string;
  instruction: string;
  courses: readonly { label: string; text: string; semanticActionId: string }[];
  options: readonly string[];
  correctIndex: number;
  explanation: string;
  answerClass?: string;
  answerMask?: number;
  pairRelation?: string;
}) {
  const stem = displayStem(input.statement, input.courses);
  const answer = input.options[input.correctIndex]!;
  const contentFingerprint = fingerprint([
    COA_CP010_QUESTION_STUDIO_AUTHORITY,
    input.profile,
    input.semanticAuthorityId,
    input.language,
    input.statement,
    input.courses,
    input.options,
    input.correctIndex,
  ]);
  const questionId = `COA-001:${input.semanticAuthorityId}:${input.profile}:${input.language}:${contentFingerprint.slice(0, 18)}`;

  return Object.freeze({
    ...lifecycle,
    id: questionId,
    questionId,
    packageId: "COA-001" as const,
    chapterId: "REAS-COA" as const,
    checkpointId: COA_CP010_CHECKPOINT_ID,
    sourceCheckpointId: input.sourceCheckpointId,
    currentQuestionStudioAuthority: COA_CP010_QUESTION_STUDIO_AUTHORITY,
    semanticAuthorityId: input.semanticAuthorityId,
    qlId: input.qlId ?? null,
    permanentQlId: input.qlId ?? null,
    patternId: input.profile,
    presentationProfile: input.profile,
    subject: "Reasoning Ability" as const,
    topic: "Reasoning" as const,
    subtopic: "Course of Action" as const,
    language: input.language,
    locale: localeForLanguage(input.language),
    statement: input.statement,
    instruction: input.instruction,
    courses: input.courses,
    text: stem,
    stem,
    options: input.options,
    correct: input.correctIndex,
    correctIndex: input.correctIndex,
    answer,
    canonicalAnswer: answer,
    answerClass: input.answerClass ?? null,
    answerMask: input.answerMask ?? null,
    pairRelation: input.pairRelation ?? null,
    explanation: input.explanation,
    difficulty: difficultyLabel(input.difficulty),
    difficultyLabel: difficultyLabel(input.difficulty),
    semanticDifficulty: input.difficulty,
    domain: input.domain,
    generationSeed: input.seed,
    itemIndex: input.itemIndex,
    contentFingerprint,
    runtimeMode: COA_CP010_RUNTIME_MODE,
    reviewStatus: COA_CP010_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioVisible: true as const,
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    questionStudioRegistrationStatus: "REGISTERED_CP010_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    multilingualChapterFrozen: true as const,
    crossLanguageSemanticParity: true as const,
    reviewOnly: true as const,
    readOnly: true as const,
    persistenceAllowed: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: "LOCKED" as const,
    productionReleased: false as const,
  });
}

function ordinaryPool(
  qlId: CoaCp010ActiveQlId | undefined,
  checkpointQls: readonly CoaCp010ActiveQlId[] | undefined,
  difficulty: CoaDifficulty | undefined,
): CoaScenarioAuthority[] {
  const allowedQls = qlId ? [qlId] : checkpointQls ?? COA_CP010_ACTIVE_QL_IDS;
  return COA_CURRENT_ENGLISH_AUTHORITIES.filter(
    (entry) =>
      entry.qlId !== "COA-QL-007"
      && (allowedQls as readonly string[]).includes(entry.qlId)
      && (!difficulty || entry.difficulty === difficulty),
  );
}

function generateOrdinary(
  scenario: CoaScenarioAuthority,
  language: QuestionStudioLanguage,
  profile: "TWO_ACTION_FOUR_WAY" | "TWO_ACTION_FIVE_CODE",
  seed: string,
  itemIndex: number,
) {
  const variant = stableHash(`${seed}:${scenario.id}:${itemIndex}:${profile}`);
  const swapped = variant % 2 === 1;
  const instructionIndex = Math.floor(variant / 2) % TWO_ACTION_INSTRUCTIONS[language].length;
  const surface = ordinarySurface(scenario, language, swapped);
  const answerClass = answerClassAfterSwap(scenario.expectedAnswerClass, swapped);
  const options = profile === "TWO_ACTION_FOUR_WAY"
    ? FOUR_WAY_OPTIONS[language]
    : FIVE_WAY_OPTIONS[language];
  const correctIndex = profile === "TWO_ACTION_FOUR_WAY"
    ? fourWayIndex(answerClass)
    : fiveWayIndex(answerClass);
  const courses = surface.actions.map((action, index) => Object.freeze({
    label: (index === 0 ? "I" : "II") as "I" | "II",
    text: action.text,
    semanticActionId: action.semanticActionId,
  }));
  const explanation = surface.actions.map((action, index) =>
    `${verdictLead(language, index === 0 ? "I" : "II", action.expectedVerdict === "FOLLOWS")} ${action.explanation}`
  ).join(" ");

  return normalizeQuestion({
    language,
    seed,
    itemIndex,
    profile,
    semanticAuthorityId: scenario.id,
    sourceCheckpointId: sourceCheckpointForScenario(scenario.id),
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    qlId: scenario.qlId,
    statement: surface.statement,
    instruction: TWO_ACTION_INSTRUCTIONS[language][instructionIndex]!,
    courses,
    options,
    correctIndex,
    explanation,
    answerClass,
    pairRelation: "INDEPENDENT_VERDICTS",
  });
}

function generateEither(
  scenario: (typeof COA_CP008_EITHER_AUTHORITIES)[number],
  language: QuestionStudioLanguage,
  seed: string,
  itemIndex: number,
) {
  const variant = stableHash(`${seed}:${scenario.id}:${itemIndex}:EITHER`);
  const swapped = variant % 2 === 1;
  const instructionIndex = Math.floor(variant / 2) % TWO_ACTION_INSTRUCTIONS[language].length;
  const surface = eitherSurface(scenario, language, swapped);
  const courses = surface.actions.map((action, index) => Object.freeze({
    label: (index === 0 ? "I" : "II") as "I" | "II",
    text: action.text,
    semanticActionId: action.semanticActionId,
  }));
  const explanation = [
    `${verdictLead(language, "I", true)} ${surface.actions[0].explanation}`,
    `${verdictLead(language, "II", true)} ${surface.actions[1].explanation}`,
    surface.pairReason,
  ].join(" ");

  return normalizeQuestion({
    language,
    seed,
    itemIndex,
    profile: "TWO_ACTION_FIVE_CODE",
    semanticAuthorityId: scenario.id,
    sourceCheckpointId: "COA-CP-008",
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    statement: surface.statement,
    instruction: TWO_ACTION_INSTRUCTIONS[language][instructionIndex]!,
    courses,
    options: FIVE_WAY_OPTIONS[language],
    correctIndex: 2,
    explanation,
    answerClass: "EITHER",
    pairRelation: "MUTUALLY_EXCLUSIVE_ALTERNATIVES",
  });
}

function generateThreeAction(
  scenario: (typeof COA_CP008_THREE_ACTION_AUTHORITIES)[number],
  language: QuestionStudioLanguage,
  seed: string,
  itemIndex: number,
) {
  const variant = stableHash(`${seed}:${scenario.id}:${itemIndex}:THREE`);
  const instructionIndex = variant % THREE_ACTION_INSTRUCTIONS[language].length;
  const rotation = Math.floor(variant / THREE_ACTION_INSTRUCTIONS[language].length) % scenario.optionMasks.length;
  const rotatedMasks = [
    ...scenario.optionMasks.slice(rotation),
    ...scenario.optionMasks.slice(0, rotation),
  ];
  const correctIndex = rotatedMasks.indexOf(scenario.correctMask);
  const surface = threeActionSurface(scenario, language);
  const courses = surface.actions.map((action, index) => Object.freeze({
    label: (["I", "II", "III"] as const)[index]!,
    text: action.text,
    semanticActionId: action.semanticActionId,
  }));
  const explanation = surface.actions.map((action, index) =>
    `${verdictLead(language, (["I", "II", "III"] as const)[index]!, action.expectedVerdict === "FOLLOWS")} ${action.explanation}`
  ).join(" ");

  return normalizeQuestion({
    language,
    seed,
    itemIndex,
    profile: "THREE_ACTION_COMBINATION",
    semanticAuthorityId: scenario.id,
    sourceCheckpointId: "COA-CP-008",
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    statement: surface.statement,
    instruction: THREE_ACTION_INSTRUCTIONS[language][instructionIndex]!,
    courses,
    options: rotatedMasks.map((mask) => maskLabel(language, mask)),
    correctIndex,
    explanation,
    answerMask: scenario.correctMask,
  });
}

export function isCoaCp010QuestionStudioRequest(
  request: Readonly<Record<string, unknown>>,
): boolean {
  const packageId = text(request.packageId ?? request.archetypeId).toUpperCase();
  if (packageId) return packageId === "COA-001";
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
    request.cpId,
  ].map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("COA-QL-") || selector.startsWith("COA-CP-"))) {
    return true;
  }
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return (
    subtopic === "course of action"
    || subtopic === "course of actions"
    || (topic === "reasoning" && (subtopic === "course action" || subtopic === "courses of action"))
  );
}

export async function generateCoaCp010QuestionStudioBatch(
  request: ExtendedRequest,
) {
  if (request.runtimeMode && request.runtimeMode !== COA_CP010_RUNTIME_MODE) {
    throw new Error(`COA-001 only supports ${COA_CP010_RUNTIME_MODE} runtime during CP010`);
  }

  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const difficulty = normalizeDifficulty(request.difficulty);
  const qlId = resolveQl(request);
  const checkpointQls = qlsForCheckpoint(request.cpId);
  if (qlId && checkpointQls && !checkpointQls.includes(qlId)) {
    throw new Error(`${qlId} is not owned by requested checkpoint ${request.cpId}`);
  }
  const profile = resolveProfile(request);
  if (profile === "THREE_ACTION_COMBINATION" && (qlId || checkpointQls)) {
    throw new Error("THREE_ACTION_COMBINATION is a source-backed presentation authority and cannot be filtered by semantic QL/checkpoint");
  }

  const baseSeed = text(request.seed) || "coa001-cp010-question-studio";
  const questions: Record<string, unknown>[] = [];

  if (profile === "THREE_ACTION_COMBINATION") {
    const pool = COA_CP008_THREE_ACTION_AUTHORITIES.filter(
      (entry) => !difficulty || entry.difficulty === difficulty,
    );
    if (pool.length === 0) throw new Error("No three-action COA authority matches the requested difficulty");
    const start = stableHash(`${baseSeed}:three:start`) % pool.length;
    for (let index = 0; index < count; index += 1) {
      questions.push(generateThreeAction(pool[(start + index) % pool.length]!, language, baseSeed, index));
    }
  } else {
    const pool = ordinaryPool(qlId, checkpointQls, difficulty);
    if (pool.length === 0) throw new Error("No ordinary COA authority matches the requested filters");
    const eitherPool = profile === "TWO_ACTION_FIVE_CODE" && !qlId && !checkpointQls
      ? COA_CP008_EITHER_AUTHORITIES.filter((entry) => !difficulty || entry.difficulty === difficulty)
      : [];
    const ordinaryStart = stableHash(`${baseSeed}:ordinary:start:${profile}`) % pool.length;
    const eitherStart = eitherPool.length > 0 ? stableHash(`${baseSeed}:either:start`) % eitherPool.length : 0;

    for (let index = 0; index < count; index += 1) {
      const useEither = profile === "TWO_ACTION_FIVE_CODE"
        && eitherPool.length > 0
        && index % 5 === 0;
      if (useEither) {
        questions.push(generateEither(eitherPool[(eitherStart + Math.floor(index / 5)) % eitherPool.length]!, language, baseSeed, index));
      } else {
        questions.push(generateOrdinary(pool[(ordinaryStart + index) % pool.length]!, language, profile, baseSeed, index));
      }
    }
  }

  return Object.freeze({
    packageId: "COA-001" as const,
    checkpointId: COA_CP010_CHECKPOINT_ID,
    authority: COA_CP010_QUESTION_STUDIO_AUTHORITY,
    questions: Object.freeze(questions),
    generationContext: Object.freeze({
      ...lifecycle,
      engineId: "reasoning-v1" as const,
      generationDomain: "reasoning-v1" as const,
      packageId: "COA-001" as const,
      chapterId: "REAS-COA" as const,
      checkpointId: COA_CP010_CHECKPOINT_ID,
      authority: COA_CP010_QUESTION_STUDIO_AUTHORITY,
      runtimeMode: COA_CP010_RUNTIME_MODE,
      reviewStatus: COA_CP010_REVIEW_STATUS,
      registrationStatus: "REGISTERED_CP010_REVIEW_ONLY" as const,
      permanentQlCount: COA_CP010_ACTIVE_QL_IDS.length,
      permanentQlIds: COA_CP010_ACTIVE_QL_IDS,
      retiredSemanticQlIds: Object.freeze(["COA-QL-007"] as const),
      presentationProfiles: COA_CP010_PRESENTATION_PROFILES,
      multilingualChapterFrozen: true as const,
      crossLanguageSemanticParity: true as const,
      language,
      requestedDifficulty: difficulty ? difficultyLabel(difficulty) : "Mixed",
      qlId: qlId ?? null,
      checkpointSelector: text(request.cpId) || null,
      presentationProfile: profile,
      seed: baseSeed,
      count,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export const COA_CP010_QUESTION_STUDIO_PACKAGE = Object.freeze({
  engineId: "reasoning-v1" as const,
  packageId: "COA-001" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Course of Action" as const,
  label: "Reasoning · Course of Action · COA-001" as const,
  enabled: true as const,
  cpIds: [
    "COA-CP-001", "COA-CP-002", "COA-CP-003", "COA-CP-004", "COA-CP-005",
    "COA-CP-006", "COA-CP-007", "COA-CP-008", "COA-CP-009", "COA-CP-010",
  ],
  canonicalProblems: Object.freeze(COA_CP010_ACTIVE_QL_IDS.map((qlId) => Object.freeze({
    id: qlId,
    label: qlId,
  }))),
  permanentQlCount: COA_CP010_ACTIVE_QL_IDS.length,
  permanentQlIds: COA_CP010_ACTIVE_QL_IDS,
  retiredSemanticQlIds: Object.freeze(["COA-QL-007"] as const),
  presentationProfiles: Object.freeze(COA_CP010_PRESENTATION_PROFILES.map((profileId) => Object.freeze({
    profileId,
    sourceStatus:
      profileId === "TWO_ACTION_FOUR_WAY"
        ? "SOURCE_SUPPORTED_CORE"
        : profileId === "TWO_ACTION_FIVE_CODE"
          ? "SOURCE_SUPPORTED_BANKING"
          : "SOURCE_SUPPORTED_CORE_VARIANT",
  }))),
  patternIds: COA_CP010_PRESENTATION_PROFILES,
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true as const,
  runtimeMode: COA_CP010_RUNTIME_MODE,
  supportedRuntimeModes: [COA_CP010_RUNTIME_MODE],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  reviewOnly: true as const,
  questionStudioVisible: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  multilingualChapterFrozen: true as const,
  releaseFreezeStatus: "LEARNER_RELEASE_LOCKED" as const,
  metadata: Object.freeze({
    registrationAuthorityId: COA_CP010_QUESTION_STUDIO_AUTHORITY,
    englishTaxonomyStatus: "FINAL_FROZEN",
    localizationStatus: "APPROVED_FROZEN",
    semanticAuthorityCount: 130,
    localizedSurfaceCount: 260,
    retiredSemanticQl: "COA-QL-007",
    singleBestActionBoundary: "DECISION_MAKING",
    deterministicGeneration: true,
  }),
}) satisfies QuestionStudioPackageDefinition & Readonly<Record<string, unknown>>;
