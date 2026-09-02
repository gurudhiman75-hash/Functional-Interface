import {
  INT_CP009_PROTOTYPE_IDS,
  buildIntCp009ExamReadyPolishedPackage,
} from "./cp009-dated-cash-flow-exam-ready-v3-polish";

const lines: string[] = [];
lines.push("# INT-CP-009 — Exam-Readiness V3 Review");
lines.push("");
lines.push("Temporary learner review. No permanent QL identity is allocated or reserved.");
lines.push("");

let exported = 0;
const answerPositions = [0, 0, 0, 0];
for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  const found = new Map<string, ReturnType<typeof buildIntCp009ExamReadyPolishedPackage>>();
  for (let index = 0; index < 600 && found.size < 3; index += 1) {
    const seed = `int-cp009-exam-v3-review:${prototypeId}:${index}`;
    const question = buildIntCp009ExamReadyPolishedPackage(prototypeId, seed) as any;
    found.set(question.presentation.stemFamilyId, question);
  }
  if (found.size !== 3) throw new Error(`${prototypeId}: missing V3 review stem family`);

  lines.push(`## ${prototypeId}`);
  lines.push("");
  for (const question of [...found.values()].sort((a, b) => a.presentation.stemFamilyId.localeCompare(b.presentation.stemFamilyId))) {
    lines.push(`### ${question.presentation.stemFamilyId}`);
    lines.push("");
    lines.push(question.presentation.prompt);
    lines.push("");
    question.options.forEach((option: any, optionIndex: number) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}`));
    lines.push("");
    lines.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`);
    lines.push("");
    lines.push(`**Key idea:** ${question.explanation.keyIdea}`);
    lines.push("");
    question.explanation.steps.forEach((step: string, stepIndex: number) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("");
    lines.push(`**Final answer:** ${question.explanation.finalAnswer}`);
    lines.push("");
    answerPositions[question.correctIndex] += 1;
    exported += 1;
  }
}

if (exported !== 24) throw new Error(`Expected 24 CP009 V3 review questions, got ${exported}`);
lines.push(`Review answer positions: ${answerPositions.join(" / ")}`);
console.log(lines.join("\n"));
