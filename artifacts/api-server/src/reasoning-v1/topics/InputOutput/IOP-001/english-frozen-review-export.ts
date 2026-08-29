import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { IOP_001_ENGLISH_FREEZE_AUTHORITY } from "./english-freeze-authority.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";

const outputDir = process.env.IOP_ENGLISH_REVIEW_OUTPUT_DIR ?? "/tmp/iop-english-frozen-review";
process.env.IOP_ENGLISH_REVIEW_OUTPUT_DIR = outputDir;

await import("./english-review-export.ts");

const htmlPath = join(outputDir, "IOP-001-ENGLISH-PERMANENT-REVIEW.html");
const jsonPath = join(outputDir, "IOP-001-ENGLISH-PERMANENT-REVIEW.json");

let html = await readFile(htmlPath, "utf8");
html = html.replace(
  "ENGLISH_REVIEW_CANDIDATE · English not frozen · Question Studio OFF.",
  "ENGLISH_FROZEN · Human-approved English freeze · Question Studio OFF.",
);
await writeFile(htmlPath, html, "utf8");

const parsed = JSON.parse(await readFile(jsonPath, "utf8")) as {
  status: string;
  caselets: IopEnglishProductionCaselet[];
  [key: string]: unknown;
};
for (const caselet of parsed.caselets) {
  if (caselet.lifecycle.maturity !== "ENGLISH_FROZEN" || !caselet.lifecycle.englishFreeze) {
    throw new Error(`Frozen export received an unfrozen caselet ${caselet.caseletId}`);
  }
  if (caselet.lifecycle.questionStudioDiscoverable
    || caselet.lifecycle.questionBankWritable
    || caselet.lifecycle.testEligible
    || caselet.lifecycle.publiclyPublishable) {
    throw new Error(`Frozen export leaked product activation for ${caselet.caseletId}`);
  }
}
parsed.status = "ENGLISH_FROZEN";
parsed.englishFreeze = true;
parsed.englishHumanApproval = "APPROVED_2026_08_18";
parsed.freezeAuthority = {
  reviewedHead: IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedHead,
  reviewedArtifactId: IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedArtifactId,
  reviewedArtifactDigest: IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedArtifactDigest,
  learnerContentChangeAllowedWithoutNewApproval: false,
};
await writeFile(jsonPath, JSON.stringify(parsed, null, 2), "utf8");

console.log("PASS_IOP_001_ENGLISH_FROZEN_REVIEW_EXPORT");
console.log(`output ${outputDir}`);
console.log(`caselets ${parsed.caselets.length}`);
console.log(`questions ${parsed.caselets.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
console.log("English freeze true");
console.log("Question Studio false");
