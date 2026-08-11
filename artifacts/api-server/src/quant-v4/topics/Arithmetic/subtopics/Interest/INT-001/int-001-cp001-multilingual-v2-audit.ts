import { INT_CP001_FINAL_REGISTRY } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import { generateIntCp001ApprovedLocalizedQuestion } from "./cp001-localized-runtime-approved";
import {
  assertIntCp001DirectionAwareLocaleParity,
  generateIntCp001DirectionAwareLocalizedQuestion,
} from "./cp001-localized-runtime-v2";
import {
  validateIntCp001StemCashFlow,
  type IntCp001CashFlowDirection,
} from "./cp001-cash-flow-direction";
import {
  getIntCp001CashFlowContextV2,
  validateIntCp001ContextLeadV2,
} from "./cp001-cash-flow-context-v2";
import { validateIntCp001LoanAmountWordingV2 } from "./cp001-cash-flow-amount-v2";
import { stableBigIntJson } from "./cp001-localization-foundation";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  INT_CP001_HINDI_RELEASE_V2_ID,
  INT_CP001_MULTILINGUAL_V2_STANDARD,
  INT_CP001_PUNJABI_RELEASE_V2_ID,
} from "./cp001-multilingual-release-v2";

function fail(message: string): never {
  throw new Error(message);
}

function invariantContent(value: Record<string, unknown>): string {
  const {
    releaseId: _releaseId,
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    stem: _stem,
    validation: _validation,
    localeEditorialTrace: _localeEditorialTrace,
    ...content
  } = value;
  return stableBigIntJson(content);
}

const locales: readonly IntCp001Locale[] = ["hi", "pa"];
const directionKeys: readonly IntCp001CashFlowDirection[] = [
  "BORROWER_PAYS",
  "INVESTOR_EARNS",
  "NEUTRAL_MATH",
];
const expectedScenarios = new Set([
  "BUSINESS_ADVANCE",
  "COMMUNITY_LOAN",
  "CROP_LOAN",
  "EDUCATION_LOAN",
  "EQUIPMENT_LOAN",
  "FIXED_DEPOSIT",
  "PERSONAL_AGREEMENT",
  "PERSONAL_LENDING",
  "POST_OFFICE",
  "POST_OFFICE_DEPOSIT",
  "SAVINGS_CERTIFICATE",
]);

const stats = Object.fromEntries(locales.map((locale) => [locale, {
  generated: 0,
  changedStems: 0,
  legacyContradictions: 0,
  v2Contradictions: 0,
  amountWordingChecks: 0,
  directions: Object.fromEntries(directionKeys.map((key) => [key, 0])) as Record<IntCp001CashFlowDirection, number>,
  scenarios: new Set<string>(),
  stems: new Set<string>(),
  positions: [0, 0, 0, 0],
}])) as Record<IntCp001Locale, {
  generated: number;
  changedStems: number;
  legacyContradictions: number;
  v2Contradictions: number;
  amountWordingChecks: number;
  directions: Record<IntCp001CashFlowDirection, number>;
  scenarios: Set<string>;
  stems: Set<string>;
  positions: number[];
}>;

let englishParityChecks = 0;
let v1ToV2InvariantChecks = 0;
let deterministicChecks = 0;
let cashFlowChecks = 0;
let trapChecks = 0;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `cash-flow-${index}`;
    const english = generateIntCp001FinalEditorialV3Question(entry.qlId, seed);
    if (!english.validation.ok) fail(`${entry.qlId}/${seed}/en: ${english.validation.errors.join(" | ")}`);

    for (const locale of locales) {
      const approvedV1 = generateIntCp001ApprovedLocalizedQuestion(entry.qlId, seed, locale);
      const item = generateIntCp001DirectionAwareLocalizedQuestion(entry.qlId, seed, locale);
      const repeat = generateIntCp001DirectionAwareLocalizedQuestion(entry.qlId, seed, locale);
      const localeStats = stats[locale];

      if (stableBigIntJson(item) !== stableBigIntJson(repeat)) fail(`${entry.qlId}/${seed}/${locale} is not deterministic.`);
      deterministicChecks += 1;

      assertIntCp001DirectionAwareLocaleParity(english, item);
      englishParityChecks += 1;

      if (invariantContent(approvedV1 as unknown as Record<string, unknown>) !== invariantContent(item as unknown as Record<string, unknown>)) {
        fail(`${entry.qlId}/${seed}/${locale} changed a field outside the approved cash-flow patch boundary.`);
      }
      v1ToV2InvariantChecks += 1;

      if (!item.validation.ok) fail(`${entry.qlId}/${seed}/${locale}: ${item.validation.errors.join(" | ")}`);
      if (item.releaseId !== (locale === "hi" ? INT_CP001_HINDI_RELEASE_V2_ID : INT_CP001_PUNJABI_RELEASE_V2_ID)) {
        fail(`${entry.qlId}/${seed}/${locale} has an incorrect V2 release ID.`);
      }
      if (item.maturity !== "MULTILINGUAL_EDITORIAL_PATCH_CANDIDATE") fail(`${entry.qlId}/${seed}/${locale} has unsafe maturity.`);
      if (item.reviewStatus !== "PENDING_MULTILINGUAL_REVIEW" || item.localeReviewStatus !== "PENDING_HUMAN_REVIEW") {
        fail(`${entry.qlId}/${seed}/${locale} bypassed the V2 human-review gate.`);
      }
      if (item.questionBankStatus !== "NOT_STORED" || item.testEligibility !== "INELIGIBLE") {
        fail(`${entry.qlId}/${seed}/${locale} breached storage/test safety.`);
      }
      if (item.publiclyPublishable || item.questionStudioDiscoverable) {
        fail(`${entry.qlId}/${seed}/${locale} breached publication/routing safety.`);
      }
      if (item.options.length !== 4 || new Set(item.options).size !== 4) fail(`${entry.qlId}/${seed}/${locale} lacks four unique options.`);
      if (item.optionAudit[item.correctIndex]?.misconceptionId !== "CORRECT") fail(`${entry.qlId}/${seed}/${locale} lost correct-option ownership.`);
      if (item.explanation.trapAnalysis.items.length !== 3) fail(`${entry.qlId}/${seed}/${locale} lacks three distractor analyses.`);
      for (const trap of item.explanation.trapAnalysis.items) {
        trapChecks += 1;
        if (trap.optionNumber - 1 === item.correctIndex) fail(`${entry.qlId}/${seed}/${locale} analyses the correct option as a trap.`);
        if (trap.optionText !== item.options[trap.optionNumber - 1]) fail(`${entry.qlId}/${seed}/${locale} has an out-of-sync trap option.`);
      }

      const cashFlow = getIntCp001CashFlowContextV2(approvedV1.internalProvenance.sourceParameters);
      if (item.localeEditorialTrace.scenarioId !== cashFlow.scenarioId || item.localeEditorialTrace.cashFlowDirection !== cashFlow.direction) {
        fail(`${entry.qlId}/${seed}/${locale} has incorrect cash-flow traceability.`);
      }

      const legacyErrors = [
        ...validateIntCp001ContextLeadV2(approvedV1.stem, locale, cashFlow),
        ...validateIntCp001StemCashFlow(approvedV1.stem, approvedV1.solveContract, locale, cashFlow.direction),
        ...validateIntCp001LoanAmountWordingV2(approvedV1.stem, approvedV1.solveContract, locale, cashFlow.direction),
      ];
      const v2AmountErrors = validateIntCp001LoanAmountWordingV2(
        item.stem,
        item.solveContract,
        locale,
        cashFlow.direction,
      );
      const v2Errors = [
        ...validateIntCp001ContextLeadV2(item.stem, locale, cashFlow),
        ...validateIntCp001StemCashFlow(item.stem, item.solveContract, locale, cashFlow.direction),
        ...v2AmountErrors,
      ];
      cashFlowChecks += 1;
      if (cashFlow.direction === "BORROWER_PAYS" && v2AmountErrors.length === 0) {
        localeStats.amountWordingChecks += 1;
      }
      if (legacyErrors.length > 0) localeStats.legacyContradictions += 1;
      if (v2Errors.length > 0) {
        localeStats.v2Contradictions += 1;
        fail(`${entry.qlId}/${seed}/${locale} still has a cash-flow contradiction: ${v2Errors.join(" | ")}`);
      }

      localeStats.generated += 1;
      localeStats.directions[cashFlow.direction] += 1;
      localeStats.scenarios.add(cashFlow.scenarioId);
      localeStats.stems.add(item.stem);
      localeStats.positions[item.correctIndex] += 1;
      if (item.stem !== approvedV1.stem) localeStats.changedStems += 1;
    }
  }
}

for (const locale of locales) {
  const localeStats = stats[locale];
  if (localeStats.generated !== 1680) fail(`${locale} generated ${localeStats.generated}/1680 V2 questions.`);
  if (localeStats.directions.BORROWER_PAYS === 0 || localeStats.directions.INVESTOR_EARNS === 0) {
    fail(`${locale} did not exercise both loan and investment contexts.`);
  }
  if (localeStats.directions.NEUTRAL_MATH !== 0) fail(`${locale} encountered an unclassified source scenario.`);
  for (const scenarioId of expectedScenarios) {
    if (!localeStats.scenarios.has(scenarioId)) fail(`${locale} did not exercise source scenario ${scenarioId}.`);
  }
  if (localeStats.scenarios.size !== expectedScenarios.size) fail(`${locale} exercised an unexpected scenario set.`);
  if (localeStats.legacyContradictions === 0) fail(`${locale} audit failed to reproduce the legacy transaction-direction defect.`);
  if (localeStats.v2Contradictions !== 0) fail(`${locale} retained ${localeStats.v2Contradictions} V2 contradictions.`);
  if (localeStats.changedStems === 0) fail(`${locale} did not change any stems.`);
  if (localeStats.amountWordingChecks === 0) fail(`${locale} did not exercise borrower amount wording.`);
  if (localeStats.positions.some((count) => count === 0)) fail(`${locale} did not exercise every answer position.`);
}

console.log(JSON.stringify({
  status: "PASS_INT_CP001_MULTILINGUAL_V2_CASH_FLOW_DIRECTION",
  cpId: "INT-CP-001",
  editorialStandard: INT_CP001_MULTILINGUAL_V2_STANDARD,
  qlCount: 21,
  seedsPerQl: 80,
  localizedQuestions: stats.hi.generated + stats.pa.generated,
  englishParityChecks,
  v1ToV2InvariantChecks,
  deterministicChecks,
  cashFlowChecks,
  trapChecks,
  locales: {
    hi: {
      generated: stats.hi.generated,
      changedStems: stats.hi.changedStems,
      legacyContradictionsDetected: stats.hi.legacyContradictions,
      v2Contradictions: stats.hi.v2Contradictions,
      borrowerAmountWordingChecks: stats.hi.amountWordingChecks,
      directions: stats.hi.directions,
      scenarios: [...stats.hi.scenarios].sort(),
      distinctStems: stats.hi.stems.size,
      answerPositions: stats.hi.positions,
    },
    pa: {
      generated: stats.pa.generated,
      changedStems: stats.pa.changedStems,
      legacyContradictionsDetected: stats.pa.legacyContradictions,
      v2Contradictions: stats.pa.v2Contradictions,
      borrowerAmountWordingChecks: stats.pa.amountWordingChecks,
      directions: stats.pa.directions,
      scenarios: [...stats.pa.scenarios].sort(),
      distinctStems: stats.pa.stems.size,
      answerPositions: stats.pa.positions,
    },
  },
  releases: {
    hi: INT_CP001_HINDI_RELEASE_V2_ID,
    pa: INT_CP001_PUNJABI_RELEASE_V2_ID,
  },
  maturity: "MULTILINGUAL_EDITORIAL_PATCH_CANDIDATE",
  reviewStatus: "PENDING_MULTILINGUAL_REVIEW",
  localeReviewStatus: "PENDING_HUMAN_REVIEW",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));
