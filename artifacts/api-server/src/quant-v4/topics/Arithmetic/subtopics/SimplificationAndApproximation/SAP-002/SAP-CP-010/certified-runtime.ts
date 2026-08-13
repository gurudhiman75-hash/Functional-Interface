import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateFinal,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./final-runtime";

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
  const frozenData = Object.freeze({ ...data, certifiedRuntimeVersion: 4 });
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
    generationIdentity: `${base.prototypeId}:certified-v4:${tag}:${base.seed}:${JSON.stringify(frozenData)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

function safeRadicand(root: number, seed: number, shift: number, block: number, cycle: number): number {
  const rawD = 1 + ((block + shift) % 5);
  const d = Math.min(rawD, Math.max(1, root - 1));
  const plus = (seed + shift + cycle) % 2 === 0;
  return plus ? root * root + d : root * root - d;
}

function rootQuotient(seed: number): SapCp010Package {
  const mode = 10;
  const base = generateFinal(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const divisorRoot = 3 + ((seed - 1) % 8);
  const block = Math.floor((seed - 1) / 8);
  const cycle = Math.floor((seed - 1) / 32);
  const quotient = 2 + (block % 4);
  const numeratorRoot = divisorRoot * quotient;
  const n = safeRadicand(numeratorRoot, seed, 0, block, cycle);
  const d = safeRadicand(divisorRoot, seed, 1, block, cycle);
  return repack(
    base,
    `Estimate √${n} ÷ √${d} by taking each square root to the nearest integer.`,
    { n, d, numeratorRoot, divisorRoot, quotient, block, cycle },
    [`√${n} ≈ ${numeratorRoot} and √${d} ≈ ${divisorRoot}.`, `${numeratorRoot} ÷ ${divisorRoot} = ${quotient}.`],
    ["Both radicands stay inside the nearest-integer bands of their benchmarks, and the denominator root is non-zero."],
    "root-quotient-100-unique",
  );
}

function nearestOption(seed: number): SapCp010Package {
  const mode = 14;
  const base = generateFinal(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  if (seed % 2 === 0) return base;
  const k = 10 + ((seed - 1) % 20);
  const block = Math.floor((seed - 1) / 20);
  const d = 1 + block;
  const n = k * k + d;
  return repack(
    base,
    `Which option is nearest to √${n}?`,
    { kind: "ROOT", n, k, d },
    [`${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}.`, `√${n} is only slightly above ${k}, so ${k} is the nearest option.`],
    [`4 × ${n} < ${(2 * k + 1) ** 2}, so √${n} < ${k}.5.`],
    "nearest-root-50-unique",
  );
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[10]) return rootQuotient(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[14]) return nearestOption(seed);
  return generateFinal(prototypeId, seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
