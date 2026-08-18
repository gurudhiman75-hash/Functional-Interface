import assert from "node:assert/strict";
import {
  generateIntCp007EnglishQuestion as generateV7,
} from "./cp007-scheme-equivalence-english-v7";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V8_SUPERSEDES,
  generateIntCp007EnglishQuestion as generateV8,
} from "./cp007-scheme-equivalence-english-v8";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function preservedSurface(question: ReturnType<typeof generateV7>): unknown {
  const source = question as any;
  const topLevel = Object.fromEntries(Object.entries(source).filter(([key]) => !["englishVersion", "presentation", "explanation"].includes(key)));
  const presentation = Object.fromEntries(Object.entries(source.presentation).filter(([key]) => !["markdown", "prompt"].includes(key)));
  return {
    topLevel,
    presentation,
    explanationFinalAnswer: source.explanation.finalAnswer,
  };
}

function learnerText(question: ReturnType<typeof generateV8>): string {
  return [
    question.presentation.markdown,
    question.presentation.prompt,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    question.explanation.commonMistake,
  ].join("\n");
}

function mathSegments(text: string): readonly string[] {
  const matches = text.match(/\$[^$]+\$/gu);
  return Object.freeze(matches ?? []);
}

const bannedPhrases = Object.freeze([
  "compound interest compounded annually",
  "Using rupees,",
  "required-principal scheme",
  "Known-scheme accumulation factor",
  "Known-scheme factor",
  "maturity amount, in rupees",
  "complete accumulation factor",
  "complete maturity factor",
]);

let questions = 0;
let preservationChecks = 0;
let latexPreservationChecks = 0;
let editorialGuardChecks = 0;
let changedQuestions = 0;
let deepFreezeChecks = 0;
const changedByQl = new Map<string, number>();

for (const qlId of INT_CP007_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v8-${qlId}-${index}`;
    const before = generateV7(qlId, seed);
    const after = generateV8(qlId, seed);
    const beforeText = learnerText(before as any);
    const afterText = learnerText(after);

    assert.equal(stableJson(preservedSurface(after as any)), stableJson(preservedSurface(before)), `${qlId}/${seed}: V8 changed a non-editorial field`);
    preservationChecks += 1;

    assert.deepEqual(mathSegments(afterText), mathSegments(beforeText), `${qlId}/${seed}: V8 changed LaTeX/math content`);
    latexPreservationChecks += 1;

    for (const phrase of bannedPhrases) {
      assert.ok(!afterText.includes(phrase), `${qlId}/${seed}: V8 retained banned exam-facing phrase: ${phrase}`);
      editorialGuardChecks += 1;
    }

    assert.ok(!afterText.includes("  "), `${qlId}/${seed}: V8 introduced doubled whitespace`);
    assert.ok(!afterText.includes(" ,"), `${qlId}/${seed}: V8 introduced punctuation spacing defect`);
    assert.ok(!afterText.includes(" ."), `${qlId}/${seed}: V8 introduced punctuation spacing defect`);
    editorialGuardChecks += 3;

    if (beforeText !== afterText) {
      changedQuestions += 1;
      changedByQl.set(qlId, (changedByQl.get(qlId) ?? 0) + 1);
    }

    assert.ok(Object.isFrozen(after), `${qlId}/${seed}: V8 question is not frozen`);
    assert.ok(Object.isFrozen(after.presentation), `${qlId}/${seed}: V8 presentation is not frozen`);
    assert.ok(Object.isFrozen(after.explanation), `${qlId}/${seed}: V8 explanation is not frozen`);
    assert.ok(Object.isFrozen(after.explanation.steps), `${qlId}/${seed}: V8 explanation steps are not frozen`);
    deepFreezeChecks += 4;
    questions += 1;
  }
}

assert.ok(changedQuestions > 0, "V8 editorial overlay made no learner-facing changes");
for (const requiredQl of ["INT-QL-109", "INT-QL-110", "INT-QL-111", "INT-QL-112", "INT-QL-113", "INT-QL-115"]) {
  assert.ok((changedByQl.get(requiredQl) ?? 0) > 0, `${requiredQl}: V8 did not exercise expected prose polish`);
}

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  supersedes: INT_CP007_ENGLISH_V8_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  questions,
  changedQuestions,
  changedByQl: Object.fromEntries(changedByQl),
  preservationChecks,
  latexPreservationChecks,
  editorialGuardChecks,
  deepFreezeChecks,
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V8_EXAM_EDITORIAL_AUDIT");
