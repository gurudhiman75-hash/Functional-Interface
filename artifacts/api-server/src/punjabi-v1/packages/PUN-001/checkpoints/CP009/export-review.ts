import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateCP009ReviewBatch } from "./generator";

const batch = generateCP009ReviewBatch(120, 13000);
const outPath = resolve(process.cwd(), "dist/PUN-001-CP009-V2-REVIEW-120.md");
mkdirSync(dirname(outPath), { recursive: true });

const letters = ["A", "B", "C", "D"];
const lines: string[] = [];
lines.push("# PUN-001 CP009 V2 — Review File (120 Questions)");
lines.push("");
lines.push("**Topic:** ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ  ");
lines.push("**Review seed:** 13000  ");
lines.push("**Distribution:** 40 Easy · 40 Medium · 40 Hard  ");
lines.push("**Families:** F01–F08 under semantic difficulty routing  ");
lines.push("");
lines.push("---");
lines.push("");

batch.questions.forEach((q, index) => {
  lines.push(`## Q${index + 1}. [${q.difficulty}] [${q.metadata.familyId}]`);
  lines.push("");
  lines.push(q.stem);
  lines.push("");
  q.options.forEach((option, optionIndex) => {
    lines.push(`${letters[optionIndex]}. ${option}`);
  });
  lines.push("");
  lines.push(`**Answer:** ${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`);
  lines.push("");
  lines.push(`**Explanation:** ${q.explanation}`);
  lines.push("");
  lines.push(`_ID: ${q.id} · Authority: ${q.metadata.authorityIds.join(", ")} · Fingerprint: ${q.metadata.fingerprint}_`);
  lines.push("");
  lines.push("---");
  lines.push("");
});

writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${batch.questions.length} questions to ${outPath}`);
