import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP013_FACT_IDS, PGK_001_CP013_SOURCE_IDS } from "./pgk-001-cp013-facts";

export type Pgk001Cp013ReviewQuestion = Readonly<{
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

export const PGK_001_CP013_QL_NAMES = Object.freeze({
  "PGK-001-QL-084": "Early life, Nanded and mission to Punjab",
  "PGK-001-QL-085": "Early campaigns: Sonipat, Samana, Kapuri, Sadhaura",
  "PGK-001-QL-086": "Chappar Chiri, Wazir Khan and Sirhind",
  "PGK-001-QL-087": "Lohgarh, coinage and agrarian administration",
  "PGK-001-QL-088": "Leadership, Mughal response and causes of setback",
  "PGK-001-QL-089": "Gurdas Nangal, capture and 1716 execution",
  "PGK-001-QL-090": "Banda Singh Bahadur chronology and synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP013_SOURCE_IDS;

const rows: readonly Row[] = [
  ["Easy", "What was the childhood name of Banda Singh Bahadur?", ["Lachhman Dev", "Madho Das", "Ajay Singh", "Baj Singh"], "Lachhman Dev", "Punjab school history gives Lachhman Dev as Banda Singh Bahadur's childhood name.", ["banda-early-names"], [S.psebBandaLesson]],
  ["Easy", "By which name was Banda Singh Bahadur known as an ascetic before meeting Guru Gobind Singh?", ["Madho Das", "Lachhman Dev", "Ajay Singh", "Binod Singh"], "Madho Das", "Before meeting Guru Gobind Singh at Nanded, he was an ascetic known as Madho Das.", ["banda-early-names", "banda-nanded-1708"], [S.psebBandaLesson, S.sgpcGuruGobindSingh]],
  ["Easy", "Where did Madho Das meet Guru Gobind Singh in 1708?", ["Nanded", "Anandpur Sahib", "Amritsar", "Sirhind"], "Nanded", "Madho Das met Guru Gobind Singh at Nanded in 1708.", ["banda-nanded-1708"], [S.psebBandaLesson, S.sgpcGuruGobindSingh]],
  ["Easy", "In which year did Guru Gobind Singh meet Madho Das at Nanded?", ["1708", "1699", "1709", "1710"], "1708", "The meeting at Nanded took place in 1708, shortly before Banda Singh Bahadur left for Punjab.", ["banda-nanded-1708"], [S.psebClass12Model, S.sgpcGuruGobindSingh]],
  ["Medium", "Who sent Banda Singh Bahadur toward Punjab to lead the struggle against Mughal provincial power?", ["Guru Gobind Singh", "Guru Tegh Bahadur", "Bahadur Shah I", "Farrukh Siyar"], "Guru Gobind Singh", "Guru Gobind Singh directed Banda Singh Bahadur to proceed to Punjab and lead the struggle there.", ["banda-nanded-1708"], [S.psebBandaLesson, S.sgpcGuruGobindSingh]],
  ["Hard", "Which sequence correctly shows Banda Singh Bahadur's early transformation?", ["Lachhman Dev → Madho Das → meeting at Nanded → mission to Punjab", "Madho Das → Lachhman Dev → Sirhind → Nanded", "Lachhman Dev → Sirhind → Madho Das → Nanded", "Nanded → Lachhman Dev → Madho Das → Samana"], "Lachhman Dev → Madho Das → meeting at Nanded → mission to Punjab", "He is described first as Lachhman Dev, later as the ascetic Madho Das, and after the Nanded meeting he was sent toward Punjab.", ["banda-early-names", "banda-nanded-1708"], [S.psebBandaLesson, S.sgpcGuruGobindSingh]],

  ["Easy", "Which place was one of Banda Singh Bahadur's early campaign points in 1709?", ["Sonipat", "Panipat", "Lahore", "Multan"], "Sonipat", "Sonipat was one of the early campaign points in Banda Singh Bahadur's 1709 advance.", ["banda-sonipat-1709"], [S.psebBandaLesson]],
  ["Easy", "Banda Singh Bahadur attacked Samana in which year?", ["1709", "1708", "1710", "1715"], "1709", "Samana was attacked in 1709 and became one of Banda Singh Bahadur's earliest important victories.", ["banda-samana-1709"], [S.psebBandaLesson]],
  ["Medium", "Who ruled Sadhaura during Banda Singh Bahadur's early campaign?", ["Usman Khan", "Wazir Khan", "Qadam-ud-Din", "Abdus Samad Khan"], "Usman Khan", "Usman Khan was the ruler of Sadhaura during this phase of Banda Singh Bahadur's campaign.", ["banda-sadhaura-usman-khan"], [S.psebBandaLesson]],
  ["Medium", "Who was the ruler of Kapuri during Banda Singh Bahadur's campaign?", ["Qadam-ud-Din", "Usman Khan", "Wazir Khan", "Khusrau Malik"], "Qadam-ud-Din", "Punjab school history names Qadam-ud-Din as the ruler of Kapuri at the time.", ["banda-kapuri-qadam-ud-din"], [S.psebBandaLesson]],
  ["Medium", "Which place was one of Banda Singh Bahadur's earliest major victories before Sirhind?", ["Samana", "Delhi", "Lahore", "Gwalior"], "Samana", "Samana fell in 1709 and was an important early success before the 1710 campaign against Sirhind.", ["banda-samana-1709"], [S.psebBandaLesson]],
  ["Hard", "Which pair is correctly matched?", ["Sadhaura — Usman Khan", "Kapuri — Wazir Khan", "Sirhind — Qadam-ud-Din", "Samana — Abdus Samad Khan"], "Sadhaura — Usman Khan", "Usman Khan ruled Sadhaura. Wazir Khan governed Sirhind, while Qadam-ud-Din ruled Kapuri.", ["banda-sadhaura-usman-khan", "banda-kapuri-qadam-ud-din", "sirhind-wazir-khan"], [S.psebBandaLesson]],

  ["Easy", "Who was the governor of Sirhind when Banda Singh Bahadur advanced against it?", ["Wazir Khan", "Usman Khan", "Abdus Samad Khan", "Daulat Khan Lodi"], "Wazir Khan", "Wazir Khan was the governor of Sirhind when Banda Singh Bahadur's forces advanced against the province.", ["sirhind-wazir-khan"], [S.psebBandaLesson]],
  ["Easy", "The Battle of Chappar Chiri was fought in which year?", ["1710", "1708", "1709", "1715"], "1710", "The Battle of Chappar Chiri was fought in 1710 during Banda Singh Bahadur's campaign against Sirhind.", ["chappar-chiri-1710"], [S.psebBandaLesson, S.psebClass12Model]],
  ["Medium", "Whose forces were defeated at Chappar Chiri in 1710?", ["Wazir Khan's", "Abdus Samad Khan's", "Bahadur Shah I's at Delhi", "Daulat Khan Lodi's"], "Wazir Khan's", "Banda Singh Bahadur defeated the forces of Sirhind governor Wazir Khan at Chappar Chiri.", ["chappar-chiri-1710", "sirhind-wazir-khan"], [S.psebBandaLesson]],
  ["Medium", "What happened to Wazir Khan at the Battle of Chappar Chiri?", ["He was killed in the battle", "He became governor of Lahore", "He joined Banda Singh Bahadur", "He was sent to Nanded"], "He was killed in the battle", "Wazir Khan was killed during the 1710 Battle of Chappar Chiri.", ["chappar-chiri-1710"], [S.psebBandaLesson]],
  ["Medium", "Banda Singh Bahadur captured Sirhind in which year?", ["1710", "1709", "1715", "1716"], "1710", "Sirhind was captured in 1710 after the victory at Chappar Chiri.", ["sirhind-captured-1710", "chappar-chiri-1710"], [S.psebBandaLesson, S.sgpcGazetteBanda]],
  ["Hard", "Which sequence correctly describes the Sirhind campaign?", ["Chappar Chiri victory → death of Wazir Khan → capture of Sirhind", "Capture of Sirhind → Nanded meeting → Chappar Chiri", "Death of Wazir Khan → Samana 1709 → Nanded meeting", "Gurdas Nangal → Chappar Chiri → Nanded"], "Chappar Chiri victory → death of Wazir Khan → capture of Sirhind", "The 1710 victory at Chappar Chiri broke Wazir Khan's resistance and was followed by the capture of Sirhind.", ["chappar-chiri-1710", "sirhind-captured-1710"], [S.psebBandaLesson]],

  ["Easy", "What was the capital of Banda Singh Bahadur?", ["Lohgarh", "Sirhind", "Samana", "Amritsar"], "Lohgarh", "Banda Singh Bahadur made Lohgarh his capital.", ["lohgarh-capital-banda"], [S.psebBandaLesson]],
  ["Easy", "Who is treated in Punjab school history as the first issuer of coins of the Sikh Panth?", ["Banda Singh Bahadur", "Maharaja Ranjit Singh", "Baba Ala Singh", "Nawab Kapur Singh"], "Banda Singh Bahadur", "Punjab school history credits Banda Singh Bahadur with issuing the first coins of the Sikh Panth.", ["banda-first-sikh-coinage"], [S.psebBandaLesson]],
  ["Medium", "In whose names did Banda Singh Bahadur issue his coins?", ["Guru Nanak Dev and Guru Gobind Singh", "Guru Arjan Dev and Guru Hargobind", "Banda Singh Bahadur and Wazir Khan", "Bahadur Shah I and Farrukh Siyar"], "Guru Nanak Dev and Guru Gobind Singh", "Punjab school history records that Banda Singh Bahadur issued coins in the names of Guru Nanak Dev and Guru Gobind Singh.", ["banda-first-sikh-coinage"], [S.psebBandaLesson]],
  ["Medium", "Which agrarian measure is credited to Banda Singh Bahadur in areas under his control?", ["Abolition of the zamindari system", "Introduction of Permanent Settlement", "Creation of ryotwari administration by the British", "Abolition of cultivation rights"], "Abolition of the zamindari system", "Banda Singh Bahadur is credited with abolishing zamindari in areas under his control.", ["banda-zamindari-tiller-rights"], [S.pibBanda, S.censusSangrur]],
  ["Medium", "Banda Singh Bahadur's land policy recognised proprietary rights for:", ["Tillers of the land", "Only Mughal mansabdars", "European trading companies", "Urban guilds"], "Tillers of the land", "His agrarian measures are described as recognising ownership rights of cultivators who tilled the land.", ["banda-zamindari-tiller-rights"], [S.pibBanda, S.censusSangrur]],
  ["Hard", "Which set is correctly matched?", ["Lohgarh — capital; Banda Singh Bahadur — early Sikh coinage; tillers — proprietary rights", "Samana — capital; Wazir Khan — Sikh coinage; zamindars — new exclusive rights", "Sirhind — capital; Farrukh Siyar — Sikh coinage; traders — land rights", "Nanded — capital; Usman Khan — Sikh coinage; mansabdars — land rights"], "Lohgarh — capital; Banda Singh Bahadur — early Sikh coinage; tillers — proprietary rights", "Lohgarh was Banda Singh Bahadur's capital; he issued early Sikh coinage and his agrarian policy favoured cultivators' proprietary rights.", ["lohgarh-capital-banda", "banda-first-sikh-coinage", "banda-zamindari-tiller-rights"], [S.psebBandaLesson, S.pibBanda]],

  ["Medium", "What did Guru Gobind Singh's hukamnamas ask Punjab Sikhs to do during Banda Singh Bahadur's campaign?", ["Accept Banda Singh Bahadur as their leader in the struggle", "Support Wazir Khan at Sirhind", "Move permanently to Delhi", "Abandon the Punjab campaign"], "Accept Banda Singh Bahadur as their leader in the struggle", "Punjab school history states that the hukamnamas asked Sikhs to rally under Banda Singh Bahadur's leadership.", ["banda-nanded-1708"], [S.psebBandaLesson]],
  ["Medium", "Which factor helped Banda Singh Bahadur's early military success?", ["Support from Sikhs and sections of the local population", "A permanent alliance with Wazir Khan", "Control of the Mughal imperial court", "British military assistance"], "Support from Sikhs and sections of the local population", "His early success was helped by Sikh mobilisation under the hukamnamas and support from sections of the local population.", ["banda-nanded-1708"], [S.psebBandaLesson]],
  ["Medium", "Which place became the centre of Banda Singh Bahadur's final major resistance to Mughal forces?", ["Gurdas Nangal", "Nanded", "Panipat", "Goindwal"], "Gurdas Nangal", "Banda Singh Bahadur's final major siege and resistance took place at Gurdas Nangal.", ["gurdas-nangal-1715"], [S.psebBandaLesson]],
  ["Medium", "Who led the Mughal force that arrested Banda Singh Bahadur at Gurdas Nangal?", ["Abdus Samad Khan", "Wazir Khan", "Usman Khan", "Qadam-ud-Din"], "Abdus Samad Khan", "Punjab school history names Abdus Samad Khan as the Mughal commander who arrested Banda Singh Bahadur at Gurdas Nangal.", ["gurdas-nangal-1715"], [S.psebBandaLesson]],
  ["Hard", "Which factor is listed in Punjab school history among the causes of Banda Singh Bahadur's final setback?", ["Differences with Baba Binod Singh", "Alliance with Wazir Khan", "Loss of Lahore to Babur", "Failure of the First Battle of Panipat"], "Differences with Baba Binod Singh", "Punjab school history lists internal differences with Baba Binod Singh among the factors that weakened Banda Singh Bahadur's position.", ["gurdas-nangal-1715"], [S.psebBandaLesson]],
  ["Hard", "Which statement best describes the shift from Banda Singh Bahadur's early success to his final setback?", ["Rapid early victories were followed by a sustained Mughal counter-offensive ending at Gurdas Nangal", "He remained at Nanded until 1716 and never campaigned in Punjab", "He lost Sirhind before attacking Samana", "His final resistance took place at Panipat in 1526"], "Rapid early victories were followed by a sustained Mughal counter-offensive ending at Gurdas Nangal", "Banda Singh Bahadur won major early victories, but the Mughal response eventually confined his final resistance to Gurdas Nangal.", ["banda-samana-1709", "sirhind-captured-1710", "gurdas-nangal-1715"], [S.psebBandaLesson]],

  ["Easy", "Where was Banda Singh Bahadur's final battle against the Mughals fought?", ["Gurdas Nangal", "Chappar Chiri", "Samana", "Nanded"], "Gurdas Nangal", "Punjab school history identifies Gurdas Nangal as the site of Banda Singh Bahadur's final battle and capture.", ["gurdas-nangal-1715"], [S.psebBandaLesson]],
  ["Easy", "In which year was Banda Singh Bahadur captured at Gurdas Nangal?", ["1715", "1710", "1709", "1716"], "1715", "Banda Singh Bahadur was captured after the Gurdas Nangal siege in 1715.", ["gurdas-nangal-1715"], [S.psebBandaLesson]],
  ["Medium", "What weakened the defenders during the long siege at Gurdas Nangal?", ["Shortage of food supplies", "Lack of rainfall in Nanded", "Loss of a naval fleet", "Closure of the Grand Trunk Road by the British"], "Shortage of food supplies", "Punjab school history notes that the besieged Sikhs ran short of food supplies during the long Gurdas Nangal siege.", ["gurdas-nangal-1715"], [S.psebBandaLesson]],
  ["Medium", "After his capture, Banda Singh Bahadur was taken from Gurdas Nangal toward Delhi through which major city?", ["Lahore", "Patna", "Jaipur", "Ujjain"], "Lahore", "After capture at Gurdas Nangal, Banda Singh Bahadur and his companions were taken first toward Lahore and then to Delhi.", ["banda-captured-taken-delhi"], [S.psebBandaLesson]],
  ["Easy", "Banda Singh Bahadur was executed in which year?", ["1716", "1715", "1710", "1708"], "1716", "Banda Singh Bahadur was executed at Delhi in 1716.", ["banda-execution-1716-delhi"], [S.psebBandaLesson, S.pibBanda]],
  ["Hard", "During whose reign was Banda Singh Bahadur executed?", ["Farrukh Siyar", "Bahadur Shah I", "Aurangzeb", "Muhammad Shah"], "Farrukh Siyar", "Banda Singh Bahadur's execution in 1716 took place during the reign of Mughal emperor Farrukh Siyar.", ["banda-execution-1716-delhi"], [S.psebBandaLesson, S.pibBanda]],

  ["Hard", "Which is the correct chronological order?", ["Nanded meeting 1708 → Samana 1709 → Chappar Chiri 1710 → Gurdas Nangal 1715 → execution 1716", "Samana 1709 → Nanded 1708 → Gurdas Nangal 1715 → Chappar Chiri 1710 → execution 1716", "Chappar Chiri 1710 → Samana 1709 → Nanded 1708 → execution 1716 → Gurdas Nangal 1715", "Nanded 1708 → Chappar Chiri 1710 → Samana 1709 → execution 1716 → Gurdas Nangal 1715"], "Nanded meeting 1708 → Samana 1709 → Chappar Chiri 1710 → Gurdas Nangal 1715 → execution 1716", "The main sequence is Nanded in 1708, Samana in 1709, Chappar Chiri and Sirhind in 1710, Gurdas Nangal in 1715 and Delhi in 1716.", ["banda-nanded-1708", "banda-samana-1709", "chappar-chiri-1710", "gurdas-nangal-1715", "banda-execution-1716-delhi"], [S.psebBandaLesson]],
  ["Hard", "Which set is correctly matched?", ["Madho Das — Nanded; Wazir Khan — Sirhind; Lohgarh — capital", "Madho Das — Sirhind; Wazir Khan — Nanded; Samana — capital", "Lachhman Dev — Farrukh Siyar; Lohgarh — governor of Sirhind; Nanded — capital", "Usman Khan — Sirhind; Wazir Khan — Sadhaura; Gurdas Nangal — capital"], "Madho Das — Nanded; Wazir Khan — Sirhind; Lohgarh — capital", "Madho Das met Guru Gobind Singh at Nanded, Wazir Khan governed Sirhind, and Lohgarh became Banda Singh Bahadur's capital.", ["banda-nanded-1708", "sirhind-wazir-khan", "lohgarh-capital-banda"], [S.psebBandaLesson]],
  ["Hard", "Consider the following pairs:\nI. Samana — 1709\nII. Chappar Chiri — 1710\nIII. Gurdas Nangal — 1715\nIV. Delhi execution — 1716\nWhich of the pairs given above are correctly matched?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four place-year relations correctly follow Banda Singh Bahadur's campaign and final capture chronology.", ["banda-samana-1709", "chappar-chiri-1710", "gurdas-nangal-1715", "banda-execution-1716-delhi"], [S.psebBandaLesson]],
  ["Hard", "Which reform-result pair is correctly matched?", ["Abolition of zamindari — stronger proprietary rights for tillers", "Coinage — restoration of Wazir Khan as governor", "Lohgarh — abandonment of administration", "Sirhind victory — end of the Nanded mission before reaching Punjab"], "Abolition of zamindari — stronger proprietary rights for tillers", "Banda Singh Bahadur's agrarian policy is described as ending zamindari in areas under his control and recognising rights of cultivators.", ["banda-zamindari-tiller-rights"], [S.pibBanda, S.censusSangrur]],
  ["Hard", "Which statement about Banda Singh Bahadur's coinage is correct?", ["He issued coins in the names of Guru Nanak Dev and Guru Gobind Singh", "He issued Mughal coins only in Wazir Khan's name", "He introduced British East India Company coins", "He issued no coins during his rule"], "He issued coins in the names of Guru Nanak Dev and Guru Gobind Singh", "Punjab school history records coinage issued by Banda Singh Bahadur in the names of Guru Nanak Dev and Guru Gobind Singh.", ["banda-first-sikh-coinage"], [S.psebBandaLesson]],
  ["Hard", "Consider the following statements:\nI. Lohgarh served as Banda Singh Bahadur's capital.\nII. Sirhind was captured in 1710.\nIII. Gurdas Nangal was the site of his final major siege in 1715.\nIV. He was executed in Delhi in 1716.\nWhich of the statements given above are correct?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four statements correctly summarise Banda Singh Bahadur's capital, major victory, final siege and execution chronology.", ["lohgarh-capital-banda", "sirhind-captured-1710", "gurdas-nangal-1715", "banda-execution-1716-delhi"], [S.psebBandaLesson, S.pibBanda]],
];

const qlIds = Object.keys(PGK_001_CP013_QL_NAMES) as (keyof typeof PGK_001_CP013_QL_NAMES)[];

export const PGK_001_CP013_REVIEW_BATCH_V1: readonly Pgk001Cp013ReviewQuestion[] = Object.freeze(
  rows.map((row, index) => {
    const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
    const qlId = qlIds[Math.floor(index / 6)]!;
    const correctIndex = options.indexOf(canonicalAnswer);
    return Object.freeze({
      questionId: `PGK-001-CP013-Q${String(index + 1).padStart(3, "0")}`,
      qlId,
      qlName: PGK_001_CP013_QL_NAMES[qlId],
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
  }),
);

export function auditPgk001Cp013ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const validFactIds = new Set(PGK_001_CP013_FACT_IDS);
  const bannedLearnerTerms = [
    "associated with", "linked with", "closely linked", "closely associated",
    "known for", "closely related to", "pseb", "sgpc", "pib", "source:",
    "website", "according to", "the correct answer is", "the correct option",
    "the other options", "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP013_REVIEW_BATCH_V1) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.correctIndex < 0 || question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown factId ${factId}`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }

  for (const qlId of qlIds) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  if (PGK_001_CP013_REVIEW_BATCH_V1.length !== 42) issues.push("expected 42 review questions");

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP013_REVIEW_BATCH_V1.length,
  });
}
