import {
  CP003_STEM_FAMILIES,
  amount,
  type Cp003QuestionContract,
} from "./cp003-exam-model";
import type { Cp003PresentationTable, Cp003RenderedPresentation } from "./cp003-exam-types";
import { presentationFor as basePresentationFor } from "./cp003-exam-presentation";
import {
  annualFactorText as legacyAnnualFactorText,
  moneyMath,
  ordinal,
  rateMath,
  tableMarkdown,
  type ResolvedState,
} from "./cp003-exam-support";
import { groundedAnnualFactorText } from "./cp003-grounded-factor-text";

function freezeTable(table: Cp003PresentationTable): Cp003PresentationTable {
  return Object.freeze({
    headers: Object.freeze([...table.headers]),
    rows: Object.freeze(table.rows.map((row) => Object.freeze([...row]))),
  });
}

function rendered(
  contract: Cp003QuestionContract,
  leadText: string,
  table: Cp003PresentationTable,
  prompt: string,
): Cp003RenderedPresentation {
  const frozenTable = freezeTable(table);
  const markdown = [leadText, "", tableMarkdown(frozenTable), "", prompt].join("\n");
  return Object.freeze({
    representation: contract.presentation.representation,
    stemFamilyId: contract.presentation.stemFamilyId,
    leadText,
    table: frozenTable,
    prompt,
    markdown,
  });
}

function prose(
  contract: Cp003QuestionContract,
  prompt: string,
): Cp003RenderedPresentation {
  return Object.freeze({
    representation: "STANDARD_PROSE",
    stemFamilyId: contract.presentation.stemFamilyId,
    prompt,
    markdown: prompt,
  });
}

function replaceFactorText(
  presentation: Cp003RenderedPresentation,
  resolved: ResolvedState,
): Cp003RenderedPresentation {
  const legacy = legacyAnnualFactorText(resolved.ratePercent);
  const grounded = groundedAnnualFactorText(resolved.ratePercent);
  if (legacy === grounded) return presentation;
  const legacyInner = legacy.slice(1, -1);
  const groundedInner = grounded.slice(1, -1);
  const replace = (value: string): string => value
    .split(legacy).join(grounded)
    .split(legacyInner).join(groundedInner);
  const table = presentation.table
    ? freezeTable({
        headers: presentation.table.headers.map(replace),
        rows: presentation.table.rows.map((row) => row.map(replace)),
      })
    : undefined;
  return Object.freeze({
    representation: presentation.representation,
    stemFamilyId: presentation.stemFamilyId,
    ...(presentation.leadText ? { leadText: replace(presentation.leadText) } : {}),
    ...(table ? { table } : {}),
    prompt: replace(presentation.prompt),
    markdown: replace(presentation.markdown),
  });
}

const yearsText = (years: number): string => `${years} year${years === 1 ? "" : "s"}`;

function stableIndex(source: string, length: number): number {
  let state = 2166136261;
  for (const character of source) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return (state >>> 0) % length;
}

function proseVariant(contract: Cp003QuestionContract): number {
  const families = CP003_STEM_FAMILIES[contract.qlId];
  const familyIndex = Math.max(0, families.indexOf(contract.presentation.stemFamilyId));
  return (stableIndex(`${contract.seed}:${contract.qlId}:exam-prose`, 4) + familyIndex) % 4;
}

function examProsePrompt(contract: Cp003QuestionContract, r: ResolvedState): string {
  const variant = proseVariant(contract);
  const previousBalance = amount(r.principal, r.ratePercent, Math.max(0, r.currentYear - 1));
  const options: readonly string[] = (() => {
    switch (contract.qlId) {
      case "INT-QL-053":
        return [
          `Find the amount on ${moneyMath(r.principal)} after ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum, compounded annually.`,
          `${moneyMath(r.principal)} is invested at ${rateMath(r.ratePercent)} compound interest per annum. What will it amount to after ${yearsText(r.years)}?`,
          `A fixed deposit of ${moneyMath(r.principal)} earns ${rateMath(r.ratePercent)} per annum, compounded yearly, for ${yearsText(r.years)}. Find its maturity value.`,
          `At annual compounding, a sum of ${moneyMath(r.principal)} grows for ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum. Calculate the final amount.`,
        ];
      case "INT-QL-054":
        return [
          `Find the compound interest on ${moneyMath(r.principal)} for ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum.`,
          `${moneyMath(r.principal)} is invested for ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum, compounded annually. How much interest is earned?`,
          `A deposit of ${moneyMath(r.principal)} is compounded annually at ${rateMath(r.ratePercent)} for ${yearsText(r.years)}. Calculate the compound interest only.`,
          `The amount on ${moneyMath(r.principal)} is to be found after ${yearsText(r.years)} at ${rateMath(r.ratePercent)} annual compound interest. Hence find the interest earned over the principal.`,
        ];
      case "INT-QL-055":
        return [
          `A sum amounts to ${moneyMath(r.amount)} in ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum, compounded annually. Find the original sum.`,
          `A fixed deposit matures to ${moneyMath(r.amount)} after ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum. What was the initial deposit?`,
          `At ${rateMath(r.ratePercent)} annual compound interest, an investment becomes ${moneyMath(r.amount)} in ${yearsText(r.years)}. Determine the principal.`,
          `The maturity value after ${yearsText(r.years)} is ${moneyMath(r.amount)} when interest is compounded annually at ${rateMath(r.ratePercent)}. Find the amount originally invested.`,
        ];
      case "INT-QL-056":
        return [
          `The compound interest for ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum is ${moneyMath(r.compoundInterest)}. Find the principal.`,
          `A sum earns ${moneyMath(r.compoundInterest)} as compound interest in ${yearsText(r.years)} at ${rateMath(r.ratePercent)} per annum. What was the sum?`,
          `At ${rateMath(r.ratePercent)} annual compounding, the interest accumulated in ${yearsText(r.years)} is ${moneyMath(r.compoundInterest)}. Determine the original investment.`,
          `The difference between the maturity amount and principal after ${yearsText(r.years)} is ${moneyMath(r.compoundInterest)} at ${rateMath(r.ratePercent)} compound interest. Find the principal.`,
        ];
      case "INT-QL-057":
        return [
          `${moneyMath(r.principal)} amounts to ${moneyMath(r.amount)} in ${yearsText(r.years)} at annual compound interest. Find the rate per annum.`,
          `At what annual compound rate will ${moneyMath(r.principal)} grow to ${moneyMath(r.amount)} in ${yearsText(r.years)}?`,
          `An investment increases from ${moneyMath(r.principal)} to ${moneyMath(r.amount)} in ${yearsText(r.years)}, with interest compounded yearly. Determine the annual rate.`,
          `The maturity value of ${moneyMath(r.principal)} after ${yearsText(r.years)} is ${moneyMath(r.amount)}. If compounding is annual, find the rate of interest.`,
        ];
      case "INT-QL-058":
        return [
          `In how many years will ${moneyMath(r.principal)} amount to ${moneyMath(r.amount)} at ${rateMath(r.ratePercent)} per annum, compounded annually?`,
          `${moneyMath(r.principal)} grows to ${moneyMath(r.amount)} at ${rateMath(r.ratePercent)} annual compound interest. Find the required time.`,
          `A deposit of ${moneyMath(r.principal)} earns ${rateMath(r.ratePercent)} per annum, compounded yearly, and matures at ${moneyMath(r.amount)}. After how many years does it mature?`,
          `At annual compounding of ${rateMath(r.ratePercent)}, determine the number of years needed for ${moneyMath(r.principal)} to become ${moneyMath(r.amount)}.`,
        ];
      case "INT-QL-059":
        return [
          `Find the interest earned during the ${ordinal(r.targetYear)} year on ${moneyMath(r.principal)} at ${rateMath(r.ratePercent)} per annum, compounded annually.`,
          `${moneyMath(r.principal)} is invested at ${rateMath(r.ratePercent)} annual compound interest. How much interest is credited in the ${ordinal(r.targetYear)} year alone?`,
          `For a principal of ${moneyMath(r.principal)} compounded yearly at ${rateMath(r.ratePercent)}, calculate the interest for the ${ordinal(r.targetYear)} year.`,
          `Determine only the ${ordinal(r.targetYear)} year's interest when ${moneyMath(r.principal)} is compounded annually at ${rateMath(r.ratePercent)}.`,
        ];
      case "INT-QL-060":
        return [
          `The interest earned during the ${ordinal(r.targetYear)} year is ${moneyMath(r.nthYearInterest)} at ${rateMath(r.ratePercent)} per annum, compounded annually. Find the principal.`,
          `At ${rateMath(r.ratePercent)} annual compound interest, the ${ordinal(r.targetYear)} year's interest is ${moneyMath(r.nthYearInterest)}. Determine the original sum.`,
          `A compound-interest investment earns ${moneyMath(r.nthYearInterest)} in the ${ordinal(r.targetYear)} year alone. If the rate is ${rateMath(r.ratePercent)} per annum, find the principal.`,
          `The interest credited in year ${r.targetYear} is ${moneyMath(r.nthYearInterest)} under annual compounding at ${rateMath(r.ratePercent)}. What sum was initially invested?`,
        ];
      case "INT-QL-061":
        return [
          `The interest earned during the ${ordinal(r.targetYear)} year on ${moneyMath(r.principal)} is ${moneyMath(r.nthYearInterest)}. Find the annual compound rate.`,
          `${moneyMath(r.principal)} earns ${moneyMath(r.nthYearInterest)} in the ${ordinal(r.targetYear)} year alone under annual compounding. Determine the rate per annum.`,
          `At an unknown annual compound rate, the ${ordinal(r.targetYear)} year's interest on ${moneyMath(r.principal)} is ${moneyMath(r.nthYearInterest)}. Find the rate.`,
          `The interest credited in year ${r.targetYear} on an original sum of ${moneyMath(r.principal)} is ${moneyMath(r.nthYearInterest)}. If compounding is annual, calculate the rate of interest.`,
        ];
      case "INT-QL-062":
        return [
          `An account balance is ${moneyMath(r.currentAmount)} at the end of year ${r.currentYear}. At ${rateMath(r.ratePercent)} annual compound interest, find the balance one year earlier.`,
          `After the ${ordinal(r.currentYear)} year, a compound-interest account shows ${moneyMath(r.currentAmount)}. If the annual rate is ${rateMath(r.ratePercent)}, what was the opening balance for that year?`,
          `A year-end balance of ${moneyMath(r.currentAmount)} includes one year's growth at ${rateMath(r.ratePercent)}. Find the immediately preceding year-end balance.`,
          `Working backward by one year, determine the balance before ${moneyMath(r.currentAmount)} grew at ${rateMath(r.ratePercent)} under annual compounding.`,
        ];
      case "INT-QL-063":
        return [
          `An account balance rises from ${moneyMath(previousBalance)} to ${moneyMath(r.currentAmount)} in one year. Find the annual compound rate.`,
          `During one year, a compound-interest account grows from ${moneyMath(previousBalance)} to ${moneyMath(r.currentAmount)}. Determine the rate per annum.`,
          `The opening and closing balances for a year are ${moneyMath(previousBalance)} and ${moneyMath(r.currentAmount)} respectively. Find the annual rate of increase.`,
          `A balance of ${moneyMath(previousBalance)} becomes ${moneyMath(r.currentAmount)} after one annual interest credit. Calculate the compound rate.`,
        ];
      case "INT-QL-064":
        return [
          `A sum amounts to ${moneyMath(r.currentAmount)} after ${yearsText(r.currentYear)} and ${moneyMath(r.nextAmount)} after ${yearsText(r.currentYear + 1)}. Find the original sum.`,
          `The year-end balances of an investment are ${moneyMath(r.currentAmount)} after year ${r.currentYear} and ${moneyMath(r.nextAmount)} after year ${r.currentYear + 1}. Determine the principal.`,
          `An annually compounded sum has consecutive balances ${moneyMath(r.currentAmount)} and ${moneyMath(r.nextAmount)} at the ends of years ${r.currentYear} and ${r.currentYear + 1}. Find the amount initially invested.`,
          `Using the amounts ${moneyMath(r.currentAmount)} after ${yearsText(r.currentYear)} and ${moneyMath(r.nextAmount)} one year later, calculate the original principal.`,
        ];
      case "INT-QL-065":
        return [
          `${moneyMath(r.principal)} is invested at ${rateMath(r.ratePercent)} per annum, compounded annually. Find the difference between the amounts after ${yearsText(r.earlierYear)} and ${yearsText(r.laterYear)}.`,
          `At ${rateMath(r.ratePercent)} annual compound interest, by how much does the amount on ${moneyMath(r.principal)} increase between the ends of years ${r.earlierYear} and ${r.laterYear}?`,
          `Calculate the difference between the maturity values of ${moneyMath(r.principal)} after ${yearsText(r.earlierYear)} and ${yearsText(r.laterYear)} at ${rateMath(r.ratePercent)} compound interest.`,
          `A sum of ${moneyMath(r.principal)} is compounded annually at ${rateMath(r.ratePercent)}. Find the additional amount accumulated from year ${r.earlierYear} to year ${r.laterYear}.`,
        ];
      case "INT-QL-066":
        return [
          `At ${rateMath(r.ratePercent)} annual compound interest, the interest during the ${ordinal(r.earlierYear)} year is ${moneyMath(r.earlierInterest)}. Find the interest during the ${ordinal(r.laterYear)} year.`,
          `The ${ordinal(r.earlierYear)} year's interest is ${moneyMath(r.earlierInterest)} and interest is compounded annually at ${rateMath(r.ratePercent)}. Calculate the interest in the ${ordinal(r.laterYear)} year.`,
          `In a compound-interest investment, yearly interest grows at ${rateMath(r.ratePercent)} per annum. If the interest for year ${r.earlierYear} is ${moneyMath(r.earlierInterest)}, find it for year ${r.laterYear}.`,
          `An account earns ${moneyMath(r.earlierInterest)} during the ${ordinal(r.earlierYear)} year. At ${rateMath(r.ratePercent)} annual compounding, how much interest will it earn during the ${ordinal(r.laterYear)} year?`,
        ];
    }
  })();
  return options[variant] ?? options[0]!;
}

export function presentationFor(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
): Cp003RenderedPresentation {
  const representation = contract.presentation.representation;

  if (representation === "STANDARD_PROSE") {
    return prose(contract, examProsePrompt(contract, resolved));
  }

  if (contract.qlId === "INT-QL-056" && representation === "GROWTH_RATIO") {
    return rendered(
      contract,
      "Use the exact annual multiplier and duration to obtain the compound-interest factor.",
      {
        headers: ["Annual multiplier", "Time", "Given compound interest", "Principal"],
        rows: [[
          groundedAnnualFactorText(resolved.ratePercent),
          yearsText(resolved.years),
          moneyMath(resolved.compoundInterest),
          "?",
        ]],
      },
      "Find the principal.",
    );
  }

  if (contract.qlId === "INT-QL-064" && representation === "GROWTH_RATIO") {
    return rendered(
      contract,
      "Use the two consecutive year-end balances to find the one-year multiplier and reconstruct the original sum.",
      {
        headers: ["Observation", "Balance"],
        rows: [
          [`Amount after ${yearsText(resolved.currentYear)}`, moneyMath(resolved.currentAmount)],
          [`Amount after ${yearsText(resolved.currentYear + 1)}`, moneyMath(resolved.nextAmount)],
          ["Original principal", "?"],
        ],
      },
      "Find the original principal.",
    );
  }

  if (contract.qlId === "INT-QL-065" && representation === "ACCOUNT_TABLE") {
    return rendered(
      contract,
      "Use the investment terms to compare the two maturity dates.",
      {
        headers: ["Investment", "Annual rate", "Earlier duration", "Later duration"],
        rows: [[
          moneyMath(resolved.principal),
          rateMath(resolved.ratePercent),
          yearsText(resolved.earlierYear),
          yearsText(resolved.laterYear),
        ]],
      },
      `Find the difference between the amounts after $${resolved.earlierYear}$ and $${resolved.laterYear}$ years.`,
    );
  }

  if (representation !== "BALANCE_LEDGER") {
    return replaceFactorText(basePresentationFor(contract, resolved), resolved);
  }

  switch (contract.qlId) {
    case "INT-QL-053":
      return rendered(
        contract,
        `Interest is compounded annually at ${rateMath(resolved.ratePercent)}. Complete the balance ledger.`,
        {
          headers: ["Year", "Year-end balance"],
          rows: [
            ["0", moneyMath(resolved.principal)],
            [String(resolved.years), "?"],
          ],
        },
        `Find the amount after $${resolved.years}$ years.`,
      );

    case "INT-QL-054":
      return rendered(
        contract,
        `Interest is compounded annually at ${rateMath(resolved.ratePercent)}. Complete the balance ledger and find the total interest earned.`,
        {
          headers: ["Year", "Year-end balance"],
          rows: [
            ["0", moneyMath(resolved.principal)],
            [String(resolved.years), "?"],
          ],
        },
        `Find the compound interest earned in ${yearsText(resolved.years)}.`,
      );

    case "INT-QL-058":
      return rendered(
        contract,
        `The account grows at ${rateMath(resolved.ratePercent)} per annum, compounded annually. The maturity year is missing.`,
        {
          headers: ["Year", "Year-end balance"],
          rows: [
            ["0", moneyMath(resolved.principal)],
            ["?", moneyMath(resolved.amount)],
          ],
        },
        "Find the number of years.",
      );

    case "INT-QL-065":
      return rendered(
        contract,
        `${moneyMath(resolved.principal)} is invested at ${rateMath(resolved.ratePercent)} per annum, compounded annually. Calculate the missing change between the two year-end balances.`,
        {
          headers: ["Year", "Year-end balance"],
          rows: [
            [String(resolved.earlierYear), "to be calculated"],
            [String(resolved.laterYear), "to be calculated"],
            ["Difference", "?"],
          ],
        },
        `Find the difference between the amounts after $${resolved.earlierYear}$ and $${resolved.laterYear}$ years.`,
      );

    case "INT-QL-066":
      return rendered(
        contract,
        `The yearly-interest sequence has annual multiplier ${groundedAnnualFactorText(resolved.ratePercent)}. Complete the ledger.`,
        {
          headers: ["Year", "Interest earned"],
          rows: [
            [ordinal(resolved.earlierYear), moneyMath(resolved.earlierInterest)],
            [ordinal(resolved.laterYear), "?"],
          ],
        },
        `Find the interest earned during the ${ordinal(resolved.laterYear)} year.`,
      );

    default:
      return replaceFactorText(basePresentationFor(contract, resolved), resolved);
  }
}
