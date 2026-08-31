import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV2 } from "./com003-review-synthesis-v2";
import type { Com003ReviewQuestion } from "./com003-review-types";

const factById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));

const QL_CONTEXT: Record<string, readonly string[]> = {
  "COM-003-QL-001": ["In Microsoft Office", "For Office productivity software", "Within a desktop Office suite"],
  "COM-003-QL-002": ["For Office file formats", "In Microsoft Office", "When identifying Office documents"],
  "COM-003-QL-003": ["For common Office commands", "In a desktop Office application", "When editing an Office file"],
  "COM-003-QL-004": ["In Microsoft Word", "When editing a Word document", "For Word text formatting"],
  "COM-003-QL-005": ["In Microsoft Word", "When checking a Word document", "For Word correction tools"],
  "COM-003-QL-006": ["In Microsoft Word", "For Word page layout", "When formatting document pages"],
  "COM-003-QL-007": ["In Microsoft Word mail merge", "For a Word mail-merge task", "When preparing personalized Word documents"],
  "COM-003-QL-008": ["In Microsoft Excel", "Within an Excel worksheet", "For spreadsheet structure and references"],
  "COM-003-QL-009": ["In Microsoft Excel", "Within an Excel formula", "For spreadsheet calculations"],
  "COM-003-QL-010": ["In Microsoft Excel", "For basic Excel functions", "When calculating worksheet values"],
  "COM-003-QL-011": ["In Microsoft Excel", "When copying an Excel formula", "For Excel cell references"],
  "COM-003-QL-012": ["In Microsoft Excel", "When handling worksheet data", "For Excel data operations"],
  "COM-003-QL-013": ["In Microsoft Excel", "When changing worksheet structure", "For Excel rows and columns"],
  "COM-003-QL-014": ["In Microsoft Excel", "For a basic Excel chart", "When visualizing worksheet data"],
  "COM-003-QL-015": ["In Windows desktop Excel", "For Windows desktop Excel", "When using Windows desktop Excel"],
  "COM-003-QL-016": ["In Microsoft PowerPoint", "When creating a PowerPoint presentation", "For PowerPoint slide structure"],
  "COM-003-QL-017": ["In Microsoft PowerPoint", "When adding content to a slide", "For PowerPoint insertable objects"],
  "COM-003-QL-018": ["In Microsoft PowerPoint", "For PowerPoint transitions and timing", "When controlling slide effects"],
  "COM-003-QL-019": ["In Windows desktop PowerPoint", "For Windows desktop PowerPoint", "When presenting with Windows desktop PowerPoint"],
};

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function normalizeExamInstruction(stem: string) {
  const trimmed = stem.trim();
  if (/^(Identify|Select|Choose)\b/i.test(trimmed)) return trimmed;
  return trimmed;
}

function contextualize(question: Com003ReviewQuestion, index: number) {
  const contexts = QL_CONTEXT[question.qlId] ?? ["In this computer-awareness context"];
  const context = contexts[index % contexts.length]!;
  const stem = normalizeExamInstruction(question.stem);
  if (new RegExp(`^${context.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\b`, "i").test(stem)) return stem;
  if (/^In Windows desktop/i.test(stem) && /Windows desktop/i.test(context)) return stem;
  return `${context}, ${lowerFirst(stem)}`;
}

function remediateQl008Leak(question: Com003ReviewQuestion) {
  if (question.qlId !== "COM-003-QL-008" || question.surfaceMode !== "STRUCTURE_TERM_FROM_DEFINITION") return question;
  const fact = factById.get(question.targetFactId);
  if (!fact || fact.value.kind !== "text") return question;
  const stem = `Which Excel structure term matches this definition: ${fact.value.text.en.trim()}?`;
  return { ...question, stem };
}

export function generateCom003ReviewQuestionV3(qlId: string, seed: string, index = 0) {
  const base = generateCom003ReviewQuestionV2(qlId, seed, index);
  const leakSafe = remediateQl008Leak(base);
  return {
    ...leakSafe,
    questionId: leakSafe.questionId.replace("COM003-REVIEW-V2-", "COM003-REVIEW-V3-").replace("COM003-REVIEW-", "COM003-REVIEW-V3-"),
    stem: contextualize(leakSafe, index),
  };
}

export function buildCom003EnglishReviewCorpusV3(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v3";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestionV3(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V3 = buildCom003EnglishReviewCorpusV3();
