import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp005-editorial-review-v1";
import type { GeoRiv001Cp005ReviewQuestion } from "./geo-riv-001-cp005-review-types";

const FACTS = GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1;

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-037": "Direct source and course association",
  "GEO-RIV-001-QL-038": "Reverse association",
  "GEO-RIV-001-QL-039": "Tributary and river-system identification",
  "GEO-RIV-001-QL-040": "Formation and tributary hierarchy",
  "GEO-RIV-001-QL-041": "Correct pair",
  "GEO-RIV-001-QL-042": "Incorrect pair",
  "GEO-RIV-001-QL-043": "River relation chain and order",
  "GEO-RIV-001-QL-044": "Statement I and II",
  "GEO-RIV-001-QL-045": "Multi-statement count",
};

function byId(id: string) {
  const fact = FACTS.find((entry) => entry.factId === `geo-riv-001-cp005-${id}`);
  if (!fact) throw new Error(`Missing CP005 fact ${id}`);
  return fact;
}

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function build(args: {
  qlId: string;
  seed: string;
  stem: string;
  answer: string;
  optionPool: readonly string[];
  explanation: string;
  factIds: readonly string[];
  difficulty: KnowledgeV1Difficulty;
  solverAuthority?: GeoRiv001Cp005ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp005ReviewQuestion {
  const distractors = deterministicShuffle(unique(args.optionPool.filter((x) => x !== args.answer)), `${args.seed}:${args.qlId}:distractors`).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP005 requires three distractors for ${args.answer}`);
  const rows = deterministicShuffle(
    [{ text: args.answer, correct: true }, ...distractors.map((text) => ({ text, correct: false }))],
    `${args.seed}:${args.qlId}:options`,
  );
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  const facts = args.factIds.map(byId);
  assertKnowledgeQuestionValid({ stem: args.stem, explanation: args.explanation, options, correctIndex, canonicalAnswer: args.answer });
  return {
    questionId: `GEO-RIV-001-CP005-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP005",
    qlId: args.qlId,
    qlName: QL_NAMES[args.qlId] ?? args.qlId,
    difficulty: args.difficulty,
    stem: args.stem,
    options,
    correctIndex,
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: unique(facts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority ?? "CANONICAL_FACT_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

type Mode = {
  stem: string;
  answer: string;
  pool: string[];
  explanation: string;
  factIds: string[];
  difficulty: KnowledgeV1Difficulty;
};

const DIRECT_MODES: Mode[] = [
  { stem: "The Godavari rises near which place in Maharashtra?", answer: "Trimbakeshwar", pool: ["Trimbakeshwar", "Mahabaleshwar", "Talakaveri", "Sihawa Hills", "Nagri near Ranchi"], explanation: "The Godavari rises in the Trimbakeshwar area of Nashik district in Maharashtra.", factIds: ["godavari-source-trimbakeshwar", "godavari-source-district"], difficulty: "Easy" },
  { stem: "The Krishna rises near which hill station in the Western Ghats?", answer: "Mahabaleshwar", pool: ["Mahabaleshwar", "Trimbakeshwar", "Talakaveri", "Sihawa Hills", "Nandidurg"], explanation: "The Krishna rises just north of Mahabaleshwar in the Western Ghats of Maharashtra.", factIds: ["krishna-source-mahabaleshwar", "krishna-source-state"], difficulty: "Easy" },
  { stem: "The Mahanadi originates in which hill region of Chhattisgarh?", answer: "Sihawa Hills", pool: ["Sihawa Hills", "Brahmagiri Range", "Nandidurg Range", "Keonjhar Hills", "Aravalli Range"], explanation: "The Mahanadi originates in the Sihawa Hills of Dhamtari district in Chhattisgarh.", factIds: ["mahanadi-source-sihawa", "mahanadi-source-state"], difficulty: "Easy" },
  { stem: "The Cauvery originates at which place in Karnataka?", answer: "Talakaveri", pool: ["Talakaveri", "Trimbakeshwar", "Mahabaleshwar", "Nagri near Ranchi", "Sihawa Hills"], explanation: "The Cauvery originates at Talakaveri in the Brahmagiri Range of Karnataka.", factIds: ["cauvery-source-talakaveri", "cauvery-source-range", "cauvery-source-state"], difficulty: "Easy" },
  { stem: "The Pennar rises in which range of Karnataka?", answer: "Nandidurg Range", pool: ["Nandidurg Range", "Brahmagiri Range", "Aravalli Range", "Satpura Range", "Sihawa Hills"], explanation: "The Pennar rises at Chenna Kasava Hill in the Nandidurg Range of Karnataka.", factIds: ["pennar-source-hill", "pennar-source-range", "pennar-source-state"], difficulty: "Medium" },
  { stem: "The Subarnarekha originates near which place?", answer: "Nagri near Ranchi", pool: ["Nagri near Ranchi", "Talakaveri", "Mahabaleshwar", "Trimbakeshwar", "Sihawa Hills"], explanation: "The Subarnarekha originates near Nagri in Ranchi district of Jharkhand.", factIds: ["subarnarekha-source"], difficulty: "Medium" },
  { stem: "Which river is also known as the Dakshin Ganga?", answer: "Godavari", pool: ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar"], explanation: "The Godavari is also known as the Dakshin Ganga. It rises in Maharashtra and flows east to the Bay of Bengal.", factIds: ["godavari-dakshin-ganga", "godavari-mouth"], difficulty: "Easy" },
  { stem: "Kaveri is an alternative spelling of which river name?", answer: "Cauvery", pool: ["Cauvery", "Krishna", "Godavari", "Pennar", "Baitarani"], explanation: "Kaveri and Cauvery are alternative spellings of the same river name.", factIds: ["cauvery-alias-kaveri"], difficulty: "Easy" },
  { stem: "The Baitarani originates in which hill region of Odisha?", answer: "Keonjhar Hills", pool: ["Keonjhar Hills", "Sihawa Hills", "Brahmagiri Range", "Nandidurg Range", "Rajmahal Hills"], explanation: "The Baitarani originates in the Keonjhar hill region of Odisha, associated with the Gonasika area.", factIds: ["baitarani-source"], difficulty: "Medium" },
];

const REVERSE_MODES: Mode[] = [
  { stem: "Talakaveri is the source place of which river?", answer: "Cauvery", pool: ["Cauvery", "Krishna", "Godavari", "Pennar", "Mahanadi"], explanation: "Talakaveri in the Brahmagiri Range is the source place of the Cauvery.", factIds: ["cauvery-source-talakaveri", "cauvery-source-range"], difficulty: "Easy" },
  { stem: "Mahabaleshwar is the source region of which major east-flowing river?", answer: "Krishna", pool: ["Krishna", "Godavari", "Mahanadi", "Cauvery", "Pennar"], explanation: "The Krishna rises just north of Mahabaleshwar in Maharashtra.", factIds: ["krishna-source-mahabaleshwar"], difficulty: "Easy" },
  { stem: "Trimbakeshwar is linked with the source of which river?", answer: "Godavari", pool: ["Godavari", "Krishna", "Cauvery", "Mahanadi", "Pennar"], explanation: "The Godavari rises in the Trimbakeshwar area of Nashik district.", factIds: ["godavari-source-trimbakeshwar", "godavari-source-district"], difficulty: "Easy" },
  { stem: "Sihawa Hills are the source region of which river?", answer: "Mahanadi", pool: ["Mahanadi", "Godavari", "Krishna", "Pennar", "Subarnarekha"], explanation: "The Mahanadi originates in the Sihawa Hills of Chhattisgarh.", factIds: ["mahanadi-source-sihawa", "mahanadi-source-state"], difficulty: "Medium" },
  { stem: "Nandidurg Range is the source range of which east-flowing river?", answer: "Pennar", pool: ["Pennar", "Cauvery", "Krishna", "Godavari", "Mahanadi"], explanation: "The Pennar rises in the Nandidurg Range of Karnataka.", factIds: ["pennar-source-range", "pennar-source-state"], difficulty: "Medium" },
  { stem: "Nagri near Ranchi is the source area of which river?", answer: "Subarnarekha", pool: ["Subarnarekha", "Baitarani", "Brahmani", "Mahanadi", "Pennar"], explanation: "The Subarnarekha originates near Nagri in Ranchi district.", factIds: ["subarnarekha-source"], difficulty: "Medium" },
  { stem: "Which river is referred to by the alternative spelling Kaveri?", answer: "Cauvery", pool: ["Cauvery", "Krishna", "Godavari", "Pennar", "Brahmani"], explanation: "Kaveri is an alternative spelling of Cauvery; both names refer to the same river.", factIds: ["cauvery-alias-kaveri"], difficulty: "Easy" },
  { stem: "The name Dakshin Ganga refers to which Peninsular river?", answer: "Godavari", pool: ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Brahmani"], explanation: "Dakshin Ganga is a traditional name used for the Godavari.", factIds: ["godavari-dakshin-ganga"], difficulty: "Easy" },
];

const PARENT_MODES: Array<[string, string, string, KnowledgeV1Difficulty]> = [
  ["Pranhita", "Godavari", "pranhita-godavari-tributary", "Medium"],
  ["Indravati", "Godavari", "indravati-godavari-tributary", "Medium"],
  ["Sabari", "Godavari", "sabari-godavari-tributary", "Medium"],
  ["Tungabhadra", "Krishna", "tungabhadra-krishna-tributary", "Medium"],
  ["Bhima", "Krishna", "bhima-krishna-tributary", "Easy"],
  ["Musi", "Krishna", "musi-krishna-tributary", "Medium"],
  ["Hasdeo", "Mahanadi", "hasdeo-mahanadi-tributary", "Medium"],
  ["Tel", "Mahanadi", "tel-mahanadi-tributary", "Medium"],
  ["Kabini", "Cauvery", "kabini-cauvery-tributary", "Medium"],
  ["Bhavani", "Cauvery", "bhavani-cauvery-tributary", "Medium"],
  ["Chitravati", "Pennar", "chitravati-pennar-tributary", "Medium"],
  ["Papagni", "Pennar", "papagni-pennar-tributary", "Medium"],
  ["Salandi", "Baitarani", "salandi-baitarani-tributary", "Medium"],
  ["Kharkai", "Subarnarekha", "kharkai-subarnarekha-tributary", "Medium"],
];

const BANK_MODES: Array<{ parent: string; bank: "left bank" | "right bank"; answer: string; opposite: string[]; factId: string }> = [
  { parent: "Godavari", bank: "left bank", answer: "Indravati", opposite: ["Pravara", "Manjira", "Darna"], factId: "indravati-godavari-tributary" },
  { parent: "Godavari", bank: "right bank", answer: "Pravara", opposite: ["Purna", "Pranhita", "Sabari"], factId: "pravara-godavari-tributary" },
  { parent: "Krishna", bank: "left bank", answer: "Bhima", opposite: ["Ghataprabha", "Malaprabha", "Tungabhadra"], factId: "bhima-krishna-tributary" },
  { parent: "Krishna", bank: "right bank", answer: "Tungabhadra", opposite: ["Bhima", "Musi", "Munneru"], factId: "tungabhadra-krishna-tributary" },
  { parent: "Mahanadi", bank: "left bank", answer: "Hasdeo", opposite: ["Ong", "Tel", "Jonk"], factId: "hasdeo-mahanadi-tributary" },
  { parent: "Mahanadi", bank: "right bank", answer: "Tel", opposite: ["Seonath", "Hasdeo", "Ib"], factId: "tel-mahanadi-tributary" },
  { parent: "Cauvery", bank: "left bank", answer: "Hemavati", opposite: ["Kabini", "Bhavani", "Amaravati"], factId: "hemavati-cauvery-tributary" },
  { parent: "Cauvery", bank: "right bank", answer: "Kabini", opposite: ["Harangi", "Hemavati", "Shimsha"], factId: "kabini-cauvery-tributary" },
  { parent: "Pennar", bank: "left bank", answer: "Kunderu", opposite: ["Chitravati", "Papagni", "Cheyyeru"], factId: "kunderu-pennar-tributary" },
  { parent: "Pennar", bank: "right bank", answer: "Chitravati", opposite: ["Jayamangali", "Kunderu", "Sagileru"], factId: "chitravati-pennar-tributary" },
];

function ql039(seed: string) {
  const mode = deterministicPick(["parent", "parent", "bank"] as const, `${seed}:mode`);
  if (mode === "parent") {
    const [river, parent, factId, difficulty] = deterministicPick(PARENT_MODES, `${seed}:parent`);
    return build({ qlId: "GEO-RIV-001-QL-039", seed, stem: `${river} is a tributary of which river?`, answer: parent, optionPool: ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar", "Baitarani", "Subarnarekha"], explanation: `${river} is a tributary of the ${parent}.`, factIds: [factId], difficulty, solverAuthority: "RELATION_CLASS_COMPOSER" });
  }
  const bank = deterministicPick(BANK_MODES, `${seed}:bank`);
  return build({ qlId: "GEO-RIV-001-QL-039", seed, stem: `Which of the following is a ${bank.bank} tributary of the ${bank.parent}?`, answer: bank.answer, optionPool: [bank.answer, ...bank.opposite], explanation: `${bank.answer} is a ${bank.bank} tributary of the ${bank.parent}.`, factIds: [bank.factId], difficulty: "Medium", solverAuthority: "RELATION_CLASS_COMPOSER" });
}

const FORMATION_MODES: Mode[] = [
  { stem: "The Wardha and Wainganga combine to form which important tributary of the Godavari?", answer: "Pranhita", pool: ["Pranhita", "Indravati", "Sabari", "Manjira", "Purna"], explanation: "The Wardha and Wainganga combine to form the Pranhita, which is a major left-bank tributary of the Godavari.", factIds: ["wardha-pranhita-tributary", "wainganga-pranhita-tributary", "pranhita-godavari-tributary"], difficulty: "Hard" },
  { stem: "The Pranhita is a major tributary of which river?", answer: "Godavari", pool: ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar"], explanation: "The Pranhita is a major left-bank tributary of the Godavari and carries the combined Wardha–Wainganga waters.", factIds: ["pranhita-godavari-tributary", "wardha-pranhita-tributary", "wainganga-pranhita-tributary"], difficulty: "Medium" },
  { stem: "Which two rivers unite to form the Tungabhadra?", answer: "Tunga and Bhadra", pool: ["Tunga and Bhadra", "Wardha and Wainganga", "Sankh and Koel", "Bhima and Musi", "Kabini and Bhavani"], explanation: "The Tunga and Bhadra unite to form the Tungabhadra, which later joins the Krishna.", factIds: ["tungabhadra-formed-tunga-bhadra", "tungabhadra-krishna-tributary"], difficulty: "Hard" },
  { stem: "The Tungabhadra is a major tributary of which river?", answer: "Krishna", pool: ["Krishna", "Godavari", "Cauvery", "Mahanadi", "Pennar"], explanation: "The Tungabhadra is a major right-bank tributary of the Krishna. It is formed by the Tunga and Bhadra rivers.", factIds: ["tungabhadra-krishna-tributary", "tungabhadra-formed-tunga-bhadra"], difficulty: "Medium" },
  { stem: "Which two rivers join to form the Brahmani?", answer: "Sankh and Koel", pool: ["Sankh and Koel", "Tunga and Bhadra", "Wardha and Wainganga", "Bhima and Musi", "Ong and Tel"], explanation: "The Sankh and Koel meet near the Rourkela–Vedavyas area to form the Brahmani.", factIds: ["brahmani-formed-sankh-koel"], difficulty: "Medium" },
];

const CORRECT_PAIR_MODES: Mode[] = [
  { stem: "Which of the following pairs is correctly matched?", answer: "Godavari — Trimbakeshwar", pool: ["Godavari — Trimbakeshwar", "Godavari — Talakaveri", "Godavari — Sihawa Hills", "Godavari — Mahabaleshwar", "Godavari — Nandidurg Range"], explanation: "The Godavari rises in the Trimbakeshwar area of Nashik district in Maharashtra.", factIds: ["godavari-source-trimbakeshwar"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Krishna — Mahabaleshwar", pool: ["Krishna — Mahabaleshwar", "Krishna — Talakaveri", "Krishna — Sihawa Hills", "Krishna — Nagri near Ranchi", "Krishna — Keonjhar Hills"], explanation: "The Krishna rises just north of Mahabaleshwar in the Western Ghats.", factIds: ["krishna-source-mahabaleshwar"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Mahanadi — Sihawa Hills", pool: ["Mahanadi — Sihawa Hills", "Mahanadi — Trimbakeshwar", "Mahanadi — Talakaveri", "Mahanadi — Nandidurg Range", "Mahanadi — Mahabaleshwar"], explanation: "The Mahanadi originates in the Sihawa Hills of Chhattisgarh.", factIds: ["mahanadi-source-sihawa"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Cauvery — Talakaveri", pool: ["Cauvery — Talakaveri", "Cauvery — Sihawa Hills", "Cauvery — Trimbakeshwar", "Cauvery — Mahabaleshwar", "Cauvery — Keonjhar Hills"], explanation: "The Cauvery rises at Talakaveri in the Brahmagiri Range of Karnataka.", factIds: ["cauvery-source-talakaveri", "cauvery-source-range"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Pennar — Nandidurg Range", pool: ["Pennar — Nandidurg Range", "Pennar — Brahmagiri Range", "Pennar — Sihawa Hills", "Pennar — Mahabaleshwar", "Pennar — Trimbakeshwar"], explanation: "The Pennar rises in the Nandidurg Range of Karnataka.", factIds: ["pennar-source-range"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Brahmani — Sankh and Koel", pool: ["Brahmani — Sankh and Koel", "Brahmani — Tunga and Bhadra", "Brahmani — Wardha and Wainganga", "Brahmani — Bhima and Musi", "Brahmani — Kabini and Bhavani"], explanation: "The Sankh and Koel join to form the Brahmani near the Rourkela–Vedavyas area.", factIds: ["brahmani-formed-sankh-koel"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Baitarani — Keonjhar Hills", pool: ["Baitarani — Keonjhar Hills", "Baitarani — Talakaveri", "Baitarani — Sihawa Hills", "Baitarani — Mahabaleshwar", "Baitarani — Nandidurg Range"], explanation: "The Baitarani originates in the Keonjhar hill region of Odisha.", factIds: ["baitarani-source"], difficulty: "Medium" },
  { stem: "Which of the following pairs is correctly matched?", answer: "Subarnarekha — Nagri near Ranchi", pool: ["Subarnarekha — Nagri near Ranchi", "Subarnarekha — Talakaveri", "Subarnarekha — Sihawa Hills", "Subarnarekha — Trimbakeshwar", "Subarnarekha — Mahabaleshwar"], explanation: "The Subarnarekha originates near Nagri in Ranchi district of Jharkhand.", factIds: ["subarnarekha-source"], difficulty: "Medium" },
];

const INCORRECT_PAIR_MODES: Mode[] = [
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Godavari — Talakaveri", pool: ["Godavari — Talakaveri", "Godavari — Trimbakeshwar", "Krishna — Mahabaleshwar", "Mahanadi — Sihawa Hills", "Cauvery — Talakaveri"], explanation: "Godavari — Talakaveri is incorrect. The Godavari rises near Trimbakeshwar; Talakaveri is the source of the Cauvery.", factIds: ["godavari-source-trimbakeshwar", "cauvery-source-talakaveri"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Krishna — Sihawa Hills", pool: ["Krishna — Sihawa Hills", "Krishna — Mahabaleshwar", "Godavari — Trimbakeshwar", "Pennar — Nandidurg Range", "Subarnarekha — Nagri near Ranchi"], explanation: "Krishna — Sihawa Hills is incorrect. The Krishna rises near Mahabaleshwar; the Sihawa Hills are the source region of the Mahanadi.", factIds: ["krishna-source-mahabaleshwar", "mahanadi-source-sihawa"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Mahanadi — Mahabaleshwar", pool: ["Mahanadi — Mahabaleshwar", "Mahanadi — Sihawa Hills", "Cauvery — Talakaveri", "Godavari — Trimbakeshwar", "Baitarani — Keonjhar Hills"], explanation: "Mahanadi — Mahabaleshwar is incorrect. The Mahanadi originates in the Sihawa Hills; Mahabaleshwar is linked with the Krishna source.", factIds: ["mahanadi-source-sihawa", "krishna-source-mahabaleshwar"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Cauvery — Nandidurg Range", pool: ["Cauvery — Nandidurg Range", "Cauvery — Talakaveri", "Pennar — Nandidurg Range", "Krishna — Mahabaleshwar", "Mahanadi — Sihawa Hills"], explanation: "Cauvery — Nandidurg Range is incorrect. The Cauvery rises at Talakaveri in the Brahmagiri Range; the Pennar rises in the Nandidurg Range.", factIds: ["cauvery-source-talakaveri", "cauvery-source-range", "pennar-source-range"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Pennar — Talakaveri", pool: ["Pennar — Talakaveri", "Pennar — Nandidurg Range", "Subarnarekha — Nagri near Ranchi", "Baitarani — Keonjhar Hills", "Krishna — Mahabaleshwar"], explanation: "Pennar — Talakaveri is incorrect. The Pennar rises in the Nandidurg Range; Talakaveri is the source of the Cauvery.", factIds: ["pennar-source-range", "cauvery-source-talakaveri"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Brahmani — Tunga and Bhadra", pool: ["Brahmani — Tunga and Bhadra", "Brahmani — Sankh and Koel", "Cauvery — Talakaveri", "Godavari — Trimbakeshwar", "Mahanadi — Sihawa Hills"], explanation: "Brahmani — Tunga and Bhadra is incorrect. The Brahmani is formed by the Sankh and Koel; the Tunga and Bhadra form the Tungabhadra.", factIds: ["brahmani-formed-sankh-koel", "tungabhadra-formed-tunga-bhadra"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Baitarani — Nagri near Ranchi", pool: ["Baitarani — Nagri near Ranchi", "Baitarani — Keonjhar Hills", "Subarnarekha — Nagri near Ranchi", "Pennar — Nandidurg Range", "Krishna — Mahabaleshwar"], explanation: "Baitarani — Nagri near Ranchi is incorrect. The Baitarani rises in the Keonjhar hill region; the Subarnarekha rises near Nagri in Ranchi district.", factIds: ["baitarani-source", "subarnarekha-source"], difficulty: "Medium" },
  { stem: "Which of the following pairs is incorrectly matched?", answer: "Subarnarekha — Sihawa Hills", pool: ["Subarnarekha — Sihawa Hills", "Subarnarekha — Nagri near Ranchi", "Mahanadi — Sihawa Hills", "Cauvery — Talakaveri", "Godavari — Trimbakeshwar"], explanation: "Subarnarekha — Sihawa Hills is incorrect. The Subarnarekha rises near Nagri in Ranchi district; the Mahanadi originates in the Sihawa Hills.", factIds: ["subarnarekha-source", "mahanadi-source-sihawa"], difficulty: "Medium" },
];

const CHAIN_MODES: Mode[] = [
  { stem: "Which sequence correctly shows the Wardha–Wainganga relation within the Godavari system?", answer: "Wardha + Wainganga → Pranhita → Godavari", pool: ["Wardha + Wainganga → Pranhita → Godavari", "Wardha + Wainganga → Tungabhadra → Krishna", "Wardha + Wainganga → Brahmani → Bay of Bengal", "Wardha + Wainganga → Pennar → Bay of Bengal", "Wardha + Wainganga → Cauvery → Bay of Bengal"], explanation: "The Wardha and Wainganga combine to form the Pranhita, and the Pranhita joins the Godavari.", factIds: ["wardha-pranhita-tributary", "wainganga-pranhita-tributary", "pranhita-godavari-tributary"], difficulty: "Hard" },
  { stem: "Which sequence correctly represents the Tungabhadra relation?", answer: "Tunga + Bhadra → Tungabhadra → Krishna", pool: ["Tunga + Bhadra → Tungabhadra → Krishna", "Tunga + Bhadra → Pranhita → Godavari", "Tunga + Bhadra → Brahmani → Bay of Bengal", "Tunga + Bhadra → Pennar → Bay of Bengal", "Tunga + Bhadra → Mahanadi → Bay of Bengal"], explanation: "The Tunga and Bhadra form the Tungabhadra, which is a major right-bank tributary of the Krishna.", factIds: ["tungabhadra-formed-tunga-bhadra", "tungabhadra-krishna-tributary"], difficulty: "Hard" },
  { stem: "Which sequence correctly represents the formation and outfall of the Brahmani?", answer: "Sankh + Koel → Brahmani → Bay of Bengal", pool: ["Sankh + Koel → Brahmani → Bay of Bengal", "Sankh + Koel → Pranhita → Godavari", "Sankh + Koel → Tungabhadra → Krishna", "Sankh + Koel → Pennar → Bay of Bengal", "Sankh + Koel → Cauvery → Bay of Bengal"], explanation: "The Sankh and Koel join to form the Brahmani, which ultimately drains into the Bay of Bengal.", factIds: ["brahmani-formed-sankh-koel", "brahmani-mouth"], difficulty: "Hard" },
  { stem: "Which sequence correctly traces the Cauvery from source to sea?", answer: "Talakaveri → Cauvery/Kaveri → Bay of Bengal", pool: ["Talakaveri → Cauvery/Kaveri → Bay of Bengal", "Talakaveri → Krishna → Bay of Bengal", "Talakaveri → Godavari → Bay of Bengal", "Talakaveri → Pennar → Arabian Sea", "Talakaveri → Mahanadi → Arabian Sea"], explanation: "The Cauvery, also spelled Kaveri, rises at Talakaveri and drains eastward into the Bay of Bengal.", factIds: ["cauvery-source-talakaveri", "cauvery-alias-kaveri", "cauvery-mouth"], difficulty: "Hard" },
];

const STATEMENT_OPTIONS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
];

const STATEMENT_MODES: Array<{ stem: string; answer: string; explanation: string; factIds: string[] }> = [
  { stem: "Consider the following statements:\nStatement I: The Godavari rises near Trimbakeshwar.\nStatement II: The Godavari is also known as Dakshin Ganga.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[0], explanation: "Both statements are correct. The Godavari rises near Trimbakeshwar in Maharashtra and is also known as the Dakshin Ganga.", factIds: ["godavari-source-trimbakeshwar", "godavari-dakshin-ganga"] },
  { stem: "Consider the following statements:\nStatement I: The Krishna rises near Mahabaleshwar.\nStatement II: The Krishna rises at Talakaveri.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[1], explanation: "Only Statement I is correct. The Krishna rises near Mahabaleshwar; Talakaveri is the source of the Cauvery.", factIds: ["krishna-source-mahabaleshwar", "cauvery-source-talakaveri"] },
  { stem: "Consider the following statements:\nStatement I: The Cauvery rises in the Sihawa Hills.\nStatement II: The Cauvery rises at Talakaveri in Karnataka.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[2], explanation: "Only Statement II is correct. The Cauvery rises at Talakaveri in Karnataka; the Sihawa Hills are the source region of the Mahanadi.", factIds: ["cauvery-source-talakaveri", "cauvery-source-state", "mahanadi-source-sihawa"] },
  { stem: "Consider the following statements:\nStatement I: The Pennar rises near Mahabaleshwar.\nStatement II: The Mahanadi rises at Talakaveri.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[3], explanation: "Neither statement is correct. The Pennar rises in the Nandidurg Range, while the Mahanadi originates in the Sihawa Hills.", factIds: ["pennar-source-range", "mahanadi-source-sihawa"] },
  { stem: "Consider the following statements:\nStatement I: Pranhita is a tributary of the Godavari.\nStatement II: Tungabhadra is a tributary of the Krishna.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[0], explanation: "Both statements are correct. Pranhita joins the Godavari, while Tungabhadra is a major right-bank tributary of the Krishna.", factIds: ["pranhita-godavari-tributary", "tungabhadra-krishna-tributary"] },
  { stem: "Consider the following statements:\nStatement I: The Brahmani is formed by the Sankh and Koel.\nStatement II: The Subarnarekha originates in the Nandidurg Range.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[1], explanation: "Only Statement I is correct. The Brahmani is formed by the Sankh and Koel; the Subarnarekha originates near Nagri in Ranchi district.", factIds: ["brahmani-formed-sankh-koel", "subarnarekha-source"] },
  { stem: "Consider the following statements:\nStatement I: Kabini is a left-bank tributary of the Cauvery.\nStatement II: Hemavati is a left-bank tributary of the Cauvery.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[2], explanation: "Only Statement II is correct. Hemavati is a left-bank tributary of the Cauvery, whereas Kabini is a right-bank tributary.", factIds: ["kabini-cauvery-tributary", "hemavati-cauvery-tributary"] },
  { stem: "Consider the following statements:\nStatement I: Bhima is a right-bank tributary of the Krishna.\nStatement II: Tel is a left-bank tributary of the Mahanadi.\nWhich of the statements given above is/are correct?", answer: STATEMENT_OPTIONS[3], explanation: "Neither statement is correct. Bhima is a left-bank tributary of the Krishna, while Tel is a right-bank tributary of the Mahanadi.", factIds: ["bhima-krishna-tributary", "tel-mahanadi-tributary"] },
];

const COUNT_OPTIONS = ["None", "One", "Two", "Three"];
const COUNT_MODES: Array<{ stem: string; answer: string; explanation: string; factIds: string[] }> = [
  { stem: "How many of the following statements are correct?\n1. The Pennar rises near Mahabaleshwar.\n2. The Krishna rises at Talakaveri.\n3. The Mahanadi rises in the Nandidurg Range.", answer: "None", explanation: "None is correct. Pennar rises in the Nandidurg Range, Krishna near Mahabaleshwar, and Mahanadi in the Sihawa Hills.", factIds: ["pennar-source-range", "krishna-source-mahabaleshwar", "mahanadi-source-sihawa"] },
  { stem: "How many of the following statements are correct?\n1. The Godavari rises near Trimbakeshwar.\n2. The Cauvery rises near Mahabaleshwar.\n3. The Subarnarekha rises in the Sihawa Hills.", answer: "One", explanation: "Only the first statement is correct. Godavari rises near Trimbakeshwar; Cauvery rises at Talakaveri, and Subarnarekha near Nagri in Ranchi district.", factIds: ["godavari-source-trimbakeshwar", "cauvery-source-talakaveri", "subarnarekha-source"] },
  { stem: "How many of the following statements are correct?\n1. Pranhita is a tributary of the Godavari.\n2. Tungabhadra is a tributary of the Krishna.\n3. Kabini is a left-bank tributary of the Cauvery.", answer: "Two", explanation: "Two statements are correct. Pranhita joins the Godavari and Tungabhadra joins the Krishna; Kabini is a right-bank tributary of the Cauvery.", factIds: ["pranhita-godavari-tributary", "tungabhadra-krishna-tributary", "kabini-cauvery-tributary"] },
  { stem: "How many of the following statements are correct?\n1. Mahanadi originates in the Sihawa Hills.\n2. Pennar rises in the Nandidurg Range.\n3. Baitarani originates in the Keonjhar hill region.", answer: "Three", explanation: "All three statements are correct: Mahanadi originates in the Sihawa Hills, Pennar in the Nandidurg Range, and Baitarani in the Keonjhar hill region.", factIds: ["mahanadi-source-sihawa", "pennar-source-range", "baitarani-source"] },
];

function fromMode(qlId: string, seed: string, mode: Mode, solverAuthority?: GeoRiv001Cp005ReviewQuestion["solverAuthority"]) {
  return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: mode.pool, explanation: mode.explanation, factIds: mode.factIds, difficulty: mode.difficulty, solverAuthority });
}

export function generateGeoRiv001Cp005ReviewV1(qlId: string, seed: string): GeoRiv001Cp005ReviewQuestion {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP005 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-037") return fromMode(qlId, seed, deterministicPick(DIRECT_MODES, `${seed}:direct`));
  if (qlId === "GEO-RIV-001-QL-038") return fromMode(qlId, seed, deterministicPick(REVERSE_MODES, `${seed}:reverse`));
  if (qlId === "GEO-RIV-001-QL-039") return ql039(seed);
  if (qlId === "GEO-RIV-001-QL-040") return fromMode(qlId, seed, deterministicPick(FORMATION_MODES, `${seed}:formation`), "CONFLUENCE_CHAIN_VERIFIER");
  if (qlId === "GEO-RIV-001-QL-041") return fromMode(qlId, seed, deterministicPick(CORRECT_PAIR_MODES, `${seed}:correct-pair`), "RELATION_CLASS_COMPOSER");
  if (qlId === "GEO-RIV-001-QL-042") return fromMode(qlId, seed, deterministicPick(INCORRECT_PAIR_MODES, `${seed}:incorrect-pair`), "RELATION_CLASS_COMPOSER");
  if (qlId === "GEO-RIV-001-QL-043") return fromMode(qlId, seed, deterministicPick(CHAIN_MODES, `${seed}:chain`), "CONFLUENCE_CHAIN_VERIFIER");
  if (qlId === "GEO-RIV-001-QL-044") {
    const mode = deterministicPick(STATEMENT_MODES, `${seed}:statements`);
    return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: STATEMENT_OPTIONS, explanation: mode.explanation, factIds: mode.factIds, difficulty: "Medium", solverAuthority: "STATEMENT_COMPOSITION_VERIFIER" });
  }
  if (qlId === "GEO-RIV-001-QL-045") {
    const mode = deterministicPick(COUNT_MODES, `${seed}:count`);
    return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: COUNT_OPTIONS, explanation: mode.explanation, factIds: mode.factIds, difficulty: "Hard", solverAuthority: "STATEMENT_COMPOSITION_VERIFIER" });
  }
  throw new Error(`Unsupported GEO-RIV-001 CP005 QL ${qlId}`);
}
