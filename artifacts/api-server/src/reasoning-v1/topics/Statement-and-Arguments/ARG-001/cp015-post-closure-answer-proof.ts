import type { ArgStrength } from "./types.ts";
import {
  expectedStrengthForArgCp015ContextRole,
  isApprovedArgCp015ContextualizedVariant,
  type ArgCp015ContextSemanticRole,
} from "./cp015-combo-argument-contextualization.ts";
import { isApprovedArgCp015ResidualVariant } from "./cp015-combo-residual-argument-diversity.ts";

export const ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY =
  "ARG_CP015_FINAL_OPTION_SEMANTICS_PROOF_2026_10_04" as const;

const ROMAN_TO_INDEX = Object.freeze({
  I: 0,
  II: 1,
  III: 2,
  IV: 3,
} as const);

type ArgFinalQuestion = Readonly<{
  questionId?: unknown;
  arguments?: readonly unknown[];
  argumentStrengths?: readonly unknown[];
  strongArgumentIndices?: readonly unknown[];
  options?: readonly unknown[];
  correctIndex?: unknown;
  correct?: unknown;
  answer?: unknown;
  canonicalAnswer?: unknown;
  locale?: unknown;
  language?: unknown;
  qlId?: unknown;
  sourceStatement?: unknown;
  statement?: unknown;
  preArgumentContextualizationArguments?: readonly unknown[];
  postArgumentContextualizationArguments?: readonly unknown[];
  comboArgumentSemanticRoles?: readonly unknown[];
  preResidualArgumentDiversityArguments?: readonly unknown[];
  postResidualArgumentDiversityArguments?: readonly unknown[];
}>;

function key(indices: readonly number[]): string {
  return [...indices].sort((a, b) => a - b).join(",");
}

function isEitherDistractor(option: string): boolean {
  return /\bEither\b/iu.test(option)
    || /या\s+तो/u.test(option)
    || /ਜਾਂ\s+(?:ਦਲੀਲ\s+)?I\s+ਜਾਂ\s+II/u.test(option);
}

function isNoneOption(option: string): boolean {
  return /None of the arguments is strong|Neither argument I nor (?:argument )?II is strong/iu.test(option)
    || /कोई भी तर्क मजबूत नहीं है|न तो तर्क I और न ही (?:तर्क )?II मजबूत है/u.test(option)
    || /ਕੋਈ ਵੀ ਦਲੀਲ ਮਜ਼ਬੂਤ ਨਹੀਂ ਹੈ|ਨਾ ਦਲੀਲ I ਅਤੇ ਨਾ ਹੀ (?:ਦਲੀਲ )?II ਮਜ਼ਬੂਤ ਹੈ/u.test(option);
}

function isAllOption(option: string): boolean {
  return /All arguments are strong/iu.test(option)
    || /सभी तर्क मजबूत हैं/u.test(option)
    || /ਸਾਰੀਆਂ ਦਲੀਲਾਂ ਮਜ਼ਬੂਤ ਹਨ/u.test(option);
}

function semanticSetFromOption(
  option: string,
  argumentCount: number,
): readonly number[] | "EITHER_DISTRACTOR" {
  if (isEitherDistractor(option)) return "EITHER_DISTRACTOR";
  if (isNoneOption(option)) return Object.freeze([]);
  if (isAllOption(option)) {
    return Object.freeze(Array.from({ length: argumentCount }, (_, index) => index));
  }

  const labels = option.match(/\b(?:I|II|III|IV)\b/gu) ?? [];
  const indices = [...new Set(labels.map((label) => ROMAN_TO_INDEX[label as keyof typeof ROMAN_TO_INDEX]))]
    .filter((index) => Number.isInteger(index) && index < argumentCount)
    .sort((a, b) => a - b);

  if (indices.length === 0) {
    throw new Error(`ARG CP015 option semantic proof cannot parse option: ${option}`);
  }
  return Object.freeze(indices);
}

export function deriveArgCp015StrongIndices(
  strengths: readonly unknown[],
): readonly number[] {
  return Object.freeze(strengths.flatMap((strength, index) =>
    String(strength).toUpperCase() === "STRONG" ? [index] : [],
  ));
}


function localeOf(question: ArgFinalQuestion): "en-IN" | "hi-IN" | "pa-IN" {
  if (question.locale === "hi-IN" || question.language === "hi") return "hi-IN";
  if (question.locale === "pa-IN" || question.language === "pa") return "pa-IN";
  return "en-IN";
}

function stringArray(value: readonly unknown[] | undefined): readonly string[] | undefined {
  return Array.isArray(value) ? Object.freeze(value.map(String)) : undefined;
}

function assertContextualizationProvenance(
  question: ArgFinalQuestion,
  strengths: readonly unknown[],
): void {
  const before = stringArray(question.preArgumentContextualizationArguments);
  const after = stringArray(question.postArgumentContextualizationArguments);
  const roles = Array.isArray(question.comboArgumentSemanticRoles)
    ? question.comboArgumentSemanticRoles.map((role) => role == null ? undefined : String(role))
    : undefined;
  if (!before && !after && !roles) return;
  if (!before || !after || !roles || before.length !== after.length || before.length !== roles.length) {
    throw new Error(`${String(question.questionId ?? "ARG-CP015-UNKNOWN")}: incomplete contextualization provenance`);
  }

  const locale = localeOf(question);
  const qlId = String(question.qlId ?? "");
  const sourceStatement = String(question.sourceStatement ?? question.statement ?? "");
  for (let index = 0; index < before.length; index += 1) {
    const role = roles[index] as ArgCp015ContextSemanticRole | undefined;
    if (role) {
      const expected = expectedStrengthForArgCp015ContextRole(role);
      if (String(strengths[index] ?? "").toUpperCase() !== expected) {
        throw new Error(
          `${String(question.questionId ?? "ARG-CP015-UNKNOWN")}: contextualized role ${role} at argument ${index + 1} expects ${expected}`,
        );
      }
    }
    if (!isApprovedArgCp015ContextualizedVariant({
      locale,
      qlId,
      sourceStatement,
      sourceArgument: before[index]!,
      targetArgument: after[index]!,
    })) {
      throw new Error(
        `${String(question.questionId ?? "ARG-CP015-UNKNOWN")}: contextualized argument ${index + 1} is outside the approved semantic variant family`,
      );
    }
  }
}

function assertResidualProvenance(question: ArgFinalQuestion): void {
  const before = stringArray(question.preResidualArgumentDiversityArguments);
  const after = stringArray(question.postResidualArgumentDiversityArguments);
  if (!before && !after) return;
  if (!before || !after || before.length !== after.length) {
    throw new Error(`${String(question.questionId ?? "ARG-CP015-UNKNOWN")}: incomplete residual-diversity provenance`);
  }

  const locale = localeOf(question);
  const qlId = String(question.qlId ?? "");
  for (let index = 0; index < before.length; index += 1) {
    if (!isApprovedArgCp015ResidualVariant({
      locale,
      qlId,
      sourceArgument: before[index]!,
      targetArgument: after[index]!,
    })) {
      throw new Error(
        `${String(question.questionId ?? "ARG-CP015-UNKNOWN")}: residual argument ${index + 1} is outside the approved semantic variant family`,
      );
    }
  }
}

export function assertArgCp015FinalAnswerIntegrity(question: ArgFinalQuestion): void {
  const questionId = String(question.questionId ?? "ARG-CP015-UNKNOWN");
  const argumentsList = Array.isArray(question.arguments) ? question.arguments : [];
  const strengths = Array.isArray(question.argumentStrengths) ? question.argumentStrengths : [];
  const options = Array.isArray(question.options) ? question.options.map(String) : [];

  if (argumentsList.length < 2 || argumentsList.length > 4) {
    throw new Error(`${questionId}: final ARG question must display 2-4 arguments`);
  }
  if (strengths.length !== argumentsList.length) {
    throw new Error(`${questionId}: final argumentStrengths length does not match displayed arguments`);
  }
  if (options.length < 4 || options.length > 5) {
    throw new Error(`${questionId}: final ARG question must display 4-5 options`);
  }

  for (const strength of strengths) {
    if (String(strength).toUpperCase() !== "STRONG" && String(strength).toUpperCase() !== "WEAK") {
      throw new Error(`${questionId}: invalid final argument strength ${String(strength)}`);
    }
  }

  assertContextualizationProvenance(question, strengths);
  assertResidualProvenance(question);

  const expectedStrong = deriveArgCp015StrongIndices(strengths);
  const expectedKey = key(expectedStrong);
  const parsed = options.map((option) => semanticSetFromOption(option, argumentsList.length));
  const matchingOptionIndexes = parsed.flatMap((semantic, index) =>
    semantic !== "EITHER_DISTRACTOR" && key(semantic) === expectedKey ? [index] : [],
  );

  if (matchingOptionIndexes.length !== 1) {
    throw new Error(
      `${questionId}: expected exactly one option for strong-set [${expectedStrong.join(",")}], found ${matchingOptionIndexes.length}`,
    );
  }

  const runtimeCorrectIndex = Number(question.correctIndex ?? question.correct);
  if (!Number.isInteger(runtimeCorrectIndex) || runtimeCorrectIndex !== matchingOptionIndexes[0]) {
    throw new Error(
      `${questionId}: runtime correct index ${String(question.correctIndex ?? question.correct)} disagrees with independently parsed option semantics ${matchingOptionIndexes[0]}`,
    );
  }

  const expectedAnswer = options[runtimeCorrectIndex]!;
  if (question.answer !== undefined && String(question.answer) !== expectedAnswer) {
    throw new Error(`${questionId}: answer text disagrees with correct option`);
  }
  if (question.canonicalAnswer !== undefined && String(question.canonicalAnswer) !== expectedAnswer) {
    throw new Error(`${questionId}: canonical answer disagrees with correct option`);
  }

  if (Array.isArray(question.strongArgumentIndices)) {
    const metadataIndices = question.strongArgumentIndices.map(Number).sort((a, b) => a - b);
    if (key(metadataIndices) !== expectedKey) {
      throw new Error(`${questionId}: strongArgumentIndices metadata disagrees with argumentStrengths`);
    }
  }

  if (parsed[runtimeCorrectIndex] === "EITHER_DISTRACTOR") {
    throw new Error(`${questionId}: Either-I-or-II distractor cannot be the correct answer`);
  }
}

export function assertArgCp015StrengthVector(
  strengths: readonly ArgStrength[],
): void {
  deriveArgCp015StrongIndices(strengths);
}
