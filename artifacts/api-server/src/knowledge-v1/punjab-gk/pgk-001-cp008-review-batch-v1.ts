import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP008_FACT_IDS, PGK_001_CP008_SOURCE_IDS } from "./pgk-001-cp008-facts";

export type Pgk001Cp008ReviewQuestion = Readonly<{
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

export const PGK_001_CP008_QL_NAMES = Object.freeze({
  "PGK-001-QL-049": "Crop seasons and classification",
  "PGK-001-QL-050": "Wheat-rice system and Green Revolution",
  "PGK-001-QL-051": "Cotton and south-western agriculture",
  "PGK-001-QL-052": "Maize, sugarcane, pulses and oilseeds",
  "PGK-001-QL-053": "Horticulture and fruit belts",
  "PGK-001-QL-054": "PAU and agricultural innovation",
  "PGK-001-QL-055": "Agriculture synthesis and diversification",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP008_SOURCE_IDS;
const rows: readonly Row[] = [
  ["Easy", "In Punjab, wheat belongs to which crop season?", ["Rabi", "Kharif", "Zaid", "Perennial"], "Rabi", "Wheat is Punjab's major Rabi cereal crop and is grown during the cool season.", ["wheat-rabi"], [S.pauRabi]],
  ["Easy", "In Punjab, rice belongs to which crop season?", ["Kharif", "Rabi", "Zaid", "Winter only"], "Kharif", "Rice or paddy is a major Kharif crop of Punjab.", ["rice-kharif"], [S.pauKharif]],
  ["Easy", "Cotton in Punjab is primarily a:", ["Kharif crop", "Rabi crop", "Zaid crop only", "Winter cereal"], "Kharif crop", "Cotton is a Kharif crop, especially important in south-western Punjab.", ["cotton-kharif"], [S.pauKharif, S.pauCotton]],
  ["Easy", "In Punjab, rapeseed and mustard are classified as:", ["Rabi crops", "Kharif crops", "Zaid crops only", "Perennial crops"], "Rabi crops", "Rapeseed and mustard are important Rabi oilseed crops of Punjab.", ["mustard-rabi"], [S.pauRabi]],
  ["Easy", "In Punjab, maize is generally classified as a:", ["Kharif crop", "Rabi crop", "Winter oilseed", "Perennial crop"], "Kharif crop", "Maize is an important Kharif crop and is also promoted in Kandi areas.", ["maize-kharif", "maize-kandi"], [S.pauKharif, S.pauMaizeKandi]],
  ["Medium", "Which crop-season pair is incorrectly matched?", ["Cotton — Rabi", "Wheat — Rabi", "Rice — Kharif", "Maize — Kharif"], "Cotton — Rabi", "Cotton is a Kharif crop. Wheat is Rabi, while rice and maize are Kharif crops.", ["cotton-kharif", "wheat-rabi", "rice-kharif", "maize-kharif"], [S.pauRabi, S.pauKharif]],

  ["Easy", "Which crop rotation dominates the cereal farming system of Punjab?", ["Rice-Wheat", "Cotton-Tea", "Jute-Barley", "Coffee-Maize"], "Rice-Wheat", "The rice-wheat rotation dominates Punjab's cereal-based farming system.", ["rice-wheat-rotation"], [S.punjabAgPolicy]],
  ["Easy", "Which of the following is Punjab's major cool-season cereal crop?", ["Wheat", "Rice", "Cotton", "Sugarcane"], "Wheat", "Wheat is the major cool-season Rabi cereal of Punjab.", ["wheat-rabi"], [S.pauRabi]],
  ["Medium", "Which sequence correctly represents the usual rice-wheat cycle?", ["Kharif rice → Rabi wheat", "Rabi rice → Kharif wheat", "Kharif wheat → Rabi cotton", "Rabi maize → Kharif wheat"], "Kharif rice → Rabi wheat", "Rice is grown in Kharif and is followed by wheat in the Rabi season.", ["rice-kharif", "wheat-rabi", "rice-wheat-rotation"], [S.pauRabi, S.pauKharif, S.punjabAgPolicy]],
  ["Medium", "Punjab's Green Revolution is most closely identified with rapid gains in which two food-grain crops?", ["Wheat and rice", "Tea and coffee", "Jute and cotton", "Bajra and tobacco"], "Wheat and rice", "The Green Revolution greatly strengthened wheat and rice production in Punjab.", ["pau-green-revolution", "rice-wheat-rotation"], [S.pauInstitution, S.punjabAgPolicy]],
  ["Medium", "Excessive dependence on the rice-wheat cycle places the greatest pressure on which natural resource?", ["Groundwater", "Coal", "Marine fisheries", "Tidal energy"], "Groundwater", "Water-intensive rice and repeated rice-wheat cultivation have contributed to heavy groundwater use in Punjab.", ["diversification-water", "rice-wheat-rotation"], [S.punjabAgPolicy]],
  ["Hard", "Consider the following statements:\nI. Rice is a Kharif crop in Punjab.\nII. Wheat is a Rabi crop.\nIII. Rice-wheat is a dominant crop rotation.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements correctly describe the basic rice-wheat system of Punjab.", ["rice-kharif", "wheat-rabi", "rice-wheat-rotation"], [S.pauRabi, S.pauKharif, S.punjabAgPolicy]],

  ["Easy", "In which part of Punjab is cotton cultivation concentrated?", ["South-western Punjab", "Shivalik foothills only", "Majha river belt only", "Rupnagar hills only"], "South-western Punjab", "Punjab's main cotton belt lies in the south-western part of the state.", ["cotton-southwest"], [S.pauCotton]],
  ["Medium", "Which set contains four major cotton-growing districts of south-western Punjab?", ["Bathinda, Mansa, Fazilka and Sri Muktsar Sahib", "Pathankot, Rupnagar, Hoshiarpur and Gurdaspur", "Amritsar, Tarn Taran, Kapurthala and Jalandhar", "Ludhiana, Fatehgarh Sahib, SAS Nagar and Patiala"], "Bathinda, Mansa, Fazilka and Sri Muktsar Sahib", "Bathinda, Mansa, Fazilka and Sri Muktsar Sahib form the core of Punjab's cotton belt.", ["cotton-core-districts"], [S.pauCotton]],
  ["Easy", "Which district is NOT part of Punjab's core south-western cotton belt?", ["Pathankot", "Bathinda", "Mansa", "Fazilka"], "Pathankot", "Pathankot lies in north Punjab, while Bathinda, Mansa and Fazilka are major cotton districts in the southwest.", ["cotton-core-districts"], [S.pauCotton]],
  ["Easy", "Abohar is located in which district?", ["Fazilka", "Bathinda", "Mansa", "Faridkot"], "Fazilka", "Abohar is in Fazilka district in south-western Punjab.", ["abohar-kinnow"], [S.pauFruits]],
  ["Medium", "Which crop-season pair correctly describes cotton in Punjab?", ["Cotton — Kharif", "Cotton — Rabi", "Cotton — Zaid only", "Cotton — winter cereal"], "Cotton — Kharif", "Cotton is a Kharif crop and its major Punjab belt lies in the southwest.", ["cotton-kharif", "cotton-southwest"], [S.pauKharif, S.pauCotton]],
  ["Hard", "Consider the following districts:\nI. Bathinda\nII. Mansa\nIII. Fazilka\nIV. Sri Muktsar Sahib\nWhich of these form the core cotton belt of Punjab?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four districts are major parts of Punjab's south-western cotton belt.", ["cotton-core-districts"], [S.pauCotton]],

  ["Medium", "Which crop is promoted as an important Kharif option in Punjab's Kandi areas?", ["Maize", "Tea", "Coffee", "Jute"], "Maize", "Kharif maize has varieties recommended specifically for Punjab's Kandi areas.", ["maize-kandi", "maize-kharif"], [S.pauMaizeKandi]],
  ["Easy", "Sugarcane in Punjab is primarily classified as a:", ["Commercial crop", "Winter pulse", "Oilseed only", "Fibre tree crop"], "Commercial crop", "Sugarcane is an important commercial crop used for sugar and jaggery production.", ["sugarcane-commercial"], [S.pauSouthwest]],
  ["Easy", "In Punjab, gram or chickpea belongs to which crop season?", ["Rabi season", "Kharif season", "Monsoon-only flood season", "Perennial cycle"], "Rabi season", "Gram or chickpea is an important Rabi pulse crop.", ["gram-rabi"], [S.pauRabi]],
  ["Easy", "Which of the following is an important Rabi oilseed crop of Punjab?", ["Rapeseed-mustard", "Rice", "Cotton", "Maize"], "Rapeseed-mustard", "Rapeseed and mustard are major Rabi oilseed crops.", ["mustard-rabi"], [S.pauRabi]],
  ["Medium", "Which crop-season pair is correctly matched?", ["Maize — Kharif", "Gram — Kharif", "Mustard — Kharif", "Rice — Rabi"], "Maize — Kharif", "Maize and rice are Kharif crops, while gram and mustard are Rabi crops.", ["maize-kharif", "gram-rabi", "mustard-rabi", "rice-kharif"], [S.pauRabi, S.pauKharif]],
  ["Hard", "Consider the following statements:\nI. Maize is an important Kharif crop.\nII. Gram is a Rabi pulse.\nIII. Rapeseed-mustard is a Rabi oilseed.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements are correct and cover three important non-rice-wheat crop groups of Punjab.", ["maize-kharif", "gram-rabi", "mustard-rabi"], [S.pauRabi, S.pauKharif]],

  ["Easy", "Which fruit is especially important in the Abohar-Fazilka belt?", ["Kinnow", "Apple", "Walnut", "Coconut"], "Kinnow", "Kinnow is a major fruit of the Abohar-Fazilka belt in south-western Punjab.", ["abohar-kinnow"], [S.pauFruits]],
  ["Easy", "Which fruit is a major crop of Punjab's arid-irrigated horticultural zone?", ["Kinnow", "Apple", "Cherry", "Coconut"], "Kinnow", "Kinnow is one of the main fruits of Punjab's arid-irrigated south-western zone.", ["arid-irrigated-kinnow"], [S.pauFruits]],
  ["Medium", "Which fruit is suitable for Punjab's Kandi horticultural belt?", ["Amla", "Coconut", "Apple only", "Rubber"], "Amla", "Amla is one of the important fruit crops recommended for Kandi areas.", ["kandi-fruits"], [S.pauFruits]],
  ["Medium", "Which set consists only of fruits suited to the Kandi area of Punjab?", ["Guava, Ber, Amla, Mango and Galgal", "Apple, Cherry, Walnut and Almond only", "Coconut, Arecanut, Cocoa and Rubber", "Date palm, Coconut, Tea and Coffee"], "Guava, Ber, Amla, Mango and Galgal", "Guava, ber, amla, mango and galgal are important fruits of Punjab's Kandi horticultural belt.", ["kandi-fruits"], [S.pauFruits]],
  ["Medium", "Which district lies in Punjab's arid-irrigated horticultural zone?", ["Fazilka", "Pathankot", "Hoshiarpur", "Rupnagar"], "Fazilka", "Fazilka is part of the arid-irrigated south-western horticultural zone.", ["arid-irrigated-kinnow", "abohar-kinnow"], [S.pauFruits]],
  ["Hard", "Which combination is correctly matched?", ["Abohar — Fazilka — Kinnow", "Abohar — Pathankot — Apple", "Kandi — Bathinda — Coconut", "Fazilka — Shivalik belt — Tea"], "Abohar — Fazilka — Kinnow", "Abohar lies in Fazilka district and is a major kinnow-growing centre.", ["abohar-kinnow"], [S.pauFruits]],

  ["Easy", "Punjab Agricultural University is located at:", ["Ludhiana", "Patiala", "Bathinda", "Amritsar"], "Ludhiana", "Punjab Agricultural University is located in Ludhiana.", ["pau-green-revolution"], [S.pauInstitution]],
  ["Medium", "Which Punjab institution played a major role in India's Green Revolution through agricultural research and extension?", ["Punjab Agricultural University", "Panjab University Chandigarh", "Punjabi University Patiala", "IIT Ropar"], "Punjab Agricultural University", "Punjab Agricultural University at Ludhiana played a major role in the Green Revolution through crop research, education and extension.", ["pau-green-revolution"], [S.pauInstitution]],
  ["Hard", "Punjab Agricultural University produced the world's first hybrid grain variety of which crop?", ["Pearl millet", "Rice", "Wheat", "Cotton"], "Pearl millet", "PAU produced the world's first hybrid grain pearl millet.", ["pau-pearl-millet-hybrid"], [S.pauInstitution]],
  ["Hard", "PAU Bt 1 was developed for which crop?", ["Cotton", "Wheat", "Rice", "Sugarcane"], "Cotton", "PAU Bt 1 is a Bt cotton variety developed by Punjab Agricultural University.", ["pau-bt1"], [S.pauInstitution]],
  ["Medium", "Which characteristic was a key breeding objective of PAU Kinnow 1?", ["Low seed content", "Blue fruit colour", "Very high seed number", "Salt-water cultivation only"], "Low seed content", "PAU Kinnow 1 is a low-seeded kinnow variety developed for improved fruit quality.", ["pau-kinnow1"], [S.pauInstitution]],
  ["Hard", "Consider the following statements:\nI. Punjab Agricultural University is at Ludhiana.\nII. PAU played a major role in the Green Revolution.\nIII. PAU Kinnow 1 is a low-seeded kinnow variety.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements correctly describe important Punjab Agricultural University facts.", ["pau-green-revolution", "pau-kinnow1"], [S.pauInstitution]],

  ["Medium", "Crop diversification in Punjab seeks to reduce excessive dependence on:", ["The rice-wheat cycle", "Fruit orchards", "Pulse crops", "Oilseed crops"], "The rice-wheat cycle", "Diversification aims to reduce overdependence on rice-wheat and broaden the crop base.", ["diversification-water", "rice-wheat-rotation"], [S.punjabAgPolicy]],
  ["Medium", "Which rice-establishment method is promoted for saving irrigation water?", ["Direct-seeded rice", "Flooding fields continuously", "Deep-water rice only", "Dry-season transplanting without irrigation"], "Direct-seeded rice", "Direct-seeded rice can reduce irrigation demand compared with conventional puddled transplanting.", ["dsr-water"], [S.pauInstitution]],
  ["Medium", "Which crop is a suitable diversification option for Kandi areas?", ["Maize", "Jute", "Tea", "Coffee"], "Maize", "Kharif maize is well suited to Kandi areas and offers an alternative to paddy in suitable fields.", ["maize-kandi", "diversification-water"], [S.pauMaizeKandi, S.punjabAgPolicy]],
  ["Medium", "Which crop best represents the traditional diversification option of south-western Punjab?", ["Cotton", "Tea", "Jute", "Coffee"], "Cotton", "Cotton is a major Kharif crop of Punjab's south-western belt and provides an alternative to paddy.", ["cotton-southwest", "cotton-kharif"], [S.pauCotton]],
  ["Medium", "Which fruit best represents horticultural diversification in the Abohar-Fazilka belt?", ["Kinnow", "Apple", "Walnut", "Cherry"], "Kinnow", "Kinnow is a leading horticultural crop of the Abohar-Fazilka belt.", ["abohar-kinnow", "arid-irrigated-kinnow"], [S.pauFruits]],
  ["Hard", "Consider the following statements:\nI. Maize is promoted in Kandi areas.\nII. Cotton is important in south-western Punjab.\nIII. Kinnow is a major fruit of the Abohar-Fazilka belt.\nIV. Crop diversification can reduce pressure on groundwater.\nWhich of the statements given above are correct?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four statements describe important regional and resource-diversification features of Punjab agriculture.", ["maize-kandi", "cotton-southwest", "abohar-kinnow", "diversification-water"], [S.pauMaizeKandi, S.pauCotton, S.pauFruits, S.punjabAgPolicy]],
] as const;

function qlIdFor(index: number) {
  return `PGK-001-QL-${String(49 + Math.floor(index / 6)).padStart(3, "0")}` as keyof typeof PGK_001_CP008_QL_NAMES;
}

export const PGK_001_CP008_REVIEW_BATCH_V1: readonly Pgk001Cp008ReviewQuestion[] = Object.freeze(rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP008 row ${index + 1} is missing its canonical answer`);
  const qlId = qlIdFor(index);
  return Object.freeze({
    questionId: `PGK-001-CP008-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP008_QL_NAMES[qlId],
    difficulty,
    stem,
    options: Object.freeze([...options]),
    correctIndex,
    canonicalAnswer,
    explanation,
    factIds: Object.freeze([...factIds]),
    sourceIds: Object.freeze([...sourceIds]),
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  });
}));

export function auditPgk001Cp008ReviewBatchV1() {
  const issues: string[] = [];
  const validFactIds = new Set(PGK_001_CP008_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to",
    "according to", "government of punjab", "official report", "website", "source",
    "the correct answer is", "the correct option", "the other options", "this question tests", "generator",
  ];

  for (const question of PGK_001_CP008_REVIEW_BATCH_V1) {
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
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner wording leak: ${banned}`);
  }

  for (const qlId of Object.keys(PGK_001_CP008_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP008_REVIEW_BATCH_V1.length });
}
