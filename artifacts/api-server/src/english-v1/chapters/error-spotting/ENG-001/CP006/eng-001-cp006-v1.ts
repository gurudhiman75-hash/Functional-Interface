import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type { ComparisonRuleId, DifficultyDimensions, Eng001QlId, Eng001Question, Eng001SentenceCandidate, EnglishDifficulty } from "../../../../core/types";
import { COMPARISON_RULE_BY_ID } from "../../../../grammar/comparison";
import { CP006_SCENES_BY_DIFFICULTY_V4 } from "./cp006-catalog-v4";
import type { ComparisonSceneV1 } from "./cp006-catalog-v1";

const STEMS: Record<Eng001QlId, string> = {
  "ENG-001-QL001": "Identify the part of the sentence that contains an error.",
  "ENG-001-QL002": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
  "ENG-001-QL007": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
};

const dims = (difficulty: EnglishDifficulty): DifficultyDimensions => difficulty === "easy"
  ? { ruleComplexity: 1, dependencyDistance: 1, distractorSimilarity: 1, sentenceLength: 2, ruleInteraction: 1, lexicalLoad: 1 }
  : difficulty === "medium"
    ? { ruleComplexity: 2, dependencyDistance: 3, distractorSimilarity: 3, sentenceLength: 2, ruleInteraction: 1, lexicalLoad: 1 }
    : { ruleComplexity: 4, dependencyDistance: 4, distractorSimilarity: 4, sentenceLength: 3, ruleInteraction: 1, lexicalLoad: 1 };

export function cp006ScenePoolV1(difficulty: EnglishDifficulty, ruleId?: ComparisonRuleId): readonly ComparisonSceneV1[] {
  const base = CP006_SCENES_BY_DIFFICULTY_V4[difficulty];
  const filtered = ruleId ? base.filter((scene) => scene.ruleId === ruleId) : base;
  if (!filtered.length) throw new Error(`No CP006 ${difficulty} scene is available${ruleId ? ` for ${ruleId}` : ""}.`);
  return filtered;
}

export function rulesForDifficultyCp006V1(difficulty: EnglishDifficulty): readonly ComparisonRuleId[] {
  return [...new Set(CP006_SCENES_BY_DIFFICULTY_V4[difficulty].map((scene) => scene.ruleId))];
}

export function buildEng001Cp006CandidateV1(input: { seed: string; difficulty: EnglishDifficulty; ruleId?: ComparisonRuleId; sceneId?: string }): Eng001SentenceCandidate {
  const pool = cp006ScenePoolV1(input.difficulty, input.ruleId);
  const selected = input.sceneId ? pool.find((candidate) => candidate.id === input.sceneId) : deterministicPick(`${input.seed}:cp006:scene`, pool);
  if (!selected) throw new Error(`Unknown CP006 ${input.difficulty} scene ${input.sceneId}.`);
  const dimensions = dims(input.difficulty);
  const derived = classifyEnglishDifficulty(dimensions);
  if (derived !== input.difficulty) throw new Error(`${selected.id} difficulty mismatch: ${derived}`);
  const rule = COMPARISON_RULE_BY_ID[selected.ruleId];
  return {
    candidateId: `CMP-V1:${selected.id}`,
    ruleId: selected.ruleId,
    mutationId: rule.mutationId,
    difficulty: selected.difficulty,
    dimensions,
    correctSegments: selected.correctSegments,
    errorSegments: selected.errorSegments,
    errorIndex: selected.errorIndex,
    errorSpan: selected.errorSegments[selected.errorIndex],
    correction: selected.correction,
    subjectHead: selected.correctSegments[0],
    explanationApplication: selected.reason,
    tags: [`domain:${selected.domain}`, `scene:${selected.id}`, `comparison-rule:${selected.ruleId}`],
  };
}

const sentenceFromSegments = (segments: readonly string[]): string => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();

function renderExplanation(input: { seed: string; qlId: Eng001QlId; candidate: Eng001SentenceCandidate; answerLabel: string; correctedSentence: string; noError: boolean }): string {
  const { seed, qlId, candidate, answerLabel, correctedSentence, noError } = input;
  const reason = candidate.explanationApplication;
  const styleSeed = `${seed}:cp006:explanation:${candidate.candidateId}:${qlId}`;
  if (noError) return deterministicPick(`${styleSeed}:style`, [
    `There is no error. ${reason} The sentence is correct: ${correctedSentence}`,
    `The sentence is correct as it is. ${reason} No change is needed: ${correctedSentence}`,
    `No correction is needed. ${reason} Correct sentence: ${correctedSentence}`,
  ] as const);
  return deterministicPick(`${styleSeed}:style`, [
    `Part ${answerLabel} contains the error. ${reason} Correct sentence: ${correctedSentence}`,
    `The error is in Part ${answerLabel}. ${reason} The corrected sentence is: ${correctedSentence}`,
    `Part ${answerLabel} is incorrect. ${reason} The sentence should read: ${correctedSentence}`,
    `The mistake is in Part ${answerLabel}. ${reason} Correct sentence: ${correctedSentence}`,
  ] as const);
}

function shapeQl002(segments: readonly string[], errorIndex: number, seed: string): { segments: string[]; errorIndex: number } {
  if (segments.length !== 4) throw new Error("CP006 QL002 expects four authored segments.");
  const mergeCandidates = [0, 1, 2].filter((at) => at !== errorIndex && at + 1 !== errorIndex);
  if (!mergeCandidates.length) throw new Error(`CP006 QL002 cannot preserve keyed segment ${errorIndex}.`);
  const mergeAt = deterministicPick(`${seed}:cp006:ql002-merge`, mergeCandidates);
  const out: string[] = [];
  let mapped = -1;
  for (let i = 0; i < segments.length; i += 1) {
    if (i === mergeAt) {
      const outIndex = out.length;
      out.push(`${segments[i]} ${segments[i + 1]}`.trim());
      if (errorIndex === i || errorIndex === i + 1) mapped = outIndex;
      i += 1;
    } else {
      const outIndex = out.length;
      out.push(segments[i]!);
      if (errorIndex === i) mapped = outIndex;
    }
  }
  if (mapped < 0) throw new Error("CP006 QL002 lost the keyed error segment.");
  return { segments: out, errorIndex: mapped };
}

export interface GenerateEng001Cp006V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: ComparisonRuleId;
  sceneId?: string;
}

export function generateEng001Cp006QuestionV1(input: GenerateEng001Cp006V1Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(`${input.seed}:cp006:ql`, ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const);
  const candidate = buildEng001Cp006CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  const noError = qlId === "ENG-001-QL007";
  const sourceSegments = noError ? [...candidate.correctSegments] : [...candidate.errorSegments];
  const shaped = qlId === "ENG-001-QL002"
    ? shapeQl002(sourceSegments, candidate.errorIndex!, input.seed)
    : { segments: sourceSegments, errorIndex: candidate.errorIndex! };
  const includeNoError = qlId !== "ENG-001-QL001";
  const options = [...Array.from({ length: shaped.segments.length }, (_, i) => String.fromCharCode(65 + i)), ...(includeNoError ? ["No error"] : [])];
  const correctOptionIndex = noError ? shaped.segments.length : shaped.errorIndex;
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(candidate.correctSegments);
  return {
    questionId: `ENG-001-CP006-V1:${qlId}:${candidate.candidateId}:${input.seed}`,
    stem: STEMS[qlId],
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation: renderExplanation({ seed: input.seed, qlId, candidate, answerLabel, correctedSentence, noError }),
    metadata: {
      track: "english", chapterId: "ENG-001", cpId: "ENG-001-CP006", qlId,
      ruleId: candidate.ruleId, mutationId: candidate.mutationId, difficulty: candidate.difficulty,
      dimensions: candidate.dimensions, answerSegment: answerLabel, hasNoError: noError,
      seed: input.seed, candidateId: candidate.candidateId, reviewOnly: true,
    },
  };
}
