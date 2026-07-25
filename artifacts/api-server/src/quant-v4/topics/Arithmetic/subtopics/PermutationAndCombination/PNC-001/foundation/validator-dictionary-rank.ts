import { getPnc001ConstraintProfile, getPnc001QuestionEntry, getPnc001VariableRanges } from "./library";
import { sumExact } from "./math";
import type { Pnc001QuestionPackage, Pnc001ValidationCheck, Pnc001ValidationResult } from "./types";

function check(name: string, passed: boolean, message: string): Pnc001ValidationCheck {
  return { name, passed, message };
}
function sortedLetters(word: string): string { return [...word].sort().join(""); }

export function validatePnc001DictionaryRankQuestionPackage(pkg: Pnc001QuestionPackage): Pnc001ValidationResult {
  const checks: Pnc001ValidationCheck[] = [];
  const entry = getPnc001QuestionEntry(pkg.questionLanguageId);
  const ranges = getPnc001VariableRanges();
  const evidence = pkg.solver.evidence;
  const sourceWord = evidence.dictionarySourceWord ?? "";
  const targetWord = evidence.dictionaryTargetWord ?? "";
  const contributions = evidence.dictionaryRankContributions ?? [];
  const precedingCount = sumExact(contributions.map((item) => item.remainingArrangementCount), ranges.answerCeiling);
  const answer = pkg.solver.numericAnswer;

  checks.push(check("package-id", pkg.packageId === "PNC-001" && pkg.archetypeId === "PNC-001", "Package IDs must be PNC-001"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-005", "Dictionary-rank validator accepts CP-005 only"));
  checks.push(check("language", pkg.language === "en", "Runtime proof is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", String(entry.solveMode) === "findDictionaryRankOfWord" && String(pkg.solveMode) === "findDictionaryRankOfWord", "QL and runtime mode must be dictionary rank"));
  checks.push(check("registry-task-kind", entry.taskKind === "multisetPermutation", "Dictionary rank remains a multiset-permutation task"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc001ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("no-required-placeholders", entry.requiredVariables.length === 0 && Object.keys(pkg.parameters.renderVariables).length === 0, "Fixed-word rank QLs must not expose numeric placeholders"));
  checks.push(check("integer-values", Object.values(pkg.parameters.values).every((value) => Number.isInteger(value) && value >= 0), "Generated values must be non-negative integers"));
  checks.push(check("dictionary-operation", evidence.operation === "DICTIONARY_RANK", "Solver must expose dictionary-rank operation"));
  checks.push(check("word-domain", sourceWord.length > 0 && targetWord.length === sourceWord.length, "Source and target words must be non-empty and equal in length"));
  checks.push(check("anagram-integrity", sortedLetters(sourceWord) === sortedLetters(targetWord), "Target must be an arrangement of the source letters"));
  checks.push(check("sorted-letter-evidence", evidence.dictionarySortedLetters === sortedLetters(sourceWord), "Sorted-letter evidence must match source multiset"));
  checks.push(check("rank-contribution-sum", precedingCount + 1 === answer, "Rank must equal one plus all earlier lexicographic blocks"));
  checks.push(check("rank-evidence", evidence.dictionaryPrecedingCount === precedingCount && evidence.dictionaryRank === answer, "Rank evidence must agree with solver answer"));
  checks.push(check("positive-answer", Number.isInteger(answer) && answer >= ranges.generation.minimumAnswer, "Answer must be a positive integer"));
  checks.push(check("answer-ceiling", answer <= ranges.answerCeiling, "Answer must remain under ceiling"));
  checks.push(check("answer-string", pkg.answer === String(answer) && pkg.solver.answer === pkg.answer, "Displayed answer must match solver"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === answer, "Independent lexicographic enumeration must agree"));
  checks.push(check("rendered-stem", !/\{[A-Za-z0-9_]+\}/.test(pkg.stem), "Stem must resolve placeholders"));
  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options required"));
  checks.push(check("unique-options", new Set(pkg.options).size === 4, "Options must be unique"));
  checks.push(check("correct-option", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to answer"));
  checks.push(check("single-correct-option", pkg.options.filter((option) => option === pkg.answer).length === 1, "Answer must appear once"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z0-9_]+\}/.test(explanationText), "Explanation must resolve placeholders"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(pkg.solver.equation), "Reasoning must include solver equation"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Audit-stage package must remain unpublished"));

  return { valid: checks.every((item) => item.passed), checks };
}