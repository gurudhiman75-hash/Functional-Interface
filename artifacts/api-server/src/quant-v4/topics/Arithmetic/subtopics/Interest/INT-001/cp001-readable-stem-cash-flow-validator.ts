import type { IntCp001CashFlowDirection } from "./cp001-cash-flow-direction";
import type { IntCp001ReadableLanguage } from "./cp001-readable-stem-release";

const INTEREST_SENSITIVE_CONTRACTS = new Set([
  "FIND_SIMPLE_INTEREST_FROM_PRT",
  "FIND_PRINCIPAL_FROM_INTEREST",
  "FIND_RATE_FROM_INTEREST",
  "FIND_TIME_FROM_INTEREST",
  "FIND_INTEREST_FOR_TARGET_DURATION",
  "FIND_TIME_FROM_INTEREST_RATIO",
  "FIND_RATE_FROM_INTEREST_RATIO",
  "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS",
  "FIND_INTEREST_RATIO_FROM_RATE_TIME",
]);

const AMOUNT_SENSITIVE_CONTRACTS = new Set([
  "FIND_AMOUNT_FROM_PRT",
  "FIND_PRINCIPAL_FROM_AMOUNT",
  "FIND_RATE_FROM_AMOUNT",
  "FIND_TIME_FROM_AMOUNT",
  "FIND_RATE_FROM_AMOUNT_MULTIPLE",
  "FIND_TIME_FROM_AMOUNT_MULTIPLE",
  "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS",
  "FIND_PRINCIPAL_FROM_TWO_AMOUNTS",
  "FIND_RATE_FROM_TWO_AMOUNTS",
  "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO",
  "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME",
  "FIND_AMOUNT_AT_ANOTHER_TIME",
  "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO",
]);

function validateHindi(
  stem: string,
  solveContract: string,
  direction: IntCp001CashFlowDirection,
): string[] {
  const errors: string[] = [];
  const borrowerInterest = /(?:ब्याज देना होगा|ब्याज चुकाया|ब्याज देना पड़ा|देय (?:साधारण )?ब्याज)/u;
  const investorInterest = /(?:ब्याज मिलेगा|ब्याज मिला|मिलने वाला (?:साधारण )?ब्याज|अर्जित (?:साधारण )?ब्याज|ब्याज अर्जित)/u;
  const borrowerAmount = /(?:कुल )?देय राशि/u;
  const investorAmount = /कुल राशि/u;

  if (direction === "BORROWER_PAYS") {
    if (investorInterest.test(stem)) {
      errors.push("Hindi borrowing stem presents interest as received or earned.");
    }
    if (/राशि .*प्राप्त होगी/u.test(stem)) {
      errors.push("Hindi borrowing stem presents the amount as received.");
    }
    if (INTEREST_SENSITIVE_CONTRACTS.has(solveContract) && !borrowerInterest.test(stem)) {
      errors.push("Hindi borrowing stem lacks an explicit pay/payable-interest phrase.");
    }
    if (AMOUNT_SENSITIVE_CONTRACTS.has(solveContract) && !borrowerAmount.test(stem)) {
      errors.push("Hindi borrowing amount stem lacks explicit payable-amount wording.");
    }
  } else if (direction === "INVESTOR_EARNS") {
    if (borrowerInterest.test(stem) || borrowerAmount.test(stem)) {
      errors.push("Hindi investment stem presents interest or amount as payable.");
    }
    if (INTEREST_SENSITIVE_CONTRACTS.has(solveContract) && !investorInterest.test(stem)) {
      errors.push("Hindi investment stem lacks an explicit receive/earn-interest phrase.");
    }
    if (AMOUNT_SENSITIVE_CONTRACTS.has(solveContract) && !investorAmount.test(stem)) {
      errors.push("Hindi investment amount stem lacks an explicit total-amount phrase.");
    }
  } else if (borrowerInterest.test(stem) || investorInterest.test(stem) || borrowerAmount.test(stem)) {
    errors.push("Hindi neutral stem contains directional financial language.");
  }

  return errors;
}

function validatePunjabi(
  stem: string,
  solveContract: string,
  direction: IntCp001CashFlowDirection,
): string[] {
  const errors: string[] = [];
  const borrowerInterest = /(?:ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ|ਵਿਆਜ ਦਿੱਤਾ|ਵਿਆਜ ਦੇਣਾ ਪਿਆ|ਦੇਣਾ ਪੈਣ ਵਾਲਾ (?:ਸਧਾਰਣ )?ਵਿਆਜ)/u;
  const investorInterest = /(?:ਵਿਆਜ ਮਿਲੇਗਾ|ਵਿਆਜ ਮਿਲਿਆ|ਮਿਲਣ ਵਾਲਾ (?:ਸਧਾਰਣ )?ਵਿਆਜ)/u;
  const borrowerAmount = /(?:ਕੁੱਲ )?ਦੇਣ ਵਾਲੀ ਰਕਮ/u;
  const investorAmount = /ਕੁੱਲ ਰਕਮ/u;

  if (direction === "BORROWER_PAYS") {
    if (investorInterest.test(stem)) {
      errors.push("Punjabi borrowing stem presents interest as received.");
    }
    if (/ਰਕਮ .*ਮਿਲੇਗੀ/u.test(stem)) {
      errors.push("Punjabi borrowing stem presents the amount as received.");
    }
    if (INTEREST_SENSITIVE_CONTRACTS.has(solveContract) && !borrowerInterest.test(stem)) {
      errors.push("Punjabi borrowing stem lacks an explicit pay/payable-interest phrase.");
    }
    if (AMOUNT_SENSITIVE_CONTRACTS.has(solveContract) && !borrowerAmount.test(stem)) {
      errors.push("Punjabi borrowing amount stem lacks explicit amount-to-pay wording.");
    }
  } else if (direction === "INVESTOR_EARNS") {
    if (borrowerInterest.test(stem) || borrowerAmount.test(stem)) {
      errors.push("Punjabi investment stem presents interest or amount as payable.");
    }
    if (INTEREST_SENSITIVE_CONTRACTS.has(solveContract) && !investorInterest.test(stem)) {
      errors.push("Punjabi investment stem lacks an explicit receive-interest phrase.");
    }
    if (AMOUNT_SENSITIVE_CONTRACTS.has(solveContract) && !investorAmount.test(stem)) {
      errors.push("Punjabi investment amount stem lacks an explicit total-amount phrase.");
    }
  } else if (borrowerInterest.test(stem) || investorInterest.test(stem) || borrowerAmount.test(stem)) {
    errors.push("Punjabi neutral stem contains directional financial language.");
  }

  return errors;
}

function validateEnglish(
  stem: string,
  solveContract: string,
  direction: IntCp001CashFlowDirection,
): string[] {
  const errors: string[] = [];
  const borrowerInterest = /(?:must be paid as interest|paid as interest|interest (?:is payable|must be paid|payable))/iu;
  const investorInterest = /(?:will be earned as interest|earned as interest|interest (?:is earned|will be earned|earned))/iu;
  const borrowerAmount = /total amounts? payable/iu;
  const investorAmount = /\bamounts?\b/iu;

  if (direction === "BORROWER_PAYS") {
    if (investorInterest.test(stem)) {
      errors.push("English borrowing stem presents interest as earned.");
    }
    if (INTEREST_SENSITIVE_CONTRACTS.has(solveContract) && !borrowerInterest.test(stem)) {
      errors.push("English borrowing stem lacks an explicit pay/payable-interest phrase.");
    }
    if (AMOUNT_SENSITIVE_CONTRACTS.has(solveContract) && !borrowerAmount.test(stem)) {
      errors.push("English borrowing amount stem lacks explicit payable-amount wording.");
    }
  } else if (direction === "INVESTOR_EARNS") {
    if (borrowerInterest.test(stem) || borrowerAmount.test(stem)) {
      errors.push("English investment stem presents interest or amount as payable.");
    }
    if (INTEREST_SENSITIVE_CONTRACTS.has(solveContract) && !investorInterest.test(stem)) {
      errors.push("English investment stem lacks an explicit earn-interest phrase.");
    }
    if (AMOUNT_SENSITIVE_CONTRACTS.has(solveContract) && !investorAmount.test(stem)) {
      errors.push("English investment amount stem lacks an amount phrase.");
    }
  } else if (borrowerInterest.test(stem) || investorInterest.test(stem) || borrowerAmount.test(stem)) {
    errors.push("English neutral stem contains directional financial language.");
  }

  return errors;
}

export function validateIntCp001ReadableStemCashFlow(
  stem: string,
  solveContract: string,
  language: IntCp001ReadableLanguage,
  direction: IntCp001CashFlowDirection,
): string[] {
  if (language === "hi") return validateHindi(stem, solveContract, direction);
  if (language === "pa") return validatePunjabi(stem, solveContract, direction);
  return validateEnglish(stem, solveContract, direction);
}
