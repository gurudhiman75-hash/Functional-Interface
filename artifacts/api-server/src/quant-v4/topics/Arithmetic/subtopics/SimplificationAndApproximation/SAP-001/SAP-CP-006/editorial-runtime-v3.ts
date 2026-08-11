import type { SapCp006Package, SapCp006PrototypeId } from "./runtime";
import { generateSapCp006Editorial as generateV2 } from "./editorial-runtime-v2";

export function generateSapCp006Editorial(
  prototypeId: SapCp006PrototypeId,
  seed: number,
): SapCp006Package {
  const pkg = generateV2(prototypeId, seed);
  if (prototypeId !== "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS" || seed % 2 === 0) return pkg;

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
