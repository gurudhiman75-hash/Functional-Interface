import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { CONDITIONAL_RULE_BY_ID, type ConditionalRuleId } from "../../../../grammar/conditionals";
import { buildEng001Cp011CandidateV1 } from "../../../error-spotting/ENG-001/CP011/eng-001-cp011-v1";

export const ENG002_CP011_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp011QuestionV1 {
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
    cpId: "ENG-002-CP011";
    ruleId: ConditionalRuleId;
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

export interface GenerateEng002Cp011V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ConditionalRuleId;
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
function wholeSegmentTarget(correct: string, wrong: string) {
  const c = stripPunctuation(correct);
  const w = stripPunctuation(wrong);
  return { correctTarget: c.body, wrongTarget: w.body, suffix: c.punctuation };
}
function focusedSegments(base: readonly string[], sourceIndex: number, targetText: string, suffix: string) {
  const out = [...base];
  out[sourceIndex] = suffix ? `${targetText}${suffix}` : targetText;
  return { segments: out, targetIndex: sourceIndex };
}

interface VerbFamily { base: string; present: string; past: string; participle: string }
const VERBS: readonly VerbFamily[] = [
  { base: "reach", present: "reaches", past: "reached", participle: "reached" },
  { base: "be", present: "is", past: "was", participle: "been" },
  { base: "lock", present: "locks", past: "locked", participle: "locked" },
  { base: "turn", present: "turns", past: "turned", participle: "turned" },
  { base: "detect", present: "detects", past: "detected", participle: "detected" },
  { base: "fall", present: "falls", past: "fell", participle: "fallen" },
  { base: "breach", present: "breaches", past: "breached", participle: "breached" },
  { base: "exceed", present: "exceeds", past: "exceeded", participle: "exceeded" },
  { base: "reject", present: "rejects", past: "rejected", participle: "rejected" },
  { base: "attract", present: "attracts", past: "attracted", participle: "attracted" },
  { base: "confirm", present: "confirms", past: "confirmed", participle: "confirmed" },
  { base: "receive", present: "receives", past: "received", participle: "received" },
  { base: "arrive", present: "arrives", past: "arrived", participle: "arrived" },
  { base: "open", present: "opens", past: "opened", participle: "opened" },
  { base: "work", present: "works", past: "worked", participle: "worked" },
  { base: "start", present: "starts", past: "started", participle: "started" },
  { base: "grant", present: "grants", past: "granted", participle: "granted" },
  { base: "remain", present: "remains", past: "remained", participle: "remained" },
  { base: "come", present: "comes", past: "came", participle: "come" },
  { base: "provide", present: "provides", past: "provided", participle: "provided" },
  { base: "offer", present: "offers", past: "offered", participle: "offered" },
  { base: "live", present: "lives", past: "lived", participle: "lived" },
  { base: "take", present: "takes", past: "took", participle: "taken" },
  { base: "hear", present: "hears", past: "heard", participle: "heard" },
  { base: "bring", present: "brings", past: "brought", participle: "brought" },
  { base: "write", present: "writes", past: "wrote", participle: "written" },
  { base: "mention", present: "mentions", past: "mentioned", participle: "mentioned" },
  { base: "accept", present: "accepts", past: "accepted", participle: "accepted" },
  { base: "qualify", present: "qualifies", past: "qualified", participle: "qualified" },
  { base: "lead", present: "leads", past: "led", participle: "led" },
  { base: "handle", present: "handles", past: "handled", participle: "handled" },
  { base: "back", present: "backs", past: "backed", participle: "backed" },
  { base: "complete", present: "completes", past: "completed", participle: "completed" },
  { base: "identify", present: "identifies", past: "identified", participle: "identified" },
  { base: "report", present: "reports", past: "reported", participle: "reported" },
  { base: "attach", present: "attaches", past: "attached", participle: "attached" },
  { base: "change", present: "changes", past: "changed", participle: "changed" },
  { base: "become", present: "becomes", past: "became", participle: "become" },
  { base: "decline", present: "declines", past: "declined", participle: "declined" },
  { base: "renew", present: "renews", past: "renewed", participle: "renewed" },
  { base: "obtain", present: "obtains", past: "obtained", participle: "obtained" },
  { base: "carry", present: "carries", past: "carried", participle: "carried" },
  { base: "show", present: "shows", past: "showed", participle: "shown" },
  { base: "refill", present: "refills", past: "refilled", participle: "refilled" },
];

function replaceWord(text: string, from: string, to: string) {
  return text.replace(new RegExp(`\\b${from}\\b`, "i"), (match) => /^[A-Z]/.test(match) ? to.replace(/^./, (c) => c.toUpperCase()) : to);
}
function findFamily(text: string, kind: "present" | "past" | "base" | "participle") {
  return VERBS.find((family) => new RegExp(`\\b${family[kind]}\\b`, "i").test(text));
}
function modalizePresent(text: string, modal: "will" | "would") {
  const family = findFamily(text, "present");
  if (!family) return text;
  return replaceWord(text, family.present, `${modal} ${family.base}`);
}
function pastizePresent(text: string) {
  const family = findFamily(text, "present");
  return family ? replaceWord(text, family.present, family.past) : text;
}
function perfectizePast(text: string) {
  const family = findFamily(text, "past");
  return family ? replaceWord(text, family.past, `had ${family.participle}`) : text;
}
function modalizePast(text: string, modal: "will" | "would") {
  const family = findFamily(text, "past");
  return family ? replaceWord(text, family.past, `${modal} ${family.base}`) : text;
}
function resultAlternatives(text: string) {
  const match = text.match(/\bwill\s+([A-Za-z]+)\b/i);
  if (!match) return [];
  const base = match[1]!.toLowerCase();
  const family = VERBS.find((entry) => entry.base === base);
  const pp = family?.participle ?? (base.endsWith("e") ? `${base}d` : `${base}ed`);
  const past = family?.past ?? pp;
  return [
    text.replace(/\bwill\b/i, "would"),
    text.replace(new RegExp(`\\bwill\\s+${base}\\b`, "i"), `would have ${pp}`),
    text.replace(new RegExp(`\\bwill\\s+${base}\\b`, "i"), past),
  ];
}
function secondResultAlternatives(text: string) {
  const match = text.match(/\bwould\s+([A-Za-z]+)\b/i);
  if (!match) return [];
  const base = match[1]!.toLowerCase();
  const family = VERBS.find((entry) => entry.base === base);
  const pp = family?.participle ?? (base.endsWith("e") ? `${base}d` : `${base}ed`);
  return [text.replace(/\bwould\b/i, "will"), text.replace(/\bwould\b/i, "can"), text.replace(new RegExp(`\\bwould\\s+${base}\\b`, "i"), `would have ${pp}`)];
}
function mixedPastPresentAlternatives(text: string) {
  if (/\bwould be\b/i.test(text)) return [text.replace(/\bwould\b/i, "will"), text.replace(/\bwould be\b/i, "had been"), text.replace(/\bwould be\b/i, "would have been")];
  if (/\bwould\s+[A-Za-z]+\b/i.test(text)) return [text.replace(/\bwould\b/i, "will"), text.replace(/\bwould\b/i, "had"), text.replace(/\bwould\b/i, "would have")];
  return [];
}
function mixedPresentPastAlternatives(text: string) {
  if (/\bwould have\b/i.test(text)) return [text.replace(/\bwould have\b/i, "would"), text.replace(/\bwould have\b/i, "will have"), text.replace(/\bwould have\b/i, "had")];
  return [];
}
function unlessAlternatives(wrong: string) {
  const variants = [wrong];
  if (/\bdo not\s+([A-Za-z]+)\b/i.test(wrong)) {
    variants.push(wrong.replace(/\bdo not\s+([A-Za-z]+)\b/i, "never $1"));
    variants.push(wrong.replace(/\bdo not\s+([A-Za-z]+)\b/i, "cannot $1"));
  } else if (/\bdoes not\s+([A-Za-z]+)\b/i.test(wrong)) {
    variants.push(wrong.replace(/\bdoes not\s+([A-Za-z]+)\b/i, "never $1s"));
    variants.push(wrong.replace(/\bdoes not\s+([A-Za-z]+)\b/i, "cannot $1"));
  } else if (/\bis not\s+([A-Za-z]+)\b/i.test(wrong)) {
    variants.push(wrong.replace(/\bis not\s+([A-Za-z]+)\b/i, "is never $1"));
    variants.push(wrong.replace(/\bis not\s+([A-Za-z]+)\b/i, "cannot be $1"));
  } else if (/\bdo not\b/i.test(wrong)) {
    variants.push(wrong.replace(/\bdo not\b/i, "never"), wrong.replace(/\bdo not\b/i, "cannot"));
  }
  return variants;
}
function inversionHadAlternatives(correct: string, wrong: string) {
  const variants = [wrong];
  const simpleIf = correct.replace(/^Had\b/, "If").replace(/^had\b/, "if");
  variants.push(simpleIf);
  const match = correct.match(/^(Had|had)\s+(.+?)\s+(reported|attached|identified|been)(.*)$/i);
  if (match) {
    const ifWord = match[1] === "Had" ? "If" : "if";
    variants.push(`${ifWord} ${match[2]} would have ${match[3]}${match[4]}`);
  }
  return variants;
}
function inversionFormalAlternatives(correct: string, wrong: string) {
  const variants = [wrong];
  let match = correct.match(/^(Should|should)\s+(.+?)\s+(change|become)(.*)$/i);
  if (match) {
    const ifWord = match[1] === "Should" ? "If" : "if";
    variants.push(`${ifWord} ${match[2]} will ${match[3]}${match[4]}`);
    variants.push(`${ifWord} ${match[2]} would ${match[3]}${match[4]}`);
    return variants;
  }
  match = correct.match(/^(Were|were)\s+(.+?)\s+to\s+(decline|change)(.*)$/i);
  if (match) {
    const ifWord = match[1] === "Were" ? "If" : "if";
    variants.push(`${ifWord} ${match[2]} will ${match[3]}${match[4]}`);
    variants.push(`${ifWord} ${match[2]} would ${match[3]}${match[4]}`);
  }
  return variants;
}

function incorrectVariants(ruleId: ConditionalRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget);
  const wrong = clean(wrongTarget);
  let raw: string[] = [wrong];
  switch (ruleId) {
    case "GR-CND-001": raw.push(modalizePresent(correct, "will"), modalizePresent(correct, "would"), pastizePresent(correct)); break;
    case "GR-CND-002": raw.push(...resultAlternatives(correct)); break;
    case "GR-CND-003": raw.push(modalizePresent(correct, "will"), modalizePresent(correct, "would"), pastizePresent(correct)); break;
    case "GR-CND-004": raw.push(...(/\bwould\b/i.test(correct) ? secondResultAlternatives(correct) : [modalizePast(correct, "will"), modalizePast(correct, "would"), perfectizePast(correct)])); break;
    case "GR-CND-005": raw.push(modalizePast(wrong, "will"), modalizePast(wrong, "would"), perfectizePast(wrong)); break;
    case "GR-CND-006": raw.push(...(/\bwould\b/i.test(correct) ? mixedPastPresentAlternatives(correct) : [modalizePast(wrong, "will"), modalizePast(wrong, "would"), perfectizePast(wrong)])); break;
    case "GR-CND-007": raw.push(...mixedPresentPastAlternatives(correct)); break;
    case "GR-CND-008": raw.push(...unlessAlternatives(wrong)); break;
    case "GR-CND-009": raw.push(...inversionHadAlternatives(correct, wrong)); break;
    case "GR-CND-010": raw.push(...inversionFormalAlternatives(correct, wrong)); break;
  }
  const variants = unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} safe distractors for ${correct}`);
  return variants;
}
function replacementChoices(ruleId: ConditionalRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
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
function tag(candidate: ReturnType<typeof buildEng001Cp011CandidateV1>, prefix: string) {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`);
  return value;
}
function concept(ruleId: ConditionalRuleId) { return CONDITIONAL_RULE_BY_ID[ruleId].principle.replace(/^./, (c) => c.toUpperCase()); }
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }

export function generateEng002Cp011QuestionV1(input: GenerateEng002Cp011V1Input): Eng002Cp011QuestionV1 {
  const candidate = buildEng001Cp011CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const sourceIndex = candidate.errorIndex;
  const focus = wholeSegmentTarget(correctSegments[sourceIndex]!, errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp011:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const visible = focusedSegments(noImprovement ? correctSegments : errorSegments, sourceIndex, targetText, focus.suffix);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp011:options`, replacementChoices(candidate.ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost correct replacement`);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct for this conditional meaning. Concept: ${concept(candidate.ruleId)} Here: ${lowerLeading(candidate.explanationApplication)} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” does not fit the conditional relationship. Use “${focus.correctTarget}”. Concept: ${concept(candidate.ruleId)} Here: ${lowerLeading(candidate.explanationApplication)} Correct sentence: ${correctedSentence}`;
  return {
    questionId: `ENG-002-CP011-V1:${candidate.ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP011_STEM,
    sentence: sentenceFromSegments(visible.segments),
    segments: visible.segments,
    targetIndex: visible.targetIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP011", ruleId: candidate.ruleId,
      mutationId: candidate.mutationId, difficulty: candidate.difficulty, dimensions: candidate.dimensions,
      seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"),
      noImprovement, reviewOnly: true,
    },
  };
}
