import {
  PGK_001_CP007_REVIEW_BATCH_V1,
  type Pgk001Cp007ReviewQuestion,
} from "./pgk-001-cp007-review-batch-v1";

const STEMS_V2 = Object.freeze([
  "Punjab's natural forests are predominantly:",
  "Chir pine forests of Punjab are mainly found in:",
  "Bamboo forests in Punjab occur mainly in the:",
  "Bir forests are characteristic of which tract of Punjab?",
  "Mand forests are mainly found in:",
  "Which forest-location pair is correctly matched?",
  "Which protected area is located at Abohar?",
  "Bir Moti Bagh Wildlife Sanctuary is in which district?",
  "Takhni-Rehampur Wildlife Sanctuary is in which district?",
  "Jhajjar-Bacholi Wildlife Sanctuary is in which district?",
  "Nangal has which of the following protected-area designations?",
  "Which of the following sanctuary-location pairs is correctly matched?",
  "Which of the following is a Ramsar site in Punjab?",
  "Kanjli Wetland is located in which district?",
  "Ropar Wetland is located in which district?",
  "Which of the following Ramsar sites is also a Conservation Reserve?",
  "Which of the following Ramsar sites is also a Community Reserve?",
  "Which set consists only of Ramsar sites in Punjab?",
  "Harike Wetland lies at the confluence of:",
  "Kanjli Wetland lies on which rivulet?",
  "Which wetland-location pair is correctly matched?",
  "Ropar Wetland lies on which river?",
  "Nangal Wetland forms part of which project system?",
  "Punjab's river conservation reserve that supports the Indus river dolphin follows which river?",
  "Keshopur-Miani belongs to which protected-area category?",
  "The protected Beas river stretch in Punjab is designated as a:",
  "Nangal belongs to which protected-area category?",
  "Harike belongs to which protected-area category?",
  "Which protected-area pair is correctly matched?",
  "Consider the following pairs:\nI. Keshopur-Miani — Community Reserve\nII. Beas — Conservation Reserve\nIII. Nangal — Wildlife Sanctuary\nWhich of the pairs given above are correctly matched?",
  "Which protected area in Punjab supports the Indus river dolphin?",
  "Which species is a major conservation focus of Abohar Wildlife Sanctuary?",
  "Indian pangolin is recorded in which of the following protected areas?",
  "Which species-protected area pair is correctly matched?",
  "Which protected area is a major blackbuck habitat in Punjab?",
  "Consider the following pairs:\nI. Indus river dolphin — Beas Conservation Reserve\nII. Blackbuck — Abohar Wildlife Sanctuary\nIII. Indian pangolin — Nangal Wildlife Sanctuary\nWhich of the pairs given above are correctly matched?",
  "Which of the following is correctly matched?",
  "Which forest-location pair is correctly matched?",
  "Which wetland-water relation is correctly matched?",
  "Which set correctly matches the protected-area categories?",
  "Consider the following statements:\nI. Kanjli Wetland is in Kapurthala.\nII. Ropar Wetland lies on the Sutlej.\nIII. Keshopur-Miani is in Gurdaspur.\nWhich of the statements given above are correct?",
  "Consider the following statements:\nI. Chir pine forests occur in the Shivalik belt.\nII. Abohar Wildlife Sanctuary is an important blackbuck habitat.\nIII. Beas Conservation Reserve supports the Indus river dolphin.\nWhich of the statements given above are correct?",
] as const);

if (STEMS_V2.length !== PGK_001_CP007_REVIEW_BATCH_V1.length) {
  throw new Error("CP007 V2 stem overlay does not match V1 question count");
}

const EXPLANATION_OVERRIDES: Readonly<Record<number, string>> = Object.freeze({
  5: "Chir pine is found in the Shivalik foothill belt, particularly around Pathankot and adjoining areas.",
  11: "Bir Moti Bagh is in Patiala. Takhni-Rehampur is in Hoshiarpur, while Jhajjar-Bacholi and Nangal are in Rupnagar district.",
  13: "Kanjli Wetland lies in Kapurthala district on Kali Bein.",
  20: "Kanjli is in Kapurthala. Ropar and Nangal are in Rupnagar, while Keshopur-Miani is in Gurdaspur.",
  22: "Nangal Wetland occupies a human-made reservoir in the Bhakra-Nangal system in the Shivalik foothills.",
  31: "Abohar Wildlife Sanctuary is an important blackbuck conservation area in south-western Punjab.",
  33: "The Indus river dolphin occurs in the protected Beas River stretch within Beas Conservation Reserve.",
  37: "Bir forest tracts are characteristic of Patiala and adjoining plains.",
});

export const PGK_001_CP007_REVIEW_BATCH_V2: readonly Pgk001Cp007ReviewQuestion[] = Object.freeze(
  PGK_001_CP007_REVIEW_BATCH_V1.map((question, index) =>
    Object.freeze({
      ...question,
      stem: STEMS_V2[index],
      explanation: EXPLANATION_OVERRIDES[index] ?? question.explanation,
    }),
  ),
);

export function auditPgk001Cp007ReviewBatchV2() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const bannedStemPhrases = [
    "associated with",
    "closely associated",
    "most closely associated",
    "linked with",
    "closely linked",
    "known for",
    "especially associated",
    "is protected in punjab as",
    "which combination correctly links",
    "which part of punjab",
  ];
  const bannedLearnerPhrases = [
    "associated with",
    "closely associated",
    "most closely associated",
    "linked with",
    "closely linked",
    "well known for",
    "especially associated",
    "the correct answer is",
    "the correct option",
    "the other options",
    "this question tests",
    "identify it",
  ];

  for (const question of PGK_001_CP007_REVIEW_BATCH_V2) {
    const stem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(stem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(stem);
    for (const phrase of bannedStemPhrases) {
      if (stem.includes(phrase)) issues.push(`${question.questionId}: non-exam stem phrase: ${phrase}`);
    }
    for (const phrase of bannedLearnerPhrases) {
      if (learner.includes(phrase)) issues.push(`${question.questionId}: learner wording phrase: ${phrase}`);
    }
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP007_REVIEW_BATCH_V2.length,
  });
}
