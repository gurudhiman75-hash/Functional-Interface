import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP004_FAMILIES, getCP004BreadthReport } from "./generator";

interface ReviewRow { difficulty: PunjabiDifficulty; question: PunjabiGeneratedQuestion; }
function spreadSeeds(count: number, capacity: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.floor((i * capacity) / count) + 1);
}
function family(id: string) {
  const found = CP004_FAMILIES.find((x) => x.familyId === id);
  if (!found) throw new Error(`Unknown CP004 family ${id}`);
  return found;
}

const breadth = getCP004BreadthReport();
const rows: ReviewRow[] = [];
const add = (familyId: string, difficulty: PunjabiDifficulty, count: number) => {
  const f = family(familyId);
  const capacity = breadth.capacities[familyId as keyof typeof breadth.capacities];
  for (const seed of spreadSeeds(count, capacity)) rows.push({ difficulty, question: f.generate(seed, difficulty) });
};
const addSeeds = (familyId: string, difficulty: PunjabiDifficulty, seeds: readonly number[]) => {
  const f = family(familyId);
  for (const seed of seeds) rows.push({ difficulty, question: f.generate(seed, difficulty) });
};

// F01 alternates masculine→feminine and feminine→masculine by adjacent seeds.
// Sample ten well-spread authorities in both directions so review does not hide one operation.
const f01PairCount = breadth.capacities.F01 / 2;
const f01PairIndices = spreadSeeds(10, f01PairCount).map((seed) => seed - 1);
addSeeds("F01", "Easy", f01PairIndices.flatMap((pairIndex) => [pairIndex * 2 + 1, pairIndex * 2 + 2]));
add("F02", "Easy", 20);
add("F04", "Easy", 20);
add("F05", "Easy", 20);

add("F03", "Medium", 44);
add("F06", "Medium", 24);
add("F07", "Medium", 12);

add("F08", "Hard", 32);
add("F09", "Hard", 48);

if (rows.length !== 240) throw new Error(`Expected 240 CP004 review questions, got ${rows.length}`);
const fingerprints = new Set(rows.map((row) => row.question.metadata.fingerprint));
if (fingerprints.size !== rows.length) throw new Error("CP004 review pack contains duplicate semantic fingerprints");
const easy = rows.filter((x) => x.difficulty === "Easy").length;
const medium = rows.filter((x) => x.difficulty === "Medium").length;
const hard = rows.filter((x) => x.difficulty === "Hard").length;
if (easy !== 80 || medium !== 80 || hard !== 80) throw new Error(`Unexpected CP004 distribution ${easy}/${medium}/${hard}`);
const authorityCoverage = new Set(rows.flatMap((x) => x.question.metadata.authorityIds));

const letters = ["A", "B", "C", "D"] as const;
const out: string[] = [
  "# PUN-001 CP004 — Gender & Number Forward-Port Review Pack",
  "",
  "> REVIEW ONLY — all linguistic authorities remain REVIEW_PENDING. This file does not open Question Bank/test/mock/public delivery.",
  "",
  "Distribution: **80 Easy / 80 Medium / 80 Hard**",
  "",
  `Atomic authorities: **${breadth.totalAtomicAuthorities}** = ${breadth.genderAuthorityCount} gender pairs + ${breadth.numberAuthorityCount} number pairs + ${breadth.agreementContextCount} agreement contexts`,
  "",
  `Families: **${breadth.familyCount}** · computed semantic capacity: **${breadth.totalSemanticCapacity.toLocaleString("en-US")}** content combinations (option-order permutations excluded).`,
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
  q.options.forEach((option, i) => out.push(`${letters[i]}. ${option}`));
  out.push("");
  out.push(`**Answer:** ${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`);
  out.push("");
  out.push(`**Explanation:** ${q.explanation}`);
  out.push("");
  out.push(`_Subtype: ${q.metadata.subtype} · Authorities: ${q.metadata.authorityIds.join(", ")} · Fingerprint: ${q.metadata.fingerprint}_`);
  out.push("");
});

const outputPath = resolve(process.cwd(), "review-output/PUN-001-CP004-FORWARD-PORT-REVIEW-240.md");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, out.join("\n"), "utf8");
console.log(outputPath);
