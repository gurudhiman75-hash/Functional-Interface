import type { GeneratedOptions, GeneratedParameters, ProbabilityExperiment, ProbabilityQuestionLanguageEntry, ProbabilityTaskRegistryEntry, SolvedProbability, ValidationCheck, ValidationResult, VerificationResult } from "./types";
import type { ProbabilityExamProfileConfig } from "./exam-profile";
import { isEntryAllowedForExamProfile } from "./exam-profile";
import { answerText, isProbability } from "./rational";

function words(text: string): number { return text.trim().split(/\s+/).filter(Boolean).length; }
function check(name: string, passed: boolean, message: string, blocker = true): ValidationCheck { return { name, passed, message: passed ? "passed" : message, blocker }; }
function probabilityLiteralsAreValid(stem: string): boolean {
  const patterns = [
    /\bprobability\s*(?:is|=)\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)/gi,
    /\bP\([^)]*\)\s*=\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)/g,
  ];
  for (const pattern of patterns) {
    for (const match of stem.matchAll(pattern)) {
      const raw = match[1]!;
      const value = raw.includes("/") ? Number(raw.split("/")[0]) / Number(raw.split("/")[1]) : Number(raw);
      if (!Number.isFinite(value) || value < 0 || value > 1) return false;
    }
  }
  return true;
}
function hasGrammarDefect(value: string): boolean {
  if (/\b1\s+(?:tosses|balls|women|men|cards|draws|sectors|outcomes|heads|tails|students|people)\b/i.test(value)) return true;
  if (/\b(?:exactly\s+)?one\s+\w+\s+are\b/i.test(value)) return true;
  if (/\ba ace\b/i.test(value)) return true;
  for (const match of value.matchAll(/\bexactly\s+(\d+)\s+(?:of\s+the\s+drawn\s+)?\w+\s+(is|are)\b/gi)) {
    const count = Number(match[1]), verb = match[2]!.toLowerCase();
    if ((count === 1 && verb !== "is") || (count !== 1 && verb !== "are")) return true;
  }
  return /\b1\s+are\b/i.test(value);
}
function hasStemExplanationContextAgreement(stem: string, explanation: string[]): boolean {
  const value = explanation.join(" ");
  const rules = [
    { stem: /\bpens?\b/i, explanation: /\bpens?\b/i },
    { stem: /\bmarbles?\b/i, explanation: /\bmarbles?\b/i },
    { stem: /\bcoloured stones?\b/i, explanation: /\bstones?\b/i },
    { stem: /\bballs?\b/i, explanation: /\bballs?\b/i },
  ];
  return rules.every((rule) => !rule.stem.test(stem) || rule.explanation.test(value));
}

function hasGenericExplanation(explanation: string[]): boolean {
  const genericPatterns = [
    /^Favourable outcomes\s*=/i,
    /^Total outcomes\s*=/i,
    /^Total possible outcomes\s*=/i,
    /^Required (?:cases|selections|outcomes)\s*=\s*\d+\.?$/i,
    /^Count (?:all|the) /i,
    /^Use the (?:stated|given) probability relation/i,
    /^Apply the probability relation/i,
    /^Choose which 1\b/i,
    /^A (?:spade|heart|club|diamond) suit contains\b/i,
  ];
  return explanation.some((line) => genericPatterns.some((pattern) => pattern.test(line.trim())));
}

function hasConcreteOutcomeEvidence(entry: ProbabilityTaskRegistryEntry, explanation: string[]): boolean {
  const value = explanation.join(" ");
  const coinModes = [
    "findAtLeastOneUsingComplement", "findNoneProbability", "findExactlyOneSuccess", "findExactlyKSuccessSmallCase",
    "findAtMostKSuccessSmallCase", "findAllSuccessOrNotAll", "findCoinPatternProbability", "findCoinHeadCountProbability",
  ];
  if (coinModes.includes(entry.solveMode)) return /\b[HT]{2,5}\b/.test(value);
  if (["findTwoDiceSumProbability", "findTwoDiceProductOrParityProbability"].includes(entry.solveMode)) return /\(\d,\d\)/.test(value) || /Odd faces are 1, 3, 5/.test(value);
  if (entry.solveMode === "findSingleDieEventProbability") return /favourable faces are/i.test(value);
  if (entry.solveMode === "findNumberRangePropertyProbability") return /required integers are|first required integers are/i.test(value);
  return true;
}


const EXAM_DEPTH_MODES = new Set([
  "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability",
  "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType",
  "findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability",
  "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws",
  "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages",
  "findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable", "findConditionalCardProbability",
  "findConditionalUrnProbability", "findReverseConditionalCount", "findCommitteeCompositionProbability",
  "findRestrictedSelectionProbability", "findReverseCountFromProbability", "findTogetherOrApartProbability",
  "findPositionRestrictionProbability", "findNumberFormationProbability", "findUnionProbability",
  "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability",
  "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability", "findMutuallyExclusiveUnion",
  "findIndependentIntersection",
]);

function hasMethodDecision(explanation: string[]): boolean {
  const value = explanation.join(" ");
  return /because|since|condition|use combinations|order|replacement|replaced|removed|without replacement|complement|restricted sample space|restricted group|sample space|overlap|counted twice|one block|last digit|first post|mutually exclusive|independent|both orders|possible selections|required people|C\(|P\(/i.test(value);
}

export function validateProbabilityQuestion(args: {
  entry: ProbabilityTaskRegistryEntry;
  language: ProbabilityQuestionLanguageEntry;
  parameters: GeneratedParameters;
  experiment: ProbabilityExperiment;
  stem: string;
  solved: SolvedProbability;
  options: GeneratedOptions;
  explanation: string[];
  verification: VerificationResult;
  examProfile: ProbabilityExamProfileConfig;
}): ValidationResult {
  const { entry, parameters, experiment, stem, solved, options, explanation, verification, examProfile } = args;
  const checks: ValidationCheck[] = [];
  const studentText = `${stem} ${explanation.join(" ")}`;

  checks.push(check("profile-topic-fit", isEntryAllowedForExamProfile(entry, examProfile), `${entry.solveMode} is not allowed for ${examProfile.id}.`));
  checks.push(check("required-variables", entry.requiredVariables.every((key) => parameters[key] !== undefined), "One or more required variables are missing."));
  checks.push(check("no-unresolved-placeholders", !/\{[^}]+\}/.test(stem), "The stem contains an unresolved placeholder."));
  checks.push(check("no-invalid-literals", !/(?:NaN|undefined|null|Infinity)/.test(studentText), "Invalid runtime literal found."));
  checks.push(check("exam-option-count", options.options.length === examProfile.optionCount, `${examProfile.id} requires ${examProfile.optionCount} options.`));
  checks.push(check("unique-options", new Set(options.options.map((item) => item.trim().toLowerCase())).size === examProfile.optionCount, "Options are not unique."));
  checks.push(check("valid-correct-index", options.correctIndex >= 0 && options.correctIndex < examProfile.optionCount, "Correct option index is invalid."));
  checks.push(check("correct-answer-once", options.options.filter((item) => item === answerText(solved.answer)).length === 1, "Correct answer must appear exactly once."));

  if (solved.answer.kind === "PROBABILITY") checks.push(check("probability-range", isProbability(solved.answer.exact), "Probability is outside [0,1]."));
  checks.push(check("positive-denominator", solved.answer.kind !== "PROBABILITY" || solved.answer.exact.denominator > 0n, "Probability denominator is not positive."));
  checks.push(check("displayed-probabilities-valid", probabilityLiteralsAreValid(stem), "The stem displays a value outside [0,1] as a probability."));

  const forbiddenStemPatterns = [
    /\b[A-Z]+(?:_[A-Z]+)+\b/,
    /\b(?:objective|outcome-based|event-based|selection-based|counting-based|multi-stage|classical|structured|conditional)\s+(?:problem|question|exercise|scenario|task|item|drill|case|example|experiment|setup|model)\b/i,
    /\busing target\b/i,
    /\bwhen applicable\b/i,
    /\btyped event\b/i,
    /\bcanonical universe\b/i,
    /\bThere are \d+ equally likely outcomes\b/i,
    /\bequally likely items\b/i,
    /\bit does not happen\b/i,
    /\ba ace\b/i,
    /\b(?:tokens?|counters?|selected files?)\b/i,
    /\bsatisf(?:y|ies) A(?:\s+or\s+B|\s+and\s+B)?\b/i,
  ];
  checks.push(check("natural-exam-language", forbiddenStemPatterns.every((pattern) => !pattern.test(stem)), "The stem contains internal, abstract or artificial template language."));
  checks.push(check("grammar-safe", !hasGrammarDefect(studentText), "The stem or explanation has a singular/plural or article defect."));

  const stemWords = words(stem);
  checks.push(check("concise-stem", stemWords >= 7 && stemWords <= 62, `Stem has ${stemWords} words; expected 7-62.`));
  const explanationText = explanation.join(" "), explanationWords = words(explanationText);
  const minimumExplanationWords = entry.difficulty === "Easy" ? 32 : entry.difficulty === "Medium" ? 48 : 55;
  const minimumExplanationLines = entry.difficulty === "Easy" ? 4 : 5;
  checks.push(check("detailed-explanation-length", explanationWords >= minimumExplanationWords && explanationWords <= 220, `Explanation has ${explanationWords} words; expected ${minimumExplanationWords}-220 for ${entry.difficulty}.`));
  checks.push(check("worked-solution-line-depth", explanation.length >= minimumExplanationLines, `${entry.difficulty} explanation has ${explanation.length} lines; expected at least ${minimumExplanationLines}.`));
  checks.push(check("worked-solution-structure", /^Approach —/.test(explanation[0] ?? "") && explanation.some((line) => /^Why this works —/.test(line)) && /^Answer —/.test(explanation[explanation.length - 1] ?? ""), "Explanation must contain an approach, worked steps, method justification and a final answer line."));
  checks.push(check("exam-depth-decision-path", !EXAM_DEPTH_MODES.has(entry.solveMode) || (explanation.length >= 5 && hasMethodDecision(explanation)), "A multi-step explanation must state the method decision and show at least five reasoning lines."));
  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts or uses unnatural instructional wording."));
  checks.push(check("stem-explanation-context-agreement", hasStemExplanationContextAgreement(stem, explanation), "The explanation changes the object named in the question stem."));
  checks.push(check("concrete-outcome-visibility", hasConcreteOutcomeEvidence(entry, explanation), "Small outcome spaces must show the actual H/T sequences, die faces, dice pairs or qualifying integers."));
  checks.push(check("no-qa-jargon-in-explanation", !/(typed event|independent check|permitted range|generated parameter|review trail|publication|validator|renderer|fingerprint|canonical universe)/i.test(explanationText), "The explanation contains internal QA language."));
  checks.push(check("no-adjacent-duplicate-lines", explanation.every((line, index) => index === 0 || line.trim() !== explanation[index - 1]!.trim()), "The explanation repeats the same line."));

  checks.push(check("sample-space-reason", solved.evidence.sampleSpaceReason.length > 10, "Sample-space reason is missing."));
  checks.push(check("method-reason", solved.evidence.methodReason.length > 10, "Method reason is missing."));
  checks.push(check("independent-verification", verification.supported && verification.matched, "Independent verification failed."));
  checks.push(check("equal-likelihood-declared", experiment.equallyLikely, "Initial production requires equally likely elementary outcomes."));
  if (experiment.kind === "CARD_DRAW") checks.push(check("canonical-deck", Number(experiment.metadata.deckSize) === 52, "Card experiment is not using the canonical 52-card deck."));
  if (experiment.kind === "URN_DRAW") {
    const red = Number(experiment.metadata.red), blue = Number(experiment.metadata.blue), draws = Number(experiment.metadata.draws);
    checks.push(check("valid-urn-state", red > 0 && blue > 0 && draws > 0 && draws <= red + blue, "Urn state or draw count is infeasible."));
  }
  if (entry.replacementPolicy !== "NOT_APPLICABLE") checks.push(check("replacement-clarity", /replacement|replaced|without replacement|with replacement/i.test(`${stem} ${solved.evidence.replacementReason ?? ""}`), "Replacement policy is not explicit."));
  if (entry.orderPolicy !== "UNORDERED" && (experiment.stages.length > 1 || ["PRB-CP-006", "PRB-CP-008"].includes(entry.cpId))) checks.push(check("order-clarity", /first|second|successive|position|post|line|number|toss|one after another|followed by|two fair dice|dice are rolled/i.test(`${stem} ${solved.evidence.sampleSpaceReason}`), "Order policy is not explicit."));
  if (entry.answerDimension === "COUNT") checks.push(check("count-answer", solved.answer.kind === "COUNT", "Registry expects a count answer."));
  else checks.push(check("probability-answer", solved.answer.kind === "PROBABILITY", "Registry expects a probability answer."));

  const valid = checks.filter((item) => item.blocker).every((item) => item.passed);
  return { valid, checks };
}
