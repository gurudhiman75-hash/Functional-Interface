import { runAvg001Cp002Pipeline } from "./cp002-runtime";
import { runAvg001Cp003Pipeline } from "./cp003-distractor-runtime";
import { buildAvg001MathematicalFingerprint } from "./diversity";
import { renderAvg001Explanation } from "./explanation-renderer";
import { independentlyVerifyAvg001 } from "./independent-verifier";
import {
  getAvg001QuestionEntry,
  getAvg001QuestionLanguageIds,
  renderTemplate,
} from "./library";
import { generateAvg001Options } from "./option-generator";
import { generateAvg001Parameters } from "./parameter-generator";
import { buildAvg001ReasoningEvidence } from "./reasoning-evidence";
import { solveAvg001 } from "./solver";
import {
  AVG_001_PACKAGE_ID,
  type Avg001Language,
  type Avg001QuestionPackage,
} from "./types";
import { validateAvg001QuestionPackage } from "./validator";

export function runAvg001Pipeline(
  input: {
    questionLanguageId?: string;
    seed?: string;
    language?: Avg001Language;
  } = {},
): Avg001QuestionPackage {
  const questionLanguageId =
    input.questionLanguageId ?? getAvg001QuestionLanguageIds()[0]!;
  const seed = input.seed ?? `avg-001:${questionLanguageId}:default`;
  const language = input.language ?? "en";
  const entry = getAvg001QuestionEntry(questionLanguageId);

  if (entry.cpId === "AVG-CP-002") {
    return runAvg001Cp002Pipeline({ questionLanguageId, seed, language });
  }
  if (entry.cpId === "AVG-CP-003") {
    return runAvg001Cp003Pipeline({ questionLanguageId, seed, language });
  }

  const parameters = generateAvg001Parameters({ questionLanguageId, seed, language });
  const solver = solveAvg001(parameters);
  const independentVerification = independentlyVerifyAvg001(parameters);
  const reasoningEvidence = buildAvg001ReasoningEvidence(parameters, solver);
  const explanation = renderAvg001Explanation(parameters, solver, reasoningEvidence);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const { options, correctIndex } = generateAvg001Options(parameters, solver);
  const mathematicalFingerprint = buildAvg001MathematicalFingerprint(parameters, solver);

  const base = {
    packageId: AVG_001_PACKAGE_ID,
    archetypeId: AVG_001_PACKAGE_ID,
    canonicalProblemId: entry.cpId,
    questionLanguageId,
    questionId: `AVG-001:${questionLanguageId}:${seed}`,
    seed,
    language,
    difficultyBand: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    stem,
    options,
    correctIndex,
    answer: solver.answer,
    parameters,
    solver,
    independentVerification,
    reasoningEvidence,
    explanation,
    maturity: "RUNTIME_PROOF" as const,
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: {
      packageId: AVG_001_PACKAGE_ID,
      canonicalProblemId: entry.cpId,
      questionLanguageId,
      taskKind: entry.taskKind,
      solveMode: entry.solveMode,
      answerType: entry.answerType,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
    },
  };

  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) {
    throw new Error(
      validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join("\n"),
    );
  }
  return { ...base, validation };
}
