import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioQuestionV2,
} from "./mensuration-question-studio-selection-v2";

const rows = MENSURATION_QUESTION_STUDIO_PATTERNS.map((pattern) => {
  const questions = Array.from({ length: 16 }, (_, index) =>
    generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `mensuration-remediation-saturation:${pattern.patternId}:${index}`,
      examProfile: "SSC_CORE",
    }),
  );
  const signatures = new Map<string, string[]>();
  for (const question of questions) {
    const values = signatures.get(question.realism.numericalStateSignature) ?? [];
    values.push(question.stem);
    signatures.set(question.realism.numericalStateSignature, values);
  }
  return {
    cpId: pattern.cpId,
    patternId: pattern.patternId,
    title: pattern.title,
    contentStates: signatures.size,
    states: [...signatures.entries()].map(([signature, stems]) => ({ signature, stem: stems[0] })),
  };
}).filter((row) => row.contentStates < 4);

console.log(JSON.stringify({ count: rows.length, rows }, null, 2));
