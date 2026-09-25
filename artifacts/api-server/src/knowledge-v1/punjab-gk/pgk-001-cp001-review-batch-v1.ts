import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP001_FACT_BY_ID, type Pgk001Cp001FactRow } from "./pgk-001-cp001-facts";

export type Pgk001Cp001ReviewQuestion = {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

export const PGK_001_CP001_QL_NAMES = Object.freeze({
  "PGK-001-QL-001": "Name and river identity",
  "PGK-001-QL-002": "Area, location and borders",
  "PGK-001-QL-003": "Regions, language and capital",
  "PGK-001-QL-004": "Reorganisation and versioned administration",
  "PGK-001-QL-005": "State symbols",
  "PGK-001-QL-006": "Profile synthesis and scope control",
} as const);

type Row = Readonly<{
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  canonical: string;
  options: readonly string[];
  factIds: readonly string[];
  explanation: string;
}>;

const R = (
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  canonical: string,
  options: readonly string[],
  factIds: readonly string[],
  explanation: string,
): Row => ({ difficulty, stem, canonical, options, factIds, explanation });

const rowsByQl: Record<keyof typeof PGK_001_CP001_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-001": [
    R("Easy", "What does the name 'Punjab' literally refer to?", "Land of five rivers", ["Land of five rivers", "Land of five mountains", "Land of five forts", "Land of five lakes"], ["name-etymology"], "The name is commonly explained from Punj, meaning five, and Aab, meaning water. It therefore carries the sense 'land of five rivers'."),
    R("Easy", "Which river is NOT one of the five rivers traditionally identified with Punjab?", "Ganga", ["Ganga", "Ravi", "Chenab", "Jhelum"], ["historical-five-rivers"], "The traditional five are Sutlej, Beas, Ravi, Chenab and Jhelum. Ganga is not part of this five-river set."),
    R("Easy", "Which three of the traditional five rivers flow through present-day Indian Punjab?", "Sutlej, Beas and Ravi", ["Sutlej, Beas and Ravi", "Ravi, Chenab and Jhelum", "Beas, Chenab and Jhelum", "Sutlej, Chenab and Jhelum"], ["historical-five-rivers", "current-three-rivers"], "The five-river name belongs to the wider historical Punjab. In present-day Indian Punjab, Sutlej, Beas and Ravi are the three from that traditional set that flow through the state."),
    R("Medium", "Chenab and Jhelum belong to which Punjab GK context?", "The traditional five-river identity of historical Punjab", ["The traditional five-river identity of historical Punjab", "The three rivers flowing through present Indian Punjab", "Punjab's southern boundary", "Punjab's three broad regions"], ["historical-five-rivers", "current-three-rivers"], "Chenab and Jhelum are part of the traditional five-river identity of the wider historical Punjab. They are not among the three traditional rivers flowing through present-day Indian Punjab."),
    R("Medium", "Which statement correctly distinguishes historical Punjab from present-day Indian Punjab?", "The traditional five include Chenab and Jhelum, while present Indian Punjab has Sutlej, Beas and Ravi from that set.", ["The traditional five include Chenab and Jhelum, while present Indian Punjab has Sutlej, Beas and Ravi from that set.", "All five traditional rivers flow through present Indian Punjab.", "Only Chenab and Jhelum flow through present Indian Punjab.", "Ravi was never part of the traditional five rivers."], ["historical-five-rivers", "current-three-rivers"], "The wider historical Punjab gives the region its five-river name. Present Indian Punjab contains Sutlej, Beas and Ravi from that traditional group, not all five."),
    R("Medium", "Which pair is made up of rivers from the traditional Punjab five that do not flow through present-day Indian Punjab?", "Chenab and Jhelum", ["Chenab and Jhelum", "Sutlej and Beas", "Beas and Ravi", "Sutlej and Ravi"], ["historical-five-rivers", "current-three-rivers"], "Chenab and Jhelum complete the historical five-river set but do not flow through the present Indian state of Punjab. Sutlej, Beas and Ravi do."),
  ],
  "PGK-001-QL-002": [
    R("Easy", "What is the geographical area of Punjab?", "50,362 sq km", ["50,362 sq km", "44,212 sq km", "55,673 sq km", "60,362 sq km"], ["area"], "Punjab covers 50,362 square kilometres."),
    R("Easy", "Which country lies to the west of Punjab?", "Pakistan", ["Pakistan", "Nepal", "Bhutan", "Bangladesh"], ["west-border"], "Punjab is an international-border state. Pakistan lies along its western boundary."),
    R("Medium", "Which pair correctly matches Punjab's northern and northeastern neighbours?", "North — Jammu and Kashmir; Northeast — Himachal Pradesh", ["North — Jammu and Kashmir; Northeast — Himachal Pradesh", "North — Haryana; Northeast — Rajasthan", "North — Rajasthan; Northeast — Jammu and Kashmir", "North — Himachal Pradesh; Northeast — Pakistan"], ["north-border", "northeast-border"], "Jammu and Kashmir lies to the north of Punjab, while Himachal Pradesh lies to its northeast."),
    R("Medium", "Which pair forms Punjab's southern boundary?", "Haryana and Rajasthan", ["Haryana and Rajasthan", "Himachal Pradesh and Haryana", "Jammu and Kashmir and Himachal Pradesh", "Rajasthan and Gujarat"], ["south-border"], "Haryana and Rajasthan lie along Punjab's southern side."),
    R("Medium", "Punjab lies approximately between which latitudes?", "29.30°N and 32.32°N", ["29.30°N and 32.32°N", "20.30°N and 23.32°N", "33.55°N and 36.50°N", "24.00°N and 27.00°N"], ["latitude-span"], "Punjab extends roughly from 29.30°N to 32.32°N latitude."),
    R("Medium", "Punjab lies approximately between which longitudes?", "73.55°E and 76.50°E", ["73.55°E and 76.50°E", "68.00°E and 71.00°E", "77.55°E and 80.50°E", "82.00°E and 85.00°E"], ["longitude-span"], "Punjab extends roughly from 73.55°E to 76.50°E longitude."),
  ],
  "PGK-001-QL-003": [
    R("Easy", "Into which three broad regions is Punjab traditionally divided?", "Majha, Doaba and Malwa", ["Majha, Doaba and Malwa", "Majha, Mewar and Marwar", "Doaba, Bundelkhand and Malwa", "Malwa, Baghelkhand and Doaba"], ["traditional-regions"], "Punjab is traditionally divided into Majha, Doaba and Malwa."),
    R("Easy", "What is the official language of Punjab?", "Punjabi", ["Punjabi", "Hindi", "Urdu", "Sanskrit"], ["official-language"], "Punjabi is the official language of Punjab."),
    R("Easy", "Punjabi in Punjab is written in which script?", "Gurmukhi", ["Gurmukhi", "Devanagari", "Perso-Arabic", "Roman"], ["gurmukhi-script"], "Punjabi is written in the Gurmukhi script in Punjab."),
    R("Easy", "What is the capital of Punjab?", "Chandigarh", ["Chandigarh", "Ludhiana", "Amritsar", "Patiala"], ["capital-chandigarh"], "Chandigarh serves as the capital of Punjab."),
    R("Medium", "Which statement about Chandigarh is correct?", "It is a Union Territory and the capital of both Punjab and Haryana.", ["It is a Union Territory and the capital of both Punjab and Haryana.", "It is a district of Punjab and only Punjab's capital.", "It is a district of Haryana and only Haryana's capital.", "It is a Union Territory but is not a state capital."], ["chandigarh-joint-capital"], "Chandigarh is administered as a Union Territory. It serves as the capital of both Punjab and Haryana."),
    R("Medium", "Which set is correctly matched?", "Punjab — Punjabi — Gurmukhi", ["Punjab — Punjabi — Gurmukhi", "Punjab — Hindi — Gurmukhi", "Punjab — Punjabi — Devanagari", "Punjab — Urdu — Roman"], ["official-language", "gurmukhi-script"], "Punjabi is Punjab's official language, and it is written in the Gurmukhi script."),
  ],
  "PGK-001-QL-004": [
    R("Medium", "The reorganisation that created the present Punjab-Haryana arrangement took effect on which date?", "1 November 1966", ["1 November 1966", "15 August 1947", "26 January 1950", "1 November 1956"], ["reorganisation-1966"], "The reorganisation took effect on 1 November 1966. Chandigarh then became a Union Territory and the capital of both Punjab and Haryana."),
    R("Medium", "Which change followed the reorganisation of 1 November 1966?", "Chandigarh became a Union Territory serving as capital of Punjab and Haryana.", ["Chandigarh became a Union Territory serving as capital of Punjab and Haryana.", "All five historical Punjab rivers came within Indian Punjab.", "Punjab's capital shifted to Amritsar.", "Punjabi ceased to be used in Punjab."], ["reorganisation-1966", "chandigarh-joint-capital"], "The 1966 reorganisation is central to the present Punjab-Haryana-Chandigarh arrangement. Chandigarh became a Union Territory and the capital of both states."),
    R("Medium", "As recorded in 2022, how many districts did Punjab have?", "23", ["23", "20", "22", "25"], ["district-count-2022"], "Punjab had 23 districts in the 2022 snapshot. The year is stated because district counts can change after administrative reorganisation."),
    R("Medium", "In Punjab's 2022 administrative snapshot, what did the number 23 represent?", "Districts", ["Districts", "Divisions", "Tehsils", "Blocks"], ["district-count-2022"], "It represented the number of districts in Punjab in 2022."),
    R("Hard", "Which pair is correctly matched?", "1 November 1966 — Punjab reorganisation; 2022 — 23 districts", ["1 November 1966 — Punjab reorganisation; 2022 — 23 districts", "1 November 1956 — Punjab reorganisation; 2022 — 25 districts", "15 August 1947 — Chandigarh made joint capital; 2022 — 20 districts", "26 January 1950 — Punjab-Haryana reorganisation; 2022 — 22 districts"], ["reorganisation-1966", "district-count-2022"], "The Punjab-Haryana reorganisation took effect on 1 November 1966. Punjab had 23 districts in the 2022 snapshot."),
    R("Hard", "Which statement is correct?", "Punjab was reorganised in 1966, and the 2022 official profile records 23 districts.", ["Punjab was reorganised in 1966, and the 2022 official profile records 23 districts.", "Punjab was reorganised in 1956, and Punjab had 25 districts in 2022.", "Chandigarh became a district of Punjab in 1966, and Punjab had 20 districts in 2022.", "Punjab-Haryana reorganisation took effect in 1950, and Punjab had 22 districts in 2022."], ["reorganisation-1966", "district-count-2022", "chandigarh-joint-capital"], "The reorganisation took effect on 1 November 1966, and Punjab had 23 districts in the 2022 snapshot. Chandigarh is a Union Territory, not a Punjab district."),
  ],
  "PGK-001-QL-005": [
    R("Easy", "Which animal is the state animal of Punjab?", "Blackbuck", ["Blackbuck", "Sambar", "Chinkara", "Spotted deer"], ["state-animal-blackbuck"], "Blackbuck is the state animal of Punjab."),
    R("Easy", "Which tree is the state tree of Punjab?", "Shisham", ["Shisham", "Deodar", "Banyan", "Neem"], ["state-tree-shisham"], "Shisham, also called Tahli or Indian Rosewood, is Punjab's state tree. Its scientific name is Dalbergia sissoo."),
    R("Medium", "What is the scientific name of Punjab's state tree?", "Dalbergia sissoo", ["Dalbergia sissoo", "Ficus religiosa", "Azadirachta indica", "Cedrus deodara"], ["state-tree-shisham"], "Punjab's state tree is Shisham or Indian Rosewood. Its scientific name is Dalbergia sissoo."),
    R("Medium", "Which bird is the state bird of Punjab?", "Northern Goshawk", ["Northern Goshawk", "Sarus Crane", "Great Hornbill", "Indian Roller"], ["state-bird-northern-goshawk"], "The Northern Goshawk is Punjab's state bird. It was notified as the state bird in September 2015."),
    R("Medium", "Which is Punjab's state aquatic animal?", "Indus River dolphin", ["Indus River dolphin", "Ganges River dolphin", "Gharial", "Smooth-coated otter"], ["state-aquatic-indus-dolphin"], "Punjab declared the Indus River dolphin its state aquatic animal in 2019. In India, the species survives in the Beas river system in Punjab."),
    R("Medium", "Which pair is correctly matched?", "State tree — Shisham", ["State tree — Shisham", "State animal — Sambar", "State bird — Indian Roller", "State aquatic animal — Ganges River dolphin"], ["state-tree-shisham", "state-animal-blackbuck", "state-bird-northern-goshawk", "state-aquatic-indus-dolphin"], "Shisham is Punjab's state tree. The other corresponding symbols in this CP are Blackbuck, Northern Goshawk and Indus River dolphin."),
  ],
  "PGK-001-QL-006": [
    R("Hard", "Consider the statements: I. Punjab's name refers to five rivers. II. All five traditional rivers flow through present-day Indian Punjab. III. Sutlej, Beas and Ravi flow through present-day Indian Punjab. Which are correct?", "I and III only", ["I and III only", "I and II only", "II and III only", "All three"], ["name-etymology", "historical-five-rivers", "current-three-rivers"], "Statement I is correct, but the five-river identity belongs to the wider historical Punjab. In present Indian Punjab, Sutlej, Beas and Ravi are the three rivers from that set, so III is also correct and II is not."),
    R("Hard", "Consider the statements: I. Pakistan lies west of Punjab. II. Himachal Pradesh lies northeast of Punjab. III. Haryana and Rajasthan lie south of Punjab. Which are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["west-border", "northeast-border", "south-border"], "All three are correct: Pakistan lies to the west, Himachal Pradesh to the northeast, and Haryana plus Rajasthan to the south."),
    R("Hard", "A state has Punjabi as its official language, uses Gurmukhi for Punjabi, and shares Chandigarh as capital with Haryana. Which state is it?", "Punjab", ["Punjab", "Himachal Pradesh", "Rajasthan", "Uttarakhand"], ["official-language", "gurmukhi-script", "chandigarh-joint-capital"], "These clues point to Punjab: Punjabi is its official language, Gurmukhi is used to write Punjabi, and Chandigarh is its shared capital with Haryana."),
    R("Hard", "Which option contains one present-day Punjab river, one state symbol and the capital in that order?", "Beas — Blackbuck — Chandigarh", ["Beas — Blackbuck — Chandigarh", "Chenab — Sambar — Chandigarh", "Jhelum — Blackbuck — Amritsar", "Ravi — Ganges River dolphin — Patiala"], ["current-three-rivers", "state-animal-blackbuck", "capital-chandigarh", "state-aquatic-indus-dolphin"], "Beas is one of the three traditional rivers flowing through present Indian Punjab, Blackbuck is the state animal, and Chandigarh is the capital."),
    R("Hard", "Which set contains only facts that belong to present-day Punjab rather than the wider historical five-river identity?", "Chandigarh, Punjabi, Blackbuck", ["Chandigarh, Punjabi, Blackbuck", "Chenab, Jhelum, Chandigarh", "Jhelum, Ravi, Chenab", "Chenab, Northern Goshawk, Jhelum"], ["capital-chandigarh", "official-language", "state-animal-blackbuck", "historical-five-rivers", "current-three-rivers"], "Chandigarh, Punjabi and Blackbuck are direct present-day Punjab facts. Chenab and Jhelum belong to the wider historical five-river identity and should not be presented as rivers of the present Indian state."),
    R("Hard", "Consider the statements: I. Chandigarh is a Union Territory. II. It serves as capital of Punjab and Haryana. III. The present arrangement resulted from the reorganisation effective on 1 November 1966. Which are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["chandigarh-joint-capital", "reorganisation-1966"], "All three statements are correct. Chandigarh is a Union Territory, serves both Punjab and Haryana as capital, and this arrangement is tied to the reorganisation effective from 1 November 1966."),
  ],
};

function getFacts(factIds: readonly string[]): Pgk001Cp001FactRow[] {
  return factIds.map((factId) => {
    const fact = PGK_001_CP001_FACT_BY_ID.get(factId);
    if (!fact) throw new Error(`Unknown PGK-001 CP001 fact: ${factId}`);
    return fact;
  });
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

const questions: Pgk001Cp001ReviewQuestion[] = [];
let globalIndex = 0;

for (const [qlId, rows] of Object.entries(rowsByQl) as Array<[keyof typeof PGK_001_CP001_QL_NAMES, readonly Row[]]>) {
  for (const row of rows) {
    const facts = getFacts(row.factIds);
    const correctIndex = row.options.indexOf(row.canonical);
    if (correctIndex < 0) throw new Error(`Canonical answer missing from options for ${qlId}: ${row.stem}`);
    globalIndex += 1;
    questions.push(Object.freeze({
      questionId: `PGK-001-CP001-Q${String(globalIndex).padStart(3, "0")}`,
      qlId,
      qlName: PGK_001_CP001_QL_NAMES[qlId],
      difficulty: row.difficulty,
      stem: row.stem,
      options: Object.freeze([...row.options]),
      correctIndex,
      canonicalAnswer: row.canonical,
      explanation: row.explanation,
      factIds: Object.freeze([...row.factIds]),
      sourceIds: Object.freeze(unique(facts.flatMap((fact) => fact.sourceIds))),
      sourceFactIds: Object.freeze(unique(facts.flatMap((fact) => fact.sourceFactIds))),
      reviewOnly: true,
      runtimeRegistered: false,
    }));
  }
}

export const PGK_001_CP001_REVIEW_BATCH_V1: readonly Pgk001Cp001ReviewQuestion[] = Object.freeze(questions);
export const PGK_001_CP001_REQUIRED_FACTS_V1 = Object.freeze([...PGK_001_CP001_FACT_BY_ID.keys()]);

export function auditPgk001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const qlCounts = new Map<string, number>();

  if (PGK_001_CP001_REVIEW_BATCH_V1.length !== 36) issues.push(`Expected 36 review questions, found ${PGK_001_CP001_REVIEW_BATCH_V1.length}`);

  for (const question of PGK_001_CP001_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`Duplicate questionId ${question.questionId}`);
    ids.add(question.questionId);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId} does not have four options`);
    if (new Set(question.options).size !== question.options.length) issues.push(`${question.questionId} has duplicate options`);
    if (question.correctIndex < 0 || question.correctIndex >= question.options.length) issues.push(`${question.questionId} has invalid correctIndex`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId} canonical answer mismatch`);
    if (question.explanation.trim().length < 20) issues.push(`${question.questionId} explanation is too short`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId} violates review-only lifecycle`);
    for (const factId of question.factIds) if (!PGK_001_CP001_FACT_BY_ID.has(factId)) issues.push(`${question.questionId} references unknown fact ${factId}`);
  }

  for (const qlId of Object.keys(PGK_001_CP001_QL_NAMES)) if ((qlCounts.get(qlId) ?? 0) !== 6) issues.push(`${qlId} must contain six review questions`);

  const usedFacts = new Set(PGK_001_CP001_REVIEW_BATCH_V1.flatMap((question) => question.factIds));
  for (const factId of PGK_001_CP001_REQUIRED_FACTS_V1) if (!usedFacts.has(factId)) issues.push(`Fact ${factId} is not exercised by the review batch`);

  const stems = PGK_001_CP001_REVIEW_BATCH_V1.map((question) => question.stem.toLowerCase());
  if (new Set(stems).size !== stems.length) issues.push("Duplicate learner-facing stems detected");

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP001_REVIEW_BATCH_V1.length,
    qlCounts: Object.freeze(Object.fromEntries(qlCounts.entries())),
    usedFactCount: usedFacts.size,
    requiredFactCount: PGK_001_CP001_REQUIRED_FACTS_V1.length,
  });
}
