import {
  PGK_001_CP002_REVIEW_BATCH_V1,
  type Pgk001Cp002ReviewQuestion,
} from "./pgk-001-cp002-review-batch-v1";

export const PGK_001_CP002_STEMS_V2 = Object.freeze([
  "As per Punjab at a Glance 2022, Punjab had how many administrative divisions?",
  "Which of the following is an administrative division of Punjab?",
  "Which of the following groups consists only of administrative divisions of Punjab?",
  "Ropar Division is also known as:",
  "Which of the following is NOT an administrative division of Punjab?",
  "Which of the following correctly lists all five administrative divisions of Punjab?",
  "The headquarters of Sahibzada Ajit Singh Nagar district is:",
  "The headquarters of Shaheed Bhagat Singh Nagar district is:",
  "Nawanshahr is the headquarters of:",
  "Mohali is the headquarters of:",
  "Ropar is another name for which district?",
  "Which of the following district–headquarters pairs is correctly matched?",
  "Moga district is part of which division?",
  "Bathinda district is part of which division?",
  "Amritsar district is part of which division?",
  "Ludhiana district is part of which division?",
  "Sahibzada Ajit Singh Nagar district is part of which division?",
  "Malerkotla district is part of which division?",
  "Malerkotla district was carved out of:",
  "Which of the following districts was created in 2021?",
  "Pathankot district was carved out of:",
  "Tarn Taran district was carved out of:",
  "Barnala became a separate district on:",
  "Before becoming a district, Moga was a subdivision of:",
  "Which of the following district–division pairs is incorrectly matched?",
  "Which of the following district–division pairs is correctly matched?",
  "Which of the following district–headquarters pairs is correctly matched?",
  "Which of the following district–headquarters pairs is incorrectly matched?",
  "Which of the following district–parent district pairs is correctly matched?",
  "Which of the following correctly matches a district with the district from which it was carved out?",
  "Which district became Punjab's 23rd district after being carved out of Sangrur in 2021?",
  "Which district was carved out of Gurdaspur in 2011 and falls under Jalandhar Division?",
  "Which district was carved out of Amritsar in 2006 and falls under Jalandhar Division?",
  "Which district has Mohali as its headquarters and falls under Rupnagar Division?",
  "Which district has Nawanshahr as its headquarters and falls under Rupnagar Division?",
  "Which district was created in 1995 from Faridkot and now falls under Ferozepur Division?",
  "Consider the following statements about Punjab's administrative structure (Punjab at a Glance 2022):\nI. Punjab had 23 districts.\nII. Punjab had 5 administrative divisions.\nIII. Malerkotla was included among the 23 districts.\nWhich of the statements given above are correct?",
  "Consider the following pairs:\nI. Malerkotla — Sangrur\nII. Pathankot — Gurdaspur\nIII. Tarn Taran — Amritsar\nWhich of the above are correctly matched?",
  "Consider the following pairs:\nI. Sahibzada Ajit Singh Nagar — Mohali\nII. Shaheed Bhagat Singh Nagar — Nawanshahr\nIII. Rupnagar — Ropar\nWhich of the above are correctly matched?",
  "Consider the following pairs:\nI. Bathinda — Faridkot Division\nII. Ludhiana — Patiala Division\nIII. Moga — Ferozepur Division\nWhich of the above are correctly matched?",
  "Arrange the following districts in chronological order of their creation, earliest first: Moga, Tarn Taran, Pathankot and Malerkotla.",
  "Consider the following statements about Sahibzada Ajit Singh Nagar district:\nI. It was formed in 2006.\nII. Its headquarters is Mohali.\nIII. It is part of Rupnagar Division.\nWhich of the above are correct?",
] as const);

if (PGK_001_CP002_STEMS_V2.length !== PGK_001_CP002_REVIEW_BATCH_V1.length) {
  throw new Error("CP002 V2 stem overlay must preserve the 42-question review batch");
}

export const PGK_001_CP002_REVIEW_BATCH_V2: readonly Pgk001Cp002ReviewQuestion[] = Object.freeze(
  PGK_001_CP002_REVIEW_BATCH_V1.map((question, index) =>
    Object.freeze({
      ...question,
      stem: PGK_001_CP002_STEMS_V2[index],
    }),
  ),
);

export function auditPgk001Cp002ReviewBatchV2() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const bannedNarrative = [
    "this district was",
    "its headquarters is",
    "identify it",
    "which list gives",
    "which of these",
    "is administered under which",
    "falls under which administrative division",
  ];

  for (const question of PGK_001_CP002_REVIEW_BATCH_V2) {
    const normalized = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    if (stems.has(normalized)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalized);

    for (const phrase of bannedNarrative) {
      if (normalized.includes(phrase)) issues.push(`${question.questionId}: non-exam stem phrase: ${phrase}`);
    }

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      issues.push(`${question.questionId}: canonical answer/index mismatch`);
    }
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP002_REVIEW_BATCH_V2.length,
  });
}
