import { generateBlrCp004FrozenBank } from "../cp004-bank";
import { generateBlrCp004LocalizedReviewBank } from "./cp004-localizer";

export function buildBlrCp004LocalizedReviewTelemetry() {
  const canonical = generateBlrCp004FrozenBank();
  const hindi = generateBlrCp004LocalizedReviewBank("hi-IN");
  const punjabi = generateBlrCp004LocalizedReviewBank("pa-IN");
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
    humanLanguageReviewRequired: true,
    productDeliveryUnlocked: false,
  } as const;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildBlrCp004LocalizedReviewTelemetry(), null, 2));
}
