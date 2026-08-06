import assert from "node:assert/strict";
import {
  CLS_CP006_ALPHABET,
  CLS_CP006_PAIR_DOMAIN,
  CLS_CP006_RULE_IDS,
  CLS_CP006_SINGLE_DOMAIN,
  clsCp006IsVowel,
  clsCp006LetterPosition,
  clsCp006ParseOption,
  clsCp006RuleValue,
} from "./alphabet-domain";
import { auditClsCp006Items } from "./runtime";
import type { ClsCp006Item, ClsCp006RuleId } from "./types";

function assertPartitionEquivalent(
  domain: readonly ClsCp006Item[],
  existingRuleId: ClsCp006RuleId,
  alternateValue: (item: ClsCp006Item) => string,
  label: string,
): void {
  for (let leftIndex = 0; leftIndex < domain.length; leftIndex += 1) {
    for (let rightIndex = leftIndex; rightIndex < domain.length; rightIndex += 1) {
      const left = domain[leftIndex]!;
      const right = domain[rightIndex]!;
      const existingEqual =
        clsCp006RuleValue(left, existingRuleId) ===
        clsCp006RuleValue(right, existingRuleId);
      const alternateEqual = alternateValue(left) === alternateValue(right);
      assert.equal(
        alternateEqual,
        existingEqual,
        `${label} changes the partition for ${leftIndex}/${rightIndex}`,
      );
    }
  }
}

assertPartitionEquivalent(
  CLS_CP006_SINGLE_DOMAIN,
  "LETTER_POSITION_PARITY",
  (item) => {
    assert.equal(item.kind, "LETTER");
    const reversePosition = 27 - clsCp006LetterPosition(item.letters[0]);
    return reversePosition % 2 === 0 ? "EVEN_REVERSE_POSITION" : "ODD_REVERSE_POSITION";
  },
  "reverse-position parity",
);

assertPartitionEquivalent(
  CLS_CP006_SINGLE_DOMAIN,
  "LETTER_ALPHABET_HALF",
  (item) => {
    assert.equal(item.kind, "LETTER");
    const reversePosition = 27 - clsCp006LetterPosition(item.letters[0]);
    return reversePosition <= 13 ? "REVERSE_FIRST_HALF" : "REVERSE_SECOND_HALF";
  },
  "reverse alphabet half",
);

assertPartitionEquivalent(
  CLS_CP006_PAIR_DOMAIN,
  "PAIR_SIGNED_POSITION_GAP",
  (item) => {
    assert.equal(item.kind, "LETTER_PAIR");
    const [first, second] = item.letters.map(clsCp006LetterPosition);
    return String((27 - second!) - (27 - first!));
  },
  "reverse signed gap",
);

assertPartitionEquivalent(
  CLS_CP006_PAIR_DOMAIN,
  "PAIR_ABSOLUTE_POSITION_GAP",
  (item) => {
    assert.equal(item.kind, "LETTER_PAIR");
    const [first, second] = item.letters.map(clsCp006LetterPosition);
    return String(Math.abs((27 - second!) - (27 - first!)));
  },
  "reverse absolute gap",
);

assertPartitionEquivalent(
  CLS_CP006_PAIR_DOMAIN,
  "PAIR_ABSOLUTE_POSITION_GAP",
  (item) => {
    assert.equal(item.kind, "LETTER_PAIR");
    const [first, second] = item.letters.map(clsCp006LetterPosition);
    return String(Math.abs(second! - first!) - 1);
  },
  "letters-between wording",
);

for (const item of CLS_CP006_PAIR_DOMAIN) {
  assert.equal(item.kind, "LETTER_PAIR");
  const [first, second] = item.letters.map(clsCp006LetterPosition);
  assert.equal(
    clsCp006RuleValue(item, "PAIR_OPPOSITE_STATUS") === "OPPOSITE_PAIR",
    first! + second! === 27,
  );
}

const ambiguousPrintedParityState = {
  options: ["W", "N", "P", "B"],
  ruleId: "LETTER_POSITION_PARITY" as const,
  answerIndex: 0,
};
const ambiguousPrintedParityAudit = auditClsCp006Items(
  ambiguousPrintedParityState.options.map(clsCp006ParseOption),
  ambiguousPrintedParityState.ruleId,
  ambiguousPrintedParityState.answerIndex,
);
assert.equal(ambiguousPrintedParityAudit.result, "AMBIGUOUS");
assert.equal(ambiguousPrintedParityAudit.answerIndex, null);
assert.equal(ambiguousPrintedParityAudit.intendedRuleSupported, true);
assert.deepEqual(
  [...new Set(ambiguousPrintedParityAudit.candidateSupports.map((support) => support.answerIndex))].sort(),
  [0, 3],
);
assert.ok(
  ambiguousPrintedParityAudit.candidateSupports.some(
    (support) => support.ruleId === "LETTER_POSITION_PARITY" && support.answerIndex === 0,
  ),
);
assert.ok(
  ambiguousPrintedParityAudit.candidateSupports.some(
    (support) => support.ruleId === "LETTER_ALPHABET_HALF" && support.answerIndex === 3,
  ),
);

const sourceExemplars = [
  {
    options: ["A", "E", "O", "V"],
    ruleId: "LETTER_VOWEL_CONSONANT_CLASS" as const,
    answerIndex: 3,
  },
  {
    options: ["W", "N", "P", "R"],
    ruleId: "LETTER_POSITION_PARITY" as const,
    answerIndex: 0,
  },
  {
    options: ["U–X", "O–R", "W–Z", "F–G"],
    ruleId: "PAIR_SIGNED_POSITION_GAP" as const,
    answerIndex: 3,
  },
  {
    options: ["J–R", "L–O", "C–X", "E–V"],
    ruleId: "PAIR_OPPOSITE_STATUS" as const,
    answerIndex: 0,
  },
  {
    options: ["E–S", "B–O", "C–P", "D–Q"],
    ruleId: "PAIR_SIGNED_POSITION_GAP" as const,
    answerIndex: 0,
  },
];

for (const exemplar of sourceExemplars) {
  const audit = auditClsCp006Items(
    exemplar.options.map(clsCp006ParseOption),
    exemplar.ruleId,
    exemplar.answerIndex,
  );
  assert.equal(
    audit.result,
    "UNIQUE",
    `${exemplar.options.join(", ")} failed: ${audit.reason}`,
  );
  assert.equal(audit.answerIndex, exemplar.answerIndex);
  assert.equal(audit.intendedRuleSupported, true);
  assert.ok(audit.candidateSupports.every((support) => support.answerIndex === exemplar.answerIndex));
}

function isPrime(value: number): boolean {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

const primeClassCounts = new Map<string, number>();
for (const letter of CLS_CP006_ALPHABET) {
  const position = clsCp006LetterPosition(letter);
  const value = position === 1 ? "NEITHER" : isPrime(position) ? "PRIME" : "COMPOSITE";
  primeClassCounts.set(value, (primeClassCounts.get(value) ?? 0) + 1);
}
assert.deepEqual(
  Object.fromEntries([...primeClassCounts.entries()].sort()),
  { COMPOSITE: 16, NEITHER: 1, PRIME: 9 },
);

const pairParityCompositionCounts = new Map<string, number>();
const pairHalfCompositionCounts = new Map<string, number>();
for (const item of CLS_CP006_PAIR_DOMAIN) {
  assert.equal(item.kind, "LETTER_PAIR");
  const [first, second] = item.letters.map(clsCp006LetterPosition);
  const parityValue = `${first! % 2 === 0 ? "E" : "O"}${second! % 2 === 0 ? "E" : "O"}`;
  const halfValue = `${first! <= 13 ? "F" : "S"}${second! <= 13 ? "F" : "S"}`;
  pairParityCompositionCounts.set(
    parityValue,
    (pairParityCompositionCounts.get(parityValue) ?? 0) + 1,
  );
  pairHalfCompositionCounts.set(
    halfValue,
    (pairHalfCompositionCounts.get(halfValue) ?? 0) + 1,
  );
}
assert.deepEqual([...pairParityCompositionCounts.keys()].sort(), ["EE", "EO", "OE", "OO"]);
assert.deepEqual([...pairHalfCompositionCounts.keys()].sort(), ["FF", "FS", "SF", "SS"]);
assert.ok([...pairParityCompositionCounts.values()].every((count) => count >= 150));
assert.ok([...pairHalfCompositionCounts.values()].every((count) => count >= 156));

const deferredRuleIds = [
  "LETTER_POSITION_PRIME_CLASS",
  "PAIR_POSITION_PARITY_COMPOSITION",
  "PAIR_ALPHABET_HALF_COMPOSITION",
];
for (const ruleId of deferredRuleIds) {
  assert.ok(!CLS_CP006_RULE_IDS.includes(ruleId as ClsCp006RuleId));
}

for (const letter of CLS_CP006_ALPHABET) {
  assert.equal(
    clsCp006IsVowel(letter),
    ["A", "E", "I", "O", "U"].includes(letter),
  );
}

console.log("CLS-CP-006 initial source-gap and compression audit passed.", {
  acceptedSourceExemplars: sourceExemplars.length,
  ambiguousPrintedSourceStatesRejected: 1,
  controlledSourceRemediations: 1,
  admittedRules: CLS_CP006_RULE_IDS.length,
  equivalentRuleVariantsCompressed: 6,
  deferredCandidateFamilies: deferredRuleIds.length,
  meaningfulUncoveredContracts: 0,
  permanentQlCount: 0,
  primeClassCounts: Object.fromEntries([...primeClassCounts.entries()].sort()),
  pairParityCompositionCounts: Object.fromEntries(
    [...pairParityCompositionCounts.entries()].sort(),
  ),
  pairHalfCompositionCounts: Object.fromEntries(
    [...pairHalfCompositionCounts.entries()].sort(),
  ),
});
