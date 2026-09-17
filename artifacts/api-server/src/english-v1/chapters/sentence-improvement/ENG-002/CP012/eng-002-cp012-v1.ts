import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { VOICE_NARRATION_RULE_BY_ID, type VoiceNarrationRuleId } from "../../../../grammar/voice-narration";
import { buildEng001Cp012CandidateV1 } from "../../../error-spotting/ENG-001/CP012/eng-001-cp012-v1";

export const ENG002_CP012_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp012QuestionV1 {
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
    cpId: "ENG-002-CP012";
    ruleId: VoiceNarrationRuleId;
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

export interface GenerateEng002Cp012V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: VoiceNarrationRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
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
function stripPunctuation(value: string) {
  const punctuation = value.match(/([,.;:!?]+)$/)?.[1] ?? "";
  return { body: clean(value).replace(/[,.;:!?]+$/, ""), punctuation };
}
function focusSegment(correct: string, wrong: string) {
  const c = stripPunctuation(correct);
  const w = stripPunctuation(wrong);
  return { correctTarget: c.body, wrongTarget: w.body, suffix: c.punctuation };
}
function focusedSegments(base: readonly string[], sourceIndex: number, targetText: string, suffix: string) {
  const out = [...base];
  out[sourceIndex] = suffix ? `${targetText}${suffix}` : targetText;
  return { segments: out, targetIndex: sourceIndex };
}

const GERUND: Readonly<Record<string, string>> = Object.freeze({
  close: "closing", touch: "touching", bring: "bringing", enter: "entering", disclose: "disclosing", send: "sending",
});
const BASE_FROM_PAST: Readonly<Record<string, string>> = Object.freeze({
  arrived: "arrive", occurred: "occur", disappeared: "disappear", remained: "remain",
});

function passiveParticipleVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/\b(was|were)\b/i.test(correct)) {
    raw.push(correct.replace(/\b(was|were)\b/i, "$1 being"));
    raw.push(correct.replace(/\b(was|were)\b/i, "had been"));
  }
  return raw;
}
function passiveChainVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/\bwill have been\b/i.test(correct)) raw.push(correct.replace(/\bwill have been\b/i, "will be"), correct.replace(/\bwill have been\b/i, "has been"));
  else if (/\bhad been\b/i.test(correct)) raw.push(correct.replace(/\bhad been\b/i, "has been"), correct.replace(/\bhad been\b/i, "was"));
  else if (/\bhas been\b/i.test(correct)) raw.push(correct.replace(/\bhas been\b/i, "had been"), correct.replace(/\bhas been\b/i, "was"));
  else if (/\bwas being\b/i.test(correct)) raw.push(correct.replace(/\bwas being\b/i, "is being"), correct.replace(/\bwas being\b/i, "was"));
  else if (/\bis being\b/i.test(correct)) raw.push(correct.replace(/\bis being\b/i, "was being"), correct.replace(/\bis being\b/i, "is"));
  return raw;
}
function intransitiveVariants(correct: string, wrong: string) {
  const raw = [wrong];
  const past = Object.keys(BASE_FROM_PAST).find((verb) => new RegExp(`\\b${verb}\\b`, "i").test(correct));
  if (past) {
    const base = BASE_FROM_PAST[past]!;
    raw.push(correct.replace(new RegExp(`\\b${past}\\b`, "i"), `did ${past}`));
    raw.push(correct.replace(new RegExp(`\\b${past}\\b`, "i"), `had ${base}`));
  } else if (/\bbelong\b/i.test(correct)) raw.push(correct.replace(/\bbelong\b/i, "are belong"), correct.replace(/\bbelong\b/i, "does belong"));
  else if (/\bconsists\b/i.test(correct)) raw.push(correct.replace(/\bconsists\b/i, "is consist"), correct.replace(/\bconsists\b/i, "does consists"));
  return raw;
}
function modalPassiveVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/\b(could|might) have been\b/i.test(correct)) {
    raw.push(correct.replace(/\b(could|might) have been\b/i, "$1 have being"));
    raw.push(correct.replace(/\b(could|might) have been\b/i, "$1 been"));
  } else if (/\b(must|can|should|might) be\b/i.test(correct)) {
    raw.push(correct.replace(/\b(must|can|should|might) be\b/i, "$1 being"));
    raw.push(correct.replace(/\b(must|can|should|might) be\b/i, "$1 been"));
  }
  return raw;
}
function retainedObjectVariants(wrong: string) {
  const raw = [wrong];
  if (/\b(was|were)\b/i.test(wrong)) {
    raw.push(wrong.replace(/\b(was|were)\b/i, "had been"));
    raw.push(wrong.replace(/\b(was|were)\b/i, "$1 being"));
  }
  return raw;
}
function backshiftVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/\bhad been working\b/i.test(correct)) raw.push(correct.replace(/\bhad been working\b/i, "was working"), correct.replace(/\bhad been working\b/i, "has been working"));
  else if (/\bhad finished\b/i.test(correct)) raw.push(correct.replace(/\bhad finished\b/i, "finished"), correct.replace(/\bhad finished\b/i, "has finished"));
  else if (/\bwas running\b/i.test(correct)) raw.push(correct.replace(/\bwas running\b/i, "is running"), correct.replace(/\bwas running\b/i, "has been running"));
  else if (/\bwas busy\b/i.test(correct)) raw.push(correct.replace(/\bwas busy\b/i, "is busy"), correct.replace(/\bwas busy\b/i, "has been busy"));
  else if (/\bwould finish\b/i.test(correct)) raw.push(correct.replace(/\bwould finish\b/i, "will finish"), correct.replace(/\bwould finish\b/i, "can finish"));
  else if (/\bcould join\b/i.test(correct)) raw.push(correct.replace(/\bcould join\b/i, "can join"), correct.replace(/\bcould join\b/i, "will join"));
  return raw;
}
function replaceFirstPronoun(text: string, map: Readonly<Record<string, string>>) {
  return text.replace(/\b(she|he|her|him|his|my|your)\b/i, (match) => {
    const replacement = map[match.toLowerCase()] ?? match;
    return /^[A-Z]/.test(match) ? replacement.replace(/^./, (c) => c.toUpperCase()) : replacement;
  });
}
function pronounVariants(correct: string, wrong: string) {
  return [
    wrong,
    replaceFirstPronoun(correct, { she: "he", he: "she", her: "his", him: "her", his: "her", my: "his", your: "his" }),
    replaceFirstPronoun(correct, { she: "they", he: "they", her: "their", him: "them", his: "their", my: "our", your: "their" }),
  ];
}
function deicticVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/the following day/i.test(correct)) raw.push(correct.replace(/the following day/i, "the previous day"), correct.replace(/the following day/i, "that same day"));
  else if (/there during the visit/i.test(correct)) raw.push(correct.replace(/there during the visit/i, "here during the visit"), correct.replace(/there during the visit/i, "there after the visit"));
  else if (/the following month/i.test(correct)) raw.push(correct.replace(/the following month/i, "the previous month"), correct.replace(/the following month/i, "this month"));
  else if (/that week/i.test(correct)) raw.push(correct.replace(/that week/i, "this week"), correct.replace(/that week/i, "next week"));
  else if (/two days later/i.test(correct)) raw.push(correct.replace(/two days later/i, "two days earlier"), correct.replace(/two days later/i, "that day"));
  else if (/there that night/i.test(correct)) raw.push(correct.replace(/there that night/i, "here that night"), correct.replace(/there that night/i, "there tonight"));
  return raw;
}
function reportedQuestionVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/\bwhether\b/i.test(correct)) raw.push(correct.replace(/\bwhether\b/i, "that"), correct.replace(/\bwhether\b/i, "if whether"));
  else {
    const match = correct.match(/\basked\s+(where|what time|why)\b/i);
    if (match) {
      const wh = match[1]!;
      raw.push(correct.replace(new RegExp(`\\basked\\s+${wh.replace(" ", "\\s+")}\\b`, "i"), `asked that ${wh}`));
      raw.push(correct.replace(new RegExp(`\\basked\\s+${wh.replace(" ", "\\s+")}\\b`, "i"), `asked whether ${wh}`));
    }
  }
  return raw;
}
function commandVariants(correct: string, wrong: string) {
  const raw = [wrong];
  const match = correct.match(/\b(not\s+)?to\s+(close|touch|bring|enter|disclose|send)\b/i);
  if (match) {
    const negative = Boolean(match[1]);
    const base = match[2]!.toLowerCase();
    const gerund = GERUND[base]!;
    const whole = match[0]!;
    raw.push(correct.replace(whole, negative ? `not ${gerund}` : gerund));
    raw.push(correct.replace(whole, negative ? `to not ${gerund}` : `for ${gerund}`));
  }
  return raw;
}
function universalTruthVariants(correct: string, wrong: string) {
  const raw = [wrong];
  const entries = [
    { present: "revolves", base: "revolve", gerund: "revolving" },
    { present: "make", base: "make", gerund: "making" },
    { present: "expands", base: "expand", gerund: "expanding" },
    { present: "flows", base: "flow", gerund: "flowing" },
  ];
  const entry = entries.find(({ present }) => new RegExp(`\\b${present}\\b`, "i").test(correct));
  if (entry) {
    raw.push(correct.replace(new RegExp(`\\b${entry.present}\\b`, "i"), `would ${entry.base}`));
    raw.push(correct.replace(new RegExp(`\\b${entry.present}\\b`, "i"), `had been ${entry.gerund}`));
  }
  return raw;
}
function reportingVerbVariants(correct: string, wrong: string) {
  const raw = [wrong];
  if (/\btold me\b/i.test(correct)) raw.push(correct.replace(/\btold me\b/i, "explained me"), correct.replace(/\btold me\b/i, "informed to me"));
  else if (/\bsaid that\b/i.test(correct)) raw.push(correct.replace(/\bsaid that\b/i, "told that"), correct.replace(/\bsaid that\b/i, "informed that"));
  else if (/\bexplained to us\b/i.test(correct)) raw.push(correct.replace(/\bexplained to us\b/i, "explained us"), correct.replace(/\bexplained to us\b/i, "told to us"));
  else if (/\binformed us\b/i.test(correct)) raw.push(correct.replace(/\binformed us\b/i, "informed to us"), correct.replace(/\binformed us\b/i, "said us"));
  return raw;
}

function incorrectVariants(ruleId: VoiceNarrationRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget);
  const wrong = clean(wrongTarget);
  let raw: string[] = [];
  switch (ruleId) {
    case "GR-VNR-001": raw = passiveParticipleVariants(correct, wrong); break;
    case "GR-VNR-002": raw = passiveChainVariants(correct, wrong); break;
    case "GR-VNR-003": raw = intransitiveVariants(correct, wrong); break;
    case "GR-VNR-004": raw = modalPassiveVariants(correct, wrong); break;
    case "GR-VNR-005": raw = retainedObjectVariants(wrong); break;
    case "GR-VNR-006": raw = backshiftVariants(correct, wrong); break;
    case "GR-VNR-007": raw = pronounVariants(correct, wrong); break;
    case "GR-VNR-008": raw = deicticVariants(correct, wrong); break;
    case "GR-VNR-009": raw = reportedQuestionVariants(correct, wrong); break;
    case "GR-VNR-010": raw = commandVariants(correct, wrong); break;
    case "GR-VNR-011": raw = universalTruthVariants(correct, wrong); break;
    case "GR-VNR-012": raw = reportingVerbVariants(correct, wrong); break;
  }
  const variants = unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} safe distractors for ${correct}`);
  return variants;
}
function replacementChoices(ruleId: VoiceNarrationRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget).filter((value) => value.toLowerCase() !== targetText.toLowerCase() && value.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? wrongs.slice(0, 3) : unique([correctTarget, ...wrongs]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three safe choices for ${correctTarget}`);
  return values;
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
function concept(ruleId: VoiceNarrationRuleId) { return VOICE_NARRATION_RULE_BY_ID[ruleId].principle.replace(/^./, (c) => c.toUpperCase()); }
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }

export function generateEng002Cp012QuestionV1(input: GenerateEng002Cp012V1Input): Eng002Cp012QuestionV1 {
  const candidate = buildEng001Cp012CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const sourceIndex = candidate.errorIndex;
  const focus = focusSegment(correctSegments[sourceIndex]!, errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp012:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const visible = focusedSegments(noImprovement ? correctSegments : errorSegments, sourceIndex, targetText, focus.suffix);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp012:options`, replacementChoices(candidate.ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost correct replacement`);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct for this voice/narration structure. Concept: ${concept(candidate.ruleId)} Here: ${lowerLeading(candidate.explanationApplication)} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” does not fit the required voice/narration structure. Use “${focus.correctTarget}”. Concept: ${concept(candidate.ruleId)} Here: ${lowerLeading(candidate.explanationApplication)} Correct sentence: ${correctedSentence}`;
  return {
    questionId: `ENG-002-CP012-V1:${candidate.ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP012_STEM,
    sentence: sentenceFromSegments(visible.segments),
    segments: visible.segments,
    targetIndex: visible.targetIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP012", ruleId: candidate.ruleId,
      mutationId: candidate.mutationId, difficulty: candidate.difficulty, dimensions: candidate.dimensions,
      seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"),
      noImprovement, reviewOnly: true,
    },
  };
}
