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
    stem: "A farmer can grow wheat or mustard on the same field. He chooses wheat. What is the opportunity cost?",
    correct: "The benefit from growing mustard",
    options: [
      "The benefit from growing mustard",
      "The cost of wheat seed",
      "The value of all crops grown nearby",
      "The rent of every field he owns",
    ],
  },
  {
    stem: "A student can study Economics or History tonight and chooses Economics. What is the opportunity cost?",
    correct: "The benefit from studying History",
    options: [
      "The benefit from studying History",
      "The price of the Economics book",
      "All study time used during the year",
      "The student's total education cost",
    ],
  },
  {
    stem: "A factory uses a machine to make tables instead of chairs. What is the opportunity cost?",
    correct: "The value of the chairs not produced",
    options: [
      "The value of the chairs not produced",
      "The original price of the machine",
      "The wages of all factory workers",
      "The market value of all furniture",
    ],
  },
  {
    stem: "A local body funds a water project instead of a road project. What is the opportunity cost?",
    correct: "The benefit from the road project not chosen",
    options: [
      "The benefit from the road project not chosen",
      "The local body's full annual budget",
      "Only employee salaries",
      "The cost of every road in the state",
    ],
  },
]);

const scarcityScenarios = Object.freeze([
  "A town has limited water but many uses for it.",
  "A family has limited income but many wants.",
  "A government cannot fund every proposed project.",
  "A factory has limited labour and machines but can make several products.",
]);

const distinctionRows = Object.freeze([
  {
    stem: "Which statement about scarcity and opportunity cost is correct?",
    correct: "Scarcity forces choices; opportunity cost is the next best option given up.",
    options: [
      "Scarcity forces choices; opportunity cost is the next best option given up.",
      "Scarcity means unlimited resources; opportunity cost means unlimited wants.",
      "Scarcity applies only to money; opportunity cost applies only to goods.",
      "Scarcity and opportunity cost mean the same thing.",
    ],
    explanation: "Scarcity makes a choice necessary. Opportunity cost is the next best option given up.",
    conceptIds: ["scarcity", "opportunity-cost"],
  },
  {
    stem: "Which statement about demand and supply is correct?",
    correct: "Demand is about buyers; supply is about sellers.",
    options: [
      "Demand is about buyers; supply is about sellers.",
      "Demand means production; supply means consumption.",
      "Demand applies only to services; supply applies only to goods.",
      "Demand and supply refer only to government purchases.",
    ],
    explanation: "Demand comes from buyers. Supply comes from sellers.",
    conceptIds: ["demand", "supply"],
  },
  {
    stem: "Which statement about microeconomics and macroeconomics is correct?",
    correct: "Microeconomics studies individual units; macroeconomics studies the economy as a whole.",
    options: [
      "Microeconomics studies individual units; macroeconomics studies the economy as a whole.",
      "Microeconomics studies only government; macroeconomics studies only firms.",
      "Microeconomics deals only with money; macroeconomics deals only with goods.",
      "There is no difference between them.",
    ],
    explanation: "Microeconomics looks at individual units and markets. Macroeconomics looks at the whole economy.",
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
    stem = `Which term means: ${row.compactMeaning}?`;
    correct = row.term;
    options = chooseFour(concepts.map((candidate) => candidate.term), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}.`;
    metadata = sourceBundle(row);
  } else if (ql === 2) {
    const row = concepts[(rowIndex + 3) % concepts.length];
    stem = `What does ${row.term} mean?`;
    correct = row.compactMeaning;
    options = chooseFour(concepts.map((candidate) => candidate.compactMeaning), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}.`;
    metadata = sourceBundle(row);
  } else if (ql === 3) {
    const row = factors[rowIndex % factors.length];
    const example = row.examples[rowIndex % row.examples.length];
    stem = `${example} is an example of which factor of production?`;
    correct = row.factor;
    options = moveCorrect(factors.map((candidate) => candidate.factor), correct, correctTarget);
    explanation = `${example} is ${row.factor.toLowerCase()} because ${row.meaning}.`;
    metadata = sourceBundle(row);
  } else if (ql === 4) {
    const row = factors[rowIndex % factors.length];
    stem = `The reward for ${row.factor.toLowerCase()} is:`;
    correct = row.reward;
    options = moveCorrect(factors.map((candidate) => candidate.reward), correct, correctTarget);
    explanation = `${row.factor} earns ${row.reward.toLowerCase()} as its factor reward.`;
    metadata = sourceBundle(row);
  } else if (ql === 5) {
    const row = factors[rowIndex % factors.length];
    stem = `${row.reward} is the reward for:`;
    correct = row.factor;
    options = moveCorrect(factors.map((candidate) => candidate.factor), correct, correctTarget);
    explanation = `${row.reward} is the factor reward for ${row.factor.toLowerCase()}.`;
    metadata = sourceBundle(row);
  } else if (ql === 6) {
    const row = opportunityScenarios[rowIndex % opportunityScenarios.length];
    const concept = conceptById("opportunity-cost");
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = `Opportunity cost is the next best option given up. Here, it is ${correct.toLowerCase()}.`;
    metadata = sourceBundle(concept);
  } else if (ql === 7) {
    const scarcity = conceptById("scarcity");
    stem = `${scarcityScenarios[rowIndex % scarcityScenarios.length]} This is an example of:`;
    correct = "Scarcity";
    options = moveCorrect(["Scarcity", "Utility", "Supply", "Market"], correct, correctTarget);
    explanation = "Resources are limited but wants or uses are many. This is scarcity.";
    metadata = sourceBundle(scarcity);
  } else if (ql === 8) {
    const row = ECO_CP001_ACTIVITY_ROWS_V1[rowIndex % ECO_CP001_ACTIVITY_ROWS_V1.length];
    stem = `${row.stem} This is an example of:`;
    correct = row.answer;
    options = moveCorrect(["Production", "Consumption", "Distribution", "Exchange"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(row);
  } else if (ql === 9) {
    const row = ECO_CP001_BRANCH_SCENARIOS_V1[rowIndex % ECO_CP001_BRANCH_SCENARIOS_V1.length];
    stem = `${row.stem} This is studied under:`;
    correct = row.answer;
    options = moveCorrect(["Microeconomics", "Macroeconomics", "Economic history", "Public administration"], correct, correctTarget);
    explanation = correct === "Microeconomics"
      ? "Microeconomics studies individual consumers, firms and markets."
      : "Macroeconomics studies the economy as a whole and broad totals.";
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
    stem = "Which pair is correctly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...wrongPairs], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}.`;
    metadata = sourceBundle(row, ...donors);
  } else if (ql === 11) {
    const pairSets = [
      [conceptById("scarcity"), conceptById("opportunity-cost")],
      [conceptById("demand"), conceptById("supply")],
      [conceptById("microeconomics"), conceptById("macroeconomics")],
    ] as const;
    const [first, second] = pairSets[rowIndex % pairSets.length];
    const secondTrue = rowIndex % 3 !== 1;
    const firstStatement = `I. ${first.term} means ${first.compactMeaning}.`;
    const secondStatement = secondTrue
      ? `II. ${second.term} means ${second.compactMeaning}.`
      : `II. ${second.term} means ${first.compactMeaning}.`;
    stem = `Consider the statements:\n${firstStatement}\n${secondStatement}\nWhich is correct?`;
    correct = secondTrue ? "Both I and II" : "I only";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `${first.term}: ${first.compactMeaning}. ${second.term}: ${second.compactMeaning}.`;
    metadata = sourceBundle(first, second);
  } else {
    const row = distinctionRows[rowIndex % distinctionRows.length];
    const linked = row.conceptIds.map(conceptById);
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
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
