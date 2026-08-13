import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateExam,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./exam-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

function repack(
  base: SapCp010Package,
  stem: string,
  data: Readonly<Record<string, number | string>>,
  steps: readonly string[],
  verification: readonly string[],
  tag: string,
): SapCp010Package {
  const frozenData = Object.freeze({ ...data, finalRuntimeVersion: 3 });
  const studentText = `${stem} ${base.canonicalAnswer} ${base.options.map((o) => o.value).join(" ")} ${base.explanation.coreConcept} ${steps.join(" ")} ${verification.join(" ")}`;
  const errors: string[] = [];
  if (base.options.length !== 4 || new Set(base.options.map((o) => o.value)).size !== 4) errors.push("Four distinct options required.");
  if (base.options.filter((o) => o.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (base.options[base.correctIndex]?.value !== base.canonicalAnswer) errors.push("Correct option mismatch.");
  if (steps.length < 2 || steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  if (stem.length > 220) errors.push("Stem too long for exam presentation.");
  if (/oracle|runtime|prototype|canonical|internal|guard|machine policy|newton|taylor/i.test(studentText)) errors.push("Internal or unsupported wording leaked.");
  if (/-?\d+\.\d{6,}/.test(studentText)) errors.push("Long floating-point display leaked.");
  return Object.freeze({
    ...base,
    stem,
    explanation: Object.freeze({
      ...base.explanation,
      steps: Object.freeze([...steps]),
      verification: Object.freeze([...verification]),
    }),
    oracle: Object.freeze({ kind: base.prototypeId, data: frozenData }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem, answer: base.canonicalAnswer, data: frozenData, tag }),
    generationIdentity: `${base.prototypeId}:final-v3:${tag}:${base.seed}:${JSON.stringify(frozenData)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function safeNearSquare(root: number, seed: number, shift: number, block: number): number {
  const rawD = 1 + ((block + shift) % 5);
  const d = Math.min(rawD, Math.max(1, root - 1));
  return (seed + shift) % 2 === 0 ? root * root + d : root * root - d;
}

function nearestIntegerCbrt(seed: number): SapCp010Package {
  const mode = 4;
  const base = generateExam(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const k = 3 + ((seed - 1) % 10);
  const block = Math.floor((seed - 1) / 10);
  const d = 1 + block;
  const lowerCase = seed % 2 === 1;
  const n = lowerCase ? k ** 3 + d : (k + 1) ** 3 - d;
  const answer = lowerCase ? k : k + 1;
  return repack(
    base,
    `∛${n} is nearest to which integer?`,
    { n, k, answer, threshold8: (2 * k + 1) ** 3, scaledN: 8 * n, d },
    [
      `${k}³ = ${k ** 3} and ${k + 1}³ = ${(k + 1) ** 3}, so ∛${n} lies between ${k} and ${k + 1}.`,
      lowerCase ? `∛${n} < ${k}.5, so it is nearer to ${k}.` : `∛${n} > ${k}.5, so it is nearer to ${k + 1}.`,
    ],
    [`Compare 8 × ${n} = ${8 * n} with ${2 * k + 1}³ = ${(2 * k + 1) ** 3}.`],
    "nearest-cuberoot-safe-band",
  );
}

function rootProduct(seed: number): SapCp010Package {
  const mode = 9;
  const base = generateExam(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const r1 = 5 + ((seed - 1) % 20);
  const block = Math.floor((seed - 1) / 20);
  const r2 = 3 + block;
  const n1 = safeNearSquare(r1, seed, 0, block);
  const n2 = safeNearSquare(r2, seed, 1, block);
  return repack(
    base,
    `Estimate √${n1} × √${n2} by taking each square root to the nearest integer.`,
    { n1, n2, r1, r2, answer: r1 * r2, block },
    [`√${n1} ≈ ${r1} and √${n2} ≈ ${r2}.`, `${r1} × ${r2} = ${r1 * r2}.`],
    [`${r1}² = ${r1 ** 2}; ${r2}² = ${r2 ** 2}. Each radicand remains inside the nearest-integer band of its benchmark.`],
    "root-product-safe-band",
  );
}

function rootQuotient(seed: number): SapCp010Package {
  const mode = 10;
  const base = generateExam(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const divisorRoot = 3 + ((seed - 1) % 10);
  const block = Math.floor((seed - 1) / 10);
  const quotient = 2 + (block % 5);
  const numeratorRoot = divisorRoot * quotient;
  const n = safeNearSquare(numeratorRoot, seed, 0, block);
  const d = safeNearSquare(divisorRoot, seed, 1, block);
  const answer = String(quotient);
  const sameAnswer = base.canonicalAnswer === answer;
  if (!sameAnswer) {
    throw new Error(`CP010 quotient answer drift at seed ${seed}: ${base.canonicalAnswer} vs ${answer}`);
  }
  return repack(
    base,
    `Estimate √${n} ÷ √${d} by taking each square root to the nearest integer.`,
    { n, d, numeratorRoot, divisorRoot, quotient, block },
    [`√${n} ≈ ${numeratorRoot} and √${d} ≈ ${divisorRoot}.`, `${numeratorRoot} ÷ ${divisorRoot} = ${quotient}.`],
    ["Both radicands remain inside the certified nearest-integer bands, and the denominator root is non-zero."],
    "root-quotient-safe-band",
  );
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[4]) return nearestIntegerCbrt(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[9]) return rootProduct(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[10]) return rootQuotient(seed);
  return generateExam(prototypeId, seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
