import { deterministicPick } from "../../../../core/deterministic";
import type { Eng001QlId, Eng001Question, Eng001SentenceCandidate, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import {
  buildEng001Cp001CandidateV4,
  ENG001_CP001_V4_NO_ERROR_RULE_IDS,
  rulesForDifficultyV4,
  semanticDomainOfV4,
} from "./cp001-patterns-v4";
import { BASE_SCENES_V4 } from "./cp001-semantic-catalog-v4";
import {
  chooseCp001PlainContext,
  simplifyCp001Segments,
} from "./cp001-plain-language-v4";

/**
 * Error-spotting directions should be instantly understood. Sentence diversity
 * belongs in the question itself, not in constantly changing instructions.
 */
const STEMS: Record<Eng001QlId, string> = {
  "ENG-001-QL001": "Identify the part of the sentence that contains an error.",
  "ENG-001-QL002": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
  "ENG-001-QL007": "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
};

interface ModifierEchoRepair {
  correctSegments: string[];
  errorSegments: string[];
  repaired: boolean;
}

/**
 * Replace a modifier only when it repeats the same -ing action as the main
 * continuous verb. The replacement always comes from the scene's other
 * authored modifier; nothing new is invented here.
 */
function repairBaseSceneModifierEcho(candidate: Eng001SentenceCandidate): ModifierEchoRepair {
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const errorIndex = candidate.errorIndex;
  if (errorIndex === null) return { correctSegments, errorSegments, repaired: false };

  const finite = candidate.correctSegments[errorIndex] ?? candidate.correction;
  const participle = finite?.toLowerCase().match(/\b(?:am|is|are|was|were|be|been|being)\s+([a-z]+ing)\b/)?.[1];
  if (!participle) return { correctSegments, errorSegments, repaired: false };

  const modifierIndex = correctSegments.findIndex((segment, index) =>
    index !== errorIndex && segment.trim().toLowerCase().startsWith(`${participle} `),
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

  const replacement = deterministicPick(`${candidate.candidateId}:modifier-echo-repair`, safeAlternatives);
  correctSegments[modifierIndex] = replacement;
  errorSegments[modifierIndex] = replacement;
  return { correctSegments, errorSegments, repaired: true };
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

function appendContext(segment: string, context: string): string {
  const clean = segment.trim().replace(/[.!?]+$/, "");
  return `${clean} ${context}.`;
}

function contextualizeSegments(
  segments: readonly string[],
  errorIndex: number | null,
  context: string,
): string[] {
  const out = [...segments];
  const target = [3, 2, 0].find((index) => index !== errorIndex && Boolean(out[index]?.trim()));
  if (target === undefined) throw new Error("Unable to place CP001 V4 context outside the error segment");
  out[target] = appendContext(out[target]!, context);
  return out;
}

function ensureFourVisibleSegments(
  segments: readonly string[],
  errorIndex: number | null,
): { segments: string[]; errorIndex: number | null } {
  const out = [...segments];
  if (out.length !== 4) return { segments: out, errorIndex };
  if (out[3]?.trim()) return { segments: out, errorIndex };
  const donorIndex = 2;
  const words = (out[donorIndex] ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || donorIndex === errorIndex) {
    throw new Error("Unable to normalize a four-segment V4 surface without changing the error segment");
  }
  const splitAt = Math.max(1, Math.floor(words.length / 2));
  out[donorIndex] = words.slice(0, splitAt).join(" ");
  out[3] = words.slice(splitAt).join(" ");
  return { segments: out, errorIndex };
}

function mergePair(
  segments: readonly string[],
  mergeAt: number,
  errorIndex: number | null,
): { segments: string[]; errorIndex: number | null } {
  const out: string[] = [];
  let mapped: number | null = null;
  for (let index = 0; index < segments.length; index += 1) {
    if (index === mergeAt) {
      const newIndex = out.length;
      out.push(`${segments[index]} ${segments[index + 1]}`.trim());
      if (errorIndex === index || errorIndex === index + 1) mapped = newIndex;
      index += 1;
      continue;
    }
    const newIndex = out.length;
    out.push(segments[index]!);
    if (errorIndex === index) mapped = newIndex;
  }
  return { segments: out, errorIndex: mapped };
}

function shapeThreeSegmentsPreserveError(
  segments: readonly string[],
  errorIndex: number,
  seed: string,
): { segments: string[]; errorIndex: number } {
  if (segments.length !== 4) throw new Error(`QL002 requires four source segments; received ${segments.length}`);
  const mergeCandidates = [0, 1, 2].filter(
    (index) => index !== errorIndex && index + 1 !== errorIndex,
  );
  if (mergeCandidates.length === 0) {
    throw new Error(`Unable to preserve error segment ${errorIndex} while shaping QL002`);
  }
  const mergeAt = deterministicPick(`${seed}:three-segment-merge`, mergeCandidates);
  const shaped = mergePair(segments, mergeAt, errorIndex);
  if (shaped.errorIndex === null) throw new Error("QL002 error index was lost during shaping");
  return { segments: shaped.segments, errorIndex: shaped.errorIndex };
}

function optionLabels(count: number, includeNoError: boolean): string[] {
  const labels = Array.from({ length: count }, (_, index) => String.fromCharCode(65 + index));
  return includeNoError ? [...labels, "No error"] : labels;
}

function chooseRule(input: {
  difficulty: EnglishDifficulty;
  qlId: Eng001QlId;
  ruleId?: GrammarRuleId;
  seed: string;
}): GrammarRuleId {
  const isNoError = input.qlId === "ENG-001-QL007";
  if (input.ruleId) {
    const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId];
    if (!rule.allowedDifficulties.includes(input.difficulty)) {
      throw new Error(`${input.ruleId} does not support ${input.difficulty}`);
    }
    if (isNoError && !ENG001_CP001_V4_NO_ERROR_RULE_IDS.includes(input.ruleId)) {
      throw new Error(`${input.ruleId} is not admitted to the calibrated No-error pool`);
    }
    return input.ruleId;
  }

  const allowed = rulesForDifficultyV4(input.difficulty).filter(
    (ruleId) => !isNoError || ENG001_CP001_V4_NO_ERROR_RULE_IDS.includes(ruleId),
  );
  return deterministicPick(`${input.seed}:rule:${input.qlId}:${input.difficulty}`, allowed);
}

function decorrelatedContextSeed(seed: string, ruleId: GrammarRuleId, domain: string): string {
  const reversed = [...seed].reverse().join("");
  const alternating = [...seed].filter((_, index) => index % 2 === 0).join("");
  return `ctx:${reversed}:${seed.length}:${alternating}:${ruleId}:${domain}`;
}

function simpleRuleExplanation(candidate: Eng001SentenceCandidate): string {
  const correction = candidate.correction ?? "the correct verb";

  switch (candidate.ruleId) {
    case "GR-SVA-001": {
      const plural = candidate.candidateId.includes(":PL");
      return `The subject is ${plural ? "plural" : "singular"}, so use “${correction}”.`;
    }
    case "GR-SVA-002":
      return `“Each” and “Every” are singular, so use “${correction}”.`;
    case "GR-SVA-003":
      return `In “one of ...”, the subject is “one”, so use “${correction}”.`;
    case "GR-SVA-004":
      return candidate.correctSegments[0]?.startsWith("A number of")
        ? `“A number of” means several, so use the plural verb “${correction}”.`
        : `“The number of” means one total, so use the singular verb “${correction}”.`;
    case "GR-SVA-005":
      return `“Along with”, “together with” and “as well as” do not change the main subject, so use “${correction}”.`;
    case "GR-SVA-006":
      return `With “either...or” and “neither...nor”, use the verb that matches the nearer subject: “${correction}”.`;
    case "GR-SVA-007": {
      const membersSeparate = candidate.tags.includes("pattern:collective-members");
      return membersSeparate
        ? `The members are acting separately, so use “${correction}”.`
        : `The group is acting as one, so use “${correction}”.`;
    }
    case "GR-SVA-008":
      return `“More than one” takes a singular verb, so use “${correction}”.`;
    case "GR-SVA-009":
      return `“Many a/an” takes a singular verb, so use “${correction}”.`;
    case "GR-SVA-010":
      return `Use the verb that matches the main subject, not the noun in the middle. The correct verb is “${correction}”.`;
  }
}

export interface GenerateEng001Cp001V4Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: GrammarRuleId;
}

export function generateEng001Cp001QuestionV4(input: GenerateEng001Cp001V4Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(
    `${input.seed}:ql`,
    ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const,
  );
  const ruleId = chooseRule({ difficulty: input.difficulty, qlId, ruleId: input.ruleId, seed: input.seed });
  const candidate = buildEng001Cp001CandidateV4({
    ruleId,
    difficulty: input.difficulty,
    seed: `${input.seed}:${ruleId}`,
  });
  const domain = semanticDomainOfV4(candidate);
  if (!domain) throw new Error(`${candidate.candidateId} lacks a semantic domain for V4 context expansion`);

  const modifierRepair = repairBaseSceneModifierEcho(candidate);
  const plainCorrect = simplifyCp001Segments(modifierRepair.correctSegments);
  const plainError = simplifyCp001Segments(modifierRepair.errorSegments);
  const context = chooseCp001PlainContext(
    plainCorrect,
    domain,
    decorrelatedContextSeed(input.seed, candidate.ruleId, domain),
  );

  const isNoError = qlId === "ENG-001-QL007";
  const rawErrorIndex = isNoError ? null : candidate.errorIndex;
  const contextualCorrect = contextualizeSegments(plainCorrect, candidate.errorIndex, context.text);
  const contextualError = contextualizeSegments(plainError, candidate.errorIndex, context.text);
  const rawSegments = isNoError ? contextualCorrect : contextualError;
  const visible = ensureFourVisibleSegments(rawSegments, rawErrorIndex);
  const shaped = qlId === "ENG-001-QL002"
    ? shapeThreeSegmentsPreserveError(visible.segments, visible.errorIndex!, input.seed)
    : visible;
  const includeNoError = qlId !== "ENG-001-QL001";
  const options = optionLabels(shaped.segments.length, includeNoError);
  const correctOptionIndex = shaped.errorIndex ?? shaped.segments.length;
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(contextualCorrect);
  const ruleExplanation = simpleRuleExplanation(candidate);
  const explanation = isNoError
    ? `There is no error. ${ruleExplanation} Correct sentence: ${correctedSentence}`
    : `Part ${answerLabel} contains the error. ${ruleExplanation} Replace “${candidate.errorSpan}” with “${candidate.correction}”. Correct sentence: ${correctedSentence}`;
  const repairSuffix = modifierRepair.repaired ? ":ECHO-REPAIRED" : "";
  const realizedCandidateId = `${candidate.candidateId}${repairSuffix}:CTX:${context.id}`;

  return {
    questionId: `ENG-001-CP001-V4:${qlId}:${realizedCandidateId}:${input.seed}`,
    stem: STEMS[qlId],
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-001",
      cpId: "ENG-001-CP001",
      qlId,
      ruleId: candidate.ruleId,
      mutationId: candidate.mutationId,
      difficulty: candidate.difficulty,
      dimensions: candidate.dimensions,
      answerSegment: answerLabel,
      hasNoError: isNoError,
      seed: input.seed,
      candidateId: realizedCandidateId,
      reviewOnly: true,
    },
  };
}
