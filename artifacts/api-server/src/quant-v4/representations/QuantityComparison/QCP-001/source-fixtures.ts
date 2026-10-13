import { classifyQcp001Relation } from "./engine";
export function auditQcpSourceComparisons() {
  const fixtures: readonly [readonly number[], readonly number[], string][] = [
    [[5], [4], "QUANTITY_I_GREATER"],
    [[49], [49], "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED"],
    [
      [0.35714285714285715],
      [0.35714285714285715, 1.1428571428571428],
      "QUANTITY_I_LESS_OR_EQUAL",
    ],
    [[576], [480], "QUANTITY_I_GREATER"],
    [[60000], [58333.333333333336], "QUANTITY_I_GREATER"],
    [
      [0.02631578947368421, 0.14473684210526316],
      [0.4105263157894737],
      "QUANTITY_I_LESS",
    ],
    [[37.5], [40], "QUANTITY_I_LESS"],
    [[900], [900], "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED"],
    [
      [-8.660254037844386, 6.928203230275509],
      [-7.0710678118654755, -2.8284271247461903],
      "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED",
    ],
    [[28000], [27500], "QUANTITY_I_GREATER"],
    [[88], [82.5], "QUANTITY_I_GREATER"],
    [[140], [138.88888888888889], "QUANTITY_I_GREATER"],
    [[64.28571428571429], [68.18181818181819], "QUANTITY_I_LESS"],
    [[40], [42], "QUANTITY_I_LESS"],
    [[10], [11], "QUANTITY_I_LESS"],
    [[144], [144], "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED"],
    [[16000], [20000], "QUANTITY_I_LESS"],
    [[62.5], [62.5], "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED"],
    [[7], [6], "QUANTITY_I_GREATER"],
    [[18], [20], "QUANTITY_I_LESS"],
  ];
  for (const [a, b, relation] of fixtures)
    if (classifyQcp001Relation(a, b) !== relation)
      throw Error("Adjudicated source comparison fixture failed");
  return {
    sourceComparisons: fixtures.length,
    quarantinedSourceItems: 5,
    generatedWordProblemCoverageCertified: false,
  };
}
