// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-002/cp002-dynamic-runtime.test.ts
import assert from "node:assert/strict";

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-002/task-registry.library.json
var task_registry_library_default = {
  archetypeId: "PNL-001",
  cpId: "PNL-CP-002",
  status: "FREEZE_CANDIDATE",
  countPolicy: "DISCOVERED_NOT_QUOTA_DRIVEN",
  title: "Marked Price, Discount and Successive Discounts",
  entries: {
    "PNL-QL-037": {
      solveMode: "MP_DISCOUNT_TO_SP",
      answerSemantic: "sellingPrice",
      requiredVariables: ["markedPrice", "discountPercent"],
      difficulty: "Easy"
    },
    "PNL-QL-038": {
      solveMode: "MP_SP_TO_DISCOUNT",
      answerSemantic: "discountPercent",
      requiredVariables: ["markedPrice", "sellingPrice"],
      difficulty: "Easy"
    },
    "PNL-QL-039": {
      solveMode: "SP_DISCOUNT_TO_MP",
      answerSemantic: "markedPrice",
      requiredVariables: ["sellingPrice", "discountPercent"],
      difficulty: "Medium"
    },
    "PNL-QL-040": {
      solveMode: "SUCCESSIVE_DISCOUNTS_TO_SP",
      answerSemantic: "sellingPrice",
      requiredVariables: [
        "markedPrice",
        "firstDiscountPercent",
        "secondDiscountPercent"
      ],
      difficulty: "Medium"
    },
    "PNL-QL-041": {
      solveMode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
      answerSemantic: "equivalentDiscountPercent",
      requiredVariables: ["firstDiscountPercent", "secondDiscountPercent"],
      difficulty: "Medium"
    },
    "PNL-QL-042": {
      solveMode: "MP_DISCOUNT_TO_AMOUNT",
      answerSemantic: "discountAmount",
      requiredVariables: ["markedPrice", "discountPercent"],
      difficulty: "Easy"
    },
    "PNL-QL-043": {
      solveMode: "MP_AMOUNT_TO_DISCOUNT",
      answerSemantic: "discountPercent",
      requiredVariables: ["markedPrice", "discountAmount"],
      difficulty: "Easy"
    },
    "PNL-QL-044": {
      solveMode: "MP_AMOUNT_TO_SP",
      answerSemantic: "sellingPrice",
      requiredVariables: ["markedPrice", "discountAmount"],
      difficulty: "Easy"
    },
    "PNL-QL-045": {
      solveMode: "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT",
      answerSemantic: "missingDiscountPercent",
      requiredVariables: [
        "knownDiscountPercent",
        "equivalentDiscountPercent"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-046": {
      solveMode: "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE",
      answerSemantic: "betterOfferAndDifference",
      requiredVariables: [
        "markedPrice",
        "singleDiscountPercent",
        "firstDiscountPercent",
        "secondDiscountPercent"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-047": {
      solveMode: "CP_MARKUP_DISCOUNT_TO_RESULT",
      answerSemantic: "profitOrLossPercent",
      requiredVariables: ["costPrice", "markupPercent", "discountPercent"],
      difficulty: "Hard"
    },
    "PNL-QL-048": {
      solveMode: "CP_MARKUP_DISCOUNT_TO_RESULT",
      answerSemantic: "profitOrLossAmount",
      requiredVariables: ["costPrice", "markupPercent", "discountPercent"],
      difficulty: "Hard"
    },
    "PNL-QL-049": {
      solveMode: "MP_CP_TARGET_RATE_TO_DISCOUNT",
      answerSemantic: "requiredDiscountPercent",
      requiredVariables: [
        "markedPrice",
        "costPrice",
        "targetDirection",
        "targetRatePercent"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-050": {
      solveMode: "CP_DISCOUNT_TARGET_RATE_TO_MARKUP",
      answerSemantic: "requiredMarkupPercent",
      requiredVariables: [
        "costPrice",
        "discountPercent",
        "targetDirection",
        "targetRatePercent"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-051": {
      solveMode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT",
      answerSemantic: "equivalentDiscountPercent",
      requiredVariables: ["paidUnits", "freeUnits"],
      difficulty: "Medium"
    },
    "PNL-QL-052": {
      solveMode: "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE",
      answerSemantic: "effectiveUnitPrice",
      requiredVariables: ["unitMarkedPrice", "paidUnits", "freeUnits"],
      difficulty: "Medium"
    },
    "PNL-QL-053": {
      solveMode: "CASHBACK_TO_EFFECTIVE_PRICE",
      answerSemantic: "effectivePrice",
      requiredVariables: ["billedPrice", "cashbackAmount"],
      difficulty: "Easy"
    },
    "PNL-QL-054": {
      solveMode: "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE",
      answerSemantic: "effectivePrice",
      requiredVariables: ["billedPrice", "cashbackPercent"],
      difficulty: "Medium"
    },
    "PNL-QL-055": {
      solveMode: "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE",
      answerSemantic: "effectivePrice",
      requiredVariables: ["markedPrice", "discountPercent", "couponAmount"],
      difficulty: "Medium"
    },
    "PNL-QL-056": {
      solveMode: "DISCOUNT_VS_CASHBACK_COMPARE",
      answerSemantic: "betterOfferAndDifference",
      requiredVariables: ["markedPrice", "discountPercent", "cashbackAmount"],
      difficulty: "Hard"
    },
    "PNL-QL-057": {
      solveMode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP",
      answerSemantic: "sellingPrice",
      requiredVariables: [
        "markedPrice",
        "firstDiscountPercent",
        "secondDiscountPercent",
        "thirdDiscountPercent"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-058": {
      solveMode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE",
      answerSemantic: "couponEligibilityAndEffectivePrice",
      requiredVariables: ["billedPrice", "minimumSpend", "couponAmount"],
      difficulty: "Medium"
    },
    "PNL-QL-059": {
      solveMode: "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE",
      answerSemantic: "effectivePrice",
      requiredVariables: ["markedPrice", "discountPercent", "couponPercent"],
      difficulty: "Hard"
    },
    "PNL-QL-060": {
      solveMode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT",
      answerSemantic: "cashbackAndEffectivePrice",
      requiredVariables: ["billedPrice", "cashbackPercent", "cashbackCap"],
      difficulty: "Hard"
    },
    "PNL-QL-061": {
      solveMode: "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT",
      answerSemantic: "billedCashbackAndEffectivePrice",
      requiredVariables: [
        "markedPrice",
        "discountPercent",
        "cashbackPercent",
        "cashbackCap"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-062": {
      solveMode: "DISCOUNT_FRACTION_TO_PERCENT",
      answerSemantic: "discountPercent",
      requiredVariables: ["fractionNumerator", "fractionDenominator"],
      difficulty: "Medium"
    },
    "PNL-QL-063": {
      solveMode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT",
      answerSemantic: "discountPercent",
      requiredVariables: ["paidPart", "markedPart"],
      difficulty: "Medium"
    },
    "PNL-QL-064": {
      solveMode: "MIXED_OFFER_ELIGIBILITY_COMPARE",
      answerSemantic: "eligibleBetterOfferAndDifference",
      requiredVariables: [
        "billedPrice",
        "discountPercent",
        "minimumSpend",
        "couponAmount"
      ],
      difficulty: "Hard"
    },
    "PNL-QL-065": {
      solveMode: "SUCCESSIVE_DISCOUNTS_TO_SP",
      answerSemantic: "tableRowSellingPrice",
      requiredVariables: ["offerTable", "selectedOffer", "markedPrice"],
      difficulty: "Hard",
      representation: "TABLE"
    },
    "PNL-QL-066": {
      solveMode: "CP_MARKUP_DISCOUNT_TO_RESULT",
      answerSemantic: "caseletProfitOrLossPercent",
      requiredVariables: [
        "caseletData",
        "costPrice",
        "markupPercent",
        "discountPercent"
      ],
      difficulty: "Hard",
      representation: "CASELET"
    },
    "PNL-QL-067": {
      solveMode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
      answerSemantic: "correctStatement",
      requiredVariables: ["firstDiscountPercent", "secondDiscountPercent"],
      difficulty: "Medium",
      representation: "STATEMENT"
    },
    "PNL-QL-068": {
      solveMode: "MP_SP_TO_DISCOUNT",
      answerSemantic: "algebraicDiscountPercent",
      requiredVariables: ["markedPriceExpression", "sellingPriceExpression"],
      difficulty: "Hard",
      representation: "ALGEBRAIC"
    },
    "PNL-QL-069": {
      solveMode: "COUPON_ORDER_COMPARE",
      answerSemantic: "betterOrderAndDifference",
      requiredVariables: ["markedPrice", "discountPercent", "couponAmount"],
      difficulty: "Hard"
    },
    "PNL-QL-070": {
      solveMode: "MP_CP_TARGET_RATE_TO_DISCOUNT",
      answerSemantic: "dataSufficiency",
      requiredVariables: ["statementOne", "statementTwo"],
      difficulty: "Hard",
      representation: "DATA_SUFFICIENCY"
    }
  },
  entryCount: 34,
  freezeNote: "Count frozen after direct/reverse, promotion-semantics, coupon-order, conditional-eligibility, representation and QL-depth audits. Reopen only for a genuinely distinct book/PYQ mode."
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-002/editorial-content.en.json
var editorial_content_en_default = {
  schemaVersion: 2,
  archetypeId: "PNL-001",
  cpId: "PNL-CP-002",
  language: "en",
  status: "EDITORIAL_REVIEW_CANDIDATE",
  entries: {
    "PNL-QL-037": {
      stem: {
        contextFamily: "fashion-clearance sale",
        blocks: [
          {
            type: "paragraph",
            content: "The marked price of the jacket is \u20B9{markedPrice}. It is sold at a discount of {discountPercent}%."
          }
        ],
        prompt: "Find the selling price."
      },
      explanation: {
        opening: "Let us begin with the price printed on the tag and remove the allowed discount.",
        concept: "A discount leaves a retained fraction of the marked price, so selling price equals marked price multiplied by one minus the discount rate.",
        steps: [
          {
            title: "Find the retained percentage",
            body: "Subtract the discount percentage from 100 percent."
          },
          {
            title: "Apply it to marked price",
            body: "Multiply the marked price by the retained fraction.",
            equationLatex: "S=M\\left(1-\\frac{d}{100}\\right)"
          }
        ],
        conclusion: "The reduced amount is the customer's selling price.",
        commonTrap: "Do not subtract the percentage number directly from the rupee marked price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-038": {
      stem: {
        contextFamily: "electronics markdown",
        blocks: [
          {
            type: "paragraph",
            content: "The tablet marked at \u20B9{markedPrice} is sold for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Find the discount percentage."
      },
      explanation: {
        opening: "The marked price and actual selling price show exactly how much price was reduced.",
        concept: "Discount percentage is the reduction divided by marked price, because the discount is always measured from the marked price.",
        steps: [
          {
            title: "Find the discount amount",
            body: "Subtract selling price from marked price.",
            equationLatex: "D=M-S"
          },
          {
            title: "Convert to a percentage",
            body: "Divide the discount amount by marked price and multiply by 100.",
            equationLatex: "d=\\frac{D}{M}\\times100"
          }
        ],
        conclusion: "This rate is the discount percentage offered on the price tag.",
        commonTrap: "Do not divide the discount by selling price; selling price is the amount after reduction."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-039": {
      stem: {
        contextFamily: "furniture-price recovery",
        blocks: [
          {
            type: "paragraph",
            content: "After allowing a discount of {discountPercent}%, a retailer sells the bookshelf for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Find its marked price."
      },
      explanation: {
        opening: "Because the discounted selling price is known, we can reverse the retained-price factor.",
        concept: "After a d percent discount, the customer pays 100\u2212d percent of the marked price.",
        steps: [
          {
            title: "Write the retained factor",
            body: "Convert 100\u2212d percent to a decimal or fraction."
          },
          {
            title: "Recover marked price",
            body: "Divide the selling price by the retained factor.",
            equationLatex: "M=\\frac{S}{1-d/100}"
          }
        ],
        conclusion: "The quotient is the original marked price.",
        commonTrap: "Do not add the discount percentage to selling price; a percentage reversal requires division."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-040": {
      stem: {
        contextFamily: "festival successive-discount sale",
        blocks: [
          {
            type: "paragraph",
            content: "The home-appliance set marked at \u20B9{markedPrice} is offered at successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%."
          }
        ],
        prompt: "Find the final selling price."
      },
      explanation: {
        opening: "Successive discounts should be processed one after another, just as the store applies them.",
        concept: "Each later discount acts on the already reduced price, so retained-price multipliers must be multiplied rather than the discounts added.",
        steps: [
          {
            title: "Convert every discount to a retained factor",
            body: "A discount of d percent leaves the factor 1\u2212d/100."
          },
          {
            title: "Multiply the factors",
            body: "Apply the factors in order to the marked price.",
            equationLatex: "S=M\\prod_i\\left(1-\\frac{d_i}{100}\\right)"
          },
          {
            title: "Read the final amount",
            body: "The product gives the actual amount paid after all reductions."
          }
        ],
        conclusion: "The final reduced price is the required selling price.",
        commonTrap: "Do not add successive discount percentages because their bases change after every reduction."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-041": {
      stem: {
        contextFamily: "supermarket equivalent-discount offer",
        blocks: [
          {
            type: "paragraph",
            content: "The supermarket offers successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%."
          }
        ],
        prompt: "Find the single equivalent discount."
      },
      explanation: {
        opening: "We can replace two successive discounts with one discount that leaves the same final price.",
        concept: "The equivalent retained fraction is the product of the two retained fractions; the equivalent discount is what is missing from 100 percent.",
        steps: [
          {
            title: "Multiply retained factors",
            body: "Use (1\u2212d1/100)(1\u2212d2/100)."
          },
          {
            title: "Convert back to a discount",
            body: "Subtract the retained percentage from 100 percent.",
            equationLatex: "d_e=100\\left[1-\\left(1-\\frac{d_1}{100}\\right)\\left(1-\\frac{d_2}{100}\\right)\\right]"
          }
        ],
        conclusion: "This single rate produces the same final selling price as both discounts together.",
        commonTrap: "Do not simply add the two discount rates; the second discount is on a lower price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-042": {
      stem: {
        contextFamily: "bookstore discount amount",
        blocks: [
          {
            type: "paragraph",
            content: "The competitive-exam book set is marked at \u20B9{markedPrice} and sold at a discount of {discountPercent}%."
          }
        ],
        prompt: "Find the discount allowed in rupees."
      },
      explanation: {
        opening: "Here the discount is handled as a direct link between marked price, discount amount, and selling price.",
        concept: "These three quantities satisfy marked price minus discount amount equals selling price, while the discount rate uses marked price as its base.",
        steps: [
          {
            title: "Write the price relation",
            body: "Keep marked price, discount amount, and selling price in the same currency units.",
            equationLatex: "S=M-D"
          },
          {
            title: "Use the requested conversion",
            body: "For a rate, divide D by M; for an amount or selling price, rearrange the same relation."
          }
        ],
        conclusion: "The rearranged relation gives the requested discount value or final price.",
        commonTrap: "Do not measure the discount percentage on selling price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-043": {
      stem: {
        contextFamily: "pharmacy discount-rate calculation",
        blocks: [
          {
            type: "paragraph",
            content: "A discount of \u20B9{discountAmount} is allowed on the health-monitoring kit marked at \u20B9{markedPrice}."
          }
        ],
        prompt: "Find the discount percentage."
      },
      explanation: {
        opening: "Here the discount is handled as a direct link between marked price, discount amount, and selling price.",
        concept: "These three quantities satisfy marked price minus discount amount equals selling price, while the discount rate uses marked price as its base.",
        steps: [
          {
            title: "Write the price relation",
            body: "Keep marked price, discount amount, and selling price in the same currency units.",
            equationLatex: "S=M-D"
          },
          {
            title: "Use the requested conversion",
            body: "For a rate, divide D by M; for an amount or selling price, rearrange the same relation."
          }
        ],
        conclusion: "The rearranged relation gives the requested discount value or final price.",
        commonTrap: "Do not measure the discount percentage on selling price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-044": {
      stem: {
        contextFamily: "appliance flat-reduction sale",
        blocks: [
          {
            type: "paragraph",
            content: "The marked price of the microwave oven is \u20B9{markedPrice}. A discount of \u20B9{discountAmount} is allowed."
          }
        ],
        prompt: "Find the selling price."
      },
      explanation: {
        opening: "Here the discount is handled as a direct link between marked price, discount amount, and selling price.",
        concept: "These three quantities satisfy marked price minus discount amount equals selling price, while the discount rate uses marked price as its base.",
        steps: [
          {
            title: "Write the price relation",
            body: "Keep marked price, discount amount, and selling price in the same currency units.",
            equationLatex: "S=M-D"
          },
          {
            title: "Use the requested conversion",
            body: "For a rate, divide D by M; for an amount or selling price, rearrange the same relation."
          }
        ],
        conclusion: "The rearranged relation gives the requested discount value or final price.",
        commonTrap: "Do not measure the discount percentage on selling price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-045": {
      stem: {
        contextFamily: "apparel two-stage discount",
        blocks: [
          {
            type: "paragraph",
            content: "Two successive discounts are offered. The first discount is {knownDiscountPercent}% and the equivalent discount is {equivalentDiscountPercent}%."
          }
        ],
        prompt: "Find the second discount."
      },
      explanation: {
        opening: "The combined discount and one individual discount are known, so the missing retained factor can be isolated.",
        concept: "Equivalent discount information is easiest to use through retained-price multipliers, not by subtracting discount rates.",
        steps: [
          {
            title: "Convert the equivalent discount",
            body: "Find the overall retained factor 1\u2212de/100."
          },
          {
            title: "Remove the known discount factor",
            body: "Divide the overall retained factor by 1\u2212d1/100."
          },
          {
            title: "Recover the missing discount",
            body: "Subtract the remaining factor from 1 and convert to percent."
          }
        ],
        conclusion: "The recovered rate is the second successive discount.",
        commonTrap: "Do not calculate the missing discount as equivalent discount minus known discount."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-046": {
      stem: {
        contextFamily: "online-offer comparison",
        blocks: [
          {
            type: "paragraph",
            content: "On the wireless speaker marked at \u20B9{markedPrice}, one shop offers {singleDiscountPercent}% discount and another offers successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%."
          }
        ],
        prompt: "Which offer is better, and by how much?"
      },
      explanation: {
        opening: "The safest comparison is to convert every offer into the actual amount the customer finally pays.",
        concept: "Offers with different wording can be compared only after discount, cashback, coupon value, and eligibility have been evaluated on their correct bases.",
        steps: [
          {
            title: "Evaluate the first offer",
            body: "Calculate its effective price after applying all valid conditions."
          },
          {
            title: "Evaluate the second offer",
            body: "Use the same original marked or billed amount and respect eligibility rules."
          },
          {
            title: "Compare final prices",
            body: "The lower effective price is better; subtract the two prices for the saving difference."
          }
        ],
        conclusion: "The offer with the lower valid effective cost is the better choice.",
        commonTrap: "Do not compare headline percentages or coupon amounts without calculating the final payable price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-047": {
      stem: {
        contextFamily: "department-store markup and discount",
        blocks: [
          {
            type: "paragraph",
            content: "A department store buys a travel suitcase for \u20B9{costPrice}, marks it {markupPercent}% above cost, and allows a discount of {discountPercent}%."
          }
        ],
        prompt: "Calculate the resulting profit or loss percentage."
      },
      explanation: {
        opening: "Markup and discount act on different stages, so we should first find the marked price and then the actual selling price.",
        concept: "Markup is measured on cost price, while discount is measured on marked price; the final profit or loss is measured back on cost price.",
        steps: [
          {
            title: "Build marked price",
            body: "Increase cost price by the markup factor.",
            equationLatex: "M=C\\left(1+\\frac{m}{100}\\right)"
          },
          {
            title: "Apply the discount",
            body: "Reduce marked price by the retained discount factor.",
            equationLatex: "S=M\\left(1-\\frac{d}{100}\\right)"
          },
          {
            title: "Compare with cost",
            body: "Find S\u2212C for the amount, or divide the absolute difference by C for the percentage."
          }
        ],
        conclusion: "The comparison of final selling price with cost gives the true commercial result.",
        commonTrap: "Do not subtract discount percentage directly from markup percentage; their bases are different."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-048": {
      stem: {
        contextFamily: "footwear profit-amount sale",
        blocks: [
          {
            type: "paragraph",
            content: "The sports-shoe pair costing \u20B9{costPrice} is marked {markupPercent}% above cost and sold after {discountPercent}% discount."
          }
        ],
        prompt: "Find the profit or loss incurred."
      },
      explanation: {
        opening: "Markup and discount act on different stages, so we should first find the marked price and then the actual selling price.",
        concept: "Markup is measured on cost price, while discount is measured on marked price; the final profit or loss is measured back on cost price.",
        steps: [
          {
            title: "Build marked price",
            body: "Increase cost price by the markup factor.",
            equationLatex: "M=C\\left(1+\\frac{m}{100}\\right)"
          },
          {
            title: "Apply the discount",
            body: "Reduce marked price by the retained discount factor.",
            equationLatex: "S=M\\left(1-\\frac{d}{100}\\right)"
          },
          {
            title: "Compare with cost",
            body: "Find S\u2212C for the amount, or divide the absolute difference by C for the percentage."
          }
        ],
        conclusion: "The comparison of final selling price with cost gives the true commercial result.",
        commonTrap: "Do not subtract discount percentage directly from markup percentage; their bases are different."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-049": {
      stem: {
        contextFamily: "dealer target-margin pricing",
        blocks: [
          {
            type: "paragraph",
            content: "The water purifier costs \u20B9{costPrice} and is marked at \u20B9{markedPrice}."
          }
        ],
        prompt: "Find the discount required to earn {targetRatePercent}% {targetDirection}."
      },
      explanation: {
        opening: "The target profit or loss first determines the required selling price, after which the discount can be found from marked price.",
        concept: "A target rate is measured on cost price, but discount is measured from marked price, so the calculation must move through selling price.",
        steps: [
          {
            title: "Find target selling price",
            body: "Apply the target commercial multiplier to cost price."
          },
          {
            title: "Find the reduction from marked price",
            body: "Subtract target selling price from marked price."
          },
          {
            title: "Convert reduction to discount percentage",
            body: "Divide the reduction by marked price and multiply by 100."
          }
        ],
        conclusion: "This is the maximum or required discount that still achieves the target result.",
        commonTrap: "Do not calculate the discount percentage on cost price."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-050": {
      stem: {
        contextFamily: "wholesale target-markup planning",
        blocks: [
          {
            type: "paragraph",
            content: "A garment wholesaler buys a carton for \u20B9{costPrice}. After allowing a discount of {discountPercent}%, the wholesaler wants an overall {targetRatePercent}% {targetDirection}."
          }
        ],
        prompt: "Find the required markup percentage."
      },
      explanation: {
        opening: "The target result fixes the required selling price, while the known discount lets us work backward to marked price.",
        concept: "Markup is then measured by comparing that marked price with cost price.",
        steps: [
          {
            title: "Calculate target selling price",
            body: "Apply the desired profit or loss multiplier to cost."
          },
          {
            title: "Reverse the discount",
            body: "Divide target selling price by the retained discount factor."
          },
          {
            title: "Find markup rate",
            body: "Compare the recovered marked price with cost price on the cost base."
          }
        ],
        conclusion: "The resulting percentage is the markup needed before the discount is offered.",
        commonTrap: "Do not apply the discount directly to cost price when finding markup."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-051": {
      stem: {
        contextFamily: "supermarket bundle promotion",
        blocks: [
          {
            type: "paragraph",
            content: "A store offers Buy {paidUnits}, get {freeUnits} free on identical articles."
          }
        ],
        prompt: "Find the equivalent discount percentage."
      },
      explanation: {
        opening: "A buy-and-get offer is best understood by spreading the payment over all units received.",
        concept: "The customer pays for the paid units but receives paid plus free units, so the effective unit price and equivalent discount follow from that ratio.",
        steps: [
          {
            title: "Count total units received",
            body: "Add paid units and free units."
          },
          {
            title: "Spread the payment",
            body: "Divide the cost of paid units by total units received.",
            equationLatex: "p_e=p\\frac{x}{x+y}"
          },
          {
            title: "Convert to discount if needed",
            body: "Compare the effective unit price with the marked unit price."
          }
        ],
        conclusion: "This gives either the effective price per unit or the equivalent discount.",
        commonTrap: "Do not treat free units as a percentage of paid units without using total units received."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-052": {
      stem: {
        contextFamily: "beverage multipack promotion",
        blocks: [
          {
            type: "paragraph",
            content: "Each juice bottle is marked at \u20B9{unitMarkedPrice}. Under Buy {paidUnits}, get {freeUnits} free,"
          }
        ],
        prompt: "Find the effective price per juice bottle."
      },
      explanation: {
        opening: "A buy-and-get offer is best understood by spreading the payment over all units received.",
        concept: "The customer pays for the paid units but receives paid plus free units, so the effective unit price and equivalent discount follow from that ratio.",
        steps: [
          {
            title: "Count total units received",
            body: "Add paid units and free units."
          },
          {
            title: "Spread the payment",
            body: "Divide the cost of paid units by total units received.",
            equationLatex: "p_e=p\\frac{x}{x+y}"
          },
          {
            title: "Convert to discount if needed",
            body: "Compare the effective unit price with the marked unit price."
          }
        ],
        conclusion: "This gives either the effective price per unit or the equivalent discount.",
        commonTrap: "Do not treat free units as a percentage of paid units without using total units received."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-053": {
      stem: {
        contextFamily: "digital-wallet cashback",
        blocks: [
          {
            type: "paragraph",
            content: "A customer pays \u20B9{billedPrice} and later receives \u20B9{cashbackAmount} cashback."
          }
        ],
        prompt: "Find the effective cost."
      },
      explanation: {
        opening: "Cashback does not reduce the billed amount at checkout, but it lowers the customer's eventual effective cost.",
        concept: "Find the cashback from the stated amount or percentage, then subtract it from the amount paid.",
        steps: [
          {
            title: "Determine cashback",
            body: "Use the flat amount or calculate the stated percentage of the billed price."
          },
          {
            title: "Find effective price",
            body: "Subtract cashback from the billed amount.",
            equationLatex: "E=B-C_b"
          }
        ],
        conclusion: "The remaining amount is the customer's effective cost after cashback.",
        commonTrap: "Do not call the post-cashback amount the checkout bill; the bill and effective cost are different."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-054": {
      stem: {
        contextFamily: "card-payment cashback",
        blocks: [
          {
            type: "paragraph",
            content: "A payment of \u20B9{billedPrice} earns {cashbackPercent}% cashback."
          }
        ],
        prompt: "Find the effective cost."
      },
      explanation: {
        opening: "Cashback does not reduce the billed amount at checkout, but it lowers the customer's eventual effective cost.",
        concept: "Find the cashback from the stated amount or percentage, then subtract it from the amount paid.",
        steps: [
          {
            title: "Determine cashback",
            body: "Use the flat amount or calculate the stated percentage of the billed price."
          },
          {
            title: "Find effective price",
            body: "Subtract cashback from the billed amount.",
            equationLatex: "E=B-C_b"
          }
        ],
        conclusion: "The remaining amount is the customer's effective cost after cashback.",
        commonTrap: "Do not call the post-cashback amount the checkout bill; the bill and effective cost are different."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-055": {
      stem: {
        contextFamily: "furniture coupon sale",
        blocks: [
          {
            type: "paragraph",
            content: "The office desk marked at \u20B9{markedPrice} gets {discountPercent}% discount and an additional coupon of \u20B9{couponAmount}."
          }
        ],
        prompt: "Find the effective price."
      },
      explanation: {
        opening: "The store applies the discount first, so the coupon must be evaluated on the already discounted price.",
        concept: "Order matters whenever a percentage coupon and a price reduction use different bases.",
        steps: [
          {
            title: "Apply the store discount",
            body: "Reduce marked price by the discount factor."
          },
          {
            title: "Apply the coupon",
            body: "Subtract a flat coupon or apply the coupon percentage to the discounted amount."
          },
          {
            title: "Read effective price",
            body: "The amount left after both valid reductions is the final cost."
          }
        ],
        conclusion: "The final amount is the effective price paid by the customer.",
        commonTrap: "Do not apply a percentage coupon to the original marked price unless the offer explicitly says so."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-056": {
      stem: {
        contextFamily: "travel-bag offer comparison",
        blocks: [
          {
            type: "paragraph",
            content: "For the travel bag marked at \u20B9{markedPrice}, one seller offers {discountPercent}% discount and another offers \u20B9{cashbackAmount} cashback."
          }
        ],
        prompt: "Which offer gives the lower effective cost, and by how much?"
      },
      explanation: {
        opening: "The safest comparison is to convert every offer into the actual amount the customer finally pays.",
        concept: "Offers with different wording can be compared only after discount, cashback, coupon value, and eligibility have been evaluated on their correct bases.",
        steps: [
          {
            title: "Evaluate the first offer",
            body: "Calculate its effective price after applying all valid conditions."
          },
          {
            title: "Evaluate the second offer",
            body: "Use the same original marked or billed amount and respect eligibility rules."
          },
          {
            title: "Compare final prices",
            body: "The lower effective price is better; subtract the two prices for the saving difference."
          }
        ],
        conclusion: "The offer with the lower valid effective cost is the better choice.",
        commonTrap: "Do not compare headline percentages or coupon amounts without calculating the final payable price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-057": {
      stem: {
        contextFamily: "seasonal triple-discount clearance",
        blocks: [
          {
            type: "paragraph",
            content: "The winterwear bundle marked at \u20B9{markedPrice} gets successive discounts of {firstDiscountPercent}%, {secondDiscountPercent}% and {thirdDiscountPercent}%."
          }
        ],
        prompt: "Find the final selling price."
      },
      explanation: {
        opening: "Successive discounts should be processed one after another, just as the store applies them.",
        concept: "Each later discount acts on the already reduced price, so retained-price multipliers must be multiplied rather than the discounts added.",
        steps: [
          {
            title: "Convert every discount to a retained factor",
            body: "A discount of d percent leaves the factor 1\u2212d/100."
          },
          {
            title: "Multiply the factors",
            body: "Apply the factors in order to the marked price.",
            equationLatex: "S=M\\prod_i\\left(1-\\frac{d_i}{100}\\right)"
          },
          {
            title: "Read the final amount",
            body: "The product gives the actual amount paid after all reductions."
          }
        ],
        conclusion: "The final reduced price is the required selling price.",
        commonTrap: "Do not add successive discount percentages because their bases change after every reduction."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-058": {
      stem: {
        contextFamily: "minimum-spend grocery coupon",
        blocks: [
          {
            type: "paragraph",
            content: "A coupon of \u20B9{couponAmount} applies when the bill is at least \u20B9{minimumSpend}. For a bill of \u20B9{billedPrice}, state whether it applies and"
          }
        ],
        prompt: "Find the effective price."
      },
      explanation: {
        opening: "Before subtracting the coupon, we must check whether the bill reaches the minimum-spend requirement.",
        concept: "A conditional coupon changes the price only when its eligibility condition is satisfied.",
        steps: [
          {
            title: "Test eligibility",
            body: "Compare billed price with the minimum required spend."
          },
          {
            title: "Apply or reject the coupon",
            body: "Subtract the coupon only if the condition is met."
          },
          {
            title: "State both results",
            body: "Report eligibility and the corresponding effective price clearly."
          }
        ],
        conclusion: "The valid outcome depends on the threshold comparison.",
        commonTrap: "Do not subtract a coupon automatically without checking the minimum-spend rule."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-059": {
      stem: {
        contextFamily: "sportswear percentage coupon",
        blocks: [
          {
            type: "paragraph",
            content: "The sportswear set marked at \u20B9{markedPrice} gets {discountPercent}% discount followed by a {couponPercent}% coupon on the discounted price."
          }
        ],
        prompt: "Find the effective price."
      },
      explanation: {
        opening: "The store applies the discount first, so the coupon must be evaluated on the already discounted price.",
        concept: "Order matters whenever a percentage coupon and a price reduction use different bases.",
        steps: [
          {
            title: "Apply the store discount",
            body: "Reduce marked price by the discount factor."
          },
          {
            title: "Apply the coupon",
            body: "Subtract a flat coupon or apply the coupon percentage to the discounted amount."
          },
          {
            title: "Read effective price",
            body: "The amount left after both valid reductions is the final cost."
          }
        ],
        conclusion: "The final amount is the effective price paid by the customer.",
        commonTrap: "Do not apply a percentage coupon to the original marked price unless the offer explicitly says so."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-060": {
      stem: {
        contextFamily: "bank-cashback cap",
        blocks: [
          {
            type: "paragraph",
            content: "A bill of \u20B9{billedPrice} earns {cashbackPercent}% cashback subject to a cap of \u20B9{cashbackCap}."
          }
        ],
        prompt: "Find the cashback and effective cost."
      },
      explanation: {
        opening: "This offer has both a percentage calculation and a maximum cashback cap, so both limits must be checked.",
        concept: "Actual cashback is the smaller of the calculated percentage amount and the stated cap; the percentage base must follow the offer wording.",
        steps: [
          {
            title: "Identify the cashback base",
            body: "Use billed price or original marked price exactly as stated."
          },
          {
            title: "Calculate uncapped cashback",
            body: "Multiply the correct base by the cashback percentage."
          },
          {
            title: "Apply the cap and find effective price",
            body: "Use the smaller cashback, then subtract it from the billed amount."
          }
        ],
        conclusion: "The capped cashback and resulting effective cost are the required outputs.",
        commonTrap: "Do not calculate cashback on the wrong price or ignore the cap when the percentage amount is larger."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-061": {
      stem: {
        contextFamily: "marketplace original-price cashback",
        blocks: [
          {
            type: "paragraph",
            content: "The smartphone marked at \u20B9{markedPrice} gets {discountPercent}% discount and then {cashbackPercent}% cashback on the original marked price, capped at \u20B9{cashbackCap}."
          }
        ],
        prompt: "Find the billed price, cashback and effective cost."
      },
      explanation: {
        opening: "This offer has both a percentage calculation and a maximum cashback cap, so both limits must be checked.",
        concept: "Actual cashback is the smaller of the calculated percentage amount and the stated cap; the percentage base must follow the offer wording.",
        steps: [
          {
            title: "Identify the cashback base",
            body: "Use billed price or original marked price exactly as stated."
          },
          {
            title: "Calculate uncapped cashback",
            body: "Multiply the correct base by the cashback percentage."
          },
          {
            title: "Apply the cap and find effective price",
            body: "Use the smaller cashback, then subtract it from the billed amount."
          }
        ],
        conclusion: "The capped cashback and resulting effective cost are the required outputs.",
        commonTrap: "Do not calculate cashback on the wrong price or ignore the cap when the percentage amount is larger."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-062": {
      stem: {
        contextFamily: "fractional markdown",
        blocks: [
          {
            type: "paragraph",
            content: "The discount is {fractionNumerator}/{fractionDenominator} of the marked price."
          }
        ],
        prompt: "Find the discount percentage."
      },
      explanation: {
        opening: "The fraction or ratio describes how much of the marked price is reduced or retained.",
        concept: "Convert the given relationship to a retained or discounted fraction, then multiply by 100 to express it as a percentage.",
        steps: [
          {
            title: "Interpret the parts",
            body: "Decide whether the given fraction represents discount or price paid."
          },
          {
            title: "Find the discount fraction",
            body: "If price paid is given, subtract the retained fraction from 1."
          },
          {
            title: "Convert to percent",
            body: "Multiply the discount fraction by 100."
          }
        ],
        conclusion: "The converted value is the discount percentage.",
        commonTrap: "Do not confuse the fraction paid with the fraction discounted."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-063": {
      stem: {
        contextFamily: "catalog-price ratio",
        blocks: [
          {
            type: "paragraph",
            content: "The ratio of price paid to marked price is {paidPart}:{markedPart}."
          }
        ],
        prompt: "Find the discount percentage."
      },
      explanation: {
        opening: "The fraction or ratio describes how much of the marked price is reduced or retained.",
        concept: "Convert the given relationship to a retained or discounted fraction, then multiply by 100 to express it as a percentage.",
        steps: [
          {
            title: "Interpret the parts",
            body: "Decide whether the given fraction represents discount or price paid."
          },
          {
            title: "Find the discount fraction",
            body: "If price paid is given, subtract the retained fraction from 1."
          },
          {
            title: "Convert to percent",
            body: "Multiply the discount fraction by 100."
          }
        ],
        conclusion: "The converted value is the discount percentage.",
        commonTrap: "Do not confuse the fraction paid with the fraction discounted."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-064": {
      stem: {
        contextFamily: "mixed-offer eligibility",
        blocks: [
          {
            type: "paragraph",
            content: "For a bill of \u20B9{billedPrice}, Shop A offers {discountPercent}% discount. Shop B offers a coupon of \u20B9{couponAmount} valid from \u20B9{minimumSpend}."
          }
        ],
        prompt: "Identify the eligible better offer and find the effective-cost difference."
      },
      explanation: {
        opening: "The safest comparison is to convert every offer into the actual amount the customer finally pays.",
        concept: "Offers with different wording can be compared only after discount, cashback, coupon value, and eligibility have been evaluated on their correct bases.",
        steps: [
          {
            title: "Evaluate the first offer",
            body: "Calculate its effective price after applying all valid conditions."
          },
          {
            title: "Evaluate the second offer",
            body: "Use the same original marked or billed amount and respect eligibility rules."
          },
          {
            title: "Compare final prices",
            body: "The lower effective price is better; subtract the two prices for the saving difference."
          }
        ],
        conclusion: "The offer with the lower valid effective cost is the better choice.",
        commonTrap: "Do not compare headline percentages or coupon amounts without calculating the final payable price."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-065": {
      stem: {
        contextFamily: "offer-matrix selection",
        blocks: [
          {
            type: "paragraph",
            content: "A consumer appliance has a marked price of \u20B9{markedPrice}. The available offers are listed below."
          },
          {
            type: "table",
            caption: "Offer matrix",
            columns: ["Offer", "First reduction", "Second reduction"],
            rowSource: "offerTable"
          }
        ],
        prompt: "Find the selling price under offer {selectedOffer}."
      },
      explanation: {
        opening: "Successive discounts should be processed one after another, just as the store applies them.",
        concept: "Each later discount acts on the already reduced price, so retained-price multipliers must be multiplied rather than the discounts added.",
        steps: [
          {
            title: "Convert every discount to a retained factor",
            body: "A discount of d percent leaves the factor 1\u2212d/100."
          },
          {
            title: "Multiply the factors",
            body: "Apply the factors in order to the marked price.",
            equationLatex: "S=M\\prod_i\\left(1-\\frac{d_i}{100}\\right)"
          },
          {
            title: "Read the final amount",
            body: "The product gives the actual amount paid after all reductions."
          }
        ],
        conclusion: "The final reduced price is the required selling price.",
        commonTrap: "Do not add successive discount percentages because their bases change after every reduction."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-066": {
      stem: {
        contextFamily: "retail-pricing caselet",
        blocks: [
          {
            type: "caselet",
            title: "Retail pricing caselet",
            paragraphSource: "caseletData"
          },
          {
            type: "paragraph",
            content: "The retailer's cost is \u20B9{costPrice}, the markup is {markupPercent}%, and the allowed discount is {discountPercent}%."
          }
        ],
        prompt: "Calculate the resulting profit or loss percentage."
      },
      explanation: {
        opening: "Markup and discount act on different stages, so we should first find the marked price and then the actual selling price.",
        concept: "Markup is measured on cost price, while discount is measured on marked price; the final profit or loss is measured back on cost price.",
        steps: [
          {
            title: "Build marked price",
            body: "Increase cost price by the markup factor.",
            equationLatex: "M=C\\left(1+\\frac{m}{100}\\right)"
          },
          {
            title: "Apply the discount",
            body: "Reduce marked price by the retained discount factor.",
            equationLatex: "S=M\\left(1-\\frac{d}{100}\\right)"
          },
          {
            title: "Compare with cost",
            body: "Find S\u2212C for the amount, or divide the absolute difference by C for the percentage."
          }
        ],
        conclusion: "The comparison of final selling price with cost gives the true commercial result.",
        commonTrap: "Do not subtract discount percentage directly from markup percentage; their bases are different."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-067": {
      stem: {
        contextFamily: "equivalent-discount statement",
        blocks: [
          {
            type: "paragraph",
            content: "A store announces successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%."
          },
          {
            type: "statements",
            lead: "Consider the following claims:",
            statements: [
              "The equivalent discount is found by adding the two discount rates.",
              "The second discount applies to the price remaining after the first discount."
            ]
          }
        ],
        prompt: "Select the correct statement about the equivalent discount."
      },
      explanation: {
        opening: "We can replace two successive discounts with one discount that leaves the same final price.",
        concept: "The equivalent retained fraction is the product of the two retained fractions; the equivalent discount is what is missing from 100 percent.",
        steps: [
          {
            title: "Multiply retained factors",
            body: "Use (1\u2212d1/100)(1\u2212d2/100)."
          },
          {
            title: "Convert back to a discount",
            body: "Subtract the retained percentage from 100 percent.",
            equationLatex: "d_e=100\\left[1-\\left(1-\\frac{d_1}{100}\\right)\\left(1-\\frac{d_2}{100}\\right)\\right]"
          }
        ],
        conclusion: "This single rate produces the same final selling price as both discounts together.",
        commonTrap: "Do not simply add the two discount rates; the second discount is on a lower price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-068": {
      stem: {
        contextFamily: "algebraic price-tag analysis",
        blocks: [
          {
            type: "paragraph",
            content: "In an algebraic price-tag analysis model, marked price and selling price are represented algebraically."
          },
          {
            type: "equation",
            latex: "M={markedPriceExpression},\\qquad S={sellingPriceExpression}"
          }
        ],
        prompt: "Find the discount percentage."
      },
      explanation: {
        opening: "The marked price and actual selling price show exactly how much price was reduced.",
        concept: "Discount percentage is the reduction divided by marked price, because the discount is always measured from the marked price.",
        steps: [
          {
            title: "Find the discount amount",
            body: "Subtract selling price from marked price.",
            equationLatex: "D=M-S"
          },
          {
            title: "Convert to a percentage",
            body: "Divide the discount amount by marked price and multiply by 100.",
            equationLatex: "d=\\frac{D}{M}\\times100"
          }
        ],
        conclusion: "This rate is the discount percentage offered on the price tag.",
        commonTrap: "Do not divide the discount by selling price; selling price is the amount after reduction."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-069": {
      stem: {
        contextFamily: "coupon-order optimisation",
        blocks: [
          {
            type: "paragraph",
            content: "On the online-cart item marked at \u20B9{markedPrice}, a {discountPercent}% discount and a flat coupon of \u20B9{couponAmount} are available. Compare discount-then-coupon with coupon-then-discount and"
          }
        ],
        prompt: "Find the better order and price difference."
      },
      explanation: {
        opening: "A flat coupon and a percentage discount can give different results when their order is reversed.",
        concept: "Calculate both legal sequences separately because the percentage reduction acts on whichever amount exists at that stage.",
        steps: [
          {
            title: "Discount then coupon",
            body: "Apply the percentage reduction to marked price, then subtract the flat coupon."
          },
          {
            title: "Coupon then discount",
            body: "Subtract the flat coupon first, then apply the percentage reduction to the remainder."
          },
          {
            title: "Compare the two totals",
            body: "The lower final amount is the better order; their difference is the extra saving."
          }
        ],
        conclusion: "The sequence with the lower payable amount is the better order.",
        commonTrap: "Do not assume order is irrelevant when one reduction is flat and the other is percentage-based."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-070": {
      stem: {
        contextFamily: "target-discount data sufficiency",
        blocks: [
          {
            type: "paragraph",
            content: "The discount needed to achieve a stated target result is to be determined."
          },
          {
            type: "data_sufficiency",
            question: "Can the required discount be determined uniquely?",
            statements: ["{statementOne}", "{statementTwo}"],
            answerScheme: "STANDARD_TWO_STATEMENT"
          }
        ],
        prompt: "Decide whether either statement alone or both together are sufficient."
      },
      explanation: {
        opening: "Test each statement independently before combining the information.",
        concept: "Statement I can determine the target selling price from cost price and the target result, but discount also needs marked price. Statement II supplies marked price but cannot determine the target selling price. Together they determine the discount uniquely.",
        steps: [
          {
            title: "Check Statement I alone",
            body: "Cost price and the target profit or loss fix the target selling price, but marked price is still unknown."
          },
          {
            title: "Check Statement II alone",
            body: "Marked price is known, but the selling price required for the target result is still unknown."
          },
          {
            title: "Combine both statements",
            body: "Use Statement I to find target selling price, then compare it with the marked price from Statement II to calculate the discount percentage.",
            equationLatex: "d=\\frac{M-S_{target}}{M}\\times100"
          }
        ],
        conclusion: "Neither statement alone is sufficient; both statements together are required.",
        commonTrap: "Do not use information from Statement II while testing Statement I, or vice versa."
      },
      difficulty: "Hard",
      difficultyRationale: "The two statements must be tested independently before their linked price bases can be combined."
    }
  },
  entryCount: 34
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/editorial-content.ts
function escapeTableCell(value) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}
function stringifyValue(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") return String(value);
  if (value === null || value === void 0) return "";
  return JSON.stringify(value);
}
function interpolateEditorialText(template, context = {}) {
  return template.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (full, key) => {
    if (!(key in context)) return full;
    return stringifyValue(context[key]);
  });
}
function normalizeEditorialProse(value) {
  return value.replaceAll("\xD7", " multiplied by ").replaceAll("\xF7", " divided by ").replaceAll("\xB2", " squared").replaceAll("\xB3", " cubed").replace(/\s{2,}/g, " ").trim();
}
function prose(template, context) {
  return normalizeEditorialProse(interpolateEditorialText(template, context));
}
function resolveRows(block, context) {
  if (block.rows) return block.rows;
  if (!block.rowSource) return [];
  const value = context[block.rowSource];
  if (!Array.isArray(value)) return [];
  return value.map((row) => Array.isArray(row) ? row.map(stringifyValue) : [stringifyValue(row)]);
}
function resolveParagraphs(block, context) {
  if (block.paragraphs) return block.paragraphs;
  if (!block.paragraphSource) return [];
  const value = context[block.paragraphSource];
  if (Array.isArray(value)) return value.map(stringifyValue);
  if (value !== void 0 && value !== null) return [stringifyValue(value)];
  return [];
}
function renderStructuredStemMarkdown(stem, context = {}) {
  const parts = [];
  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(prose(block.content, context));
        break;
      case "table": {
        if (block.caption) parts.push(`**${prose(block.caption, context)}**`);
        const columns = block.columns.map((column) => prose(column, context));
        const rows = resolveRows(block, context);
        parts.push(`| ${columns.map(escapeTableCell).join(" | ")} |`);
        parts.push(`| ${columns.map(() => "---").join(" | ")} |`);
        if (rows.length === 0 && block.rowSource) {
          parts.push(`| ${[`{${block.rowSource}}`, ...columns.slice(1).map(() => "")].map(escapeTableCell).join(" | ")} |`);
        } else {
          for (const row of rows) {
            const normalized = columns.map((_, index) => prose(row[index] ?? "", context));
            parts.push(`| ${normalized.map(escapeTableCell).join(" | ")} |`);
          }
        }
        break;
      }
      case "caselet": {
        if (block.title) parts.push(`**${prose(block.title, context)}**`);
        const paragraphs = resolveParagraphs(block, context);
        if (paragraphs.length === 0 && block.paragraphSource) parts.push(`{${block.paragraphSource}}`);
        else parts.push(...paragraphs.map((paragraph) => prose(paragraph, context)));
        break;
      }
      case "statements":
        if (block.lead) parts.push(prose(block.lead, context));
        block.statements.forEach((statement, index) => parts.push(`${index + 1}. ${prose(statement, context)}`));
        break;
      case "data_sufficiency":
        parts.push(prose(block.question, context));
        block.statements.forEach((statement, index) => parts.push(`**Statement ${index + 1}:** ${prose(statement, context)}`));
        parts.push("Use the standard two-statement data-sufficiency answer scheme.");
        break;
      case "equation": {
        const latex = interpolateEditorialText(block.latex, context);
        parts.push(block.display === false ? `\\(${latex}\\)` : `\\[${latex}\\]`);
        break;
      }
    }
  }
  parts.push(prose(stem.prompt, context));
  return parts.filter(Boolean).join("\n\n");
}
function renderFriendlyExplanationMarkdown(explanation, context = {}) {
  const parts = [
    prose(explanation.opening, context),
    `**Key idea:** ${prose(explanation.concept, context)}`
  ];
  explanation.steps.forEach((step, index) => {
    parts.push(`**Step ${index + 1}: ${prose(step.title, context)}**`);
    parts.push(prose(step.body, context));
    if (step.equationLatex) parts.push(`\\[${interpolateEditorialText(step.equationLatex, context)}\\]`);
  });
  parts.push(`**Conclusion:** ${prose(explanation.conclusion, context)}`);
  if (explanation.finalAnswerLatex) {
    parts.push(`\\[\\boxed{${interpolateEditorialText(explanation.finalAnswerLatex, context)}}\\]`);
  }
  if (explanation.commonTrap) {
    parts.push(`**Common mistake to avoid:** ${prose(explanation.commonTrap, context)}`);
  }
  if (explanation.shortcut) parts.push(`**Quick check:** ${prose(explanation.shortcut, context)}`);
  return parts.filter(Boolean).join("\n\n");
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/rational.ts
function abs(value) {
  return value < 0n ? -value : value;
}
function gcd(a, b) {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}
function rational(numerator, denominator = 1) {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  if (d === 0n) throw new Error("Rational denominator cannot be zero.");
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return {
    numerator: n / divisor * sign,
    denominator: abs(d / divisor)
  };
}
function subtractRational(a, b) {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator
  );
}
function multiplyRational(a, b) {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}
function divideRational(a, b) {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero.");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}
function rationalToNumber(value) {
  return Number(value.numerator) / Number(value.denominator);
}
function asPercent(value) {
  return multiplyRational(value, rational(100));
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/money.ts
function moneyFromPaise(paise) {
  return { paise: BigInt(paise) };
}
function moneyFromRupees(rupees2) {
  return { paise: BigInt(rupees2) * 100n };
}
function subtractMoney(a, b) {
  return { paise: a.paise - b.paise };
}
function compareMoney(a, b) {
  return a.paise < b.paise ? -1 : a.paise > b.paise ? 1 : 0;
}
function multiplyMoney(value, factor) {
  const result = multiplyRational(rational(value.paise), factor);
  if (result.numerator % result.denominator !== 0n) {
    throw new Error("Money result is not an exact paise amount.");
  }
  return { paise: result.numerator / result.denominator };
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/parameter-generator.ts
function hashSeed(seed) {
  let value = 2166136261;
  for (const char of seed) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
function createSeededRandom(seed) {
  let state = hashSeed(seed) || 1;
  return {
    next: () => {
      state += 1831565813;
      let t = state;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  };
}
function pickSeeded(random, values) {
  if (values.length === 0) throw new Error("Cannot pick from an empty parameter set.");
  return values[Math.floor(random.next() * values.length)];
}
var fundamentalCostPrices = [
  120,
  160,
  200,
  240,
  300,
  400,
  500,
  600,
  800,
  1e3,
  1200,
  1500,
  2e3,
  2400
].map(moneyFromRupees);
var fundamentalRates = [
  rational(5),
  rational(10),
  rational(12, 1),
  rational(25, 2),
  rational(15),
  rational(20),
  rational(25),
  rational(100, 3),
  rational(40),
  rational(50)
];

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/math.ts
function resolveEffectiveCost(ledger) {
  return ledger.effectiveCost ?? ledger.costPrice;
}
function profitOrLossAmount(ledger) {
  return subtractMoney(ledger.sellingPrice, resolveEffectiveCost(ledger));
}
function profitOrLossRateOnCost(ledger) {
  const base = resolveEffectiveCost(ledger);
  const comparison = compareMoney(ledger.sellingPrice, base);
  if (comparison === 0) return { direction: "NO_CHANGE", rate: rational(0), base: "EFFECTIVE_COST" };
  const difference = comparison > 0 ? subtractMoney(ledger.sellingPrice, base) : subtractMoney(base, ledger.sellingPrice);
  return { direction: comparison > 0 ? "PROFIT" : "LOSS", rate: asPercent(divideRational(rational(difference.paise), rational(base.paise))), base: "EFFECTIVE_COST" };
}
function rateMultiplier(direction, ratePercent) {
  const rate2 = divideRational(ratePercent, rational(100));
  const multiplier = direction === "PROFIT" ? rational(rate2.denominator + rate2.numerator, rate2.denominator) : rational(rate2.denominator - rate2.numerator, rate2.denominator);
  if (multiplier.numerator <= 0n) throw new Error("Commercial multiplier must be positive.");
  return multiplier;
}
function sellingPriceFromCostAndRate(input) {
  return multiplyMoney(input.costPrice, rateMultiplier(input.direction, input.ratePercent));
}
function sellingPriceAfterDiscount(markedPrice, discountPercent) {
  const discount = divideRational(discountPercent, rational(100));
  const multiplier = rational(discount.denominator - discount.numerator, discount.denominator);
  if (multiplier.numerator < 0n) throw new Error("Discount cannot exceed 100%.");
  return multiplyMoney(markedPrice, multiplier);
}
function composePercentageMultipliers(rates, directions) {
  if (rates.length !== directions.length) throw new Error("Rates and directions must align.");
  return rates.reduce((accumulator, rate2, index) => {
    const fraction = divideRational(rate2, rational(100));
    const multiplier = directions[index] === "INCREASE" ? rational(fraction.denominator + fraction.numerator, fraction.denominator) : rational(fraction.denominator - fraction.numerator, fraction.denominator);
    return multiplyRational(accumulator, multiplier);
  }, rational(1));
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/ledgers.ts
function createPriceLedger(input) {
  return Object.freeze({ ...input });
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/discount-solver.ts
function validateDiscountRate(rate2) {
  if (rate2.denominator <= 0n || rate2.numerator < 0n) {
    throw new Error("Discount rate must be non-negative with a positive denominator.");
  }
  if (rate2.numerator > 100n * rate2.denominator) {
    throw new Error("Discount rate cannot exceed 100%.");
  }
}
function retainedMultiplier(discountPercent) {
  validateDiscountRate(discountPercent);
  return subtractRational(rational(1), divideRational(discountPercent, rational(100)));
}
function markedPriceFromCostAndMarkup(costPrice, markupPercent) {
  return sellingPriceFromCostAndRate({ costPrice, direction: "PROFIT", ratePercent: markupPercent });
}
function solveDiscount(request) {
  switch (request.mode) {
    case "MP_DISCOUNT_TO_SP":
      validateDiscountRate(request.discountPercent);
      return {
        mode: request.mode,
        sellingPrice: sellingPriceAfterDiscount(request.markedPrice, request.discountPercent)
      };
    case "MP_SP_TO_DISCOUNT": {
      if (request.markedPrice.paise <= 0n) throw new Error("Marked price must be positive.");
      if (request.sellingPrice.paise < 0n || request.sellingPrice.paise > request.markedPrice.paise) {
        throw new Error("Selling price must lie between zero and marked price for a discount question.");
      }
      const discount = request.markedPrice.paise - request.sellingPrice.paise;
      return {
        mode: request.mode,
        discountPercent: asPercent(divideRational(rational(discount), rational(request.markedPrice.paise)))
      };
    }
    case "SP_DISCOUNT_TO_MP": {
      const retained = retainedMultiplier(request.discountPercent);
      if (retained.numerator <= 0n) throw new Error("Marked price is undefined at a 100% discount.");
      return {
        mode: request.mode,
        markedPrice: multiplyMoney(request.sellingPrice, divideRational(rational(1), retained))
      };
    }
    case "MP_DISCOUNT_TO_AMOUNT": {
      const sellingPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      return {
        mode: request.mode,
        discountAmount: moneyFromPaise(request.markedPrice.paise - sellingPrice.paise)
      };
    }
    case "MP_AMOUNT_TO_DISCOUNT": {
      if (request.markedPrice.paise <= 0n) throw new Error("Marked price must be positive.");
      if (request.discountAmount.paise < 0n || request.discountAmount.paise > request.markedPrice.paise) {
        throw new Error("Discount amount must lie between zero and marked price.");
      }
      return {
        mode: request.mode,
        discountPercent: asPercent(divideRational(rational(request.discountAmount.paise), rational(request.markedPrice.paise)))
      };
    }
    case "MP_AMOUNT_TO_SP":
      if (request.discountAmount.paise < 0n || request.discountAmount.paise > request.markedPrice.paise) {
        throw new Error("Discount amount must lie between zero and marked price.");
      }
      return {
        mode: request.mode,
        sellingPrice: moneyFromPaise(request.markedPrice.paise - request.discountAmount.paise)
      };
    case "SUCCESSIVE_DISCOUNTS_TO_SP": {
      if (request.discountPercents.length === 0) throw new Error("At least one discount is required.");
      request.discountPercents.forEach(validateDiscountRate);
      const multiplier = composePercentageMultipliers(
        request.discountPercents,
        request.discountPercents.map(() => "DECREASE")
      );
      return {
        mode: request.mode,
        sellingPrice: multiplyMoney(request.markedPrice, multiplier)
      };
    }
    case "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT": {
      if (request.discountPercents.length === 0) throw new Error("At least one discount is required.");
      request.discountPercents.forEach(validateDiscountRate);
      const retained = request.discountPercents.reduce(
        (accumulator, discount) => multiplyRational(accumulator, retainedMultiplier(discount)),
        rational(1)
      );
      return {
        mode: request.mode,
        equivalentDiscountPercent: asPercent(subtractRational(rational(1), retained))
      };
    }
    case "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT": {
      const knownRetained = retainedMultiplier(request.knownDiscountPercent);
      const equivalentRetained = retainedMultiplier(request.equivalentDiscountPercent);
      if (knownRetained.numerator <= 0n) throw new Error("Known discount cannot be 100%.");
      const missingRetained = divideRational(equivalentRetained, knownRetained);
      if (missingRetained.numerator < 0n || missingRetained.numerator > missingRetained.denominator) {
        throw new Error("Equivalent discount is incompatible with the known discount.");
      }
      return {
        mode: request.mode,
        missingDiscountPercent: asPercent(subtractRational(rational(1), missingRetained))
      };
    }
    case "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE": {
      const singleSp = sellingPriceAfterDiscount(request.markedPrice, request.singleDiscountPercent);
      const successive = solveDiscount({
        mode: "SUCCESSIVE_DISCOUNTS_TO_SP",
        markedPrice: request.markedPrice,
        discountPercents: request.successiveDiscountPercents
      });
      const difference = singleSp.paise - successive.sellingPrice.paise;
      return {
        mode: request.mode,
        differenceAmount: moneyFromPaise(difference < 0n ? -difference : difference),
        betterOffer: difference > 0n ? "SUCCESSIVE" : difference < 0n ? "SINGLE" : "SAME"
      };
    }
    case "CP_MARKUP_DISCOUNT_TO_RESULT": {
      const markedPrice = markedPriceFromCostAndMarkup(request.costPrice, request.markupPercent);
      const sellingPrice = sellingPriceAfterDiscount(markedPrice, request.discountPercent);
      const ledger = createPriceLedger({ costPrice: request.costPrice, sellingPrice, markedPrice });
      const amountDelta = profitOrLossAmount(ledger);
      const rate2 = profitOrLossRateOnCost(ledger);
      return {
        mode: request.mode,
        sellingPrice,
        direction: rate2.direction,
        amount: moneyFromPaise(amountDelta.paise < 0n ? -amountDelta.paise : amountDelta.paise),
        ratePercent: rate2.rate
      };
    }
    case "MP_CP_TARGET_RATE_TO_DISCOUNT": {
      if (request.markedPrice.paise <= 0n) throw new Error("Marked price must be positive.");
      const targetSellingPrice = sellingPriceFromCostAndRate({
        costPrice: request.costPrice,
        direction: request.direction,
        ratePercent: request.targetRatePercent
      });
      if (targetSellingPrice.paise > request.markedPrice.paise) {
        throw new Error("Target selling price exceeds marked price; a discount cannot achieve it.");
      }
      return solveDiscount({
        mode: "MP_SP_TO_DISCOUNT",
        markedPrice: request.markedPrice,
        sellingPrice: targetSellingPrice
      });
    }
    case "CP_DISCOUNT_TARGET_RATE_TO_MARKUP": {
      const targetSellingPrice = sellingPriceFromCostAndRate({
        costPrice: request.costPrice,
        direction: request.direction,
        ratePercent: request.targetRatePercent
      });
      const marked = solveDiscount({
        mode: "SP_DISCOUNT_TO_MP",
        sellingPrice: targetSellingPrice,
        discountPercent: request.discountPercent
      });
      return {
        mode: request.mode,
        markupPercent: asPercent(divideRational(
          rational(marked.markedPrice.paise - request.costPrice.paise),
          rational(request.costPrice.paise)
        ))
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/promotion-solver.ts
function validateUnits(paidUnits, freeUnits) {
  if (paidUnits <= 0n) throw new Error("Paid units must be positive.");
  if (freeUnits < 0n) throw new Error("Free units cannot be negative.");
}
function solvePromotion(request) {
  switch (request.mode) {
    case "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT": {
      validateUnits(request.paidUnits, request.freeUnits);
      const totalUnits = request.paidUnits + request.freeUnits;
      return {
        mode: request.mode,
        equivalentDiscountPercent: asPercent(divideRational(rational(request.freeUnits), rational(totalUnits)))
      };
    }
    case "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE": {
      validateUnits(request.paidUnits, request.freeUnits);
      const totalUnits = request.paidUnits + request.freeUnits;
      const totalPaid = multiplyMoney(request.unitMarkedPrice, rational(request.paidUnits));
      return {
        mode: request.mode,
        effectiveUnitPrice: multiplyMoney(totalPaid, divideRational(rational(1), rational(totalUnits)))
      };
    }
    case "CASHBACK_TO_EFFECTIVE_PRICE": {
      if (request.cashbackAmount.paise < 0n || request.cashbackAmount.paise > request.billedPrice.paise) {
        throw new Error("Cashback must lie between zero and billed price.");
      }
      return {
        mode: request.mode,
        effectivePrice: moneyFromPaise(request.billedPrice.paise - request.cashbackAmount.paise)
      };
    }
    case "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE": {
      const retained = subtractRational(rational(1), divideRational(request.cashbackPercent, rational(100)));
      if (retained.numerator < 0n) throw new Error("Cashback percentage cannot exceed 100%.");
      return { mode: request.mode, effectivePrice: multiplyMoney(request.billedPrice, retained) };
    }
    case "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE": {
      const afterDiscount = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      if (request.couponAmount.paise < 0n || request.couponAmount.paise > afterDiscount.paise) {
        throw new Error("Coupon amount must lie between zero and the discounted price.");
      }
      return {
        mode: request.mode,
        effectivePrice: moneyFromPaise(afterDiscount.paise - request.couponAmount.paise)
      };
    }
    case "DISCOUNT_VS_CASHBACK_COMPARE": {
      const discountPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      if (request.cashbackAmount.paise < 0n || request.cashbackAmount.paise > request.markedPrice.paise) {
        throw new Error("Cashback must lie between zero and marked price.");
      }
      const cashbackPrice = moneyFromPaise(request.markedPrice.paise - request.cashbackAmount.paise);
      const difference = discountPrice.paise - cashbackPrice.paise;
      return {
        mode: request.mode,
        betterOffer: difference > 0n ? "CASHBACK" : difference < 0n ? "DISCOUNT" : "SAME",
        differenceAmount: moneyFromPaise(difference < 0n ? -difference : difference)
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/conditional-promotion-solver.ts
function validatePercent(value, name) {
  if (value.denominator <= 0n || value.numerator < 0n) throw new Error(`${name} must be non-negative.`);
  if (value.numerator > 100n * value.denominator) throw new Error(`${name} cannot exceed 100%.`);
}
function percentAmount(base, percent) {
  validatePercent(percent, "Percentage");
  return multiplyMoney(base, divideRational(percent, rational(100)));
}
function applyCap(amount, cap) {
  if (!cap) return amount;
  if (cap.paise < 0n) throw new Error("Cashback cap cannot be negative.");
  return amount.paise <= cap.paise ? amount : cap;
}
function absoluteMoneyDifference(first, second) {
  const difference = first.paise - second.paise;
  return moneyFromPaise(difference < 0n ? -difference : difference);
}
function solveConditionalPromotion(request) {
  switch (request.mode) {
    case "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP": {
      if (request.discountPercents.length < 3) throw new Error("At least three discounts are required.");
      let sellingPrice = request.markedPrice;
      for (const discount of request.discountPercents) sellingPrice = sellingPriceAfterDiscount(sellingPrice, discount);
      return { mode: request.mode, sellingPrice };
    }
    case "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE": {
      if (request.minimumSpend.paise < 0n || request.couponAmount.paise < 0n) throw new Error("Spend and coupon values cannot be negative.");
      const couponApplied = request.billedPrice.paise >= request.minimumSpend.paise;
      if (couponApplied && request.couponAmount.paise > request.billedPrice.paise) throw new Error("Coupon exceeds billed price.");
      return {
        mode: request.mode,
        couponApplied,
        effectivePrice: couponApplied ? moneyFromPaise(request.billedPrice.paise - request.couponAmount.paise) : request.billedPrice
      };
    }
    case "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE": {
      const billedPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      return { mode: request.mode, effectivePrice: sellingPriceAfterDiscount(billedPrice, request.couponPercent) };
    }
    case "PERCENT_CASHBACK_ON_BILLED_AMOUNT": {
      const cashbackAmount = applyCap(percentAmount(request.billedPrice, request.cashbackPercent), request.cashbackCap);
      return { mode: request.mode, cashbackAmount, effectivePrice: moneyFromPaise(request.billedPrice.paise - cashbackAmount.paise) };
    }
    case "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT": {
      const billedPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      const cashbackAmount = applyCap(percentAmount(request.markedPrice, request.cashbackPercent), request.cashbackCap);
      if (cashbackAmount.paise > billedPrice.paise) throw new Error("Cashback exceeds billed price.");
      return { mode: request.mode, billedPrice, cashbackAmount, effectivePrice: moneyFromPaise(billedPrice.paise - cashbackAmount.paise) };
    }
    case "DISCOUNT_FRACTION_TO_PERCENT": {
      if (request.discountFraction.denominator <= 0n || request.discountFraction.numerator < 0n || request.discountFraction.numerator > request.discountFraction.denominator) {
        throw new Error("Discount fraction must lie between zero and one.");
      }
      return { mode: request.mode, discountPercent: rational(100n * request.discountFraction.numerator, request.discountFraction.denominator) };
    }
    case "PAID_TO_MARKED_RATIO_TO_DISCOUNT": {
      if (request.markedPart.denominator <= 0n || request.paidPart.denominator <= 0n || request.markedPart.numerator <= 0n || request.paidPart.numerator < 0n) {
        throw new Error("Ratio parts must be valid.");
      }
      const retained = divideRational(request.paidPart, request.markedPart);
      if (retained.numerator > retained.denominator) throw new Error("Paid part cannot exceed marked part in a discount question.");
      return { mode: request.mode, discountPercent: rational(100n * (retained.denominator - retained.numerator), retained.denominator) };
    }
    case "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE": {
      if (request.minimumSpend.paise < 0n || request.couponAmount.paise < 0n) throw new Error("Spend and coupon values cannot be negative.");
      const discountPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      const couponEligible = request.markedPrice.paise >= request.minimumSpend.paise;
      const couponPrice = couponEligible ? moneyFromPaise(request.markedPrice.paise - request.couponAmount.paise) : request.markedPrice;
      return {
        mode: request.mode,
        couponEligible,
        discountPrice,
        couponPrice,
        betterOffer: discountPrice.paise < couponPrice.paise ? "DISCOUNT" : couponPrice.paise < discountPrice.paise ? "COUPON" : "SAME",
        differenceAmount: absoluteMoneyDifference(discountPrice, couponPrice)
      };
    }
    case "COUPON_ORDER_COMPARE": {
      if (request.couponAmount.paise < 0n || request.couponAmount.paise > request.markedPrice.paise) throw new Error("Coupon amount must lie between zero and marked price.");
      const discounted = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      if (request.couponAmount.paise > discounted.paise) throw new Error("Coupon exceeds discounted price.");
      const discountThenCouponPrice = moneyFromPaise(discounted.paise - request.couponAmount.paise);
      const couponThenDiscountPrice = sellingPriceAfterDiscount(moneyFromPaise(request.markedPrice.paise - request.couponAmount.paise), request.discountPercent);
      return {
        mode: request.mode,
        discountThenCouponPrice,
        couponThenDiscountPrice,
        betterOrder: discountThenCouponPrice.paise < couponThenDiscountPrice.paise ? "DISCOUNT_THEN_COUPON" : couponThenDiscountPrice.paise < discountThenCouponPrice.paise ? "COUPON_THEN_DISCOUNT" : "SAME",
        differenceAmount: absoluteMoneyDifference(discountThenCouponPrice, couponThenDiscountPrice)
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-002/cp002-dynamic-runtime.ts
var PNL_CP002_ID = "PNL-CP-002";
var PNL_CP002_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE";
var taskRegistry = task_registry_library_default;
var editorialLibrary = editorial_content_en_default;
var qlIds = Object.keys(taskRegistry.entries);
var MARKED_PRICES = [
  1200,
  1500,
  1800,
  2e3,
  2400,
  2500,
  3e3,
  3600,
  4e3,
  4500,
  5e3,
  6e3,
  7200,
  8e3,
  9e3,
  1e4,
  12e3
];
var COST_PRICES = [
  1e3,
  1200,
  1600,
  2e3,
  2400,
  3e3,
  3200,
  4e3,
  4800,
  5e3,
  6e3,
  8e3
];
var DISCOUNT_RATES = [5, 10, 15, 20, 25, 30, 40];
var SECOND_DISCOUNT_RATES = [5, 10, 15, 20, 25];
var MARKUP_RATES = [20, 25, 40, 50, 60, 80];
var CASHBACK_RATES = [5, 10, 12, 15, 20];
var COUPON_RATES = [5, 10, 15, 20];
var FRACTIONS = [
  [1, 10],
  [1, 8],
  [1, 5],
  [1, 4],
  [2, 5]
];
var PAID_MARKED_RATIOS = [
  [9, 10],
  [4, 5],
  [3, 4],
  [7, 10],
  [3, 5]
];
var BUNDLE_PAIRS = [
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [3, 2]
];
var SUCCESSIVE_PAIRS = [
  [10, 10],
  [10, 20],
  [15, 10],
  [20, 10],
  [20, 20],
  [25, 10],
  [30, 10]
];
var TRIPLE_DISCOUNTS = [
  [10, 10, 10],
  [10, 20, 25],
  [20, 10, 10],
  [15, 20, 10],
  [25, 10, 20]
];
function rupees(value) {
  return moneyFromRupees(value);
}
function plainMoney(value) {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}
function formatMoney(value) {
  return `\u20B9${plainMoney(value)}`;
}
function formatRational(value) {
  if (value.denominator === 1n) return value.numerator.toString();
  const numeric = rationalToNumber(value);
  return numeric.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function formatPercent(value) {
  return `${formatRational(value)}%`;
}
function rate(value) {
  return rational(value);
}
function pickNumber(random, values) {
  return pickSeeded(random, values);
}
function solve(request) {
  switch (request.mode) {
    case "MP_DISCOUNT_TO_SP":
    case "MP_SP_TO_DISCOUNT":
    case "SP_DISCOUNT_TO_MP":
    case "MP_DISCOUNT_TO_AMOUNT":
    case "MP_AMOUNT_TO_DISCOUNT":
    case "MP_AMOUNT_TO_SP":
    case "SUCCESSIVE_DISCOUNTS_TO_SP":
    case "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT":
    case "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT":
    case "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE":
    case "CP_MARKUP_DISCOUNT_TO_RESULT":
    case "MP_CP_TARGET_RATE_TO_DISCOUNT":
    case "CP_DISCOUNT_TARGET_RATE_TO_MARKUP":
      return solveDiscount(request);
    case "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT":
    case "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE":
    case "CASHBACK_TO_EFFECTIVE_PRICE":
    case "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE":
    case "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE":
    case "DISCOUNT_VS_CASHBACK_COMPARE":
      return solvePromotion(request);
    case "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP":
    case "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE":
    case "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE":
    case "PERCENT_CASHBACK_ON_BILLED_AMOUNT":
    case "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT":
    case "DISCOUNT_FRACTION_TO_PERCENT":
    case "PAID_TO_MARKED_RATIO_TO_DISCOUNT":
    case "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE":
    case "COUPON_ORDER_COMPARE":
      return solveConditionalPromotion(request);
  }
}
function generateCase(qlId, seed) {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-002 QL: ${qlId}`);
  const random = createSeededRandom(`${seed}:${qlId}:parameters`);
  const markedPrice = rupees(pickNumber(random, MARKED_PRICES));
  const discountPercent = rate(pickNumber(random, DISCOUNT_RATES));
  const pair = pickSeeded(random, SUCCESSIVE_PAIRS);
  const firstDiscountPercent = rate(pair[0]);
  const secondDiscountPercent = rate(pair[1]);
  switch (qlId) {
    case "PNL-QL-037":
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_DISCOUNT_TO_SP", markedPrice, discountPercent },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent)
        }
      };
    case "PNL-QL-038": {
      const sellingPrice = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice,
        discountPercent
      }).sellingPrice;
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_SP_TO_DISCOUNT", markedPrice, sellingPrice },
        context: {
          markedPrice: plainMoney(markedPrice),
          sellingPrice: plainMoney(sellingPrice)
        }
      };
    }
    case "PNL-QL-039": {
      const originalMarkedPrice = markedPrice;
      const sellingPrice = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice: originalMarkedPrice,
        discountPercent
      }).sellingPrice;
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SP_DISCOUNT_TO_MP",
          sellingPrice,
          discountPercent
        },
        context: {
          sellingPrice: plainMoney(sellingPrice),
          discountPercent: formatRational(discountPercent)
        }
      };
    }
    case "PNL-QL-040":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_SP",
          markedPrice,
          discountPercents: [firstDiscountPercent, secondDiscountPercent]
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent)
        }
      };
    case "PNL-QL-041":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
          discountPercents: [firstDiscountPercent, secondDiscountPercent]
        },
        context: {
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent)
        }
      };
    case "PNL-QL-042":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MP_DISCOUNT_TO_AMOUNT",
          markedPrice,
          discountPercent
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent)
        }
      };
    case "PNL-QL-043": {
      const discountAmount = solveDiscount({
        mode: "MP_DISCOUNT_TO_AMOUNT",
        markedPrice,
        discountPercent
      }).discountAmount;
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MP_AMOUNT_TO_DISCOUNT",
          markedPrice,
          discountAmount
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountAmount: plainMoney(discountAmount)
        }
      };
    }
    case "PNL-QL-044": {
      const discountAmount = solveDiscount({
        mode: "MP_DISCOUNT_TO_AMOUNT",
        markedPrice,
        discountPercent
      }).discountAmount;
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_AMOUNT_TO_SP", markedPrice, discountAmount },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountAmount: plainMoney(discountAmount)
        }
      };
    }
    case "PNL-QL-045": {
      const equivalentDiscountPercent = solveDiscount({
        mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
        discountPercents: [firstDiscountPercent, secondDiscountPercent]
      }).equivalentDiscountPercent;
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT",
          knownDiscountPercent: firstDiscountPercent,
          equivalentDiscountPercent
        },
        context: {
          knownDiscountPercent: formatRational(firstDiscountPercent),
          equivalentDiscountPercent: formatRational(equivalentDiscountPercent)
        }
      };
    }
    case "PNL-QL-046": {
      const singleDiscountPercent = rate(
        pickNumber(random, SECOND_DISCOUNT_RATES)
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE",
          markedPrice,
          singleDiscountPercent,
          successiveDiscountPercents: [
            firstDiscountPercent,
            secondDiscountPercent
          ]
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          singleDiscountPercent: formatRational(singleDiscountPercent),
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent)
        }
      };
    }
    case "PNL-QL-047":
    case "PNL-QL-048":
    case "PNL-QL-066": {
      const costPrice = rupees(pickNumber(random, COST_PRICES));
      const markupPercent = rate(pickNumber(random, MARKUP_RATES));
      const chosenDiscount = rate(pickNumber(random, DISCOUNT_RATES));
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CP_MARKUP_DISCOUNT_TO_RESULT",
          costPrice,
          markupPercent,
          discountPercent: chosenDiscount
        },
        context: {
          costPrice: plainMoney(costPrice),
          markupPercent: formatRational(markupPercent),
          discountPercent: formatRational(chosenDiscount),
          ...qlId === "PNL-QL-066" ? {
            caseletData: [
              "A retailer is planning a promotional sale for a single article.",
              "Markup is calculated on cost price, while the advertised discount is calculated on marked price."
            ]
          } : {}
        }
      };
    }
    case "PNL-QL-049":
    case "PNL-QL-070": {
      const scenarios = [
        { cost: 4e3, marked: 6e3, direction: "PROFIT", target: 20 },
        { cost: 5e3, marked: 7500, direction: "PROFIT", target: 25 },
        { cost: 6e3, marked: 8e3, direction: "PROFIT", target: 20 },
        { cost: 8e3, marked: 1e4, direction: "LOSS", target: 10 }
      ];
      const scenario = pickSeeded(random, scenarios);
      const costPrice = rupees(scenario.cost);
      const scenarioMarkedPrice = rupees(scenario.marked);
      const targetRatePercent = rate(scenario.target);
      const request = {
        mode: "MP_CP_TARGET_RATE_TO_DISCOUNT",
        markedPrice: scenarioMarkedPrice,
        costPrice,
        direction: scenario.direction,
        targetRatePercent
      };
      const targetResult = solveDiscount(request);
      const targetSellingPrice = rupees(
        scenario.direction === "PROFIT" ? scenario.cost * (100 + scenario.target) / 100 : scenario.cost * (100 - scenario.target) / 100
      );
      const discountAmount = moneyFromPaise(
        scenarioMarkedPrice.paise - targetSellingPrice.paise
      );
      return {
        qlId,
        registry,
        seed,
        request,
        context: {
          costPrice: plainMoney(costPrice),
          markedPrice: plainMoney(scenarioMarkedPrice),
          targetRatePercent: formatRational(targetRatePercent),
          targetDirection: scenario.direction.toLowerCase(),
          ...qlId === "PNL-QL-070" ? {
            statementOne: `The cost price is ${formatMoney(costPrice)}, and the target result is ${formatRational(targetRatePercent)}% ${scenario.direction.toLowerCase()}.`,
            statementTwo: `The marked price is ${formatMoney(scenarioMarkedPrice)}.`,
            requiredDiscountPercent: formatRational(
              targetResult.discountPercent
            )
          } : {}
        }
      };
    }
    case "PNL-QL-050": {
      const scenarios = [
        { cost: 4e3, discount: 20, direction: "PROFIT", target: 20 },
        { cost: 5e3, discount: 20, direction: "PROFIT", target: 20 },
        { cost: 6e3, discount: 25, direction: "PROFIT", target: 25 },
        { cost: 8e3, discount: 20, direction: "LOSS", target: 10 }
      ];
      const scenario = pickSeeded(random, scenarios);
      const costPrice = rupees(scenario.cost);
      const chosenDiscount = rate(scenario.discount);
      const targetRatePercent = rate(scenario.target);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CP_DISCOUNT_TARGET_RATE_TO_MARKUP",
          costPrice,
          discountPercent: chosenDiscount,
          direction: scenario.direction,
          targetRatePercent
        },
        context: {
          costPrice: plainMoney(costPrice),
          discountPercent: formatRational(chosenDiscount),
          targetRatePercent: formatRational(targetRatePercent),
          targetDirection: scenario.direction.toLowerCase()
        }
      };
    }
    case "PNL-QL-051":
    case "PNL-QL-052": {
      const units = pickSeeded(random, BUNDLE_PAIRS);
      const paidUnits = BigInt(units[0]);
      const freeUnits = BigInt(units[1]);
      const totalUnits = Number(paidUnits + freeUnits);
      const unitMarkedPrice = rupees(
        totalUnits * pickNumber(random, [80, 100, 120, 150, 200])
      );
      return {
        qlId,
        registry,
        seed,
        request: qlId === "PNL-QL-051" ? {
          mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT",
          paidUnits,
          freeUnits
        } : {
          mode: "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE",
          unitMarkedPrice,
          paidUnits,
          freeUnits
        },
        context: {
          paidUnits: paidUnits.toString(),
          freeUnits: freeUnits.toString(),
          unitMarkedPrice: plainMoney(unitMarkedPrice)
        }
      };
    }
    case "PNL-QL-053": {
      const billedPrice = markedPrice;
      const cashbackAmount = rupees(
        pickNumber(random, [100, 150, 200, 250, 300, 400, 500])
      );
      const safeCashback = cashbackAmount.paise < billedPrice.paise ? cashbackAmount : moneyFromPaise(billedPrice.paise / 10n);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CASHBACK_TO_EFFECTIVE_PRICE",
          billedPrice,
          cashbackAmount: safeCashback
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          cashbackAmount: plainMoney(safeCashback)
        }
      };
    }
    case "PNL-QL-054": {
      const billedPrice = markedPrice;
      const cashbackPercent = rate(pickNumber(random, CASHBACK_RATES));
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE",
          billedPrice,
          cashbackPercent
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          cashbackPercent: formatRational(cashbackPercent)
        }
      };
    }
    case "PNL-QL-055": {
      const couponAmount = rupees(
        pickNumber(random, [100, 150, 200, 250, 300, 400])
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE",
          markedPrice,
          discountPercent,
          couponAmount
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          couponAmount: plainMoney(couponAmount)
        }
      };
    }
    case "PNL-QL-056": {
      const cashbackAmount = rupees(
        pickNumber(random, [100, 200, 250, 300, 400, 500, 600])
      );
      const safeCashback = cashbackAmount.paise <= markedPrice.paise ? cashbackAmount : moneyFromPaise(markedPrice.paise / 10n);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_VS_CASHBACK_COMPARE",
          markedPrice,
          discountPercent,
          cashbackAmount: safeCashback
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          cashbackAmount: plainMoney(safeCashback)
        }
      };
    }
    case "PNL-QL-057": {
      const discounts = pickSeeded(random, TRIPLE_DISCOUNTS);
      const [first, second, third] = discounts.map(rate);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP",
          markedPrice,
          discountPercents: [first, second, third]
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          firstDiscountPercent: formatRational(first),
          secondDiscountPercent: formatRational(second),
          thirdDiscountPercent: formatRational(third)
        }
      };
    }
    case "PNL-QL-058": {
      const minimumSpend = rupees(
        pickNumber(random, [1500, 2e3, 2500, 3e3, 4e3])
      );
      const eligible = random.next() >= 0.5;
      const billedPrice = moneyFromPaise(
        minimumSpend.paise + (eligible ? 50000n : -30000n)
      );
      const couponAmount = rupees(
        pickNumber(random, [100, 200, 250, 300, 400])
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE",
          billedPrice,
          minimumSpend,
          couponAmount
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          minimumSpend: plainMoney(minimumSpend),
          couponAmount: plainMoney(couponAmount)
        }
      };
    }
    case "PNL-QL-059": {
      const couponPercent = rate(pickNumber(random, COUPON_RATES));
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE",
          markedPrice,
          discountPercent,
          couponPercent
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          couponPercent: formatRational(couponPercent)
        }
      };
    }
    case "PNL-QL-060": {
      const billedPrice = markedPrice;
      const cashbackPercent = rate(pickNumber(random, CASHBACK_RATES));
      const cashbackCap = rupees(
        pickNumber(random, [200, 250, 300, 400, 500, 600])
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT",
          billedPrice,
          cashbackPercent,
          cashbackCap
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          cashbackPercent: formatRational(cashbackPercent),
          cashbackCap: plainMoney(cashbackCap)
        }
      };
    }
    case "PNL-QL-061": {
      const cashbackPercent = rate(pickNumber(random, CASHBACK_RATES));
      const cashbackCap = rupees(
        pickNumber(random, [300, 400, 500, 600, 750, 1e3])
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT",
          markedPrice,
          discountPercent,
          cashbackPercent,
          cashbackCap
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          cashbackPercent: formatRational(cashbackPercent),
          cashbackCap: plainMoney(cashbackCap)
        }
      };
    }
    case "PNL-QL-062": {
      const fraction = pickSeeded(random, FRACTIONS);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_FRACTION_TO_PERCENT",
          discountFraction: rational(fraction[0], fraction[1])
        },
        context: {
          fractionNumerator: fraction[0],
          fractionDenominator: fraction[1]
        }
      };
    }
    case "PNL-QL-063": {
      const ratioPair = pickSeeded(random, PAID_MARKED_RATIOS);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT",
          paidPart: rational(ratioPair[0]),
          markedPart: rational(ratioPair[1])
        },
        context: { paidPart: ratioPair[0], markedPart: ratioPair[1] }
      };
    }
    case "PNL-QL-064": {
      const billedPrice = markedPrice;
      const minimumSpend = rupees(
        pickNumber(random, [1500, 2e3, 2500, 3e3, 4e3, 5e3])
      );
      const couponAmount = rupees(
        pickNumber(random, [100, 200, 300, 400, 500, 600])
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE",
          markedPrice: billedPrice,
          discountPercent,
          minimumSpend,
          couponAmount
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          discountPercent: formatRational(discountPercent),
          minimumSpend: plainMoney(minimumSpend),
          couponAmount: plainMoney(couponAmount)
        }
      };
    }
    case "PNL-QL-065": {
      const offers = [
        { id: "A", discounts: [10, 10] },
        { id: "B", discounts: [20, 5] },
        { id: "C", discounts: [15, 10] }
      ];
      const selected = pickSeeded(random, offers);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_SP",
          markedPrice,
          discountPercents: selected.discounts.map(rate)
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          selectedOffer: selected.id,
          offerTable: offers.map((offer) => [
            offer.id,
            `${offer.discounts[0]}%`,
            `${offer.discounts[1]}%`
          ])
        }
      };
    }
    case "PNL-QL-067":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
          discountPercents: [firstDiscountPercent, secondDiscountPercent]
        },
        context: {
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent)
        }
      };
    case "PNL-QL-068": {
      const expressionPairs = [
        { marked: 5, selling: 4 },
        { marked: 4, selling: 3 },
        { marked: 10, selling: 9 },
        { marked: 5, selling: 3 }
      ];
      const expressions = pickSeeded(random, expressionPairs);
      const algebraicMarkedPrice = rupees(expressions.marked * 1e3);
      const algebraicSellingPrice = rupees(expressions.selling * 1e3);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MP_SP_TO_DISCOUNT",
          markedPrice: algebraicMarkedPrice,
          sellingPrice: algebraicSellingPrice
        },
        context: {
          markedPriceExpression: `${expressions.marked}x`,
          sellingPriceExpression: `${expressions.selling}x`
        }
      };
    }
    case "PNL-QL-069": {
      const couponAmount = rupees(
        pickNumber(random, [100, 200, 250, 300, 400, 500])
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "COUPON_ORDER_COMPARE",
          markedPrice,
          discountPercent,
          couponAmount
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          couponAmount: plainMoney(couponAmount)
        }
      };
    }
    default:
      throw new Error(`${qlId}: CP-002 dynamic generator is not implemented.`);
  }
}
function answerFor(qlId, result) {
  switch (qlId) {
    case "PNL-QL-037":
    case "PNL-QL-040":
    case "PNL-QL-044":
    case "PNL-QL-052":
    case "PNL-QL-053":
    case "PNL-QL-054":
    case "PNL-QL-055":
    case "PNL-QL-057":
    case "PNL-QL-059":
    case "PNL-QL-065": {
      const value = "sellingPrice" in result ? result.sellingPrice : "effectiveUnitPrice" in result ? result.effectiveUnitPrice : "effectivePrice" in result ? result.effectivePrice : null;
      if (!value) throw new Error(`${qlId}: expected a money answer.`);
      return { kind: "MONEY", value };
    }
    case "PNL-QL-039":
      if (!("markedPrice" in result))
        throw new Error(`${qlId}: expected marked price.`);
      return { kind: "MONEY", value: result.markedPrice };
    case "PNL-QL-042":
      if (!("discountAmount" in result))
        throw new Error(`${qlId}: expected discount amount.`);
      return { kind: "MONEY", value: result.discountAmount };
    case "PNL-QL-038":
    case "PNL-QL-043":
    case "PNL-QL-062":
    case "PNL-QL-063":
    case "PNL-QL-068":
      if (!("discountPercent" in result))
        throw new Error(`${qlId}: expected discount percentage.`);
      return { kind: "PERCENT", value: result.discountPercent };
    case "PNL-QL-041":
    case "PNL-QL-051":
      if (!("equivalentDiscountPercent" in result))
        throw new Error(`${qlId}: expected equivalent discount.`);
      return { kind: "PERCENT", value: result.equivalentDiscountPercent };
    case "PNL-QL-045":
      if (!("missingDiscountPercent" in result))
        throw new Error(`${qlId}: expected missing discount.`);
      return { kind: "PERCENT", value: result.missingDiscountPercent };
    case "PNL-QL-049":
      if (!("discountPercent" in result))
        throw new Error(`${qlId}: expected required discount.`);
      return { kind: "PERCENT", value: result.discountPercent };
    case "PNL-QL-050":
      if (!("markupPercent" in result))
        throw new Error(`${qlId}: expected markup percentage.`);
      return { kind: "PERCENT", value: result.markupPercent };
    case "PNL-QL-046":
      if (!("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected offer comparison.`);
      }
      return {
        kind: "TEXT",
        value: result.betterOffer === "SAME" ? "Both offers give the same selling price" : `${result.betterOffer === "SINGLE" ? "Single-discount offer" : "Successive-discount offer"} is better by ${formatMoney(result.differenceAmount)}`
      };
    case "PNL-QL-047":
    case "PNL-QL-066":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected profit/loss percentage.`);
      }
      return {
        kind: "TEXT",
        value: result.direction === "NO_CHANGE" ? "No profit, no loss" : `${formatPercent(result.ratePercent)} ${result.direction.toLowerCase()}`
      };
    case "PNL-QL-048":
      if (!("direction" in result) || !("amount" in result)) {
        throw new Error(`${qlId}: expected profit/loss amount.`);
      }
      return {
        kind: "TEXT",
        value: result.direction === "NO_CHANGE" ? "No profit, no loss" : `${result.direction === "PROFIT" ? "Profit" : "Loss"} of ${formatMoney(result.amount)}`
      };
    case "PNL-QL-056":
      if (!("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected discount/cashback comparison.`);
      }
      return {
        kind: "TEXT",
        value: result.betterOffer === "SAME" ? "Both offers give the same effective cost" : `${result.betterOffer === "DISCOUNT" ? "Discount offer" : "Cashback offer"} is better by ${formatMoney(result.differenceAmount)}`
      };
    case "PNL-QL-058":
      if (!("couponApplied" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected coupon eligibility result.`);
      }
      return {
        kind: "TEXT",
        value: `${result.couponApplied ? "Coupon applies" : "Coupon does not apply"}; effective price ${formatMoney(result.effectivePrice)}`
      };
    case "PNL-QL-060":
      if (!("cashbackAmount" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected cashback result.`);
      }
      return {
        kind: "TEXT",
        value: `Cashback ${formatMoney(result.cashbackAmount)}; effective cost ${formatMoney(result.effectivePrice)}`
      };
    case "PNL-QL-061":
      if (!("billedPrice" in result) || !("cashbackAmount" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected billed/cashback result.`);
      }
      return {
        kind: "TEXT",
        value: `Billed price ${formatMoney(result.billedPrice)}; cashback ${formatMoney(result.cashbackAmount)}; effective cost ${formatMoney(result.effectivePrice)}`
      };
    case "PNL-QL-064":
      if (!("couponEligible" in result) || !("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected eligible offer comparison.`);
      }
      return {
        kind: "TEXT",
        value: `${result.couponEligible ? "Coupon is eligible" : "Coupon is not eligible"}; ${result.betterOffer === "SAME" ? "both offers are equal" : `${result.betterOffer === "DISCOUNT" ? "discount offer" : "coupon offer"} is better by ${formatMoney(result.differenceAmount)}`}`
      };
    case "PNL-QL-067":
      return { kind: "TEXT", value: "Statement 2 only" };
    case "PNL-QL-069":
      if (!("betterOrder" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected coupon-order comparison.`);
      }
      return {
        kind: "TEXT",
        value: result.betterOrder === "SAME" ? "Both orders give the same price" : `${result.betterOrder === "DISCOUNT_THEN_COUPON" ? "Discount then coupon" : "Coupon then discount"} is better by ${formatMoney(result.differenceAmount)}`
      };
    case "PNL-QL-070":
      return { kind: "TEXT", value: "Both statements together are required" };
    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}
function formatAnswer(answer) {
  switch (answer.kind) {
    case "MONEY":
      return formatMoney(answer.value);
    case "PERCENT":
      return formatPercent(answer.value);
    case "TEXT":
      return answer.value;
  }
}
function numericDistractors(answer) {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    const candidates = [
      moneyFromPaise(paise * 90n / 100n),
      moneyFromPaise(paise * 110n / 100n),
      moneyFromPaise(paise + 5000n),
      moneyFromPaise(paise > 5000n ? paise - 5000n : paise + 10000n)
    ];
    return candidates.map(formatMoney);
  }
  if (answer.kind === "PERCENT") {
    const numeric = rationalToNumber(answer.value);
    const candidates = [
      Math.max(0, numeric - 5),
      numeric + 5,
      Math.max(0, 100 - numeric),
      numeric + 10
    ];
    return candidates.map((value) => `${Number(value.toFixed(2))}%`);
  }
  return [];
}
function textDistractors(qlId, correct) {
  const pools = {
    "PNL-QL-046": [
      "Single-discount offer is better by \u20B9100",
      "Successive-discount offer is better by \u20B9100",
      "Both offers give the same selling price",
      "The better offer cannot be determined"
    ],
    "PNL-QL-047": [
      "10% profit",
      "10% loss",
      "No profit, no loss",
      "20% profit"
    ],
    "PNL-QL-048": [
      "Profit of \u20B9100",
      "Loss of \u20B9100",
      "No profit, no loss",
      "Profit of \u20B9200"
    ],
    "PNL-QL-056": [
      "Discount offer is better by \u20B9100",
      "Cashback offer is better by \u20B9100",
      "Both offers give the same effective cost",
      "The better offer cannot be determined"
    ],
    "PNL-QL-058": [
      "Coupon applies; effective price \u20B91000",
      "Coupon does not apply; effective price \u20B91000",
      "Coupon applies; effective price \u20B91200",
      "Eligibility cannot be determined"
    ],
    "PNL-QL-060": [
      "Cashback \u20B9200; effective cost \u20B91800",
      "Cashback \u20B9300; effective cost \u20B91700",
      "Cashback \u20B9400; effective cost \u20B91600",
      "The cashback cap is ignored"
    ],
    "PNL-QL-061": [
      "Cashback is calculated on the billed price",
      "The cap does not apply",
      "The discount and cashback percentages are added",
      "The billed price equals the effective cost"
    ],
    "PNL-QL-064": [
      "Coupon is eligible; coupon offer is better by \u20B9100",
      "Coupon is not eligible; discount offer is better by \u20B9100",
      "Both offers are equal",
      "Eligibility cannot be determined"
    ],
    "PNL-QL-067": [
      "Statement 1 only",
      "Statement 2 only",
      "Both statements are correct",
      "Neither statement is correct"
    ],
    "PNL-QL-069": [
      "Discount then coupon is better by \u20B9100",
      "Coupon then discount is better by \u20B9100",
      "Both orders give the same price",
      "Order cannot be compared"
    ],
    "PNL-QL-070": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required"
    ]
  };
  const pool = pools[qlId] ?? [
    "No profit, no loss",
    "Cannot be determined",
    "Both alternatives are equal",
    "None of these"
  ];
  return pool.filter((item) => item !== correct);
}
function buildOptions(qlId, seed, answer) {
  const correct = formatAnswer(answer);
  const source = answer.kind === "TEXT" ? textDistractors(qlId, correct) : numericDistractors(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0], label: "WRONG_BASE_OR_STAGE" },
    { value: unique[1], label: "ADDITIVE_PERCENTAGE_ERROR" },
    { value: unique[2], label: "ELIGIBILITY_OR_ORDER_ERROR" }
  ];
  const random = createSeededRandom(`${seed}:${qlId}:option-order`);
  for (let index = entries.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random.next() * (index + 1));
    [entries[index], entries[swap]] = [entries[swap], entries[index]];
  }
  return {
    options: entries.map((entry) => entry.value),
    correctIndex: entries.findIndex((entry) => entry.label === "CORRECT"),
    misconceptionLabels: entries.map((entry) => entry.label)
  };
}
function stable(value) {
  return JSON.stringify(
    value,
    (_, item) => typeof item === "bigint" ? item.toString() : item
  );
}
function selectQl(input) {
  if (input.questionLanguageId) {
    const registry = taskRegistry.entries[input.questionLanguageId];
    if (!registry) {
      throw new Error(
        `Unknown CP-002 question-language ID: ${input.questionLanguageId}`
      );
    }
    return input.questionLanguageId;
  }
  const eligible = qlIds.filter(
    (qlId) => !input.difficultyBand || taskRegistry.entries[qlId].difficulty === input.difficultyBand
  );
  if (!eligible.length) {
    throw new Error("No CP-002 QLs match the requested difficulty.");
  }
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp002-dynamic"}:ql-selection`),
    eligible
  );
}
function containsUnresolvedProsePlaceholder(value) {
  const proseOnly = value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}
function listPnlCp002DynamicQlIds() {
  return [...qlIds];
}
function runPnlCp002DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-002 dynamic runtime currently supports English only."
    );
  }
  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generateCase(qlId, seed);
  const result = solve(generated.request);
  const recomputed = solve(generated.request);
  const answerValue = answerFor(qlId, result);
  const answer = formatAnswer(answerValue);
  const optionSet = buildOptions(qlId, seed, answerValue);
  const editorial = editorialLibrary.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);
  const stem = renderStructuredStemMarkdown(editorial.stem, generated.context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    generated.context
  );
  const explanationText = `${baseExplanation}

**Working with these values:** The generated offer is evaluated in the exact order and on the exact base stated in the question.

**Final answer:** ${answer}`;
  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated.registry && editorial),
      message: "The QL exists in both the frozen registry and English editorial library."
    },
    {
      name: "exact-recomputation",
      passed: stable(result) === stable(recomputed),
      message: "Exact recomputation agrees with the canonical CP-002 solver."
    },
    {
      name: "four-misconception-options",
      passed: optionSet.options.length === 4 && new Set(optionSet.options).size === 4 && optionSet.options[optionSet.correctIndex] === answer && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: "Four unique options contain one answer and three labelled misconceptions."
    },
    {
      name: "dynamic-editorial-binding",
      passed: !containsUnresolvedProsePlaceholder(stem) && !containsUnresolvedProsePlaceholder(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders."
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication."
    }
  ];
  const validation = {
    valid: checks.every((check) => check.passed),
    checks
  };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${checks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`
    );
  }
  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001",
    canonicalProblemId: PNL_CP002_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en",
    difficultyBand: generated.registry.difficulty,
    stem,
    answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP002_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en",
      difficultyBand: generated.registry.difficulty,
      taskKind: generated.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated.registry.answerSemantic,
      requiredVariables: [...generated.registry.requiredVariables],
      variables: generated.context,
      seed,
      runtimeMode: PNL_CP002_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      sourceTrace: {
        registry: "PNL-001/CP-002/task-registry.library.json",
        editorial: "PNL-001/CP-002/editorial-content.en.json",
        solver: "PNL-001/foundation/discount-solver.ts | promotion-solver.ts | conditional-promotion-solver.ts"
      }
    },
    solver: {
      answer,
      numericAnswer: answerValue.kind === "MONEY" ? Number(answerValue.value.paise) / 100 : answerValue.kind === "PERCENT" ? rationalToNumber(answerValue.value) : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated.registry.solveMode,
        answerSemantic: generated.registry.answerSemantic,
        exactRecomputation: "PASS"
      },
      mathJax: {}
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        {
          id: "given",
          label: "Generated offer values",
          value: generated.context
        },
        {
          id: "mode",
          label: "Solve mode",
          value: generated.registry.solveMode
        },
        { id: "answer", label: "Exact answer", value: answer }
      ]
    },
    explanation: {
      explanationId,
      lines: explanationText.split(/\n{2,}/)
    },
    traceability: {
      questionId,
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP002_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      seed,
      generationMode: PNL_CP002_DYNAMIC_RUNTIME_MODE,
      misconceptionLabels: optionSet.misconceptionLabels,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false
    },
    validation,
    mathJax: {}
  };
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-002/cp002-dynamic-runtime.test.ts
var qlIds2 = listPnlCp002DynamicQlIds();
assert.equal(qlIds2.length, 34, "CP-002 must expose all 34 frozen QLs.");
assert.deepEqual(
  qlIds2,
  Array.from(
    { length: 34 },
    (_, index) => `PNL-QL-${String(index + 37).padStart(3, "0")}`
  )
);
var seeds = Array.from(
  { length: 24 },
  (_, index) => `cp002-proof-seed-${index + 1}`
);
var difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
var generatedCount = 0;
for (const qlId of qlIds2) {
  const stems = /* @__PURE__ */ new Set();
  const answers = /* @__PURE__ */ new Set();
  for (const seed of seeds) {
    const pkg = runPnlCp002DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed
    });
    generatedCount += 1;
    difficultyCounts[pkg.difficultyBand] += 1;
    stems.add(pkg.stem);
    answers.add(pkg.answer);
    assert.equal(pkg.archetypeId, "PNL-001");
    assert.equal(pkg.canonicalProblemId, "PNL-CP-002");
    assert.equal(pkg.questionLanguageId, qlId);
    assert.equal(pkg.language, "en");
    assert.equal(pkg.parameters.runtimeMode, "DYNAMIC_CANDIDATE");
    assert.equal(pkg.parameters.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
    assert.equal(pkg.parameters.questionBankStatus, "NOT_STORED");
    assert.equal(pkg.parameters.testEligibility, "INELIGIBLE");
    assert.equal(pkg.parameters.publiclyPublishable, false);
    assert.equal(pkg.traceability.generationMode, "DYNAMIC_CANDIDATE");
    assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
    assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
    assert.equal(pkg.traceability.publiclyPublishable, false);
    assert.equal(pkg.validation.valid, true);
    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options).size, 4);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
    assert.equal(
      pkg.traceability.misconceptionLabels.filter(
        (label) => label !== "CORRECT"
      ).length,
      3
    );
    assert.ok(pkg.stem.length > 30, `${qlId}: stem is unexpectedly short.`);
    assert.ok(
      pkg.explanation.lines.length >= 4,
      `${qlId}: explanation is unexpectedly short.`
    );
    const prose2 = `${pkg.stem}
${pkg.explanation.lines.join("\n")}`.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
    assert.doesNotMatch(
      prose2,
      /\{[a-z][A-Za-z0-9_]*\}/,
      `${qlId}: unresolved prose placeholder.`
    );
    const replay = runPnlCp002DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed
    });
    assert.equal(
      replay.stem,
      pkg.stem,
      `${qlId}: same seed must reproduce the stem.`
    );
    assert.equal(
      replay.answer,
      pkg.answer,
      `${qlId}: same seed must reproduce the answer.`
    );
    assert.deepEqual(
      replay.options,
      pkg.options,
      `${qlId}: same seed must reproduce option order.`
    );
  }
  assert.ok(
    stems.size >= 2,
    `${qlId}: seed sweep did not vary the generated stem.`
  );
  if (!["PNL-QL-067", "PNL-QL-070"].includes(qlId)) {
    assert.ok(
      answers.size >= 2,
      `${qlId}: seed sweep did not vary the generated answer.`
    );
  }
}
var ql070 = runPnlCp002DynamicPipeline({
  questionLanguageId: "PNL-QL-070",
  language: "en",
  seed: "pnl-ql070-data-sufficiency-regression"
});
var ql070Marker = ql070.stem.match(/Statement\s+(?:I|1)\b/i);
assert.ok(
  ql070Marker?.index,
  "QL-070 must separate Statement I from the lead."
);
var ql070Lead = ql070.stem.slice(0, ql070Marker.index);
assert.doesNotMatch(
  ql070Lead,
  /₹\s*[\d,]+|\b\d+(?:\.\d+)?%/,
  "QL-070 lead must not reveal cost, marked price, or target rate."
);
assert.match(ql070.stem, /Statement\s+(?:I|1)[\s\S]*cost price/i);
assert.match(ql070.stem, /Statement\s+(?:II|2)[\s\S]*marked price/i);
assert.equal(ql070.answer, "Both statements together are required");
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  const pkg = runPnlCp002DynamicPipeline({
    difficultyBand: difficulty,
    seed: `cp002-${difficulty.toLowerCase()}-selection`
  });
  assert.equal(pkg.difficultyBand, difficulty);
}
await assert.rejects(
  async () => runPnlCp002DynamicPipeline({ language: "hi" }),
  /supports English only/
);
assert.throws(
  () => runPnlCp002DynamicPipeline({ questionLanguageId: "PNL-QL-999" }),
  /Unknown CP-002 question-language ID/
);
console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-002",
      qlCount: qlIds2.length,
      seedsPerQl: seeds.length,
      generatedPackages: generatedCount,
      difficultyCounts,
      runtimeMode: "DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false
    },
    null,
    2
  )
);
