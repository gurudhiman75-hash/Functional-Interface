import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const runtimePath = path.join(root, "CP-002/cp002-dynamic-runtime.ts");
const testPath = path.join(root, "CP-002/cp002-dynamic-runtime.test.ts");

function replaceOnce(file, oldValue, newValue) {
  const source = fs.readFileSync(file, "utf8");
  const first = source.indexOf(oldValue);
  if (first < 0) {
    throw new Error(`Anchor not found in ${file}: ${oldValue.slice(0, 140)}`);
  }
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Anchor is not unique in ${file}: ${oldValue.slice(0, 140)}`);
  }
  fs.writeFileSync(file, source.replace(oldValue, newValue));
}

const helper = `function formatDiscountSequence(values: readonly Rational[]): string {
  return values.map(formatPercent).join(", ");
}

function buildCp002GeneratedWorking(
  qlId: string,
  request: SolverRequest,
  answer: string,
): string {
  const prefix = "**Generated-value check:**";

  switch (request.mode) {
    case "MP_DISCOUNT_TO_SP":
      return \`${"${prefix}"} A ${"${formatPercent(request.discountPercent)}"} discount is taken from ${"${formatMoney(request.markedPrice)}"}; the retained share of the marked price gives ${"${answer}"}.\`;

    case "MP_SP_TO_DISCOUNT":
      return \`${"${prefix}"} The price falls from ${"${formatMoney(request.markedPrice)}"} to ${"${formatMoney(request.sellingPrice)}"}. Measuring that reduction against the marked price gives ${"${answer}"}.\`;

    case "SP_DISCOUNT_TO_MP":
      return \`${"${prefix}"} The displayed selling price ${"${formatMoney(request.sellingPrice)}"} is what remains after a ${"${formatPercent(request.discountPercent)}"} discount. Reversing that retained share gives ${"${answer}"}.\`;

    case "MP_DISCOUNT_TO_AMOUNT":
      return \`${"${prefix}"} Taking ${"${formatPercent(request.discountPercent)}"} of the marked price ${"${formatMoney(request.markedPrice)}"} gives the discount amount ${"${answer}"}.\`;

    case "MP_AMOUNT_TO_DISCOUNT":
      return \`${"${prefix}"} The reduction is ${"${formatMoney(request.discountAmount)}"} on a marked-price base of ${"${formatMoney(request.markedPrice)}"}. Reduction divided by base, then multiplied by 100, gives ${"${answer}"}.\`;

    case "MP_AMOUNT_TO_SP":
      return \`${"${prefix}"} Subtract the stated discount amount ${"${formatMoney(request.discountAmount)}"} from ${"${formatMoney(request.markedPrice)}"}; the payable price is ${"${answer}"}.\`;

    case "SUCCESSIVE_DISCOUNTS_TO_SP":
      return \`${"${prefix}"} Apply ${"${formatDiscountSequence(request.discountPercents)}"} one after another to ${"${formatMoney(request.markedPrice)}"}. Each rate acts on the reduced balance, leaving ${"${answer}"}.\`;

    case "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT":
      return \`${"${prefix}"} Combine the retained multipliers for ${"${formatDiscountSequence(request.discountPercents)}"}, rather than adding the rates. Their single equivalent reduction is ${"${answer}"}.\`;

    case "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT":
      return \`${"${prefix}"} The known ${"${formatPercent(request.knownDiscountPercent)}"} discount and the missing rate must reproduce an overall ${"${formatPercent(request.equivalentDiscountPercent)}"} reduction. Dividing the retained multipliers gives ${"${answer}"}.\`;

    case "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE":
      return \`${"${prefix}"} Compare the ${"${formatPercent(request.singleDiscountPercent)}"} single discount with successive discounts of ${"${formatDiscountSequence(request.successiveDiscountPercents)}"} on the same ${"${formatMoney(request.markedPrice)}"} base. The comparison is ${"${answer}"}.\`;

    case "CP_MARKUP_DISCOUNT_TO_RESULT": {
      const purpose =
        qlId === "PNL-QL-047"
          ? "For the requested profit-or-loss rate"
          : qlId === "PNL-QL-048"
            ? "For the requested profit-or-loss amount"
            : "For the caselet ledger";
      return \`${"${prefix}"} ${"${purpose}"}, start from cost ${"${formatMoney(request.costPrice)}"}, apply the ${"${formatPercent(request.markupPercent)}"} markup, and then apply the ${"${formatPercent(request.discountPercent)}"} discount to that marked price. This produces ${"${answer}"}.\`;
    }

    case "MP_CP_TARGET_RATE_TO_DISCOUNT":
      if (qlId === "PNL-QL-070") {
        return \`${"${prefix}"} Statement I fixes the target selling price from cost and the target result, while Statement II supplies the marked price needed to measure discount. Therefore, ${"${answer}"}.\`;
      }
      return \`${"${prefix}"} First convert cost ${"${formatMoney(request.costPrice)}"} and the target ${"${formatPercent(request.targetRatePercent)}"} ${"${request.direction.toLowerCase()}"} into the required selling price. Compare that value with marked price ${"${formatMoney(request.markedPrice)}"}; the needed discount is ${"${answer}"}.\`;

    case "CP_DISCOUNT_TARGET_RATE_TO_MARKUP":
      return \`${"${prefix}"} The target ${"${formatPercent(request.targetRatePercent)}"} ${"${request.direction.toLowerCase()}"} fixes the selling price from cost ${"${formatMoney(request.costPrice)}"}. Reverse the ${"${formatPercent(request.discountPercent)}"} discount to recover marked price, giving the markup ${"${answer}"}.\`;

    case "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT":
      return \`${"${prefix}"} Payment is made for ${"${request.paidUnits.toString()}"} units while ${"${request.freeUnits.toString()}"} units are free. The free share out of all received units is the equivalent discount, ${"${answer}"}.\`;

    case "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE":
      return \`${"${prefix}"} Pay ${"${formatMoney(request.unitMarkedPrice)}"} for each of ${"${request.paidUnits.toString()}"} units and spread that total over ${"${(request.paidUnits + request.freeUnits).toString()}"} received units. The effective unit price is ${"${answer}"}.\`;

    case "CASHBACK_TO_EFFECTIVE_PRICE":
      return \`${"${prefix}"} Cashback is received after paying the billed price. Subtract ${"${formatMoney(request.cashbackAmount)}"} from ${"${formatMoney(request.billedPrice)}"} to obtain ${"${answer}"}.\`;

    case "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE":
      return \`${"${prefix}"} Calculate ${"${formatPercent(request.cashbackPercent)}"} cashback on the billed amount ${"${formatMoney(request.billedPrice)}"}, then deduct it from that bill. The effective price is ${"${answer}"}.\`;

    case "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE":
      return \`${"${prefix}"} Reduce ${"${formatMoney(request.markedPrice)}"} by ${"${formatPercent(request.discountPercent)}"} first, then subtract the flat coupon ${"${formatMoney(request.couponAmount)}"}. The final payable amount is ${"${answer}"}.\`;

    case "DISCOUNT_VS_CASHBACK_COMPARE":
      return \`${"${prefix}"} Price both offers from the same ${"${formatMoney(request.markedPrice)}"} base: one uses a ${"${formatPercent(request.discountPercent)}"} discount and the other returns ${"${formatMoney(request.cashbackAmount)}"}. Their comparison is ${"${answer}"}.\`;

    case "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP":
      return \`${"${prefix}"} Starting from ${"${formatMoney(request.markedPrice)}"}, apply ${"${formatDiscountSequence(request.discountPercents)}"} sequentially to the changing balance. The final selling price is ${"${answer}"}.\`;

    case "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE":
      return \`${"${prefix}"} Compare billed price ${"${formatMoney(request.billedPrice)}"} with the eligibility threshold ${"${formatMoney(request.minimumSpend)}"}. Only an eligible bill receives the ${"${formatMoney(request.couponAmount)}"} coupon, leading to ${"${answer}"}.\`;

    case "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE":
      return \`${"${prefix}"} Apply the ${"${formatPercent(request.discountPercent)}"} discount to ${"${formatMoney(request.markedPrice)}"}; the later ${"${formatPercent(request.couponPercent)}"} coupon acts on that reduced bill. The result is ${"${answer}"}.\`;

    case "PERCENT_CASHBACK_ON_BILLED_AMOUNT": {
      const cap = request.cashbackCap
        ? \` with a cap of ${"${formatMoney(request.cashbackCap)}"}\`
        : "";
      return \`${"${prefix}"} Calculate ${"${formatPercent(request.cashbackPercent)}"} cashback on billed price ${"${formatMoney(request.billedPrice)}"}${"${cap}"}, then subtract the allowed cashback. This gives ${"${answer}"}.\`;
    }

    case "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT": {
      const cap = request.cashbackCap
        ? \`, capped at ${"${formatMoney(request.cashbackCap)}"}\`
        : "";
      return \`${"${prefix}"} First discount ${"${formatMoney(request.markedPrice)}"} by ${"${formatPercent(request.discountPercent)}"}. Cashback is then calculated at ${"${formatPercent(request.cashbackPercent)}"} of the original marked price${"${cap}"}, producing ${"${answer}"}.\`;
    }

    case "DISCOUNT_FRACTION_TO_PERCENT":
      return \`${"${prefix}"} Convert the discount fraction ${"${formatRational(request.discountFraction)}"} into a percentage by multiplying by 100. The discount rate is ${"${answer}"}.\`;

    case "PAID_TO_MARKED_RATIO_TO_DISCOUNT":
      return \`${"${prefix}"} The paid-to-marked ratio is ${"${formatRational(request.paidPart)}"}:${"${formatRational(request.markedPart)}"}. The unpaid share of the marked price is the discount, ${"${answer}"}.\`;

    case "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE":
      return \`${"${prefix}"} On marked price ${"${formatMoney(request.markedPrice)}"}, compare the ${"${formatPercent(request.discountPercent)}"} discount with a ${"${formatMoney(request.couponAmount)}"} coupon that requires at least ${"${formatMoney(request.minimumSpend)}"} spend. The eligible comparison is ${"${answer}"}.\`;

    case "COUPON_ORDER_COMPARE":
      return \`${"${prefix}"} Use both orders on ${"${formatMoney(request.markedPrice)}"}: ${"${formatPercent(request.discountPercent)}"} then ${"${formatMoney(request.couponAmount)}"}, and coupon then discount. The order comparison is ${"${answer}"}.\`;
  }
}

`;

replaceOnce(
  runtimePath,
  "function stable(value: unknown): string {",
  `${helper}function stable(value: unknown): string {`,
);

replaceOnce(
  runtimePath,
  "  const explanationText = `${baseExplanation}\\n\\n**Working with these values:** The generated offer is evaluated in the exact order and on the exact base stated in the question.\\n\\n**Final answer:** ${answer}`;",
  "  const generatedWorking = buildCp002GeneratedWorking(\\n    qlId,\\n    generated.request,\\n    answer,\\n  );\\n  const explanationText = `${baseExplanation}\\n\\n${generatedWorking}\\n\\n**Final answer:** ${answer}`;",
);

replaceOnce(
  testPath,
  "const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };\\nlet generatedCount = 0;",
  `const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };\nlet generatedCount = 0;\n\nfunction normalizedWorkingParagraph(value: string): string {\n  return value\n    .toLowerCase()\n    .replace(/₹\\s*[\\d,.]+(?:\\.\\d+)?/g, "₹#")\n    .replace(/\\b\\d+(?:\\.\\d+)?%/g, "#%")\n    .replace(/\\b\\d+(?:\\.\\d+)?\\b/g, "#")\n    .replace(/\\s+/g, " ")\n    .trim();\n}`,
);

replaceOnce(
  testPath,
  `    assert.ok(\n      pkg.explanation.lines.length >= 4,\n      \`${"${qlId}"}: explanation is unexpectedly short.\`,\n    );`,
  `    assert.ok(\n      pkg.explanation.lines.length >= 4,\n      \`${"${qlId}"}: explanation is unexpectedly short.\`,\n    );\n    const explanation = pkg.explanation.lines.join("\\n\\n");\n    assert.doesNotMatch(\n      explanation,\n      /The generated offer is evaluated in the exact order/,\n      \`${"${qlId}"}: generic CP-wide explanation tail returned.\`,\n    );\n    assert.match(\n      explanation,\n      /\\*\\*Generated-value check:\\*\\*/,\n      \`${"${qlId}"}: generated-value working paragraph is missing.\`,\n    );`,
);

replaceOnce(
  testPath,
  `const ql070 = runPnlCp002DynamicPipeline({`,
  `const workingFingerprintOwners = new Map<string, string[]>();\nfor (const qlId of qlIds) {\n  const pkg = runPnlCp002DynamicPipeline({\n    questionLanguageId: qlId,\n    language: "en",\n    seed: "cp002-working-fingerprint",\n  });\n  const working = pkg.explanation.lines.find((line) =>\n    line.includes("Generated-value check:"),\n  );\n  assert.ok(working, \`${"${qlId}"}: working paragraph is missing.\`);\n  const fingerprint = normalizedWorkingParagraph(working);\n  workingFingerprintOwners.set(fingerprint, [\n    ...(workingFingerprintOwners.get(fingerprint) ?? []),\n    qlId,\n  ]);\n}\nfor (const owners of workingFingerprintOwners.values()) {\n  assert.ok(\n    owners.length <= 2,\n    \`Generated working is shared by too many QLs: ${"${owners.join(\", \")}"}\`,\n  );\n}\n\nconst ql070 = runPnlCp002DynamicPipeline({`,
);

fs.writeFileSync(
  path.join(root, "PNL-001-CP002-EXPLANATION-DIVERSITY.md"),
  `# PNL-001 CP-002 Generated Explanation Diversity\n\n## Scope\n\nReplaces the single CP-wide generated explanation tail with solve-mode-specific and value-bound working for all 34 CP-002 QLs.\n\n## Coverage\n\n- direct and reverse marked-price discount relations;\n- successive and equivalent discounts;\n- markup, target-profit and target-loss inverses;\n- buy-X-get-Y, cashback and coupon offers;\n- eligibility, cap, order and comparison modes;\n- table, caselet, statement, algebraic and data-sufficiency representations.\n\n## Regression contract\n\nThe 816-package CP-002 proof rejects the old generic paragraph, requires a generated-value working paragraph in every package, and prevents one normalised paragraph from being shared by more than two QLs.\n\n## Safety boundary\n\nNo stem, solver, option, lifecycle or publication contract is changed. Dynamic candidates remain unreviewed, not stored, test-ineligible and non-public.\n`,
);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      cpId: "PNL-CP-002",
      qlCount: 34,
      replacement: "SOLVE_MODE_AND_VALUE_SPECIFIC_WORKING",
    },
    null,
    2,
  ),
);
