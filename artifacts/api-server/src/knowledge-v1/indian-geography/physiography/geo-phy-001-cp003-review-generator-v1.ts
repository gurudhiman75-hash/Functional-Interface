import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  GEO_PHY_001_CP003_FOUNDATION_FACTS_V1 as foundation,
  GEO_PHY_001_CP003_REGIONAL_PLAINS_V1 as regional,
  GEO_PHY_001_CP003_RELIEF_BELTS_V1 as belts,
  GEO_PHY_001_CP003_SOURCE_ID,
} from "./geo-phy-001-cp003-facts";
import type { GeoPhy001Cp003ReviewQuestion } from "./geo-phy-001-cp003-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-019": "Identify Northern Plains from formation or character",
  "GEO-PHY-001-QL-020": "Identify regional plain from river or location clue",
  "GEO-PHY-001-QL-021": "Identify Bhabar, Terai, Bhangar or Khadar",
  "GEO-PHY-001-QL-022": "Identify characteristic of a named plain or belt",
  "GEO-PHY-001-QL-023": "Correctly matched Northern Plains pair",
  "GEO-PHY-001-QL-024": "Incorrectly matched Northern Plains pair",
  "GEO-PHY-001-QL-025": "Compare Northern Plains relief belts",
  "GEO-PHY-001-QL-026": "Statement I/II on Northern Plains",
  "GEO-PHY-001-QL-027": "Three-statement Northern Plains count",
};

function difficulty(ql: number): KnowledgeV1Difficulty {
  if ([19, 20, 21].includes(ql)) return "Easy";
  if ([22, 23, 24, 25, 26].includes(ql)) return "Medium";
  return "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Missing correct option: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function fourOptions(pool: string[], correct: string, seed: string, target: number) {
  const others = deterministicShuffle(pool.filter((value) => value !== correct), seed).slice(0, 3);
  return moveCorrect(deterministicShuffle([correct, ...others], `${seed}:all`), correct, target);
}

const regionalCases = [
  { answer: "Punjab Plains", stem: "Which regional division forms the western part of the Northern Plains and is associated mainly with the Indus and its tributaries?", explanation: "The Punjab Plains occupy the western part of the Northern Plains. They were formed largely by the Indus and its tributaries, whose interfluves are known as doabs.", facts: regional[0].sourceFactIds },
  { answer: "Punjab Plains", stem: "Doabs are especially characteristic of which regional division of the Northern Plains?", explanation: "Doabs are prominent in the Punjab Plains, which were formed by the Indus river system and its tributaries.", facts: regional[0].sourceFactIds },
  { answer: "Ganga Plain", stem: "Which regional division of the Northern Plains extends broadly between the Ghaggar and Teesta rivers?", explanation: "The Ganga Plain extends between the Ghaggar and Teesta rivers and forms the largest central section of the Northern Plains.", facts: regional[1].sourceFactIds },
  { answer: "Ganga Plain", stem: "The broad plain drained mainly by the Ganga and its tributaries is known as which of the following?", explanation: "The Ganga Plain is the broad central part of the Northern Plains drained by the Ganga and its tributaries.", facts: regional[1].sourceFactIds },
  { answer: "Brahmaputra Plain", stem: "Which regional division of the Northern Plains lies primarily in Assam?", explanation: "The Brahmaputra Plain occupies the easternmost major section of the Northern Plains and lies primarily in Assam.", facts: regional[2].sourceFactIds },
  { answer: "Brahmaputra Plain", stem: "The easternmost major regional section of the Northern Plains is which of the following?", explanation: "The Brahmaputra Plain forms the easternmost major regional section of the Northern Plains.", facts: regional[2].sourceFactIds },
];

const beltCases = [
  { answer: "Bhabar", stem: "In which belt do Himalayan streams often disappear into a porous bed of pebbles near the foothills?", explanation: "In the Bhabar belt, streams deposit pebbles and often disappear into the porous surface. This narrow belt lies along the Shiwalik foothills.", facts: belts[0].sourceFactIds },
  { answer: "Bhabar", stem: "Which narrow belt lies immediately south of the Shiwaliks and north of the Terai?", explanation: "The Bhabar is the narrow belt immediately south of the Shiwaliks. The Terai begins farther south where streams re-emerge.", facts: belts[0].sourceFactIds },
  { answer: "Terai", stem: "Which belt is characterised by streams re-emerging and creating wet, marshy conditions?", explanation: "In the Terai, streams that disappear in the Bhabar re-emerge, producing a wet, swampy and marshy belt.", facts: belts[1].sourceFactIds },
  { answer: "Terai", stem: "The wet and formerly thickly forested belt lying south of the Bhabar is known as which of the following?", explanation: "The Terai lies south of the Bhabar. Its high moisture and re-emerging streams historically supported dense forests and abundant wildlife.", facts: belts[1].sourceFactIds },
  { answer: "Bhangar", stem: "Which term refers to the older alluvium of the Northern Plains, often containing kankar deposits?", explanation: "Bhangar is the older alluvium, generally found on slightly elevated terraces. It commonly contains calcareous kankar deposits.", facts: belts[2].sourceFactIds },
  { answer: "Khadar", stem: "Which term refers to the newer alluvium renewed almost every year by river floods?", explanation: "Khadar is the newer floodplain alluvium. Fresh deposits are laid down repeatedly by floods, making it generally very fertile.", facts: belts[3].sourceFactIds },
];

const reverseCases = [
  { name: "Bhabar", answer: belts[0].definingFact, explanation: "Bhabar is a porous pebble belt along the Shiwalik foothills, so streams commonly disappear into its surface.", facts: belts[0].sourceFactIds },
  { name: "Terai", answer: belts[1].definingFact, explanation: "The Terai is the wet belt south of the Bhabar where underground streams re-emerge and create marshy conditions.", facts: belts[1].sourceFactIds },
  { name: "Bhangar", answer: belts[2].definingFact, explanation: "Bhangar represents older alluvium and commonly contains kankar, unlike Khadar which is renewed by recent floods.", facts: belts[2].sourceFactIds },
  { name: "Khadar", answer: belts[3].definingFact, explanation: "Khadar is the newer alluvium of active floodplains and is replenished frequently by fresh river deposits.", facts: belts[3].sourceFactIds },
  { name: "Punjab Plains", answer: regional[0].definingFact, explanation: "The Punjab Plains were formed largely by the Indus and its tributaries and are well known for their doabs.", facts: regional[0].sourceFactIds },
  { name: "Brahmaputra Plain", answer: regional[2].extent, explanation: "The Brahmaputra Plain occupies the eastern part of the Northern Plains and lies primarily in Assam.", facts: regional[2].sourceFactIds },
];

const truePairs = [
  { pair: "Bhabar — streams often disappear into a porous pebble bed", explanation: "This pair is correct. Bhabar is the porous pebble belt near the Shiwalik foothills where many streams disappear below the surface.", facts: belts[0].sourceFactIds },
  { pair: "Terai — wet and marshy belt south of the Bhabar", explanation: "This pair is correct. The Terai lies south of the Bhabar and becomes wet and marshy as streams re-emerge.", facts: belts[1].sourceFactIds },
  { pair: "Bhangar — older alluvium with kankar deposits", explanation: "This pair is correct. Bhangar is older alluvium and commonly contains calcareous kankar deposits.", facts: belts[2].sourceFactIds },
  { pair: "Khadar — newer alluvium renewed by floods", explanation: "This pair is correct. Khadar is newer floodplain alluvium that is repeatedly renewed by fresh deposits.", facts: belts[3].sourceFactIds },
  { pair: "Punjab Plains — associated mainly with the Indus and its tributaries", explanation: "This pair is correct. The Punjab Plains form the western part of the Northern Plains and were built largely by the Indus system.", facts: regional[0].sourceFactIds },
  { pair: "Brahmaputra Plain — primarily in Assam", explanation: "This pair is correct. The Brahmaputra Plain forms the easternmost major section of the Northern Plains and lies mainly in Assam.", facts: regional[2].sourceFactIds },
];

const falsePairs = [
  { pair: "Bhabar — streams re-emerge to form marshes", explanation: "This pair is incorrect. Streams commonly disappear in the porous Bhabar; they re-emerge farther south in the Terai, where marshy conditions develop.", facts: [ ...belts[0].sourceFactIds, ...belts[1].sourceFactIds ] },
  { pair: "Terai — older alluvium containing kankar", explanation: "This pair is incorrect. Older alluvium with kankar is Bhangar; the Terai is the wet, marshy belt south of the Bhabar.", facts: [ ...belts[1].sourceFactIds, ...belts[2].sourceFactIds ] },
  { pair: "Bhangar — newer alluvium renewed every year", explanation: "This pair is incorrect. Bhangar is older alluvium; Khadar is the newer alluvium that is renewed frequently by floods.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
  { pair: "Khadar — older elevated alluvial terraces", explanation: "This pair is incorrect. Khadar is newer floodplain alluvium; older elevated alluvial terraces are associated with Bhangar.", facts: [ ...belts[3].sourceFactIds, ...belts[2].sourceFactIds ] },
  { pair: "Punjab Plains — mainly in Assam", explanation: "This pair is incorrect. The Punjab Plains occupy the western part of the Northern Plains; the Brahmaputra Plain lies primarily in Assam.", facts: [ ...regional[0].sourceFactIds, ...regional[2].sourceFactIds ] },
  { pair: "Ganga Plain — westernmost Indus-dominated section", explanation: "This pair is incorrect. The Punjab Plains form the western Indus-dominated section; the Ganga Plain occupies the broad central part of the Northern Plains.", facts: [ ...regional[0].sourceFactIds, ...regional[1].sourceFactIds ] },
];

const compareCases = [
  { stem: "Which statement correctly distinguishes Bhabar from Terai?", answer: "Bhabar is porous and streams often disappear there; in Terai the streams re-emerge and create marshy conditions.", explanation: "Bhabar is the porous pebble belt near the foothills where streams sink below the surface. Immediately south, they re-emerge in the Terai, producing wet and marshy conditions.", facts: [ ...belts[0].sourceFactIds, ...belts[1].sourceFactIds ] },
  { stem: "Which statement correctly distinguishes Bhangar from Khadar?", answer: "Bhangar is older alluvium, while Khadar is newer alluvium renewed by floods.", explanation: "Bhangar consists of older alluvial deposits, often on higher terraces. Khadar occupies newer floodplains and is replenished by fresh flood deposits.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
  { stem: "Which of the following correctly compares the position of Bhabar and Terai?", answer: "Bhabar lies closer to the Shiwalik foothills, while Terai lies immediately to its south.", explanation: "Moving south from the Shiwaliks, the Bhabar comes first and the Terai follows immediately beyond it.", facts: [ ...belts[0].sourceFactIds, ...belts[1].sourceFactIds ] },
  { stem: "Which statement correctly compares the renewal of Bhangar and Khadar deposits?", answer: "Khadar is renewed frequently by floods, whereas Bhangar is not regularly renewed by present-day flooding.", explanation: "Khadar belongs to active floodplains and receives fresh deposits repeatedly. Bhangar is older alluvium on higher surfaces and is less frequently renewed.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
  { stem: "Which statement correctly compares the Punjab Plains and Brahmaputra Plain?", answer: "The Punjab Plains form the western section, while the Brahmaputra Plain forms the easternmost major section.", explanation: "The Punjab Plains lie in the west of the Northern Plains, whereas the Brahmaputra Plain occupies the easternmost major section, mainly in Assam.", facts: [ ...regional[0].sourceFactIds, ...regional[2].sourceFactIds ] },
  { stem: "Which statement correctly compares Bhangar and Khadar in terms of age?", answer: "Bhangar is older alluvium, whereas Khadar is newer alluvium.", explanation: "Bhangar denotes the older alluvial deposits of the plains, while Khadar denotes the newer deposits of the active floodplains.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
];

const statementCases = [
  { s1: "The Northern Plains were formed mainly by alluvium deposited by the Indus, Ganga and Brahmaputra river systems.", t1: true, s2: "They are an old crystalline tableland.", t2: false, explanation: "Statement I is correct: the plains were built by river-borne alluvium. Statement II is incorrect because an old crystalline tableland describes the Peninsular Plateau, not the Northern Plains.", facts: [foundation[0].sourceFactIds[0], foundation[5].sourceFactIds[0]] },
  { s1: "Bhabar lies along the Shiwalik foothills.", t1: true, s2: "Streams commonly re-emerge in the Bhabar to create marshes.", t2: false, explanation: "Statement I is correct. Statement II is incorrect: streams commonly disappear in the porous Bhabar and re-emerge farther south in the Terai.", facts: [ ...belts[0].sourceFactIds, ...belts[1].sourceFactIds ] },
  { s1: "Terai lies south of the Bhabar.", t1: true, s2: "Terai is generally wet and marshy because streams re-emerge there.", t2: true, explanation: "Both statements are correct. The Terai lies south of the Bhabar and becomes wet and marshy where underground streams return to the surface.", facts: belts[1].sourceFactIds },
  { s1: "Bhangar is older alluvium.", t1: true, s2: "Khadar is newer alluvium renewed by floods.", t2: true, explanation: "Both statements are correct. Bhangar represents older alluvial terraces, while Khadar is the younger floodplain alluvium renewed by fresh deposits.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
  { s1: "The Brahmaputra Plain lies primarily in Assam.", t1: true, s2: "The Punjab Plains form the easternmost section of the Northern Plains.", t2: false, explanation: "Statement I is correct. Statement II is incorrect because the Punjab Plains form the western section; the Brahmaputra Plain is the easternmost major section.", facts: [ ...regional[0].sourceFactIds, ...regional[2].sourceFactIds ] },
  { s1: "Khadar is frequently renewed by floods.", t1: true, s2: "Kankar deposits are characteristically associated with Bhangar.", t2: true, explanation: "Both statements are correct. Khadar receives fresh flood deposits repeatedly, while the older Bhangar commonly contains calcareous kankar.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
];

const countCases = [
  { statements: [["Bhabar is a porous pebble belt near the Shiwalik foothills.", true], ["Terai lies south of Bhabar.", true], ["Streams commonly re-emerge in the Terai.", true]] as const, explanation: "All three statements are correct. Bhabar is the porous foothill belt; immediately south lies the Terai, where streams re-emerge and create wetter conditions.", facts: [ ...belts[0].sourceFactIds, ...belts[1].sourceFactIds ] },
  { statements: [["Bhangar is older alluvium.", true], ["Khadar is newer alluvium.", true], ["Bhangar is renewed almost every year by floods.", false]] as const, explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because annual or frequent flood renewal is characteristic of Khadar, not Bhangar.", facts: [ ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
  { statements: [["Punjab Plains form the western part of the Northern Plains.", true], ["Brahmaputra Plain lies primarily in Assam.", true], ["Ganga Plain is the westernmost Indus-dominated section.", false]] as const, explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect: the western Indus-dominated section is the Punjab Plains; the Ganga Plain occupies the broad central sector.", facts: [ ...regional[0].sourceFactIds, ...regional[1].sourceFactIds, ...regional[2].sourceFactIds ] },
  { statements: [["Kankar deposits are commonly associated with Bhangar.", true], ["Khadar is generally fertile because fresh alluvium is repeatedly deposited.", true], ["Terai is the older alluvial terrace above the floodplain.", false]] as const, explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because older alluvial terraces are Bhangar; the Terai is a wet marshy belt south of Bhabar.", facts: [ ...belts[1].sourceFactIds, ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
  { statements: [["The Northern Plains are mainly depositional landforms.", true], ["They were built by river-borne alluvium.", true], ["They are composed chiefly of ancient crystalline rocks.", false]] as const, explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect: ancient crystalline rocks characterise the Peninsular Plateau, whereas the Northern Plains are built mainly of deposited alluvium.", facts: [foundation[0].sourceFactIds[0], foundation[1].sourceFactIds[0], foundation[5].sourceFactIds[0]] },
  { statements: [["Streams often disappear in Bhabar.", true], ["Streams re-emerge in Terai.", true], ["Khadar is older than Bhangar.", false]] as const, explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Bhangar is the older alluvium and Khadar is the newer floodplain alluvium.", facts: [ ...belts[0].sourceFactIds, ...belts[1].sourceFactIds, ...belts[2].sourceFactIds, ...belts[3].sourceFactIds ] },
];

function makeQuestion(ql: number, i: number, global: number): GeoPhy001Cp003ReviewQuestion {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const target = global % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let factIds: string[] = [];

  if (ql === 19) {
    const row = foundation[i];
    const cases = [
      { stem: "Which major physiographic division of India was formed by extensive alluvial deposition by the Indus, Ganga and Brahmaputra river systems?", answer: "The Northern Plains", explanation: "The Northern Plains were built by enormous quantities of alluvium deposited by the Indus, Ganga and Brahmaputra river systems and their tributaries." },
      { stem: "Which major physiographic division is composed mainly of river-deposited alluvium accumulated over millions of years?", answer: "The Northern Plains", explanation: "The Northern Plains are a vast depositional surface formed by layers of alluvium laid down by Himalayan river systems over a very long period." },
      { stem: "Fertile alluvial soil, abundant water and favourable conditions for intensive agriculture are major features of which physiographic division?", answer: "The Northern Plains", explanation: "The Northern Plains combine fertile alluvial soils with abundant river water and favourable climatic conditions, making them one of India's most productive agricultural regions." },
      { stem: "Bhabar, Terai, Bhangar and Khadar are relief divisions of which major physiographic region?", answer: "The Northern Plains", explanation: "These four belts describe relief and alluvial differences within the Northern Plains: Bhabar and Terai near the foothills, and Bhangar and Khadar in the alluvial plains." },
      { stem: "Punjab Plains, Ganga Plain and Brahmaputra Plain are the major regional divisions of which physiographic unit?", answer: "The Northern Plains", explanation: "The Northern Plains are regionally divided into the Punjab Plains in the west, the Ganga Plain in the centre and the Brahmaputra Plain in the east." },
      { stem: "Which physiographic division is primarily a depositional plain rather than an ancient crystalline tableland?", answer: "The Northern Plains", explanation: "The Northern Plains are depositional landforms built by river-borne sediments. The ancient crystalline tableland is the Peninsular Plateau." },
    ];
    ({ stem, answer: correct, explanation } = cases[i]);
    options = moveCorrect(deterministicShuffle(["The Northern Plains", "The Peninsular Plateau", "The Indian Desert", "The Coastal Plains"], `${qlId}:${i}`), correct, target);
    factIds = [...row.sourceFactIds];
  } else if (ql === 20) {
    const row = regionalCases[i];
    stem = row.stem;
    correct = row.answer;
    options = fourOptions(["Punjab Plains", "Ganga Plain", "Brahmaputra Plain", "Coastal Plains"], correct, `${qlId}:${i}`, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else if (ql === 21) {
    const row = beltCases[i];
    stem = row.stem;
    correct = row.answer;
    options = fourOptions(["Bhabar", "Terai", "Bhangar", "Khadar"], correct, `${qlId}:${i}`, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else if (ql === 22) {
    const row = reverseCases[i];
    stem = `Which of the following statements correctly describes ${row.name}?`;
    correct = row.answer;
    const pool = [
      belts[0].definingFact,
      belts[1].definingFact,
      belts[2].definingFact,
      belts[3].definingFact,
      regional[0].definingFact,
      regional[2].extent,
    ];
    options = fourOptions(pool, correct, `${qlId}:${i}`, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else if (ql === 23) {
    stem = "Which of the following pairs is correctly matched?";
    const row = truePairs[i];
    correct = row.pair;
    const distractors = falsePairs.map((x) => x.pair);
    options = moveCorrect(deterministicShuffle([correct, ...deterministicShuffle(distractors, `${qlId}:${i}:d`).slice(0, 3)], `${qlId}:${i}:all`), correct, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else if (ql === 24) {
    stem = "Which of the following pairs is incorrectly matched?";
    const row = falsePairs[i];
    correct = row.pair;
    const distractors = truePairs.map((x) => x.pair);
    options = moveCorrect(deterministicShuffle([correct, ...deterministicShuffle(distractors, `${qlId}:${i}:d`).slice(0, 3)], `${qlId}:${i}:all`), correct, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else if (ql === 25) {
    const row = compareCases[i];
    stem = row.stem;
    correct = row.answer;
    const distractors = compareCases.filter((_, j) => j !== i).map((x) => x.answer);
    options = moveCorrect(deterministicShuffle([correct, ...deterministicShuffle(distractors, `${qlId}:${i}:d`).slice(0, 3)], `${qlId}:${i}:all`), correct, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else if (ql === 26) {
    const row = statementCases[i];
    stem = `Consider the following statements:\nI. ${row.s1}\nII. ${row.s2}\nWhich of the statements given above is/are correct?`;
    correct = row.t1 && row.t2 ? "Both I and II" : row.t1 ? "I only" : row.t2 ? "II only" : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  } else {
    const row = countCases[i];
    stem = `Consider the following statements:\n1. ${row.statements[0][0]}\n2. ${row.statements[1][0]}\n3. ${row.statements[2][0]}\nHow many of the statements given above are correct?`;
    const count = row.statements.filter((entry) => entry[1]).length;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, target);
    explanation = row.explanation;
    factIds = [...row.facts];
  }

  return {
    questionId: `GEO-PHY-001-CP003-V1-${String(global + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP003",
    qlId,
    qlName: qlNames[qlId],
    difficulty: difficulty(ql),
    stem,
    options,
    correctIndex: target,
    canonicalAnswer: correct,
    explanation,
    sourceIds: [GEO_PHY_001_CP003_SOURCE_ID],
    sourceFactIds: [...new Set(factIds)],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp003ReviewBatchV1(): GeoPhy001Cp003ReviewQuestion[] {
  const questions: GeoPhy001Cp003ReviewQuestion[] = [];
  let global = 0;
  for (let ql = 19; ql <= 27; ql += 1) {
    for (let i = 0; i < 6; i += 1) {
      questions.push(makeQuestion(ql, i, global));
      global += 1;
    }
  }
  return questions;
}
