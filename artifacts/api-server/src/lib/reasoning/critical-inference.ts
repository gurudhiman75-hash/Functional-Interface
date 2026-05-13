import type {
  DifficultyLabel,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type { OptionResult } from "../shared";
import {
  createReasoningStep,
  ReasoningStep,
  shuffle,
} from "../shared";

type CriticalTheme =
  | "Government"
  | "Corporate"
  | "Environmental"
  | "Social";

type CriticalScenario = {
  premise: string;
  bridge: string;
  inference: string;
  stem: string;
  correctAnswer: string;
  explanation: string;
  options: OptionResult;
  reasoningSteps: ReasoningStep[];
  theme: CriticalTheme;
  structuralSignature: string;
};

const EXTREME_WORDS = [
  "only",
  "never",
  "always",
  "all",
  "each",
  "completely",
];

function hasExtremeWord(value: string) {
  const lower = value.toLowerCase();
  return EXTREME_WORDS.some((word) =>
    new RegExp(`\\b${word}\\b`).test(
      lower,
    ),
  );
}

function isWithinScope(
  premise: string,
  inference: string,
) {
  const premiseLower =
    premise.toLowerCase();
  const inferenceLower =
    inference.toLowerCase();

  if (
    premiseLower.includes("delhi") &&
    inferenceLower.includes("india")
  ) {
    return false;
  }

  if (
    premiseLower.includes("schools") &&
    inferenceLower.includes(
      "all education",
    )
  ) {
    return false;
  }

  return true;
}

function isRelevantAction(
  problem: string,
  action: string,
) {
  const problemLower =
    problem.toLowerCase();
  const actionLower =
    action.toLowerCase();

  if (
    problemLower.includes("pollution")
  ) {
    return (
      actionLower.includes("emission") ||
      actionLower.includes("public transport") ||
      actionLower.includes("electric") ||
      actionLower.includes("monitor")
    );
  }

  return true;
}

function buildOptions(
  correct: string,
  distractors: Array<{
    value: string;
    trap: string;
    mistake: string;
  }>,
): OptionResult {
  const metadata: OptionMetadata[] = [
    {
      value: correct,
      isCorrect: true,
    },
  ];

  for (const distractor of distractors) {
    if (
      distractor.value !== correct &&
      !metadata.some(
        (option) =>
          option.value ===
          distractor.value,
      )
    ) {
      metadata.push({
        value: distractor.value,
        isCorrect: false,
        distractorType:
          "comparisonTrap",
        likelyMistake:
          distractor.mistake,
        reasoningTrap:
          distractor.trap,
      });
    }
  }

  const shuffled = shuffle(
    metadata.slice(0, 4),
  );

  return {
    options: shuffled.map(
      (option) => option.value,
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect,
    ),
    optionMetadata: shuffled,
  };
}

function createAssumptionScenario() {
  const premise =
    "The city government has banned single-use plastic bags in local markets.";
  const bridge =
    "Shoppers and sellers can use practical alternatives to plastic bags.";
  const correct =
    "Practical alternatives to plastic bags are available to shoppers and sellers.";
  const options = buildOptions(correct, [
    {
      value:
        "All citizens will always obey every government order.",
      trap: "ExtremeMeasure",
      mistake:
        "Accepted an extreme universal assumption.",
    },
    {
      value:
        "Plastic bags are the only cause of pollution.",
      trap: "OutsideKnowledge",
      mistake:
        "Added a broad claim not required by the statement.",
    },
    {
      value:
        "The government will never change this policy.",
      trap: "ExtremeMeasure",
      mistake:
        "Used an extreme future claim.",
    },
  ]);

  return {
    premise,
    bridge,
    inference: correct,
    stem: `Directions: Read the following statement and answer the question that follows.\n\nStatement: ${premise}\n\nWhich assumption is implicit?`,
    correctAnswer: correct,
    options,
    explanation:
      "Negation test: if no practical alternative exists, the ban becomes difficult to implement. So the assumption is necessary. Symbolically, $\\text{Statement}+\\text{Assumption}\\Rightarrow\\text{Feasible policy}$.",
    reasoningSteps: [
      createReasoningStep(
        "infer",
        "Apply the negation test to identify the unstated premise.",
      ),
      createReasoningStep(
        "filter",
        "Reject extreme or outside-knowledge claims.",
      ),
    ],
    theme: "Government",
    structuralSignature:
      "cri-inf-assumption:plastic-ban",
  } satisfies CriticalScenario;
}

function createConclusionScenario() {
  const premise =
    "A survey of private schools in Delhi found that most of them increased transport fees this year.";
  const correct =
    "Many private schools in Delhi increased transport fees this year.";
  const options = buildOptions(correct, [
    {
      value:
        "Education in India has become unaffordable.",
      trap: "OutsideKnowledge",
      mistake:
        "Generalized beyond Delhi private schools.",
    },
    {
      value:
        "All schools in Delhi increased fees.",
      trap: "ExtremeMeasure",
      mistake:
        "Turned 'most private schools' into 'all schools'.",
    },
    {
      value:
        "The survey itself is false.",
      trap: "RestatementTrap",
      mistake:
        "Rejected the premise instead of deriving a conclusion.",
    },
  ]);

  return {
    premise,
    bridge:
      "The conclusion must remain within Delhi private schools.",
    inference: correct,
    stem: `Directions: Read the following statement and answer the question that follows.\n\nStatement: ${premise}\n\nWhich conclusion can definitely be drawn?`,
    correctAnswer: correct,
    options,
    explanation:
      "A conclusion must be fully derivable and stay inside scope. The statement supports only Delhi private schools, not all Indian education. Thus $\\text{Statement}\\Rightarrow\\text{Many Delhi private schools increased transport fees}$.",
    reasoningSteps: [
      createReasoningStep(
        "compare",
        "Match the conclusion's scope with the statement's scope.",
      ),
      createReasoningStep(
        "filter",
        "Reject conclusions using outside information or extreme words.",
      ),
    ],
    theme: "Social",
    structuralSignature:
      "cri-inf-conclusion:school-fees",
  } satisfies CriticalScenario;
}

function createActionScenario() {
  const premise =
    "Air pollution in the city has risen sharply during winter.";
  const correct =
    "The city should increase emission checks and incentivize public transport and electric vehicles.";
  const options = buildOptions(correct, [
    {
      value:
        "The city should permanently close all factories immediately.",
      trap: "ExtremeMeasure",
      mistake:
        "Selected an excessive and impractical action.",
    },
    {
      value:
        "The city should build more shopping malls.",
      trap: "OutsideKnowledge",
      mistake:
        "Chose an action unrelated to pollution.",
    },
    {
      value:
        "Citizens should never travel during winter.",
      trap: "ExtremeMeasure",
      mistake:
        "Selected a disproportionate action.",
    },
  ]);

  return {
    premise,
    bridge:
      "A course of action must be effective, feasible, and proportionate.",
    inference: correct,
    stem: `Directions: A situation is given below. Choose the most appropriate course of action.\n\nSituation: ${premise}\n\nWhich course of action is most appropriate?`,
    correctAnswer: correct,
    options,
    explanation:
      "A valid action directly addresses the problem and is not extreme. Emission checks and transport incentives are relevant and feasible; closing all factories is excessive.",
    reasoningSteps: [
      createReasoningStep(
        "filter",
        "Check whether each action directly addresses the stated problem.",
      ),
      createReasoningStep(
        "compare",
        "Reject extreme or impractical actions.",
      ),
    ],
    theme: "Environmental",
    structuralSignature:
      "cri-inf-action:pollution",
  } satisfies CriticalScenario;
}

function createCauseScenario() {
  const premise =
    "After continuous heavy rainfall for three days, several low-lying roads in the city were flooded.";
  const correct =
    "The rainfall is the probable cause and road flooding is the effect.";
  const options = buildOptions(correct, [
    {
      value:
        "Road flooding caused the rainfall.",
      trap: "Correlation_Cause",
      mistake:
        "Reversed the causal direction.",
    },
    {
      value:
        "Both events are unrelated.",
      trap: "OutsideKnowledge",
      mistake:
        "Ignored the direct temporal and logical link.",
    },
    {
      value:
        "Both are effects of an unknown common cause.",
      trap: "Correlation_Cause",
      mistake:
        "Invented a common cause not suggested by the statement.",
    },
  ]);

  return {
    premise,
    bridge:
      "The cause must logically precede and explain the effect.",
    inference: correct,
    stem: `Directions: Read the following information and answer the question that follows.\n\n${premise}\n\nWhat is the correct cause-effect relationship?`,
    correctAnswer: correct,
    options,
    explanation:
      "Heavy rainfall temporally precedes and explains flooding. This is a direct causal link, not mere correlation.",
    reasoningSteps: [
      createReasoningStep(
        "compare",
        "Check temporal order between the events.",
      ),
      createReasoningStep(
        "infer",
        "Accept causation only when the first event logically explains the second.",
      ),
    ],
    theme: "Environmental",
    structuralSignature:
      "cri-inf-cause:rain-flood",
  } satisfies CriticalScenario;
}

function createArgumentScenario() {
  const premise =
    "A company wants to allow remote work two days a week to reduce office crowding.";
  const correct =
    "Strong argument: It may reduce crowding without completely disrupting office coordination.";
  const options = buildOptions(correct, [
    {
      value:
        "Weak argument: Remote work should always replace all offices.",
      trap: "ExtremeMeasure",
      mistake:
        "Accepted an extreme claim beyond the proposal.",
    },
    {
      value:
        "Weak argument: Employees like weekends.",
      trap: "OutsideKnowledge",
      mistake:
        "Used an irrelevant point.",
    },
    {
      value:
        "Weak argument: The company sells computers.",
      trap: "OutsideKnowledge",
      mistake:
        "Used unrelated background information.",
    },
  ]);

  return {
    premise,
    bridge:
      "A strong argument must be relevant, practical, and moderate in scope.",
    inference: correct,
    stem: `Directions: Below is a statement followed by possible arguments. Choose the strongest argument.\n\nStatement: ${premise}\n\nWhich of the following is the strongest argument?`,
    correctAnswer: correct,
    options,
    explanation:
      "The strong argument addresses the stated objective directly and avoids extreme wording. It supports the proposal within scope.",
    reasoningSteps: [
      createReasoningStep(
        "filter",
        "Reject irrelevant or extreme arguments.",
      ),
      createReasoningStep(
        "compare",
        "Choose the argument that is relevant and proportionate.",
      ),
    ],
    theme: "Corporate",
    structuralSignature:
      "cri-inf-argument:remote-work",
  } satisfies CriticalScenario;
}

export function validateCriticalScenario(
  scenario: CriticalScenario,
) {
  const issues: string[] = [];

  if (
    !isWithinScope(
      scenario.premise,
      scenario.inference,
    )
  ) {
    issues.push(
      "Inference expands beyond the premise scope.",
    );
  }

  if (
    hasExtremeWord(
      scenario.correctAnswer,
    )
  ) {
    issues.push(
      "Correct answer uses an extreme word.",
    );
  }

  if (
    scenario.structuralSignature.includes(
      "action",
    ) &&
    !isRelevantAction(
      scenario.premise,
      scenario.correctAnswer,
    )
  ) {
    issues.push(
      "Course of action is not relevant to the problem.",
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function createCriticalInferenceScenario(
  motif: QuantMotif,
  _difficulty: DifficultyLabel,
) {
  const scenario =
    motif.id === "cri-inf-conclusion"
      ? createConclusionScenario()
      : motif.id === "cri-inf-action"
        ? createActionScenario()
        : motif.id === "cri-inf-cause"
          ? createCauseScenario()
          : motif.id ===
              "cri-inf-argument"
            ? createArgumentScenario()
            : createAssumptionScenario();
  const validation =
    validateCriticalScenario(
      scenario,
    );

  if (!validation.valid) {
    throw new Error(
      validation.issues.join("; "),
    );
  }

  return scenario;
}
