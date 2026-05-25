import type {
  DifficultyLabel,
  ExamProfileId,
  FormulaQuestion,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import {
  createInterestProblem,
  INTEREST_FAMILY_IDS,
} from "../../quant-v2/canonical/interest-motif-factories";
import type {
  CanonicalInterestProblem,
  InterestAnswerKind,
  InterestAnswerSemantic,
  InterestFamilyId,
  InterestRealization,
  InterestStep,
} from "../../quant-v2/canonical/interest-types";
import { validateInterestIndependentSolver } from "../../quant-v2/validators/interest-independent-solver";

function titleDifficulty(value: Lowercase<DifficultyLabel>): DifficultyLabel {
  if (value === "easy") return "Easy";
  if (value === "hard") return "Hard";
  return "Medium";
}

function requestedDifficulty(pattern: Pattern, options?: GeneratorOptions): Lowercase<DifficultyLabel> {
  const raw = String(options?.targetDifficulty ?? pattern.difficulty ?? "Medium").toLowerCase();
  if (/easy|1|2|3/u.test(raw)) return "easy";
  if (/hard|7|8|9|10/u.test(raw)) return "hard";
  return "medium";
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function amount(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${amount(value)}`;
}

function percent(value: number) {
  return `${amount(value)}%`;
}

function answerText(problem: CanonicalInterestProblem, language: "en" | "hi" | "pa" = "en") {
  const label = (semantic: InterestAnswerSemantic) => {
    const labels: Record<InterestAnswerSemantic, Record<"en" | "hi" | "pa", string>> = {
      simple_interest: { en: "simple interest", hi: "साधारण ब्याज", pa: "ਸਧਾਰਣ ਬਿਆਜ" },
      compound_interest: { en: "compound interest", hi: "चक्रवृद्धि ब्याज", pa: "ਚੱਕਰਵ੍ਰਿੱਧੀ ਬਿਆਜ" },
      amount: { en: "amount", hi: "कुल राशि", pa: "ਕੁੱਲ ਰਕਮ" },
      principal: { en: "principal", hi: "मूलधन", pa: "ਮੂਲਧਨ" },
      rate: { en: "rate", hi: "दर", pa: "ਦਰ" },
      time: { en: "years", hi: "वर्ष", pa: "ਸਾਲ" },
      difference: { en: "difference", hi: "अंतर", pa: "ਅੰਤਰ" },
      installment: { en: "installment", hi: "किस्त", pa: "ਕਿਸ਼ਤ" },
      present_worth: { en: "present worth", hi: "वर्तमान मूल्य", pa: "ਮੌਜੂਦਾ ਮੁੱਲ" },
      bankers_discount: { en: "banker's discount", hi: "बैंकर्स डिस्काउंट", pa: "ਬੈਂਕਰ ਛੂਟ" },
      true_discount: { en: "true discount", hi: "सच्ची छूट", pa: "ਅਸਲ ਛੂਟ" },
      bankers_gain: { en: "banker's gain", hi: "बैंकर्स लाभ", pa: "ਬੈਂਕਰ ਲਾਭ" },
      final_value: { en: "final value", hi: "अंतिम मूल्य", pa: "ਅੰਤਿਮ ਮੁੱਲ" },
      effective_rate: { en: "effective annual rate", hi: "प्रभावी वार्षिक दर", pa: "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ" },
      investment_ratio: { en: "investment ratio", hi: "निवेश अनुपात", pa: "ਨਿਵੇਸ਼ ਅਨੁਪਾਤ" },
    };
    return labels[semantic][language];
  };
  if (problem.answerKind === "amount") return `${money(problem.answer)}`;
  if (problem.answerKind === "percent" || problem.answerKind === "rate") return `${percent(problem.answer)} ${label(problem.answerSemantic)}`;
  if (problem.answerKind === "time") return `${amount(problem.answer)} ${label(problem.answerSemantic)}`;
  return amount(problem.answer);
}

function optionText(value: number, kind: InterestAnswerKind, semantic: InterestAnswerSemantic, language: "en" | "hi" | "pa") {
  const clone: CanonicalInterestProblem = {
    id: "option",
    topic: "interest",
    family: "int_si_from_prt",
    subtype: "int_si_from_prt",
    category: "interest",
    variables: {},
    answer: value,
    answerKind: kind,
    answerSemantic: semantic,
    difficulty: "easy",
    complexity: "easy",
    topology: { family: "interest", variant: "int_si_from_prt" },
    traps: [],
    distractors: [],
    context: { en: "", hi: "", pa: "" },
    customStem: { en: "", hi: "", pa: "" },
    customSteps: [],
  };
  return answerText(clone, language);
}

function stepLines(steps: InterestStep[], language: "en" | "hi" | "pa") {
  return steps
    .map((step) => {
      const label = step[language];
      if (!step.expression) return label;
      const value = step.value === undefined ? "" : `\n= ${amount(step.value)}`;
      return `${label}\n${step.expression}${value}`;
    })
    .join("\n\n");
}

function rotateStem(stem: CanonicalInterestProblem["customStem"], problem: CanonicalInterestProblem) {
  const variants: Array<[string, string, string]> = [
    ["", "", ""],
    ["In a bank calculation, ", "एक बैंक गणना में, ", "ਇੱਕ ਬੈਂਕ ਗਿਣਤੀ ਵਿੱਚ, "],
    ["For a finance-company record, ", "एक वित्त कंपनी के रिकॉर्ड में, ", "ਇੱਕ ਫਾਇਨੈਂਸ ਕੰਪਨੀ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ, "],
    ["In an exam-style interest case, ", "एक परीक्षा-शैली ब्याज प्रश्न में, ", "ਇੱਕ ਪ੍ਰੀਖਿਆ-ਸ਼ੈਲੀ ਬਿਆਜ ਪ੍ਰਸ਼ਨ ਵਿੱਚ, "],
    ["A clerk records that ", "एक क्लर्क लिखता है कि ", "ਇੱਕ ਕਲਰਕ ਲਿਖਦਾ ਹੈ ਕਿ "],
  ];
  const variant = variants[hashText(`${problem.id}:phrase`) % variants.length]!;
  if (!variant[0]) return stem;
  return {
    en: `${variant[0]}${stem.en[0]?.toLowerCase() ?? ""}${stem.en.slice(1)}`,
    hi: `${variant[1]}${stem.hi}`,
    pa: `${variant[2]}${stem.pa}`,
  };
}

function buildRealization(problem: CanonicalInterestProblem): InterestRealization {
  const stem = rotateStem(problem.customStem, problem);
  const finalEn = `Answer = ${answerText(problem, "en")}`;
  const finalHi = `उत्तर = ${answerText(problem, "hi")}`;
  const finalPa = `ਉੱਤਰ = ${answerText(problem, "pa")}`;
  return {
    stem,
    steps: problem.customSteps,
    explanation: {
      en: `${stepLines(problem.customSteps, "en")}\n\n${finalEn}`,
      hi: `${stepLines(problem.customSteps, "hi")}\n\n${finalHi}`,
      pa: `${stepLines(problem.customSteps, "pa")}\n\n${finalPa}`,
    },
  };
}

function buildGraph(problem: CanonicalInterestProblem, realization: InterestRealization) {
  return {
    id: `${problem.id}:graph`,
    topology: problem.topology,
    steps: realization.steps.map((item, index) => ({
      id: item.key,
      order: index + 1,
      label: item.en,
      expression: item.expression,
      value: item.value,
    })),
  };
}

function realismScore(problem: CanonicalInterestProblem) {
  const base = problem.complexity === "advanced" ? 88 : problem.complexity === "hard" ? 84 : problem.complexity === "medium" ? 81 : 76;
  return Math.min(96, base + (problem.traps.length >= 3 ? 3 : 0));
}

function difficultyMetadata(problem: CanonicalInterestProblem) {
  const score = problem.complexity === "advanced" ? 8 : problem.complexity === "hard" ? 7 : problem.complexity === "medium" ? 5 : 3;
  return {
    difficulty: titleDifficulty(problem.difficulty),
    difficultyMetadata: {
      difficultyScore: score,
      difficultyLabel: titleDifficulty(problem.difficulty),
      reasoningDepth: problem.complexity === "advanced" ? 4 : problem.complexity === "hard" ? 3 : problem.complexity === "medium" ? 2 : 1,
      calculationComplexity: score,
      distractorComplexity: problem.traps.length,
      ambiguityScore: 0,
      solvingTimeEstimate: 45 + score * 12,
      cognitiveLoad: score,
      metrics: {},
    },
  };
}

export function isQuantV2InterestPattern(pattern: Pattern) {
  const text = `${pattern.generationDomain ?? ""} ${pattern.topic ?? ""} ${pattern.subtopic ?? ""} ${pattern.id ?? ""} ${pattern.name ?? ""}`.toLowerCase();
  return /quant-v2-interest|simple[-_\s]*interest|compound[-_\s]*interest|\bsi[-_\s]*ci\b|\binterest\b|ब्याज|ਸਧਾਰਣ ਬਿਆਜ|ਚੱਕਰਵ੍ਰਿੱਧੀ ਬਿਆਜ/u.test(text);
}

export function createQuantV2InterestQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const seed = options?.seed ?? options?.generationContext?.seed ?? `${pattern.id}:interest`;
  const difficulty = requestedDifficulty(pattern, options);
  const forced = String(options?.forcedMotifId ?? "");
  const family = INTEREST_FAMILY_IDS.includes(forced as InterestFamilyId)
    ? forced as InterestFamilyId
    : undefined;
  const problem = createInterestProblem({ seed, difficulty, family });
  const realization = buildRealization(problem);
  const graph = buildGraph(problem, realization);
  const values = [problem.answer, ...problem.distractors].slice(0, 4);
  const optionsEn = values.map((value) => optionText(value, problem.answerKind, problem.answerSemantic, "en"));
  const optionsHi = values.map((value) => optionText(value, problem.answerKind, problem.answerSemantic, "hi"));
  const optionsPa = values.map((value) => optionText(value, problem.answerKind, problem.answerSemantic, "pa"));
  const solverValidation = validateInterestIndependentSolver({
    problem,
    explanation: realization.explanation.en,
    options: optionsEn,
    correct: 0,
  });
  if (!solverValidation.valid) {
    throw new Error(`Interest V2 solver validation failed: ${solverValidation.issues.join("; ")}`);
  }
  const semanticMetadata = {
    problem,
    examinerIntent: { primaryIntent: problem.family },
    canonicalScenario: {
      domain: "interest",
      object: problem.context.en,
    },
    corpusFingerprints: {
      topologyFingerprint: `${problem.topology.family}:${problem.topology.variant}`,
      operationFingerprint: graph.steps.map((step) => step.id).join(">"),
      percentageVectorFingerprint: Object.entries(problem.variables)
        .filter(([key]) => /r|rate|percent/u.test(key))
        .map(([, value]) => String(value))
        .join("|"),
      semanticIntentFingerprint: problem.family,
      distractorPatternFingerprint: problem.traps.join("|"),
      compositeFingerprint: `${problem.family}:${Object.values(problem.variables).join(":")}`,
    },
  };
  const nativeRealization = {
    en: { language: "en", stem: realization.stem.en, explanation: realization.explanation.en, lines: realization.explanation.en.split(/\n/u) },
    hi: { language: "hi", stem: realization.stem.hi, explanation: realization.explanation.hi, lines: realization.explanation.hi.split(/\n/u) },
    pa: { language: "pa", stem: realization.stem.pa, explanation: realization.explanation.pa, lines: realization.explanation.pa.split(/\n/u) },
  };
  const realism = realismScore(problem);
  const difficultyPack = difficultyMetadata(problem);
  const examProfile = options?.examProfile ?? "ssc";

  return {
    text: realization.stem.en,
    textHi: realization.stem.hi,
    textPa: realization.stem.pa,
    options: optionsEn,
    optionsHi,
    optionsPa,
    correct: 0,
    explanation: realization.explanation.en,
    explanationHi: realization.explanation.hi,
    explanationPa: realization.explanation.pa,
    nativeRealization,
    nativeCoverage: { en: 1, hi: 1, pa: 1 },
    generationBackend: "quant-v2-interest",
    debugSource: "quant-v2-interest",
    proceduralLogic: { quantV2: { problem, reasoningGraph: graph }, validatorReports: { solverValidation } },
    languages: ["en", "hi", "pa"],
    reasoningGraph: graph,
    semanticMetadata,
    localizationMetadata: { languages: ["en", "hi", "pa"], fallbackCount: 0 },
    pedagogicalMetrics: { explanationStepCount: graph.steps.length, directness: "clean" },
    section: pattern.section,
    topic: "interest",
    subtopic: problem.family,
    optionMetadata: optionsEn.map((value, index) => ({
      value,
      isCorrect: index === 0,
      ...(index === 0 ? {} : {
        distractorType: "interestTrap" as const,
        likelyMistake: problem.traps[index % problem.traps.length] ?? "interest base confusion",
        reasoningTrap: problem.traps[index % problem.traps.length] ?? "interest base confusion",
      }),
    })),
    examRealismMetadata: {
      examProfile: examProfile as ExamProfileId,
      wordingStyle: problem.complexity === "advanced" ? "inference-heavy" : "balanced",
      reasoningTraps: problem.traps,
      weightingSummary: ["Interest V2"],
      realismScore: realism,
      realismBand: realism >= 85 ? "strong" : "moderate",
      realismSignals: ["banking arithmetic", "exam-style interest base"],
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
      generationId: problem.id,
      generationTimestamp: Date.now(),
      generationDomain: "quant-v2-interest",
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
        signature: `${problem.family}|${Object.values(problem.variables).join("|")}`,
        reasoningGraph: graph,
        semanticMetadata,
        validatorReports: { solverValidation },
        solverValidation,
        localized: nativeRealization,
        category: problem.category,
        subtype: problem.subtype,
        scenario: problem.context.en,
        reasoningPattern: "interest",
        corpusFingerprints: semanticMetadata.corpusFingerprints,
      },
      reasoningGraph: graph,
      semanticMetadata,
      localizationMetadata: { languages: ["en", "hi", "pa"] },
      pedagogicalMetrics: { explanationStepCount: graph.steps.length },
      validatorReports: { solverValidation },
      debugSource: "quant-v2-interest",
    },
    ...difficultyPack,
  };
}
