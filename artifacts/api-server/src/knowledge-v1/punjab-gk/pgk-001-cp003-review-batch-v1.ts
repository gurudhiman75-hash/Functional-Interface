import type { KnowledgeV1Difficulty } from "../types";
import {
  PGK_001_CP003_SOURCE_IDS,
  PGK_001_CP003_VALID_FACT_IDS,
} from "./pgk-001-cp003-facts";

export type Pgk001Cp003ReviewQuestion = Readonly<{
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

export const PGK_001_CP003_QL_NAMES = Object.freeze({
  "PGK-001-QL-014": "Official regional classification schemes",
  "PGK-001-QL-015": "Region-place identification",
  "PGK-001-QL-016": "Elevation and relief pattern",
  "PGK-001-QL-017": "Punjab alluvial plain",
  "PGK-001-QL-018": "Shivalik and Kandi geography",
  "PGK-001-QL-019": "Piedmont, upland and floodplain landforms",
  "PGK-001-QL-020": "Regional-relief synthesis",
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

const rowsByQl: Record<keyof typeof PGK_001_CP003_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-014": [
    {
      difficulty: "Easy",
      stem: "According to the Government of Punjab's Know Punjab profile, the state is divided into which three broad regions?",
      canonical: "Majha, Doaba and Malwa",
      options: ["Majha, Doaba and Malwa", "Majha, Malwa and Puadh", "Doaba, Puadh and Malwa", "Majha, Doaba and Kandi"],
      explanation: "The state profile groups Punjab into Majha, Doaba and Malwa. Puadh appears in another official planning classification, so the scheme matters.",
      factIds: ["gov-punjab-three-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Easy",
      stem: "In the PUDA Greater Mohali Regional Plan, which region is listed with Majha, Doaba and Malwa as a fourth natural region?",
      canonical: "Puadh",
      options: ["Puadh", "Kandi", "Bet", "Bhabar"],
      explanation: "The PUDA plan lists Majha, Doaba, Malwa and Puadh as four natural regions. This is a different classification from the three-region state profile.",
      factIds: ["puda-four-natural-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan],
    },
    {
      difficulty: "Medium",
      stem: "Which of the following correctly gives the three-region classification used on the Government of Punjab portal?",
      canonical: "Majha — Doaba — Malwa",
      options: ["Majha — Doaba — Malwa", "Majha — Doaba — Puadh", "Kandi — Doaba — Malwa", "Majha — Puadh — Kandi"],
      explanation: "The Government of Punjab portal uses Majha, Doaba and Malwa as its broad three-region classification.",
      factIds: ["gov-punjab-three-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Medium",
      stem: "Which set matches the four natural regions named in the PUDA Greater Mohali Regional Plan?",
      canonical: "Majha, Doaba, Malwa and Puadh",
      options: ["Majha, Doaba, Malwa and Puadh", "Majha, Doaba, Kandi and Bet", "Doaba, Malwa, Kandi and Puadh", "Majha, Malwa, Bet and Puadh"],
      explanation: "The PUDA regional plan names Majha, Doaba, Malwa and Puadh. Kandi and floodplain terms describe physical tracts rather than this four-region scheme.",
      factIds: ["puda-four-natural-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan],
    },
    {
      difficulty: "Medium",
      stem: "Which statement about Punjab's official regional classifications is correct?",
      canonical: "The state portal uses three regions, while a PUDA regional plan also includes Puadh.",
      options: ["The state portal uses three regions, while a PUDA regional plan also includes Puadh.", "Both official sources use exactly the same three-region list.", "The state portal lists Puadh but not Malwa.", "The PUDA plan replaces Doaba with Kandi."],
      explanation: "Both classifications are official but serve different contexts. The state portal uses Majha, Doaba and Malwa, while the PUDA plan adds Puadh.",
      factIds: ["gov-punjab-three-region", "puda-four-natural-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. The Government of Punjab portal groups the state into Majha, Doaba and Malwa.\nII. A PUDA regional plan lists Puadh as a fourth natural region.\nWhich of the statements given above is/are correct?",
      canonical: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Both statements are correct. This is why regional-count questions must identify the classification being used.",
      factIds: ["gov-punjab-three-region", "puda-four-natural-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan],
    },
  ],
  "PGK-001-QL-015": [
    {
      difficulty: "Easy",
      stem: "Tarn Taran forms part of which region of Punjab?",
      canonical: "Majha",
      options: ["Majha", "Doaba", "Malwa", "Puadh"],
      explanation: "Tarn Taran is in the Majha region of Punjab. Its official master plan places it in the north-western part of the state.",
      factIds: ["tarn-taran-majha"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan],
    },
    {
      difficulty: "Easy",
      stem: "Jalandhar is situated in which region of Punjab?",
      canonical: "Doaba",
      options: ["Doaba", "Majha", "Malwa", "Puadh"],
      explanation: "Jalandhar lies in the Doaba region. The Jalandhar master plan identifies the city with this region.",
      factIds: ["jalandhar-doaba"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.jalandharPlan],
    },
    {
      difficulty: "Medium",
      stem: "Nawanshahr is located in which region of Punjab?",
      canonical: "Doaba",
      options: ["Doaba", "Majha", "Malwa", "Puadh"],
      explanation: "Nawanshahr lies in the Doaba region. Its planning area is described in the official master plan as part of Doaba.",
      factIds: ["nawanshahr-doaba"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.nawanshahrPlan],
    },
    {
      difficulty: "Easy",
      stem: "Ludhiana falls in which broad region of Punjab?",
      canonical: "Malwa",
      options: ["Malwa", "Majha", "Doaba", "Puadh"],
      explanation: "Ludhiana is in the Malwa region. Its official master plan identifies Ludhiana with Malwa.",
      factIds: ["ludhiana-malwa"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.ludhianaPlan],
    },
    {
      difficulty: "Easy",
      stem: "Bathinda is part of which region of Punjab?",
      canonical: "Malwa",
      options: ["Malwa", "Doaba", "Majha", "Puadh"],
      explanation: "Bathinda lies in the Malwa region of southern Punjab.",
      factIds: ["bathinda-malwa"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.bathindaPlan],
    },
    {
      difficulty: "Medium",
      stem: "Which of the following place-region pairs is incorrectly matched?",
      canonical: "Tarn Taran — Malwa",
      options: ["Tarn Taran — Malwa", "Jalandhar — Doaba", "Bathinda — Malwa", "Sangrur — Malwa"],
      explanation: "Tarn Taran belongs to Majha, not Malwa. Jalandhar is in Doaba, while Bathinda and Sangrur are in Malwa.",
      factIds: ["tarn-taran-majha", "jalandhar-doaba", "bathinda-malwa", "sangrur-malwa"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan, PGK_001_CP003_SOURCE_IDS.jalandharPlan, PGK_001_CP003_SOURCE_IDS.bathindaPlan, PGK_001_CP003_SOURCE_IDS.sangrurPlan],
    },
  ],
  "PGK-001-QL-016": [
    {
      difficulty: "Easy",
      stem: "The average elevation of Punjab is approximately:",
      canonical: "300 metres above sea level",
      options: ["300 metres above sea level", "100 metres above sea level", "600 metres above sea level", "900 metres above sea level"],
      explanation: "Punjab's average elevation is about 300 metres above sea level. The state becomes higher toward its north-eastern side.",
      factIds: ["punjab-elevation-profile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Easy",
      stem: "The lowest part of Punjab's broad elevation range, about 180 metres, lies toward the:",
      canonical: "Southwest",
      options: ["Southwest", "Northeast", "North", "East"],
      explanation: "Punjab's lower elevations are in the southwest, at about 180 metres. The north-eastern border rises much higher.",
      factIds: ["punjab-elevation-profile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Easy",
      stem: "Near Punjab's north-eastern border, elevation rises to:",
      canonical: "More than 500 metres",
      options: ["More than 500 metres", "About 100 metres", "Less than 150 metres", "Exactly 200 metres"],
      explanation: "The north-eastern border rises above 500 metres in places. This contrasts with the much lower south-western part of Punjab.",
      factIds: ["punjab-elevation-profile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Medium",
      stem: "Which of the following best describes Punjab's broad relief pattern?",
      canonical: "Higher in the northeast and lower in the southwest",
      options: ["Higher in the northeast and lower in the southwest", "Higher in the southwest and lower in the northeast", "Uniform elevation throughout the state", "Highest in the central plains and lowest on both borders"],
      explanation: "Punjab's broad relief rises toward the northeast and falls toward the southwest. The state profile gives roughly 180 metres in the southwest and over 500 metres near the northeast border.",
      factIds: ["punjab-elevation-profile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Medium",
      stem: "Which elevation-region pair is correctly matched for Punjab?",
      canonical: "Southwest — about 180 m",
      options: ["Southwest — about 180 m", "Northeast — about 180 m", "Southwest — above 500 m", "Central plain — above 1,000 m"],
      explanation: "The southwest is the lower end of Punjab's broad elevation range at about 180 metres. The northeast rises above 500 metres in places.",
      factIds: ["punjab-elevation-profile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements about Punjab's relief:\nI. Average elevation is about 300 metres.\nII. The southwest is around 180 metres in the broad state profile.\nIII. Parts near the north-eastern border rise above 500 metres.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three statements describe the official state relief profile. Together they show a clear rise from the southwest toward the northeast.",
      factIds: ["punjab-elevation-profile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
    },
  ],
  "PGK-001-QL-017": [
    {
      difficulty: "Easy",
      stem: "The extensive plains of Punjab form part of the:",
      canonical: "Indo-Gangetic Plain",
      options: ["Indo-Gangetic Plain", "Deccan Plateau", "Malwa Plateau of central India", "Thar dune system"],
      explanation: "Punjab's plains are part of the great plains of North India, also described as the Indo-Gangetic Plain. Their surface is predominantly alluvial.",
      factIds: ["punjab-indo-gangetic-plain"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.fatehgarhPlan],
    },
    {
      difficulty: "Easy",
      stem: "Most of Punjab's plain surface is predominantly of which origin?",
      canonical: "Alluvial",
      options: ["Alluvial", "Volcanic", "Glacial moraine", "Coral"],
      explanation: "Punjab's broad plains are alluvial, built from sediments laid down by river systems over time.",
      factIds: ["punjab-indo-gangetic-plain", "alluvial-plain-flat"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.fatehgarhPlan],
    },
    {
      difficulty: "Medium",
      stem: "Which description best fits much of Punjab's alluvial plain?",
      canonical: "Flat to gently sloping",
      options: ["Flat to gently sloping", "Steep and rocky throughout", "High volcanic plateau", "Continuous sand dunes"],
      explanation: "Much of the Punjab plain is flat to gently sloping. The more uneven relief is concentrated toward the Shivalik and foothill belt.",
      factIds: ["alluvial-plain-flat"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.fatehgarhPlan],
    },
    {
      difficulty: "Medium",
      stem: "In the Fatehgarh Sahib-Sirhind planning area, the alluvial soils are described as:",
      canonical: "Well drained and fertile",
      options: ["Well drained and fertile", "Permanently frozen", "Strongly saline everywhere", "Rocky and soil-free"],
      explanation: "The alluvial plain there is described as having well-drained, fertile soils. This is typical of Punjab's productive central plains.",
      factIds: ["alluvial-soil-fertile"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.fatehgarhPlan],
    },
    {
      difficulty: "Medium",
      stem: "The Sri Hargobindpur planning area is described as part of the alluvial plain of:",
      canonical: "Bari Doab",
      options: ["Bari Doab", "Malwa Plateau", "Aravalli belt", "Kandi crest"],
      explanation: "Sri Hargobindpur lies on the alluvial plain of Bari Doab. The land then drops toward the Beas floodplain.",
      factIds: ["bari-doab-alluvial-to-floodplain"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.hargobindpurPlan],
    },
    {
      difficulty: "Hard",
      stem: "Which of the following pairs is correctly matched?",
      canonical: "Punjab Plain — predominantly alluvial",
      options: ["Punjab Plain — predominantly alluvial", "Punjab Plain — mainly volcanic", "Shivalik foothills — flat deltaic plain", "Kandi tract — coastal plain"],
      explanation: "Punjab's extensive plain is predominantly alluvial. Shivalik and Kandi areas have more uneven foothill relief.",
      factIds: ["punjab-indo-gangetic-plain", "pau-kandi-shivalik"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.fatehgarhPlan, PGK_001_CP003_SOURCE_IDS.pauKandi],
    },
  ],
  "PGK-001-QL-018": [
    {
      difficulty: "Medium",
      stem: "The Pathankot master plan divides its physical setting into which three broad tracts?",
      canonical: "Sub-Mountainous, Kandi and Plain",
      options: ["Sub-Mountainous, Kandi and Plain", "Majha, Doaba and Malwa", "Piedmont, Delta and Plateau", "Kandi, Desert and Coastal Plain"],
      explanation: "Pathankot's official plan describes Sub-Mountainous, Kandi and Plain tracts. These are physical divisions, not the cultural-region scheme used elsewhere.",
      factIds: ["pathankot-three-tracts"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.pathankotPlan],
    },
    {
      difficulty: "Easy",
      stem: "PAU's Ballowal Saunkhri research station is located in the heart of which area?",
      canonical: "Kandi area",
      options: ["Kandi area", "Malwa plain", "Ghaggar floodplain", "South-western desert fringe"],
      explanation: "PAU describes Ballowal Saunkhri as being in the heart of the Kandi area. The station lies in the Shivalik foothills.",
      factIds: ["pau-kandi-shivalik"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.pauKandi],
    },
    {
      difficulty: "Easy",
      stem: "Punjab's Kandi area lies in which physiographic setting?",
      canonical: "Shivalik foothills",
      options: ["Shivalik foothills", "Central delta", "Coastal belt", "Thar dune core"],
      explanation: "The Kandi area lies along Punjab's Shivalik foothill belt. PAU's Kandi research station is located in this setting.",
      factIds: ["pau-kandi-shivalik"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.pauKandi],
    },
    {
      difficulty: "Medium",
      stem: "Which of the following is NOT one of the three broad physical tracts named in the Pathankot master plan?",
      canonical: "Piedmont Plain",
      options: ["Piedmont Plain", "Sub-Mountainous", "Kandi", "Plain"],
      explanation: "The Pathankot plan names Sub-Mountainous, Kandi and Plain. Piedmont Plain appears in another official physiographic classification used for Greater Mohali.",
      factIds: ["pathankot-three-tracts", "gmr-landform-set"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.pathankotPlan, PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan],
    },
    {
      difficulty: "Medium",
      stem: "Ballowal Saunkhri, used by PAU for Kandi-area research, lies in the:",
      canonical: "Shivalik foothills",
      options: ["Shivalik foothills", "Lower Ghaggar floodplain", "South-western alluvial depression", "Ravi delta"],
      explanation: "Ballowal Saunkhri lies in the Shivalik foothills. Its location makes it suitable for research on Kandi-area conditions.",
      factIds: ["pau-kandi-shivalik"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.pauKandi],
    },
    {
      difficulty: "Hard",
      stem: "Which of the following physiographic pairs is correctly matched?",
      canonical: "Kandi — Shivalik foothill belt",
      options: ["Kandi — Shivalik foothill belt", "Malwa — Shivalik crest", "Doaba — coastal plain", "Majha — volcanic plateau"],
      explanation: "Kandi lies along the Shivalik foothill belt. Majha, Doaba and Malwa are broad regional divisions rather than this foothill landform.",
      factIds: ["pau-kandi-shivalik"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.pauKandi],
    },
  ],
  "PGK-001-QL-019": [
    {
      difficulty: "Medium",
      stem: "Which of the following is NOT one of the landform classes shown in the Greater Mohali regional physiographic map?",
      canonical: "Upland Plain",
      options: ["Upland Plain", "Shivalik Hills", "Piedmont Plain", "Old Alluvial Plain"],
      explanation: "The Greater Mohali map shows Shivalik Hills, Piedmont Plain, Old Alluvial Plain and Recent Alluvial Plain. Upland Plain is used in the Patiala-Rajpura physiographic scheme.",
      factIds: ["gmr-landform-set", "rajpura-three-landforms"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan, PGK_001_CP003_SOURCE_IDS.rajpuraPlan],
    },
    {
      difficulty: "Medium",
      stem: "Which set correctly gives the three physiographic regions described for the Rajpura area?",
      canonical: "Upland Plain, Choe-Infested Foothill Plain and Ghaggar Flood Plain",
      options: ["Upland Plain, Choe-Infested Foothill Plain and Ghaggar Flood Plain", "Shivalik Hills, Malwa Plain and Bari Doab", "Kandi, Doaba and Recent Delta", "Old Alluvial Plain, Desert Plain and Coastal Plain"],
      explanation: "Rajpura's plan distinguishes the Upland Plain, Choe-Infested Foothill Plain and Ghaggar Flood Plain.",
      factIds: ["rajpura-three-landforms"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.rajpuraPlan],
    },
    {
      difficulty: "Hard",
      stem: "In the Rajpura-Patiala relief sequence, the upland plain lies:",
      canonical: "Above the floodplain but below the choe-infested foothill plain",
      options: ["Above the floodplain but below the choe-infested foothill plain", "Below both the floodplain and foothill plain", "Above both the floodplain and foothill plain", "At exactly the same level as the floodplain"],
      explanation: "The upland plain occupies an intermediate position. It is higher than the floodplain but lower than the choe-infested foothill plain.",
      factIds: ["upland-relative-height"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.rajpuraPlan, PGK_001_CP003_SOURCE_IDS.patialaPlan],
    },
    {
      difficulty: "Medium",
      stem: "Among the Rajpura physiographic tracts, which lies lowest in the stated relief sequence?",
      canonical: "Floodplain",
      options: ["Floodplain", "Upland Plain", "Choe-Infested Foothill Plain", "Shivalik crest"],
      explanation: "The floodplain is the lower surface in this sequence. The upland plain lies above it, while the choe-infested foothill plain is higher still.",
      factIds: ["upland-relative-height"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.rajpuraPlan, PGK_001_CP003_SOURCE_IDS.patialaPlan],
    },
    {
      difficulty: "Medium",
      stem: "Flooding can renew the Ghaggar floodplain soil through the deposition of:",
      canonical: "Silt",
      options: ["Silt", "Lava", "Glacial ice", "Coral debris"],
      explanation: "Floodwater can leave behind fresh silt on the floodplain. This sediment helps renew the soil surface.",
      factIds: ["floodplain-silt"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.rajpuraPlan],
    },
    {
      difficulty: "Hard",
      stem: "The alluvial plain around Sri Hargobindpur falls toward which lower landform?",
      canonical: "Beas floodplain",
      options: ["Beas floodplain", "Shivalik crest", "Malwa plateau", "Piedmont ridge"],
      explanation: "The Sri Hargobindpur area lies on the alluvial plain of Bari Doab and drops toward the Beas floodplain.",
      factIds: ["bari-doab-alluvial-to-floodplain"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.hargobindpurPlan],
    },
  ],
  "PGK-001-QL-020": [
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Tarn Taran — Majha\nII. Jalandhar — Doaba\nIII. Ludhiana — Malwa\nWhich of the pairs given above are correctly matched?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three are correct: Tarn Taran is in Majha, Jalandhar in Doaba and Ludhiana in Malwa.",
      factIds: ["tarn-taran-majha", "jalandhar-doaba", "ludhiana-malwa"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan, PGK_001_CP003_SOURCE_IDS.jalandharPlan, PGK_001_CP003_SOURCE_IDS.ludhianaPlan],
    },
    {
      difficulty: "Hard",
      stem: "Arrange the following Rajpura-Patiala landforms from higher to lower relief:\n1. Floodplain\n2. Choe-Infested Foothill Plain\n3. Upland Plain",
      canonical: "2 → 3 → 1",
      options: ["2 → 3 → 1", "1 → 3 → 2", "3 → 2 → 1", "2 → 1 → 3"],
      explanation: "The choe-infested foothill plain is highest, the upland plain is intermediate and the floodplain is lowest.",
      factIds: ["upland-relative-height"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.rajpuraPlan, PGK_001_CP003_SOURCE_IDS.patialaPlan],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Punjab's broad relief is higher toward the northeast.\nII. The Kandi area lies along the Shivalik foothills.\nIII. Much of the Punjab plain is alluvial.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three describe Punjab's physical geography: higher relief in the northeast, Kandi in the Shivalik foothill belt and extensive alluvial plains below.",
      factIds: ["punjab-elevation-profile", "pau-kandi-shivalik", "punjab-indo-gangetic-plain"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.pauKandi, PGK_001_CP003_SOURCE_IDS.fatehgarhPlan],
    },
    {
      difficulty: "Hard",
      stem: "Which of the following pairs is incorrectly matched?",
      canonical: "Southwest Punjab — highest broad relief",
      options: ["Southwest Punjab — highest broad relief", "Kandi — Shivalik foothills", "Punjab Plain — alluvial", "Floodplain — silt deposition"],
      explanation: "Southwest Punjab is at the lower end of the state's broad elevation range. Higher relief occurs toward the northeast.",
      factIds: ["punjab-elevation-profile", "pau-kandi-shivalik", "punjab-indo-gangetic-plain", "floodplain-silt"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.pauKandi, PGK_001_CP003_SOURCE_IDS.fatehgarhPlan, PGK_001_CP003_SOURCE_IDS.rajpuraPlan],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements about Punjab's regional classifications:\nI. The Government of Punjab portal uses a three-region scheme.\nII. PUDA also uses a four-natural-region scheme that includes Puadh.\nIII. The two schemes should not be treated as contradictory when the source is specified.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "Both schemes appear in official Punjab sources and use different classification contexts. The source must therefore be clear when a question tests the regional count.",
      factIds: ["gov-punjab-three-region", "puda-four-natural-region"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan],
    },
    {
      difficulty: "Hard",
      stem: "Which statement best summarizes Punjab's physical relief?",
      canonical: "Shivalik and foothill relief in the northeast grades into extensive alluvial plains toward lower elevations.",
      options: ["Shivalik and foothill relief in the northeast grades into extensive alluvial plains toward lower elevations.", "The entire state is a uniformly high plateau.", "Punjab is dominated by a coastal plain rising toward the southwest.", "The central plains are higher than the Shivalik foothills."],
      explanation: "Punjab rises toward the Shivalik side in the northeast and opens into broad alluvial plains. Elevation decreases toward the southwest across the broad relief pattern.",
      factIds: ["punjab-elevation-profile", "pau-kandi-shivalik", "punjab-indo-gangetic-plain"],
      sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.pauKandi, PGK_001_CP003_SOURCE_IDS.fatehgarhPlan],
    },
  ],
};

const validFactIds = new Set<string>(PGK_001_CP003_VALID_FACT_IDS);

function buildQuestion(
  qlId: keyof typeof PGK_001_CP003_QL_NAMES,
  row: Row,
  index: number,
): Pgk001Cp003ReviewQuestion {
  const correctIndex = row.options.indexOf(row.canonical);
  if (correctIndex < 0) throw new Error(`${qlId} row ${index + 1} is missing its canonical answer`);
  return Object.freeze({
    questionId: `PGK-001-CP003-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP003_QL_NAMES[qlId],
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

export const PGK_001_CP003_REVIEW_BATCH_V1: readonly Pgk001Cp003ReviewQuestion[] = Object.freeze(
  (Object.keys(PGK_001_CP003_QL_NAMES) as (keyof typeof PGK_001_CP003_QL_NAMES)[]).flatMap((qlId, qlIndex) =>
    rowsByQl[qlId].map((row, rowIndex) => buildQuestion(qlId, row, qlIndex * 6 + rowIndex)),
  ),
);

export function auditPgk001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();

  for (const question of PGK_001_CP003_REVIEW_BATCH_V1) {
    const normalized = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    if (stems.has(normalized)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalized);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0) issues.push(`${question.questionId}: missing source authority`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);

    for (const factId of question.factIds) {
      if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    }

    const bannedStemPhrases = [
      "this area is",
      "identify it",
      "which list gives",
      "with reference to punjab",
      "which of the following is associated with",
    ];
    for (const phrase of bannedStemPhrases) {
      if (normalized.includes(phrase)) issues.push(`${question.questionId}: non-exam stem phrase: ${phrase}`);
    }

    const lowerExplanation = question.explanation.toLowerCase();
    const bannedExplanationPhrases = [
      "the correct answer is",
      "the correct option",
      "the other options",
      "this question tests",
      "review batch",
      "generator",
    ];
    for (const phrase of bannedExplanationPhrases) {
      if (lowerExplanation.includes(phrase)) issues.push(`${question.questionId}: unnatural explanation phrase: ${phrase}`);
    }
  }

  for (const qlId of Object.keys(PGK_001_CP003_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  const unqualifiedCountStem = PGK_001_CP003_REVIEW_BATCH_V1.find((question) => {
    const stem = question.stem.toLowerCase();
    return /how many.*region/.test(stem) && !/government of punjab|puda|regional plan|profile/.test(stem);
  });
  if (unqualifiedCountStem) issues.push(`${unqualifiedCountStem.questionId}: ambiguous regional-count question`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP003_REVIEW_BATCH_V1.length,
    qlCount: Object.keys(PGK_001_CP003_QL_NAMES).length,
  });
}
