import { runSea001ExternalSourceAudit } from "./saturation/source-audit.ts";

const audit = runSea001ExternalSourceAudit();
if (!audit.passed) {
  throw new Error(`SEA-001 external source audit failed: ${JSON.stringify({
    missingExamFamilies: audit.missingExamFamilies,
    missingCheckpoints: audit.missingCheckpoints,
    invalidEvidenceCount: audit.invalidEvidenceCount,
  })}`);
}
if (audit.examFamiliesCovered.length !== 4) throw new Error(`Expected four exam families, observed ${audit.examFamiliesCovered.length}`);
if (audit.checkpointsCovered.length !== 5) throw new Error(`Expected five SEA-001 checkpoints, observed ${audit.checkpointsCovered.length}`);
if (audit.officialPaperIndexedFamilies.length < 3) {
  throw new Error(`Expected official-paper-index evidence for at least SSC, Railway and Punjab; observed ${audit.officialPaperIndexedFamilies.join(",")}`);
}

console.log("PASS_SEA_001_EXTERNAL_SOURCE_AUDIT");
console.log("verified evidence records", audit.evidenceCount);
console.log("exam families", JSON.stringify(audit.examFamiliesCovered));
console.log("checkpoints", JSON.stringify(audit.checkpointsCovered));
console.log("official-paper-index families", JSON.stringify(audit.officialPaperIndexedFamilies));
console.log("limitation", audit.limitation);
console.log("design authority", "SEA V3 merged remains sole design authority");
