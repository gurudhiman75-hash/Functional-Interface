import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, PronounRuleId } from "../../../../core/types";
import { buildEng001Cp004CandidateV1 } from "../../../error-spotting/ENG-001/CP004/eng-001-cp004-v1";

export const ENG002_CP004_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp004QuestionV1 {
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
    cpId: "ENG-002-CP004";
    ruleId: PronounRuleId;
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

export interface GenerateEng002Cp004V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: PronounRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.replace(/\s+/g, " ").trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function swapWord(text: string, from: string, to: string): string | null {
  const regex = new RegExp(`\\b${escapeRegExp(from)}\\b`, "i");
  const match = regex.exec(text);
  if (!match) return null;
  let replacement = to;
  if (match.index === 0 && /^[A-Z]/.test(match[0]!) && to !== "I") replacement = `${to[0]!.toUpperCase()}${to.slice(1)}`;
  return `${text.slice(0, match.index)}${replacement}${text.slice(match.index + match[0]!.length)}`;
}

function mappedVariants(text: string, mapping: Readonly<Record<string, readonly string[]>>): string[] {
  for (const [form, alternatives] of Object.entries(mapping)) {
    if (new RegExp(`\\b${escapeRegExp(form)}\\b`, "i").test(text)) {
      return alternatives.map((alternative) => swapWord(text, form, alternative)).filter((value): value is string => Boolean(value));
    }
  }
  return [];
}

const SUBJECT_ALTERNATIVES: Readonly<Record<string, readonly string[]>> = {
  I: ["me", "myself", "mine"],
  he: ["him", "himself", "his"],
  she: ["her", "herself", "hers"],
  we: ["us", "ourselves", "ours"],
  they: ["them", "themselves", "theirs"],
};
const OBJECT_ALTERNATIVES: Readonly<Record<string, readonly string[]>> = {
  me: ["I", "myself", "mine"],
  him: ["he", "himself", "his"],
  her: ["she", "herself", "hers"],
  us: ["we", "ourselves", "ours"],
  them: ["they", "themselves", "theirs"],
};
const POSSESSIVE_ALTERNATIVES: Readonly<Record<string, readonly string[]>> = {
  my: ["mine", "me", "myself"], mine: ["my", "me", "myself"],
  your: ["yours", "you", "yourself"], yours: ["your", "you", "yourself"],
  his: ["him", "he", "himself"],
  her: ["hers", "she", "herself"], hers: ["her", "she", "herself"],
  our: ["ours", "us", "ourselves"], ours: ["our", "us", "ourselves"],
  their: ["theirs", "them", "themselves"], theirs: ["their", "them", "themselves"],
};
const REFLEXIVE_ALTERNATIVES: Readonly<Record<string, readonly string[]>> = {
  myself: ["me", "I", "mine"], himself: ["him", "he", "his"], herself: ["her", "she", "hers"],
  ourselves: ["us", "we", "ours"], themselves: ["them", "they", "theirs"],
};

function swapInitialRelative(text: string, replacement: string): string {
  return text.replace(/^(?:whose|who's|who|whom|which)\b/i, replacement);
}

function agreementVariants(text: string): string[] {
  if (/\btheir\b/i.test(text)) return ["its", "his", "our"].map((form) => swapWord(text, "their", form)!).filter(Boolean);
  if (/\bits\b/i.test(text)) return ["their", "his", "our"].map((form) => swapWord(text, "its", form)!).filter(Boolean);
  return [];
}

function distractorPool(ruleId: PronounRuleId, correctTarget: string, wrongTarget: string): string[] {
  let generated: string[] = [];
  switch (ruleId) {
    case "GR-PRN-001": generated = mappedVariants(correctTarget, SUBJECT_ALTERNATIVES); break;
    case "GR-PRN-002": generated = mappedVariants(correctTarget, OBJECT_ALTERNATIVES); break;
    case "GR-PRN-003": generated = mappedVariants(correctTarget, POSSESSIVE_ALTERNATIVES); break;
    case "GR-PRN-004": generated = mappedVariants(correctTarget, REFLEXIVE_ALTERNATIVES); break;
    case "GR-PRN-005": generated = mappedVariants(correctTarget, OBJECT_ALTERNATIVES); break;
    case "GR-PRN-006": generated = agreementVariants(correctTarget); break;
    case "GR-PRN-007": generated = [swapInitialRelative(correctTarget, correctTarget.toLowerCase().startsWith("who ") || correctTarget.toLowerCase() === "who" ? "whom" : "who"), swapInitialRelative(correctTarget, "which"), swapInitialRelative(correctTarget, "whose")]; break;
    case "GR-PRN-008": generated = [swapInitialRelative(correctTarget, correctTarget.toLowerCase().startsWith("who") ? "which" : "who"), swapInitialRelative(correctTarget, "whom"), swapInitialRelative(correctTarget, "whose")]; break;
    case "GR-PRN-009": generated = ["this", "that", "these", "those"].map((form) => swapWord(correctTarget, correctTarget.split(/\s+/)[0]!, form)!).filter(Boolean); break;
    case "GR-PRN-010": {
      const opposite = correctTarget.toLowerCase().startsWith("whose") ? "who's" : "whose";
      generated = [swapInitialRelative(correctTarget, opposite), swapInitialRelative(correctTarget, "who"), swapInitialRelative(correctTarget, "whom"), swapInitialRelative(correctTarget, "which")];
      break;
    }
  }
  return unique([wrongTarget, ...generated]);
}

function replacementChoices(input: { ruleId: PronounRuleId; correctTarget: string; wrongTarget: string; targetText: string; noImprovement: boolean }): string[] {
  const pool = distractorPool(input.ruleId, input.correctTarget, input.wrongTarget)
    .filter((value) => value.toLowerCase() !== input.targetText.toLowerCase())
    .filter((value) => value.toLowerCase() !== input.correctTarget.toLowerCase());
  const values = input.noImprovement ? unique(pool).slice(0, 3) : unique([input.correctTarget, ...pool]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${input.ruleId} could not build three unique pronoun choices for ${input.correctTarget}`);
  return values;
}

function shuffleThree(seed: string, values: readonly string[]): string[] {
  const out = [...values];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:shuffle:${index}`, index + 1);
    [out[index], out[other]] = [out[other]!, out[index]!];
  }
  return out;
}

function concept(ruleId: PronounRuleId): string {
  switch (ruleId) {
    case "GR-PRN-001": return "Use a subject-form pronoun when the pronoun performs the action of the verb.";
    case "GR-PRN-002": return "Use an object-form pronoun after a verb or preposition when the pronoun receives the action.";
    case "GR-PRN-003": return "Use a possessive determiner before a noun, but use a possessive pronoun when the possessive form stands alone.";
    case "GR-PRN-004": return "Use a reflexive pronoun when the object refers back to the subject in the same clause.";
    case "GR-PRN-005": return "A reflexive pronoun is not used as an ordinary object when it does not refer back to the subject.";
    case "GR-PRN-006": return "A pronoun must agree in number with the noun or pronoun it refers to.";
    case "GR-PRN-007": return "In formal exam English, use who as a subject and whom as an object.";
    case "GR-PRN-008": return "In these non-restrictive clauses, use who for a person and which for a thing.";
    case "GR-PRN-009": return "Use this or that with singular reference and these or those with plural reference.";
    case "GR-PRN-010": return "Whose shows possession, while who's means who is or who has.";
  }
}

function tag(candidate: ReturnType<typeof buildEng001Cp004CandidateV1>, prefix: string): string {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix} metadata`);
  return value;
}

export function generateEng002Cp004QuestionV1(input: GenerateEng002Cp004V1Input): Eng002Cp004QuestionV1 {
  const candidate = buildEng001Cp004CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no pronoun mutation target`);

  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const correctTarget = correctSegments[candidate.errorIndex]!.trim();
  const wrongTarget = errorSegments[candidate.errorIndex]!.trim();
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp004:no-improvement`, 0.25);
  const visibleSegments = noImprovement ? correctSegments : errorSegments;
  const targetText = visibleSegments[candidate.errorIndex]!.trim();
  const ruleId = candidate.ruleId as PronounRuleId;
  const choices = replacementChoices({ ruleId, correctTarget, wrongTarget, targetText, noImprovement });
  const shuffled = shuffleThree(`${input.seed}:eng002:cp004:options`, choices);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost its correct replacement`);

  const sentence = sentenceFromSegments(visibleSegments);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const explanation = noImprovement
    ? `No improvement is needed because “${correctTarget}” is already correct. ${concept(ruleId)} Here, ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`
    : `The underlined part is incorrect; use “${correctTarget}”. ${concept(ruleId)} Here, ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-002-CP004-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP004_STEM,
    sentence,
    segments: visibleSegments,
    targetIndex: candidate.errorIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP004", ruleId, mutationId: candidate.mutationId,
      difficulty: candidate.difficulty, dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId,
      semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true,
    },
  };
}
