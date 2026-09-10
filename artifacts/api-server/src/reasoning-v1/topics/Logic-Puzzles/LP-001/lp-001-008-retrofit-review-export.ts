import {
  generateLp001BatchRetrofitV1,
  generateLp002BatchRetrofitV1,
  generateLp003BatchRetrofitV1,
  generateLp004BatchRetrofitV1,
  generateLp005BatchRetrofitV1,
  generateLp006BatchRetrofitV1,
  generateLp007BatchRetrofitV1,
  generateLp008BatchRetrofitV1,
} from "./lp-001-008-explanation-retrofit-v1.ts";

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
  ["LP-001", generateLp001BatchRetrofitV1 as Generator],
  ["LP-002", generateLp002BatchRetrofitV1 as Generator],
  ["LP-003", generateLp003BatchRetrofitV1 as Generator],
  ["LP-004", generateLp004BatchRetrofitV1 as Generator],
  ["LP-005", generateLp005BatchRetrofitV1 as Generator],
  ["LP-006", generateLp006BatchRetrofitV1 as Generator],
  ["LP-007", generateLp007BatchRetrofitV1 as Generator],
  ["LP-008", generateLp008BatchRetrofitV1 as Generator],
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
  "# Logic Puzzles LP-001 → LP-008 — English Explanation Retrofit Review V1",
  "",
  "Status: **human review candidate**",
  "",
  "This pack changes **explanations only**. Hidden assignments, stems, displayed clues, QLs, difficulty, options and correct answers are preserved from the current English generators.",
  "",
  "Every runtime child question remains standalone. To avoid repeating the same setup four times in this editorial file, each caselet shows the common setup/clues once, then its four child queries. The shared arrangement solution is also shown once; runtime children each receive the same clue-by-clue steps plus their own final answer step.",
  "",
];

for (const [packageId, generate] of packages) {
  const candidates = generate(`lp-001-008-review-v1:${packageId}`, 12);
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
