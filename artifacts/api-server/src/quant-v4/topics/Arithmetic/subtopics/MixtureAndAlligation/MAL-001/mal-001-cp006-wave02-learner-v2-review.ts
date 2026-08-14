import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMalCp006Wave02LearnerAuthorityV2 } from "./foundation/cp006-wave02-learner-authority-v2";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const lines = ["# MAL-CP-006 Wave 02 — Final 20Q Learner Review V2", ""];
let number = 0;
for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const label = id.includes("INVERSE") ? "inverse" : "chain";
  for (let i = 0; i < 10; i += 1) {
    const q = generateMalCp006Wave02LearnerAuthorityV2(id, `mal-cp006-wave02-v2-review:${label}:${i}`);
    number++;
    lines.push(`## ${number}. ${label === "inverse" ? "Inverse transfer-return" : "Changed-source chain"}`, "", q.stem, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${q.answer}`, "", "**Solution**");
    q.explanation.forEach((line, index) => lines.push(`${index + 1}. ${line}`));
    lines.push("", `**Common mistake:** ${q.commonMistake}`, "", "---", "");
  }
}
const out = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "MAL-CP-006-WAVE-02-FINAL-20Q-LEARNER-REVIEW-V2.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${number} V2 learner review questions.`);
