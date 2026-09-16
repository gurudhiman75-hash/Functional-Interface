import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { ArticleRuleId, DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { buildEng001Cp003CandidateV1 } from "../../../error-spotting/ENG-001/CP003/eng-001-cp003-v1";

export const ENG002_CP003_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp003QuestionV1 {
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
    cpId: "ENG-002-CP003";
    ruleId: ArticleRuleId;
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

export interface GenerateEng002Cp003V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ArticleRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

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

function stripDeterminer(text: string): string {
  return text.replace(/^(?:a few|a little|the|an|a|many|much|few|little|each|every|several)\s+/i, "").trim();
}

function oppositeIndefinite(correctTarget: string): "a" | "an" {
  return /^an\s+/i.test(correctTarget) ? "a" : "an";
}

function distractorPool(ruleId: ArticleRuleId, correctTarget: string, wrongTarget: string): string[] {
  const body = stripDeterminer(correctTarget);
  switch (ruleId) {
    case "GR-ART-001":
      return unique([wrongTarget, `the ${body}`, `${oppositeIndefinite(correctTarget)} ${body}`]);
    case "GR-ART-002":
      return unique([wrongTarget, `the ${body}`, body]);
    case "GR-ART-003":
      return unique([wrongTarget, body, `an ${body}`]);
    case "GR-ART-004":
      return unique([wrongTarget, body, `${/^a\s+/i.test(wrongTarget) ? "an" : "a"} ${body}`]);
    case "GR-ART-005":
      return unique([wrongTarget, `a ${body}`, `an ${body}`]);
    case "GR-ART-006":
      return unique([wrongTarget, `the ${body}`, `${oppositeIndefinite(correctTarget)} ${body}`]);
    case "GR-ART-007":
      return unique([wrongTarget, `an ${body}`, `many ${body}`]);
    case "GR-ART-008":
      return unique([wrongTarget, `a ${body}`, `an ${body}`]);
    case "GR-ART-009": {
      const match = correctTarget.match(/^(a few|a little|many|much|few|little)\s+(.+)$/i);
      if (!match) throw new Error(`Unable to parse quantity determiner in ${correctTarget}`);
      const quantifier = match[1]!.toLowerCase();
      const noun = match[2]!;
      const countable = quantifier === "many" || quantifier === "few" || quantifier === "a few";
      return countable
        ? unique([wrongTarget, `little ${noun}`, `a little ${noun}`])
        : unique([wrongTarget, `few ${noun}`, `a few ${noun}`]);
    }
    case "GR-ART-010": {
      const match = correctTarget.match(/^(each|every|several)\s+(.+)$/i);
      if (!match) throw new Error(`Unable to parse number determiner in ${correctTarget}`);
      const determiner = match[1]!.toLowerCase();
      const noun = match[2]!;
      return determiner === "several"
        ? unique([wrongTarget, `each ${noun}`, `every ${noun}`])
        : unique([wrongTarget, `several ${noun}`, `many ${noun}`]);
    }
  }
}

function shuffleThree(seed: string, values: readonly string[]): string[] {
  const out = [...values];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:shuffle:${index}`, index + 1);
    [out[index], out[other]] = [out[other]!, out[index]!];
  }
  return out;
}

function replacementChoices(input: {
  ruleId: ArticleRuleId;
  correctTarget: string;
  wrongTarget: string;
  targetText: string;
  noImprovement: boolean;
}): string[] {
  const pool = distractorPool(input.ruleId, input.correctTarget, input.wrongTarget)
    .filter((entry) => entry.toLowerCase() !== input.targetText.toLowerCase())
    .filter((entry) => entry.toLowerCase() !== input.correctTarget.toLowerCase());
  const values = input.noImprovement
    ? unique(pool).slice(0, 3)
    : unique([input.correctTarget, ...pool]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${input.ruleId} could not build three unique article/determiner choices`);
  return values;
}

function concept(ruleId: ArticleRuleId): string {
  switch (ruleId) {
    case "GR-ART-001": return "A singular countable noun normally needs a determiner such as a, an, or the.";
    case "GR-ART-002": return "Choose a or an by the first sound of the next word, not simply by its first letter.";
    case "GR-ART-003": return "A superlative such as fastest, highest, or easiest normally takes the before it.";
    case "GR-ART-004": return "Use the when the sentence clearly identifies one particular person or thing.";
    case "GR-ART-005": return "General plural nouns and general uncountable nouns normally take no article.";
    case "GR-ART-006": return "A singular profession or role normally takes a or an after forms such as is, became, or worked as.";
    case "GR-ART-007": return "Words such as school, hospital, prison, college, bed, and church can take no article when used for their normal purpose.";
    case "GR-ART-008": return "Geographical names follow fixed article patterns: rivers, seas, oceans and deserts usually take the, while individual mountains and lakes usually do not.";
    case "GR-ART-009": return "Use many or few with plural countable nouns, and much or little with uncountable nouns.";
    case "GR-ART-010": return "Each and every take a singular count noun, while several takes a plural count noun.";
  }
}

function tag(candidate: ReturnType<typeof buildEng001Cp003CandidateV1>, prefix: string): string {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix} metadata`);
  return value;
}

export function generateEng002Cp003QuestionV1(input: GenerateEng002Cp003V1Input): Eng002Cp003QuestionV1 {
  const candidate = buildEng001Cp003CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no article/determiner mutation target`);

  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const correctTarget = correctSegments[candidate.errorIndex]!.trim();
  const wrongTarget = errorSegments[candidate.errorIndex]!.trim();
  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp003:no-improvement`, 0.25);
  const visibleSegments = noImprovement ? correctSegments : errorSegments;
  const targetText = visibleSegments[candidate.errorIndex]!.trim();
  const choices = replacementChoices({ ruleId: candidate.ruleId as ArticleRuleId, correctTarget, wrongTarget, targetText, noImprovement });
  const shuffled = shuffleThree(`${input.seed}:eng002:cp003:options`, choices);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost its correct replacement`);

  const sentence = sentenceFromSegments(visibleSegments);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const ruleId = candidate.ruleId as ArticleRuleId;
  const explanation = noImprovement
    ? `No improvement: “${correctTarget}” is already correct. Concept: ${concept(ruleId)} Here: ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`
    : `Error: “${wrongTarget}” is incorrect here; use “${correctTarget}”. Concept: ${concept(ruleId)} Here: ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-002-CP003-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP003_STEM,
    sentence,
    segments: visibleSegments,
    targetIndex: candidate.errorIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-002",
      cpId: "ENG-002-CP003",
      ruleId,
      mutationId: candidate.mutationId,
      difficulty: candidate.difficulty,
      dimensions: candidate.dimensions,
      seed: input.seed,
      candidateId: candidate.candidateId,
      semanticDomain: tag(candidate, "domain:"),
      sceneId: tag(candidate, "scene:"),
      noImprovement,
      reviewOnly: true,
    },
  };
}
