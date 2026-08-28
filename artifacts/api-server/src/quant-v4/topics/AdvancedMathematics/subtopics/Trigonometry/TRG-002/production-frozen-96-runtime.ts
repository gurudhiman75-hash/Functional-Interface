import type { Trg002Mvp48Id } from "./mvp-48-registry";
import { generateHumanApprovedTrg002Mvp48Question } from "./mvp-human-approved-runtime";
import {
  TRG_002_FROZEN_MVP_48_ID_SET,
  TRG_002_PRODUCTION_96_IDS,
  TRG_002_PRODUCTION_EXPANSION_48_ID_SET,
  type Trg002Production96Id,
} from "./production-96-registry";
import {
  generateHumanApprovedTrg002Phase8ExpansionQuestion,
} from "./phase8-human-approved-runtime";
import type { Trg002ProductionExpansion48Id } from "./production-final-editorial-runtime";

export function generateFrozenTrg002Production96Question(
  qlId: Trg002Production96Id,
  seed: string,
) {
  if (!TRG_002_PRODUCTION_96_IDS.includes(qlId)) {
    throw new Error(`Unknown frozen TRG-002 production QL ${qlId}.`);
  }

  if (TRG_002_FROZEN_MVP_48_ID_SET.has(qlId)) {
    const question: any = generateHumanApprovedTrg002Mvp48Question(qlId as Trg002Mvp48Id, seed);
    return {
      ...question,
      productionCandidate: true,
      productionBaseline: "FROZEN_MVP_48" as const,
      productionExpansion: false,
      productionQlTarget: 96,
      activationAuthorized: false,
    };
  }

  if (!TRG_002_PRODUCTION_EXPANSION_48_ID_SET.has(qlId)) {
    throw new Error(`${qlId}: missing from TRG-002 frozen production registry.`);
  }

  const question: any = generateHumanApprovedTrg002Phase8ExpansionQuestion(
    qlId as Trg002ProductionExpansion48Id,
    seed,
  );
  return {
    ...question,
    productionCandidate: true,
    productionBaseline: "FROZEN_PHASE8_EXPANSION_48" as const,
    productionExpansion: true,
    productionQlTarget: 96,
    activationAuthorized: false,
  };
}

export function generateAllFrozenTrg002Production96Questions(
  seedPrefix = "trg002-frozen-production96",
) {
  return TRG_002_PRODUCTION_96_IDS.map((qlId, index) =>
    generateFrozenTrg002Production96Question(
      qlId,
      `${seedPrefix}-${String(index + 1).padStart(3, "0")}`,
    ),
  );
}
