import assert from "node:assert/strict";
import { generateCodCp001Question } from "../COD-CP-001/generator";
import { COD_CP001_QUESTION_LOGICS } from "../COD-CP-001/question-language.en";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { COD_CP002_QUESTION_LOGICS } from "../COD-CP-002/question-language.en";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { COD_CP003_QUESTION_LOGICS } from "../COD-CP-003/question-language.en";
import { generateCodCp004Question } from "../COD-CP-004/generator";
import { COD_CP004_QUESTION_LOGICS } from "../COD-CP-004/question-language.en";
import { generateCodCp005Question } from "../COD-CP-005/generator";
import { COD_CP005_QUESTION_LOGICS } from "../COD-CP-005/question-language.en";
import { generateCodCp006Question } from "../COD-CP-006/generator";
import { COD_CP006_QUESTION_LOGICS } from "../COD-CP-006/question-language.en";
import {
  buildStandardDecodeStem,
  buildStandardEncodeStem,
  buildStandardLetterCodeStem,
  buildStandardMissingTokenStem,
} from "../foundation/standard-exam-stem";

interface QuestionLogicRef {
  qlId: string;
}

interface CheckpointInventory {
  checkpointId: string;
  logics: readonly QuestionLogicRef[];
  generate: (qlId: string, seed: number) => { stem: string };
}

const checkpoints: readonly CheckpointInventory[] = [
  { checkpointId: "COD-CP-001", logics: COD_CP001_QUESTION_LOGICS, generate: generateCodCp001Question },
  { checkpointId: "COD-CP-002", logics: COD_CP002_QUESTION_LOGICS, generate: generateCodCp002Question },
  { checkpointId: "COD-CP-003", logics: COD_CP003_QUESTION_LOGICS, generate: generateCodCp003Question },
  { checkpointId: "COD-CP-004", logics: COD_CP004_QUESTION_LOGICS, generate: generateCodCp004Question },
  { checkpointId: "COD-CP-005", logics: COD_CP005_QUESTION_LOGICS, generate: generateCodCp005Question },
  { checkpointId: "COD-CP-006", logics: COD_CP006_QUESTION_LOGICS, generate: generateCodCp006Question },
];

const forbidden = /study (?:these|the|common)|the following examples|according to (?:this|the) coding pattern|given that|the same (?:rule|coding|letter code|numerical rule|rearrangement)|use the same|apply the same|from these examples|the given examples|using these examples|coding system shown|table follows|two[- ](?:stage|step)/i;
const sampleExamples = "‘BANK’ is coded as ‘CBOJ’ and ‘MIND’ is coded as ‘NJOE’";
const authoritySamples = [
  ...Array.from({ length: 4 }, (_, style) => buildStandardEncodeStem(sampleExamples, "FARM", style)),
  ...Array.from({ length: 4 }, (_, style) => buildStandardDecodeStem(sampleExamples, "GBSN", style)),
  ...Array.from({ length: 4 }, (_, style) => buildStandardMissingTokenStem(sampleExamples, "FARM", "G?SN", "letter", style)),
  ...Array.from({ length: 4 }, (_, style) => buildStandardMissingTokenStem(sampleExamples, "FARM", "7-?-19-14", "number", style)),
  ...Array.from({ length: 4 }, (_, style) => buildStandardLetterCodeStem(sampleExamples, "A", style)),
];

assert.equal(new Set(authoritySamples).size, 20);
for (const stem of authoritySamples) {
  assert.ok(stem.startsWith("In a certain code language, "));
  assert.equal(forbidden.test(stem), false);
  assert.equal(stem.includes("→"), false);
  assert.equal(stem.includes("\n"), false);
  assert.ok(/[?.]$/.test(stem));
}

const inventoryIds = checkpoints.flatMap((checkpoint) => checkpoint.logics.map((logic) => logic.qlId));
assert.equal(inventoryIds.length, 168);
assert.equal(new Set(inventoryIds).size, 168);

let generated = 0;
const checkpointCounts: Record<string, number> = {};

for (const checkpoint of checkpoints) {
  let count = 0;
  for (const logic of checkpoint.logics) {
    for (let seed = 1; seed <= 5; seed += 1) {
      const { stem } = checkpoint.generate(logic.qlId, seed);
      const scope = `${logic.qlId}/${seed}`;
      assert.ok(stem.startsWith("In a certain code language, "), `${scope} lacks the standard exam opening: ${stem}`);
      assert.equal(forbidden.test(stem), false, `${scope} contains non-standard prose: ${stem}`);
      assert.equal(stem.includes("→"), false, `${scope} uses an instructional arrow: ${stem}`);
      assert.equal(stem.includes("\n"), false, `${scope} contains a line break`);
      assert.ok(/[?.]$/.test(stem), `${scope} has invalid terminal punctuation: ${stem}`);
      generated += 1;
      count += 1;
    }
  }
  checkpointCounts[checkpoint.checkpointId] = count;
}

assert.equal(generated, inventoryIds.length * 5);
console.log(JSON.stringify({
  authorityVariants: authoritySamples.length,
  qlInventory: inventoryIds.length,
  generated,
  checkpointCounts,
  opening: "In a certain code language, ...",
  verdict: "PASS — STANDARD COMPETITIVE-EXAM STEM LANGUAGE",
}, null, 2));
