import fs from "node:fs";
import path from "node:path";
import { auditMenCp012PermanentMetadataV2 } from "./metadata-v2";
import {
  auditMenCp012PermanentEnglishReviewV2,
  buildMenCp012PermanentEnglishReviewV2,
} from "./review-v2";

const review = buildMenCp012PermanentEnglishReviewV2();
const audit = auditMenCp012PermanentEnglishReviewV2();
const metadataAudit = auditMenCp012PermanentMetadataV2();
const outputDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });

const records = review.map((question, index) => ({
  reviewIndex: index + 1,
  permanentQlId: question.permanentQlId,
  clusterId: question.clusterId,
  title: question.title,
  sourceKind: question.sourceKind,
  sourceId: question.sourceId,
  sourceRuntimeAuthority: question.sourceRuntimeAuthority,
  sourceAuthority: question.sourceAuthority,
  editorialAuthority: question.editorialAuthority,
  seed: question.seed,
  stem: question.stem,
  options: question.options,
  answer: question.answer,
  correctIndex: question.correctIndex,
  explanation: question.explanation,
  verification: question.verification,
  lifecycle: {
    maturity: question.maturity,
    reviewStatus: question.reviewStatus,
    englishImplementationFrozen: question.englishImplementationFrozen,
    active: question.active,
    questionStudioDiscoverable: question.questionStudioDiscoverable,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
  },
}));

const evidence = {
  authority: "MEN-CP012-PERMANENT-ENGLISH-REVIEW-V2-SETTER-HARDENED",
  status: "SETTER_HARDENED_PERMANENT_ENGLISH_CANDIDATE__NOT_FROZEN__PRODUCT_LOCKED",
  permanentQlRange: "MEN-002-QL-150..MEN-002-QL-162",
  audit,
  metadataAudit,
  records,
};
fs.writeFileSync(path.join(outputDir, "men-cp012-permanent-english-review-v2.json"), JSON.stringify(evidence, null, 2));

const md = [
  "# MEN-CP-012 Permanent English Review V2 — Setter Hardened",
  "",
  `- Review records: ${audit.reviewRecordCount}`,
  `- Permanent QLs: ${audit.permanentQlCount}`,
  `- Source coverage: ${audit.coveredSourceCount}/${audit.declaredSourceCount}`,
  `- Unique stems: ${audit.uniqueStemCount}`,
  `- Correct positions: A=${audit.correctPositions.A}, B=${audit.correctPositions.B}, C=${audit.correctPositions.C}, D=${audit.correctPositions.D}`,
  `- QL-157 answer semantic: ${metadataAudit.ql157Semantic}`,
  `- QL-159 answer semantic: ${metadataAudit.ql159Semantic}`,
  "- English frozen: false",
  "- Product activation: locked",
  "",
  ...records.flatMap((record) => [
    `## ${record.reviewIndex}. ${record.permanentQlId} — ${record.title}`,
    "",
    `**Source:** ${record.sourceKind} / ${record.sourceId}`,
    `**Source runtime authority:** ${record.sourceRuntimeAuthority}`,
    `**Effective source authority:** ${record.sourceAuthority}`,
    "",
    record.stem,
    "",
    ...record.options.map((option) => `- ${option.label}. ${option.display}${option.isCorrect ? " **✓**" : ""}`),
    "",
    `**Answer:** ${record.answer}`,
    "",
    `**Key rule:** ${record.explanation.keyRule}`,
    "",
    ...record.explanation.steps.map((step) => `- **${step.title}:** ${step.body}`),
    "",
    `**Shortcut:** ${record.explanation.shortcut}`,
    "",
    `**Traps:** ${record.explanation.traps.join(" | ")}`,
    "",
    `**Verification:** ${record.verification.method} — ${record.verification.valid ? "PASS" : "FAIL"}`,
    "",
  ]),
].join("\n");
fs.writeFileSync(path.join(outputDir, "men-cp012-permanent-english-review-v2.md"), md);
console.log(JSON.stringify({ outputDir, audit, metadataAudit }, null, 2));
