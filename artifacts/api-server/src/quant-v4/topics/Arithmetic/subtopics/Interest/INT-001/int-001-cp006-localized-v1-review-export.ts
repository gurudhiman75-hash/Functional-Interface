import fs from "node:fs";
import path from "node:path";
import {
  INT_CP006_QL_IDS,
  type IntCp006QlId,
} from "./cp006-si-ci-relations-runtime-v4-final";
import { generateIntCp006EnglishFrozenQuestion } from "./cp006-si-ci-relations-v1-frozen";
import {
  INT_CP006_LOCALIZED_VERSION,
  generateIntCp006LocalizedQuestion,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v3";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

type ReviewQuestion = ReturnType<typeof generateIntCp006EnglishFrozenQuestion> | ReturnType<typeof generateIntCp006LocalizedQuestion>;

function pickSeed(qlId: IntCp006QlId, template: 1 | 2 | 3): string {
  for (let index = 0; index < 10000; index += 1) {
    const seed = `int-cp006-hi-pa-v1-review-${qlId}-T${template}-${index}`;
    const question = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    if (question.presentation.stemFamilyId === `${qlId}-T${template}`) return seed;
  }
  throw new Error(`${qlId}: no review seed found for T${template}`);
}
function renderQuestion(question: ReviewQuestion, label: string): string {
  const letters = ["A", "B", "C", "D"];
  const lines: string[] = [];
  lines.push(`#### ${label}`);
  lines.push("");
  lines.push(question.presentation.markdown);
  lines.push("");
  for (let index = 0; index < question.options.length; index += 1) lines.push(`${letters[index]}. ${question.options[index]!.text}`);
  lines.push("");
  lines.push(`**Correct:** ${letters[question.correctIndex]}. ${question.correctAnswer}`);
  lines.push("");
  lines.push(`**Key idea:** ${question.explanation.keyIdea}`);
  lines.push("");
  lines.push("**Solution:**");
  for (const step of question.explanation.steps) lines.push(`- ${step}`);
  lines.push(`- **Final answer:** ${question.explanation.finalAnswer}`);
  lines.push("");
  lines.push(`**Common mistake:** ${question.explanation.commonMistake}`);
  lines.push("");
  return lines.join("\n");
}

const sections: string[] = [];
sections.push("# INT-CP-006 — Matched English / Hindi / Punjabi Review");
sections.push("");
sections.push(`Localized runtime: **${INT_CP006_LOCALIZED_VERSION}**`);
sections.push("");
sections.push("Scope: 13 frozen QLs × 3 stem families × 3 matched languages = **117 learner-facing surfaces**.");
sections.push("");
sections.push("English is the product-owner-approved frozen semantic authority. Hindi and Punjabi use the exact same seed, mathematical state, option values, misconception ownership, correct index and stem-family identity.");
sections.push("");
sections.push("Lifecycle remains review-only: no Question Studio activation, registration, Question Bank storage, test eligibility or public publication.");
sections.push("");

let states = 0;
for (const qlId of INT_CP006_QL_IDS) {
  sections.push(`## ${qlId}`);
  sections.push("");
  for (const template of [1, 2, 3] as const) {
    const seed = pickSeed(qlId, template);
    const en = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    const hi = generateIntCp006LocalizedQuestion(qlId, seed, "hi-IN");
    const pa = generateIntCp006LocalizedQuestion(qlId, seed, "pa-IN");
    assert(en.presentation.stemFamilyId === hi.presentation.stemFamilyId && en.presentation.stemFamilyId === pa.presentation.stemFamilyId, `${qlId}/${seed}: stem family mismatch`);
    assert(en.correctIndex === hi.correctIndex && en.correctIndex === pa.correctIndex, `${qlId}/${seed}: correct index mismatch`);
    states += 1;
    sections.push(`### ${qlId}-T${template} — seed \`${seed}\``);
    sections.push("");
    sections.push(renderQuestion(en, "English — frozen authority"));
    sections.push(renderQuestion(hi, "Hindi — review candidate"));
    sections.push(renderQuestion(pa, "Punjabi — review candidate"));
  }
}

const outputDirectory = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const output = path.join(outputDirectory, "INT-CP-006-HI-PA-MATCHED-REVIEW.md");
fs.writeFileSync(output, `${sections.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output, qls: INT_CP006_QL_IDS.length, matchedStates: states, learnerSurfaces: states * 3 }, null, 2));
console.log("PASS_INT_CP006_V1_HI_PA_REVIEW_EXPORT");
