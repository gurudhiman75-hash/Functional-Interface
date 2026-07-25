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
const lineCountDistribution = new Map<number, number>();
const roboticOpening = /^(Check:|Substitution:|Calculation:|Therefore,|Hence,|Thus,|So,|The required quantity is|This value measures|The result is)/i;

for (const entry of getMen001QuestionEntries()) {
  for (let sample = 0; sample < 3; sample += 1) {
    const question = runMen001Pipeline(
      entry.cpId as Men001ActiveCanonicalProblemId,
      {
        language: "en",
        questionLanguageId: entry.qlId,
        seed: `men-001-authorship:${entry.qlId}:${sample}`,
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
      question.explanation.lines.length >= 3 &&
        question.explanation.lines.length <= 9,
      `${entry.qlId} should use only as many lines as its reasoning needs.`,
    );
    assert.equal(
      question.explanation.lines.some((line) => roboticOpening.test(line)),
      false,
      `${entry.qlId} still contains a robotic explanation label or conclusion.`,
    );
    assert.ok(
      question.explanation.lines.some(
        (line) => /\d/.test(line) && /[=×÷+−\-√²π]/.test(line),
      ),
      `${entry.qlId} lost its worked arithmetic.`,
    );

    if (sample === 0) {
      const signature = proseSignature(question.explanation.lines);
      assert.ok(signature.length >= 35, `${entry.qlId} has too little natural prose.`);
      const previousSignature = signatureOwner.get(signature);
      assert.equal(
        previousSignature,
        undefined,
        `${entry.qlId} duplicates the normalized prose signature of ${previousSignature}.`,
      );
      signatureOwner.set(signature, entry.qlId);
      const lineCount = question.explanation.lines.length;
      lineCountDistribution.set(
        lineCount,
        (lineCountDistribution.get(lineCount) ?? 0) + 1,
      );
    }
  }
}

assert.equal(signatureOwner.size, qlIds.length);
assert.ok(
  lineCountDistribution.size >= 3,
  "The chapter should not force every explanation into the same line structure.",
);
console.log(
  `MEN-001 natural explanation authorship passed for ${qlIds.length} QLs with ${signatureOwner.size} unique normalized prose signatures across three states each.`,
);
console.log(
  `Explanation line-count distribution: ${JSON.stringify(Object.fromEntries([...lineCountDistribution].sort(([a], [b]) => a - b)))}`,
);
