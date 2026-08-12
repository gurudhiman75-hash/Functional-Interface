import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityShellV2 } from "./banking-possibility-shell-v2";
import { generateBalancedBankingPossibilityShellV2 } from "./banking-possibility-shell-v2-balanced";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const positions: Record<string, number> = {};
let records = 0;

function increment(key: string): void {
  positions[key] = (positions[key] ?? 0) + 1;
}

for (const seed of seeds) {
  for (const locale of locales) {
    const base = generateBankingPossibilityShellV2(seed, locale);
    const balanced = generateBalancedBankingPossibilityShellV2(seed, locale);
    records += 1;

    assert.equal(balanced.correctIndex, Math.abs(seed) % 5);
    assert.equal(balanced.options[balanced.correctIndex]?.semanticValue, balanced.semanticAnswer);
    assert.equal(balanced.options.filter((entry) => entry.isCorrect).length, 1);

    assert.equal(balanced.authority, base.authority);
    assert.equal(balanced.prototypeId, base.prototypeId);
    assert.equal(balanced.seed, base.seed);
    assert.equal(balanced.locale, base.locale);
    assert.equal(balanced.scenarioId, base.scenarioId);
    assert.equal(balanced.scenarioGroup, base.scenarioGroup);
    assert.equal(balanced.sourcePatternId, base.sourcePatternId);
    assert.deepEqual(balanced.statements, base.statements);
    assert.deepEqual(balanced.conclusions, base.conclusions);
    assert.equal(balanced.semanticAnswer, base.semanticAnswer);
    assert.deepEqual(balanced.explanation, base.explanation);
    assert.deepEqual(balanced.metadata, base.metadata);

    const baseSemanticOptions = [...base.options].map((entry) => entry.semanticValue).sort();
    const balancedSemanticOptions = [...balanced.options].map((entry) => entry.semanticValue).sort();
    assert.deepEqual(balancedSemanticOptions, baseSemanticOptions);

    increment(String(balanced.correctIndex));
  }
}

assert.equal(records, 240);
for (let index = 0; index < 5; index += 1) {
  assert.equal(positions[String(index)], 48, `option index ${index} must occur exactly 48 times`);
}

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_V2_BALANCE",
  records,
  correctOptionPositions: positions,
  before: "69/39/51/39/42 on the prior 240-record V2 export",
  after: "48/48/48/48/48",
  semanticParityWithV2: true,
  activationPermitted: false,
}, null, 2));
