import { getQuestionLanguageEntries, renderQuestionLanguage, requiredVisibleFields, validateNsPrm001Libraries } from "./library";
import { isPrime, nthPrime, primesBetween } from "./math";
import {
  NS_PRM_001_ARCHETYPE_ID,
  NS_PRM_001_CP_001,
  NS_PRM_001_CP_002,
  NS_PRM_001_CP_003,
  NS_PRM_001_CP_004,
  NS_PRM_001_CP_005,
  NS_PRM_001_CP_006,
  NS_PRM_001_CP_007,
  NS_PRM_001_CP_008,
  type NsPrm001QuestionPackage,
  type NsPrm001ReasoningGraph,
  type NsPrm001SolverResult,
  type NsPrm001ValidationResult,
} from "./types";

export function validateNsPrm001AnswerContract(solver: NsPrm001SolverResult, reasoningGraph: NsPrm001ReasoningGraph): NsPrm001ValidationResult {
  const graphAnswer = reasoningGraph.nodes.find((node) => node.id === reasoningGraph.answerNodeId)?.outputs.answer;
  return result([
    check("graph-answer", graphAnswer === solver.answer, "Reasoning graph final answer must match solver answer."),
    check("solver-verification", Object.values(solver.verification).every(Boolean), "Solver verification flags must all pass."),
  ]);
}

export function validateNsPrm001QuestionPackage(questionPackage: NsPrm001QuestionPackage): NsPrm001ValidationResult {
  const p = questionPackage.parameters;
  const s = questionPackage.solver;
  const libraryValidation = validateNsPrm001Libraries();
  const checks = [
    check("library-validation", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries are valid."),
    check("archetype-id", questionPackage.archetypeId === NS_PRM_001_ARCHETYPE_ID, "Archetype ID must be NS-PRM-001."),
    check("traceability-question-id", questionPackage.questionId === p.questionId && Boolean(questionPackage.questionId), "Question ID must be present and consistent."),
    check("traceability-cp-id", questionPackage.canonicalProblemId === p.canonicalProblemId, "CP ID must be present and consistent."),
    check("traceability-reasoning-pattern", questionPackage.reasoningPatternId === p.reasoningPatternId, "Reasoning pattern ID must be present and consistent."),
    check("traceability-difficulty", Boolean(questionPackage.difficultyBand), "Difficulty band must be present."),
    check("question-language-id", getQuestionLanguageEntries(p.canonicalProblemId).some((entry) => entry.id === questionPackage.questionLanguageId), "Question language ID must be approved."),
    check("stem-rendered", renderQuestionLanguage({ canonicalProblemId: p.canonicalProblemId, questionLanguageId: questionPackage.questionLanguageId, values: values(p) }) === questionPackage.stem, "Stem must render from approved question language."),
    check("stem-placeholders", !questionPackage.stem.includes("{"), "Stem must not contain unresolved placeholders."),
    check("visible-fields", requiredVisibleFields(p.canonicalProblemId).every((field) => questionPackage.stem.includes(String(values(p)[field]))), "Stem must display all required givens."),
    check("explanation-answer", questionPackage.explanation.lines.join("\n").includes(String(questionPackage.answer)), "Explanation must include answer."),
    check("graph-answer", questionPackage.reasoningGraph.nodes.find((node) => node.id === questionPackage.reasoningGraph.answerNodeId)?.outputs.answer === questionPackage.answer, "Graph answer must match final answer."),
    ...cpSpecificChecks(questionPackage),
  ];
  return result(checks);
}

function cpSpecificChecks(questionPackage: NsPrm001QuestionPackage) {
  const p = questionPackage.parameters;
  const answer = questionPackage.answer;
  switch (p.canonicalProblemId) {
    case NS_PRM_001_CP_001:
      return [
        check("cp001-number-not-one", p.number !== 1, "CP-001 must reject number = 1."),
        check("cp001-answer", answer === (isPrime(required(p.number, "number")) ? "Prime" : "Composite"), "CP-001 answer must classify prime/composite correctly."),
      ];
    case NS_PRM_001_CP_002: {
      const primes = primesBetween(required(p.lowerBound, "lowerBound"), required(p.upperBound, "upperBound"));
      return [check("cp002-count", answer === primes.length, "CP-002 answer must count primes in range.")];
    }
    case NS_PRM_001_CP_003: {
      const primes = primesBetween(required(p.lowerBound, "lowerBound"), required(p.upperBound, "upperBound"));
      return [
        check("cp003-nonempty", primes.length > 0, "CP-003 range must contain at least one prime."),
        check("cp003-smallest", answer === primes[0], "CP-003 answer must be smallest prime in range."),
      ];
    }
    case NS_PRM_001_CP_004: {
      const primes = primesBetween(required(p.lowerBound, "lowerBound"), required(p.upperBound, "upperBound"));
      return [
        check("cp004-nonempty", primes.length > 0, "CP-004 range must contain at least one prime."),
        check("cp004-greatest", answer === primes[primes.length - 1], "CP-004 answer must be greatest prime in range."),
      ];
    }
    case NS_PRM_001_CP_005: {
      const primes = primesBetween(required(p.lowerBound, "lowerBound"), required(p.upperBound, "upperBound"));
      return [check("cp005-sum", answer === primes.reduce((total, value) => total + value, 0), "CP-005 answer must sum primes in range.")];
    }
    case NS_PRM_001_CP_006:
      return [
        check("cp006-number-not-one", p.number !== 1, "CP-006 must reject number = 1."),
        check("cp006-next", typeof answer === "number" && answer > required(p.number, "number") && isPrime(answer), "CP-006 answer must be a prime greater than number."),
      ];
    case NS_PRM_001_CP_007:
      return [
        check("cp007-number-not-one", p.number !== 1, "CP-007 must reject number = 1."),
        check("cp007-minimum", required(p.number, "number") >= 3, "CP-007 requires number >= 3."),
        check("cp007-previous", typeof answer === "number" && answer < required(p.number, "number") && isPrime(answer), "CP-007 answer must be a prime smaller than number."),
      ];
    case NS_PRM_001_CP_008:
      return [check("cp008-position", answer === nthPrime(required(p.position, "position")), "CP-008 answer must be nth prime.")];
  }
}

function values(parameters: NsPrm001QuestionPackage["parameters"]) {
  return {
    number: parameters.number,
    lowerBound: parameters.lowerBound,
    upperBound: parameters.upperBound,
    position: parameters.position,
  };
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing NS-PRM-001 parameter: ${name}`);
  return value;
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function result(checks: ReturnType<typeof check>[]) {
  return { valid: checks.every((item) => item.passed), checks };
}
