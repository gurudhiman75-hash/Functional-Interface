import { generatePrt001AdvancedParameters } from "./advanced-parameter-generator";
import { generatePrt001E1Parameters, isPrt001E1SolveMode } from "./e1-parameter-generator";
import { generatePrt001Options } from "./distractor-generator";
import { renderPrt001E1Explanation } from "./e1-explanation-renderer";
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
import {
  independentlySolvePrt001E1Task,
  solvePrt001E1Task,
} from "./e1-task-solver";
import { independentlySolvePrt001Task, solvePrt001Task } from "./task-solver";
import {
  PRT_001_CP_IDS,
  PRT_001_PACKAGE_ID,
  type Prt001Language,
  type Prt001Difficulty,
  type Prt001PilotCanonicalProblemId,
  type Prt001QuestionPackage,
} from "./types";

export function runPrt001PilotPipeline(
  input: {
    questionLanguageId?: string;
    seed?: string;
    language?: Prt001Language;
  } = {},
): Prt001QuestionPackage {
  const libraryFailures = validatePrt001PilotLibraries();
  if (libraryFailures.length > 0) throw new Error(libraryFailures.join("\n"));
  const language = input.language ?? "en";
  const questionLanguageId =
    input.questionLanguageId ?? getPrt001QuestionLanguageIds()[0]!;
  const seed = input.seed ?? `prt-001:${questionLanguageId}:default`;
  const entry = getPrt001TaskEntry(questionLanguageId);
  const isE1 = isPrt001E1SolveMode(entry.solveMode);
  const parameters = isE1
    ? generatePrt001E1Parameters({
        questionLanguageId,
        seed,
        entry,
        language,
      })
    : entry.cpId === "PRT-CP-001" || entry.cpId === "PRT-CP-002"
      ? generatePrt001PilotParameters({
          questionLanguageId,
          seed,
          entry,
          language,
        })
      : generatePrt001AdvancedParameters({
          questionLanguageId,
          seed,
          entry,
          language,
        });
  const solution = solvePrt001State(parameters.state);
  const verification = verifyPrt001Independently(parameters.state);
  const taskAnswer = isE1
    ? solvePrt001E1Task(parameters, solution)
    : solvePrt001Task(parameters, solution);
  const independentTaskAnswer = isE1
    ? independentlySolvePrt001E1Task(parameters, verification)
    : independentlySolvePrt001Task(parameters, verification);
  const stem = renderPrt001Template(
    getPrt001QuestionTemplate(questionLanguageId, language),
    parameters.renderVariables,
  );
  const explanationLines = isE1
    ? renderPrt001E1Explanation({ parameters, solution, answer: taskAnswer })
    : renderPrt001Explanation({ parameters, solution, answer: taskAnswer });
  const reasoningGraph = buildPrt001ReasoningGraph({
    parameters,
    solution,
    answer: taskAnswer,
  });
  const { options, correctIndex } = generatePrt001Options({
    parameters,
    solution,
    answer: taskAnswer,
    random: createPrt001Random(`${seed}:options`),
  });
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
      exactWeights: Object.fromEntries(
        solution.timeline.weights.map((item) => [
          item.partnerId,
          formatRational(item.effectiveCapital),
        ]),
      ),
      normalizedRatio: solution.normalizedRatio.map(String).join(":"),
      grossProfitOrLoss: formatRational(parameters.state.grossProfitOrLoss),
      verifierMethod: verification.method,
      expansionWave: isE1 ? "E1" : "BASELINE",
    },
  };
  const validation = validatePrt001QuestionPackage({
    package: base,
    parameters,
    solution,
    verification,
    taskAnswer,
    independentTaskAnswer,
  });
  if (!validation.valid) {
    throw new Error(
      validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("\n"),
    );
  }
  return { ...base, validation };
}

export function getPrt001ActiveCanonicalProblemIds(): readonly Prt001PilotCanonicalProblemId[] {
  return PRT_001_CP_IDS;
}

export function runPrt001Pipeline(
  cpId: Prt001PilotCanonicalProblemId,
  input: {
    difficultyBand?: Prt001Difficulty;
    language?: Prt001Language;
    questionLanguageId?: string;
    seed?: string;
  } = {},
): Prt001QuestionPackage {
  const candidates = getPrt001TaskEntries().filter(
    ({ entry }) =>
      entry.cpId === cpId &&
      (!input.difficultyBand || entry.difficulty === input.difficultyBand),
  );
  if (candidates.length === 0) {
    throw new Error(
      `No active PRT-001 QLs match ${cpId}${input.difficultyBand ? ` / ${input.difficultyBand}` : ""}`,
    );
  }
  let questionLanguageId = input.questionLanguageId;
  if (questionLanguageId) {
    if (
      !candidates.some(
        (candidate) => candidate.questionLanguageId === questionLanguageId,
      )
    ) {
      throw new Error(`${questionLanguageId} is not active for ${cpId}`);
    }
  } else {
    const seed = input.seed ?? `prt-001:${cpId}:default`;
    questionLanguageId = createPrt001Random(`${seed}:ql`).pick(
      candidates,
    ).questionLanguageId;
  }
  return runPrt001PilotPipeline({
    questionLanguageId,
    seed: input.seed,
    language: input.language,
  });
}
