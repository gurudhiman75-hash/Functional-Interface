import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { PunjabiGeneratedQuestion } from "../../../../core/types";
import {
  generateCP002F01,
  generateCP002F02,
  generateCP002F03,
  generateCP002F04,
  generateCP002F05,
  generateCP002F06,
  generateCP002F07,
  getCP002BreadthReport,
} from "./generator";

interface ReviewRow {
  difficulty: "Easy" | "Medium" | "Hard";
  question: PunjabiGeneratedQuestion;
}

function spreadSeeds(count: number, capacity: number, phase = 0.5): number[] {
  if (count <= 0 || capacity < count) throw new Error(`Invalid review spread count=${count} capacity=${capacity}`);
  return Array.from({ length: count }, (_, index) => {
    const position = ((index + phase) * capacity) / count;
    return Math.min(capacity, Math.max(1, Math.floor(position) + 1));
  });
}

const breadth = getCP002BreadthReport();
const rows: ReviewRow[] = [];

// Easy: 80 targets distributed across the complete 375-authority corpus.
for (const seed of spreadSeeds(80, breadth.capacities.F01)) {
  rows.push({ difficulty: "Easy", question: generateCP002F01(seed, "Easy") });
}

// Medium: sentence correction and completion traverse the full contextual pool;
// F06 samples the whole quartet-combination space rather than low-ranked quartets.
for (const seed of spreadSeeds(40, breadth.capacities.F02, 0.31)) {
  rows.push({ difficulty: "Medium", question: generateCP002F02(seed, "Medium") });
}
for (const seed of spreadSeeds(20, breadth.capacities.F03, 0.67)) {
  rows.push({ difficulty: "Medium", question: generateCP002F03(seed, "Medium") });
}
for (const seed of spreadSeeds(20, breadth.capacities.F06, 0.43)) {
  rows.push({ difficulty: "Medium", question: generateCP002F06(seed, "Medium") });
}

// Hard: spread across the complete pair/state spaces for all three operations.
for (const seed of spreadSeeds(30, breadth.capacities.F04, 0.23)) {
  rows.push({ difficulty: "Hard", question: generateCP002F04(seed, "Hard") });
}
for (const seed of spreadSeeds(30, breadth.capacities.F05, 0.59)) {
  rows.push({ difficulty: "Hard", question: generateCP002F05(seed, "Hard") });
}
for (const seed of spreadSeeds(20, breadth.capacities.F07, 0.79)) {
  rows.push({ difficulty: "Hard", question: generateCP002F07(seed, "Hard") });
}

if (rows.length !== 240) throw new Error(`Expected 240 review questions, got ${rows.length}`);
const fingerprints = new Set(rows.map((row) => row.question.metadata.fingerprint));
if (fingerprints.size !== rows.length) throw new Error("Review pack contains duplicate semantic fingerprints");

const reviewedAuthorityIds = new Set(rows.flatMap((row) => [...row.question.metadata.authorityIds]));
const letters = ["A", "B", "C", "D"] as const;
const out: string[] = [
  "# PUN-001 CP002 — Exhaustive-Breadth Forward-Port Review Pack",
  "",
  "> REVIEW ONLY — lexical authorities remain REVIEW_PENDING. This file does not imply Question Bank/test/mock/public eligibility.",
  "",
  "Distribution: **80 Easy / 80 Medium / 80 Hard**",
  "",
  `Active authorities: **${breadth.authorityCount}** · Contextual authorities: **${breadth.contextualAuthorityCount}** · Orthographic categories: **${breadth.categoryCount}** · Semantic families: **7**`,
  "",
  `Computed semantic capacity: **${breadth.totalSemanticCapacity.toLocaleString("en-US")}** content combinations (option-order permutations excluded).`,
  "",
  `Reviewer sampling: **stratified across each family's full semantic capacity** · Authorities touched in this pack: **${reviewedAuthorityIds.size}**`,
  "",
];

rows.forEach((row, index) => {
  const q = row.question;
  out.push(`## ${String(index + 1).padStart(3, "0")} — ${row.difficulty} — ${q.metadata.familyId}`);
  out.push("");
  out.push(q.stem);
  out.push("");
  q.options.forEach((option, optionIndex) => out.push(`${letters[optionIndex]}. ${option}`));
  out.push("");
  out.push(`**Answer:** ${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`);
  out.push("");
  out.push(`**Explanation:** ${q.explanation}`);
  out.push("");
  out.push(`_Subtype: ${q.metadata.subtype} · Authorities: ${q.metadata.authorityIds.join(", ")} · Fingerprint: ${q.metadata.fingerprint}_`);
  out.push("");
});

const outputPath = resolve(process.cwd(), "review-output/PUN-001-CP002-FORWARD-PORT-REVIEW-240.md");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, out.join("\n"), "utf8");
console.log(outputPath);
