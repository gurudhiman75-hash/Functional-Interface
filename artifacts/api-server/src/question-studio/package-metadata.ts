import type { QuestionStudioPackageDefinition } from "./engine-types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstLabel(record: Record<string, unknown>): string {
  return asText(record.label) || asText(record.title) || asText(record.name);
}

function canonicalProblemId(record: Record<string, unknown>): string {
  return asText(record.id) || asText(record.canonicalProblemId) || asText(record.cpId);
}

function checkpointId(record: Record<string, unknown>): string {
  return asText(record.checkpointId) || asText(record.cpId) || asText(record.id);
}

/**
 * Derive human-readable checkpoint labels without confusing QLs/prototypes with CPs.
 *
 * Priority:
 * 1. Explicit metadata.cpTitles.
 * 2. canonicalProblems whose own id is one of the package cpIds.
 * 3. checkpoints whose checkpointId/cpId/id is one of the package cpIds.
 *
 * Candidate labels equal to the raw CP id are intentionally ignored.
 */
export function deriveQuestionStudioCpTitles(
  packageValue: Record<string, unknown>,
): Record<string, string> {
  const cpIds = new Set(
    [
      ...(Array.isArray(packageValue.cpIds) ? packageValue.cpIds : []),
      ...(Array.isArray(packageValue.dynamicCandidateCpIds)
        ? packageValue.dynamicCandidateCpIds
        : []),
    ]
      .map((value) => asText(value))
      .filter(Boolean),
  );
  if (cpIds.size === 0) return {};

  const titles: Record<string, string> = {};
  const metadata = asRecord(packageValue.metadata);
  const explicit = asRecord(metadata?.cpTitles);

  if (explicit) {
    for (const cpId of cpIds) {
      const title = asText(explicit[cpId]);
      if (title && title !== cpId) titles[cpId] = title;
    }
  }

  const absorb = (
    value: unknown,
    resolveId: (record: Record<string, unknown>) => string,
  ) => {
    if (!Array.isArray(value)) return;
    for (const entryValue of value) {
      const entry = asRecord(entryValue);
      if (!entry) continue;
      const cpId = resolveId(entry);
      if (!cpId || !cpIds.has(cpId) || titles[cpId]) continue;
      const label = firstLabel(entry);
      if (label && label !== cpId) titles[cpId] = label;
    }
  };

  absorb(packageValue.canonicalProblems, canonicalProblemId);
  absorb(packageValue.checkpoints, checkpointId);

  return titles;
}


export function enrichQuestionStudioPackageCpTitles(
  pkg: QuestionStudioPackageDefinition,
): QuestionStudioPackageDefinition {
  const cpTitles = deriveQuestionStudioCpTitles(
    pkg as unknown as Record<string, unknown>,
  );
  if (Object.keys(cpTitles).length === 0) return pkg;

  return {
    ...pkg,
    metadata: {
      ...(pkg.metadata ?? {}),
      cpTitles,
    },
  };
}
