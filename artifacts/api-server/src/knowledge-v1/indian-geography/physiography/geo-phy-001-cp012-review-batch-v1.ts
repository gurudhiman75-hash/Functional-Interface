import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP012_FACTS_V1 as facts } from "./geo-phy-001-cp012-facts";
import { GEO_PHY_001_CP012_ROWS_100_102 } from "./geo-phy-001-cp012-rows-100-102";
import { GEO_PHY_001_CP012_ROWS_103_105 } from "./geo-phy-001-cp012-rows-103-105";
import { GEO_PHY_001_CP012_ROWS_106_108 } from "./geo-phy-001-cp012-rows-106-108";

export type GeoPhy001Cp012ReviewQuestion = {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

type Row = readonly [stem: string, canonical: string, options: readonly string[], factIds: readonly string[]];

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-100": "Major regions: two-statement checks",
  "GEO-PHY-001-QL-101": "Landform and feature matching",
  "GEO-PHY-001-QL-102": "Coast, island and mountain matching",
  "GEO-PHY-001-QL-103": "Pass, gap and valley integration",
  "GEO-PHY-001-QL-104": "Plains, desert and coast integration",
  "GEO-PHY-001-QL-105": "Plateau, hill and state integration",
  "GEO-PHY-001-QL-106": "Island and coastal integration",
  "GEO-PHY-001-QL-107": "Cross-topic match and identification",
  "GEO-PHY-001-QL-108": "Whole-chapter statement synthesis",
};

const rowsByQl: Record<number, readonly Row[]> = {
  ...GEO_PHY_001_CP012_ROWS_100_102,
  ...GEO_PHY_001_CP012_ROWS_103_105,
  ...GEO_PHY_001_CP012_ROWS_106_108,
};

const factMap = new Map(facts.map((fact) => [fact.id, fact]));
const difficultyForQl = (ql: number): KnowledgeV1Difficulty => ql <= 102 ? "Easy" : ql <= 107 ? "Medium" : "Hard";

export function generateGeoPhy001Cp012ReviewBatchV1(): GeoPhy001Cp012ReviewQuestion[] {
  const output: GeoPhy001Cp012ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 100; ql <= 108; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    const qlRows = rowsByQl[ql];
    if (!qlRows) throw new Error(`CP012 missing QL rows: ${qlId}`);
    for (const [stem, canonical, rawOptions, factIds] of qlRows) {
      if (!rawOptions.includes(canonical)) throw new Error(`CP012 malformed row: ${stem}`);
      const targetIndex = globalIndex % 4;
      const distractors = rawOptions.filter((option) => option !== canonical);
      if (distractors.length !== 3 || new Set(rawOptions).size !== 4) throw new Error(`CP012 option defect: ${stem}`);
      const options = [...distractors];
      options.splice(targetIndex, 0, canonical);
      const resolved = factIds.map((id) => factMap.get(id));
      if (resolved.some((fact) => !fact)) throw new Error(`CP012 missing fact: ${stem}`);
      const factRows = resolved.filter((fact): fact is NonNullable<typeof fact> => Boolean(fact));
      output.push({
        questionId: `GEO-PHY-001-CP012-Q${String(globalIndex + 1).padStart(3, "0")}`,
        qlId,
        qlName: qlNames[qlId],
        difficulty: difficultyForQl(ql),
        stem,
        options: Object.freeze(options),
        correctIndex: targetIndex,
        canonicalAnswer: canonical,
        explanation: factRows.map((fact) => fact.fact).join(" "),
        sourceIds: Object.freeze([...new Set(factRows.flatMap((fact) => fact.sourceIds))]),
        sourceFactIds: Object.freeze([...new Set(factRows.flatMap((fact) => fact.sourceFactIds))]),
        reviewOnly: true,
        runtimeRegistered: false,
      });
      globalIndex += 1;
    }
  }
  return output;
}

export const GEO_PHY_001_CP012_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp012ReviewBatchV1().map((question) => Object.freeze(question)),
);
export const GEO_PHY_001_CP012_REQUIRED_FACTS_V1 = Object.freeze(facts.flatMap((fact) => fact.sourceFactIds));

const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|physiographic|physical division|geologically|alluvial|emergent|submerged|crystalline|igneous|metamorphic|offshore|\barid\b/i;

export function auditGeoPhy001Cp012ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const stems = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP012_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    if (stems.has(question.stem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(question.stem);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (forbiddenLearnerLanguage.test(learner)) issues.push(`LEARNER_LANGUAGE:${question.questionId}`);
    if (question.explanation.trim().length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
  }

  if (GEO_PHY_001_CP012_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP012_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 100; ql <= 108; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  const usedFacts = new Set(GEO_PHY_001_CP012_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of GEO_PHY_001_CP012_REQUIRED_FACTS_V1) if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  const hardAnswers = new Set(
    GEO_PHY_001_CP012_REVIEW_BATCH_V1.filter((question) => question.difficulty === "Hard").map((question) => question.canonicalAnswer),
  );
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP012_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
  };
}
