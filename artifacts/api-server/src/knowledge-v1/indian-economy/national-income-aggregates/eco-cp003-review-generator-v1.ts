import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP003_AGGREGATE_ROWS_V1,
  ECO_CP003_CONCEPT_ROWS_V1,
  ECO_CP003_NUMERICAL_CASES_V1,
} from "./eco-cp003-facts";
import type { EcoCp003ReviewQuestion } from "./eco-cp003-review-types";

const aggregates = ECO_CP003_AGGREGATE_ROWS_V1;
const concepts = ECO_CP003_CONCEPT_ROWS_V1;
const sourceIds = ["NCERT-MACRO-NIA", "MOSPI-NAS-CONCEPTS"];

const qlNames: Record<number, string> = {
  1: "Identify an aggregate from its meaning",
  2: "Identify the formula of an aggregate",
  3: "Apply the gross and net distinction",
  4: "Apply the domestic and national distinction",
  5: "Distinguish nominal GDP from real GDP",
  6: "Apply per-capita income",
  7: "Apply value added",
  8: "Solve a one-step aggregate relationship",
  9: "Identify a correctly matched aggregate pair",
  10: "Evaluate two statements about national-income aggregates",
  11: "Distinguish nearby aggregate concepts",
  12: "Apply market price and factor cost relationships",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if ([1, 2, 3].includes(ql)) return "Easy";
  if ([4, 5, 6, 7, 8, 9].includes(ql)) return "Medium";
  return "Hard";
};

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
  if (!row) throw new Error(`Unknown ECO-CP-003 concept ${id}`);
  return row;
}

const perCapitaCases = Object.freeze([
  { income: 800, population: 100, answer: "8" },
  { income: 1500, population: 300, answer: "5" },
  { income: 2400, population: 200, answer: "12" },
  { income: 3600, population: 400, answer: "9" },
]);

const valueAddedCases = Object.freeze([
  { output: 500, inputs: 200, answer: "300" },
  { output: 420, inputs: 120, answer: "300" },
  { output: 900, inputs: 350, answer: "550" },
]);

const distinctionRows = Object.freeze([
  {
    stem: "Which statement is correct?",
    correct: "Gross measures include depreciation; net measures exclude depreciation.",
    options: [
      "Gross measures include depreciation; net measures exclude depreciation.",
      "Net measures include depreciation twice.",
      "Gross and net differ only because of population.",
      "Gross and net mean the same thing.",
    ],
    rows: [aggregates[0], aggregates[2]],
  },
  {
    stem: "Which statement is correct?",
    correct: "Domestic refers to production within domestic territory; national adjusts for net factor income from abroad.",
    options: [
      "Domestic refers to production within domestic territory; national adjusts for net factor income from abroad.",
      "Domestic and national differ only because of depreciation.",
      "National always means current prices.",
      "Domestic always means constant prices.",
    ],
    rows: [aggregates[0], aggregates[1], concept("nfia")],
  },
  {
    stem: "Which statement is correct?",
    correct: "Nominal GDP uses current prices; real GDP uses constant prices.",
    options: [
      "Nominal GDP uses current prices; real GDP uses constant prices.",
      "Nominal GDP excludes depreciation; real GDP includes it.",
      "Real GDP is GDP plus NFIA.",
      "Nominal and real GDP always have the same value.",
    ],
    rows: [concept("nominal-gdp"), concept("real-gdp")],
  },
]);

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp003ReviewQuestion {
  const qlId = `ECO-003-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForQl(ql);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sources(aggregates[0]);

  if (ql === 1) {
    const row = aggregates[rowIndex % aggregates.length];
    stem = `Which aggregate means ${row.compactMeaning}?`;
    correct = row.term;
    options = moveCorrect(aggregates.map((item) => item.term), correct, correctTarget);
    explanation = `${row.term}: ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 2) {
    const row = aggregates[rowIndex % aggregates.length];
    stem = `Which formula is correct for ${row.term}?`;
    correct = row.formula;
    options = chooseFour(aggregates.map((item) => item.formula), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = row.formula + ".";
    metadata = sources(row);
  } else if (ql === 3) {
    const pair = rowIndex % 2 === 0 ? [aggregates[0], aggregates[2]] : [aggregates[1], aggregates[3]];
    const [gross, net] = pair;
    if (rowIndex < 2) {
      stem = `To change ${gross.term} into ${net.term}, what is deducted?`;
      correct = "Depreciation";
      options = moveCorrect(["Depreciation", "NFIA", "Population", "Subsidies"], correct, correctTarget);
      explanation = `${net.term} = ${gross.term} - Depreciation.`;
    } else {
      stem = `${gross.term} after deducting depreciation becomes:`;
      correct = net.term;
      options = moveCorrect(aggregates.map((item) => item.term), correct, correctTarget);
      explanation = `${gross.term} - Depreciation = ${net.term}.`;
    }
    metadata = sources(gross, net, concept("depreciation"));
  } else if (ql === 4) {
    const row = rowIndex % 2 === 0 ? aggregates[1] : aggregates[0];
    if (row.term === "GNP") {
      stem = "GDP plus net factor income from abroad gives:";
      correct = "GNP";
      options = moveCorrect(aggregates.map((item) => item.term), correct, correctTarget);
      explanation = "GNP = GDP + NFIA.";
    } else {
      stem = "Which item converts GDP into GNP?";
      correct = "Net factor income from abroad";
      options = moveCorrect(["Net factor income from abroad", "Depreciation", "Population", "Subsidies"], correct, correctTarget);
      explanation = "Add NFIA to GDP to get GNP.";
    }
    metadata = sources(aggregates[0], aggregates[1], concept("nfia"));
  } else if (ql === 5) {
    const nominal = concept("nominal-gdp");
    const real = concept("real-gdp");
    const nominalQuestion = rowIndex % 2 === 0;
    stem = nominalQuestion ? "GDP measured at current prices is called:" : "GDP measured at constant prices is called:";
    correct = nominalQuestion ? "Nominal GDP" : "Real GDP";
    options = moveCorrect(["Nominal GDP", "Real GDP", "NDP", "GNP"], correct, correctTarget);
    explanation = nominalQuestion ? "Nominal GDP uses current prices." : "Real GDP uses constant prices.";
    metadata = sources(nominal, real);
  } else if (ql === 6) {
    const row = perCapitaCases[rowIndex % perCapitaCases.length];
    stem = `National income is ${row.income} and population is ${row.population}. Per-capita income is:`;
    correct = row.answer;
    options = moveCorrect([row.answer, String(Number(row.answer) + 2), String(Number(row.answer) * 2), String(Math.max(1, Number(row.answer) - 2))], correct, correctTarget);
    explanation = `${row.income} / ${row.population} = ${row.answer}.`;
    metadata = sources(concept("per-capita-income"));
  } else if (ql === 7) {
    const row = valueAddedCases[rowIndex % valueAddedCases.length];
    stem = `Output is ${row.output} and intermediate inputs are ${row.inputs}. Value added is:`;
    correct = row.answer;
    options = moveCorrect([row.answer, String(row.output), String(row.inputs), String(row.output + row.inputs)], correct, correctTarget);
    explanation = `${row.output} - ${row.inputs} = ${row.answer}.`;
    metadata = sources(concept("value-added"));
  } else if (ql === 8) {
    const row = ECO_CP003_NUMERICAL_CASES_V1[rowIndex % ECO_CP003_NUMERICAL_CASES_V1.length];
    stem = row.stem;
    correct = row.answer;
    const value = Number(row.answer);
    options = moveCorrect([row.answer, String(value + 20), String(Math.max(0, value - 20)), String(value + 40)], correct, correctTarget);
    explanation = row.explanation;
    metadata = { sourceIds: [...sourceIds], sourceFactIds: [...row.sourceFactIds] };
  } else if (ql === 9) {
    const row = aggregates[rowIndex % aggregates.length];
    correct = `${row.term} — ${row.formula}`;
    const wrong = aggregates.filter((item) => item.id !== row.id).slice(0, 3).map((item) => `${item.term} — ${row.formula}`);
    stem = "Which pair is correctly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...wrong], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${row.term} is correctly matched with ${row.formula}.`;
    metadata = sources(row, ...aggregates.filter((item) => item.id !== row.id).slice(0, 3));
  } else if (ql === 10) {
    const cases = [
      { s1: "NDP = GDP - Depreciation.", s2: "GNP = GDP + NFIA.", answer: "Both I and II" },
      { s1: "NNP = GNP - Depreciation.", s2: "Real GDP is measured at current prices.", answer: "I only" },
      { s1: "Nominal GDP uses current prices.", s2: "Per-capita income equals national income divided by population.", answer: "Both I and II" },
    ];
    const row = cases[rowIndex % cases.length];
    stem = `Consider the statements:\nI. ${row.s1}\nII. ${row.s2}\nWhich is correct?`;
    correct = row.answer;
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = rowIndex % 3 === 1 ? "NNP = GNP - depreciation. Real GDP uses constant prices." : row.s1 + " " + row.s2;
    metadata = sources(...aggregates, concept("real-gdp"), concept("nominal-gdp"), concept("per-capita-income"));
  } else if (ql === 11) {
    const row = distinctionRows[rowIndex % distinctionRows.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.correct;
    metadata = sources(...row.rows);
  } else {
    const market = concept("market-price");
    const nit = concept("net-indirect-taxes");
    const cases = [
      {
        stem: "In the traditional exam relationship, market price equals:",
        correct: "Factor cost + Net indirect taxes",
        options: ["Factor cost + Net indirect taxes", "Factor cost - Depreciation", "GDP + Population", "Factor cost + NFIA"],
        explanation: "Market price = Factor cost + Net indirect taxes.",
      },
      {
        stem: "Net indirect taxes are:",
        correct: "Indirect taxes - Subsidies",
        options: ["Indirect taxes - Subsidies", "Indirect taxes + Subsidies", "Subsidies - Depreciation", "Taxes + NFIA"],
        explanation: "Net indirect taxes = Indirect taxes - Subsidies.",
      },
      {
        stem: "Factor cost is 400 and net indirect taxes are 30. Market price is:",
        correct: "430",
        options: ["430", "370", "400", "30"],
        explanation: "400 + 30 = 430.",
      },
    ];
    const row = cases[rowIndex % cases.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sources(market, nit);
  }

  return {
    questionId: `ECO-CP003-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-003",
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

export function generateEcoCp003ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 4,
    7: 3,
    8: 5,
    9: 3,
    10: 3,
    11: 3,
    12: 3,
  };

  const questions: EcoCp003ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 12; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
