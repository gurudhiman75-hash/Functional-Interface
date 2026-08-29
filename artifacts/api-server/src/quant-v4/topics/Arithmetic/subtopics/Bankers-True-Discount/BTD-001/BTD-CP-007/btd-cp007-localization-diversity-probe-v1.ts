import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP007_LANGUAGES_V3, buildBtdLocalizedQuestionV3 } from "./btd-cp007-hi-pa-localization-v3";

function norm(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
}

const scopes: any[] = [];
let minUnique = 100;
let maxDuplicateFrequency = 1;
let totalGenerated = 0;
let totalUniqueWithinScopes = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V3) {
    const counts = new Map<string, { count: number; family: string; sample: string }>();
    const families = new Set<string>();
    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const q: any = buildBtdLocalizedQuestionV3(entry.qlId, seed, language);
      const key = norm(q.presentation.stem);
      const family = String(q.presentation.stemFamilyId).match(/T([123])-(HI|PA)$/u)?.[1] ?? "?";
      families.add(family);
      const current = counts.get(key);
      counts.set(key, current ? { ...current, count: current.count + 1 } : { count: 1, family, sample: q.presentation.stem });
      totalGenerated += 1;
    }
    const duplicateClusters = [...counts.values()].filter((item) => item.count > 1).sort((a, b) => b.count - a.count);
    const unique = counts.size;
    const maxFrequency = duplicateClusters[0]?.count ?? 1;
    minUnique = Math.min(minUnique, unique);
    maxDuplicateFrequency = Math.max(maxDuplicateFrequency, maxFrequency);
    totalUniqueWithinScopes += unique;
    scopes.push({
      qlId: entry.qlId,
      language,
      uniqueStems: unique,
      duplicateCount: 100 - unique,
      duplicateClusters: duplicateClusters.length,
      maxDuplicateFrequency: maxFrequency,
      familyCoverage: [...families].sort(),
      topDuplicates: duplicateClusters.slice(0, 3),
    });
  }
}

console.log(JSON.stringify({
  probeVersion: "BTD-001-CP007-LOCALIZATION-DIVERSITY-PROBE-v1",
  totalGenerated,
  scopeCount: scopes.length,
  totalUniqueWithinScopes,
  overallUniqueRate: totalUniqueWithinScopes / totalGenerated,
  minUniquePer100: minUnique,
  maxDuplicateFrequency,
  scopes,
}, null, 2));
console.log("PASS_BTD_001_CP007_LOCALIZATION_DIVERSITY_PROBE_V1");
