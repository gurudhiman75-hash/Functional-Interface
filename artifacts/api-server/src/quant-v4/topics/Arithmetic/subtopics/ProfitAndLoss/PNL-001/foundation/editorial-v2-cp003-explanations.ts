import type { FriendlyExplanation } from "./editorial-content";

type Step = FriendlyExplanation["steps"][number];

function make(
  opening: string,
  concept: string,
  steps: readonly Step[],
  conclusion: string,
  commonTrap: string,
  shortcut?: string,
): FriendlyExplanation {
  return { opening, concept, steps, conclusion, commonTrap, shortcut };
}

export function buildCp003Explanation(
  solveMode: string,
  qlId?: string,
): FriendlyExplanation {
  if (
    qlId &&
    ["PNL-QL-074", "PNL-QL-082", "PNL-QL-089", "PNL-QL-094"].includes(qlId)
  ) {
    const base = buildCp003Explanation(solveMode);
    const firstStepByQl: Readonly<
      Record<string, Readonly<{ title: string; body: string }>>
    > = {
      "PNL-QL-074": {
        title: "Price the complete purchased stock",
        body: "Multiply the full purchased quantity by unit cost before combining sold and unsold recovery.",
      },
      "PNL-QL-082": {
        title: "Establish the cost of all purchased units",
        body: "Value every purchased unit at cost before crediting good-stock sales and spoiled-stock recovery.",
      },
      "PNL-QL-089": {
        title: "Rebuild the caselet purchase outlay",
        body: "Reconstruct the caselet's complete purchase outlay from total quantity and unit cost.",
      },
      "PNL-QL-094": {
        title: "Set the full break-even cost",
        body: "Calculate the cost of all purchased units before solving for break-even recovery from spoiled stock.",
      },
    };
    const replacement = firstStepByQl[qlId]!;
    return {
      ...base,
      steps: base.steps.map((step, index) =>
        index === 0 ? { ...step, ...replacement } : step,
      ),
    };
  }

  if (qlId === "PNL-QL-071") {
    return make(
      "Each purchase lot has its own quantity, unit cost and unit selling price, so the lots must be totalled in rupees.",
      "Overall percentage comes from the combined profit or loss amount divided by the combined cost of every lot.",
      [
        {
          title: "Total each lot separately",
          body: "Multiply quantity by unit cost and unit selling price for every listed lot.",
        },
        {
          title: "Combine the lot ledgers",
          body: "Add all lot costs and all lot receipts into two chapter-wide totals.",
        },
        {
          title: "Measure the combined rate",
          body: "Compare total receipt with total cost and divide the absolute difference by total cost.",
          equationLatex: "r=\frac{|S_T-C_T|}{C_T}\times100",
        },
      ],
      "The sign of total receipt minus total cost gives the direction, and the ratio gives the overall percentage.",
      "Do not average the individual lot percentages; quantities and unit costs create unequal money weights.",
    );
  }
  if (qlId === "PNL-QL-077") {
    return make(
      "The groups are quoted by profit or loss rate, so each rate must first be applied to that group's own cost base.",
      "A group with a larger quantity-by-cost value contributes more to the final result than a smaller group with the same percentage.",
      [
        {
          title: "Find every group cost",
          body: "Multiply each group quantity by its unit cost price.",
        },
        {
          title: "Convert each rate into receipt",
          body: "Apply the stated profit or loss multiplier to that group's cost total.",
        },
        {
          title: "Form the weighted overall rate",
          body: "Add group receipts, compare with combined group cost, and measure the difference on combined cost.",
        },
      ],
      "The weighted money comparison gives the overall profit or loss percentage.",
      "Do not average the displayed rates unless the group cost totals are exactly equal.",
    );
  }
  if (qlId === "PNL-QL-088") {
    return make(
      "Read the inventory table row by row and convert each row into a cost total and a selling total.",
      "The table is a compact ledger: quantity and unit cost establish each row's weight, while the selling condition establishes its recovery.",
      [
        {
          title: "Expand the table rows",
          body: "For each row, calculate quantity times unit cost and then apply its stated selling condition.",
        },
        {
          title: "Add the cost column equivalents",
          body: "Combine the row-level cost totals into the full inventory cost.",
        },
        {
          title: "Compare total recovery",
          body: "Add row recoveries and compare them with total inventory cost to obtain the signed percentage.",
        },
      ],
      "The table totals, not the visual average of its rates, determine the overall result.",
      "Do not give every table row equal weight when their quantities or unit costs differ.",
    );
  }
  if (qlId === "PNL-QL-093") {
    return make(
      "This question asks for the overall rupee result, so only the two combined money totals are needed.",
      "After total cost and total receipt are found, their absolute difference is the required amount; no percentage conversion is necessary.",
      [
        {
          title: "Calculate total purchase outlay",
          body: "Add quantity times unit cost across all purchase lots.",
        },
        {
          title: "Calculate total sales receipt",
          body: "Add quantity times unit selling price across the same lots.",
        },
        {
          title: "Take the signed money difference",
          body: "Receipt above cost is profit; receipt below cost is loss.",
          equationLatex: "A=|S_T-C_T|",
        },
      ],
      "The direction and rupee difference together form the requested overall amount.",
      "Do not divide by total cost when the question asks for an amount rather than a percentage.",
    );
  }
  if (qlId === "PNL-QL-075") {
    return make(
      "Damaged units have a fixed recovery, so the undamaged units must supply the rest of the target receipt.",
      "The target applies to the cost of the entire purchase, including the damaged units, before their recovery is deducted.",
      [
        {
          title: "Set the full-stock target",
          body: "Multiply total inventory cost by the required profit or loss factor.",
        },
        {
          title: "Credit damaged-stock recovery",
          body: "Subtract the amount recovered from damaged units from the target receipt.",
        },
        {
          title: "Price the undamaged units",
          body: "Divide the remaining receipt by the number of good units available for sale.",
        },
      ],
      "The quotient is the selling price required for each undamaged unit.",
      "Do not calculate the target only on good units; damaged units were part of the original cost.",
    );
  }
  if (qlId === "PNL-QL-080") {
    return make(
      "Part of the stock is already sold, so the remaining units must recover the exact balance needed for the overall target.",
      "Compute the target receipt for all units, deduct receipts already earned, and allocate the balance over the unsold quantity.",
      [
        {
          title: "Compute target total receipt",
          body: "Apply the stated overall rate to the cost of the complete inventory.",
        },
        {
          title: "Deduct completed sales",
          body: "Add the receipts from sold groups and subtract them from the target.",
        },
        {
          title: "Find the remaining unit price",
          body: "Divide the outstanding receipt by the number of units still unsold.",
        },
      ],
      "This division gives the required selling price per remaining unit.",
      "Do not apply the target percentage only to the unsold portion; it is an overall inventory target.",
    );
  }
  if (qlId === "PNL-QL-081") {
    return make(
      "The remaining stock needs a rate, so first determine its required unit selling price and then compare that price with unit cost.",
      "This is a two-stage inverse: balance the whole inventory target, then translate the remaining-unit price into profit or loss percentage.",
      [
        {
          title: "Balance the inventory receipt",
          body: "Subtract receipts from units already sold from the target receipt for the full stock.",
        },
        {
          title: "Recover the required unit price",
          body: "Spread the outstanding amount equally across the units still available.",
        },
        {
          title: "Convert price to a rate",
          body: "Compare the recovered unit price with unit cost and measure the difference on unit cost.",
        },
      ],
      "The final comparison gives the required profit or loss rate on the remaining units.",
      "Do not report the outstanding receipt as a percentage before dividing it across the remaining quantity.",
    );
  }
  if (qlId === "PNL-QL-092") {
    return make(
      "Test each statement independently against the information needed to price the remaining stock.",
      "A sufficient statement must identify total purchase cost, receipt from units already sold, remaining quantity, and the overall target stated in the question.",
      [
        {
          title: "Check Statement I alone",
          body: "Decide whether it supplies both the purchase details and completed-sale details needed for the inventory balance.",
        },
        {
          title: "Check Statement II alone",
          body: "Apply the same sufficiency test without borrowing any fact from Statement I.",
        },
        {
          title: "Combine only if necessary",
          body: "Use both statements together only when each supplies a different missing part of the required ledger.",
        },
      ],
      "The standard data-sufficiency option follows from those two independent checks.",
      "Do not calculate with facts from both statements while testing whether one statement is sufficient by itself.",
    );
  }
  if (
    /MULTIPLE_LOTS_TO_OVERALL_RESULT|GROUP_RATES_TO_OVERALL_RESULT/.test(
      solveMode,
    )
  )
    return make(
      "When several lots or groups are involved, the overall result must come from total money rather than an average of percentages.",
      "Each group contributes its own cost and selling amount; add those amounts first and then measure the combined difference on total cost.",
      [
        {
          title: "Build group totals",
          body: "For every group, multiply quantity by unit cost and unit selling price or apply its stated rate.",
        },
        {
          title: "Add cost and selling amounts",
          body: "Combine all group costs into total cost and all receipts into total selling price.",
        },
        {
          title: "Find the overall result",
          body: "Compare the two totals and divide the absolute difference by total cost.",
          equationLatex: "r=\frac{|S_T-C_T|}{C_T}\times100",
        },
      ],
      "The sign of total selling price minus total cost gives the overall direction and the formula gives the rate.",
      "Do not average the group percentages unless all group cost bases are equal.",
    );
  if (solveMode === "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE")
    return make(
      "The two selling prices are equal, but the cost prices are different because the profit and loss rates differ.",
      "Recover each cost price from the common selling price, add the costs, and compare them with the two equal selling amounts.",
      [
        {
          title: "Recover the first cost",
          body: "Reverse the first profit or loss multiplier from the common selling price.",
        },
        {
          title: "Recover the second cost",
          body: "Reverse the second multiplier in the same way.",
        },
        {
          title: "Combine both transactions",
          body: "Compare twice the common selling price with the sum of the two recovered costs.",
        },
      ],
      "The combined comparison gives the overall profit or loss percentage.",
      "Do not assume equal selling prices mean equal cost prices or that opposite rates cancel.",
    );
  if (solveMode === "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE")
    return make(
      "Because both articles have the same cost price, their profit and loss amounts can be combined on equal bases.",
      "Use one convenient common cost, calculate both selling prices, and compare their total with twice the common cost.",
      [
        {
          title: "Choose a common cost base",
          body: "Take each cost price as the same convenient amount.",
        },
        {
          title: "Apply both rates",
          body: "Find the two selling-price factors from the stated directions.",
        },
        {
          title: "Combine the results",
          body: "Compare the sum of selling prices with the sum of costs.",
        },
      ],
      "The combined difference on total cost is the overall percentage result.",
      "Do not average signed rates when the question asks for a money-weighted overall result, even though equal costs make the arithmetic simpler.",
    );
  if (/PARTIAL_INVENTORY_TO_OVERALL_RESULT/.test(solveMode))
    return make(
      "A partial-inventory question becomes manageable when every sold and unsold group is entered in one money ledger.",
      "Total cost covers the entire stock, while total recovery includes receipts from sold groups plus any value recovered from remaining stock.",
      [
        {
          title: "Find total inventory cost",
          body: "Multiply total quantity by unit cost price.",
        },
        {
          title: "Add all recoveries",
          body: "Calculate revenue for every sold group and include the stated recovery from unsold units.",
        },
        {
          title: "Measure the overall result",
          body: "Compare total recovery with total cost and use total cost as the percentage base.",
        },
      ],
      "The final comparison gives the overall profit or loss percentage for the complete inventory.",
      "Do not ignore unsold or recovered stock when calculating the overall result.",
    );
  if (
    /DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER|UNSOLD_STOCK_REQUIRED_UNIT_PRICE|UNSOLD_STOCK_REQUIRED_RATE/.test(
      solveMode,
    )
  )
    return make(
      "The required price or rate on the remaining stock must first cover the gap left after earlier sales or damage recovery.",
      "Start from the target total recovery, subtract what has already been recovered, and spread the remaining requirement across the unsold good units.",
      [
        {
          title: "Find total cost and target recovery",
          body: "Calculate complete inventory cost and apply the target profit or loss factor.",
        },
        {
          title: "Subtract known recoveries",
          body: "Remove receipts from sold groups and damaged or recovered units.",
        },
        {
          title: "Allocate the remaining amount",
          body: "Divide by the number of units still to be sold; convert to a rate if the question asks for one.",
        },
      ],
      "The resulting unit price or rate is what the remaining stock must achieve.",
      "Do not apply the target percentage only to the unsold units; the target concerns the entire inventory.",
    );
  if (solveMode === "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT")
    return make(
      "Free units increase the number of units available for sale without increasing the purchase payment.",
      "Total cost is based only on paid units, while total revenue comes from all paid and free units that are sold.",
      [
        {
          title: "Find total acquisition cost",
          body: "Multiply paid quantity by unit cost price; free units add no purchase cost.",
        },
        {
          title: "Find total selling revenue",
          body: "Add paid and free quantities, then multiply by unit selling price.",
        },
        {
          title: "Calculate the overall rate",
          body: "Compare total revenue with acquisition cost on the acquisition-cost base.",
        },
      ],
      "The combined comparison gives the true profit or loss percentage from the promotion.",
      "Do not assign the listed unit cost to free units when calculating what the buyer actually paid.",
    );
  if (/UNKNOWN_GROUP_RATE_FOR_TARGET/.test(solveMode))
    return make(
      "The unknown group's rate must make the combined inventory reach a stated overall target.",
      "Translate the target into a required total selling amount, subtract the selling amounts already fixed, and compare the remaining requirement with the unknown group's cost.",
      [
        {
          title: "Find the target total selling amount",
          body: "Apply the target commercial factor to the total cost of all groups.",
        },
        {
          title: "Remove known group receipts",
          body: "Calculate and subtract the selling amounts of groups whose rates are known.",
        },
        {
          title: "Solve the unknown group's rate",
          body: "Compare its required selling amount with its own cost price.",
        },
      ],
      "This comparison gives both the direction and percentage required for the unknown group.",
      "Do not apply the overall target rate directly to the unknown group alone.",
    );
  if (/UNKNOWN_GROUP_QUANTITY_FOR_TARGET/.test(solveMode))
    return make(
      "Here the rate on the additional group is known, but its quantity must be chosen to make the full inventory meet the target.",
      "Write total cost and total selling price as expressions in the unknown quantity, then impose the target overall multiplier.",
      [
        {
          title: "Summarise fixed groups",
          body: "Add their known costs and selling amounts.",
        },
        {
          title: "Write the unknown group's contribution",
          body: "Use quantity times unit cost for cost and apply its rate for selling price.",
        },
        {
          title: "Set the target equation",
          body: "Equate total selling price to target factor times total cost and solve for quantity.",
        },
      ],
      "The valid non-negative quantity satisfying the equation is the required group size.",
      "Do not calculate the quantity from a percentage difference alone without accounting for both added cost and added revenue.",
    );
  if (/SPOILED_STOCK_REQUIRED_RECOVERY/.test(solveMode))
    return make(
      "The good stock produces a known receipt, while the spoiled stock must provide the remaining recovery needed for the target.",
      "Calculate target total recovery for the whole purchase, subtract revenue from good units, and spread the balance over spoiled units.",
      [
        {
          title: "Find total purchase cost",
          body: "Multiply total quantity by unit cost price.",
        },
        {
          title: "Find the target total recovery",
          body: "Use break-even or the stated overall profit or loss factor.",
        },
        {
          title: "Recover the spoiled-unit requirement",
          body: "Subtract good-unit revenue and divide the remaining amount by spoiled quantity.",
        },
      ],
      "The quotient is the minimum or required recovery per spoiled unit.",
      "Do not measure the target only on the good units; the original cost includes the entire stock.",
    );
  if (solveMode === "EQUAL_SP_EQUAL_RATES_SPECIAL")
    return make(
      "Equal profit and loss rates do not cancel when two articles are sold for the same price.",
      "The common selling price corresponds to two different cost prices, and the higher cost on the loss article creates an unavoidable overall loss.",
      [
        {
          title: "Use a common selling-price base",
          body: "Take the equal selling price as a convenient amount.",
        },
        {
          title: "Recover both costs",
          body: "Divide by 1+r/100 for the profit article and by 1−r/100 for the loss article.",
        },
        {
          title: "Compare combined totals",
          body: "Measure the total shortfall on total cost; the standard result simplifies to r squared divided by 100.",
        },
      ],
      "The pair therefore produces an overall loss, not no profit and no loss.",
      "Do not add the signed rates and conclude zero; their percentage bases are different.",
      "For equal selling prices and equal opposite rates r%, the overall loss is r²/100 percent.",
    );
  if (solveMode === "EQUAL_SP_ONE_RATE_FROM_OVERALL")
    return make(
      "One article's rate and the combined result are known, so the second cost factor must be recovered from the overall equation.",
      "Use the common selling price to express both cost prices, then impose the stated total profit or loss condition.",
      [
        {
          title: "Express the known article's cost",
          body: "Reverse its stated commercial multiplier from the common selling price.",
        },
        {
          title: "Represent the unknown cost",
          body: "Write it using an unknown profit or loss multiplier.",
        },
        {
          title: "Apply the combined target",
          body: "Compare twice the common selling price with the sum of both costs and solve the unknown rate.",
        },
      ],
      "The rate that satisfies the combined condition is the second article's result.",
      "Do not use the known rate as though both articles had equal cost price.",
    );
  if (
    /TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP|TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP/.test(
      solveMode,
    )
  )
    return make(
      "This inventory has already been condensed into one total cost or selling amount, so it behaves like a single commercial transaction.",
      "Apply the stated overall multiplier in the forward direction, or divide by it when the original total cost is required.",
      [
        {
          title: "Form the overall multiplier",
          body: "Use 1+r/100 for profit and 1−r/100 for loss.",
        },
        {
          title: "Move in the required direction",
          body: "Multiply total cost to get total selling price, or divide total selling price to recover total cost.",
        },
      ],
      "The resulting total is the required inventory value.",
      "Do not apply the rate separately to unknown groups when the question already gives an overall total.",
    );
  if (solveMode === "RECOVERY_FRACTION_TO_OVERALL_RESULT")
    return make(
      "The recovered fraction tells us directly how much of the original inventory cost returned as revenue.",
      "Compare the recovered fraction with one whole cost: above one means profit, below one means loss, and the gap converts to a percentage.",
      [
        {
          title: "Interpret the fraction",
          body: "Treat total cost as one whole unit and write recovered revenue as the stated fraction.",
        },
        {
          title: "Find the gap from one",
          body: "Subtract the smaller fraction from the larger.",
        },
        {
          title: "Convert the gap to percent",
          body: "Multiply the absolute fractional difference by 100.",
        },
      ],
      "The direction and percentage follow from whether recovery exceeds or falls short of total cost.",
      "Do not calculate the percentage on recovered revenue; total cost remains the standard base.",
    );
  return make(
    "Let us organise the inventory into a complete cost-and-recovery ledger before calculating the final result.",
    "Inventory questions are weighted by money and quantity, so every group must contribute its proper cost and selling amount.",
    [
      {
        title: "Record all group costs",
        body: "Use quantity, unit cost, and any damage or free-unit condition.",
      },
      {
        title: "Record all recoveries",
        body: "Include sales, unsold value, scrap value, and target receipts where applicable.",
      },
      {
        title: "Solve the requested relation",
        body: "Compare totals or isolate the unknown group variable from the overall target.",
      },
    ],
    "The completed ledger gives the requested amount, rate, price, or quantity.",
    "Do not average rates or omit a group from the total inventory base.",
  );
}
