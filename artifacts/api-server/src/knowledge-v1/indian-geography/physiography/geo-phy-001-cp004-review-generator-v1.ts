import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  GEO_PHY_001_CP004_CENTRAL_HIGHLANDS_FACTS_V1 as central,
  GEO_PHY_001_CP004_DECCAN_FACTS_V1 as deccan,
  GEO_PHY_001_CP004_FOUNDATION_FACTS_V1 as foundation,
  GEO_PHY_001_CP004_GHATS_V1 as ghats,
  GEO_PHY_001_CP004_SOURCE_ID,
} from "./geo-phy-001-cp004-facts";
import type { GeoPhy001Cp004ReviewQuestion } from "./geo-phy-001-cp004-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-028": "Identify the Peninsular Plateau from a clue",
  "GEO-PHY-001-QL-029": "Central Highlands associations",
  "GEO-PHY-001-QL-030": "Deccan Plateau associations",
  "GEO-PHY-001-QL-031": "Plateau boundary and range associations",
  "GEO-PHY-001-QL-032": "Western and Eastern Ghats comparison",
  "GEO-PHY-001-QL-033": "Correctly matched plateau pair",
  "GEO-PHY-001-QL-034": "Incorrectly matched plateau pair",
  "GEO-PHY-001-QL-035": "Statement I/II on the Peninsular Plateau",
  "GEO-PHY-001-QL-036": "Three-statement plateau count",
};

function difficulty(ql: number): KnowledgeV1Difficulty {
  if ([28, 29, 30].includes(ql)) return "Easy";
  if ([31, 32, 33, 34, 35].includes(ql)) return "Medium";
  return "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const current = options.indexOf(correct);
  if (current < 0) throw new Error(`Missing correct option: ${correct}`);
  [options[current], options[target]] = [options[target], options[current]];
  return options;
}

function fourOptions(pool: readonly string[], correct: string, seed: string, target: number) {
  const others = deterministicShuffle(pool.filter((item) => item !== correct), seed).slice(0, 3);
  const options = deterministicShuffle([correct, ...others], `${seed}:options`);
  return moveCorrect(options, correct, target);
}

function makeQuestion(ql: number, item: number, globalIndex: number): GeoPhy001Cp004ReviewQuestion {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const target = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let factIds: string[] = [];

  if (ql === 28) {
    const rows = [
      { clue: "an old tableland made mainly of crystalline, igneous and metamorphic rocks", fact: foundation[0] },
      { clue: "the old landmass linked with the breaking and drifting of Gondwana land", fact: foundation[1] },
      { clue: "broad shallow valleys and rounded hills", fact: foundation[2] },
      { clue: "the region divided broadly into the Central Highlands and the Deccan Plateau", fact: foundation[3] },
      { clue: "one of India's oldest land surfaces, unlike the young fold mountains", fact: foundation[1] },
      { clue: "a tableland whose rocks are largely old crystalline, igneous and metamorphic rocks", fact: foundation[0] },
    ];
    const row = rows[item];
    stem = `Which region of India is best identified by ${row.clue}?`;
    correct = "Peninsular Plateau";
    options = fourOptions(["Peninsular Plateau", "Northern Plains", "Indian Desert", "Himalayan Mountains", "Coastal Plains"], correct, `${qlId}:${item}`, target);
    explanation = `The Peninsular Plateau fits this clue. ${row.fact.fact}`;
    factIds = [...row.fact.sourceFactIds];
  } else if (ql === 29) {
    const rows = [
      { stem: "Which part of the Peninsular Plateau lies mainly north of the Narmada River?", answer: "Central Highlands", pool: ["Central Highlands", "Deccan Plateau", "Western Ghats", "Eastern Ghats", "Coastal Plains"], exp: central[0].fact, facts: central[0].sourceFactIds },
      { stem: "A large part of the Malwa Plateau belongs to which broad region?", answer: "Central Highlands", pool: ["Central Highlands", "Deccan Plateau", "Brahmaputra Plain", "Indian Desert", "Western Ghats"], exp: central[0].fact, facts: central[0].sourceFactIds },
      { stem: "Which region is wider in the west and becomes narrower towards the east?", answer: "Central Highlands", pool: ["Central Highlands", "Deccan Plateau", "Eastern Ghats", "Western Ghats", "Northern Plains"], exp: central[1].fact, facts: central[1].sourceFactIds },
      { stem: "Bundelkhand and Baghelkhand are eastward extensions of which region?", answer: "Central Highlands", pool: ["Central Highlands", "Deccan Plateau", "Western Ghats", "Indian Desert", "Punjab Plains"], exp: central[2].fact, facts: central[2].sourceFactIds },
      { stem: "Which plateau forms the further eastward extension of the Central Highlands?", answer: "Chotanagpur Plateau", pool: ["Chotanagpur Plateau", "Malwa Plateau", "Deccan Plateau", "Meghalaya Plateau", "Karnataka Plateau"], exp: central[3].fact, facts: central[3].sourceFactIds },
      { stem: "Which river drains the Chotanagpur Plateau in the NCERT description of the Central Highlands?", answer: "Damodar", pool: ["Damodar", "Narmada", "Tapi", "Mahanadi", "Godavari"], exp: central[3].fact, facts: central[3].sourceFactIds },
    ];
    const row = rows[item];
    stem = row.stem;
    correct = row.answer;
    options = fourOptions(row.pool, correct, `${qlId}:${item}`, target);
    explanation = row.exp;
    factIds = [...row.facts];
  } else if (ql === 30) {
    const rows = [
      { stem: "Which plateau is a triangular landmass lying south of the Narmada River?", answer: "Deccan Plateau", pool: ["Deccan Plateau", "Central Highlands", "Chotanagpur Plateau", "Malwa Plateau", "Meghalaya Plateau"], exp: deccan[0].fact, facts: deccan[0].sourceFactIds },
      { stem: "Which range forms the broad northern base of the Deccan Plateau?", answer: "Satpura Range", pool: ["Satpura Range", "Aravali Range", "Western Ghats", "Eastern Ghats", "Shiwaliks"], exp: deccan[1].fact, facts: deccan[1].sourceFactIds },
      { stem: "Which plateau is higher in the west and slopes gently towards the east?", answer: "Deccan Plateau", pool: ["Deccan Plateau", "Central Highlands", "Punjab Plains", "Brahmaputra Plain", "Indian Desert"], exp: deccan[2].fact, facts: deccan[2].sourceFactIds },
      { stem: "Meghalaya Plateau, Karbi-Anglong Plateau and North Cachar Hills form a northeastern extension of which plateau?", answer: "Deccan Plateau", pool: ["Deccan Plateau", "Central Highlands", "Malwa Plateau", "Chotanagpur Plateau", "Northern Plains"], exp: deccan[3].fact, facts: deccan[3].sourceFactIds },
      { stem: "Which sequence gives the prominent hills of the northeastern plateau extension from west to east?", answer: "Garo – Khasi – Jaintia", pool: ["Garo – Khasi – Jaintia", "Khasi – Garo – Jaintia", "Jaintia – Khasi – Garo", "Garo – Jaintia – Khasi", "Khasi – Jaintia – Garo"], exp: deccan[4].fact, facts: deccan[4].sourceFactIds },
      { stem: "On which side of the Narmada River does the Deccan Plateau mainly lie?", answer: "South", pool: ["South", "North", "East", "West"], exp: deccan[0].fact, facts: deccan[0].sourceFactIds },
    ];
    const row = rows[item];
    stem = row.stem;
    correct = row.answer;
    options = fourOptions(row.pool, correct, `${qlId}:${item}`, target);
    explanation = row.exp;
    factIds = [...row.facts];
  } else if (ql === 31) {
    const rows = [
      { stem: "Which river broadly separates the Central Highlands from the Deccan Plateau?", answer: "Narmada", pool: ["Narmada", "Godavari", "Krishna", "Mahanadi", "Kaveri"], exp: "The Central Highlands lie mainly north of the Narmada, while the Deccan Plateau lies to its south.", facts: [...central[0].sourceFactIds, ...deccan[0].sourceFactIds] },
      { stem: "Which range lies along the broad northern base of the Deccan Plateau?", answer: "Satpura Range", pool: ["Satpura Range", "Aravali Range", "Shiwaliks", "Eastern Ghats", "Western Ghats"], exp: deccan[1].fact, facts: deccan[1].sourceFactIds },
      { stem: "Which hills mark the western edge of the Deccan Plateau?", answer: "Western Ghats", pool: ["Western Ghats", "Eastern Ghats", "Aravali Range", "Shiwaliks", "Patkai Hills"], exp: "The Western Ghats mark the western edge of the Deccan Plateau and run roughly parallel to the western coast.", facts: ghats[0].sourceFactIds },
      { stem: "Which hills mark the eastern edge of the Deccan Plateau?", answer: "Eastern Ghats", pool: ["Eastern Ghats", "Western Ghats", "Satpura Range", "Aravali Range", "Shiwaliks"], exp: "The Eastern Ghats mark the eastern edge of the Deccan Plateau and are cut by rivers flowing towards the Bay of Bengal.", facts: ghats[1].sourceFactIds },
      { stem: "Which plateau is the further eastward extension of the Central Highlands?", answer: "Chotanagpur Plateau", pool: ["Chotanagpur Plateau", "Meghalaya Plateau", "Deccan Plateau", "Malwa Plateau", "Karbi-Anglong Plateau"], exp: central[3].fact, facts: central[3].sourceFactIds },
      { stem: "Which broad plateau region includes a major area of the Malwa Plateau?", answer: "Central Highlands", pool: ["Central Highlands", "Deccan Plateau", "Eastern Ghats", "Western Ghats", "Northern Plains"], exp: central[0].fact, facts: central[0].sourceFactIds },
    ];
    const row = rows[item];
    stem = row.stem;
    correct = row.answer;
    options = fourOptions(row.pool, correct, `${qlId}:${item}`, target);
    explanation = row.exp;
    factIds = [...row.facts];
  } else if (ql === 32) {
    const rows = [
      { stem: "Which is generally higher: the Western Ghats or the Eastern Ghats?", answer: "Western Ghats", pool: ["Western Ghats", "Eastern Ghats", "Both have the same average height", "Neither forms a plateau edge"], exp: `${ghats[0].name} are ${ghats[0].height}, while the ${ghats[1].name} are ${ghats[1].height}.`, facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
      { stem: "Which Ghats form a more continuous chain?", answer: "Western Ghats", pool: ["Western Ghats", "Eastern Ghats", "Both are equally discontinuous", "Neither"], exp: `The Western Ghats are ${ghats[0].continuity}, whereas the Eastern Ghats are ${ghats[1].continuity}.`, facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
      { stem: "Which Ghats are discontinuous because rivers cut through them?", answer: "Eastern Ghats", pool: ["Eastern Ghats", "Western Ghats", "Satpura Range", "Aravali Range"], exp: `The Eastern Ghats are ${ghats[1].continuity}.`, facts: ghats[1].sourceFactIds },
      { stem: "Which Ghats run roughly parallel to India's western coast?", answer: "Western Ghats", pool: ["Western Ghats", "Eastern Ghats", "Shiwaliks", "Satpura Range"], exp: `The Western Ghats ${ghats[0].extra}.`, facts: ghats[0].sourceFactIds },
      { stem: "Which Ghats extend from the Mahanadi Valley towards the Nilgiris?", answer: "Eastern Ghats", pool: ["Eastern Ghats", "Western Ghats", "Aravali Range", "Satpura Range"], exp: `The Eastern Ghats ${ghats[1].extra}.`, facts: ghats[1].sourceFactIds },
      { stem: "About 600 metres is the average elevation associated with which Ghats?", answer: "Eastern Ghats", pool: ["Eastern Ghats", "Western Ghats", "Himadri", "Shiwaliks"], exp: `The Eastern Ghats are ${ghats[1].height}; the Western Ghats are generally higher.`, facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
    ];
    const row = rows[item];
    stem = row.stem;
    correct = row.answer;
    options = fourOptions(row.pool, correct, `${qlId}:${item}`, target);
    explanation = row.exp;
    factIds = [...row.facts];
  } else if (ql === 33 || ql === 34) {
    const truePairs = [
      { text: "Central Highlands — mainly north of the Narmada", exp: central[0].fact, facts: central[0].sourceFactIds },
      { text: "Deccan Plateau — triangular landmass south of the Narmada", exp: deccan[0].fact, facts: deccan[0].sourceFactIds },
      { text: "Chotanagpur Plateau — drained by the Damodar", exp: central[3].fact, facts: central[3].sourceFactIds },
      { text: "Western Ghats — more continuous and generally higher", exp: `${ghats[0].name} are ${ghats[0].continuity} and ${ghats[0].height}.`, facts: ghats[0].sourceFactIds },
      { text: "Eastern Ghats — discontinuous and cut by rivers", exp: `${ghats[1].name} are ${ghats[1].continuity}.`, facts: ghats[1].sourceFactIds },
      { text: "Bundelkhand and Baghelkhand — eastward extensions of the Central Highlands", exp: central[2].fact, facts: central[2].sourceFactIds },
    ];
    const wrongPairs = [
      { text: "Central Highlands — mainly south of the Narmada", exp: central[0].fact, facts: central[0].sourceFactIds },
      { text: "Deccan Plateau — broad region mainly north of the Narmada", exp: deccan[0].fact, facts: deccan[0].sourceFactIds },
      { text: "Chotanagpur Plateau — drained by the Narmada", exp: central[3].fact, facts: central[3].sourceFactIds },
      { text: "Western Ghats — discontinuous and cut by major east-flowing rivers", exp: `${ghats[0].name} are ${ghats[0].continuity}; the discontinuous river-cut description applies to the Eastern Ghats.`, facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
      { text: "Eastern Ghats — higher and more continuous than the Western Ghats", exp: `The Eastern Ghats are ${ghats[1].height} and ${ghats[1].continuity}; the Western Ghats are higher and more continuous.`, facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
      { text: "Bundelkhand and Baghelkhand — parts of the Deccan Plateau south of the Narmada", exp: central[2].fact, facts: central[2].sourceFactIds },
    ];
    const askIncorrect = ql === 34;
    const correctRow = (askIncorrect ? wrongPairs : truePairs)[item];
    const distractorRows = askIncorrect ? truePairs : wrongPairs;
    stem = `Which of the following pairs is ${askIncorrect ? "incorrectly" : "correctly"} matched?`;
    correct = correctRow.text;
    options = fourOptions([correct, ...distractorRows.map((row) => row.text)], correct, `${qlId}:${item}`, target);
    explanation = correctRow.exp;
    factIds = [...correctRow.facts];
  } else if (ql === 35) {
    const sets = [
      { s1: "The Central Highlands lie mainly north of the Narmada River.", t1: true, s2: "The Deccan Plateau lies mainly south of the Narmada River.", t2: true, exp: "The Narmada broadly separates the Central Highlands to its north from the Deccan Plateau to its south.", facts: [...central[0].sourceFactIds, ...deccan[0].sourceFactIds] },
      { s1: "The Western Ghats are generally higher than the Eastern Ghats.", t1: true, s2: "The Eastern Ghats form a more continuous chain than the Western Ghats.", t2: false, exp: "The Western Ghats are generally higher and more continuous; the Eastern Ghats are lower, irregular and discontinuous.", facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
      { s1: "Bundelkhand and Baghelkhand are eastward extensions of the Central Highlands.", t1: true, s2: "Chotanagpur Plateau forms a further eastward extension.", t2: true, exp: "Bundelkhand and Baghelkhand extend the Central Highlands eastward, followed farther east by the Chotanagpur Plateau.", facts: [...central[2].sourceFactIds, ...central[3].sourceFactIds] },
      { s1: "The Deccan Plateau is higher in the west and slopes gently eastwards.", t1: true, s2: "The Satpura Range lies along its broad northern base.", t2: true, exp: "The Deccan Plateau rises higher in the west, slopes eastwards and has the Satpura Range along its broad northern base.", facts: [...deccan[1].sourceFactIds, ...deccan[2].sourceFactIds] },
      { s1: "The Chotanagpur Plateau is drained by the Damodar River.", t1: true, s2: "The Central Highlands become wider towards the east.", t2: false, exp: "The Chotanagpur Plateau is drained by the Damodar, while the Central Highlands are wider in the west and narrower in the east.", facts: [...central[1].sourceFactIds, ...central[3].sourceFactIds] },
      { s1: "The Eastern Ghats are cut by rivers flowing towards the Bay of Bengal.", t1: true, s2: "The Western Ghats lie along the eastern edge of the Deccan Plateau.", t2: false, exp: "The Eastern Ghats are river-cut and discontinuous. The Western Ghats form the western edge of the Deccan Plateau.", facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
    ];
    const row = sets[item];
    stem = `Consider the following statements:\nI. ${row.s1}\nII. ${row.s2}\nWhich of the statements given above is/are correct?`;
    correct = row.t1 && row.t2 ? "Both I and II" : row.t1 ? "I only" : row.t2 ? "II only" : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, target);
    explanation = row.exp;
    factIds = [...row.facts];
  } else {
    const sets = [
      { lines: [["The Peninsular Plateau is made largely of old crystalline, igneous and metamorphic rocks.", true], ["It formed from the breaking and drifting of Gondwana land.", true], ["It is mainly a young alluvial plain.", false]] as const, exp: "The first two statements describe the Peninsular Plateau correctly. It is an old rocky tableland, not a young alluvial plain.", facts: [...foundation[0].sourceFactIds, ...foundation[1].sourceFactIds] },
      { lines: [["The Central Highlands lie mainly north of the Narmada.", true], ["They are wider in the west and narrower in the east.", true], ["Bundelkhand and Baghelkhand are eastward extensions of this region.", true]] as const, exp: "All three statements correctly describe the Central Highlands.", facts: [...central[0].sourceFactIds, ...central[1].sourceFactIds, ...central[2].sourceFactIds] },
      { lines: [["The Deccan Plateau lies mainly south of the Narmada.", true], ["The Satpura Range forms its broad northern base.", true], ["The plateau is higher in the east and slopes westwards.", false]] as const, exp: "The Deccan Plateau lies south of the Narmada and has the Satpuras to the north, but it is higher in the west and slopes eastwards.", facts: [...deccan[0].sourceFactIds, ...deccan[1].sourceFactIds, ...deccan[2].sourceFactIds] },
      { lines: [["The Western Ghats are generally higher than the Eastern Ghats.", true], ["The Western Ghats form a more continuous chain.", true], ["The Eastern Ghats are cut by rivers.", true]] as const, exp: "All three statements correctly distinguish the Western and Eastern Ghats.", facts: [...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds] },
      { lines: [["Chotanagpur Plateau forms a further eastward extension of the Central Highlands.", true], ["It is drained by the Damodar River.", true], ["It lies along the western edge of the Deccan Plateau.", false]] as const, exp: "Chotanagpur is an eastward extension of the Central Highlands drained by the Damodar; it is not the western edge of the Deccan Plateau.", facts: [...central[3].sourceFactIds, ...ghats[0].sourceFactIds] },
      { lines: [["Meghalaya and Karbi-Anglong plateaus form part of the northeastern plateau extension.", true], ["Garo, Khasi and Jaintia occur in that northeastern extension.", true], ["The Narmada flows along the eastern edge of this extension.", false]] as const, exp: "The northeastern extension includes the Meghalaya and Karbi-Anglong plateaus and the Garo, Khasi and Jaintia Hills; the Narmada statement is incorrect.", facts: [...deccan[3].sourceFactIds, ...deccan[4].sourceFactIds] },
    ];
    const row = sets[item];
    stem = `Consider the following statements:\n1. ${row.lines[0][0]}\n2. ${row.lines[1][0]}\n3. ${row.lines[2][0]}\nHow many of the statements given above are correct?`;
    const count = row.lines.filter((entry) => entry[1]).length;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, target);
    explanation = row.exp;
    factIds = [...row.facts];
  }

  return {
    questionId: `GEO-PHY-001-CP004-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP004",
    qlId,
    qlName: qlNames[qlId],
    difficulty: difficulty(ql),
    stem,
    options,
    correctIndex: target,
    canonicalAnswer: correct,
    explanation,
    sourceIds: [GEO_PHY_001_CP004_SOURCE_ID],
    sourceFactIds: [...new Set(factIds)],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp004ReviewBatchV1() {
  const questions: GeoPhy001Cp004ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 28; ql <= 36; ql += 1) {
    for (let item = 0; item < 6; item += 1) {
      questions.push(makeQuestion(ql, item, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
