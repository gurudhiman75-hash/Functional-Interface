import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioQuestionV2,
} from "./mensuration-question-studio-selection-v2";

function dollarsBalanced(text: string) {
  return (text.match(/\$/g) ?? []).length % 2 === 0 && !/\\pih\b/.test(text);
}

const findings: Array<Record<string, unknown>> = [];
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `mensuration-remediation-audit:${pattern.patternId}:${index}`,
      examProfile: "SSC_CORE",
    });
    const parts = [
      ["stem", question.stem],
      ...question.options.map((text, optionIndex) => [`option-${optionIndex}`, text]),
      ...question.explanation.steps.map((text, stepIndex) => [`step-${stepIndex}`, text]),
      ["shortcut", question.explanation.shortcut],
      ...question.explanation.traps.map((text, trapIndex) => [`trap-${trapIndex}`, text]),
    ] as Array<[string, string]>;
    const badParts = parts.filter(([, text]) => !dollarsBalanced(text));
    const combined = parts.map(([, text]) => text).join("\n");
    if (!dollarsBalanced(combined)) {
      findings.push({
        cpId: pattern.cpId,
        patternId: pattern.patternId,
        seed: question.seed,
        badParts,
        stem: question.stem,
      });
    }
  }
}

console.log(JSON.stringify({ count: findings.length, findings }, null, 2));
if (findings.length) process.exitCode = 2;
