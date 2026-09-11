import { generateLp011BatchStabilizedV1_2 } from "./lp-011-stabilized-v1-2.ts";

const caselets = generateLp011BatchStabilizedV1_2("lp-011-human-review-v1-2", 12);

console.log("# LP-011 — Box-and-Attribute Stack Puzzle — English Review V1.2\n");
console.log("Candidate QLs: `LP-QL-041..044`  ");
console.log("Status: **HUMAN REVIEW ONLY — NOT PERMANENTLY ALLOCATED**\n");
console.log("This review pack tests the new two-axis stack family: vertical box order + one independent attribute per box.\n");

for (const [caseletIndex, caselet] of caselets.entries()) {
  console.log(`## Caselet ${caseletIndex + 1} — ${caselet.difficultyBand} — ${caselet.scenarioProfileId}\n`);
  console.log(`### Complete setup\n\n${caselet.scenario}\n`);
  console.log("### Clues as shown in the question\n");
  caselet.clues.forEach((clue, index) => console.log(`${index + 1}. ${clue.text}`));
  console.log("\n### Child questions\n");
  caselet.children.forEach((child, index) => {
    console.log(`#### Q${index + 1} — ${child.qlId}\n`);
    console.log(`${child.stem}\n`);
    child.options.forEach((option, optionIndex) => console.log(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
    console.log(`\n**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}\n`);
  });
  console.log("### Shared solution — clues reordered for solving\n");
  const shared = caselet.children[0]!.explanation.lines.slice(0, -1);
  for (const line of shared) console.log(`${line}\n`);
  console.log("### Child-specific answer steps\n");
  caselet.children.forEach((child) => console.log(`- **${child.qlId}:** ${child.explanation.lines.at(-1)!.replace(/\n+/g, " ")}\n`));
  console.log("---\n");
}
