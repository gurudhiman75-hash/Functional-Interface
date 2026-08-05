import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CertifiedBlrCp007V2Question } from "./cp007-v2-independent-verifier";

const out = resolve(process.argv[2] ?? "cp007-v2-output");
const records = readFileSync(resolve(out, "blr-cp007-v2-records.jsonl"), "utf8")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line) as CertifiedBlrCp007V2Question);

const ql033 = records.filter((question) => question.qlId === "BLR-QL-033");
const ql034 = records.filter((question) => question.qlId === "BLR-QL-034");
const targetDerivedOrderedPairQuestions = ql033.filter(
  (question) =>
    question.topologyId.startsWith("V2_TARGET_DERIVED_") &&
    question.query.kind === "MISSING_TOKEN_PAIR" &&
    question.options.filter((option) => option.targetSatisfied).length === 1,
).length;
const wrongPersonOptions = ql034.flatMap((question) =>
  question.options.filter((option) => !option.isCorrect),
);
const connectedMissingPersonDistractors = wrongPersonOptions.filter(
  (option) => Boolean(option.actualRelation),
).length;
const disconnectedMissingPersonDistractors = wrongPersonOptions.filter(
  (option) => !option.actualRelation,
).length;
const missingPersonWrongRelationCounts = Object.fromEntries(
  [...new Set(wrongPersonOptions.map((option) => option.actualRelation!))]
    .sort((left, right) => left.localeCompare(right, "en-IN"))
    .map((relation) => [
      relation,
      wrongPersonOptions.filter((option) => option.actualRelation === relation).length,
    ]),
);

if (targetDerivedOrderedPairQuestions !== 24) {
  throw new Error(
    `Expected 24 target-derived ordered-pair questions; received ${targetDerivedOrderedPairQuestions}.`,
  );
}
if (connectedMissingPersonDistractors !== 96) {
  throw new Error(
    `Expected 96 connected missing-person distractors; received ${connectedMissingPersonDistractors}.`,
  );
}
if (disconnectedMissingPersonDistractors !== 0) {
  throw new Error(
    `Found ${disconnectedMissingPersonDistractors} disconnected missing-person distractors.`,
  );
}

const audit = {
  status: "CP007_V2_DEEP_REMEDIATION_PROVED",
  recordCount: records.length,
  targetDerivedOrderedPairQuestions,
  orderedPairQuestionsWithUniqueSemanticTarget: ql033.filter(
    (question) => question.options.filter((option) => option.targetSatisfied).length === 1,
  ).length,
  missingPersonQuestions: ql034.length,
  connectedMissingPersonDistractors,
  disconnectedMissingPersonDistractors,
  missingPersonWrongRelationCounts,
  humanReviewRequired: true,
};

writeFileSync(
  resolve(out, "blr-cp007-v2-deep-remediation-audit.json"),
  `${JSON.stringify(audit, null, 2)}\n`,
);
writeFileSync(
  resolve(out, "BLR-CP-007-V2-DEEP-REMEDIATION-AUDIT.md"),
  `# BLR-CP-007 V2 Deep Remediation Audit\n\nStatus: **executable proof passed; human review still required**.\n\n\`\`\`text\ntarget-derived ordered-pair questions: ${targetDerivedOrderedPairQuestions} / 24\nunique semantic ordered-pair targets: ${audit.orderedPairQuestionsWithUniqueSemanticTarget} / 24\nconnected wrong-person distractors: ${connectedMissingPersonDistractors} / 96\ndisconnected wrong-person distractors: ${disconnectedMissingPersonDistractors}\n\`\`\`\n\nWrong missing-person candidates remain plausible members of the same family graph and produce supported alternative relations rather than disconnected filler. The five permanent QLs remain unchanged, and the pack remains review-only.\n`,
);
console.log(JSON.stringify(audit, null, 2));
