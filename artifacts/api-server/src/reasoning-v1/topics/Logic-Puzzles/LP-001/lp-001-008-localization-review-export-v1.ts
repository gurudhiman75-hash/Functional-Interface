import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1,
  LP_001_008_LOCALIZED_GENERATORS_V1,
  type Lp001008LocalizedCaselet,
  type Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v1.ts";

const LANGUAGE_LABEL: Record<Lp001008LocalizedLanguage, string> = { hi: "Hindi", pa: "Punjabi" };

function block(title: string, value: string): string {
  return `### ${title}\n\n${value.trim()}\n`;
}

function question(caselet: Lp001008LocalizedCaselet, child: Lp001008LocalizedCaselet["children"][number], index: number): string {
  return [
    `#### Q${index + 1} — ${child.qlId}`,
    "",
    child.stem,
    "",
    ...child.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}`,
    "",
  ].join("\n");
}

function renderCaselet(caselet: Lp001008LocalizedCaselet): string {
  const first = caselet.children[0]!;
  return [
    `## ${caselet.packageId} — ${LANGUAGE_LABEL[caselet.language]} — ${caselet.caseletId}`,
    "",
    `- Profile: \`${caselet.scenarioProfileId}\``,
    `- Difficulty: **${caselet.difficultyBand}**`,
    `- Language: \`${caselet.language}\``,
    "",
    block("Setup as shown to the learner", caselet.scenario),
    "### Clues as shown to the learner",
    "",
    ...caselet.learnerFacingClues.map((clue, index) => `${index + 1}. ${clue}`),
    "",
    "### Child questions",
    "",
    ...caselet.children.map((child, index) => question(caselet, child, index)),
    "### Shared solution shown with the questions",
    "",
    first.explanation.lines.join("\n\n"),
    "",
    "---",
    "",
  ].join("\n");
}

const output: string[] = [
  "# Logic Puzzles LP-001 → LP-008 — Hindi/Punjabi Localization Review V1",
  "",
  `Authority: \`${LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.authorityId}\``,
  `Frozen English source: \`${LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId}\``,
  "",
  "This is a **human-review candidate only**. Hindi/Punjabi are not frozen and are not enabled in Question Studio yet.",
  "",
  "Review focus:",
  "- natural exam-style Hindi/Punjabi rather than literal translation;",
  "- all variables/domains stated before the clues;",
  "- same semantic clue logic as frozen English V4.2;",
  "- strongest/connected clues used first in explanations;",
  "- progressive tables with `?` placeholders;",
  "- genuine Case 1 / Case 2 handling where the frozen English solution uses cases;",
  "- options, correct position and difficulty unchanged semantically.",
  "",
  "---",
  "",
];

for (const [packageId, generator] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V1)) {
  for (const language of ["hi", "pa"] as const) {
    const caselet = generator(language, `localization-review-v1:${packageId}:${language}`, 1)[0]!;
    output.push(renderCaselet(caselet));
  }
}

process.stdout.write(output.join("\n"));
