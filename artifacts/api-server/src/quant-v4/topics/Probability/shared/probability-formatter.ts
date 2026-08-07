import type { GeneratedParameters, ProbabilityQuestionLanguageEntry, SolvedProbability } from "./types";
import { rational, rationalText } from "./rational";
function scalar(value: unknown): string { if (Array.isArray(value)) return value.join(", "); if (value && typeof value === "object") return JSON.stringify(value); return String(value ?? ""); }
export function buildRenderContext(parameters: GeneratedParameters, solved: SolvedProbability): Record<string, string> {
  const context: Record<string,string> = Object.fromEntries(Object.entries(parameters).map(([key,value])=>[key,scalar(value)]));
  context.answer = solved.exactDisplay;
  if (solved.evidence.totalOutcomeCount !== undefined) context.totalOutcomes = solved.evidence.totalOutcomeCount.toString();
  if (solved.evidence.favourableOutcomeCount !== undefined) context.favourableOutcomes = solved.evidence.favourableOutcomeCount.toString();
  if (solved.evidence.totalOutcomeCount !== undefined && solved.evidence.favourableOutcomeCount !== undefined) context.probability = rationalText(rational(solved.evidence.favourableOutcomeCount, solved.evidence.totalOutcomeCount));
  if (typeof parameters.probabilityNumerator === "number" && typeof parameters.probabilityDenominator === "number") context.probability = rationalText(rational(parameters.probabilityNumerator,parameters.probabilityDenominator));
  if (typeof parameters.givenNumerator === "number" && typeof parameters.givenDenominator === "number") context.givenProbability = rationalText(rational(parameters.givenNumerator,parameters.givenDenominator));
  if (typeof parameters.red === "number" && typeof parameters.blue === "number") context.urnTotal = String(parameters.red+parameters.blue);
  if (typeof parameters.men === "number" && typeof parameters.women === "number") context.population = String(parameters.men+parameters.women);
  if (typeof parameters.aCount === "number" && typeof parameters.total === "number") context.pA = rationalText(rational(parameters.aCount,parameters.total));
  if (typeof parameters.bCount === "number" && typeof parameters.total === "number") context.pB = rationalText(rational(parameters.bCount,parameters.total));
  if (typeof parameters.overlap === "number" && typeof parameters.total === "number") { context.pIntersection = rationalText(rational(parameters.overlap,parameters.total)); context.pUnion = rationalText(rational(Number(parameters.aCount) + Number(parameters.bCount) - Number(parameters.overlap), parameters.total)); }
  if (typeof parameters.aNumerator === "number") context.pA = rationalText(rational(parameters.aNumerator,parameters.aDenominator as number));
  if (typeof parameters.bNumerator === "number") context.pB = rationalText(rational(parameters.bNumerator,parameters.bDenominator as number));
  return context;
}
export function renderQuestionStem(language: ProbabilityQuestionLanguageEntry, context: Record<string,string>): string {
  const rendered = language.stemTemplate.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => { if (!(key in context)) throw new Error(`Unresolved stem placeholder {${key}} in ${language.qlId}`); return context[key]!; });
  if (/\{[^}]+\}/.test(rendered)) throw new Error(`Unresolved placeholder in ${language.qlId}`); return rendered.replace(/\s+/g," ").trim();
}
