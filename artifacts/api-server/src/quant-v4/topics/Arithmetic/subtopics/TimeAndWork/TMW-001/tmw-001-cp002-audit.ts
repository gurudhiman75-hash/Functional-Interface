import { strict as assert } from "node:assert";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { runTmwCp002Pipeline } from "./foundation/cp002-runtime";

function normalize(text: string): string {
  return text.toLowerCase()
    .replace(/\\\([\s\S]*?\\\)/g, "<math>")
    .replace(/\d+\s+\d+\/\d+/g, "<number>")
    .replace(/\d+\/\d+/g, "<number>")
    .replace(/\d+(?:\.\d+)?/g, "<number>")
    .replace(/operator|technician|machine|crew|clerk/g, "<agent>")
    .replace(/data-processing assignment|repair project|printing order|road-maintenance project|document-verification assignment/g, "<job>")
    .replace(/records|components|booklets|metres of road|applications/g, "<output>")
    .replace(/\s+/g, " ")
    .trim();
}

const exactStems = new Map<string, Set<string>>();
const normalizedStems = new Map<string, Set<string>>();
const exactExplanations = new Map<string, Set<string>>();
const bannedPhrases = ["now calculate", "calculate carefully", "use the formula", "simply put", "is required"];
let generated = 0;
let invalidPackages = 0;
let unresolvedPlaceholders = 0;
let malformedMathDelimiters = 0;
let rawFractionOutsideMathJax = 0;
let asciiFractionalTimes = 0;
let genericExplanationHits = 0;
let optionContractFailures = 0;

for (const entry of TMW_CP002_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const question = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed: `tmw-cp002-audit:${entry.qlId}:${index}` });
    generated += 1;
    if (!question.validation.valid) invalidPackages += 1;
    const learnerText = [question.stem, ...question.options, question.solution.answerText, question.explanation.opening, question.explanation.formula, ...question.explanation.steps, question.explanation.conclusion].join("\n");
    if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learnerText)) unresolvedPlaceholders += 1;
    if ((learnerText.match(/\\\(/g) ?? []).length !== (learnerText.match(/\\\)/g) ?? []).length) malformedMathDelimiters += 1;
    if (/\\frac/.test(learnerText.replace(/\\\([\s\S]*?\\\)/g, ""))) rawFractionOutsideMathJax += 1;
    if (/\b(?:\d+\s+)?\d+\/\d+\s+(?:minutes?|hours?|days?|shifts?)\b/i.test(learnerText)) asciiFractionalTimes += 1;
    const explanation = [question.explanation.opening, question.explanation.formula, ...question.explanation.steps, question.explanation.conclusion].join("\n");
    if (bannedPhrases.some((phrase) => explanation.toLowerCase().includes(phrase))) genericExplanationHits += 1;
    if (question.optionAudit.length !== 4 || question.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) optionContractFailures += 1;

    const exactOwners = exactStems.get(question.stem) ?? new Set<string>();
    exactOwners.add(entry.qlId);
    exactStems.set(question.stem, exactOwners);
    const normalized = normalize(question.stem);
    const normalizedOwners = normalizedStems.get(normalized) ?? new Set<string>();
    normalizedOwners.add(entry.qlId);
    normalizedStems.set(normalized, normalizedOwners);
    const explanationOwners = exactExplanations.get(explanation) ?? new Set<string>();
    explanationOwners.add(entry.qlId);
    exactExplanations.set(explanation, explanationOwners);
  }
}

const exactStemDuplicateGroups = [...exactStems.values()].filter((owners) => owners.size > 1);
const normalizedCrossQlCollisions = [...normalizedStems.values()].filter((owners) => owners.size > 1);
const exactExplanationDuplicateGroups = [...exactExplanations.values()].filter((owners) => owners.size > 1);

assert.equal(invalidPackages, 0);
assert.equal(unresolvedPlaceholders, 0);
assert.equal(malformedMathDelimiters, 0);
assert.equal(rawFractionOutsideMathJax, 0);
assert.equal(asciiFractionalTimes, 0);
assert.equal(genericExplanationHits, 0);
assert.equal(optionContractFailures, 0);
assert.equal(exactStemDuplicateGroups.length, 0);
assert.equal(normalizedCrossQlCollisions.length, 0);
assert.equal(exactExplanationDuplicateGroups.length, 0);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-002",
  qlCount: TMW_CP002_REGISTRY.length,
  seedsPerQl: 12,
  generated,
  invalidPackages,
  unresolvedPlaceholders,
  malformedMathDelimiters,
  rawFractionOutsideMathJax,
  asciiFractionalTimes,
  genericExplanationHits,
  optionContractFailures,
  exactStemDuplicateGroups: exactStemDuplicateGroups.length,
  normalizedCrossQlCollisions: normalizedCrossQlCollisions.length,
  exactExplanationDuplicateGroups: exactExplanationDuplicateGroups.length,
  status: "PASS",
}, null, 2));
