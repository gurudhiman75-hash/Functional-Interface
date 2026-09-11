import {
  generateLp001BatchStabilizedV3_2,
  generateLp002BatchStabilizedV3_2,
  generateLp003BatchStabilizedV3_2,
  generateLp004BatchStabilizedV3_2,
  generateLp005BatchStabilizedV3_2,
  generateLp006BatchStabilizedV3_2,
  generateLp007BatchStabilizedV3_2,
  generateLp008BatchStabilizedV3_2,
} from "./lp-001-008-stabilized-english-v3-2.ts";

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
  ["LP-001", generateLp001BatchStabilizedV3_2 as Generator],
  ["LP-002", generateLp002BatchStabilizedV3_2 as Generator],
  ["LP-003", generateLp003BatchStabilizedV3_2 as Generator],
  ["LP-004", generateLp004BatchStabilizedV3_2 as Generator],
  ["LP-005", generateLp005BatchStabilizedV3_2 as Generator],
  ["LP-006", generateLp006BatchStabilizedV3_2 as Generator],
  ["LP-007", generateLp007BatchStabilizedV3_2 as Generator],
  ["LP-008", generateLp008BatchStabilizedV3_2 as Generator],
];

function selectTwo(caselets: ReviewCaselet[]): ReviewCaselet[] {
  const first = caselets[0]!;
  const differentDifficulty = caselets.find((caselet) => caselet.difficultyBand !== first.difficultyBand);
  return differentDifficulty ? [first, differentDifficulty] : caselets.slice(0, 2);
}

function queryOnly(caselet: ReviewCaselet, child: ReviewChild): string {
  if (caselet.clues.some((clue) => child.stem.includes(clue.text))) {
    return child.stem.split("\n\n").at(-1) ?? child.stem;
  }
  return child.stem;
}

const lines: string[] = [
  "# Logic Puzzles LP-001 → LP-008 — Stabilized English Review V3.2",
  "",
  "Status: **human review candidate**",
  "",
  "V3.2 keeps all V2 puzzle semantics and option-integrity repairs. Explanations now use short, simple language with natural wording variation. Whenever two genuine possibilities remain, Case 1 and Case 2 are shown in a compact table; the next clue is then used to remove the invalid case. A clean final arrangement table follows.",
  "",
  "Only the explanation layer changes from V3.1. Assignment, scenario, stem, clues, QL, difficulty, options, answer and correct-option position remain unchanged.",
  "",
  "Option-integrity repairs remain active for LP-QL-002, LP-QL-004, LP-QL-008, LP-QL-020 and LP-QL-024.",
  "",
];

for (const [packageId, generate] of packages) {
  const candidates = generate(`lp-001-008-review-v3-2:${packageId}`, 12);
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
    lines.push("### Shared simple solution", "");
    for (const solutionLine of exemplar.explanation.lines.slice(0, -1)) lines.push(solutionLine, "");
    lines.push("### Child-specific final steps", "");
    for (const [index, child] of caselet.children.entries()) {
      lines.push(`**Q${index + 1}:** ${child.explanation.lines.at(-1)}`, "");
    }
  }
}

process.stdout.write(lines.join("\n"));
