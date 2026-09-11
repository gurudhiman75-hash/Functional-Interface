import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type { ArticleRuleId, DifficultyDimensions, Eng001QlId, Eng001Question, Eng001SentenceCandidate, EnglishDifficulty } from "../../../../core/types";
import { ARTICLE_DETERMINER_RULE_BY_ID } from "../../../../grammar/articles-determiners";
import { ARTICLE_SCENES_BY_DIFFICULTY_V1, type ArticleSceneV1 } from "./cp003-catalog-v1";
import { CP003_EXTRA_EASY_SCENES_V1 } from "./cp003-easy-extras-v1";

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

export function cp003ScenePoolV1(difficulty: EnglishDifficulty, ruleId?: ArticleRuleId): readonly ArticleSceneV1[] {
  const base = difficulty === "easy"
    ? [...ARTICLE_SCENES_BY_DIFFICULTY_V1.easy, ...CP003_EXTRA_EASY_SCENES_V1]
    : ARTICLE_SCENES_BY_DIFFICULTY_V1[difficulty];
  const filtered = ruleId ? base.filter((scene) => scene.ruleId === ruleId) : base;
  if (!filtered.length) throw new Error(`No CP003 ${difficulty} scene is available${ruleId ? ` for ${ruleId}` : ""}.`);
  return filtered;
}

export function buildEng001Cp003CandidateV1(input: { seed: string; difficulty: EnglishDifficulty; ruleId?: ArticleRuleId; sceneId?: string }): Eng001SentenceCandidate {
  const pool = cp003ScenePoolV1(input.difficulty, input.ruleId);
  const scene = input.sceneId
    ? pool.find((candidate) => candidate.id === input.sceneId)
    : deterministicPick(`${input.seed}:cp003:scene`, pool);
  if (!scene) throw new Error(`Unknown CP003 ${input.difficulty} scene ${input.sceneId}.`);
  const dimensions = dims(input.difficulty);
  const derived = classifyEnglishDifficulty(dimensions);
  if (derived !== input.difficulty) throw new Error(`${scene.id} difficulty mismatch: ${derived}`);
  const rule = ARTICLE_DETERMINER_RULE_BY_ID[scene.ruleId];
  return {
    candidateId: `ART-V1:${scene.id}`,
    ruleId: scene.ruleId,
    mutationId: rule.mutationId,
    difficulty: scene.difficulty,
    dimensions,
    correctSegments: scene.correctSegments,
    errorSegments: scene.errorSegments,
    errorIndex: scene.errorIndex,
    errorSpan: scene.errorSegments[scene.errorIndex],
    correction: scene.correction,
    subjectHead: scene.correctSegments[0],
    explanationApplication: scene.reason,
    tags: [`domain:${scene.domain}`, `scene:${scene.id}`, `article-rule:${scene.ruleId}`],
  };
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function shapeQl002(segments: readonly string[], errorIndex: number, seed: string): { segments: string[]; errorIndex: number } {
  if (segments.length !== 4) throw new Error("CP003 QL002 expects four canonical segments.");
  const mergeCandidates = [0, 1, 2].filter((at) => at !== errorIndex && at + 1 !== errorIndex);
  const mergeAt = deterministicPick(`${seed}:cp003:ql002-merge`, mergeCandidates);
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
  if (mapped < 0) throw new Error("CP003 QL002 lost the keyed error segment.");
  return { segments: out, errorIndex: mapped };
}

export interface GenerateEng001Cp003V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: ArticleRuleId;
  sceneId?: string;
}

export function generateEng001Cp003QuestionV1(input: GenerateEng001Cp003V1Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(`${input.seed}:cp003:ql`, ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const);
  const candidate = buildEng001Cp003CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
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
  const explanation = noError
    ? `There is no error. ${candidate.explanationApplication} “${candidate.correction}” is correct. Correct sentence: ${correctedSentence}`
    : `Part ${answerLabel} contains the error. ${candidate.explanationApplication} Use “${candidate.correction}”. Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-001-CP003-V1:${qlId}:${candidate.candidateId}:${input.seed}`,
    stem: STEMS[qlId],
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-001",
      cpId: "ENG-001-CP003",
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
    },
  };
}
