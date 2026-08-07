import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import {
  divisorCountFromState,
  geometricSum,
  oddDivisorCountFromState,
  primePowers,
  secondPrimePowers,
  squareDivisorCountFromState,
} from "./english-remediation-common";
import { runNumCp005PermanentPipeline } from "./runtime";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function divisorSum(state) {
  return state.reduce((value, { prime, exponent }) => value * geometricSum(prime, exponent), 1);
}

function metricValue(state, metric) {
  if (metric === "DIVISOR_SUM") return divisorSum(state);
  if (metric === "SQUARE_DIVISORS") return squareDivisorCountFromState(state);
  if (metric === "ODD_DIVISORS") return oddDivisorCountFromState(state);
  return divisorCountFromState(state);
}

function parsePowerBase(value) {
  const match = value.match(/^\\\((\d+)(?:\^\{\d+\})?\\\)$/u);
  return match ? Number(match[1]) : null;
}

function parseFactorState(value) {
  const inner = value.replace(/^\\\(/u, "").replace(/\\\)$/u, "");
  return inner.split(/\s*\\times\s*/u).map((term) => {
    const match = term.match(/^(\d+)(?:\^\{(\d+)\})?$/u);
    if (!match) throw new Error(`Unable to parse factor option: ${value}`);
    return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
  });
}

function comparisonOutcome(first, second) {
  return first > second
    ? "Number A has more."
    : first < second
      ? "Number B has more."
      : "Both numbers have the same value.";
}

function expectedTier(qlId, metric) {
  if (["NUM-QL-052", "NUM-QL-064", "NUM-QL-065", "NUM-QL-066", "NUM-QL-067", "NUM-QL-069"].includes(qlId)) {
    return "ADVANCED_PRACTICE";
  }
  if (["NUM-QL-053", "NUM-QL-058", "NUM-QL-059", "NUM-QL-063"].includes(qlId)) {
    return "GUIDED_LEARNING";
  }
  if (qlId === "NUM-QL-068" && ["SQUARE_DIVISORS", "DIVISOR_SUM"].includes(metric)) {
    return "ADVANCED_PRACTICE";
  }
  return "STANDARD_MOCK";
}

let checkedQuestions = 0;
let ql067TwoConditionChecks = 0;
let ql068CoherentOptionChecks = 0;
let tierChecks = 0;
const ql065Classes = [];

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const question = runNumCp005PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
    });
    checkedQuestions += 1;

    const metric = String(question.hiddenState.metricKind ?? "");
    const tier = expectedTier(allocation.qlId, metric);
    assert(question.examUseTier === tier, `${allocation.qlId}/${seed}: wrong publication tier`);
    assert(question.hiddenState.examUseTier === tier, `${allocation.qlId}/${seed}: hidden tier mismatch`);
    tierChecks += 1;

    if (allocation.qlId === "NUM-QL-050") {
      assert(!/perfect 4th powers/iu.test(question.stem), `${allocation.qlId}/${seed}: ordinal wording not editorialised`);
    }

    if (allocation.qlId === "NUM-QL-051") {
      const state = primePowers(question.hiddenState);
      const allSum = divisorSum(state);
      const integer = state.reduce((value, { prime, exponent }) => value * prime ** exponent, 1);
      const expected = /proper/iu.test(question.stem) ? allSum - integer : allSum;
      assert(Number(question.canonicalAnswer) === expected, `${allocation.qlId}/${seed}: divisor sum mismatch`);
      assert(expected <= 200_000, `${allocation.qlId}/${seed}: arithmetic remains oversized`);
      assert(question.difficulty !== "HARD", `${allocation.qlId}/${seed}: routine divisor sum marked HARD`);
    }

    if (allocation.qlId === "NUM-QL-052") {
      assert(question.difficulty !== "HARD", `${allocation.qlId}/${seed}: direct product theorem marked HARD`);
    }

    if (allocation.qlId === "NUM-QL-054") {
      assert(question.difficulty !== "HARD", `${allocation.qlId}/${seed}: one-variable inverse count marked HARD`);
    }

    if (allocation.qlId === "NUM-QL-055") {
      const prime = Number(question.hiddenState.prime);
      assert(question.options.every((option) => parsePowerBase(option.value) === prime), `${allocation.qlId}/${seed}: option does not retain the given prime base`);
    }

    if (allocation.qlId === "NUM-QL-058") {
      const bound = Number(question.hiddenState.bound);
      const answer = Number(question.canonicalAnswer);
      const divisors = [];
      for (let value = 1; value <= bound; value += 1) {
        const n = primePowers(question.hiddenState).reduce((product, { prime, exponent }) => product * prime ** exponent, 1);
        if (n % value === 0) divisors.push(value);
      }
      assert(bound > 1, `${allocation.qlId}/${seed}: trivial bound remains`);
      assert(answer === Math.max(...divisors), `${allocation.qlId}/${seed}: greatest divisor mismatch`);
      assert(question.options.every((option) => Number(option.value) <= bound), `${allocation.qlId}/${seed}: option violates visible bound`);
    }

    if (allocation.qlId === "NUM-QL-063") {
      assert(/^If one factor of /u.test(question.stem), `${allocation.qlId}/${seed}: pair-row wording not naturalised`);
    }

    if (allocation.qlId === "NUM-QL-065" && seed <= 15) {
      const pairs = question.hiddenState.exponentPairs;
      const classification = !Array.isArray(pairs) || pairs.length === 0
        ? "NO_SOLUTION"
        : pairs.length === 1
          ? "UNIQUE_SOLUTION"
          : "MULTIPLE_SOLUTIONS";
      ql065Classes.push(classification);
    }

    if (allocation.qlId === "NUM-QL-066") {
      assert(!/1 positive divisors/iu.test(question.stem), `${allocation.qlId}/${seed}: singular grammar error`);
    }

    if (allocation.qlId === "NUM-QL-067") {
      const targetTotal = Number(question.hiddenState.totalDivisors);
      const targetSquare = Number(question.hiddenState.squareDivisors);
      const optionMetrics = question.options.map((option) => {
        const state = parseFactorState(option.value);
        return {
          total: divisorCountFromState(state),
          square: squareDivisorCountFromState(state),
          correct: option.isCorrect,
        };
      });
      assert(optionMetrics.filter(({ total }) => total === targetTotal).length >= 2, `${allocation.qlId}/${seed}: total count alone still identifies the answer`);
      assert(optionMetrics.filter(({ total, square }) => total === targetTotal && square === targetSquare).length === 1, `${allocation.qlId}/${seed}: both conditions do not identify one option`);
      ql067TwoConditionChecks += 1;
    }

    if (allocation.qlId === "NUM-QL-068") {
      const firstState = primePowers(question.hiddenState);
      const secondState = secondPrimePowers(question.hiddenState);
      const first = metricValue(firstState, metric);
      const second = metricValue(secondState, metric);
      assert(!question.options.some((option) => /cannot be determined/iu.test(option.value)), `${allocation.qlId}/${seed}: dead cannot-determine option remains`);
      for (const option of question.options) {
        const match = option.value.match(/^A has (\d+); B has (\d+); (.+)$/u);
        assert(Boolean(match), `${allocation.qlId}/${seed}: comparison option lacks count pair`);
        const optionFirst = Number(match[1]);
        const optionSecond = Number(match[2]);
        assert(match[3] === comparisonOutcome(optionFirst, optionSecond), `${allocation.qlId}/${seed}: comparison option contradicts its counts`);
        if (option.isCorrect) {
          assert(optionFirst === first && optionSecond === second, `${allocation.qlId}/${seed}: correct comparison counts are wrong`);
        }
        ql068CoherentOptionChecks += 1;
      }
    }

    if (allocation.qlId === "NUM-QL-069") {
      assert(!/n\\div|twice a perfect square|same parity/iu.test(question.stem), `${allocation.qlId}/${seed}: synthetic data-sufficiency wording remains`);
    }
  }
}

const classCounts = ql065Classes.reduce((counts, value) => ({
  ...counts,
  [value]: (counts[value] ?? 0) + 1,
}), {});
assert(classCounts.NO_SOLUTION === 4, `QL-065 first 15 no-solution count: ${classCounts.NO_SOLUTION}`);
assert(classCounts.UNIQUE_SOLUTION === 4, `QL-065 first 15 unique-solution count: ${classCounts.UNIQUE_SOLUTION}`);
assert(classCounts.MULTIPLE_SOLUTIONS === 7, `QL-065 first 15 multiple-solution count: ${classCounts.MULTIPLE_SOLUTIONS}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_FINAL_PUBLICATION_READINESS_AUDIT",
  checkedQuestions,
  publicationTierChecks: tierChecks,
  ql065First15ClassCounts: classCounts,
  ql067TwoConditionChecks,
  ql068CoherentOptionChecks,
  oversizedArithmeticViolations: 0,
  hardDirectTheoremViolations: 0,
  primeBaseOptionViolations: 0,
  visibleBoundOptionViolations: 0,
  redundantSecondConditionViolations: 0,
  deadComparisonOptionViolations: 0,
  syntheticDataSufficiencyWordingViolations: 0,
  grammarViolations: 0,
}, null, 2));
