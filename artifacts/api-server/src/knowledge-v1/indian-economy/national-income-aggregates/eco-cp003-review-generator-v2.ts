import type { EcoCp003ReviewQuestion } from "./eco-cp003-review-types";
import { generateEcoCp003ReviewBatchV1 } from "./eco-cp003-review-generator-v1";

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function samePositionOptions(question: EcoCp003ReviewQuestion, values: string[]) {
  return moveCorrect([...values], question.canonicalAnswer, question.correctIndex);
}

function reviseStem(question: EcoCp003ReviewQuestion) {
  const id = Number(question.questionId.split("-").pop());

  if (id === 11) return "Which aggregate is obtained after deducting depreciation from GDP?";
  if (id === 12) return "Which aggregate is obtained after deducting depreciation from GNP?";
  if (id === 13) return "Which aggregate is obtained by adding net factor income from abroad to GDP?";
  if (id === 16) return "Which adjustment makes GNP differ from GDP?";
  if (id === 17) return "What is GDP measured at current prices called?";
  if (id === 18) return "What is GDP measured at constant prices called?";

  if (id >= 21 && id <= 24) {
    const match = question.stem.match(/National income is ([\d,]+) and population is ([\d,]+)/i);
    if (match) return `If national income is ${match[1]} and population is ${match[2]}, what is per-capita income?`;
  }

  if (id >= 25 && id <= 27) {
    const match = question.stem.match(/Output is ([\d,]+) and intermediate inputs are ([\d,]+)/i);
    if (match) return `If output is ${match[1]} and intermediate inputs are ${match[2]}, what is value added?`;
  }

  if (id >= 28 && id <= 32) {
    let match = question.stem.match(/GDP is ([\d,]+) and depreciation is ([\d,]+)\. NDP is:/i);
    if (match) return `If GDP is ${match[1]} and depreciation is ${match[2]}, what is NDP?`;
    match = question.stem.match(/GDP is ([\d,]+) and NFIA is ([\d,]+)\. GNP is:/i);
    if (match) return `If GDP is ${match[1]} and NFIA is ${match[2]}, what is GNP?`;
    match = question.stem.match(/GNP is ([\d,]+) and depreciation is ([\d,]+)\. NNP is:/i);
    if (match) return `If GNP is ${match[1]} and depreciation is ${match[2]}, what is NNP?`;
    match = question.stem.match(/National income is ([\d,]+) and population is ([\d,]+)\. Per-capita income is:/i);
    if (match) return `If national income is ${match[1]} and population is ${match[2]}, what is per-capita income?`;
    match = question.stem.match(/Output is worth ([\d,]+) and intermediate inputs cost ([\d,]+)\. Value added is:/i);
    if (match) return `If output is ${match[1]} and intermediate inputs cost ${match[2]}, what is value added?`;
  }

  if (id === 42) return "In the traditional exam relationship, how is market price obtained from factor cost?";
  if (id === 43) return "How are net indirect taxes calculated?";
  if (id === 44) return "If factor cost is 400 and net indirect taxes are 30, what is market price?";

  return question.stem;
}

function reviseOptions(question: EcoCp003ReviewQuestion) {
  const id = Number(question.questionId.split("-").pop());

  if ([14, 16].includes(id)) {
    return samePositionOptions(question, [
      "Net factor income from abroad",
      "Depreciation",
      "Net indirect taxes",
      "Intermediate consumption",
    ]);
  }

  if (id === 42) {
    return samePositionOptions(question, [
      "Factor cost + Net indirect taxes",
      "Factor cost - Net indirect taxes",
      "Factor cost + Depreciation",
      "Factor cost + NFIA",
    ]);
  }

  if (id === 43) {
    return samePositionOptions(question, [
      "Indirect taxes - Subsidies",
      "Indirect taxes + Subsidies",
      "Subsidies - Indirect taxes",
      "Indirect taxes - Depreciation",
    ]);
  }

  return [...question.options];
}

function reviseExplanation(question: EcoCp003ReviewQuestion) {
  const id = Number(question.questionId.split("-").pop());

  if (id === 11) return "NDP is the net domestic measure. It is obtained by deducting depreciation from GDP.";
  if (id === 12) return "NNP is the net national measure. It is obtained by deducting depreciation from GNP.";
  if ([13, 14, 15, 16].includes(id)) return "NFIA adjusts a domestic aggregate to the corresponding national aggregate. Therefore, GNP = GDP + NFIA.";
  if ([17, 19].includes(id)) return "Nominal GDP values output at current prices.";
  if ([18, 20].includes(id)) return "Real GDP values output at constant prices, reducing the effect of price changes.";
  if (id === 42) return "In the traditional exam relationship, market price equals factor cost plus net indirect taxes.";
  if (id === 43) return "Net indirect taxes are indirect taxes after subtracting subsidies.";
  if (id === 44) return "Market price = factor cost + net indirect taxes. So, 400 + 30 = 430.";

  return question.explanation;
}

export function generateEcoCp003ReviewBatchV2(): EcoCp003ReviewQuestion[] {
  return generateEcoCp003ReviewBatchV1().map((question) => ({
    ...question,
    questionId: question.questionId.replace("-V1-", "-V2-"),
    stem: reviseStem(question),
    options: reviseOptions(question),
    explanation: reviseExplanation(question),
  }));
}

export const ECO_CP003_REVIEW_V2 = generateEcoCp003ReviewBatchV2();
