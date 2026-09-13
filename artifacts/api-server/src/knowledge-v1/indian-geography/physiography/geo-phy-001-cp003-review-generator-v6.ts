import { generateGeoPhy001Cp003ReviewBatchV5 } from "./geo-phy-001-cp003-review-generator-v5";
import type { GeoPhy001Cp003ReviewQuestion } from "./geo-phy-001-cp003-review-types";

const ql019Stems = [
  "The Indus, Ganga and Brahmaputra river systems deposited alluvium to form which plain?",
  "Which plain is mainly made of alluvium deposited by rivers?",
  "Which plain is known for fertile alluvial soil and plenty of river water?",
  "Bhabar, Terai, Bhangar and Khadar are parts of which plain?",
  "Punjab, Ganga and Brahmaputra Plains together form which larger plain?",
  "Which plain was formed mainly by river deposits rather than old crystalline rocks?",
] as const;

const ql020Stems = [
  "Which plain forms the western part of the Northern Plains and is linked with the Indus system?",
  "Doabs are especially common in which plain?",
  "Which plain lies between the Ghaggar and Teesta rivers?",
  "Which plain is mainly drained by the Ganga and its tributaries?",
  "Which plain lies mainly in Assam?",
  "Which plain forms the eastern part of the Northern Plains?",
] as const;

function localIndex(questionId: string) {
  const match = questionId.match(/-(\d{3})$/);
  if (!match) throw new Error(`Cannot read question index from ${questionId}`);
  return (Number(match[1]) - 1) % 6;
}

function simplifyExplanation(text: string) {
  return text
    .replace(/physiographic division/gi, "plain")
    .replace(/physiographic region/gi, "area")
    .replace(/regional division/gi, "plain")
    .replace(/regional section/gi, "part")
    .replace(/major section/gi, "part")
    .replace(/central section/gi, "central part")
    .replace(/western section/gi, "western part")
    .replace(/eastern section/gi, "eastern part")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function generateGeoPhy001Cp003ReviewBatchV6(): GeoPhy001Cp003ReviewQuestion[] {
  return generateGeoPhy001Cp003ReviewBatchV5().map((question) => {
    const index = localIndex(question.questionId);
    let stem = question.stem;
    if (question.qlId === "GEO-PHY-001-QL-019") stem = ql019Stems[index]!;
    if (question.qlId === "GEO-PHY-001-QL-020") stem = ql020Stems[index]!;

    return {
      ...question,
      questionId: question.questionId.replace("-V5-", "-V6-"),
      stem,
      explanation: simplifyExplanation(question.explanation),
    };
  });
}
