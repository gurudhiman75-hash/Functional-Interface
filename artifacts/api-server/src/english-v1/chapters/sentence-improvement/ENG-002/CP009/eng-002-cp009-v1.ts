import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, GerundInfinitiveParticipleRuleId } from "../../../../core/types";
import { buildEng001Cp009CandidateV1 } from "../../../error-spotting/ENG-001/CP009/eng-001-cp009-v1";

export const ENG002_CP009_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp009QuestionV1 {
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
    cpId: "ENG-002-CP009";
    ruleId: GerundInfinitiveParticipleRuleId;
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

export interface GenerateEng002Cp009V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: GerundInfinitiveParticipleRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
const clean = (value: string) => value.replace(/\s+/g, " ").trim();
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

interface Focus { prefix: string; correctTarget: string; wrongTarget: string; suffix: string }
function focusedDifference(correctSegment: string, wrongSegment: string): Focus {
  const correct = clean(correctSegment).split(" ");
  const wrong = clean(wrongSegment).split(" ");
  let prefixCount = 0;
  while (prefixCount < correct.length && prefixCount < wrong.length && correct[prefixCount]!.toLowerCase() === wrong[prefixCount]!.toLowerCase()) prefixCount += 1;
  let suffixCount = 0;
  while (suffixCount < correct.length - prefixCount && suffixCount < wrong.length - prefixCount && correct[correct.length - 1 - suffixCount]!.toLowerCase() === wrong[wrong.length - 1 - suffixCount]!.toLowerCase()) suffixCount += 1;
  let correctMid = correct.slice(prefixCount, correct.length - suffixCount);
  let wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount);
  if (!correctMid.length || !wrongMid.length) {
    if (suffixCount > 0) {
      suffixCount -= 1;
      correctMid = correct.slice(prefixCount, correct.length - suffixCount);
      wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount);
    } else if (prefixCount > 0) {
      prefixCount -= 1;
      correctMid = correct.slice(prefixCount, correct.length - suffixCount);
      wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount);
    }
  }
  const prefix = correct.slice(0, prefixCount).join(" ");
  let suffix = suffixCount ? correct.slice(correct.length - suffixCount).join(" ") : "";
  let correctTarget = correctMid.join(" ");
  let wrongTarget = wrongMid.join(" ");
  const cp = correctTarget.match(/([,.;:!?]+)$/)?.[1] ?? "";
  const wp = wrongTarget.match(/([,.;:!?]+)$/)?.[1] ?? "";
  if (cp && cp === wp) {
    correctTarget = correctTarget.slice(0, -cp.length);
    wrongTarget = wrongTarget.slice(0, -wp.length);
    suffix = suffix ? `${cp} ${suffix}` : cp;
  }
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) {
    throw new Error(`CP009 could not isolate target: ${correctSegment} <> ${wrongSegment}`);
  }
  return { prefix, correctTarget, wrongTarget, suffix };
}

const BASE_BY_FORM: Readonly<Record<string, string>> = Object.freeze({
  reading: "read", read: "read", speaking: "speak", spoke: "speak", leaving: "leave", left: "leave",
  joining: "join", joined: "join", resting: "rest", rested: "rest", submitting: "submit", submitted: "submit",
  waiting: "wait", waited: "wait", finishing: "finish", finished: "finish", checking: "check", checked: "check",
  completing: "complete", completed: "complete", learning: "learn", learned: "learn", learnt: "learn",
  walking: "walk", walked: "walk", working: "work", worked: "work", collecting: "collect", collected: "collect",
  confirming: "confirm", confirmed: "confirm", locking: "lock", locked: "lock", smoking: "smoke", smoked: "smoke",
  delaying: "delay", delayed: "delay", taking: "take", took: "take", taken: "take", reviewing: "review", reviewed: "review",
  postponing: "postpone", postponed: "postpone", wearing: "wear", wore: "wear", worn: "wear",
  practising: "practise", practised: "practise", carrying: "carry", carried: "carry", stopping: "stop", stopped: "stop",
  skipping: "skip", skipped: "skip", handling: "handle", handled: "handle", travelling: "travel", traveled: "travel", travelled: "travel",
  inspecting: "inspect", inspected: "inspect", clarifying: "clarify", clarified: "clarify", sending: "send", sent: "send",
  drilling: "drill", drilled: "drill", obtaining: "obtain", obtained: "obtain", restoring: "restore", restored: "restore",
  reconsidering: "reconsider", reconsidered: "reconsider", providing: "provide", provided: "provide", keeping: "keep", kept: "keep",
  revising: "revise", revised: "revise", resuming: "resume", resumed: "resume", reporting: "report", reported: "report",
  consulting: "consult", consulted: "consult", verifying: "verify", verified: "verify", appealing: "appeal", appealed: "appeal"
});

const PAST_BY_BASE: Readonly<Record<string, string>> = Object.freeze({
  read: "read", speak: "spoke", leave: "left", join: "joined", rest: "rested", submit: "submitted", wait: "waited",
  finish: "finished", check: "checked", complete: "completed", learn: "learned", walk: "walked", work: "worked",
  collect: "collected", confirm: "confirmed", lock: "locked", smoke: "smoked", delay: "delayed", take: "took",
  review: "reviewed", postpone: "postponed", wear: "wore", practise: "practised", carry: "carried", stop: "stopped",
  skip: "skipped", handle: "handled", travel: "travelled", inspect: "inspected", clarify: "clarified", send: "sent",
  drill: "drilled", obtain: "obtained", restore: "restored", reconsider: "reconsidered", provide: "provided", keep: "kept",
  revise: "revised", resume: "resumed", report: "reported", consult: "consulted", verify: "verified", appeal: "appealed"
});

function gerund(base: string) {
  const special: Readonly<Record<string, string>> = {
    read: "reading", speak: "speaking", leave: "leaving", join: "joining", rest: "resting", submit: "submitting", wait: "waiting",
    finish: "finishing", check: "checking", complete: "completing", learn: "learning", walk: "walking", work: "working",
    collect: "collecting", confirm: "confirming", lock: "locking", smoke: "smoking", delay: "delaying", take: "taking",
    review: "reviewing", postpone: "postponing", wear: "wearing", practise: "practising", carry: "carrying", stop: "stopping",
    skip: "skipping", handle: "handling", travel: "travelling", inspect: "inspecting", clarify: "clarifying", send: "sending",
    drill: "drilling", obtain: "obtaining", restore: "restoring", reconsider: "reconsidering", provide: "providing", keep: "keeping",
    revise: "revising", resume: "resuming", report: "reporting", consult: "consulting", verify: "verifying", appeal: "appealing"
  };
  return special[base] ?? `${base}ing`;
}
function thirdPerson(base: string) {
  if (/[^aeiou]y$/i.test(base)) return `${base.slice(0, -1)}ies`;
  if (/(?:s|sh|ch|x|z|o)$/i.test(base)) return `${base}es`;
  return `${base}s`;
}
function past(base: string) { return PAST_BY_BASE[base] ?? (/e$/i.test(base) ? `${base}d` : `${base}ed`); }

function extractBase(...values: string[]) {
  for (const value of values) {
    const toMatch = value.match(/\bto\s+([A-Za-z]+)\b/i);
    if (toMatch) return BASE_BY_FORM[toMatch[1]!.toLowerCase()] ?? toMatch[1]!.toLowerCase();
    for (const token of value.match(/[A-Za-z]+/g) ?? []) {
      const base = BASE_BY_FORM[token.toLowerCase()];
      if (base) return base;
    }
  }
  throw new Error(`CP009 could not identify verb base from ${values.join(" <> ")}`);
}

type VerbMode = "gerund" | "toInfinitive" | "bare" | "third" | "past";
function replacementFor(base: string, mode: VerbMode) {
  if (mode === "gerund") return gerund(base);
  if (mode === "toInfinitive") return `to ${base}`;
  if (mode === "third") return thirdPerson(base);
  if (mode === "past") return past(base);
  return base;
}
function renderVerbVariant(target: string, base: string, mode: VerbMode) {
  const replacement = replacementFor(base, mode);
  const toPattern = new RegExp(`\\bto\\s+${base}\\b`, "i");
  if (toPattern.test(target)) return target.replace(toPattern, replacement);
  const forms = unique([gerund(base), past(base), thirdPerson(base), base]);
  for (const form of forms) {
    const pattern = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(target)) return target.replace(pattern, replacement);
  }
  return target;
}

function incorrectVariants(ruleId: GerundInfinitiveParticipleRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget);
  const wrong = clean(wrongTarget);
  const base = extractBase(correct, wrong);
  let modes: VerbMode[];
  switch (ruleId) {
    case "GR-GIP-001": modes = ["toInfinitive", "bare", "third", "past"]; break;
    case "GR-GIP-002": modes = ["gerund", "bare", "third", "past"]; break;
    case "GR-GIP-003": modes = ["bare", "gerund", "third", "past"]; break;
    case "GR-GIP-004": modes = ["toInfinitive", "gerund", "third", "past"]; break;
    case "GR-GIP-005": modes = ["toInfinitive", "gerund", "third", "past"]; break;
    case "GR-GIP-006": modes = ["bare", "toInfinitive", "third", "past"]; break;
    case "GR-GIP-007": modes = ["gerund", "bare", "third", "past"]; break;
    case "GR-GIP-008": modes = ["gerund", "bare", "third", "past"]; break;
    case "GR-GIP-009": modes = ["gerund", "toInfinitive", "bare", "third", "past"]; break;
    case "GR-GIP-010": modes = ["gerund", "bare", "third", "past"]; break;
  }
  const variants = unique([wrong, ...modes.map((mode) => renderVerbVariant(correct, base, mode))])
    .filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} safe distractors for ${correct}`);
  return variants;
}
function replacementChoices(ruleId: GerundInfinitiveParticipleRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget)
    .filter((value) => value.toLowerCase() !== targetText.toLowerCase() && value.toLowerCase() !== correctTarget.toLowerCase());
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

function concept(ruleId: GerundInfinitiveParticipleRuleId) {
  switch (ruleId) {
    case "GR-GIP-001": return "Some verbs, such as enjoy, avoid and consider, are followed by a gerund (-ing form).";
    case "GR-GIP-002": return "Some verbs, such as decide, hope, agree and manage, are followed by a to-infinitive.";
    case "GR-GIP-003": return "After verbs such as advise, ask, encourage and remind, an object can be followed by a to-infinitive.";
    case "GR-GIP-004": return "In active sentences, make and let take an object followed by the base form of the verb, without to.";
    case "GR-GIP-005": return "A core modal such as can, may, must or should is followed by the base form of the verb, without to.";
    case "GR-GIP-006": return "When a verb comes after a preposition, the -ing form is normally used in this structure.";
    case "GR-GIP-007": return "Used to for a past habit takes the base verb, but be/get used to is followed by a noun or an -ing form.";
    case "GR-GIP-008": return "A to-infinitive can show the purpose of an action—why someone went, came, called or stayed.";
    case "GR-GIP-009": return "With verbs such as remember and stop, the gerund and to-infinitive can have different meanings, so the context decides the form.";
    case "GR-GIP-010": return "Non-finite structures need the correct participle form, such as having + past participle or a past participle for a passive relation.";
  }
}
function tag(candidate: ReturnType<typeof buildEng001Cp009CandidateV1>, prefix: string) {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`);
  return value;
}
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (match) => match.toLowerCase()); }
function focusedSegments(base: readonly string[], sourceIndex: number, focus: Focus, targetText: string) {
  const out: string[] = [];
  let targetIndex = -1;
  base.forEach((segment, index) => {
    if (index !== sourceIndex) out.push(segment);
    else {
      if (focus.prefix) out.push(focus.prefix);
      targetIndex = out.length;
      out.push(targetText);
      if (focus.suffix) out.push(focus.suffix);
    }
  });
  if (targetIndex < 0) throw new Error("CP009 lost target index");
  return { segments: out, targetIndex };
}

export function generateEng002Cp009QuestionV1(input: GenerateEng002Cp009V1Input): Eng002Cp009QuestionV1 {
  const candidate = buildEng001Cp009CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no non-finite target`);
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const ruleId = candidate.ruleId as GerundInfinitiveParticipleRuleId;
  const focus = focusedDifference(correctSegments[candidate.errorIndex]!, errorSegments[candidate.errorIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp009:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const visible = focusedSegments(noImprovement ? correctSegments : errorSegments, candidate.errorIndex, focus, targetText);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp009:options`, replacementChoices(ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost correct replacement`);
  const sentence = sentenceFromSegments(visible.segments);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const application = lowerLeading(candidate.explanationApplication);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” should be “${focus.correctTarget}”. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-002-CP009-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP009_STEM,
    sentence,
    segments: visible.segments,
    targetIndex: visible.targetIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP009", ruleId, mutationId: candidate.mutationId,
      difficulty: candidate.difficulty, dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId,
      semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true,
    },
  };
}
