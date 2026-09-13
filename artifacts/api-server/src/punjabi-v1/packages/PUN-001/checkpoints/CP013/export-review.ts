import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateCP013ReviewBatch } from "./generator";

const batch = generateCP013ReviewBatch(120, 28000);
const outPath = resolve(process.cwd(), "dist/PUN-001-CP013-V2-REVIEW-120.md");
mkdirSync(dirname(outPath), { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# PUN-001 CP013 V2 — Review File (120 Questions)", "",
  "**Topic:** ਵਾਕ-ਵਟਾਂਦਰਾ ਅਤੇ ਸ਼ੁੱਧੀ  ",
  "**Engine revision:** 2.0.0  ",
  "**Review seed:** 28000  ",
  "**Distribution:** 40 Easy · 40 Medium · 40 Hard  ",
  "**Families:** F01–F08 with semantic difficulty routing  ", "", "---", ""
];

batch.questions.forEach((q, index) => {
  lines.push(`## Q${index + 1}. [${q.difficulty}] [${q.metadata.familyId}]`, "", q.stem, "");
  q.options.forEach((option, optionIndex) => lines.push(`${letters[optionIndex]}. ${option}`));
  lines.push("", `**Answer:** ${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`, "", `**Explanation:** ${q.explanation}`, "", `_ID: ${q.id} · Authority: ${q.metadata.authorityIds.join(", ")} · Fingerprint: ${q.metadata.fingerprint}_`, "", "---", "");
});
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${batch.questions.length} questions to ${outPath}`);
