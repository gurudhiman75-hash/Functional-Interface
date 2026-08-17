import {
  SAP_CP008_CATALOGUE,
  SAP_CP008_INTERNAL,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008 as generateV2,
  type SapCp008Difficulty,
  type SapCp008Option,
  type SapCp008Package,
  type SapCp008PrototypeId,
  type SapCp008TaskDirection,
} from "./runtime-v2";

export {
  SAP_CP008_CATALOGUE,
  SAP_CP008_INTERNAL,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
};
export type {
  SapCp008Difficulty,
  SapCp008Option,
  SapCp008Package,
  SapCp008PrototypeId,
  SapCp008TaskDirection,
};

function varyStandardPolicy(stem: string, seed: number): string {
  const match = stem.match(/^Round each indicated term to the (nearest ten|nearest hundred|nearest integer) first, then evaluate\.\s*(.*)$/);
  if (!match) return stem;
  const place = match[1]!;
  const rest = match[2]!;
  const templates = [
    `First round every displayed term to the ${place}; then evaluate.`,
    `Before evaluating, round every displayed term to the ${place}.`,
    `For this estimate, round every displayed term to the ${place} before doing the arithmetic.`,
    `Round all displayed terms to the ${place} before carrying out the operations.`,
  ];
  return `${templates[(seed - 1) % templates.length]} ${rest}`;
}

function stripWholeDecimal(text: string): string {
  return text.replace(/(-?\d+)\.0\b/g, "$1");
}

function optionWithValue(option: SapCp008Option, value: string): SapCp008Option {
  return Object.freeze({ ...option, value });
}

function editorialize(pkg: SapCp008Package): SapCp008Package {
  let stem = varyStandardPolicy(pkg.stem, pkg.seed);
  let canonicalAnswer = pkg.canonicalAnswer;
  let options = pkg.options;
  let explanation = pkg.explanation;
  const d = pkg.oracle.data;

  if (pkg.prototypeId === "SAP-CP008-PROT-DECIMAL-SUM" || pkg.prototypeId === "SAP-CP008-PROT-DECIMAL-DIFFERENCE") {
    canonicalAnswer = stripWholeDecimal(canonicalAnswer);
    options = Object.freeze(pkg.options.map((option) => optionWithValue(option, stripWholeDecimal(option.value))));
    explanation = Object.freeze({
      ...pkg.explanation,
      steps: Object.freeze(pkg.explanation.steps.map(stripWholeDecimal)),
      finalAnswer: stripWholeDecimal(pkg.explanation.finalAnswer),
      verification: Object.freeze(pkg.explanation.verification.map(stripWholeDecimal)),
    });
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-COMPATIBLE-ADDENDS") {
    const targetA = Number(d.targetA), targetB = Number(d.targetB), unit = Number(d.unit);
    const place = unit === 10 ? "nearest ten" : "nearest hundred";
    stem = `For a quick sum estimate, round ${d.a} and ${d.b} to the ${place} before adding. Which pair should replace the two numbers?`;
    canonicalAnswer = `${targetA} and ${targetB}`;
    options = Object.freeze(pkg.options.map((option) => {
      const pair = option.value.match(/^(-?\d+) \+ (-?\d+) =/);
      return optionWithValue(option, pair ? `${pair[1]} and ${pair[2]}` : option.value);
    }));
    explanation = Object.freeze({
      ...pkg.explanation,
      finalAnswer: `Therefore, replace the numbers by ${canonicalAnswer}.`,
    });
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT") {
    const multiple = Number(d.divisor) * 10;
    stem = `For estimation, first replace ${d.a} by its nearest multiple of ${multiple} and round ${d.b} to the nearest ten. Then estimate ${d.a} ÷ ${d.divisor} + ${d.b}.`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY") {
    const place = Number(d.unit) === 10 ? "nearest ten" : "nearest hundred";
    stem = `To estimate ${d.known} + □, round both terms to the ${place} first. If the estimated sum is ${d.target}, what is the rounded value of □?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY") {
    const place = Number(d.unit) === 10 ? "nearest ten" : "nearest hundred";
    stem = `To estimate ${d.known} − □, round both terms to the ${place} first. If the estimated difference is ${d.target}, what is the rounded value of □?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS") {
    const place = Number(d.unit) === 10 ? "nearest ten" : "nearest hundred";
    stem = `Two positive numbers, when rounded to the ${place}, become ${d.x} and ${d.y}. Which interval must contain their exact sum?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS") {
    const place = Number(d.unit) === 10 ? "nearest ten" : "nearest hundred";
    stem = `Two positive numbers, when rounded to the ${place}, become ${d.x} and ${d.y}. Which interval must contain the exact value of the first number minus the second?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-OVER-UNDER-CLASS") {
    stem = `Estimate ${d.a} + ${d.b} by rounding each addend to the nearest ten before adding. Compared with the exact sum, is this estimate an overestimate or an underestimate?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES") {
    stem = `Round every addend to the nearest ten before adding. Let A be the estimate of ${d.a} + ${d.b}, and B the estimate of ${d.c} + ${d.d}. Which relation is correct?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-DIAGNOSE-INVALID-ROUNDING-DIRECTION") {
    stem = `A student estimates ${d.a} + ${d.b} by first rounding each addend to the nearest ten, but writes ${d.wrongA} + ${d.rb} = ${d.wrongEstimate}. Which diagnosis is correct?`;
  }

  if (pkg.prototypeId === "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE") {
    const place = Number(d.unit) === 10 ? "nearest ten" : "nearest hundred";
    stem = `Round each term to the ${place} before evaluating ${d.a} + ${d.b} − ${d.c}. Which option is closest to the resulting estimate?`;
  }

  const data = Object.freeze({ ...d, editorialV3: 1 });
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Editorial options must remain four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Editorial surface must retain exactly one correct option.");
  if (options[correctIndex]?.value !== canonicalAnswer) errors.push("Editorial correct option is not answer-bound.");
  if (!/round|rounded/i.test(stem) || !/(first|before|when rounded)/i.test(stem)) errors.push("Editorial stem lost the explicit approximation-stage policy.");

  return Object.freeze({
    ...pkg,
    stem,
    canonicalAnswer,
    options,
    correctIndex,
    explanation,
    oracle: Object.freeze({ kind: pkg.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem, answer: canonicalAnswer, data }),
    generationIdentity: `${pkg.prototypeId}:v3:seed:${pkg.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp008(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  return editorialize(generateV2(prototypeId, seed));
}

export function generateSapCp008Sweep(seedsPerMode = 100): readonly SapCp008Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP008_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp008(prototypeId, index + 1))));
}
