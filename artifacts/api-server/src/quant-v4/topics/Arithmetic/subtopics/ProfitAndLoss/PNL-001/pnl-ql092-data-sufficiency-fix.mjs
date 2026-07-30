import fs from "node:fs";
import path from "node:path";

const file = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-003/cp003-dynamic-cases.ts",
);
const source = fs.readFileSync(file, "utf8");

function replaceOnce(oldValue, newValue) {
  const first = source.indexOf(oldValue);
  if (first < 0) throw new Error(`QL-092 anchor not found: ${oldValue}`);
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`QL-092 anchor is not unique: ${oldValue}`);
  }
  return source.replace(oldValue, newValue);
}

const oldBlock = `      const complete = \`The dealer bought \${totalQuantity} units at \${cp003FormatMoney(unitCostPrice)} each and sold \${preset.sold} units at \${cp003FormatMoney(rupees(preset.soldPrice))} each.\`;\n      const purchaseOnly = \`The dealer bought \${totalQuantity} units at \${cp003FormatMoney(unitCostPrice)} each.\`;\n      const salesOnly = \`\${preset.sold} units were sold at \${cp003FormatMoney(rupees(preset.soldPrice))} each.\`;\n      const irrelevant = "The stock is stored in two warehouse sections.";`;
const newBlock = `      const totalPurchaseCost = moneyFromPaise(\n        totalQuantity * unitCostPrice.paise,\n      );\n      const soldRecovery = moneyFromPaise(\n        preset.sold * rupees(preset.soldPrice).paise,\n      );\n      const completeOne = \`The dealer bought \${totalQuantity} units at \${cp003FormatMoney(unitCostPrice)} each and sold \${preset.sold} units at \${cp003FormatMoney(rupees(preset.soldPrice))} each.\`;\n      const completeTwo = \`The stock has \${totalQuantity} units with total purchase cost \${cp003FormatMoney(totalPurchaseCost)}; selling \${preset.sold} units brought in \${cp003FormatMoney(soldRecovery)}.\`;\n      const purchaseOnly = \`The dealer bought \${totalQuantity} units at \${cp003FormatMoney(unitCostPrice)} each.\`;\n      const salesOnly = \`\${preset.sold} units were sold at \${cp003FormatMoney(rupees(preset.soldPrice))} each.\`;\n      const irrelevant = "The stock is stored in two warehouse sections.";`;
let updated = replaceOnce(oldBlock, newBlock);
updated = updated.replace(
  `          ? complete\n          : pattern === "BOTH"`,
  `          ? completeOne\n          : pattern === "BOTH"`,
);
updated = updated.replace(
  `          ? complete\n          : pattern === "BOTH"`,
  `          ? completeTwo\n          : pattern === "BOTH"`,
);
if (updated === source) throw new Error("QL-092 patch made no change.");
fs.writeFileSync(file, updated);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      qlId: "PNL-QL-092",
      eitherStatements: "DISTINCT_COMPLETE_FACT_SETS",
      targetSource: "DYNAMIC_CONTEXT",
    },
    null,
    2,
  ),
);
