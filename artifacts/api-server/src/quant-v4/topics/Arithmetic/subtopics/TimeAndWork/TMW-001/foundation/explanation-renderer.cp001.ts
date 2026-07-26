import type { TmwCp001Explanation, TmwCp001ExplanationStep, TmwCp001Parameters, TmwCp001SolverResult } from "../types";
import { formatImproperFraction, formatRational } from "./rational";

const scenarioOpenings: Record<string, string> = {
  packaging_output: "The packaging line works at a constant hourly output, so total cartons come from rate multiplied by operating time.",
  application_verification: "Because the verification pace is uniform, the hourly rate is obtained by sharing the checked applications across the working hours.",
  printing_run: "The print run has a fixed sheets-per-minute rate, so its duration is total sheets divided by that rate.",
  road_resurfacing: "One day's contribution is one equal part of the whole resurfacing job.",
  proofreading: "The manuscript is completed when the repeated one-hour fractions add to one whole.",
  data_entry_progress: "At a uniform pace, the completed batch fraction is the elapsed time divided by the full completion time.",
  machine_order_progress: "The completed share of the order is first found as a time fraction and then converted to a percentage.",
  hall_painting: "The required painting time is the same fraction of the crew's full completion time as the requested fraction of work.",
  survey_inspection: "A fixed percentage of a uniformly completed survey needs the same percentage of the full survey time.",
  repair_progress: "The unfinished repair is what remains after subtracting the completed time fraction from one whole job.",
  binding_batch: "The binding machine's remaining percentage is the complement of the percentage already completed.",
  scanning_output: "The scanner's page output accumulates uniformly minute by minute.",
  labelling_rate: "The labelling line's per-minute rate is the total packet output divided by the recorded minutes.",
  parcel_sorting: "The sorting duration is found by dividing the parcel count by the hourly handling rate.",
  road_length_recovery: "The completed metres represent a known fraction of the entire road stretch, so the whole is recovered by dividing by that fraction.",
  harvesting_time_recovery: "The elapsed harvesting time represents the same fraction of the full time as the field fraction already completed.",
  printing_rate_conversion: "An hourly production rate must be spread across the 60 minutes in that hour.",
  equal_time_output_comparison: "Since both machines run for the same duration, their output gap equals the rate gap multiplied by that common time.",
  same_rate_time_comparison: "At the same processing rate, only the extra files create extra time.",
  deadline_rate: "The dispatch rate must be high enough to divide the full package target evenly across the deadline hours.",
  reduced_efficiency_delay: "The assignment size is unchanged, but a lower rate increases the completion time; the delay is the new time minus the scheduled time.",
  increased_efficiency_saving: "The production target is unchanged, but a higher rate shortens the completion time; the saving is the old time minus the new time.",
};

function value(parameters: TmwCp001Parameters, key: string): string {
  const item = parameters.quantities[key];
  if (!item) throw new Error(`${parameters.qlId}: explanation is missing ${key}.`);
  return key.toLowerCase().includes("fraction") || key === "unitWork" ? formatImproperFraction(item) : formatRational(item);
}

function keyRule(parameters: TmwCp001Parameters, solver: TmwCp001SolverResult) {
  const interpretationByStrategy: Record<string, string> = {
    "EXP-RATE-DIRECT": "For uniform work, any one of work, rate and time is recovered from the other two.",
    "EXP-RECIPROCAL": "If a whole job takes T time units, one time unit completes 1/T of the job, and the reverse relation also holds.",
    "EXP-FRACTION-PROGRESS": "Uniform progress follows the same fraction as elapsed time over whole completion time.",
    "EXP-OUTPUT-DIRECT": "Uniform physical output follows output = rate × time and its inverse forms.",
    "EXP-PART-WHOLE": "A known part equals the whole multiplied by its stated fraction.",
    "EXP-UNIT-CONVERSION": "A rate must be divided or multiplied by the exact number of smaller time units in one larger unit.",
    "EXP-COMPARISON": "Compare only the extra work or extra time after holding the common rate or common duration fixed.",
    "EXP-TARGET-RATE": "The required rate is the target work divided by the available time.",
    "EXP-RATE-CHANGE": "For fixed work, time changes inversely with the rate multiplier.",
  };
  return { label: "Key Rule", latex: solver.formulaLatex, interpretation: interpretationByStrategy[parameters.explanationStrategyId] ?? "Use the governing work-rate relation." };
}

function stepsFor(parameters: TmwCp001Parameters, solver: TmwCp001SolverResult): TmwCp001ExplanationStep[] {
  switch (parameters.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      return [{ label: "Use the uniform rate", prose: `Multiply the rate ${value(parameters, "rate")} by the duration ${value(parameters, "time")}.`, latex: solver.equation }, { label: "Interpret the product", prose: `The product is the total ${parameters.answerUnit} produced during the stated interval.` }];
    case "findRateFromWorkAndTime":
      return [{ label: "Distribute the work over time", prose: `Divide ${value(parameters, "work")} applications by ${value(parameters, "time")} hours.`, latex: solver.equation }, { label: "Read the quotient as a rate", prose: "The quotient gives the applications checked in each hour." }];
    case "findTimeFromWorkAndRate":
      return [{ label: "Count the required rate-blocks", prose: `Divide the total ${value(parameters, "work")} sheets by ${value(parameters, "rate")} sheets produced each minute.`, latex: solver.equation }, { label: "Convert the quotient to duration", prose: "The number of equal rate-blocks is the number of minutes required." }];
    case "findOneUnitWorkFromCompletionTime":
      return [{ label: "Treat the job as one whole", prose: `The whole job is shared equally across ${value(parameters, "completionTime")} days.` }, { label: "Take the reciprocal", prose: "One day's work is therefore the reciprocal of the completion time.", latex: solver.equation }];
    case "findCompletionTimeFromOneUnitWork":
      return [{ label: "Use the one-hour fraction", prose: `Each hour completes ${value(parameters, "unitWork")} of the manuscript.` }, { label: "Invert the rate", prose: "The number of such equal hourly parts needed to make one whole is the reciprocal.", latex: solver.equation }];
    case "findFractionCompletedInGivenTime":
      return [{ label: "Form the time fraction", prose: `Compare ${value(parameters, "elapsedTime")} elapsed hours with the ${value(parameters, "completionTime")} hours required for the whole batch.`, latex: solver.equation }, { label: "Interpret the fraction", prose: "That same fraction of the batch has been entered." }];
    case "findPercentCompletedInGivenTime":
      return [{ label: "Find the completed fraction", prose: `Use elapsed time over total time: ${value(parameters, "elapsedTime")}/${value(parameters, "completionTime")}.` }, { label: "Convert to percent", prose: "Multiply the completed fraction by 100.", latex: solver.equation }];
    case "findTimeForGivenFraction":
      return [{ label: "Match work fraction to time fraction", prose: `${value(parameters, "completedFraction")} of the work needs the same fraction of the full ${value(parameters, "completionTime")}-day duration.` }, { label: "Calculate the partial time", prose: "Multiply the full time by the requested fraction.", latex: solver.equation }];
    case "findTimeForGivenPercent":
      return [{ label: "Convert the target percentage", prose: `${value(parameters, "percent")}% of the survey corresponds to ${value(parameters, "percent")}/100 of the full time.` }, { label: "Calculate the required hours", prose: "Multiply the whole completion time by that percentage fraction.", latex: solver.equation }];
    case "findRemainingFractionAfterTime":
      return [{ label: "Find the completed part", prose: `The completed fraction is ${value(parameters, "elapsedTime")}/${value(parameters, "completionTime")}.` }, { label: "Take the complement", prose: "Subtract the completed fraction from one whole job.", latex: solver.equation }];
    case "findRemainingPercentAfterTime":
      return [{ label: "Find the completed percentage", prose: `Convert ${value(parameters, "elapsedTime")}/${value(parameters, "completionTime")} to a percentage.` }, { label: "Take the percentage complement", prose: "Subtract the completed percentage from 100%.", latex: solver.equation }];
    case "findUnitRateFromOutputAndTime":
      return [{ label: "Average the output over the minutes", prose: `Divide ${value(parameters, "output")} packets by ${value(parameters, "time")} minutes.`, latex: solver.equation }, { label: "Attach the rate unit", prose: "The quotient is measured in packets per minute." }];
    case "findTimeFromOutputAndUnitRate":
      return [{ label: "Divide total output by hourly output", prose: `Divide ${value(parameters, "output")} parcels by ${value(parameters, "rate")} parcels handled each hour.`, latex: solver.equation }, { label: "Interpret the quotient", prose: "The quotient is the required number of hours." }];
    case "recoverWholeWorkFromCompletedPart":
      return [{ label: "Relate part and whole", prose: `${value(parameters, "partWork")} metres equals ${value(parameters, "completedFraction")} of the full stretch.` }, { label: "Recover the full stretch", prose: "Divide the completed metres by the completed fraction.", latex: solver.equation }];
    case "recoverWholeTimeFromPartCompletion":
      return [{ label: "Relate elapsed and whole time", prose: `${value(parameters, "elapsedTime")} hours represents ${value(parameters, "completedFraction")} of the full harvesting time.` }, { label: "Recover the full time", prose: "Divide elapsed time by the completed fraction.", latex: solver.equation }];
    case "convertRateAcrossTimeUnits":
      return [{ label: "Use the time-unit relation", prose: "One hour contains 60 minutes, so the hourly pages must be shared across 60 equal minutes." }, { label: "Convert the rate", prose: `Divide ${value(parameters, "hourlyRate")} by 60.`, latex: solver.equation }];
    case "compareWorkCompletedAtEqualTime":
      return [{ label: "Find the hourly output gap", prose: `Subtract B's rate from A's rate: ${value(parameters, "rateA")} - ${value(parameters, "rateB")}.` }, { label: "Extend the gap over the common time", prose: `Multiply that hourly gap by ${value(parameters, "time")} hours.`, latex: solver.equation }];
    case "compareTimeForDifferentWorkAtSameRate":
      return [{ label: "Find the extra files", prose: `Subtract the smaller archive from the larger: ${value(parameters, "workB")} - ${value(parameters, "workA")}.` }, { label: "Convert extra work to extra time", prose: `Divide the extra files by the common rate ${value(parameters, "rate")}.`, latex: solver.equation }];
    case "findRequiredRateForTargetCompletion":
      return [{ label: "Spread the target across the deadline", prose: `Divide ${value(parameters, "work")} packages by the available ${value(parameters, "time")} hours.`, latex: solver.equation }, { label: "Interpret the quotient", prose: "This is the minimum uniform hourly rate that reaches the target exactly on time." }];
    case "findDelayFromReducedUniformRate":
      return [{ label: "Form the reduced-rate multiplier", prose: `A ${value(parameters, "percent")}% reduction leaves ${100 - Number(value(parameters, "percent"))}% of the original rate.` }, { label: "Recover the new completion time", prose: "Divide the old time by the remaining rate fraction." }, { label: "Find only the delay", prose: "Subtract the scheduled time from the new completion time.", latex: solver.equation }];
    case "findTimeSavedFromIncreasedUniformRate":
      return [{ label: "Form the increased-rate multiplier", prose: `A ${value(parameters, "percent")}% increase makes the new rate ${100 + Number(value(parameters, "percent"))}% of the original rate.` }, { label: "Recover the shorter completion time", prose: "Divide the old time by the increased rate multiplier." }, { label: "Find only the saving", prose: "Subtract the new time from the original time.", latex: solver.equation }];
  }
}

export function renderTmwCp001Explanation(parameters: TmwCp001Parameters, solver: TmwCp001SolverResult): TmwCp001Explanation {
  const contextualOpening = scenarioOpenings[parameters.scenarioFamily];
  if (!contextualOpening) throw new Error(`${parameters.qlId}: missing contextual explanation opening.`);
  return {
    strategyId: parameters.explanationStrategyId,
    contextualOpening,
    keyRule: keyRule(parameters, solver),
    steps: stepsFor(parameters, solver),
    verification: { prose: "Substituting the result back into the same work-rate relation reproduces the stated work or progress condition." },
    conclusion: { prose: `Therefore, the required answer is ${solver.answer}.`, answerLatex: `\\boxed{${solver.answer.replace(/ /g, "\\ ")}}` },
  };
}
