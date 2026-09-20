import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP001_FAMILIES, getCP001BreadthReport } from "./generator";

interface ReviewRow {
  difficulty: PunjabiDifficulty;
  question: PunjabiGeneratedQuestion;
}

function spreadSeeds(count: number, capacity: number): number[] {
  if (count > capacity) throw new Error(`Cannot sample ${count} unique items from CP001 capacity ${capacity}`);
  return Array.from({ length: count }, (_, index) => Math.floor((index * capacity) / count) + 1);
}

function family(id: string) {
  const found = CP001_FAMILIES.find((x) => x.familyId === id);
  if (!found) throw new Error(`Unknown CP001 family ${id}`);
  return found;
}

const breadth = getCP001BreadthReport();
const rows: ReviewRow[] = [];
const add = (familyId: string, difficulty: PunjabiDifficulty, count: number) => {
  const f = family(familyId);
  const capacity = breadth.capacities[familyId as keyof typeof breadth.capacities];
  for (const seed of spreadSeeds(count, capacity)) rows.push({ difficulty, question: f.generate(seed, difficulty) });
};

// Easy: use the full 10-item carrier-composition family and spread the rest across sequence/classification.
add("F01", "Easy", 35);
add("F02", "Easy", 35);
add("F04", "Easy", 10);

add("F03", "Medium", 15);
add("F05", "Medium", 15);
add("F06", "Medium", 20);
add("F07", "Medium", 10);
add("F08", "Medium", 10);
add("F09", "Medium", 10);

add("F10", "Hard", 25);
add("F11", "Hard", 30);
add("F12", "Hard", 25);

if (rows.length !== 240) throw new Error(`Expected 240 CP001 review questions, got ${rows.length}`);
const fingerprints = new Set(rows.map((row) => row.question.metadata.fingerprint));
if (fingerprints.size !== rows.length) throw new Error("CP001 review pack contains duplicate semantic fingerprints");

const easy = rows.filter((x) => x.difficulty === "Easy").length;
const medium = rows.filter((x) => x.difficulty === "Medium").length;
const hard = rows.filter((x) => x.difficulty === "Hard").length;
if (easy !== 80 || medium !== 80 || hard !== 80) throw new Error(`Unexpected CP001 distribution ${easy}/${medium}/${hard}`);

const authorityCoverage = new Set(rows.flatMap((x) => x.question.metadata.authorityIds));
const letters = ["A", "B", "C", "D"] as const;
const out: string[] = [
  "# PUN-001 CP001 — Exhaustive Gurmukhi Orthography Review Pack",
  "",
  "> REVIEW ONLY — authorities remain REVIEW_PENDING. This file does not open Question Bank/test/mock/public delivery.",
  "",
  "Distribution: **80 Easy / 80 Medium / 80 Hard**",
  "",
  `Atomic authorities: **${breadth.totalAtomicAuthorities}** (${breadth.systemAuthorityCount} system facts + ${breadth.wordAuthorityCount} word authorities)`,
  "",
  `Coverage: **35 basic letters + 6 supplementary letters · 3 vowel carriers · 10 lagan · 3 lagakhars · 3 dutt forms · 12 semantic families**`,
  "",
  `Computed semantic capacity: **${breadth.totalSemanticCapacity.toLocaleString("en-US")}** content combinations (option-order permutations excluded).`,
  "",
  `Authorities touched by this stratified review: **${authorityCoverage.size}**`,
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

const outputPath = resolve(process.cwd(), "review-output/PUN-001-CP001-FORWARD-PORT-REVIEW-240.md");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, out.join("\n"), "utf8");
console.log(outputPath);
