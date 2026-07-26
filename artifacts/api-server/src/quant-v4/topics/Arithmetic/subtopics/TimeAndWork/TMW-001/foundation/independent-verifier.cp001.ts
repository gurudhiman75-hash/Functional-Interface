import { getTmwCp001RegistryEntry } from "../library";
import type { Rational, TmwCp001Parameters, TmwCp001VerificationResult } from "../types";
import { add, divide, equals, multiply, percentOf, rational, subtract } from "./rational";

function quantity(parameters: TmwCp001Parameters, key: string): Rational {
  const value = parameters.quantities[key];
  if (!value) throw new Error(`${parameters.qlId}: independent verifier is missing ${key}.`);
  return value;
}

export function independentlyVerifyTmwCp001(
  parameters: TmwCp001Parameters,
  proposedAnswer: Rational,
): TmwCp001VerificationResult {
  const registry = getTmwCp001RegistryEntry(parameters.qlId);
  let valid = false;
  let check = "";

  switch (parameters.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      valid = equals(proposedAnswer, multiply(quantity(parameters, "rate"), quantity(parameters, "time")));
      check = "Substitute the proposed work/output into W = r × t.";
      break;
    case "findRateFromWorkAndTime":
    case "findUnitRateFromOutputAndTime": {
      const workKey = parameters.solveMode === "findRateFromWorkAndTime" ? "work" : "output";
      valid = equals(multiply(proposedAnswer, quantity(parameters, "time")), quantity(parameters, workKey));
      check = "Multiply the proposed rate by time and recover the stated total.";
      break;
    }
    case "findTimeFromWorkAndRate":
    case "findTimeFromOutputAndUnitRate": {
      const workKey = parameters.solveMode === "findTimeFromWorkAndRate" ? "work" : "output";
      valid = equals(multiply(proposedAnswer, quantity(parameters, "rate")), quantity(parameters, workKey));
      check = "Multiply the proposed time by the stated rate and recover the total.";
      break;
    }
    case "findOneUnitWorkFromCompletionTime":
      valid = equals(multiply(proposedAnswer, quantity(parameters, "completionTime")), rational(1));
      check = "One-time-unit work multiplied by whole completion time must equal one whole job.";
      break;
    case "findCompletionTimeFromOneUnitWork":
      valid = equals(multiply(proposedAnswer, quantity(parameters, "unitWork")), rational(1));
      check = "The proposed completion time multiplied by one-hour work must equal one whole job.";
      break;
    case "findFractionCompletedInGivenTime":
      valid = equals(multiply(proposedAnswer, quantity(parameters, "completionTime")), quantity(parameters, "elapsedTime"));
      check = "Completed fraction × whole completion time must equal elapsed time.";
      break;
    case "findPercentCompletedInGivenTime":
      valid = equals(multiply(divide(proposedAnswer, rational(100)), quantity(parameters, "completionTime")), quantity(parameters, "elapsedTime"));
      check = "Convert the proposed percentage to a fraction and recover elapsed time.";
      break;
    case "findTimeForGivenFraction":
      valid = equals(proposedAnswer, multiply(quantity(parameters, "completionTime"), quantity(parameters, "completedFraction")));
      check = "The required time is the requested fraction of whole completion time.";
      break;
    case "findTimeForGivenPercent":
      valid = equals(proposedAnswer, divide(multiply(quantity(parameters, "completionTime"), quantity(parameters, "percent")), rational(100)));
      check = "The required time is the requested percentage of whole completion time.";
      break;
    case "findRemainingFractionAfterTime": {
      const completed = divide(quantity(parameters, "elapsedTime"), quantity(parameters, "completionTime"));
      valid = equals(add(proposedAnswer, completed), rational(1));
      check = "Completed fraction plus proposed remaining fraction must equal one whole job.";
      break;
    }
    case "findRemainingPercentAfterTime": {
      const completedPercent = percentOf(divide(quantity(parameters, "elapsedTime"), quantity(parameters, "completionTime")));
      valid = equals(add(proposedAnswer, completedPercent), rational(100));
      check = "Completed percentage plus proposed remaining percentage must equal 100%.";
      break;
    }
    case "recoverWholeWorkFromCompletedPart":
      valid = equals(multiply(proposedAnswer, quantity(parameters, "completedFraction")), quantity(parameters, "partWork"));
      check = "The proposed whole quantity multiplied by the completed fraction must recover the stated part.";
      break;
    case "recoverWholeTimeFromPartCompletion":
      valid = equals(multiply(proposedAnswer, quantity(parameters, "completedFraction")), quantity(parameters, "elapsedTime"));
      check = "The proposed whole time multiplied by the completed fraction must recover elapsed time.";
      break;
    case "convertRateAcrossTimeUnits":
      valid = equals(multiply(proposedAnswer, rational(60)), quantity(parameters, "hourlyRate"));
      check = "Multiply the per-minute proposal by 60 and recover the hourly rate.";
      break;
    case "compareWorkCompletedAtEqualTime": {
      const workA = multiply(quantity(parameters, "rateA"), quantity(parameters, "time"));
      const workB = multiply(quantity(parameters, "rateB"), quantity(parameters, "time"));
      valid = equals(proposedAnswer, subtract(workA, workB));
      check = "Independently compute each machine's output and subtract.";
      break;
    }
    case "compareTimeForDifferentWorkAtSameRate": {
      const timeA = divide(quantity(parameters, "workA"), quantity(parameters, "rate"));
      const timeB = divide(quantity(parameters, "workB"), quantity(parameters, "rate"));
      valid = equals(proposedAnswer, subtract(timeB, timeA));
      check = "Independently compute both completion times and subtract.";
      break;
    }
    case "findRequiredRateForTargetCompletion":
      valid = equals(multiply(proposedAnswer, quantity(parameters, "time")), quantity(parameters, "work"));
      check = "The proposed rate must complete the target work exactly at the deadline.";
      break;
    case "findDelayFromReducedUniformRate": {
      const oldTime = quantity(parameters, "originalTime");
      const oldRate = quantity(parameters, "originalRate");
      const newRate = quantity(parameters, "changedRate");
      const work = multiply(oldTime, oldRate);
      const proposedNewTime = add(oldTime, proposedAnswer);
      valid = equals(multiply(proposedNewTime, newRate), work);
      check = "Old rate × old time must equal reduced rate × (old time + proposed delay).";
      break;
    }
    case "findTimeSavedFromIncreasedUniformRate": {
      const oldTime = quantity(parameters, "originalTime");
      const oldRate = quantity(parameters, "originalRate");
      const newRate = quantity(parameters, "changedRate");
      const work = multiply(oldTime, oldRate);
      const proposedNewTime = subtract(oldTime, proposedAnswer);
      valid = equals(multiply(proposedNewTime, newRate), work);
      check = "Old rate × old time must equal increased rate × (old time − proposed saving).";
      break;
    }
  }

  return { valid, verifierId: registry.independentVerifierId, check };
}
