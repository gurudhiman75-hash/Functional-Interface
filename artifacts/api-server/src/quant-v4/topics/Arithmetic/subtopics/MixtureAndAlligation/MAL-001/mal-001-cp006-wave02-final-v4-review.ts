import {
  generateMalCp006Wave02FinalAuthorityV4,
  MAL_CP006_WAVE02_OBJECT_CONTEXTS,
  type MalCp006Wave02FinalQuestionV4,
} from "./foundation/cp006-wave02-final-authority-v4";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

function findReviewQuestion(
  prototypeId: (typeof MAL_CP006_WAVE02_PROTOTYPE_IDS)[number],
  contextId: (typeof MAL_CP006_WAVE02_OBJECT_CONTEXTS)[number]["id"],
  targetShape: number,
): MalCp006Wave02FinalQuestionV4 {
  for (let i = 0; i < 10000; i += 1) {
    const seed = `mal-cp006-wave02-v4-review:${prototypeId}:${contextId}:${i}`;
    const q = generateMalCp006Wave02FinalAuthorityV4(prototypeId, seed);
    if (q.objectContextId === contextId && q.stemShape === targetShape && q.validation.ok) return q;
  }
  throw new Error(`Unable to find review question for ${prototypeId} / ${contextId} / shape ${targetShape}`);
}

const lines: string[] = [
  "# MAL-CP-006 Wave 02 V4 — Object Pool + Stem Diversity Review",
  "",
  "This review deliberately shows every approved material context in both Wave 02 families. Each context is paired with a different stem structure, so object diversity is not being created by repeating one sentence with renamed liquids.",
  "",
  `Material contexts: ${MAL_CP006_WAVE02_OBJECT_CONTEXTS.map((x) => x.id).join(", ")}`,
  "",
];

let n = 1;
for (const prototypeId of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  lines.push(`## Family: ${prototypeId}`, "");
  for (let contextIndex = 0; contextIndex < MAL_CP006_WAVE02_OBJECT_CONTEXTS.length; contextIndex += 1) {
    const context = MAL_CP006_WAVE02_OBJECT_CONTEXTS[contextIndex];
    const q = findReviewQuestion(prototypeId, context.id, contextIndex);
    lines.push(`### Q${n} — ${q.objectContextId} — ${q.containerObject} — stem ${q.stemShape + 1}`, "");
    lines.push(q.stem, "");
    for (let i = 0; i < q.options.length; i += 1) lines.push(`${String.fromCharCode(65 + i)}. ${q.options[i]}`);
    lines.push("", "<details><summary>Answer and calculation-first solution</summary>", "");
    lines.push(`**Answer:** ${q.answer}`, "");
    q.explanation.forEach((line, i) => lines.push(`${i + 1}. ${line}`));
    lines.push("", `**Common mistake:** ${q.commonMistake}`, "", "</details>", "");
    n += 1;
  }
}

console.log(lines.join("\n"));
