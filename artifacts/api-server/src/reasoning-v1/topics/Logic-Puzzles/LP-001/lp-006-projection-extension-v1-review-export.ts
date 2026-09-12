import { generateLp006ProjectionBatchV1 } from "./lp-006-projection-extension-v1.ts";

const caselets = generateLp006ProjectionBatchV1("lp-006-projection-v1-review", 8);

console.log("# LP-006 — Cross-Attribute Projection Extension V1 — English Review\n");
console.log("Status: **PROVISIONAL REVIEW ONLY**. `LP-QL-045` and `LP-QL-046` are candidate identities and are not permanently allocated. Existing LP-006 QLs 021–024 are unchanged.\n");
console.log("This review focuses only on the new child-question projections over the already approved LP-006 solved table.\n");

for (const [caseletIndex, caselet] of caselets.entries()) {
  console.log(`## Caselet ${caseletIndex + 1} — ${caselet.difficultyBand}\n`);
  console.log(`${caselet.questionSetup}\n`);
  console.log("### Clues\n");
  caselet.clues.forEach((clue, index) => console.log(`${index + 1}. ${clue.text}`));
  console.log("");

  for (const child of caselet.projectionChildren) {
    console.log(`### ${child.qlId}\n`);
    const questionOnly = child.stem.slice(child.stem.lastIndexOf("\n\n") + 2);
    console.log(`${questionOnly}\n`);
    child.options.forEach((option, optionIndex) => console.log(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
    console.log(`\n**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}\n`);
    console.log("**Explanation**\n");
    for (const line of child.explanation.lines) console.log(`${line}\n`);
  }
}
