import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP008_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp008-facts";
import type { GeoRiv001Cp008ReviewQuestion } from "./geo-riv-001-cp008-review-types";

const FACTS = GEO_RIV_001_CP008_PROJECTED_FACTS_V1;

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-065": "Direct source association",
  "GEO-RIV-001-QL-066": "Reverse source association",
  "GEO-RIV-001-QL-067": "Source geography",
  "GEO-RIV-001-QL-068": "Mouth and outfall",
  "GEO-RIV-001-QL-069": "Correctly matched source or mouth pair",
  "GEO-RIV-001-QL-070": "Incorrectly matched source or mouth pair",
  "GEO-RIV-001-QL-071": "Source-to-mouth relation chain",
  "GEO-RIV-001-QL-072": "Statement I and II",
  "GEO-RIV-001-QL-073": "Multi-statement count",
};

const EXACT_SOURCE_RELATIONS = new Set(["originates_from", "originates_near", "originates_at", "source_point"]);
const SOURCE_GEO_RELATIONS = new Set(["source_region", "source_range", "source_state", "source_district"]);
const MOUTH_RELATIONS = new Set(["drains_into", "has_mouth_type"]);

const SEA_OPTIONS = ["Arabian Sea", "Bay of Bengal", "Gulf of Kutch", "Palk Strait"];
const MOUTH_TYPE_OPTIONS = ["Delta", "Estuary", "Inland drainage", "No permanent outlet"];
const STATE_OPTIONS = ["Maharashtra", "Karnataka", "Chhattisgarh", "Uttarakhand", "Himachal Pradesh", "Arunachal Pradesh", "Jharkhand", "Odisha", "Madhya Pradesh"];
const DISTRICT_OPTIONS = ["Nashik", "Dhamtari", "Ranchi", "Kodagu", "Uttarkashi", "Kullu", "Keonjhar"];
const RANGE_OPTIONS = ["Brahmagiri Range", "Nandidurg Range", "Aravalli Range", "Satpura Range", "Vindhya Range", "Pir Panjal Range"];

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
  solverAuthority: GeoRiv001Cp008ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp008ReviewQuestion {
  const distractors = deterministicShuffle(
    unique(args.optionPool.filter((option) => option !== args.answer)),
    `${args.seed}:${args.qlId}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP008 requires three distractors for ${args.qlId}: ${args.answer}`);
  const rows = deterministicShuffle(
    [{ text: args.answer, correct: true }, ...distractors.map((text) => ({ text, correct: false }))],
    `${args.seed}:${args.qlId}:options`,
  );
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  assertKnowledgeQuestionValid({ stem: args.stem, explanation: args.explanation, options, correctIndex, canonicalAnswer: args.answer });
  return {
    questionId: `GEO-RIV-001-CP008-V2-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP008",
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

const truthValues = new Map<string, Set<string>>();
for (const fact of FACTS) {
  const key = `${fact.entityId}|${fact.relation}`;
  const values = truthValues.get(key) ?? new Set<string>();
  values.add(valueText(fact));
  truthValues.set(key, values);
}

const relationValues = new Map<string, string[]>();
for (const fact of FACTS) {
  relationValues.set(fact.relation, unique([...(relationValues.get(fact.relation) ?? []), valueText(fact)]));
}

const EXACT_SOURCE_FACTS = FACTS.filter((fact) => EXACT_SOURCE_RELATIONS.has(fact.relation));
const SOURCE_GEO_FACTS = FACTS.filter((fact) => SOURCE_GEO_RELATIONS.has(fact.relation));
const DRAIN_FACTS = FACTS.filter((fact) => fact.relation === "drains_into");
const MOUTH_TYPE_FACTS = FACTS.filter((fact) => fact.relation === "has_mouth_type");
const PAIRABLE_FACTS = FACTS.filter((fact) => EXACT_SOURCE_RELATIONS.has(fact.relation) || SOURCE_GEO_RELATIONS.has(fact.relation) || MOUTH_RELATIONS.has(fact.relation));

const EXACT_SOURCE_VALUES = unique(EXACT_SOURCE_FACTS.map(valueText));
const SOURCE_RIVERS = unique(EXACT_SOURCE_FACTS.map((fact) => fact.entity.label.en));
const SOURCE_REGION_VALUES = unique(SOURCE_GEO_FACTS.filter((fact) => fact.relation === "source_region").map(valueText));

function nearDisplay(value: string) {
  return value
    .replace(/^near\s+/i, "")
    .replace(/\s+near\s+/i, " in ");
}

function sourceClause(fact: KnowledgeFact, value = valueText(fact)) {
  if (fact.relation === "originates_from") return `originates from ${value}`;
  if (fact.relation === "originates_near") return `originates near ${nearDisplay(value)}`;
  if (fact.relation === "originates_at") return `originates at ${value}`;
  if (fact.relation === "source_point") return `has its source point at ${value}`;
  if (fact.relation === "source_region") return /^near\s+/i.test(value) ? `rises ${value}` : `rises in ${value}`;
  if (fact.relation === "source_range") return `rises in the ${value}`;
  if (fact.relation === "source_state") return `originates in ${value}`;
  if (fact.relation === "source_district") return `rises in ${value} district`;
  throw new Error(`Unsupported source relation ${fact.relation}`);
}

function mouthTypeSentence(river: string, value: string) {
  if (value === "Delta") return `${river} forms a delta at its mouth.`;
  if (value === "Estuary") return `${river} forms an estuary at its mouth.`;
  if (value === "Inland drainage") return `${river} has inland drainage.`;
  if (value === "No permanent outlet") return `${river} has no permanent outlet.`;
  return `The mouth of the ${river} is classified as ${value.toLowerCase()}.`;
}

function factSentence(fact: KnowledgeFact, value = valueText(fact)) {
  const river = fact.entity.label.en;
  if (EXACT_SOURCE_RELATIONS.has(fact.relation) || SOURCE_GEO_RELATIONS.has(fact.relation)) return `${river} ${sourceClause(fact, value)}.`;
  if (fact.relation === "drains_into") return `${river} drains into the ${value}.`;
  if (fact.relation === "has_mouth_type") return mouthTypeSentence(river, value);
  throw new Error(`Unsupported CP008 sentence relation ${fact.relation}`);
}

function pairText(fact: KnowledgeFact, value = valueText(fact)) {
  const river = fact.entity.label.en;
  if (fact.relation === "originates_from") return `${river} — originates from ${value}`;
  if (fact.relation === "originates_near") return `${river} — originates near ${nearDisplay(value)}`;
  if (fact.relation === "originates_at") return `${river} — originates at ${value}`;
  if (fact.relation === "source_point") return `${river} — source point: ${value}`;
  if (fact.relation === "source_region") return `${river} — source region: ${value}`;
  if (fact.relation === "source_range") return `${river} — source range: ${value}`;
  if (fact.relation === "source_state") return `${river} — source state: ${value}`;
  if (fact.relation === "source_district") return `${river} — source district: ${value}`;
  if (fact.relation === "drains_into") return `${river} — drains into ${value}`;
  if (fact.relation === "has_mouth_type") return `${river} — mouth type: ${value}`;
  throw new Error(`Unsupported CP008 pair relation ${fact.relation}`);
}

function valuePoolFor(fact: KnowledgeFact) {
  if (EXACT_SOURCE_RELATIONS.has(fact.relation)) return EXACT_SOURCE_VALUES;
  if (fact.relation === "source_state") return unique([...(relationValues.get(fact.relation) ?? []), ...STATE_OPTIONS]);
  if (fact.relation === "source_district") return unique([...(relationValues.get(fact.relation) ?? []), ...DISTRICT_OPTIONS]);
  if (fact.relation === "source_region") return SOURCE_REGION_VALUES;
  if (fact.relation === "source_range") return unique([...(relationValues.get(fact.relation) ?? []), ...RANGE_OPTIONS]);
  if (fact.relation === "drains_into") return SEA_OPTIONS;
  if (fact.relation === "has_mouth_type") return MOUTH_TYPE_OPTIONS;
  return relationValues.get(fact.relation) ?? [];
}

function wrongValueFor(fact: KnowledgeFact, seed: string) {
  const trueValues = truthValues.get(`${fact.entityId}|${fact.relation}`) ?? new Set<string>();
  const pool = valuePoolFor(fact).filter((value) => !trueValues.has(value));
  if (!pool.length) throw new Error(`No safe false value for ${fact.factId}`);
  return deterministicPick(pool, `${seed}:wrong-value:${fact.factId}`);
}

function ql065(seed: string) {
  const fact = deterministicPick(EXACT_SOURCE_FACTS, `${seed}:fact`);
  const river = fact.entity.label.en;
  const stems: Record<string, string> = {
    originates_from: `The ${river} originates from which of the following?`,
    originates_near: `The ${river} originates near which place?`,
    originates_at: `The ${river} originates at which place?`,
    source_point: `Which place is identified as a source point of the ${river}?`,
  };
  return build({ qlId: "GEO-RIV-001-QL-065", seed, stem: stems[fact.relation], answer: valueText(fact), optionPool: EXACT_SOURCE_VALUES, explanation: factSentence(fact), facts: [fact], difficulty: "Easy", solverAuthority: "CANONICAL_SOURCE_RELATION" });
}

const exactValueEntities = new Map<string, Set<string>>();
for (const fact of EXACT_SOURCE_FACTS) {
  const value = valueText(fact);
  const entities = exactValueEntities.get(value) ?? new Set<string>();
  entities.add(fact.entityId);
  exactValueEntities.set(value, entities);
}
const UNIQUE_REVERSE_SOURCE_FACTS = EXACT_SOURCE_FACTS.filter((fact) => exactValueEntities.get(valueText(fact))?.size === 1);

function ql066(seed: string) {
  const fact = deterministicPick(UNIQUE_REVERSE_SOURCE_FACTS, `${seed}:fact`);
  return build({ qlId: "GEO-RIV-001-QL-066", seed, stem: `Which river ${sourceClause(fact)}?`, answer: fact.entity.label.en, optionPool: SOURCE_RIVERS, explanation: factSentence(fact), facts: [fact], difficulty: "Easy", solverAuthority: "CANONICAL_SOURCE_RELATION" });
}

function ql067(seed: string) {
  const fact = deterministicPick(SOURCE_GEO_FACTS, `${seed}:fact`);
  const river = fact.entity.label.en;
  const value = valueText(fact);
  const stems: Record<string, string> = {
    source_region: /^near\s+/i.test(value) ? `The ${river} rises near which place?` : `The ${river} rises in which source region?`,
    source_range: `The ${river} rises in which range?`,
    source_state: `The ${river} originates in which state?`,
    source_district: `The ${river} rises in which district?`,
  };
  const answer = fact.relation === "source_region" && /^near\s+/i.test(value) ? value.replace(/^near\s+/i, "") : value;
  const pool = fact.relation === "source_region" && /^near\s+/i.test(value)
    ? valuePoolFor(fact).map((item) => item.replace(/^near\s+/i, ""))
    : valuePoolFor(fact);
  return build({ qlId: "GEO-RIV-001-QL-067", seed, stem: stems[fact.relation], answer, optionPool: pool, explanation: factSentence(fact), facts: [fact], difficulty: "Medium", solverAuthority: "SOURCE_GEOGRAPHY_VERIFIER" });
}

function ql068(seed: string) {
  const useMouthType = MOUTH_TYPE_FACTS.length > 0 && deterministicPick([true, false] as const, `${seed}:mode`);
  if (useMouthType) {
    const fact = deterministicPick(MOUTH_TYPE_FACTS, `${seed}:fact`);
    return build({ qlId: "GEO-RIV-001-QL-068", seed, stem: `The mouth of the ${fact.entity.label.en} is best described as which of the following?`, answer: valueText(fact), optionPool: MOUTH_TYPE_OPTIONS, explanation: factSentence(fact), facts: [fact], difficulty: "Easy", solverAuthority: "MOUTH_RELATION_VERIFIER" });
  }
  const fact = deterministicPick(DRAIN_FACTS, `${seed}:fact`);
  return build({ qlId: "GEO-RIV-001-QL-068", seed, stem: `The ${fact.entity.label.en} drains into which water body?`, answer: valueText(fact), optionPool: SEA_OPTIONS, explanation: factSentence(fact), facts: [fact], difficulty: "Easy", solverAuthority: "MOUTH_RELATION_VERIFIER" });
}

function safePairFacts(seed: string, count: number) {
  const shuffled = deterministicShuffle(PAIRABLE_FACTS, `${seed}:pair-facts`);
  const selected: KnowledgeFact[] = [];
  const entities = new Set<string>();
  for (const fact of shuffled) {
    if (entities.has(fact.entityId)) continue;
    if (valuePoolFor(fact).filter((value) => !(truthValues.get(`${fact.entityId}|${fact.relation}`) ?? new Set()).has(value)).length === 0) continue;
    selected.push(fact);
    entities.add(fact.entityId);
    if (selected.length === count) break;
  }
  if (selected.length !== count) throw new Error(`CP008 could not select ${count} safe pair facts`);
  return selected;
}

function ql069(seed: string) {
  const facts = safePairFacts(seed, 4);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const options = facts.map((fact, index) => index === targetIndex ? pairText(fact) : pairText(fact, wrongValueFor(fact, `${seed}:${index}`)));
  const answer = options[targetIndex];
  return build({ qlId: "GEO-RIV-001-QL-069", seed, stem: "Which of the following pairs is correctly matched?", answer, optionPool: options, explanation: factSentence(facts[targetIndex]), facts, difficulty: "Medium", solverAuthority: "MATCHED_RELATION_VERIFIER" });
}

function ql070(seed: string) {
  const facts = safePairFacts(seed, 4);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const wrongValue = wrongValueFor(facts[targetIndex], `${seed}:target`);
  const options = facts.map((fact, index) => index === targetIndex ? pairText(fact, wrongValue) : pairText(fact));
  const answer = options[targetIndex];
  return build({ qlId: "GEO-RIV-001-QL-070", seed, stem: "Which of the following pairs is incorrectly matched?", answer, optionPool: options, explanation: `${answer} is incorrect. ${factSentence(facts[targetIndex])}`, facts, difficulty: "Medium", solverAuthority: "MATCHED_RELATION_VERIFIER" });
}

type ChainRecord = { source: KnowledgeFact; mouth: KnowledgeFact; river: string; key: string };
const rawChains: ChainRecord[] = [];
for (const source of EXACT_SOURCE_FACTS) {
  for (const mouth of DRAIN_FACTS.filter((fact) => fact.entityId === source.entityId)) {
    rawChains.push({ source, mouth, river: source.entity.label.en, key: `${source.entityId}|${source.relation}|${valueText(source)}|${valueText(mouth)}` });
  }
}
const chainKeys = new Set<string>();
const CHAIN_RECORDS = rawChains.filter((chain) => {
  if (chainKeys.has(chain.key)) return false;
  chainKeys.add(chain.key);
  return true;
});
const CHAIN_RIVERS = unique(CHAIN_RECORDS.map((chain) => chain.river));

function ql071(seed: string) {
  const chain = deterministicPick(CHAIN_RECORDS, `${seed}:chain`);
  return build({ qlId: "GEO-RIV-001-QL-071", seed, stem: `Which river ${sourceClause(chain.source)} and drains into the ${valueText(chain.mouth)}?`, answer: chain.river, optionPool: CHAIN_RIVERS, explanation: `${factSentence(chain.source)} ${factSentence(chain.mouth)}`, facts: [chain.source, chain.mouth], difficulty: "Hard", solverAuthority: "SOURCE_TO_MOUTH_CHAIN_VERIFIER" });
}

const STATEMENT_OPTIONS = ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"];
function ql072(seed: string) {
  const [first, second] = safePairFacts(`${seed}:statements`, 2);
  const mode = deterministicPick([0, 1, 2, 3] as const, `${seed}:truth-mode`);
  const firstTrue = mode === 0 || mode === 1;
  const secondTrue = mode === 0 || mode === 2;
  const firstText = firstTrue ? factSentence(first) : factSentence(first, wrongValueFor(first, `${seed}:I`));
  const secondText = secondTrue ? factSentence(second) : factSentence(second, wrongValueFor(second, `${seed}:II`));
  const answer = mode === 0 ? STATEMENT_OPTIONS[0] : mode === 1 ? STATEMENT_OPTIONS[1] : mode === 2 ? STATEMENT_OPTIONS[2] : STATEMENT_OPTIONS[3];
  const explanation = `${firstTrue ? "Statement I is correct" : "Statement I is incorrect"}: ${factSentence(first)} ${secondTrue ? "Statement II is correct" : "Statement II is incorrect"}: ${factSentence(second)}`;
  return build({ qlId: "GEO-RIV-001-QL-072", seed, stem: `Consider the following statements:\nI. ${firstText}\nII. ${secondText}`, answer, optionPool: STATEMENT_OPTIONS, explanation, facts: [first, second], difficulty: "Medium", solverAuthority: "STATEMENT_COMPOSITION_VERIFIER" });
}

const COUNT_OPTIONS = ["None", "One", "Two", "Three"];
function ql073(seed: string) {
  const facts = safePairFacts(`${seed}:count`, 3);
  const trueCount = deterministicPick([0, 1, 2, 3] as const, `${seed}:true-count`);
  const truthFlags = deterministicShuffle([true, true, true].map((_, index) => index < trueCount), `${seed}:truth-flags`);
  const statements = facts.map((fact, index) => truthFlags[index] ? factSentence(fact) : factSentence(fact, wrongValueFor(fact, `${seed}:${index}`)));
  const answer = COUNT_OPTIONS[trueCount];
  const explanation = facts.map((fact, index) => `${index + 1}. ${truthFlags[index] ? "Correct" : "Incorrect"} — ${factSentence(fact)}`).join(" ");
  return build({ qlId: "GEO-RIV-001-QL-073", seed, stem: `How many of the following statements are correct?\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}`, answer, optionPool: COUNT_OPTIONS, explanation, facts, difficulty: "Hard", solverAuthority: "STATEMENT_COMPOSITION_VERIFIER" });
}

export function generateGeoRiv001Cp008ReviewV2(qlId: string, seed: string): GeoRiv001Cp008ReviewQuestion {
  const generators: Record<string, (seed: string) => GeoRiv001Cp008ReviewQuestion> = {
    "GEO-RIV-001-QL-065": ql065,
    "GEO-RIV-001-QL-066": ql066,
    "GEO-RIV-001-QL-067": ql067,
    "GEO-RIV-001-QL-068": ql068,
    "GEO-RIV-001-QL-069": ql069,
    "GEO-RIV-001-QL-070": ql070,
    "GEO-RIV-001-QL-071": ql071,
    "GEO-RIV-001-QL-072": ql072,
    "GEO-RIV-001-QL-073": ql073,
  };
  const generator = generators[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP008 QL: ${qlId}`);
  return generator(seed);
}

export const GEO_RIV_001_CP008_QL_IDS_V2 = Object.freeze(Object.keys(QL_NAMES));
