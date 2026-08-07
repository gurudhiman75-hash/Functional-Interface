import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import { formatStatement } from "../INE-CP-001/presentation";
import { evaluateComplementaryPair } from "./complementary";
import type {
  IneCp004ComplementEvidence,
  IneCp004ConclusionPair,
  IneCp004Option,
  IneCp004PairStatus,
  IneCp004Scenario,
  IneCp004ThreeConclusionMask,
  IneCp004TwoConclusionMask,
} from "./types";

export const CP004_PAIR_STATUS_LABELS: Readonly<
  Record<IneCp004PairStatus, string>
> = {
  VALID_EITHER_OR: "Valid either-or pair",
  NOT_EXHAUSTIVE: "Not either-or: some valid cases are left uncovered",
  NOT_EXCLUSIVE: "Not either-or: the conclusions overlap",
};

export const CP004_TWO_MASK_LABELS: Readonly<
  Record<IneCp004TwoConclusionMask, string>
> = {
  ONLY_I: "Only conclusion I follows",
  ONLY_II: "Only conclusion II follows",
  EITHER_I_OR_II: "Either conclusion I or conclusion II follows",
  NEITHER: "Neither conclusion I nor conclusion II follows",
  BOTH: "Both conclusions I and II follow",
};

export const CP004_THREE_MASK_LABELS: Readonly<
  Record<IneCp004ThreeConclusionMask, string>
> = {
  ONLY_I: "Only conclusion I follows",
  EITHER_II_OR_III: "Either conclusion II or conclusion III follows",
  I_AND_EITHER_II_OR_III:
    "Conclusion I and either conclusion II or conclusion III follow",
  NONE: "None of the conclusions follows",
};

export function formatConclusionPair(
  pair: IneCp004ConclusionPair,
  entityNames: Readonly<Record<string, string>>,
): string {
  return `I. ${formatStatement(pair.first, entityNames)}; II. ${formatStatement(pair.second, entityNames)}`;
}

function balancedCorrectIndex(
  namespace: string,
  seed: number,
  optionCount: number,
): number {
  const normalizedSeed = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  const block = Math.floor(normalizedSeed / optionCount);
  const slot = normalizedSeed % optionCount;
  const random = new SeededRandom(
    Number.parseInt(
      stableHash([namespace, block, "cp004-balanced-position-v1"]),
      16,
    ),
  );
  return random.shuffle(
    Array.from({ length: optionCount }, (_, index) => index),
  )[slot]!;
}

function placeCorrectOption(
  correct: IneCp004Option,
  distractors: readonly IneCp004Option[],
  namespace: string,
  seed: number,
): { options: readonly IneCp004Option[]; correctIndex: number } {
  const optionCount = distractors.length + 1;
  const correctIndex = balancedCorrectIndex(namespace, seed, optionCount);
  let distractorIndex = 0;
  const options = Array.from({ length: optionCount }, (_, index) =>
    index === correctIndex ? correct : distractors[distractorIndex++]!,
  );
  return { options, correctIndex };
}

function statusErrorLabel(status: IneCp004PairStatus): string {
  if (status === "VALID_EITHER_OR") return "MISSED_VALID_PARTITION";
  if (status === "NOT_EXHAUSTIVE") return "IGNORED_UNCOVERED_RELATION";
  return "IGNORED_OVERLAP";
}

export function buildIneCp004Options(
  scenario: IneCp004Scenario,
  seed: number,
): {
  options: readonly IneCp004Option[];
  correctIndex: number;
  conclusionTruths: ReturnType<typeof evaluateConclusion>["truth"][];
  complementaryEvidence: readonly IneCp004ComplementEvidence[];
} {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([scenario.scenarioId, "options-v1"]), 16),
  );
  const conclusionTruths = scenario.conclusions.map(
    (conclusion) => evaluateConclusion(scenario.statements, conclusion).truth,
  );

  if (scenario.taskKind === "CLASSIFY_PAIR") {
    const pair = {
      first: scenario.conclusions[0]!,
      second: scenario.conclusions[1]!,
    };
    const evidence = evaluateComplementaryPair(scenario.statements, pair);
    const status = evidence.status;
    if (!status || status !== scenario.expectedPairStatus) {
      throw new Error(`${scenario.scenarioId} has an unexpected pair status.`);
    }
    const correct: IneCp004Option = {
      value: CP004_PAIR_STATUS_LABELS[status],
      pairStatus: status,
      isCorrect: true,
    };
    const distractors = random.shuffle(
      (Object.keys(CP004_PAIR_STATUS_LABELS) as IneCp004PairStatus[])
        .filter((candidate) => candidate !== status)
        .map(
          (candidate): IneCp004Option => ({
            value: CP004_PAIR_STATUS_LABELS[candidate],
            pairStatus: candidate,
            isCorrect: false,
            errorLabel: statusErrorLabel(candidate),
          }),
        ),
    );
    return {
      ...placeCorrectOption(correct, distractors, scenario.taskKind, seed),
      conclusionTruths,
      complementaryEvidence: [evidence],
    };
  }

  if (scenario.taskKind === "SELECT_PAIR") {
    const evidence = scenario.candidatePairs!.map((pair) =>
      evaluateComplementaryPair(scenario.statements, pair),
    );
    const validIndices = evidence.flatMap((entry, index) =>
      entry.validEitherOr ? [index] : [],
    );
    if (validIndices.length !== 1) {
      throw new Error(`${scenario.scenarioId} requires one valid pair.`);
    }
    const correctPairIndex = validIndices[0]!;
    const correct: IneCp004Option = {
      value: formatConclusionPair(
        scenario.candidatePairs![correctPairIndex]!,
        scenario.entityNames,
      ),
      candidatePairIndex: correctPairIndex,
      pairStatus: "VALID_EITHER_OR",
      isCorrect: true,
    };
    const distractors = random.shuffle(
      scenario.candidatePairs!.flatMap((pair, index) => {
        if (index === correctPairIndex) return [];
        const status = evidence[index]!.status!;
        return [
          {
            value: formatConclusionPair(pair, scenario.entityNames),
            candidatePairIndex: index,
            pairStatus: status,
            isCorrect: false,
            errorLabel: statusErrorLabel(status),
          } satisfies IneCp004Option,
        ];
      }),
    );
    return {
      ...placeCorrectOption(
        correct,
        distractors,
        `${scenario.taskKind}:VALID_EITHER_OR`,
        seed,
      ),
      conclusionTruths,
      complementaryEvidence: evidence,
    };
  }

  if (scenario.taskKind === "EVALUATE_TWO_CONCLUSIONS") {
    const evidence = evaluateComplementaryPair(scenario.statements, {
      first: scenario.conclusions[0]!,
      second: scenario.conclusions[1]!,
    });
    if (!evidence.validEitherOr) {
      throw new Error(
        `${scenario.scenarioId} requires a valid either-or pair.`,
      );
    }
    const correctMask: IneCp004TwoConclusionMask = "EITHER_I_OR_II";
    const correct: IneCp004Option = {
      value: CP004_TWO_MASK_LABELS[correctMask],
      twoConclusionMask: correctMask,
      isCorrect: true,
    };
    const distractors = random.shuffle(
      (Object.keys(CP004_TWO_MASK_LABELS) as IneCp004TwoConclusionMask[])
        .filter((mask) => mask !== correctMask)
        .map(
          (mask): IneCp004Option => ({
            value: CP004_TWO_MASK_LABELS[mask],
            twoConclusionMask: mask,
            isCorrect: false,
            errorLabel:
              mask === "BOTH"
                ? "TREATED_EXCLUSIVE_CASES_AS_SIMULTANEOUS"
                : mask === "NEITHER"
                  ? "IGNORED_JOINT_EXHAUSTIVENESS"
                  : "PROMOTED_ONE_POSSIBILITY_TO_CERTAINTY",
          }),
        ),
    );
    return {
      ...placeCorrectOption(
        correct,
        distractors,
        `${scenario.taskKind}:EITHER_I_OR_II`,
        seed,
      ),
      conclusionTruths,
      complementaryEvidence: [evidence],
    };
  }

  const evidence = evaluateComplementaryPair(scenario.statements, {
    first: scenario.conclusions[1]!,
    second: scenario.conclusions[2]!,
  });
  if (conclusionTruths[0] !== "DEFINITELY_TRUE" || !evidence.validEitherOr) {
    throw new Error(`${scenario.scenarioId} violates the three-part contract.`);
  }
  const correctMask: IneCp004ThreeConclusionMask = "I_AND_EITHER_II_OR_III";
  const correct: IneCp004Option = {
    value: CP004_THREE_MASK_LABELS[correctMask],
    threeConclusionMask: correctMask,
    isCorrect: true,
  };
  const distractors = random.shuffle(
    (Object.keys(CP004_THREE_MASK_LABELS) as IneCp004ThreeConclusionMask[])
      .filter((mask) => mask !== correctMask)
      .map(
        (mask): IneCp004Option => ({
          value: CP004_THREE_MASK_LABELS[mask],
          threeConclusionMask: mask,
          isCorrect: false,
          errorLabel:
            mask === "ONLY_I"
              ? "MISSED_COMPLEMENTARY_PAIR"
              : mask === "EITHER_II_OR_III"
                ? "MISSED_SEPARATELY_DEFINITE_CONCLUSION"
                : "REJECTED_ALL_VALID_RESULTS",
        }),
      ),
  );
  return {
    ...placeCorrectOption(
      correct,
      distractors,
      `${scenario.taskKind}:I_AND_EITHER`,
      seed,
    ),
    conclusionTruths,
    complementaryEvidence: [evidence],
  };
}
