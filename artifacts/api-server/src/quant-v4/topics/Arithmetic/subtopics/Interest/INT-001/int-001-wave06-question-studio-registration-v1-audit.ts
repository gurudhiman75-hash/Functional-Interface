import assert from "node:assert/strict";
import { INT_001_WAVE06_QS_QL_IDS, INT_001_WAVE06_QS_LANGUAGES, generateInt001Wave06QuestionStudioBatch, listInt001Wave06QuestionStudioPackages } from "./int-001-wave06-question-studio-integration-v1";

const SEEDS_PER_QL_LANGUAGE = 200;
const FORBIDDEN = /\b(multiplier|factor|combined\s+factor|return[-\s]difference\s+factor)\b|गुणक|ਗੁਣਕ/iu;
let generated = 0;
let deterministicChecks = 0;
let answerChecks = 0;
let lifecycleChecks = 0;
let explanationChecks = 0;
const stemsByQlLanguage = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
const crossQlStems = new Map<string, string>();
let crossQlCollisions = 0;

const packages = listInt001Wave06QuestionStudioPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]!.permanentQlCount, 3);
assert.deepEqual(packages[0]!.permanentQlIds, INT_001_WAVE06_QS_QL_IDS);
assert.deepEqual(packages[0]!.supportedLanguages, INT_001_WAVE06_QS_LANGUAGES);
assert.equal(packages[0]!.questionStudioDiscoverable, true);
assert.equal(packages[0]!.questionBankWritable, false);
assert.equal(packages[0]!.testEligible, false);
assert.equal(packages[0]!.publiclyPublishable, false);

for (const qlId of INT_001_WAVE06_QS_QL_IDS) {
  for (const language of INT_001_WAVE06_QS_LANGUAGES) {
    const key = `${qlId}|${language}`;
    const stems = new Set<string>();
    const positions = new Set<number>();
    stemsByQlLanguage.set(key, stems);
    answerPositions.set(key, positions);
    for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
      const seed = `INT-001-WAVE06-SOAK:${qlId}:${language}:${index}`;
      const first = await generateInt001Wave06QuestionStudioBatch({ qlId, language, seed, count: 1 });
      const second = await generateInt001Wave06QuestionStudioBatch({ qlId, language, seed, count: 1 });
      assert.equal(JSON.stringify(first), JSON.stringify(second), `${key}/${index}: nondeterministic Question Studio payload`);
      deterministicChecks += 1;
      const q = first.questions[0]! as any;
      generated += 1;
      assert.equal(q.qlId, qlId);
      assert.equal(q.language, language);
      assert.equal(q.options.length, 4);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
      assert.equal(q.options[q.correctIndex], q.answer);
      answerChecks += 5;
      assert.equal(q.questionStudioDiscoverable, true);
      assert.equal(q.questionBankWritable, false);
      assert.equal(q.testEligible, false);
      assert.equal(q.mockTestEligible, false);
      assert.equal(q.publiclyPublishable, false);
      assert.equal(q.automaticStudentPublication, false);
      lifecycleChecks += 6;
      const lines = q.packageExplanation.lines as readonly string[];
      assert.ok(lines.length >= 3 && lines.length <= 6);
      assert.equal(lines.some((line) => FORBIDDEN.test(line)), false);
      assert.ok(lines.filter((line) => /[0-9]/u.test(line) && /[=×÷+−^/]/u.test(line)).length / lines.length >= 0.75);
      explanationChecks += 3;
      stems.add(q.stem);
      positions.add(q.correctIndex);
      const collisionKey = `${language}|${q.stem}`;
      const owner = crossQlStems.get(collisionKey);
      if (owner && owner !== qlId) crossQlCollisions += 1;
      else crossQlStems.set(collisionKey, qlId);
    }
    assert.ok(stems.size >= 3, `${key}: stem family surface too thin (${stems.size})`);
    assert.deepEqual([...positions].sort(), [0,1,2,3], `${key}: not all answer positions reachable`);
  }
}

assert.equal(generated, 1800);
assert.equal(deterministicChecks, 1800);
assert.equal(answerChecks, 9000);
assert.equal(lifecycleChecks, 10800);
assert.equal(explanationChecks, 5400);
assert.equal(crossQlCollisions, 0);

console.log(JSON.stringify({
  qls: INT_001_WAVE06_QS_QL_IDS,
  languages: INT_001_WAVE06_QS_LANGUAGES,
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  generated,
  deterministicChecks,
  answerChecks,
  lifecycleChecks,
  explanationChecks,
  distinctStemsByQlLanguage: Object.fromEntries([...stemsByQlLanguage].map(([k,v]) => [k, v.size])),
  answerPositionsByQlLanguage: Object.fromEntries([...answerPositions].map(([k,v]) => [k, [...v].sort()])),
  crossQlCollisions,
  policy: { questionStudioDiscoverable: true, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false },
}, null, 2));
console.log("PASS_INT_001_WAVE06_QUESTION_STUDIO_REGISTRATION_V1_AUDIT");
