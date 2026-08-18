import {
  formatRational,
  rational,
  solveLinearSystem3V,
  verifyLinearSystem3VSolution,
  type LinearSystem3V,
} from "../../../../../../shared/algebra";
import { generateAlgCp007DiscoveryItem as generateLegacyAlgCp007DiscoveryItem } from "./generator";
import type { AlgCp007DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function pickInt(seed: number, min: number, max: number, salt: number): number {
  return min + (mixSeed(seed ^ (salt * 0x9e3779b9)) % (max - min + 1));
}

const MATRICES = [
  [[1, 1, 1], [1, 1, -1], [1, -1, 1]],
  [[2, 3, -5], [1, 3, -2], [2, 1, -3]],
  [[5, -3, 7], [3, -5, -2], [2, -2, 5]],
  [[1, 2, 3], [2, -1, 1], [3, 1, -2]],
] as const;

function term(coefficient: number, variable: string, first: boolean): string {
  if (coefficient === 0) return "";
  const abs = Math.abs(coefficient);
  const magnitude = abs === 1 ? variable : `${abs}${variable}`;
  if (first) return coefficient < 0 ? `-${magnitude}` : magnitude;
  return ` ${coefficient < 0 ? "-" : "+"} ${magnitude}`;
}

function rowText(row: readonly [number, number, number], d: number): string {
  const x = term(row[0], "x", true);
  const y = term(row[1], "y", x.length === 0);
  const z = term(row[2], "z", x.length === 0 && y.length === 0);
  return `${x}${y}${z} = ${d}`;
}

function reducedRowText(yCoefficient: number, zCoefficient: number, rhs: number): string {
  const y = term(yCoefficient, "y", true);
  const z = term(zCoefficient, "z", y.length === 0);
  return `${y}${z} = ${rhs}`;
}

function backSubstitutionText(row: readonly [number, number, number], y: string, z: string, rhs: number): string {
  const xPart = term(row[0], "x", true);
  const yPart = row[1] === 0 ? "" : ` ${row[1] < 0 ? "-" : "+"} ${Math.abs(row[1]) === 1 ? `(${y})` : `${Math.abs(row[1])}(${y})`}`;
  const zPart = row[2] === 0 ? "" : ` ${row[2] < 0 ? "-" : "+"} ${Math.abs(row[2]) === 1 ? `(${z})` : `${Math.abs(row[2])}(${z})`}`;
  return `${xPart}${yPart}${zPart} = ${rhs}`;
}

function buildThreeByThree(seed: number): AlgCp007DiscoveryItem {
  const matrix = MATRICES[mixSeed(seed ^ 0x7008) % MATRICES.length]!;
  const x = pickInt(seed, -8, 8, 1);
  const y = pickInt(seed, -8, 8, 2);
  const z = pickInt(seed, -8, 8, 3);
  const constants = matrix.map(([a, b, c]) => a * x + b * y + c * z) as [number, number, number];
  const system: LinearSystem3V = {
    a1: rational(matrix[0][0]), b1: rational(matrix[0][1]), c1: rational(matrix[0][2]), d1: rational(constants[0]),
    a2: rational(matrix[1][0]), b2: rational(matrix[1][1]), c2: rational(matrix[1][2]), d2: rational(constants[1]),
    a3: rational(matrix[2][0]), b3: rational(matrix[2][1]), c3: rational(matrix[2][2]), d3: rational(constants[2]),
  };
  const solved = solveLinearSystem3V(system);
  if (solved.kind !== "UNIQUE") throw new Error("CP-007 3x3 matrix library must remain nonsingular");
  if (!verifyLinearSystem3VSolution(system, solved.x, solved.y, solved.z)) throw new Error("CP-007 3x3 solution failed substitution verification");

  const [r1, r2, r3] = matrix;
  const [d1, d2, d3] = constants;
  const reduced1 = {
    y: r1[0] * r2[1] - r2[0] * r1[1],
    z: r1[0] * r2[2] - r2[0] * r1[2],
    d: r1[0] * d2 - r2[0] * d1,
  };
  const reduced2 = {
    y: r1[0] * r3[1] - r3[0] * r1[1],
    z: r1[0] * r3[2] - r3[0] * r1[2],
    d: r1[0] * d3 - r3[0] * d1,
  };
  const yText = formatRational(solved.y);
  const zText = formatRational(solved.z);
  const xText = formatRational(solved.x);

  return {
    cpId: "ALG-CP-007",
    candidateId: "ALG-CP007-CAND-008",
    solveMode: "solveThreeByThreeSystem",
    seed,
    stem: `Solve the system: ${rowText(matrix[0], constants[0])}; ${rowText(matrix[1], constants[1])}; ${rowText(matrix[2], constants[2])}.`,
    system,
    answer: { kind: "ORDERED_TRIPLE", x: solved.x, y: solved.y, z: solved.z },
    explanation: `Call the three equations E1, E2 and E3. Eliminate x from E1 and E2 to get ${reducedRowText(reduced1.y, reduced1.z, reduced1.d)}. Eliminate x from E1 and E3 to get ${reducedRowText(reduced2.y, reduced2.z, reduced2.d)}. Solving these two equations gives y = ${yText} and z = ${zText}. Substitute these in E1: ${backSubstitutionText(r1, yText, zText, d1)}. This gives x = ${xText}. Therefore (x, y, z) = (${xText}, ${yText}, ${zText}); substitution satisfies all three original equations.`,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp007DiscoveryItem(candidateId: string, seed: number): AlgCp007DiscoveryItem {
  if (candidateId === "ALG-CP007-CAND-008") return buildThreeByThree(seed);
  return generateLegacyAlgCp007DiscoveryItem(candidateId, seed);
}
