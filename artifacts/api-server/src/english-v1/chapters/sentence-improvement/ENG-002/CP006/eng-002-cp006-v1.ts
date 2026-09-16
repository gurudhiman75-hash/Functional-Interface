import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { ComparisonRuleId, DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { buildEng001Cp006CandidateV1 } from "../../../error-spotting/ENG-001/CP006/eng-001-cp006-v1";

export const ENG002_CP006_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp006QuestionV1 {
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
    cpId: "ENG-002-CP006";
    ruleId: ComparisonRuleId;
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

export interface GenerateEng002Cp006V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ComparisonRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
const clean = (value: string) => value.replace(/\s+/g, " ").trim();

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = clean(raw);
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

interface FocusedTarget {
  prefix: string;
  correctTarget: string;
  wrongTarget: string;
  suffix: string;
}

function focusDifference(correctSegment: string, wrongSegment: string): FocusedTarget {
  const correct = clean(correctSegment).split(" ");
  const wrong = clean(wrongSegment).split(" ");
  let prefixCount = 0;
  while (prefixCount < correct.length && prefixCount < wrong.length && correct[prefixCount]!.toLowerCase() === wrong[prefixCount]!.toLowerCase()) prefixCount += 1;

  let suffixCount = 0;
  while (
    suffixCount < correct.length - prefixCount &&
    suffixCount < wrong.length - prefixCount &&
    correct[correct.length - 1 - suffixCount]!.toLowerCase() === wrong[wrong.length - 1 - suffixCount]!.toLowerCase()
  ) suffixCount += 1;

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
  const suffix = suffixCount ? correct.slice(correct.length - suffixCount).join(" ") : "";
  const correctTarget = correctMid.join(" ");
  const wrongTarget = wrongMid.join(" ");
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) {
    throw new Error(`CP006 could not isolate a useful target: ${correctSegment} <> ${wrongSegment}`);
  }
  return { prefix, correctTarget, wrongTarget, suffix };
}

function preserveTerminalPunctuation(source: string, replacement: string) {
  const punctuation = source.match(/([,.;:!?]+)$/)?.[1] ?? "";
  const bare = replacement.replace(/[,.;:!?]+$/, "");
  return `${bare}${punctuation}`;
}

function irregularVariants(correctTarget: string): string[] {
  const lower = correctTarget.toLowerCase();
  const replacements: Array<[RegExp, readonly string[]]> = [
    [/\bbetter\b/i, ["good", "more good", "best"]],
    [/\bworse\b/i, ["bad", "more bad", "worst"]],
    [/\bbest\b/i, ["good", "better", "more good"]],
    [/\bworst\b/i, ["bad", "worse", "more bad"]],
    [/\bless\b/i, ["little", "more little", "least"]],
    [/\bleast\b/i, ["little", "less", "more little"]],
  ];
  for (const [pattern, variants] of replacements) {
    if (!pattern.test(lower)) continue;
    return variants.map((variant) => preserveTerminalPunctuation(correctTarget, correctTarget.replace(pattern, variant)));
  }
  return [];
}

function incorrectVariants(ruleId: ComparisonRuleId, correctTarget: string, wrongTarget: string): string[] {
  const correct = clean(correctTarget);
  const wrong = clean(wrongTarget);
  let variants: string[] = [wrong];
  switch (ruleId) {
    case "GR-CMP-001":
    case "GR-CMP-002":
      variants.push(`very ${wrong}`, `more ${wrong}`);
      break;
    case "GR-CMP-003":
      variants.push(`very ${correct}`, `most ${correct}`);
      break;
    case "GR-CMP-004":
      if (/^more\s+/i.test(correct)) {
        variants.push(`very ${correct}`, correct.replace(/^more\s+/i, "most "));
      } else {
        variants.push(`more ${correct}`, `most ${correct}`);
      }
      break;
    case "GR-CMP-005": {
      const withoutThe = correct.replace(/^the\s+/i, "");
      variants.push(withoutThe, `one ${withoutThe}`, `very ${withoutThe}`);
      break;
    }
    case "GR-CMP-006": {
      const bareWrong = wrong.replace(/[,.;:!?]+$/, "");
      const bareCorrect = correct.replace(/[,.;:!?]+$/, "");
      variants.push(preserveTerminalPunctuation(wrong, `${bareWrong}'s`), preserveTerminalPunctuation(correct, `${bareCorrect}'`));
      break;
    }
    case "GR-CMP-007":
      variants.push(`most ${correct}`, `very ${correct}`);
      break;
    case "GR-CMP-008":
      variants.push(`more ${correct}`, `much ${correct}`);
      break;
    case "GR-CMP-009":
      variants.push(preserveTerminalPunctuation(correct, "too"), preserveTerminalPunctuation(correct, "so"));
      break;
    case "GR-CMP-010":
      variants.push(...irregularVariants(correct));
      break;
  }
  variants = unique(variants).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) variants.push(`very ${wrong}`, `more ${wrong}`, `most ${wrong}`);
  return unique(variants).filter((value) => value.toLowerCase() !== correct.toLowerCase());
}

function replacementChoices(ruleId: ComparisonRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget)
    .filter((value) => value.toLowerCase() !== targetText.toLowerCase())
    .filter((value) => value.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? wrongs.slice(0, 3) : unique([correctTarget, ...wrongs]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three unique choices for ${correctTarget}`);
  return values;
}

function shuffleThree(seed: string, values: readonly string[]) {
  const out = [...values];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:shuffle:${index}`, index + 1);
    [out[index], out[other]] = [out[other]!, out[index]!];
  }
  return out;
}

function concept(ruleId: ComparisonRuleId): string {
  switch (ruleId) {
    case "GR-CMP-001": return "An action verb is normally described by an adverb. The adverb tells us how the action is done.";
    case "GR-CMP-002": return "After a linking verb such as look, seem, feel, become or remain, use an adjective when the word describes the subject.";
    case "GR-CMP-003": return "In an as ... as comparison, use the basic or positive form between the two as words, not a comparative form.";
    case "GR-CMP-004": return "When two things are directly compared with than, use the comparative degree.";
    case "GR-CMP-005": return "When a superlative identifies one member as the highest, lowest, oldest and so on in a group, it normally takes the definite article the.";
    case "GR-CMP-006": return "The pattern one of the + superlative refers to one member of a group, so the group noun after it must be plural.";
    case "GR-CMP-007": return "A comparative form already shows comparison, so do not add another comparative marker such as more before it.";
    case "GR-CMP-008": return "A superlative form already shows the highest or lowest degree, so do not add another superlative marker such as most before it.";
    case "GR-CMP-009": return "Comparatives can be strengthened by words such as much, far, even or a little. Very is not normally used directly before a comparative form.";
    case "GR-CMP-010": return "Some common adjectives have irregular comparison forms. For example, good becomes better/best and bad becomes worse/worst.";
  }
}

function tag(candidate: ReturnType<typeof buildEng001Cp006CandidateV1>, prefix: string) {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix} metadata`);
  return value;
}
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (letter) => letter.toLowerCase()); }

function focusedSegments(baseSegments: readonly string[], sourceIndex: number, focus: FocusedTarget, targetText: string) {
  const out: string[] = [];
  let targetIndex = -1;
  baseSegments.forEach((segment, index) => {
    if (index !== sourceIndex) {
      out.push(segment);
      return;
    }
    if (focus.prefix) out.push(focus.prefix);
    targetIndex = out.length;
    out.push(targetText);
    if (focus.suffix) out.push(focus.suffix);
  });
  if (targetIndex < 0) throw new Error("CP006 lost the focused target index");
  return { segments: out, targetIndex };
}

export function generateEng002Cp006QuestionV1(input: GenerateEng002Cp006V1Input): Eng002Cp006QuestionV1 {
  const candidate = buildEng001Cp006CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no comparison mutation target`);
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const sourceIndex = candidate.errorIndex;
  const focus = focusDifference(correctSegments[sourceIndex]!, errorSegments[sourceIndex]!);
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp006:no-improvement`, 0.25);
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const baseSegments = noImprovement ? correctSegments : errorSegments;
  const focused = focusedSegments(baseSegments, sourceIndex, focus, targetText);
  const ruleId = candidate.ruleId as ComparisonRuleId;
  const choices = replacementChoices(ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp006:options`, choices);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost its correct replacement`);

  const sentence = sentenceFromSegments(focused.segments);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const application = lowerLeading(candidate.explanationApplication);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correct. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`
    : `Error: “${focus.wrongTarget}” should be “${focus.correctTarget}”. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-002-CP006-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP006_STEM,
    sentence,
    segments: focused.segments,
    targetIndex: focused.targetIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP006", ruleId, mutationId: candidate.mutationId,
      difficulty: candidate.difficulty, dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId,
      semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true,
    },
  };
}
