import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, PrepositionRuleId } from "../../../../core/types";
import { buildEng001Cp005CandidateV1 } from "../../../error-spotting/ENG-001/CP005/eng-001-cp005-v1";

export const ENG002_CP005_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp005QuestionV1 {
  questionId: string; stem: string; sentence: string; segments: readonly string[]; targetIndex: number; targetText: string;
  options: readonly string[]; correctOptionIndex: number; correctedSentence: string; explanation: string;
  metadata: { track: "english"; chapterId: "ENG-002"; cpId: "ENG-002-CP005"; ruleId: PrepositionRuleId; mutationId: string;
    difficulty: EnglishDifficulty; dimensions: DifficultyDimensions; seed: string; candidateId: string; semanticDomain: string; sceneId: string;
    noImprovement: boolean; reviewOnly: true };
}
export interface GenerateEng002Cp005V1Input { seed: string; difficulty: EnglishDifficulty; ruleId?: PrepositionRuleId; sceneId?: string; noImprovement?: boolean }

const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
function unique(values: readonly string[]) { const seen = new Set<string>(); const out: string[] = []; for (const raw of values) { const value = raw.replace(/\s+/g, " ").trim(); const key = value.toLowerCase(); if (value && !seen.has(key)) { seen.add(key); out.push(value); } } return out; }
function tokenParts(text: string) { return text.split(/\s+/); }
const bare = (token: string) => token.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");

const ALT: Record<PrepositionRuleId, readonly string[]> = {
  "GR-PRP-001": ["at", "on", "in", "during", "from"],
  "GR-PRP-002": ["at", "on", "in", "into", "over"],
  "GR-PRP-003": ["since", "for", "from", "during", "by"],
  "GR-PRP-004": ["by", "until", "before", "since", "for"],
  "GR-PRP-005": ["between", "among", "with", "inside", "across"],
  "GR-PRP-006": ["in", "into", "at", "on", "within"],
  "GR-PRP-007": ["beside", "besides", "near", "with", "along"],
  "GR-PRP-008": ["in", "for", "of", "with", "to", "on", "from"],
  "GR-PRP-009": ["on", "with", "from", "to", "of", "for", "in"],
  "GR-PRP-010": ["for", "to", "in", "of", "on", "with", "from"],
};

function changedToken(ruleId: PrepositionRuleId, correctTarget: string, wrongTarget: string) {
  const correct = tokenParts(correctTarget), wrong = tokenParts(wrongTarget);
  const limit = Math.min(correct.length, wrong.length);
  const differing = Array.from({ length: limit }, (_, index) => index).filter((index) => bare(correct[index]!) !== bare(wrong[index]!));
  const direct = differing.length === 1 ? differing[0] : undefined;
  const prepositionDiff = differing.find((index) => ALT[ruleId].includes(bare(correct[index]!)));
  const index = direct ?? prepositionDiff;
  if (index == null) throw new Error(`CP005 could not isolate the preposition change: ${correctTarget} <> ${wrongTarget}`);
  return { index, correct };
}
function replaceToken(tokens: readonly string[], index: number, replacement: string) { const copy = [...tokens]; const original = copy[index]!; const prefix = original.match(/^[^A-Za-z]+/)?.[0] ?? ""; const punctuation = original.match(/[^A-Za-z]+$/)?.[0] ?? ""; copy[index] = `${prefix}${replacement}${punctuation}`; return copy.join(" "); }
function distractorPool(ruleId: PrepositionRuleId, correctTarget: string, wrongTarget: string) {
  const diff = changedToken(ruleId, correctTarget, wrongTarget);
  return unique([wrongTarget, ...ALT[ruleId].map((prep) => replaceToken(diff.correct, diff.index, prep))]);
}
function replacementChoices(ruleId: PrepositionRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const pool = distractorPool(ruleId, correctTarget, wrongTarget).filter((value) => value.toLowerCase() !== targetText.toLowerCase() && value.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? pool.slice(0, 3) : unique([correctTarget, ...pool]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three unique preposition choices for ${correctTarget}`);
  return values;
}
function shuffleThree(seed: string, values: readonly string[]) { const out = [...values]; for (let i = out.length - 1; i > 0; i -= 1) { const j = deterministicIndex(`${seed}:shuffle:${i}`, i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function concept(ruleId: PrepositionRuleId) {
  switch (ruleId) {
    case "GR-PRP-001": return "For time, use at with a clock time, on with a day or date, and in with a month, year, or longer period.";
    case "GR-PRP-002": return "For place, at usually marks a point, on a surface, and in an enclosed or larger area when the relation is clear.";
    case "GR-PRP-003": return "Use since for the point when something started and for for the length of time.";
    case "GR-PRP-004": return "Use by for a deadline, but until when an action or state continues up to a time.";
    case "GR-PRP-005": return "Use between for distinct parties and among for members of a group considered together.";
    case "GR-PRP-006": return "Use in for position and into for movement from outside to inside.";
    case "GR-PRP-007": return "Beside means next to; besides means in addition to.";
    case "GR-PRP-008": return "Some adjectives take a fixed preposition in standard exam English, such as familiar with and responsible for.";
    case "GR-PRP-009": return "Some verbs take a fixed preposition, such as depend on and comply with.";
    case "GR-PRP-010": return "Some nouns take a fixed preposition, such as solution to, reason for, and increase in.";
  }
}
function tag(candidate: ReturnType<typeof buildEng001Cp005CandidateV1>, prefix: string) { const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length); if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`); return value; }
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }

export function generateEng002Cp005QuestionV1(input: GenerateEng002Cp005V1Input): Eng002Cp005QuestionV1 {
  const candidate = buildEng001Cp005CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no preposition mutation target`);
  const correctSegments = [...candidate.correctSegments], errorSegments = [...candidate.errorSegments];
  const correctTarget = correctSegments[candidate.errorIndex]!.trim(), wrongTarget = errorSegments[candidate.errorIndex]!.trim();
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp005:no-improvement`, 0.25);
  const visibleSegments = noImprovement ? correctSegments : errorSegments, targetText = visibleSegments[candidate.errorIndex]!.trim();
  const ruleId = candidate.ruleId as PrepositionRuleId;
  const shuffled = shuffleThree(`${input.seed}:eng002:cp005:options`, replacementChoices(ruleId, correctTarget, wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"], correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost its correct replacement`);
  const sentence = sentenceFromSegments(visibleSegments), correctedSentence = sentenceFromSegments(correctSegments);
  const application = lowerLeading(candidate.explanationApplication);
  const explanation = noImprovement
    ? `No improvement is needed. “${correctTarget}” is already correct. ${concept(ruleId)} In this sentence, ${application} Correct sentence: ${correctedSentence}`
    : `Use “${correctTarget}” in the underlined part. ${concept(ruleId)} In this sentence, ${application} Correct sentence: ${correctedSentence}`;
  return {
    questionId: `ENG-002-CP005-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP005_STEM, sentence, segments: visibleSegments, targetIndex: candidate.errorIndex, targetText, options, correctOptionIndex, correctedSentence, explanation,
    metadata: { track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP005", ruleId, mutationId: candidate.mutationId, difficulty: candidate.difficulty,
      dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId, semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true },
  };
}
