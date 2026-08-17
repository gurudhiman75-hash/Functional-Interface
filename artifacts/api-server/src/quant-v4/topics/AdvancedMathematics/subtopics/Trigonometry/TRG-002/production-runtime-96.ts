import type { Trg002Mvp48Id } from "./mvp-48-registry";
import { generateHumanApprovedTrg002Mvp48Question } from "./mvp-human-approved-runtime";
import {
  TRG_002_FROZEN_MVP_48_ID_SET,
  TRG_002_PRODUCTION_96_IDS,
  TRG_002_PRODUCTION_EXPANSION_48_ID_SET,
  assertTrg002ProductionRegistry,
  type Trg002Production96Id,
} from "./production-96-registry";
import {
  generateTrg002ProductionCp007ExpansionQuestion,
  type Trg002ProductionCp007ExpansionId,
} from "./production-cp007-expansion";
import {
  generateTrg002ProductionCp008ExpansionQuestion,
  type Trg002ProductionCp008ExpansionId,
} from "./production-cp008-expansion";
import {
  generateTrg002ProductionCp009ExpansionQuestion,
  type Trg002ProductionCp009ExpansionId,
} from "./production-cp009-expansion";
import {
  generateTrg002ProductionCp010ExpansionQuestion,
  type Trg002ProductionCp010ExpansionId,
} from "./production-cp010-expansion";
import {
  TRG_002_CP009_CLEAN_OVERRIDE_IDS,
  generateTrg002ProductionCp009CleanOverride,
  type Trg002Cp009CleanOverrideId,
} from "./production-cp009-clean-overrides";
import {
  TRG_002_CP010_CLEAN_OVERRIDE_IDS,
  generateTrg002ProductionCp010CleanOverride,
  type Trg002Cp010CleanOverrideId,
} from "./production-cp010-clean-overrides";
import { generateTrg002ProductionQl019Clean } from "./production-ql019-clean";
import { generateTrg002ProductionQl021Clean } from "./production-ql021-clean";
import { generateTrg002ProductionQl022Clean } from "./production-ql022-clean";
import { generateTrg002ProductionQl026Clean } from "./production-ql026-clean";
import { generateTrg002ProductionQl042Clean } from "./production-ql042-clean";
import { generateTrg002ProductionQl089Clean } from "./production-ql089-clean";

assertTrg002ProductionRegistry();

function numericId(qlId: string) {
  const value = Number(qlId.slice(-3));
  if (!Number.isInteger(value)) throw new Error(`Invalid TRG-002 production ID ${qlId}.`);
  return value;
}

function expansionQuestion(qlId: string, seed: string) {
  if (qlId === "TRG-002-QL-019") return generateTrg002ProductionQl019Clean(seed);
  if (qlId === "TRG-002-QL-021") return generateTrg002ProductionQl021Clean(seed);
  if (qlId === "TRG-002-QL-022") return generateTrg002ProductionQl022Clean(seed);
  if (qlId === "TRG-002-QL-026") return generateTrg002ProductionQl026Clean(seed);
  if (qlId === "TRG-002-QL-042") return generateTrg002ProductionQl042Clean(seed);
  if (qlId === "TRG-002-QL-089") return generateTrg002ProductionQl089Clean(seed);
  if ((TRG_002_CP009_CLEAN_OVERRIDE_IDS as readonly string[]).includes(qlId)) {
    return generateTrg002ProductionCp009CleanOverride(qlId as Trg002Cp009CleanOverrideId, seed);
  }
  if ((TRG_002_CP010_CLEAN_OVERRIDE_IDS as readonly string[]).includes(qlId)) {
    return generateTrg002ProductionCp010CleanOverride(qlId as Trg002Cp010CleanOverrideId, seed);
  }
  const n = numericId(qlId);
  if (n <= 24) return generateTrg002ProductionCp007ExpansionQuestion(qlId as Trg002ProductionCp007ExpansionId, seed);
  if (n <= 48) return generateTrg002ProductionCp008ExpansionQuestion(qlId as Trg002ProductionCp008ExpansionId, seed);
  if (n <= 72) return generateTrg002ProductionCp009ExpansionQuestion(qlId as Trg002ProductionCp009ExpansionId, seed);
  return generateTrg002ProductionCp010ExpansionQuestion(qlId as Trg002ProductionCp010ExpansionId, seed);
}

export function generateTrg002Production96Question(qlId: Trg002Production96Id, seed: string) {
  if (!TRG_002_PRODUCTION_96_IDS.includes(qlId)) throw new Error(`Unknown TRG-002 production QL ${qlId}.`);
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
  if (!TRG_002_PRODUCTION_EXPANSION_48_ID_SET.has(qlId)) throw new Error(`${qlId}: missing from TRG-002 production expansion registry.`);
  const question: any = expansionQuestion(qlId, seed);
  return {
    ...question,
    productionCandidate: true,
    productionBaseline: "PHASE8_EXPANSION_48" as const,
    productionExpansion: true,
    productionQlTarget: 96,
    frozen: false,
    freezeStatus: "NOT_FROZEN" as const,
    freezeEligible: false,
    reviewStatus: "UNREVIEWED" as const,
    aiEditorialStatus: "PENDING" as const,
    humanReviewStatus: "PENDING" as const,
    activationAuthorized: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateAllTrg002Production96Questions(seedPrefix = "trg002-production") {
  return TRG_002_PRODUCTION_96_IDS.map((qlId, index) => {
    const seed = `${seedPrefix}-${String(index + 1).padStart(3, "0")}`;
    return generateTrg002Production96Question(qlId, seed);
  });
}
