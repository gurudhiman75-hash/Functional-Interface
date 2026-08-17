import { add, compare, divide, equals, formatTimeText, multiply, rational, reciprocal, subtract } from "./rational";
import { required, seedNumber } from "./cp001-helpers";
import { signedKnownTotal, sumTmwRates } from "./cp002-solver";
import type { Rational } from "./types";
import type { TmwCp002MisconceptionId, TmwCp002Option, TmwCp002Parameters, TmwCp002RegistryEntry } from "./cp002-types";

interface Candidate {
  value: Rational;
  misconceptionId: TmwCp002MisconceptionId;
}

function pluralize(noun: string, value: Rational): string {
  if (equals(value, rational(1))) return noun;
  if (noun.endsWith("y")) return `${noun.slice(0, -1)}ies`;
  if (noun.endsWith("s")) return noun;
  return `${noun}s`;
}

function optionText(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, value: Rational): string {
  const rendered = value.denominator === 1
    ? String(value.numerator)
    : Math.abs(value.numerator) > value.denominator
      ? `${Math.trunc(value.numerator / value.denominator)} ${Math.abs(value.numerator) % value.denominator}/${value.denominator}`
      : `${value.numerator}/${value.denominator}`;
  if (entry.answerType === "TIME") return formatTimeText(value, p.timeUnit, `${p.timeUnit}s`);
  if (entry.answerType === "FRACTION") return `${rendered} of the assignment`;
  if (entry.answerType === "COUNT") return `${rendered} ${pluralize(p.context.agentNoun, value)}`;
  if (entry.answerType === "OUTPUT") return `${rendered} ${p.context.outputNoun}`;
  return `${rendered} ${p.context.outputNoun} per ${p.timeUnit}`;
}

function absolute(value: Rational): Rational {
  return value.numerator < 0 ? rational(-value.numerator, value.denominator) : value;
}

function admissible(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, value: Rational): boolean {
  if (compare(value, rational(0)) <= 0) return false;
  if (entry.answerType === "FRACTION" && compare(value, rational(1)) > 0) return false;
  if (entry.answerType === "COUNT" && value.denominator !== 1) return false;
  const discreteOutput = !p.context.outputNoun.startsWith("metres");
  if (entry.answerType === "OUTPUT" && discreteOutput && value.denominator !== 1) return false;
  return true;
}

function teamTimes(p: TmwCp002Parameters): { a: Rational; b: Rational } {
  const a = reciprocal(sumTmwRates(required(p.teamATimes, "teamATimes").map(reciprocal)));
  const b = reciprocal(sumTmwRates(required(p.teamBTimes, "teamBTimes").map(reciprocal)));
  return { a, b };
}

function candidates(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, answer: Rational): Candidate[] {
  const correct: Candidate[] = [{ value: answer, misconceptionId: "CORRECT" }];
  const combinedRate = sumTmwRates(p.individualRates);
  const combinedTime = reciprocal(combinedRate);

  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes": {
      const sumTimes = p.individualTimes.reduce((total, time) => add(total, time), rational(0));
      const averageTimes = divide(sumTimes, rational(p.individualTimes.length));
      const subsetTime = reciprocal(sumTmwRates(p.individualRates.slice(0, -1)));
      return correct.concat([
        { value: sumTimes, misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
        { value: averageTimes, misconceptionId: "AVERAGE_TIMES" },
        { value: subsetTime, misconceptionId: "OMIT_ONE_AGENT" },
        { value: combinedRate, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
      ]);
    }
    case "findCombinedWorkInGivenTime": {
      const duration = required(p.duration, "duration");
      const omittedOne = multiply(sumTmwRates(p.individualRates.slice(0, -1)), duration);
      return correct.concat([
        { value: combinedRate, misconceptionId: "DURATION_OMITTED" },
        { value: omittedOne, misconceptionId: "OMIT_ONE_AGENT" },
        { value: multiply(p.individualRates[0], duration), misconceptionId: "ONE_RATE_OMITTED" },
        { value: subtract(rational(1), answer), misconceptionId: "RECIPROCAL_NOT_TAKEN" },
      ]);
    }
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": {
      const allTime = required(p.combinedTime, "combinedTime");
      const knownRate = sumTmwRates(p.individualRates.slice(0, -1));
      const wrongAddedRate = add(reciprocal(allTime), knownRate);
      return correct.concat([
        { value: reciprocal(wrongAddedRate), misconceptionId: "KNOWN_RATE_WRONG_SIGN" },
        { value: allTime, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: p.individualTimes[0], misconceptionId: "OMIT_ONE_AGENT" },
        { value: add(allTime, p.individualTimes[0]), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findAllTogetherTimeFromPairwiseTimes": {
      const pairwise = required(p.pairwiseTimes, "pairwiseTimes");
      const pairRateSum = add(add(reciprocal(pairwise.ab), reciprocal(pairwise.bc)), reciprocal(pairwise.ca));
      const averagePairTime = divide(add(add(pairwise.ab, pairwise.bc), pairwise.ca), rational(3));
      return correct.concat([
        { value: reciprocal(pairRateSum), misconceptionId: "PAIRWISE_FACTOR_TWO_MISSED" },
        { value: averagePairTime, misconceptionId: "AVERAGE_TIMES" },
        { value: pairwise.ab, misconceptionId: "OMIT_ONE_AGENT" },
        { value: add(add(pairwise.ab, pairwise.bc), pairwise.ca), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findIndividualTimeFromPairwiseTimes": {
      const pairwise = required(p.pairwiseTimes, "pairwiseTimes");
      const allTogether = reciprocal(divide(add(add(reciprocal(pairwise.ab), reciprocal(pairwise.bc)), reciprocal(pairwise.ca)), rational(2)));
      return correct.concat([
        { value: divide(answer, rational(2)), misconceptionId: "PAIRWISE_FACTOR_TWO_MISSED" },
        { value: allTogether, misconceptionId: "PAIRWISE_WRONG_SIGN" },
        { value: pairwise.ab, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: add(pairwise.ab, pairwise.bc), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findPairTimeFromAllTogetherAndThirdTime": {
      const allTime = required(p.combinedTime, "combinedTime");
      const thirdTime = required(p.thirdTime, "thirdTime");
      const wrongRate = add(reciprocal(allTime), reciprocal(thirdTime));
      return correct.concat([
        { value: reciprocal(wrongRate), misconceptionId: "KNOWN_RATE_WRONG_SIGN" },
        { value: allTime, misconceptionId: "OMIT_ONE_AGENT" },
        { value: thirdTime, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: absolute(subtract(thirdTime, allTime)), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findNetTimeWithDestructiveAgent": {
      const destructiveTime = required(p.destructiveTime, "destructiveTime");
      const destructiveRate = reciprocal(destructiveTime);
      return correct.concat([
        { value: reciprocal(add(combinedRate, destructiveRate)), misconceptionId: "DESTRUCTIVE_RATE_ADDED" },
        { value: combinedTime, misconceptionId: "DESTRUCTIVE_RATE_OMITTED" },
        { value: destructiveTime, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: add(combinedTime, destructiveTime), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findDestructiveTimeFromPositiveAndNetTimes": {
      const netTime = required(p.netTime, "netTime");
      const wrongRate = add(combinedRate, reciprocal(netTime));
      return correct.concat([
        { value: reciprocal(wrongRate), misconceptionId: "DESTRUCTIVE_RATE_ADDED" },
        { value: netTime, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: combinedTime, misconceptionId: "DESTRUCTIVE_RATE_OMITTED" },
        { value: absolute(subtract(netTime, combinedTime)), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": {
      const netTime = required(p.netTime, "netTime");
      const destructiveTime = required(p.destructiveTime, "destructiveTime");
      const knownRate = sumTmwRates(required(p.knownPositiveTimes, "knownPositiveTimes").map(reciprocal));
      const missingWithoutDestructive = subtract(reciprocal(netTime), knownRate);
      const wrongSign = subtract(missingWithoutDestructive, reciprocal(destructiveTime));
      return correct.concat([
        { value: reciprocal(missingWithoutDestructive), misconceptionId: "DESTRUCTIVE_RATE_OMITTED" },
        { value: wrongSign.numerator > 0 ? reciprocal(wrongSign) : netTime, misconceptionId: "DESTRUCTIVE_RATE_ADDED" },
        { value: netTime, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: destructiveTime, misconceptionId: "KNOWN_RATE_WRONG_SIGN" },
      ]);
    }
    case "findIdenticalAgentCountFromSingleAndCombinedTime": {
      const group = required(p.combinedTime, "combinedTime");
      return correct.concat([
        { value: add(answer, rational(1)), misconceptionId: "IDENTICAL_COUNT_MULTIPLIED" },
        { value: subtract(answer, rational(1)), misconceptionId: "IDENTICAL_COUNT_IGNORED" },
        { value: group, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: add(answer, rational(2)), misconceptionId: "ADD_TIMES_INSTEAD_OF_RATES" },
      ]);
    }
    case "findCombinedTimeFromIdenticalAgentCount": {
      const single = p.individualTimes[0];
      const countValue = required(p.identicalAgentCount, "identicalAgentCount");
      const count = rational(countValue);
      return correct.concat([
        { value: divide(single, rational(Math.max(1, countValue - 1))), misconceptionId: "OMIT_ONE_AGENT" },
        { value: divide(single, rational(countValue + 1)), misconceptionId: "IDENTICAL_COUNT_MULTIPLIED" },
        { value: single, misconceptionId: "IDENTICAL_COUNT_IGNORED" },
        { value: count, misconceptionId: "RECIPROCAL_NOT_TAKEN" },
      ]);
    }
    case "findCombinedOutputFromExplicitRates": {
      const rates = required(p.explicitRates, "explicitRates");
      const duration = required(p.duration, "duration");
      const omittedOne = multiply(sumTmwRates(rates.slice(0, -1)), duration);
      return correct.concat([
        { value: sumTmwRates(rates), misconceptionId: "DURATION_OMITTED" },
        { value: omittedOne, misconceptionId: "ONE_RATE_OMITTED" },
        { value: multiply(rates[0], duration), misconceptionId: "OMIT_ONE_AGENT" },
        { value: multiply(rates[rates.length - 1], duration), misconceptionId: "ONE_RATE_OMITTED" },
      ]);
    }
    case "findMissingRateFromSignedNetRate": {
      const known = signedKnownTotal(p);
      const net = required(p.netRate, "netRate");
      return correct.concat([
        { value: add(absolute(known), absolute(net)), misconceptionId: "KNOWN_RATE_WRONG_SIGN" },
        { value: absolute(net), misconceptionId: "RECIPROCAL_NOT_TAKEN" },
        { value: absolute(known), misconceptionId: "DESTRUCTIVE_RATE_OMITTED" },
        { value: absolute(subtract(known, answer)), misconceptionId: "INVERT_BEFORE_ISOLATING" },
      ]);
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const { a, b } = teamTimes(p);
      const faster = compare(a, b) < 0 ? a : b;
      const slower = compare(a, b) > 0 ? a : b;
      return correct.concat([
        { value: add(a, b), misconceptionId: "TEAM_TIMES_ADDED" },
        { value: faster, misconceptionId: "FASTER_TEAM_TIME_REPORTED" },
        { value: slower, misconceptionId: "SLOWER_TEAM_TIME_REPORTED" },
        { value: absolute(subtract(sumTmwRates(required(p.teamATimes, "teamATimes").map(reciprocal)), sumTmwRates(required(p.teamBTimes, "teamBTimes").map(reciprocal)))), misconceptionId: "RECIPROCAL_NOT_TAKEN" },
      ]);
    }
  }
}

export function buildTmwCp002Options(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, answer: Rational, seed: string): { optionAudit: TmwCp002Option[]; correctIndex: number } {
  const raw = candidates(entry, p, answer).filter((candidate) => admissible(entry, p, candidate.value));
  const unique: Candidate[] = [];
  for (const candidate of raw) if (!unique.some((existing) => equals(existing.value, candidate.value))) unique.push(candidate);

  let filler = 1;
  while (unique.length < 4 && filler < 100) {
    const value = entry.answerType === "FRACTION" ? rational(filler, filler + 2) : add(answer, rational(filler));
    if (admissible(entry, p, value) && !unique.some((existing) => equals(existing.value, value))) unique.push({ value, misconceptionId: "RECIPROCAL_NOT_TAKEN" });
    filler += 1;
  }
  if (unique.length < 4) throw new Error(`Unable to build four options for ${entry.qlId}`);

  const selected = unique.slice(0, 4);
  const rotation = seedNumber(seed, "cp002-options") % 4;
  const rotated = selected.map((_, index) => selected[(index + rotation) % 4]);
  const optionAudit = rotated.map((candidate) => ({ text: optionText(entry, p, candidate.value), value: candidate.value, misconceptionId: candidate.misconceptionId }));
  return { optionAudit, correctIndex: optionAudit.findIndex((option) => option.misconceptionId === "CORRECT" && equals(option.value, answer)) };
}
