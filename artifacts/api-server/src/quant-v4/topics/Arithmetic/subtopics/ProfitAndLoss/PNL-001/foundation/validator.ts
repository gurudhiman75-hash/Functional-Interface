import type { Money, Rational, VerificationResult } from "./types";

function positiveMoney(name: string, value: Money, errors: string[]) {
  if (value.paise <= 0n) errors.push(`${name} must be positive.`);
}

function positiveRational(name: string, value: Rational, errors: string[]) {
  if (value.denominator <= 0n) errors.push(`${name} must have a positive denominator.`);
  if (value.numerator <= 0n) errors.push(`${name} must be positive.`);
}

function nonNegativeRate(name: string, value: Rational, errors: string[]) {
  if (value.denominator <= 0n) errors.push(`${name} must have a positive denominator.`);
  if (value.numerator < 0n) errors.push(`${name} cannot be negative.`);
}

export function validateFundamentalInput(input: {
  costPrice?: Money;
  sellingPrice?: Money;
  amount?: Money;
  ratePercent?: Rational;
  marginPercent?: Rational;
  profitPercent?: Rational;
  costPart?: Rational;
  sellingPart?: Rational;
  direction?: "PROFIT" | "LOSS";
}): VerificationResult {
  const errors: string[] = [];
  if (input.costPrice) positiveMoney("Cost price", input.costPrice, errors);
  if (input.sellingPrice) positiveMoney("Selling price", input.sellingPrice, errors);
  if (input.amount) positiveMoney("Profit or loss amount", input.amount, errors);
  if (input.ratePercent) {
    nonNegativeRate("Rate", input.ratePercent, errors);
    if (input.direction === "LOSS" && input.ratePercent.numerator >= 100n * input.ratePercent.denominator) {
      errors.push("Loss rate must be below 100% for a positive selling price.");
    }
  }
  if (input.marginPercent) {
    nonNegativeRate("Margin", input.marginPercent, errors);
    if (input.marginPercent.numerator >= 100n * input.marginPercent.denominator) {
      errors.push("Profit margin on selling price must be below 100%.");
    }
  }
  if (input.profitPercent) nonNegativeRate("Profit percentage", input.profitPercent, errors);
  if (input.costPart) positiveRational("Cost-price ratio part", input.costPart, errors);
  if (input.sellingPart) positiveRational("Selling-price ratio part", input.sellingPart, errors);
  return { ok: errors.length === 0, errors };
}

export function validateOptions(options: readonly string[], correctAnswer: string): VerificationResult {
  const errors: string[] = [];
  if (options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(options).size !== options.length) errors.push("Options must be unique.");
  if (!options.includes(correctAnswer)) errors.push("Correct answer must occur in options.");
  return { ok: errors.length === 0, errors };
}
