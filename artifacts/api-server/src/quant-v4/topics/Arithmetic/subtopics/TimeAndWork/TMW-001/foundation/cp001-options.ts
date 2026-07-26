import { add, compare, divide, equals, multiply, rational, reciprocal, subtract } from "./rational";
import { answerText, percent, required, seedNumber } from "./cp001-helpers";
import type { Rational, TmwCp001Parameters, TmwCp001RegistryEntry, TmwMisconceptionId, TmwOption } from "./types";

function optionLabel(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, value: Rational): string {
  return answerText(entry, p, value);
}

interface OptionCandidate {
  value: Rational;
  misconceptionId: TmwMisconceptionId;
}

function positive(value: Rational): boolean {
  return compare(value, rational(0)) > 0;
}

function distractorCandidates(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, answer: Rational): OptionCandidate[] {
  const fraction = p.requestedFraction ?? rational(1, 2);
  const completed = multiply(p.rate, p.time);
  const firstWork = multiply(p.rate, p.time);
  const secondRate = p.secondaryRate ?? rational(1);
  const secondWorkAtEqualTime = multiply(secondRate, p.time);
  const firstTime = divide(p.totalWork, p.rate);
  const secondTime = p.secondaryWork ? divide(p.secondaryWork, p.rate) : rational(1);
  const originalTime = p.originalTime ?? p.time;
  const changedTime = p.changedRate ? divide(p.totalWork, p.changedRate) : originalTime;

  const common: OptionCandidate[] = [{ value: answer, misconceptionId: "CORRECT" }];

  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      return common.concat([
        { value: add(p.rate, p.time), misconceptionId: "RATE_TIME_ADDITION" },
        { value: divide(p.rate, p.time), misconceptionId: "RATE_TIME_DIVISION" },
        { value: multiply(p.rate, add(p.time, rational(1))), misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: multiply(p.rate, subtract(p.time, rational(1))), misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "findRateFromWorkAndTime":
    case "findRequiredRateForTargetCompletion":
      return common.concat([
        { value: multiply(p.totalWork, p.time), misconceptionId: "WORK_TIME_MULTIPLICATION" },
        { value: divide(p.time, p.totalWork), misconceptionId: "REQUIRED_RATE_INVERTED" },
        { value: divide(p.totalWork, add(p.time, rational(1))), misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: p.time, misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "findTimeFromWorkAndRate":
      return common.concat([
        { value: multiply(p.totalWork, p.rate), misconceptionId: "WORK_RATE_MULTIPLICATION" },
        { value: divide(p.rate, p.totalWork), misconceptionId: "REQUIRED_RATE_INVERTED" },
        { value: divide(p.totalWork, add(p.rate, rational(1))), misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: p.rate, misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "findOneUnitWorkFromCompletionTime": {
      const completionTime = reciprocal(p.rate);
      return common.concat([
        { value: completionTime, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: rational(1, completionTime.numerator + 1), misconceptionId: "RECIPROCAL_WRONG_DENOMINATOR" },
        { value: rational(1, Math.max(1, completionTime.numerator - 1)), misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);
    }

    case "findCompletionTimeFromOneUnitWork":
      return common.concat([
        { value: p.rate, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: add(answer, rational(1)), misconceptionId: "RECIPROCAL_WRONG_DENOMINATOR" },
        { value: subtract(answer, rational(1)), misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);

    case "findFractionCompletedInGivenTime":
      return common.concat([
        { value: subtract(rational(1), answer), misconceptionId: "REMAINING_REPORTED_AS_COMPLETED" },
        { value: p.rate, misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: divide(p.time, reciprocal(p.rate)), misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "findPercentCompletedInGivenTime":
      return common.concat([
        { value: completed, misconceptionId: "PERCENT_NOT_SCALED" },
        { value: percent(subtract(rational(1), completed)), misconceptionId: "REMAINING_REPORTED_AS_COMPLETED" },
        { value: percent(p.rate), misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);

    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent": {
      const wholeTime = reciprocal(p.rate);
      return common.concat([
        { value: divide(wholeTime, fraction), misconceptionId: "TARGET_FRACTION_INVERTED" },
        { value: multiply(wholeTime, subtract(rational(1), fraction)), misconceptionId: "TARGET_COMPLEMENT_USED" },
        { value: wholeTime, misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);
    }

    case "findRemainingFractionAfterTime":
      return common.concat([
        { value: completed, misconceptionId: "COMPLETED_REPORTED_AS_REMAINING" },
        { value: p.rate, misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: subtract(rational(1), p.rate), misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "findRemainingPercentAfterTime":
      return common.concat([
        { value: percent(completed), misconceptionId: "COMPLETED_REPORTED_AS_REMAINING" },
        { value: subtract(rational(100), completed), misconceptionId: "PERCENT_NOT_SCALED" },
        { value: percent(subtract(rational(1), p.rate)), misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);

    case "recoverWholeWorkFromPartAndFraction": {
      const partWork = required(p.partWork, "partWork");
      return common.concat([
        { value: multiply(partWork, fraction), misconceptionId: "PART_MULTIPLIED_INSTEAD_OF_DIVIDED" },
        { value: divide(partWork, subtract(rational(1), fraction)), misconceptionId: "PART_COMPLEMENT_USED" },
        { value: partWork, misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);
    }

    case "recoverWholeTimeFromPartCompletion": {
      const partTime = required(p.partTime, "partTime");
      return common.concat([
        { value: multiply(partTime, fraction), misconceptionId: "PART_MULTIPLIED_INSTEAD_OF_DIVIDED" },
        { value: divide(partTime, subtract(rational(1), fraction)), misconceptionId: "PART_COMPLEMENT_USED" },
        { value: partTime, misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);
    }

    case "convertRateAcrossTimeUnits": {
      const sourceDuration = required(p.sourceDuration, "sourceDuration");
      const targetDuration = required(p.targetDuration, "targetDuration");
      return common.concat([
        { value: multiply(p.totalWork, divide(sourceDuration, targetDuration)), misconceptionId: "UNIT_CONVERSION_REVERSED" },
        { value: p.totalWork, misconceptionId: "UNIT_CONVERSION_IGNORED" },
        { value: divide(p.totalWork, sourceDuration), misconceptionId: "FIRST_QUANTITY_REPORTED" },
      ]);
    }

    case "compareWorkCompletedAtEqualTime":
      return common.concat([
        { value: add(firstWork, secondWorkAtEqualTime), misconceptionId: "COMPARISON_SUM_INSTEAD_OF_DIFFERENCE" },
        { value: firstWork, misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: secondWorkAtEqualTime, misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "compareTimeForDifferentWorkAtSameRate":
      return common.concat([
        { value: add(firstTime, secondTime), misconceptionId: "COMPARISON_SUM_INSTEAD_OF_DIFFERENCE" },
        { value: firstTime, misconceptionId: "FIRST_QUANTITY_REPORTED" },
        { value: secondTime, misconceptionId: "SECOND_QUANTITY_REPORTED" },
      ]);

    case "findDelayFromReducedUniformRate":
    case "findTimeSavedFromIncreasedUniformRate":
      return common.concat([
        { value: changedTime, misconceptionId: "CHANGED_TOTAL_TIME_REPORTED" },
        { value: originalTime, misconceptionId: "ORIGINAL_TIME_REPORTED" },
        { value: multiply(originalTime, divide(required(p.changePercent, "changePercent"), rational(100))), misconceptionId: "PERCENT_OF_TIME_ONLY" },
      ]);
  }
}

export function buildTmwCp001Options(
  entry: TmwCp001RegistryEntry,
  p: TmwCp001Parameters,
  answer: Rational,
  seed: string,
): { optionAudit: TmwOption[]; correctIndex: number } {
  const candidates = distractorCandidates(entry, p, answer).filter((candidate) => positive(candidate.value));
  const unique: OptionCandidate[] = [];
  for (const candidate of candidates) {
    if (!unique.some((existing) => equals(existing.value, candidate.value))) unique.push(candidate);
  }

  let filler = 1;
  while (unique.length < 4) {
    const value = add(answer, rational(filler));
    if (!unique.some((candidate) => equals(candidate.value, value))) {
      unique.push({ value, misconceptionId: "FIRST_QUANTITY_REPORTED" });
    }
    filler += 1;
  }

  const selected = unique.slice(0, 4);
  const rotation = seedNumber(seed, "options") % 4;
  const rotated = selected.map((_, index) => selected[(index + rotation) % 4]);
  const optionAudit = rotated.map((candidate) => ({
    text: optionLabel(entry, p, candidate.value),
    value: candidate.value,
    misconceptionId: candidate.misconceptionId,
  }));
  return {
    optionAudit,
    correctIndex: optionAudit.findIndex((option) => option.misconceptionId === "CORRECT" && equals(option.value, answer)),
  };
}
