import { generateIntCp002Wave01Prototype as generateV1 } from "./cp002-wave01-runtime";
import type {
  IntCp002Wave01Explanation,
  IntCp002Wave01GeneratedPrototype,
  IntCp002Wave01PrototypeId,
} from "./cp002-wave01-types";

export const INT_CP002_WAVE01_RUNTIME_V2 = Object.freeze({
  id: "INT-CP-002-WAVE01-ENGLISH-PROTOTYPES-V2",
  supersedes: "INT-CP-002-WAVE01-ENGLISH-PROTOTYPES-V1",
  status: "EXECUTABLE_DISCOVERY",
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});

export function repairIntCp002Wave01MathJax(text: string): string {
  return text
    .replace(/\u000crac/gu, "\\frac")
    .replace(/\u0009imes/gu, "\\times")
    .replace(/\u0009ext/gu, "\\text")
    .replace(/(^|[^\\])Delta(?=\s*I\b)/gu, "$1\\Delta");
}

function repairExplanation(
  explanation: IntCp002Wave01Explanation,
): IntCp002Wave01Explanation {
  return {
    mainRule: repairIntCp002Wave01MathJax(explanation.mainRule),
    workedSteps: explanation.workedSteps.map(repairIntCp002Wave01MathJax),
    examShortcut: repairIntCp002Wave01MathJax(explanation.examShortcut),
    verification: repairIntCp002Wave01MathJax(explanation.verification),
    conclusion: repairIntCp002Wave01MathJax(explanation.conclusion),
    trapAnalysis: explanation.trapAnalysis.map((item) => ({
      ...item,
      explanation: repairIntCp002Wave01MathJax(item.explanation),
    })),
  };
}

export function assertIntCp002Wave01MathJaxIntegrity(text: string, label: string): void {
  if (/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/u.test(text)) {
    throw new Error(`${label}: control character found in learner text.`);
  }
  const displayDelimiterCount = (text.match(/\$\$/gu) ?? []).length;
  if (displayDelimiterCount % 2 !== 0) {
    throw new Error(`${label}: unbalanced display-math delimiters.`);
  }
  const inlineStripped = text.replace(/\$\$[\s\S]*?\$\$/gu, "");
  const inlineDelimiterCount = (inlineStripped.match(/\$/gu) ?? []).length;
  if (inlineDelimiterCount % 2 !== 0) {
    throw new Error(`${label}: unbalanced inline-math delimiters.`);
  }
  const mathSegments = text.match(/\$\$[\s\S]*?\$\$|\$[^$]+\$/gu) ?? [];
  for (const [index, segment] of mathSegments.entries()) {
    if (/(^|[^\\])(?:frac\{|times\b|text\{|Delta\b)/u.test(segment)) {
      throw new Error(`${label}: bare TeX command in math segment ${index + 1}.`);
    }
    if (/\[object Object\]/u.test(segment)) {
      throw new Error(`${label}: malformed object in math segment ${index + 1}.`);
    }
  }
}

export function generateIntCp002Wave01PrototypeV2(request: {
  prototypeId: IntCp002Wave01PrototypeId;
  seed: string;
}): IntCp002Wave01GeneratedPrototype {
  const v1 = generateV1(request);
  const explanation = repairExplanation(v1.explanation);
  const learnerText = [
    v1.stem,
    ...v1.options,
    explanation.mainRule,
    ...explanation.workedSteps,
    explanation.examShortcut,
    explanation.verification,
    explanation.conclusion,
    ...explanation.trapAnalysis.map((item) => item.explanation),
  ].join("\n");
  assertIntCp002Wave01MathJaxIntegrity(learnerText, `${request.prototypeId}/${request.seed}`);
  return {
    ...v1,
    explanation,
    mathematicalFingerprint: `${v1.mathematicalFingerprint}|EXPLANATION-V2`,
  };
}
