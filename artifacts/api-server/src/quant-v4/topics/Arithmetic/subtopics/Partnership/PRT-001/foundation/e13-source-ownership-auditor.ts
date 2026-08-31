import sourceProvenance from "../source-provenance.e13.json" assert { type: "json" };
import { generatePrt001E13Parameters } from "./e13-parameter-generator";
import { getPrt001TaskEntry } from "./library";
import { equalRational, rational } from "./math";
import { runPrt001PilotPipeline } from "./pipeline";

interface SourceItem {
  id: string;
  exam: string;
  heldOn: string | null;
  url: string;
  family: string;
  mappedQuestionLanguageIds: string[];
}

interface SourceProvenance {
  chapterId: string;
  wave: string;
  status: string;
  sources: SourceItem[];
  ownership: Record<string, string>;
}

export interface Prt001E13SourceAuditReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function auditPrt001E13SourceOwnership(): Prt001E13SourceAuditReport {
  const provenance = sourceProvenance as SourceProvenance;
  requireAudit(provenance.chapterId === "PRT-001", "E13 source provenance chapter mismatch");
  requireAudit(provenance.wave === "E13", "E13 source provenance wave mismatch");
  requireAudit(provenance.sources.length >= 9, `E13 expects at least 9 source records, got ${provenance.sources.length}`);
  requireAudit(provenance.sources.every((item) => /^https:\/\/testbook\.com\/question-answer\//.test(item.url)), "E13 provenance contains a malformed/non-Testbook source URL");

  const expectedQls = Array.from({ length: 7 }, (_, index) => `PRT-QL-${String(index + 106).padStart(3, "0")}`);
  for (const questionLanguageId of expectedQls) {
    requireAudit(provenance.sources.some((item) => item.mappedQuestionLanguageIds.includes(questionLanguageId)), `${questionLanguageId} lacks E13 source provenance`);
  }
  requireAudit(provenance.ownership.pureSimpleOrCompoundInterest === "INT-001", "pure interest ownership drifted");
  requireAudit(provenance.ownership.interestOnCapitalInsidePartnershipDistribution === "PRT-001", "mixed capital-interest Partnership ownership drifted");
  requireAudit(provenance.ownership.accountingAdmissionReconstitution === "EXCLUDED_FROM_APTITUDE_PRT", "accounting reconstitution boundary drifted");
  requireAudit(provenance.ownership.arithmeticIncomingPartnerShareAcquisition === "PRT-001", "arithmetic incoming-partner ownership drifted");

  const topologySignatures: Record<string, Set<string>> = Object.fromEntries(expectedQls.map((id) => [id, new Set<string>()]));
  const answerSignatures: Record<string, Set<string>> = Object.fromEntries(expectedQls.map((id) => [id, new Set<string>()]));
  let cases = provenance.sources.length;

  for (const questionLanguageId of expectedQls) {
    const entry = getPrt001TaskEntry(questionLanguageId);
    for (let index = 0; index < 24; index += 1) {
      const seed = `prt-001:e13-source:${questionLanguageId}:${index}`;
      const parameters = generatePrt001E13Parameters({ questionLanguageId, seed, entry, language: "en" });
      const pkg = runPrt001PilotPipeline({ questionLanguageId, seed, language: "en" });
      requireAudit(pkg.validation.valid, `${questionLanguageId} failed E13 source validation at seed ${index}`);
      requireAudit(pkg.traceability.expansionWave === "E13", `${questionLanguageId} is not routed through E13`);
      answerSignatures[questionLanguageId]!.add(pkg.answer);
      topologySignatures[questionLanguageId]!.add(`${JSON.stringify(pkg.traceability.exactWeights)}|${pkg.traceability.normalizedRatio}`);

      if (questionLanguageId === "PRT-QL-106") {
        const sleeping = parameters.state.partners.find((partner) => partner.role === "SLEEPING");
        requireAudit(Boolean(sleeping?.profitShareMultiplier), "QL-106 lost its first-class sleeping-partner entitlement multiplier");
        requireAudit(parameters.state.allocations.some((allocation) => allocation.kind === "RESERVE" && allocation.basis === "PERCENT_OF_GROSS_PROFIT"), "QL-106 lost retained-profit handling");
      }
      if (questionLanguageId === "PRT-QL-107") {
        requireAudit(Number(parameters.renderVariables.reinvestedProfitShareNumeric) > 0, "QL-107 did not compute a prior-period share for reinvestment");
      }
      if (questionLanguageId === "PRT-QL-108") {
        const grossAllocations = parameters.state.allocations.filter((allocation) => allocation.basis === "PERCENT_OF_GROSS_PROFIT" && allocation.recipientPartnerId);
        requireAudit(grossAllocations.length === 2, "QL-108 must have two recipient gross-profit allocations");
        requireAudit(grossAllocations[0]!.recipientPartnerId !== grossAllocations[1]!.recipientPartnerId, "QL-108 gross allocations must target different partners");
      }
      if (questionLanguageId === "PRT-QL-109") {
        requireAudit(parameters.state.partners.length === 3, "QL-109 must remain a three-partner residual-fraction topology");
        requireAudit(String(parameters.renderVariables.capitalFractionA).includes("/") && String(parameters.renderVariables.durationFractionA).includes("/"), "QL-109 lost explicit fractional source semantics");
      }
      if (questionLanguageId === "PRT-QL-110") {
        requireAudit(String(parameters.renderVariables.relationStatement).includes("="), "QL-110 lost aggregate relational equation semantics");
      }
      if (questionLanguageId === "PRT-QL-111") {
        const interestAllocations = parameters.state.allocations.filter((allocation) => allocation.kind === "INTEREST_ON_CAPITAL");
        requireAudit(interestAllocations.length === 2, "QL-111 must credit capital interest to both partners");
        requireAudit(interestAllocations.every((allocation) => allocation.basis === "FIXED_AMOUNT" && Boolean(allocation.recipientPartnerId)), "QL-111 capital-interest allocations must be explicit recipient credits");
        const capitalA = Number(String(parameters.renderVariables.capitalA).replace(/,/g, ""));
        const rate = Number(parameters.renderVariables.interestRatePercent);
        requireAudit(equalRational(interestAllocations[0]!.value, rational((capitalA * rate) / 100)), "QL-111 interest amount no longer equals stated rate × partner capital");
      }
      if (questionLanguageId === "PRT-QL-112") {
        requireAudit(String(parameters.renderVariables.oldRatio).includes(":"), "QL-112 lost old profit ratio");
        requireAudit(String(parameters.renderVariables.acquiredFraction).includes("/"), "QL-112 lost acquired-share fraction");
        requireAudit(String(parameters.renderVariables.sacrificeRatio).includes(":"), "QL-112 lost sacrifice ratio");
      }
      cases += 1;
    }
  }

  for (const questionLanguageId of expectedQls) {
    requireAudit(topologySignatures[questionLanguageId]!.size >= 3, `${questionLanguageId} reached only ${topologySignatures[questionLanguageId]!.size} E13 source topology signatures`);
    requireAudit(answerSignatures[questionLanguageId]!.size >= 2, `${questionLanguageId} reached only ${answerSignatures[questionLanguageId]!.size} E13 source answer signatures`);
  }

  return {
    audit: "e13-source-ownership",
    cases,
    metrics: {
      sourceRecords: provenance.sources.length,
      sourceBackedQls: expectedQls,
      newSolveModes: 3,
      reusedAuthorities: 2,
      resolvedOwnership: provenance.ownership,
      topologySignatures: Object.fromEntries(expectedQls.map((id) => [id, topologySignatures[id]!.size])),
      answerSignatures: Object.fromEntries(expectedQls.map((id) => [id, answerSignatures[id]!.size])),
    },
  };
}
