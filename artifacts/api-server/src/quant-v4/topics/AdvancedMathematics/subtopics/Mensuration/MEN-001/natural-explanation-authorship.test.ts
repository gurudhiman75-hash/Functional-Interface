import { strict as assert } from "node:assert";
import {
  getMen001QuestionEntries,
  getMen001QuestionLanguageIds,
} from "./library";
import {
  getMen001NaturalExplanationProfileIds,
} from "./natural-explanation-authorship";
import { runMen001Pipeline } from "./pipeline";
import type { Men001ActiveCanonicalProblemId } from "./types";

function proseSignature(lines: readonly string[]) {
  return lines
    .join(" ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/₹\/m²|₹\/m|cm²|m²|cm|revolutions|tiles|degrees?/gi, " ")
    .replace(/[0-9π√²°₹×÷=+−\-/:()[\]{}.,;!?]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const qlIds = getMen001QuestionLanguageIds().sort();
const profileIds = getMen001NaturalExplanationProfileIds().sort();
assert.deepEqual(
  profileIds,
  qlIds,
  "Every active QL must have exactly one natural explanation profile.",
);

const signatureOwner = new Map<string, string>();
const openingOwner = new Map<string, string>();
const genericPadding = /^(Check:|The required quantity is|This value measures|The result is|Multiplying this unit rate|The count refers)/;

for (const entry of getMen001QuestionEntries()) {
  const question = runMen001Pipeline(
    entry.cpId as Men001ActiveCanonicalProblemId,
    {
      language: "en",
      questionLanguageId: entry.qlId,
      seed: `men-001-authorship:${entry.qlId}`,
    },
  );
  assert.equal(
    question.validation.valid,
    true,
    question.validation.checks
      .filter((item) => !item.passed)
      .map((item) => `${item.name}: ${item.message}`)
      .join("; "),
  );
  assert.ok(
    question.explanation.lines.length >= 4 &&
      question.explanation.lines.length <= 9,
    `${entry.qlId} should remain concise and complete.`,
  );
  assert.equal(
    question.explanation.lines.some((line) => genericPadding.test(line)),
    false,
    `${entry.qlId} still contains generic explanation padding.`,
  );

  const opening = question.explanation.lines[0]!.toLowerCase();
  const previousOpening = openingOwner.get(opening);
  assert.equal(
    previousOpening,
    undefined,
    `${entry.qlId} repeats the authored opening used by ${previousOpening}.`,
  );
  openingOwner.set(opening, entry.qlId);

  const signature = proseSignature(question.explanation.lines);
  assert.ok(signature.length >= 40, `${entry.qlId} has too little natural prose.`);
  const previousSignature = signatureOwner.get(signature);
  assert.equal(
    previousSignature,
    undefined,
    `${entry.qlId} duplicates the normalized prose signature of ${previousSignature}.`,
  );
  signatureOwner.set(signature, entry.qlId);
}

assert.equal(signatureOwner.size, qlIds.length);
console.log(
  `MEN-001 natural explanation authorship passed for ${qlIds.length} QLs with ${signatureOwner.size} unique normalized prose signatures.`,
);
