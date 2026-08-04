import { amount, type Cp003QuestionContract } from "./cp003-exam-model";
import type { Cp003RenderedPresentation, Cp003StudentExplanation } from "./cp003-exam-types";
import {
  annualFactorText as legacyAnnualFactorText,
  moneyMath,
  ordinal,
  rateMath,
  type ResolvedState,
} from "./cp003-exam-support";
import type { Cp003SolutionTrace } from "./cp003-grounded-solution-trace";
import { groundedAnnualFactorText } from "./cp003-grounded-factor-text";

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, output));
  return output;
}

function requireVisible(markdown: string, expected: string, prefix: string, label: string): void {
  if (!markdown.includes(expected)) throw new Error(`${prefix}: displayed question omits ${label}`);
}

function hasOperation(trace: Cp003SolutionTrace, operationId: string): boolean {
  return trace.coreSteps.some((step) => step.operationId === operationId);
}

const yearsText = (years: number): string => `${years} year${years === 1 ? "" : "s"}`;

export function assertCp003PresentationGrounding(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
  presentation: Cp003RenderedPresentation,
  trace: Cp003SolutionTrace,
  explanation: Cp003StudentExplanation,
): void {
  const prefix = `${contract.qlId}/${contract.presentation.representation}`;
  const markdown = presentation.markdown;
  const representation = contract.presentation.representation;
  const groundedFactor = groundedAnnualFactorText(resolved.ratePercent);
  const annualFactorToken = groundedFactor.slice(1, -1);

  if (contract.qlId === "INT-QL-053" && representation === "BALANCE_LEDGER") {
    requireVisible(markdown, moneyMath(resolved.principal), prefix, "principal");
    requireVisible(markdown, rateMath(resolved.ratePercent), prefix, "annual rate");
    requireVisible(markdown, String(resolved.years), prefix, "target year");
  }

  if (contract.qlId === "INT-QL-054" && representation === "BALANCE_LEDGER") {
    requireVisible(markdown, moneyMath(resolved.principal), prefix, "principal");
    requireVisible(markdown, rateMath(resolved.ratePercent), prefix, "annual rate");
    requireVisible(markdown, String(resolved.years), prefix, "duration");
  }

  if (contract.qlId === "INT-QL-055" && representation === "GROWTH_RATIO") {
    requireVisible(markdown, annualFactorToken, prefix, "annual multiplier");
    requireVisible(markdown, moneyMath(resolved.amount), prefix, "final amount");
    requireVisible(markdown, String(resolved.years), prefix, "duration");
    if (hasOperation(trace, "ANNUAL_FACTOR")) throw new Error(`${prefix}: trace re-derives a displayed annual multiplier from a hidden rate`);
  }

  if (contract.qlId === "INT-QL-056" && representation === "GROWTH_RATIO") {
    requireVisible(markdown, annualFactorToken, prefix, "annual multiplier");
    requireVisible(markdown, moneyMath(resolved.compoundInterest), prefix, "compound interest");
    if (hasOperation(trace, "ANNUAL_FACTOR")) throw new Error(`${prefix}: trace re-derives a displayed CI factor from a hidden rate`);
  }

  if (contract.qlId === "INT-QL-057") {
    const operations = trace.coreSteps.map((step) => step.operationId).join("|");
    if (operations !== "DIVIDE|MATCH_POWER|RATE_FROM_FACTOR") {
      throw new Error(`${prefix}: inverse-rate trace remains circular (${operations})`);
    }
  }

  if (contract.qlId === "INT-QL-058") {
    requireVisible(markdown, moneyMath(resolved.principal), prefix, "principal");
    requireVisible(markdown, moneyMath(resolved.amount), prefix, "final amount");
    requireVisible(markdown, rateMath(resolved.ratePercent), prefix, "annual rate");
  }

  if (contract.qlId === "INT-QL-059" && representation === "BALANCE_LEDGER") {
    const openingBalance = amount(resolved.principal, resolved.ratePercent, resolved.targetYear - 1);
    requireVisible(markdown, moneyMath(openingBalance), prefix, "opening balance of the required year");
    requireVisible(markdown, rateMath(resolved.ratePercent), prefix, "annual rate");
    requireVisible(markdown, ordinal(resolved.targetYear), prefix, "required year");
  }

  if (contract.qlId === "INT-QL-061") {
    if (!/answer choices/iu.test(explanation.keyIdea)) throw new Error(`${prefix}: option-substitution method is not disclosed`);
    if (!explanation.steps[0]?.startsWith("Check the option")) throw new Error(`${prefix}: explanation states the unknown rate before identifying it as an option check`);
    if (explanation.verification) throw new Error(`${prefix}: option check is duplicated as a verification section`);
  }

  if (contract.qlId === "INT-QL-064" && representation === "GROWTH_RATIO") {
    requireVisible(markdown, `Amount after ${yearsText(resolved.currentYear)}`, prefix, "earlier observation year");
    requireVisible(markdown, `Amount after ${yearsText(resolved.currentYear + 1)}`, prefix, "later observation year");
    requireVisible(markdown, moneyMath(resolved.currentAmount), prefix, "earlier observed amount");
    requireVisible(markdown, moneyMath(resolved.nextAmount), prefix, "later observed amount");
  }

  if (contract.qlId === "INT-QL-065") {
    requireVisible(markdown, moneyMath(resolved.principal), prefix, "principal");
    requireVisible(markdown, rateMath(resolved.ratePercent), prefix, "annual rate");
    requireVisible(markdown, String(resolved.earlierYear), prefix, "earlier year");
    requireVisible(markdown, String(resolved.laterYear), prefix, "later year");
  }

  if (contract.qlId === "INT-QL-066") {
    requireVisible(markdown, moneyMath(resolved.earlierInterest), prefix, "earlier-year interest");
    const rateVisible = markdown.includes(rateMath(resolved.ratePercent));
    const factorVisible = markdown.includes(annualFactorToken);
    if (!rateVisible && !factorVisible) throw new Error(`${prefix}: displayed question omits the annual rate or multiplier`);
    requireVisible(markdown, ordinal(resolved.laterYear), prefix, "later year");
    if (representation === "GROWTH_RATIO") {
      requireVisible(markdown, String(resolved.laterYear - resolved.earlierYear), prefix, "year gap");
    } else {
      requireVisible(markdown, ordinal(resolved.earlierYear), prefix, "earlier year");
    }
  }

  if (trace.answerSemantic !== "RATE_PERCENT") {
    const explanationText = collectStrings(explanation).join("\n");
    const rateToken = rateMath(resolved.ratePercent).slice(1, -1);
    if (explanationText.includes(rateToken) && !markdown.includes(rateToken) && !markdown.includes(annualFactorToken)) {
      throw new Error(`${prefix}: explanation uses an annual rate absent from the displayed givens`);
    }
  }

  const legacyFactor = legacyAnnualFactorText(resolved.ratePercent);
  if (legacyFactor !== groundedFactor) {
    const learnerText = collectStrings([presentation, explanation]).join("\n");
    if (learnerText.includes(legacyFactor)) throw new Error(`${prefix}: truncated repeating decimal presented as an exact annual factor`);
  }
}
