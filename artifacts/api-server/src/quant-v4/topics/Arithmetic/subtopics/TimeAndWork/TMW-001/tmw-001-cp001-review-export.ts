import { writeFileSync } from "node:fs";
import { getTmwCp001QuestionLanguageIds } from "./library";
import { runTmwCp001Pipeline } from "./foundation/pipeline.cp001";

export interface TmwCp001ReviewRow {
  packageId: string; cpId: string; qlId: string; solveMode: string; difficulty: string; questionId: string; seed: string; fingerprint: string; stem: string; options: string[]; correctIndex: number; correctAnswer: string; optionErrorLabels: Array<string | null>; formulaStrategyId: string; explanationStrategyId: string; explanation: unknown; independentVerifierStatus: boolean; reviewStatus: string; questionBankStatus: string; testEligibility: string;
}

export function buildTmwCp001ReviewRows(seedsPerQl = 3): TmwCp001ReviewRow[] {
  const rows: TmwCp001ReviewRow[] = [];
  for (const qlId of getTmwCp001QuestionLanguageIds()) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const candidate = runTmwCp001Pipeline(qlId, `cp001-review-${index}`);
      rows.push({
        packageId: candidate.packageId, cpId: candidate.canonicalProblemId, qlId: candidate.qlId,
        solveMode: candidate.solveMode, difficulty: candidate.difficulty, questionId: candidate.questionId,
        seed: candidate.seed, fingerprint: candidate.traceability.fingerprint, stem: candidate.stem,
        options: candidate.options, correctIndex: candidate.correctIndex, correctAnswer: candidate.correctAnswer,
        optionErrorLabels: candidate.traceability.optionErrorLabels,
        formulaStrategyId: candidate.traceability.formulaStrategyId,
        explanationStrategyId: candidate.traceability.explanationStrategyId,
        explanation: candidate.explanation, independentVerifierStatus: candidate.independentVerification.valid,
        reviewStatus: candidate.lifecycle.reviewStatus, questionBankStatus: candidate.lifecycle.questionBankStatus,
        testEligibility: candidate.lifecycle.testEligibility,
      });
    }
  }
  return rows;
}

export function writeTmwCp001ReviewExport(outputPath: string, seedsPerQl = 3): void {
  writeFileSync(outputPath, `${JSON.stringify(buildTmwCp001ReviewRows(seedsPerQl), null, 2)}\n`, "utf8");
}
