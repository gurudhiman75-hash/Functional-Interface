import type { DeterministicRandom } from "../../foundation/prng";
import { DIVISOR_POOL, difficultyFromState, option, reasoningNodes } from "./runtime-core";
import type { NumCp003RawRetainedQuestion } from "./runtime-types";

interface ClaimState {
  text: string;
  number: bigint;
  divisor: bigint;
  isTrue: boolean;
}

function createClaim(random: DeterministicRandom, requiredTruth: boolean): ClaimState {
  for (let attempt = 0; attempt < 1_000; attempt += 1) {
    const divisor = random.pick(DIVISOR_POOL);
    const actualDivisible = random.bool();
    const number = actualDivisible
      ? divisor * BigInt(random.int(700, 70_000))
      : BigInt(random.int(10_000, 999_999));
    if (!actualDivisible && number % divisor === 0n) continue;

    const assertsDivisible = requiredTruth ? actualDivisible : !actualDivisible;
    const text = `${number} is ${assertsDivisible ? "divisible" : "not divisible"} by ${divisor}.`;
    const statementTruth = (number % divisor === 0n) === assertsDivisible;
    if (statementTruth !== requiredTruth) continue;
    return { text, number, divisor, isTrue: statementTruth };
  }
  throw new Error(`Unable to construct a ${requiredTruth ? "true" : "false"} divisibility claim`);
}

export function generateClaimAuthority(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const requestedPolarity = random.pick(["CORRECT", "INCORRECT"] as const);
  const desiredTruth = requestedPolarity === "CORRECT";
  const answerIndex = random.int(0, 3);
  const claims = Array.from({ length: 4 }, (_unused, index) => createClaim(random, index === answerIndex ? desiredTruth : !desiredTruth));
  const answerClaim = claims[answerIndex]!;
  const rows = claims.map((claim, index) => {
    const actualDivisible = claim.number % claim.divisor === 0n;
    const assertedDivisible = !claim.text.includes("not divisible");
    return option(
      claim.text,
      index === answerIndex ? "CORRECT" : "WRONG_CLAIM_TRUTH_STATUS",
      `${claim.number} ${actualDivisible ? "is" : "is not"} exactly divisible by ${claim.divisor}; therefore the displayed assertion is ${actualDivisible === assertedDivisible ? "true" : "false"}.`,
    );
  });

  return {
    difficulty: difficultyFromState(claims.reduce((total, claim) => total + claim.divisor.toString().length, 0) + (requestedPolarity === "INCORRECT" ? 2 : 0)),
    answerSemantic: "TRUTH_CLAIM",
    stem: random.pick([
      `Which of the following divisibility statements is ${requestedPolarity.toLowerCase()}?`,
      `Select the ${requestedPolarity.toLowerCase()} claim.`,
      `Exactly one option has the requested truth status. Which statement is ${requestedPolarity.toLowerCase()}?`,
      `Identify the ${requestedPolarity.toLowerCase()} divisibility assertion among the choices.`,
    ]),
    answer: answerClaim.text,
    optionAudit: rows,
    hiddenState: { kind: "CLAIM_VALIDATION", requestedPolarity, claims },
    explanation: {
      coreConcept: "A claim is true only when its stated divisible/not-divisible polarity matches the exact remainder.",
      strategy: "Evaluate each number–divisor pair, determine the truth of its assertion and then apply the requested correct/incorrect polarity.",
      steps: [
        "Check the exact divisibility fact behind every displayed statement.",
        `The question asks for the ${requestedPolarity.toLowerCase()} assertion.`,
        `The matching statement is: ${answerClaim.text}`,
      ],
      shortcut: "Use the appropriate divisibility rule for each option, then confirm any close case by exact remainder.",
      verification: rows[answerIndex]!.diagnostic,
      conclusion: `Therefore, '${answerClaim.text}' is the required ${requestedPolarity.toLowerCase()} claim.`,
      traps: [
        "Do not confuse the truth of the arithmetic fact with the wording of the assertion.",
        "When the question asks for an incorrect claim, a true statement is a distractor.",
        "Evaluate every option with its own divisor rule.",
      ],
    },
    reasoningNodes: reasoningNodes(
      `The requested truth polarity is ${requestedPolarity}.`,
      "Evaluate the exact assertion truth for every option.",
      `The matching claim is '${answerClaim.text}'.`,
      rows[answerIndex]!.diagnostic,
      `Select the ${requestedPolarity.toLowerCase()} statement.`,
    ),
    fingerprint: `claim:${requestedPolarity}:${claims.map((claim) => `${claim.number}/${claim.divisor}/${claim.text}/${claim.isTrue}`).join("|")}`,
  };
}
