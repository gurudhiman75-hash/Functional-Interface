import {
  INT_CP010_FINAL_AUTHORITIES,
  generateIntCp010PermanentEnglish,
  generateIntCp010PermanentLocalized,
} from "./cp010-final-registry-v1";

function renderOptions(options: readonly any[], correctIndex: number) {
  return options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.text}${index === correctIndex ? "  ← correct" : ""}`).join("\n");
}

function renderExplanation(explanation: any) {
  return [explanation.keyIdea, ...explanation.steps, `Final answer: ${explanation.finalAnswer}`].join("\n");
}

const sections: string[] = [
  "# INT-CP-010 Final Permanent Authority Review Pack",
  "",
  "Permanent identities are frozen; delivery gates remain closed.",
  "",
];

for (const entry of INT_CP010_FINAL_AUTHORITIES) {
  sections.push(`## ${entry.permanentQlId} — ${entry.title}`, "", `Authority: ${entry.authorityId}`, `Source prototype: ${entry.sourcePrototypeId}`, "");

  for (let index = 0; index < 2; index += 1) {
    const seed = `cp010:final-review:${entry.permanentQlId}:en:${index}`;
    const q = generateIntCp010PermanentEnglish(entry.permanentQlId, seed) as any;
    sections.push(`### English ${index + 1}`, "", q.stem, "", renderOptions(q.options, q.correctIndex), "", "**Explanation**", "", renderExplanation(q.explanation), "");
  }

  for (const language of ["hi", "pa"] as const) {
    for (let index = 0; index < 2; index += 1) {
      const seed = `cp010:final-review:${entry.permanentQlId}:${language}:${index}`;
      const q = generateIntCp010PermanentLocalized(entry.permanentQlId, seed, language) as any;
      sections.push(`### ${language === "hi" ? "Hindi" : "Punjabi"} ${index + 1}`, "", q.stem, "", renderOptions(q.options, q.correctIndex), "", "**Explanation**", "", renderExplanation(q.explanation), "");
    }
  }
}

console.log(sections.join("\n"));
