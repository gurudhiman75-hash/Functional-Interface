import { canonicalCp004Answer, deepFreeze, registryEntry, verifyCp004Answer, type Cp004MathematicalState, type IntCp004QlId, type IntCp004Question } from "./cp004-frequency-math";
import { generateCp004State } from "./cp004-frequency-generation";
import { optionsFor } from "./cp004-frequency-options";
import { explanationFor } from "./cp004-frequency-explanations";
import { stemFor } from "./cp004-frequency-presentations";
import { hardenCp004Presentation } from "./cp004-editorial-hardening";
import {
  assertCp004ReviewV3,
  hardenCp004ExplanationV3,
  hardenCp004OptionsV3,
  hardenCp004PresentationV3,
} from "./cp004-frequency-review-v3";
import {
  assertCp004ExamReadinessV4,
  hardenCp004ExplanationV4,
} from "./cp004-frequency-exam-readiness-v4";
import { generateCp004ExamReadyStateV4 } from "./cp004-frequency-state-policy-v4";
import { ensureCp004InverseExplanationDepthV4 } from "./cp004-frequency-explanation-depth-v4";
import { assertCp004VisibleGivensExamReadyV4 } from "./cp004-frequency-visible-givens-v4";
import { polishCp004TargetWordingV4 } from "./cp004-frequency-wording-v4";
import { assertCp004HumanPolishV4, polishCp004ExplanationHumanV4, polishCp004PresentationHumanV4 } from "./cp004-frequency-human-polish-v4";
import { polishCp004OptionsHumanV4 } from "./cp004-frequency-option-polish-v4";
import { finalizeCp004ExplanationLanguageV4 } from "./cp004-frequency-final-language-v4";
import { finalizeCp004TableLanguageV5 } from "./cp004-frequency-table-language-v5";
import { finalizeCp004PresentationLanguageV5 } from "./cp004-frequency-final-presentation-v5";
import { assertCp004FormulaStepV6, ensureCp004FormulaStepV6 } from "./cp004-frequency-formula-explanation-v6";

export * from "./cp004-frequency-math";
export { generateCp004State } from "./cp004-frequency-generation";
export { INT_CP004_EDITORIAL_REMEDIATION_VERSION } from "./cp004-frequency-exam-readiness-v4";

// Compatibility export retained for current-main sources that construct an explicit
// mathematical state (notably cp004-exam-friendly-source-v9). Its behavior matches
// the pre-integration New-main helper and does not alter the frozen V6 generator path.
export function generateIntCp004QuestionFromState(
  qlId: IntCp004QlId,
  seed: string,
  mathematicalState: Cp004MathematicalState,
): IntCp004Question {
  if (mathematicalState.qlId !== qlId) {
    throw new Error(`${qlId}/${seed}: explicit mathematical state belongs to ${mathematicalState.qlId}.`);
  }
  const entry = registryEntry(qlId);
  const solution = canonicalCp004Answer(mathematicalState);
  if (!verifyCp004Answer(mathematicalState, solution)) throw new Error(`${qlId}/${seed}: canonical answer failed independent verification.`);
  const hardenedPresentation = hardenCp004Presentation(mathematicalState, stemFor(mathematicalState, seed));
  const cleanedPresentation = Object.freeze({
    ...hardenedPresentation,
    stem: hardenedPresentation.stem
      .replace(/\bDetermine\b/gu, "Find")
      .replace(/\bIdentify\b/gu, "Find")
      .replace(/, find only the interest/gu, ". Find only the interest")
      .replace(/from annually compounding/gu, "from annual compounding")
      .replace(/to annually compounding/gu, "to annual compounding")
      .replace(/\bannually compounding\b/gu, "annual compounding")
      .replace(/\ba annual compounding scheme\b/gu, "an annual compounding scheme")
      .replace(/At ([0-9.]+%) per annum on (₹[0-9,.]+)\. Find only the interest in the maturity value\./gu, "Find only the interest in the maturity value on $2 at $1 per annum."),
  });
  const presentation = hardenCp004PresentationV3(cleanedPresentation);
  const options = hardenCp004OptionsV3(mathematicalState, optionsFor(mathematicalState, seed));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: option ownership failed.`);
  const correctAnswer = options[correctIndex]!.text;
  const explanation = hardenCp004ExplanationV3(mathematicalState, explanationFor(mathematicalState, correctAnswer));
  assertCp004ReviewV3(mathematicalState, presentation, options, explanation);
  return deepFreeze({ packageId: "INT-001", canonicalProblemId: "INT-CP-004", permanentQlId: qlId, qlId,
    solveContract: entry.solveContract, answerSemantic: entry.answerSemantic, difficulty: entry.difficulty, seed, mathematicalState,
    representation: presentation.representation, stemFamilyId: presentation.stemFamilyId, stem: presentation.stem, options,
    correctIndex, correctAnswer, solution, explanation, authorityVersion: "INT-CP-004-MATH-AUTHORITY-v1",
    generatorVersion: "INT-CP-004-EXAM-GENERATOR-v1", solverVersion: "INT-CP-004-CANONICAL-SOLVER-v1",
    verifierVersion: "INT-CP-004-RELATION-VERIFIER-v1", editorialStatus: "ENGLISH_REVIEW_CANDIDATE",
    approvalStatus: "NOT_APPROVED", enabled: false, stagingStatus: "NOT_STAGED", registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false, questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false });
}

export function generateIntCp004Question(qlId: IntCp004QlId, seed = "int-cp004-default"): IntCp004Question {
  const entry = registryEntry(qlId);
  const mathematicalState = generateCp004ExamReadyStateV4(qlId, seed);
  const solution = canonicalCp004Answer(mathematicalState);
  if (!verifyCp004Answer(mathematicalState, solution)) throw new Error(`${qlId}/${seed}: canonical answer failed independent verification.`);
  const hardenedPresentation = hardenCp004Presentation(mathematicalState, stemFor(mathematicalState, seed));
  const cleanedPresentation = Object.freeze({
    ...hardenedPresentation,
    stem: hardenedPresentation.stem
      .replace(/\bDetermine\b/gu, "Find")
      .replace(/\bIdentify\b/gu, "Find")
      .replace(/, find only the interest/gu, ". Find only the interest")
      .replace(/from annually compounding/gu, "from annual compounding")
      .replace(/to annually compounding/gu, "to annual compounding")
      .replace(/\bannually compounding\b/gu, "annual compounding")
      .replace(/\ba annual compounding scheme\b/gu, "an annual compounding scheme")
      .replace(/At ([0-9.]+%) per annum on (₹[0-9,.]+)\. Find only the interest in the maturity value\./gu, "Find only the interest in the maturity value on $2 at $1 per annum."),
  });
  const v3Presentation = hardenCp004PresentationV3(cleanedPresentation);
  const humanPresentation = polishCp004PresentationHumanV4(mathematicalState, v3Presentation);
  const tableReadyPresentation = finalizeCp004TableLanguageV5(mathematicalState, humanPresentation);
  const presentation = finalizeCp004PresentationLanguageV5(mathematicalState, tableReadyPresentation);
  assertCp004VisibleGivensExamReadyV4(mathematicalState, presentation.stem);
  const v3Options = hardenCp004OptionsV3(mathematicalState, optionsFor(mathematicalState, seed));
  const options = polishCp004OptionsHumanV4(mathematicalState, v3Options);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: option ownership failed.`);
  const correctAnswer = options[correctIndex]!.text;
  const v3Explanation = hardenCp004ExplanationV3(mathematicalState, explanationFor(mathematicalState, correctAnswer));
  const v4Explanation = hardenCp004ExplanationV4(mathematicalState, v3Explanation);
  const depthReadyExplanation = ensureCp004InverseExplanationDepthV4(mathematicalState, v4Explanation);
  const targetReadyExplanation = polishCp004TargetWordingV4(mathematicalState, depthReadyExplanation);
  const humanExplanation = polishCp004ExplanationHumanV4(mathematicalState, targetReadyExplanation);
  const languageReadyExplanation = finalizeCp004ExplanationLanguageV4(mathematicalState, humanExplanation);
  const explanation = ensureCp004FormulaStepV6(mathematicalState, languageReadyExplanation);
  assertCp004FormulaStepV6(mathematicalState, explanation);
  assertCp004ReviewV3(mathematicalState, presentation, options, explanation);
  assertCp004ExamReadinessV4(mathematicalState, explanation);
  assertCp004HumanPolishV4(mathematicalState, presentation, explanation);
  return deepFreeze({ packageId: "INT-001", canonicalProblemId: "INT-CP-004", permanentQlId: qlId, qlId,
    solveContract: entry.solveContract, answerSemantic: entry.answerSemantic, difficulty: entry.difficulty, seed, mathematicalState,
    representation: presentation.representation, stemFamilyId: presentation.stemFamilyId, stem: presentation.stem, options,
    correctIndex, correctAnswer, solution, explanation, authorityVersion: "INT-CP-004-MATH-AUTHORITY-v1",
    generatorVersion: "INT-CP-004-EXAM-GENERATOR-v1", solverVersion: "INT-CP-004-CANONICAL-SOLVER-v1",
    verifierVersion: "INT-CP-004-RELATION-VERIFIER-v1", editorialStatus: "ENGLISH_REVIEW_CANDIDATE",
    approvalStatus: "NOT_APPROVED", enabled: false, stagingStatus: "NOT_STAGED", registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false, questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false });
}
