import {
  SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS,
  generateSerNumericWaveB1Question,
} from "./foundation";

const lines: string[] = [
  "# SER-001 numeric Wave B1 English review pack",
  "",
  "Open executable discovery only. Permanent QLs: 0.",
  "",
];

for (const temporaryTemplateId of SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS) {
  for (const seed of [1, 2]) {
    const question = generateSerNumericWaveB1Question(temporaryTemplateId, seed);
    lines.push(`## ${question.temporaryTemplateId} · seed ${seed}`);
    lines.push("");
    lines.push(`- Source family: \`${question.sourceFamilyId}\``);
    lines.push(`- Canonical authority: \`${question.canonicalAuthorityId}\``);
    lines.push(`- Ownership: \`${question.ownershipDisposition}\``);
    lines.push(`- Task: \`${question.taskKind}\``);
    lines.push(`- Difficulty: \`${question.difficulty}\``);
    lines.push("");
    lines.push(question.stem);
    lines.push("");
    lines.push(
      question.options
        .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
        .join("  \n"),
    );
    lines.push("");
    lines.push(`**Answer:** ${question.correctAnswer}`);
    lines.push("");
    lines.push(`**Rule:** ${question.explanation.ruleStatement}`);
    lines.push("");
    for (const step of question.explanation.working) lines.push(`- ${step}`);
    lines.push("");
    lines.push(question.explanation.conclusion);
    lines.push("");
  }
}

console.log(lines.join("\n"));
