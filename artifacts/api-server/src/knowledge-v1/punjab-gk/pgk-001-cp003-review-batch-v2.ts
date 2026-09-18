import {
  PGK_001_CP003_REVIEW_BATCH_V1,
  type Pgk001Cp003ReviewQuestion,
} from "./pgk-001-cp003-review-batch-v1";
import { PGK_001_CP003_SOURCE_IDS } from "./pgk-001-cp003-facts";

const qlNameV2 = Object.freeze({
  "PGK-001-QL-014": "Majha, Doaba and Malwa regions",
  "PGK-001-QL-015": "Region-place identification",
  "PGK-001-QL-016": "Elevation and relief pattern",
  "PGK-001-QL-017": "Punjab alluvial plain",
  "PGK-001-QL-018": "Shivalik and Kandi geography",
  "PGK-001-QL-019": "Piedmont, upland and floodplain landforms",
  "PGK-001-QL-020": "Regional-relief synthesis",
} as const);

type Override = Readonly<Partial<Pick<Pgk001Cp003ReviewQuestion,
  "stem" | "options" | "canonicalAnswer" | "explanation" | "factIds" | "sourceIds"
>>>;

const overrides: Readonly<Record<string, Override>> = Object.freeze({
  "PGK-001-CP003-Q001": {
    stem: "Punjab is broadly divided into which three regions?",
    options: ["Majha, Doaba and Malwa", "Majha, Doaba and Kandi", "Majha, Malwa and Kandi", "Doaba, Malwa and Kandi"],
    canonicalAnswer: "Majha, Doaba and Malwa",
    explanation: "Punjab is broadly divided into Majha, Doaba and Malwa. These are the state's three broad geographical-cultural regions.",
    factIds: ["gov-punjab-three-region"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab],
  },
  "PGK-001-CP003-Q002": {
    stem: "Which of the following is NOT one of Punjab's three broad regions?",
    options: ["Kandi", "Majha", "Doaba", "Malwa"],
    canonicalAnswer: "Kandi",
    explanation: "Majha, Doaba and Malwa are Punjab's three broad regions. Kandi is a foothill tract and is treated separately in physical geography.",
    factIds: ["gov-punjab-three-region", "pau-kandi-shivalik"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.pauKandi],
  },
  "PGK-001-CP003-Q003": {
    stem: "Which group contains one place each from Majha, Doaba and Malwa?",
    options: ["Tarn Taran, Jalandhar and Bathinda", "Tarn Taran, Ludhiana and Bathinda", "Jalandhar, Nawanshahr and Bathinda", "Bathinda, Sangrur and Ludhiana"],
    canonicalAnswer: "Tarn Taran, Jalandhar and Bathinda",
    explanation: "Tarn Taran is in Majha, Jalandhar is in Doaba and Bathinda is in Malwa.",
    factIds: ["tarn-taran-majha", "jalandhar-doaba", "bathinda-malwa"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan, PGK_001_CP003_SOURCE_IDS.jalandharPlan, PGK_001_CP003_SOURCE_IDS.bathindaPlan],
  },
  "PGK-001-CP003-Q004": {
    stem: "Which of the following groups consists only of places in the Malwa region?",
    options: ["Ludhiana, Bathinda and Sangrur", "Jalandhar, Bathinda and Sangrur", "Tarn Taran, Ludhiana and Bathinda", "Nawanshahr, Jalandhar and Ludhiana"],
    canonicalAnswer: "Ludhiana, Bathinda and Sangrur",
    explanation: "Ludhiana, Bathinda and Sangrur all lie in Malwa.",
    factIds: ["ludhiana-malwa", "bathinda-malwa", "sangrur-malwa"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.ludhianaPlan, PGK_001_CP003_SOURCE_IDS.bathindaPlan, PGK_001_CP003_SOURCE_IDS.sangrurPlan],
  },
  "PGK-001-CP003-Q005": {
    stem: "Which of the following place-region pairs is correctly matched?",
    options: ["Tarn Taran — Majha", "Bathinda — Doaba", "Jalandhar — Malwa", "Nawanshahr — Majha"],
    canonicalAnswer: "Tarn Taran — Majha",
    explanation: "Tarn Taran lies in Majha. Bathinda is in Malwa, while Jalandhar and Nawanshahr are in Doaba.",
    factIds: ["tarn-taran-majha", "bathinda-malwa", "jalandhar-doaba", "nawanshahr-doaba"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan, PGK_001_CP003_SOURCE_IDS.bathindaPlan, PGK_001_CP003_SOURCE_IDS.jalandharPlan, PGK_001_CP003_SOURCE_IDS.nawanshahrPlan],
  },
  "PGK-001-CP003-Q006": {
    stem: "Consider the following statements:\nI. Tarn Taran is in Majha.\nII. Jalandhar is in Doaba.\nIII. Bathinda is in Malwa.\nWhich of the statements given above are correct?",
    options: ["I only", "I and II only", "II and III only", "I, II and III"],
    canonicalAnswer: "I, II and III",
    explanation: "All three statements are correct. Tarn Taran belongs to Majha, Jalandhar to Doaba and Bathinda to Malwa.",
    factIds: ["tarn-taran-majha", "jalandhar-doaba", "bathinda-malwa"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan, PGK_001_CP003_SOURCE_IDS.jalandharPlan, PGK_001_CP003_SOURCE_IDS.bathindaPlan],
  },
  "PGK-001-CP003-Q007": {
    options: ["Majha", "Doaba", "Malwa", "Kandi"],
    explanation: "Tarn Taran is in the Majha region of Punjab, in the north-western part of the state.",
  },
  "PGK-001-CP003-Q008": {
    options: ["Doaba", "Majha", "Malwa", "Kandi"],
    explanation: "Jalandhar lies in the Doaba region of Punjab.",
  },
  "PGK-001-CP003-Q009": {
    options: ["Doaba", "Majha", "Malwa", "Kandi"],
    explanation: "Nawanshahr lies in the Doaba region of Punjab.",
  },
  "PGK-001-CP003-Q010": {
    options: ["Malwa", "Majha", "Doaba", "Kandi"],
    explanation: "Ludhiana lies in the Malwa region of Punjab.",
  },
  "PGK-001-CP003-Q011": {
    options: ["Malwa", "Doaba", "Majha", "Kandi"],
    explanation: "Bathinda lies in the Malwa region of southern Punjab.",
  },
  "PGK-001-CP003-Q016": {
    explanation: "Punjab's broad relief rises toward the northeast and falls toward the southwest. Elevation is around 180 metres in the southwest and exceeds 500 metres in parts of the northeast.",
  },
  "PGK-001-CP003-Q018": {
    stem: "Consider the following statements about Punjab's relief:\nI. Average elevation is about 300 metres.\nII. The southwest is around 180 metres above sea level.\nIII. Parts near the north-eastern border rise above 500 metres.\nWhich of the statements given above are correct?",
    explanation: "All three statements are correct. Together they show the broad rise in elevation from the southwest toward the northeast.",
  },
  "PGK-001-CP003-Q022": {
    stem: "The alluvial soils around Fatehgarh Sahib-Sirhind are:",
    explanation: "The alluvial soils around Fatehgarh Sahib-Sirhind are described as well drained and fertile.",
  },
  "PGK-001-CP003-Q023": {
    stem: "Sri Hargobindpur lies on the alluvial plain of:",
    explanation: "Sri Hargobindpur lies on the alluvial plain of Bari Doab. The land slopes toward the Beas floodplain.",
  },
  "PGK-001-CP003-Q025": {
    stem: "Pathankot's physical setting can be broadly divided into which three tracts?",
    explanation: "Pathankot has three broad physical tracts: Sub-Mountainous, Kandi and Plain.",
  },
  "PGK-001-CP003-Q026": {
    stem: "Ballowal Saunkhri lies in the heart of which area?",
    explanation: "Ballowal Saunkhri lies in the Kandi area, within the Shivalik foothill belt.",
  },
  "PGK-001-CP003-Q027": {
    explanation: "The Kandi area lies along Punjab's Shivalik foothill belt.",
  },
  "PGK-001-CP003-Q028": {
    stem: "Which of the following is NOT one of Pathankot's three broad physical tracts?",
    explanation: "Pathankot's three broad physical tracts are Sub-Mountainous, Kandi and Plain. Piedmont Plain is a different physiographic term.",
  },
  "PGK-001-CP003-Q029": {
    stem: "Ballowal Saunkhri lies in the:",
    explanation: "Ballowal Saunkhri lies in the Shivalik foothills and forms part of the Kandi belt.",
  },
  "PGK-001-CP003-Q041": {
    stem: "Consider the following statements:\nI. Punjab is broadly divided into Majha, Doaba and Malwa.\nII. The Kandi area lies along the Shivalik foothills.\nIII. Bathinda lies in the Malwa region.\nWhich of the statements given above are correct?",
    options: ["I only", "I and II only", "II and III only", "I, II and III"],
    canonicalAnswer: "I, II and III",
    explanation: "All three statements are correct. They connect Punjab's broad regions with its foothill relief and a representative Malwa location.",
    factIds: ["gov-punjab-three-region", "pau-kandi-shivalik", "bathinda-malwa"],
    sourceIds: [PGK_001_CP003_SOURCE_IDS.knowPunjab, PGK_001_CP003_SOURCE_IDS.pauKandi, PGK_001_CP003_SOURCE_IDS.bathindaPlan],
  },
});

function applyOverride(question: Pgk001Cp003ReviewQuestion): Pgk001Cp003ReviewQuestion {
  const override = overrides[question.questionId] ?? {};
  const options = override.options ? Object.freeze([...override.options]) : question.options;
  const canonicalAnswer = override.canonicalAnswer ?? question.canonicalAnswer;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`${question.questionId}: V2 canonical answer is missing from options`);

  return Object.freeze({
    ...question,
    ...override,
    qlName: qlNameV2[question.qlId as keyof typeof qlNameV2],
    options,
    canonicalAnswer,
    correctIndex,
    factIds: override.factIds ? Object.freeze([...override.factIds]) : question.factIds,
    sourceIds: override.sourceIds ? Object.freeze([...override.sourceIds]) : question.sourceIds,
  });
}

export const PGK_001_CP003_REVIEW_BATCH_V2: readonly Pgk001Cp003ReviewQuestion[] = Object.freeze(
  PGK_001_CP003_REVIEW_BATCH_V1.map(applyOverride),
);

export function auditPgk001Cp003ReviewBatchV2() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "puadh",
    "government of punjab",
    "know punjab",
    "puda",
    "master plan",
    "regional plan",
    "planning area",
    "state profile",
    "pau",
  ];

  for (const question of PGK_001_CP003_REVIEW_BATCH_V2) {
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

    const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation} ${question.qlName}`.toLowerCase();
    for (const term of bannedLearnerTerms) {
      if (learnerText.includes(term)) issues.push(`${question.questionId}: learner-facing source/region leakage: ${term}`);
    }
  }

  for (const qlId of Object.keys(qlNameV2)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP003_REVIEW_BATCH_V2.length,
    qlCount: Object.keys(qlNameV2).length,
  });
}
