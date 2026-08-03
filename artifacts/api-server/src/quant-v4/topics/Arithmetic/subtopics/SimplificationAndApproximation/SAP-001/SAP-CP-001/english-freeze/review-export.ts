import { SAP_CP001_ALL_PROTOTYPE_IDS } from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import { generateSapCp001EnglishCandidate } from "./runtime";
import type {
  SapCp001EnglishDifficulty,
  SapCp001EnglishReviewItem,
} from "./types";

const REVIEW_BANDS = Object.freeze([
  { difficulty: "EASY", purpose: "EASY_SAMPLE" },
  { difficulty: "MEDIUM", purpose: "MEDIUM_SAMPLE" },
  { difficulty: "HARD", purpose: "HARD_SAMPLE" },
] as const satisfies readonly {
  readonly difficulty: SapCp001EnglishDifficulty;
  readonly purpose: SapCp001EnglishReviewItem["samplePurpose"];
}[]);

export function generateSapCp001EnglishReviewExport(): readonly SapCp001EnglishReviewItem[] {
  const reviewItems: SapCp001EnglishReviewItem[] = [];
  let reviewOrdinal = 1;

  for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
    const usedFingerprints = new Set<string>();
    for (const band of REVIEW_BANDS) {
      let selected = null as ReturnType<typeof generateSapCp001EnglishCandidate> | null;
      for (let seed = 1; seed <= 300; seed += 1) {
        const candidate = generateSapCp001EnglishCandidate(prototypeId, seed);
        if (candidate.difficulty !== band.difficulty) continue;
        if (usedFingerprints.has(candidate.technicalDetails.mathematicalFingerprint)) continue;
        selected = candidate;
        break;
      }
      if (!selected) {
        throw new Error(`Unable to find a distinct ${band.difficulty} review sample for ${prototypeId}.`);
      }
      usedFingerprints.add(selected.technicalDetails.mathematicalFingerprint);
      reviewItems.push(Object.freeze({
        ...selected,
        reviewOrdinal,
        samplePurpose: band.purpose,
        reviewer: "EXAMTREE_EDITORIAL_AUTHORITY" as const,
      }));
      reviewOrdinal += 1;
    }
  }

  return Object.freeze(reviewItems);
}
