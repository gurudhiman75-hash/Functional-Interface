import { deepFreeze, type IntCp004QlId } from "./cp004-frequency-math";
import {
  generateIntCp004EnglishExamFriendlyReviewV10,
} from "./cp004-english-exam-friendly-review-v10";

export const INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11 = Object.freeze({
  version: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v11" as const,
  baseVersion: "INT-CP-004-EN-EXAM-FRIENDLY-REVIEW-v10" as const,
  status: "ENGLISH_REMEDIATED_REVIEW_CANDIDATE" as const,
  decimalFreeCommonMistakes: true as const,
  approved: false as const,
  permanentIdentityChanges: false as const,
  questionStudioActivationAuthorized: false as const,
});

function authoredCommonMistake(qlId: IntCp004QlId): string {
  switch (qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
      return "Do not use the annual rate directly for every compounding period; first convert it to the rate for one stated period.";
    case "INT-QL-069":
    case "INT-QL-070":
      return "Do not subtract the interest from the final amount and call the remainder the principal; first undo the complete compounding factor.";
    case "INT-QL-071":
      return "Do not read the observed total growth as the annual rate; first recover the rate for one compounding period.";
    case "INT-QL-072":
      return "Do not treat the number of compounding periods as years; convert periods to time using the stated compounding frequency.";
    case "INT-QL-073":
    case "INT-QL-074":
      return "The rate is already given for one compounding period, so do not divide it by the number of periods in a year again.";
    case "INT-QL-075":
      return "Compare the two maturity amounts under their own compounding schedules; do not compare only the quoted annual rates.";
    case "INT-QL-076":
      return "Effective annual rate is the actual one-year growth after all compounding periods, not merely the quoted nominal annual rate.";
    case "INT-QL-077":
      return "Do not equate the effective annual rate directly to the nominal annual rate; first recover the matching periodic rate.";
    case "INT-QL-078":
      return "Test each allowed compounding schedule against the given amount; do not guess the frequency from the size of the annual rate.";
    case "INT-QL-079":
    case "INT-QL-080":
      return "Compound for the complete years first, then apply simple interest only to the explicitly stated fractional-year tail.";
    case "INT-QL-081":
      return "Undo the whole-year compounding factor and the simple tail factor together; ignoring either part gives the wrong principal.";
    case "INT-QL-082":
      return "The same annual rate affects both the whole-year compounding and the simple tail, so both parts must be satisfied by the recovered rate.";
    case "INT-QL-083":
      return "Do not count the fractional tail as another complete year; identify only the number of fully compounded years.";
    case "INT-QL-084":
    case "INT-QL-085":
      return "Apply each compounding frequency only to its own interval; do not use one frequency for the entire duration.";
  }
}

export function generateIntCp004EnglishExamFriendlyReviewV11(
  qlId: IntCp004QlId,
  seed: string,
) {
  const source = generateIntCp004EnglishExamFriendlyReviewV10(qlId, seed);
  return deepFreeze({
    ...source,
    englishParityVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11.version,
    explanation: {
      ...source.explanation,
      commonMistake: authoredCommonMistake(qlId),
    },
    v11Remediation: {
      baseVersion: INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11.baseVersion,
      decimalFreeCommonMistake: true as const,
      mathematicalStateChanged: false as const,
      permanentIdentityChanged: false as const,
      approvalGranted: false as const,
    },
  });
}
