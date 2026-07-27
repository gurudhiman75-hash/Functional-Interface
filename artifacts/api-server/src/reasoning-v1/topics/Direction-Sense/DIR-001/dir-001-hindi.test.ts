import assert from "node:assert/strict";
import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
import { generateDirectionQuestionHindi } from "./localization";

const positions = [0, 0, 0, 0];
const stems = new Map<string, Set<string>>();
const explanations = new Map<string, Set<string>>();
const forbiddenEnglish = /\b(?:North|South|East|West|metres?|turns?|walks?|walking|final position|starting point|Which|What|Who|Therefore|Statement|Morning|Evening|Noon|shadow|sun)\b/i;
const internalLeak = /DIR-(?:QL|CP)-\d+|\bundefined\b|\bnull\b/;

assert.equal(DIR_001_QLS.length, 44);
assert.deepEqual(
  DIR_001_QLS.map((ql) => ql.qlId),
  Array.from({ length: 44 }, (_, index) => `DIR-QL-${String(index + 1).padStart(3, "0")}`),
);

for (const ql of DIR_001_QLS) {
  stems.set(ql.qlId, new Set());
  explanations.set(ql.qlId, new Set());
  for (let seed = 0; seed < 40; seed += 1) {
    const english = generateDirectionQuestion(ql.qlId, seed) as any;
    const hindi = generateDirectionQuestionHindi(ql.qlId, seed);
    assert.deepEqual(hindi, generateDirectionQuestionHindi(ql.qlId, seed));
    assert.equal(hindi.locale, "hi-IN");
    assert.equal(hindi.qlId, english.qlId);
    assert.equal(hindi.checkpointId, english.checkpointId);
    assert.equal(hindi.ruleId, english.ruleId);
    assert.equal(hindi.seed, english.seed);
    assert.equal(hindi.difficulty, english.difficulty);
    assert.equal(hindi.correctIndex, english.correctIndex);
    assert.deepEqual(hindi.correctAnswer, english.correctAnswer);
    assert.deepEqual(hindi.structuredPrompt, english.structuredPrompt);
    assert.deepEqual(hindi.options.map((option) => option.value), english.options.map((option: any) => option.value));
    assert.deepEqual(hindi.options.map((option) => option.errorLabel), english.options.map((option: any) => option.errorLabel));
    assert.equal(hindi.options.length, 4);
    assert.equal(new Set(hindi.options.map((option) => option.label)).size, 4);
    assert.equal(hindi.metadata.locale, "hi-IN");
    assert.equal(hindi.metadata.sourceLocale, "en-IN");
    assert.equal(hindi.metadata.localizationMode, "LANGUAGE_ADAPTED");
    assert.equal(hindi.metadata.answerParityVerified, true);
    assert.ok(hindi.stem.length >= 45, `${ql.qlId} short Hindi stem: ${hindi.stem}`);
    assert.ok(/[\u0900-\u097F]/.test(hindi.stem), `${ql.qlId} has no Devanagari: ${hindi.stem}`);
    assert.ok(!forbiddenEnglish.test(hindi.stem), `${ql.qlId} English leak: ${hindi.stem}`);
    assert.ok(!internalLeak.test(hindi.stem), `${ql.qlId} internal leak: ${hindi.stem}`);
    assert.ok(!/करता\/करती|था\/थी|है है|है। है/.test(hindi.stem), `${ql.qlId} unnatural gender or duplication: ${hindi.stem}`);
    const explanationText = [hindi.explanation.given, ...hindi.explanation.steps, hindi.explanation.resultLine, hindi.explanation.conclusion].join(" ");
    assert.ok(/[\u0900-\u097F]/.test(explanationText));
    assert.ok(!forbiddenEnglish.test(explanationText), `${ql.qlId} English explanation leak: ${explanationText}`);
    assert.ok(!internalLeak.test(explanationText), `${ql.qlId} explanation internal leak: ${explanationText}`);
    assert.ok(hindi.explanation.steps.length >= 2);
    const diagrams = [hindi.questionDiagram, hindi.explanation.diagram].filter(Boolean) as any[];
    for (const diagram of diagrams) {
      assert.ok(typeof diagram.svg === "string" && diagram.svg.includes("<svg"));
      assert.ok(diagram.svg.includes('role="img"'));
      assert.ok(diagram.svg.includes("aria-label="));
      assert.ok(!/\b(?:North|South|East|West|metres?|Morning|Evening|Shadow|Sun)\b/.test(diagram.svg), `${ql.qlId} diagram English leak`);
    }
    stems.get(ql.qlId)!.add(hindi.stem);
    explanations.get(ql.qlId)!.add(explanationText);
    positions[hindi.correctIndex] += 1;
  }
}

for (const [qlId, values] of stems) assert.ok(values.size >= 30, `${qlId} Hindi stem diversity ${values.size}`);
for (const [qlId, values] of explanations) assert.ok(values.size >= 30, `${qlId} Hindi explanation diversity ${values.size}`);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.35, `Hindi answer positions ${positions}`);

for (let seed = 0; seed < 40; seed += 1) {
  const direction = generateDirectionQuestionHindi("DIR-QL-042", seed);
  const distance = generateDirectionQuestionHindi("DIR-QL-043", seed);
  assert.deepEqual(direction.structuredPrompt, distance.structuredPrompt);
  assert.equal(direction.metadata.caseletId, distance.metadata.caseletId);
}

assert.throws(() => generateDirectionQuestionHindi("DIR-QL-999", 0));
console.log("DIR-001 Hindi localization proof passed", {
  qls: DIR_001_QLS.length,
  generatedCases: DIR_001_QLS.length * 40,
  positions,
  stemDiversity: Object.fromEntries([...stems].map(([id, values]) => [id, values.size])),
  explanationDiversity: Object.fromEntries([...explanations].map(([id, values]) => [id, values.size])),
});
