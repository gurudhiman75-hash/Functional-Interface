import { deterministicPick } from "../../../../core/deterministic";
import type { Eng001QlId, Eng001Question, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import {
  buildEng001Cp001CandidateV4,
  ENG001_CP001_V4_NO_ERROR_RULE_IDS,
  rulesForDifficultyV4,
  semanticDomainOfV4,
} from "./cp001-patterns-v4";
import { CONTEXT_EXPANSIONS_BY_DOMAIN_V4 } from "./cp001-context-expansions-v4";

const STEMS: Record<Eng001QlId, readonly string[]> = {
  "ENG-001-QL001": [
    "Identify the part of the sentence that contains a grammatical error.",
    "Select the segment that contains an error.",
    "Choose the part in which the grammatical error occurs.",
    "Find the segment that is grammatically incorrect.",
    "Which part of the sentence contains an error?",
    "Select the incorrect part of the sentence.",
    "Identify the segment that needs grammatical correction.",
    "Choose the part that contains the error in usage.",
    "Find the part that contains a grammatical mistake.",
    "Select the part that is not grammatically correct.",
    "Identify the erroneous segment of the sentence.",
    "Choose the segment that requires correction.",
    "Which segment is grammatically incorrect?",
    "Select the part containing the grammatical error.",
  ],
  "ENG-001-QL002": [
    "The sentence is divided into three parts. Select the part containing an error; if there is no error, choose 'No error'.",
    "One of the three parts may contain an error. Choose that part, or select 'No error' if the sentence is correct.",
    "Examine the three parts and identify the incorrect one. If all are correct, choose 'No error'.",
    "Select the part that contains a grammatical error. Choose 'No error' if none of the three parts is incorrect.",
    "Read the sentence carefully and choose the erroneous part; otherwise select 'No error'.",
    "Which part, if any, contains a grammatical error? Select 'No error' if the sentence is correct.",
    "Choose the incorrect part of the three-part sentence, or select 'No error'.",
    "Identify the part that requires correction; choose 'No error' if the sentence is correct.",
    "Select the erroneous part, if any. Otherwise choose 'No error'.",
    "Find the grammatical error in the three parts; select 'No error' when none is present.",
  ],
  "ENG-001-QL007": [
    "Identify the erroneous part of the sentence. If the sentence is correct, select 'No error'.",
    "Choose the part containing an error, or select 'No error' if all parts are correct.",
    "Examine the sentence and select the incorrect part. If there is no error, choose 'No error'.",
    "Find the grammatical error, if any. Select 'No error' when the sentence is correct.",
    "Select the part that requires correction; otherwise choose 'No error'.",
    "Read the sentence and identify the error. If none is present, select 'No error'.",
    "Choose the erroneous segment, or select 'No error' if the sentence is correct.",
    "Identify the incorrect segment, if any; otherwise choose 'No error'.",
    "Select the part containing an error. If all parts are correct, choose 'No error'.",
    "Find the part that is grammatically incorrect; select 'No error' if there is none.",
  ],
};

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function appendContext(segment: string, context: string): string {
  const clean = segment.trim().replace(/[.!?]+$/, "");
  return `${clean} ${context}.`;
}

/**
 * Add one short domain-aware situation cue without ever touching the registered
 * error segment. The same cue is applied to the correct and mutated sentence,
 * so the only grammatical mutation remains the registered SVA error.
 */
function contextualizeSegments(
  segments: readonly string[],
  errorIndex: number | null,
  context: string,
): string[] {
  const out = [...segments];
  const target = [3, 2, 0].find((index) => index !== errorIndex && Boolean(out[index]?.trim()));
  if (target === undefined) throw new Error("Unable to place CP001 V4 semantic context outside the error segment");
  out[target] = appendContext(out[target]!, context);
  return out;
}

function ensureFourVisibleSegments(
  segments: readonly string[],
  errorIndex: number | null,
): { segments: string[]; errorIndex: number | null } {
  const out = [...segments];
  if (out.length !== 4) return { segments: out, errorIndex };
  if (out[3]?.trim()) return { segments: out, errorIndex };
  const donorIndex = 2;
  const words = (out[donorIndex] ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || donorIndex === errorIndex) {
    throw new Error("Unable to normalize a four-segment V4 surface without changing the error segment");
  }
  const splitAt = Math.max(1, Math.floor(words.length / 2));
  out[donorIndex] = words.slice(0, splitAt).join(" ");
  out[3] = words.slice(splitAt).join(" ");
  return { segments: out, errorIndex };
}

function mergePair(
  segments: readonly string[],
  mergeAt: number,
  errorIndex: number | null,
): { segments: string[]; errorIndex: number | null } {
  const out: string[] = [];
  let mapped: number | null = null;
  for (let index = 0; index < segments.length; index += 1) {
    if (index === mergeAt) {
      const newIndex = out.length;
      out.push(`${segments[index]} ${segments[index + 1]}`.trim());
      if (errorIndex === index || errorIndex === index + 1) mapped = newIndex;
      index += 1;
      continue;
    }
    const newIndex = out.length;
    out.push(segments[index]!);
    if (errorIndex === index) mapped = newIndex;
  }
  return { segments: out, errorIndex: mapped };
}

function shapeThreeSegmentsPreserveError(
  segments: readonly string[],
  errorIndex: number,
  seed: string,
): { segments: string[]; errorIndex: number } {
  if (segments.length !== 4) {
    throw new Error(`QL002 requires four source segments; received ${segments.length}`);
  }
  const mergeCandidates = [0, 1, 2].filter(
    (index) => index !== errorIndex && index + 1 !== errorIndex,
  );
  if (mergeCandidates.length === 0) {
    throw new Error(`Unable to preserve error segment ${errorIndex} while shaping QL002`);
  }
  const mergeAt = deterministicPick(`${seed}:three-segment-merge`, mergeCandidates);
  const shaped = mergePair(segments, mergeAt, errorIndex);
  if (shaped.errorIndex === null) throw new Error("QL002 error index was lost during shaping");
  return { segments: shaped.segments, errorIndex: shaped.errorIndex };
}

function optionLabels(count: number, includeNoError: boolean): string[] {
  const labels = Array.from({ length: count }, (_, index) => String.fromCharCode(65 + index));
  return includeNoError ? [...labels, "No error"] : labels;
}

function chooseRule(input: {
  difficulty: EnglishDifficulty;
  qlId: Eng001QlId;
  ruleId?: GrammarRuleId;
  seed: string;
}): GrammarRuleId {
  const isNoError = input.qlId === "ENG-001-QL007";
  if (input.ruleId) {
    const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId];
    if (!rule.allowedDifficulties.includes(input.difficulty)) {
      throw new Error(`${input.ruleId} does not support ${input.difficulty}`);
    }
    if (isNoError && !ENG001_CP001_V4_NO_ERROR_RULE_IDS.includes(input.ruleId)) {
      throw new Error(`${input.ruleId} is not admitted to the calibrated No-error pool`);
    }
    return input.ruleId;
  }
  const allowed = rulesForDifficultyV4(input.difficulty).filter(
    (ruleId) => !isNoError || ENG001_CP001_V4_NO_ERROR_RULE_IDS.includes(ruleId),
  );
  return deterministicPick(`${input.seed}:rule:${input.qlId}:${input.difficulty}`, allowed);
}

export interface GenerateEng001Cp001V4Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: GrammarRuleId;
}

export function generateEng001Cp001QuestionV4(input: GenerateEng001Cp001V4Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(
    `${input.seed}:ql`,
    ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const,
  );
  const ruleId = chooseRule({ difficulty: input.difficulty, qlId, ruleId: input.ruleId, seed: input.seed });
  const candidate = buildEng001Cp001CandidateV4({
    ruleId,
    difficulty: input.difficulty,
    seed: `${input.seed}:${ruleId}`,
  });
  const domain = semanticDomainOfV4(candidate);
  if (!domain) throw new Error(`${candidate.candidateId} lacks a semantic domain for V4 context expansion`);
  const context = deterministicPick(
    `${input.seed}:context:${domain}:${candidate.ruleId}`,
    CONTEXT_EXPANSIONS_BY_DOMAIN_V4[domain],
  );

  const isNoError = qlId === "ENG-001-QL007";
  const rawErrorIndex = isNoError ? null : candidate.errorIndex;
  const contextualCorrect = contextualizeSegments(candidate.correctSegments, candidate.errorIndex, context.text);
  const contextualError = contextualizeSegments(candidate.errorSegments, candidate.errorIndex, context.text);
  const rawSegments = isNoError ? contextualCorrect : contextualError;
  const visible = ensureFourVisibleSegments(rawSegments, rawErrorIndex);
  const shaped = qlId === "ENG-001-QL002"
    ? shapeThreeSegmentsPreserveError(visible.segments, visible.errorIndex!, input.seed)
    : visible;
  const includeNoError = qlId !== "ENG-001-QL001";
  const options = optionLabels(shaped.segments.length, includeNoError);
  const correctOptionIndex = shaped.errorIndex ?? shaped.segments.length;
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(contextualCorrect);
  const explanation = isNoError
    ? `There is no error. ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`
    : `The error is in segment ${answerLabel}: “${shaped.segments[shaped.errorIndex!]!}”. ${candidate.explanationApplication} Replace “${candidate.errorSpan}” with “${candidate.correction}”. Correct sentence: ${correctedSentence}`;
  const realizedCandidateId = `${candidate.candidateId}:CTX:${context.id}`;

  return {
    questionId: `ENG-001-CP001-V4:${qlId}:${realizedCandidateId}:${input.seed}`,
    stem: deterministicPick(`${input.seed}:stem:${qlId}`, STEMS[qlId]),
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-001",
      cpId: "ENG-001-CP001",
      qlId,
      ruleId: candidate.ruleId,
      mutationId: candidate.mutationId,
      difficulty: candidate.difficulty,
      dimensions: candidate.dimensions,
      answerSegment: answerLabel,
      hasNoError: isNoError,
      seed: input.seed,
      candidateId: realizedCandidateId,
      reviewOnly: true,
    },
  };
}
