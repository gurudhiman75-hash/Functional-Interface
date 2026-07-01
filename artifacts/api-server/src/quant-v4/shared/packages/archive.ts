import { existsSync, readFileSync } from "node:fs";
import { basename, join, sep } from "node:path";

export const QUANT_V4_ARCHIVE_MANIFEST = "archive.manifest.json" as const;

export interface QuantV4ArchiveManifest {
  archived: true;
  archivedPackageId?: string;
  archivedAt?: string;
  reason?: string;
  activeDiscovery?: false;
  retainedFor?: string;
}

function hasArchivePathSegment(dir: string) {
  return dir
    .split(sep)
    .some((segment) => segment === "_archive" || segment === "archive" || segment === "archived");
}

export function readQuantV4ArchiveManifest(dir: string): QuantV4ArchiveManifest | null {
  const manifestPath = join(dir, QUANT_V4_ARCHIVE_MANIFEST);
  if (!existsSync(manifestPath)) return null;

  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as Partial<QuantV4ArchiveManifest>;
    if (parsed.archived === true) {
      return {
        archived: true,
        archivedPackageId: parsed.archivedPackageId,
        archivedAt: parsed.archivedAt,
        reason: parsed.reason,
        activeDiscovery: false,
        retainedFor: parsed.retainedFor,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function isArchivedQuantV4PackageDir(dir: string) {
  return Boolean(readQuantV4ArchiveManifest(dir)) || hasArchivePathSegment(dir) || basename(dir).startsWith("_");
}
