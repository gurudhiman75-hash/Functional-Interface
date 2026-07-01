const fs = require('fs');

function fixRouter(pkg, replaceCode) {
  const routerPath = `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/${pkg.includes('PCT') ? 'Percentage' : 'RatioAndProportion'}/${pkg}/explanation-renderer.ts`;
  const snippet = fs.readFileSync(`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/${pkg.includes('PCT') ? 'Percentage' : 'RatioAndProportion'}/${pkg}/_router_snippet.txt`, 'utf8');
  
  const imports = snippet.substring(0, snippet.indexOf('    case ')).trim();
  const cases = snippet.substring(snippet.indexOf('    case '));

  const evidenceCode = pkg === 'PCT-002' ? '{ ...solver.evidence, atLeastOne: solver.evidence.totalWithNeither ? 100 - Number(parameters.variables.neitherPercentage) : 0 }' : pkg === 'RAP-001' ? 'solver.workingValues' : 'solver.evidence';

  let baseCode = `import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import type { ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}Explanation, ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}Parameters, ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}ReasoningGraph, ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}SolverResult } from "../types";

${imports}

${replaceCode}

export function render${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}Explanation(parameters: ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}Parameters, solver: ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}SolverResult, _graph: ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}ReasoningGraph): ${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: ${evidenceCode},
    entities: resolve${pkg.replace('-', '').charAt(0).toUpperCase() + pkg.replace('-', '').slice(1).toLowerCase()}SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
${cases}
    default:
      throw new Error(\`Renderer missing for taskKind: \${parameters.taskKind}\`);
  }

  const validatedSteps = validateExplanationPipeline(evidence, renderer);
  return {
    explanationId: parameters.explanationId,
    lines: formatExplanationSteps(validatedSteps),
  };
}
`;
  
  if (pkg === 'PCT-001') {
    baseCode = baseCode.replace(/case "percentOf":\n\s*renderer = new PercentOfRenderer\(solver.mathJax\);/, 'case "percentOf":\n      renderer = new PercentOfRenderer();');
  } else if (pkg === 'PCT-002') {
    baseCode = baseCode.replace(/case "inclusionExclusion":\n\s*renderer = new InclusionExclusionRenderer\(solver.mathJax\);/, 'case "inclusionExclusion":\n      renderer = new InclusionExclusionRenderer();');
    baseCode = baseCode.replace(/case "wrongMultiplier":\n\s*renderer = new WrongMultiplierRenderer\(solver.mathJax\);/, 'case "wrongMultiplier":\n      renderer = new WrongMultiplierRenderer();');
  } else if (pkg === 'RAP-001') {
    baseCode = baseCode.replace(/case "ratioNormalization":\n\s*renderer = new RatioNormalizationRenderer\(solver.mathJax\);/, 'case "ratioNormalization":\n      renderer = new RatioNormalizationRenderer();');
  }
  
  fs.writeFileSync(routerPath, baseCode, 'utf8');
}

const pct001Replace = `export function resolvePct001SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;
  const entities = semanticContext.entities;
  if (taskKind === "percentOf" || taskKind === "directRelation") {
    map["entityA"] = entities.subject?.[language] || "value";
  }
  return map;
}`;

const pct002Replace = `export function resolvePct002SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;

  const entities = semanticContext.entities;
  
  if (taskKind === "inclusionExclusion" || taskKind === "tripleInclusionExclusion") {
    map["entityA"] = entities.subject1?.[language] || entities.group1?.[language] || "the first subject";
    map["entityB"] = entities.subject2?.[language] || entities.group2?.[language] || "the second subject";
  } else if (taskKind === "wrongMultiplier" || taskKind === "fractionalError") {
    map["target"] = entities.target?.[language] || "number";
  }
  return map;
}`;

const rap001Replace = `export function resolveRap001SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;

  const entities = semanticContext.entities;
  
  if (taskKind === "ages") {
    map["entityA"] = entities.person1?.[language] || "the first person";
    map["entityB"] = entities.person2?.[language] || "the second person";
  } else if (taskKind === "boysGirls") {
    map["entityA"] = entities.boys?.[language] || "boys";
    map["entityB"] = entities.girls?.[language] || "girls";
  }
  return map;
}`;

fixRouter('PCT-001', pct001Replace);
fixRouter('PCT-002', pct002Replace);
fixRouter('RAP-001', rap001Replace);

console.log('Fixed routers.');