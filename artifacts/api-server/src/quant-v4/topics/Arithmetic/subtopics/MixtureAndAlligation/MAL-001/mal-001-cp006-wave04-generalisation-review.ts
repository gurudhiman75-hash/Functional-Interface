import {
  generateMalCp006Wave04Generalisation,
  MAL_CP006_WAVE04_VARIANT_IDS,
  type MalCp006Wave04Question,
} from "./foundation/cp006-wave04-within-identity-generalisation";

function collectEightShapes(variantId: (typeof MAL_CP006_WAVE04_VARIANT_IDS)[number]): MalCp006Wave04Question[] {
  const byShape = new Map<number, MalCp006Wave04Question>();
  for (let i = 0; i < 20000 && byShape.size < 8; i += 1) {
    const q = generateMalCp006Wave04Generalisation(
      variantId,
      `mal-cp006-wave04-review:${variantId}:${i}`,
    );
    if (q.validation.ok && !byShape.has(q.stemShape)) byShape.set(q.stemShape, q);
  }
  if (byShape.size !== 8) throw new Error(`${variantId}: could not collect all eight stem shapes`);
  return [...byShape.values()].sort((a, b) => a.stemShape - b.stemShape);
}

const lines: string[] = [
  "# MAL-CP-006 Wave 04 — Within-Identity Generalisation Review",
  "",
  "These are extensions of two already-retained CP006 identities. They do not create new prototype IDs or permanent QLs.",
  "",
];

let qNo = 1;
for (const variantId of MAL_CP006_WAVE04_VARIANT_IDS) {
  lines.push(`## ${variantId}`, "");
  for (const q of collectEightShapes(variantId)) {
    lines.push(`### Q${qNo} — stem ${q.stemShape + 1} — ${q.objectContextId} — ${q.containerObject}`, "");
    lines.push(q.stem, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", "<details><summary>Answer and calculation-first solution</summary>", "");
    lines.push(`**Answer:** ${q.answer}`, "");
    q.explanation.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    lines.push("", `**Common mistake:** ${q.commonMistake}`, "", "</details>", "");
    qNo += 1;
  }
}

console.log(lines.join("\n"));
