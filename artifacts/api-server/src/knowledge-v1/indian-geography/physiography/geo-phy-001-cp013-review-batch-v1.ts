import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP013_FACTS_V1 as facts } from "./geo-phy-001-cp013-facts";
import { GEO_PHY_001_CP013_ROWS_1_3 } from "./geo-phy-001-cp013-rows-1-3";
import { GEO_PHY_001_CP013_ROWS_4_6 } from "./geo-phy-001-cp013-rows-4-6";
import { GEO_PHY_001_CP013_ROWS_7_9 } from "./geo-phy-001-cp013-rows-7-9";

export type GeoPhy001Cp013ReviewQuestion = {
  questionId: string; qlId: string; qlName: string; difficulty: KnowledgeV1Difficulty;
  stem: string; options: readonly string[]; correctIndex: number; canonicalAnswer: string;
  explanation: string; sourceIds: readonly string[]; sourceFactIds: readonly string[];
  reviewOnly: true; runtimeRegistered: false;
};

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-001": "Major physiographic divisions",
  "GEO-PHY-001-QL-002": "Northern Plains formation",
  "GEO-PHY-001-QL-003": "Peninsular Plateau character",
  "GEO-PHY-001-QL-004": "Indian Desert location",
  "GEO-PHY-001-QL-005": "Coastal Plains overview",
  "GEO-PHY-001-QL-006": "Island groups overview",
  "GEO-PHY-001-QL-010": "Great Himalaya or Himadri",
  "GEO-PHY-001-QL-011": "Lesser Himalaya or Himachal",
  "GEO-PHY-001-QL-012": "Shiwalik range",
  "GEO-PHY-001-QL-019": "Bhabar belt",
  "GEO-PHY-001-QL-020": "Terai belt",
  "GEO-PHY-001-QL-022": "Khadar and Bhangar",
  "GEO-PHY-001-QL-028": "Central Highlands",
  "GEO-PHY-001-QL-029": "Deccan Plateau",
  "GEO-PHY-001-QL-038": "Indian Desert drainage",
  "GEO-PHY-001-QL-046": "Western Coastal Plain",
  "GEO-PHY-001-QL-050": "Eastern Coastal Plain and deltas",
  "GEO-PHY-001-QL-055": "Lakshadweep location",
  "GEO-PHY-001-QL-056": "Andaman and Nicobar location",
  "GEO-PHY-001-QL-057": "Lakshadweep character",
  "GEO-PHY-001-QL-058": "Andaman and Nicobar chain",
  "GEO-PHY-001-QL-066": "Nilgiri Hills",
  "GEO-PHY-001-QL-068": "Anamudi",
  "GEO-PHY-001-QL-069": "Guru Shikhar",
  "GEO-PHY-001-QL-073": "Zoji La",
  "GEO-PHY-001-QL-074": "Rohtang Pass",
  "GEO-PHY-001-QL-075": "Nathu La",
  "GEO-PHY-001-QL-076": "Kashmir Valley",
  "GEO-PHY-001-QL-077": "Kullu Valley",
  "GEO-PHY-001-QL-078": "Palghat Gap",
  "GEO-PHY-001-QL-082": "Malwa Plateau",
  "GEO-PHY-001-QL-084": "Chota Nagpur Plateau",
  "GEO-PHY-001-QL-085": "Meghalaya Plateau",
  "GEO-PHY-001-QL-086": "Karbi Anglong and North Cachar",
  "GEO-PHY-001-QL-087": "Bastar Plateau",
  "GEO-PHY-001-QL-089": "Plateau-hill-state pairs",
  "GEO-PHY-001-QL-090": "State association synthesis",
  "GEO-PHY-001-QL-093": "Northern Plains classification comparison",
  "GEO-PHY-001-QL-094": "Western vs Eastern Ghats",
  "GEO-PHY-001-QL-095": "Western vs Eastern Coastal Plains",
  "GEO-PHY-001-QL-097": "Island-group comparison",
  "GEO-PHY-001-QL-098": "Cross-division classification",
  "GEO-PHY-001-QL-107": "Cross-topic matching",
  "GEO-PHY-001-QL-108": "Whole-chapter statement synthesis"
};
type Row = readonly [string, string, readonly string[], readonly string[], string];
const rowsByGroup: Record<number, readonly Row[]> = { ...GEO_PHY_001_CP013_ROWS_1_3, ...GEO_PHY_001_CP013_ROWS_4_6, ...GEO_PHY_001_CP013_ROWS_7_9 };
const factMap = new Map(facts.map((fact) => [fact.id, fact]));
const difficultyForGroup = (group: number): KnowledgeV1Difficulty => group <= 3 ? "Easy" : group <= 8 ? "Medium" : "Hard";

export function generateGeoPhy001Cp013ReviewBatchV1(): GeoPhy001Cp013ReviewQuestion[] {
  const output: GeoPhy001Cp013ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let group = 1; group <= 9; group += 1) {
    for (const [stem, canonical, rawOptions, factIds, qlId] of rowsByGroup[group]) {
      if (!rawOptions.includes(canonical)) throw new Error(`CP013 malformed row: ${stem}`);
      if (!/^GEO-PHY-001-QL-(?:00[1-9]|0[1-9][0-9]|10[0-8])$/.test(qlId)) throw new Error(`CP013 invalid existing QL: ${qlId}`);
      const targetIndex = globalIndex % 4;
      const distractors = rawOptions.filter((option) => option !== canonical);
      if (distractors.length !== 3 || new Set(rawOptions).size !== 4) throw new Error(`CP013 option defect: ${stem}`);
      const options = [...distractors]; options.splice(targetIndex, 0, canonical);
      const resolved = factIds.map((id) => factMap.get(id));
      if (resolved.some((fact) => !fact)) throw new Error(`CP013 missing fact: ${stem}`);
      const factRows = resolved.filter((fact): fact is NonNullable<typeof fact> => Boolean(fact));
      output.push({
        questionId: `GEO-PHY-001-CP013-Q${String(globalIndex + 1).padStart(3, "0")}`,
        qlId, qlName: qlNames[qlId] ?? "Existing chapter QL", difficulty: difficultyForGroup(group),
        stem, options: Object.freeze(options), correctIndex: targetIndex, canonicalAnswer: canonical,
        explanation: factRows.map((fact) => fact.fact).join(" "),
        sourceIds: Object.freeze([...new Set(factRows.flatMap((fact) => fact.sourceIds))]),
        sourceFactIds: Object.freeze([...new Set(factRows.flatMap((fact) => fact.sourceFactIds))]),
        reviewOnly: true, runtimeRegistered: false,
      });
      globalIndex += 1;
    }
  }
  return output;
}
export const GEO_PHY_001_CP013_REVIEW_BATCH_V1 = Object.freeze(generateGeoPhy001Cp013ReviewBatchV1().map((q) => Object.freeze(q)));
const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|geographical provenance|administrative dataset|physiographic framework|depositional surface|structural continuity|relief contrast/i;
export function auditGeoPhy001Cp013ReviewBatchV1() {
  const issues: string[] = [], ids = new Set<string>(), semantics = new Set<string>(), qlIds = new Set<string>();
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 }, answerPositions = [0, 0, 0, 0];
  for (const question of GEO_PHY_001_CP013_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`); ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`; if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`); semantics.add(semantic);
    difficultyCounts[question.difficulty] += 1; answerPositions[question.correctIndex] += 1; qlIds.add(question.qlId);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (/GEO-PHY-001-QL-(?:109|1[1-9][0-9]|[2-9][0-9]{2,})/.test(question.qlId)) issues.push(`NEW_QL:${question.qlId}`);
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (forbiddenLearnerLanguage.test(learner)) issues.push(`LEARNER_LANGUAGE:${question.questionId}`);
    if (question.explanation.trim().length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
  }
  if (GEO_PHY_001_CP013_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP013_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  const hardAnswers = new Set(GEO_PHY_001_CP013_REVIEW_BATCH_V1.filter((q) => q.difficulty === "Hard").map((q) => q.canonicalAnswer));
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);
  if (qlIds.size < 30) issues.push(`QL_BREADTH:${qlIds.size}`);
  return { valid: issues.length === 0, issues, questionCount: 54, semanticCount: semantics.size, difficultyCounts, answerPositions, hardAnswerVariety: hardAnswers.size, existingQlBreadth: qlIds.size };
}
