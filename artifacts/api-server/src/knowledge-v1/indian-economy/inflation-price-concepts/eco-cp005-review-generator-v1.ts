import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP005_CONCEPT_ROWS_V1,
  ECO_CP005_COST_SCENARIOS_V1,
  ECO_CP005_DEMAND_SCENARIOS_V1,
  ECO_CP005_INDEX_CASES_V1,
  ECO_CP005_INDEX_ROWS_V1,
} from "./eco-cp005-facts";
import type { EcoCp005ReviewQuestion } from "./eco-cp005-review-types";

const concepts = ECO_CP005_CONCEPT_ROWS_V1;
const indices = ECO_CP005_INDEX_ROWS_V1;

const qlNames: Record<number, string> = {
  1: "Identify inflation, deflation or disinflation",
  2: "Identify the meaning of an inflation concept",
  3: "Apply demand-pull inflation",
  4: "Apply cost-push inflation",
  5: "Apply the purchasing-power effect",
  6: "Apply inflation effects to borrowers, lenders and fixed incomes",
  7: "Distinguish CPI, WPI and GDP deflator",
  8: "Distinguish headline and core inflation",
  9: "Apply price-index and inflation-rate relationships",
  10: "Identify a correctly matched pair",
  11: "Evaluate statements about inflation concepts",
  12: "Distinguish close inflation and measurement concepts",
};

function difficultyForVariant(ql: number, rowIndex: number): KnowledgeV1Difficulty {
  if (ql === 1 || ql === 2) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 3 || ql === 4) return rowIndex === 0 ? "Easy" : "Medium";
  if (ql === 5) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 6) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 7) return rowIndex < 2 ? "Easy" : rowIndex === 2 ? "Medium" : "Hard";
  if (ql === 8) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 9) return rowIndex < 3 ? "Medium" : "Hard";
  if (ql === 10) return "Medium";
  if (ql === 11) return rowIndex === 0 ? "Medium" : "Hard";
  return rowIndex < 2 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function sourceBundle(
  ...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]
) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

function concept(id: string) {
  const row = concepts.find((item) => item.id === id);
  if (!row) throw new Error(`Unknown ECO-CP-005 concept ${id}`);
  return row;
}

function conceptExplanation(id: string) {
  const explanations: Record<string, string> = {
    inflation: "Inflation is a sustained rise in the general price level. It refers to broad price increases, not just a one-time rise in one item.",
    deflation: "Deflation is a sustained fall in the general price level. It is the opposite of inflation because prices are falling overall.",
    disinflation: "Disinflation means the inflation rate is falling. Prices may still be rising, but they are rising more slowly than before.",
    "base-effect": "Base effect comes from the price level used for comparison. An unusually low or high base can make the current inflation rate look higher or lower.",
  };
  return explanations[id] ?? `${concept(id).term} means ${concept(id).compactMeaning}.`;
}

const purchasingCases = [
  {
    stem: "Prices rise while money income stays unchanged. Purchasing power will:",
    correct: "Fall",
    options: ["Fall", "Rise", "Stay unchanged", "Double"],
    explanation: "Purchasing power tells us how much a given amount of money can buy. If prices rise while income is unchanged, the same money buys fewer goods and services.",
  },
  {
    stem: "The general price level falls while money income stays unchanged. Purchasing power will:",
    correct: "Rise",
    options: ["Rise", "Fall", "Stay unchanged", "Become zero"],
    explanation: "When prices fall, each unit of money can buy more. Therefore, unchanged money income has greater purchasing power.",
  },
  {
    stem: "A pension stays fixed while prices keep rising. The pensioner's real purchasing power will generally:",
    correct: "Fall",
    options: ["Fall", "Rise", "Stay exactly unchanged", "Equal the inflation rate"],
    explanation: "The pension amount is fixed but goods and services cost more. So the pension can purchase less than before.",
  },
  {
    stem: "Money income rises by less than the general price level. Real purchasing power will generally:",
    correct: "Fall",
    options: ["Fall", "Rise", "Stay unchanged", "Become zero automatically"],
    explanation: "Income has increased, but prices have increased by more. Since income has not kept pace with prices, real purchasing power falls.",
  },
] as const;

const effectCases = [
  {
    stem: "A fixed salary is not adjusted while unexpected inflation rises. Who is directly hurt?",
    correct: "The fixed-income earner",
    options: ["The fixed-income earner", "A fixed-rate borrower", "A seller whose price rises", "No one"],
    explanation: "The salary remains the same while prices rise. The fixed-income earner can therefore buy fewer goods and services with that salary.",
  },
  {
    stem: "Unexpected inflation occurs after a fixed-rate loan is made. Other things equal, who tends to benefit?",
    correct: "The borrower",
    options: ["The borrower", "The lender", "Both equally", "Neither"],
    explanation: "The borrower repays the same fixed number of rupees, but those rupees have lower purchasing power. This reduces the real burden of repayment.",
  },
  {
    stem: "A lender will receive fixed rupee repayments. Unexpected inflation is higher than expected. The lender tends to:",
    correct: "Lose in real terms",
    options: ["Lose in real terms", "Gain in real terms", "Receive a higher real repayment automatically", "Be unaffected"],
    explanation: "The lender receives the agreed rupee amount, but inflation has reduced what that money can buy. So the real value of the repayment is lower.",
  },
  {
    stem: "A fixed-rate loan is agreed before an unexpected rise in inflation. Which statement is most accurate?",
    correct: "The borrower tends to gain and the lender tends to lose in real terms",
    options: [
      "The borrower tends to gain and the lender tends to lose in real terms",
      "The lender tends to gain and the borrower tends to lose in real terms",
      "Both must gain equally",
      "Inflation cannot affect fixed repayments in real terms",
    ],
    explanation: "Unexpected inflation reduces the purchasing power of the fixed repayments. That lowers the borrower's real repayment burden and reduces the lender's real return.",
  },
] as const;

const headlineCoreCases = [
  {
    stem: "Inflation measured using the full CPI basket is usually called:",
    correct: "Headline inflation",
    options: ["Headline inflation", "Core inflation", "Deflation", "WPI only"],
    explanation: "Headline inflation uses the full selected basket, including items such as food and fuel. It therefore reflects the overall measured price movement of that basket.",
  },
  {
    stem: "CPI inflation excluding food and fuel is commonly used as a measure of:",
    correct: "Core inflation",
    options: ["Core inflation", "Headline inflation", "Deflation", "WPI only"],
    explanation: "A common core measure removes food and fuel because their prices can be highly volatile. This helps show more persistent underlying price pressure.",
  },
  {
    stem: "Food prices jump sharply while other prices change little. Which measure is more directly affected?",
    correct: "Headline inflation",
    options: ["Headline inflation", "Core inflation excluding food and fuel", "Neither measure", "GDP growth"],
    explanation: "Headline inflation includes food prices, so the food shock enters it directly. A core measure that excludes food and fuel removes that direct effect.",
  },
  {
    stem: "Why is core inflation examined separately from headline inflation?",
    correct: "To study underlying price pressure after excluding some volatile components",
    options: [
      "To study underlying price pressure after excluding some volatile components",
      "To measure only wholesale prices",
      "To remove all services from the price index",
      "To convert nominal GDP into GNP",
    ],
    explanation: "Core inflation removes selected volatile components, commonly food and fuel. This can make persistent underlying inflation easier to see.",
  },
] as const;

const distinctionCases = [
  {
    stem: "Inflation falls from 8% to 5%, but prices are still rising. This is:",
    correct: "Disinflation",
    options: ["Disinflation", "Deflation", "Hyperinflation", "Revaluation"],
    explanation: "The inflation rate has fallen from 8% to 5%, so inflation has slowed. Because the rate is still positive, prices are still rising rather than falling.",
  },
  {
    stem: "Which statement correctly distinguishes deflation from disinflation?",
    correct: "Deflation means the price level falls; disinflation means inflation slows",
    options: [
      "Deflation means the price level falls; disinflation means inflation slows",
      "Deflation and disinflation always mean the same thing",
      "Deflation means prices rise faster; disinflation means prices fall to zero",
      "Disinflation can occur only when inflation is negative",
    ],
    explanation: "Deflation means the general price level is actually falling. Disinflation means prices are still rising, but at a slower rate than before.",
  },
  {
    stem: "A high inflation reading partly reflects an unusually low price level in the comparison period. This illustrates:",
    correct: "Base effect",
    options: ["Base effect", "Cost-push inflation", "Purchasing power", "Core inflation"],
    explanation: "Inflation compares the current price level with an earlier one. If the earlier base is unusually low, the measured percentage increase can appear unusually high.",
  },
  {
    stem: "Two periods have the same current price increase but different inflation rates because their comparison bases differ. This is mainly due to:",
    correct: "Base effect",
    options: ["Base effect", "Demand-pull inflation", "WPI coverage", "Purchasing power"],
    explanation: "The inflation rate depends on the starting level used for comparison. Different base levels can therefore produce different percentage rates even when the current increase is similar.",
  },
] as const;

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp005ReviewQuestion {
  const qlId = `ECO-005-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForVariant(ql, rowIndex);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sourceBundle(concept("inflation"));

  if (ql === 1) {
    const variants = [
      { stem: "A sustained rise in the general price level is called:", id: "inflation" },
      { stem: "A sustained fall in the general price level is called:", id: "deflation" },
      { stem: "The inflation rate falls but remains positive. This is called:", id: "disinflation" },
      { stem: "Prices of many goods and services keep rising over time. This situation is:", id: "inflation" },
    ];
    const row = variants[rowIndex % variants.length];
    const fact = concept(row.id);
    stem = row.stem;
    correct = fact.term;
    options = moveCorrect(["Inflation", "Deflation", "Disinflation", "Stagnation"], correct, correctTarget);
    explanation = conceptExplanation(row.id);
    metadata = sourceBundle(fact);
  } else if (ql === 2) {
    const rows = [concept("inflation"), concept("deflation"), concept("disinflation"), concept("base-effect")];
    const row = rows[rowIndex % rows.length];
    stem = `What does ${row.term} mean?`;
    correct = row.compactMeaning;
    options = moveCorrect(rows.map((item) => item.compactMeaning), correct, correctTarget);
    explanation = conceptExplanation(row.id);
    metadata = sourceBundle(row);
  } else if (ql === 3) {
    const row = ECO_CP005_DEMAND_SCENARIOS_V1[rowIndex % ECO_CP005_DEMAND_SCENARIOS_V1.length];
    stem = `${row.stem} This mainly causes:`;
    correct = row.answer;
    options = moveCorrect(["Demand-pull inflation", "Cost-push inflation", "Deflation", "Disinflation"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("demand-pull"));
  } else if (ql === 4) {
    const row = ECO_CP005_COST_SCENARIOS_V1[rowIndex % ECO_CP005_COST_SCENARIOS_V1.length];
    stem = `${row.stem} This mainly causes:`;
    correct = row.answer;
    options = moveCorrect(["Cost-push inflation", "Demand-pull inflation", "Deflation", "Disinflation"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("cost-push"));
  } else if (ql === 5) {
    const row = purchasingCases[rowIndex % purchasingCases.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("purchasing-power"), concept("inflation"));
  } else if (ql === 6) {
    const row = effectCases[rowIndex % effectCases.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("inflation"), concept("purchasing-power"));
  } else if (ql === 7) {
    if (rowIndex < 3) {
      const row = indices[rowIndex];
      stem = rowIndex === 0
        ? "Which index tracks prices of a household consumption basket?"
        : rowIndex === 1
          ? "Which index tracks price movement at the wholesale level?"
          : "Which measure covers price change for final goods and services included in GDP?";
      correct = row.index;
      options = moveCorrect(["CPI", "WPI", "GDP deflator", "Core CPI"], correct, correctTarget);
      explanation = row.index === "CPI"
        ? "CPI follows the prices of a basket of goods and services consumed by households. That makes it a consumer-level price measure."
        : row.index === "WPI"
          ? "WPI tracks price movement mainly at the wholesale level. It therefore differs from CPI, which focuses on household consumption prices."
          : "The GDP deflator covers prices of domestically produced final goods and services included in GDP. Its coverage is broader than a fixed consumer basket.";
      metadata = sourceBundle(row);
    } else {
      stem = "Which statement is correct about CPI, WPI and the GDP deflator?";
      correct = "CPI focuses on household consumption, WPI on wholesale prices, and the GDP deflator on output covered by GDP";
      options = moveCorrect([
        correct,
        "CPI measures only wholesale goods, while WPI measures household services",
        "WPI and GDP deflator always cover exactly the same basket",
        "GDP deflator measures only imported consumer goods",
      ], correct, correctTarget);
      explanation = "The three measures differ mainly in what prices they cover. CPI focuses on household consumption, WPI on wholesale prices, and the GDP deflator on final output included in GDP.";
      metadata = sourceBundle(...indices);
    }
  } else if (ql === 8) {
    const row = headlineCoreCases[rowIndex % headlineCoreCases.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("headline"), concept("core"));
  } else if (ql === 9) {
    if (rowIndex < 3) {
      const row = ECO_CP005_INDEX_CASES_V1[rowIndex];
      stem = `A price index rises from ${row.oldIndex} to ${row.newIndex}. The inflation rate is:`;
      correct = row.answer;
      const n = Number(row.answer.replace("%", ""));
      options = moveCorrect([row.answer, `${n + 2}%`, `${Math.max(0, n - 2)}%`, `${n * 2}%`], correct, correctTarget);
      explanation = row.explanation;
    } else {
      stem = "A price index is 150. If it rises by 8%, the new index is:";
      correct = "162";
      options = moveCorrect(["162", "158", "170", "142"], correct, correctTarget);
      explanation = "An 8% rise on 150 is 12. Adding this increase to the original index gives 150 + 12 = 162.";
    }
    metadata = sourceBundle(indices[0]);
  } else if (ql === 10) {
    const rows = [
      {
        correct: "CPI — household consumption prices",
        source: indices[0],
        explanation: "CPI is correctly matched with household consumption prices because it tracks the prices of goods and services acquired by households for consumption.",
      },
      {
        correct: "WPI — wholesale price movement",
        source: indices[1],
        explanation: "WPI is correctly matched with wholesale price movement because it measures price changes mainly at the wholesale level.",
      },
      {
        correct: "Core inflation — commonly excludes food and fuel",
        source: concept("core"),
        explanation: "Core inflation is commonly calculated by excluding volatile items such as food and fuel. The aim is to see underlying price pressure more clearly.",
      },
    ];
    const row = rows[rowIndex % rows.length];
    stem = "Which pair is correctly matched?";
    correct = row.correct;
    options = moveCorrect([
      row.correct,
      "CPI — only wholesale prices",
      "WPI — household services only",
      "Deflation — a slower positive inflation rate",
    ], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(row.source);
  } else if (ql === 11) {
    const rows = [
      {
        s1: "Inflation reduces purchasing power if money income does not keep pace with prices.",
        s2: "Deflation means a sustained fall in the general price level.",
        correct: "Both I and II",
        explanation: "Statement I is correct because money buys less when prices rise faster than income. Statement II is also correct because deflation is a sustained fall in the general price level.",
      },
      {
        s1: "Disinflation means inflation has slowed.",
        s2: "Disinflation necessarily means the general price level is falling.",
        correct: "I only",
        explanation: "Statement I is correct: disinflation means a lower inflation rate. Statement II is false because prices can still be rising, only more slowly.",
      },
      {
        s1: "Cost-push inflation can follow a broad rise in input costs.",
        s2: "Demand-pull inflation can arise when demand grows faster than available output.",
        correct: "Both I and II",
        explanation: "Statement I describes cost-push inflation because higher input costs raise production costs. Statement II describes demand-pull inflation because excess demand puts upward pressure on prices.",
      },
    ];
    const row = rows[rowIndex % rows.length];
    stem = `Consider the statements:\
I. ${row.s1}\
II. ${row.s2}\
Which is correct?`;
    correct = row.correct;
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("inflation"), concept("deflation"), concept("disinflation"), concept("demand-pull"), concept("cost-push"));
  } else {
    const row = distinctionCases[rowIndex % distinctionCases.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("deflation"), concept("disinflation"), concept("base-effect"));
  }

  return {
    questionId: `ECO-CP005-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-005",
    qlId,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    ...metadata,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateEcoCp005ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 4,
    10: 3,
    11: 3,
    12: 4,
  };

  const questions: EcoCp005ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 12; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}

export const ECO_CP005_REVIEW_V1 = generateEcoCp005ReviewBatchV1();
