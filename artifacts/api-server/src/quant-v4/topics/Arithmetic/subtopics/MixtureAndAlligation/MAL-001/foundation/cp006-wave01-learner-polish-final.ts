import {
  generateMalCp006Wave01EditorialV2FinalQuestion,
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  type MalCp006Wave01V2PrototypeId,
  verifyMalCp006Wave01V2Answer,
} from "./cp006-wave01-learner-remediation-v2-final";
import {
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import {
  getMalCp006Vessel,
  malCp006ComponentB,
} from "./cp006-solver";
import type { MalCp006DiscoveryQuestion } from "./cp006-types";

export {
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  type MalCp006Wave01V2PrototypeId,
  verifyMalCp006Wave01V2Answer,
};

function friendly(value: { numerator: bigint; denominator: bigint }): string {
  if (value.denominator === 1n) return String(value.numerator);
  if (100n % value.denominator === 0n) {
    const scaled = value.numerator * (100n / value.denominator);
    const sign = scaled < 0n ? "-" : "";
    const absolute = scaled < 0n ? -scaled : scaled;
    const whole = absolute / 100n;
    const decimal = String(absolute % 100n).padStart(2, "0").replace(/0+$/u, "");
    return decimal ? `${sign}${whole}.${decimal}` : `${sign}${whole}`;
  }
  return formatRational(value);
}

function quantity(value: { numerator: bigint; denominator: bigint }, unit = "litres"): string {
  const number = friendly(value);
  return `${number} ${number === "1" && unit === "litres" ? "litre" : unit}`;
}

function fractionText(value: { numerator: bigint; denominator: bigint }): string {
  return value.denominator === 1n
    ? String(value.numerator)
    : `${value.numerator}/${value.denominator}`;
}

function ratioText(first: { numerator: bigint; denominator: bigint }, second: { numerator: bigint; denominator: bigint }): string {
  const [a, b] = reduceRationalRatio(first, second);
  return `${friendly(a)} : ${friendly(b)}`;
}

function polishText(text: string): string {
  return text
    .replace(/\ba acid-water solution\b/gu, "an acid-water solution")
    .replace(/\bof (\d+(?:\.\d+)?)% acid mixture\b/gu, "of an acid-water solution containing $1% acid")
    .replace(/\bof (\d+(?:\.\d+)?)% alcohol mixture\b/gu, "of an alcohol-water mixture containing $1% alcohol")
    .replace(/\bof (\d+(?:\.\d+)?)% milk mixture\b/gu, "of a milk-water mixture containing $1% milk")
    .replace(/\bof (\d+(?:\.\d+)?)% salt mixture\b/gu, "of a salt-water solution containing $1% salt")
    .replace(/First ([0-9 .\/]+ litres) goes B→A;/gu, "First $1 is transferred from B to A;")
    .replace(/then, after mixing, ([0-9 .\/]+ litres) goes A→B\./gu, "then, after mixing, $1 is transferred from A to B.")
    .replace(/\b1 litres\b/gu, "1 litre")
    .replace(/What is the final ([a-z]+) : ([a-z]+) in B at the end\?/giu, "What is the final $1-to-$2 ratio in B?")
    .replace(/What is ([a-z]+) : ([a-z]+) in B\?/giu, "What is the final $1-to-$2 ratio in B?")
    .replace(/What is final milk in A : final water in B\?/gu, "What is the ratio of final milk in A to final water in B?");
}

function optionFriendly(option: string): boolean {
  for (const match of option.matchAll(/(\d+)\/(\d+)/gu)) {
    if (Number(match[2]) > 12) return false;
  }
  return true;
}

function rebuildRoundTripExplanation(
  question: MalCp006DiscoveryQuestion,
): MalCp006DiscoveryQuestion["explanation"] {
  const [initialA, initialB] = question.exactState.initialVessels;
  const [firstOperation, returnOperation] = question.exactState.operations;
  if (!initialA || !initialB || firstOperation?.kind !== "TRANSFER" || returnOperation?.kind !== "TRANSFER") {
    return question.explanation;
  }
  const afterFirstB = question.exactState.ledger.snapshots[1]!.vessels.find((vessel) => vessel.id === "B");
  if (!afterFirstB) return question.explanation;
  const finalA = getMalCp006Vessel(question.exactState.ledger, "A");
  const finalB = getMalCp006Vessel(question.exactState.ledger, "B");
  const milkFraction = divideRational(afterFirstB.componentA, afterFirstB.volume);
  const returnedMilk = multiplyRational(returnOperation.amount, milkFraction);
  const returnedWater = subtractRational(returnOperation.amount, returnedMilk);
  const finalWater = malCp006ComponentB(finalB);

  return {
    visibleLines: [
      `After A→B, B has ${quantity(firstOperation.amount)} milk and ${quantity(initialB.volume)} water, total ${quantity(afterFirstB.volume)}.`,
      `Milk fraction in B = ${friendly(afterFirstB.componentA)}/${friendly(afterFirstB.volume)} = ${fractionText(milkFraction)}. So the ${quantity(returnOperation.amount)} returned contains ${quantity(returnedMilk)} milk and ${quantity(returnedWater)} water.`,
      `Milk in A = ${friendly(initialA.volume)} − ${friendly(firstOperation.amount)} + ${friendly(returnedMilk)} = ${quantity(finalA.componentA)}; water left in B = ${quantity(finalWater)}.`,
      `Required ratio = ${friendly(finalA.componentA)} : ${friendly(finalWater)} = ${ratioText(finalA.componentA, finalWater)}.`,
    ],
    answerLine: question.explanation.answerLine,
    optionalHelp: {
      ...question.explanation.optionalHelp,
      commonMistake: "The liquid returned from B is a milk-water mixture, not pure water or pure milk.",
    },
  };
}

function rebuildEqualExchangeExplanation(
  question: MalCp006DiscoveryQuestion,
): MalCp006DiscoveryQuestion["explanation"] {
  const [a, b] = question.exactState.initialVessels;
  const operation = question.exactState.operations[0];
  if (!a || !b || operation?.kind !== "SIMULTANEOUS_EQUAL_EXCHANGE") return question.explanation;
  const pA = multiplyRational(divideRational(a.componentA, a.volume), rational(100));
  const pB = multiplyRational(divideRational(b.componentA, b.volume), rational(100));
  return {
    ...question.explanation,
    visibleLines: [
      `Let x litres be exchanged. In A, final first liquid = ${friendly(pA)}% of (${friendly(a.volume)} − x) + ${friendly(pB)}% of x.`,
      `Equal concentrations give [${friendly(pA)}(${friendly(a.volume)} − x) + ${friendly(pB)}x] / ${friendly(a.volume)} = [${friendly(pB)}(${friendly(b.volume)} − x) + ${friendly(pA)}x] / ${friendly(b.volume)}.`,
      `Solving, x = (${friendly(a.volume)} × ${friendly(b.volume)}) ÷ (${friendly(a.volume)} + ${friendly(b.volume)}) = ${quantity(operation.amount)}.`,
    ],
  };
}

function polishQuestion(question: MalCp006DiscoveryQuestion): MalCp006DiscoveryQuestion {
  let explanation = question.explanation;
  if (question.prototypeId === "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO") {
    explanation = rebuildRoundTripExplanation(question);
  } else if (question.prototypeId === "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS") {
    explanation = rebuildEqualExchangeExplanation(question);
  }

  const stem = polishText(question.stem);
  const visibleLines = explanation.visibleLines.map(polishText);
  const commonMistake = polishText(explanation.optionalHelp.commonMistake);
  const options = question.options.map(polishText);
  const answer = polishText(question.answer);
  const errors = question.validation.errors.filter((error) => error !== "Stem is not interrogative.");
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (/\ba acid-water\b/iu.test(stem)) errors.push("Indefinite article error survived.");
  if (/\b1 litres\b/iu.test([stem, ...visibleLines].join(" "))) errors.push("Singular litre grammar error survived.");
  if (!options.every(optionFriendly)) errors.push("Option contains an awkward fraction denominator.");

  return {
    ...question,
    stem,
    answer,
    options,
    explanation: {
      ...explanation,
      visibleLines,
      answerLine: `Answer: ${answer}`,
      optionalHelp: {
        ...explanation.optionalHelp,
        commonMistake,
      },
    },
    validation: { ok: errors.length === 0, errors },
  };
}

export function generateMalCp006Wave01LearnerPolishFinalQuestion(
  prototypeId: MalCp006Wave01V2PrototypeId,
  seed = "mal-cp006-wave01-polish-final:default",
): MalCp006DiscoveryQuestion {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}:polish-retry:${attempt}`;
    const polished = polishQuestion(
      generateMalCp006Wave01EditorialV2FinalQuestion(prototypeId, candidateSeed),
    );
    if (polished.validation.ok) {
      return { ...polished, requestedSeed: seed };
    }
  }
  throw new Error(`${prototypeId}: no learner-polished state found for ${seed}.`);
}

export function malCp006Wave01LearnerPolishStable(
  question: MalCp006DiscoveryQuestion,
): string {
  return JSON.stringify(question, (_key, value) => typeof value === "bigint" ? `${value}n` : value);
}
