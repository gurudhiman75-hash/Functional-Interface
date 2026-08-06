import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import type { AtomicOrder, ConclusionTruth } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp003Option, IneCp003Scenario } from "./types";

export const CP003_TRUTH_LABELS: Readonly<Record<ConclusionTruth, string>> = {
  DEFINITELY_TRUE: "Definitely true",
  POSSIBLY_TRUE: "Possibly true, but not definite",
  IMPOSSIBLE: "Impossible",
};

const RELATION_SETS: readonly (readonly AtomicOrder[])[] = [
  ["LT"],
  ["EQ"],
  ["GT"],
  ["LT", "EQ"],
  ["EQ", "GT"],
  ["LT", "EQ", "GT"],
];

function balancedCorrectIndex(namespace: string, seed: number): number {
  const normalizedSeed = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  const block = Math.floor(normalizedSeed / 4);
  const slot = normalizedSeed % 4;
  const random = new SeededRandom(
    Number.parseInt(
      stableHash([namespace, block, "cp003-balanced-position-v1"]),
      16,
    ),
  );
  return random.shuffle([0, 1, 2, 3])[slot]!;
}

function atomicSetKey(relations: readonly AtomicOrder[]): string {
  return ["LT", "EQ", "GT"]
    .filter((relation) => relations.includes(relation as AtomicOrder))
    .join("|");
}

export function formatAtomicRelationSet(
  relations: readonly AtomicOrder[],
  leftName: string,
  rightName: string,
): string {
  const clauses = relations.map((relation) => {
    const symbol = relation === "LT" ? "<" : relation === "GT" ? ">" : "=";
    return `${leftName} ${symbol} ${rightName}`;
  });
  if (clauses.length <= 1) return clauses[0] ?? "No relation is possible";
  if (clauses.length === 2) return `${clauses[0]} or ${clauses[1]}`;
  return `${clauses.slice(0, -1).join(", ")}, or ${clauses.at(-1)}`;
}

function placeCorrectOption(
  correct: IneCp003Option,
  distractors: readonly IneCp003Option[],
  namespace: string,
  seed: number,
): { options: readonly IneCp003Option[]; correctIndex: number } {
  const correctIndex = balancedCorrectIndex(namespace, seed);
  let distractorIndex = 0;
  const options = Array.from({ length: 4 }, (_, index) =>
    index === correctIndex ? correct : distractors[distractorIndex++]!,
  );
  return { options, correctIndex };
}

export function buildIneCp003Options(
  scenario: IneCp003Scenario,
  seed: number,
): {
  options: readonly IneCp003Option[];
  correctIndex: number;
  conclusionTruths: readonly ConclusionTruth[];
  possibleAtomicRelations?: readonly AtomicOrder[];
} {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([scenario.scenarioId, "options-v1"]), 16),
  );
  const evaluations = scenario.conclusions.map((conclusion) =>
    evaluateConclusion(scenario.statements, conclusion),
  );
  const conclusionTruths = evaluations.map((evaluation) => evaluation.truth);

  if (scenario.taskKind === "CLASSIFY_CONCLUSION") {
    const truth = evaluations[0]!.truth;
    const correct: IneCp003Option = {
      value: CP003_TRUTH_LABELS[truth],
      truth,
      isCorrect: true,
    };
    const distractors = random.shuffle([
      ...(["DEFINITELY_TRUE", "POSSIBLY_TRUE", "IMPOSSIBLE"] as const)
        .filter((candidate) => candidate !== truth)
        .map(
          (candidate): IneCp003Option => ({
            value: CP003_TRUTH_LABELS[candidate],
            truth: candidate,
            isCorrect: false,
            errorLabel:
              candidate === "DEFINITELY_TRUE"
                ? "POSSIBLE_OR_IMPOSSIBLE_MISREAD_AS_DEFINITE"
                : candidate === "POSSIBLY_TRUE"
                  ? "CERTAINTY_MISREAD_AS_POSSIBILITY"
                  : "POSSIBLE_OR_DEFINITE_MISREAD_AS_IMPOSSIBLE",
          }),
        ),
      {
        value: "The statements are contradictory",
        isCorrect: false,
        errorLabel: "INVENTED_CONTRADICTION",
      },
    ]);
    const placed = placeCorrectOption(
      correct,
      distractors,
      `${scenario.taskKind}:${scenario.explanationKind}`,
      seed,
    );
    return { ...placed, conclusionTruths };
  }

  if (scenario.taskKind === "SELECT_CONCLUSION") {
    const targetTruth = scenario.targetTruth!;
    const correctEvaluations = evaluations.filter(
      (evaluation) => evaluation.truth === targetTruth,
    );
    if (correctEvaluations.length !== 1) {
      throw new Error(
        `${scenario.scenarioId} requires one ${targetTruth} conclusion; found ${correctEvaluations.length}.`,
      );
    }
    const correctEvaluation = correctEvaluations[0]!;
    const correct: IneCp003Option = {
      value: formatStatement(
        correctEvaluation.conclusion,
        scenario.entityNames,
      ),
      conclusion: correctEvaluation.conclusion,
      truth: correctEvaluation.truth,
      isCorrect: true,
    };
    const distractors = random
      .shuffle(
        evaluations
          .filter((evaluation) => evaluation !== correctEvaluation)
          .map(
            (evaluation): IneCp003Option => ({
              value: formatStatement(
                evaluation.conclusion,
                scenario.entityNames,
              ),
              conclusion: evaluation.conclusion,
              truth: evaluation.truth,
              isCorrect: false,
              errorLabel:
                evaluation.truth === "DEFINITELY_TRUE"
                  ? "DEFINITE_CONCLUSION_WRONG_TARGET"
                  : evaluation.truth === "POSSIBLY_TRUE"
                    ? "POSSIBLE_CONCLUSION_WRONG_TARGET"
                    : "IMPOSSIBLE_CONCLUSION_WRONG_TARGET",
            }),
          ),
      )
      .slice(0, 3);
    const placed = placeCorrectOption(
      correct,
      distractors,
      `${scenario.taskKind}:${targetTruth}`,
      seed,
    );
    return { ...placed, conclusionTruths };
  }

  const query = scenario.query!;
  const evidence = evaluateConclusion(scenario.statements, {
    leftId: query.leftId,
    relation: "GREATER_THAN_OR_EQUAL",
    rightId: query.rightId,
    sourceStatementId: "QUERY",
  }).pairEvidence;
  const possibleAtomicRelations = evidence.possibleAtomicRelations;
  const correctKey = atomicSetKey(possibleAtomicRelations);
  const leftName = scenario.entityNames[query.leftId] ?? query.leftId;
  const rightName = scenario.entityNames[query.rightId] ?? query.rightId;
  const correct: IneCp003Option = {
    value: formatAtomicRelationSet(
      possibleAtomicRelations,
      leftName,
      rightName,
    ),
    atomicRelations: possibleAtomicRelations,
    isCorrect: true,
  };
  const distractors = random
    .shuffle(
      RELATION_SETS.filter(
        (relations) => atomicSetKey(relations) !== correctKey,
      ).map(
        (relations): IneCp003Option => ({
          value: formatAtomicRelationSet(relations, leftName, rightName),
          atomicRelations: relations,
          isCorrect: false,
          errorLabel:
            relations.length < possibleAtomicRelations.length
              ? "OMITTED_POSSIBLE_RELATION"
              : "INVENTED_POSSIBLE_RELATION",
        }),
      ),
    )
    .slice(0, 3);
  const placed = placeCorrectOption(
    correct,
    distractors,
    `${scenario.taskKind}:${scenario.explanationKind}`,
    seed,
  );
  return {
    ...placed,
    conclusionTruths,
    possibleAtomicRelations,
  };
}
