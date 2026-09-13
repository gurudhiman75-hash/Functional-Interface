import { generateLp006ProjectionBatchV2 } from "./lp-006-projection-extension-v2.ts";

const caselets = generateLp006ProjectionBatchV2("lp-006-projection-v2-review", 8);

console.log("# LP-006 — Cross-Attribute Projection Extension V2 — English Review\n");
console.log("Status: **PROVISIONAL REVIEW ONLY**. Candidate identities `LP-QL-045` and `LP-QL-046` remain unallocated. Existing LP-006 QLs 021–024 and hidden puzzle semantics are unchanged.\n");
console.log("V2 changes only learner-facing explanation sequencing so Step 1 genuinely starts the solution and later steps do not restart it.\n");

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
    child.explanation.lines.forEach((line) => console.log(`${line}\n`));
  }
}
