import { generateMalCp006Wave02FinalLearnerAuthority } from "./foundation/cp006-wave02-final-learner-authority";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const out = ["# MAL-CP-006 Wave 02 — Final 20Q Learner Review", ""];
let n = 0;
for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const label = id.includes("INVERSE") ? "inverse" : "chain";
  for (let i = 0; i < 10; i++) {
    const q = generateMalCp006Wave02FinalLearnerAuthority(id, `wave02-final-review:${label}:${i}`);
    out.push(`## ${++n}. ${label === "inverse" ? "Inverse transfer-return" : "Changed-source chain"}`, "", q.stem, "");
    q.options.forEach((x, j) => out.push(`${String.fromCharCode(65 + j)}. ${x}`));
    out.push("", `**Answer:** ${q.answer}`, "", "**Solution**");
    q.explanation.forEach((x, j) => out.push(`${j + 1}. ${x}`));
    out.push("", `**Common mistake:** ${q.commonMistake}`, "", "---", "");
  }
}
console.log(out.join("\n"));
