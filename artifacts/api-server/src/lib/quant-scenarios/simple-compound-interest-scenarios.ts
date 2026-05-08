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

type InterestScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

type FinancialSnapshot = {
  label: string;
  startYear: number;
  endYear: number;
  principal: number;
  effectiveRate: number;
  amount: number;
};

type InterestFinalizationConfig = {
  motifId: string;
  scenarioLogicBranch: string;
  signatureKeys?: Array<string | number>;
  validationTokens?: string[];
  distractorValues?: number[];
  distractorLabels?: string[];
};

type InterestSkin = {
  holder: string;
  instrument: string;
  asset: string;
  institution: string;
};

const INTEREST_SKINS: InterestSkin[] = [
  {
    holder: "an investor",
    instrument: "fixed deposit",
    asset: "machine",
    institution: "bank",
  },
  {
    holder: "a village self-help group",
    instrument: "loan account",
    asset: "tractor",
    institution: "cooperative bank",
  },
  {
    holder: "a company",
    instrument: "growth fund",
    asset: "equipment",
    institution: "finance firm",
  },
  {
    holder: "a retailer",
    instrument: "credit plan",
    asset: "delivery van",
    institution: "lender",
  },
];

function buildInterestContext(
  context = "simple-compound-interest",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "principal",
    metric,
    context,
  };
}

function rateDecimal(rate: number) {
  return rate / 100;
}

function money(value: number) {
  const rounded =
    Math.round((value + Number.EPSILON) * 100) /
    100;
  return Number.isInteger(rounded)
    ? rounded
    : rounded;
}

function formatNumber(value: number) {
  const rounded = money(value);
  return Number.isInteger(rounded)
    ? `${rounded}`
    : rounded.toFixed(2);
}

function formatYears(value: number) {
  if (value === 1 / 3) return "1/3";
  if (value === 2 / 3) return "2/3";
  if (value === 1 / 2) return "1/2";
  return `${value}`;
}

function compoundAmount(
  principal: number,
  rate: number,
  years: number,
) {
  return money(
    principal *
      (1 + rateDecimal(rate)) ** years,
  );
}

function simpleInterest(
  principal: number,
  rate: number,
  years: number,
) {
  return money(
    (principal * rate * years) / 100,
  );
}

function runCompoundTimeline(
  principal: number,
  rates: number[],
): FinancialSnapshot[] {
  let amount = principal;
  return rates.map((rate, index) => {
    const start = index;
    amount = money(
      amount * (1 + rateDecimal(rate)),
    );
    return {
      label: `interval-${index + 1}`,
      startYear: start,
      endYear: start + 1,
      principal,
      effectiveRate: rate,
      amount,
    };
  });
}

function structuralSignature(
  motifId: string,
  scenarioLogicBranch: string,
  keys: Array<string | number> = [],
) {
  const numericProfile = keys.join("|");
  return `${motifId}::${scenarioLogicBranch}::${numericProfile}`;
}

function buildOptions(
  correctAnswer: number,
  distractorValues: number[] = [],
  distractorLabels: string[] = [],
) {
  const candidates = [
    correctAnswer,
    ...distractorValues,
    correctAnswer +
      Math.max(
        1,
        Math.round(Math.abs(correctAnswer) * 0.08),
      ),
  ];
  const unique = Array.from(
    new Set(
      candidates
        .map(money)
        .filter(
          (value) =>
            Number.isFinite(value) &&
            value >= 0,
        ),
    ),
  );
  while (unique.length < 4) {
    unique.push(
      money(
        correctAnswer +
          unique.length *
            Math.max(
              2,
              Math.round(
                Math.abs(correctAnswer) * 0.05,
              ),
            ),
      ),
    );
  }
  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) =>
      index === 0
        ? {
            value: formatNumber(value),
            isCorrect: true,
          }
        : {
            value: formatNumber(value),
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              distractorLabels[index - 1] ??
              "plausible arithmetic slip",
            reasoningTrap:
              distractorLabels[index - 1] ??
              "wrong financial state update",
          },
    );
  return {
    options: values.map(formatNumber),
    correct: 0,
    optionMetadata,
  };
}

function finalizeInterestScenario(
  scenario: Omit<
    QuantProceduralScenario,
    | "topicCluster"
    | "motifId"
    | "scenarioLogicBranch"
    | "structuralSignature"
    | "customOptionBundle"
  >,
  config: InterestFinalizationConfig,
): QuantProceduralScenario {
  return {
    ...scenario,
    topicCluster: "si-ci",
    motifId: config.motifId,
    scenarioLogicBranch:
      config.scenarioLogicBranch,
    structuralSignature: structuralSignature(
      config.motifId,
      config.scenarioLogicBranch,
      config.signatureKeys,
    ),
    customOptionBundle: buildOptions(
      scenario.correctAnswer,
      config.distractorValues,
      config.distractorLabels,
    ),
    distractorHints: [
      ...(scenario.distractorHints ?? []),
      ...(config.distractorLabels ?? []),
    ],
    validationTokens:
      config.validationTokens,
  };
}

function pickSkin() {
  return pickRandomItem(INTEREST_SKINS);
}

function createSiBasicAmountScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem({
    Easy: [
      { principal: 5000, rate: 10, time: 3 },
      { principal: 2400, rate: 5, time: 4 },
      { principal: 3600, rate: 12, time: 2 },
    ],
    Medium: [
      { principal: 6400, rate: 12.5, time: 3 },
      { principal: 7200, rate: 8, time: 5 },
      { principal: 8400, rate: 10, time: 4 },
    ],
    Hard: [
      { principal: 12500, rate: 12, time: 3 },
      { principal: 14400, rate: 6.25, time: 5 },
      { principal: 18000, rate: 8, time: 4 },
    ],
  }[difficulty]);
  const si = simpleInterest(
    values.principal,
    values.rate,
    values.time,
  );
  const amount = values.principal + si;
  const askAmount =
    difficulty !== "Easy" &&
    Math.random() > 0.5;
  const skin = pickSkin();
  const correctAnswer = askAmount
    ? amount
    : si;
  return finalizeInterestScenario(
    {
      scenarioType: "si-basic-amount",
      values,
      formula:
        "SI = (P * R * T) / 100; A = P + SI",
      text: `${skin.holder} deposits a principal of Rs. ${values.principal} in a ${skin.instrument} at ${values.rate}% simple interest per annum for ${values.time} years. Find the ${askAmount ? "amount" : "simple interest"}.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "Simple interest grows linearly on the original principal.",
        ),
        createReasoningStep(
          "infer",
          `SI = (${values.principal} x ${values.rate} x ${values.time}) / 100 = ${si}.`,
        ),
      ],
      context: buildInterestContext(
        "simple interest",
        askAmount ? "amount" : "simple interest",
      ),
    },
    {
      motifId: "si-basic-amount",
      scenarioLogicBranch: askAmount
        ? "amount-target"
        : "interest-target",
      signatureKeys: [
        values.rate,
        values.time,
        askAmount ? "A" : "I",
      ],
      distractorValues: [
        amount,
        values.principal * values.rate,
      ],
      distractorLabels: [
        "Amount_vs_Interest_Confusion",
        "Rate_Time_Mismatch",
      ],
      validationTokens: [
        "principal",
        "rate",
        "time",
      ],
    },
  );
}

function createSiFindPrincipalScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem({
    Easy: [
      { principal: 5000, rate: 10, time: 1 },
      { principal: 4000, rate: 5, time: 2 },
    ],
    Medium: [
      { principal: 5750, rate: 10, time: 2 },
      { principal: 7000, rate: 8, time: 5 },
    ],
    Hard: [
      { principal: 8000, rate: 12, time: 4 },
      { principal: 9000, rate: 10, time: 5 },
    ],
  }[difficulty]);
  const amount =
    values.principal +
    simpleInterest(
      values.principal,
      values.rate,
      values.time,
    );
  return finalizeInterestScenario(
    {
      scenarioType: "si-find-principal",
      values: { ...values, amount },
      formula:
        "P = 100A / (100 + RT)",
      text: `A sum amounts to Rs. ${amount} in ${values.time} years at ${values.rate}% simple interest per annum. Find the principal.`,
      correctAnswer: values.principal,
      reasoningSteps: [
        createReasoningStep(
          "reverse",
          "Under SI, amount = P(1 + RT/100).",
        ),
        createReasoningStep(
          "infer",
          `P = ${amount} / (1 + ${values.rate} x ${values.time}/100) = ${values.principal}.`,
        ),
      ],
      context: buildInterestContext(
        "simple interest reconstruction",
        "principal",
      ),
    },
    {
      motifId: "si-find-principal",
      scenarioLogicBranch:
        "reverse-linear-principal",
      signatureKeys: [
        values.rate,
        values.time,
      ],
      distractorValues: [
        amount,
        amount -
          values.rate * values.time,
      ],
      distractorLabels: [
        "Amount_vs_Interest_Confusion",
        "CI_Inversion",
      ],
      validationTokens: [
        "amount",
        "simple interest",
      ],
    },
  );
}

function createSiMultipleTimesScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Easy"
      ? [
          { multiple: 2, years: 10 },
          { multiple: 3, years: 20 },
        ]
      : [
          { multiple: 4, years: 15 },
          { multiple: 5, years: 16 },
          { multiple: 3, years: 8 },
        ],
  );
  const correctAnswer =
    ((values.multiple - 1) * 100) /
    values.years;
  return finalizeInterestScenario(
    {
      scenarioType: "si-multiple-times",
      values,
      formula:
        "R = ((k - 1) * 100) / T",
      text: `At simple interest, a sum becomes ${values.multiple} times itself in ${values.years} years. Find the rate per annum.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Becoming ${values.multiple} times means interest is ${values.multiple - 1} times the principal.`,
        ),
        createReasoningStep(
          "infer",
          `Rate = (${values.multiple - 1} x 100) / ${values.years} = ${formatNumber(correctAnswer)}%.`,
        ),
      ],
      context: buildInterestContext(
        "simple interest multiple",
        "rate",
      ),
    },
    {
      motifId: "si-multiple-times",
      scenarioLogicBranch:
        "linear-multiple-rate",
      signatureKeys: [
        values.multiple,
        values.years,
      ],
      distractorValues: [
        (values.multiple * 100) /
          values.years,
        correctAnswer *
          values.multiple,
      ],
      distractorLabels: [
        "Amount_vs_Interest_Confusion",
        "SI_Growth_Assumption",
      ],
      validationTokens: [
        "times itself",
        "years",
      ],
    },
  );
}

function createSiRateShiftScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem({
    Easy: [
      { principal: 5000, deltaRate: 2, years: 3 },
      { principal: 4000, deltaRate: 5, years: 2 },
    ],
    Medium: [
      { principal: 8000, deltaRate: 2.5, years: 4 },
      { principal: 12000, deltaRate: 1.5, years: 5 },
    ],
    Hard: [
      { principal: 16000, deltaRate: 3.75, years: 4 },
      { principal: 20000, deltaRate: 2.5, years: 6 },
    ],
  }[difficulty]);
  const correctAnswer = simpleInterest(
    values.principal,
    values.deltaRate,
    values.years,
  );
  return finalizeInterestScenario(
    {
      scenarioType: "si-rate-shift",
      values,
      formula:
        "deltaI = P * deltaR * T / 100",
      text: `On a principal of Rs. ${values.principal}, if the simple interest rate were ${values.deltaRate}% higher for ${values.years} years, how much extra interest would be earned?`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "compare",
          "Only the rate difference matters for extra simple interest.",
        ),
        createReasoningStep(
          "infer",
          `Extra interest = ${values.principal} x ${values.deltaRate} x ${values.years} / 100 = ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "rate shift",
        "extra interest",
      ),
    },
    {
      motifId: "si-rate-shift",
      scenarioLogicBranch:
        "delta-rate-interest",
      signatureKeys: [
        values.deltaRate,
        values.years,
      ],
      distractorValues: [
        values.principal *
          values.deltaRate,
        correctAnswer / values.years,
      ],
      distractorLabels: [
        "Rate_Time_Mismatch",
        "Unit_Inconsistency",
      ],
      validationTokens: [
        "higher",
        "extra interest",
      ],
    },
  );
}

function createSiSplitInvestmentScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { total: 20000, part: 8000, rate1: 8, rate2: 12, years: 2 },
          { total: 30000, part: 12000, rate1: 10, rate2: 15, years: 2 },
        ]
      : [
          { total: 10000, part: 4000, rate1: 5, rate2: 10, years: 2 },
          { total: 15000, part: 6000, rate1: 8, rate2: 12, years: 1 },
        ],
  );
  const interest =
    simpleInterest(
      values.part,
      values.rate1,
      values.years,
    ) +
    simpleInterest(
      values.total - values.part,
      values.rate2,
      values.years,
    );
  return finalizeInterestScenario(
    {
      scenarioType: "si-split-investment",
      values: { ...values, interest },
      formula:
        "I = xR1T/100 + (P-x)R2T/100",
      text: `A sum of Rs. ${values.total} is divided between two simple-interest schemes at ${values.rate1}% and ${values.rate2}% per annum for ${values.years} years. The total interest is Rs. ${formatNumber(interest)}. Find the amount invested at ${values.rate1}%.`,
      correctAnswer: values.part,
      reasoningSteps: [
        createReasoningStep(
          "model",
          "Let x be invested at the first rate and total - x at the second rate.",
        ),
        createReasoningStep(
          "infer",
          "Solve the linear interest equation to recover the split.",
        ),
      ],
      context: buildInterestContext(
        "split investment",
        "first part",
      ),
    },
    {
      motifId: "si-split-investment",
      scenarioLogicBranch:
        "two-rate-partition",
      signatureKeys: [
        values.rate1,
        values.rate2,
        values.years,
      ],
      distractorValues: [
        values.total - values.part,
        values.total / 2,
      ],
      distractorLabels: [
        "Unit_Inconsistency",
        "Simple_Addition_Trap",
      ],
      validationTokens: [
        "divided",
        "total interest",
      ],
    },
  );
}

function createSiEqualInterestScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { total: 26000, r1: 5, t1: 2, r2: 10, t2: 4, p1: 20800, p2: 5200 },
          { total: 35000, r1: 7, t1: 5, r2: 14, t2: 2, p1: 15555.56, p2: 19444.44 },
        ]
      : [
          { total: 12000, r1: 5, t1: 2, r2: 10, t2: 3, p1: 9000, p2: 3000 },
          { total: 18000, r1: 6, t1: 5, r2: 10, t2: 3, p1: 9000, p2: 9000 },
        ],
  );
  return finalizeInterestScenario(
    {
      scenarioType: "si-equal-interest",
      values,
      formula:
        "P1:P2 = 1/(R1T1):1/(R2T2)",
      text: `Rs. ${values.total} is divided into two parts so that one part at ${values.r1}% for ${values.t1} years and the other at ${values.r2}% for ${values.t2} years earn equal simple interest. Find the first part.`,
      correctAnswer: money(values.p1),
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "For equal SI, the principals are inversely proportional to R x T.",
        ),
        createReasoningStep(
          "infer",
          "Use the inverse ratio to split the total sum.",
        ),
      ],
      context: buildInterestContext(
        "equal interest split",
        "first part",
      ),
    },
    {
      motifId: "si-equal-interest",
      scenarioLogicBranch:
        "inverse-rt-allocation",
      signatureKeys: [
        values.r1,
        values.t1,
        values.r2,
        values.t2,
      ],
      distractorValues: [
        values.p2,
        values.total / 2,
      ],
      distractorLabels: [
        "Rate_Time_Mismatch",
        "Simple_Addition_Trap",
      ],
      validationTokens: [
        "equal simple interest",
      ],
    },
  );
}

function createSiEqualAmountScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { total: 23000, r1: 10, t1: 3, r2: 15, t2: 2, p1: 11500 },
          { total: 31000, r1: 8, t1: 5, r2: 20, t2: 2, p1: 15500 },
        ]
      : [
          { total: 21000, r1: 10, t1: 2, r2: 5, t2: 4, p1: 10500 },
          { total: 24000, r1: 8, t1: 5, r2: 10, t2: 4, p1: 12000 },
        ],
  );
  return finalizeInterestScenario(
    {
      scenarioType: "si-equal-amount",
      values,
      formula:
        "P1(100+R1T1)=P2(100+R2T2)",
      text: `A sum of Rs. ${values.total} is divided into two parts. The first part is lent at ${values.r1}% for ${values.t1} years and the second at ${values.r2}% for ${values.t2} years. If the final amounts are equal, find the first part.`,
      correctAnswer: money(values.p1),
      reasoningSteps: [
        createReasoningStep(
          "model",
          "Equal final amounts mean each principal is multiplied by its SI amount factor.",
        ),
        createReasoningStep(
          "infer",
          "Use the inverse amount-factor ratio to split the sum.",
        ),
      ],
      context: buildInterestContext(
        "equal amount split",
        "first part",
      ),
    },
    {
      motifId: "si-equal-amount",
      scenarioLogicBranch:
        "inverse-amount-factor",
      signatureKeys: [
        values.r1,
        values.t1,
        values.r2,
        values.t2,
      ],
      distractorValues: [
        values.total - values.p1,
        values.total / 2,
      ],
      distractorLabels: [
        "Amount_vs_Interest_Confusion",
        "Rate_Time_Mismatch",
      ],
      validationTokens: [
        "final amounts are equal",
      ],
    },
  );
}

function createCiBasicScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem({
    Easy: [
      { principal: 1000, rate: 10, years: 2 },
      { principal: 8000, rate: 5, years: 2 },
    ],
    Medium: [
      { principal: 2500, rate: 12, years: 3 },
      { principal: 6400, rate: 25, years: 2 },
    ],
    Hard: [
      { principal: 10000, rate: 10, years: 3 },
      { principal: 12500, rate: 8, years: 4 },
    ],
  }[difficulty]);
  const amount = compoundAmount(
    values.principal,
    values.rate,
    values.years,
  );
  const correctAnswer =
    amount - values.principal;
  const si = simpleInterest(
    values.principal,
    values.rate,
    values.years,
  );
  return finalizeInterestScenario(
    {
      scenarioType: "ci-basic-calc",
      values: { ...values, amount },
      formula:
        "CI = P(1 + R/100)^n - P",
      text: `Find the compound interest on Rs. ${values.principal} at ${values.rate}% per annum for ${values.years} years, compounded annually.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "Compound interest updates the amount after each year.",
        ),
        createReasoningStep(
          "infer",
          `Amount = ${values.principal}(1 + ${values.rate}/100)^${values.years} = ${formatNumber(amount)}.`,
        ),
      ],
      context: buildInterestContext(
        "compound interest",
        "compound interest",
      ),
    },
    {
      motifId: "ci-basic-calc",
      scenarioLogicBranch:
        "annual-compound-interest",
      signatureKeys: [
        values.rate,
        values.years,
      ],
      distractorValues: [
        si,
        amount,
      ],
      distractorLabels: [
        "Simple_Addition_Trap",
        "Amount_vs_Interest_Confusion",
      ],
      validationTokens: [
        "compounded annually",
      ],
    },
  );
}

function createCiVaryingRateScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 10000, rates: [10, 20, 10] },
          { principal: 16000, rates: [12.5, 10, 20] },
        ]
      : [
          { principal: 5000, rates: [10, 20] },
          { principal: 8000, rates: [20, 10] },
        ],
  );
  const snapshots = runCompoundTimeline(
    values.principal,
    values.rates,
  );
  const correctAnswer =
    snapshots[snapshots.length - 1].amount;
  const additive =
    money(
      values.principal *
        (1 +
          values.rates.reduce(
            (sum, rate) => sum + rate,
            0,
          ) /
            100),
    );
  return finalizeInterestScenario(
    {
      scenarioType: "ci-varying-rate",
      values: {
        principal: values.principal,
        rate1: values.rates[0],
        rate2: values.rates[1],
        rate3: values.rates[2] ?? 0,
      },
      formula:
        "A = P x product(1 + Ri/100)",
      text: `A sum of Rs. ${values.principal} is invested at compound interest. The annual rates for successive years are ${values.rates.join("%, ")}%. Find the final amount.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          "Apply each year's rate to the updated amount, not to the original principal.",
        ),
        createReasoningStep(
          "infer",
          `Final amount = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "varying compound rate",
        "final amount",
      ),
    },
    {
      motifId: "ci-varying-rate",
      scenarioLogicBranch:
        values.rates.length === 3
          ? "three-year-rate-sequence"
          : "two-year-rate-sequence",
      signatureKeys: values.rates,
      distractorValues: [
        additive,
        values.principal,
      ],
      distractorLabels: [
        "Effective_Rate_Fallacy",
        "Mixed_Scheme_Overlap",
      ],
      validationTokens: [
        "successive years",
      ],
    },
  );
}

function createCiCompoundingPeriodScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 6400, rate: 10, years: 2, frequency: 4, label: "quarterly" },
          { principal: 10000, rate: 12, years: 1, frequency: 4, label: "quarterly" },
        ]
      : [
          { principal: 4000, rate: 10, years: 2, frequency: 2, label: "half-yearly" },
          { principal: 8000, rate: 20, years: 1, frequency: 2, label: "half-yearly" },
        ],
  );
  const periodicRate =
    values.rate / values.frequency;
  const periods =
    values.years * values.frequency;
  const correctAnswer = money(
    values.principal *
      (1 + periodicRate / 100) ** periods,
  );
  const frequencyNeglect = compoundAmount(
    values.principal,
    values.rate,
    values.years,
  );
  return finalizeInterestScenario(
    {
      scenarioType:
        "ci-compounding-period",
      values: {
        principal: values.principal,
        rate: values.rate,
        years: values.years,
        frequency: values.frequency,
        periods,
        periodicRate,
      },
      formula:
        "A = P(1 + (R/k)/100)^(kT)",
      text: `A sum of Rs. ${values.principal} is invested at ${values.rate}% per annum for ${values.years} years, compounded ${values.label}. Find the amount.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `For ${values.label} compounding, rate becomes ${formatNumber(periodicRate)}% and periods become ${periods}.`,
        ),
        createReasoningStep(
          "infer",
          `Amount = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "fractional compounding",
        "amount",
      ),
    },
    {
      motifId: "ci-compounding-period",
      scenarioLogicBranch:
        values.label === "quarterly"
          ? "quarterly-normalization"
          : "half-yearly-normalization",
      signatureKeys: [
        values.rate,
        values.frequency,
        periods,
      ],
      distractorValues: [
        frequencyNeglect,
        values.principal *
          (1 +
            values.rate /
              values.frequency /
              100),
      ],
      distractorLabels: [
        "Compounding_Frequency_Neglect",
        "Rate_Time_Mismatch",
      ],
      validationTokens: [
        "compounded",
        values.label,
      ],
    },
  );
}

function createCiFractionalTimeScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 27000, rate: 20, years: 2, fraction: 1 / 2 },
          { principal: 8000, rate: 15, years: 3, fraction: 2 / 3 },
        ]
      : [
          { principal: 9000, rate: 12, years: 2, fraction: 1 / 3 },
          { principal: 10000, rate: 10, years: 1, fraction: 1 / 2 },
        ],
  );
  const afterWhole = compoundAmount(
    values.principal,
    values.rate,
    values.years,
  );
  const correctAnswer = money(
    afterWhole *
      (1 +
        (values.rate * values.fraction) /
          100),
  );
  return finalizeInterestScenario(
    {
      scenarioType: "ci-fractional-time",
      values,
      formula:
        "A = P(1+r)^whole * (1 + r*fraction)",
      text: `Find the amount on Rs. ${values.principal} at ${values.rate}% compound interest for ${values.years} ${formatYears(values.fraction)} years, when interest for the fractional year is taken proportionately.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          "Compound for the complete years first, then apply proportional interest for the fractional year on the updated amount.",
        ),
        createReasoningStep(
          "infer",
          `Amount = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "fractional time",
        "amount",
      ),
    },
    {
      motifId: "ci-fractional-time",
      scenarioLogicBranch:
        "whole-years-plus-fraction",
      signatureKeys: [
        values.rate,
        values.years,
        values.fraction,
      ],
      distractorValues: [
        compoundAmount(
          values.principal,
          values.rate,
          values.years + values.fraction,
        ),
        afterWhole,
      ],
      distractorLabels: [
        "Fractional_Time_Linear",
        "Amount_vs_Interest_Confusion",
      ],
      validationTokens: [
        "fractional year",
      ],
    },
  );
}

function createCiMultipleTimesScenario() {
  const values = pickRandomItem([
    { multiple: 2, years: 5, targetPower: 4 },
    { multiple: 3, years: 4, targetPower: 9 },
    { multiple: 4, years: 6, targetPower: 16 },
  ]);
  const multiplierPower =
    Math.log(values.targetPower) /
    Math.log(values.multiple);
  const correctAnswer =
    values.years * multiplierPower;
  return finalizeInterestScenario(
    {
      scenarioType: "ci-multiple-times",
      values,
      formula:
        "time scales by exponent of the growth multiple",
      text: `At compound interest, a sum becomes ${values.multiple} times itself in ${values.years} years. In how many years will it become ${values.targetPower} times itself?`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `${values.targetPower} is ${values.multiple} raised to power ${multiplierPower}.`,
        ),
        createReasoningStep(
          "infer",
          `Required time = ${formatNumber(multiplierPower)} x ${values.years} = ${formatNumber(correctAnswer)} years.`,
        ),
      ],
      context: buildInterestContext(
        "compound multiple",
        "time",
      ),
    },
    {
      motifId: "ci-multiple-times",
      scenarioLogicBranch:
        "exponential-time-scaling",
      signatureKeys: [
        values.multiple,
        values.targetPower,
      ],
      distractorValues: [
        values.years +
          multiplierPower,
        values.years *
          values.targetPower,
      ],
      distractorLabels: [
        "SI_Growth_Assumption",
        "Simple_Addition_Trap",
      ],
      validationTokens: [
        "compound interest",
        "times itself",
      ],
    },
  );
}

function createCiPopulationGrowthScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { population: 80000, rate: 12.5, years: 3 },
          { population: 125000, rate: 8, years: 4 },
        ]
      : [
          { population: 50000, rate: 10, years: 2 },
          { population: 40000, rate: 5, years: 3 },
        ],
  );
  const correctAnswer = compoundAmount(
    values.population,
    values.rate,
    values.years,
  );
  return finalizeInterestScenario(
    {
      scenarioType: "ci-population-growth",
      values,
      formula:
        "future = initial(1 + r)^n",
      text: `The population of a town is ${values.population}. It increases by ${values.rate}% every year. Find the population after ${values.years} years.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "Population growth follows the same multiplier topology as compound interest.",
        ),
        createReasoningStep(
          "infer",
          `Future population = ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "population growth",
        "future population",
      ),
    },
    {
      motifId: "ci-population-growth",
      scenarioLogicBranch:
        "compound-growth-analogy",
      signatureKeys: [
        values.rate,
        values.years,
      ],
      distractorValues: [
        values.population *
          (1 +
            (values.rate * values.years) /
              100),
        values.population,
      ],
      distractorLabels: [
        "Effective_Rate_Fallacy",
        "Simple_Addition_Trap",
      ],
      validationTokens: [
        "increases",
        "every year",
      ],
    },
  );
}

function createDelta2YearScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 5000, rate: 20 },
          { principal: 9600, rate: 12.5 },
        ]
      : [
          { principal: 1000, rate: 10 },
          { principal: 4000, rate: 5 },
        ],
  );
  const correctAnswer = money(
    values.principal *
      (values.rate / 100) ** 2,
  );
  return finalizeInterestScenario(
    {
      scenarioType: "delta-2-year",
      values,
      formula:
        "Diff = P(R/100)^2",
      text: `Find the difference between compound interest and simple interest on Rs. ${values.principal} at ${values.rate}% per annum for 2 years.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "compare",
          "For 2 years, the difference is interest on the first year's interest.",
        ),
        createReasoningStep(
          "infer",
          `Difference = ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "SI-CI difference",
        "difference",
      ),
    },
    {
      motifId: "delta-2-year",
      scenarioLogicBranch:
        "two-year-interest-on-interest",
      signatureKeys: [values.rate],
      distractorValues: [
        simpleInterest(
          values.principal,
          values.rate,
          2,
        ),
        correctAnswer * 3,
      ],
      distractorLabels: [
        "Amount_vs_Interest_Confusion",
        "Delta_Formula_Mixup",
      ],
      validationTokens: [
        "difference",
        "2 years",
      ],
    },
  );
}

function createDelta3YearScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 10000, rate: 10 },
          { principal: 8000, rate: 20 },
        ]
      : [
          { principal: 5000, rate: 10 },
          { principal: 4000, rate: 5 },
        ],
  );
  const amount = compoundAmount(
    values.principal,
    values.rate,
    3,
  );
  const si = simpleInterest(
    values.principal,
    values.rate,
    3,
  );
  const correctAnswer =
    amount - values.principal - si;
  return finalizeInterestScenario(
    {
      scenarioType: "delta-3-year",
      values,
      formula:
        "Diff = CI_3 - SI_3",
      text: `Find the difference between compound interest and simple interest on Rs. ${values.principal} at ${values.rate}% per annum for 3 years.`,
      correctAnswer: money(correctAnswer),
      reasoningSteps: [
        createReasoningStep(
          "compare",
          "For 3 years, compare the full compound interest with simple interest for the same period.",
        ),
        createReasoningStep(
          "infer",
          `Difference = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "three-year SI-CI difference",
        "difference",
      ),
    },
    {
      motifId: "delta-3-year",
      scenarioLogicBranch:
        "three-year-delta",
      signatureKeys: [values.rate],
      distractorValues: [
        values.principal *
          (values.rate / 100) ** 2,
        si,
      ],
      distractorLabels: [
        "Delta_Formula_Mixup",
        "Amount_vs_Interest_Confusion",
      ],
      validationTokens: [
        "difference",
        "3 years",
      ],
    },
  );
}

function createDeltaReverseScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 12500, rate: 8 },
          { principal: 9600, rate: 12.5 },
        ]
      : [
          { principal: 5000, rate: 10 },
          { principal: 8000, rate: 5 },
        ],
  );
  const diff = money(
    values.principal *
      (values.rate / 100) ** 2,
  );
  return finalizeInterestScenario(
    {
      scenarioType: "delta-reverse",
      values: { ...values, diff },
      formula:
        "P = diff / (R/100)^2",
      text: `The difference between compound interest and simple interest for 2 years at ${values.rate}% per annum is Rs. ${formatNumber(diff)}. Find the principal.`,
      correctAnswer: values.principal,
      reasoningSteps: [
        createReasoningStep(
          "reverse",
          "Use the two-year SI-CI difference formula in reverse.",
        ),
        createReasoningStep(
          "infer",
          `Principal = ${formatNumber(diff)} / (${values.rate}/100)^2 = ${values.principal}.`,
        ),
      ],
      context: buildInterestContext(
        "SI-CI reverse",
        "principal",
      ),
    },
    {
      motifId: "delta-reverse",
      scenarioLogicBranch:
        "reverse-two-year-delta",
      signatureKeys: [values.rate, diff],
      distractorValues: [
        diff *
          (values.rate / 100) ** 2,
        diff * values.rate,
      ],
      distractorLabels: [
        "CI_Inversion",
        "Delta_Formula_Mixup",
      ],
      validationTokens: [
        "difference",
        "principal",
      ],
    },
  );
}

function createCiFromSiScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { principal: 12000, rate: 10 },
          { principal: 8000, rate: 20 },
        ]
      : [
          { principal: 5000, rate: 10 },
          { principal: 4000, rate: 5 },
        ],
  );
  const si = simpleInterest(
    values.principal,
    values.rate,
    2,
  );
  const ci =
    compoundAmount(
      values.principal,
      values.rate,
      2,
    ) - values.principal;
  return finalizeInterestScenario(
    {
      scenarioType: "ci-from-si",
      values: { ...values, si },
      formula:
        "recover P from SI, then calculate CI",
      text: `The simple interest on a sum for 2 years at ${values.rate}% per annum is Rs. ${formatNumber(si)}. Find the compound interest on the same sum at the same rate and time.`,
      correctAnswer: ci,
      reasoningSteps: [
        createReasoningStep(
          "reverse",
          "First recover the principal from simple interest.",
        ),
        createReasoningStep(
          "infer",
          `Then calculate 2-year CI = Rs. ${formatNumber(ci)}.`,
        ),
      ],
      context: buildInterestContext(
        "CI from SI",
        "compound interest",
      ),
    },
    {
      motifId: "ci-from-si",
      scenarioLogicBranch:
        "principal-from-si-then-ci",
      signatureKeys: [values.rate],
      distractorValues: [
        si,
        ci - si,
      ],
      distractorLabels: [
        "Base_Year_Shift",
        "Amount_vs_Interest_Confusion",
      ],
      validationTokens: [
        "simple interest",
        "compound interest",
      ],
    },
  );
}

function createSiInstallmentScenario() {
  const values = pickRandomItem([
    { debt: 6300, rate: 10, installments: 3, payment: 2000 },
    { debt: 12600, rate: 10, installments: 3, payment: 4000 },
  ]);
  return finalizeInterestScenario(
    {
      scenarioType: "si-installment",
      values,
      formula:
        "A = nx + Rx(n-1)n/200",
      text: `A debt of Rs. ${values.debt} is to be cleared in ${values.installments} equal yearly installments under simple interest at ${values.rate}% per annum. Find each installment.`,
      correctAnswer: values.payment,
      reasoningSteps: [
        createReasoningStep(
          "model",
          "Under SI, earlier installments carry interest for longer than later installments.",
        ),
        createReasoningStep(
          "infer",
          `Using A = nx + Rx(n-1)n/200 gives x = Rs. ${values.payment}.`,
        ),
      ],
      context: buildInterestContext(
        "SI installment",
        "installment",
      ),
    },
    {
      motifId: "si-installment",
      scenarioLogicBranch:
        "linear-installment-equation",
      signatureKeys: [
        values.rate,
        values.installments,
      ],
      distractorValues: [
        values.debt /
          values.installments,
        values.payment + values.rate,
      ],
      distractorLabels: [
        "Installment_Principal_Error",
        "Residual_Debt_Ignorance",
      ],
      validationTokens: [
        "equal yearly installments",
        "simple interest",
      ],
    },
  );
}

function createCiInstallmentScenario() {
  const values = pickRandomItem([
    { loan: 2100, rate: 10, installments: 2, payment: 1210 },
    { loan: 2480, rate: 10, installments: 2, payment: 1428.9 },
  ]);
  return finalizeInterestScenario(
    {
      scenarioType: "ci-installment",
      values,
      formula:
        "P = x/(1+r) + x/(1+r)^2 + ...",
      text: `A loan of Rs. ${values.loan} is repaid in ${values.installments} equal yearly installments at ${values.rate}% compound interest. Find each installment.`,
      correctAnswer: money(values.payment),
      reasoningSteps: [
        createReasoningStep(
          "model",
          "Discount each future installment back to the present value.",
        ),
        createReasoningStep(
          "infer",
          `Each installment = Rs. ${formatNumber(values.payment)}.`,
        ),
      ],
      context: buildInterestContext(
        "CI installment",
        "installment",
      ),
    },
    {
      motifId: "ci-installment",
      scenarioLogicBranch:
        "compound-present-value",
      signatureKeys: [
        values.rate,
        values.installments,
      ],
      distractorValues: [
        values.loan /
          values.installments,
        values.payment + values.rate,
      ],
      distractorLabels: [
        "Residual_Debt_Ignorance",
        "Installment_Principal_Error",
      ],
      validationTokens: [
        "compound interest",
        "equal yearly installments",
      ],
    },
  );
}

function createCiLoanRepaymentScenario() {
  const values = pickRandomItem([
    { loan: 10000, rate: 12, payment: 5600 },
    { loan: 15000, rate: 10, payment: 8000 },
  ]);
  const interest =
    values.loan * values.rate / 100;
  const principalComponent =
    values.payment - interest;
  return finalizeInterestScenario(
    {
      scenarioType: "ci-loan-repayment",
      values: {
        ...values,
        principalComponent,
      },
      formula:
        "first interest component = opening balance * rate",
      text: `A loan of Rs. ${values.loan} carries compound interest at ${values.rate}% per annum. If the first yearly installment paid is Rs. ${values.payment}, find the interest component in that first payment.`,
      correctAnswer: interest,
      reasoningSteps: [
        createReasoningStep(
          "state",
          "Before the first payment, interest is charged on the full opening balance.",
        ),
        createReasoningStep(
          "infer",
          `Interest component = ${values.rate}% of ${values.loan} = ${interest}.`,
        ),
      ],
      context: buildInterestContext(
        "loan repayment",
        "first interest component",
      ),
    },
    {
      motifId: "ci-loan-repayment",
      scenarioLogicBranch:
        "first-payment-interest-component",
      signatureKeys: [values.rate],
      distractorValues: [
        principalComponent,
        values.payment,
      ],
      distractorLabels: [
        "Installment_Principal_Error",
        "Amount_vs_Interest_Confusion",
      ],
      validationTokens: [
        "first yearly installment",
        "interest component",
      ],
    },
  );
}

function createCiContinuousScenario() {
  const values = pickRandomItem([
    { principal: 10000, rate: 5, years: 2 },
    { principal: 20000, rate: 4, years: 3 },
  ]);
  const correctAnswer = money(
    values.principal *
      Math.exp(
        rateDecimal(values.rate) *
          values.years,
      ),
  );
  return finalizeInterestScenario(
    {
      scenarioType: "ci-continuous",
      values,
      formula: "A = Pe^(rt)",
      text: `A fund of Rs. ${values.principal} is compounded continuously at ${values.rate}% per annum for ${values.years} years. Find the amount, rounded to 2 decimals.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "Continuous compounding uses the multiplier e^(rt).",
        ),
        createReasoningStep(
          "infer",
          `Amount = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "continuous compounding",
        "amount",
      ),
    },
    {
      motifId: "ci-continuous",
      scenarioLogicBranch:
        "continuous-exponential-growth",
      signatureKeys: [
        values.rate,
        values.years,
      ],
      distractorValues: [
        compoundAmount(
          values.principal,
          values.rate,
          values.years,
        ),
        values.principal *
          (1 +
            (values.rate * values.years) /
              100),
      ],
      distractorLabels: [
        "Compounding_Frequency_Neglect",
        "Effective_Rate_Fallacy",
      ],
      validationTokens: [
        "continuously",
      ],
    },
  );
}

function createCiGrowthRegressionScenario(
  difficulty: DifficultyLabel,
) {
  const values = pickRandomItem(
    difficulty === "Hard"
      ? [
          { value: 200000, up: 20, down: 10 },
          { value: 125000, up: 12.5, down: 20 },
        ]
      : [
          { value: 100000, up: 10, down: 10 },
          { value: 80000, up: 25, down: 20 },
        ],
  );
  const correctAnswer = money(
    values.value *
      (1 + values.up / 100) *
      (1 - values.down / 100),
  );
  return finalizeInterestScenario(
    {
      scenarioType: "ci-growth-regression",
      values,
      formula:
        "final = initial(1+up)(1-down)",
      text: `The value of an asset first appreciates by ${values.up}% and then depreciates by ${values.down}%. If its initial value was Rs. ${values.value}, find the final value.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          "Successive percentage changes must be multiplied in order.",
        ),
        createReasoningStep(
          "infer",
          `Final value = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "growth regression",
        "final value",
      ),
    },
    {
      motifId: "ci-growth-regression",
      scenarioLogicBranch:
        "appreciate-then-depreciate",
      signatureKeys: [
        values.up,
        values.down,
      ],
      distractorValues: [
        values.value *
          (1 +
            (values.up - values.down) /
              100),
        values.value,
      ],
      distractorLabels: [
        "Effective_Rate_Fallacy",
        "Simple_Addition_Trap",
      ],
      validationTokens: [
        "appreciates",
        "depreciates",
      ],
    },
  );
}

function createSiChangingPrincipalScenario() {
  const values = pickRandomItem([
    { principal: 10000, repaid: 4000, rate: 10, firstYears: 1, secondYears: 2 },
    { principal: 15000, repaid: 5000, rate: 12, firstYears: 1, secondYears: 1 },
  ]);
  const correctAnswer =
    simpleInterest(
      values.principal,
      values.rate,
      values.firstYears,
    ) +
    simpleInterest(
      values.principal - values.repaid,
      values.rate,
      values.secondYears,
    );
  return finalizeInterestScenario(
    {
      scenarioType: "si-changing-principal",
      values,
      formula:
        "piecewise SI on current principal",
      text: `A borrower takes Rs. ${values.principal} at ${values.rate}% simple interest. After ${values.firstYears} year, Rs. ${values.repaid} of the principal is repaid. Find the total interest for the next ${values.secondYears + values.firstYears} years.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "state",
          "Track the principal before and after the partial repayment.",
        ),
        createReasoningStep(
          "infer",
          `Total interest = Rs. ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "changing principal",
        "total interest",
      ),
    },
    {
      motifId: "si-changing-principal",
      scenarioLogicBranch:
        "mid-term-principal-repayment",
      signatureKeys: [
        values.rate,
        values.repaid,
      ],
      distractorValues: [
        simpleInterest(
          values.principal,
          values.rate,
          values.firstYears +
            values.secondYears,
        ),
        simpleInterest(
          values.principal - values.repaid,
          values.rate,
          values.firstYears +
            values.secondYears,
        ),
      ],
      distractorLabels: [
        "Mixed_Scheme_Overlap",
        "Residual_Debt_Ignorance",
      ],
      validationTokens: [
        "repaid",
        "principal",
      ],
    },
  );
}

function createCiEffectiveAnnualRateScenario() {
  const values = pickRandomItem([
    { nominal: 20, frequency: 2 },
    { nominal: 12, frequency: 4 },
    { nominal: 16, frequency: 4 },
  ]);
  const correctAnswer = money(
    ((1 +
      values.nominal /
        values.frequency /
        100) **
      values.frequency -
      1) *
      100,
  );
  return finalizeInterestScenario(
    {
      scenarioType:
        "ci-effective-annual-rate",
      values,
      formula:
        "EAR = (1 + R/k)^k - 1",
      text: `A scheme offers ${values.nominal}% nominal annual interest compounded ${values.frequency === 2 ? "half-yearly" : "quarterly"}. Find the effective annual rate.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "Convert the nominal annual rate into a periodic rate and compound it for one year.",
        ),
        createReasoningStep(
          "infer",
          `Effective annual rate = ${formatNumber(correctAnswer)}%.`,
        ),
      ],
      context: buildInterestContext(
        "effective annual rate",
        "rate",
      ),
    },
    {
      motifId: "ci-effective-annual-rate",
      scenarioLogicBranch:
        "nominal-to-effective-rate",
      signatureKeys: [
        values.nominal,
        values.frequency,
      ],
      distractorValues: [
        values.nominal,
        values.nominal / values.frequency,
      ],
      distractorLabels: [
        "Compounding_Frequency_Neglect",
        "Rate_Time_Mismatch",
      ],
      validationTokens: [
        "effective annual rate",
      ],
    },
  );
}

function createTransactionArbitrageScenario() {
  const values = pickRandomItem([
    { principal: 10000, siRate: 10, ciRate: 10, years: 2 },
    { principal: 20000, siRate: 8, ciRate: 10, years: 2 },
  ]);
  const borrowed =
    values.principal +
    simpleInterest(
      values.principal,
      values.siRate,
      values.years,
    );
  const lent = compoundAmount(
    values.principal,
    values.ciRate,
    values.years,
  );
  const correctAnswer =
    lent - borrowed;
  return finalizeInterestScenario(
    {
      scenarioType: "transaction-arbitrage",
      values: {
        ...values,
        borrowed,
        lent,
      },
      formula:
        "profit = CI amount - SI amount",
      text: `A trader borrows Rs. ${values.principal} at ${values.siRate}% simple interest and lends it at ${values.ciRate}% compound interest for ${values.years} years. Find the profit.`,
      correctAnswer,
      reasoningSteps: [
        createReasoningStep(
          "compare",
          "Compute the amount owed under SI and the amount received under CI.",
        ),
        createReasoningStep(
          "infer",
          `Profit = ${formatNumber(lent)} - ${formatNumber(borrowed)} = ${formatNumber(correctAnswer)}.`,
        ),
      ],
      context: buildInterestContext(
        "transaction arbitrage",
        "profit",
      ),
    },
    {
      motifId: "transaction-arbitrage",
      scenarioLogicBranch:
        "borrow-si-lend-ci",
      signatureKeys: [
        values.siRate,
        values.ciRate,
        values.years,
      ],
      distractorValues: [
        lent,
        borrowed,
      ],
      distractorLabels: [
        "Amount_vs_Interest_Confusion",
        "SI_CI_Formula_Swap",
      ],
      validationTokens: [
        "borrows",
        "lends",
      ],
    },
  );
}

const scenarioFactoriesByMotif = new Map<
  string,
  InterestScenarioFactory
>([
  ["si-basic-amount", createSiBasicAmountScenario],
  ["si-find-principal", createSiFindPrincipalScenario],
  ["si-multiple-times", createSiMultipleTimesScenario],
  ["si-rate-shift", createSiRateShiftScenario],
  ["si-split-investment", createSiSplitInvestmentScenario],
  ["si-equal-interest", createSiEqualInterestScenario],
  ["si-equal-amount", createSiEqualAmountScenario],
  ["ci-basic-calc", createCiBasicScenario],
  ["ci-varying-rate", createCiVaryingRateScenario],
  ["ci-compounding-period", createCiCompoundingPeriodScenario],
  ["ci-fractional-time", createCiFractionalTimeScenario],
  ["ci-multiple-times", createCiMultipleTimesScenario],
  ["ci-population-growth", createCiPopulationGrowthScenario],
  ["delta-2-year", createDelta2YearScenario],
  ["delta-3-year", createDelta3YearScenario],
  ["delta-reverse", createDeltaReverseScenario],
  ["ci-from-si", createCiFromSiScenario],
  ["si-installment", createSiInstallmentScenario],
  ["ci-installment", createCiInstallmentScenario],
  ["ci-loan-repayment", createCiLoanRepaymentScenario],
  ["ci-continuous", createCiContinuousScenario],
  ["ci-growth-regression", createCiGrowthRegressionScenario],
  ["si-changing-principal", createSiChangingPrincipalScenario],
  ["ci-effective-annual-rate", createCiEffectiveAnnualRateScenario],
  ["transaction-arbitrage", createTransactionArbitrageScenario],
]);

const legacyMotifAliases: Record<string, string> = {
  "linear-interest-accumulation":
    "si-basic-amount",
  "multiplicative-growth":
    "ci-basic-calc",
  "interest-on-interest-detection":
    "delta-2-year",
  "effective-period-transformation":
    "ci-compounding-period",
  "compound-decay":
    "ci-growth-regression",
  "reverse-growth-reconstruction":
    "si-find-principal",
  "equivalent-multiplier-compression":
    "ci-varying-rate",
  "comparative-interest-systems":
    "ci-from-si",
  "interest-period-trap":
    "ci-compounding-period",
  "compounding-trap": "ci-basic-calc",
  "interest-difference-backsolve":
    "delta-reverse",
};

const patternSpecificMotifs: Record<
  string,
  string[]
> = {
  "registry-simple-compound-interest-easy": [
    "si-basic-amount",
    "si-find-principal",
    "si-multiple-times",
    "ci-basic-calc",
  ],
  "registry-simple-compound-interest-medium": [
    "si-rate-shift",
    "si-split-investment",
    "ci-basic-calc",
    "ci-varying-rate",
    "ci-population-growth",
    "delta-2-year",
    "ci-from-si",
  ],
  "registry-simple-compound-interest-hard": [
    "si-equal-interest",
    "si-equal-amount",
    "ci-compounding-period",
    "ci-fractional-time",
    "delta-3-year",
    "delta-reverse",
    "si-installment",
    "ci-installment",
    "ci-loan-repayment",
    "ci-continuous",
    "si-changing-principal",
    "ci-effective-annual-rate",
    "transaction-arbitrage",
  ],
  "registry-simple-interest-easy": [
    "si-basic-amount",
    "si-find-principal",
    "si-multiple-times",
  ],
  "registry-simple-interest-medium": [
    "si-basic-amount",
    "si-rate-shift",
    "si-split-investment",
    "si-find-principal",
  ],
  "registry-simple-interest-hard": [
    "si-basic-amount",
    "si-find-principal",
    "si-multiple-times",
    "si-rate-shift",
    "si-split-investment",
    "si-equal-interest",
    "si-equal-amount",
    "si-changing-principal",
    "si-installment",
  ],
  "registry-compound-interest-medium": [
    "ci-basic-calc",
    "ci-varying-rate",
    "ci-multiple-times",
    "ci-population-growth",
  ],
  "registry-compound-interest-hard": [
    "ci-compounding-period",
    "ci-fractional-time",
    "ci-effective-annual-rate",
    "ci-continuous",
  ],
  "registry-interest-si-vs-ci-medium": [
    "delta-2-year",
    "ci-from-si",
  ],
  "registry-interest-si-vs-ci-hard": [
    "delta-3-year",
    "delta-reverse",
    "transaction-arbitrage",
  ],
  "registry-interest-fractional-compounding-medium": [
    "ci-compounding-period",
  ],
  "registry-interest-fractional-compounding-hard": [
    "ci-compounding-period",
    "ci-fractional-time",
    "ci-effective-annual-rate",
  ],
  "registry-interest-growth-decay-medium": [
    "ci-population-growth",
    "ci-growth-regression",
  ],
  "registry-interest-growth-decay-hard": [
    "ci-growth-regression",
    "ci-varying-rate",
    "transaction-arbitrage",
  ],
};

const fallbackMotifs = [
  "si-basic-amount",
  "si-find-principal",
  "si-rate-shift",
  "ci-basic-calc",
  "ci-varying-rate",
  "ci-compounding-period",
  "delta-2-year",
  "delta-3-year",
  "ci-growth-regression",
];

export function createSimpleCompoundInterestScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const motifId =
    motif?.id &&
    (scenarioFactoriesByMotif.has(motif.id)
      ? motif.id
      : legacyMotifAliases[motif.id]);
  const patternMotifs =
    !motifId &&
    patternSpecificMotifs[pattern.id];
  const selectedMotif =
    motifId ??
    pickRandomItem(
      patternMotifs ?? fallbackMotifs,
    );
  const factory =
    scenarioFactoriesByMotif.get(
      selectedMotif,
    ) ??
    createSiBasicAmountScenario;
  return factory(difficulty, motif);
}
