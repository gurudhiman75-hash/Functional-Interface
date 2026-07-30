import { generateClsCp005DiscoveryQuestion } from "./runtime";
import {
  canonicalClsCp005RuleValue,
  clsCp005Gcd,
  clsCp005Lcm,
  clsCp005ReverseDigits,
  displayClsCp005Tuple,
} from "./tuple-domain";
import type {
  ClsCp005RuleId,
  ClsCp005Task,
  ClsCp005Tuple,
  GeneratedClsCp005Question,
} from "./types";

const EDITORIAL_VERSION = "cls-cp005-editorial-v2-rule-aware-latex" as const;

type TriplePosition = "AB_TO_C" | "AC_TO_B" | "BC_TO_A";
type Direction = "FORWARD" | "REVERSE";

type PositionRelation = {
  readonly leftIndex: 0 | 1;
  readonly rightIndex: 1 | 2;
  readonly targetIndex: 0 | 1 | 2;
  readonly targetName: "first" | "middle" | "third";
};

function inlineMath(tex: string): string {
  return `\\( ${tex} \\)`;
}

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function positionRelation(value: string): PositionRelation {
  switch (value as TriplePosition) {
    case "AB_TO_C": return { leftIndex: 0, rightIndex: 1, targetIndex: 2, targetName: "third" };
    case "AC_TO_B": return { leftIndex: 0, rightIndex: 2, targetIndex: 1, targetName: "middle" };
    case "BC_TO_A": return { leftIndex: 1, rightIndex: 2, targetIndex: 0, targetName: "first" };
    default: throw new Error(`Unsupported CLS-CP-005 triple position: ${value}`);
  }
}

function reducedRatio(numerator: number, denominator: number): string {
  const divisor = clsCp005Gcd(numerator, denominator);
  return `${numerator / divisor}:${denominator / divisor}`;
}

function fractionTex(numerator: number, denominator: number): string {
  const divisor = clsCp005Gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  return reducedDenominator === 1
    ? String(reducedNumerator)
    : `\\frac{${reducedNumerator}}{${reducedDenominator}}`;
}

function matchSuffix(matches: boolean, failureDetail?: string): string {
  if (matches) return "— ✅ Matches rule.";
  return `— ❌ Fails rule${failureDetail ? `; ${failureDetail}` : ""}.`;
}

function pairEvidence(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
  intendedValue: string,
): string {
  if (tuple.length !== 2) throw new Error(`${ruleId} expected a pair`);
  const [a, b] = tuple;
  const display = displayClsCp005Tuple(tuple);
  const actualValue = canonicalClsCp005RuleValue(tuple, ruleId);
  const matches = actualValue === intendedValue;

  switch (ruleId) {
    case "PAIR_SIGNED_DIFFERENCE": {
      const actual = b - a;
      const equation = matches
        ? `${b} - ${a} = ${actual}`
        : `${b} - ${a} = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected difference ${intendedValue}`)}`;
    }
    case "PAIR_REDUCED_RATIO": {
      const actual = reducedRatio(b, a);
      const equation = matches
        ? `${b}:${a} = ${actual}`
        : `${b}:${a} = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected reduced ratio ${intendedValue}`)}`;
    }
    case "PAIR_SUM": {
      const actual = a + b;
      const equation = matches
        ? `${a} + ${b} = ${actual}`
        : `${a} + ${b} = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected total ${intendedValue}`)}`;
    }
    case "PAIR_PRODUCT": {
      const actual = a * b;
      const equation = matches
        ? `${a} \\times ${b} = ${actual}`
        : `${a} \\times ${b} = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected product ${intendedValue}`)}`;
    }
    case "PAIR_GCD": {
      const actual = clsCp005Gcd(a, b);
      const equation = matches
        ? `\\operatorname{GCD}(${a}, ${b}) = ${actual}`
        : `\\operatorname{GCD}(${a}, ${b}) = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected GCD ${intendedValue}`)}`;
    }
    case "PAIR_LCM": {
      const actual = clsCp005Lcm(a, b);
      const equation = matches
        ? `\\operatorname{LCM}(${a}, ${b}) = ${actual}`
        : `\\operatorname{LCM}(${a}, ${b}) = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected LCM ${intendedValue}`)}`;
    }
    case "PAIR_CONSECUTIVE_DIRECTION": {
      const expectedGap = intendedValue === "FORWARD" ? 1 : -1;
      const actualGap = b - a;
      const equation = matches
        ? `${b} - ${a} = ${actualGap}`
        : `${b} - ${a} = ${actualGap} \\ne ${expectedGap}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `the ordered gap must be ${expectedGap}`)}`;
    }
    case "PAIR_SQUARE_DIRECTION": {
      const forward = intendedValue === "FORWARD";
      const base = forward ? a : b;
      const target = forward ? b : a;
      const result = base * base;
      const equation = matches
        ? `${base}^2 = ${target}`
        : `${base}^2 = ${result} \\ne ${target}`;
      const targetName = forward ? "second" : "first";
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `${targetName} number should be ${result}`)}`;
    }
    case "PAIR_CUBE_DIRECTION": {
      const forward = intendedValue === "FORWARD";
      const base = forward ? a : b;
      const target = forward ? b : a;
      const result = base * base * base;
      const equation = matches
        ? `${base}^3 = ${target}`
        : `${base}^3 = ${result} \\ne ${target}`;
      const targetName = forward ? "second" : "first";
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `${targetName} number should be ${result}`)}`;
    }
    case "PAIR_DIGIT_REVERSE_DIRECTION": {
      const reversed = clsCp005ReverseDigits(a);
      const equation = matches
        ? `\\operatorname{reverse}(${a}) = ${b}`
        : `\\operatorname{reverse}(${a}) = ${reversed} \\ne ${b}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `second number should be ${reversed}`)}`;
    }
    default: throw new Error(`${ruleId} is not a supported pair rule`);
  }
}

function positionalOperationEvidence(
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
  const operator = operation === "SUM" ? "+" : "\\times";
  const matches = result === target;
  const equation = matches
    ? `${left} ${operator} ${right} = ${target}`
    : `${left} ${operator} ${right} = ${result} \\ne ${target}`;
  return `${displayClsCp005Tuple(tuple)}: ${inlineMath(equation)} ${matchSuffix(matches, `${relation.targetName} number should be ${result}, not ${target}`)}`;
}

function pythagoreanEvidence(tuple: ClsCp005Tuple, intendedValue: string): string {
  if (tuple.length !== 3) throw new Error("Pythagorean relation expected a triple");
  const relation = positionRelation(intendedValue);
  const left = tuple[relation.leftIndex]!;
  const right = tuple[relation.rightIndex]!;
  const target = tuple[relation.targetIndex]!;
  const leftSquare = left * left;
  const rightSquare = right * right;
  const total = leftSquare + rightSquare;
  const targetSquare = target * target;
  const matches = total === targetSquare;
  const equation = matches
    ? `${left}^2 + ${right}^2 = ${leftSquare} + ${rightSquare} = ${total} = ${target}^2`
    : `${left}^2 + ${right}^2 = ${leftSquare} + ${rightSquare} = ${total} \\ne ${target}^2 = ${targetSquare}`;
  return `${displayClsCp005Tuple(tuple)}: ${inlineMath(equation)} ${matchSuffix(matches, `${relation.targetName} number does not complete the Pythagorean relation`)}`;
}

function tripleEvidence(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
  intendedValue: string,
): string {
  if (tuple.length !== 3) throw new Error(`${ruleId} expected a triple`);
  const [a, b, c] = tuple;
  const display = displayClsCp005Tuple(tuple);
  const actualValue = canonicalClsCp005RuleValue(tuple, ruleId);
  const matches = actualValue === intendedValue;

  switch (ruleId) {
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD":
      return positionalOperationEvidence(tuple, intendedValue, "SUM");
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD":
      return positionalOperationEvidence(tuple, intendedValue, "PRODUCT");
    case "TRIPLE_ARITHMETIC_PROGRESSION": {
      const firstGap = b - a;
      const secondGap = c - b;
      const equations = `${inlineMath(`${b} - ${a} = ${firstGap}`)} and ${inlineMath(`${c} - ${b} = ${secondGap}`)}`;
      return `${display}: ${equations} ${matchSuffix(matches, "the two consecutive differences are unequal")}`;
    }
    case "TRIPLE_GEOMETRIC_PROGRESSION": {
      const middleSquare = b * b;
      const outerProduct = a * c;
      const equations = `${inlineMath(`${b}^2 = ${middleSquare}`)} and ${inlineMath(`${a} \\times ${c} = ${outerProduct}`)}`;
      const ratio = matches ? ` Common ratio ${inlineMath(`= ${fractionTex(b, a)}`)}.` : "";
      return `${display}: ${equations} ${matchSuffix(matches, "middle number squared must equal first number multiplied by third")}${ratio}`;
    }
    case "TRIPLE_PYTHAGOREAN_DIRECTION":
      return pythagoreanEvidence(tuple, intendedValue);
    case "TRIPLE_CONSECUTIVE_DIRECTION": {
      const expectedGap = intendedValue === "FORWARD" ? 1 : -1;
      const firstGap = b - a;
      const secondGap = c - b;
      const equations = `${inlineMath(`${b} - ${a} = ${firstGap}`)} and ${inlineMath(`${c} - ${b} = ${secondGap}`)}`;
      return `${display}: ${equations} ${matchSuffix(matches, `both ordered gaps must be ${expectedGap}`)}`;
    }
    case "TRIPLE_SUM": {
      const actual = a + b + c;
      const equation = matches
        ? `${a} + ${b} + ${c} = ${actual}`
        : `${a} + ${b} + ${c} = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected total ${intendedValue}`)}`;
    }
    case "TRIPLE_PRODUCT": {
      const actual = a * b * c;
      const equation = matches
        ? `${a} \\times ${b} \\times ${c} = ${actual}`
        : `${a} \\times ${b} \\times ${c} = ${actual} \\ne ${intendedValue}`;
      return `${display}: ${inlineMath(equation)} ${matchSuffix(matches, `expected product ${intendedValue}`)}`;
    }
    default: throw new Error(`${ruleId} is not a supported triple rule`);
  }
}

export function renderClsCp005OptionEvidence(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
  intendedValue: string,
): string {
  return tuple.length === 2
    ? pairEvidence(tuple, ruleId, intendedValue)
    : tripleEvidence(tuple, ruleId, intendedValue);
}

function directionFormula(value: string, operation: "+" | "\\times" | "PYTHAGOREAN"): string {
  const relation = positionRelation(value);
  const names = ["\\text{First}", "\\text{Middle}", "\\text{Third}"] as const;
  const left = names[relation.leftIndex];
  const right = names[relation.rightIndex];
  const target = names[relation.targetIndex];
  return operation === "PYTHAGOREAN"
    ? `${left}^2 + ${right}^2 = ${target}^2`
    : `${left} ${operation} ${right} = ${target}`;
}

export function renderClsCp005RuleStatement(ruleId: ClsCp005RuleId, value: string): string {
  switch (ruleId) {
    case "PAIR_SIGNED_DIFFERENCE": return `Rule: ${inlineMath(`\\text{Second} - \\text{First} = ${value}`)}.`;
    case "PAIR_REDUCED_RATIO": return `Rule: ${inlineMath(`\\text{Second}:\\text{First} = ${value}`)} in lowest terms.`;
    case "PAIR_SUM": return `Rule: the two numbers add to ${inlineMath(value)}.`;
    case "PAIR_PRODUCT": return `Rule: the two numbers multiply to ${inlineMath(value)}.`;
    case "PAIR_GCD": return `Rule: every matching pair has GCD ${inlineMath(value)}.`;
    case "PAIR_LCM": return `Rule: every matching pair has LCM ${inlineMath(value)}.`;
    case "PAIR_CONSECUTIVE_DIRECTION": return value === "FORWARD"
      ? `Rule: ${inlineMath("\\text{Second} = \\text{First} + 1")}.`
      : `Rule: ${inlineMath("\\text{Second} = \\text{First} - 1")}.`;
    case "PAIR_SQUARE_DIRECTION": return value === "FORWARD"
      ? `Rule: ${inlineMath("\\text{Second} = \\text{First}^2")}.`
      : `Rule: ${inlineMath("\\text{First} = \\text{Second}^2")}.`;
    case "PAIR_CUBE_DIRECTION": return value === "FORWARD"
      ? `Rule: ${inlineMath("\\text{Second} = \\text{First}^3")}.`
      : `Rule: ${inlineMath("\\text{First} = \\text{Second}^3")}.`;
    case "PAIR_DIGIT_REVERSE_DIRECTION": return "Rule: the second number is the digit-reversal of the first.";
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD": return `Rule: ${inlineMath(directionFormula(value, "+"))}.`;
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD": return `Rule: ${inlineMath(directionFormula(value, "\\times"))}.`;
    case "TRIPLE_ARITHMETIC_PROGRESSION": return `Rule: ${inlineMath("\\text{Middle} - \\text{First} = \\text{Third} - \\text{Middle}")}.`;
    case "TRIPLE_GEOMETRIC_PROGRESSION": return `Rule: ${inlineMath("\\text{Middle}^2 = \\text{First} \\times \\text{Third}")}.`;
    case "TRIPLE_PYTHAGOREAN_DIRECTION": return `Rule: ${inlineMath(directionFormula(value, "PYTHAGOREAN"))}.`;
    case "TRIPLE_CONSECUTIVE_DIRECTION": return value === "FORWARD"
      ? `Rule: both ordered gaps are ${inlineMath("+1")}.`
      : `Rule: both ordered gaps are ${inlineMath("-1")}.`;
    case "TRIPLE_SUM": return `Rule: the three numbers add to ${inlineMath(value)}.`;
    case "TRIPLE_PRODUCT": return `Rule: the three numbers multiply to ${inlineMath(value)}.`;
    default: throw new Error(`Unsupported CLS-CP-005 rule statement: ${ruleId}`);
  }
}

function shortcut(ruleId: ClsCp005RuleId): string {
  switch (ruleId) {
    case "PAIR_SIGNED_DIFFERENCE": return "Subtract first from second in each pair and compare only those results.";
    case "PAIR_REDUCED_RATIO": return "Reduce second:first in each pair before comparing ratios.";
    case "PAIR_SUM": return "Add the two numbers in each pair and mark the one different total.";
    case "PAIR_PRODUCT": return "Multiply the two numbers in each pair and compare only the products.";
    case "PAIR_GCD": return "Find the GCD from the smallest visible common factors first.";
    case "PAIR_LCM": return "Find the LCM of each pair and compare the four or five results.";
    case "PAIR_CONSECUTIVE_DIRECTION": return "Check the ordered gap only; +1 and -1 are different directions.";
    case "PAIR_SQUARE_DIRECTION": return "Square the designated base position only; do not reverse the pair.";
    case "PAIR_CUBE_DIRECTION": return "Cube the designated base position only; do not reverse the pair.";
    case "PAIR_DIGIT_REVERSE_DIRECTION": return "Reverse the first number once and compare it directly with the second.";
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD": return "Check one fixed pair of positions at a time; use the same sum layout in every option.";
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD": return "Check one fixed pair of positions at a time; use the same product layout in every option.";
    case "TRIPLE_ARITHMETIC_PROGRESSION": return "Subtract neighbouring numbers; equal consecutive gaps confirm the pattern.";
    case "TRIPLE_GEOMETRIC_PROGRESSION": return "Square only the middle number and compare it with first multiplied by third.";
    case "TRIPLE_PYTHAGOREAN_DIRECTION": return "Square only the two source positions and compare their sum with the target square.";
    case "TRIPLE_CONSECUTIVE_DIRECTION": return "Check the two ordered gaps; both must be +1 or both must be -1.";
    case "TRIPLE_SUM": return "Add all three numbers in each option and compare the totals.";
    case "TRIPLE_PRODUCT": return "Multiply all three numbers in each option and compare the products.";
    default: throw new Error(`Unsupported CLS-CP-005 shortcut: ${ruleId}`);
  }
}

function commonTrap(ruleId: ClsCp005RuleId): string {
  if (["PAIR_SIGNED_DIFFERENCE", "PAIR_REDUCED_RATIO", "PAIR_CONSECUTIVE_DIRECTION", "PAIR_SQUARE_DIRECTION", "PAIR_CUBE_DIRECTION"].includes(ruleId)) {
    return "Keep the displayed order; reversing a pair can change the rule.";
  }
  if (["TRIPLE_SUM_OF_TWO_EQUALS_THIRD", "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD", "TRIPLE_PYTHAGOREAN_DIRECTION"].includes(ruleId)) {
    return "A true equation in different positions is not enough; the same positions must keep the same roles.";
  }
  return "Use one standard relation for every complete option; do not invent a separate formula for each tuple.";
}

function buildEditorialExplanation(
  question: GeneratedClsCp005Question,
  evidenceByOption: readonly string[],
): GeneratedClsCp005Question["explanation"] {
  const displays = question.tuples.map(displayClsCp005Tuple);
  const answer = displays[question.correctIndex]!;
  const common = displays.filter((_, index) => index !== question.correctIndex);

  if (question.task === "SELECT_EQUIVALENT_NUMBER_SET") {
    const referenceEvidence = renderClsCp005OptionEvidence(
      question.referenceTuple!,
      question.intendedRuleId,
      question.intendedRuleValue,
    ).replace("— ✅ Matches rule.", "— establishes the reference rule.");
    return {
      coreConcept: [renderClsCp005RuleStatement(question.intendedRuleId, question.intendedRuleValue)],
      stepByStep: [
        `Reference ${referenceEvidence}`,
        `Only ${answer} repeats that exact relation in the same positions.`,
        `Therefore, ${answer} is correct.`,
      ],
      examSpeedShortcut: [shortcut(question.intendedRuleId)],
      commonTrapWarning: [commonTrap(question.intendedRuleId)],
    };
  }

  return {
    coreConcept: [renderClsCp005RuleStatement(question.intendedRuleId, question.intendedRuleValue)],
    stepByStep: [
      "Apply the same equation and the same position roles to every option.",
      `${naturalList(common)} satisfy the rule, while ${answer} fails it.`,
      `Therefore, ${answer} is the odd option.`,
    ],
    examSpeedShortcut: [shortcut(question.intendedRuleId)],
    commonTrapWarning: [commonTrap(question.intendedRuleId)],
  };
}

export function applyClsCp005EditorialLayer(question: GeneratedClsCp005Question) {
  const evidenceByOption = question.tuples.map((tuple) =>
    renderClsCp005OptionEvidence(tuple, question.intendedRuleId, question.intendedRuleValue));
  return {
    ...question,
    evidenceByOption,
    explanation: buildEditorialExplanation(question, evidenceByOption),
    metadata: {
      ...question.metadata,
      editorialVersion: EDITORIAL_VERSION,
      mathFormat: "MATHJAX_INLINE_LATEX" as const,
    },
  };
}

export function generateClsCp005EditorialQuestion(
  prototypeId: Parameters<typeof generateClsCp005DiscoveryQuestion>[0],
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return applyClsCp005EditorialLayer(
    generateClsCp005DiscoveryQuestion(prototypeId, seed, requestedOptionCount),
  );
}

export type GeneratedClsCp005EditorialQuestion = ReturnType<typeof generateClsCp005EditorialQuestion>;
export type ClsCp005EditorialTask = ClsCp005Task;
export type ClsCp005EditorialDirection = Direction;
