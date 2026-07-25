import assert from "node:assert/strict";
import { matchingClusterRules } from "../ANA-CP-006/independent-solver";
import { enabledPilotWords, type AnaCp007PilotWordRecord } from "./foundation/word-registry";
import { ANA_CP007_VOWELS } from "./foundation/word-structure";
import { independentlyApplyProvisionalWordRule } from "./provisional-independent-solver";
import {
  provisionalRuleById,
  provisionalWordContextKey,
  type ProvisionalWordRuleContext,
} from "./provisional-rule-definitions";

function classSignature(entry: AnaCp007PilotWordRecord): string {
  return [...entry.word]
    .map((letter) => ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U") ? "V" : "C")
    .join("");
}

function eligibleClassWord(entry: AnaCp007PilotWordRecord): boolean {
  if (entry.word.length < 4 || entry.word.length > 8) return false;
  if (entry.structure.vowels.length < 2 || entry.structure.consonants.length < 2) return false;
  const vowelParity = new Set(entry.structure.vowelPositions.map((position) => position % 2));
  const consonantParity = new Set(entry.structure.consonantPositions.map((position) => position % 2));
  return vowelParity.size > 1 || consonantParity.size > 1;
}

const rule = provisionalRuleById("WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT");
const contexts = rule.contexts.filter(
  (context): context is Extract<ProvisionalWordRuleContext, { kind: "CLASS_SHIFT" }> =>
    context.kind === "CLASS_SHIFT",
);
const words = enabledPilotWords().filter(eligibleClassWord);

interface CollisionSummary {
  contextKey: string;
  checkedPairs: number;
  cp006CollisionPairs: number;
  safePairs: number;
  competingRules: readonly string[];
}

const summaries: CollisionSummary[] = [];

for (const context of contexts) {
  let checkedPairs = 0;
  let cp006CollisionPairs = 0;
  let safePairs = 0;
  const competingRules = new Set<string>();

  outer:
  for (const source of words) {
    for (const target of words) {
      if (source.id === target.id || source.word.length !== target.word.length) continue;
      if (classSignature(source) === classSignature(target)) continue;

      const sourceOutput = independentlyApplyProvisionalWordRule(rule.id, context, source.word);
      const targetOutput = independentlyApplyProvisionalWordRule(rule.id, context, target.word);
      if (typeof sourceOutput !== "string" || typeof targetOutput !== "string") continue;
      checkedPairs += 1;

      const matches = matchingClusterRules([
        { left: source.word, right: sourceOutput },
        { left: target.word, right: targetOutput },
      ]);
      if (matches.length > 0) {
        cp006CollisionPairs += 1;
        for (const match of matches) competingRules.add(match.ruleId);
      } else {
        safePairs += 1;
      }

      if (checkedPairs >= 40) break outer;
    }
  }

  assert.ok(checkedPairs > 0, `${provisionalWordContextKey(context)} has no comparable same-length word pairs.`);
  assert.ok(safePairs > 0, `${provisionalWordContextKey(context)} has no pair that survives the CP-006 matcher.`);
  summaries.push({
    contextKey: provisionalWordContextKey(context),
    checkedPairs,
    cp006CollisionPairs,
    safePairs,
    competingRules: [...competingRules].sort(),
  });
}

const sourceContext: Extract<ProvisionalWordRuleContext, { kind: "CLASS_SHIFT" }> = {
  kind: "CLASS_SHIFT",
  vowelShift: 1,
  consonantShift: -1,
};
const januaryOutput = independentlyApplyProvisionalWordRule(rule.id, sourceContext, "JANUARY");
const octoberOutput = independentlyApplyProvisionalWordRule(rule.id, sourceContext, "OCTOBER");
assert.equal(januaryOutput, "IBMVBQX");
assert.equal(octoberOutput, "PBSPAFQ");
assert.deepEqual(
  matchingClusterRules([
    { left: "JANUARY", right: januaryOutput as string },
    { left: "OCTOBER", right: octoberOutput as string },
  ]),
  [],
  "The source-backed vowel/consonant analogy must not collapse into a CP-006 generic rule.",
);

console.log("ANA-CP-007 differential-shift CP-006 collision audit passed.", {
  contexts: summaries.length,
  pilotWords: words.length,
  checkedPairs: summaries.reduce((sum, entry) => sum + entry.checkedPairs, 0),
  cp006CollisionPairs: summaries.reduce((sum, entry) => sum + entry.cp006CollisionPairs, 0),
  safePairs: summaries.reduce((sum, entry) => sum + entry.safePairs, 0),
  weakestContexts: [...summaries]
    .sort((left, right) => left.safePairs - right.safePairs)
    .slice(0, 10),
});
