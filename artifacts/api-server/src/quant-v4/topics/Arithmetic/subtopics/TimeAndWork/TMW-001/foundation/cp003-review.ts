import { TMW_CP003_REGISTRY } from "./cp003-registry";
import { runTmwCp003Pipeline } from "./cp003-runtime";

export interface TmwCp003ReviewRow {
  packageId: string;
  cpId: "TMW-CP-003";
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

export function buildTmwCp003ReviewRows(seedsPerQl = 3): TmwCp003ReviewRow[] {
  const rows: TmwCp003ReviewRow[] = [];
  for (const entry of TMW_CP003_REGISTRY) {
    for (let index = 0; index < seedsPerQl; index += 1) {
      const seed = `tmw-cp003-review:${entry.qlId}:${index}`;
      const generated = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed });
      rows.push({
        packageId: `${entry.qlId}:${seed}`,
        cpId: "TMW-CP-003",
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
