import { decimalPlaces, ensureSentence, hash32 } from "./exact";
import {
  generateSapCp003Package as generateV3Package,
  SAP_CP003_RUNTIME_STATE,
} from "./editorial-runtime-v3";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Difficulty,
  type SapCp003Option,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "./types";

const COMPARISON_BENCHMARKS = Object.freeze([
  ["1/8", "12.5%"],
  ["1/4", "25%"],
  ["3/8", "37.5%"],
  ["2/5", "40%"],
  ["1/2", "50%"],
  ["5/8", "62.5%"],
  ["3/4", "75%"],
  ["4/5", "80%"],
  ["7/8", "87.5%"],
] as const);

const VARIABLE_PAIRS = Object.freeze([
  ["x", "y"],
  ["m", "n"],
  ["p", "q"],
  ["u", "v"],
] as const);

function nextXorShift32(state: number): number {
  let value = state >>> 0 || 0x9e3779b9;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function recurringDisplay(text: string): string {
  return text.replace(/(\d+)\.(\d*)\((\d+)\)/g, (_match, whole: string, nonRecurring: string, recurring: string) => {
    const overlined = [...recurring].map((digit) => `${digit}\u0305`).join("");
    return `${whole}.${nonRecurring}${overlined} (${recurring} recurring)`;
  });
}

function unknownBaseComparisonVariant(pkg: SapCp003Package): SapCp003Package {
  if (
    pkg.prototypeId !== "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT"
    || pkg.seed % 5 !== 0
  ) return pkg;

  const variantIndex = Math.floor(pkg.seed / 5) - 1;
  const [fraction, percent] = COMPARISON_BENCHMARKS[variantIndex % COMPARISON_BENCHMARKS.length]!;
  const [leftVariable, rightVariable] = VARIABLE_PAIRS[
    Math.floor(variantIndex / COMPARISON_BENCHMARKS.length) % VARIABLE_PAIRS.length
  ]!;
  const answer = "Cannot be determined";
  const options: readonly SapCp003Option[] = Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: "A > B",
      isCorrect: false,
      misconceptionId: "UNKNOWN_BASE_GREATER_ASSUMED",
      analysis: `This assumes ${leftVariable} is greater than ${rightVariable}, but no such relation is given.`,
    }),
    Object.freeze({
      displayIndex: 2,
      value: "A < B",
      isCorrect: false,
      misconceptionId: "UNKNOWN_BASE_LESS_ASSUMED",
      analysis: `This assumes ${leftVariable} is less than ${rightVariable}, but no such relation is given.`,
    }),
    Object.freeze({
      displayIndex: 3,
      value: "A = B",
      isCorrect: false,
      misconceptionId: "EQUIVALENT_FACTORS_TREATED_AS_EQUAL_RESULTS",
      analysis: "The fraction and percentage are equivalent factors, but they are applied to different unknown bases.",
    }),
    Object.freeze({
      displayIndex: 4,
      value: answer,
      isCorrect: true,
      misconceptionId: null,
      analysis: "The coefficient is the same on both sides, but the two positive bases are unrelated.",
    }),
  ]);

  return Object.freeze({
    ...pkg,
    difficulty: "MEDIUM" as const,
    difficultyScore: 5,
    stem: `A = ${fraction} of ${leftVariable} and B = ${percent} of ${rightVariable}, where ${leftVariable} and ${rightVariable} are positive numbers. Which relation between A and B must be true?`,
    options,
    correctIndex: 3,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    explanation: Object.freeze({
      coreConcept: ensureSentence("Equivalent fraction and percentage factors give equal results only when they are applied to the same base"),
      steps: Object.freeze([
        ensureSentence(`${fraction} and ${percent} represent the same numerical factor`),
        ensureSentence(`A uses the base ${leftVariable}, while B uses the different base ${rightVariable}`),
        ensureSentence(`No relation between ${leftVariable} and ${rightVariable} is given, so A and B cannot be compared`),
      ]),
      finalAnswer: ensureSentence(`Therefore, the relation cannot be determined`),
    }),
    canonicalPayloadKey: [
      "SAP_CP003_COMPARISON_UNKNOWN_BASE_V2",
      fraction,
      percent,
      leftVariable,
      rightVariable,
    ].join("|"),
    generationIdentity: [
      "SAP_CP003_STRUCTURAL_V2",
      pkg.prototypeId,
      String(pkg.seed),
      "UNKNOWN_BASE_COMPARISON",
    ].join("|"),
    validation: Object.freeze({
      ...pkg.validation,
      ok: true,
      errors: Object.freeze([]),
      exactAgreementPassed: true,
      optionUniquenessPassed: true,
      singleCorrectOptionPassed: true,
      answerBindingPassed: true,
      surfaceSyntaxPassed: true,
      explanationCompletenessPassed: true,
      lifecyclePassed: true,
    }),
  });
}

function visibleDecimalPlacementVariant(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT") return pkg;
  const match = pkg.stem.match(/correct value of ([0-9.]+) × ([0-9.]+)\?/);
  if (!match) return pkg;
  const left = match[1]!;
  const right = match[2]!;
  const leftDigits = left.replace(".", "");
  const rightDigits = right.replace(".", "");
  const wholeProduct = BigInt(leftDigits) * BigInt(rightDigits);
  const visiblePlaces = decimalPlaces(left) + decimalPlaces(right);
  const placeWord = visiblePlaces === 1 ? "place" : "places";
  const difficulty: SapCp003Difficulty = visiblePlaces <= 2 && leftDigits.length + rightDigits.length <= 5
    ? "EASY"
    : "MEDIUM";

  return Object.freeze({
    ...pkg,
    difficulty,
    difficultyScore: difficulty === "EASY" ? 3 : 5,
    stem: `Ignoring decimal points, ${leftDigits} × ${rightDigits} = ${wholeProduct}. Which option places the decimal point correctly for ${left} × ${right}?`,
    explanation: Object.freeze({
      coreConcept: ensureSentence("Multiply the visible whole-number digits first, then restore exactly the decimal places shown in the two factors"),
      steps: Object.freeze([
        ensureSentence(`Ignore the decimal points: ${leftDigits} × ${rightDigits} = ${wholeProduct}`),
        ensureSentence(`The visible factors have ${visiblePlaces} decimal ${placeWord} in total, so ${wholeProduct} becomes ${pkg.canonicalAnswer}`),
      ]),
      finalAnswer: ensureSentence(`Therefore, the correctly placed value is ${pkg.canonicalAnswer}`),
    }),
  });
}

function accessibleRecurringNotation(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION") return pkg;
  return Object.freeze({
    ...pkg,
    difficulty: "MEDIUM" as const,
    difficultyScore: 6,
    stem: recurringDisplay(pkg.stem),
    explanation: Object.freeze({
      ...pkg.explanation,
      steps: Object.freeze(pkg.explanation.steps.map(recurringDisplay)),
    }),
  });
}

function recalibrateDifficulty(pkg: SapCp003Package): SapCp003Package {
  let difficulty = pkg.difficulty;
  let difficultyScore = pkg.difficultyScore;
  switch (pkg.prototypeId) {
    case "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN":
      difficulty = "EASY";
      difficultyScore = 2;
      break;
    case "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR":
      difficulty = "EASY";
      difficultyScore = 3;
      break;
    case "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION":
      difficulty = "EASY";
      difficultyScore = 3;
      break;
    case "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS":
      difficulty = "MEDIUM";
      difficultyScore = 5;
      break;
    case "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND":
      difficulty = pkg.stem.includes("×") ? "MEDIUM" : "EASY";
      difficultyScore = difficulty === "EASY" ? 3 : 5;
      break;
    case "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT":
      difficulty = "MEDIUM";
      difficultyScore = 5;
      break;
    default:
      break;
  }
  return difficulty === pkg.difficulty && difficultyScore === pkg.difficultyScore
    ? pkg
    : Object.freeze({ ...pkg, difficulty, difficultyScore });
}

function shuffledOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const order = [0, 1, 2, 3];
  let state = hash32([
    "SAP_CP003_OPTION_ORDER_V2",
    pkg.prototypeId,
    pkg.canonicalPayloadKey,
    pkg.generationIdentity,
  ].join("|"));

  for (let index = order.length - 1; index > 0; index -= 1) {
    state = nextXorShift32(state);
    const swapIndex = state % (index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex]!, order[index]!];
  }

  return Object.freeze(order.map((sourceIndex, displayIndex) => Object.freeze({
    ...pkg.options[sourceIndex]!,
    displayIndex: displayIndex + 1,
  })));
}

function remediateOptionOrder(pkg: SapCp003Package): SapCp003Package {
  const options = shuffledOptions(pkg);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = options.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = correctIndex >= 0
    && options[correctIndex]?.value === pkg.canonicalAnswer;
  const errors = pkg.validation.errors.filter((error) => !/option|answer is not bound/i.test(error));
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");

  return Object.freeze({
    ...pkg,
    options,
    correctIndex,
    validation: Object.freeze({
      ...pkg.validation,
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      optionUniquenessPassed,
      singleCorrectOptionPassed,
      answerBindingPassed,
    }),
  });
}

function structuralRemediation(pkg: SapCp003Package): SapCp003Package {
  const compared = unknownBaseComparisonVariant(pkg);
  const placement = visibleDecimalPlacementVariant(compared);
  const recurring = accessibleRecurringNotation(placement);
  const recalibrated = recalibrateDifficulty(recurring);
  return remediateOptionOrder(recalibrated);
}

export function generateSapCp003Package(
  prototypeId: SapCp003PrototypeId,
  seed: number,
): SapCp003Package {
  return structuralRemediation(generateV3Package(prototypeId, seed));
}

export function generateSapCp003Sweep(
  seedsPerPrototype: number,
): readonly SapCp003Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-003 sweep size must be a positive integer.");
  }
  const packages: SapCp003Package[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export { SAP_CP003_RUNTIME_STATE };
