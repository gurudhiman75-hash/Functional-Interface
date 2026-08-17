import fs from "node:fs";
import path from "node:path";
import {
  auditMenCp010ExamRealismReviewV2,
  buildMenCp010ExamRealismReviewV2,
} from "./review-v2";
import { getMenCp010ExamRealismProfile } from "./exam-realism-profile-v2";

const records = buildMenCp010ExamRealismReviewV2();
const audit = auditMenCp010ExamRealismReviewV2();
const apiRoot = fs.existsSync(path.resolve(process.cwd(), "artifacts/api-server"))
  ? path.resolve(process.cwd(), "artifacts/api-server")
  : process.cwd();
const outputDir = path.resolve(apiRoot, "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });

const json = {
  authority: audit.authority,
  status: "EXAM_REALISM_REVIEW_V2__SSC_BENCHMARKED__PRODUCT_LOCKED",
  audit,
  records: records.map((q) => ({
    qlId: q.permanentQlId,
    sscProfile: getMenCp010ExamRealismProfile(q.permanentQlId),
    templateId: q.templateId,
    solveModeId: q.solveModeId,
    clusterId: q.clusterId,
    title: q.title,
    sourceWave: q.sourceWave,
    sourceId: q.sourceId,
    seed: q.seed,
    stem: q.stem,
    options: q.options,
    correctIndex: q.correctIndex,
    answer: q.answer,
    explanation: q.explanation,
    verification: q.verification,
  })),
};

fs.writeFileSync(
  path.join(outputDir, "men-cp010-exam-realism-review-v2.json"),
  JSON.stringify(json, null, 2),
);

const md: string[] = [
  "# MEN-CP-010 Exam Realism Review V2",
  "",
  `- Permanent QLs: ${audit.permanentQlCount}`,
  `- Review records: ${audit.reviewRecordCount}`,
  `- Records per QL: ${audit.recordsPerQl}`,
  `- Answer positions: A=${audit.correctPositions.A}, B=${audit.correctPositions.B}, C=${audit.correctPositions.C}, D=${audit.correctPositions.D}`,
  `- Exam-realism records: ${audit.examReviewRecordCount}`,
  `- Exam sources covered: ${audit.examSourcesCovered ? "PASS" : "FAIL"}`,
  `- Executable source coverage represented in review: ${audit.sourceCoverageSatisfied ? "PASS" : "FAIL"}`,
  `- Product lifecycle locked: ${audit.productLocked ? "YES" : "NO"}`,
  "",
  "> This artifact is intended for setter/editorial review. It deliberately includes both inherited formula-level states and new SSC-style chained representations.",
  "",
];

for (const [index, q] of records.entries()) {
  const profile = getMenCp010ExamRealismProfile(q.permanentQlId);
  md.push(`## ${index + 1}. ${q.permanentQlId} — ${q.title}`);
  md.push("");
  md.push(`**SSC priority:** ${profile.sscPriority} (default weight ${profile.sscDefaultWeight})`);
  md.push(`**Source:** ${q.sourceId}`);
  md.push(`**Seed:** ${q.seed}`);
  md.push("");
  md.push(q.stem);
  md.push("");
  for (const option of q.options) md.push(`- ${option.label}. ${option.display}${option.isCorrect ? " **✓**" : ""}`);
  md.push("");
  md.push(`**Answer:** ${q.answer}`);
  md.push("");
  md.push(`**Key rule:** ${q.explanation.keyRule}`);
  md.push("");
  for (const step of q.explanation.steps) md.push(`- **${step.title}:** ${step.body}`);
  md.push("");
  md.push(`**Shortcut:** ${q.explanation.shortcut}`);
  md.push("");
  md.push(`**Traps:** ${q.explanation.traps.join(" | ")}`);
  md.push("");
}

fs.writeFileSync(
  path.join(outputDir, "men-cp010-exam-realism-review-v2.md"),
  md.join("\n"),
);

console.log(JSON.stringify({ outputDir, audit }, null, 2));
