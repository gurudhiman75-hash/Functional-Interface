import { deterministicPick } from "../../../../core/deterministic";
import type { Eng001QlId, Eng001Question, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import {
  buildEng001Cp001CandidateV2,
  ENG001_CP001_NO_ERROR_RULE_IDS,
  rulesForDifficulty,
} from "./cp001-patterns-v2";

const STEMS: Record<Eng001QlId, readonly string[]> = {
  "ENG-001-QL001": [
    "Identify the segment that contains a grammatical error.",
    "Choose the segment that contains a grammatical error.",
    "Select the part of the sentence that contains an error.",
  ],
  "ENG-001-QL002": [
    "The sentence is divided into three segments. One may contain an error. Select that segment; if there is no error, choose 'No error'.",
    "One of the three segments may contain a grammatical error. Choose the incorrect segment, or select 'No error' if the sentence is correct.",
  ],
  "ENG-001-QL007": [
    "Examine the sentence and select the erroneous segment. If the sentence is grammatically correct, choose 'No error'.",
    "Choose the segment containing a grammatical error. If there is no error, select 'No error'.",
  ],
};

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1");
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
      out.push(`${segments[index]} ${segments[index + 1]}`);
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

/**
 * QL002 is shaped from the same canonical four-segment sentence but the
 * intended error segment is never merged with neighbouring material.
 */
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
  if (shaped.errorIndex === null) {
    throw new Error("QL002 error index was lost during shaping");
  }
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
    if (isNoError && !ENG001_CP001_NO_ERROR_RULE_IDS.includes(input.ruleId)) {
      throw new Error(`${input.ruleId} is not admitted to the calibrated No-error pool`);
    }
    return input.ruleId;
  }

  const allowed = rulesForDifficulty(input.difficulty).filter(
    (ruleId) => !isNoError || ENG001_CP001_NO_ERROR_RULE_IDS.includes(ruleId),
  );
  return deterministicPick(`${input.seed}:rule:${input.qlId}:${input.difficulty}`, allowed);
}

export interface GenerateEng001Cp001V2Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: GrammarRuleId;
}

export function generateEng001Cp001QuestionV2(input: GenerateEng001Cp001V2Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(
    `${input.seed}:ql`,
    ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const,
  );
  const ruleId = chooseRule({
    difficulty: input.difficulty,
    qlId,
    ruleId: input.ruleId,
    seed: input.seed,
  });
  const candidate = buildEng001Cp001CandidateV2({
    ruleId,
    difficulty: input.difficulty,
    seed: `${input.seed}:${ruleId}`,
  });
  const isNoError = qlId === "ENG-001-QL007";
  const sourceSegments = isNoError ? candidate.correctSegments : candidate.errorSegments;
  const sourceErrorIndex = isNoError ? null : candidate.errorIndex;
  const shaped = qlId === "ENG-001-QL002"
    ? shapeThreeSegmentsPreserveError(sourceSegments, sourceErrorIndex!, input.seed)
    : { segments: [...sourceSegments], errorIndex: sourceErrorIndex };
  const includeNoError = qlId !== "ENG-001-QL001";
  const options = optionLabels(shaped.segments.length, includeNoError);
  const correctOptionIndex = shaped.errorIndex ?? shaped.segments.length;
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(candidate.correctSegments);
  const explanation = isNoError
    ? `There is no error. ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`
    : `The error is in segment ${answerLabel}: “${shaped.segments[shaped.errorIndex!]!}”. ${candidate.explanationApplication} Replace “${candidate.errorSpan}” with “${candidate.correction}”. Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-001-CP001-V2:${qlId}:${candidate.candidateId}:${input.seed}`,
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
      candidateId: candidate.candidateId,
      reviewOnly: true,
    },
  };
}
