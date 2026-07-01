import { formatFraction, formatNumber, formatPercent, formatRatio, mathJaxLine, percentOf, roundTo } from "./math";
import {
  PERCENT_OF_KNOWN_NUMBER_EVIDENCE_VERSION,
  PERCENT_OF_KNOWN_NUMBER_METHOD_FAMILY,
  type PercentOfKnownNumberEvidence,
} from "./eev2/percent-of-known-number/evidence";
import type { Pct001Parameters, Pct001SolverResult } from "./types";

function value(parameters: Pct001Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function formatByAnswerType(parameters: Pct001Parameters, numericAnswer: number) {
  if (parameters.answerType === "PERCENT") return formatPercent(numericAnswer);
  if (parameters.answerType === "COUNT") return formatNumber(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}

function resolveEducationalQuantityUnit(parameters: Pct001Parameters): string {
  const semanticEntity = Object.values(parameters.semanticContext?.entities ?? {})[0];
  if (semanticEntity?.id) return semanticEntity.id;
  if (parameters.answerType === "COUNT") return "count";
  return "abstract-number";
}

export function solvePct001(parameters: Pct001Parameters): Pct001SolverResult {
  const t = parameters.taskKind;
  let numericAnswer: number | null = null;
  let answer = "";
  let educationalEvidence: PercentOfKnownNumberEvidence | undefined;

  if (t === "percentOf" || t === "directRelation") numericAnswer = percentOf(value(parameters, "percentageRate"), value(parameters, "baseValue"));
  else if (t === "percentToFraction") answer = formatFraction(value(parameters, "percentageRate") * 100, 10000);
  else if (t === "valueAsPercent") numericAnswer = value(parameters, "value") / value(parameters, "baseValue") * 100;
  else if (t === "moreToLess") numericAnswer = value(parameters, "percentageRate") / (100 + value(parameters, "percentageRate")) * 100;
  else if (t === "lessToMore") numericAnswer = value(parameters, "percentageRate") / (100 - value(parameters, "percentageRate")) * 100;
  else if (t === "ratioFromPercentEquality") answer = formatRatio(value(parameters, "rate2"), value(parameters, "rate1"));
  else if (t === "reversePercent") numericAnswer = value(parameters, "value") * 100 / value(parameters, "percentageRate");
  else if (t === "increaseNewValue") numericAnswer = value(parameters, "baseValue") * (100 + value(parameters, "percentageRate")) / 100;
  else if (t === "decreaseNewValue") numericAnswer = value(parameters, "baseValue") * (100 - value(parameters, "percentageRate")) / 100;
  else if (t === "reverseIncrease") numericAnswer = value(parameters, "finalValue") * 100 / (100 + value(parameters, "percentageRate"));
  else if (t === "reverseDecrease") numericAnswer = value(parameters, "finalValue") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "increaseByAmount") numericAnswer = value(parameters, "value") * 100 / value(parameters, "percentageRate");
  else if (t === "percentOfKnownNumber") {
    const knownUnitCount = value(parameters, "rate1");
    const knownQuantity = value(parameters, "value1");
    const targetUnitCount = value(parameters, "rate2");
    if (knownUnitCount <= 0) {
      throw new RangeError("percentOfKnownNumber requires a positive known unit count.");
    }
    if (![knownUnitCount, knownQuantity, targetUnitCount].every(Number.isFinite)) {
      throw new RangeError("percentOfKnownNumber requires finite source values.");
    }

    const singleUnitValue = knownQuantity / knownUnitCount;
    const targetQuantity = singleUnitValue * targetUnitCount;
    const quantityUnit = resolveEducationalQuantityUnit(parameters);
    numericAnswer = targetQuantity;
    educationalEvidence = {
      evidenceId: `${parameters.questionId}:unit-value-evidence`,
      evidenceVersion: PERCENT_OF_KNOWN_NUMBER_EVIDENCE_VERSION,
      taskKind: "percentOfKnownNumber",
      methodFamily: PERCENT_OF_KNOWN_NUMBER_METHOD_FAMILY,
      sourceValues: {
        knownUnitCount,
        knownQuantity,
        targetUnitCount,
      },
      derivedValues: {
        singleUnitValue,
        targetQuantity,
      },
      exactValues: {
        singleUnitValue: {
          numerator: knownQuantity,
          denominator: knownUnitCount,
        },
        targetQuantity: {
          numerator: knownQuantity * targetUnitCount,
          denominator: knownUnitCount,
        },
      },
      units: {
        knownUnitCount: "percentage-point",
        knownQuantity: quantityUnit,
        targetUnitCount: "percentage-point",
        singleUnitValue: quantityUnit,
        targetQuantity: quantityUnit,
      },
      metadata: {
        exactness: "rational",
        roundingPolicy: "defer-to-presentation",
        countIntegrity:
          parameters.answerType === "COUNT" ||
          Object.values(parameters.semanticContext?.entities ?? {}).some(
            (entity) => entity.numberType === "countable",
          )
            ? "required"
            : "not-required",
      },
    };
  }
  else if (t === "differenceOfPercents") numericAnswer = value(parameters, "value") * 100 / Math.abs(value(parameters, "rate1") - value(parameters, "rate2"));
  else if (t === "restoreAfterDecrease") numericAnswer = value(parameters, "percentageRate") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "successiveIncrease") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "successiveChange") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 - value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "compoundGrowth") numericAnswer = value(parameters, "initialValue") * (1 + value(parameters, "percentageRate") / 100) ** 2;
  else if (t === "compoundDecay") numericAnswer = value(parameters, "initialValue") * (1 - value(parameters, "percentageRate") / 100) ** 2;
  else if (t === "areaChange") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "squareAreaChange") numericAnswer = ((1 + value(parameters, "percentageRate") / 100) ** 2 - 1) * 100;
  else if (t === "invarianceDecrease" || t === "restoreAfterIncrease") numericAnswer = value(parameters, t === "restoreAfterIncrease" ? "rate1" : "percentageRate") * 100 / (100 + value(parameters, t === "restoreAfterIncrease" ? "rate1" : "percentageRate"));
  else if (t === "invarianceIncrease") numericAnswer = value(parameters, "percentageRate") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "revenueChange") numericAnswer = ((1 - value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "circleAreaDecrease") numericAnswer = (1 - (1 - value(parameters, "percentageRate") / 100) ** 2) * 100;
  else if (t === "incomePartition") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1") - value(parameters, "rate2") - value(parameters, "rate3"));
  else if (t === "successiveExpense") numericAnswer = value(parameters, "value") / ((1 - value(parameters, "rate1") / 100) * (1 - value(parameters, "rate2") / 100));
  else if (t === "winnerVotes") numericAnswer = value(parameters, "voteDifference") / ((2 * value(parameters, "percentageRate") - 100) / 100);
  else if (t === "cancelledVotes") numericAnswer = value(parameters, "voteDifference") / ((1 - value(parameters, "rate1") / 100) * ((2 * value(parameters, "rate2") - 100) / 100));
  else if (t === "passMarks") numericAnswer = (value(parameters, "marksObtained") + value(parameters, "failMargin")) * 100 / value(parameters, "passRate");
  else if (t === "partToTotal") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1"));
  else if (t === "complementOfTotal") numericAnswer = value(parameters, "totalPopulation") * (100 - value(parameters, "percentageRate")) / 100;
  else if (t === "moreMarksBase") numericAnswer = value(parameters, "marks") * 100 / (100 + value(parameters, "rate1"));
  else if (t === "twoShareRemainder") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1") - value(parameters, "rate2"));
  else if (t === "loserVotes") numericAnswer = value(parameters, "voteDifference") / ((100 - 2 * value(parameters, "rate1")) / 100);
  else if (t === "dilutionAddWater") numericAnswer = value(parameters, "totalMixture") * value(parameters, "percentageRate") / value(parameters, "newRate") - value(parameters, "totalMixture");
  else if (t === "dryFromFresh") numericAnswer = value(parameters, "totalQuantity") * (100 - value(parameters, "waterRate")) / (100 - value(parameters, "dryWaterRate"));
  else if (t === "addSolute" || t === "addPureComponent") numericAnswer = value(parameters, "totalMixture") * (value(parameters, "newRate") - value(parameters, "percentageRate")) / (100 - value(parameters, "newRate"));
  else if (t === "dilutedPercent") numericAnswer = value(parameters, "totalMixture") * value(parameters, "percentageRate") / (value(parameters, "totalMixture") + value(parameters, "value"));
  else if (t === "freshFromDry") numericAnswer = value(parameters, "value") * (100 - value(parameters, "rate2")) / (100 - value(parameters, "rate1"));
  else if (t === "evaporationOriginal") numericAnswer = value(parameters, "newRate") * value(parameters, "value") / (value(parameters, "newRate") - value(parameters, "percentageRate"));
  else if (t === "alloyComplement") numericAnswer = value(parameters, "totalWeight") * (100 - value(parameters, "percentageRate")) / 100;

  if (!answer) answer = formatByAnswerType(parameters, numericAnswer ?? 0);
  if (answer.includes("/")) {
    const [num, den] = answer.split("/");
    answer = `$$\\frac{${num}}{${den}}$$`;
  } else if (answer.includes(":")) {
    answer = `$$${answer.split(":").join(" : ")}$$`;
  } else if (answer.endsWith("%")) {
    answer = `$$${answer.slice(0, -1)}\\%$$`;
  } else {
    answer = `$$${answer}$$`;
  }
  const percentageRate = value(parameters, "percentageRate");
  const rate1 = value(parameters, "rate1");
  const rate2 = value(parameters, "rate2");
  const valueAmount = value(parameters, "value");
  const baseValue = value(parameters, "baseValue");
  const evidence: Record<string, string | number> = {
    ...parameters.variables,
    taskKind: t,
    answerType: parameters.answerType,
    answer,
    percentageRate: Number.isFinite(percentageRate) ? percentageRate : rate1,
    largerBase: roundTo(100 + percentageRate, 4),
    smallerBase: roundTo(100 - percentageRate, 4),
    changedBase: roundTo(
      t === "reverseDecrease" || t === "decreaseNewValue"
        ? 100 - percentageRate
        : 100 + (Number.isFinite(percentageRate) ? percentageRate : rate1),
      4,
    ),
    remainingBase: roundTo(100 - percentageRate, 4),
    changeAmount: roundTo(percentOf(percentageRate, baseValue), 4),
    percentDifference: roundTo(Math.abs(rate1 - rate2), 4),
    firstFactor: roundTo(1 + rate1 / 100, 4),
    secondFactor: roundTo(t === "successiveChange" || t === "revenueChange" ? 1 - rate2 / 100 : 1 + rate2 / 100, 4),
    singleFactor: roundTo(t === "compoundDecay" || t === "circleAreaDecrease" ? 1 - percentageRate / 100 : 1 + percentageRate / 100, 4),
    netFactor: roundTo(
      (1 + rate1 / 100) *
        (t === "successiveChange" || t === "revenueChange" ? 1 - rate2 / 100 : 1 + rate2 / 100),
      4,
    ),
    knownPercentage: roundTo(
      t === "partToTotal" || t === "moreMarksBase"
        ? 100 - rate1
        : t === "incomePartition"
          ? 100 - rate1 - rate2 - value(parameters, "rate3")
          : t === "twoShareRemainder"
            ? 100 - rate1 - rate2
            : t === "complementOfTotal"
              ? 100 - percentageRate
              : 100 - rate1,
      4,
    ),
    loserPercentage: roundTo(100 - percentageRate, 4),
    winnerPercentage: roundTo(100 - rate1, 4),
    gapPercentage: roundTo(
      t === "loserVotes"
        ? 100 - 2 * rate1
        : t === "winnerVotes"
          ? 2 * percentageRate - 100
          : Math.abs(rate1 - rate2),
      4,
    ),
    validPercentage: roundTo(100 - rate1, 4),
    effectiveGapPercentage: roundTo((1 - rate1 / 100) * (2 * rate2 - 100), 4),
    passMarksValue: roundTo(value(parameters, "marksObtained") + value(parameters, "failMargin"), 4),
    initialUnchangedAmount: roundTo(
      value(parameters, "totalMixture") * percentageRate / 100 ||
        value(parameters, "totalQuantity") * (100 - value(parameters, "waterRate")) / 100 ||
        value(parameters, "totalWeight") * (100 - percentageRate) / 100,
      4,
    ),
    value: Number.isFinite(valueAmount) ? valueAmount : "",
  };

  return {
    answer,
    numericAnswer: numericAnswer === null ? null : roundTo(numericAnswer, 4),
    answerType: parameters.answerType,
    evidence,
    educationalEvidence,
    mathJax: {
      setupLatex: mathJaxLine("setup", `${t}`),
      calculationLatex: mathJaxLine("answer", answer),
    },
  };
}
