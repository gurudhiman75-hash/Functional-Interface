import { writeFileSync } from "node:fs";
import { generateLpCp04LocalizedBatchV3, LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3 } from "./lp-cp04-localization-v3.ts";

const seed = process.argv[2] || "lp-cp04-localization-v3-review";
const perLanguage = Math.min(12, Math.max(3, Number(process.argv[3] || 9)));
const outputPath = process.argv[4] || "lp-cp04-localization-v3-review.md";

const lines: string[] = [
  "# LP-QL-047 — Hindi / Punjabi Localization Review V3",
  "",
  `Authority: ${LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3.authorityId}`,
  "Status: HUMAN REVIEW CANDIDATE V3 — REVIEW ONLY",
  "Source English authority: LP_CP04_ENGLISH_FREEZE_V1",
  "Permanent QL: LP-QL-047",
  "",
  "> Semantic state, correct option, difficulty and parent topology are inherited from the frozen English authority. Review only the native learner-facing language and explanation clarity.",
  "",
];

for (const language of ["hi", "pa"] as const) {
  const label = language === "hi" ? "Hindi" : "Punjabi";
  lines.push(`# ${label}`);
  lines.push("");
  const caselets = generateLpCp04LocalizedBatchV3(language, `${seed}:${language}`, perLanguage);
  caselets.forEach((caselet, index) => {
    const child = caselet.counterfactualChild;
    lines.push(`## ${label} ${index + 1} — ${caselet.difficultyBand}`);
    lines.push("");
    lines.push(`**Parent topology:** ${caselet.parentTopology}`);
    lines.push(`**QL:** ${child.qlId}`);
    lines.push("");
    lines.push(caselet.scenario);
    lines.push("");
    lines.push(language === "hi" ? "### शर्तें" : "### ਸ਼ਰਤਾਂ");
    lines.push("");
    caselet.learnerFacingClues.forEach((clue) => lines.push(`- ${clue}`));
    lines.push("");
    lines.push(language === "hi" ? "### प्रश्न" : "### ਪ੍ਰਸ਼ਨ");
    lines.push("");
    lines.push(child.stem);
    lines.push("");
    child.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
    lines.push("");
    lines.push(`**${language === "hi" ? "सही विकल्प" : "ਸਹੀ ਵਿਕਲਪ"}:** ${String.fromCharCode(65 + child.correctIndex)} — ${child.answer}`);
    lines.push("");
    lines.push(language === "hi" ? "### व्याख्या" : "### ਵਿਆਖਿਆ");
    lines.push("");
    lines.push(child.explanation.summary);
    lines.push("");
    child.explanation.lines.forEach((line) => { lines.push(line); lines.push(""); });
  });
}

const output = lines.join("\n");
writeFileSync(outputPath, output, "utf8");
console.log(output);
