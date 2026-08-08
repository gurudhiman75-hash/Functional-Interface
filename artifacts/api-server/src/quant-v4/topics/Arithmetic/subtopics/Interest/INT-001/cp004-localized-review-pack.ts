import { createHash } from "node:crypto";
import {
  INT_CP004_QL_IDS,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import {
  generateIntCp004EnglishFrozenQuestion,
  type IntCp004EnglishFrozenQuestion,
} from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZATION_VERSION,
  languageForCp004Locale,
} from "./cp004-localization-language-pack";
import { localizeIntCp004EnglishFrozenQuestion } from "./cp004-localized-runtime";
import type {
  IntCp004LocalizedLocale,
  IntCp004LocalizedQuestion,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_REVIEW_PACK_VERSION = "INT-CP-004-HI-PA-REVIEW-PACK-v1" as const;
export const INT_CP004_REVIEW_QUESTIONS_PER_QL = 4 as const;
export const INT_CP004_REVIEW_QUESTION_COUNT = 76 as const;

const REPRESENTATION_BY_FRAME = Object.freeze([
  "TERMS_TABLE",
  "STANDARD_PROSE",
  "BALANCE_RECORD",
  "SCHEME_COMPARISON",
] as const);

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);

export type IntCp004ReviewOptionLabel = typeof OPTION_LABELS[number];

export interface IntCp004LocalizedReviewOption {
  readonly label: IntCp004ReviewOptionLabel;
  readonly id: string;
  readonly text: string;
  readonly feedback: string;
  readonly misconceptionId: string;
  readonly isCorrect: boolean;
}

export interface IntCp004LocalizedReviewQuestion {
  readonly number: number;
  readonly questionWithinQl: number;
  readonly qlId: IntCp004QlId;
  readonly seed: string;
  readonly stemFamilyId: string;
  readonly representation: IntCp004LocalizedQuestion["representation"];
  readonly difficulty: IntCp004LocalizedQuestion["difficulty"];
  readonly answerSemantic: IntCp004LocalizedQuestion["answerSemantic"];
  readonly stem: string;
  readonly options: readonly IntCp004LocalizedReviewOption[];
  readonly correctIndex: number;
  readonly correctLabel: IntCp004ReviewOptionLabel;
  readonly correctAnswer: string;
  readonly explanation: Readonly<{
    whatAsked: string;
    steps: readonly string[];
    finalAnswer: string;
    commonMistake: string;
  }>;
  readonly lifecycle: Readonly<{
    enabled: false;
    stagingStatus: "NOT_STAGED";
    registrationStatus: "NOT_REGISTERED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

export interface IntCp004LocalizedReviewPack {
  readonly status: "LOCALIZED_HUMAN_REVIEW_REQUIRED";
  readonly reviewPackVersion: typeof INT_CP004_LOCALIZED_REVIEW_PACK_VERSION;
  readonly localizationVersion: typeof INT_CP004_LOCALIZATION_VERSION;
  readonly canonicalFreezeId: "INT-CP-004-EN-v1-frozen";
  readonly locale: IntCp004LocalizedLocale;
  readonly language: "hi" | "pa";
  readonly qlRange: "INT-QL-067..INT-QL-085";
  readonly qlCount: 19;
  readonly questionsPerQl: 4;
  readonly questionCount: 76;
  readonly selectionContract: Readonly<{
    oneQuestionPerStemFamily: true;
    oneQuestionPerRepresentation: true;
    answerPositionBalanced: true;
    deterministicSeeds: true;
    sharedCanonicalSeedsAcrossLocales: true;
  }>;
  readonly questions: readonly IntCp004LocalizedReviewQuestion[];
  readonly lifecycle: Readonly<{
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    enabled: false;
    stagingStatus: "NOT_STAGED";
    registrationStatus: "NOT_REGISTERED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

function desiredStemFamily(qlId: IntCp004QlId, frameIndex: number): string {
  return `${qlId}-FRAME-${frameIndex + 1}`;
}

function selectEnglishReviewSource(
  qlId: IntCp004QlId,
  frameIndex: number,
): IntCp004EnglishFrozenQuestion {
  const expectedFamily = desiredStemFamily(qlId, frameIndex);
  const expectedRepresentation = REPRESENTATION_BY_FRAME[frameIndex];
  const desiredCorrectIndex = (frameIndex + 1) % 4;

  for (let candidate = 0; candidate < 10_000; candidate += 1) {
    const seed = `int-cp004-hi-pa-review:${qlId}:frame-${frameIndex + 1}:candidate-${candidate}`;
    const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
    if (
      source.stemFamilyId === expectedFamily
      && source.representation === expectedRepresentation
      && source.correctIndex === desiredCorrectIndex
    ) {
      return source;
    }
  }

  throw new Error(
    `${qlId}: unable to select frame ${frameIndex + 1} with correct index ${desiredCorrectIndex}.`,
  );
}

function toReviewQuestion(
  localized: IntCp004LocalizedQuestion,
  number: number,
  questionWithinQl: number,
): IntCp004LocalizedReviewQuestion {
  const correctLabel = OPTION_LABELS[localized.correctIndex];
  if (!correctLabel) throw new Error(`${localized.qlId}/${localized.seed}: invalid correct index.`);

  return deepFreeze({
    number,
    questionWithinQl,
    qlId: localized.qlId,
    seed: localized.seed,
    stemFamilyId: localized.stemFamilyId,
    representation: localized.representation,
    difficulty: localized.difficulty,
    answerSemantic: localized.answerSemantic,
    stem: localized.stem,
    options: localized.options.map((option, index) => ({
      label: OPTION_LABELS[index]!,
      id: option.id,
      text: option.text,
      feedback: option.feedback,
      misconceptionId: option.misconceptionId,
      isCorrect: option.isCorrect,
    })),
    correctIndex: localized.correctIndex,
    correctLabel,
    correctAnswer: localized.correctAnswer,
    explanation: {
      whatAsked: localized.explanation.whatAsked,
      steps: localized.explanation.steps,
      finalAnswer: localized.explanation.finalAnswer,
      commonMistake: localized.explanation.commonMistake,
    },
    lifecycle: {
      enabled: false,
      stagingStatus: "NOT_STAGED",
      registrationStatus: "NOT_REGISTERED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  });
}

export function buildIntCp004LocalizedReviewPack(
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedReviewPack {
  const questions: IntCp004LocalizedReviewQuestion[] = [];

  for (const qlId of INT_CP004_QL_IDS) {
    for (let frameIndex = 0; frameIndex < INT_CP004_REVIEW_QUESTIONS_PER_QL; frameIndex += 1) {
      const source = selectEnglishReviewSource(qlId, frameIndex);
      const localized = localizeIntCp004EnglishFrozenQuestion(source, locale);
      questions.push(toReviewQuestion(localized, questions.length + 1, frameIndex + 1));
    }
  }

  if (questions.length !== INT_CP004_REVIEW_QUESTION_COUNT) {
    throw new Error(`Expected ${INT_CP004_REVIEW_QUESTION_COUNT} review questions, received ${questions.length}.`);
  }

  return deepFreeze({
    status: "LOCALIZED_HUMAN_REVIEW_REQUIRED",
    reviewPackVersion: INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
    localizationVersion: INT_CP004_LOCALIZATION_VERSION,
    canonicalFreezeId: "INT-CP-004-EN-v1-frozen",
    locale,
    language: languageForCp004Locale(locale),
    qlRange: "INT-QL-067..INT-QL-085",
    qlCount: 19,
    questionsPerQl: INT_CP004_REVIEW_QUESTIONS_PER_QL,
    questionCount: INT_CP004_REVIEW_QUESTION_COUNT,
    selectionContract: {
      oneQuestionPerStemFamily: true,
      oneQuestionPerRepresentation: true,
      answerPositionBalanced: true,
      deterministicSeeds: true,
      sharedCanonicalSeedsAcrossLocales: true,
    },
    questions,
    lifecycle: {
      maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      enabled: false,
      stagingStatus: "NOT_STAGED",
      registrationStatus: "NOT_REGISTERED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  });
}

function labels(locale: IntCp004LocalizedLocale): Readonly<{
  title: string;
  notice: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  whatAsked: string;
  steps: string;
  finalAnswer: string;
  commonMistake: string;
  optionFeedback: string;
}> {
  if (locale === "hi-IN") {
    return Object.freeze({
      title: "INT-CP-004 हिंदी प्रश्न एवं समाधान समीक्षा",
      notice: "यह मानव भाषाई और परीक्षा-तैयारी समीक्षा हेतु मसौदा है। इसे परीक्षण या प्रकाशन में उपयोग न करें।",
      question: "प्रश्न",
      options: "विकल्प",
      correctAnswer: "सही उत्तर",
      explanation: "समाधान",
      whatAsked: "क्या ज्ञात करना है",
      steps: "क्रमबद्ध हल",
      finalAnswer: "अंतिम उत्तर",
      commonMistake: "सामान्य गलती",
      optionFeedback: "विकल्प प्रतिक्रिया",
    });
  }
  return Object.freeze({
    title: "INT-CP-004 ਪੰਜਾਬੀ ਪ੍ਰਸ਼ਨ ਅਤੇ ਹੱਲ ਸਮੀਖਿਆ",
    notice: "ਇਹ ਮਨੁੱਖੀ ਭਾਸ਼ਾਈ ਅਤੇ ਪ੍ਰੀਖਿਆ-ਤਿਆਰੀ ਸਮੀਖਿਆ ਲਈ ਮਸੌਦਾ ਹੈ। ਇਸ ਨੂੰ ਟੈਸਟ ਜਾਂ ਪ੍ਰਕਾਸ਼ਨ ਵਿੱਚ ਨਾ ਵਰਤੋ।",
    question: "ਪ੍ਰਸ਼ਨ",
    options: "ਵਿਕਲਪ",
    correctAnswer: "ਸਹੀ ਉੱਤਰ",
    explanation: "ਹੱਲ",
    whatAsked: "ਕੀ ਪਤਾ ਕਰਨਾ ਹੈ",
    steps: "ਕ੍ਰਮਵਾਰ ਹੱਲ",
    finalAnswer: "ਅੰਤਿਮ ਉੱਤਰ",
    commonMistake: "ਆਮ ਗਲਤੀ",
    optionFeedback: "ਵਿਕਲਪ ਪ੍ਰਤੀਕਿਰਿਆ",
  });
}

export function renderIntCp004LocalizedReviewMarkdown(
  pack: IntCp004LocalizedReviewPack,
): string {
  const text = labels(pack.locale);
  const lines: string[] = [
    `# ${text.title}`,
    "",
    `> ${text.notice}`,
    "",
    `- Locale: \`${pack.locale}\``,
    `- QL range: \`${pack.qlRange}\``,
    `- Questions: **${pack.questionCount}** (${pack.questionsPerQl} per QL)`,
    `- Review status: \`${pack.lifecycle.reviewStatus}\``,
    `- Question Studio: \`${pack.lifecycle.questionStudioDiscoverable}\``,
    `- Publicly publishable: \`${pack.lifecycle.publiclyPublishable}\``,
    "",
  ];

  for (const question of pack.questions) {
    lines.push(
      `## ${question.qlId} — ${text.question} ${question.questionWithinQl}`,
      "",
      `- Review number: ${question.number}`,
      `- Seed: \`${question.seed}\``,
      `- Stem family: \`${question.stemFamilyId}\``,
      `- Representation: \`${question.representation}\``,
      `- Difficulty: \`${question.difficulty}\``,
      "",
      `### ${text.question}`,
      "",
      question.stem,
      "",
      `### ${text.options}`,
      "",
    );

    for (const option of question.options) {
      lines.push(
        `**${option.label}. ${option.text}**`,
        "",
        `- ${text.optionFeedback}: ${option.feedback}`,
        `- Misconception ID: \`${option.misconceptionId}\``,
        "",
      );
    }

    lines.push(
      `**${text.correctAnswer}: ${question.correctLabel}. ${question.correctAnswer}**`,
      "",
      `### ${text.explanation}`,
      "",
      `**${text.whatAsked}:** ${question.explanation.whatAsked}`,
      "",
      `**${text.steps}:**`,
      "",
    );

    for (const [index, step] of question.explanation.steps.entries()) {
      lines.push(`${index + 1}. ${step}`);
    }

    lines.push(
      "",
      `**${text.finalAnswer}:** ${question.explanation.finalAnswer}`,
      "",
      `**${text.commonMistake}:** ${question.explanation.commonMistake}`,
      "",
      "---",
      "",
    );
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export function serializeIntCp004LocalizedReviewPack(
  pack: IntCp004LocalizedReviewPack,
): string {
  return `${JSON.stringify(pack, null, 2)}\n`;
}

export function sha256Text(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}
