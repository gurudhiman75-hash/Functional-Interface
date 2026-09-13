import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP001_ACTIVITY_ROWS_V1,
  ECO_CP001_BRANCH_SCENARIOS_V1,
  ECO_CP001_CONCEPT_ROWS_V1,
  ECO_CP001_FACTOR_ROWS_V1,
} from "./eco-cp001-facts";
import type { EcoCp001ReviewQuestion } from "./eco-cp001-review-types";

const concepts = ECO_CP001_CONCEPT_ROWS_V1;
const factors = ECO_CP001_FACTOR_ROWS_V1;

const qlNames: Record<number, string> = {
  1: "Identify an economic term from its meaning",
  2: "Identify the meaning of an economic term",
  3: "Classify a factor of production from a scenario",
  4: "Match a factor of production with its reward",
  5: "Identify a factor from its reward",
  6: "Apply opportunity cost to a choice",
  7: "Apply scarcity and choice",
  8: "Identify an economic activity",
  9: "Distinguish microeconomics from macroeconomics",
  10: "Identify a correctly matched concept pair",
  11: "Evaluate two statements about basic economic concepts",
  12: "Distinguish closely related concepts",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if ([1, 2, 3, 4].includes(ql)) return "Easy";
  if ([5, 6, 7, 8, 9, 10].includes(ql)) return "Medium";
  return "Hard";
};

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const candidates = deterministicShuffle([...new Set(values)], seed)
    .filter((value) => value !== correct)
    .slice(0, 3);
  if (candidates.length !== 3) throw new Error(`Insufficient distractors for ${correct}`);
  return moveCorrect(
    deterministicShuffle([...candidates, correct], `${seed}:final`),
    correct,
    target,
  );
}

function sourceBundle(
  ...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]
) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

const opportunityScenarios = Object.freeze([
  {
    stem: "A farmer can use the same field for wheat or mustard. He chooses wheat. What is the opportunity cost of this choice?",
    correct: "The best alternative use of the field that was given up",
    options: [
      "The best alternative use of the field that was given up",
      "Only the money spent on wheat seed",
      "The total value of all crops grown in the district",
      "The rent of every field owned by the farmer",
    ],
  },
  {
    stem: "A student has time to prepare either Economics or History this evening and chooses Economics. What is the opportunity cost?",
    correct: "The benefit from the best alternative use of that time that was forgone",
    options: [
      "The benefit from the best alternative use of that time that was forgone",
      "The price of the Economics book",
      "All study time used during the year",
      "The student's total education expenditure",
    ],
  },
  {
    stem: "A factory uses a machine to produce tables instead of chairs. In economic terms, the opportunity cost is:",
    correct: "the value of the best forgone alternative output",
    options: [
      "the value of the best forgone alternative output",
      "the historical purchase price of the machine only",
      "the total wages paid by every factory",
      "the market price of all furniture",
    ],
  },
  {
    stem: "A local body spends a limited fund on a water project instead of its next-best road project. The opportunity cost is:",
    correct: "the benefit expected from the next-best road project that was given up",
    options: [
      "the benefit expected from the next-best road project that was given up",
      "the entire annual budget of the local body",
      "only the salaries of its employees",
      "the cost of every road project in the state",
    ],
  },
]);

const scarcityScenarios = Object.freeze([
  "A town has limited water but many competing household, farm and industrial uses.",
  "A family has limited income and must choose which wants to satisfy first.",
  "A government cannot fund every proposed project with the resources available.",
  "A factory has a fixed amount of labour and machinery but several possible products it could make.",
]);

const distinctionRows = Object.freeze([
  {
    stem: "Which statement correctly distinguishes scarcity from opportunity cost?",
    correct: "Scarcity creates the need to choose; opportunity cost is the next best alternative forgone because of the choice.",
    options: [
      "Scarcity creates the need to choose; opportunity cost is the next best alternative forgone because of the choice.",
      "Scarcity means unlimited resources; opportunity cost means unlimited wants.",
      "Scarcity applies only to money; opportunity cost applies only to goods.",
      "Scarcity and opportunity cost mean exactly the same thing.",
    ],
    conceptIds: ["scarcity", "opportunity-cost"],
  },
  {
    stem: "Which statement correctly distinguishes demand from supply?",
    correct: "Demand concerns buyers' willingness and ability to buy; supply concerns sellers' willingness and ability to offer for sale.",
    options: [
      "Demand concerns buyers' willingness and ability to buy; supply concerns sellers' willingness and ability to offer for sale.",
      "Demand is production by firms; supply is consumption by households.",
      "Demand applies only to services; supply applies only to goods.",
      "Demand and supply both refer only to government purchases.",
    ],
    conceptIds: ["demand", "supply"],
  },
  {
    stem: "Which statement correctly distinguishes microeconomics from macroeconomics?",
    correct: "Microeconomics studies individual units and markets; macroeconomics studies the economy as a whole and broad aggregates.",
    options: [
      "Microeconomics studies individual units and markets; macroeconomics studies the economy as a whole and broad aggregates.",
      "Microeconomics studies only government; macroeconomics studies only firms.",
      "Microeconomics deals only with money; macroeconomics deals only with goods.",
      "There is no difference between the two branches.",
    ],
    conceptIds: ["microeconomics", "macroeconomics"],
  },
]);

function conceptById(id: string) {
  const row = concepts.find((candidate) => candidate.id === id);
  if (!row) throw new Error(`Unknown ECO-CP-001 concept ${id}`);
  return row;
}

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp001ReviewQuestion {
  const qlId = `ECO-001-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForQl(ql);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sourceBundle(concepts[0]);

  if (ql === 1) {
    const row = concepts[rowIndex % concepts.length];
    stem = `Which term means ${row.definition}?`;
    correct = row.term;
    options = chooseFour(concepts.map((candidate) => candidate.term), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}.`;
    metadata = sourceBundle(row);
  } else if (ql === 2) {
    const row = concepts[(rowIndex + 3) % concepts.length];
    stem = `Which option best describes ${row.term}?`;
    correct = row.compactMeaning;
    options = chooseFour(concepts.map((candidate) => candidate.compactMeaning), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} refers to ${row.compactMeaning}.`;
    metadata = sourceBundle(row);
  } else if (ql === 3) {
    const row = factors[rowIndex % factors.length];
    const example = row.examples[rowIndex % row.examples.length];
    stem = `In production, ${example} is classified as which factor of production?`;
    correct = row.factor;
    options = moveCorrect(factors.map((candidate) => candidate.factor), correct, correctTarget);
    explanation = `${row.factor} means ${row.meaning}. Therefore, ${example} is classified as ${row.factor.toLowerCase()}.`;
    metadata = sourceBundle(row);
  } else if (ql === 4) {
    const row = factors[rowIndex % factors.length];
    stem = `What is the usual factor reward for ${row.factor.toLowerCase()}?`;
    correct = row.reward;
    options = moveCorrect(factors.map((candidate) => candidate.reward), correct, correctTarget);
    explanation = `${row.reward} is the usual reward assigned to ${row.factor.toLowerCase()} as a factor of production.`;
    metadata = sourceBundle(row);
  } else if (ql === 5) {
    const row = factors[rowIndex % factors.length];
    stem = `${row.reward} is normally treated as the reward for which factor of production?`;
    correct = row.factor;
    options = moveCorrect(factors.map((candidate) => candidate.factor), correct, correctTarget);
    explanation = `${row.reward} is the usual reward for ${row.factor.toLowerCase()}.`;
    metadata = sourceBundle(row);
  } else if (ql === 6) {
    const row = opportunityScenarios[rowIndex % opportunityScenarios.length];
    const concept = conceptById("opportunity-cost");
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = `Opportunity cost is the next best alternative forgone when a choice is made. Here, it is ${correct.toLowerCase()}.`;
    metadata = sourceBundle(concept);
  } else if (ql === 7) {
    const scarcity = conceptById("scarcity");
    stem = `${scarcityScenarios[rowIndex % scarcityScenarios.length]} Which basic economic problem does this illustrate most directly?`;
    correct = "Scarcity";
    options = moveCorrect(["Scarcity", "Utility", "Supply", "Market"], correct, correctTarget);
    explanation = "Resources are limited while there are competing uses for them. This is the basic problem of scarcity.";
    metadata = sourceBundle(scarcity);
  } else if (ql === 8) {
    const row = ECO_CP001_ACTIVITY_ROWS_V1[rowIndex % ECO_CP001_ACTIVITY_ROWS_V1.length];
    stem = `${row.stem} Which economic activity is illustrated?`;
    correct = row.answer;
    options = moveCorrect(["Production", "Consumption", "Distribution", "Exchange"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(row);
  } else if (ql === 9) {
    const row = ECO_CP001_BRANCH_SCENARIOS_V1[rowIndex % ECO_CP001_BRANCH_SCENARIOS_V1.length];
    stem = `${row.stem} This is mainly a question of:`;
    correct = row.answer;
    options = moveCorrect(["Microeconomics", "Macroeconomics", "Economic history", "Public administration"], correct, correctTarget);
    explanation = correct === "Microeconomics"
      ? "The question concerns an individual consumer, firm or particular market, so it falls under microeconomics."
      : "The question concerns the economy as a whole or a broad aggregate, so it falls under macroeconomics.";
    metadata = sourceBundle(row);
  } else if (ql === 10) {
    const row = concepts[(rowIndex * 2) % concepts.length];
    const wrongRows = concepts.filter((candidate) => candidate.id !== row.id).slice(rowIndex, rowIndex + 3);
    const fallback = concepts.filter((candidate) => candidate.id !== row.id).slice(0, 3);
    const donors = wrongRows.length === 3 ? wrongRows : fallback;
    correct = `${row.term} — ${row.compactMeaning}`;
    const wrongPairs = donors.map((candidate, offset) => {
      const donor = concepts[(concepts.indexOf(candidate) + offset + 2) % concepts.length];
      return `${candidate.term} — ${donor.compactMeaning}`;
    });
    stem = "Which of the following pairs is correctly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...wrongPairs], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${row.term} is correctly matched with ${row.compactMeaning}.`;
    metadata = sourceBundle(row, ...donors);
  } else if (ql === 11) {
    const pairSets = [
      [conceptById("scarcity"), conceptById("opportunity-cost")],
      [conceptById("demand"), conceptById("supply")],
      [conceptById("microeconomics"), conceptById("macroeconomics")],
    ] as const;
    const [first, second] = pairSets[rowIndex % pairSets.length];
    const mode = rowIndex % 3;
    const firstStatement = `I. ${first.term} refers to ${first.compactMeaning}.`;
    const secondStatement = mode === 1
      ? `II. ${second.term} refers to ${first.compactMeaning}.`
      : `II. ${second.term} refers to ${second.compactMeaning}.`;
    const firstTrue = true;
    const secondTrue = mode !== 1;
    stem = `Consider the following statements:\n${firstStatement}\n${secondStatement}\nWhich of the statements given above is/are correct?`;
    correct = secondTrue ? "Both I and II" : "I only";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `${first.term} means ${first.compactMeaning}. ${second.term} means ${second.compactMeaning}.`;
    metadata = sourceBundle(first, second);
  } else {
    const row = distinctionRows[rowIndex % distinctionRows.length];
    const linked = row.conceptIds.map(conceptById);
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.correct;
    metadata = sourceBundle(...linked);
  }

  return {
    questionId: `ECO-CP001-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-001",
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

export function generateEcoCp001ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 4,
    7: 4,
    8: 3,
    9: 3,
    10: 3,
    11: 3,
    12: 2,
  };

  const questions: EcoCp001ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 12; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
