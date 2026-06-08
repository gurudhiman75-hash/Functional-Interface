import { getQuestionLanguageEntries, renderQuestionLanguage, requiredVisibleFields, validateNsPf001Libraries } from "./library";
import { exponentOfPrime, formatFactorizationAnswer, isPrime, primeFactorize, primePower } from "./math";
import {
  NS_PF_001_ARCHETYPE_ID,
  NS_PF_001_CP_001,
  NS_PF_001_CP_002,
  NS_PF_001_CP_003,
  NS_PF_001_CP_004,
  NS_PF_001_CP_005,
  NS_PF_001_CP_006,
  NS_PF_001_CP_007,
  type NsPf001QuestionPackage,
  type NsPf001ReasoningGraph,
  type NsPf001SolverResult,
  type NsPf001ValidationResult,
} from "./types";

export function validateNsPf001AnswerContract(solver: NsPf001SolverResult, reasoningGraph: NsPf001ReasoningGraph): NsPf001ValidationResult {
  const graphAnswer = reasoningGraph.nodes.find((node) => node.id === reasoningGraph.answerNodeId)?.outputs.answer;
  return result([
    check("graph-answer", graphAnswer === solver.answer, "Reasoning graph final answer must match solver answer."),
    check("solver-verification", Object.values(solver.verification).every(Boolean), "Solver verification flags must all pass."),
    check("graph-factorization-text", reasoningGraph.factorizationText === solver.factorizationText, "Graph must carry factorizationText."),
    check("graph-factorization-latex", reasoningGraph.factorizationLatex === solver.factorizationLatex, "Graph must carry factorizationLatex."),
  ]);
}

export function validateNsPf001QuestionPackage(questionPackage: NsPf001QuestionPackage): NsPf001ValidationResult {
  const p = questionPackage.parameters;
  const libraryValidation = validateNsPf001Libraries();
  const checks = [
    check("library-validation", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries are valid."),
    check("archetype-id", questionPackage.archetypeId === NS_PF_001_ARCHETYPE_ID, "Archetype ID must be NS-PF-001."),
    check("traceability-question-id", questionPackage.questionId === p.questionId && Boolean(questionPackage.questionId), "Question ID must be present and consistent."),
    check("traceability-cp-id", questionPackage.canonicalProblemId === p.canonicalProblemId, "CP ID must be present and consistent."),
    check("traceability-difficulty", Boolean(questionPackage.difficultyBand), "Difficulty band must be present."),
    check("traceability-factorization-text", questionPackage.traceability.factorizationText === questionPackage.factorizationText, "Traceability must include factorizationText."),
    check("traceability-factorization-latex", questionPackage.traceability.factorizationLatex === questionPackage.factorizationLatex, "Traceability must include factorizationLatex."),
    check("question-language-id", getQuestionLanguageEntries(p.canonicalProblemId).some((entry) => entry.id === questionPackage.questionLanguageId), "Question language ID must be approved."),
    check("stem-rendered", renderQuestionLanguage({ canonicalProblemId: p.canonicalProblemId, questionLanguageId: questionPackage.questionLanguageId, values: values(p) }) === questionPackage.stem, "Stem must render from approved question language."),
    check("stem-placeholders", !questionPackage.stem.includes("{"), "Stem must not contain unresolved placeholders."),
    check("visible-fields", requiredVisibleFields(p.canonicalProblemId).every((field) => questionPackage.stem.includes(String(values(p)[field]))), "Stem must display all required givens."),
    check("explanation-answer", questionPackage.explanation.lines.join("\n").includes(String(questionPackage.answer)), "Explanation must include answer."),
    check("explanation-factorization", questionPackage.explanation.lines.join("\n").includes(questionPackage.factorizationText), "Explanation must include factorization evidence."),
    check("explanation-factorization-latex", questionPackage.explanation.factorizationLatex === questionPackage.factorizationLatex, "Explanation must carry factorizationLatex."),
    check("graph-answer", questionPackage.reasoningGraph.nodes.find((node) => node.id === questionPackage.reasoningGraph.answerNodeId)?.outputs.answer === questionPackage.answer, "Graph answer must match final answer."),
    check("mathjax-output", questionPackage.factorizationLatex.includes("="), "MathJax factorization must be generated."),
    ...cpSpecificChecks(questionPackage),
  ];
  return result(checks);
}

function cpSpecificChecks(questionPackage: NsPf001QuestionPackage) {
  const p = questionPackage.parameters;
  const answer = questionPackage.answer;
  const factorization = primeFactorize(p.number);
  switch (p.canonicalProblemId) {
    case NS_PF_001_CP_001:
      return [check("cp001-factorization", answer === formatFactorizationAnswer(factorization), "CP-001 answer must be prime factorization.")];
    case NS_PF_001_CP_002:
      return [check("cp002-count", answer === factorization.totalPrimeFactorCount, "CP-002 answer must count prime factors with repetition.")];
    case NS_PF_001_CP_003:
      return [check("cp003-distinct-count", answer === factorization.distinctPrimeFactorCount, "CP-003 answer must count distinct prime factors.")];
    case NS_PF_001_CP_004:
      return [check("cp004-largest", answer === factorization.largestPrimeFactor, "CP-004 answer must be largest prime factor.")];
    case NS_PF_001_CP_005:
      return [check("cp005-smallest", answer === factorization.smallestPrimeFactor, "CP-005 answer must be smallest prime factor.")];
    case NS_PF_001_CP_006: {
      const prime = required(p.prime, "prime");
      const exponent = exponentOfPrime(factorization, prime);
      return [
        check("cp006-selected-prime", isPrime(prime) && exponent > 0, "CP-006 selected prime must divide number."),
        check("cp006-prime-power", answer === primePower(prime, exponent), "CP-006 answer must be highest prime power."),
        check("cp006-not-exponent", answer !== exponent || exponent === primePower(prime, exponent), "CP-006 answer must not collapse into exponent lookup."),
      ];
    }
    case NS_PF_001_CP_007: {
      const prime = required(p.prime, "prime");
      const exponent = exponentOfPrime(factorization, prime);
      return [
        check("cp007-selected-prime", isPrime(prime) && exponent > 0, "CP-007 selected prime must divide number."),
        check("cp007-exponent", answer === exponent, "CP-007 answer must be exponent."),
      ];
    }
  }
}

function values(parameters: NsPf001QuestionPackage["parameters"]) {
  return {
    number: parameters.number,
    prime: parameters.prime,
  };
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing NS-PF-001 parameter: ${name}`);
  return value;
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function result(checks: ReturnType<typeof check>[]) {
  return { valid: checks.every((item) => item.passed), checks };
}
