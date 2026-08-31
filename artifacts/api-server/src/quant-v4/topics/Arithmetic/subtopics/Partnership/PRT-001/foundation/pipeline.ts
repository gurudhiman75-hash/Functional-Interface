import { generatePrt001AdvancedParameters } from "./advanced-parameter-generator";
import { generatePrt001E1Parameters, isPrt001E1SolveMode } from "./e1-parameter-generator";
import { generatePrt001E2Parameters, isPrt001E2SolveMode } from "./e2-parameter-generator";
import { normalizePrt001E2ProductionMoney } from "./e2-production-normalizer";
import { generatePrt001E3AParameters, isPrt001E3ASolveMode } from "./e3a-parameter-generator";
import { generatePrt001E3BParameters, isPrt001E3BSolveMode } from "./e3b-parameter-generator";
import { generatePrt001E4Parameters, isPrt001E4SolveMode } from "./e4-parameter-generator";
import { refinePrt001E4ProductionState } from "./e4-production-refiner";
import { generatePrt001E5Parameters, isPrt001E5SolveMode } from "./e5-parameter-generator";
import { generatePrt001E8Parameters, isPrt001E8QuestionLanguageId } from "./e8-parameter-generator";
import { generatePrt001Options } from "./distractor-generator";
import { renderPrt001E1Explanation } from "./e1-explanation-renderer";
import { renderPrt001E2Explanation } from "./e2-explanation-renderer";
import { renderPrt001E3AExplanation } from "./e3a-explanation-renderer";
import { renderPrt001E3BExplanation } from "./e3b-explanation-renderer";
import { renderPrt001E4Explanation } from "./e4-explanation-renderer";
import { renderPrt001E5Explanation } from "./e5-explanation-renderer";
import { renderPrt001E8Explanation } from "./e8-explanation-renderer";
import { renderPrt001Explanation } from "./explanation-renderer";
import { verifyPrt001Independently } from "./independent-verifier";
import {
  getPrt001QuestionLanguageIds,
  getPrt001QuestionTemplate,
  getPrt001TaskEntry,
  getPrt001TaskEntries,
  renderPrt001Template,
  validatePrt001PilotLibraries,
} from "./library";
import { formatRational } from "./math";
import { generatePrt001PilotParameters } from "./parameter-generator";
import { validatePrt001QuestionPackage } from "./question-package-validator";
import { createPrt001Random } from "./random";
import { buildPrt001ReasoningGraph } from "./reasoning-graph";
import { solvePrt001State } from "./solver";
import { independentlySolvePrt001E1Task, solvePrt001E1Task } from "./e1-task-solver";
import { independentlySolvePrt001E2Task, solvePrt001E2Task } from "./e2-task-solver";
import { independentlySolvePrt001E3ATask, solvePrt001E3ATask } from "./e3a-task-solver";
import { independentlySolvePrt001E3BTask, solvePrt001E3BTask } from "./e3b-task-solver";
import { independentlySolvePrt001E4Task, solvePrt001E4Task } from "./e4-task-solver";
import { independentlySolvePrt001E5Task, solvePrt001E5Task } from "./e5-task-solver";
import { independentlySolvePrt001E8Task, solvePrt001E8Task } from "./e8-task-solver";
import { independentlySolvePrt001Task, solvePrt001Task } from "./task-solver";
import {
  PRT_001_CP_IDS,
  PRT_001_PACKAGE_ID,
  type Prt001Language,
  type Prt001Difficulty,
  type Prt001PilotCanonicalProblemId,
  type Prt001QuestionPackage,
} from "./types";

export function runPrt001PilotPipeline(input: { questionLanguageId?: string; seed?: string; language?: Prt001Language } = {}): Prt001QuestionPackage {
  const libraryFailures = validatePrt001PilotLibraries();
  if (libraryFailures.length > 0) throw new Error(libraryFailures.join("\n"));
  const language = input.language ?? "en";
  const questionLanguageId = input.questionLanguageId ?? getPrt001QuestionLanguageIds()[0]!;
  const seed = input.seed ?? `prt-001:${questionLanguageId}:default`;
  const entry = getPrt001TaskEntry(questionLanguageId);
  const isE8 = isPrt001E8QuestionLanguageId(questionLanguageId);
  const isE5 = !isE8 && isPrt001E5SolveMode(entry.solveMode);
  const isE4 = !isE8 && !isE5 && isPrt001E4SolveMode(entry.solveMode);
  const isE3A = !isE8 && !isE5 && !isE4 && isPrt001E3ASolveMode(entry.solveMode);
  const isE3B = !isE8 && !isE5 && !isE4 && !isE3A && isPrt001E3BSolveMode(entry.solveMode);
  const isE3 = isE3A || isE3B;
  const isE2 = !isE8 && !isE5 && !isE4 && !isE3 && isPrt001E2SolveMode(entry.solveMode);
  const isE1 = !isE8 && !isE5 && !isE4 && !isE3 && !isE2 && isPrt001E1SolveMode(entry.solveMode);
  const generatedParameters = isE8
    ? generatePrt001E8Parameters({ questionLanguageId, seed, entry, language })
    : isE5
      ? generatePrt001E5Parameters({ questionLanguageId, seed, entry, language })
      : isE4
        ? generatePrt001E4Parameters({ questionLanguageId, seed, entry, language })
        : isE3A
          ? generatePrt001E3AParameters({ questionLanguageId, seed, entry, language })
          : isE3B
            ? generatePrt001E3BParameters({ questionLanguageId, seed, entry, language })
            : isE2
              ? generatePrt001E2Parameters({ questionLanguageId, seed, entry, language })
              : isE1
                ? generatePrt001E1Parameters({ questionLanguageId, seed, entry, language })
                : entry.cpId === "PRT-CP-001" || entry.cpId === "PRT-CP-002"
                  ? generatePrt001PilotParameters({ questionLanguageId, seed, entry, language })
                  : generatePrt001AdvancedParameters({ questionLanguageId, seed, entry, language });
  const e4RefinedParameters = isE4 ? refinePrt001E4ProductionState(generatedParameters) : generatedParameters;
  const parameters = isE2 ? normalizePrt001E2ProductionMoney(e4RefinedParameters) : e4RefinedParameters;
  const solution = solvePrt001State(parameters.state);
  const verification = verifyPrt001Independently(parameters.state);
  const taskAnswer = isE8
    ? solvePrt001E8Task(parameters, solution)
    : isE5
      ? solvePrt001E5Task(parameters, solution)
      : isE4
        ? solvePrt001E4Task(parameters, solution)
        : isE3A
          ? solvePrt001E3ATask(parameters, solution)
          : isE3B
            ? solvePrt001E3BTask(parameters, solution)
            : isE2
              ? solvePrt001E2Task(parameters, solution)
              : isE1
                ? solvePrt001E1Task(parameters, solution)
                : solvePrt001Task(parameters, solution);
  const independentTaskAnswer = isE8
    ? independentlySolvePrt001E8Task(parameters, verification)
    : isE5
      ? independentlySolvePrt001E5Task(parameters, verification)
      : isE4
        ? independentlySolvePrt001E4Task(parameters, verification)
        : isE3A
          ? independentlySolvePrt001E3ATask(parameters, verification)
          : isE3B
            ? independentlySolvePrt001E3BTask(parameters, verification)
            : isE2
              ? independentlySolvePrt001E2Task(parameters, verification)
              : isE1
                ? independentlySolvePrt001E1Task(parameters, verification)
                : independentlySolvePrt001Task(parameters, verification);
  const stem = renderPrt001Template(getPrt001QuestionTemplate(questionLanguageId, language, seed), parameters.renderVariables);
  const explanationLines = isE8
    ? renderPrt001E8Explanation({ parameters, solution, answer: taskAnswer })
    : isE5
      ? renderPrt001E5Explanation({ parameters, solution, answer: taskAnswer })
      : isE4
        ? renderPrt001E4Explanation({ parameters, solution, answer: taskAnswer })
        : isE3A
          ? renderPrt001E3AExplanation({ parameters, solution, answer: taskAnswer })
          : isE3B
            ? renderPrt001E3BExplanation({ parameters, solution, answer: taskAnswer })
            : isE2
              ? renderPrt001E2Explanation({ parameters, solution, answer: taskAnswer })
              : isE1
                ? renderPrt001E1Explanation({ parameters, solution, answer: taskAnswer })
                : renderPrt001Explanation({ parameters, solution, answer: taskAnswer });
  const reasoningGraph = buildPrt001ReasoningGraph({ parameters, solution, answer: taskAnswer });
  const { options, correctIndex } = generatePrt001Options({ parameters, solution, answer: taskAnswer, random: createPrt001Random(`${seed}:options`) });
  const expansionWave = isE8 ? "E8" : isE5 ? "E5" : isE4 ? "E4" : isE3 ? "E3" : isE2 ? "E2" : isE1 ? "E1" : "BASELINE";
  const base: Omit<Prt001QuestionPackage, "validation"> = {
    packageId: PRT_001_PACKAGE_ID,
    archetypeId: PRT_001_PACKAGE_ID,
    canonicalProblemId: entry.cpId,
    questionLanguageId,
    questionId: `${PRT_001_PACKAGE_ID}:${questionLanguageId}:${seed}`,
    seed,
    language,
    difficulty: entry.difficulty,
    difficultyBand: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    stem,
    options,
    correctIndex,
    answer: taskAnswer.display,
    explanation: { lines: explanationLines },
    parameters: parameters.renderVariables,
    reasoningGraph,
    maturity: "RUNTIME_PROOF",
    publiclyPublishable: false,
    traceability: {
      chapterId: PRT_001_PACKAGE_ID,
      cpId: entry.cpId,
      questionLanguageId,
      taskKind: entry.taskKind,
      solveMode: entry.solveMode,
      answerType: entry.answerType,
      difficulty: entry.difficulty,
      scenarioFamily: entry.scenarioFamily,
      scenarioId: entry.scenarioFamily,
      distractorProfile: entry.distractorProfile,
      explanationStrategy: entry.explanationStrategy,
      seed,
      parameters: parameters.renderVariables,
      exactWeights: Object.fromEntries(solution.timeline.weights.map((item) => [item.partnerId, formatRational(item.effectiveCapital)])),
      normalizedRatio: solution.normalizedRatio.map(String).join(":"),
      grossProfitOrLoss: formatRational(parameters.state.grossProfitOrLoss),
      verifierMethod: verification.method,
      expansionWave,
    },
  };
  const validation = validatePrt001QuestionPackage({ package: base, parameters, solution, verification, taskAnswer, independentTaskAnswer });
  if (!validation.valid) throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  return { ...base, validation };
}

export function getPrt001ActiveCanonicalProblemIds(): readonly Prt001PilotCanonicalProblemId[] { return PRT_001_CP_IDS; }

export function runPrt001Pipeline(cpId: Prt001PilotCanonicalProblemId, input: { difficultyBand?: Prt001Difficulty; language?: Prt001Language; questionLanguageId?: string; seed?: string } = {}): Prt001QuestionPackage {
  const candidates = getPrt001TaskEntries().filter(({ entry }) => entry.cpId === cpId && (!input.difficultyBand || entry.difficulty === input.difficultyBand));
  if (candidates.length === 0) throw new Error(`No active PRT-001 QLs match ${cpId}${input.difficultyBand ? ` / ${input.difficultyBand}` : ""}`);
  let questionLanguageId = input.questionLanguageId;
  if (questionLanguageId) {
    if (!candidates.some((candidate) => candidate.questionLanguageId === questionLanguageId)) throw new Error(`${questionLanguageId} is not active for ${cpId}`);
  } else {
    const seed = input.seed ?? `prt-001:${cpId}:default`;
    questionLanguageId = createPrt001Random(`${seed}:ql`).pick(candidates).questionLanguageId;
  }
  return runPrt001PilotPipeline({ questionLanguageId, seed: input.seed, language: input.language });
}
