import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import type { IdiomaticUsageRuleId } from "../../../../grammar/idiomatic-usage";
import { generateEng002Cp013QuestionV1 } from "../../../sentence-improvement/ENG-002/CP013/eng-002-cp013-v1";

export const ENG003_CP013_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp013QuestionV1 {
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
    cpId: "ENG-003-CP013";
    ruleId: IdiomaticUsageRuleId;
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

export interface GenerateEng003Cp013V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: IdiomaticUsageRuleId;
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
  if (distractors.length !== 3) throw new Error("ENG-003 CP013 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp013-correct-position`) % 4;
  const shuffled = [...distractors];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp013-distractor-shuffle:${index}`, index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
  }
  const options: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) options.push(index === correctOptionIndex ? correct : shuffled[wrong++]!);
  return { options, correctOptionIndex };
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

function trailingPunctuation(value: string) {
  return value.match(/([,.;:!?]+)$/)?.[1] ?? "";
}
function blankSurface(prefix: string, suffix: string, punctuation: string) {
  return `${[prefix, "_____", suffix].filter(Boolean).join(" ")}${punctuation}`;
}

function findContrastFocus(value: string) {
  const match = /\b(?:Despite|In spite of)\b/i.exec(value);
  if (!match || match.index == null) throw new Error(`GR-USG-007 could not find a contrast phrase in ${value}`);
  const correct = match[0]!;
  const upper = /^[A-Z]/.test(correct);
  const cap = (text: string) => upper ? text.replace(/^./, (ch) => ch.toUpperCase()) : text.toLowerCase();
  const distractors = /^in spite of$/i.test(correct)
    ? [cap("in spite"), cap("despite of"), cap("in despite of")]
    : [cap("despite of"), cap("in despite of"), cap("despite to")];
  return { correct, distractors, index: match.index };
}

const SIMPLE_CONCEPT: Readonly<Record<IdiomaticUsageRuleId, string>> = Object.freeze({
  "GR-USG-001": "Use 'prefer X to Y' when directly comparing two nouns or two -ing activities.",
  "GR-USG-002": "Use 'senior to' and 'junior to' when comparing rank or position.",
  "GR-USG-003": "For this exam pattern, use 'different from'.",
  "GR-USG-004": "Use 'capable of' before a noun or an -ing form.",
  "GR-USG-005": "Use 'insist on' before a noun or an -ing activity.",
  "GR-USG-006": "Use 'prevent + object + from + -ing'.",
  "GR-USG-007": "Use 'despite + noun/-ing' or 'in spite of + noun/-ing'.",
  "GR-USG-008": "The standard pair is 'no sooner ... than'.",
  "GR-USG-009": "The standard pair is 'hardly/scarcely ... when'.",
});

function simpleApplication(ruleId: IdiomaticUsageRuleId, answer: string) {
  switch (ruleId) {
    case "GR-USG-001": return `Here, “${answer}” correctly links the two things being compared.`;
    case "GR-USG-002": return `Here, “${answer}” is the correct preposition after the rank word.`;
    case "GR-USG-003": return `Here, “${answer}” gives the exam-standard form used in this checkpoint.`;
    case "GR-USG-004": return `Here, “${answer}” completes the fixed pattern with 'capable'.`;
    case "GR-USG-005": return `Here, “${answer}” completes the fixed pattern with 'insist'.`;
    case "GR-USG-006": return `Here, “${answer}” gives the correct pattern after 'prevent'.`;
    case "GR-USG-007": return `Here, “${answer}” gives the correct contrast expression before the noun/-ing phrase.`;
    case "GR-USG-008": return `Here, “${answer}” correctly completes the 'no sooner' pair.`;
    case "GR-USG-009": return `Here, “${answer}” correctly completes the 'hardly/scarcely' pair.`;
  }
}

export function materializeEng003Cp013AnswerV1(segments: readonly string[], blankIndex: number, answer: string) {
  const out = [...segments];
  out[blankIndex] = out[blankIndex]!.replace("_____", answer);
  return sentenceFromSegments(out);
}

export function generateEng003Cp013QuestionV1(input: GenerateEng003Cp013V1Input): Eng003Cp013QuestionV1 {
  const sourceSeed = `${input.seed}:eng003-source`;
  const selected = generateEng002Cp013QuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });
  const pinned = {
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: selected.metadata.ruleId,
    sceneId: selected.metadata.sceneId,
  } as const;
  const correction = generateEng002Cp013QuestionV1({ ...pinned, noImprovement: false });
  const distractorSource = generateEng002Cp013QuestionV1({ ...pinned, noImprovement: true });

  if (correction.correctOptionIndex === 3) throw new Error(`${correction.questionId} unexpectedly keyed No improvement`);
  if (distractorSource.correctOptionIndex !== 3) throw new Error(`${distractorSource.questionId} did not expose approved distractors`);
  if (correction.targetIndex !== distractorSource.targetIndex) throw new Error("ENG-003 CP013 source target alignment drifted");

  const correctTarget = correction.options[correction.correctOptionIndex]!.trim();
  const distractors = distractorSource.options.slice(0, 3).map((value) => value.trim());
  const keys = new Set([correctTarget.toLowerCase(), ...distractors.map((value) => value.toLowerCase())]);
  if (keys.size !== 4) throw new Error(`${correction.questionId} does not provide four unique usage choices`);

  let correctChoice: string;
  let distractorChoices: string[];
  let blankSegments = [...correction.segments];

  if (correction.metadata.ruleId === "GR-USG-007") {
    blankSegments = [...distractorSource.segments];
    const current = blankSegments[correction.targetIndex]!;
    const punctuation = trailingPunctuation(current);
    const body = current.replace(/([,.;:!?]+)$/, "");
    const focus = findContrastFocus(body);
    correctChoice = focus.correct;
    distractorChoices = focus.distractors;
    const before = body.slice(0, focus.index);
    const after = body.slice(focus.index + focus.correct.length);
    blankSegments[correction.targetIndex] = `${before}_____${after}${punctuation}`.replace(/\s+/g, " ").trim();
  } else {
    const factored = factorSharedChoiceContext([correctTarget, ...distractors]);
    [correctChoice, ...distractorChoices] = factored.cores;
    if (!correctChoice || distractorChoices.length !== 3) throw new Error(`${correction.questionId} lost its factored choices`);
    const punctuation = trailingPunctuation(blankSegments[correction.targetIndex]!);
    blankSegments[correction.targetIndex] = blankSurface(factored.prefix, factored.suffix, punctuation);
  }

  const sentence = sentenceFromSegments(blankSegments);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctChoice, distractorChoices);
  const reconstructed = materializeEng003Cp013AnswerV1(blankSegments, correction.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== correction.correctedSentence) {
    throw new Error(`${correction.questionId} filler reconstruction drifted: ${reconstructed} !== ${correction.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP013-V1:${correction.metadata.ruleId}:${correction.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP013_STEM,
    sentence,
    segments: blankSegments,
    blankIndex: correction.targetIndex,
    options,
    correctOptionIndex,
    correctedSentence: correction.correctedSentence,
    explanation: `The blank needs “${correctChoice}”. Concept: ${SIMPLE_CONCEPT[correction.metadata.ruleId]} ${simpleApplication(correction.metadata.ruleId, correctChoice)} Correct sentence: ${correction.correctedSentence}`,
    metadata: {
      track: "english",
      chapterId: "ENG-003",
      cpId: "ENG-003-CP013",
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
