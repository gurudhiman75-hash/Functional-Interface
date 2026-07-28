import { validSingleDigits, validTwoDigitPairs } from "../../foundation/divisibility";
import { createRandom, type DeterministicRandom } from "../../foundation/prng";
import { RULES, pairSetText, shuffle } from "./core";
import { repeatedBlockIdentity, powerSumIdentity } from "./identity-generators";
import { orderedPairSet, pairSolutionClass } from "./pair-generators";
import { divisorFromRule, ruleFromDivisor, type RawWave04 } from "./rule-generators";
import { countThreeDivisors, eachStatementAlone } from "./sufficiency-range-generators";
import {
  NUM_CP003_WAVE04_IDS,
  type NumCp003Wave04Id,
  type NumCp003Wave04Question,
  type PairSolutionClass,
  type Wave04HiddenState,
} from "./types";

const EACH_ALONE = "Each statement alone is sufficient to determine X.";
const SOLUTION_TEXT: Record<PairSolutionClass, string> = {
  NO_SOLUTION: "No ordered pair satisfies both conditions.",
  UNIQUE_SOLUTION: "Exactly one ordered pair satisfies both conditions.",
  MULTIPLE_SOLUTIONS: "More than one ordered pair satisfies both conditions.",
};

function rawFor(id: NumCp003Wave04Id, random: DeterministicRandom): RawWave04 {
  switch (id) {
    case "NUM-CP003-W4-PROT-DIVISOR-FROM-RULE": return divisorFromRule(random);
    case "NUM-CP003-W4-PROT-RULE-FROM-DIVISOR": return ruleFromDivisor(random);
    case "NUM-CP003-W4-PROT-TWO-DIGIT-PAIR-SET": return orderedPairSet(random);
    case "NUM-CP003-W4-PROT-TWO-DIGIT-SOLUTION-CLASS": return pairSolutionClass(random);
    case "NUM-CP003-W4-PROT-EACH-STATEMENT-ALONE-SUFFICIENT": return eachStatementAlone(random);
    case "NUM-CP003-W4-PROT-COUNT-THREE-DIVISORS-AT-LEAST-ONE": return countThreeDivisors(random);
    case "NUM-CP003-W4-PROT-REPEATED-BLOCK-GUARANTEED-DIVISOR": return repeatedBlockIdentity(random);
    case "NUM-CP003-W4-PROT-POWER-SUM-GUARANTEED-DIVISOR": return powerSumIdentity(random);
  }
}

function verify(state: Wave04HiddenState): string {
  switch (state.kind) {
    case "RULE_RECOGNITION": {
      const record = RULES.find((rule) => rule.ruleId === state.ruleId);
      if (!record || record.divisor !== state.divisor || record.ruleText !== state.ruleText) throw new Error("Rule registry reconstruction failed");
      return state.direction === "DIVISOR_FROM_RULE" ? state.divisor.toString() : state.ruleText;
    }
    case "TWO_DIGIT_PAIR_SET": return pairSetText(validTwoDigitPairs(state.template, state.divisors));
    case "TWO_DIGIT_SOLUTION_CLASS": {
      const count = validTwoDigitPairs(state.template, state.divisors).length;
      const classification: PairSolutionClass = count === 0 ? "NO_SOLUTION" : count === 1 ? "UNIQUE_SOLUTION" : "MULTIPLE_SOLUTIONS";
      return SOLUTION_TEXT[classification];
    }
    case "EACH_STATEMENT_ALONE_SUFFICIENT": {
      const first = validSingleDigits(state.template, state.firstDivisor);
      const second = validSingleDigits(state.template, state.secondDivisor);
      if (first.length !== 1 || second.length !== 1 || first[0] !== second[0]) throw new Error("Each-alone sufficiency reconstruction failed");
      return EACH_ALONE;
    }
    case "THREE_DIVISOR_RANGE": {
      let count = 0n;
      for (let value = state.lower; value <= state.upper; value += 1n) {
        if (state.divisors.some((divisor) => value % divisor === 0n)) count += 1n;
      }
      return count.toString();
    }
    case "REPEATED_BLOCK_IDENTITY": {
      const matches = state.divisorOptions.filter((divisor) => state.repetitionFactor % divisor === 0n);
      if (matches.length !== 1) throw new Error(`Expected one displayed repetition-factor divisor, found ${matches}`);
      return matches[0]!.toString();
    }
    case "POWER_SUM_IDENTITY": {
      const reconstructed = state.firstBase ** BigInt(state.oddExponent) + state.secondBase ** BigInt(state.oddExponent);
      if (reconstructed !== state.value) throw new Error("Power-sum reconstruction failed");
      const matches = state.divisorOptions.filter((divisor) => reconstructed % divisor === 0n);
      if (matches.length !== 1) throw new Error(`Expected one displayed power-sum divisor, found ${matches}`);
      return matches[0]!.toString();
    }
  }
}

export function generateNumCp003Wave04(id: NumCp003Wave04Id, seed: string): NumCp003Wave04Question {
  if (!NUM_CP003_WAVE04_IDS.includes(id)) throw new Error(`Unknown Wave 04 prototype ${id}`);
  const random = createRandom(`${id}:${seed}`);
  const raw = rawFor(id, random);
  const shuffled = shuffle(random, raw.options);
  const verifierAnswer = verify(raw.hiddenState);
  const errors: string[] = [];
  if (verifierAnswer !== raw.answer) errors.push(`Verifier ${verifierAnswer} != answer ${raw.answer}`);
  if (shuffled.rows[shuffled.correctIndex]?.text !== raw.answer) errors.push("Correct option mismatch");
  if (!raw.stem.endsWith("?")) errors.push("Stem is not interrogative");
  if (raw.explanation.steps.length < 3) errors.push("Expected at least three steps");
  if (raw.explanation.traps.length !== 3) errors.push("Expected three traps");

  return {
    canonicalProblemId: "NUM-CP-003",
    prototypeId: id,
    permanentQlId: null,
    seed,
    difficulty: raw.difficulty,
    answerSemantic: raw.answerSemantic,
    stem: raw.stem,
    answer: raw.answer,
    options: shuffled.rows.map((row) => row.text),
    correctIndex: shuffled.correctIndex,
    optionAudit: shuffled.rows,
    hiddenState: raw.hiddenState,
    explanation: raw.explanation,
    reasoningGraph: { nodes: raw.nodes },
    fingerprint: raw.fingerprint,
    validation: { ok: errors.length === 0, errors, verifierAnswer },
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
