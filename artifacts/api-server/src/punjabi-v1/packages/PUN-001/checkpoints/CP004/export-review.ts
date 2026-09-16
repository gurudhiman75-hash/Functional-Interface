import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CP004_FAMILIES } from "./generator";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../../../../../../review-output/PUN-001-CP004-FORWARD-PORT-REVIEW-240.md");
const questions = Array.from({ length: 240 }, (_, index) => {
  const family = CP004_FAMILIES[index % CP004_FAMILIES.length]!;
  const difficulty = family.targetDifficulties[0]!;
  return family.generate(Math.floor(index / CP004_FAMILIES.length) + 1, difficulty);
});

const familyCounts = new Map<string, number>();
for (const q of questions) familyCounts.set(q.metadata.familyId, (familyCounts.get(q.metadata.familyId) ?? 0) + 1);

const lines: string[] = [
  "# PUN-001 CP004 Forward-Port Review — 240 Questions",
  "",
  "> Topic: **ਲਿੰਗ ਅਤੇ ਵਚਨ**",
  "> Lifecycle: **REVIEW_ONLY** — this pack is for editorial approval, not production promotion.",
  "",
  "## Family coverage",
  "",
  ...CP004_FAMILIES.map((family) => `- ${family.familyId} — ${family.name}: ${familyCounts.get(family.familyId) ?? 0}`),
  "",
];

questions.forEach((q, index) => {
  lines.push(`## Q${index + 1} · ${q.metadata.familyId} · ${q.difficulty}`);
  lines.push("");
  lines.push(q.stem);
  lines.push("");
  q.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  lines.push("");
  lines.push(`**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.options[q.correctIndex]}`);
  lines.push(`**Explanation:** ${q.explanation}`);
  lines.push(`**Authority:** ${q.metadata.authorityIds.join(", ")}`);
  lines.push(`**Fingerprint:** ${q.metadata.fingerprint}`);
  lines.push("");
});

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${questions.length} CP004 review questions to ${out}`);
