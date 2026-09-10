import { generateCaseletBatch, LP_001_REVIEW_PACKAGE, type Caselet } from "./index.ts";
import { generateLp002Batch, LP_002_REVIEW_PACKAGE } from "./lp-002.ts";
import { generateLp003Batch, LP_003_REVIEW_PACKAGE } from "./lp-003.ts";
import { generateLp004Batch, LP_004_REVIEW_PACKAGE } from "./lp-004.ts";
import { generateLp005Batch, LP_005_REVIEW_PACKAGE } from "./lp-005.ts";
import { generateLp006Batch, LP_006_REVIEW_PACKAGE } from "./lp-006.ts";
import { generateLp007Batch, LP_007_REVIEW_PACKAGE } from "./lp-007.ts";
import { generateLp008Batch, LP_008_REVIEW_PACKAGE } from "./lp-008.ts";
import { generateLp009Batch, LP_009_REVIEW_PACKAGE } from "./lp-009.ts";
import { generateLp009LocalizedBatchV3 } from "./lp-009-localization-v3.ts";
import {
  LP_009_MULTILINGUAL_QUESTION_STUDIO_V1,
  normalizeLp009QuestionStudioLanguage,
} from "./lp-009-question-studio-multilingual-v1.ts";

export type LogicPuzzleQuestionStudioRequest = {
  packageId?: string; archetypeId?: string; patternId?: string; topic?: string; subtopic?: string; cpId?: string; canonicalProblemId?: string;
  language?: string; difficulty?: unknown; seed?: string; count?: number;
};

function normalize(value: unknown) { return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }

export function isLogicPuzzleQuestionStudioRequest(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const topic = normalize(request.topic); const subtopic = normalize(request.subtopic); const cp = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 001" || packageId === "lp 002" || packageId === "lp 003" || packageId === "lp 004" || packageId === "lp 005" || packageId === "lp 006" || packageId === "lp 007" || packageId === "lp 008" || packageId === "lp 009" || packageId === "logic puzzles" || cp.startsWith("lp ") || subtopic === "logic puzzles" || (topic === "reasoning" && subtopic === "puzzles");
}

function isLp002Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 002" || selector === "lp cp 002" || selector.startsWith("lp ql 005") || selector.startsWith("lp ql 006") || selector.startsWith("lp ql 007") || selector.startsWith("lp ql 008");
}

function isLp003Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 003" || selector === "lp cp 003" || selector.startsWith("lp ql 009") || selector.startsWith("lp ql 010") || selector.startsWith("lp ql 011") || selector.startsWith("lp ql 012");
}

function isLp004Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 004" || selector === "lp cp 004" || selector.startsWith("lp ql 013") || selector.startsWith("lp ql 014") || selector.startsWith("lp ql 015") || selector.startsWith("lp ql 016");
}

function isLp005Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 005" || selector === "lp cp 005" || selector.startsWith("lp ql 017") || selector.startsWith("lp ql 018") || selector.startsWith("lp ql 019") || selector.startsWith("lp ql 020");
}

function isLp006Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 006" || selector === "lp cp 006" || selector.startsWith("lp ql 021") || selector.startsWith("lp ql 022") || selector.startsWith("lp ql 023") || selector.startsWith("lp ql 024");
}

function isLp007Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 007" || selector === "lp cp 007" || selector.startsWith("lp ql 025") || selector.startsWith("lp ql 026") || selector.startsWith("lp ql 027") || selector.startsWith("lp ql 028");
}

function isLp008Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 008" || selector === "lp cp 008" || selector.startsWith("lp ql 029") || selector.startsWith("lp ql 030") || selector.startsWith("lp ql 031") || selector.startsWith("lp ql 032");
}

function isLp009Request(request: LogicPuzzleQuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return packageId === "lp 009" || selector === "lp cp 009" || selector.startsWith("lp ql 033") || selector.startsWith("lp ql 034") || selector.startsWith("lp ql 035") || selector.startsWith("lp ql 036");
}

function flatten(caselet: Caselet, caseletIndex: number, totalQuestionCount: number, seed: string) {
  return caselet.children.map((child, childIndex) => ({
    text: `${caselet.scenario}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`,
    options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer,
    explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation, difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand,
    patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1",
    packageId: LP_001_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
    language: "en", seed, questionIndex: caseletIndex * caselet.children.length + childIndex, questionCount: totalQuestionCount, runtimeMode: LP_001_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY",
    questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
    traceability: { checkpointId: LP_001_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" },
    metadata: { packageId: LP_001_REVIEW_PACKAGE.packageId, checkpointId: LP_001_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" },
    logic: { people: caselet.people, groups: caselet.groups, groupLabels: caselet.groupLabels, clues: caselet.clues, assignment: caselet.assignment },
  }));
}

export function listLogicPuzzleQuestionStudioPackages() {
  const capability = (pkg: typeof LP_001_REVIEW_PACKAGE | typeof LP_002_REVIEW_PACKAGE | typeof LP_003_REVIEW_PACKAGE | typeof LP_004_REVIEW_PACKAGE | typeof LP_005_REVIEW_PACKAGE | typeof LP_006_REVIEW_PACKAGE | typeof LP_007_REVIEW_PACKAGE | typeof LP_008_REVIEW_PACKAGE | typeof LP_009_REVIEW_PACKAGE) => {
    const base = { id: pkg.packageId, packageId: pkg.packageId, type: "reasoning-v1", section: "Reasoning", domain: "reasoning", subject: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", name: pkg.label, label: pkg.label, generationDomain: "reasoning-v1", cpIds: [pkg.checkpointId], canonicalProblems: pkg.qlIds.map((id) => ({ id, label: id, checkpointId: pkg.checkpointId })), patternIds: [...pkg.qlIds], supportedDifficulties: [...pkg.supportedDifficulties], supportedLanguages: [...pkg.supportedLanguages], enabled: true, runtimeMode: pkg.runtimeMode, supportedRuntimeModes: [pkg.runtimeMode], reviewStatus: "REVIEW_ONLY", releaseFreezeStatus: "NOT_FROZEN", reviewOnly: true, permanentQlCount: 0, permanentQlIds: [] as string[], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false };
    if (pkg.packageId !== "LP-009") return base;
    return {
      ...base,
      supportedLanguages: [...LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages],
      releaseFreezeStatus: "LOCALIZATION_FROZEN_V3",
      localizationFreezeStatus: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.localizationFreezeStatus,
      questionStudioLanguageActivation: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.questionStudioLanguageActivation,
      permanentQlCount: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlCount,
      permanentQlIds: [...LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlIds],
      permanentQlAllocationStatus: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlAllocationStatus,
    };
  };
  return [capability(LP_001_REVIEW_PACKAGE), capability(LP_002_REVIEW_PACKAGE), capability(LP_003_REVIEW_PACKAGE), capability(LP_004_REVIEW_PACKAGE), capability(LP_005_REVIEW_PACKAGE), capability(LP_006_REVIEW_PACKAGE), capability(LP_007_REVIEW_PACKAGE), capability(LP_008_REVIEW_PACKAGE), capability(LP_009_REVIEW_PACKAGE)];
}

export async function generateLogicPuzzleQuestionStudioBatch(request: LogicPuzzleQuestionStudioRequest = {}) {
  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const lp002 = isLp002Request(request); const lp003 = isLp003Request(request); const lp004 = isLp004Request(request); const lp005 = isLp005Request(request); const lp006 = isLp006Request(request); const lp007 = isLp007Request(request); const lp008 = isLp008Request(request); const lp009 = isLp009Request(request);
  const language = lp009 ? normalizeLp009QuestionStudioLanguage(request.language) : String(request.language ?? "en").trim().toLowerCase();
  if (!lp009 && language !== "en") throw new Error("LP-001 through LP-008 localization is not enabled; English review is the current allowed surface.");
  const seed = String(request.seed || `question-studio:${lp009 ? "LP-009" : lp008 ? "LP-008" : lp007 ? "LP-007" : lp006 ? "LP-006" : lp005 ? "LP-005" : lp004 ? "LP-004" : lp003 ? "LP-003" : lp002 ? "LP-002" : "LP-001"}`);
  if (lp009) {
    const caselets = language === "en" ? generateLp009Batch(seed, count) : generateLp009LocalizedBatchV3(language, seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: child.stem,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_009_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-${language.toUpperCase()}`, questionId: child.questionId,
      language, seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_009_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "FROZEN_LOCALIZATION_V3" }, metadata: { packageId: LP_009_REVIEW_PACKAGE.packageId, checkpointId: LP_009_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language, localizationAuthorityId: language === "en" ? "LP_009_ENGLISH_FREEZE_V1" : "LP_009_HI_PA_LOCALIZATION_FREEZE_V3" }, logic: { mode: caselet.mode, people: caselet.people, values: caselet.values, labels: caselet.labels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-009", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlCount, permanentQlIds: [...LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlIds], permanentQlAllocationStatus: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlAllocationStatus, localizationFreezeStatus: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.localizationFreezeStatus, questionStudioLanguageActivation: LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.questionStudioLanguageActivation, questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language, checkpointId: LP_009_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp008) {
    const caselets = generateLp008Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: child.stem,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_008_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_008_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_008_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_008_REVIEW_PACKAGE.packageId, checkpointId: LP_008_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { people: caselet.people, months: caselet.months, slots: caselet.slots, labels: caselet.labels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-008", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_008_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp007) {
    const caselets = generateLp007Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: child.stem,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_007_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_007_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_007_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_007_REVIEW_PACKAGE.packageId, checkpointId: LP_007_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { people: caselet.people, values: caselet.values, labels: caselet.labels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-007", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_007_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp006) {
    const caselets = generateLp006Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: child.stem,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_006_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_006_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_006_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_006_REVIEW_PACKAGE.packageId, checkpointId: LP_006_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { people: caselet.people, days: caselet.days, subjects: caselet.subjects, cities: caselet.cities, labels: caselet.labels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-006", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_006_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp005) {
    const caselets = generateLp005Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: `${caselet.scenario}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_005_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_005_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_005_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_005_REVIEW_PACKAGE.packageId, checkpointId: LP_005_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { people: caselet.people, duties: caselet.duties, places: caselet.places, labels: caselet.labels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-005", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_005_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp004) {
    const caselets = generateLp004Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: `${caselet.scenario}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_004_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_004_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_004_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_004_REVIEW_PACKAGE.packageId, checkpointId: LP_004_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { candidates: caselet.candidates, committeeSize: caselet.committeeSize, candidateLabels: caselet.candidateLabels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-004", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_004_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp003) {
    const caselets = generateLp003Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: `${caselet.scenario}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_003_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_003_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_003_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_003_REVIEW_PACKAGE.packageId, checkpointId: LP_003_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { boxes: caselet.boxes, positions: caselet.positions, boxLabels: caselet.boxLabels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-003", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_003_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  if (lp002) {
    const caselets = generateLp002Batch(seed, count);
    const questions = caselets.flatMap((caselet, index) => caselet.children.map((child, childIndex) => ({
      text: `${caselet.scenario}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`,
      options: child.options, correct: child.correctIndex, correctIndex: child.correctIndex, answer: child.answer, explanation: child.explanation.lines.join("\n\n"), packageExplanation: child.explanation,
      difficulty: child.difficultyBand, difficultyLabel: child.difficultyBand, patternId: child.qlId, section: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", generationBackend: "reasoning-v1", packageId: LP_002_REVIEW_PACKAGE.packageId, canonicalProblemId: child.qlId, questionLanguageId: `${child.qlId}-EN`, questionId: child.questionId,
      language: "en", seed, questionIndex: index * 4 + childIndex, questionCount: caselets.length * 4, runtimeMode: LP_002_REVIEW_PACKAGE.runtimeMode, reviewStatus: "REVIEW_ONLY", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      traceability: { checkpointId: LP_002_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: "SOURCE_SATURATION_REVIEW_REQUIRED" }, metadata: { packageId: LP_002_REVIEW_PACKAGE.packageId, checkpointId: LP_002_REVIEW_PACKAGE.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en" }, logic: { people: caselet.people, days: caselet.days, locations: caselet.locations, locationLabels: caselet.locationLabels, clues: caselet.clues, assignment: caselet.assignment },
    })));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-002", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_002_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }
  const caselets = generateCaseletBatch(seed, count);
  const questions = caselets.flatMap((caselet, index) => flatten(caselet, index, caselets.length * 4, seed));
  return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-001", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", lifecycleStatus: "REVIEW_ONLY", permanentQlCount: 0, permanentQlIds: [], permanentQlAllocationStatus: "UNALLOCATED", questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, language: "en", checkpointId: LP_001_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
}
