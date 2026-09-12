import { strict as assert } from "node:assert";

import { generateGeoRiv001Cp002ReviewV4 } from "./geo-riv-001-cp002-review-generator-v4";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 10).padStart(3, "0")}`);

for (const qlId of QLS) {
  for (let index = 0; index < 80; index += 1) {
    const question = generateGeoRiv001Cp002ReviewV4(qlId, `cp002-v4-${qlId}-${index}`);
    assert.match(question.questionId, /CP002-V4/);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    const visibleText = `${question.stem}\n${question.explanation}`;
    assert.doesNotMatch(visibleText, /associated with the source/i);
    assert.doesNotMatch(question.explanation, /Therefore,/i);
    assert.doesNotMatch(visibleText, /has its source at or near/i);
    assert.doesNotMatch(visibleText, /originates at or near/i);
    assert.doesNotMatch(visibleText, /near\s+near/i);
    assert.doesNotMatch(visibleText, /listed among/i);
    assert.doesNotMatch(visibleText, /joining relation/i);
  }
}

const ql010 = Array.from({ length: 100 }, (_, index) =>
  generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-010", `cp002-v4-source-${index}`),
);
assert.equal(ql010.every((q) => /originates from|source area/i.test(q.stem)), true);

const ql011 = Array.from({ length: 100 }, (_, index) =>
  generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-011", `cp002-v4-reverse-${index}`),
);
assert.equal(ql011.every((q) => /^Which river originates /i.test(q.stem)), true);

const ql012 = Array.from({ length: 160 }, (_, index) =>
  generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-012", `cp002-v4-tributary-${index}`),
);
for (const question of ql012.filter((q) => q.stem.includes("five main tributaries"))) {
  assert.match(question.explanation, /is one of the five main tributaries of the Indus River\./);
}

const chainQuestions = Array.from({ length: 300 }, (_, index) =>
  generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-016", `cp002-v4-chain-${index}`),
);
const chenabChain = chainQuestions.find((q) => q.canonicalAnswer === "Chenab");
assert.ok(chenabChain);
assert.equal(
  chenabChain.stem,
  "The Jhelum joins which river at Trimmu, and the Satluj later joins the same river at Panjnad?",
);
const sequence = chainQuestions.find((q) => q.canonicalAnswer === "Beas → Satluj → Chenab");
assert.ok(sequence);
assert.equal(sequence.stem, "Which sequence correctly shows the order in which these rivers join?");

for (let index = 0; index < 120; index += 1) {
  const q17 = generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-017", `cp002-v4-q17-${index}`);
  assert.match(q17.explanation, /Hence, (?:both|only Statement I|only Statement II|neither)/i);

  const q18 = generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-018", `cp002-v4-q18-${index}`);
  assert.match(q18.explanation, /Hence, (?:none|one|two|all three)/i);
}

const replayA = generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-016", "cp002-v4-replay");
const replayB = generateGeoRiv001Cp002ReviewV4("GEO-RIV-001-QL-016", "cp002-v4-replay");
assert.deepEqual(replayA, replayB);
