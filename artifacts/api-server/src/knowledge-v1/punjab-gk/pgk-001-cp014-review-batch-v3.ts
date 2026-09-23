import {
  PGK_001_CP014_QL_NAMES,
  type Pgk001Cp014ReviewQuestion,
} from "./pgk-001-cp014-review-batch-v1";
import { PGK_001_CP014_REVIEW_BATCH_V2 } from "./pgk-001-cp014-review-batch-v2";

type Revision = Readonly<{ stem: string; explanation: string }>;

const revisions: readonly Revision[] = Object.freeze([
  { stem: "In which year was Dal Khalsa organised?", explanation: "Dal Khalsa was organised in 1748 at Amritsar. It brought Sikh fighting groups under a broader common military organisation." },
  { stem: "At which place was Dal Khalsa organised in 1748?", explanation: "Dal Khalsa was organised at Amritsar in 1748. Amritsar also remained the main meeting centre for important collective Sikh decisions." },
  { stem: "Who organised Dal Khalsa in 1748?", explanation: "Nawab Kapur Singh organised Dal Khalsa at Amritsar in 1748. He had earlier played an important role in organising Sikh fighting groups into larger units." },
  { stem: "Who became the chief commander of Dal Khalsa?", explanation: "Jassa Singh Ahluwalia became the chief commander of Dal Khalsa. He later emerged as one of the leading figures of the Sikh confederacy." },
  { stem: "How many major misls were there in the Sikh confederacy?", explanation: "The Sikh confederacy consisted of twelve major misls. Each misl had its own chief and territory, while common matters could be taken up collectively." },
  { stem: "Which option correctly matches Dal Khalsa with its year, place and leaders?", explanation: "Dal Khalsa was organised at Amritsar in 1748 under Nawab Kapur Singh. Jassa Singh Ahluwalia became its chief commander." },

  { stem: "Who organised Budha Dal and Taruna Dal?", explanation: "Nawab Kapur Singh organised the Sikh fighting groups into Budha Dal and Taruna Dal. This division helped separate the older veterans from the younger fighting force." },
  { stem: "Which group formed the Budha Dal?", explanation: "Budha Dal consisted of older veterans, generally above the age of 40 in the PSEB account. Younger fighters formed the Taruna Dal." },
  { stem: "Which group formed the Taruna Dal?", explanation: "Taruna Dal consisted of younger fighters. Budha Dal contained the older veterans." },
  { stem: "Into how many jathas was Taruna Dal divided?", explanation: "Taruna Dal was divided into five jathas. Each jatha functioned under its own leader within the wider Sikh military organisation." },
  { stem: "What was the general assembly of the Sikhs at Amritsar called?", explanation: "The general Sikh assembly was called Sarbat Khalsa. It met at Amritsar to discuss important matters affecting the community as a whole." },
  { stem: "The resolutions passed by the Sarbat Khalsa were called:", explanation: "The collective resolutions of the Sarbat Khalsa were called Gurmata. These decisions dealt with important common political and military matters." },

  { stem: "The term 'Misl' is derived from which language?", explanation: "The term Misl is derived from Arabic. In eighteenth-century Punjab, it came to be used for the major Sikh confederate groups." },
  { stem: "What was the main purpose of the Rakhi system?", explanation: "Rakhi was a protection arrangement for villages. A village paid a fixed share of revenue to a Sikh chief in return for protection from raids and outside attack." },
  { stem: "Under the Rakhi system, what share of estimated village revenue was paid for protection?", explanation: "A protected village paid one-fifth of its estimated revenue under the Rakhi system. In return, the Sikh chief undertook to protect the village and its property." },
  { stem: "Which statement correctly distinguishes Sarbat Khalsa from Gurmata?", explanation: "Sarbat Khalsa was the collective assembly of the Sikhs. Gurmata was the decision or resolution adopted by that assembly." },
  { stem: "What was a collective decision on matters such as security and military strategy called?", explanation: "Such a collective decision was called a Gurmata. Gurmatas could deal with common security, military action and disputes among Sikh chiefs." },
  { stem: "Which pair is correctly matched?", explanation: "Rakhi was a village-protection system. Sarbat Khalsa was the assembly, while Gurmata referred to a collective decision taken there." },

  { stem: "Who founded the Faizalpuria Misl?", explanation: "Nawab Kapur Singh founded the Faizalpuria Misl. The same misl was also called the Singhpuria Misl." },
  { stem: "Who founded the Ahluwalia Misl?", explanation: "Jassa Singh Ahluwalia founded the Ahluwalia Misl. He also became a major commander of Dal Khalsa." },
  { stem: "Who founded the Ramgarhia Misl?", explanation: "Jassa Singh Ramgarhia founded the Ramgarhia Misl. The name Ramgarhia developed from Ramgarh at Amritsar." },
  { stem: "Who founded the Sukerchakia Misl?", explanation: "Charat Singh founded the Sukerchakia Misl. This misl later became important in the rise of Ranjit Singh." },
  { stem: "Who founded the Kanhaiya Misl?", explanation: "Jai Singh Kanhaiya founded the Kanhaiya Misl. It became one of the important Sikh misls of eighteenth-century Punjab." },
  { stem: "Who founded the Bhangi Misl?", explanation: "Chhajja Singh is given as the founder of the Bhangi Misl. The Bhangi chiefs later controlled important territory, including parts of Amritsar." },

  { stem: "Faizalpuria Misl was also called:", explanation: "Faizalpuria Misl was also called Singhpuria Misl. Both names refer to the same Sikh misl." },
  { stem: "Karorsinghia Misl was also called:", explanation: "Karorsinghia Misl was also called Panjgarhia Misl. The two names are used for the same misl in Punjab history." },
  { stem: "Shahid Misl was also called:", explanation: "Shahid Misl was also called Nihang Misl. Baba Deep Singh was one of its prominent leaders." },
  { stem: "Baba Deep Singh was a prominent leader of which misl?", explanation: "Baba Deep Singh was a prominent leader of the Shahid Misl. This misl was also called the Nihang Misl." },
  { stem: "Tara Singh Gheba was a prominent leader of which misl?", explanation: "Tara Singh Gheba was a prominent leader of the Dallewalia Misl. He is one of the better-known chiefs of the misl period." },
  { stem: "Who received the title 'Sultan-ul-Qaum'?", explanation: "Jassa Singh Ahluwalia received the title Sultan-ul-Qaum. He later became one of the most important leaders of Dal Khalsa and the Sikh confederacy." },

  { stem: "Which group of misls controlled different parts of Amritsar during the misl period?", explanation: "Ahluwalia, Ramgarhia, Kanhaiya and Bhangi misls controlled different parts of Amritsar. The city remained divided among these powers before later political consolidation." },
  { stem: "Which of the following misls did NOT control a part of Amritsar during the misl period?", explanation: "Sukerchakia Misl was not one of the four misls that controlled parts of Amritsar. Those four were Ahluwalia, Ramgarhia, Kanhaiya and Bhangi." },
  { stem: "Who rebuilt Ram Rauni and renamed it Ramgarh at Amritsar?", explanation: "Jassa Singh Ramgarhia rebuilt Ram Rauni and renamed it Ramgarh. The Ramgarhia name later developed from this fort." },
  { stem: "The name 'Ramgarhia' developed from which fort at Amritsar?", explanation: "The name Ramgarhia developed from Ramgarh. Jassa Singh Ramgarhia had rebuilt Ram Rauni and renamed it Ramgarh." },
  { stem: "Which Misl-leader-city combination is correctly matched?", explanation: "Ramgarhia Misl, Jassa Singh Ramgarhia and Amritsar form the correct combination. The Ramgarhia Misl controlled part of Amritsar during the confederacy period." },
  { stem: "Which statement is correct about the Ahluwalia, Ramgarhia, Kanhaiya and Bhangi misls in Amritsar?", explanation: "Each of these four misls controlled a part of Amritsar during the misl period. Their separate holdings show the divided political control of the city before later consolidation." },

  { stem: "Which sequence correctly shows how a common Sikh decision was taken?", explanation: "The Sarbat Khalsa met first, and a collective resolution could then be adopted as a Gurmata. The chiefs were expected to act on such common decisions." },
  { stem: "Which set of Misl-founder pairs is correctly matched?", explanation: "Faizalpuria was founded by Nawab Kapur Singh, Ahluwalia by Jassa Singh Ahluwalia and Sukerchakia by Charat Singh. These are important leader-misl relations of eighteenth-century Punjab." },
  { stem: "Which set of alternate Misl names is correctly matched?", explanation: "Faizalpuria was also called Singhpuria, Karorsinghia was also called Panjgarhia, and Shahid was also called Nihang. These alternate names refer to the same respective misls." },
  { stem: "Consider the following statements about Dal Khalsa:\nI. It was organised at Amritsar in 1748.\nII. Jassa Singh Ahluwalia became its chief commander.\nIII. The Sikh confederacy consisted of twelve major misls.\nWhich of the statements given above are correct?", explanation: "All three statements are correct. Dal Khalsa was organised in 1748, Jassa Singh Ahluwalia became its chief commander, and twelve major misls made up the Sikh confederacy." },
  { stem: "Consider the following pairs:\nI. Budha Dal — older veterans\nII. Taruna Dal — younger fighters\nIII. Rakhi — village protection\nIV. Gurmata — collective decision\nWhich of the pairs given above are correctly matched?", explanation: "All four pairs are correctly matched. Together they cover the main military and collective-decision arrangements of the Sikh confederacy period." },
  { stem: "Which statement correctly places the Misl period in Punjab history?", explanation: "The Dal Khalsa and misl period came before Maharaja Ranjit Singh built the Sikh Empire. Ranjit Singh later brought many separate Sikh territories under a more centralised state." },
]);

if (revisions.length !== PGK_001_CP014_REVIEW_BATCH_V2.length) {
  throw new Error(`CP014 V3 revision count mismatch: ${revisions.length}`);
}

export const PGK_001_CP014_REVIEW_BATCH_V3: readonly Pgk001Cp014ReviewQuestion[] = Object.freeze(
  PGK_001_CP014_REVIEW_BATCH_V2.map((question, index) => Object.freeze({
    ...question,
    stem: revisions[index].stem,
    explanation: revisions[index].explanation,
  })),
);

export function auditPgk001Cp014ReviewBatchV3() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to", "closely associated",
    "formed the standard confederacy framework", "standard confederacy framework",
    "pseb", "school history", "government of punjab", "district amritsar", "district kapurthala",
    "ministry of tourism", "source:", "website", "according to", "the correct answer is",
    "the correct option", "the other options", "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP014_REVIEW_BATCH_V3) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    const sentenceCount = question.explanation.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.correctIndex < 0 || question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (sentenceCount < 2 || sentenceCount > 3) issues.push(`${question.questionId}: explanation should be 2-3 sentences`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }

  for (const qlId of Object.keys(PGK_001_CP014_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP014_REVIEW_BATCH_V3.length,
  });
}
