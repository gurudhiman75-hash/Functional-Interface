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

export function buildCp002Explanation(
  solveMode: string,
  qlId?: string,
): FriendlyExplanation {
  if (qlId) {
    const base = buildCp002Explanation(solveMode);
    const openingByQl: Readonly<Record<string, string>> = {
      "PNL-QL-040":
        "Apply the two store discounts in sequence because the second rate uses the already reduced price.",
      "PNL-QL-057":
        "Three successive discounts create three changing price bases, so keep the reductions in order.",
      "PNL-QL-065":
        "Read each table row as an ordered discount chain and carry the reduced price from one column to the next.",
      "PNL-QL-042":
        "The requested discount amount is the stated percentage of the marked price.",
      "PNL-QL-043":
        "A rupee reduction becomes a discount rate only after comparison with the marked price.",
      "PNL-QL-044":
        "Subtract the stated rupee discount from marked price to obtain the amount paid.",
      "PNL-QL-047":
        "Build the tagged price from cost, apply the discount, then measure the final percentage on cost.",
      "PNL-QL-048":
        "Follow markup and discount to the final sale, then compare the rupee difference with cost.",
      "PNL-QL-066":
        "Treat the caselet as a three-stage price ledger: cost, marked price and discounted sale.",
      "PNL-QL-046":
        "Put the single-discount and successive-discount offers on the same marked-price base.",
      "PNL-QL-056":
        "Compare checkout discount and post-purchase cashback through their final effective prices.",
      "PNL-QL-064":
        "Check coupon eligibility before comparing its effective price with the direct discount.",
    };
    const stepTitleByQl: Readonly<Record<string, string>> = {
      "PNL-QL-038": "Express the marked-price reduction as a rate",
      "PNL-QL-068": "Isolate the algebraic discount percentage",
    };
    const opening = openingByQl[qlId];
    const stepTitle = stepTitleByQl[qlId];
    if (opening || stepTitle) {
      return {
        ...base,
        opening: opening ?? base.opening,
        steps: stepTitle
          ? base.steps.map((step, index) =>
              index === 1 ? { ...step, title: stepTitle } : step,
            )
          : base.steps,
      };
    }
  }
  if (solveMode === "MP_DISCOUNT_TO_SP")
    return make(
      "Let us begin with the price printed on the tag and remove the allowed discount.",
      "A discount leaves a retained fraction of the marked price, so selling price equals marked price multiplied by one minus the discount rate.",
      [
        {
          title: "Find the retained percentage",
          body: "Subtract the discount percentage from 100 percent.",
        },
        {
          title: "Apply it to marked price",
          body: "Multiply the marked price by the retained fraction.",
          equationLatex: "S=M\left(1-\frac{d}{100}\right)",
        },
      ],
      "The reduced amount is the customer's selling price.",
      "Do not subtract the percentage number directly from the rupee marked price.",
    );
  if (solveMode === "MP_SP_TO_DISCOUNT")
    return make(
      "The marked price and actual selling price show exactly how much price was reduced.",
      "Discount percentage is the reduction divided by marked price, because the discount is always measured from the marked price.",
      [
        {
          title: "Find the discount amount",
          body: "Subtract selling price from marked price.",
          equationLatex: "D=M-S",
        },
        {
          title: "Convert to a percentage",
          body: "Divide the discount amount by marked price and multiply by 100.",
          equationLatex: "d=\frac{D}{M}\times100",
        },
      ],
      "This rate is the discount percentage offered on the price tag.",
      "Do not divide the discount by selling price; selling price is the amount after reduction.",
    );
  if (solveMode === "SP_DISCOUNT_TO_MP")
    return make(
      "Because the discounted selling price is known, we can reverse the retained-price factor.",
      "After a d percent discount, the customer pays 100−d percent of the marked price.",
      [
        {
          title: "Write the retained factor",
          body: "Convert 100−d percent to a decimal or fraction.",
        },
        {
          title: "Recover marked price",
          body: "Divide the selling price by the retained factor.",
          equationLatex: "M=\frac{S}{1-d/100}",
        },
      ],
      "The quotient is the original marked price.",
      "Do not add the discount percentage to selling price; a percentage reversal requires division.",
    );
  if (
    /SUCCESSIVE_DISCOUNTS_TO_SP|THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP/.test(
      solveMode,
    )
  )
    return make(
      "Successive discounts should be processed one after another, just as the store applies them.",
      "Each later discount acts on the already reduced price, so retained-price multipliers must be multiplied rather than the discounts added.",
      [
        {
          title: "Convert every discount to a retained factor",
          body: "A discount of d percent leaves the factor 1−d/100.",
        },
        {
          title: "Multiply the factors",
          body: "Apply the factors in order to the marked price.",
          equationLatex: "S=M\prod_i\left(1-\frac{d_i}{100}\right)",
        },
        {
          title: "Read the final amount",
          body: "The product gives the actual amount paid after all reductions.",
        },
      ],
      "The final reduced price is the required selling price.",
      "Do not add successive discount percentages because their bases change after every reduction.",
    );
  if (solveMode === "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT")
    return make(
      "We can replace two successive discounts with one discount that leaves the same final price.",
      "The equivalent retained fraction is the product of the two retained fractions; the equivalent discount is what is missing from 100 percent.",
      [
        {
          title: "Multiply retained factors",
          body: "Use (1−d1/100)(1−d2/100).",
        },
        {
          title: "Convert back to a discount",
          body: "Subtract the retained percentage from 100 percent.",
          equationLatex:
            "d_e=100\left[1-\left(1-\frac{d_1}{100}\right)\left(1-\frac{d_2}{100}\right)\right]",
        },
      ],
      "This single rate produces the same final selling price as both discounts together.",
      "Do not simply add the two discount rates; the second discount is on a lower price.",
    );
  if (
    /MP_DISCOUNT_TO_AMOUNT|MP_AMOUNT_TO_DISCOUNT|MP_AMOUNT_TO_SP/.test(
      solveMode,
    )
  )
    return make(
      "Here the discount is handled as a direct link between marked price, discount amount, and selling price.",
      "These three quantities satisfy marked price minus discount amount equals selling price, while the discount rate uses marked price as its base.",
      [
        {
          title: "Write the price relation",
          body: "Keep marked price, discount amount, and selling price in the same currency units.",
          equationLatex: "S=M-D",
        },
        {
          title: "Use the requested conversion",
          body: "For a rate, divide D by M; for an amount or selling price, rearrange the same relation.",
        },
      ],
      "The rearranged relation gives the requested discount value or final price.",
      "Do not measure the discount percentage on selling price.",
    );
  if (solveMode === "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT")
    return make(
      "The combined discount and one individual discount are known, so the missing retained factor can be isolated.",
      "Equivalent discount information is easiest to use through retained-price multipliers, not by subtracting discount rates.",
      [
        {
          title: "Convert the equivalent discount",
          body: "Find the overall retained factor 1−de/100.",
        },
        {
          title: "Remove the known discount factor",
          body: "Divide the overall retained factor by 1−d1/100.",
        },
        {
          title: "Recover the missing discount",
          body: "Subtract the remaining factor from 1 and convert to percent.",
        },
      ],
      "The recovered rate is the second successive discount.",
      "Do not calculate the missing discount as equivalent discount minus known discount.",
    );
  if (
    /SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE|DISCOUNT_VS_CASHBACK_COMPARE|MIXED_OFFER_ELIGIBILITY_COMPARE/.test(
      solveMode,
    )
  )
    return make(
      "The safest comparison is to convert every offer into the actual amount the customer finally pays.",
      "Offers with different wording can be compared only after discount, cashback, coupon value, and eligibility have been evaluated on their correct bases.",
      [
        {
          title: "Evaluate the first offer",
          body: "Calculate its effective price after applying all valid conditions.",
        },
        {
          title: "Evaluate the second offer",
          body: "Use the same original marked or billed amount and respect eligibility rules.",
        },
        {
          title: "Compare final prices",
          body: "The lower effective price is better; subtract the two prices for the saving difference.",
        },
      ],
      "The offer with the lower valid effective cost is the better choice.",
      "Do not compare headline percentages or coupon amounts without calculating the final payable price.",
    );
  if (/CP_MARKUP_DISCOUNT_TO_RESULT/.test(solveMode))
    return make(
      "Markup and discount act on different stages, so we should first find the marked price and then the actual selling price.",
      "Markup is measured on cost price, while discount is measured on marked price; the final profit or loss is measured back on cost price.",
      [
        {
          title: "Build marked price",
          body: "Increase cost price by the markup factor.",
          equationLatex: "M=C\left(1+\frac{m}{100}\right)",
        },
        {
          title: "Apply the discount",
          body: "Reduce marked price by the retained discount factor.",
          equationLatex: "S=M\left(1-\frac{d}{100}\right)",
        },
        {
          title: "Compare with cost",
          body: "Find S−C for the amount, or divide the absolute difference by C for the percentage.",
        },
      ],
      "The comparison of final selling price with cost gives the true commercial result.",
      "Do not subtract discount percentage directly from markup percentage; their bases are different.",
    );
  if (/MP_CP_TARGET_RATE_TO_DISCOUNT/.test(solveMode))
    return make(
      "The target profit or loss first determines the required selling price, after which the discount can be found from marked price.",
      "A target rate is measured on cost price, but discount is measured from marked price, so the calculation must move through selling price.",
      [
        {
          title: "Find target selling price",
          body: "Apply the target commercial multiplier to cost price.",
        },
        {
          title: "Find the reduction from marked price",
          body: "Subtract target selling price from marked price.",
        },
        {
          title: "Convert reduction to discount percentage",
          body: "Divide the reduction by marked price and multiply by 100.",
        },
      ],
      "This is the maximum or required discount that still achieves the target result.",
      "Do not calculate the discount percentage on cost price.",
    );
  if (/CP_DISCOUNT_TARGET_RATE_TO_MARKUP/.test(solveMode))
    return make(
      "The target result fixes the required selling price, while the known discount lets us work backward to marked price.",
      "Markup is then measured by comparing that marked price with cost price.",
      [
        {
          title: "Calculate target selling price",
          body: "Apply the desired profit or loss multiplier to cost.",
        },
        {
          title: "Reverse the discount",
          body: "Divide target selling price by the retained discount factor.",
        },
        {
          title: "Find markup rate",
          body: "Compare the recovered marked price with cost price on the cost base.",
        },
      ],
      "The resulting percentage is the markup needed before the discount is offered.",
      "Do not apply the discount directly to cost price when finding markup.",
    );
  if (
    /BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT|BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE/.test(
      solveMode,
    )
  )
    return make(
      "A buy-and-get offer is best understood by spreading the payment over all units received.",
      "The customer pays for the paid units but receives paid plus free units, so the effective unit price and equivalent discount follow from that ratio.",
      [
        {
          title: "Count total units received",
          body: "Add paid units and free units.",
        },
        {
          title: "Spread the payment",
          body: "Divide the cost of paid units by total units received.",
          equationLatex: "p_e=p\frac{x}{x+y}",
        },
        {
          title: "Convert to discount if needed",
          body: "Compare the effective unit price with the marked unit price.",
        },
      ],
      "This gives either the effective price per unit or the equivalent discount.",
      "Do not treat free units as a percentage of paid units without using total units received.",
    );
  if (
    /CASHBACK_TO_EFFECTIVE_PRICE|CASHBACK_PERCENT_TO_EFFECTIVE_PRICE/.test(
      solveMode,
    )
  )
    return make(
      "Cashback does not reduce the billed amount at checkout, but it lowers the customer's eventual effective cost.",
      "Find the cashback from the stated amount or percentage, then subtract it from the amount paid.",
      [
        {
          title: "Determine cashback",
          body: "Use the flat amount or calculate the stated percentage of the billed price.",
        },
        {
          title: "Find effective price",
          body: "Subtract cashback from the billed amount.",
          equationLatex: "E=B-C_b",
        },
      ],
      "The remaining amount is the customer's effective cost after cashback.",
      "Do not call the post-cashback amount the checkout bill; the bill and effective cost are different.",
    );
  if (
    /DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE|DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE/.test(
      solveMode,
    )
  )
    return make(
      "The store applies the discount first, so the coupon must be evaluated on the already discounted price.",
      "Order matters whenever a percentage coupon and a price reduction use different bases.",
      [
        {
          title: "Apply the store discount",
          body: "Reduce marked price by the discount factor.",
        },
        {
          title: "Apply the coupon",
          body: "Subtract a flat coupon or apply the coupon percentage to the discounted amount.",
        },
        {
          title: "Read effective price",
          body: "The amount left after both valid reductions is the final cost.",
        },
      ],
      "The final amount is the effective price paid by the customer.",
      "Do not apply a percentage coupon to the original marked price unless the offer explicitly says so.",
    );
  if (/COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE/.test(solveMode))
    return make(
      "Before subtracting the coupon, we must check whether the bill reaches the minimum-spend requirement.",
      "A conditional coupon changes the price only when its eligibility condition is satisfied.",
      [
        {
          title: "Test eligibility",
          body: "Compare billed price with the minimum required spend.",
        },
        {
          title: "Apply or reject the coupon",
          body: "Subtract the coupon only if the condition is met.",
        },
        {
          title: "State both results",
          body: "Report eligibility and the corresponding effective price clearly.",
        },
      ],
      "The valid outcome depends on the threshold comparison.",
      "Do not subtract a coupon automatically without checking the minimum-spend rule.",
    );
  if (
    /PERCENT_CASHBACK_ON_BILLED_AMOUNT|PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT/.test(
      solveMode,
    )
  )
    return make(
      "This offer has both a percentage calculation and a maximum cashback cap, so both limits must be checked.",
      "Actual cashback is the smaller of the calculated percentage amount and the stated cap; the percentage base must follow the offer wording.",
      [
        {
          title: "Identify the cashback base",
          body: "Use billed price or original marked price exactly as stated.",
        },
        {
          title: "Calculate uncapped cashback",
          body: "Multiply the correct base by the cashback percentage.",
        },
        {
          title: "Apply the cap and find effective price",
          body: "Use the smaller cashback, then subtract it from the billed amount.",
        },
      ],
      "The capped cashback and resulting effective cost are the required outputs.",
      "Do not calculate cashback on the wrong price or ignore the cap when the percentage amount is larger.",
    );
  if (
    /DISCOUNT_FRACTION_TO_PERCENT|PAID_TO_MARKED_RATIO_TO_DISCOUNT/.test(
      solveMode,
    )
  )
    return make(
      "The fraction or ratio describes how much of the marked price is reduced or retained.",
      "Convert the given relationship to a retained or discounted fraction, then multiply by 100 to express it as a percentage.",
      [
        {
          title: "Interpret the parts",
          body: "Decide whether the given fraction represents discount or price paid.",
        },
        {
          title: "Find the discount fraction",
          body: "If price paid is given, subtract the retained fraction from 1.",
        },
        {
          title: "Convert to percent",
          body: "Multiply the discount fraction by 100.",
        },
      ],
      "The converted value is the discount percentage.",
      "Do not confuse the fraction paid with the fraction discounted.",
    );
  if (solveMode === "COUPON_ORDER_COMPARE")
    return make(
      "A flat coupon and a percentage discount can give different results when their order is reversed.",
      "Calculate both legal sequences separately because the percentage reduction acts on whichever amount exists at that stage.",
      [
        {
          title: "Discount then coupon",
          body: "Apply the percentage reduction to marked price, then subtract the flat coupon.",
        },
        {
          title: "Coupon then discount",
          body: "Subtract the flat coupon first, then apply the percentage reduction to the remainder.",
        },
        {
          title: "Compare the two totals",
          body: "The lower final amount is the better order; their difference is the extra saving.",
        },
      ],
      "The sequence with the lower payable amount is the better order.",
      "Do not assume order is irrelevant when one reduction is flat and the other is percentage-based.",
    );
  return make(
    "Let us translate the offer wording into the actual amount paid by the customer.",
    "Discounts, coupons, cashback, and promotional units must each be applied to the base specified by the offer.",
    [
      {
        title: "Identify the offer sequence",
        body: "List every reduction, condition, and percentage base in the order stated.",
      },
      {
        title: "Evaluate the final price",
        body: "Apply each valid step and keep billed price separate from effective cost.",
      },
      {
        title: "Interpret the result",
        body: "Report the requested price, rate, eligibility, or comparison.",
      },
    ],
    "The completed offer sequence gives the required result.",
    "Do not combine unlike offers by adding their headline values.",
  );
}
