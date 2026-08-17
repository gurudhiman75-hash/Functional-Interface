import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";

function normalizeStem(stem: string, actor: string, peerActor: string | undefined, object: string): string {
  let normalized = stem.toLowerCase();
  for (const value of [actor, peerActor, object]) if (value) normalized = normalized.replaceAll(value.toLowerCase(), "<context>");
  return normalized
    .replace(/\d+\s+\d+\/\d+/g, "<number>")
    .replace(/\d+\/\d+/g, "<number>")
    .replace(/\d+(?:\.\d+)?/g, "<number>")
    .replace(/\s+/g, " ")
    .trim();
}

const exactStems = new Map<string, string[]>();
const normalizedPatterns = new Map<string, Set<string>>();
const exactExplanations = new Map<string, string[]>();
const bannedPhrases = ["now calculate", "calculate carefully", "use the formula", "simply put"];
let generated = 0;
let unresolvedPlaceholders = 0;
let malformedMathDelimiters = 0;
let genericExplanationHits = 0;
let invalidPackages = 0;
let optionContractFailures = 0;

for (const entry of TMW_CP001_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp001-audit:${entry.qlId}:${index}`;
    const question = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed });
    generated += 1;
    if (!question.validation.valid) invalidPackages += 1;
    if (/\{[^}]+\}|undefined|null/.test(question.stem)) unresolvedPlaceholders += 1;
    const explanationText = [question.explanation.opening, question.explanation.formula, ...question.explanation.steps, question.explanation.conclusion].join("\n");
    if ((explanationText.match(/\\\(/g) ?? []).length !== (explanationText.match(/\\\)/g) ?? []).length) malformedMathDelimiters += 1;
    if (bannedPhrases.some((phrase) => explanationText.toLowerCase().includes(phrase))) genericExplanationHits += 1;
    if (question.optionAudit.length !== 4 || question.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) optionContractFailures += 1;

    const exactStemOwners = exactStems.get(question.stem) ?? [];
    exactStemOwners.push(entry.qlId);
    exactStems.set(question.stem, exactStemOwners);
    const normalized = normalizeStem(question.stem, question.parameters.context.actor, question.parameters.context.peerActor, question.parameters.context.object);
    const qlOwners = normalizedPatterns.get(normalized) ?? new Set<string>();
    qlOwners.add(entry.qlId);
    normalizedPatterns.set(normalized, qlOwners);
    const exactExplanationOwners = exactExplanations.get(explanationText) ?? [];
    exactExplanationOwners.push(entry.qlId);
    exactExplanations.set(explanationText, exactExplanationOwners);
  }
}

const exactStemDuplicateGroups = [...exactStems.values()].filter((owners) => new Set(owners).size > 1);
const crossQlNormalizedCollisions = [...normalizedPatterns.entries()].filter(([, owners]) => owners.size > 1);
const exactExplanationDuplicateGroups = [...exactExplanations.values()].filter((owners) => new Set(owners).size > 1);
assert.equal(invalidPackages, 0);
assert.equal(unresolvedPlaceholders, 0);
assert.equal(malformedMathDelimiters, 0);
assert.equal(genericExplanationHits, 0);
assert.equal(optionContractFailures, 0);
assert.equal(exactStemDuplicateGroups.length, 0);
assert.equal(crossQlNormalizedCollisions.length, 0);
assert.equal(exactExplanationDuplicateGroups.length, 0);

console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-001", qlCount: TMW_CP001_REGISTRY.length, seedsPerQl: 12, generated, invalidPackages, unresolvedPlaceholders, malformedMathDelimiters, genericExplanationHits, optionContractFailures, exactStemDuplicateGroups: exactStemDuplicateGroups.length, crossQlNormalizedCollisions: crossQlNormalizedCollisions.length, exactExplanationDuplicateGroups: exactExplanationDuplicateGroups.length, status: "PASS" }, null, 2));
