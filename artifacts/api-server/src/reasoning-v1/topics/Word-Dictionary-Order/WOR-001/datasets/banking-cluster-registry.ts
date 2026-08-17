import type { WorDifficulty } from "../foundation/types";

export interface WorBankingClusterFamily {
  readonly id: string;
  readonly tier: WorDifficulty;
  readonly clusters: readonly string[];
}

const SAFE = [..."BCDEFGHIJKLMNOPQRSTUVWXY"];
const globallyUsed = new Set<string>();

function uniqueToken(first: string, second: string, preferredThirdIndex: number): string {
  for (let offset = 0; offset < SAFE.length; offset += 1) {
    const third = SAFE[(preferredThirdIndex + offset) % SAFE.length]!;
    const token = `${first}${second}${third}`;
    if (!globallyUsed.has(token)) {
      globallyUsed.add(token);
      return token;
    }
  }
  throw new Error(`WOR Banking registry exhausted ${first}${second} third-letter space.`);
}

function easyFamily(index: number): WorBankingClusterFamily {
  const clusters = Array.from({ length: 12 }, (_, item) => {
    const first = SAFE[item]!;
    const second = SAFE[(index + item * 3) % SAFE.length]!;
    return uniqueToken(first, second, index * 7 + item * 5 + 1);
  });
  return { id: `BANK-EASY-${String(index + 1).padStart(2, "0")}`, tier: "EASY", clusters };
}

function mediumFamily(index: number): WorBankingClusterFamily {
  const clusters = Array.from({ length: 12 }, (_, item) => {
    const group = Math.floor(item / 3);
    const first = SAFE[(index * 4 + group) % SAFE.length]!;
    const second = SAFE[(index * 7 + item) % SAFE.length]!;
    return uniqueToken(first, second, index * 11 + item * 5);
  });
  return { id: `BANK-MEDIUM-${String(index + 1).padStart(2, "0")}`, tier: "MEDIUM", clusters };
}

function hardFamily(index: number): WorBankingClusterFamily {
  const first = SAFE[(index + 12) % SAFE.length]!;
  const clusters = Array.from({ length: 12 }, (_, item) => {
    const group = Math.floor(item / 4);
    const second = SAFE[(index * 3 + group) % SAFE.length]!;
    return uniqueToken(first, second, index * 5 + item * 2 + 1);
  });
  return { id: `BANK-HARD-${String(index + 1).padStart(2, "0")}`, tier: "HARD", clusters };
}

export const WOR_BANKING_CLUSTER_FAMILIES: readonly WorBankingClusterFamily[] = [
  ...Array.from({ length: 20 }, (_, index) => easyFamily(index)),
  ...Array.from({ length: 20 }, (_, index) => mediumFamily(index)),
  ...Array.from({ length: 20 }, (_, index) => hardFamily(index)),
];

const allClusters = WOR_BANKING_CLUSTER_FAMILIES.flatMap((family) => family.clusters);
if (WOR_BANKING_CLUSTER_FAMILIES.length !== 60) throw new Error("WOR Banking reservoir must contain 60 families.");
if (allClusters.length !== 720) throw new Error("WOR Banking reservoir must contain 720 clusters.");
if (new Set(allClusters).size !== allClusters.length) throw new Error("WOR Banking reservoir contains duplicate clusters.");
if (allClusters.some((token) => !/^[B-Y]{3}$/.test(token))) throw new Error("WOR Banking reservoir contains a non shift-safe token.");

export function bankingClusterFamiliesForDifficulty(difficulty: WorDifficulty): readonly WorBankingClusterFamily[] {
  return WOR_BANKING_CLUSTER_FAMILIES.filter((family) => family.tier === difficulty);
}
