import fs from "node:fs";
import path from "node:path";
import { INT_CP006_QL_IDS, generateIntCp006Question, type IntCp006Question, type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

function pickReviewQuestions(qlId: IntCp006QlId): readonly IntCp006Question[] {
  const candidatesByPosition = new Map<number, Map<string, IntCp006Question>>();
  for (let correctIndex = 0; correctIndex < 4; correctIndex += 1) {
    const byFamily = new Map<string, IntCp006Question>();
    for (let index = 0; index < 6000; index += 1) {
      const seed = `int-cp006-v1-review-${qlId}-${correctIndex}-${index}`;
      const question = generateIntCp006Question(qlId, seed);
      if (question.correctIndex !== correctIndex) continue;
      if (!byFamily.has(question.presentation.stemFamilyId)) {
        byFamily.set(question.presentation.stemFamilyId, question);
      }
    }
    assert(byFamily.size > 0, `${qlId}: no review question for answer position ${correctIndex}`);
    candidatesByPosition.set(correctIndex, byFamily);
  }

  let best: IntCp006Question[] | undefined;
  let bestFamilyCount = -1;
  const walk = (position: number, selected: IntCp006Question[], fingerprints: Set<string>): void => {
    if (position === 4) {
      const familyCount = new Set(selected.map((question) => question.presentation.stemFamilyId)).size;
      if (familyCount > bestFamilyCount) {
        bestFamilyCount = familyCount;
        best = [...selected];
      }
      return;
    }
    for (const question of candidatesByPosition.get(position)!.values()) {
      if (fingerprints.has(question.mathematicalFingerprint)) continue;
      fingerprints.add(question.mathematicalFingerprint);
      selected.push(question);
      walk(position + 1, selected, fingerprints);
      selected.pop();
      fingerprints.delete(question.mathematicalFingerprint);
    }
  };
  walk(0, [], new Set<string>());

  assert(best?.length === 4, `${qlId}: could not construct a four-position review set`);
  assert(bestFamilyCount >= 3, `${qlId}: review set covers only ${bestFamilyCount} stem families`);
  return Object.freeze(best);
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
sections.push("Review scope: 13 retained QLs × 4 questions = **52 learner-facing questions**. Every QL covers correct positions A/B/C/D exactly once and shows at least three authored stem families from the expanded runtime.");
sections.push("");
sections.push("Lifecycle: review-only. Question Studio activation, registration, Question Bank storage, test eligibility and public publication remain closed.");
sections.push("");

let ordinal = 1;
for (const qlId of INT_CP006_QL_IDS) {
  sections.push(`## ${qlId}`);
  sections.push("");
  for (const question of pickReviewQuestions(qlId)) sections.push(renderQuestion(question, ordinal++));
}

const outputDirectory = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const output = path.join(outputDirectory, "INT-CP-006-V1-ENGLISH-REVIEW.md");
fs.writeFileSync(output, `${sections.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output, questions: ordinal - 1, qls: INT_CP006_QL_IDS.length }, null, 2));
console.log("PASS_INT_CP006_V1_ENGLISH_REVIEW_EXPORT");
