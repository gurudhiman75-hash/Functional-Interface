import { deterministicShuffle } from "../../deterministic";
import { generateGeoRiv001Cp009ReviewV2 } from "./geo-riv-001-cp009-review-generator-v2";
import type { GeoRiv001Cp009ReviewQuestion } from "./geo-riv-001-cp009-review-types";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(74 + index).padStart(3, "0")}`);
const ALL_RIVERS = ["Ganga", "Brahmaputra", "Krishna", "Godavari", "Mahanadi", "Cauvery", "Pennar", "Teesta", "Subarnarekha"] as const;

function targetRiver(question: GeoRiv001Cp009ReviewQuestion) {
  if (question.qlId === "GEO-RIV-001-QL-074") return question.stem.match(/^Which of the following states does the (.+?) flow through\?$/)?.[1] ?? "";
  if (question.qlId === "GEO-RIV-001-QL-076") return question.stem.match(/^The (.+?) (?:rises|originates) in which state\?$/)?.[1] ?? "";
  if (["GEO-RIV-001-QL-077", "GEO-RIV-001-QL-080"].includes(question.qlId)) return question.canonicalAnswer;
  if (["GEO-RIV-001-QL-078", "GEO-RIV-001-QL-079"].includes(question.qlId)) return question.canonicalAnswer.split(" — ")[0] ?? "";
  return "";
}

function stateFromReverseStem(question: GeoRiv001Cp009ReviewQuestion) {
  return question.stem.match(/^Which of the following rivers flows through (.+)\?$/)?.[1] ?? "";
}

function semanticSignature(question: GeoRiv001Cp009ReviewQuestion) {
  if (["GEO-RIV-001-QL-074", "GEO-RIV-001-QL-075", "GEO-RIV-001-QL-076", "GEO-RIV-001-QL-077", "GEO-RIV-001-QL-080"].includes(question.qlId)) {
    return `${question.qlId}|${question.stem}|${question.canonicalAnswer}`;
  }
  if (["GEO-RIV-001-QL-078", "GEO-RIV-001-QL-079"].includes(question.qlId)) return `${question.qlId}|${question.canonicalAnswer}`;
  return `${question.qlId}|${question.stem}|${question.canonicalAnswer}`;
}

function candidates(qlId: string, limit = 5000) {
  return Array.from({ length: limit }, (_, index) => generateGeoRiv001Cp009ReviewV2(qlId, `cp009-v2-review-${qlId}-${index}`));
}

function takeByRequiredTargets(qlId: string, requiredTargets: readonly string[], getTarget: (question: GeoRiv001Cp009ReviewQuestion) => string) {
  const pool = candidates(qlId);
  const selected: GeoRiv001Cp009ReviewQuestion[] = [];
  const used = new Set<string>();
  for (const target of requiredTargets) {
    const question = pool.find((candidate) => getTarget(candidate) === target && !used.has(semanticSignature(candidate)));
    if (!question) throw new Error(`CP009 could not find ${qlId} review candidate for target ${target}`);
    selected.push(question);
    used.add(semanticSignature(question));
  }
  return selected;
}

function takeDistinct(qlId: string, count: number, key: (question: GeoRiv001Cp009ReviewQuestion) => string, requiredAnswers: readonly string[] = []) {
  const pool = candidates(qlId);
  const selected: GeoRiv001Cp009ReviewQuestion[] = [];
  const keys = new Set<string>();
  const signatures = new Set<string>();

  for (const answer of requiredAnswers) {
    const question = pool.find((candidate) => candidate.canonicalAnswer === answer && !signatures.has(semanticSignature(candidate)));
    if (!question) throw new Error(`CP009 could not find ${qlId} candidate for answer ${answer}`);
    const itemKey = key(question);
    selected.push(question);
    keys.add(itemKey);
    signatures.add(semanticSignature(question));
  }

  for (const question of pool) {
    if (selected.length >= count) break;
    const signature = semanticSignature(question);
    const itemKey = key(question);
    if (!itemKey || keys.has(itemKey) || signatures.has(signature)) continue;
    selected.push(question);
    keys.add(itemKey);
    signatures.add(signature);
  }
  if (selected.length !== count) throw new Error(`CP009 could select only ${selected.length}/${count} distinct ${qlId} review questions`);
  return selected;
}

const selectedByQl: Record<string, GeoRiv001Cp009ReviewQuestion[]> = {
  "GEO-RIV-001-QL-074": takeByRequiredTargets("GEO-RIV-001-QL-074", ["Ganga", "Brahmaputra", "Krishna", "Godavari", "Mahanadi", "Cauvery"], targetRiver),
  "GEO-RIV-001-QL-075": takeDistinct("GEO-RIV-001-QL-075", 6, stateFromReverseStem),
  "GEO-RIV-001-QL-076": takeDistinct("GEO-RIV-001-QL-076", 6, targetRiver),
  "GEO-RIV-001-QL-077": takeByRequiredTargets("GEO-RIV-001-QL-077", ["Pennar", "Teesta", "Subarnarekha", "Ganga", "Krishna", "Godavari"], targetRiver),
  "GEO-RIV-001-QL-078": takeDistinct("GEO-RIV-001-QL-078", 6, targetRiver),
  "GEO-RIV-001-QL-079": takeDistinct("GEO-RIV-001-QL-079", 6, targetRiver),
  "GEO-RIV-001-QL-080": takeDistinct("GEO-RIV-001-QL-080", 6, (question) => `${question.stem}|${question.canonicalAnswer}`),
  "GEO-RIV-001-QL-081": takeDistinct("GEO-RIV-001-QL-081", 6, (question) => question.stem, ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]),
  "GEO-RIV-001-QL-082": takeDistinct("GEO-RIV-001-QL-082", 6, (question) => question.stem, ["None", "One", "Two", "Three"]),
};

const rawBatch = QLS.flatMap((qlId) => selectedByQl[qlId]);
if (rawBatch.length !== 54) throw new Error(`CP009 V2 review batch expected 54 questions, got ${rawBatch.length}`);

function placeAnswer(question: GeoRiv001Cp009ReviewQuestion, targetIndex: number, index: number): GeoRiv001Cp009ReviewQuestion {
  const distractors = question.options.filter((_, optionIndex) => optionIndex !== question.correctIndex);
  const options = [...distractors];
  options.splice(targetIndex, 0, question.canonicalAnswer);
  return {
    ...question,
    questionId: `${question.questionId}-BATCH-${String(index + 1).padStart(2, "0")}`,
    options,
    correctIndex: targetIndex,
  };
}

const desiredPositions = deterministicShuffle(
  [
    ...Array(14).fill(0),
    ...Array(14).fill(1),
    ...Array(13).fill(2),
    ...Array(13).fill(3),
  ] as number[],
  "GEO-RIV-001-CP009-V2-ANSWER-POSITIONS",
);

export const GEO_RIV_001_CP009_REVIEW_BATCH_V2 = Object.freeze(
  rawBatch.map((question, index) => Object.freeze(placeAnswer(question, desiredPositions[index], index))),
);

export function auditGeoRiv001Cp009ReviewBatchV2() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const signatures = new Set<string>();
  const directRivers = new Set<string>();
  const courseSetRivers = new Set<string>();
  const sourceRivers = new Set<string>();
  const correctPairTargets = new Set<string>();
  const incorrectPairTargets = new Set<string>();
  const reverseStates = new Set<string>();
  const statementAnswers = new Set<string>();
  const countAnswers = new Set<string>();

  for (const question of GEO_RIV_001_CP009_REVIEW_BATCH_V2) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    const signature = semanticSignature(question);
    if (signatures.has(signature)) issues.push(`DUPLICATE_SEMANTIC_TASK:${signature}`);
    signatures.add(signature);

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTION_INTEGRITY:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_ALIGNMENT:${question.questionId}`);
    if (!question.sourceFactIds.length || !question.sourceIds.length) issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    if (question.sourceFactIds.some((id) => id.includes("cp006"))) issues.push(`CP006_LEAK:${question.questionId}`);
    const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
    if (/state set|reviewed Indian course|associated with|linked with|matches the reviewed relation|Correct fact:|The pair is incorrect\.|exam trap|shortcut|Therefore,/i.test(learnerText)) issues.push(`EDITORIAL_LANGUAGE:${question.questionId}`);

    if (question.qlId === "GEO-RIV-001-QL-074") directRivers.add(targetRiver(question));
    if (question.qlId === "GEO-RIV-001-QL-075") reverseStates.add(stateFromReverseStem(question));
    if (question.qlId === "GEO-RIV-001-QL-076") sourceRivers.add(targetRiver(question));
    if (question.qlId === "GEO-RIV-001-QL-077") courseSetRivers.add(question.canonicalAnswer);
    if (question.qlId === "GEO-RIV-001-QL-078") correctPairTargets.add(targetRiver(question));
    if (question.qlId === "GEO-RIV-001-QL-079") incorrectPairTargets.add(targetRiver(question));
    if (question.qlId === "GEO-RIV-001-QL-081") statementAnswers.add(question.canonicalAnswer);
    if (question.qlId === "GEO-RIV-001-QL-082") countAnswers.add(question.canonicalAnswer);
  }

  if (GEO_RIV_001_CP009_REVIEW_BATCH_V2.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP009_REVIEW_BATCH_V2.length}`);
  for (const qlId of QLS) if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY_COUNTS:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);
  if (signatures.size !== 54) issues.push(`SEMANTIC_UNIQUE:${signatures.size}`);
  const representedRivers = new Set([...directRivers, ...courseSetRivers]);
  for (const river of ALL_RIVERS) if (!representedRivers.has(river)) issues.push(`MISSING_CORE_RIVER:${river}`);
  if (directRivers.size !== 6) issues.push(`DIRECT_RIVER_DIVERSITY:${directRivers.size}`);
  if (courseSetRivers.size !== 6) issues.push(`COURSE_SET_RIVER_DIVERSITY:${courseSetRivers.size}`);
  if (sourceRivers.size !== 6) issues.push(`SOURCE_RIVER_DIVERSITY:${sourceRivers.size}`);
  if (reverseStates.size !== 6) issues.push(`REVERSE_STATE_DIVERSITY:${reverseStates.size}`);
  if (correctPairTargets.size !== 6) issues.push(`CORRECT_PAIR_TARGET_DIVERSITY:${correctPairTargets.size}`);
  if (incorrectPairTargets.size !== 6) issues.push(`INCORRECT_PAIR_TARGET_DIVERSITY:${incorrectPairTargets.size}`);
  for (const answer of ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]) if (!statementAnswers.has(answer)) issues.push(`MISSING_STATEMENT_OUTCOME:${answer}`);
  for (const answer of ["None", "One", "Two", "Three"]) if (!countAnswers.has(answer)) issues.push(`MISSING_COUNT_OUTCOME:${answer}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP009_REVIEW_BATCH_V2.length,
    qlCounts,
    difficultyCounts,
    answerPositions,
    semanticUniqueCount: signatures.size,
    directRivers: [...directRivers],
    courseSetRivers: [...courseSetRivers],
    representedCoreRivers: [...representedRivers],
    sourceRiverCount: sourceRivers.size,
    reverseStateCount: reverseStates.size,
    correctPairTargetCount: correctPairTargets.size,
    incorrectPairTargetCount: incorrectPairTargets.size,
    statementAnswers: [...statementAnswers],
    countAnswers: [...countAnswers],
  };
}
