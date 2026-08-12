import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateV1,
  type SapCp009Option,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

const LIFECYCLE: SapCp009Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function roundIntegerToUnit(value: number, unit: number): number {
  const q = Math.floor(value / unit);
  const r = value % unit;
  return (r * 2 >= unit ? q + 1 : q) * unit;
}

function position(seed: number, modeIndex: number): number {
  return ((seed - 1) + modeIndex) % 4;
}

function option(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function options(answer: string, seed: number, modeIndex: number, distractors: readonly SapCp009Option[]): readonly SapCp009Option[] {
  const unique = distractors.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: v2 still has fewer than three distinct distractors.`);
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct estimate." });
  const result = [...unique.slice(0, 3)];
  result.splice(position(seed, modeIndex), 0, correct);
  return Object.freeze(result);
}

function pack(
  prototypeId: SapCp009PrototypeId,
  seed: number,
  generated: {
    stem: string;
    answer: string;
    options: readonly SapCp009Option[];
    data: Readonly<Record<string, number | string>>;
    concept: string;
    steps: readonly string[];
    verification: readonly string[];
  },
): SapCp009Package {
  const modeIndex = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  const meta = SAP_CP009_CATALOGUE[modeIndex]!;
  const correctIndex = generated.options.findIndex((item) => item.isCorrect);
  const errors: string[] = [];
  if (generated.options.length !== 4 || new Set(generated.options.map((item) => item.value)).size !== 4) errors.push("Four distinct options required.");
  if (generated.options.filter((item) => item.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (generated.options[correctIndex]?.value !== generated.answer) errors.push("Correct option mismatch.");
  if (generated.steps.length < 2 || generated.steps.length > 3) errors.push("Student explanation must use 2-3 steps.");
  return Object.freeze({
    checkpointId: "SAP-CP-009",
    prototypeId,
    proposedPermanentQlId: meta.proposedPermanentQlId,
    seed,
    difficulty: meta.difficulty,
    taskDirection: meta.taskDirection,
    policy: SAP_CP009_POLICY,
    stem: generated.stem,
    canonicalAnswer: generated.answer,
    options: generated.options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: generated.concept,
      steps: Object.freeze(generated.steps),
      finalAnswer: `Answer: ${generated.answer}.`,
      verification: Object.freeze(generated.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data: generated.data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: generated.stem, answer: generated.answer, data: generated.data, runtime: "v2" }),
    generationIdentity: `${prototypeId}:v2:${seed}:${JSON.stringify(generated.data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}

function productState(seed: number): { a: number; b: number; ra: number; rb: number } {
  const a = 121 + seed * 37 + (seed % 7);
  const b = 83 + seed * 23 + ((seed * 3) % 9);
  return { a, b, ra: roundIntegerToUnit(a, 10), rb: roundIntegerToUnit(b, 10) };
}

function productPolicy(seed: number): string {
  return [
    "Round both factors to the nearest ten and estimate",
    "Estimate after rounding each factor to the nearest ten:",
    "Using nearest-ten values, estimate",
    "For a quick estimate, round both factors to the nearest ten and find",
  ][(seed - 1) % 4]!;
}

function generateRoundedProduct(seed: number): SapCp009Package {
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[0]!;
  const s = productState(seed);
  const answer = s.ra * s.rb;
  const candidates = [
    option(String((s.ra + 10) * s.rb), "FIRST_FACTOR_ROUNDED_HIGH", "The first rounded factor was taken one ten too high."),
    option(String(s.ra * (s.rb + 10)), "SECOND_FACTOR_ROUNDED_HIGH", "The second rounded factor was taken one ten too high."),
    option(String(Math.max(10, s.ra - 10) * s.rb), "FIRST_FACTOR_ROUNDED_LOW", "The first rounded factor was taken one ten too low."),
    option(String(s.ra * Math.max(10, s.rb - 10)), "SECOND_FACTOR_ROUNDED_LOW", "The second rounded factor was taken one ten too low."),
    option(String((s.ra + 20) * s.rb), "FIRST_FACTOR_TWO_TENS_HIGH", "The first factor was rounded two tens too high."),
    option(String(s.ra * (s.rb + 20)), "SECOND_FACTOR_TWO_TENS_HIGH", "The second factor was rounded two tens too high."),
  ];
  return pack(prototypeId, seed, {
    stem: `${productPolicy(seed)} ${s.a} × ${s.b}.`,
    answer: String(answer),
    options: options(String(answer), seed, 0, candidates),
    data: Object.freeze({ ...s, answer }),
    concept: "Round both factors first, then multiply the rounded values.",
    steps: [`${s.a} → ${s.ra} and ${s.b} → ${s.rb}.`, `${s.ra} × ${s.rb} = ${answer}.`],
    verification: ["Both factors use nearest-ten rounding.", "The product is found after rounding."],
  });
}

function generateCompatibleQuotient(seed: number): SapCp009Package {
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[2]!;
  const quotient = 5 + ((seed - 1) % 16);
  const divisorRounded = [20, 30, 40, 50][(seed - 1) % 4]!;
  const dividendRounded = quotient * divisorRounded;
  const divisor = divisorRounded + [-4, -2, 2, 4][seed % 4]!;
  const dividend = dividendRounded + [-4, -2, 2, 4][(seed + 1) % 4]!;
  const candidates = [
    option(String(quotient + 1), "QUOTIENT_HIGH", "The compatible quotient was taken one too high."),
    option(String(Math.max(1, quotient - 1)), "QUOTIENT_LOW", "The compatible quotient was taken one too low."),
    option(String(quotient * 10), "PLACE_VALUE_ERROR", "An extra factor of ten was introduced."),
    option(String(quotient + 2), "QUOTIENT_TWO_HIGH", "The quotient was increased by two without reason."),
  ];
  return pack(prototypeId, seed, {
    stem: `Round ${dividend} and ${divisor} to the nearest ten. Using the rounded values, estimate ${dividend} ÷ ${divisor}.`,
    answer: String(quotient),
    options: options(String(quotient), seed, 2, candidates),
    data: Object.freeze({ dividend, divisor, dividendRounded, divisorRounded, answer: quotient }),
    concept: "Use nearby compatible numbers so the division becomes exact and quick.",
    steps: [`${dividend} → ${dividendRounded} and ${divisor} → ${divisorRounded}.`, `${dividendRounded} ÷ ${divisorRounded} = ${quotient}.`],
    verification: ["The rounded divisor is non-zero.", "Both originals round to the compatible values shown."],
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[0]) return generateRoundedProduct(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[2]) return generateCompatibleQuotient(seed);
  return generateV1(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
