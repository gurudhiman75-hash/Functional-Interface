import { classifySpatialSceneSymmetry } from "./symmetry";
import type {
  SpatialGlyphAuthorityEntry,
  SpatialValidationIssue,
  SpatialValidationResult,
} from "./types";
import { validateSpatialScene } from "./validator";

function issue(code: string, message: string): SpatialValidationIssue {
  return { code, message };
}

export function validateSpatialGlyphAuthorityEntry(
  entry: SpatialGlyphAuthorityEntry,
): SpatialValidationResult {
  const sceneResult = validateSpatialScene(entry.canonicalScene);
  const errors = [...sceneResult.errors];
  const warnings = [...sceneResult.warnings];

  if (!entry.glyphId.trim()) {
    errors.push(issue("SPA_GLYPH_EMPTY_ID", "Glyph authority entry requires an ID."));
  }

  if (!entry.authorityVersion.trim()) {
    errors.push(
      issue(
        "SPA_GLYPH_MISSING_AUTHORITY_VERSION",
        "Glyph authority entry requires an authority version.",
      ),
    );
  }

  if (
    ["LATIN", "DEVANAGARI", "GURMUKHI"].includes(entry.script) &&
    entry.localeMode !== "SCRIPT_SPECIFIC"
  ) {
    errors.push(
      issue(
        "SPA_GLYPH_SCRIPT_LOCALE_MODE_MISMATCH",
        "Letter-script glyphs must use SCRIPT_SPECIFIC locale mode.",
      ),
    );
  }

  const computedSymmetry = classifySpatialSceneSymmetry(entry.canonicalScene);
  if (
    computedSymmetry.vertical !== entry.symmetry.vertical ||
    computedSymmetry.horizontal !== entry.symmetry.horizontal ||
    computedSymmetry.rotational180 !== entry.symmetry.rotational180
  ) {
    errors.push(
      issue(
        "SPA_GLYPH_AUTHORITY_MISMATCH",
        "Declared glyph symmetry does not match canonical scene geometry.",
      ),
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function validateSpatialGlyphAuthority(
  entries: SpatialGlyphAuthorityEntry[],
): SpatialValidationResult {
  const errors: SpatialValidationIssue[] = [];
  const warnings: SpatialValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (const entry of entries) {
    if (seenIds.has(entry.glyphId)) {
      errors.push(
        issue(
          "SPA_GLYPH_DUPLICATE_ID",
          `Duplicate glyph authority ID '${entry.glyphId}'.`,
        ),
      );
    }
    seenIds.add(entry.glyphId);

    const result = validateSpatialGlyphAuthorityEntry(entry);
    errors.push(
      ...result.errors.map((item) => ({
        ...item,
        message: `${entry.glyphId}: ${item.message}`,
      })),
    );
    warnings.push(
      ...result.warnings.map((item) => ({
        ...item,
        message: `${entry.glyphId}: ${item.message}`,
      })),
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}
