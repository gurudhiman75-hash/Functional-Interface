import {
  generateLp001BatchStabilizedV2,
  generateLp002BatchStabilizedV2,
  generateLp003BatchStabilizedV2,
  generateLp004BatchStabilizedV2,
  generateLp005BatchStabilizedV2,
  generateLp006BatchStabilizedV2,
  generateLp007BatchStabilizedV2,
  generateLp008BatchStabilizedV2,
} from "./lp-001-008-stabilized-english-v2.ts";

type ReviewChild = {
  questionId: string;
  qlId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: string;
  explanation: { lines: string[] };
};

type ReviewCaselet = {
  caseletId: string;
  scenario: string;
  scenarioProfileId: string;
  difficultyBand: string;
  clues: readonly { text: string }[];
  children: readonly ReviewChild[];
  questionSetup?: string;
};

type Generator = (seed: string, count: number) => ReviewCaselet[];

const packages: readonly [string, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV2 as Generator],
  ["LP-002", generateLp002BatchStabilizedV2 as Generator],
  ["LP-003", generateLp003BatchStabilizedV2 as Generator],
  ["LP-004", generateLp004BatchStabilizedV2 as Generator],
  ["LP-005", generateLp005BatchStabilizedV2 as Generator],
  ["LP-006", generateLp006BatchStabilizedV2 as Generator],
  ["LP-007", generateLp007BatchStabilizedV2 as Generator],
  ["LP-008", generateLp008BatchStabilizedV2 as Generator],
];

function selectTwo(caselets: ReviewCaselet[]): ReviewCaselet[] {
  const first = caselets[0]!;
  const differentDifficulty = caselets.find((caselet) => caselet.difficultyBand !== first.difficultyBand);
  return differentDifficulty ? [first, differentDifficulty] : caselets.slice(0, 2);
}

function queryOnly(caselet: ReviewCaselet, child: ReviewChild): string {
  if (caselet.clues.some((clue) => child.stem.includes(clue.text))) {
    const parts = child.stem.split("\n\n");
    return parts.at(-1) ?? child.stem;
  }
  return child.stem;
}

const lines: string[] = [
  "# Logic Puzzles LP-001 → LP-008 — Stabilized English Review V2",
  "",
  "Status: **human review candidate**",
  "",
  "This pack preserves the current English puzzle assignments, scenarios, displayed clues, QLs, difficulty labels, correct answers and correct-option positions. It upgrades explanations to clue-by-clue progressive tables and repairs ambiguous or giveaway distractors where the older generators did not guarantee one defensible MCQ answer.",
  "",
  "Option-integrity repairs apply to LP-QL-002, LP-QL-004, LP-QL-008, LP-QL-020 and LP-QL-024. All other QLs retain their existing option semantics.",
  "",
  "Every runtime child question remains standalone. To avoid repeating the same setup four times in this editorial file, each caselet shows the common setup/clues once, then its four child queries. The shared arrangement solution is also shown once; runtime children each receive the same clue-by-clue steps plus their own final answer step.",
  "",
];

for (const [packageId, generate] of packages) {
  const candidates = generate(`lp-001-008-review-v2:${packageId}`, 12);
  const selected = selectTwo(candidates);
  lines.push(`# ${packageId}`, "");

  for (const caselet of selected) {
    lines.push(`## ${caselet.caseletId} — ${caselet.difficultyBand} — ${caselet.scenarioProfileId}`, "");
    lines.push("### Setup", "", caselet.questionSetup ?? caselet.scenario, "");
    lines.push("### Clues", "", ...caselet.clues.map((clue) => `- ${clue.text}`), "");
    lines.push("### Child questions", "");
    for (const [index, child] of caselet.children.entries()) {
      lines.push(`#### Q${index + 1} — ${child.qlId}`, "", queryOnly(caselet, child), "");
      child.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
      lines.push("", `**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}`, "");
    }

    const exemplar = caselet.children[0]!;
    lines.push("### Shared clue-by-clue solution", "");
    for (const solutionLine of exemplar.explanation.lines.slice(0, -1)) lines.push(solutionLine, "");
    lines.push("### Child-specific final steps", "");
    for (const [index, child] of caselet.children.entries()) {
      lines.push(`**Q${index + 1}:** ${child.explanation.lines.at(-1)}`, "");
    }
  }
}

process.stdout.write(lines.join("\n"));
