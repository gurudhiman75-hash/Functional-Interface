import type { IntCp003GeneratedQuestion, IntCp003OptionAudit } from "./int-001-cp003-final-runtime";
import { LETTERS, TRAP_CODES, add, div, examStem, moneyPlain, mul, optionMath, rat, stateOf, sub, type EditorialState, type IntCp003EditorialReviewQuestion } from "./cp003-editorial-base";
import { explanationSections } from "./cp003-editorial-sections";

function trapExplanation(question: IntCp003GeneratedQuestion, state: EditorialState, option: IntCp003OptionAudit): string {
  const text = optionMath(option.text);
  if (option.misconceptionId === "CORRECT") {
    return `**${text} — Correct.** It satisfies the exact compound-interest relation and the independent year-by-year recurrence.`;
  }

  const p = state.principal;
  const r = state.ratePercent;
  const n = state.years;
  const tag = TRAP_CODES[option.misconceptionId] ?? `${option.misconceptionId}_TRAP`;
  const detail: Readonly<Record<string, string>> = {
    RETURN_INTEREST: `Reports only $A-P=${state.maturityAmount.numerator}-${p.numerator}=${moneyPlain(state.compoundInterest)}$ instead of the maturity amount.`,
    USE_SI: `Uses simple interest: $P(1+nr/100)=${moneyPlain(mul(p, add(rat(1), div(mul(r, rat(n)), rat(100)))))}$.`,
    ONE_YEAR: `Applies the annual factor only once: $P(1+r/100)=${moneyPlain(mul(p, state.annualFactor))}$.`,
    RETURN_AMOUNT: `Reports the maturity amount $A=${moneyPlain(state.maturityAmount)}$ instead of compound interest.`,
    FIRST_YEAR_ONLY: `Uses only first-year interest $P\\times r/100=${moneyPlain(mul(p, div(r, rat(100))))}$.`,
    COPY_AMOUNT: "Copies the given maturity amount without reversing the compound multiplier.",
    REVERSE_SI: "Reverses the amount using $1+nr/100$ instead of $(1+r/100)^n$.",
    ONE_FEWER_YEAR: `Reverses only $${Math.max(1, n - 1)}$ period(s), leaving one annual factor unreversed.`,
    COPY_INTEREST: "Copies the given compound interest and treats it as the principal.",
    SI_INVERSE: "Uses $P=I/(nr/100)$, which is valid for simple interest, not compound interest.",
    SIMPLE_RATE: "Divides total percentage growth equally across the years, ignoring compounding.",
    TOTAL_GROWTH: "Reports total multi-year growth as though it were the annual rate.",
    NEARBY_RATE: "Selects a nearby rate without verifying the exact compound factor.",
    SIMPLE_TIME: "Uses linear growth to obtain time, ignoring repeated multiplication.",
    ONE_EXTRA_YEAR: "Applies one extra annual growth period.",
    TWO_EXTRA_YEARS: "Applies two extra annual growth periods.",
    FIRST_YEAR: `Uses first-year interest $P\\times r/100=${moneyPlain(mul(p, div(r, rat(100))))}$ instead of the requested year.`,
    PREVIOUS_YEAR: `Uses the interest from year $${Math.max(1, state.specifiedYear - 1)}$ instead of year $${state.specifiedYear}$.`,
    NEXT_YEAR: `Uses the interest from year $${state.specifiedYear + 1}$ instead of year $${state.specifiedYear}$.`,
    CUMULATIVE: "Reports cumulative compound interest instead of one specified year's interest.",
    FIRST_YEAR_INVERSE: "Treats the stated later-year interest as first-year interest and divides only by $r/100$.",
    EXTRA_FACTOR: "Reverses one more annual growth factor than the year position requires.",
    SIMPLE_MULTIPLIER: "Uses a simple year multiplier instead of the compound yearly-interest factor.",
    FIRST_YEAR_RATE: "Calculates $J_k/P\\times100$ as though the observed interest were from the first year.",
    LOW_RATE: "Uses a lower nearby rate; exact substitution does not reproduce the stated yearly interest.",
    HIGH_RATE: "Uses a higher nearby rate; exact substitution does not reproduce the stated yearly interest.",
    COPY_LATER: "Copies the later balance instead of moving one year backwards.",
    SUBTRACT_RATE: "Subtracts the rate percentage instead of dividing by the annual growth factor.",
    DECAY_INVERSE: "Uses a depreciation-style inverse $1-r/100$ instead of $1+r/100$.",
    LATER_BASE: "Divides the increase by the closing balance; the earlier balance is the correct base.",
    CUMULATIVE_RATE: "Uses total growth from the principal as a one-year rate.",
    COPY_OBSERVATION: "Treats an observed later-year amount as the original principal.",
    EXTRA_YEAR: "Moves back one year too many when reconstructing the principal.",
    FEWER_YEAR: "Moves back too few years, leaving one growth factor in the answer.",
    RETURN_ANNUAL_INCREASE: "Treats the increase between consecutive balances as the principal.",
    LATER_CI: "Reports cumulative interest at the later date, not the difference between the amounts.",
    EARLIER_CI: "Reports cumulative interest at the earlier date, not the requested difference.",
    SI_TO_LATER: "Uses simple interest up to the later date instead of annual compounding.",
    CONSTANT_INTEREST: "Assumes yearly interest remains constant as in simple interest.",
    INCREASE_ONLY: `Reports only the increase $J_l-J_e=${moneyPlain(sub(state.laterYearInterest, state.earlierYearInterest))}$ instead of the later year's full interest.`,
    EXTRA_GAP: "Applies one extra yearly growth step, producing the following year's interest.",
  };
  return `**${text} — Incorrect.** ${detail[option.misconceptionId] ?? option.explanation} \`[${tag}]\``;
}

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) freezeDeep(nested);
    Object.freeze(value);
  }
  return value;
}

export function buildIntCp003EditorialReview(
  question: IntCp003GeneratedQuestion,
): IntCp003EditorialReviewQuestion {
  const state = stateOf(question);
  const section = explanationSections(question, state);
  const options = question.options.map(optionMath);
  const correctAnswer = `${LETTERS[question.correctIndex]}. ${options[question.correctIndex]}`;
  const optionAnalysis = question.optionAudit.map((option) => trapExplanation(question, state, option));

  return freezeDeep({
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-003",
    qlId: question.qlId,
    solveContract: question.solveContract,
    seed: question.seed,
    difficulty: question.difficulty,
    representation: question.representation,
    answerSemantic: question.answerSemantic,
    stem: examStem(question, state),
    options,
    correctIndex: question.correctIndex,
    correctAnswer,
    explanation: {
      ...section,
      optionAnalysis,
    },
    optionAudit: question.optionAudit,
    hiddenState: question.hiddenState,
    mathematicalFingerprint: question.mathematicalFingerprint,
    editorialStatus: "REMEDIATED_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
}
