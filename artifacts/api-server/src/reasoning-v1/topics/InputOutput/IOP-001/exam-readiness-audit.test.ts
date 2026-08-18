import assert from "node:assert/strict";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import {
  generateIop001StandardQuestionStudioBatch,
  type Iop001QuestionStudioLanguage,
} from "./question-studio-standard-integration.ts";
import type { IopPermanentSolveMode } from "./permanent-authorities.ts";

const languages: readonly Iop001QuestionStudioLanguage[] = ["en", "hi", "pa"] as const;
const solveModes = new Set<IopPermanentSolveMode>();
const sourceModes = new Set<string>();
const stems = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const sampleLines: string[] = [];
let questions = 0;
let minimumStemLength = Number.POSITIVE_INFINITY;
let maximumStemLength = 0;
let minimumExplanationLength = Number.POSITIVE_INFINITY;
let maximumExplanationLength = 0;
let maximumSharedPromptLength = 0;

const internalLeak = /(?:IOP-QL-|sourceModeId|oracle|fingerprint|caseletId|debugSource|canonicalProblemId|integrationAuthority)/i;
const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

for (const language of languages) {
  for (const mode of IOP_ENGLISH_SOURCE_MODES) {
    for (let sample = 0; sample < 3; sample += 1) {
      const batch = generateIop001StandardQuestionStudioBatch({
        packageId: "IOP-001",
        qlId: mode.qlId,
        sourceModeId: mode.sourceModeId,
        language,
        seed: `IOP-EXAM-READY-${language}-${mode.sourceModeId}-${sample}`,
        count: 4,
      });

      assert.equal(batch.questions.length, 4);
      assert.equal(batch.generationContext.questionStudioDiscoverable, true);
      assert.equal(batch.generationContext.questionBankWritable, false);
      assert.equal(batch.generationContext.testEligible, false);
      assert.equal(batch.generationContext.publiclyPublishable, false);
      sourceModes.add(mode.sourceModeId);

      for (const question of batch.questions) {
        questions += 1;
        solveModes.add(question.solveMode);
        minimumStemLength = Math.min(minimumStemLength, question.stem.length);
        maximumStemLength = Math.max(maximumStemLength, question.stem.length);
        minimumExplanationLength = Math.min(minimumExplanationLength, question.explanation.length);
        maximumExplanationLength = Math.max(maximumExplanationLength, question.explanation.length);
        maximumSharedPromptLength = Math.max(maximumSharedPromptLength, question.sharedPrompt.length);

        assert.ok(question.stem.length >= 12, `${language}/${mode.sourceModeId}: stem is too short`);
        assert.ok(question.stem.length <= 220, `${language}/${mode.sourceModeId}: stem is too long for exam presentation`);
        assert.match(question.stem.trim(), /[?？]$/, `${language}/${mode.sourceModeId}: question should read as a direct exam question`);
        assert.equal(internalLeak.test(question.stem), false, `${language}/${mode.sourceModeId}: engineering token leaked into stem`);
        assert.equal(internalLeak.test(question.explanation), false, `${language}/${mode.sourceModeId}: engineering token leaked into explanation`);
        assert.equal(internalLeak.test(question.sharedPrompt), false, `${language}/${mode.sourceModeId}: engineering token leaked into learner prompt`);

        assert.equal(question.options.length, 4, `${language}/${mode.sourceModeId}: expected four options`);
        const normalizedOptions = question.options.map(normalize);
        assert.equal(new Set(normalizedOptions).size, 4, `${language}/${mode.sourceModeId}: options must be distinct`);
        assert.ok(question.options.every((option) => option.trim().length > 0), `${language}/${mode.sourceModeId}: empty option`);
        assert.ok(question.options.every((option) => option.length <= 240), `${language}/${mode.sourceModeId}: option is too long`);
        assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
        answerPositions[question.correctIndex] += 1;
        assert.equal(question.options[question.correctIndex], question.answer);
        assert.equal(question.validation.exactlyOneCorrectOption, true);

        assert.ok(question.explanation.length >= 160, `${language}/${mode.sourceModeId}/${question.solveMode}: explanation is too thin`);
        assert.ok(question.explanation.length <= 1700, `${language}/${mode.sourceModeId}/${question.solveMode}: explanation is too verbose for exam review`);
        assert.ok(question.explanation.includes(question.answer), `${language}/${mode.sourceModeId}/${question.solveMode}: explanation does not state the answer`);
        assert.notEqual(normalize(question.machineTrace.demonstration.input.join(" ")), normalize(question.machineTrace.target.input.join(" ")), `${language}/${mode.sourceModeId}: demonstration and new input should differ`);

        if (language === "en") {
          assert.match(question.stem, /[A-Za-z]/);
          assert.match(question.sharedPrompt, /Illustration:/);
          assert.match(question.sharedPrompt, /New Input:/);
          if (sample === 0 && question.sequence === 1) {
            sampleLines.push(`${mode.sourceModeId} :: ${question.stem} :: ${question.answer}`);
          }
        } else if (language === "hi") {
          assert.match(question.stem, /[\u0900-\u097F]/);
          assert.match(question.explanation, /[\u0900-\u097F]/);
          assert.match(question.sharedPrompt, /उदाहरण:/);
          assert.match(question.sharedPrompt, /नया इनपुट:/);
        } else {
          assert.match(question.stem, /[\u0A00-\u0A7F]/);
          assert.match(question.explanation, /[\u0A00-\u0A7F]/);
          assert.match(question.sharedPrompt, /ਉਦਾਹਰਨ:/);
          assert.match(question.sharedPrompt, /ਨਵਾਂ ਇਨਪੁੱਟ:/);
        }

        const stemKey = `${language}|${normalize(question.stem)}|${normalize(question.sharedPrompt)}`;
        assert.equal(stems.has(stemKey), false, `${language}/${mode.sourceModeId}: duplicate learner question in readiness sample`);
        stems.add(stemKey);
      }
    }
  }
}

assert.equal(sourceModes.size, 19);
assert.equal(solveModes.size, 8);
assert.equal(questions, 19 * 3 * 3 * 4);
assert.equal(stems.size, questions);
for (const [index, count] of answerPositions.entries()) {
  assert.ok(count >= questions * 0.15, `Answer position ${index} is underrepresented: ${count}/${questions}`);
  assert.ok(count <= questions * 0.35, `Answer position ${index} is overrepresented: ${count}/${questions}`);
}

console.log("PASS_IOP_001_EXAM_READINESS_AUDIT");
console.log(`questions ${questions}`);
console.log(`source modes ${sourceModes.size}`);
console.log(`solve modes ${solveModes.size}`);
console.log(`stem length min/max ${minimumStemLength}/${maximumStemLength}`);
console.log(`explanation length min/max ${minimumExplanationLength}/${maximumExplanationLength}`);
console.log(`shared prompt maximum ${maximumSharedPromptLength}`);
console.log(`answer positions ${answerPositions.join(",")}`);
console.log("English exam-language spot samples:");
for (const line of sampleLines) console.log(line);
console.log("Question Bank false");
console.log("test eligible false");
console.log("publicly publishable false");
