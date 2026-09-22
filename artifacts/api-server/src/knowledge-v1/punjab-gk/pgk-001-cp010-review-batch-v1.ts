import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP010_FACT_IDS, PGK_001_CP010_SOURCE_IDS } from "./pgk-001-cp010-facts";

export type Pgk001Cp010ReviewQuestion = Readonly<{
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

export const PGK_001_CP010_QL_NAMES = Object.freeze({
  "PGK-001-QL-063": "Harappan sites of present-day Punjab",
  "PGK-001-QL-064": "Vedic and ancient names of Punjab",
  "PGK-001-QL-065": "Taxila and Alexander's entry into Punjab",
  "PGK-001-QL-066": "Porus, Hydaspes and the Beas limit",
  "PGK-001-QL-067": "Mauryan-era Punjab and Taxila relations",
  "PGK-001-QL-068": "Kushan Punjab and Sanghol",
  "PGK-001-QL-069": "Ancient Punjab chronology and synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP010_SOURCE_IDS;
const rows: readonly Row[] = [
  ["Easy", "Which present-day Punjab city is an important Harappan archaeological site?", ["Rupnagar", "Patiala", "Barnala", "Moga"], "Rupnagar", "Rupnagar, also called Ropar, is an important Harappan archaeological site in present-day Punjab.", ["harappan-rupnagar"], [S.asiPunjabSites, S.psebClass6]],
  ["Easy", "Sanghol archaeological site is located in which district?", ["Fatehgarh Sahib", "Sangrur", "Ludhiana", "Rupnagar"], "Fatehgarh Sahib", "Sanghol is in Fatehgarh Sahib district. Excavations there reveal a long sequence beginning in the late Harappan period.", ["harappan-sanghol"], [S.sangholMuseum, S.nmaSanghol]],
  ["Easy", "Rohira, an ancient site of Punjab, is located in which district?", ["Sangrur", "Pathankot", "Amritsar", "Faridkot"], "Sangrur", "Rohira is an archaeological site in Sangrur district with Harappan-period remains.", ["harappan-rohira"], [S.psebClass6]],
  ["Easy", "Sunet archaeological site is located in which district?", ["Ludhiana", "Bathinda", "Hoshiarpur", "Patiala"], "Ludhiana", "Sunet is an ancient site in Ludhiana district and has yielded remains from the later Harappan phase.", ["harappan-sunet"], [S.psebClass6, S.asiPunjabSites]],
  ["Medium", "Kotla Nihang Khan, an ancient Punjab site, is in which district?", ["Rupnagar", "Fazilka", "Mansa", "Kapurthala"], "Rupnagar", "Kotla Nihang Khan is an archaeological site in Rupnagar district.", ["harappan-kotla"], [S.psebClass6]],
  ["Medium", "Which ancient site-district pair is correctly matched?", ["Sanghol — Fatehgarh Sahib", "Rohira — Pathankot", "Sunet — Bathinda", "Kotla Nihang Khan — Fazilka"], "Sanghol — Fatehgarh Sahib", "Sanghol is in Fatehgarh Sahib. Rohira is in Sangrur, Sunet in Ludhiana and Kotla Nihang Khan in Rupnagar.", ["harappan-sanghol", "harappan-rohira", "harappan-sunet", "harappan-kotla"], [S.psebClass6, S.nmaSanghol]],

  ["Easy", "What name is used for Punjab in the Vedic tradition?", ["Sapta Sindhu", "Pentapotamia", "Malwa", "Doaba"], "Sapta Sindhu", "Vedic literature refers to the Punjab region as Sapta Sindhu, the land of seven rivers.", ["name-sapta-sindhu"], [S.psebClass9Punjab]],
  ["Easy", "Which ancient name of Punjab means the land of five rivers?", ["Panchnad", "Sapta Sindhu", "Aryavarta", "Magadha"], "Panchnad", "Panchnad is an ancient name for the Punjab region and literally refers to five rivers.", ["name-panchnad"], [S.psebClass9Punjab]],
  ["Easy", "Greek writers used which name for the land of five rivers?", ["Pentapotamia", "Panchnad", "Sapta Sindhu", "Gandhara"], "Pentapotamia", "Greek writers used the name Pentapotamia for the land of five rivers.", ["name-pentapotamia"], [S.psebClass9Punjab]],
  ["Medium", "Which pair is correctly matched?", ["Sapta Sindhu — Vedic Punjab", "Pentapotamia — Mauryan capital", "Panchnad — Greek ruler", "Taxila — river name"], "Sapta Sindhu — Vedic Punjab", "Sapta Sindhu is the Vedic name used for the Punjab region.", ["name-sapta-sindhu"], [S.psebClass9Punjab]],
  ["Medium", "Which name was given to Punjab by Greek writers?", ["Pentapotamia", "Panchnad", "Sapta Sindhu", "Brahmavarta only"], "Pentapotamia", "Pentapotamia is the Greek name used for Punjab as the land of five rivers.", ["name-pentapotamia"], [S.psebClass9Punjab]],
  ["Hard", "Consider the following pairs:\nI. Sapta Sindhu — Vedic tradition\nII. Panchnad — ancient Indian tradition\nIII. Pentapotamia — Greek usage\nWhich of the pairs given above are correctly matched?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three pairs correctly represent historical names used for the Punjab region in different traditions.", ["name-sapta-sindhu", "name-panchnad", "name-pentapotamia"], [S.psebClass9Punjab]],

  ["Easy", "Taxila was an important ancient city of which historical region?", ["North-western Punjab", "Deccan", "Bengal delta", "Tamilakam"], "North-western Punjab", "Taxila was one of the major ancient cities of the north-western Punjab region. It lies in present-day Pakistan.", ["taxila-ancient-city-historical-punjab"], [S.psebClass6]],
  ["Easy", "Who ruled Taxila when Alexander entered the Punjab region?", ["Ambhi", "Porus", "Kanishka", "Ashoka"], "Ambhi", "Ambhi, called Taxiles in Greek accounts, ruled Taxila at the time of Alexander's campaign.", ["taxila-ambhi"], [S.britannicaAlexander]],
  ["Easy", "Alexander entered the Punjab region in:", ["326 BCE", "321 BCE", "261 BCE", "78 CE"], "326 BCE", "Alexander entered the Punjab region in 326 BCE during his Indian campaign.", ["alexander-326-bce"], [S.psebClass6, S.britannicaAlexander]],
  ["Medium", "Taxila is located today in which country?", ["Pakistan", "India", "Nepal", "Afghanistan"], "Pakistan", "Ancient Taxila belonged to the north-western Punjab cultural region and is now in Pakistan.", ["taxila-ancient-city-historical-punjab"], [S.psebClass6]],
  ["Medium", "Which ruler of Taxila cooperated with Alexander during his Punjab campaign?", ["Ambhi", "Porus", "Chandragupta Maurya", "Kanishka"], "Ambhi", "Ambhi of Taxila supported Alexander, while Porus resisted him at the Hydaspes.", ["taxila-ambhi", "porus-hydaspes-jhelum"], [S.britannicaAlexander]],
  ["Hard", "Which statement about Taxila is correct?", ["It was an ancient north-western Punjab city and is now in Pakistan", "It was a Harappan site in present-day Ludhiana", "It was the capital of the Sikh Empire", "It stood on the Beas in present-day Amritsar"], "It was an ancient north-western Punjab city and is now in Pakistan", "Taxila was a major ancient city of historical north-western Punjab. Modern political boundaries place it in Pakistan.", ["taxila-ancient-city-historical-punjab"], [S.psebClass6]],

  ["Easy", "Porus fought Alexander on the banks of which ancient river?", ["Hydaspes", "Hyphasis", "Acesines", "Indus"], "Hydaspes", "Porus fought Alexander at the Hydaspes in 326 BCE.", ["porus-hydaspes-jhelum"], [S.britannicaAlexander]],
  ["Easy", "Hydaspes is the ancient Greek name of which river?", ["Jhelum", "Beas", "Ravi", "Sutlej"], "Jhelum", "The Hydaspes is the modern Jhelum River.", ["porus-hydaspes-jhelum"], [S.britannicaAlexander]],
  ["Easy", "Which ruler offered strong resistance to Alexander at the Hydaspes?", ["Porus", "Ambhi", "Kanishka", "Bimbisara"], "Porus", "Porus resisted Alexander at the Battle of the Hydaspes in 326 BCE.", ["porus-hydaspes-jhelum"], [S.psebClass6, S.britannicaAlexander]],
  ["Easy", "Alexander's army refused to advance beyond which river?", ["Beas", "Jhelum", "Chenab", "Ravi"], "Beas", "Alexander reached the Hyphasis, identified with the Beas, where his army refused to advance farther east.", ["hyphasis-beas-limit"], [S.psebClass6, S.britannicaAlexander]],
  ["Medium", "Hyphasis corresponds to which modern river?", ["Beas", "Jhelum", "Chenab", "Indus"], "Beas", "Hyphasis is the ancient Greek name used for the Beas River in accounts of Alexander's campaign.", ["hyphasis-beas-limit"], [S.britannicaAlexander]],
  ["Hard", "Which sequence is correct for Alexander's Punjab campaign?", ["Taxila → Hydaspes battle → advance to Beas", "Beas → Taxila → Hydaspes battle", "Hydaspes battle → Taxila → Indus crossing", "Mauryan conquest → Taxila → Beas"], "Taxila → Hydaspes battle → advance to Beas", "Alexander entered Taxila, fought Porus at the Hydaspes, and later reached the Beas where his army refused to continue.", ["taxila-ambhi", "porus-hydaspes-jhelum", "hyphasis-beas-limit"], [S.britannicaAlexander]],

  ["Easy", "Who founded the Mauryan Empire around 321 BCE?", ["Chandragupta Maurya", "Ashoka", "Kanishka", "Porus"], "Chandragupta Maurya", "Chandragupta Maurya established the Mauryan Empire around 321 BCE.", ["maurya-chandragupta-321"], [S.psebClass6]],
  ["Easy", "Chanakya is also known as:", ["Kautilya", "Megasthenes", "Panini", "Asvaghosha"], "Kautilya", "Chanakya is also known as Kautilya; the PSEB text attributes the Arthashastra to him.", ["chanakya-kautilya-taxila", "arthashastra-kautilya"], [S.psebClass6]],
  ["Easy", "Which work is attributed to Kautilya?", ["Arthashastra", "Indica", "Milindapanha", "Rajatarangini"], "Arthashastra", "The Arthashastra is attributed to Kautilya, also known as Chanakya.", ["arthashastra-kautilya"], [S.psebClass6]],
  ["Easy", "Who wrote the Indica?", ["Megasthenes", "Kautilya", "Kanishka", "Porus"], "Megasthenes", "Megasthenes, the Greek ambassador at Chandragupta Maurya's court, wrote the Indica.", ["indica-megasthenes"], [S.psebClass6]],
  ["Medium", "Chanakya was a teacher at which ancient centre in standard Punjab school history?", ["Taxila", "Pataliputra", "Ujjain", "Mathura"], "Taxila", "Punjab school history places Chanakya as a teacher at Taxila before his role in the rise of Chandragupta Maurya.", ["chanakya-kautilya-taxila", "taxila-ancient-city-historical-punjab"], [S.psebClass6]],
  ["Hard", "Which pair is correctly matched?", ["Kautilya — Arthashastra", "Megasthenes — Arthashastra", "Porus — Indica", "Kanishka — Indica"], "Kautilya — Arthashastra", "Kautilya is credited with the Arthashastra, while Megasthenes wrote the Indica.", ["arthashastra-kautilya", "indica-megasthenes"], [S.psebClass6]],

  ["Easy", "Who was the most famous ruler of the Kushan dynasty in standard school history?", ["Kanishka", "Porus", "Ambhi", "Bindusara"], "Kanishka", "Kanishka is the best-known Kushan ruler in standard school-level ancient Indian history.", ["kushan-kanishka"], [S.psebClass6]],
  ["Easy", "Which Punjab archaeological site became an important Buddhist centre during the Kushan period?", ["Sanghol", "Rohira", "Abohar", "Moga"], "Sanghol", "Sanghol flourished as a major Buddhist and artistic centre during the Kushan period.", ["sanghol-kushan-buddhist"], [S.nmaSanghol]],
  ["Medium", "The famous Kushan-period sculptures from Sanghol belong to which school of art?", ["Mathura school", "Pala school", "Chola school", "Mughal school"], "Mathura school", "The carved sculptures from Sanghol show the style of the Mathura school of art.", ["sanghol-mathura-school"], [S.nmaSanghol]],
  ["Medium", "Which religious structure is a major archaeological feature at Sanghol?", ["Buddhist stupa", "Rock-cut Jain cave", "Mughal mosque", "Sikh fort"], "Buddhist stupa", "Sanghol contains important Buddhist stupa and monastic remains from the ancient period.", ["sanghol-kushan-buddhist"], [S.asiPunjabSites, S.nmaSanghol]],
  ["Medium", "Sanghol's major Buddhist and artistic phase belongs to which dynasty?", ["Kushan", "Lodi", "Tughlaq", "Sikh Misls"], "Kushan", "Sanghol was a prominent centre of Buddhist architecture and art during the Kushan period.", ["sanghol-kushan-buddhist", "kushan-kanishka"], [S.nmaSanghol]],
  ["Hard", "Which combination is correctly matched?", ["Sanghol — Kushan period — Mathura school", "Rupnagar — Mughal period — Gandhara school", "Rohira — Gupta period — Chola school", "Sunet — Lodi period — Pala school"], "Sanghol — Kushan period — Mathura school", "Sanghol is especially important for Kushan-period Buddhist remains and Mathura-school sculptures.", ["sanghol-kushan-buddhist", "sanghol-mathura-school"], [S.nmaSanghol]],

  ["Hard", "Which is the correct chronological order?", ["Harappan culture → Vedic period → Alexander's invasion → Mauryan Empire → Kushan period", "Vedic period → Harappan culture → Mauryan Empire → Alexander's invasion → Kushan period", "Alexander's invasion → Harappan culture → Vedic period → Kushan period → Mauryan Empire", "Mauryan Empire → Harappan culture → Alexander's invasion → Vedic period → Kushan period"], "Harappan culture → Vedic period → Alexander's invasion → Mauryan Empire → Kushan period", "The broad sequence is Harappan, Vedic, Alexander's invasion in 326 BCE, Mauryan rule from the late fourth century BCE, and then the Kushan period.", ["harappan-rupnagar", "name-sapta-sindhu", "alexander-326-bce", "maurya-chandragupta-321", "kushan-kanishka"], [S.psebClass6, S.psebClass9Punjab]],
  ["Hard", "Which set is correctly matched?", ["Rupnagar — Harappan; Taxila — ancient north-western Punjab; Sanghol — Kushan Buddhist centre", "Rupnagar — Kushan; Taxila — present-day Indian Punjab; Sanghol — Mughal centre", "Rupnagar — Lodi; Taxila — Harappan site in Ludhiana; Sanghol — Sikh capital", "Rupnagar — Gupta only; Taxila — Beas river; Sanghol — Delhi Sultanate"], "Rupnagar — Harappan; Taxila — ancient north-western Punjab; Sanghol — Kushan Buddhist centre", "Rupnagar is a Harappan site in present Punjab, Taxila belongs to historical north-western Punjab, and Sanghol was a major Kushan Buddhist centre.", ["harappan-rupnagar", "taxila-ancient-city-historical-punjab", "sanghol-kushan-buddhist"], [S.asiPunjabSites, S.psebClass6, S.nmaSanghol]],
  ["Hard", "Consider the following statements:\nI. Hydaspes is the Jhelum.\nII. Hyphasis is the Beas.\nIII. Alexander entered Punjab in 326 BCE.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements are correct and describe key river and date relations from Alexander's Punjab campaign.", ["porus-hydaspes-jhelum", "hyphasis-beas-limit", "alexander-326-bce"], [S.britannicaAlexander]],
  ["Hard", "Consider the following pairs:\nI. Sapta Sindhu — Vedic Punjab\nII. Hydaspes — Jhelum\nIII. Kautilya — Arthashastra\nIV. Sanghol — Mathura school\nWhich of the pairs given above are correctly matched?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four pairs are correctly matched and connect major phases of ancient Punjab history.", ["name-sapta-sindhu", "porus-hydaspes-jhelum", "arthashastra-kautilya", "sanghol-mathura-school"], [S.psebClass9Punjab, S.britannicaAlexander, S.psebClass6, S.nmaSanghol]],
  ["Hard", "Which statement correctly distinguishes present-day Punjab from historical Punjab?", ["Rupnagar and Sanghol are in present-day Indian Punjab, while Taxila is part of historical Punjab and lies in Pakistan today", "Taxila and Sanghol are both in present-day Indian Punjab", "Rupnagar lies in Pakistan while Taxila lies in Indian Punjab", "All three places are in the same present-day Indian district"], "Rupnagar and Sanghol are in present-day Indian Punjab, while Taxila is part of historical Punjab and lies in Pakistan today", "Rupnagar and Sanghol are archaeological sites in present-day Punjab. Taxila belonged to the historical Punjab region but is now in Pakistan.", ["harappan-rupnagar", "harappan-sanghol", "taxila-ancient-city-historical-punjab"], [S.asiPunjabSites, S.psebClass6]],
  ["Hard", "Which sequence correctly connects ruler, event and place?", ["Alexander — battle with Porus — Hydaspes/Jhelum", "Kanishka — battle with Porus — Beas", "Chandragupta Maurya — Battle of Hydaspes — Sanghol", "Ambhi — founded Mauryan Empire — Rupnagar"], "Alexander — battle with Porus — Hydaspes/Jhelum", "Alexander fought Porus at the Hydaspes, the modern Jhelum River, during his 326 BCE Punjab campaign.", ["alexander-326-bce", "porus-hydaspes-jhelum"], [S.britannicaAlexander]],
] as const;

function qlIdFor(index: number) { return `PGK-001-QL-${String(63 + Math.floor(index / 6)).padStart(3, "0")}` as keyof typeof PGK_001_CP010_QL_NAMES; }

export const PGK_001_CP010_REVIEW_BATCH_V1: readonly Pgk001Cp010ReviewQuestion[] = Object.freeze(rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP010 row ${index + 1} is missing its canonical answer`);
  const qlId = qlIdFor(index);
  return Object.freeze({ questionId: `PGK-001-CP010-Q${String(index + 1).padStart(3, "0")}`, qlId, qlName: PGK_001_CP010_QL_NAMES[qlId], difficulty, stem, options: Object.freeze([...options]), correctIndex, canonicalAnswer, explanation, factIds: Object.freeze([...factIds]), sourceIds: Object.freeze([...sourceIds]), reviewOnly: true as const, runtimeRegistered: false as const });
}));

export function auditPgk001Cp010ReviewBatchV1() {
  const issues: string[] = [];
  if (PGK_001_CP010_REVIEW_BATCH_V1.length !== 42) {
    issues.push(`Expected 42 questions, found ${PGK_001_CP010_REVIEW_BATCH_V1.length}`);
  }
  const validFactIds = new Set(PGK_001_CP010_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = ["government of punjab", "pseb", "archaeological survey of india", "britannica", "source", "report", "associated with", "linked with", "known for", "the correct answer is", "the correct option", "the other options", "this question tests", "review batch", "generator", "identify it"];
  for (const question of PGK_001_CP010_REVIEW_BATCH_V1) {
    const stem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(stem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(stem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (!(question.qlId in PGK_001_CP010_QL_NAMES)) issues.push(`${question.questionId}: QL outside CP010 ownership: ${question.qlId}`);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact ${factId}`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }
  for (const qlId of Object.keys(PGK_001_CP010_QL_NAMES)) if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP010_REVIEW_BATCH_V1.length });
}
