import fs from "node:fs";
import path from "node:path";
import { SCI_PHYSICS_DEPTH_V3_TARGETS } from "./sci-physics-depth-generator-v3";
import { auditPhysicsDepthReviewedV3, generatePhysicsDepthReviewedCpV3 } from "./sci-physics-depth-reviewed-v3";
import { SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3 } from "./sci-physics-depth-wave2-v3";
import { auditPhysicsDepthWave2ReviewedV3, generatePhysicsDepthWave2ReviewedCpV3 } from "./sci-physics-depth-wave2-reviewed-v3";

const outDir = path.resolve(process.cwd(), "dist/science-review/SCI-PHYSICS-DEPTH-V3-COMPLETE");
fs.mkdirSync(outDir, { recursive: true });

const wave1 = auditPhysicsDepthReviewedV3();
const wave2 = auditPhysicsDepthWave2ReviewedV3();
if (!wave1.valid) throw new Error(`Wave 1: ${wave1.errors.join("; ")}`);
if (!wave2.valid) throw new Error(`Wave 2: ${wave2.errors.join("; ")}`);

const lines: string[] = [
  "# Science Physics Depth V3 — Complete CP001 to CP010",
  "",
  "Status: **REVIEW-ONLY CANDIDATE V3**",
  "",
  "Physics Exhaustive V2 capacity: **3,480** semantic questions.",
  `Physics Depth V3 new solver/application capacity: **${wave1.totalQuestions + wave2.totalQuestions}** questions.`,
  `Current verified Physics capacity: **${3480 + wave1.totalQuestions + wave2.totalQuestions}** meaningful semantic/generated questions.`,
  "",
  "Option shuffles, punctuation changes and wording-only paraphrases are not counted.",
  "",
  "## V3 capacity by CP",
  "",
  "| CP | New V3 questions | Families | Correct positions A/B/C/D |",
  "| --- | ---: | ---: | --- |",
];

const cpIds = [
  ...Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS),
  ...Object.keys(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3),
];
for (const cpId of cpIds) {
  const fromWave1 = cpId in SCI_PHYSICS_DEPTH_V3_TARGETS;
  const audit = fromWave1 ? wave1 : wave2;
  lines.push(`| ${cpId} | ${audit.cpCounts[cpId]} | ${audit.cpFamilyCounts[cpId]} | ${audit.cpAnswerPositions[cpId].join("/")} |`);
}
lines.push("");

function appendQuestion(question: {
  questionId: string; difficulty: string; familyId: string; family: string; stem: string; options: string[]; correctIndex: number; canonicalAnswer: string; explanation: string;
}, state: { familyId: string }) {
  if (question.familyId !== state.familyId) {
    state.familyId = question.familyId;
    lines.push(`## ${question.family}`, "");
  }
  lines.push(`### ${question.questionId} · ${question.difficulty}`, "", question.stem, "");
  question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
  lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.canonicalAnswer}`, "", `**Explanation:** ${question.explanation}`, "");
}

for (const cpId of Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS) as Array<keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS>) {
  lines.push(`# ${cpId}`, "");
  const state = { familyId: "" };
  for (const q of generatePhysicsDepthReviewedCpV3(cpId)) appendQuestion(q, state);
}
for (const cpId of Object.keys(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3) as Array<keyof typeof SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3>) {
  lines.push(`# ${cpId}`, "");
  const state = { familyId: "" };
  for (const q of generatePhysicsDepthWave2ReviewedCpV3(cpId)) appendQuestion(q, state);
}

const summary = {
  v2Capacity: 3480,
  v3Capacity: wave1.totalQuestions + wave2.totalQuestions,
  totalCapacity: 3480 + wave1.totalQuestions + wave2.totalQuestions,
  wave1,
  wave2,
};

const mdPath = path.join(outDir, "SCI-PHYSICS-DEPTH-V3-CP001-CP010-REVIEW.md");
const jsonPath = path.join(outDir, "SCI-PHYSICS-DEPTH-V3-CP001-CP010-AUDIT.json");
fs.writeFileSync(mdPath, `${lines.join("\n")}\n`, "utf8");
fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), "utf8");
console.log(`Wrote ${mdPath}`);
console.log(`Wrote ${jsonPath}`);
