import type { GeoPhy001Cp001ReviewQuestion } from "./geo-phy-001-cp001-review-types";

function simplifyText(text: string) {
  return text
    .replace(/major physiographic division of India/gi, "major physical region of India")
    .replace(/major physiographic division/gi, "major physical region")
    .replace(/physiographic divisions/gi, "physical regions")
    .replace(/physiographic division/gi, "physical region");
}

export function simplifyGeoPhy001Cp001QuestionV2(
  question: GeoPhy001Cp001ReviewQuestion,
): GeoPhy001Cp001ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("-V1-", "-V2-"),
    qlName: simplifyText(question.qlName),
    stem: simplifyText(question.stem),
    options: question.options.map(simplifyText),
    canonicalAnswer: simplifyText(question.canonicalAnswer),
    explanation: simplifyText(question.explanation),
  };
}
