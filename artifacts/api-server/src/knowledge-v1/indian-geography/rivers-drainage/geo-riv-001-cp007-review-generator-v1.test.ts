import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp007ReviewV1 } from "./geo-riv-001-cp007-review-generator-v1";

const QLS = Array.from({ length: 10 }, (_, index) => `GEO-RIV-001-QL-${String(55 + index).padStart(3, "0")}`);
const banned = /associated with|matches the reviewed relation|listed among|joining relation|therefore,|exam trap|shortcut|both banks|neither bank/i;

const ql062Answers = new Set<string>();
const ql063Answers = new Set<string>();
const ql064Answers = new Set<string>();
const upstreamTokens = new Set<string>();

for (const qlId of QLS) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `cp007-generator-audit-${qlId}-${index}`;
    const question = generateGeoRiv001Cp007ReviewV1(qlId, seed);
    const again = generateGeoRiv001Cp007ReviewV1(qlId, seed);

    assert.deepEqual(question, again, `NON_DETERMINISTIC:${qlId}:${seed}`);
    assert.equal(question.qlId, qlId);
    assert.equal(question.cpId, "GEO-RIV-001-CP007");
    assert.equal(question.options.length, 4, `OPTION_COUNT:${question.questionId}`);
    assert.equal(new Set(question.options).size, 4, `DUPLICATE_OPTION:${question.questionId}`);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `ANSWER_MISMATCH:${question.questionId}`);
    assert.ok(question.sourceIds.length > 0, `NO_SOURCE:${question.questionId}`);
    assert.ok(question.sourceFactIds.length > 0, `NO_PROJECTED_FACT:${question.questionId}`);
    assert.ok(question.upstreamFactIds.length > 0, `NO_UPSTREAM_FACT:${question.questionId}`);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(banned.test(`${question.stem}\n${question.explanation}`), false, `EDITORIAL_LANGUAGE:${question.questionId}`);
    assert.equal(question.sourceFactIds.some((id) => id.includes("cp006")), false, `CP006_PROJECTED_FACT:${question.questionId}`);
    assert.equal(question.upstreamFactIds.some((id) => id === "unknown" || id.includes("cp006")), false, `BAD_UPSTREAM:${question.questionId}`);

    for (const id of question.sourceFactIds) {
      const match = id.match(/geo-riv-001-cp007-(cp00[2-5])-/);
      assert.ok(match, `BAD_PROJECTED_FACT_ID:${id}`);
      upstreamTokens.add(match![1]);
    }

    if (qlId === "GEO-RIV-001-QL-062") ql062Answers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-063") ql063Answers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-064") ql064Answers.add(question.canonicalAnswer);
  }
}

assert.deepEqual([...upstreamTokens].sort(), ["cp002", "cp003", "cp004", "cp005"]);
assert.ok(ql062Answers.has("Chenab"));
assert.ok(ql062Answers.has("Beas → Satluj → Chenab"));
assert.ok(ql062Answers.has("Alaknanda"));
assert.ok(ql062Answers.has("Dibang and Lohit"));
assert.ok(ql062Answers.has("Ganga"));
assert.deepEqual([...ql063Answers].sort(), [
  "Both I and II are correct",
  "Neither I nor II is correct",
  "Only I is correct",
  "Only II is correct",
].sort());
assert.deepEqual([...ql064Answers].sort(), ["None", "One", "Three", "Two"].sort());

console.log(JSON.stringify({
  valid: true,
  qls: QLS,
  auditedQuestions: QLS.length * 80,
  upstreamTokens: [...upstreamTokens].sort(),
  ql062Answers: [...ql062Answers].sort(),
  ql063Answers: [...ql063Answers].sort(),
  ql064Answers: [...ql064Answers].sort(),
}, null, 2));
