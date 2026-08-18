import fs from "node:fs";
import path from "node:path";
import { INT_CP006_QL_IDS, type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";
import { generateIntCp006EnglishFrozenQuestion } from "./cp006-si-ci-relations-v1-frozen";
import { generateIntCp006EnglishExplanationReviewQuestion } from "./cp006-english-explanation-amendment-v1";
import {
  INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  generateIntCp006LocalizedExplanationReviewQuestion,
} from "./cp006-si-ci-relations-localized-v6";
import { INT_CP006_EXPANDED_EXPLANATION_VERSION } from "./cp006-expanded-explanation-v4";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function pickSeed(qlId: IntCp006QlId, template: 1 | 2 | 3): string {
  for (let index = 0; index < 10000; index += 1) {
    const seed = `int-cp006-expl-review-${qlId}-T${template}-${index}`;
    const question = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    if (question.presentation.stemFamilyId === `${qlId}-T${template}`) return seed;
  }
  throw new Error(`${qlId}: no seed found for T${template}`);
}
function render(question: any, label: string): string {
  const lines: string[] = [];
  lines.push(`#### ${label}`);
  lines.push("");
  lines.push(`**Question:** ${question.presentation.markdown}`);
  lines.push("");
  lines.push(`**Correct answer:** ${question.correctAnswer}`);
  lines.push("");
  lines.push(`**Approach:** ${question.explanation.keyIdea}`);
  lines.push("");
  lines.push("**Calculation:**");
  question.explanation.steps.forEach((step: string, index: number) => lines.push(`${index + 1}. ${step}`));
  lines.push("");
  lines.push(`**Final answer:** ${question.explanation.finalAnswer}`);
  lines.push("");
  lines.push(`**Common mistake:** ${question.explanation.commonMistake}`);
  lines.push("");
  return lines.join("\n");
}

const sections: string[] = [];
sections.push("# INT-CP-006 — Expanded Calculative Explanation Review");
sections.push("");
sections.push(`Explanation authority candidate: **${INT_CP006_EXPANDED_EXPLANATION_VERSION}**`);
sections.push(`Hindi/Punjabi candidate: **${INT_CP006_LOCALIZED_EXPLANATION_VERSION}**`);
sections.push("");
sections.push("Scope: 13 QLs × 3 matched stem families × English/Hindi/Punjabi = **117 learner-facing explanation surfaces**.");
sections.push("");
sections.push("Hindi and Punjabi explanation wording has received a second manual native-editorial pass after the grammar-remediation review. The pass targets natural teacher-style phrasing, not literal translation. Question identity, mathematical state, stems, options, answers and delivery flags remain unchanged.");
sections.push("");
sections.push("The English source remains frozen. This document presents an explicit explanation-amendment candidate; it does not silently mutate the frozen English authority.");
sections.push("");

let matchedStates = 0;
let learnerSurfaces = 0;
for (const qlId of INT_CP006_QL_IDS) {
  sections.push(`## ${qlId}`);
  sections.push("");
  for (const template of [1, 2, 3] as const) {
    const seed = pickSeed(qlId, template);
    const source = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    const en = generateIntCp006EnglishExplanationReviewQuestion(qlId, seed);
    const hi = generateIntCp006LocalizedExplanationReviewQuestion(qlId, seed, "hi-IN");
    const pa = generateIntCp006LocalizedExplanationReviewQuestion(qlId, seed, "pa-IN");
    assert(source.presentation.stemFamilyId === en.presentation.stemFamilyId, `${qlId}/${seed}: English stem family drift`);
    assert(en.presentation.stemFamilyId === hi.presentation.stemFamilyId && en.presentation.stemFamilyId === pa.presentation.stemFamilyId, `${qlId}/${seed}: localized stem family mismatch`);
    assert(en.correctIndex === hi.correctIndex && en.correctIndex === pa.correctIndex, `${qlId}/${seed}: correct index mismatch`);
    sections.push(`### ${qlId}-T${template} — seed \`${seed}\``);
    sections.push("");
    sections.push(render(en, "English — explanation amendment candidate"));
    sections.push(render(hi, "Hindi — native-editorial V6 explanation candidate"));
    sections.push(render(pa, "Punjabi — native-editorial V6 explanation candidate"));
    matchedStates += 1;
    learnerSurfaces += 3;
  }
}
sections.push("---");
sections.push("");
sections.push("Status: **EXPLANATION / NATIVE EDITORIAL REVIEW ONLY**. No freeze, Question Studio activation, registration, Question Bank storage, test eligibility or public publication is authorized by this file.");
sections.push("");

const outputDirectory = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const output = path.join(outputDirectory, "INT-CP-006-EXPANDED-EXPLANATION-MATCHED-REVIEW.md");
fs.writeFileSync(output, `${sections.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output, qls: INT_CP006_QL_IDS.length, matchedStates, learnerSurfaces }, null, 2));
console.log("PASS_INT_CP006_EXPANDED_EXPLANATION_V1_REVIEW_EXPORT");
