import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2 } from "./geometry-permanent-multilingual-review-proof-v2";
import { GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1 } from "./geometry-permanent-multilingual-freeze-v1";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-permanent-multilingual-freeze-v1");
mkdirSync(outputDirectory, { recursive: true });

const evidence = Object.freeze({
  status: "GEOMETRY_PERMANENT_MULTILINGUAL_FREEZE_V1_EVIDENCE",
  authorityRevision: 3,
  reviewProof: GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2,
  freezeAuthority: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1,
});
writeFileSync(
  resolve(outputDirectory, "geometry-permanent-multilingual-freeze-v1.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);

const markdown = [
  "# ExamTree Geometry — Permanent Hindi/Punjabi Freeze V1",
  "",
  `**Permanent QLs:** ${GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount}`,
  `**Mapped prototype variants:** ${GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount}`,
  `**Locales:** ${GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales.join(", ")}`,
  `**Approved V2 review artifact:** ${GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.approvedReviewArtifactId}`,
  `**Approved digest:** ${GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.approvedReviewArtifactDigest}`,
  "",
  "The explicitly approved Hindi/Punjabi V2 learner-facing implementation is frozen without changing question, option, answer, explanation or diagram content.",
  "",
  "Question Studio, Question Bank, test eligibility, public publication and PR merge remain locked until later lifecycle gates.",
  "",
  `Post-proof next gate: **${GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.postProofNextGate}**.`,
  "",
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-permanent-multilingual-freeze-v1.md"), markdown);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_PERMANENT_MULTILINGUAL_FREEZE_V1",
  permanentQlCount: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount,
  locales: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales,
  approvedReviewArtifactId: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.approvedReviewArtifactId,
  outputDirectory,
  postProofNextGate: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.postProofNextGate,
}));
