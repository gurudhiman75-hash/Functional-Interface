import assert from "node:assert/strict";
import {
  buildAllLegacyEditorialLibraries,
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
} from "./foundation";

const [cp001, cp002, cp003] = buildAllLegacyEditorialLibraries();

const margin = cp001.entries["PNL-QL-016"];
const marginStem = renderStructuredStemMarkdown(margin.stem, { marginPercent: 20 });
const marginExplanation = renderFriendlyExplanationMarkdown(margin.explanation, { marginPercent: 20 });
assert.ok(marginStem.includes("20"));
assert.ok(marginExplanation.includes("**Key idea:**"));
assert.ok(marginExplanation.includes("selling price"));

const offerTable = cp002.entries["PNL-QL-065"];
const offerStem = renderStructuredStemMarkdown(offerTable.stem, {
  markedPrice: "12,000",
  selectedOffer: "B",
  offerTable: [
    ["A", "20% discount", "No second reduction"],
    ["B", "10% discount", "Additional 15% discount"],
  ],
});
assert.ok(offerStem.includes("| Offer | First reduction | Second reduction |"));
assert.ok(offerStem.includes("| B | 10% discount | Additional 15% discount |"));
assert.ok(!offerStem.includes("{offerTable}"));

const caselet = cp002.entries["PNL-QL-066"];
const caseletStem = renderStructuredStemMarkdown(caselet.stem, {
  caseletData: [
    "A retail chain purchases a backpack line for a seasonal campaign.",
    "The chain uses one markup policy and one customer discount across all branches.",
  ],
  costPrice: "2,000",
  markupPercent: 40,
  discountPercent: 20,
});
assert.ok(caseletStem.includes("Retail pricing caselet"));
assert.ok(caseletStem.includes("seasonal campaign"));
assert.ok(caseletStem.includes("₹2,000"));

const inventoryTable = cp003.entries["PNL-QL-088"];
const inventoryStem = renderStructuredStemMarkdown(inventoryTable.stem, {
  inventoryTable: [
    ["A", "40 units at ₹50", "20% profit"],
    ["B", "60 units at ₹40", "10% loss"],
  ],
});
assert.ok(inventoryStem.includes("| Group | Quantity and unit cost | Selling condition |"));
assert.ok(inventoryStem.includes("| A | 40 units at ₹50 | 20% profit |"));

const sufficiency = cp003.entries["PNL-QL-092"];
const sufficiencyStem = renderStructuredStemMarkdown(sufficiency.stem, {
  statementOne: "The total cost of the stock and the amount already recovered are known.",
  statementTwo: "The number of unsold units is known.",
});
assert.ok(sufficiencyStem.includes("**Statement 1:**"));
assert.ok(sufficiencyStem.includes("standard two-statement data-sufficiency"));

console.log(JSON.stringify({ ok: true, checked: ["PNL-QL-016", "PNL-QL-065", "PNL-QL-066", "PNL-QL-088", "PNL-QL-092"] }, null, 2));
