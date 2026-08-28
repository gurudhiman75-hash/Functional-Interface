import assert from "node:assert/strict";

import { NUM_CP013_PERMANENT_QL_IDS } from "../permanent-allocation.ts";
import { generateNumCp013Permanent } from "../permanent-runtime.ts";
import { generateNumCp013Localized } from "./runtime.ts";
import type { NumCp013LocalizedLanguage } from "./types.ts";

function tokenCount(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function nativeCharacters(value: string, language: NumCp013LocalizedLanguage) {
  const chars = [...value];
  return chars.filter((character) => {
    const code = character.codePointAt(0)!;
    return language === "hi"
      ? code >= 0x0900 && code <= 0x097f
      : code >= 0x0a00 && code <= 0x0a7f;
  }).length;
}

function hasHindiLetterInPunjabi(value: string) {
  return [...value].some((character) => {
    const code = character.codePointAt(0)!;
    return code >= 0x0900 && code <= 0x097f && code !== 0x0964 && code !== 0x0965;
  });
}

function hasPunjabiCharacterInHindi(value: string) {
  return [...value].some((character) => {
    const code = character.codePointAt(0)!;
    return code >= 0x0a00 && code <= 0x0a7f;
  });
}

const languages: readonly NumCp013LocalizedLanguage[] = ["hi", "pa"];
const taskKinds = new Set<string>();
let packages = 0;
let textChecks = 0;
let scriptChecks = 0;

for (const qlId of NUM_CP013_PERMANENT_QL_IDS) {
  for (const language of languages) {
    for (let seed = 1; seed <= 35; seed += 1) {
      const en = generateNumCp013Permanent(qlId, seed);
      const q = generateNumCp013Localized(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;
      const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");

      assert.notEqual(q.stem, en.stem, `${label}: English stem leaked unchanged`);
      assert.ok(nativeCharacters(learnerText, language) >= 35, `${label}: native-script content too thin`);
      assert.ok(tokenCount(learnerText) >= 22, `${label}: learner text too thin`);
      assert.ok(tokenCount(learnerText) <= 180, `${label}: learner text too long`);
      assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 3, `${label}: expected two or three concise steps`);
      assert.ok(q.explanation.coreConcept.length >= 24, `${label}: core concept too thin`);
      assert.ok(q.explanation.strategy.length >= 18, `${label}: strategy too thin`);
      textChecks += 1;

      const lower = learnerText.toLowerCase();
      for (const forbidden of ["prototype", "generator", "hidden state", "fingerprint", "source ancestry", "question studio", "question bank", "permanent ql"]) {
        assert.equal(lower.includes(forbidden), false, `${label}: implementation vocabulary leaked: ${forbidden}`);
      }
      if (language === "hi") assert.equal(hasPunjabiCharacterInHindi(learnerText), false, `${label}: Gurmukhi leaked into Hindi`);
      else assert.equal(hasHindiLetterInPunjabi(learnerText), false, `${label}: Devanagari letters or marks leaked into Punjabi`);
      scriptChecks += 1;

      assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option binding drift`);
      assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: final answer binding drift`);
      taskKinds.add(q.taskKind);
      packages += 1;
    }
  }
}

assert.equal(packages, 11 * 2 * 35);
assert.equal(textChecks, packages);
assert.equal(scriptChecks, packages);
assert.ok(taskKinds.size >= 20, `Localized task-kind breadth unexpectedly thin: ${taskKinds.size}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_HI_PA_HUMAN_QUALITY",
  authorities: NUM_CP013_PERMANENT_QL_IDS.length,
  packages,
  textChecks,
  scriptChecks,
  taskKindCount: taskKinds.size,
  sharedIndicDandaAllowedInPunjabi: true,
  downstreamGatesLocked: true,
}, null, 2));
