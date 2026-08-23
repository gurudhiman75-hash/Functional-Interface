import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { renderSea002Cp007ExamRealStem } from "./exam-real-stem-v2.ts";
import {
  generateSea002Cp007ProductionCaselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v1.ts";
import { renderSea002Cp007TeacherExplanation } from "./teacher-explanation-v1.ts";

const AUTHORITIES = [
  "CP007-AUTH-01",
  "CP007-AUTH-02",
  "CP007-AUTH-03",
  "CP007-AUTH-04",
] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];

const rows: string[] = [
  "# SEA-002 / SEA-CP-007 — English Review Candidate V1",
  "",
  "Status: **HUMAN REVIEW CANDIDATE / NO PERMANENT QL ALLOCATION / NO PRODUCT ACTIVATION**",
  "",
  "24 caselets = 6 per candidate authority. This export is for learner-surface review only.",
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
    rows.push(renderSea002Cp007TeacherExplanation(caselet));
    rows.push("");
  }
}

const output = "artifacts/api-server/dist/reasoning-v1/sea-002-cp007-english-review-v1.md";
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${rows.join("\n")}\n`, "utf8");
console.log("PASS_SEA002_CP007_ENGLISH_REVIEW_EXPORT_V1");
console.log("review caselets", ordinal);
console.log("candidate authorities", AUTHORITIES.length);
console.log("renderer", "EXAM_REAL_COMPACT_V2");
console.log("permanent QLs allocated", 0);
console.log("output", output);
