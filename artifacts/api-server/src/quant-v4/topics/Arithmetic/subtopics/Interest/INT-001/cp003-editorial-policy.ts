import type { Cp003QuestionContract } from "./cp003-exam-model";
import type { Cp003PresentationTable, Cp003RenderedPresentation } from "./cp003-exam-types";
import {
  moneyMath,
  ordinal,
  rateMath,
  tableMarkdown,
  type ResolvedState,
} from "./cp003-exam-support";

const REALISTIC_BANK_RATE_IDS = new Set(["R04", "R05", "R0625", "R08", "R10", "R125"]);
const BANKING_WORDS = /\b(?:bank|banking|fixed[- ]deposit|deposit|account)\b/iu;
const METHOD_HINTS = /\b(?:use .*? to|working backward|work backwards|match the|reconstruct|infer the|reverse the|annual multiplier|compound-interest factor|one-year ratio|total growth ratio)\b/iu;
const OUT_OF_SCOPE_CP_LANGUAGE = /\b(?:half[- ]yearly|quarterly|monthly compounding|depreciation|population|successive rates|different rates in different years|simple-interest difference|ci-si difference)\b/iu;

const yearsText = (years: number): string => `${years} year${years === 1 ? "" : "s"}`;

function freezeTable(table: Cp003PresentationTable): Cp003PresentationTable {
  return Object.freeze({
    headers: Object.freeze([...table.headers]),
    rows: Object.freeze(table.rows.map((row) => Object.freeze([...row]))),
  });
}

function rebuild(
  presentation: Cp003RenderedPresentation,
  leadText: string | undefined,
  table: Cp003PresentationTable | undefined,
  prompt: string,
): Cp003RenderedPresentation {
  const frozenTable = table ? freezeTable(table) : undefined;
  const markdown = frozenTable
    ? [leadText ?? "", "", tableMarkdown(frozenTable), "", prompt].filter((part, index) => index !== 0 || part.length > 0).join("\n")
    : prompt;
  return Object.freeze({
    representation: presentation.representation,
    stemFamilyId: presentation.stemFamilyId,
    ...(leadText ? { leadText } : {}),
    ...(frozenTable ? { table: frozenTable } : {}),
    prompt,
    markdown,
  });
}

function neutralizeMethodHints(text: string): string {
  return text
    .replace("Use the exact annual multiplier and duration to obtain the compound-interest factor.", "The annual rate, time and compound interest are given below.")
    .replace("Use the two consecutive year-end balances to find the one-year multiplier and reconstruct the original sum.", "Two consecutive year-end balances are given below.")
    .replace("Use the investment terms to compare the two maturity dates.", "The investment details for the two dates are given below.")
    .replace("Use the annual growth information shown below.", "The investment details are shown below.")
    .replace("The compound-interest factor is provided, but the original sum is missing.", "The annual rate, time and compound interest are shown below.")
    .replace("The total growth ratio is shown below.", "The original amount, final amount and time are shown below.")
    .replace("Match the observed multiplier with repeated annual growth.", "The original amount, final amount and annual rate are shown below.")
    .replace("Use the observed yearly interest to reconstruct the opening principal.", "The interest earned in one particular year is shown below.")
    .replace("Use the observed yearly interest.", "The yearly interest details are shown below.")
    .replace("One entry is missing from the inverse-interest record.", "One entry is missing from the yearly-interest record.")
    .replace("Use the year-specific interest observation.", "The yearly interest details are shown below.")
    .replace("Reverse the final transition in the annual balance ledger.", "One balance is missing from the annual record.")
    .replace("Infer the annual rate from two consecutive bank-statement balances.", "Two consecutive balances are shown below.")
    .replace("Use the one-year opening and closing balances.", "The opening and closing balances for one year are shown below.")
    .replace("Use the consecutive-balance ratio to reconstruct the original sum.", "Two consecutive year-end balances are shown below.")
    .replace("Use the account observations.", "The account details are shown below.")
    .replace("Working backward by one year, determine", "Determine");
}

function neutralizeBankingLanguage(text: string): string {
  return text
    .replace(/fixed[- ]deposit statement/giu, "investment record")
    .replace(/deposit statement/giu, "investment record")
    .replace(/bank statement/giu, "balance record")
    .replace(/bank-statement/giu, "balance-record")
    .replace(/fixed[- ]deposit/giu, "investment")
    .replace(/opening deposit/giu, "starting sum")
    .replace(/initial deposit/giu, "original sum")
    .replace(/maturity credit/giu, "final amount")
    .replace(/deposited initially/giu, "invested initially")
    .replace(/compound-interest account/giu, "compound-interest investment")
    .replace(/account balance/giu, "balance")
    .replace(/account record/giu, "investment record")
    .replace(/\bdeposit\b/giu, "investment")
    .replace(/\baccount\b/giu, "investment");
}

function structuredWithoutGivenMethod(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
  presentation: Cp003RenderedPresentation,
): Cp003RenderedPresentation | null {
  if (presentation.representation !== "GROWTH_RATIO") return null;

  switch (contract.qlId) {
    case "INT-QL-055":
      return rebuild(
        presentation,
        "The final amount and investment terms are shown below.",
        {
          headers: ["Annual rate", "Time", "Final amount", "Original sum"],
          rows: [[rateMath(resolved.ratePercent), yearsText(resolved.years), moneyMath(resolved.amount), "?"]],
        },
        "Find the original sum.",
      );

    case "INT-QL-056":
      return rebuild(
        presentation,
        "The annual rate, time and compound interest are shown below.",
        {
          headers: ["Annual rate", "Time", "Compound interest", "Principal"],
          rows: [[rateMath(resolved.ratePercent), yearsText(resolved.years), moneyMath(resolved.compoundInterest), "?"]],
        },
        "Find the principal.",
      );

    case "INT-QL-057":
      return rebuild(
        presentation,
        "The original amount, final amount and time are shown below.",
        {
          headers: ["Original amount", "Final amount", "Time", "Annual rate"],
          rows: [[moneyMath(resolved.principal), moneyMath(resolved.amount), yearsText(resolved.years), "?"]],
        },
        "Find the annual compound rate.",
      );

    case "INT-QL-058":
      return rebuild(
        presentation,
        "The original amount, final amount and annual rate are shown below.",
        {
          headers: ["Original amount", "Annual rate", "Final amount", "Time"],
          rows: [[moneyMath(resolved.principal), rateMath(resolved.ratePercent), moneyMath(resolved.amount), "?"]],
        },
        "Find the number of years.",
      );

    case "INT-QL-061":
      return rebuild(
        presentation,
        "The interest earned in one particular year is shown below.",
        {
          headers: ["Original sum", "Year", "Interest in that year", "Annual rate"],
          rows: [[moneyMath(resolved.principal), ordinal(resolved.targetYear), moneyMath(resolved.nthYearInterest), "?"]],
        },
        "Find the annual compound rate.",
      );

    case "INT-QL-064":
      return rebuild(
        presentation,
        "Two consecutive year-end balances are shown below.",
        {
          headers: ["Observation", "Balance"],
          rows: [
            [`Amount after ${yearsText(resolved.currentYear)}`, moneyMath(resolved.currentAmount)],
            [`Amount after ${yearsText(resolved.currentYear + 1)}`, moneyMath(resolved.nextAmount)],
            ["Original sum", "?"],
          ],
        },
        "Find the original sum.",
      );

    case "INT-QL-066":
      return rebuild(
        presentation,
        "The interest earned in one year and the annual rate are shown below.",
        {
          headers: ["Earlier year", "Interest in that year", "Annual rate", "Later year", "Interest required"],
          rows: [[
            ordinal(resolved.earlierYear),
            moneyMath(resolved.earlierInterest),
            rateMath(resolved.ratePercent),
            ordinal(resolved.laterYear),
            "?",
          ]],
        },
        `Find the interest earned during the ${ordinal(resolved.laterYear)} year.`,
      );

    default:
      return null;
  }
}

export function isCp003BankContextRealistic(contract: Cp003QuestionContract): boolean {
  return contract.presentation.contextClass !== "BANK_DEPOSIT" || REALISTIC_BANK_RATE_IDS.has(contract.rateProfileId);
}

export function refineCp003Presentation(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
  original: Cp003RenderedPresentation,
): Cp003RenderedPresentation {
  const structured = structuredWithoutGivenMethod(contract, resolved, original);
  const source = structured ?? original;
  const highRateForBanking = !REALISTIC_BANK_RATE_IDS.has(contract.rateProfileId);
  const clean = (value: string): string => {
    const withoutHints = neutralizeMethodHints(value);
    return highRateForBanking ? neutralizeBankingLanguage(withoutHints) : withoutHints;
  };

  const table = source.table
    ? {
        headers: source.table.headers.map(clean),
        rows: source.table.rows.map((row) => row.map(clean)),
      }
    : undefined;
  let leadText = source.leadText ? clean(source.leadText) : undefined;
  const prompt = clean(source.prompt);

  if (contract.qlId === "INT-QL-066" && source.representation === "BALANCE_LEDGER" && table) {
    leadText = `The interest earned in one year is shown below. Interest is compounded annually at ${rateMath(resolved.ratePercent)}.`;
  }

  return rebuild(source, leadText, table, prompt);
}

export function assertCp003ExamStemStyle(
  contract: Cp003QuestionContract,
  presentation: Cp003RenderedPresentation,
): void {
  const text = presentation.markdown;
  if (!REALISTIC_BANK_RATE_IDS.has(contract.rateProfileId) && BANKING_WORDS.test(text)) {
    throw new Error(`${contract.qlId}: unrealistic banking language used with ${contract.rateProfileId}`);
  }
  if (METHOD_HINTS.test(text)) {
    throw new Error(`${contract.qlId}: exam stem reveals the solving method`);
  }
  if (OUT_OF_SCOPE_CP_LANGUAGE.test(text)) {
    throw new Error(`${contract.qlId}: question drifted outside the annual-compounding CP domain`);
  }
}
