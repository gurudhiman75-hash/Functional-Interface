import { PCT_002_ARCHETYPE_ID, PCT_002_CP_IDS, type Pct002Parameters, type Pct002QuestionPackage, type Pct002ValidationResult } from "./types";
import { isFiniteNumber } from "./math";
import { extractPlaceholders, getQuestionEntry, getTaskRegistryEntry, PCT_002_LIBRARY_REGISTRY } from "./library";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function placeholderSet(parameters: Pct002Parameters, language: "en" | "hi" | "pa") {
  return new Set(extractPlaceholders(getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, language).template));
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function answerTypeLooksValid(pkg: Pct002QuestionPackage) {
  const answer = pkg.answer;
  if (pkg.parameters.answerType === "PERCENT") return answer.endsWith("%");
  if (pkg.parameters.answerType === "RATIO") return /^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(answer);
  if (pkg.parameters.answerType === "FRACTION") return /^-?\d+\/\d+$/.test(answer);
  if (pkg.parameters.answerType === "COUNT") return /^-?\d+$/.test(answer);
  return answer.length > 0 && !answer.endsWith("%") && !answer.includes(":") && !answer.includes("/");
}

function hasBrokenUnicode(value: string) {
  return /[àÂ�]/.test(value);
}

export function validatePct002Parameters(parameters: Pct002Parameters): Pct002ValidationResult {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = placeholderSet(parameters, "hi");
  const paPlaceholders = placeholderSet(parameters, "pa");
  
  const semantic = parameters.semanticContext;
  const scenarioMatch = semantic ? PCT_002_LIBRARY_REGISTRY.semantic.scenarioMap[parameters.canonicalProblemId] === semantic.scenario : true;

  const checks = [
    check("archetype", parameters.archetypeId === PCT_002_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", PCT_002_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("questionLanguage", parameters.questionLanguageId.length > 0, "Question language ID must be present."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check("requiredVariablesRegistry", parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"), "Required variables must come from task registry."),
    check("placeholderCrossLanguage", sameSet(enPlaceholders, hiPlaceholders) && sameSet(enPlaceholders, paPlaceholders), "EN/HI/PA placeholders must match."),
    check("semanticScenario", scenarioMatch, "Scenario must match CP mapping."),
  ];

  if (semantic) {
    const entities = Object.values(semantic.entities);
    const ids = entities.map(e => e.id);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);
    checks.push(check("semanticDuplicates", !hasDuplicates, "Duplicate entities found in semantic context."));
    
    // Mixture safety
    if (semantic.scenario === "mixtures") {
      const pId = semantic.entities.primary?.id;
      const sId = semantic.entities.secondary?.id;
      const forbidden = PCT_002_LIBRARY_REGISTRY.semantic.compatibilityMap.forbidden_mixtures;
      const isForbidden = (forbidden[pId!] && forbidden[pId!].includes(sId)) || (forbidden[sId!] && forbidden[sId!].includes(pId));
      checks.push(check("illegalMixture", !isForbidden, `Illegal mixture: ${pId} and ${sId}`));
    }

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
    }
  }
  return { valid: checks.every((item) => item.passed), checks };
}

export function validatePct002QuestionPackage(pkg: Pct002QuestionPackage): Pct002ValidationResult {
  const parameterValidation = validatePct002Parameters(pkg.parameters);
  const checks = [
    ...parameterValidation.checks,
    check("stem", pkg.stem.length > 0 && !pkg.stem.includes("undefined") && !pkg.stem.includes("NaN"), "Stem must render."),
    check("answer", pkg.answer.length > 0 && !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Answer must render."),
    check("answerTypeFormat", answerTypeLooksValid(pkg), "Answer format must match declared answer type."),
    check("solverAnswerType", pkg.solver.answerType === pkg.parameters.answerType, "Solver answer type must match parameters."),
    check("graph", pkg.reasoningGraph.nodes.some((node) => node.id === "answer"), "Graph must contain answer node."),
    check("explanation", pkg.explanation.lines.length > 0, "Explanation must render."),
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
