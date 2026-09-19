import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import type { VoiceNarrationRuleId } from "../../../../grammar/voice-narration";
import { generateEng002Cp012CuratedQuestionV1 } from "../../../sentence-improvement/ENG-002/CP012/eng-002-cp012-curated-v1";

export const ENG003_CP012_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp012QuestionV1 {
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
    cpId: "ENG-003-CP012";
    ruleId: VoiceNarrationRuleId;
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

export interface GenerateEng003Cp012V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: VoiceNarrationRuleId;
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
  if (distractors.length !== 3) throw new Error("ENG-003 CP012 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp012-correct-position`) % 4;
  const shuffled = [...distractors];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp012-distractor-shuffle:${index}`, index + 1);
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

const SIMPLE_CONCEPT: Readonly<Record<VoiceNarrationRuleId, string>> = Object.freeze({
  "GR-VNR-001": "In the passive voice, use a form of 'be' followed by the past participle.",
  "GR-VNR-002": "A passive sentence must keep the correct tense through its helping verbs.",
  "GR-VNR-003": "Verbs such as 'arrive', 'occur', 'belong' and 'consist' do not normally form this passive pattern.",
  "GR-VNR-004": "With a modal, the passive form is usually 'modal + be + past participle'.",
  "GR-VNR-005": "When the object becomes the passive subject, do not repeat the same object pronoun unnecessarily.",
  "GR-VNR-006": "In reported speech, the tense often moves back when the reporting verb is in the past.",
  "GR-VNR-007": "Pronouns in reported speech must match the speaker and the person being spoken about.",
  "GR-VNR-008": "Time and place words may change in reported speech when the reporting point changes.",
  "GR-VNR-009": "Reported questions use statement word order; yes/no questions use 'if' or 'whether'.",
  "GR-VNR-010": "Commands and requests are commonly reported with an object followed by 'to + verb'.",
  "GR-VNR-011": "A universal truth normally stays in the present tense in reported speech.",
  "GR-VNR-012": "Reporting verbs take different patterns: 'tell/inform + person', 'say + that', and 'explain + to + person'.",
});

function simpleApplication(ruleId: VoiceNarrationRuleId, answer: string) {
  switch (ruleId) {
    case "GR-VNR-001": return `Here, “${answer}” gives the correct passive verb form.`;
    case "GR-VNR-002": return `Here, “${answer}” keeps the required passive tense and aspect.`;
    case "GR-VNR-003": return `Here, “${answer}” avoids an incorrect passive with an intransitive verb.`;
    case "GR-VNR-004": return `Here, “${answer}” gives the correct modal-passive form.`;
    case "GR-VNR-005": return `Here, “${answer}” avoids repeating the same object after it has become the subject.`;
    case "GR-VNR-006": return `Here, “${answer}” gives the required tense in reported speech.`;
    case "GR-VNR-007": return `Here, “${answer}” gives the correct pronoun reference.`;
    case "GR-VNR-008": return `Here, “${answer}” gives the correct time or place reference.`;
    case "GR-VNR-009": return `Here, “${answer}” gives the correct reported-question structure.`;
    case "GR-VNR-010": return `Here, “${answer}” gives the correct reported command or request.`;
    case "GR-VNR-011": return `Here, “${answer}” keeps the universal truth in the present tense.`;
    case "GR-VNR-012": return `Here, “${answer}” uses the reporting verb with the correct complement pattern.`;
  }
}

export function materializeEng003Cp012AnswerV1(segments: readonly string[], blankIndex: number, answer: string) {
  const out = [...segments];
  out[blankIndex] = out[blankIndex]!.replace("_____", answer);
  return sentenceFromSegments(out);
}

export function generateEng003Cp012QuestionV1(input: GenerateEng003Cp012V1Input): Eng003Cp012QuestionV1 {
  const sourceSeed = `${input.seed}:eng003-source`;
  const correction = generateEng002Cp012CuratedQuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });
  const distractorSource = generateEng002Cp012CuratedQuestionV1({
    seed: sourceSeed,
    difficulty: input.difficulty,
    ruleId: correction.metadata.ruleId,
    sceneId: correction.metadata.sceneId,
    noImprovement: true,
  });

  if (correction.correctOptionIndex === 3) throw new Error(`${correction.questionId} unexpectedly keyed No improvement`);
  if (distractorSource.correctOptionIndex !== 3) throw new Error(`${distractorSource.questionId} did not expose curated distractors`);
  if (correction.targetIndex !== distractorSource.targetIndex) throw new Error("ENG-003 CP012 source target alignment drifted");

  const correctTarget = correction.options[correction.correctOptionIndex]!.trim();
  const distractors = distractorSource.options.slice(0, 3).map((value) => value.trim());
  const keys = new Set([correctTarget.toLowerCase(), ...distractors.map((value) => value.toLowerCase())]);
  if (keys.size !== 4) throw new Error(`${correction.questionId} does not provide four unique voice/narration choices`);

  const factored = factorSharedChoiceContext([correctTarget, ...distractors]);
  const [correctChoice, ...distractorChoices] = factored.cores;
  if (!correctChoice || distractorChoices.length !== 3) throw new Error(`${correction.questionId} lost its factored choices`);

  const blankSegments = [...correction.segments];
  const punctuation = trailingPunctuation(blankSegments[correction.targetIndex]!);
  blankSegments[correction.targetIndex] = blankSurface(factored.prefix, factored.suffix, punctuation);
  const sentence = sentenceFromSegments(blankSegments);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctChoice, distractorChoices);
  const reconstructed = materializeEng003Cp012AnswerV1(blankSegments, correction.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== correction.correctedSentence) {
    throw new Error(`${correction.questionId} filler reconstruction drifted: ${reconstructed} !== ${correction.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP012-V1:${correction.metadata.ruleId}:${correction.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP012_STEM,
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
      cpId: "ENG-003-CP012",
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
