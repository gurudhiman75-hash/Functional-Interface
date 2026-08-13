import { writeFileSync } from "node:fs";

import {
  buildRnkCp007CategoryCompositionProductionCandidate,
  RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION,
  rnkCp007CategoryCompositionCandidateProjectionSha256,
} from "./cp007-category-composition-production-candidate-v1";

const OUTPUT = process.argv[2] ?? "RNK-CP-007-CATEGORY-COMPOSITION-PRODUCTION-CANDIDATE-REVIEW-24Q.md";
const letters = ["A", "B", "C", "D"] as const;
const corpus = buildRnkCp007CategoryCompositionProductionCandidate();

const laneA = [0, 9, 18, 27, 36, 45] as const;
const laneB = [2, 11, 20, 29, 38, 47] as const;
const selected = [
  ...laneA.map((offset) => corpus[offset]!),
  ...laneB.map((offset) => corpus[48 + offset]!),
  ...laneA.map((offset) => corpus[96 + offset]!),
  ...laneB.map((offset) => corpus[144 + offset]!),
];
if (selected.length !== 24) throw new Error(`Expected 24 review questions, found ${selected.length}`);

const answerPositions = [0, 0, 0, 0];
for (const question of selected) answerPositions[question.answerIndex] += 1;
if (answerPositions.some((count) => count !== 6)) {
  throw new Error(`Review answer positions not balanced: ${answerPositions.join("/")}`);
}

const projectionSha256 = rnkCp007CategoryCompositionCandidateProjectionSha256(corpus);
const lines: string[] = [];
lines.push("# RNK-CP-007 — Category Composition Production Candidate Review (24 Questions)");
lines.push("");
lines.push(`Candidate version: \`${RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION}\``);
lines.push("");
lines.push("Status: **production candidate only — RNK-QL-042 remains unallocated**.");
lines.push("");
lines.push("Ownership candidate: `CATEGORY_COMPOSITION_AROUND_RANK`. Derived-quantity source forms have been removed from QL candidacy and retained only as adapters into existing Ranking authorities.");
lines.push("");
lines.push(`Full candidate projection (unpinned): \`${projectionSha256}\``);
lines.push("");
lines.push(`Review answer positions: ${answerPositions.join(" / ")}.`);
lines.push("");
lines.push("## Part A — Questions");
lines.push("");

selected.forEach((question, index) => {
  lines.push(`### Q${index + 1}. ${question.mode}`);
  lines.push("");
  lines.push(question.stem);
  lines.push("");
  question.options.forEach((option, optionIndex) => lines.push(`${letters[optionIndex]}. ${option}`));
  lines.push("");
});

lines.push("---");
lines.push("");
lines.push("## Part B — Answers and Explanations");
lines.push("");

selected.forEach((question, index) => {
  lines.push(`### Q${index + 1}`);
  lines.push("");
  lines.push(`**Answer:** ${letters[question.answerIndex]} — ${question.answer}`);
  lines.push("");
  lines.push(`**Difficulty:** ${question.difficulty}`);
  lines.push("");
  lines.push(`**Explanation:** ${question.explanation}`);
  lines.push("");
  lines.push(`**Distractor models:** ${question.reviewMetadata.editorialProfile.distractorKinds.join(", ")}`);
  lines.push("");
  lines.push(`**Context:** ${question.reviewMetadata.partitionId}; target=${question.reviewMetadata.targetName}`);
  lines.push("");
  lines.push(`**Fingerprint:** \`${question.mathematicalFingerprint}\``);
  lines.push("");
});

lines.push("---");
lines.push("");
lines.push("## Freeze lock");
lines.push("");
lines.push("```text");
lines.push("candidate questions:      192");
lines.push("permanent QL allocated:   false");
lines.push("next available QL:        RNK-QL-042");
lines.push("English freeze:           false");
lines.push("Question Studio:          DISABLED");
lines.push("persistence:              DISABLED");
lines.push("public publication:       false");
lines.push("Hindi/Punjabi:            NOT_STARTED");
lines.push("```");

writeFileSync(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "PASS",
  output: OUTPUT,
  questions: selected.length,
  answerPositions,
  projectionSha256,
  projectionPinned: false,
  permanentQlAllocated: false,
}, null, 2));
