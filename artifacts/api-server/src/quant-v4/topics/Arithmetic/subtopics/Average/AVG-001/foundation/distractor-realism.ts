import {
  add,
  divide,
  formatRational,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import type {
  Avg001DisplayPolicy,
  Avg001QuestionPackage,
  Rational,
} from "./types";

type Candidate = {
  strategyId: string;
  value: Rational;
};

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function absolute(value: Rational) {
  return rational(Math.abs(value.numerator), value.denominator);
}

function sum(values: readonly Rational[]) {
  return values.reduce((current, value) => add(current, value), rational(0));
}

function average(values: readonly Rational[]) {
  return divide(sum(values), rational(values.length));
}

function numericVariable(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  return `${sign}${leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}${decimal}`;
}

function answerPolicy(pkg: Avg001QuestionPackage): Avg001DisplayPolicy {
  return pkg.parameters.answerType === "COUNT"
    ? "EXACT_INTEGER"
    : pkg.parameters.displayPolicy;
}

function formatLikeAnswer(pkg: Avg001QuestionPackage, value: Rational) {
  if (pkg.parameters.answerType === "RATIO") {
    return `${value.numerator}:${value.denominator}`;
  }

  const policy = answerPolicy(pkg);
  const rendered = formatRational(value, policy);
  const canonicalRaw = formatRational(pkg.solver.exactAnswer, policy);
  if (pkg.answer === canonicalRaw) return rendered;
  if (pkg.answer.startsWith("₹")) return `₹${groupIndianDigits(rendered)}`;
  if (pkg.answer.includes(canonicalRaw)) {
    return pkg.answer.replace(canonicalRaw, rendered);
  }

  const match = pkg.answer.match(/^([^0-9-]*)(-?[0-9][0-9,]*(?:\.[0-9]+)?(?:\/[0-9]+)?)(.*)$/);
  if (match) return `${match[1]}${rendered}${match[3]}`;
  return rendered;
}

function isPlausible(pkg: Avg001QuestionPackage, value: Rational) {
  if (pkg.parameters.answerType === "COUNT") {
    return value.denominator === 1 && value.numerator > 0;
  }
  if (pkg.parameters.answerType === "RATIO") {
    return value.numerator > 0 && value.denominator > 0;
  }
  if (/₹| years| kg| units| marks| runs| km\/h/.test(pkg.answer)) {
    return toNumber(value) >= 0;
  }
  return true;
}

function addCandidate(
  candidates: Candidate[],
  strategyId: string,
  build: () => Rational | undefined,
) {
  try {
    const value = build();
    if (value) candidates.push({ strategyId, value });
  } catch {
    // A candidate can be inapplicable for a particular exact state.
  }
}

function misconceptionCandidates(pkg: Avg001QuestionPackage) {
  const candidates: Candidate[] = [];
  const values = pkg.parameters.values;
  const answer = pkg.solver.exactAnswer;
  const count = rational(values.count);
  const oldCount = rational(values.oldCount ?? values.count);
  const newCount = rational(values.newCount ?? values.count);
  const currentAverage = values.currentAverage ?? values.oldAverage ?? values.average;
  const newAverage = values.newAverage ?? values.average;
  const currentTotal = values.currentTotal ?? values.oldTotal ?? multiply(currentAverage, oldCount);
  const newTotal = values.newTotal ?? multiply(newAverage, newCount);
  const step = pkg.parameters.displayPolicy === "EXACT_DECIMAL_1"
    ? rational(1, 10)
    : pkg.parameters.displayPolicy === "EXACT_DECIMAL_2"
      ? rational(1, 100)
      : rational(1);
  const put = (strategyId: string, build: () => Rational | undefined) =>
    addCandidate(candidates, `misconception:${strategyId}`, build);

  switch (pkg.solveMode) {
    case "findSumFromAverageAndCount":
      put("used-one-fewer-item", () => multiply(values.average, rational(values.count - 1)));
      put("used-one-extra-item", () => multiply(values.average, rational(values.count + 1)));
      put("added-average-and-count", () => add(values.average, count));
      break;
    case "findAverageFromSumAndCount":
      put("divided-by-one-fewer-item", () => divide(values.total, rational(values.count - 1)));
      put("divided-by-one-extra-item", () => divide(values.total, rational(values.count + 1)));
      put("reported-count-instead-of-average", () => count);
      break;
    case "findCountFromSumAndAverage":
      put("off-by-one-lower-count", () => subtract(answer, rational(1)));
      put("off-by-one-higher-count", () => add(answer, rational(1)));
      put("divided-by-average-plus-one", () => divide(values.total, add(values.average, rational(1))));
      put("divided-by-average-minus-one", () => divide(values.total, subtract(values.average, rational(1))));
      break;
    case "findMissingValueFromAverage":
      put("used-known-count-as-full-count", () =>
        subtract(
          multiply(values.average, rational(values.knownCount ?? Math.max(1, values.count - 1))),
          values.knownTotal ?? rational(0),
        ));
      put("used-average-as-missing-value", () => values.average);
      put("added-one-extra-average", () => add(answer, values.average));
      put("subtracted-one-extra-average", () => subtract(answer, values.average));
      break;
    case "findAverageAfterUniformTransformation": {
      const factor = numericVariable(pkg, "factor") ?? 1;
      const change = numericVariable(pkg, "change") ?? 0;
      const oldAverage = values.oldAverage ?? values.average;
      put("forgot-multiplication", () => add(oldAverage, rational(change)));
      put("forgot-addition", () => multiply(oldAverage, rational(factor)));
      put("applied-addition-before-multiplication", () => multiply(add(oldAverage, rational(change)), rational(factor)));
      put("used-wrong-sign-for-change", () => subtract(multiply(oldAverage, rational(factor)), rational(change)));
      break;
    }
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet": {
      const first = values.firstTerm!;
      const last = values.lastTerm!;
      put("forgot-to-divide-endpoint-sum", () => add(first, last));
      put("selected-first-term", () => first);
      put("selected-last-term", () => last);
      put("selected-lower-middle", () => values.lowerMiddleTerm);
      put("selected-upper-middle", () => values.upperMiddleTerm);
      break;
    }
    case "findMiddleTermFromAverage":
      put("moved-one-common-difference-left", () => subtract(values.average, values.commonDifference!));
      put("moved-one-common-difference-right", () => add(values.average, values.commonDifference!));
      put("selected-first-term", () => values.firstTerm);
      put("selected-last-term", () => values.lastTerm);
      break;
    case "findExtremeFromAverageAndCount": {
      const direction = values.targetExtreme === "smallest" ? -1 : 1;
      put("selected-opposite-extreme", () => values.targetExtreme === "smallest" ? values.lastTerm : values.firstTerm);
      put("selected-average", () => values.average);
      put("used-count-instead-of-count-minus-one", () =>
        add(
          values.average,
          multiply(
            divide(multiply(rational(values.count), values.commonDifference!), rational(2)),
            rational(direction),
          ),
        ));
      put("missed-one-gap", () => add(answer, multiply(values.commonDifference!, rational(-direction))));
      break;
    }
    case "findTermCountFromAverageAndExtreme": {
      const extreme = rational(numericVariable(pkg, "extremeValue") ?? 0);
      const averageValue = rational(numericVariable(pkg, "average") ?? 0);
      const difference = rational(numericVariable(pkg, "commonDifference") ?? 1);
      const oneSide = divide(absolute(subtract(extreme, averageValue)), difference);
      put("counted-one-side-gaps-only", () => oneSide);
      put("forgot-central-term", () => multiply(oneSide, rational(2)));
      put("counted-one-side-plus-centre", () => add(oneSide, rational(1)));
      put("added-two-central-terms", () => add(multiply(oneSide, rational(2)), rational(2)));
      break;
    }
    case "findCommonDifferenceFromAverageCountAndExtreme": {
      const extreme = rational(numericVariable(pkg, "extremeValue") ?? 0);
      const averageValue = rational(numericVariable(pkg, "average") ?? 0);
      const span = absolute(subtract(extreme, averageValue));
      put("divided-by-total-gaps", () => divide(span, rational(values.count - 1)));
      put("divided-by-term-count", () => divide(span, count));
      put("used-one-extra-side-gap", () => divide(span, rational((values.count + 1) / 2)));
      put("used-one-fewer-side-gap", () => divide(span, rational(Math.max(1, (values.count - 3) / 2))));
      break;
    }
    case "findNewAverageAfterAddition":
      put("divided-new-total-by-old-count", () => divide(newTotal, oldCount));
      put("divided-old-total-by-new-count", () => divide(currentTotal, newCount));
      put("kept-old-average", () => currentAverage);
      put("used-added-value-as-average", () => values.addedValue);
      break;
    case "findNewAverageAfterRemoval":
      put("divided-remaining-total-by-old-count", () => divide(newTotal, oldCount));
      put("divided-old-total-by-remaining-count", () => divide(currentTotal, newCount));
      put("kept-old-average", () => currentAverage);
      put("used-removed-value-as-average", () => values.removedValue);
      break;
    case "findNewAverageAfterReplacement":
      put("forgot-to-remove-old-value", () => divide(add(currentTotal, values.newValue!), oldCount));
      put("forgot-to-add-new-value", () => divide(subtract(currentTotal, values.oldValue!), oldCount));
      put("kept-old-average", () => currentAverage);
      put("used-replacement-value-as-average", () => values.newValue);
      break;
    case "findAddedMemberValueFromShift":
      put("used-old-count-for-target-total", () => subtract(multiply(newAverage, oldCount), currentTotal));
      put("multiplied-average-rise-by-old-count", () => multiply(subtract(newAverage, currentAverage), oldCount));
      put("used-new-average-as-member-value", () => newAverage);
      put("used-average-rise-only", () => subtract(newAverage, currentAverage));
      break;
    case "findRemovedMemberValueFromShift":
      put("used-old-count-for-remaining-total", () => subtract(currentTotal, multiply(newAverage, oldCount)));
      put("multiplied-average-change-by-new-count", () => multiply(absolute(subtract(newAverage, currentAverage)), newCount));
      put("used-new-average-as-member-value", () => newAverage);
      put("used-average-change-only", () => absolute(subtract(newAverage, currentAverage)));
      break;
    case "findReplacementValueFromShift": {
      const totalChange = subtract(newTotal, currentTotal);
      put("reversed-total-change", () =>
        values.replacementTarget === "old"
          ? subtract(values.newValue!, totalChange)
          : subtract(values.oldValue!, totalChange));
      put("used-average-change-instead-of-total-change", () =>
        values.replacementTarget === "old"
          ? add(values.newValue!, subtract(newAverage, currentAverage))
          : add(values.oldValue!, subtract(newAverage, currentAverage)));
      put("selected-known-replacement-value", () => values.replacementTarget === "old" ? values.newValue : values.oldValue);
      put("used-total-change-as-answer", () => absolute(totalChange));
      break;
    }
    case "findInningsValueOrNewCricketAverage":
      if (pkg.parameters.answerType === "AVERAGE") {
        put("divided-new-total-by-old-innings", () => divide(newTotal, oldCount));
        put("divided-old-total-by-new-innings", () => divide(currentTotal, newCount));
        put("kept-old-average", () => currentAverage);
        put("used-next-score-as-average", () => values.nextScore);
      } else {
        put("forgot-new-innings-in-target-total", () => subtract(multiply(newAverage, oldCount), currentTotal));
        put("used-target-average-as-score", () => newAverage);
        put("multiplied-average-rise-by-old-innings", () => multiply(subtract(newAverage, currentAverage), oldCount));
        put("used-average-rise-only", () => subtract(newAverage, currentAverage));
      }
      break;
    case "findOriginalCountFromJoiningMemberShift": {
      const memberValue = values.addedValue ?? rational(numericVariable(pkg, "memberValue") ?? 0);
      const shift = values.averageChange ?? rational(numericVariable(pkg, "averageChange") ?? 1);
      const quotient = divide(subtract(memberValue, values.oldAverage ?? values.average), shift);
      put("forgot-to-remove-new-member", () => quotient);
      put("used-opposite-one-member-adjustment", () => add(quotient, rational(1)));
      put("off-by-one-lower-count", () => subtract(answer, rational(1)));
      put("off-by-one-higher-count", () => add(answer, rational(1)));
      break;
    }
    case "findOriginalCountFromLeavingMemberShift": {
      const memberValue = values.removedValue ?? rational(numericVariable(pkg, "memberValue") ?? 0);
      const shift = values.averageChange ?? rational(numericVariable(pkg, "averageChange") ?? 1);
      const quotient = divide(absolute(subtract(memberValue, values.oldAverage ?? values.average)), shift);
      put("forgot-to-include-leaving-member", () => quotient);
      put("used-opposite-one-member-adjustment", () => subtract(quotient, rational(1)));
      put("off-by-one-lower-count", () => subtract(answer, rational(1)));
      put("off-by-one-higher-count", () => add(answer, rational(1)));
      break;
    }
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups": {
      const averages = values.groupAverages ?? [];
      put("used-unweighted-mean", () => average(averages));
      put("selected-first-group-average", () => averages[0]);
      put("selected-last-group-average", () => averages.at(-1));
      put("divided-by-one-fewer-member", () => divide(values.combinedTotal!, rational(values.combinedCount! - 1)));
      put("divided-by-one-extra-member", () => divide(values.combinedTotal!, rational(values.combinedCount! + 1)));
      break;
    }
    case "findGroupCountFromCombinedAverage":
      put("used-known-group-count", () => rational(values.knownGroupCount!));
      put("used-combined-count", () => rational(values.combinedCount!));
      put("off-by-one-lower-count", () => subtract(answer, rational(1)));
      put("off-by-one-higher-count", () => add(answer, rational(1)));
      break;
    case "findMissingGroupAverage": {
      const knownTotal = multiply(values.knownGroupAverage!, rational(values.knownGroupCount!));
      put("used-combined-average", () => values.combinedAverage);
      put("used-known-group-average", () => values.knownGroupAverage);
      put("ignored-group-sizes", () => subtract(multiply(values.combinedAverage!, rational(2)), values.knownGroupAverage!));
      put("divided-missing-total-by-combined-count", () => divide(subtract(values.combinedTotal!, knownTotal), rational(values.combinedCount!)));
      break;
    }
    case "findAverageSpeedEqualDistance":
      put("used-arithmetic-mean", () => divide(add(values.speed1!, values.speed2!), rational(2)));
      put("forgot-factor-two-in-harmonic-mean", () => divide(multiply(values.speed1!, values.speed2!), add(values.speed1!, values.speed2!)));
      put("selected-first-speed", () => values.speed1);
      put("selected-second-speed", () => values.speed2);
      break;
    case "findAverageSpeedEqualTime":
      put("used-equal-distance-harmonic-mean", () => divide(multiply(rational(2), multiply(values.speed1!, values.speed2!)), add(values.speed1!, values.speed2!)));
      put("selected-first-speed", () => values.speed1);
      put("selected-second-speed", () => values.speed2);
      put("used-speed-difference", () => absolute(subtract(values.speed2!, values.speed1!)));
      break;
    case "findGroupCountRatioFromCombinedAverage": {
      const lower = numericVariable(pkg, "groupAverage1") ?? toNumber(values.groupAverages?.[0] ?? rational(0));
      const upper = numericVariable(pkg, "groupAverage2") ?? toNumber(values.groupAverages?.[1] ?? rational(0));
      const combined = numericVariable(pkg, "combinedAverage") ?? toNumber(values.combinedAverage ?? rational(0));
      put("inverted-alligation-ratio", () => rational(answer.denominator, answer.numerator));
      put("used-full-spread-as-first-weight", () => rational(Math.abs(upper - lower), Math.abs(combined - lower)));
      put("used-full-spread-as-second-weight", () => rational(Math.abs(upper - combined), Math.abs(upper - lower)));
      put("added-ratio-parts", () => rational(answer.numerator + answer.denominator, answer.denominator));
      break;
    }
    case "findAverageSpeedForUnequalDistances": {
      const distance1 = rational(numericVariable(pkg, "distance1") ?? 1);
      const distance2 = rational(numericVariable(pkg, "distance2") ?? 1);
      put("used-arithmetic-mean", () => divide(add(values.speed1!, values.speed2!), rational(2)));
      put("used-equal-distance-harmonic-mean", () => divide(multiply(rational(2), multiply(values.speed1!, values.speed2!)), add(values.speed1!, values.speed2!)));
      put("weighted-speeds-by-distance", () => divide(add(multiply(distance1, values.speed1!), multiply(distance2, values.speed2!)), add(distance1, distance2)));
      put("selected-first-speed", () => values.speed1);
      break;
    }
    case "findAverageSpeedForUnequalTimes": {
      put("used-arithmetic-mean", () => divide(add(values.speed1!, values.speed2!), rational(2)));
      put("used-equal-distance-harmonic-mean", () => divide(multiply(rational(2), multiply(values.speed1!, values.speed2!)), add(values.speed1!, values.speed2!)));
      put("selected-first-speed", () => values.speed1);
      put("selected-second-speed", () => values.speed2);
      break;
    }
    case "findCorrectedAverageFromMistake": {
      const delta = subtract(values.correctValue!, values.incorrectValue!);
      put("applied-correction-in-wrong-direction", () => subtract(values.reportedAverage!, divide(delta, count)));
      put("added-full-entry-correction", () => add(values.reportedAverage!, delta));
      put("kept-reported-average", () => values.reportedAverage);
      put("divided-by-one-fewer-item", () => add(values.reportedAverage!, divide(delta, rational(values.count - 1))));
      break;
    }
    case "findReportedAverageBeforeCorrection": {
      const delta = subtract(values.correctValue!, values.incorrectValue!);
      put("applied-correction-in-wrong-direction", () => add(values.correctedAverage!, divide(delta, count)));
      put("subtracted-full-entry-correction", () => subtract(values.correctedAverage!, delta));
      put("used-corrected-average", () => values.correctedAverage);
      put("divided-by-one-extra-item", () => subtract(values.correctedAverage!, divide(delta, rational(values.count + 1))));
      break;
    }
    case "findCorrectValueFromAverageShift": {
      const gap = subtract(values.correctedAverage!, values.reportedAverage!);
      put("forgot-to-multiply-average-shift-by-count", () => add(values.incorrectValue!, gap));
      put("used-opposite-correction-direction", () => subtract(values.incorrectValue!, multiply(gap, count)));
      put("kept-incorrect-entry", () => values.incorrectValue);
      put("used-corrected-average-as-entry", () => values.correctedAverage);
      break;
    }
    case "findIncorrectValueFromCorrection": {
      const gap = subtract(values.correctedAverage!, values.reportedAverage!);
      put("forgot-to-multiply-average-shift-by-count", () => subtract(values.correctValue!, gap));
      put("used-opposite-correction-direction", () => add(values.correctValue!, multiply(gap, count)));
      put("kept-correct-entry", () => values.correctValue);
      put("used-reported-average-as-entry", () => values.reportedAverage);
      break;
    }
    case "findEntryDifferenceFromAverageCorrection":
      put("used-average-change-as-entry-difference", () => values.averageChange);
      put("multiplied-by-one-fewer-item", () => multiply(values.averageChange!, rational(values.count - 1)));
      put("multiplied-by-one-extra-item", () => multiply(values.averageChange!, rational(values.count + 1)));
      put("used-average-gap-only", () => absolute(subtract(values.correctedAverage!, values.reportedAverage!)));
      break;
    case "findAverageChangeFromEntryCorrection":
      put("forgot-to-divide-by-count", () => values.entryDifference);
      put("divided-by-one-fewer-item", () => divide(values.entryDifference!, rational(values.count - 1)));
      put("divided-by-one-extra-item", () => divide(values.entryDifference!, rational(values.count + 1)));
      put("used-corrected-average", () => values.correctedAverage);
      break;
    case "findNumberOfItemsFromTotalCorrection":
      put("multiplied-instead-of-dividing", () => multiply(values.entryDifference!, values.averageChange!));
      put("off-by-one-lower-count", () => subtract(answer, rational(1)));
      put("off-by-one-higher-count", () => add(answer, rational(1)));
      put("used-entry-difference-as-count", () => values.entryDifference);
      break;
    case "findCorrectedAverageFromMultipleMistakes": {
      const firstDelta = subtract(values.correctValues?.[0] ?? rational(0), values.incorrectValues?.[0] ?? rational(0));
      put("corrected-only-first-mistake", () => add(values.reportedAverage!, divide(firstDelta, count)));
      put("applied-net-correction-in-wrong-direction", () => subtract(values.reportedAverage!, divide(values.netCorrection!, count)));
      put("added-net-correction-without-dividing", () => add(values.reportedAverage!, values.netCorrection!));
      put("kept-reported-average", () => values.reportedAverage);
      break;
    }
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": {
      const subgroupAverages = values.subgroupAverages ?? [];
      put("used-unweighted-mean", () => average(subgroupAverages));
      put("selected-first-subgroup-average", () => subgroupAverages[0]);
      put("selected-last-subgroup-average", () => subgroupAverages.at(-1));
      put("averaged-first-two-subgroups-only", () => average(subgroupAverages.slice(0, 2)));
      break;
    }
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": {
      const subgroupAverages = values.subgroupAverages ?? [];
      const knownTotal = sum((values.subgroupTotals ?? []).slice(0, 2));
      put("used-overall-average", () => values.overallAverage);
      put("used-unweighted-mean-of-known-groups", () => average(subgroupAverages.slice(0, 2)));
      put("divided-missing-total-by-overall-count", () => divide(subtract(values.overallTotal!, knownTotal), rational(values.overallCount!)));
      put("mirrored-first-average-around-overall", () => subtract(multiply(values.overallAverage!, rational(2)), subgroupAverages[0]!));
      break;
    }
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": {
      const subgroupCounts = values.subgroupCounts ?? [];
      put("used-largest-known-subgroup-count", () => rational(Math.max(...subgroupCounts.slice(0, 2))));
      put("used-overall-count", () => rational(values.overallCount!));
      put("used-sum-of-known-counts", () => rational(subgroupCounts.slice(0, 2).reduce((total, value) => total + value, 0)));
      put("off-by-one-higher-count", () => add(answer, rational(1)));
      break;
    }
    case "findSubgroupTotalFromAverageAndCount": {
      const subgroupCounts = values.subgroupCounts ?? [];
      const subgroupAverages = values.subgroupAverages ?? [];
      put("added-average-and-count", () => add(subgroupAverages[0]!, rational(subgroupCounts[0]!)));
      put("used-overall-count", () => multiply(subgroupAverages[0]!, rational(values.overallCount!)));
      put("used-overall-total", () => values.overallTotal);
      put("used-second-subgroup-total", () => values.subgroupTotals?.[1]);
      break;
    }
    case "findOverallTotalFromHierarchy": {
      const subgroupAverages = values.subgroupAverages ?? [];
      const subgroupTotals = values.subgroupTotals ?? [];
      put("added-averages-without-counts", () => sum(subgroupAverages));
      put("multiplied-average-by-number-of-groups", () => multiply(values.overallAverage!, rational(subgroupAverages.length)));
      put("omitted-last-subgroup-total", () => sum(subgroupTotals.slice(0, -1)));
      put("used-largest-subgroup-total", () => subgroupTotals.reduce((largest, value) => toNumber(value) > toNumber(largest) ? value : largest));
      break;
    }
  }

  put("one-display-step-low", () => subtract(answer, step));
  put("one-display-step-high", () => add(answer, step));
  put("double-counted-result", () => multiply(answer, rational(2)));
  put("halved-result", () => divide(answer, rational(2)));
  return candidates;
}

export function applyAvg001DistractorRealism(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const correct = pkg.answer;
  const selected: Array<{ strategyId: string; rendered: string }> = [];

  for (const candidate of misconceptionCandidates(pkg)) {
    if (!isPlausible(pkg, candidate.value)) continue;
    let rendered: string;
    try {
      rendered = formatLikeAnswer(pkg, candidate.value);
    } catch {
      continue;
    }
    if (rendered === correct || selected.some((item) => item.rendered === rendered)) continue;
    selected.push({ strategyId: candidate.strategyId, rendered });
    if (selected.length === 3) break;
  }

  if (selected.length !== 3) {
    throw new Error(
      `AVG-001 could not build three misconception distractors for ${pkg.questionLanguageId}`,
    );
  }

  const correctIndex = hash(`${pkg.seed}:${pkg.questionLanguageId}:misconception-options-v1`) % 4;
  const options = selected.map((item) => item.rendered);
  options.splice(correctIndex, 0, correct);

  if (
    options.length !== 4 ||
    new Set(options).size !== 4 ||
    options[correctIndex] !== correct ||
    options.filter((option) => option === correct).length !== 1
  ) {
    throw new Error(`Invalid misconception option set for ${pkg.questionLanguageId}`);
  }

  return {
    ...pkg,
    options,
    correctIndex,
    validation: {
      ...pkg.validation,
      checks: [
        ...pkg.validation.checks,
        {
          name: "distractor-realism",
          passed: true,
          message: "All three wrong options come from solve-mode-specific misconception strategies",
        },
      ],
    },
    traceability: {
      ...pkg.traceability,
      distractorPolicy: "MISCONCEPTION_V1",
      distractorStrategyIds: selected.map((item) => item.strategyId),
    },
  };
}
