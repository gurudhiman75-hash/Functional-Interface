import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2ProfitLossQuestionCandidate } from "../../lib/quant-v2/profit-loss-admin-adapter";
import { PROFIT_LOSS_FAMILY_IDS } from "../canonical/profit-loss-motif-factories";
import type { ProfitLossFamilyId } from "../canonical/profit-loss-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import {
  profitLossDegenerateReasons,
  validateProfitLossIndependentSolver,
} from "../validators/profit-loss-independent-solver";

const profitLossPattern: Pattern = {
  id: "profit-loss-large-audit",
  type: "formula",
  section: "Quant",
  topic: "profit_loss_discount",
  subtopic: "profit_loss_discount",
  difficulty: "Medium",
  templateVariants: ["Profit/Loss V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-profit-loss",
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

const BANNED_EN_OPENERS = [
  "A shopkeeper lists the item:",
  "A store runs an offer where",
  "A trader buys goods and records that",
  "A customer is billed as follows",
  "A seller gives the following price details",
  "A dealer marks the goods and notes that",
  "In the given case",
  "In one transaction",
  "For this sale",
  "For this transaction",
  "In this markup-discount case",
];

const BANNED_HI_PA_WRAPPERS = [
  "दुकानदार वस्तु का विवरण देता है",
  "एक दुकान ऐसा प्रस्ताव चलाती है",
  "एक व्यापारी माल खरीदकर लिखता है",
  "एक डीलर माल अंकित करके लिखता है",
  "ग्राहक को इस प्रकार बिल किया गया",
  "विक्रेता निम्न मूल्य विवरण देता है",
  "ਦੁਕਾਨਦਾਰ ਵਸਤੂ ਦਾ ਵੇਰਵਾ ਦਿੰਦਾ ਹੈ",
  "ਇੱਕ ਸਟੋਰ ਐਸੀ ਪੇਸ਼ਕਸ਼ ਚਲਾਉਂਦਾ ਹੈ",
  "ਇੱਕ ਵਪਾਰੀ ਸਮਾਨ ਖਰੀਦ ਕੇ ਲਿਖਦਾ ਹੈ",
  "ਇੱਕ ਡੀਲਰ ਸਮਾਨ ਅੰਕਿਤ ਕਰ ਕੇ ਲਿਖਦਾ ਹੈ",
  "ਗਾਹਕ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਬਿੱਲ ਕੀਤਾ ਗਿਆ",
  "ਵਿਕਰੇਤਾ ਹੇਠਲੇ ਕੀਮਤ ਵੇਰਵੇ ਦਿੰਦਾ ਹੈ",
  "दिए गए प्रश्न में",
  "एक लेन-देन में",
  "इस बिक्री में",
  "इस लेन-देन में",
  "इस मार्कअप-छूट प्रश्न में",
  "ਦਿੱਤੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ",
  "ਇੱਕ ਲੈਣ-ਦੇਣ ਵਿੱਚ",
  "ਇਸ ਵਿਕਰੀ ਵਿੱਚ",
  "ਇਸ ਲੈਣ-ਦੇਣ ਵਿੱਚ",
  "ਇਸ ਮਾਰਕਅਪ-ਛੂਟ ਪ੍ਰਸ਼ਨ ਵਿੱਚ",
];

const DIRECT_SIMPLE_FAMILIES = new Set([
  "pl_cp_sp_percent",
  "pl_cp_percent_to_sp",
  "pl_sp_percent_to_cp",
  "pl_mp_discount_to_sp",
  "pl_mp_sp_discount_percent",
  "pl_no_profit_no_loss",
  "pl_buy_get_free_discount",
]);

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
  if (/buy_get|promotion|cashback|gst|tax|coupon/u.test(family)) return "promotion_tax_macro";
  if (/target|markup|inverse/u.test(family)) return "markup_target_macro";
  if (/successive/u.test(family)) return "successive_discount_macro";
  if (/discount|marked|mp/u.test(family)) return "discount_macro";
  if (/equal_sp|two_article/u.test(family)) return "multi_article_macro";
  if (/cp_sp|cp_percent|sp_percent/u.test(family)) return "basic_cp_sp_macro";
  return family;
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

function stemOpening(question: FormulaQuestion) {
  return normalizeText(question.text).split(/\s+/u).slice(0, 8).join(" ");
}

function stemOpening4(question: FormulaQuestion) {
  return normalizeText(question.text).split(/\s+/u).slice(0, 4).join(" ");
}

function fullOpeningSentence(question: FormulaQuestion) {
  return normalizeText(String(question.text ?? "").split(/[.?!]/u)[0] ?? "");
}

function explanationIntroLine(question: FormulaQuestion) {
  const line = String(question.explanation ?? "")
    .split(/\r?\n/u)
    .map((item) => item.trim())
    .find((item) => item.length > 0 && !/^[\d\s./()+\-xX=%₹]+$/u.test(item));
  return normalizeText(line);
}

function numericOptions(question: FormulaQuestion) {
  return (question.options ?? [])
    .map((option) => String(option).match(/-?\d+(?:\.\d+)?/u)?.[0])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .filter(Number.isFinite);
}

function numericAnswer(question: FormulaQuestion) {
  const match = answerText(question).match(/-?\d+(?:\.\d+)?/u);
  return match ? Number(match[0]) : undefined;
}

function hasAbsurdOptionScale(question: FormulaQuestion) {
  const answer = numericAnswer(question);
  if (!Number.isFinite(answer) || answer === 0) return false;
  const isPercent = /%/u.test(answerText(question));
  return numericOptions(question).some((option) => {
    if (option === answer) return false;
    if (option <= 0) return true;
    if (isPercent) return option > 150;
    return option < answer * 0.25 || option > answer * 2.5;
  });
}

function hasOptionFormatInconsistency(question: FormulaQuestion) {
  const options = (question.options ?? []).map(String);
  const answer = answerText(question);
  if (!options.length) return false;
  if (/^₹/u.test(answer)) {
    return options.some((option) => !/^₹\d/u.test(option) || /%/u.test(option));
  }
  const percentOptions = options.filter((option) => /%/u.test(option));
  if (percentOptions.length && percentOptions.length !== options.length) {
    return !/no profit, no loss/iu.test(answer);
  }
  const labelled = percentOptions.map((option) =>
    /\b(?:profit|loss|discount|markup)\b/iu.test(option),
  );
  return labelled.some(Boolean) && !labelled.every(Boolean);
}

function hasUglyDecimalRupee(text: unknown) {
  const matches = String(text ?? "").match(/₹\d+(?:,\d{3})*\.(\d+)/gu) ?? [];
  return matches.some((match) => {
    const decimal = match.split(".").at(-1) ?? "";
    return decimal.length > 1 && !/^(25|50|5|75)$/u.test(decimal);
  });
}

function hasBasicRealismTooHigh(question: FormulaQuestion) {
  if (!DIRECT_SIMPLE_FAMILIES.has(familyOf(question))) return false;
  if (realismOf(question) <= 78) return false;
  return !/\b(?:at a loss of|at a profit of|cost price|marked price|sold for|buy \d+ get \d+ free)\b/iu.test(
    String(question.text ?? ""),
  );
}

function difficultyOf(question: FormulaQuestion) {
  return String((question as any).difficultyLabel ?? (question as any).difficulty ?? "Medium");
}

function hasDifficultyMismatch(question: FormulaQuestion) {
  if (familyOf(question) === "pl_asymmetric_item_equivalence" && /Hard/u.test(difficultyOf(question))) return true;
  return DIRECT_SIMPLE_FAMILIES.has(familyOf(question)) && /Medium|Hard/u.test(difficultyOf(question));
}

function hasBannedEnglishOpener(question: FormulaQuestion) {
  const text = String(question.text ?? "");
  return BANNED_EN_OPENERS.some((opener) => text.startsWith(opener));
}

function hasBannedHiPaWrapper(question: FormulaQuestion) {
  const text = `${question.textHi ?? ""}\n${question.textPa ?? ""}`;
  return BANNED_HI_PA_WRAPPERS.some((phrase) => text.includes(phrase));
}

function hasEnglishLeak(text: unknown) {
  return /\b(?:cost price|selling price|marked price|discount|profit|loss|overall|article|watch|bag|shopkeeper|trader|Find|The)\b/u.test(
    String(text ?? ""),
  );
}

function hasGenericHiPaLabel(text: unknown) {
  return /कुल मान|अंतिम मान|आवश्यक मान|ਲੋੜੀਂਦਾ ਮੁੱਲ|ਅੰਤਿਮ ਮੁੱਲ|ਕੁੱਲ ਮਾਤਰਾ/u.test(
    String(text ?? ""),
  );
}

function hasAwkwardBoughtSoldGender(text: unknown) {
  return /एक\s+(?:मिक्सर|टेबल फैन|कैलकुलेटर|लैपटॉप|फोन|स्कूटर)[^।\n]{0,60}(?:खरीदी गई|बेची गई)|ਇੱਕ\s+(?:ਮਿਕਸਰ|ਟੇਬਲ ਫੈਨ|ਕੈਲਕੁਲੇਟਰ|ਲੈਪਟਾਪ|ਫੋਨ|ਸਕੂਟਰ)[^।\n]{0,60}(?:ਖਰੀਦੀ ਗਈ|ਵੇਚੀ ਗਈ)/u.test(
    String(text ?? ""),
  );
}

function isWeightFraudFamily(family: string) {
  return /^pl_dishonest_dealer/u.test(family);
}

function isWeightBasedObject(value: unknown) {
  return /^(?:rice|wheat|sugar|pulses|flour|oil tin|tea packet|coffee jar|dry fruit box)$/u.test(
    String(value ?? ""),
  );
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

function configuredFamilyCap(family: string, count: number) {
  if (count >= 500) {
    const largeCaps: Record<string, number> = {
      pl_cp_sp_percent: 40,
      pl_cp_percent_to_sp: 40,
      pl_sp_percent_to_cp: 40,
      pl_mp_discount_to_sp: 70,
      pl_mp_sp_discount_percent: 70,
      pl_cp_mp_discount_to_percent: 75,
      pl_mp_for_target_profit: 35,
      pl_successive_discounts: 45,
      pl_equal_sp_profit_loss: 45,
      pl_two_article_overall: 45,
      pl_no_profit_no_loss: 25,
      pl_asymmetric_item_equivalence: 35,
      pl_fractional_value_shift: 35,
      pl_loss_recovery_cp_from_difference: 35,
      pl_required_sp_after_loss: 35,
      pl_sp_difference_two_rates: 35,
      pl_markup_discount_triangle: 35,
      pl_target_profit_discount_calibration: 35,
      pl_target_profit_mp_calibration: 35,
      pl_successive_discount_equivalent: 40,
      pl_dual_item_identical_sp: 40,
      pl_dual_item_mixed_baseline: 35,
      pl_partial_inventory_allocation: 35,
      pl_equal_profit_loss_amount: 35,
      pl_same_profit_amount_different_rates: 35,
      pl_sequential_supply_chain: 35,
      pl_supply_chain_mixed_profit_loss: 35,
      pl_compound_error_baseline_shift: 35,
      pl_dishonest_dealer_weight_fraud: 35,
      pl_dishonest_dealer_dual_fraud: 35,
      pl_dishonest_dealer_absolute_hybrid: 35,
      pl_buy_get_free_discount: 35,
      pl_hybrid_promotion_scaling: 35,
      pl_cashback_coupon_discount: 35,
      pl_gst_after_discount: 35,
      pl_tax_inclusive_back_calc: 35,
      pl_profit_after_commission_tax: 35,
      pl_repair_overhead_cost: 35,
      pl_required_sp_after_overhead: 35,
      pl_manufacturing_breakdown: 35,
      pl_inverse_cp_from_mp_discount_profit: 35,
      pl_inverse_discount_from_cp_mp_profit: 35,
      pl_inverse_markup_from_cp_discount_profit: 35,
      pl_multi_condition_inverse_absolute: 35,
    };
    return largeCaps[family] ?? 60;
  }
  return count;
}

function forcedFamilyForAttempt(
  slot: number,
  attempt: number,
  count: number,
  keptFamilyCounts: Map<string, number>,
): ProfitLossFamilyId {
  for (let offset = 0; offset < PROFIT_LOSS_FAMILY_IDS.length; offset += 1) {
    const family = PROFIT_LOSS_FAMILY_IDS[(slot + attempt + offset) % PROFIT_LOSS_FAMILY_IDS.length]!;
    if ((keptFamilyCounts.get(family) ?? 0) < configuredFamilyCap(family, count)) {
      return family;
    }
  }
  return PROFIT_LOSS_FAMILY_IDS[(slot + attempt) % PROFIT_LOSS_FAMILY_IDS.length]!;
}

function localOptionIssue(question: FormulaQuestion) {
  if (new Set(question.options ?? []).size !== (question.options ?? []).length) {
    return "duplicate options";
  }
  if (!question.options?.includes(answerText(question))) {
    return "answer missing from options";
  }
  if (hasAbsurdOptionScale(question)) {
    return "absurd option scale";
  }
  return undefined;
}

function allQuestionText(question: FormulaQuestion) {
  return [
    question.text,
    question.textHi,
    question.textPa,
    question.explanation,
    question.explanationHi,
    question.explanationPa,
    ...(question.options ?? []),
    ...((question as any).optionsHi ?? []),
    ...((question as any).optionsPa ?? []),
  ].join("\n");
}

function generateQuestions(count: number, seed: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "balanced_mock",
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const keptOpeningCounts = new Map<string, number>();
  const keptFullOpeningCounts = new Map<string, number>();
  const generationStats = {
    replacementAttempts: 0,
    skippedCandidates: 0,
    failedSlots: 0,
    totalAttempts: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const maxAttempts = Math.max(count * 20, count + 1000);
  const reject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] = (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };

  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    try {
      const forcedMotifId = forcedFamilyForAttempt(questions.length, attempt, count, keptFamilyCounts);
      const result = generateScheduledQuestion({
        state,
        index: questions.length,
        seedPrefix: `${seed}:large:${attempt}`,
        examProfile: "ssc",
        forcedMotifId,
        generate: (options) =>
          createQuantV2ProfitLossQuestionCandidate(profitLossPattern, options),
      });
      const question = result.question;
      const family = familyOf(question);
      if ((keptFamilyCounts.get(family) ?? 0) >= configuredFamilyCap(family, count)) {
        reject(`family cap reached: ${family}`);
        continue;
      }
      const fingerprint = duplicateFingerprint(question);
      if (keptFingerprints.has(fingerprint)) {
        reject("duplicate fingerprint");
        continue;
      }
      const problem = problemOf(question);
      const solver = validateProfitLossIndependentSolver({
        problem,
        explanation: question.explanation,
        options: question.options,
        correct: question.correct,
      });
      if (!solver.valid) {
        reject(`solver validation: ${solver.metrics.rejectedReason ?? "unknown"}`);
        continue;
      }
      const optionIssue = localOptionIssue(question);
      if (optionIssue) {
        reject(optionIssue);
        continue;
      }
      const degenerateReasons = profitLossDegenerateReasons(problem);
      if (degenerateReasons.length) {
        reject(`degenerate: ${degenerateReasons[0]}`);
        continue;
      }
      if (count >= 500 && (keptOpeningCounts.get(stemOpening(question)) ?? 0) >= 15) {
        reject("first opening repeat limit");
        continue;
      }
      if (count >= 500 && (keptFullOpeningCounts.get(fullOpeningSentence(question)) ?? 0) >= 5) {
        reject("full opening repeat limit");
        continue;
      }

      keptFingerprints.add(fingerprint);
      increment(keptFamilyCounts, family);
      increment(keptOpeningCounts, stemOpening(question));
      increment(keptFullOpeningCounts, fullOpeningSentence(question));
      questions.push(question);
    } catch (error) {
      reject(error instanceof Error ? `generation throw: ${error.message}` : "generation throw");
    }
  }

  generationStats.replacementAttempts = Math.max(0, generationStats.totalAttempts - questions.length);
  generationStats.failedSlots = Math.max(0, count - questions.length);
  if (questions.length < count) {
    throw new Error(`Profit/Loss large audit generated ${questions.length}/${count} clean questions. ${JSON.stringify(generationStats)}`);
  }
  return {
    questions,
    schedulerSummary: summarizeCorpusScheduler(state),
    generationStats,
  };
}

function auditFirstWindow(seed: string) {
  const { questions } = generateQuestions(50, seed);
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

async function main() {
  const count = parseCount();
  const seed = argValue("seed") ?? `profit-loss-large-audit-${count}`;
  const { questions, schedulerSummary, generationStats } = generateQuestions(count, seed);
  const orderedQuestions = interleaveScheduledPreviewQuestions(questions, seed, familyOf);

  const familyCounts = new Map<string, number>();
  const topologyCounts = new Map<string, number>();
  const openingCounts = new Map<string, number>();
  const opening4Counts = new Map<string, number>();
  const fullOpeningCounts = new Map<string, number>();
  const explanationIntroCounts = new Map<string, number>();
  const familyPhraseVariants = new Map<string, Set<string>>();
  const duplicateSeen = new Map<string, number>();
  const examples: AuditExample[] = [];
  const counters = {
    solverMismatch: 0,
    explanationMismatch: 0,
    duplicates: 0,
    undefinedLike: 0,
    englishLeakage: 0,
    genericLabels: 0,
    optionQuality: 0,
    optionFormatInconsistency: 0,
    absurdDistractorScale: 0,
    uglyDecimalRupeeAnswers: 0,
    uglyDecimalRupeeOptions: 0,
    basicRealismTooHigh: 0,
    lowRealism: 0,
    flatRealismValues: 0,
    difficultyMismatch: 0,
    familyCap: 0,
    degenerateCases: 0,
    badCasing: 0,
    markupLabel: 0,
    ratioCurrency: 0,
    denominatorFormatting: 0,
    explanationNonsense: 0,
    bannedGenericOpeners: 0,
    bannedHiPaWrappers: 0,
    awkwardGender: 0,
    weightFraudContext: 0,
  };
  let realismTotal = 0;
  let minRealism = Number.POSITIVE_INFINITY;
  let maxRealism = Number.NEGATIVE_INFINITY;
  const realismCounts = new Map<string, number>();
  const difficultyDistribution = new Map<string, number>();

  orderedQuestions.forEach((question, index) => {
    const family = familyOf(question);
    const topology = topologyOf(question);
    const realism = realismOf(question);
    const problem = problemOf(question);
    realismTotal += realism;
    minRealism = Math.min(minRealism, realism);
    maxRealism = Math.max(maxRealism, realism);
    increment(realismCounts, String(realism));
    increment(difficultyDistribution, difficultyOf(question));
    increment(familyCounts, family);
    increment(topologyCounts, topology);
    increment(openingCounts, stemOpening(question));
    increment(opening4Counts, stemOpening4(question));
    increment(fullOpeningCounts, fullOpeningSentence(question));
    increment(explanationIntroCounts, explanationIntroLine(question));
    const variants = familyPhraseVariants.get(family) ?? new Set<string>();
    variants.add(fullOpeningSentence(question));
    familyPhraseVariants.set(family, variants);

    const solver = validateProfitLossIndependentSolver({
      problem,
      explanation: question.explanation,
      options: question.options,
      correct: question.correct,
    });
    for (const issue of solver.issues) {
      if (/explanation final value mismatch/u.test(issue)) {
        counters.explanationMismatch += 1;
      } else if (/duplicate options|answer missing/u.test(issue)) {
        counters.optionQuality += 1;
      } else if (/CP equals|zero discount|MP equals|accidental|positive|unrealistic/u.test(issue)) {
        counters.degenerateCases += 1;
      } else {
        counters.solverMismatch += 1;
      }
      addExample(examples, question, index, issue);
    }

    const fingerprint = duplicateFingerprint(question);
    if (duplicateSeen.has(fingerprint)) {
      counters.duplicates += 1;
      addExample(examples, question, index, `duplicate of #${duplicateSeen.get(fingerprint)}`);
    } else {
      duplicateSeen.set(fingerprint, index);
    }

    const text = allQuestionText(question);
    if (/\b(?:undefined|null|NaN)\b/u.test(text)) {
      counters.undefinedLike += 1;
      addExample(examples, question, index, "undefined/null/NaN text");
    }
    if (/\bcP\b/u.test(text)) {
      counters.badCasing += 1;
      addExample(examples, question, index, "bad cP casing");
    }
    if (family === "pl_inverse_markup_from_cp_discount_profit") {
      if (!/\bmarkup\b/iu.test(answerText(question)) || /\bprofit\b/iu.test(answerText(question))) {
        counters.markupLabel += 1;
        addExample(examples, question, index, "markup answer labelled as profit");
      }
      if (!/Markup percentage/iu.test(String(question.explanation ?? ""))) {
        counters.markupLabel += 1;
        addExample(examples, question, index, "markup explanation missing markup label");
      }
    }
    if (family === "pl_same_profit_amount_different_rates") {
      const optionText = (question.options ?? []).map(String).join(" | ");
      if (/[₹â‚¹%]/u.test(optionText) || /[₹â‚¹%]/u.test(answerText(question))) {
        counters.ratioCurrency += 1;
        addExample(examples, question, index, "ratio options/answer contain currency or percent", { options: question.options });
      }
    }
    if (/100100/u.test(text)) {
      counters.denominatorFormatting += 1;
      addExample(examples, question, index, "bad denominator formatting 100100");
    }
    if (family === "pl_dual_item_mixed_baseline" && /CP ratio[\s\S]{0,120}=\s*0/iu.test(String(question.explanation ?? ""))) {
      counters.explanationNonsense += 1;
      addExample(examples, question, index, "dual-item mixed baseline ratio explanation has = 0");
    }
    if (
      hasBannedEnglishOpener(question) ||
      /^(?:For the given sale record|For this shop transaction|For the selected item|In an exam-style pricing case|In a commercial arithmetic question|For a wholesale-retail example|In a pricing worksheet|From a customer invoice|For the sold item)\b/u.test(String(question.text ?? ""))
    ) {
      counters.bannedGenericOpeners += 1;
      addExample(examples, question, index, "banned generic opener");
    }
    if (hasBannedHiPaWrapper(question)) {
      counters.bannedHiPaWrappers += 1;
      addExample(examples, question, index, "banned HI/PA wrapper");
    }
    if (hasDifficultyMismatch(question)) {
      counters.difficultyMismatch += 1;
      addExample(examples, question, index, "direct/simple family marked Medium/Hard", {
        difficulty: difficultyOf(question),
      });
    }
    if (hasUglyDecimalRupee(answerText(question))) {
      counters.uglyDecimalRupeeAnswers += 1;
      addExample(examples, question, index, "ugly decimal rupee answer", { answer: answerText(question) });
    }
    if ((question.options ?? []).some(hasUglyDecimalRupee)) {
      counters.uglyDecimalRupeeOptions += 1;
      addExample(examples, question, index, "ugly decimal rupee option", { options: question.options });
    }
    if (hasBasicRealismTooHigh(question)) {
      counters.basicRealismTooHigh += 1;
      addExample(examples, question, index, "basic direct formula realism exceeds 78", {
        realism,
      });
    }
    if (hasAwkwardBoughtSoldGender(question.textHi) || hasAwkwardBoughtSoldGender(question.textPa)) {
      counters.awkwardGender += 1;
      addExample(examples, question, index, "awkward HI/PA bought/sold gender pattern");
    }
    if (isWeightFraudFamily(family) && !isWeightBasedObject(problem?.object?.en)) {
      counters.weightFraudContext += 1;
      addExample(examples, question, index, "weight-fraud family used non-weight object", {
        object: problem?.object?.en,
      });
    }
    if (
      hasEnglishLeak(question.textHi) ||
      hasEnglishLeak(question.textPa) ||
      hasEnglishLeak(question.explanationHi) ||
      hasEnglishLeak(question.explanationPa)
    ) {
      counters.englishLeakage += 1;
      addExample(examples, question, index, "English leakage in HI/PA");
    }
    if (hasGenericHiPaLabel(question.explanationHi) || hasGenericHiPaLabel(question.explanationPa)) {
      counters.genericLabels += 1;
      addExample(examples, question, index, "generic HI/PA label");
    }
    const optionIssue = localOptionIssue(question);
    if (optionIssue) {
      if (optionIssue === "absurd option scale") {
        counters.absurdDistractorScale += 1;
      } else {
        counters.optionQuality += 1;
      }
      addExample(examples, question, index, optionIssue);
    }
    if (hasOptionFormatInconsistency(question)) {
      counters.optionFormatInconsistency += 1;
      addExample(examples, question, index, "option format inconsistency", { options: question.options });
    }
    const degenerateReasons = profitLossDegenerateReasons(problem);
    if (degenerateReasons.length) {
      counters.degenerateCases += 1;
      addExample(examples, question, index, degenerateReasons[0]!, { variables: problem?.variables });
    }
    if (realism < 70) {
      counters.lowRealism += 1;
      addExample(examples, question, index, `low realism ${realism}`);
    }
  });

  const familyCapTable = [...familyCounts.entries()]
    .map(([family, actual]) => ({
      family,
      actual,
      cap: configuredFamilyCap(family, count),
      pass: actual <= configuredFamilyCap(family, count),
    }))
    .sort((left, right) => right.actual - left.actual);
  for (const entry of familyCapTable) {
    if (!entry.pass) {
      counters.familyCap += 1;
      examples.push({
        index: -1,
        family: entry.family,
        topology: entry.family,
        realism: 0,
        issue: `family cap exceeded ${entry.actual}/${entry.cap}`,
        question: "(distribution)",
        answer: "",
      });
    }
  }

  const firstWindowReports = Array.from({ length: 5 }, (_, index) =>
    auditFirstWindow(`${seed}:preview:${index}`),
  );
  const averageRealism = Number((realismTotal / Math.max(1, orderedQuestions.length)).toFixed(2));
  const repeatedRealismValues = [...realismCounts.entries()]
    .map(([score, value]) => ({ score: Number(score), count: value }))
    .sort((left, right) => right.count - left.count);
  counters.flatRealismValues = repeatedRealismValues.filter(
    (entry) => entry.count > Math.max(30, Math.floor(count * 0.25)),
  ).length;
  const lowRealismLimit = Math.floor(count * 0.05);
  const firstOpeningLimit = count >= 500 ? 15 : Number.POSITIVE_INFINITY;
  const first4OpeningLimit = count >= 500 ? 24 : Number.POSITIVE_INFINITY;
  const fullOpeningLimit = count >= 500 ? 5 : Number.POSITIVE_INFINITY;
  const phraseDiversityFailures = [
    ...[...opening4Counts.entries()]
      .filter(([, value]) => value > first4OpeningLimit)
      .map(([phrase, value]) => ({ kind: "first4", phrase, count: value, limit: first4OpeningLimit })),
    ...[...openingCounts.entries()]
      .filter(([, value]) => value > firstOpeningLimit)
      .map(([phrase, value]) => ({ kind: "first8", phrase, count: value, limit: firstOpeningLimit })),
    ...[...fullOpeningCounts.entries()]
      .filter(([, value]) => value > fullOpeningLimit)
      .map(([phrase, value]) => ({ kind: "fullOpening", phrase, count: value, limit: fullOpeningLimit })),
  ];
  const phraseVariantDiversityByFamily = [...familyPhraseVariants.entries()]
    .map(([family, variants]) => ({
      family,
      variantCount: variants.size,
      total: familyCounts.get(family) ?? 0,
    }))
    .sort((left, right) => right.total - left.total);
  const lowPhraseDiversityFamilies = phraseVariantDiversityByFamily
    .filter((entry) => entry.total >= 10 && entry.variantCount < 3);

  const pass =
    counters.solverMismatch === 0 &&
    counters.explanationMismatch === 0 &&
    counters.duplicates === 0 &&
    counters.undefinedLike === 0 &&
    counters.englishLeakage === 0 &&
    counters.optionQuality === 0 &&
    counters.optionFormatInconsistency === 0 &&
    counters.absurdDistractorScale === 0 &&
    counters.uglyDecimalRupeeAnswers === 0 &&
    counters.uglyDecimalRupeeOptions === 0 &&
    counters.basicRealismTooHigh === 0 &&
    counters.difficultyMismatch === 0 &&
    counters.degenerateCases === 0 &&
    counters.badCasing === 0 &&
    counters.markupLabel === 0 &&
    counters.ratioCurrency === 0 &&
    counters.denominatorFormatting === 0 &&
    counters.explanationNonsense === 0 &&
    counters.bannedGenericOpeners === 0 &&
    counters.bannedHiPaWrappers === 0 &&
    counters.awkwardGender === 0 &&
    counters.weightFraudContext === 0 &&
    counters.flatRealismValues === 0 &&
    counters.familyCap === 0 &&
    firstWindowReports.every((report) => report.pass) &&
    averageRealism >= 75 &&
    counters.lowRealism < lowRealismLimit &&
    phraseDiversityFailures.length === 0 &&
    lowPhraseDiversityFamilies.length === 0;

  const report = {
    totalGenerated: orderedQuestions.length,
    status: pass ? "PASS" : "FAIL",
    realism: {
      average: averageRealism,
      min: Number.isFinite(minRealism) ? minRealism : 0,
      max: Number.isFinite(maxRealism) ? maxRealism : 0,
      repeatedValues: repeatedRealismValues.slice(0, 10),
    },
    averageRealism,
    counters,
    generationStats,
    scheduler: {
      acceptedCount: schedulerSummary.acceptedCount,
      rejectionReasons: schedulerSummary.rejectionReasons,
    },
    familyCapTable,
    familyDistribution: Object.fromEntries([...familyCounts.entries()].sort((a, b) => b[1] - a[1])),
    difficultyDistribution: Object.fromEntries([...difficultyDistribution.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    topologyDistribution: Object.fromEntries([...topologyCounts.entries()].sort((a, b) => b[1] - a[1])),
    firstWindowSequences: firstWindowReports,
    top20RepeatedStemOpenings: [...openingCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([opening, openingCount]) => ({ opening, count: openingCount })),
    top20RepeatedFirst4StemOpenings: [...opening4Counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([opening, openingCount]) => ({ opening, count: openingCount })),
    top20RepeatedFullOpeningSentences: [...fullOpeningCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([opening, openingCount]) => ({ opening, count: openingCount })),
    top20RepeatedExplanationIntroLines: [...explanationIntroCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([intro, introCount]) => ({ intro, count: introCount })),
    phraseVariantDiversityByFamily,
    lowPhraseDiversityFamilies,
    phraseDiversityFailures,
    worst20Questions: examples
      .sort((left, right) => left.realism - right.realism)
      .slice(0, 20),
    top10LowRealismExamples: orderedQuestions
      .map((question, index) => ({
        index,
        family: familyOf(question),
        realism: realismOf(question),
        question: question.text,
        answer: answerText(question),
      }))
      .sort((left, right) => left.realism - right.realism)
      .slice(0, 10),
  };

  console.log(JSON.stringify(report, null, 2));
  if (!pass) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
