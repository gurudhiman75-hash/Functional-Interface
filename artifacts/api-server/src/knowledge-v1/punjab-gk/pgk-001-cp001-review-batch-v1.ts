import type { KnowledgeV1Difficulty } from "../types";
import {
  PGK_001_CP001_FACT_BY_ID,
  type Pgk001Cp001FactRow,
} from "./pgk-001-cp001-facts";

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

const rowsByQl: Record<keyof typeof PGK_001_CP001_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-001": [
    {
      difficulty: "Easy",
      stem: "What does the name 'Punjab' literally refer to?",
      canonical: "Land of five rivers",
      options: ["Land of five rivers", "Land of five mountains", "Land of five forts", "Land of five lakes"],
      factIds: ["name-etymology"],
      explanation: "The name is commonly explained from Punj, meaning five, and Aab, meaning water. It therefore carries the sense 'land of five rivers'.",
    },
    {
      difficulty: "Easy",
      stem: "Which river is NOT one of the five rivers traditionally linked with the name Punjab?",
      canonical: "Ganga",
      options: ["Ganga", "Ravi", "Chenab", "Jhelum"],
      factIds: ["historical-five-rivers"],
      explanation: "The traditional five are Sutlej, Beas, Ravi, Chenab and Jhelum. Ganga is not part of this five-river set.",
    },
    {
      difficulty: "Easy",
      stem: "Which three of the traditional five rivers flow through present-day Indian Punjab?",
      canonical: "Sutlej, Beas and Ravi",
      options: ["Sutlej, Beas and Ravi", "Ravi, Chenab and Jhelum", "Beas, Chenab and Jhelum", "Sutlej, Chenab and Jhelum"],
      factIds: ["historical-five-rivers", "current-three-rivers"],
      explanation: "The five-river name belongs to the wider historical Punjab. In present-day Indian Punjab, Sutlej, Beas and Ravi are the three from that traditional set that flow through the state.",
    },
    {
      difficulty: "Medium",
      stem: "Chenab and Jhelum belong to which Punjab GK context?",
      canonical: "The traditional five-river identity of historical Punjab",
      options: ["The traditional five-river identity of historical Punjab", "The three rivers flowing through present Indian Punjab", "Punjab's southern boundary", "Punjab's three broad regions"],
      factIds: ["historical-five-rivers", "current-three-rivers"],
      explanation: "Chenab and Jhelum are part of the traditional five-river identity of the wider historical Punjab. They are not among the three traditional rivers flowing through present-day Indian Punjab.",
    },
    {
      difficulty: "Medium",
      stem: "Which statement correctly distinguishes historical Punjab from present-day Indian Punjab?",
      canonical: "The traditional five include Chenab and Jhelum, while present Indian Punjab has Sutlej, Beas and Ravi from that set.",
      options: ["The traditional five include Chenab and Jhelum, while present Indian Punjab has Sutlej, Beas and Ravi from that set.", "All five traditional rivers flow through present Indian Punjab.", "Only Chenab and Jhelum flow through present Indian Punjab.", "Ravi was never part of the traditional five rivers."],
      factIds: ["historical-five-rivers", "current-three-rivers"],
      explanation: "The wider historical Punjab gives the state its five-river name. Present Indian Punjab contains Sutlej, Beas and Ravi from that traditional group, not all five.",
    },
    {
      difficulty: "Medium",
      stem: "Which pair is made up of rivers from the traditional Punjab five that do not flow through present-day Indian Punjab?",
      canonical: "Chenab and Jhelum",
      options: ["Chenab and Jhelum", "Sutlej and Beas", "Beas and Ravi", "Sutlej and Ravi"],
      factIds: ["historical-five-rivers", "current-three-rivers"],
      explanation: "Chenab and Jhelum complete the historical five-river set but do not flow through the present Indian state of Punjab. Sutlej, Beas and Ravi do.",
    },
  ],
  "PGK-001-QL-002": [
    {
      difficulty: "Easy",
      stem: "What is the geographical area of Punjab?",
      canonical: "50,362 sq km",
      options: ["50,362 sq km", "44,212 sq km", "55,673 sq km", "60,362 sq km"],
      factIds: ["area"],
      explanation: "The Government of Punjab gives the state's geographical area as 50,362 square kilometres.",
    },
    {
      difficulty: "Easy",
      stem: "Which country lies to the west of Punjab?",
      canonical: "Pakistan",
      options: ["Pakistan", "Nepal", "Bhutan", "Bangladesh"],
      factIds: ["west-border"],
      explanation: "Punjab is an international-border state. Pakistan lies along its western boundary.",
    },
    {
      difficulty: "Easy",
      stem: "Which state lies to the northeast of Punjab?",
      canonical: "Himachal Pradesh",
      options: ["Himachal Pradesh", "Rajasthan", "Haryana", "Uttarakhand"],
      factIds: ["northeast-border"],
      explanation: "Himachal Pradesh lies to the northeast of Punjab. Haryana and Rajasthan lie mainly to the south.",
    },
    {
      difficulty: "Medium",
      stem: "Which pair forms Punjab's southern boundary?",
      canonical: "Haryana and Rajasthan",
      options: ["Haryana and Rajasthan", "Himachal Pradesh and Haryana", "Jammu and Kashmir and Himachal Pradesh", "Rajasthan and Gujarat"],
      factIds: ["south-border"],
      explanation: "The Punjab government profile lists Haryana and Rajasthan on the south of the state.",
    },
    {
      difficulty: "Medium",
      stem: "Punjab lies approximately between which latitudes?",
      canonical: "29.30°N and 32.32°N",
      options: ["29.30°N and 32.32°N", "20.30°N and 23.32°N", "33.55°N and 36.50°N", "24.00°N and 27.00°N"],
      factIds: ["latitude-span"],
      explanation: "The official Punjab profile places the state roughly between 29.30°N and 32.32°N latitude.",
    },
    {
      difficulty: "Medium",
      stem: "Punjab lies approximately between which longitudes?",
      canonical: "73.55°E and 76.50°E",
      options: ["73.55°E and 76.50°E", "68.00°E and 71.00°E", "77.55°E and 80.50°E", "82.00°E and 85.00°E"],
      factIds: ["longitude-span"],
      explanation: "The official Punjab profile gives an approximate longitude span of 73.55°E to 76.50°E.",
    },
  ],
  "PGK-001-QL-003": [
    {
      difficulty: "Easy",
      stem: "Which three broad regions are listed for Punjab on the state government profile?",
      canonical: "Majha, Doaba and Malwa",
      options: ["Majha, Doaba and Malwa", "Majha, Mewar and Marwar", "Doaba, Bundelkhand and Malwa", "Malwa, Baghelkhand and Doaba"],
      factIds: ["traditional-regions"],
      explanation: "The Government of Punjab profile groups the state into Majha, Doaba and Malwa for its broad regional description.",
    },
    {
      difficulty: "Easy",
      stem: "What is the official language of Punjab?",
      canonical: "Punjabi",
      options: ["Punjabi", "Hindi", "Urdu", "Sanskrit"],
      factIds: ["official-language"],
      explanation: "Punjabi is the official language of Punjab.",
    },
    {
      difficulty: "Easy",
      stem: "Punjabi in Punjab is written in which script?",
      canonical: "Gurmukhi",
      options: ["Gurmukhi", "Devanagari", "Perso-Arabic", "Roman"],
      factIds: ["gurmukhi-script"],
      explanation: "The Punjab government profile states that Punjabi is written in the Gurmukhi script.",
    },
    {
      difficulty: "Easy",
      stem: "What is the capital of Punjab?",
      canonical: "Chandigarh",
      options: ["Chandigarh", "Ludhiana", "Amritsar", "Patiala"],
      factIds: ["capital-chandigarh"],
      explanation: "Chandigarh serves as the capital of Punjab.",
    },
    {
      difficulty: "Medium",
      stem: "Which statement about Chandigarh is correct?",
      canonical: "It is a Union Territory and the capital of both Punjab and Haryana.",
      options: ["It is a Union Territory and the capital of both Punjab and Haryana.", "It is a district of Punjab and only Punjab's capital.", "It is a district of Haryana and only Haryana's capital.", "It is a Union Territory but is not a state capital."],
      factIds: ["chandigarh-joint-capital"],
      explanation: "Chandigarh is administered as a Union Territory. It serves as the capital of both Punjab and Haryana.",
    },
    {
      difficulty: "Medium",
      stem: "Which set is correctly matched?",
      canonical: "Punjab — Punjabi — Gurmukhi",
      options: ["Punjab — Punjabi — Gurmukhi", "Punjab — Hindi — Gurmukhi", "Punjab — Punjabi — Devanagari", "Punjab — Urdu — Roman"],
      factIds: ["official-language", "gurmukhi-script"],
      explanation: "Punjabi is Punjab's official language, and the Punjab government profile gives Gurmukhi as its script.",
    },
  ],
  "PGK-001-QL-004": [
    {
      difficulty: "Medium",
      stem: "The reorganisation linked with the present Punjab-Haryana arrangement took effect on which date?",
      canonical: "1 November 1966",
      options: ["1 November 1966", "15 August 1947", "26 January 1950", "1 November 1956"],
      factIds: ["reorganisation-1966"],
      explanation: "The reorganisation took effect on 1 November 1966. Chandigarh then became a Union Territory and the capital of both Punjab and Haryana.",
    },
    {
      difficulty: "Medium",
      stem: "Which change is linked with the 1 November 1966 reorganisation?",
      canonical: "Chandigarh became a Union Territory serving as capital of Punjab and Haryana.",
      options: ["Chandigarh became a Union Territory serving as capital of Punjab and Haryana.", "All five historical Punjab rivers came within Indian Punjab.", "Punjab's capital shifted to Amritsar.", "Punjabi ceased to be used in Punjab."],
      factIds: ["reorganisation-1966", "chandigarh-joint-capital"],
      explanation: "The 1966 reorganisation is central to the present Punjab-Haryana-Chandigarh arrangement. Chandigarh became a Union Territory and the capital of both states.",
    },
    {
      difficulty: "Medium",
      stem: "According to Punjab at a Glance 2022, how many districts were recorded in Punjab?",
      canonical: "23",
      options: ["23", "20", "22", "25"],
      factIds: ["district-count-2022"],
      explanation: "Punjab at a Glance 2022 records 23 districts. The year matters because administrative counts can change.",
    },
    {
      difficulty: "Medium",
      stem: "Why should the figure '23 districts' carry a reference year in the Punjab GK engine?",
      canonical: "District counts are administrative data that can change over time.",
      options: ["District counts are administrative data that can change over time.", "Punjab's geographical area changes every census.", "The five-river identity changes every year.", "Gurmukhi changes with each district notification."],
      factIds: ["district-count-2022"],
      explanation: "District creation or reorganisation can change the count. The engine therefore stores 23 as a 2022 official snapshot rather than an eternal fact.",
    },
    {
      difficulty: "Hard",
      stem: "Which pair correctly combines an immutable historical date with a versioned administrative fact?",
      canonical: "1 November 1966 — reorganisation; 23 districts — 2022 snapshot",
      options: ["1 November 1966 — reorganisation; 23 districts — 2022 snapshot", "1 November 1956 — reorganisation; 23 districts — timeless count", "15 August 1947 — Chandigarh made joint capital; 20 districts — 2022 snapshot", "26 January 1950 — Punjab-Haryana reorganisation; 25 districts — 2022 snapshot"],
      factIds: ["reorganisation-1966", "district-count-2022"],
      explanation: "The 1966 reorganisation date is historical and fixed. The district count is administrative data and is tied here to the 2022 official statistical reference.",
    },
    {
      difficulty: "Hard",
      stem: "Which statement uses the safer form for an administrative GK fact?",
      canonical: "Punjab at a Glance 2022 records 23 districts.",
      options: ["Punjab at a Glance 2022 records 23 districts.", "Punjab will always have exactly 23 districts.", "Punjab has had 23 districts since 1966.", "The number of Punjab districts cannot change."],
      factIds: ["district-count-2022"],
      explanation: "Administrative boundaries are mutable. Attaching the official reference year prevents a current snapshot from being mistaken for an immutable historical fact.",
    },
  ],
  "PGK-001-QL-005": [
    {
      difficulty: "Easy",
      stem: "Which animal is the state animal of Punjab?",
      canonical: "Blackbuck",
      options: ["Blackbuck", "Sambar", "Chinkara", "Spotted deer"],
      factIds: ["state-animal-blackbuck"],
      explanation: "Blackbuck is the state animal of Punjab.",
    },
    {
      difficulty: "Easy",
      stem: "Which tree is the state tree of Punjab?",
      canonical: "Shisham",
      options: ["Shisham", "Deodar", "Banyan", "Neem"],
      factIds: ["state-tree-shisham"],
      explanation: "Shisham, also called Tahli or Indian Rosewood, is Punjab's state tree. Its scientific name is Dalbergia sissoo.",
    },
    {
      difficulty: "Medium",
      stem: "What is the scientific name of Punjab's state tree?",
      canonical: "Dalbergia sissoo",
      options: ["Dalbergia sissoo", "Ficus religiosa", "Azadirachta indica", "Cedrus deodara"],
      factIds: ["state-tree-shisham"],
      explanation: "Punjab's state tree is Shisham or Indian Rosewood. Its scientific name is Dalbergia sissoo.",
    },
    {
      difficulty: "Medium",
      stem: "Which bird is the state bird of Punjab?",
      canonical: "Northern Goshawk",
      options: ["Northern Goshawk", "Sarus Crane", "Great Hornbill", "Indian Roller"],
      factIds: ["state-bird-northern-goshawk"],
      explanation: "The Northern Goshawk is Punjab's state bird. The Punjab ENVIS reference cites the state notification issued in September 2015.",
    },
    {
      difficulty: "Medium",
      stem: "Which is Punjab's state aquatic animal?",
      canonical: "Indus River dolphin",
      options: ["Indus River dolphin", "Ganges River dolphin", "Gharial", "Smooth-coated otter"],
      factIds: ["state-aquatic-indus-dolphin"],
      explanation: "Punjab declared the Indus River dolphin its state aquatic animal in 2019. In India, the species survives in the Beas river system in Punjab.",
    },
    {
      difficulty: "Medium",
      stem: "Which pair is correctly matched?",
      canonical: "State tree — Shisham",
      options: ["State tree — Shisham", "State animal — Sambar", "State bird — Indian Roller", "State aquatic animal — Ganges River dolphin"],
      factIds: ["state-tree-shisham", "state-animal-blackbuck", "state-bird-northern-goshawk", "state-aquatic-indus-dolphin"],
      explanation: "Shisham is Punjab's state tree. The other corresponding symbols in this CP are Blackbuck, Northern Goshawk and Indus River dolphin.",
    },
  ],
  "PGK-001-QL-006": [
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Punjab's name refers to five rivers. II. All five traditional rivers flow through present-day Indian Punjab. III. Sutlej, Beas and Ravi flow through present-day Indian Punjab. Which are correct?",
      canonical: "I and III only",
      options: ["I and III only", "I and II only", "II and III only", "All three"],
      factIds: ["name-etymology", "historical-five-rivers", "current-three-rivers"],
      explanation: "Statement I is correct, but the five-river identity belongs to the wider historical Punjab. In present Indian Punjab, Sutlej, Beas and Ravi are the three rivers from that set, so III is also correct and II is not.",
    },
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Pakistan lies west of Punjab. II. Himachal Pradesh lies northeast of Punjab. III. Haryana and Rajasthan lie south of Punjab. Which are correct?",
      canonical: "All three",
      options: ["I and II only", "II and III only", "I and III only", "All three"],
      factIds: ["west-border", "northeast-border", "south-border"],
      explanation: "All three boundary statements match the Punjab government profile: Pakistan to the west, Himachal Pradesh to the northeast, and Haryana plus Rajasthan to the south.",
    },
    {
      difficulty: "Hard",
      stem: "A state has Punjabi as its official language, uses Gurmukhi for Punjabi, and shares Chandigarh as capital with Haryana. Which state is it?",
      canonical: "Punjab",
      options: ["Punjab", "Himachal Pradesh", "Rajasthan", "Uttarakhand"],
      factIds: ["official-language", "gurmukhi-script", "chandigarh-joint-capital"],
      explanation: "These clues point to Punjab: Punjabi is its official language, Gurmukhi is the script stated in the government profile, and Chandigarh is its shared capital with Haryana.",
    },
    {
      difficulty: "Hard",
      stem: "Which option contains one present-day Punjab river, one state symbol and the capital in that order?",
      canonical: "Beas — Blackbuck — Chandigarh",
      options: ["Beas — Blackbuck — Chandigarh", "Chenab — Sambar — Chandigarh", "Jhelum — Blackbuck — Amritsar", "Ravi — Ganges River dolphin — Patiala"],
      factIds: ["current-three-rivers", "state-animal-blackbuck", "capital-chandigarh", "state-aquatic-indus-dolphin"],
      explanation: "Beas is one of the three traditional rivers flowing through present Indian Punjab, Blackbuck is the state animal, and Chandigarh is the capital.",
    },
    {
      difficulty: "Hard",
      stem: "Which set contains only facts that belong to present-day Punjab rather than the wider historical five-river identity?",
      canonical: "Chandigarh, Punjabi, Blackbuck",
      options: ["Chandigarh, Punjabi, Blackbuck", "Chenab, Jhelum, Chandigarh", "Jhelum, Ravi, Chenab", "Chenab, Northern Goshawk, Jhelum"],
      factIds: ["capital-chandigarh", "official-language", "state-animal-blackbuck", "historical-five-rivers", "current-three-rivers"],
      explanation: "Chandigarh, Punjabi and Blackbuck are direct present-day state profile facts. Chenab and Jhelum belong to the wider historical five-river identity and should not be presented as rivers of the present Indian state.",
    },
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Chandigarh is a Union Territory. II. It serves as capital of Punjab and Haryana. III. The present arrangement is linked with the reorganisation effective on 1 November 1966. Which are correct?",
      canonical: "All three",
      options: ["I and II only", "II and III only", "I and III only", "All three"],
      factIds: ["chandigarh-joint-capital", "reorganisation-1966"],
      explanation: "All three statements are correct. Chandigarh is a Union Territory, serves both Punjab and Haryana as capital, and this arrangement is tied to the reorganisation effective from 1 November 1966.",
    },
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

for (const [qlId, rows] of Object.entries(rowsByQl) as Array<[
  keyof typeof PGK_001_CP001_QL_NAMES,
  readonly Row[],
]>) {
  for (const row of rows) {
    const facts = getFacts(row.factIds);
    const correctIndex = row.options.indexOf(row.canonical);
    if (correctIndex < 0) {
      throw new Error(`Canonical answer missing from options for ${qlId}: ${row.stem}`);
    }

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

  if (PGK_001_CP001_REVIEW_BATCH_V1.length !== 36) {
    issues.push(`Expected 36 review questions, found ${PGK_001_CP001_REVIEW_BATCH_V1.length}`);
  }

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

    for (const factId of question.factIds) {
      if (!PGK_001_CP001_FACT_BY_ID.has(factId)) issues.push(`${question.questionId} references unknown fact ${factId}`);
    }
  }

  for (const qlId of Object.keys(PGK_001_CP001_QL_NAMES)) {
    if ((qlCounts.get(qlId) ?? 0) !== 6) issues.push(`${qlId} must contain six review questions`);
  }

  const usedFacts = new Set(PGK_001_CP001_REVIEW_BATCH_V1.flatMap((question) => question.factIds));
  for (const factId of PGK_001_CP001_REQUIRED_FACTS_V1) {
    if (!usedFacts.has(factId)) issues.push(`Fact ${factId} is not exercised by the review batch`);
  }

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
