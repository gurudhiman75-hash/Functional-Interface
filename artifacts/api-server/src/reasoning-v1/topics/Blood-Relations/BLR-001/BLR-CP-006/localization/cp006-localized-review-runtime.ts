import { generateBlrCp006FrozenBank } from "../cp006-runtime";
import { generateBlrCp006LocalizedReviewBank } from "./cp006-localizer";

export function buildBlrCp006LocalizedReviewTelemetry() {
  const canonical = generateBlrCp006FrozenBank();
  const hindi = generateBlrCp006LocalizedReviewBank("hi-IN");
  const punjabi = generateBlrCp006LocalizedReviewBank("pa-IN");
  const countByQl = (records: readonly { qlId: string }[]) => {
    const counts: Record<string, number> = {};
    for (const record of records) counts[record.qlId] = (counts[record.qlId] ?? 0) + 1;
    return counts;
  };
  return {
    canonicalCount: canonical.length,
    hindiCount: hindi.length,
    punjabiCount: punjabi.length,
    localizedCount: hindi.length + punjabi.length,
    canonicalQlCounts: countByQl(canonical),
    hindiQlCounts: countByQl(hindi),
    punjabiQlCounts: countByQl(punjabi),
    codedStatementCount: canonical.reduce((total, record) => total + record.codedStatements.length, 0),
    prototypeCount: new Set(canonical.map((record) => record.sourcePrototypeId)).size,
    topologyCount: new Set(canonical.map((record) => record.topologyId)).size,
    humanLanguageReviewRequired: true,
    productDeliveryUnlocked: false,
  } as const;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildBlrCp006LocalizedReviewTelemetry(), null, 2));
}
