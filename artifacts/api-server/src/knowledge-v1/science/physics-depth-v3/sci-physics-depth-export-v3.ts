import fs from "node:fs";
import path from "node:path";
import { SCI_PHYSICS_DEPTH_V3_TARGETS } from "./sci-physics-depth-generator-v3";
import { generatePhysicsDepthReviewedCpV3, auditPhysicsDepthReviewedV3 } from "./sci-physics-depth-reviewed-v3";

const outDir = path.resolve(process.cwd(), "dist/science-review/SCI-PHYSICS-DEPTH-V3");
fs.mkdirSync(outDir, { recursive: true });
const audit = auditPhysicsDepthReviewedV3();
if (!audit.valid) throw new Error(audit.errors.join("; "));

const lines: string[] = [
  "# Science Physics Depth V3 — CP001 to CP004",
  "",
  "Status: **REVIEW-ONLY CANDIDATE V3**",
  "",
  `New solver-backed questions: **${audit.totalQuestions}**`,
  "",
  "This layer extends Physics Exhaustive V2 with true parameterized/application generation. Option shuffles and wording-only paraphrases are not counted as capacity.",
  "",
  "## Capacity summary",
  "",
  "| CP | V3 questions | Solver/application families | Correct positions |",
  "| --- | ---: | ---: | --- |",
];

for (const cpId of Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS) as Array<keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS>) {
  lines.push(`| ${cpId} | ${audit.cpCounts[cpId]} | ${audit.cpFamilyCounts[cpId]} | ${audit.cpAnswerPositions[cpId].join("/")} |`);
}
lines.push("", "Combined Physics V2 + this V3 wave: **4,008 meaningful semantic/generated questions**.", "");

for (const cpId of Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS) as Array<keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS>) {
  const questions = generatePhysicsDepthReviewedCpV3(cpId);
  lines.push(`# ${cpId}`, "");
  let currentFamily = "";
  for (const question of questions) {
    if (question.familyId !== currentFamily) {
      currentFamily = question.familyId;
      lines.push(`## ${question.family}`, "");
    }
    lines.push(`### ${question.questionId} · ${question.difficulty}`, "", question.stem, "");
    question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.canonicalAnswer}`, "", `**Explanation:** ${question.explanation}`, "");
  }
}

const mdPath = path.join(outDir, "SCI-PHYSICS-DEPTH-V3-CP001-CP004-REVIEW.md");
const jsonPath = path.join(outDir, "SCI-PHYSICS-DEPTH-V3-CP001-CP004.json");
fs.writeFileSync(mdPath, `${lines.join("\n")}\n`, "utf8");
fs.writeFileSync(jsonPath, JSON.stringify({ audit, targets: SCI_PHYSICS_DEPTH_V3_TARGETS }, null, 2), "utf8");
console.log(`Wrote ${mdPath}`);
console.log(`Wrote ${jsonPath}`);
