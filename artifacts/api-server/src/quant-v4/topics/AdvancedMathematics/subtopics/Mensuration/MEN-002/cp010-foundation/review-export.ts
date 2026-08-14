import fs from "node:fs";
import path from "node:path";
import { buildMenCp010ReviewBatch } from "./review";
import { auditMenCp010Registry } from "./registry";

const review = buildMenCp010ReviewBatch();
const registry = auditMenCp010Registry();
const outputDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
const records = review.map((question) => ({
  prototypeId: question.prototypeId, solveMode: question.solveMode, difficulty: question.difficulty, seed: question.seed, piPolicy: question.piPolicy,
  stem: question.stem, options: question.options.map((option) => ({ label: option.label, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
  answer: question.answer, explanation: question.explanation, diagram: question.diagram.svg, verification: question.verification, validation: question.validation,
}));
const evidence = { authority: "MEN-CP010-FOUNDATION-WAVE-01-V1", status: "EXECUTABLE_DISCOVERY__NO_PERMANENT_QLS__ACTIVATION_LOCKED", registry, reviewRecordCount: records.length,
  correctPositions: { A: review.filter((q) => q.correctIndex === 0).length, B: review.filter((q) => q.correctIndex === 1).length, C: review.filter((q) => q.correctIndex === 2).length, D: review.filter((q) => q.correctIndex === 3).length }, records };
fs.writeFileSync(path.join(outputDir, "men-cp010-foundation-wave01.json"), JSON.stringify(evidence, null, 2));
const md = ["# MEN-CP-010 Foundation Wave 01 Review","",`- Prototypes: ${registry.prototypeCount}`,`- Review records: ${records.length}`,`- Permanent QLs: ${registry.permanentQlCount}`,`- Product lifecycle locked: ${registry.lifecycleLocked}`,"",
  ...records.flatMap((record, index) => [`## ${index + 1}. ${record.prototypeId}`,"",record.stem,"",...record.options.map((option) => `- ${option.label}. ${option.display}${option.isCorrect ? " **✓**" : ""}`),"",`**Answer:** ${record.answer}`,"",...record.explanation.steps.map((step) => `- **${step.title}:** ${step.body}`),""])].join("\n");
fs.writeFileSync(path.join(outputDir, "men-cp010-foundation-wave01.md"), md);
console.log(JSON.stringify({ outputDir, reviewRecordCount: records.length, registry }, null, 2));
