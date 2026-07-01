import { PCT_001_ARCHETYPE_ID, PCT_001_CP_IDS, type Pct001Parameters, type Pct001QuestionPackage, type Pct001ValidationResult } from "./types";
import { isFiniteNumber } from "./math";
import { extractPlaceholders, getExplanationSteps, getExplanationVariantCount, getQuestionEntry, getTaskRegistryEntry, PCT_001_LIBRARY_REGISTRY } from "./library";

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
  let answer = pkg.answer;
  if (answer.startsWith("$$") && answer.endsWith("$$")) {
    answer = answer.slice(2, -2).trim();
  }
  if (pkg.parameters.answerType === "FRACTION") {
    return /^-?\d+\/\d+$/.test(answer) || /^\\frac\{-?\d+\}\{\d+\}$/.test(answer);
  }
  if (pkg.parameters.answerType === "PERCENT") {
    return answer.endsWith("%") || answer.endsWith("\\%");
  }
  if (pkg.parameters.answerType === "RATIO") {
    const normalized = answer.replace(/\s+/g, "");
    return /^\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)+$/.test(normalized);
  }
  if (pkg.parameters.answerType === "COUNT") {
    return /^-?\d+$/.test(answer);
  }
  return answer.length > 0 && !answer.endsWith("%") && !answer.includes(":") && !answer.includes("/");
}

const TEACHER_FORBIDDEN = /our objective|standard rule|plugging in|substitut(?:ing|e) the (?:parameters|values)|calculating the final|calculation gives|observe carefully|observe the given relation|keep the base quantity clear|write the working|target value for this problem|appropriate formula|mathematical relationship|computed result|useful starting point|working relation|this determines|combining aligned ratios|on simplification|completing the arithmetic|numerical result|key relation|observe that|notice that|using the above|required expression becomes/i;

function hasBrokenUnicode(value: string) {
  return /[àÂ�]/.test(value);
}

export function validatePct001Parameters(parameters: Pct001Parameters): Pct001ValidationResult {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = placeholderSet(parameters, "hi");
  const paPlaceholders = placeholderSet(parameters, "pa");
  
  const semantic = parameters.semanticContext;
  const scenarioMatch = semantic ? PCT_001_LIBRARY_REGISTRY.semantic.scenarioMap[parameters.canonicalProblemId] === semantic.scenario : true;

  const checks = [
    check("archetype", parameters.archetypeId === PCT_001_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", PCT_001_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("questionLanguage", parameters.questionLanguageId.length > 0, "Question language ID must be present."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check("requiredVariablesRegistry", parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"), "Required variables must come from task registry."),
    check("placeholderCrossLanguage", sameSet(enPlaceholders, hiPlaceholders) && sameSet(enPlaceholders, paPlaceholders), "EN/HI/PA placeholders must match."),
    check("semanticScenario", scenarioMatch, "Scenario must match CP mapping."),
  ];
  try {
    const explanationSteps = getExplanationSteps(parameters.canonicalProblemId, parameters.taskKind, parameters.language);
    checks.push(check("taskExplanationFamily", explanationSteps.length > 0, "TaskKind-specific explanation family must exist."));
    checks.push(check("explanationVariantCount", getExplanationVariantCount(parameters.canonicalProblemId, parameters.taskKind, parameters.language) > 1, "TaskKind explanation must provide multiple variants."));
  } catch {
    checks.push(check("taskExplanationFamily", false, "TaskKind-specific explanation family must exist."));
    checks.push(check("explanationVariantCount", false, "TaskKind explanation must provide multiple variants."));
  }

  if (semantic) {
    const entities = Object.values(semantic.entities);
    const ids = entities.map(e => e.id);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);
    checks.push(check("semanticDuplicates", !hasDuplicates, "Duplicate entities found in semantic context."));
    
    for (const entity of entities) {
      const hasTranslation = entity.en && entity.hi && entity.pa;
      checks.push(check(`semanticTranslation:${entity.id}`, !!hasTranslation, `Missing translation for ${entity.id}`));
       const hiLeak = /[a-zA-Z]/.test(entity.hi);
      const paLeak = /[a-zA-Z]/.test(entity.pa);
      checks.push(check(`semanticLeakage:${entity.id}`, !hiLeak && !paLeak, `Translation leakage in ${entity.id}`));
      checks.push(check(`semanticUnicode:${entity.id}`, !hasBrokenUnicode(entity.hi) && !hasBrokenUnicode(entity.pa), `Broken Unicode in ${entity.id}`));
    }
  }

  for (const variable of registryEntry.requiredVariables) {
    checks.push(check(`requiredVariable:${variable}`, Object.hasOwn(parameters.variables, variable), `${variable} must be generated.`));
    checks.push(check(`placeholder:${variable}`, enPlaceholders.has(variable) && hiPlaceholders.has(variable) && paPlaceholders.has(variable), `${variable} must appear in every language template.`));
  }
  for (const variable of Object.keys(parameters.variables)) {
    checks.push(check(`declaredVariable:${variable}`, registryEntry.requiredVariables.includes(variable) || variable.startsWith("entity"), `${variable} must be declared in task registry or be a semantic entity.`));
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
    check("explanationMinimumSteps", pkg.explanation.lines.length >= 4, "Explanation must contain at least four teacher-style steps."),
    check("teacherLanguage", !TEACHER_FORBIDDEN.test(pkg.explanation.lines.join("\n")), "Explanation must not contain renderer meta-language."),
    check("arithmeticExposure", pkg.explanation.lines.filter((line) => line.includes("\\Rightarrow")).length >= 3, "Explanation must expose at least three arithmetic lines."),
    check("noTaskKindLeak", !pkg.explanation.lines.join("\n").includes(pkg.parameters.taskKind), "TaskKind must never appear in the explanation."),
    check("noVariableLeak", !Object.keys(pkg.parameters.variables).filter((name) => name.length >= 6).some((name) => pkg.explanation.lines.join("\n").includes(name)), "Internal variable names must never appear in the explanation."),
    check("noGenericExplanation", !/generic|fallback|default explanation|AI explanation|apply the formula|use the formula/i.test(pkg.explanation.lines.join("\n")), "Generic explanation path must not be used."),
    check("traceability", pkg.traceability.answer === pkg.answer, "Traceability answer must match."),
    check("traceScenarioId", typeof pkg.traceability.scenarioId === "string", "Traceability must include scenarioId."),
    check("traceSemanticDomain", typeof pkg.traceability.semanticDomain === "string", "Traceability must include semanticDomain."),
    check("traceEntityIds", typeof pkg.traceability.entityIds === "object" && pkg.traceability.entityIds !== null, "Traceability must include entityIds."),
    check("traceFrequencyMetadata", typeof pkg.traceability.frequencyMetadata === "object" && pkg.traceability.frequencyMetadata !== null, "Traceability must include frequencyMetadata."),
    check("traceGrammarMetadata", typeof pkg.traceability.grammarMetadata === "object" && pkg.traceability.grammarMetadata !== null, "Traceability must include grammarMetadata."),
    check("mathJax", Object.values(pkg.mathJax).every((value) => value.length > 0), "MathJax evidence must be populated."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}
