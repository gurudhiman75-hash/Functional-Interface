import { buildContent003BReport } from "./content-003b-report";

export interface MigrationReadinessReport {
  timestamp: string;
  scope: string[];
  allReady: boolean;
  readinessPercentage: number;
  reportSummary: string;
}

export function buildMigrationReadinessReport(): MigrationReadinessReport {
  const report = buildContent003BReport();
  const total = report.totalQuestionsAudited;
  const ready = report.successCriteria.readyStatusCount;
  const allReady = ready === total;
  const readinessPercentage = (ready / total) * 100;

  const reportSummary = allReady
    ? `All ${total} scoped questions (Q001-Q005) have been fully enriched with human-authored pedagogical assets (stems, variable ranges, explanations, hints, misconceptions, and realism checks). They are 100% READY for migration to production-quality Question Packages.`
    : `Enrichment is incomplete. Only ${ready}/${total} scoped questions (Q001-Q005) are ready.`;

  return {
    timestamp: new Date().toISOString(),
    scope: report.scope,
    allReady,
    readinessPercentage,
    reportSummary,
  };
}

export const MIGRATION_READINESS_REPORT = buildMigrationReadinessReport();
