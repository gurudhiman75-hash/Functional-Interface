import { Buffer } from "node:buffer";

export const TRG_002_EXAMTREE_DIRECTIVE = "EXAMTREE_TRIG_HEIGHTS_SVG_V1" as const;
export const TRG_002_EXAMTREE_DIRECTIVE_PREFIX = `[[${TRG_002_EXAMTREE_DIRECTIVE}:` as const;
export const TRG_002_EXAMTREE_MAX_ENCODED_LENGTH = 32_768;

type FinalTrg002Question = {
  qlId: string;
  stem: string;
  solutionDiagram?: unknown;
  solutionAnnotations?: unknown[];
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string }>;
    shortcut: string;
    traps: string[];
  };
};

export type Trg002ExamTreeSolutionPayload = {
  version: 1;
  qlId: string;
  diagram: unknown;
  annotations: unknown[];
};

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/gu, "");
}

export function serializeTrg002ExamTreeSolutionDiagram(question: FinalTrg002Question): string {
  if (!question.solutionDiagram) {
    throw new Error(`${question.qlId}: required solution diagram is missing.`);
  }
  const payload: Trg002ExamTreeSolutionPayload = {
    version: 1,
    qlId: question.qlId,
    diagram: question.solutionDiagram,
    annotations: question.solutionAnnotations ?? [],
  };
  const encoded = encodeBase64Url(JSON.stringify(payload));
  if (encoded.length > TRG_002_EXAMTREE_MAX_ENCODED_LENGTH) {
    throw new Error(`${question.qlId}: ExamTree solution directive exceeds ${TRG_002_EXAMTREE_MAX_ENCODED_LENGTH} encoded characters.`);
  }
  return `${TRG_002_EXAMTREE_DIRECTIVE_PREFIX}${encoded}]]`;
}

/**
 * Student-facing explanation string for the existing ExamTree question model.
 * The diagram directive is deliberately appended to the explanation, so the
 * current practice/result UI reveals it only at the solution stage.
 */
export function buildTrg002ExamTreeExplanation(question: FinalTrg002Question): string {
  const body = [
    `Core rule: ${question.explanation.keyRule}`,
    ...question.explanation.steps.map((step) => `${step.title}: ${step.body}`),
    `Shortcut: ${question.explanation.shortcut}`,
    question.explanation.traps.length ? `Common trap: ${question.explanation.traps.join(" ")}` : "",
    serializeTrg002ExamTreeSolutionDiagram(question),
  ].filter(Boolean);
  return body.join("\n\n");
}
