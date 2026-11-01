import assert from "node:assert/strict";
import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  generateInt001ChapterAdminQuestionStudioBatch,
} from "./int-001-chapter-question-studio-admin-adapter-v1";
import {
  normalizeInterestExplanationMath,
  retrofitInterestDirectCalculationLines,
} from "./interest-direct-calculation-explanation-policy-v1";

// Same token boundaries as the learner's QuestionRichText component.
const MATH = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
function checkText(text: string, identity: string) {
  assert(!/\[object Object\]|[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(text), identity);
  const outside = text.replace(MATH, "");
  assert(!/\\(?:frac|times|text|left|right|sqrt)\b/.test(outside), `${identity}: exposed math command`);
  assert(!/(?<!\\)\$|\\[()[\]]/.test(outside), `${identity}: unmatched delimiter`);
  for (const match of text.matchAll(MATH)) {
    const body = match.slice(1).find(value => value !== undefined)!;
    assert(!/(?<!\\)%/.test(body), `${identity}: percent comments out math`);
    assert(!/\d+(?:\.\d+)?\\?%\s*\/\s*100/.test(body), `${identity}: percentage conversion applied twice`);
    let depth = 0;
    for (const character of body.replace(/\\[{}]/g, "")) {
      if (character === "{") depth++;
      if (character === "}") depth--;
      assert(depth >= 0, `${identity}: closing brace without opening brace`);
    }
    assert.equal(depth, 0, `${identity}: unbalanced braces`);
    assert.equal((body.match(/\\left\b/g) ?? []).length, (body.match(/\\right\b/g) ?? []).length, `${identity}: unbalanced left/right`);
  }
}

const conversion = "Rate is 10%. \\(D_2=200000(10%/100)^2=2000\\).";
const repaired = normalizeInterestExplanationMath(conversion, "INT-QL-096");
assert.equal(repaired, "Rate is 10%. \\(D_2=200000(10/100)^2=2000\\).");
assert.equal(normalizeInterestExplanationMath(repaired, "INT-QL-096"), repaired);
assert.equal(normalizeInterestExplanationMath("$r=10\\%$", "INT-QL-103"), "$r=10\\%$");
const rate = normalizeInterestExplanationMath("\\(r=2D_2/SI_2=2\\times2000/40000=10%\\)", "INT-QL-100");
assert.equal(rate, "\\(r=200D_2/SI_2=200\\times2000/40000=10\\%\\)");
assert.equal(200 * 2000 / 40000, 10);
assert.deepEqual(retrofitInterestDirectCalculationLines({ qlId: "INT-QL-001", language: "en", lines: ["$$I=1000/10=100$$", "Option 2 (₹90): arithmetic error.", "Answer: ₹100"], answer: "₹100" }), ["$$I=1000/10=100$$", "Answer: ₹100"]);

let checked = 0;
for (const qlId of INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlIds) {
  for (const language of ["en", "hi", "pa"] as const) for (let seed = 0; seed < 3; seed++) {
    const request = { qlId, language, seed: `interest-format-audit-20261101-${seed}`, count: 1 };
    const batch = await generateInt001ChapterAdminQuestionStudioBatch(request);
    const question = batch.questions[0]!;
    const identity = `${qlId}/${language}/${seed}`;
    assert(question.explanationLines.length > 0, `${identity}: empty explanation`);
    assert.equal(question.options[question.correctIndex], question.answer);
    for (const text of [question.stem, ...question.options, ...question.explanationLines]) checkText(text, identity);
    assert(!question.explanationLines.some(line => /^Option\s+[A-D1-4]\b/iu.test(line)), `${identity}: option analysis`);
    if (qlId === "INT-QL-100" && language === "en") {
      assert(question.explanationLines.some(line => line.includes("r=200D_2/SI_2=200\\times")), `${identity}: rate scale`);
    }
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    if (seed === 0) assert.deepEqual(await generateInt001ChapterAdminQuestionStudioBatch(request), batch, `${identity}: determinism`);
    checked++;
  }
}
console.log(JSON.stringify({ status: "PASS", questionLanguages: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlCount, languages: 3, seeds: 3, checked }));
