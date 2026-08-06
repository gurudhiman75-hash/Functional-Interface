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
import type { Cp003StudentExplanation, IntCp003ExamQuestion } from "./cp003-exam-types";
import { ANSWER_SEMANTICS, resolve } from "./cp003-exam-support";
import { presentationFor } from "./cp003-grounded-presentation";
import { optionsFor } from "./cp003-exam-options";
import { explanationFor } from "./cp003-grounded-explanation";
import { assertCp003ExplanationStyle } from "./cp003-exam-explanation-style";
import {
  assertCp003ExamStemStyle,
  isCp003BankContextRealistic,
  refineCp003Presentation,
} from "./cp003-editorial-policy";
import {
  INT_CP003_SOLUTION_TRACE_VERSION,
  buildCp003SolutionTrace,
  validateCp003SolutionTrace,
} from "./cp003-grounded-solution-trace";
import { assertCp003PresentationGrounding } from "./cp003-presentation-grounding";

export const INT_CP003_EXAM_GENERATOR_VERSION = "INT-CP-003-EXAM-GENERATOR-v13" as const;

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
    .replace(/\b[0-9]+\b/gu, "N")
    .replace(/\byears?\b/gu, "YEAR");
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
    if (!isCp003BankContextRealistic(contract)) continue;
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

function simplerStudentLanguage(text: string): string {
  return text
    .replace("First see how many times the money became:", "First compare the final amount with the original sum:")
    .replace("First find how many times the money became, and then find the increase for one year.", "First compare the two amounts, and then find the yearly increase.")
    .replace("We compare the total increase with the same increase applied year after year.", "We compare the final amount with the original sum and check how the money changes each year.")
    .replace("The same yearly increase", "The given yearly rate")
    .replace("Same yearly increase", "Given yearly rate")
    .replace(/the same yearly increase/gu, "the given yearly rate")
    .replace(/same yearly increase/gu, "given yearly rate")
    .replace(/complete increase for all the years/giu, "interest added over all the years")
    .replace(/complete multi-year increase/giu, "interest added over the full period")
    .replace(/ of growth\b/giu, " of earlier interest")
    .replace(/This change took place over/giu, "This happened over")
    .replace(/the balance became (\$[^$]+\$) times in each year\./gu, "the amount was multiplied by $1 each year.")
    .replace(/move the earlier interest forward through each year in between/giu, "increase the earlier interest once for each year in between")
    .replace(/for every ₹1 of the original sum, the interest in the required year is/giu, "the required year's interest is this part of the original sum:")
    .replace("Applying the given yearly rate once gives", "Increasing it once at the given rate gives")
    .replace("Applying the given yearly rate", "Increasing it at the given rate")
    .replace(
      /Because that year's interest is calculated after (\d+) years? of earlier interest, those earlier increases must be included before solving for the original sum\./u,
      (_match, years: string) => `That year's interest is calculated on the balance present at the start of the year, after ${years} earlier year${years === "1" ? "" : "s"}. We must include that earlier interest before finding the original sum.`,
    );
}

function polishExplanationWording(
  qlId: IntCp003QlId,
  explanation: Cp003StudentExplanation,
): Cp003StudentExplanation {
  const polish = (text: string, index = -1): string => {
    let result = simplerStudentLanguage(text)
      .replace("There are 1 year between the two given yearly interests.", "There is 1 year between the two given yearly interests.")
      .replace("Applying the given yearly rate 1 time gives", "Increasing it once at the given rate gives")
      .replace("carry the earlier amount back to year 0", "use that one-year change to work backwards and find the starting sum");
    if (qlId === "INT-QL-061") {
      result = result.replace(
        "Because answer choices are given and each choice changes both the opening balance and that year's interest, the clearest method is to check the choices directly.",
        "Interest in that year is calculated on the balance present at the start of the year. We will check an option by first finding that balance and then calculating that year's interest.",
      );
      result = result.replace(
        "This is exactly the interest given in the question, so",
        "This is the calculated interest, matching the given interest exactly. Therefore,",
      );
      if (index === 1 && !/\\times/u.test(result)) {
        result = `${result} Written as a multiplication, this is the opening balance $\\times$ rate divided by 100.`;
      }
    }
    return result;
  };
  const steps = Object.freeze(explanation.steps.map(polish));
  return Object.freeze({
    ...explanation,
    keyIdea: polish(explanation.keyIdea),
    steps,
    ...(explanation.shortcut ? {
      shortcut: Object.freeze({
        ...explanation.shortcut,
        steps: Object.freeze(explanation.shortcut.steps.map(polish)),
      }),
    } : {}),
    ...(explanation.commonMistake ? { commonMistake: polish(explanation.commonMistake) } : {}),
    ...(explanation.verification ? {
      verification: Object.freeze({
        ...explanation.verification,
        steps: Object.freeze(explanation.verification.steps.map(polish)),
      }),
    } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ steps: Object.freeze(explanation.depths.exam.steps.map(polish)), sourceStepIds: explanation.depths.exam.sourceStepIds }),
      student: Object.freeze({ steps: Object.freeze(explanation.depths.student.steps.map(polish)), sourceStepIds: explanation.depths.student.sourceStepIds }),
      foundation: Object.freeze({ steps: Object.freeze(explanation.depths.foundation.steps.map(polish)), sourceStepIds: explanation.depths.foundation.sourceStepIds }),
    }),
  });
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

  // Mathematical resampling may change contract.seed. Editorial wording must remain owned by the caller's stable seed.
  const presentationContract = Object.freeze({ ...contract, seed });
  const rawPresentation = presentationFor(presentationContract, resolved);
  const presentation = refineCp003Presentation(presentationContract, resolved, rawPresentation);
  assertCp003ExamStemStyle(presentationContract, presentation);
  if (/\$1\$\s+years\b/u.test(presentation.markdown)) throw new Error(`${qlId}: singular duration grammar reached the displayed question`);
  const solutionTrace = buildCp003SolutionTrace(contract, resolved, solution);
  const traceValidation = validateCp003SolutionTrace(solutionTrace, contract.mathematicalState);
  if (!traceValidation.ok) throw new Error(`${qlId}: invalid solution trace: ${traceValidation.errors.join(" | ")}`);

  const options = optionsFor(contract, resolved);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}: correct option ownership failure`);
  const explanation = polishExplanationWording(qlId, explanationFor(solutionTrace));
  assertCp003ExplanationStyle(qlId, explanation);
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
