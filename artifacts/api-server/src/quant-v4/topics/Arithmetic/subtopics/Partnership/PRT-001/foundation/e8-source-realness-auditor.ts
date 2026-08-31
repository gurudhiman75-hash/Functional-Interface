import sourceProvenance from "../source-provenance.e8.json" assert { type: "json" };
import variableRangesSource from "../variable-ranges.library.json" assert { type: "json" };
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

  const allowanceSignatures = new Set<string>();
  const allowanceAnswers = new Set<string>();
  const horizonSignatures = new Set<string>();
  const horizonAnswers = new Set<string>();
  let cases = provenance.sources.length;

  for (let index = 0; index < 24; index += 1) {
    const pkg = runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-104", seed: `prt-001:e8-source:104:${index}`, language: "en" });
    requireAudit(pkg.validation.valid, `QL-104 failed validation at seed ${index}`);
    const allowances = (pkg.parameters.allowancePercentA ?? "") + ":" + (pkg.parameters.allowancePercentB ?? "");
    allowanceSignatures.add(String(allowances));
    allowanceAnswers.add(pkg.answer);
    requireAudit(pkg.traceability.expansionWave === "E8", "QL-104 is not routed through E8");
    cases += 1;
  }
  requireAudit(allowanceSignatures.size >= 4, `QL-104 reached only ${allowanceSignatures.size} allowance signatures`);
  requireAudit(allowanceAnswers.size >= 4, `QL-104 reached only ${allowanceAnswers.size} answer signatures`);

  for (let index = 0; index < 24; index += 1) {
    const pkg = runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-105", seed: `prt-001:e8-source:105:${index}`, language: "en" });
    requireAudit(pkg.validation.valid, `QL-105 failed validation at seed ${index}`);
    const totalDurationText = String(pkg.parameters.totalDuration ?? "");
    const traceWeights = JSON.stringify(pkg.traceability.exactWeights);
    horizonSignatures.add(`${totalDurationText}|${traceWeights}`);
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
      ql104AllowanceSignatures: allowanceSignatures.size,
      ql104AnswerSignatures: allowanceAnswers.size,
      ql105LongHorizonSignatures: horizonSignatures.size,
      ql105AnswerSignatures: horizonAnswers.size,
    },
  };
}
