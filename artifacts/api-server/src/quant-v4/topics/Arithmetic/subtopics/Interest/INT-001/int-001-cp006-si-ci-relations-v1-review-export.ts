import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INT_CP006_QL_IDS, generateIntCp006Question, type IntCp006Question, type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v1";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

function pickReviewQuestions(qlId: IntCp006QlId): readonly IntCp006Question[] {
  const desiredTemplates = [`${qlId}-T1`, `${qlId}-T2`, `${qlId}-T3`, `${qlId}-T1`];
  const selected: IntCp006Question[] = [];
  const fingerprints = new Set<string>();
  for (let correctIndex = 0; correctIndex < 4; correctIndex += 1) {
    const wantedTemplate = desiredTemplates[correctIndex]!;
    let found: IntCp006Question | undefined;
    for (let index = 0; index < 6000; index += 1) {
      const seed = `int-cp006-v1-review-${qlId}-${correctIndex}-${index}`;
      const question = generateIntCp006Question(qlId, seed);
      if (question.correctIndex !== correctIndex) continue;
      if (question.presentation.stemFamilyId !== wantedTemplate) continue;
      if (fingerprints.has(question.mathematicalFingerprint)) continue;
      found = question;
      break;
    }
    assert(found, `${qlId}: no review question for position ${correctIndex} / ${wantedTemplate}`);
    fingerprints.add(found.mathematicalFingerprint);
    selected.push(found);
  }
  assert(new Set(selected.map((question) => question.presentation.stemFamilyId)).size === 3, `${qlId}: review does not show all three stem families`);
  return Object.freeze(selected);
}

function renderQuestion(question: IntCp006Question, ordinal: number): string {
  const letters = ["A", "B", "C", "D"];
  const lines: string[] = [];
  lines.push(`### Q${ordinal} — ${question.qlId} — ${question.presentation.stemFamilyId}`);
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
  lines.push(`- Therefore, the answer is **${question.explanation.finalAnswer}**.`);
  lines.push("");
  lines.push(`**Common mistake:** ${question.explanation.commonMistake}`);
  lines.push("");
  lines.push(`_Representation: ${question.presentation.representation}; misconception IDs: ${question.options.map((option) => option.misconceptionId).join(" / ")}_`);
  lines.push("");
  return lines.join("\n");
}

const sections: string[] = [];
sections.push("# INT-CP-006 V1 — English Question Review");
sections.push("");
sections.push("Checkpoint: **Simple-versus-Compound Differences and Successive-Interest Relations**");
sections.push("");
sections.push("Review scope: 13 retained QLs × 4 questions = **52 learner-facing questions**. Every QL shows all three authored stem families and correct positions A/B/C/D exactly once.");
sections.push("");
sections.push("Lifecycle: review-only. Question Studio activation, registration, Question Bank storage, test eligibility and public publication remain closed.");
sections.push("");

let ordinal = 1;
for (const qlId of INT_CP006_QL_IDS) {
  sections.push(`## ${qlId}`);
  sections.push("");
  for (const question of pickReviewQuestions(qlId)) sections.push(renderQuestion(question, ordinal++));
}

const outputDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../../../../../../dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const output = path.join(outputDirectory, "INT-CP-006-V1-ENGLISH-REVIEW.md");
fs.writeFileSync(output, `${sections.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output, questions: ordinal - 1, qls: INT_CP006_QL_IDS.length }, null, 2));
console.log("PASS_INT_CP006_V1_ENGLISH_REVIEW_EXPORT");
