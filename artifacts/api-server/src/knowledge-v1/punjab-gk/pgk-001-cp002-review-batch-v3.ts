import {
  PGK_001_CP002_REVIEW_BATCH_V2,
  type Pgk001Cp002ReviewQuestion,
} from "./pgk-001-cp002-review-batch-v2";

export const PGK_001_CP002_EXPLANATIONS_V3 = Object.freeze([
  "Punjab has five administrative divisions: Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar. The 2022 reference is kept because administrative boundaries can change.",
  "Faridkot is one of Punjab's five administrative divisions. It also gives its name to Faridkot district.",
  "Faridkot, Ferozepur and Jalandhar are three of Punjab's five administrative divisions.",
  "Ropar is another name for Rupnagar. The name is used for both the district and the division.",
  "Ludhiana is a district under Patiala Division; it is not a division itself.",
  "Punjab's five administrative divisions are Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar.",
  "Sahibzada Ajit Singh Nagar district is headquartered at Mohali. The district is also called Mohali district.",
  "Shaheed Bhagat Singh Nagar district is headquartered at Nawanshahr. SBS Nagar and Nawanshahr are therefore often seen together in Punjab GK.",
  "Nawanshahr is the headquarters of Shaheed Bhagat Singh Nagar district.",
  "Mohali is the headquarters of Sahibzada Ajit Singh Nagar district, also shortened to SAS Nagar.",
  "Ropar is the older alternative name of Rupnagar.",
  "Shaheed Bhagat Singh Nagar district has its headquarters at Nawanshahr.",
  "Moga district is in Ferozepur Division. Moga was historically formed from Faridkot district, which can make the two names easy to confuse.",
  "Bathinda district belongs to Faridkot Division.",
  "Amritsar district belongs to Jalandhar Division.",
  "Ludhiana district belongs to Patiala Division.",
  "Sahibzada Ajit Singh Nagar is part of Rupnagar Division, while its district headquarters is Mohali.",
  "Malerkotla district is part of Patiala Division. It became Punjab's 23rd district in 2021.",
  "Malerkotla was carved out of Sangrur district on 2 June 2021. It became Punjab's 23rd district.",
  "Malerkotla is the most recently created district in this group. It became a district in 2021, after Pathankot in 2011, Barnala in 2006 and Moga in 1995.",
  "Pathankot was earlier part of Gurdaspur district. It became a separate district on 27 July 2011.",
  "Tarn Taran was carved out of Amritsar district on 16 June 2006 and became Punjab's 19th district.",
  "Barnala became a separate district on 19 November 2006. Before that, it was part of Sangrur district.",
  "Before becoming a district on 24 November 1995, Moga was a subdivision of Faridkot district.",
  "Moga belongs to Ferozepur Division, not Faridkot Division. Its historical link with Faridkot comes from its earlier administrative status.",
  "Bathinda district is part of Faridkot Division.",
  "Sahibzada Ajit Singh Nagar district has its headquarters at Mohali.",
  "Shaheed Bhagat Singh Nagar district is headquartered at Nawanshahr, not Rupnagar.",
  "Pathankot was carved out of Gurdaspur district in 2011.",
  "Malerkotla was carved out of Sangrur district in 2021.",
  "Malerkotla became Punjab's 23rd district on 2 June 2021 after being carved out of Sangrur.",
  "Pathankot was separated from Gurdaspur in 2011 and is now part of Jalandhar Division.",
  "Tarn Taran was carved out of Amritsar in 2006 and is part of Jalandhar Division.",
  "Sahibzada Ajit Singh Nagar is headquartered at Mohali and belongs to Rupnagar Division.",
  "Shaheed Bhagat Singh Nagar is headquartered at Nawanshahr and belongs to Rupnagar Division.",
  "Moga became a district in 1995 after being separated from Faridkot. It now falls under Ferozepur Division.",
  "In the 2022 administrative structure, Punjab had 23 districts and five divisions. Malerkotla had already become the 23rd district in 2021.",
  "The three parent-district relations are Malerkotla–Sangrur, Pathankot–Gurdaspur and Tarn Taran–Amritsar.",
  "Mohali is the headquarters of SAS Nagar, Nawanshahr is the headquarters of SBS Nagar, and Ropar is another name for Rupnagar.",
  "Bathinda belongs to Faridkot Division, Ludhiana to Patiala Division and Moga to Ferozepur Division.",
  "The order is Moga (1995), Tarn Taran (2006), Pathankot (2011) and Malerkotla (2021).",
  "Sahibzada Ajit Singh Nagar was formed in 2006. Its headquarters is Mohali, and the district is part of Rupnagar Division.",
] as const);

if (PGK_001_CP002_EXPLANATIONS_V3.length !== PGK_001_CP002_REVIEW_BATCH_V2.length) {
  throw new Error("CP002 V3 explanation overlay must preserve the 42-question review batch");
}

export const PGK_001_CP002_REVIEW_BATCH_V3: readonly Pgk001Cp002ReviewQuestion[] = Object.freeze(
  PGK_001_CP002_REVIEW_BATCH_V2.map((question, index) =>
    Object.freeze({
      ...question,
      explanation: PGK_001_CP002_EXPLANATIONS_V3[index],
    }),
  ),
);

export function auditPgk001Cp002ReviewBatchV3() {
  const issues: string[] = [];
  const bannedMeta = [
    "the correct answer is",
    "according to the question",
    "the option",
    "the other options",
    "this question tests",
    "official snapshot records",
    "official statistical snapshot records",
  ];

  for (const question of PGK_001_CP002_REVIEW_BATCH_V3) {
    const explanation = question.explanation.trim();
    const normalized = explanation.toLowerCase().replace(/\s+/g, " ");

    if (!explanation) issues.push(`${question.questionId}: missing explanation`);
    if (explanation.length > 360) issues.push(`${question.questionId}: explanation is too long`);
    if (explanation.split(/[.!?]+/).filter(Boolean).length > 3) {
      issues.push(`${question.questionId}: explanation should stay compact`);
    }
    for (const phrase of bannedMeta) {
      if (normalized.includes(phrase)) issues.push(`${question.questionId}: unnatural explanation phrase: ${phrase}`);
    }
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP002_REVIEW_BATCH_V3.length,
  });
}
