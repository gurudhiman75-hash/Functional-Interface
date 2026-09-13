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

const rows: ReviewRow[] = [];

for (let seed = 1; seed <= 80; seed++) {
  rows.push({ difficulty: "Easy", question: generateCP002F01(seed, "Easy") });
}
for (let seed = 1; seed <= 40; seed++) {
  rows.push({ difficulty: "Medium", question: generateCP002F02(seed, "Medium") });
}
for (let seed = 1; seed <= 20; seed++) {
  rows.push({ difficulty: "Medium", question: generateCP002F03(seed + 80, "Medium") });
  rows.push({ difficulty: "Medium", question: generateCP002F06(seed + 160, "Medium") });
}
for (let seed = 1; seed <= 30; seed++) {
  rows.push({ difficulty: "Hard", question: generateCP002F04(seed, "Hard") });
  rows.push({ difficulty: "Hard", question: generateCP002F05(seed + 120, "Hard") });
}
for (let seed = 1; seed <= 20; seed++) {
  rows.push({ difficulty: "Hard", question: generateCP002F07(seed + 240, "Hard") });
}

if (rows.length !== 240) throw new Error(`Expected 240 review questions, got ${rows.length}`);
const fingerprints = new Set(rows.map((row) => row.question.metadata.fingerprint));
if (fingerprints.size !== rows.length) throw new Error("Review pack contains duplicate semantic fingerprints");

const breadth = getCP002BreadthReport();
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
