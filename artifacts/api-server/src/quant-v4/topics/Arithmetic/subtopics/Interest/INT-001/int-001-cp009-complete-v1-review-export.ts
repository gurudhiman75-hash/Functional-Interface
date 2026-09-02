import { INT_CP009_PERMANENT_QL_IDS } from "./cp009-permanent-allocation-v1";
import { generateIntCp009Frozen } from "./cp009-final-freeze-v1";

const lines: string[] = [
  "# INT-CP-009 Final Multilingual Review Pack",
  "",
  "Permanent QLs: INT-QL-125..129",
  "Locales: English, Hindi, Punjabi",
  "",
];

for (const qlId of INT_CP009_PERMANENT_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    for (let index = 0; index < 2; index += 1) {
      const q = generateIntCp009Frozen(qlId, `final-review:${qlId}:${language}:${index}`, language) as any;
      lines.push(`## ${qlId} · ${q.sourcePrototypeId} · ${language} · ${q.difficultyBand}`);
      lines.push("");
      lines.push(q.stem);
      lines.push("");
      q.options.forEach((option: any, optionIndex: number) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}${optionIndex === q.correctIndex ? " ✓" : ""}`));
      lines.push("");
      lines.push(`**Concept:** ${q.explanation.keyIdea}`);
      lines.push("");
      q.explanation.steps.forEach((step: string, stepIndex: number) => lines.push(`${stepIndex + 1}. ${step}`));
      lines.push("");
      lines.push(`**Answer:** ${q.correctAnswer}`);
      lines.push("");
    }
  }
}

console.log(lines.join("\n"));
