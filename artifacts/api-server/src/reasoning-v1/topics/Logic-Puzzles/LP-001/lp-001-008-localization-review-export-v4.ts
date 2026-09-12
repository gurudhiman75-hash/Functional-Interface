import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4,
  LP_001_008_LOCALIZED_GENERATORS_V4,
} from "./lp-001-008-localization-v4.ts";
import type { Lp001008LocalizedCaselet, Lp001008LocalizedLanguage } from "./lp-001-008-localization-v1.ts";

const LANGUAGE_LABEL: Record<Lp001008LocalizedLanguage, string> = { hi: "Hindi", pa: "Punjabi" };

function question(child: Lp001008LocalizedCaselet["children"][number], index: number): string {
  return [
    `#### Q${index + 1} — ${child.qlId}`, "", child.stem, "",
    ...child.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "", `**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}`, "",
  ].join("\n");
}

function renderCaselet(caselet: Lp001008LocalizedCaselet): string {
  return [
    `## ${caselet.packageId} — ${LANGUAGE_LABEL[caselet.language]} — ${caselet.caseletId}`, "",
    `- Profile: \`${caselet.scenarioProfileId}\``, `- Difficulty: **${caselet.difficultyBand}**`, `- Language: \`${caselet.language}\``, "",
    "### Setup as shown to the learner", "", caselet.scenario, "",
    "### Clues as shown to the learner", "", ...caselet.learnerFacingClues.map((clue, index) => `${index + 1}. ${clue}`), "",
    "### Child questions", "", ...caselet.children.map(question),
    "### Shared solution shown with the questions", "", caselet.children[0]!.explanation.lines.join("\n\n"), "", "---", "",
  ].join("\n");
}

const output = [
  "# Logic Puzzles LP-001 → LP-008 — Hindi/Punjabi Localization Review V4", "",
  `Authority: \`${LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.authorityId}\``,
  `Frozen English source: \`${LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.sourceEnglishAuthorityId}\``, "",
  "This is a **human-review candidate only**. Hindi/Punjabi are not frozen and are not enabled in Question Studio yet.", "",
  "V4 keeps V2 target parity and V3 native option/name cleanup, then fixes LP-003 ordinal/case/plural grammar and makes LP-004 selection wording gender-neutral consistently in clues, explanations and Punjabi tables.", "",
  "Review focus:",
  "- natural exam-style Hindi/Punjabi;",
  "- complete domains before clues;",
  "- semantic clue parity with frozen English V4.2;",
  "- dependency-driven explanation order;",
  "- progressive `?` tables and genuine case tables;",
  "- exact question-target and correct-answer parity;",
  "- LP-003 native ordinal, case and singular/plural wording;",
  "- LP-004 gender-neutral selection wording throughout learner-facing content.", "", "---", "",
];

for (const [packageId, generator] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V4)) {
  for (const language of ["hi", "pa"] as const) {
    output.push(renderCaselet(generator(language, `localization-review-v4:${packageId}:${language}`, 1)[0]!));
  }
}
process.stdout.write(output.join("\n"));
