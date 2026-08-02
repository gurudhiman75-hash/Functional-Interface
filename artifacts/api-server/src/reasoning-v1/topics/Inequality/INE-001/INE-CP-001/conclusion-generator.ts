import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { stableHash } from "../foundation/prng";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ConclusionTruth } from "../foundation/types";
import { getIneCp001ConclusionContract } from "./conclusion-contracts";
import { buildIneCp001ConclusionScenario } from "./conclusion-scenarios";
import { formatStatement } from "./presentation";
import type {
  GeneratedIneCp001ConclusionQuestion,
  IneCp001ConclusionOption,
  IneCp001ConclusionPrototypeId,
  IneCp001Explanation,
} from "./types";

const TRUTH_LABEL: Readonly<Record<ConclusionTruth, string>> = {
  DEFINITELY_TRUE: "Definitely follows",
  POSSIBLY_TRUE: "Possibly true, but not definite",
  IMPOSSIBLE: "Impossible",
};

const TRUTH_SENTENCE: Readonly<Record<ConclusionTruth, string>> = {
  DEFINITELY_TRUE: "definitely follows",
  POSSIBLY_TRUE: "is possibly true, but does not definitely follow",
  IMPOSSIBLE: "is impossible",
};

function singleConclusionOptions(
  truth: ConclusionTruth,
  seed: number,
): { options: readonly IneCp001ConclusionOption[]; correctIndex: number } {
  const candidates: Array<{
    value: string;
    truth?: ConclusionTruth;
    errorLabel: string;
  }> = [
    {
      value: TRUTH_LABEL.DEFINITELY_TRUE,
      truth: "DEFINITELY_TRUE",
      errorLabel: "TREAT_NON_DEFINITE_AS_DEFINITE",
    },
    {
      value: TRUTH_LABEL.POSSIBLY_TRUE,
      truth: "POSSIBLY_TRUE",
      errorLabel: "CONFUSE_POSSIBLE_WITH_DEFINITE",
    },
    {
      value: TRUTH_LABEL.IMPOSSIBLE,
      truth: "IMPOSSIBLE",
      errorLabel: "REVERSE_CONCLUSION_TRUTH",
    },
    {
      value: "Statements are contradictory",
      errorLabel: "INVENT_CONTRADICTION",
    },
  ];
  const correct = candidates.find((candidate) => candidate.truth === truth)!;
  const incorrect = candidates.filter((candidate) => candidate !== correct);
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const options: IneCp001ConclusionOption[] = [];
  let incorrectIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    const candidate =
      index === correctIndex ? correct : incorrect[incorrectIndex++]!;
    options.push({
      value: candidate.value,
      truth: candidate.truth,
      isCorrect: index === correctIndex,
      errorLabel: index === correctIndex ? undefined : candidate.errorLabel,
    });
  }
  return { options, correctIndex };
}

function selectionOptions(
  evaluations: readonly ReturnType<typeof evaluateConclusion>[],
  selectInvalid: boolean,
  entityNames: Readonly<Record<string, string>>,
  seed: number,
): { options: readonly IneCp001ConclusionOption[]; correctIndex: number } {
  const isCorrectEvaluation = (truth: ConclusionTruth): boolean =>
    selectInvalid ? truth !== "DEFINITELY_TRUE" : truth === "DEFINITELY_TRUE";
  const correct = evaluations.filter((entry) =>
    isCorrectEvaluation(entry.truth),
  );
  if (correct.length !== 1) {
    throw new Error(
      `Conclusion selection requires exactly one correct option; received ${correct.length}.`,
    );
  }
  const incorrect = evaluations.filter((entry) => entry !== correct[0]);
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const ordered: (typeof evaluations)[number][] = [];
  let incorrectIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    ordered.push(
      index === correctIndex ? correct[0]! : incorrect[incorrectIndex++]!,
    );
  }
  return {
    correctIndex,
    options: ordered.map((evaluation, index) => ({
      value: formatStatement(evaluation.conclusion, entityNames),
      conclusion: evaluation.conclusion,
      truth: evaluation.truth,
      isCorrect: index === correctIndex,
      errorLabel:
        index === correctIndex
          ? undefined
          : selectInvalid
            ? "REJECT_VALID_CONCLUSION"
            : evaluation.truth === "POSSIBLY_TRUE"
              ? "TREAT_POSSIBLE_AS_DEFINITE"
              : "SELECT_IMPOSSIBLE_CONCLUSION",
    })),
  };
}

function explanationFor(
  questionKind: IneCp001ConclusionPrototypeId,
  statements: readonly import("../foundation/types").ComparisonConstraint[],
  evaluations: readonly ReturnType<typeof evaluateConclusion>[],
  options: readonly IneCp001ConclusionOption[],
  entityNames: Readonly<Record<string, string>>,
): IneCp001Explanation {
  const single = questionKind === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION";
  const witnesses: string[] = [];
  if (single && evaluations[0]!.truth === "POSSIBLY_TRUE") {
    const conclusion = evaluations[0]!.conclusion;
    const agreement = assertSolverAgreement(
      statements,
      conclusion.leftId,
      conclusion.rightId,
    );
    for (const order of agreement.modelEvidence.possibleAtomicRelations) {
      const assignment = agreement.modelEvidence.witnessByRelation[order]!;
      const leftName = entityNames[conclusion.leftId] ?? conclusion.leftId;
      const rightName = entityNames[conclusion.rightId] ?? conclusion.rightId;
      const symbol = order === "GT" ? ">" : order === "LT" ? "<" : "=";
      witnesses.push(
        `A valid model has ${leftName}=${assignment[conclusion.leftId]} and ${rightName}=${assignment[conclusion.rightId]}, so ${leftName} ${symbol} ${rightName}.`,
      );
    }
  }
  return {
    ruleStatement:
      "A conclusion definitely follows only when it is true in every valid model of the displayed statements. A possible conclusion is not a definite conclusion.",
    normalizedStatements: statements.map(
      (statement) =>
        `${statement.sourceStatementId}: ${formatStatement(statement, entityNames)}.`,
    ),
    proofSteps: evaluations.map(
      (evaluation) =>
        `${formatStatement(evaluation.conclusion, entityNames)} ${TRUTH_SENTENCE[evaluation.truth]}.`,
    ),
    modelWitnesses: witnesses,
    conclusion: single
      ? `Therefore, the conclusion is classified as: ${TRUTH_LABEL[evaluations[0]!.truth]}.`
      : `Therefore, option ${options.findIndex((option) => option.isCorrect) + 1} is the only conclusion that matches the question's validity condition.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning:
          option.errorLabel === "TREAT_POSSIBLE_AS_DEFINITE"
            ? "This conclusion can be true, but it is not forced by every valid model."
            : option.errorLabel === "INVENT_CONTRADICTION"
              ? "The displayed statements are consistent and admit valid models."
              : "This option does not match the independently verified conclusion status.",
      })),
  };
}

export function generateIneCp001ConclusionQuestion(
  prototypeId: IneCp001ConclusionPrototypeId,
  seed = 0,
): GeneratedIneCp001ConclusionQuestion {
  const contract = getIneCp001ConclusionContract(prototypeId);
  const scenario = buildIneCp001ConclusionScenario(prototypeId, seed);
  const evaluations = scenario.conclusions.map((conclusion) =>
    evaluateConclusion(scenario.statements, conclusion),
  );
  for (const conclusion of scenario.conclusions) {
    const agreement = assertSolverAgreement(
      scenario.statements,
      conclusion.leftId,
      conclusion.rightId,
    );
    if (!agreement.graphAnalysis.consistent)
      throw new Error("Conclusion scenario is contradictory.");
  }

  const optionResult =
    prototypeId === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION"
      ? singleConclusionOptions(evaluations[0]!.truth, seed)
      : selectionOptions(
          evaluations,
          prototypeId === "INE-CP001-PROT-SELECT-INVALID-CONCLUSION",
          scenario.entityNames,
          seed,
        );
  const displayedStatements = scenario.statements.map((statement) =>
    formatStatement(statement, scenario.entityNames),
  );
  const displayedConclusion =
    prototypeId === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION"
      ? formatStatement(scenario.conclusions[0]!, scenario.entityNames)
      : undefined;
  const stem =
    prototypeId === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION"
      ? "Classify the given conclusion using only the displayed statements."
      : prototypeId === "INE-CP001-PROT-SELECT-VALID-CONCLUSION"
        ? "Which conclusion definitely follows from the displayed statements?"
        : "Which conclusion does not follow from the displayed statements?";

  return {
    packageId: "INE-001",
    checkpointId: "INE-CP-001",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty:
      prototypeId === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION"
        ? "MEDIUM"
        : "HARD",
    renderer: "STRUCTURED_TEXT",
    answerType: contract.answerType,
    stem,
    displayedStatements,
    displayedConclusion,
    structuredStatements: scenario.statements,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    explanation: explanationFor(
      prototypeId,
      scenario.statements,
      evaluations,
      optionResult.options,
      scenario.entityNames,
    ),
    metadata: {
      runtimeVersion: "ine-cp001-conclusion-prototype-v1",
      hiddenFingerprint: stableHash([
        scenario.scenarioId,
        ...scenario.statements.flatMap((entry) => [
          entry.leftId,
          entry.relation,
          entry.rightId,
        ]),
        ...scenario.conclusions.flatMap((entry) => [
          entry.leftId,
          entry.relation,
          entry.rightId,
        ]),
      ]),
      conclusionTruths: evaluations.map((entry) => entry.truth),
      independentSolverAgreed: true,
      graphConsistent: true,
      distractorErrorLabels: optionResult.options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
    },
  };
}
