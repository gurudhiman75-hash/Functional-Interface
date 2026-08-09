import type { ProbabilityCanonicalProblemId, ProbabilityGenerationInput, ProbabilityPackageLibraries, ProbabilityQuestion, ProbabilityTaskRegistryEntry } from "./types";
import { generateProbabilityParameters } from "./parameter-generation";
import { buildProbabilityExperiment } from "./experiment";
import { buildProbabilityEvent } from "./event";
import { solveProbability } from "./probability-solver";
import { verifyProbabilityIndependently } from "./independent-verifier";
import { buildProbabilityVisuals } from "./probability-visual";
import { generateProbabilityOptions } from "./option-generator";
import { buildRenderContext, renderQuestionStem } from "./probability-formatter";
import { renderStudentFacingStem } from "./student-facing-renderer";
import { explanationWordCount, renderProbabilityExplanation } from "./explanation-renderer";
import { remodelProbabilityExplanation, remodelProbabilityStem } from "./exam-depth-remodeler";
import { remodelTeachingCalculation } from "./teaching-calculation-remodeler";
import { renderProbabilityMathLines, renderProbabilityMathText } from "./math-text";
import { validateProbabilityQuestion } from "./validator";
import { calibrateEntryDifficulty, assessProbabilityDifficulty } from "./difficulty-calibrator";
import { isEntryAllowedForExamProfile, resolveProbabilityExamProfile, type ProbabilityExamProfileConfig } from "./exam-profile";
import { hashSeed, pickRandom, seededRandom } from "./random";

function stableStringify(value: unknown): string {
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
function fingerprint(value: unknown): string {
  const text = stableStringify(value);
  const a = hashSeed(text).toString(16).padStart(8, "0"), b = hashSeed(`${text}:b`).toString(16).padStart(8, "0");
  return `${a}${b}${b}${a}`;
}
function resolveEntry(
  libraries: ProbabilityPackageLibraries,
  cpId: ProbabilityCanonicalProblemId,
  input: ProbabilityGenerationInput,
  seed: string,
  profile: ProbabilityExamProfileConfig,
): ProbabilityTaskRegistryEntry {
  if (input.questionLanguageId) {
    const selected = libraries.registry.find((entry) => entry.qlId === input.questionLanguageId);
    if (!selected || selected.cpId !== cpId) throw new Error(`Invalid ${libraries.packageId} QL ${input.questionLanguageId} for ${cpId}`);
    if (!isEntryAllowedForExamProfile(selected, profile)) throw new Error(`${selected.qlId} / ${selected.solveMode} is not available in ${profile.id}.`);
    return selected;
  }
  const difficulty = input.difficultyBand ?? input.difficulty;
  const pool = libraries.registry.filter((entry) => entry.cpId === cpId && isEntryAllowedForExamProfile(entry, profile) && (!difficulty || calibrateEntryDifficulty(entry) === difficulty));
  if (!pool.length) throw new Error(`No ${libraries.packageId} entries for ${cpId}${difficulty ? ` at ${difficulty}` : ""} in ${profile.id}`);
  return pickRandom(seededRandom(`${seed}:ql:${profile.id}`), pool);
}

export function runProbabilityPackagePipeline(
  libraries: ProbabilityPackageLibraries,
  cpId: ProbabilityCanonicalProblemId,
  input: ProbabilityGenerationInput = {},
): ProbabilityQuestion {
  if (input.language && input.language !== "en") throw new Error(`${libraries.packageId} is English-only until human-reviewed localisation parity exists.`);

  const seed = input.seed ?? `${libraries.packageId}:${cpId}:proof`;
  const examProfile = resolveProbabilityExamProfile(input.examProfile, libraries.packageId, cpId);
  const registryEntry = resolveEntry(libraries, cpId, input, seed, examProfile);
  const entry: ProbabilityTaskRegistryEntry = { ...registryEntry, difficulty: calibrateEntryDifficulty(registryEntry) };
  const language = libraries.language.find((item) => item.qlId === entry.qlId);
  if (!language) throw new Error(`Missing English entry ${entry.qlId}`);

  const parameters = generateProbabilityParameters(entry, seed);
  const experiment = buildProbabilityExperiment(entry, parameters);
  const event = buildProbabilityEvent(entry, parameters);
  const solved = solveProbability(entry, experiment, event, parameters);
  if (experiment.orderPolicy === "ORDERED" && experiment.stages.length > 1 && !solved.evidence.orderReason) solved.evidence.orderReason = "The order of the stages matters.";
  if (experiment.replacementPolicy !== "NOT_APPLICABLE" && !solved.evidence.replacementReason) solved.evidence.replacementReason = experiment.replacementPolicy === "WITH_REPLACEMENT" ? "The object is replaced before the next draw." : "The object is not replaced before the next draw.";

  const verification = verifyProbabilityIndependently(entry, experiment, event, parameters, solved);
  const visuals = buildProbabilityVisuals(entry, parameters, experiment, event, solved);
  const options = generateProbabilityOptions(entry, parameters, solved, seed, examProfile.optionCount);
  const renderContext = buildRenderContext(parameters, solved);
  const legacyStem = renderQuestionStem(language, renderContext);
  const baseStem = renderStudentFacingStem(entry, parameters, solved, event, legacyStem);
  const plainStem = remodelProbabilityStem(entry, parameters, solved, baseStem);
  const baseExplanation = renderProbabilityExplanation(entry, language, parameters, solved, verification, visuals);
  const examDepthExplanation = remodelProbabilityExplanation(entry, parameters, solved, baseExplanation);
  const plainExplanation = remodelTeachingCalculation(entry, parameters, solved, examDepthExplanation);
  const difficultyAssessment = assessProbabilityDifficulty(entry, parameters);
  const validation = validateProbabilityQuestion({ entry, language, parameters, experiment, stem: plainStem, solved, options, explanation: plainExplanation, verification, examProfile });

  const stem = renderProbabilityMathText(plainStem);
  const renderedOptions = options.options.map(renderProbabilityMathText);
  const explanation = renderProbabilityMathLines(plainExplanation);

  const parameterFingerprint = fingerprint({ entry: entry.qlId, examProfile: examProfile.id, parameters, experiment, event });
  const mathematicalFingerprint = fingerprint({ entry: entry.qlId, solveMode: entry.solveMode, event, answer: solved.exactDisplay, evidence: solved.evidence });
  const questionId = `${entry.qlId}-${hashSeed(`${seed}:${examProfile.id}:${parameterFingerprint}`).toString(36)}`;

  return {
    packageId: libraries.packageId,
    archetypeId: libraries.packageId,
    canonicalProblemId: entry.cpId,
    questionLanguageId: entry.qlId,
    questionId,
    seed,
    language: "en",
    examProfile: examProfile.id,
    optionCount: examProfile.optionCount,
    difficultyBand: difficultyAssessment.difficulty,
    difficultyAssessment: { estimatedSteps: difficultyAssessment.estimatedSteps, reason: difficultyAssessment.reason, registryDifficulty: registryEntry.difficulty },
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    stem,
    options: renderedOptions,
    correctIndex: options.correctIndex,
    answer: renderProbabilityMathText(solved.exactDisplay),
    parameters: {
      ...parameters,
      packageId: libraries.packageId,
      canonicalProblemId: entry.cpId,
      questionLanguageId: entry.qlId,
      examProfile: examProfile.id,
      optionCount: examProfile.optionCount,
      eventStrategyId: entry.eventStrategyId,
      explanationStrategyId: entry.explanationStrategyId,
      distractorStrategyIds: entry.distractorStrategyIds,
      optionLabels: options.labels,
      replacementPolicy: experiment.replacementPolicy,
      orderPolicy: experiment.orderPolicy,
      answerDimension: entry.answerDimension,
      answerSemantic: entry.answerSemantic,
    },
    experiment,
    event,
    solver: {
      exactAnswer: solved.exactDisplay,
      answer: solved.exactDisplay,
      numericAnswer: solved.answer.kind === "COUNT" ? Number(solved.answer.exact) : Number(solved.answer.exact.numerator) / Number(solved.answer.exact.denominator),
      equation: solved.equation,
      mathJax: solved.mathJax,
      evidence: {
        ...solved.evidence,
        totalOutcomeCount: solved.evidence.totalOutcomeCount?.toString(),
        favourableOutcomeCount: solved.evidence.favourableOutcomeCount?.toString(),
        conditionalUniverseCount: solved.evidence.conditionalUniverseCount?.toString(),
        intersectionCount: solved.evidence.intersectionCount?.toString(),
        unionCount: solved.evidence.unionCount?.toString(),
        formulaCount: solved.evidence.formulaCount?.toString(),
        enumerationCount: verification.method === "EXACT_OUTCOME_ENUMERATION" ? verification.enumeratedFavourableCount : undefined,
      },
    },
    independentVerification: verification,
    reasoningEvidence: {
      conceptId: `${entry.cpId}:${entry.solveMode}`,
      experiment,
      event,
      givens: parameters,
      equations: [solved.equation],
      formulaTrace: solved.evidence.formulaTrace,
      decisiveCalculation: solved.equation,
      verification: verification.trace.join(" "),
      visualStrategies: visuals.map((visual) => visual.strategyId),
      difficultyAssessment,
    },
    explanation: { explanationId: `${entry.qlId}-${entry.explanationStrategyId}-CALCULATION-TEACHING-V6`, lines: explanation, wordCount: explanationWordCount(plainExplanation), visuals },
    validation,
    maturity: "PRODUCTION_QA",
    publiclyPublishable: false,
    mathematicalFingerprint,
    parameterFingerprint,
    traceability: {
      packageId: libraries.packageId,
      canonicalProblemId: entry.cpId,
      questionLanguageId: entry.qlId,
      examProfile: examProfile.id,
      examProfileLabel: examProfile.label,
      taskRegistryContractVersion: "PRB-TASK-REGISTRY-V1",
      studentRendererVersion: "PRB-MATHJAX-RENDERER-V5",
      explanationVersion: "PRB-CALCULATION-TEACHING-V6",
      experimentModelVersion: "PRB-EXPERIMENT-V1",
      eventAstVersion: "PRB-EVENT-AST-V1",
      difficulty: difficultyAssessment.difficulty,
      registryDifficulty: registryEntry.difficulty,
      taskKind: entry.taskKind,
      solveMode: entry.solveMode,
      reviewStatus: "EDITORIAL_REMEDIATION_PENDING_HUMAN_REVIEW",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      exactArithmetic: "BIGINT_RATIONAL",
      countingAuthority: entry.cpId === "PRB-CP-008" ? "PNC-001-FOUNDATION-MATH-VIA-SHARED-ADAPTER" : "NOT_REQUIRED",
      supportedLanguages: ["en"],
      freezeStatus: "NOT_FROZEN",
    },
  };
}
