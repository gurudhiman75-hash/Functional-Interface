import { TMW_CP002_REGISTRY } from "./cp002-registry";
import { runTmwCp002Pipeline } from "./cp002-runtime";

export interface TmwCp002ReviewRow {
  packageId: string;
  cpId: "TMW-CP-002";
  qlId: string;
  solveMode: string;
  difficulty: string;
  seed: string;
  mathematicalFingerprint: string;
  context: string;
  stem: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  formula: string;
  explanation: string[];
  distractorLabels: string[];
  validationStatus: "PASS" | "FAIL";
  validationErrors: string[];
  publiclyPublishable: false;
}

export function buildTmwCp002ReviewRows(seedsPerQl = 3): TmwCp002ReviewRow[] {
  const rows: TmwCp002ReviewRow[] = [];
  for (const entry of TMW_CP002_REGISTRY) {
    for (let index = 0; index < seedsPerQl; index += 1) {
      const seed = `tmw-cp002-review:${entry.qlId}:${index}`;
      const generated = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed });
      rows.push({
        packageId: `${entry.qlId}:${seed}`,
        cpId: "TMW-CP-002",
        qlId: entry.qlId,
        solveMode: entry.solveMode,
        difficulty: entry.difficulty,
        seed,
        mathematicalFingerprint: generated.mathematicalFingerprint,
        context: generated.parameters.context.jobPhrase,
        stem: generated.stem,
        options: generated.options,
        correctIndex: generated.correctIndex,
        correctAnswer: generated.solution.answerText,
        formula: generated.explanation.formula,
        explanation: [generated.explanation.opening, generated.explanation.formula, ...generated.explanation.steps, generated.explanation.conclusion],
        distractorLabels: generated.optionAudit.map((option) => option.misconceptionId),
        validationStatus: generated.validation.valid ? "PASS" : "FAIL",
        validationErrors: generated.validation.errors,
        publiclyPublishable: false,
      });
    }
  }
  return rows;
}
