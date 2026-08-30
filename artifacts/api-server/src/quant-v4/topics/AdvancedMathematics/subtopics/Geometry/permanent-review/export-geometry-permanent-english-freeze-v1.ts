import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1 } from "./geometry-permanent-english-review-proof-v1";
import { GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1 } from "./geometry-permanent-english-freeze-v1";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-permanent-english-freeze-v1");
mkdirSync(outputDirectory, { recursive: true });

const evidence = Object.freeze({
  status: "GEOMETRY_PERMANENT_ENGLISH_FREEZE_V1_EVIDENCE",
  authorityRevision: 3,
  reviewProof: GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1,
  freezeAuthority: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1,
});
writeFileSync(
  resolve(outputDirectory, "geometry-permanent-english-freeze-v1.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);

const markdown = [
  "# ExamTree Geometry — Permanent English Freeze V1",
  "",
  `**Permanent QLs:** ${GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlCount}`,
  `**Mapped English prototype variants:** ${GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount}`,
  `**Approved review artifact:** ${GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.approvedReviewArtifactId}`,
  `**Approved digest:** ${GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.approvedReviewArtifactDigest}`,
  "",
  "The approved learner-facing English implementation is frozen without changing question, option, answer, explanation or diagram content.",
  "",
  "Question Studio, Question Bank, test eligibility and public publication remain locked.",
  "",
  `Post-proof next gate: **${GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.postProofNextGate}**.`,
  "",
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-permanent-english-freeze-v1.md"), markdown);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_PERMANENT_ENGLISH_FREEZE_V1",
  permanentQlCount: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount,
  approvedReviewArtifactId: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.approvedReviewArtifactId,
  outputDirectory,
  postProofNextGate: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.postProofNextGate,
}));
