import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, NounQuantifierRuleId } from "../../../../core/types";
import { buildEng001Cp008CandidateV1 } from "../../../error-spotting/ENG-001/CP008/eng-001-cp008-v1";

export const ENG002_CP008_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp008QuestionV1 {
  questionId: string; stem: string; sentence: string; segments: readonly string[]; targetIndex: number; targetText: string;
  options: readonly string[]; correctOptionIndex: number; correctedSentence: string; explanation: string;
  metadata: { track: "english"; chapterId: "ENG-002"; cpId: "ENG-002-CP008"; ruleId: NounQuantifierRuleId; mutationId: string;
    difficulty: EnglishDifficulty; dimensions: DifficultyDimensions; seed: string; candidateId: string; semanticDomain: string; sceneId: string;
    noImprovement: boolean; reviewOnly: true };
}
export interface GenerateEng002Cp008V1Input { seed: string; difficulty: EnglishDifficulty; ruleId?: NounQuantifierRuleId; sceneId?: string; noImprovement?: boolean }

const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
const clean = (value: string) => value.replace(/\s+/g, " ").trim();
function unique(values: readonly string[]) { const seen = new Set<string>(); const out: string[] = []; for (const raw of values) { const value = clean(raw); const key = value.toLowerCase(); if (value && !seen.has(key)) { seen.add(key); out.push(value); } } return out; }
interface Focus { prefix: string; correctTarget: string; wrongTarget: string; suffix: string }

function focusedDifference(correctSegment: string, wrongSegment: string): Focus {
  const correct = clean(correctSegment).split(" "), wrong = clean(wrongSegment).split(" ");
  let prefixCount = 0;
  while (prefixCount < correct.length && prefixCount < wrong.length && correct[prefixCount]!.toLowerCase() === wrong[prefixCount]!.toLowerCase()) prefixCount += 1;
  let suffixCount = 0;
  while (suffixCount < correct.length - prefixCount && suffixCount < wrong.length - prefixCount && correct[correct.length - 1 - suffixCount]!.toLowerCase() === wrong[wrong.length - 1 - suffixCount]!.toLowerCase()) suffixCount += 1;
  let correctMid = correct.slice(prefixCount, correct.length - suffixCount), wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount);
  if (!correctMid.length || !wrongMid.length) {
    if (suffixCount > 0) { suffixCount -= 1; correctMid = correct.slice(prefixCount, correct.length - suffixCount); wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount); }
    else if (prefixCount > 0) { prefixCount -= 1; correctMid = correct.slice(prefixCount, correct.length - suffixCount); wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount); }
  }
  const prefix = correct.slice(0, prefixCount).join(" "); let suffix = suffixCount ? correct.slice(correct.length - suffixCount).join(" ") : "";
  let correctTarget = correctMid.join(" "), wrongTarget = wrongMid.join(" ");
  const cp = correctTarget.match(/([,.;:!?]+)$/)?.[1] ?? "", wp = wrongTarget.match(/([,.;:!?]+)$/)?.[1] ?? "";
  if (cp && cp === wp) { correctTarget = correctTarget.slice(0, -cp.length); wrongTarget = wrongTarget.slice(0, -wp.length); suffix = suffix ? `${cp} ${suffix}` : cp; }
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) throw new Error(`CP008 could not isolate target: ${correctSegment} <> ${wrongSegment}`);
  return { prefix, correctTarget, wrongTarget, suffix };
}
function wholeSegmentFocus(correctSegment: string, wrongSegment: string): Focus {
  const punctuation = correctSegment.match(/([,.;:!?]+)$/)?.[1] ?? "";
  return { prefix: "", correctTarget: clean(correctSegment).replace(/[,.;:!?]+$/, ""), wrongTarget: clean(wrongSegment).replace(/[,.;:!?]+$/, ""), suffix: punctuation };
}
function targetForRule(ruleId: NounQuantifierRuleId, correctSegment: string, wrongSegment: string): Focus {
  if (["GR-NQN-002", "GR-NQN-003", "GR-NQN-005", "GR-NQN-006", "GR-NQN-007", "GR-NQN-008", "GR-NQN-009", "GR-NQN-010"].includes(ruleId)) return wholeSegmentFocus(correctSegment, wrongSegment);
  return focusedDifference(correctSegment, wrongSegment);
}
function matchInitialCase(reference: string, value: string) { return /^[A-Z]/.test(reference) ? value.replace(/^./, (c) => c.toUpperCase()) : value; }
function singularizedRegularError(text: string) { return text.replace(/\b([A-Za-z]+)s(?=\b|[,.;:!?])/g, "$1"); }
function addPossessive(text: string) { const punctuation = text.match(/([,.;:!?]+)$/)?.[1] ?? ""; const bare = punctuation ? text.slice(0, -punctuation.length) : text; return `${bare}'s${punctuation}`; }
function massName(text: string) { return (text.match(/\b(advice|information|furniture|equipment|luggage|paperwork|progress|water|fuel|sugar|rainwater|electricity|waste|evidence|moisture)\b/i)?.[1] ?? "material").toLowerCase(); }
function indefiniteArticle(word: string) { return /^[aeiou]/i.test(word) ? "an" : "a"; }

function pluralOnlyVariants(correct: string, wrong: string) {
  const variants = [wrong];
  if (/\bpairs of\b/i.test(correct)) {
    variants.push(correct.replace(/\bpairs of\b/i, "pair of"));
    variants.push(correct.replace(/\bpairs of\s+/i, "pairs "));
  } else if (/\bpair of\b/i.test(correct)) {
    variants.push(correct.replace(/\bpair of\s+/i, ""));
    variants.push(correct.replace(/\bpair of\b/i, "pair"));
  } else {
    const singular = singularizedRegularError(wrong);
    variants.push(singular, `one ${singular}`);
  }
  return variants;
}
function unitExpressionVariants(correct: string, wrong: string) {
  const stripped = correct.replace(/\b(?:piece|pieces|item|items) of\s+/i, "");
  const missingOf = correct.replace(/\b(piece|pieces|item|items) of\b/i, "$1");
  const mismatchedUnit = /\bpieces of\b/i.test(correct) ? correct.replace(/\bpieces of\b/i, "piece of")
    : /\bpiece of\b/i.test(correct) ? correct.replace(/\bpiece of\b/i, "pieces of")
      : /\bitems of\b/i.test(correct) ? correct.replace(/\bitems of\b/i, "item of")
        : /\bitem of\b/i.test(correct) ? correct.replace(/\bitem of\b/i, "items of") : `one ${massName(correct)}`;
  return [wrong, stripped, missingOf, mismatchedUnit];
}
function numberAmountVariants(correct: string, wrong: string) {
  const numberPattern = /\b(?:the\s+|a\s+large\s+)?number of\b/i;
  const amountPattern = /\b(?:the\s+|a\s+large\s+|an?\s+)?amount of\b/i;
  if (/\bnumber of\b/i.test(correct)) return [wrong, correct.replace(numberPattern, "much"), correct.replace(numberPattern, "a little")];
  return [wrong, correct.replace(amountPattern, "many"), correct.replace(amountPattern, "a few")];
}
function incorrectVariants(ruleId: NounQuantifierRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget), wrong = clean(wrongTarget); let variants: string[] = [wrong];
  switch (ruleId) {
    case "GR-NQN-001":
      variants = /\bmany\b/i.test(correct)
        ? [wrong, matchInitialCase(correct, "a large amount of"), matchInitialCase(correct, "a little")]
        : [wrong, matchInitialCase(correct, "a large number of"), matchInitialCase(correct, "a few")];
      break;
    case "GR-NQN-002": variants.push(correct.replace(/\b(?:a\s+)?few\b/i, "much"), correct.replace(/\b(?:a\s+)?few\b/i, "less")); break;
    case "GR-NQN-003": variants.push(correct.replace(/\b(?:a\s+)?little\b/i, "many"), correct.replace(/\b(?:a\s+)?little\b/i, "fewer")); break;
    case "GR-NQN-004": variants = /\bfewer\b/i.test(correct) ? [wrong, "much", "a little"] : [wrong, "many", "a few"]; break;
    case "GR-NQN-005": variants = numberAmountVariants(correct, wrong); break;
    case "GR-NQN-006": { const mass = massName(correct); variants = [wrong, `several ${mass}`, `${indefiniteArticle(mass)} ${mass}`]; break; }
    case "GR-NQN-007": { const singular = singularizedRegularError(wrong); variants = [wrong, singular, addPossessive(singular)]; break; }
    case "GR-NQN-008": variants = pluralOnlyVariants(correct, wrong); break;
    case "GR-NQN-009": variants = unitExpressionVariants(correct, wrong); break;
    case "GR-NQN-010": variants = [wrong, correct.replace(/\bof the\b/i, "of"), addPossessive(wrong)]; break;
  }
  variants = unique(variants).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} safe distractors for ${correct}`);
  return variants;
}
function replacementChoices(ruleId: NounQuantifierRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget).filter((v) => v.toLowerCase() !== targetText.toLowerCase() && v.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? wrongs.slice(0, 3) : unique([correctTarget, ...wrongs]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three safe choices for ${correctTarget}`); return values;
}
function shuffleThree(seed: string, values: readonly string[]) { const out = [...values]; for (let i = out.length - 1; i > 0; i -= 1) { const j = deterministicIndex(`${seed}:shuffle:${i}`, i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function concept(ruleId: NounQuantifierRuleId) {
  switch (ruleId) {
    case "GR-NQN-001": return "Use many with plural countable nouns and much with uncountable nouns.";
    case "GR-NQN-002": return "Use few or a few with plural countable nouns. Little and a little are used with uncountable nouns.";
    case "GR-NQN-003": return "Use little or a little with uncountable nouns. Few and a few are used with plural countable nouns.";
    case "GR-NQN-004": return "Use fewer with things that can be counted separately, but less with an uncountable quantity.";
    case "GR-NQN-005": return "Use number with plural countable nouns and amount with uncountable nouns.";
    case "GR-NQN-006": return "Common mass nouns such as information, advice, furniture and equipment normally do not take an ordinary plural -s.";
    case "GR-NQN-007": return "Some nouns have irregular plural forms, such as child → children, tooth → teeth, mouse → mice and woman → women.";
    case "GR-NQN-008": return "Plural-only nouns such as trousers, scissors and binoculars stay plural; one unit is expressed with a pair of.";
    case "GR-NQN-009": return "To count an uncountable noun, use a unit expression such as a piece of advice or two pieces of information.";
    case "GR-NQN-010": return "After each of the or one of the, the noun that names the group is plural.";
  }
}
function tag(candidate: ReturnType<typeof buildEng001Cp008CandidateV1>, prefix: string) { const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length); if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`); return value; }
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }
function normalizeSurface(ruleId: NounQuantifierRuleId, correctSegments: string[], errorSegments: string[], sourceIndex: number) {
  let index = sourceIndex;
  if (ruleId === "GR-NQN-008" && index > 0 && /\b(?:pair|pairs) of\s*$/i.test(clean(correctSegments[index - 1]!))) {
    correctSegments[index - 1] = `${clean(correctSegments[index - 1]!)} ${clean(correctSegments[index]!)}`;
    errorSegments[index - 1] = `${clean(errorSegments[index - 1]!)} ${clean(errorSegments[index]!)}`;
    correctSegments[index] = ""; errorSegments[index] = ""; index -= 1;
  }
  if (ruleId === "GR-NQN-009" && index + 1 < correctSegments.length && /^of\s+/i.test(clean(correctSegments[index + 1]!)) && /\b(?:piece|pieces|item|items)\s*$/i.test(clean(correctSegments[index]!))) {
    correctSegments[index] = `${clean(correctSegments[index]!)} ${clean(correctSegments[index + 1]!)}`;
    correctSegments[index + 1] = "";
    errorSegments[index + 1] = "";
  }
  return index;
}
function focusedSegments(base: readonly string[], sourceIndex: number, focus: Focus, targetText: string) { const out: string[] = []; let targetIndex = -1; base.forEach((segment, index) => { if (index !== sourceIndex) { if (segment.trim()) out.push(segment); } else { if (focus.prefix) out.push(focus.prefix); targetIndex = out.length; out.push(targetText); if (focus.suffix) out.push(focus.suffix); } }); if (targetIndex < 0) throw new Error("CP008 lost target index"); return { segments: out, targetIndex }; }

export function generateEng002Cp008QuestionV1(input: GenerateEng002Cp008V1Input): Eng002Cp008QuestionV1 {
  const candidate = buildEng001Cp008CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no noun/quantifier target`);
  const correctSegments = [...candidate.correctSegments], errorSegments = [...candidate.errorSegments], ruleId = candidate.ruleId as NounQuantifierRuleId;
  const sourceIndex = normalizeSurface(ruleId, correctSegments, errorSegments, candidate.errorIndex);
  const focus = targetForRule(ruleId, correctSegments[sourceIndex]!, errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp008:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const visible = focusedSegments(noImprovement ? correctSegments : errorSegments, sourceIndex, focus, targetText);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp008:options`, replacementChoices(ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"], correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost correct replacement`);
  const sentence = sentenceFromSegments(visible.segments), correctedSentence = sentenceFromSegments(correctSegments), application = lowerLeading(candidate.explanationApplication);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” should be “${focus.correctTarget}”. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`;
  return { questionId: `ENG-002-CP008-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`, stem: ENG002_CP008_STEM,
    sentence, segments: visible.segments, targetIndex: visible.targetIndex, targetText, options, correctOptionIndex, correctedSentence, explanation,
    metadata: { track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP008", ruleId, mutationId: candidate.mutationId, difficulty: candidate.difficulty,
      dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true } };
}
