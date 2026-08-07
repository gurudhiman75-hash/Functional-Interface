import {
  type Rat,
  add,
  divide,
  equalRat,
  formatPercentLiteral,
  parseNumericLiteral,
  rat,
  subtract,
} from "./exact";
import {
  generateSapCp003Package as generateV2Package,
  SAP_CP003_RUNTIME_STATE,
} from "./editorial-runtime-v2";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Option,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "./types";

interface Candidate {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

function absRat(value: Rat): Rat {
  return rat(value.n < 0n ? -value.n : value.n, value.d);
}

function withinPercentageRange(value: Rat): boolean {
  return value.n >= 0n && value.n * 2n <= value.d * 3n;
}

function boundedPercentageOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const correct = parseNumericLiteral(pkg.canonicalAnswer);
  if (!correct) return pkg.options;

  const candidates: readonly Candidate[] = Object.freeze([
    {
      value: divide(correct, rat(10n)),
      misconceptionId: "PERCENT_DECIMAL_SHIFT_LEFT",
      analysis: "The isolated percentage was made ten times too small.",
    },
    {
      value: absRat(subtract(rat(1n), correct)),
      misconceptionId: "COMPLEMENTARY_PERCENTAGE_SELECTED",
      analysis: "The complement to 100% was selected instead of the isolated percentage.",
    },
    {
      value: add(correct, rat(1n, 10n)),
      misconceptionId: "TEN_PERCENTAGE_POINTS_ADDED",
      analysis: "Ten percentage points were added to the isolated percentage.",
    },
    {
      value: correct.n * 10n >= correct.d
        ? subtract(correct, rat(1n, 10n))
        : add(correct, rat(1n, 5n)),
      misconceptionId: "TEN_PERCENTAGE_POINT_SLIP",
      analysis: "The isolated result was shifted by ten percentage points.",
    },
    {
      value: divide(correct, rat(2n)),
      misconceptionId: "PERCENTAGE_HALVED",
      analysis: "The isolated percentage factor was divided by two without justification.",
    },
    {
      value: add(correct, rat(1n, 5n)),
      misconceptionId: "TWENTY_PERCENTAGE_POINTS_ADDED",
      analysis: "Twenty percentage points were added to the isolated result.",
    },
    {
      value: rat(1n),
      misconceptionId: "ONE_HUNDRED_PERCENT_ASSUMED",
      analysis: "The blank was assumed to represent one whole, or 100%, without solving the equality.",
    },
  ]);

  const selected: Candidate[] = [];
  const used = new Set<string>([pkg.canonicalAnswer]);
  for (const candidate of candidates) {
    if (!withinPercentageRange(candidate.value) || equalRat(candidate.value, correct)) continue;
    const text = formatPercentLiteral(candidate.value);
    if (used.has(text)) continue;
    used.add(text);
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${pkg.prototypeId}/${pkg.seed}: could not create three bounded percentage distractors.`);
  }

  const options: SapCp003Option[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === pkg.correctIndex) {
      options.push(Object.freeze({ ...pkg.options[index]!, displayIndex: index + 1 }));
    } else {
      const candidate = selected[cursor++]!;
      options.push(Object.freeze({
        displayIndex: index + 1,
        value: formatPercentLiteral(candidate.value),
        isCorrect: false,
        misconceptionId: candidate.misconceptionId,
        analysis: candidate.analysis,
      }));
    }
  }
  return Object.freeze(options);
}

function remediate(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL") return pkg;
  const options = boundedPercentageOptions(pkg);
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = options.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = options[pkg.correctIndex]?.isCorrect === true
    && options[pkg.correctIndex]?.value === pkg.canonicalAnswer;
  const errors = pkg.validation.errors.filter((error) => !/option/i.test(error));
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");
  return Object.freeze({
    ...pkg,
    options,
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

export function generateSapCp003Package(prototypeId: SapCp003PrototypeId, seed: number): SapCp003Package {
  return remediate(generateV2Package(prototypeId, seed));
}

export function generateSapCp003Sweep(seedsPerPrototype: number): readonly SapCp003Package[] {
  const packages: SapCp003Package[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export { SAP_CP003_RUNTIME_STATE };
