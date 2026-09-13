import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP009_FACTS_V1 as facts } from "./geo-phy-001-cp009-facts";

export type GeoPhy001Cp009ReviewQuestion = {
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
  "GEO-PHY-001-QL-073": "Major Himalayan passes and direct route clues",
  "GEO-PHY-001-QL-074": "Pass-state and UT associations",
  "GEO-PHY-001-QL-075": "Important valleys and river/range clues",
  "GEO-PHY-001-QL-076": "Pass-route and destination relations",
  "GEO-PHY-001-QL-077": "Kashmir, Kullu, Kangra and Dehra Dun comparisons",
  "GEO-PHY-001-QL-078": "Palghat, Bhor and Thal gaps",
  "GEO-PHY-001-QL-079": "Correct and incorrect pass/valley associations",
  "GEO-PHY-001-QL-080": "Two-clue pass, valley and gap identification",
  "GEO-PHY-001-QL-081": "Multi-statement synthesis",
};

type Row = readonly [stem: string, canonical: string, options: readonly string[], factIds: readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  73: [
    ["Which pass links the Kashmir Valley with Ladakh?", "Zoji La", ["Zoji La", "Rohtang Pass", "Nathu La", "Shipki La"], ["zoji-la"]],
    ["Which pass links Kullu Valley with Lahaul–Spiti?", "Rohtang Pass", ["Rohtang Pass", "Banihal Pass", "Nathu La", "Khardung La"], ["rohtang"]],
    ["Which pass is located in Sikkim?", "Nathu La", ["Nathu La", "Shipki La", "Zoji La", "Banihal Pass"], ["nathu-la"]],
    ["Which pass lies north of Leh on the route towards Nubra Valley?", "Khardung La", ["Khardung La", "Rohtang Pass", "Nathu La", "Bhor Ghat"], ["khardung-la"]],
    ["Which pass is associated with the Srinagar–Leh route?", "Zoji La", ["Zoji La", "Banihal Pass", "Shipki La", "Nathu La"], ["zoji-la"]],
    ["Which pass lies in the Pir Panjal range?", "Banihal Pass", ["Banihal Pass", "Nathu La", "Shipki La", "Khardung La"], ["banihal"]],
  ],
  74: [
    ["Nathu La is in which state?", "Sikkim", ["Sikkim", "Himachal Pradesh", "Uttarakhand", "Arunachal Pradesh"], ["nathu-la"]],
    ["Rohtang Pass is in which state?", "Himachal Pradesh", ["Himachal Pradesh", "Sikkim", "Jammu and Kashmir", "Uttarakhand"], ["rohtang"]],
    ["Shipki La is in which state?", "Himachal Pradesh", ["Himachal Pradesh", "Sikkim", "Arunachal Pradesh", "Jammu and Kashmir"], ["shipki-la"]],
    ["Khardung La is in which Union Territory?", "Ladakh", ["Ladakh", "Jammu and Kashmir", "Chandigarh", "Delhi"], ["khardung-la"]],
    ["Which pass is correctly matched with Sikkim?", "Nathu La", ["Nathu La", "Rohtang Pass", "Banihal Pass", "Shipki La"], ["nathu-la"]],
    ["Which pair is correctly matched?", "Shipki La — Himachal Pradesh", ["Shipki La — Himachal Pradesh", "Nathu La — Himachal Pradesh", "Rohtang Pass — Sikkim", "Khardung La — Jammu plains"], ["shipki-la", "nathu-la", "rohtang", "khardung-la"]],
  ],
  75: [
    ["Which river flows through the Kashmir Valley?", "Jhelum", ["Jhelum", "Beas", "Narmada", "Godavari"], ["jhelum"]],
    ["Kullu Valley is associated with which river?", "Beas", ["Beas", "Jhelum", "Sutlej", "Teesta"], ["kullu"]],
    ["The Kashmir Valley lies between which two mountain systems?", "Greater Himalaya and Pir Panjal", ["Greater Himalaya and Pir Panjal", "Shiwalik and Aravali", "Nilgiri and Anaimalai", "Vindhya and Satpura"], ["kashmir-valley"]],
    ["Kangra Valley lies between which two hill systems?", "Dhauladhar and Shiwaliks", ["Dhauladhar and Shiwaliks", "Nilgiri and Anaimalai", "Aravali and Vindhya", "Satpura and Maikal"], ["kangra"]],
    ["Dehra Dun is a valley between the Lesser Himalaya and which range?", "Shiwalik", ["Shiwalik", "Aravali", "Satpura", "Western Ghats"], ["dehra-dun"]],
    ["Which valley is associated with the Beas River?", "Kullu Valley", ["Kullu Valley", "Kashmir Valley", "Kangra Valley", "Dehra Dun"], ["kullu"]],
  ],
  76: [
    ["A traveller going from Kullu towards Lahaul–Spiti traditionally crosses which pass?", "Rohtang Pass", ["Rohtang Pass", "Nathu La", "Zoji La", "Banihal Pass"], ["rohtang"]],
    ["A route from the Kashmir Valley towards Ladakh is most closely associated with which pass?", "Zoji La", ["Zoji La", "Shipki La", "Nathu La", "Khardung La"], ["zoji-la"]],
    ["Which pass is linked with the route from Sikkim towards Tibet/China?", "Nathu La", ["Nathu La", "Rohtang Pass", "Banihal Pass", "Bhor Ghat"], ["nathu-la"]],
    ["The Sutlej enters India through a Himalayan corridor near which pass?", "Shipki La", ["Shipki La", "Zoji La", "Nathu La", "Khardung La"], ["shipki-la"]],
    ["Which pass is on the route from Leh towards the Nubra Valley?", "Khardung La", ["Khardung La", "Banihal Pass", "Shipki La", "Rohtang Pass"], ["khardung-la"]],
    ["Which pass is associated with approaching the Kashmir Valley from the Jammu side through the Pir Panjal?", "Banihal Pass", ["Banihal Pass", "Nathu La", "Shipki La", "Khardung La"], ["banihal"]],
  ],
  77: [
    ["Which valley lies between the Greater Himalaya and the Pir Panjal range?", "Kashmir Valley", ["Kashmir Valley", "Kullu Valley", "Kangra Valley", "Dehra Dun"], ["kashmir-valley"]],
    ["Which valley is both in Himachal Pradesh and associated with the Beas River?", "Kullu Valley", ["Kullu Valley", "Kashmir Valley", "Dehra Dun", "Palghat Gap"], ["kullu"]],
    ["Which valley lies between the Dhauladhar range and the Shiwaliks?", "Kangra Valley", ["Kangra Valley", "Kashmir Valley", "Kullu Valley", "Dehra Dun"], ["kangra"]],
    ["Which is a longitudinal valley between the Lesser Himalaya and Shiwaliks?", "Dehra Dun", ["Dehra Dun", "Kashmir Valley", "Kullu Valley", "Kangra Valley"], ["dehra-dun"]],
    ["Which pair is correctly matched?", "Kashmir Valley — Jhelum", ["Kashmir Valley — Jhelum", "Kullu Valley — Jhelum", "Kangra Valley — Narmada", "Dehra Dun — Godavari"], ["jhelum", "kullu", "kangra", "dehra-dun"]],
    ["Which comparison is correct?", "Kashmir Valley — Jhelum; Kullu Valley — Beas", ["Kashmir Valley — Jhelum; Kullu Valley — Beas", "Kashmir Valley — Beas; Kullu Valley — Jhelum", "Both valleys — Narmada", "Both valleys — Godavari"], ["jhelum", "kullu"]],
  ],
  78: [
    ["Palghat Gap lies between which hills?", "Nilgiri and Anaimalai", ["Nilgiri and Anaimalai", "Aravali and Vindhya", "Dhauladhar and Shiwalik", "Vindhya and Satpura"], ["palghat"]],
    ["Which gap provides an important low passage between Kerala and Tamil Nadu?", "Palghat Gap", ["Palghat Gap", "Bhor Ghat", "Thal Ghat", "Banihal Pass"], ["palghat"]],
    ["Bhor Ghat is associated with which corridor?", "Mumbai–Pune", ["Mumbai–Pune", "Mumbai–Nashik", "Srinagar–Leh", "Kullu–Lahaul"], ["bhor"]],
    ["Thal Ghat is associated with which corridor?", "Mumbai–Nashik", ["Mumbai–Nashik", "Mumbai–Pune", "Srinagar–Leh", "Leh–Nubra"], ["thal"]],
    ["Which two are important Western Ghats routes in Maharashtra?", "Bhor Ghat and Thal Ghat", ["Bhor Ghat and Thal Ghat", "Zoji La and Nathu La", "Banihal and Shipki La", "Rohtang and Khardung La"], ["bhor", "thal"]],
    ["Which statement is correct?", "Palghat Gap lies between the Nilgiri and Anaimalai hills", ["Palghat Gap lies between the Nilgiri and Anaimalai hills", "Bhor Ghat lies between Greater Himalaya and Pir Panjal", "Thal Ghat links Kullu with Lahaul–Spiti", "Palghat Gap lies in Sikkim"], ["palghat", "bhor", "thal"]],
  ],
  79: [
    ["Which pair is incorrectly matched?", "Nathu La — Himachal Pradesh", ["Nathu La — Himachal Pradesh", "Rohtang Pass — Himachal Pradesh", "Khardung La — Ladakh", "Zoji La — Kashmir–Ladakh route"], ["nathu-la", "rohtang", "khardung-la", "zoji-la"]],
    ["Which pair is correctly matched?", "Banihal Pass — Pir Panjal", ["Banihal Pass — Pir Panjal", "Shipki La — Sikkim", "Nathu La — Ladakh", "Bhor Ghat — Kashmir Valley"], ["banihal", "shipki-la", "nathu-la", "bhor"]],
    ["Which association is incorrect?", "Kullu Valley — Jhelum River", ["Kullu Valley — Jhelum River", "Kashmir Valley — Jhelum River", "Kullu Valley — Beas River", "Kangra Valley — Himachal Pradesh"], ["kullu", "jhelum", "kangra"]],
    ["Which pair is correctly matched?", "Palghat Gap — Nilgiri and Anaimalai", ["Palghat Gap — Nilgiri and Anaimalai", "Palghat Gap — Dhauladhar and Shiwalik", "Bhor Ghat — Leh–Nubra", "Thal Ghat — Srinagar–Leh"], ["palghat", "bhor", "thal"]],
    ["Which association is incorrect?", "Khardung La — Sikkim", ["Khardung La — Sikkim", "Nathu La — Sikkim", "Shipki La — Himachal Pradesh", "Rohtang Pass — Kullu–Lahaul-Spiti"], ["khardung-la", "nathu-la", "shipki-la", "rohtang"]],
    ["Which pair is correctly matched?", "Dehra Dun — Lesser Himalaya and Shiwaliks", ["Dehra Dun — Lesser Himalaya and Shiwaliks", "Kashmir Valley — Nilgiri and Anaimalai", "Kangra Valley — Western and Eastern Ghats", "Kullu Valley — Aravali and Vindhya"], ["dehra-dun", "kashmir-valley", "kangra", "kullu"]],
  ],
  80: [
    ["A pass is in Sikkim and lies on a route towards Tibet/China. Which pass is it?", "Nathu La", ["Nathu La", "Shipki La", "Rohtang Pass", "Banihal Pass"], ["nathu-la"]],
    ["A pass is in Himachal Pradesh and is linked with the Sutlej entry corridor. Which is it?", "Shipki La", ["Shipki La", "Nathu La", "Zoji La", "Khardung La"], ["shipki-la"]],
    ["A valley lies along the Beas River and is linked by Rohtang Pass to Lahaul–Spiti. Which valley is it?", "Kullu Valley", ["Kullu Valley", "Kashmir Valley", "Kangra Valley", "Dehra Dun"], ["kullu", "rohtang"]],
    ["A valley lies between the Greater Himalaya and Pir Panjal, and the Jhelum flows through it. Which valley is it?", "Kashmir Valley", ["Kashmir Valley", "Kullu Valley", "Kangra Valley", "Dehra Dun"], ["kashmir-valley", "jhelum"]],
    ["A gap lies between Nilgiri and Anaimalai and provides a passage between Kerala and Tamil Nadu. Which gap is it?", "Palghat Gap", ["Palghat Gap", "Bhor Ghat", "Thal Ghat", "Banihal Pass"], ["palghat"]],
    ["A ghat route in Maharashtra is associated with the Mumbai–Pune corridor. Which is it?", "Bhor Ghat", ["Bhor Ghat", "Thal Ghat", "Palghat Gap", "Zoji La"], ["bhor"]],
  ],
  81: [
    ["Consider the following statements: I. Zoji La links the Kashmir Valley with Ladakh. II. Rohtang Pass links Kullu with Lahaul–Spiti. III. Nathu La is in Sikkim. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["zoji-la", "rohtang", "nathu-la"]],
    ["Consider the following statements: I. Banihal Pass is in the Pir Panjal range. II. Shipki La is in Sikkim. III. Khardung La lies north of Leh. Which statements are correct?", "I and III only", ["I and II only", "II and III only", "I and III only", "All three"], ["banihal", "shipki-la", "khardung-la"]],
    ["Consider the following statements: I. The Jhelum flows through Kashmir Valley. II. Kullu Valley is associated with the Beas. III. Kangra Valley lies between Dhauladhar and Shiwaliks. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["jhelum", "kullu", "kangra"]],
    ["Consider the following statements: I. Palghat Gap lies between Nilgiri and Anaimalai. II. Bhor Ghat is on the Mumbai–Pune corridor. III. Thal Ghat is on the Mumbai–Nashik corridor. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["palghat", "bhor", "thal"]],
    ["Consider the following statements: I. Dehra Dun lies between the Lesser Himalaya and Shiwaliks. II. Kashmir Valley lies between Greater Himalaya and Pir Panjal. III. Kullu Valley is drained by the Jhelum. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["dehra-dun", "kashmir-valley", "kullu", "jhelum"]],
    ["Consider the following statements: I. Nathu La is in Sikkim. II. Shipki La is in Himachal Pradesh. III. Khardung La is on the route towards Nubra Valley. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["nathu-la", "shipki-la", "khardung-la"]],
  ],
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => ql <= 75 ? "Easy" : ql <= 80 ? "Medium" : "Hard";
const factById = new Map(facts.map((fact) => [fact.id, fact] as const));

function buildExplanation(factIds: readonly string[]) {
  const selected = factIds.map((id) => factById.get(id)).filter(Boolean);
  return selected.map((fact) => fact!.fact).join(" ");
}

function normalizeOptions(canonical: string, options: readonly string[]) {
  const unique = [...new Set(options)];
  if (!unique.includes(canonical)) throw new Error(`CP009 canonical answer missing from options: ${canonical}`);
  return [canonical, ...unique.filter((option) => option !== canonical)];
}

export function generateGeoPhy001Cp009ReviewBatchV1(): readonly GeoPhy001Cp009ReviewQuestion[] {
  const questions: GeoPhy001Cp009ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 73; ql <= 81; ql += 1) {
    const rows = rowsByQl[ql];
    if (!rows || rows.length !== 6) throw new Error(`CP009 requires six rows for QL${ql}`);
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const [stem, canonical, rawOptions, factIds] = rows[rowIndex];
      const normalized = normalizeOptions(canonical, rawOptions);
      if (normalized.length !== 4) throw new Error(`CP009 malformed options: ${stem}`);
      const correctIndex = globalIndex % 4;
      const distractors = normalized.slice(1);
      const options = [...distractors];
      options.splice(correctIndex, 0, canonical);
      const selectedFacts = factIds.map((id) => factById.get(id));
      if (selectedFacts.some((fact) => !fact)) throw new Error(`CP009 unknown fact id: ${stem}`);
      const sourceIds = [...new Set(selectedFacts.flatMap((fact) => fact!.sourceIds))];
      const sourceFactIds = [...new Set(selectedFacts.flatMap((fact) => fact!.sourceFactIds))];
      const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
      questions.push(Object.freeze({
        questionId: `GEO-PHY-001-CP009-Q${String(globalIndex + 1).padStart(3, "0")}`,
        qlId,
        qlName: qlNames[qlId],
        difficulty: difficultyForQl(ql),
        stem,
        options: Object.freeze(options),
        correctIndex,
        canonicalAnswer: canonical,
        explanation: buildExplanation(factIds),
        sourceIds: Object.freeze(sourceIds),
        sourceFactIds: Object.freeze(sourceFactIds),
        reviewOnly: true,
        runtimeRegistered: false,
      }));
      globalIndex += 1;
    }
  }
  return Object.freeze(questions);
}

export const GEO_PHY_001_CP009_REVIEW_BATCH_V1 = generateGeoPhy001Cp009ReviewBatchV1();
export const GEO_PHY_001_CP009_REQUIRED_FACTS_V1 = Object.freeze(facts.flatMap((fact) => fact.sourceFactIds));

const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|physiographic nomenclature|geological provenance|morphological characteristic|highest motorable/i;

export function auditGeoPhy001Cp009ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP009_REVIEW_BATCH_V1) {
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

  if (GEO_PHY_001_CP009_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP009_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 73; ql <= 81; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  const usedFacts = new Set(GEO_PHY_001_CP009_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of GEO_PHY_001_CP009_REQUIRED_FACTS_V1) if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  const hardAnswers = new Set(GEO_PHY_001_CP009_REVIEW_BATCH_V1.filter((q) => q.difficulty === "Hard").map((q) => q.canonicalAnswer));
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);
  return { valid: issues.length === 0, issues, questionCount: GEO_PHY_001_CP009_REVIEW_BATCH_V1.length, semanticCount: semantics.size, qlCounts, difficultyCounts, answerPositions, hardAnswerVariety: hardAnswers.size };
}
