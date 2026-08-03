import { SAP_CP001_ALL_PROTOTYPE_IDS } from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import { generateSapCp001EnglishCandidate } from "./runtime";
import type { SapCp001EnglishReviewItem } from "./types";

const REVIEW_SEEDS = Object.freeze([1, 2, 3] as const);
const SAMPLE_PURPOSES = Object.freeze([
  "EASY_SAMPLE",
  "MEDIUM_SAMPLE",
  "HARD_SAMPLE",
] as const);

export function generateSapCp001EnglishReviewExport(): readonly SapCp001EnglishReviewItem[] {
  const reviewItems: SapCp001EnglishReviewItem[] = [];
  let reviewOrdinal = 1;
  for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
    for (let index = 0; index < REVIEW_SEEDS.length; index += 1) {
      const candidate = generateSapCp001EnglishCandidate(prototypeId, REVIEW_SEEDS[index]!);
      reviewItems.push(Object.freeze({
        ...candidate,
        reviewOrdinal,
        samplePurpose: SAMPLE_PURPOSES[index]!,
        reviewer: "EXAMTREE_EDITORIAL_AUTHORITY" as const,
      }));
      reviewOrdinal += 1;
    }
  }
  return Object.freeze(reviewItems);
}
