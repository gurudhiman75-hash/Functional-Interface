import assert from "node:assert/strict";
import { generateCodCp001Question } from "../COD-CP-001/generator";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { generateCodCp004Question } from "../COD-CP-004/generator";
import { generateCodCp005Question } from "../COD-CP-005/generator";
import { generateCodCp006Question } from "../COD-CP-006/generator";
import {
  buildStandardDecodeStem,
  buildStandardEncodeStem,
  buildStandardLetterCodeStem,
  buildStandardMissingTokenStem,
} from "../foundation/standard-exam-stem";

interface CheckpointRange {
  checkpointId: string;
  start: number;
  end: number;
  generate: (qlId: string, seed: number) => { stem: string };
}

const checkpoints: readonly CheckpointRange[] = [
  { checkpointId: "COD-CP-001", start: 1, end: 36, generate: generateCodCp001Question },
  { checkpointId: "COD-CP-002", start: 37, end: 72, generate: generateCodCp002Question },
  { checkpointId: "COD-CP-003", start: 73, end: 88, generate: generateCodCp003Question },
  { checkpointId: "COD-CP-004", start: 89, end: 112, generate: generateCodCp004Question },
  { checkpointId: "COD-CP-005", start: 113, end: 136, generate: generateCodCp005Question },
  { checkpointId: "COD-CP-006", start: 137, end: 168, generate: generateCodCp006Question },
];

const forbidden = /study\b|following examples|coding pattern|according to|given that|same (?:rule|coding|letter code|numerical rule|rearrangement)|use the same|apply the same|from these examples|the given examples|using these examples|coding system shown|table follows|two[- ](?:stage|step)/i;
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

let generated = 0;
const checkpointCounts: Record<string, number> = {};

for (const checkpoint of checkpoints) {
  let count = 0;
  for (let qlNumber = checkpoint.start; qlNumber <= checkpoint.end; qlNumber += 1) {
    const qlId = `COD-QL-${String(qlNumber).padStart(3, "0")}`;
    for (let seed = 1; seed <= 5; seed += 1) {
      const { stem } = checkpoint.generate(qlId, seed);
      const scope = `${qlId}/${seed}`;
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

assert.equal(generated, 168 * 5);
console.log(JSON.stringify({
  authorityVariants: authoritySamples.length,
  generated,
  checkpointCounts,
  opening: "In a certain code language, ...",
  verdict: "PASS — STANDARD COMPETITIVE-EXAM STEM LANGUAGE",
}, null, 2));
