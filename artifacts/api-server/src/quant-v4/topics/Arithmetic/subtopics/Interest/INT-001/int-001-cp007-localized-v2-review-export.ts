import fs from "node:fs";
import path from "node:path";
import {
  INT_CP007_LOCALIZED_VERSION,
  generateIntCp007LocalizedReviewQuestion,
} from "./cp007-scheme-equivalence-localized-v2";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

function surface(question: any): string {
  return JSON.stringify({ stem: question.presentation.markdown, answer: question.correctAnswer, explanation: question.explanation });
}

function renderQuestion(question: any): string {
  const lines: string[] = [];
  lines.push(`**Question:** ${question.presentation.markdown}`, "", "**Options:**");
  question.options.forEach((option: any, index: number) => {
    const mark = index === question.correctIndex ? " **✓**" : "";
    lines.push(`${String.fromCharCode(65 + index)}. ${option.text}${mark}`);
  });
  lines.push("", `**Correct answer:** ${question.correctAnswer}`, "", `**Approach:** ${question.explanation.keyIdea}`, "", "**Calculation:**");
  question.explanation.steps.forEach((step: string, index: number) => lines.push(`${index + 1}. ${step}`));
  lines.push("", `**Final answer:** ${question.explanation.finalAnswer}`, "", `**Common mistake:** ${question.explanation.commonMistake}`);
  return lines.join("\n");
}

const output: string[] = [
  "# INT-CP-007 — Hindi/Punjabi Native Review V2",
  "",
  `Localized candidate: **${INT_CP007_LOCALIZED_VERSION}**`,
  "",
  "Source authority: **INT-CP-007-EN-v8-frozen**.",
  "",
  "Punjabi Compound Interest authority: **ਮਿਸ਼ਰਤ ਵਿਆਜ**. Deprecated learner-facing terminology is rejected by audit.",
  "",
  "Status: **MULTILINGUAL PRODUCT REVIEW ONLY**. Delivery remains closed.",
  "",
];

let matchedSeeds = 0;
let localizedQuestions = 0;
for (const qlId of INT_CP007_QL_IDS) {
  const selected: string[] = [];
  const seen = new Set<string>();
  const stemFamilies = new Set<string>();
  for (let index = 0; index < 300 && selected.length < 4; index += 1) {
    const seed = `int-cp007-localized-v2-review-${qlId}-${index}`;
    const hi = generateIntCp007LocalizedReviewQuestion(qlId, seed, "hi-IN") as any;
    const key = surface(hi);
    if (seen.has(key)) continue;
    const family = hi.presentation.stemFamilyId as string;
    if (selected.length < 3 && stemFamilies.has(family)) continue;
    selected.push(seed);
    seen.add(key);
    stemFamilies.add(family);
  }
  if (selected.length !== 4 || stemFamilies.size < 3) throw new Error(`${qlId}: failed to select four meaningful review surfaces across all stem families`);

  output.push(`## ${qlId}`, "");
  selected.forEach((seed, reviewIndex) => {
    const hi = generateIntCp007LocalizedReviewQuestion(qlId, seed, "hi-IN") as any;
    const pa = generateIntCp007LocalizedReviewQuestion(qlId, seed, "pa-IN") as any;
    output.push(`### Review ${reviewIndex + 1} — ${hi.presentation.stemFamilyId} — seed \`${seed}\``, "");
    output.push("#### Hindi", "", renderQuestion(hi), "");
    output.push("#### Punjabi", "", renderQuestion(pa), "");
    matchedSeeds += 1;
    localizedQuestions += 2;
  });
}

const destination = path.resolve("dist/quant-v4/INT-CP-007-HI-PA-V2-NATIVE-REVIEW.md");
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${output.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output: destination, qls: INT_CP007_QL_IDS.length, matchedSeeds, localizedQuestions }, null, 2));
console.log("PASS_INT_CP007_LOCALIZED_V2_REVIEW_EXPORT");
