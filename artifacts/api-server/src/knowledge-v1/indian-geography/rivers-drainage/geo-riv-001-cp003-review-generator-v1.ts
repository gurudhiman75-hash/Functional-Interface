import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP003_FACTS } from "./geo-riv-001-cp003-facts";
import type { GeoRiv001Cp003ReviewQuestion } from "./geo-riv-001-cp003-review-types";

const FACTS = GEO_RIV_001_CP003_FACTS;

function byId(id: string) {
  const fact = FACTS.find((entry) => entry.factId === `geo-riv-001-cp003-${id}`);
  if (!fact) throw new Error(`Missing CP003 fact ${id}`);
  return fact;
}

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  throw new Error(`${fact.factId} has unsupported CP003 value kind`);
}

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return unique(facts.map((fact) => fact.source.sourceId));
}

function optionsFor(correct: string, pool: readonly string[], seed: string) {
  const distractors = deterministicShuffle(
    unique(pool.filter((value) => value !== correct)),
    `${seed}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP003 requires three distractors for ${correct}`);
  const records = deterministicShuffle(
    [
      { text: correct, correct: true },
      ...distractors.map((text) => ({ text, correct: false })),
    ],
    `${seed}:options`,
  );
  return {
    options: records.map((record) => record.text),
    correctIndex: records.findIndex((record) => record.correct),
  };
}

function finalize(args: {
  qlId: string;
  qlName: string;
  difficulty: GeoRiv001Cp003ReviewQuestion["difficulty"];
  seed: string;
  stem: string;
  canonicalAnswer: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  facts: readonly KnowledgeFact[];
  solverAuthority: GeoRiv001Cp003ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp003ReviewQuestion {
  assertKnowledgeQuestionValid({
    stem: args.stem,
    explanation: args.explanation,
    options: args.options,
    correctIndex: args.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
  });
  return {
    questionId: `GEO-RIV-001-CP003-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP003",
    qlId: args.qlId,
    qlName: args.qlName,
    difficulty: args.difficulty,
    stem: args.stem,
    options: args.options,
    correctIndex: args.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
    explanation: args.explanation,
    sourceIds: sourceIds(args.facts),
    sourceFactIds: unique(args.facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

type DirectMode = {
  id: string;
  stem: string;
  answer: string;
  pool: string[];
  explanation: string;
  factIds: string[];
  difficulty: GeoRiv001Cp003ReviewQuestion["difficulty"];
};

const DIRECT_MODES: DirectMode[] = [
  {
    id: "bhagirathi-glacier",
    stem: "The Bhagirathi River originates from which glacier?",
    answer: "Gangotri Glacier",
    pool: ["Gangotri Glacier", "Yamunotri Glacier", "Satopanth Glacier", "Pindari Glacier", "Siachen Glacier"],
    explanation: "The Bhagirathi originates from Gangotri Glacier at Gaumukh.",
    factIds: ["bhagirathi-source-gangotri-glacier", "bhagirathi-source-gaumukh"],
    difficulty: "Easy",
  },
  {
    id: "bhagirathi-gaumukh",
    stem: "At which place does the Bhagirathi emerge from Gangotri Glacier?",
    answer: "Gaumukh",
    pool: ["Gaumukh", "Devprayag", "Haridwar", "Yamunotri", "Badrinath"],
    explanation: "The Bhagirathi emerges from Gangotri Glacier at Gaumukh.",
    factIds: ["bhagirathi-source-gangotri-glacier", "bhagirathi-source-gaumukh"],
    difficulty: "Easy",
  },
  {
    id: "ganga-devprayag",
    stem: "The Bhagirathi and Alaknanda meet at which place to form the Ganga?",
    answer: "Devprayag",
    pool: ["Devprayag", "Rudraprayag", "Karnaprayag", "Nandprayag", "Vishnuprayag"],
    explanation: "The Bhagirathi and Alaknanda meet at Devprayag. From this confluence, the river is known as the Ganga.",
    factIds: ["ganga-formed-bhagirathi-alaknanda", "ganga-formed-at-devprayag"],
    difficulty: "Easy",
  },
  {
    id: "ganga-haridwar",
    stem: "At which place does the Ganga enter the Gangetic Plains?",
    answer: "Haridwar",
    pool: ["Haridwar", "Devprayag", "Rishikesh", "Prayagraj", "Farakka"],
    explanation: "The Ganga emerges from the Himalayan region and opens into the Gangetic Plains at Haridwar.",
    factIds: ["ganga-enters-plains-haridwar"],
    difficulty: "Easy",
  },
  {
    id: "ganga-mouth",
    stem: "The Ganga ultimately drains into which water body?",
    answer: "Bay of Bengal",
    pool: ["Bay of Bengal", "Arabian Sea", "Gulf of Khambhat", "Indian Ocean", "Gulf of Kachchh"],
    explanation: "The Ganga flows eastward and ultimately drains into the Bay of Bengal.",
    factIds: ["ganga-drains-bay-of-bengal"],
    difficulty: "Easy",
  },
  {
    id: "yamuna-source",
    stem: "The Yamuna River originates from which glacier?",
    answer: "Yamunotri Glacier",
    pool: ["Yamunotri Glacier", "Gangotri Glacier", "Satopanth Glacier", "Pindari Glacier", "Milam Glacier"],
    explanation: "The Yamuna originates from Yamunotri Glacier near the Banderpoonch peaks.",
    factIds: ["yamuna-source-yamunotri-glacier", "yamuna-source-banderpoonch"],
    difficulty: "Easy",
  },
  {
    id: "yamuna-prayagraj",
    stem: "At which place does the Yamuna meet the Ganga?",
    answer: "Prayagraj",
    pool: ["Prayagraj", "Haridwar", "Patna", "Kannauj", "Farakka"],
    explanation: "The Yamuna meets the Ganga at Prayagraj at the Sangam.",
    factIds: ["yamuna-joins-ganga-prayagraj", "yamuna-confluence-prayagraj"],
    difficulty: "Easy",
  },
  {
    id: "kosi-epithet",
    stem: "Which river is known as the ‘Sorrow of Bihar’?",
    answer: "Kosi",
    pool: ["Kosi", "Gandak", "Ghaghara", "Sone", "Ramganga"],
    explanation: "The Kosi is widely known as the ‘Sorrow of Bihar’ because of its destructive floods and shifting course.",
    factIds: ["kosi-sorrow-bihar"],
    difficulty: "Easy",
  },
  {
    id: "sone-source",
    stem: "The Sone River rises in which region?",
    answer: "Amarkantak plateau",
    pool: ["Amarkantak plateau", "Chota Nagpur Plateau", "Malwa Plateau", "Meghalaya Plateau", "Deccan Plateau"],
    explanation: "The Sone rises in the Maikala range in the Amarkantak plateau region.",
    factIds: ["sone-source-amarkantak"],
    difficulty: "Medium",
  },
  {
    id: "gandak-name",
    stem: "Which river of the Ganga system is also known as Narayani?",
    answer: "Gandak",
    pool: ["Gandak", "Ghaghara", "Kosi", "Ramganga", "Gomti"],
    explanation: "The Gandak is also known as Narayani in its course through the plains of Nepal.",
    factIds: ["gandak-name-narayani"],
    difficulty: "Medium",
  },
  {
    id: "ghaghara-name",
    stem: "Which Ganga tributary is known as Karnali in its upper course?",
    answer: "Ghaghara",
    pool: ["Ghaghara", "Gandak", "Kosi", "Sone", "Gomti"],
    explanation: "The Ghaghara is known as Karnali in its upper course before entering the plains.",
    factIds: ["ghaghara-upper-name-karnali"],
    difficulty: "Medium",
  },
];

function directQuestion(seed: string) {
  const mode = deterministicPick(DIRECT_MODES, `${seed}:direct-mode`);
  const optionData = optionsFor(mode.answer, mode.pool, `${seed}:${mode.id}`);
  return finalize({
    qlId: "GEO-RIV-001-QL-019",
    qlName: "Direct source and course association",
    difficulty: mode.difficulty,
    seed,
    stem: mode.stem,
    canonicalAnswer: mode.answer,
    ...optionData,
    explanation: mode.explanation,
    facts: mode.factIds.map(byId),
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

const REVERSE_MODES: DirectMode[] = [
  {
    id: "gangotri",
    stem: "Which river originates from Gangotri Glacier at Gaumukh?",
    answer: "Bhagirathi",
    pool: ["Bhagirathi", "Yamuna", "Alaknanda", "Mandakini", "Dhauliganga"],
    explanation: "The Bhagirathi originates from Gangotri Glacier at Gaumukh and is the source stream of the Ganga.",
    factIds: ["bhagirathi-source-gangotri-glacier", "bhagirathi-source-gaumukh", "bhagirathi-ganga"],
    difficulty: "Easy",
  },
  {
    id: "yamunotri",
    stem: "Which river originates from Yamunotri Glacier?",
    answer: "Yamuna",
    pool: ["Yamuna", "Bhagirathi", "Alaknanda", "Ramganga", "Gomti"],
    explanation: "The Yamuna originates from Yamunotri Glacier near the Banderpoonch peaks.",
    factIds: ["yamuna-source-yamunotri-glacier", "yamuna-source-banderpoonch"],
    difficulty: "Easy",
  },
  {
    id: "amarkantak",
    stem: "Which tributary of the Ganga rises in the Amarkantak plateau region?",
    answer: "Sone",
    pool: ["Sone", "Kosi", "Gandak", "Ghaghara", "Gomti"],
    explanation: "The Sone rises in the Amarkantak plateau region and later joins the Ganga near Arrah.",
    factIds: ["sone-source-amarkantak", "sone-joins-arrah"],
    difficulty: "Medium",
  },
  {
    id: "sorrow-bihar",
    stem: "The title ‘Sorrow of Bihar’ refers to which river?",
    answer: "Kosi",
    pool: ["Kosi", "Gandak", "Ghaghara", "Sone", "Ramganga"],
    explanation: "The Kosi is known as the ‘Sorrow of Bihar’ and joins the Ganga west of Manihari.",
    factIds: ["kosi-sorrow-bihar", "kosi-joins-manihari"],
    difficulty: "Easy",
  },
  {
    id: "narayani",
    stem: "Narayani is another name used for which river?",
    answer: "Gandak",
    pool: ["Gandak", "Ghaghara", "Kosi", "Gomti", "Ramganga"],
    explanation: "Narayani is a name used for the Gandak in Nepal and the adjoining plains.",
    factIds: ["gandak-name-narayani"],
    difficulty: "Medium",
  },
  {
    id: "karnali",
    stem: "Karnali is the upper-course name associated with which Ganga tributary?",
    answer: "Ghaghara",
    pool: ["Ghaghara", "Gandak", "Kosi", "Sone", "Yamuna"],
    explanation: "The upper course of the Ghaghara is known as Karnali.",
    factIds: ["ghaghara-upper-name-karnali"],
    difficulty: "Medium",
  },
  {
    id: "haridwar",
    stem: "Which river enters the Gangetic Plains at Haridwar?",
    answer: "Ganga",
    pool: ["Ganga", "Yamuna", "Ghaghara", "Gandak", "Kosi"],
    explanation: "The Ganga enters the Gangetic Plains at Haridwar.",
    factIds: ["ganga-enters-plains-haridwar"],
    difficulty: "Easy",
  },
];

function reverseQuestion(seed: string) {
  const mode = deterministicPick(REVERSE_MODES, `${seed}:reverse-mode`);
  const optionData = optionsFor(mode.answer, mode.pool, `${seed}:${mode.id}`);
  return finalize({
    qlId: "GEO-RIV-001-QL-020",
    qlName: "Reverse association",
    difficulty: mode.difficulty,
    seed,
    stem: mode.stem,
    canonicalAnswer: mode.answer,
    ...optionData,
    explanation: mode.explanation,
    facts: mode.factIds.map(byId),
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

type ParentMode = {
  id: string;
  river: string;
  parent: string;
  factId: string;
  difficulty: GeoRiv001Cp003ReviewQuestion["difficulty"];
};

const PARENT_MODES: ParentMode[] = [
  { id: "chambal", river: "Chambal", parent: "Yamuna", factId: "chambal-yamuna", difficulty: "Medium" },
  { id: "betwa", river: "Betwa", parent: "Yamuna", factId: "betwa-yamuna", difficulty: "Medium" },
  { id: "ken", river: "Ken", parent: "Yamuna", factId: "ken-yamuna", difficulty: "Medium" },
  { id: "dhauliganga", river: "Dhauliganga", parent: "Alaknanda", factId: "dhauliganga-alaknanda", difficulty: "Medium" },
  { id: "nandakini", river: "Nandakini", parent: "Alaknanda", factId: "nandakini-alaknanda", difficulty: "Medium" },
  { id: "pindar", river: "Pindar", parent: "Alaknanda", factId: "pindar-alaknanda", difficulty: "Medium" },
  { id: "mandakini", river: "Mandakini", parent: "Alaknanda", factId: "mandakini-alaknanda", difficulty: "Medium" },
  { id: "ramganga", river: "Ramganga", parent: "Ganga", factId: "ramganga-ganga", difficulty: "Easy" },
  { id: "gomti", river: "Gomti", parent: "Ganga", factId: "gomti-ganga", difficulty: "Easy" },
  { id: "ghaghara", river: "Ghaghara", parent: "Ganga", factId: "ghaghara-ganga", difficulty: "Easy" },
  { id: "gandak", river: "Gandak", parent: "Ganga", factId: "gandak-ganga", difficulty: "Easy" },
  { id: "kosi", river: "Kosi", parent: "Ganga", factId: "kosi-ganga", difficulty: "Easy" },
  { id: "sone", river: "Sone", parent: "Ganga", factId: "sone-ganga", difficulty: "Easy" },
];

const BANK_MODES = [
  { river: "Yamuna", side: "right bank", factId: "yamuna-ganga-bank" },
  { river: "Ramganga", side: "left bank", factId: "ramganga-ganga-bank" },
  { river: "Gomti", side: "left bank", factId: "gomti-ganga-bank" },
  { river: "Ghaghara", side: "left bank", factId: "ghaghara-ganga-bank" },
  { river: "Gandak", side: "left bank", factId: "gandak-ganga-bank" },
  { river: "Kosi", side: "left bank", factId: "kosi-ganga-bank" },
  { river: "Sone", side: "right bank", factId: "sone-ganga-bank" },
] as const;

function tributaryQuestion(seed: string) {
  const useBank = deterministicPick([true, false, false] as const, `${seed}:parent-or-bank`);
  if (useBank) {
    const mode = deterministicPick(BANK_MODES, `${seed}:bank-mode`);
    const optionData = optionsFor(mode.side, ["left bank", "right bank", "both banks", "neither bank"], `${seed}:${mode.river}`);
    return finalize({
      qlId: "GEO-RIV-001-QL-021",
      qlName: "Tributary and bank-side identification",
      difficulty: "Medium",
      seed,
      stem: `${mode.river} joins the Ganga from which bank?`,
      canonicalAnswer: mode.side,
      ...optionData,
      explanation: `${mode.river} is a ${mode.side} tributary of the Ganga.`,
      facts: [byId(mode.factId)],
      solverAuthority: "CANONICAL_FACT_RELATION",
    });
  }
  const mode = deterministicPick(PARENT_MODES, `${seed}:parent-mode`);
  const optionData = optionsFor(mode.parent, ["Ganga", "Yamuna", "Alaknanda", "Ghaghara", "Gandak"], `${seed}:${mode.id}`);
  return finalize({
    qlId: "GEO-RIV-001-QL-021",
    qlName: "Tributary and bank-side identification",
    difficulty: mode.difficulty,
    seed,
    stem: `${mode.river} is a tributary of which river?`,
    canonicalAnswer: mode.parent,
    ...optionData,
    explanation: `${mode.river} is a tributary of the ${mode.parent}.`,
    facts: [byId(mode.factId)],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

const PANCH_MODES = [
  { river: "Dhauliganga", place: "Vishnuprayag", factIds: ["dhauliganga-alaknanda", "dhauliganga-vishnuprayag"] },
  { river: "Nandakini", place: "Nandprayag", factIds: ["nandakini-alaknanda", "nandakini-nandprayag"] },
  { river: "Pindar", place: "Karnaprayag", factIds: ["pindar-alaknanda", "pindar-karnaprayag"] },
  { river: "Mandakini", place: "Rudraprayag", factIds: ["mandakini-alaknanda", "mandakini-rudraprayag"] },
  { river: "Bhagirathi", place: "Devprayag", factIds: ["bhagirathi-alaknanda", "bhagirathi-devprayag", "ganga-formed-at-devprayag"] },
] as const;

const PANCH_PLACES = PANCH_MODES.map((mode) => mode.place);

function panchQuestion(seed: string) {
  const mode = deterministicPick(PANCH_MODES, `${seed}:panch-mode`);
  const optionData = optionsFor(mode.place, PANCH_PLACES, `${seed}:${mode.river}`);
  return finalize({
    qlId: "GEO-RIV-001-QL-022",
    qlName: "Confluence and Panch Prayag",
    difficulty: "Medium",
    seed,
    stem: `At which Panch Prayag does the ${mode.river} join the Alaknanda?`,
    canonicalAnswer: mode.place,
    ...optionData,
    explanation: `The ${mode.river} joins the Alaknanda at ${mode.place}.`,
    facts: mode.factIds.map(byId),
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

type PairRecord = {
  river: string;
  value: string;
  factIds: string[];
};

const PAIR_RECORDS: PairRecord[] = [
  { river: "Bhagirathi", value: "Gangotri Glacier", factIds: ["bhagirathi-source-gangotri-glacier"] },
  { river: "Yamuna", value: "Yamunotri Glacier", factIds: ["yamuna-source-yamunotri-glacier"] },
  { river: "Sone", value: "Amarkantak plateau", factIds: ["sone-source-amarkantak"] },
  { river: "Kosi", value: "Sorrow of Bihar", factIds: ["kosi-sorrow-bihar"] },
  { river: "Gandak", value: "Narayani", factIds: ["gandak-name-narayani"] },
  { river: "Ghaghara", value: "Karnali", factIds: ["ghaghara-upper-name-karnali"] },
  { river: "Dhauliganga", value: "Vishnuprayag", factIds: ["dhauliganga-vishnuprayag"] },
  { river: "Nandakini", value: "Nandprayag", factIds: ["nandakini-nandprayag"] },
  { river: "Pindar", value: "Karnaprayag", factIds: ["pindar-karnaprayag"] },
  { river: "Mandakini", value: "Rudraprayag", factIds: ["mandakini-rudraprayag"] },
  { river: "Ramganga", value: "near Kannauj", factIds: ["ramganga-joins-kannauj"] },
  { river: "Gomti", value: "Audihar", factIds: ["gomti-joins-audihar"] },
  { river: "Ganga", value: "Haridwar", factIds: ["ganga-enters-plains-haridwar"] },
];

function pairText(record: PairRecord, value = record.value) {
  return `${record.river} — ${value}`;
}

function pairTruth(text: string) {
  const [river, value] = text.split(" — ").map((part) => part.trim());
  return PAIR_RECORDS.some((record) => record.river === river && record.value === value);
}

function selectedPairRecords(seed: string) {
  return deterministicShuffle(PAIR_RECORDS, seed).slice(0, 4);
}

function correctPairQuestion(seed: string) {
  const records = selectedPairRecords(`${seed}:records`);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const values = records.map((record) => record.value);
  const options = records.map((record, index) =>
    index === targetIndex ? pairText(record) : pairText(record, values[(index + 1) % values.length]!),
  );
  if (options.filter(pairTruth).length !== 1) throw new Error(`CP003 QL023 pair composer ambiguity for ${seed}`);
  const canonicalAnswer = options[targetIndex]!;
  return finalize({
    qlId: "GEO-RIV-001-QL-023",
    qlName: "Correct pair",
    difficulty: "Medium",
    seed,
    stem: "Which of the following pairs is correctly matched?",
    canonicalAnswer,
    options,
    correctIndex: targetIndex,
    explanation: `The correct pair is ${canonicalAnswer}.`,
    facts: records.flatMap((record) => record.factIds.map(byId)),
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

function incorrectPairQuestion(seed: string) {
  const records = selectedPairRecords(`${seed}:records`);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const usedTrueValues = new Set(records.filter((_, index) => index !== targetIndex).map((record) => record.value));
  const wrongValues = deterministicShuffle(
    PAIR_RECORDS.map((record) => record.value).filter(
      (value) => value !== records[targetIndex]!.value && !usedTrueValues.has(value),
    ),
    `${seed}:wrong-values`,
  );
  const wrongValue = wrongValues.find((value) => !PAIR_RECORDS.some(
    (record) => record.river === records[targetIndex]!.river && record.value === value,
  ));
  if (!wrongValue) throw new Error(`CP003 QL024 has no safe wrong value for ${seed}`);
  const options = records.map((record, index) =>
    index === targetIndex ? pairText(record, wrongValue) : pairText(record),
  );
  if (options.filter(pairTruth).length !== 3) throw new Error(`CP003 QL024 pair composer ambiguity for ${seed}`);
  const canonicalAnswer = options[targetIndex]!;
  const correctValue = records[targetIndex]!.value;
  return finalize({
    qlId: "GEO-RIV-001-QL-024",
    qlName: "Incorrect pair",
    difficulty: "Medium",
    seed,
    stem: "Which of the following pairs is incorrectly matched?",
    canonicalAnswer,
    options,
    correctIndex: targetIndex,
    explanation: `${canonicalAnswer} is incorrect. ${records[targetIndex]!.river} is correctly matched with ${correctValue}.`,
    facts: records.flatMap((record) => record.factIds.map(byId)),
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

const CHAIN_MODES: DirectMode[] = [
  {
    id: "ganga-formation",
    stem: "Which sequence correctly shows how the Ganga gets its name at Devprayag?",
    answer: "Bhagirathi + Alaknanda → Devprayag → Ganga",
    pool: [
      "Bhagirathi + Alaknanda → Devprayag → Ganga",
      "Bhagirathi + Yamuna → Devprayag → Ganga",
      "Alaknanda + Mandakini → Haridwar → Ganga",
      "Bhagirathi + Alaknanda → Rudraprayag → Ganga",
      "Yamuna + Alaknanda → Prayagraj → Ganga",
    ],
    explanation: "The Bhagirathi and Alaknanda meet at Devprayag, and from there the river is known as the Ganga.",
    factIds: ["ganga-formed-bhagirathi-alaknanda", "ganga-formed-at-devprayag"],
    difficulty: "Hard",
  },
  {
    id: "chambal-chain",
    stem: "Which sequence correctly shows the river relation from Chambal to the Ganga?",
    answer: "Chambal → Yamuna → Ganga",
    pool: ["Chambal → Yamuna → Ganga", "Chambal → Ganga → Yamuna", "Chambal → Alaknanda → Ganga", "Chambal → Ghaghara → Ganga", "Chambal → Gandak → Ganga"],
    explanation: "The Chambal is a tributary of the Yamuna, and the Yamuna joins the Ganga at Prayagraj.",
    factIds: ["chambal-yamuna", "yamuna-joins-ganga-prayagraj", "yamuna-confluence-prayagraj"],
    difficulty: "Hard",
  },
  {
    id: "betwa-chain",
    stem: "Which sequence correctly shows the river relation from Betwa to the Ganga?",
    answer: "Betwa → Yamuna → Ganga",
    pool: ["Betwa → Yamuna → Ganga", "Betwa → Ganga → Yamuna", "Betwa → Alaknanda → Ganga", "Betwa → Kosi → Ganga", "Betwa → Sone → Ganga"],
    explanation: "The Betwa is a tributary of the Yamuna, and the Yamuna is a major tributary of the Ganga.",
    factIds: ["betwa-yamuna", "yamuna-ganga"],
    difficulty: "Hard",
  },
  {
    id: "panch-order",
    stem: "Which sequence gives the Panch Prayag in downstream order along the Alaknanda?",
    answer: "Vishnuprayag → Nandprayag → Karnaprayag → Rudraprayag → Devprayag",
    pool: [
      "Vishnuprayag → Nandprayag → Karnaprayag → Rudraprayag → Devprayag",
      "Nandprayag → Vishnuprayag → Karnaprayag → Devprayag → Rudraprayag",
      "Vishnuprayag → Karnaprayag → Nandprayag → Rudraprayag → Devprayag",
      "Devprayag → Rudraprayag → Karnaprayag → Nandprayag → Vishnuprayag",
      "Rudraprayag → Karnaprayag → Nandprayag → Vishnuprayag → Devprayag",
    ],
    explanation: "In downstream order, the five confluences are Vishnuprayag, Nandprayag, Karnaprayag, Rudraprayag and Devprayag.",
    factIds: ["dhauliganga-vishnuprayag", "nandakini-nandprayag", "pindar-karnaprayag", "mandakini-rudraprayag", "bhagirathi-devprayag"],
    difficulty: "Hard",
  },
  {
    id: "kosi-chain",
    stem: "Which sequence correctly describes the Kosi before it reaches the Ganga?",
    answer: "Sun Kosi + Arun Kosi + Tamur Kosi → Kosi → Ganga",
    pool: [
      "Sun Kosi + Arun Kosi + Tamur Kosi → Kosi → Ganga",
      "Sun Kosi + Gandak + Sone → Kosi → Ganga",
      "Arun Kosi + Ghaghara + Tamur Kosi → Gandak → Ganga",
      "Sun Kosi + Arun Kosi + Tamur Kosi → Ghaghara → Ganga",
      "Kosi + Gandak + Sone → Yamuna → Ganga",
    ],
    explanation: "The Kosi is formed by the Sun Kosi, Arun Kosi and Tamur Kosi and later joins the Ganga.",
    factIds: ["kosi-formed-three-streams", "kosi-ganga", "kosi-joins-manihari"],
    difficulty: "Hard",
  },
];

function chainQuestion(seed: string) {
  const mode = deterministicPick(CHAIN_MODES, `${seed}:chain-mode`);
  const optionData = optionsFor(mode.answer, mode.pool, `${seed}:${mode.id}`);
  return finalize({
    qlId: "GEO-RIV-001-QL-025",
    qlName: "River relation chain and order",
    difficulty: mode.difficulty,
    seed,
    stem: mode.stem,
    canonicalAnswer: mode.answer,
    ...optionData,
    explanation: mode.explanation,
    facts: mode.factIds.map(byId),
    solverAuthority: "CONFLUENCE_CHAIN_VERIFIER",
  });
}

type StatementRecord = {
  id: string;
  factIds: string[];
  trueText: string;
  falseTexts: string[];
};

const STATEMENTS: StatementRecord[] = [
  { id: "bhagirathi-source", factIds: ["bhagirathi-source-gangotri-glacier"], trueText: "Bhagirathi originates from Gangotri Glacier.", falseTexts: ["Bhagirathi originates from Yamunotri Glacier.", "Bhagirathi originates from the Amarkantak plateau."] },
  { id: "ganga-devprayag", factIds: ["ganga-formed-at-devprayag"], trueText: "The Ganga takes its name after the Bhagirathi and Alaknanda meet at Devprayag.", falseTexts: ["The Ganga takes its name after the Bhagirathi and Alaknanda meet at Rudraprayag.", "The Ganga takes its name after the Yamuna and Alaknanda meet at Devprayag."] },
  { id: "ganga-haridwar", factIds: ["ganga-enters-plains-haridwar"], trueText: "The Ganga enters the Gangetic Plains at Haridwar.", falseTexts: ["The Ganga enters the Gangetic Plains at Devprayag.", "The Ganga enters the Gangetic Plains at Prayagraj."] },
  { id: "yamuna-source", factIds: ["yamuna-source-yamunotri-glacier"], trueText: "Yamuna originates from Yamunotri Glacier.", falseTexts: ["Yamuna originates from Gangotri Glacier.", "Yamuna originates from the Amarkantak plateau."] },
  { id: "yamuna-confluence", factIds: ["yamuna-confluence-prayagraj"], trueText: "Yamuna meets the Ganga at Prayagraj.", falseTexts: ["Yamuna meets the Ganga at Haridwar.", "Yamuna meets the Ganga near Patna."] },
  { id: "ramganga-bank", factIds: ["ramganga-ganga-bank"], trueText: "Ramganga is a left-bank tributary of the Ganga.", falseTexts: ["Ramganga is a right-bank tributary of the Ganga.", "Ramganga is a tributary of the Yamuna."] },
  { id: "sone-bank", factIds: ["sone-ganga-bank"], trueText: "Sone is a right-bank tributary of the Ganga.", falseTexts: ["Sone is a left-bank tributary of the Ganga.", "Sone is a tributary of the Yamuna."] },
  { id: "gandak-name", factIds: ["gandak-name-narayani"], trueText: "Gandak is also known as Narayani.", falseTexts: ["Ghaghara is also known as Narayani.", "Kosi is also known as Narayani."] },
  { id: "ghaghara-name", factIds: ["ghaghara-upper-name-karnali"], trueText: "Ghaghara is known as Karnali in its upper course.", falseTexts: ["Gandak is known as Karnali in its upper course.", "Sone is known as Karnali in its upper course."] },
  { id: "kosi-name", factIds: ["kosi-sorrow-bihar"], trueText: "Kosi is known as the Sorrow of Bihar.", falseTexts: ["Gandak is known as the Sorrow of Bihar.", "Sone is known as the Sorrow of Bihar."] },
  { id: "chambal-yamuna", factIds: ["chambal-yamuna"], trueText: "Chambal is a tributary of the Yamuna.", falseTexts: ["Chambal is a tributary of the Alaknanda.", "Chambal is a direct tributary of the Ghaghara."] },
  { id: "pindar-prayag", factIds: ["pindar-karnaprayag"], trueText: "Pindar joins the Alaknanda at Karnaprayag.", falseTexts: ["Pindar joins the Alaknanda at Nandprayag.", "Pindar joins the Alaknanda at Rudraprayag."] },
  { id: "mandakini-prayag", factIds: ["mandakini-rudraprayag"], trueText: "Mandakini joins the Alaknanda at Rudraprayag.", falseTexts: ["Mandakini joins the Alaknanda at Vishnuprayag.", "Mandakini joins the Alaknanda at Karnaprayag."] },
  { id: "kosi-formation", factIds: ["kosi-formed-three-streams"], trueText: "Kosi is formed by the Sun Kosi, Arun Kosi and Tamur Kosi.", falseTexts: ["Kosi is formed by the Gandak, Sone and Gomti.", "Kosi is formed by the Chambal, Betwa and Ken."] },
];

function statementText(record: StatementRecord, truth: boolean, seed: string) {
  return truth ? record.trueText : deterministicPick(record.falseTexts, `${seed}:false`);
}

const PAIR_ANSWERS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
] as const;

function pairAnswer(first: boolean, second: boolean) {
  if (first && second) return PAIR_ANSWERS[0];
  if (first) return PAIR_ANSWERS[1];
  if (second) return PAIR_ANSWERS[2];
  return PAIR_ANSWERS[3];
}

function statementPairQuestion(seed: string) {
  const records = deterministicShuffle(STATEMENTS, `${seed}:records`).slice(0, 2);
  const truth = deterministicPick([[true, true], [true, false], [false, true], [false, false]] as const, `${seed}:truth`);
  const shown = records.map((record, index) => statementText(record, truth[index]!, `${seed}:${index}`));
  const canonicalAnswer = pairAnswer(truth[0], truth[1]);
  const optionData = optionsFor(canonicalAnswer, PAIR_ANSWERS, `${seed}:answers`);
  const explanation = records.map((record, index) =>
    `Statement ${index === 0 ? "I" : "II"} is ${truth[index] ? "correct" : "incorrect"}. ${record.trueText}`,
  ).join(" ") + ` Hence, ${canonicalAnswer.toLowerCase()}.`;
  return finalize({
    qlId: "GEO-RIV-001-QL-026",
    qlName: "Statement pair",
    difficulty: "Medium",
    seed,
    stem: ["Consider the following statements:", `I. ${shown[0]}`, `II. ${shown[1]}`, "Which of the above statements is/are correct?"].join("\n"),
    canonicalAnswer,
    ...optionData,
    explanation,
    facts: records.flatMap((record) => record.factIds.map(byId)),
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

const COUNT_ANSWERS = ["None", "One", "Two", "Three"] as const;

function statementCountQuestion(seed: string) {
  const records = deterministicShuffle(STATEMENTS, `${seed}:records`).slice(0, 3);
  const truth = deterministicPick([
    [false, false, false],
    [true, false, false],
    [true, true, false],
    [true, true, true],
    [false, true, true],
    [true, false, true],
  ] as const, `${seed}:truth`);
  const shown = records.map((record, index) => statementText(record, truth[index]!, `${seed}:${index}`));
  const count = truth.filter(Boolean).length;
  const canonicalAnswer = COUNT_ANSWERS[count]!;
  const optionData = optionsFor(canonicalAnswer, COUNT_ANSWERS, `${seed}:answers`);
  const explanation = records.map((record, index) =>
    `Statement ${index + 1} is ${truth[index] ? "correct" : "incorrect"}. ${record.trueText}`,
  ).join(" ") + ` Hence, ${count === 0 ? "none of the statements is" : count === 1 ? "one statement is" : count === 2 ? "two statements are" : "all three statements are"} correct.`;
  return finalize({
    qlId: "GEO-RIV-001-QL-027",
    qlName: "Multi-statement count",
    difficulty: "Hard",
    seed,
    stem: ["Consider the following statements:", ...shown.map((text, index) => `${index + 1}. ${text}`), "How many of the above statements are correct?"].join("\n"),
    canonicalAnswer,
    ...optionData,
    explanation,
    facts: records.flatMap((record) => record.factIds.map(byId)),
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp003ReviewV1(qlId: string, seed: string): GeoRiv001Cp003ReviewQuestion {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP003 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-019") return directQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-020") return reverseQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-021") return tributaryQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-022") return panchQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-023") return correctPairQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-024") return incorrectPairQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-025") return chainQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-026") return statementPairQuestion(seed);
  if (qlId === "GEO-RIV-001-QL-027") return statementCountQuestion(seed);
  throw new Error(`Unknown GEO-RIV-001 CP003 QL ${qlId}`);
}
