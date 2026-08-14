import {
  generateMalCp006Wave02FinalAuthorityV4,
  MAL_CP006_WAVE02_CONTAINER_OBJECTS,
  MAL_CP006_WAVE02_OBJECT_CONTEXTS,
  type MalCp006Wave02FinalQuestionV4,
} from "./foundation/cp006-wave02-final-authority-v4";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

function findReviewQuestion(
  prototypeId: (typeof MAL_CP006_WAVE02_PROTOTYPE_IDS)[number],
  contextId: (typeof MAL_CP006_WAVE02_OBJECT_CONTEXTS)[number]["id"],
  targetContainer: (typeof MAL_CP006_WAVE02_CONTAINER_OBJECTS)[number],
): MalCp006Wave02FinalQuestionV4 {
  for (let i = 0; i < 10000; i += 1) {
    const seed = `mal-cp006-wave02-v4-review:${prototypeId}:${contextId}:${targetContainer}:${i}`;
    const q = generateMalCp006Wave02FinalAuthorityV4(prototypeId, seed);
    if (q.objectContextId === contextId && q.containerObject === targetContainer && q.validation.ok) return q;
  }
  throw new Error(`Unable to find review question for ${prototypeId} / ${contextId} / ${targetContainer}`);
}

const lines: string[] = [
  "# MAL-CP-006 Wave 02 V4 — Object Pool Review",
  "",
  "This review deliberately shows every approved material context in both Wave 02 families. Container wording is also rotated. Stem-structure diversity is audited independently at 8 structures per family; this file is focused on whether the learner object/context pool is broad and natural.",
  "",
  `Material contexts: ${MAL_CP006_WAVE02_OBJECT_CONTEXTS.map((x) => x.id).join(", ")}`,
  `Container objects: ${MAL_CP006_WAVE02_CONTAINER_OBJECTS.join(", ")}`,
  "",
];

let n = 1;
for (const prototypeId of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  lines.push(`## Family: ${prototypeId}`, "");
  const observedShapes = new Set<number>();
  for (let contextIndex = 0; contextIndex < MAL_CP006_WAVE02_OBJECT_CONTEXTS.length; contextIndex += 1) {
    const context = MAL_CP006_WAVE02_OBJECT_CONTEXTS[contextIndex];
    const targetContainer = MAL_CP006_WAVE02_CONTAINER_OBJECTS[contextIndex % MAL_CP006_WAVE02_CONTAINER_OBJECTS.length];
    const q = findReviewQuestion(prototypeId, context.id, targetContainer);
    observedShapes.add(q.stemShape);
    lines.push(`### Q${n} — ${q.objectContextId} — ${q.containerObject} — stem ${q.stemShape + 1}`, "");
    lines.push(q.stem, "");
    for (let i = 0; i < q.options.length; i += 1) lines.push(`${String.fromCharCode(65 + i)}. ${q.options[i]}`);
    lines.push("", "<details><summary>Answer and calculation-first solution</summary>", "");
    lines.push(`**Answer:** ${q.answer}`, "");
    q.explanation.forEach((line, i) => lines.push(`${i + 1}. ${line}`));
    lines.push("", `**Common mistake:** ${q.commonMistake}`, "", "</details>", "");
    n += 1;
  }
  lines.push(`Review sample stem structures observed in this family: ${[...observedShapes].sort((a, b) => a - b).map((x) => x + 1).join(", ")}.`, "");
}

console.log(lines.join("\n"));
