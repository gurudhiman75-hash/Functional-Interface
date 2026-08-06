import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP003_ENGLISH_RELEASE,
  MAL_CP003_PERMANENT_ALLOCATION,
  MAL_CP003_PERMANENT_QL_IDS,
  runMalCp003EnglishReleasePipeline,
} from "./foundation/cp003-permanent-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

assert(MAL_CP003_PERMANENT_QL_IDS.length === 9, "Permanent QL count changed.");
assert(MAL_CP003_PERMANENT_QL_IDS[0] === "MAL-QL-029", "First permanent QL changed.");
assert(MAL_CP003_PERMANENT_QL_IDS.at(-1) === "MAL-QL-037", "Last permanent QL changed.");
assert(MAL_CP003_ENGLISH_RELEASE.status === "FROZEN", "English release is not frozen.");
assert(MAL_CP003_ENGLISH_RELEASE.releaseId === "MAL-CP003-EN-v2", "Editorial V2 did not supersede V1.");
assert(MAL_CP003_ENGLISH_RELEASE.supersedesReleaseId === "MAL-CP003-EN-v1", "V1 supersession is absent.");

const reviewRows: unknown[] = [];
let generatedCount = 0;
for (const allocation of MAL_CP003_PERMANENT_ALLOCATION) {
  for (let index = 0; index < 4; index += 1) {
    const seed = `mal-cp003-wave13-compatibility:${allocation.qlId}:${index}`;
    const first = runMalCp003EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const replay = runMalCp003EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(stable(first) === stable(replay), `${allocation.qlId}/${seed}: deterministic replay failed.`);
    assert(first.permanentQlId === allocation.qlId, "Permanent identity changed.");
    assert(first.canonicalProblemId === "MAL-CP-003", "Canonical problem changed.");
    assert(first.reviewStatus === "APPROVED_EDITORIAL_ENGLISH_V2", "Editorial V2 status is absent.");
    assert(first.validation.ok && first.validation.valid, "V2 package validation failed.");
    assert(first.options.length === 4 && new Set(first.options).size === 4, "Option contract regressed.");
    assert(first.options[first.correctIndex] === first.answer, "Correct option contract regressed.");
    reviewRows.push({ qlId: allocation.qlId, familyId: allocation.familyId, question: first });
    generatedCount += 1;
  }
}

assert(generatedCount === 36, "Expected 36 Wave 13 compatibility questions.");
const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(
  resolve(outputDirectory, "mal-cp003-permanent-english-wave13-review.json"),
  stable({
    status: "PASS_MAL_CP003_WAVE13_IDENTITY_COMPATIBILITY_UNDER_EDITORIAL_V2",
    releaseId: MAL_CP003_ENGLISH_RELEASE.releaseId,
    qlRange: MAL_CP003_ENGLISH_RELEASE.qlRange,
    reviewRows,
  }),
  "utf8",
);
writeFileSync(
  resolve(outputDirectory, "mal-cp003-permanent-english-wave13-review.md"),
  [
    "# MAL-CP-003 Wave 13 Identity Compatibility",
    "",
    "Status: **PASS_MAL_CP003_WAVE13_IDENTITY_COMPATIBILITY_UNDER_EDITORIAL_V2**",
    "",
    "The permanent QL range remains MAL-QL-029..MAL-QL-037. Student-facing packages now use the superseding MAL-CP003-EN-v2 editorial runtime.",
  ].join("\n"),
  "utf8",
);
console.log(JSON.stringify({
  status: "PASS_MAL_CP003_WAVE13_IDENTITY_COMPATIBILITY_UNDER_EDITORIAL_V2",
  releaseId: MAL_CP003_ENGLISH_RELEASE.releaseId,
  qlRange: MAL_CP003_ENGLISH_RELEASE.qlRange,
  generatedCount,
}, null, 2));
