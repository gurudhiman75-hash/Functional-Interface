import assert from "node:assert/strict";
import {
  buildAllNormalizedMultilingualEditorialLibraries,
  renderLocalizedFriendlyExplanationMarkdown,
  renderLocalizedStructuredStemMarkdown,
} from "./foundation";

const libraries = buildAllNormalizedMultilingualEditorialLibraries();
const byKey = new Map(libraries.map((library) => [`${library.cpId}:${library.language}`, library]));

const hindiCp2 = byKey.get("PNL-CP-002:hi");
const punjabiCp3 = byKey.get("PNL-CP-003:pa");
const hindiCp4 = byKey.get("PNL-CP-004:hi");
const punjabiCp6 = byKey.get("PNL-CP-006:pa");
assert.ok(hindiCp2 && punjabiCp3 && hindiCp4 && punjabiCp6);

const hindiOffer = hindiCp2.entries["PNL-QL-065"];
const hindiOfferStem = renderLocalizedStructuredStemMarkdown(hindiOffer.stem, "hi", {
  markedPrice: "12,000",
  selectedOffer: "B",
  offerTable: [
    ["A", "20% छूट", "दूसरी कटौती नहीं"],
    ["B", "10% छूट", "अतिरिक्त 15% छूट"],
  ],
});
assert.ok(hindiOfferStem.includes("| ऑफर | पहली छूट | दूसरी छूट |"));
assert.ok(hindiOfferStem.includes("| B | 10% छूट | अतिरिक्त 15% छूट |"));
assert.ok(!hindiOfferStem.includes("{offerTable}"));

const punjabiInventory = punjabiCp3.entries["PNL-QL-088"];
const punjabiInventoryStem = renderLocalizedStructuredStemMarkdown(punjabiInventory.stem, "pa", {
  inventoryTable: [
    ["A", "40 ਇਕਾਈਆਂ ₹50 ਪ੍ਰਤੀ ਇਕਾਈ", "20% ਲਾਭ"],
    ["B", "60 ਇਕਾਈਆਂ ₹40 ਪ੍ਰਤੀ ਇਕਾਈ", "10% ਹਾਨੀ"],
  ],
});
assert.ok(punjabiInventoryStem.includes("ਦਿੱਤੇ ਗਏ ਵਪਾਰਕ ਅੰਕੜੇ"));
assert.ok(punjabiInventoryStem.includes("40 ਇਕਾਈਆਂ"));
assert.ok(!punjabiInventoryStem.includes("{inventoryTable}"));

const hindiChain = hindiCp4.entries["PNL-QL-095"];
const hindiChainExplanation = renderLocalizedFriendlyExplanationMarkdown(hindiChain.explanation, "hi", {
  initialCostPrice: "10,000",
  finalSellingPrice: "10,800",
});
assert.ok(hindiChainExplanation.includes("**मुख्य विचार:**"));
assert.ok(hindiChainExplanation.includes("**चरण 1:"));
assert.ok(hindiChainExplanation.includes("**सामान्य गलती से बचें:**"));
assert.ok(!hindiChainExplanation.includes("**Key idea:**"));

const punjabiBreakEven = punjabiCp6.entries["PNL-QL-158"];
const punjabiBreakEvenExplanation = renderLocalizedFriendlyExplanationMarkdown(punjabiBreakEven.explanation, "pa", {
  breakEvenQuantity: 500,
});
assert.ok(punjabiBreakEvenExplanation.includes("**ਮੁੱਖ ਵਿਚਾਰ:**"));
assert.ok(punjabiBreakEvenExplanation.includes("**ਪੜਾਅ 1:"));
assert.ok(punjabiBreakEvenExplanation.includes("**ਆਮ ਗਲਤੀ ਤੋਂ ਬਚੋ:**"));
assert.ok(!punjabiBreakEvenExplanation.includes("**Conclusion:**"));

console.log(JSON.stringify({
  ok: true,
  checked: ["PNL-QL-065:hi", "PNL-QL-088:pa", "PNL-QL-095:hi", "PNL-QL-158:pa"],
}, null, 2));
