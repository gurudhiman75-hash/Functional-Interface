import { formatRational } from "../../../shared/exact-rational";
import { binaryNode, expressionFingerprint, factorialNode, groupNode, powerNode, type ExpressionNode } from "../../../shared/expression-ast";
import { evaluateExact } from "../../../shared/exact-evaluator";
import { evaluateIndependent } from "../../../shared/independent-evaluator";
import { renderExpression } from "../../../shared/expression-renderer";
import type { SapDifficulty } from "./types";
import { bracketStyleForSeed, buildNumericDrafts, integerNode, type BuiltState, type DeterministicRng } from "./common";

export function buildPartialEvaluationState(
  rng: DeterministicRng,
  seed: number,
  difficulty: SapDifficulty,
  correctIndex: number,
): BuiltState {
  const mode = seed % 4;
  const a = rng.int(3, difficulty === "HARD" ? 28 : 18);
  const b = rng.int(2, difficulty === "HARD" ? 10 : 7);
  const c = rng.int(2, difficulty === "HARD" ? 9 : 6);
  const d = rng.int(1, difficulty === "HARD" ? 15 : 9);
  let source: ExpressionNode;
  let subexpression: ExpressionNode;
  let substituted: ExpressionNode;
  let declaration: string;

  if (mode === 0) {
    const product = b * c;
    subexpression = binaryNode("MULTIPLY", integerNode(b), integerNode(c));
    source = binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), subexpression), integerNode(d));
    substituted = binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), integerNode(product)), integerNode(d));
    declaration = `${b} × ${c} = ${product}`;
  } else if (mode === 1) {
    const difference = a - b;
    subexpression = groupNode(binaryNode("SUBTRACT", integerNode(a), integerNode(b)), bracketStyleForSeed(seed));
    source = binaryNode("ADD", binaryNode("MULTIPLY", subexpression, integerNode(c)), integerNode(d));
    substituted = binaryNode("ADD", binaryNode("MULTIPLY", integerNode(difference), integerNode(c)), integerNode(d));
    declaration = `${renderExpression(subexpression)} = ${difference}`;
  } else if (mode === 2) {
    const power = b * b;
    subexpression = powerNode(integerNode(b), 2n);
    source = binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), subexpression), integerNode(c));
    substituted = binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), integerNode(power)), integerNode(c));
    declaration = `${b}^2 = ${power}`;
  } else {
    const n = rng.int(4, difficulty === "HARD" ? 7 : 6);
    let factorial = 1;
    for (let factor = 2; factor <= n; factor += 1) factorial *= factor;
    const divisor = n;
    subexpression = factorialNode(integerNode(n));
    source = binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", subexpression, integerNode(divisor)));
    substituted = binaryNode("ADD", integerNode(a), binaryNode("DIVIDE", integerNode(factorial), integerNode(divisor)));
    declaration = `${n}! = ${factorial}`;
  }

  const canonical = evaluateExact(source);
  const verifierValue = evaluateIndependent(substituted);
  const canonicalAnswer = formatRational(canonical.value);
  const verifierAnswer = formatRational(verifierValue);
  const optionDrafts = buildNumericDrafts(canonical.value, correctIndex);

  return {
    taskDirection: "PARTIAL_EVALUATION",
    answerSemantic: "EXACT_VALUE",
    stem: `In ${renderExpression(source)}, use the declared simplification ${declaration}. What is the final exact value?`,
    questionState: Object.freeze({
      kind: "PARTIAL_EVALUATION",
      sourceExpression: source,
      declaredSubexpression: subexpression,
      substitutedExpression: substituted,
    }),
    canonicalAnswer,
    verifierAnswer,
    canonicalTrace: canonical.trace,
    optionDrafts,
    explanation: {
      coreConcept: "A correctly simplified subexpression may be substituted as one exact value without changing the surrounding operation tree.",
      givenDataAndStrategy: `Replace only ${renderExpression(subexpression)} using ${declaration}, then evaluate the remaining expression in order.`,
      stepByStep: Object.freeze([
        `Original expression: ${renderExpression(source)}.`,
        `After substitution: ${renderExpression(substituted)}.`,
        `Final exact value: ${canonicalAnswer}.`,
      ]),
      examSpeedMethod: "Treat the declared result as one block; do not alter any operator outside that block.",
    },
    hiddenState: Object.freeze({ a, b, c, d, mode, declaration }),
    difficultyEvidence: Object.freeze([
      "partial-evaluation state must preserve the remaining AST",
      mode === 3 ? "factorial substitution followed by division" : mode === 2 ? "power substitution" : mode === 1 ? "grouped signed substitution" : "multiplication substitution",
      difficulty === "HARD" ? "larger remaining arithmetic" : "compact exact arithmetic",
    ]),
    fingerprintParts: Object.freeze([expressionFingerprint(source), expressionFingerprint(subexpression), expressionFingerprint(substituted), `mode:${mode}`]),
  };
}
