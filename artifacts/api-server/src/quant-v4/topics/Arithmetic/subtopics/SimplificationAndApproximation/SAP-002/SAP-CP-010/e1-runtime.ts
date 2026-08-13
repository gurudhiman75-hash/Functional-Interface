import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateV6,
  type SapCp010Option,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./root-depth-final-runtime";
import {
  SAP_E1_INACTIVE_LIFECYCLE,
  sapE1BaseValidation,
  sapE1Math,
  sapE1Options,
  type SapE1CandidatePackage,
} from "../../SAP-E1-CANDIDATE-TYPES";

export { SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

function repositionPowerNearest(base: SapCp010Package, seed: number, sourceSeed: number): SapCp010Package {
  const correct = base.options.find((o) => o.isCorrect);
  if (!correct) throw new Error("Power-nearest source has no correct option.");
  const wrongs = base.options.filter((o) => !o.isCorrect);
  const correctIndex = (seed - 1) % 4;
  const options: SapCp010Option[] = [];
  let wi = 0;
  for (let pos = 0; pos < 4; pos += 1) {
    if (pos === correctIndex) options.push(Object.freeze({ ...correct }));
    else options.push(Object.freeze({ ...wrongs[wi++]! }));
  }
  const data = Object.freeze({ ...base.oracle.data, e1NearestMerge: "POWER_ONLY", sourceSeed });
  const errors = [...base.validation.errors];
  if (String(base.oracle.data.kind) === "ROOT") errors.push("Duplicate ROOT branch remained in the generic nearest-option identity.");
  if (options[correctIndex]?.value !== base.canonicalAnswer) errors.push("E1 power-only nearest option lost answer binding.");
  return Object.freeze({
    ...base,
    seed,
    correctIndex,
    options: Object.freeze(options),
    oracle: Object.freeze({ kind: base.oracle.kind, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, seed, sourceSeed, stem: base.stem, answer: base.canonicalAnswer, data, e1: "POWER_ONLY_NEAREST_OPTION" }),
    generationIdentity: `${base.prototypeId}:E1:POWER-ONLY-NEAREST:${seed}:${sourceSeed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp010E1Existing(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (prototypeId !== SAP_CP010_PROTOTYPE_IDS[14]) return generateV6(prototypeId, seed);
  const sourceSeed = seed * 2;
  return repositionPowerNearest(generateV6(prototypeId, sourceSeed), seed, sourceSeed);
}

export const SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID = "SAP-CP010-E1-CAND-SUPPLIED-ROOT-SCALING" as const;

const SUPPLIED_ROOTS = Object.freeze([
  { n: 2, hundredths: 141 },
  { n: 3, hundredths: 173 },
  { n: 5, hundredths: 224 },
  { n: 6, hundredths: 245 },
  { n: 7, hundredths: 265 },
  { n: 10, hundredths: 316 },
  { n: 11, hundredths: 332 },
  { n: 15, hundredths: 387 },
] as const);

function formatScaled(value: number, scale: number): string {
  const digits = String(Math.abs(value)).padStart(scale + 1, "0");
  const sign = value < 0 ? "-" : "";
  if (scale === 0) return `${sign}${digits}`;
  return `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function roundedHundredthsFromThousandths(value: number): number {
  const wholeHundredths = Math.floor(value / 10);
  return wholeHundredths + (value % 10 >= 5 ? 1 : 0);
}

function decimalScaleAnswer(hundredths: number, factor: number): string {
  return formatScaled(roundedHundredthsFromThousandths(hundredths * factor), 2);
}

export function generateSapCp010E1SuppliedRootScaling(seed: number): SapE1CandidatePackage {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const i = seed - 1;
  const supplied = SUPPLIED_ROOTS[i % SUPPLIED_ROOTS.length]!;
  const factor = 2 + Math.floor(i / SUPPLIED_ROOTS.length);
  const decimalScale = i % 2 === 1;
  const suppliedValue = formatScaled(supplied.hundredths, 2);
  const target = decimalScale
    ? formatScaled(supplied.n * factor * factor, 2)
    : String(supplied.n * factor * factor);
  const answer = decimalScale
    ? decimalScaleAnswer(supplied.hundredths, factor)
    : formatScaled(supplied.hundredths * factor, 2);
  const correctIndex = i % 4;
  const wrongs = decimalScale
    ? [
        { value: suppliedValue, misconceptionId: "SCALING_FACTOR_IGNORED", analysis: "The supplied square-root value is copied directly and the exact scale factor is ignored." },
        { value: formatScaled(supplied.hundredths * factor, 2), misconceptionId: "DECIMAL_SCALE_TEN_TIMES_HIGH", analysis: "The square factor is recognised, but the extra division by 10 in the root scale is missed." },
        { value: decimalScaleAnswer(supplied.hundredths, factor + 1), misconceptionId: "SCALE_FACTOR_ONE_HIGH", analysis: "The correct scaling method is used with a factor one unit larger than the one implied by the number." },
      ]
    : [
        { value: suppliedValue, misconceptionId: "SCALING_FACTOR_IGNORED", analysis: "The supplied square-root value is copied directly without multiplying by the extracted square factor." },
        { value: formatScaled(supplied.hundredths * (factor - 1), 2), misconceptionId: "SCALE_FACTOR_ONE_LOW", analysis: "The supplied root is multiplied by a scale factor one unit too low." },
        { value: formatScaled(supplied.hundredths * (factor + 1), 2), misconceptionId: "SCALE_FACTOR_ONE_HIGH", analysis: "The supplied root is multiplied by a scale factor one unit too high." },
      ];
  const options = sapE1Options(answer, wrongs, correctIndex);
  const rootN = `\\sqrt{${supplied.n}}`;
  const rootTarget = `\\sqrt{${target}}`;
  const relation = decimalScale
    ? `${target} = ${sapE1Math(`(\\frac{${factor}}{10})^2 \\times ${supplied.n}`)}`
    : `${target} = ${factor}^2 × ${supplied.n}`;
  const scaleText = decimalScale ? `${factor}/10` : String(factor);
  const multiplication = decimalScale
    ? `${factor}/10 × ${suppliedValue} ≈ ${answer}`
    : `${factor} × ${suppliedValue} = ${answer}`;
  const stem = `Given ${sapE1Math(`${rootN} \\approx ${suppliedValue}`)}, estimate ${sapE1Math(rootTarget)} to 2 decimal places.`;
  const steps = Object.freeze([
    `${relation}, so ${sapE1Math(`${rootTarget} = ${scaleText}${rootN}`)}.`,
    `Using the supplied value, ${multiplication}.`,
  ]);
  const errors = [...sapE1BaseValidation({ stem, answer, options, correctIndex, steps })];
  if (factor < 2 || factor > 14) errors.push("Supplied-root scaling factor is outside the bounded E1 range.");
  const data = Object.freeze({ n: supplied.n, suppliedHundredths: supplied.hundredths, factor, scaleMode: decimalScale ? "TENTH_FACTOR" : "INTEGER_FACTOR", target });
  return Object.freeze({
    packageId: "SAP-002",
    checkpointId: "SAP-CP-010",
    candidateId: SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID,
    candidateStatus: "E1_PROVISIONAL_UNALLOCATED",
    sourceDisposition: "E1_ADD_SUPPLIED_ROOT_SCALING",
    seed,
    locale: "en-IN",
    difficulty: decimalScale ? "MEDIUM" : "EASY",
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Extract an exact square scale from the new number, then reuse the square-root value supplied in the question.",
      steps,
      finalAnswer: `Therefore, the estimate is ${answer}.`,
      verification: Object.freeze([`The scale relationship is exact; only the supplied root value is approximate.`]),
    }),
    oracle: Object.freeze({ kind: "SUPPLIED_ROOT_SCALING", data }),
    canonicalPayloadKey: JSON.stringify({ candidateId: SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID, seed, data, answer }),
    generationIdentity: `${SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID}:${seed}:${supplied.n}:${factor}:${decimalScale ? 1 : 0}`,
    lifecycle: SAP_E1_INACTIVE_LIFECYCLE,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}
