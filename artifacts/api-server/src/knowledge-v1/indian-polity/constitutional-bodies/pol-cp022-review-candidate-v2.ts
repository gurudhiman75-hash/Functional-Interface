import {
  generatePolCp022ReviewBatchV1,
  type PolCp022ReviewQuestion,
} from "./pol-cp022-review-candidate-v1";

function canonicalizeOfficeName(value: string): string {
  return value
    .replaceAll("Attorney General", "Attorney-General")
    .replaceAll("Advocate General for a State", "Advocate-General for the State")
    .replaceAll("Advocate General", "Advocate-General");
}

const qualificationNotes: Readonly<Record<string, string>> = Object.freeze({
  "POL-CP022-V1-003":
    "Article 76 links eligibility to a Supreme Court judge.\nQualifications:\n• Citizen of India\n• At least 5 years as a High Court judge, or\n• At least 10 years as a High Court advocate, or\n• A distinguished jurist in the President's opinion.",
  "POL-CP022-V1-007":
    "Article 165 links eligibility to a High Court judge.\nQualifications:\n• Citizen of India\n• At least 10 years in judicial office in India, or\n• At least 10 years as an advocate of a High Court.",
});

export function generatePolCp022ReviewBatchV2(): PolCp022ReviewQuestion[] {
  return generatePolCp022ReviewBatchV1().map((question) => {
    const enriched = qualificationNotes[question.questionId];
    return {
      ...question,
      questionId: question.questionId.replace("POL-CP022-V1-", "POL-CP022-V2-"),
      stem: canonicalizeOfficeName(question.stem),
      options: question.options.map(canonicalizeOfficeName) as [string, string, string, string],
      explanation: enriched ?? canonicalizeOfficeName(question.explanation),
    };
  });
}
