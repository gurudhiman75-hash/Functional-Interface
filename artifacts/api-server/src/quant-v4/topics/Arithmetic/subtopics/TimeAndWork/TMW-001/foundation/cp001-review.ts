import { TMW_CP001_REGISTRY } from "./cp001-registry";
import { runTmwCp001Pipeline } from "./cp001-runtime";

export interface TmwCp001ReviewRow {
  packageId: string;
  cpId: "TMW-CP-001";
  qlId: string;
  solveMode: string;
  difficulty: string;
  seed: string;
  mathematicalFingerprint: string;
  scenarioFamily: string;
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

export function buildTmwCp001ReviewRows(seedsPerQl = 3): TmwCp001ReviewRow[] {
  const rows: TmwCp001ReviewRow[] = [];
  for (const entry of TMW_CP001_REGISTRY) {
    for (let index = 0; index < seedsPerQl; index += 1) {
      const seed = `tmw-cp001-review:${entry.qlId}:${index}`;
      const generated = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed });
      rows.push({
        packageId: `${entry.qlId}:${seed}`,
        cpId: "TMW-CP-001",
        qlId: entry.qlId,
        solveMode: entry.solveMode,
        difficulty: entry.difficulty,
        seed,
        mathematicalFingerprint: generated.mathematicalFingerprint,
        scenarioFamily: entry.scenarioFamily,
        stem: generated.stem,
        options: generated.options,
        correctIndex: generated.correctIndex,
        correctAnswer: generated.solution.answerText,
        formula: generated.explanation.formula,
        explanation: [
          generated.explanation.opening,
          generated.explanation.formula,
          ...generated.explanation.steps,
          generated.explanation.conclusion,
        ],
        distractorLabels: generated.optionAudit.map((option) => option.misconceptionId),
        validationStatus: generated.validation.valid ? "PASS" : "FAIL",
        validationErrors: generated.validation.errors,
        publiclyPublishable: false,
      });
    }
  }
  return rows;
}
