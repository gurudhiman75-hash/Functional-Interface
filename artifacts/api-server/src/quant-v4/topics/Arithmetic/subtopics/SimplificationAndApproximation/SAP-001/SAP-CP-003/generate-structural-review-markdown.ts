import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import {
  SAP_CP003_PERMANENT_ALLOCATION,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
} from "./permanent-runtime/runtime";
import { generateSapCp003ReviewRecords } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-003-300-STRUCTURAL-REVIEW-V3.md");
const records = generateSapCp003ReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const titleByPrototype = new Map(SAP_CP003_PERMANENT_ALLOCATION.map((entry) => [entry.prototypeId, entry.title]));
const sequence = records.map((record) => record.correctIndex);
const positionCounts = [0, 1, 2, 3].map((position) => sequence.filter((value) => value === position).length);
let forwardCycleTransitions = 0;
let cyclicFourWindows = 0;
let maximumSamePositionRun = 0;
let currentRun = 0;
let previous: number | undefined;
const fourGrams = new Map<string, number>();

for (let index = 0; index < sequence.length; index += 1) {
  const value = sequence[index]!;
  currentRun = value === previous ? currentRun + 1 : 1;
  maximumSamePositionRun = Math.max(maximumSamePositionRun, currentRun);
  previous = value;
  if (index > 0 && value === ((sequence[index - 1]! + 1) % 4)) forwardCycleTransitions += 1;
  if (index <= sequence.length - 4) {
    const start = value;
    if (
      sequence[index + 1] === (start + 1) % 4
      && sequence[index + 2] === (start + 2) % 4
      && sequence[index + 3] === (start + 3) % 4
    ) cyclicFourWindows += 1;
    const key = sequence.slice(index, index + 4).join("");
    fourGrams.set(key, (fourGrams.get(key) ?? 0) + 1);
  }
}

const mockUseCounts = new Map<string, number>();
const releaseTierCounts = new Map<string, number>();
for (const record of records) {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[record.prototypeId];
  mockUseCounts.set(policy.mockUse, (mockUseCounts.get(policy.mockUse) ?? 0) + 1);
  releaseTierCounts.set(policy.releaseTier, (releaseTierCounts.get(policy.releaseTier) ?? 0) + 1);
}

const lines: string[] = [
  "# SAP-CP-003 — 300-Question Structural Review V3",
  "",
  "**Checkpoint:** Decimals, Percentages and Exact Representation Switching  ",
  "**Permanent QLs:** SAP-QL-034 through SAP-QL-052  ",
  "**Status:** Editorial remediation V3 candidate; human review pending  ",
  "**Product lifecycle:** Inactive  ",
  "",
  "## Corpus integrity snapshot",
  "",
  `- Questions: ${records.length}`,
  `- Correct A/B/C/D: ${positionCounts.join(" / ")}`,
  `- Forward-cycle transitions: ${forwardCycleTransitions} of ${sequence.length - 1} (${((forwardCycleTransitions / (sequence.length - 1)) * 100).toFixed(1)}%)`,
  `- Cyclic four-answer windows: ${cyclicFourWindows}`,
  `- Distinct four-answer patterns: ${fourGrams.size}`,
  `- Maximum same-position run: ${maximumSamePositionRun}`,
  "",
  "## Release-tier distribution",
  "",
  ...[...releaseTierCounts.entries()].sort().map(([tier, count]) => `- ${tier}: ${count}`),
  "",
  "## Mock-use distribution",
  "",
  ...[...mockUseCounts.entries()].sort().map(([use, count]) => `- ${use}: ${count}`),
  "",
  "---",
  "",
];

for (const record of records) {
  const ql = SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[record.prototypeId];
  const policy = SAP_CP003_EXAM_READINESS_POLICY[record.prototypeId];
  lines.push(
    `## ${record.questionId} — ${ql}`,
    "",
    `**Authority:** ${titleByPrototype.get(record.prototypeId) ?? record.prototypeId}  `,
    `**Difficulty:** ${record.difficulty}  `,
    `**Release tier:** ${policy.releaseTier}  `,
    `**Mock use:** ${policy.mockUse}  `,
    `**Structural risk:** ${policy.structuralRisk}  `,
    "",
    record.stem,
    "",
  );
  record.options.forEach((option, index) => lines.push(`${labels[index]}. ${option.value}`));
  lines.push(
    "",
    `**Answer:** ${labels[record.correctIndex]}. ${record.correctAnswer}`,
    "",
    `**Mock guidance:** ${policy.mockWeightGuidance}`,
    "",
    "---",
    "",
  );
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_SAP_CP003_STRUCTURAL_REVIEW_V3",
  outputPath,
  questionCount: records.length,
  answerPositionCounts: { A: positionCounts[0], B: positionCounts[1], C: positionCounts[2], D: positionCounts[3] },
  forwardCycleTransitions,
  forwardCycleRate: Number((forwardCycleTransitions / (sequence.length - 1)).toFixed(4)),
  cyclicFourWindows,
  distinctFourGrams: fourGrams.size,
  maximumSamePositionRun,
  lifecycle: "INACTIVE_HUMAN_REVIEW_PENDING",
}, null, 2));
