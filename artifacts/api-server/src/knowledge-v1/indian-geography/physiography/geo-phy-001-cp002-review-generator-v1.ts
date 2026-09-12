import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  GEO_PHY_001_CP002_LONGITUDINAL_ROWS_V1 as longitudinal,
  GEO_PHY_001_CP002_PURVACHAL_V1 as purvachal,
  GEO_PHY_001_CP002_REGIONAL_ROWS_V1 as regional,
  GEO_PHY_001_CP002_SOURCE_ID,
} from "./geo-phy-001-cp002-facts";
import type { GeoPhy001Cp002ReviewQuestion } from "./geo-phy-001-cp002-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-010": "Identify longitudinal Himalayan range",
  "GEO-PHY-001-QL-011": "Identify range from characteristic feature",
  "GEO-PHY-001-QL-012": "Identify regional Himalayan division",
  "GEO-PHY-001-QL-013": "River-boundary association",
  "GEO-PHY-001-QL-014": "Purvachal and eastern-hill association",
  "GEO-PHY-001-QL-015": "Correctly matched Himalayan pair",
  "GEO-PHY-001-QL-016": "Incorrectly matched Himalayan pair",
  "GEO-PHY-001-QL-017": "Statement I/II on Himalayan divisions",
  "GEO-PHY-001-QL-018": "Three-statement Himalayan count",
};

const longitudinalClues = [
  { answer: "Himadri", clue: longitudinal[0].position, fact: longitudinal[0].sourceFactIds[0] },
  { answer: "Himadri", clue: longitudinal[0].associatedFeature, fact: longitudinal[0].sourceFactIds[2] },
  { answer: "Himachal", clue: longitudinal[1].position, fact: longitudinal[1].sourceFactIds[0] },
  { answer: "Himachal", clue: longitudinal[1].associatedFeature, fact: longitudinal[1].sourceFactIds[2] },
  { answer: "Shiwaliks", clue: longitudinal[2].position, fact: longitudinal[2].sourceFactIds[0] },
  { answer: "Shiwaliks", clue: longitudinal[2].associatedFeature, fact: longitudinal[2].sourceFactIds[2] },
];

const regionalClues = [
  { answer: "Punjab Himalaya", clue: "the Himalayas between the Indus and Satluj rivers", fact: regional[0].sourceFactIds[0] },
  { answer: "Kumaon Himalayas", clue: "the Himalayas between the Satluj and Kali rivers", fact: regional[1].sourceFactIds[0] },
  { answer: "Nepal Himalayas", clue: "the Himalayas between the Kali and Teesta rivers", fact: regional[2].sourceFactIds[0] },
  { answer: "Assam Himalayas", clue: "the Himalayas between the Teesta and Dihang rivers", fact: regional[3].sourceFactIds[0] },
  { answer: "Kashmir Himalaya", clue: "the western regional part of the Punjab Himalaya", fact: regional[0].sourceFactIds[0] },
  { answer: "Himachal Himalaya", clue: "the eastern regional part of the Punjab Himalaya", fact: regional[0].sourceFactIds[0] },
];

const regionalOptions = regionalClues.map((x) => x.answer);
const longitudinalOptions = ["Himadri", "Himachal", "Shiwaliks", "Purvachal"];

function difficulty(ql: number): KnowledgeV1Difficulty {
  if ([10, 11, 12].includes(ql)) return "Easy";
  if ([13, 14, 15, 16, 17].includes(ql)) return "Medium";
  return "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const i = options.indexOf(correct);
  if (i < 0) throw new Error(`Missing correct option ${correct}`);
  [options[i], options[target]] = [options[target], options[i]];
  return options;
}

function fourOptions(pool: string[], correct: string, seed: string, target: number) {
  const others = deterministicShuffle(pool.filter((x) => x !== correct), seed).slice(0, 3);
  return moveCorrect(deterministicShuffle([correct, ...others], `${seed}:all`), correct, target);
}

function make(ql: number, i: number, global: number): GeoPhy001Cp002ReviewQuestion {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const target = global % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let factIds: string[] = [];

  if (ql === 10) {
    const x = longitudinalClues[i];
    stem = `Which longitudinal Himalayan range is identified by the clue: ${x.clue}?`;
    correct = x.answer;
    options = fourOptions(longitudinalOptions, correct, `${qlId}:${i}`, target);
    explanation = `${x.clue.charAt(0).toUpperCase() + x.clue.slice(1)} identifies ${x.answer}.`;
    factIds = [x.fact];
  } else if (ql === 11) {
    const rows = [
      { answer: "Himadri", clue: longitudinal[0].feature, fact: longitudinal[0].sourceFactIds[0] },
      { answer: "Himadri", clue: longitudinal[0].altitude, fact: longitudinal[0].sourceFactIds[1] },
      { answer: "Himachal", clue: longitudinal[1].feature, fact: longitudinal[1].sourceFactIds[0] },
      { answer: "Himachal", clue: longitudinal[1].altitude, fact: longitudinal[1].sourceFactIds[1] },
      { answer: "Shiwaliks", clue: longitudinal[2].feature, fact: longitudinal[2].sourceFactIds[0] },
      { answer: "Shiwaliks", clue: longitudinal[2].altitude, fact: longitudinal[2].sourceFactIds[1] },
    ];
    const x = rows[i];
    stem = `Which Himalayan range is best described as ${x.clue}?`;
    correct = x.answer;
    options = fourOptions(longitudinalOptions, correct, `${qlId}:${i}`, target);
    explanation = `${x.answer} is described as ${x.clue}.`;
    factIds = [x.fact];
  } else if (ql === 12) {
    const x = regionalClues[i];
    stem = `Which regional Himalayan division is described as ${x.clue}?`;
    correct = x.answer;
    options = fourOptions(regionalOptions, correct, `${qlId}:${i}`, target);
    explanation = `${x.clue.charAt(0).toUpperCase() + x.clue.slice(1)} is known as the ${x.answer}.`;
    factIds = [x.fact];
  } else if (ql === 13) {
    const x = regional[i % 4];
    const forms = i < 4
      ? { stem: `Which Himalayan division lies between the ${x.westBoundary} and ${x.eastBoundary} rivers?`, answer: x.division, explanation: `${x.division} lies between the ${x.westBoundary} and ${x.eastBoundary} rivers.` }
      : i === 4
        ? { stem: "Which river forms the eastern boundary of the Kumaon Himalayas?", answer: "Kali", explanation: "The Kumaon Himalayas extend from the Satluj River to the Kali River." }
        : { stem: "Which river forms the western boundary of the Assam Himalayas?", answer: "Teesta", explanation: "The Assam Himalayas extend from the Teesta River to the Dihang River." };
    correct = forms.answer;
    const pool = i < 4 ? regional.map((r) => r.division) : ["Indus", "Satluj", "Kali", "Teesta", "Dihang"];
    options = fourOptions(pool, correct, `${qlId}:${i}`, target);
    stem = forms.stem;
    explanation = forms.explanation;
    factIds = [i < 4 ? x.sourceFactIds[0] : i === 4 ? regional[1].sourceFactIds[0] : regional[3].sourceFactIds[0]];
  } else if (ql === 14) {
    const comps = purvachal.components;
    const items = [
      { stem: "What are the eastern hills and mountains beyond the Dihang gorge collectively called?", answer: "Purvachal", pool: ["Purvachal", "Himadri", "Himachal", "Shiwaliks"], exp: "Beyond the Dihang gorge, the Himalayas bend south and are known as the Purvachal." },
      { stem: "Beyond which gorge do the Himalayas bend sharply south into the Purvachal?", answer: "Dihang gorge", pool: ["Dihang gorge", "Kali valley", "Satluj valley", "Indus gorge"], exp: "The Purvachal begins beyond the Dihang gorge." },
      ...comps.map((c) => ({ stem: `Which of the following is a component of the Purvachal?`, answer: c, pool: [...comps, "Pir Panjal Range", "Dhauladhar Range"], exp: `${c} is one of the hill ranges included in the Purvachal.` })),
    ];
    const x = items[i];
    stem = x.stem;
    correct = x.answer;
    options = fourOptions(x.pool, correct, `${qlId}:${i}`, target);
    explanation = x.exp;
    factIds = [i < 2 ? purvachal.sourceFactIds[0] : purvachal.sourceFactIds[1]];
  } else if (ql === 15 || ql === 16) {
    const truePairs = [
      "Himadri — northernmost Himalayan range",
      "Himachal — Lesser Himalayas",
      "Shiwaliks — outermost Himalayan range",
      "Kumaon Himalayas — Satluj to Kali",
      "Nepal Himalayas — Kali to Teesta",
      "Assam Himalayas — Teesta to Dihang",
    ];
    const wrongPairs = [
      "Himadri — outermost Himalayan range",
      "Himachal — northernmost Himalayan range",
      "Shiwaliks — average height about 6,000 metres",
      "Kumaon Himalayas — Kali to Teesta",
      "Nepal Himalayas — Teesta to Dihang",
      "Assam Himalayas — Satluj to Kali",
    ];
    const wantIncorrect = ql === 16;
    stem = `Which of the following pairs is ${wantIncorrect ? "incorrectly" : "correctly"} matched?`;
    correct = (wantIncorrect ? wrongPairs : truePairs)[i];
    const distractors = (wantIncorrect ? truePairs : wrongPairs).filter((_, j) => j !== i);
    options = moveCorrect(deterministicShuffle([correct, ...deterministicShuffle(distractors, `${qlId}:${i}`).slice(0, 3)], `${qlId}:${i}:all`), correct, target);
    explanation = wantIncorrect ? `The pair “${correct}” is incorrect.` : `The pair “${correct}” is correct.`;
    factIds = [i < 3 ? longitudinal[i % 3].sourceFactIds[0] : regional[(i - 3) % 4].sourceFactIds[0]];
  } else if (ql === 17) {
    const statements = [
      ["Himadri is the northernmost Himalayan range.", true, "Shiwaliks are the outermost Himalayan range.", true],
      ["Himachal lies south of the Himadri.", true, "Duns lie between the Himadri and Himachal.", false],
      ["Kumaon Himalayas lie between the Satluj and Kali rivers.", true, "Nepal Himalayas lie between the Teesta and Dihang rivers.", false],
      ["Assam Himalayas lie between the Teesta and Dihang rivers.", true, "Purvachal lies beyond the Dihang gorge.", true],
      ["Shiwaliks are composed of unconsolidated sediments.", true, "Himadri has an average height of about 900 to 1,100 metres.", false],
      ["Purvachal includes the Naga and Mizo hills.", true, "Punjab Himalaya lies between the Kali and Teesta rivers.", false],
    ] as const;
    const [s1, t1, s2, t2] = statements[i];
    stem = `Consider the following statements:\nI. ${s1}\nII. ${s2}\nWhich of the statements given above is/are correct?`;
    correct = t1 && t2 ? "Both I and II" : t1 ? "I only" : t2 ? "II only" : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, target);
    explanation = `${s1} ${t1 ? "This is correct." : "This is incorrect."} ${s2} ${t2 ? "This is correct." : "This is incorrect."}`;
    factIds = ["geo-phy-001-cp002-statement-composition"];
  } else {
    const sets = [
      [["Himadri is the northernmost range.", true], ["Himachal lies south of Himadri.", true], ["Shiwaliks are the outermost range.", true]],
      [["Kumaon Himalayas lie between Satluj and Kali.", true], ["Nepal Himalayas lie between Kali and Teesta.", true], ["Assam Himalayas lie between Satluj and Kali.", false]],
      [["Purvachal begins beyond the Dihang gorge.", true], ["Naga Hills form part of Purvachal.", true], ["Pir Panjal forms part of Purvachal.", false]],
      [["Himadri averages about 6,000 metres in height.", true], ["Shiwaliks generally range around 900–1,100 metres in altitude.", true], ["Himachal is the outermost Himalayan range.", false]],
      [["Duns lie between Lesser Himalayas and Shiwaliks.", true], ["Kashmir and Himachal are regional names within the Punjab Himalaya.", true], ["Punjab Himalaya lies between Indus and Satluj.", true]],
      [["Purvachal includes Patkai Hills.", true], ["Purvachal includes Manipur Hills.", true], ["Purvachal lies west of the Indus.", false]],
    ] as const;
    const set = sets[i];
    stem = `Consider the following statements:\n1. ${set[0][0]}\n2. ${set[1][0]}\n3. ${set[2][0]}\nHow many of the statements given above are correct?`;
    const count = set.filter((x) => x[1]).length;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, target);
    explanation = `${count} of the three statements are correct.`;
    factIds = ["geo-phy-001-cp002-multistatement-composition"];
  }

  return {
    questionId: `GEO-PHY-001-CP002-V1-${String(global + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP002",
    qlId,
    qlName: qlNames[qlId],
    difficulty: difficulty(ql),
    stem,
    options,
    correctIndex: target,
    canonicalAnswer: correct,
    explanation,
    sourceIds: [GEO_PHY_001_CP002_SOURCE_ID],
    sourceFactIds: factIds,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp002ReviewBatchV1() {
  const out: GeoPhy001Cp002ReviewQuestion[] = [];
  let global = 0;
  for (let ql = 10; ql <= 18; ql += 1) {
    for (let i = 0; i < 6; i += 1) out.push(make(ql, i, global++));
  }
  return out;
}
