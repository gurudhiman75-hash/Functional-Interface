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

function stripLeadingDeterminer(text: string): string {
  return text.replace(/^(?:the|a|an|many|much|few|a few|little|a little|each|every|several)\s+/i, "").trim();
}

function firstContentWord(text: string): string {
  return stripLeadingDeterminer(text).split(/\s+/)[0]?.replace(/[^\p{L}\p{N}-]/gu, "") ?? text;
}

function connectedExplanationReason(candidate: Eng001SentenceCandidate): string {
  const correction = candidate.correction.trim();
  const content = stripLeadingDeterminer(correction);
  const word = firstContentWord(correction);
  const lower = correction.toLowerCase();

  switch (candidate.ruleId) {
    case "GR-ART-001":
      return `“${content}” names one countable thing, so it needs an article.`;
    case "GR-ART-002": {
      const article = /^(?:an)\s+/i.test(correction) ? "an" : "a";
      if (/^(?:a\s+)?(?:university|european)\b/i.test(correction)) {
        return `“${word}” starts with a consonant “y” sound, so we use “${article}”.`;
      }
      if (/^(?:a\s+)?(?:one|one-time|one-hour)\b/i.test(correction)) {
        return `“${word}” starts with a consonant “w” sound, so we use “${article}”.`;
      }
      const sound = article === "an" ? "vowel" : "consonant";
      return `“${word}” starts with a ${sound} sound, so we use “${article}”.`;
    }
    case "GR-ART-003": {
      const superlative = content.split(/\s+/)[0] ?? content;
      return `“${superlative}” is a superlative, so we use “the” before it.`;
    }
    case "GR-ART-004": {
      const noun = content.split(/\s+/)[0] ?? content;
      return `The words after “${noun}” tell us exactly which ${noun} is meant, so we use “the”.`;
    }
    case "GR-ART-005":
      return `“${content}” is used in a general sense, so no article is needed.`;
    case "GR-ART-006": {
      const article = /^(?:an)\s+/i.test(correction) ? "an" : "a";
      return `“${content}” names one profession or role, so it needs “${article}”.`;
    }
    case "GR-ART-007": {
      if (lower === "school") return `Here, “school” means attending as a pupil, so no article is used.`;
      if (lower === "hospital") return `Here, “hospital” means being there as a patient, so no article is used.`;
      if (lower === "prison") return `Here, “prison” means serving a sentence, so no article is used.`;
      if (lower === "college") return `Here, “college” means attending as a student, so no article is used.`;
      if (lower === "bed") return `In “go to bed”, “bed” takes no article.`;
      if (lower === "church") return `Here, “church” means going there for worship, so no article is used.`;
      return `“${content}” is used for its usual purpose here, so no article is needed.`;
    }
    case "GR-ART-008": {
      if (/nile/i.test(correction)) return `“Nile” is a river name, so we use “the”.`;
      if (/mount everest/i.test(correction)) return `“Mount Everest” is one mountain name, so no article is used.`;
      if (/indian ocean/i.test(correction)) return `“Indian Ocean” is an ocean name, so we use “the”.`;
      if (/sahara desert/i.test(correction)) return `“Sahara Desert” is a desert name, so we use “the”.`;
      if (/lake victoria/i.test(correction)) return `“Lake Victoria” is one lake name, so no article is used.`;
      if (/netherlands/i.test(correction)) return `The country name is “the Netherlands”, so “the” is required.`;
      return `The article follows the usual pattern for the geographical name “${content}”.`;
    }
    case "GR-ART-009": {
      const quantifier = correction.match(/^(a few|a little|many|much|few|little)\b/i)?.[1] ?? correction.split(/\s+/)[0] ?? correction;
      const noun = correction.slice(quantifier.length).trim() || content;
      if (/^(?:many|few|a few)$/i.test(quantifier)) {
        return `“${noun}” is plural and countable, so we use “${quantifier}”.`;
      }
      return `“${noun}” is uncountable here, so we use “${quantifier}”.`;
    }
    case "GR-ART-010": {
      const determiner = correction.split(/\s+/)[0] ?? correction;
      const noun = correction.slice(determiner.length).trim() || content;
      if (/^(?:each|every)$/i.test(determiner)) {
        return `After “${determiner}”, “${noun}” must be singular.`;
      }
      return `After “${determiner}”, “${noun}” must be plural.`;
    }
    default:
      return candidate.explanationApplication;
  }
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function renderHumanExplanation(input: {
  seed: string;
  qlId: Eng001QlId;
  candidate: Eng001SentenceCandidate;
  answerLabel: string;
  correctedSentence: string;
  noError: boolean;
}): string {
  const { seed, qlId, candidate, answerLabel, correctedSentence, noError } = input;
  const reason = connectedExplanationReason(candidate);
  const styleSeed = `${seed}:cp003:explanation:${candidate.candidateId}:${qlId}`;
  const correctedTail = deterministicPick(`${styleSeed}:tail`, [
    `Correct sentence: ${correctedSentence}`,
    `The corrected sentence is: ${correctedSentence}`,
    `So the sentence should read: ${correctedSentence}`,
    `Correct form: ${correctedSentence}`,
  ] as const);

  if (noError) {
    const opening = deterministicPick(`${styleSeed}:opening`, [
      "There is no error.",
      "The sentence is correct as it is.",
      "No part of the sentence has an error.",
      "The given sentence is correct.",
    ] as const);
    const confirmation = deterministicPick(`${styleSeed}:confirmation`, [
      `“${candidate.correction}” is correct here.`,
      `So “${candidate.correction}” is correct.`,
      `That is why “${candidate.correction}” is correct.`,
      `Therefore, “${candidate.correction}” is correct.`,
    ] as const);
    return `${opening} ${reason} ${confirmation} ${correctedTail}`;
  }

  const opening = deterministicPick(`${styleSeed}:opening`, [
    `Part ${answerLabel} contains the error.`,
    `The error is in Part ${answerLabel}.`,
    `Part ${answerLabel} is incorrect.`,
    `The mistake is in Part ${answerLabel}.`,
    `Part ${answerLabel} needs correction.`,
  ] as const);
  const correctionLine = deterministicPick(`${styleSeed}:correction`, [
    `Use “${candidate.correction}”.`,
    `It should be “${candidate.correction}”.`,
    `The correct form is “${candidate.correction}”.`,
    `Write “${candidate.correction}” instead.`,
    `Here, we need “${candidate.correction}”.`,
  ] as const);
  return `${opening} ${reason} ${correctionLine} ${correctedTail}`;
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
  const explanation = renderHumanExplanation({ seed: input.seed, qlId, candidate, answerLabel, correctedSentence, noError });

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
