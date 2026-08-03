import { equalRational, formatRational } from "../../../shared/exact-rational";
import { binaryNode, expressionFingerprint, factorialNode, groupNode, powerNode, valueNode, type ExpressionNode } from "../../../shared/expression-ast";
import { evaluateExact } from "../../../shared/exact-evaluator";
import { evaluateIndependent } from "../../../shared/independent-evaluator";
import { renderExpression } from "../../../shared/expression-renderer";
import type { SapCp001Wave02MisconceptionId, SapDifficulty } from "./types";
import { bracketStyleForSeed, integerNode, type BuiltState, type DeterministicRng } from "./common";

interface FirstStepDraft {
  readonly after: ExpressionNode;
  readonly text: string;
  readonly misconceptionId: SapCp001Wave02MisconceptionId | null;
  readonly analysis: string;
}

export function buildFirstValidStepState(
  rng: DeterministicRng,
  seed: number,
  difficulty: SapDifficulty,
  correctIndex: number,
): BuiltState {
  const mode = seed % 4;
  const a = rng.int(3, difficulty === "HARD" ? 25 : 15);
  const b = rng.int(2, difficulty === "HARD" ? 9 : 7);
  const c = rng.int(2, difficulty === "HARD" ? 8 : 6);
  const d = rng.int(1, difficulty === "HARD" ? 14 : 9);
  let source: ExpressionNode;
  let correct: FirstStepDraft;
  let wrong: readonly FirstStepDraft[];

  if (mode === 0) {
    const product = b * c;
    source = binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))), integerNode(d));
    correct = {
      after: binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), integerNode(product)), integerNode(d)),
      text: `Calculate ${b} × ${c} = ${product}: ${a} + ${product} − ${d}`,
      misconceptionId: null,
      analysis: "Multiplication has higher precedence than the surrounding addition and subtraction.",
    };
    wrong = Object.freeze([
      {
        after: binaryNode("SUBTRACT", binaryNode("MULTIPLY", integerNode(a + b), integerNode(c)), integerNode(d)),
        text: `Add ${a} + ${b} first, then multiply by ${c}`,
        misconceptionId: "GROUPED_ADDITION_BEFORE_MULTIPLICATION",
        analysis: "This performs addition before a visible multiplication.",
      },
      {
        after: binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c - d))),
        text: `Subtract ${c} − ${d} first inside the product`,
        misconceptionId: "APPLIED_LOWER_PRIORITY_OPERATION_FIRST",
        analysis: "The subtraction is not grouped inside the multiplication.",
      },
      {
        after: binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))),
        text: `Drop the final − ${d} term after multiplying`,
        misconceptionId: "DROPPED_VISIBLE_TERM",
        analysis: "A visible term cannot disappear during a valid simplification step.",
      },
    ]);
  } else if (mode === 1) {
    const divisor = c;
    const base = divisor * rng.int(2, 5);
    const squared = base * base;
    source = binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", powerNode(integerNode(base), 2n), integerNode(divisor)));
    correct = {
      after: binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", integerNode(squared), integerNode(divisor))),
      text: `Calculate ${base}^2 = ${squared} before division`,
      misconceptionId: null,
      analysis: "Powers are resolved before multiplication, division, addition or subtraction.",
    };
    wrong = Object.freeze([
      {
        after: binaryNode("ADD", integerNode(a), powerNode(integerNode(base / divisor), 2n)),
        text: `Divide ${base} by ${divisor} before applying the square`,
        misconceptionId: "DIVIDED_BEFORE_POWER",
        analysis: "This changes the base of the power before the exponent is applied.",
      },
      {
        after: binaryNode("DIVIDE", powerNode(integerNode(a + base), 2n), integerNode(divisor)),
        text: `Add ${a} + ${base} before applying the square`,
        misconceptionId: "GROUPED_ADDITION_BEFORE_MULTIPLICATION",
        analysis: "The addition is outside the power base and cannot be performed first.",
      },
      {
        after: binaryNode("ADD", integerNode(a), integerNode(squared)),
        text: `Evaluate the square and omit division by ${divisor}`,
        misconceptionId: "DROPPED_VISIBLE_TERM",
        analysis: "The divisor remains part of the expression after the power is evaluated.",
      },
    ]);
  } else if (mode === 2) {
    const n = rng.int(4, difficulty === "HARD" ? 7 : 6);
    let factorial = 1;
    for (let factor = 2; factor <= n; factor += 1) factorial *= factor;
    const divisor = n;
    source = binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", factorialNode(integerNode(n)), integerNode(divisor)));
    correct = {
      after: binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", integerNode(factorial), integerNode(divisor))),
      text: `Calculate ${n}! = ${factorial} before division`,
      misconceptionId: null,
      analysis: "Factorial is resolved before the surrounding division and addition.",
    };
    wrong = Object.freeze([
      {
        after: binaryNode("ADD", integerNode(a), factorialNode(integerNode(1))),
        text: `Divide ${n} by ${divisor} first, then apply factorial`,
        misconceptionId: "DIVIDED_BEFORE_FACTORIAL",
        analysis: "The factorial applies to the original operand, not to a quotient formed later.",
      },
      {
        after: binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", factorialNode(integerNode(n + 1)), integerNode(divisor))),
        text: `Increase the factorial operand to ${n + 1} before applying factorial`,
        misconceptionId: "APPLIED_LOWER_PRIORITY_OPERATION_FIRST",
        analysis: "A valid first step cannot change the factorial operand from the displayed value.",
      },
      {
        after: binaryNode("ADD", integerNode(a), integerNode(n * n)),
        text: `Treat ${n}! as ${n} × ${n} and omit the divisor`,
        misconceptionId: "DROPPED_VISIBLE_TERM",
        analysis: "Factorial is not ordinary squaring, and the divisor cannot disappear.",
      },
    ]);
  } else {
    const sum = a + b;
    source = binaryNode("SUBTRACT", binaryNode("MULTIPLY", groupNode(binaryNode("ADD", integerNode(a), integerNode(b)), bracketStyleForSeed(seed)), integerNode(c)), integerNode(d));
    correct = {
      after: binaryNode("SUBTRACT", binaryNode("MULTIPLY", integerNode(sum), integerNode(c)), integerNode(d)),
      text: `Calculate the grouped sum ${a} + ${b} = ${sum} first`,
      misconceptionId: null,
      analysis: "The explicit bracket fixes the first operation.",
    };
    wrong = Object.freeze([
      {
        after: binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))), integerNode(d)),
        text: `Multiply ${b} × ${c} before resolving the bracket`,
        misconceptionId: "IGNORED_EXPLICIT_GROUPING",
        analysis: "A multiplication outside the grouped sum cannot enter the bracket.",
      },
      {
        after: binaryNode("MULTIPLY", groupNode(binaryNode("ADD", integerNode(a), integerNode(b)), bracketStyleForSeed(seed)), integerNode(c - d)),
        text: `Subtract ${c} − ${d} before multiplying`,
        misconceptionId: "APPLIED_LOWER_PRIORITY_OPERATION_FIRST",
        analysis: "The final subtraction is not grouped with the multiplier.",
      },
      {
        after: binaryNode("SUBTRACT", binaryNode("MULTIPLY", integerNode(a - b), integerNode(c)), integerNode(d)),
        text: `Change the grouped addition to subtraction`,
        misconceptionId: "REVERSED_SUBTRACTION_SIGN",
        analysis: "A valid step must preserve every operator sign.",
      },
    ]);
  }

  const ordered: FirstStepDraft[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) ordered.push(correct);
    else { ordered.push(wrong[wrongIndex]!); wrongIndex += 1; }
  }
  const sourceIndependent = evaluateIndependent(source);
  const equivalentIndexes = ordered
    .map((candidate, index) => equalRational(evaluateIndependent(candidate.after), sourceIndependent) ? index : -1)
    .filter((index) => index >= 0);
  if (equivalentIndexes.length !== 1) {
    throw new Error(`First-valid-step verifier found ${equivalentIndexes.length} equivalent candidates.`);
  }
  const verifierAnswer = ordered[equivalentIndexes[0]!]!.text;
  const optionDrafts = Object.freeze(ordered.map((candidate, index) => Object.freeze({
    value: candidate.text,
    isCorrect: index === correctIndex,
    misconceptionId: candidate.misconceptionId,
    analysis: candidate.analysis,
  })));

  return {
    taskDirection: "DIAGNOSIS",
    answerSemantic: "STEP_SELECTION",
    stem: `Which is the first valid simplification step for ${renderExpression(source)}?`,
    questionState: Object.freeze({
      kind: "FIRST_VALID_STEP",
      sourceExpression: source,
      candidateAfterExpressions: Object.freeze(ordered.map((candidate) => candidate.after)),
    }),
    canonicalAnswer: correct.text,
    verifierAnswer,
    canonicalTrace: evaluateExact(source).trace,
    optionDrafts,
    explanation: {
      coreConcept: "A first step must respect explicit grouping and the precedence of factorials, powers, multiplication/division and addition/subtraction.",
      givenDataAndStrategy: "Identify the highest-priority visible operation, simplify only that block and preserve every remaining term.",
      stepByStep: Object.freeze([
        `Original expression: ${renderExpression(source)}.`,
        `The highest-priority visible block gives: ${correct.text}.`,
        `The resulting expression remains exactly equal to the original.`,
      ]),
      examSpeedMethod: "Circle the innermost bracket, factorial, power or multiplication block before doing any arithmetic.",
    },
    hiddenState: Object.freeze({ a, b, c, d, mode, equivalentCandidateCount: equivalentIndexes.length }),
    difficultyEvidence: Object.freeze([
      "diagnosis rather than direct final-value calculation",
      mode === 0 ? "mixed-operation priority" : mode === 1 ? "power priority" : mode === 2 ? "factorial priority" : "explicit grouping priority",
      difficulty === "HARD" ? "closer distractor transformations" : "single material first-step decision",
    ]),
    fingerprintParts: Object.freeze([expressionFingerprint(source), ...ordered.map((candidate) => expressionFingerprint(candidate.after)), `mode:${mode}`]),
  };
}

export function buildIncorrectChainState(
  rng: DeterministicRng,
  seed: number,
  difficulty: SapDifficulty,
): BuiltState {
  const c = rng.int(2, difficulty === "HARD" ? 9 : 6);
  const b = rng.int(2, difficulty === "EASY" ? 6 : 10);
  const e = rng.int(2, difficulty === "HARD" ? 8 : 5);
  const q = rng.int(2, difficulty === "HARD" ? 12 : 8);
  const d = e * q;
  const product = b * c;
  const a = product + rng.int(3, difficulty === "HARD" ? 22 : 14);
  const source = binaryNode(
    "ADD",
    binaryNode("SUBTRACT", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))),
    binaryNode("DIVIDE", integerNode(d), integerNode(e)),
  );
  const correct1 = binaryNode("ADD", binaryNode("SUBTRACT", integerNode(a), integerNode(product)), binaryNode("DIVIDE", integerNode(d), integerNode(e)));
  const correct2 = binaryNode("ADD", binaryNode("SUBTRACT", integerNode(a), integerNode(product)), integerNode(q));
  const difference = a - product;
  const correct3 = binaryNode("ADD", integerNode(difference), integerNode(q));
  const final = difference + q;
  const correct4 = integerNode(final);
  const wrongIndex = (seed - 1) % 4;
  const wrongExpressions: readonly ExpressionNode[] = Object.freeze([
    binaryNode("ADD", binaryNode("MULTIPLY", integerNode(a - b), integerNode(c)), binaryNode("DIVIDE", integerNode(d), integerNode(e))),
    binaryNode("ADD", binaryNode("SUBTRACT", integerNode(a), integerNode(product)), binaryNode("MULTIPLY", integerNode(d), integerNode(e))),
    binaryNode("SUBTRACT", integerNode(a), groupNode(binaryNode("ADD", integerNode(product), integerNode(q)), bracketStyleForSeed(seed))),
    integerNode(final + 1),
  ]);
  const correctExpressions = [correct1, correct2, correct3, correct4] as const;
  const chain: ExpressionNode[] = [];
  let propagatedWrong: ExpressionNode | null = null;
  for (let index = 0; index < 4; index += 1) {
    if (index < wrongIndex) {
      chain.push(correctExpressions[index]);
    } else if (index === wrongIndex) {
      propagatedWrong = wrongExpressions[index];
      chain.push(propagatedWrong);
    } else {
      const wrongValue = evaluateExact(propagatedWrong!).value;
      chain.push(valueNode(wrongValue));
    }
  }
  const sourceValue = evaluateIndependent(source);
  const firstMismatch = chain.findIndex((step) => !equalRational(evaluateIndependent(step), sourceValue));
  if (firstMismatch !== wrongIndex) {
    throw new Error(`Incorrect-chain verifier expected mismatch ${wrongIndex}, found ${firstMismatch}.`);
  }
  const stepTexts = chain.map((step, index) => `Step ${index + 1}: ${renderExpression(step)}`);
  const optionDrafts = Object.freeze(stepTexts.map((text, index) => Object.freeze({
    value: `Step ${index + 1}`,
    isCorrect: index === wrongIndex,
    misconceptionId: index === wrongIndex
      ? wrongIndex === 0
        ? "GROUPED_ADDITION_BEFORE_MULTIPLICATION" as const
        : wrongIndex === 1
          ? "MULTIPLIED_INSTEAD_OF_DIVIDING" as const
          : wrongIndex === 2
            ? "IGNORED_LEFT_TO_RIGHT_ASSOCIATIVITY" as const
            : "FINAL_ARITHMETIC_PLUS_ONE" as const
      : "APPLIED_LOWER_PRIORITY_OPERATION_FIRST" as const,
    analysis: index === wrongIndex
      ? "This is the first transition whose independently evaluated value no longer equals the original expression."
      : index < wrongIndex
        ? "This earlier step preserves the exact value and is valid."
        : "This step occurs after the first error; it is not the earliest invalid transition.",
  })));

  return {
    taskDirection: "DIAGNOSIS",
    answerSemantic: "STEP_SELECTION",
    stem: `A student simplifies ${renderExpression(source)} as follows:\n${stepTexts.join("\n")}\nWhich is the first incorrect step?`,
    questionState: Object.freeze({
      kind: "INCORRECT_CHAIN",
      sourceExpression: source,
      chainExpressions: Object.freeze(chain),
    }),
    canonicalAnswer: `Step ${wrongIndex + 1}`,
    verifierAnswer: `Step ${firstMismatch + 1}`,
    canonicalTrace: evaluateExact(source).trace,
    optionDrafts,
    explanation: {
      coreConcept: "Every valid simplification transition must preserve the exact value while respecting grouping, precedence and left-to-right associativity.",
      givenDataAndStrategy: "Evaluate each displayed line independently and stop at the first line that differs from the original value.",
      stepByStep: Object.freeze([
        `Original exact value = ${formatRational(sourceValue)}.`,
        ...chain.map((step, index) => `Step ${index + 1} value = ${formatRational(evaluateIndependent(step))}${index === wrongIndex ? " — first mismatch" : ""}.`),
      ]),
      examSpeedMethod: "Check transitions in order; once a line changes the value, later lines cannot be the first error.",
    },
    hiddenState: Object.freeze({ a, b, c, d, e, product, q, wrongStep: wrongIndex + 1 }),
    difficultyEvidence: Object.freeze([
      "multi-line diagnostic chain",
      `error injected at transition ${wrongIndex + 1}`,
      difficulty === "HARD" ? "two high-priority operations before signed arithmetic" : "clean exact factors",
    ]),
    fingerprintParts: Object.freeze([expressionFingerprint(source), ...chain.map(expressionFingerprint), `wrong:${wrongIndex}`]),
  };
}
