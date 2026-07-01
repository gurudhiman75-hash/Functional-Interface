import fs from "fs";
import path from "path";

function buildPct001() {
  const routerPath = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation-renderer.ts";
  const snippet = fs.readFileSync("artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/_router_snippet.txt", "utf8");
  const baseCode = `import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import type { Pct001Explanation, Pct001Parameters, Pct001ReasoningGraph, Pct001SolverResult } from "../types";

import { PercentOfRenderer } from "./renderers/percent-of-renderer";
${snippet}

export function resolvePct001SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
  const map: Record<string, string> = {};
  if (!semanticContext || !semanticContext.entities) return map;
  const entities = semanticContext.entities;
  if (taskKind === "percentOf" || taskKind === "directRelation") {
    map["entityA"] = entities.subject?.[language] || "value";
  }
  return map;
}

export function renderPct001Explanation(parameters: Pct001Parameters, solver: Pct001SolverResult, _graph: Pct001ReasoningGraph): Pct001Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.evidence,
    entities: resolvePct001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
${snippet.substring(snippet.indexOf('case '))}
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
  // Need to fix duplicate PercentOfRenderer
  const fixedCode = baseCode
    .replace('import { PercentOfRenderer } from "./renderers/percent-of-renderer";\nimport { PercentOfRenderer }', 'import { PercentOfRenderer }')
    .replace(/case "percentOf":[\s\S]*?break;/g, 'case "percentOf":\n      renderer = new PercentOfRenderer();\n      break;');

  fs.writeFileSync(routerPath, fixedCode, "utf8");
}

function buildPct002() {
  const routerPath = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/explanation-renderer.ts";
  const snippet = fs.readFileSync("artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/_router_snippet.txt", "utf8");
  const baseCode = `import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import type { Pct002Explanation, Pct002Parameters, Pct002ReasoningGraph, Pct002SolverResult } from "../types";

import { InclusionExclusionRenderer } from "./renderers/inclusion-exclusion-renderer";
import { WrongMultiplierRenderer } from "./renderers/wrong-multiplier-renderer";
${snippet}

export function resolvePct002SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
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
}

export function renderPct002Explanation(parameters: Pct002Parameters, solver: Pct002SolverResult, _graph: Pct002ReasoningGraph): Pct002Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: { ...solver.evidence, atLeastOne: solver.evidence.totalWithNeither ? 100 - Number(parameters.variables.neitherPercentage) : 0 },
    entities: resolvePct002SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
${snippet.substring(snippet.indexOf('case '))}
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
  const fixedCode = baseCode
    .replace('import { InclusionExclusionRenderer } from "./renderers/inclusion-exclusion-renderer";\nimport { InclusionExclusionRenderer }', 'import { InclusionExclusionRenderer }')
    .replace('import { WrongMultiplierRenderer } from "./renderers/wrong-multiplier-renderer";\nimport { WrongMultiplierRenderer }', 'import { WrongMultiplierRenderer }')
    .replace(/case "inclusionExclusion":[\s\S]*?break;/g, 'case "inclusionExclusion":\n      renderer = new InclusionExclusionRenderer();\n      break;')
    .replace(/case "wrongMultiplier":[\s\S]*?break;/g, 'case "wrongMultiplier":\n      renderer = new WrongMultiplierRenderer();\n      break;');

  fs.writeFileSync(routerPath, fixedCode, "utf8");
}

function buildRap001() {
  const routerPath = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/explanation-renderer.ts";
  const snippet = fs.readFileSync("artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/_router_snippet.txt", "utf8");
  const baseCode = `import { formatExplanationSteps, validateExplanationPipeline, type ExplanationEvidence, type ExplanationRenderer } from "../../../../../common/explanation-engine";
import type { Rap001Explanation, Rap001Parameters, Rap001ReasoningGraph, Rap001SolverResult } from "../types";

import { RatioNormalizationRenderer } from "./renderers/ratio-normalization-renderer";
${snippet}

export function resolveRap001SemanticEntities(taskKind: string, semanticContext: any, language: "en" | "hi" | "pa"): Record<string, string> {
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
}

export function renderRap001Explanation(parameters: Rap001Parameters, solver: Rap001SolverResult, _graph: Rap001ReasoningGraph): Rap001Explanation {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.workingValues,
    entities: resolveRap001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer,
  };

  let renderer: ExplanationRenderer;

  switch (parameters.taskKind) {
${snippet.substring(snippet.indexOf('case '))}
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
  const fixedCode = baseCode
    .replace('import { RatioNormalizationRenderer } from "./renderers/ratio-normalization-renderer";\nimport { RatioNormalizationRenderer }', 'import { RatioNormalizationRenderer }')
    .replace(/case "ratioNormalization":[\s\S]*?break;/g, 'case "ratioNormalization":\n      renderer = new RatioNormalizationRenderer();\n      break;');

  fs.writeFileSync(routerPath, fixedCode, "utf8");
}

buildPct001();
buildPct002();
buildRap001();

// delete generic-renderer files
const p1 = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/renderers/generic-renderer.ts";
if(fs.existsSync(p1)) fs.unlinkSync(p1);
const p2 = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/renderers/generic-renderer.ts";
if(fs.existsSync(p2)) fs.unlinkSync(p2);
const p3 = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/renderers/generic-renderer.ts";
if(fs.existsSync(p3)) fs.unlinkSync(p3);

console.log("Done router integration.");
