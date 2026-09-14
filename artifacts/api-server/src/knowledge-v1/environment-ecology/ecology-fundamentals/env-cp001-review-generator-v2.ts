import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  ENV_CP001_ORGANISATION_ROWS_V1,
  ENV_CP001_SCENARIO_ROWS_V1,
  ENV_CP001_TERM_ROWS_V1,
  getEnvCp001TermByName,
  type EnvCp001TermRow,
} from "./env-cp001-facts";
import type { EnvCp001ReviewQuestion } from "./env-cp001-review-types";

const termRows = ENV_CP001_TERM_ROWS_V1;
const organisationRows = ENV_CP001_ORGANISATION_ROWS_V1;

const qlNames: Record<number, string> = {
  1: "Identify an ecological term from its meaning",
  2: "Identify the meaning of an ecological term",
  3: "Identify an ecological level from a situation",
  4: "Distinguish habitat from ecological niche",
  5: "Arrange levels of ecological organisation",
  6: "Compare neighbouring levels of ecological organisation",
  7: "Distinguish ecotone from edge effect",
  8: "Identify the correctly matched ecology pair",
  9: "Identify the incorrectly matched ecology pair",
  10: "Evaluate two statements about ecology fundamentals",
  11: "Count correct statements about ecology fundamentals",
  12: "Distinguish closely related ecology concepts",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if (ql <= 3) return "Easy";
  if (ql <= 10) return "Medium";
  return "Hard";
};

function moveCorrect(options: string[], correct: string, target: number) {
  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(`Expected four unique options for ${correct}`);
  }
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const unique = [...new Set(values)].filter((value) => value !== correct);
  if (unique.length < 3) throw new Error(`Insufficient distractors for ${correct}`);
  const distractors = deterministicShuffle(unique, seed).slice(0, 3);
  return moveCorrect(
    deterministicShuffle([...distractors, correct], `${seed}:final`),
    correct,
    target,
  );
}

function metadataFromRows(...rows: EnvCp001TermRow[]) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

const termNames = termRows.map((row) => row.term);
const definitions = termRows.map((row) => row.compactDefinition);
const basicLevels = ["Organism", "Population", "Community", "Ecosystem"];

const habitatNicheCases = [
  [
    "The forest in which a tiger normally lives describes its:",
    "Habitat",
    "Habitat means the place where an organism lives. Its niche describes its role, resource use and interactions there.",
  ],
  [
    "A bee's role as a pollinator and the resources it uses are part of its:",
    "Ecological niche",
    "An ecological niche describes an organism's functional role, resource use and interactions; it is more than its physical living place.",
  ],
  [
    "For a freshwater fish, the pond where it lives is its:",
    "Habitat",
    "The physical place where an organism lives is its habitat.",
  ],
  [
    "The feeding role and interactions of a vulture in an ecosystem describe its:",
    "Ecological niche",
    "A niche describes how an organism functions in its environment, including feeding and interactions.",
  ],
] as const;

const boundaryCases = [
  [
    "What is the transition zone between two adjoining ecological communities called?",
    "Ecotone",
    "An ecotone is the transition zone where two ecological communities or ecosystems meet.",
  ],
  [
    "The boundary between a forest and a grassland is itself best described as an:",
    "Ecotone",
    "The transition boundary between adjoining ecological communities is an ecotone.",
  ],
  [
    "Greater diversity or abundance near the boundary of two habitats is commonly called:",
    "Edge effect",
    "Edge effect is the boundary-related change in community structure, often seen as greater diversity or abundance near the edge.",
  ],
  [
    "A change in community composition caused by conditions at the meeting point of two habitats is an example of:",
    "Edge effect",
    "The ecological change occurring at a habitat boundary is called the edge effect; the boundary zone itself is the ecotone.",
  ],
] as const;

const correctPairRows = ["Species", "Population", "Ecosystem", "Biome"].map(getEnvCp001TermByName);
const incorrectPairRows = ["Habitat", "Ecological niche", "Ecotone", "Edge effect"].map(getEnvCp001TermByName);

function makeOrganisationQuestion(localIndex: number, qlId: string, correctTarget: number) {
  const levelSets = [
    ["Organism", "Population", "Community", "Ecosystem"],
    ["Population", "Community", "Ecosystem", "Biome"],
    ["Community", "Ecosystem", "Biome", "Biosphere"],
    ["Organism", "Community", "Biome", "Biosphere"],
  ];
  const selected = levelSets[localIndex].map(getEnvCp001TermByName)
    .sort((a, b) => (a.levelRank ?? 0) - (b.levelRank ?? 0));
  const correct = selected.map((row) => row.term).join(" → ");
  const distractors = [
    [selected[1], selected[0], selected[2], selected[3]],
    [selected[0], selected[2], selected[1], selected[3]],
    [...selected].reverse(),
  ].map((sequence) => sequence.map((row) => row.term).join(" → "));
  return {
    stem: "Which option shows the correct order from a smaller to a broader level of ecological organisation?",
    correct,
    options: moveCorrect(
      deterministicShuffle([correct, ...distractors], `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    ),
    explanation: `The correct progression is ${correct}. Each successive level represents a broader ecological organisation.`,
    rows: selected,
  };
}

function makeNeighbourQuestion(localIndex: number, qlId: string, correctTarget: number) {
  const pairs = [
    ["Organism", "Population"],
    ["Population", "Community"],
    ["Community", "Ecosystem"],
    ["Biome", "Biosphere"],
  ] as const;
  const [lowerName, upperName] = pairs[localIndex];
  const lower = getEnvCp001TermByName(lowerName);
  const upper = getEnvCp001TermByName(upperName);
  const correct = `${lower.term} → ${upper.term}`;
  const candidates = [
    correct,
    `${upper.term} → ${lower.term}`,
    "Organism → Biosphere",
    "Biosphere → Organism",
  ];
  return {
    stem: `When comparing ${lower.term.toLowerCase()} and ${upper.term.toLowerCase()}, which pair moves from the narrower to the broader level?`,
    correct,
    options: moveCorrect(
      deterministicShuffle(candidates, `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    ),
    explanation: `${lower.term} is the narrower level and ${upper.term} is the broader level.`,
    rows: [lower, upper],
  };
}

function makeCorrectPairQuestion(localIndex: number, qlId: string, correctTarget: number) {
  const answerRow = correctPairRows[localIndex];
  const correct = `${answerRow.term} — ${answerRow.compactDefinition}`;
  const distractors = correctPairRows
    .filter((row) => row.term !== answerRow.term)
    .map((row) => {
      const rowIndex = correctPairRows.indexOf(row);
      const donor = correctPairRows[(rowIndex + 1) % correctPairRows.length];
      return `${row.term} — ${donor.compactDefinition}`;
    });
  return {
    stem: "Which of the following pairs is correctly matched?",
    correct,
    options: moveCorrect(
      deterministicShuffle([correct, ...distractors], `${qlId}:${answerRow.id}`),
      correct,
      correctTarget,
    ),
    explanation: `${answerRow.term} means ${answerRow.compactDefinition}.`,
    rows: correctPairRows,
  };
}

function makeIncorrectPairQuestion(localIndex: number, qlId: string, correctTarget: number) {
  const answerRow = incorrectPairRows[localIndex];
  const donor = incorrectPairRows[(localIndex + 1) % incorrectPairRows.length];
  const correct = `${answerRow.term} — ${donor.compactDefinition}`;
  const truePairs = incorrectPairRows
    .filter((row) => row.term !== answerRow.term)
    .map((row) => `${row.term} — ${row.compactDefinition}`);
  return {
    stem: "Which of the following pairs is incorrectly matched?",
    correct,
    options: moveCorrect(
      deterministicShuffle([correct, ...truePairs], `${qlId}:${answerRow.id}`),
      correct,
      correctTarget,
    ),
    explanation: `${donor.compactDefinition} describes ${donor.term}, not ${answerRow.term}. ${answerRow.term} means ${answerRow.compactDefinition}.`,
    rows: incorrectPairRows,
  };
}

function makeQuestion(ql: number, localIndex: number, globalIndex: number): EnvCp001ReviewQuestion {
  const qlId = `ENV-001-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let sourceIds: string[] = [];
  let sourceFactIds: string[] = [];

  if (ql === 1) {
    const rows = ["Population", "Community", "Ecosystem", "Biosphere"].map(getEnvCp001TermByName);
    const row = rows[localIndex];
    stem = `Which ecological term means ${row.definition}?`;
    correct = row.term;
    options = chooseFour(termNames, correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} means ${row.compactDefinition}. ${row.contrastHint}`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(row));
  } else if (ql === 2) {
    const rows = ["Ecology", "Habitat", "Ecological niche", "Biome"].map(getEnvCp001TermByName);
    const row = rows[localIndex];
    stem = `What is meant by ${row.term.toLowerCase()}?`;
    correct = row.compactDefinition;
    options = chooseFour(definitions, correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} is the ${row.compactDefinition}. ${row.contrastHint}`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(row));
  } else if (ql === 3) {
    const scenarioIndexes = [0, 1, 3, 4];
    const scenario = ENV_CP001_SCENARIO_ROWS_V1[scenarioIndexes[localIndex]];
    stem = scenario.scenario;
    correct = scenario.answerTerm;
    options = chooseFour(basicLevels, correct, `${qlId}:${scenario.id}`, correctTarget);
    explanation = scenario.explanation;
    sourceIds = [...scenario.sourceIds];
    sourceFactIds = [...scenario.sourceFactIds];
  } else if (ql === 4) {
    const [caseStem, answer, caseExplanation] = habitatNicheCases[localIndex];
    stem = caseStem;
    correct = answer;
    options = moveCorrect(
      deterministicShuffle(["Habitat", "Ecological niche", "Population", "Community"], `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    );
    explanation = caseExplanation;
    ({ sourceIds, sourceFactIds } = metadataFromRows(
      getEnvCp001TermByName("Habitat"),
      getEnvCp001TermByName("Ecological niche"),
    ));
  } else if (ql === 5) {
    const item = makeOrganisationQuestion(localIndex, qlId, correctTarget);
    ({ stem, correct, options, explanation } = item);
    ({ sourceIds, sourceFactIds } = metadataFromRows(...item.rows));
  } else if (ql === 6) {
    const item = makeNeighbourQuestion(localIndex, qlId, correctTarget);
    ({ stem, correct, options, explanation } = item);
    ({ sourceIds, sourceFactIds } = metadataFromRows(...item.rows));
  } else if (ql === 7) {
    const [caseStem, answer, caseExplanation] = boundaryCases[localIndex];
    stem = caseStem;
    correct = answer;
    options = moveCorrect(
      deterministicShuffle(["Ecotone", "Edge effect", "Habitat", "Ecological niche"], `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    );
    explanation = caseExplanation;
    ({ sourceIds, sourceFactIds } = metadataFromRows(
      getEnvCp001TermByName("Ecotone"),
      getEnvCp001TermByName("Edge effect"),
    ));
  } else if (ql === 8) {
    const item = makeCorrectPairQuestion(localIndex, qlId, correctTarget);
    ({ stem, correct, options, explanation } = item);
    ({ sourceIds, sourceFactIds } = metadataFromRows(...item.rows));
  } else if (ql === 9) {
    const item = makeIncorrectPairQuestion(localIndex, qlId, correctTarget);
    ({ stem, correct, options, explanation } = item);
    ({ sourceIds, sourceFactIds } = metadataFromRows(...item.rows));
  } else if (ql === 10) {
    const pairs = [
      ["Population", "Community"],
      ["Community", "Ecosystem"],
      ["Habitat", "Ecological niche"],
      ["Ecotone", "Edge effect"],
    ] as const;
    const [firstName, secondName] = pairs[localIndex];
    const first = getEnvCp001TermByName(firstName);
    const second = getEnvCp001TermByName(secondName);
    const firstTrue = localIndex === 0 || localIndex === 1;
    const secondTrue = localIndex === 0 || localIndex === 2;
    const firstStatement = firstTrue
      ? `${first.term} means ${first.compactDefinition}.`
      : `${first.term} means ${second.compactDefinition}.`;
    const secondStatement = secondTrue
      ? `${second.term} means ${second.compactDefinition}.`
      : `${second.term} means ${first.compactDefinition}.`;
    stem = `Consider the following statements:\nI. ${firstStatement}\nII. ${secondStatement}\nWhich of the statements given above is/are correct?`;
    correct = firstTrue && secondTrue
      ? "Both I and II"
      : firstTrue
        ? "I only"
        : secondTrue
          ? "II only"
          : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `${first.term}: ${first.compactDefinition}. ${second.term}: ${second.compactDefinition}.`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(first, second));
  } else if (ql === 11) {
    const triples = [
      ["Organism", "Population", "Community"],
      ["Community", "Ecosystem", "Biome"],
      ["Habitat", "Ecological niche", "Ecotone"],
      ["Biome", "Biosphere", "Edge effect"],
    ] as const;
    const rows = triples[localIndex].map(getEnvCp001TermByName);
    const falseAt = localIndex;
    const statements = rows.map((row, index) => {
      if (falseAt < 3 && index === falseAt) {
        const donor = rows[(index + 1) % rows.length];
        return `${row.term} means ${donor.compactDefinition}.`;
      }
      return `${row.term} means ${row.compactDefinition}.`;
    });
    const correctCount = falseAt < 3 ? 2 : 3;
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements given above are correct?`;
    correct = ["None", "Only one", "Only two", "All three"][correctCount];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = rows.map((row) => `${row.term}: ${row.compactDefinition}.`).join(" ");
    ({ sourceIds, sourceFactIds } = metadataFromRows(...rows));
  } else {
    const distinctionPairs = [
      ["Population", "Community"],
      ["Community", "Ecosystem"],
      ["Habitat", "Ecological niche"],
      ["Ecotone", "Edge effect"],
    ] as const;
    const [leftName, rightName] = distinctionPairs[localIndex];
    const left = getEnvCp001TermByName(leftName);
    const right = getEnvCp001TermByName(rightName);
    const donorA = getEnvCp001TermByName("Population").compactDefinition === right.compactDefinition
      ? getEnvCp001TermByName("Biome")
      : getEnvCp001TermByName("Population");
    const donorB = getEnvCp001TermByName("Biosphere");
    stem = `Which option correctly distinguishes ${left.term.toLowerCase()} from ${right.term.toLowerCase()}?`;
    correct = `${left.term}: ${left.compactDefinition}; ${right.term}: ${right.compactDefinition}`;
    const candidates = [
      correct,
      `${left.term}: ${right.compactDefinition}; ${right.term}: ${left.compactDefinition}`,
      `${left.term}: ${left.compactDefinition}; ${right.term}: ${donorA.compactDefinition}`,
      `${left.term}: ${donorB.compactDefinition}; ${right.term}: ${right.compactDefinition}`,
    ];
    options = moveCorrect(
      deterministicShuffle(candidates, `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    );
    explanation = `${left.term} means ${left.compactDefinition}, whereas ${right.term} means ${right.compactDefinition}.`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(left, right));
  }

  return {
    questionId: `ENV-CP001-V2-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ENV-001",
    cpId: "ENV-CP-001",
    qlId,
    qlName: qlNames[ql],
    difficulty: difficultyForQl(ql),
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    sourceIds,
    sourceFactIds,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateEnvCp001ReviewBatchV2() {
  const questions: EnvCp001ReviewQuestion[] = [];
  let globalIndex = 0;

  for (let ql = 1; ql <= 12; ql += 1) {
    for (let localIndex = 0; localIndex < 4; localIndex += 1) {
      questions.push(makeQuestion(ql, localIndex, globalIndex));
      globalIndex += 1;
    }
  }

  return questions;
}

export const ENV_CP001_ORGANISATION_ORDER_V1 = Object.freeze(
  organisationRows.map((row) => row.term),
);
