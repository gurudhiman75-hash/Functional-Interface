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

export function buildCp001Explanation(
  solveMode: string,
  qlId?: string,
): FriendlyExplanation {
  if (qlId) {
    const base = buildCp001Explanation(solveMode);
    const openingByQl: Readonly<Record<string, string>> = {
      "PNL-QL-003":
        "Selling price is above cost, so measure that gain against the original cost.",
      "PNL-QL-004":
        "Selling price is below cost, so measure the shortfall against the original cost.",
      "PNL-QL-035":
        "Equal cost and selling prices leave no commercial change to express as a percentage.",
    };
    const firstStepBodyByQl: Readonly<Record<string, string>> = {
      "PNL-QL-005":
        "For a profit sale, every 100 cost-price parts become 100+r selling-price parts.",
      "PNL-QL-006":
        "For a loss sale, every 100 cost-price parts leave 100−r selling-price parts.",
      "PNL-QL-007":
        "A profit selling price equals (100+r)% of cost, so recover cost by dividing by that factor.",
      "PNL-QL-008":
        "A loss selling price equals (100−r)% of cost, so recover cost from the retained factor.",
    };
    const opening = openingByQl[qlId];
    const firstStepBody = firstStepBodyByQl[qlId];
    if (opening || firstStepBody) {
      return {
        ...base,
        opening: opening ?? base.opening,
        steps: firstStepBody
          ? base.steps.map((step, index) =>
              index === 0 ? { ...step, body: firstStepBody } : step,
            )
          : base.steps,
      };
    }
  }

  switch (solveMode) {
    case "CP_SP_TO_AMOUNT":
      return make(
        "Let us compare what the seller paid with what the seller finally received.",
        "Profit or loss amount is the absolute difference between selling price and cost price; the larger price determines the direction.",
        [
          {
            title: "Identify the direction",
            body: "Compare the selling price with the cost price before doing any percentage work.",
          },
          {
            title: "Find the amount",
            body: "Subtract the smaller price from the larger price.",
            equationLatex: "A=|S-C|",
          },
        ],
        "The difference is the required profit or loss amount.",
        "Do not divide by a price when only the amount, not the percentage, is requested.",
      );
    case "CP_SP_TO_RATE":
      return make(
        "We first find the rupee change and then express it relative to the original cost.",
        "In ordinary profit-and-loss questions, cost price is the percentage base unless another base is stated explicitly.",
        [
          {
            title: "Find profit or loss amount",
            body: "Compare selling price and cost price, then take their absolute difference.",
            equationLatex: "A=|S-C|",
          },
          {
            title: "Convert the amount to a rate",
            body: "Divide the amount by cost price and multiply by 100.",
            equationLatex: "r=\frac{A}{C}\times100",
          },
        ],
        "The sign of S−C gives profit, loss, or no change; the formula gives the percentage.",
        "Do not divide by selling price unless the question specifically asks for a margin on selling price.",
      );
    case "CP_RATE_TO_SP":
      return make(
        "The stated rate tells us how much of the cost is added or removed before sale.",
        "A profit uses a multiplier above 1, while a loss uses a retained multiplier below 1.",
        [
          {
            title: "Write the commercial multiplier",
            body: "Use 1+r/100 for profit or 1−r/100 for loss.",
          },
          {
            title: "Apply it to cost price",
            body: "Multiply the cost price by the appropriate factor.",
            equationLatex: "S=C\left(1\pm\frac{r}{100}\right)",
          },
        ],
        "The resulting amount is the required selling price.",
        "Do not add or subtract the percentage number directly from the rupee cost.",
      );
    case "SP_RATE_TO_CP":
      return make(
        "Because the selling price is known, the cleanest method is to reverse the stated multiplier.",
        "The forward relation is selling price equals cost price multiplied by the commercial factor, so cost price is found by division.",
        [
          {
            title: "Form the multiplier",
            body: "Use 1+r/100 for profit or 1−r/100 for loss.",
          },
          {
            title: "Reverse the sale",
            body: "Divide the selling price by that multiplier.",
            equationLatex: "C=\frac{S}{1\pm r/100}",
          },
        ],
        "The quotient is the original cost price.",
        "Do not subtract the stated rate from the selling price; reversing a percentage multiplier requires division.",
      );
    case "AMOUNT_RATE_TO_CP":
      return make(
        "The given profit or loss amount is a known percentage of the unknown cost price.",
        "If an amount equals r percent of cost price, the cost is recovered by scaling the amount from r parts to 100 parts.",
        [
          {
            title: "Write the percentage relation",
            body: "Treat the stated amount as r/100 of cost price.",
            equationLatex: "A=C\frac{r}{100}",
          },
          {
            title: "Solve for cost price",
            body: "Multiply the amount by 100 and divide by the rate.",
            equationLatex: "C=\frac{100A}{r}",
          },
        ],
        "This recovered value is the required cost price.",
        "Do not add the profit or loss amount to itself; the rate identifies the hidden base.",
      );
    case "AMOUNT_CP_TO_RATE":
      return make(
        "We already know the cost base and the profit or loss amount, so only a percentage conversion remains.",
        "Profit or loss percentage is the amount divided by cost price, multiplied by 100.",
        [
          {
            title: "Choose the correct base",
            body: "Use cost price because the question asks for the ordinary profit-or-loss rate.",
          },
          {
            title: "Calculate the percentage",
            body: "Divide the amount by cost price and convert the fraction to percent.",
            equationLatex: "r=\frac{A}{C}\times100",
          },
        ],
        "The computed rate, together with the stated direction, is the answer.",
        "Do not use selling price as the denominator in a standard profit-or-loss percentage question.",
      );
    case "CP_SP_RATIO_TO_RATE":
      return make(
        "A ratio question becomes simple when the cost-price part is treated as the percentage base.",
        "The difference between the selling-price part and cost-price part represents profit or loss on the cost-price part.",
        [
          {
            title: "Compare the ratio parts",
            body: "Subtract the cost part from the selling part to identify the signed change.",
          },
          {
            title: "Measure the change on cost",
            body: "Divide the absolute difference by the cost part and multiply by 100.",
            equationLatex: "r=\frac{|s-c|}{c}\times100",
          },
        ],
        "The larger ratio part determines whether the result is profit or loss.",
        "Do not divide by the sum of the ratio parts; cost price alone is the base.",
      );
    case "RATE_TO_CP_SP_RATIO":
      return make(
        "We can build the required ratio by taking cost price as a convenient 100 parts.",
        "A profit adds rate parts to 100, while a loss leaves 100 minus the rate parts as selling price.",
        [
          {
            title: "Assume a cost base",
            body: "Take cost price as 100 parts.",
          },
          {
            title: "Form the selling-price part",
            body: "Use 100+r for profit or 100−r for loss, then simplify the ratio.",
            equationLatex: "C:S=100:(100\pm r)",
          },
        ],
        "The simplified pair is the cost-price to selling-price ratio.",
        "Do not write the rate itself as the selling-price part.",
      );
    case "MARGIN_SP_TO_PROFIT_CP":
      return make(
        "The percentage is given on selling price, so we must first recover the cost-price share.",
        "If profit is m percent of selling price, cost price is the remaining 100−m percent of selling price.",
        [
          {
            title: "Express cost as a share of selling price",
            body: "Take selling price as 100 parts; profit is m parts and cost is 100−m parts.",
          },
          {
            title: "Convert profit to the cost base",
            body: "Compare the profit part with the cost part.",
            equationLatex: "r_C=\frac{m}{100-m}\times100",
          },
        ],
        "This converted rate is the profit percentage on cost price.",
        "Do not report the selling-price margin unchanged; the percentage base has changed.",
      );
    case "PROFIT_CP_TO_MARGIN_SP":
      return make(
        "The profit rate is known on cost price, but the question asks for profit as a share of selling price.",
        "Take cost price as 100 parts, add the profit parts, and compare profit with the resulting selling-price total.",
        [
          {
            title: "Build a convenient price model",
            body: "Let cost price be 100 parts and profit be r parts.",
          },
          {
            title: "Change the percentage base",
            body: "Selling price is 100+r parts, so divide profit by that total.",
            equationLatex: "m_S=\frac{r}{100+r}\times100",
          },
        ],
        "The result is the profit margin on selling price.",
        "Do not use the cost-price rate as the selling-price margin; their denominators are different.",
      );
    case "CP_RATE_TO_AMOUNT":
      return make(
        "The required amount is simply the stated percentage of the cost price.",
        "Profit or loss amount is found by multiplying cost price by the rate fraction.",
        [
          {
            title: "Convert the rate to a fraction",
            body: "Write the percentage as r/100.",
          },
          {
            title: "Apply it to cost",
            body: "Multiply the cost price by that fraction.",
            equationLatex: "A=C\frac{r}{100}",
          },
        ],
        "The product is the required profit or loss amount.",
        "Do not apply the rate to selling price unless the question explicitly uses that base.",
      );
    case "CP_AMOUNT_TO_SP":
      return make(
        "The sale price is obtained by adjusting the known cost by the stated amount.",
        "Add a profit amount to cost price, or subtract a loss amount from cost price.",
        [
          {
            title: "Identify the direction",
            body: "Decide whether the amount represents profit or loss.",
          },
          {
            title: "Adjust the cost price",
            body: "Use addition for profit and subtraction for loss.",
            equationLatex: "S=C\pm A",
          },
        ],
        "The adjusted amount is the selling price.",
        "Do not convert the amount into a percentage when the rupee adjustment is already given.",
      );
    case "SP_AMOUNT_TO_CP":
      return make(
        "We know the final selling price and the rupee result, so we can undo that adjustment directly.",
        "If a sale includes profit, subtract the profit from selling price; if it includes loss, add the loss back.",
        [
          {
            title: "Read the direction carefully",
            body: "Profit means selling price is above cost; loss means it is below cost.",
          },
          {
            title: "Reverse the adjustment",
            body: "Use C=S−A for profit or C=S+A for loss.",
            equationLatex: "C=S\mp A",
          },
        ],
        "The recovered amount is the cost price.",
        "Do not use the same sign as the forward sale; this question works backward.",
      );
    case "FRACTION_TO_RATE":
      if (qlId === "PNL-QL-024") {
        return make(
          "The profit fraction is already measured against cost price, so no base conversion is needed.",
          "When profit equals a/b of cost, the profit rate is the same fraction of 100 percent.",
          [
            {
              title: "Read the cost-based fraction",
              body: "Treat the numerator as profit parts and the denominator as cost-price parts.",
            },
            {
              title: "Scale the fraction to percent",
              body: "Multiply the profit-to-cost fraction by 100.",
              equationLatex: "r=\frac{a}{b}\times100",
            },
          ],
          "This scaled value is the profit percentage on cost price.",
          "Do not rebuild selling price when the fraction is already stated on cost.",
        );
      }
      if (qlId === "PNL-QL-025") {
        return make(
          "Here the loss is stated directly as a fraction of the original cost.",
          "A cost-based loss fraction converts straight to the ordinary loss percentage because the denominator is already the required base.",
          [
            {
              title: "Keep cost as the denominator",
              body: "Use the given denominator as the full cost-price share.",
            },
            {
              title: "Express the loss per hundred",
              body: "Multiply the loss-to-cost fraction by 100.",
              equationLatex: "r=\frac{a}{b}\times100",
            },
          ],
          "The percentage obtained is the loss rate on cost price.",
          "Do not subtract the fraction from one; that would find the retained selling-price share instead of the loss rate.",
        );
      }
      if (qlId === "PNL-QL-026") {
        return make(
          "Profit is given as a fraction of selling price, but the requested percentage must be measured on cost price.",
          "If profit is a/b of selling price, cost occupies the remaining (b−a)/b share of selling price.",
          [
            {
              title: "Recover the cost share",
              body: "Subtract the profit parts from the selling-price parts to obtain the hidden cost parts.",
            },
            {
              title: "Compare profit with recovered cost",
              body: "Divide a profit parts by b−a cost parts, then convert to percent.",
              equationLatex: "r=\frac{a}{b-a}\times100",
            },
          ],
          "The converted fraction gives profit as a percentage of cost price.",
          "Do not multiply a/b by 100 directly; that would report profit as a percentage of selling price.",
        );
      }
      if (qlId === "PNL-QL-027") {
        return make(
          "A loss fraction based on selling price hides a larger cost-price denominator.",
          "If loss is a/b of selling price, cost equals selling price plus loss and therefore represents (b+a)/b of selling price.",
          [
            {
              title: "Build the cost share",
              body: "Add the loss parts to the selling-price parts because cost exceeds selling price in a loss transaction.",
            },
            {
              title: "Measure loss on cost",
              body: "Divide a loss parts by b+a cost parts and multiply by 100.",
              equationLatex: "r=\frac{a}{b+a}\times100",
            },
          ],
          "This base conversion yields the loss percentage on cost price.",
          "Do not use b−a in the denominator; subtraction belongs to a profit fraction of selling price, not a loss fraction.",
        );
      }
      return make(
        "First identify whether the fraction is stated on cost price or selling price.",
        "A cost-based fraction converts directly, while a selling-price fraction requires reconstructing the cost share.",
        [
          {
            title: "Identify the stated base",
            body: "Read the denominator named in the question before forming a percentage.",
          },
          {
            title: "Convert to the cost base",
            body: "Use the direct fraction for cost, or rebuild cost from selling price and the stated profit or loss.",
          },
        ],
        "The converted value is the ordinary profit or loss percentage on cost.",
        "Do not treat cost-price and selling-price fractions as interchangeable.",
      );
    case "RATE_TO_FRACTION":
      return make(
        "The easiest conversion is to imagine cost price as 100 equal parts.",
        "The rate gives the profit or loss parts, while selling price is formed by adding or subtracting those parts from 100.",
        [
          {
            title: "Create the part model",
            body: "Take cost price as 100 and write the profit or loss amount as r parts.",
          },
          {
            title: "Form the requested selling-price fraction",
            body: "Divide the amount parts by the selling-price parts and simplify.",
          },
        ],
        "The simplified fraction is the required share of selling price.",
        "Do not place 100 automatically in the denominator when the requested fraction is of selling price.",
      );
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      return make(
        "Both possible selling prices come from the same cost, so their difference can be found efficiently.",
        "The common cost cancels except for the difference between the two commercial rate factors.",
        [
          {
            title: "Write both selling prices",
            body: "Apply each stated profit or loss multiplier to the same cost price.",
          },
          {
            title: "Subtract the results",
            body: "The absolute difference equals cost price multiplied by the difference of the signed rates.",
            equationLatex: "\Delta S=C\frac{|r_1-r_2|}{100}",
          },
        ],
        "The absolute value is the required difference between the two selling prices.",
        "Do not add the two selling prices or compare the rates without using the common cost base.",
      );
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      return make(
        "The given selling-price difference represents a known percentage portion of the hidden cost price.",
        "When two rates act on the same cost, the price difference equals cost multiplied by the difference between their signed rates.",
        [
          {
            title: "Find the effective rate gap",
            body: "Measure the distance between the two profit-or-loss conditions.",
          },
          {
            title: "Recover cost price",
            body: "Scale the known price difference from the rate gap to 100 percent.",
            equationLatex: "C=\frac{100\Delta S}{|r_1-r_2|}",
          },
        ],
        "The scaled amount is the original cost price.",
        "Do not divide by either individual rate; the relevant percentage is the gap between the two conditions.",
      );
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      return make(
        "We should first use the known selling condition to uncover the common cost price.",
        "Both selling prices belong to the same item, so once cost is known the second rate follows from an ordinary comparison.",
        [
          {
            title: "Recover cost from the first condition",
            body: "Reverse the first profit or loss multiplier from the first selling price.",
          },
          {
            title: "Evaluate the second condition",
            body: "Compare the second selling price with the recovered cost and measure the difference on cost.",
          },
        ],
        "This comparison gives both the direction and percentage of the second sale.",
        "Do not compare the two selling prices directly as if the first selling price were the cost base.",
      );
    default:
      return make(
        "Let us translate the commercial information into a cost-price and selling-price relationship.",
        "Every profit-and-loss result becomes reliable once the correct percentage base and direction are identified.",
        [
          {
            title: "Organise the known values",
            body: "Separate cost price, selling price, amount, and rate before choosing a formula.",
          },
          {
            title: "Apply the matching relation",
            body: "Use the relation that keeps cost price as the standard base unless another base is stated.",
          },
        ],
        "The evaluated relation gives the required commercial result.",
        "Do not mix an amount, a rate, and a price without checking their units and bases.",
      );
  }
}
