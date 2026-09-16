import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP014_FACT_IDS, PGK_001_CP014_SOURCE_IDS } from "./pgk-001-cp014-facts";

export type Pgk001Cp014ReviewQuestion = Readonly<{
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

export const PGK_001_CP014_QL_NAMES = Object.freeze({
  "PGK-001-QL-091": "Dal Khalsa: foundation and command",
  "PGK-001-QL-092": "Budha Dal, Taruna Dal, Sarbat Khalsa and Gurmata",
  "PGK-001-QL-093": "Misl system and Rakhi",
  "PGK-001-QL-094": "Major misls and founders I",
  "PGK-001-QL-095": "Major misls, aliases and leaders II",
  "PGK-001-QL-096": "Amritsar and confederacy relations",
  "PGK-001-QL-097": "Dal Khalsa and Misl synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP014_SOURCE_IDS;

const rows: readonly Row[] = [
  ["Easy", "Dal Khalsa was organised in which year?", ["1748", "1716", "1733", "1765"], "1748", "Dal Khalsa was organised in 1748 during the Sikh confederacy phase.", ["dal-khalsa-amritsar-1748"], [S.psebDalKhalsaLesson]],
  ["Easy", "Dal Khalsa was organised at which city?", ["Amritsar", "Lahore", "Anandpur Sahib", "Sirhind"], "Amritsar", "Dal Khalsa was organised at Amritsar in 1748.", ["dal-khalsa-amritsar-1748"], [S.psebDalKhalsaLesson, S.ministryTourismDeepSingh]],
  ["Easy", "Who organised Dal Khalsa in 1748?", ["Nawab Kapur Singh", "Jassa Singh Ramgarhia", "Charat Singh", "Baba Ala Singh"], "Nawab Kapur Singh", "Nawab Kapur Singh organised Dal Khalsa at Amritsar in 1748.", ["dal-khalsa-amritsar-1748"], [S.psebDalKhalsaLesson]],
  ["Medium", "Who became the chief commander of Dal Khalsa?", ["Jassa Singh Ahluwalia", "Jassa Singh Ramgarhia", "Charat Singh", "Jai Singh Kanhaiya"], "Jassa Singh Ahluwalia", "Jassa Singh Ahluwalia became the chief commander of Dal Khalsa after its organisation under Nawab Kapur Singh.", ["dal-khalsa-amritsar-1748", "ahluwalia-jassa-singh"], [S.psebClass12Material, S.districtKapurthalaHistory]],
  ["Easy", "How many major Sikh misls formed the standard confederacy framework?", ["12", "5", "8", "18"], "12", "Punjab school history recognises twelve major Sikh misls in the confederacy framework.", ["dal-khalsa-twelve-misls"], [S.psebDalKhalsaLesson]],
  ["Hard", "Which set correctly describes Dal Khalsa?", ["1748 — Amritsar — Nawab Kapur Singh — Jassa Singh Ahluwalia", "1716 — Delhi — Banda Singh Bahadur — Charat Singh", "1733 — Lahore — Jassa Singh Ramgarhia — Jai Singh Kanhaiya", "1765 — Sirhind — Baba Deep Singh — Nawab Kapur Singh"], "1748 — Amritsar — Nawab Kapur Singh — Jassa Singh Ahluwalia", "Dal Khalsa was organised at Amritsar in 1748 under Nawab Kapur Singh, and Jassa Singh Ahluwalia became its chief commander.", ["dal-khalsa-amritsar-1748"], [S.psebDalKhalsaLesson, S.psebClass12Material]],

  ["Easy", "Who organised Budha Dal and Taruna Dal?", ["Nawab Kapur Singh", "Charat Singh", "Jassa Singh Ramgarhia", "Baba Deep Singh"], "Nawab Kapur Singh", "Nawab Kapur Singh organised the Sikh fighting bands into Budha Dal and Taruna Dal.", ["budha-taruna-dal-kapur-singh"], [S.psebClass12Material]],
  ["Easy", "Budha Dal mainly consisted of:", ["Older veterans", "Young fighters", "Artillery units only", "Village officials"], "Older veterans", "Budha Dal mainly consisted of older and experienced veterans.", ["budha-taruna-dal-kapur-singh"], [S.psebClass12Material]],
  ["Easy", "Taruna Dal mainly consisted of:", ["Young fighters", "Older veterans", "Revenue officials", "Artillery units only"], "Young fighters", "Taruna Dal mainly consisted of younger fighters.", ["budha-taruna-dal-kapur-singh"], [S.psebClass12Material]],
  ["Medium", "Taruna Dal was divided into how many jathas in standard Punjab school history?", ["5", "12", "8", "2"], "5", "Taruna Dal was divided into five jathas, each under a separate leader.", ["taruna-dal-five-jathas"], [S.psebClass12Material]],
  ["Easy", "What was the collective Sikh assembly at Amritsar called?", ["Sarbat Khalsa", "Gurmata", "Rakhi", "Misldari"], "Sarbat Khalsa", "Sarbat Khalsa was the collective assembly of the Sikh community, held at Amritsar in the Akal Takht setting.", ["sarbat-khalsa-amritsar-akal-takht"], [S.psebDalKhalsaLesson]],
  ["Medium", "What were the collective decisions of the Sarbat Khalsa called?", ["Gurmata", "Rakhi", "Misldari", "Mansabdari"], "Gurmata", "The decisions adopted collectively by the Sarbat Khalsa were called Gurmata.", ["gurmata-sarbat-khalsa-decisions", "sarbat-khalsa-amritsar-akal-takht"], [S.psebClass12Material]],

  ["Easy", "The word 'Misl' is derived from which language in standard Punjab school history?", ["Arabic", "Persian", "Punjabi", "Sanskrit"], "Arabic", "Punjab school history derives the term Misl from Arabic.", ["misl-word-arabic"], [S.psebDalKhalsaLesson]],
  ["Easy", "What was the main purpose of the Rakhi system?", ["Protection of villages from raids and outside attack", "Collection of pilgrimage tax", "Recruitment of Mughal mansabdars", "Division of land among foreign traders"], "Protection of villages from raids and outside attack", "Under Rakhi, a village paid a Sikh chief for protection against raids, theft and outside attack.", ["rakhi-protection-system-one-fifth"], [S.psebClass12Material]],
  ["Medium", "Under the Rakhi system, a protected village paid what share of its estimated revenue?", ["One-fifth", "One-half", "One-tenth", "One-third"], "One-fifth", "Standard Punjab school history gives the Rakhi payment as one-fifth of the village's estimated revenue.", ["rakhi-protection-system-one-fifth"], [S.psebClass12Material]],
  ["Medium", "Which statement correctly distinguishes Sarbat Khalsa from Gurmata?", ["Sarbat Khalsa was the assembly; Gurmata was its collective decision", "Gurmata was the army; Sarbat Khalsa was a tax", "Sarbat Khalsa was a misl; Gurmata was a fort", "Both terms meant the Rakhi payment"], "Sarbat Khalsa was the assembly; Gurmata was its collective decision", "Sarbat Khalsa was the collective assembly, while Gurmata referred to decisions taken by that assembly.", ["sarbat-khalsa-amritsar-akal-takht", "gurmata-sarbat-khalsa-decisions"], [S.psebClass12Material]],
  ["Medium", "Which institution was used for collective decisions on security, military strategy and disputes among Sikh chiefs?", ["Gurmata", "Rakhi", "Mansabdari", "Zamindari"], "Gurmata", "Gurmatas dealt with matters such as security, joint military strategy and settlement of disputes.", ["gurmata-sarbat-khalsa-decisions"], [S.psebClass12Material]],
  ["Hard", "Which pair is correctly matched?", ["Rakhi — protection system", "Gurmata — revenue tax", "Sarbat Khalsa — cavalry unit", "Misl — Mughal court rank"], "Rakhi — protection system", "Rakhi was a village-protection arrangement. Sarbat Khalsa was the assembly and Gurmata its collective decision.", ["rakhi-protection-system-one-fifth", "sarbat-khalsa-amritsar-akal-takht", "gurmata-sarbat-khalsa-decisions"], [S.psebClass12Material]],

  ["Easy", "Who founded the Faizalpuria Misl?", ["Nawab Kapur Singh", "Jassa Singh Ahluwalia", "Charat Singh", "Jai Singh Kanhaiya"], "Nawab Kapur Singh", "Nawab Kapur Singh founded the Faizalpuria Misl, also called the Singhpuria Misl.", ["faizalpuria-nawab-kapur-singh"], [S.psebDalKhalsaLesson]],
  ["Easy", "Who founded the Ahluwalia Misl?", ["Jassa Singh Ahluwalia", "Jassa Singh Ramgarhia", "Chhajja Singh", "Tara Singh Gheba"], "Jassa Singh Ahluwalia", "Jassa Singh Ahluwalia was the founder and leading figure of the Ahluwalia Misl.", ["ahluwalia-jassa-singh"], [S.psebDalKhalsaLesson, S.districtKapurthalaHistory]],
  ["Easy", "Who founded the Ramgarhia Misl?", ["Jassa Singh Ramgarhia", "Jassa Singh Ahluwalia", "Nawab Kapur Singh", "Charat Singh"], "Jassa Singh Ramgarhia", "Jassa Singh Ramgarhia founded the Ramgarhia Misl.", ["ramgarhia-jassa-singh-ramgarhia"], [S.psebDalKhalsaLesson, S.districtAmritsarHistory]],
  ["Easy", "Who founded the Sukerchakia Misl?", ["Charat Singh", "Jai Singh Kanhaiya", "Chhajja Singh", "Nawab Kapur Singh"], "Charat Singh", "Charat Singh founded the Sukerchakia Misl.", ["sukerchakia-charat-singh"], [S.psebDalKhalsaLesson]],
  ["Easy", "Who founded the Kanhaiya Misl?", ["Jai Singh Kanhaiya", "Charat Singh", "Jassa Singh Ahluwalia", "Tara Singh Gheba"], "Jai Singh Kanhaiya", "Jai Singh Kanhaiya founded the Kanhaiya Misl.", ["kanhaiya-jai-singh"], [S.psebDalKhalsaLesson]],
  ["Medium", "Who is given as the founder of the Bhangi Misl in Punjab school history?", ["Chhajja Singh", "Jassa Singh Ramgarhia", "Jai Singh Kanhaiya", "Nawab Kapur Singh"], "Chhajja Singh", "Punjab school history gives Chhajja Singh as the founder of the Bhangi Misl.", ["bhangi-chhajja-singh"], [S.psebDalKhalsaLesson]],

  ["Easy", "Faizalpuria Misl was also called:", ["Singhpuria Misl", "Nihang Misl", "Panjgarhia Misl", "Kanhaiya Misl"], "Singhpuria Misl", "Faizalpuria Misl is also called Singhpuria Misl in Punjab school history.", ["faizalpuria-nawab-kapur-singh"], [S.psebDalKhalsaLesson]],
  ["Easy", "Karorsinghia Misl was also called:", ["Panjgarhia Misl", "Singhpuria Misl", "Nihang Misl", "Ahluwalia Misl"], "Panjgarhia Misl", "Karorsinghia Misl is also called Panjgarhia Misl in Punjab school history.", ["karorsinghia-panjgarhia"], [S.psebDalKhalsaLesson]],
  ["Easy", "Shahid Misl was also called:", ["Nihang Misl", "Panjgarhia Misl", "Singhpuria Misl", "Bhangi Misl"], "Nihang Misl", "Shahid Misl is also called Nihang Misl in Punjab school history.", ["shahid-baba-deep-singh-nihang"], [S.psebDalKhalsaLesson]],
  ["Medium", "Which leader is a prominent figure of the Shahid Misl?", ["Baba Deep Singh", "Tara Singh Gheba", "Charat Singh", "Jai Singh Kanhaiya"], "Baba Deep Singh", "Baba Deep Singh is one of the best-known leaders of the Shahid Misl.", ["shahid-baba-deep-singh-nihang"], [S.psebDalKhalsaLesson, S.ministryTourismDeepSingh]],
  ["Medium", "Tara Singh Gheba was a prominent leader of which misl?", ["Dallewalia Misl", "Ahluwalia Misl", "Bhangi Misl", "Ramgarhia Misl"], "Dallewalia Misl", "Tara Singh Gheba was a prominent leader of the Dallewalia Misl.", ["dallewalia-tara-singh-gheba"], [S.psebDalKhalsaLesson]],
  ["Hard", "The title 'Sultan-ul-Qaum' was conferred on whom in standard Punjab school history?", ["Jassa Singh Ahluwalia", "Jassa Singh Ramgarhia", "Nawab Kapur Singh", "Charat Singh"], "Jassa Singh Ahluwalia", "Jassa Singh Ahluwalia received the title Sultan-ul-Qaum and later served as a leading commander of the Sikh confederacy.", ["jassa-singh-sultan-ul-qaum", "ahluwalia-jassa-singh"], [S.psebDalKhalsaLesson, S.districtKapurthalaHistory]],

  ["Medium", "Which set contains only misls that controlled parts of Amritsar during the misl period?", ["Ahluwalia, Ramgarhia, Kanhaiya and Bhangi", "Sukerchakia, Dallewalia, Nishanwalia and Phulkian", "Faizalpuria, Karorsinghia, Nakai and Sukerchakia", "Shahid, Nakai, Dallewalia and Phulkian"], "Ahluwalia, Ramgarhia, Kanhaiya and Bhangi", "Ahluwalia, Ramgarhia, Kanhaiya and Bhangi misls controlled different parts of Amritsar during the misl period.", ["amritsar-four-misls"], [S.districtAmritsarHistory]],
  ["Medium", "Which of the following was NOT one of the four misls that controlled parts of Amritsar?", ["Sukerchakia Misl", "Ahluwalia Misl", "Ramgarhia Misl", "Bhangi Misl"], "Sukerchakia Misl", "The four named in Amritsar's local history are Ahluwalia, Ramgarhia, Kanhaiya and Bhangi misls.", ["amritsar-four-misls"], [S.districtAmritsarHistory]],
  ["Medium", "Who rebuilt Ram Rauni and renamed it Ramgarh at Amritsar?", ["Jassa Singh Ramgarhia", "Jassa Singh Ahluwalia", "Charat Singh", "Nawab Kapur Singh"], "Jassa Singh Ramgarhia", "Jassa Singh Ramgarhia rebuilt Ram Rauni and renamed it Ramgarh at Amritsar.", ["ramgarhia-ramgarh-amritsar"], [S.districtAmritsarHistory]],
  ["Medium", "The name Ramgarhia developed from which Amritsar fort name?", ["Ramgarh", "Lohgarh", "Gobindgarh", "Anandgarh"], "Ramgarh", "The rebuilt fort was called Ramgarh, and Jassa Singh's group came to be called Ramgarhia.", ["ramgarhia-ramgarh-amritsar"], [S.districtAmritsarHistory]],
  ["Hard", "Which Misl-leader-city relation is correctly matched?", ["Ramgarhia — Jassa Singh Ramgarhia — Amritsar", "Sukerchakia — Charat Singh — Delhi", "Dallewalia — Tara Singh Gheba — Nanded", "Kanhaiya — Jai Singh — Patna"], "Ramgarhia — Jassa Singh Ramgarhia — Amritsar", "Jassa Singh Ramgarhia was a major Ramgarhia leader, and the misl controlled part of Amritsar during the confederacy period.", ["ramgarhia-jassa-singh-ramgarhia", "amritsar-four-misls"], [S.districtAmritsarHistory]],
  ["Hard", "What did the Ahluwalia, Ramgarhia, Kanhaiya and Bhangi misls have in common in Amritsar?", ["Each controlled part of the city during the misl period", "Each was founded by Nawab Kapur Singh", "Each was another name for Shahid Misl", "Each began at Nanded in 1708"], "Each controlled part of the city during the misl period", "These four misls held different parts of Amritsar at various times before the city came under Ranjit Singh's control.", ["amritsar-four-misls"], [S.districtAmritsarHistory]],

  ["Hard", "Which is the correct institutional sequence?", ["Sarbat Khalsa meets → Gurmata is adopted → chiefs act on the collective decision", "Gurmata meets → Rakhi is adopted → Sarbat Khalsa becomes a misl", "Rakhi meets → Taruna Dal issues Gurmata → Sarbat Khalsa collects tax", "Misl meets → Sarbat Khalsa becomes a fort → Gurmata becomes cavalry"], "Sarbat Khalsa meets → Gurmata is adopted → chiefs act on the collective decision", "Sarbat Khalsa was the assembly, while Gurmata was the collective decision meant to guide the chiefs.", ["sarbat-khalsa-amritsar-akal-takht", "gurmata-sarbat-khalsa-decisions"], [S.psebClass12Material]],
  ["Hard", "Which set is correctly matched?", ["Faizalpuria — Nawab Kapur Singh; Ahluwalia — Jassa Singh Ahluwalia; Sukerchakia — Charat Singh", "Faizalpuria — Charat Singh; Ahluwalia — Jai Singh; Sukerchakia — Jassa Singh Ramgarhia", "Faizalpuria — Tara Singh Gheba; Ahluwalia — Chhajja Singh; Sukerchakia — Nawab Kapur Singh", "Faizalpuria — Baba Deep Singh; Ahluwalia — Charat Singh; Sukerchakia — Jai Singh"], "Faizalpuria — Nawab Kapur Singh; Ahluwalia — Jassa Singh Ahluwalia; Sukerchakia — Charat Singh", "All three misl-founder relations in the first set are standard Punjab history facts.", ["faizalpuria-nawab-kapur-singh", "ahluwalia-jassa-singh", "sukerchakia-charat-singh"], [S.psebDalKhalsaLesson]],
  ["Hard", "Which set of alternate names is correctly matched?", ["Faizalpuria — Singhpuria; Karorsinghia — Panjgarhia; Shahid — Nihang", "Faizalpuria — Nihang; Karorsinghia — Singhpuria; Shahid — Panjgarhia", "Faizalpuria — Panjgarhia; Karorsinghia — Nihang; Shahid — Singhpuria", "All three alternate names refer to Ahluwalia Misl"], "Faizalpuria — Singhpuria; Karorsinghia — Panjgarhia; Shahid — Nihang", "Punjab school history gives Singhpuria, Panjgarhia and Nihang as alternate names of Faizalpuria, Karorsinghia and Shahid misls respectively.", ["faizalpuria-nawab-kapur-singh", "karorsinghia-panjgarhia", "shahid-baba-deep-singh-nihang"], [S.psebDalKhalsaLesson]],
  ["Hard", "Consider the following statements:\nI. Dal Khalsa was organised at Amritsar in 1748.\nII. Jassa Singh Ahluwalia became its chief commander.\nIII. The standard Sikh confederacy framework contained twelve major misls.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements correctly describe the organisation and later misl framework of Dal Khalsa.", ["dal-khalsa-amritsar-1748", "dal-khalsa-twelve-misls"], [S.psebDalKhalsaLesson, S.psebClass12Material]],
  ["Hard", "Consider the following pairs:\nI. Budha Dal — older veterans\nII. Taruna Dal — younger fighters\nIII. Rakhi — village protection\nIV. Gurmata — collective decision\nWhich of the pairs given above are correctly matched?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four pairs correctly describe important institutions and arrangements of the Sikh confederacy period.", ["budha-taruna-dal-kapur-singh", "rakhi-protection-system-one-fifth", "gurmata-sarbat-khalsa-decisions"], [S.psebClass12Material]],
  ["Hard", "Which statement correctly separates CP014 from the rise of the Sikh Empire?", ["CP014 covers the Dal Khalsa and misl confederacy; Ranjit Singh's empire-building follows in the next phase", "CP014 begins with the Anglo-Sikh Wars", "CP014 deals mainly with the annexation of Punjab in 1849", "CP014 begins after the death of Maharaja Ranjit Singh"], "CP014 covers the Dal Khalsa and misl confederacy; Ranjit Singh's empire-building follows in the next phase", "The misl confederacy preceded the consolidation of Sikh power under Maharaja Ranjit Singh, which belongs to the next historical phase.", ["dal-khalsa-twelve-misls", "sukerchakia-charat-singh"], [S.psebDalKhalsaLesson, S.districtAmritsarHistory]],
];

const rowsWithMeta = rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const qlIndex = Math.floor(index / 6);
  const qlId = `PGK-001-QL-${String(91 + qlIndex).padStart(3, "0")}`;
  const correctIndex = options.indexOf(canonicalAnswer);
  return Object.freeze({
    questionId: `PGK-001-CP014-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP014_QL_NAMES[qlId as keyof typeof PGK_001_CP014_QL_NAMES],
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
});

export const PGK_001_CP014_REVIEW_BATCH_V1: readonly Pgk001Cp014ReviewQuestion[] = Object.freeze(rowsWithMeta);

export function auditPgk001Cp014ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const facts = new Set(PGK_001_CP014_FACT_IDS);
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to", "closely associated",
    "pseb", "government of punjab", "district amritsar", "district kapurthala", "ministry of tourism",
    "source:", "website", "according to", "the correct answer is", "the correct option",
    "the other options", "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP014_REVIEW_BATCH_V1) {
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
    for (const factId of question.factIds) if (!facts.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }

  for (const qlId of Object.keys(PGK_001_CP014_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP014_REVIEW_BATCH_V1.length,
  });
}
