import type { KnowledgeV1Difficulty } from "../types";
import {
  PGK_001_CP004_FACT_IDS,
  PGK_001_CP004_SOURCE_IDS,
} from "./pgk-001-cp004-facts";

export type Pgk001Cp004ReviewQuestion = Readonly<{
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

export const PGK_001_CP004_QL_NAMES = Object.freeze({
  "PGK-001-QL-021": "Five rivers and present-day distinction",
  "PGK-001-QL-022": "Ravi, Beas and Sutlej relations",
  "PGK-001-QL-023": "Harike river confluence",
  "PGK-001-QL-024": "Ghaggar and seasonal drainage",
  "PGK-001-QL-025": "Doab meaning and structure",
  "PGK-001-QL-026": "Named doabs and river pairs",
  "PGK-001-QL-027": "River-doab synthesis",
} as const);

type Row = Readonly<{
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  canonical: string;
  options: readonly string[];
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
}>;

const fiveRiverSource = [PGK_001_CP004_SOURCE_IDS.knowPunjab] as const;
const easternRiverSources = [PGK_001_CP004_SOURCE_IDS.knowPunjab, PGK_001_CP004_SOURCE_IDS.bbmbFormation] as const;
const harikeSource = [PGK_001_CP004_SOURCE_IDS.tarnTaranPlan] as const;
const ghaggarSource = [PGK_001_CP004_SOURCE_IDS.rajpuraPlan] as const;
const doabSource = [PGK_001_CP004_SOURCE_IDS.psebClass9Geography] as const;

const rowsByQl: Record<keyof typeof PGK_001_CP004_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-021": [
    {
      difficulty: "Easy",
      stem: "Which set contains the five rivers from which Punjab gets its name?",
      canonical: "Sutlej, Beas, Ravi, Chenab and Jhelum",
      options: ["Sutlej, Beas, Ravi, Chenab and Jhelum", "Sutlej, Beas, Ravi, Ghaggar and Yamuna", "Beas, Ravi, Chenab, Indus and Yamuna", "Sutlej, Ravi, Jhelum, Ghaggar and Indus"],
      explanation: "The five traditional rivers are Sutlej, Beas, Ravi, Chenab and Jhelum. The name Punjab literally refers to the land of five waters.",
      factIds: ["historical-five-rivers"],
      sourceIds: fiveRiverSource,
    },
    {
      difficulty: "Easy",
      stem: "Which of the following is NOT one of the traditional five rivers of Punjab?",
      canonical: "Ghaggar",
      options: ["Ghaggar", "Ravi", "Chenab", "Jhelum"],
      explanation: "Ghaggar is an important seasonal river, but it is not one of the traditional five rivers that give Punjab its name.",
      factIds: ["historical-five-rivers", "ghaggar-seasonal"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.knowPunjab, PGK_001_CP004_SOURCE_IDS.rajpuraPlan],
    },
    {
      difficulty: "Easy",
      stem: "Of the traditional five rivers, which three flow through present-day Indian Punjab?",
      canonical: "Sutlej, Beas and Ravi",
      options: ["Sutlej, Beas and Ravi", "Ravi, Chenab and Jhelum", "Sutlej, Chenab and Jhelum", "Beas, Chenab and Jhelum"],
      explanation: "Sutlej, Beas and Ravi are the three rivers from the traditional five that flow through present-day Indian Punjab.",
      factIds: ["present-punjab-three-from-five"],
      sourceIds: fiveRiverSource,
    },
    {
      difficulty: "Medium",
      stem: "Which pair from the traditional five does not flow through present-day Indian Punjab?",
      canonical: "Chenab and Jhelum",
      options: ["Chenab and Jhelum", "Ravi and Beas", "Sutlej and Ravi", "Beas and Sutlej"],
      explanation: "Chenab and Jhelum are the two traditional Punjab rivers that do not flow through present-day Indian Punjab.",
      factIds: ["historical-five-rivers", "present-punjab-three-from-five"],
      sourceIds: fiveRiverSource,
    },
    {
      difficulty: "Medium",
      stem: "Which statement correctly distinguishes historical Punjab from present-day Indian Punjab?",
      canonical: "The traditional five include Chenab and Jhelum, while present-day Indian Punjab has Sutlej, Beas and Ravi from that set.",
      options: ["The traditional five include Chenab and Jhelum, while present-day Indian Punjab has Sutlej, Beas and Ravi from that set.", "Present-day Indian Punjab has all five traditional rivers.", "Ravi and Beas are not part of the traditional five.", "Ghaggar replaces Sutlej in the traditional five-river set."],
      explanation: "The traditional five-river set is broader than the rivers flowing through today's Indian Punjab. Sutlej, Beas and Ravi are the three shared by both contexts.",
      factIds: ["historical-five-rivers", "present-punjab-three-from-five"],
      sourceIds: fiveRiverSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Sutlej is one of the traditional five rivers.\nII. Chenab is one of the traditional five rivers.\nIII. Ghaggar is one of the traditional five rivers.\nWhich of the statements given above are correct?",
      canonical: "I and II only",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "Sutlej and Chenab belong to the traditional five-river set. Ghaggar is separate from that naming tradition.",
      factIds: ["historical-five-rivers", "ghaggar-seasonal"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.knowPunjab, PGK_001_CP004_SOURCE_IDS.rajpuraPlan],
    },
  ],
  "PGK-001-QL-022": [
    {
      difficulty: "Easy",
      stem: "Which three are known as the eastern rivers of the Indus system?",
      canonical: "Ravi, Beas and Sutlej",
      options: ["Ravi, Beas and Sutlej", "Chenab, Jhelum and Indus", "Ravi, Chenab and Jhelum", "Beas, Jhelum and Indus"],
      explanation: "Ravi, Beas and Sutlej are the three eastern rivers of the Indus system.",
      factIds: ["eastern-rivers"],
      sourceIds: easternRiverSources,
    },
    {
      difficulty: "Easy",
      stem: "Which of the following is NOT one of the three eastern rivers?",
      canonical: "Chenab",
      options: ["Chenab", "Ravi", "Beas", "Sutlej"],
      explanation: "The eastern-river group consists of Ravi, Beas and Sutlej. Chenab belongs to the western group.",
      factIds: ["eastern-rivers"],
      sourceIds: easternRiverSources,
    },
    {
      difficulty: "Medium",
      stem: "Which river trio is common to both present-day Indian Punjab and the eastern-river group?",
      canonical: "Sutlej, Beas and Ravi",
      options: ["Sutlej, Beas and Ravi", "Chenab, Jhelum and Ravi", "Indus, Jhelum and Chenab", "Sutlej, Chenab and Ravi"],
      explanation: "Sutlej, Beas and Ravi are both the three eastern rivers and the three members of the traditional five that flow through present-day Indian Punjab.",
      factIds: ["present-punjab-three-from-five", "eastern-rivers"],
      sourceIds: easternRiverSources,
    },
    {
      difficulty: "Medium",
      stem: "Which pair consists entirely of eastern rivers?",
      canonical: "Ravi and Beas",
      options: ["Ravi and Beas", "Chenab and Jhelum", "Jhelum and Sutlej", "Indus and Ravi"],
      explanation: "Ravi and Beas are both eastern rivers. Sutlej is the third river in this group.",
      factIds: ["eastern-rivers"],
      sourceIds: easternRiverSources,
    },
    {
      difficulty: "Medium",
      stem: "Which of the following groups contains one river that is not part of the eastern-river trio?",
      canonical: "Ravi, Beas and Chenab",
      options: ["Ravi, Beas and Chenab", "Ravi, Beas and Sutlej", "Beas, Sutlej and Ravi", "Sutlej, Ravi and Beas"],
      explanation: "Chenab is not part of the eastern-river trio. Ravi, Beas and Sutlej form that complete group.",
      factIds: ["eastern-rivers"],
      sourceIds: easternRiverSources,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Ravi is an eastern river.\nII. Beas is an eastern river.\nIII. Jhelum is an eastern river.\nWhich of the statements given above are correct?",
      canonical: "I and II only",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "Ravi and Beas are eastern rivers, along with Sutlej. Jhelum is not part of this eastern trio.",
      factIds: ["eastern-rivers"],
      sourceIds: easternRiverSources,
    },
  ],
  "PGK-001-QL-023": [
    {
      difficulty: "Easy",
      stem: "The Beas joins which river at Harike?",
      canonical: "Sutlej",
      options: ["Sutlej", "Ravi", "Chenab", "Ghaggar"],
      explanation: "The Beas joins the Sutlej at Harike. Their confluence is one of Punjab's important river landmarks.",
      factIds: ["beas-sutlej-harike"],
      sourceIds: harikeSource,
    },
    {
      difficulty: "Easy",
      stem: "Which two rivers meet at Harike?",
      canonical: "Beas and Sutlej",
      options: ["Beas and Sutlej", "Ravi and Beas", "Ravi and Sutlej", "Ghaggar and Sutlej"],
      explanation: "Harike lies at the confluence of the Beas and Sutlej rivers.",
      factIds: ["beas-sutlej-harike"],
      sourceIds: harikeSource,
    },
    {
      difficulty: "Medium",
      stem: "At Harike, the Beas merges into which eastern river of the Indus system?",
      canonical: "Sutlej",
      options: ["Sutlej", "Beas", "Ravi", "Chenab"],
      explanation: "The Beas joins the Sutlej at Harike. The combined flow continues downstream as the Sutlej.",
      factIds: ["beas-sutlej-harike"],
      sourceIds: harikeSource,
    },
    {
      difficulty: "Medium",
      stem: "Which statement about the Beas is correct?",
      canonical: "It joins the Sutlej at Harike.",
      options: ["It joins the Sutlej at Harike.", "It joins the Ravi at Harike.", "It is not one of the traditional five rivers.", "It forms the Ghaggar floodplain."],
      explanation: "Beas is one of Punjab's traditional five rivers and joins the Sutlej at Harike.",
      factIds: ["historical-five-rivers", "beas-sutlej-harike"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.knowPunjab, PGK_001_CP004_SOURCE_IDS.tarnTaranPlan],
    },
    {
      difficulty: "Medium",
      stem: "Which river pair forms both a doab boundary and a confluence at Harike?",
      canonical: "Beas and Sutlej",
      options: ["Beas and Sutlej", "Ravi and Chenab", "Chenab and Jhelum", "Ravi and Beas"],
      explanation: "Beas and Sutlej bound the Bist Doab and also meet at Harike.",
      factIds: ["beas-sutlej-harike", "bist-doab"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.tarnTaranPlan, PGK_001_CP004_SOURCE_IDS.psebClass9Geography],
    },
    {
      difficulty: "Hard",
      stem: "A river pair bounds Bist Doab and meets at Harike. Which pair is it?",
      canonical: "Sutlej and Beas",
      options: ["Sutlej and Beas", "Beas and Ravi", "Ravi and Chenab", "Chenab and Jhelum"],
      explanation: "Bist Doab lies between Sutlej and Beas. These same two rivers meet at Harike.",
      factIds: ["bist-doab", "beas-sutlej-harike"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.psebClass9Geography, PGK_001_CP004_SOURCE_IDS.tarnTaranPlan],
    },
  ],
  "PGK-001-QL-024": [
    {
      difficulty: "Easy",
      stem: "Ghaggar is mainly what type of river in Punjab?",
      canonical: "Seasonal river",
      options: ["Seasonal river", "Perennial glacier-fed river", "Tidal river", "Deltaic distributary"],
      explanation: "Ghaggar is mainly a seasonal river. Its flow increases greatly during the rainy season.",
      factIds: ["ghaggar-seasonal"],
      sourceIds: ghaggarSource,
    },
    {
      difficulty: "Easy",
      stem: "The flow of the Ghaggar generally becomes much stronger during the:",
      canonical: "Rainy season",
      options: ["Rainy season", "Winter dry season", "Late spring only", "Entire year equally"],
      explanation: "Ghaggar carries much more water during the rainy season and can flood after heavy rainfall.",
      factIds: ["ghaggar-seasonal"],
      sourceIds: ghaggarSource,
    },
    {
      difficulty: "Medium",
      stem: "Which description best fits the Ghaggar?",
      canonical: "A seasonal river with much higher flow during rains",
      options: ["A seasonal river with much higher flow during rains", "A permanently frozen Himalayan river", "A coastal tidal channel", "A river that remains equally full throughout the year"],
      explanation: "Ghaggar is seasonal and responds strongly to monsoon rainfall. Its lower stretches may remain dry for much of the year.",
      factIds: ["ghaggar-seasonal"],
      sourceIds: ghaggarSource,
    },
    {
      difficulty: "Medium",
      stem: "Which river is correctly matched with its general flow character in Punjab?",
      canonical: "Ghaggar — Seasonal",
      options: ["Ghaggar — Seasonal", "Sutlej — Tidal", "Ravi — Coastal", "Beas — Desert-only"],
      explanation: "Ghaggar is a seasonal river in Punjab, with much stronger flow during the rains.",
      factIds: ["ghaggar-seasonal"],
      sourceIds: ghaggarSource,
    },
    {
      difficulty: "Medium",
      stem: "Which statement is correct about Ghaggar and the traditional five rivers of Punjab?",
      canonical: "Ghaggar is a seasonal river but is not one of the traditional five rivers.",
      options: ["Ghaggar is a seasonal river but is not one of the traditional five rivers.", "Ghaggar replaces Ravi in the traditional five.", "Ghaggar is another name for Sutlej.", "Ghaggar is one of the three eastern rivers."],
      explanation: "Ghaggar is an important seasonal river, but it is separate from the traditional five-river naming of Punjab.",
      factIds: ["ghaggar-seasonal", "historical-five-rivers"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.rajpuraPlan, PGK_001_CP004_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements about Ghaggar:\nI. It is seasonal.\nII. Its flow rises strongly during the rainy season.\nIII. It is one of the traditional five rivers that give Punjab its name.\nWhich of the statements given above are correct?",
      canonical: "I and II only",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "Ghaggar is seasonal and becomes much fuller during rains. It is not part of the traditional five-river set.",
      factIds: ["ghaggar-seasonal", "historical-five-rivers"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.rajpuraPlan, PGK_001_CP004_SOURCE_IDS.knowPunjab],
    },
  ],
  "PGK-001-QL-025": [
    {
      difficulty: "Easy",
      stem: "What is meant by the term 'Doab'?",
      canonical: "Land between two rivers",
      options: ["Land between two rivers", "Land above a mountain pass", "A seasonal river channel", "A river delta at the sea"],
      explanation: "A doab is the tract of land lying between two rivers.",
      factIds: ["doab-meaning"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Easy",
      stem: "Which geographical term is used for a tract of land between two rivers?",
      canonical: "Doab",
      options: ["Doab", "Kandi", "Bet", "Choe"],
      explanation: "The term doab refers to land between two rivers.",
      factIds: ["doab-meaning"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Medium",
      stem: "Which pair of rivers bounds Bist Doab?",
      canonical: "Sutlej and Beas",
      options: ["Sutlej and Beas", "Beas and Ravi", "Ravi and Chenab", "Chenab and Jhelum"],
      explanation: "Bist Doab lies between the Sutlej and Beas rivers.",
      factIds: ["bist-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Medium",
      stem: "Bari Doab lies between which two rivers?",
      canonical: "Beas and Ravi",
      options: ["Beas and Ravi", "Sutlej and Beas", "Ravi and Chenab", "Chenab and Jhelum"],
      explanation: "Bari Doab is the tract between the Beas and Ravi rivers.",
      factIds: ["bari-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Medium",
      stem: "Which two doabs share the Beas as one of their boundary rivers?",
      canonical: "Bist Doab and Bari Doab",
      options: ["Bist Doab and Bari Doab", "Bari Doab and Rachna Doab", "Rachna Doab and Chaj Doab", "Chaj Doab and Sind Sagar Doab"],
      explanation: "Beas forms one boundary of Bist Doab and the other boundary of Bari Doab.",
      factIds: ["bist-doab", "bari-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Hard",
      stem: "Which sequence correctly follows adjacent doabs from the Sutlej-Beas tract toward the Chenab-Jhelum tract?",
      canonical: "Bist → Bari → Rachna → Chaj",
      options: ["Bist → Bari → Rachna → Chaj", "Bari → Bist → Chaj → Rachna", "Chaj → Rachna → Bari → Bist", "Bist → Rachna → Bari → Chaj"],
      explanation: "The sequence follows adjoining river pairs: Sutlej-Beas, Beas-Ravi, Ravi-Chenab and Chenab-Jhelum.",
      factIds: ["bist-doab", "bari-doab", "rachna-doab", "chaj-doab"],
      sourceIds: doabSource,
    },
  ],
  "PGK-001-QL-026": [
    {
      difficulty: "Medium",
      stem: "Rachna Doab lies between which two rivers?",
      canonical: "Ravi and Chenab",
      options: ["Ravi and Chenab", "Beas and Ravi", "Chenab and Jhelum", "Sutlej and Beas"],
      explanation: "Rachna Doab lies between the Ravi and Chenab rivers.",
      factIds: ["rachna-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Medium",
      stem: "Chaj Doab lies between which two rivers?",
      canonical: "Chenab and Jhelum",
      options: ["Chenab and Jhelum", "Ravi and Chenab", "Beas and Ravi", "Sutlej and Beas"],
      explanation: "Chaj Doab lies between the Chenab and Jhelum rivers.",
      factIds: ["chaj-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Medium",
      stem: "Sind Sagar Doab lies between which two rivers?",
      canonical: "Jhelum and Indus",
      options: ["Jhelum and Indus", "Chenab and Jhelum", "Ravi and Chenab", "Beas and Ravi"],
      explanation: "Sind Sagar Doab lies toward the Jhelum-Indus side of the Punjab plains.",
      factIds: ["sind-sagar-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Medium",
      stem: "Which doab is correctly matched with its rivers?",
      canonical: "Rachna Doab — Ravi and Chenab",
      options: ["Rachna Doab — Ravi and Chenab", "Bari Doab — Chenab and Jhelum", "Bist Doab — Ravi and Beas", "Chaj Doab — Sutlej and Beas"],
      explanation: "Rachna Doab is the tract between the Ravi and Chenab rivers.",
      factIds: ["rachna-doab", "bari-doab", "bist-doab", "chaj-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Hard",
      stem: "Which doab shares the Ravi with Bari Doab on one side and the Chenab on the other?",
      canonical: "Rachna Doab",
      options: ["Rachna Doab", "Bist Doab", "Chaj Doab", "Sind Sagar Doab"],
      explanation: "Rachna Doab lies between Ravi and Chenab. Ravi also forms the western boundary of Bari Doab.",
      factIds: ["bari-doab", "rachna-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Hard",
      stem: "Which doab lies immediately beyond Rachna Doab when moving from Ravi-Chenab toward Jhelum?",
      canonical: "Chaj Doab",
      options: ["Chaj Doab", "Bist Doab", "Bari Doab", "Sind Sagar Doab"],
      explanation: "Rachna lies between Ravi and Chenab; the next tract, between Chenab and Jhelum, is Chaj Doab.",
      factIds: ["rachna-doab", "chaj-doab"],
      sourceIds: doabSource,
    },
  ],
  "PGK-001-QL-027": [
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Bist Doab — Sutlej and Beas\nII. Bari Doab — Beas and Ravi\nIII. Rachna Doab — Ravi and Chenab\nWhich of the pairs given above are correctly matched?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three pairs are correct and form a continuous sequence of adjoining river tracts.",
      factIds: ["bist-doab", "bari-doab", "rachna-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Chaj Doab — Chenab and Jhelum\nII. Sind Sagar Doab — Jhelum and Indus\nIII. Bist Doab — Beas and Ravi\nWhich of the pairs given above are correctly matched?",
      canonical: "I and II only",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "Chaj and Sind Sagar are correctly matched. Bist Doab lies between Sutlej and Beas, not Beas and Ravi.",
      factIds: ["chaj-doab", "sind-sagar-doab", "bist-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Hard",
      stem: "A doab is bounded by the same two rivers that meet at Harike. Which doab is it?",
      canonical: "Bist Doab",
      options: ["Bist Doab", "Bari Doab", "Rachna Doab", "Chaj Doab"],
      explanation: "Beas and Sutlej meet at Harike, and the land between these two rivers is Bist Doab.",
      factIds: ["bist-doab", "beas-sutlej-harike"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.psebClass9Geography, PGK_001_CP004_SOURCE_IDS.tarnTaranPlan],
    },
    {
      difficulty: "Hard",
      stem: "Which statement is correct?",
      canonical: "Bari Doab lies between Beas and Ravi, while Bist Doab lies between Sutlej and Beas.",
      options: ["Bari Doab lies between Beas and Ravi, while Bist Doab lies between Sutlej and Beas.", "Bari Doab lies between Sutlej and Beas, while Bist Doab lies between Ravi and Chenab.", "Both Bari and Bist lie between Chenab and Jhelum.", "Bist Doab lies between Jhelum and Indus."],
      explanation: "Bari is the Beas-Ravi tract, while Bist is the Sutlej-Beas tract.",
      factIds: ["bari-doab", "bist-doab"],
      sourceIds: doabSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Ravi, Beas and Sutlej are eastern rivers.\nII. Beas and Sutlej meet at Harike.\nIII. Ghaggar is one of the traditional five rivers of Punjab.\nWhich of the statements given above are correct?",
      canonical: "I and II only",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "The first two statements are correct. Ghaggar is seasonal but is not part of the traditional five-river set.",
      factIds: ["eastern-rivers", "beas-sutlej-harike", "ghaggar-seasonal", "historical-five-rivers"],
      sourceIds: [PGK_001_CP004_SOURCE_IDS.bbmbFormation, PGK_001_CP004_SOURCE_IDS.tarnTaranPlan, PGK_001_CP004_SOURCE_IDS.rajpuraPlan, PGK_001_CP004_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Hard",
      stem: "Which sequence correctly matches four adjoining doabs with their river pairs?",
      canonical: "Bist—Sutlej/Beas; Bari—Beas/Ravi; Rachna—Ravi/Chenab; Chaj—Chenab/Jhelum",
      options: ["Bist—Sutlej/Beas; Bari—Beas/Ravi; Rachna—Ravi/Chenab; Chaj—Chenab/Jhelum", "Bist—Beas/Ravi; Bari—Ravi/Chenab; Rachna—Chenab/Jhelum; Chaj—Sutlej/Beas", "Bist—Chenab/Jhelum; Bari—Sutlej/Beas; Rachna—Beas/Ravi; Chaj—Ravi/Chenab", "Bist—Jhelum/Indus; Bari—Chenab/Jhelum; Rachna—Beas/Ravi; Chaj—Sutlej/Beas"],
      explanation: "The four doabs follow adjoining river pairs from Sutlej-Beas through Chenab-Jhelum.",
      factIds: ["bist-doab", "bari-doab", "rachna-doab", "chaj-doab"],
      sourceIds: doabSource,
    },
  ],
};

const validFactIds = new Set<string>(PGK_001_CP004_FACT_IDS);

function buildQuestion(qlId: keyof typeof PGK_001_CP004_QL_NAMES, row: Row, index: number): Pgk001Cp004ReviewQuestion {
  const correctIndex = row.options.indexOf(row.canonical);
  if (correctIndex < 0) throw new Error(`${qlId} row ${index + 1} is missing its canonical answer`);
  return Object.freeze({
    questionId: `PGK-001-CP004-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP004_QL_NAMES[qlId],
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

export const PGK_001_CP004_REVIEW_BATCH_V1: readonly Pgk001Cp004ReviewQuestion[] = Object.freeze(
  (Object.keys(PGK_001_CP004_QL_NAMES) as (keyof typeof PGK_001_CP004_QL_NAMES)[]).flatMap((qlId, qlIndex) =>
    rowsByQl[qlId].map((row, rowIndex) => buildQuestion(qlId, row, qlIndex * 6 + rowIndex)),
  ),
);

export function auditPgk001Cp004ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "government of punjab",
    "puda",
    "bbmb",
    "pseb",
    "master plan",
    "source",
    "report",
    "puadh",
  ];

  for (const question of PGK_001_CP004_REVIEW_BATCH_V1) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0) issues.push(`${question.questionId}: missing internal source authority`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);

    for (const factId of question.factIds) {
      if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    }

    const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`.toLowerCase();
    for (const term of bannedLearnerTerms) {
      if (learnerText.includes(term)) issues.push(`${question.questionId}: learner-facing source/scope leakage: ${term}`);
    }

    for (const phrase of ["the correct answer is", "the correct option", "this question tests", "identify it", "with reference to punjab"]) {
      if (learnerText.includes(phrase)) issues.push(`${question.questionId}: unnatural learner wording: ${phrase}`);
    }
  }

  for (const qlId of Object.keys(PGK_001_CP004_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP004_REVIEW_BATCH_V1.length,
    qlCount: Object.keys(PGK_001_CP004_QL_NAMES).length,
  });
}
