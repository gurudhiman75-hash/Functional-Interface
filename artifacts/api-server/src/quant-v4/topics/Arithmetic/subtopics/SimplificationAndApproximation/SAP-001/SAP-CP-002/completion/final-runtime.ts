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
  type SapCp002CompletionOption,
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

function diagnosisOptions(correctIndex: number): readonly SapCp002CompletionOption[] {
  const wrong = [
    {
      value: "Step 1",
      misconceptionId: "FLAGGED_CORRECT_GIVEN_STEP",
      analysis: "This line only states the original fraction expression and introduces no transformation error.",
    },
    {
      value: "Step 2",
      misconceptionId: "FLAGGED_CORRECT_COMMON_DENOMINATOR",
      analysis: "This line correctly scales both fractions to the displayed common denominator.",
    },
    {
      value: "Step 3",
      misconceptionId: "FLAGGED_CORRECT_NUMERATOR_COMBINATION",
      analysis: "This line correctly combines the scaled numerators while retaining the common denominator.",
    },
  ] as const;
  const options: SapCp002CompletionOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({
        value: "Step 4",
        isCorrect: true,
        misconceptionId: null,
        analysis: "This is the first line that changes the exact value of the expression.",
      }));
    } else {
      const item = wrong[wrongIndex++]!;
      options.push(Object.freeze({
        value: item.value,
        isCorrect: false,
        misconceptionId: item.misconceptionId,
        analysis: item.analysis,
      }));
    }
  }
  return Object.freeze(options);
}

function withDiagnosisAnswerDiversity(
  pkg: SapCp002CompletionPackage,
): SapCp002CompletionPackage {
  if (pkg.temporaryPrototypeId !== "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP") return pkg;
  if (pkg.seed % 3 !== 0) return pkg;

  const n1 = Number(pkg.hiddenState.n1);
  const d1 = Number(pkg.hiddenState.d1);
  const n2 = Number(pkg.hiddenState.n2);
  const d2 = Number(pkg.hiddenState.d2);
  const common = Number(pkg.hiddenState.common);
  const scaled1 = n1 * d2;
  const scaled2 = n2 * d1;
  const combinedNumerator = scaled1 + scaled2;
  const renderedExpression = [
    `Step 1: ${n1}/${d1} + ${n2}/${d2}`,
    `Step 2: (${scaled1} + ${scaled2})/${common}`,
    `Step 3: ${combinedNumerator}/${common}`,
    `Step 4: ${combinedNumerator + 1}/${common}`,
  ].join("\n");
  const options = diagnosisOptions(pkg.correctIndex);
  const traps = Object.freeze(options.filter((option) => !option.isCorrect).map((option) => option.analysis));

  return Object.freeze({
    ...pkg,
    renderedExpression,
    stem: `A student simplified a fraction expression as shown below. Identify the first incorrect step.\n${renderedExpression}`,
    canonicalAnswer: "Step 4",
    verifierAnswer: "Step 4",
    options,
    explanation: Object.freeze({
      coreConcept: "The first incorrect step is the earliest transition that changes the exact value of the fraction expression.",
      givenDataAndStrategy: "Check each consecutive line for exact equivalence and stop at the first value-changing transition.",
      stepByStep: Object.freeze([
        "Step 1 is the original expression.",
        "Steps 2 and 3 correctly create a common denominator and combine the scaled numerators.",
        "Step 4 changes the numerator without a valid common reduction, so it is the first incorrect step.",
      ]),
      examSpeedMethod: "Verify one transition at a time and stop immediately when numerator and denominator are not transformed by the same valid operation.",
      commonTraps: traps,
      finalAnswer: "Therefore, the required answer is Step 4.",
    }),
    independentTrace: Object.freeze([
      ...pkg.independentTrace,
      `Steps 1–3 preserve the exact value ${pkg.canonicalValue === null ? "" : `${pkg.canonicalValue.numerator}/${pkg.canonicalValue.denominator}`}.`,
      "Step 4 increases only the numerator and therefore changes the value.",
    ]),
    hiddenState: Object.freeze({
      ...pkg.hiddenState,
      errorStep: 4,
    }),
    mathematicalFingerprint: `INCORRECT_STEP(${n1}/${d1}+${n2}/${d2};error=4;wrong=${combinedNumerator + 1}/${common})`,
  });
}

export function generateSapCp002CompletionPackage(
  prototypeId: SapCp002CompletionPrototypeId,
  seed: number,
): SapCp002CompletionPackage {
  const diversified = withComplementRepresentationDiversity(generateBasePackage(prototypeId, seed));
  return withDiagnosisAnswerDiversity(diversified);
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
