import type {
  DifficultyLabel,
  DistractorMetadata,
  ExamProfileId,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  pickRandomItem,
  random,
  ReasoningStep,
  shuffle,
} from "../shared";
import {
  createDeductiveScenario,
} from "./syllogisms";

type InequalityRelation =
  | ">"
  | "<"
  | "="
  | "unknown";

type InequalityFact = {
  left: string;
  relation: ">" | "=";
  right: string;
};

type InequalityScenario = {
  symbols: string[];
  facts: InequalityFact[];
  queryLeft: string;
  queryRight: string;
  questionStyle:
    | "relation"
    | "conclusion";
  correctRelation: InequalityRelation;
  reasoningSteps: ReasoningStep[];
  stemOverride?: string;
  explanationOverride?: string;
  customOptions?: string[];
  customOptionMetadata?: OptionMetadata[];
  svg?: string;
};

const INEQUALITY_SYMBOL_POOL = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function pickInequalitySymbols(
  count: number,
) {
  return shuffle(
    INEQUALITY_SYMBOL_POOL,
  ).slice(0, count);
}

function renderInequalityFact(
  fact: InequalityFact,
) {
  return `${fact.left} ${fact.relation} ${fact.right}`;
}

function buildInequalityDisjointSet(
  facts: InequalityFact[],
  symbols: string[],
) {
  const parent = new Map<
    string,
    string
  >();

  symbols.forEach((symbol) => {
    parent.set(symbol, symbol);
  });

  const find = (symbol: string): string => {
    const current =
      parent.get(symbol) ?? symbol;

    if (current !== symbol) {
      const root = find(current);
      parent.set(symbol, root);
      return root;
    }

    return current;
  };

  const union = (
    left: string,
    right: string,
  ) => {
    const leftRoot = find(left);
    const rightRoot = find(right);

    if (leftRoot !== rightRoot) {
      parent.set(rightRoot, leftRoot);
    }
  };

  facts
    .filter(
      (fact) => fact.relation === "=",
    )
    .forEach((fact) => {
      union(fact.left, fact.right);
    });

  return { find };
}

function resolveInequalityRelation(
  symbols: string[],
  facts: InequalityFact[],
  left: string,
  right: string,
): InequalityRelation {
  const { find } =
    buildInequalityDisjointSet(
      facts,
      symbols,
    );
  const adjacency = new Map<
    string,
    Set<string>
  >();

  facts
    .filter(
      (fact) => fact.relation === ">",
    )
    .forEach((fact) => {
      const from = find(fact.left);
      const to = find(fact.right);

      if (from === to) {
        return;
      }

      if (!adjacency.has(from)) {
        adjacency.set(
          from,
          new Set<string>(),
        );
      }

      adjacency.get(from)!.add(to);
    });

  const hasPath = (
    from: string,
    to: string,
  ) => {
    if (from === to) {
      return true;
    }

    const visited = new Set<string>();
    const queue = [from];

    while (queue.length) {
      const current = queue.shift()!;

      if (current === to) {
        return true;
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);
      const nextNodes =
        adjacency.get(current);

      if (!nextNodes) {
        continue;
      }

      nextNodes.forEach((node) => {
        if (!visited.has(node)) {
          queue.push(node);
        }
      });
    }

    return false;
  };

  const leftRoot = find(left);
  const rightRoot = find(right);

  if (leftRoot === rightRoot) {
    return "=";
  }

  if (hasPath(leftRoot, rightRoot)) {
    return ">";
  }

  if (hasPath(rightRoot, leftRoot)) {
    return "<";
  }

  return "unknown";
}

function formatInequalityAnswer(
  left: string,
  relation: InequalityRelation,
  right: string,
) {
  if (relation === "unknown") {
    return "Cannot be determined";
  }

  return `${left} ${relation} ${right}`;
}

function buildInequalityReasoningSteps(
  facts: InequalityFact[],
  queryLeft: string,
  queryRight: string,
  resolvedRelation: InequalityRelation,
) {
  const steps = facts.map((fact) =>
    createReasoningStep(
      "compare",
      `From the statement ${renderInequalityFact(
        fact,
      )}, record the direct comparison.`,
    ),
  );

  if (resolvedRelation === "=") {
    steps.push(
      createReasoningStep(
        "infer",
        `${queryLeft} and ${queryRight} fall in the same equality group.`,
      ),
    );
  } else if (
    resolvedRelation === "unknown"
  ) {
    steps.push(
      createReasoningStep(
        "infer",
        `The chains do not create a definite link between ${queryLeft} and ${queryRight}, so the relation remains uncertain.`,
      ),
    );
  } else {
    steps.push(
      createReasoningStep(
        "infer",
        `Combine the linked statements transitively to infer that ${queryLeft} ${resolvedRelation} ${queryRight}.`,
      ),
    );
  }

  return steps;
}

export function createInequalityScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
) {
  if (
    motif.id.startsWith("ded-syl") ||
    motif.id.startsWith("ded-venn")
  ) {
    const deductive =
      createDeductiveScenario(
        motif,
        difficulty,
      );

    return {
      symbols: [],
      facts: [],
      queryLeft: "A",
      queryRight: "B",
      questionStyle: "conclusion",
      correctRelation: "unknown",
      reasoningSteps:
        deductive.reasoningSteps,
      stemOverride:
        deductive.stem,
      explanationOverride:
        deductive.explanation,
      customOptions:
        deductive.options,
      customOptionMetadata:
        deductive.optionMetadata,
      svg: deductive.svg,
    } satisfies InequalityScenario;
  }

  if (motif.id === "ded-ineq-coded") {
    const options = [
      "P > S",
      "P < S",
      "P = S",
      "Cannot be determined",
    ];
    const optionMetadata =
      shuffle(
        options.map((value) => ({
          value,
          isCorrect: value === "P > S",
          distractorType:
            value === "P > S"
              ? undefined
              : "wrongIntermediateValue" as const,
          likelyMistake:
            value === "P > S"
              ? undefined
              : "Decoded one of the coded operators in the wrong direction.",
          reasoningTrap:
            value === "P > S"
              ? undefined
              : "Coded inequality trap.",
        })),
      );

    return {
      symbols: ["P", "Q", "R", "S"],
      facts: [],
      queryLeft: "P",
      queryRight: "S",
      questionStyle: "conclusion",
      correctRelation: ">",
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "$A @ B$ means $A$ is not smaller than $B$, so $A \\ge B$.",
        ),
        createReasoningStep(
          "transform",
          "$A # B$ means $A$ is greater than $B$, so $A>B$.",
        ),
        createReasoningStep(
          "infer",
          "From $P@Q$, $Q#R$, and $R@S$, the chain gives $P>S$.",
        ),
      ],
      stemOverride:
        "In a coded inequality, $A @ B$ means $A$ is not smaller than $B$ and $A # B$ means $A$ is greater than $B$. If $P @ Q # R @ S$, which conclusion follows?",
      explanationOverride:
        "Decode the symbols first: $@$ means $\\ge$ and $# $ means $>$. So $P\\ge Q>R\\ge S$, which definitely gives $P>S$.",
      customOptions:
        optionMetadata.map(
          (option) => option.value,
        ),
      customOptionMetadata:
        optionMetadata,
    } satisfies InequalityScenario;
  }

  if (motif.id === "ded-ineq-either") {
    const correct =
      "Either conclusion I or II follows";
    const optionMetadata =
      shuffle(
        [
          correct,
          "Only conclusion I follows",
          "Only conclusion II follows",
          "Neither conclusion follows",
        ].map((value) => ({
          value,
          isCorrect: value === correct,
          distractorType:
            value === correct
              ? undefined
              : "comparisonTrap" as const,
          likelyMistake:
            value === correct
              ? undefined
              : "Missed the equality split that makes either-or valid.",
          reasoningTrap:
            value === correct
              ? undefined
              : "Either-or inequality trap.",
        })),
      );

    return {
      symbols: ["A", "B"],
      facts: [],
      queryLeft: "A",
      queryRight: "B",
      questionStyle: "conclusion",
      correctRelation: "unknown",
      reasoningSteps: [
        createReasoningStep(
          "compare",
          "Conclusion I: $A>B$ and conclusion II: $A\\le B$ use the same subject-predicate pair.",
        ),
        createReasoningStep(
          "infer",
          "Individually neither is fixed, but together they exhaust all possibilities.",
        ),
      ],
      stemOverride:
        "Statement: No definite relation is given between $A$ and $B$. Conclusions: I. $A>B$ II. $A\\le B$. Which follows?",
      explanationOverride:
        "Either-or applies when the same pair is used, both individual conclusions are not definite, and together they cover all cases. Here $A>B$ or $A\\le B$ is exhaustive.",
      customOptions:
        optionMetadata.map(
          (option) => option.value,
        ),
      customOptionMetadata:
        optionMetadata,
    } satisfies InequalityScenario;
  }

  const symbolCount =
    motif.id ===
    "direct_inequality_reading"
      ? 2
      : motif.id ===
          "single_chain_deduction"
        ? 3
        : difficulty === "Hard"
          ? 5
          : 4;
  const symbols =
    pickInequalitySymbols(symbolCount);
  const [a, b, c, d, e] = symbols;
  let facts: InequalityFact[] = [];
  let queryLeft = a!;
  let queryRight = b!;
  let questionStyle:
    | "relation"
    | "conclusion" = "relation";

  switch (motif.id) {
    case "direct_inequality_reading": {
      const relation =
        pickRandomItem([
          ">",
          "=",
          "<",
        ] as const);

      if (relation === "<") {
        facts = [
          {
            left: b!,
            relation: ">",
            right: a!,
          },
        ];
      } else {
        facts = [
          {
            left: a!,
            relation,
            right: b!,
          },
        ];
      }
      break;
    }
    case "single_chain_deduction":
      facts = random() > 0.5
        ? [
            {
              left: a!,
              relation: ">",
              right: b!,
            },
            {
              left: b!,
              relation: ">",
              right: c!,
            },
          ]
        : [
            {
              left: a!,
              relation: "=",
              right: b!,
            },
            {
              left: b!,
              relation: ">",
              right: c!,
            },
          ];
      queryRight = c!;
      break;
    case "compound_inequality_linking":
      facts = [
        {
          left: a!,
          relation: ">",
          right: b!,
        },
        {
          left: b!,
          relation: "=",
          right: c!,
        },
        {
          left: c!,
          relation: ">",
          right: d!,
        },
      ];
      queryRight = d!;
      questionStyle = "conclusion";
      break;
    case "indirect_conclusion_validation":
      facts = [
        {
          left: a!,
          relation: ">",
          right: b!,
        },
        {
          left: c!,
          relation: "=",
          right: b!,
        },
        {
          left: d!,
          relation: ">",
          right: c!,
        },
      ];
      queryLeft = d!;
      queryRight = a!;
      questionStyle = "conclusion";
      break;
    case "uncertain_branch_comparison":
      facts = [
        {
          left: a!,
          relation: ">",
          right: b!,
        },
        {
          left: b!,
          relation: ">",
          right: c!,
        },
        {
          left: a!,
          relation: ">",
          right: d!,
        },
        {
          left: d!,
          relation: ">",
          right: c!,
        },
      ];
      queryLeft = b!;
      queryRight = d!;
      questionStyle = "conclusion";
      break;
    case "nested_symbolic_reasoning":
      facts = [
        {
          left: a!,
          relation: ">",
          right: b!,
        },
        {
          left: b!,
          relation: "=",
          right: c!,
        },
        {
          left: d!,
          relation: ">",
          right: c!,
        },
        {
          left: d!,
          relation: ">",
          right: e!,
        },
      ];
      queryLeft = a!;
      queryRight = e!;
      questionStyle = "conclusion";
      break;
    default:
      facts = [
        {
          left: a!,
          relation: ">",
          right: b!,
        },
        {
          left: b!,
          relation: "=",
          right: c!,
        },
        {
          left: c!,
          relation: ">",
          right: d!,
        },
      ];
      queryRight = d!;
      questionStyle = "conclusion";
      break;
  }

  const correctRelation =
    resolveInequalityRelation(
      symbols,
      facts,
      queryLeft,
      queryRight,
    );

  return {
    symbols,
    facts,
    queryLeft,
    queryRight,
    questionStyle,
    correctRelation,
    reasoningSteps:
      buildInequalityReasoningSteps(
        facts,
        queryLeft,
        queryRight,
        correctRelation,
      ),
  } satisfies InequalityScenario;
}

export function buildInequalityStem(
  scenario: ReturnType<
    typeof createInequalityScenario
  >,
  examProfile: ExamProfileId,
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy",
) {
  if (scenario.stemOverride) {
    return scenario.stemOverride;
  }

  const intro =
    wordingStyle === "concise"
      ? "Study the inequalities."
      : wordingStyle ===
            "inference-heavy"
        ? "Analyse the following symbolic comparisons carefully before drawing the final conclusion."
        : "Consider the following inequality statements.";
  const statementText =
    scenario.facts
      .map(renderInequalityFact)
      .join(", ");
  const question =
    scenario.questionStyle ===
    "conclusion"
      ? `Which conclusion definitely follows about ${scenario.queryLeft} and ${scenario.queryRight}?`
      : `What is the correct relation between ${scenario.queryLeft} and ${scenario.queryRight}?`;

  void examProfile;

  return `${intro} ${statementText}. ${question}`;
}

export function buildInequalityExplanation(
  scenario: ReturnType<
    typeof createInequalityScenario
  >,
) {
  if (scenario.explanationOverride) {
    return `${scenario.explanationOverride}${scenario.svg ? `\n\nVenn/Euler visual:\n${scenario.svg}` : ""}`;
  }

  return `Link the statements step by step. ${scenario.reasoningSteps
    .map((step) => step.detail)
    .join(" ")} Therefore, ${formatInequalityAnswer(
    scenario.queryLeft,
    scenario.correctRelation,
    scenario.queryRight,
  )} is the correct conclusion.`;
}

export function buildInequalityOptions(
  scenario: ReturnType<
    typeof createInequalityScenario
  >,
) {
  if (
    scenario.customOptions &&
    scenario.customOptionMetadata
  ) {
    return {
      options: scenario.customOptions,
      correct:
        scenario.customOptions.findIndex(
          (option) =>
            option ===
            scenario.customOptionMetadata?.find(
              (entry) =>
                entry.isCorrect,
            )?.value,
        ),
      optionMetadata:
        scenario.customOptionMetadata,
    };
  }

  const correctValue =
    formatInequalityAnswer(
      scenario.queryLeft,
      scenario.correctRelation,
      scenario.queryRight,
    );
  const options = new Map<
    string,
    OptionMetadata
  >();

  options.set(correctValue, {
    value: correctValue,
    isCorrect: true,
  });

  const addOption = (
    value: string,
    metadata: DistractorMetadata,
  ) => {
    if (
      value !== correctValue &&
      !options.has(value)
    ) {
      options.set(value, {
        value,
        isCorrect: false,
        ...metadata,
      });
    }
  };

  addOption(
    `${scenario.queryLeft} > ${scenario.queryRight}`,
    {
      distractorType:
        "comparisonTrap",
      likelyMistake:
        "Read the strongest visible symbol and assumed a direct conclusion.",
      reasoningTrap:
        "Visible-symbol shortcut trap.",
    },
  );
  addOption(
    `${scenario.queryLeft} < ${scenario.queryRight}`,
    {
      distractorType:
        "wrongIntermediateValue",
      likelyMistake:
        "Reversed the comparison while chaining the statements.",
      reasoningTrap:
        "Direction-reversal trap.",
    },
  );
  addOption(
    `${scenario.queryLeft} = ${scenario.queryRight}`,
    {
      distractorType:
        "cumulativeMistake",
      likelyMistake:
        "Treated a partial equality link as a complete conclusion.",
      reasoningTrap:
        "Equality-extension trap.",
    },
  );
  addOption(
    "Cannot be determined",
    {
      distractorType:
        "wrongIntermediateValue",
      likelyMistake:
        "Stopped before completing the full transitive chain.",
      reasoningTrap:
        "Premature uncertainty trap.",
    },
  );

  const shuffled = shuffle(
    [...options.values()].slice(0, 4),
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
