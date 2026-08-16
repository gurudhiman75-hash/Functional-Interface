import { generateIntCp005QuestionV16LocalizedFinal } from "./cp005-variable-growth-decay-runtime-v16-localized-final";

const seed = "int-cp005-v16-hi-pa-final-audit-INT-QL-086-0";
const q = generateIntCp005QuestionV16LocalizedFinal("INT-QL-086", seed, "pa-IN");
const fields = {
  stem: q.presentation.markdown,
  options: q.options.map((o) => `${o.text} :: ${o.studentFeedback}`).join("\n"),
  keyIdea: q.explanation.keyIdea,
  steps: q.explanation.steps.join("\n"),
  commonMistake: q.explanation.commonMistake,
};
for (const [name, text] of Object.entries(fields)) {
  const matches = [...text.matchAll(/[\u0900-\u097F]/gu)].map((m) => ({ char: m[0], code: `U+${m[0]!.codePointAt(0)!.toString(16).toUpperCase()}` }));
  if (matches.length) console.log(JSON.stringify({ name, matches, text }, null, 2));
}
console.log("PASS_INT_CP005_V16_LOCALIZED_DIAGNOSTIC");
