import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { ConjunctionRuleId, DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { buildEng001Cp007CandidateV1 } from "../../../error-spotting/ENG-001/CP007/eng-001-cp007-v1";

export const ENG002_CP007_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp007QuestionV1 {
  questionId: string; stem: string; sentence: string; segments: readonly string[]; targetIndex: number; targetText: string;
  options: readonly string[]; correctOptionIndex: number; correctedSentence: string; explanation: string;
  metadata: { track: "english"; chapterId: "ENG-002"; cpId: "ENG-002-CP007"; ruleId: ConjunctionRuleId; mutationId: string;
    difficulty: EnglishDifficulty; dimensions: DifficultyDimensions; seed: string; candidateId: string; semanticDomain: string; sceneId: string;
    noImprovement: boolean; reviewOnly: true };
}
export interface GenerateEng002Cp007V1Input { seed: string; difficulty: EnglishDifficulty; ruleId?: ConjunctionRuleId; sceneId?: string; noImprovement?: boolean }

const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
const clean = (value: string) => value.replace(/\s+/g, " ").trim();
function unique(values: readonly string[]) { const seen = new Set<string>(); const out: string[] = []; for (const raw of values) { const value = clean(raw); const key = value.toLowerCase(); if (value && !seen.has(key)) { seen.add(key); out.push(value); } } return out; }

interface Focus { prefix: string; correctTarget: string; wrongTarget: string; suffix: string }
function focusDifference(correctSegment: string, wrongSegment: string): Focus {
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
  const prefix = correct.slice(0, prefixCount).join(" ");
  let suffix = suffixCount ? correct.slice(correct.length - suffixCount).join(" ") : "";
  let correctTarget = correctMid.join(" "), wrongTarget = wrongMid.join(" ");
  const cp = correctTarget.match(/([,.;:!?]+)$/)?.[1] ?? "", wp = wrongTarget.match(/([,.;:!?]+)$/)?.[1] ?? "";
  if (cp && cp === wp) { correctTarget = correctTarget.slice(0, -cp.length); wrongTarget = wrongTarget.slice(0, -wp.length); suffix = suffix ? `${cp} ${suffix}` : cp; }
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) throw new Error(`CP007 could not isolate target: ${correctSegment} <> ${wrongSegment}`);
  return { prefix, correctTarget, wrongTarget, suffix };
}
function targetForRule(ruleId: ConjunctionRuleId, correctSegment: string, wrongSegment: string): Focus {
  if (ruleId === "GR-CON-007") {
    const punctuation = correctSegment.match(/([,.;:!?]+)$/)?.[1] ?? "";
    return { prefix: "", correctTarget: clean(correctSegment).replace(/[,.;:!?]+$/, ""), wrongTarget: clean(wrongSegment).replace(/[,.;:!?]+$/, ""), suffix: punctuation };
  }
  return focusDifference(correctSegment, wrongSegment);
}

const GERUND_BY_BASE: Readonly<Record<string, string>> = Object.freeze({
  stretch: "stretching", update: "updating", speak: "speaking", write: "writing", review: "reviewing", record: "recording",
  report: "reporting", improve: "improving", reduce: "reducing", verify: "verifying", check: "checking", recommend: "recommending",
  resolve: "resolving", compare: "comparing", identify: "identifying", plan: "planning", send: "sending",
});
function gerundPhrase(basePhrase: string) {
  const [first, ...rest] = clean(basePhrase).split(" ");
  const gerund = GERUND_BY_BASE[first!.toLowerCase()] ?? `${first}ing`;
  return [gerund, ...rest].join(" ");
}
function parallelVariants(correct: string, wrong: string) {
  if (/^how to\s+/i.test(correct)) {
    const base = correct.replace(/^how to\s+/i, ""); const gerund = gerundPhrase(base);
    return [wrong, `by ${gerund}`, `for ${gerund}`];
  }
  if (/^to\s+/i.test(correct)) {
    const base = correct.replace(/^to\s+/i, ""); const gerund = gerundPhrase(base);
    return [wrong, `by ${gerund}`, `for ${gerund}`];
  }
  if (/^for\s+/i.test(correct)) {
    const rest = correct.replace(/^for\s+/i, "");
    return [wrong, `to ${rest}`, `among ${rest}`];
  }
  if (/^\w+ing\b/i.test(correct)) return [wrong, `by ${correct}`, `for ${correct}`];
  const gerund = gerundPhrase(correct);
  return [wrong, `by ${gerund}`, `for ${gerund}`];
}
function tokenSet(correct: string, wrong: string, tokens: readonly string[]) { return unique([wrong, ...tokens.filter((token) => token.toLowerCase() !== correct.toLowerCase() && token.toLowerCase() !== wrong.toLowerCase())]); }
function incorrectVariants(ruleId: ConjunctionRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget), wrong = clean(wrongTarget);
  let variants: string[] = [wrong]; const lower = correct.toLowerCase();
  switch (ruleId) {
    case "GR-CON-001":
      if (["but", "yet", "so", "and", "or"].includes(lower)) variants = tokenSet(correct, wrong, ["but", "so", "and", "or", "yet"]);
      else if (/\bbut\b/i.test(correct)) variants.push(correct.replace(/\bbut\b/i, "so"), correct.replace(/\bbut\b/i, "and"));
      else if (/\bso\b/i.test(correct)) variants.push(correct.replace(/\bso\b/i, "but"), correct.replace(/\bso\b/i, "or"));
      else if (/\byet\b/i.test(correct)) variants.push(correct.replace(/\byet\b/i, "so"), correct.replace(/\byet\b/i, "and"));
      break;
    case "GR-CON-002":
      if (lower === "and") variants = tokenSet(correct, wrong, ["or", "nor", "as well as"]);
      else if (lower === "both") variants = tokenSet(correct, wrong, ["either", "neither", "whether"]);
      else variants.push(correct.replace(/\band\b/i, "or"), correct.replace(/\band\b/i, "nor"), correct.replace(/\bboth\b/i, "either"));
      break;
    case "GR-CON-003":
      if (lower === "or") variants = tokenSet(correct, wrong, ["and", "nor", "but"]);
      else if (lower === "either") variants = tokenSet(correct, wrong, ["both", "neither", "whether"]);
      else variants.push(correct.replace(/\bor\b/i, "and"), correct.replace(/\bor\b/i, "nor"), correct.replace(/\beither\b/i, "both"));
      break;
    case "GR-CON-004":
      if (lower === "nor") variants = tokenSet(correct, wrong, ["or", "and", "but"]);
      else if (lower === "neither") variants = tokenSet(correct, wrong, ["either", "both", "whether"]);
      else variants.push(correct.replace(/\bnor\b/i, "or"), correct.replace(/\bnor\b/i, "and"), correct.replace(/\bneither\b/i, "either"));
      break;
    case "GR-CON-005":
      if (lower === "but") variants = tokenSet(correct, wrong, ["and", "or", "so"]);
      else if (/^also\s+/i.test(correct)) { const rest = correct.replace(/^also\s+/i, ""); variants.push(`only ${rest}`, `just ${rest}`); }
      else if (/\bbut also\b/i.test(correct)) variants.push(correct.replace(/\bbut also\b/i, "and also"), correct.replace(/\bbut also\b/i, "but only"));
      else variants.push(correct.replace(/\bbut\b/i, "and"), correct.replace(/\balso\b/i, "only"));
      break;
    case "GR-CON-006": variants.push(`and ${correct}`, `yet ${correct}`, `so ${correct}`); break;
    case "GR-CON-007":
      if (/\bbecause of\b/i.test(correct)) variants.push(correct.replace(/\bbecause of\b/i, "because"), correct.replace(/\bbecause of\b/i, "although"), correct.replace(/\bbecause of\b/i, "since"));
      else variants.push(correct.replace(/\bbecause\b/i, "because of"), correct.replace(/\bbecause\b/i, "despite"), correct.replace(/\bbecause\b/i, "due to"));
      break;
    case "GR-CON-008":
      if (/^despite\b/i.test(correct)) variants.push(correct.replace(/^despite\b/i, "although"), correct.replace(/^despite\b/i, "despite of"), correct.replace(/^despite\b/i, "though"));
      else if (/^although\b/i.test(correct) || /^though\b/i.test(correct)) variants.push(correct.replace(/^(although|though)\b/i, "despite"), correct.replace(/^(although|though)\b/i, "despite of"), correct.replace(/^(although|though)\b/i, "in spite"));
      else variants.push(`although ${correct}`, `despite of ${correct}`, `though ${correct}`);
      break;
    case "GR-CON-009":
    case "GR-CON-010": variants = parallelVariants(correct, wrong); break;
  }
  variants = unique(variants).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} safe distractors for ${correct}`);
  return variants;
}
function replacementChoices(ruleId: ConjunctionRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget).filter((v) => v.toLowerCase() !== targetText.toLowerCase() && v.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? wrongs.slice(0, 3) : unique([correctTarget, ...wrongs]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three safe choices for ${correctTarget}`); return values;
}
function shuffleThree(seed: string, values: readonly string[]) { const out = [...values]; for (let i = out.length - 1; i > 0; i -= 1) { const j = deterministicIndex(`${seed}:shuffle:${i}`, i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function concept(ruleId: ConjunctionRuleId) {
  switch (ruleId) {
    case "GR-CON-001": return "Choose a conjunction that matches the relation between the ideas: for example, but or yet for contrast and so for a result.";
    case "GR-CON-002": return "The fixed pair is both ... and. The two parts joined by it should have matching form.";
    case "GR-CON-003": return "Use either ... or when the sentence presents two alternatives.";
    case "GR-CON-004": return "Use neither ... nor when both alternatives are rejected.";
    case "GR-CON-005": return "The standard pair is not only ... but also, and the joined parts should remain parallel.";
    case "GR-CON-006": return "Although or though already shows contrast, so do not add but to the same clause pair.";
    case "GR-CON-007": return "Use because before a full clause, but because of before a noun or noun phrase.";
    case "GR-CON-008": return "Use despite or in spite of before a noun phrase, but although before a full clause.";
    case "GR-CON-009": return "Items in the same coordinated list should use the same grammatical pattern.";
    case "GR-CON-010": return "The elements after the two halves of a correlative pair should be grammatically parallel.";
  }
}
function tag(candidate: ReturnType<typeof buildEng001Cp007CandidateV1>, prefix: string) { const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length); if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`); return value; }
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }
function focusedSegments(base: readonly string[], sourceIndex: number, focus: Focus, targetText: string) { const out: string[] = []; let targetIndex = -1; base.forEach((segment, index) => { if (index !== sourceIndex) out.push(segment); else { if (focus.prefix) out.push(focus.prefix); targetIndex = out.length; out.push(targetText); if (focus.suffix) out.push(focus.suffix); } }); if (targetIndex < 0) throw new Error("CP007 lost target index"); return { segments: out, targetIndex }; }

export function generateEng002Cp007QuestionV1(input: GenerateEng002Cp007V1Input): Eng002Cp007QuestionV1 {
  const candidate = buildEng001Cp007CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no conjunction mutation target`);
  const correctSegments = [...candidate.correctSegments], errorSegments = [...candidate.errorSegments], sourceIndex = candidate.errorIndex, ruleId = candidate.ruleId as ConjunctionRuleId;
  const focus = targetForRule(ruleId, correctSegments[sourceIndex]!, errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp007:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const visible = focusedSegments(noImprovement ? correctSegments : errorSegments, sourceIndex, focus, targetText);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp007:options`, replacementChoices(ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"], correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost correct replacement`);
  const sentence = sentenceFromSegments(visible.segments), correctedSentence = sentenceFromSegments(correctSegments), application = lowerLeading(candidate.explanationApplication);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” should be “${focus.correctTarget}”. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`;
  return { questionId: `ENG-002-CP007-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`, stem: ENG002_CP007_STEM,
    sentence, segments: visible.segments, targetIndex: visible.targetIndex, targetText, options, correctOptionIndex, correctedSentence, explanation,
    metadata: { track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP007", ruleId, mutationId: candidate.mutationId, difficulty: candidate.difficulty,
      dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true } };
}
