import assert from "node:assert/strict";
import { listSifAuthorities } from "./authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { SIF_CP_IDS, type SifLocale } from "./types.ts";

const locales: readonly SifLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const normalizedSurfaces: Record<SifLocale, Set<string>> = {
  "en-IN": new Set(),
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
const cpAuthorityCounts: Record<string, number> = {};
let totalAuthorities = 0;
let generatedSurfaces = 0;

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}

for (const cpId of SIF_CP_IDS) {
  const authorities = listSifAuthorities(cpId);
  cpAuthorityCounts[cpId] = authorities.length;
  totalAuthorities += authorities.length;

  // Frozen content packs should be real pools, not one or two hard-coded items.
  assert.ok(
    authorities.length >= 8,
    `${cpId}: authority pool is too thin for repeated Question Studio review (${authorities.length})`,
  );

  const authorityIds = new Set(authorities.map((authority) => authority.id));
  assert.equal(authorityIds.size, authorities.length, `${cpId}: duplicate authority IDs`);

  for (let authorityIndex = 0; authorityIndex < authorities.length; authorityIndex++) {
    const authority = authorities[authorityIndex]!;
    // Choose a seed that deterministically selects this exact authority.
    const seed = authorityIndex;

    for (const locale of locales) {
      const question = generateSifQuestion({ cpId, locale, seed });
      assert.equal(
        question.scenarioId,
        authority.id,
        `${cpId}/${locale}/${seed}: authority selection drift`,
      );

      const surface = normalize([
        question.statement,
        question.inferences[0],
        question.inferences[1],
      ].join(" || "));

      assert.ok(
        !normalizedSurfaces[locale].has(surface),
        `${cpId}/${locale}/${authority.id}: duplicate learner semantic surface across chapter`,
      );
      normalizedSurfaces[locale].add(surface);
      generatedSurfaces++;
    }
  }
}

for (const locale of locales) {
  assert.equal(
    normalizedSurfaces[locale].size,
    totalAuthorities,
    `${locale}: surface uniqueness does not match authority count`,
  );
}

console.log(JSON.stringify({
  status: "PASS_SIF_001_DEEP_AUDIT_WAVE3",
  cpCount: SIF_CP_IDS.length,
  totalAuthorities,
  cpAuthorityCounts,
  locales,
  generatedSurfaces,
  exactNormalizedSurfaceDuplicates: 0,
  minimumAuthoritiesPerCp: Math.min(...Object.values(cpAuthorityCounts)),
}, null, 2));
