import { generateLp009DaySchedulingV3 } from "./lp-009-day-scheduling-v3.ts";

const caselets = generateLp009DaySchedulingV3("lp-009-day-v3-review", 12);

console.log("# LP-009 — Day-Based Scheduling V3 English Review\n");
console.log("Status: **HUMAN_REVIEW_CANDIDATE**. No new permanent QL is allocated. V3 reuses LP-QL-033..036 and supersedes the V2 review surface only; frozen LP-009 month/year authority remains unchanged.\n");
console.log("V3 removes duplicated setup openings and rejects weak Easy/Medium topologies that rely too heavily on direct placements.\n");

for (const caselet of caselets) {
  console.log(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}\n`);
  console.log("### Complete setup\n");
  console.log(`${caselet.questionSetup}\n`);
  console.log("### Clues as shown in the question\n");
  caselet.clues.forEach((clue, index) => console.log(`${index + 1}. ${clue.text}`));
  console.log("\n### Child questions\n");

  for (const [childIndex, child] of caselet.children.entries()) {
    const question = child.stem.slice(child.stem.lastIndexOf("\n\n") + 2);
    console.log(`**Q${childIndex + 1} — ${child.qlId}**\n`);
    console.log(`${question}\n`);
    child.options.forEach((option, optionIndex) => {
      const correct = optionIndex === child.correctIndex ? "  ← correct" : "";
      console.log(`${String.fromCharCode(65 + optionIndex)}. ${option}${correct}`);
    });
    console.log("\n**Explanation**\n");
    child.explanation.lines.forEach((line) => console.log(`${line}\n`));
  }
}
