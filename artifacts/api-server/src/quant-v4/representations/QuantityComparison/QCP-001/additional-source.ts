import { rational as workRat } from "../../../topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/rational";
import {
  canonicalAnswer,
  rat,
} from "../../../topics/Arithmetic/subtopics/Interest/INT-001/cp003-math-authority";
import { solveTmwCp002 } from "../../../topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp002-solver";
import { getTmwCp002Entry } from "../../../topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp002-registry";
import { solveTsdCp009 } from "../../../topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp009/executable-solver";
import { solveTsdCp008 } from "../../../topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp008/executable-solver";
import { solveLinearEquation } from "../../../shared/algebra/linear-equation";
import { solveProbability } from "../../../topics/Probability/PRB-002/foundation/solver";
import { PRB_001_LIBRARIES } from "../../../topics/Probability/PRB-001/foundation/library";
import { PRB_002_LIBRARIES } from "../../../topics/Probability/PRB-002/foundation/library";
import { getMen001SolveModeDefinition } from "../../../topics/AdvancedMathematics/subtopics/Mensuration/MEN-001/solve-mode-registry";
import { applyMalCp002SingleReplacement } from "../../../topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/cp002-solver";
import { solveFundamental } from "../../../topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/solver";
import { moneyFromRupees } from "../../../topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/money";
import type { Qcp001AdditionalState, Qcp001SourceState } from "./types";
export const ADDITIONAL_FAMILIES = [
  "COMPOUND_INTEREST",
  "WORK",
  "BOATS",
  "TRAINS",
  "AGES",
  "PROBABILITY",
  "MENSURATION",
  "REPLACEMENT",
  "PRICE_RECOVERY",
] as const;
export function isAdditional(s: Qcp001SourceState): s is Qcp001AdditionalState {
  return ADDITIONAL_FAMILIES.some((k) => k === s.kind);
}
export const ADDITIONAL_BINDINGS = {
  COMPOUND_INTEREST: ["INT-001", "annualCompound"],
  WORK: ["TMW-001", "combineWorkRates"],
  BOATS: ["TSD-002", "mediumJourney"],
  TRAINS: ["TSD-002", "trainCrossing"],
  AGES: ["ALG-001", "ageShift"],
  PROBABILITY: ["PRB-002", "urnProbability"],
  MENSURATION: ["MEN-001", "triangleMeasurement"],
  REPLACEMENT: ["MAL-001", "removeRefill"],
  PRICE_RECOVERY: ["PNL-001", "twoSellingConditions"],
} as const;
const scalar = (v: { numerator: bigint; denominator: bigint }) =>
  Number(v.numerator) / Number(v.denominator);
export function additionalResult(s: Qcp001AdditionalState): {
  value: number;
  text: string;
} {
  let result: { numerator: bigint; denominator: bigint };
  switch (s.kind) {
    case "COMPOUND_INTEREST":
      result = canonicalAnswer(
        s.task === "PRINCIPAL"
          ? {
              qlId: "INT-QL-055",
              amount: rat(s.amount),
              ratePercent: rat(s.rate),
              years: s.years,
            }
          : {
              qlId: s.task === "AMOUNT" ? "INT-QL-053" : "INT-QL-054",
              principal: rat(s.amount),
              ratePercent: rat(s.rate),
              years: s.years,
            },
      );
      break;
    case "WORK": {
      const answer = solveTmwCp002(
        getTmwCp002Entry(s.task === "COMBINED" ? "TMW-QL-021" : "TMW-QL-023"),
        {
          totalWork: workRat(1),
          timeUnit: "day",
          individualTimes: [workRat(s.firstTime), workRat(s.secondTime)],
          individualRates: [workRat(1, s.firstTime), workRat(1, s.secondTime)],
          combinedTime: workRat(s.combinedNumerator, s.combinedDenominator),
          context: {
            jobPhrase: "the job",
            agentNoun: "worker",
            outputNoun: "units",
          },
        },
      ).answer;
      result = rat(answer.numerator, answer.denominator);
      break;
    }
    case "BOATS": {
      const common = {
        bodyRelativeSpeed: rat(s.bodySpeed * 5, 18),
        mediumSpeed: rat(s.streamSpeed * 5, 18),
      };
      const r =
        s.task === "ROUND_TRIP"
          ? solveTsdCp009({
              authorityKey: "roundTripMediumState",
              ...common,
              oneWayDistance: rat(s.distance * 2000, 2),
              target: "TOTAL_TIME",
            })
          : solveTsdCp009({
              authorityKey: "mediumLegTravelState",
              ...common,
              direction: s.task === "UPSTREAM" ? "OPPOSED" : "ASSISTED",
              target: "TIME",
              distance: rat(s.distance * 2000, 2),
            });
      result = rat(r.value.numerator, r.value.denominator * 3600n);
      break;
    }
    case "TRAINS":
      result = solveTsdCp008(
        s.task === "OPPOSITE"
          ? {
              authorityKey: "oppositeDirectionTrainCrossingTime",
              lengthA: rat(s.lengthA),
              lengthB: rat(s.lengthB),
              speedA: rat(s.speedA),
              speedB: rat(s.speedB),
            }
          : {
              authorityKey: "sameDirectionTrainCrossingTime",
              lengthA: rat(s.lengthA),
              lengthB: rat(s.lengthB),
              fasterSpeed: rat(s.speedA),
              slowerSpeed: rat(s.speedB),
            },
      ).value;
      break;
    case "AGES": {
      const offset = s.task === "FUTURE" ? s.shift : -s.shift;
      const r = solveLinearEquation({
        leftCoefficient: rat(1),
        leftConstant: rat(s.difference + offset),
        rightCoefficient: rat(2),
        rightConstant: rat(2 * offset),
      });
      if (r.kind !== "UNIQUE") throw Error("Age source nonunique");
      result = r.value;
      break;
    }
    case "PROBABILITY": {
      const mode = {
        SINGLE: "findSingleDrawColourProbability",
        WITH_REPLACEMENT: "findWithReplacementProbability",
        WITHOUT_REPLACEMENT: "findWithoutReplacementProbability",
        CONDITIONAL: "findConditionalUrnProbability",
      }[s.task];
      const entry = [
        ...PRB_001_LIBRARIES.registry,
        ...PRB_002_LIBRARIES.registry,
      ].find((e) => e.solveMode === mode);
      if (!entry) throw Error("Missing probability authority");
      const r = solveProbability(
        entry,
        {
          kind: "URN_DRAW",
          stages: [],
          equallyLikely: true,
          replacementPolicy:
            s.task === "WITH_REPLACEMENT"
              ? "WITH_REPLACEMENT"
              : "WITHOUT_REPLACEMENT",
          orderPolicy: "ORDERED",
          sampleSpaceLabel: "distinct balls",
          metadata: {},
        },
        {
          type: "ATOMIC",
          eventId: "QCP-URN",
          label: "red ball",
          predicate: "URN_COLOUR_COUNT",
          args: {},
        },
        { red: s.red, blue: s.blue, draw: s.task === "SINGLE" ? 1 : 2 },
      );
      if (r.answer.kind !== "PROBABILITY")
        throw Error("Probability source nonscalar");
      result = r.answer.exact;
      break;
    }
    case "MENSURATION": {
      const mode =
        s.task === "TRIANGLE_AREA"
          ? "findTriangleAreaBaseHeight"
          : "findMissingHeightFromAreaAndBase";
      const r = getMen001SolveModeDefinition(mode).solve({
        packageId: "MEN-001",
        canonicalProblemId: "MEN-CP-001",
        questionId: "QCP-MEN",
        questionLanguageId: "QCP-MEN",
        language: "en",
        difficulty: "Medium",
        taskKind: "triangleMeasurementApplication",
        solveMode: mode,
        answerDimension: s.task === "TRIANGLE_AREA" ? "AREA" : "LENGTH",
        unitPolicy:
          s.task === "TRIANGLE_AREA" ? "SQUARE_CENTIMETRES" : "CENTIMETRES",
        seed: "QCP",
        renderVariables: {},
        values: { base: s.base, height: s.height, area: s.area },
      });
      if (r.exactAnswer.kind !== "INTEGER")
        throw Error("Unexpected mensuration result");
      result = rat(r.exactAnswer.value);
      break;
    }
    case "REPLACEMENT": {
      let state = { componentA: rat(s.milk), componentB: rat(s.water) };
      for (let i = 0; i < s.cycles; i++)
        state = applyMalCp002SingleReplacement(state, "B", rat(s.removed));
      result = state.componentA;
      break;
    }
    case "PRICE_RECOVERY": {
      const r = solveFundamental({
        mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
        difference: moneyFromRupees(s.difference),
        firstDirection: s.firstDirection,
        firstRatePercent: rat(s.firstRate),
        secondDirection: s.secondDirection,
        secondRatePercent: rat(s.secondRate),
      });
      if (r.mode !== "SP_DIFFERENCE_TWO_RATES_TO_CP")
        throw Error("Price recovery source mismatch");
      result = rat(r.costPrice.paise, 100);
      break;
    }
  }
  return {
    value: scalar(result),
    text:
      result.denominator === 1n
        ? String(result.numerator)
        : `${result.numerator}/${result.denominator}`,
  };
}
export function buildAdditional(
  family: (typeof ADDITIONAL_FAMILIES)[number],
  targets: readonly number[],
  variant: number,
): Qcp001AdditionalState[] {
  return targets.map((raw) => {
    const k = raw / 60;
    switch (family) {
      case "COMPOUND_INTEREST": {
        const task = (["AMOUNT", "INTEREST", "PRINCIPAL"] as const)[
            variant % 3
          ]!,
          target = k * 3600;
        return {
          kind: family,
          task,
          rate: 25,
          years: 2,
          amount:
            task === "AMOUNT"
              ? (target * 16) / 25
              : task === "INTEREST"
                ? (target * 16) / 9
                : (target * 25) / 16,
        };
      }
      case "WORK": {
        const t = raw / 30;
        return {
          kind: family,
          task: variant % 2 ? "MISSING" : "COMBINED",
          firstTime: variant % 2 ? 2 * t : 3 * t,
          secondTime: variant % 2 ? t : (3 * t) / 2,
          combinedNumerator: variant % 2 ? 2 * t : t,
          combinedDenominator: variant % 2 ? 3 : 1,
        };
      }
      case "BOATS": {
        const bodySpeed = variant % 3 === 2 ? 16 : 12 + 4 * (variant % 3),
          streamSpeed = bodySpeed / 4,
          task = (["UPSTREAM", "DOWNSTREAM", "ROUND_TRIP"] as const)[
            variant % 3
          ]!;
        return {
          kind: family,
          task,
          bodySpeed,
          streamSpeed,
          distance:
            task === "ROUND_TRIP"
              ? (k * (bodySpeed * bodySpeed - streamSpeed * streamSpeed)) /
                (2 * bodySpeed)
              : k *
                (bodySpeed +
                  (task === "UPSTREAM" ? -streamSpeed : streamSpeed)),
        };
      }
      case "TRAINS": {
        const task = variant % 2 ? "SAME" : "OPPOSITE",
          speedA = 15,
          speedB = 5,
          total = (raw / 30) * (task === "SAME" ? 10 : 20);
        return {
          kind: family,
          task,
          speedA,
          speedB,
          lengthA: total / 2,
          lengthB: total / 2,
        };
      }
      case "AGES": {
        const task = variant % 2 ? "PAST" : "FUTURE",
          shift = 3 + (variant % 4),
          target = k + 20;
        return {
          kind: family,
          task,
          shift,
          difference: target + (task === "FUTURE" ? shift : -shift),
        };
      }
      case "PROBABILITY":
        return {
          kind: family,
          task: (
            [
              "SINGLE",
              "WITH_REPLACEMENT",
              "WITHOUT_REPLACEMENT",
              "CONDITIONAL",
            ] as const
          )[variant % 4]!,
          red: k,
          blue: 20 - k,
        };
      case "MENSURATION": {
        const task = variant % 2 ? "TRIANGLE_HEIGHT" : "TRIANGLE_AREA",
          target = k * 12,
          base = 6;
        return {
          kind: family,
          task,
          base,
          height: task === "TRIANGLE_AREA" ? target / 3 : target,
          area: task === "TRIANGLE_AREA" ? target : 3 * target,
        };
      }
      case "REPLACEMENT": {
        const cycles = 1 + (variant % 2),
          milk = k * 36 * 2 ** cycles,
          water = milk / 4;
        return {
          kind: family,
          task: "REMOVE_REFILL",
          milk,
          water,
          removed: (milk + water) / 2,
          cycles,
        };
      }
      case "PRICE_RECOVERY": {
        const firstRate = variant % 2 ? 25 : 20,
          secondRate = 10,
          firstDirection = "PROFIT",
          secondDirection = variant % 3 ? "LOSS" : "PROFIT";
        return {
          kind: family,
          task: "COST_PRICE",
          firstRate,
          secondRate,
          firstDirection,
          secondDirection,
          difference:
            k *
            (firstRate +
              (secondDirection === "LOSS" ? secondRate : -secondRate)),
        };
      }
    }
  });
}
