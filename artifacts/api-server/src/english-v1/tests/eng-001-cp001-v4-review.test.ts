import { readFileSync } from "node:fs";
import { buildEng001Cp001ReviewV4Markdown } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-review-v4-export";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function firstMismatch(expected: string, actual: string): string {
  const limit = Math.min(expected.length, actual.length);
  let index = 0;
  while (index < limit && expected[index] === actual[index]) index += 1;
  if (index === limit && expected.length === actual.length) return "none";
  const start = Math.max(0, index - 80);
  const end = index + 160;
  return `index=${index}\nexpected=${JSON.stringify(expected.slice(start, end))}\nactual=${JSON.stringify(actual.slice(start, end))}`;
}

const review = buildEng001Cp001ReviewV4Markdown();
assert(review.includes("REVIEW_READY_V4__PRODUCTION_SCALE_DIVERSITY"), "V4 review status is missing.");
assert(review.includes("## Easy") && review.includes("## Medium") && review.includes("## Hard"), "V4 review difficulty sections are incomplete.");
assert((review.match(/^### \d+\./gm) ?? []).length === 60, "V4 review must contain exactly 60 generated questions.");
assert((review.match(/Domains represented in this section: 20\./g) ?? []).length === 3, "Every V4 review section must reach all 20 semantic domains.");
assert(review.includes("canonical candidate variants"), "V4 review must report canonical capacity.");
assert(!review.includes("domain:"), "V4 review must show human-readable domains rather than internal tags.");

const frozenPath = "artifacts/api-server/src/english-v1/chapters/error-spotting/ENG-001/CP001/ENG-001-CP001-REVIEW-V4.md";
const frozenReview = readFileSync(frozenPath, "utf8");
if (frozenReview !== review) {
  console.log("=== ENG001_CP001_V4_REGENERATED_REVIEW_BEGIN ===");
  console.log(review);
  console.log("=== ENG001_CP001_V4_REGENERATED_REVIEW_END ===");
  throw new Error(`Frozen ENG-001-CP001 V4 review is stale. Regenerate it from the deterministic exporter.\n${firstMismatch(review, frozenReview)}`);
}

console.log("ENG-001-CP001 V4 review export/freeze tests passed.");
