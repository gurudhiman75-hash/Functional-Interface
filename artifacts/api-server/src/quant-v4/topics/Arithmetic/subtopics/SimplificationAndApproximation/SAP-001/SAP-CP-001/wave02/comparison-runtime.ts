import { compareRational, equalRational, formatRational } from "../../../shared/exact-rational";
import { binaryNode, expressionFingerprint, groupNode, type ExpressionNode } from "../../../shared/expression-ast";
import { evaluateExact } from "../../../shared/exact-evaluator";
import { evaluateIndependent } from "../../../shared/independent-evaluator";
import { renderExpression } from "../../../shared/expression-renderer";
import type { SapDifficulty } from "./types";
import { bracketStyleForSeed, comparisonText, integerNode, rotateDrafts, type BuiltState, type DeterministicRng } from "./common";

export function buildComparisonState(
  rng: DeterministicRng,
  seed: number,
  difficulty: SapDifficulty,
  correctIndex: number,
): BuiltState {
  const a = rng.int(5, difficulty === "HARD" ? 35 : 22);
  const b = rng.int(2, difficulty === "EASY" ? 8 : 13);
  const c = rng.int(2, difficulty === "HARD" ? 11 : 8);
  const mode = seed % 3;
  let left: ExpressionNode;
  let right: ExpressionNode;
  let groupingDescription: string;

  if (mode === 0) {
    left = binaryNode("ADD", groupNode(binaryNode("SUBTRACT", integerNode(a), integerNode(b)), bracketStyleForSeed(seed)), integerNode(c));
    right = binaryNode("SUBTRACT", integerNode(a), groupNode(binaryNode("ADD", integerNode(b), integerNode(c)), bracketStyleForSeed(seed + 1)));
    groupingDescription = "left-associated subtraction/addition versus subtracting a grouped sum";
  } else if (mode === 1) {
    left = binaryNode("SUBTRACT", integerNode(a), groupNode(binaryNode("ADD", integerNode(b), integerNode(c)), bracketStyleForSeed(seed)));
    right = binaryNode("ADD", groupNode(binaryNode("SUBTRACT", integerNode(a), integerNode(b)), bracketStyleForSeed(seed + 1)), integerNode(c));
    groupingDescription = "the same non-associative comparison with the expressions reversed";
  } else {
    left = binaryNode("ADD", groupNode(binaryNode("ADD", integerNode(a), integerNode(b)), bracketStyleForSeed(seed)), integerNode(c));
    right = binaryNode("ADD", integerNode(a), groupNode(binaryNode("ADD", integerNode(b), integerNode(c)), bracketStyleForSeed(seed + 1)));
    groupingDescription = "two associative addition groupings";
  }

  const canonicalLeft = evaluateExact(left);
  const canonicalRight = evaluateExact(right);
  const canonicalAnswer = comparisonText(compareRational(canonicalLeft.value, canonicalRight.value));
  const verifierAnswer = comparisonText(compareRational(evaluateIndependent(left), evaluateIndependent(right)));
  const allValues = [
    "Left expression > Right expression",
    "Left expression < Right expression",
    "Left expression = Right expression",
    "Cannot be determined",
  ];
  const wrongValues = allValues.filter((value) => value !== canonicalAnswer);
  const optionDrafts = rotateDrafts(
    {
      value: canonicalAnswer,
      misconceptionId: null,
      analysis: "Both expressions were evaluated exactly with their displayed grouping preserved.",
    },
    wrongValues.map((value) => ({
      value,
      misconceptionId: value === "Cannot be determined"
        ? "CANNOT_DETERMINE_WITH_VISIBLE_VALUES" as const
        : value.includes("=")
          ? "ASSUMED_GROUPING_NEVER_CHANGES_VALUE" as const
          : "IGNORED_LEFT_TO_RIGHT_ASSOCIATIVITY" as const,
      analysis: value === "Cannot be determined"
        ? "Every number and grouping is visible, so the relation is exactly determinable."
        : value.includes("=")
          ? "This assumes changing grouping cannot alter subtraction."
          : "This reverses or ignores the exact left-to-right/grouping result.",
    })),
    correctIndex,
  );

  return {
    taskDirection: "COMPARISON",
    answerSemantic: "COMPARISON_CLASS",
    stem: `Compare the exact values of Left = ${renderExpression(left)} and Right = ${renderExpression(right)}.`,
    questionState: Object.freeze({ kind: "COMPARISON", leftExpression: left, rightExpression: right }),
    canonicalAnswer,
    verifierAnswer,
    canonicalTrace: Object.freeze([...canonicalLeft.trace, ...canonicalRight.trace]),
    optionDrafts,
    explanation: {
      coreConcept: "Grouping fixes the scope of operations; subtraction is not associative, while addition is associative.",
      givenDataAndStrategy: "Evaluate the left and right ASTs separately, then compare their reduced exact values.",
      stepByStep: Object.freeze([
        `Left = ${renderExpression(left)} = ${formatRational(canonicalLeft.value)}.`,
        `Right = ${renderExpression(right)} = ${formatRational(canonicalRight.value)}.`,
        `Therefore, ${canonicalAnswer}.`,
      ]),
      examSpeedMethod: "Evaluate only the grouped blocks first; the comparison often becomes immediate without expanding every line.",
    },
    hiddenState: Object.freeze({ a, b, c, mode, groupingDescription }),
    difficultyEvidence: Object.freeze([
      "two exact expression trees must be compared",
      mode === 2 ? "recognition of associative addition" : "non-associative subtraction grouping",
      difficulty === "HARD" ? "less familiar values" : "compact arithmetic",
    ]),
    fingerprintParts: Object.freeze([expressionFingerprint(left), expressionFingerprint(right), `mode:${mode}`]),
  };
}

export function buildEquivalentGroupingState(
  rng: DeterministicRng,
  seed: number,
  difficulty: SapDifficulty,
  correctIndex: number,
): BuiltState {
  const a = rng.int(8, difficulty === "HARD" ? 40 : 25);
  let b = rng.int(2, difficulty === "EASY" ? 9 : 14);
  let c = rng.int(2, difficulty === "HARD" ? 13 : 9);
  if (b === c) c += 1;
  const source = binaryNode("ADD", binaryNode("SUBTRACT", integerNode(a), integerNode(b)), integerNode(c));
  const correct = binaryNode("ADD", groupNode(binaryNode("SUBTRACT", integerNode(a), integerNode(b)), bracketStyleForSeed(seed)), integerNode(c));
  const wrongCandidates: readonly ExpressionNode[] = Object.freeze([
    binaryNode("SUBTRACT", integerNode(a), groupNode(binaryNode("ADD", integerNode(b), integerNode(c)), bracketStyleForSeed(seed + 1))),
    binaryNode("SUBTRACT", groupNode(binaryNode("ADD", integerNode(a), integerNode(b)), bracketStyleForSeed(seed + 2)), integerNode(c)),
    binaryNode("ADD", integerNode(a), groupNode(binaryNode("ADD", integerNode(b), integerNode(c)), bracketStyleForSeed(seed))),
  ]);

  const sourceValue = evaluateExact(source).value;
  const candidates = [correct, ...wrongCandidates];
  const matching = candidates.filter((candidate) => equalRational(evaluateIndependent(candidate), sourceValue));
  if (matching.length !== 1) throw new Error("Equivalent-grouping state did not produce exactly one matching candidate.");

  const correctDraft = {
    value: renderExpression(correct),
    misconceptionId: null,
    analysis: "This makes the required left-to-right subtraction-then-addition grouping explicit.",
  };
  const wrongDrafts = wrongCandidates.map((candidate, index) => ({
    value: renderExpression(candidate),
    misconceptionId: index === 0
      ? "GROUPED_RIGHT_OPERANDS" as const
      : index === 1
        ? "IGNORED_LEFT_TO_RIGHT_ASSOCIATIVITY" as const
        : "REVERSED_SUBTRACTION_SIGN" as const,
    analysis: index === 0
      ? "This changes a − b + c into a − (b + c)."
      : index === 1
        ? "This adds a and b before subtracting c, contrary to the visible left-to-right chain."
        : "This changes subtraction of b into addition of b.",
  }));
  const optionDrafts = rotateDrafts(correctDraft, wrongDrafts, correctIndex);
  const orderedExpressions: ExpressionNode[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) orderedExpressions.push(correct);
    else { orderedExpressions.push(wrongCandidates[wrongIndex]!); wrongIndex += 1; }
  }
  const verifierMatches = orderedExpressions
    .map((candidate, index) => equalRational(evaluateIndependent(candidate), evaluateIndependent(source)) ? index : -1)
    .filter((index) => index >= 0);
  if (verifierMatches.length !== 1) throw new Error("Independent equivalent-grouping verifier found a non-unique option.");
  const verifierAnswer = renderExpression(orderedExpressions[verifierMatches[0]!]!);

  return {
    taskDirection: "SELECTION",
    answerSemantic: "EXPRESSION_SELECTION",
    stem: `Which explicitly grouped expression is equivalent to ${renderExpression(source)} under equal-precedence left-to-right evaluation?`,
    questionState: Object.freeze({
      kind: "EQUIVALENT_GROUPING",
      sourceExpression: source,
      candidateExpressions: Object.freeze(orderedExpressions),
    }),
    canonicalAnswer: renderExpression(correct),
    verifierAnswer,
    canonicalTrace: evaluateExact(source).trace,
    optionDrafts,
    explanation: {
      coreConcept: "Addition and subtraction have equal precedence and are processed from left to right.",
      givenDataAndStrategy: "Make the implicit left association explicit without changing any operator sign.",
      stepByStep: Object.freeze([
        `The visible chain is ${a} − ${b} + ${c}.`,
        `Left to right gives (${a} − ${b}) + ${c}.`,
        `So the equivalent grouped form is ${renderExpression(correct)}.`,
      ]),
      examSpeedMethod: "For a flat +/− chain, place brackets around the first two terms; do not group the right pair.",
    },
    hiddenState: Object.freeze({ a, b, c, sourceValue: formatRational(sourceValue) }),
    difficultyEvidence: Object.freeze([
      "the learner must preserve operator order while changing representation",
      difficulty === "HARD" ? "distractors have closer-looking bracket placements" : "single left-association decision",
    ]),
    fingerprintParts: Object.freeze([expressionFingerprint(source), ...orderedExpressions.map(expressionFingerprint)]),
  };
}
