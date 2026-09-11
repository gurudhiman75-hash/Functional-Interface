import { deterministicPick } from "../../../../core/deterministic";
import type {
  Eng001QlId,
  Eng001Question,
  Eng001SentenceCandidate,
  EnglishDifficulty,
  TenseRuleId,
} from "../../../../core/types";
import { TENSE_SEQUENCE_RULE_BY_ID } from "../../../../grammar/tenses-sequence";
import {
  buildEng001Cp002CandidateV1,
  ENG001_CP002_V1_NO_ERROR_RULE_IDS,
  rulesForDifficultyCp002V1,
} from "./cp002-patterns-v1";

const STEMS: Record<Eng001QlId, string> = {
  "ENG-001-QL001": "Identify the part of the sentence that contains an error.",
  "ENG-001-QL002": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
  "ENG-001-QL007": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
};

function normalizeSurfaceSegment(segment: string): string {
  return segment
    .replace(/\.\.+$/g, ".")
    .replace(/\bcurrently\.$/i, "at the moment.")
    .replace(/\s+/g, " ")
    .trim();
}

function surfaceSegments(candidate: Eng001SentenceCandidate, segments: readonly string[]): string[] {
  return segments.map((segment, index) => {
    let normalized = normalizeSurfaceSegment(segment);
    if (candidate.ruleId === "GR-TNS-002" && candidate.difficulty === "hard" && index < 2) {
      normalized = normalized.replace(/,$/, "");
    }
    return normalized;
  });
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments
    .map(normalizeSurfaceSegment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\.\.+/g, ".")
    .replace(/\s+/g, " ")
    .trim();
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
  if (segments.length !== 4) throw new Error(`QL002 requires four source segments; received ${segments.length}`);
  const candidates = [0, 1, 2].filter((index) => index !== errorIndex && index + 1 !== errorIndex);
  if (candidates.length === 0) throw new Error(`Unable to preserve error segment ${errorIndex} while shaping QL002`);
  const mergeAt = deterministicPick(`${seed}:cp002:three-segment-merge`, candidates);
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
  ruleId?: TenseRuleId;
  seed: string;
}): TenseRuleId {
  const noError = input.qlId === "ENG-001-QL007";
  if (input.ruleId) {
    const rule = TENSE_SEQUENCE_RULE_BY_ID[input.ruleId];
    if (!rule) throw new Error(`Unknown CP002 tense rule ${input.ruleId}`);
    if (!rule.allowedDifficulties.includes(input.difficulty)) {
      throw new Error(`${input.ruleId} does not support ${input.difficulty}`);
    }
    if (noError && !ENG001_CP002_V1_NO_ERROR_RULE_IDS.includes(input.ruleId)) {
      throw new Error(`${input.ruleId} is not admitted to the CP002 No-error pool`);
    }
    return input.ruleId;
  }

  const allowed = rulesForDifficultyCp002V1(input.difficulty).filter(
    (ruleId) => !noError || ENG001_CP002_V1_NO_ERROR_RULE_IDS.includes(ruleId),
  );
  return deterministicPick(`${input.seed}:cp002:rule:${input.qlId}:${input.difficulty}`, allowed);
}

function simpleRuleReason(candidate: Eng001SentenceCandidate): string {
  switch (candidate.ruleId as TenseRuleId) {
    case "GR-TNS-001": return "A finished past-time marker requires the simple past here.";
    case "GR-TNS-002": return "The action began in the past and is still continuing now.";
    case "GR-TNS-003": return "The time expression describes a repeated routine.";
    case "GR-TNS-004": return "The time expression shows that the action is happening now.";
    case "GR-TNS-005": return "The verb describes a state here and is not normally used in the continuous form.";
    case "GR-TNS-006": return "After “did not”, the main verb must remain in the base form.";
    case "GR-TNS-007": return "The first action was completed before the later past event.";
    case "GR-TNS-008": return "The first action was already in progress when the past interruption occurred.";
    case "GR-TNS-009": return "Only one completed past event is stated, so the simple past is sufficient.";
    case "GR-TNS-010": return "The state began in the past and still holds, so the present perfect simple is used.";
  }
}

export interface GenerateEng001Cp002V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: TenseRuleId;
}

export function generateEng001Cp002QuestionV1(input: GenerateEng001Cp002V1Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(
    `${input.seed}:cp002:ql`,
    ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const,
  );
  const ruleId = chooseRule({ difficulty: input.difficulty, qlId, ruleId: input.ruleId, seed: input.seed });
  const candidate = buildEng001Cp002CandidateV1({
    ruleId,
    difficulty: input.difficulty,
    seed: `${input.seed}:${ruleId}`,
  });

  const isNoError = qlId === "ENG-001-QL007";
  const sourceSegments = isNoError ? candidate.correctSegments : candidate.errorSegments;
  const rawSegments = surfaceSegments(candidate, sourceSegments);
  const rawErrorIndex = isNoError ? null : candidate.errorIndex;
  const shaped = qlId === "ENG-001-QL002"
    ? shapeThreeSegmentsPreserveError(rawSegments, rawErrorIndex!, input.seed)
    : { segments: rawSegments, errorIndex: rawErrorIndex };

  const includeNoError = qlId !== "ENG-001-QL001";
  const options = optionLabels(shaped.segments.length, includeNoError);
  const correctOptionIndex = shaped.errorIndex ?? shaped.segments.length;
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(surfaceSegments(candidate, candidate.correctSegments));
  const correction = candidate.correction ?? "";
  const reason = simpleRuleReason(candidate);
  const explanation = isNoError
    ? `There is no error. ${reason} “${correction}” is correct. Correct sentence: ${correctedSentence}`
    : `Part ${answerLabel} contains the error. ${reason} Use “${correction}”. Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-001-CP002-V1:${qlId}:${candidate.candidateId}:${input.seed}`,
    stem: STEMS[qlId],
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-001",
      cpId: "ENG-001-CP002",
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
