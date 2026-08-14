import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMalCp006Wave02LearnerAuthority } from "./foundation/cp006-wave02-learner-authority";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const lines = ["# MAL-CP-006 Wave 02 — 20Q Learner Review", ""];
let number = 0;
for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const label = id.includes("INVERSE") ? "inverse" : "chain";
  for (let i = 0; i < 10; i += 1) {
    const q = generateMalCp006Wave02LearnerAuthority(id, `mal-cp006-wave02-review:${label}:${i}`);
    number += 1;
    lines.push(`## ${number}. ${label === "inverse" ? "Inverse transfer-return" : "Changed-source chain"}`, "", q.stem, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${q.answer}`, "", "**Solution**");
    q.explanation.forEach((line, index) => lines.push(`${index + 1}. ${line}`));
    lines.push("", `**Common mistake:** ${q.commonMistake}`, "", "---", "");
  }
}
const out = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "MAL-CP-006-WAVE-02-20Q-LEARNER-REVIEW.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${number} learner review questions.`);
