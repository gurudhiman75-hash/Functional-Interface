import type { Cp003QuestionContract } from "./cp003-exam-model";
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

function replaceFactorText(
  presentation: Cp003RenderedPresentation,
  resolved: ResolvedState,
): Cp003RenderedPresentation {
  const legacy = legacyAnnualFactorText(resolved.ratePercent);
  const grounded = groundedAnnualFactorText(resolved.ratePercent);
  if (legacy === grounded) return presentation;
  const replace = (value: string): string => value.split(legacy).join(grounded);
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

export function presentationFor(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
): Cp003RenderedPresentation {
  const representation = contract.presentation.representation;

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
