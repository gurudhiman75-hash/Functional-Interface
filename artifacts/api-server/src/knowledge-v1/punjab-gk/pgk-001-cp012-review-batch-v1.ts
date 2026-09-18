import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP012_FACT_IDS, PGK_001_CP012_SOURCE_IDS } from "./pgk-001-cp012-facts";

export type Pgk001Cp012ReviewQuestion = Readonly<{
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

export const PGK_001_CP012_QL_NAMES = Object.freeze({
  "PGK-001-QL-077": "Ten Gurus: succession and Guru Nanak",
  "PGK-001-QL-078": "Guru Angad, Guru Amar Das and institutions",
  "PGK-001-QL-079": "Guru Ram Das and Guru Arjan",
  "PGK-001-QL-080": "Guru Hargobind and Akal Takht",
  "PGK-001-QL-081": "Guru Har Rai, Har Krishan and Tegh Bahadur",
  "PGK-001-QL-082": "Guru Gobind Singh and Khalsa",
  "PGK-001-QL-083": "Sikh-Guru chronology and synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP012_SOURCE_IDS;
const rows: readonly Row[] = [
  ["Easy", "Who was the first Sikh Guru?", ["Guru Nanak Dev", "Guru Angad Dev", "Guru Amar Das", "Guru Ram Das"], "Guru Nanak Dev", "Guru Nanak Dev was the first of the ten Sikh Gurus.", ["ten-gurus-sequence"], [S.sgpcTenGurus]],
  ["Easy", "Who was the tenth Sikh Guru?", ["Guru Gobind Singh", "Guru Tegh Bahadur", "Guru Hargobind", "Guru Har Rai"], "Guru Gobind Singh", "Guru Gobind Singh was the tenth Sikh Guru.", ["ten-gurus-sequence", "guru-gobind-singh-patna-1666"], [S.sgpcTenGurus]],
  ["Easy", "Talwandi, the birthplace of Guru Nanak Dev, is now called:", ["Nankana Sahib", "Kartarpur", "Khadur Sahib", "Goindwal Sahib"], "Nankana Sahib", "Guru Nanak Dev was born at Talwandi, now called Nankana Sahib in Pakistan.", ["guru-nanak-talwandi-nankana"], [S.sgpcTenGurus]],
  ["Easy", "Which place became a major centre of Guru Nanak Dev's later life?", ["Kartarpur", "Goindwal", "Anandpur Sahib", "Kiratpur Sahib"], "Kartarpur", "Kartarpur became a major centre of Guru Nanak Dev's later life.", ["guru-nanak-kartarpur"], [S.psebPunjabHistory]],
  ["Medium", "Who succeeded Guru Nanak Dev as the second Sikh Guru?", ["Guru Angad Dev", "Guru Amar Das", "Guru Ram Das", "Guru Arjan Dev"], "Guru Angad Dev", "Guru Angad Dev succeeded Guru Nanak Dev as the second Guru.", ["ten-gurus-sequence"], [S.sgpcTenGurus]],
  ["Hard", "Which sequence of Gurus is correct?", ["Guru Nanak Dev → Guru Angad Dev → Guru Amar Das → Guru Ram Das", "Guru Nanak Dev → Guru Amar Das → Guru Angad Dev → Guru Ram Das", "Guru Angad Dev → Guru Nanak Dev → Guru Ram Das → Guru Amar Das", "Guru Nanak Dev → Guru Ram Das → Guru Angad Dev → Guru Amar Das"], "Guru Nanak Dev → Guru Angad Dev → Guru Amar Das → Guru Ram Das", "The first four Gurus were Guru Nanak Dev, Guru Angad Dev, Guru Amar Das and Guru Ram Das in that order.", ["ten-gurus-sequence"], [S.sgpcTenGurus]],

  ["Easy", "Khadur Sahib was the main centre of which Guru?", ["Guru Angad Dev", "Guru Amar Das", "Guru Ram Das", "Guru Har Rai"], "Guru Angad Dev", "Guru Angad Dev made Khadur Sahib an important centre during his Guruship.", ["guru-angad-khadur-gurmukhi"], [S.psebPunjabHistory]],
  ["Easy", "Which Guru is credited in Punjab school history with developing and promoting the Gurmukhi script?", ["Guru Angad Dev", "Guru Amar Das", "Guru Arjan Dev", "Guru Hargobind"], "Guru Angad Dev", "Guru Angad Dev is credited with developing, standardising and promoting Gurmukhi in standard Punjab school history.", ["guru-angad-khadur-gurmukhi"], [S.psebPunjabHistory]],
  ["Easy", "Goindwal became an important centre under which Guru?", ["Guru Amar Das", "Guru Angad Dev", "Guru Ram Das", "Guru Har Krishan"], "Guru Amar Das", "Guru Amar Das made Goindwal an important Sikh centre.", ["guru-amar-das-goindwal-manji-baoli"], [S.psebPunjabHistory]],
  ["Medium", "The Manji system was developed under which Guru?", ["Guru Amar Das", "Guru Ram Das", "Guru Arjan Dev", "Guru Hargobind"], "Guru Amar Das", "The Manji system was developed under Guru Amar Das for organised regional administration and teaching.", ["guru-amar-das-goindwal-manji-baoli"], [S.psebClass12Paper]],
  ["Medium", "The famous Baoli at Goindwal was built under which Guru?", ["Guru Amar Das", "Guru Nanak Dev", "Guru Hargobind", "Guru Tegh Bahadur"], "Guru Amar Das", "The Baoli at Goindwal is a major historical work of Guru Amar Das's period.", ["guru-amar-das-goindwal-manji-baoli"], [S.psebPunjabHistory]],
  ["Hard", "Which pair is correctly matched?", ["Guru Angad Dev — Khadur Sahib", "Guru Amar Das — Patna Sahib", "Guru Ram Das — Gwalior Fort", "Guru Har Rai — Goindwal Baoli"], "Guru Angad Dev — Khadur Sahib", "Khadur Sahib was a major centre of Guru Angad Dev. Goindwal belongs especially to Guru Amar Das's period.", ["guru-angad-khadur-gurmukhi", "guru-amar-das-goindwal-manji-baoli"], [S.psebPunjabHistory]],

  ["Easy", "Ramdaspur, which later developed into Amritsar, was founded under which Guru?", ["Guru Ram Das", "Guru Amar Das", "Guru Arjan Dev", "Guru Hargobind"], "Guru Ram Das", "Guru Ram Das founded and developed Ramdaspur, which later became Amritsar.", ["guru-ram-das-ramdaspur-masand"], [S.psebPunjabHistory]],
  ["Medium", "The Masand system is placed under which Guru in standard Punjab school history?", ["Guru Ram Das", "Guru Amar Das", "Guru Hargobind", "Guru Tegh Bahadur"], "Guru Ram Das", "Standard Punjab school history places the development of the Masand system under Guru Ram Das.", ["guru-ram-das-ramdaspur-masand"], [S.psebClass12Paper]],
  ["Easy", "Who compiled the Adi Granth?", ["Guru Arjan Dev", "Guru Ram Das", "Guru Hargobind", "Guru Gobind Singh"], "Guru Arjan Dev", "Guru Arjan Dev compiled the Adi Granth.", ["guru-arjan-adi-granth"], [S.psebClass12Paper]],
  ["Easy", "Who was the first Granthi of Harmandir Sahib?", ["Baba Buddha", "Bhai Gurdas", "Bhai Mardana", "Bhai Daya Singh"], "Baba Buddha", "Baba Buddha served as the first Granthi of Harmandir Sahib.", ["guru-arjan-adi-granth"], [S.psebClass12Paper]],
  ["Medium", "Harmandir Sahib was completed during the Guruship of:", ["Guru Arjan Dev", "Guru Ram Das", "Guru Hargobind", "Guru Tegh Bahadur"], "Guru Arjan Dev", "Harmandir Sahib at Amritsar was completed during Guru Arjan Dev's Guruship.", ["guru-arjan-harmandir-sahib"], [S.psebPunjabHistory]],
  ["Hard", "Guru Arjan Dev was martyred in which year?", ["1606", "1598", "1675", "1699"], "1606", "Guru Arjan Dev was martyred at Lahore in 1606 during Jahangir's reign.", ["guru-arjan-martyrdom-1606"], [S.psebClass12Paper]],

  ["Easy", "Who was the sixth Sikh Guru?", ["Guru Hargobind", "Guru Har Rai", "Guru Arjan Dev", "Guru Har Krishan"], "Guru Hargobind", "Guru Hargobind was the sixth Sikh Guru.", ["ten-gurus-sequence", "guru-hargobind-akal-takht-miri-piri"], [S.sgpcTenGurus]],
  ["Easy", "Which Guru established the Akal Takht?", ["Guru Hargobind", "Guru Arjan Dev", "Guru Har Rai", "Guru Gobind Singh"], "Guru Hargobind", "Guru Hargobind established the Akal Takht at Amritsar.", ["guru-hargobind-akal-takht-miri-piri"], [S.psebClass12Paper]],
  ["Medium", "The concept of Miri-Piri is linked historically with which Guru?", ["Guru Hargobind", "Guru Angad Dev", "Guru Amar Das", "Guru Har Krishan"], "Guru Hargobind", "Guru Hargobind is historically connected with the Miri-Piri principle of temporal and spiritual authority.", ["guru-hargobind-akal-takht-miri-piri"], [S.psebPunjabHistory]],
  ["Medium", "Guru Hargobind was imprisoned at which fort?", ["Gwalior Fort", "Lahore Fort", "Agra Fort", "Qila Mubarak Bathinda"], "Gwalior Fort", "Guru Hargobind was imprisoned at Gwalior Fort before his release.", ["guru-hargobind-gwalior-release"], [S.sgpcHistoricalGurdwaras]],
  ["Medium", "Akal Takht stands in which city?", ["Amritsar", "Anandpur Sahib", "Kiratpur Sahib", "Patna"], "Amritsar", "Akal Takht was established by Guru Hargobind at Amritsar.", ["guru-hargobind-akal-takht-miri-piri"], [S.psebPunjabHistory]],
  ["Hard", "Which set is correctly matched?", ["Guru Hargobind — Akal Takht — Miri-Piri", "Guru Arjan Dev — Gwalior Fort — Miri-Piri", "Guru Har Rai — Adi Granth — Akal Takht", "Guru Amar Das — Gwalior Fort — Miri-Piri"], "Guru Hargobind — Akal Takht — Miri-Piri", "Guru Hargobind established the Akal Takht and is historically connected with Miri-Piri.", ["guru-hargobind-akal-takht-miri-piri", "guru-hargobind-gwalior-release"], [S.psebPunjabHistory]],

  ["Easy", "Who was the seventh Sikh Guru?", ["Guru Har Rai", "Guru Har Krishan", "Guru Hargobind", "Guru Tegh Bahadur"], "Guru Har Rai", "Guru Har Rai was the seventh Sikh Guru.", ["ten-gurus-sequence", "guru-har-rai-kiratpur"], [S.sgpcTenGurus]],
  ["Easy", "Kiratpur Sahib was an important centre of which Guru?", ["Guru Har Rai", "Guru Har Krishan", "Guru Nanak Dev", "Guru Angad Dev"], "Guru Har Rai", "Kiratpur Sahib was an important centre during Guru Har Rai's Guruship.", ["guru-har-rai-kiratpur"], [S.psebPunjabHistory]],
  ["Easy", "Who was the eighth Sikh Guru?", ["Guru Har Krishan", "Guru Har Rai", "Guru Tegh Bahadur", "Guru Hargobind"], "Guru Har Krishan", "Guru Har Krishan was the eighth Sikh Guru.", ["ten-gurus-sequence", "guru-har-krishan-delhi-1664"], [S.sgpcTenGurus]],
  ["Medium", "Guru Har Krishan died in which city in 1664?", ["Delhi", "Amritsar", "Anandpur Sahib", "Lahore"], "Delhi", "Guru Har Krishan died in Delhi in 1664.", ["guru-har-krishan-delhi-1664"], [S.sgpcTenGurus]],
  ["Easy", "Who was the ninth Sikh Guru?", ["Guru Tegh Bahadur", "Guru Har Krishan", "Guru Gobind Singh", "Guru Har Rai"], "Guru Tegh Bahadur", "Guru Tegh Bahadur was the ninth Sikh Guru.", ["ten-gurus-sequence", "guru-tegh-bahadur-martyrdom-1675"], [S.sgpcTenGurus]],
  ["Hard", "Guru Tegh Bahadur was martyred at Delhi in:", ["1675", "1606", "1664", "1699"], "1675", "Guru Tegh Bahadur was martyred at Delhi in 1675.", ["guru-tegh-bahadur-martyrdom-1675"], [S.psebClass12Paper]],

  ["Easy", "Guru Gobind Singh was born at:", ["Patna Sahib", "Anandpur Sahib", "Amritsar", "Kiratpur Sahib"], "Patna Sahib", "Guru Gobind Singh was born at Patna Sahib in 1666.", ["guru-gobind-singh-patna-1666"], [S.psebClass12Paper]],
  ["Medium", "Guru Gobind Singh was born in which year?", ["1666", "1675", "1699", "1708"], "1666", "Guru Gobind Singh was born in 1666 at Patna Sahib.", ["guru-gobind-singh-patna-1666"], [S.psebClass12Paper]],
  ["Easy", "The Khalsa was created in which year?", ["1699", "1675", "1606", "1708"], "1699", "Guru Gobind Singh created the Khalsa at Anandpur Sahib in 1699.", ["khalsa-anandpur-1699"], [S.psebClass12Paper]],
  ["Easy", "Where was the Khalsa created in 1699?", ["Anandpur Sahib", "Amritsar", "Khadur Sahib", "Goindwal"], "Anandpur Sahib", "The Khalsa was created at Anandpur Sahib in 1699.", ["khalsa-anandpur-1699"], [S.psebClass12Paper]],
  ["Medium", "Bhai Daya Singh was one of the:", ["Panj Pyare", "Five Takhts", "Four Sahibzadas", "Masands"], "Panj Pyare", "Bhai Daya Singh was one of the Panj Pyare at the creation of the Khalsa.", ["panj-pyare-khalsa"], [S.psebClass12Paper]],
  ["Hard", "Which set is correctly matched?", ["Guru Gobind Singh — Patna Sahib — 1666 — Khalsa 1699", "Guru Tegh Bahadur — Patna Sahib — 1699 — Khalsa", "Guru Hargobind — Patna Sahib — 1666 — Adi Granth", "Guru Har Rai — Anandpur Sahib — 1699 — Akal Takht"], "Guru Gobind Singh — Patna Sahib — 1666 — Khalsa 1699", "Guru Gobind Singh was born at Patna Sahib in 1666 and created the Khalsa at Anandpur Sahib in 1699.", ["guru-gobind-singh-patna-1666", "khalsa-anandpur-1699"], [S.psebClass12Paper]],

  ["Hard", "Which is the correct succession from the fifth to the eighth Guru?", ["Guru Arjan Dev → Guru Hargobind → Guru Har Rai → Guru Har Krishan", "Guru Arjan Dev → Guru Har Rai → Guru Hargobind → Guru Har Krishan", "Guru Hargobind → Guru Arjan Dev → Guru Har Krishan → Guru Har Rai", "Guru Arjan Dev → Guru Har Krishan → Guru Har Rai → Guru Hargobind"], "Guru Arjan Dev → Guru Hargobind → Guru Har Rai → Guru Har Krishan", "The fifth through eighth Gurus were Guru Arjan Dev, Guru Hargobind, Guru Har Rai and Guru Har Krishan.", ["ten-gurus-sequence"], [S.sgpcTenGurus]],
  ["Hard", "Which is the correct chronological order?", ["Martyrdom of Guru Arjan Dev → death of Guru Har Krishan → martyrdom of Guru Tegh Bahadur → creation of Khalsa", "Creation of Khalsa → martyrdom of Guru Arjan Dev → death of Guru Har Krishan → martyrdom of Guru Tegh Bahadur", "Martyrdom of Guru Tegh Bahadur → martyrdom of Guru Arjan Dev → creation of Khalsa → death of Guru Har Krishan", "Death of Guru Har Krishan → martyrdom of Guru Arjan Dev → martyrdom of Guru Tegh Bahadur → creation of Khalsa"], "Martyrdom of Guru Arjan Dev → death of Guru Har Krishan → martyrdom of Guru Tegh Bahadur → creation of Khalsa", "The sequence is 1606, 1664, 1675 and 1699.", ["guru-arjan-martyrdom-1606", "guru-har-krishan-delhi-1664", "guru-tegh-bahadur-martyrdom-1675", "khalsa-anandpur-1699"], [S.psebClass12Paper]],
  ["Hard", "Which institution-Guru pair is correctly matched?", ["Akal Takht — Guru Hargobind", "Manji system — Guru Gobind Singh", "Adi Granth — Guru Har Rai", "Ramdaspur — Guru Tegh Bahadur"], "Akal Takht — Guru Hargobind", "Akal Takht was established by Guru Hargobind. The Manji system belongs to Guru Amar Das and the Adi Granth was compiled by Guru Arjan Dev.", ["guru-hargobind-akal-takht-miri-piri", "guru-amar-das-goindwal-manji-baoli", "guru-arjan-adi-granth"], [S.psebClass12Paper]],
  ["Hard", "Which place-Guru pair is incorrectly matched?", ["Patna Sahib — Guru Tegh Bahadur's birthplace", "Khadur Sahib — Guru Angad Dev", "Goindwal — Guru Amar Das", "Kiratpur Sahib — Guru Har Rai"], "Patna Sahib — Guru Tegh Bahadur's birthplace", "Patna Sahib is the birthplace of Guru Gobind Singh. Khadur Sahib, Goindwal and Kiratpur Sahib are correctly matched with Guru Angad Dev, Guru Amar Das and Guru Har Rai respectively.", ["guru-gobind-singh-patna-1666", "guru-angad-khadur-gurmukhi", "guru-amar-das-goindwal-manji-baoli", "guru-har-rai-kiratpur"], [S.psebPunjabHistory]],
  ["Hard", "Consider the following pairs:\nI. Guru Amar Das — Manji system\nII. Guru Arjan Dev — Adi Granth\nIII. Guru Hargobind — Akal Takht\nIV. Guru Gobind Singh — Khalsa\nWhich of the pairs given above are correctly matched?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four pairs correctly connect major Guru-period institutions or developments.", ["guru-amar-das-goindwal-manji-baoli", "guru-arjan-adi-granth", "guru-hargobind-akal-takht-miri-piri", "khalsa-anandpur-1699"], [S.psebClass12Paper]],
  ["Hard", "Which sequence correctly follows the ninth Guru, the tenth Guru and the later Guruship tradition?", ["Guru Tegh Bahadur → Guru Gobind Singh → Guru Granth Sahib", "Guru Gobind Singh → Guru Tegh Bahadur → Guru Granth Sahib", "Guru Tegh Bahadur → Guru Granth Sahib → Guru Gobind Singh", "Guru Har Krishan → Guru Granth Sahib → Guru Tegh Bahadur"], "Guru Tegh Bahadur → Guru Gobind Singh → Guru Granth Sahib", "Guru Tegh Bahadur was the ninth Guru and Guru Gobind Singh the tenth; in 1708 Guru Granth Sahib was recognised as the continuing Guru in standard historical treatment.", ["ten-gurus-sequence", "guru-granth-continuing-guru-1708"], [S.sgpcTenGurus]],
] as const;

function qlIdFor(index: number) {
  return `PGK-001-QL-${String(77 + Math.floor(index / 6)).padStart(3, "0")}` as keyof typeof PGK_001_CP012_QL_NAMES;
}

export const PGK_001_CP012_REVIEW_BATCH_V1: readonly Pgk001Cp012ReviewQuestion[] = Object.freeze(rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP012 row ${index + 1} is missing its canonical answer`);
  const qlId = qlIdFor(index);
  return Object.freeze({
    questionId: `PGK-001-CP012-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP012_QL_NAMES[qlId],
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

export function auditPgk001Cp012ReviewBatchV1() {
  const issues: string[] = [];
  const validFactIds = new Set(PGK_001_CP012_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to",
    "sgpc", "pseb", "source:", "website", "according to",
    "the correct answer is", "the correct option", "the other options",
    "this question tests", "review batch", "generator",
  ];
  for (const question of PGK_001_CP012_REVIEW_BATCH_V1) {
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
  for (const qlId of Object.keys(PGK_001_CP012_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP012_REVIEW_BATCH_V1.length });
}
