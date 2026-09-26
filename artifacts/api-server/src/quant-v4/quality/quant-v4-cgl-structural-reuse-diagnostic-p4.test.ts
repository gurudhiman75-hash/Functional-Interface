import assert from "node:assert/strict";
import { generateQuantV4RealExamSectionWithAdvancedMath } from "./quant-v4-real-exam-advanced-math-integration-p2";

const SECTIONS = 20;
const records:any[] = [];
for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  const section = await generateQuantV4RealExamSectionWithAdvancedMath({
    examId: "SSC_CGL_TIER_I",
    sectionIndex,
    seed: `QUANT-V4-CGL-STRUCTURAL-REUSE-P4:${sectionIndex}`,
  });
  records.push(...section.questions.filter((q:any) => q.sourceKind === "RUNTIME_GENERATED"));
}
assert.ok(records.length > 0);

function summarize(items:any[]) {
  const signatures = items.map((q:any) => String(q.normalizedStemSignature ?? "")).filter(Boolean);
  const counts = new Map<string,number>();
  for (const sig of signatures) counts.set(sig,(counts.get(sig)??0)+1);
  const duplicateItems = [...counts.values()].reduce((sum,n)=>sum+Math.max(0,n-1),0);
  return {
    records: signatures.length,
    uniqueSignatures: counts.size,
    duplicateItems,
    duplicateRate: signatures.length ? duplicateItems/signatures.length : 0,
  };
}

const packages = [...new Set(records.map((q:any)=>String(q.packageId)))].sort();
const slots = [...new Set(records.map((q:any)=>String(q.slotKind)))].sort();
const byPackage = packages.map(packageId => ({
  packageId,
  ...summarize(records.filter((q:any)=>String(q.packageId)===packageId)),
})).sort((a,b)=>b.duplicateRate-a.duplicateRate || b.duplicateItems-a.duplicateItems || a.packageId.localeCompare(b.packageId));
const bySlot = slots.map(slotKind => ({
  slotKind,
  ...summarize(records.filter((q:any)=>String(q.slotKind)===slotKind)),
})).sort((a,b)=>b.duplicateRate-a.duplicateRate || b.duplicateItems-a.duplicateItems || a.slotKind.localeCompare(b.slotKind));

console.log("QUANT_V4_CGL_STRUCTURAL_REUSE_DIAGNOSTIC_P4", JSON.stringify({
  sections: SECTIONS,
  global: summarize(records),
  bySlot,
  byPackage,
  highestReusePackages: byPackage.filter(x=>x.duplicateItems>0).slice(0,12),
  productionPromotionAuthorized: false,
  runtimeBlueprintMutationAuthorized: false,
}));
