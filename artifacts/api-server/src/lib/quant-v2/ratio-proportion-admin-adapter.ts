import { randomUUID } from "node:crypto";

import type {
  DifficultyLabel,
  ExamProfileId,
  FormulaQuestion,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import {
  createRatioProportionProblem,
  RATIO_PROPORTION_FAMILY_IDS,
} from "../../quant-v2/canonical/ratio-proportion-motif-factories";
import type {
  CanonicalRatioProportionProblem,
  RatioProportionFamilyId,
} from "../../quant-v2/canonical/ratio-proportion-types";
import { buildRatioProportionReasoningGraph } from "../../quant-v2/reasoning/ratio-proportion-reasoning-graph";
import { validateRatioProportionIndependentSolver } from "../../quant-v2/validators/ratio-proportion-independent-solver";

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

function difficultyMetadata(problem: CanonicalRatioProportionProblem) {
  const difficulty = titleDifficulty(problem.difficulty);
  const score =
    problem.complexity === "advanced" ? 8 :
      problem.complexity === "hard" ? 7 :
        problem.complexity === "medium" ? 5 : 3;
  return {
    difficulty,
    difficultyMetadata: {
      difficultyScore: score,
      difficultyLabel: difficulty,
      reasoningDepth:
        problem.complexity === "advanced" ? 4 :
          problem.complexity === "hard" ? 3 :
            problem.complexity === "medium" ? 2 : 1,
      calculationComplexity: score,
      distractorComplexity: problem.traps.length,
      ambiguityScore: 0,
      solvingTimeEstimate: 35 + score * 10,
      cognitiveLoad: score,
      metrics: {},
    },
  };
}

function qualityMetrics(problem: CanonicalRatioProportionProblem, graph: ReturnType<typeof buildRatioProportionReasoningGraph>) {
  const realism = problem.auditMeta.realismScore;
  return {
    valid: true,
    score: realism,
    metrics: {
      overallQualityScore: realism,
      editorialRealismScore: realism,
      stemNaturalness: Math.min(96, realism + 3),
      optionQuality: 90,
      explanationQuality: graph.steps.length >= 3 ? 90 : 84,
    },
  };
}

export function isQuantV2RatioProportionPattern(pattern: Pattern) {
  const text = `${pattern.generationDomain ?? ""} ${pattern.topic ?? ""} ${pattern.subtopic ?? ""} ${pattern.id ?? ""} ${pattern.name ?? ""}`.toLowerCase();
  return /quant-v2-ratio-proportion|ratio[-_\s]*(?:proportion|variation)|ratio,\s*proportion|ratio and proportion|\bratios?\b|\bproportion\b|\bvariation\b|अनुपात|ਸਮਾਨੁਪਾਤ|ਅਨੁਪਾਤ/u.test(text);
}

export function createQuantV2RatioProportionQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const seed =
    options?.seed ??
    options?.generationContext?.seed ??
    `${pattern.id}:ratio-proportion:${randomUUID()}`;
  const runId = options?.generationContext?.generationId ?? randomUUID();
  const difficulty = requestedDifficulty(pattern, options);
  const forced = String(options?.forcedMotifId ?? "");
  const family = RATIO_PROPORTION_FAMILY_IDS.includes(forced as RatioProportionFamilyId)
    ? forced as RatioProportionFamilyId
    : undefined;
  const problem = createRatioProportionProblem({ seed, runId, difficulty, family });
  const graph = buildRatioProportionReasoningGraph(problem);
  const quality = qualityMetrics(problem, graph);
  const solverValidation = validateRatioProportionIndependentSolver({
    problem,
    explanation: problem.localizationData.explanation.en,
    options: problem.options,
    correct: problem.correct,
  });
  if (!solverValidation.valid) {
    throw new Error(`Ratio/Proportion V2 solver validation failed: ${solverValidation.issues.join("; ")}`);
  }

  const semanticMetadata = {
    problem,
    examinerIntent: { primaryIntent: problem.family },
    canonicalScenario: {
      domain: "ratio_proportion",
      object: problem.family,
    },
    corpusFingerprints: {
      topologyFingerprint: `${problem.topology.family}:${problem.topology.variant}`,
      operationFingerprint: graph.steps.map((step) => step.id).join(">"),
      percentageVectorFingerprint: Object.entries(problem.variables)
        .map(([key, value]) => `${key}:${value}`)
        .join("|"),
      semanticIntentFingerprint: problem.family,
      distractorPatternFingerprint: problem.traps.join("|"),
      compositeFingerprint: `${problem.family}:${problem.auditMeta.numericSignature}:${problem.answerText}`,
    },
  };
  const nativeRealization = {
    en: {
      language: "en",
      stem: problem.localizationData.stem.en,
      explanation: problem.localizationData.explanation.en,
      lines: problem.localizationData.explanation.en.split(/\n/u),
    },
    hi: {
      language: "hi",
      stem: problem.localizationData.stem.hi,
      explanation: problem.localizationData.explanation.hi,
      lines: problem.localizationData.explanation.hi.split(/\n/u),
    },
    pa: {
      language: "pa",
      stem: problem.localizationData.stem.pa,
      explanation: problem.localizationData.explanation.pa,
      lines: problem.localizationData.explanation.pa.split(/\n/u),
    },
  };
  const realism = problem.auditMeta.realismScore;
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
    generationBackend: "quant-v2-ratio-proportion",
    debugSource: "quant-v2-ratio-proportion",
    proceduralLogic: { quantV2: { problem, reasoningGraph: graph }, validatorReports: { solverValidation } },
    languages: ["en", "hi", "pa"],
    reasoningGraph: graph,
    semanticMetadata,
    qualityMetrics: quality,
    localizationMetadata: { languages: ["en", "hi", "pa"], fallbackCount: 0 },
    pedagogicalMetrics: { explanationStepCount: graph.steps.length, directness: "clean" },
    section: pattern.section,
    topic: "ratio_proportion",
    subtopic: problem.family,
    optionMetadata: problem.options.map((value, index) => ({
      value,
      isCorrect: index === problem.correct,
      ...(index === problem.correct ? {} : {
        distractorType: "ratioInversion" as const,
        likelyMistake: problem.traps[index % problem.traps.length] ?? "ratio base confusion",
        reasoningTrap: problem.traps[index % problem.traps.length] ?? "ratio base confusion",
      }),
    })),
    examRealismMetadata: {
      examProfile: examProfile as ExamProfileId,
      wordingStyle: problem.complexity === "hard" || problem.complexity === "advanced" ? "inference-heavy" : "balanced",
      reasoningTraps: problem.traps,
      weightingSummary: ["Ratio, Proportion & Variation V2"],
      realismScore: realism,
      realismBand: realism >= 86 ? "strong" : "moderate",
      realismSignals: ["exam-natural ratio statement", "solver-backed proportional reasoning"],
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
      realismScore: realism,
    },
    debugMetadata: {
      selectedPattern: pattern.id,
      seed,
      generationId: runId,
      generationTimestamp: Date.now(),
      generationDomain: "quant-v2-ratio-proportion",
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
        realismScore: realism,
      },
      quantV2: {
        canonicalProblem: problem,
        topology: problem.topology,
        signature: `${problem.family}|${problem.auditMeta.numericSignature}|${problem.answerText}`,
        reasoningGraph: graph,
        semanticMetadata,
        validatorReports: { solverValidation },
        solverValidation,
        localized: nativeRealization,
        category: problem.category,
        subtype: problem.subtype,
        scenario: problem.family,
        reasoningPattern: "ratio_proportion",
        corpusFingerprints: semanticMetadata.corpusFingerprints,
        qualityMetrics: quality,
      },
      reasoningGraph: graph,
      semanticMetadata,
      localizationMetadata: { languages: ["en", "hi", "pa"] },
      pedagogicalMetrics: { explanationStepCount: graph.steps.length },
      validatorReports: { solverValidation },
      debugSource: "quant-v2-ratio-proportion",
    },
    ...difficultyPack,
  };
}
