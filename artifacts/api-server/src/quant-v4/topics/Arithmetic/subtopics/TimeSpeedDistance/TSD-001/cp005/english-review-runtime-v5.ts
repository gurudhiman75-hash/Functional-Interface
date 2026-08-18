import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import type { TsdCp005EnglishReviewQuestion } from "./english-review-runtime";
import { generateCp005ReviewQuestionV4 } from "./english-review-runtime-v4";

function ordinalLabel(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1: return `${value}st`;
    case 2: return `${value}nd`;
    case 3: return `${value}rd`;
    default: return `${value}th`;
  }
}

function normalizeNthWording(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  if (question.solveMode !== "findNthMeetingTimeOnLine" && question.solveMode !== "findNthMeetingPointOnLine") return question;
  const n = question.input.nthMeeting;
  if (!n) throw new Error(`${question.solveMode}: V5 nth-meeting input missing n`);
  const stem = question.stem.replace(new RegExp(`\\b${n}th\\b`, "g"), ordinalLabel(n));
  return Object.freeze({ ...question, stem });
}

export function generateCp005ReviewQuestionV5(authorityKey: string, seed: string, ordinal = 0): TsdCp005EnglishReviewQuestion {
  return normalizeNthWording(generateCp005ReviewQuestionV4(authorityKey, seed, ordinal));
}

export function generateCp005ReviewSetV5(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V5 perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV5(authority.authorityKey, `cp005-review-v5:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

export function generateCp005EnglishAuditPoolV5(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V5 audit perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV5(authority.authorityKey, `cp005-audit-v5:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
