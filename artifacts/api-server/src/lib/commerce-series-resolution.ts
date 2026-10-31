import type { sqlClient } from "./db";
import { seriesSelectionBlockers } from "./commerce-series-composition";

type SqlExecutor = typeof sqlClient;

export class SeriesPackageSelectionError extends Error {
  constructor(public readonly code: string, message: string, public readonly details?: unknown) {
    super(message);
    this.name = "SeriesPackageSelectionError";
  }
}

/** Resolve immutable series versions against the database before any package write. */
export async function loadEligibleSeriesTestGroups(
  client: SqlExecutor,
  versionIds: readonly string[],
  now = new Date(),
): Promise<string[][]> {
  const groups: string[][] = [];
  for (const versionId of versionIds) {
    const series = await client`
      SELECT s.deleted_at AS "deletedAt",
        v.availability_end_at AS "availabilityEndAt",
        v.configuration ->> 'learnerVisibility' AS "learnerVisibility"
      FROM assessment.test_series_versions v
      JOIN assessment.test_series s ON s.id = v.series_id
      WHERE v.id = ${versionId}::uuid
      LIMIT 1
    `;
    if (!series.length) {
      throw new SeriesPackageSelectionError("SERIES_VERSION_MISSING", "Selected series version does not exist", { seriesVersionId: versionId });
    }
    const rows = await client`
      SELECT i.test_id::text AS id, t.status::text AS status,
        (t.id IS NULL OR t.deleted_at IS NOT NULL) AS "missingOrArchived"
      FROM assessment.test_series_items i
      LEFT JOIN assessment.tests t ON t.id = i.test_id
      WHERE i.series_version_id = ${versionId}::uuid
      ORDER BY i.sort_order
    `;
    const blockers = seriesSelectionBlockers({
      archived: Boolean(series[0].deletedAt),
      availabilityEndAt: series[0].availabilityEndAt ? String(series[0].availabilityEndAt) : null,
      learnerVisibility: series[0].learnerVisibility ? String(series[0].learnerVisibility) : null,
      memberStatuses: rows.map(row => row.status == null ? null : String(row.status)),
      missingOrArchivedMembers: rows.filter(row => row.missingOrArchived).length,
    }, now);
    if (blockers.length) {
      throw new SeriesPackageSelectionError("SERIES_NOT_READY", "Selected series version cannot be added to a package", {
        seriesVersionId: versionId, blockers,
      });
    }
    groups.push(rows.map(row => String(row.id)));
  }
  return groups;
}
