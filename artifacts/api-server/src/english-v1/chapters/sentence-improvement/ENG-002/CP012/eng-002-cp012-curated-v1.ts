import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions } from "../../../../core/types";
import { VOICE_NARRATION_RULE_BY_ID, type VoiceNarrationRuleId } from "../../../../grammar/voice-narration";
import { buildEng001Cp012CandidateV1 } from "../../../error-spotting/ENG-001/CP012/eng-001-cp012-v1";
import { ENG002_CP012_STEM, type Eng002Cp012QuestionV1, type GenerateEng002Cp012V1Input } from "./eng-002-cp012-v1";
import { generateEng002Cp012ReviewedQuestionV1 } from "./eng-002-cp012-reviewed-v1";

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
function stripPunctuation(value: string) {
  const punctuation = value.match(/([,.;:!?]+)$/)?.[1] ?? "";
  return { body: clean(value).replace(/[,.;:!?]+$/, ""), punctuation };
}
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
function tag(candidate: ReturnType<typeof buildEng001Cp012CandidateV1>, prefix: string) {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`);
  return value;
}
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }

type WrongFactory = (correct: string, authoredWrong: string) => string[];

function intransitiveWrongs(correct: string, authoredWrong: string) {
  const raw = [authoredWrong];
  const simplePast = correct.match(/\b(arrived|occurred|disappeared|remained)\b/i);
  if (simplePast) {
    const participle = simplePast[1]!;
    const plural = /\b(guests|documents|members)\b/i.test(correct);
    raw.push(correct.replace(new RegExp(`\\b${participle}\\b`, "i"), `had been ${participle}`));
    raw.push(correct.replace(new RegExp(`\\b${participle}\\b`, "i"), `${plural ? "were" : "was"} being ${participle}`));
  } else if (/\bbelong\b/i.test(correct)) {
    raw.push(correct.replace(/\bbelong\b/i, "have been belonged"));
    raw.push(correct.replace(/\bbelong\b/i, "are being belonged"));
  } else if (/\bconsists\b/i.test(correct)) {
    raw.push(correct.replace(/\bconsists\b/i, "has been consisted"));
    raw.push(correct.replace(/\bconsists\b/i, "is being consisted"));
  }
  return unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function commandWrongs(correct: string, authoredWrong: string) {
  const raw = [authoredWrong];
  const told = correct.match(/\btold\s+(.+?)\s+(not\s+)?to\s+([a-z]+)(.*)$/i);
  if (told) {
    const object = told[1]!;
    const neg = told[2] ?? "";
    const verb = told[3]!;
    const rest = told[4] ?? "";
    raw.push(correct.replace(told[0]!, `said ${object} ${neg}to ${verb}${rest}`));
    raw.push(correct.replace(told[0]!, `told to ${object} ${neg}to ${verb}${rest}`));
    raw.push(correct.replace(told[0]!, `told ${object} that ${neg}${verb}${rest}`));
  }
  const asked = correct.match(/\basked\s+(.+?)\s+(not\s+)?to\s+([a-z]+)(.*)$/i);
  if (asked) {
    const object = asked[1]!;
    const neg = asked[2] ?? "";
    const verb = asked[3]!;
    const rest = asked[4] ?? "";
    raw.push(correct.replace(asked[0]!, `said ${object} ${neg}to ${verb}${rest}`));
    raw.push(correct.replace(asked[0]!, `asked to ${object} ${neg}to ${verb}${rest}`));
    raw.push(correct.replace(asked[0]!, `asked ${object} that ${neg}${verb}${rest}`));
  }
  return unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function reportingVerbWrongs(correct: string, authoredWrong: string) {
  const raw = [authoredWrong];
  if (/\btold me\b/i.test(correct)) raw.push(correct.replace(/\btold me\b/i, "said me"), correct.replace(/\btold me\b/i, "explained me"), correct.replace(/\btold me\b/i, "informed to me"));
  else if (/\bsaid that\b/i.test(correct)) raw.push(correct.replace(/\bsaid that\b/i, "told that"), correct.replace(/\bsaid that\b/i, "informed that"), correct.replace(/\bsaid that\b/i, "said me that"));
  else if (/\bexplained to us\b/i.test(correct)) raw.push(correct.replace(/\bexplained to us\b/i, "explained us"), correct.replace(/\bexplained to us\b/i, "told to us"), correct.replace(/\bexplained to us\b/i, "informed to us"));
  else if (/\binformed us\b/i.test(correct)) raw.push(correct.replace(/\binformed us\b/i, "informed to us"), correct.replace(/\binformed us\b/i, "said us"), correct.replace(/\binformed us\b/i, "explained us"));
  return unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function mergeCommandContext(correctSegments: string[], errorSegments: string[], sourceIndex: number) {
  const current = stripPunctuation(correctSegments[sourceIndex]!).body;
  if (sourceIndex <= 0 || !/^(?:not\s+)?to\s+[a-z]+/i.test(current)) return sourceIndex;
  const previous = correctSegments[sourceIndex - 1]!;
  if (!/\b(?:asked|told)\b/i.test(previous)) return sourceIndex;
  correctSegments.splice(sourceIndex - 1, 2, `${previous} ${correctSegments[sourceIndex]}`.replace(/\s+/g, " ").trim());
  errorSegments.splice(sourceIndex - 1, 2, `${errorSegments[sourceIndex - 1]} ${errorSegments[sourceIndex]}`.replace(/\s+/g, " ").trim());
  return sourceIndex - 1;
}

function generateCuratedRule(input: GenerateEng002Cp012V1Input, forcedRuleId: VoiceNarrationRuleId, wrongFactory: WrongFactory): Eng002Cp012QuestionV1 {
  const candidate = buildEng001Cp012CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: forcedRuleId, sceneId: input.sceneId });
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  let sourceIndex = candidate.errorIndex;
  if (forcedRuleId === "GR-VNR-010") sourceIndex = mergeCommandContext(correctSegments, errorSegments, sourceIndex);
  const correct = stripPunctuation(correctSegments[sourceIndex]!);
  const wrong = stripPunctuation(errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp012:no-improvement`, 0.25);
  const targetText = noImprovement ? correct.body : wrong.body;
  const visibleSegments = noImprovement ? [...correctSegments] : [...errorSegments];
  visibleSegments[sourceIndex] = correct.punctuation ? `${targetText}${correct.punctuation}` : targetText;
  const wrongs = wrongFactory(correct.body, wrong.body).filter((value) => value.toLowerCase() !== targetText.toLowerCase());
  const choices = noImprovement ? wrongs.slice(0, 3) : unique([correct.body, ...wrongs]).slice(0, 3);
  if (choices.length !== 3) throw new Error(`${forcedRuleId} could not build three curated choices for ${correct.body}`);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp012:options`, choices);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(correct.body);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const principle = VOICE_NARRATION_RULE_BY_ID[forcedRuleId].principle.replace(/^./, (c) => c.toUpperCase());
  const explanation = noImprovement
    ? `No improvement is needed: “${correct.body}” is already correct for this voice/narration structure. Concept: ${principle} Here: ${lowerLeading(candidate.explanationApplication)} Correct sentence: ${correctedSentence}`
    : `Error: “${wrong.body}” does not fit the required voice/narration structure. Use “${correct.body}”. Concept: ${principle} Here: ${lowerLeading(candidate.explanationApplication)} Correct sentence: ${correctedSentence}`;
  return {
    questionId: `ENG-002-CP012-V1:${candidate.ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP012_STEM,
    sentence: sentenceFromSegments(visibleSegments),
    segments: visibleSegments,
    targetIndex: sourceIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP012", ruleId: candidate.ruleId,
      mutationId: candidate.mutationId, difficulty: candidate.difficulty, dimensions: candidate.dimensions as DifficultyDimensions,
      seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"),
      noImprovement, reviewOnly: true,
    },
  };
}

export function generateEng002Cp012CuratedQuestionV1(input: GenerateEng002Cp012V1Input): Eng002Cp012QuestionV1 {
  if (input.ruleId === "GR-VNR-003") return generateCuratedRule(input, "GR-VNR-003", intransitiveWrongs);
  if (input.ruleId === "GR-VNR-010") return generateCuratedRule(input, "GR-VNR-010", commandWrongs);
  if (input.ruleId === "GR-VNR-012") return generateCuratedRule(input, "GR-VNR-012", reportingVerbWrongs);
  try {
    return generateEng002Cp012ReviewedQuestionV1(input);
  } catch (error) {
    const candidate = buildEng001Cp012CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
    const sceneId = tag(candidate, "scene:");
    if (candidate.ruleId === "GR-VNR-003") return generateCuratedRule({ ...input, ruleId: "GR-VNR-003", sceneId }, "GR-VNR-003", intransitiveWrongs);
    if (candidate.ruleId === "GR-VNR-010") return generateCuratedRule({ ...input, ruleId: "GR-VNR-010", sceneId }, "GR-VNR-010", commandWrongs);
    if (candidate.ruleId === "GR-VNR-012") return generateCuratedRule({ ...input, ruleId: "GR-VNR-012", sceneId }, "GR-VNR-012", reportingVerbWrongs);
    throw error;
  }
}
