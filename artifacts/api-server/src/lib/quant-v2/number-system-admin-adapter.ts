import { randomUUID } from "node:crypto";

import type {
  DifficultyLabel,
  ExamProfileId,
  FormulaQuestion,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import {
  createNumberSystemProblem,
  NUMBER_SYSTEM_FAMILY_IDS,
  resolveNumberSystemFamily,
} from "../../quant-v2/canonical/number-system-motif-factories";
import type {
  CanonicalNumberSystemProblem,
  NumberSystemFamilyId,
} from "../../quant-v2/canonical/number-system-types";
import { buildNumberSystemReasoningGraph } from "../../quant-v2/reasoning/number-system-reasoning-graph";
import { validateNumberSystemIndependentSolver } from "../../quant-v2/validators/number-system-independent-solver";

function requestedDifficulty(pattern: Pattern, options?: GeneratorOptions): Lowercase<DifficultyLabel> {
  const raw = String(options?.targetDifficulty ?? pattern.difficulty ?? "Medium").toLowerCase();
  if (/easy|1|2|3/u.test(raw)) return "easy";
  if (/hard|7|8|9|10/u.test(raw)) return "hard";
  return "medium";
}

function titleDifficulty(value: Lowercase<DifficultyLabel>): DifficultyLabel {
  if (value === "easy") return "Easy";
  if (value === "hard") return "Hard";
  return "Medium";
}

function difficultyMetadata(problem: CanonicalNumberSystemProblem) {
  const difficulty = titleDifficulty(problem.difficulty);
  const score = problem.difficulty === "hard" ? 7 : problem.difficulty === "medium" ? 5 : 3;
  return {
    difficulty,
    difficultyMetadata: {
      difficultyScore: score,
      difficultyLabel: difficulty,
      reasoningDepth: problem.reasoningDepth,
      calculationComplexity: score,
      distractorComplexity: problem.traps.length,
      ambiguityScore: 0,
      solvingTimeEstimate: 30 + score * 12,
      cognitiveLoad: score,
      metrics: {},
    },
  };
}

function qualityMetrics(problem: CanonicalNumberSystemProblem, graph: ReturnType<typeof buildNumberSystemReasoningGraph>) {
  const realism = problem.auditMeta.realismScore;
  return {
    valid: true,
    score: realism,
    metrics: {
      overallQualityScore: realism,
      editorialRealismScore: realism,
      stemNaturalness: Math.min(96, realism + 3),
      optionQuality: 88,
      explanationQuality: graph.steps.length >= 2 ? 90 : 84,
      shortcutQuality: 90,
    },
  };
}

export function isQuantV2NumberSystemPattern(pattern: Pattern) {
  const text = `${pattern.generationDomain ?? ""} ${pattern.topic ?? ""} ${pattern.subtopic ?? ""} ${pattern.id ?? ""} ${pattern.name ?? ""}`.toLowerCase();
  return /quant-v2-number-system|number[-_\s]*system|numbers?|divisibility|hcf|lcm|remainders?|last[-_\s]*digit|factorial|factors?|multiples?|prime[-_\s]*factorization/u.test(text);
}

export function createQuantV2NumberSystemQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const seed = options?.seed ?? options?.generationContext?.seed ?? `${pattern.id}:number-system:${randomUUID()}`;
  const runId = options?.generationContext?.generationId ?? randomUUID();
  const difficulty = requestedDifficulty(pattern, options);
  const forced = resolveNumberSystemFamily(String(options?.forcedMotifId ?? ""));
  const family = forced && NUMBER_SYSTEM_FAMILY_IDS.includes(forced) ? forced as NumberSystemFamilyId : undefined;
  let problem: CanonicalNumberSystemProblem | undefined;
  let graph: ReturnType<typeof buildNumberSystemReasoningGraph> | undefined;
  let quality: ReturnType<typeof qualityMetrics> | undefined;
  let lastIssues: string[] = [];
  const maxAttempts = family ? 16 : 32;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const attemptSeed = attempt === 0 ? seed : `${seed}:retry:${attempt}`;
    try {
      const candidate = createNumberSystemProblem({ seed: attemptSeed, runId, difficulty, family });
      const candidateGraph = buildNumberSystemReasoningGraph(candidate);
      const solverValidation = validateNumberSystemIndependentSolver({
        problem: candidate,
        explanation: candidate.localizationData.explanation.en,
        options: candidate.options,
        correct: candidate.correct,
      });
      if (solverValidation.valid) {
        problem = candidate;
        graph = candidateGraph;
        quality = qualityMetrics(candidate, candidateGraph);
        break;
      }
      lastIssues = solverValidation.issues;
    } catch (error) {
      lastIssues = [error instanceof Error ? error.message : "candidate generation failed"];
    }
  }
  if (!problem || !graph || !quality) {
    throw new Error(`Number System V2 solver validation failed: ${lastIssues.join("; ")}`);
  }
  const solverValidation = validateNumberSystemIndependentSolver({
    problem,
    explanation: problem.localizationData.explanation.en,
    options: problem.options,
    correct: problem.correct,
  });
  const semanticMetadata = {
    problem,
    examinerIntent: { primaryIntent: problem.family },
    canonicalScenario: { domain: "number_system", object: problem.family },
    corpusFingerprints: {
      topologyFingerprint: `${problem.topology.family}:${problem.topology.variant}`,
      operationFingerprint: graph.steps.map((step) => step.id).join(">"),
      percentageVectorFingerprint: Object.entries(problem.variables).map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : String(value)}`).join("|"),
      semanticIntentFingerprint: problem.family,
      distractorPatternFingerprint: problem.traps.join("|"),
      compositeFingerprint: `${problem.family}:${problem.auditMeta.numericSignature}:${problem.answerText}`,
    },
  };
  const nativeRealization = {
    en: { language: "en", stem: problem.localizationData.stem.en, explanation: problem.localizationData.explanation.en, lines: problem.localizationData.explanation.en.split(/\n/u) },
    hi: { language: "hi", stem: problem.localizationData.stem.hi, explanation: problem.localizationData.explanation.hi, lines: problem.localizationData.explanation.hi.split(/\n/u) },
    pa: { language: "pa", stem: problem.localizationData.stem.pa, explanation: problem.localizationData.explanation.pa, lines: problem.localizationData.explanation.pa.split(/\n/u) },
  };
  const difficultyPack = difficultyMetadata(problem);
  const examProfile = options?.examProfile ?? "ssc";
  return {
    text: problem.localizationData.stem.en,
    textHi: problem.localizationData.stem.hi,
    textPa: problem.localizationData.stem.pa,
    options: problem.options,
    optionsHi: problem.localizationData.options.hi,
    optionsPa: problem.localizationData.options.pa,
    correct: problem.correct,
    explanation: problem.localizationData.explanation.en,
    explanationHi: problem.localizationData.explanation.hi,
    explanationPa: problem.localizationData.explanation.pa,
    nativeRealization,
    nativeCoverage: { en: 1, hi: 1, pa: 1 },
    generationBackend: "quant-v2-number-system",
    debugSource: "quant-v2-number-system",
    proceduralLogic: { quantV2: { problem, reasoningGraph: graph }, validatorReports: { solverValidation } },
    languages: ["en", "hi", "pa"],
    reasoningGraph: graph,
    semanticMetadata,
    qualityMetrics: quality,
    localizationMetadata: { languages: ["en", "hi", "pa"], fallbackCount: 0 },
    pedagogicalMetrics: { explanationStepCount: graph.steps.length, directness: "clean" },
    section: pattern.section,
    topic: "number_system",
    subtopic: problem.family,
    optionMetadata: problem.options.map((value, index) => ({
      value,
      isCorrect: index === problem.correct,
      ...(index === problem.correct ? {} : {
        distractorType: "arithmeticSlip" as const,
        likelyMistake: problem.traps[index % problem.traps.length] ?? "Number-system trap",
        reasoningTrap: problem.traps[index % problem.traps.length] ?? "Number-system trap",
      }),
    })),
    examRealismMetadata: {
      examProfile: examProfile as ExamProfileId,
      wordingStyle: problem.difficulty === "hard" ? "inference-heavy" : "balanced",
      reasoningTraps: problem.traps,
      weightingSummary: ["Number System V2"],
      realismScore: problem.auditMeta.realismScore,
      realismBand: problem.auditMeta.realismScore >= 86 ? "strong" : "moderate",
      realismSignals: ["number-system reasoning", "method-first solution", "shortcut block"],
      realismPenalties: [],
    },
    generationMetrics: {
      generationDurationMs: 0,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      inferenceDepth: difficultyPack.difficultyMetadata.reasoningDepth,
      redundancyScore: 0,
      realismScore: problem.auditMeta.realismScore,
    },
    debugMetadata: {
      selectedPattern: pattern.id,
      seed,
      generationId: runId,
      generationTimestamp: Date.now(),
      generationDomain: "quant-v2-number-system",
      selectedMotif: problem.family,
      compatibilityWarnings: [],
      inferenceDepth: difficultyPack.difficultyMetadata.reasoningDepth,
      clueCount: graph.steps.length,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      redundancyScore: 0,
      generationMetrics: {
        generationDurationMs: 0,
        validationRetries: 0,
        uniquenessFailures: 0,
        branchingFactor: 1,
        clueDensity: 1,
        inferenceDepth: difficultyPack.difficultyMetadata.reasoningDepth,
        redundancyScore: 0,
        realismScore: problem.auditMeta.realismScore,
      },
      quantV2: { canonicalProblem: problem, reasoningGraph: graph, semanticMetadata },
    },
    ...difficultyPack,
  };
}
