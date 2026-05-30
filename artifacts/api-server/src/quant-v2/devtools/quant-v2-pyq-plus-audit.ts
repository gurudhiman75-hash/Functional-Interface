import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { randomUUID } from "node:crypto";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { createQuantV2ProfitLossQuestionCandidate } from "../../lib/quant-v2/profit-loss-admin-adapter";
import { createQuantV2InterestQuestionCandidate } from "../../lib/quant-v2/interest-admin-adapter";
import { createQuantV2RatioProportionQuestionCandidate } from "../../lib/quant-v2/ratio-proportion-admin-adapter";
import { createQuantV2TimeWorkQuestionCandidate } from "../../lib/quant-v2/time-work-admin-adapter";
import { createQuantV2TimeSpeedDistanceQuestionCandidate } from "../../lib/quant-v2/time-speed-distance-admin-adapter";
import { createQuantV2MixtureAlligationQuestionCandidate } from "../../lib/quant-v2/mixture-alligation-admin-adapter";
import { createQuantV2NumberSystemQuestionCandidate } from "../../lib/quant-v2/number-system-admin-adapter";
import { PROFIT_LOSS_FAMILY_IDS } from "../canonical/profit-loss-motif-factories";
import { INTEREST_FAMILY_IDS } from "../canonical/interest-motif-factories";
import { RATIO_PROPORTION_FAMILY_IDS } from "../canonical/ratio-proportion-motif-factories";
import { TIME_WORK_FAMILY_IDS } from "../canonical/time-work-motif-factories";
import { TIME_SPEED_DISTANCE_FAMILY_IDS } from "../canonical/time-speed-distance-motif-factories";
import { MIXTURE_ALLIGATION_FAMILY_IDS } from "../canonical/mixture-alligation-motif-factories";
import { NUMBER_SYSTEM_FAMILY_IDS } from "../canonical/number-system-motif-factories";
import type { ProfitLossFamilyId } from "../canonical/profit-loss-types";
import type { InterestFamilyId } from "../canonical/interest-types";
import type { RatioProportionFamilyId } from "../canonical/ratio-proportion-types";
import type { TimeWorkFamilyId } from "../canonical/time-work-types";
import type { TimeSpeedDistanceFamilyId } from "../canonical/time-speed-distance-types";
import type { MixtureAlligationFamilyId } from "../canonical/mixture-alligation-types";
import type { NumberSystemFamilyId } from "../canonical/number-system-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import { isDataInterpretationLike, scorePyqBenchmark } from "../pyq-benchmark/pyq-benchmark-scorer";
import type { PyqBenchmarkAuditSummary, PyqBenchmarkTopic } from "../pyq-benchmark/pyq-benchmark-types";
import { validatePercentageIndependentSolver } from "../validators/percentage-independent-solver";
import {
  profitLossDegenerateReasons,
  validateProfitLossIndependentSolver,
} from "../validators/profit-loss-independent-solver";
import {
  interestDegenerateReasons,
  validateInterestIndependentSolver,
} from "../validators/interest-independent-solver";
import {
  ratioProportionDegenerateReasons,
  validateRatioProportionIndependentSolver,
} from "../validators/ratio-proportion-independent-solver";
import {
  timeWorkDegenerateReasons,
  validateTimeWorkIndependentSolver,
} from "../validators/time-work-independent-solver";
import {
  timeSpeedDistanceDegenerateReasons,
  validateTimeSpeedDistanceIndependentSolver,
} from "../validators/time-speed-distance-independent-solver";
import {
  mixtureAlligationDegenerateReasons,
  validateMixtureAlligationIndependentSolver,
} from "../validators/mixture-alligation-independent-solver";
import {
  numberSystemDegenerateReasons,
  validateNumberSystemIndependentSolver,
} from "../validators/number-system-independent-solver";

type SupportedTopic = Exclude<PyqBenchmarkTopic, "data_interpretation">;

type AuditExample = {
  index: number;
  family: string;
  topology: string;
  issue: string;
  pyqLevelScore: number;
  pyqPlusScore: number;
  question: string;
  answer: string;
};

const percentagePattern: Pattern = {
  id: "pyq-plus-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Percentage V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

const profitLossPattern: Pattern = {
  id: "pyq-plus-profit-loss",
  type: "formula",
  section: "Quant",
  topic: "profit_loss_discount",
  subtopic: "profit_loss_discount",
  difficulty: "Medium",
  templateVariants: ["Profit/Loss V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-profit-loss",
};

const interestPattern: Pattern = {
  id: "pyq-plus-interest",
  type: "formula",
  section: "Quant",
  topic: "interest",
  subtopic: "interest",
  difficulty: "Medium",
  templateVariants: ["Interest V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-interest",
};

const ratioProportionPattern: Pattern = {
  id: "pyq-plus-ratio-proportion",
  type: "formula",
  section: "Quant",
  topic: "ratio_proportion",
  subtopic: "ratio_proportion",
  difficulty: "Medium",
  templateVariants: ["Ratio, Proportion & Variation V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-ratio-proportion",
};

const timeWorkPattern: Pattern = {
  id: "pyq-plus-time-work",
  type: "formula",
  section: "Quant",
  topic: "time_work",
  subtopic: "time_work",
  difficulty: "Medium",
  templateVariants: ["Time & Work / Pipes & Cisterns V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-work",
};

const timeSpeedDistancePattern: Pattern = {
  id: "pyq-plus-time-speed-distance",
  type: "formula",
  section: "Quant",
  topic: "time_speed_distance",
  subtopic: "time_speed_distance",
  difficulty: "Medium",
  templateVariants: ["Time, Speed & Distance V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-speed-distance",
};

const mixtureAlligationPattern: Pattern = {
  id: "pyq-plus-mixture-alligation",
  type: "formula",
  section: "Quant",
  topic: "mixture_alligation",
  subtopic: "mixture_alligation",
  difficulty: "Medium",
  templateVariants: ["Mixture & Alligation V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-mixture-alligation",
};

const numberSystemPattern: Pattern = {
  id: "pyq-plus-number-system",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Medium",
  templateVariants: ["Number System V2 PYQ+ benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-number-system",
};

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseCount() {
  const raw = Number(argValue("count") ?? "500");
  if (!Number.isFinite(raw)) return 500;
  return Math.max(1, Math.min(2000, Math.floor(raw)));
}

function parseTopic(): SupportedTopic {
  const raw = String(argValue("topic") ?? "percentage")
    .toLowerCase()
    .replace(/_/gu, "-");
  if (["profit-loss", "profit-loss-discount", "profit-loss-and-discount"].includes(raw)) {
    return "profit-loss";
  }
  if (["interest", "simple-interest", "compound-interest", "si-ci", "si-and-ci"].includes(raw)) {
    return "interest";
  }
  if (["ratio-proportion", "ratio", "ratios", "proportion", "variation", "ratio-and-proportion"].includes(raw)) {
    return "ratio-proportion";
  }
  if (["time-work", "time-and-work", "time-work-pipes", "pipes", "pipes-cisterns", "pipes-and-cisterns", "work-wages"].includes(raw)) {
    return "time-work";
  }
  if (["time-speed-distance", "time-speed-and-distance", "speed-distance", "speed-time-distance", "trains", "boats", "races"].includes(raw)) {
    return "time-speed-distance";
  }
  if (["mixture-alligation", "mixture", "alligation", "mixture-and-alligation", "milk-water", "dilution", "concentration"].includes(raw)) {
    return "mixture-alligation";
  }
  if (["number-system", "number", "numbers", "divisibility", "hcf-lcm", "remainder", "remainders", "factorial", "last-digit"].includes(raw)) {
    return "number-system";
  }
  return "percentage";
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[₹,]/gu, "")
    .replace(/[^\p{L}\p{N}.%]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function duplicateFingerprint(question: FormulaQuestion) {
  return [
    normalizeText(question.text),
    normalizeText(answerText(question)),
    [...(question.options ?? [])].map(normalizeText).sort().join("|"),
  ].join("::");
}

function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}

function topologyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).topologyKey;
}

function macroFamily(family: string) {
  if (/relation|reverse_relation|relational/u.test(family)) return "relation_macro";
  if (/(?:^|_)mp(?:_|$)|discount|marked|markup/u.test(family)) return "discount_macro";
  if (/cp_sp|cp_percent|sp_percent/u.test(family)) return "basic_cp_sp_macro";
  if (/equal_sp|two_article|dual|successive/u.test(family)) return "multi_article_macro";
  return family;
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ??
    (question.semanticMetadata as any)?.problem;
}

function graphOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.reasoningGraph ??
    question.reasoningGraph;
}

function localizedOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.localized ??
    question.nativeRealization;
}

function increment(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function toRecord(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function addWorst(
  worst: AuditExample[],
  question: FormulaQuestion,
  index: number,
  issue: string,
  pyqLevelScore = 0,
  pyqPlusScore = 0,
) {
  worst.push({
    index,
    family: familyOf(question),
    topology: topologyOf(question),
    issue,
    pyqLevelScore,
    pyqPlusScore,
    question: question.text,
    answer: answerText(question),
  });
}

function localOptionIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  if (!options.includes(answerText(question))) return "answer missing from options";
  if (new Set(options).size !== options.length) return "duplicate options";
  return undefined;
}

function configuredFamilyCap(topic: SupportedTopic, family: string, count: number) {
  if (count >= 500) {
    if (topic === "profit-loss") {
      if (["pl_cp_sp_percent", "pl_cp_percent_to_sp", "pl_sp_percent_to_cp"].includes(family)) return 40;
      if (["pl_equal_sp_profit_loss", "pl_two_article_overall", "pl_successive_discounts"].includes(family)) return 40;
      if (/dishonest|promotion|cashback|gst|tax|commission|overhead|inverse/u.test(family)) return 35;
      return 45;
    }
    if (topic === "interest") {
      return 35;
    }
    if (topic === "ratio-proportion") {
      return 35;
    }
    if (topic === "time-work") {
      return 12;
    }
  if (topic === "time-speed-distance") {
    return 18;
  }
    if (topic === "mixture-alligation") {
      return 18;
    }
    if (topic === "number-system") {
      return count >= 1000 ? 40 : 24;
    }
    const caps: Record<string, number> = {
      two_step_relation_chain: 45,
      multi_step_relation_chain: 35,
      pass_fail: 40,
      population_growth: 40,
      election_margin: 35,
      perc_budget_cascading_remainder: 8,
    };
    return caps[family] ?? 45;
  }
  if (topic === "profit-loss") {
    if (/dishonest|promotion|cashback|gst|tax|commission|overhead|inverse/u.test(family)) return 2;
    if (/cp_sp|discount|equal_sp|two_article|successive/u.test(family)) return 3;
    return 4;
  }
  if (topic === "interest") {
    return 3;
  }
  if (topic === "ratio-proportion") {
    return 3;
  }
  if (topic === "time-work") {
    return 2;
  }
  if (topic === "time-speed-distance") {
    return 3;
  }
  if (topic === "mixture-alligation") {
    return 3;
  }
  if (topic === "number-system") {
    return 4;
  }
  if (/election|vote/u.test(family)) return Math.ceil((count * 5) / 60);
  if (/relation/u.test(family)) return Math.ceil((count * 5) / 60);
  if (family === "pass_fail" || family === "population_growth") return Math.ceil((count * 4) / 60);
  return Math.max(1, Math.ceil((count * 4) / 60));
}

function forcedProfitLossFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): ProfitLossFamilyId {
  for (let offset = 0; offset < PROFIT_LOSS_FAMILY_IDS.length; offset += 1) {
    const family =
      PROFIT_LOSS_FAMILY_IDS[(slot + attempt + offset) % PROFIT_LOSS_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("profit-loss", family, count)) {
      return family;
    }
  }
  return PROFIT_LOSS_FAMILY_IDS[(slot + attempt) % PROFIT_LOSS_FAMILY_IDS.length]!;
}

function forcedInterestFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): InterestFamilyId {
  for (let offset = 0; offset < INTEREST_FAMILY_IDS.length; offset += 1) {
    const family =
      INTEREST_FAMILY_IDS[(slot + attempt + offset) % INTEREST_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("interest", family, count)) {
      return family;
    }
  }
  return INTEREST_FAMILY_IDS[(slot + attempt) % INTEREST_FAMILY_IDS.length]!;
}

function forcedRatioProportionFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): RatioProportionFamilyId {
  for (let offset = 0; offset < RATIO_PROPORTION_FAMILY_IDS.length; offset += 1) {
    const family =
      RATIO_PROPORTION_FAMILY_IDS[(slot + attempt + offset) % RATIO_PROPORTION_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("ratio-proportion", family, count)) {
      return family;
    }
  }
  return RATIO_PROPORTION_FAMILY_IDS[(slot + attempt) % RATIO_PROPORTION_FAMILY_IDS.length]!;
}

function forcedTimeWorkFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): TimeWorkFamilyId {
  for (let offset = 0; offset < TIME_WORK_FAMILY_IDS.length; offset += 1) {
    const family =
      TIME_WORK_FAMILY_IDS[(slot + attempt + offset) % TIME_WORK_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("time-work", family, count)) {
      return family;
    }
  }
  return TIME_WORK_FAMILY_IDS[(slot + attempt) % TIME_WORK_FAMILY_IDS.length]!;
}

function forcedTimeSpeedDistanceFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): TimeSpeedDistanceFamilyId {
  for (let offset = 0; offset < TIME_SPEED_DISTANCE_FAMILY_IDS.length; offset += 1) {
    const family =
      TIME_SPEED_DISTANCE_FAMILY_IDS[(slot + attempt + offset) % TIME_SPEED_DISTANCE_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("time-speed-distance", family, count)) {
      return family;
    }
  }
  return TIME_SPEED_DISTANCE_FAMILY_IDS[(slot + attempt) % TIME_SPEED_DISTANCE_FAMILY_IDS.length]!;
}

function forcedMixtureAlligationFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): MixtureAlligationFamilyId {
  for (let offset = 0; offset < MIXTURE_ALLIGATION_FAMILY_IDS.length; offset += 1) {
    const family =
      MIXTURE_ALLIGATION_FAMILY_IDS[(slot + attempt + offset) % MIXTURE_ALLIGATION_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("mixture-alligation", family, count)) {
      return family;
    }
  }
  return MIXTURE_ALLIGATION_FAMILY_IDS[(slot + attempt) % MIXTURE_ALLIGATION_FAMILY_IDS.length]!;
}

function forcedNumberSystemFamily(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): NumberSystemFamilyId {
  for (let offset = 0; offset < NUMBER_SYSTEM_FAMILY_IDS.length; offset += 1) {
    const family =
      NUMBER_SYSTEM_FAMILY_IDS[(slot + attempt + offset) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap("number-system", family, count)) {
      return family;
    }
  }
  return NUMBER_SYSTEM_FAMILY_IDS[(slot + attempt) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
}

function validateQuestion(topic: SupportedTopic, question: FormulaQuestion) {
  const problem = problemOf(question);
  if (topic === "percentage") {
    const solver = validatePercentageIndependentSolver({
      problem,
      graph: graphOf(question),
      localized: localizedOf(question),
    });
    return solver.issues;
  }
  if (topic === "interest") {
    const solver = validateInterestIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    return [
      ...solver.issues,
      ...interestDegenerateReasons(problem),
    ];
  }
  if (topic === "ratio-proportion") {
    const solver = validateRatioProportionIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    return [
      ...solver.issues,
      ...ratioProportionDegenerateReasons(problem),
    ];
  }
  if (topic === "time-work") {
    const solver = validateTimeWorkIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    return [
      ...solver.issues,
      ...timeWorkDegenerateReasons(problem),
    ];
  }
  if (topic === "time-speed-distance") {
    const solver = validateTimeSpeedDistanceIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    return [
      ...solver.issues,
      ...timeSpeedDistanceDegenerateReasons(problem),
    ];
  }
  if (topic === "mixture-alligation") {
    const solver = validateMixtureAlligationIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    return [
      ...solver.issues,
      ...mixtureAlligationDegenerateReasons(problem),
    ];
  }
  if (topic === "number-system") {
    const solver = validateNumberSystemIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    return [
      ...solver.issues,
      ...numberSystemDegenerateReasons(problem),
    ];
  }
  const solver = validateProfitLossIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [
    ...solver.issues,
    ...profitLossDegenerateReasons(problem),
  ];
}

function generateQuestions(topic: SupportedTopic, count: number, seed: string, profileId: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: topic === "interest"
      ? "interest_pyq"
      : topic === "ratio-proportion"
        ? "ratio_pyq_plus"
          : topic === "time-work"
            ? "time_work_pyq_plus"
          : topic === "time-speed-distance"
            ? "tsd_pyq_plus"
          : topic === "mixture-alligation"
            ? "mix_pyq_plus"
          : topic === "number-system"
            ? "number_system_pyq_plus"
          : profileId,
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const generationStats = {
    totalAttempts: 0,
    skippedCandidates: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const reject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] =
      (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };
  const maxAttempts = topic === "number-system"
    ? Math.max(count * 80, count + 5000)
    : Math.max(count * 22, count + 1200);

  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    try {
      const forcedMotifId = topic === "profit-loss"
        ? forcedProfitLossFamily(questions.length, attempt, count, keptFamilyCounts)
        : topic === "interest"
          ? forcedInterestFamily(questions.length, attempt, count, keptFamilyCounts)
          : topic === "ratio-proportion"
            ? forcedRatioProportionFamily(questions.length, attempt, count, keptFamilyCounts)
            : topic === "time-work"
              ? forcedTimeWorkFamily(questions.length, attempt, count, keptFamilyCounts)
              : topic === "time-speed-distance"
                ? forcedTimeSpeedDistanceFamily(questions.length, attempt, count, keptFamilyCounts)
              : topic === "mixture-alligation"
                ? forcedMixtureAlligationFamily(questions.length, attempt, count, keptFamilyCounts)
              : topic === "number-system"
                ? forcedNumberSystemFamily(questions.length, attempt, count, keptFamilyCounts)
        : undefined;
      const result = generateScheduledQuestion({
        state,
        index: questions.length,
        seedPrefix: `${seed}:pyq-plus:${attempt}`,
        examProfile: "ssc",
        forcedMotifId,
        generate: (options) =>
          topic === "percentage"
            ? createQuantV2PercentageQuestionCandidate(percentagePattern, options)
            : topic === "interest"
              ? createQuantV2InterestQuestionCandidate(interestPattern, options)
              : topic === "ratio-proportion"
                ? createQuantV2RatioProportionQuestionCandidate(ratioProportionPattern, options)
                : topic === "time-work"
                  ? createQuantV2TimeWorkQuestionCandidate(timeWorkPattern, options)
                  : topic === "time-speed-distance"
                    ? createQuantV2TimeSpeedDistanceQuestionCandidate(timeSpeedDistancePattern, options)
                  : topic === "mixture-alligation"
                    ? createQuantV2MixtureAlligationQuestionCandidate(mixtureAlligationPattern, options)
                  : topic === "number-system"
                    ? createQuantV2NumberSystemQuestionCandidate(numberSystemPattern, options)
              : createQuantV2ProfitLossQuestionCandidate(profitLossPattern, options),
      });
      const question = result.question;
      if (topic === "percentage" && isDataInterpretationLike(question)) {
        reject("DI-like item excluded from Percentage PYQ+");
        continue;
      }
      const family = familyOf(question);
      if ((keptFamilyCounts.get(family) ?? 0) >= configuredFamilyCap(topic, family, count)) {
        reject(`family cap reached: ${family}`);
        continue;
      }
      const fingerprint = duplicateFingerprint(question);
      if (keptFingerprints.has(fingerprint)) {
        reject("duplicate fingerprint");
        continue;
      }
      const optionIssue = localOptionIssue(question);
      if (optionIssue) {
        reject(optionIssue);
        continue;
      }
      const validationIssues = validateQuestion(topic, question);
      if (validationIssues.length) {
        reject(`validation: ${validationIssues[0]}`);
        continue;
      }
      const benchmark = scorePyqBenchmark({
        topic,
        question,
        family,
        topology: topologyOf(question),
        problem: problemOf(question),
        graph: graphOf(question),
        schedulerMetadata: extractCorpusSchedulerMetadata(question),
      });
      if (benchmark.realism < 70) {
        reject(`benchmark realism below PYQ+ gate: ${benchmark.realism}`);
        continue;
      }
      if (benchmark.pyqLevelScore < 80 || benchmark.pyqPlusScore < 70) {
        reject(`benchmark score below PYQ+ gate: ${benchmark.pyqLevelScore}/${benchmark.pyqPlusScore}`);
        continue;
      }
      keptFingerprints.add(fingerprint);
      increment(keptFamilyCounts, family);
      questions.push(question);
    } catch (error) {
      reject(error instanceof Error ? `generation throw: ${error.message}` : "generation throw");
    }
  }

  if (questions.length < count) {
    throw new Error(
      `PYQ+ ${topic} generated ${questions.length}/${count} clean questions. ${JSON.stringify(generationStats)}`,
    );
  }
  return {
    questions,
    schedulerSummary: summarizeCorpusScheduler(state),
    generationStats,
  };
}

function previewReports(topic: SupportedTopic, profileId: string, seed: string) {
  return Array.from({ length: 5 }, (_, index) => {
    const { questions } = generateQuestions(topic, 60, `${seed}:preview:${index}`, profileId);
    const ordered = interleaveScheduledPreviewQuestions(questions, `${seed}:preview:${index}`, familyOf);
    const families = ordered.slice(0, 6).map(familyOf);
    const first3 = families.slice(0, 3).map(macroFamily);
    return {
      seed: `${seed}:preview:${index}`,
      families,
      distinctFirst6: new Set(families).size,
      first3MacroDistinct: new Set(first3).size,
      pass: new Set(families).size >= 4 && new Set(first3).size > 1,
    };
  });
}

async function main() {
  const topic = parseTopic();
  const count = parseCount();
  const profileId = argValue("profile") ?? "pyq_balanced";
  const explicitSeed = argValue("seed");
  const runId = randomUUID();
  const seed = explicitSeed ??
    (topic === "time-work"
      ? `quant-v2-pyq-plus:${topic}:${count}:${runId}`
      : `quant-v2-pyq-plus:${topic}:${count}`);
  const { questions, generationStats } = generateQuestions(topic, count, seed, profileId);
  const ordered = interleaveScheduledPreviewQuestions(questions, seed, familyOf);

  const familyDistribution = new Map<string, number>();
  const topologyDistribution = new Map<string, number>();
  const difficultyDistribution = new Map<string, number>();
  const reasoningStepDistribution = new Map<string, number>();
  const trapDistribution = new Map<string, number>();
  const duplicateSeen = new Set<string>();
  const worst: AuditExample[] = [];
  const counters = {
    solverMismatch: 0,
    explanationMismatch: 0,
    duplicateFingerprint: 0,
    optionQualityIssues: 0,
    hiPaLeakage: 0,
    lowRealism: 0,
    familyCapViolations: 0,
    diExcluded: 0,
    weakTrapDistractors: 0,
    repeatedPatternExamples: 0,
  };
  let realismTotal = 0;
  let pyqLevelTotal = 0;
  let pyqPlusTotal = 0;
  let mediumOrAbove = 0;
  let hardOrAdvanced = 0;
  let meaningfulTraps = 0;

  ordered.forEach((question, index) => {
    const metadata = extractCorpusSchedulerMetadata(question);
    const family = familyOf(question);
    const topology = topologyOf(question);
    const benchmark = scorePyqBenchmark({
      topic,
      question,
      family,
      topology,
      problem: problemOf(question),
      graph: graphOf(question),
      schedulerMetadata: metadata,
    });
    increment(familyDistribution, family);
    increment(topologyDistribution, topology);
    increment(difficultyDistribution, benchmark.difficulty);
    increment(reasoningStepDistribution, `${benchmark.requiredReasoningSteps}`);
    for (const trap of benchmark.trapTypes) increment(trapDistribution, trap);
    realismTotal += benchmark.realism;
    pyqLevelTotal += benchmark.pyqLevelScore;
    pyqPlusTotal += benchmark.pyqPlusScore;
    if (["medium", "hard", "advanced"].includes(benchmark.difficulty)) mediumOrAbove += 1;
    if (["hard", "advanced"].includes(benchmark.difficulty)) hardOrAdvanced += 1;
    if (benchmark.trapTypes.length > 0) meaningfulTraps += 1;

    const validationIssues = validateQuestion(topic, question);
    for (const issue of validationIssues) {
      if (/explanation final value mismatch/u.test(issue)) counters.explanationMismatch += 1;
      else counters.solverMismatch += 1;
      addWorst(worst, question, index, issue, benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
    const fingerprint = duplicateFingerprint(question);
    if (duplicateSeen.has(fingerprint)) {
      counters.duplicateFingerprint += 1;
      addWorst(worst, question, index, "duplicate fingerprint", benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
    duplicateSeen.add(fingerprint);
    const optionIssue = localOptionIssue(question);
    if (optionIssue || benchmark.optionQualityScore < 80) {
      counters.optionQualityIssues += 1;
      addWorst(worst, question, index, optionIssue ?? "weak option quality", benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
    if (benchmark.languageQualityScore < 90) {
      counters.hiPaLeakage += 1;
      addWorst(worst, question, index, benchmark.notes.join("; ") || "language quality issue", benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
    if (benchmark.realism < 70) {
      counters.lowRealism += 1;
      addWorst(worst, question, index, "low realism", benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
    if (benchmark.trapTypes.length === 0) {
      counters.weakTrapDistractors += 1;
      addWorst(worst, question, index, "no meaningful trap-based distractor signal", benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
    if (benchmark.pyqLevelScore < 72 || benchmark.pyqPlusScore < 62) {
      addWorst(worst, question, index, "low PYQ/PYQ+ score", benchmark.pyqLevelScore, benchmark.pyqPlusScore);
    }
  });

  for (const [family, actual] of familyDistribution) {
    const cap = configuredFamilyCap(topic, family, count);
    if (actual > cap) {
      counters.familyCapViolations += 1;
      worst.push({
        index: -1,
        family,
        topology: family,
        issue: `family cap exceeded ${actual}/${cap}`,
        pyqLevelScore: 0,
        pyqPlusScore: 0,
        question: "(distribution)",
        answer: "",
      });
    }
  }

  const firstWindowReports = previewReports(topic, profileId, seed);
  const total = ordered.length;
  const averageRealism = Number((realismTotal / total).toFixed(2));
  const averagePyqLevelScore = Number((pyqLevelTotal / total).toFixed(2));
  const averagePyqPlusScore = Number((pyqPlusTotal / total).toFixed(2));
  const acceptance = {
    solverMismatch: counters.solverMismatch === 0,
    explanationMismatch: counters.explanationMismatch === 0,
    duplicateFingerprint: counters.duplicateFingerprint === 0,
    optionQualityIssues: counters.optionQualityIssues === 0,
    hiPaLeakage: counters.hiPaLeakage === 0,
    lowRealism: counters.lowRealism < Math.floor(total * 0.05),
    averageRealism: averageRealism >= 80,
    averagePyqLevelScore: averagePyqLevelScore >= 80,
    averagePyqPlusScore: averagePyqPlusScore >= 70,
    mediumOrAbove: mediumOrAbove / total >= 0.6,
    hardOrAdvanced: hardOrAdvanced / total >= 0.25,
    meaningfulTrapDistractors: meaningfulTraps / total >= 0.7,
    familyCapViolations: counters.familyCapViolations === 0,
    previewDiversity: firstWindowReports.every((report) => report.pass),
  };
  const status = Object.values(acceptance).every(Boolean) ? "PASS" : "FAIL";
  const sortedWorst = worst
    .sort((a, b) => (a.pyqPlusScore - b.pyqPlusScore) || (a.pyqLevelScore - b.pyqLevelScore))
    .slice(0, 20);

  const report: PyqBenchmarkAuditSummary & {
    profileId: string;
    seed: string;
    runId: string;
    explicitSeed: boolean;
    generationStats: typeof generationStats;
    acceptance: typeof acceptance;
    firstWindowReports: ReturnType<typeof previewReports>;
    ratios: Record<string, number>;
  } = {
    topic,
    totalGenerated: total,
    status,
    profileId,
    seed,
    runId,
    explicitSeed: Boolean(explicitSeed),
    averageRealism,
    averagePyqLevelScore,
    averagePyqPlusScore,
    difficultyDistribution: toRecord(difficultyDistribution),
    reasoningStepDistribution: toRecord(reasoningStepDistribution),
    trapDistribution: toRecord(trapDistribution),
    familyDistribution: toRecord(familyDistribution),
    topologyDistribution: toRecord(topologyDistribution),
    counters,
    acceptance,
    generationStats,
    firstWindowReports,
    ratios: {
      mediumOrAbove: Number((mediumOrAbove / total).toFixed(3)),
      hardOrAdvanced: Number((hardOrAdvanced / total).toFixed(3)),
      meaningfulTrapDistractors: Number((meaningfulTraps / total).toFixed(3)),
    },
    worstExamples: sortedWorst,
  };

  console.log(JSON.stringify(report, null, 2));
  if (status !== "PASS") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
