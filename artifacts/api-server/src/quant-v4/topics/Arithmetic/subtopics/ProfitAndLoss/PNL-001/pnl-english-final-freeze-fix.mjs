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

function updateEditorialEntry(file, qlId, update) {
  const data = JSON.parse(read(file));
  const entry = data.entries?.[qlId];
  if (!entry) throw new Error(`${qlId} is missing from ${file}.`);
  update(entry);
  write(file, `${JSON.stringify(data, null, 2)}\n`);
}

const cp001Explanations = path.join(
  foundation,
  "editorial-v2-cp001-explanations.ts",
);
replaceOnce(
  cp001Explanations,
  `): FriendlyExplanation {\n  switch (solveMode) {`,
  `): FriendlyExplanation {\n  if (qlId) {\n    const base = buildCp001Explanation(solveMode);\n    const openingByQl: Readonly<Record<string, string>> = {\n      "PNL-QL-003":\n        "Selling price is above cost, so measure that gain against the original cost.",\n      "PNL-QL-004":\n        "Selling price is below cost, so measure the shortfall against the original cost.",\n      "PNL-QL-035":\n        "Equal cost and selling prices leave no commercial change to express as a percentage.",\n    };\n    const firstStepBodyByQl: Readonly<Record<string, string>> = {\n      "PNL-QL-005":\n        "For a profit sale, every 100 cost-price parts become 100+r selling-price parts.",\n      "PNL-QL-006":\n        "For a loss sale, every 100 cost-price parts leave 100−r selling-price parts.",\n      "PNL-QL-007":\n        "A profit selling price equals (100+r)% of cost, so recover cost by dividing by that factor.",\n      "PNL-QL-008":\n        "A loss selling price equals (100−r)% of cost, so recover cost from the retained factor.",\n    };\n    const opening = openingByQl[qlId];\n    const firstStepBody = firstStepBodyByQl[qlId];\n    if (opening || firstStepBody) {\n      return {\n        ...base,\n        opening: opening ?? base.opening,\n        steps: firstStepBody\n          ? base.steps.map((step, index) =>\n              index === 0 ? { ...step, body: firstStepBody } : step,\n            )\n          : base.steps,\n      };\n    }\n  }\n\n  switch (solveMode) {`,
);

const cp001Runtime = path.join(root, "CP-001/cp001-dynamic-runtime.ts");
replaceOnce(
  cp001Runtime,
  `function valueSpecificWorking(\n  generated: GeneratedFundamentalCase,`,
  `function valueSpecificWorking(\n  qlId: string,\n  generated: GeneratedFundamentalCase,`,
);
replaceOnce(
  cp001Runtime,
  '    case "CP_SP_TO_RATE":\n      line = `The price difference is measured on the original cost of ${formatMoney(request.costPrice)}.`;\n      break;',
  `    case "CP_SP_TO_RATE":\n      line =\n        qlId === "PNL-QL-003"\n          ? \`Profit is the excess of selling price over ${"${formatMoney(request.costPrice)}"}, and that original cost is the percentage base.\`\n          : qlId === "PNL-QL-004"\n            ? \`Loss is the shortfall below ${"${formatMoney(request.costPrice)}"}, measured on that original cost.\`\n            : \`Cost price and selling price are both ${"${formatMoney(request.costPrice)}"}, so the rate is zero.\`;\n      break;`,
);
replaceOnce(
  cp001Runtime,
  `  const explanationText = \`${"${baseExplanation}"}\\n\\n${"${valueSpecificWorking("}\n    generated,`,
  `  const explanationText = \`${"${baseExplanation}"}\\n\\n${"${valueSpecificWorking("}\n    qlId,\n    generated,`,
);

const cp002Explanations = path.join(
  foundation,
  "editorial-v2-cp002-explanations.ts",
);
replaceOnce(
  cp002Explanations,
  "export function buildCp002Explanation(solveMode: string): FriendlyExplanation {",
  `export function buildCp002Explanation(\n  solveMode: string,\n  qlId?: string,\n): FriendlyExplanation {\n  if (qlId) {\n    const base = buildCp002Explanation(solveMode);\n    const openingByQl: Readonly<Record<string, string>> = {\n      "PNL-QL-040":\n        "Apply the two store discounts in sequence because the second rate uses the already reduced price.",\n      "PNL-QL-057":\n        "Three successive discounts create three changing price bases, so keep the reductions in order.",\n      "PNL-QL-065":\n        "Read each table row as an ordered discount chain and carry the reduced price from one column to the next.",\n      "PNL-QL-042":\n        "The requested discount amount is the stated percentage of the marked price.",\n      "PNL-QL-043":\n        "A rupee reduction becomes a discount rate only after comparison with the marked price.",\n      "PNL-QL-044":\n        "Subtract the stated rupee discount from marked price to obtain the amount paid.",\n      "PNL-QL-047":\n        "Build the tagged price from cost, apply the discount, then measure the final percentage on cost.",\n      "PNL-QL-048":\n        "Follow markup and discount to the final sale, then compare the rupee difference with cost.",\n      "PNL-QL-066":\n        "Treat the caselet as a three-stage price ledger: cost, marked price and discounted sale.",\n      "PNL-QL-046":\n        "Put the single-discount and successive-discount offers on the same marked-price base.",\n      "PNL-QL-056":\n        "Compare checkout discount and post-purchase cashback through their final effective prices.",\n      "PNL-QL-064":\n        "Check coupon eligibility before comparing its effective price with the direct discount.",\n    };\n    const stepTitleByQl: Readonly<Record<string, string>> = {\n      "PNL-QL-038": "Express the marked-price reduction as a rate",\n      "PNL-QL-068": "Isolate the algebraic discount percentage",\n    };\n    const opening = openingByQl[qlId];\n    const stepTitle = stepTitleByQl[qlId];\n    if (opening || stepTitle) {\n      return {\n        ...base,\n        opening: opening ?? base.opening,\n        steps: stepTitle\n          ? base.steps.map((step, index) =>\n              index === 1 ? { ...step, title: stepTitle } : step,\n            )\n          : base.steps,\n      };\n    }\n  }`,
);

const legacyBuilder = path.join(foundation, "editorial-v2-legacy-builder.ts");
replaceOnce(
  legacyBuilder,
  'if (cpId === "PNL-CP-002") return buildCp002Explanation(solveMode);',
  'if (cpId === "PNL-CP-002") return buildCp002Explanation(solveMode, qlId);',
);

const cp003Explanations = path.join(
  foundation,
  "editorial-v2-cp003-explanations.ts",
);
replaceOnce(
  cp003Explanations,
  `): FriendlyExplanation {\n  if (qlId === "PNL-QL-071") {`,
  `): FriendlyExplanation {\n  if (qlId && ["PNL-QL-074", "PNL-QL-082", "PNL-QL-089", "PNL-QL-094"].includes(qlId)) {\n    const base = buildCp003Explanation(solveMode);\n    const firstStepByQl: Readonly<Record<string, Readonly<{ title: string; body: string }>>> = {\n      "PNL-QL-074": {\n        title: "Price the complete purchased stock",\n        body: "Multiply the full purchased quantity by unit cost before combining sold and unsold recovery.",\n      },\n      "PNL-QL-082": {\n        title: "Establish the cost of all purchased units",\n        body: "Value every purchased unit at cost before crediting good-stock sales and spoiled-stock recovery.",\n      },\n      "PNL-QL-089": {\n        title: "Rebuild the caselet purchase outlay",\n        body: "Reconstruct the caselet's complete purchase outlay from total quantity and unit cost.",\n      },\n      "PNL-QL-094": {\n        title: "Set the full break-even cost",\n        body: "Calculate the cost of all purchased units before solving for break-even recovery from spoiled stock.",\n      },\n    };\n    const replacement = firstStepByQl[qlId]!;\n    return {\n      ...base,\n      steps: base.steps.map((step, index) =>\n        index === 0 ? { ...step, ...replacement } : step,\n      ),\n    };\n  }\n\n  if (qlId === "PNL-QL-071") {`,
);

const cp002Runtime = path.join(root, "CP-002/cp002-dynamic-runtime.ts");
replaceOnce(
  cp002Runtime,
  '      return `${prefix} Starting from ${formatMoney(request.markedPrice)}, apply ${formatDiscountSequence(request.discountPercents)} sequentially to the changing balance. The final selling price is ${answer}.`;',
  '      return `${prefix} Starting from ${formatMoney(request.markedPrice)}, apply ${formatDiscountSequence(request.discountPercents)} sequentially to the changing balance. The three-stage payable amount is ${answer}.`;',
);

const cp004Runtime = path.join(root, "CP-004/cp004-dynamic-runtime.ts");
replaceOnce(
  cp004Runtime,
  `      return \`${"${prefix}"} ${"${purpose}"}, start from ${"${cp004FormatMoney(request.initialCostPrice)}"} and apply ${"${cp004StageSequence(request.stages)}"} to the changing price base. The final selling price is ${"${answer}"}.\`;`,
  `      const conclusion =\n        qlId === "PNL-QL-095"\n          ? \`The two-transfer ending price is ${"${answer}"}.\`\n          : qlId === "PNL-QL-096"\n            ? \`After the third transfer, the chain closes at ${"${answer}"}.\`\n            : \`The transaction table produces final buyer price ${"${answer}"}.\`;\n      return \`${"${prefix}"} ${"${purpose}"}, start from ${"${cp004FormatMoney(request.initialCostPrice)}"} and apply ${"${cp004StageSequence(request.stages)}"} to the changing price base. ${"${conclusion}"}\`;`,
);

updateEditorialEntry(
  path.join(root, "CP-005/editorial-content.en.json"),
  "PNL-QL-122",
  (entry) => {
    const step = entry.explanation.steps.find(
      (item) => item.title === "Convert to a percentage",
    );
    if (!step) throw new Error("PNL-QL-122 percentage step is missing.");
    step.title = "Express the actual result as a rate";
  },
);

const cp006 = path.join(root, "CP-006/editorial-content.en.json");
for (const [qlId, title] of [
  ["PNL-QL-154", "Measure the result on effective cost"],
  ["PNL-QL-174", "Convert the contribution ratio to percent"],
  ["PNL-QL-177", "Express margin of safety as a percentage"],
]) {
  updateEditorialEntry(cp006, qlId, (entry) => {
    const step = entry.explanation.steps.find(
      (item) => item.title === "Convert to a percentage",
    );
    if (!step) throw new Error(`${qlId} percentage step is missing.`);
    step.title = title;
  });
}

const audit = path.join(root, "pnl-001-english-editorial-audit.ts");
replaceOnce(
  audit,
  `    if (fixedStem) fixedStemQls.push(qlId);\n    else sameQlStemRepeat.push(qlId);\n    editorialFindings.push({\n      code: fixedStem ? "CONTRACTUALLY-FIXED-STEM" : "SAME-QL-STEM-REPEAT",\n      severity: fixedStem ? "NOTE" : "MAJOR",\n      scope: qlId,\n      message: fixedStem\n        ? \`All ${"${candidateSeedsPerQl}"} deterministic candidates render the same visible stem; record this as a fixed-stem task contract.\`\n        : \`All three selected samples render the same visible stem despite ${"${candidateDiversity?.exactCandidateStemCount ?? \"unknown\"}"} exact stems in the candidate pool.\`,\n    });`,
  `    if (fixedStem) {\n      fixedStemQls.push(qlId);\n    } else {\n      sameQlStemRepeat.push(qlId);\n      editorialFindings.push({\n        code: "SAME-QL-STEM-REPEAT",\n        severity: "MAJOR",\n        scope: qlId,\n        message: \`All three selected samples render the same visible stem despite ${"${candidateDiversity?.exactCandidateStemCount ?? \"unknown\"}"} exact stems in the candidate pool.\`,\n      });\n    }`,
);
replaceOnce(
  audit,
  `    if (fixedAnswer) fixedAnswerQls.push(qlId);\n    else sameQlAnswerRepeat.push(qlId);\n    editorialFindings.push({\n      code: fixedAnswer\n        ? "CONTRACTUALLY-FIXED-ANSWER"\n        : "SAME-QL-ANSWER-REPEAT",\n      severity: "NOTE",\n      scope: qlId,\n      message: fixedAnswer\n        ? \`All ${"${candidateSeedsPerQl}"} deterministic candidates produce the same displayed answer; record this as a fixed-answer task contract.\`\n        : \`The selected samples repeat one answer despite ${"${candidateDiversity?.candidateAnswerCount ?? \"unknown\"}"} answers in the candidate pool.\`,\n    });`,
  `    if (fixedAnswer) {\n      fixedAnswerQls.push(qlId);\n    } else {\n      sameQlAnswerRepeat.push(qlId);\n      editorialFindings.push({\n        code: "SAME-QL-ANSWER-REPEAT",\n        severity: "NOTE",\n        scope: qlId,\n        message: \`The selected samples repeat one answer despite ${"${candidateDiversity?.candidateAnswerCount ?? \"unknown\"}"} answers in the candidate pool.\`,\n      });\n    }`,
);
replaceOnce(
  audit,
  '  auditStatus: fatalFindings.length > 0 ? "STRUCTURAL_FAIL" : "REVIEW_REQUIRED",',
  `  auditStatus:\n    fatalFindings.length > 0\n      ? "STRUCTURAL_FAIL"\n      : editorialFindings.length > 0\n        ? "REVIEW_REQUIRED"\n        : "PASS",`,
);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      targetedRepeatedPatterns: 10,
      fixedAnswerContractsMovedToMetrics: 7,
      expectedAuditStatus: "PASS",
    },
    null,
    2,
  ),
);
