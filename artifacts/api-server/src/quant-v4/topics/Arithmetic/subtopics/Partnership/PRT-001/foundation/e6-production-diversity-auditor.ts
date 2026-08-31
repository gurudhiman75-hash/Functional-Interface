import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { getPrt001QuestionTemplate, getPrt001QuestionTemplates } from "./library";
import { runPrt001PilotPipeline } from "./pipeline";
import type { Prt001Language } from "./types";

export interface Prt001E6AuditReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const BASELINE_ADVANCED_IDS = Array.from({ length: 20 }, (_, index) => `PRT-QL-${String(index + 13).padStart(3, "0")}`);

export function auditPrt001BaselineAdvancedMathDiversity(): Prt001E6AuditReport {
  const fixedRatioIds = new Set(["PRT-QL-020"]);
  const perQl: Record<string, { weightSignatures: number; ratioSignatures: number; answerSignatures: number }> = {};
  let cases = 0;
  for (const questionLanguageId of BASELINE_ADVANCED_IDS) {
    const weightSignatures = new Set<string>();
    const ratioSignatures = new Set<string>();
    const answerSignatures = new Set<string>();
    for (let index = 0; index < 36; index += 1) {
      const pkg = runPrt001PilotPipeline({ questionLanguageId, seed: `prt-001:e6-baseline-math:${questionLanguageId}:${index}`, language: "en" });
      weightSignatures.add(JSON.stringify(pkg.traceability.exactWeights));
      ratioSignatures.add(String(pkg.traceability.normalizedRatio));
      answerSignatures.add(pkg.answer);
      cases += 1;
    }
    requireAudit(weightSignatures.size >= 6, `${questionLanguageId} has only ${weightSignatures.size} effective-weight signatures`);
    requireAudit(answerSignatures.size >= 3, `${questionLanguageId} has only ${answerSignatures.size} answer signatures`);
    if (!fixedRatioIds.has(questionLanguageId)) requireAudit(ratioSignatures.size >= 3, `${questionLanguageId} has only ${ratioSignatures.size} normalized-ratio signatures`);
    perQl[questionLanguageId] = { weightSignatures: weightSignatures.size, ratioSignatures: ratioSignatures.size, answerSignatures: answerSignatures.size };
  }
  return {
    audit: "e6-baseline-advanced-math-diversity",
    cases,
    metrics: {
      perQl,
      minimumWeightSignatures: 6,
      minimumAnswerSignatures: 3,
      minimumRatioSignatures: 3,
      fixedRatioSemanticExceptions: [...fixedRatioIds],
    },
  };
}

export function auditPrt001AdvancedStemSkeletonDiversity(): Prt001E6AuditReport {
  const languages: readonly Prt001Language[] = ["en", "hi", "pa"];
  const perLocaleQl: Record<string, { authoredSkeletons: number; selectedSkeletons: number }> = {};
  let cases = 0;
  for (const language of languages) {
    for (const questionLanguageId of BASELINE_ADVANCED_IDS) {
      const authored = getPrt001QuestionTemplates(questionLanguageId, language);
      requireAudit(authored.length >= 3, `${language}:${questionLanguageId} has only ${authored.length} authored stem skeletons`);
      requireAudit(new Set(authored).size === authored.length, `${language}:${questionLanguageId} has duplicate authored stem skeletons`);
      const selected = new Set<string>();
      for (let index = 0; index < 24; index += 1) {
        selected.add(getPrt001QuestionTemplate(questionLanguageId, language, `prt-001:e6-stem:${questionLanguageId}:${language}:${index}`));
        cases += 1;
      }
      requireAudit(selected.size === authored.length, `${language}:${questionLanguageId} seeded selection reached ${selected.size}/${authored.length} stem skeletons`);
      perLocaleQl[`${language}:${questionLanguageId}`] = { authoredSkeletons: authored.length, selectedSkeletons: selected.size };
    }
  }
  return {
    audit: "e6-advanced-stem-skeleton-diversity",
    cases,
    metrics: { perLocaleQl, languages, qls: BASELINE_ADVANCED_IDS.length, minimumSkeletonsPerQlPerLocale: 3 },
  };
}

export function auditPrt001ObjectPoolDepth(): Prt001E6AuditReport {
  const source = objectPoolsSource as { partnerPairs?: unknown[]; businesses?: unknown[] };
  const partnerPairs = Array.isArray(source.partnerPairs) ? source.partnerPairs : [];
  const businesses = Array.isArray(source.businesses) ? source.businesses : [];
  requireAudit(partnerPairs.length >= 10, `expected at least 10 partner pairs, got ${partnerPairs.length}`);
  requireAudit(businesses.length >= 12, `expected at least 12 business contexts, got ${businesses.length}`);
  requireAudit(new Set(partnerPairs.map((item) => JSON.stringify(item))).size === partnerPairs.length, "partner-pair pool contains duplicates");
  requireAudit(new Set(businesses.map(String)).size === businesses.length, "business-context pool contains duplicates");
  return { audit: "e6-object-pool-depth", cases: partnerPairs.length + businesses.length, metrics: { partnerPairs: partnerPairs.length, businesses: businesses.length } };
}
