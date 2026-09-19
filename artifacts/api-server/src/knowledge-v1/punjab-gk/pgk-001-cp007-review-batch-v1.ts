import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP007_FACT_IDS, PGK_001_CP007_SOURCE_IDS } from "./pgk-001-cp007-facts";

export type Pgk001Cp007ReviewQuestion = Readonly<{
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

export const PGK_001_CP007_QL_NAMES = Object.freeze({
  "PGK-001-QL-042": "Forest belts and formations",
  "PGK-001-QL-043": "Wildlife sanctuaries and locations",
  "PGK-001-QL-044": "Major Ramsar wetlands",
  "PGK-001-QL-045": "Wetland-river-district relations",
  "PGK-001-QL-046": "Protected-area categories",
  "PGK-001-QL-047": "Species-habitat relations",
  "PGK-001-QL-048": "Forest-wildlife-wetland synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP007_SOURCE_IDS;
const rows: readonly Row[] = [
  ["Easy", "Most natural forests of Punjab are mainly:", ["Tropical and sub-tropical", "Alpine and tundra", "Mangrove and littoral", "Temperate evergreen only"], "Tropical and sub-tropical", "Punjab's natural forests are predominantly tropical and sub-tropical. The Shivalik belt contains much of the state's natural forest vegetation.", ["forest-tropical-subtropical"], [S.sapccPunjab]],
  ["Easy", "Chir pine forests in Punjab are mainly associated with:", ["Pathankot and parts of Gurdaspur-Hoshiarpur", "Bathinda and Mansa", "Fazilka and Muktsar", "Ludhiana and Barnala"], "Pathankot and parts of Gurdaspur-Hoshiarpur", "Chir pine is concentrated in the higher Shivalik foothill areas of Pathankot and adjoining parts of Gurdaspur and Hoshiarpur.", ["forest-chir-pine"], [S.sapccPunjab]],
  ["Medium", "Bamboo forest pockets in Punjab are chiefly associated with the:", ["Shivalik belt", "South-western sandy plain", "Central Malwa plain", "Ghaggar floodplain only"], "Shivalik belt", "Bamboo forests occur in Shivalik areas, especially around Dasuya and pockets of Hoshiarpur and Gurdaspur.", ["forest-bamboo"], [S.sapccPunjab]],
  ["Easy", "Bir forests are strongly associated with which part of Punjab?", ["Patiala tract", "Abohar tract", "Ravi floodplain only", "Kanjli wetland"], "Patiala tract", "Bir forests are characteristic forest tracts of the plains, especially around Patiala.", ["forest-bir"], [S.sapccPunjab]],
  ["Medium", "Mand forests are mainly associated with:", ["Riverine and wetland-side tracts", "High alpine slopes", "Desert dunes only", "Urban plantation belts only"], "Riverine and wetland-side tracts", "Mand forests occur along riverine and wetland-side areas, including parts of Amritsar, Tarn Taran and Kapurthala.", ["forest-mand"], [S.sapccPunjab]],
  ["Medium", "Which forest-location pair is correctly matched?", ["Chir pine — Pathankot foothills", "Bir — Fazilka desert belt", "Mand — central Ludhiana city", "Bamboo — south-western saline plain"], "Chir pine — Pathankot foothills", "Chir pine is linked with the Shivalik foothill belt, particularly Pathankot and adjoining areas.", ["forest-chir-pine"], [S.sapccPunjab]],

  ["Easy", "Abohar is known for which protected area?", ["Abohar Wildlife Sanctuary", "Abohar Conservation Reserve", "Abohar National Park", "Abohar Community Reserve"], "Abohar Wildlife Sanctuary", "Abohar Wildlife Sanctuary is an important protected area of south-western Punjab.", ["wls-abohar"], [S.paList]],
  ["Easy", "Bir Moti Bagh Wildlife Sanctuary is located in:", ["Patiala", "Pathankot", "Kapurthala", "Fazilka"], "Patiala", "Bir Moti Bagh Wildlife Sanctuary is located in Patiala and belongs to Punjab's Bir forest landscape.", ["wls-bir-moti-bagh"], [S.paList]],
  ["Easy", "Takhni-Rehampur Wildlife Sanctuary is associated with which district?", ["Hoshiarpur", "Bathinda", "Mansa", "Ferozepur"], "Hoshiarpur", "Takhni-Rehampur Wildlife Sanctuary lies in Hoshiarpur in the Shivalik region.", ["wls-takhni-rehampur"], [S.paList]],
  ["Medium", "Jhajjar-Bacholi Wildlife Sanctuary is located in:", ["Rupnagar", "Sangrur", "Amritsar", "Moga"], "Rupnagar", "Jhajjar-Bacholi Wildlife Sanctuary is in Rupnagar district near the Shivalik foothills.", ["wls-jhajjar-bacholi"], [S.paList]],
  ["Easy", "Nangal is protected in Punjab as a:", ["Wildlife Sanctuary", "National Park", "Tiger Reserve", "Biosphere Reserve"], "Wildlife Sanctuary", "Nangal is a Wildlife Sanctuary in Rupnagar district and is also an important wetland site.", ["wls-nangal"], [S.paList, S.ramsarNewPunjabSites]],
  ["Hard", "Which of the following sanctuary-location pairs is correctly matched?", ["Bir Moti Bagh — Patiala", "Takhni-Rehampur — Bathinda", "Jhajjar-Bacholi — Moga", "Nangal — Fazilka"], "Bir Moti Bagh — Patiala", "Bir Moti Bagh is in Patiala. Takhni-Rehampur is in Hoshiarpur, while Jhajjar-Bacholi and Nangal are associated with Rupnagar.", ["wls-bir-moti-bagh", "wls-takhni-rehampur", "wls-jhajjar-bacholi", "wls-nangal"], [S.paList]],

  ["Easy", "Which of the following is a Ramsar wetland of Punjab?", ["Harike", "Sukhna Lake", "Keoladeo", "Sambhar Lake"], "Harike", "Harike is a Ramsar wetland of Punjab and lies at the Beas-Sutlej confluence.", ["wetland-harike"], [S.ramsarPunjab2024]],
  ["Easy", "Kanjli Wetland is a Ramsar site in which district?", ["Kapurthala", "Patiala", "Mansa", "Bathinda"], "Kapurthala", "Kanjli Wetland lies in Kapurthala district and is associated with Kali Bein.", ["wetland-kanjli"], [S.kanjliRis]],
  ["Easy", "Ropar Wetland is associated with which present-day district name?", ["Rupnagar", "Pathankot", "Barnala", "Faridkot"], "Rupnagar", "Ropar Wetland is located at Rupnagar on the Sutlej River.", ["wetland-ropar"], [S.ramsarPunjab2024]],
  ["Medium", "Which Ramsar site is also a Conservation Reserve?", ["Beas Conservation Reserve", "Kanjli Wetland", "Ropar Wetland", "Harike Wetland"], "Beas Conservation Reserve", "Beas Conservation Reserve is both a protected river stretch and a Ramsar site.", ["wetland-beas", "reserve-beas"], [S.ramsarNewPunjabSites]],
  ["Medium", "Which Ramsar site is also a Community Reserve?", ["Keshopur-Miani", "Ropar", "Harike", "Kanjli"], "Keshopur-Miani", "Keshopur-Miani in Gurdaspur is protected as a Community Reserve and is also a Ramsar site.", ["wetland-keshopur", "reserve-keshopur-miani"], [S.ramsarNewPunjabSites]],
  ["Hard", "Which set consists only of Ramsar sites in Punjab?", ["Harike, Kanjli and Ropar", "Harike, Sambhar and Ropar", "Kanjli, Keoladeo and Nangal", "Ropar, Wular and Harike"], "Harike, Kanjli and Ropar", "Harike, Kanjli and Ropar are all Ramsar sites in Punjab.", ["wetland-harike", "wetland-kanjli", "wetland-ropar"], [S.ramsarPunjab2024]],

  ["Easy", "Harike Wetland is located at the confluence of:", ["Beas and Sutlej", "Ravi and Beas", "Ravi and Chenab", "Sutlej and Ghaggar"], "Beas and Sutlej", "Harike lies where the Beas joins the Sutlej. This river relation is central to Harike's wetland geography.", ["wetland-harike"], [S.ramsarPunjab2024]],
  ["Easy", "Kanjli Wetland is situated on which rivulet?", ["Kali Bein", "Ghaggar", "Buddha Nallah", "White Bein"], "Kali Bein", "Kanjli Wetland is situated on Kali Bein near Kapurthala.", ["wetland-kanjli"], [S.kanjliRis]],
  ["Medium", "Which wetland-location pair is correctly matched?", ["Kanjli — Kapurthala", "Ropar — Bathinda", "Nangal — Fazilka", "Keshopur-Miani — Patiala"], "Kanjli — Kapurthala", "Kanjli is in Kapurthala. Ropar and Nangal are associated with Rupnagar, while Keshopur-Miani is in Gurdaspur.", ["wetland-kanjli", "wetland-ropar", "wetland-nangal", "wetland-keshopur"], [S.ramsarPunjab2024, S.ramsarNewPunjabSites]],
  ["Easy", "Ropar Wetland is associated with which river?", ["Sutlej", "Ravi", "Beas", "Ghaggar"], "Sutlej", "Ropar Wetland lies on the Sutlej at Rupnagar.", ["wetland-ropar"], [S.ramsarPunjab2024]],
  ["Medium", "Nangal Wetland is closely linked with which project system?", ["Bhakra-Nangal system", "Ranjit Sagar system", "Harike-Ferozepur system", "Madhopur-UBDC system"], "Bhakra-Nangal system", "Nangal Wetland occupies a human-made reservoir associated with the Bhakra-Nangal project in the Shivalik foothills.", ["wetland-nangal"], [S.ramsarNewPunjabSites]],
  ["Medium", "Beas Conservation Reserve protects a long stretch of which river?", ["Beas", "Sutlej", "Ravi", "Ghaggar"], "Beas", "Beas Conservation Reserve protects a long stretch of the Beas River and its riverine habitat.", ["wetland-beas", "reserve-beas"], [S.ramsarNewPunjabSites]],

  ["Easy", "Keshopur-Miani is protected as a:", ["Community Reserve", "National Park", "Tiger Reserve", "Biosphere Reserve"], "Community Reserve", "Keshopur-Miani is a Community Reserve in Gurdaspur district.", ["reserve-keshopur-miani"], [S.ramsarNewPunjabSites]],
  ["Easy", "Beas is protected in Punjab as a:", ["Conservation Reserve", "National Park", "Community Reserve", "Tiger Reserve"], "Conservation Reserve", "The protected river stretch is known as Beas Conservation Reserve.", ["reserve-beas"], [S.ramsarNewPunjabSites]],
  ["Medium", "Which protected-area category is correctly matched with Nangal?", ["Wildlife Sanctuary", "Community Reserve", "Conservation Reserve", "National Park"], "Wildlife Sanctuary", "Nangal is a Wildlife Sanctuary and also has Ramsar recognition as a wetland.", ["wls-nangal", "wetland-nangal"], [S.paList, S.ramsarNewPunjabSites]],
  ["Medium", "Harike is protected in Punjab as a:", ["Wildlife Sanctuary", "Community Reserve only", "National Park", "Tiger Reserve"], "Wildlife Sanctuary", "Harike is a Wildlife Sanctuary and an internationally important wetland.", ["wls-harike", "wetland-harike"], [S.paList, S.ramsarPunjab2024]],
  ["Hard", "Which protected-area pair is correctly matched?", ["Beas — Conservation Reserve", "Keshopur-Miani — National Park", "Nangal — Community Reserve", "Abohar — Conservation Reserve"], "Beas — Conservation Reserve", "Beas is a Conservation Reserve. Keshopur-Miani is a Community Reserve, while Nangal and Abohar are Wildlife Sanctuaries.", ["reserve-beas", "reserve-keshopur-miani", "wls-nangal", "wls-abohar"], [S.ramsarNewPunjabSites, S.paList]],
  ["Hard", "Consider the following pairs:\nI. Keshopur-Miani — Community Reserve\nII. Beas — Conservation Reserve\nIII. Nangal — Wildlife Sanctuary\nWhich of the pairs given above are correctly matched?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three are correctly matched and represent three different protected-area categories in Punjab.", ["reserve-keshopur-miani", "reserve-beas", "wls-nangal"], [S.ramsarNewPunjabSites, S.paList]],

  ["Easy", "The Indus river dolphin in Punjab is most closely associated with:", ["Beas Conservation Reserve", "Bir Moti Bagh", "Takhni-Rehampur", "Kanjli town pond"], "Beas Conservation Reserve", "The Beas Conservation Reserve supports the Indus river dolphin in Punjab.", ["species-indus-dolphin-beas"], [S.ramsarNewPunjabSites]],
  ["Easy", "Abohar Wildlife Sanctuary is especially associated with the conservation of:", ["Blackbuck", "Snow leopard", "Red panda", "Hangul"], "Blackbuck", "Abohar Wildlife Sanctuary is well known for blackbuck conservation in south-western Punjab.", ["species-blackbuck-abohar"], [S.paList]],
  ["Medium", "Indian pangolin is an important threatened species recorded at:", ["Nangal Wildlife Sanctuary", "Abohar Wildlife Sanctuary", "Kanjli Wetland only", "Bir Moti Bagh only"], "Nangal Wildlife Sanctuary", "Nangal Wildlife Sanctuary supports the Indian pangolin along with other Shivalik fauna.", ["species-pangolin-nangal"], [S.ramsarNewPunjabSites]],
  ["Medium", "Which species-protected area pair is correctly matched?", ["Indus river dolphin — Beas Conservation Reserve", "Blackbuck — Nangal Wildlife Sanctuary", "Indian pangolin — Harike only", "Snow leopard — Abohar Wildlife Sanctuary"], "Indus river dolphin — Beas Conservation Reserve", "The Indus river dolphin is strongly associated with the protected Beas River stretch.", ["species-indus-dolphin-beas"], [S.ramsarNewPunjabSites]],
  ["Medium", "Which protected area is most closely linked with blackbuck in Punjab GK?", ["Abohar Wildlife Sanctuary", "Ropar Wetland", "Nangal Wildlife Sanctuary", "Takhni-Rehampur Wildlife Sanctuary"], "Abohar Wildlife Sanctuary", "Abohar Wildlife Sanctuary is one of Punjab's best-known blackbuck habitats.", ["species-blackbuck-abohar", "wls-abohar"], [S.paList]],
  ["Hard", "Consider the following pairs:\nI. Indus river dolphin — Beas Conservation Reserve\nII. Blackbuck — Abohar Wildlife Sanctuary\nIII. Indian pangolin — Nangal Wildlife Sanctuary\nWhich of the pairs given above are correctly matched?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three species are correctly paired with important Punjab conservation areas.", ["species-indus-dolphin-beas", "species-blackbuck-abohar", "species-pangolin-nangal"], [S.ramsarNewPunjabSites, S.paList]],

  ["Hard", "Which combination is correctly matched?", ["Chir pine — Shivalik foothills", "Bir forests — south-western saline plain", "Mand forests — alpine slopes", "Bamboo forests — central Malwa only"], "Chir pine — Shivalik foothills", "Chir pine is characteristic of higher Shivalik foothill areas in northern Punjab.", ["forest-chir-pine"], [S.sapccPunjab]],
  ["Hard", "Which combination correctly links a forest tract with its Punjab setting?", ["Bir — Patiala", "Mand — Pathankot high hills", "Chir pine — Fazilka", "Bamboo — Mansa"], "Bir — Patiala", "Bir forest tracts are strongly associated with Patiala and adjoining plains.", ["forest-bir"], [S.sapccPunjab]],
  ["Hard", "Which combination correctly links a wetland with its water relation?", ["Harike — Beas-Sutlej confluence", "Kanjli — Ravi", "Ropar — Beas", "Nangal — Ghaggar"], "Harike — Beas-Sutlej confluence", "Harike lies at the meeting point of the Beas and Sutlej.", ["wetland-harike"], [S.ramsarPunjab2024]],
  ["Hard", "Which set correctly matches protected-area categories?", ["Beas — Conservation Reserve; Keshopur-Miani — Community Reserve; Nangal — Wildlife Sanctuary", "Beas — National Park; Keshopur-Miani — Wildlife Sanctuary; Nangal — Community Reserve", "Beas — Community Reserve; Keshopur-Miani — Conservation Reserve; Nangal — National Park", "All three are National Parks"], "Beas — Conservation Reserve; Keshopur-Miani — Community Reserve; Nangal — Wildlife Sanctuary", "These three sites represent three distinct protected-area categories in Punjab.", ["reserve-beas", "reserve-keshopur-miani", "wls-nangal"], [S.ramsarNewPunjabSites, S.paList]],
  ["Hard", "Consider the following statements:\nI. Kanjli Wetland is in Kapurthala.\nII. Ropar Wetland is associated with the Sutlej.\nIII. Keshopur-Miani is in Gurdaspur.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements are correct and connect Punjab's major wetlands with their locations and river settings.", ["wetland-kanjli", "wetland-ropar", "wetland-keshopur"], [S.ramsarPunjab2024, S.ramsarNewPunjabSites]],
  ["Hard", "Consider the following statements:\nI. Chir pine forests occur in the Shivalik belt.\nII. Abohar is a Wildlife Sanctuary associated with blackbuck.\nIII. Beas Conservation Reserve supports the Indus river dolphin.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements are correct and link Punjab's forest, wildlife and river-conservation geography.", ["forest-chir-pine", "wls-abohar", "species-blackbuck-abohar", "reserve-beas", "species-indus-dolphin-beas"], [S.sapccPunjab, S.paList, S.ramsarNewPunjabSites]],
] as const;

function qlIdFor(index: number) { return `PGK-001-QL-${String(42 + Math.floor(index / 6)).padStart(3, "0")}` as keyof typeof PGK_001_CP007_QL_NAMES; }

export const PGK_001_CP007_REVIEW_BATCH_V1: readonly Pgk001Cp007ReviewQuestion[] = Object.freeze(rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP007 row ${index + 1} is missing its canonical answer`);
  const qlId = qlIdFor(index);
  return Object.freeze({ questionId: `PGK-001-CP007-Q${String(index + 1).padStart(3, "0")}`, qlId, qlName: PGK_001_CP007_QL_NAMES[qlId], difficulty, stem, options: Object.freeze([...options]), correctIndex, canonicalAnswer, explanation, factIds: Object.freeze([...factIds]), sourceIds: Object.freeze([...sourceIds]), reviewOnly: true as const, runtimeRegistered: false as const });
}));

export function auditPgk001Cp007ReviewBatchV1() {
  const issues: string[] = [];
  const validFactIds = new Set(PGK_001_CP007_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = ["government of punjab", "moef", "ramsar convention", "report", "website", "source", "notification number", "the correct answer is", "the correct option", "the other options", "this question tests", "review batch", "generator", "identify it"];
  for (const question of PGK_001_CP007_REVIEW_BATCH_V1) {
    const stem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(stem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(stem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact ${factId}`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }
  for (const qlId of Object.keys(PGK_001_CP007_QL_NAMES)) if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP007_REVIEW_BATCH_V1.length });
}
