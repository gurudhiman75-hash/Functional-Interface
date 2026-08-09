import type { CalendarOption, CalendarPrototypeId, CalendarQuestionPackage, Locale } from "./types.ts";
import { DeterministicRandom, semanticKey, stableDigest } from "./foundation.ts";
import { getPrototypeDefinition } from "./registry.ts";
import { buildOptions, defaultDimensions, difficultyFromDimensions, type Problem } from "./runtime-shared.ts";
import { shiftProblem } from "./runtime-cp001.ts";
import { dateRelationProblem } from "./runtime-cp002.ts";
import { leapBoundaryProblem } from "./runtime-cp003.ts";
import { absoluteAndYearProblem } from "./runtime-cp004-005.ts";
import { leapCenturyProblem } from "./runtime-cp006-007.ts";
import { repetitionBoundaryFrequencyProblem } from "./runtime-cp008.ts";
import { boundaryProblem } from "./runtime-cp009.ts";
import { frequencyProblem } from "./runtime-cp010.ts";
import {
  applyExamReadinessRemediation,
  buildExamReadyProblemOverride,
  shouldAcceptExamReadyProblem,
} from "./exam-readiness-remediation.ts";
import {
  applyAdditionalExamReadinessRemediation,
  buildAdditionalExamReadyProblemOverride,
} from "./exam-readiness-additional-remediation.ts";
import { buildFrequencyExamReadyProblemOverride } from "./exam-readiness-frequency-remediation.ts";
import { applyCalendarEnglishStemSimplification } from "./english-stem-simplification.ts";

const CLOSED_LIFECYCLE = {
  discoveryStatus: "EXECUTABLE_DISCOVERY" as const,
  editorialStatus: "NOT_FROZEN" as const,
  languageStatus: "DRAFT_NOT_HUMAN_APPROVED" as const,
  permanentQlId: null,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankStored: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
};

export function generateCalendarQuestion(prototypeAuthority: CalendarPrototypeId, seed: number, locale: Locale = "en-IN"): CalendarQuestionPackage {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("Seed must be a non-negative integer.");
  const definition = getPrototypeDefinition(prototypeAuthority);

  let problem: Problem | null = null;
  let options: CalendarOption[] | null = null;
  let answerIndex: 0 | 1 | 2 | 3 | null = null;
  let acceptedAttempt = -1;

  for (let attempt = 0; attempt < 256; attempt++) {
    const rng = new DeterministicRandom(`${prototypeAuthority}:${seed}:scenario:${attempt}`);
    const candidate = buildFrequencyExamReadyProblemOverride(prototypeAuthority, seed, locale, rng)
      ?? buildAdditionalExamReadyProblemOverride(prototypeAuthority, seed, locale, rng)
      ?? buildExamReadyProblemOverride(prototypeAuthority, seed, locale, rng)
      ?? shiftProblem(prototypeAuthority, seed, locale, rng)
      ?? dateRelationProblem(prototypeAuthority, seed, locale, rng)
      ?? leapBoundaryProblem(prototypeAuthority, seed, locale, rng)
      ?? absoluteAndYearProblem(prototypeAuthority, seed, locale, rng)
      ?? leapCenturyProblem(prototypeAuthority, seed, locale, rng)
      ?? repetitionBoundaryFrequencyProblem(prototypeAuthority, seed, locale, rng)
      ?? boundaryProblem(prototypeAuthority, seed, locale, rng)
      ?? frequencyProblem(prototypeAuthority, seed, locale, rng);
    if (!candidate) throw new Error(`No generator implemented for ${prototypeAuthority}.`);

    if (!shouldAcceptExamReadyProblem(prototypeAuthority, seed, candidate)) continue;
    if (semanticKey(candidate.groundTruth.answer) !== semanticKey(candidate.answer)) throw new Error(`${prototypeAuthority}: ground-truth disagreement.`);
    if (semanticKey(candidate.teachingTrace.answer) !== semanticKey(candidate.answer)) throw new Error(`${prototypeAuthority}: teaching-trace disagreement.`);

    try {
      const built = buildOptions(candidate, definition.outputType, locale, prototypeAuthority, seed);
      problem = candidate;
      options = built.options;
      answerIndex = built.answerIndex;
      acceptedAttempt = attempt;
      break;
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "DISTRACTOR_METHOD_COLLISION") throw error;
    }
  }

  if (!problem || !options || answerIndex === null) {
    throw new Error(`${prototypeAuthority}: unable to construct an exam-ready scenario with three semantically unique method-derived distractors after 256 deterministic attempts.`);
  }
  problem.facts.generationAttempt = acceptedAttempt;

  const dimensions = defaultDimensions(problem, seed);
  const coverageFlags = {
    crossesMonth: false,
    crossesYear: false,
    crossesFeb29: false,
    crossesCentury: false,
    usesCenturyYear: false,
    usesDivisibleBy400Year: false,
    usesBackwardMovement: false,
    usesInclusiveCounting: false,
    ...problem.coverage,
  };

  const pkg: CalendarQuestionPackage = {
    chapter: "CAL-001",
    family: "REAS-CAL",
    checkpoint: definition.checkpoint,
    prototypeAuthority,
    permanentQlId: null,
    version: "CAL-001-DISCOVERY-V1",
    seed,
    locale,
    queryType: problem.queryType,
    outputType: definition.outputType,
    stemTemplateId: `${prototypeAuthority}-${locale}-T${(seed % 3) + 1}`,
    explanationTemplateId: `CAL-EXPL-${definition.explanationFamily}`,
    stem: problem.stem,
    facts: problem.facts,
    canonicalAnswer: problem.answer,
    groundTruth: problem.groundTruth,
    teachingTrace: problem.teachingTrace,
    crossCheck: {
      passed: true,
      groundTruthDigest: stableDigest(problem.groundTruth),
      teachingTraceDigest: stableDigest(problem.teachingTrace),
    },
    options,
    answerIndex,
    explanation: problem.explanation,
    difficulty: difficultyFromDimensions(dimensions),
    difficultyDimensions: dimensions,
    mathematicalFingerprint: stableDigest({ prototypeAuthority, facts: problem.facts, answer: problem.answer }),
    coverageFlags,
    lifecycle: { ...CLOSED_LIFECYCLE },
  };

  const remediated = applyAdditionalExamReadinessRemediation(applyExamReadinessRemediation(pkg));
  const simplified = applyCalendarEnglishStemSimplification(remediated);
  const optionKeys = simplified.options.map((option) => semanticKey(option.semanticValue));
  if (simplified.options.length !== 4 || new Set(optionKeys).size !== 4) throw new Error(`${prototypeAuthority}: options are not semantically unique.`);
  if (new Set(simplified.options.map((option) => option.display)).size !== 4) throw new Error(`${prototypeAuthority}: option labels are not textually unique.`);
  if (simplified.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${prototypeAuthority}: expected exactly one correct option.`);
  if (!simplified.options[simplified.answerIndex]?.isCorrect) throw new Error(`${prototypeAuthority}: answer index mismatch.`);
  return simplified;
}
