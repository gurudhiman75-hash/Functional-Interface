import type {
  DifficultyLabel,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  ReasoningStep,
  shuffle,
} from "../shared";
import {
  renderSimpleVennSvg,
  twoSetIntersection,
  validateVennMathState,
} from "./logical-venn";

type DeductiveScenario = {
  stem: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  reasoningSteps: ReasoningStep[];
  optionMetadata: OptionMetadata[];
  svg?: string;
};

type SyllogismPremise = {
  quantifier:
    | "all"
    | "some"
    | "no"
    | "some-not";
  subject: string;
  predicate: string;
};

type SyllogismConclusion =
  SyllogismPremise & {
    mode:
      | "definite"
      | "possibility";
  };

function optionBundle(
  correct: string,
  distractors: string[],
) {
  const metadata: OptionMetadata[] = [
    {
      value: correct,
      isCorrect: true,
    },
  ];

  for (const value of distractors) {
    if (
      value !== correct &&
      !metadata.some(
        (entry) => entry.value === value,
      )
    ) {
      metadata.push({
        value,
        isCorrect: false,
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Confused possibility, conversion, or overlap with definite truth.",
        reasoningTrap:
          "Deductive logic trap.",
      });
    }
  }

  const shuffled = shuffle(
    metadata.slice(0, 4),
  );

  return {
    options: shuffled.map(
      (entry) => entry.value,
    ),
    optionMetadata: shuffled,
  };
}

function renderPremise(
  premise: SyllogismPremise,
) {
  switch (premise.quantifier) {
    case "all":
      return `All ${premise.subject} are ${premise.predicate}`;
    case "some":
      return `Some ${premise.subject} are ${premise.predicate}`;
    case "no":
      return `No ${premise.subject} is ${premise.predicate}`;
    case "some-not":
      return `Some ${premise.subject} are not ${premise.predicate}`;
  }
}

function conclusionHoldsInModel(
  premises: SyllogismPremise[],
  conclusion: SyllogismConclusion,
) {
  const allEdges = new Map<
    string,
    Set<string>
  >();
  const noEdges = new Set<string>();
  const someEdges = new Set<string>();
  const someNotEdges = new Set<string>();

  const addAll = (
    left: string,
    right: string,
  ) => {
    if (!allEdges.has(left)) {
      allEdges.set(left, new Set());
    }
    allEdges.get(left)!.add(right);
  };

  const key = (
    left: string,
    right: string,
  ) => `${left}->${right}`;

  for (const premise of premises) {
    if (premise.quantifier === "all") {
      addAll(
        premise.subject,
        premise.predicate,
      );
    } else if (
      premise.quantifier === "no"
    ) {
      noEdges.add(
        key(
          premise.subject,
          premise.predicate,
        ),
      );
      noEdges.add(
        key(
          premise.predicate,
          premise.subject,
        ),
      );
    } else if (
      premise.quantifier === "some"
    ) {
      someEdges.add(
        key(
          premise.subject,
          premise.predicate,
        ),
      );
      someEdges.add(
        key(
          premise.predicate,
          premise.subject,
        ),
      );
    } else {
      someNotEdges.add(
        key(
          premise.subject,
          premise.predicate,
        ),
      );
    }
  }

  const hasSubsetPath = (
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
      for (const next of allEdges.get(
        current,
      ) ?? []) {
        queue.push(next);
      }
    }
    return false;
  };

  if (conclusion.mode === "possibility") {
    return !noEdges.has(
      key(
        conclusion.subject,
        conclusion.predicate,
      ),
    );
  }

  if (conclusion.quantifier === "all") {
    return hasSubsetPath(
      conclusion.subject,
      conclusion.predicate,
    );
  }

  if (conclusion.quantifier === "no") {
    return noEdges.has(
      key(
        conclusion.subject,
        conclusion.predicate,
      ),
    );
  }

  if (conclusion.quantifier === "some") {
    return someEdges.has(
      key(
        conclusion.subject,
        conclusion.predicate,
      ),
    );
  }

  return someNotEdges.has(
    key(
      conclusion.subject,
      conclusion.predicate,
    ),
  );
}

function createSyllogismScenario(
  motif: QuantMotif,
) {
  const premises: SyllogismPremise[] =
    motif.id === "ded-syl-negative"
      ? [
          {
            quantifier: "only-few" as never,
            subject: "Artists",
            predicate: "Teachers",
          },
        ]
      : motif.id ===
          "ded-syl-possibility"
        ? [
            {
              quantifier: "all",
              subject: "Dogs",
              predicate: "Animals",
            },
            {
              quantifier: "no",
              subject: "Animals",
              predicate: "Tables",
            },
          ]
        : [
            {
              quantifier: "all",
              subject: "Dogs",
              predicate: "Pets",
            },
            {
              quantifier: "all",
              subject: "Pets",
              predicate: "Animals",
            },
          ];

  if (motif.id === "ded-syl-negative") {
    const correct =
      "Some Artists are not Teachers";
    const bundle = optionBundle(
      correct,
      [
        "All Artists are Teachers",
        "No Artist is a Teacher",
        "All Teachers are Artists",
      ],
    );

    return {
      stem:
        "Statement: Only a few Artists are Teachers. Which conclusion definitely follows?",
      correctAnswer: correct,
      options: bundle.options,
      optionMetadata:
        bundle.optionMetadata,
      explanation:
        '"Only a few" means both overlap and non-overlap exist. Therefore, some Artists are Teachers and some Artists are not Teachers.',
      reasoningSteps: [
        createReasoningStep(
          "infer",
          "Convert only-a-few into a partial-overlap plus partial-exclusion relation.",
        ),
      ],
      svg: renderSimpleVennSvg([
        "Artists",
        "Teachers",
      ]),
    } satisfies DeductiveScenario;
  }

  const conclusion: SyllogismConclusion =
    motif.id === "ded-syl-possibility"
      ? {
          mode: "possibility",
          quantifier: "some",
          subject: "Dogs",
          predicate: "Tables",
        }
      : {
          mode: "definite",
          quantifier: "all",
          subject: "Dogs",
          predicate: "Animals",
        };
  const follows =
    conclusionHoldsInModel(
      premises,
      conclusion,
    );
  const correct = follows
    ? "Conclusion follows"
    : "Conclusion does not follow";
  const bundle = optionBundle(
    correct,
    [
      follows
        ? "Conclusion does not follow"
        : "Conclusion follows",
      "Only possibility follows",
      "Either conclusion follows",
    ],
  );

  return {
    stem: `Statements: ${premises
      .map(renderPremise)
      .join("; ")}. Conclusion: ${renderPremise(
      conclusion,
    )}${conclusion.mode === "possibility" ? " is a possibility" : ""}. Does it follow?`,
    correctAnswer: correct,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      conclusion.mode === "possibility"
        ? `A possibility is rejected only when it violates a definite exclusion. Here $Dogs \\subset Animals$ and $Animals \\cap Tables=\\emptyset$, so Dogs cannot be Tables.`
        : `From $Dogs \\subset Pets$ and $Pets \\subset Animals$, transitivity gives $Dogs \\subset Animals$.`,
    reasoningSteps: [
      createReasoningStep(
        "infer",
        "Map each statement into Euler-circle set relations.",
      ),
      createReasoningStep(
        "compare",
        "Check whether the conclusion holds in every valid model.",
      ),
    ],
    svg: renderSimpleVennSvg([
      "Dogs",
      "Pets",
      "Animals",
    ]),
  } satisfies DeductiveScenario;
}

function createVennMathScenario() {
  const total = 50;
  const math = 20;
  const science = 25;
  const neither = 10;
  const both = twoSetIntersection(
    total,
    math,
    science,
    neither,
  );
  const validation =
    validateVennMathState({
      total,
      a: math,
      b: science,
      ab: both,
    });

  if (!validation.valid) {
    throw new Error(
      validation.issues.join("; "),
    );
  }

  const correct = String(both);
  const bundle = optionBundle(
    correct,
    [
      String(math + science),
      String(total - neither),
      String(Math.abs(math - science)),
    ],
  );

  return {
    stem:
      "In a class of $50$ students, $20$ like Math, $25$ like Science, and $10$ like neither. How many students like both Math and Science?",
    correctAnswer: correct,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "Students liking at least one subject $=50-10=40$. Using $n(M\\cup S)=n(M)+n(S)-n(M\\cap S)$, we get $40=20+25-x$, so $x=5$.",
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        "Compute the union from the universal set and neither count.",
      ),
      createReasoningStep(
        "infer",
        "Use inclusion-exclusion to find the intersection.",
      ),
    ],
    svg: renderSimpleVennSvg([
      "Math",
      "Science",
    ]),
  } satisfies DeductiveScenario;
}

function createVennIdentityScenario() {
  const correct =
    "Dogs inside Pets inside Animals";
  const bundle = optionBundle(
    correct,
    [
      "Dogs and Animals disjoint",
      "Pets inside Dogs inside Animals",
      "All three disjoint circles",
    ],
  );

  return {
    stem:
      "Which logical Venn diagram correctly represents Dogs, Pets, and Animals?",
    correctAnswer: correct,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "All dogs are animals, and dogs may be pets. In the usual exam abstraction, Dogs are placed inside Pets, and Pets inside Animals.",
    reasoningSteps: [
      createReasoningStep(
        "compare",
        "Identify subset nesting between the categories.",
      ),
    ],
    svg: renderSimpleVennSvg([
      "Dogs",
      "Pets",
      "Animals",
    ]),
  } satisfies DeductiveScenario;
}

export function createDeductiveScenario(
  motif: QuantMotif,
  _difficulty: DifficultyLabel,
) {
  if (motif.id === "ded-venn-math") {
    return createVennMathScenario();
  }

  if (motif.id === "ded-venn-ident") {
    return createVennIdentityScenario();
  }

  return createSyllogismScenario(motif);
}
