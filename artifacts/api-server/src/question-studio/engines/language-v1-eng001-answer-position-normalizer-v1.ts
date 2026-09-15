import type { QuestionStudioGenerationResult } from "../engine-types";

export const ENG001_ANSWER_POSITION_NORMALIZATION_ID_V1 = "ENG-001-ANSWER-POSITION-NORMALIZATION-V1" as const;

const MIN_GENERATED_PART_WORDS = 2;
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
  if (groupCount === 0) return [];
  if (words.length < groupCount * MIN_GENERATED_PART_WORDS) return null;

  const out: string[] = [];
  let cursor = 0;
  for (let group = 0; group < groupCount; group += 1) {
    const remainingWords = words.length - cursor;
    const remainingGroups = groupCount - group;
    const minimumForLaterGroups = (remainingGroups - 1) * MIN_GENERATED_PART_WORDS;
    const ideal = Math.ceil(remainingWords / remainingGroups);
    const take = Math.max(
      MIN_GENERATED_PART_WORDS,
      Math.min(ideal, remainingWords - minimumForLaterGroups),
    );
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

  // Keep the exact authored error-bearing text intact. Only option boundaries
  // around it are redrawn, so sentence order and the grammatical mutation are
  // unchanged. At an edge position the target option may absorb the correct
  // words that precede/follow the error-bearing text. Any newly generated
  // non-error part must contain at least two words to avoid mechanical splits.
  const errorSegment = segments[currentIndex]!;
  const prefixWords = wordsOf(segments.slice(0, currentIndex).join(" "));
  const suffixWords = wordsOf(segments.slice(currentIndex + 1).join(" "));

  const feasibleTargets = Array.from({ length: segments.length }, (_, target) => {
    const prefixGroups = target;
    const suffixGroups = segments.length - target - 1;
    return { target, prefixGroups, suffixGroups };
  }).filter(({ prefixGroups, suffixGroups }) => (
    prefixWords.length >= prefixGroups * MIN_GENERATED_PART_WORDS
    && suffixWords.length >= suffixGroups * MIN_GENERATED_PART_WORDS
  ));
  if (feasibleTargets.length < 2) return question;

  const seed = text(question.generationSeed) || text(question.questionId) || text(question.id);
  const selected = feasibleTargets[stableHash(`${seed}:${qlId}:${ENG001_ANSWER_POSITION_NORMALIZATION_ID_V1}`) % feasibleTargets.length]!;

  const prefix = selected.prefixGroups === 0 ? [] : partitionWords(prefixWords, selected.prefixGroups);
  const suffix = selected.suffixGroups === 0 ? [] : partitionWords(suffixWords, selected.suffixGroups);
  if (!prefix || !suffix) return question;

  const targetPrefix = selected.prefixGroups === 0 ? prefixWords.join(" ") : "";
  const targetSuffix = selected.suffixGroups === 0 ? suffixWords.join(" ") : "";
  const targetSegment = [targetPrefix, errorSegment, targetSuffix].filter(Boolean).join(" ");
  const normalizedSegments = [...prefix, targetSegment, ...suffix];
  if (normalizedSegments.length !== segments.length || normalizedSegments.some((segment) => segment.length === 0)) return question;

  const existingOptions = strings(question.options);
  const includeNoError = existingOptions.at(-1) === "No error";
  const normalizedOptions = [...normalizedSegments, ...(includeNoError ? ["No error"] : [])];
  const answerSegment = String.fromCharCode(65 + selected.target);
  const stem = text(question.stem);
  const explanation = text(question.explanation).replace(/\bPart [A-D]\b/g, `Part ${answerSegment}`);
  const learnerText = [stem, ...normalizedOptions.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)].join("\n");

  return {
    ...question,
    segments: normalizedSegments,
    options: normalizedOptions,
    correctIndex: selected.target,
    correct: selected.target,
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
