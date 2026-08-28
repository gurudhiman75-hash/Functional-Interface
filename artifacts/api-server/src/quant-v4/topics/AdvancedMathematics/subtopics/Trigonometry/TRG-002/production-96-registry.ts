import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { TRG_002_PRODUCTION_CP007_EXPANSION_IDS } from "./production-cp007-expansion";
import { TRG_002_PRODUCTION_CP008_EXPANSION_IDS } from "./production-cp008-expansion";
import { TRG_002_PRODUCTION_CP009_EXPANSION_IDS } from "./production-cp009-expansion";
import { TRG_002_PRODUCTION_CP010_EXPANSION_IDS } from "./production-cp010-expansion";

export type Trg002ProductionCpId = "TRG-CP-007" | "TRG-CP-008" | "TRG-CP-009" | "TRG-CP-010";

function id(number: number) {
  return `TRG-002-QL-${String(number).padStart(3, "0")}`;
}

export const TRG_002_PRODUCTION_96_IDS = Array.from({ length: 96 }, (_, index) => id(index + 1));
export type Trg002Production96Id = string;

export const TRG_002_PRODUCTION_EXPANSION_48_IDS = [
  ...TRG_002_PRODUCTION_CP007_EXPANSION_IDS,
  ...TRG_002_PRODUCTION_CP008_EXPANSION_IDS,
  ...TRG_002_PRODUCTION_CP009_EXPANSION_IDS,
  ...TRG_002_PRODUCTION_CP010_EXPANSION_IDS,
] as const;

export const TRG_002_FROZEN_MVP_48_ID_SET = new Set<string>(TRG_002_MVP_48_IDS);
export const TRG_002_PRODUCTION_EXPANSION_48_ID_SET = new Set<string>(TRG_002_PRODUCTION_EXPANSION_48_IDS);

export function trg002ProductionCpForId(qlId: string): Trg002ProductionCpId {
  const match = /^TRG-002-QL-(\d{3})$/.exec(qlId);
  if (!match) throw new Error(`Invalid TRG-002 production QL id ${qlId}.`);
  const n = Number(match[1]);
  if (n >= 1 && n <= 24) return "TRG-CP-007";
  if (n >= 25 && n <= 48) return "TRG-CP-008";
  if (n >= 49 && n <= 72) return "TRG-CP-009";
  if (n >= 73 && n <= 96) return "TRG-CP-010";
  throw new Error(`TRG-002 production QL number outside 001...096: ${qlId}.`);
}

export function assertTrg002ProductionRegistry() {
  if (TRG_002_PRODUCTION_96_IDS.length !== 96) throw new Error("TRG-002 production registry must contain 96 IDs.");
  if (new Set(TRG_002_PRODUCTION_96_IDS).size !== 96) throw new Error("TRG-002 production registry contains duplicate IDs.");
  if (TRG_002_FROZEN_MVP_48_ID_SET.size !== 48) throw new Error("TRG-002 frozen MVP set must contain 48 IDs.");
  if (TRG_002_PRODUCTION_EXPANSION_48_ID_SET.size !== 48) throw new Error("TRG-002 production expansion set must contain 48 IDs.");
  for (const qlId of TRG_002_PRODUCTION_96_IDS) {
    const inFrozen = TRG_002_FROZEN_MVP_48_ID_SET.has(qlId);
    const inExpansion = TRG_002_PRODUCTION_EXPANSION_48_ID_SET.has(qlId);
    if (inFrozen === inExpansion) throw new Error(`${qlId}: must belong to exactly one of frozen-48 or expansion-48.`);
  }
  const counts = new Map<Trg002ProductionCpId, number>();
  for (const qlId of TRG_002_PRODUCTION_96_IDS) {
    const cp = trg002ProductionCpForId(qlId);
    counts.set(cp, (counts.get(cp) ?? 0) + 1);
  }
  for (const cp of ["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"] as const) {
    if (counts.get(cp) !== 24) throw new Error(`${cp}: expected 24 production QLs, found ${counts.get(cp) ?? 0}.`);
  }
  return { production: 96, frozen: 48, expansion: 48, perCp: 24 } as const;
}
