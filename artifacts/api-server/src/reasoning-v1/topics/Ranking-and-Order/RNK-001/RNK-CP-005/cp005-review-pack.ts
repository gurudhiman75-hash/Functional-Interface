import {
  RNK_CP005_AUTHORITY_IDS,
  type RnkCp005Question,
} from "./cp005-foundation";
import { generateRnkCp005ExamReadyQuestion } from "./cp005-exam-language-v1";

export const RNK_CP005_REVIEW_SEEDS = [
  0, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17,
] as const;

export function buildRnkCp005EnglishReviewPack(): readonly RnkCp005Question[] {
  return RNK_CP005_AUTHORITY_IDS.flatMap((authorityId) =>
    RNK_CP005_REVIEW_SEEDS.map((seed, index) =>
      generateRnkCp005ExamReadyQuestion(authorityId, seed, index % 4),
    ),
  );
}
