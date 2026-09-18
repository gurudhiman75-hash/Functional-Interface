import { deterministicIndex } from "../../../../core/deterministic";
import type { ArticleRuleId, DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { generateEng002Cp003QuestionV1 } from "../../../sentence-improvement/ENG-002/CP003/eng-002-cp003-v1";

export const ENG003_CP003_STEM = "Choose the most appropriate option to fill in the blank.";
export const ENG003_CP003_NO_ARTICLE_OPTION = "No article";

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
    blankBody: string;
    reviewOnly: true;
  };
}

export interface GenerateEng003Cp003V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ArticleRuleId;
  sceneId?: string;
}

const DETERMINERS = [
  "a few", "a little", "the", "an", "a", "many", "much", "few", "little", "each", "every", "several",
] as const;

function sentenceFromSegments(segments: readonly string[]): string {
  return segments
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDeterminerPhrase(text: string): { determiner: string; body: string } {
  const clean = text.replace(/\s+/g, " ").trim();
  for (const determiner of DETERMINERS) {
    const prefix = `${determiner} `;
    if (clean.toLowerCase().startsWith(prefix)) {
      return { determiner, body: clean.slice(prefix.length).trim() };
    }
  }
  return { determiner: ENG003_CP003_NO_ARTICLE_OPTION, body: clean };
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

function determinerDistractors(ruleId: ArticleRuleId, correct: string): string[] {
  if (ruleId === "GR-ART-009") {
    return ["many", "few", "a few"].includes(correct)
      ? ["much", "little", "a little"]
      : ["many", "few", "a few"];
  }

  if (ruleId === "GR-ART-010") {
    if (correct === "several") return ["each", "every", "much"];
    if (correct === "each") return ["several", "many", "much"];
    if (correct === "every") return ["several", "many", "much"];
    throw new Error(`Unexpected GR-ART-010 determiner “${correct}”`);
  }

  if (["GR-ART-001", "GR-ART-002", "GR-ART-006"].includes(ruleId)) {
    if (correct === "a") return ["an", ENG003_CP003_NO_ARTICLE_OPTION, "many"];
    if (correct === "an") return ["a", ENG003_CP003_NO_ARTICLE_OPTION, "many"];
  }

  const articleSet = ["a", "an", "the", ENG003_CP003_NO_ARTICLE_OPTION];
  const distractors = articleSet.filter((value) => value !== correct);
  if (distractors.length !== 3) {
    throw new Error(`${ruleId} has unsupported article/determiner answer “${correct}”`);
  }
  return distractors;
}

function normalizeApplication(application: string): string {
  let clean = application
    .trim()
    .replace(/\s+here(?=[,.])/gi, "")
    .replace(/\s+here\.$/i, ".");
  if (!/^[A-Z]{2,}\b/.test(clean) && /^[A-Z]/.test(clean)) {
    clean = clean.slice(0, 1).toLowerCase() + clean.slice(1);
  }
  return clean;
}

function teachingTail(sourceExplanation: string): string {
  const conceptMarker = "Concept:";
  const hereMarker = "Here:";
  const correctMarker = "Correct sentence:";
  const conceptIndex = sourceExplanation.indexOf(conceptMarker);
  const hereIndex = sourceExplanation.indexOf(hereMarker);
  const correctIndex = sourceExplanation.indexOf(correctMarker);
  if (conceptIndex < 0 || hereIndex < 0 || correctIndex < 0 || !(conceptIndex < hereIndex && hereIndex < correctIndex)) {
    throw new Error("ENG-002 CP003 explanation lost the teaching sections required by ENG-003 reuse");
  }

  const concept = sourceExplanation.slice(conceptIndex + conceptMarker.length, hereIndex).trim();
  const application = normalizeApplication(sourceExplanation.slice(hereIndex + hereMarker.length, correctIndex));
  const correctSentence = sourceExplanation.slice(correctIndex + correctMarker.length).trim();
  return `Concept: ${concept} Here, ${application} Correct sentence: ${correctSentence}`;
}

export function materializeEng003Cp003AnswerV1(sentence: string, option: string): string {
  const filler = option === ENG003_CP003_NO_ARTICLE_OPTION ? "" : option;
  const materialized = sentence
    .replace("_____", filler)
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (sentence.trimStart().startsWith("_____") && filler) {
    return materialized.slice(0, 1).toUpperCase() + materialized.slice(1);
  }
  return materialized;
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

  const correctPhrase = source.options[source.correctOptionIndex]!.trim();
  const parsed = parseDeterminerPhrase(correctPhrase);
  if (!parsed.body) throw new Error(`${source.questionId} lost the noun phrase after its determiner`);

  const blankSegments = [...source.segments];
  blankSegments[source.targetIndex] = `_____ ${parsed.body}`;
  const sentence = sentenceFromSegments(blankSegments);
  const distractors = determinerDistractors(source.metadata.ruleId, parsed.determiner);
  const { options, correctOptionIndex } = placeOptions(input.seed, parsed.determiner, distractors);
  const explanation = `The blank needs “${parsed.determiner}”. ${teachingTail(source.explanation)}`;

  const reconstructed = materializeEng003Cp003AnswerV1(sentence, options[correctOptionIndex]!);
  if (reconstructed !== source.correctedSentence) {
    throw new Error(`${source.questionId} filler reconstruction drifted: ${reconstructed} !== ${source.correctedSentence}`);
  }

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
      blankBody: parsed.body,
      reviewOnly: true,
    },
  };
}
