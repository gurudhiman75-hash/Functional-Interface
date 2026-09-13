import { generateLp009DaySchedulingV2 } from "./lp-009-day-scheduling-v2.ts";

const caselets = generateLp009DaySchedulingV2("lp-009-day-v2-human-review", 12);

const out: string[] = [
  "# LP-009 — Day-Based Scheduling V2 English Review",
  "",
  "Status: HUMAN_REVIEW_CANDIDATE. No new permanent QL is allocated. This review reuses LP-QL-033..036 and does not modify the frozen LP-009 month/year V1 authority.",
  "",
  "Review focus: complete variable/domain statement, natural exam wording, clue variety, structural Easy/Medium/Hard depth, dependency-driven explanation order, progressive tables and child-question quality.",
  "",
];

for (const caselet of caselets) {
  out.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`);
  out.push("");
  out.push("### Complete setup");
  out.push("");
  out.push(caselet.questionSetup);
  out.push("");
  out.push("### Clues as shown in the question");
  out.push("");
  caselet.clues.forEach((clue, index) => out.push(`${index + 1}. ${clue.text}`));
  out.push("");
  out.push("### Child questions");
  out.push("");
  caselet.children.forEach((child, index) => {
    out.push(`**Q${index + 1} — ${child.qlId}**`);
    out.push("");
    const question = child.stem.split("\n\n").at(-1) ?? child.stem;
    out.push(question);
    out.push("");
    child.options.forEach((option, optionIndex) => out.push(`${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === child.correctIndex ? "  ← correct" : ""}`));
    out.push("");
  });
  out.push("### Shared solution — clues reordered for solving");
  out.push("");
  const shared = caselet.children[0]!.explanation.lines.slice(0, -1);
  out.push(...shared, "");
  out.push("### Child-specific final answers");
  out.push("");
  caselet.children.forEach((child, index) => {
    out.push(`**Q${index + 1}:** ${child.explanation.lines.at(-1)}`);
    out.push("");
  });
}

process.stdout.write(`${out.join("\n")}\n`);
