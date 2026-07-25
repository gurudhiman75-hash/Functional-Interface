import assert from "node:assert/strict";
import { generateCodCp001Question } from "../COD-CP-001/generator";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { generateCodCp004Question } from "../COD-CP-004/generator";
import { generateCodCp005Question } from "../COD-CP-005/generator";
import { generateCodCp006Question } from "../COD-CP-006/generator";

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
const allowedQuestionEndings = [
  /How will ‘[^’]+’ be coded\?$/,
  /What is the code for ‘[^’]+’\?$/,
  /Which of the following is the correct code for ‘[^’]+’\?$/,
  /‘[^’]+’ will be coded as which of the following\?$/,
  /Which word is coded as ‘[^’]+’\?$/,
  /‘[^’]+’ is the code for which word\?$/,
  /What is the original word for the code ‘[^’]+’\?$/,
  /Which of the following words is represented by ‘[^’]+’\?$/,
  /If ‘[^’]+’ is coded as ‘[^’]+’, what will replace ‘\?’\?$/,
  /The code for ‘[^’]+’ is ‘[^’]+’\. Which (?:letter|number) replaces ‘\?’\?$/,
  /Find the missing (?:letter|number) in the code ‘[^’]+’ for ‘[^’]+’\.$/,
  /What should replace ‘\?’ in ‘[^’]+’, the code for ‘[^’]+’\?$/,
  /What is the code for the letter ‘[^’]+’\?$/,
  /Which code represents the letter ‘[^’]+’\?$/,
  /The letter ‘[^’]+’ is represented by which code\?$/,
  /Which of the following is the code for the letter ‘[^’]+’\?$/,
];

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
      assert.ok(allowedQuestionEndings.some((pattern) => pattern.test(stem)), `${scope} has a non-standard question ending: ${stem}`);
      generated += 1;
      count += 1;
    }
  }
  checkpointCounts[checkpoint.checkpointId] = count;
}

assert.equal(generated, 168 * 5);
console.log(JSON.stringify({
  generated,
  checkpointCounts,
  opening: "In a certain code language, ...",
  verdict: "PASS — STANDARD COMPETITIVE-EXAM STEM LANGUAGE",
}, null, 2));
