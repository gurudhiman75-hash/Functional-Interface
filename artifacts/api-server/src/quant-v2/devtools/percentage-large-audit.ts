import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import { validatePercentageIndependentSolver } from "../validators/percentage-independent-solver";

const percentagePattern: Pattern = {
  id: "percentage-large-audit",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Percentage V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

type AuditExample = {
  index: number;
  family: string;
  topology: string;
  realism: number;
  issue: string;
  question: string;
  answer: string;
  details?: Record<string, unknown>;
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

function numericAnswer(question: FormulaQuestion) {
  const match = answerText(question).match(/-?\d+(?:\.\d+)?/u);
  return match ? Number(match[0]) : undefined;
}

function optionNumbers(question: FormulaQuestion) {
  return (question.options ?? [])
    .map((option) => String(option).match(/-?\d+(?:\.\d+)?/u)?.[0])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .filter(Number.isFinite);
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
  return /relation|reverse_relation|relational_chain|inverse_percentage/u.test(family)
    ? "relation_macro"
    : family;
}

function realismOf(question: FormulaQuestion) {
  return Number(
    question.examRealismMetadata?.realismScore ??
      (question.qualityMetrics as any)?.metrics?.editorialRealismScore ??
      (question.debugMetadata?.quantV2 as any)?.qualityMetrics?.metrics?.editorialRealismScore ??
      0,
  );
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ??
    (question.semanticMetadata as any)?.problem;
}

function localizedOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.localized ??
    question.nativeRealization;
}

function graphOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.reasoningGraph ??
    question.reasoningGraph;
}

function visualOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.visual ??
    (question.debugMetadata?.quantV2 as any)?.semanticMetadata?.visual ??
    (question as any).visual ??
    (question.semanticMetadata as any)?.visual;
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function addExample(
  examples: AuditExample[],
  question: FormulaQuestion,
  index: number,
  issue: string,
  details?: Record<string, unknown>,
) {
  if (examples.length >= 80) return;
  examples.push({
    index,
    family: familyOf(question),
    topology: topologyOf(question),
    realism: realismOf(question),
    issue,
    question: question.text,
    answer: answerText(question),
    details,
  });
}

function hasEnglishLeak(text: string | undefined) {
  return /\b(?:Let original|Old quantity|New quantity|Quantity reduction|Find the|The price|candidate|marks|total|required|price per kg|expenditure|newPriceIndex)\b/iu.test(
    String(text ?? ""),
  );
}

function hasGenericLabel(text: string | undefined) {
  return /कुल मान|अंतिम मान|आवश्यक अंतर|ਕੁੱਲ ਮਾਤਰਾ|ਅੰਤਿਮ ਮੁੱਲ|ਲੋੜੀਂਦਾ ਅੰਤਰ/u.test(
    String(text ?? ""),
  );
}

function stemOpening(question: FormulaQuestion) {
  return normalizeText(question.text).split(/\s+/u).slice(0, 8).join(" ");
}

function fullOpeningSentence(question: FormulaQuestion) {
  return normalizeText(String(question.text ?? "").split(/[.?!]/u)[0] ?? "");
}

function explanationIntroLine(question: FormulaQuestion) {
  const line = String(question.explanation ?? "")
    .split(/\r?\n/u)
    .map((item) => item.trim())
    .find((item) => item.length > 0 && !/^[\d\s./()+\-xX=%]+$/u.test(item));
  return normalizeText(line);
}

function hasAbsurdOptionScale(question: FormulaQuestion) {
  const answer = numericAnswer(question);
  if (!Number.isFinite(answer) || answer === 0) return false;
  const isPercentAnswer = /%/u.test(answerText(question));
  return optionNumbers(question).some((option) => {
    if (option === answer) return false;
    if (answer > 0 && option <= 0) return true;
    if (isPercentAnswer) return Math.abs(option) > 500;
    return option < Math.abs(answer) * 0.03 || option > Math.abs(answer) * 30;
  });
}

function commissionDegenerateDetails(question: FormulaQuestion) {
  if (familyOf(question) !== "commission") return undefined;
  const problem = problemOf(question);
  const v = problem?.variables ?? {};
  const baseQuota = Number(v.baseSales ?? 0);
  const baseCommission = Number(v.baseCommission ?? (baseQuota * (v.baseCommissionRate ?? 0) / 100));
  const totalCommission = Number(v.totalCommission ?? 0);
  const totalSales = Number(v.totalSales ?? problem?.answer ?? 0);
  const excessSales = Number(v.excessSales ?? ((totalCommission - baseCommission) * 100 / ((v.baseCommissionRate ?? 0) + (v.bonusRate ?? 0))));
  if (
    totalCommission <= baseCommission ||
    excessSales <= 0 ||
    totalSales <= baseQuota ||
    Math.abs((problem?.answer ?? 0) - baseQuota) <= 0.01
  ) {
    return { baseQuota, baseCommission, totalCommission, excessSales, totalSales };
  }
  return undefined;
}

function vennVisualIssue(question: FormulaQuestion) {
  if (familyOf(question) !== "venn_diagram" && problemOf(question)?.subtype !== "venn_diagram") {
    return undefined;
  }

  const problem = problemOf(question);
  const variables = problem?.variables ?? {};
  const visual = visualOf(question);
  if (!visual || visual.type !== "venn") {
    return { reason: "missing venn visual payload" };
  }

  const subjectA = Number(variables.subjectA);
  const subjectB = Number(variables.subjectB);
  const both = Number(variables.bothPct);
  const neither = Number(variables.nonePct);
  const onlyA = subjectA - both;
  const onlyB = subjectB - both;
  const union = subjectA + subjectB - both;
  const regions = visual.regions ?? {};
  const close = (left: number, right: number) =>
    Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) < 0.01;

  if (
    visual.universe !== 100 ||
    !close(Number(visual.sets?.[0]?.value), subjectA) ||
    !close(Number(visual.sets?.[1]?.value), subjectB) ||
    !close(Number(visual.intersection), both) ||
    !close(Number(visual.outside), neither) ||
    !close(Number(regions.onlyA), onlyA) ||
    !close(Number(regions.onlyB), onlyB) ||
    !close(Number(regions.both), both) ||
    !close(Number(regions.neither), neither)
  ) {
    return { reason: "visual values do not match canonical variables", visual, variables };
  }

  if ([onlyA, onlyB, both, neither].some((value) => value < 0)) {
    return { reason: "negative venn region", onlyA, onlyB, both, neither };
  }

  if (!close(onlyA + onlyB + both + neither, 100)) {
    return { reason: "regions do not sum to universe", onlyA, onlyB, both, neither };
  }

  if (!close(union, subjectA + subjectB - both)) {
    return { reason: "union formula mismatch", union, subjectA, subjectB, both };
  }

  const visualDerivedAnswer = Number(variables.neitherValue) * 100 / neither;
  if (!close(visualDerivedAnswer, Number(problem?.answer))) {
    return {
      reason: "visual-derived answer mismatch",
      visualDerivedAnswer,
      answer: problem?.answer,
    };
  }

  return undefined;
}

function generateQuestions(count: number, seed: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "balanced_mock",
  });
  const questions: FormulaQuestion[] = [];
  const keptFamilyCounts = new Map<string, number>();
  const keptFingerprints = new Set<string>();
  const keptOpeningCounts = new Map<string, number>();
  const keptFullOpeningCounts = new Map<string, number>();
  const generationStats = {
    replacementAttempts: 0,
    skippedCandidates: 0,
    failedSlots: 0,
    totalAttempts: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const maxAttempts = Math.max(count * 16, count + 1000);
  const localReject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] = (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };

  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    try {
      const result = generateScheduledQuestion({
        state,
        index: questions.length,
        seedPrefix: `${seed}:large:${attempt}`,
        examProfile: "ssc",
        generate: (options) =>
          createQuantV2PercentageQuestionCandidate(percentagePattern, options),
      });
      const question = result.question;
      const family = familyOf(question);
      const familyCap = configuredFamilyCap(family, count);
      if ((keptFamilyCounts.get(family) ?? 0) >= familyCap) {
        localReject(`family cap reached: ${family}`);
        continue;
      }
      const fingerprint = duplicateFingerprint(question);
      if (keptFingerprints.has(fingerprint)) {
        localReject("duplicate fingerprint");
        continue;
      }
      if (commissionDegenerateDetails(question)) {
        localReject("degenerate commission");
        continue;
      }
      if (count >= 500 && (keptOpeningCounts.get(stemOpening(question)) ?? 0) >= 15) {
        localReject("first opening repeat limit");
        continue;
      }
      if (count >= 500 && (keptFullOpeningCounts.get(fullOpeningSentence(question)) ?? 0) >= 5) {
        localReject("full opening repeat limit");
        continue;
      }
      const lowRealismLimit = count >= 500 ? 0 : Math.max(0, Math.floor(count * 0.05) - 1);
      if (realismOf(question) < 70 && questions.filter((item) => realismOf(item) < 70).length >= lowRealismLimit) {
        localReject("low realism limit");
        continue;
      }
      keptFingerprints.add(fingerprint);
      increment(keptFamilyCounts, family);
      increment(keptOpeningCounts, stemOpening(question));
      increment(keptFullOpeningCounts, fullOpeningSentence(question));
      questions.push(question);
    } catch {
      generationStats.skippedCandidates += 1;
      generationStats.localRejectReasons["scheduler throw"] =
        (generationStats.localRejectReasons["scheduler throw"] ?? 0) + 1;
    }
  }

  generationStats.replacementAttempts = Math.max(0, generationStats.totalAttempts - questions.length);
  generationStats.failedSlots = Math.max(0, count - questions.length);
  if (questions.length < count) {
    throw new Error(`Percentage large audit generated ${questions.length}/${count} clean questions.`);
  }
  return {
    questions,
    schedulerSummary: summarizeCorpusScheduler(state),
    generationStats,
  };
}

function auditFirstWindow(seed: string) {
  const { questions } = generateQuestions(60, seed);
  const ordered = interleaveScheduledPreviewQuestions(questions, seed, familyOf);
  const families = ordered.slice(0, 6).map(familyOf);
  const first3Macros = families.slice(0, 3).map(macroFamily);
  return {
    seed,
    families,
    distinctFirst6: new Set(families).size,
    first3MacroDistinct: new Set(first3Macros).size,
    pass: new Set(families).size >= 4 && new Set(first3Macros).size > 1,
  };
}

function configuredFamilyCap(family: string, count: number) {
  if (count >= 500) {
    const largeCaps: Record<string, number> = {
      two_step_relation_chain: 45,
      multi_step_relation_chain: 35,
      pass_fail: 40,
      population_growth: 40,
      election_margin: 35,
      perc_budget_cascading_remainder: 8,
    };
    return largeCaps[family] ?? 45;
  }
  if (/election|vote/u.test(family)) return Math.ceil(count * 5 / 60);
  if (/relation/u.test(family)) return Math.ceil(count * 5 / 60);
  if (family === "commission") return Math.ceil(count * 4 / 60);
  if (family === "venn_diagram") return Math.ceil(count * 3 / 60);
  if (family === "pass_fail" || family === "population_growth") return Math.ceil(count * 4 / 60);
  return Math.max(1, Math.ceil(count * 4 / 60));
}

async function main() {
  const count = parseCount();
  const seed = argValue("seed") ?? `percentage-large-audit-${count}`;
  const { questions, schedulerSummary, generationStats } = generateQuestions(count, seed);
  const orderedQuestions = interleaveScheduledPreviewQuestions(questions, seed, familyOf);

  const familyCounts = new Map<string, number>();
  const topologyCounts = new Map<string, number>();
  const openingCounts = new Map<string, number>();
  const fullOpeningCounts = new Map<string, number>();
  const explanationIntroCounts = new Map<string, number>();
  const familyPhraseVariants = new Map<string, Set<string>>();
  const duplicateSeen = new Map<string, number>();
  const duplicateFamilyCounts = new Map<string, number>();
  const examples: AuditExample[] = [];
  const duplicateExamples: AuditExample[] = [];
  const degenerateCommissionExamples: AuditExample[] = [];
  const lowRealismExamples: AuditExample[] = [];
  const counters = {
    solverMismatch: 0,
    explanationMismatch: 0,
    duplicates: 0,
    undefinedLike: 0,
    englishLeakage: 0,
    genericLabels: 0,
    degenerateCommission: 0,
    trivialWeighted: 0,
    trivialCrossTab: 0,
    priceAbsoluteExplanation: 0,
    lowRealism: 0,
    optionQuality: 0,
    familyCap: 0,
    vennVisual: 0,
  };
  let realismTotal = 0;

  orderedQuestions.forEach((question, index) => {
    const family = familyOf(question);
    const topology = topologyOf(question);
    const problem = problemOf(question);
    const localized = localizedOf(question);
    const graph = graphOf(question);
    const realism = realismOf(question);
    realismTotal += realism;
    increment(familyCounts, family);
    increment(topologyCounts, topology);
    increment(openingCounts, stemOpening(question));
    increment(fullOpeningCounts, fullOpeningSentence(question));
    increment(explanationIntroCounts, explanationIntroLine(question));
    const phraseVariants = familyPhraseVariants.get(family) ?? new Set<string>();
    phraseVariants.add(fullOpeningSentence(question));
    familyPhraseVariants.set(family, phraseVariants);

    const solver = validatePercentageIndependentSolver({
      problem,
      graph,
      localized,
    });
    for (const issue of solver.issues) {
      if (/explanation final value mismatch/iu.test(issue)) {
        counters.explanationMismatch += 1;
      } else {
        counters.solverMismatch += 1;
      }
      addExample(examples, question, index, issue);
    }

    const fingerprint = duplicateFingerprint(question);
    if (duplicateSeen.has(fingerprint)) {
      counters.duplicates += 1;
      increment(duplicateFamilyCounts, family);
      addExample(examples, question, index, `duplicate of #${duplicateSeen.get(fingerprint)}`);
      addExample(duplicateExamples, question, index, `duplicate of #${duplicateSeen.get(fingerprint)}`);
    } else {
      duplicateSeen.set(fingerprint, index);
    }

    const allText = [
      question.text,
      question.textHi,
      question.textPa,
      ...(question.options ?? []),
      question.explanation,
      question.explanationHi,
      question.explanationPa,
    ].join("\n");
    if (/\b(?:undefined|null|NaN)\b/u.test(allText)) {
      counters.undefinedLike += 1;
      addExample(examples, question, index, "undefined/null/NaN text");
    }
    if (hasEnglishLeak(question.textHi) || hasEnglishLeak(question.textPa) || hasEnglishLeak(question.explanationHi) || hasEnglishLeak(question.explanationPa)) {
      counters.englishLeakage += 1;
      addExample(examples, question, index, "English leakage in HI/PA");
    }
    if (hasGenericLabel(question.explanationHi) || hasGenericLabel(question.explanationPa)) {
      counters.genericLabels += 1;
      addExample(examples, question, index, "generic HI/PA label");
    }
    if (family === "commission") {
      const v = problem?.variables ?? {};
      const baseQuota = Number(v.baseSales ?? 0);
      const baseCommission = Number(v.baseCommission ?? (baseQuota * (v.baseCommissionRate ?? 0) / 100));
      const totalCommission = Number(v.totalCommission ?? 0);
      const totalSales = Number(v.totalSales ?? problem?.answer ?? 0);
      const excessSales = Number(v.excessSales ?? ((totalCommission - baseCommission) * 100 / ((v.baseCommissionRate ?? 0) + (v.bonusRate ?? 0))));
      if (
        totalCommission <= baseCommission ||
        excessSales <= 0 ||
        totalSales <= baseQuota ||
        Math.abs((problem?.answer ?? 0) - baseQuota) <= 0.01
      ) {
        counters.degenerateCommission += 1;
        const details = { baseQuota, baseCommission, totalCommission, excessSales, totalSales };
        addExample(examples, question, index, "degenerate commission", details);
        addExample(degenerateCommissionExamples, question, index, "degenerate commission", details);
      }
    }
    if (family === "perc_exam_weighted_aggregate") {
      const v = problem?.variables ?? {};
      if (
        (typeof v.paper1Percent === "number" &&
          typeof v.paper2Percent === "number" &&
          v.paper1Percent === v.paper2Percent) ||
        (typeof v.paperOnePercent === "number" &&
          typeof v.paperTwoPercent === "number" &&
          v.paperOnePercent === v.paperTwoPercent) ||
        (typeof v.p1 === "number" &&
          typeof v.p2 === "number" &&
          v.p1 === v.p2)
      ) {
        counters.trivialWeighted += 1;
        addExample(examples, question, index, "identical weighted aggregate rates");
      }
    }
    if (family === "perc_demo_cross_tab_literacy") {
      const v = problem?.variables ?? {};
      if (v.maleLiteracy === v.femaleLiteracy) {
        counters.trivialCrossTab += 1;
        addExample(examples, question, index, "identical cross-tab subgroup rates");
      }
    }
    if (problem?.subtype === "price_consumption" && problem?.variables?.quantityDifference !== undefined) {
      const expenditure = String(problem.variables.totalExpenditure ?? "").replace(/\.0+$/u, "");
      if (!new RegExp(`${expenditure}\\s*/\\s*x`, "u").test(question.explanation)) {
        counters.priceAbsoluteExplanation += 1;
        addExample(examples, question, index, "price absolute explanation missing expenditure/x equation");
      }
    }
    if (realism < 70) {
      counters.lowRealism += 1;
      const reason = family === "perc_budget_cascading_remainder"
        ? "budget wording/context realism below production threshold"
        : family === "perc_exam_weighted_aggregate"
          ? "exam aggregate wording realism below production threshold"
          : /relation/u.test(family)
            ? "relation item too direct/artificial"
            : "realism below production threshold";
      addExample(examples, question, index, `low realism ${realism}: ${reason}`);
      addExample(lowRealismExamples, question, index, `low realism ${realism}: ${reason}`);
    }
    if (new Set(question.options ?? []).size !== (question.options ?? []).length) {
      counters.optionQuality += 1;
      addExample(examples, question, index, "duplicate options");
    }
    if (!question.options?.includes(answerText(question))) {
      counters.optionQuality += 1;
      addExample(examples, question, index, "answer missing from options");
    }
    if (hasAbsurdOptionScale(question)) {
      counters.optionQuality += 1;
      addExample(examples, question, index, "absurd option scale");
    }
    const vennIssue = vennVisualIssue(question);
    if (vennIssue) {
      counters.vennVisual += 1;
      addExample(examples, question, index, "venn visual payload issue", vennIssue);
    }
  });

  const familyCapTable = [...familyCounts.entries()]
    .map(([family, familyCount]) => ({
      family,
      actual: familyCount,
      cap: configuredFamilyCap(family, count),
      pass: familyCount <= configuredFamilyCap(family, count),
    }))
    .sort((left, right) => right.actual - left.actual);

  for (const { family, actual: familyCount, cap } of familyCapTable) {
    if (familyCount > cap) {
      counters.familyCap += 1;
      examples.push({
        index: -1,
        family,
        topology: family,
        realism: 0,
        issue: `family cap exceeded ${familyCount}/${cap}`,
        question: "(distribution)",
        answer: "",
      });
    }
  }

  const firstWindowReports = Array.from({ length: 5 }, (_, index) =>
    auditFirstWindow(`${seed}:preview:${index}`),
  );
  const averageRealism = realismTotal / Math.max(1, orderedQuestions.length);
  const lowRealismLimit = Math.floor(count * 0.05);
  const firstOpeningLimit = count >= 500 ? 15 : Number.POSITIVE_INFINITY;
  const fullOpeningLimit = count >= 500 ? 5 : Number.POSITIVE_INFINITY;
  const phraseDiversityFailures = [
    ...[...openingCounts.entries()]
      .filter(([, openingCount]) => openingCount > firstOpeningLimit)
      .map(([opening, openingCount]) => ({
        kind: "first8",
        phrase: opening,
        count: openingCount,
        limit: firstOpeningLimit,
      })),
    ...[...fullOpeningCounts.entries()]
      .filter(([, openingCount]) => openingCount > fullOpeningLimit)
      .map(([opening, openingCount]) => ({
        kind: "fullOpening",
        phrase: opening,
        count: openingCount,
        limit: fullOpeningLimit,
      })),
  ];
  const pass =
    counters.solverMismatch === 0 &&
    counters.explanationMismatch === 0 &&
    counters.duplicates === 0 &&
    counters.undefinedLike === 0 &&
    counters.englishLeakage === 0 &&
    counters.degenerateCommission === 0 &&
    counters.trivialWeighted === 0 &&
    counters.trivialCrossTab === 0 &&
    counters.priceAbsoluteExplanation === 0 &&
    counters.vennVisual === 0 &&
    firstWindowReports.every((report) => report.pass) &&
    averageRealism >= 75 &&
    averageRealism >= 78 &&
    counters.lowRealism < lowRealismLimit &&
    counters.familyCap === 0 &&
    phraseDiversityFailures.length === 0;

  const sortedFamilies = [...familyCounts.entries()].sort((a, b) => b[1] - a[1]);
  const sortedTopologies = [...topologyCounts.entries()].sort((a, b) => b[1] - a[1]);
  const repeatedOpenings = [...openingCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const repeatedFullOpenings = [...fullOpeningCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const repeatedExplanationIntros = [...explanationIntroCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const phraseVariantDiversityByFamily = [...familyPhraseVariants.entries()]
    .map(([family, variants]) => ({
      family,
      variantCount: variants.size,
      total: familyCounts.get(family) ?? 0,
    }))
    .sort((left, right) => right.total - left.total);
  const lowPhraseDiversityFamilies = phraseVariantDiversityByFamily
    .filter((entry) => entry.total >= 10 && entry.variantCount < 3);
  const worstExamples = examples
    .sort((a, b) => a.realism - b.realism)
    .slice(0, 20);

  const report = {
    totalGenerated: orderedQuestions.length,
    status: pass ? "PASS" : "FAIL",
    averageRealism: Number(averageRealism.toFixed(2)),
    counters,
    generationStats,
    scheduler: {
      acceptedCount: schedulerSummary.acceptedCount,
      rejectionReasons: schedulerSummary.rejectionReasons,
    },
    familyCapTable,
    familyDistribution: Object.fromEntries(sortedFamilies),
    topologyDistribution: Object.fromEntries(sortedTopologies),
    lowRealismCount: counters.lowRealism,
    lowRealismExamples: lowRealismExamples.slice(0, 20),
    duplicateCount: counters.duplicates,
    duplicateExamples: duplicateExamples.slice(0, 20),
    topDuplicateProducingFamilies: [...duplicateFamilyCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([family, duplicateCount]) => ({ family, duplicateCount })),
    degenerateCommissionExamples: degenerateCommissionExamples.slice(0, 20),
    firstWindowSequences: firstWindowReports,
    top20RepeatedStemOpenings: repeatedOpenings.map(([opening, openingCount]) => ({
      opening,
      count: openingCount,
    })),
    top20RepeatedFullOpeningSentences: repeatedFullOpenings.map(([opening, openingCount]) => ({
      opening,
      count: openingCount,
    })),
    top20RepeatedExplanationIntroLines: repeatedExplanationIntros.map(([intro, introCount]) => ({
      intro,
      count: introCount,
    })),
    phraseVariantDiversityByFamily,
    lowPhraseDiversityFamilies,
    phraseDiversityFailures,
    worst20Questions: worstExamples,
  };

  console.log(JSON.stringify(report, null, 2));
  if (!pass) {
    process.exitCode = 1;
  }
}

if (process.argv[1]?.endsWith("percentage-large-audit.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
