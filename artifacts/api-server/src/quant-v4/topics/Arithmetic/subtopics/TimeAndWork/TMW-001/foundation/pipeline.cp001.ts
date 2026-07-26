import { getTmwCp001QuestionEntry, getTmwCp001RegistryEntry, renderTmwTemplate } from "../library";
import type { TmwCp001QuestionPackage } from "../types";
import { buildTmwCp001Options } from "./distractor-builder.cp001";
import { renderTmwCp001Explanation } from "./explanation-renderer.cp001";
import { independentlyVerifyTmwCp001 } from "./independent-verifier.cp001";
import { generateTmwCp001Parameters } from "./parameter-generator.cp001";
import { hashSeed } from "./prng";
import { solveTmwCp001 } from "./solver.cp001";
import { validateTmwCp001QuestionPackage } from "./validator.cp001";

function fingerprint(qlId: string, solveMode: string, quantities: Record<string, unknown>): string {
  const ordered = Object.entries(quantities).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}:${JSON.stringify(value)}`).join("|");
  return `TMW-FP-${hashSeed(`${qlId}|${solveMode}|${ordered}`).toString(16).padStart(8, "0")}`;
}

export function runTmwCp001Pipeline(qlId: string, seed: string): TmwCp001QuestionPackage {
  const entry = getTmwCp001QuestionEntry(qlId);
  const registry = getTmwCp001RegistryEntry(qlId);
  const parameters = generateTmwCp001Parameters(qlId, seed);
  const solver = solveTmwCp001(parameters);
  const independentVerification = independentlyVerifyTmwCp001(parameters, solver.exactAnswer);
  const stem = renderTmwTemplate(entry.template, parameters.renderVariables);
  const builtOptions = buildTmwCp001Options(parameters, solver);
  const explanation = renderTmwCp001Explanation(parameters, solver);
  const base = {
    packageId: parameters.packageId,
    canonicalProblemId: parameters.canonicalProblemId,
    qlId,
    questionId: parameters.questionId,
    seed,
    language: "en" as const,
    difficulty: parameters.difficulty,
    solveMode: parameters.solveMode,
    stem,
    options: builtOptions.options,
    correctIndex: builtOptions.correctIndex,
    correctAnswer: solver.answer,
    solver,
    independentVerification,
    explanation,
    maturity: "RUNTIME_PROOF" as const,
    publiclyPublishable: false as const,
    lifecycle: { generationSurface: "QUESTION_STUDIO" as const, reviewStatus: "UNREVIEWED" as const, questionBankStatus: "NOT_STORED" as const, testEligibility: "INELIGIBLE" as const },
    traceability: {
      ruleId: registry.ruleId,
      formulaStrategyId: registry.formulaStrategyId,
      explanationStrategyId: registry.explanationStrategyId,
      distractorStrategyIds: [...registry.distractorStrategyIds],
      optionErrorLabels: builtOptions.optionErrorLabels,
      fingerprint: fingerprint(qlId, parameters.solveMode, parameters.quantities),
    },
  };
  const validation = validateTmwCp001QuestionPackage(base);
  return { ...base, validation };
}
