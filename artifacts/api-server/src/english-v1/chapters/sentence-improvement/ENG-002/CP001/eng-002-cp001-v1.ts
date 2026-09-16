import { deterministicBoolean, deterministicIndex, deterministicPick } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, Eng001SentenceCandidate, SvaRuleId } from "../../../../core/types";
import { BASE_SCENES_V4 } from "../../../error-spotting/ENG-001/CP001/cp001-semantic-catalog-v4";
import {
  buildEng001Cp001CandidateV4,
  rulesForDifficultyV4,
  semanticDomainOfV4,
} from "../../../error-spotting/ENG-001/CP001/cp001-patterns-v4";
import { simplifyCp001Segments } from "../../../error-spotting/ENG-001/CP001/cp001-plain-language-v4";

export const ENG002_CP001_STEM = "Choose the best replacement for the underlined part. If no change is needed, select 'No improvement'.";

export interface Eng002Cp001QuestionV1 {
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
    cpId: "ENG-002-CP001";
    ruleId: SvaRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    candidateId: string;
    semanticDomain: string;
    noImprovement: boolean;
    reviewOnly: true;
  };
}

export interface GenerateEng002Cp001V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: SvaRuleId;
  noImprovement?: boolean;
}

interface RepairedSegments {
  correctSegments: string[];
  errorSegments: string[];
  repaired: boolean;
}

function repairModifierEcho(candidate: Eng001SentenceCandidate): RepairedSegments {
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  if (candidate.errorIndex === null) return { correctSegments, errorSegments, repaired: false };

  const finite = candidate.correctSegments[candidate.errorIndex] ?? candidate.correction;
  const participle = finite?.toLowerCase().match(/\b(?:am|is|are|was|were|be|been|being)\s+([a-z]+ing)\b/)?.[1];
  if (!participle) return { correctSegments, errorSegments, repaired: false };

  const modifierIndex = correctSegments.findIndex((segment, index) =>
    index !== candidate.errorIndex && segment.trim().toLowerCase().startsWith(`${participle} `),
  );
  if (modifierIndex < 0) return { correctSegments, errorSegments, repaired: false };

  const sceneId = candidate.tags.find((tag) => tag.startsWith("scene:"))?.slice("scene:".length);
  const scene = sceneId ? BASE_SCENES_V4.find((entry) => entry.id === sceneId) : undefined;
  if (!scene) return { correctSegments, errorSegments, repaired: false };

  const originalModifier = correctSegments[modifierIndex]!.trim();
  const safeAlternatives = scene.modifiers.filter(
    (modifier) => modifier !== originalModifier && !modifier.toLowerCase().startsWith(`${participle} `),
  );
  if (safeAlternatives.length === 0) return { correctSegments, errorSegments, repaired: false };

  const replacement = deterministicPick(`${candidate.candidateId}:eng002:modifier-echo-repair`, safeAlternatives);
  correctSegments[modifierIndex] = replacement;
  errorSegments[modifierIndex] = replacement;
  return { correctSegments, errorSegments, repaired: true };
}

function repairSecondaryTenseDebate(input: RepairedSegments): RepairedSegments {
  const correctSegments = [...input.correctSegments];
  const errorSegments = [...input.errorSegments];
  let repaired = input.repaired;
  for (let index = 0; index < correctSegments.length; index += 1) {
    if (correctSegments[index]?.trim() !== "before it broke completely.") continue;
    correctSegments[index] = "to keep the fitting secure.";
    errorSegments[index] = "to keep the fitting secure.";
    repaired = true;
  }
  return { correctSegments, errorSegments, repaired };
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function chooseRule(input: GenerateEng002Cp001V1Input): SvaRuleId {
  const allowed = rulesForDifficultyV4(input.difficulty) as SvaRuleId[];
  if (input.ruleId) {
    if (!allowed.includes(input.ruleId)) {
      throw new Error(`${input.ruleId} does not support ${input.difficulty} in ENG-002 CP001`);
    }
    return input.ruleId;
  }
  return deterministicPick(`${input.seed}:eng002:rule:${input.difficulty}`, allowed);
}

const IRREGULAR_BASE: Record<string, string> = {
  fallen: "fall",
  paid: "pay",
  made: "make",
  done: "do",
  gone: "go",
  written: "write",
  taken: "take",
  kept: "keep",
  built: "build",
  sent: "send",
  lost: "lose",
  found: "find",
  shown: "show",
  grown: "grow",
  known: "know",
  run: "run",
  begun: "begin",
};

function lexicalBaseFromPhrase(phrase: string): string {
  const words = phrase.trim().toLowerCase().split(/\s+/).filter(Boolean);
  while (["am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did", "been", "being"].includes(words[0] ?? "")) {
    words.shift();
  }
  const word = (words[0] ?? "do").replace(/[^a-z'-]/g, "");
  if (IRREGULAR_BASE[word]) return IRREGULAR_BASE[word]!;
  if (word.endsWith("ying") && word.length > 4) return `${word.slice(0, -4)}ie`;
  if (word.endsWith("ing") && word.length > 5) {
    const stem = word.slice(0, -3);
    if (/(at|it|iz|ur|ov|ak|ik)$/.test(stem)) return `${stem}e`;
    return stem.replace(/([bcdfghjklmnpqrstvwxyz])\1$/, "$1");
  }
  if (word.endsWith("ied") && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith("ed") && word.length > 4) {
    const stem = word.slice(0, -2);
    if (stem.endsWith("at") || stem.endsWith("iz")) return `${stem}e`;
    if (stem.endsWith("v")) return `${stem}e`;
    return stem.replace(/([bcdfghjklmnpqrstvwxyz])\1$/, "$1");
  }
  if (word.endsWith("ies") && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith("es") && /(ches|shes|sses|xes|zes|oes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) return word.slice(0, -1);
  return word;
}

function wrongNumberOf(phrase: string): "singular" | "plural" {
  const first = phrase.trim().toLowerCase().split(/\s+/)[0] ?? "";
  if (["is", "was", "has", "does"].includes(first)) return "singular";
  if (["are", "were", "have", "do"].includes(first)) return "plural";
  if (first.endsWith("s") && !first.endsWith("ss")) return "singular";
  return "plural";
}

function alternateAspectMismatch(wrongPhrase: string): string {
  const phrase = wrongPhrase.trim();
  const lower = phrase.toLowerCase();
  if (lower.startsWith("is ")) return `has been ${phrase.slice(3)}`;
  if (lower.startsWith("are ")) return `have been ${phrase.slice(4)}`;
  if (lower.startsWith("was ")) return `has been ${phrase.slice(4)}`;
  if (lower.startsWith("were ")) return `have been ${phrase.slice(5)}`;

  const base = lexicalBaseFromPhrase(phrase);
  const number = wrongNumberOf(phrase);
  if (lower.startsWith("has ")) return `is ${base}ing`;
  if (lower.startsWith("have ")) return `are ${base}ing`;
  return number === "singular" ? `does ${base}` : `do ${base}`;
}

function auxiliaryMismatch(wrongPhrase: string): string {
  const base = lexicalBaseFromPhrase(wrongPhrase);
  return wrongNumberOf(wrongPhrase) === "singular" ? `does ${base}` : `do ${base}`;
}

function uniqueReplacementDistractors(input: {
  correct: string;
  wrong: string;
  target: string;
}): string[] {
  const candidates = [
    input.wrong,
    alternateAspectMismatch(input.wrong),
    auxiliaryMismatch(input.wrong),
  ].map((value) => value.trim()).filter(Boolean);
  const seen = new Set([input.correct.trim().toLowerCase(), input.target.trim().toLowerCase()]);
  const out: string[] = [];
  for (const candidate of candidates) {
    const key = candidate.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
  }
  if (out.length < 2) {
    const base = lexicalBaseFromPhrase(input.wrong);
    const number = wrongNumberOf(input.wrong);
    const fallbacks = number === "singular"
      ? [`has ${base}`, `is ${base}`, `does ${base}s`]
      : [`have ${base}s`, `are ${base}`, `do ${base}s`];
    for (const candidate of fallbacks) {
      const key = candidate.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(candidate);
      if (out.length >= 3) break;
    }
  }
  return out;
}

function shuffleThree(seed: string, values: readonly string[]): string[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = deterministicIndex(`${seed}:shuffle:${i}`, i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function ruleReason(candidate: Eng001SentenceCandidate): string {
  switch (candidate.ruleId as SvaRuleId) {
    case "GR-SVA-001": return "The verb must agree with the main subject in number.";
    case "GR-SVA-002": return candidate.correctSegments[0]?.startsWith("Each") ? "“Each” takes a singular verb." : "“Every” takes a singular verb.";
    case "GR-SVA-003": return "In “one of ...”, the head word “one” is singular.";
    case "GR-SVA-004": return candidate.tags.includes("pattern:a-number-of") ? "“A number of” means several and takes a plural verb." : "“The number of” refers to one total and takes a singular verb.";
    case "GR-SVA-005": return "A phrase such as “along with”, “together with” or “as well as” does not change the number of the main subject.";
    case "GR-SVA-006": return "With “either...or” and “neither...nor”, the verb agrees with the nearer subject.";
    case "GR-SVA-007": return candidate.tags.includes("pattern:collective-members") ? "Here the members act separately, so the plural reading is required." : "Here the group acts as one unit, so the singular reading is required.";
    case "GR-SVA-008": return "“More than one” takes a singular verb in this pattern.";
    case "GR-SVA-009": return "“Many a/an” takes a singular verb.";
    case "GR-SVA-010": return `The main subject is “${candidate.subjectHead}”; the nearby plural noun does not control the verb.`;
  }
}

export function generateEng002Cp001QuestionV1(input: GenerateEng002Cp001V1Input): Eng002Cp001QuestionV1 {
  const ruleId = chooseRule(input);
  const candidate = buildEng001Cp001CandidateV4({
    difficulty: input.difficulty,
    ruleId,
    seed: `${input.seed}:${ruleId}`,
  });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no SVA mutation target`);

  const repaired = repairSecondaryTenseDebate(repairModifierEcho(candidate));
  const correctSegments = simplifyCp001Segments(repaired.correctSegments);
  const errorSegments = simplifyCp001Segments(repaired.errorSegments);
  const correctTarget = correctSegments[candidate.errorIndex]!.trim();
  const wrongTarget = errorSegments[candidate.errorIndex]!.trim();
  if (!correctTarget || !wrongTarget || correctTarget === wrongTarget) {
    throw new Error(`${candidate.candidateId} does not expose a distinct improvement target`);
  }

  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:no-improvement`, 0.25);
  const visibleSegments = noImprovement ? correctSegments : errorSegments;
  const targetText = visibleSegments[candidate.errorIndex]!.trim();
  const distractors = uniqueReplacementDistractors({ correct: correctTarget, wrong: wrongTarget, target: targetText });
  const replacements = noImprovement
    ? [wrongTarget, ...distractors.filter((entry) => entry !== wrongTarget)].slice(0, 3)
    : [correctTarget, ...distractors].slice(0, 3);
  if (replacements.length !== 3 || new Set(replacements.map((entry) => entry.toLowerCase())).size !== 3) {
    throw new Error(`${candidate.candidateId} could not build three unique replacement choices`);
  }

  const shuffled = shuffleThree(`${input.seed}:eng002:options`, replacements);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost the correct replacement`);

  const correctedSentence = sentenceFromSegments(correctSegments);
  const sentence = sentenceFromSegments(visibleSegments);
  const reason = ruleReason(candidate);
  const explanation = noImprovement
    ? `No improvement is needed. ${reason} “${correctTarget}” already agrees correctly with the subject. Correct sentence: ${correctedSentence}`
    : `Use “${correctTarget}”. ${reason} The underlined verb phrase does not agree with the subject. Correct sentence: ${correctedSentence}`;
  const semanticDomain = semanticDomainOfV4(candidate);
  if (!semanticDomain) throw new Error(`${candidate.candidateId} lacks a semantic domain`);

  return {
    questionId: `ENG-002-CP001-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP001_STEM,
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
      cpId: "ENG-002-CP001",
      ruleId,
      mutationId: candidate.mutationId,
      difficulty: candidate.difficulty,
      dimensions: candidate.dimensions,
      seed: input.seed,
      candidateId: `${candidate.candidateId}${repaired.repaired ? ":ENG002-REPAIRED" : ""}`,
      semanticDomain,
      noImprovement,
      reviewOnly: true,
    },
  };
}
