import { deterministicIndex } from "../../../../core/deterministic";
import type { ArticleRuleId, DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { generateEng002Cp003QuestionV1 } from "../../../sentence-improvement/ENG-002/CP003/eng-002-cp003-v1";

export const ENG003_CP003_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp003QuestionV1 {
  questionId: string;
  stem: string;
  sentence: string;
  segments: readonly string[];
  blankIndex: number;
  options: readonly string[];
  correctOptionIndex: number;
  correctedSentence: string;
  explanation: string;
  metadata: {
    track: "english";
    chapterId: "ENG-003";
    cpId: "ENG-003-CP003";
    ruleId: ArticleRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    sourceCandidateId: string;
    semanticDomain: string;
    sceneId: string;
    reviewOnly: true;
  };
}

export interface GenerateEng003Cp003V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ArticleRuleId;
  sceneId?: string;
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function placeOptions(seed: string, correctTarget: string, distractors: readonly string[]): {
  options: string[];
  correctOptionIndex: number;
} {
  if (distractors.length !== 3) throw new Error("ENG-003 CP003 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp003-correct-position`) % 4;
  const shuffledDistractors = [...distractors];
  for (let index = shuffledDistractors.length - 1; index > 0; index -= 1) {
    const swapWith = deterministicIndex(`${seed}:eng003-cp003-distractor-shuffle:${index}`, index + 1);
    [shuffledDistractors[index], shuffledDistractors[swapWith]] = [shuffledDistractors[swapWith]!, shuffledDistractors[index]!];
  }

  const options: string[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctOptionIndex) options.push(correctTarget);
    else options.push(shuffledDistractors[distractorIndex++]!);
  }
  return { options, correctOptionIndex };
}

function teachingTail(sourceExplanation: string): string {
  const conceptIndex = sourceExplanation.indexOf("Concept:");
  if (conceptIndex < 0) {
    throw new Error("ENG-002 CP003 explanation lost the Concept section required by ENG-003 reuse");
  }
  return sourceExplanation
    .slice(conceptIndex)
    .trim()
    .replace(/\bHere:\s*/g, "Here, ");
}

function uniqueDistractors(source: ReturnType<typeof generateEng002Cp003QuestionV1>, correctTarget: string): string[] {
  const values = [
    source.targetText,
    ...source.options.slice(0, 3).filter((_, index) => index !== source.correctOptionIndex),
  ];

  const seen = new Set([correctTarget.toLowerCase()]);
  const out: string[] = [];
  for (const value of values) {
    const clean = value.replace(/\s+/g, " ").trim();
    const key = clean.toLowerCase();
    if (!clean || key === "no improvement" || seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }

  if (out.length !== 3) {
    throw new Error(`${source.questionId} could not expose three unique article/determiner distractors`);
  }
  return out;
}

export function generateEng003Cp003QuestionV1(input: GenerateEng003Cp003V1Input): Eng003Cp003QuestionV1 {
  const source = generateEng002Cp003QuestionV1({
    seed: `${input.seed}:eng003-source`,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });

  if (source.correctOptionIndex === 3) {
    throw new Error(`${source.questionId} unexpectedly keyed No improvement`);
  }

  const correctTarget = source.options[source.correctOptionIndex]!.trim();
  if (!correctTarget) throw new Error(`${source.questionId} lacks a correct article/determiner filler`);

  const blankSegments = [...source.segments];
  blankSegments[source.targetIndex] = "_____";
  const sentence = sentenceFromSegments(blankSegments);
  const distractors = uniqueDistractors(source, correctTarget);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctTarget, distractors);
  const explanation = `The blank needs “${correctTarget}”. ${teachingTail(source.explanation)}`;

  return {
    questionId: `ENG-003-CP003-V1:${source.metadata.ruleId}:${source.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP003_STEM,
    sentence,
    segments: blankSegments,
    blankIndex: source.targetIndex,
    options,
    correctOptionIndex,
    correctedSentence: source.correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-003",
      cpId: "ENG-003-CP003",
      ruleId: source.metadata.ruleId,
      mutationId: source.metadata.mutationId,
      difficulty: source.metadata.difficulty,
      dimensions: source.metadata.dimensions,
      seed: input.seed,
      sourceCandidateId: source.metadata.candidateId,
      semanticDomain: source.metadata.semanticDomain,
      sceneId: source.metadata.sceneId,
      reviewOnly: true,
    },
  };
}
