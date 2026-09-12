import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp004-editorial-review-v1";
import type { GeoRiv001Cp004ReviewQuestion } from "./geo-riv-001-cp004-review-types";

const FACTS = GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1;

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-028": "Direct course and name association",
  "GEO-RIV-001-QL-029": "Reverse association",
  "GEO-RIV-001-QL-030": "Tributary and bank-side identification",
  "GEO-RIV-001-QL-031": "Confluence and name transition",
  "GEO-RIV-001-QL-032": "Correct pair",
  "GEO-RIV-001-QL-033": "Incorrect pair",
  "GEO-RIV-001-QL-034": "River relation chain and order",
  "GEO-RIV-001-QL-035": "Statement I and II",
  "GEO-RIV-001-QL-036": "Multi-statement count",
};

function byId(id: string) {
  const fact = FACTS.find((entry) => entry.factId === `geo-riv-001-cp004-${id}`);
  if (!fact) throw new Error(`Missing CP004 fact ${id}`);
  return fact;
}

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function optionsFor(correct: string, pool: readonly string[], seed: string) {
  const distractors = deterministicShuffle(unique(pool.filter((x) => x !== correct)), `${seed}:distractors`).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP004 requires three distractors for ${correct}`);
  const rows = deterministicShuffle([
    { text: correct, correct: true },
    ...distractors.map((text) => ({ text, correct: false })),
  ], `${seed}:options`);
  return { options: rows.map((row) => row.text), correctIndex: rows.findIndex((row) => row.correct) };
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
  solverAuthority?: GeoRiv001Cp004ReviewQuestion["solverAuthority"];
}) {
  const facts = args.factIds.map(byId);
  const optionData = optionsFor(args.answer, args.optionPool, `${args.seed}:${args.qlId}`);
  assertKnowledgeQuestionValid({
    stem: args.stem,
    explanation: args.explanation,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: args.answer,
  });
  return {
    questionId: `GEO-RIV-001-CP004-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001" as const,
    cpId: "GEO-RIV-001-CP004" as const,
    qlId: args.qlId,
    qlName: QL_NAMES[args.qlId] ?? args.qlId,
    difficulty: args.difficulty,
    stem: args.stem,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: unique(facts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority ?? "CANONICAL_FACT_RELATION",
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  } satisfies GeoRiv001Cp004ReviewQuestion;
}

type DirectMode = {
  stem: string;
  answer: string;
  pool: string[];
  explanation: string;
  factIds: string[];
  difficulty: KnowledgeV1Difficulty;
};

const DIRECT_MODES: DirectMode[] = [
  { stem: "What is the Brahmaputra known as in Tibet?", answer: "Tsangpo", pool: ["Tsangpo", "Jamuna", "Siang", "Padma", "Sone"], explanation: "In Tibet, the Brahmaputra is known as the Tsangpo. The name Yarlung Tsangpo is also used.", factIds: ["brahmaputra-tibet-name-tsangpo", "brahmaputra-tibet-name-yarlung"], difficulty: "Easy" },
  { stem: "Through which state does the Brahmaputra enter India from Tibet?", answer: "Arunachal Pradesh", pool: ["Arunachal Pradesh", "Assam", "Sikkim", "Meghalaya", "Nagaland"], explanation: "The river enters India through Arunachal Pradesh after flowing across Tibet.", factIds: ["brahmaputra-enters-india-arunachal"], difficulty: "Easy" },
  { stem: "By which name is the Brahmaputra known in Arunachal Pradesh?", answer: "Siang", pool: ["Siang", "Jamuna", "Padma", "Teesta", "Sone"], explanation: "In Arunachal Pradesh, the river is known as the Siang. Dihang is also used for its lower upper-course section.", factIds: ["brahmaputra-india-name-siang", "brahmaputra-india-name-dihang"], difficulty: "Easy" },
  { stem: "What is the Brahmaputra locally called in Bangladesh?", answer: "Jamuna", pool: ["Jamuna", "Yamuna", "Padma", "Meghna", "Teesta"], explanation: "In Bangladesh, the Brahmaputra is locally called the Jamuna. This Jamuna is different from the Yamuna of northern India.", factIds: ["brahmaputra-bangladesh-name-jamuna"], difficulty: "Medium" },
  { stem: "The Brahmaputra is conventionally traced to which glacier on the Tibetan Plateau?", answer: "Chema Yundung Glacier", pool: ["Chema Yundung Glacier", "Gangotri Glacier", "Yamunotri Glacier", "Zemu Glacier", "Pindari Glacier"], explanation: "The Brahmaputra mainstream is conventionally traced to the Chema Yundung Glacier on the Tibetan Plateau.", factIds: ["brahmaputra-origin-glacier"], difficulty: "Medium" },
  { stem: "The Brahmaputra flows across which major valley in Assam?", answer: "Assam Valley", pool: ["Assam Valley", "Kashmir Valley", "Kangra Valley", "Damodar Valley", "Narmada Valley"], explanation: "The Brahmaputra flows across the alluvial plains of the Assam Valley.", factIds: ["brahmaputra-assam-valley"], difficulty: "Easy" },
  { stem: "The Brahmaputra river system ultimately drains into which water body?", answer: "Bay of Bengal", pool: ["Bay of Bengal", "Arabian Sea", "Indian Ocean", "Gulf of Kachchh", "Rann of Kachchh"], explanation: "The Brahmaputra system ultimately reaches the Bay of Bengal through the lower Ganga–Brahmaputra–Meghna system.", factIds: ["brahmaputra-bay-system"], difficulty: "Easy" },
];

const REVERSE_MODES: DirectMode[] = [
  { stem: "Tsangpo is the Tibetan name of which river?", answer: "Brahmaputra", pool: ["Brahmaputra", "Ganga", "Indus", "Teesta", "Sutlej"], explanation: "Tsangpo is the Tibetan name of the Brahmaputra.", factIds: ["brahmaputra-tibet-name-tsangpo"], difficulty: "Easy" },
  { stem: "Jamuna in Bangladesh is the local name of which major river?", answer: "Brahmaputra", pool: ["Brahmaputra", "Yamuna", "Ganga", "Teesta", "Meghna"], explanation: "The Brahmaputra is locally called Jamuna in Bangladesh.", factIds: ["brahmaputra-bangladesh-name-jamuna"], difficulty: "Medium" },
  { stem: "The river called Siang in Arunachal Pradesh is the upper Indian course of which river?", answer: "Brahmaputra", pool: ["Brahmaputra", "Ganga", "Indus", "Mahanadi", "Godavari"], explanation: "The Brahmaputra enters Arunachal Pradesh as the Siang.", factIds: ["brahmaputra-india-name-siang"], difficulty: "Easy" },
  { stem: "Chema Yundung Glacier is associated with the source of which river?", answer: "Brahmaputra", pool: ["Brahmaputra", "Ganga", "Yamuna", "Teesta", "Sone"], explanation: "Chema Yundung Glacier is the conventional source-glacier association for the Brahmaputra mainstream.", factIds: ["brahmaputra-origin-glacier"], difficulty: "Medium" },
  { stem: "Jia Bharali is another name used for which river?", answer: "Kameng", pool: ["Kameng", "Subansiri", "Manas", "Kopili", "Dibang"], explanation: "The Kameng is also known as the Jia Bharali in Assam.", factIds: ["kameng-jia-bharali"], difficulty: "Medium" },
  { stem: "Which major Brahmaputra-system tributary rises in Sikkim?", answer: "Teesta", pool: ["Teesta", "Subansiri", "Manas", "Lohit", "Kopili"], explanation: "The Teesta rises in Sikkim and later joins the Brahmaputra/Jamuna system in Bangladesh.", factIds: ["teesta-source-sikkim", "teesta-joins-bangladesh"], difficulty: "Medium" },
];

const NORTH_BANK = ["Subansiri", "Jia Bharali", "Manas", "Sankosh", "Puthimari"] as const;
const SOUTH_BANK = ["Burhi Dihing", "Disang", "Dikhow", "Dhansiri (South)", "Kopili"] as const;
const BANK_FACT_ID: Record<string, string> = {
  Subansiri: "subansiri-brahmaputra-bank",
  "Jia Bharali": "jia-bharali-brahmaputra-bank",
  Manas: "manas-brahmaputra-bank",
  Sankosh: "sankosh-brahmaputra-bank",
  Puthimari: "puthimari-brahmaputra-bank",
  "Burhi Dihing": "burhi-dihing-brahmaputra-bank",
  Disang: "disang-brahmaputra-bank",
  Dikhow: "dikhow-brahmaputra-bank",
  "Dhansiri (South)": "dhansiri-south-brahmaputra-bank",
  Kopili: "kopili-brahmaputra-bank",
};

function bankQuestion(mode: "north-one" | "south-one" | "north-pair" | "south-pair", seed: string) {
  if (mode === "north-one") {
    const answer = deterministicPick(NORTH_BANK, `${seed}:north`);
    return build({ qlId: "GEO-RIV-001-QL-030", seed, stem: "Which of the following is a north-bank tributary of the Brahmaputra in Assam?", answer, optionPool: [answer, ...SOUTH_BANK], explanation: `${answer} is a north-bank tributary of the Brahmaputra in Assam.`, factIds: [BANK_FACT_ID[answer]], difficulty: "Medium", solverAuthority: "RELATION_CLASS_COMPOSER" });
  }
  if (mode === "south-one") {
    const answer = deterministicPick(SOUTH_BANK, `${seed}:south`);
    return build({ qlId: "GEO-RIV-001-QL-030", seed, stem: "Which of the following is a south-bank tributary of the Brahmaputra in Assam?", answer, optionPool: [answer, ...NORTH_BANK], explanation: `${answer} is a south-bank tributary of the Brahmaputra in Assam.`, factIds: [BANK_FACT_ID[answer]], difficulty: "Medium", solverAuthority: "RELATION_CLASS_COMPOSER" });
  }
  if (mode === "north-pair") {
    const answer = deterministicPick(["Subansiri and Manas", "Jia Bharali and Sankosh", "Manas and Puthimari"] as const, `${seed}:npair`);
    return build({ qlId: "GEO-RIV-001-QL-030", seed, stem: "Which pair consists only of north-bank tributaries of the Brahmaputra?", answer, optionPool: [answer, "Burhi Dihing and Kopili", "Disang and Dikhow", "Subansiri and Kopili", "Manas and Disang"], explanation: `${answer} are both north-bank tributaries of the Brahmaputra.`, factIds: NORTH_BANK.filter((river) => answer.includes(river)).map((river) => BANK_FACT_ID[river]), difficulty: "Medium", solverAuthority: "RELATION_CLASS_COMPOSER" });
  }
  const answer = deterministicPick(["Burhi Dihing and Kopili", "Disang and Dikhow", "Dhansiri (South) and Kopili"] as const, `${seed}:spair`);
  return build({ qlId: "GEO-RIV-001-QL-030", seed, stem: "Which pair consists only of south-bank tributaries of the Brahmaputra?", answer, optionPool: [answer, "Subansiri and Manas", "Jia Bharali and Sankosh", "Kopili and Manas", "Dikhow and Subansiri"], explanation: `${answer} are both south-bank tributaries of the Brahmaputra.`, factIds: SOUTH_BANK.filter((river) => answer.includes(river)).map((river) => BANK_FACT_ID[river]), difficulty: "Medium", solverAuthority: "RELATION_CLASS_COMPOSER" });
}

const PARENT_MODES = [
  ["Ranganadi", "Subansiri", "ranganadi-subansiri", "Hard"],
  ["Dikrong", "Subansiri", "dikrong-subansiri", "Hard"],
  ["Jiadhol", "Subansiri", "jiadhol-subansiri", "Hard"],
  ["Kameng", "Brahmaputra", "kameng-joins-brahmaputra", "Medium"],
  ["Dibang", "Brahmaputra", "dibang-brahmaputra", "Easy"],
  ["Lohit", "Brahmaputra", "lohit-brahmaputra", "Easy"],
  ["Subansiri", "Brahmaputra", "subansiri-brahmaputra", "Easy"],
  ["Manas", "Brahmaputra", "manas-brahmaputra", "Easy"],
  ["Kopili", "Brahmaputra", "kopili-brahmaputra", "Medium"],
] as const;

function ql030(seed: string) {
  const mode = deterministicPick(["parent", "parent", "north-one", "south-one", "north-pair", "south-pair"] as const, `${seed}:ql030-mode`);
  if (mode !== "parent") return bankQuestion(mode, seed);
  const [river, parent, factId, difficulty] = deterministicPick(PARENT_MODES, `${seed}:parent`);
  return build({ qlId: "GEO-RIV-001-QL-030", seed, stem: `${river} is a tributary of which river?`, answer: parent, optionPool: ["Brahmaputra", "Subansiri", "Ganga", "Teesta", "Barak"], explanation: `${river} is a tributary of the ${parent}.`, factIds: [factId], difficulty, solverAuthority: "RELATION_CLASS_COMPOSER" });
}

const CONFLUENCE_MODES: DirectMode[] = [
  { stem: "Which two rivers join the Siang/Dihang before the river is known as the Brahmaputra?", answer: "Dibang and Lohit", pool: ["Dibang and Lohit", "Subansiri and Manas", "Teesta and Sankosh", "Kopili and Disang", "Kameng and Manas"], explanation: "The Dibang and Lohit join the Siang/Dihang. Downstream of this confluence, the river is known as the Brahmaputra.", factIds: ["dibang-joins-siang", "lohit-joins-siang", "brahmaputra-name-after-confluence"], difficulty: "Medium" },
  { stem: "After the Dibang and Lohit join the Siang/Dihang, the combined river is known as what?", answer: "Brahmaputra", pool: ["Brahmaputra", "Jamuna", "Teesta", "Padma", "Barak"], explanation: "After receiving the Dibang and Lohit, the Siang/Dihang is known as the Brahmaputra.", factIds: ["brahmaputra-name-after-confluence"], difficulty: "Medium" },
  { stem: "Which river name refers to the upper mainstream that receives the Dibang and Lohit?", answer: "Siang/Dihang", pool: ["Siang/Dihang", "Teesta", "Subansiri", "Manas", "Kopili"], explanation: "The Siang, also called Dihang in this transition, receives the Dibang and Lohit before the river is called the Brahmaputra.", factIds: ["brahmaputra-india-name-siang", "brahmaputra-india-name-dihang", "dibang-joins-siang", "lohit-joins-siang"], difficulty: "Hard" },
  { stem: "The Teesta joins the Brahmaputra/Jamuna system in which country?", answer: "Bangladesh", pool: ["Bangladesh", "India", "Bhutan", "Nepal", "Myanmar"], explanation: "The Teesta rises in Sikkim and joins the Brahmaputra/Jamuna system in Bangladesh.", factIds: ["teesta-source-sikkim", "teesta-joins-bangladesh"], difficulty: "Medium" },
  { stem: "In Bangladesh, the Jamuna (Brahmaputra) joins which major river system before the lower Meghna estuary?", answer: "Ganga/Padma", pool: ["Ganga/Padma", "Teesta", "Barak", "Mahanadi", "Godavari"], explanation: "In Bangladesh, the Brahmaputra is called Jamuna and joins the Ganga/Padma system before the combined flow reaches the lower Meghna estuary.", factIds: ["brahmaputra-bangladesh-name-jamuna", "jamuna-joins-ganga-padma"], difficulty: "Hard" },
];

const CORRECT_PAIR_MODES = [
  ["Brahmaputra — Tsangpo in Tibet", ["Brahmaputra — Jamuna in Tibet", "Teesta — Siang in Arunachal Pradesh", "Kameng — Padma in Assam"], "In Tibet, the Brahmaputra is known as the Tsangpo.", ["brahmaputra-tibet-name-tsangpo"], "Easy"],
  ["Brahmaputra — Jamuna in Bangladesh", ["Brahmaputra — Jamuna in Arunachal Pradesh", "Teesta — Tsangpo in Tibet", "Subansiri — Padma in Bangladesh"], "In Bangladesh, the Brahmaputra is locally called Jamuna.", ["brahmaputra-bangladesh-name-jamuna"], "Medium"],
  ["Kameng — Jia Bharali", ["Kameng — Teesta", "Subansiri — Jia Bharali", "Manas — Dihang"], "Kameng is also known as Jia Bharali in Assam.", ["kameng-jia-bharali"], "Medium"],
  ["Subansiri — north bank", ["Subansiri — south bank", "Kopili — north bank", "Disang — north bank"], "Subansiri is a north-bank tributary of the Brahmaputra.", ["subansiri-brahmaputra-bank"], "Medium"],
  ["Kopili — south bank", ["Kopili — north bank", "Manas — south bank", "Sankosh — south bank"], "Kopili is a south-bank tributary of the Brahmaputra.", ["kopili-brahmaputra-bank"], "Medium"],
  ["Ranganadi — Subansiri", ["Ranganadi — Teesta", "Dikrong — Manas", "Jiadhol — Kopili"], "Ranganadi is a tributary of the Subansiri.", ["ranganadi-subansiri"], "Hard"],
  ["Teesta — rises in Sikkim", ["Teesta — rises in Assam", "Manas — rises in Sikkim", "Kopili — rises in Tibet"], "The Teesta rises in Sikkim.", ["teesta-source-sikkim"], "Medium"],
  ["Brahmaputra — enters India through Arunachal Pradesh", ["Brahmaputra — enters India through Sikkim", "Teesta — enters India through Assam", "Subansiri — enters India through Meghalaya"], "The Brahmaputra enters India through Arunachal Pradesh.", ["brahmaputra-enters-india-arunachal"], "Easy"],
] as const;

const INCORRECT_PAIR_MODES = [
  ["Brahmaputra — Padma in Tibet", ["Brahmaputra — Tsangpo in Tibet", "Kameng — Jia Bharali", "Kopili — south bank"], "This pair is incorrect. In Tibet, the Brahmaputra is known as Tsangpo, not Padma.", ["brahmaputra-tibet-name-tsangpo"], "Easy"],
  ["Subansiri — south bank", ["Subansiri — north bank", "Burhi Dihing — south bank", "Manas — north bank"], "This pair is incorrect. Subansiri is a north-bank tributary of the Brahmaputra.", ["subansiri-brahmaputra-bank"], "Medium"],
  ["Kopili — north bank", ["Kopili — south bank", "Jia Bharali — north bank", "Disang — south bank"], "This pair is incorrect. Kopili is a south-bank tributary of the Brahmaputra.", ["kopili-brahmaputra-bank"], "Medium"],
  ["Kameng — Padma", ["Kameng — Jia Bharali", "Teesta — rises in Sikkim", "Brahmaputra — Jamuna in Bangladesh"], "This pair is incorrect. Kameng is also known as Jia Bharali.", ["kameng-jia-bharali"], "Medium"],
  ["Ranganadi — Manas", ["Ranganadi — Subansiri", "Dikrong — Subansiri", "Jiadhol — Subansiri"], "This pair is incorrect. Ranganadi is a tributary of the Subansiri.", ["ranganadi-subansiri"], "Hard"],
  ["Teesta — rises in Meghalaya", ["Teesta — rises in Sikkim", "Brahmaputra — enters India through Arunachal Pradesh", "Manas — north bank"], "This pair is incorrect. The Teesta rises in Sikkim.", ["teesta-source-sikkim"], "Medium"],
  ["Brahmaputra — Jamuna in Arunachal Pradesh", ["Brahmaputra — Siang in Arunachal Pradesh", "Brahmaputra — Jamuna in Bangladesh", "Subansiri — north bank"], "This pair is incorrect. In Arunachal Pradesh the river is known as Siang; Jamuna is the Bangladesh name.", ["brahmaputra-india-name-siang", "brahmaputra-bangladesh-name-jamuna"], "Medium"],
  ["Dibang — tributary of Subansiri", ["Dibang — tributary of Brahmaputra", "Kopili — tributary of Brahmaputra", "Ranganadi — tributary of Subansiri"], "This pair is incorrect. Dibang joins the Siang/Dihang in the Brahmaputra system; it is not a tributary of the Subansiri.", ["dibang-brahmaputra", "dibang-joins-siang"], "Hard"],
] as const;

const CHAIN_MODES: DirectMode[] = [
  { stem: "Which sequence correctly traces the main river-name progression from Tibet to Bangladesh?", answer: "Tsangpo → Siang/Dihang → Brahmaputra → Jamuna", pool: ["Tsangpo → Siang/Dihang → Brahmaputra → Jamuna", "Jamuna → Tsangpo → Brahmaputra → Siang", "Siang → Teesta → Brahmaputra → Padma", "Tsangpo → Subansiri → Jamuna → Brahmaputra", "Dihang → Ganga → Brahmaputra → Teesta"], explanation: "The river is known as Tsangpo in Tibet, Siang/Dihang in its upper Indian course, Brahmaputra after the Dibang–Lohit confluence, and Jamuna in Bangladesh.", factIds: ["brahmaputra-tibet-name-tsangpo", "brahmaputra-india-name-siang", "brahmaputra-india-name-dihang", "brahmaputra-name-after-confluence", "brahmaputra-bangladesh-name-jamuna"], difficulty: "Hard" },
  { stem: "Which river relation chain is correct?", answer: "Ranganadi → Subansiri → Brahmaputra", pool: ["Ranganadi → Subansiri → Brahmaputra", "Ranganadi → Teesta → Ganga", "Subansiri → Ranganadi → Brahmaputra", "Ranganadi → Manas → Brahmaputra", "Kopili → Subansiri → Brahmaputra"], explanation: "Ranganadi is a tributary of the Subansiri, and the Subansiri is a tributary of the Brahmaputra.", factIds: ["ranganadi-subansiri", "subansiri-brahmaputra"], difficulty: "Hard" },
  { stem: "Which name-and-river chain is correct?", answer: "Kameng → Jia Bharali → Brahmaputra", pool: ["Kameng → Jia Bharali → Brahmaputra", "Kameng → Jamuna → Teesta", "Jia Bharali → Kameng → Subansiri", "Kameng → Padma → Brahmaputra", "Kameng → Kopili → Brahmaputra"], explanation: "Kameng is also known as Jia Bharali, and it is a tributary of the Brahmaputra.", factIds: ["kameng-jia-bharali", "kameng-joins-brahmaputra"], difficulty: "Medium" },
  { stem: "Which lower-course relation chain is correct?", answer: "Teesta → Brahmaputra/Jamuna → Ganga/Padma", pool: ["Teesta → Brahmaputra/Jamuna → Ganga/Padma", "Teesta → Subansiri → Brahmaputra", "Teesta → Ganga → Siang", "Teesta → Kopili → Jamuna", "Teesta → Manas → Padma"], explanation: "The Teesta joins the Brahmaputra/Jamuna system in Bangladesh, and the Jamuna then joins the Ganga/Padma system.", factIds: ["teesta-joins-bangladesh", "brahmaputra-bangladesh-name-jamuna", "jamuna-joins-ganga-padma"], difficulty: "Hard" },
];

type Statement = { text: string; true: boolean; correction: string; factIds: string[] };
const TRUE_STATEMENTS: Statement[] = [
  { text: "The Brahmaputra is known as Tsangpo in Tibet.", true: true, correction: "The Brahmaputra is known as Tsangpo in Tibet.", factIds: ["brahmaputra-tibet-name-tsangpo"] },
  { text: "The Brahmaputra enters India through Arunachal Pradesh.", true: true, correction: "The Brahmaputra enters India through Arunachal Pradesh.", factIds: ["brahmaputra-enters-india-arunachal"] },
  { text: "Subansiri is a north-bank tributary of the Brahmaputra.", true: true, correction: "Subansiri is a north-bank tributary of the Brahmaputra.", factIds: ["subansiri-brahmaputra-bank"] },
  { text: "Kopili is a south-bank tributary of the Brahmaputra.", true: true, correction: "Kopili is a south-bank tributary of the Brahmaputra.", factIds: ["kopili-brahmaputra-bank"] },
  { text: "Kameng is also known as Jia Bharali.", true: true, correction: "Kameng is also known as Jia Bharali.", factIds: ["kameng-jia-bharali"] },
  { text: "Ranganadi is a tributary of the Subansiri.", true: true, correction: "Ranganadi is a tributary of the Subansiri.", factIds: ["ranganadi-subansiri"] },
];
const FALSE_STATEMENTS: Statement[] = [
  { text: "The Brahmaputra is known as Jamuna in Tibet.", true: false, correction: "In Tibet it is known as Tsangpo; Jamuna is its local name in Bangladesh.", factIds: ["brahmaputra-tibet-name-tsangpo", "brahmaputra-bangladesh-name-jamuna"] },
  { text: "The Brahmaputra enters India through Sikkim.", true: false, correction: "The Brahmaputra enters India through Arunachal Pradesh.", factIds: ["brahmaputra-enters-india-arunachal"] },
  { text: "Kopili is a north-bank tributary of the Brahmaputra.", true: false, correction: "Kopili is a south-bank tributary of the Brahmaputra.", factIds: ["kopili-brahmaputra-bank"] },
  { text: "Subansiri is a south-bank tributary of the Brahmaputra.", true: false, correction: "Subansiri is a north-bank tributary of the Brahmaputra.", factIds: ["subansiri-brahmaputra-bank"] },
  { text: "Kameng is another name for the Teesta.", true: false, correction: "Kameng is also known as Jia Bharali.", factIds: ["kameng-jia-bharali"] },
  { text: "Ranganadi is a tributary of the Manas.", true: false, correction: "Ranganadi is a tributary of the Subansiri.", factIds: ["ranganadi-subansiri"] },
];

function statementPair(seed: string) {
  const mode = deterministicPick(["both", "only-i", "only-ii", "neither"] as const, `${seed}:statement-mode`);
  const first = deterministicPick(mode === "both" || mode === "only-i" ? TRUE_STATEMENTS : FALSE_STATEMENTS, `${seed}:statement-i`);
  const second = deterministicPick(mode === "both" || mode === "only-ii" ? TRUE_STATEMENTS : FALSE_STATEMENTS, `${seed}:statement-ii`);
  const answer = mode === "both" ? "Both Statement I and Statement II are correct" : mode === "only-i" ? "Only Statement I is correct" : mode === "only-ii" ? "Only Statement II is correct" : "Neither Statement I nor Statement II is correct";
  const explainFirst = `Statement I is ${first.true ? "correct" : "incorrect"}. ${first.correction}`;
  const explainSecond = `Statement II is ${second.true ? "correct" : "incorrect"}. ${second.correction}`;
  const conclusion = mode === "both" ? "Hence, both statements are correct." : mode === "only-i" ? "Hence, only Statement I is correct." : mode === "only-ii" ? "Hence, only Statement II is correct." : "Hence, both statements are incorrect.";
  return build({
    qlId: "GEO-RIV-001-QL-035",
    seed,
    stem: `Consider the following statements:\nI. ${first.text.replace(/\.$/, "")}\nII. ${second.text.replace(/\.$/, "")}\nWhich of the above statements is/are correct?`,
    answer,
    optionPool: ["Both Statement I and Statement II are correct", "Only Statement I is correct", "Only Statement II is correct", "Neither Statement I nor Statement II is correct"],
    explanation: `${explainFirst} ${explainSecond} ${conclusion}`,
    factIds: unique([...first.factIds, ...second.factIds]),
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

const COUNT_MODES = [
  {
    answer: "None",
    statements: [FALSE_STATEMENTS[0], FALSE_STATEMENTS[2], FALSE_STATEMENTS[5]],
  },
  {
    answer: "One",
    statements: [TRUE_STATEMENTS[0], FALSE_STATEMENTS[3], FALSE_STATEMENTS[4]],
  },
  {
    answer: "Two",
    statements: [TRUE_STATEMENTS[1], TRUE_STATEMENTS[4], FALSE_STATEMENTS[2]],
  },
  {
    answer: "Three",
    statements: [TRUE_STATEMENTS[0], TRUE_STATEMENTS[2], TRUE_STATEMENTS[3]],
  },
] as const;

function statementCount(seed: string) {
  const mode = deterministicPick(COUNT_MODES, `${seed}:count-mode`);
  const [a, b, c] = mode.statements;
  const explanationParts = mode.statements.map((statement, index) => `Statement ${index + 1} is ${statement.true ? "correct" : "incorrect"}. ${statement.correction}`);
  return build({
    qlId: "GEO-RIV-001-QL-036",
    seed,
    stem: `Consider the following statements:\n1. ${a.text.replace(/\.$/, "")}\n2. ${b.text.replace(/\.$/, "")}\n3. ${c.text.replace(/\.$/, "")}\nHow many of the above statements are correct?`,
    answer: mode.answer,
    optionPool: ["None", "One", "Two", "Three"],
    explanation: explanationParts.join(" "),
    factIds: unique(mode.statements.flatMap((statement) => statement.factIds)),
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp004ReviewV1(qlId: string, seed: string): GeoRiv001Cp004ReviewQuestion {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP004 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-028") {
    const mode = deterministicPick(DIRECT_MODES, `${seed}:ql028`);
    return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: mode.pool, explanation: mode.explanation, factIds: mode.factIds, difficulty: mode.difficulty });
  }
  if (qlId === "GEO-RIV-001-QL-029") {
    const mode = deterministicPick(REVERSE_MODES, `${seed}:ql029`);
    return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: mode.pool, explanation: mode.explanation, factIds: mode.factIds, difficulty: mode.difficulty });
  }
  if (qlId === "GEO-RIV-001-QL-030") return ql030(seed);
  if (qlId === "GEO-RIV-001-QL-031") {
    const mode = deterministicPick(CONFLUENCE_MODES, `${seed}:ql031`);
    return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: mode.pool, explanation: mode.explanation, factIds: mode.factIds, difficulty: mode.difficulty, solverAuthority: "CONFLUENCE_CHAIN_VERIFIER" });
  }
  if (qlId === "GEO-RIV-001-QL-032") {
    const [answer, distractors, explanation, factIds, difficulty] = deterministicPick(CORRECT_PAIR_MODES, `${seed}:ql032`);
    return build({ qlId, seed, stem: "Which of the following pairs is correctly matched?", answer, optionPool: [answer, ...distractors], explanation, factIds, difficulty, solverAuthority: "RELATION_CLASS_COMPOSER" });
  }
  if (qlId === "GEO-RIV-001-QL-033") {
    const [answer, correctPairs, explanation, factIds, difficulty] = deterministicPick(INCORRECT_PAIR_MODES, `${seed}:ql033`);
    return build({ qlId, seed, stem: "Which of the following pairs is incorrectly matched?", answer, optionPool: [answer, ...correctPairs], explanation, factIds, difficulty, solverAuthority: "RELATION_CLASS_COMPOSER" });
  }
  if (qlId === "GEO-RIV-001-QL-034") {
    const mode = deterministicPick(CHAIN_MODES, `${seed}:ql034`);
    return build({ qlId, seed, stem: mode.stem, answer: mode.answer, optionPool: mode.pool, explanation: mode.explanation, factIds: mode.factIds, difficulty: mode.difficulty, solverAuthority: "CONFLUENCE_CHAIN_VERIFIER" });
  }
  if (qlId === "GEO-RIV-001-QL-035") return statementPair(seed);
  if (qlId === "GEO-RIV-001-QL-036") return statementCount(seed);
  throw new Error(`Unknown GEO-RIV-001 CP004 QL: ${qlId}`);
}
