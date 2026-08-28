import assert from "node:assert/strict";

import {
  NUM_CP013_ALLOCATION_STATUS,
  NUM_CP013_PERMANENT_ALLOCATION,
  NUM_CP013_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { generateNumCp013Permanent } from "./permanent-runtime.ts";
import { generateNumCp013Localized } from "./localization/runtime.ts";
import { NUM_CP013_DISCOVERY_PROTOTYPE_IDS } from "./wave04/merge-split-proposal.ts";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine-cp013.ts";

assert.equal(NUM_CP013_DISCOVERY_PROTOTYPE_IDS.length, 22, "CP013 discovery source count drift");
assert.equal(NUM_CP013_PERMANENT_ALLOCATION.length, 11, "CP013 authority count drift");
assert.deepEqual(NUM_CP013_PERMANENT_QL_IDS, Array.from({ length: 11 }, (_, index) => `NUM-QL-${237 + index}`));
assert.equal(NUM_CP013_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-248");

let frozenPackages = 0;
for (const qlId of NUM_CP013_PERMANENT_QL_IDS) {
  const en = generateNumCp013Permanent(qlId, 37);
  assert.equal(en.permanentQlId, qlId);
  assert.equal(en.canonicalAnswer, en.verifierAnswer);
  assert.equal(en.options[en.correctIndex]?.value, en.canonicalAnswer);
  assert.ok(Number.isSafeInteger(en.sourceSeed) && en.sourceSeed >= 1);
  assert.equal(en.lifecycle.questionStudioDiscoverable, false);
  assert.equal(en.lifecycle.questionBankWritable, false);
  assert.equal(en.lifecycle.testEligible, false);
  assert.equal(en.lifecycle.mockTestEligible, false);
  assert.equal(en.lifecycle.publiclyPublishable, false);
  assert.equal(en.lifecycle.automaticStudentPublication, false);
  frozenPackages += 1;

  for (const language of ["hi", "pa"] as const) {
    const localized = generateNumCp013Localized(qlId, 37, language);
    assert.equal(localized.permanentQlId, qlId);
    assert.equal(localized.sourceSeed, en.sourceSeed, `${qlId}/${language}: source-seed parity drift`);
    assert.equal(localized.hiddenState, en.hiddenState, `${qlId}/${language}: hidden-state reference changed`);
    assert.deepEqual(localized.hiddenState, en.hiddenState, `${qlId}/${language}: hidden-state parity drift`);
    assert.equal(localized.mathematicalFingerprint, en.mathematicalFingerprint);
    assert.equal(localized.options[localized.correctIndex]?.value, localized.canonicalAnswer);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.mockTestEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    frozenPackages += 1;
  }
}
assert.equal(frozenPackages, 33);

function collectModes(qlId: "NUM-QL-237" | "NUM-QL-241", prototypeId: string, seedLimit: number) {
  const modes = new Set<number>();
  const sourceSeeds = new Set<number>();
  for (let seed = 1; seed <= seedLimit; seed += 1) {
    const q = generateNumCp013Permanent(qlId, seed);
    if (q.temporaryPrototypeId !== prototypeId) continue;
    sourceSeeds.add(q.sourceSeed);
    const mode = (q.hiddenState as Readonly<Record<string, unknown>>).mode;
    if (typeof mode === "number" && Number.isInteger(mode)) modes.add(mode);
  }
  return { modes: [...modes].sort((a, b) => a - b), sourceSeeds };
}

const ql237P011 = collectModes("NUM-QL-237", "NUM-CP013-PROT-011", 80);
assert.deepEqual(ql237P011.modes, [0, 1, 2, 3], "QL237/P011 lost positional-structure internal modes");
assert.ok(ql237P011.sourceSeeds.size >= 4, "QL237/P011 source seed progression too narrow");

const ql241P021 = collectModes("NUM-QL-241", "NUM-CP013-PROT-021", 80);
assert.deepEqual(ql241P021.modes, [0, 1, 2], "QL241/P021 lost zero/one/multiple solution topology");
assert.ok(ql241P021.sourceSeeds.size >= 3, "QL241/P021 source seed progression too narrow");

for (const language of ["hi", "pa"] as const) {
  const localized237Modes = new Set<number>();
  const localized241Modes = new Set<number>();
  for (let seed = 1; seed <= 50; seed += 1) {
    const q237 = generateNumCp013Localized("NUM-QL-237", seed, language);
    if (q237.temporaryPrototypeId === "NUM-CP013-PROT-011") {
      const mode = (q237.hiddenState as Readonly<Record<string, unknown>>).mode;
      if (typeof mode === "number") localized237Modes.add(mode);
    }
    const q241 = generateNumCp013Localized("NUM-QL-241", seed, language);
    if (q241.temporaryPrototypeId === "NUM-CP013-PROT-021") {
      const mode = (q241.hiddenState as Readonly<Record<string, unknown>>).mode;
      if (typeof mode === "number") localized241Modes.add(mode);
    }
  }
  assert.deepEqual([...localized237Modes].sort((a, b) => a - b), [0, 1, 2, 3], `${language}: QL237/P011 localized modes regressed`);
  assert.deepEqual([...localized241Modes].sort((a, b) => a - b), [0, 1, 2], `${language}: QL241/P021 localized solution topology regressed`);
}

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 aggregate capability missing");
assert.equal(num002.permanentQlCount, 82);
assert.equal(num002.permanentQlIds.length, 82);
assert.equal(new Set(num002.permanentQlIds).size, 82);
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-247");
assert.ok(num002.cpIds.includes("NUM-CP-008"));
assert.ok(num002.cpIds.includes("NUM-CP-012"));
assert.ok(num002.cpIds.includes("NUM-CP-013"));
assert.equal(num002.releaseId, "NUM-002-QS-CP008-CP013-MULTILINGUAL-FROZEN-V1");
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.mockTestEligible, false);
assert.equal(num002.publiclyPublishable, false);
assert.equal(num002.automaticStudentPublication, false);

for (const language of ["en", "hi", "pa"] as const) {
  const studio = await generateQuestion({
    canonicalProblemId: "NUM-CP-013",
    language,
    seed: `cp013-cumulative:${language}`,
    count: 22,
  });
  assert.equal(studio.questions.length, 22);
  assert.ok(studio.questions.every((q: any) => q.canonicalProblemId === "NUM-CP-013"));
  assert.ok(studio.questions.every((q: any) => q.questionStudioDiscoverable === true));
  assert.ok(studio.questions.every((q: any) => q.questionBankWritable === false));
  assert.ok(studio.questions.every((q: any) => q.testEligible === false));
  assert.ok(studio.questions.every((q: any) => q.mockTestEligible === false));
  assert.ok(studio.questions.every((q: any) => q.publiclyPublishable === false));
  assert.ok(studio.questions.every((q: any) => q.automaticStudentPublication === false));
  assert.ok(studio.questions.every((q: any) => Number.isSafeInteger(q.permanentSeed) && q.permanentSeed >= 1));
  assert.ok(studio.questions.every((q: any) => Number.isSafeInteger(q.sourceSeed) && q.sourceSeed >= 1));
  assert.ok(studio.questions.every((q: any) => q.semanticMetadata.permanentSeed === q.permanentSeed));
  assert.ok(studio.questions.every((q: any) => q.semanticMetadata.sourceSeed === q.sourceSeed));
  assert.ok(new Set(studio.questions.map((q: any) => q.qlId)).size >= 10, `${language}: cumulative QL breadth too narrow`);

  const expectedPrefix = language === "hi" ? "उत्तर:" : language === "pa" ? "ਉੱਤਰ:" : "Answer:";
  assert.ok(
    studio.questions.every((q: any) => String(q.packageExplanation.lines.at(-1)).startsWith(expectedPrefix)),
    `${language}: cumulative final-answer label drift`,
  );
}

const packageOnly = await generateQuestion({ packageId: "NUM-002", language: "en", seed: "cp013-cumulative-fallback", count: 1 });
assert.notEqual(packageOnly.questions[0]?.canonicalProblemId, "NUM-CP-013", "CP013 stole package-only NUM-002 fallback");

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_CUMULATIVE_LANDING",
  discoveryPrototypes: 22,
  permanentAuthorities: 11,
  permanentRange: "NUM-QL-237..NUM-QL-247",
  nextAvailableQl: "NUM-QL-248",
  aggregateNum002QlCount: 82,
  aggregateNum002Range: "NUM-QL-166..NUM-QL-247",
  languages: ["en", "hi", "pa"],
  sourceSeedSelectionDecoupled: true,
  ql237P011Modes: ql237P011.modes,
  ql241P021Modes: ql241P021.modes,
  localeNativeFinalAnswerLabels: true,
  packageOnlyFallbackPreserved: true,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
}, null, 2));
