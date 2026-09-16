import { deterministicBoolean, deterministicIndex, deterministicPick } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty, Eng001SentenceCandidate, SvaRuleId } from "../../../../core/types";
import { BASE_SCENES_V4 } from "../../../error-spotting/ENG-001/CP001/cp001-semantic-catalog-v4";
import {
  buildEng001Cp001CandidateV4,
  rulesForDifficultyV4,
  semanticDomainOfV4,
} from "../../../error-spotting/ENG-001/CP001/cp001-patterns-v4";
import { simplifyCp001Segments } from "../../../error-spotting/ENG-001/CP001/cp001-plain-language-v4";

export const ENG002_CP001_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

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

function insertAgreementPreservingAdverb(phrase: string, adverb: string): string {
  const words = phrase.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return phrase;
  const first = words[0]!.toLowerCase();
  const auxiliaries = new Set(["am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must"]);
  if (auxiliaries.has(first)) {
    return [words[0], adverb, ...words.slice(1)].join(" ");
  }
  return `${adverb} ${phrase.trim()}`;
}

function wrongAgreementAlternatives(wrongPhrase: string): string[] {
  const first = wrongPhrase.trim().toLowerCase().split(/\s+/)[0] ?? "";
  const adverbs = ["has", "have", "had"].includes(first)
    ? ["already", "often"]
    : ["still", "usually"];
  return adverbs.map((adverb) => insertAgreementPreservingAdverb(wrongPhrase, adverb));
}

function uniqueReplacementDistractors(input: {
  correct: string;
  wrong: string;
  target: string;
}): string[] {
  const candidates = [input.wrong, ...wrongAgreementAlternatives(input.wrong)]
    .map((value) => value.trim())
    .filter(Boolean);
  const seen = new Set([input.correct.trim().toLowerCase(), input.target.trim().toLowerCase()]);
  const out: string[] = [];
  for (const candidate of candidates) {
    const key = candidate.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
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

function ruleLesson(candidate: Eng001SentenceCandidate): string {
  switch (candidate.ruleId as SvaRuleId) {
    case "GR-SVA-001":
      return "Concept: First find the main subject. A singular subject takes a singular verb, while a plural subject takes a plural verb.";
    case "GR-SVA-002":
      return candidate.correctSegments[0]?.startsWith("Each")
        ? "Concept: 'Each' talks about members one at a time, so it normally takes a singular verb."
        : "Concept: 'Every' treats the members one at a time, so it normally takes a singular verb.";
    case "GR-SVA-003":
      return "Concept: In 'one of the ...', the real subject is 'one', not the plural noun after 'of'. Therefore, the verb is singular.";
    case "GR-SVA-004":
      return candidate.tags.includes("pattern:a-number-of")
        ? "Concept: 'A number of' means 'several', so we use a plural verb."
        : "Concept: 'The number of' means one total or figure, so we use a singular verb.";
    case "GR-SVA-005":
      return "Concept: Words added with 'along with', 'together with' or 'as well as' do not change the main subject. Make the verb agree with the main subject only.";
    case "GR-SVA-006":
      return "Concept: With 'either...or' and 'neither...nor', look at the subject nearest to the verb. The verb agrees with that nearer subject.";
    case "GR-SVA-007":
      return candidate.tags.includes("pattern:collective-members")
        ? "Concept: A collective noun can take a plural verb when its members are acting separately."
        : "Concept: A collective noun takes a singular verb when the whole group is acting as one unit.";
    case "GR-SVA-008":
      return "Concept: Although 'more than one' sounds plural, standard agreement in this pattern uses a singular verb.";
    case "GR-SVA-009":
      return "Concept: 'Many a' or 'many an' is followed by a singular noun and takes a singular verb.";
    case "GR-SVA-010":
      return "Concept: Do not match the verb with the nearest noun automatically. First identify the main subject; words inside an added phrase do not control the verb.";
  }
}

function explanationApplication(candidate: Eng001SentenceCandidate, correctTarget: string): string {
  return `Here, the main subject is “${candidate.subjectHead}”, so “${correctTarget}” is the correct verb form.`;
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
  const lesson = ruleLesson(candidate);
  const application = explanationApplication(candidate, correctTarget);
  const explanation = noImprovement
    ? `No error: “${targetText}” already agrees with the subject, so no improvement is needed. ${lesson} ${application} Correct sentence: ${correctedSentence}`
    : `Error: “${targetText}” does not agree with the subject; use “${correctTarget}”. ${lesson} ${application} Correct sentence: ${correctedSentence}`;
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
