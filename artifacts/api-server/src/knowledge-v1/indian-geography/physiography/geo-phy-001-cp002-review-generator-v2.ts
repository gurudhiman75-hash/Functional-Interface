import { generateGeoPhy001Cp002ReviewBatchV1 } from "./geo-phy-001-cp002-review-generator-v1";
import type { GeoPhy001Cp002ReviewQuestion } from "./geo-phy-001-cp002-review-types";

const statementLineage: Record<number, string[]> = {
  42: ["geo-phy-001-cp002-himadri-position", "geo-phy-001-cp002-shiwalik-position"],
  43: ["geo-phy-001-cp002-himachal-position", "geo-phy-001-cp002-duns"],
  44: ["geo-phy-001-cp002-kumaon-boundaries", "geo-phy-001-cp002-nepal-boundaries"],
  45: ["geo-phy-001-cp002-assam-boundaries", "geo-phy-001-cp002-purvachal-location"],
  46: ["geo-phy-001-cp002-shiwalik-position", "geo-phy-001-cp002-himadri-height"],
  47: ["geo-phy-001-cp002-purvachal-components", "geo-phy-001-cp002-punjab-himalaya-boundaries"],
  48: ["geo-phy-001-cp002-himadri-position", "geo-phy-001-cp002-himachal-position", "geo-phy-001-cp002-shiwalik-position"],
  49: ["geo-phy-001-cp002-kumaon-boundaries", "geo-phy-001-cp002-nepal-boundaries", "geo-phy-001-cp002-assam-boundaries"],
  50: ["geo-phy-001-cp002-purvachal-location", "geo-phy-001-cp002-purvachal-components"],
  51: ["geo-phy-001-cp002-himadri-height", "geo-phy-001-cp002-shiwalik-altitude", "geo-phy-001-cp002-himachal-position"],
  52: ["geo-phy-001-cp002-duns", "geo-phy-001-cp002-punjab-himalaya-boundaries"],
  53: ["geo-phy-001-cp002-purvachal-components", "geo-phy-001-cp002-purvachal-location"],
};

type Editorial = { stem: string; explanation: string };

const editorialByQl: Record<string, Editorial[]> = {
  "GEO-PHY-001-QL-010": [
    {
      stem: "Which of the following is the northernmost of the three parallel ranges of the Himalayas?",
      explanation: "Himadri, or the Greater Himalaya, is the northernmost of the three main longitudinal Himalayan ranges. Himachal lies to its south, while the Shiwaliks form the outermost range.",
    },
    {
      stem: "Perennially snow-covered peaks and many important glaciers are characteristic of which Himalayan range?",
      explanation: "The Himadri contains the loftiest Himalayan peaks. Its high altitude keeps many peaks permanently snow covered, and several important glaciers occur in this range.",
    },
    {
      stem: "Which Himalayan range lies immediately south of the Himadri?",
      explanation: "The Himachal, also called the Lesser Himalaya, lies south of the Himadri and north of the Shiwaliks.",
    },
    {
      stem: "The Kashmir, Kangra and Kullu valleys are mainly associated with which Himalayan range?",
      explanation: "These well-known valleys are associated with the Himachal or Lesser Himalaya. This range lies between the Himadri and the Shiwaliks.",
    },
    {
      stem: "Which of the following forms the outermost range of the Himalayas?",
      explanation: "The Shiwaliks form the outermost Himalayan range. They lie south of the Lesser Himalaya and are the youngest of the three major longitudinal ranges.",
    },
    {
      stem: "The longitudinal valleys known as duns lie between the Lesser Himalaya and which range?",
      explanation: "Duns are longitudinal valleys lying between the Lesser Himalaya and the Shiwaliks. Dehra Dun is a well-known example.",
    },
  ],
  "GEO-PHY-001-QL-011": [
    {
      stem: "Which Himalayan range is the most continuous and contains the loftiest peaks?",
      explanation: "The Himadri is the most continuous Himalayan range and contains the loftiest peaks. It forms the northernmost part of the main Himalayan system.",
    },
    {
      stem: "Which Himalayan range has an average height of about 6,000 metres?",
      explanation: "The Himadri has an average height of about 6,000 metres. This great elevation is also why permanent snow and glaciers are common there.",
    },
    {
      stem: "Which Himalayan range is highly rugged and is mainly made of compressed and altered rocks?",
      explanation: "The Himachal, or Lesser Himalaya, is a highly rugged mountain system. Its ranges are mainly composed of compressed and altered rocks.",
    },
    {
      stem: "An average altitude of about 3,700–4,500 metres is characteristic of which Himalayan range?",
      explanation: "The Himachal or Lesser Himalaya generally has an average altitude of about 3,700–4,500 metres, lower than the Himadri but higher than the Shiwaliks.",
    },
    {
      stem: "Which Himalayan range is mainly composed of unconsolidated sediments brought down by rivers from the ranges to its north?",
      explanation: "The Shiwaliks are built largely of unconsolidated river-borne sediments deposited from the higher Himalayan ranges lying farther north.",
    },
    {
      stem: "Which Himalayan range generally has an altitude of about 900–1,100 metres?",
      explanation: "The Shiwaliks are the lowest of the three main longitudinal Himalayan ranges, generally rising to about 900–1,100 metres.",
    },
  ],
  "GEO-PHY-001-QL-012": [
    {
      stem: "The Himalayan region between the Indus and Satluj rivers is known as which regional division?",
      explanation: "The stretch of the Himalayas between the Indus and Satluj rivers is called the Punjab Himalaya. Its western and eastern parts are also known regionally as the Kashmir and Himachal Himalayas.",
    },
    {
      stem: "Which regional division of the Himalayas lies between the Satluj and Kali rivers?",
      explanation: "The Himalayan sector bounded by the Satluj in the west and the Kali in the east is known as the Kumaon Himalayas.",
    },
    {
      stem: "The Himalayan sector between the Kali and Teesta rivers is called which of the following?",
      explanation: "The Nepal Himalayas extend from the Kali River in the west to the Teesta River in the east.",
    },
    {
      stem: "Which regional Himalayan division lies between the Teesta and Dihang rivers?",
      explanation: "The Assam Himalayas occupy the Himalayan sector between the Teesta and Dihang rivers.",
    },
    {
      stem: "The western part of the Punjab Himalaya is regionally known as which of the following?",
      explanation: "Within the Punjab Himalaya, the western part is known as the Kashmir Himalaya, while the eastern part is known as the Himachal Himalaya.",
    },
    {
      stem: "The eastern part of the Punjab Himalaya is regionally known as which of the following?",
      explanation: "The eastern part of the Punjab Himalaya is known as the Himachal Himalaya; the Kashmir Himalaya forms its western regional part.",
    },
  ],
  "GEO-PHY-001-QL-013": [
    {
      stem: "Which Himalayan regional division is bounded by the Indus on the west and the Satluj on the east?",
      explanation: "These two rivers delimit the Punjab Himalaya: the Indus forms its western boundary and the Satluj its eastern boundary.",
    },
    {
      stem: "The Satluj and Kali rivers mark the western and eastern limits respectively of which Himalayan division?",
      explanation: "The Kumaon Himalayas lie between the Satluj and Kali rivers, so these rivers form its western and eastern limits respectively.",
    },
    {
      stem: "Which Himalayan division extends from the Kali River eastwards to the Teesta River?",
      explanation: "The Nepal Himalayas extend from the Kali River to the Teesta River. The Kumaon Himalayas lie to their west and the Assam Himalayas to their east.",
    },
    {
      stem: "The Himalayan sector extending from the Teesta to the Dihang is known as which of the following?",
      explanation: "The sector between the Teesta and Dihang rivers is the Assam Himalayas. Beyond the Dihang gorge, the Himalayan ranges bend southwards into the Purvachal.",
    },
    {
      stem: "Which river forms the eastern boundary of the Kumaon Himalayas?",
      explanation: "The Kumaon Himalayas extend from the Satluj to the Kali. Therefore, the Kali River forms their eastern boundary.",
    },
    {
      stem: "Which river forms the western boundary of the Assam Himalayas?",
      explanation: "The Assam Himalayas extend from the Teesta to the Dihang. Therefore, the Teesta River forms their western boundary.",
    },
  ],
  "GEO-PHY-001-QL-014": [
    {
      stem: "What are the eastern hills and mountains beyond the Dihang gorge collectively known as?",
      explanation: "Beyond the Dihang gorge, the Himalayas bend sharply towards the south and continue as the Purvachal, or Eastern Hills and Mountains.",
    },
    {
      stem: "Beyond which gorge do the Himalayas bend sharply southwards to form the Purvachal?",
      explanation: "The Himalayan ranges take a sharp southward bend beyond the Dihang gorge. The hills that continue from there are collectively called the Purvachal.",
    },
    {
      stem: "Which of the following hill ranges forms part of the Purvachal?",
      explanation: "The Patkai Hills are part of the Purvachal. The Purvachal also includes the Naga, Manipur and Mizo hills.",
    },
    {
      stem: "Which of the following is included in the Purvachal hill system?",
      explanation: "The Naga Hills form part of the Purvachal, together with the Patkai, Manipur and Mizo hills.",
    },
    {
      stem: "Which of the following hills belongs to the Purvachal?",
      explanation: "The Manipur Hills are one of the hill groups included in the Purvachal of northeastern India.",
    },
    {
      stem: "Which of the following is a constituent hill range of the Purvachal?",
      explanation: "The Mizo Hills are part of the Purvachal. The Patkai, Naga and Manipur hills are also included in this eastern hill system.",
    },
  ],
  "GEO-PHY-001-QL-015": [
    {
      stem: "Which of the following pairs is correctly matched?",
      explanation: "Himadri is correctly matched with the northernmost Himalayan range. The Shiwaliks, not Himadri, form the outermost range.",
    },
    {
      stem: "Which of the following pairs is correctly matched?",
      explanation: "Himachal is another name for the Lesser Himalaya. It lies between the Himadri to the north and the Shiwaliks to the south.",
    },
    {
      stem: "Which of the following pairs is correctly matched?",
      explanation: "The Shiwaliks are correctly matched with the outermost Himalayan range. They form the southernmost of the three main longitudinal ranges.",
    },
    {
      stem: "Which of the following pairs is correctly matched?",
      explanation: "The Kumaon Himalayas lie between the Satluj and Kali rivers. The Kali–Teesta sector belongs to the Nepal Himalayas.",
    },
    {
      stem: "Which of the following pairs is correctly matched?",
      explanation: "The Nepal Himalayas extend from the Kali River to the Teesta River. The Teesta–Dihang sector is the Assam Himalayas.",
    },
    {
      stem: "Which of the following pairs is correctly matched?",
      explanation: "The Assam Himalayas lie between the Teesta and Dihang rivers. This makes the pair ‘Assam Himalayas — Teesta to Dihang’ correct.",
    },
  ],
  "GEO-PHY-001-QL-016": [
    {
      stem: "Which of the following pairs is incorrectly matched?",
      explanation: "‘Himadri — outermost Himalayan range’ is incorrect. Himadri is the northernmost range; the Shiwaliks are the outermost range.",
    },
    {
      stem: "Which of the following pairs is incorrectly matched?",
      explanation: "‘Himachal — northernmost Himalayan range’ is incorrect. Himachal is the Lesser Himalaya and lies south of the Himadri, which is the northernmost range.",
    },
    {
      stem: "Which of the following pairs is incorrectly matched?",
      explanation: "‘Shiwaliks — average height about 6,000 metres’ is incorrect. The Shiwaliks generally lie around 900–1,100 metres, while about 6,000 metres is the average height of the Himadri.",
    },
    {
      stem: "Which of the following pairs is incorrectly matched?",
      explanation: "‘Kumaon Himalayas — Kali to Teesta’ is incorrect. The Kumaon Himalayas lie between the Satluj and Kali; the Kali–Teesta sector is the Nepal Himalayas.",
    },
    {
      stem: "Which of the following pairs is incorrectly matched?",
      explanation: "‘Nepal Himalayas — Teesta to Dihang’ is incorrect. The Nepal Himalayas lie between the Kali and Teesta, while Teesta–Dihang marks the Assam Himalayas.",
    },
    {
      stem: "Which of the following pairs is incorrectly matched?",
      explanation: "‘Assam Himalayas — Satluj to Kali’ is incorrect. The Assam Himalayas lie between the Teesta and Dihang; Satluj–Kali marks the Kumaon Himalayas.",
    },
  ],
  "GEO-PHY-001-QL-017": [
    {
      stem: "Consider the following statements:\nI. Himadri is the northernmost Himalayan range.\nII. Shiwaliks are the outermost Himalayan range.\nWhich of the statements given above is/are correct?",
      explanation: "Both statements are correct. Himadri forms the northernmost main Himalayan range, while the Shiwaliks form the outermost range.",
    },
    {
      stem: "Consider the following statements:\nI. Himachal lies south of the Himadri.\nII. Duns lie between the Himadri and Himachal.\nWhich of the statements given above is/are correct?",
      explanation: "Statement I is correct: the Himachal or Lesser Himalaya lies south of the Himadri. Statement II is incorrect because duns lie between the Lesser Himalaya and the Shiwaliks, not between Himadri and Himachal.",
    },
    {
      stem: "Consider the following statements:\nI. Kumaon Himalayas lie between the Satluj and Kali rivers.\nII. Nepal Himalayas lie between the Teesta and Dihang rivers.\nWhich of the statements given above is/are correct?",
      explanation: "Statement I is correct. Statement II is incorrect: the Nepal Himalayas lie between the Kali and Teesta, whereas the Teesta–Dihang sector is the Assam Himalayas.",
    },
    {
      stem: "Consider the following statements:\nI. Assam Himalayas lie between the Teesta and Dihang rivers.\nII. Purvachal lies beyond the Dihang gorge.\nWhich of the statements given above is/are correct?",
      explanation: "Both statements are correct. The Assam Himalayas occupy the Teesta–Dihang sector, and beyond the Dihang gorge the ranges bend southwards into the Purvachal.",
    },
    {
      stem: "Consider the following statements:\nI. Shiwaliks are composed of unconsolidated sediments.\nII. Himadri has an average height of about 900–1,100 metres.\nWhich of the statements given above is/are correct?",
      explanation: "Statement I is correct: the Shiwaliks are formed largely of unconsolidated sediments. Statement II is incorrect because the Himadri averages about 6,000 metres; 900–1,100 metres is characteristic of the Shiwaliks.",
    },
    {
      stem: "Consider the following statements:\nI. Purvachal includes the Naga and Mizo hills.\nII. Punjab Himalaya lies between the Kali and Teesta rivers.\nWhich of the statements given above is/are correct?",
      explanation: "Statement I is correct: both the Naga and Mizo hills are parts of the Purvachal. Statement II is incorrect because the Punjab Himalaya lies between the Indus and Satluj; Kali–Teesta marks the Nepal Himalayas.",
    },
  ],
  "GEO-PHY-001-QL-018": [
    {
      stem: "Consider the following statements:\n1. Himadri is the northernmost range.\n2. Himachal lies south of Himadri.\n3. Shiwaliks are the outermost range.\nHow many of the statements given above are correct?",
      explanation: "All three are correct. From north to south, the main longitudinal ranges are Himadri, Himachal and Shiwaliks; therefore all three statements fit their correct positions.",
    },
    {
      stem: "Consider the following statements:\n1. Kumaon Himalayas lie between Satluj and Kali.\n2. Nepal Himalayas lie between Kali and Teesta.\n3. Assam Himalayas lie between Satluj and Kali.\nHow many of the statements given above are correct?",
      explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because the Assam Himalayas lie between the Teesta and Dihang rivers. Therefore, two statements are correct.",
    },
    {
      stem: "Consider the following statements:\n1. Purvachal begins beyond the Dihang gorge.\n2. Naga Hills form part of Purvachal.\n3. Pir Panjal forms part of Purvachal.\nHow many of the statements given above are correct?",
      explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect: Pir Panjal belongs to the Lesser Himalayan system and is not a part of the Purvachal. Hence, two statements are correct.",
    },
    {
      stem: "Consider the following statements:\n1. Himadri averages about 6,000 metres in height.\n2. Shiwaliks generally range around 900–1,100 metres in altitude.\n3. Himachal is the outermost Himalayan range.\nHow many of the statements given above are correct?",
      explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because the Shiwaliks, not the Himachal, form the outermost Himalayan range. Thus, two statements are correct.",
    },
    {
      stem: "Consider the following statements:\n1. Duns lie between Lesser Himalayas and Shiwaliks.\n2. Kashmir and Himachal are regional names within the Punjab Himalaya.\n3. Punjab Himalaya lies between Indus and Satluj.\nHow many of the statements given above are correct?",
      explanation: "All three statements are correct. Duns occupy the belt between the Lesser Himalaya and Shiwaliks, and the Indus–Satluj sector is the Punjab Himalaya, whose western and eastern parts are known as Kashmir and Himachal Himalayas.",
    },
    {
      stem: "Consider the following statements:\n1. Purvachal includes Patkai Hills.\n2. Purvachal includes Manipur Hills.\n3. Purvachal lies west of the Indus.\nHow many of the statements given above are correct?",
      explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect: the Purvachal lies in northeastern India beyond the Dihang gorge, not west of the Indus. Therefore, two statements are correct.",
    },
  ],
};

export function generateGeoPhy001Cp002ReviewBatchV2(): GeoPhy001Cp002ReviewQuestion[] {
  const offsets: Record<string, number> = {};
  return generateGeoPhy001Cp002ReviewBatchV1().map((question, index) => {
    const localIndex = offsets[question.qlId] ?? 0;
    offsets[question.qlId] = localIndex + 1;
    const editorial = editorialByQl[question.qlId]?.[localIndex];
    if (!editorial) throw new Error(`Missing CP002 editorial realization for ${question.qlId} item ${localIndex}`);

    return {
      ...question,
      questionId: question.questionId.replace("-V1-", "-V2-"),
      stem: editorial.stem,
      explanation: editorial.explanation,
      sourceFactIds: statementLineage[index] ?? question.sourceFactIds,
    };
  });
}
