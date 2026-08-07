import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import { normalizeNumCp005OptionSemantic } from "./english-remediation";
import { runNumCp005PermanentPipeline } from "./runtime";
import {
  divisorCountFromState,
  divisorsFromState,
  oddDivisorCountFromState,
  primePowers,
  squareDivisorCountFromState,
} from "./english-remediation-common";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function secondState(hiddenState) {
  return Array.isArray(hiddenState.secondFactorState)
    ? hiddenState.secondFactorState.map((entry) => ({
      prime: Number(entry?.prime),
      exponent: Number(entry?.exponent),
    }))
    : [];
}

function metricCount(state, metricKind) {
  if (metricKind === "ODD_DIVISORS") return oddDivisorCountFromState(state);
  if (metricKind === "SQUARE_DIVISORS") return squareDivisorCountFromState(state);
  return divisorCountFromState(state);
}

function expectedComparison(first, second) {
  return first > second ? "Number A" : first < second ? "Number B" : "They are equal";
}

function isCoherentClaimOption(optionText, claimedValue) {
  const match = optionText.match(/^The claim is (correct|incorrect); the actual value is (-?\d+)\.$/u);
  if (!match) return false;
  const statedVerdict = match[1];
  const statedValue = match[2];
  const expectedVerdict = statedValue === String(claimedValue) ? "correct" : "incorrect";
  return statedVerdict === expectedVerdict;
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

let checkedQuestions = 0;
let easyExplanationWordTotal = 0;
let easyExplanationCount = 0;
const ql065ReviewStems = new Set();

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const question = runNumCp005PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
    });
    checkedQuestions += 1;

    const semanticOptions = question.options.map((option) => normalizeNumCp005OptionSemantic(option.value));
    assert(
      new Set(semanticOptions).size === 4,
      `${allocation.qlId}/${seed}: equivalent or duplicate options`,
    );

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

    if (allocation.qlId === "NUM-QL-055") {
      assert(
        new Set(semanticOptions).size === question.options.length,
        `${allocation.qlId}/${seed}: equivalent prime-power options`,
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
      const state = primePowers(question.hiddenState);
      if (state.length === 1) {
        assert(
          !question.explanation.commonTraps.some((trap) => /not always the smallest/iu.test(trap)),
          `${allocation.qlId}/${seed}: irrelevant multi-pattern warning`,
        );
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

    if (allocation.qlId === "NUM-QL-060") {
      const lower = Number(question.hiddenState.lower);
      const upper = Number(question.hiddenState.upper);
      const target = Number(question.hiddenState.targetDivisorCount);
      if ((target === 2 || target === 3) && upper - lower + 1 <= 20) {
        assert(question.difficulty === "EASY", `${allocation.qlId}/${seed}: short prime/prime-square interval not EASY`);
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
      if (allocation.qlId === "NUM-QL-065") {
        assert(question.difficulty !== "HARD", `${allocation.qlId}/${seed}: bounded two-variable factor-pair case overlabelled HARD`);
        if (seed <= 15) ql065ReviewStems.add(question.stem);
      }
    }

    if (allocation.qlId === "NUM-QL-066") {
      const b = Number(question.hiddenState.oddDivisors) - 1;
      if (b !== 0) {
        assert(
          !question.explanation.commonTraps.some((trap) => /p\^?0|p⁰/iu.test(trap)),
          `${allocation.qlId}/${seed}: irrelevant p-zero warning`,
        );
      }
    }

    if (allocation.qlId === "NUM-QL-068") {
      const first = metricCount(primePowers(question.hiddenState), String(question.hiddenState.metricKind));
      const second = metricCount(secondState(question.hiddenState), String(question.hiddenState.metricKind));
      const expected = `A has ${first} and B has ${second}; ${expectedComparison(first, second)}.`;
      assert(question.canonicalAnswer === expected, `${allocation.qlId}/${seed}: comparison answer not based on requested divisor counts`);
      assert(question.difficulty !== "HARD", `${allocation.qlId}/${seed}: comparison caselet overlabelled HARD`);
      assert(
        question.explanation.stepByStep.some((step) => /d_A=\d+/u.test(step)),
        `${allocation.qlId}/${seed}: comparison calculation missing`,
      );
    }

    if (allocation.qlId === "NUM-QL-069") {
      assert(
        question.explanation.stepByStep.some((step) => /S_I=/u.test(step))
          && question.explanation.stepByStep.some((step) => /S_\{II\}=/u.test(step)),
        `${allocation.qlId}/${seed}: data-sufficiency candidate equations missing`,
      );
    }
  }
}

assert(checkedQuestions === 2_880, "release-review audit corpus size");
assert(ql065ReviewStems.size >= 8, "QL-065 first 15 review questions remain clone-heavy");
const easyExplanationAverageWords = easyExplanationCount === 0 ? 0 : easyExplanationWordTotal / easyExplanationCount;
assert(easyExplanationAverageWords <= 115, `easy explanations remain too long: ${easyExplanationAverageWords}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_RELEASE_REVIEW_CORRECTION_AUDIT",
  checkedQuestions,
  equivalentOptionViolations: 0,
  contradictoryClaimOptionViolations: 0,
  implausibleDistractorViolations: 0,
  answerRevealingPositionViolations: 0,
  difficultyCalibrationViolations: 0,
  explanationSpecificityViolations: 0,
  ql065DistinctReviewStems: ql065ReviewStems.size,
  easyExplanationCount,
  easyExplanationAverageWords,
}, null, 2));
