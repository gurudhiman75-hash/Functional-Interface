import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp003Sweep } from "../editorial-runtime";
import {
  SAP_CP003_PERMANENT_ALLOCATION,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
} from "../permanent-runtime/runtime";
import { generateSapCp003ReviewRecords } from "../review-export";
import { SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE } from "./candidate";

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function generatedSurface(pkg: ReturnType<typeof generateSapCp003Sweep>[number]): unknown {
  return {
    prototypeId: pkg.prototypeId,
    seed: pkg.seed,
    difficulty: pkg.difficulty,
    difficultyScore: pkg.difficultyScore,
    taskDirection: pkg.taskDirection,
    answerSemantic: pkg.answerSemantic,
    stem: pkg.stem,
    canonicalAnswer: pkg.canonicalAnswer,
    options: pkg.options.map((option) => ({
      value: option.value,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
      analysis: option.analysis,
    })),
    correctIndex: pkg.correctIndex,
    explanation: pkg.explanation,
  };
}

function reviewSurface(record: ReturnType<typeof generateSapCp003ReviewRecords>[number]): unknown {
  return {
    questionId: record.questionId,
    prototypeId: record.prototypeId,
    difficulty: record.difficulty,
    stem: record.stem,
    options: record.options.map((option) => ({
      value: option.value,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
      analysis: option.analysis,
    })),
    correctIndex: record.correctIndex,
    correctAnswer: record.correctAnswer,
  };
}

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-003-ENGLISH-MANUAL-FREEZE-CANDIDATE.md");
const generated = generateSapCp003Sweep(100);
const review = generateSapCp003ReviewRecords();
const generatedSurfaceDigest = sha256(generated.map(generatedSurface));
const reviewSurfaceDigest = sha256(review.map(reviewSurface));
const authorityByPrototype = new Map(SAP_CP003_PERMANENT_ALLOCATION.map((item) => [item.prototypeId, item]));

const lines: string[] = [
  "# SAP-CP-003 — English Manual-Freeze Candidate",
  "",
  `**Locale:** ${SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.locale}  `,
  `**Permanent QLs:** ${SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.permanentQlRange}  `,
  `**Candidate status:** ${SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.status}  `,
  `**Approval boundary:** ${SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.approvalBoundary}  `,
  `**Source approved head:** \`${SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.sourceApprovedHead}\`  `,
  `**Source merge commit:** \`${SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.sourceMergeCommit}\`  `,
  "",
  "This candidate fingerprints the exact approved English question, option, answer, distractor-analysis, difficulty and explanation surface. It does not declare the manual freeze final and does not activate any product lifecycle capability.",
  "",
  "## Exact-surface fingerprints",
  "",
  `- Generated packages checked: ${generated.length}`,
  `- Approved review questions checked: ${review.length}`,
  `- Generated-surface SHA-256: \`${generatedSurfaceDigest}\``,
  `- Review-surface SHA-256: \`${reviewSurfaceDigest}\``,
  "",
  "## Permanent-QL coverage",
  "",
  "| QL | Authority | Packages | Review questions | Easy | Medium | Hard | Surface digest |",
  "|---|---|---:|---:|---:|---:|---:|---|",
];

for (const allocation of SAP_CP003_PERMANENT_ALLOCATION) {
  const prototypeId = allocation.prototypeId;
  const qlId = SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[prototypeId];
  const packages = generated.filter((pkg) => pkg.prototypeId === prototypeId);
  const reviewItems = review.filter((record) => record.prototypeId === prototypeId);
  const digest = sha256(packages.map(generatedSurface));
  const easy = packages.filter((pkg) => pkg.difficulty === "EASY").length;
  const medium = packages.filter((pkg) => pkg.difficulty === "MEDIUM").length;
  const hard = packages.filter((pkg) => pkg.difficulty === "HARD").length;
  const authority = authorityByPrototype.get(prototypeId)!;
  lines.push(`| ${qlId} | ${authority.title} | ${packages.length} | ${reviewItems.length} | ${easy} | ${medium} | ${hard} | \`${digest}\` |`);
}

lines.push(
  "",
  "## Freeze declaration boundary",
  "",
  "The following remain false until a separate explicit freeze declaration and later lifecycle approvals:",
  "",
  "```text",
  "active:                      false",
  "questionStudioDiscoverable:  false",
  "questionBankWritable:        false",
  "testEligible:                false",
  "publiclyPublishable:         false",
  "localisation:                not started by this candidate",
  "English manual freeze:       not yet declared",
  "```",
  "",
  "## Required next decision",
  "",
  "Explicit product-owner approval is required to convert this candidate into the final English manual freeze. No implicit approval is inferred from the earlier editorial approval or merge.",
  "",
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"), "utf8");

console.log(JSON.stringify({
  status: "WROTE_SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE_REPORT",
  outputPath,
  generatedPackages: generated.length,
  reviewQuestions: review.length,
  generatedSurfaceDigest,
  reviewSurfaceDigest,
  approvalBoundary: SAP_CP003_ENGLISH_MANUAL_FREEZE_CANDIDATE.approvalBoundary,
  lifecycle: "INACTIVE_FREEZE_NOT_YET_DECLARED",
}, null, 2));
