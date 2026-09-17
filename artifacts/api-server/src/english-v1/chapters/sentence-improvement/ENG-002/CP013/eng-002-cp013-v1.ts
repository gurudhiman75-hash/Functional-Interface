import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { IDIOMATIC_USAGE_RULE_BY_ID, type IdiomaticUsageRuleId } from "../../../../grammar/idiomatic-usage";
import { buildEng001Cp013CandidateV1 } from "../../../error-spotting/ENG-001/CP013/eng-001-cp013-v1";

export const ENG002_CP013_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp013QuestionV1 {
  questionId: string;
  stem: string;
  sentence: string;
  segments: readonly string[];
  targetIndex: number;
  targetText: string;
  options: readonly string[];
  correctOptionIndex: number;
  correctedSentence: string;
  explanation: string;
  metadata: {
    track: "english";
    chapterId: "ENG-002";
    cpId: "ENG-002-CP013";
    ruleId: IdiomaticUsageRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    candidateId: string;
    semanticDomain: string;
    sceneId: string;
    noImprovement: boolean;
    reviewOnly: true;
  };
}

export interface GenerateEng002Cp013V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: IdiomaticUsageRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
function unique(values: readonly string[]) {
  const seen = new Set<string>();
  return values.map(clean).filter((value) => {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function shuffleThree(seed: string, values: readonly string[]) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = deterministicIndex(`${seed}:shuffle:${i}`, i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
function tag(candidate: ReturnType<typeof buildEng001Cp013CandidateV1>, prefix: string) {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`);
  return value;
}

interface Focus { prefix: string; correctTarget: string; wrongTarget: string; suffix: string }
function focusedDifference(correctSegment: string, wrongSegment: string, ruleId: IdiomaticUsageRuleId): Focus {
  const correctWhole = clean(correctSegment).replace(/([,.;:!?]+)$/, "");
  const wrongWhole = clean(wrongSegment).replace(/([,.;:!?]+)$/, "");
  if (ruleId === "GR-USG-007") return { prefix: "", correctTarget: correctWhole, wrongTarget: wrongWhole, suffix: "" };
  const correct = correctWhole.split(" ");
  const wrong = wrongWhole.split(" ");
  let prefixCount = 0;
  while (prefixCount < correct.length && prefixCount < wrong.length && correct[prefixCount]!.toLowerCase() === wrong[prefixCount]!.toLowerCase()) prefixCount += 1;
  let suffixCount = 0;
  while (suffixCount < correct.length - prefixCount && suffixCount < wrong.length - prefixCount && correct[correct.length - 1 - suffixCount]!.toLowerCase() === wrong[wrong.length - 1 - suffixCount]!.toLowerCase()) suffixCount += 1;
  let cEnd = correct.length - suffixCount;
  let wEnd = wrong.length - suffixCount;
  if (cEnd === prefixCount || wEnd === prefixCount) {
    if (suffixCount > 0) { suffixCount -= 1; cEnd = correct.length - suffixCount; wEnd = wrong.length - suffixCount; }
    else if (prefixCount > 0) { prefixCount -= 1; }
  }
  const correctTarget = correct.slice(prefixCount, cEnd).join(" ");
  const wrongTarget = wrong.slice(prefixCount, wEnd).join(" ");
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) throw new Error(`CP013 could not isolate target: ${correctSegment} <> ${wrongSegment}`);
  return {
    prefix: correct.slice(0, prefixCount).join(" "),
    correctTarget,
    wrongTarget,
    suffix: suffixCount ? correct.slice(correct.length - suffixCount).join(" ") : "",
  };
}

function replaceWord(value: string, from: string, to: string) {
  return value.replace(new RegExp(`\\b${from}\\b`, "i"), to);
}
function incorrectVariants(ruleId: IdiomaticUsageRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget);
  const wrong = clean(wrongTarget);
  let variants: string[] = [wrong];
  switch (ruleId) {
    case "GR-USG-001":
    case "GR-USG-002":
      variants.push(replaceWord(correct, "to", "than"), replaceWord(correct, "to", "with"), replaceWord(correct, "to", "against"));
      break;
    case "GR-USG-003":
      variants.push(replaceWord(correct, "from", "with"), replaceWord(correct, "from", "of"), replaceWord(correct, "from", "against"));
      break;
    case "GR-USG-004":
      variants.push(correct.replace(/\bof\b/i, "for"), correct.replace(/\bof\b/i, "in"), correct.replace(/\bof\b/i, "with"));
      break;
    case "GR-USG-005":
      variants.push(replaceWord(correct, "on", "for"), replaceWord(correct, "on", "at"), replaceWord(correct, "on", "to"));
      break;
    case "GR-USG-006":
      variants.push(replaceWord(correct, "from", "for"), replaceWord(correct, "from", "against"), replaceWord(correct, "from", "with"));
      break;
    case "GR-USG-007": {
      if (/^Despite\b/i.test(correct)) {
        variants.push(correct.replace(/^Despite\b/i, "Despite of"), correct.replace(/^Despite\b/i, "In despite of"), correct.replace(/^Despite\b/i, "Despite to"));
      } else if (/\bin spite of\b/i.test(correct)) {
        variants.push(correct.replace(/\bin spite of\b/i, "in spite"), correct.replace(/\bin spite of\b/i, "despite of"), correct.replace(/\bin spite of\b/i, "in despite of"));
      }
      break;
    }
    case "GR-USG-008":
      variants.push(replaceWord(correct, "than", "when"), replaceWord(correct, "than", "then"), replaceWord(correct, "than", "as"));
      break;
    case "GR-USG-009":
      variants.push(replaceWord(correct, "when", "than"), replaceWord(correct, "when", "then"), replaceWord(correct, "when", "as"));
      break;
  }
  variants = unique(variants).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} distractors for ${correct}`);
  return variants;
}

function generateChoices(ruleId: IdiomaticUsageRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget)
    .filter((value) => value.toLowerCase() !== targetText.toLowerCase() && value.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? wrongs.slice(0, 3) : unique([correctTarget, ...wrongs]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three choices for ${correctTarget}`);
  return values;
}

export function generateEng002Cp013QuestionV1(input: GenerateEng002Cp013V1Input): Eng002Cp013QuestionV1 {
  const candidate = buildEng001Cp013CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  const sourceIndex = candidate.errorIndex;
  const focus = focusedDifference(candidate.correctSegments[sourceIndex]!, candidate.errorSegments[sourceIndex]!, candidate.ruleId);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp013:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const sourceSegments = noImprovement ? [...candidate.correctSegments] : [...candidate.errorSegments];
  const punctuation = sourceSegments[sourceIndex]!.match(/([,.;:!?]+)$/)?.[1] ?? "";
  const rebuilt = [focus.prefix, targetText, focus.suffix].filter(Boolean).join(" ").replace(/\s+([,.!?;:])/g, "$1");
  sourceSegments[sourceIndex] = `${rebuilt}${punctuation}`;

  const choices = generateChoices(candidate.ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp013:options`, choices);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  const correctedSentence = sentenceFromSegments(candidate.correctSegments);
  const principle = IDIOMATIC_USAGE_RULE_BY_ID[candidate.ruleId].principle;
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct here. Concept: ${principle} Here: ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” does not fit this fixed usage pattern. Use “${focus.correctTarget}”. Concept: ${principle} Here: ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-002-CP013-V1:${candidate.ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP013_STEM,
    sentence: sentenceFromSegments(sourceSegments),
    segments: sourceSegments,
    targetIndex: sourceIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP013", ruleId: candidate.ruleId,
      mutationId: candidate.mutationId, difficulty: candidate.difficulty, dimensions: candidate.dimensions,
      seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"),
      noImprovement, reviewOnly: true,
    },
  };
}
