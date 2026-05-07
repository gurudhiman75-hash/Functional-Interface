import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import {
  createReasoningStep,
  pickRandomItem,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type AveragesScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function buildAveragesContext(
  context = "averages",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "group",
    metric,
    context,
  };
}

export function createSumRecoveryScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        count: 8,
        average: 24,
        knownSum: 161,
      },
      {
        count: 7,
        average: 18,
        knownSum: 111,
      },
      {
        count: 10,
        average: 22,
        knownSum: 198,
      },
    ],
    Medium: [
      {
        count: 12,
        average: 26,
        knownSum: 281,
      },
      {
        count: 9,
        average: 31,
        knownSum: 241,
      },
      {
        count: 15,
        average: 28,
        knownSum: 389,
      },
    ],
    Hard: [
      {
        count: 14,
        average: 32,
        knownSum: 403,
      },
      {
        count: 16,
        average: 27,
        knownSum: 401,
      },
      {
        count: 18,
        average: 29,
        knownSum: 489,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const totalSum =
    values.count * values.average;
  const correctAnswer =
    totalSum - values.knownSum;

  return {
    scenarioType: "sum-recovery",
    topicCluster: "averages",
    values: {
      ...values,
      totalSum,
    },
    formula: "totalSum - knownSum",
    text: `The average of ${values.count} numbers is ${values.average}. If the sum of all but one number is ${values.knownSum}, find the missing number.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Total sum = average x count = ${values.average} x ${values.count} = ${totalSum}.`,
      ),
      createReasoningStep(
        "infer",
        `Missing number = ${totalSum} - ${values.knownSum} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "missing value reconstruction",
      "missing number",
    ),
  };
}

export function createReplacementScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        count: 8,
        averageChange: 2,
      },
      {
        count: 10,
        averageChange: 1,
      },
      {
        count: 12,
        averageChange: 3,
      },
    ],
    Medium: [
      {
        count: 15,
        averageChange: 2,
      },
      {
        count: 20,
        averageChange: 3,
      },
      {
        count: 12,
        averageChange: 5,
      },
    ],
    Hard: [
      {
        count: 18,
        averageChange: 3,
      },
      {
        count: 16,
        averageChange: 4,
      },
      {
        count: 20,
        averageChange: 5,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    values.count *
    values.averageChange;

  return {
    scenarioType:
      "replacement-average-shift",
    topicCluster: "averages",
    values,
    formula:
      "count * averageChange",
    text: `In a class of ${values.count} students, one student is replaced by another and the average marks increase by ${values.averageChange}. Find the difference between the marks of the new student and the old student.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Average change x count gives total change in sum.`,
      ),
      createReasoningStep(
        "infer",
        `Required difference = ${values.averageChange} x ${values.count} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "replacement",
      "difference",
    ),
  };
}

export function createWeightedAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        groupA: 20,
        averageA: 18,
        groupB: 30,
        averageB: 22,
      },
      {
        groupA: 15,
        averageA: 24,
        groupB: 25,
        averageB: 28,
      },
      {
        groupA: 12,
        averageA: 30,
        groupB: 18,
        averageB: 20,
      },
    ],
    Medium: [
      {
        groupA: 24,
        averageA: 35,
        groupB: 36,
        averageB: 29,
      },
      {
        groupA: 28,
        averageA: 32,
        groupB: 42,
        averageB: 26,
      },
      {
        groupA: 25,
        averageA: 27,
        groupB: 40,
        averageB: 33,
      },
    ],
    Hard: [
      {
        groupA: 32,
        averageA: 42,
        groupB: 48,
        averageB: 36,
      },
      {
        groupA: 35,
        averageA: 38,
        groupB: 45,
        averageB: 30,
      },
      {
        groupA: 27,
        averageA: 44,
        groupB: 33,
        averageB: 28,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const sumA =
    values.groupA * values.averageA;
  const sumB =
    values.groupB * values.averageB;
  const correctAnswer =
    (sumA + sumB) /
    (values.groupA + values.groupB);

  return {
    scenarioType:
      "group-weighted-average",
    topicCluster: "averages",
    values: {
      ...values,
      sumA,
      sumB,
    },
    formula:
      "(sumA + sumB) / (groupA + groupB)",
    text: `The average marks of ${values.groupA} students is ${values.averageA} and the average marks of ${values.groupB} students is ${values.averageB}. Find the average marks of all the students together.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `First recover the two group sums: ${values.groupA} x ${values.averageA} = ${sumA} and ${values.groupB} x ${values.averageB} = ${sumB}.`,
      ),
      createReasoningStep(
        "transform",
        `Combined sum = ${sumA + sumB} and combined count = ${values.groupA + values.groupB}.`,
      ),
      createReasoningStep(
        "infer",
        `Combined average = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "weighted average",
      "combined average",
    ),
  };
}

export function createConsecutiveScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        count: 5,
        average: 25,
      },
      {
        count: 7,
        average: 20,
      },
      {
        count: 9,
        average: 30,
      },
    ],
    Medium: [
      {
        count: 5,
        average: 35,
      },
      {
        count: 7,
        average: 28,
      },
      {
        count: 9,
        average: 40,
      },
    ],
    Hard: [
      {
        count: 11,
        average: 45,
      },
      {
        count: 9,
        average: 55,
      },
      {
        count: 7,
        average: 50,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const halfSpan =
    (values.count - 1) / 2;
  const correctAnswer =
    values.average + halfSpan;

  return {
    scenarioType:
      "consecutive-middle-term",
    topicCluster: "averages",
    values: {
      ...values,
      halfSpan,
    },
    formula: "average + halfSpan",
    text: `The average of ${values.count} consecutive integers is ${values.average}. Find the greatest integer.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `For an odd number of consecutive integers, the average is the middle term.`,
      ),
      createReasoningStep(
        "infer",
        `Greatest term = middle term + ${(values.count - 1) / 2} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "consecutive numbers",
      "greatest term",
    ),
  };
}

export function createAgeAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        count: 5,
        currentAverage: 18,
        yearsLater: 4,
      },
      {
        count: 6,
        currentAverage: 22,
        yearsLater: 3,
      },
      {
        count: 4,
        currentAverage: 25,
        yearsLater: 5,
      },
    ],
    Medium: [
      {
        count: 8,
        futureAverage: 31,
        yearsLater: 3,
      },
      {
        count: 7,
        futureAverage: 29,
        yearsLater: 4,
      },
      {
        count: 9,
        futureAverage: 34,
        yearsLater: 2,
      },
    ],
    Hard: [
      {
        count: 10,
        futureAverage: 36,
        yearsLater: 5,
      },
      {
        count: 8,
        futureAverage: 33,
        yearsLater: 6,
      },
      {
        count: 12,
        futureAverage: 40,
        yearsLater: 4,
      },
    ],
  } as const;

  if (difficulty === "Easy") {
    const values = {
      ...pickRandomItem(sets.Easy),
    };
    const correctAnswer =
      values.currentAverage +
      values.yearsLater;

    return {
      scenarioType:
        "age-average-shift",
      topicCluster: "averages",
      values,
      formula:
        "currentAverage + yearsLater",
      text: `The present average age of ${values.count} members of a family is ${values.currentAverage}. What will be their average age after ${values.yearsLater} years?`,
      correctAnswer,
      distractorHints: [
        "wrongIntermediateValue",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Each member grows older by ${values.yearsLater} years, so the average also increases by ${values.yearsLater}.`,
        ),
        createReasoningStep(
          "infer",
          `Future average = ${values.currentAverage} + ${values.yearsLater} = ${correctAnswer}.`,
        ),
      ],
      context: buildAveragesContext(
        "age average",
        "future average",
      ),
    };
  }

  const values = {
    ...pickRandomItem(
      difficulty === "Medium"
        ? sets.Medium
        : sets.Hard,
    ),
  };
  const correctAnswer =
    values.futureAverage -
    values.yearsLater;

  return {
    scenarioType:
      "age-average-shift",
    topicCluster: "averages",
    values,
    formula:
      "futureAverage - yearsLater",
    text: `The average age of ${values.count} members of a family after ${values.yearsLater} years will be ${values.futureAverage}. Find their present average age.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Average age increases by the same number of years as time passes.`,
      ),
      createReasoningStep(
        "infer",
        `Present average = ${values.futureAverage} - ${values.yearsLater} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "age average",
      "present average",
    ),
  };
}

export function createScoreTargetScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        completed: 4,
        targetTotalCount: 5,
        currentAverage: 52,
        targetAverage: 55,
      },
      {
        completed: 5,
        targetTotalCount: 6,
        currentAverage: 48,
        targetAverage: 50,
      },
      {
        completed: 6,
        targetTotalCount: 7,
        currentAverage: 60,
        targetAverage: 62,
      },
    ],
    Medium: [
      {
        completed: 7,
        targetTotalCount: 8,
        currentAverage: 58,
        targetAverage: 61,
      },
      {
        completed: 8,
        targetTotalCount: 10,
        currentAverage: 46,
        targetAverage: 50,
      },
      {
        completed: 9,
        targetTotalCount: 10,
        currentAverage: 63,
        targetAverage: 65,
      },
    ],
    Hard: [
      {
        completed: 10,
        targetTotalCount: 12,
        currentAverage: 54,
        targetAverage: 58,
      },
      {
        completed: 12,
        targetTotalCount: 15,
        currentAverage: 47,
        targetAverage: 51,
      },
      {
        completed: 11,
        targetTotalCount: 13,
        currentAverage: 62,
        targetAverage: 66,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const achievedSum =
    values.completed *
    values.currentAverage;
  const targetSum =
    values.targetTotalCount *
    values.targetAverage;
  const remainingPapers =
    values.targetTotalCount -
    values.completed;
  const correctAnswer =
    (targetSum - achievedSum) /
    remainingPapers;

  return {
    scenarioType:
      "score-target-reconstruction",
    topicCluster: "averages",
    values: {
      ...values,
      achievedSum,
      targetSum,
      remainingPapers,
    },
    formula:
      "(targetSum - achievedSum) / remainingPapers",
    text: `A student has obtained an average of ${values.currentAverage} marks in ${values.completed} tests. What average marks must the student score in the remaining ${remainingPapers} test${remainingPapers > 1 ? "s" : ""} to secure an overall average of ${values.targetAverage} in ${values.targetTotalCount} tests?`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Marks already obtained = ${values.completed} x ${values.currentAverage} = ${achievedSum}. Required total marks = ${values.targetTotalCount} x ${values.targetAverage} = ${targetSum}.`,
      ),
      createReasoningStep(
        "transform",
        `Required marks in the remaining tests = ${targetSum} - ${achievedSum} = ${targetSum - achievedSum}.`,
      ),
      createReasoningStep(
        "infer",
        `Required average in the remaining tests = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "score reconstruction",
      "required average",
    ),
  };
}

export function createMultiStageAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Medium: [
      {
        count: 10,
        initialAverage: 24,
        leaveValue: 18,
        newAverage: 25,
      },
      {
        count: 12,
        initialAverage: 30,
        leaveValue: 24,
        newAverage: 31,
      },
      {
        count: 8,
        initialAverage: 28,
        leaveValue: 20,
        newAverage: 29,
      },
    ],
    Hard: [
      {
        count: 15,
        initialAverage: 32,
        leaveValue: 24,
        newAverage: 33,
      },
      {
        count: 18,
        initialAverage: 27,
        leaveValue: 19,
        newAverage: 28,
      },
      {
        count: 20,
        initialAverage: 35,
        leaveValue: 29,
        newAverage: 36,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? sets.Hard
        : sets.Medium,
    ),
  };
  const initialSum =
    values.count *
    values.initialAverage;
  const reducedSum =
    initialSum - values.leaveValue;
  const correctAnswer =
    values.newAverage *
      values.count -
    reducedSum;

  return {
    scenarioType:
      "multi-stage-average-update",
    topicCluster: "averages",
    values: {
      ...values,
      initialSum,
      reducedSum,
    },
    formula:
      "newAverage * count - reducedSum",
    text: `The average age of ${values.count} students is ${values.initialAverage}. One student of age ${values.leaveValue} leaves the class and another student joins. The average age of the class again becomes ${values.newAverage}. Find the age of the new student.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Initial total age = ${values.count} x ${values.initialAverage} = ${initialSum}.`,
      ),
      createReasoningStep(
        "transform",
        `After one student of age ${values.leaveValue} leaves, the remaining total = ${reducedSum}.`,
      ),
      createReasoningStep(
        "infer",
        `The final total must be ${values.count} x ${values.newAverage}. So the age of the new student is ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "multi-stage transformation",
      "new value",
    ),
  };
}

export function createAveragesScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    AveragesScenarioFactory[]
  > = {
    "sum-recovery": [
      createSumRecoveryScenario,
    ],
    "replacement-average-shift": [
      createReplacementScenario,
    ],
    "group-weighted-average": [
      createWeightedAverageScenario,
    ],
    "consecutive-middle-term": [
      createConsecutiveScenario,
    ],
    "age-average-shift": [
      createAgeAverageScenario,
    ],
    "score-target-reconstruction": [
      createScoreTargetScenario,
    ],
    "multi-stage-average-update": [
      createMultiStageAverageScenario,
    ],
    "weighted-average-confusion": [
      createWeightedAverageScenario,
    ],
  };

  const fallbackScenarios = [
    createSumRecoveryScenario,
    createReplacementScenario,
    createWeightedAverageScenario,
    createConsecutiveScenario,
    createAgeAverageScenario,
    createScoreTargetScenario,
    createMultiStageAverageScenario,
  ];

  const scenarioFactories =
    motif?.id
      ? scenarioFactoriesByMotif[
          motif.id
        ] ?? fallbackScenarios
      : fallbackScenarios;

  return pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);
}
