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
  return explanation
    .slice(index)
    .trim()
    .replace(/\bHere:\s*/g, "Here, ")
    .replace(/\bis a linking verb here\b/gi, "is a linking verb");
}

function withLeadingCase(value: string, model: string) {
  return /^[A-Z]/.test(model) ? value.slice(0, 1).toUpperCase() + value.slice(1) : value;
}

function refinedDistractors(ruleId: ComparisonRuleId, correctTarget: string, approved: readonly string[]): string[] {
  const lower = correctTarget.toLowerCase();
  const exact: Readonly<Record<string, readonly string[]>> = {
    fastest: ["most fastest", "faster", "fast"],
    highest: ["most highest", "higher", "high"],
    lowest: ["most lowest", "lower", "low"],
    least: ["most least", "less", "little"],
    "the smallest": ["smallest", "the smaller", "a smaller"],
    "the busiest": ["busiest", "the busier", "a busier"],
    "the clearest": ["clearest", "the clearer", "a clearer"],
    "the most": ["most", "the more", "a more"],
  };

  const replacements = exact[lower];
  const values = replacements
    ? replacements.map((value) => withLeadingCase(value, correctTarget))
    : [...approved];
  const unique = [...new Map(values.map((value) => [value.toLowerCase(), value])).values()]
    .filter((value) => value.toLowerCase() !== lower);
  if (unique.length < 3) return [...approved];
  return unique.slice(0, 3);
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
  const approvedDistractors = distractorSource.options.slice(0, 3).map((value) => value.trim());
  const distractors = refinedDistractors(correction.metadata.ruleId, correctTarget, approvedDistractors);
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
