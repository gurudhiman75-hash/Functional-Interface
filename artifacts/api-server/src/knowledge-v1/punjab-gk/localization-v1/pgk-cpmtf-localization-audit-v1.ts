import { PGK_001_QUESTION_STUDIO_CORPUS_V1 } from "../../../question-studio/engines/knowledge-v1-pgk001-adapter-v1";
import {
  PGK_001_MATCH_FOLLOWING_CONCEPTS_V1,
  generatePgkMatchFollowingReviewV1,
  type PgkMatchingLocaleV1,
} from "./pgk-match-following-extension-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const targetCps = [
  "PGK-001-CP-004","PGK-001-CP-005","PGK-001-CP-012","PGK-001-CP-014",
  "PGK-001-CP-015","PGK-001-CP-016","PGK-001-CP-018","PGK-001-CP-020",
  "PGK-001-CP-022","PGK-001-CP-024","PGK-001-CP-025","PGK-001-CP-026",
] as const;

const qlRangeByCp: Record<string, readonly [number, number]> = {
  "PGK-001-CP-004":[21,27],
  "PGK-001-CP-005":[28,34],
  "PGK-001-CP-012":[77,83],
  "PGK-001-CP-014":[91,97],
  "PGK-001-CP-015":[98,104],
  "PGK-001-CP-016":[105,111],
  "PGK-001-CP-018":[119,125],
  "PGK-001-CP-020":[133,139],
  "PGK-001-CP-022":[147,153],
  "PGK-001-CP-024":[161,167],
  "PGK-001-CP-025":[168,174],
  "PGK-001-CP-026":[175,182],
};

assert(PGK_001_QUESTION_STUDIO_CORPUS_V1.length === 1092, "Frozen PGK-001 core must remain exactly 1,092 questions");
assert(PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.length === 24, "Matching extension must contain exactly 24 concepts");
assert(new Set(PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.map(x=>x.id)).size === 24, "Matching concept IDs must be unique");

for (const cp of targetCps) {
  const rows = PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.filter(x=>x.cpId===cp);
  assert(rows.length === 2, `${cp}: expected exactly two matching concepts; found ${rows.length}`);
}
assert(PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.every(x=>targetCps.includes(x.cpId as typeof targetCps[number])), "Unexpected CP in matching extension");

for (const c of PGK_001_MATCH_FOLLOWING_CONCEPTS_V1) {
  assert(/^PGK-001-MTF-\d{3}$/.test(c.id), `${c.id}: invalid extension ID`);
  assert(c.sourceQlIds.length >= 1, `${c.id}: source QL provenance required`);
  const [lo,hi] = qlRangeByCp[c.cpId]!;
  for (const ql of c.sourceQlIds) {
    const m=ql.match(/^PGK-001-QL-(\d{3})$/);
    assert(m, `${c.id}: invalid source QL ${ql}`);
    const n=Number(m[1]);
    assert(n>=lo && n<=hi, `${c.id}: source QL ${ql} is outside ${c.cpId}`);
  }
  assert(c.correctMapping.length===4, `${c.id}: mapping must have four entries`);
  assert(new Set(c.correctMapping).size===4 && c.correctMapping.every(n=>n>=1&&n<=4), `${c.id}: mapping must be a permutation of 1-4`);
  for (const locale of ["en","hi","pa"] as const) {
    const x=c[locale];
    assert(x.listI.length===4 && x.listII.length===4, `${c.id}/${locale}: both lists must have four entries`);
    assert(new Set(x.listI).size===4, `${c.id}/${locale}: List I values must be unique`);
    assert(new Set(x.listII).size===4, `${c.id}/${locale}: List II values must be unique`);
    assert(x.explanation.trim().length>=40, `${c.id}/${locale}: explanation too thin`);
  }
}

function learnerText(q: ReturnType<typeof generatePgkMatchFollowingReviewV1>[number]) {
  return [q.stem,...q.options,q.explanation].join("\n");
}
function auditNative(locale: "hi"|"pa", q: ReturnType<typeof generatePgkMatchFollowingReviewV1>[number]) {
  const text=learnerText(q);
  assert(!/[A-Za-z]{2,}/u.test(text), `${q.questionId}: Latin learner-text leakage`);
  if (locale==="hi") {
    assert(/[\u0900-\u097F]/u.test(text), `${q.questionId}: Devanagari missing`);
    assert(!/[\u0A00-\u0A7F]/u.test(text), `${q.questionId}: Gurmukhi leakage`);
  } else {
    assert(/[\u0A00-\u0A7F]/u.test(text), `${q.questionId}: Gurmukhi missing`);
    assert(!/[\u0900-\u097F]/u.test(text), `${q.questionId}: Devanagari leakage`);
  }
}

for (const locale of ["en","hi","pa"] as PgkMatchingLocaleV1[]) {
  const rows=generatePgkMatchFollowingReviewV1(locale);
  assert(rows.length===24, `${locale}: expected 24 matching questions`);
  assert(new Set(rows.map(q=>q.questionId)).size===24, `${locale}: duplicate question IDs`);
  rows.forEach((q,i)=>{
    assert(q.questionType==="Match the Following", `${q.questionId}: wrong question type`);
    assert(q.reviewOnly===true && q.runtimeRegistered===false, `${q.questionId}: lifecycle drift`);
    assert(q.listI.length===4 && q.listII.length===4, `${q.questionId}: invalid list size`);
    assert(q.options.length===4 && new Set(q.options).size===4, `${q.questionId}: four unique code options required`);
    assert(q.correctIndex>=0 && q.correctIndex<4, `${q.questionId}: invalid correct index`);
    assert(q.options[q.correctIndex]===q.canonicalAnswer, `${q.questionId}: answer-code mismatch`);
    assert(q.options.every(o=>/^A-[1-4], B-[1-4], C-[1-4], D-[1-4]$/.test(o)), `${q.questionId}: malformed answer code`);
    const concept=PGK_001_MATCH_FOLLOWING_CONCEPTS_V1[i]!;
    assert(q.cpId===concept.cpId, `${q.questionId}: CP drift`);
    assert(JSON.stringify(q.sourceQlIds)===JSON.stringify(concept.sourceQlIds), `${q.questionId}: provenance drift`);
    if (locale!=="en") auditNative(locale,q);
  });
}

console.log("PGK-001 genuine match-following audit passed: 24 concepts / 72 EN-HI-PA review surfaces; frozen 1,092-question core unchanged.");
