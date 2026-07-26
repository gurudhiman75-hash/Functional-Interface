import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";
import { divide, toLatex } from "./foundation/rational";

function normalize(value: string): string {
  return value.toLowerCase().replace(/\\\([^)]*\\\)/g, "<math>").replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g, "<n>").replace(/[^a-z<>]+/g, " ").trim();
}

const exactStemOwner = new Map<string, string>();
const normalizedStemOwner = new Map<string, string>();
const exactExplanationOwner = new Map<string, string>();
const contextPhrases = new Set<string>();
const contextActors = new Set<string>();
let audited = 0;
let invalid = 0;
let unresolved = 0;
let malformedMath = 0;
let unwrappedMath = 0;
let visibleRatioMismatches = 0;
let optionFailures = 0;
let genericExplanationHits = 0;
let controlCharacterHits = 0;
let assignmentWordHits = 0;

for (const entry of TMW_CP003_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const generated = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed: `tmw-cp003-audit:${entry.qlId}:${index}` });
    audited += 1;
    contextPhrases.add(generated.parameters.context.jobPhrase);
    contextActors.add(generated.parameters.context.agentNoun);
    if (!generated.validation.valid) invalid += 1;
    if (/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(generated.stem + generated.explanation.steps.join(" "))) unresolved += 1;
    const explanationText = [generated.explanation.opening, generated.explanation.formula, ...generated.explanation.steps, generated.explanation.conclusion].join(" ");
    if ((explanationText.match(/\\\(/g) ?? []).length !== (explanationText.match(/\\\)/g) ?? []).length) malformedMath += 1;
    if (
      !/^\\\(.+\\\)$/.test(generated.explanation.formula)
      || generated.explanation.steps.some((step) => !/^\\\(.+\\\)$/.test(step))
    ) unwrappedMath += 1;
    if (entry.solveMode === "findComparativeDurationFromDifferentWorkAndEfficiencies") {
      const { workA, workB } = generated.parameters;
      if (!workA || !workB) {
        visibleRatioMismatches += 1;
      } else {
        const reducedWorkRatio = divide(workA, workB);
        const expectedSubstitution = `\\frac{${Math.abs(reducedWorkRatio.numerator)}\\times${toLatex(generated.parameters.efficiencyB)}}{${reducedWorkRatio.denominator}\\times${toLatex(generated.parameters.efficiencyA)}}`;
        if (!generated.explanation.steps.some((step) => step.includes(expectedSubstitution))) visibleRatioMismatches += 1;
      }
    }
    if (generated.options.length !== 4 || new Set(generated.options).size !== 4 || generated.correctIndex < 0) optionFailures += 1;
    if (/now calculate carefully|use the formula|therefore we calculate/i.test(explanationText)) genericExplanationHits += 1;
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(generated.stem + explanationText)) controlCharacterHits += 1;
    assignmentWordHits += (generated.stem.match(/\bassignment\b/gi) ?? []).length;

    const exactOwner = exactStemOwner.get(generated.stem);
    if (exactOwner && exactOwner !== entry.qlId) throw new Error(`Exact cross-QL stem collision: ${exactOwner} / ${entry.qlId}`);
    exactStemOwner.set(generated.stem, entry.qlId);

    const normalized = normalize(generated.stem);
    const normalizedOwner = normalizedStemOwner.get(normalized);
    if (normalizedOwner && normalizedOwner !== entry.qlId) throw new Error(`Normalised cross-QL stem collision: ${normalizedOwner} / ${entry.qlId}: ${normalized}`);
    normalizedStemOwner.set(normalized, entry.qlId);

    const explanationOwner = exactExplanationOwner.get(explanationText);
    if (explanationOwner && explanationOwner !== entry.qlId) throw new Error(`Exact cross-QL explanation duplicate: ${explanationOwner} / ${entry.qlId}`);
    exactExplanationOwner.set(explanationText, entry.qlId);
  }
}

assert.equal(invalid, 0);
assert.equal(unresolved, 0);
assert.equal(malformedMath, 0);
assert.equal(unwrappedMath, 0);
assert.equal(visibleRatioMismatches, 0);
assert.equal(optionFailures, 0);
assert.equal(genericExplanationHits, 0);
assert.equal(controlCharacterHits, 0);
assert.equal(assignmentWordHits, 0);
assert.ok(contextPhrases.size >= 10, `Expected at least 10 distinct context phrases, found ${contextPhrases.size}`);
assert.ok(contextActors.size >= 10, `Expected at least 10 distinct context actors, found ${contextActors.size}`);

console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-003", qlCount: 23, seedsPerQl: 12, audited, invalid, unresolved, malformedMath, unwrappedMath, visibleRatioMismatches, optionFailures, genericExplanationHits, controlCharacterHits, assignmentWordHits, distinctContextPhrases: contextPhrases.size, distinctContextActors: contextActors.size, exactCrossQlStemCollisions: 0, normalizedCrossQlStemCollisions: 0, exactCrossQlExplanationDuplicates: 0, status: "PASS" }, null, 2));
