import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const foundation = path.join(root, "foundation");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value);
}

function replaceOnce(file, oldValue, newValue) {
  const source = read(file);
  const first = source.indexOf(oldValue);
  if (first < 0) {
    throw new Error(`Anchor not found in ${file}: ${oldValue.slice(0, 180)}`);
  }
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Anchor is not unique in ${file}: ${oldValue.slice(0, 180)}`);
  }
  write(file, source.replace(oldValue, newValue));
}

const cp001 = path.join(foundation, "editorial-v2-cp001-explanations.ts");
replaceOnce(
  cp001,
  "export function buildCp001Explanation(solveMode: string): FriendlyExplanation {",
  "export function buildCp001Explanation(\n  solveMode: string,\n  qlId?: string,\n): FriendlyExplanation {",
);
replaceOnce(
  cp001,
  `    case "FRACTION_TO_RATE":\n      return make(\n        "A fractional profit or loss must be converted with close attention to the stated base.",\n        "A fraction of cost converts directly to percent, while a fraction of selling price first changes the hidden cost share.",\n        [\n          { title: "Identify the denominator base", body: "Decide whether the fraction is measured on cost price or selling price." },\n          { title: "Convert to the cost-price rate", body: "Use the direct fraction for a cost base; for a selling-price base, reconstruct cost before comparing." },\n        ],\n        "The resulting percentage is the ordinary profit or loss rate on cost price.",\n        "Do not multiply every fraction by 100 without checking whether its denominator is cost or selling price.",\n      );`,
  `    case "FRACTION_TO_RATE":\n      if (qlId === "PNL-QL-024") {\n        return make(\n          "The profit fraction is already measured against cost price, so no base conversion is needed.",\n          "When profit equals a/b of cost, the profit rate is the same fraction of 100 percent.",\n          [\n            {\n              title: "Read the cost-based fraction",\n              body: "Treat the numerator as profit parts and the denominator as cost-price parts.",\n            },\n            {\n              title: "Scale the fraction to percent",\n              body: "Multiply the profit-to-cost fraction by 100.",\n              equationLatex: "r=\\frac{a}{b}\\times100",\n            },\n          ],\n          "This scaled value is the profit percentage on cost price.",\n          "Do not rebuild selling price when the fraction is already stated on cost.",\n        );\n      }\n      if (qlId === "PNL-QL-025") {\n        return make(\n          "Here the loss is stated directly as a fraction of the original cost.",\n          "A cost-based loss fraction converts straight to the ordinary loss percentage because the denominator is already the required base.",\n          [\n            {\n              title: "Keep cost as the denominator",\n              body: "Use the given denominator as the full cost-price share.",\n            },\n            {\n              title: "Express the loss per hundred",\n              body: "Multiply the loss-to-cost fraction by 100.",\n              equationLatex: "r=\\frac{a}{b}\\times100",\n            },\n          ],\n          "The percentage obtained is the loss rate on cost price.",\n          "Do not subtract the fraction from one; that would find the retained selling-price share instead of the loss rate.",\n        );\n      }\n      if (qlId === "PNL-QL-026") {\n        return make(\n          "Profit is given as a fraction of selling price, but the requested percentage must be measured on cost price.",\n          "If profit is a/b of selling price, cost occupies the remaining (b−a)/b share of selling price.",\n          [\n            {\n              title: "Recover the cost share",\n              body: "Subtract the profit parts from the selling-price parts to obtain the hidden cost parts.",\n            },\n            {\n              title: "Compare profit with recovered cost",\n              body: "Divide a profit parts by b−a cost parts, then convert to percent.",\n              equationLatex: "r=\\frac{a}{b-a}\\times100",\n            },\n          ],\n          "The converted fraction gives profit as a percentage of cost price.",\n          "Do not multiply a/b by 100 directly; that would report profit as a percentage of selling price.",\n        );\n      }\n      if (qlId === "PNL-QL-027") {\n        return make(\n          "A loss fraction based on selling price hides a larger cost-price denominator.",\n          "If loss is a/b of selling price, cost equals selling price plus loss and therefore represents (b+a)/b of selling price.",\n          [\n            {\n              title: "Build the cost share",\n              body: "Add the loss parts to the selling-price parts because cost exceeds selling price in a loss transaction.",\n            },\n            {\n              title: "Measure loss on cost",\n              body: "Divide a loss parts by b+a cost parts and multiply by 100.",\n              equationLatex: "r=\\frac{a}{b+a}\\times100",\n            },\n          ],\n          "This base conversion yields the loss percentage on cost price.",\n          "Do not use b−a in the denominator; subtraction belongs to a profit fraction of selling price, not a loss fraction.",\n        );\n      }\n      return make(\n        "First identify whether the fraction is stated on cost price or selling price.",\n        "A cost-based fraction converts directly, while a selling-price fraction requires reconstructing the cost share.",\n        [\n          {\n            title: "Identify the stated base",\n            body: "Read the denominator named in the question before forming a percentage.",\n          },\n          {\n            title: "Convert to the cost base",\n            body: "Use the direct fraction for cost, or rebuild cost from selling price and the stated profit or loss.",\n          },\n        ],\n        "The converted value is the ordinary profit or loss percentage on cost.",\n        "Do not treat cost-price and selling-price fractions as interchangeable.",\n      );`,
);

const cp003 = path.join(foundation, "editorial-v2-cp003-explanations.ts");
replaceOnce(
  cp003,
  "export function buildCp003Explanation(solveMode: string): FriendlyExplanation {",
  `export function buildCp003Explanation(\n  solveMode: string,\n  qlId?: string,\n): FriendlyExplanation {\n  if (qlId === "PNL-QL-071") {\n    return make(\n      "Each purchase lot has its own quantity, unit cost and unit selling price, so the lots must be totalled in rupees.",\n      "Overall percentage comes from the combined profit or loss amount divided by the combined cost of every lot.",\n      [\n        {\n          title: "Total each lot separately",\n          body: "Multiply quantity by unit cost and unit selling price for every listed lot.",\n        },\n        {\n          title: "Combine the lot ledgers",\n          body: "Add all lot costs and all lot receipts into two chapter-wide totals.",\n        },\n        {\n          title: "Measure the combined rate",\n          body: "Compare total receipt with total cost and divide the absolute difference by total cost.",\n          equationLatex: "r=\\frac{|S_T-C_T|}{C_T}\\times100",\n        },\n      ],\n      "The sign of total receipt minus total cost gives the direction, and the ratio gives the overall percentage.",\n      "Do not average the individual lot percentages; quantities and unit costs create unequal money weights.",\n    );\n  }\n  if (qlId === "PNL-QL-077") {\n    return make(\n      "The groups are quoted by profit or loss rate, so each rate must first be applied to that group's own cost base.",\n      "A group with a larger quantity-by-cost value contributes more to the final result than a smaller group with the same percentage.",\n      [\n        {\n          title: "Find every group cost",\n          body: "Multiply each group quantity by its unit cost price.",\n        },\n        {\n          title: "Convert each rate into receipt",\n          body: "Apply the stated profit or loss multiplier to that group's cost total.",\n        },\n        {\n          title: "Form the weighted overall rate",\n          body: "Add group receipts, compare with combined group cost, and measure the difference on combined cost.",\n        },\n      ],\n      "The weighted money comparison gives the overall profit or loss percentage.",\n      "Do not average the displayed rates unless the group cost totals are exactly equal.",\n    );\n  }\n  if (qlId === "PNL-QL-088") {\n    return make(\n      "Read the inventory table row by row and convert each row into a cost total and a selling total.",\n      "The table is a compact ledger: quantity and unit cost establish each row's weight, while the selling condition establishes its recovery.",\n      [\n        {\n          title: "Expand the table rows",\n          body: "For each row, calculate quantity times unit cost and then apply its stated selling condition.",\n        },\n        {\n          title: "Add the cost column equivalents",\n          body: "Combine the row-level cost totals into the full inventory cost.",\n        },\n        {\n          title: "Compare total recovery",\n          body: "Add row recoveries and compare them with total inventory cost to obtain the signed percentage.",\n        },\n      ],\n      "The table totals, not the visual average of its rates, determine the overall result.",\n      "Do not give every table row equal weight when their quantities or unit costs differ.",\n    );\n  }\n  if (qlId === "PNL-QL-093") {\n    return make(\n      "This question asks for the overall rupee result, so only the two combined money totals are needed.",\n      "After total cost and total receipt are found, their absolute difference is the required amount; no percentage conversion is necessary.",\n      [\n        {\n          title: "Calculate total purchase outlay",\n          body: "Add quantity times unit cost across all purchase lots.",\n        },\n        {\n          title: "Calculate total sales receipt",\n          body: "Add quantity times unit selling price across the same lots.",\n        },\n        {\n          title: "Take the signed money difference",\n          body: "Receipt above cost is profit; receipt below cost is loss.",\n          equationLatex: "A=|S_T-C_T|",\n        },\n      ],\n      "The direction and rupee difference together form the requested overall amount.",\n      "Do not divide by total cost when the question asks for an amount rather than a percentage.",\n    );\n  }\n  if (qlId === "PNL-QL-075") {\n    return make(\n      "Damaged units have a fixed recovery, so the undamaged units must supply the rest of the target receipt.",\n      "The target applies to the cost of the entire purchase, including the damaged units, before their recovery is deducted.",\n      [\n        {\n          title: "Set the full-stock target",\n          body: "Multiply total inventory cost by the required profit or loss factor.",\n        },\n        {\n          title: "Credit damaged-stock recovery",\n          body: "Subtract the amount recovered from damaged units from the target receipt.",\n        },\n        {\n          title: "Price the undamaged units",\n          body: "Divide the remaining receipt by the number of good units available for sale.",\n        },\n      ],\n      "The quotient is the selling price required for each undamaged unit.",\n      "Do not calculate the target only on good units; damaged units were part of the original cost.",\n    );\n  }\n  if (qlId === "PNL-QL-080") {\n    return make(\n      "Part of the stock is already sold, so the remaining units must recover the exact balance needed for the overall target.",\n      "Compute the target receipt for all units, deduct receipts already earned, and allocate the balance over the unsold quantity.",\n      [\n        {\n          title: "Compute target total receipt",\n          body: "Apply the stated overall rate to the cost of the complete inventory.",\n        },\n        {\n          title: "Deduct completed sales",\n          body: "Add the receipts from sold groups and subtract them from the target.",\n        },\n        {\n          title: "Find the remaining unit price",\n          body: "Divide the outstanding receipt by the number of units still unsold.",\n        },\n      ],\n      "This division gives the required selling price per remaining unit.",\n      "Do not apply the target percentage only to the unsold portion; it is an overall inventory target.",\n    );\n  }\n  if (qlId === "PNL-QL-081") {\n    return make(\n      "The remaining stock needs a rate, so first determine its required unit selling price and then compare that price with unit cost.",\n      "This is a two-stage inverse: balance the whole inventory target, then translate the remaining-unit price into profit or loss percentage.",\n      [\n        {\n          title: "Balance the inventory receipt",\n          body: "Subtract receipts from units already sold from the target receipt for the full stock.",\n        },\n        {\n          title: "Recover the required unit price",\n          body: "Spread the outstanding amount equally across the units still available.",\n        },\n        {\n          title: "Convert price to a rate",\n          body: "Compare the recovered unit price with unit cost and measure the difference on unit cost.",\n        },\n      ],\n      "The final comparison gives the required profit or loss rate on the remaining units.",\n      "Do not report the outstanding receipt as a percentage before dividing it across the remaining quantity.",\n    );\n  }\n  if (qlId === "PNL-QL-092") {\n    return make(\n      "Test each statement independently against the information needed to price the remaining stock.",\n      "A sufficient statement must identify total purchase cost, receipt from units already sold, remaining quantity, and the overall target stated in the question.",\n      [\n        {\n          title: "Check Statement I alone",\n          body: "Decide whether it supplies both the purchase details and completed-sale details needed for the inventory balance.",\n        },\n        {\n          title: "Check Statement II alone",\n          body: "Apply the same sufficiency test without borrowing any fact from Statement I.",\n        },\n        {\n          title: "Combine only if necessary",\n          body: "Use both statements together only when each supplies a different missing part of the required ledger.",\n        },\n      ],\n      "The standard data-sufficiency option follows from those two independent checks.",\n      "Do not calculate with facts from both statements while testing whether one statement is sufficient by itself.",\n    );\n  }`,
);

const legacyBuilder = path.join(foundation, "editorial-v2-legacy-builder.ts");
replaceOnce(
  legacyBuilder,
  'if (cpId === "PNL-CP-001") return buildCp001Explanation(solveMode);',
  'if (cpId === "PNL-CP-001") return buildCp001Explanation(solveMode, qlId);',
);
replaceOnce(
  legacyBuilder,
  "return buildCp003Explanation(solveMode);",
  "return buildCp003Explanation(solveMode, qlId);",
);

const normalized = path.join(foundation, "editorial-v2-legacy-normalized.ts");
replaceOnce(
  normalized,
  'question: "Can the required unit selling price of the remaining stock for an overall 10% profit be determined?",',
  'question: "Can the required unit selling price of the remaining stock for an overall {targetRatePercent}% {targetDirection} be determined?",',
);

const cp003Runtime = path.join(root, "CP-003/cp003-dynamic-runtime.ts");
replaceOnce(
  cp003Runtime,
  '      return `${prefix} The ${request.totalQuantity} units cost ${cp003FormatMoney(totalCost)} in all. After accounting for the ${soldQuantity} already-sold units, the remaining ${remainingQuantity} units must raise the balance needed for ${cp003DirectedRate(request.targetDirection, request.targetRatePercent)}. The required price per remaining unit is ${answer}.`;',
  [
    '      if (qlId === "PNL-QL-092") {',
    '        return `${prefix} Test Statement I and Statement II separately. A statement is sufficient only when it supplies the purchase details and sold-stock details needed to balance the overall ${cp003DirectedRate(request.targetDirection, request.targetRatePercent)} target. The resulting sufficiency class is ${answer}.`;',
    '      }',
    '      return `${prefix} The ${request.totalQuantity} units cost ${cp003FormatMoney(totalCost)} in all. After accounting for the ${soldQuantity} already-sold units, the remaining ${remainingQuantity} units must raise the balance needed for ${cp003DirectedRate(request.targetDirection, request.targetRatePercent)}. The required price per remaining unit is ${answer}.`;',
  ].join("\n"),
);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      ql092Target: "DYNAMIC_CONTEXT_BOUND",
      diversifiedQlIds: [
        "PNL-QL-024",
        "PNL-QL-025",
        "PNL-QL-026",
        "PNL-QL-027",
        "PNL-QL-071",
        "PNL-QL-075",
        "PNL-QL-077",
        "PNL-QL-080",
        "PNL-QL-081",
        "PNL-QL-088",
        "PNL-QL-092",
        "PNL-QL-093",
      ],
    },
    null,
    2,
  ),
);
