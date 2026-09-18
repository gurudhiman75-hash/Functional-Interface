import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import type { ModifierRuleId } from "../../../../grammar/modifiers";
import { generateEng002Cp010QuestionV1 } from "../../../sentence-improvement/ENG-002/CP010/eng-002-cp010-v1";

export const ENG003_CP010_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp010QuestionV1 {
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
    cpId: "ENG-003-CP010";
    ruleId: ModifierRuleId;
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

export interface GenerateEng003Cp010V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ModifierRuleId;
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

function unique(values: readonly string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.replace(/\s+/g, " ").trim();
    const key = value.toLowerCase();
    if (value && !seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  }
  return out;
}

function placeOptions(seed: string, correct: string, distractors: readonly string[]) {
  if (distractors.length !== 3) throw new Error("ENG-003 CP010 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp010-correct-position`) % 4;
  const shuffled = [...distractors];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp010-distractor-shuffle:${index}`, index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
  }
  const options: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) options.push(index === correctOptionIndex ? correct : shuffled[wrong++]!);
  return { options, correctOptionIndex };
}

function teachingTail(explanation: string) {
  const index = explanation.indexOf("Concept:");
  if (index < 0) throw new Error("ENG-002 CP010 explanation lost its Concept section");
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

function moveEvenBeforePerfectAuxiliary(text: string) {
  const match = text.match(/\beven\b/i)?.[0];
  if (!match) return text;
  const bare = text.replace(/\beven\b/i, "").replace(/\s+/g, " ").trim();
  return bare.replace(/\b(had|has|have)\b/i, `${match.toLowerCase()} $1`);
}

function distractorsForModifier007(
  correctTarget: string,
  correctionOptions: readonly string[],
  targetText: string,
) {
  const fromCorrection = correctionOptions
    .filter((value) => value.toLowerCase() !== "no improvement")
    .filter((value) => value.toLowerCase() !== correctTarget.toLowerCase());
  const derived = moveEvenBeforePerfectAuxiliary(targetText);
  const values = unique([...fromCorrection, targetText, derived])
    .filter((value) => value.toLowerCase() !== correctTarget.toLowerCase());
  if (values.length < 3) throw new Error(`GR-MOD-007 has only ${values.length} safe filler distractors`);
  return values.slice(0, 3);
}

export function materializeEng003Cp010AnswerV1(segments: readonly string[], blankIndex: number, answer: string) {
  const out = [...segments];
  out[blankIndex] = out[blankIndex]!.replace("_____", answer);
  return sentenceFromSegments(out);
}

export function generateEng003Cp010QuestionV1(input: GenerateEng003Cp010V1Input): Eng003Cp010QuestionV1 {
  const sourceSeed = `${input.seed}:eng003-source`;
  const correction = generateEng002Cp010QuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });

  if (correction.correctOptionIndex === 3) throw new Error(`${correction.questionId} unexpectedly keyed No improvement`);
  const correctTarget = correction.options[correction.correctOptionIndex]!.trim();

  let distractors: string[];
  if (correction.metadata.ruleId === "GR-MOD-007") {
    distractors = distractorsForModifier007(correctTarget, correction.options, correction.targetText);
  } else {
    const distractorSource = generateEng002Cp010QuestionV1({
      seed: sourceSeed,
      difficulty: input.difficulty,
      ruleId: correction.metadata.ruleId,
      sceneId: correction.metadata.sceneId,
      noImprovement: true,
    });
    if (distractorSource.correctOptionIndex !== 3) throw new Error(`${distractorSource.questionId} did not expose approved distractors`);
    if (correction.targetIndex !== distractorSource.targetIndex) throw new Error("ENG-003 CP010 source target alignment drifted");
    distractors = distractorSource.options.slice(0, 3).map((value) => value.trim());
  }

  const keys = new Set([correctTarget.toLowerCase(), ...distractors.map((value) => value.toLowerCase())]);
  if (keys.size !== 4) throw new Error(`${correction.questionId} does not provide four unique modifier choices`);

  const factored = factorSharedChoiceContext([correctTarget, ...distractors]);
  const [correctChoice, ...distractorChoices] = factored.cores;
  if (!correctChoice || distractorChoices.length !== 3) throw new Error(`${correction.questionId} lost its factored choices`);

  const blankSegments = [...correction.segments];
  blankSegments[correction.targetIndex] = blankSurface(factored.prefix, factored.suffix);
  const sentence = sentenceFromSegments(blankSegments);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctChoice, distractorChoices);
  const reconstructed = materializeEng003Cp010AnswerV1(blankSegments, correction.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== correction.correctedSentence) {
    throw new Error(`${correction.questionId} filler reconstruction drifted: ${reconstructed} !== ${correction.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP010-V1:${correction.metadata.ruleId}:${correction.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP010_STEM,
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
      cpId: "ENG-003-CP010",
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
