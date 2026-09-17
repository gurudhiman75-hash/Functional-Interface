import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, SvaRuleId } from "../../../../core/types";
import { generateEng002Cp001QuestionV1 } from "../../../sentence-improvement/ENG-002/CP001/eng-002-cp001-v1";

export const ENG003_CP001_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp001QuestionV1 {
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
    cpId: "ENG-003-CP001";
    ruleId: SvaRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    sourceCandidateId: string;
    semanticDomain: string;
    reviewOnly: true;
  };
}

export interface GenerateEng003Cp001V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: SvaRuleId;
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function insertAgreementPreservingAdverb(phrase: string, adverb: string): string {
  const words = phrase.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return phrase;
  const first = words[0]!.toLowerCase();
  const auxiliaries = new Set([
    "am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did",
    "can", "could", "will", "would", "shall", "should", "may", "might", "must",
  ]);
  if (auxiliaries.has(first)) return [words[0], adverb, ...words.slice(1)].join(" ");
  return `${adverb} ${phrase.trim()}`;
}

function buildDistractors(wrongTarget: string, correctTarget: string): string[] {
  const first = wrongTarget.trim().toLowerCase().split(/\s+/)[0] ?? "";
  const adverbs = ["has", "have", "had"].includes(first)
    ? ["already", "often"]
    : ["still", "usually"];
  const candidates = [
    wrongTarget.trim(),
    insertAgreementPreservingAdverb(wrongTarget, adverbs[0]!),
    insertAgreementPreservingAdverb(wrongTarget, adverbs[1]!),
  ];
  const seen = new Set([correctTarget.trim().toLowerCase()]);
  const out: string[] = [];
  for (const candidate of candidates) {
    const clean = candidate.trim();
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  if (out.length !== 3) throw new Error(`Could not construct three unique SVA distractors from “${wrongTarget}”`);
  return out;
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
  const correctOptionIndex = stableHash(`${seed}:eng003-correct-position`) % 4;
  const shuffledDistractors = [...distractors];
  for (let index = shuffledDistractors.length - 1; index > 0; index -= 1) {
    const swapWith = deterministicIndex(`${seed}:eng003-distractor-shuffle:${index}`, index + 1);
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
  if (conceptIndex < 0) throw new Error("ENG-002 CP001 explanation lost the Concept section required by ENG-003 reuse");
  return sourceExplanation.slice(conceptIndex).trim();
}

export function generateEng003Cp001QuestionV1(input: GenerateEng003Cp001V1Input): Eng003Cp001QuestionV1 {
  const source = generateEng002Cp001QuestionV1({
    seed: `${input.seed}:eng003-source`,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    noImprovement: false,
  });

  if (source.correctOptionIndex === 3) throw new Error(`${source.questionId} unexpectedly keyed No improvement`);
  const correctTarget = source.options[source.correctOptionIndex]!.trim();
  const wrongTarget = source.targetText.trim();
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) {
    throw new Error(`${source.questionId} does not expose a valid fill-in-the-blank pair`);
  }

  const blankSegments = [...source.segments];
  blankSegments[source.targetIndex] = "_____";
  const sentence = sentenceFromSegments(blankSegments);
  const distractors = buildDistractors(wrongTarget, correctTarget);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctTarget, distractors);

  const explanation = `The blank needs “${correctTarget}”. ${teachingTail(source.explanation)}`;

  return {
    questionId: `ENG-003-CP001-V1:${source.metadata.ruleId}:${source.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP001_STEM,
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
      cpId: "ENG-003-CP001",
      ruleId: source.metadata.ruleId,
      mutationId: source.metadata.mutationId,
      difficulty: source.metadata.difficulty,
      dimensions: source.metadata.dimensions,
      seed: input.seed,
      sourceCandidateId: source.metadata.candidateId,
      semanticDomain: source.metadata.semanticDomain,
      reviewOnly: true,
    },
  };
}
