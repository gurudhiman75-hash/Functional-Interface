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

type PcDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: number[];
  distractorLabels: string[];
  tokens?: string[];
};

type PcFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const PC_CONTEXT: QuantScenarioContext = {
  entity: "counting arrangement",
  metric: "number of ways",
  context: "permutation and combination",
};

function factorial(n: number) {
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

function nCr(n: number, r: number) {
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
}

function nPr(n: number, r: number) {
  if (r < 0 || r > n) {
    return 0;
  }
  return factorial(n) / factorial(n - r);
}

function derangement(n: number) {
  let total = 0;
  for (let i = 0; i <= n; i += 1) {
    total +=
      ((i % 2 === 0 ? 1 : -1) *
        factorial(n)) /
      factorial(i);
  }
  return Math.round(total);
}

function optionValue(value: number) {
  return `$${Math.max(1, Math.round(value))}$`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
) {
  return `${motifId}::${branch}::${Object.values(values).join("|")}`;
}

function buildOptions(
  correctAnswer: number,
  distractors: number[],
  labels: string[],
) {
  const candidates = [
    correctAnswer,
    ...distractors,
    correctAnswer +
      Math.max(2, Math.round(correctAnswer * 0.15)),
  ];
  const unique = Array.from(
    new Set(
      candidates
        .map((value) =>
          Math.max(1, Math.round(value)),
        )
        .filter(Number.isFinite),
    ),
  );
  while (unique.length < 4) {
    unique.push(
      correctAnswer +
        unique.length *
          Math.max(3, Math.ceil(correctAnswer * 0.1)),
    );
  }
  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) =>
      index === 0
        ? {
            value: optionValue(value),
            isCorrect: true,
          }
        : {
            value: optionValue(value),
            isCorrect: false,
            distractorType:
              "wrongCountingModel",
            likelyMistake:
              labels[index - 1] ??
              "plausible counting slip",
            reasoningTrap:
              labels[index - 1] ??
              "constraint not applied correctly",
          },
    );
  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizePcScenario(
  definition: PcDefinition,
): QuantProceduralScenario {
  if (
    !Number.isInteger(definition.answer) ||
    definition.answer <= 0
  ) {
    throw new Error(
      `Invalid P&C answer for ${definition.motifId}`,
    );
  }

  return {
    scenarioType: definition.motifId,
    topicCluster:
      "permutation-combination",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    context: PC_CONTEXT,
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
    validationTokens:
      definition.tokens,
  };
}

function createPcDefinition(
  motifId: string,
  difficulty: DifficultyLabel,
): PcDefinition {
  switch (motifId) {
    case "pc-fpc-mul": {
      const shirts = difficulty === "Easy" ? 4 : 5;
      const trousers = difficulty === "Easy" ? 3 : 4;
      const shoes = difficulty === "Hard" ? 3 : 2;
      const answer =
        shirts * trousers * shoes;
      return {
        motifId,
        branch: "and-rule-outfit",
        text: `A student has $${shirts}$ shirts, $${trousers}$ trousers, and $${shoes}$ pairs of shoes. How many different outfits can be formed?`,
        values: {
          shirts,
          trousers,
          shoes,
        },
        answer,
        formula: "shirts * trousers * shoes",
        steps: [
          [
            "direct",
            `Each outfit needs one choice from every category, so use multiplication: $${shirts}\\times${trousers}\\times${shoes}=${answer}$.`,
          ],
        ],
        distractors: [
          shirts + trousers + shoes,
          shirts * trousers,
          answer + shirts,
        ],
        distractorLabels: [
          "Additive_Counting_Trap",
          "Case_Exclusion_Error",
          "Factorial_Calculation_Slip",
        ],
        tokens: ["shirts", "trousers"],
      };
    }

    case "pc-fpc-add": {
      const buses = 6;
      const trains = 4;
      const answer = buses + trains;
      return {
        motifId,
        branch: "or-rule-travel",
        text: `There are $${buses}$ bus routes and $${trains}$ train routes from one city to another. If a traveler chooses exactly one route, how many choices are possible?`,
        values: { buses, trains },
        answer,
        formula: "buses + trains",
        steps: [
          [
            "direct",
            `The choices are alternatives, so use addition: $${buses}+${trains}=${answer}$.`,
          ],
        ],
        distractors: [
          buses * trains,
          buses + trains + 1,
          Math.abs(buses - trains),
        ],
        distractorLabels: [
          "Additive_Counting_Trap",
          "Case_Overlap_Overcount",
          "Case_Exclusion_Error",
        ],
      };
    }

    case "pc-digit-formation": {
      const answer = 3 * 5 * 4 * 3;
      return {
        motifId,
        branch: "four-digit-even-range",
        text: `Using the digits $0,1,2,3,4,5$, how many even $4$-digit numbers greater than $3000$ can be formed without repetition?`,
        values: { digits: 6 },
        answer,
        formula: "3 * 5 * 4 * 3",
        steps: [
          [
            "conditional",
            `The thousand's digit can be $3,4,$ or $5$, giving $3$ choices.`,
          ],
          [
            "multi-step",
            `After fixing the first digit, the unit digit must be even and valid; this controlled case count gives $3\\times5\\times4\\times3=${answer}$.`,
          ],
        ],
        distractors: [
          6 * 5 * 4 * 3,
          3 * 5 * 4 * 2,
          nPr(6, 4),
        ],
        distractorLabels: [
          "Leading_Zero_Ignorance",
          "Case_Exclusion_Error",
          "Repetition_Logic_Mixup",
        ],
        tokens: ["digits", "even"],
      };
    }

    case "pc-digit-zero": {
      const answer = 5 * 5 * 4 * 3;
      return {
        motifId,
        branch: "leading-zero-blocked",
        text: `Using the digits $0,1,2,3,4,5$, how many $4$-digit numbers can be formed without repetition?`,
        values: { digits: 6 },
        answer,
        formula: "5 * 5 * 4 * 3",
        steps: [
          [
            "conditional",
            `The first digit cannot be $0$, so it has $5$ choices.`,
          ],
          [
            "direct",
            `The remaining places have $5,4,3$ choices. Total $=5\\times5\\times4\\times3=${answer}$.`,
          ],
        ],
        distractors: [
          nPr(6, 4),
          5 * 4 * 3 * 2,
          6 * 6 * 6 * 6,
        ],
        distractorLabels: [
          "Leading_Zero_Ignorance",
          "Repetition_Logic_Mixup",
          "Repetition_Logic_Mixup",
        ],
        tokens: ["digits", "repetition"],
      };
    }

    case "pc-perm-distinct": {
      const n = difficulty === "Easy" ? 5 : 6;
      const answer = factorial(n);
      return {
        motifId,
        branch: "distinct-books-linear",
        text: `In how many ways can $${n}$ different books be arranged on a shelf?`,
        values: { n },
        answer,
        formula: "n!",
        steps: [
          [
            "direct",
            `All books are distinct and order matters, so the count is $${n}!=${answer}$.`,
          ],
        ],
        distractors: [
          nCr(n, 2),
          nPr(n, n - 1),
          n * n,
        ],
        distractorLabels: [
          "Perm_vs_Comb",
          "Factorial_Calculation_Slip",
          "Additive_Counting_Trap",
        ],
      };
    }

    case "pc-perm-identical": {
      const answer =
        factorial(6) /
        (factorial(3) * factorial(2));
      return {
        motifId,
        branch: "banana-word",
        text: `How many distinct arrangements can be made from the letters of the word $BANANA$?`,
        values: { n: 6 },
        answer,
        formula: "6! / (3! * 2!)",
        steps: [
          [
            "inferential",
            `There are $6$ letters with $A$ repeated $3$ times and $N$ repeated $2$ times.`,
          ],
          [
            "direct",
            `Distinct arrangements $=\\frac{6!}{3!2!}=60$.`,
          ],
        ],
        distractors: [
          factorial(6),
          factorial(6) / factorial(3),
          factorial(6) / factorial(2),
        ],
        distractorLabels: [
          "Identical_Division_Omission",
          "Identical_Division_Omission",
          "Identical_Division_Omission",
        ],
        tokens: ["BANANA"],
      };
    }

    case "pc-perm-together": {
      const answer =
        factorial(4) * factorial(2);
      return {
        motifId,
        branch: "two-friends-block",
        text: `$5$ friends are to stand in a row. If Rahul and Simran must always stand together, how many arrangements are possible?`,
        values: { n: 5 },
        answer,
        formula: "4! * 2!",
        steps: [
          [
            "conditional",
            `Treat Rahul and Simran as one block, so there are $4$ units to arrange.`,
          ],
          [
            "multi-step",
            `The block has $2!$ internal orders. Total $=4!\\times2!=48$.`,
          ],
        ],
        distractors: [
          factorial(4),
          factorial(5),
          nCr(5, 2),
        ],
        distractorLabels: [
          "Internal_Order_Neglect",
          "Case_Exclusion_Error",
          "Perm_vs_Comb",
        ],
        tokens: ["together"],
      };
    }

    case "pc-perm-never-together": {
      const consonants = 4;
      const vowels = 3;
      const answer =
        factorial(consonants) *
        nPr(consonants + 1, vowels);
      return {
        motifId,
        branch: "vowels-separated",
        text: `In how many ways can $4$ consonants and $3$ vowels be arranged in a row so that no two vowels are together?`,
        values: { consonants, vowels },
        answer,
        formula: "4! * 5P3",
        steps: [
          [
            "conditional",
            `Arrange consonants first: $4!$ ways, creating $5$ gaps.`,
          ],
          [
            "multi-step",
            `Place $3$ vowels in $5$ gaps: $P(5,3)$. Total $=4!\\times P(5,3)=1440$.`,
          ],
        ],
        distractors: [
          factorial(4) * nPr(4, 3),
          factorial(7),
          factorial(4) * nCr(5, 3),
        ],
        distractorLabels: [
          "Gap_Count_Error",
          "Case_Exclusion_Error",
          "Perm_vs_Comb",
        ],
        tokens: ["no two vowels"],
      };
    }

    case "pc-circ-table": {
      const n = 6;
      const answer = factorial(n - 1);
      return {
        motifId,
        branch: "round-table",
        text: `In how many ways can $${n}$ people sit around a circular table?`,
        values: { n },
        answer,
        formula: "(n-1)!",
        steps: [
          [
            "inferential",
            `Rotations are identical around a circular table.`,
          ],
          [
            "direct",
            `Therefore the arrangements are $(${n}-1)!=5!=120$.`,
          ],
        ],
        distractors: [
          factorial(n),
          factorial(n - 1) / 2,
          nCr(n, 2),
        ],
        distractorLabels: [
          "Circular_Linear_Flip",
          "Necklace_Factor_2_Omission",
          "Perm_vs_Comb",
        ],
      };
    }

    case "pc-circ-necklace": {
      const n = 6;
      const answer = factorial(n - 1) / 2;
      return {
        motifId,
        branch: "necklace-flip",
        text: `How many different necklaces can be made using $${n}$ distinct beads?`,
        values: { n },
        answer,
        formula: "(n-1)! / 2",
        steps: [
          [
            "conditional",
            `For necklaces, rotations and mirror images are identical.`,
          ],
          [
            "direct",
            `Count $=\\frac{(${n}-1)!}{2}=60$.`,
          ],
        ],
        distractors: [
          factorial(n - 1),
          factorial(n),
          nCr(n, 2),
        ],
        distractorLabels: [
          "Necklace_Factor_2_Omission",
          "Circular_Linear_Flip",
          "Perm_vs_Comb",
        ],
      };
    }

    case "pc-comb-basic": {
      const n = 8;
      const r = 3;
      const answer = nCr(n, r);
      return {
        motifId,
        branch: "unordered-selection",
        text: `From $${n}$ students, how many groups of $${r}$ students can be selected?`,
        values: { n, r },
        answer,
        formula: "nCr",
        steps: [
          [
            "direct",
            `Only selection is required, so order does not matter: $\\binom{8}{3}=56$.`,
          ],
        ],
        distractors: [
          nPr(n, r),
          nCr(n, r - 1),
          n + r,
        ],
        distractorLabels: [
          "Perm_vs_Comb",
          "Case_Exclusion_Error",
          "Additive_Counting_Trap",
        ],
        tokens: ["selected"],
      };
    }

    case "pc-comb-committee":
    case "pc-selection-atleast": {
      const men = 5;
      const women = 4;
      const answer =
        nCr(women, 2) * nCr(men, 3) +
        nCr(women, 3) * nCr(men, 2) +
        nCr(women, 4) * nCr(men, 1);
      return {
        motifId,
        branch: "atleast-two-women",
        text: `A committee of $5$ members is to be formed from $5$ men and $4$ women. In how many ways can it be formed if it must include at least $2$ women?`,
        values: { men, women },
        answer,
        formula: "C(4,2)C(5,3)+C(4,3)C(5,2)+C(4,4)C(5,1)",
        steps: [
          [
            "conditional",
            `Valid cases are $2$ women, $3$ women, or $4$ women.`,
          ],
          [
            "multi-step",
            `Total $=\\binom{4}{2}\\binom{5}{3}+\\binom{4}{3}\\binom{5}{2}+\\binom{4}{4}\\binom{5}{1}=105$.`,
          ],
        ],
        distractors: [
          nCr(9, 5),
          nCr(women, 2) * nCr(men, 3),
          nPr(9, 5),
        ],
        distractorLabels: [
          "Case_Exclusion_Error",
          "Case_Exclusion_Error",
          "Perm_vs_Comb",
        ],
        tokens: ["committee", "at least"],
      };
    }

    case "pc-handshake": {
      const n = 12;
      const answer = nCr(n, 2);
      return {
        motifId,
        branch: "unordered-pairs",
        text: `At a meeting of $${n}$ people, each person shakes hands with every other person exactly once. How many handshakes occur?`,
        values: { n },
        answer,
        formula: "nC2",
        steps: [
          [
            "inferential",
            `A handshake is an unordered pair of people.`,
          ],
          [
            "direct",
            `Number of handshakes $=\\binom{${n}}{2}=66$.`,
          ],
        ],
        distractors: [
          nPr(n, 2),
          n * n,
          n - 1,
        ],
        distractorLabels: [
          "Handshake_Double_Count",
          "Perm_vs_Comb",
          "Case_Exclusion_Error",
        ],
      };
    }

    case "pc-geom-lines": {
      const n = 8;
      const m = 4;
      const answer =
        nCr(n, 2) - nCr(m, 2) + 1;
      return {
        motifId,
        branch: "collinear-lines",
        text: `$${n}$ points are given in a plane, out of which $${m}$ are collinear. How many distinct straight lines can be formed?`,
        values: { n, m },
        answer,
        formula: "C(n,2)-C(m,2)+1",
        steps: [
          [
            "conditional",
            `Without collinearity, lines would be $\\binom{8}{2}$.`,
          ],
          [
            "multi-step",
            `The $4$ collinear points give one line, not $\\binom{4}{2}$ lines. Count $=\\binom{8}{2}-\\binom{4}{2}+1=23$.`,
          ],
        ],
        distractors: [
          nCr(n, 2),
          nCr(n, 2) - nCr(m, 2),
          nPr(n, 2),
        ],
        distractorLabels: [
          "Collinear_Point_Overcount",
          "Geometric_Line_Constant_Error",
          "Perm_vs_Comb",
        ],
      };
    }

    case "pc-geom-triangles": {
      const n = 9;
      const m = 4;
      const answer =
        nCr(n, 3) - nCr(m, 3);
      return {
        motifId,
        branch: "collinear-triangles",
        text: `$${n}$ points are given in a plane, out of which $${m}$ are collinear. How many triangles can be formed?`,
        values: { n, m },
        answer,
        formula: "C(n,3)-C(m,3)",
        steps: [
          [
            "conditional",
            `Choose any $3$ points, then remove choices where all $3$ are collinear.`,
          ],
          [
            "direct",
            `Triangles $=\\binom{9}{3}-\\binom{4}{3}=80$.`,
          ],
        ],
        distractors: [
          nCr(n, 3),
          nCr(n, 2),
          nPr(n, 3),
        ],
        distractorLabels: [
          "Collinear_Point_Overcount",
          "Diagonal_Formula_Inversion",
          "Perm_vs_Comb",
        ],
      };
    }

    case "pc-geom-diagonals": {
      const n = 12;
      const answer = (n * (n - 3)) / 2;
      return {
        motifId,
        branch: "polygon-diagonals",
        text: `How many diagonals does a polygon of $${n}$ sides have?`,
        values: { n },
        answer,
        formula: "n(n-3)/2",
        steps: [
          [
            "direct",
            `Diagonals of an $n$-gon $=\\frac{n(n-3)}{2}$.`,
          ],
          [
            "direct",
            `For $n=${n}$, diagonals $=\\frac{12\\times9}{2}=54$.`,
          ],
        ],
        distractors: [
          nCr(n, 2),
          n * (n - 3),
          nCr(n, 2) - n,
        ],
        distractorLabels: [
          "Diagonal_Formula_Inversion",
          "Diagonal_Formula_Inversion",
          "Case_Exclusion_Error",
        ],
      };
    }

    case "pc-dist-distinct": {
      const items = 4;
      const boxes = 3;
      const answer = boxes ** items;
      return {
        motifId,
        branch: "distinct-items-boxes",
        text: `In how many ways can $${items}$ distinct parcels be placed into $${boxes}$ distinct lockers?`,
        values: { items, boxes },
        answer,
        formula: "boxes^items",
        steps: [
          [
            "direct",
            `Each parcel independently has $${boxes}$ choices, so total $=${boxes}^{${items}}=${answer}$.`,
          ],
        ],
        distractors: [
          factorial(items),
          nCr(items + boxes - 1, boxes - 1),
          items ** boxes,
        ],
        distractorLabels: [
          "Perm_vs_Comb",
          "Sticks_Stones_Inversion",
          "Repetition_Logic_Mixup",
        ],
      };
    }

    case "pc-dist-identical": {
      const items = 7;
      const boxes = 3;
      const answer = nCr(items + boxes - 1, boxes - 1);
      return {
        motifId,
        branch: "sticks-and-stones",
        text: `In how many ways can $${items}$ identical coins be distributed among $${boxes}$ distinct children if a child may receive zero coins?`,
        values: { items, boxes },
        answer,
        formula: "C(n+r-1,r-1)",
        steps: [
          [
            "inferential",
            `This is an identical-item distribution with zero allowed.`,
          ],
          [
            "direct",
            `Ways $=\\binom{${items + boxes - 1}}{${boxes - 1}}=36$.`,
          ],
        ],
        distractors: [
          boxes ** items,
          nCr(items, boxes),
          nCr(items - 1, boxes - 1),
        ],
        distractorLabels: [
          "Sticks_Stones_Inversion",
          "Perm_vs_Comb",
          "Case_Exclusion_Error",
        ],
      };
    }

    case "pc-dearrangement": {
      const n = 5;
      const answer = derangement(n);
      return {
        motifId,
        branch: "no-letter-correct-envelope",
        text: `$${n}$ letters are placed randomly into $${n}$ addressed envelopes. In how many ways can no letter go into its correct envelope?`,
        values: { n },
        answer,
        formula: "!n",
        steps: [
          [
            "inferential",
            `Use derangement because every original position is forbidden.`,
          ],
          [
            "direct",
            `!5=5!\\left(1-\\frac{1}{1!}+\\frac{1}{2!}-\\frac{1}{3!}+\\frac{1}{4!}-\\frac{1}{5!}\\right)=44$.`,
          ],
        ],
        distractors: [
          factorial(n),
          factorial(n - 1),
          nCr(n, 2),
        ],
        distractorLabels: [
          "Case_Exclusion_Error",
          "Factorial_Calculation_Slip",
          "Perm_vs_Comb",
        ],
      };
    }

    case "pc-grid-path": {
      const m = 4;
      const n = 3;
      const answer = factorial(m + n) / (factorial(m) * factorial(n));
      return {
        motifId,
        branch: "shortest-grid-path",
        text: `A person must move from $(0,0)$ to $(${m},${n})$ using only right and upward moves. How many shortest paths are possible?`,
        values: { m, n },
        answer,
        formula: "(m+n)!/(m!n!)",
        steps: [
          [
            "inferential",
            `A shortest path has $${m}$ right moves and $${n}$ upward moves.`,
          ],
          [
            "direct",
            `Arrange $${m + n}$ moves with repetitions: $\\frac{${m + n}!}{${m}!${n}!}=35$.`,
          ],
        ],
        distractors: [
          2 ** (m + n),
          factorial(m + n),
          m * n,
        ],
        distractorLabels: [
          "Repetition_Logic_Mixup",
          "Identical_Division_Omission",
          "Additive_Counting_Trap",
        ],
      };
    }

    case "pc-rank-word": {
      return {
        motifId,
        branch: "rank-cab",
        text: `If all arrangements of the letters of $CAB$ are written in dictionary order, what is the rank of $CAB$?`,
        values: { n: 3 },
        answer: 5,
        formula: "rank by alphabetical order",
        steps: [
          [
            "conditional",
            `Alphabetical order of letters is $A,B,C$.`,
          ],
          [
            "multi-step",
            `Words before $CAB$: starting with $A$ gives $2!$ words, starting with $B$ gives $2!$ words. Then $CAB$ is next, so rank $=2+2+1=5$.`,
          ],
        ],
        distractors: [3, 6, 4],
        distractorLabels: [
          "Rank_Alphabet_Order_Slip",
          "Factorial_Calculation_Slip",
          "Case_Exclusion_Error",
        ],
      };
    }

    default:
      return createPcDefinition(
        pickRandomItem([
          "pc-fpc-mul",
          "pc-digit-zero",
          "pc-perm-identical",
          "pc-perm-together",
          "pc-comb-basic",
          "pc-comb-committee",
          "pc-handshake",
          "pc-geom-lines",
          "pc-grid-path",
        ]),
        difficulty,
      );
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  return finalizePcScenario(
    createPcDefinition(
      motif?.id ?? "pc-fpc-mul",
      difficulty,
    ),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  PcFactory[]
> = {
  "permutation-combination": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-fpc-mul",
            "pc-digit-zero",
            "pc-perm-distinct",
            "pc-perm-identical",
            "pc-perm-together",
            "pc-comb-basic",
            "pc-handshake",
            "pc-grid-path",
          ]),
          difficulty,
        ),
      ),
  ],
  "pc-fundamentals": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-fpc-mul",
            "pc-fpc-add",
            "pc-digit-formation",
            "pc-digit-zero",
          ]),
          difficulty,
        ),
      ),
  ],
  "pc-permutations": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-perm-distinct",
            "pc-perm-identical",
            "pc-perm-together",
            "pc-perm-never-together",
          ]),
          difficulty,
        ),
      ),
  ],
  "pc-combinations": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-comb-basic",
            "pc-comb-committee",
            "pc-handshake",
            "pc-selection-atleast",
          ]),
          difficulty,
        ),
      ),
  ],
  "pc-circular": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-circ-table",
            "pc-circ-necklace",
          ]),
          difficulty,
        ),
      ),
  ],
  "pc-geometry-counting": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-geom-lines",
            "pc-geom-triangles",
            "pc-geom-diagonals",
          ]),
          difficulty,
        ),
      ),
  ],
  "pc-advanced-counting": [
    (difficulty) =>
      finalizePcScenario(
        createPcDefinition(
          pickRandomItem([
            "pc-rank-word",
            "pc-dist-distinct",
            "pc-dist-identical",
            "pc-dearrangement",
            "pc-grid-path",
          ]),
          difficulty,
        ),
      ),
  ],
};

const PATTERN_ALLOWED_MOTIFS: Record<
  string,
  string[]
> = {
  "pc-fundamentals": [
    "pc-fpc-mul",
    "pc-fpc-add",
    "pc-digit-formation",
    "pc-digit-zero",
  ],
  "pc-permutations": [
    "pc-perm-distinct",
    "pc-perm-identical",
    "pc-perm-together",
    "pc-perm-never-together",
    "pc-perm-relative",
  ],
  "pc-combinations": [
    "pc-comb-basic",
    "pc-comb-committee",
    "pc-handshake",
    "pc-selection-atleast",
    "pc-selection-atmost",
  ],
  "pc-circular": [
    "pc-circ-table",
    "pc-circ-necklace",
    "pc-circ-constrained",
  ],
  "pc-geometry-counting": [
    "pc-geom-lines",
    "pc-geom-triangles",
    "pc-geom-diagonals",
  ],
  "pc-advanced-counting": [
    "pc-rank-word",
    "pc-dist-distinct",
    "pc-dist-identical",
    "pc-dearrangement",
    "pc-grid-path",
  ],
};

function resolvePcPatternKey(
  pattern: Pattern,
) {
  const registryMatch =
    pattern.id.match(
      /^registry-((?:pc-[a-z-]+)|permutation-combination)-(easy|medium|hard)$/i,
    );
  if (registryMatch?.[1]) {
    return registryMatch[1];
  }

  return pattern.id;
}

export function createPermutationCombinationScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolvePcPatternKey(pattern);
  const focusedAllowedMotifs =
    PATTERN_ALLOWED_MOTIFS[patternKey];

  if (
    motif?.id &&
    (!focusedAllowedMotifs ||
      focusedAllowedMotifs.includes(motif.id))
  ) {
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
    PATTERN_FACTORIES[
      "permutation-combination"
    ];

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
