import {
  generateLp001BatchStabilizedV4_1,
  generateLp002BatchStabilizedV4_1,
  generateLp003BatchStabilizedV4_1,
  generateLp004BatchStabilizedV4_1,
  generateLp005BatchStabilizedV4_1,
  generateLp006BatchStabilizedV4_1,
  generateLp007BatchStabilizedV4_1,
  generateLp008BatchStabilizedV4_1,
} from "./lp-001-008-stabilized-english-v4-1.ts";

type ReviewChild = { questionId: string; qlId: string; stem: string; options: string[]; correctIndex: number; answer: string; difficultyBand: string; explanation: { lines: string[] } };
type ReviewCaselet = { caseletId: string; scenario: string; scenarioProfileId: string; difficultyBand: string; clues: readonly { text: string }[]; children: readonly ReviewChild[] };
type Generator = (seed: string, count: number) => ReviewCaselet[];

const packages: readonly [string, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV4_1 as Generator], ["LP-002", generateLp002BatchStabilizedV4_1 as Generator],
  ["LP-003", generateLp003BatchStabilizedV4_1 as Generator], ["LP-004", generateLp004BatchStabilizedV4_1 as Generator],
  ["LP-005", generateLp005BatchStabilizedV4_1 as Generator], ["LP-006", generateLp006BatchStabilizedV4_1 as Generator],
  ["LP-007", generateLp007BatchStabilizedV4_1 as Generator], ["LP-008", generateLp008BatchStabilizedV4_1 as Generator],
];
function selectTwo(caselets: ReviewCaselet[]): ReviewCaselet[] { const first = caselets[0]!; const differentDifficulty = caselets.find((caselet) => caselet.difficultyBand !== first.difficultyBand); return differentDifficulty ? [first, differentDifficulty] : caselets.slice(0, 2); }
const lines: string[] = [
  "# Logic Puzzles LP-001 → LP-008 — Stabilized English Review V4.1", "", "Status: **human review candidate**", "",
  "V4 keeps every variable domain explicit and solves clues in a useful dependency order rather than copying their printed order.", "",
  "V4.1 also improves LP-001 clue presentation. Because LP-001 always has exactly three groups, a negative exclusion such as ‘A is not in Group 3’ is shown positively as ‘A is assigned to either Group 1 or Group 2’. This preserves the same logic while making the clue easier to use.", "",
  "The planner begins with a strong anchor or a clue that has a strong connected follow-up, then follows connected clues that narrow or fill the working table. Preparatory clues are not given useless standalone table steps; they are carried into the next connected deduction.", "",
  "Working cells show a fixed value when forced, a narrowed candidate set when useful, and `?` only while the full domain remains open. When exactly two complete arrangements remain, both are shown as Case 1 / Case 2 tables and the discriminating clue removes the invalid case.", "",
  "Puzzle assignments, QLs, difficulty, option-integrity repairs, answers and correct-option positions remain unchanged.", "",
];
for (const [packageId, generate] of packages) {
  const candidates = generate(`lp-001-008-review-v3-3:${packageId}`, 12);
  const selected = selectTwo(candidates);
  lines.push(`# ${packageId}`, "");
  for (const caselet of selected) {
    lines.push(`## ${caselet.caseletId} — ${caselet.difficultyBand} — ${caselet.scenarioProfileId}`, "");
    lines.push("### Complete setup", "", caselet.scenario, "");
    lines.push("### Clues as shown in the question", "", ...caselet.clues.map((clue, index) => `${index + 1}. ${clue.text}`), "");
    lines.push("### Child questions", "");
    for (const [index, child] of caselet.children.entries()) {
      lines.push(`#### Q${index + 1} — ${child.qlId}`, "", child.stem, "");
      child.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
      lines.push("", `**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}`, "");
    }
    const exemplar = caselet.children[0]!;
    lines.push("### Shared solution — clues reordered for solving", "");
    for (const solutionLine of exemplar.explanation.lines.slice(0, -1)) lines.push(solutionLine, "");
    lines.push("### Child-specific final steps", "");
    for (const [index, child] of caselet.children.entries()) lines.push(`**Q${index + 1}:** ${child.explanation.lines.at(-1)}`, "");
  }
}
process.stdout.write(lines.join("\n"));
