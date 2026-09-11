import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import {
  GEO_RIV_001_CP010_FACTS_V1,
  GEO_RIV_001_CP010_PROJECT_ROWS_V1,
} from "./geo-riv-001-cp010-facts";
import type { GeoRiv001Cp010ReviewQuestion } from "./geo-riv-001-cp010-review-types";

export const GEO_RIV_001_CP010_QL_IDS_V1 = Object.freeze([
  "GEO-RIV-001-QL-083",
  "GEO-RIV-001-QL-084",
  "GEO-RIV-001-QL-085",
  "GEO-RIV-001-QL-086",
  "GEO-RIV-001-QL-087",
  "GEO-RIV-001-QL-088",
  "GEO-RIV-001-QL-089",
  "GEO-RIV-001-QL-090",
  "GEO-RIV-001-QL-091",
] as const);

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-083": "Dam/project to river",
  "GEO-RIV-001-QL-084": "River to dam/project",
  "GEO-RIV-001-QL-085": "Dam/project to state",
  "GEO-RIV-001-QL-086": "Dam/project to reservoir",
  "GEO-RIV-001-QL-087": "Reservoir to dam/project",
  "GEO-RIV-001-QL-088": "Correctly matched project-river pair",
  "GEO-RIV-001-QL-089": "Incorrectly matched project-state pair",
  "GEO-RIV-001-QL-090": "Mixed Statement I and II",
  "GEO-RIV-001-QL-091": "Three-statement mixed relation count",
};

const ROWS = GEO_RIV_001_CP010_PROJECT_ROWS_V1;
const FACTS = GEO_RIV_001_CP010_FACTS_V1 as readonly KnowledgeFact[];
const PROJECTS = ROWS.map((row) => row.project);
const RIVERS = [...new Set(ROWS.map((row) => row.river))];
const STATES = [...new Set(ROWS.flatMap((row) => [...row.states]))];
const RESERVOIRS = ROWS.map((row) => row.reservoir);

function unique<T>(values: readonly T[]) {
  return [...new Set(values)];
}

function displayRiver(river: string) {
  return river.startsWith("River ") ? river : `River ${river}`;
}

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return String(fact.value.value);
}

function factsFor(project: string, relation?: string) {
  return FACTS.filter((fact) => fact.entity.label.en === project && (!relation || fact.relation === relation));
}

function reservoirFact(reservoir: string) {
  return FACTS.find((fact) => fact.relation === "reservoir_on_river" && fact.entity.label.en === reservoir);
}

function rowForProject(project: string) {
  const row = ROWS.find((item) => item.project === project);
  if (!row) throw new Error(`Unknown CP010 project: ${project}`);
  return row;
}

function rowForReservoir(reservoir: string) {
  const row = ROWS.find((item) => item.reservoir === reservoir);
  if (!row) throw new Error(`Unknown CP010 reservoir: ${reservoir}`);
  return row;
}

function build(args: {
  qlId: string;
  seed: string;
  stem: string;
  answer: string;
  optionPool: readonly string[];
  explanation: string;
  facts: readonly KnowledgeFact[];
  difficulty: KnowledgeV1Difficulty;
  solverAuthority: GeoRiv001Cp010ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp010ReviewQuestion {
  const distractors = deterministicShuffle(
    unique(args.optionPool.filter((option) => option !== args.answer)),
    `${args.seed}:${args.qlId}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP010 requires three distractors for ${args.qlId}: ${args.answer}`);
  const rows = deterministicShuffle(
    [{ text: args.answer, correct: true }, ...distractors.map((text) => ({ text, correct: false }))],
    `${args.seed}:${args.qlId}:options`,
  );
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  assertKnowledgeQuestionValid({ stem: args.stem, explanation: args.explanation, options, correctIndex, canonicalAnswer: args.answer });
  return {
    questionId: `GEO-RIV-001-CP010-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP010",
    qlId: args.qlId,
    qlName: QL_NAMES[args.qlId] ?? args.qlId,
    difficulty: args.difficulty,
    stem: args.stem,
    options,
    correctIndex,
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: unique(args.facts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(args.facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function ql083(seed: string) {
  const row = deterministicPick(ROWS, `${seed}:row`);
  const answer = displayRiver(row.river);
  return build({
    qlId: "GEO-RIV-001-QL-083",
    seed,
    stem: `On which of the following rivers is ${row.project} built?`,
    answer,
    optionPool: RIVERS.map(displayRiver),
    explanation: `${row.project} is built on ${displayRiver(row.river)}. It creates ${row.reservoir}.`,
    facts: factsFor(row.project),
    difficulty: "Easy",
    solverAuthority: "PROJECT_RIVER_RELATION",
  });
}

const UNIQUE_RIVER_ROWS = ROWS.filter((row) => ROWS.filter((item) => item.river === row.river).length === 1);
function ql084(seed: string) {
  const row = deterministicPick(UNIQUE_RIVER_ROWS, `${seed}:row`);
  return build({
    qlId: "GEO-RIV-001-QL-084",
    seed,
    stem: `Which of the following dams/projects is built on ${displayRiver(row.river)}?`,
    answer: row.project,
    optionPool: PROJECTS,
    explanation: `${row.project} is built on ${displayRiver(row.river)} and is associated with ${row.reservoir}.`,
    facts: factsFor(row.project),
    difficulty: "Easy",
    solverAuthority: "UNIQUE_RIVER_TO_PROJECT",
  });
}

const UNIQUE_STATE_ROWS = ROWS.filter((row) => row.states.length === 1);
function ql085(seed: string) {
  const row = deterministicPick(UNIQUE_STATE_ROWS, `${seed}:row`);
  const answer = row.states[0];
  return build({
    qlId: "GEO-RIV-001-QL-085",
    seed,
    stem: `${row.project} is located in which of the following states?`,
    answer,
    optionPool: STATES,
    explanation: `${row.project} is in ${answer} and is built on ${displayRiver(row.river)}.`,
    facts: factsFor(row.project),
    difficulty: "Easy",
    solverAuthority: "PROJECT_STATE_RELATION",
  });
}

function ql086(seed: string) {
  const row = deterministicPick(ROWS, `${seed}:row`);
  return build({
    qlId: "GEO-RIV-001-QL-086",
    seed,
    stem: `Which reservoir is associated with ${row.project}?`,
    answer: row.reservoir,
    optionPool: RESERVOIRS,
    explanation: `${row.project} creates ${row.reservoir} on ${displayRiver(row.river)}.`,
    facts: factsFor(row.project),
    difficulty: "Easy",
    solverAuthority: "PROJECT_RESERVOIR_RELATION",
  });
}

function ql087(seed: string) {
  const row = deterministicPick(ROWS, `${seed}:row`);
  const extra = reservoirFact(row.reservoir);
  return build({
    qlId: "GEO-RIV-001-QL-087",
    seed,
    stem: `${row.reservoir} is associated with which of the following dams/projects?`,
    answer: row.project,
    optionPool: PROJECTS,
    explanation: `${row.reservoir} is the reservoir associated with ${row.project}, which is built on ${displayRiver(row.river)}.`,
    facts: [...factsFor(row.project), ...(extra ? [extra] : [])],
    difficulty: "Medium",
    solverAuthority: "RESERVOIR_PROJECT_RELATION",
  });
}

function pair(project: string, value: string) {
  return `${project} — ${value}`;
}

function ql088(seed: string) {
  const selected = deterministicShuffle(ROWS, `${seed}:rows`).slice(0, 4);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const options = selected.map((row, index) => {
    if (index === target) return pair(row.project, displayRiver(row.river));
    const wrongRivers = RIVERS.filter((river) => river !== row.river);
    return pair(row.project, displayRiver(deterministicPick(wrongRivers, `${seed}:wrong-river:${index}`)));
  });
  const row = selected[target];
  return build({
    qlId: "GEO-RIV-001-QL-088",
    seed,
    stem: "Select the correctly matched dam/project–river pair.",
    answer: options[target],
    optionPool: options,
    explanation: `${row.project} is built on ${displayRiver(row.river)}.`,
    facts: selected.flatMap((item) => factsFor(item.project, "project_on_river")),
    difficulty: "Medium",
    solverAuthority: "MATCHED_PROJECT_RIVER_VERIFIER",
  });
}

function ql089(seed: string) {
  const selected = deterministicShuffle(UNIQUE_STATE_ROWS, `${seed}:rows`).slice(0, 4);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const options = selected.map((row, index) => {
    if (index !== target) return pair(row.project, row.states[0]);
    const wrongStates = STATES.filter((state) => !row.states.includes(state));
    return pair(row.project, deterministicPick(wrongStates, `${seed}:wrong-state`));
  });
  const row = selected[target];
  return build({
    qlId: "GEO-RIV-001-QL-089",
    seed,
    stem: "Which one of the following dam/project–state pairs is incorrectly matched?",
    answer: options[target],
    optionPool: options,
    explanation: `${row.project} is located in ${row.states[0]}, not in the state shown in the selected pair. It is built on ${displayRiver(row.river)}.`,
    facts: selected.flatMap((item) => factsFor(item.project, "project_in_state")),
    difficulty: "Medium",
    solverAuthority: "MATCHED_PROJECT_STATE_VERIFIER",
  });
}

type Claim = { text: string; truth: boolean; explanation: string; facts: KnowledgeFact[] };

function riverClaim(row: (typeof ROWS)[number], truth: boolean, seed: string): Claim {
  const river = truth ? row.river : deterministicPick(RIVERS.filter((item) => item !== row.river), `${seed}:false-river`);
  return {
    text: `${row.project} is built on ${displayRiver(river)}.`,
    truth,
    explanation: truth
      ? `${row.project} is built on ${displayRiver(row.river)}.`
      : `${row.project} is built on ${displayRiver(row.river)}, not ${displayRiver(river)}.`,
    facts: factsFor(row.project, "project_on_river"),
  };
}

function stateClaim(row: (typeof ROWS)[number], truth: boolean, seed: string): Claim {
  const state = truth ? row.states[0] : deterministicPick(STATES.filter((item) => !row.states.includes(item)), `${seed}:false-state`);
  return {
    text: `${row.project} is located in ${state}.`,
    truth,
    explanation: truth
      ? `${row.project} is located in ${state}.`
      : `${row.project} is not located in ${state}; the project state in this corpus is ${row.states.join(" and ")}.`,
    facts: factsFor(row.project, "project_in_state"),
  };
}

function reservoirClaim(row: (typeof ROWS)[number], truth: boolean, seed: string): Claim {
  const reservoir = truth ? row.reservoir : deterministicPick(RESERVOIRS.filter((item) => item !== row.reservoir), `${seed}:false-reservoir`);
  return {
    text: `${row.project} is associated with ${reservoir}.`,
    truth,
    explanation: truth
      ? `${row.project} is associated with ${row.reservoir}.`
      : `${row.project} is associated with ${row.reservoir}, not ${reservoir}.`,
    facts: factsFor(row.project, "project_creates_reservoir"),
  };
}

const TWO_STATEMENT_OPTIONS = ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"];
function ql090(seed: string) {
  const rows = deterministicShuffle(UNIQUE_STATE_ROWS, `${seed}:rows`).slice(0, 2);
  const mode = deterministicPick([0, 1, 2, 3] as const, `${seed}:mode`);
  const first = riverClaim(rows[0], mode === 0 || mode === 1, `${seed}:I`);
  const second = stateClaim(rows[1], mode === 0 || mode === 2, `${seed}:II`);
  const answer = TWO_STATEMENT_OPTIONS[mode];
  return build({
    qlId: "GEO-RIV-001-QL-090",
    seed,
    stem: `With reference to dams and river projects in India, consider the following statements:\nI. ${first.text}\nII. ${second.text}\nWhich of the statements given above is/are correct?`,
    answer,
    optionPool: TWO_STATEMENT_OPTIONS,
    explanation: `Statement I: ${first.explanation} Statement II: ${second.explanation} Hence, ${answer.toLowerCase()}.`,
    facts: [...first.facts, ...second.facts],
    difficulty: "Medium",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

const COUNT_OPTIONS = ["None", "One", "Two", "Three"];
function ql091(seed: string) {
  const rows = deterministicShuffle(UNIQUE_STATE_ROWS, `${seed}:rows`).slice(0, 3);
  const targetCount = deterministicPick([0, 1, 2, 3] as const, `${seed}:count`);
  const truthFlags = deterministicShuffle(
    [true, true, true].map((value, index) => index < targetCount && value),
    `${seed}:truth-flags`,
  );
  const claims = [
    riverClaim(rows[0], truthFlags[0], `${seed}:1`),
    stateClaim(rows[1], truthFlags[1], `${seed}:2`),
    reservoirClaim(rows[2], truthFlags[2], `${seed}:3`),
  ];
  const answer = COUNT_OPTIONS[targetCount];
  return build({
    qlId: "GEO-RIV-001-QL-091",
    seed,
    stem: `Consider the following statements about dams and river projects:\n${claims.map((claim, index) => `${index + 1}. ${claim.text}`).join("\n")}\nHow many of the statements given above are correct?`,
    answer,
    optionPool: COUNT_OPTIONS,
    explanation: `${claims.map((claim, index) => `${index + 1}. ${claim.explanation}`).join(" ")} ${targetCount} of the three statements ${targetCount === 1 ? "is" : "are"} correct, so the answer is ${answer}.`,
    facts: claims.flatMap((claim) => claim.facts),
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp010ReviewV1(qlId: string, seed: string): GeoRiv001Cp010ReviewQuestion {
  switch (qlId) {
    case "GEO-RIV-001-QL-083": return ql083(seed);
    case "GEO-RIV-001-QL-084": return ql084(seed);
    case "GEO-RIV-001-QL-085": return ql085(seed);
    case "GEO-RIV-001-QL-086": return ql086(seed);
    case "GEO-RIV-001-QL-087": return ql087(seed);
    case "GEO-RIV-001-QL-088": return ql088(seed);
    case "GEO-RIV-001-QL-089": return ql089(seed);
    case "GEO-RIV-001-QL-090": return ql090(seed);
    case "GEO-RIV-001-QL-091": return ql091(seed);
    default: throw new Error(`Unsupported CP010 QL: ${qlId}`);
  }
}
