import type { EcoCp004ReviewQuestion } from "./eco-cp004-review-types";
import { generateEcoCp004ReviewBatchV1 } from "./eco-cp004-review-generator-v1";

function lowerFirst(value: string) {
  return value.length ? value[0].toLowerCase() + value.slice(1) : value;
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function withOptions(question: EcoCp004ReviewQuestion, values: string[]) {
  return moveCorrect([...values], question.canonicalAnswer, question.correctIndex);
}

function reviseStem(question: EcoCp004ReviewQuestion): string {
  const { qlId, stem } = question;

  if (qlId === "ECO-004-QL-003") {
    const description = stem.replace(/ is treated as:$/i, "");
    return `How is ${lowerFirst(description)} classified in national-income measurement?`;
  }

  if (qlId === "ECO-004-QL-004") {
    if (stem.startsWith("A bakery's bread value")) {
      return "What problem arises if the full value of both flour and the bread made from it is counted?";
    }
    if (stem.startsWith("Cotton becomes yarn")) {
      return "What happens if the full values of cotton, yarn and cloth are all added as final output?";
    }
    if (stem.startsWith("If value added is measured")) {
      return "Which problem is mainly avoided by measuring value added separately at each production stage?";
    }
  }

  if (qlId === "ECO-004-QL-005") {
    if (/Value added is:$/.test(stem)) return stem.replace(/Value added is:$/, "What is the value added?");
    if (/Intermediate consumption is:$/.test(stem)) return stem.replace(/Intermediate consumption is:$/, "What is the intermediate consumption?");
    if (/Output is:$/.test(stem)) return stem.replace(/Output is:$/, "What is the output?");
  }

  if (qlId === "ECO-004-QL-006") {
    const description = stem.replace(/ is recorded as:$/i, "");
    return `Under the expenditure method, how is ${lowerFirst(description)} recorded?`;
  }

  if (qlId === "ECO-004-QL-007") {
    if (stem === "Profit-like surplus from production is mainly recorded as:") {
      return "Under the income method, how is profit-like surplus from production recorded?";
    }
    if (stem.startsWith("Income of a self-employed unit")) {
      return "Under the income method, how is income classified when a self-employed unit's labour and capital returns cannot be separated?";
    }
    if (stem.startsWith("A family-run shop")) {
      return "Under the income method, how is the combined return of a family-run shop using the owner's labour and capital classified?";
    }
  }

  if (qlId === "ECO-004-QL-008") {
    if (/GDP is:$/.test(stem)) return stem.replace(/GDP is:$/, "What is GDP?");
  }

  if (qlId === "ECO-004-QL-009" && stem === "A base year is mainly used as:") {
    return "What is the main purpose of a base year in constant-price estimates?";
  }

  if (qlId === "ECO-004-QL-010" && stem === "National Accounts Statistics in India are published by:") {
    return "Which ministry publishes India's National Accounts Statistics?";
  }

  return stem;
}

function reviseOptions(question: EcoCp004ReviewQuestion): string[] {
  if (question.qlId === "ECO-004-QL-003") {
    return withOptions(question, [
      "Final",
      "Intermediate",
      "Depends on its use",
      "Cannot be classified from the information given",
    ]);
  }

  if (question.qlId === "ECO-004-QL-004") {
    if (question.canonicalAnswer === "Double counting") {
      return withOptions(question, [
        "Double counting",
        "Under-counting final output",
        "Depreciation adjustment",
        "Price-base adjustment",
      ]);
    }
    if (question.canonicalAnswer === "Count final goods or value added") {
      return withOptions(question, [
        "Count final goods or value added",
        "Add every sale at every production stage",
        "Count only intermediate goods",
        "Add intermediate and final values in full",
      ]);
    }
    if (question.canonicalAnswer === "Count intermediate output more than once") {
      return withOptions(question, [
        "Count intermediate output more than once",
        "Count only the final product",
        "Count only value added at each stage",
        "Exclude repeated intermediate values",
      ]);
    }
  }

  if (question.qlId === "ECO-004-QL-007") {
    return withOptions(question, [
      "Compensation of employees",
      "Operating surplus",
      "Mixed income",
      "Taxes less subsidies on products",
    ]);
  }

  return [...question.options];
}

export function generateEcoCp004ReviewBatchV2(): EcoCp004ReviewQuestion[] {
  return generateEcoCp004ReviewBatchV1().map((question) => ({
    ...question,
    questionId: question.questionId.replace("ECO-CP004-V1-", "ECO-CP004-V2-"),
    stem: reviseStem(question),
    options: reviseOptions(question),
  }));
}

export const ECO_CP004_REVIEW_V2 = Object.freeze(generateEcoCp004ReviewBatchV2());
