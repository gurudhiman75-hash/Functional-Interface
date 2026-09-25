import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion } from "../../../../core/types";
import { CP003_FAMILIES, getCP003BreadthReport } from "./generator";

interface ReviewRow { difficulty: PunjabiDifficulty; question: PunjabiGeneratedQuestion; }
function spreadSeeds(count: number, capacity: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.floor((i * capacity) / count) + 1);
}
function family(id: string) {
  const found = CP003_FAMILIES.find((x) => x.familyId === id);
  if (!found) throw new Error(`Unknown CP003 family ${id}`);
  return found;
}

const breadth = getCP003BreadthReport();
const rows: ReviewRow[] = [];
const add = (familyId: string, difficulty: PunjabiDifficulty, count: number) => {
  const f = family(familyId);
  const capacity = breadth.capacities[familyId as keyof typeof breadth.capacities];
  for (const seed of spreadSeeds(count, capacity)) rows.push({ difficulty, question: f.generate(seed, difficulty) });
};

add("F01", "Easy", 38);
add("F02", "Easy", 38);
add("F03", "Easy", 4);

add("F04", "Medium", 16);
add("F05", "Medium", 20);
add("F06", "Medium", 16);
add("F07", "Medium", 14);
add("F08", "Medium", 14);

add("F09", "Hard", 20);
add("F10", "Hard", 20);
add("F11", "Hard", 20);
add("F12", "Hard", 20);

if (rows.length !== 240) throw new Error(`Expected 240 CP003 review questions, got ${rows.length}`);
const fingerprints = new Set(rows.map((row) => row.question.metadata.fingerprint));
if (fingerprints.size !== rows.length) throw new Error("CP003 review pack contains duplicate semantic fingerprints");
const easy = rows.filter((x) => x.difficulty === "Easy").length;
const medium = rows.filter((x) => x.difficulty === "Medium").length;
const hard = rows.filter((x) => x.difficulty === "Hard").length;
if (easy !== 80 || medium !== 80 || hard !== 80) throw new Error(`Unexpected CP003 distribution ${easy}/${medium}/${hard}`);
const authorityCoverage = new Set(rows.flatMap((x) => x.question.metadata.authorityIds));

const letters = ["A", "B", "C", "D"] as const;
const out: string[] = [
  "# PUN-001 CP003 — Exhaustive Noun & Pronoun Review Pack",
  "",
  "> REVIEW ONLY — checkpoint HUMAN_APPROVED; authority provenance flags remain REVIEW_PENDING. Question Bank/test/mock/public delivery stays closed.",
  "",
  "Distribution: **80 Easy / 80 Medium / 80 Hard**",
  "",
  `Atomic authorities: **${breadth.totalAtomicAuthorities}** = ${breadth.nounAuthorityCount} noun + ${breadth.pronounContextAuthorityCount} contextual pronoun + ${breadth.pronounInflectionAuthorityCount} pronoun-inflection relations`,
  "",
  `Taxonomy: **${breadth.nounCategoryCount} noun classes · ${breadth.pronounCategoryCount} pronoun classes · ${breadth.familyCount} semantic families**`,
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
  q.options.forEach((option, i) => out.push(`${letters[i]}. ${option}`));
  out.push("");
  out.push(`**Answer:** ${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`);
  out.push("");
  out.push(`**Explanation:** ${q.explanation}`);
  out.push("");
  out.push(`_Subtype: ${q.metadata.subtype} · Authorities: ${q.metadata.authorityIds.join(", ")} · Fingerprint: ${q.metadata.fingerprint}_`);
  out.push("");
});

const outputPath = resolve(process.cwd(), "review-output/PUN-001-CP003-FORWARD-PORT-REVIEW-240.md");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, out.join("\n"), "utf8");
console.log(outputPath);
