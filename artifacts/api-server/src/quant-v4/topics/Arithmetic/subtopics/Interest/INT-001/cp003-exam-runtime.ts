import {
  INT_CP003_AUTHORITY_VERSION,
  INT_CP003_QL_IDS,
  INT_CP003_RATE_LIBRARY,
  INT_CP003_SOLVER_VERSION,
  INT_CP003_VERIFIER_VERSION,
  canonicalAnswer,
  generateCp003QuestionContract,
  getIntCp003RegistryEntry,
  verifyAnswer,
  type IntCp003QlId,
  type Rational,
} from "./cp003-exam-model";
import type { IntCp003ExamQuestion } from "./cp003-exam-types";
import { ANSWER_SEMANTICS, resolve } from "./cp003-exam-support";
import { presentationFor } from "./cp003-grounded-presentation";
import { optionsFor } from "./cp003-exam-options";
import { explanationFor } from "./cp003-grounded-explanation";
import {
  INT_CP003_SOLUTION_TRACE_VERSION,
  buildCp003SolutionTrace,
  validateCp003SolutionTrace,
} from "./cp003-grounded-solution-trace";
import { assertCp003PresentationGrounding } from "./cp003-presentation-grounding";

export const INT_CP003_EXAM_GENERATOR_VERSION = "INT-CP-003-EXAM-GENERATOR-v9" as const;

export {
  INT_CP003_AUTHORITY_VERSION,
  INT_CP003_QL_IDS,
  INT_CP003_RATE_LIBRARY,
  INT_CP003_SOLVER_VERSION,
  INT_CP003_VERIFIER_VERSION,
  generateCp003QuestionContract,
  type IntCp003QlId,
  type Rational,
} from "./cp003-exam-model";
export { INT_CP003_SOLUTION_TRACE_VERSION } from "./cp003-grounded-solution-trace";
export type { IntCp003ExamQuestion } from "./cp003-exam-types";

export function normalizePresentationTemplate(markdown: string): string {
  return markdown
    .replace(/₹[0-9,]+(?:\.[0-9]+)?/gu, "₹X")
    .replace(/\$[0-9]+(?:\\frac\{[0-9]+\}\{[0-9]+\})?\\%\$/gu, "$R%$")
    .replace(/\$[0-9]+(?:\.[0-9]+)?\\%\$/gu, "$R%$")
    .replace(/\$[0-9]+\^\{\\text\{(?:st|nd|rd|th)\}\}\$/gu, "$Kth$")
    .replace(/\$[0-9]+\$/gu, "$N$")
    .replace(/\b[0-9]+\b/gu, "N");
}

function stableIndex(source: string, length: number): number {
  let state = 2166136261;
  for (const character of source) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return (state >>> 0) % length;
}

function contractForReview(qlId: IntCp003QlId, seed: string) {
  const preferProse = stableIndex(`${seed}:${qlId}:representation-policy-v1`, 10) < 7;
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const effectiveSeed = attempt === 0 ? seed : `${seed}:exam-shape:${attempt}`;
    const contract = generateCp003QuestionContract(qlId, effectiveSeed);
    const state = contract.mathematicalState;
    if (qlId === "INT-QL-057" && "years" in state && state.years !== 2) continue;
    if (qlId === "INT-QL-061" && "targetYear" in state && state.targetYear > 3) continue;
    const isProse = contract.presentation.representation === "STANDARD_PROSE";
    if (preferProse !== isProse) continue;
    return contract;
  }
  throw new Error(`${qlId}: could not construct an exam-friendly ${preferProse ? "prose" : "structured"} state`);
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, output));
  return output;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}

export function generateIntCp003ExamQuestion(
  qlId: IntCp003QlId,
  seed = "int-cp003-exam-default",
): IntCp003ExamQuestion {
  const registryEntry = getIntCp003RegistryEntry(qlId);
  const contract = contractForReview(qlId, seed);
  const resolved = resolve(contract.mathematicalState);
  const solution = canonicalAnswer(contract.mathematicalState);
  if (!verifyAnswer(contract.mathematicalState, solution)) throw new Error(`${qlId}: canonical solver and independent relation verifier disagree`);
  if (registryEntry.answerSemantic !== ANSWER_SEMANTICS[qlId]) throw new Error(`${qlId}: registry and learner answer semantics disagree`);

  const presentation = presentationFor(contract, resolved);
  if (/\$1\$\s+years\b/u.test(presentation.markdown)) throw new Error(`${qlId}: singular duration grammar reached the displayed question`);
  const solutionTrace = buildCp003SolutionTrace(contract, resolved, solution);
  const traceValidation = validateCp003SolutionTrace(solutionTrace, contract.mathematicalState);
  if (!traceValidation.ok) throw new Error(`${qlId}: invalid solution trace: ${traceValidation.errors.join(" | ")}`);

  const options = optionsFor(contract, resolved);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}: correct option ownership failure`);
  const explanation = explanationFor(solutionTrace);
  assertCp003PresentationGrounding(contract, resolved, presentation, solutionTrace, explanation);

  const explanationStrings = collectStrings(explanation);
  if (explanationStrings.some((text) => /\$=\$[^$\n]+\$\$/u.test(text))) throw new Error(`${qlId}: malformed MathJax delimiter reached learner content`);
  if (explanationStrings.some((text) => /\$[^$\n]*(?:⅓|⅔|⅛|⅜|⅝|⅞|¼|½|¾|14 2\/7)[^$\n]*\$/u.test(text))) {
    throw new Error(`${qlId}: unicode or plain mixed fraction reached MathJax content`);
  }
  const normalizedTemplateKey = `${qlId}|${normalizePresentationTemplate(presentation.markdown)}`;
  const question: IntCp003ExamQuestion = {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-003",
    checkpointId: "INT-CP-003-EXAM-READINESS-REMEDIATION",
    permanentQlId: registryEntry.qlId,
    qlId,
    solveContract: registryEntry.solveContract,
    authorityVersion: INT_CP003_AUTHORITY_VERSION,
    generatorVersion: INT_CP003_EXAM_GENERATOR_VERSION,
    solverVersion: INT_CP003_SOLVER_VERSION,
    verifierVersion: INT_CP003_VERIFIER_VERSION,
    seed,
    mathematicalState: contract.mathematicalState,
    mathematicalFingerprint: contract.mathematicalFingerprint,
    numericFamilyKey: contract.numericFamilyKey,
    rateProfileId: contract.rateProfileId,
    normalizedTemplateKey,
    contextClass: contract.presentation.contextClass,
    presentation,
    difficulty: contract.difficultyProfile.label,
    difficultyProfile: contract.difficultyProfile,
    answerSemantic: ANSWER_SEMANTICS[qlId],
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    solution,
    solutionTrace,
    explanation,
    editorialStatus: "SECOND_REMEDIATION_REVIEW_CANDIDATE",
    approvalStatus: "WITHDRAWN_PENDING_REAUDIT",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
  return deepFreeze(question);
}
