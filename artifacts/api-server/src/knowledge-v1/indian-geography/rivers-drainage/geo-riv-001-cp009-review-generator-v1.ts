import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1, GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1 } from "./geo-riv-001-cp009-facts";
import type { GeoRiv001Cp009ReviewQuestion } from "./geo-riv-001-cp009-review-types";

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-074": "Direct river to state",
  "GEO-RIV-001-QL-075": "Reverse state to river",
  "GEO-RIV-001-QL-076": "Source-state identification",
  "GEO-RIV-001-QL-077": "Multi-state course set",
  "GEO-RIV-001-QL-078": "Correctly matched river-state pair",
  "GEO-RIV-001-QL-079": "Incorrectly matched river-state pair",
  "GEO-RIV-001-QL-080": "Interstate course discrimination",
  "GEO-RIV-001-QL-081": "Statement I and II",
  "GEO-RIV-001-QL-082": "Multi-statement count",
};

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  if (fact.value.kind === "number") return `${fact.value.value}${fact.value.unit ? ` ${fact.value.unit}` : ""}`;
  if (fact.value.kind === "date") return fact.value.isoDate;
  return String(fact.value.value);
}

function upstreamFactId(fact: KnowledgeFact) {
  return fact.tags.find((tag) => tag.startsWith("upstream-fact:"))?.slice("upstream-fact:".length);
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
  solverAuthority: GeoRiv001Cp009ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp009ReviewQuestion {
  const distractors = deterministicShuffle(
    unique(args.optionPool.filter((option) => option !== args.answer)),
    `${args.seed}:${args.qlId}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP009 requires three distractors for ${args.qlId}: ${args.answer}`);
  const rows = deterministicShuffle(
    [{ text: args.answer, correct: true }, ...distractors.map((text) => ({ text, correct: false }))],
    `${args.seed}:${args.qlId}:options`,
  );
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  assertKnowledgeQuestionValid({ stem: args.stem, explanation: args.explanation, options, correctIndex, canonicalAnswer: args.answer });
  return {
    questionId: `GEO-RIV-001-CP009-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP009",
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
    upstreamFactIds: unique(args.facts.map(upstreamFactId).filter((id): id is string => Boolean(id))),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

const COURSE_FACTS = GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1 as readonly KnowledgeFact[];
const SOURCE_STATE_FACTS = GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1 as readonly KnowledgeFact[];
const RIVERS = unique(COURSE_FACTS.map((fact) => fact.entity.label.en));
const STATES = unique(COURSE_FACTS.map(valueText));

const statesByRiver = new Map<string, Set<string>>();
const factsByRiver = new Map<string, KnowledgeFact[]>();
const riversByState = new Map<string, Set<string>>();
for (const fact of COURSE_FACTS) {
  const river = fact.entity.label.en;
  const state = valueText(fact);
  const states = statesByRiver.get(river) ?? new Set<string>();
  states.add(state);
  statesByRiver.set(river, states);
  factsByRiver.set(river, [...(factsByRiver.get(river) ?? []), fact]);
  const rivers = riversByState.get(state) ?? new Set<string>();
  rivers.add(river);
  riversByState.set(state, rivers);
}

function courseSentence(river: string, state: string) {
  return `The ${river} flows through ${state}.`;
}

function sourceStateSentence(fact: KnowledgeFact) {
  const river = fact.entity.label.en;
  const state = valueText(fact);
  return fact.relation === "rises_in" ? `The ${river} rises in ${state}.` : `The ${river} originates in ${state}.`;
}

function falseStateFor(river: string, seed: string) {
  const trueStates = statesByRiver.get(river) ?? new Set<string>();
  const candidates = STATES.filter((state) => !trueStates.has(state));
  if (candidates.length < 3) throw new Error(`CP009 insufficient false states for ${river}`);
  return deterministicPick(candidates, `${seed}:false-state:${river}`);
}

function ql074(seed: string) {
  const fact = deterministicPick(COURSE_FACTS, `${seed}:fact`);
  const river = fact.entity.label.en;
  const answer = valueText(fact);
  const falseStates = STATES.filter((state) => !(statesByRiver.get(river) ?? new Set()).has(state));
  return build({
    qlId: "GEO-RIV-001-QL-074",
    seed,
    stem: `Which of the following states does the ${river} flow through?`,
    answer,
    optionPool: [answer, ...falseStates],
    explanation: courseSentence(river, answer),
    facts: [fact],
    difficulty: "Easy",
    solverAuthority: "COURSE_STATE_RELATION",
  });
}

const UNIQUE_STATE_FACTS = COURSE_FACTS.filter((fact) => (riversByState.get(valueText(fact))?.size ?? 0) === 1);

function ql075(seed: string) {
  const fact = deterministicPick(UNIQUE_STATE_FACTS, `${seed}:fact`);
  const state = valueText(fact);
  const river = fact.entity.label.en;
  return build({
    qlId: "GEO-RIV-001-QL-075",
    seed,
    stem: `Which of the following rivers flows through ${state}?`,
    answer: river,
    optionPool: RIVERS,
    explanation: courseSentence(river, state),
    facts: [fact],
    difficulty: "Easy",
    solverAuthority: "UNIQUE_STATE_TO_RIVER",
  });
}

const SOURCE_STATES = unique(SOURCE_STATE_FACTS.map(valueText));
function ql076(seed: string) {
  const fact = deterministicPick(SOURCE_STATE_FACTS, `${seed}:fact`);
  const river = fact.entity.label.en;
  const answer = valueText(fact);
  const optionPool = unique([...SOURCE_STATES, ...STATES]);
  return build({
    qlId: "GEO-RIV-001-QL-076",
    seed,
    stem: fact.relation === "rises_in" ? `The ${river} rises in which state?` : `The ${river} originates in which state?`,
    answer,
    optionPool,
    explanation: sourceStateSentence(fact),
    facts: [fact],
    difficulty: "Easy",
    solverAuthority: "SOURCE_STATE_RELATION",
  });
}

function orderedStateSet(river: string) {
  return [...(statesByRiver.get(river) ?? new Set<string>())].sort();
}

const COURSE_SET_RECORDS = RIVERS.map((river) => ({ river, states: orderedStateSet(river), facts: factsByRiver.get(river) ?? [] }));
const courseSetKey = (states: readonly string[]) => [...states].sort().join("|");
const courseSetFrequency = new Map<string, number>();
for (const record of COURSE_SET_RECORDS) courseSetFrequency.set(courseSetKey(record.states), (courseSetFrequency.get(courseSetKey(record.states)) ?? 0) + 1);
const UNIQUE_COURSE_SET_RECORDS = COURSE_SET_RECORDS.filter((record) => courseSetFrequency.get(courseSetKey(record.states)) === 1);

function ql077(seed: string) {
  const record = deterministicPick(UNIQUE_COURSE_SET_RECORDS, `${seed}:record`);
  const stateText = record.states.join(", ");
  return build({
    qlId: "GEO-RIV-001-QL-077",
    seed,
    stem: `Which river has its Indian main course through the following state set: ${stateText}?`,
    answer: record.river,
    optionPool: RIVERS,
    explanation: `In India, the ${record.river} flows through ${record.states.join(", ")}.`,
    facts: record.facts,
    difficulty: "Medium",
    solverAuthority: "COURSE_SET_VERIFIER",
  });
}

function pairLabel(river: string, state: string) {
  return `${river} — ${state}`;
}

function truePair(fact: KnowledgeFact) {
  return pairLabel(fact.entity.label.en, valueText(fact));
}

function falsePair(fact: KnowledgeFact, seed: string) {
  return pairLabel(fact.entity.label.en, falseStateFor(fact.entity.label.en, seed));
}

function distinctRiverFacts(seed: string, count: number) {
  const shuffled = deterministicShuffle(COURSE_FACTS, `${seed}:facts`);
  const selected: KnowledgeFact[] = [];
  const rivers = new Set<string>();
  for (const fact of shuffled) {
    const river = fact.entity.label.en;
    if (rivers.has(river)) continue;
    selected.push(fact);
    rivers.add(river);
    if (selected.length === count) break;
  }
  if (selected.length !== count) throw new Error(`CP009 could not select ${count} distinct river facts`);
  return selected;
}

function ql078(seed: string) {
  const facts = distinctRiverFacts(seed, 4);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const options = facts.map((fact, index) => index === target ? truePair(fact) : falsePair(fact, `${seed}:${index}`));
  return build({
    qlId: "GEO-RIV-001-QL-078",
    seed,
    stem: "Which of the following river-state pairs is correctly matched?",
    answer: options[target],
    optionPool: options,
    explanation: courseSentence(facts[target].entity.label.en, valueText(facts[target])),
    facts,
    difficulty: "Medium",
    solverAuthority: "MATCHED_RIVER_STATE_VERIFIER",
  });
}

function ql079(seed: string) {
  const facts = distinctRiverFacts(seed, 4);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const wrongState = falseStateFor(facts[target].entity.label.en, `${seed}:target`);
  const options = facts.map((fact, index) => index === target ? pairLabel(fact.entity.label.en, wrongState) : truePair(fact));
  return build({
    qlId: "GEO-RIV-001-QL-079",
    seed,
    stem: "Which of the following river-state pairs is incorrectly matched?",
    answer: options[target],
    optionPool: options,
    explanation: `The ${facts[target].entity.label.en} does not flow through ${wrongState}. Its reviewed Indian course states are ${orderedStateSet(facts[target].entity.label.en).join(", ")}.`,
    facts: factsByRiver.get(facts[target].entity.label.en) ?? [facts[target]],
    difficulty: "Medium",
    solverAuthority: "MATCHED_RIVER_STATE_VERIFIER",
  });
}

type InterstatePairRecord = { river: string; states: [string, string]; facts: KnowledgeFact[] };
const pairToRivers = new Map<string, Set<string>>();
const rawInterstatePairs: InterstatePairRecord[] = [];
for (const river of RIVERS) {
  const states = orderedStateSet(river);
  for (let i = 0; i < states.length; i += 1) {
    for (let j = i + 1; j < states.length; j += 1) {
      const pair: [string, string] = [states[i], states[j]];
      const key = pair.join("|");
      const rivers = pairToRivers.get(key) ?? new Set<string>();
      rivers.add(river);
      pairToRivers.set(key, rivers);
      rawInterstatePairs.push({
        river,
        states: pair,
        facts: (factsByRiver.get(river) ?? []).filter((fact) => pair.includes(valueText(fact))),
      });
    }
  }
}
const UNIQUE_INTERSTATE_PAIRS = rawInterstatePairs.filter((record) => pairToRivers.get(record.states.join("|"))?.size === 1);

function ql080(seed: string) {
  const record = deterministicPick(UNIQUE_INTERSTATE_PAIRS, `${seed}:record`);
  const [first, second] = record.states;
  const distractors = RIVERS.filter((river) => {
    const states = statesByRiver.get(river) ?? new Set<string>();
    return river !== record.river && !(states.has(first) && states.has(second));
  });
  return build({
    qlId: "GEO-RIV-001-QL-080",
    seed,
    stem: `Which river flows through both ${first} and ${second}?`,
    answer: record.river,
    optionPool: [record.river, ...distractors],
    explanation: `The ${record.river} flows through both ${first} and ${second}.`,
    facts: record.facts,
    difficulty: "Medium",
    solverAuthority: "INTERSTATE_PAIR_VERIFIER",
  });
}

const STATEMENT_OPTIONS = ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"];

function ql081(seed: string) {
  const [first, second] = distinctRiverFacts(`${seed}:statements`, 2);
  const mode = deterministicPick([0, 1, 2, 3] as const, `${seed}:mode`);
  const firstTrue = mode === 0 || mode === 1;
  const secondTrue = mode === 0 || mode === 2;
  const firstState = firstTrue ? valueText(first) : falseStateFor(first.entity.label.en, `${seed}:I`);
  const secondState = secondTrue ? valueText(second) : falseStateFor(second.entity.label.en, `${seed}:II`);
  const answer = STATEMENT_OPTIONS[mode];
  const explanation = `${firstTrue ? courseSentence(first.entity.label.en, valueText(first)) : `The ${first.entity.label.en} does not flow through ${firstState}; it does flow through ${valueText(first)}.`} ${secondTrue ? courseSentence(second.entity.label.en, valueText(second)) : `The ${second.entity.label.en} does not flow through ${secondState}; it does flow through ${valueText(second)}.`}`;
  return build({
    qlId: "GEO-RIV-001-QL-081",
    seed,
    stem: `Consider the following statements:\nI. The ${first.entity.label.en} flows through ${firstState}.\nII. The ${second.entity.label.en} flows through ${secondState}.`,
    answer,
    optionPool: STATEMENT_OPTIONS,
    explanation,
    facts: [first, second],
    difficulty: "Medium",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

const COUNT_OPTIONS = ["None", "One", "Two", "Three"];
function ql082(seed: string) {
  const facts = distinctRiverFacts(`${seed}:count`, 3);
  const trueCount = deterministicPick([0, 1, 2, 3] as const, `${seed}:count-mode`);
  const truthFlags = deterministicShuffle([0, 1, 2].map((index) => index < trueCount), `${seed}:flags`);
  const states = facts.map((fact, index) => truthFlags[index] ? valueText(fact) : falseStateFor(fact.entity.label.en, `${seed}:${index}`));
  const statements = facts.map((fact, index) => `${index + 1}. The ${fact.entity.label.en} flows through ${states[index]}.`);
  const explanation = facts.map((fact, index) => truthFlags[index]
    ? `${index + 1}. ${courseSentence(fact.entity.label.en, valueText(fact))}`
    : `${index + 1}. The ${fact.entity.label.en} does not flow through ${states[index]}; it does flow through ${valueText(fact)}.`).join(" ");
  return build({
    qlId: "GEO-RIV-001-QL-082",
    seed,
    stem: `How many of the following statements are correct?\n${statements.join("\n")}`,
    answer: COUNT_OPTIONS[trueCount],
    optionPool: COUNT_OPTIONS,
    explanation,
    facts,
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp009ReviewV1(qlId: string, seed: string): GeoRiv001Cp009ReviewQuestion {
  const generators: Record<string, (seed: string) => GeoRiv001Cp009ReviewQuestion> = {
    "GEO-RIV-001-QL-074": ql074,
    "GEO-RIV-001-QL-075": ql075,
    "GEO-RIV-001-QL-076": ql076,
    "GEO-RIV-001-QL-077": ql077,
    "GEO-RIV-001-QL-078": ql078,
    "GEO-RIV-001-QL-079": ql079,
    "GEO-RIV-001-QL-080": ql080,
    "GEO-RIV-001-QL-081": ql081,
    "GEO-RIV-001-QL-082": ql082,
  };
  const generator = generators[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP009 QL: ${qlId}`);
  return generator(seed);
}

export const GEO_RIV_001_CP009_QL_IDS_V1 = Object.freeze(Object.keys(QL_NAMES));
