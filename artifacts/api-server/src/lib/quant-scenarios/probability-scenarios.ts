import type {
  DifficultyLabel,
  OptionMetadata,
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

type Fraction = {
  num: number;
  den: number;
};

type ProbabilityDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: Fraction;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: Fraction[];
  distractorLabels: string[];
};

type ProbabilityScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const PROBABILITY_CONTEXT: QuantScenarioContext = {
  entity: "event",
  metric: "probability",
  context: "probability",
};

const PC_SOLVER = {
  nCr(n: number, r: number) {
    if (r < 0 || r > n) {
      return 0;
    }
    const k = Math.min(r, n - r);
    let numerator = 1;
    let denominator = 1;
    for (let i = 1; i <= k; i += 1) {
      numerator *= n - k + i;
      denominator *= i;
    }
    return numerator / denominator;
  },
};

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function fraction(num: number, den: number): Fraction {
  if (den === 0) {
    throw new Error("Invalid probability denominator");
  }
  const sign = den < 0 ? -1 : 1;
  const divisor = gcd(num, den);
  const reduced = {
    num: (sign * num) / divisor,
    den: Math.abs(den) / divisor,
  };
  if (
    reduced.num < 0 ||
    reduced.num > reduced.den
  ) {
    throw new Error(
      `Probability out of range: ${reduced.num}/${reduced.den}`,
    );
  }
  return reduced;
}

function fractionValue(value: Fraction) {
  return value.num / value.den;
}

function fractionLabel(value: Fraction) {
  if (value.num === 0) {
    return "0";
  }
  if (value.num === value.den) {
    return "1";
  }
  return `\\frac{${value.num}}{${value.den}}`;
}

function optionValue(value: Fraction) {
  return `$${fractionLabel(value)}$`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
) {
  return `${motifId}::${branch}::${Object.values(values).join("|")}`;
}

function buildOptions(
  correctAnswer: Fraction,
  distractors: Fraction[],
  labels: string[],
) {
  const unique: Fraction[] = [];
  for (const candidate of [
    correctAnswer,
    ...distractors,
  ]) {
    if (
      !unique.some(
        (item) =>
          item.num === candidate.num &&
          item.den === candidate.den,
      )
    ) {
      unique.push(candidate);
    }
  }

  while (unique.length < 4) {
    const fallbackDen =
      correctAnswer.den +
      unique.length +
      1;
    unique.push(
      fraction(
        Math.min(
          correctAnswer.num + unique.length,
          fallbackDen,
        ),
        fallbackDen,
      ),
    );
  }

  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) =>
      index === 0
        ? {
            value: optionValue(value),
            isCorrect: true,
            distractorType: "correct",
            likelyMistake: "Correct favorable-over-sample-space path",
            reasoningTrap: "None",
          }
        : {
            value: optionValue(value),
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              labels[index - 1] ??
              "plausible probability slip",
            reasoningTrap:
              labels[index - 1] ??
              "wrong numerator, denominator, or event relation",
          },
    );

  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizeProbabilityScenario(
  definition: ProbabilityDefinition,
): QuantProceduralScenario {
  const answerValue =
    fractionValue(definition.answer);
  if (answerValue < 0 || answerValue > 1) {
    throw new Error(
      `Probability answer out of range for ${definition.motifId}`,
    );
  }

  const explanation = [
    ...definition.steps.map(([, text]) => text),
    `Final answer = $${fractionLabel(definition.answer)}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "probability",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: answerValue,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: PROBABILITY_CONTEXT,
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature:
      structuralSignature(
        definition.motifId,
        definition.branch,
        definition.values,
      ),
    customOptionBundle: buildOptions(
      definition.answer,
      definition.distractors,
      definition.distractorLabels,
    ),
    distractorHints:
      definition.distractorLabels,
    validationTokens: undefined,
  };
}

function createProbabilityDefinition(
  motifId: string,
): ProbabilityDefinition {
  switch (motifId) {
    case "prob-sample-coins": {
      const favorable = PC_SOLVER.nCr(4, 2);
      const total = 2 ** 4;
      return {
        motifId,
        branch: "coin-exact-heads",
        text: `Four fair coins are tossed. Find $P(\\text{exactly }2\\text{ heads})$.`,
        values: { favorable, total },
        answer: fraction(favorable, total),
        formula: "nCr(4,2)/2^4",
        steps: [
          ["direct", `Sample space: $|S|=2^4=16$.`],
          ["direct", `Favorable event: $|E|={}^{4}C_{2}=6$.`],
          ["direct", `Therefore $P(E)=\\frac{|E|}{|S|}=\\frac{6}{16}=\\frac{3}{8}$.`],
        ],
        distractors: [
          fraction(2, 8),
          fraction(6, 10),
          fraction(1, 4),
        ],
        distractorLabels: [
          "Sample_Space_Miscount",
          "Binomial_Coefficient_Omission",
          "At_Most_At_Least_Swap",
        ],
      };
    }

    case "prob-sample-dice-sum": {
      return {
        motifId,
        branch: "two-dice-sum",
        text: `Two fair dice are thrown. Find $P(\\text{sum}=9)$.`,
        values: { favorable: 4, total: 36 },
        answer: fraction(4, 36),
        formula: "favorable/36",
        steps: [
          ["direct", `Sample space: $|S|=6^2=36$.`],
          ["direct", `Favorable event: $E=\\{(3,6),(4,5),(5,4),(6,3)\\}$, so $|E|=4$.`],
          ["direct", `Thus $P(E)=\\frac{4}{36}=\\frac{1}{9}$.`],
        ],
        distractors: [
          fraction(1, 11),
          fraction(9, 36),
          fraction(4, 12),
        ],
        distractorLabels: [
          "Dice_Linear_Assumption",
          "Sample_Space_Miscount",
          "Denominator_Inversion",
        ],
      };
    }

    case "prob-sample-cards": {
      return {
        motifId,
        branch: "card-face",
        text: `One card is drawn from a standard deck of $52$ cards. Find $P(\\text{face card})$.`,
        values: { favorable: 12, total: 52 },
        answer: fraction(12, 52),
        formula: "12/52",
        steps: [
          ["direct", `Sample space: $|S|=52$.`],
          ["direct", `Favorable event: face cards are $J,Q,K$ in $4$ suits, so $|E|=3\\times4=12$.`],
          ["direct", `Therefore $P(E)=\\frac{12}{52}=\\frac{3}{13}$.`],
        ],
        distractors: [
          fraction(3, 52),
          fraction(16, 52),
          fraction(12, 40),
        ],
        distractorLabels: [
          "Card_Face_Suit_Confusion",
          "Denominator_Inversion",
          "Sample_Space_Miscount",
        ],
      };
    }

    case "prob-sample-balls-bag":
    case "prob-sample-number-grid":
    case "prob-quality-defective": {
      return {
        motifId,
        branch: "bag-single-draw",
        text: `A bag contains $5$ red balls and $7$ blue balls. One ball is drawn at random. Find $P(\\text{red})$.`,
        values: { red: 5, total: 12 },
        answer: fraction(5, 12),
        formula: "5/12",
        steps: [
          ["direct", `Sample space: $|S|=5+7=12$.`],
          ["direct", `Favorable event: red balls, so $|E|=5$.`],
          ["direct", `Thus $P(E)=\\frac{5}{12}$.`],
        ],
        distractors: [
          fraction(5, 7),
          fraction(7, 12),
          fraction(5, 17),
        ],
        distractorLabels: [
          "Denominator_Inversion",
          "Complement_Neglect",
          "Sample_Space_Miscount",
        ],
      };
    }

    case "prob-event-independent": {
      return {
        motifId,
        branch: "independent-success",
        text: `A and B independently solve a problem with probabilities $\\frac{2}{3}$ and $\\frac{3}{5}$. Find $P(A\\cap B)$.`,
        values: { aNum: 2, aDen: 3, bNum: 3, bDen: 5 },
        answer: fraction(6, 15),
        formula: "P(A)P(B)",
        steps: [
          ["conditional", `For independent events, $P(A\\cap B)=P(A)\\cdot P(B)$.`],
          ["direct", `So $P(A\\cap B)=\\frac{2}{3}\\cdot\\frac{3}{5}=\\frac{2}{5}$.`],
        ],
        distractors: [
          fraction(1, 15),
          fraction(1, 5),
          fraction(5, 8),
        ],
        distractorLabels: [
          "Independence_Addition_Trap",
          "Complement_Neglect",
          "Denominator_Inversion",
        ],
      };
    }

    case "prob-event-complement":
    case "prob-reliability-parallel": {
      return {
        motifId,
        branch: "at-least-one-complement",
        text: `Two machines fail independently with probabilities $\\frac{1}{4}$ and $\\frac{1}{5}$. Find the probability that at least one machine works.`,
        values: { failA: 1 / 4, failB: 1 / 5 },
        answer: fraction(19, 20),
        formula: "1 - P(both fail)",
        steps: [
          ["conditional", `Use complement: at least one works $=1-P(\\text{both fail})$.`],
          ["direct", `Sample branch for both fail: $P=\\frac{1}{4}\\cdot\\frac{1}{5}=\\frac{1}{20}$.`],
          ["direct", `Therefore probability $=1-\\frac{1}{20}=\\frac{19}{20}$.`],
        ],
        distractors: [
          fraction(1, 20),
          fraction(9, 20),
          fraction(2, 9),
        ],
        distractorLabels: [
          "Complement_Neglect",
          "Independence_Addition_Trap",
          "Denominator_Inversion",
        ],
      };
    }

    case "prob-event-mutually-exclusive": {
      return {
        motifId,
        branch: "mutually-exclusive-card",
        text: `One card is drawn from a deck. Find $P(\\text{king or queen})$.`,
        values: { favorable: 8, total: 52 },
        answer: fraction(8, 52),
        formula: "P(K)+P(Q)",
        steps: [
          ["direct", `Sample space: $|S|=52$.`],
          ["conditional", `King and queen are mutually exclusive events.`],
          ["direct", `Favorable outcomes: $4+4=8$, so $P=\\frac{8}{52}=\\frac{2}{13}$.`],
        ],
        distractors: [
          fraction(4, 52),
          fraction(8, 44),
          fraction(16, 52),
        ],
        distractorLabels: [
          "Card_Face_Suit_Confusion",
          "Denominator_Inversion",
          "Overlap_Double_Count",
        ],
      };
    }

    case "prob-event-overlap":
    case "prob-venn-2-set":
    case "prob-venn-none": {
      return {
        motifId,
        branch: "two-set-union",
        text: `In a group of $100$ students, $45$ like tea, $35$ like coffee, and $15$ like both. Find the probability that a randomly selected student likes tea or coffee.`,
        values: { tea: 45, coffee: 35, both: 15, total: 100 },
        answer: fraction(65, 100),
        formula: "A+B-intersection",
        steps: [
          ["conditional", `Sample space: $|S|=100$.`],
          ["conditional", `Favorable event: $|T\\cup C|=45+35-15=65$.`],
          ["direct", `Therefore $P(T\\cup C)=\\frac{65}{100}=\\frac{13}{20}$.`],
        ],
        distractors: [
          fraction(80, 100),
          fraction(15, 100),
          fraction(35, 100),
        ],
        distractorLabels: [
          "Overlap_Double_Count",
          "Complement_Neglect",
          "Venn_None_Omission",
        ],
      };
    }

    case "prob-draw-sequential-with": {
      return {
        motifId,
        branch: "sequential-with-replacement",
        text: `A box has $3$ defective and $7$ good bulbs. Two bulbs are drawn one after another with replacement. Find $P(\\text{both defective})$.`,
        values: { defective: 3, total: 10 },
        answer: fraction(9, 100),
        formula: "(3/10)(3/10)",
        steps: [
          ["direct", `Each draw has sample space $|S|=10$ and favorable count $|E|=3$.`],
          ["conditional", `With replacement, the denominator remains $10$ for both draws.`],
          ["direct", `So $P=\\frac{3}{10}\\cdot\\frac{3}{10}=\\frac{9}{100}$.`],
        ],
        distractors: [
          fraction(6, 100),
          fraction(3, 10),
          fraction(9, 90),
        ],
        distractorLabels: [
          "Replacement_Mismatch",
          "Sequential_Order_Neglect",
          "Denominator_Inversion",
        ],
      };
    }

    case "prob-draw-sequential-without": {
      return {
        motifId,
        branch: "sequential-without-replacement",
        text: `A bag has $5$ red and $7$ blue balls. Two balls are drawn without replacement. Find $P(\\text{both red})$.`,
        values: { red: 5, blue: 7, total: 12 },
        answer: fraction(20, 132),
        formula: "(5/12)(4/11)",
        steps: [
          ["direct", `First draw sample space is $12$ with $5$ favorable red balls.`],
          ["conditional", `Without replacement, after one red is drawn, sample space is $11$ and favorable red balls are $4$.`],
          ["direct", `So $P=\\frac{5}{12}\\cdot\\frac{4}{11}=\\frac{5}{33}$.`],
        ],
        distractors: [
          fraction(25, 144),
          fraction(5, 12),
          fraction(20, 121),
        ],
        distractorLabels: [
          "Replacement_Ignorance",
          "Sequential_Order_Neglect",
          "Replacement_Mismatch",
        ],
      };
    }

    case "prob-draw-simultaneous":
    case "prob-draw-atleast-one": {
      const favorable =
        PC_SOLVER.nCr(5, 2);
      const total = PC_SOLVER.nCr(12, 2);
      return {
        motifId,
        branch: "simultaneous-ncr",
        text: `A bag has $5$ red and $7$ blue balls. Two balls are selected simultaneously. Find $P(\\text{both red})$.`,
        values: { favorable, total },
        answer: fraction(favorable, total),
        formula: "nCr(5,2)/nCr(12,2)",
        steps: [
          ["direct", `Sample space: $|S|={}^{12}C_2=66$.`],
          ["direct", `Favorable event: $|E|={}^{5}C_2=10$.`],
          ["direct", `Therefore $P(E)=\\frac{10}{66}=\\frac{5}{33}$.`],
        ],
        distractors: [
          fraction(5, 12),
          fraction(20, 132),
          fraction(10, 12),
        ],
        distractorLabels: [
          "Sequential_Order_Neglect",
          "Replacement_Mismatch",
          "Denominator_Inversion",
        ],
      };
    }

    case "prob-conditional-basic":
    case "prob-conditional-card": {
      return {
        motifId,
        branch: "conditional-card-face",
        text: `A card drawn from a deck is known to be a face card. Find $P(\\text{king}\\mid\\text{face card})$.`,
        values: { kings: 4, face: 12 },
        answer: fraction(4, 12),
        formula: "P(K|F)=K/F",
        steps: [
          ["conditional", `Given event restricts the sample space to face cards, so $|S|=12$.`],
          ["direct", `Favorable event: kings among face cards, so $|E|=4$.`],
          ["direct", `Thus $P(K\\mid F)=\\frac{4}{12}=\\frac{1}{3}$.`],
        ],
        distractors: [
          fraction(4, 52),
          fraction(12, 52),
          fraction(3, 12),
        ],
        distractorLabels: [
          "Card_Face_Suit_Confusion",
          "Denominator_Inversion",
          "Sample_Space_Miscount",
        ],
      };
    }

    case "prob-bayes-theorem": {
      return {
        motifId,
        branch: "bayes-diagnostic",
        text: `A disease affects $1$ in $100$ people. A test is positive with probability $\\frac{9}{10}$ if diseased and $\\frac{1}{10}$ if healthy. Find $P(\\text{diseased}\\mid\\text{positive})$.`,
        values: { disease: 1, total: 100 },
        answer: fraction(9, 108),
        formula: "Bayes",
        steps: [
          ["conditional", `Favorable branch: $P(D\\cap +)=\\frac{1}{100}\\cdot\\frac{9}{10}=\\frac{9}{1000}$.`],
          ["multi-step", `Total positive probability is $\\frac{9}{1000}+\\frac{99}{100}\\cdot\\frac{1}{10}=\\frac{9}{1000}+\\frac{99}{1000}=\\frac{108}{1000}$.`],
          ["direct", `Therefore $P(D\\mid +)=\\frac{9/1000}{108/1000}=\\frac{1}{12}$.`],
        ],
        distractors: [
          fraction(9, 1000),
          fraction(9, 10),
          fraction(1, 100),
        ],
        distractorLabels: [
          "Bayes_Denominator_Partial",
          "Complement_Neglect",
          "Denominator_Inversion",
        ],
      };
    }

    case "prob-binomial-distribution": {
      const favorable =
        PC_SOLVER.nCr(5, 2) * 9;
      const total = 2 ** 5;
      return {
        motifId,
        branch: "binomial-exact-success",
        text: `A player wins each game with probability $\\frac{1}{2}$. Find the probability of exactly $2$ wins in $5$ games.`,
        values: { n: 5, r: 2 },
        answer: fraction(
          PC_SOLVER.nCr(5, 2),
          total,
        ),
        formula: "nCr(5,2)(1/2)^5",
        steps: [
          ["direct", `Sample space for win/loss patterns: $|S|=2^5=32$.`],
          ["direct", `Favorable event: choose $2$ winning positions, so $|E|={}^{5}C_2=10$.`],
          ["direct", `Therefore $P=\\frac{10}{32}=\\frac{5}{16}$.`],
        ],
        distractors: [
          fraction(1, 32),
          fraction(2, 5),
          fraction(favorable, total * 10),
        ],
        distractorLabels: [
          "Binomial_Coefficient_Omission",
          "At_Most_At_Least_Swap",
          "Sample_Space_Miscount",
        ],
      };
    }

    case "prob-geometric-chance": {
      return {
        motifId,
        branch: "time-interval-overlap",
        text: `A bus arrives randomly between $10{:}00$ and $10{:}30$. What is the probability it arrives in the first $10$ minutes?`,
        values: { favorable: 10, total: 30 },
        answer: fraction(10, 30),
        formula: "length favorable / length total",
        steps: [
          ["direct", `Sample space length: $|S|=30$ minutes.`],
          ["direct", `Favorable interval length: $|E|=10$ minutes.`],
          ["direct", `Thus $P(E)=\\frac{10}{30}=\\frac{1}{3}$.`],
        ],
        distractors: [
          fraction(20, 30),
          fraction(10, 20),
          fraction(1, 30),
        ],
        distractorLabels: [
          "Denominator_Inversion",
          "Complement_Neglect",
          "Sample_Space_Miscount",
        ],
      };
    }

    case "prob-venn-3-set": {
      return {
        motifId,
        branch: "three-set-at-least-one",
        text: `In a class of $100$, $40$ take Math, $35$ take Physics, $30$ take Chemistry, pairwise overlaps total $30$, and $5$ take all three. Find the probability that a student takes at least one subject.`,
        values: { total: 100 },
        answer: fraction(80, 100),
        formula: "A+B+C-pairwise+triple",
        steps: [
          ["conditional", `Sample space: $|S|=100$.`],
          ["multi-step", `Favorable event: $|M\\cup P\\cup C|=40+35+30-30+5=80$.`],
          ["direct", `So probability $=\\frac{80}{100}=\\frac{4}{5}$.`],
        ],
        distractors: [
          fraction(75, 100),
          fraction(85, 100),
          fraction(20, 100),
        ],
        distractorLabels: [
          "Venn_None_Omission",
          "Overlap_Double_Count",
          "Complement_Neglect",
        ],
      };
    }

    case "prob-odds-conversion": {
      return {
        motifId,
        branch: "odds-to-probability",
        text: `The odds in favor of an event are $3:5$. Find the probability of the event.`,
        values: { favorable: 3, unfavorable: 5 },
        answer: fraction(3, 8),
        formula: "a/(a+b)",
        steps: [
          ["conditional", `Odds in favor $3:5$ means favorable outcomes are $3$ parts and unfavorable outcomes are $5$ parts.`],
          ["direct", `Sample space has $3+5=8$ parts.`],
          ["direct", `Therefore $P(E)=\\frac{3}{8}$.`],
        ],
        distractors: [
          fraction(3, 5),
          fraction(5, 8),
          fraction(1, 8),
        ],
        distractorLabels: [
          "Denominator_Inversion",
          "Complement_Neglect",
          "Sum_Exceedance",
        ],
      };
    }

    case "prob-event-atmost":
    default:
      return createProbabilityDefinition(
        "prob-sample-coins",
      );
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  const motifId =
    motif?.id ??
    (difficulty === "Hard"
      ? "prob-draw-sequential-without"
      : "prob-sample-coins");
  return finalizeProbabilityScenario(
    createProbabilityDefinition(motifId),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  ProbabilityScenarioFactory[]
> = {
  probability: [
    () => createScenarioFromMotif("Medium", { id: "prob-sample-coins" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-sample-dice-sum" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-sample-cards" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-event-complement" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-draw-simultaneous" } as QuantMotif),
  ],
  "probability-sample-spaces": [
    () => createScenarioFromMotif("Medium", { id: "prob-sample-coins" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-sample-dice-sum" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-sample-cards" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-sample-balls-bag" } as QuantMotif),
  ],
  "probability-events": [
    () => createScenarioFromMotif("Medium", { id: "prob-event-independent" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-event-complement" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-event-mutually-exclusive" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prob-event-overlap" } as QuantMotif),
  ],
  "probability-drawing": [
    () => createScenarioFromMotif("Medium", { id: "prob-draw-sequential-with" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prob-draw-sequential-without" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prob-draw-simultaneous" } as QuantMotif),
  ],
  "probability-conditional": [
    () => createScenarioFromMotif("Hard", { id: "prob-conditional-basic" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prob-bayes-theorem" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prob-binomial-distribution" } as QuantMotif),
  ],
  "probability-venn-odds": [
    () => createScenarioFromMotif("Medium", { id: "prob-venn-2-set" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prob-venn-3-set" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prob-odds-conversion" } as QuantMotif),
  ],
};

function resolveProbabilityPatternKey(
  pattern: Pattern,
) {
  if (pattern.id.startsWith("registry-")) {
    return pattern.id
      .replace(/^registry-/i, "")
      .replace(
        /-(easy|medium|hard)$/i,
        "",
      );
  }

  return pattern.id;
}

export function createProbabilityScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveProbabilityPatternKey(pattern);

  if (motif?.id) {
    return createScenarioFromMotif(
      difficulty,
      motif,
    );
  }

  const factories =
    PATTERN_FACTORIES[patternKey] ??
    PATTERN_FACTORIES[pattern.id] ??
    PATTERN_FACTORIES[pattern.subtopic] ??
    PATTERN_FACTORIES[pattern.topic] ??
    PATTERN_FACTORIES.probability;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
