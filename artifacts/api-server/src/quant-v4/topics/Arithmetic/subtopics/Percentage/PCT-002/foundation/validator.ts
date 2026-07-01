import {
  PCT_002_ARCHETYPE_ID,
  PCT_002_CP_IDS,
  type Pct002Parameters,
  type Pct002Language,
  type Pct002QuestionPackage,
  type Pct002ValidationResult,
} from "./types";
import { extractPlaceholders, getCommonQuestionLanguageIds, getQuestionEntry, getQuestionLanguageIds, getTaskRegistryEntry, validatePct002Libraries } from "./library";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function placeholderSet(parameters: Pct002Parameters, language: Pct002Language) {
  return new Set(extractPlaceholders(getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, language).template));
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function isAlternatingV21(lines: readonly string[]) {
  if (lines.length < 6 || lines.length % 2 !== 0) return false;
  for (let index = 0; index < lines.length; index += 2) {
    const statement = lines[index] ?? "";
    const consequence = lines[index + 1] ?? "";
    if (!statement.trim() || !consequence.includes("\\Rightarrow")) return false;
  }
  return true;
}

const FORBIDDEN_EXPLANATION = /formula|let x|substitut|apply the formula|notice that|therefore, the answer is obtained|shortcut|\bAI\b/i;

export function validatePct002Parameters(parameters: Pct002Parameters): Pct002ValidationResult {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const isSharedQuestionLanguage = getCommonQuestionLanguageIds(parameters.canonicalProblemId).includes(parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = isSharedQuestionLanguage ? placeholderSet(parameters, "hi") : null;
  const paPlaceholders = isSharedQuestionLanguage ? placeholderSet(parameters, "pa") : null;

  const checks = [
    check("archetype", parameters.archetypeId === PCT_002_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", PCT_002_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("questionLanguage", parameters.questionLanguageId.length > 0, "Question language ID must be present."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check(
      "requiredVariablesRegistry",
      parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"),
      "Required variables must come from task registry.",
    ),
    check(
      "placeholderCrossLanguage",
      !isSharedQuestionLanguage || (sameSet(enPlaceholders, hiPlaceholders!) && sameSet(enPlaceholders, paPlaceholders!)),
      "EN/HI/PA placeholders must match for shared question-language IDs.",
    ),
    check(
      "questionLanguageRegistered",
      getQuestionLanguageIds(parameters.canonicalProblemId, parameters.language).includes(parameters.questionLanguageId),
      "Question language must be available for the package language.",
    ),
  ];

  for (const variable of registryEntry.requiredVariables) {
    checks.push(check(`requiredVariable:${variable}`, Object.hasOwn(parameters.variables, variable), `${variable} must be generated.`));
  }

  return { valid: checks.every((item) => item.passed), checks };
}

export function validatePct002QuestionPackage(pkg: Pct002QuestionPackage): Pct002ValidationResult {
  const parameterValidation = validatePct002Parameters(pkg.parameters);
  const checks = [
    ...parameterValidation.checks,
    check("libraryValidation", validatePct002Libraries().valid, "Libraries must be internally consistent."),
    check("stem", pkg.stem.length > 0 && !pkg.stem.includes("undefined"), "Stem must render."),
    check("answer", pkg.answer.length > 0 && !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Answer must render."),
    check("graphAnswer", pkg.reasoningGraph.nodes.some((node) => node.id === "answer"), "Graph must contain answer node."),
    check("graphAnswerType", pkg.reasoningGraph.nodes.some((node) => node.id === "answerType"), "Graph must contain answer type node."),
    check("explanation", pkg.explanation.lines.length > 0, "Explanation must render."),
    check("explanationV21", isAlternatingV21(pkg.explanation.lines), "Explanation must alternate statement and Rightarrow consequence lines."),
    check("noForbiddenExplanation", !FORBIDDEN_EXPLANATION.test(pkg.explanation.lines.join("\n")), "Explanation must avoid forbidden filler."),
    check("traceability", pkg.traceability.answer === pkg.answer, "Traceability answer must match."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}
