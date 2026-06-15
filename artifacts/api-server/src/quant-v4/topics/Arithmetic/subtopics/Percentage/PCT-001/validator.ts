import { PCT_001_ARCHETYPE_ID, PCT_001_CP_IDS, type Pct001Parameters, type Pct001QuestionPackage, type Pct001ValidationResult } from "./types";
import { isFiniteNumber } from "./math";
import { extractPlaceholders, getQuestionEntry, getTaskRegistryEntry } from "./library";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function placeholderSet(parameters: Pct001Parameters, language: "en" | "hi" | "pa") {
  return new Set(extractPlaceholders(getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, language).template));
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function answerTypeLooksValid(pkg: Pct001QuestionPackage) {
  const answer = pkg.answer;
  if (pkg.parameters.answerType === "PERCENT") return answer.endsWith("%");
  if (pkg.parameters.answerType === "RATIO") return /^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(answer);
  if (pkg.parameters.answerType === "FRACTION") return /^-?\d+\/\d+$/.test(answer);
  if (pkg.parameters.answerType === "COUNT") return /^-?\d+$/.test(answer);
  return answer.length > 0 && !answer.endsWith("%") && !answer.includes(":") && !answer.includes("/");
}

export function validatePct001Parameters(parameters: Pct001Parameters): Pct001ValidationResult {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = placeholderSet(parameters, "hi");
  const paPlaceholders = placeholderSet(parameters, "pa");
  const checks = [
    check("archetype", parameters.archetypeId === PCT_001_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", PCT_001_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("questionLanguage", parameters.questionLanguageId.length > 0, "Question language ID must be present."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check("requiredVariablesRegistry", parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"), "Required variables must come from task registry."),
    check("placeholderCrossLanguage", sameSet(enPlaceholders, hiPlaceholders) && sameSet(enPlaceholders, paPlaceholders), "EN/HI/PA placeholders must match."),
  ];
  for (const variable of registryEntry.requiredVariables) {
    checks.push(check(`requiredVariable:${variable}`, Object.hasOwn(parameters.variables, variable), `${variable} must be generated.`));
    checks.push(check(`placeholder:${variable}`, enPlaceholders.has(variable) && hiPlaceholders.has(variable) && paPlaceholders.has(variable), `${variable} must appear in every language template.`));
  }
  for (const variable of Object.keys(parameters.variables)) {
    checks.push(check(`declaredVariable:${variable}`, registryEntry.requiredVariables.includes(variable), `${variable} must be declared in task registry.`));
  }
  for (const [key, value] of Object.entries(parameters.variables)) {
    if (typeof value === "number") {
      checks.push(check(`finite:${key}`, isFiniteNumber(value), `${key} must be finite.`));
      if (key.toLowerCase().includes("rate") || key === "percentageRate") {
        checks.push(check(`rate:${key}`, value > 0 && value < 100, `${key} must be between 0 and 100.`));
      }
      if (key.toLowerCase().includes("value") || key.toLowerCase().includes("population") || key.toLowerCase().includes("marks") || key.toLowerCase().includes("mixture") || key.toLowerCase().includes("quantity") || key.toLowerCase().includes("weight")) {
        checks.push(check(`positive:${key}`, value > 0, `${key} must be positive.`));
      }
    }
  }
  return { valid: checks.every((item) => item.passed), checks };
}

export function validatePct001QuestionPackage(pkg: Pct001QuestionPackage): Pct001ValidationResult {
  const parameterValidation = validatePct001Parameters(pkg.parameters);
  const checks = [
    ...parameterValidation.checks,
    check("stem", pkg.stem.length > 0 && !pkg.stem.includes("undefined") && !pkg.stem.includes("NaN"), "Stem must render."),
    check("answer", pkg.answer.length > 0 && !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Answer must render."),
    check("answerTypeFormat", answerTypeLooksValid(pkg), "Answer format must match declared answer type."),
    check("solverAnswerType", pkg.solver.answerType === pkg.parameters.answerType, "Solver answer type must match parameters."),
    check("graph", pkg.reasoningGraph.nodes.some((node) => node.id === "answer"), "Graph must contain answer node."),
    check("graphAnswerType", pkg.reasoningGraph.nodes.some((node) => node.id === "answerType" && node.value === pkg.parameters.answerType), "Graph must contain answer type node."),
    check("explanation", pkg.explanation.lines.length > 0, "Explanation must render."),
    check("traceability", pkg.traceability.answer === pkg.answer, "Traceability answer must match."),
    check("mathJax", Object.values(pkg.mathJax).every((value) => value.length > 0), "MathJax evidence must be populated."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}
