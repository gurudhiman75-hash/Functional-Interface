import {
  brokenAmountForState,
  deepFreeze,
  type Cp004MathematicalState,
  type Cp004Representation,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";

type Presentation = Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>;
type Row = readonly [string, string];

function yearsText(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

function durationText(state: Cp004MathematicalState): string {
  return `${yearsText(state.fullYears)} and ${state.tailMonths} months`;
}

function treatmentText(state: Cp004MathematicalState): string {
  return `Compound annually for the first ${yearsText(state.fullYears)}; for the remaining ${state.tailMonths} months, use simple interest on the balance after ${yearsText(state.fullYears)}`;
}

function table(rows: readonly Row[], prompt: string): string {
  return [
    "The details are given below.",
    "",
    "| Detail | Value |",
    "| --- | --- |",
    ...rows.map(([label, value]) => `| ${label} | ${value} |`),
    "",
    prompt,
  ].join("\n");
}

export function finalizeCp004TableLanguageV5(
  state: Cp004MathematicalState,
  presentation: Presentation,
): Presentation {
  if (presentation.representation !== "TERMS_TABLE") return presentation;
  if (!["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(state.qlId)) return presentation;

  const principal = moneyText(state.principal);
  const finalAmount = moneyText(brokenAmountForState(state));
  const rate = percentText(state.nominalAnnualRatePercent);
  let rows: readonly Row[];
  let prompt: string;

  switch (state.qlId) {
    case "INT-QL-079":
      rows = [
        ["Principal", principal],
        ["Annual rate", rate],
        ["Time", durationText(state)],
        ["Interest treatment", treatmentText(state)],
        ["Amount", "?"],
      ];
      prompt = "Find the amount.";
      break;
    case "INT-QL-080":
      rows = [
        ["Principal", principal],
        ["Annual rate", rate],
        ["Time", durationText(state)],
        ["Interest treatment", treatmentText(state)],
        ["Total interest", "?"],
      ];
      prompt = "Find the total interest.";
      break;
    case "INT-QL-081":
      rows = [
        ["Final amount", finalAmount],
        ["Annual rate", rate],
        ["Time", durationText(state)],
        ["Interest treatment", treatmentText(state)],
        ["Principal", "?"],
      ];
      prompt = "Find the principal.";
      break;
    case "INT-QL-082":
      rows = [
        ["Principal", principal],
        ["Final amount", finalAmount],
        ["Time", durationText(state)],
        ["Interest treatment", treatmentText(state)],
        ["Annual rate", "?"],
      ];
      prompt = "Find the annual rate.";
      break;
    case "INT-QL-083":
      rows = [
        ["Principal", principal],
        ["Final amount", finalAmount],
        ["Annual rate", rate],
        ["Final part of the time", `${state.tailMonths} months`],
        ["Interest treatment", `Compound annually for the preceding years; use simple interest for the final ${state.tailMonths} months on the balance at that point`],
        ["Years of annual compounding", "?"],
      ];
      prompt = "Find the number of years.";
      break;
    default:
      return presentation;
  }

  return deepFreeze({ ...presentation, stem: table(rows, prompt) });
}
