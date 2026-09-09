import { buildEng001Cp001ReviewV4Markdown } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-review-v4-export";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const review = buildEng001Cp001ReviewV4Markdown();
assert(review.includes("REVIEW_READY_V4__PRODUCTION_SCALE_DIVERSITY"), "V4 review status is missing.");
assert(review.includes("## Easy") && review.includes("## Medium") && review.includes("## Hard"), "V4 review difficulty sections are incomplete.");
assert((review.match(/^### \d+\./gm) ?? []).length === 60, "V4 review must contain exactly 60 generated questions.");
assert((review.match(/Domains represented in this section: 20\./g) ?? []).length === 3, "Every V4 review section must reach all 20 semantic domains.");
assert(review.includes("canonical candidate variants"), "V4 review must report canonical capacity." );
assert(!review.includes("domain:"), "V4 review must show human-readable domains rather than internal tags.");

console.log("ENG-001-CP001 V4 review export tests passed.");
