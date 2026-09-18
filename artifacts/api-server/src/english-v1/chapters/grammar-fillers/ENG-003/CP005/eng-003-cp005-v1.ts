import { deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, PrepositionRuleId } from "../../../../core/types";
import { generateEng002Cp005QuestionV1 } from "../../../sentence-improvement/ENG-002/CP005/eng-002-cp005-v1";

export const ENG003_CP005_STEM = "Choose the most appropriate option to fill in the blank.";

const ALT: Readonly<Record<PrepositionRuleId, readonly string[]>> = {
  "GR-PRP-001": ["at", "on", "in", "during", "from"],
  "GR-PRP-002": ["at", "on", "in", "into", "over"],
  "GR-PRP-003": ["since", "for", "from", "during", "by"],
  "GR-PRP-004": ["by", "until", "before", "since", "for"],
  "GR-PRP-005": ["between", "among", "with", "inside", "across"],
  "GR-PRP-006": ["in", "into", "at", "on", "within"],
  "GR-PRP-007": ["beside", "besides", "near", "with", "along"],
  "GR-PRP-008": ["in", "for", "of", "with", "to", "on", "from"],
  "GR-PRP-009": ["on", "with", "from", "to", "of", "for", "in"],
  "GR-PRP-010": ["for", "to", "in", "of", "on", "with", "from"],
};

export interface Eng003Cp005QuestionV1 {
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
    cpId: "ENG-003-CP005";
    ruleId: PrepositionRuleId;
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

export interface GenerateEng003Cp005V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: PrepositionRuleId;
  sceneId?: string;
}

const sentenceFromSegments = (segments: readonly string[]) =>
  segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();

const bare = (token: string) => token.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function changedToken(ruleId: PrepositionRuleId, correctTarget: string, wrongTarget: string) {
  const correct = correctTarget.trim().split(/\s+/);
  const wrong = wrongTarget.trim().split(/\s+/);
  if (correct.length !== wrong.length) {
    throw new Error(`ENG-003 CP005 needs token-aligned donor phrases: ${correctTarget} <> ${wrongTarget}`);
  }
  const differing = correct
    .map((token, index) => bare(token) === bare(wrong[index]!) ? -1 : index)
    .filter((index) => index >= 0);
  if (differing.length === 1) return { correct, wrong, index: differing[0]! };

  const prepositionDifferences = differing.filter((index) =>
    ALT[ruleId].includes(bare(correct[index]!)) && ALT[ruleId].includes(bare(wrong[index]!)),
  );
  if (prepositionDifferences.length !== 1) {
    throw new Error(`ENG-003 CP005 could not isolate one tested preposition: ${correctTarget} <> ${wrongTarget}`);
  }
  return { correct, wrong, index: prepositionDifferences[0]! };
}

function applyCase(value: string, template: string) {
  if (/^[A-Z]/.test(template)) return value.slice(0, 1).toUpperCase() + value.slice(1);
  return value;
}

function blankToken(token: string) {
  const prefix = token.match(/^[^A-Za-z]+/)?.[0] ?? "";
  const suffix = token.match(/[^A-Za-z]+$/)?.[0] ?? "";
  return `${prefix}_____${suffix}`;
}

function replaceBlankToken(token: string, option: string) {
  return token.replace("_____", option);
}

function unique(values: readonly string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  }
  return out;
}

function distractors(ruleId: PrepositionRuleId, correctPrep: string, wrongPrep: string): string[] {
  const template = correctPrep;
  const pool = unique([
    applyCase(wrongPrep.toLowerCase(), template),
    ...ALT[ruleId].map((value) => applyCase(value, template)),
  ]).filter((value) => value.toLowerCase() !== correctPrep.toLowerCase());
  if (pool.length < 3) throw new Error(`${ruleId} could not produce three unique preposition distractors`);
  return pool.slice(0, 3);
}

function placeOptions(seed: string, correctPrep: string, wrong: readonly string[]) {
  const correctOptionIndex = stableHash(`${seed}:eng003-cp005-correct-position`) % 4;
  const shuffled = [...wrong];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:eng003-cp005-distractor-shuffle:${index}`, index + 1);
    [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
  }
  const options: string[] = [];
  let di = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === correctOptionIndex ? correctPrep : shuffled[di++]!);
  }
  return { options, correctOptionIndex };
}

function teachingTail(explanation: string) {
  const marker = " in the underlined part. ";
  const index = explanation.indexOf(marker);
  if (index < 0) throw new Error("ENG-002 CP005 explanation lost its approved teaching tail");
  return explanation.slice(index + marker.length).trim();
}

export function materializeEng003Cp005AnswerV1(
  segments: readonly string[],
  blankIndex: number,
  option: string,
) {
  const out = [...segments];
  out[blankIndex] = out[blankIndex]!.split(/\s+/)
    .map((token) => token.includes("_____") ? replaceBlankToken(token, option) : token)
    .join(" ");
  return sentenceFromSegments(out);
}

export function generateEng003Cp005QuestionV1(input: GenerateEng003Cp005V1Input): Eng003Cp005QuestionV1 {
  const source = generateEng002Cp005QuestionV1({
    seed: `${input.seed}:eng003-source`,
    difficulty: input.difficulty,
    ruleId: input.ruleId,
    sceneId: input.sceneId,
    noImprovement: false,
  });
  if (source.correctOptionIndex === 3) throw new Error(`${source.questionId} unexpectedly keyed No improvement`);

  const correctTarget = source.options[source.correctOptionIndex]!.trim();
  const wrongTarget = source.targetText.trim();
  const slot = changedToken(source.metadata.ruleId, correctTarget, wrongTarget);
  const correctPrep = slot.correct[slot.index]!.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
  const wrongPrep = slot.wrong[slot.index]!.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
  if (!correctPrep || !wrongPrep) throw new Error(`${source.questionId} lost its preposition token`);

  const blankTargetTokens = [...slot.correct];
  blankTargetTokens[slot.index] = blankToken(slot.correct[slot.index]!);
  const blankSegments = [...source.segments];
  blankSegments[source.targetIndex] = blankTargetTokens.join(" ");
  const sentence = sentenceFromSegments(blankSegments);
  const { options, correctOptionIndex } = placeOptions(
    input.seed,
    correctPrep,
    distractors(source.metadata.ruleId, correctPrep, wrongPrep),
  );
  const explanation = `The blank needs “${correctPrep}”. ${teachingTail(source.explanation)}`;
  const reconstructed = materializeEng003Cp005AnswerV1(blankSegments, source.targetIndex, options[correctOptionIndex]!);
  if (reconstructed !== source.correctedSentence) {
    throw new Error(`${source.questionId} filler reconstruction drifted: ${reconstructed} !== ${source.correctedSentence}`);
  }

  return {
    questionId: `ENG-003-CP005-V1:${source.metadata.ruleId}:${source.metadata.candidateId}:${input.seed}`,
    stem: ENG003_CP005_STEM,
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
      cpId: "ENG-003-CP005",
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
