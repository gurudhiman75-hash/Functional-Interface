import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001CalculationRichQuestion } from "./cp001-calculation-rich-explanation-runtime";

const LANGUAGES = ["en", "hi", "pa"] as const;
let checked = 0;
let spaced = 0;
for (const language of LANGUAGES) {
  for (const qlId of INT_CP001_FINAL_QL_IDS) {
    for (const i of [0, 1]) {
      const seed = "int-cp001-tex-spacing:" + qlId + ":" + i;
      const result = generateIntCp001CalculationRichQuestion(qlId, seed, language);
      if (!result.validation.ok) throw new Error(qlId + "/" + language + ": " + result.validation.errors.join("; "));
      if (result.options[result.correctIndex] !== result.answer) throw new Error(qlId + "/" + language + ": correct answer changed");
      const steps = result.explanation.steps as readonly string[];
      for (const step of steps) {
        if (/\$[^$]*,[^$]*\$/.test(step)) {
          if (/,\\;/.test(step)) spaced++;
          if (/,\s+[A-Z](?:_\d+)?=/.test(step)) throw new Error(qlId + "/" + language + ": missing TeX spacing in " + step);
        }
      }
      checked++;
    }
  }
}
if (checked === 0 || spaced === 0) throw new Error("TeX spacing test exercised no generated expressions.");
console.log("INT-001 CP001 TeX spacing contract passed: " + checked + " questions, " + spaced + " spaced steps.");
