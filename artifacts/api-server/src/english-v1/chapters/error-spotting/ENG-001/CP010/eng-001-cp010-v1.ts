import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type { DifficultyDimensions, Eng001QlId, Eng001Question, EnglishDifficulty } from "../../../../core/types";
import { MODIFIER_RULE_BY_ID, type ModifierMutationId, type ModifierRuleId } from "../../../../grammar/modifiers";
import { CP010_SCENES_BY_DIFFICULTY_V1 } from "./cp010-catalog-v1";
import type { ModifierSceneV1 } from "./cp010-scene-types";

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

export interface ModifierCandidateV1 {
  candidateId: string;
  ruleId: ModifierRuleId;
  mutationId: ModifierMutationId;
  difficulty: EnglishDifficulty;
  dimensions: DifficultyDimensions;
  correctSegments: readonly string[];
  errorSegments: readonly string[];
  errorIndex: number;
  correction: string;
  explanationApplication: string;
  tags: readonly string[];
}

export function cp010ScenePoolV1(
  difficulty: EnglishDifficulty,
  ruleId?: ModifierRuleId,
): readonly ModifierSceneV1[] {
  const base = CP010_SCENES_BY_DIFFICULTY_V1[difficulty];
  const filtered = ruleId ? base.filter((scene) => scene.ruleId === ruleId) : base;
  if (!filtered.length) throw new Error(`No CP010 ${difficulty} scene is available${ruleId ? ` for ${ruleId}` : ""}.`);
  return filtered;
}

export function rulesForDifficultyCp010V1(difficulty: EnglishDifficulty): readonly ModifierRuleId[] {
  return [...new Set(CP010_SCENES_BY_DIFFICULTY_V1[difficulty].map((scene) => scene.ruleId))];
}

export function buildEng001Cp010CandidateV1(input: {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ModifierRuleId;
  sceneId?: string;
}): ModifierCandidateV1 {
  const pool = cp010ScenePoolV1(input.difficulty, input.ruleId);
  const selected = input.sceneId
    ? pool.find((candidate) => candidate.id === input.sceneId)
    : deterministicPick(`${input.seed}:cp010:scene`, pool);
  if (!selected) throw new Error(`Unknown CP010 ${input.difficulty} scene ${input.sceneId}.`);

  const dimensions = dims(input.difficulty);
  const derived = classifyEnglishDifficulty(dimensions);
  if (derived !== input.difficulty) throw new Error(`${selected.id} difficulty mismatch: ${derived}`);

  const rule = MODIFIER_RULE_BY_ID[selected.ruleId];
  return {
    candidateId: `MOD-V1:${selected.id}`,
    ruleId: selected.ruleId,
    mutationId: rule.mutationId,
    difficulty: selected.difficulty,
    dimensions,
    correctSegments: selected.correctSegments,
    errorSegments: selected.errorSegments,
    errorIndex: selected.errorIndex,
    correction: selected.correction,
    explanationApplication: selected.reason,
    tags: [`domain:${selected.domain}`, `scene:${selected.id}`, `modifier-rule:${selected.ruleId}`],
  };
}

const sentenceFromSegments = (segments: readonly string[]): string =>
  segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();

function renderExplanation(input: {
  seed: string;
  qlId: Eng001QlId;
  candidate: ModifierCandidateV1;
  answerLabel: string;
  correctedSentence: string;
  noError: boolean;
}): string {
  const { seed, qlId, candidate, answerLabel, correctedSentence, noError } = input;
  const reason = candidate.explanationApplication;
  const styleSeed = `${seed}:cp010:explanation:${candidate.candidateId}:${qlId}`;

  if (noError) {
    return deterministicPick(`${styleSeed}:style`, [
      `There is no error. ${reason} The sentence is correct: ${correctedSentence}`,
      `The sentence is correct as it is. ${reason} No change is needed: ${correctedSentence}`,
      `No correction is needed. ${reason} Correct sentence: ${correctedSentence}`,
    ] as const);
  }

  return deterministicPick(`${styleSeed}:style`, [
    `Part ${answerLabel} contains the error. ${reason} Correct sentence: ${correctedSentence}`,
    `The error is in Part ${answerLabel}. ${reason} The corrected sentence is: ${correctedSentence}`,
    `Part ${answerLabel} is incorrect. ${reason} The sentence should read: ${correctedSentence}`,
    `The mistake is in Part ${answerLabel}. ${reason} Correct sentence: ${correctedSentence}`,
  ] as const);
}

function shapeQl002(
  segments: readonly string[],
  errorIndex: number,
  seed: string,
): { segments: string[]; errorIndex: number } {
  if (segments.length !== 4) throw new Error("CP010 QL002 expects four authored segments.");
  const mergeCandidates = [0, 1, 2].filter((at) => at !== errorIndex && at + 1 !== errorIndex);
  if (!mergeCandidates.length) throw new Error(`CP010 QL002 cannot preserve keyed segment ${errorIndex}.`);
  const mergeAt = deterministicPick(`${seed}:cp010:ql002-merge`, mergeCandidates);

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
  if (mapped < 0) throw new Error("CP010 QL002 lost the keyed error segment.");
  return { segments: out, errorIndex: mapped };
}

export interface GenerateEng001Cp010V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: ModifierRuleId;
  sceneId?: string;
}

export function generateEng001Cp010QuestionV1(input: GenerateEng001Cp010V1Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(
    `${input.seed}:cp010:ql`,
    ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const,
  );
  const candidate = buildEng001Cp010CandidateV1(input);
  const noError = qlId === "ENG-001-QL007";
  const sourceSegments = noError ? [...candidate.correctSegments] : [...candidate.errorSegments];
  const shaped = qlId === "ENG-001-QL002"
    ? shapeQl002(sourceSegments, candidate.errorIndex, input.seed)
    : { segments: sourceSegments, errorIndex: candidate.errorIndex };
  const includeNoError = qlId !== "ENG-001-QL001";
  const options = [
    ...Array.from({ length: shaped.segments.length }, (_, i) => String.fromCharCode(65 + i)),
    ...(includeNoError ? ["No error"] : []),
  ];
  const correctOptionIndex = noError ? shaped.segments.length : shaped.errorIndex;
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(candidate.correctSegments);

  const metadata = {
    track: "english",
    chapterId: "ENG-001",
    cpId: "ENG-001-CP010",
    qlId,
    ruleId: candidate.ruleId,
    mutationId: candidate.mutationId,
    difficulty: candidate.difficulty,
    dimensions: candidate.dimensions,
    answerSegment: answerLabel,
    hasNoError: noError,
    seed: input.seed,
    candidateId: candidate.candidateId,
    reviewOnly: true,
  } as unknown as Eng001Question["metadata"];

  return {
    questionId: `ENG-001-CP010-V1:${qlId}:${candidate.candidateId}:${input.seed}`,
    stem: STEMS[qlId],
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation: renderExplanation({ seed: input.seed, qlId, candidate, answerLabel, correctedSentence, noError }),
    metadata,
  };
}
