import type { SapCp006Package, SapCp006PrototypeId } from "./runtime";
import { generateSapCp006Editorial as generateV2 } from "./editorial-runtime-v2";

function independentOrderingCorrectIndex(seed: number): number {
  // The base ordering generator uses seed % 4 (plus parity) to choose the
  // mathematical permutation. Answer placement must not reuse that same state.
  // Cycling by four-seed blocks gives an independent, deterministic A/B/C/D
  // distribution: exactly 100 placements in each position over seeds 1..400.
  return Math.floor((seed - 1) / 4) % 4;
}

function decoupleOrderingOptionPlacement(pkg: SapCp006Package, seed: number): SapCp006Package {
  const targetIndex = independentOrderingCorrectIndex(seed);
  const correct = pkg.options.find((option) => option.isCorrect);
  if (!correct) throw new Error("CP-006 ordering package has no correct option.");
  const wrong = pkg.options.filter((option) => !option.isCorrect);
  if (wrong.length !== 3) throw new Error("CP-006 ordering package must contain exactly three distractors.");

  const options = [...wrong];
  options.splice(targetIndex, 0, correct);

  return Object.freeze({
    ...pkg,
    options: Object.freeze(options),
    correctIndex: targetIndex,
    generationIdentity: `${pkg.generationIdentity}:DECOUPLED-OPTION-POSITION-${targetIndex}`,
  });
}

export function generateSapCp006Editorial(
  prototypeId: SapCp006PrototypeId,
  seed: number,
): SapCp006Package {
  const base = generateV2(prototypeId, seed);
  if (prototypeId !== "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS") return base;

  const pkg = decoupleOrderingOptionPlacement(base, seed);
  if (seed % 2 === 0) return pkg;

  const d = pkg.oracle.data;
  const dPercent = d.dVal! - 10;
  const stem = [
    "The following small table gives four exact values:",
    `A | ${d.aVal}/100`,
    `B | ${d.bVal}%`,
    `C | ${Math.floor(d.cVal! / 100)}.${String(d.cVal! % 100).padStart(2, "0")}`,
    `D | ${dPercent}% + 0.10`,
    "Arrange A, B, C and D in increasing order.",
  ].join("\n");

  return Object.freeze({
    ...pkg,
    stem,
    oracle: Object.freeze({
      ...pkg.oracle,
      data: Object.freeze({ ...d, tableWrapper: 1 }),
    }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: pkg.canonicalAnswer, data: { ...d, tableWrapper: 1 } }),
    generationIdentity: `${pkg.generationIdentity}:TABLE-WRAPPER`,
  });
}
