import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import { normalizeNumCp005OptionSemantic } from "./english-remediation";
import { runNumCp005PermanentPipeline } from "./runtime";
import {
  divisorCountFromState,
  divisorCountOfInteger,
  divisorsFromState,
  geometricSum,
  oddDivisorCountFromState,
  primePowers,
  secondPrimePowers,
  squareDivisorCountFromState,
} from "./english-remediation-common";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function explanationWordCount(explanation) {
  return [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

function normalizedQuestionFingerprint(question) {
  return JSON.stringify({
    stem: question.stem,
    options: question.options.map((option) => option.value),
    answer: question.canonicalAnswer,
  });
}

function isCoherentClaimOption(optionText, claimedValue) {
  const match = optionText.match(/^The claim is (correct|incorrect); the actual value is (-?\d+)\.$/u);
  if (!match) return false;
  const expected = match[2] === String(claimedValue) ? "correct" : "incorrect";
  return match[1] === expected;
}

function divisorSum(state) {
  return state.reduce(
    (value, { prime, exponent }) => value * geometricSum(prime, exponent),
    1,
  );
}

function metricValue(state, metric) {
  if (metric === "DIVISOR_SUM") return divisorSum(state);
  if (metric === "SQUARE_DIVISORS") return squareDivisorCountFromState(state);
  if (metric === "ODD_DIVISORS") return oddDivisorCountFromState(state);
  return divisorCountFromState(state);
}

function comparisonOutcome(first, second) {
  return first > second
    ? "Number A has more."
    : first < second
      ? "Number B has more."
      : "Both numbers have the same value.";
}

function parseComparisonOption(value) {
  const match = value.match(/^A has (\d+); B has (\d+); (.+)$/u);
  if (!match) return null;
  return {
    first: Number(match[1]),
    second: Number(match[2]),
    outcome: match[3],
  };
}

const firstReviewLimits = new Map([
  ["NUM-QL-055", 10],
  ["NUM-QL-064", 15],
  ["NUM-QL-065", 15],
  ["NUM-QL-066", 15],
  ["NUM-QL-067", 15],
  ["NUM-QL-068", 15],
  ["NUM-QL-069", 15],
]);

const reviewStems = new Map();
const reviewFingerprints = new Set();
const difficultyByStem = new Map();
let checkedQuestions = 0;
let easyExplanationWordTotal = 0;
let easyExplanationCount = 0;
let visibleComparisonChecks = 0;
let uniqueReviewQuestions = 0;
let ql067TwoConditionChecks = 0;

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  const reviewLimit = firstReviewLimits.get(allocation.qlId) ?? 0;
  if (reviewLimit > 0) reviewStems.set(allocation.qlId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const question = runNumCp005PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
    });
    checkedQuestions += 1;

    const semanticOptions = question.options.map((option) =>
      normalizeNumCp005OptionSemantic(option.value));
    assert(new Set(semanticOptions).size === 4,
      `${allocation.qlId}/${seed}: equivalent or duplicate options`);
    assert(question.options.filter((option) => option.isCorrect).length === 1,
      `${allocation.qlId}/${seed}: one-correct-option contract`);
    assert(question.options[question.correctIndex]?.isCorrect === true,
      `${allocation.qlId}/${seed}: correct index mismatch`);
    assert(question.canonicalAnswer === question.verifierAnswer,
      `${allocation.qlId}/${seed}: verifier answer mismatch`);

    const priorDifficulty = difficultyByStem.get(question.stem);
    if (priorDifficulty) {
      assert(priorDifficulty === question.difficulty,
        `${allocation.qlId}/${seed}: identical stem has conflicting difficulty`);
    } else {
      difficultyByStem.set(question.stem, question.difficulty);
    }

    if (reviewLimit > 0 && seed <= reviewLimit) {
      reviewStems.get(allocation.qlId).add(question.stem);
      const fingerprint = normalizedQuestionFingerprint(question);
      assert(!reviewFingerprints.has(fingerprint),
        `${allocation.qlId}/${seed}: duplicate question in manual-review sample`);
      reviewFingerprints.add(fingerprint);
      uniqueReviewQuestions += 1;
    }

    if (question.difficulty === "EASY") {
      easyExplanationCount += 1;
      easyExplanationWordTotal += explanationWordCount(question.explanation);
    }

    if (allocation.qlId === "NUM-QL-049") {
      const working = question.explanation.stepByStep.join("\n");
      assert(/Required count/iu.test(working),
        `${allocation.qlId}/${seed}: missing final subtraction`);
      assert((working.match(/=/gu)?.length ?? 0) >= 3,
        `${allocation.qlId}/${seed}: intermediate counts not derived`);
    }

    if (allocation.qlId === "NUM-QL-053") {
      const state = primePowers(question.hiddenState);
      if (divisorCountFromState(state) <= 4) {
        assert(question.difficulty === "EASY",
          `${allocation.qlId}/${seed}: small divisor set not EASY`);
      }
      assert(question.explanation.stepByStep.some((step) => /d\(n\)=/u.test(step)),
        `${allocation.qlId}/${seed}: divisor-set explanation lacks count equation`);
    }

    if (allocation.qlId === "NUM-QL-055") {
      const prime = String(question.hiddenState.prime);
      assert(question.options.every((option) =>
        option.value === `\\(${prime}\\)` || option.value.startsWith(`\\(${prime}^{`)),
      `${allocation.qlId}/${seed}: option changes the given prime base`);
    }

    if (allocation.qlId === "NUM-QL-056") {
      const answer = Number(question.canonicalAnswer);
      const numericOptions = question.options
        .map((option) => Number(option.value))
        .filter(Number.isFinite);
      if (Number.isFinite(answer) && numericOptions.length === 4) {
        const ceiling = Math.max(1_000, answer * 5 + 100);
        assert(numericOptions.every((value) => value <= ceiling),
          `${allocation.qlId}/${seed}: implausibly large distractor`);
      }
      if (Number(question.hiddenState.targetDivisorCount) <= 4) {
        assert(question.difficulty === "EASY",
          `${allocation.qlId}/${seed}: basic least-number case not EASY`);
      }
    }

    if (allocation.qlId === "NUM-QL-057") {
      const learnerExplanation = JSON.stringify(question.explanation);
      assert(!/Checking downward|Continue:/iu.test(learnerExplanation),
        `${allocation.qlId}/${seed}: brute-force checking remains`);
      assert(/exponent pattern|divisor-count equation/iu.test(learnerExplanation),
        `${allocation.qlId}/${seed}: structural exam method missing`);
      if (question.canonicalAnswer !== "No such integer") {
        assert(divisorCountOfInteger(Number(question.canonicalAnswer))
          === Number(question.hiddenState.targetDivisorCount),
        `${allocation.qlId}/${seed}: answer divisor count`);
      }
    }

    if (allocation.qlId === "NUM-QL-058") {
      const divisors = divisorsFromState(primePowers(question.hiddenState));
      const bound = Number(question.hiddenState.bound);
      const answer = Number(question.canonicalAnswer);
      assert(bound > 1, `${allocation.qlId}/${seed}: trivial bound`);
      assert(answer === Math.max(...divisors.filter((value) => value <= bound)),
        `${allocation.qlId}/${seed}: maximum answer wrong`);
      assert(question.options.every((option) => Number(option.value) <= bound),
        `${allocation.qlId}/${seed}: option violates visible bound`);
      assert(question.explanation.stepByStep.some((step) =>
        /next greater divisor|no larger positive divisor/iu.test(step)),
      `${allocation.qlId}/${seed}: maximality not proved`);
    }

    if (allocation.qlId === "NUM-QL-059") {
      const divisors = divisorsFromState(primePowers(question.hiddenState));
      const index = Number(question.hiddenState.requestedIndex);
      if (divisors.length >= 8) {
        assert(index > 1 && index < divisors.length,
          `${allocation.qlId}/${seed}: first/last-position giveaway`);
      }
    }

    if (allocation.qlId === "NUM-QL-061") {
      const claimed = question.hiddenState.claimedValue;
      assert(question.options.every((option) =>
        isCoherentClaimOption(option.value, claimed)),
      `${allocation.qlId}/${seed}: self-contradictory claim option`);
    }

    if (allocation.qlId === "NUM-QL-063") {
      assert(/^If one factor of /u.test(question.stem),
        `${allocation.qlId}/${seed}: unnatural pair-row wording`);
      const n = Number(question.hiddenState.integerValue);
      const visible = Number(question.hiddenState.visiblePartner);
      const answer = Number(question.canonicalAnswer);
      if ((n % 10 === 0 && visible % 10 === 0 && answer <= 1_000)
        || (n <= 10_000 && visible <= 100 && answer <= 1_000)) {
        assert(question.difficulty === "EASY",
          `${allocation.qlId}/${seed}: basic division not EASY`);
      }
    }

    if (allocation.qlId === "NUM-QL-064" || allocation.qlId === "NUM-QL-065") {
      assert(/d\(n\)=\(x\+1\)\(y\+1\)/u.test(question.explanation.coreConcept),
        `${allocation.qlId}/${seed}: inverse formula missing`);
    }

    if (allocation.qlId === "NUM-QL-066") {
      assert(!/1 positive divisors/iu.test(question.stem),
        `${allocation.qlId}/${seed}: singular grammar error`);
    }

    if (allocation.qlId === "NUM-QL-067") {
      assert(question.explanation.stepByStep.length === 4,
        `${allocation.qlId}/${seed}: explanation must compare all four options`);
      const targetTotal = Number(question.hiddenState.totalDivisors);
      const targetSquare = Number(question.hiddenState.squareDivisors);
      const metrics = question.options.map((option) => {
        const raw = option.value.replace(/^\\\(/u, "").replace(/\\\)$/u, "");
        const state = raw.split(/\s*\\times\s*/u).map((term) => {
          const match = term.match(/^(\d+)(?:\^\{(\d+)\})?$/u);
          if (!match) throw new Error(`${allocation.qlId}/${seed}: invalid factor option`);
          return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
        });
        return {
          total: divisorCountFromState(state),
          square: squareDivisorCountFromState(state),
        };
      });
      assert(metrics.filter(({ total }) => total === targetTotal).length >= 2,
        `${allocation.qlId}/${seed}: total count alone identifies answer`);
      assert(metrics.filter(({ total, square }) =>
        total === targetTotal && square === targetSquare).length === 1,
      `${allocation.qlId}/${seed}: both conditions do not identify one option`);
      ql067TwoConditionChecks += 1;
    }

    if (allocation.qlId === "NUM-QL-068") {
      const firstState = primePowers(question.hiddenState);
      const secondState = secondPrimePowers(question.hiddenState);
      const metric = String(question.hiddenState.metricKind);
      const first = metricValue(firstState, metric);
      const second = metricValue(secondState, metric);
      const expected = `A has ${first}; B has ${second}; ${comparisonOutcome(first, second)}`;
      assert(question.canonicalAnswer === expected,
        `${allocation.qlId}/${seed}: visible metric and answer disagree`);
      assert(!question.options.some((option) => /cannot be determined/iu.test(option.value)),
        `${allocation.qlId}/${seed}: dead cannot-determine option`);
      for (const option of question.options) {
        const parsed = parseComparisonOption(option.value);
        assert(Boolean(parsed), `${allocation.qlId}/${seed}: malformed comparison option`);
        assert(parsed.outcome === comparisonOutcome(parsed.first, parsed.second),
          `${allocation.qlId}/${seed}: comparison option contradicts counts`);
        if (option.isCorrect) {
          assert(parsed.first === first && parsed.second === second,
            `${allocation.qlId}/${seed}: correct comparison counts wrong`);
        }
      }
      assert(question.difficulty !== "HARD",
        `${allocation.qlId}/${seed}: comparison overlabelled HARD`);
      assert(question.explanation.stepByStep.some((step) => step.includes(String(first)))
        && question.explanation.stepByStep.some((step) => step.includes(String(second))),
      `${allocation.qlId}/${seed}: comparison calculation missing`);
      visibleComparisonChecks += 1;
    }

    if (allocation.qlId === "NUM-QL-069") {
      assert(question.explanation.stepByStep.some((step) => /S_I=/u.test(step))
        && question.explanation.stepByStep.some((step) => /S_\{II\}=/u.test(step)),
      `${allocation.qlId}/${seed}: candidate equations missing`);
      assert(!/same parity as|remainder on division|twice a perfect square|n\\div/iu.test(question.stem),
        `${allocation.qlId}/${seed}: synthetic data-sufficiency wording`);
    }
  }
}

assert(checkedQuestions === 2_880, "release-review corpus size");
for (const [qlId, limit] of firstReviewLimits) {
  assert(reviewStems.get(qlId).size === limit,
    `${qlId}: first ${limit} review stems not distinct`);
}
assert(uniqueReviewQuestions === 100, "review uniqueness corpus size");
assert(visibleComparisonChecks === 120, "comparison coverage");
assert(ql067TwoConditionChecks === 120, "two-condition coverage");
const easyExplanationAverageWords = easyExplanationCount === 0
  ? 0
  : easyExplanationWordTotal / easyExplanationCount;
assert(easyExplanationAverageWords <= 115,
  `easy explanations too long: ${easyExplanationAverageWords}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_FINAL_EXAM_READINESS_AUDIT",
  checkedQuestions,
  visibleComparisonChecks,
  ql067TwoConditionChecks,
  visibleStemAnswerMismatches: 0,
  contradictoryComparisonOptions: 0,
  bruteForceExplanationViolations: 0,
  conflictingDifficultyLabels: 0,
  duplicateManualReviewQuestions: 0,
  syntheticDataSufficiencyStemViolations: 0,
  firstReviewDistinctStemsByQl: Object.fromEntries(
    [...reviewStems.entries()].map(([qlId, stems]) => [qlId, stems.size]),
  ),
  uniqueReviewQuestions,
  easyExplanationCount,
  easyExplanationAverageWords,
}, null, 2));
