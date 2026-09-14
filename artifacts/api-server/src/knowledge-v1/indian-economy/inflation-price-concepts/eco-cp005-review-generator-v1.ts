import { deterministicShuffle } from "../../deterministic";
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
  if (ql === 1) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 2) return rowIndex < 2 ? "Easy" : "Medium";
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

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const distractors = deterministicShuffle([...new Set(values)], seed)
    .filter((value) => value !== correct)
    .slice(0, 3);
  if (distractors.length !== 3) throw new Error(`Insufficient distractors for ${correct}`);
  return moveCorrect(deterministicShuffle([...distractors, correct], `${seed}:final`), correct, target);
}

function sources(...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]) {
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

const purchasingCases = Object.freeze([
  {
    stem: "Prices rise while a person's money income stays unchanged. What happens to purchasing power?",
    answer: "It falls",
    options: ["It falls", "It rises", "It must double", "It is unaffected"],
    explanation: "When prices rise and money income is unchanged, the same money buys fewer goods and services.",
  },
  {
    stem: "The general price level falls while money income is unchanged. What happens to purchasing power?",
    answer: "It rises",
    options: ["It rises", "It falls", "It becomes zero", "It is unaffected"],
    explanation: "Lower prices allow the same money income to buy more goods and services.",
  },
  {
    stem: "A pension stays fixed while prices keep rising. The pensioner's real purchasing power will generally:",
    answer: "Fall",
    options: ["Fall", "Rise", "Stay exactly unchanged", "Become equal to inflation"],
    explanation: "A fixed money income buys less when the general price level rises.",
  },
  {
    stem: "Money income rises by less than the rise in the general price level. Real purchasing power will generally:",
    answer: "Fall",
    options: ["Fall", "Rise", "Stay unchanged", "Become zero automatically"],
    explanation: "If income rises more slowly than prices, real purchasing power falls.",
  },
]);

const effectCases = Object.freeze([
  {
    stem: "A worker receives a fixed salary with no adjustment while unexpected inflation rises. Who is directly hurt?",
    answer: "The fixed-income earner",
    options: ["The fixed-income earner", "A borrower repaying a fixed nominal debt", "A seller whose price rises with inflation", "No one"],
    explanation: "A fixed money income loses purchasing power when prices rise.",
  },
  {
    stem: "Unexpected inflation occurs after a loan is made at a fixed nominal interest rate. Other things equal, who tends to benefit?",
    answer: "The borrower",
    options: ["The borrower", "The lender", "Both equally", "Neither can be affected"],
    explanation: "The borrower repays in money with lower purchasing power, so unexpected inflation can benefit the borrower.",
  },
  {
    stem: "A lender will receive fixed rupee repayments. Unexpected inflation turns out higher than expected. Other things equal, the lender tends to:",
    answer: "Lose in real terms",
    options: ["Lose in real terms", "Gain in real terms", "Receive a higher real repayment automatically", "Be unaffected by purchasing power"],
    explanation: "Higher unexpected inflation reduces the real value of fixed nominal repayments.",
  },
  {
    stem: "A fixed-rate borrower and lender agree on a loan before an unexpected rise in inflation. Which statement is most accurate?",
    answer: "The borrower tends to gain and the lender tends to lose in real terms",
    options: [
      "The borrower tends to gain and the lender tends to lose in real terms",
      "The lender tends to gain and the borrower tends to lose in real terms",
      "Both must gain equally",
      "Inflation cannot affect the real value of fixed repayments",
    ],
    explanation: "Unexpected inflation lowers the real value of fixed nominal repayments, helping the borrower and hurting the lender.",
  },
]);

const headlineCoreCases = Object.freeze([
  {
    stem: "Inflation measured using the full CPI basket is usually called:",
    answer: "Headline inflation",
    explanation: "Headline inflation uses the full selected basket.",
  },
  {
    stem: "CPI inflation excluding food and fuel is commonly used as a measure of:",
    answer: "Core inflation",
    explanation: "A common exclusion-based core measure removes food and fuel.",
  },
  {
    stem: "Food prices jump sharply but other prices change little. Which measure is more directly affected by the food shock?",
    answer: "Headline inflation",
    explanation: "Headline inflation includes food, while a common core measure excludes food and fuel.",
  },
  {
    stem: "Why is core inflation examined separately from headline inflation?",
    answer: "To study underlying price pressure after excluding some volatile components",
    explanation: "Core measures try to show more persistent underlying inflation by excluding selected volatile items.",
  },
]);

const distinctionCases = Object.freeze([
  {
    stem: "Inflation falls from 8% to 5%, but prices are still rising. This is:",
    answer: "Disinflation",
    options: ["Disinflation", "Deflation", "Hyperinflation", "Revaluation"],
    explanation: "The inflation rate has fallen, but it is still positive. That is disinflation.",
  },
  {
    stem: "Which statement correctly distinguishes deflation from disinflation?",
    answer: "Deflation means the general price level falls; disinflation means inflation slows",
    options: [
      "Deflation means the general price level falls; disinflation means inflation slows",
      "Deflation and disinflation always mean the same thing",
      "Deflation means prices rise faster; disinflation means prices fall to zero",
      "Disinflation can occur only when CPI is negative",
    ],
    explanation: "Deflation is a fall in the price level. Disinflation is a lower positive rate of inflation.",
  },
  {
    stem: "A high inflation reading partly reflects an unusually low price level in the comparison period. This illustrates:",
    answer: "Base effect",
    options: ["Base effect", "Cost-push inflation", "Purchasing power", "Core inflation"],
    explanation: "The measured rate can be affected by the level of prices in the comparison period.",
  },
  {
    stem: "Two periods have the same current price increase, but different inflation rates because their comparison-period prices differ. The difference is mainly due to:",
    answer: "Base effect",
    options: ["Base effect", "Demand-pull inflation", "WPI coverage", "Purchasing power"],
    explanation: "Different comparison bases can produce different measured inflation rates.",
  },
]);

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp005ReviewQuestion {
  const qlId = `ECO-005-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForVariant(ql, rowIndex);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sources(concept("inflation"));

  if (ql === 1) {
    const rows = [concept("inflation"), concept("deflation"), concept("disinflation"), concept("inflation")];
    const row = rows[rowIndex % rows.length];
    const variants = [
      `A sustained rise in the general price level is called:`,
      `A sustained fall in the general price level is called:`,
      `The inflation rate falls but remains positive. This is called:`,
      `Prices of many goods and services keep rising over time. The general situation is:`,
    ];
    stem = variants[rowIndex % variants.length];
    correct = row.term;
    options = moveCorrect(["Inflation", "Deflation", "Disinflation", "Stagnation"], correct, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 2) {
    const rows = [concept("inflation"), concept("deflation"), concept("disinflation"), concept("base-effect")];
    const row = rows[rowIndex % rows.length];
    stem = `What does ${row.term} mean?`;
    correct = row.compactMeaning;
    options = chooseFour(rows.map((item) => item.compactMeaning), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 3) {
    const row = ECO_CP005_DEMAND_SCENARIOS_V1[rowIndex % ECO_CP005_DEMAND_SCENARIOS_V1.length];
    stem = `${row.stem} This mainly causes:`;
    correct = row.answer;
    options = moveCorrect(["Demand-pull inflation", "Cost-push inflation", "Deflation", "Disinflation"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept("demand-pull"));
  } else if (ql === 4) {
    const row = ECO_CP005_COST_SCENARIOS_V1[rowIndex % ECO_CP005_COST_SCENARIOS_V1.length];
    stem = `${row.stem} This mainly causes:`;
    correct = row.answer;
    options = moveCorrect(["Cost-push inflation", "Demand-pull inflation", "Deflation", "Disinflation"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept("cost-push"));
  } else if (ql === 5) {
    const row = purchasingCases[rowIndex % purchasingCases.length];
    stem = row.stem;
    correct = row.answer;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept("purchasing-power"), concept("inflation"));
  } else if (ql === 6) {
    const row = effectCases[rowIndex % effectCases.length];
    stem = row.stem;
    correct = row.answer;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept("inflation"), concept("purchasing-power"));
  } else if (ql === 7) {
    const row = indices[rowIndex % indices.length];
    if (rowIndex < 3) {
      stem = rowIndex === 0
        ? "Which index tracks prices of a household consumption basket?"
        : rowIndex === 1
          ? "Which index tracks price movement at the wholesale level?"
          : "Which measure covers price changes for final goods and services included in GDP?";
      correct = row.index;
      options = moveCorrect(["CPI", "WPI", "GDP deflator", "Core CPI"], correct, correctTarget);
      explanation = `${row.index} focuses on ${row.focus}.`;
      metadata = sources(row);
    } else {
      stem = "Which statement is correct about CPI, WPI and the GDP deflator?";
      correct = "CPI focuses on household consumption, WPI on wholesale prices, and the GDP deflator on output covered by GDP";
      options = moveCorrect([
        correct,
        "CPI measures only wholesale goods, while WPI measures household services",
        "WPI and GDP deflator always cover exactly the same basket",
        "GDP deflator measures only imported consumer goods",
      ], correct, correctTarget);
      explanation = "The three measures differ mainly in coverage: household consumption, wholesale prices, and GDP-covered output.",
      metadata = sources(...indices);
    }
  } else if (ql === 8) {
    const row = headlineCoreCases[rowIndex % headlineCoreCases.length];
    stem = row.stem;
    correct = row.answer;
    options = rowIndex === 3
      ? moveCorrect([
          correct,
          "To measure only wholesale prices",
          "To remove all services from the price index",
          "To convert nominal GDP directly into GNP",
        ], correct, correctTarget)
      : moveCorrect(["Headline inflation", "Core inflation", "Deflation", "WPI inflation only"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept("headline"), concept("core"));
  } else if (ql === 9) {
    const row = ECO_CP005_INDEX_CASES_V1[rowIndex % ECO_CP005_INDEX_CASES_V1.length];
    if (rowIndex < 3) {
      stem = `A price index rises from ${row.oldIndex} to ${row.newIndex}. The inflation rate is:`;
      correct = row.answer;
      const n = Number(row.answer.replace("%", ""));
      options = moveCorrect([row.answer, `${n + 2}%`, `${Math.max(0, n - 2)}%`, `${n * 2}%`], correct, correctTarget);
      explanation = row.explanation;
    } else {
      stem = "A price index is 150. If it rises by 8%, the new index is:";
      correct = "162";
      options = moveCorrect(["162", "158", "170", "142"], correct, correctTarget);
      explanation = "8% of 150 is 12, so the new index is 162.";
    }
    metadata = sources(indices[0]);
  } else if (ql === 10) {
    const pairs = [
      { correct: "CPI — household consumption prices", sourceRows: [indices[0]] },
      { correct: "WPI — wholesale price movement", sourceRows: [indices[1]] },
      { correct: "Core inflation — commonly excludes food and fuel", sourceRows: [concept("core")] },
    ];
    const row = pairs[rowIndex % pairs.length];
    stem = "Which pair is correctly matched?";
    options = moveCorrect([
      row.correct,
      "CPI — only wholesale prices",
      "WPI — household services only",
      "Deflation — a slower positive inflation rate",
    ], row.correct, correctTarget);
    correct = row.correct;
    explanation = `${row.correct} is correctly matched.`;
    metadata = sources(...row.sourceRows);
  } else if (ql === 11) {
    const cases = [
      {
        s1: "Inflation reduces purchasing power if money income does not keep pace with prices.",
        s2: "Deflation means a sustained fall in the general price level.",
        answer: "Both I and II",
        explanation: "Both statements are correct.",
      },
      {
        s1: "Disinflation means inflation has slowed.",
        s2: "Disinflation necessarily means the general price level is falling.",
        answer: "I only",
        explanation: "Disinflation is slower inflation; prices can still be rising.",
      },
      {
        s1: "Cost-push inflation can follow a broad rise in input costs.",
        s2: "Demand-pull inflation can arise when demand grows faster than available output.",
        answer: "Both I and II",
        explanation: "Both statements correctly describe the two sources of inflation.",
      },
    ];
    const row = cases[rowIndex % cases.length];
    stem = `Consider the statements:\nI. ${row.s1}\nII. ${row.s2}\nWhich is correct?`;
    correct = row.answer;
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept("inflation"), concept("deflation"), concept("disinflation"), concept("demand-pull"), concept("cost-push"));
  } else {
    const row = distinctionCases[rowIndex % distinctionCases.length];
    stem = row.stem;
    correct = row.answer;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(concept(row.answer === "Base effect" ? "base-effect" : row.answer === "Disinflation" ? "disinflation" : "deflation"));
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
