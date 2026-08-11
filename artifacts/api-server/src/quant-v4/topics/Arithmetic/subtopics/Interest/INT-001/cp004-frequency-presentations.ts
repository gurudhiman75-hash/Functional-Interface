import {
  brokenAmountForState, completeAmountForState, completeAmountFromNominal, effectiveAnnualRate, hash, mixedAmountForState,
  periodicAmountForState, sub, type Cp004MathematicalState, type Cp004Representation,
} from "./cp004-frequency-math";
import { durationText, frequencyLabel, frequencyNoun, frequencyScheduleLabel, interestTimesPerYear, moneyText, percentText } from "./cp004-frequency-options";

function structuredStem(state: Cp004MathematicalState, prompt: string, rows: readonly (readonly [string, string])[]): string {
  return [
    "The investment details are shown below.",
    "",
    "| Detail | Value |",
    "| --- | --- |",
    ...rows.map(([label, value]) => `| ${label} | ${value} |`),
    "",
    prompt,
  ].join("\n");
}

export function stemFor(state: Cp004MathematicalState, seed: string): { representation: Cp004Representation; stemFamilyId: string; stem: string } {
  const frame = hash(`${seed}:${state.qlId}:editorial-frame`) % 4;
  const representation: Cp004Representation = frame === 0 ? "TERMS_TABLE" : frame === 1 ? "STANDARD_PROSE" : frame === 2 ? "BALANCE_RECORD" : "SCHEME_COMPARISON";
  const amount = completeAmountForState(state);
  const ci = sub(amount, state.principal);
  const pAmount = periodicAmountForState(state);
  const pCi = sub(pAmount, state.principal);
  const bAmount = brokenAmountForState(state);
  const mAmount = mixedAmountForState(state);
  const rate = percentText(state.nominalAnnualRatePercent);
  const periodic = percentText(state.periodicRatePercent);
  const duration = durationText(state.periods, state.frequency);
  const schedule = frequencyLabel(state.frequency);

  let prompt = "";
  let rows: readonly (readonly [string, string])[] = [];
  switch (state.qlId) {
    case "INT-QL-067":
      prompt = frame === 1
        ? `A sum of ${moneyText(state.principal)} is invested at ${rate} per annum, compounded ${schedule}, for ${duration}. Find the amount.`
        : frame === 2
          ? `${moneyText(state.principal)} earns ${rate} per annum with interest added ${interestTimesPerYear(state.frequency)}. What will be the balance after ${duration}?`
          : `Find the amount on ${moneyText(state.principal)} after ${duration} at ${rate} per annum, compounded ${schedule}.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["Compounding", schedule], ["Time", duration], ["Amount", "?"]];
      break;
    case "INT-QL-068":
      prompt = frame === 1
        ? `Find the compound interest on ${moneyText(state.principal)} at ${rate} per annum for ${duration}, when interest is compounded ${schedule}.`
        : frame === 2
          ? `${moneyText(state.principal)} is kept for ${duration} at ${rate} per annum, with interest added ${interestTimesPerYear(state.frequency)}. How much interest is earned?`
          : `A sum of ${moneyText(state.principal)} is compounded ${schedule} at ${rate} per annum for ${duration}. Find the compound interest.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["Compounding", schedule], ["Time", duration], ["Compound interest", "?"]];
      break;
    case "INT-QL-069":
      prompt = `A sum amounts to ${moneyText(amount)} in ${duration} at ${rate} per annum, compounded ${schedule}. Find the original sum.`;
      rows = [["Final amount", moneyText(amount)], ["Annual rate", rate], ["Compounding", schedule], ["Time", duration], ["Original sum", "?"]];
      break;
    case "INT-QL-070":
      prompt = `The compound interest earned in ${duration} is ${moneyText(ci)} at ${rate} per annum, compounded ${schedule}. Find the principal.`;
      rows = [["Compound interest", moneyText(ci)], ["Annual rate", rate], ["Compounding", schedule], ["Time", duration], ["Principal", "?"]];
      break;
    case "INT-QL-071":
      prompt = `${moneyText(state.principal)} amounts to ${moneyText(amount)} in ${duration} when interest is compounded ${schedule}. Find the annual rate.`;
      rows = [["Principal", moneyText(state.principal)], ["Final amount", moneyText(amount)], ["Compounding", schedule], ["Time", duration], ["Annual rate", "?"]];
      break;
    case "INT-QL-072":
      prompt = `${moneyText(state.principal)} amounts to ${moneyText(amount)} at ${rate} per annum, compounded ${schedule}. Find the time.`;
      rows = [["Principal", moneyText(state.principal)], ["Final amount", moneyText(amount)], ["Annual rate", rate], ["Compounding", schedule], ["Time", "?"]];
      break;
    case "INT-QL-073":
      prompt = `A sum of ${moneyText(state.principal)} earns ${periodic} in every ${frequencyNoun(state.frequency)} for ${state.periods} such periods. Find the amount.`;
      rows = [["Principal", moneyText(state.principal)], ["Rate for each period", periodic], ["Number of periods", String(state.periods)], ["Amount", "?"]];
      break;
    case "INT-QL-074":
      prompt = `A sum of ${moneyText(state.principal)} earns ${periodic} in every ${frequencyNoun(state.frequency)} for ${state.periods} such periods. Find the compound interest.`;
      rows = [["Principal", moneyText(state.principal)], ["Rate for each period", periodic], ["Number of periods", String(state.periods)], ["Compound interest", "?"]];
      break;
    case "INT-QL-075": {
      const firstAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const secondAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      prompt = `The same sum of ${moneyText(state.principal)} is invested for ${state.years} year${state.years === 1 ? "" : "s"} at ${rate} per annum under ${frequencyScheduleLabel(state.frequency)} and ${frequencyScheduleLabel(state.comparisonFrequency)} compounding. Find the difference between the two amounts.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["Time", `${state.years} year${state.years === 1 ? "" : "s"}`], ["First schedule", frequencyScheduleLabel(state.frequency)], ["Second schedule", frequencyScheduleLabel(state.comparisonFrequency)], ["Difference", "?"]];
      void firstAmount; void secondAmount;
      break;
    }
    case "INT-QL-076":
      prompt = `A scheme quotes ${rate} per annum and adds interest ${interestTimesPerYear(state.frequency)}. Find the effective annual rate, correct to two decimal places.`;
      rows = [["Quoted annual rate", rate], ["Interest added", interestTimesPerYear(state.frequency)], ["Effective annual rate (to two decimal places)", "?"]];
      break;
    case "INT-QL-077": {
      const effective = percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency));
      prompt = `The effective annual rate is ${effective} when interest is added ${interestTimesPerYear(state.frequency)}. Find the nominal annual rate.`;
      rows = [["Effective annual rate", effective], ["Interest added", interestTimesPerYear(state.frequency)], ["Nominal annual rate", "?"]];
      break;
    }
    case "INT-QL-078":
      prompt = `${moneyText(state.principal)} amounts to ${moneyText(amount)} in ${state.years} year${state.years === 1 ? "" : "s"} at a nominal rate of ${rate} per annum. Interest is added annually, half-yearly, quarterly or monthly. Which schedule was used?`;
      rows = [["Principal", moneyText(state.principal)], ["Final amount", moneyText(amount)], ["Nominal annual rate", rate], ["Time", `${state.years} year${state.years === 1 ? "" : "s"}`], ["Compounding schedule", "?"]];
      break;
    case "INT-QL-079":
      prompt = `A sum of ${moneyText(state.principal)} is invested at ${rate} per annum for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the amount.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["Complete years", String(state.fullYears)], ["Extra months", String(state.tailMonths)], ["Rule for extra months", "Simple interest"], ["Amount", "?"]];
      break;
    case "INT-QL-080":
      prompt = `A sum of ${moneyText(state.principal)} is invested at ${rate} per annum for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the compound interest.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["Complete years", String(state.fullYears)], ["Extra months", String(state.tailMonths)], ["Rule for extra months", "Simple interest"], ["Compound interest", "?"]];
      break;
    case "INT-QL-081":
      prompt = `An investment amounts to ${moneyText(bAmount)} at ${rate} per annum after ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the principal.`;
      rows = [["Final amount", moneyText(bAmount)], ["Annual rate", rate], ["Complete years", String(state.fullYears)], ["Extra months", String(state.tailMonths)], ["Rule for extra months", "Simple interest"], ["Principal", "?"]];
      break;
    case "INT-QL-082":
      prompt = `${moneyText(state.principal)} amounts to ${moneyText(bAmount)} after ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the annual rate.`;
      rows = [["Principal", moneyText(state.principal)], ["Final amount", moneyText(bAmount)], ["Complete years", String(state.fullYears)], ["Extra months", String(state.tailMonths)], ["Rule for extra months", "Simple interest"], ["Annual rate", "?"]];
      break;
    case "INT-QL-083":
      prompt = `${moneyText(state.principal)} amounts to ${moneyText(bAmount)} at ${rate} per annum after some complete years and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the number of complete years.`;
      rows = [["Principal", moneyText(state.principal)], ["Final amount", moneyText(bAmount)], ["Annual rate", rate], ["Extra months", String(state.tailMonths)], ["Rule for extra months", "Simple interest"], ["Complete years", "?"]];
      break;
    case "INT-QL-084":
      prompt = `${moneyText(state.principal)} is invested at ${rate} per annum. Interest is compounded ${frequencyLabel(state.firstFrequency)} for the first ${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, then ${frequencyLabel(state.secondFrequency)} for the next ${state.secondYears} year${state.secondYears === 1 ? "" : "s"}. Find the amount.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["First interval", `${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, ${frequencyLabel(state.firstFrequency)}`], ["Second interval", `${state.secondYears} year${state.secondYears === 1 ? "" : "s"}, ${frequencyLabel(state.secondFrequency)}`], ["Amount", "?"]];
      break;
    case "INT-QL-085":
      prompt = `${moneyText(state.principal)} is invested at ${rate} per annum. Interest is compounded ${frequencyLabel(state.firstFrequency)} for the first ${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, then ${frequencyLabel(state.secondFrequency)} for the next ${state.secondYears} year${state.secondYears === 1 ? "" : "s"}. Find the compound interest.`;
      rows = [["Principal", moneyText(state.principal)], ["Annual rate", rate], ["First interval", `${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, ${frequencyLabel(state.firstFrequency)}`], ["Second interval", `${state.secondYears} year${state.secondYears === 1 ? "" : "s"}, ${frequencyLabel(state.secondFrequency)}`], ["Compound interest", "?"]];
      break;
  }

  const useTable = frame === 0;
  const stem = useTable ? structuredStem(state, prompt.split(". ").at(-1) ?? prompt, rows) : prompt;
  return Object.freeze({ representation: useTable ? "TERMS_TABLE" : representation, stemFamilyId: `${state.qlId}-FRAME-${frame + 1}`, stem });
}
