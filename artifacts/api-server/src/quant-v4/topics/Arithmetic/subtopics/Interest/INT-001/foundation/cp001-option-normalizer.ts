import { formatIntCp001Answer } from "./cp001-presentation";
import {
  addRational,
  compareRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import type {
  IntCp001MisconceptionId,
  IntCp001OptionAudit,
  IntCp001PrototypeParameters,
  IntCp001SolveResult,
} from "./types";

interface OptionPackage {
  options: string[];
  optionAudit: IntCp001OptionAudit[];
  correctIndex: number;
}

function usesMoneySemantic(solution: IntCp001SolveResult): boolean {
  return solution.semantic === "SIMPLE_INTEREST"
    || solution.semantic === "TOTAL_AMOUNT"
    || solution.semantic === "PRINCIPAL"
    || solution.semantic === "ANNUAL_INTEREST";
}

export function normaliseIntCp001MoneyOptions(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
  optionPackage: OptionPackage,
): OptionPackage {
  if (!usesMoneySemantic(solution)) return optionPackage;
  if (!isWholeRational(solution.value)) {
    throw new Error(`${parameters.prototypeId} produced a fractional money answer.`);
  }

  const state = parameters.hiddenState;
  const oneYearInterest = multiplyRational(state.principal, state.annualRate);
  const rawPercentProduct = multiplyRational(
    multiplyRational(state.principal, state.annualRatePercent),
    state.timeYears,
  );
  const fallbackValues: Array<{
    result: IntCp001SolveResult;
    misconceptionId: IntCp001MisconceptionId;
  }> = [
    {
      result: { semantic: solution.semantic, value: state.principal },
      misconceptionId: "USED_INTEREST_AS_PRINCIPAL",
    },
    {
      result: { semantic: solution.semantic, value: state.simpleInterest },
      misconceptionId: "TOTAL_INTEREST_REPORTED",
    },
    {
      result: { semantic: solution.semantic, value: state.amount },
      misconceptionId: "RETURNED_AMOUNT_INSTEAD_OF_INTEREST",
    },
    {
      result: { semantic: solution.semantic, value: oneYearInterest },
      misconceptionId: "OMITTED_TIME_FACTOR",
    },
    {
      result: { semantic: solution.semantic, value: rawPercentProduct },
      misconceptionId: "OMITTED_DIVIDE_BY_100",
    },
    {
      result: {
        semantic: solution.semantic,
        value: addRational(state.principal, oneYearInterest),
      },
      misconceptionId: "OMITTED_TIME_FACTOR",
    },
  ];

  const optionAudit = optionPackage.optionAudit.map((option) => ({ ...option }));
  const used = new Set(
    optionAudit
      .filter((option) => isWholeRational(option.result.value))
      .map((option) => rationalKey(option.result.value)),
  );
  used.add(rationalKey(solution.value));

  for (const [index, option] of optionAudit.entries()) {
    if (index === optionPackage.correctIndex || isWholeRational(option.result.value)) continue;
    const replacement = fallbackValues.find((candidate) =>
      compareRational(candidate.result.value, rational(0)) > 0
      && isWholeRational(candidate.result.value)
      && !used.has(rationalKey(candidate.result.value))
    );
    if (!replacement) {
      throw new Error(`${parameters.prototypeId} could not replace a fractional money distractor.`);
    }
    used.add(rationalKey(replacement.result.value));
    optionAudit[index] = {
      text: formatIntCp001Answer(replacement.result),
      result: replacement.result,
      misconceptionId: replacement.misconceptionId,
    };
  }

  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex: optionPackage.correctIndex,
  };
}
