import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import type { GeoRiv001Cp007ReviewQuestion } from "./geo-riv-001-cp007-review-types";

const FACTS = GEO_RIV_001_CP007_PROJECTED_FACTS_V1;
const UPSTREAMS = ["cp002", "cp003", "cp004", "cp005"] as const;

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-055": "Direct tributary-parent relation",
  "GEO-RIV-001-QL-056": "Reverse tributary identification",
  "GEO-RIV-001-QL-057": "Confluence place",
  "GEO-RIV-001-QL-058": "Formation and headstream relation",
  "GEO-RIV-001-QL-059": "Bank-side tributary grouping",
  "GEO-RIV-001-QL-060": "Correctly matched pair",
  "GEO-RIV-001-QL-061": "Incorrectly matched pair",
  "GEO-RIV-001-QL-062": "River relation chain",
  "GEO-RIV-001-QL-063": "Statement I and II",
  "GEO-RIV-001-QL-064": "Multi-statement count",
};

function unique(items: readonly string[]) {
  return [...new Set(items)];
}

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  if (fact.value.kind === "number") return `${fact.value.value}${fact.value.unit ? ` ${fact.value.unit}` : ""}`;
  if (fact.value.kind === "date") return fact.value.isoDate;
  return String(fact.value.value);
}

function upstreamOf(fact: KnowledgeFact) {
  return fact.tags.find((tag) => tag.startsWith("upstream:"))?.slice("upstream:".length) ?? "unknown";
}

function upstreamFactId(fact: KnowledgeFact) {
  return fact.tags.find((tag) => tag.startsWith("upstream-fact:"))?.slice("upstream-fact:".length) ?? "unknown";
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
  solverAuthority: GeoRiv001Cp007ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp007ReviewQuestion {
  const distractors = deterministicShuffle(
    unique(args.optionPool.filter((option) => option !== args.answer)),
    `${args.seed}:${args.qlId}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP007 requires three distractors for ${args.qlId}: ${args.answer}`);
  const rows = deterministicShuffle(
    [{ text: args.answer, correct: true }, ...distractors.map((text) => ({ text, correct: false }))],
    `${args.seed}:${args.qlId}:options`,
  );
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  assertKnowledgeQuestionValid({ stem: args.stem, explanation: args.explanation, options, correctIndex, canonicalAnswer: args.answer });
  return {
    questionId: `GEO-RIV-001-CP007-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP007",
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
    upstreamFactIds: unique(args.facts.map(upstreamFactId)),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

const BASIC_PARENT_RELATIONS = new Set([
  "main_tributary_of",
  "tributary_of",
  "principal_tributary_of",
  "tributary_of_brahmaputra_system",
  "headstream_of",
  "source_stream_of",
]);

type ParentRecord = { fact: KnowledgeFact; river: string; parent: string; relation: string; upstream: string };

const PARENT_RECORDS: ParentRecord[] = FACTS.filter(
  (fact) => BASIC_PARENT_RELATIONS.has(fact.relation) && fact.value.kind === "entity_ref",
).map((fact) => ({
  fact,
  river: fact.entity.label.en,
  parent: valueText(fact),
  relation: fact.relation,
  upstream: upstreamOf(fact),
}));

const PARENT_LABELS = unique(PARENT_RECORDS.map((record) => record.parent));
const TRIBUTARY_RECORDS = PARENT_RECORDS.filter((record) => /tributary/.test(record.relation));

const parentsByRiver = new Map<string, Set<string>>();
for (const record of [...PARENT_RECORDS]) {
  const set = parentsByRiver.get(record.river) ?? new Set<string>();
  set.add(record.parent);
  parentsByRiver.set(record.river, set);
}

function balancedPick<T extends { upstream: string }>(records: readonly T[], seed: string) {
  const upstream = deterministicPick(UPSTREAMS, `${seed}:upstream`);
  const subset = records.filter((record) => record.upstream === upstream);
  return deterministicPick(subset.length ? subset : records, `${seed}:record`);
}

function parentExplanation(record: ParentRecord) {
  if (record.relation === "headstream_of") return `${record.river} is a headstream of the ${record.parent}.`;
  if (record.relation === "source_stream_of") return `${record.river} is the source stream of the ${record.parent}.`;
  if (record.relation === "main_tributary_of" || record.relation === "principal_tributary_of") return `${record.river} is a major tributary of the ${record.parent}.`;
  return `${record.river} is a tributary of the ${record.parent}.`;
}

function ql055(seed: string) {
  const record = balancedPick(PARENT_RECORDS, seed);
  const relationPhrase = record.relation === "headstream_of"
    ? "a headstream of"
    : record.relation === "source_stream_of"
      ? "the source stream of"
      : "a tributary of";
  return build({
    qlId: "GEO-RIV-001-QL-055",
    seed,
    stem: `${record.river} is ${relationPhrase} which river?`,
    answer: record.parent,
    optionPool: PARENT_LABELS,
    explanation: parentExplanation(record),
    facts: [record.fact],
    difficulty: record.fact.difficulty === "Hard" ? "Medium" : record.fact.difficulty,
    solverAuthority: "CANONICAL_PARENT_RELATION",
  });
}

function ql056(seed: string) {
  const target = balancedPick(TRIBUTARY_RECORDS, seed);
  const safeDistractors = unique(
    TRIBUTARY_RECORDS
      .filter((record) => record.river !== target.river && !parentsByRiver.get(record.river)?.has(target.parent))
      .map((record) => record.river),
  );
  return build({
    qlId: "GEO-RIV-001-QL-056",
    seed,
    stem: `Which of the following is a tributary of the ${target.parent}?`,
    answer: target.river,
    optionPool: [target.river, ...safeDistractors],
    explanation: parentExplanation(target),
    facts: [target.fact],
    difficulty: target.fact.difficulty === "Hard" ? "Medium" : target.fact.difficulty,
    solverAuthority: "CANONICAL_PARENT_RELATION",
  });
}

type ConfluenceRecord = {
  fact: KnowledgeFact;
  river: string;
  joinedRiver: string;
  place: string;
  formedBy?: string;
  upstream: string;
};

function pairLabel(value: string) {
  return value.replace(/\s*\+\s*/g, " and ");
}

function directJoinFor(entityId: string) {
  return FACTS.find((fact) => fact.entityId === entityId && fact.relation === "joins_river" && fact.value.kind === "entity_ref");
}

function parentFor(entityId: string) {
  return PARENT_RECORDS.find((record) => record.fact.entityId === entityId);
}

const CONFLUENCE_RECORDS: ConfluenceRecord[] = FACTS.filter((fact) =>
  ["joins_river_at", "joins_parent_near", "formed_at"].includes(fact.relation),
).flatMap((fact) => {
  if (fact.relation === "formed_at") {
    const formedBy = FACTS.find((candidate) => candidate.entityId === fact.entityId && candidate.relation === "formed_by");
    if (!formedBy) return [];
    return [{
      fact,
      river: fact.entity.label.en,
      joinedRiver: fact.entity.label.en,
      place: valueText(fact),
      formedBy: pairLabel(valueText(formedBy)),
      upstream: upstreamOf(fact),
    }];
  }
  const directJoin = directJoinFor(fact.entityId);
  const parent = parentFor(fact.entityId);
  const joinedRiver = directJoin ? valueText(directJoin) : parent?.parent;
  if (!joinedRiver) return [];
  return [{
    fact,
    river: fact.entity.label.en,
    joinedRiver,
    place: valueText(fact),
    upstream: upstreamOf(fact),
  }];
});

const CONFLUENCE_PLACES = unique(CONFLUENCE_RECORDS.map((record) => record.place));

function ql057(seed: string) {
  const record = balancedPick(CONFLUENCE_RECORDS, seed);
  const stem = record.formedBy
    ? `At which place do ${record.formedBy} meet to form the ${record.river}?`
    : record.fact.relation === "joins_parent_near"
      ? `${record.river} joins the ${record.joinedRiver} near which location?`
      : `At which place does ${record.river} join the ${record.joinedRiver}?`;
  const explanation = record.formedBy
    ? `${record.formedBy} meet at ${record.place} to form the ${record.river}.`
    : `${record.river} joins the ${record.joinedRiver} at ${record.place}.`;
  return build({
    qlId: "GEO-RIV-001-QL-057",
    seed,
    stem,
    answer: record.place,
    optionPool: CONFLUENCE_PLACES,
    explanation,
    facts: [record.fact],
    difficulty: "Medium",
    solverAuthority: "CONFLUENCE_PLACE_VERIFIER",
  });
}

type FormationRecord = { fact: KnowledgeFact; river: string; pair: string; upstream: string };
const FORMATION_RECORDS: FormationRecord[] = FACTS.filter((fact) => fact.relation === "formed_by").map((fact) => ({
  fact,
  river: fact.entity.label.en,
  pair: pairLabel(valueText(fact)),
  upstream: upstreamOf(fact),
}));
const FORMATION_RIVERS = unique(FORMATION_RECORDS.map((record) => record.river));
const FORMATION_PAIRS = unique(FORMATION_RECORDS.map((record) => record.pair));

function ql058(seed: string) {
  const record = balancedPick(FORMATION_RECORDS, seed);
  const reverse = deterministicPick([true, false] as const, `${seed}:direction`);
  return reverse
    ? build({
        qlId: "GEO-RIV-001-QL-058",
        seed,
        stem: `${record.pair} combine to form which river?`,
        answer: record.river,
        optionPool: FORMATION_RIVERS,
        explanation: `${record.pair} combine to form the ${record.river}.`,
        facts: [record.fact],
        difficulty: "Medium",
        solverAuthority: "FORMATION_RELATION_VERIFIER",
      })
    : build({
        qlId: "GEO-RIV-001-QL-058",
        seed,
        stem: `Which rivers or streams combine to form the ${record.river}?`,
        answer: record.pair,
        optionPool: FORMATION_PAIRS,
        explanation: `${record.pair} combine to form the ${record.river}.`,
        facts: [record.fact],
        difficulty: "Medium",
        solverAuthority: "FORMATION_RELATION_VERIFIER",
      });
}

type BankRecord = { fact: KnowledgeFact; river: string; parent: string; bank: string; upstream: string };
const BANK_RECORDS: BankRecord[] = FACTS.flatMap((fact) => {
  if ((fact.relation === "left_bank_tributary_of" || fact.relation === "right_bank_tributary_of") && fact.value.kind === "entity_ref") {
    return [{ fact, river: fact.entity.label.en, parent: valueText(fact), bank: fact.relation.startsWith("left") ? "left bank" : "right bank", upstream: upstreamOf(fact) }];
  }
  if (fact.relation === "joins_ganga_from_bank" && fact.value.kind === "text") {
    return [{ fact, river: fact.entity.label.en, parent: "Ganga", bank: valueText(fact), upstream: upstreamOf(fact) }];
  }
  if (fact.relation === "brahmaputra_bank_side" && fact.value.kind === "text") {
    return [{ fact, river: fact.entity.label.en, parent: "Brahmaputra", bank: valueText(fact), upstream: upstreamOf(fact) }];
  }
  return [];
});

const USABLE_BANK_RECORDS = BANK_RECORDS.filter((record) =>
  unique(BANK_RECORDS.filter((other) => other.parent === record.parent && other.bank !== record.bank).map((other) => other.river)).length >= 3,
);

function ql059(seed: string) {
  const record = balancedPick(USABLE_BANK_RECORDS, seed);
  const opposite = unique(BANK_RECORDS.filter((other) => other.parent === record.parent && other.bank !== record.bank).map((other) => other.river));
  const bankLabel = record.bank.replace(" bank", "-bank");
  return build({
    qlId: "GEO-RIV-001-QL-059",
    seed,
    stem: `Which of the following is a ${bankLabel} tributary of the ${record.parent}?`,
    answer: record.river,
    optionPool: [record.river, ...opposite],
    explanation: `${record.river} is a ${bankLabel} tributary of the ${record.parent}.`,
    facts: [record.fact],
    difficulty: "Medium",
    solverAuthority: "BANK_GROUP_VERIFIER",
  });
}

function truePair(record: ParentRecord) {
  return `${record.river} — ${record.parent}`;
}

function wrongParent(record: ParentRecord, seed: string) {
  const forbidden = parentsByRiver.get(record.river) ?? new Set<string>();
  return deterministicPick(PARENT_LABELS.filter((parent) => !forbidden.has(parent)), `${seed}:wrong-parent`);
}

function falsePair(record: ParentRecord, seed: string) {
  return `${record.river} — ${wrongParent(record, seed)}`;
}

function ql060(seed: string) {
  const target = balancedPick(TRIBUTARY_RECORDS, seed);
  const falsePairs = unique(TRIBUTARY_RECORDS
    .filter((record) => record.river !== target.river)
    .map((record, index) => falsePair(record, `${seed}:false:${index}`)));
  return build({
    qlId: "GEO-RIV-001-QL-060",
    seed,
    stem: "Which of the following pairs is correctly matched?",
    answer: truePair(target),
    optionPool: [truePair(target), ...falsePairs],
    explanation: parentExplanation(target),
    facts: [target.fact],
    difficulty: "Medium",
    solverAuthority: "MATCHED_PAIR_VERIFIER",
  });
}

function ql061(seed: string) {
  const target = balancedPick(TRIBUTARY_RECORDS, seed);
  const answer = falsePair(target, seed);
  const actualPairs = unique(TRIBUTARY_RECORDS
    .filter((record) => record.river !== target.river)
    .map(truePair));
  const wrong = answer.split(" — ")[1];
  return build({
    qlId: "GEO-RIV-001-QL-061",
    seed,
    stem: "Which of the following pairs is incorrectly matched?",
    answer,
    optionPool: [answer, ...actualPairs],
    explanation: `${target.river} is a tributary of the ${target.parent}, not the ${wrong}.`,
    facts: [target.fact],
    difficulty: "Medium",
    solverAuthority: "MATCHED_PAIR_VERIFIER",
  });
}

function needFact(entity: string, relation: string, valueIncludes?: string) {
  const fact = FACTS.find((candidate) =>
    candidate.entity.label.en === entity &&
    candidate.relation === relation &&
    (!valueIncludes || valueText(candidate).includes(valueIncludes)),
  );
  if (!fact) throw new Error(`Missing CP007 canonical relation: ${entity} ${relation} ${valueIncludes ?? ""}`);
  return fact;
}

function chainModes() {
  const jhelumChenab = needFact("Jhelum", "joins_river", "Chenab");
  const satlujChenab = needFact("Satluj", "joins_river", "Chenab");
  const beasSatluj = needFact("Beas", "joins_river", "Satluj");
  const chenabFormation = needFact("Chenab", "formed_by");
  const gangaFormation = needFact("Ganga", "formed_by");
  const gangaDevprayag = needFact("Ganga", "formed_at", "Devprayag");
  const dhauliAlaknanda = needFact("Dhauliganga", "tributary_of", "Alaknanda");
  const dhauliVishnu = needFact("Dhauliganga", "joins_river_at", "Vishnuprayag");
  const nandaAlaknanda = needFact("Nandakini", "tributary_of", "Alaknanda");
  const nandaPrayag = needFact("Nandakini", "joins_river_at", "Nandprayag");
  const dibang = needFact("Dibang", "joins_mainstream");
  const lohit = needFact("Lohit", "joins_mainstream");

  return [
    {
      stem: "The Jhelum joins a river at Trimmu, and the Satluj later joins the same river at Panjnad. Which river is it?",
      answer: "Chenab",
      pool: ["Chenab", "Indus", "Satluj", "Ganga", "Alaknanda"],
      explanation: "The Jhelum joins the Chenab at Trimmu, and the Satluj later joins the Chenab at Panjnad.",
      facts: [jhelumChenab, satlujChenab],
    },
    {
      stem: "Which sequence correctly shows the river-joining chain from Beas to Chenab?",
      answer: "Beas → Satluj → Chenab",
      pool: ["Beas → Satluj → Chenab", "Beas → Chenab → Satluj", "Satluj → Beas → Chenab", "Chenab → Satluj → Beas"],
      explanation: "The Beas joins the Satluj at Harike, and the Satluj later joins the Chenab at Panjnad.",
      facts: [beasSatluj, satlujChenab],
    },
    {
      stem: "Chandra and Bhaga combine to form a river which is later joined by the Jhelum at Trimmu. Which river is this?",
      answer: "Chenab",
      pool: ["Chenab", "Satluj", "Indus", "Ganga", "Brahmaputra"],
      explanation: "Chandra and Bhaga combine to form the Chenab; the Jhelum later joins the Chenab at Trimmu.",
      facts: [chenabFormation, jhelumChenab],
    },
    {
      stem: "Dhauliganga and Nandakini join the same river at Vishnuprayag and Nandprayag respectively. Which river is it?",
      answer: "Alaknanda",
      pool: ["Alaknanda", "Bhagirathi", "Ganga", "Yamuna", "Mandakini"],
      explanation: "Dhauliganga joins the Alaknanda at Vishnuprayag, while Nandakini joins the Alaknanda at Nandprayag.",
      facts: [dhauliAlaknanda, dhauliVishnu, nandaAlaknanda, nandaPrayag],
    },
    {
      stem: "Which two rivers join the Siang/Dihang before the combined river is known as the Brahmaputra?",
      answer: "Dibang and Lohit",
      pool: ["Dibang and Lohit", "Subansiri and Manas", "Jia Bharali and Manas", "Teesta and Sankosh"],
      explanation: "Dibang and Lohit join the Siang/Dihang; after these confluences the river is known as the Brahmaputra.",
      facts: [dibang, lohit],
    },
    {
      stem: "Bhagirathi and Alaknanda meet at Devprayag. What is the river called after this confluence?",
      answer: "Ganga",
      pool: ["Ganga", "Yamuna", "Bhagirathi", "Alaknanda", "Mandakini"],
      explanation: "Bhagirathi and Alaknanda meet at Devprayag, where the combined river takes the name Ganga.",
      facts: [gangaFormation, gangaDevprayag],
    },
  ];
}

function ql062(seed: string) {
  const mode = deterministicPick(chainModes(), `${seed}:chain`);
  return build({
    qlId: "GEO-RIV-001-QL-062",
    seed,
    stem: mode.stem,
    answer: mode.answer,
    optionPool: mode.pool,
    explanation: mode.explanation,
    facts: mode.facts,
    difficulty: "Hard",
    solverAuthority: "RELATION_CHAIN_VERIFIER",
  });
}

function needParentLike(river: string, parent: string) {
  const parentRecord = PARENT_RECORDS.find((record) => record.river === river && record.parent === parent);
  if (parentRecord) return parentRecord.fact;
  const bankRecord = BANK_RECORDS.find((record) => record.river === river && record.parent === parent);
  if (bankRecord) return bankRecord.fact;
  throw new Error(`Missing CP007 parent support: ${river} -> ${parent}`);
}

function statementModes() {
  const jhelum = needParentLike("Jhelum", "Indus");
  const yamuna = needParentLike("Yamuna", "Ganga");
  const subansiri = needParentLike("Subansiri", "Brahmaputra");
  const beas = needParentLike("Beas", "Indus");
  const manas = needParentLike("Manas", "Brahmaputra");
  const bhima = needParentLike("Bhima", "Krishna");
  const ravi = needParentLike("Ravi", "Indus");
  const kabini = needParentLike("Kabini", "Cauvery");
  const answerPool = ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"];
  return [
    {
      statements: ["Statement I: Jhelum is a tributary of the Indus.", "Statement II: Yamuna is a tributary of the Ganga."],
      answer: answerPool[0],
      explanation: "Both statements are correct: Jhelum belongs to the Indus system, and Yamuna is a major tributary of the Ganga.",
      facts: [jhelum, yamuna],
      pool: answerPool,
    },
    {
      statements: ["Statement I: Subansiri is a tributary of the Brahmaputra.", "Statement II: Beas is a tributary of the Ganga."],
      answer: answerPool[1],
      explanation: "Statement I is correct. Subansiri is a tributary of the Brahmaputra. Beas belongs to the Indus river system, not the Ganga system.",
      facts: [subansiri, beas],
      pool: answerPool,
    },
    {
      statements: ["Statement I: Manas is a tributary of the Ganga.", "Statement II: Bhima is a tributary of the Krishna."],
      answer: answerPool[2],
      explanation: "Only Statement II is correct. Manas is a tributary of the Brahmaputra, while Bhima is a tributary of the Krishna.",
      facts: [manas, bhima],
      pool: answerPool,
    },
    {
      statements: ["Statement I: Ravi is a tributary of the Ganga.", "Statement II: Kabini is a tributary of the Godavari."],
      answer: answerPool[3],
      explanation: "Neither statement is correct. Ravi belongs to the Indus system, and Kabini is a tributary of the Cauvery.",
      facts: [ravi, kabini],
      pool: answerPool,
    },
  ];
}

function ql063(seed: string) {
  const mode = deterministicPick(statementModes(), `${seed}:statements`);
  return build({
    qlId: "GEO-RIV-001-QL-063",
    seed,
    stem: `${mode.statements.join("\n")}\nWhich of the above statements is/are correct?`,
    answer: mode.answer,
    optionPool: mode.pool,
    explanation: mode.explanation,
    facts: mode.facts,
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

function countModes() {
  const jhelum = needParentLike("Jhelum", "Indus");
  const yamuna = needParentLike("Yamuna", "Ganga");
  const manas = needParentLike("Manas", "Brahmaputra");
  const bhima = needParentLike("Bhima", "Krishna");
  const kabini = needParentLike("Kabini", "Cauvery");
  const ravi = needParentLike("Ravi", "Indus");
  const dhauli = needParentLike("Dhauliganga", "Alaknanda");
  const subansiri = needParentLike("Subansiri", "Brahmaputra");
  const tungabhadra = needParentLike("Tungabhadra", "Krishna");
  const beas = needParentLike("Beas", "Indus");
  const pool = ["None", "One", "Two", "Three"];
  return [
    {
      stem: "Consider the following statements:\n1. Jhelum is a tributary of the Indus.\n2. Yamuna is a tributary of the Ganga.\n3. Manas is a tributary of the Brahmaputra.\nHow many of the above statements are correct?",
      answer: "Three",
      explanation: "All three statements are correct.",
      facts: [jhelum, yamuna, manas], pool,
    },
    {
      stem: "Consider the following statements:\n1. Bhima is a tributary of the Krishna.\n2. Kabini is a tributary of the Cauvery.\n3. Ravi is a tributary of the Ganga.\nHow many of the above statements are correct?",
      answer: "Two",
      explanation: "Bhima–Krishna and Kabini–Cauvery are correct. Ravi belongs to the Indus system, so two statements are correct.",
      facts: [bhima, kabini, ravi], pool,
    },
    {
      stem: "Consider the following statements:\n1. Dhauliganga is a tributary of the Alaknanda.\n2. Subansiri is a tributary of the Ganga.\n3. Tungabhadra is a tributary of the Godavari.\nHow many of the above statements are correct?",
      answer: "One",
      explanation: "Only Dhauliganga–Alaknanda is correct. Subansiri belongs to the Brahmaputra system, and Tungabhadra is a tributary of the Krishna.",
      facts: [dhauli, subansiri, tungabhadra], pool,
    },
    {
      stem: "Consider the following statements:\n1. Beas is a tributary of the Ganga.\n2. Manas is a tributary of the Indus.\n3. Kabini is a tributary of the Krishna.\nHow many of the above statements are correct?",
      answer: "None",
      explanation: "None is correct. Beas belongs to the Indus system, Manas to the Brahmaputra system, and Kabini is a tributary of the Cauvery.",
      facts: [beas, manas, kabini], pool,
    },
  ];
}

function ql064(seed: string) {
  const mode = deterministicPick(countModes(), `${seed}:count`);
  return build({
    qlId: "GEO-RIV-001-QL-064",
    seed,
    stem: mode.stem,
    answer: mode.answer,
    optionPool: mode.pool,
    explanation: mode.explanation,
    facts: mode.facts,
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp007ReviewV1(qlId: string, seed: string): GeoRiv001Cp007ReviewQuestion {
  switch (qlId) {
    case "GEO-RIV-001-QL-055": return ql055(seed);
    case "GEO-RIV-001-QL-056": return ql056(seed);
    case "GEO-RIV-001-QL-057": return ql057(seed);
    case "GEO-RIV-001-QL-058": return ql058(seed);
    case "GEO-RIV-001-QL-059": return ql059(seed);
    case "GEO-RIV-001-QL-060": return ql060(seed);
    case "GEO-RIV-001-QL-061": return ql061(seed);
    case "GEO-RIV-001-QL-062": return ql062(seed);
    case "GEO-RIV-001-QL-063": return ql063(seed);
    case "GEO-RIV-001-QL-064": return ql064(seed);
    default: throw new Error(`Unsupported GEO-RIV-001 CP007 QL: ${qlId}`);
  }
}
