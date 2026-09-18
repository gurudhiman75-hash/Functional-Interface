import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP011_FACT_IDS, PGK_001_CP011_SOURCE_IDS } from "./pgk-001-cp011-facts";

export type Pgk001Cp011ReviewQuestion = Readonly<{
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

export const PGK_001_CP011_QL_NAMES = Object.freeze({
  "PGK-001-QL-070": "Ghaznavids and Ghurids in Punjab",
  "PGK-001-QL-071": "Lahore and the Delhi Sultanate",
  "PGK-001-QL-072": "Lodi-Babur transition",
  "PGK-001-QL-073": "Akbar and Mughal Lahore",
  "PGK-001-QL-074": "Mughal monuments and Lahore",
  "PGK-001-QL-075": "Medieval use of the name Punjab",
  "PGK-001-QL-076": "Medieval Punjab chronology and synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP011_SOURCE_IDS;
const rows: readonly Row[] = [
  ["Easy", "Which city became a major Ghaznavid centre in Punjab?", ["Lahore", "Delhi", "Agra", "Jaipur"], "Lahore", "Lahore became a major centre of Ghaznavid power in Punjab after the decline of the Hindu Shahis.", ["ghaznavid-punjab-lahore"], [S.psebClass11Turks, S.lbsnaaMedievalIndia]],
  ["Easy", "Who captured Lahore in 1186 and ended Ghaznavid rule there?", ["Muhammad Ghori", "Qutb-ud-din Aibak", "Mahmud of Ghazni", "Babur"], "Muhammad Ghori", "Muhammad Ghori captured Lahore in 1186, ending Ghaznavid rule in the city.", ["ghori-captured-lahore-1186"], [S.psebClass11Turks, S.lbsnaaMedievalIndia]],
  ["Easy", "Who was the last Ghaznavid ruler of Lahore?", ["Khusrau Malik", "Ibrahim Lodi", "Bahlul Lodi", "Balban"], "Khusrau Malik", "Khusrau Malik was the last Ghaznavid ruler at Lahore before its capture by Muhammad Ghori.", ["ghori-captured-lahore-1186"], [S.lbsnaaMedievalIndia]],
  ["Medium", "The capture of Lahore in 1186 marked the end of which dynasty's rule there?", ["Ghaznavid dynasty", "Lodi dynasty", "Mughal dynasty", "Khalji dynasty"], "Ghaznavid dynasty", "Muhammad Ghori's capture of Lahore in 1186 ended Ghaznavid rule in the city.", ["ghori-captured-lahore-1186"], [S.lbsnaaMedievalIndia]],
  ["Medium", "Which ruler-event pair is correctly matched?", ["Muhammad Ghori — Capture of Lahore in 1186", "Babur — Capture of Lahore in 1186", "Khusrau Malik — Foundation of the Lodi dynasty", "Aibak — First Battle of Panipat"], "Muhammad Ghori — Capture of Lahore in 1186", "Muhammad Ghori captured Lahore in 1186 from Khusrau Malik.", ["ghori-captured-lahore-1186"], [S.lbsnaaMedievalIndia]],
  ["Hard", "Which sequence is chronologically correct?", ["Ghaznavid Lahore → Muhammad Ghori captures Lahore → Aibak establishes independent rule", "Aibak establishes independent rule → Ghaznavid Lahore → Muhammad Ghori captures Lahore", "Muhammad Ghori captures Lahore → Ghaznavid Lahore → Babur", "Babur → Ghaznavid Lahore → Muhammad Ghori"], "Ghaznavid Lahore → Muhammad Ghori captures Lahore → Aibak establishes independent rule", "Ghaznavid power in Lahore preceded Muhammad Ghori's conquest in 1186; Aibak established independent rule in 1206.", ["ghaznavid-punjab-lahore", "ghori-captured-lahore-1186", "aibak-lahore-1206-1210"], [S.psebClass11Turks, S.lbsnaaMedievalIndia]],

  ["Easy", "Who established independent rule in 1206 after the death of Muhammad Ghori?", ["Qutb-ud-din Aibak", "Iltutmish", "Balban", "Alauddin Khalji"], "Qutb-ud-din Aibak", "Qutb-ud-din Aibak established independent rule in 1206 after Muhammad Ghori's death.", ["aibak-lahore-1206-1210"], [S.psebClass11Turks]],
  ["Easy", "Qutb-ud-din Aibak died in which city?", ["Lahore", "Delhi", "Agra", "Multan"], "Lahore", "Qutb-ud-din Aibak died at Lahore in 1210.", ["aibak-lahore-1206-1210"], [S.psebClass11Turks]],
  ["Easy", "Qutb-ud-din Aibak died after an accident while playing:", ["Chaugan (polo)", "Wrestling", "Archery", "Hunting with falcons"], "Chaugan (polo)", "Aibak died from injuries suffered in a chaugan, or polo, accident at Lahore.", ["aibak-lahore-1206-1210"], [S.psebClass11Turks]],
  ["Easy", "Lahore was sacked by the Mongols in:", ["1241", "1186", "1398", "1526"], "1241", "Mongol forces sacked Lahore in 1241 during the Delhi Sultanate period.", ["mongol-sack-lahore-1241"], [S.psebClass11Turks, S.igncaLahore]],
  ["Medium", "Which event occurred first?", ["Aibak's death at Lahore", "Mongol sack of Lahore", "First Battle of Panipat", "Akbar's court at Lahore"], "Aibak's death at Lahore", "Aibak died in 1210; the Mongol sack came in 1241, Panipat in 1526 and Akbar's Lahore court began in 1584.", ["aibak-lahore-1206-1210", "mongol-sack-lahore-1241", "first-panipat-1526", "akbar-lahore-1584-1598"], [S.psebClass11Turks, S.psebClass12Mughals]],
  ["Hard", "Consider the following statements:\nI. Aibak established independent rule in 1206.\nII. Aibak died at Lahore in 1210.\nIII. Lahore was sacked by Mongols in 1241.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements correctly describe major Lahore events of the early Sultanate period.", ["aibak-lahore-1206-1210", "mongol-sack-lahore-1241"], [S.psebClass11Turks, S.igncaLahore]],

  ["Easy", "Who founded the Lodi dynasty?", ["Bahlul Lodi", "Ibrahim Lodi", "Daulat Khan Lodi", "Sikandar Lodi"], "Bahlul Lodi", "Bahlul Lodi founded the Lodi dynasty.", ["bahlul-lodi-founder"], [S.psebClass12Mughals]],
  ["Easy", "Who was defeated by Babur at the First Battle of Panipat?", ["Ibrahim Lodi", "Bahlul Lodi", "Daulat Khan Lodi", "Sher Shah Suri"], "Ibrahim Lodi", "Babur defeated Ibrahim Lodi at the First Battle of Panipat in 1526.", ["ibrahim-lodi-panipat-1526", "first-panipat-1526"], [S.psebClass12Mughals]],
  ["Easy", "The First Battle of Panipat was fought in:", ["1526", "1498", "1556", "1605"], "1526", "The First Battle of Panipat was fought in 1526 and established Babur's rule in north India.", ["first-panipat-1526"], [S.psebClass12Mughals]],
  ["Medium", "Daulat Khan Lodi held which position during the final years of Lodi rule?", ["Governor of Punjab", "Governor of Bengal", "Ruler of Mewar", "Governor of Gujarat"], "Governor of Punjab", "Daulat Khan Lodi was the governor of Punjab during the final Lodi phase.", ["daulat-khan-lodi-punjab"], [S.psebClass12Mughals]],
  ["Medium", "Which city did Babur capture during his campaigns before the First Battle of Panipat?", ["Lahore", "Jaipur", "Ujjain", "Patna"], "Lahore", "Babur captured Lahore during the campaigns that preceded his victory at Panipat.", ["babur-lahore-before-panipat"], [S.psebClass12Mughals, S.lahoreGovHistory]],
  ["Hard", "Which sequence is correct?", ["Daulat Khan Lodi governs Punjab → Babur captures Lahore → Babur defeats Ibrahim Lodi", "Babur defeats Ibrahim Lodi → Daulat Khan governs Punjab → Babur captures Lahore", "Babur captures Lahore → Bahlul Lodi founds the dynasty → Panipat", "Panipat → Babur captures Lahore → Lodi dynasty begins"], "Daulat Khan Lodi governs Punjab → Babur captures Lahore → Babur defeats Ibrahim Lodi", "Daulat Khan Lodi governed Punjab in the late Lodi period; Babur captured Lahore before defeating Ibrahim Lodi at Panipat in 1526.", ["daulat-khan-lodi-punjab", "babur-lahore-before-panipat", "first-panipat-1526"], [S.psebClass12Mughals, S.lahoreGovHistory]],

  ["Easy", "Which Mughal emperor held his court at Lahore from 1584 to 1598?", ["Akbar", "Babur", "Jahangir", "Aurangzeb"], "Akbar", "Akbar held his imperial court at Lahore from 1584 to 1598.", ["akbar-lahore-1584-1598"], [S.lahoreGovHistory, S.igncaLahore]],
  ["Medium", "For about how long did Akbar hold his court at Lahore?", ["Fourteen years", "Four years", "Twenty-five years", "Forty years"], "Fourteen years", "Akbar's Lahore court lasted from 1584 to 1598, about fourteen years.", ["akbar-lahore-1584-1598"], [S.lahoreGovHistory]],
  ["Medium", "Which fort was strengthened and rebuilt on a large scale under Akbar at Lahore?", ["Lahore Fort", "Gobindgarh Fort", "Qila Mubarak Bathinda", "Phillaur Fort"], "Lahore Fort", "Akbar strengthened Lahore Fort and the city's defences while his court was based there.", ["akbar-lahore-1584-1598"], [S.lahoreGovHistory, S.igncaLahore]],
  ["Medium", "Which city was the main trade centre of Punjab in standard sixteenth-century school history?", ["Lahore", "Amritsar", "Jalandhar", "Bathinda"], "Lahore", "Lahore was the principal trade centre of Punjab in the sixteenth-century setting used in Punjab school history.", ["lahore-sixteenth-century-centre"], [S.psebClass12Mughals]],
  ["Medium", "Which city was a major Islamic education centre of Punjab in the sixteenth century?", ["Lahore", "Patiala", "Amritsar", "Bathinda"], "Lahore", "Lahore was an important Islamic education centre in sixteenth-century Punjab.", ["lahore-sixteenth-century-centre"], [S.psebClass12Mughals]],
  ["Hard", "Consider the following statements about Lahore under Akbar:\nI. Akbar held his court there from 1584 to 1598.\nII. Lahore Fort was strengthened during his stay.\nIII. Lahore was a major trade centre.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements correctly describe Lahore's importance during Akbar's reign.", ["akbar-lahore-1584-1598", "lahore-sixteenth-century-centre"], [S.lahoreGovHistory, S.psebClass12Mughals]],

  ["Easy", "The tomb of Emperor Jahangir is located at:", ["Shahdara, Lahore", "Agra Fort", "Fatehpur Sikri", "Delhi Ridge"], "Shahdara, Lahore", "Jahangir's tomb is at Shahdara on the outskirts of Lahore.", ["jahangir-tomb-shahdara"], [S.lahoreGovHistory]],
  ["Easy", "Nur Jahan's tomb is located at:", ["Shahdara, Lahore", "Amritsar", "Sirhind", "Multan Fort"], "Shahdara, Lahore", "Nur Jahan's tomb is at Shahdara near Lahore.", ["nur-jahan-tomb-shahdara"], [S.lahoreGovHistory]],
  ["Easy", "The Shalimar Gardens at Lahore were built during the reign of:", ["Shah Jahan", "Babur", "Humayun", "Bahlul Lodi"], "Shah Jahan", "The Shalimar Gardens at Lahore belong to the reign of Shah Jahan.", ["shalimar-gardens-shah-jahan"], [S.lahoreGovHistory]],
  ["Easy", "The Badshahi Mosque at Lahore was built during the reign of:", ["Aurangzeb", "Akbar", "Babur", "Ibrahim Lodi"], "Aurangzeb", "The Badshahi Mosque was built at Lahore during Aurangzeb's reign.", ["badshahi-mosque-aurangzeb"], [S.lahoreGovHistory]],
  ["Medium", "Which monument-ruler pair is correctly matched?", ["Shalimar Gardens, Lahore — Shah Jahan", "Badshahi Mosque — Babur", "Jahangir's tomb — Aurangzeb", "Nur Jahan's tomb — Bahlul Lodi"], "Shalimar Gardens, Lahore — Shah Jahan", "Lahore's Shalimar Gardens were built in Shah Jahan's reign.", ["shalimar-gardens-shah-jahan"], [S.lahoreGovHistory]],
  ["Hard", "Which sequence follows the Mughal rulers in correct order?", ["Akbar → Jahangir → Shah Jahan → Aurangzeb", "Jahangir → Akbar → Aurangzeb → Shah Jahan", "Shah Jahan → Akbar → Jahangir → Aurangzeb", "Aurangzeb → Shah Jahan → Akbar → Jahangir"], "Akbar → Jahangir → Shah Jahan → Aurangzeb", "Akbar was followed by Jahangir, then Shah Jahan and Aurangzeb.", ["akbar-lahore-1584-1598", "jahangir-tomb-shahdara", "shalimar-gardens-shah-jahan", "badshahi-mosque-aurangzeb"], [S.lahoreGovHistory]],

  ["Easy", "Which traveller's writings contain an early documented use of the word Punjab?", ["Ibn Battuta", "Megasthenes", "Fa-Hien", "Al-Biruni"], "Ibn Battuta", "The word Punjab appears in the writings of Ibn Battuta, who visited the region in the fourteenth century.", ["ibn-battuta-punjab-term"], [S.govtPunjabHistory]],
  ["Easy", "Ibn Battuta visited the Punjab region in which century?", ["14th century", "10th century", "16th century", "18th century"], "14th century", "Ibn Battuta visited the region in the fourteenth century.", ["ibn-battuta-punjab-term"], [S.govtPunjabHistory]],
  ["Medium", "Which work dated 1580 contains the name Punjab?", ["Tarikh-e-Sher Shah Suri", "Arthashastra", "Rajatarangini", "Indica"], "Tarikh-e-Sher Shah Suri", "Tarikh-e-Sher Shah Suri, dated 1580, uses the name Punjab.", ["tarikh-sher-shah-punjab-term"], [S.govtPunjabHistory]],
  ["Medium", "Who wrote the Ain-i-Akbari?", ["Abul Fazl", "Badauni", "Ibn Battuta", "Amir Khusrau"], "Abul Fazl", "Abul Fazl wrote the Ain-i-Akbari, an important source for Akbar's empire.", ["ain-akbari-punjab-term"], [S.govtPunjabHistory]],
  ["Medium", "Which work uses Punjab while describing the Lahore and Multan region?", ["Ain-i-Akbari", "Indica", "Milindapanha", "Baburnama only"], "Ain-i-Akbari", "Ain-i-Akbari uses Punjab in describing territory connected with the Lahore and Multan provinces.", ["ain-akbari-punjab-term"], [S.govtPunjabHistory]],
  ["Hard", "Which sequence correctly orders these documentary references?", ["Ibn Battuta → Tarikh-e-Sher Shah Suri → Ain-i-Akbari", "Ain-i-Akbari → Ibn Battuta → Tarikh-e-Sher Shah Suri", "Tarikh-e-Sher Shah Suri → Ibn Battuta → Ain-i-Akbari", "Ain-i-Akbari → Tarikh-e-Sher Shah Suri → Ibn Battuta"], "Ibn Battuta → Tarikh-e-Sher Shah Suri → Ain-i-Akbari", "Ibn Battuta's fourteenth-century reference predates the sixteenth-century Tarikh-e-Sher Shah Suri and Ain-i-Akbari.", ["ibn-battuta-punjab-term", "tarikh-sher-shah-punjab-term", "ain-akbari-punjab-term"], [S.govtPunjabHistory]],

  ["Hard", "Which is the correct chronological order?", ["Muhammad Ghori captures Lahore → Aibak's rule → Mongol sack of Lahore → First Battle of Panipat → Akbar's Lahore court", "Aibak's rule → Muhammad Ghori captures Lahore → Panipat → Mongol sack → Akbar", "Mongol sack → Ghori captures Lahore → Aibak → Akbar → Panipat", "Panipat → Ghori captures Lahore → Aibak → Mongol sack → Akbar"], "Muhammad Ghori captures Lahore → Aibak's rule → Mongol sack of Lahore → First Battle of Panipat → Akbar's Lahore court", "The dates are 1186, 1206, 1241, 1526 and 1584 respectively.", ["ghori-captured-lahore-1186", "aibak-lahore-1206-1210", "mongol-sack-lahore-1241", "first-panipat-1526", "akbar-lahore-1584-1598"], [S.psebClass11Turks, S.psebClass12Mughals, S.lahoreGovHistory]],
  ["Hard", "Which set is correctly matched?", ["Khusrau Malik — last Ghaznavid at Lahore; Daulat Khan Lodi — governor of Punjab; Babur — victor at Panipat", "Khusrau Malik — Mughal emperor; Daulat Khan — founder of Lodi dynasty; Babur — Mongol commander at Lahore", "Aibak — Lodi founder; Ibrahim Lodi — Ghaznavid ruler; Akbar — Ghurid conqueror", "Mahmud of Ghazni — Mughal emperor; Babur — Delhi Sultan; Akbar — Lodi ruler"], "Khusrau Malik — last Ghaznavid at Lahore; Daulat Khan Lodi — governor of Punjab; Babur — victor at Panipat", "All three ruler-role relations in the first set are correct.", ["ghori-captured-lahore-1186", "daulat-khan-lodi-punjab", "first-panipat-1526"], [S.lbsnaaMedievalIndia, S.psebClass12Mughals]],
  ["Hard", "Consider the following statements:\nI. Lahore was sacked by Mongols in 1241.\nII. Babur defeated Ibrahim Lodi in 1526.\nIII. Akbar held his court at Lahore from 1584 to 1598.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements are correct and span the Sultanate-to-Mughal transition in Punjab.", ["mongol-sack-lahore-1241", "first-panipat-1526", "akbar-lahore-1584-1598"], [S.igncaLahore, S.psebClass12Mughals, S.lahoreGovHistory]],
  ["Hard", "Which ruler-place relation is incorrectly matched?", ["Shah Jahan — Badshahi Mosque", "Akbar — Lahore Fort", "Jahangir — tomb at Shahdara", "Aurangzeb — Badshahi Mosque"], "Shah Jahan — Badshahi Mosque", "The Badshahi Mosque belongs to Aurangzeb's reign. Shah Jahan's Lahore legacy includes the Shalimar Gardens.", ["shalimar-gardens-shah-jahan", "badshahi-mosque-aurangzeb"], [S.lahoreGovHistory]],
  ["Hard", "Which statement correctly distinguishes the medieval geography used in this CP?", ["Lahore belongs to historical Punjab but lies in present-day Pakistan", "Lahore is in present-day Indian Punjab", "Lahore is in present-day Haryana", "Lahore is outside the historical Punjab region"], "Lahore belongs to historical Punjab but lies in present-day Pakistan", "Lahore is central to medieval Punjab history, but it is located in present-day Pakistan.", ["akbar-lahore-1584-1598"], [S.lahoreGovHistory]],
  ["Hard", "Which sequence correctly pairs medieval Punjab phases with major events?", ["Ghurid — Lahore 1186; Sultanate — Mongol sack 1241; Mughal — Akbar's Lahore court", "Ghurid — Panipat 1526; Sultanate — Akbar's Lahore court; Mughal — Lahore 1186", "Ghaznavid — Badshahi Mosque; Lodi — Mongol sack; Mughal — Aibak's rule", "Sultanate — Ibn Battuta before Ghaznavids; Mughal — Ghori's conquest"], "Ghurid — Lahore 1186; Sultanate — Mongol sack 1241; Mughal — Akbar's Lahore court", "The first sequence correctly places each event within its medieval political phase.", ["ghori-captured-lahore-1186", "mongol-sack-lahore-1241", "akbar-lahore-1584-1598"], [S.psebClass11Turks, S.lahoreGovHistory]],
] as const;

function qlIdFor(index: number) {
  return `PGK-001-QL-${String(70 + Math.floor(index / 6)).padStart(3, "0")}` as keyof typeof PGK_001_CP011_QL_NAMES;
}

export const PGK_001_CP011_REVIEW_BATCH_V1: readonly Pgk001Cp011ReviewQuestion[] = Object.freeze(rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP011 row ${index + 1} is missing its canonical answer`);
  const qlId = qlIdFor(index);
  return Object.freeze({
    questionId: `PGK-001-CP011-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP011_QL_NAMES[qlId],
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

export function auditPgk001Cp011ReviewBatchV1() {
  const issues: string[] = [];
  const validFactIds = new Set(PGK_001_CP011_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to",
    "government of punjab", "pseb", "ignca", "report", "website", "source",
    "the correct answer is", "the correct option", "the other options",
    "this question tests", "review batch", "generator", "identify it",
  ];
  for (const question of PGK_001_CP011_REVIEW_BATCH_V1) {
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
  for (const qlId of Object.keys(PGK_001_CP011_QL_NAMES)) if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP011_REVIEW_BATCH_V1.length });
}
