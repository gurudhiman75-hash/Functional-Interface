import type { GeneratedOptions, GeneratedParameters, ProbabilityAnswer, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";
import { combinationCount, permutationCount } from "./combinatorial-counter";
import { answerText, complementRational, isProbability, rational, rationalText } from "./rational";
import { seededRandom, shuffleRandom } from "./random";

type Candidate = { text: string; label: string };

export function generateProbabilityOptions(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability, seed: string, optionCount: 4 | 5 = 4): GeneratedOptions {
  const correct = answerText(solved.answer), candidates: Candidate[] = [], needed = optionCount - 1;
  const add = (answer: ProbabilityAnswer, label: string) => {
    const value = answerText(answer);
    if (value !== correct && !candidates.some((item) => item.text === value)) candidates.push({ text: value, label });
  };
  const addCount = (value: bigint, label: string) => { if (value >= 0n) add({ kind: "COUNT", exact: value }, label); };
  const addProbability = (numerator: bigint | number, denominator: bigint | number, label: string) => {
    if (BigInt(denominator) <= 0n) return;
    const value = rational(numerator, denominator);
    if (isProbability(value)) add({ kind: "PROBABILITY", exact: value, preferredDisplay: "FRACTION" }, label);
  };

  if (solved.answer.kind === "COUNT") {
    const value = solved.answer.exact;
    addCount(value + 1n, "OFF_BY_ONE_HIGH");
    if (value > 0n) addCount(value - 1n, "OFF_BY_ONE_LOW");
    addCount(value + 2n, "OFF_BY_TWO_HIGH");
    if (value > 1n) addCount(value - 2n, "OFF_BY_TWO_LOW");
    addCount(value * 2n, "DOUBLE_COUNT");
    if (solved.evidence.totalOutcomeCount !== undefined) addCount(solved.evidence.totalOutcomeCount, "USED_TOTAL_INSTEAD_OF_REQUIRED_COUNT");
    if (typeof parameters.probabilityNumerator === "number") addCount(BigInt(parameters.probabilityNumerator), "USED_NUMERATOR_AS_COUNT");
  } else if (solved.answer.kind === "PROBABILITY") {
    const exact = solved.answer.exact;
    add({ kind: "PROBABILITY", exact: complementRational(exact), preferredDisplay: "FRACTION" }, "USED_COMPLEMENT");
    addProbability(exact.numerator + 1n, exact.denominator, "ONE_EXTRA_FAVOURABLE");
    if (exact.numerator > 0n) addProbability(exact.numerator - 1n, exact.denominator, "ONE_FEWER_FAVOURABLE");
    addProbability(exact.numerator, exact.denominator + 1n, "ONE_EXTRA_TOTAL");
    if (exact.denominator > 1n) addProbability(exact.numerator, exact.denominator - 1n, "ONE_FEWER_TOTAL");

    const total = solved.evidence.totalOutcomeCount, favourable = solved.evidence.favourableOutcomeCount;
    if (total !== undefined && favourable !== undefined) {
      addProbability(favourable + 1n, total, "MISCOUNTED_FAVOURABLE");
      if (favourable > 0n) addProbability(favourable - 1n, total, "MISCOUNTED_FAVOURABLE");
      addProbability(favourable, total + 1n, "MISCOUNTED_TOTAL");
    }

    const red = typeof parameters.red === "number" ? parameters.red : 0;
    const blue = typeof parameters.blue === "number" ? parameters.blue : 0;
    const totalBalls = red + blue;
    const draw = typeof parameters.draw === "number" ? parameters.draw : 0;
    const exactRed = typeof parameters.exactRed === "number" ? parameters.exactRed : 1;

    for (const strategy of entry.distractorStrategyIds) {
      if (strategy === "FORGET_COMPLEMENT") add({ kind: "PROBABILITY", exact: complementRational(exact), preferredDisplay: "FRACTION" }, strategy);
      else if (strategy === "COUNT_EXACTLY_ONE_ONLY" && typeof parameters.trials === "number") addProbability(combinationCount(parameters.trials, 1), 2n ** BigInt(parameters.trials), strategy);
      else if (strategy === "KEEP_DENOMINATOR_UNCHANGED" && totalBalls > 0) addProbability(red * red, totalBalls * totalBalls, strategy);
      else if ((strategy === "COUNT_ONE_ORDER_ONLY" || strategy === "REVERSE_SEQUENCE_ONLY") && totalBalls > 1) addProbability(red * blue, totalBalls * (totalBalls - 1), strategy);
      else if (strategy === "COUNT_ONLY_RED_CASE" && draw > 0 && total !== undefined) addProbability(combinationCount(red, draw), total, strategy);
      else if (strategy === "OMIT_ONE_COMBINATION_FACTOR" && draw > 0 && total !== undefined) addProbability(combinationCount(red, exactRed), total, strategy);
      else if (strategy === "FAIL_SUBTRACT_OVERLAP" && typeof parameters.aCount === "number" && typeof parameters.bCount === "number" && typeof parameters.total === "number") addProbability(parameters.aCount + parameters.bCount, parameters.total, strategy);
      else if (strategy === "SUBTRACT_OVERLAP_ONCE" && typeof parameters.aCount === "number" && typeof parameters.bCount === "number" && typeof parameters.overlap === "number" && typeof parameters.total === "number") addProbability(parameters.aCount + parameters.bCount - parameters.overlap, parameters.total, strategy);
      else if (strategy === "ADD_RANK_AND_SUIT") addProbability(17, 52, strategy);
      else if (strategy === "USE_ORIGINAL_TOTAL" && favourable !== undefined) {
        const original = typeof parameters.upper === "number" ? parameters.upper : totalBalls || undefined;
        if (original) addProbability(favourable, original, strategy);
      }
      else if (strategy === "DECK_FACT_TRAP" && favourable !== undefined) addProbability(favourable + 1n, 52n, strategy);
      else if (strategy === "PERMUTATION_DENOMINATOR" && typeof parameters.men === "number" && typeof parameters.women === "number" && typeof parameters.committeeSize === "number" && favourable !== undefined) addProbability(favourable, permutationCount(parameters.men + parameters.women, parameters.committeeSize), strategy);
      else if (strategy === "ENDPOINT_OFF_BY_ONE" && favourable !== undefined && total !== undefined) addProbability(favourable, total + 1n, strategy);
      else if (strategy === "ADD_INSTEAD_OF_MULTIPLY" && typeof parameters.aNumerator === "number" && typeof parameters.bNumerator === "number") {
        const a = rational(parameters.aNumerator, parameters.aDenominator as number), b = rational(parameters.bNumerator, parameters.bDenominator as number);
        addProbability(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator, strategy);
      }
    }

    for (let offset = 2n; candidates.length < needed + 4 && offset <= 12n; offset += 1n) {
      addProbability(exact.numerator + offset, exact.denominator + offset, "NEARBY_COUNT_ERROR");
      if (exact.numerator > offset) addProbability(exact.numerator - offset, exact.denominator, "NEARBY_COUNT_ERROR");
    }
  }

  if (candidates.length < needed) throw new Error(`Unable to construct ${needed} distractors for ${entry.qlId}: ${correct}`);
  const selectedDistractors: Candidate[] = [];
  for (const strategy of entry.distractorStrategyIds) {
    const candidate = candidates.find((item) => item.label === strategy && !selectedDistractors.some((chosen) => chosen.text === item.text));
    if (candidate) selectedDistractors.push(candidate);
  }
  for (const candidate of candidates) {
    if (selectedDistractors.length >= needed) break;
    if (!selectedDistractors.some((chosen) => chosen.text === candidate.text)) selectedDistractors.push(candidate);
  }

  const selected = [{ text: correct, label: "CORRECT" }, ...selectedDistractors.slice(0, needed)];
  const shuffled = shuffleRandom(seededRandom(`${seed}:${entry.qlId}:${optionCount}:options`), selected);
  return { options: shuffled.map((item) => item.text), correctIndex: shuffled.findIndex((item) => item.label === "CORRECT"), labels: shuffled.map((item) => item.label) };
}
