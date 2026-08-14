import { generateMalCp006Wave02FinalAuthorityV3 } from "./foundation/cp006-wave02-final-authority-v3";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const blocks: string[] = [
  "# MAL-CP-006 Wave 02 — V3 Stem-Diversity Review",
  "",
  "This review deliberately shows every one of the 8 stem structures for each of the 2 Wave 02 learner families. It is an editorial review artifact only; no permanent QL or delivery activation is implied.",
  "",
];

let number = 1;
for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const byShape = new Map<number, ReturnType<typeof generateMalCp006Wave02FinalAuthorityV3>>();
  for (let i = 0; i < 5000 && byShape.size < 8; i += 1) {
    const q = generateMalCp006Wave02FinalAuthorityV3(id, `wave02-v3-review:${id}:${i}`);
    if (!byShape.has(q.stemShape)) byShape.set(q.stemShape, q);
  }
  if (byShape.size !== 8) throw new Error(`${id}: could not collect all 8 stem shapes`);

  for (const shape of [...byShape.keys()].sort((a, b) => a - b)) {
    const q = byShape.get(shape)!;
    blocks.push(`## Q${number} — ${id} — stem shape ${shape + 1}/8`);
    blocks.push("");
    blocks.push(q.stem);
    blocks.push("");
    q.options.forEach((option, index) => {
      blocks.push(`${String.fromCharCode(65 + index)}. ${option}`);
    });
    blocks.push("");
    blocks.push(`<details><summary>Answer and calculation-first solution</summary>`);
    blocks.push("");
    blocks.push(`**Answer:** ${q.answer}`);
    blocks.push("");
    q.explanation.forEach((line, index) => blocks.push(`${index + 1}. ${line}`));
    blocks.push("");
    blocks.push(`**Common mistake:** ${q.commonMistake}`);
    blocks.push("");
    blocks.push(`</details>`);
    blocks.push("");
    number += 1;
  }
}

console.log(blocks.join("\n"));
