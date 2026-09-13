import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP010_FACTS_V1 as facts } from "./geo-phy-001-cp010-facts";

export type GeoPhy001Cp010ReviewQuestion = {
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

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-082": "Malwa Plateau and state association",
  "GEO-PHY-001-QL-083": "Bundelkhand and Baghelkhand state association",
  "GEO-PHY-001-QL-084": "Chota Nagpur and Ranchi Plateau association",
  "GEO-PHY-001-QL-085": "Meghalaya Plateau and Garo-Khasi-Jaintia Hills",
  "GEO-PHY-001-QL-086": "Karbi Anglong and North Cachar Hills",
  "GEO-PHY-001-QL-087": "Deccan regional plateau-state association",
  "GEO-PHY-001-QL-088": "Southern hill-state association",
  "GEO-PHY-001-QL-089": "Correct and incorrect plateau-hill-state pairs",
  "GEO-PHY-001-QL-090": "Multi-statement state-association synthesis",
};

type Row = readonly [stem: string, canonical: string, options: readonly string[], factIds: readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  82: [
    ["The Malwa Plateau lies mainly in which state?", "Madhya Pradesh", ["Madhya Pradesh", "Jharkhand", "Assam", "Kerala"], ["malwa"]],
    ["The Malwa Plateau extends from Madhya Pradesh into which neighbouring state?", "Rajasthan", ["Rajasthan", "Odisha", "Bihar", "Telangana"], ["malwa"]],
    ["Which plateau lies mainly in western Madhya Pradesh and extends into southeastern Rajasthan?", "Malwa Plateau", ["Malwa Plateau", "Ranchi Plateau", "Telangana Plateau", "Bastar Plateau"], ["malwa"]],
    ["Which pair is correctly matched?", "Malwa Plateau — Madhya Pradesh and Rajasthan", ["Malwa Plateau — Madhya Pradesh and Rajasthan", "Malwa Plateau — Assam and Meghalaya", "Malwa Plateau — Kerala and Tamil Nadu", "Malwa Plateau — Jharkhand and Odisha"], ["malwa"]],
    ["A plateau region covers much of western Madhya Pradesh and reaches southeastern Rajasthan. Identify it.", "Malwa Plateau", ["Malwa Plateau", "Chota Nagpur Plateau", "Meghalaya Plateau", "Karnataka Plateau"], ["malwa"]],
    ["Which state combination best fits the Malwa Plateau?", "Madhya Pradesh and Rajasthan", ["Madhya Pradesh and Rajasthan", "Jharkhand and Odisha", "Assam and Meghalaya", "Kerala and Karnataka"], ["malwa"]],
  ],
  83: [
    ["Bundelkhand is mainly spread across which two states?", "Madhya Pradesh and Uttar Pradesh", ["Madhya Pradesh and Uttar Pradesh", "Jharkhand and Odisha", "Assam and Meghalaya", "Kerala and Tamil Nadu"], ["bundelkhand"]],
    ["Which region lies across northern Madhya Pradesh and southern Uttar Pradesh?", "Bundelkhand", ["Bundelkhand", "Baghelkhand", "Malwa", "Bastar"], ["bundelkhand"]],
    ["Baghelkhand lies mainly in northeastern Madhya Pradesh and extends into which state?", "Uttar Pradesh", ["Uttar Pradesh", "Rajasthan", "Assam", "Kerala"], ["baghelkhand"]],
    ["Which region is linked with northeastern Madhya Pradesh and southeastern Uttar Pradesh?", "Baghelkhand", ["Baghelkhand", "Bundelkhand", "Malwa Plateau", "Ranchi Plateau"], ["baghelkhand"]],
    ["Which pair is correctly matched?", "Bundelkhand — Madhya Pradesh and Uttar Pradesh", ["Bundelkhand — Madhya Pradesh and Uttar Pradesh", "Baghelkhand — Assam and Meghalaya", "Bundelkhand — Kerala and Karnataka", "Baghelkhand — Jharkhand and Odisha only"], ["bundelkhand", "baghelkhand"]],
    ["Which statement correctly distinguishes the two regions?", "Bundelkhand is farther west; Baghelkhand is farther east", ["Bundelkhand is farther west; Baghelkhand is farther east", "Baghelkhand is in Assam; Bundelkhand is in Kerala", "Both lie only in Rajasthan", "Both lie only in Jharkhand"], ["bundelkhand", "baghelkhand"]],
  ],
  84: [
    ["The Chota Nagpur Plateau lies mainly in which state?", "Jharkhand", ["Jharkhand", "Rajasthan", "Kerala", "Punjab"], ["chotanagpur"]],
    ["Ranchi Plateau is located in which state?", "Jharkhand", ["Jharkhand", "Madhya Pradesh", "Assam", "Tamil Nadu"], ["ranchi"]],
    ["Which plateau is an important part of Chota Nagpur in Jharkhand?", "Ranchi Plateau", ["Ranchi Plateau", "Malwa Plateau", "Telangana Plateau", "Karnataka Plateau"], ["ranchi", "chotanagpur"]],
    ["Which plateau has its main area in Jharkhand but extends into nearby Odisha, West Bengal and Chhattisgarh?", "Chota Nagpur Plateau", ["Chota Nagpur Plateau", "Malwa Plateau", "Meghalaya Plateau", "Bastar Plateau"], ["chotanagpur"]],
    ["Which pair is correctly matched?", "Ranchi Plateau — Jharkhand", ["Ranchi Plateau — Jharkhand", "Ranchi Plateau — Rajasthan", "Chota Nagpur Plateau — Kerala", "Chota Nagpur Plateau — Punjab"], ["ranchi", "chotanagpur"]],
    ["A plateau region centred in Jharkhand includes the Ranchi Plateau. Which region is it?", "Chota Nagpur Plateau", ["Chota Nagpur Plateau", "Deccan Plateau", "Malwa Plateau", "Meghalaya Plateau"], ["chotanagpur", "ranchi"]],
  ],
  85: [
    ["The Garo, Khasi and Jaintia Hills are part of which plateau?", "Meghalaya Plateau", ["Meghalaya Plateau", "Malwa Plateau", "Chota Nagpur Plateau", "Karnataka Plateau"], ["meghalaya"]],
    ["Which hill group is correctly associated with Meghalaya?", "Garo, Khasi and Jaintia", ["Garo, Khasi and Jaintia", "Nilgiri, Anaimalai and Cardamom", "Aravali, Vindhya and Satpura", "Mahadev, Maikal and Kaimur"], ["meghalaya"]],
    ["From west to east, what is the correct order of the main hills of the Meghalaya Plateau?", "Garo — Khasi — Jaintia", ["Garo — Khasi — Jaintia", "Jaintia — Khasi — Garo", "Khasi — Garo — Jaintia", "Garo — Jaintia — Khasi"], ["meghalaya"]],
    ["A plateau in Meghalaya contains the Garo, Khasi and Jaintia Hills. Identify it.", "Meghalaya Plateau", ["Meghalaya Plateau", "Chota Nagpur Plateau", "Malwa Plateau", "Bastar Plateau"], ["meghalaya"]],
    ["Which pair is correctly matched?", "Khasi Hills — Meghalaya", ["Khasi Hills — Meghalaya", "Garo Hills — Kerala", "Jaintia Hills — Rajasthan", "Khasi Hills — Maharashtra"], ["meghalaya"]],
    ["Which statement about the Meghalaya Plateau is correct?", "Garo, Khasi and Jaintia Hills occur across it from west to east", ["Garo, Khasi and Jaintia Hills occur across it from west to east", "It lies mainly in Jharkhand", "It is the main plateau of Rajasthan", "It contains the Nilgiri Hills"], ["meghalaya"]],
  ],
  86: [
    ["Karbi Anglong is associated with which state?", "Assam", ["Assam", "Rajasthan", "Kerala", "Madhya Pradesh"], ["karbi"]],
    ["The North Cachar Hills are in which state?", "Assam", ["Assam", "Jharkhand", "Tamil Nadu", "Gujarat"], ["north-cachar"]],
    ["Which two hill regions are correctly associated with Assam?", "Karbi Anglong and North Cachar Hills", ["Karbi Anglong and North Cachar Hills", "Nilgiri and Cardamom Hills", "Garo and Khasi Hills only", "Aravali and Vindhya"], ["karbi", "north-cachar"]],
    ["A northeastern plateau-hill region known as Karbi Anglong lies in which state?", "Assam", ["Assam", "Meghalaya", "Jharkhand", "Chhattisgarh"], ["karbi"]],
    ["North Cachar Hills are now largely within Dima Hasao district of which state?", "Assam", ["Assam", "Sikkim", "Odisha", "Maharashtra"], ["north-cachar"]],
    ["Which pair is incorrectly matched?", "Karbi Anglong — Kerala", ["Karbi Anglong — Kerala", "Karbi Anglong — Assam", "North Cachar Hills — Assam", "Dima Hasao — Assam"], ["karbi", "north-cachar"]],
  ],
  87: [
    ["Which set contains major states across which the Deccan Plateau extends?", "Maharashtra, Karnataka, Telangana and Andhra Pradesh", ["Maharashtra, Karnataka, Telangana and Andhra Pradesh", "Punjab, Haryana, Delhi and Chandigarh", "Assam, Meghalaya, Nagaland and Manipur", "Rajasthan, Punjab, Haryana and Himachal Pradesh"], ["deccan"]],
    ["The Karnataka Plateau is mainly associated with which state?", "Karnataka", ["Karnataka", "Jharkhand", "Rajasthan", "Assam"], ["karnataka"]],
    ["The Telangana Plateau is mainly associated with which state?", "Telangana", ["Telangana", "Kerala", "Punjab", "Sikkim"], ["telangana"]],
    ["Bastar Plateau lies mainly in which state?", "Chhattisgarh", ["Chhattisgarh", "Rajasthan", "Meghalaya", "Tamil Nadu"], ["bastar"]],
    ["Which pair is correctly matched?", "Bastar Plateau — Chhattisgarh", ["Bastar Plateau — Chhattisgarh", "Karnataka Plateau — Jharkhand", "Telangana Plateau — Assam", "Deccan Plateau — Punjab only"], ["bastar", "karnataka", "telangana", "deccan"]],
    ["Which two are regional plateaus within the wider Deccan Plateau?", "Karnataka Plateau and Telangana Plateau", ["Karnataka Plateau and Telangana Plateau", "Meghalaya Plateau and Malwa Plateau", "Ranchi Plateau and Malwa Plateau", "Garo Hills and Chota Nagpur Plateau"], ["karnataka", "telangana", "deccan"]],
  ],
  88: [
    ["The Nilgiri Hills lie around the meeting area of which three states?", "Tamil Nadu, Kerala and Karnataka", ["Tamil Nadu, Kerala and Karnataka", "Punjab, Haryana and Rajasthan", "Assam, Meghalaya and Nagaland", "Madhya Pradesh, Uttar Pradesh and Bihar"], ["nilgiri"]],
    ["The Anaimalai Hills lie along the border region of which two states?", "Tamil Nadu and Kerala", ["Tamil Nadu and Kerala", "Madhya Pradesh and Rajasthan", "Jharkhand and Odisha", "Assam and Meghalaya"], ["anaimalai"]],
    ["The Cardamom Hills lie mainly in which state?", "Kerala", ["Kerala", "Rajasthan", "Jharkhand", "Punjab"], ["cardamom"]],
    ["Which pair is correctly matched?", "Anaimalai Hills — Tamil Nadu and Kerala", ["Anaimalai Hills — Tamil Nadu and Kerala", "Nilgiri Hills — Punjab and Haryana", "Cardamom Hills — Rajasthan", "Anaimalai Hills — Assam and Meghalaya"], ["anaimalai", "nilgiri", "cardamom"]],
    ["A hill system lies mainly in Kerala and extends towards Tamil Nadu. Which is it?", "Cardamom Hills", ["Cardamom Hills", "Garo Hills", "Karbi Anglong", "Aravali Range"], ["cardamom"]],
    ["Which association is incorrect?", "Nilgiri Hills — Jharkhand and Odisha", ["Nilgiri Hills — Jharkhand and Odisha", "Nilgiri Hills — Tamil Nadu-Kerala-Karnataka meeting area", "Anaimalai Hills — Tamil Nadu-Kerala border region", "Cardamom Hills — mainly Kerala"], ["nilgiri", "anaimalai", "cardamom"]],
  ],
  89: [
    ["Which pair is incorrectly matched?", "Malwa Plateau — Assam", ["Malwa Plateau — Assam", "Ranchi Plateau — Jharkhand", "Karbi Anglong — Assam", "Bastar Plateau — Chhattisgarh"], ["malwa", "ranchi", "karbi", "bastar"]],
    ["Which pair is correctly matched?", "Baghelkhand — Madhya Pradesh and Uttar Pradesh", ["Baghelkhand — Madhya Pradesh and Uttar Pradesh", "Bundelkhand — Assam and Meghalaya", "Meghalaya Plateau — Rajasthan", "Telangana Plateau — Kerala"], ["baghelkhand", "bundelkhand", "meghalaya", "telangana"]],
    ["Which association is incorrect?", "North Cachar Hills — Tamil Nadu", ["North Cachar Hills — Tamil Nadu", "Karbi Anglong — Assam", "Khasi Hills — Meghalaya", "Ranchi Plateau — Jharkhand"], ["north-cachar", "karbi", "meghalaya", "ranchi"]],
    ["Which set is correctly matched?", "Karnataka Plateau — Karnataka; Telangana Plateau — Telangana", ["Karnataka Plateau — Karnataka; Telangana Plateau — Telangana", "Karnataka Plateau — Assam; Telangana Plateau — Punjab", "Both — Rajasthan", "Both — Jharkhand"], ["karnataka", "telangana"]],
    ["Which association is incorrect?", "Cardamom Hills — Rajasthan", ["Cardamom Hills — Rajasthan", "Anaimalai Hills — Tamil Nadu and Kerala", "Bastar Plateau — Chhattisgarh", "Chota Nagpur Plateau — mainly Jharkhand"], ["cardamom", "anaimalai", "bastar", "chotanagpur"]],
    ["Which pair is correctly matched?", "Nilgiri Hills — Tamil Nadu, Kerala and Karnataka meeting area", ["Nilgiri Hills — Tamil Nadu, Kerala and Karnataka meeting area", "Garo Hills — Maharashtra", "Malwa Plateau — Kerala", "Bundelkhand — Assam"], ["nilgiri", "meghalaya", "malwa", "bundelkhand"]],
  ],
  90: [
    ["Consider the following statements: I. Malwa lies mainly in Madhya Pradesh and extends into Rajasthan. II. Ranchi Plateau is in Jharkhand. III. Karbi Anglong is in Assam. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["malwa", "ranchi", "karbi"]],
    ["Consider the following statements: I. Bundelkhand spreads across Madhya Pradesh and Uttar Pradesh. II. Meghalaya Plateau lies mainly in Rajasthan. III. Bastar Plateau lies mainly in Chhattisgarh. Which statements are correct?", "I and III only", ["I and II only", "II and III only", "I and III only", "All three"], ["bundelkhand", "meghalaya", "bastar"]],
    ["Consider the following statements: I. Karbi Anglong is in Assam. II. North Cachar Hills are in Assam. III. Telangana Plateau is mainly in Kerala. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["karbi", "north-cachar", "telangana"]],
    ["Consider the following statements: I. Nilgiri Hills lie around the Tamil Nadu-Kerala-Karnataka meeting area. II. Anaimalai Hills are linked with the Tamil Nadu-Kerala border. III. Cardamom Hills lie mainly in Kerala. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["nilgiri", "anaimalai", "cardamom"]],
    ["Consider the following statements: I. Chota Nagpur lies mainly in Jharkhand. II. Baghelkhand is linked with northeastern Madhya Pradesh and southeastern Uttar Pradesh. III. Malwa lies mainly in Assam. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["chotanagpur", "baghelkhand", "malwa"]],
    ["Consider the following statements: I. Karnataka Plateau is in Karnataka. II. Telangana Plateau is mainly in Telangana. III. Bastar Plateau lies mainly in Chhattisgarh. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["karnataka", "telangana", "bastar"]],
  ],
};

const factMap = new Map(facts.map((fact) => [fact.id, fact]));
const difficultyForQl = (ql: number): KnowledgeV1Difficulty => ql <= 84 ? "Easy" : ql <= 89 ? "Medium" : "Hard";

export function generateGeoPhy001Cp010ReviewBatchV1(): GeoPhy001Cp010ReviewQuestion[] {
  const output: GeoPhy001Cp010ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 82; ql <= 90; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    for (const [stem, canonical, rawOptions, factIds] of rowsByQl[ql]) {
      if (!rawOptions.includes(canonical)) throw new Error(`CP010 malformed row: ${stem}`);
      const targetIndex = globalIndex % 4;
      const distractors = rawOptions.filter((option) => option !== canonical);
      if (distractors.length !== 3 || new Set(rawOptions).size !== 4) throw new Error(`CP010 option defect: ${stem}`);
      const options = [...distractors];
      options.splice(targetIndex, 0, canonical);
      const factRows = factIds.map((id) => factMap.get(id));
      if (factRows.some((fact) => !fact)) throw new Error(`CP010 missing fact: ${stem}`);
      const resolved = factRows.filter((fact): fact is NonNullable<typeof fact> => Boolean(fact));
      output.push({
        questionId: `GEO-PHY-001-CP010-Q${String(globalIndex + 1).padStart(3, "0")}`,
        qlId,
        qlName: qlNames[qlId],
        difficulty: difficultyForQl(ql),
        stem,
        options: Object.freeze(options),
        correctIndex: targetIndex,
        canonicalAnswer: canonical,
        explanation: resolved.map((fact) => fact.fact).join(" "),
        sourceIds: Object.freeze([...new Set(resolved.flatMap((fact) => fact.sourceIds))]),
        sourceFactIds: Object.freeze([...new Set(resolved.flatMap((fact) => fact.sourceFactIds))]),
        reviewOnly: true,
        runtimeRegistered: false,
      });
      globalIndex += 1;
    }
  }
  return output;
}

export const GEO_PHY_001_CP010_REVIEW_BATCH_V1 = Object.freeze(generateGeoPhy001Cp010ReviewBatchV1().map((question) => Object.freeze(question)));
export const GEO_PHY_001_CP010_REQUIRED_FACTS_V1 = Object.freeze(facts.flatMap((fact) => fact.sourceFactIds));

const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|geographical provenance|administrative dataset/i;

export function auditGeoPhy001Cp010ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  for (const question of GEO_PHY_001_CP010_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
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
  if (GEO_PHY_001_CP010_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP010_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 82; ql <= 90; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  const usedFacts = new Set(GEO_PHY_001_CP010_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of GEO_PHY_001_CP010_REQUIRED_FACTS_V1) if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  const hardAnswers = new Set(GEO_PHY_001_CP010_REVIEW_BATCH_V1.filter((question) => question.difficulty === "Hard").map((question) => question.canonicalAnswer));
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);
  return { valid: issues.length === 0, issues, questionCount: GEO_PHY_001_CP010_REVIEW_BATCH_V1.length, semanticCount: semantics.size, qlCounts, difficultyCounts, answerPositions, hardAnswerVariety: hardAnswers.size };
}
