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

type ProgressionOption = {
  label: string;
  value: number;
};

type ProgressionDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: ProgressionOption;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: ProgressionOption[];
  distractorLabels: string[];
};

type ProgressionScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const PROGRESSION_CONTEXT: QuantScenarioContext = {
  entity: "progression",
  metric: "required sequence value",
  context: "progressions",
};

const opt = (
  label: string,
  value: number,
): ProgressionOption => ({
  label,
  value,
});

function optionValue(option: ProgressionOption) {
  return `$${option.label}$`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
) {
  return `${motifId}::${branch}::${Object.values(values).join("|")}`;
}

function buildOptions(
  correctAnswer: ProgressionOption,
  distractors: ProgressionOption[],
  labels: string[],
) {
  const unique: ProgressionOption[] = [];
  for (const candidate of [
    correctAnswer,
    ...distractors,
  ]) {
    if (
      !unique.some(
        (item) => item.label === candidate.label,
      )
    ) {
      unique.push(candidate);
    }
  }

  while (unique.length < 4) {
    unique.push(
      opt(
        `${correctAnswer.value + unique.length}`,
        correctAnswer.value + unique.length,
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
            likelyMistake: "Correct progression path",
            reasoningTrap: "None",
          }
        : {
            value: optionValue(value),
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              labels[index - 1] ??
              "plausible progression slip",
            reasoningTrap:
              labels[index - 1] ??
              "wrong index, formula, or boundary",
          },
    );

  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizeProgressionScenario(
  definition: ProgressionDefinition,
): QuantProceduralScenario {
  const explanation = [
    ...definition.steps.map(([, text]) => text),
    `Final answer = $${definition.answer.label}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "progressions",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer.value,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: PROGRESSION_CONTEXT,
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

function createProgressionDefinition(
  motifId: string,
): ProgressionDefinition {
  switch (motifId) {
    case "prog-ap-term":
    case "prog-recursive-linear": {
      return {
        motifId,
        branch: "ap-nth-term",
        text: `In an AP, the first term is $a=7$ and the common difference is $d=4$. Find $a_{12}$.`,
        values: { a: 7, d: 4, n: 12 },
        answer: opt("51", 51),
        formula: "a_n = a + (n-1)d",
        steps: [
          ["direct", `Use $a_n=a+(n-1)d$.`],
          ["direct", `$a_{12}=7+(12-1)4=7+44=51$.`],
        ],
        distractors: [
          opt("55", 55),
          opt("48", 48),
          opt("44", 44),
        ],
        distractorLabels: [
          "Off_By_One_Term",
          "Common_Diff_Sign_Flip",
          "Number_of_Terms_Count",
        ],
      };
    }

    case "prog-ap-sum":
    case "prog-ap-partial-sum": {
      return {
        motifId,
        branch: "ap-finite-sum",
        text: `Find the sum of the first $20$ terms of the AP $5, 8, 11, \\dots$.`,
        values: { a: 5, d: 3, n: 20 },
        answer: opt("670", 670),
        formula: "S_n = n/2[2a+(n-1)d]",
        steps: [
          ["direct", `Use $S_n=\\frac{n}{2}[2a+(n-1)d]$.`],
          ["direct", `$S_{20}=\\frac{20}{2}[2(5)+19(3)]=10(67)=670$.`],
        ],
        distractors: [
          opt("700", 700),
          opt("640", 640),
          opt("335", 335),
        ],
        distractorLabels: [
          "Off_By_One_Term",
          "Common_Diff_Sign_Flip",
          "Middle_Term_Neglect",
        ],
      };
    }

    case "prog-ap-middle":
    case "prog-ap-property":
    case "prog-ap-arithmetic-mean": {
      return {
        motifId,
        branch: "ap-middle-term",
        text: `The sum of $9$ terms of an AP is $225$. Find the middle term.`,
        values: { sum: 225, n: 9 },
        answer: opt("25", 25),
        formula: "middle = S_n/n",
        steps: [
          ["conditional", `For an odd number of AP terms, the middle term equals the average of all terms.`],
          ["direct", `Middle term $=\\frac{225}{9}=25$.`],
        ],
        distractors: [
          opt("9", 9),
          opt("20", 20),
          opt("45", 45),
        ],
        distractorLabels: [
          "Middle_Term_Neglect",
          "Number_of_Terms_Count",
          "AP_GP_Formula_Mixup",
        ],
      };
    }

    case "prog-ap-series-id": {
      return {
        motifId,
        branch: "ap-divisibility-count",
        text: `How many integers strictly between $100$ and $500$ are divisible by $7$?`,
        values: { first: 105, last: 497, d: 7 },
        answer: opt("57", 57),
        formula: "n = (last-first)/d + 1",
        steps: [
          ["conditional", `The first multiple is $105$ and the last multiple is $497$.`],
          ["direct", `Number of terms $=\\frac{497-105}{7}+1=56+1=57$.`],
        ],
        distractors: [
          opt("58", 58),
          opt("56", 56),
          opt("400", 400),
        ],
        distractorLabels: [
          "Divisibility_Boundary_Trap",
          "Number_of_Terms_Count",
          "Recursive_Start_Error",
        ],
      };
    }

    case "prog-gp-term":
    case "prog-recursive-geometric": {
      return {
        motifId,
        branch: "gp-nth-term",
        text: `In a GP, $a=3$ and $r=2$. Find $a_8$.`,
        values: { a: 3, r: 2, n: 8 },
        answer: opt("384", 384),
        formula: "a_n = ar^{n-1}",
        steps: [
          ["direct", `Use $a_n=ar^{n-1}$.`],
          ["direct", `$a_8=3\\cdot2^{7}=384$.`],
        ],
        distractors: [
          opt("768", 768),
          opt("256", 256),
          opt("24", 24),
        ],
        distractorLabels: [
          "Off_By_One_Term",
          "GP_Ratio_Reciprocal",
          "Ratio_Linear_Assumption",
        ],
      };
    }

    case "prog-gp-sum":
    case "prog-gp-fractional-ratio": {
      return {
        motifId,
        branch: "gp-finite-sum",
        text: `Find the sum of the first $5$ terms of the GP $3, 6, 12, \\dots$.`,
        values: { a: 3, r: 2, n: 5 },
        answer: opt("93", 93),
        formula: "S_n = a(r^n-1)/(r-1)",
        steps: [
          ["direct", `Use $S_n=\\frac{a(r^n-1)}{r-1}$.`],
          ["direct", `$S_5=\\frac{3(2^5-1)}{2-1}=3(31)=93$.`],
        ],
        distractors: [
          opt("90", 90),
          opt("48", 48),
          opt("31", 31),
        ],
        distractorLabels: [
          "AP_GP_Formula_Mixup",
          "Off_By_One_Term",
          "GP_Ratio_Reciprocal",
        ],
      };
    }

    case "prog-gp-infinite":
    case "prog-gp-log-growth": {
      return {
        motifId,
        branch: "gp-infinite-sum",
        text: `Find the sum to infinity of the GP $18, 6, 2, \\dots$.`,
        values: { a: 18, rNumerator: 1, rDenominator: 3 },
        answer: opt("27", 27),
        formula: "S_infty = a/(1-r)",
        steps: [
          ["conditional", `Here $r=\\frac{1}{3}$ and $|r|<1$.`],
          ["direct", `$S_{\\infty}=\\frac{18}{1-\\frac{1}{3}}=\\frac{18}{\\frac{2}{3}}=27$.`],
        ],
        distractors: [
          opt("24", 24),
          opt("18", 18),
          opt("9", 9),
        ],
        distractorLabels: [
          "Infinite_Sum_Finite_Limit",
          "GP_Ratio_Reciprocal",
          "AP_GP_Formula_Mixup",
        ],
      };
    }

    case "prog-gp-property":
    case "prog-mean-insert-geometric": {
      return {
        motifId,
        branch: "gp-three-term-property",
        text: `If $4, x, 36$ are in GP and $x>0$, find $x$.`,
        values: { a: 4, c: 36 },
        answer: opt("12", 12),
        formula: "x^2 = ac",
        steps: [
          ["direct", `For three terms in GP, $x^2=ac$.`],
          ["direct", `$x^2=4\\cdot36=144$, so $x=12$ because $x>0$.`],
        ],
        distractors: [
          opt("-12", -12),
          opt("20", 20),
          opt("40", 40),
        ],
        distractorLabels: [
          "Geometric_Mean_Sign",
          "Ratio_Linear_Assumption",
          "AP_GP_Formula_Mixup",
        ],
      };
    }

    case "prog-gp-rebound": {
      return {
        motifId,
        branch: "rebound-total-distance",
        text: `A ball is dropped from a height of $81$ m. Each rebound is $\\frac{1}{3}$ of the previous height. Find the total distance travelled before coming to rest.`,
        values: { height: 81, ratio: 1 / 3 },
        answer: opt("162\\text{ m}", 162),
        formula: "H + 2Hr/(1-r)",
        steps: [
          ["multi-step", `Initial fall is $81$ m.`],
          ["multi-step", `Rebound travel after the first fall is twice the infinite GP: $2\\left(27+9+3+\\dots\\right)$.`],
          ["direct", `Total distance $=81+2\\cdot\\frac{27}{1-\\frac{1}{3}}=81+81=162\\text{ m}$.`],
        ],
        distractors: [
          opt("121.5\\text{ m}", 121.5),
          opt("108\\text{ m}", 108),
          opt("81\\text{ m}", 81),
        ],
        distractorLabels: [
          "Rebound_One_Way_Only",
          "Infinite_Sum_Finite_Limit",
          "GP_Ratio_Reciprocal",
        ],
      };
    }

    case "prog-hp-basic": {
      return {
        motifId,
        branch: "hp-reciprocal-ap",
        text: `If $\\frac{1}{3}, x, \\frac{1}{7}$ are in HP, find $x$.`,
        values: { reciprocalMiddle: 5 },
        answer: opt("\\frac{1}{5}", 0.2),
        formula: "reciprocals in AP",
        steps: [
          ["conditional", `For HP, reciprocals are in AP.`],
          ["direct", `So $3, \\frac{1}{x}, 7$ are in AP, hence $\\frac{1}{x}=5$. Therefore $x=\\frac{1}{5}$.`],
        ],
        distractors: [
          opt("5", 5),
          opt("\\frac{1}{4}", 0.25),
          opt("\\frac{1}{10}", 0.1),
        ],
        distractorLabels: [
          "HP_Linear_Sum",
          "Mean_Inversion",
          "Number_of_Terms_Count",
        ],
      };
    }

    case "prog-mean-relation":
    case "prog-hp-average-speed": {
      return {
        motifId,
        branch: "mean-relation",
        text: `For two positive numbers, the AM is $10$ and the GM is $8$. Find the HM.`,
        values: { am: 10, gm: 8 },
        answer: opt("\\frac{32}{5}", 6.4),
        formula: "G^2 = AH",
        steps: [
          ["conditional", `For two positive numbers, $G^2=A\\cdot H$.`],
          ["direct", `So $H=\\frac{G^2}{A}=\\frac{8^2}{10}=\\frac{32}{5}$.`],
        ],
        distractors: [
          opt("8", 8),
          opt("10", 10),
          opt("\\frac{5}{32}", 5 / 32),
        ],
        distractorLabels: [
          "Mean_Inversion",
          "AM_GM_Condition_Violation",
          "HP_Linear_Sum",
        ],
      };
    }

    case "prog-spec-natural":
    case "prog-spec-even-sum":
    case "prog-spec-odd-sum": {
      return {
        motifId,
        branch: "sum-natural",
        text: `Evaluate $\\sum_{k=1}^{50} k$.`,
        values: { n: 50 },
        answer: opt("1,275", 1275),
        formula: "n(n+1)/2",
        steps: [
          ["direct", `Use $\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$.`],
          ["direct", `$\\sum_{k=1}^{50}k=\\frac{50\\cdot51}{2}=1,275$.`],
        ],
        distractors: [
          opt("2,500", 2500),
          opt("1,225", 1225),
          opt("50", 50),
        ],
        distractorLabels: [
          "Square_Sum_Formula_Error",
          "Recursive_Start_Error",
          "Sigma_Notation_Expansion",
        ],
      };
    }

    case "prog-spec-squares": {
      return {
        motifId,
        branch: "sum-squares",
        text: `Evaluate $\\sum_{k=1}^{10} k^2$.`,
        values: { n: 10 },
        answer: opt("385", 385),
        formula: "n(n+1)(2n+1)/6",
        steps: [
          ["direct", `Use $\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$.`],
          ["direct", `$\\sum_{k=1}^{10}k^2=\\frac{10\\cdot11\\cdot21}{6}=385$.`],
        ],
        distractors: [
          opt("55", 55),
          opt("3025", 3025),
          opt("100", 100),
        ],
        distractorLabels: [
          "Square_Sum_Formula_Error",
          "Sigma_Notation_Expansion",
          "Recursive_Start_Error",
        ],
      };
    }

    case "prog-spec-cubes": {
      return {
        motifId,
        branch: "sum-cubes",
        text: `Evaluate $\\sum_{k=1}^{8} k^3$.`,
        values: { n: 8 },
        answer: opt("1,296", 1296),
        formula: "[n(n+1)/2]^2",
        steps: [
          ["direct", `Use $\\sum_{k=1}^{n}k^3=\\left[\\frac{n(n+1)}{2}\\right]^2$.`],
          ["direct", `$\\sum_{k=1}^{8}k^3=\\left[\\frac{8\\cdot9}{2}\\right]^2=36^2=1,296$.`],
        ],
        distractors: [
          opt("204", 204),
          opt("576", 576),
          opt("36", 36),
        ],
        distractorLabels: [
          "Square_Sum_Formula_Error",
          "Sigma_Notation_Expansion",
          "Recursive_Start_Error",
        ],
      };
    }

    case "prog-spec-telescopic": {
      return {
        motifId,
        branch: "telescopic-fraction",
        text: `Evaluate $\\frac{1}{1\\cdot2}+\\frac{1}{2\\cdot3}+\\dots+\\frac{1}{20\\cdot21}$.`,
        values: { n: 20 },
        answer: opt("\\frac{20}{21}", 20 / 21),
        formula: "1 - 1/(n+1)",
        steps: [
          ["multi-step", `Use $\\frac{1}{k(k+1)}=\\frac{1}{k}-\\frac{1}{k+1}$.`],
          ["direct", `The sum telescopes to $1-\\frac{1}{21}=\\frac{20}{21}$.`],
        ],
        distractors: [
          opt("\\frac{19}{20}", 19 / 20),
          opt("\\frac{1}{21}", 1 / 21),
          opt("20", 20),
        ],
        distractorLabels: [
          "Telescopic_Boundary_Error",
          "Partial_Sum_Subtraction",
          "Sigma_Notation_Expansion",
        ],
      };
    }

    case "prog-spec-agp":
    case "prog-spec-sigma-linear": {
      return {
        motifId,
        branch: "sigma-linear",
        text: `Evaluate $\\sum_{k=1}^{20}(2k+1)$.`,
        values: { n: 20 },
        answer: opt("440", 440),
        formula: "2 sum k + sum 1",
        steps: [
          ["multi-step", `$\\sum_{k=1}^{20}(2k+1)=2\\sum_{k=1}^{20}k+\\sum_{k=1}^{20}1$.`],
          ["direct", `This equals $2\\cdot210+20=440$.`],
        ],
        distractors: [
          opt("421", 421),
          opt("420", 420),
          opt("210", 210),
        ],
        distractorLabels: [
          "Sigma_Notation_Expansion",
          "Recursive_Start_Error",
          "Square_Sum_Formula_Error",
        ],
      };
    }

    case "prog-alg-log-link":
    case "prog-alg-common-ratio-from-terms": {
      return {
        motifId,
        branch: "log-gp-link",
        text: `If $a, b, c$ are in GP, then $\\log a, \\log b, \\log c$ are in which progression? Use $1$ for AP, $2$ for GP, and $3$ for HP.`,
        values: { answer: 1 },
        answer: opt("1", 1),
        formula: "log b^2 = log ac",
        steps: [
          ["conditional", `Since $a,b,c$ are in GP, $b^2=ac$.`],
          ["multi-step", `Taking logs gives $2\\log b=\\log a+\\log c$.`],
          ["direct", `Therefore $\\log a,\\log b,\\log c$ are in AP, coded as $1$.`],
        ],
        distractors: [
          opt("2", 2),
          opt("3", 3),
          opt("0", 0),
        ],
        distractorLabels: [
          "Log_Base_Assumption",
          "AP_GP_Formula_Mixup",
          "Mean_Inversion",
        ],
      };
    }

    case "prog-alg-roots":
    case "prog-alg-n-split":
    case "prog-alg-find-n-from-sum":
    case "prog-alg-common-diff-from-sum":
    case "prog-root-ap":
    case "prog-root-gp":
    default: {
      return {
        motifId,
        branch: "split-three-ap",
        text: `Divide $24$ into three parts in AP such that their product is $480$. Find the middle part.`,
        values: { sum: 24, product: 480 },
        answer: opt("8", 8),
        formula: "(a-d), a, (a+d)",
        steps: [
          ["conditional", `Let the three parts be $(a-d), a, (a+d)$.`],
          ["direct", `Their sum is $3a=24$, so $a=8$.`],
          ["multi-step", `The middle part is therefore $8$.`],
        ],
        distractors: [
          opt("6", 6),
          opt("10", 10),
          opt("24", 24),
        ],
        distractorLabels: [
          "Number_of_Terms_Count",
          "Common_Diff_Sign_Flip",
          "AP_GP_Formula_Mixup",
        ],
      };
    }
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  const motifId =
    motif?.id ??
    (difficulty === "Hard"
      ? "prog-spec-telescopic"
      : "prog-ap-term");
  return finalizeProgressionScenario(
    createProgressionDefinition(motifId),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  ProgressionScenarioFactory[]
> = {
  progressions: [
    () => createScenarioFromMotif("Medium", { id: "prog-ap-term" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-ap-sum" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-gp-sum" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-spec-squares" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-mean-relation" } as QuantMotif),
  ],
  "progressions-ap": [
    () => createScenarioFromMotif("Medium", { id: "prog-ap-term" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-ap-sum" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-ap-series-id" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-ap-middle" } as QuantMotif),
  ],
  "progressions-gp": [
    () => createScenarioFromMotif("Medium", { id: "prog-gp-term" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-gp-sum" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-gp-infinite" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prog-gp-rebound" } as QuantMotif),
  ],
  "progressions-hp-means": [
    () => createScenarioFromMotif("Medium", { id: "prog-hp-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-mean-relation" } as QuantMotif),
  ],
  "progressions-special-series": [
    () => createScenarioFromMotif("Medium", { id: "prog-spec-natural" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-spec-squares" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "prog-spec-cubes" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prog-spec-telescopic" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prog-spec-sigma-linear" } as QuantMotif),
  ],
  "progressions-algebraic": [
    () => createScenarioFromMotif("Hard", { id: "prog-alg-log-link" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "prog-alg-n-split" } as QuantMotif),
  ],
};

const PATTERN_ALLOWED_MOTIFS: Record<
  string,
  string[]
> = {
  "progressions-ap": [
    "prog-ap-term",
    "prog-ap-sum",
    "prog-ap-middle",
    "prog-ap-property",
    "prog-ap-series-id",
    "prog-ap-arithmetic-mean",
    "prog-ap-partial-sum",
    "prog-recursive-linear",
  ],
  "progressions-gp": [
    "prog-gp-term",
    "prog-gp-sum",
    "prog-gp-infinite",
    "prog-gp-property",
    "prog-gp-rebound",
    "prog-gp-fractional-ratio",
    "prog-gp-log-growth",
    "prog-recursive-geometric",
  ],
  "progressions-hp-means": [
    "prog-hp-basic",
    "prog-mean-relation",
    "prog-hp-average-speed",
    "prog-mean-insert-geometric",
  ],
  "progressions-special-series": [
    "prog-spec-natural",
    "prog-spec-squares",
    "prog-spec-cubes",
    "prog-spec-telescopic",
    "prog-spec-agp",
    "prog-spec-sigma-linear",
    "prog-spec-odd-sum",
    "prog-spec-even-sum",
    "prog-series-mixed-difference",
  ],
  "progressions-algebraic": [
    "prog-alg-log-link",
    "prog-alg-roots",
    "prog-alg-n-split",
    "prog-alg-find-n-from-sum",
    "prog-alg-common-diff-from-sum",
    "prog-alg-common-ratio-from-terms",
  ],
};

function resolveProgressionPatternKey(
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

export function createProgressionsScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveProgressionPatternKey(pattern);
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
    PATTERN_FACTORIES.progressions;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
