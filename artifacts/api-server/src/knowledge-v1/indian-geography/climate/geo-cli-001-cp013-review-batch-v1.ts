import { GEO_CLI_001_CP001_REVIEW_BATCH_V4 } from "./geo-cli-001-cp001-review-batch-v4";
import { GEO_CLI_001_CP002_REVIEW_BATCH_V4 } from "./geo-cli-001-cp002-review-batch-v4";
import { GEO_CLI_001_CP003_REVIEW_BATCH_V2 } from "./geo-cli-001-cp003-review-batch-v2";
import { GEO_CLI_001_CP004_REVIEW_BATCH_V2 } from "./geo-cli-001-cp004-review-batch-v2";
import { GEO_CLI_001_CP005_REVIEW_BATCH_V1 } from "./geo-cli-001-cp005-review-batch-v1";
import { GEO_CLI_001_CP006_REVIEW_BATCH_V2 } from "./geo-cli-001-cp006-review-batch-v2";
import { GEO_CLI_001_CP007_REVIEW_BATCH_V1 } from "./geo-cli-001-cp007-review-batch-v1";
import { GEO_CLI_001_CP008_REVIEW_BATCH_V2 } from "./geo-cli-001-cp008-review-batch-v2";
import { GEO_CLI_001_CP009_REVIEW_BATCH_V2 } from "./geo-cli-001-cp009-review-batch-v2";
import { GEO_CLI_001_CP010_REVIEW_BATCH_V3 } from "./geo-cli-001-cp010-review-batch-v3";
import { GEO_CLI_001_CP011_REVIEW_BATCH_V1 } from "./geo-cli-001-cp011-review-batch-v1";

export type GeoCli001Cp013Difficulty = "Easy" | "Medium" | "Hard";

type OwningQuestion = {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp013Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export interface GeoCli001Cp013Question extends OwningQuestion {
  questionId: string;
  sourceQuestionId: string;
  reviewOnly: true;
  runtimeRegistered: false;
}

const OLD_BATCHES: readonly (readonly OwningQuestion[])[] = [
  GEO_CLI_001_CP001_REVIEW_BATCH_V4,
  GEO_CLI_001_CP002_REVIEW_BATCH_V4,
  GEO_CLI_001_CP003_REVIEW_BATCH_V2,
  GEO_CLI_001_CP004_REVIEW_BATCH_V2,
  GEO_CLI_001_CP005_REVIEW_BATCH_V1,
  GEO_CLI_001_CP006_REVIEW_BATCH_V2,
  GEO_CLI_001_CP007_REVIEW_BATCH_V1,
  GEO_CLI_001_CP008_REVIEW_BATCH_V2,
  GEO_CLI_001_CP009_REVIEW_BATCH_V2,
  GEO_CLI_001_CP010_REVIEW_BATCH_V3,
  GEO_CLI_001_CP011_REVIEW_BATCH_V1,
];

const CP012_SYNC_SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-I-CLIMATE",
  "NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE",
  "IMD-STATIC-MONSOON-CLIMATE",
]);

const CP012_REPRESENTATIVES: readonly OwningQuestion[] = Object.freeze([
  { questionId:"GEO-CLI-001-CP012-Q001", qlId:"GEO-CLI-001-QL-100", qlName:"Integrated climate controls", difficulty:"Easy", stem:"Which pair correctly links a climate control with its main effect in India?", options:["Altitude — lower temperature at greater height","Longitude — monsoon reversal","Soil type — winter western disturbances","River direction — coastal temperature range"], correctIndex:0, canonicalAnswer:"Altitude — lower temperature at greater height", explanation:"Altitude lowers temperature as height increases, so high hill stations are cooler than nearby plains at similar latitude.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["ALTITUDE-TEMP"] },
  { questionId:"GEO-CLI-001-CP012-Q009", qlId:"GEO-CLI-001-QL-101", qlName:"Integrated seasonal sequence", difficulty:"Medium", stem:"A place is very hot in May, receives sudden heavy rain in June, and becomes drier by October. Which sequence fits this change?", options:["Hot weather → monsoon onset → monsoon withdrawal","Cold weather → western disturbance → summer heat","Retreating monsoon → cold wave → monsoon burst","Monsoon withdrawal → hot weather → winter rainfall"], correctIndex:0, canonicalAnswer:"Hot weather → monsoon onset → monsoon withdrawal", explanation:"Severe May heat is followed by southwest monsoon onset in June, while October marks withdrawal from many northern and central regions.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["HOT-TO-MONSOON","MONSOON-WITHDRAWAL"] },
  { questionId:"GEO-CLI-001-CP012-Q015", qlId:"GEO-CLI-001-QL-102", qlName:"Integrated monsoon mechanism", difficulty:"Medium", stem:"Which combination best supports the onset of the southwest monsoon over India?", options:["Strong continental low pressure and moisture-bearing oceanic flow","High pressure over northwest India and dry continental winds","Weak summer heating and permanent winter circulation","Only local sea breezes with no pressure contrast"], correctIndex:0, canonicalAnswer:"Strong continental low pressure and moisture-bearing oceanic flow", explanation:"Summer heating creates a strong land–ocean pressure contrast, while moist winds from the Indian Ocean provide the air needed for widespread monsoon rain.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["SUMMER-LOW-PRESSURE","MONSOON-ONSHORE-FLOW"] },
  { questionId:"GEO-CLI-001-CP012-Q019", qlId:"GEO-CLI-001-QL-103", qlName:"Integrated rainfall distribution", difficulty:"Easy", stem:"Which region is most likely to receive heavy monsoon rain because moist winds rise against the Western Ghats?", options:["The windward west coast","The interior Deccan rain shadow","Western Rajasthan","The upper Indus plain"], correctIndex:0, canonicalAnswer:"The windward west coast", explanation:"Moist Arabian Sea winds rise along the western slopes of the Western Ghats and produce heavy orographic rainfall on the windward coast.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["WESTERN-GHATS-WINDWARD"] },
  { questionId:"GEO-CLI-001-CP012-Q027", qlId:"GEO-CLI-001-QL-104", qlName:"Integrated weather systems and large-scale influences", difficulty:"Medium", stem:"Which pairing correctly links a weather system with its main Indian climate effect?", options:["Western disturbance — winter rain in northwest India","ENSO — guaranteed drought every year","Loo — October rain on the Tamil Nadu coast","Tropical easterly jet — winter snowfall over Punjab"], correctIndex:0, canonicalAnswer:"Western disturbance — winter rain in northwest India", explanation:"Western disturbances are an important source of winter precipitation in northwestern India; the other pairings mix unrelated systems and seasons.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["WESTERN-DISTURBANCES","NW-WINTER-RAIN"] },
  { questionId:"GEO-CLI-001-CP012-Q033", qlId:"GEO-CLI-001-QL-105", qlName:"Integrated region and season matching", difficulty:"Medium", stem:"Which set of region–climate links is correctly matched?", options:["Punjab—winter western disturbances; Meghalaya—very heavy relief rain","Punjab—northeast monsoon; Meghalaya—rain shadow","Punjab—main October cyclones; Meghalaya—loo winds","Punjab—sea moderation; Meghalaya—western Rajasthan dryness"], correctIndex:0, canonicalAnswer:"Punjab—winter western disturbances; Meghalaya—very heavy relief rain", explanation:"Punjab can receive useful winter rain from western disturbances, while Meghalaya's hills enhance monsoon uplift and produce very heavy rainfall.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["PUNJAB-WINTER-RAIN","MEGHALAYA-OROGRAPHIC"] },
  { questionId:"GEO-CLI-001-CP012-Q037", qlId:"GEO-CLI-001-QL-106", qlName:"Integrated climate cause and effect", difficulty:"Easy", stem:"Which cause–effect pair correctly explains a common Indian climate pattern?", options:["Sea proximity → smaller annual temperature range","High altitude → stronger summer heat","Rain shadow → heavier windward rain","Western disturbances → loo winds"], correctIndex:0, canonicalAnswer:"Sea proximity → smaller annual temperature range", explanation:"Large water bodies heat and cool slowly, so coastal places experience smaller seasonal temperature changes than far-inland locations.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["SEA-MODERATION"] },
  { questionId:"GEO-CLI-001-CP012-Q045", qlId:"GEO-CLI-001-QL-107", qlName:"Integrated multi-statement climate reasoning", difficulty:"Medium", stem:"For India's winter climate:\nI. Western disturbances can bring rain to the northwestern plains.\nII. Higher Himalayas can receive snowfall.\nIII. Loo winds are a typical winter feature.\nWhich statements are correct?", options:["I and II only","I only","II and III only","I, II and III"], correctIndex:0, canonicalAnswer:"I and II only", explanation:"Statements I and II are correct. Loo winds are hot, dry winds of the pre-monsoon hot weather season, not a winter feature.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["WESTERN-DISTURBANCES","HIMALAYAN-WINTER-SNOW","HOT-SEASON-LOO"] },
  { questionId:"GEO-CLI-001-CP012-Q054", qlId:"GEO-CLI-001-QL-108", qlName:"Mixed climate master integration", difficulty:"Hard", stem:"For a climate summary:\nI. Pressure reversal has no role in monsoon winds.\nII. Relief redistributes rainfall.\nIII. Sea influence reduces coastal temperature extremes.\nWhich are correct?", options:["II and III only","I and II only","I and III only","I, II and III"], correctIndex:0, canonicalAnswer:"II and III only", explanation:"Statements II and III are correct. Seasonal pressure reversal is important because it helps reverse the monsoon wind circulation.", sourceIds:CP012_SYNC_SOURCE_IDS, sourceFactIds:["MONSOON-WIND-REVERSAL","RELIEF-WINDWARD-LEEWARD","SEA-MODERATION"] },
]);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b/i;

function qlNumber(qlId: string): number {
  return Number(qlId.slice(-3));
}

function learnerText(question: OwningQuestion): string {
  return `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
}

function clean(question: OwningQuestion): boolean {
  return question.options.length === 4 &&
    new Set(question.options).size === 4 &&
    question.options[question.correctIndex] === question.canonicalAnswer &&
    !BANNED_LEARNER_TEXT.test(learnerText(question));
}

function pickSpaced(values: readonly number[], count: number): Set<number> {
  if (values.length < count) throw new Error(`Not enough eligible QLs: need ${count}, have ${values.length}`);
  const selected = new Set<number>();
  for (let i = 0; i < count; i += 1) selected.add(values[Math.floor((i * values.length) / count)]!);
  if (selected.size !== count) throw new Error(`Spaced selection collapsed: ${selected.size}/${count}`);
  return selected;
}

const OLD_POOL = OLD_BATCHES.flat().filter(clean);
const BY_QL = new Map<number, OwningQuestion[]>();
for (const question of OLD_POOL) {
  const n = qlNumber(question.qlId);
  if (n < 1 || n > 99) continue;
  const bucket = BY_QL.get(n) ?? [];
  bucket.push(question);
  BY_QL.set(n, bucket);
}

for (let n = 1; n <= 99; n += 1) {
  if (!(BY_QL.get(n)?.length)) throw new Error(`CP013 has no clean approved representative candidate for QL${String(n).padStart(3, "0")}`);
}

const hardEligible = Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => BY_QL.get(n)!.some((q) => q.difficulty === "Hard"));
const HARD_QLS = pickSpaced(hardEligible, 11);
const easyEligible = Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => !HARD_QLS.has(n) && BY_QL.get(n)!.some((q) => q.difficulty === "Easy"));
const EASY_QLS = pickSpaced(easyEligible, 33);

function chooseOldRepresentative(n: number): OwningQuestion {
  const bucket = BY_QL.get(n)!;
  const target: GeoCli001Cp013Difficulty = HARD_QLS.has(n) ? "Hard" : EASY_QLS.has(n) ? "Easy" : "Medium";
  return bucket.find((q) => q.difficulty === target) ?? bucket.find((q) => q.difficulty === "Medium") ?? bucket[0]!;
}

const SELECTED_OWNERS: readonly OwningQuestion[] = Object.freeze([
  ...Array.from({ length: 99 }, (_, i) => chooseOldRepresentative(i + 1)),
  ...CP012_REPRESENTATIVES,
]);

function rebalanceOptions(question: OwningQuestion, correctIndex: number): readonly string[] {
  const distractors = question.options.filter((option) => option !== question.canonicalAnswer);
  const options = [...distractors];
  options.splice(correctIndex, 0, question.canonicalAnswer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP013_REVIEW_BATCH_V1: readonly GeoCli001Cp013Question[] = Object.freeze(
  SELECTED_OWNERS.map((source, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-CLI-001-CP013-Q${String(index + 1).padStart(3, "0")}`,
      sourceQuestionId: source.questionId,
      qlId: source.qlId,
      qlName: source.qlName,
      difficulty: source.difficulty,
      stem: source.stem,
      options: rebalanceOptions(source, correctIndex),
      correctIndex,
      canonicalAnswer: source.canonicalAnswer,
      explanation: source.explanation,
      sourceIds: source.sourceIds,
      sourceFactIds: source.sourceFactIds,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export function auditGeoCli001Cp013ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceIds = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp013Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_CLI_001_CP013_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (sourceIds.has(question.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE:${question.sourceQuestionId}`);
    sourceIds.add(question.sourceQuestionId);
    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(normalizedStem);
    const semantic = `${normalizedStem}::${question.canonicalAnswer.toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.stem.length < 20 || question.stem.length > 240 || !question.stem.trim().endsWith("?")) issues.push(`STEM_SHAPE:${question.questionId}`);
    if (question.explanation.length < 45) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (BANNED_LEARNER_TEXT.test(learnerText(question))) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP013_REVIEW_BATCH_V1.length !== 108) issues.push(`COUNT:${GEO_CLI_001_CP013_REVIEW_BATCH_V1.length}`);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = `GEO-CLI-001-QL-${String(n).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 1) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (Object.keys(qlCounts).some((qlId) => qlNumber(qlId) < 1 || qlNumber(qlId) > 108)) issues.push("UNKNOWN_QL");
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "27,27,27,27") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (stems.size !== 108) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 108) issues.push(`SEMANTIC_COUNT:${semantics.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP013_REVIEW_BATCH_V1.length,
    qlCount: Object.keys(qlCounts).length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    semanticCount: semantics.size,
    synchronizedCp012Representatives: CP012_REPRESENTATIVES.length,
  });
}
