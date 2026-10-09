import assert from "node:assert/strict";
import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES, previewTsdCp007QuestionStudioReview } from "./question-studio-review-adapter";

const clockSeconds = (s: string) => {
  const [h, m, sec] = s.split(":").map(Number);
  return h! * 3600 + m! * 60 + sec!;
};
const number = (s: string) => {
  const [n, d = "1"] = s.split("/");
  return Number(n) / Number(d);
};
let checked = 0;
for (const ql of TSD_CP007_FROZEN_ENGLISH_REGISTRY) {
  for (const family of ql.stemFamilies) {
    const count = TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES[family.familyId]!.length;
    const questions = previewTsdCp007QuestionStudioReview({familyId: family.familyId, count, seed: "semantic-regression"}).questions;
    for (const question of questions) {
      checked++;
      // Independently solve the rendered wording, rather than trusting the source solver.
      if (/^93-[A-E]$/.test(family.familyId)) {
        const values = [...question.stem.matchAll(/(\d+(?:\/\d+)?) m\b/g)].map(m => number(m[1]!));
        const speed = question.stem.match(/(\d+(?:\/\d+)?) m\/s/);
        const clock = question.stem.match(/\d{2}:\d{2}:\d{2}/);
        assert.ok(speed && clock);
        const length = family.familyId === "93-B" || family.familyId === "93-E" ? values[1]! : values[0]!;
        const object = family.familyId === "93-B" || family.familyId === "93-E" ? values[0]! : values[1]!;
        const distance = family.familyId === "93-C" ? length : ["93-D", "93-E"].includes(family.familyId) ? object - length : object + length;
        const sign = ["93-B", "93-E"].includes(family.familyId) ? -1 : 1;
        const expected = ((clockSeconds(clock[0]) + sign * distance / number(speed[1]!)) % 86400 + 86400) % 86400;
        assert.equal(clockSeconds(question.answer), expected, `${family.familyId}: rendered clock arithmetic`);
      }
      if (family.familyId === "94-A" || family.familyId === "94-B") {
        const values = [...question.stem.matchAll(/(\d+(?:\/\d+)?) m\b/g)].map(m => number(m[1]!));
        const distance = family.familyId === "94-A" ? values[0]! : values[1]!;
        const spacing = family.familyId === "94-A" ? values[1]! : values[0]!;
        assert.equal(Number(question.answer), Math.floor(distance / spacing) + (family.familyId === "94-B" ? 1 : 0), `${family.familyId}: rendered endpoint count`);
      }
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.publiclyPublishable, false);
    }
  }
}
console.log(`CP007 semantic regression: PASS (${checked} English combinations; frozen wording unchanged)`);
