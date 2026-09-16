import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions } from "../../../../core/types";
import { VOICE_NARRATION_RULE_BY_ID, type VoiceNarrationRuleId } from "../../../../grammar/voice-narration";
import { buildEng001Cp012CandidateV1 } from "../../../error-spotting/ENG-001/CP012/eng-001-cp012-v1";
import { ENG002_CP012_STEM, generateEng002Cp012QuestionV1, type Eng002Cp012QuestionV1, type GenerateEng002Cp012V1Input } from "./eng-002-cp012-v1";

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
function stripPunctuation(value: string) {
  const punctuation = value.match(/([,.;:!?]+)$/)?.[1] ?? "";
  return { body: clean(value).replace(/[,.;:!?]+$/, ""), punctuation };
}
function unique(values: readonly string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = clean(raw);
    const key = value.toLowerCase();
    if (value && !seen.has(key)) { seen.add(key); out.push(value); }
  }
  return out;
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

function backshiftWrongs(correct: string, authoredWrong: string) {
  const raw = [authoredWrong];
  if (/\bwas busy\b/i.test(correct)) raw.push(correct.replace(/\bwas busy\b/i, "is busy"), correct.replace(/\bwas busy\b/i, "has been busy"), correct.replace(/\bwas busy\b/i, "had been busy"));
  else if (/\bwas running\b/i.test(correct)) raw.push(correct.replace(/\bwas running\b/i, "is running"), correct.replace(/\bwas running\b/i, "has been running"), correct.replace(/\bwas running\b/i, "had been running"));
  else if (/\bhad finished\b/i.test(correct)) raw.push(correct.replace(/\bhad finished\b/i, "has finished"), correct.replace(/\bhad finished\b/i, "finished"), correct.replace(/\bhad finished\b/i, "was finishing"));
  else if (/\bhad been working\b/i.test(correct)) raw.push(correct.replace(/\bhad been working\b/i, "has been working"), correct.replace(/\bhad been working\b/i, "was working"), correct.replace(/\bhad been working\b/i, "is working"));
  else if (/\bwould finish\b/i.test(correct)) raw.push(correct.replace(/\bwould finish\b/i, "will finish"), correct.replace(/\bwould finish\b/i, "can finish"), correct.replace(/\bwould finish\b/i, "has finished"));
  else if (/\bcould join\b/i.test(correct)) raw.push(correct.replace(/\bcould join\b/i, "can join"), correct.replace(/\bcould join\b/i, "will join"), correct.replace(/\bcould join\b/i, "has joined"));
  return unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function deicticWrongs(correct: string, authoredWrong: string) {
  const raw = [authoredWrong];
  if (/the following day/i.test(correct)) raw.push(correct.replace(/the following day/i, "the previous day"), correct.replace(/the following day/i, "that same day"), correct.replace(/the following day/i, "two days later"));
  else if (/there during the visit/i.test(correct)) raw.push(correct.replace(/there during the visit/i, "there after the visit"), correct.replace(/there during the visit/i, "there before the visit"), correct.replace(/there during the visit/i, "here after the visit"));
  else if (/the following month/i.test(correct)) raw.push(correct.replace(/the following month/i, "the previous month"), correct.replace(/the following month/i, "this month"), correct.replace(/the following month/i, "two months later"));
  else if (/that week/i.test(correct)) raw.push(correct.replace(/that week/i, "this week"), correct.replace(/that week/i, "next week"), correct.replace(/that week/i, "the following week"));
  else if (/two days later/i.test(correct)) raw.push(correct.replace(/two days later/i, "two days earlier"), correct.replace(/two days later/i, "that day"), correct.replace(/two days later/i, "the following week"));
  else if (/there that night/i.test(correct)) raw.push(correct.replace(/there that night/i, "here that night"), correct.replace(/there that night/i, "there tonight"), correct.replace(/there that night/i, "here tonight"));
  return unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function commandWrongs(correct: string, authoredWrong: string) {
  const raw = [authoredWrong];
  const negative = correct.match(/\bnot to\s+(close|touch|bring|enter|disclose|send)\b/i);
  if (negative) {
    const base = negative[1]!.toLowerCase();
    const ing: Readonly<Record<string, string>> = { close: "closing", touch: "touching", bring: "bringing", enter: "entering", disclose: "disclosing", send: "sending" };
    raw.push(correct.replace(new RegExp(`\\bnot to\\s+${base}\\b`, "i"), `not ${ing[base]}`));
    raw.push(correct.replace(new RegExp(`\\bnot to\\s+${base}\\b`, "i"), `not ${base}`));
    raw.push(correct.replace(new RegExp(`\\bnot to\\s+${base}\\b`, "i"), `not to ${ing[base]}`));
  } else {
    const positive = correct.match(/\bto\s+(close|touch|bring|enter|disclose|send)\b/i);
    if (positive) {
      const base = positive[1]!.toLowerCase();
      const ing: Readonly<Record<string, string>> = { close: "closing", touch: "touching", bring: "bringing", enter: "entering", disclose: "disclosing", send: "sending" };
      raw.push(correct.replace(new RegExp(`\\bto\\s+${base}\\b`, "i"), ing[base]!));
      raw.push(correct.replace(new RegExp(`\\bto\\s+${base}\\b`, "i"), `to ${ing[base]}`));
      raw.push(correct.replace(new RegExp(`\\bto\\s+${base}\\b`, "i"), `for ${ing[base]}`));
    }
  }
  return unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function generateFromWrongs(input: GenerateEng002Cp012V1Input, forcedRuleId: VoiceNarrationRuleId, wrongFactory: (correct: string, authoredWrong: string) => string[]): Eng002Cp012QuestionV1 {
  const candidate = buildEng001Cp012CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: forcedRuleId, sceneId: input.sceneId });
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const sourceIndex = candidate.errorIndex;
  const correct = stripPunctuation(correctSegments[sourceIndex]!);
  const wrong = stripPunctuation(errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp012:no-improvement`, 0.25);
  const targetText = noImprovement ? correct.body : wrong.body;
  const visibleSegments = noImprovement ? [...correctSegments] : [...errorSegments];
  visibleSegments[sourceIndex] = correct.punctuation ? `${targetText}${correct.punctuation}` : targetText;
  const wrongs = wrongFactory(correct.body, wrong.body).filter((value) => value.toLowerCase() !== targetText.toLowerCase());
  const choices = noImprovement ? wrongs.slice(0, 3) : unique([correct.body, ...wrongs]).slice(0, 3);
  if (choices.length !== 3) throw new Error(`${forcedRuleId} could not build three reviewed choices for ${correct.body}`);
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

export function generateEng002Cp012ReviewedQuestionV1(input: GenerateEng002Cp012V1Input): Eng002Cp012QuestionV1 {
  if (input.ruleId === "GR-VNR-006") return generateFromWrongs(input, "GR-VNR-006", backshiftWrongs);
  if (input.ruleId === "GR-VNR-008") return generateFromWrongs(input, "GR-VNR-008", deicticWrongs);
  if (input.ruleId === "GR-VNR-010") return generateFromWrongs(input, "GR-VNR-010", commandWrongs);
  try {
    return generateEng002Cp012QuestionV1(input);
  } catch (error) {
    const candidate = buildEng001Cp012CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
    const sceneId = tag(candidate, "scene:");
    if (candidate.ruleId === "GR-VNR-006") return generateFromWrongs({ ...input, ruleId: "GR-VNR-006", sceneId }, "GR-VNR-006", backshiftWrongs);
    if (candidate.ruleId === "GR-VNR-008") return generateFromWrongs({ ...input, ruleId: "GR-VNR-008", sceneId }, "GR-VNR-008", deicticWrongs);
    if (candidate.ruleId === "GR-VNR-010") return generateFromWrongs({ ...input, ruleId: "GR-VNR-010", sceneId }, "GR-VNR-010", commandWrongs);
    throw error;
  }
}
