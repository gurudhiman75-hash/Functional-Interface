import * as facts004 from "./pgk-001-cp004-facts";
import * as facts005 from "./pgk-001-cp005-facts";
import * as facts006 from "./pgk-001-cp006-facts";
import * as facts007 from "./pgk-001-cp007-facts";
import * as facts008 from "./pgk-001-cp008-facts";
import * as facts009 from "./pgk-001-cp009-facts";
import * as facts010 from "./pgk-001-cp010-facts";
import * as facts011 from "./pgk-001-cp011-facts";
import * as facts012 from "./pgk-001-cp012-facts";

import * as review004 from "./pgk-001-cp004-review-batch-v2";
import * as review005 from "./pgk-001-cp005-review-batch-v1";
import * as review006 from "./pgk-001-cp006-review-batch-v2";
import * as review007 from "./pgk-001-cp007-review-batch-v2";
import * as review008 from "./pgk-001-cp008-review-batch-v1";
import * as review009 from "./pgk-001-cp009-review-batch-v1";
import * as review010 from "./pgk-001-cp010-review-batch-v1";
import * as review011 from "./pgk-001-cp011-review-batch-v1";
import * as review012 from "./pgk-001-cp012-review-batch-v2";

type ReviewRow = Readonly<{
  questionId?: string;
  factIds?: readonly string[];
  sourceIds?: readonly string[];
}>;

type AuditModule = Readonly<{
  cpId: string;
  facts: Record<string, unknown>;
  review: Record<string, unknown>;
}>;

function exportedValue<T>(
  module: Record<string, unknown>,
  suffix: string,
): T | undefined {
  const match = Object.entries(module).find(([name]) => name.endsWith(suffix));
  return match?.[1] as T | undefined;
}

function reviewBatch(module: Record<string, unknown>): readonly ReviewRow[] {
  const candidates = Object.entries(module)
    .filter(([name, value]) => /_REVIEW_BATCH_V\d+$/.test(name) && Array.isArray(value))
    .sort(([a], [b]) => b.localeCompare(a));
  return (candidates[0]?.[1] as readonly ReviewRow[] | undefined) ?? [];
}

function canonicalFactIds(module: Record<string, unknown>): readonly string[] {
  const explicit = exportedValue<readonly string[]>(module, "_FACT_IDS");
  if (explicit?.length) return explicit;

  const factArrays = Object.entries(module)
    .filter(([name, value]) => /_FACTS(?:_V\d+)?$/.test(name) && Array.isArray(value))
    .sort(([a], [b]) => b.localeCompare(a));

  const rows = (factArrays[0]?.[1] as readonly unknown[] | undefined) ?? [];
  return Object.freeze(
    rows
      .map((row) => {
        if (!row || typeof row !== "object") return "";
        return String((row as Record<string, unknown>).id ?? "").trim();
      })
      .filter(Boolean),
  );
}

function sourceRegistry(module: Record<string, unknown>): Readonly<Record<string, unknown>> {
  return exportedValue<Readonly<Record<string, unknown>>>(module, "_SOURCE_REGISTRY") ?? {};
}

export type Pgk001SourceCoverageResult = Readonly<{
  cpId: string;
  valid: boolean;
  issues: readonly string[];
  canonicalFactCount: number;
  mappedFactCount: number;
  resolvedSourceCount: number;
}>;

export function auditPgk001SourceCoverageModule(
  cpId: string,
  facts: Record<string, unknown>,
  review: Record<string, unknown>,
): Pgk001SourceCoverageResult {
  const issues: string[] = [];
  const factIds = canonicalFactIds(facts);
  const validFacts = new Set(factIds);
  const registry = sourceRegistry(facts);
  const batch = reviewBatch(review);
  const mapping = new Map<string, Set<string>>();

  if (factIds.length === 0) issues.push(`${cpId}: no canonical FACT_IDS export found`);
  if (Object.keys(registry).length === 0) issues.push(`${cpId}: no SOURCE_REGISTRY export found`);
  if (batch.length === 0) issues.push(`${cpId}: no frozen review batch export found`);

  for (const question of batch) {
    const qid = question.questionId ?? "unknown-question";
    const qFactIds = question.factIds ?? [];
    const qSourceIds = question.sourceIds ?? [];

    if (qFactIds.length === 0) issues.push(`${cpId}/${qid}: no fact IDs`);
    if (qSourceIds.length === 0) issues.push(`${cpId}/${qid}: no source IDs`);

    for (const factId of qFactIds) {
      if (!validFacts.has(factId)) {
        issues.push(`${cpId}/${qid}: unknown fact ID ${factId}`);
        continue;
      }
      const set = mapping.get(factId) ?? new Set<string>();
      for (const sourceId of qSourceIds) set.add(sourceId);
      mapping.set(factId, set);
    }
  }

  const resolvedSources = new Set<string>();
  for (const factId of factIds) {
    const sourceIds = mapping.get(factId);
    if (!sourceIds || sourceIds.size === 0) {
      issues.push(`${cpId}/${factId}: no reviewed fact-level source binding`);
      continue;
    }
    for (const sourceId of sourceIds) {
      if (!(sourceId in registry)) {
        issues.push(`${cpId}/${factId}: unresolved source ID ${sourceId}`);
      } else {
        resolvedSources.add(sourceId);
      }
    }
  }

  return Object.freeze({
    cpId,
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    canonicalFactCount: factIds.length,
    mappedFactCount: mapping.size,
    resolvedSourceCount: resolvedSources.size,
  });
}

const modules: readonly AuditModule[] = Object.freeze([
  { cpId: "PGK-001-CP-004", facts: facts004, review: review004 },
  { cpId: "PGK-001-CP-005", facts: facts005, review: review005 },
  { cpId: "PGK-001-CP-006", facts: facts006, review: review006 },
  { cpId: "PGK-001-CP-007", facts: facts007, review: review007 },
  { cpId: "PGK-001-CP-008", facts: facts008, review: review008 },
  { cpId: "PGK-001-CP-009", facts: facts009, review: review009 },
  { cpId: "PGK-001-CP-010", facts: facts010, review: review010 },
  { cpId: "PGK-001-CP-011", facts: facts011, review: review011 },
  { cpId: "PGK-001-CP-012", facts: facts012, review: review012 },
]);

export const PGK_001_SOURCE_COVERAGE_CP004_TO_CP012_V2 = Object.freeze(
  modules.map(({ cpId, facts, review }) =>
    auditPgk001SourceCoverageModule(cpId, facts, review),
  ),
);

export function auditPgk001SourceCoverageCp004ToCp012V2() {
  const issues = PGK_001_SOURCE_COVERAGE_CP004_TO_CP012_V2.flatMap((result) =>
    result.issues.map((issue) => `${result.cpId}: ${issue}`),
  );
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    cpCount: PGK_001_SOURCE_COVERAGE_CP004_TO_CP012_V2.length,
    factCount: PGK_001_SOURCE_COVERAGE_CP004_TO_CP012_V2.reduce(
      (sum, result) => sum + result.canonicalFactCount,
      0,
    ),
  });
}
