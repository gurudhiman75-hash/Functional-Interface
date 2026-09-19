import type { KnowledgeV1Difficulty } from "../types";
import {
  PGK_001_CP002_ADMIN_SNAPSHOT_V1,
  PGK_001_CP002_DISTRICTS_V1,
  PGK_001_CP002_DISTRICT_BY_ID,
  PGK_001_CP002_FORMATION_FACTS_V1,
  PGK_001_CP002_SOURCE_IDS,
} from "./pgk-001-cp002-facts";

export type Pgk001Cp002ReviewQuestion = Readonly<{
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
  reviewOnly: true;
  runtimeRegistered: false;
}>;

export const PGK_001_CP002_QL_NAMES = Object.freeze({
  "PGK-001-QL-007": "Punjab administrative divisions",
  "PGK-001-QL-008": "District headquarters and aliases",
  "PGK-001-QL-009": "District-to-division membership",
  "PGK-001-QL-010": "District formation and parent districts",
  "PGK-001-QL-011": "Administrative pair checking",
  "PGK-001-QL-012": "Two-clue district identification",
  "PGK-001-QL-013": "Administrative synthesis",
} as const);

type Row = Readonly<{
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  canonical: string;
  options: readonly string[];
  factIds: readonly string[];
  sourceIds: readonly string[];
  explanation: string;
}>;

const snapshotSources = PGK_001_CP002_ADMIN_SNAPSHOT_V1.sourceIds;
const divisionSources = [PGK_001_CP002_SOURCE_IDS.atGlance2022, PGK_001_CP002_SOURCE_IDS.civilList2020] as const;
const rosterSources = [PGK_001_CP002_SOURCE_IDS.epos2026, PGK_001_CP002_SOURCE_IDS.atGlance2022] as const;

const rowsByQl: Record<keyof typeof PGK_001_CP002_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-007": [
    {
      difficulty: "Easy",
      stem: "According to Punjab at a Glance 2022, how many administrative divisions were recorded in Punjab?",
      canonical: "5",
      options: ["5", "4", "6", "7"],
      factIds: ["admin-snapshot-2022"],
      sourceIds: snapshotSources,
      explanation: "Punjab at a Glance 2022 records five administrative divisions. The same snapshot records 23 districts.",
    },
    {
      difficulty: "Easy",
      stem: "Which of these is an administrative division of Punjab?",
      canonical: "Faridkot",
      options: ["Faridkot", "Ludhiana", "Bathinda", "Sangrur"],
      factIds: ["division-list"],
      sourceIds: divisionSources,
      explanation: "Faridkot is one of Punjab's administrative divisions. Ludhiana, Bathinda and Sangrur are districts but are not names of divisions in this five-division structure.",
    },
    {
      difficulty: "Easy",
      stem: "Which set contains only administrative divisions of Punjab?",
      canonical: "Faridkot, Ferozepur and Jalandhar",
      options: ["Faridkot, Ferozepur and Jalandhar", "Bathinda, Ludhiana and Patiala", "Amritsar, Sangrur and Rupnagar", "Mansa, Moga and Jalandhar"],
      factIds: ["division-list"],
      sourceIds: divisionSources,
      explanation: "Faridkot, Ferozepur and Jalandhar are all administrative divisions. The other sets mix districts that are not division names.",
    },
    {
      difficulty: "Medium",
      stem: "Ropar is another name for which Punjab administrative division?",
      canonical: "Rupnagar",
      options: ["Rupnagar", "Patiala", "Faridkot", "Jalandhar"],
      factIds: ["division-list", "rupnagar"],
      sourceIds: divisionSources,
      explanation: "Rupnagar is also called Ropar. Rupnagar is both a district name and the name of an administrative division.",
    },
    {
      difficulty: "Medium",
      stem: "Which of these is NOT the name of one of Punjab's five administrative divisions in the 2022 official snapshot?",
      canonical: "Ludhiana",
      options: ["Ludhiana", "Patiala", "Ferozepur", "Rupnagar"],
      factIds: ["admin-snapshot-2022", "division-list", "ludhiana"],
      sourceIds: divisionSources,
      explanation: "The five division names are Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar. Ludhiana is a district placed under Patiala division.",
    },
    {
      difficulty: "Medium",
      stem: "Which list gives the complete five-division set of Punjab used in the 2022 administrative snapshot?",
      canonical: "Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar",
      options: ["Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar", "Faridkot, Ludhiana, Jalandhar, Patiala and Rupnagar", "Bathinda, Ferozepur, Jalandhar, Sangrur and Rupnagar", "Faridkot, Ferozepur, Amritsar, Patiala and Chandigarh"],
      factIds: ["admin-snapshot-2022", "division-list"],
      sourceIds: divisionSources,
      explanation: "Punjab's five administrative divisions in the cited structure are Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar.",
    },
  ],
  "PGK-001-QL-008": [
    {
      difficulty: "Easy",
      stem: "What is the district headquarters of Sahibzada Ajit Singh Nagar district?",
      canonical: "Mohali",
      options: ["Mohali", "Rupnagar", "Patiala", "Kharar"],
      factIds: ["sas-nagar"],
      sourceIds: rosterSources,
      explanation: "Sahibzada Ajit Singh Nagar district is also called SAS Nagar or Mohali district. Its headquarters is Mohali.",
    },
    {
      difficulty: "Easy",
      stem: "What is the district headquarters of Shaheed Bhagat Singh Nagar district?",
      canonical: "Nawanshahr",
      options: ["Nawanshahr", "Banga", "Balachaur", "Rupnagar"],
      factIds: ["sbs-nagar"],
      sourceIds: rosterSources,
      explanation: "Shaheed Bhagat Singh Nagar district has its headquarters at Nawanshahr. The district is also abbreviated as SBS Nagar.",
    },
    {
      difficulty: "Medium",
      stem: "Nawanshahr is the headquarters of which district?",
      canonical: "Shaheed Bhagat Singh Nagar",
      options: ["Shaheed Bhagat Singh Nagar", "Sahibzada Ajit Singh Nagar", "Rupnagar", "Hoshiarpur"],
      factIds: ["sbs-nagar"],
      sourceIds: rosterSources,
      explanation: "Nawanshahr is the headquarters of Shaheed Bhagat Singh Nagar district. Nawanshahr is also a familiar older/common name for the district area.",
    },
    {
      difficulty: "Medium",
      stem: "Mohali is the headquarters of which district?",
      canonical: "Sahibzada Ajit Singh Nagar",
      options: ["Sahibzada Ajit Singh Nagar", "Fatehgarh Sahib", "Rupnagar", "Patiala"],
      factIds: ["sas-nagar"],
      sourceIds: rosterSources,
      explanation: "Mohali is the headquarters of Sahibzada Ajit Singh Nagar district, also shortened to SAS Nagar.",
    },
    {
      difficulty: "Easy",
      stem: "Which district is also called Ropar?",
      canonical: "Rupnagar",
      options: ["Rupnagar", "Gurdaspur", "Ferozepur", "Kapurthala"],
      factIds: ["rupnagar"],
      sourceIds: rosterSources,
      explanation: "Rupnagar is also called Ropar. Both names may appear in Punjab GK material and official usage.",
    },
    {
      difficulty: "Medium",
      stem: "Which district-headquarters pair is correctly matched?",
      canonical: "Shaheed Bhagat Singh Nagar — Nawanshahr",
      options: ["Shaheed Bhagat Singh Nagar — Nawanshahr", "Sahibzada Ajit Singh Nagar — Rupnagar", "Fatehgarh Sahib — Patiala", "Sri Muktsar Sahib — Bathinda"],
      factIds: ["sbs-nagar", "sas-nagar", "fatehgarh-sahib", "sri-muktsar-sahib"],
      sourceIds: rosterSources,
      explanation: "Shaheed Bhagat Singh Nagar district has its headquarters at Nawanshahr. Sahibzada Ajit Singh Nagar is headquartered at Mohali, while the other listed districts have same-name headquarters.",
    },
  ],
  "PGK-001-QL-009": [
    {
      difficulty: "Easy",
      stem: "Moga district falls under which administrative division?",
      canonical: "Ferozepur",
      options: ["Ferozepur", "Faridkot", "Patiala", "Jalandhar"],
      factIds: ["moga"],
      sourceIds: divisionSources,
      explanation: "Moga district falls under Ferozepur division.",
    },
    {
      difficulty: "Easy",
      stem: "Bathinda district falls under which administrative division?",
      canonical: "Faridkot",
      options: ["Faridkot", "Ferozepur", "Patiala", "Rupnagar"],
      factIds: ["bathinda"],
      sourceIds: divisionSources,
      explanation: "Bathinda is grouped under Faridkot division in Punjab's administrative structure.",
    },
    {
      difficulty: "Easy",
      stem: "Amritsar district falls under which administrative division?",
      canonical: "Jalandhar",
      options: ["Jalandhar", "Ferozepur", "Patiala", "Rupnagar"],
      factIds: ["amritsar"],
      sourceIds: divisionSources,
      explanation: "Amritsar district is part of Jalandhar division.",
    },
    {
      difficulty: "Medium",
      stem: "Ludhiana district is administered under which division?",
      canonical: "Patiala",
      options: ["Patiala", "Jalandhar", "Faridkot", "Ferozepur"],
      factIds: ["ludhiana"],
      sourceIds: divisionSources,
      explanation: "Ludhiana district falls under Patiala division.",
    },
    {
      difficulty: "Medium",
      stem: "Sahibzada Ajit Singh Nagar district falls under which division?",
      canonical: "Rupnagar",
      options: ["Rupnagar", "Patiala", "Jalandhar", "Faridkot"],
      factIds: ["sas-nagar"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.sasNagar, ...divisionSources],
      explanation: "Sahibzada Ajit Singh Nagar district is part of Rupnagar division. Its district headquarters is Mohali.",
    },
    {
      difficulty: "Medium",
      stem: "Malerkotla district is part of which administrative division?",
      canonical: "Patiala",
      options: ["Patiala", "Faridkot", "Ferozepur", "Rupnagar"],
      factIds: ["malerkotla"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.malerkotla, ...divisionSources],
      explanation: "Malerkotla district is part of Patiala division. It became Punjab's 23rd district in 2021.",
    },
  ],
  "PGK-001-QL-010": [
    {
      difficulty: "Medium",
      stem: "Malerkotla district was carved out of which district in 2021?",
      canonical: "Sangrur",
      options: ["Sangrur", "Patiala", "Barnala", "Ludhiana"],
      factIds: ["malerkotla-2021"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.malerkotla],
      explanation: "Malerkotla was carved out of Sangrur district and became Punjab's 23rd district on 2 June 2021.",
    },
    {
      difficulty: "Medium",
      stem: "Which of these districts was formed most recently?",
      canonical: "Malerkotla",
      options: ["Malerkotla", "Pathankot", "Barnala", "Moga"],
      factIds: ["malerkotla-2021", "pathankot-2011", "barnala-2006", "moga-1995"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.malerkotla, PGK_001_CP002_SOURCE_IDS.pathankot, PGK_001_CP002_SOURCE_IDS.barnala, PGK_001_CP002_SOURCE_IDS.moga],
      explanation: "Malerkotla became a district in 2021. Pathankot was created in 2011, Barnala in 2006 and Moga in 1995.",
    },
    {
      difficulty: "Medium",
      stem: "Pathankot became a separate district in 2011 after being part of which district?",
      canonical: "Gurdaspur",
      options: ["Gurdaspur", "Amritsar", "Hoshiarpur", "Kapurthala"],
      factIds: ["pathankot-2011"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.pathankot],
      explanation: "Pathankot was earlier a tehsil of Gurdaspur district. It was declared a separate district on 27 July 2011.",
    },
    {
      difficulty: "Medium",
      stem: "Tarn Taran district was created in 2006 from which district?",
      canonical: "Amritsar",
      options: ["Amritsar", "Gurdaspur", "Kapurthala", "Ferozepur"],
      factIds: ["tarn-taran-2006"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.tarnTaran],
      explanation: "Tarn Taran was formed from Amritsar district on 16 June 2006 and became Punjab's 19th district.",
    },
    {
      difficulty: "Medium",
      stem: "Barnala became a separate district on which date?",
      canonical: "19 November 2006",
      options: ["19 November 2006", "14 April 2006", "16 June 2006", "27 July 2011"],
      factIds: ["barnala-2006"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.barnala],
      explanation: "Barnala became a separate district on 19 November 2006. Before that, it was part of Sangrur district.",
    },
    {
      difficulty: "Medium",
      stem: "Moga became a district in 1995 after earlier being a subdivision of which district?",
      canonical: "Faridkot",
      options: ["Faridkot", "Ferozepur", "Bathinda", "Ludhiana"],
      factIds: ["moga-1995"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.moga],
      explanation: "Moga district was formed on 24 November 1995. Before becoming a district, Moga was a subdivision of Faridkot district.",
    },
  ],
  "PGK-001-QL-011": [
    {
      difficulty: "Medium",
      stem: "Which district-division pair is incorrectly matched?",
      canonical: "Moga — Faridkot division",
      options: ["Moga — Faridkot division", "Bathinda — Faridkot division", "Amritsar — Jalandhar division", "Ludhiana — Patiala division"],
      factIds: ["moga", "bathinda", "amritsar", "ludhiana"],
      sourceIds: divisionSources,
      explanation: "Moga belongs to Ferozepur division, not Faridkot division. The other three pairs are correctly matched.",
    },
    {
      difficulty: "Medium",
      stem: "Which district-division pair is correctly matched?",
      canonical: "Bathinda — Faridkot division",
      options: ["Bathinda — Faridkot division", "Pathankot — Patiala division", "Sangrur — Jalandhar division", "Fazilka — Rupnagar division"],
      factIds: ["bathinda", "pathankot", "sangrur", "fazilka"],
      sourceIds: divisionSources,
      explanation: "Bathinda belongs to Faridkot division. Pathankot is under Jalandhar, Sangrur under Patiala and Fazilka under Ferozepur division.",
    },
    {
      difficulty: "Medium",
      stem: "Which district-headquarters pair is correctly matched?",
      canonical: "Sahibzada Ajit Singh Nagar — Mohali",
      options: ["Sahibzada Ajit Singh Nagar — Mohali", "Shaheed Bhagat Singh Nagar — Rupnagar", "Fatehgarh Sahib — Patiala", "Pathankot — Gurdaspur"],
      factIds: ["sas-nagar", "sbs-nagar", "fatehgarh-sahib", "pathankot"],
      sourceIds: rosterSources,
      explanation: "Sahibzada Ajit Singh Nagar district has its headquarters at Mohali. Shaheed Bhagat Singh Nagar is headquartered at Nawanshahr.",
    },
    {
      difficulty: "Medium",
      stem: "Which district-headquarters pair is incorrectly matched?",
      canonical: "Shaheed Bhagat Singh Nagar — Rupnagar",
      options: ["Shaheed Bhagat Singh Nagar — Rupnagar", "Sahibzada Ajit Singh Nagar — Mohali", "Fazilka — Fazilka", "Barnala — Barnala"],
      factIds: ["sbs-nagar", "sas-nagar", "fazilka", "barnala"],
      sourceIds: rosterSources,
      explanation: "Shaheed Bhagat Singh Nagar is headquartered at Nawanshahr, not Rupnagar. The other three pairs are correctly matched.",
    },
    {
      difficulty: "Medium",
      stem: "Which new-district and parent-district pair is correctly matched?",
      canonical: "Pathankot — Gurdaspur",
      options: ["Pathankot — Gurdaspur", "Tarn Taran — Kapurthala", "Malerkotla — Patiala", "Moga — Ferozepur"],
      factIds: ["pathankot-2011", "tarn-taran-2006", "malerkotla-2021", "moga-1995"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.pathankot, PGK_001_CP002_SOURCE_IDS.tarnTaran, PGK_001_CP002_SOURCE_IDS.malerkotla, PGK_001_CP002_SOURCE_IDS.moga],
      explanation: "Pathankot was separated from Gurdaspur district in 2011. Tarn Taran came from Amritsar, Malerkotla from Sangrur and Moga from Faridkot.",
    },
    {
      difficulty: "Medium",
      stem: "Which new-district and parent-district pair is correctly matched?",
      canonical: "Malerkotla — Sangrur",
      options: ["Malerkotla — Sangrur", "Barnala — Patiala", "Pathankot — Amritsar", "Tarn Taran — Gurdaspur"],
      factIds: ["malerkotla-2021", "barnala-2006", "pathankot-2011", "tarn-taran-2006"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.malerkotla, PGK_001_CP002_SOURCE_IDS.barnala, PGK_001_CP002_SOURCE_IDS.pathankot, PGK_001_CP002_SOURCE_IDS.tarnTaran],
      explanation: "Malerkotla was carved out of Sangrur in 2021. Barnala also came from Sangrur, Pathankot from Gurdaspur and Tarn Taran from Amritsar.",
    },
  ],
  "PGK-001-QL-012": [
    {
      difficulty: "Hard",
      stem: "A district was carved out of Sangrur in 2021 and became Punjab's 23rd district. Which district is it?",
      canonical: "Malerkotla",
      options: ["Malerkotla", "Barnala", "Pathankot", "Fazilka"],
      factIds: ["malerkotla-2021"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.malerkotla],
      explanation: "Malerkotla was carved out of Sangrur and became Punjab's 23rd district on 2 June 2021.",
    },
    {
      difficulty: "Hard",
      stem: "This district was separated from Gurdaspur in 2011 and now falls under Jalandhar division. Identify it.",
      canonical: "Pathankot",
      options: ["Pathankot", "Tarn Taran", "Hoshiarpur", "Kapurthala"],
      factIds: ["pathankot-2011", "pathankot"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.pathankot, ...divisionSources],
      explanation: "Pathankot was earlier part of Gurdaspur district and became a separate district in 2011. It is under Jalandhar division.",
    },
    {
      difficulty: "Hard",
      stem: "Which district was formed from Amritsar in 2006 and is part of Jalandhar division?",
      canonical: "Tarn Taran",
      options: ["Tarn Taran", "Pathankot", "Kapurthala", "Hoshiarpur"],
      factIds: ["tarn-taran-2006", "tarn-taran"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.tarnTaran, ...divisionSources],
      explanation: "Tarn Taran was created from Amritsar district on 16 June 2006. It falls under Jalandhar division.",
    },
    {
      difficulty: "Hard",
      stem: "Its headquarters is Mohali and it falls under Rupnagar division. Which district is it?",
      canonical: "Sahibzada Ajit Singh Nagar",
      options: ["Sahibzada Ajit Singh Nagar", "Shaheed Bhagat Singh Nagar", "Fatehgarh Sahib", "Rupnagar"],
      factIds: ["sas-nagar"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.sasNagar, ...divisionSources],
      explanation: "Sahibzada Ajit Singh Nagar district is headquartered at Mohali and belongs to Rupnagar division.",
    },
    {
      difficulty: "Hard",
      stem: "Its headquarters is Nawanshahr and it belongs to Rupnagar division. Which district is it?",
      canonical: "Shaheed Bhagat Singh Nagar",
      options: ["Shaheed Bhagat Singh Nagar", "Sahibzada Ajit Singh Nagar", "Hoshiarpur", "Rupnagar"],
      factIds: ["sbs-nagar"],
      sourceIds: divisionSources,
      explanation: "Shaheed Bhagat Singh Nagar district is headquartered at Nawanshahr and is part of Rupnagar division.",
    },
    {
      difficulty: "Hard",
      stem: "Which district was formed in 1995 from Faridkot and is now under Ferozepur division?",
      canonical: "Moga",
      options: ["Moga", "Mansa", "Barnala", "Fazilka"],
      factIds: ["moga-1995", "moga"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.moga, ...divisionSources],
      explanation: "Moga became a district in 1995 after earlier being a subdivision of Faridkot. It is now under Ferozepur division.",
    },
  ],
  "PGK-001-QL-013": [
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Punjab at a Glance 2022 records 23 districts. II. The same snapshot records 5 administrative divisions. III. Malerkotla is included in Punjab's 23-district roster. Which are correct?",
      canonical: "All three",
      options: ["I and II only", "II and III only", "I and III only", "All three"],
      factIds: ["admin-snapshot-2022", "malerkotla"],
      sourceIds: snapshotSources,
      explanation: "The 2022 official statistical snapshot records 23 districts and five divisions. Malerkotla is part of the current 23-district roster.",
    },
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Malerkotla was carved out of Sangrur. II. Pathankot was earlier part of Gurdaspur. III. Tarn Taran was formed from Amritsar. Which are correct?",
      canonical: "All three",
      options: ["I and II only", "II and III only", "I and III only", "All three"],
      factIds: ["malerkotla-2021", "pathankot-2011", "tarn-taran-2006"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.malerkotla, PGK_001_CP002_SOURCE_IDS.pathankot, PGK_001_CP002_SOURCE_IDS.tarnTaran],
      explanation: "All three parent-district relations are correct: Malerkotla came from Sangrur, Pathankot from Gurdaspur and Tarn Taran from Amritsar.",
    },
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Mohali is the headquarters of Sahibzada Ajit Singh Nagar. II. Nawanshahr is the headquarters of Shaheed Bhagat Singh Nagar. III. Ropar is another name used for Rupnagar. Which are correct?",
      canonical: "All three",
      options: ["I only", "I and II only", "II and III only", "All three"],
      factIds: ["sas-nagar", "sbs-nagar", "rupnagar"],
      sourceIds: rosterSources,
      explanation: "All three naming and headquarters relations are correct. These aliases are important because Punjab exam material may use either form.",
    },
    {
      difficulty: "Hard",
      stem: "Consider the statements: I. Bathinda is under Faridkot division. II. Ludhiana is under Patiala division. III. Moga is under Ferozepur division. Which are correct?",
      canonical: "All three",
      options: ["I and II only", "II and III only", "I and III only", "All three"],
      factIds: ["bathinda", "ludhiana", "moga"],
      sourceIds: divisionSources,
      explanation: "All three district-to-division relations are correct: Bathinda–Faridkot, Ludhiana–Patiala and Moga–Ferozepur.",
    },
    {
      difficulty: "Hard",
      stem: "Which sequence places these district-formation events from earliest to latest?",
      canonical: "Moga → Tarn Taran → Pathankot → Malerkotla",
      options: ["Moga → Tarn Taran → Pathankot → Malerkotla", "Tarn Taran → Moga → Malerkotla → Pathankot", "Moga → Pathankot → Tarn Taran → Malerkotla", "Pathankot → Tarn Taran → Moga → Malerkotla"],
      factIds: ["moga-1995", "tarn-taran-2006", "pathankot-2011", "malerkotla-2021"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.moga, PGK_001_CP002_SOURCE_IDS.tarnTaran, PGK_001_CP002_SOURCE_IDS.pathankot, PGK_001_CP002_SOURCE_IDS.malerkotla],
      explanation: "Moga became a district in 1995, Tarn Taran in 2006, Pathankot in 2011 and Malerkotla in 2021. That gives the stated chronological order.",
    },
    {
      difficulty: "Hard",
      stem: "Consider the statements about Sahibzada Ajit Singh Nagar district: I. It was formed in 2006. II. Its headquarters is Mohali. III. It falls under Rupnagar division. Which are correct?",
      canonical: "All three",
      options: ["I and II only", "II and III only", "I and III only", "All three"],
      factIds: ["sas-nagar-2006", "sas-nagar"],
      sourceIds: [PGK_001_CP002_SOURCE_IDS.sasNagar, ...divisionSources],
      explanation: "Sahibzada Ajit Singh Nagar was formed in 2006 from areas of Ropar and Patiala districts. Its headquarters is Mohali, and it is part of Rupnagar division.",
    },
  ],
};

const validFactIds = new Set<string>([
  "admin-snapshot-2022",
  "division-list",
  ...PGK_001_CP002_DISTRICTS_V1.map((row) => row.id),
  ...PGK_001_CP002_FORMATION_FACTS_V1.map((row) => row.id),
]);

function buildQuestion(qlId: keyof typeof PGK_001_CP002_QL_NAMES, row: Row, index: number): Pgk001Cp002ReviewQuestion {
  const correctIndex = row.options.indexOf(row.canonical);
  if (correctIndex < 0) throw new Error(`${qlId} row ${index + 1} is missing its canonical answer`);
  return Object.freeze({
    questionId: `PGK-001-CP002-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP002_QL_NAMES[qlId],
    difficulty: row.difficulty,
    stem: row.stem,
    options: Object.freeze([...row.options]),
    correctIndex,
    canonicalAnswer: row.canonical,
    explanation: row.explanation,
    factIds: Object.freeze([...row.factIds]),
    sourceIds: Object.freeze([...new Set(row.sourceIds)]),
    reviewOnly: true,
    runtimeRegistered: false,
  });
}

export const PGK_001_CP002_REVIEW_BATCH_V1: readonly Pgk001Cp002ReviewQuestion[] = Object.freeze(
  (Object.keys(PGK_001_CP002_QL_NAMES) as (keyof typeof PGK_001_CP002_QL_NAMES)[]).flatMap((qlId, qlIndex) =>
    rowsByQl[qlId].map((row, rowIndex) => buildQuestion(qlId, row, qlIndex * 6 + rowIndex)),
  ),
);

export const PGK_001_CP002_REQUIRED_FACTS_V1 = Object.freeze([...validFactIds]);

export function auditPgk001Cp002ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const usedFacts = new Set<string>();

  for (const question of PGK_001_CP002_REVIEW_BATCH_V1) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);

    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (question.options.filter((option) => option === question.canonicalAnswer).length !== 1) issues.push(`${question.questionId}: canonical answer must appear exactly once`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0) issues.push(`${question.questionId}: missing source authority`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);

    for (const factId of question.factIds) {
      usedFacts.add(factId);
      if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    }

    const lowerStem = question.stem.toLowerCase();
    if (lowerStem.includes("which of the following is associated with")) issues.push(`${question.questionId}: banned boilerplate`);
    if (lowerStem.includes("with reference to punjab")) issues.push(`${question.questionId}: unnecessary opener`);
    if (/chief minister|governor|deputy commissioner|divisional commissioner/.test(lowerStem)) issues.push(`${question.questionId}: volatile office-holder content`);
  }

  for (const qlId of Object.keys(PGK_001_CP002_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP002_REVIEW_BATCH_V1.length,
    qlCount: Object.keys(PGK_001_CP002_QL_NAMES).length,
    usedFactCount: usedFacts.size,
  });
}
