import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, GerundInfinitiveParticipleRuleId } from "../../../../core/types";
import { generateEng002Cp009QuestionV1 } from "../../../sentence-improvement/ENG-002/CP009/eng-002-cp009-v1";

export const ENG003_CP009_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp009QuestionV1 {
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
    cpId: "ENG-003-CP009";
    ruleId: GerundInfinitiveParticipleRuleId;
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

export interface GenerateEng003Cp009V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: GerundInfinitiveParticipleRuleId;
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
  if (distractors.length !== 3) throw new Error("ENG-003 CP009 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp009-correct-position`) % 4;
  const shuffled = [...distractors];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp009-distractor-shuffle:${index}`, index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
  }
  const options: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) options.push(index === correctOptionIndex ? correct : shuffled[wrong++]!);
  return { options, correctOptionIndex };
}

function teachingTail(explanation: string) {
  const index = explanation.indexOf("Concept:");
  if (index < 0) throw new Error("ENG-002 CP009 explanation lost its Concept section");
  return explanation.slice(index).trim().replace(/\bHere:\s*/g, "Here, ");
}

function factorSharedChoiceContext(values: readonly string[]) {
  const tokenized = values.map((value) => value.trim().split(/\s+/));
  let prefix = 0;
  while (tokenized.every((tokens) => tokens[prefix] && tokens[prefix]!.toLowerCase() === tokenized[0]![prefix]!.toLowerCase())) prefix += 1;

  let suffix = 0;
  while (tokenized.every((tokens) => {
    const index = tokens.length - 1 - suffix;
    const firstIndex = tokenized[0]!.length - 1 - suffix;
    return index >= prefix && firstIndex >= prefix && tokens[index]!.toLowerCase() === tokenized[0]![firstIndex]!.toLowerCase();
  })) suffix += 1;

  const minLength = Math.min(...tokenized.map((tokens) => tokens.length));
  while (prefix + suffix >= minLength && suffix > 0) suffix -= 1;
  while (prefix + suffix >= minLength && prefix > 0) prefix -= 1;

  const cores = tokenized.map((tokens) => tokens.slice(prefix, tokens.length - suffix).join(" ").trim());
  if (cores.some((core) => !core) || new Set(cores.map((core) => core.toLowerCase())).size !== values.length) {
    return { prefix: "", suffix: "", cores: [...values] };
  }
  return {
    prefix: tokenized[0]!.slice(0, prefix).join(" "),
    suffix: suffix ? tokenized[0]!.slice(tokenized[0]!.length - suffix).join(" ") : "",
    cores,
  };
}

function blankSurface(prefix: string, suffix: string) {
  return [prefix, "_____", suffix].filter(Boolean).join(" ");
}

export function materializeEng003Cp009AnswerV1(segments: readonly string[], blankIndex: number, answer: string) {
  const out = [...segments];
  out[blankIndex] = out[blankIndex]!.replace("_____", answer);
  return sentenceFromSegments(out);
}

export function generateEng003Cp009QuestionV1(input: GenerateEng003Cp009V1Input): Eng003Cp009QuestionV1 {
  const sourceSeed = `${input.seed}:eng003-source`;
  const correction = generateEng002Cp009QuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });
  const distractorSource = generateEng002Cp009QuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: correction.metadata.ruleId,
    sceneId: correction.metadata.sceneId,
    noImprovement: true,
  });

  if (correction.correctOptionIndex === 3) throw new Error(`${correction.questionId} unexpectedly keyed No improvement`);
  if (distractorSource.correctOptionIndex !== 3) throw new Error(`${distractorSource.questionId} did not expose approved distractors`);
  if (correction.targetIndex !== distractorSource.targetIndex) throw new Error("ENG-003 CP009 source target alignment drifted");

  const correctTarget = correction.options[correction.correctOptionIndex]!.trim();
  const distractors = distractorSource.options.slice(0, 3).map((value) => value.trim());
  const keys = new Set([correctTarget.toLowerCase(), ...distractors.map((value) => value.toLowerCase())]);
  if (keys.size !== 4) throw new Error(`${correction.questionId} does not provide four unique non-finite choices`);

  const factored = factorSharedChoiceContext([correctTarget, ...distractors]);
  const [correctChoice, ...distractorChoices] = factored.cores;
  if (!correctChoice || distractorChoices.length !== 3) throw new Error(`${correction.questionId} lost its factored choices`);

  const blankSegments = [...correction.segments];
  blankSegments[correction.targetIndex] = blankSurface(factored.prefix, factored.suffix);
  const sentence = sentenceFromSegments(blankSegments);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctChoice, distractorChoices);
  const reconstructed = materializeEng003Cp009AnswerV1(blankSegments, correction.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== correction.correctedSentence) {
    throw new Error(`${correction.questionId} filler reconstruction drifted: ${reconstructed} !== ${correction.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP009-V1:${correction.metadata.ruleId}:${correction.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP009_STEM,
    sentence,
    segments: blankSegments,
    blankIndex: correction.targetIndex,
    options,
    correctOptionIndex,
    correctedSentence: correction.correctedSentence,
    explanation: `The blank needs “${correctChoice}”. ${teachingTail(correction.explanation)}`,
    metadata: {
      track: "english",
      chapterId: "ENG-003",
      cpId: "ENG-003-CP009",
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
