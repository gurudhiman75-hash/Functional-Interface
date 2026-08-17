import fs from "node:fs";
import path from "node:path";
import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import {
  auditMenCp012PermanentEnglishReviewV1,
  buildMenCp012PermanentEnglishReviewV1,
} from "./review-v1";

const review = buildMenCp012PermanentEnglishReviewV1();
const audit = auditMenCp012PermanentEnglishReviewV1();
const outputDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });

const records = review.map((question, index) => ({
  reviewIndex: index + 1,
  permanentQlId: question.permanentQlId,
  clusterId: question.clusterId,
  title: question.title,
  templateId: question.templateId,
  solveModeId: question.solveModeId,
  sourceKind: question.sourceKind,
  sourceId: question.sourceId,
  sourceAuthority: question.sourceAuthority,
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
  authority: "MEN-CP012-PERMANENT-ENGLISH-REVIEW-V1",
  status: "PERMANENT_ENGLISH_RUNTIME_CANDIDATE__HUMAN_REVIEW_REQUIRED__PRODUCT_LOCKED",
  permanentQlRange: "MEN-002-QL-150..MEN-002-QL-162",
  audit,
  allocation: MEN_CP_012_PERMANENT_ALLOCATION.map((row) => ({
    qlId: row.qlId,
    clusterId: row.clusterId,
    title: row.title,
    coreEvidenceIds: row.coreEvidenceIds,
    representationEvidenceIds: row.representationEvidenceIds,
  })),
  records,
};

fs.writeFileSync(path.join(outputDir, "men-cp012-permanent-english-review-v1.json"), JSON.stringify(evidence, null, 2));

const markdown = [
  "# MEN-CP-012 Permanent English Runtime Candidate — Source-complete Review V1",
  "",
  `- Permanent QLs: ${audit.permanentQlCount}`,
  `- Review records: ${audit.reviewRecordCount}`,
  `- Source coverage: ${audit.coveredSourceCount}/${audit.declaredSourceCount}`,
  `- Unique stems: ${audit.uniqueStemCount}`,
  `- Answer positions: A=${audit.correctPositions.A}, B=${audit.correctPositions.B}, C=${audit.correctPositions.C}, D=${audit.correctPositions.D}`,
  `- English frozen: false`,
  `- Product activation: locked`,
  "",
  ...records.flatMap((record) => [
    `## ${record.reviewIndex}. ${record.permanentQlId} — ${record.title}`,
    "",
    `**Cluster:** ${record.clusterId}`,
    `**Source:** ${record.sourceKind} / ${record.sourceId}`,
    `**Source authority:** ${record.sourceAuthority}`,
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

fs.writeFileSync(path.join(outputDir, "men-cp012-permanent-english-review-v1.md"), markdown);
console.log(JSON.stringify({ outputDir, audit }, null, 2));
