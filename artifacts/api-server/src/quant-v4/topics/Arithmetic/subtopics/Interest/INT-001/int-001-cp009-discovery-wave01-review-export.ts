import {
  INT_CP009_PROTOTYPE_IDS,
  buildIntCp009DiscoveryPackage,
} from "./cp009-dated-cash-flow-discovery-v1";

const lines: string[] = [];
lines.push("# INT-CP-009 — Dated Cash-Flow Discovery Wave 01 Review");
lines.push("");
lines.push("Temporary discovery only. No permanent QL identity is allocated or reserved.");
lines.push("");

let exported = 0;
for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  const found = new Map<string, ReturnType<typeof buildIntCp009DiscoveryPackage>>();
  for (let index = 0; index < 500 && found.size < 3; index += 1) {
    const seed = `int-cp009-review:${prototypeId}:${index}`;
    const question = buildIntCp009DiscoveryPackage(prototypeId, seed);
    found.set(question.presentation.stemFamilyId, question);
  }
  if (found.size !== 3) throw new Error(`${prototypeId}: could not recover all three stem families for review`);

  lines.push(`## ${prototypeId}`);
  lines.push("");
  for (const question of [...found.values()].sort((a, b) => a.presentation.stemFamilyId.localeCompare(b.presentation.stemFamilyId))) {
    lines.push(`### ${question.presentation.stemFamilyId}`);
    lines.push("");
    lines.push(question.presentation.prompt);
    lines.push("");
    question.options.forEach((option, optionIndex) => {
      const label = String.fromCharCode(65 + optionIndex);
      lines.push(`${label}. ${option.text}`);
    });
    lines.push("");
    lines.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`);
    lines.push("");
    lines.push(`**Key idea:** ${question.explanation.keyIdea}`);
    lines.push("");
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("");
    lines.push(`**Final answer:** ${question.explanation.finalAnswer}`);
    lines.push("");
    exported += 1;
  }
}

if (exported !== 24) throw new Error(`Expected 24 CP009 Wave01 review questions, exported ${exported}`);
console.log(lines.join("\n"));
