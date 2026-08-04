import {
  fractionExpressionFingerprint,
  fractionGroupNode,
  renderFractionExpression,
  type SapFractionExpressionNode,
} from "../wave01/display-expression";
import {
  generateSapCp002CompletionPackage as generateBasePackage,
} from "./runtime";
import {
  SAP_CP002_COMPLETION_PROTOTYPE_IDS,
  type SapCp002CompletionPackage,
  type SapCp002CompletionPrototypeId,
} from "./types";

const GROUP_STYLES = ["ROUND", "SQUARE", "CURLY"] as const;

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer.`);
}

function withComplementRepresentationDiversity(
  pkg: SapCp002CompletionPackage,
): SapCp002CompletionPackage {
  if (pkg.temporaryPrototypeId !== "SAP-CP002-PROT-FRACTION-COMPLEMENT") return pkg;
  if (pkg.expression === null) throw new Error("Complement authority requires an exact expression.");

  const style = GROUP_STYLES[(pkg.seed - 1) % GROUP_STYLES.length]!;
  const expression: SapFractionExpressionNode = fractionGroupNode(pkg.expression, style);
  const renderedExpression = renderFractionExpression(expression);
  const stem = `Simplify the following expression and give the answer in lowest terms: ${renderedExpression}`;

  return Object.freeze({
    ...pkg,
    expression,
    renderedExpression,
    stem,
    independentTrace: Object.freeze([
      ...pkg.independentTrace,
      `The outer ${style.toLowerCase()} group preserves the exact complement value.`,
    ]),
    hiddenState: Object.freeze({
      ...pkg.hiddenState,
      outerGroupingStyle: style,
    }),
    mathematicalFingerprint: fractionExpressionFingerprint(expression),
  });
}

export function generateSapCp002CompletionPackage(
  prototypeId: SapCp002CompletionPrototypeId,
  seed: number,
): SapCp002CompletionPackage {
  return withComplementRepresentationDiversity(generateBasePackage(prototypeId, seed));
}

export function generateSapCp002CompletionSweep(
  seedsPerPrototype: number,
): readonly SapCp002CompletionPackage[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-002 final completion sweep size");
  const packages: SapCp002CompletionPackage[] = [];
  for (const prototypeId of SAP_CP002_COMPLETION_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp002CompletionPackage(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
