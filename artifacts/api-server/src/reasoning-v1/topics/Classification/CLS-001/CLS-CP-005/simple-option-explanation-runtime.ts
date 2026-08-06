import {
  generateClsCp005EditorialQuestion,
  renderClsCp005OptionEvidence,
} from "./editorial-runtime";
import {
  canonicalClsCp005RuleValue,
  clsCp005Gcd,
  clsCp005Lcm,
  clsCp005ReverseDigits,
  displayClsCp005Tuple,
} from "./tuple-domain";
import type {
  ClsCp005RuleId,
  ClsCp005Tuple,
} from "./types";

const OPTION_EXPLANATION_VERSION = "cls-cp005-option-explanations-v3-simple-teacher" as const;

type TriplePosition = "AB_TO_C" | "AC_TO_B" | "BC_TO_A";

type PositionRelation = {
  readonly leftIndex: 0 | 1;
  readonly rightIndex: 1 | 2;
  readonly targetIndex: 0 | 1 | 2;
  readonly leftName: "first" | "second";
  readonly rightName: "second" | "third";
  readonly targetName: "first" | "middle" | "third";
};

function positionRelation(value: string): PositionRelation {
  switch (value as TriplePosition) {
    case "AB_TO_C":
      return {
        leftIndex: 0,
        rightIndex: 1,
        targetIndex: 2,
        leftName: "first",
        rightName: "second",
        targetName: "third",
      };
    case "AC_TO_B":
      return {
        leftIndex: 0,
        rightIndex: 2,
        targetIndex: 1,
        leftName: "first",
        rightName: "third",
        targetName: "middle",
      };
    case "BC_TO_A":
      return {
        leftIndex: 1,
        rightIndex: 2,
        targetIndex: 0,
        leftName: "second",
        rightName: "third",
        targetName: "first",
      };
    default:
      throw new Error(`Unsupported CLS-CP-005 triple position: ${value}`);
  }
}

function reducedRatio(numerator: number, denominator: number): string {
  const divisor = clsCp005Gcd(numerator, denominator);
  return `${numerator / divisor}:${denominator / divisor}`;
}

function conciseStatus(evidence: string): string {
  return evidence.replace(/— ❌ Fails rule;.*\.$/, "— ❌ Fails rule.");
}

function pairReason(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
  intendedValue: string,
): string {
  if (tuple.length !== 2) throw new Error(`${ruleId} expected a pair`);
  const [a, b] = tuple;
  const actualValue = canonicalClsCp005RuleValue(tuple, ruleId);
  const matches = actualValue === intendedValue;

  switch (ruleId) {
    case "PAIR_SIGNED_DIFFERENCE": {
      const difference = b - a;
      return matches
        ? `The ordered difference is ${difference}.`
        : `The ordered difference is ${difference}, not ${intendedValue}.`;
    }
    case "PAIR_REDUCED_RATIO": {
      const ratio = reducedRatio(b, a);
      return matches
        ? `The second:first ratio reduces to ${ratio}.`
        : `The second:first ratio reduces to ${ratio}, not ${intendedValue}.`;
    }
    case "PAIR_SUM": {
      const total = a + b;
      return matches
        ? `The two numbers total ${total}.`
        : `The two numbers total ${total}, not ${intendedValue}.`;
    }
    case "PAIR_PRODUCT": {
      const product = a * b;
      return matches
        ? `The product of the two numbers is ${product}.`
        : `The product is ${product}, not ${intendedValue}.`;
    }
    case "PAIR_GCD": {
      const gcd = clsCp005Gcd(a, b);
      return matches
        ? `The greatest common divisor is ${gcd}.`
        : `The greatest common divisor is ${gcd}, not ${intendedValue}.`;
    }
    case "PAIR_LCM": {
      const lcm = clsCp005Lcm(a, b);
      return matches
        ? `The least common multiple is ${lcm}.`
        : `The least common multiple is ${lcm}, not ${intendedValue}.`;
    }
    case "PAIR_CONSECUTIVE_DIRECTION": {
      const gap = b - a;
      if (matches) {
        return intendedValue === "FORWARD"
          ? "The second number is one more than the first."
          : "The second number is one less than the first.";
      }
      return `The ordered gap is ${gap}, so the required one-step direction is not followed.`;
    }
    case "PAIR_SQUARE_DIRECTION": {
      const forward = intendedValue === "FORWARD";
      const base = forward ? a : b;
      const target = forward ? b : a;
      const result = base * base;
      if (matches) {
        return forward
          ? "The second number is the square of the first."
          : "The first number is the square of the second.";
      }
      return `Squaring ${base} gives ${result}, not ${target}.`;
    }
    case "PAIR_CUBE_DIRECTION": {
      const forward = intendedValue === "FORWARD";
      const base = forward ? a : b;
      const target = forward ? b : a;
      const result = base * base * base;
      if (matches) {
        return forward
          ? "The second number is the cube of the first."
          : "The first number is the cube of the second.";
      }
      return `Cubing ${base} gives ${result}, not ${target}.`;
    }
    case "PAIR_DIGIT_REVERSE_DIRECTION": {
      const reversed = clsCp005ReverseDigits(a);
      return matches
        ? "Reversing the first number gives the second number."
        : `Reversing ${a} gives ${reversed}, not ${b}.`;
    }
    default:
      throw new Error(`${ruleId} is not a supported pair rule`);
  }
}

function positionalReason(
  tuple: ClsCp005Tuple,
  intendedValue: string,
  operation: "SUM" | "PRODUCT",
): string {
  if (tuple.length !== 3) throw new Error(`${operation} expected a triple`);
  const relation = positionRelation(intendedValue);
  const left = tuple[relation.leftIndex]!;
  const right = tuple[relation.rightIndex]!;
  const target = tuple[relation.targetIndex]!;
  const result = operation === "SUM" ? left + right : left * right;
  const action = operation === "SUM" ? "add" : "multiply";
  const matches = result === target;

  return matches
    ? `The ${relation.leftName} and ${relation.rightName} numbers ${action} to the ${relation.targetName} number.`
    : `The ${relation.leftName} and ${relation.rightName} numbers give ${result}, not the ${relation.targetName} number ${target}.`;
}

function pythagoreanReason(tuple: ClsCp005Tuple, intendedValue: string): string {
  if (tuple.length !== 3) throw new Error("Pythagorean relation expected a triple");
  const relation = positionRelation(intendedValue);
  const left = tuple[relation.leftIndex]!;
  const right = tuple[relation.rightIndex]!;
  const target = tuple[relation.targetIndex]!;
  const sourceTotal = left * left + right * right;
  const targetSquare = target * target;
  const matches = sourceTotal === targetSquare;

  return matches
    ? `The squares of the ${relation.leftName} and ${relation.rightName} numbers add to the square of the ${relation.targetName} number.`
    : `The two source squares total ${sourceTotal}, not the target square ${targetSquare}.`;
}

function tripleReason(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
  intendedValue: string,
): string {
  if (tuple.length !== 3) throw new Error(`${ruleId} expected a triple`);
  const [a, b, c] = tuple;
  const actualValue = canonicalClsCp005RuleValue(tuple, ruleId);
  const matches = actualValue === intendedValue;

  switch (ruleId) {
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD":
      return positionalReason(tuple, intendedValue, "SUM");
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD":
      return positionalReason(tuple, intendedValue, "PRODUCT");
    case "TRIPLE_ARITHMETIC_PROGRESSION": {
      const firstGap = b - a;
      const secondGap = c - b;
      return matches
        ? `Both neighbouring gaps are ${firstGap}.`
        : `The neighbouring gaps are ${firstGap} and ${secondGap}, so they are not equal.`;
    }
    case "TRIPLE_GEOMETRIC_PROGRESSION": {
      const middleSquare = b * b;
      const outerProduct = a * c;
      return matches
        ? "The square of the middle number equals the product of the outer numbers."
        : `The middle square is ${middleSquare}, while the outer product is ${outerProduct}.`;
    }
    case "TRIPLE_PYTHAGOREAN_DIRECTION":
      return pythagoreanReason(tuple, intendedValue);
    case "TRIPLE_CONSECUTIVE_DIRECTION": {
      const firstGap = b - a;
      const secondGap = c - b;
      if (matches) {
        return intendedValue === "FORWARD"
          ? "The numbers rise by one at both steps."
          : "The numbers fall by one at both steps.";
      }
      return `The two gaps are ${firstGap} and ${secondGap}, so the one-step pattern is broken.`;
    }
    case "TRIPLE_SUM": {
      const total = a + b + c;
      return matches
        ? `The three numbers total ${total}.`
        : `The three numbers total ${total}, not ${intendedValue}.`;
    }
    case "TRIPLE_PRODUCT": {
      const product = a * b * c;
      return matches
        ? `The product of the three numbers is ${product}.`
        : `The product is ${product}, not ${intendedValue}.`;
    }
    default:
      throw new Error(`${ruleId} is not a supported triple rule`);
  }
}

export function renderClsCp005SimpleOptionExplanation(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
  intendedValue: string,
): string {
  const display = displayClsCp005Tuple(tuple);
  const rawEvidence = renderClsCp005OptionEvidence(tuple, ruleId, intendedValue);
  const calculationAndStatus = conciseStatus(rawEvidence.slice(`${display}: `.length));
  const reason = tuple.length === 2
    ? pairReason(tuple, ruleId, intendedValue)
    : tripleReason(tuple, ruleId, intendedValue);
  return `${display}: ${reason} ${calculationAndStatus}`;
}

export function applyClsCp005SimpleOptionExplanations<
  T extends ReturnType<typeof generateClsCp005EditorialQuestion>,
>(question: T) {
  const evidenceByOption = question.tuples.map((tuple) =>
    renderClsCp005SimpleOptionExplanation(tuple, question.intendedRuleId, question.intendedRuleValue));

  const explanation = question.task === "SELECT_EQUIVALENT_NUMBER_SET"
    ? {
        ...question.explanation,
        stepByStep: [
          `Reference ${renderClsCp005SimpleOptionExplanation(
            question.referenceTuple!,
            question.intendedRuleId,
            question.intendedRuleValue,
          ).replace("— ✅ Matches rule.", "— establishes the reference rule.")}`,
          `Only ${question.answer} follows the same relation in the same positions.`,
          `Therefore, ${question.answer} is correct.`,
        ],
      }
    : question.explanation;

  return {
    ...question,
    evidenceByOption,
    explanation,
    metadata: {
      ...question.metadata,
      optionExplanationVersion: OPTION_EXPLANATION_VERSION,
    },
  };
}

export function generateClsCp005SimpleExplanationQuestion(
  prototypeId: Parameters<typeof generateClsCp005EditorialQuestion>[0],
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return applyClsCp005SimpleOptionExplanations(
    generateClsCp005EditorialQuestion(prototypeId, seed, requestedOptionCount),
  );
}

export type GeneratedClsCp005SimpleExplanationQuestion = ReturnType<
  typeof generateClsCp005SimpleExplanationQuestion
>;
