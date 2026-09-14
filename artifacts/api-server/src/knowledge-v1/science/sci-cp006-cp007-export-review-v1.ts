import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateSciCp006ReviewBatchV1 } from "./sound/sci-cp006-review-v1";
import { generateSciCp007ReviewBatchV1 } from "./light-optics/sci-cp007-review-v1";

const rows = [...generateSciCp006ReviewBatchV1(), ...generateSciCp007ReviewBatchV1()];
const outDir = join(process.cwd(), "dist", "science-review", "SCI-CP006-CP007-V1");
await mkdir(outDir, { recursive: true });

let md = "# SCI-CP-006 + SCI-CP-007 Review V1\n\n";
md += "Review-only qualification batch. No runtime promotion is enabled.\n\n";
for (const cpId of ["SCI-CP-006","SCI-CP-007"]) {
  const cpRows = rows.filter(q => q.cpId === cpId);
  md += `## ${cpId}\n\n`;
  let currentQl = "";
  for (const q of cpRows) {
    if (q.qlId !== currentQl) {
      currentQl = q.qlId;
      md += `### ${q.qlId} — ${q.qlName}\n\n`;
    }
    md += `**${q.questionId} — ${q.difficulty}**\n\n${q.stem}\n\n`;
    q.options.forEach((o,i) => { md += `${String.fromCharCode(65+i)}. ${o}${i === q.correctIndex ? " ✅" : ""}\n`; });
    md += `\n**Answer:** ${String.fromCharCode(65+q.correctIndex)} — ${q.canonicalAnswer}\n\n`;
    md += `**Explanation:** ${q.explanation}\n\n`;
  }
}
await writeFile(join(outDir, "SCI-CP006-CP007-REVIEW-V1.md"), md, "utf8");
console.log(`Wrote ${rows.length} questions to ${outDir}`);
