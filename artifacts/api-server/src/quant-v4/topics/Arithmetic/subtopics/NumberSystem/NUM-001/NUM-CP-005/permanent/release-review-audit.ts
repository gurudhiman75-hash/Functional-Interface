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

function isCoherentClaimOption(optionText, claimedValue) {
  const match = optionText.match(/^The claim is (correct|incorrect); the actual value is (-?\d+)\.$/u);
  if (!match) return false;
  const statedVerdict = match[1];
  const statedValue = match[2];
  const expectedVerdict = statedValue === String(claimedValue) ? "correct" : "incorrect";
  return statedVerdict === expectedVerdict;
}

function parseVisibleFactorisation(expression) {
  return expression.split(/\s*\\times\s*/u).map((term) => {
    const match = term.trim().match(/^(\d+)(?:\^\{(\d+)\})?$/u);
    if (!match) throw new Error(`Unable to parse visible factorisation term: ${term}`);
    return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
  });
}

function parseVisibleComparisonStem(stem) {
  const match = stem.match(/^Number A is \\\((.+)\\\) and Number B is \\\((.+)\\\)\. Compare their (.+)\.$/u);
  if (!match) throw new Error(`Unable to parse QL-068 visible stem: ${stem}`);
  return {
    firstState: parseVisibleFactorisation(match[1]),
    secondState: parseVisibleFactorisation(match[2]),
    metricLabel: match[3],
  };
}

function metricFromVisibleLabel(label) {
  if (label === "sum of positive divisors") return "DIVISOR_SUM";
  if (label === "number of perfect-square positive divisors") return "SQUARE_DIVISORS";
  if (label === "number of odd positive divisors") return "ODD_DIVISORS";
  if (label === "total number of positive divisors") return "TOTAL_DIVISORS";
  throw new Error(`Unknown visible QL-068 metric label: ${label}`);
}

function divisorSumFromState(state) {
  return state.reduce(
    (value, { prime, exponent }) => value * geometricSum(prime, exponent),
    1,
  );
}

function metricValue(state, metric) {
  if (metric === "DIVISOR_SUM") return divisorSumFromState(state);
  if (metric === "SQUARE_DIVISORS") return squareDivisorCountFromState(state);
  if (metric === "ODD_DIVISORS") return oddDivisorCountFromState(state);
  return divisorCountFromState(state);
}

function comparisonAnswer(first, second) {
  return first > second
    ? "Number A has more."
    : first < second
      ? "Number B has more."
      : "Both numbers have the same value.";
}

function normalizedQuestionFingerprint(question) {
  return JSON.stringify({
    stem: question.stem,
    options: question.options.map((option) => option.value),
    answer: question.canonicalAnswer,
  });
}

const comparisonOptions = new Set([
  "Number A has more.",
  "Number B has more.",
  "Both numbers have the same value.",
  "The comparison cannot be determined from the given information.",
]);
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
    assert(
      new Set(semanticOptions).size === 4,
      `${allocation.qlId}/${seed}: equivalent or duplicate options`,
    );

    const priorDifficulty = difficultyByStem.get(question.stem);
    if (priorDifficulty) {
      assert(
        priorDifficulty === question.difficulty,
        `${allocation.qlId}/${seed}: identical stem has conflicting difficulty`,
      );
    } else {
      difficultyByStem.set(question.stem, question.difficulty);
    }

    if (reviewLimit > 0 && seed <= reviewLimit) {
      reviewStems.get(allocation.qlId).add(question.stem);
      const fingerprint = normalizedQuestionFingerprint(question);
      assert(
        !reviewFingerprints.has(fingerprint),
        `${allocation.qlId}/${seed}: duplicate question in manual-review sample`,
      );
      reviewFingerprints.add(fingerprint);
      uniqueReviewQuestions += 1;
    }

    if (question.difficulty === "EASY") {
      easyExplanationCount += 1;
      easyExplanationWordTotal += explanationWordCount(question.explanation);
    }

    if (allocation.qlId === "NUM-QL-049") {
      const working = question.explanation.stepByStep.join("\n");
      assert(/Required count/iu.test(working), `${allocation.qlId}/${seed}: missing final subtraction`);
      assert((working.match(/=/gu)?.length ?? 0) >= 3, `${allocation.qlId}/${seed}: intermediate counts not derived`);
    }

    if (allocation.qlId === "NUM-QL-053") {
      const state = primePowers(question.hiddenState);
      if (divisorCountFromState(state) <= 4) {
        assert(question.difficulty === "EASY", `${allocation.qlId}/${seed}: small divisor set not EASY`);
      }
      assert(
        question.explanation.stepByStep.some((step) => /d\(n\)=/u.test(step)),
        `${allocation.qlId}/${seed}: divisor-set explanation lacks count equation`,
      );
    }

    if (allocation.qlId === "NUM-QL-056") {
      const answer = Number(question.canonicalAnswer);
      const numericOptions = question.options.map((option) => Number(option.value)).filter(Number.isFinite);
      if (Number.isFinite(answer) && numericOptions.length === 4) {
        const ceiling = Math.max(1_000, answer * 5 + 100);
        assert(
          numericOptions.every((value) => value <= ceiling),
          `${allocation.qlId}/${seed}: implausibly large distractor`,
        );
      }
      const target = Number(question.hiddenState.targetDivisorCount);
      if (target <= 4) {
        assert(question.difficulty === "EASY", `${allocation.qlId}/${seed}: basic least-number case not EASY`);
      }
    }

    if (allocation.qlId === "NUM-QL-057") {
      const learnerExplanation = JSON.stringify(question.explanation);
      assert(
        !/Checking downward|Continue:/iu.test(learnerExplanation),
        `${allocation.qlId}/${seed}: brute-force downward checking remains`,
      );
      assert(
        /exponent pattern|divisor-count equation/iu.test(learnerExplanation),
        `${allocation.qlId}/${seed}: structural exam method missing`,
      );
      if (question.canonicalAnswer === "No such integer") {
        assert(
          /smallest allowed number|smallest allowed value/iu.test(learnerExplanation),
          `${allocation.qlId}/${seed}: no-solution proof lacks minimum-pattern comparison`,
        );
      } else {
        const answer = Number(question.canonicalAnswer);
        assert(divisorCountOfInteger(answer) === Number(question.hiddenState.targetDivisorCount), `${allocation.qlId}/${seed}: answer divisor count`);
      }
    }

    if (allocation.qlId === "NUM-QL-058") {
      const divisors = divisorsFromState(primePowers(question.hiddenState));
      const bound = Number(question.hiddenState.bound);
      const answer = Number(question.canonicalAnswer);
      assert(answer === Math.max(...divisors.filter((value) => value <= bound)), `${allocation.qlId}/${seed}: maximum answer wrong`);
      assert(
        question.explanation.stepByStep.some((step) => /next greater divisor|no larger positive divisor/iu.test(step)),
        `${allocation.qlId}/${seed}: maximality not proved`,
      );
    }

    if (allocation.qlId === "NUM-QL-059") {
      const divisors = divisorsFromState(primePowers(question.hiddenState));
      const index = Number(question.hiddenState.requestedIndex);
      if (divisors.length >= 8) {
        assert(index > 1 && index < divisors.length, `${allocation.qlId}/${seed}: first/last-position giveaway remains`);
      }
    }

    if (allocation.qlId === "NUM-QL-061") {
      const claimed = question.hiddenState.claimedValue;
      assert(
        question.options.every((option) => isCoherentClaimOption(option.value, claimed)),
        `${allocation.qlId}/${seed}: self-contradictory claim option`,
      );
    }

    if (allocation.qlId === "NUM-QL-063") {
      const n = Number(question.hiddenState.integerValue);
      const visible = Number(question.hiddenState.visiblePartner);
      const answer = Number(question.canonicalAnswer);
      const simple = (n % 10 === 0 && visible % 10 === 0 && answer <= 1_000)
        || (n <= 10_000 && visible <= 100 && answer <= 1_000);
      if (simple) assert(question.difficulty === "EASY", `${allocation.qlId}/${seed}: basic division not EASY`);
    }

    if (allocation.qlId === "NUM-QL-064" || allocation.qlId === "NUM-QL-065") {
      assert(
        /d\(n\)=\(x\+1\)\(y\+1\)/u.test(question.explanation.coreConcept),
        `${allocation.qlId}/${seed}: inverse divisor formula missing from core concept`,
      );
    }

    if (allocation.qlId === "NUM-QL-067") {
      assert(
        question.explanation.stepByStep.length === 4,
        `${allocation.qlId}/${seed}: explanation must compare all four options`,
      );
    }

    if (allocation.qlId === "NUM-QL-068") {
      const visible = parseVisibleComparisonStem(question.stem);
      const metric = metricFromVisibleLabel(visible.metricLabel);
      const first = metricValue(visible.firstState, metric);
      const second = metricValue(visible.secondState, metric);
      const expected = comparisonAnswer(first, second);
      assert(question.canonicalAnswer === expected, `${allocation.qlId}/${seed}: visible stem and answer metric disagree`);
      assert(
        question.options.every((option) => comparisonOptions.has(option.value)),
        `${allocation.qlId}/${seed}: comparison options are not mutually coherent`,
      );
      assert(
        new Set(question.options.map((option) => option.value)).size === 4,
        `${allocation.qlId}/${seed}: comparison option collision`,
      );
      assert(question.difficulty !== "HARD", `${allocation.qlId}/${seed}: comparison caselet overlabelled HARD`);
      assert(
        question.explanation.stepByStep.length >= 3
          && question.explanation.stepByStep.some((step) => step.includes(String(first)))
          && question.explanation.stepByStep.some((step) => step.includes(String(second))),
        `${allocation.qlId}/${seed}: comparison calculation missing`,
      );
      visibleComparisonChecks += 1;
    }

    if (allocation.qlId === "NUM-QL-069") {
      assert(
        question.explanation.stepByStep.some((step) => /S_I=/u.test(step))
          && question.explanation.stepByStep.some((step) => /S_\{II\}=/u.test(step)),
        `${allocation.qlId}/${seed}: data-sufficiency candidate equations missing`,
      );
      assert(
        !/same parity as|remainder on division|not divisible by (?:7|8|9|10|11|12)/iu.test(question.stem),
        `${allocation.qlId}/${seed}: synthetic data-sufficiency wording remains`,
      );
    }
  }
}

assert(checkedQuestions === 2_880, "release-review audit corpus size");
for (const [qlId, limit] of firstReviewLimits) {
  assert(
    reviewStems.get(qlId).size === limit,
    `${qlId}: first ${limit} manual-review stems are not all distinct`,
  );
}
assert(uniqueReviewQuestions === 100, "expanded review uniqueness corpus size");
assert(visibleComparisonChecks === 120, "visible comparison verifier coverage");
const easyExplanationAverageWords = easyExplanationCount === 0
  ? 0
  : easyExplanationWordTotal / easyExplanationCount;
assert(easyExplanationAverageWords <= 115, `easy explanations remain too long: ${easyExplanationAverageWords}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_FINAL_EXAM_READINESS_AUDIT",
  checkedQuestions,
  visibleComparisonChecks,
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
