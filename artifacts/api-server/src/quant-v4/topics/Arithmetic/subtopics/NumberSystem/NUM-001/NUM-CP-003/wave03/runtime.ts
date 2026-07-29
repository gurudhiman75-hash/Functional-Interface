import { fillSingleDigit, validSingleDigits, validTwoDigitPairs } from "../../foundation/divisibility";
import { createRandom, type DeterministicRandom } from "../../foundation/prng";
import { pairText, shuffle, type Raw } from "./core";
import { arithmeticResultDigit, twoDigitPairCount } from "./arithmetic-generators";
import { rangeTwoDivisors } from "./range-generators";
import { SUFFICIENCY_TEXT, claimVerification, classifySufficiency, dataSufficiency, powerDifferenceDivisor } from "./representation-generators";
import {
  NUM_CP003_WAVE03_IDS,
  type NumCp003Wave03Id,
  type NumCp003Wave03Question,
  type Wave03HiddenState,
} from "./types";

function rawFor(id: NumCp003Wave03Id, random: DeterministicRandom): Raw {
  switch (id) {
    case "NUM-CP003-W3-PROT-MISSING-DIGIT-IN-DIFFERENCE": return arithmeticResultDigit(random, "DIFFERENCE");
    case "NUM-CP003-W3-PROT-MISSING-DIGIT-IN-PRODUCT": return arithmeticResultDigit(random, "PRODUCT");
    case "NUM-CP003-W3-PROT-TWO-DIGIT-PAIR-COUNT": return twoDigitPairCount(random);
    case "NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-EITHER": return rangeTwoDivisors(random, "EITHER");
    case "NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-NEITHER": return rangeTwoDivisors(random, "NEITHER");
    case "NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-EXACTLY-ONE": return rangeTwoDivisors(random, "EXACTLY_ONE");
    case "NUM-CP003-W3-PROT-MISSING-DIGIT-DATA-SUFFICIENCY": return dataSufficiency(random);
    case "NUM-CP003-W3-PROT-GUARANTEED-POWER-DIFFERENCE-DIVISOR": return powerDifferenceDivisor(random);
    case "NUM-CP003-W3-PROT-DIVISIBILITY-CLAIM-VERIFICATION": return claimVerification(random);
  }
}

function verifySufficiency(state: Extract<Wave03HiddenState, { kind: "MISSING_DIGIT_DATA_SUFFICIENCY" }>): string {
  const firstDigits = validSingleDigits(state.template, state.firstDivisor);
  const secondDigits = validSingleDigits(state.template, state.secondDivisor);
  const intersection = firstDigits.filter((digit) => secondDigits.includes(digit));
  const classification = classifySufficiency(firstDigits, secondDigits, intersection);
  if (classification === null) throw new Error("Sufficiency state became inconsistent");
  return SUFFICIENCY_TEXT[classification];
}

function verify(state: Wave03HiddenState): string {
  switch (state.kind) {
    case "MISSING_DIGIT_IN_DIFFERENCE": {
      if (state.minuend - state.subtrahend !== state.actualResult) throw new Error("Difference reconstruction failed");
      const resultText = state.actualResult.toString();
      for (let digit = 0; digit <= 9; digit += 1) if (fillSingleDigit(state.resultTemplate, digit) === resultText) return String(digit);
      throw new Error("Difference digit not found");
    }
    case "MISSING_DIGIT_IN_PRODUCT": {
      if (state.multiplicand * state.multiplier !== state.actualResult) throw new Error("Product reconstruction failed");
      const resultText = state.actualResult.toString();
      for (let digit = 0; digit <= 9; digit += 1) if (fillSingleDigit(state.resultTemplate, digit) === resultText) return String(digit);
      throw new Error("Product digit not found");
    }
    case "TWO_DIGIT_PAIR_COUNT": return String(validTwoDigitPairs(state.template, state.divisors).length);
    case "RANGE_TWO_DIVISORS": {
      let count = 0n;
      for (let value = state.lower; value <= state.upper; value += 1n) {
        const first = value % state.firstDivisor === 0n;
        const second = value % state.secondDivisor === 0n;
        const accepted = state.predicate === "EITHER" ? first || second : state.predicate === "NEITHER" ? !first && !second : first !== second;
        if (accepted) count += 1n;
      }
      return count.toString();
    }
    case "MISSING_DIGIT_DATA_SUFFICIENCY": return verifySufficiency(state);
    case "POWER_DIFFERENCE_DIVISOR": {
      const matches = state.divisorOptions.filter((divisor) => state.value % divisor === 0n);
      if (matches.length !== 1) throw new Error(`Expected one displayed divisor, found ${matches}`);
      return matches[0]!.toString();
    }
    case "DIVISIBILITY_CLAIM": {
      const trueClaims = state.claims.filter((claim) => claim.assertedDivisible === (state.number % claim.divisor === 0n));
      if (trueClaims.length !== 1) throw new Error(`Expected one true claim, found ${trueClaims.length}`);
      return trueClaims[0]!.text;
    }
  }
}

export function generateNumCp003Wave03(id: NumCp003Wave03Id, seed: string): NumCp003Wave03Question {
  if (!NUM_CP003_WAVE03_IDS.includes(id)) throw new Error(`Unknown wave-03 prototype ${id}`);
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
