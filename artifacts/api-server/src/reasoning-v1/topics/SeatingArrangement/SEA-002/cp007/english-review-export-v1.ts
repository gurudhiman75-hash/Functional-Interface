import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { renderSea002Cp007ExamRealStem } from "./exam-real-stem-v2.ts";
import {
  generateSea002Cp007ProductionCaselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v2.ts";
import { renderSea002Cp007TeacherExplanationV2 } from "./teacher-explanation-v2.ts";

const AUTHORITIES = [
  "CP007-AUTH-01",
  "CP007-AUTH-02",
  "CP007-AUTH-03",
  "CP007-AUTH-04",
] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];

const RENDERER = "EXAM_REAL_VISUAL_DEDUCTION_V7_ALL_POSITIONAL_QUERIES_INFERRED" as const;

const rows: string[] = [
  "# SEA-002 / SEA-CP-007 — English Review Candidate V6",
  "",
  "Status: **HUMAN REVIEW CANDIDATE / VISUAL DEDUCTION TEACHING / ALL POSITIONAL QUERIES INFERRED / NO PRODUCT ACTIVATION**",
  "",
  "24 caselets = 6 per candidate authority. This export is for learner-surface review only.",
  "Solutions mirror paper solving: identify what is asked, derive facing/row facts, convert person-relative left/right, build and align seat blocks, show the final two-row arrangement, then read the answer.",
  "AUTH01 is hardened: the queried neighbour pair is not directly stated by any same-row clue and the reference is not the direct facing anchor.",
  "AUTH04 is hardened: the asked diagonal is not the same reference+direction+person relation stated by any diagonal clue, and the reference facing must be inferred.",
  "",
];

let ordinal = 0;
for (const authorityKey of AUTHORITIES) {
  rows.push(`## ${authorityKey}`);
  rows.push("");
  for (let sample = 0; sample < 6; sample += 1) {
    ordinal += 1;
    const width = authorityKey === "CP007-AUTH-04" ? 4 + (sample % 3) : 3 + (sample % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`english-review-v1:${authorityKey}:${sample}`, width, authorityKey);
    rows.push(`### ${ordinal}. ${caselet.caseletId} · ${width}+${width}`);
    rows.push("");
    rows.push(renderSea002Cp007ExamRealStem(caselet));
    rows.push("");
    rows.push(`**Question:** ${caselet.question}`);
    rows.push("");
    caselet.options.forEach((option, index) => rows.push(`${String.fromCharCode(65 + index)}. ${option}`));
    rows.push("");
    rows.push(`**Answer:** ${String.fromCharCode(65 + caselet.correctIndex)}. ${caselet.answer}`);
    rows.push("");
    rows.push("**Solution:**");
    rows.push("");
    rows.push(renderSea002Cp007TeacherExplanationV2(caselet));
    rows.push("");
  }
}

const reviewText = `${rows.join("\n")}\n`;
const reviewFingerprint = createHash("sha256").update(reviewText, "utf8").digest("hex");
const output = "artifacts/api-server/dist/reasoning-v1/sea-002-cp007-english-review-v1.md";
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, reviewText, "utf8");
console.log("PASS_SEA002_CP007_ENGLISH_REVIEW_EXPORT_V6_ALL_POSITIONAL_QUERIES_INFERRED");
console.log("review caselets", ordinal);
console.log("candidate authorities", AUTHORITIES.length);
console.log("renderer", RENDERER);
console.log("review fingerprint", reviewFingerprint);
console.log("review artifact product activation", false);
console.log("output", output);
