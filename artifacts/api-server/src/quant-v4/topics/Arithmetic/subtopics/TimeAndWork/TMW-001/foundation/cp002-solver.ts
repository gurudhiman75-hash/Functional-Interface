import { add, divide, equals, formatRational, formatTimeText, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp002Parameters, TmwCp002RegistryEntry, TmwCp002Solution } from "./cp002-types";

export function sumTmwRates(rates: Rational[]): Rational {
  return rates.reduce((total, rate) => add(total, rate), rational(0));
}

export function signedKnownTotal(p: TmwCp002Parameters): Rational {
  return required(p.signedKnownRates, "signedKnownRates").reduce(
    (total, item) => item.sign === 1 ? add(total, item.rate) : subtract(total, item.rate),
    rational(0),
  );
}

function pluralize(noun: string, value: Rational): string {
  if (equals(value, rational(1))) return noun;
  if (noun.endsWith("y")) return `${noun.slice(0, -1)}ies`;
  if (noun.endsWith("s")) return noun;
  return `${noun}s`;
}

function answerText(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, answer: Rational): string {
  const value = formatRational(answer);
  if (entry.answerType === "TIME") return formatTimeText(answer, p.timeUnit, `${p.timeUnit}s`);
  if (entry.answerType === "FRACTION") return `${value} of the assignment`;
  if (entry.answerType === "COUNT") return `${value} ${pluralize(p.context.agentNoun, answer)}`;
  if (entry.answerType === "OUTPUT") return `${value} ${p.context.outputNoun}`;
  return `${value} ${p.context.outputNoun} per ${p.timeUnit}`;
}

function pairRateLatex(times: Rational[]): string {
  return times.map((time) => `\\frac{1}{${toLatex(time)}}`).join("+");
}

export function solveTmwCp002(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters): TmwCp002Solution {
  let answer: Rational;
  let formulaLatex: string;
  let workedLatex: string[];

  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes": {
      const combinedRate = sumTmwRates(p.individualRates);
      answer = reciprocal(combinedRate);
      formulaLatex = "r_{combined}=\\sum_i\\frac{1}{T_i},\\qquad T_{combined}=\\frac{1}{r_{combined}}";
      workedLatex = [
        `r_{combined}=${pairRateLatex(p.individualTimes)}=${toLatex(combinedRate)}`,
        `T_{combined}=\\frac{1}{${toLatex(combinedRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findCombinedWorkInGivenTime": {
      const duration = required(p.duration, "duration");
      const combinedRate = sumTmwRates(p.individualRates);
      answer = multiply(combinedRate, duration);
      formulaLatex = "W_{done}=\\left(\\sum_i\\frac{1}{T_i}\\right)t";
      workedLatex = [
        `r_{combined}=${pairRateLatex(p.individualTimes)}=${toLatex(combinedRate)}`,
        `W_{done}=${toLatex(combinedRate)}\\times${toLatex(duration)}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": {
      const combinedTime = required(p.combinedTime, "combinedTime");
      const knownTimes = p.individualTimes.slice(0, -1);
      const knownRates = knownTimes.map(reciprocal);
      const missingRate = subtract(reciprocal(combinedTime), sumTmwRates(knownRates));
      answer = reciprocal(missingRate);
      formulaLatex = "r_{missing}=r_{combined}-\\sum r_{known},\\qquad T_{missing}=\\frac{1}{r_{missing}}";
      workedLatex = [
        `r_{missing}=\\frac{1}{${toLatex(combinedTime)}}-\\left(${pairRateLatex(knownTimes)}\\right)=${toLatex(missingRate)}`,
        `T_{missing}=\\frac{1}{${toLatex(missingRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findAllTogetherTimeFromPairwiseTimes": {
      const pairwise = required(p.pairwiseTimes, "pairwiseTimes");
      const pairRateSum = add(add(reciprocal(pairwise.ab), reciprocal(pairwise.bc)), reciprocal(pairwise.ca));
      const allRate = divide(pairRateSum, rational(2));
      answer = reciprocal(allRate);
      formulaLatex = "2(r_A+r_B+r_C)=r_{AB}+r_{BC}+r_{CA}";
      workedLatex = [
        `2r_{ABC}=\\frac{1}{${toLatex(pairwise.ab)}}+\\frac{1}{${toLatex(pairwise.bc)}}+\\frac{1}{${toLatex(pairwise.ca)}}=${toLatex(pairRateSum)}`,
        `r_{ABC}=\\frac{${toLatex(pairRateSum)}}{2}=${toLatex(allRate)}`,
        `T_{ABC}=\\frac{1}{${toLatex(allRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findIndividualTimeFromPairwiseTimes": {
      const pairwise = required(p.pairwiseTimes, "pairwiseTimes");
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      const ab = reciprocal(pairwise.ab);
      const bc = reciprocal(pairwise.bc);
      const ca = reciprocal(pairwise.ca);
      const targetRate = target === 0
        ? divide(add(ab, subtract(ca, bc)), rational(2))
        : target === 1
          ? divide(add(ab, subtract(bc, ca)), rational(2))
          : divide(add(bc, subtract(ca, ab)), rational(2));
      answer = reciprocal(targetRate);
      const letter = ["A", "B", "C"][target];
      const numeratorLatex = target === 0
        ? `\\frac{1}{${toLatex(pairwise.ab)}}+\\frac{1}{${toLatex(pairwise.ca)}}-\\frac{1}{${toLatex(pairwise.bc)}}`
        : target === 1
          ? `\\frac{1}{${toLatex(pairwise.ab)}}+\\frac{1}{${toLatex(pairwise.bc)}}-\\frac{1}{${toLatex(pairwise.ca)}}`
          : `\\frac{1}{${toLatex(pairwise.bc)}}+\\frac{1}{${toLatex(pairwise.ca)}}-\\frac{1}{${toLatex(pairwise.ab)}}`;
      formulaLatex = target === 0
        ? "r_A=\\frac{r_{AB}+r_{CA}-r_{BC}}{2}"
        : target === 1
          ? "r_B=\\frac{r_{AB}+r_{BC}-r_{CA}}{2}"
          : "r_C=\\frac{r_{BC}+r_{CA}-r_{AB}}{2}";
      workedLatex = [
        `r_${letter}=\\frac{${numeratorLatex}}{2}=${toLatex(targetRate)}`,
        `T_${letter}=\\frac{1}{${toLatex(targetRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findPairTimeFromAllTogetherAndThirdTime": {
      const combinedTime = required(p.combinedTime, "combinedTime");
      const thirdTime = required(p.thirdTime, "thirdTime");
      const pairRate = subtract(reciprocal(combinedTime), reciprocal(thirdTime));
      answer = reciprocal(pairRate);
      formulaLatex = "r_{AB}=r_{ABC}-r_C";
      workedLatex = [
        `r_{AB}=\\frac{1}{${toLatex(combinedTime)}}-\\frac{1}{${toLatex(thirdTime)}}=${toLatex(pairRate)}`,
        `T_{AB}=\\frac{1}{${toLatex(pairRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findNetTimeWithDestructiveAgent": {
      const destructiveTime = required(p.destructiveTime, "destructiveTime");
      const netRate = subtract(sumTmwRates(p.individualRates), reciprocal(destructiveTime));
      answer = reciprocal(netRate);
      formulaLatex = "r_{net}=\\sum r_{constructive}-r_{destructive}";
      workedLatex = [
        `r_{net}=${pairRateLatex(p.individualTimes)}-\\frac{1}{${toLatex(destructiveTime)}}=${toLatex(netRate)}`,
        `T_{net}=\\frac{1}{${toLatex(netRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findDestructiveTimeFromPositiveAndNetTimes": {
      const netTime = required(p.netTime, "netTime");
      const destructiveRate = subtract(sumTmwRates(p.individualRates), reciprocal(netTime));
      answer = reciprocal(destructiveRate);
      formulaLatex = "r_{destructive}=\\sum r_{positive}-r_{net}";
      workedLatex = [
        `r_{destructive}=\\left(${pairRateLatex(p.individualTimes)}\\right)-\\frac{1}{${toLatex(netTime)}}=${toLatex(destructiveRate)}`,
        `T_{destructive}=\\frac{1}{${toLatex(destructiveRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": {
      const netTime = required(p.netTime, "netTime");
      const destructiveTime = required(p.destructiveTime, "destructiveTime");
      const knownPositiveTimes = required(p.knownPositiveTimes, "knownPositiveTimes");
      const knownPositiveRates = knownPositiveTimes.map(reciprocal);
      const missingRate = add(subtract(reciprocal(netTime), sumTmwRates(knownPositiveRates)), reciprocal(destructiveTime));
      answer = reciprocal(missingRate);
      formulaLatex = "r_{missing}=r_{net}-\\sum r_{known+}+r_{destructive}";
      workedLatex = [
        `r_{missing}=\\frac{1}{${toLatex(netTime)}}-\\left(${pairRateLatex(knownPositiveTimes)}\\right)+\\frac{1}{${toLatex(destructiveTime)}}=${toLatex(missingRate)}`,
        `T_{missing}=\\frac{1}{${toLatex(missingRate)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findIdenticalAgentCountFromSingleAndCombinedTime": {
      const singleTime = p.individualTimes[0];
      const combinedTime = required(p.combinedTime, "combinedTime");
      answer = divide(singleTime, combinedTime);
      formulaLatex = "n=\\frac{T_{single}}{T_{group}}";
      workedLatex = [`n=\\frac{${toLatex(singleTime)}}{${toLatex(combinedTime)}}=${toLatex(answer)}`];
      break;
    }
    case "findCombinedTimeFromIdenticalAgentCount": {
      const singleTime = p.individualTimes[0];
      const count = rational(required(p.identicalAgentCount, "identicalAgentCount"));
      answer = divide(singleTime, count);
      formulaLatex = "T_{group}=\\frac{T_{single}}{n}";
      workedLatex = [`T_{group}=\\frac{${toLatex(singleTime)}}{${toLatex(count)}}=${toLatex(answer)}`];
      break;
    }
    case "findCombinedOutputFromExplicitRates": {
      const rates = required(p.explicitRates, "explicitRates");
      const duration = required(p.duration, "duration");
      const combinedRate = sumTmwRates(rates);
      answer = multiply(combinedRate, duration);
      formulaLatex = "Q=(\\sum r_i)t";
      workedLatex = [
        `r_{combined}=${rates.map(toLatex).join("+")}=${toLatex(combinedRate)}`,
        `Q=${toLatex(combinedRate)}\\times${toLatex(duration)}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findMissingRateFromSignedNetRate": {
      const knownTotal = signedKnownTotal(p);
      const netRate = required(p.netRate, "netRate");
      const sign = required(p.missingRateSign, "missingRateSign");
      answer = sign === 1 ? subtract(netRate, knownTotal) : subtract(knownTotal, netRate);
      formulaLatex = sign === 1 ? "r_{missing}=r_{net}-r_{known}" : "r_{missing}=r_{known}-r_{net}";
      workedLatex = [
        `r_{known}=${toLatex(knownTotal)}`,
        `r_{missing}=${sign === 1 ? `${toLatex(netRate)}-${toLatex(knownTotal)}` : `${toLatex(knownTotal)}-${toLatex(netRate)}`}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const teamATimes = required(p.teamATimes, "teamATimes");
      const teamBTimes = required(p.teamBTimes, "teamBTimes");
      const rateA = sumTmwRates(teamATimes.map(reciprocal));
      const rateB = sumTmwRates(teamBTimes.map(reciprocal));
      const timeA = reciprocal(rateA);
      const timeB = reciprocal(rateB);
      const difference = subtract(timeA, timeB);
      answer = difference.numerator < 0 ? rational(-difference.numerator, difference.denominator) : difference;
      formulaLatex = "\\Delta T=\\left|\\frac{1}{r_A}-\\frac{1}{r_B}\\right|";
      workedLatex = [
        `r_A=${pairRateLatex(teamATimes)}=${toLatex(rateA)},\\quad T_A=\\frac{1}{${toLatex(rateA)}}=${toLatex(timeA)}`,
        `r_B=${pairRateLatex(teamBTimes)}=${toLatex(rateB)},\\quad T_B=\\frac{1}{${toLatex(rateB)}}=${toLatex(timeB)}`,
        `\\Delta T=\\left|${toLatex(timeA)}-${toLatex(timeB)}\\right|=${toLatex(answer)}`,
      ];
      break;
    }
  }
  return { answer, answerType: entry.answerType, formulaLatex, workedLatex, answerText: answerText(entry, p, answer) };
}

export function verifyTmwCp002(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution): boolean {
  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes":
      return equals(multiply(sumTmwRates(p.individualRates), solution.answer), rational(1));
    case "findCombinedWorkInGivenTime":
      return equals(solution.answer, multiply(sumTmwRates(p.individualRates), required(p.duration, "duration")));
    case "findMissingIndividualTimeFromCombinedAndKnownTimes":
      return equals(add(sumTmwRates(p.individualRates.slice(0, -1)), reciprocal(solution.answer)), reciprocal(required(p.combinedTime, "combinedTime")));
    case "findAllTogetherTimeFromPairwiseTimes": {
      const pairwise = required(p.pairwiseTimes, "pairwiseTimes");
      return equals(multiply(reciprocal(solution.answer), rational(2)), add(add(reciprocal(pairwise.ab), reciprocal(pairwise.bc)), reciprocal(pairwise.ca)));
    }
    case "findIndividualTimeFromPairwiseTimes":
      return equals(solution.answer, p.individualTimes[required(p.targetAgentIndex, "targetAgentIndex")]);
    case "findPairTimeFromAllTogetherAndThirdTime":
      return equals(add(reciprocal(solution.answer), reciprocal(required(p.thirdTime, "thirdTime"))), reciprocal(required(p.combinedTime, "combinedTime")));
    case "findNetTimeWithDestructiveAgent":
      return equals(multiply(subtract(sumTmwRates(p.individualRates), reciprocal(required(p.destructiveTime, "destructiveTime"))), solution.answer), rational(1));
    case "findDestructiveTimeFromPositiveAndNetTimes":
      return equals(subtract(sumTmwRates(p.individualRates), reciprocal(solution.answer)), reciprocal(required(p.netTime, "netTime")));
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes":
      return equals(
        subtract(add(reciprocal(solution.answer), sumTmwRates(required(p.knownPositiveTimes, "knownPositiveTimes").map(reciprocal))), reciprocal(required(p.destructiveTime, "destructiveTime"))),
        reciprocal(required(p.netTime, "netTime")),
      );
    case "findIdenticalAgentCountFromSingleAndCombinedTime":
      return equals(multiply(solution.answer, reciprocal(p.individualTimes[0])), reciprocal(required(p.combinedTime, "combinedTime")));
    case "findCombinedTimeFromIdenticalAgentCount":
      return equals(multiply(multiply(rational(required(p.identicalAgentCount, "identicalAgentCount")), reciprocal(p.individualTimes[0])), solution.answer), rational(1));
    case "findCombinedOutputFromExplicitRates":
      return equals(solution.answer, multiply(sumTmwRates(required(p.explicitRates, "explicitRates")), required(p.duration, "duration")));
    case "findMissingRateFromSignedNetRate": {
      const sign = required(p.missingRateSign, "missingRateSign");
      const reconstructed = sign === 1 ? add(signedKnownTotal(p), solution.answer) : subtract(signedKnownTotal(p), solution.answer);
      return equals(reconstructed, required(p.netRate, "netRate"));
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const timeA = reciprocal(sumTmwRates(required(p.teamATimes, "teamATimes").map(reciprocal)));
      const timeB = reciprocal(sumTmwRates(required(p.teamBTimes, "teamBTimes").map(reciprocal)));
      const difference = subtract(timeA, timeB);
      const absolute = difference.numerator < 0 ? rational(-difference.numerator, difference.denominator) : difference;
      return equals(solution.answer, absolute);
    }
  }
}
