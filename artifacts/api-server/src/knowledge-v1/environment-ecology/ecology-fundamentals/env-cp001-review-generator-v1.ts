import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  ENV_CP001_DISTINCTION_PAIRS_V1,
  ENV_CP001_ORGANISATION_ROWS_V1,
  ENV_CP001_SCENARIO_ROWS_V1,
  ENV_CP001_TERM_ROWS_V1,
  getEnvCp001TermByName,
  type EnvCp001TermRow,
} from "./env-cp001-facts";
import type { EnvCp001ReviewQuestion } from "./env-cp001-review-types";

const terms = ENV_CP001_TERM_ROWS_V1;
const organisation = ENV_CP001_ORGANISATION_ROWS_V1;

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
  if ([1, 2, 3].includes(ql)) return "Easy";
  if ([4, 5, 6, 7, 8, 9, 10].includes(ql)) return "Medium";
  return "Hard";
};

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const candidates = deterministicShuffle([...new Set(values)], seed);
  const output = candidates.filter((value) => value !== correct).slice(0, 3);
  output.push(correct);
  return moveCorrect(deterministicShuffle(output, `${seed}:final`), correct, target);
}

function metadataFromRows(...rows: EnvCp001TermRow[]) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

const definitionPool = terms.map((row) => row.compactDefinition);
const termPool = terms.map((row) => row.term);
const basicLevelTerms = ["Organism", "Population", "Community", "Ecosystem"];

const habitatNicheCases = [
  {
    stem: "The forest in which a tiger normally lives describes its:",
    correct: "Habitat",
    explanation: "Habitat means the place where an organism lives. Its niche would describe its role, resource use and interactions there.",
  },
  {
    stem: "A bee's role as a pollinator and the resources it uses are part of its:",
    correct: "Ecological niche",
    explanation: "An ecological niche describes an organism's functional role, resource use and interactions; it is more than its physical living place.",
  },
  {
    stem: "For a freshwater fish, the pond where it lives is its:",
    correct: "Habitat",
    explanation: "The physical place where an organism lives is its habitat.",
  },
  {
    stem: "The feeding role and interactions of a vulture in an ecosystem describe its:",
    correct: "Ecological niche",
    explanation: "A niche describes how an organism functions in its environment, including feeding and interactions.",
  },
] as const;

const boundaryCases = [
  {
    stem: "What is the transition zone between two adjoining ecological communities called?",
    correct: "Ecotone",
    explanation: "An ecotone is the transition zone where two ecological communities or ecosystems meet.",
  },
  {
    stem: "The boundary between a forest and a grassland is itself best described as an:",
    correct: "Ecotone",
    explanation: "The transition boundary between adjoining ecological communities is an ecotone.",
  },
  {
    stem: "Greater diversity or abundance near the boundary of two habitats is commonly called:",
    correct: "Edge effect",
    explanation: "Edge effect is the boundary-related change in community structure, often seen as greater diversity or abundance near the edge.",
  },
  {
    stem: "A change in community composition caused by conditions at the meeting point of two habitats is an example of:",
    correct: "Edge effect",
    explanation: "The ecological change occurring at a habitat boundary is called the edge effect; the boundary zone itself is the ecotone.",
  },
] as const;

function organisationQuestion(index: number, target: number, qlId: string) {
  const sets = [
    ["Organism", "Population", "Community", "Ecosystem"],
    ["Population", "Community", "Ecosystem", "Biome"],
    ["Community", "Ecosystem", "Biome", "Biosphere"],
    ["Organism", "Community", "Biome", "Biosphere"],
  ];
  const selected = sets[index % sets.length];
  const ranked = selected
    .map((term) => getEnvCp001TermByName(term))
    .sort((a, b) => (a.levelRank ?? 0) - (b.levelRank ?? 0));
  const correct = ranked.map((row) => row.term).join(" → ");
  const variants = [
    correct,
    [ranked[1], ranked[0], ranked[2], ranked[3]].map((row) => row.term).join(" → "),
    [ranked[0], ranked[2], ranked[1], ranked[3]].map((row) => row.term).join(" → "),
    [...ranked].reverse().map((row) => row.term).join(" → "),
  ];
  return {
    stem: "Which option shows the correct order from a smaller to a broader level of ecological organisation?",
    correct,
    options: moveCorrect(deterministicShuffle(variants, `${qlId}:${index}`), correct, target),
    explanation: `The correct progression is ${correct}. Each successive level contains or integrates the preceding ecological level on a broader scale.`,
    rows: ranked,
  };
}

function neighbouringLevelQuestion(index: number, target: number, qlId: string) {
  const pairs = [
    ["Organism", "Population"],
    ["Population", "Community"],
    ["Community", "Ecosystem"],
    ["Biome", "Biosphere"],
  ] as const;
  const [lowerName, upperName] = pairs[index % pairs.length];
  const lower = getEnvCp001TermByName(lowerName);
  const upper = getEnvCp001TermByName(upperName);
  const correct = `${lower.term} → ${upper.term}`;
  const pairPool = [
    correct,
    `${upper.term} → ${lower.term}`,
    `${lower.term} → ${getEnvCp001TermByName("Biosphere").term}`,
    `${upper.term} → ${getEnvCp001TermByName("Organism").term}`,
  ];
  return {
    stem: `Which pair correctly moves from the narrower level to the broader level when comparing ${lower.term.toLowerCase()} and ${upper.term.toLowerCase()}?`,
    correct,
    options: moveCorrect(deterministicShuffle([...new Set(pairPool)], `${qlId}:${index}`), correct, target),
    explanation: `${lower.term} is narrower than ${upper.term}. ${upper.contrastHint}`,
    rows: [lower, upper],
  };
}

function makeQuestion(ql: number, localIndex: number, globalIndex: number): EnvCp001ReviewQuestion {
  const qlId = `ENV-001-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForQl(ql);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let sourceIds: string[] = [];
  let sourceFactIds: string[] = [];

  if (ql === 1) {
    const rows = [
      getEnvCp001TermByName("Population"),
      getEnvCp001TermByName("Community"),
      getEnvCp001TermByName("Ecosystem"),
      getEnvCp001TermByName("Biosphere"),
    ];
    const row = rows[localIndex % rows.length];
    stem = `Which ecological term means ${row.definition}?`;
    correct = row.term;
    options = chooseFour(termPool, correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} means ${row.compactDefinition}. ${row.contrastHint}`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(row));
  } else if (ql === 2) {
    const rows = [
      getEnvCp001TermByName("Ecology"),
      getEnvCp001TermByName("Habitat"),
      getEnvCp001TermByName("Ecological niche"),
      getEnvCp001TermByName("Biome"),
    ];
    const row = rows[localIndex % rows.length];
    stem = `What is meant by ${row.term.toLowerCase()}?`;
    correct = row.compactDefinition;
    options = chooseFour(definitionPool, correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} is the ${row.compactDefinition}. ${row.contrastHint}`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(row));
  } else if (ql === 3) {
    const scenario = ENV_CP001_SCENARIO_ROWS_V1[localIndex % ENV_CP001_SCENARIO_ROWS_V1.length];
    stem = scenario.scenario;
    correct = scenario.answerTerm;
    options = chooseFour(basicLevelTerms, correct, `${qlId}:${scenario.id}`, correctTarget);
    explanation = scenario.explanation;
    sourceIds = [...scenario.sourceIds];
    sourceFactIds = [...scenario.sourceFactIds];
  } else if (ql === 4) {
    const item = habitatNicheCases[localIndex % habitatNicheCases.length];
    stem = item.stem;
    correct = item.correct;
    options = moveCorrect(
      deterministicShuffle(["Habitat", "Ecological niche", "Population", "Community"], `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    );
    explanation = item.explanation;
    ({ sourceIds, sourceFactIds } = metadataFromRows(
      getEnvCp001TermByName("Habitat"),
      getEnvCp001TermByName("Ecological niche"),
    ));
  } else if (ql === 5) {
    const item = organisationQuestion(localIndex, correctTarget, qlId);
    stem = item.stem;
    correct = item.correct;
    options = item.options;
    explanation = item.explanation;
    ({ sourceIds, sourceFactIds } = metadataFromRows(...item.rows));
  } else if (ql === 6) {
    const item = neighbouringLevelQuestion(localIndex, correctTarget, qlId);
    stem = item.stem;
    correct = item.correct;
    options = item.options;
    explanation = item.explanation;
    ({ sourceIds, sourceFactIds } = metadataFromRows(...item.rows));
  } else if (ql === 7) {
    const item = boundaryCases[localIndex % boundaryCases.length];
    stem = item.stem;
    correct = item.correct;
    options = moveCorrect(
      deterministicShuffle(["Ecotone", "Edge effect", "Habitat", "Ecological niche"], `${qlId}:${localIndex}`),
      correct,
      correctTarget,
    );
    explanation = item.explanation;
    ({ sourceIds, sourceFactIds } = metadataFromRows(
      getEnvCp001TermByName("Ecotone"),
      getEnvCp001TermByName("Edge effect"),
    ));
  } else if (ql === 8) {
    const rows = [
      getEnvCp001TermByName("Species"),
      getEnvCp001TermByName("Population"),
      getEnvCp001TermByName("Ecosystem"),
      getEnvCp001TermByName("Biome"),
    ];
    const row = rows[localIndex % rows.length];
    correct = `${row.term} — ${row.compactDefinition}`;
    const wrongPairs = rows
      .filter((candidate) => candidate.term !== row.term)
      .map((candidate, offset) => {
        const donor = rows[(offset + localIndex + 1) % rows.length];
        return `${candidate.term} — ${donor.compactDefinition}`;
      })
      .filter((pair) => pair !== correct);
    stem = "Which of the following pairs is correctly matched?";
    options = chooseFour([correct, ...wrongPairs], correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.term} is correctly matched with “${row.compactDefinition}”.`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(...rows));
  } else if (ql === 9) {
    const rows = [
      getEnvCp001TermByName("Habitat"),
      getEnvCp001TermByName("Ecological niche"),
      getEnvCp001TermByName("Ecotone"),
      getEnvCp001TermByName("Edge effect"),
    ];
    const row = rows[localIndex % rows.length];
    let donor = rows[(localIndex + 1) % rows.length];
    if (donor.term === row.term) donor = rows[(localIndex + 2) % rows.length];
    correct = `${row.term} — ${donor.compactDefinition}`;
    const truePairs = rows
      .filter((candidate) => candidate.term !== row.term)
      .slice(0, 3)
      .map((candidate) => `${candidate.term} — ${candidate.compactDefinition}`);
    stem = "Which of the following pairs is incorrectly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...truePairs], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${donor.compactDefinition} describes ${donor.term}, not ${row.term}. ${row.term} means ${row.compactDefinition}.`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(row, donor, ...rows));
  } else if (ql === 10) {
    const cases = [
      ["Population", "Community"],
      ["Community", "Ecosystem"],
      ["Habitat", "Ecological niche"],
      ["Ecotone", "Edge effect"],
    ] as const;
    const [firstName, secondName] = cases[localIndex % cases.length];
    const first = getEnvCp001TermByName(firstName);
    const second = getEnvCp001TermByName(secondName);
    const mode = localIndex % 4;
    const firstTrue = mode === 0 || mode === 1;
    const secondTrue = mode === 0 || mode === 2;
    const firstText = firstTrue
      ? `${first.term} means ${first.compactDefinition}.`
      : `${first.term} means ${second.compactDefinition}.`;
    const secondText = secondTrue
      ? `${second.term} means ${second.compactDefinition}.`
      : `${second.term} means ${first.compactDefinition}.`;
    stem = `Consider the following statements:\nI. ${firstText}\nII. ${secondText}\nWhich of the statements given above is/are correct?`;
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
    const names = triples[localIndex % triples.length];
    const rows = names.map((name) => getEnvCp001TermByName(name));
    const falseAt = localIndex % 4;
    const statements = rows.map((row, index) => {
      if (falseAt < 3 && index === falseAt) {
        const donor = rows[(index + 1) % rows.length];
        return `${row.term} means ${donor.compactDefinition}.`;
      }
      return `${row.term} means ${row.compactDefinition}.`;
    });
    const count = falseAt < 3 ? 2 : 3;
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements given above are correct?`;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = rows.map((row) => `${row.term}: ${row.compactDefinition}.`).join(" ");
    ({ sourceIds, sourceFactIds } = metadataFromRows(...rows));
  } else {
    const [leftName, rightName] = ENV_CP001_DISTINCTION_PAIRS_V1[localIndex % ENV_CP001_DISTINCTION_PAIRS_V1.length];
    const left = getEnvCp001TermByName(leftName);
    const right = getEnvCp001TermByName(rightName);
    stem = `Which option correctly distinguishes ${left.term.toLowerCase()} from ${right.term.toLowerCase()}?`;
    correct = `${left.term}: ${left.compactDefinition}; ${right.term}: ${right.compactDefinition}`;
    const candidates = [
      correct,
      `${left.term}: ${right.compactDefinition}; ${right.term}: ${left.compactDefinition}`,
      `${left.term}: ${left.compactDefinition}; ${right.term}: ${getEnvCp001TermByName("Habitat").compactDefinition}`,
      `${left.term}: ${getEnvCp001TermByName("Biosphere").compactDefinition}; ${right.term}: ${right.compactDefinition}`,
    ];
    options = moveCorrect(deterministicShuffle([...new Set(candidates)], `${qlId}:${localIndex}`), correct, correctTarget);
    if (options.length < 4) {
      const fallback = `${left.term}: ${getEnvCp001TermByName("Ecology").compactDefinition}; ${right.term}: ${right.compactDefinition}`;
      options = moveCorrect([...new Set([...options, fallback])].slice(0, 4), correct, correctTarget);
    }
    explanation = `${left.term} means ${left.compactDefinition}, whereas ${right.term} means ${right.compactDefinition}.`;
    ({ sourceIds, sourceFactIds } = metadataFromRows(left, right));
  }

  return {
    questionId: `ENV-CP001-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ENV-001",
    cpId: "ENV-CP-001",
    qlId,
    qlName: qlNames[ql],
    difficulty,
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

export function generateEnvCp001ReviewBatchV1() {
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
