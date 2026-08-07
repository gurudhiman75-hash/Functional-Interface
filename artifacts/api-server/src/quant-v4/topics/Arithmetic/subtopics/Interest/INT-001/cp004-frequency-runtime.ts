import { canonicalCp004Answer, deepFreeze, registryEntry, verifyCp004Answer, type IntCp004QlId, type IntCp004Question } from "./cp004-frequency-math";
import { generateCp004State } from "./cp004-frequency-generation";
import { optionsFor } from "./cp004-frequency-options";
import { explanationFor } from "./cp004-frequency-explanations";
import { stemFor } from "./cp004-frequency-presentations";
import { hardenCp004Presentation } from "./cp004-editorial-hardening";

export * from "./cp004-frequency-math";
export { generateCp004State } from "./cp004-frequency-generation";

export function generateIntCp004Question(qlId: IntCp004QlId, seed = "int-cp004-default"): IntCp004Question {
  const entry = registryEntry(qlId);
  const mathematicalState = generateCp004State(qlId, seed);
  const solution = canonicalCp004Answer(mathematicalState);
  if (!verifyCp004Answer(mathematicalState, solution)) throw new Error(`${qlId}/${seed}: canonical answer failed independent verification.`);
  const hardenedPresentation = hardenCp004Presentation(mathematicalState, stemFor(mathematicalState, seed));
  const presentation = Object.freeze({
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
  const options = optionsFor(mathematicalState, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: option ownership failed.`);
  const correctAnswer = options[correctIndex]!.text;
  const explanation = explanationFor(mathematicalState, correctAnswer);
  return deepFreeze({ packageId: "INT-001", canonicalProblemId: "INT-CP-004", permanentQlId: qlId, qlId,
    solveContract: entry.solveContract, answerSemantic: entry.answerSemantic, difficulty: entry.difficulty, seed, mathematicalState,
    representation: presentation.representation, stemFamilyId: presentation.stemFamilyId, stem: presentation.stem, options,
    correctIndex, correctAnswer, solution, explanation, authorityVersion: "INT-CP-004-MATH-AUTHORITY-v1",
    generatorVersion: "INT-CP-004-EXAM-GENERATOR-v1", solverVersion: "INT-CP-004-CANONICAL-SOLVER-v1",
    verifierVersion: "INT-CP-004-RELATION-VERIFIER-v1", editorialStatus: "ENGLISH_REVIEW_CANDIDATE",
    approvalStatus: "NOT_APPROVED", enabled: false, stagingStatus: "NOT_STAGED", registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false, questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false });
}
