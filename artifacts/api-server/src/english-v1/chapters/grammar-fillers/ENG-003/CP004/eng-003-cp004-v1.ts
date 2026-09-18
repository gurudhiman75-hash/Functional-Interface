import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, PronounRuleId } from "../../../../core/types";
import { generateEng002Cp004QuestionV1 } from "../../../sentence-improvement/ENG-002/CP004/eng-002-cp004-v1";

export const ENG003_CP004_STEM = "Choose the most appropriate option to fill in the blank.";

export interface Eng003Cp004QuestionV1 {
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
    cpId: "ENG-003-CP004";
    ruleId: PronounRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    sourceCandidateId: string;
    semanticDomain: string;
    sceneId: string;
    slotPrefix: string;
    slotSuffix: string;
    reviewOnly: true;
  };
}

export interface GenerateEng003Cp004V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: PronounRuleId;
  sceneId?: string;
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function placeOptions(seed: string, correctTarget: string, distractors: readonly string[]) {
  if (distractors.length !== 3) throw new Error("ENG-003 CP004 requires exactly three distractors");
  const correctOptionIndex = stableHash(`${seed}:eng003-cp004-correct-position`) % 4;
  const shuffled = [...distractors];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp004-distractor-shuffle:${index}`, index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
  }
  const options: string[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctOptionIndex) options.push(correctTarget);
    else options.push(shuffled[distractorIndex++]!);
  }
  return { options, correctOptionIndex };
}

interface PronounSlot {
  prefixTokens: string[];
  suffixTokens: string[];
  extract(value: string): string;
  render(slotValue: string): string;
}

function buildPronounSlot(correctTarget: string, wrongTarget: string): PronounSlot {
  const correct = correctTarget.trim().split(/\s+/);
  const wrong = wrongTarget.trim().split(/\s+/);

  let prefixLength = 0;
  while (
    prefixLength < correct.length &&
    prefixLength < wrong.length &&
    correct[prefixLength]!.toLowerCase() === wrong[prefixLength]!.toLowerCase()
  ) prefixLength += 1;

  let suffixLength = 0;
  while (
    suffixLength < correct.length - prefixLength &&
    suffixLength < wrong.length - prefixLength &&
    correct[correct.length - 1 - suffixLength]!.toLowerCase() === wrong[wrong.length - 1 - suffixLength]!.toLowerCase()
  ) suffixLength += 1;

  const prefixTokens = correct.slice(0, prefixLength);
  const suffixTokens = suffixLength ? correct.slice(correct.length - suffixLength) : [];

  const extract = (value: string) => {
    const tokens = value.trim().split(/\s+/);
    if (tokens.length < prefixTokens.length + suffixTokens.length + 1) {
      throw new Error(`Unable to isolate pronoun slot from “${value}”`);
    }
    for (let i = 0; i < prefixTokens.length; i += 1) {
      if (tokens[i]!.toLowerCase() !== prefixTokens[i]!.toLowerCase()) {
        throw new Error(`Pronoun option “${value}” lost expected prefix “${prefixTokens.join(" ")}”`);
      }
    }
    for (let i = 0; i < suffixTokens.length; i += 1) {
      const token = tokens[tokens.length - suffixTokens.length + i]!;
      if (token.toLowerCase() !== suffixTokens[i]!.toLowerCase()) {
        throw new Error(`Pronoun option “${value}” lost expected suffix “${suffixTokens.join(" ")}”`);
      }
    }
    const end = suffixTokens.length ? tokens.length - suffixTokens.length : tokens.length;
    return tokens.slice(prefixTokens.length, end).join(" ");
  };

  const render = (slotValue: string) => [...prefixTokens, slotValue, ...suffixTokens].filter(Boolean).join(" ");
  const correctSlot = extract(correctTarget);
  const wrongSlot = extract(wrongTarget);
  if (!correctSlot || !wrongSlot || correctSlot.toLowerCase() === wrongSlot.toLowerCase()) {
    throw new Error(`Could not isolate changing pronoun in “${correctTarget}” / “${wrongTarget}”`);
  }
  return { prefixTokens, suffixTokens, extract, render };
}

function uniqueSlotDistractors(
  source: ReturnType<typeof generateEng002Cp004QuestionV1>,
  slot: PronounSlot,
  correctSlot: string,
): string[] {
  const fullValues = [
    source.targetText,
    ...source.options.slice(0, 3).filter((_, index) => index !== source.correctOptionIndex),
  ];
  const seen = new Set([correctSlot.toLowerCase()]);
  const out: string[] = [];
  for (const fullValue of fullValues) {
    const value = slot.extract(fullValue).trim();
    const key = value.toLowerCase();
    if (!value || key === "no improvement" || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  if (out.length !== 3) {
    throw new Error(`${source.questionId} could not expose three unique pronoun-slot distractors`);
  }
  return out;
}

function teachingTail(sourceExplanation: string): string {
  const tail = sourceExplanation.replace(/^Use “[^”]+” in the underlined part\.\s*/, "").trim();
  if (!tail.includes("In this sentence,") || !tail.includes("Correct sentence:")) {
    throw new Error("ENG-002 CP004 explanation lost the teaching structure required by ENG-003 reuse");
  }
  return tail;
}

export function materializeEng003Cp004AnswerV1(segments: readonly string[], blankIndex: number, answer: string): string {
  const out = [...segments];
  out[blankIndex] = out[blankIndex]!.replace("_____", answer);
  return sentenceFromSegments(out);
}

export function generateEng003Cp004QuestionV1(input: GenerateEng003Cp004V1Input): Eng003Cp004QuestionV1 {
  const source = generateEng002Cp004QuestionV1({
    seed: `${input.seed}:eng003-source`,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });

  if (source.correctOptionIndex === 3) throw new Error(`${source.questionId} unexpectedly keyed No improvement`);

  const correctTarget = source.options[source.correctOptionIndex]!.trim();
  const wrongTarget = source.targetText.trim();
  const slot = buildPronounSlot(correctTarget, wrongTarget);
  const correctSlot = slot.extract(correctTarget);
  const distractors = uniqueSlotDistractors(source, slot, correctSlot);
  const { options, correctOptionIndex } = placeOptions(input.seed, correctSlot, distractors);

  const blankSegments = [...source.segments];
  blankSegments[source.targetIndex] = slot.render("_____");
  const sentence = sentenceFromSegments(blankSegments);
  const explanation = `The blank needs “${correctSlot}”. ${teachingTail(source.explanation)}`;

  const reconstructed = materializeEng003Cp004AnswerV1(blankSegments, source.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== source.correctedSentence) {
    throw new Error(`${source.questionId} filler reconstruction drifted: ${reconstructed} !== ${source.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP004-V1:${source.metadata.ruleId}:${source.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP004_STEM,
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
      cpId: "ENG-003-CP004",
      ruleId: source.metadata.ruleId,
      mutationId: source.metadata.mutationId,
      difficulty: source.metadata.difficulty,
      dimensions: source.metadata.dimensions,
      seed: input.seed,
      sourceCandidateId: source.metadata.candidateId,
      semanticDomain: source.metadata.semanticDomain,
      sceneId: source.metadata.sceneId,
      slotPrefix: slot.prefixTokens.join(" "),
      slotSuffix: slot.suffixTokens.join(" "),
      reviewOnly: true,
    },
  };
}
