import { deterministicIndex } from "../../../../core/deterministic";
import type { ComparisonRuleId, DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { generateEng002Cp006QuestionV1 } from "../../../sentence-improvement/ENG-002/CP006/eng-002-cp006-v1";

export const ENG003_CP006_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp006QuestionV1 {
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
    cpId: "ENG-003-CP006";
    ruleId: ComparisonRuleId;
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

export interface GenerateEng003Cp006V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ComparisonRuleId;
  sceneId?: string;
}

const sentenceFromSegments = (segments: readonly string[]) =>
  segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function placeOptions(seed: string, correct: string, distractors: readonly string[]) {
  if (distractors.length !== 3) throw new Error("ENG-003 CP006 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp006-correct-position`) % 4;
  const shuffled = [...distractors];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp006-distractor-shuffle:${index}`, index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
  }
  const options: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === correctOptionIndex ? correct : shuffled[wrong++]!);
  }
  return { options, correctOptionIndex };
}

function teachingTail(explanation: string) {
  const index = explanation.indexOf("Concept:");
  if (index < 0) throw new Error("ENG-002 CP006 explanation lost its Concept section");
  return explanation.slice(index).trim().replace(/\bHere:\s*/g, "Here, ");
}

export function materializeEng003Cp006AnswerV1(
  segments: readonly string[],
  blankIndex: number,
  answer: string,
) {
  const out = [...segments];
  out[blankIndex] = answer;
  return sentenceFromSegments(out);
}

export function generateEng003Cp006QuestionV1(input: GenerateEng003Cp006V1Input): Eng003Cp006QuestionV1 {
  const sourceSeed = `${input.seed}:eng003-source`;
  const correction = generateEng002Cp006QuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });
  const distractorSource = generateEng002Cp006QuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: correction.metadata.ruleId,
    sceneId: correction.metadata.sceneId,
    noImprovement: true,
  });

  if (correction.correctOptionIndex === 3) throw new Error(`${correction.questionId} unexpectedly keyed No improvement`);
  if (distractorSource.correctOptionIndex !== 3) throw new Error(`${distractorSource.questionId} did not expose the approved wrong-form pool`);
  if (correction.targetIndex !== distractorSource.targetIndex) throw new Error("ENG-003 CP006 source target alignment drifted");

  const correctTarget = correction.options[correction.correctOptionIndex]!.trim();
  const distractors = distractorSource.options.slice(0, 3).map((value) => value.trim());
  const keys = new Set([correctTarget.toLowerCase(), ...distractors.map((value) => value.toLowerCase())]);
  if (keys.size !== 4) throw new Error(`${correction.questionId} does not provide four unique comparison choices`);

  const blankSegments = [...correction.segments];
  blankSegments[correction.targetIndex] = "_____";
  const sentence = sentenceFromSegments(blankSegments);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctTarget, distractors);
  const reconstructed = materializeEng003Cp006AnswerV1(blankSegments, correction.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== correction.correctedSentence) {
    throw new Error(`${correction.questionId} filler reconstruction drifted: ${reconstructed} !== ${correction.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP006-V1:${correction.metadata.ruleId}:${correction.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP006_STEM,
    sentence,
    segments: blankSegments,
    blankIndex: correction.targetIndex,
    options,
    correctOptionIndex,
    correctedSentence: correction.correctedSentence,
    explanation: `The blank needs “${correctTarget}”. ${teachingTail(correction.explanation)}`,
    metadata: {
      track: "english",
      chapterId: "ENG-003",
      cpId: "ENG-003-CP006",
      ruleId: correction.metadata.ruleId,
      mutationId: correction.metadata.mutationId,
      difficulty: correction.metadata.difficulty,
      dimensions: correction.metadata.dimensions,
      seed: input.seed,
      sourceCandidateId: correction.metadata.candidateId,
      semanticDomain: correction.metadata.semanticDomain,
      sceneId: correction.metadata.sceneId,
      reviewOnly: true,
    },
  };
}
