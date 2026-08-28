import type { SapCp003PrototypeId } from "../types";

export interface SapCp003ExplanationPolicy {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly whyThisWorks: string;
  readonly commonTraps: readonly [string, string, string];
}

export const SAP_CP003_EXPLANATION_POLICY: Readonly<Record<SapCp003PrototypeId, SapCp003ExplanationPolicy>> = Object.freeze({
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": {
    coreConcept: "Apply the usual order of operations while keeping every decimal place aligned and exact.",
    givenDataAndStrategy: "Read the complete expression first, identify the operation that must be completed before the others, and then combine the resulting decimal values.",
    whyThisWorks: "Decimals follow the same operation-order rules as whole numbers; place value affects calculation, not precedence.",
    commonTraps: [
      "Adding before completing a multiplication or division.",
      "Ignoring the scope of a bracket.",
      "Moving a decimal point without a place-value reason.",
    ],
  },
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": {
    coreConcept: "Use one convenient exact representation for the fraction-decimal part before completing the remaining operation.",
    givenDataAndStrategy: "Evaluate the product involving the fraction first, convert only the part that needs conversion, and then combine it with the decimal term.",
    whyThisWorks: "A fraction and a terminating decimal can represent the same exact value, so switching form does not change the expression.",
    commonTraps: [
      "Adding the fraction and decimal before completing the product.",
      "Dropping the multiplier attached to the fraction.",
      "Using an approximate decimal for an exact fraction.",
    ],
  },
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": {
    coreConcept: "Multiply the digits as whole numbers and restore the total number of decimal places from both factors.",
    givenDataAndStrategy: "Count the decimal places in each factor, multiply the corresponding whole-number forms, and place the decimal point using the combined count.",
    whyThisWorks: "Each decimal factor is a whole number divided by a power of ten, so the product denominator contains the product of those powers of ten.",
    commonTraps: [
      "Counting decimal places from only one factor.",
      "Restoring one decimal place too few.",
      "Restoring one decimal place too many.",
    ],
  },
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": {
    coreConcept: "Dividing by a power of ten shifts every digit to a place of smaller value.",
    givenDataAndStrategy: "Count the zeros in the divisor and move the decimal point left by exactly that many places, adding leading zeros where needed.",
    whyThisWorks: "Dividing by 10, 100, or 1000 reduces the place value of every digit by one, two, or three positions respectively.",
    commonTraps: [
      "Moving the decimal point to the right.",
      "Moving it fewer places than the number of zeros.",
      "Dropping a required zero before the first non-zero digit.",
    ],
  },
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": {
    coreConcept: "Replace division by a compatible decimal with multiplication by its exact reciprocal.",
    givenDataAndStrategy: "Find a simple reciprocal for the divisor, rewrite the division as multiplication, and then evaluate the resulting whole-number-friendly product.",
    whyThisWorks: "Dividing by a non-zero number is exactly the same as multiplying by its reciprocal.",
    commonTraps: [
      "Multiplying by the divisor instead of its reciprocal.",
      "Reversing the dividend and divisor.",
      "Using an approximate reciprocal when an exact one is available.",
    ],
  },
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": {
    coreConcept: "A percentage is an exact factor out of 100 and must be converted before multiplication.",
    givenDataAndStrategy: "Replace the percentage by the corresponding fraction or decimal factor, then multiply it by the stated quantity.",
    whyThisWorks: "The symbol percent means per hundred, so p% and p/100 are exactly equal.",
    commonTraps: [
      "Ignoring the percent sign and using the displayed number directly.",
      "Dividing the quantity by the percentage factor.",
      "Shifting the decimal point by the wrong number of places.",
    ],
  },
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": {
    coreConcept: "Treat the complete percentage-of quantity as one block before combining it with outside terms.",
    givenDataAndStrategy: "Calculate the percentage of the stated quantity first, keep that result together as a single value, and then perform the remaining addition or subtraction.",
    whyThisWorks: "The word of represents multiplication and its stated quantity belongs to that multiplication block.",
    commonTraps: [
      "Including an outside term inside the percentage-of block.",
      "Omitting the quantity that follows the word of.",
      "Combining terms before evaluating the scoped block.",
    ],
  },
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": {
    coreConcept: "Convert percentage, fraction, and decimal parts to compatible exact values before the final combination.",
    givenDataAndStrategy: "Evaluate each multiplication block separately, write both results as exact fractions, and then add or subtract them using a common denominator.",
    whyThisWorks: "Different written forms can be combined safely once they are expressed as exact rational values.",
    commonTraps: [
      "Applying the last decimal factor to the whole expression.",
      "Omitting one factor from a multiplication block.",
      "Giving an unreduced fraction as the final answer.",
    ],
  },
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": {
    coreConcept: "Convert every decimal and percentage term to an exact fraction before combining the expression.",
    givenDataAndStrategy: "Rewrite the terminating decimal over a power of ten, rewrite the percentage over 100, reduce each fraction, and then evaluate with a common denominator.",
    whyThisWorks: "Exact conversion preserves value and makes addition or subtraction across unlike forms systematic.",
    commonTraps: [
      "Treating a percentage number as though the percent sign were absent.",
      "Omitting one converted term.",
      "Failing to reduce the final fraction.",
    ],
  },
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": {
    coreConcept: "Use terminating decimal equivalents for compatible fractions and percentages, then calculate by place value.",
    givenDataAndStrategy: "Convert the displayed fraction and percentage to their exact terminating decimals, align decimal points, and combine all terms.",
    whyThisWorks: "Fractions with terminating decimal forms can be rewritten without approximation, so ordinary decimal arithmetic remains exact.",
    commonTraps: [
      "Replacing a fraction by its percentage number rather than its decimal value.",
      "Omitting the percentage term.",
      "Misaligning decimal places during addition.",
    ],
  },
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": {
    coreConcept: "Recognise standard fraction-decimal equivalents to simplify products before adding them.",
    givenDataAndStrategy: "Replace each familiar decimal or fraction with its matching benchmark form, evaluate the two products separately, and then add their exact values.",
    whyThisWorks: "Benchmark equivalents such as one eighth and 0.125 are identical values, so the easier form may be chosen freely.",
    commonTraps: [
      "Ignoring a benchmark factor and using only its multiplier.",
      "Using the wrong familiar equivalent.",
      "Adding multipliers before evaluating their products.",
    ],
  },
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": {
    coreConcept: "Convert the recurring decimal to its exact fraction rather than truncating or rounding it.",
    givenDataAndStrategy: "Identify the repeating block, use its exact fractional equivalent, and then complete the stated addition or subtraction as a fraction calculation.",
    whyThisWorks: "A recurring decimal represents an infinite but exact value, and its fraction form captures that value without loss.",
    commonTraps: [
      "Reading the recurring digits as an ordinary terminating decimal.",
      "Rounding the recurring value before calculating.",
      "Using an incorrect numerator for the recurring fraction.",
    ],
  },
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": {
    coreConcept: "Complementary percentages applied to the same quantity combine to one whole.",
    givenDataAndStrategy: "Add the two percentage factors first, recognise that they total 100%, and then apply the whole factor to the shared quantity.",
    whyThisWorks: "Distributive multiplication gives a% of N plus b% of N as (a+b)% of N when both terms use the same quantity.",
    commonTraps: [
      "Omitting one of the complementary terms.",
      "Combining percentages but forgetting the shared quantity.",
      "Treating 100% as the number 100 rather than one whole.",
    ],
  },
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": {
    coreConcept: "Successive percentage factors are multiplied as exact multipliers; they are not added.",
    givenDataAndStrategy: "Convert each percentage to a multiplier, multiply the two factors together, and then apply the combined factor to the quantity.",
    whyThisWorks: "Each percentage acts on the result of the preceding multiplication, so the combined effect is the product of the factors.",
    commonTraps: [
      "Adding the percentage factors.",
      "Ignoring the percent sign on one factor.",
      "Applying both percentages separately to the original quantity and adding them.",
    ],
  },
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": {
    coreConcept: "Isolate the missing decimal with the inverse operation and verify it by substitution.",
    givenDataAndStrategy: "Identify how the blank is connected to the known value, undo that operation in the correct order, and substitute the result into the original equality.",
    whyThisWorks: "Inverse operations preserve equality while reversing the operation that hides the missing value.",
    commonTraps: [
      "Using the same operation instead of its inverse.",
      "Reversing the order in a subtraction or division.",
      "Skipping the substitution check.",
    ],
  },
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": {
    coreConcept: "First isolate the percentage contribution, then divide by the quantity to recover the percentage factor.",
    givenDataAndStrategy: "Remove the known outside term, divide the remaining contribution by the stated quantity, and convert the resulting factor to a percentage.",
    whyThisWorks: "If p% of a quantity equals a contribution, then p/100 equals contribution divided by that quantity.",
    commonTraps: [
      "Reporting the contribution itself as the percentage.",
      "Adding the known term instead of subtracting it.",
      "Forgetting to convert the final factor to percent form.",
    ],
  },
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": {
    coreConcept: "Convert both expressions to exact comparable values before deciding their relation.",
    givenDataAndStrategy: "Evaluate A and B separately in a common representation, compare the two exact results, and select the matching greater-than, less-than, or equality statement.",
    whyThisWorks: "The written representation does not affect magnitude; exact conversion reveals the true numerical relation.",
    commonTraps: [
      "Comparing the visible numerals without converting their forms.",
      "Ignoring an added or subtracted adjustment in B.",
      "Choosing equality merely because the starting fraction and percentage are equivalent.",
    ],
  },
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": {
    coreConcept: "The correct decimal placement is fixed by the total scale of the two factors.",
    givenDataAndStrategy: "Multiply the digit strings as whole numbers, count all decimal places in both factors, and choose the option with that total number of decimal places.",
    whyThisWorks: "The product of the two decimal scales determines one unique power-of-ten denominator for the answer.",
    commonTraps: [
      "Counting the decimal places in only one factor.",
      "Placing the decimal one position too far right.",
      "Placing the decimal one position too far left.",
    ],
  },
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": {
    coreConcept: "The first incorrect step is the earliest line that changes the exact value of the original expression.",
    givenDataAndStrategy: "Convert the original terms exactly, compare each displayed line with the preceding exact value, and stop at the first line where equality is lost.",
    whyThisWorks: "A valid transformation must preserve value from one line to the next; once a line changes the value, all later work is already based on an error.",
    commonTraps: [
      "Selecting a later visible error after an earlier value change.",
      "Treating a correct change of representation as an error.",
      "Choosing no error without checking every line.",
    ],
  },
});
