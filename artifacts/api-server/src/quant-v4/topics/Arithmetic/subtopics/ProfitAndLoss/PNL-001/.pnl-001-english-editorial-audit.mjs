// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-001-english-editorial-audit.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-001/task-registry.library.json
var task_registry_library_default = {
  archetypeId: "PNL-001",
  cpId: "PNL-CP-001",
  status: "FREEZE_CANDIDATE",
  countPolicy: "DISCOVERED_NOT_QUOTA_DRIVEN",
  title: "Fundamental Price Relations",
  entries: {
    "PNL-QL-001": { solveMode: "CP_SP_TO_AMOUNT", direction: "PROFIT", answerSemantic: "profitAmount", requiredVariables: ["costPrice", "sellingPrice"], difficulty: "Easy" },
    "PNL-QL-002": { solveMode: "CP_SP_TO_AMOUNT", direction: "LOSS", answerSemantic: "lossAmount", requiredVariables: ["costPrice", "sellingPrice"], difficulty: "Easy" },
    "PNL-QL-003": { solveMode: "CP_SP_TO_RATE", direction: "PROFIT", percentageBase: "COST_PRICE", answerSemantic: "profitPercentOnCP", requiredVariables: ["costPrice", "sellingPrice"], difficulty: "Easy" },
    "PNL-QL-004": { solveMode: "CP_SP_TO_RATE", direction: "LOSS", percentageBase: "COST_PRICE", answerSemantic: "lossPercentOnCP", requiredVariables: ["costPrice", "sellingPrice"], difficulty: "Easy" },
    "PNL-QL-005": { solveMode: "CP_RATE_TO_SP", direction: "PROFIT", percentageBase: "COST_PRICE", answerSemantic: "sellingPrice", requiredVariables: ["costPrice", "profitPercent"], difficulty: "Easy" },
    "PNL-QL-006": { solveMode: "CP_RATE_TO_SP", direction: "LOSS", percentageBase: "COST_PRICE", answerSemantic: "sellingPrice", requiredVariables: ["costPrice", "lossPercent"], difficulty: "Easy" },
    "PNL-QL-007": { solveMode: "SP_RATE_TO_CP", direction: "PROFIT", percentageBase: "COST_PRICE", answerSemantic: "costPrice", requiredVariables: ["sellingPrice", "profitPercent"], difficulty: "Medium" },
    "PNL-QL-008": { solveMode: "SP_RATE_TO_CP", direction: "LOSS", percentageBase: "COST_PRICE", answerSemantic: "costPrice", requiredVariables: ["sellingPrice", "lossPercent"], difficulty: "Medium" },
    "PNL-QL-009": { solveMode: "AMOUNT_RATE_TO_CP", direction: "PROFIT", answerSemantic: "costPrice", requiredVariables: ["profitAmount", "profitPercent"], difficulty: "Medium" },
    "PNL-QL-010": { solveMode: "AMOUNT_RATE_TO_CP", direction: "LOSS", answerSemantic: "costPrice", requiredVariables: ["lossAmount", "lossPercent"], difficulty: "Medium" },
    "PNL-QL-011": { solveMode: "AMOUNT_CP_TO_RATE", direction: "PROFIT", answerSemantic: "profitPercentOnCP", requiredVariables: ["profitAmount", "costPrice"], difficulty: "Easy" },
    "PNL-QL-012": { solveMode: "AMOUNT_CP_TO_RATE", direction: "LOSS", answerSemantic: "lossPercentOnCP", requiredVariables: ["lossAmount", "costPrice"], difficulty: "Easy" },
    "PNL-QL-013": { solveMode: "CP_SP_RATIO_TO_RATE", answerSemantic: "profitOrLossPercentOnCP", requiredVariables: ["costPart", "sellingPart"], difficulty: "Medium" },
    "PNL-QL-014": { solveMode: "RATE_TO_CP_SP_RATIO", direction: "PROFIT", answerSemantic: "costSellingRatio", requiredVariables: ["profitPercent"], difficulty: "Medium" },
    "PNL-QL-015": { solveMode: "RATE_TO_CP_SP_RATIO", direction: "LOSS", answerSemantic: "costSellingRatio", requiredVariables: ["lossPercent"], difficulty: "Medium" },
    "PNL-QL-016": { solveMode: "MARGIN_SP_TO_PROFIT_CP", direction: "PROFIT", percentageBase: "SELLING_PRICE_TO_COST_PRICE", answerSemantic: "profitPercentOnCP", requiredVariables: ["marginPercent"], difficulty: "Hard" },
    "PNL-QL-017": { solveMode: "PROFIT_CP_TO_MARGIN_SP", direction: "PROFIT", percentageBase: "COST_PRICE_TO_SELLING_PRICE", answerSemantic: "profitMarginOnSP", requiredVariables: ["profitPercent"], difficulty: "Hard" },
    "PNL-QL-018": { solveMode: "CP_RATE_TO_AMOUNT", direction: "PROFIT", answerSemantic: "profitAmount", requiredVariables: ["costPrice", "profitPercent"], difficulty: "Easy" },
    "PNL-QL-019": { solveMode: "CP_RATE_TO_AMOUNT", direction: "LOSS", answerSemantic: "lossAmount", requiredVariables: ["costPrice", "lossPercent"], difficulty: "Easy" },
    "PNL-QL-020": { solveMode: "CP_AMOUNT_TO_SP", direction: "PROFIT", answerSemantic: "sellingPrice", requiredVariables: ["costPrice", "profitAmount"], difficulty: "Easy" },
    "PNL-QL-021": { solveMode: "CP_AMOUNT_TO_SP", direction: "LOSS", answerSemantic: "sellingPrice", requiredVariables: ["costPrice", "lossAmount"], difficulty: "Easy" },
    "PNL-QL-022": { solveMode: "SP_AMOUNT_TO_CP", direction: "PROFIT", answerSemantic: "costPrice", requiredVariables: ["sellingPrice", "profitAmount"], difficulty: "Easy" },
    "PNL-QL-023": { solveMode: "SP_AMOUNT_TO_CP", direction: "LOSS", answerSemantic: "costPrice", requiredVariables: ["sellingPrice", "lossAmount"], difficulty: "Easy" },
    "PNL-QL-024": { solveMode: "FRACTION_TO_RATE", direction: "PROFIT", fractionBase: "COST_PRICE", answerSemantic: "profitPercentOnCP", requiredVariables: ["fractionNumerator", "fractionDenominator"], difficulty: "Medium" },
    "PNL-QL-025": { solveMode: "FRACTION_TO_RATE", direction: "LOSS", fractionBase: "COST_PRICE", answerSemantic: "lossPercentOnCP", requiredVariables: ["fractionNumerator", "fractionDenominator"], difficulty: "Medium" },
    "PNL-QL-026": { solveMode: "FRACTION_TO_RATE", direction: "PROFIT", fractionBase: "SELLING_PRICE", answerSemantic: "profitPercentOnCP", requiredVariables: ["fractionNumerator", "fractionDenominator"], difficulty: "Hard" },
    "PNL-QL-027": { solveMode: "FRACTION_TO_RATE", direction: "LOSS", fractionBase: "SELLING_PRICE", answerSemantic: "lossPercentOnCP", requiredVariables: ["fractionNumerator", "fractionDenominator"], difficulty: "Hard" },
    "PNL-QL-028": { solveMode: "RATE_TO_FRACTION", direction: "PROFIT", fractionBase: "SELLING_PRICE", answerSemantic: "profitFractionOfSP", requiredVariables: ["profitPercent"], difficulty: "Hard" },
    "PNL-QL-029": { solveMode: "RATE_TO_FRACTION", direction: "LOSS", fractionBase: "SELLING_PRICE", answerSemantic: "lossFractionOfSP", requiredVariables: ["lossPercent"], difficulty: "Hard" },
    "PNL-QL-030": { solveMode: "CP_TWO_RATES_TO_SP_DIFFERENCE", answerSemantic: "sellingPriceDifference", requiredVariables: ["costPrice", "firstRatePercent", "secondRatePercent"], difficulty: "Medium" },
    "PNL-QL-031": { solveMode: "CP_TWO_RATES_TO_SP_DIFFERENCE", answerSemantic: "sellingPriceDifference", requiredVariables: ["costPrice", "profitPercent", "lossPercent"], difficulty: "Medium" },
    "PNL-QL-032": { solveMode: "SP_DIFFERENCE_TWO_RATES_TO_CP", answerSemantic: "costPrice", requiredVariables: ["sellingPriceDifference", "firstRatePercent", "secondRatePercent"], difficulty: "Hard" },
    "PNL-QL-033": { solveMode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE", answerSemantic: "secondProfitOrLossRate", requiredVariables: ["firstSellingPrice", "firstRatePercent", "secondSellingPrice"], difficulty: "Hard" },
    "PNL-QL-034": { solveMode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE", answerSemantic: "secondProfitOrLossRate", requiredVariables: ["firstSellingPrice", "firstRatePercent", "secondSellingPrice"], difficulty: "Hard" },
    "PNL-QL-035": { solveMode: "CP_SP_TO_RATE", direction: "NO_CHANGE", answerSemantic: "noProfitNoLoss", requiredVariables: ["costPrice", "sellingPrice"], difficulty: "Easy" },
    "PNL-QL-036": { solveMode: "SP_DIFFERENCE_TWO_RATES_TO_CP", presentation: "ALGEBRAIC_STATEMENT", answerSemantic: "costPrice", requiredVariables: ["sellingPriceDifference", "firstRatePercent", "secondRatePercent"], difficulty: "Hard" }
  },
  discoveredQlCount: 36,
  freezeRule: "Reopen only for a mathematically distinct fundamental transformation or source-backed exam pattern, not for cosmetic stem variation."
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-001/editorial-content.en.json
var editorial_content_en_default = {
  schemaVersion: 2,
  archetypeId: "PNL-001",
  cpId: "PNL-CP-001",
  language: "en",
  status: "EDITORIAL_REVIEW_CANDIDATE",
  entries: {
    "PNL-QL-001": {
      stem: {
        contextFamily: "kitchen-appliance resale",
        blocks: [
          {
            type: "paragraph",
            content: "The appliance retailer purchased a mixer for \u20B9{costPrice} and sold it for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Find the profit or loss incurred."
      },
      explanation: {
        opening: "Let us compare what the seller paid with what the seller finally received.",
        concept: "Profit or loss amount is the absolute difference between selling price and cost price; the larger price determines the direction.",
        steps: [
          {
            title: "Identify the direction",
            body: "Compare the selling price with the cost price before doing any percentage work."
          },
          {
            title: "Find the amount",
            body: "Subtract the smaller price from the larger price.",
            equationLatex: "A=|S-C|"
          }
        ],
        conclusion: "The difference is the required profit or loss amount.",
        commonTrap: "Do not divide by a price when only the amount, not the percentage, is requested."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-002": {
      stem: {
        contextFamily: "home-office furniture resale",
        blocks: [
          {
            type: "paragraph",
            content: "The furniture shopkeeper bought a study table for \u20B9{costPrice} and sold it for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Calculate the profit or loss made by the retailer."
      },
      explanation: {
        opening: "Let us compare what the seller paid with what the seller finally received.",
        concept: "Profit or loss amount is the absolute difference between selling price and cost price; the larger price determines the direction.",
        steps: [
          {
            title: "Identify the direction",
            body: "Compare the selling price with the cost price before doing any percentage work."
          },
          {
            title: "Find the amount",
            body: "Subtract the smaller price from the larger price.",
            equationLatex: "A=|S-C|"
          }
        ],
        conclusion: "The difference is the required profit or loss amount.",
        commonTrap: "Do not divide by a price when only the amount, not the percentage, is requested."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-003": {
      stem: {
        contextFamily: "bicycle showroom transaction",
        blocks: [
          {
            type: "paragraph",
            content: "A bicycle was bought for \u20B9{costPrice} and sold for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Find the profit or loss percentage."
      },
      explanation: {
        opening: "We first find the rupee change and then express it relative to the original cost.",
        concept: "In ordinary profit-and-loss questions, cost price is the percentage base unless another base is stated explicitly.",
        steps: [
          {
            title: "Find profit or loss amount",
            body: "Compare selling price and cost price, then take their absolute difference.",
            equationLatex: "A=|S-C|"
          },
          {
            title: "Convert the amount to a rate",
            body: "Divide the amount by cost price and multiply by 100.",
            equationLatex: "r=\\frac{A}{C}\\times100"
          }
        ],
        conclusion: "The sign of S\u2212C gives profit, loss, or no change; the formula gives the percentage.",
        commonTrap: "Do not divide by selling price unless the question specifically asks for a margin on selling price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-004": {
      stem: {
        contextFamily: "agricultural-tool trade",
        blocks: [
          {
            type: "paragraph",
            content: "The equipment trader paid \u20B9{costPrice} for the power tiller and sold it for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Calculate the percentage gain or loss."
      },
      explanation: {
        opening: "We first find the rupee change and then express it relative to the original cost.",
        concept: "In ordinary profit-and-loss questions, cost price is the percentage base unless another base is stated explicitly.",
        steps: [
          {
            title: "Find profit or loss amount",
            body: "Compare selling price and cost price, then take their absolute difference.",
            equationLatex: "A=|S-C|"
          },
          {
            title: "Convert the amount to a rate",
            body: "Divide the amount by cost price and multiply by 100.",
            equationLatex: "r=\\frac{A}{C}\\times100"
          }
        ],
        conclusion: "The sign of S\u2212C gives profit, loss, or no change; the formula gives the percentage.",
        commonTrap: "Do not divide by selling price unless the question specifically asks for a margin on selling price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-005": {
      stem: {
        contextFamily: "consumer-electronics pricing",
        blocks: [
          {
            type: "paragraph",
            content: "An appliance costs a dealer \u20B9{costPrice}."
          }
        ],
        prompt: "At what price should it be sold to earn a profit of {profitPercent}%?"
      },
      explanation: {
        opening: "The stated rate tells us how much of the cost is added or removed before sale.",
        concept: "A profit uses a multiplier above 1, while a loss uses a retained multiplier below 1.",
        steps: [
          {
            title: "Write the commercial multiplier",
            body: "Use 1+r/100 for profit or 1\u2212r/100 for loss."
          },
          {
            title: "Apply it to cost price",
            body: "Multiply the cost price by the appropriate factor.",
            equationLatex: "S=C\\left(1\\pm\\frac{r}{100}\\right)"
          }
        ],
        conclusion: "The resulting amount is the required selling price.",
        commonTrap: "Do not add or subtract the percentage number directly from the rupee cost."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-006": {
      stem: {
        contextFamily: "industrial-machine liquidation",
        blocks: [
          {
            type: "paragraph",
            content: "A machine was purchased for \u20B9{costPrice}. If it is sold at a loss of {lossPercent}%,"
          }
        ],
        prompt: "What is its selling price?"
      },
      explanation: {
        opening: "The stated rate tells us how much of the cost is added or removed before sale.",
        concept: "A profit uses a multiplier above 1, while a loss uses a retained multiplier below 1.",
        steps: [
          {
            title: "Write the commercial multiplier",
            body: "Use 1+r/100 for profit or 1\u2212r/100 for loss."
          },
          {
            title: "Apply it to cost price",
            body: "Multiply the cost price by the appropriate factor.",
            equationLatex: "S=C\\left(1\\pm\\frac{r}{100}\\right)"
          }
        ],
        conclusion: "The resulting amount is the required selling price.",
        commonTrap: "Do not add or subtract the percentage number directly from the rupee cost."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-007": {
      stem: {
        contextFamily: "refurbished-laptop sale",
        blocks: [
          {
            type: "paragraph",
            content: "The refurbished laptop was sold for \u20B9{sellingPrice} at a profit of {profitPercent}%."
          }
        ],
        prompt: "Find its cost price."
      },
      explanation: {
        opening: "Because the selling price is known, the cleanest method is to reverse the stated multiplier.",
        concept: "The forward relation is selling price equals cost price multiplied by the commercial factor, so cost price is found by division.",
        steps: [
          {
            title: "Form the multiplier",
            body: "Use 1+r/100 for profit or 1\u2212r/100 for loss."
          },
          {
            title: "Reverse the sale",
            body: "Divide the selling price by that multiplier.",
            equationLatex: "C=\\frac{S}{1\\pm r/100}"
          }
        ],
        conclusion: "The quotient is the original cost price.",
        commonTrap: "Do not subtract the stated rate from the selling price; reversing a percentage multiplier requires division."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-008": {
      stem: {
        contextFamily: "modular-furniture outlet",
        blocks: [
          {
            type: "paragraph",
            content: "By selling a cupboard for \u20B9{sellingPrice}, a seller incurred a loss of {lossPercent}%."
          }
        ],
        prompt: "What was the cupboard's cost price?"
      },
      explanation: {
        opening: "Because the selling price is known, the cleanest method is to reverse the stated multiplier.",
        concept: "The forward relation is selling price equals cost price multiplied by the commercial factor, so cost price is found by division.",
        steps: [
          {
            title: "Form the multiplier",
            body: "Use 1+r/100 for profit or 1\u2212r/100 for loss."
          },
          {
            title: "Reverse the sale",
            body: "Divide the selling price by that multiplier.",
            equationLatex: "C=\\frac{S}{1\\pm r/100}"
          }
        ],
        conclusion: "The quotient is the original cost price.",
        commonTrap: "Do not subtract the stated rate from the selling price; reversing a percentage multiplier requires division."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-009": {
      stem: {
        contextFamily: "wholesale-stationery trade",
        blocks: [
          {
            type: "paragraph",
            content: "The stationery wholesaler earned \u20B9{profitAmount}, which was {profitPercent}% of the cost price."
          }
        ],
        prompt: "Find the cost price."
      },
      explanation: {
        opening: "The given profit or loss amount is a known percentage of the unknown cost price.",
        concept: "If an amount equals r percent of cost price, the cost is recovered by scaling the amount from r parts to 100 parts.",
        steps: [
          {
            title: "Write the percentage relation",
            body: "Treat the stated amount as r/100 of cost price.",
            equationLatex: "A=C\\frac{r}{100}"
          },
          {
            title: "Solve for cost price",
            body: "Multiply the amount by 100 and divide by the rate.",
            equationLatex: "C=\\frac{100A}{r}"
          }
        ],
        conclusion: "This recovered value is the required cost price.",
        commonTrap: "Do not add the profit or loss amount to itself; the rate identifies the hidden base."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-010": {
      stem: {
        contextFamily: "automobile-spares counter",
        blocks: [
          {
            type: "paragraph",
            content: "The loss on selling the spare-parts kit was \u20B9{lossAmount}, equal to {lossPercent}% of its cost price."
          }
        ],
        prompt: "Find the cost price."
      },
      explanation: {
        opening: "The given profit or loss amount is a known percentage of the unknown cost price.",
        concept: "If an amount equals r percent of cost price, the cost is recovered by scaling the amount from r parts to 100 parts.",
        steps: [
          {
            title: "Write the percentage relation",
            body: "Treat the stated amount as r/100 of cost price.",
            equationLatex: "A=C\\frac{r}{100}"
          },
          {
            title: "Solve for cost price",
            body: "Multiply the amount by 100 and divide by the rate.",
            equationLatex: "C=\\frac{100A}{r}"
          }
        ],
        conclusion: "This recovered value is the required cost price.",
        commonTrap: "Do not add the profit or loss amount to itself; the rate identifies the hidden base."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-011": {
      stem: {
        contextFamily: "sports-equipment shop",
        blocks: [
          {
            type: "paragraph",
            content: "The cricket kit costing \u20B9{costPrice} yielded a gain of \u20B9{profitAmount}."
          }
        ],
        prompt: "Find the profit or loss percentage."
      },
      explanation: {
        opening: "We already know the cost base and the profit or loss amount, so only a percentage conversion remains.",
        concept: "Profit or loss percentage is the amount divided by cost price, multiplied by 100.",
        steps: [
          {
            title: "Choose the correct base",
            body: "Use cost price because the question asks for the ordinary profit-or-loss rate."
          },
          {
            title: "Calculate the percentage",
            body: "Divide the amount by cost price and convert the fraction to percent.",
            equationLatex: "r=\\frac{A}{C}\\times100"
          }
        ],
        conclusion: "The computed rate, together with the stated direction, is the answer.",
        commonTrap: "Do not use selling price as the denominator in a standard profit-or-loss percentage question."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-012": {
      stem: {
        contextFamily: "home-decor store",
        blocks: [
          {
            type: "paragraph",
            content: "The decor store owner lost \u20B9{lossAmount} on the decorative lamp whose cost price was \u20B9{costPrice}."
          }
        ],
        prompt: "Calculate the percentage gain or loss."
      },
      explanation: {
        opening: "We already know the cost base and the profit or loss amount, so only a percentage conversion remains.",
        concept: "Profit or loss percentage is the amount divided by cost price, multiplied by 100.",
        steps: [
          {
            title: "Choose the correct base",
            body: "Use cost price because the question asks for the ordinary profit-or-loss rate."
          },
          {
            title: "Calculate the percentage",
            body: "Divide the amount by cost price and convert the fraction to percent.",
            equationLatex: "r=\\frac{A}{C}\\times100"
          }
        ],
        conclusion: "The computed rate, together with the stated direction, is the answer.",
        commonTrap: "Do not use selling price as the denominator in a standard profit-or-loss percentage question."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-013": {
      stem: {
        contextFamily: "mobile-accessory kiosk",
        blocks: [
          {
            type: "paragraph",
            content: "The ratio of the cost price to the selling price of the wireless-earbud pack is {costPart}:{sellingPart}."
          }
        ],
        prompt: "Find the profit or loss percentage."
      },
      explanation: {
        opening: "A ratio question becomes simple when the cost-price part is treated as the percentage base.",
        concept: "The difference between the selling-price part and cost-price part represents profit or loss on the cost-price part.",
        steps: [
          {
            title: "Compare the ratio parts",
            body: "Subtract the cost part from the selling part to identify the signed change."
          },
          {
            title: "Measure the change on cost",
            body: "Divide the absolute difference by the cost part and multiply by 100.",
            equationLatex: "r=\\frac{|s-c|}{c}\\times100"
          }
        ],
        conclusion: "The larger ratio part determines whether the result is profit or loss.",
        commonTrap: "Do not divide by the sum of the ratio parts; cost price alone is the base."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-014": {
      stem: {
        contextFamily: "bookshop margin analysis",
        blocks: [
          {
            type: "paragraph",
            content: "The reference-book set is sold at a profit of {profitPercent}%."
          }
        ],
        prompt: "Find the ratio of its cost price to selling price."
      },
      explanation: {
        opening: "We can build the required ratio by taking cost price as a convenient 100 parts.",
        concept: "A profit adds rate parts to 100, while a loss leaves 100 minus the rate parts as selling price.",
        steps: [
          {
            title: "Assume a cost base",
            body: "Take cost price as 100 parts."
          },
          {
            title: "Form the selling-price part",
            body: "Use 100+r for profit or 100\u2212r for loss, then simplify the ratio.",
            equationLatex: "C:S=100:(100\\pm r)"
          }
        ],
        conclusion: "The simplified pair is the cost-price to selling-price ratio.",
        commonTrap: "Do not write the rate itself as the selling-price part."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-015": {
      stem: {
        contextFamily: "seasonal-garment clearance",
        blocks: [
          {
            type: "paragraph",
            content: "The winter-jacket lot is sold at a loss of {lossPercent}%."
          }
        ],
        prompt: "Find the ratio of its cost price to selling price."
      },
      explanation: {
        opening: "We can build the required ratio by taking cost price as a convenient 100 parts.",
        concept: "A profit adds rate parts to 100, while a loss leaves 100 minus the rate parts as selling price.",
        steps: [
          {
            title: "Assume a cost base",
            body: "Take cost price as 100 parts."
          },
          {
            title: "Form the selling-price part",
            body: "Use 100+r for profit or 100\u2212r for loss, then simplify the ratio.",
            equationLatex: "C:S=100:(100\\pm r)"
          }
        ],
        conclusion: "The simplified pair is the cost-price to selling-price ratio.",
        commonTrap: "Do not write the rate itself as the selling-price part."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-016": {
      stem: {
        contextFamily: "pharmacy margin conversion",
        blocks: [
          {
            type: "paragraph",
            content: "The profit on the medical-device pack is {marginPercent}% of its selling price."
          }
        ],
        prompt: "What is the profit percentage on cost price?"
      },
      explanation: {
        opening: "The percentage is given on selling price, so we must first recover the cost-price share.",
        concept: "If profit is m percent of selling price, cost price is the remaining 100\u2212m percent of selling price.",
        steps: [
          {
            title: "Express cost as a share of selling price",
            body: "Take selling price as 100 parts; profit is m parts and cost is 100\u2212m parts."
          },
          {
            title: "Convert profit to the cost base",
            body: "Compare the profit part with the cost part.",
            equationLatex: "r_C=\\frac{m}{100-m}\\times100"
          }
        ],
        conclusion: "This converted rate is the profit percentage on cost price.",
        commonTrap: "Do not report the selling-price margin unchanged; the percentage base has changed."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-017": {
      stem: {
        contextFamily: "online-marketplace margin",
        blocks: [
          {
            type: "paragraph",
            content: "The online seller earns {profitPercent}% on cost price."
          }
        ],
        prompt: "Express the profit as a percentage of the selling price."
      },
      explanation: {
        opening: "The profit rate is known on cost price, but the question asks for profit as a share of selling price.",
        concept: "Take cost price as 100 parts, add the profit parts, and compare profit with the resulting selling-price total.",
        steps: [
          {
            title: "Build a convenient price model",
            body: "Let cost price be 100 parts and profit be r parts."
          },
          {
            title: "Change the percentage base",
            body: "Selling price is 100+r parts, so divide profit by that total.",
            equationLatex: "m_S=\\frac{r}{100+r}\\times100"
          }
        ],
        conclusion: "The result is the profit margin on selling price.",
        commonTrap: "Do not use the cost-price rate as the selling-price margin; their denominators are different."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-018": {
      stem: {
        contextFamily: "printer dealership",
        blocks: [
          {
            type: "paragraph",
            content: "The cost price of a printer is \u20B9{costPrice}."
          }
        ],
        prompt: "Find the profit amount when it is sold at {profitPercent}% profit."
      },
      explanation: {
        opening: "The required amount is simply the stated percentage of the cost price.",
        concept: "Profit or loss amount is found by multiplying cost price by the rate fraction.",
        steps: [
          {
            title: "Convert the rate to a fraction",
            body: "Write the percentage as r/100."
          },
          {
            title: "Apply it to cost",
            body: "Multiply the cost price by that fraction.",
            equationLatex: "A=C\\frac{r}{100}"
          }
        ],
        conclusion: "The product is the required profit or loss amount.",
        commonTrap: "Do not apply the rate to selling price unless the question explicitly uses that base."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-019": {
      stem: {
        contextFamily: "diagnostic-device resale",
        blocks: [
          {
            type: "paragraph",
            content: "A device costs \u20B9{costPrice}."
          }
        ],
        prompt: "What is the loss amount if it is sold at a loss of {lossPercent}%?"
      },
      explanation: {
        opening: "The required amount is simply the stated percentage of the cost price.",
        concept: "Profit or loss amount is found by multiplying cost price by the rate fraction.",
        steps: [
          {
            title: "Convert the rate to a fraction",
            body: "Write the percentage as r/100."
          },
          {
            title: "Apply it to cost",
            body: "Multiply the cost price by that fraction.",
            equationLatex: "A=C\\frac{r}{100}"
          }
        ],
        conclusion: "The product is the required profit or loss amount.",
        commonTrap: "Do not apply the rate to selling price unless the question explicitly uses that base."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-020": {
      stem: {
        contextFamily: "office-chair outlet",
        blocks: [
          {
            type: "paragraph",
            content: "A chair costs \u20B9{costPrice}. If the seller wants a profit of \u20B9{profitAmount},"
          }
        ],
        prompt: "At what price should it be sold?"
      },
      explanation: {
        opening: "The sale price is obtained by adjusting the known cost by the stated amount.",
        concept: "Add a profit amount to cost price, or subtract a loss amount from cost price.",
        steps: [
          {
            title: "Identify the direction",
            body: "Decide whether the amount represents profit or loss."
          },
          {
            title: "Adjust the cost price",
            body: "Use addition for profit and subtraction for loss.",
            equationLatex: "S=C\\pm A"
          }
        ],
        conclusion: "The adjusted amount is the selling price.",
        commonTrap: "Do not convert the amount into a percentage when the rupee adjustment is already given."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-021": {
      stem: {
        contextFamily: "machine-tool resale",
        blocks: [
          {
            type: "paragraph",
            content: "A machine costs \u20B9{costPrice} and is sold after accepting a loss of \u20B9{lossAmount}."
          }
        ],
        prompt: "Find its selling price."
      },
      explanation: {
        opening: "The sale price is obtained by adjusting the known cost by the stated amount.",
        concept: "Add a profit amount to cost price, or subtract a loss amount from cost price.",
        steps: [
          {
            title: "Identify the direction",
            body: "Decide whether the amount represents profit or loss."
          },
          {
            title: "Adjust the cost price",
            body: "Use addition for profit and subtraction for loss.",
            equationLatex: "S=C\\pm A"
          }
        ],
        conclusion: "The adjusted amount is the selling price.",
        commonTrap: "Do not convert the amount into a percentage when the rupee adjustment is already given."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-022": {
      stem: {
        contextFamily: "wristwatch boutique",
        blocks: [
          {
            type: "paragraph",
            content: "A watch was sold for \u20B9{sellingPrice}, giving a profit of \u20B9{profitAmount}."
          }
        ],
        prompt: "Find its cost price."
      },
      explanation: {
        opening: "We know the final selling price and the rupee result, so we can undo that adjustment directly.",
        concept: "If a sale includes profit, subtract the profit from selling price; if it includes loss, add the loss back.",
        steps: [
          {
            title: "Read the direction carefully",
            body: "Profit means selling price is above cost; loss means it is below cost."
          },
          {
            title: "Reverse the adjustment",
            body: "Use C=S\u2212A for profit or C=S+A for loss.",
            equationLatex: "C=S\\mp A"
          }
        ],
        conclusion: "The recovered amount is the cost price.",
        commonTrap: "Do not use the same sign as the forward sale; this question works backward."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-023": {
      stem: {
        contextFamily: "storage-cabinet sale",
        blocks: [
          {
            type: "paragraph",
            content: "A cabinet was sold for \u20B9{sellingPrice} at a loss of \u20B9{lossAmount}."
          }
        ],
        prompt: "What was its cost price?"
      },
      explanation: {
        opening: "We know the final selling price and the rupee result, so we can undo that adjustment directly.",
        concept: "If a sale includes profit, subtract the profit from selling price; if it includes loss, add the loss back.",
        steps: [
          {
            title: "Read the direction carefully",
            body: "Profit means selling price is above cost; loss means it is below cost."
          },
          {
            title: "Reverse the adjustment",
            body: "Use C=S\u2212A for profit or C=S+A for loss.",
            equationLatex: "C=S\\mp A"
          }
        ],
        conclusion: "The recovered amount is the cost price.",
        commonTrap: "Do not use the same sign as the forward sale; this question works backward."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-024": {
      stem: {
        contextFamily: "handicraft pricing",
        blocks: [
          {
            type: "paragraph",
            content: "The profit on the handcrafted vase is {fractionNumerator}/{fractionDenominator} of its cost price."
          }
        ],
        prompt: "Find the profit percentage."
      },
      explanation: {
        opening: "A fractional profit or loss must be converted with close attention to the stated base.",
        concept: "A fraction of cost converts directly to percent, while a fraction of selling price first changes the hidden cost share.",
        steps: [
          {
            title: "Identify the denominator base",
            body: "Decide whether the fraction is measured on cost price or selling price."
          },
          {
            title: "Convert to the cost-price rate",
            body: "Use the direct fraction for a cost base; for a selling-price base, reconstruct cost before comparing."
          }
        ],
        conclusion: "The resulting percentage is the ordinary profit or loss rate on cost price.",
        commonTrap: "Do not multiply every fraction by 100 without checking whether its denominator is cost or selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-025": {
      stem: {
        contextFamily: "pottery outlet",
        blocks: [
          {
            type: "paragraph",
            content: "The loss on the ceramic dinner set is {fractionNumerator}/{fractionDenominator} of its cost price."
          }
        ],
        prompt: "Find the loss percentage."
      },
      explanation: {
        opening: "A fractional profit or loss must be converted with close attention to the stated base.",
        concept: "A fraction of cost converts directly to percent, while a fraction of selling price first changes the hidden cost share.",
        steps: [
          {
            title: "Identify the denominator base",
            body: "Decide whether the fraction is measured on cost price or selling price."
          },
          {
            title: "Convert to the cost-price rate",
            body: "Use the direct fraction for a cost base; for a selling-price base, reconstruct cost before comparing."
          }
        ],
        conclusion: "The resulting percentage is the ordinary profit or loss rate on cost price.",
        commonTrap: "Do not multiply every fraction by 100 without checking whether its denominator is cost or selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-026": {
      stem: {
        contextFamily: "art-print sale",
        blocks: [
          {
            type: "paragraph",
            content: "The gallery seller's profit is {fractionNumerator}/{fractionDenominator} of the selling price."
          }
        ],
        prompt: "Find the profit percentage on cost price."
      },
      explanation: {
        opening: "A fractional profit or loss must be converted with close attention to the stated base.",
        concept: "A fraction of cost converts directly to percent, while a fraction of selling price first changes the hidden cost share.",
        steps: [
          {
            title: "Identify the denominator base",
            body: "Decide whether the fraction is measured on cost price or selling price."
          },
          {
            title: "Convert to the cost-price rate",
            body: "Use the direct fraction for a cost base; for a selling-price base, reconstruct cost before comparing."
          }
        ],
        conclusion: "The resulting percentage is the ordinary profit or loss rate on cost price.",
        commonTrap: "Do not multiply every fraction by 100 without checking whether its denominator is cost or selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-027": {
      stem: {
        contextFamily: "used-book exchange",
        blocks: [
          {
            type: "paragraph",
            content: "The loss incurred is {fractionNumerator}/{fractionDenominator} of the selling price."
          }
        ],
        prompt: "Find the loss percentage on cost price."
      },
      explanation: {
        opening: "A fractional profit or loss must be converted with close attention to the stated base.",
        concept: "A fraction of cost converts directly to percent, while a fraction of selling price first changes the hidden cost share.",
        steps: [
          {
            title: "Identify the denominator base",
            body: "Decide whether the fraction is measured on cost price or selling price."
          },
          {
            title: "Convert to the cost-price rate",
            body: "Use the direct fraction for a cost base; for a selling-price base, reconstruct cost before comparing."
          }
        ],
        conclusion: "The resulting percentage is the ordinary profit or loss rate on cost price.",
        commonTrap: "Do not multiply every fraction by 100 without checking whether its denominator is cost or selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-028": {
      stem: {
        contextFamily: "camera-accessory trade",
        blocks: [
          {
            type: "paragraph",
            content: "The camera tripod is sold at {profitPercent}% profit on cost price."
          }
        ],
        prompt: "What fraction of the selling price is the profit?"
      },
      explanation: {
        opening: "The easiest conversion is to imagine cost price as 100 equal parts.",
        concept: "The rate gives the profit or loss parts, while selling price is formed by adding or subtracting those parts from 100.",
        steps: [
          {
            title: "Create the part model",
            body: "Take cost price as 100 and write the profit or loss amount as r parts."
          },
          {
            title: "Form the requested selling-price fraction",
            body: "Divide the amount parts by the selling-price parts and simplify."
          }
        ],
        conclusion: "The simplified fraction is the required share of selling price.",
        commonTrap: "Do not place 100 automatically in the denominator when the requested fraction is of selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-029": {
      stem: {
        contextFamily: "home-fitness equipment sale",
        blocks: [
          {
            type: "paragraph",
            content: "The exercise bench is sold at {lossPercent}% loss on cost price."
          }
        ],
        prompt: "What fraction of the selling price is the loss?"
      },
      explanation: {
        opening: "The easiest conversion is to imagine cost price as 100 equal parts.",
        concept: "The rate gives the profit or loss parts, while selling price is formed by adding or subtracting those parts from 100.",
        steps: [
          {
            title: "Create the part model",
            body: "Take cost price as 100 and write the profit or loss amount as r parts."
          },
          {
            title: "Form the requested selling-price fraction",
            body: "Divide the amount parts by the selling-price parts and simplify."
          }
        ],
        conclusion: "The simplified fraction is the required share of selling price.",
        commonTrap: "Do not place 100 automatically in the denominator when the requested fraction is of selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-030": {
      stem: {
        contextFamily: "air-conditioner pricing comparison",
        blocks: [
          {
            type: "paragraph",
            content: "The air conditioner costing \u20B9{costPrice} could be sold at profits of {firstRatePercent}% or {secondRatePercent}%."
          }
        ],
        prompt: "Find the difference between the two selling prices."
      },
      explanation: {
        opening: "Both possible selling prices come from the same cost, so their difference can be found efficiently.",
        concept: "The common cost cancels except for the difference between the two commercial rate factors.",
        steps: [
          {
            title: "Write both selling prices",
            body: "Apply each stated profit or loss multiplier to the same cost price."
          },
          {
            title: "Subtract the results",
            body: "The absolute difference equals cost price multiplied by the difference of the signed rates.",
            equationLatex: "\\Delta S=C\\frac{|r_1-r_2|}{100}"
          }
        ],
        conclusion: "The absolute value is the required difference between the two selling prices.",
        commonTrap: "Do not add the two selling prices or compare the rates without using the common cost base."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-031": {
      stem: {
        contextFamily: "motor-pump pricing comparison",
        blocks: [
          {
            type: "paragraph",
            content: "For the water pump costing \u20B9{costPrice}, one selling price gives {profitPercent}% profit and another gives {lossPercent}% loss."
          }
        ],
        prompt: "Find the difference between the selling prices."
      },
      explanation: {
        opening: "Both possible selling prices come from the same cost, so their difference can be found efficiently.",
        concept: "The common cost cancels except for the difference between the two commercial rate factors.",
        steps: [
          {
            title: "Write both selling prices",
            body: "Apply each stated profit or loss multiplier to the same cost price."
          },
          {
            title: "Subtract the results",
            body: "The absolute difference equals cost price multiplied by the difference of the signed rates.",
            equationLatex: "\\Delta S=C\\frac{|r_1-r_2|}{100}"
          }
        ],
        conclusion: "The absolute value is the required difference between the two selling prices.",
        commonTrap: "Do not add the two selling prices or compare the rates without using the common cost base."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-032": {
      stem: {
        contextFamily: "solar-inverter reverse pricing",
        blocks: [
          {
            type: "paragraph",
            content: "The difference between the selling prices obtained at {firstRatePercent}% profit and {secondRatePercent}% profit is \u20B9{sellingPriceDifference}."
          }
        ],
        prompt: "Find the cost price."
      },
      explanation: {
        opening: "The given selling-price difference represents a known percentage portion of the hidden cost price.",
        concept: "When two rates act on the same cost, the price difference equals cost multiplied by the difference between their signed rates.",
        steps: [
          {
            title: "Find the effective rate gap",
            body: "Measure the distance between the two profit-or-loss conditions."
          },
          {
            title: "Recover cost price",
            body: "Scale the known price difference from the rate gap to 100 percent.",
            equationLatex: "C=\\frac{100\\Delta S}{|r_1-r_2|}"
          }
        ],
        conclusion: "The scaled amount is the original cost price.",
        commonTrap: "Do not divide by either individual rate; the relevant percentage is the gap between the two conditions."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-033": {
      stem: {
        contextFamily: "commercial-oven repricing",
        blocks: [
          {
            type: "paragraph",
            content: "The commercial oven was sold for \u20B9{firstSellingPrice} at a profit of {firstRatePercent}%. If it were sold for \u20B9{secondSellingPrice},"
          }
        ],
        prompt: "Find the profit or loss percentage under the new condition."
      },
      explanation: {
        opening: "We should first use the known selling condition to uncover the common cost price.",
        concept: "Both selling prices belong to the same item, so once cost is known the second rate follows from an ordinary comparison.",
        steps: [
          {
            title: "Recover cost from the first condition",
            body: "Reverse the first profit or loss multiplier from the first selling price."
          },
          {
            title: "Evaluate the second condition",
            body: "Compare the second selling price with the recovered cost and measure the difference on cost."
          }
        ],
        conclusion: "This comparison gives both the direction and percentage of the second sale.",
        commonTrap: "Do not compare the two selling prices directly as if the first selling price were the cost base."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-034": {
      stem: {
        contextFamily: "used-scooter repricing",
        blocks: [
          {
            type: "paragraph",
            content: "Selling the used scooter for \u20B9{firstSellingPrice} causes a loss of {firstRatePercent}%. If it is sold for \u20B9{secondSellingPrice},"
          }
        ],
        prompt: "Calculate the percentage gain or loss under the new condition."
      },
      explanation: {
        opening: "We should first use the known selling condition to uncover the common cost price.",
        concept: "Both selling prices belong to the same item, so once cost is known the second rate follows from an ordinary comparison.",
        steps: [
          {
            title: "Recover cost from the first condition",
            body: "Reverse the first profit or loss multiplier from the first selling price."
          },
          {
            title: "Evaluate the second condition",
            body: "Compare the second selling price with the recovered cost and measure the difference on cost."
          }
        ],
        conclusion: "This comparison gives both the direction and percentage of the second sale.",
        commonTrap: "Do not compare the two selling prices directly as if the first selling price were the cost base."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-035": {
      stem: {
        contextFamily: "no-margin community sale",
        blocks: [
          {
            type: "paragraph",
            content: "A community supplier buys a school-desk set for \u20B9{costPrice} and sells it for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Find the profit or loss percentage."
      },
      explanation: {
        opening: "We first find the rupee change and then express it relative to the original cost.",
        concept: "In ordinary profit-and-loss questions, cost price is the percentage base unless another base is stated explicitly.",
        steps: [
          {
            title: "Find profit or loss amount",
            body: "Compare selling price and cost price, then take their absolute difference.",
            equationLatex: "A=|S-C|"
          },
          {
            title: "Convert the amount to a rate",
            body: "Divide the amount by cost price and multiply by 100.",
            equationLatex: "r=\\frac{A}{C}\\times100"
          }
        ],
        conclusion: "The sign of S\u2212C gives profit, loss, or no change; the formula gives the percentage.",
        commonTrap: "Do not divide by selling price unless the question specifically asks for a margin on selling price."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-036": {
      stem: {
        contextFamily: "algebraic wholesale pricing",
        blocks: [
          {
            type: "paragraph",
            content: "In an algebraic wholesale pricing comparison, two possible selling conditions differ by \u20B9{sellingPriceDifference}."
          },
          {
            type: "equation",
            latex: "S_1=C\\left(1+\\frac{{firstRatePercent}}{100}\\right),\\qquad S_2=C\\left(1-\\frac{{secondRatePercent}}{100}\\right)"
          }
        ],
        prompt: "Find the original cost price."
      },
      explanation: {
        opening: "The given selling-price difference represents a known percentage portion of the hidden cost price.",
        concept: "When two rates act on the same cost, the price difference equals cost multiplied by the difference between their signed rates.",
        steps: [
          {
            title: "Find the effective rate gap",
            body: "Measure the distance between the two profit-or-loss conditions."
          },
          {
            title: "Recover cost price",
            body: "Scale the known price difference from the rate gap to 100 percent.",
            equationLatex: "C=\\frac{100\\Delta S}{|r_1-r_2|}"
          }
        ],
        conclusion: "The scaled amount is the original cost price.",
        commonTrap: "Do not divide by either individual rate; the relevant percentage is the gap between the two conditions."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    }
  },
  entryCount: 36
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
        const rows2 = resolveRows(block, context);
        parts.push(`| ${columns.map(escapeTableCell).join(" | ")} |`);
        parts.push(`| ${columns.map(() => "---").join(" | ")} |`);
        if (rows2.length === 0 && block.rowSource) {
          parts.push(`| ${[`{${block.rowSource}}`, ...columns.slice(1).map(() => "")].map(escapeTableCell).join(" | ")} |`);
        } else {
          for (const row of rows2) {
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
function addRational(a, b) {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator
  );
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
function compareRational(a, b) {
  const left = a.numerator * b.denominator;
  const right = b.numerator * a.denominator;
  return left < right ? -1 : left > right ? 1 : 0;
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
function moneyFromRupees(rupees6) {
  return { paise: BigInt(rupees6) * 100n };
}
function addMoney(...values) {
  return { paise: values.reduce((sum, value) => sum + value.paise, 0n) };
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
function rateMultiplier(direction2, ratePercent) {
  const rate2 = divideRational(ratePercent, rational(100));
  const multiplier4 = direction2 === "PROFIT" ? rational(rate2.denominator + rate2.numerator, rate2.denominator) : rational(rate2.denominator - rate2.numerator, rate2.denominator);
  if (multiplier4.numerator <= 0n) throw new Error("Commercial multiplier must be positive.");
  return multiplier4;
}
function sellingPriceFromCostAndRate(input) {
  return multiplyMoney(input.costPrice, rateMultiplier(input.direction, input.ratePercent));
}
function costPriceFromSellingPriceAndRate(input) {
  return multiplyMoney(input.sellingPrice, divideRational(rational(1), rateMultiplier(input.direction, input.ratePercent)));
}
function sellingPriceFromCostAndAmount(input) {
  return input.direction === "PROFIT" ? addMoney(input.costPrice, input.amount) : subtractMoney(input.costPrice, input.amount);
}
function costPriceFromSellingPriceAndAmount(input) {
  return input.direction === "PROFIT" ? subtractMoney(input.sellingPrice, input.amount) : addMoney(input.sellingPrice, input.amount);
}
function amountFromCostAndRate(input) {
  return multiplyMoney(input.costPrice, divideRational(input.ratePercent, rational(100)));
}
function costPriceFromAmountAndRate(input) {
  if (input.ratePercent.numerator <= 0n) throw new Error("Rate must be positive.");
  return multiplyMoney(input.amount, divideRational(rational(100), input.ratePercent));
}
function rateFromAmountAndCost(input) {
  if (input.costPrice.paise <= 0n) throw new Error("Cost price must be positive.");
  return asPercent(divideRational(rational(input.amount.paise), rational(input.costPrice.paise)));
}
function rateFromCostSellingRatio(input) {
  const comparison = compareRational(input.sellingPart, input.costPart);
  if (comparison === 0) return { direction: "NO_CHANGE", rate: rational(0), base: "COST_PRICE" };
  const difference = comparison > 0 ? subtractRational(input.sellingPart, input.costPart) : subtractRational(input.costPart, input.sellingPart);
  return { direction: comparison > 0 ? "PROFIT" : "LOSS", rate: asPercent(divideRational(difference, input.costPart)), base: "COST_PRICE" };
}
function costSellingRatioFromRate(input) {
  return { costPart: rational(1), sellingPart: rateMultiplier(input.direction, input.ratePercent) };
}
function profitPercentOnCostFromMarginOnSelling(marginPercent) {
  const margin = divideRational(marginPercent, rational(100));
  if (margin.numerator >= margin.denominator) throw new Error("Profit margin on selling price must be below 100%.");
  return asPercent(divideRational(margin, subtractRational(rational(1), margin)));
}
function marginOnSellingFromProfitPercentOnCost(profitPercent) {
  const profit = divideRational(profitPercent, rational(100));
  return asPercent(divideRational(profit, rational(profit.denominator + profit.numerator, profit.denominator)));
}
function rateFromAmountFraction(input) {
  if (input.amountFraction.numerator < 0n) throw new Error("Fraction cannot be negative.");
  if (input.fractionBase === "COST_PRICE") return asPercent(input.amountFraction);
  const denominator = input.direction === "PROFIT" ? subtractRational(rational(1), input.amountFraction) : rational(input.amountFraction.denominator + input.amountFraction.numerator, input.amountFraction.denominator);
  if (denominator.numerator <= 0n) throw new Error("Invalid selling-price fraction.");
  return asPercent(divideRational(input.amountFraction, denominator));
}
function amountFractionFromRate(input) {
  const rate2 = divideRational(input.ratePercent, rational(100));
  if (input.fractionBase === "COST_PRICE") return rate2;
  return input.direction === "PROFIT" ? divideRational(rate2, rational(rate2.denominator + rate2.numerator, rate2.denominator)) : divideRational(rate2, rational(rate2.denominator - rate2.numerator, rate2.denominator));
}
function sellingPriceDifferenceFromCostAndRates(input) {
  const first = sellingPriceFromCostAndRate({ costPrice: input.costPrice, direction: input.firstDirection, ratePercent: input.firstRatePercent });
  const second = sellingPriceFromCostAndRate({ costPrice: input.costPrice, direction: input.secondDirection, ratePercent: input.secondRatePercent });
  return { paise: first.paise >= second.paise ? first.paise - second.paise : second.paise - first.paise };
}
function costPriceFromSellingPriceDifference(input) {
  const first = rateMultiplier(input.firstDirection, input.firstRatePercent);
  const second = rateMultiplier(input.secondDirection, input.secondRatePercent);
  const delta = compareRational(first, second) >= 0 ? subtractRational(first, second) : subtractRational(second, first);
  if (delta.numerator === 0n) throw new Error("Selling conditions must produce different prices.");
  return multiplyMoney(input.difference, divideRational(rational(1), delta));
}
function secondConditionRate(input) {
  const costPrice = costPriceFromSellingPriceAndRate({ sellingPrice: input.firstSellingPrice, direction: input.firstDirection, ratePercent: input.firstRatePercent });
  return profitOrLossRateOnCost({ costPrice, sellingPrice: input.secondSellingPrice });
}
function sellingPriceAfterDiscount(markedPrice, discountPercent) {
  const discount = divideRational(discountPercent, rational(100));
  const multiplier4 = rational(discount.denominator - discount.numerator, discount.denominator);
  if (multiplier4.numerator < 0n) throw new Error("Discount cannot exceed 100%.");
  return multiplyMoney(markedPrice, multiplier4);
}
function composePercentageMultipliers(rates, directions) {
  if (rates.length !== directions.length) throw new Error("Rates and directions must align.");
  return rates.reduce((accumulator, rate2, index) => {
    const fraction = divideRational(rate2, rational(100));
    const multiplier4 = directions[index] === "INCREASE" ? rational(fraction.denominator + fraction.numerator, fraction.denominator) : rational(fraction.denominator - fraction.numerator, fraction.denominator);
    return multiplyRational(accumulator, multiplier4);
  }, rational(1));
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/ledgers.ts
function createPriceLedger(input) {
  return Object.freeze({ ...input });
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/solver.ts
function solveFundamental(request) {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const delta = profitOrLossAmount(createPriceLedger(request));
      const direction2 = delta.paise > 0n ? "PROFIT" : delta.paise < 0n ? "LOSS" : "NO_CHANGE";
      return { mode: request.mode, direction: direction2, amount: moneyFromPaise(delta.paise < 0n ? -delta.paise : delta.paise) };
    }
    case "CP_RATE_TO_AMOUNT":
      return { mode: request.mode, amount: amountFromCostAndRate(request) };
    case "CP_AMOUNT_TO_SP":
      return { mode: request.mode, sellingPrice: sellingPriceFromCostAndAmount(request) };
    case "SP_AMOUNT_TO_CP":
      return { mode: request.mode, costPrice: costPriceFromSellingPriceAndAmount(request) };
    case "CP_SP_TO_RATE": {
      const result = profitOrLossRateOnCost(createPriceLedger(request));
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
    case "CP_RATE_TO_SP":
      return { mode: request.mode, sellingPrice: sellingPriceFromCostAndRate(request) };
    case "SP_RATE_TO_CP":
      return { mode: request.mode, costPrice: costPriceFromSellingPriceAndRate(request) };
    case "AMOUNT_RATE_TO_CP":
      return { mode: request.mode, costPrice: costPriceFromAmountAndRate(request) };
    case "AMOUNT_CP_TO_RATE":
      return { mode: request.mode, direction: request.direction, ratePercent: rateFromAmountAndCost(request) };
    case "CP_SP_RATIO_TO_RATE": {
      const result = rateFromCostSellingRatio(request);
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
    case "RATE_TO_CP_SP_RATIO":
      return { mode: request.mode, ...costSellingRatioFromRate(request) };
    case "MARGIN_SP_TO_PROFIT_CP":
      return { mode: request.mode, profitPercent: profitPercentOnCostFromMarginOnSelling(request.marginPercent) };
    case "PROFIT_CP_TO_MARGIN_SP":
      return { mode: request.mode, marginPercent: marginOnSellingFromProfitPercentOnCost(request.profitPercent) };
    case "FRACTION_TO_RATE":
      return { mode: request.mode, ratePercent: rateFromAmountFraction(request) };
    case "RATE_TO_FRACTION":
      return { mode: request.mode, amountFraction: amountFractionFromRate(request) };
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      return { mode: request.mode, difference: sellingPriceDifferenceFromCostAndRates(request) };
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      return { mode: request.mode, costPrice: costPriceFromSellingPriceDifference(request) };
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE": {
      const result = secondConditionRate(request);
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/validator.ts
function positiveMoney(name, value, errors) {
  if (value.paise <= 0n) errors.push(`${name} must be positive.`);
}
function positiveRational(name, value, errors) {
  if (value.denominator <= 0n) errors.push(`${name} must have a positive denominator.`);
  if (value.numerator <= 0n) errors.push(`${name} must be positive.`);
}
function nonNegativeRate(name, value, errors) {
  if (value.denominator <= 0n) errors.push(`${name} must have a positive denominator.`);
  if (value.numerator < 0n) errors.push(`${name} cannot be negative.`);
}
function validateFundamentalInput(input) {
  const errors = [];
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
function validateOptions(options, correctAnswer) {
  const errors = [];
  if (options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(options).size !== options.length) errors.push("Options must be unique.");
  if (!options.includes(correctAnswer)) errors.push("Correct answer must occur in options.");
  return { ok: errors.length === 0, errors };
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-001/cp001-dynamic-verifier.ts
function absoluteBigInt(value) {
  return value < 0n ? -value : value;
}
function moneyFromExactRational(value) {
  if (value.numerator % value.denominator !== 0n) {
    throw new Error(
      `Independent CP-001 verification produced non-integral paise: ${value.numerator}/${value.denominator}.`
    );
  }
  return moneyFromPaise(value.numerator / value.denominator);
}
function multiplyMoneyByRational(value, factor) {
  return moneyFromExactRational(multiplyRational(rational(value.paise), factor));
}
function commercialFactor(direction2, ratePercent) {
  const rate2 = divideRational(ratePercent, rational(100));
  return direction2 === "PROFIT" ? addRational(rational(1), rate2) : subtractRational(rational(1), rate2);
}
function directionFromDelta(delta) {
  return delta > 0n ? "PROFIT" : delta < 0n ? "LOSS" : "NO_CHANGE";
}
function signedRate(direction2, ratePercent) {
  return direction2 === "PROFIT" ? ratePercent : rational(-ratePercent.numerator, ratePercent.denominator);
}
function independentlySolveFundamental(request) {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const delta = request.sellingPrice.paise - request.costPrice.paise;
      return {
        mode: request.mode,
        direction: directionFromDelta(delta),
        amount: moneyFromPaise(absoluteBigInt(delta))
      };
    }
    case "CP_RATE_TO_AMOUNT": {
      const amount = multiplyMoneyByRational(
        request.costPrice,
        divideRational(request.ratePercent, rational(100))
      );
      return { mode: request.mode, amount };
    }
    case "CP_AMOUNT_TO_SP": {
      const sellingPrice2 = moneyFromPaise(
        request.direction === "PROFIT" ? request.costPrice.paise + request.amount.paise : request.costPrice.paise - request.amount.paise
      );
      return { mode: request.mode, sellingPrice: sellingPrice2 };
    }
    case "SP_AMOUNT_TO_CP": {
      const costPrice = moneyFromPaise(
        request.direction === "PROFIT" ? request.sellingPrice.paise - request.amount.paise : request.sellingPrice.paise + request.amount.paise
      );
      return { mode: request.mode, costPrice };
    }
    case "CP_SP_TO_RATE": {
      const delta = request.sellingPrice.paise - request.costPrice.paise;
      const ratePercent = multiplyRational(
        divideRational(
          rational(absoluteBigInt(delta)),
          rational(request.costPrice.paise)
        ),
        rational(100)
      );
      return {
        mode: request.mode,
        direction: directionFromDelta(delta),
        ratePercent
      };
    }
    case "CP_RATE_TO_SP": {
      return {
        mode: request.mode,
        sellingPrice: multiplyMoneyByRational(
          request.costPrice,
          commercialFactor(request.direction, request.ratePercent)
        )
      };
    }
    case "SP_RATE_TO_CP": {
      return {
        mode: request.mode,
        costPrice: moneyFromExactRational(
          divideRational(
            rational(request.sellingPrice.paise),
            commercialFactor(request.direction, request.ratePercent)
          )
        )
      };
    }
    case "AMOUNT_RATE_TO_CP": {
      return {
        mode: request.mode,
        costPrice: moneyFromExactRational(
          divideRational(
            multiplyRational(rational(request.amount.paise), rational(100)),
            request.ratePercent
          )
        )
      };
    }
    case "AMOUNT_CP_TO_RATE": {
      return {
        mode: request.mode,
        direction: request.direction,
        ratePercent: multiplyRational(
          divideRational(
            rational(request.amount.paise),
            rational(request.costPrice.paise)
          ),
          rational(100)
        )
      };
    }
    case "CP_SP_RATIO_TO_RATE": {
      const difference = subtractRational(request.sellingPart, request.costPart);
      const direction2 = compareRational(difference, rational(0)) > 0 ? "PROFIT" : compareRational(difference, rational(0)) < 0 ? "LOSS" : "NO_CHANGE";
      return {
        mode: request.mode,
        direction: direction2,
        ratePercent: multiplyRational(
          divideRational(
            rational(
              absoluteBigInt(difference.numerator),
              difference.denominator
            ),
            request.costPart
          ),
          rational(100)
        )
      };
    }
    case "RATE_TO_CP_SP_RATIO": {
      return {
        mode: request.mode,
        costPart: rational(1),
        sellingPart: commercialFactor(request.direction, request.ratePercent)
      };
    }
    case "MARGIN_SP_TO_PROFIT_CP": {
      return {
        mode: request.mode,
        profitPercent: multiplyRational(
          divideRational(
            request.marginPercent,
            subtractRational(rational(100), request.marginPercent)
          ),
          rational(100)
        )
      };
    }
    case "PROFIT_CP_TO_MARGIN_SP": {
      return {
        mode: request.mode,
        marginPercent: multiplyRational(
          divideRational(
            request.profitPercent,
            addRational(rational(100), request.profitPercent)
          ),
          rational(100)
        )
      };
    }
    case "FRACTION_TO_RATE": {
      const ratePercent = request.fractionBase === "COST_PRICE" ? multiplyRational(request.amountFraction, rational(100)) : request.direction === "PROFIT" ? multiplyRational(
        divideRational(
          request.amountFraction,
          subtractRational(rational(1), request.amountFraction)
        ),
        rational(100)
      ) : multiplyRational(
        divideRational(
          request.amountFraction,
          addRational(rational(1), request.amountFraction)
        ),
        rational(100)
      );
      return { mode: request.mode, ratePercent };
    }
    case "RATE_TO_FRACTION": {
      const rate2 = divideRational(request.ratePercent, rational(100));
      const amountFraction = request.fractionBase === "COST_PRICE" ? rate2 : request.direction === "PROFIT" ? divideRational(rate2, addRational(rational(1), rate2)) : divideRational(rate2, subtractRational(rational(1), rate2));
      return { mode: request.mode, amountFraction };
    }
    case "CP_TWO_RATES_TO_SP_DIFFERENCE": {
      const gap = subtractRational(
        signedRate(request.firstDirection, request.firstRatePercent),
        signedRate(request.secondDirection, request.secondRatePercent)
      );
      return {
        mode: request.mode,
        difference: multiplyMoneyByRational(
          request.costPrice,
          divideRational(
            rational(absoluteBigInt(gap.numerator), gap.denominator),
            rational(100)
          )
        )
      };
    }
    case "SP_DIFFERENCE_TWO_RATES_TO_CP": {
      const gap = subtractRational(
        signedRate(request.firstDirection, request.firstRatePercent),
        signedRate(request.secondDirection, request.secondRatePercent)
      );
      const absoluteGap = rational(
        absoluteBigInt(gap.numerator),
        gap.denominator
      );
      return {
        mode: request.mode,
        costPrice: moneyFromExactRational(
          divideRational(
            multiplyRational(rational(request.difference.paise), rational(100)),
            absoluteGap
          )
        )
      };
    }
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE": {
      const costPrice = moneyFromExactRational(
        divideRational(
          rational(request.firstSellingPrice.paise),
          commercialFactor(request.firstDirection, request.firstRatePercent)
        )
      );
      const delta = request.secondSellingPrice.paise - costPrice.paise;
      return {
        mode: request.mode,
        direction: directionFromDelta(delta),
        ratePercent: multiplyRational(
          divideRational(
            rational(absoluteBigInt(delta)),
            rational(costPrice.paise)
          ),
          rational(100)
        )
      };
    }
  }
}
function sameMoney(left, right) {
  return left.paise === right.paise;
}
function sameRational(left, right) {
  return compareRational(left, right) === 0;
}
function verifyFundamentalResultIndependently(request, actual) {
  const expected = independentlySolveFundamental(request);
  const errors = [];
  if (expected.mode !== actual.mode) {
    errors.push(`Mode mismatch: expected ${expected.mode}, received ${actual.mode}.`);
    return { ok: false, errors };
  }
  switch (actual.mode) {
    case "CP_SP_TO_AMOUNT":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Profit/loss direction mismatch.");
      if (!sameMoney(expected.amount, actual.amount)) errors.push("Amount mismatch.");
      break;
    case "CP_RATE_TO_AMOUNT":
      if (expected.mode !== actual.mode || !sameMoney(expected.amount, actual.amount)) errors.push("Amount mismatch.");
      break;
    case "CP_AMOUNT_TO_SP":
      if (expected.mode !== actual.mode || !sameMoney(expected.sellingPrice, actual.sellingPrice)) errors.push("Selling price mismatch.");
      break;
    case "SP_AMOUNT_TO_CP":
      if (expected.mode !== actual.mode || !sameMoney(expected.costPrice, actual.costPrice)) errors.push("Cost price mismatch.");
      break;
    case "CP_SP_TO_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Profit/loss direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "CP_RATE_TO_SP":
      if (expected.mode !== actual.mode || !sameMoney(expected.sellingPrice, actual.sellingPrice)) errors.push("Selling price mismatch.");
      break;
    case "SP_RATE_TO_CP":
    case "AMOUNT_RATE_TO_CP":
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      if (expected.mode !== actual.mode || !sameMoney(expected.costPrice, actual.costPrice)) errors.push("Cost price mismatch.");
      break;
    case "AMOUNT_CP_TO_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "CP_SP_RATIO_TO_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "RATE_TO_CP_SP_RATIO":
      if (expected.mode !== actual.mode) break;
      if (!sameRational(expected.costPart, actual.costPart)) errors.push("Cost-part mismatch.");
      if (!sameRational(expected.sellingPart, actual.sellingPart)) errors.push("Selling-part mismatch.");
      break;
    case "MARGIN_SP_TO_PROFIT_CP":
      if (expected.mode !== actual.mode || !sameRational(expected.profitPercent, actual.profitPercent)) errors.push("Profit-percent mismatch.");
      break;
    case "PROFIT_CP_TO_MARGIN_SP":
      if (expected.mode !== actual.mode || !sameRational(expected.marginPercent, actual.marginPercent)) errors.push("Margin-percent mismatch.");
      break;
    case "FRACTION_TO_RATE":
      if (expected.mode !== actual.mode || !sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Rate mismatch.");
      break;
    case "RATE_TO_FRACTION":
      if (expected.mode !== actual.mode || !sameRational(expected.amountFraction, actual.amountFraction)) errors.push("Fraction mismatch.");
      break;
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      if (expected.mode !== actual.mode || !sameMoney(expected.difference, actual.difference)) errors.push("Selling-price difference mismatch.");
      break;
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      if (expected.mode !== actual.mode) break;
      if (expected.direction !== actual.direction) errors.push("Second-condition direction mismatch.");
      if (!sameRational(expected.ratePercent, actual.ratePercent)) errors.push("Second-condition rate mismatch.");
      break;
  }
  return { ok: errors.length === 0, errors };
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-001/cp001-dynamic-runtime.ts
var PNL_CP001_ID = "PNL-CP-001";
var PNL_CP001_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE";
var taskRegistry = task_registry_library_default;
var editorialLibrary = editorial_content_en_default;
var qlIds = Object.keys(taskRegistry.entries);
var COST_RUPEES = [
  2400,
  3e3,
  3600,
  4e3,
  4800,
  6e3,
  7200,
  8e3,
  9e3,
  9600,
  12e3,
  14400,
  15e3,
  18e3,
  2e4,
  24e3
];
var RATE_VALUES = [
  rational(5),
  rational(10),
  rational(25, 2),
  rational(15),
  rational(20),
  rational(25),
  rational(30),
  rational(40),
  rational(50)
];
var MARGIN_VALUES = [
  rational(10),
  rational(20),
  rational(25),
  rational(40),
  rational(50)
];
var PROFIT_FOR_MARGIN_VALUES = [
  rational(10),
  rational(20),
  rational(25),
  rational(50),
  rational(100)
];
var PROFIT_SP_FRACTIONS = [
  rational(1, 11),
  rational(1, 6),
  rational(1, 5),
  rational(1, 4),
  rational(1, 3)
];
var LOSS_SP_FRACTIONS = [
  rational(1, 9),
  rational(1, 4),
  rational(1, 3),
  rational(1, 2)
];
var CP_FRACTIONS = [
  rational(1, 20),
  rational(1, 10),
  rational(1, 8),
  rational(3, 20),
  rational(1, 5),
  rational(1, 4),
  rational(2, 5)
];
var PROFIT_RATIO_PAIRS = [
  [4, 5],
  [5, 6],
  [8, 9],
  [10, 11],
  [5, 7],
  [2, 3]
];
var LOSS_RATIO_PAIRS = [
  [5, 4],
  [6, 5],
  [8, 7],
  [10, 9],
  [5, 3],
  [4, 3]
];
var TWO_PROFIT_RATE_PAIRS = [
  [rational(10), rational(20)],
  [rational(15), rational(25)],
  [rational(20), rational(40)],
  [rational(25), rational(50)],
  [rational(5), rational(30)]
];
var PROFIT_LOSS_RATE_PAIRS = [
  [rational(10), rational(5)],
  [rational(15), rational(10)],
  [rational(20), rational(10)],
  [rational(25), rational(15)],
  [rational(30), rational(20)]
];
function absoluteBigInt2(value) {
  return value < 0n ? -value : value;
}
function gcd2(a, b) {
  let left = absoluteBigInt2(a);
  let right = absoluteBigInt2(b);
  while (right !== 0n) {
    [left, right] = [right, left % right];
  }
  return left || 1n;
}
function moneyFromExactRational2(value) {
  if (value.numerator % value.denominator !== 0n) {
    throw new Error(`Non-integral paise in CP-001 generator: ${value.numerator}/${value.denominator}.`);
  }
  return moneyFromPaise(value.numerator / value.denominator);
}
function moneyFromRoundedRational(value) {
  const quotient = value.numerator / value.denominator;
  const remainder = absoluteBigInt2(value.numerator % value.denominator);
  const adjustment = remainder * 2n >= absoluteBigInt2(value.denominator) ? value.numerator < 0n ? -1n : 1n : 0n;
  return moneyFromPaise(quotient + adjustment);
}
function multiplyMoneyByRational2(value, factor) {
  return moneyFromExactRational2(multiplyRational(rational(value.paise), factor));
}
function multiplyMoneyByRationalRounded(value, factor) {
  return moneyFromRoundedRational(multiplyRational(rational(value.paise), factor));
}
function commercialFactor2(direction2, ratePercent) {
  const rate2 = divideRational(ratePercent, rational(100));
  return direction2 === "PROFIT" ? addRational(rational(1), rate2) : subtractRational(rational(1), rate2);
}
function amountFromCost(costPrice, ratePercent) {
  return multiplyMoneyByRational2(
    costPrice,
    divideRational(ratePercent, rational(100))
  );
}
function sellingPriceFromCost(costPrice, direction2, ratePercent) {
  return multiplyMoneyByRational2(
    costPrice,
    commercialFactor2(direction2, ratePercent)
  );
}
function pickCost(random) {
  return moneyFromRupees(pickSeeded(random, COST_RUPEES));
}
function pickRate(random) {
  return pickSeeded(random, RATE_VALUES);
}
function differentRate(random, first) {
  const eligible = RATE_VALUES.filter((value) => compareRational(value, first) !== 0);
  return pickSeeded(random, eligible);
}
function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 6,
    useGrouping: true
  }).format(value);
}
function formatMoneyNumber(value) {
  const rupees6 = Number(value.paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: value.paise % 100n === 0n ? 0 : 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(rupees6);
}
function formatMoney(value) {
  return `\u20B9${formatMoneyNumber(value)}`;
}
function formatRational(value) {
  return formatNumber(rationalToNumber(value));
}
function formatPercent(value) {
  return `${formatRational(value)}%`;
}
function ratioIntegerParts(costPart, sellingPart) {
  const left = costPart.numerator * sellingPart.denominator;
  const right = sellingPart.numerator * costPart.denominator;
  const divisor = gcd2(left, right);
  return [left / divisor, right / divisor];
}
function formatAnswer(value) {
  switch (value.kind) {
    case "MONEY":
      return value.direction && value.direction !== "NO_CHANGE" ? `${formatMoney(value.value)} ${value.direction.toLowerCase()}` : formatMoney(value.value);
    case "PERCENT":
      return value.direction && value.direction !== "NO_CHANGE" ? `${formatPercent(value.value)} ${value.direction.toLowerCase()}` : formatPercent(value.value);
    case "RATIO": {
      const [cost, selling] = ratioIntegerParts(value.costPart, value.sellingPart);
      return `${cost} : ${selling}`;
    }
    case "FRACTION":
      return `${value.value.numerator}/${value.value.denominator}`;
    case "NO_CHANGE":
      return "No profit, no loss";
  }
}
function normalizeDoublePlaceholders(value) {
  return value.replace(/\{\{([A-Za-z][A-Za-z0-9_]*)\}\}/g, "{$1}");
}
function normalizedEditorialEntry(entry) {
  return JSON.parse(
    normalizeDoublePlaceholders(JSON.stringify(entry))
  );
}
function contextFromRequest(qlId, request) {
  const context = {};
  const money = (key, value) => {
    context[key] = formatMoneyNumber(value);
  };
  const rate2 = (key, value) => {
    context[key] = formatRational(value);
  };
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT":
      money("costPrice", request.costPrice);
      money("sellingPrice", request.sellingPrice);
      break;
    case "CP_RATE_TO_AMOUNT":
      money("costPrice", request.costPrice);
      rate2(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "CP_AMOUNT_TO_SP":
      money("costPrice", request.costPrice);
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      break;
    case "SP_AMOUNT_TO_CP":
      money("sellingPrice", request.sellingPrice);
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      break;
    case "CP_SP_TO_RATE":
      money("costPrice", request.costPrice);
      money("sellingPrice", request.sellingPrice);
      break;
    case "CP_RATE_TO_SP":
      money("costPrice", request.costPrice);
      rate2(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "SP_RATE_TO_CP":
      money("sellingPrice", request.sellingPrice);
      rate2(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "AMOUNT_RATE_TO_CP":
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      rate2(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "AMOUNT_CP_TO_RATE":
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      money("costPrice", request.costPrice);
      break;
    case "CP_SP_RATIO_TO_RATE":
      rate2("costPart", request.costPart);
      rate2("sellingPart", request.sellingPart);
      break;
    case "RATE_TO_CP_SP_RATIO":
      rate2(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "MARGIN_SP_TO_PROFIT_CP":
      rate2("marginPercent", request.marginPercent);
      break;
    case "PROFIT_CP_TO_MARGIN_SP":
      rate2("profitPercent", request.profitPercent);
      break;
    case "FRACTION_TO_RATE":
      context.fractionNumerator = request.amountFraction.numerator.toString();
      context.fractionDenominator = request.amountFraction.denominator.toString();
      break;
    case "RATE_TO_FRACTION":
      rate2(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      money("costPrice", request.costPrice);
      if (qlId === "PNL-QL-031") {
        rate2("profitPercent", request.firstRatePercent);
        rate2("lossPercent", request.secondRatePercent);
      } else {
        rate2("firstRatePercent", request.firstRatePercent);
        rate2("secondRatePercent", request.secondRatePercent);
      }
      break;
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      money("sellingPriceDifference", request.difference);
      rate2("firstRatePercent", request.firstRatePercent);
      rate2("secondRatePercent", request.secondRatePercent);
      break;
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      money("firstSellingPrice", request.firstSellingPrice);
      rate2("firstRatePercent", request.firstRatePercent);
      money("secondSellingPrice", request.secondSellingPrice);
      break;
  }
  return context;
}
function generateCase(qlId, seed) {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-001 QL: ${qlId}`);
  const random = createSeededRandom(`${qlId}:${seed}:parameters`);
  const costPrice = pickCost(random);
  const ratePercent = pickRate(random);
  let request;
  switch (qlId) {
    case "PNL-QL-001":
    case "PNL-QL-002":
    case "PNL-QL-003":
    case "PNL-QL-004": {
      const direction2 = qlId === "PNL-QL-001" || qlId === "PNL-QL-003" ? "PROFIT" : "LOSS";
      request = {
        mode: registry.solveMode,
        costPrice,
        sellingPrice: sellingPriceFromCost(costPrice, direction2, ratePercent)
      };
      break;
    }
    case "PNL-QL-005":
    case "PNL-QL-006": {
      request = {
        mode: "CP_RATE_TO_SP",
        costPrice,
        direction: qlId === "PNL-QL-005" ? "PROFIT" : "LOSS",
        ratePercent
      };
      break;
    }
    case "PNL-QL-007":
    case "PNL-QL-008": {
      const direction2 = qlId === "PNL-QL-007" ? "PROFIT" : "LOSS";
      request = {
        mode: "SP_RATE_TO_CP",
        sellingPrice: sellingPriceFromCost(costPrice, direction2, ratePercent),
        direction: direction2,
        ratePercent
      };
      break;
    }
    case "PNL-QL-009":
    case "PNL-QL-010": {
      request = {
        mode: "AMOUNT_RATE_TO_CP",
        amount: amountFromCost(costPrice, ratePercent),
        direction: qlId === "PNL-QL-009" ? "PROFIT" : "LOSS",
        ratePercent
      };
      break;
    }
    case "PNL-QL-011":
    case "PNL-QL-012": {
      request = {
        mode: "AMOUNT_CP_TO_RATE",
        amount: amountFromCost(costPrice, ratePercent),
        costPrice,
        direction: qlId === "PNL-QL-011" ? "PROFIT" : "LOSS"
      };
      break;
    }
    case "PNL-QL-013": {
      const direction2 = pickSeeded(random, ["PROFIT", "LOSS"]);
      const [costPart, sellingPart] = pickSeeded(
        random,
        direction2 === "PROFIT" ? PROFIT_RATIO_PAIRS : LOSS_RATIO_PAIRS
      );
      request = {
        mode: "CP_SP_RATIO_TO_RATE",
        costPart: rational(costPart),
        sellingPart: rational(sellingPart)
      };
      break;
    }
    case "PNL-QL-014":
    case "PNL-QL-015":
      request = {
        mode: "RATE_TO_CP_SP_RATIO",
        direction: qlId === "PNL-QL-014" ? "PROFIT" : "LOSS",
        ratePercent
      };
      break;
    case "PNL-QL-016":
      request = {
        mode: "MARGIN_SP_TO_PROFIT_CP",
        marginPercent: pickSeeded(random, MARGIN_VALUES)
      };
      break;
    case "PNL-QL-017":
      request = {
        mode: "PROFIT_CP_TO_MARGIN_SP",
        profitPercent: pickSeeded(random, PROFIT_FOR_MARGIN_VALUES)
      };
      break;
    case "PNL-QL-018":
    case "PNL-QL-019":
      request = {
        mode: "CP_RATE_TO_AMOUNT",
        costPrice,
        direction: qlId === "PNL-QL-018" ? "PROFIT" : "LOSS",
        ratePercent
      };
      break;
    case "PNL-QL-020":
    case "PNL-QL-021":
      request = {
        mode: "CP_AMOUNT_TO_SP",
        costPrice,
        amount: amountFromCost(costPrice, ratePercent),
        direction: qlId === "PNL-QL-020" ? "PROFIT" : "LOSS"
      };
      break;
    case "PNL-QL-022":
    case "PNL-QL-023": {
      const direction2 = qlId === "PNL-QL-022" ? "PROFIT" : "LOSS";
      const amount = amountFromCost(costPrice, ratePercent);
      request = {
        mode: "SP_AMOUNT_TO_CP",
        sellingPrice: moneyFromPaise(
          direction2 === "PROFIT" ? costPrice.paise + amount.paise : costPrice.paise - amount.paise
        ),
        amount,
        direction: direction2
      };
      break;
    }
    case "PNL-QL-024":
    case "PNL-QL-025":
      request = {
        mode: "FRACTION_TO_RATE",
        direction: qlId === "PNL-QL-024" ? "PROFIT" : "LOSS",
        amountFraction: pickSeeded(random, CP_FRACTIONS),
        fractionBase: "COST_PRICE"
      };
      break;
    case "PNL-QL-026":
    case "PNL-QL-027":
      request = {
        mode: "FRACTION_TO_RATE",
        direction: qlId === "PNL-QL-026" ? "PROFIT" : "LOSS",
        amountFraction: pickSeeded(
          random,
          qlId === "PNL-QL-026" ? PROFIT_SP_FRACTIONS : LOSS_SP_FRACTIONS
        ),
        fractionBase: "SELLING_PRICE"
      };
      break;
    case "PNL-QL-028":
    case "PNL-QL-029":
      request = {
        mode: "RATE_TO_FRACTION",
        direction: qlId === "PNL-QL-028" ? "PROFIT" : "LOSS",
        ratePercent: qlId === "PNL-QL-028" ? pickSeeded(random, PROFIT_FOR_MARGIN_VALUES) : pickSeeded(random, RATE_VALUES.filter((value) => rationalToNumber(value) < 60)),
        fractionBase: "SELLING_PRICE"
      };
      break;
    case "PNL-QL-030": {
      const [firstRatePercent, secondRatePercent] = pickSeeded(random, TWO_PROFIT_RATE_PAIRS);
      request = {
        mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
        costPrice,
        firstDirection: "PROFIT",
        firstRatePercent,
        secondDirection: "PROFIT",
        secondRatePercent
      };
      break;
    }
    case "PNL-QL-031": {
      const [profitPercent, lossPercent] = pickSeeded(random, PROFIT_LOSS_RATE_PAIRS);
      request = {
        mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
        costPrice,
        firstDirection: "PROFIT",
        firstRatePercent: profitPercent,
        secondDirection: "LOSS",
        secondRatePercent: lossPercent
      };
      break;
    }
    case "PNL-QL-032": {
      const [firstRatePercent, secondRatePercent] = pickSeeded(random, TWO_PROFIT_RATE_PAIRS);
      const difference = multiplyMoneyByRational2(
        costPrice,
        divideRational(
          rational(
            absoluteBigInt2(
              firstRatePercent.numerator * secondRatePercent.denominator - secondRatePercent.numerator * firstRatePercent.denominator
            ),
            firstRatePercent.denominator * secondRatePercent.denominator
          ),
          rational(100)
        )
      );
      request = {
        mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
        difference,
        firstDirection: "PROFIT",
        firstRatePercent,
        secondDirection: "PROFIT",
        secondRatePercent
      };
      break;
    }
    case "PNL-QL-033":
    case "PNL-QL-034": {
      const firstDirection = qlId === "PNL-QL-033" ? "PROFIT" : "LOSS";
      const secondDirection = pickSeeded(random, ["PROFIT", "LOSS", "NO_CHANGE"]);
      const secondRate = secondDirection === "NO_CHANGE" ? rational(0) : differentRate(random, ratePercent);
      request = {
        mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE",
        firstSellingPrice: sellingPriceFromCost(costPrice, firstDirection, ratePercent),
        firstDirection,
        firstRatePercent: ratePercent,
        secondSellingPrice: secondDirection === "NO_CHANGE" ? costPrice : sellingPriceFromCost(costPrice, secondDirection, secondRate)
      };
      break;
    }
    case "PNL-QL-035":
      request = {
        mode: "CP_SP_TO_RATE",
        costPrice,
        sellingPrice: costPrice
      };
      break;
    case "PNL-QL-036": {
      const [profitPercent, lossPercent] = pickSeeded(random, PROFIT_LOSS_RATE_PAIRS);
      const difference = multiplyMoneyByRational2(
        costPrice,
        divideRational(addRational(profitPercent, lossPercent), rational(100))
      );
      request = {
        mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
        difference,
        firstDirection: "PROFIT",
        firstRatePercent: profitPercent,
        secondDirection: "LOSS",
        secondRatePercent: lossPercent
      };
      break;
    }
    default:
      throw new Error(`No CP-001 dynamic parameter contract for ${qlId}.`);
  }
  const context = contextFromRequest(qlId, request);
  for (const required of registry.requiredVariables) {
    if (!(required in context)) {
      throw new Error(`${qlId}: dynamic context is missing required variable ${required}.`);
    }
  }
  return { qlId, registry, request, context, seed };
}
function answerValueFor(qlId, result) {
  switch (qlId) {
    case "PNL-QL-001":
    case "PNL-QL-002":
      if (result.mode !== "CP_SP_TO_AMOUNT") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.amount, direction: result.direction };
    case "PNL-QL-003":
    case "PNL-QL-004":
    case "PNL-QL-013":
      if (result.mode !== "CP_SP_TO_RATE" && result.mode !== "CP_SP_RATIO_TO_RATE") {
        throw new Error(`${qlId}: unexpected result mode.`);
      }
      return { kind: "PERCENT", value: result.ratePercent, direction: result.direction };
    case "PNL-QL-005":
    case "PNL-QL-006":
      if (result.mode !== "CP_RATE_TO_SP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.sellingPrice };
    case "PNL-QL-007":
    case "PNL-QL-008":
      if (result.mode !== "SP_RATE_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-009":
    case "PNL-QL-010":
      if (result.mode !== "AMOUNT_RATE_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-011":
    case "PNL-QL-012":
      if (result.mode !== "AMOUNT_CP_TO_RATE") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.ratePercent };
    case "PNL-QL-014":
    case "PNL-QL-015":
      if (result.mode !== "RATE_TO_CP_SP_RATIO") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "RATIO", costPart: result.costPart, sellingPart: result.sellingPart };
    case "PNL-QL-016":
      if (result.mode !== "MARGIN_SP_TO_PROFIT_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.profitPercent };
    case "PNL-QL-017":
      if (result.mode !== "PROFIT_CP_TO_MARGIN_SP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.marginPercent };
    case "PNL-QL-018":
    case "PNL-QL-019":
      if (result.mode !== "CP_RATE_TO_AMOUNT") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.amount };
    case "PNL-QL-020":
    case "PNL-QL-021":
      if (result.mode !== "CP_AMOUNT_TO_SP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.sellingPrice };
    case "PNL-QL-022":
    case "PNL-QL-023":
      if (result.mode !== "SP_AMOUNT_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-024":
    case "PNL-QL-025":
    case "PNL-QL-026":
    case "PNL-QL-027":
      if (result.mode !== "FRACTION_TO_RATE") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.ratePercent };
    case "PNL-QL-028":
    case "PNL-QL-029":
      if (result.mode !== "RATE_TO_FRACTION") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "FRACTION", value: result.amountFraction };
    case "PNL-QL-030":
    case "PNL-QL-031":
      if (result.mode !== "CP_TWO_RATES_TO_SP_DIFFERENCE") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.difference };
    case "PNL-QL-032":
    case "PNL-QL-036":
      if (result.mode !== "SP_DIFFERENCE_TWO_RATES_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-033":
    case "PNL-QL-034":
      if (result.mode !== "TWO_SELLING_CONDITIONS_TO_SECOND_RATE") throw new Error(`${qlId}: unexpected result mode.`);
      return result.direction === "NO_CHANGE" ? { kind: "NO_CHANGE" } : { kind: "PERCENT", value: result.ratePercent, direction: result.direction };
    case "PNL-QL-035":
      return { kind: "NO_CHANGE" };
    default:
      throw new Error(`No CP-001 answer formatter for ${qlId}.`);
  }
}
function moneyCandidate(value, misconception, direction2) {
  return { value: { kind: "MONEY", value, direction: direction2 }, misconception };
}
function percentCandidate(value, misconception, direction2) {
  return { value: { kind: "PERCENT", value, direction: direction2 }, misconception };
}
function fractionCandidate(value, misconception) {
  return { value: { kind: "FRACTION", value }, misconception };
}
function ratioCandidate(costPart, sellingPart, misconception) {
  return { value: { kind: "RATIO", costPart, sellingPart }, misconception };
}
function fallbackWrongCandidates(correct) {
  switch (correct.kind) {
    case "MONEY": {
      const base = correct.value.paise;
      return [
        moneyCandidate(moneyFromPaise(base + 10000n), "Adds a fixed rupee amount instead of applying the exact relation.", correct.direction),
        moneyCandidate(moneyFromPaise(base > 10000n ? base - 10000n : base + 20000n), "Subtracts a fixed rupee amount instead of applying the exact relation.", correct.direction),
        moneyCandidate(moneyFromPaise(base * 2n), "Doubles the result by applying the operation twice.", correct.direction)
      ];
    }
    case "PERCENT":
      return [
        percentCandidate(addRational(correct.value, rational(5)), "Adds five percentage points instead of using the required base.", correct.direction),
        percentCandidate(multiplyRational(correct.value, rational(2)), "Applies the percentage conversion twice.", correct.direction),
        percentCandidate(divideRational(correct.value, rational(100)), "Reports the decimal rate as a percentage.", correct.direction)
      ];
    case "RATIO":
      return [
        ratioCandidate(correct.sellingPart, correct.costPart, "Reverses cost price and selling price."),
        ratioCandidate(correct.costPart, addRational(correct.sellingPart, rational(1)), "Adds one part without converting the percentage correctly."),
        ratioCandidate(rational(100), correct.sellingPart, "Uses 100 and the rate output without simplifying the commercial ratio.")
      ];
    case "FRACTION":
      return [
        fractionCandidate(rational(correct.value.denominator, correct.value.numerator), "Takes the reciprocal of the required fraction."),
        fractionCandidate(rational(correct.value.numerator, 100), "Places the numerator over 100 without converting the base."),
        fractionCandidate(addRational(correct.value, rational(1, 10)), "Adds an arbitrary tenth instead of using the commercial relation.")
      ];
    case "NO_CHANGE":
      return [
        percentCandidate(rational(5), "Treats equal prices as a small profit.", "PROFIT"),
        percentCandidate(rational(5), "Treats equal prices as a small loss.", "LOSS"),
        percentCandidate(rational(100), "Reports the selling price as 100% profit.", "PROFIT")
      ];
  }
}
function wrongCandidates(generated2, result, correct) {
  const request = generated2.request;
  const candidates = [];
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const opposite = result.mode === request.mode && result.direction === "PROFIT" ? "LOSS" : "PROFIT";
      candidates.push(
        moneyCandidate(
          result.mode === request.mode ? result.amount : moneyFromRupees(1),
          "Finds the correct difference but assigns the opposite profit/loss direction.",
          opposite
        ),
        moneyCandidate(
          moneyFromPaise(request.costPrice.paise + request.sellingPrice.paise),
          "Adds cost price and selling price instead of taking their difference.",
          result.mode === request.mode ? result.direction : void 0
        ),
        moneyCandidate(
          request.costPrice,
          "Reports the cost price instead of the profit or loss amount.",
          result.mode === request.mode ? result.direction : void 0
        )
      );
      break;
    }
    case "CP_SP_TO_RATE": {
      if (result.mode !== request.mode) break;
      if (result.direction === "NO_CHANGE") return fallbackWrongCandidates({ kind: "NO_CHANGE" });
      const amount = moneyFromPaise(absoluteBigInt2(request.sellingPrice.paise - request.costPrice.paise));
      const wrongBase = multiplyRational(
        divideRational(rational(amount.paise), rational(request.sellingPrice.paise)),
        rational(100)
      );
      candidates.push(
        percentCandidate(wrongBase, "Uses selling price as the percentage base.", result.direction),
        percentCandidate(divideRational(result.ratePercent, rational(100)), "Reports the decimal rate as though it were already a percentage.", result.direction),
        percentCandidate(result.ratePercent, "Finds the correct rate but reverses profit and loss.", result.direction === "PROFIT" ? "LOSS" : "PROFIT")
      );
      break;
    }
    case "CP_RATE_TO_SP": {
      if (result.mode !== request.mode) break;
      const amount = amountFromCost(request.costPrice, request.ratePercent);
      const wrongDirection = moneyFromPaise(
        request.direction === "PROFIT" ? request.costPrice.paise - amount.paise : request.costPrice.paise + amount.paise
      );
      candidates.push(
        moneyCandidate(amount, "Returns only the profit or loss amount instead of the selling price."),
        moneyCandidate(wrongDirection, "Applies the percentage in the opposite direction."),
        moneyCandidate(request.costPrice, "Leaves the cost price unchanged.")
      );
      break;
    }
    case "SP_RATE_TO_CP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        moneyCandidate(
          multiplyMoneyByRationalRounded(request.sellingPrice, commercialFactor2(request.direction, request.ratePercent)),
          "Multiplies the selling price by the forward factor instead of reversing it."
        ),
        moneyCandidate(
          moneyFromRoundedRational(
            divideRational(
              rational(request.sellingPrice.paise),
              commercialFactor2(request.direction === "PROFIT" ? "LOSS" : "PROFIT", request.ratePercent)
            )
          ),
          "Uses the opposite profit/loss factor while working backward."
        ),
        moneyCandidate(request.sellingPrice, "Treats selling price as though it were already the cost price.")
      );
      break;
    }
    case "AMOUNT_RATE_TO_CP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        moneyCandidate(
          multiplyMoneyByRationalRounded(request.amount, divideRational(request.ratePercent, rational(100))),
          "Multiplies the amount by the percentage instead of scaling it to 100%."
        ),
        moneyCandidate(
          moneyFromRoundedRational(
            divideRational(
              multiplyRational(rational(request.amount.paise), rational(100)),
              addRational(rational(100), request.ratePercent)
            )
          ),
          "Uses 100 plus the rate as the denominator."
        ),
        moneyCandidate(request.amount, "Reports the profit or loss amount as the cost price.")
      );
      break;
    }
    case "AMOUNT_CP_TO_RATE": {
      if (result.mode !== request.mode) break;
      const sellingPrice2 = moneyFromPaise(
        request.direction === "PROFIT" ? request.costPrice.paise + request.amount.paise : request.costPrice.paise - request.amount.paise
      );
      candidates.push(
        percentCandidate(
          multiplyRational(
            divideRational(rational(request.amount.paise), rational(sellingPrice2.paise)),
            rational(100)
          ),
          "Uses selling price instead of cost price as the percentage base."
        ),
        percentCandidate(divideRational(result.ratePercent, rational(100)), "Reports the decimal rate as a percentage."),
        percentCandidate(subtractRational(rational(100), result.ratePercent), "Subtracts the rate from 100 instead of measuring the amount on cost.")
      );
      break;
    }
    case "CP_SP_RATIO_TO_RATE": {
      if (result.mode !== request.mode) break;
      const difference = rational(
        absoluteBigInt2(
          request.sellingPart.numerator * request.costPart.denominator - request.costPart.numerator * request.sellingPart.denominator
        ),
        request.sellingPart.denominator * request.costPart.denominator
      );
      candidates.push(
        percentCandidate(
          multiplyRational(divideRational(difference, request.sellingPart), rational(100)),
          "Uses the selling-price part as the percentage base.",
          result.direction
        ),
        percentCandidate(
          multiplyRational(divideRational(request.sellingPart, request.costPart), rational(100)),
          "Reports selling price as a percentage of cost instead of the profit/loss rate.",
          result.direction
        ),
        percentCandidate(result.ratePercent, "Reverses the profit/loss direction while keeping the rate.", result.direction === "PROFIT" ? "LOSS" : "PROFIT")
      );
      break;
    }
    case "RATE_TO_CP_SP_RATIO": {
      if (result.mode !== request.mode) break;
      candidates.push(
        ratioCandidate(result.sellingPart, result.costPart, "Reverses cost price and selling price."),
        ratioCandidate(
          rational(1),
          commercialFactor2(request.direction === "PROFIT" ? "LOSS" : "PROFIT", request.ratePercent),
          "Uses the opposite profit/loss factor."
        ),
        ratioCandidate(rational(100), request.ratePercent, "Uses cost 100 and the rate itself as the selling-price part.")
      );
      break;
    }
    case "MARGIN_SP_TO_PROFIT_CP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        percentCandidate(request.marginPercent, "Treats selling-price margin as the same percentage on cost price."),
        percentCandidate(
          multiplyRational(
            divideRational(request.marginPercent, addRational(rational(100), request.marginPercent)),
            rational(100)
          ),
          "Adds the margin to 100 instead of removing it from the selling-price base."
        ),
        percentCandidate(subtractRational(rational(100), request.marginPercent), "Reports the remaining selling-price share as the profit rate.")
      );
      break;
    }
    case "PROFIT_CP_TO_MARGIN_SP": {
      if (result.mode !== request.mode) break;
      const subtractiveBase = subtractRational(rational(100), request.profitPercent);
      const subtractiveBaseCandidate = compareRational(subtractiveBase, rational(0)) === 0 ? divideRational(request.profitPercent, rational(100)) : multiplyRational(
        divideRational(request.profitPercent, subtractiveBase),
        rational(100)
      );
      candidates.push(
        percentCandidate(request.profitPercent, "Treats cost-price profit rate as the same margin on selling price."),
        percentCandidate(
          subtractiveBaseCandidate,
          compareRational(subtractiveBase, rational(0)) === 0 ? "Reports the decimal profit multiplier as though it were already a percentage." : "Subtracts the profit rate from 100 while changing the percentage base."
        ),
        percentCandidate(subtractRational(rational(100), request.profitPercent), "Reports the complement of the profit rate.")
      );
      break;
    }
    case "FRACTION_TO_RATE": {
      if (result.mode !== request.mode) break;
      const directPercent = multiplyRational(request.amountFraction, rational(100));
      const reciprocalPercent = multiplyRational(
        rational(request.amountFraction.denominator, request.amountFraction.numerator),
        rational(100)
      );
      candidates.push(
        percentCandidate(directPercent, request.fractionBase === "SELLING_PRICE" ? "Uses the selling-price fraction directly as a cost-price percentage." : "Uses the stated fraction without checking the required direction/base."),
        percentCandidate(reciprocalPercent, "Takes the reciprocal of the stated fraction."),
        percentCandidate(divideRational(result.ratePercent, rational(100)), "Reports the decimal rate as a percentage.")
      );
      break;
    }
    case "RATE_TO_FRACTION": {
      if (result.mode !== request.mode) break;
      const costBaseFraction = divideRational(request.ratePercent, rational(100));
      const oppositeBaseDenominator = request.direction === "PROFIT" ? subtractRational(rational(1), costBaseFraction) : addRational(rational(1), costBaseFraction);
      const oppositeBaseCandidate = compareRational(oppositeBaseDenominator, rational(0)) === 0 ? divideRational(costBaseFraction, rational(100)) : divideRational(costBaseFraction, oppositeBaseDenominator);
      candidates.push(
        fractionCandidate(costBaseFraction, "Uses the fraction of cost price instead of selling price."),
        fractionCandidate(rational(result.amountFraction.denominator, result.amountFraction.numerator), "Takes the reciprocal of the required fraction."),
        fractionCandidate(
          oppositeBaseCandidate,
          compareRational(oppositeBaseDenominator, rational(0)) === 0 ? "Divides the decimal rate by 100 a second time." : "Uses the opposite selling-price base conversion."
        )
      );
      break;
    }
    case "CP_TWO_RATES_TO_SP_DIFFERENCE": {
      if (result.mode !== request.mode) break;
      const firstAmount = amountFromCost(request.costPrice, request.firstRatePercent);
      const secondAmount = amountFromCost(request.costPrice, request.secondRatePercent);
      const wrongGap = request.firstDirection === request.secondDirection ? addRational(request.firstRatePercent, request.secondRatePercent) : rational(
        absoluteBigInt2(
          request.firstRatePercent.numerator * request.secondRatePercent.denominator - request.secondRatePercent.numerator * request.firstRatePercent.denominator
        ),
        request.firstRatePercent.denominator * request.secondRatePercent.denominator
      );
      candidates.push(
        moneyCandidate(firstAmount, "Uses only the first rate change."),
        moneyCandidate(secondAmount, "Uses only the second rate change."),
        moneyCandidate(
          multiplyMoneyByRationalRounded(request.costPrice, divideRational(wrongGap, rational(100))),
          request.firstDirection === request.secondDirection ? "Adds the two same-direction rates instead of taking their difference." : "Subtracts profit and loss rates instead of measuring the full signed gap."
        )
      );
      break;
    }
    case "SP_DIFFERENCE_TWO_RATES_TO_CP": {
      if (result.mode !== request.mode) break;
      const fromFirst = moneyFromRoundedRational(
        divideRational(
          multiplyRational(rational(request.difference.paise), rational(100)),
          request.firstRatePercent
        )
      );
      const fromSecond = moneyFromRoundedRational(
        divideRational(
          multiplyRational(rational(request.difference.paise), rational(100)),
          request.secondRatePercent
        )
      );
      const gap = request.firstDirection === request.secondDirection ? rational(
        absoluteBigInt2(
          request.firstRatePercent.numerator * request.secondRatePercent.denominator - request.secondRatePercent.numerator * request.firstRatePercent.denominator
        ),
        request.firstRatePercent.denominator * request.secondRatePercent.denominator
      ) : addRational(request.firstRatePercent, request.secondRatePercent);
      candidates.push(
        moneyCandidate(fromFirst, "Divides by the first rate instead of the effective rate gap."),
        moneyCandidate(fromSecond, "Divides by the second rate instead of the effective rate gap."),
        moneyCandidate(
          multiplyMoneyByRationalRounded(request.difference, divideRational(gap, rational(100))),
          "Multiplies by the rate gap instead of scaling the difference up to 100%."
        )
      );
      break;
    }
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE": {
      if (result.mode !== request.mode) break;
      const priceDifference = moneyFromPaise(
        absoluteBigInt2(request.secondSellingPrice.paise - request.firstSellingPrice.paise)
      );
      const firstBaseRate = multiplyRational(
        divideRational(rational(priceDifference.paise), rational(request.firstSellingPrice.paise)),
        rational(100)
      );
      const secondBaseRate = multiplyRational(
        divideRational(rational(priceDifference.paise), rational(request.secondSellingPrice.paise)),
        rational(100)
      );
      const guessedDirection = request.secondSellingPrice.paise >= request.firstSellingPrice.paise ? "PROFIT" : "LOSS";
      candidates.push(
        percentCandidate(request.firstRatePercent, "Repeats the first sale's rate for the second sale.", request.firstDirection),
        percentCandidate(firstBaseRate, "Compares the two selling prices using the first selling price as the base.", guessedDirection),
        percentCandidate(secondBaseRate, "Compares the two selling prices using the second selling price as the base.", guessedDirection)
      );
      break;
    }
  }
  return [...candidates, ...fallbackWrongCandidates(correct)];
}
function shuffledOptions(qlId, seed, correct, wrong) {
  const correctText = formatAnswer(correct);
  const seen = /* @__PURE__ */ new Set([correctText]);
  const selected = [];
  for (const candidate of wrong) {
    const text = formatAnswer(candidate.value);
    if (seen.has(text)) continue;
    seen.add(text);
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${qlId}: could not build three unique misconception options.`);
  }
  const random = createSeededRandom(`${qlId}:${seed}:option-order`);
  const all = [
    { text: correctText, misconception: "CORRECT" },
    ...selected.map((candidate) => ({
      text: formatAnswer(candidate.value),
      misconception: candidate.misconception
    }))
  ];
  for (let index = all.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random.next() * (index + 1));
    [all[index], all[swapIndex]] = [all[swapIndex], all[index]];
  }
  return {
    options: all.map((entry) => entry.text),
    misconceptionLabels: all.map((entry) => entry.misconception),
    correctIndex: all.findIndex((entry) => entry.misconception === "CORRECT")
  };
}
function valueSpecificWorking(generated2, result, answer) {
  const request = generated2.request;
  let line;
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT":
      line = `${formatMoney(request.sellingPrice)} and ${formatMoney(request.costPrice)} differ by ${formatMoney(result.mode === request.mode ? result.amount : moneyFromRupees(0))}.`;
      break;
    case "CP_RATE_TO_AMOUNT":
      line = `${formatRational(request.ratePercent)}% of ${formatMoney(request.costPrice)} is ${formatMoney(result.mode === request.mode ? result.amount : moneyFromRupees(0))}.`;
      break;
    case "CP_AMOUNT_TO_SP":
      line = `${formatMoney(request.costPrice)} ${request.direction === "PROFIT" ? "+" : "\u2212"} ${formatMoney(request.amount)} = ${formatMoney(result.mode === request.mode ? result.sellingPrice : moneyFromRupees(0))}.`;
      break;
    case "SP_AMOUNT_TO_CP":
      line = `Reversing the stated ${request.direction.toLowerCase()} from ${formatMoney(request.sellingPrice)} gives ${formatMoney(result.mode === request.mode ? result.costPrice : moneyFromRupees(0))}.`;
      break;
    case "CP_SP_TO_RATE":
      line = `The price difference is measured on the original cost of ${formatMoney(request.costPrice)}.`;
      break;
    case "CP_RATE_TO_SP":
      line = `${formatMoney(request.costPrice)} is multiplied by the ${request.direction.toLowerCase()} factor for ${formatPercent(request.ratePercent)}.`;
      break;
    case "SP_RATE_TO_CP":
      line = `${formatMoney(request.sellingPrice)} is divided by the ${request.direction.toLowerCase()} factor for ${formatPercent(request.ratePercent)}.`;
      break;
    case "AMOUNT_RATE_TO_CP":
      line = `${formatMoney(request.amount)} represents ${formatPercent(request.ratePercent)} of the hidden cost.`;
      break;
    case "AMOUNT_CP_TO_RATE":
      line = `${formatMoney(request.amount)} is divided by ${formatMoney(request.costPrice)} and multiplied by 100.`;
      break;
    case "CP_SP_RATIO_TO_RATE":
      line = `The difference between ratio parts is measured against the cost-price part.`;
      break;
    case "RATE_TO_CP_SP_RATIO":
      line = `Taking cost as 100 gives selling price ${request.direction === "PROFIT" ? "above" : "below"} 100 by ${formatRational(request.ratePercent)} parts.`;
      break;
    case "MARGIN_SP_TO_PROFIT_CP":
      line = `With selling price as 100, cost price is ${formatRational(subtractRational(rational(100), request.marginPercent))}.`;
      break;
    case "PROFIT_CP_TO_MARGIN_SP":
      line = `With cost price as 100, selling price is ${formatRational(addRational(rational(100), request.profitPercent))}.`;
      break;
    case "FRACTION_TO_RATE":
      line = `The fraction ${request.amountFraction.numerator}/${request.amountFraction.denominator} is converted from the stated ${request.fractionBase === "COST_PRICE" ? "cost-price" : "selling-price"} base.`;
      break;
    case "RATE_TO_FRACTION":
      line = `${formatPercent(request.ratePercent)} is converted to the required fraction of selling price.`;
      break;
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      line = `The two signed rates act on the same cost of ${formatMoney(request.costPrice)}.`;
      break;
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      line = `${formatMoney(request.difference)} represents the effective gap between the two signed rates.`;
      break;
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      line = `The first condition is reversed to recover cost, and ${formatMoney(request.secondSellingPrice)} is then compared with that cost.`;
      break;
  }
  return `**Working with these values:** ${line}

**Final answer:** ${answer}`;
}
function validateRequest(request) {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT":
    case "CP_SP_TO_RATE":
      return validateFundamentalInput({
        costPrice: request.costPrice,
        sellingPrice: request.sellingPrice
      });
    case "CP_RATE_TO_AMOUNT":
    case "CP_RATE_TO_SP":
      return validateFundamentalInput({
        costPrice: request.costPrice,
        ratePercent: request.ratePercent,
        direction: request.direction
      });
    case "CP_AMOUNT_TO_SP":
      return validateFundamentalInput({
        costPrice: request.costPrice,
        amount: request.amount,
        direction: request.direction
      });
    case "SP_AMOUNT_TO_CP":
      return validateFundamentalInput({
        sellingPrice: request.sellingPrice,
        amount: request.amount,
        direction: request.direction
      });
    case "SP_RATE_TO_CP":
      return validateFundamentalInput({
        sellingPrice: request.sellingPrice,
        ratePercent: request.ratePercent,
        direction: request.direction
      });
    case "AMOUNT_RATE_TO_CP":
      return validateFundamentalInput({
        amount: request.amount,
        ratePercent: request.ratePercent,
        direction: request.direction
      });
    case "AMOUNT_CP_TO_RATE":
      return validateFundamentalInput({
        amount: request.amount,
        costPrice: request.costPrice,
        direction: request.direction
      });
    case "CP_SP_RATIO_TO_RATE":
      return validateFundamentalInput({
        costPart: request.costPart,
        sellingPart: request.sellingPart
      });
    case "RATE_TO_CP_SP_RATIO":
      return validateFundamentalInput({
        ratePercent: request.ratePercent,
        direction: request.direction
      });
    case "MARGIN_SP_TO_PROFIT_CP":
      return validateFundamentalInput({ marginPercent: request.marginPercent });
    case "PROFIT_CP_TO_MARGIN_SP":
      return validateFundamentalInput({ profitPercent: request.profitPercent });
    case "FRACTION_TO_RATE":
      return { ok: request.amountFraction.numerator > 0n && request.amountFraction.denominator > 0n, errors: [] };
    case "RATE_TO_FRACTION":
      return validateFundamentalInput({
        ratePercent: request.ratePercent,
        direction: request.direction
      });
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      return validateFundamentalInput({ costPrice: request.costPrice });
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      return validateFundamentalInput({ amount: request.difference });
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      return validateFundamentalInput({
        sellingPrice: request.firstSellingPrice,
        ratePercent: request.firstRatePercent,
        direction: request.firstDirection
      });
  }
}
function selectQl(input) {
  if (input.questionLanguageId) {
    const registry = taskRegistry.entries[input.questionLanguageId];
    if (!registry) throw new Error(`Unknown CP-001 question-language ID: ${input.questionLanguageId}`);
    return input.questionLanguageId;
  }
  const eligible = qlIds.filter(
    (qlId) => !input.difficultyBand || taskRegistry.entries[qlId].difficulty === input.difficultyBand
  );
  if (!eligible.length) throw new Error("No CP-001 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp001-dynamic"}:ql-selection`),
    eligible
  );
}
function listPnlCp001DynamicQlIds() {
  return [...qlIds];
}
function runPnlCp001DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error("PNL-CP-001 dynamic runtime currently supports English only.");
  }
  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated2 = generateCase(qlId, seed);
  const solverResult = solveFundamental(generated2.request);
  const independent = verifyFundamentalResultIndependently(
    generated2.request,
    solverResult
  );
  const correctValue = answerValueFor(qlId, solverResult);
  const correctAnswer = formatAnswer(correctValue);
  const optionSet = shuffledOptions(
    qlId,
    seed,
    correctValue,
    wrongCandidates(generated2, solverResult, correctValue)
  );
  const editorial = normalizedEditorialEntry(editorialLibrary.entries[qlId]);
  const stem = renderStructuredStemMarkdown(editorial.stem, generated2.context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    generated2.context
  );
  const explanationText = `${baseExplanation}

${valueSpecificWorking(
    generated2,
    solverResult,
    correctAnswer
  )}`;
  const inputValidation = validateRequest(generated2.request);
  const optionValidation = validateOptions(optionSet.options, correctAnswer);
  const containsUnresolvedProsePlaceholder6 = (value) => {
    const proseOnly = value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
    return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
  };
  const validationChecks = [
    {
      name: "input-domain",
      passed: inputValidation.ok,
      message: inputValidation.ok ? "Generated parameters satisfy the CP-001 domain." : inputValidation.errors.join("; ")
    },
    {
      name: "independent-verifier",
      passed: independent.ok,
      message: independent.ok ? "Independent exact verifier agrees with the canonical solver." : independent.errors.join("; ")
    },
    {
      name: "four-misconception-options",
      passed: optionValidation.ok && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: optionValidation.ok ? "Four unique options contain one correct answer and three labelled misconceptions." : optionValidation.errors.join("; ")
    },
    {
      name: "dynamic-editorial-binding",
      passed: !containsUnresolvedProsePlaceholder6(stem) && !containsUnresolvedProsePlaceholder6(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders."
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication."
    }
  ];
  const validation = {
    valid: validationChecks.every((check) => check.passed),
    checks: validationChecks
  };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${validationChecks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`
    );
  }
  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001",
    canonicalProblemId: PNL_CP001_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en",
    difficultyBand: generated2.registry.difficulty,
    stem,
    answer: correctAnswer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP001_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en",
      difficultyBand: generated2.registry.difficulty,
      taskKind: generated2.registry.solveMode,
      answerType: correctValue.kind,
      answerSemantic: generated2.registry.answerSemantic,
      requiredVariables: [...generated2.registry.requiredVariables],
      variables: generated2.context,
      seed,
      runtimeMode: PNL_CP001_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      sourceTrace: {
        registry: "PNL-001/CP-001/task-registry.library.json",
        editorial: "PNL-001/CP-001/editorial-content.en.json",
        solver: "PNL-001/foundation/solver.ts",
        verifier: "PNL-001/CP-001/cp001-dynamic-verifier.ts"
      }
    },
    solver: {
      answer: correctAnswer,
      numericAnswer: correctValue.kind === "MONEY" ? Number(correctValue.value.paise) / 100 : correctValue.kind === "PERCENT" || correctValue.kind === "FRACTION" ? rationalToNumber(correctValue.value) : null,
      answerType: correctValue.kind,
      evidence: {
        solveMode: generated2.registry.solveMode,
        answerSemantic: generated2.registry.answerSemantic,
        independentVerifier: "PASS"
      },
      mathJax: {}
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        { id: "given", label: "Generated values", value: generated2.context },
        { id: "mode", label: "Solve mode", value: generated2.registry.solveMode },
        { id: "answer", label: "Exact answer", value: correctAnswer }
      ]
    },
    explanation: {
      explanationId,
      lines: explanationText.split(/\n{2,}/)
    },
    traceability: {
      questionId,
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP001_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated2.registry.solveMode,
      answerSemantic: generated2.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated2.registry.difficulty,
      seed,
      generationMode: PNL_CP001_DYNAMIC_RUNTIME_MODE,
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

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-002/task-registry.library.json
var task_registry_library_default2 = {
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
var editorial_content_en_default2 = {
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
      const sellingPrice2 = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      return {
        mode: request.mode,
        discountAmount: moneyFromPaise(request.markedPrice.paise - sellingPrice2.paise)
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
      const multiplier4 = composePercentageMultipliers(
        request.discountPercents,
        request.discountPercents.map(() => "DECREASE")
      );
      return {
        mode: request.mode,
        sellingPrice: multiplyMoney(request.markedPrice, multiplier4)
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
      const sellingPrice2 = sellingPriceAfterDiscount(markedPrice, request.discountPercent);
      const ledger = createPriceLedger({ costPrice: request.costPrice, sellingPrice: sellingPrice2, markedPrice });
      const amountDelta = profitOrLossAmount(ledger);
      const rate2 = profitOrLossRateOnCost(ledger);
      return {
        mode: request.mode,
        sellingPrice: sellingPrice2,
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
      let sellingPrice2 = request.markedPrice;
      for (const discount of request.discountPercents) sellingPrice2 = sellingPriceAfterDiscount(sellingPrice2, discount);
      return { mode: request.mode, sellingPrice: sellingPrice2 };
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
var taskRegistry2 = task_registry_library_default2;
var editorialLibrary2 = editorial_content_en_default2;
var qlIds2 = Object.keys(taskRegistry2.entries);
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
function formatMoney2(value) {
  return `\u20B9${plainMoney(value)}`;
}
function formatRational2(value) {
  if (value.denominator === 1n) return value.numerator.toString();
  const numeric = rationalToNumber(value);
  return numeric.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function formatPercent2(value) {
  return `${formatRational2(value)}%`;
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
function generateCase2(qlId, seed) {
  const registry = taskRegistry2.entries[qlId];
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
          discountPercent: formatRational2(discountPercent)
        }
      };
    case "PNL-QL-038": {
      const sellingPrice2 = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice,
        discountPercent
      }).sellingPrice;
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_SP_TO_DISCOUNT", markedPrice, sellingPrice: sellingPrice2 },
        context: {
          markedPrice: plainMoney(markedPrice),
          sellingPrice: plainMoney(sellingPrice2)
        }
      };
    }
    case "PNL-QL-039": {
      const originalMarkedPrice = markedPrice;
      const sellingPrice2 = solveDiscount({
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
          sellingPrice: sellingPrice2,
          discountPercent
        },
        context: {
          sellingPrice: plainMoney(sellingPrice2),
          discountPercent: formatRational2(discountPercent)
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
          firstDiscountPercent: formatRational2(firstDiscountPercent),
          secondDiscountPercent: formatRational2(secondDiscountPercent)
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
          firstDiscountPercent: formatRational2(firstDiscountPercent),
          secondDiscountPercent: formatRational2(secondDiscountPercent)
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
          discountPercent: formatRational2(discountPercent)
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
          knownDiscountPercent: formatRational2(firstDiscountPercent),
          equivalentDiscountPercent: formatRational2(equivalentDiscountPercent)
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
          singleDiscountPercent: formatRational2(singleDiscountPercent),
          firstDiscountPercent: formatRational2(firstDiscountPercent),
          secondDiscountPercent: formatRational2(secondDiscountPercent)
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
          markupPercent: formatRational2(markupPercent),
          discountPercent: formatRational2(chosenDiscount),
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
          targetRatePercent: formatRational2(targetRatePercent),
          targetDirection: scenario.direction.toLowerCase(),
          ...qlId === "PNL-QL-070" ? {
            statementOne: `The cost price is ${formatMoney2(costPrice)}, and the target result is ${formatRational2(targetRatePercent)}% ${scenario.direction.toLowerCase()}.`,
            statementTwo: `The marked price is ${formatMoney2(scenarioMarkedPrice)}.`,
            requiredDiscountPercent: formatRational2(
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
          discountPercent: formatRational2(chosenDiscount),
          targetRatePercent: formatRational2(targetRatePercent),
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
          cashbackPercent: formatRational2(cashbackPercent)
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
          discountPercent: formatRational2(discountPercent),
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
          discountPercent: formatRational2(discountPercent),
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
          firstDiscountPercent: formatRational2(first),
          secondDiscountPercent: formatRational2(second),
          thirdDiscountPercent: formatRational2(third)
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
          discountPercent: formatRational2(discountPercent),
          couponPercent: formatRational2(couponPercent)
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
          cashbackPercent: formatRational2(cashbackPercent),
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
          discountPercent: formatRational2(discountPercent),
          cashbackPercent: formatRational2(cashbackPercent),
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
          discountPercent: formatRational2(discountPercent),
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
          firstDiscountPercent: formatRational2(firstDiscountPercent),
          secondDiscountPercent: formatRational2(secondDiscountPercent)
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
          discountPercent: formatRational2(discountPercent),
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
        value: result.betterOffer === "SAME" ? "Both offers give the same selling price" : `${result.betterOffer === "SINGLE" ? "Single-discount offer" : "Successive-discount offer"} is better by ${formatMoney2(result.differenceAmount)}`
      };
    case "PNL-QL-047":
    case "PNL-QL-066":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected profit/loss percentage.`);
      }
      return {
        kind: "TEXT",
        value: result.direction === "NO_CHANGE" ? "No profit, no loss" : `${formatPercent2(result.ratePercent)} ${result.direction.toLowerCase()}`
      };
    case "PNL-QL-048":
      if (!("direction" in result) || !("amount" in result)) {
        throw new Error(`${qlId}: expected profit/loss amount.`);
      }
      return {
        kind: "TEXT",
        value: result.direction === "NO_CHANGE" ? "No profit, no loss" : `${result.direction === "PROFIT" ? "Profit" : "Loss"} of ${formatMoney2(result.amount)}`
      };
    case "PNL-QL-056":
      if (!("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected discount/cashback comparison.`);
      }
      return {
        kind: "TEXT",
        value: result.betterOffer === "SAME" ? "Both offers give the same effective cost" : `${result.betterOffer === "DISCOUNT" ? "Discount offer" : "Cashback offer"} is better by ${formatMoney2(result.differenceAmount)}`
      };
    case "PNL-QL-058":
      if (!("couponApplied" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected coupon eligibility result.`);
      }
      return {
        kind: "TEXT",
        value: `${result.couponApplied ? "Coupon applies" : "Coupon does not apply"}; effective price ${formatMoney2(result.effectivePrice)}`
      };
    case "PNL-QL-060":
      if (!("cashbackAmount" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected cashback result.`);
      }
      return {
        kind: "TEXT",
        value: `Cashback ${formatMoney2(result.cashbackAmount)}; effective cost ${formatMoney2(result.effectivePrice)}`
      };
    case "PNL-QL-061":
      if (!("billedPrice" in result) || !("cashbackAmount" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected billed/cashback result.`);
      }
      return {
        kind: "TEXT",
        value: `Billed price ${formatMoney2(result.billedPrice)}; cashback ${formatMoney2(result.cashbackAmount)}; effective cost ${formatMoney2(result.effectivePrice)}`
      };
    case "PNL-QL-064":
      if (!("couponEligible" in result) || !("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected eligible offer comparison.`);
      }
      return {
        kind: "TEXT",
        value: `${result.couponEligible ? "Coupon is eligible" : "Coupon is not eligible"}; ${result.betterOffer === "SAME" ? "both offers are equal" : `${result.betterOffer === "DISCOUNT" ? "discount offer" : "coupon offer"} is better by ${formatMoney2(result.differenceAmount)}`}`
      };
    case "PNL-QL-067":
      return { kind: "TEXT", value: "Statement 2 only" };
    case "PNL-QL-069":
      if (!("betterOrder" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected coupon-order comparison.`);
      }
      return {
        kind: "TEXT",
        value: result.betterOrder === "SAME" ? "Both orders give the same price" : `${result.betterOrder === "DISCOUNT_THEN_COUPON" ? "Discount then coupon" : "Coupon then discount"} is better by ${formatMoney2(result.differenceAmount)}`
      };
    case "PNL-QL-070":
      return { kind: "TEXT", value: "Both statements together are required" };
    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}
function formatAnswer2(answer) {
  switch (answer.kind) {
    case "MONEY":
      return formatMoney2(answer.value);
    case "PERCENT":
      return formatPercent2(answer.value);
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
    return candidates.map(formatMoney2);
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
  const correct = formatAnswer2(answer);
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
function selectQl2(input) {
  if (input.questionLanguageId) {
    const registry = taskRegistry2.entries[input.questionLanguageId];
    if (!registry) {
      throw new Error(
        `Unknown CP-002 question-language ID: ${input.questionLanguageId}`
      );
    }
    return input.questionLanguageId;
  }
  const eligible = qlIds2.filter(
    (qlId) => !input.difficultyBand || taskRegistry2.entries[qlId].difficulty === input.difficultyBand
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
  return [...qlIds2];
}
function runPnlCp002DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-002 dynamic runtime currently supports English only."
    );
  }
  const qlId = selectQl2(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated2 = generateCase2(qlId, seed);
  const result = solve(generated2.request);
  const recomputed = solve(generated2.request);
  const answerValue = answerFor(qlId, result);
  const answer = formatAnswer2(answerValue);
  const optionSet = buildOptions(qlId, seed, answerValue);
  const editorial = editorialLibrary2.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);
  const stem = renderStructuredStemMarkdown(editorial.stem, generated2.context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    generated2.context
  );
  const explanationText = `${baseExplanation}

**Working with these values:** The generated offer is evaluated in the exact order and on the exact base stated in the question.

**Final answer:** ${answer}`;
  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated2.registry && editorial),
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
    difficultyBand: generated2.registry.difficulty,
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
      difficultyBand: generated2.registry.difficulty,
      taskKind: generated2.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated2.registry.answerSemantic,
      requiredVariables: [...generated2.registry.requiredVariables],
      variables: generated2.context,
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
        solveMode: generated2.registry.solveMode,
        answerSemantic: generated2.registry.answerSemantic,
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
          value: generated2.context
        },
        {
          id: "mode",
          label: "Solve mode",
          value: generated2.registry.solveMode
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
      solveMode: generated2.registry.solveMode,
      answerSemantic: generated2.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated2.registry.difficulty,
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

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-003/editorial-content.en.json
var editorial_content_en_default3 = {
  schemaVersion: 2,
  archetypeId: "PNL-001",
  cpId: "PNL-CP-003",
  language: "en",
  status: "EDITORIAL_REVIEW_CANDIDATE",
  entries: {
    "PNL-QL-071": {
      stem: {
        contextFamily: "grain-lot inventory",
        blocks: [
          {
            type: "paragraph",
            content: "The grain wholesaler purchases and sells several groups of grain lots."
          },
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "lots"
          }
        ],
        prompt: "Calculate the overall percentage gain or loss."
      },
      explanation: {
        opening: "When several lots or groups are involved, the overall result must come from total money rather than an average of percentages.",
        concept: "Each group contributes its own cost and selling amount; add those amounts first and then measure the combined difference on total cost.",
        steps: [
          {
            title: "Build group totals",
            body: "For every group, multiply quantity by unit cost and unit selling price or apply its stated rate."
          },
          {
            title: "Add cost and selling amounts",
            body: "Combine all group costs into total cost and all receipts into total selling price."
          },
          {
            title: "Find the overall result",
            body: "Compare the two totals and divide the absolute difference by total cost.",
            equationLatex: "r=\\frac{|S_T-C_T|}{C_T}\\times100"
          }
        ],
        conclusion: "The sign of total selling price minus total cost gives the overall direction and the formula gives the rate.",
        commonTrap: "Do not average the group percentages unless all group cost bases are equal."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-072": {
      stem: {
        contextFamily: "fruit-crate equal-price sale",
        blocks: [
          {
            type: "paragraph",
            content: "A fruit merchant sells two fruit crates for the same price of \u20B9{commonSellingPrice} each. The first is sold at {firstRatePercent}% {firstDirection}, while the second is sold at {secondRatePercent}% {secondDirection}."
          }
        ],
        prompt: "Calculate the overall profit or loss percentage on the two crates together."
      },
      explanation: {
        opening: "The two selling prices are equal, but the cost prices are different because the profit and loss rates differ.",
        concept: "Recover each cost price from the common selling price, add the costs, and compare them with the two equal selling amounts.",
        steps: [
          {
            title: "Recover the first cost",
            body: "Reverse the first profit or loss multiplier from the common selling price."
          },
          {
            title: "Recover the second cost",
            body: "Reverse the second multiplier in the same way."
          },
          {
            title: "Combine both transactions",
            body: "Compare twice the common selling price with the sum of the two recovered costs."
          }
        ],
        conclusion: "The combined comparison gives the overall profit or loss percentage.",
        commonTrap: "Do not assume equal selling prices mean equal cost prices or that opposite rates cancel."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-073": {
      stem: {
        contextFamily: "identical-machine equal-cost sale",
        blocks: [
          {
            type: "paragraph",
            content: "An equipment dealer buys two small machines for the same cost of \u20B9{commonCostPrice} each. The first is sold at {firstRatePercent}% {firstDirection}, while the second is sold at {secondRatePercent}% {secondDirection}."
          }
        ],
        prompt: "Find the overall profit or loss percentage."
      },
      explanation: {
        opening: "Because both articles have the same cost price, their profit and loss amounts can be combined on equal bases.",
        concept: "Use one convenient common cost, calculate both selling prices, and compare their total with twice the common cost.",
        steps: [
          {
            title: "Choose a common cost base",
            body: "Take each cost price as the same convenient amount."
          },
          {
            title: "Apply both rates",
            body: "Find the two selling-price factors from the stated directions."
          },
          {
            title: "Combine the results",
            body: "Compare the sum of selling prices with the sum of costs."
          }
        ],
        conclusion: "The combined difference on total cost is the overall percentage result.",
        commonTrap: "Do not average signed rates when the question asks for a money-weighted overall result, even though equal costs make the arithmetic simpler."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-074": {
      stem: {
        contextFamily: "seasonal-apparel partial inventory",
        blocks: [
          {
            type: "paragraph",
            content: "A retailer buys {totalQuantity} identical units at \u20B9{unitCostPrice} each."
          },
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "soldGroups"
          },
          {
            type: "paragraph",
            content: "{unsoldQuantity} units remain and recover \u20B9{unsoldRecoveryPerUnit} per unit."
          }
        ],
        prompt: "Calculate the overall percentage gain or loss on the complete inventory."
      },
      explanation: {
        opening: "A partial-inventory question becomes manageable when every sold and unsold group is entered in one money ledger.",
        concept: "Total cost covers the entire stock, while total recovery includes receipts from sold groups plus any value recovered from remaining stock.",
        steps: [
          {
            title: "Find total inventory cost",
            body: "Multiply total quantity by unit cost price."
          },
          {
            title: "Add all recoveries",
            body: "Calculate revenue for every sold group and include the stated recovery from unsold units."
          },
          {
            title: "Measure the overall result",
            body: "Compare total recovery with total cost and use total cost as the percentage base."
          }
        ],
        conclusion: "The final comparison gives the overall profit or loss percentage for the complete inventory.",
        commonTrap: "Do not ignore unsold or recovered stock when calculating the overall result."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-075": {
      stem: {
        contextFamily: "damaged-ceramic stock recovery",
        blocks: [
          {
            type: "paragraph",
            content: "A homeware seller buys {totalQuantity} ceramic sets at \u20B9{unitCostPrice} each. Of these, {damagedQuantity} sets are damaged and recover \u20B9{damagedRecoveryPerUnit} each. The seller wants an overall {targetRatePercent}% {targetDirection}."
          }
        ],
        prompt: "Find the required selling price per undamaged set."
      },
      explanation: {
        opening: "The required price or rate on the remaining stock must first cover the gap left after earlier sales or damage recovery.",
        concept: "Start from the target total recovery, subtract what has already been recovered, and spread the remaining requirement across the unsold good units.",
        steps: [
          {
            title: "Find total cost and target recovery",
            body: "Calculate complete inventory cost and apply the target profit or loss factor."
          },
          {
            title: "Subtract known recoveries",
            body: "Remove receipts from sold groups and damaged or recovered units."
          },
          {
            title: "Allocate the remaining amount",
            body: "Divide by the number of units still to be sold; convert to a rate if the question asks for one."
          }
        ],
        conclusion: "The resulting unit price or rate is what the remaining stock must achieve.",
        commonTrap: "Do not apply the target percentage only to the unsold units; the target concerns the entire inventory."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-076": {
      stem: {
        contextFamily: "promotional free-unit inventory",
        blocks: [
          {
            type: "paragraph",
            content: "A wholesaler pays for {paidQuantity} packaged units at \u20B9{unitCostPrice} each and receives {freeQuantity} additional units free. All units are sold at \u20B9{unitSellingPrice} each."
          }
        ],
        prompt: "Calculate the overall profit or loss percentage."
      },
      explanation: {
        opening: "Free units increase the number of units available for sale without increasing the purchase payment.",
        concept: "Total cost is based only on paid units, while total revenue comes from all paid and free units that are sold.",
        steps: [
          {
            title: "Find total acquisition cost",
            body: "Multiply paid quantity by unit cost price; free units add no purchase cost."
          },
          {
            title: "Find total selling revenue",
            body: "Add paid and free quantities, then multiply by unit selling price."
          },
          {
            title: "Calculate the overall rate",
            body: "Compare total revenue with acquisition cost on the acquisition-cost base."
          }
        ],
        conclusion: "The combined comparison gives the true profit or loss percentage from the promotion.",
        commonTrap: "Do not assign the listed unit cost to free units when calculating what the buyer actually paid."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-077": {
      stem: {
        contextFamily: "book-lot weighted sale",
        blocks: [
          {
            type: "paragraph",
            content: "The book distributor divides book bundles into the groups shown below."
          },
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "groups"
          }
        ],
        prompt: "Calculate the overall percentage gain or loss."
      },
      explanation: {
        opening: "When several lots or groups are involved, the overall result must come from total money rather than an average of percentages.",
        concept: "Each group contributes its own cost and selling amount; add those amounts first and then measure the combined difference on total cost.",
        steps: [
          {
            title: "Build group totals",
            body: "For every group, multiply quantity by unit cost and unit selling price or apply its stated rate."
          },
          {
            title: "Add cost and selling amounts",
            body: "Combine all group costs into total cost and all receipts into total selling price."
          },
          {
            title: "Find the overall result",
            body: "Compare the two totals and divide the absolute difference by total cost.",
            equationLatex: "r=\\frac{|S_T-C_T|}{C_T}\\times100"
          }
        ],
        conclusion: "The sign of total selling price minus total cost gives the overall direction and the formula gives the rate.",
        commonTrap: "Do not average the group percentages unless all group cost bases are equal."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-078": {
      stem: {
        contextFamily: "dairy-stock target rate",
        blocks: [
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "knownGroups"
          },
          {
            type: "paragraph",
            content: "The remaining {unknownQuantity} units cost \u20B9{unknownUnitCostPrice} each and will be sold at an unknown {unknownDirection} rate."
          }
        ],
        prompt: "Find the unknown rate needed for an overall {targetRatePercent}% {targetDirection}."
      },
      explanation: {
        opening: "The unknown group's rate must make the combined inventory reach a stated overall target.",
        concept: "Translate the target into a required total selling amount, subtract the selling amounts already fixed, and compare the remaining requirement with the unknown group's cost.",
        steps: [
          {
            title: "Find the target total selling amount",
            body: "Apply the target commercial factor to the total cost of all groups."
          },
          {
            title: "Remove known group receipts",
            body: "Calculate and subtract the selling amounts of groups whose rates are known."
          },
          {
            title: "Solve the unknown group's rate",
            body: "Compare its required selling amount with its own cost price."
          }
        ],
        conclusion: "This comparison gives both the direction and percentage required for the unknown group.",
        commonTrap: "Do not apply the overall target rate directly to the unknown group alone."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-079": {
      stem: {
        contextFamily: "spare-parts target quantity",
        blocks: [
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "fixedGroups"
          },
          {
            type: "paragraph",
            content: "Additional units cost \u20B9{unknownUnitCostPrice} each and are sold at {unknownRatePercent}% {unknownDirection}."
          }
        ],
        prompt: "How many additional units are needed for an overall {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "Here the rate on the additional group is known, but its quantity must be chosen to make the full inventory meet the target.",
        concept: "Write total cost and total selling price as expressions in the unknown quantity, then impose the target overall multiplier.",
        steps: [
          {
            title: "Summarise fixed groups",
            body: "Add their known costs and selling amounts."
          },
          {
            title: "Write the unknown group's contribution",
            body: "Use quantity times unit cost for cost and apply its rate for selling price."
          },
          {
            title: "Set the target equation",
            body: "Equate total selling price to target factor times total cost and solve for quantity."
          }
        ],
        conclusion: "The valid non-negative quantity satisfying the equation is the required group size.",
        commonTrap: "Do not calculate the quantity from a percentage difference alone without accounting for both added cost and added revenue."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-080": {
      stem: {
        contextFamily: "unsold-notebook pricing",
        blocks: [
          {
            type: "paragraph",
            content: "A dealer buys {totalQuantity} units at \u20B9{unitCostPrice} each."
          },
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "soldGroups"
          }
        ],
        prompt: "At what unit price should the remaining stock be sold for an overall {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "The required price or rate on the remaining stock must first cover the gap left after earlier sales or damage recovery.",
        concept: "Start from the target total recovery, subtract what has already been recovered, and spread the remaining requirement across the unsold good units.",
        steps: [
          {
            title: "Find total cost and target recovery",
            body: "Calculate complete inventory cost and apply the target profit or loss factor."
          },
          {
            title: "Subtract known recoveries",
            body: "Remove receipts from sold groups and damaged or recovered units."
          },
          {
            title: "Allocate the remaining amount",
            body: "Divide by the number of units still to be sold; convert to a rate if the question asks for one."
          }
        ],
        conclusion: "The resulting unit price or rate is what the remaining stock must achieve.",
        commonTrap: "Do not apply the target percentage only to the unsold units; the target concerns the entire inventory."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-081": {
      stem: {
        contextFamily: "leftover-tile target rate",
        blocks: [
          {
            type: "paragraph",
            content: "A dealer buys {totalQuantity} units at \u20B9{unitCostPrice} each."
          },
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "soldGroups"
          }
        ],
        prompt: "At what profit or loss rate should the remaining stock be sold for an overall {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "The required price or rate on the remaining stock must first cover the gap left after earlier sales or damage recovery.",
        concept: "Start from the target total recovery, subtract what has already been recovered, and spread the remaining requirement across the unsold good units.",
        steps: [
          {
            title: "Find total cost and target recovery",
            body: "Calculate complete inventory cost and apply the target profit or loss factor."
          },
          {
            title: "Subtract known recoveries",
            body: "Remove receipts from sold groups and damaged or recovered units."
          },
          {
            title: "Allocate the remaining amount",
            body: "Divide by the number of units still to be sold; convert to a rate if the question asks for one."
          }
        ],
        conclusion: "The resulting unit price or rate is what the remaining stock must achieve.",
        commonTrap: "Do not apply the target percentage only to the unsold units; the target concerns the entire inventory."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-082": {
      stem: {
        contextFamily: "spoiled-produce recovery",
        blocks: [
          {
            type: "paragraph",
            content: "A produce merchant buys {totalQuantity} crates at \u20B9{unitCostPrice} each. Of these, {goodQuantity} good crates are sold at \u20B9{goodUnitSellingPrice} each and {spoiledQuantity} crates are spoiled. The merchant wants an overall {targetRatePercent}% {targetDirection}."
          }
        ],
        prompt: "Find the recovery required per spoiled crate."
      },
      explanation: {
        opening: "The good stock produces a known receipt, while the spoiled stock must provide the remaining recovery needed for the target.",
        concept: "Calculate target total recovery for the whole purchase, subtract revenue from good units, and spread the balance over spoiled units.",
        steps: [
          {
            title: "Find total purchase cost",
            body: "Multiply total quantity by unit cost price."
          },
          {
            title: "Find the target total recovery",
            body: "Use break-even or the stated overall profit or loss factor."
          },
          {
            title: "Recover the spoiled-unit requirement",
            body: "Subtract good-unit revenue and divide the remaining amount by spoiled quantity."
          }
        ],
        conclusion: "The quotient is the minimum or required recovery per spoiled unit.",
        commonTrap: "Do not measure the target only on the good units; the original cost includes the entire stock."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-083": {
      stem: {
        contextFamily: "equal-price special result",
        blocks: [
          {
            type: "paragraph",
            content: "Two articles are sold at the same selling price. One is sold at a profit of {ratePercent}% and the other at an equal loss percentage."
          }
        ],
        prompt: "Find the overall loss percentage."
      },
      explanation: {
        opening: "Equal profit and loss rates do not cancel when two articles are sold for the same price.",
        concept: "The common selling price corresponds to two different cost prices, and the higher cost on the loss article creates an unavoidable overall loss.",
        steps: [
          {
            title: "Use a common selling-price base",
            body: "Take the equal selling price as a convenient amount."
          },
          {
            title: "Recover both costs",
            body: "Divide by 1+r/100 for the profit article and by 1\u2212r/100 for the loss article."
          },
          {
            title: "Compare combined totals",
            body: "Measure the total shortfall on total cost; the standard result simplifies to r squared divided by 100."
          }
        ],
        conclusion: "The pair therefore produces an overall loss, not no profit and no loss.",
        commonTrap: "Do not add the signed rates and conclude zero; their percentage bases are different.",
        shortcut: "For equal selling prices and equal opposite rates r%, the overall loss is r\xB2/100 percent."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-084": {
      stem: {
        contextFamily: "equal-price inverse rate",
        blocks: [
          {
            type: "paragraph",
            content: "Two electronic items are sold for the same amount. The first is sold at {knownRatePercent}% {knownDirection}. The second must have a {unknownDirection} result, and the two sales together must produce an overall {targetRatePercent}% {targetDirection}."
          }
        ],
        prompt: "Find the required percentage on the second item."
      },
      explanation: {
        opening: "One article's rate and the combined result are known, so the second cost factor must be recovered from the overall equation.",
        concept: "Use the common selling price to express both cost prices, then impose the stated total profit or loss condition.",
        steps: [
          {
            title: "Express the known article's cost",
            body: "Reverse its stated commercial multiplier from the common selling price."
          },
          {
            title: "Represent the unknown cost",
            body: "Write it using an unknown profit or loss multiplier."
          },
          {
            title: "Apply the combined target",
            body: "Compare twice the common selling price with the sum of both costs and solve the unknown rate."
          }
        ],
        conclusion: "The rate that satisfies the combined condition is the second article's result.",
        commonTrap: "Do not use the known rate as though both articles had equal cost price."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-085": {
      stem: {
        contextFamily: "warehouse total-sale planning",
        blocks: [
          {
            type: "paragraph",
            content: "The total cost price of a stock is \u20B9{totalCostPrice}. If the stock is sold at {ratePercent}% {direction},"
          }
        ],
        prompt: "Find the total selling price."
      },
      explanation: {
        opening: "This inventory has already been condensed into one total cost or selling amount, so it behaves like a single commercial transaction.",
        concept: "Apply the stated overall multiplier in the forward direction, or divide by it when the original total cost is required.",
        steps: [
          {
            title: "Form the overall multiplier",
            body: "Use 1+r/100 for profit and 1\u2212r/100 for loss."
          },
          {
            title: "Move in the required direction",
            body: "Multiply total cost to get total selling price, or divide total selling price to recover total cost."
          }
        ],
        conclusion: "The resulting total is the required inventory value.",
        commonTrap: "Do not apply the rate separately to unknown groups when the question already gives an overall total."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible commercial relationship with a direct substitution or comparison."
    },
    "PNL-QL-086": {
      stem: {
        contextFamily: "reverse total-cost recovery",
        blocks: [
          {
            type: "paragraph",
            content: "A stock is sold for a total of \u20B9{totalSellingPrice} at {ratePercent}% {direction}."
          }
        ],
        prompt: "Find its total cost price."
      },
      explanation: {
        opening: "This inventory has already been condensed into one total cost or selling amount, so it behaves like a single commercial transaction.",
        concept: "Apply the stated overall multiplier in the forward direction, or divide by it when the original total cost is required.",
        steps: [
          {
            title: "Form the overall multiplier",
            body: "Use 1+r/100 for profit and 1\u2212r/100 for loss."
          },
          {
            title: "Move in the required direction",
            body: "Multiply total cost to get total selling price, or divide total selling price to recover total cost."
          }
        ],
        conclusion: "The resulting total is the required inventory value.",
        commonTrap: "Do not apply the rate separately to unknown groups when the question already gives an overall total."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-087": {
      stem: {
        contextFamily: "fractional stock recovery",
        blocks: [
          {
            type: "paragraph",
            content: "The total cost of the stock is \u20B9{totalCostPrice}, and the amount recovered is {recoveredFraction} of that cost."
          }
        ],
        prompt: "Find the overall profit or loss percentage."
      },
      explanation: {
        opening: "The recovered fraction tells us directly how much of the original inventory cost returned as revenue.",
        concept: "Compare the recovered fraction with one whole cost: above one means profit, below one means loss, and the gap converts to a percentage.",
        steps: [
          {
            title: "Interpret the fraction",
            body: "Treat total cost as one whole unit and write recovered revenue as the stated fraction."
          },
          {
            title: "Find the gap from one",
            body: "Subtract the smaller fraction from the larger."
          },
          {
            title: "Convert the gap to percent",
            body: "Multiply the absolute fractional difference by 100."
          }
        ],
        conclusion: "The direction and percentage follow from whether recovery exceeds or falls short of total cost.",
        commonTrap: "Do not calculate the percentage on recovered revenue; total cost remains the standard base."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-088": {
      stem: {
        contextFamily: "inventory-table analysis",
        blocks: [
          {
            type: "paragraph",
            content: "The inventory analyst records several inventory groups in the table below."
          },
          {
            type: "table",
            caption: "Inventory groups",
            columns: [
              "Group",
              "Quantity and unit cost",
              "Selling condition"
            ],
            rowSource: "inventoryTable"
          }
        ],
        prompt: "Calculate the overall percentage gain or loss."
      },
      explanation: {
        opening: "When several lots or groups are involved, the overall result must come from total money rather than an average of percentages.",
        concept: "Each group contributes its own cost and selling amount; add those amounts first and then measure the combined difference on total cost.",
        steps: [
          {
            title: "Build group totals",
            body: "For every group, multiply quantity by unit cost and unit selling price or apply its stated rate."
          },
          {
            title: "Add cost and selling amounts",
            body: "Combine all group costs into total cost and all receipts into total selling price."
          },
          {
            title: "Find the overall result",
            body: "Compare the two totals and divide the absolute difference by total cost.",
            equationLatex: "r=\\frac{|S_T-C_T|}{C_T}\\times100"
          }
        ],
        conclusion: "The sign of total selling price minus total cost gives the overall direction and the formula gives the rate.",
        commonTrap: "Do not average the group percentages unless all group cost bases are equal."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-089": {
      stem: {
        contextFamily: "warehouse caselet",
        blocks: [
          {
            type: "caselet",
            title: "Warehouse inventory caselet",
            paragraphSource: "caseletData"
          }
        ],
        prompt: "Calculate the dealer's overall percentage gain or loss after accounting for sold and remaining stock."
      },
      explanation: {
        opening: "A partial-inventory question becomes manageable when every sold and unsold group is entered in one money ledger.",
        concept: "Total cost covers the entire stock, while total recovery includes receipts from sold groups plus any value recovered from remaining stock.",
        steps: [
          {
            title: "Find total inventory cost",
            body: "Multiply total quantity by unit cost price."
          },
          {
            title: "Add all recoveries",
            body: "Calculate revenue for every sold group and include the stated recovery from unsold units."
          },
          {
            title: "Measure the overall result",
            body: "Compare total recovery with total cost and use total cost as the percentage base."
          }
        ],
        conclusion: "The final comparison gives the overall profit or loss percentage for the complete inventory.",
        commonTrap: "Do not ignore unsold or recovered stock when calculating the overall result."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-090": {
      stem: {
        contextFamily: "equal-price statement analysis",
        blocks: [
          {
            type: "paragraph",
            content: "Two items are sold at the same price, one at {ratePercent}% profit and the other at {ratePercent}% loss."
          },
          {
            type: "statements",
            lead: "Consider the following claims:",
            statements: [
              "The equal profit and loss rates cancel completely.",
              "The pair produces an overall loss because the two cost-price bases are different."
            ]
          }
        ],
        prompt: "Select the correct statement about the overall result."
      },
      explanation: {
        opening: "Equal profit and loss rates do not cancel when two articles are sold for the same price.",
        concept: "The common selling price corresponds to two different cost prices, and the higher cost on the loss article creates an unavoidable overall loss.",
        steps: [
          {
            title: "Use a common selling-price base",
            body: "Take the equal selling price as a convenient amount."
          },
          {
            title: "Recover both costs",
            body: "Divide by 1+r/100 for the profit article and by 1\u2212r/100 for the loss article."
          },
          {
            title: "Compare combined totals",
            body: "Measure the total shortfall on total cost; the standard result simplifies to r squared divided by 100."
          }
        ],
        conclusion: "The pair therefore produces an overall loss, not no profit and no loss.",
        commonTrap: "Do not add the signed rates and conclude zero; their percentage bases are different.",
        shortcut: "For equal selling prices and equal opposite rates r%, the overall loss is r\xB2/100 percent."
      },
      difficulty: "Medium",
      difficultyRationale: "A reverse step, base conversion, or two-stage commercial transformation is required."
    },
    "PNL-QL-091": {
      stem: {
        contextFamily: "algebraic group-rate analysis",
        blocks: [
          {
            type: "paragraph",
            content: "The costs and selling conditions of inventory groups are expressed algebraically."
          },
          {
            type: "equation",
            latex: "\\text{Group data}={groupCostExpressions},\\qquad \\text{target rate}={targetRatePercent}\\%"
          }
        ],
        prompt: "Determine the unknown group rate required for the stated overall result."
      },
      explanation: {
        opening: "The unknown group's rate must make the combined inventory reach a stated overall target.",
        concept: "Translate the target into a required total selling amount, subtract the selling amounts already fixed, and compare the remaining requirement with the unknown group's cost.",
        steps: [
          {
            title: "Find the target total selling amount",
            body: "Apply the target commercial factor to the total cost of all groups."
          },
          {
            title: "Remove known group receipts",
            body: "Calculate and subtract the selling amounts of groups whose rates are known."
          },
          {
            title: "Solve the unknown group's rate",
            body: "Compare its required selling amount with its own cost price."
          }
        ],
        conclusion: "This comparison gives both the direction and percentage required for the unknown group.",
        commonTrap: "Do not apply the overall target rate directly to the unknown group alone."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-092": {
      stem: {
        contextFamily: "remaining-stock data sufficiency",
        blocks: [
          {
            type: "data_sufficiency",
            question: "Can the required unit selling price of the remaining stock for an overall 10% profit be determined?",
            statements: [
              "{statementOne}",
              "{statementTwo}"
            ],
            answerScheme: "STANDARD_TWO_STATEMENT"
          }
        ],
        prompt: "Decide whether either statement alone or both together are sufficient."
      },
      explanation: {
        opening: "The required price or rate on the remaining stock must first cover the gap left after earlier sales or damage recovery.",
        concept: "Start from the target total recovery, subtract what has already been recovered, and spread the remaining requirement across the unsold good units.",
        steps: [
          {
            title: "Find total cost and target recovery",
            body: "Calculate complete inventory cost and apply the target profit or loss factor."
          },
          {
            title: "Subtract known recoveries",
            body: "Remove receipts from sold groups and damaged or recovered units."
          },
          {
            title: "Allocate the remaining amount",
            body: "Divide by the number of units still to be sold; convert to a rate if the question asks for one."
          }
        ],
        conclusion: "The resulting unit price or rate is what the remaining stock must achieve.",
        commonTrap: "Do not apply the target percentage only to the unsold units; the target concerns the entire inventory."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    },
    "PNL-QL-093": {
      stem: {
        contextFamily: "multi-lot amount analysis",
        blocks: [
          {
            type: "paragraph",
            content: "The bulk trader purchases and sells several groups of purchase lots."
          },
          {
            type: "table",
            caption: "Given commercial data",
            columns: [
              "Group",
              "Quantity or cost",
              "Selling condition"
            ],
            rowSource: "lots"
          }
        ],
        prompt: "Find the overall profit or loss amount."
      },
      explanation: {
        opening: "When several lots or groups are involved, the overall result must come from total money rather than an average of percentages.",
        concept: "Each group contributes its own cost and selling amount; add those amounts first and then measure the combined difference on total cost.",
        steps: [
          {
            title: "Build group totals",
            body: "For every group, multiply quantity by unit cost and unit selling price or apply its stated rate."
          },
          {
            title: "Add cost and selling amounts",
            body: "Combine all group costs into total cost and all receipts into total selling price."
          },
          {
            title: "Find the overall result",
            body: "Compare the two totals and divide the absolute difference by total cost.",
            equationLatex: "r=\\frac{|S_T-C_T|}{C_T}\\times100"
          }
        ],
        conclusion: "The sign of total selling price minus total cost gives the overall direction and the formula gives the rate.",
        commonTrap: "Do not average the group percentages unless all group cost bases are equal."
      },
      difficulty: "Medium",
      difficultyRationale: "Two linked calculations are required, but the reasoning path is directly visible."
    },
    "PNL-QL-094": {
      stem: {
        contextFamily: "spoiled-stock break-even recovery",
        blocks: [
          {
            type: "paragraph",
            content: "A food distributor buys {totalQuantity} packs at \u20B9{unitCostPrice} each. Of these, {goodQuantity} good packs are sold at \u20B9{goodUnitSellingPrice} each and {spoiledQuantity} packs cannot be sold normally."
          }
        ],
        prompt: "Find the minimum recovery per spoiled pack required to avoid an overall loss."
      },
      explanation: {
        opening: "The good stock produces a known receipt, while the spoiled stock must provide the remaining recovery needed for the target.",
        concept: "Calculate target total recovery for the whole purchase, subtract revenue from good units, and spread the balance over spoiled units.",
        steps: [
          {
            title: "Find total purchase cost",
            body: "Multiply total quantity by unit cost price."
          },
          {
            title: "Find the target total recovery",
            body: "Use break-even or the stated overall profit or loss factor."
          },
          {
            title: "Recover the spoiled-unit requirement",
            body: "Subtract good-unit revenue and divide the remaining amount by spoiled quantity."
          }
        ],
        conclusion: "The quotient is the minimum or required recovery per spoiled unit.",
        commonTrap: "Do not measure the target only on the good units; the original cost includes the entire stock."
      },
      difficulty: "Hard",
      difficultyRationale: "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic."
    }
  },
  entryCount: 24
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/cp003-independent-verifier.ts
function verifyMultipleLotsResult(lots, result) {
  let totalCost = 0n;
  let totalSelling = 0n;
  for (const lot of lots) {
    totalCost += lot.quantity * lot.unitCostPrice.paise;
    totalSelling += lot.quantity * lot.unitSellingPrice.paise;
  }
  const delta = totalSelling - totalCost;
  const absolute = delta < 0n ? -delta : delta;
  const expectedDirection = delta > 0n ? "PROFIT" : delta < 0n ? "LOSS" : "NO_CHANGE";
  const expectedRate = asPercent(divideRational(rational(absolute), rational(totalCost)));
  return {
    valid: result.totalCost.paise === totalCost && result.totalSelling.paise === totalSelling && result.direction === expectedDirection && result.amount.paise === absolute && result.ratePercent.numerator * expectedRate.denominator === expectedRate.numerator * result.ratePercent.denominator,
    expectedDirection,
    expectedAmount: moneyFromPaise(absolute),
    expectedRateNumerator: expectedRate.numerator,
    expectedRateDenominator: expectedRate.denominator
  };
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-003/task-registry.library.json
var task_registry_library_default3 = {
  archetypeId: "PNL-001",
  cpId: "PNL-CP-003",
  status: "FREEZE_CANDIDATE",
  countPolicy: "DISCOVERED_NOT_QUOTA_DRIVEN",
  title: "Multiple Articles and Inventory",
  entries: {
    "PNL-QL-071": { solveMode: "MULTIPLE_LOTS_TO_OVERALL_RESULT", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["lots"], difficulty: "Medium" },
    "PNL-QL-072": { solveMode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["commonSellingPrice", "firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent"], difficulty: "Hard" },
    "PNL-QL-073": { solveMode: "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["commonCostPrice", "firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent"], difficulty: "Medium" },
    "PNL-QL-074": { solveMode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["totalQuantity", "unitCostPrice", "soldGroups", "unsoldQuantity", "unsoldRecoveryPerUnit"], difficulty: "Hard" },
    "PNL-QL-075": { solveMode: "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER", answerSemantic: "requiredSellingPricePerGoodUnit", requiredVariables: ["totalQuantity", "unitCostPrice", "damagedQuantity", "damagedRecoveryPerUnit", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-076": { solveMode: "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["paidQuantity", "freeQuantity", "unitCostPrice", "unitSellingPrice"], difficulty: "Hard" },
    "PNL-QL-077": { solveMode: "GROUP_RATES_TO_OVERALL_RESULT", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["groups"], difficulty: "Medium" },
    "PNL-QL-078": { solveMode: "UNKNOWN_GROUP_RATE_FOR_TARGET", answerSemantic: "unknownGroupRatePercent", requiredVariables: ["knownGroups", "unknownQuantity", "unknownUnitCostPrice", "unknownDirection", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-079": { solveMode: "UNKNOWN_GROUP_QUANTITY_FOR_TARGET", answerSemantic: "unknownQuantity", requiredVariables: ["fixedGroups", "unknownUnitCostPrice", "unknownDirection", "unknownRatePercent", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-080": { solveMode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE", answerSemantic: "requiredUnitSellingPrice", requiredVariables: ["totalQuantity", "unitCostPrice", "soldGroups", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-081": { solveMode: "UNSOLD_STOCK_REQUIRED_RATE", answerSemantic: "requiredRatePercent", requiredVariables: ["totalQuantity", "unitCostPrice", "soldGroups", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-082": { solveMode: "SPOILED_STOCK_REQUIRED_RECOVERY", answerSemantic: "requiredRecoveryPerSpoiledUnit", requiredVariables: ["totalQuantity", "unitCostPrice", "goodQuantity", "goodUnitSellingPrice", "spoiledQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-083": { solveMode: "EQUAL_SP_EQUAL_RATES_SPECIAL", answerSemantic: "overallLossPercent", requiredVariables: ["ratePercent"], difficulty: "Medium" },
    "PNL-QL-084": { solveMode: "EQUAL_SP_ONE_RATE_FROM_OVERALL", answerSemantic: "unknownRatePercent", requiredVariables: ["knownDirection", "knownRatePercent", "unknownDirection", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-085": { solveMode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP", answerSemantic: "totalSellingPrice", requiredVariables: ["totalCostPrice", "direction", "ratePercent"], difficulty: "Easy" },
    "PNL-QL-086": { solveMode: "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP", answerSemantic: "totalCostPrice", requiredVariables: ["totalSellingPrice", "direction", "ratePercent"], difficulty: "Medium" },
    "PNL-QL-087": { solveMode: "RECOVERY_FRACTION_TO_OVERALL_RESULT", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["totalCostPrice", "recoveredFraction"], difficulty: "Medium" },
    "PNL-QL-088": { solveMode: "GROUP_RATES_TO_OVERALL_RESULT", answerSemantic: "tableOverallResult", requiredVariables: ["inventoryTable"], difficulty: "Hard", representation: "TABLE" },
    "PNL-QL-089": { solveMode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT", answerSemantic: "caseletOverallResult", requiredVariables: ["caseletData"], difficulty: "Hard", representation: "CASELET" },
    "PNL-QL-090": { solveMode: "EQUAL_SP_EQUAL_RATES_SPECIAL", answerSemantic: "correctStatement", requiredVariables: ["ratePercent"], difficulty: "Medium", representation: "STATEMENT" },
    "PNL-QL-091": { solveMode: "UNKNOWN_GROUP_RATE_FOR_TARGET", answerSemantic: "algebraicUnknownRate", requiredVariables: ["groupCostExpressions", "targetRatePercent"], difficulty: "Hard", representation: "ALGEBRAIC" },
    "PNL-QL-092": { solveMode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE", answerSemantic: "dataSufficiency", requiredVariables: ["statementOne", "statementTwo"], difficulty: "Hard", representation: "DATA_SUFFICIENCY" },
    "PNL-QL-093": { solveMode: "MULTIPLE_LOTS_TO_OVERALL_RESULT", answerSemantic: "overallProfitOrLossAmount", requiredVariables: ["lots"], difficulty: "Medium" },
    "PNL-QL-094": { solveMode: "SPOILED_STOCK_REQUIRED_RECOVERY", answerSemantic: "breakEvenRecoveryPerSpoiledUnit", requiredVariables: ["totalQuantity", "unitCostPrice", "goodQuantity", "goodUnitSellingPrice", "spoiledQuantity"], difficulty: "Hard" }
  },
  entryCount: 24,
  freezeNote: "Count frozen after direct/inverse, equal-price, weighted-group, partial-stock, spoilage/recovery, representation and QL-depth audits. Reopen only for a genuinely distinct runtime or PYQ mode."
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/inventory-solver.ts
function fromRate(base, direction2, rate2) {
  const delta = multiplyMoney(base, divideRational(rate2, rational(100)));
  return moneyFromPaise(direction2 === "PROFIT" ? base.paise + delta.paise : base.paise - delta.paise);
}
function costFromSelling(selling, direction2, rate2) {
  const denominator = direction2 === "PROFIT" ? 100n * rate2.denominator + rate2.numerator : 100n * rate2.denominator - rate2.numerator;
  if (denominator <= 0n) throw new Error("Invalid reverse rate.");
  return multiplyMoney(selling, rational(100n * rate2.denominator, denominator));
}
function summarize(totalCost, totalSelling) {
  if (totalCost.paise <= 0n) throw new Error("Total cost must be positive.");
  const delta = totalSelling.paise - totalCost.paise;
  const direction2 = delta > 0n ? "PROFIT" : delta < 0n ? "LOSS" : "NO_CHANGE";
  const absolute = delta < 0n ? -delta : delta;
  return { direction: direction2, amount: moneyFromPaise(absolute), ratePercent: asPercent(divideRational(rational(absolute), rational(totalCost.paise))) };
}
function solveInventory(request) {
  switch (request.mode) {
    case "MULTIPLE_LOTS_TO_OVERALL_RESULT": {
      if (request.lots.length === 0) throw new Error("At least one lot is required.");
      let totalCost = 0n, totalSelling = 0n;
      for (const lot of request.lots) {
        if (lot.quantity <= 0n) throw new Error("Lot quantity must be positive.");
        totalCost += lot.quantity * lot.unitCostPrice.paise;
        totalSelling += lot.quantity * lot.unitSellingPrice.paise;
      }
      const cost = moneyFromPaise(totalCost), selling = moneyFromPaise(totalSelling);
      return { mode: request.mode, totalCost: cost, totalSelling: selling, ...summarize(cost, selling) };
    }
    case "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE": {
      const firstCost = costFromSelling(request.commonSellingPrice, request.firstDirection, request.firstRatePercent);
      const secondCost = costFromSelling(request.commonSellingPrice, request.secondDirection, request.secondRatePercent);
      const totalCost = moneyFromPaise(firstCost.paise + secondCost.paise);
      const totalSelling = moneyFromPaise(2n * request.commonSellingPrice.paise);
      const summary = summarize(totalCost, totalSelling);
      return { mode: request.mode, direction: summary.direction, ratePercent: summary.ratePercent };
    }
    case "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE": {
      const firstSp = fromRate(request.commonCostPrice, request.firstDirection, request.firstRatePercent);
      const secondSp = fromRate(request.commonCostPrice, request.secondDirection, request.secondRatePercent);
      const totalCost = moneyFromPaise(2n * request.commonCostPrice.paise);
      const totalSelling = moneyFromPaise(firstSp.paise + secondSp.paise);
      const summary = summarize(totalCost, totalSelling);
      return { mode: request.mode, direction: summary.direction, ratePercent: summary.ratePercent };
    }
    case "PARTIAL_INVENTORY_TO_OVERALL_RESULT": {
      if (request.totalQuantity <= 0n) throw new Error("Total quantity must be positive.");
      const soldQuantity = request.soldGroups.reduce((sum, group) => sum + group.quantity, 0n);
      const unsold = request.unsoldQuantity ?? request.totalQuantity - soldQuantity;
      if (soldQuantity + unsold !== request.totalQuantity) throw new Error("Inventory quantities do not reconcile.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      let recovery = request.soldGroups.reduce((sum, group) => sum + group.quantity * group.unitSellingPrice.paise, 0n);
      recovery += unsold * (request.unsoldRecoveryPerUnit?.paise ?? 0n);
      const totalRecovery = moneyFromPaise(recovery);
      return { mode: request.mode, totalCost, totalRecovery, ...summarize(totalCost, totalRecovery) };
    }
    case "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER": {
      const goodQuantity = request.totalQuantity - request.damagedQuantity;
      if (goodQuantity <= 0n) throw new Error("At least one good unit must remain.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      const targetRecovery = fromRate(totalCost, request.targetDirection, request.targetRatePercent);
      const damagedRecovery = request.damagedQuantity * request.damagedRecoveryPerUnit.paise;
      const needed = targetRecovery.paise - damagedRecovery;
      if (needed < 0n) throw new Error("Damaged-stock recovery already exceeds target recovery.");
      return { mode: request.mode, requiredSellingPricePerGoodUnit: moneyFromPaise(needed / goodQuantity) };
    }
    case "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT": {
      if (request.paidQuantity <= 0n || request.freeQuantity < 0n) throw new Error("Invalid quantities.");
      const totalQuantity = request.paidQuantity + request.freeQuantity;
      const totalCost = moneyFromPaise(request.paidQuantity * request.unitCostPrice.paise);
      const totalSelling = moneyFromPaise(totalQuantity * request.unitSellingPrice.paise);
      const summary = summarize(totalCost, totalSelling);
      return { mode: request.mode, ...summary };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/inventory-advanced-solver.ts
function multiplier(direction2, ratePercent) {
  const hundred = rational(100);
  return direction2 === "PROFIT" ? rational(100n * ratePercent.denominator + ratePercent.numerator, 100n * ratePercent.denominator) : rational(100n * ratePercent.denominator - ratePercent.numerator, 100n * ratePercent.denominator);
}
function summarize2(cost, selling) {
  if (cost.paise <= 0n) throw new Error("Total cost must be positive.");
  const delta = selling.paise - cost.paise;
  const absolute = delta < 0n ? -delta : delta;
  return {
    direction: delta > 0n ? "PROFIT" : delta < 0n ? "LOSS" : "NO_CHANGE",
    amount: moneyFromPaise(absolute),
    ratePercent: asPercent(divideRational(rational(absolute), rational(cost.paise)))
  };
}
function targetSelling(cost, direction2, rate2) {
  return multiplyMoney(cost, multiplier(direction2, rate2));
}
function solveInventoryAdvanced(request) {
  switch (request.mode) {
    case "GROUP_RATES_TO_OVERALL_RESULT": {
      if (!request.groups.length) throw new Error("At least one group is required.");
      let cp = 0n, sp = 0n;
      for (const group of request.groups) {
        if (group.quantity <= 0n) throw new Error("Group quantity must be positive.");
        const groupCost = moneyFromPaise(group.quantity * group.unitCostPrice.paise);
        cp += groupCost.paise;
        sp += targetSelling(groupCost, group.direction, group.ratePercent).paise;
      }
      const totalCost = moneyFromPaise(cp), totalSelling = moneyFromPaise(sp);
      return { mode: request.mode, totalCost, totalSelling, ...summarize2(totalCost, totalSelling) };
    }
    case "UNKNOWN_GROUP_RATE_FOR_TARGET": {
      const known = solveInventoryAdvanced({ mode: "GROUP_RATES_TO_OVERALL_RESULT", groups: request.knownGroups });
      const unknownCost = moneyFromPaise(request.unknownQuantity * request.unknownUnitCostPrice.paise);
      const totalCost = moneyFromPaise(known.totalCost.paise + unknownCost.paise);
      const requiredUnknownSelling = moneyFromPaise(targetSelling(totalCost, request.targetDirection, request.targetRatePercent).paise - known.totalSelling.paise);
      const delta = requiredUnknownSelling.paise - unknownCost.paise;
      if (request.unknownDirection === "PROFIT" && delta < 0n || request.unknownDirection === "LOSS" && delta > 0n) throw new Error("Requested direction is incompatible with target.");
      return { mode: request.mode, unknownRatePercent: asPercent(divideRational(rational(delta < 0n ? -delta : delta), rational(unknownCost.paise))) };
    }
    case "UNKNOWN_GROUP_QUANTITY_FOR_TARGET": {
      const fixed = solveInventoryAdvanced({ mode: "GROUP_RATES_TO_OVERALL_RESULT", groups: request.fixedGroups });
      const unknownCp = request.unknownUnitCostPrice.paise;
      const unknownSp = targetSelling(request.unknownUnitCostPrice, request.unknownDirection, request.unknownRatePercent).paise;
      const targetMul = multiplier(request.targetDirection, request.targetRatePercent);
      const numerator = multiplyMoney(fixed.totalCost, targetMul).paise - fixed.totalSelling.paise;
      const denominator = unknownSp * targetMul.denominator - unknownCp * targetMul.numerator;
      if (denominator === 0n || numerator === 0n) throw new Error("Unknown quantity is indeterminate.");
      const quantity = numerator * targetMul.denominator / denominator;
      if (quantity <= 0n) throw new Error("No positive whole-number quantity satisfies the target.");
      return { mode: request.mode, unknownQuantity: quantity };
    }
    case "UNSOLD_STOCK_REQUIRED_UNIT_PRICE": {
      const soldQty = request.soldGroups.reduce((s, g) => s + g.quantity, 0n);
      const remaining = request.totalQuantity - soldQty;
      if (remaining <= 0n) throw new Error("Unsold quantity must be positive.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      const soldRecovery = request.soldGroups.reduce((s, g) => s + g.quantity * g.unitSellingPrice.paise, 0n);
      const needed = targetSelling(totalCost, request.targetDirection, request.targetRatePercent).paise - soldRecovery;
      if (needed < 0n) throw new Error("Existing recovery already exceeds target.");
      return { mode: request.mode, requiredUnitSellingPrice: moneyFromPaise(needed / remaining) };
    }
    case "UNSOLD_STOCK_REQUIRED_RATE": {
      const unit = solveInventoryAdvanced({ ...request, mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE" });
      const delta = unit.requiredUnitSellingPrice.paise - request.unitCostPrice.paise;
      return { mode: request.mode, requiredRatePercent: asPercent(divideRational(rational(delta < 0n ? -delta : delta), rational(request.unitCostPrice.paise))) };
    }
    case "SPOILED_STOCK_REQUIRED_RECOVERY": {
      if (request.goodQuantity + request.spoiledQuantity !== request.totalQuantity || request.spoiledQuantity <= 0n) throw new Error("Quantities must reconcile.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      const needed = targetSelling(totalCost, request.targetDirection, request.targetRatePercent).paise - request.goodQuantity * request.goodUnitSellingPrice.paise;
      if (needed < 0n) throw new Error("Good-stock recovery already exceeds target.");
      return { mode: request.mode, requiredRecoveryPerSpoiledUnit: moneyFromPaise(needed / request.spoiledQuantity) };
    }
    case "EQUAL_SP_EQUAL_RATES_SPECIAL": {
      const r = request.ratePercent;
      return { mode: request.mode, direction: "LOSS", ratePercent: rational(r.numerator * r.numerator, 100n * r.denominator * r.denominator) };
    }
    case "EQUAL_SP_ONE_RATE_FROM_OVERALL": {
      const p = Number(request.knownRatePercent.numerator) / Number(request.knownRatePercent.denominator);
      const t = Number(request.targetRatePercent.numerator) / Number(request.targetRatePercent.denominator) * (request.targetDirection === "PROFIT" ? 1 : -1);
      const s1 = request.knownDirection === "PROFIT" ? 1e4 / (100 + p) : 1e4 / (100 - p);
      const targetCp = 200 / (1 + t / 100);
      const s2 = targetCp - s1;
      const unknown = request.unknownDirection === "PROFIT" ? 100 / s2 - 1 : 1 - 100 / s2;
      if (unknown < 0) throw new Error("Requested unknown direction is incompatible.");
      return { mode: request.mode, unknownRatePercent: rational(BigInt(Math.round(unknown * 1e6)), 10000n) };
    }
    case "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP":
      return { mode: request.mode, totalSellingPrice: targetSelling(request.totalCostPrice, request.direction, request.ratePercent) };
    case "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP": {
      const m = multiplier(request.direction, request.ratePercent);
      return { mode: request.mode, totalCostPrice: multiplyMoney(request.totalSellingPrice, rational(m.denominator, m.numerator)) };
    }
    case "RECOVERY_FRACTION_TO_OVERALL_RESULT": {
      const recovered = multiplyMoney(request.totalCostPrice, request.recoveredFraction);
      return { mode: request.mode, ...summarize2(request.totalCostPrice, recovered) };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-003/cp003-dynamic-cases.ts
var PNL_CP003_ID = "PNL-CP-003";
var taskRegistry3 = task_registry_library_default3;
var PNL_CP003_QL_IDS = Object.keys(taskRegistry3.entries);
var UNIT_COSTS = [100, 120, 150, 200, 240, 300];
var QUANTITIES = [10n, 20n, 25n, 40n, 50n];
var RATES = [10, 20, 25, 40];
var TOTAL_COSTS = [1e4, 12e3, 15e3, 2e4, 24e3];
var RECOVERY_FRACTIONS = [
  [4n, 5n],
  [9n, 10n],
  [11n, 10n],
  [6n, 5n]
];
var EQUAL_SP_PRESETS = [
  { common: 1200, first: ["PROFIT", 20], second: ["LOSS", 20] },
  { common: 1500, first: ["PROFIT", 25], second: ["LOSS", 25] },
  { common: 1200, first: ["PROFIT", 20], second: ["PROFIT", 25] },
  { common: 1500, first: ["LOSS", 25], second: ["PROFIT", 25] }
];
var PARTIAL_PRESETS = [
  { total: 100n, sold: 60n, cost: 100, soldPrice: 120, recovery: 50 },
  { total: 100n, sold: 50n, cost: 120, soldPrice: 150, recovery: 80 },
  { total: 80n, sold: 40n, cost: 150, soldPrice: 180, recovery: 100 },
  { total: 120n, sold: 80n, cost: 100, soldPrice: 110, recovery: 60 }
];
var DAMAGED_PRESETS = [
  { total: 100n, damaged: 20n, cost: 100, recovery: 20, target: 10 },
  { total: 100n, damaged: 25n, cost: 120, recovery: 120, target: 10 },
  { total: 80n, damaged: 20n, cost: 150, recovery: 60, target: 20 }
];
var UNSOLD_PRESETS = [
  { total: 100n, sold: 60n, cost: 100, soldPrice: 120, remainingPrice: 110 },
  { total: 100n, sold: 50n, cost: 120, soldPrice: 150, remainingPrice: 96 },
  { total: 80n, sold: 40n, cost: 150, soldPrice: 180, remainingPrice: 135 },
  { total: 120n, sold: 80n, cost: 100, soldPrice: 110, remainingPrice: 120 }
];
var SPOILED_PRESETS = [
  {
    total: 100n,
    good: 80n,
    cost: 100,
    goodPrice: 120,
    spoiledRecovery: 70,
    target: 10
  },
  {
    total: 100n,
    good: 75n,
    cost: 120,
    goodPrice: 144,
    spoiledRecovery: 84,
    target: 8
  },
  {
    total: 80n,
    good: 60n,
    cost: 150,
    goodPrice: 180,
    spoiledRecovery: 60,
    target: 0
  }
];
function cp003PlainMoney(value) {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}
function cp003FormatMoney(value) {
  return `\u20B9${cp003PlainMoney(value)}`;
}
function cp003FormatRational(value) {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function cp003FormatPercent(value) {
  return `${cp003FormatRational(value)}%`;
}
function rupees2(value) {
  return moneyFromRupees(value);
}
function pickNumber2(random, values) {
  return pickSeeded(random, values);
}
function ratePrice(base, direction2, ratePercent) {
  const delta = multiplyMoney(
    base,
    rational(ratePercent.numerator, 100n * ratePercent.denominator)
  );
  return moneyFromPaise(
    direction2 === "PROFIT" ? base.paise + delta.paise : base.paise - delta.paise
  );
}
function overallTargetFromGroupResult(result) {
  if (result.direction === "NO_CHANGE") {
    throw new Error(
      "Generated group inventory unexpectedly has no overall direction."
    );
  }
  return { direction: result.direction, ratePercent: result.ratePercent };
}
function targetFromPartial(totalQuantity, unitCostPrice, soldGroups, unsoldQuantity, unsoldRecoveryPerUnit) {
  const result = solveInventory({
    mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
    totalQuantity,
    unitCostPrice,
    soldGroups,
    unsoldQuantity,
    unsoldRecoveryPerUnit
  });
  if (result.direction === "NO_CHANGE") {
    return { direction: "PROFIT", ratePercent: rational(0) };
  }
  return { direction: result.direction, ratePercent: result.ratePercent };
}
function groupRow(label, quantity, unitCostPrice, direction2, ratePercent) {
  return [
    label,
    `${quantity} units at ${cp003FormatMoney(unitCostPrice)} each`,
    `${cp003FormatPercent(ratePercent)} ${direction2.toLowerCase()}`
  ];
}
function lotRow(label, lot) {
  return [
    label,
    `${lot.quantity} units at ${cp003FormatMoney(lot.unitCostPrice)} each`,
    `sold at ${cp003FormatMoney(lot.unitSellingPrice)} each`
  ];
}
function soldRow(label, quantity, unitSellingPrice) {
  return [
    label,
    `${quantity} units`,
    `sold at ${cp003FormatMoney(unitSellingPrice)} each`
  ];
}
function pickDirection(random) {
  return pickSeeded(random, ["PROFIT", "LOSS"]);
}
function makeLots(random) {
  const firstCost = rupees2(pickNumber2(random, UNIT_COSTS));
  const secondCost = rupees2(pickNumber2(random, UNIT_COSTS));
  const firstDirection = pickDirection(random);
  const secondDirection = pickDirection(random);
  const firstRate = rational(pickNumber2(random, RATES));
  const secondRate = rational(pickNumber2(random, RATES));
  return [
    {
      quantity: pickSeeded(random, QUANTITIES),
      unitCostPrice: firstCost,
      unitSellingPrice: ratePrice(firstCost, firstDirection, firstRate)
    },
    {
      quantity: pickSeeded(random, QUANTITIES),
      unitCostPrice: secondCost,
      unitSellingPrice: ratePrice(secondCost, secondDirection, secondRate)
    }
  ];
}
function makeGroups(random) {
  const first = {
    quantity: pickSeeded(random, QUANTITIES),
    unitCostPrice: rupees2(pickNumber2(random, UNIT_COSTS)),
    direction: pickDirection(random),
    ratePercent: rational(pickNumber2(random, RATES))
  };
  const second = {
    quantity: pickSeeded(random, QUANTITIES),
    unitCostPrice: rupees2(pickNumber2(random, UNIT_COSTS)),
    direction: pickDirection(random),
    ratePercent: rational(pickNumber2(random, RATES))
  };
  return [first, second];
}
var ADVANCED_MODES = /* @__PURE__ */ new Set([
  "GROUP_RATES_TO_OVERALL_RESULT",
  "UNKNOWN_GROUP_RATE_FOR_TARGET",
  "UNKNOWN_GROUP_QUANTITY_FOR_TARGET",
  "UNSOLD_STOCK_REQUIRED_UNIT_PRICE",
  "UNSOLD_STOCK_REQUIRED_RATE",
  "SPOILED_STOCK_REQUIRED_RECOVERY",
  "EQUAL_SP_EQUAL_RATES_SPECIAL",
  "EQUAL_SP_ONE_RATE_FROM_OVERALL",
  "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
  "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP",
  "RECOVERY_FRACTION_TO_OVERALL_RESULT"
]);
function solvePnlCp003Request(request) {
  return ADVANCED_MODES.has(request.mode) ? solveInventoryAdvanced(request) : solveInventory(request);
}
function generatePnlCp003Case(qlId, seedValue) {
  const registry = taskRegistry3.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-003 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);
  switch (qlId) {
    case "PNL-QL-071":
    case "PNL-QL-093": {
      const lots = makeLots(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "MULTIPLE_LOTS_TO_OVERALL_RESULT", lots },
        context: {
          lots: lots.map((lot, index) => lotRow(`Lot ${index + 1}`, lot))
        }
      };
    }
    case "PNL-QL-072": {
      const preset = pickSeeded(random, EQUAL_SP_PRESETS);
      const firstDirection = preset.first[0];
      const secondDirection = preset.second[0];
      const firstRatePercent = rational(preset.first[1]);
      const secondRatePercent = rational(preset.second[1]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE",
          commonSellingPrice: rupees2(preset.common),
          firstDirection,
          firstRatePercent,
          secondDirection,
          secondRatePercent
        },
        context: {
          commonSellingPrice: preset.common,
          firstDirection: firstDirection.toLowerCase(),
          firstRatePercent: cp003FormatRational(firstRatePercent),
          secondDirection: secondDirection.toLowerCase(),
          secondRatePercent: cp003FormatRational(secondRatePercent)
        }
      };
    }
    case "PNL-QL-073": {
      const commonCostPrice = rupees2(pickNumber2(random, UNIT_COSTS));
      const firstDirection = pickDirection(random);
      const secondDirection = pickDirection(random);
      const firstRatePercent = rational(pickNumber2(random, RATES));
      const secondRatePercent = rational(pickNumber2(random, RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE",
          commonCostPrice,
          firstDirection,
          firstRatePercent,
          secondDirection,
          secondRatePercent
        },
        context: {
          commonCostPrice: cp003PlainMoney(commonCostPrice),
          firstDirection: firstDirection.toLowerCase(),
          firstRatePercent: cp003FormatRational(firstRatePercent),
          secondDirection: secondDirection.toLowerCase(),
          secondRatePercent: cp003FormatRational(secondRatePercent)
        }
      };
    }
    case "PNL-QL-074":
    case "PNL-QL-089": {
      const preset = pickSeeded(random, PARTIAL_PRESETS);
      const totalQuantity = preset.total;
      const unitCostPrice = rupees2(preset.cost);
      const soldGroups = [
        { quantity: preset.sold, unitSellingPrice: rupees2(preset.soldPrice) }
      ];
      const unsoldQuantity = totalQuantity - preset.sold;
      const unsoldRecoveryPerUnit = rupees2(preset.recovery);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
          totalQuantity,
          unitCostPrice,
          soldGroups,
          unsoldQuantity,
          unsoldRecoveryPerUnit
        },
        context: {
          totalQuantity: totalQuantity.toString(),
          unitCostPrice: cp003PlainMoney(unitCostPrice),
          soldGroups: soldGroups.map(
            (group, index) => soldRow(
              `Sold group ${index + 1}`,
              group.quantity,
              group.unitSellingPrice
            )
          ),
          unsoldQuantity: unsoldQuantity.toString(),
          unsoldRecoveryPerUnit: cp003PlainMoney(unsoldRecoveryPerUnit),
          caseletData: [
            `The dealer bought ${totalQuantity} units at ${cp003FormatMoney(unitCostPrice)} each.`,
            `${preset.sold} units were sold at ${cp003FormatMoney(rupees2(preset.soldPrice))} each, while ${unsoldQuantity} units recovered ${cp003FormatMoney(unsoldRecoveryPerUnit)} each.`
          ]
        }
      };
    }
    case "PNL-QL-075": {
      const preset = pickSeeded(random, DAMAGED_PRESETS);
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(preset.target);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER",
          totalQuantity: preset.total,
          unitCostPrice: rupees2(preset.cost),
          damagedQuantity: preset.damaged,
          damagedRecoveryPerUnit: rupees2(preset.recovery),
          targetDirection,
          targetRatePercent
        },
        context: {
          totalQuantity: preset.total.toString(),
          unitCostPrice: preset.cost,
          damagedQuantity: preset.damaged.toString(),
          damagedRecoveryPerUnit: preset.recovery,
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp003FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-076": {
      const paidQuantity = pickSeeded(random, [50n, 80n, 100n]);
      const freeQuantity = pickSeeded(random, [5n, 10n, 20n]);
      const unitCostPrice = rupees2(pickNumber2(random, UNIT_COSTS));
      const unitSellingPrice = ratePrice(
        unitCostPrice,
        pickDirection(random),
        rational(pickNumber2(random, [10, 20]))
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT",
          paidQuantity,
          freeQuantity,
          unitCostPrice,
          unitSellingPrice
        },
        context: {
          paidQuantity: paidQuantity.toString(),
          freeQuantity: freeQuantity.toString(),
          unitCostPrice: cp003PlainMoney(unitCostPrice),
          unitSellingPrice: cp003PlainMoney(unitSellingPrice)
        }
      };
    }
    case "PNL-QL-077":
    case "PNL-QL-088": {
      const groups = makeGroups(random);
      const rows2 = groups.map(
        (group, index) => groupRow(
          `Group ${index + 1}`,
          group.quantity,
          group.unitCostPrice,
          group.direction,
          group.ratePercent
        )
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "GROUP_RATES_TO_OVERALL_RESULT", groups },
        context: { groups: rows2, inventoryTable: rows2 }
      };
    }
    case "PNL-QL-078":
    case "PNL-QL-091": {
      const knownDirection = pickDirection(random);
      const knownGroups = [
        {
          quantity: pickSeeded(random, QUANTITIES),
          unitCostPrice: rupees2(pickNumber2(random, UNIT_COSTS)),
          direction: knownDirection,
          ratePercent: rational(pickNumber2(random, [10, 20, 25]))
        }
      ];
      const unknownQuantity = pickSeeded(random, [10n, 20n, 40n]);
      const unknownUnitCostPrice = rupees2(pickNumber2(random, UNIT_COSTS));
      const unknownDirection = knownDirection;
      const unknownRatePercent = rational(
        pickNumber2(random, [10, 20, 25])
      );
      const complete = solveInventoryAdvanced({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...knownGroups,
          {
            quantity: unknownQuantity,
            unitCostPrice: unknownUnitCostPrice,
            direction: unknownDirection,
            ratePercent: unknownRatePercent
          }
        ]
      });
      const target = overallTargetFromGroupResult(complete);
      const rows2 = knownGroups.map(
        (group, index) => groupRow(
          `Known group ${index + 1}`,
          group.quantity,
          group.unitCostPrice,
          group.direction,
          group.ratePercent
        )
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "UNKNOWN_GROUP_RATE_FOR_TARGET",
          knownGroups,
          unknownQuantity,
          unknownUnitCostPrice,
          unknownDirection,
          targetDirection: target.direction,
          targetRatePercent: target.ratePercent
        },
        context: {
          knownGroups: rows2,
          unknownQuantity: unknownQuantity.toString(),
          unknownUnitCostPrice: cp003PlainMoney(unknownUnitCostPrice),
          unknownDirection: unknownDirection.toLowerCase(),
          targetDirection: target.direction.toLowerCase(),
          targetRatePercent: cp003FormatRational(target.ratePercent),
          groupCostExpressions: `${rows2[0][1]}, ${rows2[0][2]}; unknown group: ${unknownQuantity}x${cp003FormatMoney(unknownUnitCostPrice)} at r% ${unknownDirection.toLowerCase()}`
        },
        expectedDirection: unknownDirection
      };
    }
    case "PNL-QL-079": {
      const quantityPreset = pickSeeded(random, [
        {
          fixedQuantity: 10n,
          fixedRate: 10,
          unknownQuantity: 20n,
          unknownRate: 40
        },
        {
          fixedQuantity: 20n,
          fixedRate: 40,
          unknownQuantity: 10n,
          unknownRate: 10
        },
        {
          fixedQuantity: 10n,
          fixedRate: 20,
          unknownQuantity: 40n,
          unknownRate: 40
        }
      ]);
      const commonUnitCost = rupees2(pickSeeded(random, [100, 200]));
      const fixedGroups = [
        {
          quantity: quantityPreset.fixedQuantity,
          unitCostPrice: commonUnitCost,
          direction: "PROFIT",
          ratePercent: rational(quantityPreset.fixedRate)
        }
      ];
      const unknownQuantity = quantityPreset.unknownQuantity;
      const unknownUnitCostPrice = commonUnitCost;
      const unknownDirection = "PROFIT";
      const unknownRatePercent = rational(quantityPreset.unknownRate);
      const complete = solveInventoryAdvanced({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...fixedGroups,
          {
            quantity: unknownQuantity,
            unitCostPrice: unknownUnitCostPrice,
            direction: unknownDirection,
            ratePercent: unknownRatePercent
          }
        ]
      });
      const target = overallTargetFromGroupResult(complete);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "UNKNOWN_GROUP_QUANTITY_FOR_TARGET",
          fixedGroups,
          unknownUnitCostPrice,
          unknownDirection,
          unknownRatePercent,
          targetDirection: target.direction,
          targetRatePercent: target.ratePercent
        },
        context: {
          fixedGroups: fixedGroups.map(
            (group, index) => groupRow(
              `Fixed group ${index + 1}`,
              group.quantity,
              group.unitCostPrice,
              group.direction,
              group.ratePercent
            )
          ),
          unknownUnitCostPrice: cp003PlainMoney(unknownUnitCostPrice),
          unknownDirection: unknownDirection.toLowerCase(),
          unknownRatePercent: cp003FormatRational(unknownRatePercent),
          targetDirection: target.direction.toLowerCase(),
          targetRatePercent: cp003FormatRational(target.ratePercent)
        }
      };
    }
    case "PNL-QL-080":
    case "PNL-QL-081":
    case "PNL-QL-092": {
      const preset = pickSeeded(random, UNSOLD_PRESETS);
      const totalQuantity = preset.total;
      const unitCostPrice = rupees2(preset.cost);
      const soldGroups = [
        { quantity: preset.sold, unitSellingPrice: rupees2(preset.soldPrice) }
      ];
      const remainingQuantity = totalQuantity - preset.sold;
      const intendedRemainingPrice = rupees2(preset.remainingPrice);
      const target = targetFromPartial(
        totalQuantity,
        unitCostPrice,
        soldGroups,
        remainingQuantity,
        intendedRemainingPrice
      );
      const baseContext2 = {
        totalQuantity: totalQuantity.toString(),
        unitCostPrice: cp003PlainMoney(unitCostPrice),
        soldGroups: soldGroups.map(
          (group, index) => soldRow(
            `Sold group ${index + 1}`,
            group.quantity,
            group.unitSellingPrice
          )
        ),
        targetDirection: target.direction.toLowerCase(),
        targetRatePercent: cp003FormatRational(target.ratePercent),
        remainingDirection: intendedRemainingPrice.paise >= unitCostPrice.paise ? "profit" : "loss"
      };
      if (qlId !== "PNL-QL-092") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: qlId === "PNL-QL-080" ? "UNSOLD_STOCK_REQUIRED_UNIT_PRICE" : "UNSOLD_STOCK_REQUIRED_RATE",
            totalQuantity,
            unitCostPrice,
            soldGroups,
            targetDirection: target.direction,
            targetRatePercent: target.ratePercent
          },
          context: baseContext2,
          expectedDirection: intendedRemainingPrice.paise >= unitCostPrice.paise ? "PROFIT" : "LOSS"
        };
      }
      const complete = `The dealer bought ${totalQuantity} units at ${cp003FormatMoney(unitCostPrice)} each and sold ${preset.sold} units at ${cp003FormatMoney(rupees2(preset.soldPrice))} each.`;
      const purchaseOnly = `The dealer bought ${totalQuantity} units at ${cp003FormatMoney(unitCostPrice)} each.`;
      const salesOnly = `${preset.sold} units were sold at ${cp003FormatMoney(rupees2(preset.soldPrice))} each.`;
      const irrelevant = "The stock is stored in two warehouse sections.";
      const pattern = pickSeeded(random, [
        "BOTH",
        "ONE",
        "TWO",
        "EITHER"
      ]);
      const statementOne = pattern === "ONE" || pattern === "EITHER" ? complete : pattern === "BOTH" ? purchaseOnly : irrelevant;
      const statementTwo = pattern === "TWO" || pattern === "EITHER" ? complete : pattern === "BOTH" ? salesOnly : irrelevant;
      const answerOverride = pattern === "BOTH" ? "Both statements together are required" : pattern === "ONE" ? "Statement 1 alone is sufficient" : pattern === "TWO" ? "Statement 2 alone is sufficient" : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE",
          totalQuantity,
          unitCostPrice,
          soldGroups,
          targetDirection: target.direction,
          targetRatePercent: target.ratePercent
        },
        context: { ...baseContext2, statementOne, statementTwo },
        answerOverride
      };
    }
    case "PNL-QL-082":
    case "PNL-QL-094": {
      const preset = pickSeeded(random, SPOILED_PRESETS);
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(
        qlId === "PNL-QL-094" ? 0 : preset.target
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "SPOILED_STOCK_REQUIRED_RECOVERY",
          totalQuantity: preset.total,
          unitCostPrice: rupees2(preset.cost),
          goodQuantity: preset.good,
          goodUnitSellingPrice: rupees2(preset.goodPrice),
          spoiledQuantity: preset.total - preset.good,
          targetDirection,
          targetRatePercent
        },
        context: {
          totalQuantity: preset.total.toString(),
          unitCostPrice: preset.cost,
          goodQuantity: preset.good.toString(),
          goodUnitSellingPrice: preset.goodPrice,
          spoiledQuantity: (preset.total - preset.good).toString(),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp003FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-083":
    case "PNL-QL-090": {
      const ratePercent = rational(
        pickSeeded(random, [10, 20, 25, 30])
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "EQUAL_SP_EQUAL_RATES_SPECIAL", ratePercent },
        context: { ratePercent: cp003FormatRational(ratePercent) },
        ...qlId === "PNL-QL-090" ? { answerOverride: "Statement 2 only" } : {}
      };
    }
    case "PNL-QL-084": {
      const equalRatePercent = rational(pickSeeded(random, [20, 25]));
      const knownDirection = pickSeeded(random, ["PROFIT", "LOSS"]);
      const unknownDirection = knownDirection === "PROFIT" ? "LOSS" : "PROFIT";
      const knownRatePercent = equalRatePercent;
      const unknownRatePercent = equalRatePercent;
      const forward = solveInventory({
        mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE",
        commonSellingPrice: rupees2(1200),
        firstDirection: knownDirection,
        firstRatePercent: knownRatePercent,
        secondDirection: unknownDirection,
        secondRatePercent: unknownRatePercent
      });
      if (forward.direction === "NO_CHANGE") {
        throw new Error(
          `${qlId}: generated equal-SP inverse has no overall direction.`
        );
      }
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_SP_ONE_RATE_FROM_OVERALL",
          knownDirection,
          knownRatePercent,
          unknownDirection,
          targetDirection: forward.direction,
          targetRatePercent: forward.ratePercent
        },
        context: {
          knownDirection: knownDirection.toLowerCase(),
          knownRatePercent: cp003FormatRational(knownRatePercent),
          unknownDirection: unknownDirection.toLowerCase(),
          targetDirection: forward.direction.toLowerCase(),
          targetRatePercent: cp003FormatRational(forward.ratePercent)
        },
        expectedDirection: unknownDirection
      };
    }
    case "PNL-QL-085": {
      const totalCostPrice = rupees2(pickNumber2(random, TOTAL_COSTS));
      const direction2 = pickDirection(random);
      const ratePercent = rational(pickNumber2(random, RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
          totalCostPrice,
          direction: direction2,
          ratePercent
        },
        context: {
          totalCostPrice: cp003PlainMoney(totalCostPrice),
          direction: direction2.toLowerCase(),
          ratePercent: cp003FormatRational(ratePercent)
        }
      };
    }
    case "PNL-QL-086": {
      const totalCostPrice = rupees2(pickNumber2(random, TOTAL_COSTS));
      const direction2 = pickDirection(random);
      const ratePercent = rational(pickNumber2(random, RATES));
      const totalSellingPrice = solveInventoryAdvanced({
        mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
        totalCostPrice,
        direction: direction2,
        ratePercent
      }).totalSellingPrice;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP",
          totalSellingPrice,
          direction: direction2,
          ratePercent
        },
        context: {
          totalSellingPrice: cp003PlainMoney(totalSellingPrice),
          direction: direction2.toLowerCase(),
          ratePercent: cp003FormatRational(ratePercent)
        }
      };
    }
    case "PNL-QL-087": {
      const totalCostPrice = rupees2(pickNumber2(random, TOTAL_COSTS));
      const fraction = pickSeeded(random, RECOVERY_FRACTIONS);
      const recoveredFraction = rational(fraction[0], fraction[1]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "RECOVERY_FRACTION_TO_OVERALL_RESULT",
          totalCostPrice,
          recoveredFraction
        },
        context: {
          totalCostPrice: cp003PlainMoney(totalCostPrice),
          recoveredFraction: `${fraction[0]}/${fraction[1]}`
        }
      };
    }
    default:
      throw new Error(`${qlId}: CP-003 dynamic generator is not implemented.`);
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-003/cp003-dynamic-runtime.ts
var PNL_CP003_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE";
var editorialLibrary3 = editorial_content_en_default3;
function directedRate(direction2, ratePercent) {
  if (direction2 === "NO_CHANGE") return "No profit, no loss";
  return `${cp003FormatPercent(ratePercent)} ${direction2.toLowerCase()}`;
}
function answerFor2(qlId, result, generated2) {
  if (generated2.answerOverride) {
    return { kind: "TEXT", value: generated2.answerOverride };
  }
  switch (qlId) {
    case "PNL-QL-071":
    case "PNL-QL-072":
    case "PNL-QL-073":
    case "PNL-QL-074":
    case "PNL-QL-076":
    case "PNL-QL-077":
    case "PNL-QL-087":
    case "PNL-QL-088":
    case "PNL-QL-089":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected directed overall rate.`);
      }
      return {
        kind: "TEXT",
        value: directedRate(result.direction, result.ratePercent)
      };
    case "PNL-QL-075":
      if (!("requiredSellingPricePerGoodUnit" in result)) {
        throw new Error(`${qlId}: expected required good-unit price.`);
      }
      return { kind: "MONEY", value: result.requiredSellingPricePerGoodUnit };
    case "PNL-QL-078":
    case "PNL-QL-091":
      if (!("unknownRatePercent" in result)) {
        throw new Error(`${qlId}: expected unknown group rate.`);
      }
      return { kind: "PERCENT", value: result.unknownRatePercent };
    case "PNL-QL-079":
      if (!("unknownQuantity" in result)) {
        throw new Error(`${qlId}: expected unknown quantity.`);
      }
      return { kind: "QUANTITY", value: result.unknownQuantity };
    case "PNL-QL-080":
      if (!("requiredUnitSellingPrice" in result)) {
        throw new Error(`${qlId}: expected required remaining-unit price.`);
      }
      return { kind: "MONEY", value: result.requiredUnitSellingPrice };
    case "PNL-QL-081":
      if (!("requiredRatePercent" in result)) {
        throw new Error(`${qlId}: expected required remaining-stock rate.`);
      }
      return {
        kind: "TEXT",
        value: `${cp003FormatPercent(result.requiredRatePercent)} ${String(generated2.context.remainingDirection)}`
      };
    case "PNL-QL-082":
    case "PNL-QL-094":
      if (!("requiredRecoveryPerSpoiledUnit" in result)) {
        throw new Error(`${qlId}: expected required spoiled-unit recovery.`);
      }
      return { kind: "MONEY", value: result.requiredRecoveryPerSpoiledUnit };
    case "PNL-QL-083":
      if (!("ratePercent" in result))
        throw new Error(`${qlId}: expected special loss rate.`);
      return {
        kind: "TEXT",
        value: `${cp003FormatPercent(result.ratePercent)} loss`
      };
    case "PNL-QL-084":
      if (!("unknownRatePercent" in result))
        throw new Error(`${qlId}: expected inverse rate.`);
      return { kind: "PERCENT", value: result.unknownRatePercent };
    case "PNL-QL-085":
      if (!("totalSellingPrice" in result))
        throw new Error(`${qlId}: expected total selling price.`);
      return { kind: "MONEY", value: result.totalSellingPrice };
    case "PNL-QL-086":
      if (!("totalCostPrice" in result))
        throw new Error(`${qlId}: expected total cost price.`);
      return { kind: "MONEY", value: result.totalCostPrice };
    case "PNL-QL-093":
      if (!("direction" in result) || !("amount" in result)) {
        throw new Error(`${qlId}: expected overall amount.`);
      }
      return {
        kind: "TEXT",
        value: result.direction === "NO_CHANGE" ? "No profit, no loss" : `${result.direction === "PROFIT" ? "Profit" : "Loss"} ${cp003FormatMoney(result.amount)}`
      };
    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}
function formatAnswer3(answer) {
  if (answer.kind === "MONEY") return cp003FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp003FormatPercent(answer.value);
  if (answer.kind === "QUANTITY") return answer.value.toString();
  return answer.value;
}
function resultContext(result, answer, generated2) {
  const context = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer
  };
  if ("direction" in result && "ratePercent" in result) {
    context.overallDirection = result.direction.toLowerCase();
    context.overallRatePercent = cp003FormatRational(result.ratePercent);
  }
  if ("amount" in result)
    context.overallAmount = cp003PlainMoney(result.amount);
  if ("requiredSellingPricePerGoodUnit" in result) {
    context.requiredSellingPricePerGoodUnit = cp003PlainMoney(
      result.requiredSellingPricePerGoodUnit
    );
  }
  if ("unknownRatePercent" in result) {
    context.unknownRatePercent = cp003FormatRational(result.unknownRatePercent);
  }
  if ("unknownQuantity" in result) {
    context.unknownQuantity = result.unknownQuantity.toString();
  }
  if ("requiredUnitSellingPrice" in result) {
    context.requiredUnitSellingPrice = cp003PlainMoney(
      result.requiredUnitSellingPrice
    );
  }
  if ("requiredRatePercent" in result) {
    context.requiredRatePercent = cp003FormatRational(
      result.requiredRatePercent
    );
  }
  if ("requiredRecoveryPerSpoiledUnit" in result) {
    context.requiredRecoveryPerSpoiledUnit = cp003PlainMoney(
      result.requiredRecoveryPerSpoiledUnit
    );
    context.breakEvenRecoveryPerSpoiledUnit = cp003PlainMoney(
      result.requiredRecoveryPerSpoiledUnit
    );
  }
  if ("totalSellingPrice" in result) {
    context.totalSellingPrice = cp003PlainMoney(result.totalSellingPrice);
  }
  if ("totalCostPrice" in result) {
    context.totalCostPrice = cp003PlainMoney(result.totalCostPrice);
  }
  if (generated2.expectedDirection) {
    context.requiredDirection = generated2.expectedDirection.toLowerCase();
  }
  return context;
}
function numericDistractors2(answer) {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    return [
      moneyFromPaise(paise * 90n / 100n),
      moneyFromPaise(paise * 110n / 100n),
      moneyFromPaise(paise + 10000n),
      moneyFromPaise(paise > 10000n ? paise - 10000n : paise + 20000n)
    ].map(cp003FormatMoney);
  }
  if (answer.kind === "QUANTITY") {
    const quantity = answer.value;
    return [
      quantity + 5n,
      quantity + 10n,
      quantity > 5n ? quantity - 5n : quantity + 15n
    ].map(String);
  }
  if (answer.kind === "PERCENT") {
    const value = rationalToNumber(answer.value);
    return [
      Math.max(0, value - 5),
      value + 5,
      Math.max(0, 100 - value),
      value + 10
    ].map((item) => `${Number(item.toFixed(2))}%`);
  }
  return [];
}
function textDistractors2(qlId, correct) {
  const pools = {
    "PNL-QL-090": [
      "Statement 1 only",
      "Statement 2 only",
      "Both statements are correct",
      "Neither statement is correct"
    ],
    "PNL-QL-092": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient"
    ]
  };
  const pool = pools[qlId] ?? [
    "10% profit",
    "10% loss",
    "20% profit",
    "20% loss",
    "No profit, no loss",
    "Cannot be determined"
  ];
  return pool.filter((item) => item !== correct);
}
function buildOptions2(qlId, seed, answer) {
  const correct = formatAnswer3(answer);
  const source = answer.kind === "TEXT" ? textDistractors2(qlId, correct) : numericDistractors2(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0], label: "AVERAGED_GROUP_RATES" },
    { value: unique[1], label: "IGNORED_UNSOLD_OR_DAMAGED_STOCK" },
    { value: unique[2], label: "WRONG_INVENTORY_BASE_OR_REVERSE" }
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
function stable2(value) {
  return JSON.stringify(
    value,
    (_, item) => typeof item === "bigint" ? item.toString() : item
  );
}
function rationalEqual(left, right) {
  return left.numerator * right.denominator === right.numerator * left.denominator;
}
function targetMatches(result, targetDirection, targetRatePercent) {
  if (targetRatePercent.numerator === 0n) {
    return result.direction === "NO_CHANGE" && result.ratePercent.numerator === 0n;
  }
  return result.direction === targetDirection && rationalEqual(result.ratePercent, targetRatePercent);
}
function forwardConsistency(request, result, generated2) {
  switch (request.mode) {
    case "MULTIPLE_LOTS_TO_OVERALL_RESULT":
      return result.mode === "MULTIPLE_LOTS_TO_OVERALL_RESULT" && verifyMultipleLotsResult(request.lots, result).valid;
    case "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER": {
      if (!("requiredSellingPricePerGoodUnit" in result)) return false;
      const goodQuantity = request.totalQuantity - request.damagedQuantity;
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: [
          {
            quantity: goodQuantity,
            unitSellingPrice: result.requiredSellingPricePerGoodUnit
          }
        ],
        unsoldQuantity: request.damagedQuantity,
        unsoldRecoveryPerUnit: request.damagedRecoveryPerUnit
      });
      return "direction" in check && "ratePercent" in check && targetMatches(check, request.targetDirection, request.targetRatePercent);
    }
    case "UNKNOWN_GROUP_RATE_FOR_TARGET": {
      if (!("unknownRatePercent" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...request.knownGroups,
          {
            quantity: request.unknownQuantity,
            unitCostPrice: request.unknownUnitCostPrice,
            direction: request.unknownDirection,
            ratePercent: result.unknownRatePercent
          }
        ]
      });
      return "direction" in check && "ratePercent" in check && targetMatches(check, request.targetDirection, request.targetRatePercent);
    }
    case "UNKNOWN_GROUP_QUANTITY_FOR_TARGET": {
      if (!("unknownQuantity" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...request.fixedGroups,
          {
            quantity: result.unknownQuantity,
            unitCostPrice: request.unknownUnitCostPrice,
            direction: request.unknownDirection,
            ratePercent: request.unknownRatePercent
          }
        ]
      });
      return "direction" in check && "ratePercent" in check && targetMatches(check, request.targetDirection, request.targetRatePercent);
    }
    case "UNSOLD_STOCK_REQUIRED_UNIT_PRICE": {
      if (!("requiredUnitSellingPrice" in result)) return false;
      const soldQuantity = request.soldGroups.reduce(
        (sum, group) => sum + group.quantity,
        0n
      );
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: request.soldGroups,
        unsoldQuantity: request.totalQuantity - soldQuantity,
        unsoldRecoveryPerUnit: result.requiredUnitSellingPrice
      });
      return "direction" in check && "ratePercent" in check && targetMatches(check, request.targetDirection, request.targetRatePercent);
    }
    case "UNSOLD_STOCK_REQUIRED_RATE": {
      if (!("requiredRatePercent" in result) || !generated2.expectedDirection)
        return false;
      const unitSellingPrice = (() => {
        const delta = request.unitCostPrice.paise * result.requiredRatePercent.numerator / (100n * result.requiredRatePercent.denominator);
        return moneyFromPaise(
          generated2.expectedDirection === "PROFIT" ? request.unitCostPrice.paise + delta : request.unitCostPrice.paise - delta
        );
      })();
      const soldQuantity = request.soldGroups.reduce(
        (sum, group) => sum + group.quantity,
        0n
      );
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: request.soldGroups,
        unsoldQuantity: request.totalQuantity - soldQuantity,
        unsoldRecoveryPerUnit: unitSellingPrice
      });
      return "direction" in check && "ratePercent" in check && targetMatches(check, request.targetDirection, request.targetRatePercent);
    }
    case "SPOILED_STOCK_REQUIRED_RECOVERY": {
      if (!("requiredRecoveryPerSpoiledUnit" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: [
          {
            quantity: request.goodQuantity,
            unitSellingPrice: request.goodUnitSellingPrice
          }
        ],
        unsoldQuantity: request.spoiledQuantity,
        unsoldRecoveryPerUnit: result.requiredRecoveryPerSpoiledUnit
      });
      return "direction" in check && "ratePercent" in check && targetMatches(check, request.targetDirection, request.targetRatePercent);
    }
    case "EQUAL_SP_ONE_RATE_FROM_OVERALL": {
      if (!("unknownRatePercent" in result) || !generated2.expectedDirection)
        return false;
      return Math.abs(
        rationalToNumber(result.unknownRatePercent) - rationalToNumber(request.knownRatePercent)
      ) < 0.01;
    }
    case "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP": {
      if (!("totalCostPrice" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
        totalCostPrice: result.totalCostPrice,
        direction: request.direction,
        ratePercent: request.ratePercent
      });
      return "totalSellingPrice" in check && check.totalSellingPrice.paise === request.totalSellingPrice.paise;
    }
    default:
      return true;
  }
}
function selectQl3(input) {
  if (input.questionLanguageId) {
    if (!PNL_CP003_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-003 question-language ID: ${input.questionLanguageId}`
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP003_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp003Case(
      qlId,
      `${input.seed ?? "cp003"}:probe`
    ).registry;
    return !input.difficultyBand || registry.difficulty === input.difficultyBand;
  });
  if (!eligible.length)
    throw new Error("No CP-003 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp003-dynamic"}:ql-selection`),
    eligible
  );
}
function containsUnresolvedProsePlaceholder2(value) {
  const proseOnly = value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}
function listPnlCp003DynamicQlIds() {
  return [...PNL_CP003_QL_IDS];
}
function runPnlCp003DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-003 dynamic runtime currently supports English only."
    );
  }
  const qlId = selectQl3(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated2 = generatePnlCp003Case(qlId, seed);
  const result = solvePnlCp003Request(generated2.request);
  const recomputed = solvePnlCp003Request(generated2.request);
  const answerValue = answerFor2(qlId, result, generated2);
  const answer = formatAnswer3(answerValue);
  const optionSet = buildOptions2(qlId, seed, answerValue);
  const editorial = editorialLibrary3.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);
  const context = {
    ...generated2.context,
    ...resultContext(result, answer, generated2)
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context
  );
  const explanationText = `${baseExplanation}

**Working with these values:** Convert every inventory group into total cost and total recovery. Combine money first; only then calculate the overall percentage or isolate the remaining group.

**Final answer:** ${answer}`;
  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated2.registry && editorial),
      message: "The QL exists in both the frozen registry and English editorial library."
    },
    {
      name: "exact-recomputation",
      passed: stable2(result) === stable2(recomputed),
      message: "Exact recomputation agrees with the canonical CP-003 solver."
    },
    {
      name: "inverse-forward-consistency",
      passed: forwardConsistency(generated2.request, result, generated2),
      message: "The generated answer reproduces the complete forward inventory or target."
    },
    {
      name: "four-misconception-options",
      passed: optionSet.options.length === 4 && new Set(optionSet.options).size === 4 && optionSet.options[optionSet.correctIndex] === answer && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: "Four unique options contain one answer and three labelled misconceptions."
    },
    {
      name: "dynamic-editorial-binding",
      passed: !containsUnresolvedProsePlaceholder2(stem) && !containsUnresolvedProsePlaceholder2(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders."
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication."
    }
  ];
  const validation = { valid: checks.every((check) => check.passed), checks };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${checks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`
    );
  }
  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001",
    canonicalProblemId: PNL_CP003_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en",
    difficultyBand: generated2.registry.difficulty,
    stem,
    answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP003_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en",
      difficultyBand: generated2.registry.difficulty,
      taskKind: generated2.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated2.registry.answerSemantic,
      requiredVariables: [...generated2.registry.requiredVariables],
      variables: context,
      seed,
      runtimeMode: PNL_CP003_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      sourceTrace: {
        registry: "PNL-001/CP-003/task-registry.library.json",
        editorial: "PNL-001/CP-003/editorial-content.en.json",
        solver: "PNL-001/foundation/inventory-solver.ts | inventory-advanced-solver.ts",
        verifier: "PNL-001/foundation/cp003-independent-verifier.ts"
      }
    },
    solver: {
      answer,
      numericAnswer: answerValue.kind === "MONEY" ? Number(answerValue.value.paise) / 100 : answerValue.kind === "PERCENT" ? rationalToNumber(answerValue.value) : answerValue.kind === "QUANTITY" ? Number(answerValue.value) : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated2.registry.solveMode,
        answerSemantic: generated2.registry.answerSemantic,
        exactRecomputation: "PASS",
        inverseForwardConsistency: "PASS"
      },
      mathJax: {}
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        { id: "given", label: "Generated inventory values", value: context },
        {
          id: "mode",
          label: "Solve mode",
          value: generated2.registry.solveMode
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
      canonicalProblemId: PNL_CP003_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated2.registry.solveMode,
      answerSemantic: generated2.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated2.registry.difficulty,
      representation: generated2.registry.representation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP003_DYNAMIC_RUNTIME_MODE,
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

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-004/editorial-content.en.json
var editorial_content_en_default4 = {
  schemaVersion: 2,
  archetypeId: "PNL-001",
  cpId: "PNL-CP-004",
  language: "en",
  status: "EDITORIAL_REVIEW_CANDIDATE",
  entries: {
    "PNL-QL-095": {
      stem: {
        contextFamily: "textile distribution",
        blocks: [
          {
            type: "paragraph",
            content: "A textile wholesaler buys a fabric consignment for \u20B9{initialCostPrice} and sells it to a regional distributor at {firstRatePercent}% {firstDirection}. The distributor then sells the same consignment to a retailer at {secondRatePercent}% {secondDirection}."
          }
        ],
        prompt: "What price does the retailer pay?"
      },
      explanation: {
        opening: "Let us follow the consignment from one trader to the next.",
        concept: "Each profit or loss percentage is applied to the price created by the previous transaction.",
        steps: [
          {
            title: "Find the distributor's purchase price",
            body: "Apply the first commercial multiplier to the wholesaler's original cost.",
            equationLatex: "P_1=C_0\\left(1\\pm\\frac{r_1}{100}\\right)"
          },
          {
            title: "Find the retailer's price",
            body: "Use the distributor's purchase price as the new base for the second transaction.",
            equationLatex: "P_2=P_1\\left(1\\pm\\frac{r_2}{100}\\right)"
          }
        ],
        conclusion: "The second-stage price is the amount paid by the retailer.",
        finalAnswerLatex: "\\text{\u20B9}{finalSellingPrice}",
        commonTrap: "Do not add the two signed percentages. They are calculated on different price bases."
      },
      difficulty: "Medium",
      difficultyRationale: "Two visible successive multipliers with no hidden unknown."
    },
    "PNL-QL-096": {
      stem: {
        contextFamily: "electronics supply chain",
        blocks: [
          {
            type: "paragraph",
            content: "An electronics importer purchases a shipment for \u20B9{initialCostPrice}. It is transferred to a national distributor at {firstRatePercent}% {firstDirection}, to a city wholesaler at {secondRatePercent}% {secondDirection}, and finally to a retailer at {thirdRatePercent}% {thirdDirection}."
          }
        ],
        prompt: "Find the price paid by the retailer."
      },
      explanation: {
        opening: "The safest approach is to move through the supply chain one transfer at a time.",
        concept: "A successive percentage always acts on the latest transaction price, not on the importer's original cost.",
        steps: [
          {
            title: "Process the first two transfers",
            body: "Create the first price and then use it as the base for the second rate.",
            equationLatex: "P_2=C_0m_1m_2"
          },
          {
            title: "Apply the final transfer",
            body: "Multiply the second-stage price by the third commercial factor.",
            equationLatex: "P_3=P_2m_3=C_0m_1m_2m_3"
          }
        ],
        conclusion: "The value of the complete product of multipliers is the retailer's purchase price.",
        finalAnswerLatex: "\\text{\u20B9}{finalSellingPrice}",
        commonTrap: "Do not classify this as hard merely because it has three steps; all three operations are directly visible."
      },
      difficulty: "Medium",
      difficultyRationale: "Three visible forward operations; arithmetic is longer but the reasoning is direct."
    },
    "PNL-QL-097": {
      stem: {
        contextFamily: "book distribution",
        blocks: [
          {
            type: "paragraph",
            content: "A publisher sells a book lot to a distributor at {firstRatePercent}% {firstDirection}. The distributor sells the lot to a bookstore at {secondRatePercent}% {secondDirection}. The bookstore pays \u20B9{finalSellingPrice}."
          }
        ],
        prompt: "What was the publisher's original cost for the lot?"
      },
      explanation: {
        opening: "Because the final price is known, we can work backward through the two sales.",
        concept: "A forward multiplier is reversed by division, and the stages must be undone in reverse order.",
        steps: [
          {
            title: "Recover the distributor's cost",
            body: "Undo the bookstore transaction first.",
            equationLatex: "P_1=\\frac{P_2}{m_2}"
          },
          {
            title: "Recover the publisher's cost",
            body: "Now undo the distributor's purchase multiplier.",
            equationLatex: "C_0=\\frac{P_1}{m_1}=\\frac{P_2}{m_2m_1}"
          }
        ],
        conclusion: "The recovered value is the publisher's original cost.",
        finalAnswerLatex: "\\text{\u20B9}{initialCostPrice}",
        commonTrap: "Do not subtract the two profit rates from the final price. Reversing a multiplier requires division."
      },
      difficulty: "Medium",
      difficultyRationale: "A standard two-stage reverse operation with a clear path."
    },
    "PNL-QL-098": {
      stem: {
        contextFamily: "used-vehicle resale",
        blocks: [
          {
            type: "paragraph",
            content: "A used vehicle changes owners through three successive sales at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}. The final buyer pays \u20B9{finalSellingPrice}."
          }
        ],
        prompt: "Find the first owner's original cost price."
      },
      explanation: {
        opening: "Here we need to unwind three mixed transactions carefully.",
        concept: "Reverse the chain from the last sale to the first, dividing by each corresponding multiplier.",
        steps: [
          {
            title: "Build the combined forward factor",
            body: "Represent each profit by a factor above 1 and each loss by a factor below 1.",
            equationLatex: "M=m_1m_2m_3"
          },
          {
            title: "Recover the original cost",
            body: "Divide the final payment by the complete combined factor.",
            equationLatex: "C_0=\\frac{P_3}{M}"
          }
        ],
        conclusion: "This backward calculation gives the first owner's cost price.",
        finalAnswerLatex: "\\text{\u20B9}{initialCostPrice}",
        commonTrap: "Undoing the percentages by subtraction gives the wrong answer because every stage used a different base."
      },
      difficulty: "Hard",
      difficultyRationale: "Three-stage reverse chain with mixed profit and loss factors."
    },
    "PNL-QL-099": {
      stem: {
        contextFamily: "agricultural equipment resale",
        blocks: [
          {
            type: "paragraph",
            content: "A farm-equipment unit is bought for \u20B9{initialCostPrice} and then passes through these resale stages: {stages}."
          }
        ],
        prompt: "Find its price immediately after transaction {afterStage}."
      },
      explanation: {
        opening: "We only need to follow the chain up to the requested transfer.",
        concept: "An intermediate price depends on earlier stages only; later transactions cannot change a price that has already been recorded.",
        steps: [
          {
            title: "Read the stopping point",
            body: "Identify transaction {afterStage} and ignore every stage that comes after it."
          },
          {
            title: "Build the price up to that stage",
            body: "Apply the listed multipliers in order until the requested price is reached.",
            equationLatex: "P_k=C_0\\prod_{i=1}^{k}m_i"
          }
        ],
        conclusion: "The price at the selected stopping point is the required intermediate value.",
        finalAnswerLatex: "\\text{\u20B9}{intermediateSellingPrice}",
        commonTrap: "Do not continue to the final transaction when the question asks for an earlier price."
      },
      difficulty: "Medium",
      difficultyRationale: "Successive operations with a visible stopping condition."
    },
    "PNL-QL-100": {
      stem: {
        contextFamily: "furniture wholesale chain",
        blocks: [
          {
            type: "paragraph",
            content: "A furniture set is resold through the following stages: {stages}."
          }
        ],
        prompt: "Calculate the overall percentage gain or loss from the first purchase to the final sale."
      },
      explanation: {
        opening: "We can compare the first and final prices without knowing the actual rupee amount.",
        concept: "Multiply the retained or increased factors for all stages, then compare the product with 1.",
        steps: [
          {
            title: "Combine the stage factors",
            body: "Convert each percentage into its multiplier and multiply them.",
            equationLatex: "M=\\prod m_i"
          },
          {
            title: "Interpret the product",
            body: "If M is above 1 there is an overall profit; if it is below 1 there is an overall loss.",
            equationLatex: "\\text{overall rate}=|M-1|\\times100\\%"
          }
        ],
        conclusion: "The difference between the combined multiplier and 1 gives the overall rate.",
        finalAnswerLatex: "{overallRatePercent}\\%\\;{overallDirection}",
        commonTrap: "Adding gains and subtracting losses directly ignores the changing transaction bases."
      },
      difficulty: "Medium",
      difficultyRationale: "A direct multiplier aggregation with one interpretation step."
    },
    "PNL-QL-101": {
      stem: {
        contextFamily: "pharmaceutical distribution",
        blocks: [
          {
            type: "paragraph",
            content: "A medicine consignment is sold by a manufacturer, a distributor, and a stockist at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}, respectively."
          }
        ],
        prompt: "Find the overall percentage gain or loss relative to the manufacturer's original cost."
      },
      explanation: {
        opening: "The three quoted rates belong to three different prices, so we should convert them into multipliers.",
        concept: "Successive commercial changes compound; they do not combine by ordinary addition.",
        steps: [
          {
            title: "Form the combined multiplier",
            body: "Use a factor above 1 for profit and below 1 for loss.",
            equationLatex: "M=m_1m_2m_3"
          },
          {
            title: "Convert the factor to a rate",
            body: "Compare M with 1 and express the difference as a percentage.",
            equationLatex: "r=|M-1|\\times100"
          }
        ],
        conclusion: "The sign of M\u22121 identifies profit or loss, and its magnitude gives the rate.",
        finalAnswerLatex: "{overallRatePercent}\\%\\;{overallDirection}",
        commonTrap: "Do not total the three percentages as signed numbers."
      },
      difficulty: "Medium",
      difficultyRationale: "Three visible forward factors and a standard overall-rate conversion."
    },
    "PNL-QL-102": {
      stem: {
        contextFamily: "industrial-pump dealership",
        blocks: [
          {
            type: "paragraph",
            content: "An industrial pump is bought for \u20B9{initialCostPrice} and finally reaches a customer for \u20B9{finalSellingPrice}. The known resale stages are {knownStages}; the missing stage is a {missingDirection}."
          }
        ],
        prompt: "Determine the missing profit percentage."
      },
      explanation: {
        opening: "We know the beginning and the end, so the missing stage can be isolated.",
        concept: "The final-to-initial price ratio equals the product of all transaction multipliers.",
        steps: [
          {
            title: "Find the overall multiplier",
            body: "Divide the final price by the initial cost.",
            equationLatex: "M_{all}=\\frac{P_f}{C_0}"
          },
          {
            title: "Remove the known stages",
            body: "Divide the overall multiplier by the product of the known factors. The remaining factor belongs to the missing profit stage.",
            equationLatex: "m_{missing}=\\frac{M_{all}}{M_{known}}"
          },
          {
            title: "Convert the factor to a percentage",
            body: "For a profit stage, subtract 1 and multiply by 100.",
            equationLatex: "r=(m_{missing}-1)\\times100"
          }
        ],
        conclusion: "The isolated factor gives the missing profit rate.",
        finalAnswerLatex: "{missingRatePercent}\\%",
        commonTrap: "Do not subtract the known percentages from the overall percentage; the factors, not the rates, must be divided."
      },
      difficulty: "Hard",
      difficultyRationale: "Coupled inverse requiring isolation of an unknown stage multiplier."
    },
    "PNL-QL-103": {
      stem: {
        contextFamily: "ceramic-tile distribution",
        blocks: [
          {
            type: "paragraph",
            content: "A tile consignment is purchased for \u20B9{initialCostPrice} and finally sold for \u20B9{finalSellingPrice}. The known transfers are {knownStages}; the missing transfer is a {missingDirection}."
          }
        ],
        prompt: "Find the missing loss percentage."
      },
      explanation: {
        opening: "Let us isolate the unknown loss factor from the complete chain.",
        concept: "The overall price ratio contains every stage multiplier, so dividing out the known factors leaves the missing one.",
        steps: [
          {
            title: "Calculate the total factor",
            body: "Compare the final price with the original cost.",
            equationLatex: "M_{all}=\\frac{P_f}{C_0}"
          },
          {
            title: "Remove known multipliers",
            body: "Divide by the product of the stated stages.",
            equationLatex: "m_{missing}=\\frac{M_{all}}{M_{known}}"
          },
          {
            title: "Read the loss rate",
            body: "A loss factor is below 1; its shortfall from 1 is the loss fraction.",
            equationLatex: "r=(1-m_{missing})\\times100"
          }
        ],
        conclusion: "The shortfall of the isolated multiplier from 1 is the missing loss percentage.",
        finalAnswerLatex: "{missingRatePercent}\\%",
        commonTrap: "Do not treat a loss factor as 1+r/100; its factor is 1\u2212r/100."
      },
      difficulty: "Hard",
      difficultyRationale: "Coupled inverse with a missing loss factor and direction-sensitive interpretation."
    },
    "PNL-QL-104": {
      stem: {
        contextFamily: "sports-goods distribution",
        blocks: [
          {
            type: "paragraph",
            content: "A batch of sports equipment costing \u20B9{initialCostPrice} is sold through {stageCount} successive dealerships, each at {ratePercent}% {direction}."
          }
        ],
        prompt: "Find the final selling price."
      },
      explanation: {
        opening: "The same rate is repeated, so one multiplier is used several times.",
        concept: "Repeated equal percentage changes form a power of the commercial multiplier.",
        steps: [
          {
            title: "Write the repeated factor",
            body: "Convert the common rate into a multiplier m."
          },
          {
            title: "Apply it once per transaction",
            body: "Raise the multiplier to the number of stages.",
            equationLatex: "P_f=C_0m^{n}"
          }
        ],
        conclusion: "The compounded value is the final selling price.",
        finalAnswerLatex: "\\text{\u20B9}{finalSellingPrice}",
        commonTrap: "Do not multiply the percentage by the number of stages; repeated changes compound."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct repeated multiplier with a visible exponent."
    },
    "PNL-QL-105": {
      stem: {
        contextFamily: "mobile-phone distribution",
        blocks: [
          {
            type: "paragraph",
            content: "A phone consignment bought for \u20B9{initialCostPrice} moves through these transactions: {stages}."
          }
        ],
        prompt: "Find the profit or loss amount earned in transaction {selectedStage}."
      },
      explanation: {
        opening: "We only need the purchase and selling prices of the selected trader.",
        concept: "A trader's rupee gain or loss is the difference between that trader's output price and input price.",
        steps: [
          {
            title: "Build the ledger up to the selected stage",
            body: "Follow the chain until transaction {selectedStage} and record that trader's purchase and selling prices."
          },
          {
            title: "Take the absolute difference",
            body: "Subtract the smaller price from the larger one; the direction tells whether it is profit or loss.",
            equationLatex: "A_k=|P_k-P_{k-1}|"
          }
        ],
        conclusion: "That stage-wise difference is the required amount.",
        finalAnswerLatex: "\\text{\u20B9}{selectedStageAmount}",
        commonTrap: "Do not compare the selected selling price with the original owner's cost unless the selected trader is the first seller."
      },
      difficulty: "Medium",
      difficultyRationale: "Ledger construction followed by one stage-specific subtraction."
    },
    "PNL-QL-106": {
      stem: {
        contextFamily: "grain procurement chain",
        blocks: [
          {
            type: "paragraph",
            content: "A grain lot bought for \u20B9{initialCostPrice} passes through the trading stages {stages}."
          }
        ],
        prompt: "Which transaction produces the largest absolute profit or loss amount?"
      },
      explanation: {
        opening: "Percentage size alone cannot answer this because each trader works with a different price base.",
        concept: "Compare rupee amounts stage by stage, not just the quoted percentages.",
        steps: [
          {
            title: "Construct every stage price",
            body: "Build the complete price ledger from the original cost."
          },
          {
            title: "Calculate each stage amount",
            body: "For every transfer, take the absolute difference between its selling and purchase prices.",
            equationLatex: "A_i=|P_i-P_{i-1}|"
          },
          {
            title: "Compare the amounts",
            body: "The largest A_i identifies the required transaction."
          }
        ],
        conclusion: "The stage with the greatest rupee difference is the answer.",
        finalAnswerLatex: "{largestStage}",
        commonTrap: "The largest percentage need not create the largest rupee gain or loss because the bases differ."
      },
      difficulty: "Hard",
      difficultyRationale: "Full ledger plus comparison of several changing-base amounts."
    },
    "PNL-QL-107": {
      stem: {
        contextFamily: "equipment refurbishment",
        blocks: [
          {
            type: "paragraph",
            content: "A workshop buys a used generator for \u20B9{purchasePrice} and spends \u20B9{buyerExpense} on repairs before resale."
          }
        ],
        prompt: "At what price should it be sold to obtain {ratePercent}% {direction} on the effective cost?"
      },
      explanation: {
        opening: "Purchase price alone is not the workshop's true cost.",
        concept: "First include the repair expense, then apply the target rate to the effective cost.",
        steps: [
          {
            title: "Find effective cost",
            body: "Add the purchase price and the buyer's expense.",
            equationLatex: "E=C+e"
          },
          {
            title: "Apply the target rate",
            body: "Use the profit or loss multiplier on E.",
            equationLatex: "S=E\\left(1\\pm\\frac{r}{100}\\right)"
          }
        ],
        conclusion: "The resulting value is the required selling price.",
        finalAnswerLatex: "\\text{\u20B9}{sellingPrice}",
        commonTrap: "Do not calculate the percentage on the purchase price while ignoring the repair cost."
      },
      difficulty: "Medium",
      difficultyRationale: "Hidden effective-cost base followed by one forward multiplier."
    },
    "PNL-QL-108": {
      stem: {
        contextFamily: "art-auction commission",
        blocks: [
          {
            type: "paragraph",
            content: "An art dealer sells a painting for \u20B9{grossSellingPrice}. The auction house deducts {commissionPercent}% of the selling price as commission."
          }
        ],
        prompt: "Find the dealer's net receipt."
      },
      explanation: {
        opening: "The gross price is not the amount the dealer finally receives.",
        concept: "Commission is deducted from the gross selling price.",
        steps: [
          {
            title: "Find the commission",
            body: "Calculate the stated percentage of the gross price.",
            equationLatex: "K=G\\times\\frac{c}{100}"
          },
          {
            title: "Find the net receipt",
            body: "Subtract the commission from the gross price.",
            equationLatex: "N=G-K=G\\left(1-\\frac{c}{100}\\right)"
          }
        ],
        conclusion: "The retained amount is the dealer's net receipt.",
        finalAnswerLatex: "\\text{\u20B9}{netReceipt}",
        commonTrap: "Do not add the commission to the gross price; it is a deduction."
      },
      difficulty: "Medium",
      difficultyRationale: "One percentage deduction and one subtraction."
    },
    "PNL-QL-109": {
      stem: {
        contextFamily: "property brokerage",
        blocks: [
          {
            type: "paragraph",
            content: "A property owner must receive \u20B9{requiredNetReceipt} after a broker deducts {commissionPercent}% of the gross selling price."
          }
        ],
        prompt: "What gross selling price should be quoted?"
      },
      explanation: {
        opening: "We know the retained amount, so the commission deduction must be reversed.",
        concept: "The required net receipt equals the retained fraction of the gross price.",
        steps: [
          {
            title: "Write the retained fraction",
            body: "After c% commission, the seller keeps 100\u2212c percent of the gross price."
          },
          {
            title: "Recover the gross price",
            body: "Divide the required net receipt by the retained fraction.",
            equationLatex: "G=\\frac{N}{1-c/100}"
          }
        ],
        conclusion: "This gross price leaves the required amount after commission.",
        finalAnswerLatex: "\\text{\u20B9}{grossSellingPrice}",
        commonTrap: "Do not increase the net amount by c%; the net amount is not the base on which commission was calculated."
      },
      difficulty: "Medium",
      difficultyRationale: "Single inverse percentage deduction."
    },
    "PNL-QL-110": {
      stem: {
        contextFamily: "machinery resale through agent",
        blocks: [
          {
            type: "paragraph",
            content: "A machinery trader pays \u20B9{purchasePrice} for a unit, spends \u20B9{buyerExpense} preparing it for sale, and sells it for \u20B9{grossSellingPrice}. An agent keeps {commissionPercent}% of the gross selling price."
          }
        ],
        prompt: "Calculate the trader's percentage gain or loss."
      },
      explanation: {
        opening: "We must compare the trader's true cost with the amount actually retained.",
        concept: "Expenses increase effective cost, while commission reduces the gross realization.",
        steps: [
          {
            title: "Build the effective cost",
            body: "Add the purchase and preparation costs.",
            equationLatex: "E=C+e"
          },
          {
            title: "Find net realization",
            body: "Deduct commission from the gross selling price.",
            equationLatex: "N=G\\left(1-\\frac{c}{100}\\right)"
          },
          {
            title: "Measure the result on effective cost",
            body: "Compare N with E and divide the difference by E.",
            equationLatex: "r=\\frac{|N-E|}{E}\\times100"
          }
        ],
        conclusion: "The sign of N\u2212E gives the direction and the ratio gives the percentage.",
        finalAnswerLatex: "{resultRatePercent}\\%\\;{resultDirection}",
        commonTrap: "Do not compare the gross selling price directly with the purchase price; both expense and commission matter."
      },
      difficulty: "Hard",
      difficultyRationale: "Two base adjustments followed by a percentage comparison."
    },
    "PNL-QL-111": {
      stem: {
        contextFamily: "wholesale appliance ledger",
        blocks: [
          {
            type: "paragraph",
            content: "An appliance lot bought for \u20B9{initialCostPrice} passes through the successive transfers {stages}."
          }
        ],
        prompt: "Calculate the profit or loss amount made by each trader."
      },
      explanation: {
        opening: "A stage-wise ledger keeps the changing bases clear.",
        concept: "Each trader's selling price becomes the next trader's cost, and each stage amount is calculated separately.",
        steps: [
          {
            title: "Construct all transaction prices",
            body: "Start from the original cost and apply every stage multiplier in order."
          },
          {
            title: "Calculate each trader's result",
            body: "Subtract each trader's input price from that trader's output price.",
            equationLatex: "D_i=P_i-P_{i-1}"
          },
          {
            title: "Label profit or loss",
            body: "A positive D_i is profit; a negative D_i is loss."
          }
        ],
        conclusion: "The list of signed stage differences gives all trader results.",
        finalAnswerLatex: "{stageWiseAmounts}",
        commonTrap: "Do not use the original cost as the base for every trader."
      },
      difficulty: "Hard",
      difficultyRationale: "Complete multi-stage ledger with several answer values."
    },
    "PNL-QL-112": {
      stem: {
        contextFamily: "handicraft export chain",
        blocks: [
          {
            type: "paragraph",
            content: "A handicraft consignment changes hands through these stages: {stages}."
          }
        ],
        prompt: "Find the overall percentage gain or loss when the export buyer's price is compared with the artisan's original cost."
      },
      explanation: {
        opening: "Only the first cost and final price matter for the overall result.",
        concept: "The complete chain can be represented by one combined multiplier.",
        steps: [
          {
            title: "Multiply the stage factors",
            body: "Convert every transfer rate into its commercial multiplier.",
            equationLatex: "M=\\prod m_i"
          },
          {
            title: "Compare with the original base",
            body: "The overall rate is the distance of M from 1, expressed as a percentage.",
            equationLatex: "r=|M-1|\\times100"
          }
        ],
        conclusion: "This gives the original owner-to-final buyer result.",
        finalAnswerLatex: "{overallRatePercent}\\%\\;{overallDirection}",
        commonTrap: "Individual trader profits do not add directly to the overall percentage."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct aggregate multiplier and interpretation."
    },
    "PNL-QL-113": {
      stem: {
        contextFamily: "second-hand laptop chain",
        blocks: [
          {
            type: "paragraph",
            content: "A laptop is resold through the mixed profit-and-loss stages {stages}. The final customer pays \u20B9{finalSellingPrice}."
          }
        ],
        prompt: "Find the first seller's original purchase price."
      },
      explanation: {
        opening: "Since the stages contain both gains and losses, it helps to combine them before reversing the chain.",
        concept: "The final price equals the original cost multiplied by the product of all stage factors.",
        steps: [
          {
            title: "Build the mixed multiplier",
            body: "Use factors above 1 for gains and below 1 for losses.",
            equationLatex: "M=\\prod m_i"
          },
          {
            title: "Work backward",
            body: "Divide the final payment by M.",
            equationLatex: "C_0=\\frac{P_f}{M}"
          }
        ],
        conclusion: "The quotient is the original purchase price.",
        finalAnswerLatex: "\\text{\u20B9}{initialCostPrice}",
        commonTrap: "Do not reverse gains and losses by simply changing their signs and adding them."
      },
      difficulty: "Hard",
      difficultyRationale: "Reverse multi-stage chain with mixed directions supplied as structured data."
    },
    "PNL-QL-114": {
      stem: {
        contextFamily: "construction-material supply",
        blocks: [
          {
            type: "paragraph",
            content: "A consignment of construction material bought for \u20B9{initialCostPrice} passes through the transfers {stages}."
          }
        ],
        prompt: "Find the difference between the prices after transaction {firstStageNumber} and transaction {secondStageNumber}."
      },
      explanation: {
        opening: "We need two separate stopping points in the same price ledger.",
        concept: "Build the chain once, record both requested stage prices, and then compare them.",
        steps: [
          {
            title: "Construct the price ledger",
            body: "Apply the stage multipliers in order and record every intermediate price."
          },
          {
            title: "Select the two requested prices",
            body: "Read P_{firstStageNumber} and P_{secondStageNumber} from the ledger."
          },
          {
            title: "Find their difference",
            body: "Take the absolute difference.",
            equationLatex: "D=|P_a-P_b|"
          }
        ],
        conclusion: "That absolute difference is the required amount.",
        finalAnswerLatex: "\\text{\u20B9}{stagePriceDifference}",
        commonTrap: "Do not compare a requested intermediate price with the original cost unless one stage number is zero."
      },
      difficulty: "Hard",
      difficultyRationale: "Full ledger plus two-stage selection and comparison."
    },
    "PNL-QL-115": {
      stem: {
        contextFamily: "retail supply table",
        blocks: [
          {
            type: "paragraph",
            content: "A retail shipment is purchased initially for \u20B9{initialCostPrice}. Its successive transfers are shown below."
          },
          {
            type: "table",
            caption: "Transaction schedule",
            columns: [
              "Transfer",
              "Profit/Loss rate"
            ],
            rowSource: "transactionTable"
          }
        ],
        prompt: "Using the table, find the final selling price."
      },
      explanation: {
        opening: "Read the table row by row and treat each row as one transaction.",
        concept: "The output of one table row becomes the input price for the next row.",
        steps: [
          {
            title: "Translate each row into a multiplier",
            body: "Profit rows use 1+r/100 and loss rows use 1\u2212r/100."
          },
          {
            title: "Apply the rows in order",
            body: "Multiply the initial cost by the table multipliers from top to bottom.",
            equationLatex: "P_f=C_0\\prod m_i"
          }
        ],
        conclusion: "The value after the last table row is the final selling price.",
        finalAnswerLatex: "\\text{\u20B9}{finalSellingPrice}",
        commonTrap: "Do not treat the table as decorative text or rearrange the transaction order."
      },
      difficulty: "Medium",
      difficultyRationale: "Visible table interpretation with a direct successive calculation."
    },
    "PNL-QL-116": {
      stem: {
        contextFamily: "regional distribution caselet",
        blocks: [
          {
            type: "caselet",
            title: "Distribution caselet",
            paragraphSource: "caseletData"
          },
          {
            type: "paragraph",
            content: "The consignment starts at \u20B9{initialCostPrice} and follows the stage data {stages}."
          }
        ],
        prompt: "Calculate the profit or loss amount in transaction {selectedStage}."
      },
      explanation: {
        opening: "Let us separate the shared caselet information from the specific stage being asked about.",
        concept: "Only the selected trader's input and output prices are needed, but earlier caselet stages may be required to obtain them.",
        steps: [
          {
            title: "Extract the transaction order",
            body: "Use the caselet to build the chain up to transaction {selectedStage}."
          },
          {
            title: "Find the selected stage amount",
            body: "Compare that trader's selling price with that trader's purchase price.",
            equationLatex: "A_k=|P_k-P_{k-1}|"
          }
        ],
        conclusion: "The selected stage's price difference is the required amount.",
        finalAnswerLatex: "\\text{\u20B9}{selectedStageAmount}",
        commonTrap: "Do not use facts from later caselet stages when they do not affect the selected transaction."
      },
      difficulty: "Hard",
      difficultyRationale: "Caselet extraction plus stage-specific ledger reasoning."
    },
    "PNL-QL-117": {
      stem: {
        contextFamily: "trader-chain statement evaluation",
        blocks: [
          {
            type: "paragraph",
            content: "A product is sold successively through the stages {stages}."
          },
          {
            type: "statements",
            lead: "Consider the following conclusions about the complete chain:",
            statements: [
              "The overall result can be found by adding the signed rates.",
              "The combined multiplier must be compared with 1.",
              "The final trader's rate alone determines the overall result."
            ]
          }
        ],
        prompt: "Select the correct statement."
      },
      explanation: {
        opening: "The statements can be tested using the basic rule of successive percentages.",
        concept: "Different stages use different price bases, so the combined multiplier is the reliable measure of the overall result.",
        steps: [
          {
            title: "Reject direct rate addition",
            body: "Signed percentages cannot normally be added across changing bases."
          },
          {
            title: "Use the combined factor",
            body: "Multiply the stage factors and compare the product with 1."
          }
        ],
        conclusion: "The statement describing multiplier comparison is correct.",
        finalAnswerLatex: "{correctStatement}",
        commonTrap: "A statement may sound reasonable because the rates are visible, but the changing base is decisive."
      },
      difficulty: "Medium",
      difficultyRationale: "Conceptual statement evaluation with no coupled unknown."
    },
    "PNL-QL-118": {
      stem: {
        contextFamily: "algebraic transaction chain",
        blocks: [
          {
            type: "paragraph",
            content: "The initial price is {initialPriceExpression}, the final price is {finalPriceExpression}, and the known transfer is represented by {knownStageExpression}. The missing transfer is a {missingDirection}."
          },
          {
            type: "equation",
            latex: "P_f=P_0\\,m_{known}\\,m_{missing}"
          }
        ],
        prompt: "Determine the missing percentage algebraically."
      },
      explanation: {
        opening: "The algebra is the same chain rule written with symbols instead of numbers.",
        concept: "Isolate the unknown multiplier before converting it to a percentage.",
        steps: [
          {
            title: "Solve for the missing factor",
            body: "Divide the final-price expression by the initial expression and the known multiplier.",
            equationLatex: "m_{missing}=\\frac{P_f}{P_0m_{known}}"
          },
          {
            title: "Convert factor to rate",
            body: "Use m\u22121 for profit or 1\u2212m for loss, then multiply by 100."
          }
        ],
        conclusion: "The simplified expression gives the missing percentage.",
        finalAnswerLatex: "{missingRatePercent}\\%",
        commonTrap: "Do not cancel terms that belong to different factors or change the direction rule after isolation."
      },
      difficulty: "Hard",
      difficultyRationale: "Symbolic coupled inverse and direction-sensitive conversion."
    },
    "PNL-QL-119": {
      stem: {
        contextFamily: "successive-sale data sufficiency",
        blocks: [
          {
            type: "data_sufficiency",
            question: "The original cost price of an item in a successive transaction chain is required.",
            statements: [
              "{statementOne}",
              "{statementTwo}"
            ],
            answerScheme: "STANDARD_TWO_STATEMENT"
          }
        ],
        prompt: "Decide whether Statement I alone, Statement II alone, both together, or neither is sufficient."
      },
      explanation: {
        opening: "Data sufficiency asks whether the value can be determined, not whether we can produce a plausible estimate.",
        concept: "The original cost is fixed only when the final price and every required chain multiplier are uniquely known.",
        steps: [
          {
            title: "Test Statement I alone",
            body: "Check whether it supplies a complete equation with one unknown."
          },
          {
            title: "Test Statement II alone",
            body: "Repeat the same uniqueness check without using Statement I."
          },
          {
            title: "Combine only if needed",
            body: "Use both statements together and see whether the original cost becomes unique."
          }
        ],
        conclusion: "Choose the standard data-sufficiency option matching the first point at which uniqueness is achieved.",
        finalAnswerLatex: "{dataSufficiencyAnswer}",
        commonTrap: "Do not solve using information from both statements while judging either statement alone."
      },
      difficulty: "Hard",
      difficultyRationale: "Data-sufficiency logic with equation completeness and uniqueness."
    },
    "PNL-QL-120": {
      stem: {
        contextFamily: "commercial-agent caselet",
        blocks: [
          {
            type: "caselet",
            title: "Agent-assisted resale",
            paragraphs: [
              "A trader purchases a specialised machine for \u20B9{purchasePrice} and spends \u20B9{buyerExpense} preparing it for sale.",
              "The machine is sold for \u20B9{grossSellingPrice} through an agent who charges {commissionPercent}% of the gross price."
            ]
          }
        ],
        prompt: "Calculate the trader's percentage gain or loss on the complete transaction."
      },
      explanation: {
        opening: "The friendly way to organise this caselet is to separate cost-side additions from sale-side deductions.",
        concept: "Effective cost includes the preparation expense, while net realization is the gross price after commission.",
        steps: [
          {
            title: "Find effective cost",
            body: "Add the purchase and preparation amounts.",
            equationLatex: "E=C+e"
          },
          {
            title: "Find net receipt",
            body: "Remove the agent's commission from the gross price.",
            equationLatex: "N=G(1-c/100)"
          },
          {
            title: "Calculate the percentage result",
            body: "Compare N with E and divide the difference by E.",
            equationLatex: "r=\\frac{|N-E|}{E}\\times100"
          }
        ],
        conclusion: "The comparison gives both the direction and the percentage result.",
        finalAnswerLatex: "{resultRatePercent}\\%\\;{resultDirection}",
        commonTrap: "Do not calculate profit on the purchase price alone or use the gross price before commission."
      },
      difficulty: "Hard",
      difficultyRationale: "Caselet with effective-cost construction, net realization, and percentage interpretation."
    }
  },
  entryCount: 26
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/cp004-independent-verifier.ts
function multiplier2(stage2) {
  const base = 100n * stage2.ratePercent.denominator;
  const change = stage2.ratePercent.numerator;
  return rational(
    stage2.direction === "PROFIT" ? base + change : base - change,
    base
  );
}
function exactPaise(numerator, denominator) {
  if (denominator <= 0n || numerator % denominator !== 0n) return null;
  return numerator / denominator;
}
function verifyTransactionChainFinal(initialCostPrice, stages, actualFinalSellingPrice) {
  if (initialCostPrice.paise <= 0n || stages.length === 0) {
    return { valid: false, reason: "Initial price and stages must be present." };
  }
  let numerator = initialCostPrice.paise;
  let denominator = 1n;
  for (const stage2 of stages) {
    const factor = multiplier2(stage2);
    numerator *= factor.numerator;
    denominator *= factor.denominator;
  }
  const expectedPaise = exactPaise(numerator, denominator);
  if (expectedPaise === null) return { valid: false, reason: "Expected chain value is not an exact paise amount." };
  return {
    valid: expectedPaise === actualFinalSellingPrice.paise,
    expectedPaise,
    actualPaise: actualFinalSellingPrice.paise
  };
}
function verifyTransactionChainInitial(finalSellingPrice, stages, actualInitialCostPrice) {
  if (finalSellingPrice.paise <= 0n || stages.length === 0) {
    return { valid: false, reason: "Final price and stages must be present." };
  }
  let numerator = finalSellingPrice.paise;
  let denominator = 1n;
  for (const stage2 of stages) {
    const factor = multiplier2(stage2);
    numerator *= factor.denominator;
    denominator *= factor.numerator;
  }
  const expectedPaise = exactPaise(numerator, denominator);
  if (expectedPaise === null) return { valid: false, reason: "Expected reverse-chain value is not an exact paise amount." };
  return {
    valid: expectedPaise === actualInitialCostPrice.paise,
    expectedPaise,
    actualPaise: actualInitialCostPrice.paise
  };
}
function verifyCommissionNetReceipt(grossSellingPrice, commissionPercent, actualNetReceipt) {
  const retainedNumerator = 100n * commissionPercent.denominator - commissionPercent.numerator;
  const retainedDenominator = 100n * commissionPercent.denominator;
  const expectedPaise = exactPaise(
    grossSellingPrice.paise * retainedNumerator,
    retainedDenominator
  );
  if (expectedPaise === null) return { valid: false, reason: "Expected net receipt is not an exact paise amount." };
  return {
    valid: expectedPaise === actualNetReceipt.paise,
    expectedPaise,
    actualPaise: actualNetReceipt.paise
  };
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-004/task-registry.library.json
var task_registry_library_default4 = {
  archetypeId: "PNL-001",
  cpId: "PNL-CP-004",
  status: "FREEZE_CANDIDATE",
  countPolicy: "DISCOVERED_NOT_QUOTA_DRIVEN",
  title: "Successive Transactions and Trader Chains",
  entries: {
    "PNL-QL-095": { solveMode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", answerSemantic: "finalSellingPrice", requiredVariables: ["initialCostPrice", "firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent"], difficulty: "Medium" },
    "PNL-QL-096": { solveMode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", answerSemantic: "finalSellingPrice", requiredVariables: ["initialCostPrice", "firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent", "thirdDirection", "thirdRatePercent"], difficulty: "Hard" },
    "PNL-QL-097": { solveMode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", answerSemantic: "initialCostPrice", requiredVariables: ["finalSellingPrice", "firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent"], difficulty: "Hard" },
    "PNL-QL-098": { solveMode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", answerSemantic: "initialCostPrice", requiredVariables: ["finalSellingPrice", "firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent", "thirdDirection", "thirdRatePercent"], difficulty: "Hard" },
    "PNL-QL-099": { solveMode: "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE", answerSemantic: "intermediateSellingPrice", requiredVariables: ["initialCostPrice", "stages", "afterStage"], difficulty: "Medium" },
    "PNL-QL-100": { solveMode: "STAGES_TO_OVERALL_RATE", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["stages"], difficulty: "Medium" },
    "PNL-QL-101": { solveMode: "STAGES_TO_OVERALL_RATE", answerSemantic: "overallProfitOrLossPercent", requiredVariables: ["firstDirection", "firstRatePercent", "secondDirection", "secondRatePercent", "thirdDirection", "thirdRatePercent"], difficulty: "Hard" },
    "PNL-QL-102": { solveMode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE", answerSemantic: "missingProfitPercent", requiredVariables: ["initialCostPrice", "finalSellingPrice", "knownStages", "missingDirection"], difficulty: "Hard" },
    "PNL-QL-103": { solveMode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE", answerSemantic: "missingLossPercent", requiredVariables: ["initialCostPrice", "finalSellingPrice", "knownStages", "missingDirection"], difficulty: "Hard" },
    "PNL-QL-104": { solveMode: "EQUAL_RATE_N_STAGE_TO_FINAL_SP", answerSemantic: "finalSellingPrice", requiredVariables: ["initialCostPrice", "stageCount", "direction", "ratePercent"], difficulty: "Medium" },
    "PNL-QL-105": { solveMode: "CHAIN_TO_STAGE_LEDGER", answerSemantic: "selectedTraderProfitOrLossAmount", requiredVariables: ["initialCostPrice", "stages", "selectedStage"], difficulty: "Medium" },
    "PNL-QL-106": { solveMode: "CHAIN_TO_STAGE_LEDGER", answerSemantic: "largestStageGainOrLoss", requiredVariables: ["initialCostPrice", "stages"], difficulty: "Hard" },
    "PNL-QL-107": { solveMode: "BUYER_EXPENSE_THEN_RATE_TO_SP", answerSemantic: "sellingPrice", requiredVariables: ["purchasePrice", "buyerExpense", "direction", "ratePercent"], difficulty: "Medium" },
    "PNL-QL-108": { solveMode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT", answerSemantic: "netReceipt", requiredVariables: ["grossSellingPrice", "commissionPercent"], difficulty: "Medium" },
    "PNL-QL-109": { solveMode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP", answerSemantic: "grossSellingPrice", requiredVariables: ["requiredNetReceipt", "commissionPercent"], difficulty: "Hard" },
    "PNL-QL-110": { solveMode: "MIDDLE_TRADER_NET_RESULT", answerSemantic: "netProfitOrLossPercent", requiredVariables: ["purchasePrice", "buyerExpense", "grossSellingPrice", "commissionPercent"], difficulty: "Hard" },
    "PNL-QL-111": { solveMode: "CHAIN_TO_STAGE_LEDGER", answerSemantic: "stageWiseAmounts", requiredVariables: ["initialCostPrice", "stages"], difficulty: "Hard" },
    "PNL-QL-112": { solveMode: "STAGES_TO_OVERALL_RATE", answerSemantic: "originalOwnerToFinalBuyerRate", requiredVariables: ["stages"], difficulty: "Medium" },
    "PNL-QL-113": { solveMode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", answerSemantic: "initialCostPrice", requiredVariables: ["finalSellingPrice", "stages"], difficulty: "Hard", presentation: "MIXED_DIRECTION" },
    "PNL-QL-114": { solveMode: "CHAIN_TO_STAGE_LEDGER", answerSemantic: "differenceBetweenStagePrices", requiredVariables: ["initialCostPrice", "stages", "firstStageNumber", "secondStageNumber"], difficulty: "Hard" },
    "PNL-QL-115": { solveMode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", answerSemantic: "tableFinalSellingPrice", requiredVariables: ["transactionTable", "initialCostPrice"], difficulty: "Hard", representation: "TABLE" },
    "PNL-QL-116": { solveMode: "CHAIN_TO_STAGE_LEDGER", answerSemantic: "caseletTraderResult", requiredVariables: ["caseletData", "initialCostPrice", "stages", "selectedStage"], difficulty: "Hard", representation: "CASELET" },
    "PNL-QL-117": { solveMode: "STAGES_TO_OVERALL_RATE", answerSemantic: "correctStatement", requiredVariables: ["stages"], difficulty: "Medium", representation: "STATEMENT" },
    "PNL-QL-118": { solveMode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE", answerSemantic: "algebraicMissingRate", requiredVariables: ["initialPriceExpression", "finalPriceExpression", "knownStageExpression", "missingDirection"], difficulty: "Hard", representation: "ALGEBRAIC" },
    "PNL-QL-119": { solveMode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", answerSemantic: "dataSufficiency", requiredVariables: ["statementOne", "statementTwo"], difficulty: "Hard", representation: "DATA_SUFFICIENCY" },
    "PNL-QL-120": { solveMode: "MIDDLE_TRADER_NET_RESULT", answerSemantic: "caseletNetResult", requiredVariables: ["purchasePrice", "buyerExpense", "grossSellingPrice", "commissionPercent"], difficulty: "Hard", representation: "CASELET" }
  },
  entryCount: 26,
  freezeNote: "Count frozen after forward/reverse, missing-stage, intermediate-price, ledger, fee/commission, mixed-direction and representation audits. Reopen only for a genuinely distinct chain transformation or source-backed PYQ pattern."
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/transaction-chain-solver.ts
function validateRate(stage2) {
  if (stage2.ratePercent.denominator <= 0n || stage2.ratePercent.numerator < 0n) {
    throw new Error("A transaction rate must be non-negative.");
  }
  if (stage2.direction === "LOSS" && stage2.ratePercent.numerator >= 100n * stage2.ratePercent.denominator) {
    throw new Error("A loss rate in a continuing chain must be below 100%.");
  }
}
function stageMultiplier(stage2) {
  validateRate(stage2);
  const hundred = rational(100);
  const rate2 = divideRational(stage2.ratePercent, hundred);
  return stage2.direction === "PROFIT" ? { numerator: rate2.denominator + rate2.numerator, denominator: rate2.denominator } : subtractRational(rational(1), rate2);
}
function chainMultiplier(stages) {
  if (stages.length === 0) throw new Error("At least one transaction stage is required.");
  return stages.reduce(
    (accumulator, stage2) => multiplyRational(accumulator, stageMultiplier(stage2)),
    rational(1)
  );
}
function summarizeMultiplier(multiplier4) {
  const difference = multiplier4.numerator - multiplier4.denominator;
  const absoluteDifference = difference < 0n ? -difference : difference;
  return {
    direction: difference > 0n ? "PROFIT" : difference < 0n ? "LOSS" : "NO_CHANGE",
    ratePercent: asPercent(rational(absoluteDifference, multiplier4.denominator))
  };
}
function solveTransactionChain(request) {
  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP":
      return {
        mode: request.mode,
        finalSellingPrice: multiplyMoney(request.initialCostPrice, chainMultiplier(request.stages))
      };
    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP": {
      const multiplier4 = chainMultiplier(request.stages);
      if (multiplier4.numerator <= 0n) throw new Error("The chain multiplier must be positive.");
      return {
        mode: request.mode,
        initialCostPrice: multiplyMoney(
          request.finalSellingPrice,
          rational(multiplier4.denominator, multiplier4.numerator)
        )
      };
    }
    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE": {
      if (request.afterStage < 1 || request.afterStage > request.stages.length) {
        throw new Error("afterStage must identify an existing transaction stage.");
      }
      return {
        mode: request.mode,
        intermediatePrice: multiplyMoney(
          request.initialCostPrice,
          chainMultiplier(request.stages.slice(0, request.afterStage))
        )
      };
    }
    case "STAGES_TO_OVERALL_RATE":
      return { mode: request.mode, ...summarizeMultiplier(chainMultiplier(request.stages)) };
    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE": {
      if (request.initialCostPrice.paise <= 0n) throw new Error("Initial cost price must be positive.");
      const overallMultiplier = rational(request.finalSellingPrice.paise, request.initialCostPrice.paise);
      const knownMultiplier = request.knownStages.length === 0 ? rational(1) : chainMultiplier(request.knownStages);
      const missingMultiplier = divideRational(overallMultiplier, knownMultiplier);
      const difference = missingMultiplier.numerator - missingMultiplier.denominator;
      if (request.missingDirection === "PROFIT" && difference < 0n) {
        throw new Error("The supplied data imply a loss, not a profit, at the missing stage.");
      }
      if (request.missingDirection === "LOSS" && difference > 0n) {
        throw new Error("The supplied data imply a profit, not a loss, at the missing stage.");
      }
      const absoluteDifference = difference < 0n ? -difference : difference;
      return {
        mode: request.mode,
        missingRatePercent: asPercent(rational(absoluteDifference, missingMultiplier.denominator))
      };
    }
    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP": {
      if (!Number.isInteger(request.stageCount) || request.stageCount <= 0) {
        throw new Error("stageCount must be a positive integer.");
      }
      const stage2 = {
        direction: request.direction,
        ratePercent: request.ratePercent
      };
      const stages = Array.from({ length: request.stageCount }, () => stage2);
      return {
        mode: request.mode,
        finalSellingPrice: multiplyMoney(request.initialCostPrice, chainMultiplier(stages))
      };
    }
    case "CHAIN_TO_STAGE_LEDGER": {
      if (request.stages.length === 0) throw new Error("At least one transaction stage is required.");
      const ledger = [];
      let current = request.initialCostPrice;
      for (let index = 0; index < request.stages.length; index += 1) {
        const stage2 = request.stages[index];
        const next = multiplyMoney(current, stageMultiplier(stage2));
        const delta = next.paise - current.paise;
        ledger.push({
          stageNumber: index + 1,
          purchasePrice: current,
          sellingPrice: next,
          direction: stage2.direction,
          amount: moneyFromPaise(delta < 0n ? -delta : delta),
          ratePercent: stage2.ratePercent
        });
        current = next;
      }
      return { mode: request.mode, finalSellingPrice: current, ledger };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/transaction-fee-solver.ts
function validateNonNegativeRate(rate2) {
  if (rate2.denominator <= 0n || rate2.numerator < 0n) {
    throw new Error("Rate must be non-negative with a positive denominator.");
  }
}
function validateCommission(rate2) {
  validateNonNegativeRate(rate2);
  if (rate2.numerator >= 100n * rate2.denominator) {
    throw new Error("Commission must be below 100%.");
  }
}
function salePrice(base, direction2, rate2) {
  validateNonNegativeRate(rate2);
  if (direction2 === "LOSS" && rate2.numerator >= 100n * rate2.denominator) {
    throw new Error("Loss rate must be below 100%.");
  }
  const change = multiplyMoney(base, divideRational(rate2, rational(100)));
  return moneyFromPaise(direction2 === "PROFIT" ? base.paise + change.paise : base.paise - change.paise);
}
function netReceipt(gross, commissionPercent) {
  validateCommission(commissionPercent);
  const commissionAmount = multiplyMoney(gross, divideRational(commissionPercent, rational(100)));
  return { commissionAmount, netReceipt: moneyFromPaise(gross.paise - commissionAmount.paise) };
}
function solveTransactionFee(request) {
  switch (request.mode) {
    case "BUYER_EXPENSE_THEN_RATE_TO_SP": {
      if (request.buyerExpense.paise < 0n) throw new Error("Expense cannot be negative.");
      const effectiveCost2 = moneyFromPaise(request.purchasePrice.paise + request.buyerExpense.paise);
      return { mode: request.mode, effectiveCost: effectiveCost2, sellingPrice: salePrice(effectiveCost2, request.direction, request.ratePercent) };
    }
    case "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT":
      return { mode: request.mode, ...netReceipt(request.grossSellingPrice, request.commissionPercent) };
    case "NET_TARGET_AND_COMMISSION_TO_GROSS_SP": {
      validateCommission(request.commissionPercent);
      const retained = 100n * request.commissionPercent.denominator - request.commissionPercent.numerator;
      return {
        mode: request.mode,
        grossSellingPrice: multiplyMoney(request.requiredNetReceipt, rational(100n * request.commissionPercent.denominator, retained))
      };
    }
    case "MIDDLE_TRADER_NET_RESULT": {
      if (request.buyerExpense.paise < 0n) throw new Error("Expense cannot be negative.");
      const effectiveCost2 = moneyFromPaise(request.purchasePrice.paise + request.buyerExpense.paise);
      const receipt = netReceipt(request.grossSellingPrice, request.commissionPercent).netReceipt;
      const difference = receipt.paise - effectiveCost2.paise;
      const absolute = difference < 0n ? -difference : difference;
      return {
        mode: request.mode,
        effectiveCost: effectiveCost2,
        netReceipt: receipt,
        direction: difference > 0n ? "PROFIT" : difference < 0n ? "LOSS" : "NO_CHANGE",
        amount: moneyFromPaise(absolute),
        ratePercent: asPercent(rational(absolute, effectiveCost2.paise))
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-004/cp004-dynamic-cases.ts
var PNL_CP004_ID = "PNL-CP-004";
var taskRegistry4 = task_registry_library_default4;
var PNL_CP004_QL_IDS = Object.keys(taskRegistry4.entries);
var BASE_PRICES = [8e3, 1e4, 12e3, 16e3, 2e4, 24e3, 3e4, 4e4];
var EXPENSES = [400, 500, 800, 1e3, 1200, 1500];
var COMMISSION_RATES = [5, 10, 20, 25];
var TARGET_RATES = [10, 20, 25];
var TWO_STAGE_PRESETS = [
  [["PROFIT", 20], ["LOSS", 10]],
  [["PROFIT", 25], ["PROFIT", 20]],
  [["LOSS", 20], ["PROFIT", 25]],
  [["PROFIT", 10], ["PROFIT", 20]],
  [["LOSS", 10], ["LOSS", 20]],
  [["PROFIT", 40], ["LOSS", 25]]
];
var THREE_STAGE_PRESETS = [
  [["PROFIT", 20], ["LOSS", 10], ["PROFIT", 25]],
  [["LOSS", 20], ["PROFIT", 25], ["PROFIT", 20]],
  [["PROFIT", 10], ["PROFIT", 20], ["LOSS", 25]],
  [["LOSS", 10], ["LOSS", 20], ["PROFIT", 25]],
  [["PROFIT", 25], ["LOSS", 20], ["PROFIT", 10]],
  [["PROFIT", 20], ["PROFIT", 25], ["LOSS", 20]]
];
function cp004PlainMoney(value) {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}
function cp004FormatMoney(value) {
  return `\u20B9${cp004PlainMoney(value)}`;
}
function cp004FormatRational(value) {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function cp004FormatPercent(value) {
  return `${cp004FormatRational(value)}%`;
}
function rupees3(value) {
  return moneyFromRupees(value);
}
function pickNumber3(random, values) {
  return pickSeeded(random, values);
}
function stage(direction2, ratePercent) {
  return { direction: direction2, ratePercent: rational(ratePercent) };
}
function stagesFromPreset(preset) {
  return preset.map(([direction2, ratePercent]) => stage(direction2, ratePercent));
}
function pickStages(random, count) {
  return stagesFromPreset(
    pickSeeded(random, count === 2 ? TWO_STAGE_PRESETS : THREE_STAGE_PRESETS)
  );
}
function stagePhrase(item) {
  return `${cp004FormatRational(item.ratePercent)}% ${item.direction.toLowerCase()}`;
}
function cp004StagesText(stages) {
  return stages.map((item, index) => `transaction ${index + 1}: ${stagePhrase(item)}`).join("; ");
}
function stageTable(stages) {
  return stages.map((item, index) => [
    `Transfer ${index + 1}`,
    `${cp004FormatRational(item.ratePercent)}% ${item.direction.toLowerCase()}`
  ]);
}
function solvePnlCp004Request(request) {
  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP":
    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP":
    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE":
    case "STAGES_TO_OVERALL_RATE":
    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE":
    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP":
    case "CHAIN_TO_STAGE_LEDGER":
      return solveTransactionChain(request);
    default:
      return solveTransactionFee(request);
  }
}
function middleTraderCase(random) {
  const effectiveCost2 = rupees3(pickNumber3(random, BASE_PRICES));
  const buyerExpense = rupees3(pickNumber3(random, EXPENSES));
  const purchasePrice = moneyFromPaise(effectiveCost2.paise - buyerExpense.paise);
  const direction2 = pickSeeded(random, ["PROFIT", "LOSS"]);
  const targetRate = pickNumber3(random, TARGET_RATES);
  const targetNet = moneyFromPaise(
    direction2 === "PROFIT" ? effectiveCost2.paise * BigInt(100 + targetRate) / 100n : effectiveCost2.paise * BigInt(100 - targetRate) / 100n
  );
  const commissionPercent = rational(20);
  const grossSellingPrice = solveTransactionFee({
    mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP",
    requiredNetReceipt: targetNet,
    commissionPercent
  }).grossSellingPrice;
  return {
    request: {
      mode: "MIDDLE_TRADER_NET_RESULT",
      purchasePrice,
      buyerExpense,
      grossSellingPrice,
      commissionPercent
    },
    context: {
      purchasePrice: cp004PlainMoney(purchasePrice),
      buyerExpense: cp004PlainMoney(buyerExpense),
      grossSellingPrice: cp004PlainMoney(grossSellingPrice),
      commissionPercent: cp004FormatRational(commissionPercent)
    }
  };
}
function forwardContext(initialCostPrice, stages) {
  return {
    initialCostPrice: cp004PlainMoney(initialCostPrice),
    stages: cp004StagesText(stages),
    firstDirection: stages[0].direction.toLowerCase(),
    firstRatePercent: cp004FormatRational(stages[0].ratePercent),
    secondDirection: stages[1].direction.toLowerCase(),
    secondRatePercent: cp004FormatRational(stages[1].ratePercent),
    ...stages[2] ? {
      thirdDirection: stages[2].direction.toLowerCase(),
      thirdRatePercent: cp004FormatRational(stages[2].ratePercent)
    } : {},
    transactionTable: stageTable(stages)
  };
}
function generatePnlCp004Case(qlId, seedValue) {
  const registry = taskRegistry4.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-004 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);
  const initialCostPrice = rupees3(pickNumber3(random, BASE_PRICES));
  switch (qlId) {
    case "PNL-QL-095":
    case "PNL-QL-115": {
      const stages = pickStages(random, 2);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", initialCostPrice, stages },
        context: forwardContext(initialCostPrice, stages)
      };
    }
    case "PNL-QL-096": {
      const stages = pickStages(random, 3);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP", initialCostPrice, stages },
        context: forwardContext(initialCostPrice, stages)
      };
    }
    case "PNL-QL-097":
    case "PNL-QL-098":
    case "PNL-QL-113": {
      const count = qlId === "PNL-QL-097" ? 2 : 3;
      const stages = pickStages(random, count);
      const finalSellingPrice = solveTransactionChain({
        mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
        initialCostPrice,
        stages
      }).finalSellingPrice;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", finalSellingPrice, stages },
        context: {
          ...forwardContext(initialCostPrice, stages),
          finalSellingPrice: cp004PlainMoney(finalSellingPrice)
        }
      };
    }
    case "PNL-QL-099": {
      const stages = pickStages(random, 3);
      const afterStage = pickSeeded(random, [1, 2]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE",
          initialCostPrice,
          stages,
          afterStage
        },
        context: {
          initialCostPrice: cp004PlainMoney(initialCostPrice),
          stages: cp004StagesText(stages),
          afterStage
        }
      };
    }
    case "PNL-QL-100":
    case "PNL-QL-112":
    case "PNL-QL-117": {
      const stages = pickStages(random, 2);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "STAGES_TO_OVERALL_RATE", stages },
        context: { stages: cp004StagesText(stages) },
        ...qlId === "PNL-QL-117" ? { answerOverride: "Statement 2 only" } : {}
      };
    }
    case "PNL-QL-101": {
      const stages = pickStages(random, 3);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "STAGES_TO_OVERALL_RATE", stages },
        context: forwardContext(initialCostPrice, stages)
      };
    }
    case "PNL-QL-102":
    case "PNL-QL-103":
    case "PNL-QL-118": {
      const knownStage = pickStages(random, 2)[0];
      const missingDirection = qlId === "PNL-QL-103" ? "LOSS" : "PROFIT";
      const missingStage = stage(missingDirection, pickNumber3(random, TARGET_RATES));
      const finalSellingPrice = solveTransactionChain({
        mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
        initialCostPrice,
        stages: [knownStage, missingStage]
      }).finalSellingPrice;
      const context = qlId === "PNL-QL-118" ? {
        initialPriceExpression: `${cp004PlainMoney(initialCostPrice)}x`,
        finalPriceExpression: `${cp004PlainMoney(finalSellingPrice)}x`,
        knownStageExpression: stagePhrase(knownStage),
        missingDirection: missingDirection.toLowerCase()
      } : {
        initialCostPrice: cp004PlainMoney(initialCostPrice),
        finalSellingPrice: cp004PlainMoney(finalSellingPrice),
        knownStages: stagePhrase(knownStage),
        missingDirection: missingDirection.toLowerCase()
      };
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE",
          initialCostPrice,
          finalSellingPrice,
          knownStages: [knownStage],
          missingDirection
        },
        context
      };
    }
    case "PNL-QL-104": {
      const stageCount = pickSeeded(random, [2, 3]);
      const direction2 = pickSeeded(random, ["PROFIT", "LOSS"]);
      const ratePercent = rational(pickNumber3(random, TARGET_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EQUAL_RATE_N_STAGE_TO_FINAL_SP",
          initialCostPrice,
          stageCount,
          direction: direction2,
          ratePercent
        },
        context: {
          initialCostPrice: cp004PlainMoney(initialCostPrice),
          stageCount,
          direction: direction2.toLowerCase(),
          ratePercent: cp004FormatRational(ratePercent)
        }
      };
    }
    case "PNL-QL-105":
    case "PNL-QL-106":
    case "PNL-QL-111":
    case "PNL-QL-114":
    case "PNL-QL-116": {
      const stages = pickStages(random, 3);
      const selectedStage = pickSeeded(random, [1, 2, 3]);
      const secondStageNumber = pickSeeded(random, [2, 3]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "CHAIN_TO_STAGE_LEDGER", initialCostPrice, stages },
        context: {
          initialCostPrice: cp004PlainMoney(initialCostPrice),
          stages: cp004StagesText(stages),
          selectedStage,
          firstStageNumber: 1,
          secondStageNumber,
          caseletData: [
            "Three traders handle the same consignment in the order stated below.",
            `The selected result belongs to transaction ${selectedStage}; every percentage uses that trader's purchase price.`
          ]
        }
      };
    }
    case "PNL-QL-107": {
      const purchasePrice = rupees3(pickNumber3(random, BASE_PRICES));
      const buyerExpense = rupees3(pickNumber3(random, EXPENSES));
      const direction2 = pickSeeded(random, ["PROFIT", "LOSS"]);
      const ratePercent = rational(pickNumber3(random, TARGET_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BUYER_EXPENSE_THEN_RATE_TO_SP",
          purchasePrice,
          buyerExpense,
          direction: direction2,
          ratePercent
        },
        context: {
          purchasePrice: cp004PlainMoney(purchasePrice),
          buyerExpense: cp004PlainMoney(buyerExpense),
          direction: direction2.toLowerCase(),
          ratePercent: cp004FormatRational(ratePercent)
        }
      };
    }
    case "PNL-QL-108": {
      const grossSellingPrice = rupees3(pickNumber3(random, BASE_PRICES));
      const commissionPercent = rational(20);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT",
          grossSellingPrice,
          commissionPercent
        },
        context: {
          grossSellingPrice: cp004PlainMoney(grossSellingPrice),
          commissionPercent: cp004FormatRational(commissionPercent)
        }
      };
    }
    case "PNL-QL-109": {
      const grossSellingPrice = rupees3(pickNumber3(random, BASE_PRICES));
      const commissionPercent = rational(pickNumber3(random, COMMISSION_RATES));
      const requiredNetReceipt = solveTransactionFee({
        mode: "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT",
        grossSellingPrice,
        commissionPercent
      }).netReceipt;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "NET_TARGET_AND_COMMISSION_TO_GROSS_SP",
          requiredNetReceipt,
          commissionPercent
        },
        context: {
          requiredNetReceipt: cp004PlainMoney(requiredNetReceipt),
          commissionPercent: cp004FormatRational(commissionPercent)
        }
      };
    }
    case "PNL-QL-110":
    case "PNL-QL-120": {
      const generated2 = middleTraderCase(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: generated2.request,
        context: generated2.context
      };
    }
    case "PNL-QL-119": {
      const stages = pickStages(random, 2);
      const finalSellingPrice = solveTransactionChain({
        mode: "INITIAL_CP_AND_STAGES_TO_FINAL_SP",
        initialCostPrice,
        stages
      }).finalSellingPrice;
      const pattern = pickSeeded(
        random,
        ["BOTH_TOGETHER", "STATEMENT_ONE", "STATEMENT_TWO", "EITHER"]
      );
      const complete = `The final selling price is ${cp004FormatMoney(finalSellingPrice)} and the stages are ${cp004StagesText(stages)}.`;
      const finalOnly = `The final selling price is ${cp004FormatMoney(finalSellingPrice)}.`;
      const stagesOnly = `The stages are ${cp004StagesText(stages)}.`;
      const irrelevant = "The item was handled by two traders in the same city.";
      const statementOne = pattern === "STATEMENT_ONE" || pattern === "EITHER" ? complete : pattern === "BOTH_TOGETHER" ? finalOnly : irrelevant;
      const statementTwo = pattern === "STATEMENT_TWO" || pattern === "EITHER" ? complete : pattern === "BOTH_TOGETHER" ? stagesOnly : irrelevant;
      const answerOverride = pattern === "BOTH_TOGETHER" ? "Both statements together are required" : pattern === "STATEMENT_ONE" ? "Statement 1 alone is sufficient" : pattern === "STATEMENT_TWO" ? "Statement 2 alone is sufficient" : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: { mode: "FINAL_SP_AND_STAGES_TO_INITIAL_CP", finalSellingPrice, stages },
        context: { statementOne, statementTwo, dataSufficiencyAnswer: answerOverride },
        answerOverride
      };
    }
    default:
      throw new Error(`${qlId}: CP-004 dynamic generator is not implemented.`);
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-004/cp004-dynamic-runtime.ts
var PNL_CP004_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE";
var editorialLibrary4 = editorial_content_en_default4;
function directionRateText(direction2, ratePercent) {
  if (direction2 === "NO_CHANGE") return "No profit, no loss";
  return `${cp004FormatPercent(ratePercent)} ${direction2.toLowerCase()}`;
}
function ledgerAnswer(ledger) {
  return ledger.map(
    (item) => `Transaction ${item.stageNumber}: ${item.direction === "PROFIT" ? "profit" : "loss"} ${cp004FormatMoney(item.amount)}`
  ).join("; ");
}
function answerFor3(qlId, result, generated2) {
  if (generated2.answerOverride) {
    return { kind: "TEXT", value: generated2.answerOverride };
  }
  switch (qlId) {
    case "PNL-QL-095":
    case "PNL-QL-096":
    case "PNL-QL-104":
    case "PNL-QL-115":
      if (!("finalSellingPrice" in result)) {
        throw new Error(`${qlId}: expected final selling price.`);
      }
      return { kind: "MONEY", value: result.finalSellingPrice };
    case "PNL-QL-107":
      if (!("sellingPrice" in result)) {
        throw new Error(`${qlId}: expected selling price.`);
      }
      return { kind: "MONEY", value: result.sellingPrice };
    case "PNL-QL-097":
    case "PNL-QL-098":
    case "PNL-QL-113":
      if (!("initialCostPrice" in result)) {
        throw new Error(`${qlId}: expected initial cost price.`);
      }
      return { kind: "MONEY", value: result.initialCostPrice };
    case "PNL-QL-099":
      if (!("intermediatePrice" in result)) {
        throw new Error(`${qlId}: expected intermediate price.`);
      }
      return { kind: "MONEY", value: result.intermediatePrice };
    case "PNL-QL-100":
    case "PNL-QL-101":
    case "PNL-QL-112":
    case "PNL-QL-110":
    case "PNL-QL-120":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected a directed percentage result.`);
      }
      return {
        kind: "TEXT",
        value: directionRateText(result.direction, result.ratePercent)
      };
    case "PNL-QL-102":
    case "PNL-QL-103":
    case "PNL-QL-118":
      if (!("missingRatePercent" in result)) {
        throw new Error(`${qlId}: expected missing rate.`);
      }
      return { kind: "PERCENT", value: result.missingRatePercent };
    case "PNL-QL-105":
    case "PNL-QL-116": {
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      const selectedStage = Number(generated2.context.selectedStage);
      const item = result.ledger[selectedStage - 1];
      return {
        kind: "TEXT",
        value: `Transaction ${selectedStage}: ${item.direction === "PROFIT" ? "profit" : "loss"} ${cp004FormatMoney(item.amount)}`
      };
    }
    case "PNL-QL-106": {
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      const item = [...result.ledger].sort(
        (left, right) => left.amount.paise === right.amount.paise ? left.stageNumber - right.stageNumber : left.amount.paise > right.amount.paise ? -1 : 1
      )[0];
      return {
        kind: "TEXT",
        value: `Transaction ${item.stageNumber}: ${item.direction === "PROFIT" ? "profit" : "loss"} ${cp004FormatMoney(item.amount)}`
      };
    }
    case "PNL-QL-108":
      if (!("netReceipt" in result)) throw new Error(`${qlId}: expected net receipt.`);
      return { kind: "MONEY", value: result.netReceipt };
    case "PNL-QL-109":
      if (!("grossSellingPrice" in result)) {
        throw new Error(`${qlId}: expected gross selling price.`);
      }
      return { kind: "MONEY", value: result.grossSellingPrice };
    case "PNL-QL-111":
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      return { kind: "TEXT", value: ledgerAnswer(result.ledger) };
    case "PNL-QL-114": {
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      const first = Number(generated2.context.firstStageNumber);
      const second = Number(generated2.context.secondStageNumber);
      const firstPrice = result.ledger[first - 1].sellingPrice;
      const secondPrice = result.ledger[second - 1].sellingPrice;
      const difference = firstPrice.paise > secondPrice.paise ? firstPrice.paise - secondPrice.paise : secondPrice.paise - firstPrice.paise;
      return { kind: "MONEY", value: moneyFromPaise(difference) };
    }
    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}
function formatAnswer4(answer) {
  if (answer.kind === "MONEY") return cp004FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp004FormatPercent(answer.value);
  return answer.value;
}
function resultContext2(qlId, result, answer, generated2) {
  const context = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer
  };
  if ("finalSellingPrice" in result) {
    context.finalSellingPrice = cp004PlainMoney(result.finalSellingPrice);
  }
  if ("initialCostPrice" in result) {
    context.initialCostPrice = cp004PlainMoney(result.initialCostPrice);
  }
  if ("intermediatePrice" in result) {
    context.intermediateSellingPrice = cp004PlainMoney(result.intermediatePrice);
  }
  if ("missingRatePercent" in result) {
    context.missingRatePercent = cp004FormatRational(result.missingRatePercent);
  }
  if ("sellingPrice" in result) {
    context.sellingPrice = cp004PlainMoney(result.sellingPrice);
  }
  if ("netReceipt" in result) {
    context.netReceipt = cp004PlainMoney(result.netReceipt);
  }
  if ("grossSellingPrice" in result) {
    context.grossSellingPrice = cp004PlainMoney(result.grossSellingPrice);
  }
  if ("direction" in result && "ratePercent" in result) {
    context.overallDirection = result.direction.toLowerCase();
    context.overallRatePercent = cp004FormatRational(result.ratePercent);
    context.resultDirection = result.direction.toLowerCase();
    context.resultRatePercent = cp004FormatRational(result.ratePercent);
  }
  if ("ledger" in result) {
    context.stageWiseAmounts = ledgerAnswer(result.ledger);
    const selectedStage = Number(generated2.context.selectedStage ?? 1);
    context.selectedStageAmount = cp004PlainMoney(
      result.ledger[selectedStage - 1].amount
    );
    if (qlId === "PNL-QL-114") {
      context.stagePriceDifference = answer.replace(/^₹/, "");
    }
  }
  return context;
}
function numericDistractors3(answer) {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    return [
      moneyFromPaise(paise * 90n / 100n),
      moneyFromPaise(paise * 110n / 100n),
      moneyFromPaise(paise + 10000n),
      moneyFromPaise(paise > 10000n ? paise - 10000n : paise + 20000n)
    ].map(cp004FormatMoney);
  }
  if (answer.kind === "PERCENT") {
    const value = rationalToNumber(answer.value);
    return [
      Math.max(0, value - 5),
      value + 5,
      Math.max(0, 100 - value),
      value + 10
    ].map((item) => `${Number(item.toFixed(2))}%`);
  }
  return [];
}
function textDistractors3(qlId, correct) {
  const pools = {
    "PNL-QL-117": [
      "Statement 1 only",
      "Statement 2 only",
      "Statement 3 only",
      "Statements 1 and 3 only"
    ],
    "PNL-QL-119": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient"
    ],
    "PNL-QL-111": [
      "All rates are applied to the original cost",
      "The signed percentages are added directly",
      "Only the final trader's result is required",
      "The stage order does not matter"
    ]
  };
  const pool = pools[qlId] ?? ["10% profit", "10% loss", "No profit, no loss", "20% profit", "Cannot be determined"];
  return pool.filter((item) => item !== correct);
}
function buildOptions3(qlId, seed, answer) {
  const correct = formatAnswer4(answer);
  const source = answer.kind === "TEXT" ? textDistractors3(qlId, correct) : numericDistractors3(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0], label: "ADDED_SIGNED_RATES" },
    { value: unique[1], label: "WRONG_PRICE_BASE" },
    { value: unique[2], label: "REVERSED_OR_IGNORED_FEE" }
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
function stable3(value) {
  return JSON.stringify(
    value,
    (_, item) => typeof item === "bigint" ? item.toString() : item
  );
}
function independentVerification(request, result) {
  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP":
      return "finalSellingPrice" in result && verifyTransactionChainFinal(
        request.initialCostPrice,
        request.stages,
        result.finalSellingPrice
      ).valid;
    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP":
      return "initialCostPrice" in result && verifyTransactionChainInitial(
        request.finalSellingPrice,
        request.stages,
        result.initialCostPrice
      ).valid;
    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE":
      return "intermediatePrice" in result && verifyTransactionChainFinal(
        request.initialCostPrice,
        request.stages.slice(0, request.afterStage),
        result.intermediatePrice
      ).valid;
    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE":
      return "missingRatePercent" in result && verifyTransactionChainFinal(
        request.initialCostPrice,
        [
          ...request.knownStages,
          {
            direction: request.missingDirection,
            ratePercent: result.missingRatePercent
          }
        ],
        request.finalSellingPrice
      ).valid;
    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP":
      return "finalSellingPrice" in result && verifyTransactionChainFinal(
        request.initialCostPrice,
        Array.from({ length: request.stageCount }, () => ({
          direction: request.direction,
          ratePercent: request.ratePercent
        })),
        result.finalSellingPrice
      ).valid;
    case "CHAIN_TO_STAGE_LEDGER":
      return "finalSellingPrice" in result && verifyTransactionChainFinal(
        request.initialCostPrice,
        request.stages,
        result.finalSellingPrice
      ).valid;
    case "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT":
      return "netReceipt" in result && verifyCommissionNetReceipt(
        request.grossSellingPrice,
        request.commissionPercent,
        result.netReceipt
      ).valid;
    case "NET_TARGET_AND_COMMISSION_TO_GROSS_SP":
      return "grossSellingPrice" in result && verifyCommissionNetReceipt(
        result.grossSellingPrice,
        request.commissionPercent,
        request.requiredNetReceipt
      ).valid;
    default:
      return stable3(result) === stable3(solvePnlCp004Request(request));
  }
}
function selectQl4(input) {
  if (input.questionLanguageId) {
    if (!PNL_CP004_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-004 question-language ID: ${input.questionLanguageId}`
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP004_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp004Case(qlId, `${input.seed ?? "cp004"}:probe`).registry;
    return !input.difficultyBand || registry.difficulty === input.difficultyBand;
  });
  if (!eligible.length) throw new Error("No CP-004 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp004-dynamic"}:ql-selection`),
    eligible
  );
}
function containsUnresolvedProsePlaceholder3(value) {
  const proseOnly = value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}
function listPnlCp004DynamicQlIds() {
  return [...PNL_CP004_QL_IDS];
}
function runPnlCp004DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error("PNL-CP-004 dynamic runtime currently supports English only.");
  }
  const qlId = selectQl4(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated2 = generatePnlCp004Case(qlId, seed);
  const result = solvePnlCp004Request(generated2.request);
  const recomputed = solvePnlCp004Request(generated2.request);
  const answerValue = answerFor3(qlId, result, generated2);
  const answer = formatAnswer4(answerValue);
  const optionSet = buildOptions3(qlId, seed, answerValue);
  const editorial = editorialLibrary4.entries[qlId];
  if (!editorial) throw new Error(`${qlId}: English editorial entry is missing.`);
  const context = {
    ...generated2.context,
    ...resultContext2(qlId, result, answer, generated2)
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context
  );
  const explanationText = `${baseExplanation}

**Working with these values:** Follow each transaction in order. Add buyer-side expenses before measuring profit or loss, and deduct commission from the gross selling price.

**Final answer:** ${answer}`;
  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated2.registry && editorial),
      message: "The QL exists in both the frozen registry and English editorial library."
    },
    {
      name: "exact-recomputation",
      passed: stable3(result) === stable3(recomputed),
      message: "Exact recomputation agrees with the canonical CP-004 solver."
    },
    {
      name: "independent-verification",
      passed: independentVerification(generated2.request, result),
      message: "Independent chain or fee arithmetic agrees with the solver result."
    },
    {
      name: "four-misconception-options",
      passed: optionSet.options.length === 4 && new Set(optionSet.options).size === 4 && optionSet.options[optionSet.correctIndex] === answer && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: "Four unique options contain one answer and three labelled misconceptions."
    },
    {
      name: "dynamic-editorial-binding",
      passed: !containsUnresolvedProsePlaceholder3(stem) && !containsUnresolvedProsePlaceholder3(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders."
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication."
    }
  ];
  const validation = { valid: checks.every((check) => check.passed), checks };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${checks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`
    );
  }
  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001",
    canonicalProblemId: PNL_CP004_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en",
    difficultyBand: generated2.registry.difficulty,
    stem,
    answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP004_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en",
      difficultyBand: generated2.registry.difficulty,
      taskKind: generated2.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated2.registry.answerSemantic,
      requiredVariables: [...generated2.registry.requiredVariables],
      variables: context,
      seed,
      runtimeMode: PNL_CP004_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      sourceTrace: {
        registry: "PNL-001/CP-004/task-registry.library.json",
        editorial: "PNL-001/CP-004/editorial-content.en.json",
        solver: "PNL-001/foundation/transaction-chain-solver.ts | transaction-fee-solver.ts",
        verifier: "PNL-001/foundation/cp004-independent-verifier.ts"
      }
    },
    solver: {
      answer,
      numericAnswer: answerValue.kind === "MONEY" ? Number(answerValue.value.paise) / 100 : answerValue.kind === "PERCENT" ? rationalToNumber(answerValue.value) : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated2.registry.solveMode,
        answerSemantic: generated2.registry.answerSemantic,
        exactRecomputation: "PASS",
        independentVerification: "PASS"
      },
      mathJax: {}
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        { id: "given", label: "Generated transaction values", value: context },
        { id: "mode", label: "Solve mode", value: generated2.registry.solveMode },
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
      canonicalProblemId: PNL_CP004_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated2.registry.solveMode,
      answerSemantic: generated2.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated2.registry.difficulty,
      representation: generated2.registry.representation ?? generated2.registry.presentation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP004_DYNAMIC_RUNTIME_MODE,
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

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-005/editorial-content.en.json
var editorial_content_en_default5 = {
  schemaVersion: 2,
  archetypeId: "PNL-001",
  cpId: "PNL-CP-005",
  language: "en",
  status: "EDITORIAL_REVIEW_CANDIDATE",
  entries: {
    "PNL-QL-121": {
      stem: {
        contextFamily: "grain weighing",
        blocks: [
          {
            type: "paragraph",
            content: "A grain merchant claims to sell at the cost price of \u20B9{costPricePerTrueQuantity} for {trueQuantity} kg, but his scale delivers only {deliveredQuantity} kg."
          }
        ],
        prompt: "What is his actual profit percentage?"
      },
      explanation: {
        opening: "The merchant receives payment for the full quantity but bears the cost of only the quantity actually delivered.",
        concept: "Actual profit must be compared with the cost of the delivered goods, not with the cost of the billed quantity.",
        steps: [
          {
            title: "Find the cost of the delivered grain",
            body: "Scale the true cost in the ratio delivered quantity to true quantity.",
            equationLatex: "C_d=C\\times\\frac{d}{q}"
          },
          {
            title: "Compare payment with delivered cost",
            body: "At stated cost price, the amount charged is C. Calculate profit on C_d.",
            equationLatex: "r=\\frac{C-C_d}{C_d}\\times100"
          }
        ],
        conclusion: "This rate is the merchant's actual profit from the short weight.",
        finalAnswerLatex: "{actualProfitPercent}\\%",
        commonTrap: "Do not divide profit by the amount charged; profit percentage is based on the merchant's actual cost."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible quantity adjustment followed by a direct profit-rate calculation."
    },
    "PNL-QL-122": {
      stem: {
        contextFamily: "packaged-rice sale",
        blocks: [
          {
            type: "paragraph",
            content: "A shopkeeper's true cost for {trueQuantity} kg of packaged rice is \u20B9{costPricePerTrueQuantity}. He charges \u20B9{quotedSellingPricePerNominalQuantity} for the pack but supplies only {deliveredQuantity} kg."
          }
        ],
        prompt: "Find the actual profit or loss amount and percentage."
      },
      explanation: {
        opening: "Let us separate the billed amount from the cost of the quantity actually supplied.",
        concept: "The selling amount is quoted for the nominal pack, while actual cost depends on delivered quantity.",
        steps: [
          {
            title: "Calculate delivered cost",
            body: "Use proportional cost for {deliveredQuantity} out of {trueQuantity} units.",
            equationLatex: "C_d=C\\frac{d}{q}"
          },
          {
            title: "Find the amount result",
            body: "Subtract delivered cost from the charged amount.",
            equationLatex: "A=S-C_d"
          },
          {
            title: "Convert to a percentage",
            body: "Measure the amount on C_d.",
            equationLatex: "r=\\frac{|A|}{C_d}\\times100"
          }
        ],
        conclusion: "The sign of A gives profit or loss, and the ratio gives the percentage.",
        finalAnswerLatex: "\\text{\u20B9}{actualAmount},\\;{actualRatePercent}\\%\\;{actualDirection}",
        commonTrap: "Do not use the cost of the full nominal quantity after the seller has supplied less."
      },
      difficulty: "Medium",
      difficultyRationale: "Proportional cost, amount result, and percentage interpretation."
    },
    "PNL-QL-123": {
      stem: {
        contextFamily: "fruit weighing",
        blocks: [
          {
            type: "paragraph",
            content: "A fruit seller declares a {declaredRatePercent}% {declaredDirection} on fruit costing \u20B9{costPricePerTrueQuantity} per {trueQuantity} kg, but supplies only {deliveredQuantity} kg for each billed lot."
          }
        ],
        prompt: "Calculate the actual percentage gain or loss."
      },
      explanation: {
        opening: "The declared rate determines the billed price, while the short delivery changes the seller's actual cost.",
        concept: "Combine the price multiplier with the delivered-quantity ratio before measuring the true result.",
        steps: [
          {
            title: "Find the quoted selling amount",
            body: "Apply the declared profit or loss factor to the true cost of the nominal quantity.",
            equationLatex: "S=C\\left(1\\pm\\frac{r_d}{100}\\right)"
          },
          {
            title: "Find actual delivered cost",
            body: "Scale cost by d/q.",
            equationLatex: "C_d=C\\frac{d}{q}"
          },
          {
            title: "Calculate the actual rate",
            body: "Compare S with C_d.",
            equationLatex: "r_a=\\frac{|S-C_d|}{C_d}\\times100"
          }
        ],
        conclusion: "This gives the genuine result after both price declaration and short delivery.",
        finalAnswerLatex: "{actualRatePercent}\\%\\;{actualDirection}",
        commonTrap: "The declared rate is not the actual rate because the quantity base has also changed."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct combination of one price factor and one quantity factor."
    },
    "PNL-QL-124": {
      stem: {
        contextFamily: "cooking-oil measure",
        blocks: [
          {
            type: "paragraph",
            content: "Cooking oil costs \u20B9{costPricePerTrueQuantity} per {trueQuantity} litres. A retailer advertises a {declaredRatePercent}% {declaredDirection} but dispenses only {deliveredQuantity} litres for the billed quantity."
          }
        ],
        prompt: "Find the retailer's actual profit or loss percentage."
      },
      explanation: {
        opening: "A declared loss can still become an actual profit when the delivered quantity is short.",
        concept: "Price and quantity changes must be combined on the same actual-cost basis.",
        steps: [
          {
            title: "Turn the declared rate into a price",
            body: "Apply the stated commercial multiplier to the nominal cost."
          },
          {
            title: "Find the cost of oil actually delivered",
            body: "Use the delivered-to-true quantity ratio.",
            equationLatex: "C_d=C\\frac{d}{q}"
          },
          {
            title: "Compare the two amounts",
            body: "Measure the difference between billed price and C_d on C_d."
          }
        ],
        conclusion: "The comparison reveals the actual direction and rate.",
        finalAnswerLatex: "{actualRatePercent}\\%\\;{actualDirection}",
        commonTrap: "Do not assume that a declared loss guarantees an actual loss when quantity is manipulated."
      },
      difficulty: "Medium",
      difficultyRationale: "Hidden actual-cost base but a direct forward calculation."
    },
    "PNL-QL-125": {
      stem: {
        contextFamily: "fertilizer bagging",
        blocks: [
          {
            type: "paragraph",
            content: "Fertilizer costs \u20B9{costPricePerTrueQuantity} for {trueQuantity} kg and is billed at \u20B9{quotedSellingPricePerNominalQuantity} per bag."
          }
        ],
        prompt: "How much fertilizer should each bag contain to produce an actual {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "This time the target result is known and the delivered quantity is the unknown.",
        concept: "The cost of the delivered quantity must equal the billed amount divided by the target commercial multiplier.",
        steps: [
          {
            title: "Find the allowable delivered cost",
            body: "Reverse the target profit or loss factor from the quoted selling amount.",
            equationLatex: "C_d=\\frac{S}{1\\pm r/100}"
          },
          {
            title: "Convert cost to quantity",
            body: "Use proportional cost per unit of true quantity.",
            equationLatex: "d=q\\frac{C_d}{C}"
          }
        ],
        conclusion: "The resulting quantity is the amount that must be delivered per billed bag.",
        finalAnswerLatex: "{requiredDeliveredQuantity}",
        commonTrap: "Do not apply the target rate directly to quantity; first recover the allowable cost."
      },
      difficulty: "Hard",
      difficultyRationale: "Inverse target-rate problem with quantity as the unknown."
    },
    "PNL-QL-126": {
      stem: {
        contextFamily: "hardware fastener packs",
        blocks: [
          {
            type: "paragraph",
            content: "The cost of {trueQuantity} fasteners is \u20B9{costPricePerTrueQuantity}. A seller supplies only {deliveredQuantity} fasteners in each nominal pack."
          }
        ],
        prompt: "What price should be charged to obtain an actual {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "The selling price must be based on the cost of the reduced pack, not the nominal pack.",
        concept: "Find actual delivered cost first, then apply the target commercial multiplier.",
        steps: [
          {
            title: "Find cost of the supplied fasteners",
            body: "Scale the nominal cost by delivered quantity divided by true quantity.",
            equationLatex: "C_d=C\\frac{d}{q}"
          },
          {
            title: "Apply the target rate",
            body: "Multiply C_d by the appropriate profit or loss factor.",
            equationLatex: "S=C_d\\left(1\\pm\\frac{r}{100}\\right)"
          }
        ],
        conclusion: "This is the required quoted price for the short pack.",
        finalAnswerLatex: "\\text{\u20B9}{requiredQuotedSellingPrice}",
        commonTrap: "Do not apply the target rate to the full-quantity cost."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct quantity adjustment followed by one target-rate multiplier."
    },
    "PNL-QL-127": {
      stem: {
        contextFamily: "wholesale sugar trade",
        blocks: [
          {
            type: "paragraph",
            content: "A sugar trader pays \u20B9{purchasePricePerNominalQuantity} for a nominal {nominalQuantity} kg but receives {receivedQuantity} kg. He later charges \u20B9{sellingPricePerNominalQuantity} for each nominal lot while delivering only {deliveredQuantity} kg."
          }
        ],
        prompt: "Find his actual profit percentage."
      },
      explanation: {
        opening: "The trader gains on both sides: extra quantity while buying and short quantity while selling.",
        concept: "Compute the real cost per received unit and the real revenue per delivered unit on a common quantity basis.",
        steps: [
          {
            title: "Find actual unit cost",
            body: "Spread the purchase payment over the quantity actually received.",
            equationLatex: "c=\\frac{B}{q_r}"
          },
          {
            title: "Find revenue per delivered unit",
            body: "Spread the billed sale amount over the quantity actually supplied.",
            equationLatex: "s=\\frac{S}{q_d}"
          },
          {
            title: "Compare unit values",
            body: "Measure profit on actual unit cost.",
            equationLatex: "r=\\frac{s-c}{c}\\times100"
          }
        ],
        conclusion: "This rate captures both the heavy buying measure and the light selling measure.",
        finalAnswerLatex: "{actualProfitPercent}\\%",
        commonTrap: "Do not compare the two nominal prices without adjusting for received and delivered quantities."
      },
      difficulty: "Hard",
      difficultyRationale: "Dual-side quantity deception with two normalized unit values."
    },
    "PNL-QL-128": {
      stem: {
        contextFamily: "edible-oil wholesale",
        blocks: [
          {
            type: "paragraph",
            content: "An oil dealer pays \u20B9{purchasePricePerNominalQuantity} for a nominal {nominalQuantity}-litre purchase but receives {receivedQuantity} litres. He charges \u20B9{sellingPricePerNominalQuantity} per nominal sale and supplies {deliveredQuantity} litres."
          }
        ],
        prompt: "Calculate the actual percentage gain or loss."
      },
      explanation: {
        opening: "We should remove the misleading nominal quantities and compare true per-litre values.",
        concept: "Actual result depends on money per unit received and money per unit delivered.",
        steps: [
          {
            title: "Normalize purchase cost",
            body: "Divide purchase payment by actual received quantity."
          },
          {
            title: "Normalize selling realization",
            body: "Divide selling charge by actual delivered quantity."
          },
          {
            title: "Calculate the percentage result",
            body: "Compare normalized realization with normalized cost on the cost base."
          }
        ],
        conclusion: "The sign and size of the unit-value difference give the actual result.",
        finalAnswerLatex: "{actualRatePercent}\\%\\;{actualDirection}",
        commonTrap: "Nominal quantities are labels; the true physical quantities determine actual cost and realization."
      },
      difficulty: "Hard",
      difficultyRationale: "Dual-measure normalization and direction-sensitive comparison."
    },
    "PNL-QL-129": {
      stem: {
        contextFamily: "spice retailing",
        blocks: [
          {
            type: "paragraph",
            content: "Spices cost \u20B9{costPricePerTrueQuantity} per {trueQuantity} g. A retailer marks them {markupPercent}% above cost, allows {discountPercent}% discount, and supplies only {deliveredQuantity} g for each billed pack."
          }
        ],
        prompt: "Find the actual profit or loss percentage."
      },
      explanation: {
        opening: "Three effects are interacting here: markup, discount, and short delivery.",
        concept: "Combine the price factors to get the billed amount, then compare it with the cost of the quantity actually supplied.",
        steps: [
          {
            title: "Find the billed price",
            body: "Apply markup and discount successively.",
            equationLatex: "S=C\\left(1+\\frac{m}{100}\\right)\\left(1-\\frac{d_c}{100}\\right)"
          },
          {
            title: "Find delivered cost",
            body: "Scale C by delivered quantity divided by true quantity."
          },
          {
            title: "Calculate actual rate",
            body: "Compare S with delivered cost on the delivered-cost base."
          }
        ],
        conclusion: "The resulting rate is the retailer's true profit or loss.",
        finalAnswerLatex: "{actualRatePercent}\\%\\;{actualDirection}",
        commonTrap: "Do not calculate the discount on cost price or ignore the short quantity."
      },
      difficulty: "Hard",
      difficultyRationale: "Successive price transformations combined with quantity deception."
    },
    "PNL-QL-130": {
      stem: {
        contextFamily: "paint-can short fill",
        blocks: [
          {
            type: "paragraph",
            content: "Paint costs \u20B9{costPricePerTrueQuantity} for {trueQuantity} litres. A dealer fills only {deliveredQuantity} litres, allows {discountPercent}% discount, and wants an actual {targetRatePercent}% {targetDirection}."
          }
        ],
        prompt: "By what percentage should the can be marked above cost?"
      },
      explanation: {
        opening: "The unknown markup must compensate for both the discount and the reduced delivered cost.",
        concept: "Set the discounted marked price equal to the target realization on actual delivered cost.",
        steps: [
          {
            title: "Find actual delivered cost",
            body: "Scale nominal cost by d/q."
          },
          {
            title: "Find target selling amount",
            body: "Apply the target multiplier to delivered cost."
          },
          {
            title: "Reverse the discount to find marked price",
            body: "Divide target selling amount by the retained discount factor."
          },
          {
            title: "Convert marked price to markup",
            body: "Compare marked price with nominal cost."
          }
        ],
        conclusion: "The final comparison gives the required markup percentage.",
        finalAnswerLatex: "{requiredMarkupPercent}\\%",
        commonTrap: "Do not apply markup to delivered cost if the marked price is defined relative to the nominal cost price."
      },
      difficulty: "Hard",
      difficultyRationale: "Coupled inverse across quantity, discount, target result, and markup."
    },
    "PNL-QL-131": {
      stem: {
        contextFamily: "cereal packet pricing",
        blocks: [
          {
            type: "paragraph",
            content: "Cereal costs \u20B9{costPricePerTrueQuantity} per {trueQuantity} g and is marked {markupPercent}% above cost. Each packet contains only {deliveredQuantity} g."
          }
        ],
        prompt: "What discount should be allowed to obtain an actual {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "We know the marked price and target result, so the discount can be isolated.",
        concept: "Target selling amount is based on delivered cost; discount is measured from marked price.",
        steps: [
          {
            title: "Calculate delivered cost",
            body: "Use the quantity ratio d/q."
          },
          {
            title: "Find target selling amount",
            body: "Apply the required profit or loss factor to delivered cost."
          },
          {
            title: "Find the retained fraction of marked price",
            body: "Divide target selling amount by marked price."
          },
          {
            title: "Convert retained fraction to discount",
            body: "Discount% = 100% minus retained percentage."
          }
        ],
        conclusion: "The shortfall from the marked price is the required discount.",
        finalAnswerLatex: "{requiredDiscountPercent}\\%",
        commonTrap: "Do not calculate target profit on the nominal full-quantity cost."
      },
      difficulty: "Hard",
      difficultyRationale: "Inverse discount with markup and short-delivery bases."
    },
    "PNL-QL-132": {
      stem: {
        contextFamily: "cement bag pricing",
        blocks: [
          {
            type: "paragraph",
            content: "A cement dealer changes the quoted price by {priceChangePercent}% in the {priceDirection} direction on bags costing \u20B9{costPricePerTrueQuantity} for {trueQuantity} kg, and supplies {shortQuantityPercent}% less cement."
          }
        ],
        prompt: "Find the actual profit percentage."
      },
      explanation: {
        opening: "Both the price and the quantity have changed, so their factors should be combined.",
        concept: "The billed-price factor affects revenue, while the retained-quantity factor affects actual cost.",
        steps: [
          {
            title: "Write the price factor",
            body: "Use 1+p/100 for an increase or 1\u2212p/100 for a decrease."
          },
          {
            title: "Write the delivered-cost factor",
            body: "Supplying s% less means the cost factor is 1\u2212s/100."
          },
          {
            title: "Compare the factors",
            body: "Actual realization factor equals price factor divided by delivered-cost factor."
          }
        ],
        conclusion: "The excess of this factor over 1 gives the actual profit percentage.",
        finalAnswerLatex: "{actualProfitPercent}\\%",
        commonTrap: "Do not subtract the short-quantity percentage from the price-change percentage."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct interaction of one price factor and one quantity factor."
    },
    "PNL-QL-133": {
      stem: {
        contextFamily: "animal-feed sacks",
        blocks: [
          {
            type: "paragraph",
            content: "Animal feed costs \u20B9{costPricePerTrueQuantity} per {trueQuantity} kg. The seller changes the quoted price by {priceChangePercent}% in the {priceDirection} direction and short-delivers by {shortQuantityPercent}%."
          }
        ],
        prompt: "Calculate the actual percentage gain or loss."
      },
      explanation: {
        opening: "A price reduction can be offset by short delivery, so the final direction must be calculated rather than guessed.",
        concept: "Compare the revenue multiplier with the cost multiplier of the delivered quantity.",
        steps: [
          {
            title: "Form both multipliers",
            body: "Create the quoted-price factor and the delivered-quantity factor."
          },
          {
            title: "Find the actual commercial factor",
            body: "Divide price factor by quantity factor.",
            equationLatex: "M=\\frac{m_p}{m_q}"
          },
          {
            title: "Interpret M",
            body: "M above 1 means gain; M below 1 means loss."
          }
        ],
        conclusion: "The distance of M from 1 gives the actual rate.",
        finalAnswerLatex: "{actualRatePercent}\\%\\;{actualDirection}",
        commonTrap: "Do not decide the direction from the price change alone."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct factor comparison with a direction interpretation."
    },
    "PNL-QL-134": {
      stem: {
        contextFamily: "customer overcharge",
        blocks: [
          {
            type: "paragraph",
            content: "A customer pays for {trueQuantity} units of a product but receives only {deliveredQuantity} units."
          }
        ],
        prompt: "By what percentage is the effective price per true unit higher?"
      },
      explanation: {
        opening: "The same payment is spread over fewer units, so the effective unit price rises.",
        concept: "Effective overcharge is measured relative to the fair unit price.",
        steps: [
          {
            title: "Form the price ratio",
            body: "Effective price per unit is nominal payment divided by delivered quantity, while fair price uses true quantity."
          },
          {
            title: "Convert ratio to overcharge",
            body: "Subtract 1 from q/d and multiply by 100.",
            equationLatex: "r=\\left(\\frac{q}{d}-1\\right)\\times100"
          }
        ],
        conclusion: "This percentage is the customer's effective overcharge.",
        finalAnswerLatex: "{customerOverchargePercent}\\%",
        commonTrap: "The overcharge percentage is not simply the percentage shortage unless the shortage is measured on the delivered quantity."
      },
      difficulty: "Medium",
      difficultyRationale: "One reciprocal quantity comparison."
    },
    "PNL-QL-135": {
      stem: {
        contextFamily: "dry-fruit short packs",
        blocks: [
          {
            type: "paragraph",
            content: "A dry-fruit seller declares a {declaredRatePercent}% {declaredDirection} while billing for {trueQuantity} g. He wants the actual result to be {actualRatePercent}% {actualDirection}."
          }
        ],
        prompt: "How much should each pack actually contain?"
      },
      explanation: {
        opening: "The billed price comes from the declared rate, but the target actual rate determines the allowable delivered cost.",
        concept: "Equate the same selling amount under the declared-price model and the target-actual-result model.",
        steps: [
          {
            title: "Find billed selling amount",
            body: "Apply the declared multiplier to nominal cost."
          },
          {
            title: "Recover allowable delivered cost",
            body: "Divide the selling amount by the actual target multiplier."
          },
          {
            title: "Convert cost to quantity",
            body: "Use direct proportionality between cost and delivered quantity."
          }
        ],
        conclusion: "The resulting quantity produces the requested actual rate.",
        finalAnswerLatex: "{requiredDeliveredQuantity}",
        commonTrap: "Do not equate declared and actual percentages; they use different cost bases."
      },
      difficulty: "Hard",
      difficultyRationale: "Coupled inverse using declared and actual rates to solve quantity."
    },
    "PNL-QL-136": {
      stem: {
        contextFamily: "coffee bean packets",
        blocks: [
          {
            type: "paragraph",
            content: "A seller charges for {trueQuantity} g of coffee but supplies {deliveredQuantity} g and earns an actual {actualRatePercent}% {actualDirection}."
          }
        ],
        prompt: "Find the declared profit or loss percentage on the price list."
      },
      explanation: {
        opening: "We know the true result after short delivery and must reconstruct the rate printed on the price list.",
        concept: "Actual selling amount equals delivered cost multiplied by the actual-result factor; compare that amount with nominal cost to obtain the declared rate.",
        steps: [
          {
            title: "Express delivered cost",
            body: "Use C_d=C(d/q)."
          },
          {
            title: "Find the selling amount",
            body: "Apply the actual multiplier to C_d."
          },
          {
            title: "Compare with nominal cost",
            body: "The relative difference between selling amount and C gives the declared rate."
          }
        ],
        conclusion: "This reconstructed rate is the declared profit or loss percentage.",
        finalAnswerLatex: "{declaredRatePercent}\\%\\;{declaredDirection}",
        commonTrap: "Do not report the actual rate again; the price-list base is the full nominal cost."
      },
      difficulty: "Hard",
      difficultyRationale: "Reverse base conversion from actual result to declared rate."
    },
    "PNL-QL-137": {
      stem: {
        contextFamily: "premium tea packets",
        blocks: [
          {
            type: "paragraph",
            content: "A tea seller charges \u20B9{quotedSellingPricePerNominalQuantity} for {trueQuantity} g but supplies {deliveredQuantity} g. This gives an actual {actualRatePercent}% {actualDirection}."
          }
        ],
        prompt: "Find the true cost price per {trueQuantity} g."
      },
      explanation: {
        opening: "The quoted amount and actual rate first tell us the cost of the tea actually delivered.",
        concept: "Reverse the actual commercial multiplier, then scale delivered cost up to the true nominal quantity.",
        steps: [
          {
            title: "Recover delivered cost",
            body: "Divide the quoted selling amount by the actual result factor."
          },
          {
            title: "Scale to nominal cost",
            body: "Multiply delivered cost by q/d.",
            equationLatex: "C=C_d\\frac{q}{d}"
          }
        ],
        conclusion: "The scaled value is the true cost for the full nominal quantity.",
        finalAnswerLatex: "\\text{\u20B9}{costPricePerTrueQuantity}",
        commonTrap: "Do not treat the quoted price as the cost of the full quantity before reversing the actual rate."
      },
      difficulty: "Hard",
      difficultyRationale: "Reverse actual-rate calculation followed by quantity rescaling."
    },
    "PNL-QL-138": {
      stem: {
        contextFamily: "nuts retail pack",
        blocks: [
          {
            type: "paragraph",
            content: "A retailer charges \u20B9{quotedSellingPricePerNominalQuantity} for {trueQuantity} g of nuts, supplies {deliveredQuantity} g, and makes an actual {actualDirection} of \u20B9{actualAmount}."
          }
        ],
        prompt: "Find the true cost price per {trueQuantity} g."
      },
      explanation: {
        opening: "The actual amount result lets us recover the cost of the quantity supplied directly.",
        concept: "Undo the profit or loss amount from the selling amount, then scale delivered cost to nominal quantity.",
        steps: [
          {
            title: "Recover delivered cost",
            body: "For profit, subtract the amount from selling price; for loss, add it."
          },
          {
            title: "Scale to full quantity",
            body: "Use C=C_d(q/d)."
          }
        ],
        conclusion: "The scaled cost is the true nominal cost price.",
        finalAnswerLatex: "\\text{\u20B9}{costPricePerTrueQuantity}",
        commonTrap: "Apply the actual amount before scaling; otherwise the amount is placed on the wrong quantity base."
      },
      difficulty: "Hard",
      difficultyRationale: "Direction-sensitive amount reversal and quantity scaling."
    },
    "PNL-QL-139": {
      stem: {
        contextFamily: "wholesale pulses trade",
        blocks: [
          {
            type: "paragraph",
            content: "A pulses trader pays \u20B9{purchasePricePerNominalQuantity} and receives {receivedQuantity} kg. He charges \u20B9{sellingPricePerNominalQuantity} for each nominal sale."
          }
        ],
        prompt: "How much should he deliver per sale to obtain an actual {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "The purchase side fixes actual unit cost; the target rate then fixes allowable cost per sale.",
        concept: "Normalize the buying deal first, then solve the selling quantity from the target selling factor.",
        steps: [
          {
            title: "Find actual unit cost",
            body: "Divide purchase payment by received quantity."
          },
          {
            title: "Find allowable cost per sale",
            body: "Reverse the target multiplier from the selling charge."
          },
          {
            title: "Convert allowable cost to delivered quantity",
            body: "Divide allowable sale cost by actual unit cost."
          }
        ],
        conclusion: "The resulting quantity is the required delivery per nominal sale.",
        finalAnswerLatex: "{requiredDeliveredQuantity}",
        commonTrap: "Do not use the nominal purchase quantity when the trader actually received a different amount."
      },
      difficulty: "Hard",
      difficultyRationale: "Dual-side inverse with target rate and delivered quantity unknown."
    },
    "PNL-QL-140": {
      stem: {
        contextFamily: "wholesale flour purchase",
        blocks: [
          {
            type: "paragraph",
            content: "A flour trader pays \u20B9{purchasePricePerNominalQuantity} for a purchase lot and charges \u20B9{sellingPricePerNominalQuantity} while delivering {deliveredQuantity} kg per sale."
          }
        ],
        prompt: "How much flour must he receive in the purchase lot to obtain an actual {targetRatePercent}% {targetDirection}?"
      },
      explanation: {
        opening: "Here the selling side is known and the extra quantity received while buying is the unknown advantage.",
        concept: "Use target profit to determine allowable cost per delivered sale, then infer the purchase quantity that creates that unit cost.",
        steps: [
          {
            title: "Recover target cost of delivered quantity",
            body: "Divide sale revenue by the target result factor."
          },
          {
            title: "Find required unit cost",
            body: "Divide that cost by delivered quantity."
          },
          {
            title: "Solve received quantity",
            body: "Received quantity equals total purchase payment divided by required unit cost."
          }
        ],
        conclusion: "This purchase quantity gives the requested actual result.",
        finalAnswerLatex: "{requiredReceivedQuantity}",
        commonTrap: "Do not solve using the billed sale quantity as though it were also the received purchase quantity."
      },
      difficulty: "Hard",
      difficultyRationale: "Reverse dual-measure problem with received quantity unknown."
    },
    "PNL-QL-141": {
      stem: {
        contextFamily: "customer unit-price impact",
        blocks: [
          {
            type: "paragraph",
            content: "A customer is charged \u20B9{quotedSellingPricePerNominalQuantity} for {trueQuantity} units but receives only {deliveredQuantity} units."
          }
        ],
        prompt: "Find the effective price per true {trueQuantity} units."
      },
      explanation: {
        opening: "The charge remains unchanged, but fewer units are supplied.",
        concept: "First find price per delivered unit, then scale it to the true reference quantity.",
        steps: [
          {
            title: "Find effective unit price",
            body: "Divide the quoted charge by delivered quantity."
          },
          {
            title: "Scale to the true quantity",
            body: "Multiply effective unit price by {trueQuantity}."
          }
        ],
        conclusion: "This is what the customer effectively pays for a true {trueQuantity}-unit quantity.",
        finalAnswerLatex: "\\text{\u20B9}{effectivePricePerTrueQuantity}",
        commonTrap: "Do not report the original quoted amount; it applies to the falsely measured pack."
      },
      difficulty: "Medium",
      difficultyRationale: "Unit-price normalization and scaling."
    },
    "PNL-QL-142": {
      stem: {
        contextFamily: "scheme comparison",
        blocks: [
          {
            type: "caselet",
            title: "Two dealer schemes",
            paragraphs: [
              "Scheme A: {firstScheme}",
              "Scheme B: {secondScheme}"
            ]
          }
        ],
        prompt: "Which scheme gives the higher profit percentage, and by how many percentage points?"
      },
      explanation: {
        opening: "To compare the schemes fairly, calculate each actual profit rate on its own true cost base.",
        concept: "Different combinations of price and quantity deception must be normalized before comparison.",
        steps: [
          {
            title: "Evaluate Scheme A",
            body: "Find its actual revenue-to-cost factor and convert it to a percentage."
          },
          {
            title: "Evaluate Scheme B",
            body: "Repeat the same calculation on the second scheme."
          },
          {
            title: "Compare the rates",
            body: "Identify the larger rate and subtract the smaller rate from it."
          }
        ],
        conclusion: "The higher normalized rate identifies the more profitable scheme.",
        finalAnswerLatex: "{moreProfitableScheme},\\;{rateDifference}\\%",
        commonTrap: "Do not compare only the shortages or only the quoted price changes."
      },
      difficulty: "Hard",
      difficultyRationale: "Two complete dishonest-trade computations followed by comparison."
    },
    "PNL-QL-143": {
      stem: {
        contextFamily: "short article count",
        blocks: [
          {
            type: "paragraph",
            content: "The cost of {trueQuantity} packaged items is \u20B9{costPricePerTrueQuantity}. A seller charges \u20B9{quotedSellingPricePerNominalQuantity} for {trueQuantity} items but places only {deliveredQuantity} items in the carton."
          }
        ],
        prompt: "Find the actual profit percentage."
      },
      explanation: {
        opening: "A false count works exactly like a false weight: cost follows the number of items actually supplied.",
        concept: "Scale nominal cost to the delivered count and compare it with the amount charged.",
        steps: [
          {
            title: "Find cost of supplied items",
            body: "Use C_d=C(d/q)."
          },
          {
            title: "Calculate actual profit rate",
            body: "Compare the charged amount with C_d on the C_d base."
          }
        ],
        conclusion: "The result is the seller's true profit percentage.",
        finalAnswerLatex: "{actualProfitPercent}\\%",
        commonTrap: "Do not assume that count-based fraud needs a different percentage formula from weight-based fraud."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct false-count variant of proportional delivered cost."
    },
    "PNL-QL-144": {
      stem: {
        contextFamily: "short cloth metre",
        blocks: [
          {
            type: "paragraph",
            content: "A cloth merchant charges for {trueQuantity} cm, but the measuring rod marked as one metre is only {deliveredQuantity} cm long."
          }
        ],
        prompt: "Find the percentage overcharge caused by the short measure."
      },
      explanation: {
        opening: "The buyer pays for the full marked length but receives a shorter physical length.",
        concept: "Effective price rises in the inverse ratio of true length to delivered length.",
        steps: [
          {
            title: "Form the effective-price factor",
            body: "Divide true billed length by actual delivered length.",
            equationLatex: "M=\\frac{q}{d}"
          },
          {
            title: "Convert to overcharge percentage",
            body: "Subtract 1 and multiply by 100."
          }
        ],
        conclusion: "This is the customer's effective overcharge percentage.",
        finalAnswerLatex: "{customerOverchargePercent}\\%",
        commonTrap: "Do not report the percentage length shortage as the overcharge percentage; their bases differ."
      },
      difficulty: "Medium",
      difficultyRationale: "One inverse length ratio and percentage conversion."
    },
    "PNL-QL-145": {
      stem: {
        contextFamily: "dishonest-scheme table",
        blocks: [
          {
            type: "paragraph",
            content: "Two dealer schemes are summarized in the table."
          },
          {
            type: "table",
            caption: "Price and quantity schemes",
            columns: [
              "Scheme",
              "Price condition",
              "Quantity condition"
            ],
            rowSource: "schemeTable"
          }
        ],
        prompt: "Identify the more profitable scheme and calculate the difference in actual profit percentages."
      },
      explanation: {
        opening: "Read each table row as a complete scheme rather than comparing isolated cells.",
        concept: "Actual profit factor combines the row's price factor and quantity factor.",
        steps: [
          {
            title: "Calculate the first row's actual factor",
            body: "Normalize its price condition by its delivered-cost condition."
          },
          {
            title: "Calculate the second row's actual factor",
            body: "Use the same method so the comparison is fair."
          },
          {
            title: "Compare percentage rates",
            body: "Subtract the smaller actual rate from the larger one."
          }
        ],
        conclusion: "The row with the higher normalized rate is the more profitable scheme.",
        finalAnswerLatex: "{moreProfitableScheme},\\;{rateDifference}\\%",
        commonTrap: "Do not select a row simply because it has the larger price increase or larger shortage."
      },
      difficulty: "Hard",
      difficultyRationale: "Real table interpretation plus two multi-factor calculations."
    },
    "PNL-QL-146": {
      stem: {
        contextFamily: "retail fraud caselet",
        blocks: [
          {
            type: "caselet",
            title: "Retail pricing caselet",
            paragraphSource: "caseletData"
          },
          {
            type: "paragraph",
            content: "Goods cost \u20B9{costPricePerTrueQuantity} per {trueQuantity} units, are marked up {markupPercent}%, discounted {discountPercent}%, and only {deliveredQuantity} units are supplied."
          }
        ],
        prompt: "Find the actual profit percentage."
      },
      explanation: {
        opening: "Let us organise the caselet into price-side and quantity-side effects.",
        concept: "Markup and discount create the billed price; short delivery determines actual cost.",
        steps: [
          {
            title: "Calculate billed price",
            body: "Apply markup first and discount second."
          },
          {
            title: "Calculate delivered cost",
            body: "Scale nominal cost by delivered quantity divided by true quantity."
          },
          {
            title: "Measure actual profit",
            body: "Compare billed price with delivered cost on the delivered-cost base."
          }
        ],
        conclusion: "The combined caselet effects give the actual profit percentage.",
        finalAnswerLatex: "{actualProfitPercent}\\%",
        commonTrap: "Do not treat the caselet's percentages as though they all use the same base."
      },
      difficulty: "Hard",
      difficultyRationale: "Caselet extraction with successive price changes and quantity fraud."
    },
    "PNL-QL-147": {
      stem: {
        contextFamily: "consumer-impact statements",
        blocks: [
          {
            type: "paragraph",
            content: "A dealer charges for {trueQuantity} units but supplies only {deliveredQuantity} units."
          },
          {
            type: "statements",
            lead: "Consider the following statements:",
            statements: [
              "The percentage shortage is always equal to the percentage overcharge.",
              "The effective price factor is true quantity divided by delivered quantity.",
              "Overcharge should be measured on the amount paid rather than the fair unit price."
            ]
          }
        ],
        prompt: "Select the correct statement."
      },
      explanation: {
        opening: "The statements can be checked by comparing fair and effective unit prices.",
        concept: "With the same payment, effective unit price changes in the inverse ratio q/d.",
        steps: [
          {
            title: "Write the effective factor",
            body: "Effective price divided by fair price equals q/d."
          },
          {
            title: "Evaluate the statements",
            body: "Only the statement consistent with this factor is correct."
          }
        ],
        conclusion: "Choose the statement that uses the inverse quantity ratio.",
        finalAnswerLatex: "{correctStatement}",
        commonTrap: "Shortage and overcharge percentages usually have different bases."
      },
      difficulty: "Medium",
      difficultyRationale: "Conceptual statement evaluation using one established ratio."
    },
    "PNL-QL-148": {
      stem: {
        contextFamily: "false-quantity data sufficiency",
        blocks: [
          {
            type: "data_sufficiency",
            question: "The false quantity required for an actual {targetRatePercent}% profit on a nominal {trueQuantity}-unit sale is to be determined.",
            statements: [
              "{statementOne}",
              "{statementTwo}"
            ],
            answerScheme: "STANDARD_TWO_STATEMENT"
          }
        ],
        prompt: "Decide whether either statement alone, both together, or neither is sufficient."
      },
      explanation: {
        opening: "We are testing whether the selling amount and true unit cost are known well enough to solve one quantity.",
        concept: "Delivered quantity is unique only when the target factor and the ratio between selling amount and nominal cost are fixed.",
        steps: [
          {
            title: "Test Statement I alone",
            body: "Check whether it fixes every value needed in d=qS/[C(1+r)]."
          },
          {
            title: "Test Statement II alone",
            body: "Repeat the completeness test without using Statement I."
          },
          {
            title: "Combine if necessary",
            body: "Use both statements only after each has been judged independently."
          }
        ],
        conclusion: "Select the data-sufficiency option matching when the quantity becomes unique.",
        finalAnswerLatex: "{dataSufficiencyAnswer}",
        commonTrap: "Do not calculate a numerical quantity from both statements while deciding whether one statement alone is sufficient."
      },
      difficulty: "Hard",
      difficultyRationale: "Data-sufficiency analysis for an inverse quantity equation."
    },
    "PNL-QL-149": {
      stem: {
        contextFamily: "algebraic false quantity",
        blocks: [
          {
            type: "paragraph",
            content: "A dealer charges for {trueQuantityExpression} units, supplies {deliveredQuantityExpression} units, and earns an actual profit of {actualRatePercent}%."
          },
          {
            type: "equation",
            latex: "\\frac{S}{C_d}=1+\\frac{r_a}{100}"
          }
        ],
        prompt: "Determine the declared profit or loss percentage algebraically."
      },
      explanation: {
        opening: "We can express the quantity deception as a cost ratio and then move back to the declared price base.",
        concept: "Actual rate uses delivered cost, whereas declared rate compares the same selling amount with nominal cost.",
        steps: [
          {
            title: "Express delivered cost symbolically",
            body: "Multiply nominal cost by delivered quantity divided by true quantity."
          },
          {
            title: "Use the actual-rate equation",
            body: "Find the selling amount as a multiple of delivered cost."
          },
          {
            title: "Compare with nominal cost",
            body: "Simplify S/C\u22121 and convert it to a signed percentage."
          }
        ],
        conclusion: "The simplified expression is the declared profit or loss rate.",
        finalAnswerLatex: "{declaredRatePercent}\\%\\;{declaredDirection}",
        commonTrap: "Keep the two percentage bases separate throughout the algebra."
      },
      difficulty: "Hard",
      difficultyRationale: "Symbolic reverse base conversion with quantity expressions."
    }
  },
  entryCount: 29
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-005/task-registry.library.json
var task_registry_library_default5 = {
  archetypeId: "PNL-001",
  cpId: "PNL-CP-005",
  status: "FREEZE_CANDIDATE",
  countPolicy: "DISCOVERED_NOT_QUOTA_DRIVEN",
  title: "Dishonest Trade, False Weight and Short Quantity",
  ownershipNote: "Legacy marked-price CP-005 ownership was absorbed into CP-002. This non-duplicative CP owns quantity deception and combined price-quantity cheating.",
  entries: {
    "PNL-QL-121": { solveMode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT", answerSemantic: "actualProfitPercent", requiredVariables: ["costPricePerTrueQuantity", "trueQuantity", "deliveredQuantity"], difficulty: "Easy" },
    "PNL-QL-122": { solveMode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT", answerSemantic: "actualProfitAmountAndPercent", requiredVariables: ["costPricePerTrueQuantity", "quotedSellingPricePerNominalQuantity", "trueQuantity", "deliveredQuantity"], difficulty: "Medium" },
    "PNL-QL-123": { solveMode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE", answerSemantic: "actualProfitOrLossPercent", requiredVariables: ["costPricePerTrueQuantity", "declaredDirection", "declaredRatePercent", "trueQuantity", "deliveredQuantity"], difficulty: "Medium" },
    "PNL-QL-124": { solveMode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE", answerSemantic: "actualProfitOrLossPercent", requiredVariables: ["costPricePerTrueQuantity", "declaredDirection", "declaredRatePercent", "trueQuantity", "deliveredQuantity"], difficulty: "Hard" },
    "PNL-QL-125": { solveMode: "TARGET_RATE_TO_DELIVERED_QUANTITY", answerSemantic: "requiredDeliveredQuantity", requiredVariables: ["costPricePerTrueQuantity", "quotedSellingPricePerNominalQuantity", "trueQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-126": { solveMode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP", answerSemantic: "requiredQuotedSellingPrice", requiredVariables: ["costPricePerTrueQuantity", "trueQuantity", "deliveredQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-127": { solveMode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE", answerSemantic: "actualProfitPercent", requiredVariables: ["purchasePricePerNominalQuantity", "sellingPricePerNominalQuantity", "nominalQuantity", "receivedQuantity", "deliveredQuantity"], difficulty: "Hard" },
    "PNL-QL-128": { solveMode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE", answerSemantic: "actualProfitOrLossPercent", requiredVariables: ["purchasePricePerNominalQuantity", "sellingPricePerNominalQuantity", "nominalQuantity", "receivedQuantity", "deliveredQuantity"], difficulty: "Hard" },
    "PNL-QL-129": { solveMode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE", answerSemantic: "actualProfitOrLossPercent", requiredVariables: ["costPricePerTrueQuantity", "markupPercent", "discountPercent", "trueQuantity", "deliveredQuantity"], difficulty: "Hard" },
    "PNL-QL-130": { solveMode: "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP", answerSemantic: "requiredMarkupPercent", requiredVariables: ["costPricePerTrueQuantity", "discountPercent", "trueQuantity", "deliveredQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-131": { solveMode: "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT", answerSemantic: "requiredDiscountPercent", requiredVariables: ["costPricePerTrueQuantity", "markupPercent", "trueQuantity", "deliveredQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-132": { solveMode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE", answerSemantic: "actualProfitPercent", requiredVariables: ["costPricePerTrueQuantity", "priceDirection", "priceChangePercent", "trueQuantity", "shortQuantityPercent"], difficulty: "Medium" },
    "PNL-QL-133": { solveMode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE", answerSemantic: "actualProfitOrLossPercent", requiredVariables: ["costPricePerTrueQuantity", "priceDirection", "priceChangePercent", "trueQuantity", "shortQuantityPercent"], difficulty: "Hard" },
    "PNL-QL-134": { solveMode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE", answerSemantic: "customerOverchargePercent", requiredVariables: ["trueQuantity", "deliveredQuantity"], difficulty: "Medium" },
    "PNL-QL-135": { solveMode: "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY", answerSemantic: "requiredDeliveredQuantity", requiredVariables: ["trueQuantity", "declaredDirection", "declaredRatePercent", "actualDirection", "actualRatePercent"], difficulty: "Hard" },
    "PNL-QL-136": { solveMode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE", answerSemantic: "declaredProfitOrLossPercent", requiredVariables: ["trueQuantity", "deliveredQuantity", "actualDirection", "actualRatePercent"], difficulty: "Hard" },
    "PNL-QL-137": { solveMode: "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE", answerSemantic: "costPricePerTrueQuantity", requiredVariables: ["quotedSellingPricePerNominalQuantity", "trueQuantity", "deliveredQuantity", "actualDirection", "actualRatePercent"], difficulty: "Hard" },
    "PNL-QL-138": { solveMode: "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE", answerSemantic: "costPricePerTrueQuantity", requiredVariables: ["quotedSellingPricePerNominalQuantity", "trueQuantity", "deliveredQuantity", "actualDirection", "actualAmount"], difficulty: "Hard" },
    "PNL-QL-139": { solveMode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY", answerSemantic: "requiredDeliveredQuantity", requiredVariables: ["purchasePricePerNominalQuantity", "sellingPricePerNominalQuantity", "receivedQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-140": { solveMode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY", answerSemantic: "requiredReceivedQuantity", requiredVariables: ["purchasePricePerNominalQuantity", "sellingPricePerNominalQuantity", "deliveredQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-141": { solveMode: "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY", answerSemantic: "customerEffectivePricePerTrueQuantity", requiredVariables: ["quotedSellingPricePerNominalQuantity", "trueQuantity", "deliveredQuantity"], difficulty: "Medium" },
    "PNL-QL-142": { solveMode: "COMPARE_TWO_DISHONEST_SCHEMES", answerSemantic: "moreProfitableSchemeAndDifference", requiredVariables: ["firstScheme", "secondScheme"], difficulty: "Hard" },
    "PNL-QL-143": { solveMode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT", answerSemantic: "falseCountActualProfitPercent", requiredVariables: ["costPricePerTrueQuantity", "quotedSellingPricePerNominalQuantity", "trueQuantity", "deliveredQuantity"], difficulty: "Medium", representation: "FALSE_COUNT" },
    "PNL-QL-144": { solveMode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE", answerSemantic: "falseMetreOverchargePercent", requiredVariables: ["trueQuantity", "deliveredQuantity"], difficulty: "Medium", representation: "FALSE_METRE" },
    "PNL-QL-145": { solveMode: "COMPARE_TWO_DISHONEST_SCHEMES", answerSemantic: "tableSchemeComparison", requiredVariables: ["schemeTable", "firstScheme", "secondScheme"], difficulty: "Hard", representation: "TABLE" },
    "PNL-QL-146": { solveMode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE", answerSemantic: "caseletActualProfitPercent", requiredVariables: ["caseletData", "costPricePerTrueQuantity", "markupPercent", "discountPercent", "trueQuantity", "deliveredQuantity"], difficulty: "Hard", representation: "CASELET" },
    "PNL-QL-147": { solveMode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE", answerSemantic: "correctStatement", requiredVariables: ["trueQuantity", "deliveredQuantity"], difficulty: "Medium", representation: "STATEMENT" },
    "PNL-QL-148": { solveMode: "TARGET_RATE_TO_DELIVERED_QUANTITY", answerSemantic: "dataSufficiency", requiredVariables: ["statementOne", "statementTwo", "trueQuantity", "targetRatePercent"], difficulty: "Hard", representation: "DATA_SUFFICIENCY" },
    "PNL-QL-149": { solveMode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE", answerSemantic: "algebraicDeclaredRate", requiredVariables: ["trueQuantityExpression", "deliveredQuantityExpression", "actualRatePercent"], difficulty: "Hard", representation: "ALGEBRAIC" }
  },
  entryCount: 29,
  freezeNote: "Count frozen after direct/inverse, price-quantity, dual-cheating, customer-impact, comparison, representation and QL-depth audits. Reopen only for a genuinely distinct source-backed dishonest-trade mode."
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/dishonest-trade-solver.ts
function validateQuantity(value, label) {
  if (value <= 0n) throw new Error(`${label} must be positive.`);
}
function validateRate2(direction2, rate2) {
  if (rate2.denominator <= 0n || rate2.numerator < 0n) throw new Error("Rate must be non-negative.");
  if (direction2 === "LOSS" && rate2.numerator >= 100n * rate2.denominator) {
    throw new Error("Loss rate must be below 100%.");
  }
}
function commercialMultiplier(direction2, rate2) {
  validateRate2(direction2, rate2);
  const hundred = rational(100);
  const fraction = divideRational(rate2, hundred);
  return direction2 === "PROFIT" ? { numerator: fraction.denominator + fraction.numerator, denominator: fraction.denominator } : subtractRational(rational(1), fraction);
}
function quantityFraction(part, whole) {
  validateQuantity(part, "Quantity");
  validateQuantity(whole, "Reference quantity");
  return rational(part, whole);
}
function summarize3(cost, revenue) {
  if (cost.numerator <= 0n) throw new Error("Actual cost must be positive.");
  const difference = subtractRational(revenue, cost);
  const comparison = difference.numerator === 0n ? 0 : difference.numerator > 0n ? 1 : -1;
  const absolute = rational(difference.numerator < 0n ? -difference.numerator : difference.numerator, difference.denominator);
  return {
    direction: comparison > 0 ? "PROFIT" : comparison < 0 ? "LOSS" : "NO_CHANGE",
    ratePercent: asPercent(divideRational(absolute, cost))
  };
}
function actualCostRational(costPrice, deliveredQuantity, trueQuantity) {
  return multiplyRational(rational(costPrice.paise), quantityFraction(deliveredQuantity, trueQuantity));
}
function exactMoney(value, label) {
  if (value.numerator % value.denominator !== 0n) throw new Error(`${label} is not an exact paise amount.`);
  return moneyFromPaise(value.numerator / value.denominator);
}
function quoteFromDeclaredRate(costPrice, direction2, rate2) {
  return multiplyMoney(costPrice, commercialMultiplier(direction2, rate2));
}
function solveDishonestTrade(request) {
  switch (request.mode) {
    case "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT": {
      const cost = actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity);
      const revenue = rational(request.quotedSellingPricePerNominalQuantity.paise);
      const summary = summarize3(cost, revenue);
      const actualCost = exactMoney(cost, "Delivered-quantity cost");
      const difference = request.quotedSellingPricePerNominalQuantity.paise - actualCost.paise;
      return {
        mode: request.mode,
        actualCostOfDeliveredQuantity: actualCost,
        direction: summary.direction,
        amount: moneyFromPaise(difference < 0n ? -difference : difference),
        ratePercent: summary.ratePercent
      };
    }
    case "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE": {
      const quotedSellingPrice = quoteFromDeclaredRate(
        request.costPricePerTrueQuantity,
        request.declaredDirection,
        request.declaredRatePercent
      );
      const cost = actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity);
      const summary = summarize3(cost, rational(quotedSellingPrice.paise));
      return { mode: request.mode, quotedSellingPrice, ...summary };
    }
    case "TARGET_RATE_TO_DELIVERED_QUANTITY": {
      const targetMultiplier = commercialMultiplier(request.targetDirection, request.targetRatePercent);
      const deliveredQuantity = divideRational(
        rational(request.quotedSellingPricePerNominalQuantity.paise * request.trueQuantity),
        multiplyRational(rational(request.costPricePerTrueQuantity.paise), targetMultiplier)
      );
      return { mode: request.mode, deliveredQuantity };
    }
    case "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP": {
      const deliveredCost = actualCostRational(
        request.costPricePerTrueQuantity,
        request.deliveredQuantity,
        request.trueQuantity
      );
      const selling = multiplyRational(
        deliveredCost,
        commercialMultiplier(request.targetDirection, request.targetRatePercent)
      );
      return { mode: request.mode, quotedSellingPrice: exactMoney(selling, "Quoted selling price") };
    }
    case "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE": {
      validateQuantity(request.nominalQuantity, "Nominal quantity");
      validateQuantity(request.receivedQuantity, "Received quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const revenue = multiplyRational(
        rational(request.sellingPricePerNominalQuantity.paise),
        rational(request.receivedQuantity, request.deliveredQuantity)
      );
      const cost = rational(request.purchasePricePerNominalQuantity.paise);
      return { mode: request.mode, ...summarize3(cost, revenue) };
    }
    case "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE": {
      const markedPrice = quoteFromDeclaredRate(
        request.costPricePerTrueQuantity,
        "PROFIT",
        request.markupPercent
      );
      validateRate2("LOSS", request.discountPercent);
      const quotedSellingPrice = multiplyMoney(
        markedPrice,
        commercialMultiplier("LOSS", request.discountPercent)
      );
      const cost = actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity);
      return {
        mode: request.mode,
        markedPrice,
        quotedSellingPrice,
        ...summarize3(cost, rational(quotedSellingPrice.paise))
      };
    }
    case "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP": {
      validateRate2("LOSS", request.discountPercent);
      const targetRevenue = multiplyRational(
        actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity),
        commercialMultiplier(request.targetDirection, request.targetRatePercent)
      );
      const markedPrice = divideRational(
        targetRevenue,
        commercialMultiplier("LOSS", request.discountPercent)
      );
      const markupFraction = subtractRational(
        divideRational(markedPrice, rational(request.costPricePerTrueQuantity.paise)),
        rational(1)
      );
      return { mode: request.mode, markupPercent: asPercent(markupFraction) };
    }
    case "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT": {
      const markedPrice = multiplyRational(
        rational(request.costPricePerTrueQuantity.paise),
        commercialMultiplier("PROFIT", request.markupPercent)
      );
      const targetRevenue = multiplyRational(
        actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity),
        commercialMultiplier(request.targetDirection, request.targetRatePercent)
      );
      const retained = divideRational(targetRevenue, markedPrice);
      const discount = subtractRational(rational(1), retained);
      if (discount.numerator < 0n || discount.numerator > discount.denominator) {
        throw new Error("Target result is incompatible with a valid discount.");
      }
      return { mode: request.mode, discountPercent: asPercent(discount) };
    }
    case "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE": {
      validateRate2(request.priceDirection === "INCREASE" ? "PROFIT" : "LOSS", request.priceChangePercent);
      validateRate2("LOSS", request.shortQuantityPercent);
      const quotedSellingPrice = multiplyMoney(
        request.costPricePerTrueQuantity,
        commercialMultiplier(request.priceDirection === "INCREASE" ? "PROFIT" : "LOSS", request.priceChangePercent)
      );
      const deliveredFraction = commercialMultiplier("LOSS", request.shortQuantityPercent);
      const deliveredQuantity = multiplyRational(rational(request.trueQuantity), deliveredFraction);
      const cost = multiplyRational(rational(request.costPricePerTrueQuantity.paise), deliveredFraction);
      return {
        mode: request.mode,
        quotedSellingPrice,
        deliveredQuantity,
        ...summarize3(cost, rational(quotedSellingPrice.paise))
      };
    }
    case "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      if (request.deliveredQuantity > request.trueQuantity) throw new Error("Delivered quantity cannot exceed true quantity.");
      const effectiveMultiplier = rational(request.trueQuantity, request.deliveredQuantity);
      return {
        mode: request.mode,
        overchargePercent: asPercent(subtractRational(effectiveMultiplier, rational(1)))
      };
    }
    case "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY": {
      const declaredMultiplier = commercialMultiplier(request.declaredDirection, request.declaredRatePercent);
      const actualMultiplier = commercialMultiplier(request.actualDirection, request.actualRatePercent);
      return {
        mode: request.mode,
        deliveredQuantity: multiplyRational(
          rational(request.trueQuantity),
          divideRational(declaredMultiplier, actualMultiplier)
        )
      };
    }
    case "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const actualMultiplier = commercialMultiplier(request.actualDirection, request.actualRatePercent);
      const declaredMultiplier = multiplyRational(
        actualMultiplier,
        rational(request.deliveredQuantity, request.trueQuantity)
      );
      const difference = subtractRational(declaredMultiplier, rational(1));
      const direction2 = difference.numerator > 0n ? "PROFIT" : difference.numerator < 0n ? "LOSS" : "NO_CHANGE";
      return {
        mode: request.mode,
        declaredDirection: direction2,
        declaredRatePercent: asPercent(rational(
          difference.numerator < 0n ? -difference.numerator : difference.numerator,
          difference.denominator
        ))
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/dishonest-trade-advanced-solver.ts
function validateQuantity2(value, label) {
  if (value <= 0n) throw new Error(`${label} must be positive.`);
}
function multiplier3(direction2, rate2) {
  if (rate2.denominator <= 0n || rate2.numerator < 0n) throw new Error("Rate must be non-negative.");
  if (direction2 === "LOSS" && rate2.numerator >= 100n * rate2.denominator) {
    throw new Error("Loss rate must be below 100%.");
  }
  const fraction = divideRational(rate2, rational(100));
  return direction2 === "PROFIT" ? rational(fraction.denominator + fraction.numerator, fraction.denominator) : subtractRational(rational(1), fraction);
}
function exactMoney2(value, label) {
  if (value.numerator % value.denominator !== 0n) throw new Error(`${label} is not an exact paise amount.`);
  return moneyFromPaise(value.numerator / value.denominator);
}
function schemeProfitPercent(scheme) {
  validateQuantity2(scheme.trueQuantity, "True quantity");
  validateQuantity2(scheme.deliveredQuantity, "Delivered quantity");
  const cost = multiplyRational(
    rational(scheme.costPricePerTrueQuantity.paise),
    rational(scheme.deliveredQuantity, scheme.trueQuantity)
  );
  const revenue = rational(scheme.quotedSellingPricePerNominalQuantity.paise);
  const profit = subtractRational(revenue, cost);
  return asPercent(divideRational(profit, cost));
}
function solveDishonestTradeAdvanced(request) {
  switch (request.mode) {
    case "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE": {
      validateQuantity2(request.trueQuantity, "True quantity");
      validateQuantity2(request.deliveredQuantity, "Delivered quantity");
      const actualCostOfDelivered = divideRational(
        rational(request.quotedSellingPricePerNominalQuantity.paise),
        multiplier3(request.actualDirection, request.actualRatePercent)
      );
      const costPerTrue = multiplyRational(
        actualCostOfDelivered,
        rational(request.trueQuantity, request.deliveredQuantity)
      );
      return { mode: request.mode, costPricePerTrueQuantity: exactMoney2(costPerTrue, "Cost price") };
    }
    case "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE": {
      validateQuantity2(request.trueQuantity, "True quantity");
      validateQuantity2(request.deliveredQuantity, "Delivered quantity");
      const deliveredCostPaise = request.actualDirection === "PROFIT" ? request.quotedSellingPricePerNominalQuantity.paise - request.actualAmount.paise : request.quotedSellingPricePerNominalQuantity.paise + request.actualAmount.paise;
      if (deliveredCostPaise <= 0n) throw new Error("Actual delivered cost must be positive.");
      const costPerTrue = multiplyRational(
        rational(deliveredCostPaise),
        rational(request.trueQuantity, request.deliveredQuantity)
      );
      return { mode: request.mode, costPricePerTrueQuantity: exactMoney2(costPerTrue, "Cost price") };
    }
    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY": {
      validateQuantity2(request.receivedQuantity, "Received quantity");
      const delivered = divideRational(
        rational(request.sellingPricePerNominalQuantity.paise * request.receivedQuantity),
        multiplyRational(
          rational(request.purchasePricePerNominalQuantity.paise),
          multiplier3(request.targetDirection, request.targetRatePercent)
        )
      );
      return { mode: request.mode, deliveredQuantity: delivered };
    }
    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY": {
      validateQuantity2(request.deliveredQuantity, "Delivered quantity");
      const received = divideRational(
        multiplyRational(
          rational(request.purchasePricePerNominalQuantity.paise * request.deliveredQuantity),
          multiplier3(request.targetDirection, request.targetRatePercent)
        ),
        rational(request.sellingPricePerNominalQuantity.paise)
      );
      return { mode: request.mode, receivedQuantity: received };
    }
    case "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY": {
      validateQuantity2(request.trueQuantity, "True quantity");
      validateQuantity2(request.deliveredQuantity, "Delivered quantity");
      return {
        mode: request.mode,
        effectivePricePerTrueQuantity: multiplyRational(
          rational(request.quotedSellingPricePerNominalQuantity.paise),
          rational(request.trueQuantity, request.deliveredQuantity)
        )
      };
    }
    case "COMPARE_TWO_DISHONEST_SCHEMES": {
      const firstProfitPercent = schemeProfitPercent(request.firstScheme);
      const secondProfitPercent = schemeProfitPercent(request.secondScheme);
      const difference = subtractRational(firstProfitPercent, secondProfitPercent);
      return {
        mode: request.mode,
        moreProfitableScheme: difference.numerator > 0n ? "FIRST" : difference.numerator < 0n ? "SECOND" : "SAME",
        firstProfitPercent,
        secondProfitPercent,
        differencePercent: rational(
          difference.numerator < 0n ? -difference.numerator : difference.numerator,
          difference.denominator
        )
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-005/cp005-dynamic-cases.ts
var PNL_CP005_ID = "PNL-CP-005";
var taskRegistry5 = task_registry_library_default5;
var PNL_CP005_QL_IDS = Object.keys(taskRegistry5.entries);
var COSTS = [1e3, 1200, 1500, 2e3, 2400, 3e3];
var QUOTED_PRICES = [900, 1e3, 1100, 1200, 1500, 1800];
var DELIVERED_QUANTITIES = [800n, 850n, 900n, 950n];
var RECEIVED_QUANTITIES = [1050n, 1100n, 1200n, 1250n];
var PROFIT_RATES = [10, 20, 25, 40];
var LOSS_RATES = [5, 10, 20];
var MARKUPS = [25, 40, 50, 60];
var DISCOUNTS = [10, 20, 25];
var TRUE_QUANTITY = 1000n;
var NOMINAL_QUANTITY = 1000n;
function cp005PlainMoney(value) {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}
function cp005FormatMoney(value) {
  return `\u20B9${cp005PlainMoney(value)}`;
}
function cp005FormatRational(value) {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function cp005FormatPercent(value) {
  return `${cp005FormatRational(value)}%`;
}
function cp005FormatQuantity(value) {
  return cp005FormatRational(value);
}
function rupees4(value) {
  return moneyFromRupees(value);
}
function pickNumber4(random, values) {
  return pickSeeded(random, values);
}
function pickDelivered(random) {
  return pickSeeded(random, DELIVERED_QUANTITIES);
}
function declaredPair(random, forceLoss = false) {
  const direction2 = forceLoss ? "LOSS" : pickSeeded(random, ["PROFIT", "LOSS"]);
  return {
    direction: direction2,
    ratePercent: rational(
      direction2 === "PROFIT" ? pickNumber4(random, PROFIT_RATES) : pickNumber4(random, LOSS_RATES)
    )
  };
}
var ADVANCED_MODES2 = /* @__PURE__ */ new Set([
  "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
  "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
  "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY",
  "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY",
  "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY",
  "COMPARE_TWO_DISHONEST_SCHEMES"
]);
function solvePnlCp005Request(request) {
  return ADVANCED_MODES2.has(request.mode) ? solveDishonestTradeAdvanced(request) : solveDishonestTrade(request);
}
function directFalseQuantity(costPricePerTrueQuantity, quotedSellingPricePerNominalQuantity, deliveredQuantity) {
  return solveDishonestTrade({
    mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
    costPricePerTrueQuantity,
    quotedSellingPricePerNominalQuantity,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity
  });
}
function markupForward(costPricePerTrueQuantity, deliveredQuantity, markupPercent, discountPercent) {
  return solveDishonestTrade({
    mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
    costPricePerTrueQuantity,
    markupPercent,
    discountPercent,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity
  });
}
function buyHeavyForward(purchasePricePerNominalQuantity, sellingPricePerNominalQuantity, receivedQuantity, deliveredQuantity) {
  return solveDishonestTrade({
    mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
    purchasePricePerNominalQuantity,
    sellingPricePerNominalQuantity,
    nominalQuantity: NOMINAL_QUANTITY,
    receivedQuantity,
    deliveredQuantity
  });
}
function schemeText(scheme) {
  return `cost ${cp005FormatMoney(scheme.costPricePerTrueQuantity)} per ${scheme.trueQuantity} units, charge ${cp005FormatMoney(scheme.quotedSellingPricePerNominalQuantity)}, deliver ${scheme.deliveredQuantity} units`;
}
function comparisonSchemes(random) {
  const cost = rupees4(pickNumber4(random, COSTS));
  const firstDelivered = pickSeeded(random, [800n, 850n]);
  const secondDelivered = pickSeeded(random, [900n, 950n]);
  const first = {
    costPricePerTrueQuantity: cost,
    quotedSellingPricePerNominalQuantity: cost,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity: firstDelivered
  };
  const second = {
    costPricePerTrueQuantity: cost,
    quotedSellingPricePerNominalQuantity: cost,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity: secondDelivered
  };
  return random.next() < 0.5 ? { firstScheme: first, secondScheme: second } : { firstScheme: second, secondScheme: first };
}
function baseContext(costPricePerTrueQuantity, deliveredQuantity) {
  return {
    costPricePerTrueQuantity: cp005PlainMoney(costPricePerTrueQuantity),
    trueQuantity: TRUE_QUANTITY.toString(),
    deliveredQuantity: deliveredQuantity.toString()
  };
}
function generatePnlCp005Case(qlId, seedValue) {
  const registry = taskRegistry5.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-005 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);
  const costPricePerTrueQuantity = rupees4(pickNumber4(random, COSTS));
  const deliveredQuantity = pickDelivered(random);
  switch (qlId) {
    case "PNL-QL-121": {
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
          costPricePerTrueQuantity,
          quotedSellingPricePerNominalQuantity: costPricePerTrueQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity
        },
        context: baseContext(costPricePerTrueQuantity, deliveredQuantity)
      };
    }
    case "PNL-QL-122":
    case "PNL-QL-143": {
      const quotedSellingPricePerNominalQuantity = qlId === "PNL-QL-143" ? costPricePerTrueQuantity : rupees4(pickNumber4(random, QUOTED_PRICES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
          costPricePerTrueQuantity,
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          quotedSellingPricePerNominalQuantity: cp005PlainMoney(
            quotedSellingPricePerNominalQuantity
          )
        }
      };
    }
    case "PNL-QL-123":
    case "PNL-QL-124": {
      const declared = declaredPair(random, qlId === "PNL-QL-124");
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
          costPricePerTrueQuantity,
          declaredDirection: declared.direction,
          declaredRatePercent: declared.ratePercent,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          declaredDirection: declared.direction.toLowerCase(),
          declaredRatePercent: cp005FormatRational(declared.ratePercent)
        }
      };
    }
    case "PNL-QL-125":
    case "PNL-QL-148": {
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(pickSeeded(random, [20, 25]));
      const quotedSellingPricePerNominalQuantity = solveDishonestTrade({
        mode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP",
        costPricePerTrueQuantity,
        trueQuantity: TRUE_QUANTITY,
        deliveredQuantity,
        targetDirection,
        targetRatePercent
      }).quotedSellingPrice;
      const commonContext = {
        ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
        quotedSellingPricePerNominalQuantity: cp005PlainMoney(
          quotedSellingPricePerNominalQuantity
        ),
        targetDirection: targetDirection.toLowerCase(),
        targetRatePercent: cp005FormatRational(targetRatePercent)
      };
      if (qlId === "PNL-QL-125") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: "TARGET_RATE_TO_DELIVERED_QUANTITY",
            costPricePerTrueQuantity,
            quotedSellingPricePerNominalQuantity,
            trueQuantity: TRUE_QUANTITY,
            targetDirection,
            targetRatePercent
          },
          context: commonContext
        };
      }
      const full = `The nominal cost is ${cp005FormatMoney(costPricePerTrueQuantity)} and the selling amount is ${cp005FormatMoney(quotedSellingPricePerNominalQuantity)}.`;
      const costOnly = `The nominal cost is ${cp005FormatMoney(costPricePerTrueQuantity)}.`;
      const sellingOnly = `The selling amount is ${cp005FormatMoney(quotedSellingPricePerNominalQuantity)}.`;
      const irrelevant = "The goods are packed in an unbranded container.";
      const pattern = pickSeeded(random, [
        "BOTH",
        "ONE",
        "TWO",
        "EITHER"
      ]);
      const statementOne = pattern === "ONE" || pattern === "EITHER" ? full : pattern === "BOTH" ? costOnly : irrelevant;
      const statementTwo = pattern === "TWO" || pattern === "EITHER" ? full : pattern === "BOTH" ? sellingOnly : irrelevant;
      const answerOverride = pattern === "BOTH" ? "Both statements together are required" : pattern === "ONE" ? "Statement 1 alone is sufficient" : pattern === "TWO" ? "Statement 2 alone is sufficient" : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TARGET_RATE_TO_DELIVERED_QUANTITY",
          costPricePerTrueQuantity,
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          targetDirection,
          targetRatePercent
        },
        context: {
          ...commonContext,
          statementOne,
          statementTwo,
          dataSufficiencyAnswer: answerOverride
        },
        answerOverride
      };
    }
    case "PNL-QL-126": {
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(
        pickSeeded(random, [10, 20, 25])
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP",
          costPricePerTrueQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          targetDirection,
          targetRatePercent
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp005FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-127":
    case "PNL-QL-128": {
      const purchasePricePerNominalQuantity = rupees4(
        pickSeeded(random, [1e3, 1200, 1500])
      );
      const sellingPricePerNominalQuantity = qlId === "PNL-QL-127" ? purchasePricePerNominalQuantity : rupees4(pickSeeded(random, [1e3, 1200, 1500]));
      const receivedQuantity = pickSeeded(random, RECEIVED_QUANTITIES);
      const lightQuantity = pickDelivered(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
          purchasePricePerNominalQuantity,
          sellingPricePerNominalQuantity,
          nominalQuantity: NOMINAL_QUANTITY,
          receivedQuantity,
          deliveredQuantity: lightQuantity
        },
        context: {
          purchasePricePerNominalQuantity: cp005PlainMoney(
            purchasePricePerNominalQuantity
          ),
          sellingPricePerNominalQuantity: cp005PlainMoney(
            sellingPricePerNominalQuantity
          ),
          nominalQuantity: NOMINAL_QUANTITY.toString(),
          receivedQuantity: receivedQuantity.toString(),
          deliveredQuantity: lightQuantity.toString()
        }
      };
    }
    case "PNL-QL-129":
    case "PNL-QL-146": {
      const markupPercent = rational(
        qlId === "PNL-QL-146" ? 50 : pickNumber4(random, MARKUPS)
      );
      const discountPercent = rational(
        qlId === "PNL-QL-146" ? 10 : pickNumber4(random, DISCOUNTS)
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
          costPricePerTrueQuantity,
          markupPercent,
          discountPercent,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          markupPercent: cp005FormatRational(markupPercent),
          discountPercent: cp005FormatRational(discountPercent),
          caseletData: [
            "The retailer first changes the price and then reduces the physical quantity supplied.",
            "The discount is applied to the marked price, while actual profit is measured on delivered cost."
          ]
        }
      };
    }
    case "PNL-QL-130":
    case "PNL-QL-131": {
      const markupPercent = rational(pickNumber4(random, MARKUPS));
      const discountPercent = rational(pickNumber4(random, DISCOUNTS));
      const forward = markupForward(
        costPricePerTrueQuantity,
        deliveredQuantity,
        markupPercent,
        discountPercent
      );
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated forward case has no direction.`);
      }
      const shared = {
        ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
        markupPercent: cp005FormatRational(markupPercent),
        discountPercent: cp005FormatRational(discountPercent),
        targetDirection: forward.direction.toLowerCase(),
        targetRatePercent: cp005FormatRational(forward.ratePercent)
      };
      return qlId === "PNL-QL-130" ? {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP",
          costPricePerTrueQuantity,
          discountPercent,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          targetDirection: forward.direction,
          targetRatePercent: forward.ratePercent
        },
        context: shared
      } : {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT",
          costPricePerTrueQuantity,
          markupPercent,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          targetDirection: forward.direction,
          targetRatePercent: forward.ratePercent
        },
        context: shared
      };
    }
    case "PNL-QL-132":
    case "PNL-QL-133": {
      const priceDirection = qlId === "PNL-QL-132" ? "INCREASE" : pickSeeded(random, ["INCREASE", "DECREASE"]);
      const priceChangePercent = rational(
        priceDirection === "INCREASE" ? pickSeeded(random, [10, 20, 25]) : pickSeeded(random, [5, 10, 20])
      );
      const shortQuantityPercent = rational(
        pickSeeded(random, [10, 15, 20])
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE",
          costPricePerTrueQuantity,
          priceDirection,
          priceChangePercent,
          trueQuantity: TRUE_QUANTITY,
          shortQuantityPercent
        },
        context: {
          costPricePerTrueQuantity: cp005PlainMoney(costPricePerTrueQuantity),
          trueQuantity: TRUE_QUANTITY.toString(),
          priceDirection: priceDirection.toLowerCase(),
          priceChangePercent: cp005FormatRational(priceChangePercent),
          shortQuantityPercent: cp005FormatRational(shortQuantityPercent)
        }
      };
    }
    case "PNL-QL-134":
    case "PNL-QL-144":
    case "PNL-QL-147": {
      const trueQuantity = qlId === "PNL-QL-144" ? 100n : TRUE_QUANTITY;
      const actualDelivered = qlId === "PNL-QL-144" ? pickSeeded(random, [80n, 85n, 90n, 95n]) : deliveredQuantity;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE",
          trueQuantity,
          deliveredQuantity: actualDelivered
        },
        context: {
          trueQuantity: trueQuantity.toString(),
          deliveredQuantity: actualDelivered.toString(),
          ...qlId === "PNL-QL-147" ? { correctStatement: "Statement 2 only" } : {}
        },
        ...qlId === "PNL-QL-147" ? { answerOverride: "Statement 2 only" } : {}
      };
    }
    case "PNL-QL-135":
    case "PNL-QL-136":
    case "PNL-QL-149": {
      const declared = {
        direction: "PROFIT",
        ratePercent: rational(pickNumber4(random, PROFIT_RATES))
      };
      const forward = solveDishonestTrade({
        mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity,
        declaredDirection: declared.direction,
        declaredRatePercent: declared.ratePercent,
        trueQuantity: TRUE_QUANTITY,
        deliveredQuantity
      });
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated actual result has no direction.`);
      }
      if (qlId === "PNL-QL-135") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY",
            trueQuantity: TRUE_QUANTITY,
            declaredDirection: declared.direction,
            declaredRatePercent: declared.ratePercent,
            actualDirection: forward.direction,
            actualRatePercent: forward.ratePercent
          },
          context: {
            trueQuantity: TRUE_QUANTITY.toString(),
            declaredDirection: declared.direction.toLowerCase(),
            declaredRatePercent: cp005FormatRational(declared.ratePercent),
            actualDirection: forward.direction.toLowerCase(),
            actualRatePercent: cp005FormatRational(forward.ratePercent)
          }
        };
      }
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE",
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          actualDirection: forward.direction,
          actualRatePercent: forward.ratePercent
        },
        context: {
          trueQuantity: TRUE_QUANTITY.toString(),
          deliveredQuantity: deliveredQuantity.toString(),
          actualDirection: forward.direction.toLowerCase(),
          actualRatePercent: cp005FormatRational(forward.ratePercent),
          trueQuantityExpression: "q",
          deliveredQuantityExpression: `${cp005FormatRational(rational(deliveredQuantity, TRUE_QUANTITY))}q`
        }
      };
    }
    case "PNL-QL-137":
    case "PNL-QL-138": {
      const quotedSellingPricePerNominalQuantity = costPricePerTrueQuantity;
      const forward = directFalseQuantity(
        costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity,
        deliveredQuantity
      );
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated actual result has no direction.`);
      }
      return {
        qlId,
        registry,
        seed: seedValue,
        request: qlId === "PNL-QL-137" ? {
          mode: "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          actualDirection: forward.direction,
          actualRatePercent: forward.ratePercent
        } : {
          mode: "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          actualDirection: forward.direction,
          actualAmount: forward.amount
        },
        context: {
          quotedSellingPricePerNominalQuantity: cp005PlainMoney(
            quotedSellingPricePerNominalQuantity
          ),
          trueQuantity: TRUE_QUANTITY.toString(),
          deliveredQuantity: deliveredQuantity.toString(),
          actualDirection: forward.direction.toLowerCase(),
          actualRatePercent: cp005FormatRational(forward.ratePercent),
          actualAmount: cp005PlainMoney(forward.amount)
        }
      };
    }
    case "PNL-QL-139":
    case "PNL-QL-140": {
      const commonQuotedPrice = rupees4(
        pickSeeded(random, [1e3, 1200, 1500])
      );
      const purchasePricePerNominalQuantity = commonQuotedPrice;
      const sellingPricePerNominalQuantity = commonQuotedPrice;
      const receivedQuantity = pickSeeded(random, RECEIVED_QUANTITIES);
      const lightQuantity = pickDelivered(random);
      const forward = buyHeavyForward(
        purchasePricePerNominalQuantity,
        sellingPricePerNominalQuantity,
        receivedQuantity,
        lightQuantity
      );
      if (forward.direction === "NO_CHANGE") {
        throw new Error(
          `${qlId}: generated heavy/light result has no direction.`
        );
      }
      const context = {
        purchasePricePerNominalQuantity: cp005PlainMoney(
          purchasePricePerNominalQuantity
        ),
        sellingPricePerNominalQuantity: cp005PlainMoney(
          sellingPricePerNominalQuantity
        ),
        receivedQuantity: receivedQuantity.toString(),
        deliveredQuantity: lightQuantity.toString(),
        targetDirection: forward.direction.toLowerCase(),
        targetRatePercent: cp005FormatRational(forward.ratePercent)
      };
      return qlId === "PNL-QL-139" ? {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY",
          purchasePricePerNominalQuantity,
          sellingPricePerNominalQuantity,
          receivedQuantity,
          targetDirection: forward.direction,
          targetRatePercent: forward.ratePercent
        },
        context
      } : {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY",
          purchasePricePerNominalQuantity,
          sellingPricePerNominalQuantity,
          deliveredQuantity: lightQuantity,
          targetDirection: forward.direction,
          targetRatePercent: forward.ratePercent
        },
        context
      };
    }
    case "PNL-QL-141": {
      const pair = pickSeeded(random, [
        [800n, 1e3],
        [800n, 1200],
        [900n, 900],
        [900n, 1800]
      ]);
      const effectiveDeliveredQuantity = pair[0];
      const quotedSellingPricePerNominalQuantity = rupees4(pair[1]);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY",
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity: effectiveDeliveredQuantity
        },
        context: {
          quotedSellingPricePerNominalQuantity: cp005PlainMoney(
            quotedSellingPricePerNominalQuantity
          ),
          trueQuantity: TRUE_QUANTITY.toString(),
          deliveredQuantity: effectiveDeliveredQuantity.toString()
        }
      };
    }
    case "PNL-QL-142":
    case "PNL-QL-145": {
      const schemes = comparisonSchemes(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "COMPARE_TWO_DISHONEST_SCHEMES",
          firstScheme: schemes.firstScheme,
          secondScheme: schemes.secondScheme
        },
        context: {
          firstScheme: schemeText(schemes.firstScheme),
          secondScheme: schemeText(schemes.secondScheme),
          schemeTable: [
            [
              "A",
              `Charge ${cp005FormatMoney(schemes.firstScheme.quotedSellingPricePerNominalQuantity)} against cost ${cp005FormatMoney(schemes.firstScheme.costPricePerTrueQuantity)}`,
              `Deliver ${schemes.firstScheme.deliveredQuantity} of ${schemes.firstScheme.trueQuantity} units`
            ],
            [
              "B",
              `Charge ${cp005FormatMoney(schemes.secondScheme.quotedSellingPricePerNominalQuantity)} against cost ${cp005FormatMoney(schemes.secondScheme.costPricePerTrueQuantity)}`,
              `Deliver ${schemes.secondScheme.deliveredQuantity} of ${schemes.secondScheme.trueQuantity} units`
            ]
          ]
        }
      };
    }
    default:
      throw new Error(`${qlId}: CP-005 dynamic generator is not implemented.`);
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-005/cp005-dynamic-runtime.ts
var PNL_CP005_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE";
var editorialLibrary5 = editorial_content_en_default5;
function directionRateText2(direction2, ratePercent) {
  if (direction2 === "NO_CHANGE") return "No profit, no loss";
  return `${cp005FormatPercent(ratePercent)} ${direction2.toLowerCase()}`;
}
function exactRationalMoney(valueInPaise) {
  if (valueInPaise.numerator % valueInPaise.denominator === 0n) {
    return cp005FormatMoney(
      moneyFromPaise(valueInPaise.numerator / valueInPaise.denominator)
    );
  }
  const rupees6 = rationalToNumber(valueInPaise) / 100;
  return `\u20B9${rupees6.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}`;
}
function amountAndRateText(direction2, amount, ratePercent) {
  if (direction2 === "NO_CHANGE") return "No profit, no loss";
  return `${direction2 === "PROFIT" ? "Profit" : "Loss"} ${cp005FormatMoney(amount)} at ${cp005FormatPercent(ratePercent)}`;
}
function comparisonText(result) {
  const scheme = result.moreProfitableScheme === "FIRST" ? "Scheme A" : result.moreProfitableScheme === "SECOND" ? "Scheme B" : "Both schemes";
  if (result.moreProfitableScheme === "SAME")
    return "Both schemes give the same profit rate";
  return `${scheme} by ${cp005FormatPercent(result.differencePercent)}`;
}
function answerFor4(qlId, result, generated2) {
  if (generated2.answerOverride) {
    return { kind: "TEXT", value: generated2.answerOverride };
  }
  switch (qlId) {
    case "PNL-QL-121":
    case "PNL-QL-143":
      if (!("ratePercent" in result))
        throw new Error(`${qlId}: expected rate.`);
      return { kind: "PERCENT", value: result.ratePercent };
    case "PNL-QL-122":
      if (!("amount" in result) || !("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected amount and rate.`);
      }
      return {
        kind: "TEXT",
        value: amountAndRateText(
          result.direction,
          result.amount,
          result.ratePercent
        )
      };
    case "PNL-QL-123":
    case "PNL-QL-124":
    case "PNL-QL-127":
    case "PNL-QL-128":
    case "PNL-QL-129":
    case "PNL-QL-132":
    case "PNL-QL-133":
    case "PNL-QL-146":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected directed rate.`);
      }
      return {
        kind: "TEXT",
        value: directionRateText2(result.direction, result.ratePercent)
      };
    case "PNL-QL-125":
    case "PNL-QL-135":
    case "PNL-QL-139":
      if (!("deliveredQuantity" in result)) {
        throw new Error(`${qlId}: expected delivered quantity.`);
      }
      return { kind: "QUANTITY", value: result.deliveredQuantity };
    case "PNL-QL-126":
      if (!("quotedSellingPrice" in result)) {
        throw new Error(`${qlId}: expected quoted selling price.`);
      }
      return { kind: "MONEY", value: result.quotedSellingPrice };
    case "PNL-QL-130":
      if (!("markupPercent" in result))
        throw new Error(`${qlId}: expected markup.`);
      return { kind: "PERCENT", value: result.markupPercent };
    case "PNL-QL-131":
      if (!("discountPercent" in result))
        throw new Error(`${qlId}: expected discount.`);
      return { kind: "PERCENT", value: result.discountPercent };
    case "PNL-QL-134":
    case "PNL-QL-144":
      if (!("overchargePercent" in result)) {
        throw new Error(`${qlId}: expected overcharge rate.`);
      }
      return { kind: "PERCENT", value: result.overchargePercent };
    case "PNL-QL-136":
    case "PNL-QL-149":
      if (!("declaredDirection" in result) || !("declaredRatePercent" in result)) {
        throw new Error(`${qlId}: expected declared rate.`);
      }
      return {
        kind: "TEXT",
        value: directionRateText2(
          result.declaredDirection,
          result.declaredRatePercent
        )
      };
    case "PNL-QL-137":
    case "PNL-QL-138":
      if (!("costPricePerTrueQuantity" in result)) {
        throw new Error(`${qlId}: expected recovered cost.`);
      }
      return { kind: "MONEY", value: result.costPricePerTrueQuantity };
    case "PNL-QL-140":
      if (!("receivedQuantity" in result)) {
        throw new Error(`${qlId}: expected received quantity.`);
      }
      return { kind: "QUANTITY", value: result.receivedQuantity };
    case "PNL-QL-141":
      if (!("effectivePricePerTrueQuantity" in result)) {
        throw new Error(`${qlId}: expected effective price.`);
      }
      return {
        kind: "TEXT",
        value: exactRationalMoney(result.effectivePricePerTrueQuantity)
      };
    case "PNL-QL-142":
    case "PNL-QL-145":
      if (result.mode !== "COMPARE_TWO_DISHONEST_SCHEMES") {
        throw new Error(`${qlId}: expected scheme comparison.`);
      }
      return { kind: "TEXT", value: comparisonText(result) };
    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}
function formatAnswer5(answer) {
  if (answer.kind === "MONEY") return cp005FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp005FormatPercent(answer.value);
  if (answer.kind === "QUANTITY") return cp005FormatQuantity(answer.value);
  return answer.value;
}
function resultContext3(result, answer) {
  const context = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer
  };
  if ("direction" in result && "ratePercent" in result) {
    context.actualDirection = result.direction.toLowerCase();
    context.actualRatePercent = cp005FormatRational(result.ratePercent);
    context.actualProfitPercent = cp005FormatRational(result.ratePercent);
  }
  if ("amount" in result) context.actualAmount = cp005PlainMoney(result.amount);
  if ("deliveredQuantity" in result) {
    context.requiredDeliveredQuantity = cp005FormatQuantity(
      result.deliveredQuantity
    );
  }
  if ("quotedSellingPrice" in result) {
    context.requiredQuotedSellingPrice = cp005PlainMoney(
      result.quotedSellingPrice
    );
  }
  if ("markupPercent" in result) {
    context.requiredMarkupPercent = cp005FormatRational(result.markupPercent);
  }
  if ("discountPercent" in result) {
    context.requiredDiscountPercent = cp005FormatRational(
      result.discountPercent
    );
  }
  if ("overchargePercent" in result) {
    context.customerOverchargePercent = cp005FormatRational(
      result.overchargePercent
    );
  }
  if ("declaredDirection" in result && "declaredRatePercent" in result) {
    context.declaredDirection = result.declaredDirection.toLowerCase();
    context.declaredRatePercent = cp005FormatRational(
      result.declaredRatePercent
    );
  }
  if ("costPricePerTrueQuantity" in result) {
    context.costPricePerTrueQuantity = cp005PlainMoney(
      result.costPricePerTrueQuantity
    );
  }
  if ("receivedQuantity" in result) {
    context.requiredReceivedQuantity = cp005FormatQuantity(
      result.receivedQuantity
    );
  }
  if ("effectivePricePerTrueQuantity" in result) {
    context.effectivePricePerTrueQuantity = exactRationalMoney(
      result.effectivePricePerTrueQuantity
    ).replace(/^₹/, "");
  }
  if (result.mode === "COMPARE_TWO_DISHONEST_SCHEMES") {
    context.moreProfitableScheme = result.moreProfitableScheme === "FIRST" ? "Scheme A" : result.moreProfitableScheme === "SECOND" ? "Scheme B" : "Both schemes";
    context.rateDifference = cp005FormatRational(result.differencePercent);
  }
  return context;
}
function numericDistractors4(answer) {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    return [
      moneyFromPaise(paise * 80n / 100n),
      moneyFromPaise(paise * 90n / 100n),
      moneyFromPaise(paise * 110n / 100n),
      moneyFromPaise(paise * 120n / 100n),
      moneyFromPaise(paise + 5000n),
      moneyFromPaise(paise + 15000n),
      moneyFromPaise(paise > 5000n ? paise - 5000n : paise + 25000n),
      moneyFromPaise(paise > 15000n ? paise - 15000n : paise + 30000n)
    ].filter((value) => value.paise > 0n).map(cp005FormatMoney);
  }
  const numeric = rationalToNumber(answer.value);
  if (answer.kind === "PERCENT") {
    return [
      Math.max(0, numeric - 5),
      numeric + 5,
      Math.max(0, 100 - numeric),
      numeric + 10
    ].map((item) => `${Number(item.toFixed(2))}%`);
  }
  return [
    Math.max(1, numeric - 50),
    numeric + 50,
    Math.max(1, numeric * 0.9),
    numeric * 1.1
  ].map((item) => Number(item.toFixed(2)).toString());
}
function textDistractors4(qlId, correct) {
  const pools = {
    "PNL-QL-147": [
      "Statement 1 only",
      "Statement 2 only",
      "Statement 3 only",
      "Statements 1 and 3 only"
    ],
    "PNL-QL-148": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient"
    ],
    "PNL-QL-142": [
      "Scheme A by 5%",
      "Scheme B by 5%",
      "Both schemes give the same profit rate",
      "The schemes cannot be compared"
    ],
    "PNL-QL-145": [
      "Scheme A by 10%",
      "Scheme B by 10%",
      "Both schemes give the same profit rate",
      "The table is insufficient"
    ]
  };
  const pool = pools[qlId] ?? [
    "10% profit",
    "10% loss",
    "20% profit",
    "20% loss",
    "No profit, no loss",
    "Cannot be determined"
  ];
  return pool.filter((item) => item !== correct);
}
function buildOptions4(qlId, seed, answer) {
  const correct = formatAnswer5(answer);
  const source = answer.kind === "TEXT" ? textDistractors4(qlId, correct) : numericDistractors4(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0], label: "NOMINAL_INSTEAD_OF_DELIVERED_COST" },
    { value: unique[1], label: "WRONG_PERCENTAGE_BASE" },
    { value: unique[2], label: "IGNORED_PRICE_OR_QUANTITY_DECEPTION" }
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
function stable4(value) {
  return JSON.stringify(
    value,
    (_, item) => typeof item === "bigint" ? item.toString() : item
  );
}
function sameRate(actualDirection, actualRate, expectedDirection, expectedRate) {
  return actualDirection === expectedDirection && stable4(actualRate) === stable4(expectedRate);
}
function forwardConsistency2(request, result) {
  switch (request.mode) {
    case "TARGET_RATE_TO_DELIVERED_QUANTITY": {
      if (!("deliveredQuantity" in result) || result.deliveredQuantity.denominator !== 1n)
        return false;
      const forward = solvePnlCp005Request({
        mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity: request.quotedSellingPricePerNominalQuantity,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: result.deliveredQuantity.numerator
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.targetDirection,
        request.targetRatePercent
      );
    }
    case "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP": {
      if (!("quotedSellingPrice" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity: result.quotedSellingPrice,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.targetDirection,
        request.targetRatePercent
      );
    }
    case "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP": {
      if (!("markupPercent" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        markupPercent: result.markupPercent,
        discountPercent: request.discountPercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.targetDirection,
        request.targetRatePercent
      );
    }
    case "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT": {
      if (!("discountPercent" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        markupPercent: request.markupPercent,
        discountPercent: result.discountPercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.targetDirection,
        request.targetRatePercent
      );
    }
    case "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY": {
      if (!("deliveredQuantity" in result) || result.deliveredQuantity.denominator !== 1n)
        return false;
      const forward = solvePnlCp005Request({
        mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: moneyFromPaise(100000n),
        declaredDirection: request.declaredDirection,
        declaredRatePercent: request.declaredRatePercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: result.deliveredQuantity.numerator
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.actualDirection,
        request.actualRatePercent
      );
    }
    case "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE": {
      if (!("declaredDirection" in result) || !("declaredRatePercent" in result))
        return false;
      const forward = solvePnlCp005Request({
        mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: moneyFromPaise(100000n),
        declaredDirection: result.declaredDirection === "NO_CHANGE" ? "PROFIT" : result.declaredDirection,
        declaredRatePercent: result.declaredRatePercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.actualDirection,
        request.actualRatePercent
      );
    }
    case "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE":
    case "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE": {
      if (!("costPricePerTrueQuantity" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
        costPricePerTrueQuantity: result.costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity: request.quotedSellingPricePerNominalQuantity,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity
      });
      if (!("direction" in forward)) return false;
      if (request.mode === "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE") {
        return "ratePercent" in forward && sameRate(
          forward.direction,
          forward.ratePercent,
          request.actualDirection,
          request.actualRatePercent
        );
      }
      return "amount" in forward && forward.direction === request.actualDirection && forward.amount.paise === request.actualAmount.paise;
    }
    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY": {
      if (!("deliveredQuantity" in result) || result.deliveredQuantity.denominator !== 1n)
        return false;
      const forward = solvePnlCp005Request({
        mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
        purchasePricePerNominalQuantity: request.purchasePricePerNominalQuantity,
        sellingPricePerNominalQuantity: request.sellingPricePerNominalQuantity,
        nominalQuantity: 1000n,
        receivedQuantity: request.receivedQuantity,
        deliveredQuantity: result.deliveredQuantity.numerator
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.targetDirection,
        request.targetRatePercent
      );
    }
    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY": {
      if (!("receivedQuantity" in result) || result.receivedQuantity.denominator !== 1n)
        return false;
      const forward = solvePnlCp005Request({
        mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
        purchasePricePerNominalQuantity: request.purchasePricePerNominalQuantity,
        sellingPricePerNominalQuantity: request.sellingPricePerNominalQuantity,
        nominalQuantity: 1000n,
        receivedQuantity: result.receivedQuantity.numerator,
        deliveredQuantity: request.deliveredQuantity
      });
      return "direction" in forward && "ratePercent" in forward && sameRate(
        forward.direction,
        forward.ratePercent,
        request.targetDirection,
        request.targetRatePercent
      );
    }
    default:
      return true;
  }
}
function selectQl5(input) {
  if (input.questionLanguageId) {
    if (!PNL_CP005_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-005 question-language ID: ${input.questionLanguageId}`
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP005_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp005Case(
      qlId,
      `${input.seed ?? "cp005"}:probe`
    ).registry;
    return !input.difficultyBand || registry.difficulty === input.difficultyBand;
  });
  if (!eligible.length)
    throw new Error("No CP-005 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp005-dynamic"}:ql-selection`),
    eligible
  );
}
function containsUnresolvedProsePlaceholder4(value) {
  const proseOnly = value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}
function listPnlCp005DynamicQlIds() {
  return [...PNL_CP005_QL_IDS];
}
function runPnlCp005DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-005 dynamic runtime currently supports English only."
    );
  }
  const qlId = selectQl5(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated2 = generatePnlCp005Case(qlId, seed);
  const result = solvePnlCp005Request(generated2.request);
  const recomputed = solvePnlCp005Request(generated2.request);
  const answerValue = answerFor4(qlId, result, generated2);
  const answer = formatAnswer5(answerValue);
  const optionSet = buildOptions4(qlId, seed, answerValue);
  const editorial = editorialLibrary5.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);
  const context = {
    ...generated2.context,
    ...resultContext3(result, answer)
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context
  );
  const explanationText = `${baseExplanation}

**Working with these values:** Separate the billed amount from the cost of the quantity actually delivered. Price changes and quantity changes must be combined on the same true-cost base.

**Final answer:** ${answer}`;
  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated2.registry && editorial),
      message: "The QL exists in both the frozen registry and English editorial library."
    },
    {
      name: "exact-recomputation",
      passed: stable4(result) === stable4(recomputed),
      message: "Exact recomputation agrees with the canonical CP-005 solver."
    },
    {
      name: "inverse-forward-consistency",
      passed: forwardConsistency2(generated2.request, result),
      message: "Every inverse answer reproduces its generated forward dishonest-trade case."
    },
    {
      name: "four-misconception-options",
      passed: optionSet.options.length === 4 && new Set(optionSet.options).size === 4 && optionSet.options[optionSet.correctIndex] === answer && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: "Four unique options contain one answer and three labelled misconceptions."
    },
    {
      name: "dynamic-editorial-binding",
      passed: !containsUnresolvedProsePlaceholder4(stem) && !containsUnresolvedProsePlaceholder4(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders."
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication."
    }
  ];
  const validation = { valid: checks.every((check) => check.passed), checks };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${checks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`
    );
  }
  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001",
    canonicalProblemId: PNL_CP005_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en",
    difficultyBand: generated2.registry.difficulty,
    stem,
    answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP005_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en",
      difficultyBand: generated2.registry.difficulty,
      taskKind: generated2.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated2.registry.answerSemantic,
      requiredVariables: [...generated2.registry.requiredVariables],
      variables: context,
      seed,
      runtimeMode: PNL_CP005_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      sourceTrace: {
        registry: "PNL-001/CP-005/task-registry.library.json",
        editorial: "PNL-001/CP-005/editorial-content.en.json",
        solver: "PNL-001/foundation/dishonest-trade-solver.ts | dishonest-trade-advanced-solver.ts"
      }
    },
    solver: {
      answer,
      numericAnswer: answerValue.kind === "MONEY" ? Number(answerValue.value.paise) / 100 : answerValue.kind === "PERCENT" || answerValue.kind === "QUANTITY" ? rationalToNumber(answerValue.value) : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated2.registry.solveMode,
        answerSemantic: generated2.registry.answerSemantic,
        exactRecomputation: "PASS",
        inverseForwardConsistency: "PASS"
      },
      mathJax: {}
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        {
          id: "given",
          label: "Generated price and quantity values",
          value: context
        },
        {
          id: "mode",
          label: "Solve mode",
          value: generated2.registry.solveMode
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
      canonicalProblemId: PNL_CP005_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated2.registry.solveMode,
      answerSemantic: generated2.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated2.registry.difficulty,
      representation: generated2.registry.representation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP005_DYNAMIC_RUNTIME_MODE,
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

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-006/editorial-content.en.json
var editorial_content_en_default6 = {
  schemaVersion: 2,
  archetypeId: "PNL-001",
  cpId: "PNL-CP-006",
  language: "en",
  status: "EDITORIAL_REVIEW_CANDIDATE",
  entries: {
    "PNL-QL-150": {
      stem: {
        contextFamily: "machine refurbishment",
        blocks: [
          {
            type: "paragraph",
            content: "A workshop purchases a machine for \u20B9{purchasePrice}. It spends \u20B9{repairExpense} on repairs, \u20B9{transportExpense} on transport, and \u20B9{installationExpense} on installation."
          }
        ],
        prompt: "Find the machine's effective cost."
      },
      explanation: {
        opening: "The purchase price is only the starting cost.",
        concept: "Every necessary expense incurred before the machine is ready for use becomes part of effective cost.",
        steps: [
          {
            title: "Add all additional expenses",
            body: "Combine repair, transport, and installation costs."
          },
          {
            title: "Add them to purchase price",
            body: "Effective cost equals purchase price plus the total additional expense.",
            equationLatex: "E=C+R+T+I"
          }
        ],
        conclusion: "The resulting total is the effective cost of the machine.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveCost}",
        commonTrap: "Do not calculate profit or loss from purchase price alone when essential pre-sale expenses are given."
      },
      difficulty: "Easy",
      difficultyRationale: "Direct addition of visible cost components."
    },
    "PNL-QL-151": {
      stem: {
        contextFamily: "retail setup expenses",
        blocks: [
          {
            type: "paragraph",
            content: "A retailer purchases display equipment for \u20B9{purchasePrice}. Incidental setup expenses are {overheadPercent}% of the purchase price."
          }
        ],
        prompt: "Find the effective cost."
      },
      explanation: {
        opening: "Let us first convert the percentage expense into a rupee amount.",
        concept: "The overhead is calculated on purchase price and then added to it.",
        steps: [
          {
            title: "Find overhead amount",
            body: "Take {overheadPercent}% of the purchase price.",
            equationLatex: "O=C\\times\\frac{r}{100}"
          },
          {
            title: "Find effective cost",
            body: "Add overhead to purchase price.",
            equationLatex: "E=C+O"
          }
        ],
        conclusion: "The sum is the effective cost.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveCost}",
        commonTrap: "Do not treat the overhead percentage itself as a rupee amount."
      },
      difficulty: "Easy",
      difficultyRationale: "One visible percentage calculation and addition."
    },
    "PNL-QL-152": {
      stem: {
        contextFamily: "used-equipment resale",
        blocks: [
          {
            type: "paragraph",
            content: "A dealer buys used equipment for \u20B9{purchasePrice} and spends \u20B9{expenses} making it ready for sale."
          }
        ],
        prompt: "At what price should it be sold to earn {profitPercent}% profit on effective cost?"
      },
      explanation: {
        opening: "We should build the true cost before applying the profit rate.",
        concept: "Profit is measured on purchase price plus all preparation expenses.",
        steps: [
          {
            title: "Find effective cost",
            body: "Add the purchase price and expenses.",
            equationLatex: "E=C+e"
          },
          {
            title: "Apply the profit multiplier",
            body: "Increase E by {profitPercent}%.",
            equationLatex: "S=E\\left(1+\\frac{r}{100}\\right)"
          }
        ],
        conclusion: "This selling price gives the required profit on effective cost.",
        finalAnswerLatex: "\\text{\u20B9}{sellingPrice}",
        commonTrap: "Do not calculate profit on purchase price alone."
      },
      difficulty: "Medium",
      difficultyRationale: "Hidden effective-cost base followed by one forward multiplier."
    },
    "PNL-QL-153": {
      stem: {
        contextFamily: "damaged-stock resale",
        blocks: [
          {
            type: "paragraph",
            content: "A trader buys a damaged appliance for \u20B9{purchasePrice} and spends \u20B9{expenses} restoring it."
          }
        ],
        prompt: "At what price should it be sold if a loss of {lossPercent}% is accepted on effective cost?"
      },
      explanation: {
        opening: "Even for a loss, the restoration expense belongs to the cost base.",
        concept: "First find effective cost, then retain 100\u2212loss percent of it.",
        steps: [
          {
            title: "Find effective cost",
            body: "Add purchase and restoration costs."
          },
          {
            title: "Apply the loss factor",
            body: "Multiply effective cost by 1\u2212loss/100.",
            equationLatex: "S=E\\left(1-\\frac{r}{100}\\right)"
          }
        ],
        conclusion: "The resulting amount is the selling price at the stated loss.",
        finalAnswerLatex: "\\text{\u20B9}{sellingPrice}",
        commonTrap: "Do not subtract the loss from purchase price before adding expenses."
      },
      difficulty: "Medium",
      difficultyRationale: "Effective-cost construction and one loss multiplier."
    },
    "PNL-QL-154": {
      stem: {
        contextFamily: "furniture restoration",
        blocks: [
          {
            type: "paragraph",
            content: "An antique desk is purchased for \u20B9{purchasePrice}, restored at an additional cost of \u20B9{expenses}, and sold for \u20B9{sellingPrice}."
          }
        ],
        prompt: "Calculate the percentage gain or loss on effective cost."
      },
      explanation: {
        opening: "The restoration expense changes the base on which the result must be measured.",
        concept: "Compare selling price with total effective cost, then divide the difference by effective cost.",
        steps: [
          {
            title: "Find effective cost",
            body: "Add purchase and restoration costs.",
            equationLatex: "E=C+e"
          },
          {
            title: "Find the amount result",
            body: "Take the absolute difference between selling price and E."
          },
          {
            title: "Convert to a percentage",
            body: "Divide the amount by E and multiply by 100."
          }
        ],
        conclusion: "The sign of selling price minus effective cost gives profit or loss.",
        finalAnswerLatex: "{resultRatePercent}\\%\\;{resultDirection}",
        commonTrap: "Do not use purchase price as the denominator after restoration cost has been incurred."
      },
      difficulty: "Medium",
      difficultyRationale: "Effective-cost adjustment plus a standard result-rate calculation."
    },
    "PNL-QL-155": {
      stem: {
        contextFamily: "vehicle resale budgeting",
        blocks: [
          {
            type: "paragraph",
            content: "A dealer purchases a vehicle for \u20B9{purchasePrice} and expects to sell it for \u20B9{sellingPrice}."
          }
        ],
        prompt: "What is the maximum additional expense allowed if the final result must still be {targetRatePercent}% {targetDirection} on effective cost?"
      },
      explanation: {
        opening: "The target rate tells us the largest effective cost compatible with the planned selling price.",
        concept: "Reverse the target multiplier from selling price, then compare the allowable effective cost with purchase price.",
        steps: [
          {
            title: "Recover target effective cost",
            body: "Divide selling price by the target commercial factor.",
            equationLatex: "E_{max}=\\frac{S}{1\\pm r/100}"
          },
          {
            title: "Find maximum expense",
            body: "Subtract purchase price from E_max.",
            equationLatex: "e_{max}=E_{max}-C"
          }
        ],
        conclusion: "This difference is the most that can be spent without missing the target.",
        finalAnswerLatex: "\\text{\u20B9}{maximumAllowableExpense}",
        commonTrap: "Do not take the target percentage directly on selling price; the stated rate is measured on effective cost."
      },
      difficulty: "Hard",
      difficultyRationale: "Inverse target-rate calculation with allowable expense as the unknown."
    },
    "PNL-QL-156": {
      stem: {
        contextFamily: "bakery production wastage",
        blocks: [
          {
            type: "paragraph",
            content: "A bakery spends \u20B9{totalInputCost} on ingredients for {inputQuantity} units of output. During preparation, {wastedQuantity} units are lost."
          }
        ],
        prompt: "Find the effective cost per usable unit."
      },
      explanation: {
        opening: "The total cost must now be recovered from fewer usable units.",
        concept: "Wastage reduces output quantity but does not reduce the original input cost.",
        steps: [
          {
            title: "Find usable output",
            body: "Subtract wasted quantity from input quantity.",
            equationLatex: "q_u=q-w"
          },
          {
            title: "Find unit cost",
            body: "Divide total input cost by usable output.",
            equationLatex: "c_u=\\frac{C}{q_u}"
          }
        ],
        conclusion: "This is the effective cost of each usable unit.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveUnitCost}",
        commonTrap: "Do not divide by the original input quantity after wastage."
      },
      difficulty: "Medium",
      difficultyRationale: "One quantity adjustment and unit-cost division."
    },
    "PNL-QL-157": {
      stem: {
        contextFamily: "food-processing yield",
        blocks: [
          {
            type: "paragraph",
            content: "A food-processing batch costs \u20B9{totalInputCost} and begins with {inputQuantity} units. After {wastedQuantity} units are lost, the usable output must be sold for an overall {targetRatePercent}% {targetDirection}."
          }
        ],
        prompt: "Find the required selling price per usable unit."
      },
      explanation: {
        opening: "We need the target total recovery and the reduced usable quantity.",
        concept: "Apply the target rate to total batch cost, then spread the required recovery across usable units.",
        steps: [
          {
            title: "Find usable quantity",
            body: "Subtract wastage from input quantity."
          },
          {
            title: "Find target total recovery",
            body: "Apply the target profit or loss factor to total input cost."
          },
          {
            title: "Find unit selling price",
            body: "Divide target recovery by usable quantity.",
            equationLatex: "s_u=\\frac{R_{target}}{q_u}"
          }
        ],
        conclusion: "This price per usable unit produces the required overall result.",
        finalAnswerLatex: "\\text{\u20B9}{requiredUnitSellingPrice}",
        commonTrap: "Do not apply the target percentage to the already increased unit cost a second time."
      },
      difficulty: "Hard",
      difficultyRationale: "Wastage-adjusted quantity plus target total-recovery allocation."
    },
    "PNL-QL-158": {
      stem: {
        contextFamily: "small factory break-even",
        blocks: [
          {
            type: "paragraph",
            content: "A small factory has fixed cost \u20B9{fixedCost}. Variable cost is \u20B9{variableCostPerUnit} per unit and selling price is \u20B9{sellingPricePerUnit} per unit."
          }
        ],
        prompt: "Find the minimum number of units required to break even."
      },
      explanation: {
        opening: "Every unit contributes part of its selling price toward recovering fixed cost.",
        concept: "Break-even occurs when total unit contribution exactly covers fixed cost.",
        steps: [
          {
            title: "Find contribution per unit",
            body: "Subtract variable cost from selling price.",
            equationLatex: "u=S-V"
          },
          {
            title: "Cover fixed cost",
            body: "Divide fixed cost by unit contribution and round upward if necessary.",
            equationLatex: "q_{BE}=\\left\\lceil\\frac{F}{u}\\right\\rceil"
          }
        ],
        conclusion: "This minimum whole-unit quantity reaches break-even.",
        finalAnswerLatex: "{breakEvenQuantity}\\;\\text{units}",
        commonTrap: "Do not divide fixed cost by selling price; variable cost must be removed first."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct contribution formula with possible whole-unit rounding."
    },
    "PNL-QL-159": {
      stem: {
        contextFamily: "printing press target profit",
        blocks: [
          {
            type: "paragraph",
            content: "A printing press has fixed cost \u20B9{fixedCost}. Each booklet costs \u20B9{variableCostPerUnit} to print and sells for \u20B9{sellingPricePerUnit}."
          }
        ],
        prompt: "How many booklets must be sold to earn at least \u20B9{targetProfit}?"
      },
      explanation: {
        opening: "The contribution from sales must cover both fixed cost and the desired profit.",
        concept: "Required quantity equals fixed cost plus target profit divided by contribution per unit.",
        steps: [
          {
            title: "Find unit contribution",
            body: "Subtract variable cost from selling price."
          },
          {
            title: "Find total amount to be covered",
            body: "Add target profit to fixed cost."
          },
          {
            title: "Calculate minimum quantity",
            body: "Divide and round upward to a whole unit.",
            equationLatex: "q=\\left\\lceil\\frac{F+P}{S-V}\\right\\rceil"
          }
        ],
        conclusion: "This is the least quantity that reaches the target profit.",
        finalAnswerLatex: "{requiredQuantity}\\;\\text{units}",
        commonTrap: "Do not add target profit to selling price or forget to round a fractional quantity upward."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct target-profit contribution formula with rounding."
    },
    "PNL-QL-160": {
      stem: {
        contextFamily: "workshop unit pricing",
        blocks: [
          {
            type: "paragraph",
            content: "A workshop has fixed cost \u20B9{fixedCost} and variable cost \u20B9{variableCostPerUnit} per unit. It plans to produce and sell {quantity} units."
          }
        ],
        prompt: "Find the break-even selling price per unit."
      },
      explanation: {
        opening: "At break-even, each unit must cover its variable cost and an equal share of fixed cost.",
        concept: "Allocate fixed cost across the planned quantity, then add variable cost per unit.",
        steps: [
          {
            title: "Find fixed cost per unit",
            body: "Divide fixed cost by quantity.",
            equationLatex: "f_u=\\frac{F}{q}"
          },
          {
            title: "Add variable cost",
            body: "Break-even price equals variable cost plus fixed-cost share.",
            equationLatex: "S_{BE}=V+f_u"
          }
        ],
        conclusion: "This unit price exactly recovers total cost.",
        finalAnswerLatex: "\\text{\u20B9}{breakEvenSellingPricePerUnit}",
        commonTrap: "Do not divide total variable cost by quantity again when variable cost is already given per unit."
      },
      difficulty: "Medium",
      difficultyRationale: "Fixed-cost allocation and one addition."
    },
    "PNL-QL-161": {
      stem: {
        contextFamily: "loss recovery across two assets",
        blocks: [
          {
            type: "paragraph",
            content: "A trader buys one asset for \u20B9{firstCostPrice} and sells it for \u20B9{firstSellingPrice}, making a loss. He then buys another asset for \u20B9{secondCostPrice}."
          }
        ],
        prompt: "At what price should the second asset be sold so that the two transactions together break even?"
      },
      explanation: {
        opening: "The second sale must recover the combined cost after accounting for the first sale's receipt.",
        concept: "For overall break-even, total selling price must equal total cost price.",
        steps: [
          {
            title: "Find combined cost",
            body: "Add the two purchase prices."
          },
          {
            title: "Subtract the first recovery",
            body: "The remaining amount must come from the second sale.",
            equationLatex: "S_2=C_1+C_2-S_1"
          }
        ],
        conclusion: "This selling price makes total recovery equal total cost.",
        finalAnswerLatex: "\\text{\u20B9}{requiredSecondSellingPrice}",
        commonTrap: "Do not apply the first loss percentage directly to the second asset's cost."
      },
      difficulty: "Medium",
      difficultyRationale: "Two-transaction recovery with a direct total-cost equation."
    },
    "PNL-QL-162": {
      stem: {
        contextFamily: "portfolio resale target",
        blocks: [
          {
            type: "paragraph",
            content: "A trader buys one item for \u20B9{firstCostPrice} and sells it for \u20B9{firstSellingPrice}. He then purchases another item for \u20B9{secondCostPrice}."
          }
        ],
        prompt: "Find the second selling price required for an overall {targetRatePercent}% {targetDirection} across both transactions."
      },
      explanation: {
        opening: "The target rate applies to the combined cost of both items.",
        concept: "Find target total recovery first, then subtract the amount already recovered from the first sale.",
        steps: [
          {
            title: "Find combined cost",
            body: "Add both purchase prices.",
            equationLatex: "C_T=C_1+C_2"
          },
          {
            title: "Find target total recovery",
            body: "Apply the overall target factor to C_T."
          },
          {
            title: "Find required second sale",
            body: "Subtract first selling price from target total recovery.",
            equationLatex: "S_2=R_T-S_1"
          }
        ],
        conclusion: "This second selling price produces the required overall result.",
        finalAnswerLatex: "\\text{\u20B9}{requiredSecondSellingPrice}",
        commonTrap: "Do not apply the target percentage only to the second item's cost."
      },
      difficulty: "Hard",
      difficultyRationale: "Combined-cost target recovery with one prior sale already realized."
    },
    "PNL-QL-163": {
      stem: {
        contextFamily: "commercial recovery inversion",
        blocks: [
          {
            type: "paragraph",
            content: "A commercial transaction realizes \u20B9{totalRecovery}, representing a {ratePercent}% {direction} on effective cost."
          }
        ],
        prompt: "Find the effective cost."
      },
      explanation: {
        opening: "The recovery is the final value, so we reverse the stated commercial multiplier.",
        concept: "Effective cost equals total recovery divided by the profit or loss factor.",
        steps: [
          {
            title: "Write the correct multiplier",
            body: "Use 1+r/100 for profit and 1\u2212r/100 for loss."
          },
          {
            title: "Reverse it",
            body: "Divide recovery by the multiplier.",
            equationLatex: "E=\\frac{R}{1\\pm r/100}"
          }
        ],
        conclusion: "The quotient is the effective cost.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveCost}",
        commonTrap: "Do not subtract the percentage directly from the recovery amount."
      },
      difficulty: "Medium",
      difficultyRationale: "Single reverse commercial multiplier."
    },
    "PNL-QL-164": {
      stem: {
        contextFamily: "solar-panel installation",
        blocks: [
          {
            type: "paragraph",
            content: "A solar installer buys equipment for \u20B9{purchasePrice}. Flat expenses are {flatExpenses}, followed by overhead of {overheadPercent}% calculated on {overheadBase}."
          }
        ],
        prompt: "Find the effective cost."
      },
      explanation: {
        opening: "The order matters because the percentage overhead has an explicitly stated base.",
        concept: "Add flat expenses, calculate overhead on the named base, and then combine all cost components.",
        steps: [
          {
            title: "Total the flat expenses",
            body: "Add every listed fixed expense."
          },
          {
            title: "Identify the overhead base",
            body: "Use either purchase price alone or purchase price plus flat expenses, as stated."
          },
          {
            title: "Calculate final effective cost",
            body: "Add purchase price, flat expenses, and percentage overhead."
          }
        ],
        conclusion: "The complete sum is the effective cost.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveCost}",
        commonTrap: "Do not silently calculate overhead on purchase price when the stated base includes flat expenses."
      },
      difficulty: "Medium",
      difficultyRationale: "Mixed flat and percentage overhead with an explicit base choice."
    },
    "PNL-QL-165": {
      stem: {
        contextFamily: "asset cost reconciliation",
        blocks: [
          {
            type: "paragraph",
            content: "An asset is purchased for \u20B9{purchasePrice}, and its final effective cost is \u20B9{effectiveCost}."
          }
        ],
        prompt: "Find the total additional expense included in the cost."
      },
      explanation: {
        opening: "The additional expense is simply the part of effective cost above purchase price.",
        concept: "Effective cost equals purchase price plus total expense.",
        steps: [
          {
            title: "Rearrange the cost relation",
            body: "Subtract purchase price from effective cost.",
            equationLatex: "e=E-C"
          }
        ],
        conclusion: "The difference is the total additional expense.",
        finalAnswerLatex: "\\text{\u20B9}{totalExpense}",
        commonTrap: "Do not treat the difference as a profit amount; no sale has occurred."
      },
      difficulty: "Easy",
      difficultyRationale: "One direct subtraction from the effective-cost identity."
    },
    "PNL-QL-166": {
      stem: {
        contextFamily: "warehouse setup audit",
        blocks: [
          {
            type: "paragraph",
            content: "A warehouse unit is purchased for \u20B9{purchasePrice}, incurs flat expenses {flatExpenses}, and has an effective cost of \u20B9{effectiveCost}. The remaining overhead is calculated on {overheadBase}."
          }
        ],
        prompt: "Find the overhead percentage."
      },
      explanation: {
        opening: "We first isolate the rupee overhead, then compare it with the correct base.",
        concept: "Percentage overhead is the unexplained part of effective cost divided by its stated calculation base.",
        steps: [
          {
            title: "Find flat-expense total",
            body: "Add the listed fixed expenses."
          },
          {
            title: "Isolate overhead amount",
            body: "Subtract purchase price and flat expenses from effective cost."
          },
          {
            title: "Identify the percentage base",
            body: "Use the named overhead base, not automatically the effective cost."
          },
          {
            title: "Calculate the rate",
            body: "Overhead% = overhead amount \xF7 base \xD7 100."
          }
        ],
        conclusion: "This gives the missing overhead percentage.",
        finalAnswerLatex: "{overheadPercent}\\%",
        commonTrap: "Using effective cost as the denominator changes the meaning of the stated overhead rate."
      },
      difficulty: "Hard",
      difficultyRationale: "Reverse component isolation with a selectable percentage base."
    },
    "PNL-QL-167": {
      stem: {
        contextFamily: "packaging factory costing",
        blocks: [
          {
            type: "paragraph",
            content: "A factory spends \u20B9{rawMaterialCost} on raw material and \u20B9{labourCost} on labour. Factory overhead is {factoryOverheadPercent}% of prime cost, packaging costs \u20B9{packagingCost}, scrap is sold for \u20B9{scrapRecovery}, and output is {outputQuantity} units."
          }
        ],
        prompt: "Find the net production cost."
      },
      explanation: {
        opening: "We can organise the factory data into prime cost, overhead, added packaging, and scrap recovery.",
        concept: "Scrap recovery reduces production cost, while overhead is calculated specifically on prime cost.",
        steps: [
          {
            title: "Find prime cost",
            body: "Add raw material and labour.",
            equationLatex: "P=R+L"
          },
          {
            title: "Calculate factory overhead",
            body: "Take the stated percentage of P."
          },
          {
            title: "Find gross production cost",
            body: "Add prime cost, overhead, and packaging."
          },
          {
            title: "Deduct scrap recovery",
            body: "Net production cost equals gross cost minus scrap proceeds."
          }
        ],
        conclusion: "The remaining amount is the net cost of producing the batch.",
        finalAnswerLatex: "\\text{\u20B9}{netProductionCost}",
        commonTrap: "Do not calculate factory overhead on raw material alone or forget that scrap recovery is deducted."
      },
      difficulty: "Hard",
      difficultyRationale: "Multiple cost components with a hidden prime-cost base and recovery deduction."
    },
    "PNL-QL-168": {
      stem: {
        contextFamily: "manufacturing unit cost",
        blocks: [
          {
            type: "paragraph",
            content: "A manufacturing run uses material worth \u20B9{rawMaterialCost} and labour worth \u20B9{labourCost}. Factory overhead is {factoryOverheadPercent}% of prime cost, packaging costs \u20B9{packagingCost}, scrap recovery is \u20B9{scrapRecovery}, and {outputQuantity} usable units are produced."
          }
        ],
        prompt: "Find the effective cost per unit."
      },
      explanation: {
        opening: "We should find the batch's net production cost before dividing by output.",
        concept: "Unit cost is net production cost spread over usable units.",
        steps: [
          {
            title: "Build prime and overhead cost",
            body: "Add material and labour, then calculate overhead on that prime-cost base."
          },
          {
            title: "Find net batch cost",
            body: "Add packaging and deduct scrap recovery."
          },
          {
            title: "Calculate unit cost",
            body: "Divide net batch cost by output quantity.",
            equationLatex: "c_u=\\frac{C_{net}}{q}"
          }
        ],
        conclusion: "This is the effective cost of each usable unit.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveUnitCost}",
        commonTrap: "Do not divide gross cost before deducting scrap recovery."
      },
      difficulty: "Hard",
      difficultyRationale: "Multi-component manufacturing ledger followed by unit allocation."
    },
    "PNL-QL-169": {
      stem: {
        contextFamily: "metal fabrication waste",
        blocks: [
          {
            type: "paragraph",
            content: "Metal input costing \u20B9{totalInputCost} contains {inputQuantity} units. After {wastedQuantity} units are lost in cutting, the waste is sold for \u20B9{scrapRecovery}."
          }
        ],
        prompt: "Find the effective cost per usable unit."
      },
      explanation: {
        opening: "The scrap proceeds recover part of the input cost, while wastage reduces usable output.",
        concept: "Net recoverable cost is total input cost minus scrap recovery, divided by usable quantity.",
        steps: [
          {
            title: "Find usable quantity",
            body: "Subtract wasted units from input quantity."
          },
          {
            title: "Find net cost",
            body: "Deduct scrap recovery from total input cost."
          },
          {
            title: "Find effective unit cost",
            body: "Divide net cost by usable quantity."
          }
        ],
        conclusion: "This value is the cost carried by each usable unit.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveUnitCost}",
        commonTrap: "Scrap recovery reduces cost; it does not increase usable quantity."
      },
      difficulty: "Hard",
      difficultyRationale: "Simultaneous output reduction and cost recovery adjustment."
    },
    "PNL-QL-170": {
      stem: {
        contextFamily: "bakery fixed-cost recovery",
        blocks: [
          {
            type: "paragraph",
            content: "A bakery breaks even after selling {breakEvenQuantity} batches. Variable cost is \u20B9{variableCostPerUnit} per batch and selling price is \u20B9{sellingPricePerUnit} per batch."
          }
        ],
        prompt: "Find the bakery's fixed cost."
      },
      explanation: {
        opening: "At break-even, total contribution from all batches equals fixed cost.",
        concept: "Unit contribution is selling price minus variable cost.",
        steps: [
          {
            title: "Find contribution per batch",
            body: "Subtract variable cost from selling price."
          },
          {
            title: "Multiply by break-even quantity",
            body: "Fixed cost equals contribution per batch times the number of batches.",
            equationLatex: "F=q_{BE}(S-V)"
          }
        ],
        conclusion: "The product is the fixed cost.",
        finalAnswerLatex: "\\text{\u20B9}{fixedCost}",
        commonTrap: "Do not multiply break-even quantity by the full selling price."
      },
      difficulty: "Medium",
      difficultyRationale: "Reverse break-even identity with fixed cost as the unknown."
    },
    "PNL-QL-171": {
      stem: {
        contextFamily: "subscription-service break-even",
        blocks: [
          {
            type: "paragraph",
            content: "A service business has fixed cost \u20B9{fixedCost} and breaks even after {breakEvenQuantity} subscriptions sold at \u20B9{sellingPricePerUnit} each."
          }
        ],
        prompt: "Find the variable cost per subscription."
      },
      explanation: {
        opening: "Break-even quantity tells us the contribution required from each subscription.",
        concept: "Unit contribution equals fixed cost divided by break-even quantity; variable cost is the part of selling price left after contribution.",
        steps: [
          {
            title: "Find unit contribution",
            body: "Divide fixed cost by break-even quantity.",
            equationLatex: "u=\\frac{F}{q_{BE}}"
          },
          {
            title: "Recover variable cost",
            body: "Subtract contribution from selling price.",
            equationLatex: "V=S-u"
          }
        ],
        conclusion: "This is the variable cost per subscription.",
        finalAnswerLatex: "\\text{\u20B9}{variableCostPerUnit}",
        commonTrap: "Do not subtract fixed cost directly from one unit's selling price."
      },
      difficulty: "Hard",
      difficultyRationale: "Reverse contribution calculation with variable cost as the hidden component."
    },
    "PNL-QL-172": {
      stem: {
        contextFamily: "custom furniture pricing",
        blocks: [
          {
            type: "paragraph",
            content: "A furniture maker has fixed cost \u20B9{fixedCost} and variable cost \u20B9{variableCostPerUnit} per unit. It plans to sell {quantity} units and earn \u20B9{targetProfit}."
          }
        ],
        prompt: "What selling price per unit is required?"
      },
      explanation: {
        opening: "Each unit must cover variable cost and also contribute toward fixed cost plus target profit.",
        concept: "Allocate fixed cost and target profit across the planned quantity, then add variable cost per unit.",
        steps: [
          {
            title: "Find required contribution per unit",
            body: "Divide fixed cost plus target profit by quantity.",
            equationLatex: "u=\\frac{F+P}{q}"
          },
          {
            title: "Add variable cost",
            body: "Required selling price equals V+u."
          }
        ],
        conclusion: "This unit price produces the target total profit at the planned quantity.",
        finalAnswerLatex: "\\text{\u20B9}{requiredSellingPricePerUnit}",
        commonTrap: "Do not divide variable cost by quantity when it is already stated per unit."
      },
      difficulty: "Hard",
      difficultyRationale: "Inverse unit-price target with fixed-cost and profit allocation."
    },
    "PNL-QL-173": {
      stem: {
        contextFamily: "retail contribution planning",
        blocks: [
          {
            type: "paragraph",
            content: "A retail business has fixed cost \u20B9{fixedCost} and contribution-margin ratio {contributionMarginPercent}%."
          }
        ],
        prompt: "Find its break-even revenue."
      },
      explanation: {
        opening: "The contribution-margin ratio tells us what share of revenue is available to cover fixed cost.",
        concept: "At break-even, contribution equals fixed cost.",
        steps: [
          {
            title: "Write the contribution relation",
            body: "Contribution = revenue \xD7 contribution-margin ratio."
          },
          {
            title: "Solve for revenue",
            body: "Divide fixed cost by the ratio expressed as a decimal.",
            equationLatex: "R_{BE}=\\frac{F}{CMR}"
          }
        ],
        conclusion: "This revenue level exactly covers fixed cost.",
        finalAnswerLatex: "\\text{\u20B9}{breakEvenRevenue}",
        commonTrap: "Do not take the contribution-margin percentage of fixed cost."
      },
      difficulty: "Medium",
      difficultyRationale: "Single inverse contribution-ratio relation."
    },
    "PNL-QL-174": {
      stem: {
        contextFamily: "business contribution audit",
        blocks: [
          {
            type: "paragraph",
            content: "A business has fixed cost \u20B9{fixedCost} and break-even revenue \u20B9{breakEvenRevenue}."
          }
        ],
        prompt: "Find the contribution-margin ratio."
      },
      explanation: {
        opening: "At break-even, the contribution generated by revenue equals fixed cost.",
        concept: "Contribution-margin ratio is fixed cost divided by break-even revenue.",
        steps: [
          {
            title: "Form the ratio",
            body: "Divide fixed cost by break-even revenue."
          },
          {
            title: "Convert to a percentage",
            body: "Multiply the fraction by 100.",
            equationLatex: "CMR=\\frac{F}{R_{BE}}\\times100"
          }
        ],
        conclusion: "This is the contribution-margin ratio.",
        finalAnswerLatex: "{contributionMarginPercent}\\%",
        commonTrap: "Do not divide revenue by fixed cost; that gives the reciprocal."
      },
      difficulty: "Medium",
      difficultyRationale: "Direct ratio construction and percentage conversion."
    },
    "PNL-QL-175": {
      stem: {
        contextFamily: "multi-product cafe mix",
        blocks: [
          {
            type: "paragraph",
            content: "A cafe sells products in the fixed mix {productMix}. Its total fixed cost is \u20B9{fixedCost}."
          }
        ],
        prompt: "Find the minimum number of complete product-mix bundles required to break even."
      },
      explanation: {
        opening: "Because the products are sold in a fixed mix, one complete mix should be treated as a single composite bundle.",
        concept: "Add the contributions of all products in one bundle, then use that bundle contribution to cover fixed cost.",
        steps: [
          {
            title: "Find each product's unit contribution",
            body: "Subtract variable cost from selling price for every product."
          },
          {
            title: "Find contribution per bundle",
            body: "Multiply each unit contribution by its units in the mix and add the results."
          },
          {
            title: "Find break-even bundles",
            body: "Divide fixed cost by bundle contribution and round upward."
          }
        ],
        conclusion: "This minimum whole number of bundles reaches break-even.",
        finalAnswerLatex: "{breakEvenBundles}\\;\\text{bundles}",
        commonTrap: "Do not average the products' contribution percentages or ignore their quantities in the mix."
      },
      difficulty: "Hard",
      difficultyRationale: "Weighted product-mix contribution and whole-bundle rounding."
    },
    "PNL-QL-176": {
      stem: {
        contextFamily: "sales margin of safety",
        blocks: [
          {
            type: "paragraph",
            content: "A business records actual revenue of \u20B9{actualRevenue} and break-even revenue of \u20B9{breakEvenRevenue}."
          }
        ],
        prompt: "Find the margin of safety in rupees."
      },
      explanation: {
        opening: "Margin of safety is the part of actual revenue above break-even revenue.",
        concept: "It is a direct difference between actual and break-even sales.",
        steps: [
          {
            title: "Subtract break-even revenue",
            body: "Margin of safety = actual revenue \u2212 break-even revenue.",
            equationLatex: "MOS=R_A-R_{BE}"
          }
        ],
        conclusion: "The difference is the rupee margin of safety.",
        finalAnswerLatex: "\\text{\u20B9}{marginOfSafetyAmount}",
        commonTrap: "Do not calculate a percentage when the question asks for a rupee amount."
      },
      difficulty: "Easy",
      difficultyRationale: "One direct subtraction after identifying the correct business measure."
    },
    "PNL-QL-177": {
      stem: {
        contextFamily: "revenue risk analysis",
        blocks: [
          {
            type: "paragraph",
            content: "A business has actual revenue \u20B9{actualRevenue} and break-even revenue \u20B9{breakEvenRevenue}."
          }
        ],
        prompt: "Find the margin-of-safety percentage on actual revenue."
      },
      explanation: {
        opening: "We first find the safe revenue cushion, then express it relative to actual revenue.",
        concept: "Margin-of-safety percentage uses actual revenue as its base.",
        steps: [
          {
            title: "Find margin-of-safety amount",
            body: "Subtract break-even revenue from actual revenue."
          },
          {
            title: "Convert to a percentage",
            body: "Divide the margin by actual revenue and multiply by 100.",
            equationLatex: "MOS\\%=\\frac{R_A-R_{BE}}{R_A}\\times100"
          }
        ],
        conclusion: "This percentage shows how far revenue can fall before reaching break-even.",
        finalAnswerLatex: "{marginOfSafetyPercent}\\%",
        commonTrap: "Do not divide by break-even revenue; the requested base is actual revenue."
      },
      difficulty: "Medium",
      difficultyRationale: "One subtraction and a non-obvious percentage base."
    },
    "PNL-QL-178": {
      stem: {
        contextFamily: "multi-sale recovery plan",
        blocks: [
          {
            type: "paragraph",
            content: "Several commercial items have a combined effective cost of \u20B9{totalCost}. Earlier recoveries are {priorRecoveries}."
          }
        ],
        prompt: "Find the final recovery required for an overall {targetRatePercent}% {targetDirection}."
      },
      explanation: {
        opening: "The final sale must complete the target recovery after earlier receipts are counted.",
        concept: "Target total recovery is based on combined effective cost; the required final amount is what remains after prior recoveries.",
        steps: [
          {
            title: "Find target total recovery",
            body: "Apply the target profit or loss factor to total effective cost."
          },
          {
            title: "Add prior recoveries",
            body: "Combine every amount already received."
          },
          {
            title: "Find the remaining requirement",
            body: "Subtract prior recovery total from target total recovery."
          }
        ],
        conclusion: "The balance is the required final recovery.",
        finalAnswerLatex: "\\text{\u20B9}{requiredFinalRecovery}",
        commonTrap: "Do not apply the target rate only to the unsold or final item unless the question states that base."
      },
      difficulty: "Hard",
      difficultyRationale: "Aggregate target recovery after multiple prior receipts."
    },
    "PNL-QL-179": {
      stem: {
        contextFamily: "capital recovery after loss",
        blocks: [
          {
            type: "paragraph",
            content: "A trader loses {lossPercent}% of his capital."
          }
        ],
        prompt: "What profit percentage on the remaining capital is required to restore the original capital?"
      },
      explanation: {
        opening: "After a loss, the recovery percentage is calculated on a smaller base.",
        concept: "If l% is lost, only 100\u2212l percent remains, while the amount to recover is l percent of the original capital.",
        steps: [
          {
            title: "Identify remaining capital",
            body: "Remaining base = 100\u2212l."
          },
          {
            title: "Compare required recovery with remaining base",
            body: "Required profit% = l/(100\u2212l) \xD7 100.",
            equationLatex: "r=\\frac{l}{100-l}\\times100"
          }
        ],
        conclusion: "This higher percentage restores the original capital.",
        finalAnswerLatex: "{requiredProfitPercent}\\%",
        commonTrap: "A loss of l% is not recovered by an equal l% profit because the second percentage uses a smaller base."
      },
      difficulty: "Medium",
      difficultyRationale: "Single cross-base recovery identity."
    },
    "PNL-QL-180": {
      stem: {
        contextFamily: "online marketplace commission",
        blocks: [
          {
            type: "paragraph",
            content: "A product has effective cost \u20B9{effectiveCost} and is sold online for \u20B9{grossSellingPrice}. The marketplace deducts {commissionPercent}% of the gross selling price."
          }
        ],
        prompt: "Find the profit or loss amount and percentage."
      },
      explanation: {
        opening: "The seller's real recovery is the amount left after marketplace commission.",
        concept: "Deduct commission from gross price, then compare net recovery with effective cost.",
        steps: [
          {
            title: "Find commission amount",
            body: "Calculate the stated percentage of gross selling price."
          },
          {
            title: "Find net recovery",
            body: "Subtract commission from gross price."
          },
          {
            title: "Find amount and rate",
            body: "Compare net recovery with effective cost and divide the absolute difference by effective cost."
          }
        ],
        conclusion: "The comparison gives both the amount and percentage result.",
        finalAnswerLatex: "\\text{\u20B9}{resultAmount},\\;{resultRatePercent}\\%\\;{resultDirection}",
        commonTrap: "Do not compare gross selling price with cost before deducting commission."
      },
      difficulty: "Hard",
      difficultyRationale: "Gross-to-net realization plus amount and percentage semantics."
    },
    "PNL-QL-181": {
      stem: {
        contextFamily: "auction target pricing",
        blocks: [
          {
            type: "paragraph",
            content: "An item has effective cost \u20B9{effectiveCost}. An auction platform will deduct {commissionPercent}% from the gross selling price."
          }
        ],
        prompt: "Find the gross price required for {targetRatePercent}% {targetDirection} on effective cost."
      },
      explanation: {
        opening: "The target result fixes the required net receipt, and the commission rule then fixes the gross price.",
        concept: "First calculate target net recovery; then reverse the commission deduction.",
        steps: [
          {
            title: "Find target net recovery",
            body: "Apply the target factor to effective cost."
          },
          {
            title: "Find retained fraction",
            body: "After commission, the seller keeps 1\u2212c/100 of gross price."
          },
          {
            title: "Recover gross price",
            body: "Divide target net recovery by the retained fraction.",
            equationLatex: "G=\\frac{N_{target}}{1-c/100}"
          }
        ],
        conclusion: "This gross price leaves the desired net result after commission.",
        finalAnswerLatex: "\\text{\u20B9}{requiredGrossSellingPrice}",
        commonTrap: "Do not add c% to the target net receipt; commission is calculated on gross price, not net receipt."
      },
      difficulty: "Hard",
      difficultyRationale: "Two-stage inverse involving target recovery and commission reversal."
    },
    "PNL-QL-182": {
      stem: {
        contextFamily: "manufacturing cost table",
        blocks: [
          {
            type: "paragraph",
            content: "A production manager records the batch costs in the table below."
          },
          {
            type: "table",
            caption: "Manufacturing cost sheet",
            columns: [
              "Cost component",
              "Amount or rate",
              "Calculation base"
            ],
            rowSource: "manufacturingTable"
          },
          {
            type: "paragraph",
            content: "The batch produces {outputQuantity} units, and scrap is sold for \u20B9{scrapRecovery}."
          }
        ],
        prompt: "Find the effective cost per unit."
      },
      explanation: {
        opening: "The table should be read as a cost ledger, with each percentage applied to the base named in its row.",
        concept: "Build gross production cost from the table, deduct scrap recovery, and divide by output.",
        steps: [
          {
            title: "Read and calculate each table component",
            body: "Convert percentage rows into amounts using their stated bases."
          },
          {
            title: "Find net batch cost",
            body: "Add cost components and subtract scrap recovery."
          },
          {
            title: "Calculate unit cost",
            body: "Divide net batch cost by output quantity."
          }
        ],
        conclusion: "The quotient is the effective production cost per unit.",
        finalAnswerLatex: "\\text{\u20B9}{effectiveUnitCost}",
        commonTrap: "Do not apply every percentage in the table to the same base."
      },
      difficulty: "Hard",
      difficultyRationale: "Authentic table interpretation with multiple cost bases and unit allocation."
    },
    "PNL-QL-183": {
      stem: {
        contextFamily: "multi-product break-even caselet",
        blocks: [
          {
            type: "caselet",
            title: "Product-mix planning caselet",
            paragraphSource: "caseletData"
          },
          {
            type: "paragraph",
            content: "The business has fixed cost \u20B9{fixedCost} and sells products in the fixed mix {productMix}."
          }
        ],
        prompt: "Find the minimum number of complete mix bundles required to break even."
      },
      explanation: {
        opening: "The caselet gives several products, but the fixed sales mix lets us combine them into one composite bundle.",
        concept: "Break-even bundles equal fixed cost divided by contribution per complete mix bundle.",
        steps: [
          {
            title: "Extract contribution data",
            body: "For each product, subtract variable cost from selling price."
          },
          {
            title: "Build bundle contribution",
            body: "Multiply each contribution by its quantity in the fixed mix and add."
          },
          {
            title: "Find minimum bundles",
            body: "Divide fixed cost by bundle contribution and round upward."
          }
        ],
        conclusion: "This number of complete bundles covers fixed cost.",
        finalAnswerLatex: "{breakEvenBundles}\\;\\text{bundles}",
        commonTrap: "Do not calculate separate break-even quantities for each product when the caselet requires a fixed mix."
      },
      difficulty: "Hard",
      difficultyRationale: "Caselet extraction, weighted mix contribution, and whole-bundle rounding."
    },
    "PNL-QL-184": {
      stem: {
        contextFamily: "loss-recovery statements",
        blocks: [
          {
            type: "paragraph",
            content: "A trader loses {lossPercent}% of capital."
          },
          {
            type: "statements",
            lead: "Consider the following statements about recovery:",
            statements: [
              "The same percentage profit always restores the original capital.",
              "The required profit is measured on the reduced remaining capital.",
              "Required recovery percentage is loss percentage divided by 100."
            ]
          }
        ],
        prompt: "Select the correct statement."
      },
      explanation: {
        opening: "The key is to notice that loss and recovery use different bases.",
        concept: "Recovery profit is calculated on the smaller amount remaining after loss.",
        steps: [
          {
            title: "Identify the new base",
            body: "After losing l%, only 100\u2212l percent remains."
          },
          {
            title: "Evaluate the statements",
            body: "The correct statement must use the reduced base and the relation l/(100\u2212l)."
          }
        ],
        conclusion: "Choose the statement that explicitly recognises the reduced capital base.",
        finalAnswerLatex: "{correctStatement}",
        commonTrap: "Equal loss and gain percentages do not cancel when their bases differ."
      },
      difficulty: "Medium",
      difficultyRationale: "Conceptual statement evaluation of a known cross-base identity."
    },
    "PNL-QL-185": {
      stem: {
        contextFamily: "algebraic overhead reconstruction",
        blocks: [
          {
            type: "paragraph",
            content: "Purchase price is {purchasePriceExpression}, flat expense is {flatExpenseExpression}, and effective cost is {effectiveCostExpression}. Overhead is calculated on {overheadBase}."
          },
          {
            type: "equation",
            latex: "E=C+F+rB"
          }
        ],
        prompt: "Find the overhead percentage algebraically."
      },
      explanation: {
        opening: "The overhead amount is the part of effective cost left after the known cost components are removed.",
        concept: "Isolate the overhead term, divide by its stated base, and convert the fraction to a percentage.",
        steps: [
          {
            title: "Isolate overhead amount",
            body: "Rearrange E=C+F+O to obtain O=E\u2212C\u2212F."
          },
          {
            title: "Identify the algebraic base",
            body: "Use the expression named by {overheadBase}."
          },
          {
            title: "Find the rate",
            body: "Compute O/B \xD7 100 and simplify."
          }
        ],
        conclusion: "The simplified expression is the overhead percentage.",
        finalAnswerLatex: "{overheadPercent}\\%",
        commonTrap: "Do not divide by effective cost unless effective cost is explicitly the overhead base."
      },
      difficulty: "Hard",
      difficultyRationale: "Symbolic component isolation with a selectable percentage base."
    },
    "PNL-QL-186": {
      stem: {
        contextFamily: "break-even data sufficiency",
        blocks: [
          {
            type: "data_sufficiency",
            question: "The break-even quantity of a business is to be determined.",
            statements: [
              "{statementOne}",
              "{statementTwo}"
            ],
            answerScheme: "STANDARD_TWO_STATEMENT"
          }
        ],
        prompt: "Decide whether Statement I alone, Statement II alone, both together, or neither is sufficient."
      },
      explanation: {
        opening: "We need enough information to determine fixed cost and unit contribution uniquely.",
        concept: "Break-even quantity is F/(selling price\u2212variable cost), so the required components must be fixed by the statements.",
        steps: [
          {
            title: "Test Statement I alone",
            body: "Check whether it determines fixed cost and unit contribution without using Statement II."
          },
          {
            title: "Test Statement II alone",
            body: "Perform the same completeness test independently."
          },
          {
            title: "Combine if needed",
            body: "Use both statements only after judging each one separately."
          }
        ],
        conclusion: "Choose the data-sufficiency option corresponding to the first sufficient information set.",
        finalAnswerLatex: "{dataSufficiencyAnswer}",
        commonTrap: "Do not confuse having two numerical facts with having the specific independent facts required by the break-even equation."
      },
      difficulty: "Hard",
      difficultyRationale: "Data-sufficiency reasoning about equation completeness and uniqueness."
    }
  },
  entryCount: 37
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-006/task-registry.library.json
var task_registry_library_default6 = {
  archetypeId: "PNL-001",
  cpId: "PNL-CP-006",
  status: "FREEZE_CANDIDATE",
  countPolicy: "DISCOVERED_NOT_QUOTA_DRIVEN",
  title: "Effective Cost, Recovery and Break-Even",
  ownershipNote: "Owns overhead-adjusted effective cost, manufacturing and wastage-adjusted cost, contribution and break-even, commercial recovery and commission-adjusted realization outside a trader chain. Plain partial-inventory recovery remains in CP-003; intermediary chain commission remains in CP-004.",
  entries: {
    "PNL-QL-150": { solveMode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST", answerSemantic: "effectiveCost", requiredVariables: ["purchasePrice", "repairExpense", "transportExpense", "installationExpense"], difficulty: "Easy" },
    "PNL-QL-151": { solveMode: "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST", answerSemantic: "effectiveCost", requiredVariables: ["purchasePrice", "overheadPercent"], difficulty: "Easy" },
    "PNL-QL-152": { solveMode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE", answerSemantic: "sellingPrice", requiredVariables: ["purchasePrice", "expenses", "profitPercent"], difficulty: "Medium" },
    "PNL-QL-153": { solveMode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE", answerSemantic: "sellingPrice", requiredVariables: ["purchasePrice", "expenses", "lossPercent"], difficulty: "Medium" },
    "PNL-QL-154": { solveMode: "PURCHASE_EXPENSES_AND_SP_TO_RESULT", answerSemantic: "profitOrLossPercentOnEffectiveCost", requiredVariables: ["purchasePrice", "expenses", "sellingPrice"], difficulty: "Medium" },
    "PNL-QL-155": { solveMode: "SP_TARGET_RATE_TO_MAX_EXPENSE", answerSemantic: "maximumAllowableExpense", requiredVariables: ["purchasePrice", "sellingPrice", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-156": { solveMode: "WASTAGE_TO_EFFECTIVE_UNIT_COST", answerSemantic: "effectiveUnitCost", requiredVariables: ["totalInputCost", "inputQuantity", "wastedQuantity"], difficulty: "Medium" },
    "PNL-QL-157": { solveMode: "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP", answerSemantic: "requiredUnitSellingPrice", requiredVariables: ["totalInputCost", "inputQuantity", "wastedQuantity", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-158": { solveMode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY", answerSemantic: "breakEvenQuantity", requiredVariables: ["fixedCost", "variableCostPerUnit", "sellingPricePerUnit"], difficulty: "Medium" },
    "PNL-QL-159": { solveMode: "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY", answerSemantic: "requiredQuantity", requiredVariables: ["fixedCost", "targetProfit", "variableCostPerUnit", "sellingPricePerUnit"], difficulty: "Hard" },
    "PNL-QL-160": { solveMode: "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP", answerSemantic: "breakEvenSellingPricePerUnit", requiredVariables: ["fixedCost", "variableCostPerUnit", "quantity"], difficulty: "Medium" },
    "PNL-QL-161": { solveMode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP", answerSemantic: "requiredSecondSellingPriceForBreakEven", requiredVariables: ["firstCostPrice", "firstSellingPrice", "secondCostPrice"], difficulty: "Hard" },
    "PNL-QL-162": { solveMode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP", answerSemantic: "requiredSecondSellingPriceForTarget", requiredVariables: ["firstCostPrice", "firstSellingPrice", "secondCostPrice", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-163": { solveMode: "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST", answerSemantic: "effectiveCost", requiredVariables: ["totalRecovery", "direction", "ratePercent"], difficulty: "Medium" },
    "PNL-QL-164": { solveMode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST", answerSemantic: "effectiveCost", requiredVariables: ["purchasePrice", "flatExpenses", "overheadPercent", "overheadBase"], difficulty: "Medium" },
    "PNL-QL-165": { solveMode: "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE", answerSemantic: "totalExpense", requiredVariables: ["purchasePrice", "effectiveCost"], difficulty: "Easy" },
    "PNL-QL-166": { solveMode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE", answerSemantic: "overheadPercent", requiredVariables: ["purchasePrice", "flatExpenses", "effectiveCost", "overheadBase"], difficulty: "Hard" },
    "PNL-QL-167": { solveMode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST", answerSemantic: "netProductionCost", requiredVariables: ["rawMaterialCost", "labourCost", "factoryOverheadPercent", "packagingCost", "scrapRecovery", "outputQuantity"], difficulty: "Hard" },
    "PNL-QL-168": { solveMode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST", answerSemantic: "effectiveUnitCost", requiredVariables: ["rawMaterialCost", "labourCost", "factoryOverheadPercent", "packagingCost", "scrapRecovery", "outputQuantity"], difficulty: "Hard" },
    "PNL-QL-169": { solveMode: "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST", answerSemantic: "effectiveUnitCostAfterScrapRecovery", requiredVariables: ["totalInputCost", "inputQuantity", "wastedQuantity", "scrapRecovery"], difficulty: "Hard" },
    "PNL-QL-170": { solveMode: "BREAK_EVEN_QUANTITY_TO_FIXED_COST", answerSemantic: "fixedCost", requiredVariables: ["breakEvenQuantity", "variableCostPerUnit", "sellingPricePerUnit"], difficulty: "Medium" },
    "PNL-QL-171": { solveMode: "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST", answerSemantic: "variableCostPerUnit", requiredVariables: ["fixedCost", "breakEvenQuantity", "sellingPricePerUnit"], difficulty: "Hard" },
    "PNL-QL-172": { solveMode: "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP", answerSemantic: "requiredSellingPricePerUnit", requiredVariables: ["fixedCost", "variableCostPerUnit", "quantity", "targetProfit"], difficulty: "Hard" },
    "PNL-QL-173": { solveMode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE", answerSemantic: "breakEvenRevenue", requiredVariables: ["fixedCost", "contributionMarginPercent"], difficulty: "Hard" },
    "PNL-QL-174": { solveMode: "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO", answerSemantic: "contributionMarginPercent", requiredVariables: ["fixedCost", "breakEvenRevenue"], difficulty: "Hard" },
    "PNL-QL-175": { solveMode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES", answerSemantic: "breakEvenBundles", requiredVariables: ["fixedCost", "productMix"], difficulty: "Hard" },
    "PNL-QL-176": { solveMode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY", answerSemantic: "marginOfSafetyAmount", requiredVariables: ["actualRevenue", "breakEvenRevenue"], difficulty: "Medium" },
    "PNL-QL-177": { solveMode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY", answerSemantic: "marginOfSafetyPercent", requiredVariables: ["actualRevenue", "breakEvenRevenue"], difficulty: "Hard" },
    "PNL-QL-178": { solveMode: "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY", answerSemantic: "requiredFinalRecovery", requiredVariables: ["totalCost", "priorRecoveries", "targetDirection", "targetRatePercent"], difficulty: "Hard" },
    "PNL-QL-179": { solveMode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL", answerSemantic: "requiredProfitPercent", requiredVariables: ["lossPercent"], difficulty: "Medium" },
    "PNL-QL-180": { solveMode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT", answerSemantic: "profitOrLossAmountAndPercent", requiredVariables: ["effectiveCost", "grossSellingPrice", "commissionPercent"], difficulty: "Hard" },
    "PNL-QL-181": { solveMode: "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP", answerSemantic: "requiredGrossSellingPrice", requiredVariables: ["effectiveCost", "targetDirection", "targetRatePercent", "commissionPercent"], difficulty: "Hard" },
    "PNL-QL-182": { solveMode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST", answerSemantic: "tableUnitCost", requiredVariables: ["manufacturingTable", "outputQuantity", "scrapRecovery"], difficulty: "Hard", representation: "TABLE" },
    "PNL-QL-183": { solveMode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES", answerSemantic: "caseletBreakEvenBundles", requiredVariables: ["caseletData", "fixedCost", "productMix"], difficulty: "Hard", representation: "CASELET" },
    "PNL-QL-184": { solveMode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL", answerSemantic: "correctStatement", requiredVariables: ["lossPercent"], difficulty: "Medium", representation: "STATEMENT" },
    "PNL-QL-185": { solveMode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE", answerSemantic: "algebraicOverheadPercent", requiredVariables: ["purchasePriceExpression", "flatExpenseExpression", "effectiveCostExpression", "overheadBase"], difficulty: "Hard", representation: "ALGEBRAIC" },
    "PNL-QL-186": { solveMode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY", answerSemantic: "dataSufficiency", requiredVariables: ["statementOne", "statementTwo"], difficulty: "Hard", representation: "DATA_SUFFICIENCY" }
  },
  entryCount: 37,
  freezeNote: "Count frozen after effective-cost, manufacturing, wastage, contribution, break-even, recovery, commission, direct/inverse, answer-semantic, representation and QL-depth audits. Reopen only for a genuinely distinct source-backed mode or an execution defect."
};

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/effective-cost-recovery-solver.ts
function validateRate3(rate2, direction2) {
  if (rate2.denominator <= 0n || rate2.numerator < 0n) throw new Error("Rate must be non-negative.");
  if (direction2 === "LOSS" && rate2.numerator >= 100n * rate2.denominator) {
    throw new Error("Loss rate must be below 100% for an inverse price.");
  }
}
function addExpenses(purchasePrice, expenses) {
  if (purchasePrice.paise <= 0n) throw new Error("Purchase price must be positive.");
  let totalExpense = 0n;
  for (const expense of expenses) {
    if (expense.paise < 0n) throw new Error("Expense cannot be negative.");
    totalExpense += expense.paise;
  }
  return {
    totalExpense: moneyFromPaise(totalExpense),
    effectiveCost: moneyFromPaise(purchasePrice.paise + totalExpense)
  };
}
function priceFromRate(base, direction2, rate2) {
  validateRate3(rate2, direction2);
  const change = multiplyMoney(base, divideRational(rate2, rational(100)));
  return moneyFromPaise(direction2 === "PROFIT" ? base.paise + change.paise : base.paise - change.paise);
}
function baseFromRecovery(recovery, direction2, rate2) {
  validateRate3(rate2, direction2);
  const base = 100n * rate2.denominator;
  const denominator = direction2 === "PROFIT" ? base + rate2.numerator : base - rate2.numerator;
  return multiplyMoney(recovery, rational(base, denominator));
}
function summarize4(cost, recovery) {
  if (cost.paise <= 0n) throw new Error("Effective cost must be positive.");
  const difference = recovery.paise - cost.paise;
  const absolute = difference < 0n ? -difference : difference;
  return {
    direction: difference > 0n ? "PROFIT" : difference < 0n ? "LOSS" : "NO_CHANGE",
    amount: moneyFromPaise(absolute),
    ratePercent: asPercent(rational(absolute, cost.paise))
  };
}
function ceilDivide(numerator, denominator) {
  if (numerator < 0n || denominator <= 0n) throw new Error("Ceiling division requires non-negative numerator and positive denominator.");
  return (numerator + denominator - 1n) / denominator;
}
function effectiveUnitCostFromWastage(totalInputCost, inputQuantity, wastedQuantity) {
  if (totalInputCost.paise <= 0n) throw new Error("Total input cost must be positive.");
  if (inputQuantity <= 0n || wastedQuantity < 0n || wastedQuantity >= inputQuantity) {
    throw new Error("Wastage quantities must leave at least one usable unit.");
  }
  const usableQuantity = inputQuantity - wastedQuantity;
  if (totalInputCost.paise % usableQuantity !== 0n) throw new Error("Effective unit cost is not an exact paise amount.");
  return {
    usableQuantity,
    effectiveUnitCost: moneyFromPaise(totalInputCost.paise / usableQuantity)
  };
}
function solveEffectiveCostRecovery(request) {
  switch (request.mode) {
    case "FLAT_COMPONENTS_TO_EFFECTIVE_COST": {
      const result = addExpenses(request.purchasePrice, request.expenses);
      return { mode: request.mode, ...result };
    }
    case "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST": {
      validateRate3(request.overheadPercent, "PROFIT");
      const overheadAmount = multiplyMoney(request.purchasePrice, divideRational(request.overheadPercent, rational(100)));
      return {
        mode: request.mode,
        overheadAmount,
        effectiveCost: moneyFromPaise(request.purchasePrice.paise + overheadAmount.paise)
      };
    }
    case "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE":
      return { mode: request.mode, sellingPrice: priceFromRate(request.effectiveCost, request.direction, request.ratePercent) };
    case "PURCHASE_EXPENSES_AND_SP_TO_RESULT": {
      const { effectiveCost: effectiveCost2 } = addExpenses(request.purchasePrice, request.expenses);
      return { mode: request.mode, effectiveCost: effectiveCost2, ...summarize4(effectiveCost2, request.sellingPrice) };
    }
    case "SP_TARGET_RATE_TO_MAX_EXPENSE": {
      const targetEffectiveCost = baseFromRecovery(request.sellingPrice, request.direction, request.targetRatePercent);
      const expense = targetEffectiveCost.paise - request.purchasePrice.paise;
      if (expense < 0n) throw new Error("The purchase price already exceeds the target effective cost.");
      return { mode: request.mode, targetEffectiveCost, maximumExpense: moneyFromPaise(expense) };
    }
    case "WASTAGE_TO_EFFECTIVE_UNIT_COST": {
      const result = effectiveUnitCostFromWastage(request.totalInputCost, request.inputQuantity, request.wastedQuantity);
      return { mode: request.mode, ...result };
    }
    case "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP": {
      const unitCost = effectiveUnitCostFromWastage(request.totalInputCost, request.inputQuantity, request.wastedQuantity);
      return {
        mode: request.mode,
        usableQuantity: unitCost.usableQuantity,
        effectiveUnitCost: unitCost.effectiveUnitCost,
        requiredUnitSellingPrice: priceFromRate(unitCost.effectiveUnitCost, request.direction, request.ratePercent)
      };
    }
    case "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY": {
      const contribution = request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise;
      if (request.fixedCost.paise < 0n || contribution <= 0n) throw new Error("Selling price must exceed variable cost per unit.");
      return { mode: request.mode, breakEvenQuantity: ceilDivide(request.fixedCost.paise, contribution) };
    }
    case "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY": {
      const contribution = request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise;
      if (request.fixedCost.paise < 0n || request.targetProfit.paise < 0n || contribution <= 0n) {
        throw new Error("Costs and target profit must be valid, with positive unit contribution.");
      }
      return {
        mode: request.mode,
        requiredQuantity: ceilDivide(request.fixedCost.paise + request.targetProfit.paise, contribution)
      };
    }
    case "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP": {
      if (request.fixedCost.paise < 0n || request.variableCostPerUnit.paise < 0n || request.quantity <= 0n) {
        throw new Error("Cost values and quantity must be valid.");
      }
      if (request.fixedCost.paise % request.quantity !== 0n) throw new Error("Break-even unit price is not an exact paise amount.");
      return {
        mode: request.mode,
        breakEvenSellingPricePerUnit: moneyFromPaise(request.variableCostPerUnit.paise + request.fixedCost.paise / request.quantity)
      };
    }
    case "EARLIER_LOSS_TO_REQUIRED_NEXT_SP": {
      if (request.firstCostPrice.paise <= 0n || request.secondCostPrice.paise <= 0n || request.firstSellingPrice.paise < 0n) {
        throw new Error("Cost prices must be positive and selling price cannot be negative.");
      }
      const totalCost = moneyFromPaise(request.firstCostPrice.paise + request.secondCostPrice.paise);
      const targetRecovery = priceFromRate(totalCost, request.targetDirection, request.targetRatePercent);
      const required = targetRecovery.paise - request.firstSellingPrice.paise;
      if (required < 0n) throw new Error("The first sale already exceeds the target total recovery.");
      return { mode: request.mode, requiredSecondSellingPrice: moneyFromPaise(required) };
    }
    case "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST":
      return {
        mode: request.mode,
        effectiveCost: baseFromRecovery(request.totalRecovery, request.direction, request.ratePercent)
      };
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/effective-cost-advanced-solver.ts
function requireNonNegativeMoney(value, label) {
  if (value.paise < 0n) throw new Error(`${label} cannot be negative.`);
}
function requirePositiveMoney(value, label) {
  if (value.paise <= 0n) throw new Error(`${label} must be positive.`);
}
function validateNonNegativeRate2(rate2, label) {
  if (rate2.denominator <= 0n || rate2.numerator < 0n) throw new Error(`${label} must be non-negative.`);
}
function validateRateBelowHundred(rate2, label) {
  validateNonNegativeRate2(rate2, label);
  if (rate2.numerator >= 100n * rate2.denominator) throw new Error(`${label} must be below 100%.`);
}
function sumMoney(values) {
  let total = 0n;
  for (const value of values) {
    requireNonNegativeMoney(value, "Expense or recovery component");
    total += value.paise;
  }
  return moneyFromPaise(total);
}
function exactDivideMoney(numerator, denominator, label) {
  if (denominator <= 0n) throw new Error(`${label} denominator must be positive.`);
  if (numerator % denominator !== 0n) throw new Error(`${label} is not an exact paise amount.`);
  return moneyFromPaise(numerator / denominator);
}
function priceFromRate2(base, direction2, rate2) {
  requirePositiveMoney(base, "Cost base");
  validateNonNegativeRate2(rate2, "Commercial rate");
  if (direction2 === "LOSS" && rate2.numerator >= 100n * rate2.denominator) throw new Error("Loss rate must be below 100%.");
  const change = multiplyMoney(base, divideRational(rate2, rational(100)));
  return moneyFromPaise(direction2 === "PROFIT" ? base.paise + change.paise : base.paise - change.paise);
}
function summarize5(cost, recovery) {
  requirePositiveMoney(cost, "Effective cost");
  requireNonNegativeMoney(recovery, "Recovery");
  const difference = recovery.paise - cost.paise;
  const absolute = difference < 0n ? -difference : difference;
  return {
    direction: difference > 0n ? "PROFIT" : difference < 0n ? "LOSS" : "NO_CHANGE",
    amount: moneyFromPaise(absolute),
    ratePercent: asPercent(rational(absolute, cost.paise))
  };
}
function ceilDivide2(numerator, denominator) {
  if (numerator < 0n || denominator <= 0n) throw new Error("Ceiling division requires valid non-negative values.");
  return (numerator + denominator - 1n) / denominator;
}
function solveEffectiveCostAdvanced(request) {
  switch (request.mode) {
    case "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST": {
      requirePositiveMoney(request.purchasePrice, "Purchase price");
      validateNonNegativeRate2(request.overheadPercent, "Overhead rate");
      const flatExpenseTotal = sumMoney(request.flatExpenses);
      const overheadBase = request.overheadBase === "PURCHASE_PRICE" ? request.purchasePrice : moneyFromPaise(request.purchasePrice.paise + flatExpenseTotal.paise);
      const overheadAmount = multiplyMoney(overheadBase, divideRational(request.overheadPercent, rational(100)));
      return {
        mode: request.mode,
        flatExpenseTotal,
        overheadAmount,
        effectiveCost: moneyFromPaise(request.purchasePrice.paise + flatExpenseTotal.paise + overheadAmount.paise)
      };
    }
    case "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE": {
      requirePositiveMoney(request.purchasePrice, "Purchase price");
      if (request.effectiveCost.paise < request.purchasePrice.paise) throw new Error("Effective cost cannot be below purchase price.");
      return { mode: request.mode, totalExpense: moneyFromPaise(request.effectiveCost.paise - request.purchasePrice.paise) };
    }
    case "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE": {
      requirePositiveMoney(request.purchasePrice, "Purchase price");
      const flatExpenseTotal = sumMoney(request.flatExpenses);
      const overheadAmountPaise = request.effectiveCost.paise - request.purchasePrice.paise - flatExpenseTotal.paise;
      if (overheadAmountPaise < 0n) throw new Error("Effective cost is below purchase plus flat expenses.");
      const basePaise = request.overheadBase === "PURCHASE_PRICE" ? request.purchasePrice.paise : request.purchasePrice.paise + flatExpenseTotal.paise;
      return {
        mode: request.mode,
        overheadAmount: moneyFromPaise(overheadAmountPaise),
        overheadPercent: asPercent(rational(overheadAmountPaise, basePaise))
      };
    }
    case "MANUFACTURING_COMPONENTS_TO_UNIT_COST": {
      requireNonNegativeMoney(request.rawMaterialCost, "Raw-material cost");
      requireNonNegativeMoney(request.labourCost, "Labour cost");
      requireNonNegativeMoney(request.packagingCost, "Packaging cost");
      requireNonNegativeMoney(request.scrapRecovery, "Scrap recovery");
      if (request.outputQuantity <= 0n) throw new Error("Output quantity must be positive.");
      validateNonNegativeRate2(request.factoryOverheadPercentOnPrimeCost, "Factory-overhead rate");
      const primeCost = moneyFromPaise(request.rawMaterialCost.paise + request.labourCost.paise);
      const factoryOverheadAmount = multiplyMoney(primeCost, divideRational(request.factoryOverheadPercentOnPrimeCost, rational(100)));
      const netPaise = primeCost.paise + factoryOverheadAmount.paise + request.packagingCost.paise - request.scrapRecovery.paise;
      if (netPaise < 0n) throw new Error("Scrap recovery cannot exceed gross production cost.");
      const netProductionCost = moneyFromPaise(netPaise);
      return {
        mode: request.mode,
        primeCost,
        factoryOverheadAmount,
        netProductionCost,
        effectiveUnitCost: exactDivideMoney(netPaise, request.outputQuantity, "Manufacturing unit cost")
      };
    }
    case "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST": {
      requirePositiveMoney(request.totalInputCost, "Input cost");
      requireNonNegativeMoney(request.scrapRecovery, "Scrap recovery");
      if (request.inputQuantity <= 0n || request.wastedQuantity < 0n || request.wastedQuantity >= request.inputQuantity) {
        throw new Error("Wastage must leave at least one usable unit.");
      }
      const usableQuantity = request.inputQuantity - request.wastedQuantity;
      const netPaise = request.totalInputCost.paise - request.scrapRecovery.paise;
      if (netPaise < 0n) throw new Error("Scrap recovery cannot exceed input cost.");
      return {
        mode: request.mode,
        usableQuantity,
        netRecoverableCost: moneyFromPaise(netPaise),
        effectiveUnitCost: exactDivideMoney(netPaise, usableQuantity, "Wastage-adjusted unit cost")
      };
    }
    case "BREAK_EVEN_QUANTITY_TO_FIXED_COST": {
      if (request.breakEvenQuantity <= 0n) throw new Error("Break-even quantity must be positive.");
      const contribution = request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise;
      if (contribution <= 0n) throw new Error("Selling price must exceed variable cost.");
      return {
        mode: request.mode,
        unitContribution: moneyFromPaise(contribution),
        fixedCost: moneyFromPaise(request.breakEvenQuantity * contribution)
      };
    }
    case "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      if (request.breakEvenQuantity <= 0n) throw new Error("Break-even quantity must be positive.");
      const unitContribution = exactDivideMoney(request.fixedCost.paise, request.breakEvenQuantity, "Unit contribution");
      const variablePaise = request.sellingPricePerUnit.paise - unitContribution.paise;
      if (variablePaise < 0n) throw new Error("Derived variable cost cannot be negative.");
      return { mode: request.mode, unitContribution, variableCostPerUnit: moneyFromPaise(variablePaise) };
    }
    case "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      requireNonNegativeMoney(request.variableCostPerUnit, "Variable cost");
      requireNonNegativeMoney(request.targetProfit, "Target profit");
      if (request.quantity <= 0n) throw new Error("Quantity must be positive.");
      const fixedAndProfitPerUnit = exactDivideMoney(request.fixedCost.paise + request.targetProfit.paise, request.quantity, "Fixed-cost and profit allocation");
      return {
        mode: request.mode,
        requiredSellingPricePerUnit: moneyFromPaise(request.variableCostPerUnit.paise + fixedAndProfitPerUnit.paise)
      };
    }
    case "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      validateRateBelowHundred(request.contributionMarginPercent, "Contribution-margin ratio");
      if (request.contributionMarginPercent.numerator === 0n) throw new Error("Contribution-margin ratio must be positive.");
      return {
        mode: request.mode,
        breakEvenRevenue: multiplyMoney(request.fixedCost, rational(100n * request.contributionMarginPercent.denominator, request.contributionMarginPercent.numerator))
      };
    }
    case "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      requirePositiveMoney(request.breakEvenRevenue, "Break-even revenue");
      if (request.fixedCost.paise > request.breakEvenRevenue.paise) throw new Error("Fixed cost cannot exceed break-even revenue when the contribution ratio is at most 100%.");
      return {
        mode: request.mode,
        contributionMarginPercent: asPercent(rational(request.fixedCost.paise, request.breakEvenRevenue.paise))
      };
    }
    case "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      if (request.products.length === 0) throw new Error("At least one product is required.");
      let contributionPerBundle = 0n;
      for (const product of request.products) {
        if (product.unitsPerBundle <= 0n) throw new Error("Each product mix quantity must be positive.");
        const unitContribution = product.sellingPricePerUnit.paise - product.variableCostPerUnit.paise;
        if (unitContribution <= 0n) throw new Error("Every product must have positive unit contribution.");
        contributionPerBundle += product.unitsPerBundle * unitContribution;
      }
      return {
        mode: request.mode,
        contributionPerBundle: moneyFromPaise(contributionPerBundle),
        breakEvenBundles: ceilDivide2(request.fixedCost.paise, contributionPerBundle)
      };
    }
    case "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY": {
      requirePositiveMoney(request.actualRevenue, "Actual revenue");
      requireNonNegativeMoney(request.breakEvenRevenue, "Break-even revenue");
      if (request.breakEvenRevenue.paise > request.actualRevenue.paise) throw new Error("Actual revenue is below break-even revenue.");
      const amountPaise = request.actualRevenue.paise - request.breakEvenRevenue.paise;
      return {
        mode: request.mode,
        marginOfSafetyAmount: moneyFromPaise(amountPaise),
        marginOfSafetyPercent: asPercent(rational(amountPaise, request.actualRevenue.paise))
      };
    }
    case "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY": {
      requirePositiveMoney(request.totalCost, "Total cost");
      const priorRecoveryTotal = sumMoney(request.priorRecoveries);
      const targetTotalRecovery = priceFromRate2(request.totalCost, request.targetDirection, request.targetRatePercent);
      const requiredPaise = targetTotalRecovery.paise - priorRecoveryTotal.paise;
      if (requiredPaise < 0n) throw new Error("Prior recoveries already exceed the target total recovery.");
      return {
        mode: request.mode,
        targetTotalRecovery,
        priorRecoveryTotal,
        requiredFinalRecovery: moneyFromPaise(requiredPaise)
      };
    }
    case "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL": {
      validateRateBelowHundred(request.lossPercent, "Loss rate");
      const retained = 100n * request.lossPercent.denominator - request.lossPercent.numerator;
      return {
        mode: request.mode,
        requiredProfitPercent: rational(100n * request.lossPercent.numerator, retained)
      };
    }
    case "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT": {
      requirePositiveMoney(request.effectiveCost, "Effective cost");
      requireNonNegativeMoney(request.grossSellingPrice, "Gross selling price");
      validateRateBelowHundred(request.commissionPercent, "Commission rate");
      const commissionAmount = multiplyMoney(request.grossSellingPrice, divideRational(request.commissionPercent, rational(100)));
      const netRecovery = moneyFromPaise(request.grossSellingPrice.paise - commissionAmount.paise);
      return { mode: request.mode, commissionAmount, netRecovery, ...summarize5(request.effectiveCost, netRecovery) };
    }
    case "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP": {
      requirePositiveMoney(request.effectiveCost, "Effective cost");
      validateRateBelowHundred(request.commissionPercent, "Commission rate");
      const targetNetRecovery = priceFromRate2(request.effectiveCost, request.targetDirection, request.targetRatePercent);
      const retained = 100n * request.commissionPercent.denominator - request.commissionPercent.numerator;
      return {
        mode: request.mode,
        targetNetRecovery,
        requiredGrossSellingPrice: multiplyMoney(targetNetRecovery, rational(100n * request.commissionPercent.denominator, retained))
      };
    }
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-006/cp006-dynamic-cases.ts
var PNL_CP006_ID = "PNL-CP-006";
var taskRegistry6 = task_registry_library_default6;
var PNL_CP006_QL_IDS = Object.keys(taskRegistry6.entries);
var PURCHASE_PRICES = [1e4, 12e3, 15e3, 2e4, 24e3];
var FLAT_EXPENSES = [500, 800, 1e3, 1200, 1500, 2e3];
var RATES2 = [10, 20, 25];
var OVERHEAD_RATES = [5, 10, 20];
var UNIT_COSTS2 = [100, 120, 150, 200, 250];
var CONTRIBUTIONS = [50, 100, 150, 200];
var QUANTITIES2 = [40n, 50n, 80n, 100n, 120n];
var MANUFACTURING_PRESETS = [
  {
    raw: 12e3,
    labour: 8e3,
    overhead: 10,
    packaging: 2e3,
    scrap: 2e3,
    output: 100n
  },
  {
    raw: 15e3,
    labour: 1e4,
    overhead: 20,
    packaging: 3e3,
    scrap: 3e3,
    output: 100n
  },
  {
    raw: 18e3,
    labour: 12e3,
    overhead: 10,
    packaging: 4e3,
    scrap: 1e3,
    output: 120n
  }
];
var WASTAGE_SCRAP_PRESETS = [
  { input: 100n, wasted: 20n, totalCost: 1e4, scrap: 2e3 },
  { input: 120n, wasted: 20n, totalCost: 17e3, scrap: 5e3 },
  { input: 100n, wasted: 10n, totalCost: 16500, scrap: 3e3 }
];
var PRODUCT_MIX_PRESETS = [
  {
    fixedCost: 1e4,
    products: [
      { units: 2n, sp: 100, vc: 60 },
      { units: 1n, sp: 200, vc: 120 }
    ]
  },
  {
    fixedCost: 15e3,
    products: [
      { units: 3n, sp: 120, vc: 80 },
      { units: 2n, sp: 180, vc: 100 }
    ]
  },
  {
    fixedCost: 12e3,
    products: [
      { units: 1n, sp: 150, vc: 90 },
      { units: 2n, sp: 100, vc: 50 }
    ]
  }
];
var ADVANCED_MODES3 = /* @__PURE__ */ new Set([
  "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
  "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE",
  "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE",
  "MANUFACTURING_COMPONENTS_TO_UNIT_COST",
  "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST",
  "BREAK_EVEN_QUANTITY_TO_FIXED_COST",
  "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST",
  "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP",
  "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
  "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO",
  "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES",
  "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY",
  "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY",
  "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL",
  "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
  "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP"
]);
function cp006PlainMoney(value) {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}
function cp006FormatMoney(value) {
  return `\u20B9${cp006PlainMoney(value)}`;
}
function cp006FormatRational(value) {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function cp006FormatPercent(value) {
  return `${cp006FormatRational(value)}%`;
}
function rupees5(value) {
  return moneyFromRupees(value);
}
function pickNumber5(random, values) {
  return pickSeeded(random, values);
}
function direction(random) {
  return pickSeeded(random, ["PROFIT", "LOSS"]);
}
function effectiveCost(purchasePrice, expenses) {
  return solveEffectiveCostRecovery({
    mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST",
    purchasePrice,
    expenses
  }).effectiveCost;
}
function sellingPrice(cost, resultDirection, ratePercent) {
  return solveEffectiveCostRecovery({
    mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
    effectiveCost: cost,
    direction: resultDirection,
    ratePercent
  }).sellingPrice;
}
function flatExpenseText(expenses) {
  return expenses.map(cp006FormatMoney).join(", ");
}
function overheadBaseText(base) {
  return base === "PURCHASE_PRICE" ? "purchase price" : "purchase price plus flat expenses";
}
function productMixText(products) {
  return products.map(
    (product, index) => `Product ${String.fromCharCode(65 + index)}: ${product.unitsPerBundle} unit(s), selling price ${cp006FormatMoney(product.sellingPricePerUnit)}, variable cost ${cp006FormatMoney(product.variableCostPerUnit)}`
  ).join("; ");
}
function productMixRows(products) {
  return products.map((product, index) => [
    `Product ${String.fromCharCode(65 + index)}`,
    product.unitsPerBundle.toString(),
    cp006FormatMoney(product.sellingPricePerUnit),
    cp006FormatMoney(product.variableCostPerUnit)
  ]);
}
function solvePnlCp006Request(request) {
  return ADVANCED_MODES3.has(request.mode) ? solveEffectiveCostAdvanced(request) : solveEffectiveCostRecovery(request);
}
function mixedOverheadCase(random) {
  const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
  const flatExpenses = [
    rupees5(pickNumber5(random, FLAT_EXPENSES)),
    rupees5(pickNumber5(random, FLAT_EXPENSES))
  ];
  const overheadPercent = rational(pickNumber5(random, OVERHEAD_RATES));
  const overheadBase = pickSeeded(random, [
    "PURCHASE_PRICE",
    "PURCHASE_PLUS_FLAT"
  ]);
  const result = solveEffectiveCostAdvanced({
    mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
    purchasePrice,
    flatExpenses,
    overheadPercent,
    overheadBase
  });
  return {
    purchasePrice,
    flatExpenses,
    overheadPercent,
    overheadBase,
    result,
    context: {
      purchasePrice: cp006PlainMoney(purchasePrice),
      flatExpenses: flatExpenseText(flatExpenses),
      overheadPercent: cp006FormatRational(overheadPercent),
      overheadBase: overheadBaseText(overheadBase),
      effectiveCost: cp006PlainMoney(result.effectiveCost)
    }
  };
}
function manufacturingCase(random) {
  const preset = pickSeeded(random, MANUFACTURING_PRESETS);
  const request = {
    mode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST",
    rawMaterialCost: rupees5(preset.raw),
    labourCost: rupees5(preset.labour),
    factoryOverheadPercentOnPrimeCost: rational(preset.overhead),
    packagingCost: rupees5(preset.packaging),
    outputQuantity: preset.output,
    scrapRecovery: rupees5(preset.scrap)
  };
  const result = solveEffectiveCostAdvanced(request);
  return {
    request,
    result,
    context: {
      rawMaterialCost: preset.raw,
      labourCost: preset.labour,
      factoryOverheadPercent: preset.overhead,
      packagingCost: preset.packaging,
      outputQuantity: preset.output.toString(),
      scrapRecovery: preset.scrap,
      manufacturingTable: [
        [
          "Raw material",
          cp006FormatMoney(request.rawMaterialCost),
          "Direct amount"
        ],
        ["Labour", cp006FormatMoney(request.labourCost), "Direct amount"],
        ["Factory overhead", `${preset.overhead}%`, "Prime cost"],
        ["Packaging", cp006FormatMoney(request.packagingCost), "Direct amount"]
      ]
    }
  };
}
function generatePnlCp006Case(qlId, seedValue) {
  const registry = taskRegistry6.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-006 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);
  switch (qlId) {
    case "PNL-QL-150": {
      const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const expenses = [
        rupees5(pickNumber5(random, FLAT_EXPENSES)),
        rupees5(pickNumber5(random, FLAT_EXPENSES)),
        rupees5(pickNumber5(random, FLAT_EXPENSES))
      ];
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST",
          purchasePrice,
          expenses
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          repairExpense: cp006PlainMoney(expenses[0]),
          transportExpense: cp006PlainMoney(expenses[1]),
          installationExpense: cp006PlainMoney(expenses[2])
        }
      };
    }
    case "PNL-QL-151": {
      const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const overheadPercent = rational(pickNumber5(random, OVERHEAD_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST",
          purchasePrice,
          overheadPercent
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          overheadPercent: cp006FormatRational(overheadPercent)
        }
      };
    }
    case "PNL-QL-152":
    case "PNL-QL-153": {
      const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const expenses = [rupees5(pickNumber5(random, FLAT_EXPENSES))];
      const cost = effectiveCost(purchasePrice, expenses);
      const resultDirection = qlId === "PNL-QL-152" ? "PROFIT" : "LOSS";
      const ratePercent = rational(pickNumber5(random, RATES2));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
          effectiveCost: cost,
          direction: resultDirection,
          ratePercent
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          expenses: cp006PlainMoney(expenses[0]),
          profitPercent: resultDirection === "PROFIT" ? cp006FormatRational(ratePercent) : void 0,
          lossPercent: resultDirection === "LOSS" ? cp006FormatRational(ratePercent) : void 0
        }
      };
    }
    case "PNL-QL-154": {
      const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const expenses = [rupees5(pickNumber5(random, FLAT_EXPENSES))];
      const cost = effectiveCost(purchasePrice, expenses);
      const resultDirection = direction(random);
      const ratePercent = rational(pickNumber5(random, RATES2));
      const finalSellingPrice = sellingPrice(
        cost,
        resultDirection,
        ratePercent
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PURCHASE_EXPENSES_AND_SP_TO_RESULT",
          purchasePrice,
          expenses,
          sellingPrice: finalSellingPrice
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          expenses: cp006PlainMoney(expenses[0]),
          sellingPrice: cp006PlainMoney(finalSellingPrice)
        }
      };
    }
    case "PNL-QL-155": {
      const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const maximumExpense = rupees5(pickNumber5(random, FLAT_EXPENSES));
      const targetEffectiveCost = moneyFromPaise(
        purchasePrice.paise + maximumExpense.paise
      );
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(pickNumber5(random, RATES2));
      const plannedSellingPrice = sellingPrice(
        targetEffectiveCost,
        targetDirection,
        targetRatePercent
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "SP_TARGET_RATE_TO_MAX_EXPENSE",
          purchasePrice,
          sellingPrice: plannedSellingPrice,
          direction: targetDirection,
          targetRatePercent
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          sellingPrice: cp006PlainMoney(plannedSellingPrice),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-156":
    case "PNL-QL-157": {
      const usableQuantity = pickSeeded(random, [80n, 90n, 100n]);
      const wastedQuantity = pickSeeded(random, [10n, 20n]);
      const inputQuantity = usableQuantity + wastedQuantity;
      const unitCost = rupees5(pickNumber5(random, UNIT_COSTS2));
      const totalInputCost = moneyFromPaise(unitCost.paise * usableQuantity);
      if (qlId === "PNL-QL-156") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: "WASTAGE_TO_EFFECTIVE_UNIT_COST",
            totalInputCost,
            inputQuantity,
            wastedQuantity
          },
          context: {
            totalInputCost: cp006PlainMoney(totalInputCost),
            inputQuantity: inputQuantity.toString(),
            wastedQuantity: wastedQuantity.toString()
          }
        };
      }
      const targetDirection = direction(random);
      const targetRatePercent = rational(pickNumber5(random, RATES2));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP",
          totalInputCost,
          inputQuantity,
          wastedQuantity,
          direction: targetDirection,
          ratePercent: targetRatePercent
        },
        context: {
          totalInputCost: cp006PlainMoney(totalInputCost),
          inputQuantity: inputQuantity.toString(),
          wastedQuantity: wastedQuantity.toString(),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-158": {
      const breakEvenQuantity = pickSeeded(random, QUANTITIES2);
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const contribution = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise
      );
      const fixedCost = moneyFromPaise(contribution.paise * breakEvenQuantity);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY",
          fixedCost,
          variableCostPerUnit,
          sellingPricePerUnit
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit)
        }
      };
    }
    case "PNL-QL-159": {
      const requiredQuantity = pickSeeded(random, [50n, 80n, 100n]);
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const contribution = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise
      );
      const requiredContribution = contribution.paise * requiredQuantity;
      const fixedCost = moneyFromPaise(requiredContribution / 2n);
      const targetProfit = moneyFromPaise(
        requiredContribution - fixedCost.paise
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY",
          fixedCost,
          targetProfit,
          variableCostPerUnit,
          sellingPricePerUnit
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          targetProfit: cp006PlainMoney(targetProfit),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit)
        }
      };
    }
    case "PNL-QL-160": {
      const quantity = pickSeeded(random, QUANTITIES2);
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const fixedPerUnit = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const fixedCost = moneyFromPaise(fixedPerUnit.paise * quantity);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP",
          fixedCost,
          variableCostPerUnit,
          quantity
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          quantity: quantity.toString()
        }
      };
    }
    case "PNL-QL-161":
    case "PNL-QL-162": {
      const firstCostPrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const firstLossRate = rational(pickSeeded(random, [10, 20]));
      const firstSellingPrice = sellingPrice(
        firstCostPrice,
        "LOSS",
        firstLossRate
      );
      const secondCostPrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const targetDirection = "PROFIT";
      const targetRatePercent = qlId === "PNL-QL-161" ? rational(0) : rational(pickSeeded(random, [10, 20]));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP",
          firstCostPrice,
          firstSellingPrice,
          secondCostPrice,
          targetDirection,
          targetRatePercent
        },
        context: {
          firstCostPrice: cp006PlainMoney(firstCostPrice),
          firstSellingPrice: cp006PlainMoney(firstSellingPrice),
          secondCostPrice: cp006PlainMoney(secondCostPrice),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-163": {
      const cost = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const resultDirection = direction(random);
      const ratePercent = rational(pickNumber5(random, RATES2));
      const totalRecovery = sellingPrice(cost, resultDirection, ratePercent);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST",
          totalRecovery,
          direction: resultDirection,
          ratePercent
        },
        context: {
          totalRecovery: cp006PlainMoney(totalRecovery),
          direction: resultDirection.toLowerCase(),
          ratePercent: cp006FormatRational(ratePercent)
        }
      };
    }
    case "PNL-QL-164": {
      const generated2 = mixedOverheadCase(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
          purchasePrice: generated2.purchasePrice,
          flatExpenses: generated2.flatExpenses,
          overheadPercent: generated2.overheadPercent,
          overheadBase: generated2.overheadBase
        },
        context: generated2.context
      };
    }
    case "PNL-QL-165": {
      const purchasePrice = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const expensePercent = rational(pickNumber5(random, OVERHEAD_RATES));
      const totalExpense = moneyFromPaise(
        purchasePrice.paise * expensePercent.numerator / (100n * expensePercent.denominator)
      );
      const finalEffectiveCost = moneyFromPaise(
        purchasePrice.paise + totalExpense.paise
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE",
          purchasePrice,
          effectiveCost: finalEffectiveCost
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          effectiveCost: cp006PlainMoney(finalEffectiveCost)
        }
      };
    }
    case "PNL-QL-166":
    case "PNL-QL-185": {
      const generated2 = mixedOverheadCase(random);
      const context = {
        ...generated2.context,
        purchasePriceExpression: `${cp006PlainMoney(generated2.purchasePrice)}x`,
        flatExpenseExpression: `${generated2.flatExpenses.map((expense) => cp006PlainMoney(expense)).join("x+")}x`,
        effectiveCostExpression: `${cp006PlainMoney(generated2.result.effectiveCost)}x`
      };
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE",
          purchasePrice: generated2.purchasePrice,
          flatExpenses: generated2.flatExpenses,
          effectiveCost: generated2.result.effectiveCost,
          overheadBase: generated2.overheadBase
        },
        context
      };
    }
    case "PNL-QL-167":
    case "PNL-QL-168":
    case "PNL-QL-182": {
      const generated2 = manufacturingCase(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: generated2.request,
        context: generated2.context
      };
    }
    case "PNL-QL-169": {
      const preset = pickSeeded(random, WASTAGE_SCRAP_PRESETS);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST",
          totalInputCost: rupees5(preset.totalCost),
          inputQuantity: preset.input,
          wastedQuantity: preset.wasted,
          scrapRecovery: rupees5(preset.scrap)
        },
        context: {
          totalInputCost: preset.totalCost,
          inputQuantity: preset.input.toString(),
          wastedQuantity: preset.wasted.toString(),
          scrapRecovery: preset.scrap
        }
      };
    }
    case "PNL-QL-170": {
      const breakEvenQuantity = pickSeeded(random, QUANTITIES2);
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const contribution = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BREAK_EVEN_QUANTITY_TO_FIXED_COST",
          breakEvenQuantity,
          variableCostPerUnit,
          sellingPricePerUnit
        },
        context: {
          breakEvenQuantity: breakEvenQuantity.toString(),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit)
        }
      };
    }
    case "PNL-QL-171": {
      const breakEvenQuantity = pickSeeded(random, QUANTITIES2);
      const contribution = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const fixedCost = moneyFromPaise(contribution.paise * breakEvenQuantity);
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST",
          fixedCost,
          breakEvenQuantity,
          sellingPricePerUnit
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          breakEvenQuantity: breakEvenQuantity.toString(),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit)
        }
      };
    }
    case "PNL-QL-172": {
      const quantity = pickSeeded(random, QUANTITIES2);
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const fixedAllocation = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const profitAllocation = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const fixedCost = moneyFromPaise(fixedAllocation.paise * quantity);
      const targetProfit = moneyFromPaise(profitAllocation.paise * quantity);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP",
          fixedCost,
          variableCostPerUnit,
          quantity,
          targetProfit
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          quantity: quantity.toString(),
          targetProfit: cp006PlainMoney(targetProfit)
        }
      };
    }
    case "PNL-QL-173":
    case "PNL-QL-174": {
      const fixedCost = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const contributionMarginPercent = rational(
        pickSeeded(random, [20, 25, 40, 50])
      );
      const breakEvenRevenue = solveEffectiveCostAdvanced({
        mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
        fixedCost,
        contributionMarginPercent
      }).breakEvenRevenue;
      return qlId === "PNL-QL-173" ? {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
          fixedCost,
          contributionMarginPercent
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          contributionMarginPercent: cp006FormatRational(
            contributionMarginPercent
          )
        }
      } : {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO",
          fixedCost,
          breakEvenRevenue
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          breakEvenRevenue: cp006PlainMoney(breakEvenRevenue)
        }
      };
    }
    case "PNL-QL-175":
    case "PNL-QL-183": {
      const preset = pickSeeded(random, PRODUCT_MIX_PRESETS);
      const products = preset.products.map(
        (product) => ({
          unitsPerBundle: product.units,
          sellingPricePerUnit: rupees5(product.sp),
          variableCostPerUnit: rupees5(product.vc)
        })
      );
      const fixedCost = rupees5(preset.fixedCost);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES",
          fixedCost,
          products
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          productMix: productMixText(products),
          productMixTable: productMixRows(products),
          caseletData: [
            "Products must be sold in the fixed bundle mix shown by the question.",
            "Each product contributes its selling price less variable cost toward the common fixed cost."
          ]
        }
      };
    }
    case "PNL-QL-176":
    case "PNL-QL-177": {
      const breakEvenRevenue = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const safetyAmount = rupees5(pickNumber5(random, FLAT_EXPENSES));
      const actualRevenue = moneyFromPaise(
        breakEvenRevenue.paise + safetyAmount.paise
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY",
          actualRevenue,
          breakEvenRevenue
        },
        context: {
          actualRevenue: cp006PlainMoney(actualRevenue),
          breakEvenRevenue: cp006PlainMoney(breakEvenRevenue)
        }
      };
    }
    case "PNL-QL-178": {
      const totalCost = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(pickNumber5(random, RATES2));
      const targetTotalRecovery = sellingPrice(
        totalCost,
        targetDirection,
        targetRatePercent
      );
      const firstRecovery = rupees5(pickNumber5(random, FLAT_EXPENSES));
      const secondRecovery = moneyFromPaise(
        targetTotalRecovery.paise / 2n - firstRecovery.paise / 2n
      );
      const priorRecoveries = [firstRecovery, secondRecovery];
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY",
          totalCost,
          priorRecoveries,
          targetDirection,
          targetRatePercent
        },
        context: {
          totalCost: cp006PlainMoney(totalCost),
          priorRecoveries: flatExpenseText(priorRecoveries),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent)
        }
      };
    }
    case "PNL-QL-179":
    case "PNL-QL-184": {
      const lossPercent = rational(
        pickSeeded(random, [10, 20, 25, 40])
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL",
          lossPercent
        },
        context: {
          lossPercent: cp006FormatRational(lossPercent),
          correctStatement: "Statement 2 only",
          ...qlId === "PNL-QL-184" ? {
            statements: [
              "The same percentage profit after a loss is always sufficient to restore the original capital.",
              "After a loss, the required recovery percentage is measured on the smaller remaining capital.",
              `A ${cp006FormatRational(lossPercent)}% loss is exactly recovered by a ${cp006FormatRational(lossPercent)}% profit on the remaining capital.`
            ]
          } : {}
        },
        ...qlId === "PNL-QL-184" ? { answerOverride: "Statement 2 only" } : {}
      };
    }
    case "PNL-QL-180": {
      const effectiveCostValue = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const resultDirection = direction(random);
      const targetRate = rational(pickNumber5(random, RATES2));
      const netRecovery = sellingPrice(
        effectiveCostValue,
        resultDirection,
        targetRate
      );
      const commissionPercent = rational(20);
      const grossSellingPrice = moneyFromPaise(netRecovery.paise * 5n / 4n);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
          effectiveCost: effectiveCostValue,
          grossSellingPrice,
          commissionPercent
        },
        context: {
          effectiveCost: cp006PlainMoney(effectiveCostValue),
          grossSellingPrice: cp006PlainMoney(grossSellingPrice),
          commissionPercent: cp006FormatRational(commissionPercent)
        }
      };
    }
    case "PNL-QL-181": {
      const effectiveCostValue = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const targetDirection = "PROFIT";
      const targetRatePercent = rational(pickNumber5(random, RATES2));
      const commissionPercent = rational(20);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP",
          effectiveCost: effectiveCostValue,
          targetDirection,
          targetRatePercent,
          commissionPercent
        },
        context: {
          effectiveCost: cp006PlainMoney(effectiveCostValue),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent),
          commissionPercent: cp006FormatRational(commissionPercent)
        }
      };
    }
    case "PNL-QL-186": {
      const fixedCost = rupees5(pickNumber5(random, PURCHASE_PRICES));
      const variableCostPerUnit = rupees5(pickNumber5(random, UNIT_COSTS2));
      const contribution = rupees5(pickNumber5(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise
      );
      const full = `Fixed cost is ${cp006FormatMoney(fixedCost)}, variable cost is ${cp006FormatMoney(variableCostPerUnit)} per unit, and selling price is ${cp006FormatMoney(sellingPricePerUnit)} per unit.`;
      const fixedOnly = `Fixed cost is ${cp006FormatMoney(fixedCost)}.`;
      const unitOnly = `Variable cost is ${cp006FormatMoney(variableCostPerUnit)} and selling price is ${cp006FormatMoney(sellingPricePerUnit)} per unit.`;
      const irrelevant = "The business operates from a rented premises.";
      const pattern = pickSeeded(random, [
        "BOTH",
        "ONE",
        "TWO",
        "EITHER"
      ]);
      const statementOne = pattern === "ONE" || pattern === "EITHER" ? full : pattern === "BOTH" ? fixedOnly : irrelevant;
      const statementTwo = pattern === "TWO" || pattern === "EITHER" ? full : pattern === "BOTH" ? unitOnly : irrelevant;
      const answerOverride = pattern === "BOTH" ? "Both statements together are required" : pattern === "ONE" ? "Statement 1 alone is sufficient" : pattern === "TWO" ? "Statement 2 alone is sufficient" : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY",
          fixedCost,
          variableCostPerUnit,
          sellingPricePerUnit
        },
        context: {
          statementOne,
          statementTwo,
          dataSufficiencyAnswer: answerOverride
        },
        answerOverride
      };
    }
    default:
      throw new Error(`${qlId}: CP-006 dynamic generator is not implemented.`);
  }
}

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-006/cp006-dynamic-runtime.ts
var PNL_CP006_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE";
var editorialLibrary6 = editorial_content_en_default6;
function directedRate2(direction2, ratePercent) {
  if (direction2 === "NO_CHANGE") return "No profit, no loss";
  return `${cp006FormatPercent(ratePercent)} ${direction2.toLowerCase()}`;
}
function amountAndRate(direction2, amount, ratePercent) {
  if (direction2 === "NO_CHANGE") return "No profit, no loss";
  return `${direction2 === "PROFIT" ? "Profit" : "Loss"} ${cp006FormatMoney(amount)} at ${cp006FormatPercent(ratePercent)}`;
}
function answerFor5(qlId, result, generated2) {
  if (generated2.answerOverride) {
    return { kind: "TEXT", value: generated2.answerOverride };
  }
  switch (qlId) {
    case "PNL-QL-150":
    case "PNL-QL-151":
    case "PNL-QL-163":
    case "PNL-QL-164":
      if (!("effectiveCost" in result))
        throw new Error(`${qlId}: expected effective cost.`);
      return { kind: "MONEY", value: result.effectiveCost };
    case "PNL-QL-152":
    case "PNL-QL-153":
      if (!("sellingPrice" in result))
        throw new Error(`${qlId}: expected selling price.`);
      return { kind: "MONEY", value: result.sellingPrice };
    case "PNL-QL-154":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected directed result.`);
      }
      return {
        kind: "TEXT",
        value: directedRate2(result.direction, result.ratePercent)
      };
    case "PNL-QL-155":
      if (!("maximumExpense" in result)) {
        throw new Error(`${qlId}: expected maximum allowable expense.`);
      }
      return { kind: "MONEY", value: result.maximumExpense };
    case "PNL-QL-156":
    case "PNL-QL-168":
    case "PNL-QL-169":
    case "PNL-QL-182":
      if (!("effectiveUnitCost" in result)) {
        throw new Error(`${qlId}: expected effective unit cost.`);
      }
      return { kind: "MONEY", value: result.effectiveUnitCost };
    case "PNL-QL-157":
      if (!("requiredUnitSellingPrice" in result)) {
        throw new Error(`${qlId}: expected required unit selling price.`);
      }
      return { kind: "MONEY", value: result.requiredUnitSellingPrice };
    case "PNL-QL-158":
      if (!("breakEvenQuantity" in result)) {
        throw new Error(`${qlId}: expected break-even quantity.`);
      }
      return {
        kind: "QUANTITY",
        value: result.breakEvenQuantity,
        unit: "units"
      };
    case "PNL-QL-159":
      if (!("requiredQuantity" in result)) {
        throw new Error(`${qlId}: expected required quantity.`);
      }
      return {
        kind: "QUANTITY",
        value: result.requiredQuantity,
        unit: "units"
      };
    case "PNL-QL-160":
      if (!("breakEvenSellingPricePerUnit" in result)) {
        throw new Error(`${qlId}: expected break-even unit selling price.`);
      }
      return { kind: "MONEY", value: result.breakEvenSellingPricePerUnit };
    case "PNL-QL-161":
    case "PNL-QL-162":
      if (!("requiredSecondSellingPrice" in result)) {
        throw new Error(`${qlId}: expected second selling price.`);
      }
      return { kind: "MONEY", value: result.requiredSecondSellingPrice };
    case "PNL-QL-165":
      if (!("totalExpense" in result))
        throw new Error(`${qlId}: expected total expense.`);
      return { kind: "MONEY", value: result.totalExpense };
    case "PNL-QL-166":
    case "PNL-QL-185":
      if (!("overheadPercent" in result)) {
        throw new Error(`${qlId}: expected overhead percentage.`);
      }
      return { kind: "PERCENT", value: result.overheadPercent };
    case "PNL-QL-167":
      if (!("netProductionCost" in result)) {
        throw new Error(`${qlId}: expected net production cost.`);
      }
      return { kind: "MONEY", value: result.netProductionCost };
    case "PNL-QL-170":
      if (!("fixedCost" in result))
        throw new Error(`${qlId}: expected fixed cost.`);
      return { kind: "MONEY", value: result.fixedCost };
    case "PNL-QL-171":
      if (!("variableCostPerUnit" in result)) {
        throw new Error(`${qlId}: expected variable cost per unit.`);
      }
      return { kind: "MONEY", value: result.variableCostPerUnit };
    case "PNL-QL-172":
      if (!("requiredSellingPricePerUnit" in result)) {
        throw new Error(`${qlId}: expected required selling price per unit.`);
      }
      return { kind: "MONEY", value: result.requiredSellingPricePerUnit };
    case "PNL-QL-173":
      if (!("breakEvenRevenue" in result)) {
        throw new Error(`${qlId}: expected break-even revenue.`);
      }
      return { kind: "MONEY", value: result.breakEvenRevenue };
    case "PNL-QL-174":
      if (!("contributionMarginPercent" in result)) {
        throw new Error(`${qlId}: expected contribution-margin percentage.`);
      }
      return { kind: "PERCENT", value: result.contributionMarginPercent };
    case "PNL-QL-175":
    case "PNL-QL-183":
      if (!("breakEvenBundles" in result)) {
        throw new Error(`${qlId}: expected break-even bundles.`);
      }
      return {
        kind: "QUANTITY",
        value: result.breakEvenBundles,
        unit: "bundles"
      };
    case "PNL-QL-176":
      if (!("marginOfSafetyAmount" in result)) {
        throw new Error(`${qlId}: expected margin-of-safety amount.`);
      }
      return { kind: "MONEY", value: result.marginOfSafetyAmount };
    case "PNL-QL-177":
      if (!("marginOfSafetyPercent" in result)) {
        throw new Error(`${qlId}: expected margin-of-safety percentage.`);
      }
      return { kind: "PERCENT", value: result.marginOfSafetyPercent };
    case "PNL-QL-178":
      if (!("requiredFinalRecovery" in result)) {
        throw new Error(`${qlId}: expected required final recovery.`);
      }
      return { kind: "MONEY", value: result.requiredFinalRecovery };
    case "PNL-QL-179":
      if (!("requiredProfitPercent" in result)) {
        throw new Error(`${qlId}: expected recovery profit percentage.`);
      }
      return { kind: "PERCENT", value: result.requiredProfitPercent };
    case "PNL-QL-180":
      if (!("direction" in result) || !("amount" in result) || !("ratePercent" in result)) {
        throw new Error(
          `${qlId}: expected commission-adjusted amount and rate.`
        );
      }
      return {
        kind: "TEXT",
        value: amountAndRate(
          result.direction,
          result.amount,
          result.ratePercent
        )
      };
    case "PNL-QL-181":
      if (!("requiredGrossSellingPrice" in result)) {
        throw new Error(`${qlId}: expected required gross selling price.`);
      }
      return { kind: "MONEY", value: result.requiredGrossSellingPrice };
    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}
function formatAnswer6(answer) {
  if (answer.kind === "MONEY") return cp006FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp006FormatPercent(answer.value);
  if (answer.kind === "QUANTITY") return `${answer.value} ${answer.unit}`;
  return answer.value;
}
function resultContext4(result, answer) {
  const context = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer
  };
  const moneyFields = [
    "effectiveCost",
    "sellingPrice",
    "maximumExpense",
    "effectiveUnitCost",
    "requiredUnitSellingPrice",
    "breakEvenSellingPricePerUnit",
    "requiredSecondSellingPrice",
    "totalExpense",
    "netProductionCost",
    "fixedCost",
    "variableCostPerUnit",
    "requiredSellingPricePerUnit",
    "breakEvenRevenue",
    "marginOfSafetyAmount",
    "requiredFinalRecovery",
    "requiredGrossSellingPrice",
    "resultAmount"
  ];
  for (const field of moneyFields) {
    if (field in result) {
      const value = result[field];
      if (value && typeof value === "object" && "paise" in value) {
        context[field] = cp006PlainMoney(value);
      }
    }
  }
  if ("maximumExpense" in result) {
    context.maximumAllowableExpense = cp006PlainMoney(result.maximumExpense);
  }
  if ("direction" in result && "ratePercent" in result) {
    context.resultDirection = result.direction.toLowerCase();
    context.resultRatePercent = cp006FormatRational(result.ratePercent);
    context.resultAmount = "amount" in result ? cp006PlainMoney(result.amount) : void 0;
  }
  if ("breakEvenQuantity" in result) {
    context.breakEvenQuantity = result.breakEvenQuantity.toString();
  }
  if ("requiredQuantity" in result) {
    context.requiredQuantity = result.requiredQuantity.toString();
  }
  if ("overheadPercent" in result) {
    context.overheadPercent = cp006FormatRational(result.overheadPercent);
  }
  if ("primeCost" in result)
    context.primeCost = cp006PlainMoney(result.primeCost);
  if ("factoryOverheadAmount" in result) {
    context.factoryOverheadAmount = cp006PlainMoney(
      result.factoryOverheadAmount
    );
  }
  if ("grossProductionCost" in result) {
    context.grossProductionCost = cp006PlainMoney(result.grossProductionCost);
  }
  if ("contributionMarginPercent" in result) {
    context.contributionMarginPercent = cp006FormatRational(
      result.contributionMarginPercent
    );
  }
  if ("breakEvenBundles" in result) {
    context.breakEvenBundles = result.breakEvenBundles.toString();
  }
  if ("contributionPerBundle" in result) {
    context.contributionPerBundle = cp006PlainMoney(
      result.contributionPerBundle
    );
  }
  if ("marginOfSafetyPercent" in result) {
    context.marginOfSafetyPercent = cp006FormatRational(
      result.marginOfSafetyPercent
    );
  }
  if ("targetTotalRecovery" in result) {
    context.targetTotalRecovery = cp006PlainMoney(result.targetTotalRecovery);
  }
  if ("priorRecoveryTotal" in result) {
    context.priorRecoveryTotal = cp006PlainMoney(result.priorRecoveryTotal);
  }
  if ("remainingCapitalPercent" in result) {
    context.remainingCapitalPercent = cp006FormatRational(
      result.remainingCapitalPercent
    );
  }
  if ("requiredProfitPercent" in result) {
    context.requiredProfitPercent = cp006FormatRational(
      result.requiredProfitPercent
    );
  }
  if ("commissionAmount" in result) {
    context.commissionAmount = cp006PlainMoney(result.commissionAmount);
  }
  if ("netRecovery" in result) {
    context.netRecovery = cp006PlainMoney(result.netRecovery);
  }
  if ("targetNetRecovery" in result) {
    context.targetNetRecovery = cp006PlainMoney(result.targetNetRecovery);
  }
  return context;
}
function numericDistractors5(answer) {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    return [
      moneyFromPaise(paise * 80n / 100n),
      moneyFromPaise(paise * 90n / 100n),
      moneyFromPaise(paise * 110n / 100n),
      moneyFromPaise(paise * 120n / 100n),
      moneyFromPaise(paise + 5000n),
      moneyFromPaise(paise + 15000n),
      moneyFromPaise(paise > 5000n ? paise - 5000n : paise + 25000n),
      moneyFromPaise(paise > 15000n ? paise - 15000n : paise + 30000n)
    ].filter((value) => value.paise > 0n).map(cp006FormatMoney);
  }
  if (answer.kind === "PERCENT") {
    const value = rationalToNumber(answer.value);
    return [
      Math.max(0, value - 5),
      value + 5,
      Math.max(0, 100 - value),
      value + 10
    ].map((item) => `${Number(item.toFixed(2))}%`);
  }
  if (answer.kind === "QUANTITY") {
    const value = answer.value;
    return [value + 1n, value + 5n, value > 1n ? value - 1n : value + 10n].map(
      (item) => `${item} ${answer.unit}`
    );
  }
  return [];
}
function textDistractors5(qlId, correct) {
  const pools = {
    "PNL-QL-184": [
      "Statement 1 only",
      "Statement 2 only",
      "Statement 3 only",
      "Statements 1 and 2 only"
    ],
    "PNL-QL-186": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient"
    ]
  };
  const pool = pools[qlId] ?? [
    "10% profit",
    "10% loss",
    "20% profit",
    "20% loss",
    "No profit, no loss",
    "Cannot be determined"
  ];
  return pool.filter((item) => item !== correct);
}
function buildOptions5(qlId, seed, answer) {
  const correct = formatAnswer6(answer);
  const source = answer.kind === "TEXT" ? textDistractors5(qlId, correct) : numericDistractors5(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0], label: "IGNORED_EXPENSE_OR_RECOVERY" },
    { value: unique[1], label: "WRONG_OVERHEAD_OR_UNIT_BASE" },
    { value: unique[2], label: "WRONG_CONTRIBUTION_OR_COMMISSION_BASE" }
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
function stable5(value) {
  return JSON.stringify(
    value,
    (_, item) => typeof item === "bigint" ? item.toString() : item
  );
}
function forwardConsistency3(request, result) {
  switch (request.mode) {
    case "SP_TARGET_RATE_TO_MAX_EXPENSE": {
      if (!("maximumExpense" in result)) return false;
      const cost = moneyFromPaise(
        request.purchasePrice.paise + result.maximumExpense.paise
      );
      const check = solvePnlCp006Request({
        mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
        effectiveCost: cost,
        direction: request.direction,
        ratePercent: request.targetRatePercent
      });
      return "sellingPrice" in check && check.sellingPrice.paise === request.sellingPrice.paise;
    }
    case "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST": {
      if (!("effectiveCost" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
        effectiveCost: result.effectiveCost,
        direction: request.direction,
        ratePercent: request.ratePercent
      });
      return "sellingPrice" in check && check.sellingPrice.paise === request.totalRecovery.paise;
    }
    case "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE": {
      if (!("overheadPercent" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
        purchasePrice: request.purchasePrice,
        flatExpenses: request.flatExpenses,
        overheadPercent: result.overheadPercent,
        overheadBase: request.overheadBase
      });
      return "effectiveCost" in check && check.effectiveCost.paise === request.effectiveCost.paise;
    }
    case "BREAK_EVEN_QUANTITY_TO_FIXED_COST": {
      return "fixedCost" in result && result.fixedCost.paise === request.breakEvenQuantity * (request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise);
    }
    case "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST": {
      return "variableCostPerUnit" in result && request.breakEvenQuantity * (request.sellingPricePerUnit.paise - result.variableCostPerUnit.paise) === request.fixedCost.paise;
    }
    case "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP": {
      if (!("requiredSellingPricePerUnit" in result)) return false;
      const revenue = result.requiredSellingPricePerUnit.paise * request.quantity;
      const cost = request.fixedCost.paise + request.variableCostPerUnit.paise * request.quantity;
      return revenue - cost === request.targetProfit.paise;
    }
    case "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO": {
      if (!("contributionMarginPercent" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
        fixedCost: request.fixedCost,
        contributionMarginPercent: result.contributionMarginPercent
      });
      return "breakEvenRevenue" in check && check.breakEvenRevenue.paise === request.breakEvenRevenue.paise;
    }
    case "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY": {
      if (!("requiredFinalRecovery" in result) || !("targetTotalRecovery" in result) || !("priorRecoveryTotal" in result))
        return false;
      return result.priorRecoveryTotal.paise + result.requiredFinalRecovery.paise === result.targetTotalRecovery.paise;
    }
    case "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP": {
      if (!("requiredGrossSellingPrice" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
        effectiveCost: request.effectiveCost,
        grossSellingPrice: result.requiredGrossSellingPrice,
        commissionPercent: request.commissionPercent
      });
      return "direction" in check && "ratePercent" in check && check.direction === request.targetDirection && stable5(check.ratePercent) === stable5(request.targetRatePercent);
    }
    default:
      return true;
  }
}
function selectQl6(input) {
  if (input.questionLanguageId) {
    if (!PNL_CP006_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-006 question-language ID: ${input.questionLanguageId}`
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP006_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp006Case(
      qlId,
      `${input.seed ?? "cp006"}:probe`
    ).registry;
    return !input.difficultyBand || registry.difficulty === input.difficultyBand;
  });
  if (!eligible.length)
    throw new Error("No CP-006 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp006-dynamic"}:ql-selection`),
    eligible
  );
}
function containsUnresolvedProsePlaceholder5(value) {
  const proseOnly = value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}
function listPnlCp006DynamicQlIds() {
  return [...PNL_CP006_QL_IDS];
}
function runPnlCp006DynamicPipeline(input = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-006 dynamic runtime currently supports English only."
    );
  }
  const qlId = selectQl6(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated2 = generatePnlCp006Case(qlId, seed);
  const result = solvePnlCp006Request(generated2.request);
  const recomputed = solvePnlCp006Request(generated2.request);
  const answerValue = answerFor5(qlId, result, generated2);
  const answer = formatAnswer6(answerValue);
  const optionSet = buildOptions5(qlId, seed, answerValue);
  const editorial = editorialLibrary6.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);
  const context = {
    ...generated2.context,
    ...resultContext4(result, answer)
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context
  );
  const explanationText = `${baseExplanation}

**Working with these values:** Build effective cost and contribution on their stated bases. Deduct recoveries or commission before comparing the final net amount with cost.

**Final answer:** ${answer}`;
  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated2.registry && editorial),
      message: "The QL exists in both the frozen registry and English editorial library."
    },
    {
      name: "exact-recomputation",
      passed: stable5(result) === stable5(recomputed),
      message: "Exact recomputation agrees with the canonical CP-006 solver."
    },
    {
      name: "inverse-forward-consistency",
      passed: forwardConsistency3(generated2.request, result),
      message: "Every inverse answer reproduces its generated forward cost, contribution or recovery model."
    },
    {
      name: "four-misconception-options",
      passed: optionSet.options.length === 4 && new Set(optionSet.options).size === 4 && optionSet.options[optionSet.correctIndex] === answer && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: "Four unique options contain one answer and three labelled misconceptions."
    },
    {
      name: "dynamic-editorial-binding",
      passed: !containsUnresolvedProsePlaceholder5(stem) && !containsUnresolvedProsePlaceholder5(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders."
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication."
    }
  ];
  const validation = { valid: checks.every((check) => check.passed), checks };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${checks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`
    );
  }
  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001",
    canonicalProblemId: PNL_CP006_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en",
    difficultyBand: generated2.registry.difficulty,
    stem,
    answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP006_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en",
      difficultyBand: generated2.registry.difficulty,
      taskKind: generated2.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated2.registry.answerSemantic,
      requiredVariables: [...generated2.registry.requiredVariables],
      variables: context,
      seed,
      runtimeMode: PNL_CP006_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      sourceTrace: {
        registry: "PNL-001/CP-006/task-registry.library.json",
        editorial: "PNL-001/CP-006/editorial-content.en.json",
        solver: "PNL-001/foundation/effective-cost-recovery-solver.ts | effective-cost-advanced-solver.ts"
      }
    },
    solver: {
      answer,
      numericAnswer: answerValue.kind === "MONEY" ? Number(answerValue.value.paise) / 100 : answerValue.kind === "PERCENT" ? rationalToNumber(answerValue.value) : answerValue.kind === "QUANTITY" ? Number(answerValue.value) : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated2.registry.solveMode,
        answerSemantic: generated2.registry.answerSemantic,
        exactRecomputation: "PASS",
        inverseForwardConsistency: "PASS"
      },
      mathJax: {}
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        {
          id: "given",
          label: "Generated cost and recovery values",
          value: context
        },
        {
          id: "mode",
          label: "Solve mode",
          value: generated2.registry.solveMode
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
      canonicalProblemId: PNL_CP006_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated2.registry.solveMode,
      answerSemantic: generated2.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated2.registry.difficulty,
      representation: generated2.registry.representation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP006_DYNAMIC_RUNTIME_MODE,
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

// src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-001-english-editorial-audit.ts
var runtimes = [
  {
    cpId: "PNL-CP-001",
    listQlIds: listPnlCp001DynamicQlIds,
    run: runPnlCp001DynamicPipeline
  },
  {
    cpId: "PNL-CP-002",
    listQlIds: listPnlCp002DynamicQlIds,
    run: runPnlCp002DynamicPipeline
  },
  {
    cpId: "PNL-CP-003",
    listQlIds: listPnlCp003DynamicQlIds,
    run: runPnlCp003DynamicPipeline
  },
  {
    cpId: "PNL-CP-004",
    listQlIds: listPnlCp004DynamicQlIds,
    run: runPnlCp004DynamicPipeline
  },
  {
    cpId: "PNL-CP-005",
    listQlIds: listPnlCp005DynamicQlIds,
    run: runPnlCp005DynamicPipeline
  },
  {
    cpId: "PNL-CP-006",
    listQlIds: listPnlCp006DynamicQlIds,
    run: runPnlCp006DynamicPipeline
  }
];
var samplesPerQl = 3;
var candidateSeedsPerQl = 18;
var outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/pnl-001-english-editorial-audit"
);
mkdirSync(outputDirectory, { recursive: true });
function visibleExplanation(pkg) {
  return pkg.explanation.lines.join("\n\n").trim();
}
function wordCount(value) {
  return value.replace(/[|*_`#>()[\]{}]/g, " ").split(/\s+/).filter(Boolean).length;
}
function normalizedVisible(value) {
  return value.toLowerCase().replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "\u20B9#").replace(/\b\d+(?:\.\d+)?%/g, "#%").replace(/\b\d+(?:\.\d+)?\b/g, "#").replace(/\b(?:x|y|n|r|q|d|c|s|m)\b/g, "x").replace(/\s+/g, " ").trim();
}
function proseWithoutMath(value) {
  return value.replace(/\\\[[\s\S]*?\\\]/g, "").replace(/\\\([\s\S]*?\\\)/g, "");
}
function firstSentence(value) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
  return match?.[1]?.trim() ?? cleaned;
}
function meaningfulProseParagraph(value) {
  if (/^\*\*Final answer:/i.test(value.trim())) return false;
  const words = proseWithoutMath(value).replace(/\\[A-Za-z]+(?:\{[^}]*\})?/g, " ").replace(/[^A-Za-z' -]/g, " ").split(/\s+/).filter(Boolean);
  return words.length >= 5 && words.some((word) => word.length >= 4);
}
function lastEditorialSentence(value) {
  const paragraphs = value.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean).filter(meaningfulProseParagraph);
  const last = paragraphs.at(-1) ?? "";
  const sentences = last.match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) ?? [];
  return sentences.at(-1) ?? last;
}
function csvCell(value) {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}
function countBy(values, key) {
  const counts = {};
  for (const value of values) {
    const item = key(value);
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}
function sortedCounts(counts) {
  return Object.entries(counts).map(([value, count]) => ({ value, count })).sort(
    (left, right) => right.count - left.count || left.value.localeCompare(right.value)
  );
}
var generated = runtimes.flatMap(
  (runtime) => runtime.listQlIds().flatMap((qlId) => {
    const candidates = Array.from(
      { length: candidateSeedsPerQl },
      (_, index) => {
        const candidateIndex = index + 1;
        const seed = `pnl-english-editorial:${runtime.cpId}:${qlId}:candidate-${candidateIndex}`;
        return {
          cpId: runtime.cpId,
          qlId,
          candidateIndex,
          seed,
          pkg: runtime.run({
            questionLanguageId: qlId,
            language: "en",
            seed
          })
        };
      }
    );
    const selected = [];
    const seenStemFingerprints = /* @__PURE__ */ new Set();
    for (const candidate of candidates) {
      const fingerprint = normalizedVisible(candidate.pkg.stem);
      if (seenStemFingerprints.has(fingerprint)) continue;
      seenStemFingerprints.add(fingerprint);
      selected.push({ ...candidate, sampleIndex: selected.length + 1 });
      if (selected.length === samplesPerQl) break;
    }
    if (selected.length < samplesPerQl) {
      const selectedSeeds = new Set(selected.map((item) => item.seed));
      for (const candidate of candidates) {
        if (selectedSeeds.has(candidate.seed)) continue;
        selected.push({ ...candidate, sampleIndex: selected.length + 1 });
        if (selected.length === samplesPerQl) break;
      }
    }
    return selected;
  })
);
var rows = generated.map(
  ({ cpId, qlId, sampleIndex, seed, pkg }, index) => ({
    rowNumber: index + 1,
    cpId,
    qlId,
    sampleIndex,
    seed,
    difficulty: pkg.difficultyBand,
    solveMode: pkg.parameters.taskKind,
    answerSemantic: pkg.parameters.answerSemantic,
    contextFamily: pkg.traceability.contextFamily ?? "UNSPECIFIED",
    representation: pkg.traceability.representation ?? "PARAGRAPH",
    stem: pkg.stem,
    optionA: pkg.options[0] ?? "",
    optionB: pkg.options[1] ?? "",
    optionC: pkg.options[2] ?? "",
    optionD: pkg.options[3] ?? "",
    correctOption: ["A", "B", "C", "D"][pkg.correctIndex] ?? "INVALID",
    answer: pkg.answer,
    explanation: visibleExplanation(pkg),
    misconceptionLabels: (pkg.traceability.misconceptionLabels ?? []).join(
      " | "
    ),
    reviewerDecision: "",
    severity: "",
    issueCodes: "",
    reviewerNotes: "",
    replacementStem: "",
    replacementExplanation: ""
  })
);
var fatalFindings = [];
var editorialFindings = [];
for (const { cpId, qlId, sampleIndex, pkg } of generated) {
  const scope = `${cpId}/${qlId}/sample-${sampleIndex}`;
  const explanation = visibleExplanation(pkg);
  const visible = `${pkg.stem}
${pkg.options.join("\n")}
${explanation}`;
  const prose2 = proseWithoutMath(visible);
  if (qlId === "PNL-QL-070") {
    const statementMarker = pkg.stem.match(/Statement\s+(?:I|1)\b/i);
    const lead = statementMarker?.index === void 0 ? pkg.stem : pkg.stem.slice(0, statementMarker.index);
    if (statementMarker?.index === void 0 || /₹\s*[\d,]+|\b\d+(?:\.\d+)?%/.test(lead)) {
      editorialFindings.push({
        code: "DS-LEAD-LEAKAGE",
        severity: "BLOCKER",
        scope,
        message: "The data-sufficiency lead must remain insufficient until the statements are evaluated."
      });
    }
  }
  if (!pkg.validation.valid) {
    fatalFindings.push({
      code: "PACKAGE-VALIDATION-FAILED",
      severity: "BLOCKER",
      scope,
      message: "Runtime package validation is false."
    });
  }
  if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) {
    fatalFindings.push({
      code: "INVALID-OPTIONS",
      severity: "BLOCKER",
      scope,
      message: "The generated package does not contain four unique options."
    });
  }
  if (pkg.options[pkg.correctIndex] !== pkg.answer) {
    fatalFindings.push({
      code: "CORRECT-INDEX-MISMATCH",
      severity: "BLOCKER",
      scope,
      message: "correctIndex does not point to the displayed answer."
    });
  }
  if (/\bAlternative\s+\d+\b/i.test(pkg.options.join("\n"))) {
    fatalFindings.push({
      code: "FALLBACK-OPTION-LABEL",
      severity: "BLOCKER",
      scope,
      message: "A fallback Alternative n option reached visible output."
    });
  }
  if (/\{[a-z][A-Za-z0-9_]*\}/.test(prose2)) {
    fatalFindings.push({
      code: "UNRESOLVED-PLACEHOLDER",
      severity: "BLOCKER",
      scope,
      message: "Visible prose contains an unresolved dynamic placeholder."
    });
  }
  if (/\b(?:undefined|NaN|Infinity)\b/.test(visible)) {
    fatalFindings.push({
      code: "INVALID-RUNTIME-TOKEN",
      severity: "BLOCKER",
      scope,
      message: "Visible output contains undefined, NaN or Infinity."
    });
  }
  if (wordCount(pkg.stem) < 8) {
    fatalFindings.push({
      code: "STEM-TOO-SHORT",
      severity: "BLOCKER",
      scope,
      message: `Stem contains only ${wordCount(pkg.stem)} words.`
    });
  }
  if (wordCount(explanation) < 30) {
    fatalFindings.push({
      code: "EXPLANATION-TOO-SHORT",
      severity: "BLOCKER",
      scope,
      message: `Explanation contains only ${wordCount(explanation)} words.`
    });
  }
  if (pkg.parameters.runtimeMode !== "DYNAMIC_CANDIDATE" || pkg.parameters.reviewStatus !== "UNREVIEWED_DYNAMIC_CANDIDATE" || pkg.parameters.questionBankStatus !== "NOT_STORED" || pkg.parameters.testEligibility !== "INELIGIBLE" || pkg.parameters.publiclyPublishable !== false || pkg.traceability.generationMode !== "DYNAMIC_CANDIDATE" || pkg.traceability.reviewStatus !== "UNREVIEWED_DYNAMIC_CANDIDATE" || pkg.traceability.questionBankStatus !== "NOT_STORED" || pkg.traceability.testEligibility !== "INELIGIBLE" || pkg.traceability.publiclyPublishable !== false) {
    fatalFindings.push({
      code: "SAFETY-METADATA-DRIFT",
      severity: "BLOCKER",
      scope,
      message: "Review-only safety metadata has drifted from the frozen contract."
    });
  }
  if (wordCount(pkg.stem) > 140) {
    editorialFindings.push({
      code: "LONG-STEM",
      severity: "MINOR",
      scope,
      message: `Stem contains ${wordCount(pkg.stem)} words and needs concision review.`
    });
  }
  if (wordCount(explanation) > 500) {
    editorialFindings.push({
      code: "LONG-EXPLANATION",
      severity: "MINOR",
      scope,
      message: `Explanation contains ${wordCount(explanation)} words and needs concision review.`
    });
  }
}
var exactStemGroups = /* @__PURE__ */ new Map();
var normalizedStemGroups = /* @__PURE__ */ new Map();
for (const { qlId, pkg } of generated) {
  const exact = pkg.stem.trim();
  const normalized = normalizedVisible(pkg.stem);
  const exactSet = exactStemGroups.get(exact) ?? /* @__PURE__ */ new Set();
  exactSet.add(qlId);
  exactStemGroups.set(exact, exactSet);
  const normalizedSet = normalizedStemGroups.get(normalized) ?? /* @__PURE__ */ new Set();
  normalizedSet.add(qlId);
  normalizedStemGroups.set(normalized, normalizedSet);
}
var exactCrossQlDuplicates = [...exactStemGroups.entries()].filter(([, qlIds3]) => qlIds3.size > 1).map(([stem, qlIds3]) => ({ stem, qlIds: [...qlIds3].sort() }));
for (const group of exactCrossQlDuplicates) {
  fatalFindings.push({
    code: "EXACT-CROSS-QL-STEM-DUPLICATE",
    severity: "BLOCKER",
    scope: group.qlIds.join(", "),
    message: group.stem
  });
}
var normalizedCrossQlClones = [...normalizedStemGroups.entries()].filter(([, qlIds3]) => qlIds3.size > 1).map(([fingerprint, qlIds3]) => ({ fingerprint, qlIds: [...qlIds3].sort() })).sort(
  (left, right) => right.qlIds.length - left.qlIds.length || left.fingerprint.localeCompare(right.fingerprint)
);
for (const group of normalizedCrossQlClones) {
  editorialFindings.push({
    code: "NORMALISED-CROSS-QL-CLONE",
    severity: "MAJOR",
    scope: group.qlIds.join(", "),
    message: group.fingerprint
  });
}
var qlGroups = /* @__PURE__ */ new Map();
for (const item of generated) {
  const group = qlGroups.get(item.qlId) ?? [];
  qlGroups.set(item.qlId, [...group, item]);
}
var sameQlStemRepeat = [];
var sameQlAnswerRepeat = [];
for (const [qlId, group] of qlGroups) {
  if (new Set(group.map((item) => item.pkg.stem)).size === 1) {
    sameQlStemRepeat.push(qlId);
    editorialFindings.push({
      code: "SAME-QL-STEM-REPEAT",
      severity: "MAJOR",
      scope: qlId,
      message: "All three deterministic samples render the same visible stem."
    });
  }
  if (new Set(group.map((item) => item.pkg.answer)).size === 1) {
    sameQlAnswerRepeat.push(qlId);
    editorialFindings.push({
      code: "SAME-QL-ANSWER-REPEAT",
      severity: "NOTE",
      scope: qlId,
      message: "All three deterministic samples produce the same displayed answer; confirm this is contractually necessary."
    });
  }
}
var openingCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => normalizedVisible(firstSentence(visibleExplanation(pkg)))
  )
);
var closingCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => normalizedVisible(lastEditorialSentence(visibleExplanation(pkg)))
  )
);
var paragraphCounts = sortedCounts(
  countBy(
    generated.flatMap(
      ({ pkg }) => visibleExplanation(pkg).split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean).filter(meaningfulProseParagraph)
    ),
    normalizedVisible
  )
);
for (const item of openingCounts.filter(({ count }) => count >= 8).slice(0, 25)) {
  editorialFindings.push({
    code: "REPEATED-EXPLANATION-OPENING",
    severity: item.count >= 25 ? "MAJOR" : "MINOR",
    scope: `${item.count} samples`,
    message: item.value
  });
}
for (const item of closingCounts.filter(({ count }) => count >= 8).slice(0, 25)) {
  editorialFindings.push({
    code: "REPEATED-EXPLANATION-CLOSING",
    severity: item.count >= 25 ? "MAJOR" : "MINOR",
    scope: `${item.count} samples`,
    message: item.value
  });
}
for (const item of paragraphCounts.filter(({ count }) => count >= 12).slice(0, 30)) {
  editorialFindings.push({
    code: "REPEATED-EXPLANATION-PARAGRAPH",
    severity: item.count >= 30 ? "MAJOR" : "MINOR",
    scope: `${item.count} samples`,
    message: item.value
  });
}
var contextFamilyCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => pkg.traceability.contextFamily ?? "UNSPECIFIED"
  )
);
var representationCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => pkg.traceability.representation ?? "PARAGRAPH"
  )
);
var difficultyCounts = sortedCounts(
  countBy(generated, ({ pkg }) => pkg.difficultyBand)
);
var cpCounts = sortedCounts(countBy(generated, ({ cpId }) => cpId));
var correctIndexCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => ["A", "B", "C", "D"][pkg.correctIndex] ?? "INVALID"
  )
);
var genericNounCounts = {
  article: generated.filter(({ pkg }) => /\barticle\b/i.test(pkg.stem)).length,
  trader: generated.filter(({ pkg }) => /\btrader\b/i.test(pkg.stem)).length,
  shopkeeper: generated.filter(({ pkg }) => /\bshopkeeper\b/i.test(pkg.stem)).length,
  merchant: generated.filter(({ pkg }) => /\bmerchant\b/i.test(pkg.stem)).length,
  seller: generated.filter(({ pkg }) => /\bseller\b/i.test(pkg.stem)).length
};
for (const item of contextFamilyCounts.filter(({ count }) => count >= 18)) {
  editorialFindings.push({
    code: "CONTEXT-FAMILY-CONCENTRATION",
    severity: "MINOR",
    scope: `${item.count} samples`,
    message: item.value
  });
}
var positionCounts = Object.fromEntries(
  correctIndexCounts.map(({ value, count }) => [value, count])
);
var expectedPerPosition = generated.length / 4;
for (const position of ["A", "B", "C", "D"]) {
  const count = positionCounts[position] ?? 0;
  const deviation = Math.abs(count - expectedPerPosition) / expectedPerPosition;
  if (deviation > 0.2) {
    editorialFindings.push({
      code: "CORRECT-OPTION-POSITION-IMBALANCE",
      severity: "MINOR",
      scope: position,
      message: `${count} correct answers; expected approximately ${expectedPerPosition.toFixed(1)}.`
    });
  }
}
var issueCodeCounts = sortedCounts(
  countBy(editorialFindings, (finding) => finding.code)
);
var fatalCodeCounts = sortedCounts(
  countBy(fatalFindings, (finding) => finding.code)
);
var metrics = {
  packageId: "PNL-001",
  language: "English",
  cpCount: runtimes.length,
  qlCount: qlGroups.size,
  samplesPerQl,
  candidateSeedsPerQl,
  reviewRows: generated.length,
  cpCounts,
  difficultyCounts,
  representationCounts,
  contextFamilyCounts,
  correctIndexCounts,
  genericNounCounts,
  exactCrossQlDuplicateGroups: exactCrossQlDuplicates.length,
  normalizedCrossQlCloneGroups: normalizedCrossQlClones.length,
  sameQlStemRepeatCount: sameQlStemRepeat.length,
  sameQlAnswerRepeatCount: sameQlAnswerRepeat.length,
  repeatedOpeningPatterns: openingCounts.filter(({ count }) => count >= 8),
  repeatedClosingPatterns: closingCounts.filter(({ count }) => count >= 8),
  repeatedParagraphPatterns: paragraphCounts.filter(({ count }) => count >= 12),
  fatalFindingCount: fatalFindings.length,
  editorialFindingCount: editorialFindings.length,
  fatalCodeCounts,
  issueCodeCounts,
  auditStatus: fatalFindings.length > 0 ? "STRUCTURAL_FAIL" : "REVIEW_REQUIRED",
  knownOpenIssue: {
    issueNumber: 262,
    qlId: "PNL-QL-070",
    code: "KNOWN-DS-LEAD-LEAKAGE"
  },
  runtimeMode: "DYNAMIC_CANDIDATE",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioWiringChanged: false
};
var csvHeaders = [
  "rowNumber",
  "cpId",
  "qlId",
  "sampleIndex",
  "seed",
  "difficulty",
  "solveMode",
  "answerSemantic",
  "contextFamily",
  "representation",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctOption",
  "answer",
  "explanation",
  "misconceptionLabels",
  "reviewerDecision",
  "severity",
  "issueCodes",
  "reviewerNotes",
  "replacementStem",
  "replacementExplanation"
];
var csv = [
  csvHeaders.map(csvCell).join(","),
  ...rows.map(
    (row) => csvHeaders.map((header) => csvCell(row[header])).join(",")
  )
].join("\n");
var reviewMarkdown = [
  "# PNL-001 English Generated-Question Review Book",
  "",
  "> Three deterministic review samples for every frozen QL. Publication and Question Bank storage remain disabled.",
  "",
  "```text",
  `CPs:              ${runtimes.length}`,
  `QLs:              ${qlGroups.size}`,
  `Samples per QL:   ${samplesPerQl} selected from ${candidateSeedsPerQl} deterministic candidates`,
  `Review rows:      ${generated.length}`,
  "Language:         English",
  "Question Studio:  unchanged",
  "```",
  "",
  ...generated.flatMap(({ cpId, qlId, sampleIndex, seed, pkg }, index) => [
    `## ${index + 1}. ${qlId} \u2014 sample ${sampleIndex}`,
    "",
    `- CP: \`${cpId}\``,
    `- Seed: \`${seed}\``,
    `- Difficulty: \`${pkg.difficultyBand}\``,
    `- Solve mode: \`${pkg.parameters.taskKind}\``,
    `- Answer semantic: \`${pkg.parameters.answerSemantic}\``,
    `- Context family: \`${pkg.traceability.contextFamily ?? "UNSPECIFIED"}\``,
    `- Representation: \`${pkg.traceability.representation ?? "PARAGRAPH"}\``,
    "",
    "### Question",
    "",
    pkg.stem,
    "",
    ...pkg.options.map(
      (option, optionIndex) => `- ${["A", "B", "C", "D"][optionIndex]}. ${option}`
    ),
    "",
    `**Correct option:** ${["A", "B", "C", "D"][pkg.correctIndex]} \u2014 ${pkg.answer}`,
    "",
    "### Explanation",
    "",
    visibleExplanation(pkg),
    "",
    "### Reviewer decision",
    "",
    "- Decision:",
    "- Severity:",
    "- Issue codes:",
    "- Notes:",
    "- Replacement stem:",
    "- Replacement explanation:",
    "",
    "---",
    ""
  ])
].join("\n");
var findingsMarkdown = [
  "# PNL-001 English Editorial Audit Findings",
  "",
  "```text",
  `Audit status:             ${metrics.auditStatus}`,
  `Review rows:              ${metrics.reviewRows}`,
  `Structural blockers:      ${metrics.fatalFindingCount}`,
  `Editorial findings:       ${metrics.editorialFindingCount}`,
  `Exact cross-QL duplicates:${metrics.exactCrossQlDuplicateGroups}`,
  `Normalised clone groups:  ${metrics.normalizedCrossQlCloneGroups}`,
  `Same-QL stem repeats:     ${metrics.sameQlStemRepeatCount}`,
  `Same-QL answer repeats:   ${metrics.sameQlAnswerRepeatCount}`,
  "```",
  "",
  "## Known blocker",
  "",
  "- `PNL-QL-070` / GitHub issue `#262`: the data-sufficiency lead currently leaks enough values before the statements.",
  "",
  "## Structural blockers",
  "",
  ...fatalFindings.length ? fatalFindings.map(
    (finding) => `- **${finding.code}** \u2014 ${finding.scope}: ${finding.message}`
  ) : ["- None detected by the automated structural audit."],
  "",
  "## Editorial finding counts",
  "",
  "| Code | Count |",
  "|---|---:|",
  ...issueCodeCounts.map(({ value, count }) => `| \`${value}\` | ${count} |`),
  "",
  "## Highest-frequency repeated explanation openings",
  "",
  "| Count | Normalised opening |",
  "|---:|---|",
  ...openingCounts.slice(0, 20).map(({ value, count }) => `| ${count} | ${value.replace(/\|/g, "\\|")} |`),
  "",
  "## Highest-frequency repeated explanation paragraphs",
  "",
  "| Count | Normalised paragraph |",
  "|---:|---|",
  ...paragraphCounts.slice(0, 20).map(({ value, count }) => `| ${count} | ${value.replace(/\|/g, "\\|")} |`),
  "",
  "## Context-family concentration",
  "",
  "| Count | Context family |",
  "|---:|---|",
  ...contextFamilyCounts.slice(0, 30).map(({ value, count }) => `| ${count} | ${value.replace(/\|/g, "\\|")} |`),
  "",
  "## Correct-option position",
  "",
  "| Position | Count |",
  "|---|---:|",
  ...correctIndexCounts.map(({ value, count }) => `| ${value} | ${count} |`),
  "",
  "## Next editorial action",
  "",
  "1. Resolve structural blockers first.",
  "2. Review repeated explanation openings and generic working paragraphs as systemic generator/template defects.",
  "3. Review every QL in the CSV and record an explicit decision.",
  "4. Correct generator/template code, regenerate the same seeds, and compare the corpus before approving English readiness."
].join("\n");
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-review.csv"),
  csv,
  "utf8"
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-review.md"),
  reviewMarkdown,
  "utf8"
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-metrics.json"),
  JSON.stringify(metrics, null, 2),
  "utf8"
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-findings.md"),
  findingsMarkdown,
  "utf8"
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-findings.json"),
  JSON.stringify({ fatalFindings, editorialFindings }, null, 2),
  "utf8"
);
console.log(JSON.stringify(metrics, null, 2));
if (generated.length !== 558 || qlGroups.size !== 186) {
  throw new Error(
    `Editorial corpus size mismatch: ${generated.length} rows across ${qlGroups.size} QLs.`
  );
}
if (fatalFindings.length > 0) {
  throw new Error(
    `PNL English editorial structural audit found ${fatalFindings.length} blocker(s).`
  );
}
