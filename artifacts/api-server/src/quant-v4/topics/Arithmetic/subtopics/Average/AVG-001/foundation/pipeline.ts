import { runAvg001Cp002Pipeline } from "./cp002-runtime";
import { runAvg001Cp003Pipeline } from "./cp003-age-bounded-runtime";
import { runAvg001Cp004ExactPipeline } from "./cp004-exact-runtime";
import { applyAvg001Cp004ExplanationVariants } from "./cp004-explanation-polish";
import { applyAvg001Cp005ExplanationPolish } from "./cp005-explanation-polish";
import { applyAvg001Cp005ExplanationVariants } from "./cp005-explanation-variants";
import { runAvg001Cp005Pipeline } from "./cp005-runtime";
import { applyAvg001Cp006ExplanationPolish } from "./cp006-explanation-polish";
import { runAvg001Cp006ExactPipeline } from "./cp006-exact-runtime";
import { applyAvg001DistractorRealism } from "./distractor-realism";
import { runAvg001GapExpansionPipeline } from "./gap-expansion-runtime";
import { buildAvg001MathematicalFingerprint } from "./diversity";
import { applyAvg001ContextualConclusion } from "./explanation-context";
import { applyAvg001ExplanationDepth } from "./explanation-depth";
import { renderAvg001Explanation } from "./explanation-renderer";
import { independentlyVerifyAvg001 } from "./independent-verifier";
import { getAvg001QuestionEntry, getAvg001QuestionLanguageIds, renderTemplate } from "./library";
import { generateAvg001Options } from "./option-generator";
import { generateAvg001Parameters } from "./parameter-generator";
import { applyAvg001RatioDistractorRealism } from "./ratio-distractor-realism";
import { buildAvg001ReasoningEvidence } from "./reasoning-evidence";
import { solveAvg001 } from "./solver";
import { AVG_001_PACKAGE_ID, type Avg001Language, type Avg001QuestionPackage } from "./types";
import { validateAvg001QuestionPackage } from "./validator";

function finalizeExplanation(pkg: Avg001QuestionPackage) {
  return applyAvg001ContextualConclusion(applyAvg001ExplanationDepth(pkg));
}

function finalizePackage(pkg: Avg001QuestionPackage) {
  return pkg.solveMode === "findGroupCountRatioFromCombinedAverage"
    ? applyAvg001RatioDistractorRealism(pkg)
    : applyAvg001DistractorRealism(pkg);
}

export function runAvg001Pipeline(input: { questionLanguageId?: string; seed?: string; language?: Avg001Language } = {}): Avg001QuestionPackage {
  const questionLanguageId = input.questionLanguageId ?? getAvg001QuestionLanguageIds()[0]!;
  const seed = input.seed ?? `avg-001:${questionLanguageId}:default`;
  const language = input.language ?? "en";
  const entry = getAvg001QuestionEntry(questionLanguageId);
  const numericId = Number(questionLanguageId.slice(-3));

  if (numericId >= 374 && numericId <= 425) {
    return finalizePackage(runAvg001GapExpansionPipeline({ questionLanguageId, seed, language }));
  }
  if (entry.cpId === "AVG-CP-002") {
    return finalizePackage(finalizeExplanation(runAvg001Cp002Pipeline({ questionLanguageId, seed, language })));
  }
  if (entry.cpId === "AVG-CP-003") {
    return finalizePackage(finalizeExplanation(runAvg001Cp003Pipeline({ questionLanguageId, seed, language })));
  }
  if (entry.cpId === "AVG-CP-004") {
    return finalizePackage(
      applyAvg001Cp004ExplanationVariants(
        finalizeExplanation(runAvg001Cp004ExactPipeline({ questionLanguageId, seed, language })),
      ),
    );
  }
  if (entry.cpId === "AVG-CP-005") {
    return finalizePackage(
      applyAvg001Cp005ExplanationPolish(
        applyAvg001Cp005ExplanationVariants(
          runAvg001Cp005Pipeline({ questionLanguageId, seed, language }),
        ),
      ),
    );
  }
  if (entry.cpId === "AVG-CP-006") {
    return finalizePackage(
      applyAvg001Cp006ExplanationPolish(
        runAvg001Cp006ExactPipeline({ questionLanguageId, seed, language }),
      ),
    );
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
    traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId, taskKind: entry.taskKind, solveMode: entry.solveMode, answerType: entry.answerType, contextDomain: entry.contextDomain, scenarioVariant: entry.scenarioVariant },
  };
  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) throw new Error(validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join("\n"));
  return finalizePackage(finalizeExplanation({ ...base, validation }));
}
