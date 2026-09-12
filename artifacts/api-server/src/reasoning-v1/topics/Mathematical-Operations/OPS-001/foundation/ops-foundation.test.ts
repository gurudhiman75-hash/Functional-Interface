import assert from "node:assert/strict";
import {
  OpsFoundationError,
  STANDARD_IDENTITY_MAPPING,
  applyOperatorMapping,
  canonicalExactKey,
  compareExact,
  composeTransformations,
  evaluateParsedExpression,
  findDigitPairRepairs,
  findOperatorAndWholeNumberRepairs,
  findOperatorPairRepairs,
  findWholeNumberPairRepairs,
  formatExact,
  fromFiniteDecimal,
  inferBijectiveMapping,
  makeRational,
  mappingFingerprint,
  parseSemanticTokens,
  parsedExpressionFingerprint,
  renderDisplayTokens,
  solveWithMapping,
  swapDigitIdentities,
  swapDisplayOperators,
  swapWholeNumberTokens,
  tokenizeDisplayExpression,
  type OperatorMapping,
} from "./index";

function arithmeticValue(source: string): string {
  const solved = solveWithMapping(source, STANDARD_IDENTITY_MAPPING);
  assert.equal(solved.evaluation.parsed.kind, "ARITHMETIC");
  assert.ok(solved.evaluation.arithmeticValue);
  return formatExact(solved.evaluation.arithmeticValue);
}

function relationValue(source: string): boolean {
  const solved = solveWithMapping(source, STANDARD_IDENTITY_MAPPING);
  assert.equal(solved.evaluation.parsed.kind, "RELATION");
  return solved.evaluation.relationValue!;
}

assert.deepEqual(fromFiniteDecimal("0.02"), { numerator: 1n, denominator: 50n });
assert.deepEqual(fromFiniteDecimal("0.0625"), { numerator: 1n, denominator: 16n });
assert.deepEqual(makeRational(-8n, -12n), { numerator: 2n, denominator: 3n });
assert.equal(compareExact(fromFiniteDecimal("0.5"), makeRational(1n, 2n)), 0);
assert.throws(
  () => makeRational(1n, 0n),
  (error: unknown) => error instanceof OpsFoundationError && error.code === "DIVISION_BY_ZERO",
);

assert.equal(arithmeticValue("2 + 3 × 4"), "14");
assert.equal(arithmeticValue("(2 + 3) × 4"), "20");
assert.equal(arithmeticValue("20 ÷ 5 ÷ 2"), "2");
assert.equal(arithmeticValue("− 5 + 2 × 3"), "1");
assert.equal(arithmeticValue("1 ÷ 8 + 0.125"), "1/4");
assert.equal(relationValue("3 + 4 = 14 ÷ 2"), true);
assert.equal(relationValue("3 + 4 < 8"), true);
assert.throws(
  () => relationValue("1 = 1 = 1"),
  (error: unknown) => error instanceof OpsFoundationError && error.code === "INVALID_RELATION_STRUCTURE",
);

const completeMapping: OperatorMapping = {
  entries: [
    { displayToken: "+", semanticOperator: "MULTIPLY" },
    { displayToken: "−", semanticOperator: "DIVIDE" },
    { displayToken: "×", semanticOperator: "SUBTRACT" },
    { displayToken: "÷", semanticOperator: "ADD" },
  ],
};
assert.equal(
  formatExact(solveWithMapping("74 + 26 − 4 × 5 ÷ 2", completeMapping).evaluation.arithmeticValue!),
  "478",
);

const partialMapping: OperatorMapping = {
  entries: [{ displayToken: "+", semanticOperator: "MULTIPLY" }],
};
assert.equal(formatExact(solveWithMapping("3 + 4 − 2", partialMapping).evaluation.arithmeticValue!), "10");

const manyToOneMapping: OperatorMapping = {
  entries: [
    { displayToken: "+", semanticOperator: "ADD" },
    { displayToken: "−", semanticOperator: "ADD" },
  ],
};
assert.equal(formatExact(solveWithMapping("3 + 4 − 2", manyToOneMapping).evaluation.arithmeticValue!), "9");
assert.equal(mappingFingerprint(manyToOneMapping), "MAP:+->ADD|−->ADD:preserve=true");

const arbitraryMapping: OperatorMapping = {
  entries: [
    { displayToken: "M", semanticOperator: "ADD" },
    { displayToken: "N", semanticOperator: "SUBTRACT" },
    { displayToken: "P", semanticOperator: "MULTIPLY" },
    { displayToken: "Q", semanticOperator: "DIVIDE" },
  ],
  preserveUnmappedStandardOperators: false,
};
const arbitrarySolved = solveWithMapping("14 P 10 M 42 Q 2 N 8", arbitraryMapping);
assert.equal(formatExact(arbitrarySolved.evaluation.arithmeticValue!), "153");
assert.ok(arbitrarySolved.semanticFingerprint.startsWith("ARITH:"));

const swapSource = tokenizeDisplayExpression("5 + 6 × 3 − 4 ÷ 2");
const swaps = [{ left: "+", right: "×" }, { left: "−", right: "÷" }];
const once = swapDisplayOperators(swapSource, swaps);
const twice = swapDisplayOperators(once.tokens, swaps);
assert.equal(renderDisplayTokens(twice.tokens), renderDisplayTokens(swapSource));
assert.equal(once.trace.after, "5 × 6 + 3 ÷ 4 − 2");
assert.throws(
  () => swapDisplayOperators(swapSource, [{ left: "+", right: "×" }, { left: "+", right: "÷" }]),
  (error: unknown) => error instanceof OpsFoundationError && error.code === "DUPLICATE_SWAP_TOKEN",
);

const relocated = swapDisplayOperators(
  tokenizeDisplayExpression("12 = 3 + 2 ÷ 6"),
  [{ left: "÷", right: "=" }],
);
assert.equal(renderDisplayTokens(relocated.tokens), "12 ÷ 3 + 2 = 6");
assert.equal(
  evaluateParsedExpression(
    parseSemanticTokens(applyOperatorMapping(relocated.tokens, STANDARD_IDENTITY_MAPPING)),
  ).relationValue,
  true,
);

const numberSwapSource = tokenizeDisplayExpression("24 + 6 = 30");
assert.equal(
  renderDisplayTokens(swapWholeNumberTokens(numberSwapSource, "24", "6").tokens),
  "6 + 24 = 30",
);
assert.equal(
  renderDisplayTokens(swapDigitIdentities(numberSwapSource, 2, 6).tokens),
  "64 + 2 = 30",
);
assert.throws(
  () => swapDigitIdentities(tokenizeDisplayExpression("10 + 2 = 12"), 1, 0),
  (error: unknown) => error instanceof OpsFoundationError && error.code === "LEADING_ZERO_AFTER_DIGIT_SWAP",
);

const compound = composeTransformations(
  tokenizeDisplayExpression("16 × 4 + 12 ÷ 4 − 15 = 59"),
  [
    (tokens) => swapDisplayOperators(tokens, [{ left: "+", right: "−" }]),
    (tokens) => swapWholeNumberTokens(tokens, "16", "12"),
  ],
);
assert.equal(renderDisplayTokens(compound.tokens), "12 × 4 − 16 ÷ 4 + 15 = 59");
assert.equal(
  evaluateParsedExpression(
    parseSemanticTokens(applyOperatorMapping(compound.tokens, STANDARD_IDENTITY_MAPPING)),
  ).relationValue,
  true,
);
assert.ok(compound.fingerprint.includes("OP_SWAP"));
assert.ok(compound.fingerprint.includes("NUMBER_SWAP"));

const operatorRepairs = findOperatorPairRepairs("48 − 8 ÷ 4 + 5 × 6 = 32");
assert.deepEqual(
  operatorRepairs.map((repair) => [repair.candidate.left, repair.candidate.right]),
  [["−", "÷"]],
);

const relationRepairs = findOperatorPairRepairs(
  "12 = 3 + 2 ÷ 6",
  ["+", "−", "×", "÷", "="],
);
assert.deepEqual(
  relationRepairs.map((repair) => [repair.candidate.left, repair.candidate.right]),
  [["÷", "="]],
);

const wholeNumberRepairs = findWholeNumberPairRepairs("4 ÷ 5 − 3 + 2 × 1 = 11");
assert.deepEqual(wholeNumberRepairs.map((repair) => repair.candidate), [["5", "1"]]);

const digitRepairs = findDigitPairRepairs("15 + 3 = 12");
assert.deepEqual(digitRepairs.map((repair) => repair.candidate), [[2, 5]]);

const compoundRepairs = findOperatorAndWholeNumberRepairs("16 × 4 + 12 ÷ 4 − 15 = 59");
// The published source option set has one keyed answer, but unrestricted enumeration finds a second valid repair.
// This collision proves that source answer keys are not sufficient validation for generated questions.
assert.equal(compoundRepairs.length, 2);
assert.ok(compoundRepairs.some((repair) =>
  new Set([repair.candidate.operatorPair.left, repair.candidate.operatorPair.right]).has("+")
  && new Set([repair.candidate.operatorPair.left, repair.candidate.operatorPair.right]).has("−")
  && new Set(repair.candidate.numberPair).has("16")
  && new Set(repair.candidate.numberPair).has("12")
));

const inferredArithmetic = inferBijectiveMapping(
  ["M", "N"],
  ["ADD", "SUBTRACT"],
  [
    { expression: "2 M 3", expectedValue: "5" },
    { expression: "8 N 3", expectedValue: "5" },
  ],
);
assert.equal(inferredArithmetic.length, 1);
assert.deepEqual(inferredArithmetic[0].entries, [
  { displayToken: "M", semanticOperator: "ADD" },
  { displayToken: "N", semanticOperator: "SUBTRACT" },
]);

const inferredMixed = inferBijectiveMapping(
  ["A", "B", "C"],
  ["ADD", "EQUAL", "GREATER_THAN"],
  [
    { expression: "3 A 2 B 5", expectedTruth: true },
    { expression: "7 C 4", expectedTruth: true },
  ],
);
assert.equal(inferredMixed.length, 1);
assert.deepEqual(inferredMixed[0].entries, [
  { displayToken: "A", semanticOperator: "ADD" },
  { displayToken: "B", semanticOperator: "EQUAL" },
  { displayToken: "C", semanticOperator: "GREATER_THAN" },
]);

const parsedA = parseSemanticTokens(
  applyOperatorMapping(tokenizeDisplayExpression("2 + 3 × 4"), STANDARD_IDENTITY_MAPPING),
);
const parsedB = parseSemanticTokens(
  applyOperatorMapping(tokenizeDisplayExpression("2+3*4"), STANDARD_IDENTITY_MAPPING),
);
assert.equal(parsedExpressionFingerprint(parsedA), parsedExpressionFingerprint(parsedB));
assert.equal(canonicalExactKey(fromFiniteDecimal("0.50")), canonicalExactKey(fromFiniteDecimal("0.5")));

console.log("OPS-001 foundation contract test passed.", {
  operatorRepairs: operatorRepairs.length,
  relationRepairs: relationRepairs.length,
  wholeNumberRepairs: wholeNumberRepairs.length,
  digitRepairs: digitRepairs.length,
  compoundRepairs: compoundRepairs.length,
  inferredArithmeticMappings: inferredArithmetic.length,
  inferredMixedMappings: inferredMixed.length,
});
