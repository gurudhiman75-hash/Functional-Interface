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
import { CONTEXT_EXPANSIONS_BY_DOMAIN_V4 } from "./cp001-context-expansions-v4";

/**
 * Directions are intentionally repetitive and clear, like real exam papers.
 * Diversity belongs in the sentence content, not in fancy instruction wording.
 */
const STEMS: Record<Eng001QlId, readonly string[]> = {
  "ENG-001-QL001": [
    "Identify the part of the sentence that contains an error.",
  ],
  "ENG-001-QL002": [
    "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
  ],
  "ENG-001-QL007": [
    "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.",
  ],
};

/**
 * Plain-language surface layer. These replacements keep the grammar target
 * unchanged while removing vocabulary that makes an SVA question harder for
 * the wrong reason. Longer phrases come before single-word replacements.
 */
const EDITORIAL_PHRASE_REPLACEMENTS: readonly [string, string][] = [
  ["waiting for document checking", "waiting for document check"],
  ["scheduled for document checking", "waiting for document check"],
  ["waiting near the main field", "waiting near the field"],
  ["assembled near the main field", "waiting near the field"],
  ["waiting in the reception area", "waiting near the front desk"],
  ["gathered in the reception area", "waiting near the front desk"],
  ["waiting with prepared parcels", "holding ready parcels"],
  ["preparing the main field", "getting the field ready"],
  ["managing the main field", "working in the field"],
  ["monitoring the control screen", "watching the control screen"],
  ["working at the control screen", "watching the control screen"],
  ["submitting updated documents", "giving the required papers"],
  ["seeking account renewal", "renewing the account"],
  ["preparing the new exhibition", "setting up the new display"],
  ["organising the new exhibition", "setting up the new display"],
  ["rehearsing the opening piece", "practising the opening piece"],
  ["leading the opening rehearsal", "leading the first practice"],
  ["recording the morning survey", "doing the morning survey"],
  ["conducting the morning survey", "doing the morning survey"],
  ["attending the morning batch", "in the morning class"],
  ["using the marked cycle lane", "riding in the cycle lane"],
  ["riding in the marked cycle lane", "riding in the cycle lane"],
  ["under one project report", "in one project report"],
  ["in a single project report", "in one project report"],
  ["diagnostic programs", "test programs"],
  ["diagnostic program", "test program"],
  ["diagnostic unit", "test room"],
  ["diagnostic test", "test"],
  ["clinical briefing", "medical meeting"],
  ["clinical note", "medical note"],
  ["outpatient clinic", "clinic"],
  ["rehabilitation session", "recovery session"],
  ["dosage instructions", "medicine instructions"],
  ["valid prescriptions", "valid doctor's notes"],
  ["laboratory technicians", "lab workers"],
  ["laboratory technician", "lab worker"],
  ["laboratory procedure", "lab rules"],
  ["laboratory study", "lab study"],
  ["laboratory log", "lab notes"],
  ["preliminary data", "early results"],
  ["research log", "study notes"],
  ["research plan", "study plan"],
  ["observation team", "study team"],
  ["observation plan", "study plan"],
  ["field station", "field site"],
  ["curriculum meeting", "school meeting"],
  ["curriculum", "study"],
  ["examination guidelines", "test instructions"],
  ["examination portal", "test website"],
  ["examination schedule", "test schedule"],
  ["reporting instructions", "test instructions"],
  ["valid identity card", "valid ID card"],
  ["practical demonstration", "practical lesson"],
  ["under supervision", "with guidance"],
  ["reserved ticket", "booked ticket"],
  ["departure board", "travel board"],
  ["maintenance bay", "repair area"],
  ["braking system", "brakes"],
  ["inspection report", "check report"],
  ["inspection note", "check note"],
  ["safety inspection", "safety check"],
  ["routine inspection", "routine check"],
  ["wholesale market", "large market"],
  ["packaged goods", "packed goods"],
  ["bulk order", "large order"],
  ["purchase invoice", "bill"],
  ["supplier invoice", "supplier bill"],
  ["warehouse stock", "stored goods"],
  ["reusable shopping bag", "shopping bag"],
  ["qualifying round", "next round"],
  ["conditioning session", "fitness session"],
  ["public service centre", "service centre"],
  ["verification counter", "checking desk"],
  ["field review", "field check"],
  ["beta version", "test version"],
  ["firmware update", "software update"],
  ["protected wetland", "protected lake area"],
  ["reservoir", "lake"],
  ["irrigation demonstration", "water-use lesson"],
  ["irrigation channel", "water channel"],
  ["irrigation pumps", "water pumps"],
  ["irrigation pump", "water pump"],
  ["irrigation plan", "water plan"],
  ["production output", "work output"],
  ["assembly line", "work line"],
  ["structural defect", "serious fault"],
  ["technical review", "repair check"],
  ["technical inspection", "safety check"],
  ["resurfacing", "road repair"],
  ["before commissioning", "before use"],
  ["commissioning", "use"],
  ["distribution line", "power line"],
  ["transaction instructions", "payment instructions"],
  ["transaction rules", "payment rules"],
  ["settlement rules", "payment rules"],
  ["registered letter", "special letter"],
  ["handheld system", "mobile device"],
  ["calculating postage", "checking the mail charge"],
  ["residential route", "home-delivery route"],
  ["public exhibition", "public display"],
  ["main exhibition", "main display"],
  ["chamber group", "music group"],
  ["publication", "release"],
  ["broadcast", "show"],
  ["editorial", "news"],
  ["clinical", "medical"],
  ["diagnostic", "test"],
  ["protocol", "rules"],
  ["assessment", "check"],
  ["conservation", "care"],
  ["deployment", "setup"],
  ["settlement", "payment"],
  ["occupancy", "room use"],
  ["preliminary", "early"],
  ["firmware", "software"],
  ["wholesale", "large"],
  ["laboratory", "lab"],
  ["verification", "checking"],
  ["maintenance", "repair"],
] as const;

function editorializeText(text: string): string {
  let out = text;
  for (const [from, to] of EDITORIAL_PHRASE_REPLACEMENTS) {
    out = out.replaceAll(from, to);
  }
  return out.replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
}

function editorializeSegments(segments: readonly string[]): string[] {
  return segments.map(editorializeText);
}

interface ModifierEchoRepair {
  correctSegments: string[];
  errorSegments: string[];
  repaired: boolean;
}

/**
 * If a modifier repeats the same -ing verb as the main verb, use the scene's
 * other authored modifier. This removes machine-like wording without changing
 * the grammar rule or the error segment.
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
  const mergeCandidates = [0, 1, 2].filter((index) => index !== errorIndex && index + 1 !== errorIndex);
  if (mergeCandidates.length === 0) throw new Error(`Unable to preserve error segment ${errorIndex} while shaping QL002`);
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
    if (!rule.allowedDifficulties.includes(input.difficulty)) throw new Error(`${input.ruleId} does not support ${input.difficulty}`);
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

function choosePlainContext(
  candidate: Eng001SentenceCandidate,
  domain: keyof typeof CONTEXT_EXPANSIONS_BY_DOMAIN_V4,
  seed: string,
) {
  const source = candidate.correctSegments.join(" ").toLowerCase();
  const pool = CONTEXT_EXPANSIONS_BY_DOMAIN_V4[domain];
  const eligible = pool.filter((entry) => !source.includes(entry.text.toLowerCase()));
  return deterministicPick(seed, eligible.length > 0 ? eligible : pool);
}

function isPluralCorrection(correction: string): boolean {
  const first = correction.trim().toLowerCase().split(/\s+/)[0] ?? "";
  return first === "are" || first === "have" || first === "were";
}

function simpleRuleExplanation(candidate: Eng001SentenceCandidate): string {
  const correction = candidate.correction ?? "the correct verb";
  switch (candidate.ruleId) {
    case "GR-SVA-001":
      return `The subject is ${isPluralCorrection(correction) ? "plural" : "singular"}, so use “${correction}”.`;
    case "GR-SVA-002":
      return `“Each” and “Every” are treated as singular, so use “${correction}”.`;
    case "GR-SVA-003":
      return `In “one of ...”, the subject is “one”, so use “${correction}”.`;
    case "GR-SVA-004":
      return candidate.correctSegments[0]?.startsWith("A number of")
        ? `“A number of” means several, so use the plural verb “${correction}”.`
        : `“The number of” refers to one total, so use the singular verb “${correction}”.`;
    case "GR-SVA-005":
      return `Words after “along with”, “together with” or “as well as” do not change the main subject. Use “${correction}”.`;
    case "GR-SVA-006":
      return `With “either...or” and “neither...nor”, the verb follows the nearer subject. Use “${correction}”.`;
    case "GR-SVA-007":
      return isPluralCorrection(correction)
        ? `The sentence shows the members acting separately, so use “${correction}”.`
        : `The group acts as one, so use “${correction}”.`;
    case "GR-SVA-008":
      return `“More than one” takes a singular verb, so use “${correction}”.`;
    case "GR-SVA-009":
      return `“Many a/an” takes a singular verb, so use “${correction}”.`;
    case "GR-SVA-010":
      return `The verb matches the main subject, not the noun in the middle. Use “${correction}”.`;
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
  const context = choosePlainContext(
    candidate,
    domain,
    decorrelatedContextSeed(input.seed, candidate.ruleId, domain),
  );

  const modifierRepair = repairBaseSceneModifierEcho(candidate);
  const isNoError = qlId === "ENG-001-QL007";
  const rawErrorIndex = isNoError ? null : candidate.errorIndex;
  const editorialCorrect = editorializeSegments(modifierRepair.correctSegments);
  const editorialError = editorializeSegments(modifierRepair.errorSegments);
  const contextualCorrect = contextualizeSegments(editorialCorrect, candidate.errorIndex, context.text);
  const contextualError = contextualizeSegments(editorialError, candidate.errorIndex, context.text);
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
    stem: STEMS[qlId][0]!,
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
