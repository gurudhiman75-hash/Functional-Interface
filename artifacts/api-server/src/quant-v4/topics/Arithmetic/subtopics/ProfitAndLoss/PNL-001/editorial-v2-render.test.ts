import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  calibrateDifficulty,
  loadEditorialLibrary,
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
} from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));
const cp004 = loadEditorialLibrary(join(root, "CP-004", "editorial-content.en.json"));
const cp005 = loadEditorialLibrary(join(root, "CP-005", "editorial-content.en.json"));
const cp006 = loadEditorialLibrary(join(root, "CP-006", "editorial-content.en.json"));

assert.equal(cp004.entryCount, 26);
assert.equal(cp005.entryCount, 29);
assert.equal(cp006.entryCount, 37);

const tableStem = renderStructuredStemMarkdown(cp004.entries["PNL-QL-115"].stem, {
  initialCostPrice: "8,000",
  transactionTable: [
    ["Trader A → Trader B", "+20%"],
    ["Trader B → Trader C", "−10%"],
    ["Trader C → Trader D", "+25%"],
  ],
});
assert.match(tableStem, /\| Transfer \| Profit\/Loss rate \|/);
assert.match(tableStem, /\| Trader A → Trader B \| \+20% \|/);
assert.doesNotMatch(tableStem, /\{transactionTable\}/);
assert.match(tableStem, /₹8,000/);

const caseletStem = renderStructuredStemMarkdown(cp004.entries["PNL-QL-116"].stem, {
  caseletData: [
    "A district distributor purchases a medical-equipment lot from the manufacturer.",
    "The lot then moves through two regional dealers before reaching the hospital supplier.",
  ],
  initialCostPrice: "50,000",
  stages: "manufacturer → distributor: 10% profit; distributor → dealer: 5% loss",
  selectedStage: "2",
});
assert.match(caseletStem, /Distribution caselet/);
assert.match(caseletStem, /district distributor/);
assert.match(caseletStem, /transaction 2/);
assert.doesNotMatch(caseletStem, /\{caseletData\}/);

const explanation = renderFriendlyExplanationMarkdown(cp004.entries["PNL-QL-097"].explanation, {
  initialCostPrice: "10,000",
});
assert.match(explanation, /\*\*Key idea:\*\*/);
assert.match(explanation, /\*\*Step 1:/);
assert.match(explanation, /\*\*Common mistake to avoid:\*\*/);
assert.match(explanation, /\\boxed\{\\text\{₹\}10,000\}/);

const lossRecovery = renderFriendlyExplanationMarkdown(cp006.entries["PNL-QL-179"].explanation, {
  lossPercent: "20",
  requiredProfitPercent: "25",
});
assert.match(lossRecovery, /smaller base/i);
assert.match(lossRecovery, /25\\%/);

const schemeTable = renderStructuredStemMarkdown(cp005.entries["PNL-QL-145"].stem, {
  schemeTable: [
    ["A", "10% price increase", "5% short delivery"],
    ["B", "Price unchanged", "12% short delivery"],
  ],
});
assert.match(schemeTable, /Price and quantity schemes/);
assert.match(schemeTable, /\| A \| 10% price increase \| 5% short delivery \|/);

const visibleForward = calibrateDifficulty({
  signals: ["TWO_OR_THREE_VISIBLE_STEPS"],
  arithmeticBurden: "MODERATE",
});
assert.equal(visibleForward.difficulty, "Medium");

const coupledInverse = calibrateDifficulty({
  signals: ["COUPLED_INVERSE", "MULTIPLE_CONSTRAINTS"],
  arithmeticBurden: "MODERATE",
});
assert.equal(coupledInverse.difficulty, "Hard");

console.log(JSON.stringify({
  ok: true,
  tableRendered: true,
  caseletRendered: true,
  friendlyExplanationRendered: true,
  difficultyCalibrationChecked: true,
}, null, 2));
