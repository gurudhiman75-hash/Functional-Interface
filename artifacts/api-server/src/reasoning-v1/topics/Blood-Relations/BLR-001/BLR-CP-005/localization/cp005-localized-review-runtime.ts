import { generateBlrCp005FrozenBank } from "../cp005-bank";
import { generateBlrCp005LocalizedReviewBank } from "./cp005-localizer";

export function buildBlrCp005LocalizedReviewTelemetry() {
  const canonical = generateBlrCp005FrozenBank();
  const hindi = generateBlrCp005LocalizedReviewBank("hi-IN");
  const punjabi = generateBlrCp005LocalizedReviewBank("pa-IN");
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
    modelSpaceGroups: new Set(canonical.map((record) => record.groupKey)).size,
    totalEnumeratedModels: canonical.reduce((total, record) => total + record.modelSpace.modelCount, 0),
    humanLanguageReviewRequired: true,
    productDeliveryUnlocked: false,
  } as const;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildBlrCp005LocalizedReviewTelemetry(), null, 2));
}
