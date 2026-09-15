import type { QuestionStudioGenerationResult } from "../engine-types";

export const ENG001_ANSWER_POSITION_NORMALIZATION_ID_V1 = "ENG-001-ANSWER-POSITION-NORMALIZATION-V1" as const;

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const strings = (value: unknown) => Array.isArray(value) ? value.map((entry) => String(entry ?? "").trim()) : [];

function stableHash(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function wordsOf(value: string) {
  return value.trim().split(/\s+/).filter(Boolean);
}

function partitionWords(words: readonly string[], groupCount: number): string[] | null {
  if (groupCount === 0) return words.length === 0 ? [] : null;
  if (words.length < groupCount) return null;
  const out: string[] = [];
  let cursor = 0;
  for (let group = 0; group < groupCount; group += 1) {
    const remainingWords = words.length - cursor;
    const remainingGroups = groupCount - group;
    const take = Math.ceil(remainingWords / remainingGroups);
    out.push(words.slice(cursor, cursor + take).join(" "));
    cursor += take;
  }
  return cursor === words.length ? out : null;
}

function normalizeQuestion(question: Record<string, unknown>) {
  const qlId = text(question.qlId);
  if (qlId !== "ENG-001-QL001" && qlId !== "ENG-001-QL002") return question;

  const segments = strings(question.segments);
  const currentIndex = Number(question.correctIndex ?? question.correct);
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= segments.length) return question;
  if (segments.length < 2) return question;

  const errorSegment = segments[currentIndex]!;
  const prefixWords = wordsOf(segments.slice(0, currentIndex).join(" "));
  const suffixWords = wordsOf(segments.slice(currentIndex + 1).join(" "));
  const feasibleTargets = Array.from({ length: segments.length }, (_, index) => index).filter((target) => {
    const prefixGroups = target;
    const suffixGroups = segments.length - target - 1;
    return prefixWords.length >= prefixGroups && suffixWords.length >= suffixGroups;
  });
  if (feasibleTargets.length < 2) return question;

  const seed = text(question.generationSeed) || text(question.questionId) || text(question.id);
  const target = feasibleTargets[stableHash(`${seed}:${qlId}:${ENG001_ANSWER_POSITION_NORMALIZATION_ID_V1}`) % feasibleTargets.length]!;
  const prefix = partitionWords(prefixWords, target);
  const suffix = partitionWords(suffixWords, segments.length - target - 1);
  if (!prefix || !suffix) return question;

  const normalizedSegments = [...prefix, errorSegment, ...suffix];
  const existingOptions = strings(question.options);
  const includeNoError = existingOptions.at(-1) === "No error";
  const normalizedOptions = [...normalizedSegments, ...(includeNoError ? ["No error"] : [])];
  const answerSegment = String.fromCharCode(65 + target);
  const stem = text(question.stem);
  const explanation = text(question.explanation).replace(/\bPart [A-D]\b/g, `Part ${answerSegment}`);
  const learnerText = [stem, ...normalizedOptions.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)].join("\n");

  return {
    ...question,
    segments: normalizedSegments,
    options: normalizedOptions,
    correctIndex: target,
    correct: target,
    answerSegment,
    explanation,
    text: learnerText,
    answerPositionNormalizationId: ENG001_ANSWER_POSITION_NORMALIZATION_ID_V1,
  };
}

export function normalizeEng001AnswerPositionsV1(result: QuestionStudioGenerationResult): QuestionStudioGenerationResult {
  return {
    ...result,
    questions: result.questions.map((question) => normalizeQuestion(question as Record<string, unknown>)),
    generationContext: {
      ...(result.generationContext ?? {}),
      answerPositionNormalizationId: ENG001_ANSWER_POSITION_NORMALIZATION_ID_V1,
    },
  };
}
