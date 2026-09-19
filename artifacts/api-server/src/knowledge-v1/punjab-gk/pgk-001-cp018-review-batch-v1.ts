import { PGK_001_CP018_FACTS, PGK_001_CP018_SOURCE_IDS } from "./pgk-001-cp018-facts";

export type Pgk001Cp018Difficulty = "Easy" | "Medium" | "Hard";

export type Pgk001Cp018ReviewQuestion = Readonly<{
  id: string;
  qlId: string;
  difficulty: Pgk001Cp018Difficulty;
  question: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  reviewOnly: true;
  factIds: readonly string[];
  sourceIds: readonly string[];
  runtimeRegistered: false;
}>;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-119": ["partition-1947","east-punjab-india","west-punjab-pakistan","lahore-pakistan","partition-displacement"],
  "PGK-001-QL-120": ["lahore-pakistan","chandigarh-site-1948","chandigarh-foundation-1952","chandigarh-capital-pre1966","chandigarh-ut-1966"],
  "PGK-001-QL-121": ["pepsu-full-form","pepsu-inaugurated-1948","pepsu-eight-states","pepsu-patiala-member"],
  "PGK-001-QL-122": ["pepsu-merged-1956","pepsu-merger-date","pepsu-high-court-merged"],
  "PGK-001-QL-123": ["punjab-reorganisation-act-1966","appointed-day-1966","haryana-formed-1966","chandigarh-ut-1966","hill-territories-himachal"],
  "PGK-001-QL-124": ["appointed-day-1966","haryana-formed-1966","chandigarh-ut-1966","chandigarh-shared-capital","hill-territories-himachal"],
  "PGK-001-QL-125": ["partition-1947","lahore-pakistan","chandigarh-site-1948","pepsu-inaugurated-1948","pepsu-merged-1956","punjab-reorganisation-act-1966","appointed-day-1966","haryana-formed-1966","chandigarh-ut-1966","chandigarh-shared-capital"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceKeys = (PGK_001_CP018_FACTS as readonly { id: string; sourceKeys: readonly string[] }[])
    .filter((fact) => factSet.has(fact.id))
    .flatMap((fact) => fact.sourceKeys);
  const sourceIds = [...new Set(sourceKeys.map((key) => PGK_001_CP018_SOURCE_IDS[key as keyof typeof PGK_001_CP018_SOURCE_IDS]))];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

const q = (
  id: string,
  ql: number,
  difficulty: Pgk001Cp018Difficulty,
  question: string,
  options: readonly [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
): Pgk001Cp018ReviewQuestion => {
  const qlId = `PGK-001-QL-${ql}`;
  return Object.freeze({
  id,
  qlId,
  difficulty,
  question,
  options,
  correctIndex,
  explanation,
  ...provenanceForQl(qlId),
  reviewOnly: true,
  runtimeRegistered: false,
  });
};

export const PGK_001_CP018_REVIEW_BATCH_V1 = Object.freeze([
  q("PGK-001-CP018-Q001",119,"Easy","The Punjab province was divided between India and Pakistan in which year?",["1947","1948","1956","1966"],0,"Punjab was divided at the time of the Partition of India in 1947. The former province was split into eastern and western parts."),
  q("PGK-001-CP018-Q002",119,"Easy","After the 1947 Partition, West Punjab became part of which country?",["Pakistan","India","Nepal","Afghanistan"],0,"West Punjab became part of Pakistan after Partition in 1947. East Punjab became part of India."),
  q("PGK-001-CP018-Q003",119,"Easy","Which major city of undivided Punjab became part of Pakistan in 1947?",["Lahore","Amritsar","Ludhiana","Patiala"],0,"Lahore became part of Pakistan after the division of Punjab in 1947. This left Indian Punjab without its former provincial capital."),
  q("PGK-001-CP018-Q004",119,"Medium","Which statement correctly describes the division of Punjab in 1947?",["East Punjab became part of India and West Punjab became part of Pakistan","East Punjab became part of Pakistan and West Punjab became part of India","Both East and West Punjab became part of India","Both East and West Punjab became separate countries"],0,"Partition divided the former Punjab province into an eastern part in India and a western part in Pakistan. The division also caused large-scale population displacement."),
  q("PGK-001-CP018-Q005",119,"Medium","One major immediate consequence of the 1947 Partition in Punjab was:",["Large-scale population displacement","Formation of Haryana","Merger of PEPSU with Punjab","Declaration of Chandigarh as a Union Territory"],0,"Partition caused very large population movements across Punjab in 1947. Communities moved across the new India-Pakistan boundary amid severe violence and disruption."),
  q("PGK-001-CP018-Q006",119,"Hard","Which pair is correctly matched for 1947?",["East Punjab — India","West Punjab — India","Lahore — East Punjab in India","Chandigarh — Union Territory"],0,"East Punjab formed the Indian part of the divided province in 1947. West Punjab and Lahore became part of Pakistan."),

  q("PGK-001-CP018-Q007",120,"Easy","Why did Indian Punjab need a new capital after 1947?",["Lahore became part of Pakistan","Patiala became part of Pakistan","Amritsar became a Union Territory","Delhi was merged with Punjab"],0,"Lahore, the former provincial capital, became part of Pakistan in 1947. Indian Punjab therefore needed a new administrative capital."),
  q("PGK-001-CP018-Q008",120,"Easy","The site for Chandigarh as Punjab's new capital was approved in:",["1948","1947","1952","1966"],0,"The Punjab Government, in consultation with the Government of India, approved the Chandigarh site in March 1948. The site lay near the Shivalik foothills."),
  q("PGK-001-CP018-Q009",120,"Easy","Chandigarh was planned near which physical feature?",["Shivalik foothills","Aravalli hills","Western Ghats","Vindhya plateau"],0,"The Chandigarh site was chosen near the foothills of the Shivaliks. It was selected as the new capital area for post-Partition Punjab."),
  q("PGK-001-CP018-Q010",120,"Medium","The foundation stone of Chandigarh was laid in:",["1952","1948","1956","1966"],0,"The foundation stone of Chandigarh was laid in 1952. The city developed as the new capital of Punjab after Lahore went to Pakistan."),
  q("PGK-001-CP018-Q011",120,"Medium","From 1952 until the 1966 reorganisation, Chandigarh served as the capital of:",["Punjab","PEPSU only","Haryana only","Himachal Pradesh only"],0,"Chandigarh served as Punjab's capital from 1952 to the reorganisation of 1966. After reorganisation it became a Union Territory and the shared capital of Punjab and Haryana."),
  q("PGK-001-CP018-Q012",120,"Hard","Which sequence correctly describes Chandigarh's post-Partition development?",["Site approved in 1948 → foundation stone in 1952 → Union Territory in 1966","Foundation stone in 1947 → site approved in 1956 → Union Territory in 1966","Union Territory in 1948 → foundation stone in 1952 → capital of Pakistan in 1966","Site approved in 1952 → Union Territory in 1956 → foundation stone in 1966"],0,"The Chandigarh site was approved in 1948 and its foundation stone was laid in 1952. It became a Union Territory when Punjab was reorganised on 1 November 1966."),

  q("PGK-001-CP018-Q013",121,"Easy","What is the full form of PEPSU?",["Patiala and East Punjab States Union","Punjab and Eastern Provinces State Union","Patiala and Eastern Punjab State Unit","Punjab East Princely States Union"],0,"PEPSU stood for Patiala and East Punjab States Union. It brought together several princely states of the Punjab region after independence."),
  q("PGK-001-CP018-Q014",121,"Easy","PEPSU was inaugurated in:",["1948","1947","1950","1956"],0,"The Patiala and East Punjab States Union was inaugurated on 15 July 1948. It was formed through the union of eight princely states."),
  q("PGK-001-CP018-Q015",121,"Easy","Which princely state was part of PEPSU?",["Patiala","Amritsar","Ludhiana","Jalandhar"],0,"Patiala was one of the princely states that formed PEPSU. The union also included states such as Nabha, Jind, Kapurthala, Faridkot and Malerkotla."),
  q("PGK-001-CP018-Q016",121,"Medium","Which of the following was NOT one of the princely states that formed PEPSU?",["Amritsar","Nabha","Kapurthala","Faridkot"],0,"Amritsar was not a princely state included in PEPSU. PEPSU was created from eight princely states, including Patiala, Nabha, Kapurthala and Faridkot."),
  q("PGK-001-CP018-Q017",121,"Medium","How many princely states were combined to form PEPSU in 1948?",["Eight","Five","Six","Ten"],0,"PEPSU was formed from eight princely states in 1948. The union included six salute states and the smaller states of Nalagarh and Kalsia."),
  q("PGK-001-CP018-Q018",121,"Hard","Which set contains only states that formed PEPSU?",["Patiala, Nabha, Jind, Kapurthala","Amritsar, Ludhiana, Jalandhar, Patiala","Lahore, Patiala, Faridkot, Shimla","Hoshiarpur, Nabha, Ambala, Kalsia"],0,"Patiala, Nabha, Jind and Kapurthala were all constituent states of PEPSU. The union also included Faridkot, Malerkotla, Nalagarh and Kalsia."),

  q("PGK-001-CP018-Q019",122,"Easy","PEPSU was merged with Punjab in:",["1956","1948","1950","1966"],0,"PEPSU was merged into Punjab in 1956. The merger took effect during the nationwide reorganisation of states."),
  q("PGK-001-CP018-Q020",122,"Easy","Which law provided for the 1956 reorganisation under which PEPSU merged with Punjab?",["States Reorganisation Act, 1956","Punjab Reorganisation Act, 1966","Indian Independence Act, 1947","Government of India Act, 1935"],0,"The States Reorganisation Act, 1956 reorganised state boundaries across India. Under it, PEPSU was merged with Punjab."),
  q("PGK-001-CP018-Q021",122,"Medium","The merger of PEPSU with Punjab took effect on:",["1 November 1956","15 July 1948","26 January 1950","1 November 1966"],0,"The reorganisation that merged PEPSU with Punjab took effect on 1 November 1956. This created a larger Punjab before the next major reorganisation in 1966."),
  q("PGK-001-CP018-Q022",122,"Medium","What happened to the PEPSU High Court after the 1956 merger?",["It was merged into the Punjab High Court","It became the Supreme Court of Punjab","It moved to Lahore","It became the Haryana High Court"],0,"After PEPSU merged with Punjab in 1956, the PEPSU High Court was also merged into the Punjab High Court. Its judges became judges of the Punjab High Court."),
  q("PGK-001-CP018-Q023",122,"Medium","Which statement about the 1956 reorganisation is correct?",["PEPSU was merged with Punjab","Haryana was created","Chandigarh became a Union Territory","Punjab was partitioned between India and Pakistan"],0,"The 1956 reorganisation merged PEPSU into Punjab. Haryana and the Union Territory of Chandigarh were created later under the 1966 reorganisation."),
  q("PGK-001-CP018-Q024",122,"Hard","Which is the correct chronological order?",["PEPSU formed → PEPSU merged with Punjab → Punjab reorganised into Punjab and Haryana","PEPSU merged with Punjab → PEPSU formed → Punjab reorganised into Punjab and Haryana","Punjab reorganised into Punjab and Haryana → PEPSU formed → PEPSU merged with Punjab","PEPSU formed → Punjab reorganised into Punjab and Haryana → PEPSU merged with Punjab"],0,"PEPSU was formed in 1948 and merged with Punjab in 1956. The enlarged Punjab was reorganised again in 1966, creating Haryana and the present-day Punjab framework."),

  q("PGK-001-CP018-Q025",123,"Easy","Which law reorganised Punjab in 1966?",["Punjab Reorganisation Act, 1966","States Reorganisation Act, 1956","Indian Independence Act, 1947","Government of India Act, 1935"],0,"Parliament enacted the Punjab Reorganisation Act in 1966. The Act provided for the reorganisation of the existing State of Punjab."),
  q("PGK-001-CP018-Q026",123,"Easy","The Punjab Reorganisation Act was enacted on:",["18 September 1966","1 November 1966","31 August 1956","15 July 1948"],0,"The Punjab Reorganisation Act, 1966 was enacted on 18 September 1966. Its appointed day for territorial reorganisation was 1 November 1966."),
  q("PGK-001-CP018-Q027",123,"Easy","What was the appointed day under the Punjab Reorganisation Act, 1966?",["1 November 1966","18 September 1966","1 November 1956","26 January 1950"],0,"The Act defined 1 November 1966 as the appointed day. The territorial changes took effect from that date."),
  q("PGK-001-CP018-Q028",123,"Easy","Which new state was formed from part of the existing Punjab on 1 November 1966?",["Haryana","Rajasthan","Himachal Pradesh","Delhi"],0,"Haryana was formed from specified territories of the existing Punjab on 1 November 1966. The change was made under the Punjab Reorganisation Act, 1966."),
  q("PGK-001-CP018-Q029",123,"Medium","What happened to Chandigarh under the Punjab Reorganisation Act, 1966?",["It became a Union Territory","It became part of Pakistan","It was merged into PEPSU","It became part of Rajasthan"],0,"Chandigarh became a Union Territory on 1 November 1966. It continued to serve as the capital of both Punjab and Haryana."),
  q("PGK-001-CP018-Q030",123,"Medium","Under the 1966 reorganisation, some hill territories of Punjab were transferred to:",["Himachal Pradesh","Jammu and Kashmir","Rajasthan","Delhi"],0,"The 1966 Act transferred specified hill territories from Punjab to Himachal Pradesh. At the time, Himachal Pradesh was a Union Territory."),

  q("PGK-001-CP018-Q031",124,"Easy","Which city became the shared capital of Punjab and Haryana after the 1966 reorganisation?",["Chandigarh","Amritsar","Ludhiana","Patiala"],0,"Chandigarh became a Union Territory in 1966 while serving as the capital of both Punjab and Haryana. This arrangement followed the division of the former state."),
  q("PGK-001-CP018-Q032",124,"Easy","Haryana came into existence on:",["1 November 1966","18 September 1966","1 November 1956","15 August 1947"],0,"Haryana came into existence on 1 November 1966. That was the appointed day under the Punjab Reorganisation Act."),
  q("PGK-001-CP018-Q033",124,"Medium","Which of the following was NOT an outcome of the Punjab Reorganisation Act, 1966?",["Formation of PEPSU","Formation of Haryana","Creation of the Union Territory of Chandigarh","Transfer of some hill territories to Himachal Pradesh"],0,"PEPSU had been formed much earlier, in 1948. The 1966 Act created Haryana, made Chandigarh a Union Territory and transferred specified hill territories to Himachal Pradesh."),
  q("PGK-001-CP018-Q034",124,"Medium","Which statement about Chandigarh after 1 November 1966 is correct?",["It was a Union Territory and capital of both Punjab and Haryana","It became the capital of Haryana only","It became part of Himachal Pradesh","It remained solely within the State of Punjab"],0,"From 1 November 1966, Chandigarh functioned as a Union Territory under the Central Government. It also served as the capital of both Punjab and Haryana."),
  q("PGK-001-CP018-Q035",124,"Medium","What was the principal state-level result of the 1966 Punjab reorganisation?",["A reorganised Punjab and the new State of Haryana","Punjab and PEPSU becoming separate states","Punjab and Pakistan becoming one state","Punjab being merged into Delhi"],0,"The Punjab Reorganisation Act created Haryana from specified territories and left a reorganised State of Punjab. It also dealt separately with Chandigarh and transferred specified hill territories."),
  q("PGK-001-CP018-Q036",124,"Hard","Which set correctly lists three territorial outcomes of the 1966 reorganisation?",["Haryana formed; Chandigarh made a Union Territory; some hill areas transferred to Himachal Pradesh","PEPSU formed; Lahore transferred to India; Chandigarh merged with Himachal Pradesh","Haryana formed; PEPSU created; Delhi merged with Punjab","West Punjab formed; Chandigarh transferred to Pakistan; Patiala made a Union Territory"],0,"The 1966 reorganisation created Haryana, constituted Chandigarh as a Union Territory and transferred specified hill territories to Himachal Pradesh. These changes took effect on 1 November 1966."),

  q("PGK-001-CP018-Q037",125,"Hard","Which is the correct chronological order?",["Partition of Punjab → formation of PEPSU → merger of PEPSU with Punjab → Punjab Reorganisation Act takes effect","Formation of PEPSU → Partition of Punjab → Punjab Reorganisation Act takes effect → merger of PEPSU with Punjab","Merger of PEPSU with Punjab → Partition of Punjab → formation of PEPSU → Punjab Reorganisation Act takes effect","Punjab Reorganisation Act takes effect → formation of PEPSU → Partition of Punjab → merger of PEPSU with Punjab"],0,"Punjab was partitioned in 1947, PEPSU was formed in 1948 and merged with Punjab in 1956. The Punjab Reorganisation Act then took effect on 1 November 1966."),
  q("PGK-001-CP018-Q038",125,"Hard","Which place-status set is correctly matched?",["Lahore — Pakistan after 1947; Patiala — constituent of PEPSU; Chandigarh — Union Territory after 1966","Lahore — Indian Punjab after 1947; Patiala — Pakistan; Chandigarh — PEPSU","Lahore — Union Territory; Patiala — Haryana; Chandigarh — Pakistan","Lahore — PEPSU; Patiala — Himachal Pradesh; Chandigarh — West Punjab"],0,"Lahore became part of Pakistan in 1947, while Patiala became a major constituent of PEPSU. Chandigarh became a Union Territory during the 1966 reorganisation."),
  q("PGK-001-CP018-Q039",125,"Hard","Which legislation-year pair is correctly matched?",["States Reorganisation Act — 1956; Punjab Reorganisation Act — 1966","States Reorganisation Act — 1966; Punjab Reorganisation Act — 1956","States Reorganisation Act — 1948; Punjab Reorganisation Act — 1950","States Reorganisation Act — 1947; Punjab Reorganisation Act — 1948"],0,"The States Reorganisation Act belongs to 1956 and was the law under which PEPSU merged with Punjab. The Punjab Reorganisation Act belongs to 1966 and reorganised Punjab again."),
  q("PGK-001-CP018-Q040",125,"Hard","Consider the following statements:\nI. PEPSU was inaugurated in 1948.\nII. PEPSU merged with Punjab in 1956.\nIII. Haryana was formed in 1966.\nWhich of the statements given above are correct?",["I only","I and II only","II and III only","I, II and III"],3,"All three statements are correct. They mark three major stages in the administrative reshaping of post-independence Punjab."),
  q("PGK-001-CP018-Q041",125,"Hard","Which statement correctly distinguishes the 1956 and 1966 reorganisations?",["The 1956 reorganisation merged PEPSU with Punjab, while the 1966 reorganisation created Haryana and the Union Territory of Chandigarh","The 1956 reorganisation created Haryana, while the 1966 reorganisation formed PEPSU","Both reorganisations only changed the capital and did not alter territory","The 1956 reorganisation partitioned India, while the 1966 reorganisation created Pakistan"],0,"The 1956 change absorbed PEPSU into Punjab under the States Reorganisation Act. The 1966 Act later created Haryana, made Chandigarh a Union Territory and transferred specified hill areas."),
  q("PGK-001-CP018-Q042",125,"Hard","Which sequence correctly traces Punjab's post-1947 capital and administrative changes?",["Lahore lost as capital in 1947 → Chandigarh site approved in 1948 → Chandigarh became Punjab's capital → Chandigarh became a Union Territory in 1966","Chandigarh became a Union Territory in 1947 → Lahore became Punjab's capital in 1948 → PEPSU moved to Lahore in 1956 → Chandigarh joined Pakistan in 1966","Lahore remained Punjab's capital after 1947 → Chandigarh joined PEPSU in 1956 → Patiala became a Union Territory in 1966","Patiala became Pakistan's capital in 1947 → Chandigarh site approved in 1956 → Lahore became a Union Territory in 1966"],0,"After Lahore became part of Pakistan in 1947, Indian Punjab required a new capital and approved the Chandigarh site in 1948. Chandigarh later served as Punjab's capital and became a Union Territory in the 1966 reorganisation."),
] as const);

const bannedLearnerPhrases = [
  "associated with",
  "closely associated",
  "linked with",
  "closely linked",
  "known for",
  "formed the framework",
  "according to",
  "official report",
  "website",
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "generator",
] as const;

export function auditPgk001Cp018ReviewBatchV1() {
  const errors: string[] = [];
  if (PGK_001_CP018_REVIEW_BATCH_V1.length !== 42) errors.push("Expected exactly 42 questions.");

  const qlCounts = new Map<string, number>();
  for (const item of PGK_001_CP018_REVIEW_BATCH_V1) {
    qlCounts.set(item.qlId, (qlCounts.get(item.qlId) ?? 0) + 1);
    if (item.options.length !== 4) errors.push(`${item.id}: expected 4 options.`);
    if (new Set(item.options).size !== 4) errors.push(`${item.id}: duplicate option.`);
    if (item.correctIndex < 0 || item.correctIndex > 3) errors.push(`${item.id}: invalid correctIndex.`);
    if (!item.reviewOnly || item.runtimeRegistered) errors.push(`${item.id}: runtime guard invalid.`);

    const learner = `${item.question}\n${item.explanation}`.toLowerCase();
    for (const phrase of bannedLearnerPhrases) {
      if (learner.includes(phrase)) errors.push(`${item.id}: banned learner phrase: ${phrase}`);
    }

    const sentenceCount = item.explanation.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
    if (sentenceCount < 1 || sentenceCount > 3) errors.push(`${item.id}: explanation should be 1–3 sentences.`);
  }

  for (let ql = 119; ql <= 125; ql += 1) {
    const id = `PGK-001-QL-${ql}`;
    if (qlCounts.get(id) !== 6) errors.push(`${id}: expected 6 questions.`);
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
