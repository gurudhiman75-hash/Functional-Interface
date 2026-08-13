import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateExamV2,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./exam-runtime-v2";
import { generateSapCp009 as generateFinal } from "./final-runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

function formatTenths(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}${Math.floor(abs / 10)}.${abs % 10}`;
}

function decimalProduct(seed: number): SapCp009Package {
  const mode = 1;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const base = generateFinal(prototypeId, seed);
  const d = base.oracle.data;
  const a = formatTenths(Number(d.a10));
  const b = formatTenths(Number(d.b10));
  const ra = Number(d.ra10) / 10;
  const rb = Number(d.rb10) / 10;
  const stems = [
    `Round ${a} and ${b} to the nearest whole number and estimate their product.`,
    `Estimate ${a} × ${b} by rounding both numbers to the nearest whole number.`,
    `The approximate value of ${a} × ${b}, after rounding each number to the nearest whole number, is:`,
    `Using whole-number approximation, find the value of ${a} × ${b}.`,
  ] as const;
  const stem = stems[(seed - 1) % stems.length]!;
  const data = Object.freeze({ ...d, examEditorialVersion: 5 });
  return Object.freeze({
    ...base,
    stem,
    explanation: Object.freeze({
      coreConcept: "Round each decimal to the nearest whole number, then multiply.",
      steps: Object.freeze([`${a} → ${ra} and ${b} → ${rb}.`, `${ra} × ${rb} = ${base.canonicalAnswer}.`]),
      finalAnswer: base.explanation.finalAnswer,
      verification: Object.freeze(["Both decimals are rounded to the nearest whole number.", "The multiplication is done after rounding."]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: base.canonicalAnswer, data, examEditorial: "decimal-product-language" }),
    generationIdentity: `${prototypeId}:exam-v5:decimal-product-language:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[1]) return decimalProduct(seed);
  return generateExamV2(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
