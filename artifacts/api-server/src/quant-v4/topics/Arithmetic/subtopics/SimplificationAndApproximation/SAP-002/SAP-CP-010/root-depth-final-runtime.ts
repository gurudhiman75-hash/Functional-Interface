import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateDepth,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./root-depth-runtime";
import { math, rebuild, rootTex, wrong } from "./root-depth-foundation-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

function missingRadicand(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[12]!;
  const base = generateDepth(id, seed);
  const i = seed - 1;
  const k = 8 + (i % 50);
  const below = i >= 50;
  const far = k % 2 === 1;
  const square = k * k;
  const lowerBoundary = (k - 0.5) ** 2;
  const upperBoundary = (k + 0.5) ** 2;
  const span = below ? square - lowerBoundary : upperBoundary - square;
  const distance = Math.max(1, Math.floor(span * (far ? 0.82 : 0.38)));
  const n = below ? square - distance : square + distance;
  const answer = String(n);
  const side = below ? "below" : "above";
  const outside = below ? Math.floor(lowerBoundary) : Math.ceil(upperBoundary);

  return rebuild(base, {
    stem: `Which value ${side} ${square} has a square root nearest to ${k}?`,
    answer,
    wrongs: below
      ? [
          wrong(String(outside), "OUTSIDE_BAND", "This is just outside the range whose square root is nearest to the required integer."),
          wrong(String((k - 1) ** 2 + 1), "PREVIOUS_ROOT", "This value is nearer to the previous integer root."),
          wrong(String((k - 1) ** 2 - 2), "BELOW_PREVIOUS", "This value lies below the previous perfect square."),
        ]
      : [
          wrong(String(outside), "OUTSIDE_BAND", "This is just outside the range whose square root is nearest to the required integer."),
          wrong(String((k + 1) ** 2 - 1), "NEXT_ROOT", "This value is nearer to the next integer root."),
          wrong(String((k + 1) ** 2 + 2), "ABOVE_NEXT", "This value lies above the next perfect square."),
        ],
    data: { k, square, correctN: n, side: below ? "BELOW" : "ABOVE", depth: far ? "FAR" : "MID", targetIndex: i % 50 },
    concept: "Use the range of values whose square roots are nearest to the required integer.",
    steps: [
      `${math(`${k}^{2} = ${square}`)}, and ${n} is ${Math.abs(n - square)} ${side} it.`,
      `${math(rootTex(2, n))} remains within the nearest-integer range for ${k}.`,
    ],
    verification: ["The 100 states use 50 distinct target roots on both the above-square and below-square sides."],
    tag: "missing-radicand-50-by-2",
  });
}

export function generateSapCp010(id: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (id === SAP_CP010_PROTOTYPE_IDS[12]) return missingRadicand(seed);
  return generateDepth(id, seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((id) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(id, index + 1)),
  ));
}
