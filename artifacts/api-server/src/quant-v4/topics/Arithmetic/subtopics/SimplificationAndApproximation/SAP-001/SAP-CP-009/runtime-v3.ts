import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateV2,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./runtime-v2";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

function compatibleQuotient(seed: number): SapCp009Package {
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[2]!;
  const base = generateV2(prototypeId, seed);
  const quotient = 5 + ((seed - 1) % 16);
  const block = Math.floor((seed - 1) / 16);
  const divisorRounded = [20, 30, 40, 50][(seed - 1) % 4]! + block * 40;
  const dividendRounded = quotient * divisorRounded;
  const divisor = divisorRounded + [-4, -2, 2, 4][seed % 4]!;
  const dividend = dividendRounded + [-4, -2, 2, 4][(seed + 1) % 4]!;
  const data = Object.freeze({ dividend, divisor, dividendRounded, divisorRounded, answer: quotient, stateBlock: block });
  const stem = `Round ${dividend} and ${divisor} to the nearest ten. Using the rounded values, estimate ${dividend} ÷ ${divisor}.`;
  const explanation = Object.freeze({
    coreConcept: "Use nearby compatible numbers so the division becomes exact and quick.",
    steps: Object.freeze([
      `${dividend} → ${dividendRounded} and ${divisor} → ${divisorRounded}.`,
      `${dividendRounded} ÷ ${divisorRounded} = ${quotient}.`,
    ]),
    finalAnswer: `Answer: ${quotient}.`,
    verification: Object.freeze([
      "The rounded divisor is non-zero.",
      "Both originals round to the compatible values shown.",
    ]),
  });
  return Object.freeze({
    ...base,
    stem,
    explanation,
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: String(quotient), data, runtime: "v3" }),
    generationIdentity: `${prototypeId}:v3:${seed}:${JSON.stringify(data)}`,
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[2]) return compatibleQuotient(seed);
  return generateV2(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
