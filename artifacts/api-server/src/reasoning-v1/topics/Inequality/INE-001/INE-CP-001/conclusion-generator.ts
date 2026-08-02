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
  POSSIBLY_TRUE: "May be true, but is not certain",
  IMPOSSIBLE: "Cannot be true",
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
      value: "The statements contradict one another",
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

function allowedRelationText(
  evaluation: ReturnType<typeof evaluateConclusion>,
  entityNames: Readonly<Record<string, string>>,
): string {
  const leftName =
    entityNames[evaluation.conclusion.leftId] ?? evaluation.conclusion.leftId;
  const rightName =
    entityNames[evaluation.conclusion.rightId] ?? evaluation.conclusion.rightId;
  const relations = evaluation.pairEvidence.possibleAtomicRelations.map(
    (order) => {
      const symbol = order === "GT" ? ">" : order === "LT" ? "<" : "=";
      return `${leftName} ${symbol} ${rightName}`;
    },
  );
  if (relations.length === 1) return relations[0]!;
  if (relations.length === 2) return `${relations[0]} or ${relations[1]}`;
  return `${relations.slice(0, -1).join(", ")}, or ${relations.at(-1)}`;
}

function reasonForEvaluation(
  evaluation: ReturnType<typeof evaluateConclusion>,
  entityNames: Readonly<Record<string, string>>,
): string {
  const conclusion = formatStatement(evaluation.conclusion, entityNames);
  const allowed = allowedRelationText(evaluation, entityNames);
  if (evaluation.truth === "DEFINITELY_TRUE") {
    return `The statements force ${allowed}, so ${conclusion} definitely follows.`;
  }
  if (evaluation.truth === "POSSIBLY_TRUE") {
    return `The statements allow ${allowed}. The conclusion ${conclusion} works in one allowed case, but not in every case.`;
  }
  return `The statements force ${allowed}, which rules out ${conclusion}.`;
}

function singleDistractorWarning(
  option: IneCp001ConclusionOption,
  evaluation: ReturnType<typeof evaluateConclusion>,
  entityNames: Readonly<Record<string, string>>,
): string {
  if (option.errorLabel === "INVENT_CONTRADICTION") {
    return "The statements form a consistent chain; they do not contradict one another.";
  }
  const conclusion = formatStatement(evaluation.conclusion, entityNames);
  if (evaluation.truth === "DEFINITELY_TRUE") {
    return option.truth === "POSSIBLY_TRUE"
      ? `The chain leaves no alternative: ${conclusion} is true in every allowed arrangement.`
      : `The chain proves ${conclusion}, so the conclusion certainly can be true.`;
  }
  if (evaluation.truth === "POSSIBLY_TRUE") {
    return option.truth === "DEFINITELY_TRUE"
      ? "Equality is still allowed, so the conclusion is not certain."
      : "At least one allowed arrangement makes the conclusion true, so it is not impossible.";
  }
  return option.truth === "DEFINITELY_TRUE"
    ? `The statements prove the opposite of ${conclusion}, so it does not follow.`
    : `The statements rule out ${conclusion} completely, so it is not even possible.`;
}

function explanationFor(
  questionKind: IneCp001ConclusionPrototypeId,
  statements: readonly import("../foundation/types").ComparisonConstraint[],
  evaluations: readonly ReturnType<typeof evaluateConclusion>[],
  options: readonly IneCp001ConclusionOption[],
  entityNames: Readonly<Record<string, string>>,
): IneCp001Explanation {
  const single = questionKind === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION";
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const correctOption = options[correctIndex]!;
  const primaryEvaluation = single
    ? evaluations[0]!
    : evaluations.find(
        (evaluation) => evaluation.conclusion === correctOption.conclusion,
      )!;
  const displayedStatements = statements.map((statement) =>
    formatStatement(statement, entityNames),
  );
  const possibleEvidence =
    single && primaryEvaluation.truth === "POSSIBLY_TRUE"
      ? [
          `That is why the conclusion succeeds in one permitted case and fails in another.`,
        ]
      : [];
  return {
    ruleStatement: `Read the statements as one comparison chain: ${displayedStatements.join("; ")}.`,
    normalizedStatements: [],
    proofSteps: [reasonForEvaluation(primaryEvaluation, entityNames)],
    modelWitnesses: possibleEvidence,
    conclusion: single
      ? `Therefore, the correct answer is “${TRUTH_LABEL[primaryEvaluation.truth]}.”`
      : questionKind === "INE-CP001-PROT-SELECT-VALID-CONCLUSION"
        ? `Therefore, option ${correctIndex + 1} — ${correctOption.value} — is the only conclusion that definitely follows.`
        : `Therefore, option ${correctIndex + 1} — ${correctOption.value} — is the conclusion that does not follow.`,
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning: single
          ? singleDistractorWarning(option, primaryEvaluation, entityNames)
          : reasonForEvaluation(
              evaluations.find(
                (evaluation) => evaluation.conclusion === option.conclusion,
              )!,
              entityNames,
            ),
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
      ? "Based only on the statements, how should the conclusion be judged?"
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
      runtimeVersion: "ine-cp001-conclusion-prototype-v2",
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
