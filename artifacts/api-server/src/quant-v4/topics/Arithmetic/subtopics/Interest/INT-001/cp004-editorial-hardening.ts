import {
  add, brokenAmountForState, completeAmountForState, effectiveAnnualRate, rat, sub,
  type Cp004MathematicalState, type Cp004Representation,
} from "./cp004-frequency-math";
import {
  durationText, frequencyLabel, frequencyNoun, frequencyScheduleLabel, interestTimesPerYear,
  moneyText, percentText,
} from "./cp004-frequency-options";

type Row = readonly [string, string];

function card(title: string, rows: readonly Row[], prompt: string): string {
  return [
    `**${title}**`,
    "",
    "| Entry | Record |",
    "| --- | --- |",
    ...rows.map(([label, value]) => `| ${label} | ${value} |`),
    "",
    prompt,
  ].join("\n");
}

function scheduleTable(title: string, headings: readonly string[], rows: readonly (readonly string[])[], prompt: string): string {
  return [
    `**${title}**`,
    "",
    `| ${headings.join(" | ")} |`,
    `| ${headings.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
    "",
    prompt,
  ].join("\n");
}

function neutralPlan(state: Cp004MathematicalState): string {
  const highRate = state.nominalAnnualRatePercent.numerator > 20n * state.nominalAnnualRatePercent.denominator;
  return highRate ? "an illustrative compound-growth plan" : "an investment plan";
}

function standardProseStem(state: Cp004MathematicalState): string {
  const amount = completeAmountForState(state);
  const compoundInterest = sub(amount, state.principal);
  const brokenAmount = brokenAmountForState(state);
  const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
  const rate = percentText(state.nominalAnnualRatePercent);
  const periodRate = percentText(state.periodicRatePercent);
  const duration = durationText(state.periods, state.frequency);
  const schedule = frequencyLabel(state.frequency);
  const original = moneyText(state.principal);
  const finalAmount = moneyText(amount);
  const plan = neutralPlan(state);

  switch (state.qlId) {
    case "INT-QL-067": return `${original} is placed in ${plan} at ${rate} per annum, compounded ${schedule}, for ${duration}. Find the maturity amount.`;
    case "INT-QL-068": return `${original} is placed in ${plan} at ${rate} per annum for ${duration}, with interest compounded ${schedule}. Find only the compound interest.`;
    case "INT-QL-069": return `${finalAmount} is the maturity value after ${duration} at ${rate} per annum, compounded ${schedule}. Find the original principal.`;
    case "INT-QL-070": return `The compound interest earned over ${duration} is ${moneyText(compoundInterest)} at ${rate} per annum, compounded ${schedule}. Find the principal.`;
    case "INT-QL-071": return `${original} grows to ${finalAmount} in ${duration}, with interest compounded ${schedule}. Find the nominal annual rate.`;
    case "INT-QL-072": return `${original} grows to ${finalAmount} at ${rate} per annum, compounded ${schedule}. Find the investment period.`;
    case "INT-QL-073": return `${original} earns ${periodRate} in every ${frequencyNoun(state.frequency)} for ${state.periods} complete periods. Find the amount.`;
    case "INT-QL-074": return `${original} earns ${periodRate} in every ${frequencyNoun(state.frequency)} for ${state.periods} complete periods. Find only the compound interest.`;
    case "INT-QL-075": return `${original} is invested for ${state.years} year${state.years === 1 ? "" : "s"} at ${rate} per annum under ${frequencyScheduleLabel(state.frequency)} and ${frequencyScheduleLabel(state.comparisonFrequency)} compounding. Find the difference between the maturity amounts.`;
    case "INT-QL-076": return `${neutralPlan(state)} quotes ${rate} per annum and credits interest ${interestTimesPerYear(state.frequency)}. Find the effective annual rate, correct to two decimal places.`;
    case "INT-QL-077": return `The effective annual rate is ${percentText(effective)} when interest is credited ${interestTimesPerYear(state.frequency)}. Find the nominal annual rate.`;
    case "INT-QL-078": return `${original} grows to ${finalAmount} in ${state.years} year${state.years === 1 ? "" : "s"} at a nominal rate of ${rate} per annum. Find whether interest was compounded annually, half-yearly, quarterly or monthly.`;
    case "INT-QL-079": return `${original} is invested at ${rate} per annum for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} extra months. Complete years are compounded annually; the extra months earn simple interest on the latest balance. Find the amount.`;
    case "INT-QL-080": return `${original} is invested at ${rate} per annum for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} extra months. Complete years are compounded annually; the extra months earn simple interest on the latest balance. Find the total interest.`;
    case "INT-QL-081": return `A maturity value of ${moneyText(brokenAmount)} is obtained after ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} extra months at ${rate} per annum. Complete years are compounded annually and the final months use simple interest. Find the principal.`;
    case "INT-QL-082": return `${original} becomes ${moneyText(brokenAmount)} after ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} extra months. Complete years are compounded annually and the final months use simple interest. Find the annual rate.`;
    case "INT-QL-083": return `${original} becomes ${moneyText(brokenAmount)} at ${rate} per annum after some complete years and ${state.tailMonths} extra months. The extra months use simple interest after annual compounding. Find the number of complete years.`;
    case "INT-QL-084": return `${original} earns ${rate} per annum. Interest is compounded ${frequencyLabel(state.firstFrequency)} for the first ${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, then ${frequencyLabel(state.secondFrequency)} for the next ${state.secondYears} year${state.secondYears === 1 ? "" : "s"}. Find the amount.`;
    case "INT-QL-085": return `${original} earns ${rate} per annum. Interest is compounded ${frequencyLabel(state.firstFrequency)} for the first ${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, then ${frequencyLabel(state.secondFrequency)} for the next ${state.secondYears} year${state.secondYears === 1 ? "" : "s"}. Find only the compound interest.`;
  }
}

function balanceRecordStem(state: Cp004MathematicalState): string {
  const amount = completeAmountForState(state);
  const compoundInterest = sub(amount, state.principal);
  const brokenAmount = brokenAmountForState(state);
  const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
  const rate = percentText(state.nominalAnnualRatePercent);
  const duration = durationText(state.periods, state.frequency);
  const schedule = frequencyScheduleLabel(state.frequency);
  const common: Row[] = [["Crediting schedule", schedule], ["Term", duration]];

  switch (state.qlId) {
    case "INT-QL-067": return card("Maturity record", [["Opening balance", moneyText(state.principal)], ["Nominal annual rate", rate], ...common, ["Closing balance", "?"]], "Find the closing balance.");
    case "INT-QL-068": return card("Interest record", [["Opening balance", moneyText(state.principal)], ["Nominal annual rate", rate], ...common, ["Compound interest", "?"]], "Find the compound interest.");
    case "INT-QL-069": return card("Maturity record", [["Opening balance", "?"], ["Closing balance", moneyText(amount)], ["Nominal annual rate", rate], ...common], "Find the opening balance.");
    case "INT-QL-070": return card("Interest record", [["Opening balance", "?"], ["Compound interest", moneyText(compoundInterest)], ["Nominal annual rate", rate], ...common], "Find the opening balance.");
    case "INT-QL-071": return card("Rate record", [["Opening balance", moneyText(state.principal)], ["Closing balance", moneyText(amount)], ["Nominal annual rate", "?"], ...common], "Find the nominal annual rate.");
    case "INT-QL-072": return card("Term record", [["Opening balance", moneyText(state.principal)], ["Closing balance", moneyText(amount)], ["Nominal annual rate", rate], ["Crediting schedule", schedule], ["Term", "?"]], "Find the term.");
    case "INT-QL-073": return card("Periodic-rate record", [["Opening balance", moneyText(state.principal)], ["Rate per period", percentText(state.periodicRatePercent)], ["Period", frequencyNoun(state.frequency)], ["Number of periods", String(state.periods)], ["Closing balance", "?"]], "Find the closing balance.");
    case "INT-QL-074": return card("Periodic-rate record", [["Opening balance", moneyText(state.principal)], ["Rate per period", percentText(state.periodicRatePercent)], ["Period", frequencyNoun(state.frequency)], ["Number of periods", String(state.periods)], ["Compound interest", "?"]], "Find the compound interest.");
    case "INT-QL-075": return card("Two-plan record", [["Principal in each plan", moneyText(state.principal)], ["Nominal annual rate", rate], ["Term", `${state.years} year${state.years === 1 ? "" : "s"}`], ["Plan 1", frequencyScheduleLabel(state.frequency)], ["Plan 2", frequencyScheduleLabel(state.comparisonFrequency)], ["Difference in maturity values", "?"]], "Find the difference between the two maturity values.");
    case "INT-QL-076": return card("One-year return record", [["Starting value", "₹100"], ["Quoted annual rate", rate], ["Interest credited", interestTimesPerYear(state.frequency)], ["Actual one-year increase", "?"]], "Find the effective annual rate, correct to two decimal places.");
    case "INT-QL-077": return card("One-year return record", [["Starting value", "₹100"], ["Actual one-year increase", percentText(effective)], ["Interest credited", interestTimesPerYear(state.frequency)], ["Quoted annual rate", "?"]], "Find the nominal annual rate.");
    case "INT-QL-078": return card("Compounding record", [["Opening balance", moneyText(state.principal)], ["Closing balance", moneyText(amount)], ["Nominal annual rate", rate], ["Term", `${state.years} year${state.years === 1 ? "" : "s"}`], ["Crediting schedule", "?"]], "Find the compounding schedule.");
    case "INT-QL-079": return card("Broken-period record", [["Opening balance", moneyText(state.principal)], ["Annual rate", rate], ["Stage 1", `${state.fullYears} complete compounded year${state.fullYears === 1 ? "" : "s"}`], ["Stage 2", `${state.tailMonths} months at simple interest on the latest balance`], ["Closing balance", "?"]], "Find the closing balance.");
    case "INT-QL-080": return card("Broken-period record", [["Opening balance", moneyText(state.principal)], ["Annual rate", rate], ["Stage 1", `${state.fullYears} complete compounded year${state.fullYears === 1 ? "" : "s"}`], ["Stage 2", `${state.tailMonths} months at simple interest on the latest balance`], ["Total interest", "?"]], "Find the total interest.");
    case "INT-QL-081": return card("Broken-period maturity record", [["Opening balance", "?"], ["Closing balance", moneyText(brokenAmount)], ["Annual rate", rate], ["Stage 1", `${state.fullYears} complete compounded year${state.fullYears === 1 ? "" : "s"}`], ["Stage 2", `${state.tailMonths} months at simple interest`]], "Find the opening balance.");
    case "INT-QL-082": return card("Broken-period rate record", [["Opening balance", moneyText(state.principal)], ["Closing balance", moneyText(brokenAmount)], ["Annual rate", "?"], ["Stage 1", `${state.fullYears} complete compounded year${state.fullYears === 1 ? "" : "s"}`], ["Stage 2", `${state.tailMonths} months at simple interest`]], "Find the annual rate.");
    case "INT-QL-083": return card("Broken-period term record", [["Opening balance", moneyText(state.principal)], ["Closing balance", moneyText(brokenAmount)], ["Annual rate", rate], ["Complete compounded years", "?"], ["Final stage", `${state.tailMonths} months at simple interest`]], "Find the number of complete years.");
    case "INT-QL-084": return card("Changing-schedule record", [["Opening balance", moneyText(state.principal)], ["Annual rate", rate], ["First interval", `${state.firstYears} year${state.firstYears === 1 ? "" : "s"}; ${frequencyScheduleLabel(state.firstFrequency)} compounding`], ["Second interval", `${state.secondYears} year${state.secondYears === 1 ? "" : "s"}; ${frequencyScheduleLabel(state.secondFrequency)} compounding`], ["Closing balance", "?"]], "Find the closing balance.");
    case "INT-QL-085": return card("Changing-schedule record", [["Opening balance", moneyText(state.principal)], ["Annual rate", rate], ["First interval", `${state.firstYears} year${state.firstYears === 1 ? "" : "s"}; ${frequencyScheduleLabel(state.firstFrequency)} compounding`], ["Second interval", `${state.secondYears} year${state.secondYears === 1 ? "" : "s"}; ${frequencyScheduleLabel(state.secondFrequency)} compounding`], ["Compound interest", "?"]], "Find the compound interest.");
  }
}

function comparisonStem(state: Cp004MathematicalState): string {
  const amount = completeAmountForState(state);
  const brokenAmount = brokenAmountForState(state);
  const rate = percentText(state.nominalAnnualRatePercent);
  const duration = durationText(state.periods, state.frequency);

  if (state.qlId === "INT-QL-075") {
    return scheduleTable(
      "Scheme comparison",
      ["Term", "Plan A", "Plan B"],
      [
        ["Principal", moneyText(state.principal), moneyText(state.principal)],
        ["Nominal annual rate", rate, rate],
        ["Compounding", frequencyScheduleLabel(state.frequency), frequencyScheduleLabel(state.comparisonFrequency)],
        ["Duration", `${state.years} year${state.years === 1 ? "" : "s"}`, `${state.years} year${state.years === 1 ? "" : "s"}`],
        ["Maturity amount", "To be calculated", "To be calculated"],
      ],
      "Find the difference between the two maturity amounts.",
    );
  }

  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(state.qlId)) {
    const requested = state.qlId === "INT-QL-079" ? "final amount"
      : state.qlId === "INT-QL-080" ? "total interest"
        : state.qlId === "INT-QL-081" ? "principal"
          : state.qlId === "INT-QL-082" ? "annual rate"
            : "number of complete years";
    const principal = state.qlId === "INT-QL-081" ? "?" : moneyText(state.principal);
    const annualRate = state.qlId === "INT-QL-082" ? "?" : rate;
    const years = state.qlId === "INT-QL-083" ? "? complete years" : `${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}`;
    const final = ["INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(state.qlId) ? moneyText(brokenAmount) : "To be calculated";
    return scheduleTable(
      "Broken-period timeline",
      ["Starting value", "Stage 1", "Stage 2", "Final value"],
      [[principal, `${years}; annual compounding at ${annualRate}`, `${state.tailMonths} months; simple interest at ${annualRate} on the latest balance`, final]],
      `Find the ${requested}.`,
    );
  }

  if (state.qlId === "INT-QL-084" || state.qlId === "INT-QL-085") {
    return scheduleTable(
      "Changing compounding timeline",
      ["Starting value", "First interval", "Second interval", "Required"],
      [[
        moneyText(state.principal),
        `${state.firstYears} year${state.firstYears === 1 ? "" : "s"}; ${frequencyScheduleLabel(state.firstFrequency)} at ${rate} per annum`,
        `${state.secondYears} year${state.secondYears === 1 ? "" : "s"}; ${frequencyScheduleLabel(state.secondFrequency)} at ${rate} per annum`,
        state.qlId === "INT-QL-084" ? "Amount" : "Compound interest",
      ]],
      state.qlId === "INT-QL-084" ? "Find the amount." : "Find the compound interest.",
    );
  }

  if (state.qlId === "INT-QL-078") {
    return scheduleTable(
      "Frequency identification card",
      ["Principal", "Maturity amount", "Nominal annual rate", "Duration", "Possible schedules"],
      [[moneyText(state.principal), moneyText(amount), rate, `${state.years} year${state.years === 1 ? "" : "s"}`, "Annual / Half-yearly / Quarterly / Monthly"]],
      "Find the compounding schedule.",
    );
  }

  if (state.qlId === "INT-QL-076" || state.qlId === "INT-QL-077") {
    const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
    return scheduleTable(
      "Nominal and effective rate card",
      ["Starting value", "Nominal annual rate", "Crediting frequency", "Actual one-year increase"],
      [[
        "₹100",
        state.qlId === "INT-QL-077" ? "?" : rate,
        interestTimesPerYear(state.frequency),
        state.qlId === "INT-QL-076" ? "?" : percentText(effective),
      ]],
      state.qlId === "INT-QL-076"
        ? "Find the effective annual rate, correct to two decimal places."
        : "Find the nominal annual rate.",
    );
  }

  const required = state.qlId === "INT-QL-067" ? "Amount"
    : state.qlId === "INT-QL-068" ? "Compound interest"
      : state.qlId === "INT-QL-069" || state.qlId === "INT-QL-070" ? "Principal"
        : state.qlId === "INT-QL-071" ? "Nominal annual rate"
          : state.qlId === "INT-QL-072" ? "Duration"
            : state.qlId === "INT-QL-073" ? "Amount"
              : "Compound interest";
  const principal = state.qlId === "INT-QL-069" || state.qlId === "INT-QL-070" ? "?" : moneyText(state.principal);
  const ending = state.qlId === "INT-QL-069" || state.qlId === "INT-QL-071" || state.qlId === "INT-QL-072" ? moneyText(amount)
    : state.qlId === "INT-QL-070" ? moneyText(sub(amount, state.principal))
      : "To be calculated";
  const annualRate = state.qlId === "INT-QL-071" ? "?" : rate;
  const term = state.qlId === "INT-QL-072" ? "?" : duration;
  const rateEntry = state.qlId === "INT-QL-073" || state.qlId === "INT-QL-074"
    ? `${percentText(state.periodicRatePercent)} per ${frequencyNoun(state.frequency)}`
    : `${annualRate}; ${frequencyScheduleLabel(state.frequency)} compounding`;
  return scheduleTable(
    "Compounding schedule card",
    ["Opening value", "Rate and schedule", "Term", "Observed / required value"],
    [[principal, rateEntry, term, ending]],
    `Find the ${required.toLowerCase()}.`,
  );
}

export function hardenCp004Presentation(
  state: Cp004MathematicalState,
  original: Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>,
): Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }> {
  const match = original.stemFamilyId.match(/FRAME-(\d)$/u);
  const frame = Number(match?.[1] ?? 1);
  if (frame <= 1) return original;
  if (frame === 2) {
    return Object.freeze({ representation: "STANDARD_PROSE", stemFamilyId: original.stemFamilyId, stem: standardProseStem(state) });
  }
  if (frame === 3) {
    return Object.freeze({ representation: "BALANCE_RECORD", stemFamilyId: original.stemFamilyId, stem: balanceRecordStem(state) });
  }
  return Object.freeze({ representation: "SCHEME_COMPARISON", stemFamilyId: original.stemFamilyId, stem: comparisonStem(state) });
}
