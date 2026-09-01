import sourceProvenance from "../source-provenance.e8.json" assert { type: "json" };
import variableRangesSource from "../variable-ranges.library.json" assert { type: "json" };
import { generatePrt001E8Parameters } from "./e8-parameter-generator";
import { getPrt001TaskEntry } from "./library";
import { equalRational } from "./math";
import { runPrt001PilotPipeline } from "./pipeline";

interface SourceItem {
  id: string;
  exam: string;
  heldOn: string | null;
  url: string;
  family: string;
  disposition: string;
  mappedQuestionLanguageIds: string[];
}

interface SourceProvenance {
  chapterId: string;
  wave: string;
  status: string;
  sources: SourceItem[];
}

interface VariableRanges {
  durationsMonths: number[];
  unequalDurationScenarios: Array<{ durationA: number; durationB: number }>;
  unknownCapitalScenarios: Array<{ durationA: number; durationB: number }>;
  unknownDurationScenarios: Array<{ durationA: number; durationB: number }>;
}

export interface Prt001E8SourceAuditReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function auditPrt001E8SourceRealness(): Prt001E8SourceAuditReport {
  const provenance = sourceProvenance as SourceProvenance;
  const variableRanges = variableRangesSource as VariableRanges;
  requireAudit(provenance.chapterId === "PRT-001", "E8 source provenance chapter mismatch");
  requireAudit(provenance.wave === "E8", "E8 source provenance wave mismatch");
  requireAudit(provenance.sources.length >= 12, `E8 requires at least 12 reviewed source families; got ${provenance.sources.length}`);
  requireAudit(provenance.sources.every((item) => /^https:\/\/testbook\.com\/question-answer\//.test(item.url)), "E8 provenance contains a non-Testbook or malformed source URL");
  requireAudit(provenance.sources.every((item) => !/placeholder/i.test(item.url)), "E8 provenance contains a placeholder source URL");
  requireAudit(provenance.sources.some((item) => item.disposition === "E8_EXPOSED" && item.mappedQuestionLanguageIds.includes("PRT-QL-104")), "QL-104 lacks source provenance");
  requireAudit(provenance.sources.some((item) => item.disposition === "E8_EXPOSED" && item.mappedQuestionLanguageIds.includes("PRT-QL-105")), "QL-105 lacks source provenance");
  requireAudit(provenance.sources.some((item) => item.disposition === "DELEGATED_INTEREST"), "interest-on-capital boundary is not recorded");
  requireAudit(provenance.sources.some((item) => item.disposition === "EXCLUDED_ACCOUNTING_RECONSTITUTION"), "accounting-reconstitution boundary is not recorded");

  const configuredDurations = [
    ...variableRanges.durationsMonths,
    ...variableRanges.unequalDurationScenarios.flatMap((item) => [item.durationA, item.durationB]),
    ...variableRanges.unknownCapitalScenarios.flatMap((item) => [item.durationA, item.durationB]),
    ...variableRanges.unknownDurationScenarios.flatMap((item) => [item.durationA, item.durationB]),
  ];
  const maxConfiguredDuration = Math.max(...configuredDurations);
  requireAudit(maxConfiguredDuration >= 36, `source-backed duration pool does not reach 36 months; max=${maxConfiguredDuration}`);

  const splitSignatures = new Set<string>();
  const reverseTotalAnswers = new Set<string>();
  const horizonSignatures = new Set<string>();
  const horizonAnswers = new Set<string>();
  let cases = provenance.sources.length;

  const ql104Entry = getPrt001TaskEntry("PRT-QL-104");
  for (let index = 0; index < 24; index += 1) {
    const seed = `prt-001:e8-source:104:${index}`;
    const parameters = generatePrt001E8Parameters({ questionLanguageId: "PRT-QL-104", seed, entry: ql104Entry, language: "en" });
    requireAudit(parameters.state.allocations.length === 2, `QL-104 seed ${index} does not have exactly two equal-split allocations`);
    requireAudit(parameters.state.allocations.every((item) => item.basis === "PERCENT_OF_GROSS_PROFIT"), `QL-104 seed ${index} allocation basis drifted`);
    requireAudit(parameters.state.allocations[0]!.recipientPartnerId !== parameters.state.allocations[1]!.recipientPartnerId, `QL-104 seed ${index} allocations do not target distinct partners`);
    requireAudit(equalRational(parameters.state.allocations[0]!.value, parameters.state.allocations[1]!.value), `QL-104 seed ${index} equal split is not equal`);
    const pkg = runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-104", seed, language: "en" });
    requireAudit(pkg.validation.valid, `QL-104 failed validation at seed ${index}`);
    requireAudit(pkg.solveMode === "findTotalProfitFromShareDifferenceAndCapitals", "QL-104 lost the generalized reverse-total authority");
    requireAudit(pkg.traceability.expansionWave === "E8", "QL-104 is not routed through E8");
    splitSignatures.add(`${pkg.parameters.equalSplitPercent}:${pkg.parameters.capitalSplitPercent}:${pkg.traceability.normalizedRatio}`);
    reverseTotalAnswers.add(pkg.answer);
    cases += 1;
  }
  requireAudit(splitSignatures.size >= 4, `QL-104 reached only ${splitSignatures.size} split-allocation signatures`);
  requireAudit(reverseTotalAnswers.size >= 4, `QL-104 reached only ${reverseTotalAnswers.size} reverse-total answers`);

  const ql105Entry = getPrt001TaskEntry("PRT-QL-105");
  for (let index = 0; index < 24; index += 1) {
    const seed = `prt-001:e8-source:105:${index}`;
    const parameters = generatePrt001E8Parameters({ questionLanguageId: "PRT-QL-105", seed, entry: ql105Entry, language: "en" });
    requireAudit(parameters.state.totalDuration.numerator > 12n * parameters.state.totalDuration.denominator, `QL-105 seed ${index} is not longer than one year`);
    requireAudit(parameters.state.partners.length === 3, `QL-105 seed ${index} is not a three-partner timeline`);
    requireAudit(parameters.state.partners[1]!.capitalSegments.length === 2, `QL-105 seed ${index} does not contain a withdrawal boundary`);
    const pkg = runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-105", seed, language: "en" });
    requireAudit(pkg.validation.valid, `QL-105 failed validation at seed ${index}`);
    const totalDurationText = String(pkg.parameters.totalDuration ?? "");
    horizonSignatures.add(`${totalDurationText}|${JSON.stringify(pkg.traceability.exactWeights)}`);
    horizonAnswers.add(pkg.answer);
    requireAudit(pkg.traceability.expansionWave === "E8", "QL-105 is not routed through E8");
    requireAudit(/2 years|30 months|3 years|4 years/.test(totalDurationText), `QL-105 emitted a non-multi-year horizon: ${totalDurationText}`);
    cases += 1;
  }
  requireAudit(horizonSignatures.size >= 4, `QL-105 reached only ${horizonSignatures.size} long-horizon signatures`);
  requireAudit(horizonAnswers.size >= 4, `QL-105 reached only ${horizonAnswers.size} answer signatures`);

  return {
    audit: "e8-source-realness",
    cases,
    metrics: {
      reviewedSourceFamilies: provenance.sources.length,
      e8ExposedQls: ["PRT-QL-104", "PRT-QL-105"],
      solveModesAdded: 0,
      delegatedBoundaries: ["interest-on-capital", "accounting-reconstitution"],
      maxConfiguredDurationMonths: maxConfiguredDuration,
      ql104SplitAllocationSignatures: splitSignatures.size,
      ql104ReverseTotalAnswers: reverseTotalAnswers.size,
      ql105LongHorizonSignatures: horizonSignatures.size,
      ql105AnswerSignatures: horizonAnswers.size,
    },
  };
}
